#!/usr/bin/env python3
"""Figma 페이지 메타데이터 XML(ref/figma_pages/*.xml)을 파싱해 화면 프레임 색인(ref/figma_index.tsv)을 만든다.

- 화면: frame/symbol/instance 중 웹(폭 1200~2560·높이>=600) 또는 모바일(폭 340~440·높이>=560) 크기.
  화면 크기 자식이 2개 이상인 프레임은 컨테이너로 보고 안으로 들어간다.
- 오버레이: 화면의 직계 자식 중 이름이 modal/dialog/popup/sheet/toast/drawer이거나,
  폭 300~700·높이 150~1000인 이름 있는 symbol/instance/frame.
- labels: shape-with-text·sticky의 이름을, 그 바로 아래(가로로 겹치고 세로 간격이 가장 작은) 화면에 붙인다.
사용: python tools/figindex.py
"""
import glob
import html
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGES = os.path.join(ROOT, 'ref', 'figma_pages')
OUT = os.path.join(ROOT, 'ref', 'figma_index.tsv')

SCREEN_TYPES = {'frame', 'symbol', 'instance'}
LABEL_TYPES = {'shape-with-text', 'sticky'}
OVERLAY_RE = re.compile(r'modal|dialog|popup|pop-up|sheet|toast|drawer', re.I)
GENERIC_RE = re.compile(
    r'^(frame|group|rectangle|vector|image|ellipse|line|container|auto layout|instance|component|mask group'
    r'|content|contents|copy|head|header|body|main|footer|top nav|nav|call|title|wrapper|card|list|<paper>)\s*\d*$'
    r'|^(tile|_|keyboard|numerickeyboard)', re.I)
DARK_RE = re.compile(r'dark|다크', re.I)
MWEB_RE = re.compile(r'mweb|mobile\s*web', re.I)
APP_RE = re.compile(r'mapp|mobile\s*app|\bapp\b', re.I)
TAG_RE = re.compile(r'<(/?)([a-z][a-z-]*)((?:\s+[a-zA-Z_:-]+="[^"]*")*)\s*(/?)>')
ATTR_RE = re.compile(r'([a-zA-Z_:-]+)="([^"]*)"')
CTRL_RE = re.compile(r'[\x00-\x1f\x7f]+')
LABEL_MAX_GAP = 600      # 라벨 하단 ~ 화면 상단 최대 간격
LABEL_TIE = 60           # 가장 가까운 화면과 이 차이 이내면 함께 붙임
LABEL_ABOVE_TOL = 20     # 라벨 하단이 화면 상단보다 이만큼까지 아래여도 허용


class Node:
    __slots__ = ('tag', 'id', 'name', 'x', 'y', 'w', 'h', 'hidden', 'children', 'parent')

    def __init__(self, tag, a, parent):
        self.tag = tag
        self.id = a.get('id', '')
        self.name = clean(a.get('name', ''))
        px, py = (parent.x, parent.y) if parent is not None and parent.tag != 'canvas' else (0.0, 0.0)
        self.x = px + num(a.get('x'))
        self.y = py + num(a.get('y'))
        self.w = num(a.get('width'))
        self.h = num(a.get('height'))
        self.hidden = a.get('hidden') == 'true' or (parent is not None and parent.hidden)
        self.children = []
        self.parent = parent


def num(v):
    try:
        return float(v)
    except (TypeError, ValueError):
        return 0.0


def clean(s):
    return CTRL_RE.sub(' ', html.unescape(s)).replace('\t', ' ').strip()


def parse(path):
    text = open(path, encoding='utf-8', errors='replace').read()
    end = text.rfind('</canvas>')
    if end >= 0:
        text = text[:end + 9]
    root, stack = None, []
    for m in TAG_RE.finditer(text):
        closing, tag, attrs, selfclose = m.groups()
        if closing:
            if stack:
                stack.pop()
            continue
        parent = stack[-1] if stack else None
        node = Node(tag, dict(ATTR_RE.findall(attrs)), parent)
        if parent is not None:
            parent.children.append(node)
        elif root is None:
            root = node
        if not selfclose:
            stack.append(node)
    return root


def screen_kind(n):
    if n.tag not in SCREEN_TYPES:
        return None
    if 1200 <= n.w <= 2560 and n.h >= 600:
        return 'web'
    if 340 <= n.w <= 440 and n.h >= 560:
        return 'mobile'
    return None


def is_overlay(c):
    if c.tag not in SCREEN_TYPES or not c.name:
        return False
    if OVERLAY_RE.search(c.name):
        return True
    return 300 <= c.w <= 700 and 150 <= c.h <= 1000 and not GENERIC_RE.match(c.name)


def ancestors(n):
    out, p = [], n.parent
    while p is not None and p.tag != 'canvas':
        out.append(p)
        p = p.parent
    return out[::-1]


def platform(n, path_names):
    """web: 폭 1200~1920. 모바일 폭(340~440)은 가까운 상위 section/frame부터 바깥으로,
    마지막에 자기 이름을 보고 처음 나오는 mWeb/mobile web(→mweb) 또는 mAPP/mobileAPP/App(→app)을 따른다
    (재사용 심볼 이름 'mWeb/...'이 mAPP 섹션 안에 있는 경우가 많아 섹션을 우선)."""
    if 1200 <= n.w <= 1920:
        return 'web'
    order = path_names[::-1] + [n.name]
    if 340 <= n.w <= 440:
        for s in order:
            if APP_RE.search(s):
                return 'app'
            if MWEB_RE.search(s):
                return 'mweb'
        return 'other'
    if any(APP_RE.search(s) for s in order):
        return 'app'
    return 'other'


def index_page(path):
    root = parse(path)
    if root is None:
        return []
    page_id, page_name = root.id, root.name
    rows, screens, labels = [], [], []

    def walk(n):
        for c in n.children:
            if c.tag in LABEL_TYPES:
                labels.append(c)
                continue
            if screen_kind(c):
                nested = sum(1 for g in c.children if screen_kind(g))
                if nested < 2:
                    add(c, 'screen', None)
                    for g in c.children:
                        if g is not c and not screen_kind(g) and is_overlay(g):
                            add(g, 'overlay', c)
                    continue
            if c.children:
                walk(c)

    def add(n, kind, parent_screen):
        anc = ancestors(n)
        sections = [a.name for a in anc if a.tag == 'section']
        names = [a.name for a in anc]
        dark = bool(DARK_RE.search(n.name) or any(DARK_RE.search(s) for s in names))
        plat = platform(parent_screen, [a.name for a in ancestors(parent_screen)]) if parent_screen else platform(n, names)
        row = {
            'page_id': page_id, 'page_name': page_name,
            'section_path': ' › '.join(sections), 'node_id': n.id, 'type': n.tag,
            'name': n.name, 'w': int(round(n.w)), 'h': int(round(n.h)),
            'hidden': int(n.hidden), 'dark': int(dark), 'platform': plat,
            'kind': kind, 'parent_id': parent_screen.id if parent_screen else '',
            'labels': [], '_n': n,
        }
        rows.append(row)
        if kind == 'screen':
            screens.append(row)

    walk(root)

    # 라벨 붙이기: 라벨과 가로로 겹치고, 라벨 하단 바로 아래에 상단이 있는 화면
    for lab in labels:
        if not lab.name:
            continue
        lb = lab.y + lab.h
        cands = []
        for r in screens:
            s = r['_n']
            if s.x >= lab.x + lab.w or s.x + s.w <= lab.x:
                continue
            gap = s.y - lb
            if -LABEL_ABOVE_TOL <= gap <= LABEL_MAX_GAP:
                cands.append((gap, r))
        if not cands:
            continue
        best = min(g for g, _ in cands)
        for g, r in cands:
            if g <= best + LABEL_TIE:
                r['labels'].append(lab.name)
    return rows


COLS = ['page_id', 'page_name', 'section_path', 'node_id', 'type', 'name', 'w', 'h',
        'hidden', 'dark', 'platform', 'kind', 'parent_id', 'labels']


def main():
    files = sorted(glob.glob(os.path.join(PAGES, '*.xml')))
    total = []
    for f in files:
        total.extend(index_page(f))
    with open(OUT, 'w', encoding='utf-8', newline='\n') as fp:
        fp.write('\t'.join(COLS) + '\n')
        for r in total:
            r = dict(r)
            r['labels'] = ' | '.join(dict.fromkeys(r['labels']))
            fp.write('\t'.join(str(r[c]).replace('\t', ' ').replace('\n', ' ') for c in COLS) + '\n')
    scr = [r for r in total if r['kind'] == 'screen']
    light = [r for r in scr if not r['dark'] and not r['hidden']]
    print(f'pages={len(files)} rows={len(total)} screens={len(scr)} light_visible_screens={len(light)} '
          f'overlays={len(total) - len(scr)} labeled_screens={sum(1 for r in scr if r["labels"])}')
    print('->', OUT)


if __name__ == '__main__':
    if hasattr(sys.stdout, 'reconfigure'):
        sys.stdout.reconfigure(encoding='utf-8')
    main()
