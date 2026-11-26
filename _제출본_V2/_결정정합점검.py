# -*- coding: utf-8 -*-
"""확정 결정 정합 점검 — 같은 결정을 문서와 프로토타입이 다르게 말하는 곳을 찾는다.

왜 필요한가:
  V2가 V1 결정을 여러 건 뒤집었다. 그런데 뒤집은 결과를 세 곳(결정기록 · 제출 문서 ·
  프로토타입)에 동시에 반영하지 않아서, 어디를 먼저 읽느냐에 따라 답이 달라진다.
  사람 눈으로는 못 잡는다 — 각각은 그 자리에서 말이 되기 때문이다.

실행: python -I _결정정합점검.py
"""
import io
import os
import re

NL = chr(10)
ROOT = r"C:\Users\oem\Desktop\tethermax_project\DEX"
OUT = os.path.join(ROOT, "_제출본_V2", "_결정정합점검.txt")

# 같은 줄(또는 바로 다음 줄)에 이게 있으면 '폐기를 설명하는 문장'이므로 잡지 않는다.
# 이 레이어가 없으면 정정문 자체를 V1 잔재로 보고한다 — 2026-10-23에 실제로 그랬다.
EXEMPT = re.compile(
    r"폐기|retired|~~|V1|더 이상|no longer|void|대체|superseded|뒤집|reversed|"
    r"정정|correct|틀렸|was wrong|적용됩니다|applies|소멸|근거가 사라|전제가|"
    r"였습니다|이었습니다|참조|→|확정 2026-10-2[23]|2026-10-23|\\*\\*O\\*\\*|O 적용|페이백 기준|오류 정정",
    re.IGNORECASE)

AREAS = {
    "결정기록": [os.path.join(ROOT, "_제출본_V2", "6_기존PRD_분석")],
    "제출문서": [os.path.join(ROOT, "_제출본_V2", "2_화면_수정_필요"),
              os.path.join(ROOT, "_제출본_V2", "3_연동_출금_플로우"),
              os.path.join(ROOT, "_제출본_V2", "4_백오피스_vs_하드코딩"),
              os.path.join(ROOT, "_제출본_V2", "5_부가서비스_연동가능여부"),
              os.path.join(ROOT, "_제출본_V2", "7_맥스보드_DEX반영")],
    "프로토타입": [os.path.join(ROOT, "_프로토타입")],
}

# (ID, 주제, V2 확정 내용, [V2가 맞음을 보이는 정규식], [V1 잔재 정규식])
DECISIONS = [
    ("A-1", "DEX 이벤트 리워드",
     "DEX도 이벤트 리워드를 받습니다",
     [r"A-1\b.{0,80}(이벤트|event)", r"이벤트 리워드.{0,40}(허용|받습니다|적용|있음)"],
     [r"이벤트 리워드 전면 배제", r"이벤트 리워드.{0,20}\*\*없음\*\*"]),

    ("A-2", "DEX 초대 리워드",
     "CEX UID와 동일하게 취급합니다",
     [r"A-2\b.{0,80}(초대|invite)", r"초대 리워드.{0,40}(동일|허용|적용)"],
     [r"초대 리워드 \| 있음 \| \*\*없음"]),

    ("A-11", "DEX 랭킹 포함",
     "랭킹에 DEX를 포함합니다 (V2에서 뒤집힘)",
     [r"9-1-1", r"랭킹.{0,40}(포함|included)",
      r"한 리스트에서 순위", r"CEX UID와 DEX 지갑이"],
     [r"랭킹에서 DEX를 (제외|뺍)"]),

    ("A-18", "마일스톤 · VIP 진행바",
     "마일스톤·VIP 진행바는 없는 기능 — 모든 화면에서 제외 (사용자 2026-11-26)",
     [r"마일스톤", r"milestone"],
     [r"마일스톤·VIP 진행바에서 \*\*DEX를 제거",
      r"remove DEX from the milestone and VIP progress bars"]),

    ("G-1", "비회원 DEX 출금",
     "비회원도 CEX와 동일하게 출금 가능",
     [r"G-1\b", r"비회원.{0,40}출금.{0,20}(가능|허용|동일)"],
     [r"비회원.{0,12}조회만"]),

    ("K-1", "글로벌리그 점수 기준",
     "페이백 금액 기준 — volume 불필요",
     [r"K-1\b", r"리그.{0,40}페이백 (금액 )?기준"],
     [r"리그.{0,30}volume.{0,20}의존"]),

    ("F-1", "가스비",
     "테더맥스가 전액 부담 · 화면 미표시",
     [r"F-1\b", r"가스.{0,30}(전액|absorb)",
      r"가스비는 테더맥스가 부담", r"가스.{0,20}테더맥스가 (전액 )?부담"],
     [r"가스비가 발생하지 않"]),

    ("B-5", "미수령 10 USDT 이상 연동 차단",
     "CEX와 동일하게 DEX에도 적용",
     [r"B-5\b", r"FAILED_NEED_RECEIVE"],
     []),

    ("A-16", "DEX 소유권 신청",
     "이번 릴리스에서 제외",
     [r"A-16\b", r"소유권 (인증|경로).{0,20}(지원하지 않|없습니다|미지원)"],
     [r"소유권 인증 5종.{0,30}그대로 재사용"]),

    ("부스트", "페이백 부스트",
     "DEX 반영 안 함 (2026-10-22 확정)",
     [r"부스트.{0,30}(반영 안 함|DEX를 고려하지)"],
     []),

    ("챌린지", "페이백 챌린지",
     "DEX 반영 안 함",
     [r"챌린지.{0,40}(반영 안 함|사용할 수 없|제외)"],
     []),

    ("매칭", "출금 매칭 공식",
     "A + MIN(B, A) — DEX에도 동일 적용",
     [r"MIN\(B, ?A\)", r"min\(이벤트 리워드, ?페이백\).{0,30}동일"],
     [r"매칭 공식 \| [^|]*\| \*\*없음", r"매칭 리워드 \| 있음 \| \*\*없음"]),

    ("최소액", "최소 출금액 10 USDT",
     "DEX에도 동일 적용",
     [r"10 USDT.{0,40}(동일|적용|applies)"],
     [r"최소 출금액 \| 10 USDT \| \*\*없음", r"DEX에는 최소액이 없"]),
]


def read_area(dirs):
    out = []
    for d in dirs:
        for dp, _, fns in os.walk(d):
            for fn in fns:
                if not fn.endswith((".md", ".html")):
                    continue
                if "점검" in fn:
                    continue
                p = os.path.join(dp, fn)
                try:
                    out.append((os.path.relpath(p, ROOT),
                                io.open(p, encoding="utf-8").read()))
                except Exception:
                    pass
    return out


AREA_TXT = {k: read_area(v) for k, v in AREAS.items()}


def scan(area, pats, exempt=False):
    """해당 영역에서 패턴에 맞는 파일:줄 목록.
       exempt=True 면 정정문으로 보이는 줄은 뺀다(V1 잔재 탐지용)."""
    found = []
    for rp, txt in AREA_TXT[area]:
        lines = txt.split(NL)
        for pat in pats:
            rx = re.compile(pat, re.IGNORECASE)
            for i, ln in enumerate(lines, 1):
                if not rx.search(ln):
                    continue
                if exempt:
                    # 같은 줄 또는 바로 뒤 2줄에 정정 표시가 있으면 통과
                    ctx = NL.join(lines[i - 1:i + 2])
                    if EXEMPT.search(ctx):
                        continue
                found.append((rp, i, ln.strip()[:130]))
    return found


buf = ["# 확정 결정 정합 점검", "",
       "같은 결정을 결정기록 · 제출문서 · 프로토타입이 다르게 말하는 곳.", ""]
bad = 0

for did, topic, verdict, ok_pats, v1_pats in DECISIONS:
    rows = []
    for area in ("결정기록", "제출문서", "프로토타입"):
        ok = scan(area, ok_pats) if ok_pats else []
        v1 = scan(area, v1_pats, exempt=True) if v1_pats else []
        rows.append((area, ok, v1))

    any_v1 = any(v1 for _, _, v1 in rows)
    silent = [a for a, ok, v1 in rows if not ok and not v1]

    if "★미결★" in verdict:
        # 반영 상태와 무관하게, 사용자 확정 전까지 계속 보고한다.
        buf.append("🟡 **" + did + "** " + topic + " — " + verdict)
        for area, ok, v1 in rows:
            buf.append("   " + ("✅" if ok else "⚠️") + " " + area
                       + (" — " + str(len(ok)) + "곳" if ok else " — 언급 없음"))
        buf.append("")
        continue

    if not any_v1 and not silent:
        buf.append("✅ **" + did + "** " + topic + " — " + verdict)
        buf.append("")
        continue

    bad += 1
    buf.append("🔴 **" + did + "** " + topic)
    buf.append("   확정: " + verdict)
    for area, ok, v1 in rows:
        if v1:
            buf.append("   🔴 " + area + " — V1 잔재 " + str(len(v1)) + "건")
            seen = set()
            for f, i, ln in v1:
                if (f, i) in seen:
                    continue
                seen.add((f, i))
                buf.append("      " + f + ":" + str(i))
                buf.append("         " + ln)
        elif not ok:
            buf.append("   ⚠️ " + area + " — 언급 없음")
        else:
            buf.append("   ✅ " + area + " — " + str(len(ok)) + "곳")
    buf.append("")

buf.append("---")
buf.append("합계 — 문제 " + str(bad) + " / " + str(len(DECISIONS)) + "건")
io.open(OUT, "w", encoding="utf-8").write(NL.join(buf))
print("문제", bad, "/", len(DECISIONS))
