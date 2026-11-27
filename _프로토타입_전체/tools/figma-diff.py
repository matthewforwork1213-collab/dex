# -*- coding: utf-8 -*-
"""프로토타입 ↔ Figma 자동 대조

모든 화면 × 상태 × (PC·모바일)을 실제 브라우저(Playwright)로 렌더해 보이는 문구(텍스트·버튼·칩·탭·입력)를 뽑고,
그 상태의 `figma.pc` / `figma.mo` 노드 하위의 보이는 텍스트와 비교한다.

  python -I tools/figma-diff.py [화면id 접두사] [--html PATH] [--top N] [--no-shots] [--no-report]

Figma 쪽 문구 출처(우선순위)
  1. 정밀  ref/figma_text.json      — Figma 실제 문구(characters, 인스턴스 내부 포함). tools/figma-fetch.py(REST) 또는
                                      tools/figma-text-dump.js(Figma MCP use_figma)로 만든다.
  2. 색인  ref/figma_pages/*.xml    — get_metadata 원문. 텍스트 레이어 「이름」을 문구로 본다(자동 이름 = 문구).
                                      인스턴스 내부(버튼·칩 라벨 등)는 색인에 없어 「확인 불가」로 센다.
  3. 보정  05.리포트/Figma수정결과_*.md — 색인 이후 우리가 고친 것: `A` → `B` 문구 교체 · 「숨김」 · 색인에 없는 새 프레임.
예외     tools/figma-diff-exceptions.json — 결정 기록으로 의도적으로 다르게 한 것(근거 포함). 결과에서 빼고 따로 센다.
결과     05.리포트/프로토타입_Figma_자동대조.md · _img/ · tools/out/figma-diff.json
"""
import sys, os, re, io, json, glob, html, unicodedata, difflib, pathlib, datetime, collections, argparse

sys.stdout.reconfigure(encoding='utf-8')
TOOLS = pathlib.Path(__file__).resolve().parent
ROOT = TOOLS.parent                       # _프로토타입_전체
PROJ = ROOT.parent                        # DEX
REPORTS = PROJ / '05.리포트'
OUT_MD = REPORTS / '프로토타입_Figma_자동대조.md'
IMG_DIR_NAME = '프로토타입_Figma_자동대조_img'
FIG_URL = 'https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id='

ap = argparse.ArgumentParser()
ap.add_argument('prefix', nargs='?', default='')
ap.add_argument('--html', default=str(ROOT / '_latest.html'))
ap.add_argument('--text-cache', default=str(ROOT / 'ref' / 'figma_text.json'))
ap.add_argument('--top', type=int, default=20)
ap.add_argument('--no-shots', action='store_true')
ap.add_argument('--no-report', action='store_true')
ARGS = ap.parse_args()

# ───────────────────────── 공통: 정규화 · 데이터성 판정 ─────────────────────────
def norm(t):
    t = unicodedata.normalize('NFKC', html.unescape(t or ''))
    t = re.sub(r'[  \r\n\t ]+', ' ', t)
    t = t.replace('’', "'").replace('‘', "'").replace('“', '"').replace('”', '"').replace('…', '...').replace('–', '-').replace('—', '-')
    return re.sub(r'\s+', ' ', t).strip()

def key(t):
    k = norm(t).lower()
    k = k.strip('"\' ')
    return re.sub(r'[\s.!?:;,]+$', '', k)

BRANDS = set()
for f in (ROOT / 'assets').glob('*'):
    m = re.match(r'(?:calc|logo|dex|hub|ex)-([a-z0-9]+)\.', f.name)
    if m: BRANDS.add(m.group(1))
BRANDS |= {'lighter', 'apex', 'edgex', 'aster', 'binance', 'bybit', 'okx', 'bitget', 'kucoin', 'mexc', 'gate', 'gate.io', 'htx',
           'bingx', 'bitmart', 'bitmex', 'blofin', 'biofin', 'bitunix', 'woo x pro', 'woox', 'woo x', 'coinex', 'lbank', 'phemex',
           'deepcoin', 'toobit', 'weex', 'tethermax', 'tether max', 'hyperliquid', 'orderly', 'zoomex', 'xt.com', 'bitfinex'}
UNIT_RE = re.compile(r'\b(usdt|usd|usdc|utc|kst|am|pm|d|h|m|s|k|b|x|st|nd|rd|th|lv|vs|jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|'
                     r'mon|tue|wed|thu|fri|sat|sun|members?|days?|hrs?|mins?|sec|tp|pts?|vip|uid|id|of)\b', re.I)

BR_RE = None
MONTH_RE = re.compile(r'\b(january|february|march|april|may|june|july|august|september|october|november|december|jan|feb|mar|apr|jun|jul|aug|sept?|oct|nov|dec)\b')

def akey(t):
    """대조 키: 표본 값(숫자·주소·거래소 이름)을 자리표시로 바꿔 「October Bitget」 = 「October EdgeX」로 본다"""
    global BR_RE
    if BR_RE is None:
        BR_RE = re.compile(r'(?<![a-z0-9])(' + '|'.join(re.escape(b) for b in sorted(BRANDS, key=len, reverse=True)) + r')(?![a-z0-9])')
    k = key(t)
    k = re.sub(r'\*+\s*(?=\d+\b)', '', k)          # 마스킹(******7462)
    k = re.sub(r'0x[0-9a-f.…]+|\*{2,}[.…]*[0-9a-f]*', '@', k)   # 주소 · 마스킹 주소(********...51e9)
    k = re.sub(r'\d[\d,.]*', '#', k)
    k = MONTH_RE.sub('§', k)
    k = BR_RE.sub('%', k)
    return re.sub(r'\s+', ' ', k).strip()

def is_data(t):
    """숫자·금액·날짜·주소·마스킹 ID·거래소 이름처럼 표본 값이라 문구 대조 대상이 아닌 것"""
    n = norm(t)
    if not n: return True
    if n.lower() in BRANDS: return True
    if re.match(r'^[\w.-]+\.(mp4|mov|png|jpe?g|gif|pdf|webm)$', n, re.I): return True   # 파일 이름 표본
    s = re.sub(r'0x[0-9a-fA-F.…]+', ' ', n)
    s = re.sub(r'\b[0-9a-fA-F]{8,}\b', ' ', s)
    s = UNIT_RE.sub(' ', s)
    return len(re.findall(r'[A-Za-z가-힣]', s)) < 2

def hangul_ratio(texts):
    a = sum(len(re.findall(r'[가-힣]', t)) for t in texts)
    b = sum(len(re.findall(r'[A-Za-z]', t)) for t in texts)
    return a / (a + b) if a + b else 0

# ───────────────────────── Figma 색인(XML) ─────────────────────────
TAG = re.compile(r'^\s*<(/?)([a-z][a-z-]*)((?:\s+[a-zA-Z_:-]+="[^"]*")*)\s*(/?)>')
ATTR = re.compile(r'([a-zA-Z_:-]+)="([^"]*)"')

class N:
    __slots__ = ('tag', 'id', 'name', 'hidden', 'w', 'h', 'kids', 'parent', 'page')

NODES = {}
for f in sorted(glob.glob(str(ROOT / 'ref' / 'figma_pages' / '*.xml'))):
    page = os.path.basename(f)[:-4].replace('-', ':')
    st = []
    with io.open(f, encoding='utf-8') as fh:
        for line in fh:
            m = TAG.match(line)
            if not m: continue
            if m.group(1):
                if st: st.pop()
                continue
            a = dict(ATTR.findall(m.group(3)))
            n = N(); n.tag = m.group(2); n.id = a.get('id', ''); n.name = norm(a.get('name', ''))
            n.hidden = a.get('hidden') == 'true'
            try: n.w = float(a.get('width') or 0); n.h = float(a.get('height') or 0)
            except ValueError: n.w = n.h = 0.0
            n.kids = []; n.parent = st[-1] if st else None; n.page = page
            if n.parent: n.parent.kids.append(n)
            if n.id: NODES[n.id] = n
            if not m.group(4): st.append(n)
INDEX_DATE = datetime.datetime.fromtimestamp(max(os.path.getmtime(p) for p in glob.glob(str(ROOT / 'ref' / 'figma_pages' / '*.xml')))).strftime('%Y-%m-%d')

def ancestors(n):
    while n is not None:
        yield n; n = n.parent

def is_hidden(n):
    return any(x.hidden or x.id in HIDE for x in ancestors(n))

CAMEL = re.compile(r'^[a-z]+(?:[A-Z][a-z0-9]*)+$')   # labelAfter 같은 변수형 레이어 이름
GENERIC_TEXT = re.compile(r'^(button|label|text|typography|title|subtitle|value|heading|caption|body ?\d*|helper ?text|placeholder|description|'
                          r'content|tooltip|badge|chip|tab|link|name|date|amount|number|input|overline|header|subheader|h[1-6]|footer note|'
                          r'notes?|breadcrumbs?|state|제목|수정 내용·근거|설명|내용|라벨|본문|버튼|문구|메모|lorem ipsum.*|text ?\d+|title ?\d+)$', re.I)
ROLE_NAME = re.compile(r'\((?:[A-Z]{1,4}-?\d+[a-z]?|[A-Z]{1,3}\d*-\d+)\)$|^(headline|lede|eyebrow|kicker|subhead|cta|body copy)\b', re.I)
ANNOT_RE = re.compile(r'^\w+_[A-Z]{1,4}-\d+|\bnote\s*\(|\(\w+ \d{4}-\d{2}-\d{2}\)')   # 설계 메모 레이어(content_CT-23_* · tier note (John 2026-10-14))
ICONISH = re.compile(r'icon|avatar|logo|mark|filled|rounded|outlined$|^ic[-_ ]|^kr$|^(top|right|bottom|left|center)$|status bar|url bar|'
                     r'home indicator|backdrop|divider|scrollbar|slidermark|_elements|step icon|^#|arrow|chevron|badge|checkbox|radio|switch|'
                     r'호버|애니메이션|합체|^dark=|^image|vector|ellipse|^line', re.I)
SHELL_NAME = re.compile(r'webprelogin|gnb|navigation|footer|^header$|^top ?nav|bottom ?nav|tab ?bar|^frame 8100$|bottomnavigation', re.I)
K_BUTTON = re.compile(r'button|variant=|join button|^cta', re.I)
K_CHIP = re.compile(r'chip', re.I)
K_TAB = re.compile(r'\btabs?\b|<tab', re.I)
K_INPUT = re.compile(r'textfield|input|select|toggle|autocomplete|search', re.I)

def kind_of_names(names):
    for nm in names:
        if K_BUTTON.search(nm): return 'button'
        if K_CHIP.search(nm): return 'chip'
        if K_TAB.search(nm): return 'tab'
        if K_INPUT.search(nm): return 'input'
    return 'text'

def opaque_kind(name):
    if ICONISH.search(name): return None
    if SHELL_NAME.search(name): return 'shell'
    if K_BUTTON.search(name): return 'button'
    if K_CHIP.search(name): return 'chip'
    if K_TAB.search(name): return 'tab'
    if K_INPUT.search(name) or re.search(r'pagination|alert|dialog', name, re.I): return 'input' if K_INPUT.search(name) else 'content'
    return 'content'

# ───────────────────────── 보정: Figma수정결과 문서 ─────────────────────────
HIDE, REPL_SCOPED, REPL_GLOBAL, NEW_FRAMES, FIG_IMG = set(), [], [], {}, {}
ID_RE = re.compile(r'node-id=(\d+)-(\d+)|(?<![\d:;I])(\d{3,6}):(\d{2,7})(?![\d:])')
IMG_TOKEN = re.compile(r'`([\w.-]*?_(?:before|after|new))`|Figma수정결과_img/([\w.-]+\.(?:jpg|png))')

def row_ids(s):
    return [(m.group(1) + ':' + m.group(2)) if m.group(1) else (m.group(3) + ':' + m.group(4)) for m in ID_RE.finditer(s)]

FIX_DOCS = sorted(REPORTS.glob('Figma수정결과_*.md'))
for doc in FIX_DOCS:
    for line in io.open(doc, encoding='utf-8'):
        if not line.startswith('|') or line.startswith('|---'): continue
        cells = [c.strip() for c in line.strip().strip('|').split('|')]
        ids_all = row_ids(line)
        # 숨김: 같은 칸에서 노드 id 뒤(다음 id 전까지)에 「숨김」, 또는 「숨김」으로 시작하는 칸 → 앞 칸들의 id
        for ci, c in enumerate(cells):
            ms = list(ID_RE.finditer(c))
            for j, m in enumerate(ms):
                seg = c[m.end(): ms[j + 1].start() if j + 1 < len(ms) else len(c)]
                if '숨김' in seg and not re.search(r'해제|→ 표시|복제', seg.split('숨김')[0] + seg):   # 「A 복제(… 숨김)」은 복제본 안의 숨김
                    HIDE.add(row_ids(m.group(0))[0])
            if re.match(r'^\(?숨김\)?$', c) and ci > 0:   # 칸 전체가 「숨김」일 때만 앞 칸의 노드를 숨김
                for x in row_ids(' | '.join(cells[:ci])): HIDE.add(x)
        # 문구 교체 `A` → `B`
        pairs = re.findall(r'`([^`]+)`\s*→\s*`([^`]+)`', line)
        tgt = [i for i in ids_all if i in NODES]
        for a, b in pairs:
            if len(key(a)) < 3: continue
            (REPL_SCOPED.append((tgt, key(a), b)) if tgt else REPL_GLOBAL.append((key(a), b)))
        # 색인에 없는 새 프레임 → 그 행의 바뀐 문구(→ 오른쪽 · 일반 백틱)
        new_ids = [i for i in ids_all if i not in NODES]
        if new_ids:
            srcs = {key(a) for a, _ in pairs}
            texts = [t for t in re.findall(r'`([^`]+)`', line)
                     if key(t) not in srcs and not re.match(r'^[\w.-]*_(before|after|new)$|^_?after$|^r\d_', t) and not re.match(r'^[\d:· ]+$', t)
                     and not re.search(r'[=<>{}]| / |^(…|\.\.\.)', t) and not GENERIC_TEXT.match(norm(t)) and not re.match(r'^(default|done|active|disabled|enabled|hover|focused)$', t, re.I)]
            for i in new_ids:
                NEW_FRAMES.setdefault(i, {'texts': [], 'doc': doc.name})['texts'] += texts
        # Figma 캡처(전/후)
        imgs, base = [], None
        for m in IMG_TOKEN.finditer(line):
            tok = m.group(1) or m.group(2)
            nm = re.sub(r'\.(jpg|png)$', '', tok)
            if nm in ('_after', '_new') and base: nm = base + nm
            elif nm.startswith('_'): continue
            base = re.sub(r'_(before|after|new)$', '', nm)
            if re.search(r'_(after|new)$', nm):
                for ext in ('.jpg', '.png'):
                    if (REPORTS / 'Figma수정결과_img' / (nm + ext)).exists(): imgs.append('Figma수정결과_img/' + nm + ext); break
        if imgs:
            for i in ids_all: FIG_IMG.setdefault(i, imgs[0])
CATALOG = {}
for p in (REPORTS / '기존디자인_카탈로그' / 'img').glob('*.jpg'):
    m = re.match(r'([\d-]+)__([\d-]+)\.jpg$', p.name)
    if m: CATALOG[m.group(2).replace('-', ':')] = '기존디자인_카탈로그/img/' + p.name

def apply_repl2(chain_ids, text):
    k = key(text)
    for tgt, a, b in REPL_SCOPED + [(None, a, b) for a, b in REPL_GLOBAL]:
        if tgt is not None and not any(t in chain_ids for t in tgt): continue
        if k == a: return b, True
        if tgt is not None and len(a) >= 8 and a in k:
            return re.sub(re.escape(a), b, k, flags=re.I), True
    return text, False

# ───────────────────────── Figma 정밀 문구 캐시 ─────────────────────────
PRECISE = {}
if os.path.exists(ARGS.text_cache):
    try:
        PRECISE = json.load(io.open(ARGS.text_cache, encoding='utf-8')).get('nodes', {})
    except Exception as e:
        print('정밀 문구 캐시를 읽지 못함:', e)

BACKDROP = re.compile(r'^(backdrop|scrim|dim|overlay)\b|/ scrim$|\bbackdrop$', re.I)

def figma_side(node_id, scope_re=None):
    """→ dict(src, texts[{t,kind}], opaque Counter, generic n, hidden bool, w, h, name, found, overlay)
    scope_re: 이 이름에 맞는 하위 트리만 본다(예: 헤더 상태인데 근거가 전체 페이지 프레임일 때)"""
    if node_id in PRECISE:
        d = PRECISE[node_id]
        return {'src': '정밀', 'texts': [{'t': x['t'], 'kind': x.get('kind', 'text')} for x in d.get('texts', []) if not x.get('hidden')],
                'opaque': collections.Counter(), 'generic': 0, 'hidden': bool(d.get('hidden')), 'w': d.get('w', 0), 'h': d.get('h', 0),
                'name': d.get('name', ''), 'found': True, 'replaced': 0, 'overlay': bool(d.get('overlay'))}
    n = NODES.get(node_id)
    if n is None:
        nf = NEW_FRAMES.get(node_id)
        if nf:
            return {'src': '보정', 'texts': [{'t': t, 'kind': 'text'} for t in dict.fromkeys(nf['texts'])], 'opaque': collections.Counter(),
                    'generic': 0, 'hidden': False, 'w': 0, 'h': 0, 'name': f"색인 이후 새 프레임({nf['doc']})", 'found': True, 'replaced': 0, 'overlay': False}
        return {'src': '없음', 'texts': [], 'opaque': collections.Counter(), 'generic': 0, 'hidden': False, 'w': 0, 'h': 0, 'name': '', 'found': False, 'replaced': 0, 'overlay': False}
    texts, opaque, generic, replaced = [], collections.Counter(), 0, 0
    def walk(x, chain, names):
        nonlocal generic, replaced
        if x.hidden or x.id in HIDE: return
        if x.tag == 'text':
            if GENERIC_TEXT.match(x.name) or CAMEL.match(x.name) or ROLE_NAME.search(x.name) or ANNOT_RE.search(x.name) or key(x.name) in FIG_ANNOT: generic += 1; return
            t, ch = apply_repl2(chain, x.name)
            replaced += ch
            texts.append({'t': t, 'kind': kind_of_names(names), 'id': x.id, 'trunc': (not ch) and len(x.name) == 40}); return
        if BACKDROP.search(x.name): return   # 모달 뒤 배경(흐린 화면) — 대조 대상은 모달
        if x.tag == 'instance' and not x.kids:
            k = opaque_kind(x.name)
            if k: opaque[k] += 1
            return
        if SHELL_NAME.search(x.name) and x is not n: return
        for c in x.kids: walk(c, chain | {x.id}, [x.name] + names[:3])
    chain0 = {a.id for a in ancestors(n)}
    roots = [n]
    if scope_re is not None:
        roots = []
        def find(x, d=0):
            if d > 8: return
            if scope_re.search(x.name): roots.append(x); return
            for c in x.kids: find(c, d + 1)
        find(n)
        if not roots: opaque['content'] += 1
    # 배경 위 모달 프레임: 배경(Backdrop) 위에 그려진 형제(목록에서 배경 뒤쪽)만 본다
    if scope_re is None:
        for lvl in [n] + [c for c in n.kids if c.kids]:
            bi = next((i for i, c in enumerate(lvl.kids) if BACKDROP.search(c.name)), None)
            if bi is not None and bi + 1 < len(lvl.kids):
                roots = list(lvl.kids[bi + 1:])
                break
    for r in roots:
        if r.tag == 'text': walk(r, chain0, [r.name]); continue
        if not r.kids: opaque['content'] += 1   # 색인이 이 프레임 안을 담지 않음(인스턴스 · 깊이 제한된 심볼)
        for c in r.kids: walk(c, chain0 | {r.id}, [r.name])
    overlay = any(BACKDROP.search(c.name) for c in n.kids) or any(BACKDROP.search(g.name) for c in n.kids for g in c.kids)
    return {'src': '색인', 'texts': texts, 'opaque': opaque, 'generic': generic, 'hidden': is_hidden(n), 'w': n.w, 'h': n.h,
            'name': n.name, 'found': True, 'replaced': replaced, 'overlay': overlay}

def screen_sized(w, h, vp):
    return (w >= 1000 and h >= 560) if vp == 'pc' else (330 <= w <= 460 and h >= 560)

def figma_image(node_id):
    n = NODES.get(node_id)
    if node_id in FIG_IMG: return FIG_IMG[node_id], 'Figma 수정 후 캡처'
    if n is not None:
        for a in list(ancestors(n))[1:]:
            if a.id in FIG_IMG and a.tag != 'section': return FIG_IMG[a.id], 'Figma 수정 후 캡처(상위 프레임)'
        sub = []
        def walk(x, d=0):
            if d > 6 or sub: return
            if x.id in FIG_IMG: sub.append(FIG_IMG[x.id]); return
            for c in x.kids: walk(c, d + 1)
        walk(n)
        if sub: return sub[0], 'Figma 수정 후 캡처(일부 영역)'
        for a in ancestors(n):
            if a.id in CATALOG: return CATALOG[a.id], '기존 디자인 카탈로그(섹션 전체)'
    return None, None

# ───────────────────────── 예외 ─────────────────────────
EXC_PATH = TOOLS / 'figma-diff-exceptions.json'
EXC = json.load(io.open(EXC_PATH, encoding='utf-8')) if EXC_PATH.exists() else {'rules': []}
for t in EXC.get('brands', []): BRANDS.add(t.lower())
FIG_ANNOT = {key(x['name']) for x in EXC.get('figmaAnnotations', [])}

def rule_hits(rule, sid, st, vp, typ, ftxt, ptxt):
    sc = rule.get('scope', '*')
    if sc != '*' and not (f'{sid}:{st}' == sc or sid == sc or (sc.endswith('.') and sid.startswith(sc)) or (sc.endswith('*') and f'{sid}:{st}'.startswith(sc[:-1]))):
        return False
    if rule.get('vp', '*') not in ('*', vp): return False
    if rule.get('type', 'any') not in ('any', typ): return False
    def m(pat, t):
        if t is None or pat is None: return pat is None
        if pat.startswith('/') and pat.rfind('/') > 0:
            body, flags = pat[1:pat.rfind('/')], pat[pat.rfind('/') + 1:]
            return re.search(body, norm(t), re.I if 'i' in flags else 0) is not None
        a, b = key(pat), key(t)
        return a == b or (len(a) >= 6 and a in b)
    if 'equiv' in rule and typ == 'diff':
        f, p = key(ftxt), key(ptxt)
        for x, y in rule['equiv']:
            f = re.sub(re.escape(key(x)), key(y), f)
        return f == p
    fpat, ppat = rule.get('figma'), rule.get('proto')
    if typ == 'missing': return fpat is not None and m(fpat, ftxt)
    if typ == 'added': return ppat is not None and m(ppat, ptxt)
    return (fpat is None or m(fpat, ftxt)) and (ppat is None or m(ppat, ptxt)) and (fpat or ppat)

def find_rule(sid, st, vp, typ, ftxt=None, ptxt=None):
    for r in EXC.get('rules', []):
        if rule_hits(r, sid, st, vp, typ, ftxt, ptxt): return r
    return None

# ───────────────────────── 대조 ─────────────────────────
def word_in(a, b):
    """짧은 a가 b 안에 단어 경계로 들어 있는가"""
    if len(a) < 4: return False
    return re.search(r'(?<![a-z0-9가-힣])' + re.escape(a) + r'(?![a-z0-9가-힣])', b) is not None

def compare(F, P, allow_added_kinds):
    Fk, Pk = {}, {}
    for x in F:
        k = akey(x['t'])
        if k and not is_data(x['t']): Fk.setdefault(k, x)
    for x in P:
        k = akey(x['t'])
        if k and not is_data(x['t']): Pk.setdefault(k, x)
    matched, fm, pm = [], set(), set()
    for k in Fk:
        if k in Pk: matched.append(k); fm.add(k); pm.add(k)
    for k in Fk:
        if k in fm: continue
        tr = Fk[k].get('trunc')
        hit = [pk for pk in Pk if (k in pk if tr else word_in(k, pk))]
        if hit:
            matched.append(k); fm.add(k)
            if tr: pm.update(pk for pk in hit if pk.startswith(k))
    # Figma 한 덩어리를 프로토타입이 여러 조각으로 나눈 경우: 조각들이 80% 이상 덮으면 일치
    for k in Fk:
        if k in fm or len(k) < 8: continue
        pieces = {pk for pk in Pk if word_in(pk, k)}
        core = len(re.sub(r'[#@%§]|\busdt\b|\busd\b|\s', '', k)) or 1
        if pieces and sum(len(re.sub(r'\s', '', pk)) for pk in pieces) >= 0.75 * core:
            matched.append(k); fm.add(k); pm.update(pieces)
    # 문구 다름 — 비슷한 것끼리 짝 (프로토타입 쪽은 아직 짝 없는 것 전부)
    rf = [k for k in Fk if k not in fm]; rp = [k for k in Pk if k not in pm]
    cands = []
    for a in rf:
        for b in rp:
            if Fk[a].get('trunc'): b2 = b[:len(a)]
            else: b2 = b
            la, lb = len(a), len(b2)
            if max(la, lb) < 5 or min(la, lb) / max(la, lb) < 0.45: continue
            sm = difflib.SequenceMatcher(None, a, b2, autojunk=False)
            if sm.real_quick_ratio() < 0.6 or sm.quick_ratio() < 0.6: continue
            r = sm.ratio()
            if r >= 0.6: cands.append((r, a, b))
    diffs = []
    for r, a, b in sorted(cands, reverse=True):
        if a in fm or b in pm: continue
        fm.add(a); pm.add(b); diffs.append((Fk[a], Pk[b], round(r, 2)))
    # 남은 프로토타입 조각이 Figma 문구 안에 들어 있으면 「추가」가 아님
    for pk in Pk:
        if pk not in pm and any(word_in(pk, k) for k in Fk): pm.add(pk)
    missing = [Fk[k] for k in Fk if k not in fm]
    added, unv = [], []
    for k in Pk:
        if k in pm: continue
        (added if Pk[k]['kind'] in allow_added_kinds else unv).append(Pk[k])
    return {'nF': len(Fk), 'nP': len(Pk), 'matched': len(set(matched)), 'missing': missing, 'added': added, 'unverifiable': unv, 'diff': diffs}

# ───────────────────────── 프로토타입 렌더 (Playwright) ─────────────────────────
EXTRACT_JS = r"""
([sid, st, vp, lang, scopeOverlay, withShell]) => {
  const authFor = () => {
    const sc = R.byId[sid], s = sc.states.find(x => x.id === st) || sc.states[0], lb = (s.label || '') + ' ' + s.id;
    if (typeof AUTH_ONLY_GUEST !== 'undefined' && AUTH_ONLY_GUEST.includes(sid)) return 'guest';
    const m = (typeof AUTH_STATE !== 'undefined') && AUTH_STATE[sid];
    if (m) { if (m.guest === st && m.s4 !== st) return 'guest'; if (m.s3 === st && m.s4 !== st) return 's3'; if (m.s4 === st) return 's4'; }
    if (/따름|따라/.test(lb)) return 's4';   // 「로그인 상태를 따름」 상태는 회원(연동) 기준으로 본다
    if (/게스트|비로그인|비회원|guest/i.test(lb)) return 'guest';
    if (/연동\s*0|연동 없음|s3/i.test(lb)) return 's3';
    return 's4';
  };
  S.vp = vp; S.lang = lang; S.design = true; S.screen = sid; S.state = st; S.auth = authFor(); S.live = false;
  try { render(); } catch (e) { return {err: String(e), items: []}; }
  const fr = document.getElementById('pt-frame');
  let root = fr, scoped = false;
  if (scopeOverlay) { const s = fr.querySelector('.scrim, .modal, .dialog, .toast'); if (s) { root = s; scoped = true; } }
  const SHELL = 'header.gnb, footer, .mo-top, .mo-nav';
  const SKIP = '.note, .tbd, script, style, template, .pt-b, .sheet-grab';
  const INLINE = new Set(['SPAN','B','STRONG','EM','I','A','CODE','SMALL','BR','IMG','SVG','U','SUP','SUB','MARK','S','PATH','LABEL','WBR']);
  const KINDSEL = [['button', 'button, .btn, [role=button]'], ['chip', '.chip'], ['tab', '.tab'], ['badge', '.badge']];
  const kindOf = el => { for (const [k, s] of KINDSEL) if (el.matches(s)) return k; return null; };
  const vis = el => (!el.checkVisibility || el.checkVisibility({checkVisibilityCSS: true}));
  const out = [];
  // 영문 렌더 안의 국문은 개발 메모·미정 자리표시라 대조하지 않는다
  const push = (t, kind) => { t = (t || '').replace(/\s+/g, ' ').trim(); if (!t || /^\[.*\]$/.test(t) && /미정|미수신/.test(t) || lang === 'en' && /[가-힣]/.test(t)) return; out.push({t, kind}); };
  const isLeafBlock = el => { for (const d of el.querySelectorAll('*')) { if (!INLINE.has(d.tagName) || kindOf(d) || d.tagName === 'INPUT') return false; } return true; };
  const walk = el => {
    if (el.matches(SKIP)) return;
    if (!withShell && el.matches(SHELL)) return;
    if (!vis(el)) return;
    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') { if (el.placeholder) push(el.placeholder, 'input'); if (el.value) push(el.value, 'input'); return; }
    if (el.tagName === 'SELECT') { const o = el.options[el.selectedIndex]; if (o) push(o.text, 'input'); return; }
    const k = kindOf(el);
    if (k) { push(el.innerText, k); return; }
    let own = ''; for (const c of el.childNodes) if (c.nodeType === 3) own += c.textContent;
    // 한 문장 안의 굵게·링크처럼 글자와 인라인 요소가 섞인 경우만 한 덩어리로. 글자 없이 span만 나란히 있으면(라벨·값) 따로 센다
    if (isLeafBlock(el) && (own.trim() || el.children.length <= 1)) { push(el.innerText, el.closest('.tf, label') ? 'input' : 'text'); return; }
    push(own, el.closest('.tf') ? 'input' : 'text');
    for (const c of el.children) walk(c);
  };
  walk(root);
  return {items: out, scoped, auth: S.auth, err: /없는 화면:|at Object\.render/.test(fr.textContent) ? fr.textContent.slice(0, 120) : null};
}
"""

def main():
    from playwright.sync_api import sync_playwright
    html_uri = pathlib.Path(ARGS.html).resolve().as_uri()
    results, nodesign, oneside = [], [], []
    with sync_playwright() as p:
        b = p.chromium.launch()
        pages = {}
        for vp in ('pc', 'mo'):
            pg = b.new_page(viewport={'width': 1800 if vp == 'pc' else 700, 'height': 1000})
            pg.add_init_script("localStorage.setItem('tm-full-proto', JSON.stringify({lang:'en',vp:'%s',auth:'s4',design:true}))" % vp)
            pg.goto(html_uri + '#landing.main/normal'); pg.wait_for_timeout(1200)
            pages[vp] = pg
        reg = pages['pc'].evaluate("() => ({groups: R.groups.map(g => ({id: g.id, label: g.label, order: g.order})), "
                                   "screens: R.screens.map(s => ({id: s.id, group: s.group, title: s.title, route: s.route || '', doc: !!s.doc, "
                                   "states: s.states.map(t => ({id: t.id, label: t.label, figma: t.figma}))}))})")
        for sc in reg['screens']:
            if not sc['id'].startswith(ARGS.prefix) or sc['doc']: continue
            for st in sc['states']:
                f = st['figma']
                fig = {'pc': f if isinstance(f, str) else (f or {}).get('pc'), 'mo': None if isinstance(f, str) else (f or {}).get('mo')}
                if not fig['pc'] and not fig['mo']:
                    nodesign.append({'screen': sc['id'], 'state': st['id'], 'label': st['label'], 'group': sc['group']}); continue
                for vp in ('pc', 'mo'):
                    nid = fig[vp]
                    if not nid:
                        oneside.append({'screen': sc['id'], 'state': st['id'], 'label': st['label'], 'missing_vp': vp, 'has': fig['pc'] or fig['mo'], 'group': sc['group']})
                        continue
                    fsc = next((x for x in EXC.get('figmaScope', []) if sc['id'] == x['scope'] or (x['scope'].endswith('.') and sc['id'].startswith(x['scope']))), None)
                    fs = figma_side(nid, re.compile(fsc['match'], re.I) if fsc else None)
                    lang = 'ko' if hangul_ratio([x['t'] for x in fs['texts']]) > 0.5 else 'en'
                    if lang == 'en':   # 영문 화면 안의 국문 = 설계 메모·상태 카드 라벨(화면 문구 아님)
                        ann = [x for x in fs['texts'] if re.search(r'[가-힣]', x['t'])]
                        fs['texts'] = [x for x in fs['texts'] if not re.search(r'[가-힣]', x['t'])]
                        fs['generic'] += len(ann)
                    full = fs['src'] == '정밀' and screen_sized(fs['w'], fs['h'], vp) or (fs['src'] == '색인' and screen_sized(fs['w'], fs['h'], vp))
                    if fs.get('overlay'): full = False   # 배경 위 모달 프레임 → 프로토타입도 모달만
                    scope_overlay = fs['src'] in ('정밀', '색인') and not full
                    with_shell = sc['id'].startswith('cmn.')
                    r = pages[vp].evaluate(EXTRACT_JS, [sc['id'], st['id'], vp, lang, scope_overlay, with_shell])
                    P = r['items']
                    # 「추가」를 판정할 수 있는 종류: Figma 쪽에 그 종류가 인스턴스로 가려져 있지 않을 때만
                    op = fs['opaque']
                    if fs['src'] == '정밀': allow = {'text', 'button', 'chip', 'tab', 'input', 'badge'}
                    elif fs['src'] in ('보정', '없음'): allow = set()
                    else:
                        allow = set()
                        if not op['content']: allow |= {'text', 'badge'}
                        for k in ('button', 'chip', 'tab', 'input'):
                            if not op[k] and not op['content']: allow.add(k)
                    if not full and not r['scoped']: allow = set()   # 부분 프레임인데 프로토타입 범위를 못 좁힘 → 누락만
                    cmpd = compare(fs['texts'], P, allow) if fs['found'] else {'nF': 0, 'nP': 0, 'matched': 0, 'missing': [], 'added': [], 'unverifiable': [], 'diff': []}
                    # 예외 적용
                    exc = []
                    def keep(items, typ):
                        o = []
                        for x in items:
                            ru = find_rule(sc['id'], st['id'], vp, typ, x['t'] if typ == 'missing' else None, x['t'] if typ == 'added' else None)
                            (exc.append({'type': typ, 't': x['t'], 'rule': ru['id']}) if ru else o.append(x))
                        return o
                    cmpd['missing'] = keep(cmpd['missing'], 'missing')
                    cmpd['added'] = keep(cmpd['added'], 'added')
                    dd = []
                    for fx, px, ratio in cmpd['diff']:
                        ru = find_rule(sc['id'], st['id'], vp, 'diff', fx['t'], px['t'])
                        (exc.append({'type': 'diff', 't': f"{fx['t']} ⇄ {px['t']}", 'rule': ru['id']}) if ru else dd.append({'figma': fx['t'], 'proto': px['t'], 'ratio': ratio, 'kind': fx['kind']}))
                    cmpd['diff'] = dd
                    results.append({'screen': sc['id'], 'group': sc['group'], 'title': sc['title'], 'state': st['id'], 'label': st['label'], 'vp': vp,
                                    'node': nid, 'src': fs['src'], 'node_name': fs['name'], 'found': fs['found'], 'fig_hidden': fs['hidden'],
                                    'full': bool(full), 'scoped': r.get('scoped'), 'lang': lang, 'auth': r.get('auth'), 'render_err': r.get('err'),
                                    'opaque': dict(op), 'generic': fs['generic'], 'replaced': fs['replaced'], 'allow_added': sorted(allow),
                                    'nF': cmpd['nF'], 'nP': cmpd['nP'], 'matched': cmpd['matched'],
                                    'missing': [{'t': x['t'], 'kind': x['kind']} for x in cmpd['missing']],
                                    'added': [{'t': x['t'], 'kind': x['kind']} for x in cmpd['added']],
                                    'unverifiable': len(cmpd['unverifiable']), 'diff': cmpd['diff'], 'excepted': exc})
        # 상위 문제 캡처
        # 상위 문제: 누락 + 다름 우선(추가는 동점 정리용), 같은 Figma 노드는 한 번만
        top, seen_nodes = [], set()
        for x in sorted([x for x in results if x['missing'] or x['diff'] or x['added']],
                        key=lambda x: (-(len(x['missing']) + len(x['diff']) + 0.1 * len(x['added'])), x['screen'], x['state'])):
            sig = (x['screen'], frozenset(m['t'] for m in x['missing']) | frozenset(d['figma'] for d in x['diff']))
            if x['node'] in seen_nodes or sig in seen_nodes: continue
            seen_nodes.add(x['node']); seen_nodes.add(sig); top.append(x)
            if len(top) >= ARGS.top: break
        for x in top:
            xs = {m['t'] for m in x['missing']} | {d['figma'] for d in x['diff']}
            x['same_node'] = [f"{y['screen']}:{y['state']}" + ('' if y['vp'] == x['vp'] else f"({'PC' if y['vp'] == 'pc' else '모바일'})") for y in results
                              if y is not x and (y['node'] == x['node'] or (y['screen'] == x['screen'] and xs and xs == ({m['t'] for m in y['missing']} | {d['figma'] for d in y['diff']})))]
        shots = {}
        if not ARGS.no_shots and top:
            imgdir = REPORTS / IMG_DIR_NAME; imgdir.mkdir(exist_ok=True)
            for old in imgdir.glob('p_*.jpg'): old.unlink()   # 지난 실행의 캡처(이번 상위 목록에 없는 것) 정리
            for x in top:
                pg = pages[x['vp']]
                pg.evaluate(EXTRACT_JS, [x['screen'], x['state'], x['vp'], x['lang'], False, True])
                pg.add_style_tag(content='#pt{display:block;height:auto}#pt-side,#pt-bar{display:none}#pt-main{height:auto;display:block}#pt-stage{overflow:visible;padding:0;background:#fff}.pt-frame{box-shadow:none;margin:0}')
                pg.wait_for_timeout(150)
                box = pg.locator('#pt-frame').bounding_box()
                if not box: continue
                fn = f"p_{x['screen'].replace('.', '-')}_{x['state']}_{x['vp']}.jpg"
                pg.screenshot(path=str(imgdir / fn), clip={'x': box['x'], 'y': box['y'], 'width': box['width'],
                              'height': min(box['height'], 2400 if x['vp'] == 'pc' else 1800)}, full_page=True, type='jpeg', quality=70)
                shots[(x['screen'], x['state'], x['vp'])] = f'{IMG_DIR_NAME}/{fn}'
        b.close()
    return reg, results, nodesign, oneside, top, shots

# ───────────────────────── 보고서 ─────────────────────────
def cell(s):
    return (s or '').replace('|', '／').replace('\n', ' ')

def flink(nid):
    return f'[{nid}]({FIG_URL}{nid.replace(":", "-")})' if nid and re.match(r'^\d+:\d+$', nid) else (nid or '-')

KIND_KO = {'text': '', 'button': '[버튼] ', 'chip': '[칩] ', 'tab': '[탭] ', 'input': '[입력] ', 'badge': '[배지] '}

def joinlist(items, cap=10):
    s = [f"{KIND_KO.get(x['kind'], '')}`{cell(x['t'])[:90]}`" for x in items[:cap]]
    if len(items) > cap: s.append(f'외 {len(items) - cap}')
    return ' · '.join(s)

def write_report(reg, results, nodesign, oneside, top, shots):
    groups = {g['id']: g for g in reg['groups']}
    screens = [s for s in reg['screens'] if not s['doc'] and s['id'].startswith(ARGS.prefix)]
    n_states = sum(len(s['states']) for s in screens)
    tot = lambda k: sum(len(x[k]) for x in results)
    nF = sum(x['nF'] for x in results); nM = sum(x['matched'] for x in results)
    mis, add, dif = tot('missing'), tot('added'), tot('diff')
    exc = tot('excepted'); unv = sum(x['unverifiable'] for x in results)
    rate = nM / (nM + mis + dif) * 100 if (nM + mis + dif) else 0
    src = collections.Counter(x['src'] for x in results)
    opq = collections.Counter()
    for x in results:
        for k, v in x['opaque'].items():
            if k != 'shell': opq[k] += v
    clean = sum(1 for x in results if not (x['missing'] or x['added'] or x['diff']))
    now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M')
    L = ['# 프로토타입 ↔ Figma 자동 대조', '',
         '| 항목 | 내용 |', '|---|---|',
         f'| 생성 | {now} · `python -I _프로토타입_전체/tools/figma-diff.py` (스크립트가 이 문서를 통째로 다시 씁니다) |',
         f'| 프로토타입 | `_프로토타입_전체/{pathlib.Path(ARGS.html).name}` — 모든 화면 × 상태 × PC·모바일을 실제 브라우저로 렌더(디자인 보기 · 주석 숨김 · 상태에 맞는 로그인 상태) |',
         f'| Figma 기준 | 상태의 `figma.pc` / `figma.mo` 노드. 문구 출처: 정밀 캐시 `ref/figma_text.json` {"있음 " + str(len(PRECISE)) + "노드" if PRECISE else "없음"} → 오프라인 색인 `ref/figma_pages/*.xml`({INDEX_DATE} 파일 기준) → 색인 이후 수정 `05.리포트/Figma수정결과_*.md` {len(FIX_DOCS)}개(문구 교체 {len(REPL_SCOPED) + len(REPL_GLOBAL)} · 숨김 {len(HIDE)} · 새 프레임 {len(NEW_FRAMES)}) |',
         f'| 예외 | `_프로토타입_전체/tools/figma-diff-exceptions.json` 규칙 {len(EXC.get("rules", []))}개 — 결정 기록으로 의도적으로 다르게 한 것. 결과에서 빼고 7장에 따로 적음 |',
         '', '## 1. 요약', '',
         '| 항목 | 값 |', '|---|---|',
         f'| 화면 · 상태 (문서 화면 제외) | {len(screens)} 화면 · {n_states} 상태 |',
         f'| 대조한 상태×뷰 | **{len(results)}** (Figma 출처: ' + ' · '.join(f'{k} {v}' for k, v in src.most_common()) + ') |',
         f'| 디자인 없음 | 상태 {len(nodesign)} (PC·모바일 모두 없음) · 한쪽 뷰만 있음 {len(oneside)} — 6장 |',
         f'| **일치율** (Figma 문구 기준) | **{rate:.1f}%** — Figma 문구 {nF}개 중 일치 {nM} |',
         f'| **누락** (Figma에만) | **{mis}** |',
         f'| **문구 다름** | **{dif}** |',
         f'| **추가** (프로토타입에만) | **{add}** |',
         f'| 문제 없는 상태×뷰 | {clean} / {len(results)} |',
         f'| 예외로 뺀 건 | {exc} |',
         f'| 확인 불가 | Figma 색인에서 내부가 안 보이는 인스턴스 {sum(opq.values())}개(버튼 {opq["button"]} · 칩 {opq["chip"]} · 탭 {opq["tab"]} · 입력 {opq["input"]} · 블록 {opq["content"]}) · 그래서 판정을 보류한 프로토타입 문구 {unv}개 |',
         '', '### 읽는 법', '',
         '| 구분 | 뜻 | 보는 법 |', '|---|---|---|',
         '| 누락 | Figma 프레임에 보이는 문구인데 프로토타입 그 상태에 없음 | 프로토타입에 넣거나, 의도적이면 예외 파일에 근거와 함께 등록 |',
         '| 문구 다름 | 비슷하지만 다른 문구(유사도 0.6 이상 짝) | `Figma` ⇄ `프로토타입` |',
         '| 추가 | 프로토타입에만 있음 | Figma 쪽에 같은 종류의 요소가 인스턴스로 가려져 있으면 판정하지 않고 「확인 불가」로 셈 |',
         '| 제외 | 숫자·금액·날짜·주소·마스킹 ID·거래소 이름 같은 표본 값, Figma의 이름뿐인 레이어(`Button`·`Label`·`Description`·`h6`·`headline (DX-1)` 등), GNB·푸터(공통 셸 화면 `cmn.*`에서만 대조) | — |',
         '| 출처 | 정밀 = Figma 실제 문구 · 색인 = 텍스트 레이어 이름(자동 이름 = 문구라서 대부분 맞지만, 이름을 바꾼 레이어는 틀릴 수 있음) · 보정 = 색인 이후 새 프레임이라 수정결과 문서의 문구로만 대조(누락만 판정) | — |',
         '',
         f'> 한계: 지금 Figma 쪽은 **색인(레이어 이름)** 기준입니다. 버튼·칩·탭 라벨처럼 컴포넌트 인스턴스 안에 있는 문구는 색인에 없어서 그 부분은 누락을 잡지 못합니다(위 「확인 불가」). Figma 연결 후 9장 방법으로 정밀 캐시를 만들면 같은 명령으로 인스턴스 내부까지 대조합니다.',
         '']
    # 2. 상위 문제
    L += [f'## 2. 상위 문제 {len(top)}건', '', '누락 + 문구 다름이 많은 순(추가는 동점 정리용). 같은 Figma 프레임 · 같은 내용의 상태는 한 번만 싣고 「같은 문제」로 묶음. 캡처: 왼쪽 프로토타입(디자인 보기, 위쪽 최대 2400px) · 오른쪽 Figma(기존 캡처 재사용, 없으면 「Figma 캡처 필요(연결 후)」).', '',
          '| # | 화면:상태 | 뷰 | Figma | 누락 | 다름 | 추가 | 대표 내용 |', '|---|---|---|---|---|---|---|---|']
    for i, x in enumerate(top, 1):
        rep = (joinlist(x['missing'], 3) if x['missing'] else '') + (' / 다름 ' + ' · '.join(f"`{cell(d['figma'])[:50]}`⇄`{cell(d['proto'])[:50]}`" for d in x['diff'][:2]) if x['diff'] else '')
        L.append(f"| {i} | `{x['screen']}:{x['state']}` {cell(x['label'])} | {'PC' if x['vp'] == 'pc' else '모바일'} | {flink(x['node'])} | {len(x['missing'])} | {len(x['diff'])} | {len(x['added'])} | {rep or joinlist(x['added'], 3)} |")
    L.append('')
    for i, x in enumerate(top, 1):
        img, what = figma_image(x['node'])
        pimg = shots.get((x['screen'], x['state'], x['vp']))
        L += [f"### 2.{i} `{x['screen']}:{x['state']}` · {'PC' if x['vp'] == 'pc' else '모바일'} — {cell(x['label'])}", '',
              f"Figma {flink(x['node'])} `{cell(x['node_name'])}` · 출처 {x['src']}" + (f" · 같은 문제: {', '.join('`' + k + '`' for k in dict.fromkeys(x['same_node']))}" if x.get('same_node') else ''), '',
              '| 프로토타입 | Figma |', '|---|---|',
              f"| {('![프로토타입](' + pimg + ')') if pimg else '(캡처 생략)'} | {('![Figma](' + img + ')<br>' + what) if img else 'Figma 캡처 필요(연결 후)'} |", '']
        if x['missing']: L.append(f"- 누락: {joinlist(x['missing'], 20)}")
        if x['diff']: L.append('- 다름: ' + ' · '.join(f"`{cell(d['figma'])}` ⇄ `{cell(d['proto'])}`" for d in x['diff'][:12]))
        if x['added']: L.append(f"- 추가: {joinlist(x['added'], 12)}")
        L.append('')
    # 3. 화면별 불일치
    L += ['## 3. 화면별 불일치 표', '', '이 표만 보면 됩니다. 한 행 = 상태 × 뷰 × 구분. 문제 없는 상태는 4장 집계에만 나옵니다.', '']
    by_group = collections.defaultdict(list)
    for x in results: by_group[x['group']].append(x)
    for gid in sorted(by_group, key=lambda g: groups.get(g, {}).get('order', 999)):
        rows = [x for x in by_group[gid] if x['missing'] or x['diff'] or x['added'] or x['fig_hidden'] or not x['found'] or x['render_err']]
        if not rows: continue
        L += [f"### {groups.get(gid, {}).get('label', gid)}", '', '| 화면:상태 | 뷰 | Figma 노드 | 구분 | 내용 |', '|---|---|---|---|---|']
        for x in rows:
            head = f"`{x['screen']}:{x['state']}` {cell(x['label'])}"
            vpk = 'PC' if x['vp'] == 'pc' else '모바일'
            nd = flink(x['node']) + ('' if x['src'] == '색인' else f" ({x['src']})")
            if not x['found']: L.append(f'| {head} | {vpk} | {nd} | ⚠ 노드 없음 | 색인·수정결과 어디에도 없는 노드 — 노드 id 확인 또는 Figma 연결 후 재실행 |')
            if x['fig_hidden']: L.append(f'| {head} | {vpk} | {nd} | ⚠ 숨긴 프레임 | Figma에서 숨긴(또는 숨김 처리된 상위) 프레임을 근거로 쓰고 있음 |')
            if x['render_err']: L.append(f'| {head} | {vpk} | {nd} | ⚠ 렌더 오류 | {cell(x["render_err"])} |')
            if x['missing']: L.append(f"| {head} | {vpk} | {nd} | 누락 {len(x['missing'])} | {joinlist(x['missing'])} |")
            if x['diff']: L.append(f"| {head} | {vpk} | {nd} | 다름 {len(x['diff'])} | " + ' · '.join(f"`{cell(d['figma'])[:70]}` ⇄ `{cell(d['proto'])[:70]}`" for d in x['diff'][:6]) + (f" 외 {len(x['diff']) - 6}" if len(x['diff']) > 6 else '') + ' |')
            if x['added']: L.append(f"| {head} | {vpk} | {nd} | 추가 {len(x['added'])} | {joinlist(x['added'], 8)} |")
        L.append('')
    # 4. 그룹 집계
    L += ['## 4. 그룹별 집계', '', '| 그룹 | 상태×뷰 | 문제 없음 | 일치율 | 누락 | 다름 | 추가 | 확인 불가 인스턴스 |', '|---|---|---|---|---|---|---|---|']
    for gid in sorted(by_group, key=lambda g: groups.get(g, {}).get('order', 999)):
        xs = by_group[gid]; m = sum(x['matched'] for x in xs); mi = sum(len(x['missing']) for x in xs); di = sum(len(x['diff']) for x in xs)
        o = sum(v for x in xs for k, v in x['opaque'].items() if k != 'shell')
        L.append(f"| {groups.get(gid, {}).get('label', gid)} | {len(xs)} | {sum(1 for x in xs if not (x['missing'] or x['added'] or x['diff']))} | "
                 f"{(f'{m / (m + mi + di) * 100:.0f}%' if m + mi + di else '— (Figma 문구 못 읽음)')} | {mi} | {di} | {sum(len(x['added']) for x in xs)} | {o} |")
    L.append('')
    # 5. 대조 근거가 약한 상태
    weak = [x for x in results if x['found'] and x['nF'] == 0]
    L += ['## 5. Figma 문구를 하나도 못 읽은 상태×뷰', '', f'{len(weak)}건. 프레임 전체가 인스턴스이거나 이름뿐인 레이어만 있어 색인으로는 대조할 수 없습니다. 정밀 캐시(9장)가 있어야 대조됩니다.', '',
          '| 화면:상태 | 뷰 | Figma 노드 | 프레임 이름 | 가려진 인스턴스 |', '|---|---|---|---|---|']
    for x in weak:
        L.append(f"| `{x['screen']}:{x['state']}` {cell(x['label'])} | {'PC' if x['vp'] == 'pc' else '모바일'} | {flink(x['node'])} | {cell(x['node_name'])} | " + (' · '.join(f'{k} {v}' for k, v in x['opaque'].items()) or '-') + ' |')
    L.append('')
    # 6. 디자인 없음
    L += ['## 6. 디자인 없는 상태', '', f'### 6.1 PC·모바일 모두 Figma 노드 없음 ({len(nodesign)})', '', '| 그룹 | 화면:상태 | 상태 |', '|---|---|---|']
    for x in sorted(nodesign, key=lambda x: groups.get(x['group'], {}).get('order', 999)):
        L.append(f"| {groups.get(x['group'], {}).get('label', x['group'])} | `{x['screen']}:{x['state']}` | {cell(x['label'])} |")
    L += ['', f'### 6.2 한쪽 뷰만 있음 ({len(oneside)})', '', '| 화면:상태 | 상태 | 없는 쪽 | 있는 쪽 노드 |', '|---|---|---|---|']
    for x in oneside:
        L.append(f"| `{x['screen']}:{x['state']}` | {cell(x['label'])} | {'PC' if x['missing_vp'] == 'pc' else '모바일'} | {flink(x['has'])} |")
    L.append('')
    # 7. 예외
    rules = {r['id']: r for r in EXC.get('rules', [])}
    used = collections.Counter(e['rule'] for x in results for e in x['excepted'])
    L += ['## 7. 예외로 뺀 것', '', '| 규칙 | 범위 | 구분 | 대상 | 근거 | 적용 건수 |', '|---|---|---|---|---|---|']
    for rid, r in rules.items():
        tgt = r.get('figma') or r.get('proto') or (' · '.join(f'{a}→{b}' for a, b in r.get('equiv', [])))
        L.append(f"| {rid} | `{r.get('scope', '*')}` {r.get('vp', '')} | {r.get('type', 'any')} | `{cell(tgt)}` | {cell(r.get('reason', ''))} ({cell(r.get('ref', ''))}) | {used.get(rid, 0)} |")
    L.append('')
    # 8. 실행 방법
    L += ['## 8. 실행 방법', '',
          '| 할 일 | 명령 (`_프로토타입_전체/`에서) |', '|---|---|',
          '| 최신 프로토타입 빌드 | `node build.cjs` (→ `_latest.html`) |',
          '| 전체 대조 + 이 문서 갱신 | `python -I tools/figma-diff.py` |',
          '| 일부 화면만 (문서는 그 범위로 다시 씀) | `python -I tools/figma-diff.py events.` |',
          '| 캡처 없이 빠르게 | `python -I tools/figma-diff.py --no-shots` |',
          '| 다른 빌드 파일로 | `python -I tools/figma-diff.py --html TetherMax_전체프로토타입_YYYYMMDD_HHMM.html` |',
          '| 기계용 결과 | `tools/out/figma-diff.json` (상태×뷰별 누락·추가·다름·예외) |',
          '| 예외 추가 | `tools/figma-diff-exceptions.json`의 `rules`에 `{"id","scope","vp","type","figma"/"proto"/"equiv","reason","ref"}` 추가. `scope` = `*` · `화면id` · `화면id:상태` · `그룹접두사.` · `접두사*` / `type` = `missing`·`added`·`diff`·`any` / 문구는 정규화 후 같거나 포함(6자 이상), `/정규식/i`도 됨. **근거(결정 기록 위치)가 없으면 넣지 않는다** |',
          '',
          '## 9. Figma 최신 색인으로 다시 돌리는 법', '',
          '| 단계 | 방법 |', '|---|---|',
          '| A. 정밀 문구 캐시 — REST (권장) | Figma 개인 액세스 토큰을 환경 변수로: `set FIGMA_TOKEN=...`(PowerShell `$env:FIGMA_TOKEN=\'...\'`) → `python -I tools/figma-fetch.py` → 프로토타입이 참조하는 모든 노드의 실제 문구(인스턴스 내부 포함, 숨김 반영)를 `ref/figma_text.json`에 저장. 토큰은 파일에 저장하지 않음 |',
          '| A\'. 정밀 문구 캐시 — Figma MCP | MCP가 연결되면 `python -I tools/figma-fetch.py --ids` 로 노드 목록을 뽑고, `tools/figma-text-dump.js` 내용의 `IDS`에 넣어 `use_figma`로 실행 → 반환 JSON을 `ref/figma_text.json`으로 저장(`python -I tools/figma-fetch.py --merge 받은파일.json`). 노드가 많으면 100개씩 나눠 실행 |',
          '| B. 색인(레이어 이름) 갱신 | 페이지마다 `get_metadata(fileKey=hsa3bSV9QmFTe2jsf6tzTm, nodeId=페이지 id)` 결과를 `ref/figma_pages/<페이지id 콜론→하이픈>.xml`로 덮어쓰기 → `python tools/figindex.py` |',
          '| C. 다시 대조 | `python -I tools/figma-diff.py` — 정밀 캐시에 있는 노드는 정밀, 없는 노드는 색인으로 자동 선택. 수정결과 문서의 보정은 색인 노드에만 적용(정밀 캐시는 이미 최신이므로) |',
          '| 캡처 | Figma 이미지는 `Figma수정결과_img`·`기존디자인_카탈로그/img` 중 그 노드(또는 상위·하위 프레임)를 찍은 것을 재사용. 없으면 「Figma 캡처 필요(연결 후)」 — 연결 후 `get_screenshot`으로 받아 `Figma수정결과_img/<이름>_after.jpg`로 두고 수정결과 문서 행에 노드 id와 함께 적으면 다음 실행부터 붙음 |',
          '']
    io.open(OUT_MD, 'w', encoding='utf-8').write('\n'.join(L))
    return rate, mis, add, dif

if __name__ == '__main__':
    reg, results, nodesign, oneside, top, shots = main()
    (TOOLS / 'out').mkdir(exist_ok=True)
    json.dump({'generated': datetime.datetime.now().isoformat(timespec='minutes'), 'html': ARGS.html, 'results': results,
               'nodesign': nodesign, 'oneside': oneside}, io.open(TOOLS / 'out' / 'figma-diff.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    if not ARGS.no_report:
        rate, mis, add, dif = write_report(reg, results, nodesign, oneside, top, shots)
        print(f'대조 {len(results)} 상태×뷰 · 일치율 {rate:.1f}% · 누락 {mis} · 다름 {dif} · 추가 {add} · 디자인 없음 {len(nodesign)}')
        print(OUT_MD)
