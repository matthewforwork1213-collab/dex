# -*- coding: utf-8 -*-
"""확정 정책 20건이 산출물에 실제로 반영됐는지 역으로 검증.
   각 항목: (이름, [있어야 하는 것], [있으면 안 되는 것])"""
import io, os, glob, re
NL = chr(10)
ROOT = r"C:\Users\oem\Desktop\tethermax_project\DEX"
OUT = r"C:\Users\oem\AppData\Local\Temp\claude\c--Users-oem-Desktop-tethermax-project-DEX\c94207ea-f899-4e34-a897-c7b6e10da023\scratchpad\audit_policy.txt"

FILES = {}
for pat in [r"_프로토타입\*.html", r"_제출본_V2\*.md", r"_제출본_V2\**\*.md"]:
    for p in glob.glob(os.path.join(ROOT, pat), recursive=True):
        FILES[p] = io.open(p, encoding="utf-8").read()

# V1 구본·영문본은 금칙 검사에서 뺀다
def live(p):
    b = os.path.basename(p)
    return ("가능여부_국문" not in b) and ("_EN" not in b) and (
        not b.startswith(("Screen_", "Decision_", "Add-on", "Notifications",
                          "Existing_", "Maxboard_", "Backoffice_", "DEX_Cashback")))


CHECKS = [
 ("1  출금 모달 — 탭 분리 없음",
  ["탭 분리 없음", "우선순위"], ["출금 모달에서 CEX와 DEX를 탭으로"]),
 ("2  출금 외 — 컨트롤 1개 + 내부 그룹",
  ["컨트롤 1개", "그룹"], []),
 ("3  배지 — CEX 배지 없음",
  ["`CEX` 배지는 안 붙임", "CEX 배지는 붙이지 않습니다"], []),
 ("4  소유권 인증 DEX 미지원",
  ["소유권 인증", "미지원"], []),
 ("5  LINK UID 쿠폰 DEX 제외",
  ["LINK UID", "DEX 제외"], []),
 ("6  VIP 범위 밖",
  ["범위 밖"], ["| 7 | VIP 서비스 | X | **O** |"]),
 ("7  포인트 — 적용되나 거래소 축 없음",
  ["TUID"], []),
 ("8  친구 초대 주목할 거래소에 DEX",
  ["주목할 거래소"], []),
 ("9  타임라인은 홈",
  ["타임라인"], []),
 ("10 페이백 부스트 DEX 제외",
  ["부스트는 DEX를 고려하지 않습니다", "DEX 고려 안 함"],
  ["| 8 | 페이백 부스트 | X | **O** |"]),
 ("11 페이백 챌린지 DEX 미반영",
  ["챌린지는 DEX를 반영하지 않습니다", "DEX 미반영"],
  ["| 13 | 페이백 챌린지 | 부분 | **O** |"]),
 ("12 용어 — 한국어 페이백",
  ["페이백"], None),            # None = 전용 검사
 ("13 이메일 지갑 주소 전체 표기",
  ["전체 표시", "전체 표기"], []),
 ("14 연동완료 알림 타이밍 D-12",
  ["D-12"], []),
 ("15 브로커 — 어드민 제외",
  ["브로커는 하드코딩"], []),
 ("16 거래소 우선순위는 기존 기능",
  ["거래소 순위 수정"], ["전역 우선순위 API를 새로 만들"]),
 ("17 가스비 화면 미표시",
  ["표시하지 않음", "화면 미표시", "표시하지 않습니다"], []),
 ("18 매칭 출금 공식",
  ["A + MIN(B, A)", "A + MIN(B,A)"], []),
 ("19 초대 리워드 — 회원 DEX / 제휴사 CEX",
  ["제휴사 경로는 CEX 전용", "제휴사 출금 거래소"], []),
 ("20 랭킹에서 DEX 제외 (A-11)",
  ["랭킹에서 DEX", "랭킹 대상에서"], []),
]

buf = []
bad = 0
for name, must, never in CHECKS:
    hits = []
    for p, s in FILES.items():
        for m in must:
            if m in s:
                hits.append((os.path.basename(p), m))
                break
    viol = []
    if never:
        for p, s in FILES.items():
            if not live(p):
                continue
            for nv in never:
                if nv in s:
                    viol.append((os.path.basename(p), nv))
    mark = "OK " if hits and not viol else "!! "
    if not hits or viol:
        bad += 1
    buf.append(mark + name + "   근거 " + str(len(hits)) + "건" +
               ("   🔴 모순 " + str(len(viol)) + "건" if viol else ""))
    if not hits:
        buf.append("      → 근거를 못 찾았습니다")
    for f, v in viol[:4]:
        buf.append("      🔴 " + f + " : " + v[:60])

# 12번 전용 — 한국어 캐시백
buf.append("")
buf.append("── 용어 전용 검사 ──")
cb = []
for p, s in FILES.items():
    if not live(p):
        continue
    for mm in re.finditer("캐시백", s):
        ctx = s[max(0, mm.start() - 12):mm.start() + 10].replace(NL, " ")
        if "트레이더 캐시백" in ctx:
            continue
        cb.append(os.path.basename(p) + " : …" + ctx + "…")
buf.append("한국어 '캐시백' 잔존: " + str(len(cb)) + "건")
for c in cb[:8]:
    buf.append("   🔴 " + c)
if cb:
    bad += 1

buf.append("")
buf.append("합계 — 점검 " + str(len(CHECKS)) + "건 / 문제 " + str(bad) + "건")
io.open(OUT, "w", encoding="utf-8").write(NL.join(buf))
print("done", bad)
