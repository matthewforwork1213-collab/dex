# tethermax.io 수집기 2 — 페이지 스냅숏 + 버튼 상호작용(이동·오버레이·화면 변화)
# python -I crawl2.py <guest|member> <out_dir> [seed_file|-] [max_pages] [--headed]
# member: out_dir/../_profile 영구 프로필(로그인된 세션)을 쓴다.
# 안전: member 모드에서는 실제 처리를 일으킬 수 있는 라벨(BLOCK)을 누르지 않고, 열린 오버레이 안의 버튼은 절대 누르지 않는다.
import sys, json, re, time, pathlib, hashlib
from urllib.parse import urlparse, unquote
from playwright.sync_api import sync_playwright

mode, out = sys.argv[1], pathlib.Path(sys.argv[2])
seed_file = sys.argv[3] if len(sys.argv) > 3 and sys.argv[3] != '-' else None
max_pages = int(sys.argv[4]) if len(sys.argv) > 4 else 400
headed = '--headed' in sys.argv
for d in ('pages', 'frags'): (out / d).mkdir(parents=True, exist_ok=True)
ORIGIN = 'https://tethermax.io'
VPS = {'pc': (1440, 900), 'mo': (390, 844)}
BLOCK = re.compile(r'log ?out|sign ?out|withdraw|delete|remove|unlink|disconnect|leave|confirm|submit|claim|apply|save|send|transfer|redeem|purchase|buy|participate|vote|spin|play|open|accept|agree|verify|cancel|deactivate|report|like|post|comment|reply|follow|subscribe|unsubscribe|change|update|reset|register|enter|check.?in|collect|receive|get reward|use|exchange now|copy|live chat|chat', re.I)
SKIP_ALWAYS = re.compile(r'live chat|^copy|copied', re.I)
TEMPLATES = [r'^en__exchangeDetail__', r'^en__brokers__(?!compare$|learn$)', r'^en__beginner-guide__']

PREP = r'''
window.__ptAbs = u => { try { return new URL(u, location.href).href } catch(e) { return u } };
window.__ptPrep = (root) => {
  const abs = window.__ptAbs;
  root.querySelectorAll('script,noscript,link[rel=preload],link[rel=modulepreload],link[rel=prefetch],link[rel=dns-prefetch],link[rel=preconnect],link[rel=stylesheet],style,iframe,next-route-announcer,template').forEach(e => e.remove());
  root.querySelectorAll('img').forEach(i => { const live = i.getAttribute('data-pt-cur') || i.getAttribute('src'); if (live) i.setAttribute('src', abs(live)); ['srcset','sizes','loading','decoding','data-pt-cur'].forEach(a => i.removeAttribute(a)) });
  root.querySelectorAll('source').forEach(s => { const ss = s.getAttribute('srcset'); if (ss) s.setAttribute('srcset', ss.split(',').map(p => { const [u, d] = p.trim().split(/\s+/); return abs(u) + (d ? ' ' + d : '') }).join(', ')) });
  root.querySelectorAll('video,audio').forEach(v => { ['src','poster'].forEach(a => v.getAttribute(a) && v.setAttribute(a, abs(v.getAttribute(a)))); v.removeAttribute('autoplay') });
  root.querySelectorAll('[style*="url("]').forEach(e => e.setAttribute('style', e.getAttribute('style').replace(/url\((['"]?)([^'")]+)\1\)/g, (m, q, u) => u.startsWith('data:') ? m : `url("${abs(u)}")`)));
  root.querySelectorAll('svg image[href],svg use[href]').forEach(e => { const h = e.getAttribute('href'); if (h && !h.startsWith('#')) e.setAttribute('href', abs(h)) });
  const links = [];
  root.querySelectorAll('a[href]').forEach(a => { const h = abs(a.getAttribute('href')); a.setAttribute('data-orig-href', h); links.push(h) });
  return links;
};
window.__ptLive = () => {
  // 원본 DOM에서 현재 값을 속성으로 옮긴다(클론 전에)
  document.querySelectorAll('input').forEach(i => { if (i.type === 'checkbox' || i.type === 'radio') { i.checked ? i.setAttribute('checked', '') : i.removeAttribute('checked') } else i.setAttribute('value', i.value) });
  document.querySelectorAll('textarea').forEach(t => t.textContent = t.value);
  document.querySelectorAll('img').forEach(i => { if (i.currentSrc) i.setAttribute('data-pt-cur', i.currentSrc) });
  document.querySelectorAll('canvas').forEach(c => { try { const img = document.createElement('img'); img.src = c.toDataURL(); img.style.cssText = c.style.cssText; img.width = c.width; img.height = c.height; img.className = c.className; c.replaceWith(img) } catch(e) {} });
};
window.__ptRules = () => { const r = []; for (const s of document.styleSheets) { const n = s.ownerNode; if (n && n.tagName === 'STYLE') { try { for (const x of s.cssRules) r.push(x.cssText) } catch(e) { r.push(n.textContent) } } } return r };
window.__ptVisible = el => { const r = el.getBoundingClientRect(); if (r.width < 2 || r.height < 2) return false; const st = getComputedStyle(el); return st.visibility !== 'hidden' && st.display !== 'none' && +st.opacity !== 0 };
window.__ptLabel = el => {
  let l = (el.innerText || el.getAttribute('aria-label') || el.getAttribute('title') || '').trim().replace(/\s+/g, ' ').slice(0, 60);
  if (!l) { const img = el.querySelector('img[alt]'); if (img && img.alt) l = '[img:' + img.alt.slice(0, 30) + ']' }
  if (!l) { const c = [...el.classList].find(c => !/^(Mui|css-)/.test(c)); l = '[icon' + (c ? ':' + c.replace(/_[A-Za-z0-9]{5,}$/, '') : '') + ']' }
  return l;
};
window.__ptTag = (scope) => {
  const root = scope || document;
  const out = [], cnt = {};
  const sel = 'button,[role=button],[role=tab],[role=combobox],[aria-haspopup],summary';
  for (const el of root.querySelectorAll(sel)) {
    if (el.closest('a[href]') || el.parentElement && el.parentElement.closest(sel)) continue;
    if (!window.__ptVisible(el) || el.disabled || el.getAttribute('aria-disabled') === 'true') continue;
    const label = window.__ptLabel(el);
    const n = cnt[label] || 0; cnt[label] = n + 1;
    const sig = label + '#' + n;
    el.setAttribute('data-pt-sig', sig);
    out.push({ sig, label, global: !!el.closest('header,footer'), role: el.getAttribute('role') || el.tagName.toLowerCase() });
  }
  return out;
};
window.__ptSerialize = () => {
  window.__ptLive();
  const rules = window.__ptRules();
  const linkCss = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => window.__ptAbs(l.getAttribute('href')));
  const root = document.documentElement.cloneNode(true);
  const links = window.__ptPrep(root);
  return { html: root.outerHTML, rules, linkCss, links, title: document.title, height: document.documentElement.scrollHeight };
};
window.__ptMarkBase = () => { [...document.body.children].forEach(c => c.setAttribute('data-pt-base', '1')); return document.body.innerText.length + ':' + document.body.innerText.slice(0, 4000) };
window.__ptNewLayer = () => {
  const fresh = [...document.body.children].filter(c => !c.hasAttribute('data-pt-base') && c.tagName !== 'SCRIPT' && c.tagName !== 'STYLE' && (window.__ptVisible(c) || [...c.querySelectorAll('*')].some(window.__ptVisible)));
  if (!fresh.length) return null;
  window.__ptLive();
  const holder = document.createElement('div');
  fresh.forEach(c => holder.appendChild(c.cloneNode(true)));
  const links = window.__ptPrep(holder);
  const inner = [];
  fresh.forEach(c => c.querySelectorAll('button,[role=button],[role=menuitem],[role=tab],a[href]').forEach(b => { if (window.__ptVisible(b)) inner.push({ label: window.__ptLabel(b), href: b.getAttribute('href') ? window.__ptAbs(b.getAttribute('href')) : null }) }));
  return { html: holder.innerHTML, rules: window.__ptRules(), links, inner, text: holder.innerText.slice(0, 300) };
};
'''

def norm(u):
    try: p = urlparse(u)
    except Exception: return None
    if p.scheme not in ('http', 'https', ''): return None
    if p.netloc and p.netloc != 'tethermax.io': return None
    path = unquote(p.path).rstrip('/') or '/'
    if not path.startswith('/en'): return None
    if re.search(r'\.(png|jpe?g|webp|svg|pdf|ico|xml|txt)$', path, re.I): return None
    q = p.query if p.query and not re.search(r'inviteCode|code=|token|redirect', p.query) else ''
    return ORIGIN + path + ('?' + q if q else '')

def slug(u):
    p = urlparse(u)
    s = unquote(p.path).strip('/').replace('/', '__').replace(' ', '-') or 'root'
    if p.query: s += '__q' + hashlib.md5(p.query.encode()).hexdigest()[:6]
    return re.sub(r'[^\w\-.]', '_', s)

def template_of(key):
    for t in TEMPLATES:
        if re.search(t, key): return t
    return None

def settle(pg, full=True):
    try: pg.wait_for_load_state('networkidle', timeout=15000 if mode == 'guest' else 4000)
    except Exception: pass
    if full:
        h = pg.evaluate('document.documentElement.scrollHeight'); y = 0
        while y < h and y < 40000:
            y += 600; pg.evaluate(f'window.scrollTo(0,{y})'); pg.wait_for_timeout(110)
            h = pg.evaluate('document.documentElement.scrollHeight')
        pg.wait_for_timeout(700); pg.evaluate('window.scrollTo(0,0)')
    pg.wait_for_timeout(500 if mode == 'guest' else 2500)
    try: pg.wait_for_load_state('networkidle', timeout=6000 if mode == 'guest' else 2500)
    except Exception: pass

def h6(s): return hashlib.md5(s.encode()).hexdigest()[:8]

def main():
    idx_path = out / 'index.json'; act_path = out / 'actions.json'
    index = json.loads(idx_path.read_text('utf-8')) if idx_path.exists() else {}
    actions = json.loads(act_path.read_text('utf-8')) if act_path.exists() else {'_global': {'pc': {}, 'mo': {}}, '_tpl': {}}
    def save():
        idx_path.write_text(json.dumps(index, ensure_ascii=False, indent=1), 'utf-8')
        act_path.write_text(json.dumps(actions, ensure_ascii=False, indent=1), 'utf-8')
    with sync_playwright() as p:
        state_file = out.parent / '_member_state.json'
        if mode == 'member':
            br = p.chromium.launch(headless=not headed)
            ctx = br.new_context(viewport={'width': 1440, 'height': 900}, storage_state=str(state_file) if state_file.exists() and '--relogin' not in sys.argv else None)
            if not state_file.exists() or '--relogin' in sys.argv:
                lp = ctx.new_page(); lp.goto(ORIGIN + '/en/login')
                print('LOGIN_WAIT', flush=True)
                while not (out / 'GO').exists(): time.sleep(2)
                ctx.storage_state(path=str(state_file)); print('STATE_SAVED', flush=True)
        else:
            br = p.chromium.launch(headless=not headed); ctx = br.new_context(viewport={'width': 1440, 'height': 900})
        ctx.add_init_script(PREP)
        pg = ctx.pages[0] if ctx.pages else ctx.new_page()
        popups = []
        ctx.on('page', lambda np: popups.append(np))
        pg.on('dialog', lambda d: d.dismiss())
        seeds = ([] if '--no-home' in sys.argv else [ORIGIN + '/en']) + ([l.strip() for l in open(seed_file, encoding='utf-8') if l.strip()] if seed_file else [])
        queue, seen = [], set()
        def enq(u):
            n = norm(u)
            if n and n not in seen: seen.add(n); queue.append(n)
        for a in sys.argv:
            if a.startswith('--skip-index='):
                for r in json.loads(pathlib.Path(a.split('=',1)[1]).read_text('utf-8')).values(): seen.add(r['url'])
        for s in seeds: enq(s)
        tpl_done = set(); done = 0
        while queue and done < max_pages:
            url = queue.pop(0); key = slug(url); tpl = template_of(key)
            rec = index.get(key, {'url': url, 'key': key, 'vp': {}})
            rec['url'] = url; rec['tpl'] = tpl
            page_acts = actions.setdefault(key, {'pc': {}, 'mo': {}})
            for vp, (w, hh) in VPS.items():
                try:
                    pg.set_viewport_size({'width': w, 'height': hh})
                    resp = pg.goto(url, wait_until='domcontentloaded', timeout=45000)
                    settle(pg)
                    final = pg.url
                    cands = pg.evaluate('window.__ptTag()')
                    d = pg.evaluate('window.__ptSerialize()')
                    (out / 'pages' / f'{key}.{vp}.json').write_text(json.dumps(d, ensure_ascii=False), 'utf-8')
                    for l in d['links']: enq(l)
                    rec['vp'][vp] = {'final': final, 'redirected': norm(final) != url, 'status': resp.status if resp else None, 'title': d['title'], 'height': d['height'], 'cands': cands}
                    base_rules = set(d['rules'])
                    if norm(final) != url:  # 로그인 필요 등으로 리다이렉트 → 상호작용 생략
                        continue
                    if tpl and (tpl, vp) in tpl_done:
                        continue
                    dirty = False
                    for c in cands:
                        sig, label = c['sig'], c['label']
                        bucket = actions['_global'][vp] if c['global'] else page_acts[vp]
                        if sig in bucket: continue
                        if SKIP_ALWAYS.search(label) or (mode == 'member' and BLOCK.search(label)):
                            bucket[sig] = {'type': 'skip', 'label': label}; continue
                        try:
                            if dirty:
                                pg.goto(url, wait_until='domcontentloaded', timeout=45000); settle(pg, full=False)
                                pg.evaluate('window.__ptTag()'); dirty = False
                            before_url = pg.url
                            base_txt = pg.evaluate('window.__ptMarkBase()')
                            popups.clear()
                            el = pg.evaluate_handle('s => [...document.querySelectorAll("[data-pt-sig]")].find(e => e.getAttribute("data-pt-sig") === s)', sig).as_element()
                            if not el: bucket[sig] = {'type': 'missing', 'label': label}; continue
                            el.scroll_into_view_if_needed(timeout=3000)
                            el.click(timeout=4000)
                            pg.wait_for_timeout(1300)
                            if popups:
                                np = popups[0]
                                try: np.wait_for_load_state('domcontentloaded', timeout=8000)
                                except Exception: pass
                                bucket[sig] = {'type': 'ext', 'label': label, 'url': np.url}
                                for x in popups: x.close()
                                popups.clear()
                            elif pg.url != before_url:
                                n = norm(pg.url)
                                bucket[sig] = {'type': 'nav', 'label': label, 'url': n or pg.url}
                                if n: enq(n)
                                dirty = True
                            else:
                                layer = pg.evaluate('window.__ptNewLayer()')
                                if layer:
                                    fid = f'{key}.{vp}.{h6(sig)}'
                                    layer['rules'] = [r for r in layer['rules'] if r not in base_rules]
                                    (out / 'frags' / f'{fid}.json').write_text(json.dumps(layer, ensure_ascii=False), 'utf-8')
                                    bucket[sig] = {'type': 'overlay', 'label': label, 'frag': fid, 'text': layer['text'][:120], 'inner': layer['inner'][:40]}
                                    for l in layer['links']: enq(l)
                                    dirty = True
                                else:
                                    now_txt = pg.evaluate('document.body.innerText.length + ":" + document.body.innerText.slice(0,4000)')
                                    if now_txt != base_txt:
                                        sid = f'{key}.{vp}.s-{h6(sig)}'
                                        sd = pg.evaluate('window.__ptSerialize()')
                                        (out / 'pages' / f'{sid}.json').write_text(json.dumps(sd, ensure_ascii=False), 'utf-8')
                                        for l in sd['links']: enq(l)
                                        bucket[sig] = {'type': 'state', 'label': label, 'snap': sid}
                                        dirty = True
                                    else:
                                        bucket[sig] = {'type': 'none', 'label': label}
                        except Exception as e:
                            bucket[sig] = {'type': 'error', 'label': label, 'err': str(e)[:160]}; dirty = True
                    if tpl:
                        tpl_done.add((tpl, vp)); actions['_tpl'].setdefault(tpl, {})[vp] = key
                except Exception as e:
                    rec['vp'][vp] = {'error': str(e)[:300]}
            index[key] = rec; done += 1; save()
            n_act = sum(len(v) for v in page_acts.values())
            print(f'[{done}] {key} pc={rec["vp"].get("pc", {}).get("status")} mo={rec["vp"].get("mo", {}).get("status")} acts={n_act} q={len(queue)}', flush=True)
        (out / 'remaining.txt').write_text('\n'.join(queue), 'utf-8')
        print('DONE', done, 'remaining', len(queue), flush=True)
        ctx.close()

main()
