# 스크린샷: python -I tools/shot.py <screen:state> <pc|mo> <out.png> [en|ko] [design]
# 최신 빌드(_latest.html)의 화면 프레임(#pt-frame)만 찍는다. design 인자를 주면 주석(.note)을 숨긴 디자인 보기로 찍는다.
import sys, json, pathlib
from playwright.sync_api import sync_playwright
key, vp, out = sys.argv[1], sys.argv[2], sys.argv[3]
lang = sys.argv[4] if len(sys.argv) > 4 else 'en'
design = len(sys.argv) > 5 and sys.argv[5] == 'design'
html = pathlib.Path(__file__).resolve().parent.parent / '_latest.html'
sid, _, st = key.partition(':')
with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page(viewport={'width': 1800 if vp == 'pc' else 700, 'height': 1000})
    pg.add_init_script(f"localStorage.setItem('tm-full-proto', JSON.stringify({{lang:{json.dumps(lang)},vp:{json.dumps(vp)},auth:'s4',design:{'true' if design else 'false'}}}))")
    pg.goto(html.as_uri() + f'#{sid}/{st or "normal"}')
    pg.wait_for_timeout(700)
    pg.add_style_tag(content='#pt{display:block;height:auto}#pt-side,#pt-bar{display:none}#pt-main{height:auto;display:block}#pt-stage{overflow:visible;padding:0}.pt-frame{box-shadow:none;margin:0}')
    pg.wait_for_timeout(100)
    pg.locator('#pt-frame').screenshot(path=out)
    b.close()
print(out)
