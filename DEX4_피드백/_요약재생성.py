# -*- coding: utf-8 -*-
"""00_검토결과_요약.md 를 PDF 주석에서 직접 생성한다.
   - 주석과 요약이 어긋날 수 없게 만드는 것이 목적
   - 검토 차수·판정 정정 같은 히스토리는 싣지 않는다 (외부 공유 문서)"""
import io
import os
import re
import sys

import pymupdf as fitz

sys.stdout.reconfigure(encoding="utf-8")
NL = chr(10)
DST = r"C:\Users\oem\Desktop\tethermax_project\DEX\DEX4_피드백"

SHORT = {
    "Cashback Integration": "API (DEX Partner APIs)",
    "As a TetherMax admin": "BO 개요",
    "Backoffice PRD_ Edge": "BO Edge Cases",
    "Part 1": "BO Part 1",
    "Part 2": "BO Part 2",
    "Part 3": "BO Part 3",
    "Part 4": "BO Part 4",
    "MAX-1267": "DEX PRD (MAX-1267)",
    "DEX PRD_ Edge": "USER Edge Cases",
    "DEX Pages and Cross": "USER DEX Pages",
    "Hub and Navigation": "USER Hub",
    "Learn and Earn": "USER Quiz",
    "Service Flows": "USER Service Flows",
}


def short(fn):
    for k, v in SHORT.items():
        if k in fn:
            return v
    return fn[:24]


# ── 주석 수집 ────────────────────────────────────────────────────
items = {}
for fn in sorted(os.listdir(DST)):
    if not fn.lower().endswith(".pdf"):
        continue
    doc = fitz.open(os.path.join(DST, fn))
    for pno in range(len(doc)):
        pg = doc[pno]
        for a in pg.annots() or []:
            c = (a.info.get("content") or "").strip()
            if not c:
                continue
            head = c.split(NL)[0]
            if head in items:
                continue
            m = re.search(r"\b([SCMFOBR]-?\d{1,2}|B-01|O-4|R-3)\b", head)
            fid = m.group(1).replace("B-01", "B-01") if m else "?"
            items[head] = dict(id=fid, body=c, doc=short(fn), page=pno + 1)
    doc.close()


def key(it):
    fid = it["id"]
    g, _, n = fid.partition("-")
    try:
        n = int(n)
    except ValueError:
        n = 99
    # C-* 가 먼저, 번호 체계가 다른 B-01·O-4·R-3 은 뒤로
    return (0 if g in ("C", "M", "S", "F") else 1, n)


buckets = {"S": [], "F": [], "C": [], "M": [], "etc": []}
for h, it in items.items():
    fid = it["id"]
    g = fid.split("-")[0] if "-" in fid else "?"
    if g == "S":
        buckets["S"].append(it)
    elif g == "F":
        buckets["F"].append(it)
    elif g == "C":
        buckets["C"].append(it)
    elif g == "M":
        buckets["M"].append(it)
    else:
        # B-01 · O-4 · R-3 은 번호 체계만 다를 뿐 정면 충돌입니다
        buckets["C"].append(it)
for k in buckets:
    buckets[k].sort(key=key)

n_total = len(items)
n_fixed = sum(1 for it in items.values() if "확정 (2026-10-23)" in it["body"])

out = []
W = out.append

W("# DEX PRD 검토 결과")
W("")
W("작성 2026-10-23 · 대상 **PRD 13개 문서** · 기준 **TetherMax DEX 확정 정책**")
W("")
W("---")
W("")
W("## 이 폴더는 무엇입니까")
W("")
W("`DEX4/` 의 PRD 13개를 저희 확정 정책과 1:1로 대조한 결과입니다.")
W("")
W("- **`[검토] *.pdf` 13개** — 원본과 1:1. 해당 문장을 **노랑으로 칠하고 "
  "주석**을 달았습니다. 실제 작업은 이 PDF로 하시면 됩니다")
W("- **이 문서** — PDF 주석을 지적 단위로 모은 것입니다. "
  "**PDF 주석에서 자동 생성**하므로 둘이 어긋나지 않습니다")
W("")
W("| | |")
W("|---|---|")
W("| 지적 총계 | **%d종** |" % n_total)
W("| 2026-10-23 확정 답변이 붙은 것 | **%d종** |" % n_fixed)
W("| 구조 문제 | %d |" % len(buckets["S"]))
W("| 정면 충돌 | %d |" % len(buckets["C"]))
W("| 누락 | %d |" % len(buckets["M"]))
W("| 교차 점검(디자인·백오피스·프로토타입) | %d |" % len(buckets["F"]))
W("")
W("### 색 표시")
W("")
W("| 표시 | 뜻 |")
W("|---|---|")
W("| 🔴 | 확정 정책과 **정면으로 어긋납니다.** 고쳐야 합니다 |")
W("| 🟠 | 어긋나거나 빠졌지만 **판단 여지가 있습니다** |")
W("| 🟡 | **저희 쪽 공백**이거나 보완 사항입니다 |")
W("| ✅ **확정 (2026-10-23)** | 그 지적에 대한 **TetherMax 확정 답변**입니다. "
  "이대로 반영해 주십시오 |")
W("| 📌 | **아직 미결**입니다. 결정이 필요합니다 |")
W("")
W("---")
W("")


def dump(title, lead, rows):
    W("# " + title)
    W("")
    if lead:
        W(lead)
        W("")
    for it in rows:
        b = it["body"]
        h = b.split(NL)[0]
        rest = b.split(NL, 1)[1].strip() if NL in b else ""
        W("## " + h)
        W("")
        W("> 위치 — **%s** p%d" % (it["doc"], it["page"]))
        W("")
        W(rest)
        W("")
        W("---")
        W("")


dump("★ 구조 문제",
     "**개별 지적보다 먼저 봐야 합니다.** 백오피스 PRD 3종이 V2 구조 이전의 "
     "전제 위에 서 있습니다.",
     buckets["S"])

dump("교차 점검 — 디자인 · 백오피스 · 프로토타입",
     "요구사항 대조만으로는 보이지 않는 공백입니다. "
     "**세 각도의 결론이 같은 곳을 가리킵니다 — V2에서 돈이 움직이는 부분이 "
     "디자인에도, 백오피스 화면에도, 프로토타입에도 없습니다.**",
     buckets["F"])

F3 = """# 교차 점검 (이어서) — `F-3` 프로토타입 V2.1 ↔ PRD

> 이 항목만 PDF 주석이 없습니다. **PRD의 문제가 아니라 저희 산출물의 공백**이라
> 원본 PDF에 달 자리가 없습니다.

프로토타입 V2.1 은 확정 정책 기준으로 만들었으므로 정책 충돌은 위 `C`·`M` 에
이미 들어 있습니다. 여기서 본 것은 **PRD에는 있는데 V2.1 에 화면이 없는 영역**
입니다.

| PRD 영역 | PRD 언급 | V2.1 |
|---|---:|---|
| **계산기 퍼널** `PB-1`~`PB-9` | 23회 | 🔴 없음 (→ `M-14`) |
| **프리로그인 랜딩** `PLP-1`~`PLP-5` | 9회 | 🔴 없음 |
| **DEX 리포팅** `RPT-2`~`RPT-5` | 10회 | 🔴 없음 (→ `M-17`) |
| **파트너 허브 퍼널** `PH-3` | 1회 | 🔴 없음 |
| **SEO** `MSG-8` | 1회 | 🔴 없음 |
| **Wallet A/B 운영** | **663회** | 🟠 흔적만 1회 |

🔴 **`Wallet A/B` 가 PRD에 663회 나오는데 저희 프로토타입에는 1회뿐입니다.**
`F-2` 와 같은 공백입니다 — **V2의 자금 흐름을 보여주는 화면을 아직 아무도
만들지 않았습니다.**

**프리로그인 랜딩과 SEO 는 저희 검토가 한 번도 다루지 않은 영역**입니다.

---

"""

DECIDE = """# 📌 지금 결정할 것 — **없습니다**

**테더맥스 쪽 정책 결정은 전부 끝났습니다.** 남은 것은 두 종류뿐입니다.

### ① 파트너 회신 대기 — `M-4` Aster 월 상한

월 20,000 USDT 상한에 걸렸을 때의 처리는 **Aster 회신에 따라 갈리며, 분기는 이미 확정해 뒀습니다.**

| Aster 회신 | 테더맥스 처리 |
|---|---|
| 이월 가능 | **다음 달로 이월** (우선) |
| 이월 불가 | **상한 도달 시 적립 중단** |
| 소진율 조회 가능 | **사용자 화면에 잔여 한도 표시** |
| 소진율 조회 불가 | 사용자 화면 미표시 · 백오피스에서 월간 명세서로 수동 대사 |

🔴 **저희가 이미 물었고(`Aster API 요청 F5`) Aster가 아직 답하지 않았습니다.**
10-01 PM 회신 8항목에 이 질문은 포함되지 않았고, **공식 회신 문서는 아직 없습니다.**
같은 회신에서 *"pending amount is not easy to provide"* 라고 했으므로 **소진율 조회는 어려울 가능성이 높습니다.**

### ② 작성자가 채워야 할 빈칸 — `RPT-2` 메뉴 경로

`RPT-3`·`RPT-4`·`RPT-5` 가 전부 *"menu path: **the DEX reporting views (RPT-2)**"* 로 넘기는데 **`RPT-2` 에는 경로가 없습니다.** 테더맥스가 결정할 사항이 아닙니다.

---

# 🟡 저희 쪽에서 채워야 할 것

PRD 지적이 아니라 **저희 산출물의 공백**입니다.

| 항목 | 무엇 | 참조 |
|---|---|---|
| `/payback` 계산기 퍼널 6단계 | 캐시백 허브와 **별개 페이지**. 저희 문서 전체에 없었습니다 | `M-14` |
| DEX 리포팅 3종 | Lighter 주간 · Aster 바인딩 · ApeX/EdgeX 요약 | `M-17` |
| Wallet A→B 리밸런싱 · DEX 출금 승인 · 가스비 관리 화면 | 백오피스에도 프로토타입에도 없습니다 | `F-2`·`F-3` |
| 프리로그인 랜딩 · SEO | 저희 검토가 다루지 않은 영역 | `F-3` |
| 계산기 요율 중복 | 저희 `화면_수정_필요 11-9` 에 이미 있던 건 | `C-18` |

---

# 철회한 지적

확정 정책이 바뀌어 **더 이상 지적이 아닌 것**입니다. PDF 주석에서도 뺐습니다.

| 지적 | 철회 사유 |
|---|---|
| ~~`C-13` 퀴즈 보상이 DEX에 적용된다~~ | **퀴즈를 지원하기로 확정**했습니다. PRD가 맞습니다 (후속은 `C-13 (이어서)` 참조) |
| ~~`M-20` 연동 접수 시 `확인 중` 알림이 없다~~ | **접수 단계 알림을 두지 않기로** 했습니다. 파트너 API 응답 속도를 본 뒤 필요하면 다시 검토합니다 |
| ~~`M-27` 사용자 문구가 `Guest` 를 쓴다~~ | **비회원의 공식 표기는 `게스트`** 가 맞습니다. PRD가 맞습니다 |
| ~~`C-22` 센트 미만 잔여분을 영영 지급하지 않는다~~ | **0.01 USDT 미만은 원래 지급하지 않습니다.** `MC-6` 의 2자리 절삭·비이월은 저희 기준과 같습니다. PRD가 맞습니다 (관련 지적은 `M-2` 로 좁혔습니다) |

---

"""

dump("🔴 정면 충돌", "", buckets["C"])
dump("🟠 누락 · 보완", "", buckets["M"])
out.insert(out.index("# 🔴 정면 충돌"), F3 + DECIDE)

# ── 문서별 위치표 ───────────────────────────────────────────────
bydoc = {}
for it in items.values():
    bydoc.setdefault(it["doc"], []).append((it["page"], it["id"]))
W("# 문서별 주석 위치")
W("")
W("| PRD 문서 | 달린 지적 |")
W("|---|---|")
for d in sorted(bydoc, key=lambda x: -len(bydoc[x])):
    cells = sorted(set(bydoc[d]))
    W("| %s | %s |" % (d, " · ".join("`%s` p%d" % (i, p) for p, i in cells)))
W("")
W("`DEX PRD (MAX-1267)` 와 주석이 없는 문서는 **지금 기준으로 확정 정책과 "
  "어긋나는 점이 남아 있지 않은 문서**입니다. "
  "(MAX-1267 에 있던 `C-13` 퀴즈 지적은 퀴즈 지원 확정으로 철회했습니다.)")
W("")
W("---")
W("")
W("## 이 문서는 어떻게 만들어집니까")
W("")
W("**PDF 주석에서 자동으로 생성합니다.** 주석을 고치면 이 문서도 같이 바뀌므로, "
  "둘이 어긋날 수 없습니다. 검토 경과·판정 변경 이력은 **싣지 않습니다** — "
  "지금 유효한 지적과 확정만 남깁니다.")

io.open(os.path.join(DST, "00_검토결과_요약.md"), "w",
        encoding="utf-8").write(NL.join(out))
print("생성 완료 · 지적", n_total, "종 · 확정 반영", n_fixed, "종")
print("구조", len(buckets["S"]), "교차", len(buckets["F"]),
      "충돌", len(buckets["C"]), "누락", len(buckets["M"]))
