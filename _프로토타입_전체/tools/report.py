# 디자인 누락 보고서 생성: python -I tools/report.py
# 입력 ref/gaps.json (tools/gaps.cjs 결과) · 이미지 ../05.리포트/전체프로토타입_디자인누락_img/<screen>_<state>.jpg
import json, io, pathlib, re
root = pathlib.Path(__file__).resolve().parent.parent
g = json.load(io.open(root / 'ref' / 'gaps.json', encoding='utf-8'))
out = root.parent / '05.리포트' / '전체프로토타입_디자인누락.md'
imgdir = '전체프로토타입_디자인누락_img'
FIG = 'https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id='

def figlinks(s):
    s = s or ''
    return re.sub(r'`?(\d{4,6}):(\d{2,7})`?', lambda m: f'[{m.group(1)}:{m.group(2)}]({FIG}{m.group(1)}-{m.group(2)})', s)

def cell(s):
    return (s or '').replace('|', '／').replace('\n', ' ')

L = []
L += ['# TetherMax 전체 프로토타입 — 디자인 누락 목록', '',
      '| 항목 | 내용 |', '|---|---|',
      '| 대상 | 디자이너 · PM |',
      '| 프로토타입 | `_프로토타입_전체/` 최신 빌드 `TetherMax_전체프로토타입_*.html` (화면 id로 바로 열기: `#화면id/상태`) |',
      '| 디자인 원본 | Figma `UI-UX Design` › `DEX(revision)` + 기존 `[MAX-…]` 페이지 일부 |',
      '| 읽는 법 | 아래 상태는 **Figma에 맞는 프레임이 없어** 기존 프로토타입(V2.2) 내용을 새 디자인 시스템으로 옮겨 그린 것입니다. 이미지는 그 상태의 현재 프로토타입 화면(디자인 보기, 한국어)이고, 「가까운 Figma」는 디자인할 때 기준으로 삼을 프레임입니다 |',
      '| 집계 제외 | 디자인 대상이 아닌 문서 화면(규칙 원문 · 분석 이벤트 · 외부 연결 FAQ/지원/제휴) |', '']
L += ['## 1. 요약', '',
      '| 구분 | 상태 수 |', '|---|---|',
      f"| 전체 상태 | {g['total']} |",
      f"| PC·모바일 디자인 모두 있음 | {g['designed'] - g['partial']} |",
      f"| 한쪽(PC 또는 모바일)만 있음 | {g['partial']} |",
      f"| **디자인 없음** | **{g['missing']}** |", '']
L += ['| 그룹 | 화면 | 상태 | 모두 있음 | 한쪽만 | 없음 |', '|---|---|---|---|---|---|']
for p in g['groups']:
    L.append(f"| {p['label']} | {p['screens']} | {p['total']} | {p['both']} | {p['one']} | {p['none']} |")
L.append('')
L += ['## 2. 디자인 없는 상태 (이미지)', '']
cur = None
for it in g['items']:
    if it['groupLabel'] != cur:
        cur = it['groupLabel']; L += [f'### {cur}', '']
    key = f"{it['screen']}:{it['state']}"
    img = f"{imgdir}/{it['screen'].replace('.', '-')}_{it['state']}.jpg"
    L += [f"#### `{key}` — {cell(it['label'])}", '',
          '| 항목 | 내용 |', '|---|---|',
          f"| 화면 | {cell(it['title'])} {('(`' + it['route'] + '`)') if it.get('route') else ''} |",
          f"| 기능 | {' · '.join(it['fu']) or '-'} |",
          f"| 빠진 것 | {cell(it.get('what') or '해당 상태 프레임')} |",
          f"| 가까운 Figma | {figlinks(cell(it.get('near') or '-'))} |",
          f"| 보기 | {'모바일' if it.get('vp') == 'mo' else 'PC'} |", '',
          f"![{key}]({img})", '']
L += ['## 3. 한쪽 뷰포트만 있는 상태', '', '이미지는 생략합니다. 있는 쪽 프레임을 기준으로 다른 쪽을 그려야 합니다.', '',
      '| 화면:상태 | 상태 | 있는 쪽 | Figma |', '|---|---|---|---|']
for o in g['oneViewport']:
    L.append(f"| `{o['screen']}:{o['state']}` | {cell(o['label'])} | {'PC' if o['has'] == 'pc' else '모바일'} | {figlinks(o['node'])} |")
L.append('')
io.open(out, 'w', encoding='utf-8').write('\n'.join(L))
print(out, len(L), 'lines')
