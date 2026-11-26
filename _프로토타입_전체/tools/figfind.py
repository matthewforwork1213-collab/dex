#!/usr/bin/env python3
"""Figma 화면 색인(ref/figma_index.tsv)에서 키워드로 프레임을 찾는다.

사용: python tools/figfind.py <키워드...> [--all] [--web|--mweb|--app] [--screens] [-n 40]
- 키워드는 대소문자 무시, 모두 포함(AND). 대상: 페이지명·섹션 경로·이름·라벨.
- 기본은 라이트·보이는 프레임만. --all이면 다크·숨김 포함(라이트가 먼저).
- --screens: 오버레이(모달·시트 등) 제외. -n: 최대 출력 행 수(기본 40, 0=전부).
"""
import csv
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
INDEX = os.path.join(ROOT, 'ref', 'figma_index.tsv')
FILE_KEY = 'hsa3bSV9QmFTe2jsf6tzTm'


def main(argv):
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    show_all, screens_only, plat, limit, kws = False, False, None, 40, []
    it = iter(argv)
    for a in it:
        if a == '--all':
            show_all = True
        elif a == '--screens':
            screens_only = True
        elif a in ('--web', '--mweb', '--app'):
            plat = a[2:]
        elif a == '-n':
            limit = int(next(it, '40'))
        elif a in ('-h', '--help'):
            print(__doc__)
            return
        else:
            kws.append(a.lower())
    if not kws:
        print(__doc__)
        return
    csv.field_size_limit(10 ** 7)
    with open(INDEX, encoding='utf-8', newline='') as fp:
        rows = list(csv.DictReader(fp, delimiter='\t', quoting=csv.QUOTE_NONE))
    hits = []
    for r in rows:
        if not show_all and (r['dark'] == '1' or r['hidden'] == '1'):
            continue
        if screens_only and r['kind'] != 'screen':
            continue
        if plat and r['platform'] != plat:
            continue
        hay = ' '.join((r['page_name'], r['section_path'], r['name'], r['labels'])).lower()
        if all(k in hay for k in kws):
            hits.append(r)
    hits.sort(key=lambda r: (r['dark'] == '1', r['hidden'] == '1'))
    print(f'{len(hits)}건 (키워드: {" ".join(kws)})')
    for r in hits[:limit or None]:
        flags = ''.join(f for f, on in (('D', r['dark'] == '1'), ('H', r['hidden'] == '1'),
                                        ('O', r['kind'] == 'overlay')) if on)
        lab = f"  [{r['labels']}]" if r['labels'] else ''
        print(f"{r['node_id']:<16} {r['platform']:<5} {r['w']}x{r['h']:<6} {flags:<3} "
              f"{r['page_name']} › {r['section_path']} › {r['name']}{lab}")
    if limit and len(hits) > limit:
        print(f'... 외 {len(hits) - limit}건 (-n 0으로 전부 보기)')
    if hits:
        print(f'링크: https://www.figma.com/design/{FILE_KEY}/?node-id=<node_id의 :를 ->')


if __name__ == '__main__':
    main(sys.argv[1:])
