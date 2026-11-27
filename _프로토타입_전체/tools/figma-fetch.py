# -*- coding: utf-8 -*-
"""Figma 정밀 문구 캐시(ref/figma_text.json) 만들기 — figma-diff.py가 색인(레이어 이름) 대신 실제 문구로 대조하게 한다.

  python -I tools/figma-fetch.py              # REST: 환경 변수 FIGMA_TOKEN 필요. 프로토타입이 참조하는 모든 노드를 받음
  python -I tools/figma-fetch.py --ids        # 노드 id 목록만 출력(Figma MCP use_figma 경로용) → tools/out/figma-ids.json
  python -I tools/figma-fetch.py --merge F    # tools/figma-text-dump.js 결과(JSON)를 캐시에 합침

캐시 형식: {"fetched": ISO, "source": "rest|use_figma", "nodes": {"<id>": {"name","w","h","hidden","texts":[{"t","kind"}]}}}
토큰은 파일에 저장하지 않는다.
"""
import sys, os, io, json, re, time, pathlib, datetime, urllib.request, urllib.error

sys.stdout.reconfigure(encoding='utf-8')
TOOLS = pathlib.Path(__file__).resolve().parent
ROOT = TOOLS.parent
CACHE = ROOT / 'ref' / 'figma_text.json'
FILE_KEY = 'hsa3bSV9QmFTe2jsf6tzTm'
KIND = [('button', re.compile(r'button|variant=|^cta', re.I)), ('chip', re.compile(r'chip', re.I)),
        ('tab', re.compile(r'\btabs?\b|<tab', re.I)), ('input', re.compile(r'textfield|input|select|toggle|autocomplete|search', re.I))]


def kind_of(names):
    for nm in names:
        for k, rx in KIND:
            if rx.search(nm): return k
    return 'text'


def referenced_ids(html=None):
    from playwright.sync_api import sync_playwright
    html = pathlib.Path(html or ROOT / '_latest.html').resolve().as_uri()
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page()
        pg.goto(html + '#landing.main/normal'); pg.wait_for_timeout(1000)
        ids = pg.evaluate("() => R.screens.filter(s => !s.doc).flatMap(s => s.states.flatMap(t => { const f = t.figma; "
                          "return !f ? [] : typeof f === 'string' ? [f] : [f.pc, f.mo].filter(Boolean); }))")
        b.close()
    return sorted(set(i for i in ids if re.match(r'^\d+:\d+$', i)))


def load_cache():
    if CACHE.exists():
        return json.load(io.open(CACHE, encoding='utf-8'))
    return {'nodes': {}}


def save_cache(c, source):
    c['fetched'] = datetime.datetime.now().isoformat(timespec='minutes'); c['source'] = source
    json.dump(c, io.open(CACHE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(CACHE, len(c['nodes']), 'nodes')


def from_rest(doc):
    texts = []

    def walk(n, names):
        if n.get('visible') is False: return
        if re.search(r'^(backdrop|scrim|dim|overlay)\b|/ scrim$|\bbackdrop$', n.get('name', ''), re.I) and names: return
        if n.get('type') == 'TEXT':
            texts.append({'t': n.get('characters', ''), 'kind': kind_of(names)}); return
        for c in n.get('children', []): walk(c, ([n.get('name', '')] + names)[:4])
    walk(doc, [])
    bb = doc.get('absoluteBoundingBox') or {}
    bd = re.compile(r'^(backdrop|scrim|dim|overlay)\b|/ scrim$|\bbackdrop$', re.I)
    kids = doc.get('children', [])
    overlay = any(bd.search(c.get('name', '')) for c in kids) or any(bd.search(g.get('name', '')) for c in kids for g in c.get('children', []))
    return {'name': doc.get('name', ''), 'w': bb.get('width', 0), 'h': bb.get('height', 0), 'hidden': doc.get('visible') is False,
            'overlay': overlay, 'texts': texts}


def fetch_rest(ids):
    tok = os.environ.get('FIGMA_TOKEN')
    if not tok:
        sys.exit('FIGMA_TOKEN 환경 변수가 없습니다. (PowerShell: $env:FIGMA_TOKEN="..." / bash: export FIGMA_TOKEN=...)')
    c = load_cache()
    for i in range(0, len(ids), 20):
        part = ids[i:i + 20]
        url = f'https://api.figma.com/v1/files/{FILE_KEY}/nodes?ids=' + ','.join(part)
        for attempt in range(5):
            try:
                req = urllib.request.Request(url, headers={'X-Figma-Token': tok})
                data = json.load(urllib.request.urlopen(req, timeout=120))
                break
            except urllib.error.HTTPError as e:
                if e.code == 429: time.sleep(30 * (attempt + 1)); continue
                raise
        for nid, v in (data.get('nodes') or {}).items():
            if v and v.get('document'):
                c['nodes'][nid] = from_rest(v['document'])
        print(f'{min(i + 20, len(ids))}/{len(ids)}')
    save_cache(c, 'rest')


if __name__ == '__main__':
    a = sys.argv[1:]
    if a and a[0] == '--ids':
        ids = referenced_ids()
        (TOOLS / 'out').mkdir(exist_ok=True)
        json.dump(ids, io.open(TOOLS / 'out' / 'figma-ids.json', 'w', encoding='utf-8'))
        print(len(ids), '개 →', TOOLS / 'out' / 'figma-ids.json')
    elif a and a[0] == '--merge':
        src = json.load(io.open(a[1], encoding='utf-8'))
        if isinstance(src, str): src = json.loads(src)
        c = load_cache(); n = 0
        for nid, v in src.get('nodes', {}).items():
            if v and not v.get('missing'): c['nodes'][nid] = v; n += 1
        print('합침', n)
        save_cache(c, src.get('source', 'use_figma'))
    else:
        fetch_rest(referenced_ids())
