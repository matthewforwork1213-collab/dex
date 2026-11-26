# 실사이트 프로토타입 빌드
# python -I tools/build.py <guest_raw_dir> [member_raw_dir] [mask.json]
#   raw_dir = crawl2.py 출력(index.json · actions.json · pages/ · frags/)
#   mask.json = 회원 개인정보 치환표 {"원문": "더미", ...} (회원 수집본에만 적용)
# 결과: index.html · pt-runtime.js · data.js · css/ · pages/ · frags/
import sys, json, re, pathlib, urllib.request, html as H

ROOT = pathlib.Path(__file__).resolve().parent.parent
ORIGIN = 'https://tethermax.io'
# 여러 수집 폴더는 '+'로 잇는다(뒤 폴더가 앞을 덮어씀)
raws = {'guest': [pathlib.Path(x) for x in sys.argv[1].split('+')]}
if len(sys.argv) > 2 and sys.argv[2] != '-': raws['member'] = [pathlib.Path(x) for x in sys.argv[2].split('+')]
mask = json.loads(pathlib.Path(sys.argv[3]).read_text('utf-8')) if len(sys.argv) > 3 else {}
import shutil, datetime
for d in ('pages', 'frags'): shutil.rmtree(ROOT / d, ignore_errors=True)
for d in ('css', 'pages', 'frags'): (ROOT / d).mkdir(exist_ok=True)

MASK_RE = re.compile('|'.join(r'(?<![0-9A-Za-z])' + re.escape(k) + r'(?![0-9A-Za-z])' for k in sorted(mask, key=len, reverse=True))) if mask else None
def masked(s, auth):
    if auth != 'member' or not MASK_RE: return s
    return MASK_RE.sub(lambda m: mask[m.group(0)], s)

# ---- CSS: 한 번 받아서 url()을 절대 경로로 바꿔 둔다
css_done = set()
def css_local(u):
    name = u.rsplit('/', 1)[1].split('?')[0]
    if name not in css_done:
        f = ROOT / 'css' / name
        if not f.exists():
            req = urllib.request.Request(u, headers={'User-Agent': 'Mozilla/5.0'})
            t = urllib.request.urlopen(req, timeout=30).read().decode('utf-8')
            base = u.rsplit('/', 1)[0] + '/'
            def fix(m):
                q, ref = m.group(1), m.group(2)
                if ref.startswith(('data:', 'http', '#')): return m.group(0)
                if ref.startswith('/'): return f'url({q}{ORIGIN}{ref}{q})'
                return f'url({q}{urllib.request.urljoin(base, ref)}{q})'
            t = re.sub(r'url\((["\']?)([^"\')]+)\1\)', fix, t)
            f.write_text(t, 'utf-8')
        css_done.add(name)
    return name

def fix_rules(rules):
    t = '\n'.join(rules)
    return re.sub(r'url\((["\']?)(/[^/"\')][^"\')]*)\1\)', lambda m: f'url({m.group(1)}{ORIGIN}{m.group(2)}{m.group(1)})', t)

def page_label(key, title):
    t = re.sub(r'\s*[|\-–]\s*TetherMax.*$', '', title or '').strip()
    path = '/' + key.replace('__', '/')
    return (t[:40] + ' · ' if t else '') + path

data = {'pages': {}, 'urlmap': {}}
def merge(a, b):
    for k, v in b.items():
        if isinstance(v, dict) and isinstance(a.get(k), dict): merge(a[k], v)
        else: a[k] = v
    return a

class Raw:
    def __init__(self, dirs): self.dirs = dirs
    def __truediv__(self, sub): return RawSub(self.dirs, [sub])
class RawSub:
    def __init__(self, dirs, parts): self.dirs, self.parts = dirs, parts
    def __truediv__(self, sub): return RawSub(self.dirs, self.parts + [sub])
    def _find(self):
        for d in reversed(self.dirs):
            f = d.joinpath(*self.parts)
            if f.exists(): return f
        return self.dirs[-1].joinpath(*self.parts)
    def exists(self): return self._find().exists()
    def read_text(self, enc): return self._find().read_text(enc)

for auth, dirs in raws.items():
    raw = Raw(dirs)
    index, acts = {}, {}
    for d in dirs:
        if (d / 'index.json').exists(): merge(index, json.loads((d / 'index.json').read_text('utf-8')))
        if (d / 'actions.json').exists():
            a = json.loads((d / 'actions.json').read_text('utf-8'))
            # 공통(헤더·푸터) 동작은 먼저 수집된 것이 우선 — 뒤 수집본의 다른 페이지 기준 결과로 덮지 않는다
            for vp, g in a.pop('_global', {}).items():
                tgt = acts.setdefault('_global', {}).setdefault(vp, {})
                for sig, x in g.items(): tgt.setdefault(sig, x)
            merge(acts, a)
    # 메뉴 항목 라벨 동작(_label) → 모든 페이지 공통, 상태는 홈(en) 소속
    for vp, labs in acts.pop('_label', {}).items():
        for lab, a in labs.items():
            acts.setdefault('_global', {}).setdefault(vp, {})['label:' + lab] = dict(a, key='en')
    for key, rec in index.items():
        P = data['pages'].setdefault(key, {'url': rec['url'], 'tpl': rec.get('tpl'), 'auth': {}})
        data['urlmap'][rec['url']] = key
        A = {'vp': {}}
        tpl_rep = acts.get('_tpl', {}).get(rec.get('tpl') or '', {})
        for vp in ('pc', 'mo'):
            v = rec['vp'].get(vp) or {}
            if 'error' in v or not (raw / 'pages' / f'{key}.{vp}.json').exists(): continue
            if v.get('redirected'):
                A['vp'][vp] = {'redirect': v['final']}; continue
            src_key = tpl_rep.get(vp, key) if rec.get('tpl') else key
            page_acts = dict(acts.get('_global', {}).get(vp, {}))
            page_acts.update(acts.get(src_key, {}).get(vp, {}))
            # 다른 페이지(템플릿 대표) 소속 상태 스냅숏은 이 페이지에서 쓸 수 없다 → 일반 처리
            for sig, a in list(page_acts.items()):
                if a['type'] == 'state' and not a['snap'].startswith(f'{key}.{vp}.') and not (a.get('key') and a['snap'].startswith(f'{a["key"]}.{vp}.')):
                    page_acts[sig] = {'type': 'none', 'label': a['label']}
            states, overlays = [], []
            snaps = {f'{key}.{vp}': None}
            for sig, a in page_acts.items():
                if a['type'] == 'state' and a['snap'].startswith(f'{key}.{vp}.') and (raw / 'pages' / f'{a["snap"]}.json').exists():
                    states.append({'id': a['snap'].split('.')[-1], 'label': a['label'], 'sig': sig})
                    snaps[a['snap']] = sig
                elif a['type'] == 'overlay':
                    overlays.append({'id': a['frag'], 'label': a['label'], 'sig': sig})
            # 템플릿 공유 상태 스냅숏은 대표 페이지 것을 쓴다(이 페이지 키로 파일이 없을 수 있음)
            for snap, sig in snaps.items():
                d = json.loads((raw / 'pages' / f'{snap}.json').read_text('utf-8'))
                html = masked(d['html'], auth)
                css_links = ''.join(f'<link rel="stylesheet" href="../css/{css_local(u)}">' for u in d['linkCss'])
                pt = {'auth': auth, 'key': key, 'vp': vp, 'snap': snap, 'stateSig': sig, 'acts': page_acts}
                inject = (css_links + f'<style data-pt-rules>{masked(fix_rules(d["rules"]), auth)}</style>'
                          + f'<script>window.PT={json.dumps(pt, ensure_ascii=False)}</script><script src="../pt-runtime.js"></script>')
                html = html.replace('</head>', inject + '</head>', 1)
                (ROOT / 'pages' / f'{auth}__{snap}.html').write_text('<!doctype html>' + html, 'utf-8')
            for o in overlays:
                f = raw / 'frags' / f'{o["id"]}.json'
                if not f.exists(): continue
                fr = json.loads(f.read_text('utf-8'))
                payload = {'html': masked(fr['html'], auth), 'css': masked(fix_rules(fr['rules']), auth)}
                (ROOT / 'frags' / f'{auth}__{o["id"]}.js').write_text(f'PT_FRAG({json.dumps(auth + "__" + o["id"])},{json.dumps(payload, ensure_ascii=False)});', 'utf-8')
            A['vp'][vp] = {'title': v.get('title', ''), 'states': states, 'overlays': overlays}
        if A['vp']:
            P['auth'][auth] = A
            P['label'] = P.get('label') or page_label(key, (A['vp'].get('pc') or A['vp'].get('mo') or {}).get('title', ''))

(ROOT / 'data.js').write_text('window.PT_DATA=' + json.dumps(data, ensure_ascii=False) + ';', 'utf-8')
n = sum(1 for _ in (ROOT / 'pages').glob('*.html'))
print('pages', len(data['pages']), 'snap files', n, 'css', len(css_done))
# 시작 파일: 실행 시각을 붙인 사본(재생성 산출물 규칙). index.html은 항상 최신
stamp = datetime.datetime.now().strftime('%Y%m%d_%H%M')
shutil.copyfile(ROOT / 'index.html', ROOT / f'TetherMax_실사이트프로토타입_{stamp}.html')
print('entry', f'TetherMax_실사이트프로토타입_{stamp}.html')
