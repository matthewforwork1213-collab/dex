# 상태 ↔ Figma 근거 대응 — 9. 계산기 `/payback` (`calc.*`)

- 찾은 방법: `tools/figfind.py` · `ref/figma_index.tsv` · `ref/figma_pages/3565-13728.xml`(`[MAX-146]`) · `28960-125519.xml`(DEX(revision)). Figma 스크린샷 대조 전이다.
- 확신: **확실** = 프레임 이름·라벨·문구가 상태와 일치 / **후보** = 추정(연결 후 스크린샷으로 확인).
- 기존 퍼널 `[MAX-146] Cashback Calculator`(3565:13728) 프레임은 이름이 `Web` · `mWeb/cashbackCalculator/{단계}`라 단계는 이름으로, 상태(선택됨·미선택)는 이름으로 구분되지 않는다 → 상태 구분은 대부분 후보.
- 기본 페이지 프레임: PC `Web` 1440(`7260:88375` 등) · mWeb `mWeb/cashbackCalculator/*` 375. DEX(revision)의 거래소 선택은 `First, which exchange do you use most?`와 `All · CEX · DEX` 칩을 사용한다. PC 6열·모바일 3열, 거래소별 브랜드 배너를 적용한다.

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| calc.p1:normal | Landing + Did you know 카드 | 7260:88375 / 8135:170663 | 기존 `Web` 7260:88375 · `mWeb/cashbackCalculator/landing` 8135:170663(구판 5123:32342) | 기존 | 확실 | `cashbackCalculator/landing` `You’re paying too many fees.` |
| calc.p1:noUsers | 사용자 수 없음 — 카드 숨김 | 7260:88375 / 8135:170663 | 카드 없는 랜딩 프레임 없음(MAX-146 모든 랜딩에 `81,836 of our users…` 카드) → 같은 프레임에서 카드만 뺌 | 재사용 컴포넌트(같은 프레임) | 후보 | `81,836` `of our users` |
| calc.p2:normal | 통합 그리드 — 선택 예시 | 29194:120700 / 29194:121368 | 기존 `MAXOP-405`의 선택 표시는 17996:179541 / 17996:179280. DEX 선택 예시는 29064:934 / 29064:1384 | 기존 + DEX | 확인 | `selectExchange` `First, which exchange do you use most?` |
| calc.p2:none | All · 미선택 — Next 비활성 | 29194:120700 / 29194:121368 | CEX 18개 예시와 노출 가능한 DEX 3개 예시를 함께 표시. CEX는 `Total Savings`, DEX는 `Cashback` | DEX | 확인 | `All` `Next` |
| calc.p2:cexChip | CEX 필터 | 29194:120979 / 29194:121473 | 기존 계산기 구조와 첨부 기준의 CEX 카드 18개 | 기존 + DEX | 확인 | `CEX` `Total Savings` |
| calc.p2:dexChip | DEX 칩 | 29064:934 / 29064:1384 | DEX(revision) `계산기 · 계산 과정 / PC` 29064:934 · `/ 모바일` 29064:1384(EdgeX 30% · ApeX · Aster 20%) · 메모 `계산기 · 계산 과정` 29062:115765 | DEX | 확실 | `계산기 · 계산 과정` `First, where do you trade most?` `All CEX DEX` |
| calc.p3:normal | 거래 프로필 — 빈도 선택됨 | 6510:88401 / 8135:170237 | 기존 PC `Web` 6510:88151(1440×900, 같은 단계 다른 변형) · `Prototype` mWeb `tradingProfile` 7260:73533(375×812) · 구판 mWeb 5123:31992 · DEX(revision) 29064:934(빈도 5개 카드 포함) | 기존 | 후보 | `tradingProfile` `How often do you trade per day?` `Regularly` |
| calc.p3:noFreq | 빈도 미선택 — Check Results 비활성 | 6510:88401 / 8135:170237 | 기존 `Web` 6510:88401(1440×1168) · `mWeb/cashbackCalculator/tradingProfile` 8135:170237 | 기존 | 확실(화면) · 미선택 여부 후보 | `tradingProfile` `Next, let’s check your trading profile.` |
| calc.p3l:normal (doc) | Lighter 계정 유형 — 단계 삭제(G-210) | — | 만들지 않음 | 해당 없음 | — | — |
| calc.p4c:normal | Calculating | 6510:88879 / 8135:170655 | 기존 `Web` 6510:88879 · `mWeb/cashbackCalculator/loading` 8135:170655(라벨 `Pending animation from Khoa (marketing team)` 6922:81430 · 8135:171145) | 기존 | 확실 | `loading` `You might be surprised...` `Pending animation` |
| calc.p4:cex | 결과 — CEX, Did you know | 6922:77328 / 7922:99923 | 기존 `Web` 6922:77328 · `mWeb/cashbackCalculator/6monthsInfo` 7922:99923(구판 6922:77987) · 큰 값 표시 `display huge values` 7148:138798 · 7148:138946 · 7148:139071 | 기존 | 확실 | `6monthsInfo` `What You’re Missing Out On` `On average, 81,836` |
| calc.p4:normal | 결과 — DEX(EdgeX), Did you know 숨김 | 6922:77328 / 7922:99923 | DEX 결과 프레임 없음 → CEX 결과 프레임에서 `Did you know?`만 뺌 · DEX 요율은 29064:934 | 재사용 컴포넌트(같은 프레임) | 후보 | `6monthsInfo` `Did you know` |
| calc.p5:cex | Summary — CEX | 6510:89041 / 8135:170693 | 기존 `Web` 6510:89041 · `mWeb/cashbackCalculator/summary` 8135:170693(구판 6575:26410) | 기존 | 확실 | `summary` `You’re all set. Here’s your summary.` `Payout Details` |
| calc.p5:normal | Summary — EdgeX (Daily · USDC 각주) | 6510:89041 / 8135:170693 | DEX Summary 프레임 없음 → 같은 프레임(플랫폼·각주·주기 값만 다름) | 재사용 컴포넌트(같은 프레임) | 후보 | `summary` `Schedule` `Payout Time` |
| calc.p5:aster | Summary — Aster 각주 | 6510:89041 / 8135:170693 | 위와 같음 | 재사용 컴포넌트(같은 프레임) | 후보 | `*Calculated based on paid trading fees` |
| calc.p5:apex | Summary — ApeX (G-025 대기) | 6510:89041 / 8135:170693 | 위와 같음 | 재사용 컴포넌트(같은 프레임) | 후보 | `Daily` |
| calc.p5:lighter | Summary — Lighter Weekly · Every Monday | 6510:89041 / 8135:170693 | 위와 같음 | 재사용 컴포넌트(같은 프레임) | 후보 | `Schedule` |
| calc.p5:mobile | 375폭 | — / 8135:170693 | 기존 `mWeb/cashbackCalculator/summary` 8135:170693 | 기존 | 확실 | `summary` |

## 확인할 점 (연결 후)

| 대상 | 내용 |
|---|---|
| p2 선택/미선택 | `MAXOP-405` mWeb 두 프레임(17996:178753 · 17996:179280) 높이가 다름 → 선택 여부·`Next` 활성 상태 스크린샷 확인 |
| p3 선택/미선택 | PC 6510:88151(900) · 6510:88401(1168) 중 어느 쪽이 빈도 선택 상태인지 확인 |
| `To be discussed` | 기존 `Web` 9903:203421 · 9903:203865 — 랜딩·선택 문구를 담고 있으나 용도 불명. 스크린샷 확인 |
| P5 첫 줄 라벨 | 기존 프레임 `Exchange`, 명세 REQ-459 `Platform` |
| P5 Payout Time 표기 | 기존 PC 6922:77328은 `07:00 UTC`, 6510:89041 · mWeb은 `07:00`. 사용자 화면은 로컬·라벨 없음(정책) |
