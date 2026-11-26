# 디자인 누락 — 4. 홈 · 잔액 · 지갑 상세 · 출금 · 마이

DEX(revision)와 기존 페이지 어디에도 프레임이 없고, 가까운 기존 컴포넌트를 그대로 써서 만든 상태만 적는다. 상태별 근거 전체는 `ref/대응_home.md`.

## 어디에도 디자인이 없는 상태

| 화면id:상태 | 상태 설명 | V2.2 키 | 찾아본 키워드 | 지금 화면 |
|---|---|---|---|---|
| home.timeline:warning | 순차 지급 경고 | home/TL#warning | `순차` · `sequential` · `may vary` · `timeline` · `Earning` | MAXOP-783 타임라인 카드 + MUI Alert(warning). 가장 가까운 문구 `*Updates may vary by up to 1 hour.`(18919:116130) |

## 상태 정의는 있으나 모양은 재사용 컴포넌트로 만든 상태 (확인 요청)

DEX(revision) 「API 상태 흐름」 와이어 카드(29002:127590 · 29002:129132)가 상태만 정의하고, 화면은 기존 컴포넌트로 구성했다.

| 화면id:상태 | 상태 정의(흐름 카드) | 재사용한 모양(출처) |
|---|---|---|
| home.main:statuses · chips · inactive · labels | S4_03~S4_09 · S4_12 · S4_13 · S4_17 · S6_08~S6_11 | HW1 행 · 칩(28960:126108) |
| home.main:loading · home.wallet:loading · wd.claim:loading | — | `[MAX-425]` Loading state 5702:12582 스켈레톤 |
| home.main:error · home.wallet:error · wd.claim:balanceError · wd.claim:partner | S4_14 · S4_15 | Hub H7 `Balance did not load` 28960:126920 |
| home.main:delayed · home.wallet:delayed · wd.claim:delayed | S4_13 | Hub H6 `DEX data delayed` 28960:126914 |
| home.main:full | — | `Wallet address` 대화상자 28984:126296 |
| home.main:faq | — | `[MAX-7]` MAXOP-307 게스트 랜딩 FAQ 17000:66970 — 회원 홈에는 FAQ 섹션이 없음 |
| wd.claim:zero · noNetwork · preAccrual · lighter | S4_12 · S4_20 · S6_11 | `[MAX-18]` 출금 모달 계정 카드 12936:346690 + MUI Alert |
| wd.reflect:restored | S6_05 `Withdrawal returned` | CS1 일별 행(28960:127133) |
