# 메뉴를 연 뒤 메뉴 항목을 눌러 열리는 모달을 조각으로 뜬다 → actions['_label'][vp][라벨]
# python -I capture_label.py <state.json> <out_dir>
import sys, json, re, pathlib, hashlib
sys.stdout.reconfigure(encoding='utf-8')
from playwright.sync_api import sync_playwright
STATE, out = sys.argv[1], pathlib.Path(sys.argv[2])
(out / 'frags').mkdir(parents=True, exist_ok=True)
src = (pathlib.Path(__file__).parent / 'crawl2.py').read_text('utf-8')
PREP = re.search(r"PREP = r'''(.*?)'''", src, re.S).group(1)
ORIGIN = 'https://tethermax.io'
# (뷰포트, 메뉴 여는 버튼 선택자, 누를 항목 라벨들)
JOBS = [('pc', 'header button[class*="__UserInfo"]', ['Account Security', 'Notification Settings'])]
acts = {'_label': {'pc': {}, 'mo': {}}}
with sync_playwright() as p:
    br = p.chromium.launch(); ctx = br.new_context(storage_state=STATE); ctx.add_init_script(PREP)
    pg = ctx.new_page()
    for vp, opener, labels in JOBS:
        pg.set_viewport_size({'width': 1440, 'height': 900} if vp == 'pc' else {'width': 390, 'height': 844})
        for lab in labels:
            pg.goto(ORIGIN + '/en', wait_until='domcontentloaded', timeout=45000); pg.wait_for_timeout(5000)
            base_rules = set(pg.evaluate('window.__ptRules()'))
            op = pg.locator(opener).filter(visible=True).first
            op.click(timeout=5000); pg.wait_for_timeout(1200)
            pg.evaluate('window.__ptMarkBase()')
            pg.get_by_text(lab, exact=True).filter(visible=True).last.click(timeout=5000); pg.wait_for_timeout(2000)
            layer = pg.evaluate('window.__ptNewLayer()')
            if not layer:
                if pg.url.rstrip('/') != ORIGIN + '/en':
                    acts['_label'][vp][lab] = {'type': 'nav', 'url': pg.url}; print(vp, lab, '-> nav', pg.url); continue
                pg.wait_for_timeout(1500)
                sid = f'en.{vp}.s-' + hashlib.md5(('label:' + lab).encode()).hexdigest()[:8]
                sd = pg.evaluate('window.__ptSerialize()')
                (out / 'pages').mkdir(exist_ok=True)
                (out / 'pages' / f'{sid}.json').write_text(json.dumps(sd, ensure_ascii=False), 'utf-8')
                pg.screenshot(path=str(out / f'{sid}.png'))
                acts['_label'][vp][lab] = {'type': 'state', 'label': lab, 'snap': sid}
                print(vp, lab, '-> state', sid); continue
            fid = f'label.{vp}.' + hashlib.md5(lab.encode()).hexdigest()[:8]
            layer['rules'] = [r for r in layer['rules'] if r not in base_rules]
            (out / 'frags' / f'{fid}.json').write_text(json.dumps(layer, ensure_ascii=False), 'utf-8')
            acts['_label'][vp][lab] = {'type': 'overlay', 'label': lab, 'frag': fid, 'text': layer['text'][:120], 'inner': layer['inner'][:40]}
            print(vp, lab, '-> overlay', layer['text'][:150].replace('\n', ' | '))
    br.close()
(out / 'actions.json').write_text(json.dumps(acts, ensure_ascii=False, indent=1), 'utf-8')
(out / 'index.json').write_text('{}', 'utf-8')
