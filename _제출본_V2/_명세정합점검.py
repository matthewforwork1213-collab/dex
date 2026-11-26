# -*- coding: utf-8 -*-
"""명세 정합 점검 — 같은 요구사항·결정을 문서마다 다르게 말하는 곳을 찾는다.

왜 필요한가:
  REQ 행은 요구사항정의서와 기능명세서 4종에 그대로 복사된다. 한쪽만 고치면
  개발자가 어느 문서를 보느냐에 따라 구현이 달라진다. 또 부록 G에서 확정된
  결정이 본문에 ❓로 남아 있으면 개발자가 미정으로 읽는다. 2026-11-26 대조에서
  어드민 입력 필드와 사용자 API가 서로 다른 구조를 말하던 문제가 이 두 형태였다.

검사:
  1. REQ 사본 불일치 — 요구사항정의서의 구분·내용·인수 기준·상태와 기능명세서 사본 비교
  2. 확정된 G에 ❓ 표시 — 부록 G에서 ~~확정~~인 G-nnn 앞에 ❓가 붙은 곳
  3. 폐기 표현 — 결정으로 없어진 필드·값이 다시 들어온 곳

실행: python -I _명세정합점검.py
"""
import io
import os
import re
import sys

ROOT = r"C:\Users\oem\Desktop\tethermax_project\DEX"
DOC = os.path.join(ROOT, "02.기획문서")
POLICY = os.path.join(ROOT, "00_DEX_최종정책.md")
OUT = os.path.join(ROOT, "_제출본_V2", "_명세정합점검.txt")
REQ = os.path.join(DOC, "요구사항정의서.md")
SPECS = ["프론트_기능명세서_사용자.md", "백엔드_기능명세서_사용자.md",
         "프론트_기능명세서_백오피스.md", "백엔드_기능명세서_백오피스.md"]
SCAN = [POLICY] + [os.path.join(DOC, n) for n in os.listdir(DOC) if n.endswith(".md")]

# (표현, 이유) — 결정으로 없어진 것. 정책 부록 G 행(`| G-`)은 검사하지 않는다.
RETIRED = [
    ("safetyNote", "G-437: 안전 메시지는 Description 안"),
    ('"type": "IMAGE"', "G-270: 가이드 미디어는 데스크톱·모바일 .mp4"),
    ("경고 박스 `", "G-437: 경고 문장은 Description 안"),
    ("Section FAQ Content", "G-439: 섹션 안 질문·답변 쌍"),
    ("외부 버튼 표시명", "G-440: Right Box 탭 링크 사용"),
    ("ACCRUING_ESTIMATE", "G-100: Lighter 주중 추정치 미표시"),
    ("Accruing this week (estimate) {amount}", "G-100: Lighter 주중 추정치 미표시"),
    ("판정 H-14)", "G-270 · G-272 · G-273 확정"),
    ("스크린샷 1~5", "G-443: 기존 UID 찾기 단계 편집기"),
    ("300자 이내", "G-443: 기존 UID 찾기 단계 편집기"),
    ("Exchange Join Restriction Management`에서 운영자", "G-444: 제한 지역은 거래소 레코드 필드"),
    ("4 `Deposit`(`fiat`", "G-441: ELC Deposit 없음"),
    ("6개 언어(ko", "G-447: 수동 푸시 기존 화면"),
    ("G-156 답변", "G-156 확정"),
]


def read(p):
    with io.open(p, encoding="utf-8") as h:
        return h.read().splitlines()


def cells(line):
    return [c.strip() for c in line.strip().strip("|").split("|")]


def req_rows(path, layout):
    rows = {}
    for n, l in enumerate(read(path), 1):
        m = re.match(r"^\| (REQ-\d+|NFR-\d+) \|", l)
        if not m:
            continue
        c = cells(l)
        if layout == "req" and len(c) >= 7:
            rows.setdefault(m.group(1), []).append((n, {"구분": c[1], "내용": c[2], "인수 기준": c[4], "상태": c[-1]}))
        elif layout == "spec" and len(c) >= 6:
            rows.setdefault(m.group(1), []).append((n, {"구분": c[1], "내용": c[2], "인수 기준": c[3], "상태": c[-1]}))
    return rows


def main():
    out = ["# 명세 정합 점검", ""]
    total = 0

    # 1. REQ 사본
    base = req_rows(REQ, "req")
    diffs = []
    for name in SPECS:
        for rid, items in req_rows(os.path.join(DOC, name), "spec").items():
            if rid not in base:
                continue
            ref = base[rid][0][1]
            for n, row in items:
                for k in ("구분", "내용", "인수 기준", "상태"):
                    if row[k] != ref[k]:
                        diffs.append("   %s:%d %s [%s]\n      요구사항: %s\n      이 문서: %s"
                                     % (name, n, rid, k, ref[k][:160], row[k][:160]))
    out.append("🔴 **1. REQ 사본 불일치** — %d건" % len(diffs))
    out += diffs + [""]
    total += len(diffs)

    # 2. 확정된 G에 ❓
    pol = read(POLICY)
    done = {m.group(1) for l in pol for m in [re.match(r"^\| (G-\d+) \| ~~", l)] if m}
    stale = []
    for p in SCAN:
        for n, l in enumerate(read(p), 1):
            if l.startswith("| G-"):
                continue
            for m in re.finditer(r"❓\s*\(?(G-\d+)", l):
                if m.group(1) in done:
                    stale.append("   %s:%d %s — %s" % (os.path.basename(p), n, m.group(1), l.strip()[:140]))
    out.append("🔴 **2. 확정된 G에 ❓ 표시** — %d건" % len(stale))
    out += stale + [""]
    total += len(stale)

    # 3. 폐기 표현
    hits = []
    for p in SCAN:
        for n, l in enumerate(read(p), 1):
            if l.startswith("| G-") or l.startswith("| H-"):
                continue
            for s, why in RETIRED:
                if s in l:
                    hits.append("   %s:%d `%s` (%s)" % (os.path.basename(p), n, s, why))
    out.append("🔴 **3. 폐기 표현** — %d건" % len(hits))
    out += hits + [""]
    total += len(hits)

    out.append("합계 — %d건 (REQ 사본 %d / 확정 G의 ❓ %d / 폐기 표현 %d)" % (total, len(diffs), len(stale), len(hits)))
    with io.open(OUT, "w", encoding="utf-8") as h:
        h.write("\n".join(out) + "\n")
    sys.stdout.reconfigure(encoding="utf-8")
    print("REQ 사본 %d | 확정 G의 ❓ %d | 폐기 표현 %d → %s" % (len(diffs), len(stale), len(hits), OUT))


main()
