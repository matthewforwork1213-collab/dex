# 헤더 메뉴(드롭다운·프로필·햄버거) 안 항목을 하나씩 눌러 이동 주소를 모은다 (회원 세션)
# python -I discover.py <state.json> <out.txt>
import sys, json, re, time
sys.stdout.reconfigure(encoding="utf-8")
from playwright.sync_api import sync_playwright
STATE, OUT = sys.argv[1], sys.argv[2]
BLOCK = re.compile(r'log ?out|sign ?out|withdraw|delete|remove|unlink|leave|confirm|submit|claim|redeem|purchase|copy|live chat|chat|dark|light|theme', re.I)
ORIGIN = 'https://tethermax.io'
found = {}

JS_ITEMS = r'''(before) => {
  const vis = el => { const r = el.getBoundingClientRect(); const s = getComputedStyle(el); return r.width > 2 && r.height > 2 && s.visibility !== 'hidden' && s.display !== 'none' && +s.opacity > 0.05 };
  const lab = el => (el.innerText || el.getAttribute('aria-label') || '').trim().replace(/\s+/g, ' ').slice(0, 50);
  const out = [];
  document.querySelectorAll('a[href],button,[role=menuitem],[role=button],li[tabindex],[class*=menu] div[class*=item],[class*=Menu] div[class*=Item]').forEach(el => {
    if (!vis(el)) return; const l = lab(el); if (!l) return;
    const key = l + '|' + (el.getAttribute('href') || '');
    if (before.includes(key)) return;
    out.push({ key, label: l, href: el.getAttribute('href') });
  });
  return out;
}'''
JS_KEYS = JS_ITEMS.replace('if (before.includes(key)) return;', '')

def items(pg, before=None):
    return pg.evaluate(JS_ITEMS, before or [])

def open_menu(pg, opener):
    el = pg.locator(opener).first
    el.hover(timeout=4000); pg.wait_for_timeout(600)
    now = items(pg, BASE[0])
    if not now:
        el.click(timeout=4000); pg.wait_for_timeout(900)
        now = items(pg, BASE[0])
    return now

with sync_playwright() as p:
    br = p.chromium.launch()
    ctx = br.new_context(storage_state=STATE)
    for vp, (w, h) in {'pc': (1440, 900), 'mo': (390, 844)}.items():
        pg = ctx.new_page(); pg.set_viewport_size({'width': w, 'height': h})
        def home():
            pg.goto(ORIGIN + '/en', wait_until='domcontentloaded', timeout=45000); pg.wait_for_timeout(5000)
        home()
        BASE = [[x['key'] for x in pg.evaluate(JS_KEYS, [])]]
        openers = pg.evaluate(r'''() => [...document.querySelectorAll('header button,header [role=button],header [aria-haspopup]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 }).map((e, i) => { e.setAttribute('data-op', String(i)); return { i, label: (e.innerText || e.getAttribute('aria-label') || e.className || '').toString().trim().slice(0, 40) } })''')
        print(vp, 'openers', [o['label'] for o in openers], flush=True)
        for o in openers:
            sel = f'[data-op="{o["i"]}"]'
            if BLOCK.search(o['label']): continue
            try:
                menu = open_menu(pg, sel)
            except Exception as e:
                print(' open fail', o['label'], str(e)[:80]); home(); continue
            print(' menu', o['label'][:30], '->', [m['label'] for m in menu][:40], flush=True)
            for m in menu:
                if BLOCK.search(m['label']): continue
                if m['href']:
                    found[m['href'] if m['href'].startswith('http') else ORIGIN + m['href']] = f'{vp}:{o["label"][:20]}>{m["label"]}'
                    continue
                try:
                    home()
                    pg.evaluate(r'''() => [...document.querySelectorAll('header button,header [role=button],header [aria-haspopup]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 }).forEach((e, i) => e.setAttribute('data-op', String(i)))''')
                    open_menu(pg, sel)
                    before = pg.url
                    target = pg.get_by_text(m['label'], exact=True).filter(visible=True).last
                except Exception as e:
                    print('  item fail', m['label'], str(e)[:80]); continue
                try:
                    pages_before = len(ctx.pages)
                    target.click(timeout=4000); pg.wait_for_timeout(2500)
                    if len(ctx.pages) > pages_before:
                        np = ctx.pages[-1]; found[np.url] = f'{vp}:{o["label"][:20]}>{m["label"]} (new tab)'; np.close()
                    elif pg.url != before:
                        found[pg.url] = f'{vp}:{o["label"][:20]}>{m["label"]}'
                    print('  ', m['label'], '->', pg.url, flush=True)
                except Exception as e:
                    print('  click fail', m['label'], str(e)[:80])
            home()
            pg.evaluate(r'''() => [...document.querySelectorAll('header button,header [role=button],header [aria-haspopup]')].filter(e => { const r = e.getBoundingClientRect(); return r.width > 2 && r.height > 2 }).forEach((e, i) => e.setAttribute('data-op', String(i)))''')
        pg.close()
    br.close()
json.dump(found, open(OUT, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('FOUND', len(found))
