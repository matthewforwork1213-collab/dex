# 일괄 스크린샷: python -I tools/shots.py <list.json> <out_dir>
# list.json = [{"key":"screen:state","vp":"pc|mo","file":"name.png"}, ...]  · 디자인 보기(주석 숨김) · 한국어
import sys, json, pathlib
from playwright.sync_api import sync_playwright
items = json.loads(pathlib.Path(sys.argv[1]).read_text(encoding='utf-8'))
out = pathlib.Path(sys.argv[2]); out.mkdir(parents=True, exist_ok=True)
lang = sys.argv[3] if len(sys.argv) > 3 else 'ko'
html = (pathlib.Path(__file__).resolve().parent.parent / '_latest.html').as_uri()
with sync_playwright() as p:
    b = p.chromium.launch()
    for vp in ('pc', 'mo'):
        group = [i for i in items if i.get('vp', 'pc') == vp]
        if not group: continue
        pg = b.new_page(viewport={'width': 1800 if vp == 'pc' else 700, 'height': 1000})
        pg.add_init_script(f"localStorage.setItem('tm-full-proto', JSON.stringify({{lang:'{lang}',vp:'{vp}',auth:'s4',design:true}}))")
        pg.goto(html + '#' + group[0]['key'].replace(':', '/'))
        pg.wait_for_timeout(1200)
        pg.add_style_tag(content='#pt{display:block;height:auto}#pt-side,#pt-bar{display:none}#pt-main{height:auto;display:block}#pt-stage{overflow:visible;padding:0;background:#fff}.pt-frame{box-shadow:none;margin:0}')
        for it in group:
            sid, _, st = it['key'].partition(':')
            pg.evaluate("([a,b])=>{S.screen=a;S.state=b||null;render()}", [sid, st])
            pg.wait_for_timeout(150)
            fr = pg.locator('#pt-frame')
            box = fr.bounding_box()
            # 너무 긴 페이지는 위쪽 2400px만
            clip = {'x': box['x'], 'y': box['y'], 'width': box['width'], 'height': min(box['height'], 2400 if vp == 'pc' else 1800)}
            pg.screenshot(path=str(out / it['file']), clip=clip, full_page=True)
        pg.close()
    b.close()
print(len(items), 'shots')
