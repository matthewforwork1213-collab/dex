# 디자인 상태 점검 — 거래 계정 연동 (link)

2026-11-26 · 대상 Figma [DEX(revision)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519)의 보이는 프레임, 없으면 기존 페이지 [[MAX-30] Link UID](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=8013-42844) · 범위 FU-012 · FU-013~FU-028 · CEX UID 연동 화면 · API-001·002·003·006·007·008·009·023·025·026

## 요약

| 항목 | 수 |
|---|---|
| 상태 | 117개 (PC·모바일 판정 칸 234개) |
| 있음 | 132 |
| 기존 페이지에 있음 | 4 |
| 없음 | 48 |
| 정책과 다름 | 36 |
| 중복·모순 | 3 |
| 미정(부록 G 결정 대기) | 6 |
| 해당 없음(화면이 필요 없는 칸) | 5 |
| 명세 누락 후보(Figma에만 있음) | 8 |
| 디자이너 요청 | 37건 — 우선 1: 3 · 우선 2: 20 · 우선 3: 14 |

| 읽는 법 | 내용 |
|---|---|
| 판정 | `있음` 보이는 프레임에 있고 정책과 맞음 · `기존` 기존 페이지에만 있음 · `없음` 보이는 프레임에 없음 · `다름` 있으나 정책·원문과 다름 · `모순` 같은 상태를 프레임끼리 다르게 그림 · `미정` 부록 G 결정 전 · `해당없음` 화면이 필요 없음 |
| 판정 근거 | 프레임 이름이 아니라 보이는 텍스트 레이어의 실제 문구로 판정했다. 입력 모달 크기는 렌더로 확인했다. 숨김 프레임(API 상태 흐름 보드 1~8, 진입과 복귀 경로 29005:126470)은 근거로 쓰지 않았다 |
| 다크 | 모바일 다크 사본은 라이트와 문구가 같아 라이트 노드만 적었다 |
| 우선순위 | 1 = 화면대로 만들면 정책과 다르게 동작하거나 개발이 막힘 · 2 = 개발자가 추측해야 함(상태 없음·확정 문구와 다름) · 3 = 다듬기 |

## FU-012. 비회원 조회와 연동 후 지급 (API-023 · API-001 · API-007)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 게스트 조회 진입 | 홈 푸터 Company > Claim Cashback | 비로그인 홈 푸터 클릭 | 페이지 | `Claim Cashback` | REQ-175 | 있음 [검색 초기(푸터)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97622) | 있음 [홈 푸터](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-113704) · [푸터](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29072-1797) |  |
| 게스트 조회 | 검색 초기 — 거래소 미선택 | 진입 직후 | 페이지 | `Check your cashback` | REQ-179 | 있음 [29035:97622](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97622) | 있음 [29035:97732](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97732) | 입력란 `Select an exchange first` |
| 게스트 조회 | 거래소 선택기 All | `Select exchange` 클릭 | 모달/바텀시트 | `Search for an exchange` | REQ-055 · 29248:120200 | 있음 [29035:98030](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98030) | 있음 [29035:98094](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98094) |  |
| 게스트 조회 | 선택기 CEX / DEX 칩 | 칩 클릭 | 모달/바텀시트 | — | REQ-055 | 있음 [CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29179-115909) · [DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29179-116130) | 있음 [CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29179-116351) · [DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29179-116630) |  |
| 게스트 조회 | 선택기 검색 결과 없음 | 검색어 0건 | 모달 안 빈 상태 | `No results found` | REQ-056 | 없음 | 없음 | 연동 선택기 모바일 29051:104597만 있음 |
| 게스트 조회 | DEX 선택 · 입력 대기 | DEX 선택 | 폼 | `Enter your wallet address`(placeholder) | REQ-175 | 있음 [29037:102201](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102201) | 있음 [29037:102272](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102272) |  |
| 게스트 조회 | CEX 선택 · 입력 대기 | CEX 선택 | 폼 | `Enter your UID` | REQ-180 | 있음 [29037:102332](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102332) | 있음 [29037:102403](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102403) |  |
| 게스트 조회 | DEX 주소 입력 완료 | 주소 입력 | 폼 | — | REQ-175 | 있음 [29035:98155](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98155) | 있음 [29035:98218](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98218) |  |
| 게스트 조회 | CEX UID 입력 완료 | UID 입력 | 폼 | — | REQ-180 | 있음 [29035:98278](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98278) | 있음 [29035:98341](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98341) |  |
| 게스트 조회 | 400 빈 값 | `VALIDATION_ERROR`(빈 값) | 인라인 | `Enter your wallet address.` | API-023 · REQ-067 | 있음 [29035:98401](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98401) | 있음 [29035:98465](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98465) |  |
| 게스트 조회 | 400 지갑 주소 형식 오류(내부 공백·이름·제로 주소·지원 안 하는 형식) | `VALIDATION_ERROR` | 인라인 | A-12 문구 7종 | API-023 · REQ-065 · REQ-067 | 없음 | 없음 | 빈 값 1종만 있음 |
| 게스트 조회 | 400 CEX UID 형식 오류 | `VALIDATION_ERROR` | 인라인 | 원문 없음 | API-023 · REQ-180 | 없음 | 없음 |  |
| 게스트 조회 | 조회 중 | 요청 대기 | 버튼 로딩 | `Checking this account with the exchange…` · `Searching…` | API-023 | 있음 [29035:98526](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98526) | 있음 [29035:98580](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98580) |  |
| 게스트 결과 | `FOUND` 10 USDT 이상(거래소 캐시백 + 매칭 리워드) | 200 `FOUND` amount ≥ 10 | 결과 카드 | `10 USDT minimum reached. Link your account to receive your cashback.` | API-023 · REQ-179 | 있음 [29035:97792](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97792) | 있음 [29035:97855](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97855) | `Sign up to link account` · `Already a member? Log in…` · `Search again` |
| 게스트 결과 | `FOUND` 0 초과 10 미만 | 200 `FOUND` 0 < amount < 10 | 결과 카드 | `Below the 10 USDT payout minimum.` | API-023 · G-418 | 다름 [29035:98631](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98631) | 다름 [29035:98694](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98694) | 사용자 문구에 `payout` |
| 게스트 결과 | `FOUND` 0 | 200 `FOUND` amount = 0 | 결과 카드 | `No cashback recorded yet.` | API-023 | 있음 [29035:98754](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98754) | 있음 [29035:98817](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98817) | 같은 묶음 메모(29039:99769)는 `No cashback yet` |
| 게스트 결과 | CEX UID `FOUND` | 200 `FOUND`(CEX) | 결과 카드 | `UID ••••5687` | REQ-180 | 있음 [29035:99309](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99309) | 있음 [29035:99372](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99372) |  |
| 게스트 결과 | `NO_PUBLIC_RESULT` | 200 `NO_PUBLIC_RESULT` | 페이지 안내 | `No public result` | API-023 | 있음 [29035:98877](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98877) | 있음 [29035:98933](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98933) | 금액 숨김 |
| 게스트 결과 | `DATA_PENDING` | 200 `DATA_PENDING` | 페이지 안내 | `Cashback is being updated` | API-023 | 있음 [29035:98986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98986) | 있음 [29035:99040](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99040) |  |
| 게스트 결과 | 429 조회 제한 | 429 `RATE_LIMITED` | 페이지 안내 | `Too many searches` | API-023 | 있음 [29035:99200](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99200) | 있음 [29035:99256](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99256) | `Try again later` |
| 게스트 결과 | 500 · 503 일시 오류 | 500 / 503 | 페이지 안내 + 재조회 | `Couldn’t load cashback` | API-023 | 있음 [29035:99091](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99091) | 있음 [29035:99147](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99147) | 입력 유지 |
| 게스트 → 인증 | 회원가입 · 로그인 | `Sign up to link account` · `Log in` | 페이지 | 기존 화면 | REQ-178 | 있음 [가입](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110754) · [로그인](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110849) | 있음 [가입](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110789) · [로그인](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110880) |  |
| 게스트 → 인증 | 인증 취소 → 직전 결과로 복귀 | 인증 화면 닫기 | 페이지 복귀 | — | FU-012 설명 | 있음 [메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110962) | 있음 [메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110962) | 결과 화면 재사용(메모로 정의) |
| 게스트 → 연동 | 로그인 후 미연동 — DEX 지갑 | 인증 성공 | 결과 카드 CTA | `Link this trading account` · `Link account` | REQ-178 | 있음 [29035:97915](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97915) | 있음 [29035:97974](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97974) |  |
| 게스트 → 연동 | 로그인 후 미연동 — CEX UID | 인증 성공 | 결과 카드 CTA | 같음 | REQ-180 | 있음 [29037:102463](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102463) | 있음 [29037:102530](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102530) |  |
| 게스트 → 연동 | `Link account` → 같은 거래소·주소가 채워진 연동 폼 | CTA 클릭 | 연동 모달 | — | FU-012 설명 · REQ-180 | 없음 | 없음 | 연결 화살표(29037:113804~)만 있음 |
| 게스트 조회 | 게스트 출금 버튼·캡차·완료 토스트 제거 | — | — | — | REQ-175 | 있음 [29035:97792](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97792) | 있음 [29035:97855](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97855) | `Withdraw` 0건 확인 |

## FU-013. 연동 진입·거래소 선택 (API-001 · API-006)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| Link Account | 체크리스트 진입 — 아무것도 선택 안 됨 | 홈 S3 체크리스트 3단계 | 모달 | `Select a partner` / `Select the partner you trade on to see how to link your account.` | REQ-051 · ❓ G-379 | 있음 [S3-2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127765) · [L16](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127367) | 없음 | 모바일 빈 상태 카드(`empty_state`) 진입의 빈 선택 화면 없음 |
| Link Account | Linked Accounts 푸터 진입 — 선택기 All | `Using multiple platforms? Link more accounts` | 팝오버/바텀시트 | `Search for an exchange` / `Search exchanges` | REQ-051 | 있음 [L17](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127381) · [S4-2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-122305) | 있음 [28969:126953](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) |  |
| Link Account | DEX 상세 진입 — 그 DEX 선택 | 상세 `Link Wallet` | 모달 | — | REQ-051 | 있음 [L0](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127412) · [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) |  |
| Link Account | 허브 진입 — 그 거래소 선택 | 허브 연동 CTA | 모달 | — | REQ-051 | 있음 [L2(같은 상태)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | 있음 [(같은 상태)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | 허브에서 여는 프레임은 따로 없음 |
| Link Account | 웹 꽉 찬(전체 화면) 모달 | 웹 연동 진입 | 전체 화면 모달 | — | REQ-712 | 다름 [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [L3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127279) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | PC 입력 단계가 600px 부분 모달(결과만 전체 화면) |
| Link Account | STG `/uidlinking` 진입 질문 | 웹 연동 진입 | 전체 화면 | `Have you registered a trading account with the TetherMax referral code?` · `Yes, I have one!` / `No, not yet!` | REQ-712 | 없음 | 해당없음 | 기존 [MAX-30] 페이지에도 없음 |
| 거래소 선택기 | 칩 All / CEX / DEX(처음 All) | 선택기 열기 · 칩 클릭 | 팝오버/바텀시트 | `All` · `CEX` · `DEX` | REQ-055 | 있음 [컴포넌트](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29225-119304) · [CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-119719) · [DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-119723) | 있음 [All](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) · [CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28986-126528) · [DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28986-126557) |  |
| 거래소 선택기 | All 목록 DEX 행 배지 | All 칩 | 배지 | `DEX` | REQ-055 | 있음 [29225:119305](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29225-119305) | 없음 | 모바일 All 목록에 배지 텍스트 없음 |
| 거래소 선택기 | 검색 결과 1건 · 여러 건 | 검색 입력 | 목록 | `1 exchange found` · `2 exchanges found` | REQ-056 | 없음 | 있음 [1건](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-104415) · [여러 건](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-104229) |  |
| 거래소 선택기 | 검색 결과 없음 | 검색 0건 | 빈 상태 | `No results found` | REQ-056 | 없음 | 있음 [29051:104597](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-104597) | 모바일 `No results found for “bit”`(기존 CEX 형식) |
| 거래소 선택기 | 파트너 목록 로드 실패(캐시 없음) | API-001 503 · 캐시 없음 | 선택기 안 오류 | 오류 + `Retry`, `Top Partner Exchanges` 숨김 | G-097 · REQ-059 · API-001 | 없음 | 없음 | 숨김 보드 S5_05에만 있음 |
| Link Account | 모달 제목 거래 계정 중립어 | — | 제목 | `Link Account`(UID 0건) | REQ-054 | 다름 [CEX 폼](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-120903) | 다름 [CEX 폼](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-100488) | DEX 폼은 `Link Account`, CEX 폼은 `Link your exchange UID` |
| Link Account | 가입 링크(모든 상태) | — | 링크(새 탭) | `Don’t have an account yet? Sign up here` | REQ-053 | 다름 [CEX 폼](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-120903) | 다름 [선택 시트](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) · [CEX 폼](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-100488) | CEX 폼·선택 시트 뒤 폼이 `Register here` |
| 거래소 선택기 | Lighter 행에 계정 유형 제한 표현 없음 | — | — | — | REQ-058 | 있음 [29225:119305](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29225-119305) | 있음 [28969:126953](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) |  |
| Link Account | 비로그인 DEX 연동 진입 → 가입/로그인 후 그 DEX 선택 폼으로 복귀 | 401 · 게스트 CTA | 페이지/모달 | `Start by signing up for Lighter?` … | REQ-049 · G-402 | 있음 [1 Entry](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127416) · [2 Signup](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127418) · [3 Return](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127422) | 없음 |  |

## FU-014. 연동 사전 게이트(한도) · 연동 전 잔액 처리 (API-006 · API-007)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 연동 결과 | 한도 초과 `L15` | API-006 `blockReason=INTEGRATION_MAX_COUNT_OVER` · API-007 422 | 전체 화면 다이얼로그 | `You've linked the maximum number of accounts ({n}).` · CTA `Contact Support`만 | G-091 · REQ-112 | 다름 [L15](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127349) · [S4-F2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127882) | 다름 [28969:127118](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127118) | `You can link up to 12 trading accounts.` + `Close` + `Need help? Contact Support` |
| 연동 결과 | 연동 전 잔액 출금 대기 | API-007 `PROCESSING` · `PRELINK_PAYOUT` | 전체 화면 다이얼로그 | `Processing Your Account` 재사용 + 출금 대기 문구·금액(G-426 문구표) | REQ-107 · REQ-108 · A-19 · G-426 | 다름 [28966:124158](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124158) | 다름 [28969:127087](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127087) | 금액(`prelinkPayoutAmount`) 표시 없음 |
| 연동 결과 | 출금 성공 → 자동 연동 완료 | 송금 확정 | 알림 → 홈 행 | — | REQ-107 | 있음 [연결선 → 28960:127297](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29097-114849) | 있음 [28969:127101](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127101) |  |
| 연동 결과 | 출금 실패 = 연동 실패, 금액 복원 | `PRELINK_PAYOUT_FAILED` | 전체 화면 다이얼로그 | 문구 G-426 문구표 | REQ-107 · G-426 | 있음 [28966:124162](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124162) | 있음 [28969:127094](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127094) | `Try again` · 원문은 문구표 대조 필요 |
| 연동 결과 | `Unable to Link UID Yet` 차단 화면 미사용 | — | — | — | REQ-108 | 있음 | 있음 | DEX(revision)에 없음 |

## FU-015. 지갑 주소 입력·검증 (API-007 422)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 주소 입력 | 빈 입력 — `Next` 비활성 + 이유 텍스트 | 진입 | 폼 | `Paste your wallet address` · `Paste the wallet address you use on this exchange.` · `Paste a valid wallet address to continue.` | REQ-061 · REQ-062 | 있음 [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) |  |
| 주소 입력 | 유효 주소 — `Next` 활성 | 입력·붙여넣기 | 폼 | `Wallet address` | REQ-062 | 있음 [L3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127279) | 있음 [28969:126996](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126996) |  |
| 주소 입력 | 원문 대소문자 보존(0x 아닌 주소) | 붙여넣기 | 폼 | — | REQ-063 · REQ-065 | 있음 [28980:132193](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132193) | 해당없음 | 표시 규칙(같은 컴포넌트) |
| 주소 입력 | `ADDRESS_EMPTY` | 422 / 클라이언트 | 인라인 | `Enter your wallet address.` | REQ-067 · API-007 | 있음 [28980:132144](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132144) | 없음 |  |
| 주소 입력 | `ADDRESS_INVALID` 내부 공백 | 422 / 클라이언트 | 인라인 | `Remove spaces within the wallet address.` | REQ-067 | 있음 [28980:132242](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132242) · [L4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127283) | 있음 [28969:127006](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127006) |  |
| 주소 입력 | `ADDRESS_WRONG_FORMAT_FOR_DEX` | 422 | 인라인 | `This address is not supported for the selected exchange.` | A-12 · API-007 | 없음 | 없음 |  |
| 주소 입력 | `ADDRESS_INVALID` · `ADDRESS_INVALID_CHECKSUM` 거래소 거절 | 422 | 인라인 | `We couldn’t verify this wallet address. Copy it again from the exchange.` | A-12 · API-007 | 있음 [28980:132291](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132291) | 없음 |  |
| 주소 입력 | `ADDRESS_NAME_NOT_ALLOWED` | 422 | 인라인 | `Paste the wallet address, not an account name.` | A-12 | 있음 [28980:132340](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132340) | 없음 |  |
| 주소 입력 | `ADDRESS_ZERO` | 422 | 인라인 | `This address can't be linked.` | A-12 | 있음 [28980:132389](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132389) | 없음 |  |
| 주소 입력 | `Paste` 클립보드 권한 거부 힌트 | 권한 거부 | 인라인 힌트 | 원문 없음(❓ 권고) | REQ-061 | 없음 | 없음 |  |
| 주소 입력 | 결과 닫은 뒤·새로고침 뒤 거래소·주소 유지 | `Close`/`Cancel` | 폼 복귀 | — | REQ-064 · G-380 | 없음 | 없음 | 복귀 상태 프레임 없음 |
| 주소 입력 | 세션 만료 → 재인증 후 같은 단계 복귀 | API-007 401 | 로그인 → 폼 복귀 | — | REQ-064 · API-007 | 없음 | 없음 | 숨김 보드에만 있음 |
| 주소 입력 | 제출 중복·서버 오류 | API-007 409 `IDEMPOTENCY_KEY_REUSED` · 429 · 500 · 503 | 미정의 | 명세에 사용자 표시 없음 | API-007 | 없음 | 없음 | 명세 누락 후보 1 |

## FU-016. 지갑 주소 찾기 안내 (API-005)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 주소 입력 | `How to find your wallet address` + DEX별 문구 + 스크린샷 | 거래소 선택 | 가이드 블록(웹 캐러셀 · 모바일 세로) | Lighter 예시 문구(REQ-126) | REQ-069 · REQ-126 | 있음 [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [Aster](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29020-205838) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) |  |
| 주소 입력 | 빈 값·입력·오류·유효 상태 모두 안내 유지 | 주소 편집 | 가이드 블록 | — | REQ-069 | 있음 [28960:127275](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [28960:127279](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127279) · [28960:127283](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127283) · [28980:132144](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28980-132144) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) · [28969:126996](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126996) · [28969:127006](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127006) |  |
| 주소 입력 | 보안 문구(가이드 하단) | — | 가이드 블록 | `TetherMax never asks for your private key, seed phrase, or a wallet signature.` | G-392 · REQ-071 | 다름 [Lighter](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [Aster](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29020-205838) | 다름 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | PC는 문구 없음(`No wallet connection or signature required.`만), 모바일은 `…private key, recovery phrase, or wallet signature.` |

## FU-017. 캡차·시도 제한 (API-007 400·422)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 캡차 | GEETEST 슬라이드 퍼즐 | `Next` | 퍼즐 오버레이 | `Slide to complete the puzzle` · `Powered by GEETEST` | REQ-072 | 있음 [L5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127287) · [S3-5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29020-205271) | 있음 [28969:127016](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127016) |  |
| 캡차 | 퍼즐 성공 | 퍼즐 통과 | 전체 화면 다이얼로그 | `Verification Success` | REQ-072 · REQ-094 | 모순 [28966:124154](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124154) | 모순 [28969:127073](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127073) | 같은 상태인데 PC 버튼 `Back to Home`, 모바일 `Close` |
| 캡차 | 퍼즐 실패·토큰 만료 → 주소 유지 새 퍼즐 | 퍼즐 실패 · 422 `CAPTCHA_FAILED` | 퍼즐 재시도 | 원문 없음 | REQ-072 · A-13 · API-007 | 없음 | 없음 | 숨김 보드에만 있음 |
| 캡차 | 캡차 스크립트 로드 실패 | 스크립트 차단 | 인라인 오류 + `Retry` | 원문 없음 | REQ-072 · ❓ G-098 | 없음 | 없음 |  |
| 캡차 | 시도 한도 다이얼로그 없음 | 반복 실패 | — | — | G-063 · G-064 | 있음 | 있음 | `L12`는 30일 소유권 결과로만 쓰임 |

## FU-018~021. 레퍼럴 귀속 확인 (API-007, 결과 화면 대응)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 연동 결과 | Lighter 마스킹 불일치·07-28 이전 바인딩 · EdgeX 가입 미완료 · 다른 코드 → 레퍼럴 아님 | 422 `FAILED_NOT_FOUND_UID` | 전체 화면 다이얼로그 | FU-023 레퍼럴 아님과 같음 | REQ-088 · REQ-076 · REQ-083 | 있음 [L8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127301) | 있음 [28969:127125](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127125) | Lighter 07-28 전용 문구는 ❓ 권고(정책 A-14) |
| 연동 결과 | 파트너 타임아웃·5xx·429 · ApeX `AccountID` 미반환 · 계정 여러 개 → 확인 중 | 201 `PROCESSING` · `PARTNER_LOOKUP` | 전체 화면 다이얼로그 | FU-024 확인 중과 같음 | REQ-075 · REQ-082 · REQ-099 | 다름 [L11](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127313) | 다름 [28969:127080](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127080) | FU-024 첫 행과 같은 문제 |

## FU-022. 중복 판정·동시성 (API-007 409)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 연동 결과 | 타인 사용 중(확인 중 포함·동시 제출 뒤 요청) | 409 `FAILED_ALREADY_INTEGRATION` | 전체 화면 다이얼로그 | `Account Already in Use` / `This account is already linked to another account. Please use a different account to continue.` · `Verify Ownership` · `Need help? Contact Support` | REQ-089 · REQ-101 · REQ-105 | 있음 [L9](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127305) · [S3-F4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127822) · [S4-F3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127888) | 있음 [28969:127109](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127109) |  |
| 연동 결과 | 본인 이미 추가 | 409 `FAILED_MY_INTEGRATION` | 전체 화면 다이얼로그 | `You've Already Added This Account` / `This account is already linked to your account. No further action is needed.` · `Close` | REQ-090 | 있음 [L14](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127340) · [S4-F1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127876) | 있음 [28969:127139](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127139) |  |

## FU-023. 연동 결과 처리·결과 화면 (API-007 · API-008)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 연동 결과 | 처리 중(최소 1초) | 응답 대기 | 전체 화면 다이얼로그 | `Processing Your Account` / `Your account is being processed. You'll be notified once linking is complete.` · `Back to Home` | REQ-091 | 모순 [L6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127293) · [S3-F5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127828) | 없음 | L6(처리 중)와 L11(확인 중)이 같은 `PROCESSING` 결과를 두 문구로 그림. 모바일은 L6에 해당하는 프레임 없음 |
| 연동 결과 | 즉시 완료 + 정산 카드 | 201 `LINKED` | 전체 화면 다이얼로그 | `Account Link Completed` / `Linked successfully.` · 지갑 전체 주소 · `Weekly`/`Daily` · 다음 업데이트 로컬 시각 | REQ-094 · REQ-095 | 있음 [L7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127297) · [S4-5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127861) | 다름 [28969:127101](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127101) | 모바일 `Weekly settlement · Monday` — 다음 업데이트 시각 없음 |
| 연동 결과 | 토스트 + 홈 Linked Accounts 맨 아래 새 행(새로고침 없음) | `Back to Home` | 토스트 + 홈 행 | `Account linked successfully` | REQ-094 | 있음 [S3-7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127795) · [S4-6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127867) | 없음 |  |
| 홈 | 첫 연동 → S4(체크리스트·Preview 없음, DEX 3 USDT 안내 없음) | 첫 연동 성공 | 홈 | — | REQ-096 · REQ-097 | 있음 [S3-7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127795) · [메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123653) | 없음 |  |
| 연동 결과 | 레퍼럴 아님 | 422 `FAILED_NOT_FOUND_UID` | 전체 화면 다이얼로그 | `Unable to Link Account` / `Only accounts registered with the TetherMax referral code can be linked.` · `Close` · `Need help? Contact Support` | REQ-088 · REQ-093 | 있음 [L8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127301) · [S3-F3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127816) · [S4-F6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127906) | 있음 [28969:127125](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127125) |  |
| 연동 결과 | 기타 실패 · 이슈 지갑 | 422 `LINK_REJECTED` · `FAILED_ISSUE_UID` | 전체 화면 다이얼로그 | `Unable to Link Account` / `We were unable to link this account. Please contact our support team for assistance.` · `Contact Support` | REQ-092 · REQ-122 | 있음 [L13](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127331) · [S3-F2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127810) · [S4-F5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127900) | 있음 [28969:127153](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127153) | 모바일 프레임 이름은 `Linking unavailable` |
| 연동 결과 | 최근 소유권 인증(30일) | 409 `FAILED_RECENT_POSSESSION` | 전체 화면 다이얼로그 | `Verification Limit Reached` / `This account has been ownership verified recently.` · `Close` · `Need help? Contact Support` | REQ-122 · REQ-724 | 있음 [L12](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127322) · [S3-F1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127804) · [S4-F4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127894) | 있음 [28969:127132](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127132) |  |
| 연동 결과 | 180일 lookback으로 잘린 기록 안내 | 201 `cashbackShownFrom` ≠ null | 성공 화면 안 한 줄 | `Cashback shown from {date}` | REQ-119 · API-007 | 없음 | 없음 | 숨김 보드 S2_13에만 있음 |
| 연동 결과 | 연동 흐름에 지갑 연결·서명 요청 없음 | — | — | — | REQ-048 · REQ-117 | 다름 [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | 있음 [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | PC 가이드 스크린샷이 Lighter `Connect Wallet` 버튼을 화살표로 가리킴(운영 콘텐츠 예시) |
| 연동 결과 | 선택 뒤 연동 불가(`EXCHANGE_NOT_LINKABLE`) | 422 `EXCHANGE_NOT_LINKABLE` | 미정의(명세상 도달 안 함) | — | API-007 · G-161 | 없음 | 있음 [28969:127153](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127153) | 명세 누락 후보 2 |

## FU-024. 확인 중(manual_link_pending) 처리 (API-007 · API-008)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 연동 결과 | 확인 중 대기 안내 | 201 `PROCESSING` · `PARTNER_LOOKUP` | 전체 화면 다이얼로그 | `We're checking your account link` / `We'll let you know the result after checking the exchange's referral records.` · `Back to Home` | G-094 · REQ-100 | 다름 [L11](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127313) · [S4-F7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127912) | 다름 [28969:127080](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127080) | `Checking Your Referral` / `We’ll notify you once your exchange confirms your referral.` |
| 홈 | Linked Accounts 확인 중 행 | API-008 `MANUAL_LINK_PENDING` | 홈 행 | `연동 시도중이에요` · 금액 `-` · 경과 시간 없음 | REQ-098 · API-008 | 없음 | 없음 | S3-F5 라벨(28960:127823) 설명만 있음 |
| 홈 | 확인 중 거절 후 홈 행 | 운영자 거절 | 홈 행 | ❓ 제거 / `연동 실패` | 정책 A-17(❓) | 미정 | 미정 |  |

## FU-025. 연동 이후 운영 상태 (API-001 · API-007 · API-008)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| Link Account | Lighter Standard — 경고·차단 없이 연동 | 연동 | 없음(표시 안 함) | — | REQ-116 · 정책 5-9 | 다름 [L10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127309) | 다름 [Light](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127146) · [Dark](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127353) | PC 폼 안 경고 `…Upgrade to Plus or Premium on Lighter to earn cashback.`, 모바일 결과 화면 `Lighter Standard` + `Continue` |
| DEX 상세 | Standard 안내 = 상세 유의사항 한 줄 | — | 상세 텍스트 | 국문 `캐시백은 Premium과 Plus 계정에 적용됩니다. Standard 계정은 캐시백이 쌓이지 않아요.`(영문 ❓ A-22) | REQ-116 | 있음 [L0](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127412) | 해당없음 | 영문 확정 전 |
| Link Account | 지역 제한 DEX | API-001 서버 제외 | 표시 없음 | — | G-161 · REQ-120 | 해당없음 | 해당없음 | 이유 표시 없음 — 화면 불필요 |
| 홈 | DEX 오프보딩 — 기존 행 `Inactive` | API-008 `isExchangeActive=false` | 홈 행 칩 | `Inactive` | REQ-121 · API-008 | 없음 | 없음 | 개발 인계 색인 29066:897에 칩 이름만 |

## FU-026. 해제·정정·소유권 진입 (API-025 · API-026)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 홈 | 셀프 해제 버튼 없음 | — | — | — | REQ-113 | 있음 [O0](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127748) | 있음 [28982:126253](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126253) | `Remove Wallet`은 O15·O16 해제 행에만 |
| 홈 → 연동 | O0 다른 지갑 연동 → 타인 사용 중 | `Link more accounts` | 홈 → 모달 | — | REQ-125 | 있음 [O0](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127748) | 있음 [28969:127109](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127109) |  |

## FU-027. 소유권 인증 신청 (API-025 · API-026)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 소유권 | O1 타인 사용 중 → `Verify Ownership` | 409 `FAILED_ALREADY_INTEGRATION` | 전체 화면 다이얼로그 | `Account Already in Use` | REQ-723 | 있음 [O1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127644) | 있음 [28969:127109](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127109) |  |
| 소유권 | O2 30일 쿨다운 | API-025 409 `FAILED_RECENT_POSSESSION` | 전체 화면 다이얼로그 | `This wallet address was recently verified by another user. Ownership claims will be available after 30 days.` · `Try a different wallet` · `Close` | REQ-724 | 다름 [O2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127650) | 다름 [28982:126298](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126298) | `Close` 대신 `Need help? Contact Support` |
| 소유권 | O3~O5 녹화 가이드 3단계 | 페이지 진입 · 화살표 | 캐러셀 | `Ownership Video Recording Guide` · `Step 1 of 3` … | REQ-725 | 있음 [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) · [O4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127664) · [O5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127670) | 있음 [28982:126103](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) · [28982:126127](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126127) · [28982:126151](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126151) |  |
| 소유권 | 업로드 빈 상태 · 업로드 전 `Submit Claim` 비활성 | 진입 | 업로드 카드 | `Upload your screen recording` / `MP4 or MOV (max. 100MB)` | REQ-726 · API-025 · 정책 5-10 | 다름 [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) | 다름 [28982:126103](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) | `max. 1GB` — 서버 검증값(100MB)과 다름 |
| 소유권 | 업로드 카드 경고 | — | 카드 안 문구 | `Some events may be restricted during the claim period. Existing coupons cannot be transferred.` | REQ-726 · 정책 5-10 | 다름 [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) | 다름 [28982:126103](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) | `…during the coupon usage period. Existing coupons are non-transferable.` |
| 소유권 | 심사 시간 안내 | — | 카드·확인창 문구 | REQ-726 「기존 CEX 화면 문구」 · 정책 5-10 「5분 목표 대신 10분 자동 실패」 | REQ-726 · 정책 5-10 | 다름 [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) · [O10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127700) | 다름 [28982:126103](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) · [28982:126238](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126238) | `Most requests are reviewed within 5 minutes.` · `Average review time: ~5 minutes` — 정책 문장과 충돌, 결정 필요 |
| 소유권 | 업로드 중 | 업로드 | 오버레이 | `Uploading File` / `Do not close this window.` | REQ-726 | 있음 [O6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127676) | 있음 [28982:126175](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126175) |  |
| 소유권 | 업로드 완료(파일명·크기·`Complete`) | 업로드 성공 | 업로드 카드 | — | REQ-726 | 있음 [O7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127682) | 있음 [28982:126199](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126199) |  |
| 소유권 | 업로드 실패 → `OK` → 빈 카드 | API-025 400 `VALIDATION_ERROR`(형식·용량) | 다이얼로그 | `Upload Failed` / `We couldn't upload your file. Please try again or select a different file.` · `OK` | REQ-726 · API-025 | 있음 [O8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127688) | 다름 [28982:126223](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126223) | 모바일 다이얼로그 뒤 카드가 `Complete` 상태 |
| 소유권 | 업로드·검사 오류 | API-025 500 | 다이얼로그 | `Something Went Wrong` / `An unexpected error occurred. Please try again.` · `Contact Support` · `Try again` | REQ-726 · API-025 | 있음 [O9](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127694) | 있음 [29102:132023](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29102-132023) |  |
| 소유권 | O10 제출 확인(DEX·축약 주소) · `Cancel` 파일 유지 | `Submit Claim` | 다이얼로그 | `Submit this claim?` / `Our team will review your recording and verify ownership. This action cannot be undone after submission.` | REQ-727 | 있음 [O10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127700) | 다름 [28982:126238](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126238) | 모바일 다이얼로그 뒤 화면이 `How to find your UID` · `Attach Recording` |
| 소유권 | 소유권 신청 시 통합 한도 도달 | API-025 409 `INTEGRATION_MAX_COUNT_OVER` | 미정의 | — | API-025 · REQ-731 | 없음 | 없음 |  |
| 소유권 | 중복 제출·진행 중 신청 있음 | API-025 409 기존 코드 | — | — | ❓ G-434 | 미정 | 미정 |  |
| 소유권 | 다른 회원의 확인 중 지갑에 신청 | API-025 422 기존 코드 | — | — | ❓ G-435 | 미정 | 미정 |  |
| 홈 | O11 심사 중 행 | API-026 `PROCESSING` | 홈 행 | 금액 `-` · `소유 확인중` · `Ownership verification in progress · {경과 시간}` | REQ-728 · API-026 | 있음 [O11](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127709) | 있음 [28982:126253](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126253) |  |
| 홈 | O12 승인 다이얼로그(DEX·축약 주소) → 행 금액 | API-026 `APPROVED` | 다이얼로그 + 홈 행 | `Ownership Verification Complete` / `Your wallet ownership has been successfully verified.` · `OK` | REQ-728 | 있음 [O12](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29205-124141) | 다름 [28982:126268](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126268) | 모바일 다이얼로그에 지갑 주소 없음 |
| 홈 | O13 거절 행 + 다이얼로그 | API-026 `REJECTED` | 홈 행 + 다이얼로그 | `Ownership verification was unsuccessful. Please try again.` · `Ownership Verification Unsuccessful` / `We were unable to verify your wallet ownership. Please review your submission and try again.` · `OK` | REQ-728 | 있음 [O13](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29205-124663) | 있음 [28982:126283](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126283) |  |

## FU-028. 소유권 승인·이전 처리 (API-026)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| 홈 | O14 이전 보유자 행(소유권 이전으로 해제) | API-026 `DISPLACED` | 홈 행 | 금액 `-` · `This wallet has been unlinked. Tap to verify ownership and reclaim it.` | REQ-729 | 있음 [O14](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127727) | 있음 [28982:126318](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126318) |  |
| 홈 | O15 재청구 모달(거래소명·주소 없음) | 해제 행 탭 | 모달 | `Verify Ownership to Reclaim This Wallet` / `This wallet address was unlinked after another user verified ownership. If it belongs to you, submit a new claim.` · `Remove Wallet` · `Submit Wallet Ownership` | REQ-729 | 있음 [O15](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29202-120092) | 있음 [28982:126318](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126318) |  |
| 홈 | O16 재청구 거절(심사 사유) | API-026 `REJECTED` + `reason` | 홈 행 + 모달 | `Ownership verification was unsuccessful. View reason.` · `Reason from review: {reason}` · `Remove Wallet` · `Apply for Ownership` | REQ-729 | 있음 [O16](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29202-120644) | 있음 [28982:126338](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126338) |  |

## CEX UID 연동 화면 (기존 흐름 · 공통 선택기)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구 | 근거 | PC | 모바일 | 비고 |
|---|---|---|---|---|---|---|---|---|
| Link Account | CEX 선택 → UID 입력 폼 | 공통 선택기에서 CEX | 모달/전체 화면 | `Enter your UID` · `Steps to link UID` | REQ-056 | 있음 [L17 CEX 폼](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-120903) · [검색 닫힘](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-119346) | 있음 [29051:100488](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-100488) | 기존 [MAX-30] 9105:196091 |
| Link Account | UID 입력 오류 | 형식 오류 | 인라인 | 기존 문구 | REQ-180(기존) | 없음 | 없음 | DEX(revision)·[MAX-30] 모두 찾지 못함 |
| 캡차 | CEX 퍼즐 · `Verification Success` | `Next` | 퍼즐 · 다이얼로그 | 기존 | 기존 MAX-30 | 기존 [퍼즐](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9287-185463) · [성공](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9287-185464) | 기존 [퍼즐](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9105-188792) · [성공](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9105-189066) |  |
| 연동 결과 | CEX 결과 스플래시(완료·처리 중·레퍼럴 아님·타인·본인·한도·이슈·30일) | CEX 결과 코드 | 전체 화면 다이얼로그 | MAXOP-751 원문(`UID Link Completed`·`Processing Your UID`·`Unable to Link UID` …) | REQ-122 · MAXOP-751 | 기존 [완료](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-711132) · [처리 중](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-711508) · [이슈](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-711238) | 기존 [완료](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-710540) · [처리 중](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-711072) | DEX(revision) 결과는 `Account` 표기 — CEX도 공용 결과를 쓸지 기존 `UID` 문구를 둘지 미정 |
| 연동 결과 | CEX `FAILED_NEED_RECEIVE` 차단 화면 미사용(전 거래소 공통) | — | — | — | REQ-107 · REQ-108 · REQ-122 | 다름 [기존 다이얼로그](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9287-185491) | 다름 [9105:191459](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9105-191459) · [25963:13706](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-13706) | 기존 페이지에 `Unable to Link UID Yet`(`Withdraw`) 화면이 남아 있음 — DEX(revision)에 대체 표시 없음 |
| 연동 결과 | CEX UID 연동 전 잔액 출금 대기·실패 | `PROCESSING` · `PRELINK_PAYOUT` | 전체 화면 다이얼로그 | G-426 문구표 | REQ-107(전 거래소 공통) | 다름 [28966:124158](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124158) · [28966:124162](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124162) | 다름 [28969:127087](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127087) · [28969:127094](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127094) | 문구가 `paid to this wallet` — UID 계정용 표기 없음 |

## API 응답·오류 코드별 사용자 표시

| API | 응답·오류 코드 | 사용자 표시 | Figma |
|---|---|---|---|
| API-001 | 200 · `linkableOnly` | 선택기 목록(노출·연동가능·가이드 있음만) | 있음 — FU-013 |
| API-001 | 400 `VALIDATION_ERROR` | 클라이언트 파라미터 오류 — 화면 없음 | 해당없음 |
| API-001 | 503 `SERVICE_UNAVAILABLE` | 캐시 목록 우선, 없으면 선택기 오류 + `Retry`(G-097) | 없음 |
| API-002 | 503 `SERVICE_UNAVAILABLE` | 허브 구성 실패 — 0곳으로 보이지 않게 | 없음 — 허브 H7([H7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126920))은 잔액 장애만 |
| API-003 | 503 `SERVICE_UNAVAILABLE` | DEX 랜딩 실패 — 0곳과 구분 | 없음 |
| API-006 | 200 `canLink=false` · `INTEGRATION_MAX_COUNT_OVER` | L15 | 다름 — FU-014 |
| API-006 | 200 `EXCHANGE_NOT_LINKABLE` | 진입 숨김 | 해당없음 |
| API-006 | 401 `UNAUTHORIZED` · 네트워크 실패 | 로그인 이동 / 미정의 | 없음(명세 누락 후보) |
| API-007 | 201 `LINKED` | Account Link Completed + 토스트 + 홈 행 | 있음(PC) · 다름(모바일 정산 카드) |
| API-007 | 201 `PROCESSING` · `PARTNER_LOOKUP` | 확인 중 안내(G-094) | 다름 · 모순(L6·L11) |
| API-007 | 201 `PROCESSING` · `PRELINK_PAYOUT` | 처리 중 재사용 + 금액 | 다름(금액 없음) |
| API-007 | — `PRELINK_PAYOUT_FAILED` | 연동 실패(문구표) | 있음 |
| API-007 | 400 `VALIDATION_ERROR` · `CAPTCHA_REQUIRED` | 클라이언트가 막음 — 화면 없음 | 해당없음 |
| API-007 | 401 `UNAUTHORIZED` | 재로그인 후 같은 단계 | 없음 |
| API-007 | 409 `IDEMPOTENCY_KEY_REUSED` | 미정의 | 없음(명세 누락 후보) |
| API-007 | 409 `FAILED_ALREADY_INTEGRATION` | Account Already in Use | 있음 |
| API-007 | 409 `FAILED_RECENT_POSSESSION` | Verification Limit Reached | 있음 |
| API-007 | 409 `FAILED_MY_INTEGRATION` | You've Already Added This Account | 있음 |
| API-007 | 422 `ADDRESS_EMPTY` | 인라인 | 있음(PC) · 없음(모바일) |
| API-007 | 422 `ADDRESS_WRONG_FORMAT_FOR_DEX` | 인라인 | 없음 |
| API-007 | 422 `ADDRESS_INVALID`(공백·거래소 거절) · `ADDRESS_INVALID_CHECKSUM` | 인라인 | 있음(PC) · 공백만 있음(모바일) |
| API-007 | 422 `ADDRESS_NAME_NOT_ALLOWED` · `ADDRESS_ZERO` | 인라인 | 있음(PC) · 없음(모바일) |
| API-007 | 422 `CAPTCHA_FAILED` | 새 퍼즐, 주소 유지 | 없음 |
| API-007 | 422 `EXCHANGE_NOT_LINKABLE` | 명세상 도달 안 함 | 모바일에만 있음(명세 누락 후보) |
| API-007 | 422 `INTEGRATION_MAX_COUNT_OVER` | L15 | 다름 |
| API-007 | 422 `FAILED_NOT_FOUND_UID` | 레퍼럴 아님 | 있음 |
| API-007 | 422 `LINK_REJECTED` | 기타 실패 | 있음 |
| API-007 | 429 · 500 · 503 | 미정의 | 없음(명세 누락 후보) |
| API-008 | 200 `LINKED` · `MANUAL_LINK_PENDING` · `INACTIVE` | 홈 행 `연동 완료` · `연동 시도중이에요`(`-`) · `Inactive` | 완료만 있음 · 확인 중·Inactive 없음 |
| API-008 | 401 | 로그인 이동 | 해당없음 |
| API-009 | 200 | 지갑 상세(잔액 영역 담당) | 있음 — [지갑 상세 잔액 카드](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29026-97581) |
| API-009 | 401 · 404 `NOT_FOUND` | 남의 계정·없는 계정 — 미정의 | 없음 |
| API-023 | 200 `FOUND` · `NO_PUBLIC_RESULT` · `DATA_PENDING` · 400 · 429 · 500 · 503 | FU-012 표 | 있음(400은 빈 값만) |
| API-025 | 200 신청 생성 | 홈 `소유 확인중` | 있음 |
| API-025 | 400 `VALIDATION_ERROR`(형식·용량) | Upload Failed | 있음 · 용량 표기 다름 |
| API-025 | 409 `FAILED_RECENT_POSSESSION` | O2 | 다름(버튼) |
| API-025 | 409 `INTEGRATION_MAX_COUNT_OVER` | 미정의 | 없음 |
| API-025 | 409 중복 제출 · 422 확인 중 지갑 | ❓ G-434 · G-435 | 미정 |
| API-025 | 500 `INTERNAL_ERROR` | Something Went Wrong | 있음 |
| API-026 | `PROCESSING` · `APPROVED` · `REJECTED` · `DISPLACED` | O11 · O12 · O13/O16 · O14 | 있음 |
| API-026 | 401 | 로그인 이동 | 해당없음 |

## Figma에만 있는 상태 (명세 누락 후보)

| # | Figma | 상태 | 명세에서 빠진 것 |
|---|---|---|---|
| 1 | [게스트 결과 카드](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97792) | 계정 옆 `Active` 배지 | 무엇이 Active인지(거래소 상태·계정 상태) 명세에 없음 |
| 2 | [인증 후 복귀 메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-110962) | 「이미 본인에게 연동된 계정은 회원 상세로 이동」 | FU-012·API-023에 이 분기 없음 |
| 3 | [Signup before redirect](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127421) | `Start by signing up for Lighter?` · `Return to TetherMax` · `Link your wallet` 중간 단계 | REQ-053은 새 탭으로 바로 이동만 정의. G-402는 복귀 위치만 확정 |
| 4 | [28966:124162](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124162) · [연동 전 출금 실패](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127094) | 전체 화면 다이얼로그 + `Try again` | 명세는 「확인 중 → 실패 알림 경로」만 정의. 회원이 이 화면을 언제 보는지(앱 재진입·홈 행) 없음 |
| 5 | [Linking unavailable](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127153) | 선택 뒤 연동 불가 결과 | API-007 `EXCHANGE_NOT_LINKABLE`는 「화면에서 도달하지 않음」으로만 정의 |
| 6 | [O7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127682) · [메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29010-126479) | 완료 행 `×`로 첨부 삭제 → `Submit Claim` 비활성 | REQ-726은 「교체」만 정의 |
| 7 | [O3 업로드 카드](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) | `Ownership verification is restricted for 30 days from completion.` | REQ-726 경고 원문에 없는 줄 |
| 8 | —(명세 쪽) | API-007 409 `IDEMPOTENCY_KEY_REUSED` · 429 · 500 · 503, API-006 실패 | 사용자 표시가 명세에 없음 — Figma도 없음 |

## 디자이너 요청 목록

| # | 우선 | 화면 | 요청 | 근거 |
|---|---|---|---|---|
| 1 | 1 | [L10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127309) · [모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127146) · [다크](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127353) | Lighter Standard 경고 제거 — PC 주소 입력 폼 안 경고 문장(`…Upgrade to Plus or Premium…`)과 모바일 `Lighter Standard`/`Continue` 결과 화면을 연동 흐름에서 뺀다 | REQ-116 · 정책 5-9 |
| 2 | 1 | [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) · [모바일 (O3~O10 공통)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) | 업로드 한도 `MP4 or MOV (max. 100MB)`로 맞춘다(서버 검증값). 디자인 메모(28965:123649)가 1GB를 「기존 원본」으로 적어 두었으므로 서버 허용량을 확인해 정책·명세 또는 디자인 한쪽으로 통일 | REQ-726 · API-025 · 정책 5-10 |
| 3 | 1 | [L2 외 L1~L5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · S3-4·S4-3 입력 단계 | 웹 연동 입력 단계를 현행 꽉 찬(전체 화면) 모달로 바꾼다(지금 600px 부분 모달, 결과만 전체 화면) | REQ-712 |
| 4 | 2 | [L15](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127349) · [S4-F2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127882) · [28969:127118](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127118) | 한도 초과 본문 `You've linked the maximum number of accounts ({n}).`, 버튼 `Contact Support` 하나 | G-091 · REQ-112 |
| 5 | 2 | [L11](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127313) · [S4-F7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127912) · [28969:127080](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127080) | 확인 중 안내 `We're checking your account link` / `We'll let you know the result after checking the exchange's referral records.` | G-094 · REQ-100 |
| 6 | 2 | [L6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127293) · [L11](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127313) | 같은 `PROCESSING`(귀속 확인 대기) 결과를 L6 `Processing Your Account`와 L11 두 화면으로 그림 — 최소 1초 처리 중과 확인 중 접수 결과를 어떤 순서로 보이는지 하나로 정리. 모바일은 L6 대응 프레임 없음 | REQ-091 · REQ-100 |
| 7 | 2 | [28966:124158](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124158) · [28969:127087](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127087) | 연동 전 잔액 출금 대기에 금액(`prelinkPayoutAmount`) 표시를 넣고 문구를 G-426 문구표와 대조 | REQ-108 · A-19 · G-426 |
| 8 | 2 | [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [S4-3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29020-205838) · [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | 가이드 하단 보안 문구 `TetherMax never asks for your private key, seed phrase, or a wallet signature.` — PC 4개 DEX 가이드에 추가, 모바일은 원문으로 교체 | G-392 · REQ-071 |
| 9 | 2 | [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) · [28969:126986](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126986) | `ADDRESS_WRONG_FORMAT_FOR_DEX` 인라인 오류(`This address is not supported for the selected exchange.`) 상태 추가(PC·모바일). 모바일은 빈 값·거래소 거절·이름·제로 주소 4종도 추가 | A-12 · REQ-067 |
| 10 | 2 | [L5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127287) · [28969:127016](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127016) | 퍼즐 실패 → 주소 유지 새 퍼즐, 캡차 스크립트 로드 실패 → 인라인 오류 + `Retry`(캡차 없이 제출 불가) 상태 추가 | REQ-072 · A-13 · API-007 |
| 11 | 2 | [L3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127279) · [28969:126996](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126996) | 세션 만료(401) 재로그인 후 같은 거래소·주소·단계 복귀, 결과 `Close` 뒤 입력 유지 상태 추가(숨김 보드에만 있음) | REQ-064 · G-380 |
| 12 | 2 | [L1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127271) · [28969:126953](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) | 파트너 목록 로드 실패(캐시 없음) → 선택기 안 오류 + `Retry`, `Top Partner Exchanges` 숨김 | G-097 · REQ-059 |
| 13 | 2 | [L7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127297) · [28969:127101](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127101) | `Cashback shown from {date}` 줄이 있는 성공 화면 추가 | REQ-119 · API-007 |
| 14 | 2 | 홈(S4) 행 | Linked Accounts 확인 중 행(`연동 시도중이에요` · 금액 `-` · 경과 시간 없음)과 오프보딩 `Inactive` 행 추가 | REQ-098 · REQ-121 · API-008 |
| 15 | 2 | [29227:120903](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-120903) · [29051:100488](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-100488) | CEX UID 폼 제목 `Link your exchange UID` → 거래 계정 중립어(`Link Account`) | REQ-054 |
| 16 | 2 | [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) · [28982:126103](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126103) | 업로드 카드 경고를 원문 `Some events may be restricted during the claim period. Existing coupons cannot be transferred.`로 교체 | REQ-726 · 정책 5-10 |
| 17 | 2 | [O3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127635) · [O10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127700) · [28982:126238](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126238) | `Most requests are reviewed within 5 minutes.` · `Average review time: ~5 minutes` — 정책 5-10(5분 목표 대신 10분 자동 실패)과 REQ-726(기존 CEX 문구) 중 무엇을 따를지 기획 확인 후 반영 | REQ-726 · 정책 5-10 |
| 18 | 2 | [게스트 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98401) · [게스트 모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98465) | 게스트 조회 입력 오류: DEX 주소 오류(빈 값 외 A-12 문구)와 CEX UID 형식 오류 상태 추가 | API-023 · REQ-065 |
| 19 | 2 | [게스트 DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-97915) · [게스트 CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29037-102463) | `Link account` → 조회한 거래소·주소(UID)가 채워진 연동 폼 상태 추가 | FU-012 · REQ-180 |
| 20 | 2 | [S3-2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127765) · [28969:126953](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) | 모바일 빈 상태 카드(`empty_state`) 진입의 「아무것도 선택 안 됨」 화면 추가(지금 모바일은 Lighter가 미리 선택된 폼만 있음) | REQ-051 |
| 21 | 2 | [L1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127271) | 웹 `/uidlinking` 진입 질문(`Have you registered…` · `Yes, I have one!` / `No, not yet!`)을 꽉 찬 모달 첫 단계로 그릴지 결정 | REQ-712 |
| 22 | 2 | [MAX-30 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9287-185491) · [MAX-30 모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9105-191459) · [MAX-30 스플래시](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25963-13706) | CEX `Unable to Link UID Yet`(`Withdraw`) 차단 화면을 쓰지 않음 표시. CEX UID용 연동 전 출금 대기·실패 문구(`this wallet` → 계정 중립) 추가 | REQ-107 · REQ-108 |
| 23 | 2 | 소유권 업로드 화면 | 소유권 신청 시 통합 한도 도달(API-025 `INTEGRATION_MAX_COUNT_OVER`) 상태 추가 | API-025 · REQ-731 |
| 24 | 3 | [28966:124154](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28966-124154) · [28969:127073](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127073) | `Verification Success` 버튼을 한쪽으로 통일(PC `Back to Home`, 모바일 `Close`) | REQ-072 · REQ-094 |
| 25 | 3 | [28969:127101](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127101) | 모바일 성공 정산 카드에 다음 업데이트 로컬 시각 추가(지금 `Weekly settlement · Monday`) | REQ-095 |
| 26 | 3 | 모바일 홈 | 모바일 연동 성공 토스트 `Account linked successfully` · S4 새 행 · 첫 연동 S4 전환 프레임 추가 | REQ-094 · REQ-096 |
| 27 | 3 | [O2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127650) · [28982:126298](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126298) | O2 버튼 `Try a different wallet` + `Close`(지금 `Need help? Contact Support`) | REQ-724 |
| 28 | 3 | [28982:126268](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126268) | 모바일 승인 다이얼로그에 DEX·축약 주소 추가 | REQ-728 |
| 29 | 3 | [28982:126223](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126223) | 모바일 업로드 실패 다이얼로그 뒤 카드를 업로드 중/빈 상태로(지금 `Complete`) | REQ-726 |
| 30 | 3 | [28982:126238](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28982-126238) | 모바일 제출 확인 뒤 화면의 `How to find your UID` · `Attach Recording` → `Ownership Video Recording Guide` · `Upload Recording` | REQ-725 · REQ-726 |
| 31 | 3 | [29227:120903](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29227-120903) · [28969:126953](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-126953) · [29051:100488](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-100488) | 가입 링크 `Register here` → `Sign up here`(CEX 폼·모바일 선택 시트 뒤 폼) | REQ-053 |
| 32 | 3 | [외](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29051-104229) · [29225:119304](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29225-119304) | PC 선택기 검색 1건·여러 건·`No results found` 상태 추가, 모바일 All 목록 DEX 배지 추가. 게스트 선택기 검색 0건도 추가 | REQ-055 · REQ-056 |
| 33 | 3 | [29035:98631](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98631) · [29035:98694](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-98694) · [29035:99309](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29035-99309) | 게스트 결과 `Below the 10 USDT payout minimum.` — `payout` 대신 Claim 계열(문구표 기준) | G-418 · G-419 |
| 34 | 3 | [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | Lighter 가이드 예시 스크린샷이 `Connect Wallet` 버튼을 가리킴 — 지갑 연결 요청으로 읽히지 않는 캡처로 교체(운영 콘텐츠 예시) | REQ-048 · REQ-117 |
| 35 | 3 | [L2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127275) | `Paste` 클립보드 권한 거부 힌트 상태(문구 ❓ 권고) | REQ-061 |
| 36 | 3 | [28969:127153](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-127153) | 모바일 `Linking unavailable`의 쓰임을 정한 뒤 PC 대응 여부 결정(명세 누락 후보 5) | API-007 · G-161 |
| 37 | 3 | [MAX-30] 결과 스플래시 | CEX 결과도 DEX(revision) 공용 `Account` 결과를 쓸지, 기존 `UID` 문구를 둘지 결정 | REQ-054 · REQ-122 |

## 확인하지 못한 것

- 선택한 파트너의 하이라이트 유지, 유형(CEX/DEX) 전환 시 입력 초기화, 웹 캐러셀 위치 유지는 동작이라 프레임으로 판정하지 못했다.
- 모바일 DEX 상세(28960:130986)의 연동 진입 버튼·Standard 안내 줄은 열어 보지 않았다.
- 확인 중 승인·거절, 연동 전 출금 결과 알림(FCM·EMAIL)은 사용자 이메일 묶음(29060:101537) 범위라 대조하지 않았다.
- G-426 「문구표」 원본을 찾지 못해 연동 전 출금 대기·실패 문구는 원문 대조를 하지 못했다.
- 기존 [MAX-30] 페이지의 CEX UID 입력 오류 상태는 텍스트 검색으로 찾지 못했다(이미지로만 있는지 미확인).
