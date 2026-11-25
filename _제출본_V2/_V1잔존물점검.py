# -*- coding: utf-8 -*-
"""V1 잔존물 점검 — V2가 폐기한 전제가 아직 살아 있는 곳을 전수로 찾는다.

왜 필요한가:
  V2는 구조를 뒤집었다(테더맥스가 지급 주체가 됨). 그래서 V1 문장은 틀린 정도가 아니라
  정반대다. 그런데 작업이 문서별로 이뤄져서 같은 파일 안에 V1과 V2가 공존한다.
  사람 눈으로는 안 잡힌다 — 각각은 그럴듯한 문장이기 때문이다.

실행: python -I _V1잔존물점검.py
"""
import io
import os
import re

NL = chr(10)
ROOT = r"C:\Users\oem\Desktop\tethermax_project\DEX"
OUT = os.path.join(ROOT, "_제출본_V2", "_V1잔존물점검.txt")

# 스캔 대상 — 작업 폴더 + 제출본 + 프로토타입
SCAN_DIRS = [
    os.path.join(ROOT, "DEX"),
    os.path.join(ROOT, "_제출본_V2"),
    os.path.join(ROOT, "_프로토타입"),
]
SCAN_EXT = (".md", ".html")
SKIP_NAME = ("_V1잔존물점검",)

# ── V1 폐기 전제 ──────────────────────────────────────────────
# (키, 설명, [정규식...], 면책 정규식)
#   면책 = 같은 줄에 이게 있으면 "폐기됨을 설명하는 문장"이므로 통과
EXEMPT_COMMON = re.compile(
    r"폐기|retired|~~|V1|더 이상|no longer|void|대체|superseded|"
    r"뒤집|reversed|옛|former|과거|이전 판|금지|was wrong|틀렸|"
    r"정정|correct|소멸했|적용됩니다|applies|신설|반영 안|제외했",
    re.IGNORECASE)

RULES = [
    ("W-01", "테더맥스가 지급 주체가 아니라는 V1 전제",
     [r"테더맥스에서 출금하지 않습니다",
      r"테더맥스는 사용자를 DEX로 보내기만",
      r"TetherMax never moves money",
      r"페이백 보유 \| 테더맥스 \| \*\*사용자의 DEX 계정"]),

    ("W-02", "적립액이 출금해도 안 줄어든다는 V1 문구",
     [r"적립액은 출금해도 줄지 않습니다",
      r"doesn't go down when you withdraw",
      r"Exchange Cashback is what you have earned"]),

    ("W-03", "`Withdraw on {DEX}` 새 탭 리다이렉트 플로우",
     [r"Withdraw on \{DEX\}",
      r"Go to \{DEX\}",
      r"리다이렉트 다이얼로그",
      r"새 탭으로 열립니다",
      r"opened in a new tab"]),

    ("W-04", "최소 출금액이 DEX에 없다는 V1 결론",
     [r"최소 출금액 \| [^|]*\| \*\*없음",
      r"최소 출금액 \(CEX는",
      r"No minimum withdrawal",
      r"DEX에는 최소액이 없"]),

    ("W-05", "매칭 공식이 DEX에 없다는 V1 결론",
     [r"매칭 공식 \| [^|]*\| \*\*없음",
      r"매칭 공식 `페이백 \+ min\(이벤트 리워드, 페이백\)`$"]),

    ("W-06", "2차 인증·선차감·환불이 DEX에 없다는 V1 결론",
     [r"2차 인증 \| [^|]*\| \*\*없음",
      r"선차감·환불 \| 있음 \| \*\*없음",
      r"캡차, Google OTP, 이메일 2차 인증"]),

    ("W-07", "★ 출금 제한 72h/24h 가 DEX에 없다는 V1 결론 (보안)",
     [r"출금 제한 \(72h/24h\) \| 있음 \| \*\*없음",
      r"72h / 24h withdrawal blocks \| Yes \| \*\*None",
      r"비밀번호 변경 후 72시간 출금 차단",
      r"출금 이메일 인증 10회 실패 시 24시간 차단",
      r"DEX 출금 리다이렉트에는 계정 제한이 적용되지 않는",
      r"DEX 출금에는 계정 제한이 적용되지 않는"]),

    ("W-08", "이벤트 리워드가 DEX에서 제외된다는 V1 결론 (A-1이 뒤집음)",
     [r"이벤트 리워드 \| 있음 \| \*\*없음",
      r"이벤트 리워드가 없으므로"]),

    ("W-09", "초대 리워드가 DEX에서 제외된다는 V1 결론 (A-2가 뒤집음)",
     [r"초대 리워드 \| 있음 \| \*\*없음"]),

    ("W-10", "비회원은 조회만 가능하다는 V1 결론 (G-1이 뒤집음)",
     [r"비회원.{0,12}조회만",
      r"non-members can only look up",
      r"비회원은 출금할 수 없"]),

    ("W-11", "글로벌리그가 volume 필드에 의존한다는 V1 결론 (K-1이 뒤집음)",
     [r"volume.{0,30}있어야.{0,20}리그",
      r"리그.{0,30}volume.{0,20}의존",
      r"League works only if"]),

    ("W-12", "출금 신청 자체가 DEX에 없다는 V1 결론",
     [r"출금 신청 \| 있음 \| \*\*없음",
      r"출금 신청 자체$",
      r"DEX는 출금 신청 자체가 없어"]),

    ("W-13", "가스비가 발생하지 않는다는 V1 전제",
     [r"온체인 전송이 없으므로",
      r"가스비가 발생하지 않"]),

    ("W-14", "출금 딥링크를 '출금 경로'로 취급 (V2는 출금 경로가 아님)",
     [r"출금 딥링크",
      r"Withdrawal deep link",
      r"딥링크 미설정"]),
]

# ── 확정 정책이 '반영되어야 하는' 곳 점검 (양성 점검) ──────────
MUST = [
    ("M-01", "출금 제한 72h/24h 의 DEX 적용 여부가 어딘가에 명시돼야 함",
     r"WITHDRAW_AFTER_PASSWORD_72H|72시간 출금 차단.{0,40}(적용|DEX)"),
    ("M-02", "USDT 환산 0\\.05 미만 0 표시 규칙 (Aster 수수료 자산 환산에 직결)",
     r"0\.05.{0,20}(미만|이하).{0,20}0"),
    ("M-03", "랭킹 0\\.01 미만 제외 규칙 (A-11로 DEX가 랭킹에 들어오므로 적용 대상)",
     r"랭킹.{0,30}0\.01.{0,10}미만|0\.01.{0,10}미만.{0,30}랭킹"),
    ("M-04", "지갑 주소는 TUID 간 중복 불가 (기준선 7 선례)",
     r"TUID.{0,40}중복|중복.{0,40}TUID|one wallet address belongs to one TUID"),
    ("M-05", "`linked`/`연동 완료` 라벨 재사용 금지 (기준선 3-1)",
     r"linked.{0,20}라벨.{0,20}재사용|라벨 재사용 금지"),
]


def files():
    for d in SCAN_DIRS:
        for dp, _, fns in os.walk(d):
            for fn in fns:
                if not fn.endswith(SCAN_EXT):
                    continue
                if any(k in fn for k in SKIP_NAME):
                    continue
                yield os.path.join(dp, fn)


def rel(p):
    return os.path.relpath(p, ROOT)


hits = {}
corpus = []
reflect = []
reflect_src = []
BASELINE = "10_기존_테더맥스_기준선"
for p in files():
    try:
        s = io.open(p, encoding="utf-8").read()
    except Exception:
        continue
    corpus.append(s)
    if BASELINE not in p:
        reflect.append(s)
        reflect_src.append((p, s))
    lines = s.split(NL)
    for key, desc, pats in RULES:
        for pat in pats:
            rx = re.compile(pat)
            for i, ln in enumerate(lines, 1):
                if rx.search(ln) and not EXEMPT_COMMON.search(ln):
                    hits.setdefault(key, []).append(
                        (rel(p), i, ln.strip()[:150]))

buf = []
buf.append("# V1 잔존물 점검")
buf.append("")
buf.append("V2가 폐기한 전제가 아직 살아 있는 곳. 같은 줄에 폐기/정정 표시가 있으면 제외했다.")
buf.append("")

bad = 0
for key, desc, _ in RULES:
    h = hits.get(key, [])
    mark = "🔴" if h else "✅"
    buf.append(mark + " **" + key + "** " + desc + " — " + str(len(h)) + "건")
    if h:
        bad += len(h)
        seen = set()
        for f, i, ln in h:
            k = (f, i)
            if k in seen:
                continue
            seen.add(k)
            buf.append("   " + f + ":" + str(i))
            buf.append("      " + ln)
    buf.append("")

buf.append("---")
buf.append("")
buf.append("## 양성 점검 — 기존 규칙이 DEX 산출물에 반영됐는가")
buf.append("")
buf.append("> 기준선 문서(10_기존_테더맥스_기준선.md) 자신은 제외했다 — "
           "규칙의 출처이지 반영처가 아니다.")
buf.append("")
allsrc = NL.join(reflect)
miss = 0
for key, desc, pat in MUST:
    found = [rel(p) for p, t in reflect_src if re.search(pat, t)]
    ok = bool(found)
    buf.append(("✅" if ok else "🔴") + " **" + key + "** " + desc)
    if ok:
        buf.append("   → " + " · ".join(sorted(set(found))[:4]))
    else:
        miss += 1
    buf.append("")
buf.append("")
buf.append("합계 — V1 잔존 " + str(bad) + "건 / 미반영 " + str(miss) + "건")

io.open(OUT, "w", encoding="utf-8").write(NL.join(buf))
print("V1잔존", bad, "| 미반영", miss)
