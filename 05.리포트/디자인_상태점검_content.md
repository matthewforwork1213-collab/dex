# 디자인 상태 점검 — content (DEX 랜딩 · 상세 · 소개 · /payback · 내비게이션)

2026-11-26 · Figma `DEX(revision)` [28960:125519](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519)의 보이는 프레임 + 기존 `[MAX-…]` 페이지 · 기준 = 정책 `00_DEX_최종정책.md`(부록 G 확정 포함) > 요구사항정의서 > `프론트_기능명세서_사용자.md` FU-043 · FU-049~059 · FU-081~090 > `API스펙_사용자.md` API-001 · 003 · 004 · 008 · 022

## 요약

| 항목 | 수 |
|---|---|
| 점검한 상태 | 169 |
| 있음 | 49 |
| 기존 페이지에 있음 | 17 |
| 없음 | 40 |
| 정책과 다름 | 38 |
| 중복·모순 | 6 |
| 디자인 불필요(미렌더·리다이렉트·결정 대기) | 19 |
| 명세 누락 후보 | 4 |
| 디자이너 요청 | 46건 — 우선 1: 12 · 우선 2: 20 · 우선 3: 14 |

**개발 판단** — DEX 상세(오퍼 박스 회원 3분기·FAQ·검토 중 리뷰)와 /payback 플랫폼 선택은 화면대로 착수할 수 있다. DEX 랜딩 비교 섹션·히어로 리드·Aster 콘텐츠·AI 요약 샘플·상세 PC 계산기 3칸은 화면대로 만들면 정책과 다르게 나가므로 수정 전 구현하지 않는다. 랜딩 빈·점검·연동 불가 상태, DefiLlama 지연, 리뷰 0건·DEX 작성 게이트, 앱 예외는 보이는 프레임에 근거가 없어 지금은 인수 조건으로만 구현할 수 있다.

| 판정 | 뜻 |
|---|---|
| 있음 | DEX(revision)의 보이는 프레임에 정책과 맞게 있음 |
| 기존 | DEX(revision)에 없고 기존 `[MAX-…]` 페이지에 그대로 쓸 수 있는 디자인이 있음 |
| 없음 | 보이는 프레임 어디에도 없음 |
| 다름 | 있으나 정책·명세와 다름(기존 페이지 디자인이 DEX 기준과 다른 경우 포함) |
| 중복 | 같은 상태를 프레임끼리 다르게 그림 |
| 불필요 | 렌더하지 않거나(빈 공간 없음) 서버 리다이렉트라 화면 디자인이 필요 없음 — 인수 조건으로만 검증 |

판정은 프레임 이름이 아니라 보이는 텍스트 레이어 문구와 렌더로 했다. 모바일 다크 프레임은 라이트와 같은 인스턴스 구성이라 라이트 판정을 따랐다(다크 렌더는 따로 대조하지 않음).

## FU-049. DEX 랜딩 구조·히어로·위험 고지

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| DEX 랜딩 PC | 게스트 전체(9구역 + 이유 카드 + 마지막 띠) | 비로그인 진입 | 페이지 | — | REQ-318 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| DEX 랜딩 PC | 로그인(이유 카드·마지막 띠 없음, Learn and Earn 뒤 푸터) | 로그인 진입 | 페이지 | — | REQ-318 | 있음 | [28960:125522](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125522) |
| DEX 랜딩 모바일 | 게스트 · 로그인 | 375 진입 | 페이지 | — | REQ-318 | 있음 | [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) · [28960:130952](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130952) · 다크 [28960:130968](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130968) |
| 히어로 | H1 · 파트너 마크 줄 `{n} partner DEXs you can start earning Cashback with` | API-003 `hero` | 페이지 | `Trade onchain, keep your cashback` | REQ-320 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 히어로 | 리드 문구 | API-003 `hero.lede` | 페이지 | `Trade with your own wallet on the DEX. Paste your wallet address into TetherMax and we pay your cashback into your TetherMax balance.` | G-154 · REQ-320 | 다름 — 화면은 `Trade on the DEX. Paste your address on TetherMax.` | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |
| 히어로 | 섹션 버튼 `DEX Overview` → venue · `Guide to DEX` → 3단계(스크롤 + 헤더 보정 + 포커스) | 클릭 | 스크롤 이동 | — | REQ-320 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 히어로 | 위험 고지 항상 노출, 360px에서 잘리지 않음 | 항상 | 인라인 | `※ Decentralized trading carries risks, …` | REQ-321 · G-155 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |
| 히어로 | 활성 DEX 수 변경 시 마크·숫자 동시 변경(예: 3곳) | API-001/003 목록 길이 | 페이지 | `{n} partner DEXs …` | REQ-320 | 없음 — 4곳 고정만 있음(8곳 넘침 프레임도 히어로는 `4 partner DEXs`) | [28960:125542](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125542) |
| 랜딩 전체 | 노출 순서 = 거래소 레코드 전역 순서 하나 | 백오피스 순위 | 목록 순서 | — | REQ-319 | 중복 — glance `Lighter·Aster·EdgeX·ApeX`, PC 카드 `Lighter·ApeX·EdgeX·Aster`, 모바일 목록 `EdgeX·ApeX·Lighter·Aster`로 세 프레임 순서가 다름 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |

## FU-050. glance 타일·DefiLlama 지표·프로모션 배너

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| glance | 정상(활성 DEX당 타일: 마크·이름·`Up to`+요율·24H 거래량·TVL) | API-003 `glance` | 타일 | `Partner DEXs at a glance` | REQ-322 | 다름 — 타일에 24H 거래량·TVL이 없고 이름·요율만 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |
| glance | 서브라인 | 항상 | 인라인 | `TVL and 24H volume from DefiLlama, as of {date}` | 정책 8-4 · REQ-322 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| glance | 허브 링크 | 클릭 | 링크 | `Compare monthly cashback on the Cashback Hub` | REQ-322 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| glance | 넘침(5곳 이상) 가로 스크롤 + 가장자리 페이드 | DEX 5곳 이상 | 타일 | — | REQ-322 | 있음 | [28960:125542](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125542) |
| glance·카드 | DefiLlama 실패 24시간 이내(마지막 값 + 기준 시각) | API-003 `metrics.stale: true` | 인라인 | `Source: DefiLlama, as of {time}.` | REQ-323 · B-6-3 | 없음 — 카드에 출처·기준 시각 줄이 없고 stale 표시도 없음 | — |
| glance·카드 | DefiLlama 24시간 경과(지표 숨김, 카드 나머지 정상) | `metrics: null` | 영역 숨김 | — | REQ-323 · G-349 | 없음 — 지표 칸이 빠진 카드 모양이 없음 | — |
| glance·카드 | 전일 대비 증감 표시 | `metrics.volumeChange24h` | 인라인 | 예 `$6.8M, −2%` | REQ-323 · B-6-5 | 다름 — `24H Vol $6.8M`만 있고 증감 없음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 프로모 배너 | 슬라이드 1개 이상 + 점 표시 + `Join Now`(새 탭) | `promoBanners[]` | 캐러셀 | 예 `Trade with Aster and get Cashback!` | REQ-324 · G-156 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |
| 프로모 배너 | 슬라이드 0개(배너 미렌더, 빈 공간 없음) | `promoBanners: []` | 미렌더 | — | REQ-324 | 불필요 | — |

## FU-051. Venue 카드·리스트 뷰

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| venue 그리드 PC | 2×2 카드(오퍼 3줄·`Final Taker`·`Final Maker`·TVL·24H·`Learn More`·`Get Started`) | API-003 `venues[]` | 카드 | `Our Partner Decentralised Exchanges` · `Pick one, join through our link, then paste your wallet address. …` | REQ-325 · G-157 | 있음 — 카드에 입금 칩·혜택 줄 없음(G-157·G-441과 일치) | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| venue 카드 | 카드 `Final Taker/Maker` = 상세 `After cashback` | 레코드 | 숫자 | — | REQ-325 · REQ-339 | 중복 — Lighter만 일치(0.0224%). EdgeX 카드 0.0266% / 상세 0.0184%, ApeX 0.0350% / 0.0184%, Aster 0.0280% / 0.0184% | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) · [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · [28960:127633](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127633) |
| venue 그리드 모바일 | 1열 카드(같은 순서) | 375 | 카드 | — | REQ-325 | 없음 — 모바일은 기본 화면부터 리스트 행만 있고 TVL·24H·`Learn More`·`Get Started`가 있는 카드가 없음 | [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) |
| 리스트 뷰 PC | 행(마크·이름·리뷰 점수·개수·`Up to {rate}% cashback`·`Final Taker/Maker`·`View {DEX}`) | 보기 전환 | 목록 | `Join through our referral and link your wallet address. …` · `View Lighter` | REQ-326 | 다름 — 행 버튼 글자가 자리표시자 `Label`, `View {DEX}` 없음 | [28960:125536](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125536) |
| 리스트 뷰 모바일 | 행 | 375 보기 전환 | 목록 | 위와 같음 | REQ-326 | 중복 — 기본 화면과 리스트 뷰 프레임의 내용이 같고(전환 상태 구분 없음) 리뷰 점수·`View {DEX}` 없음 | [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) · [28960:130958](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130958) |
| 리스트 뷰 | 리뷰 20개 미만 → `-` | 게시 리뷰 < 20 | 인라인 | `-` | REQ-326 · REQ-313 | 없음 — `4.0 (23)`만 있음 | [28960:125536](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125536) |
| 카드 | `Learn More` 숨김(상세 없음) · `Get Started` 숨김(경로 없음) | `learnMoreUrl`/`getStartedUrl` null | 미렌더 | — | REQ-038 · REQ-325 | 불필요 | — |
| 카드 | `노출=Y, 연동가능=N` → 카드·`Get Started` 유지, 연동 진입만 숨김 | `status: LINK_UNAVAILABLE` | 카드 | — | G-162 · REQ-332 | 없음 | — |
| 카드 | 8곳 넘침 | DEX 5곳 이상 | 카드 | — | REQ-325 | 다름 — 추가 카드 요율 자리표시자 `XX%` | [28960:125542](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125542) |

## FU-052. 교육 섹션

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| CEX/DEX 비교 | 제목 | 항상 | 페이지 | `Who holds your money changes. Your DEX cashback does not.` | G-401 | 다름 — `Your cashback does not.` | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| CEX/DEX 비교 | 출금 행 라벨·값 | 항상 | 표 | `Where you withdraw` · CEX `On TetherMax, from {min} USDT` / DEX `On TetherMax, from {min} USDT, to your linked wallet` | REQ-327 · 정책 8-4 | 다름 — 라벨 `Where payouts go`, DEX 값 `To your linked wallet from 10 USDT`(`{min}` 고정값) | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| CEX/DEX 비교 | 리워드 행 | 항상 | 표 | `Event and invite rewards` 양쪽 `Yes` | REQ-327 | 다름 — DEX 패널 라벨 `Rewards` + `Event and invitation rewards are available.` | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| CEX/DEX 비교 | `Where cashback is paid` DEX | 항상 | 표 | `Your TetherMax balance` | REQ-327 | 있음 — 칩 `Your Cashback` 추가(정책 변경 메모) | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 3단계 경로 | STEP 1~3 + 진행선 + `See partner DEXs` | 스크롤 | 패널 | STEP 3 `TetherMax pays your cashback into your TetherMax balance. Withdraw it to your linked wallet from {min} USDT.` | REQ-328 | 다름 — STEP 3 `TetherMax credits your cashback to your balance. Eligible balances of 10 USDT or more are paid to your linked wallet.` (자동 지급 기준 재작성은 문구표 G-419, `{min}` 변수 아님) | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 교육 타일 | 벤토 4장(PC 비대칭 2×2) · 로그인 동일 | 항상 | 타일 | `CUSTODY` … `TRADING COSTS` | REQ-329 · REQ-333 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:125522](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125522) |
| Learn and Earn 띠 | 게스트·로그인 노출, `Start learning` → DEX 트랙 | 항상 | 띠 | `Learn DEX trading in short lessons.` / `Short lessons on decentralised perps, then a quiz.` | REQ-330 · G-158 | 다름 — 본문 `Complete a quiz to earn a coupon. Redeem it on a linked account as an event reward. It matches trading cashback 1:1.` (G-158은 보상 언급 허용, 원문 교체 여부 확인) | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 게스트 이유 카드 | 게스트만 | 비로그인 | 카드 | `Why sign up with TetherMax?` | REQ-318 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 마지막 CTA 띠 | 게스트만, 테마와 무관하게 항상 다크, `Sign Up Now` → 회원가입 | 비로그인 | 띠 | `Your keys. Your trades. Your Cashback.` | REQ-331 | 다름 — 라이트 프레임 렌더에서 띠 배경이 밝은 회색 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |

## FU-053. DEX 랜딩 빈·예외 상태

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| DEX 랜딩 | 노출 DEX 0개 · 국가 전부 차단 → 영역 숨김(빈 상태 화면 없음) | `venues: []` | 영역 숨김 | — | G-160(REQ-332의 「빈 상태 화면」보다 정책 우선) | 없음 — venue·glance가 빠진 랜딩 모양이 없음(히어로 `{n}` 0일 때 포함) | — |
| DEX 랜딩 | 특정 DEX 점검 | `venues[].status: MAINTENANCE` | 카드 배지/비활성 | 명세 문구 없음 | REQ-332 · 정책 8-4 | 없음 | — |
| DEX 랜딩 | 특정 DEX 일시 연동 불가 | `status: LINK_UNAVAILABLE` | 카드 | — | REQ-332 · G-162 | 없음 | — |
| DEX 랜딩 모바일 | 오버플로 상태 | 375 + DEX 5곳 이상 | 목록 | — | REQ-332 | 없음 — 8곳 넘침은 PC만 | [28960:125542](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125542) |
| DEX 랜딩 | 콘텐츠 조회 실패 | API-003 503 | 페이지/영역 오류 | — | API-003 | 없음 | — |
| DEX 랜딩 | 노출 플래그 조회 실패 → 기본 숨김 | 플래그 조회 실패 | 영역 숨김 | — | ❓ G-163 | 불필요 — 결정 대기, 결정 시 위 「0개」 모양과 같음 | — |
| DEX 상세 URL | DEX 오프보딩 → 랜딩 301 | API-004 301 | 리다이렉트 | — | REQ-332 · REQ-358 | 불필요 | — |

## FU-054. 상세 구조·히어로·오퍼 박스

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 상세 PC | 공용 템플릿 4개 DEX | API-004 | 페이지 | — | REQ-336 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) · [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · [28960:127633](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127633) |
| 상세 모바일 | 같은 템플릿 | 375 | 페이지 | — | REQ-336 | 있음 | [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) · [28960:131011](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131011) · [28960:131017](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131017) · [28960:131023](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131023) · 다크 [28960:131033](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131033) |
| 히어로 | 브레드크럼 `Decentralised Exchanges / {DEX}` | 항상 | 인라인 | — | REQ-336 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 히어로 | 이름 옆 `DEX` 배지 | 항상 | 배지 | `DEX` | REQ-337 · P5 | 없음 — 보이는 텍스트에 `DEX` 배지 없음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 히어로 | 혜택 줄(ELC `Bullet 1~4`, 체크 목록, 빈 줄 미표시) | `hero.benefits[]` | 목록 | 예 `Trade crypto, RWAs and pre IPO perps onchain` | REQ-337 · G-441 | 없음 — 히어로에 혜택 줄이 없음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 히어로 | 마켓 칩 줄바꿈(자르지 않음) · `Deposit` 칩 | `hero.markets` · `hero.deposit` | 칩 | — | REQ-337 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 히어로 | 자격 안내 = `Additional Notes` | `hero.eligibilityNote` | 인라인 | Lighter 영문 ❓(A-22) · 그 외 `Cashback applies to eligible trading fees on {DEX}.` | G-440 · REQ-337 | 있음 — Lighter 영문은 디자인 문안(`Cashback applies to Premium and Plus accounts. Standard accounts pay 0% fees, so there is no cashback on them.`), 확정 대기 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| 히어로 | 자격 안내 비면 숨김 | `eligibilityNote: null` | 미렌더 | — | G-440 | 불필요 | — |
| 오퍼 박스 | 게스트 → 회원가입/로그인 + `Get Started` | `memberState: exchange_guest` | 버튼 | 문구표(G-402) | REQ-338 | 있음 — `Sign Up` | [28969:129578](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-129578) |
| 오퍼 박스 | 미연동 → 연동하기 + `Get Started` | `exchange_member_unlinked` | 버튼 | — | REQ-338 | 있음 — `Link Wallet` | [28969:129666](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-129666) |
| 오퍼 박스 | 연동 완료 → `Auto Claim`(비활성) · 리뷰 쓰기 + `Get Started` | `exchange_member_linked` | 버튼 | — | REQ-338 | 있음 | [28969:129751](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-129751) |
| 오퍼 박스 | 이 DEX만 미연동(S3') 구분 | `member_unlinked` 범위 | 버튼 | — | ❓ G-174 | 불필요 — 결정 대기 | — |
| 오퍼 박스 | `노출=Y, 연동가능=N` → `Link Wallet` 숨김, `Get Started` 유지 | `status: LINK_UNAVAILABLE` | 버튼 | — | G-162 | 없음 | — |
| 오퍼 박스 | Right Box 탭 2개 토글(Lighter `Premium`/`Plus`) | `offerBox.tabs` 2개 | 토글 | `Trading fees cashback up to` · `20%` | REQ-339 · G-438 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 오퍼 박스 | 토글 전환 후(`Plus`·`Maker`) 라벨·헤드라인·링크·단계 요율 동시 변경 | 토글 클릭 | 토글 | — | REQ-339 | 없음 — 첫 탭 선택 상태만 있음 | — |
| 오퍼 박스 | 탭 1개 → 토글 없음 | `tabs.length == 1` | 미렌더 | — | G-438 | 없음 — 토글 없는 오퍼 박스 모양 없음 | — |
| 오퍼 박스 | 단계 표 Lighter 2단계 / 그 외 3단계(`After discount`) | 레코드 | 표 | `Without TetherMax` → `After discount` → `After cashback` | REQ-339 · REQ-364 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| 오퍼 박스 | 스크롤 sticky | 스크롤 | 고정 | — | REQ-339 | 없음 — 스크롤 상태 프레임 없음 | — |
| 상세 | 없는 슬러그·비게시 | API-004 404 | 페이지 | 기존 `Page Not Found` | API-004 | 기존 | [12216:419863](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12216-419863) · 모바일 [12085:401487](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12085-401487) |
| 상세 | 이전 슬러그 | API-004 301 | 리다이렉트 | — | REQ-358 | 불필요 | — |
| 상세 | 콘텐츠 조회 실패 | 503 | 페이지 오류 | — | API 공통 | 없음 | — |

## FU-055. 탭 바·이유 카드·상세 계산기

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 탭 바 | 로드 시 `Key Features` 활성, `Reviews ({n})` | 로드 | 탭 | `Key Features` · `Structure` · `Guide` · `Policy` · `Reviews ({n})` | REQ-341 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 탭 바 | 스크롤 고정 · 다른 탭 활성 | 스크롤/클릭 | 탭 | — | REQ-341 | 없음 | — |
| 탭 바 | 대상 섹션이 비면 탭 숨김 | 섹션 없음 | 미렌더 | — | ❓ G-166 | 불필요 — 결정 대기 | — |
| 이유 카드 | 제목 + 2×2 4장 | `reasonCards` | 카드 | `Why traders choose {DEX}` | REQ-342 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 상세 계산기 PC | 3칸 `Trading fee` − `Cashback` = `Effective fee` | 슬라이더 $400K | 숫자 | `Trading fee`(`Without TetherMax`) · `Cashback`(`Returned to you`) · `Effective fee`(`With TetherMax`) | REQ-343 | 다름 — 세 칸 모두 `$112.00 Trading fee Without TetherMax`(컴포넌트 값 미적용) | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 상세 계산기 모바일 | 3칸 · 흐름도 · 설명 카드 3장 | 375 | 숫자 | 설명 카드 1 `Your selected {volume} volume on a {account tier} account generates …` · 2 `Eligible trading activity generates a settlement for the referring partner.` · 고지 `Cashback comes from eligible exchange partner settlements. …` | REQ-343 · REQ-359 | 중복 — 모바일은 `Normal trading fee`, `80%`, `Stays with the fee — $89.60 / Split between Lighter and TetherMax.`, 카드 문구 `Your selected $400K volume generates …` · `Trading activity generates a settlement amount for the partner.` · `… by partner, tier …`로 PC와 구성·문구가 다르고, 흐름도(`You → Trading fee → … → TetherMax`)가 없음 | [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) · [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 상세 계산기 | 흐름도·설명 카드(Lighter 20% · 30% DEX 예) | 슬라이더 | 카드 | `$112.00` · `$22.40` · `$89.60` / `$33.60` · `$78.40` | REQ-359 | 있음 (PC) | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| 상세 계산기 | Taker/Maker 토글 전환 · 슬라이더 이동 후 숫자 동시 변경 | 조작 | 숫자 | — | REQ-343 | 없음 — $400K·Taker 한 상태만 | — |
| `How this works` 드로어 | 열림 | 링크 클릭 | 드로어 | `How your cashback is worked out` · `WHAT YOU CHOOSE` / `WHAT WE WORK OUT` / `WHERE THE MONEY COMES FROM` | REQ-344 | 없음 | — |
| 상세 계산기 | `{account tier}` 선택 UI | — | — | — | ❓ G-164 | 불필요 — 결정 대기(현재 Premium 고정) | — |

## FU-056. 단계 가이드·안전 메시지

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 단계 가이드 | 왼쪽 목록 + 오른쪽 패널(Step 1 선택) | 로드 | 패널 | `Step N Title` 하나를 두 곳에 | REQ-345 · G-437 | 다름 — 왼쪽 `Create a Web3 wallet` / 오른쪽 `Create a Web3 Wallet` | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 단계 가이드 | Step 3 선택 | 목록 클릭 | 패널 | Lighter 왼쪽 `Join Lighter and link your wallet` | REQ-345 · G-437 | 다름 — 오른쪽 제목 `Join the DEX through the TetherMax link and paste your wallet address` | [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) · 모바일 [28960:130999](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130999) |
| 단계 가이드 | 경고 문장은 Description 안(별도 박스 없음) | Lighter Step 3 | 본문 | `Cashback applies only to Plus and Premium accounts. Standard accounts pay no fees.` | REQ-347 · G-437 | 다름 — 경고 문장이 본문과 분리된 별도 텍스트 박스 | [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) |
| 단계 가이드 | Lighter Step 3 본문 | Step 3 | 본문 | `Open Lighter through the TetherMax link and log in. Then copy your wallet address from Lighter and paste it in TetherMax. TetherMax never asks you to connect a wallet.` | REQ-360 | 다름 — `After you sign up, confirm the TetherMax referral code on Lighter's referral page. Copy your public address …`(운영자 기본값이므로 문구표로 확정) | [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) |
| 단계 가이드 | Step 1 본문 + 안전 메시지 + 「서명·키 요구 안 함」 | Step 1 | 본문 | Lighter `Install a self-custody wallet, or sign up on Lighter with email …` / 그 외 `… such as MetaMask and save your recovery phrase.` | REQ-346 · REQ-360 · G-392 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| 단계 가이드 | Step 2 잘못된 체인 경고 | Step 2 | 본문 | 안전 메시지 2 | REQ-346 | 없음 — Step 2 선택 프레임 없음 | — |
| 단계 가이드 | Step 4·5 · 단계 수 1~5 가변(`Step n of N`) | `steps.length` | 패널 | — | REQ-345 | 없음 — 5단계 고정만, 모바일 라벨은 `step 5`/`step 6`인데 화면은 Step 3 | [28960:131000](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131000) · [28960:131043](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131043) |
| 단계 가이드 | 영상 슬롯 데스크톱 2:1 / 모바일 1:1 `.mp4` | `media` | 영상 | — | REQ-345 · G-437 | 다름 — 이전 점검과 같이 16:9·311×360 슬롯(재사용) | [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) · [28960:130999](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130999) |
| 단계 가이드 | 영상 로드 실패 → 첫 프레임 + 글, reduced motion | 로드 실패 | 미디어 | — | REQ-348 | 없음 | — |
| 지원 카드 | 고정 문구 | 항상 | 카드 | `Stuck partway through?` · `Live chat replies in about 2 minutes.` · `Chat with support` | REQ-348 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 마지막 띠 | 배너 + `Banner Liner` + `CTA button title` | `banner` | 띠 | `Start Earning Cashback with {DEX}` · `Join Now` | REQ-349 | 있음 — D1 PC는 liner 레이어가 보이지 않음, D2·D3은 있음 | [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) · [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |

## FU-057. FAQ·약관

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| FAQ | 첫 구역 펼침 + 첫 질문 열림, 구역 7개 | 로드 | 아코디언 | `FAQs` · 첫 질문 `How does TetherMax cashback work on {DEX}?` | REQ-350 · G-439 | 있음 — 답변은 자동 지급 기준(`… Eligible balances of 10 USDT or more are paid automatically to your linked wallet.`) | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| FAQ | 구역 이름 | 운영자 입력 | 아코디언 | `Withdrawals & Account Management` | REQ-361 | 다름 — `Payouts & Account Management`(G-418 `Claim` 계열 문구표 확인) | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| FAQ | 여러 구역 동시 열림 · `+`/`−` | 클릭 | 아코디언 | — | REQ-350 | 없음 — 펼친 두 번째 구역 상태 없음 | — |
| FAQ | 질문 없는 구역 미렌더 / 전부 비면 제목 숨김 | `faq[]` 비어 있음 | 미렌더 | — | REQ-350(❓ 권고) | 불필요 | — |
| 약관 서랍 | 접힘 | 로드 | 서랍 | `Terms and conditions` | REQ-351 | 있음 | [28960:127445](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127445) |
| 약관 서랍 | 펼침 본문 | 클릭 | 서랍 | 거래소별 조항 | REQ-351 · G-369(보류) | 없음 — 펼친 상태 없음(약관 보류) | — |
| 약관 서랍 | `terms: null` → 숨김 | API-004 | 미렌더 | — | API-004 | 불필요 | — |

## FU-058. 리뷰

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| Global Reviews | 정상(요약·히스토그램·하위 점수 3축·AI 요약·태그·정렬 5종·리뷰 목록) | `reviews.count > 0` | 섹션 | 하위 점수 `Overall experience` · `Cashback earning` · `Cashback withdrawal` | REQ-353 · REQ-354 · REQ-362 | 다름 — 셋째 축 `Cashback payouts`(PC), 모바일 첫 축 `Using the exchange` | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) |
| Global Reviews | AI 요약 문장 | 서버 요약 | 인라인 | 캐시백이 DEX 계정으로 들어간다고 말하지 않음 | REQ-354 · REQ-362 | 다름 — EdgeX·Aster·ApeX PC `Cashback lands in my {DEX} account every week.` | [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) · [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · [28960:127633](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127633) |
| Global Reviews 모바일 | 거래소별 리뷰 | 상세 진입 | 섹션 | `Global Reviews` | REQ-354 | 다름 — Aster 모바일에 `Lighter Global Reviews` · `#lighter`, Lighter 요약 `Cashback arrives at the same time every day.`(Lighter는 주간) | [28960:131017](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131017) · [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) |
| 리뷰 1건 | `✓ Verified` · `Read more` · `Helpful? Yes {n} No` · 번역 토글 | 리뷰 데이터 | 목록 | `Translated from {language}` · `Show original` / `Show translation` | REQ-353 · REQ-362 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| 리뷰 1건 | 검토 중 | 검토 중 리뷰 | 목록 | `This review is under moderation` · `It was flagged and is hidden while our team checks it against the review guidelines.` | REQ-354 · REQ-362 | 있음 | [28960:127445](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127445) · [28960:131005](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131005) |
| Global Reviews | 게스트 안내 | 비로그인 | 인라인 | `Log in or sign up to write a review` · `After signing up, link your {venue} wallet address to post (anyone can read)` | REQ-354 | 다름 — PC에는 안내 줄 없음(머리 `Sign up`만), 모바일 둘째 줄 `Sign in and link your wallet for this DEX to write a review.` | [28960:127445](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127445) · [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) |
| Global Reviews | 연동 없는 회원 작성 불가 | `me.verified: false` | 게이트 | `Link your {venue} wallet to write a review.` · 국문 `연동 완료 계정이 있는 회원이 작성할 수 있습니다` | G-170 · REQ-352 · REQ-362 | 다름 — 기존 게이트 `Link your exchange UID to write a review` · `Link UID`(UID 표기) | [22919:73859](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22919-73859) |
| Global Reviews | 확인 중 지갑만 있는 회원 작성 불가 | `manual_link_pending` | 게이트 | 위와 같음 | REQ-352 | 없음 | — |
| 리뷰 작성 | 작성 모달·시트(빈 폼·입력·게시) | `Write a Review` | 모달 | 기존 필드 | API-022 | 기존 | [22442:219849](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22442-219849) · [22493:290220](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22493-290220) · 모바일 [22988:102996](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22988-102996) |
| 리뷰 작성 | 제출 성공(`verified: true` → `✓ Verified`) | API-022 201 | 목록 반영 | — | API-022 · REQ-353 | 기존 | [22954:81957](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22954-81957) |
| 리뷰 작성 | 제출 403 → 거래 계정 연동 안내 | `REVIEW_NOT_ELIGIBLE` | 다이얼로그/게이트 | `Link your {venue} wallet to write a review.` | API-022 · G-170 | 다름 — 기존 게이트는 UID 문구, DEX용 연동 안내 없음 | [22919:73859](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22919-73859) |
| 리뷰 작성 | 제출 401 → 로그인 | `UNAUTHORIZED` | 이동 | — | API-022 | 없음 — 로그인 후 같은 상세·작성 상태 복귀 모양 없음 | — |
| 리뷰 작성 | 제출 실패 429·500·503 | 공통 오류 | 인라인/토스트 | — | API 공통 | 기존 | [22954:81463](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22954-81463) |
| Global Reviews | 0건 → 요약·히스토그램 숨김 + `No reviews yet` + `Reviews (0)`, 예시 리뷰 없음 | `reviews.count == 0` | 빈 상태 | `No reviews yet` · 국문 `아직 작성된 리뷰가 없습니다` | G-169 · REQ-355 | 다름 — DEX 프레임 없음, 기존 CEX 빈 상태는 탭에 `Reviews (23)`이 남아 있음 | [22442:219830](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22442-219830) · 모바일 [22956:84690](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22956-84690) |
| Global Reviews | 리뷰 목록 조회 실패 | 리뷰 서비스 오류 | 영역 오류 | — | B-7-8 | 기존 | [22954:81674](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22954-81674) |
| 리뷰 | 첫 후기 쿠폰 CTA 목적지 | — | — | — | ❓ G-172 | 불필요 — 결정 대기 | — |

## FU-059. 거래소별 콘텐츠·상세 URL

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| Lighter 상세 | 설명 · 칩 · 입금 · 이유 카드 4 | 레코드 | 페이지 | B-7-9 원문 | REQ-363 | 있음 | [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) |
| EdgeX 상세 | 위와 같음 | 레코드 | 페이지 | B-7-9 원문 | REQ-363 | 있음 | [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) |
| ApeX 상세 | 위와 같음 | 레코드 | 페이지 | B-7-9 원문 | REQ-363 | 있음 | [28960:127633](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127633) |
| Aster 상세 | 설명·이유 카드 4에서 Solana 제거 | 레코드 | 페이지 | `Aster is a multichain perpetual DEX on BNB Chain, Ethereum and Arbitrum. …` · `Multichain: BNB Chain, Ethereum & Arbitrum` | REQ-357 · REQ-363 · 정책 8-5 | 다름 — PC·모바일 모두 `… BNB Chain, Ethereum, Solana and Arbitrum.` · `Multichain: BNB Chain, Ethereum, Solana & Arbitrum` | [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · [28960:131017](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131017) |
| Aster 상세 | 레버리지 표기 | 레코드 | 카드 | `selected markets` / `BTC in Simple Mode` | ❓ G-043 | 불필요 — 결정 대기(현재 `BTC in Simple Mode`) | [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) |
| 상세 URL | `/dex/{slug}`, 이름 변경 301, 오프보딩 → 랜딩 301 | API-004 301 | 리다이렉트 | — | REQ-358 | 불필요 | — |

## FU-043. 서비스 소개·프리로그인 랜딩

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 서비스 소개 PC | 공식 파트너 캐러셀(API 수신, DEX 포함) | API-001 | 캐러셀 | `Cashback on the exchanges you already trade on` | REQ-287 | 있음 | [28960:129521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-129521) · 다크 [28960:128830](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128830) |
| 서비스 소개 | UID → 거래 계정 문구 | 항상 | 본문 | `UID` 단독 표기 0건 | REQ-715 · G-424 | 있음 — `link your exchange UID or DEX wallet address` | [28960:129521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-129521) |
| 서비스 소개 모바일 | 같은 내용 | 375 | 페이지 | — | REQ-287 · REQ-715 | 다름 — DEX 반영 안 된 기존판만 있음 | [19224:4458](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=19224-4458) |
| 프리로그인 랜딩 PC | `Our Partners` `All / Exchanges / DEXs` · DEX가 순위 자리에 노출 | 운영자 선택 | 목록 | 모듈 라벨 `Exchange` 유지 | REQ-288 | 있음 | [28960:128375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375) · 다크 [28960:127917](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127917) |
| 프리로그인 랜딩 | `Hero Exchange`에 DEX 선택(`Promo Tagline`·`CTA Button Title`) | 운영자 선택 | 히어로 카드 | — | REQ-288 | 없음 — 히어로 고지가 `… based on Bitget's cashback rate.`인 CEX 상태만 | [28960:128375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375) |
| 프리로그인 랜딩 모바일 | DEX 포함 | 375 | 페이지 | — | REQ-288 | 다름 — DEX 반영 안 된 기존판만 있음 | [19479:46652](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=19479-46652) |
| 캐러셀·파트너 목록 | 거래소 목록 조회 실패 | API-001 503(「0곳」으로 표시하지 않음) | 영역 오류 | — | API-001 | 없음 | — |
| TP 페이지 | UID → 거래 계정 | 항상 | 본문 | `trade using the exchange UID linked …` 교체 | REQ-715 | 없음 — DEX(revision)에 TP 소개 페이지 없음(기존 [MAX-659]은 UID 문구) | — |

## FU-081. /payback 퍼널 — 진입·플랫폼·거래 프로필

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| PB-2 Landing | 정상 + `Did you know?` | 진입 | 페이지 | `You're paying too many fees.` · `See how much cashback you're missing out on, across exchanges, DEXs and brokers.` · `{n} of our users earn an average of {amount} USDT in cashback per month.` | REQ-454 | 다름 — 기존판만: 리드 `See how much cashback are you missing out.`, 카드 `… earn an average of 47.00 USDT to 284.00 USDT …`, 구 헤더 | [6510:88151](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=6510-88151) · 모바일 [5123:32342](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=5123-32342) |
| PB-2 Landing | 사용자 수 없음 → 카드 숨김 | 집계값 없음 | 미렌더 | `Trusted by 0 users` 금지 | REQ-454 · G-211 | 불필요 | — |
| 진행 바 | 단계 동기 | 앞/뒤 이동 | 진행 바 | 6단계 | REQ-453 | 없음 — 새 프레임에 진행 바 없음 | — |
| PB-3 Choose platform | `All` 통합 그리드(CEX `Total Savings` · DEX `Cashback`) | 진입 | 타일 | `First, which exchange do you use most?` | REQ-455 | 있음 | [29194:120700](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29194-120700) · 모바일 [29194:121368](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29194-121368) |
| PB-3 | `CEX` 칩 | 칩 클릭 | 타일 | — | REQ-455 | 있음 | [29194:120979](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29194-120979) · 모바일 [29194:121473](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29194-121473) |
| PB-3 | `DEX` 칩 | 칩 클릭 | 타일 | — | REQ-455 | 있음 — 프레임 이름은 「계산 과정」 | [29064:934](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-934) · 모바일 [29064:1384](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-1384) |
| PB-3 | 미선택 → `Next` 비활성 / 단일 선택 외곽선 | 선택 | 버튼 | `Back` · `Next` | REQ-455 | 있음 — 메모로 확인(선택 상태 프레임 없음) | [29062:115765](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29062-115765) |
| PB-3 | 요율 없는·노출 꺼진 DEX 타일 숨김 | 레코드 | 미렌더 | — | REQ-455 | 불필요 | — |
| PB-3 | 거래소 목록 실패 | API-001 503 | 영역 오류 | — | API-001 | 없음 | — |
| PB-4 Trading profile | 카드 4장 · 칩 ↔ 슬라이더 동기 · 빈도 미선택 `Check Results` 비활성 | 입력 | 폼 | `Next, let's check your trading profile.` … | REQ-456 · REQ-461 | 기존 — 모바일 기존판만(PC 없음) | [5123:31992](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=5123-31992) |

## FU-082. /payback 퍼널 — 결과·Summary

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| PB-6 Calculating | 자동 진행 | `Check Results` | 페이지 | `You might be surprised...` | REQ-458 | 기존 — 구 헤더 | [6510:88879](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=6510-88879) · 모바일 [5123:32217](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=5123-32217) |
| PB-7 결과(DEX) | `Trade with TetherMax` / `Without TetherMax`, `Did you know?` 숨김 | DEX 선택 | 카드 | `YOUR CASHBACK (USDT)` · `FEES LOST (USDT)` | REQ-458 | 다름 — PC·모바일 모두 EdgeX 결과에 `On average, 81,836 Bitget traders like you earn about 4.70 USDT/mo.` 표시(메모는 숨긴다고 적음). PC는 두 카드 대신 `YOUR CASHBACK 1.89 USDT/mo.` 하나 | [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119430](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119430) · [29187:119616](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119616) |
| PB-7 | `How we calculated this?` 펼침 | 클릭 | 펼침 | — | REQ-458 | 없음 | — |
| PB-8 Summary(DEX) | 타일·영수증·`Payout Details`(`Destination` `TetherMax Account`) | 결과 → `Next` | 페이지 | `You're all set. Here's your summary.` | REQ-459 | 있음 | [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) |
| PB-8 | DEX별 각주 | 플랫폼 | 인라인 | EdgeX `*Based on paid trading fees. EdgeX pays in USDC, shown 1:1 in USDT.` | REQ-462 · G-055 | 다름 — EdgeX에 CEX 각주 `*Calculated based on paid trading fees` | [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) |
| PB-8 | Lighter `Weekly` · `Every Monday` | Lighter 선택 | 인라인 | — | REQ-459 | 없음 — PB-3에 Lighter 타일도 없음(온보딩 보류 시 숨김이면 해당 없음) | — |
| PB-8 | 같은 예시의 `Order Type Ratio` | — | 타일 | — | REQ-459 | 중복 — PC `100% Taker`, 모바일 `20% Maker / 80% Taker`인데 `Trading Fees 6.30` 같음 | [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) |
| PB-8 | `Restart`(입력 초기화 → Landing) · `Start {platform} Cashback`(새 탭) | 클릭 | 버튼 | — | REQ-459 | 다름 — 모바일 Summary에 `Restart` 없음 | [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) |
| PB-8 PC | 글로벌 헤더 GL-1 | 항상 | 헤더 | `Cashback` · `Rewards Hub` · `Discover` · `Calculator` | REQ-464 · B-19-1 | 다름 — 구 헤더 `Exchanges · Events · Benefits · Cashback Preview · Point` | [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) |
| PB-9 모바일 | 375 1열, 가로 스크롤 없음, 타일 줄바꿈 | 375 | 페이지 | — | REQ-460 | 있음 | [29194:121368](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29194-121368) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) |

## FU-083. 사이트맵·헤더·드로어·푸터

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 데스크톱 헤더 | 로그인(벨·아바타·테마·언어) | 로그인 | 헤더 | `Cashback ˅` · `Rewards Hub ˅` · `Discover ˅` · `Calculator` | REQ-464 | 있음 | [28967:127332](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28967-127332) · [28960:125522](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125522) |
| 데스크톱 헤더 | 비로그인(`Login` · `Sign up`) | 비로그인 | 헤더 | — | REQ-464 | 있음 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) |
| 데스크톱 헤더 | `Cashback` hover 패널 정확히 3행 | hover | 패널 | `Centralised Exchanges` · `Decentralised Exchanges` · `Brokers` | REQ-464 | 다름 — DEX 패널 렌더 없음. 기존 패널은 `Exchanges` · `Brokers` · `Cashback Calculator` | [19604:32651](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=19604-32651) |
| 데스크톱 헤더 | `Rewards Hub` · `Discover` 드롭다운 | chevron 클릭 | 패널 | — | REQ-464 | 기존 | [19604:32651](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=19604-32651) |
| 데스크톱 헤더 | 터치 기기 탭 동작 | 탭 | 패널/이동 | — | ❓ G-213 | 불필요 — 결정 대기 | — |
| 데스크톱 헤더 | 알림 피드·아바타 로드 실패 → 안 읽음 점만 숨김 | 로드 실패 | 아이콘 | — | REQ-471 | 기존 — 점 없는 기본 벨 재사용 | [28967:127332](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28967-127332) |
| 모바일 웹 드로어 | 비로그인 | 햄버거 | 드로어 | `Welcome to TetherMax! Create an account or log in to start earning Cashback.` · 제품 6항목 `Cashback, Events, Benefits, Calculator, Newsletters, Points` · 회사 행 `About TetherMax`, `Notices`, `Beginner's Guide`, `Affiliate Partner Inquiry` | REQ-465 · REQ-474 | 다름 — 기존 드로어 제품 `Exchanges, Events, Benefits, Cashback Preview, Point`, 회사 행에 `Beginner's Guide` 없음 | [12085:400249](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12085-400249) |
| 모바일 웹 드로어 | 로그인 | 햄버거 | 드로어 | 위와 같음 | REQ-465 | 다름 — 같은 기존 항목 | [12216:424053](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12216-424053) |
| 모바일 웹 드로어 | (선택) 프로모 배너 | 운영 설정 | 배너 | — | REQ-465 | 없음 | — |
| 푸터 | 지원 연락처 + 복사 · Company·Legal · 소셜 | 항상 | 푸터 | 법적 행 `Terms of Use`, `Privacy Policy` | REQ-472 · REQ-474 | 중복 — 푸터 `Terms of Service`, 드로어 `Terms of Use`. 프리로그인 랜딩 푸터 Company에 `Claim Cashback`이 있어 다른 페이지 푸터와 다름 | [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:128375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375) · [12085:400249](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12085-400249) |

## FU-084. Exchange Listings·라우팅·SEO

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| Exchange Listings PC | CEX만 · `Rating` 열 | 진입 | 표 | `Top Centralised Exchanges` · `Centralised Exchanges` | REQ-466 · REQ-475 | 기존 — CEX만, DEX 0건 | [22799:96486](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22799-96486) |
| Exchange Listings | 카드 뷰(평점 생략) · 모바일 | 토글 | 카드 | — | REQ-466 | 기존 | [22807:98684](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22807-98684) · [26382:789181](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=26382-789181) |
| Exchange Listings | 리뷰 20개 미만 → `-` | 리뷰 < 20 | 인라인 | `-` | REQ-466 | 없음 | — |
| Exchange Listings | GL-1 헤더 | 항상 | 헤더 | — | REQ-466 · B-21-5 | 다름 — 목록 프레임 헤더가 구 헤더 계열(정책 B-21-5 「MAX-1373 구 헤더 수정 필요」) | [22799:96486](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22799-96486) |
| 라우팅·SEO | 실제 라우트 · 메타 · FAQPage · sitemap | — | 비표시 | — | REQ-467 | 불필요 | — |

## FU-085. 앱 하단 내비·앱 예외

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 앱 하단 내비 | 5항목, 활성 = 굵기 + 색 | 탭 | 내비 | `Home, Events, Benefits, Exchange, Points` | REQ-469 · ❓ G-215 | 다름 — 기존 `Exchanges` · `Point`(표기 G-215 결정 대기) | [25854:1340444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25854-1340444) |
| 앱 사용자 메뉴 | Cashback 진입(단일 진입점) | 메뉴 | 메뉴 | — | REQ-469 · G-214 | 없음 | — |
| 앱 | 미지원 Cashback 페이지 → 인앱 브라우저(빈 화면 금지) | 딥링크 | 인앱 브라우저 | — | REQ-470 · ❓ G-216 | 없음 | — |
| 앱 | DEX 외부 링크 실패 → 다이얼로그 유지 + 링크 복사 + `Open {DEX}` | 외부 앱/브라우저 실패 | 다이얼로그 | `Open {DEX}` | REQ-470 · ❓ G-216 | 없음 | — |

## FU-086. 공지

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 공지 | DEX 온보딩 공지가 `신규 거래소 추가` 카테고리로 표시, 비로그인 열람 | 게시 | 목록·상세 | — | REQ-468 · REQ-473 | 불필요 — 기존 공지 화면에 DEX 전용 UI 변경 없음(카테고리는 운영 입력) | — |

## FU-087. 웹 기능 범위

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 웹 혜택·리그·랭킹·캠페인·추첨·부스트 | 웹 진입 가능(홈으로 돌려보내지 않음) | 웹 진입 | 페이지 | — | REQ-716 | 있음 — PC 혜택·랭킹·리그 프레임 존재(세부 상태는 rewards 담당) | [29062:113000](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29062-113000) · [28960:127192](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127192) |

## FU-088. 이용약관·개인정보처리방침

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| `/terms/use` | 6.8 거래 계정(UID·지갑) 기준 | 열람 | 페이지 | 개정 문안 ❓ | REQ-718 · 🔴 G-425 | 기존 — 문안 법무 대기, 페이지 디자인 변경 없음 | [12474:202799](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12474-202799) · 모바일 [11572:247028](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=11572-247028) |
| `/terms/privacy` | (b) 지갑 주소·DEX 거래 기록 추가 | 열람 | 페이지 | 개정 문안 ❓ | REQ-717 · 🔴 G-425 | 기존 — 위와 같음 | [12474:202970](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12474-202970) · 모바일 [11572:247029](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=11572-247029) |

## FU-089. CEX 회귀 방지

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| CEX 상세·목록 | CEX 배지 추가 없음, CEX 화면 그대로 | — | — | — | REQ-035 | 기존 — CEX 상세·목록은 [MAX 1216] 그대로 | [22442:219812](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22442-219812) · [22799:96486](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22799-96486) |

## 404 · 점검 · 앱 업데이트 (공통 페이지)

| 화면 | 상태 | 트리거 | 표시 유형 | 원문 문구(명세) | 근거 | 판정 | Figma |
|---|---|---|---|---|---|---|---|
| 404 | 없는 페이지·비게시 상세 | 404 | 페이지 | `Page Not Found` | API-004 404 | 기존 | [12216:419863](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12216-419863) · [12085:401487](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12085-401487) |
| 점검 | 전체 서비스 점검 | 점검 모드 | 페이지 | `System Maintenance` | 공지 카테고리 `점검`(REQ-473) | 기존 | [17000:883](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=17000-883) · [17000:844](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=17000-844) |
| 앱 필수 업데이트 | 강제 업데이트 | 앱 버전 | 다이얼로그 | — | 명세 없음 | 기존 — 명세에 DEX 변경 항목 없음 | [2913:17755](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=2913-17755) |

## FU-090. 분석 이벤트

화면 표시 없음. 명세의 이벤트(dexw·DX-AP)는 사용자에게 보이는 상태를 만들지 않고, Figma에도 이벤트용 표시 요소가 없다. 표에서 제외.

## Figma에만 있는 상태 (명세 누락 후보)

| Figma | 내용 | 명세 쪽 |
|---|---|---|
| [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) | CEX/DEX 비교 DEX 패널 `Where cashback is paid` 옆 칩 `Your Cashback` | REQ-327에 칩 없음 |
| [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) | 모바일 상세 계산기 `Stays with the fee — $89.60` / `Split between {DEX} and TetherMax.` · `80%` | REQ-343·359에 없는 구성. 「실질 수수료가 DEX와 테더맥스로 나뉜다」는 설명은 REQ-344 「사용자 수수료에 더해지는 것 없음」과 함께 정책 확인 필요 |
| [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) | 모바일 리뷰 머리 `Write a review` 버튼(게스트 프레임) | 게스트 작성 진입 동작 미정의 |
| [28960:128375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375) | 프리로그인 랜딩 푸터 Company `Claim Cashback` | 푸터 항목(REQ-472)에 없음 — 게스트 조회 진입 링크로 보임 |

## 디자이너 요청 목록

| 우선 | 화면 | 요청 | 근거 |
|---|---|---|---|
| 1 | Aster 상세 PC [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · 모바일 [28960:131017](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131017) | 설명과 이유 카드 4에서 Solana를 지운다: `Aster is a multichain perpetual DEX on BNB Chain, Ethereum and Arbitrum. …` · `Multichain: BNB Chain, Ethereum & Arbitrum` | 정책 8-5 · REQ-357 · REQ-363 |
| 1 | EdgeX·Aster·ApeX 상세 [28960:127454](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127454) · [28960:127627](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127627) · [28960:127633](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127633) | AI 요약 `Cashback lands in my {DEX} account every week.`을 테더맥스 잔액 기준 문장으로 바꾼다(캐시백이 DEX 계정으로 들어간다는 문장 금지) | REQ-354 · REQ-362 · 정책 8-5 |
| 1 | DEX 랜딩 비교 [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) | 제목 `Who holds your money changes. Your DEX cashback does not.` · 출금 행 라벨 `Where you withdraw`, 값 CEX `On TetherMax, from {min} USDT` / DEX `On TetherMax, from {min} USDT, to your linked wallet` · 리워드 행 라벨 `Event and invite rewards`, 값 양쪽 `Yes`. `{min}`은 변수로 표시 | G-401 · REQ-327 · 정책 8-4 |
| 1 | DEX 랜딩 히어로 [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) | 리드를 확정 문구로: `Trade with your own wallet on the DEX. Paste your wallet address into TetherMax and we pay your cashback into your TetherMax balance.` | G-154 · REQ-320 |
| 1 | DEX 상세 계산기 PC [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) (D2~D6 같은 컴포넌트) | 세 칸이 모두 `$112.00 Trading fee`로 나온다. `Trading fee $112.00 (Without TetherMax)` − `Cashback $22.40 (Returned to you)` = `Effective fee $89.60 (With TetherMax)`로 각 칸 값을 넣는다 | REQ-343 · REQ-359 |
| 1 | DEX 랜딩 카드 [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) ↔ EdgeX·Aster·ApeX 상세 오퍼 박스 | 카드 `Final Taker/Maker`와 상세 `After cashback`을 같은 레코드 값으로 맞춘다(EdgeX 0.0266% ↔ 0.0184% 등). 다르면 게시 차단 규칙에 걸린다 | REQ-325 · REQ-339 |
| 1 | /payback DEX 결과 PC [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · 모바일 [29187:119430](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119430) | DEX 결과에서 `On average, {n} {platform} traders like you …` 카드를 뺀다(같은 묶음 메모 [29187:119616](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119616)와 일치시킴) | REQ-458 |
| 1 | 리뷰 작성 게이트 [22919:73859](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22919-73859) (DEX용 없음) | DEX 상세용 게이트·403 안내를 만든다: `Link your {venue} wallet to write a review.` / 국문 `연동 완료 계정이 있는 회원이 작성할 수 있습니다`, 버튼은 연동 진입. `UID` 표기 금지. 확인 중 지갑만 있는 회원도 같은 게이트 | REQ-352 · G-170 · API-022 403 |
| 1 | DEX 랜딩 마지막 CTA 띠 [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) | 라이트 테마에서도 띠 배경을 다크로 | REQ-331 |
| 1 | 단계 가이드 PC [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) · 모바일 [28960:130999](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130999) | 오른쪽 패널 제목을 왼쪽 목록과 같은 `Step N Title`로(`Create a Web3 wallet`, `Join Lighter and link your wallet`). 경고 문장 별도 박스를 없애고 Description 본문 안에 둔다. 영상 슬롯 데스크톱 2:1 · 모바일 1:1 | G-437 · REQ-345 · REQ-347 |
| 1 | DEX 랜딩 glance [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) | 타일에 24H 거래량·TVL을 넣는다 | REQ-322 |
| 1 | DEX 랜딩 전체 [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) · [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) | glance·카드·모바일 목록을 한 가지 노출 순서로 맞춘다 | REQ-319 |
| 2 | DEX 랜딩 | 상태 프레임 추가: 노출 DEX 0곳(venue·glance 영역 숨김, 빈 상태 화면 없음) · 특정 DEX 점검(`MAINTENANCE`) · 일시 연동 불가(`LINK_UNAVAILABLE` — 카드·`Get Started` 유지) · API-003 실패 · 모바일 넘침 | REQ-332 · G-160 · G-162 · API-003 |
| 2 | DEX 랜딩 DefiLlama | 카드 출처 줄 `Source: DefiLlama, as of {time}.`, 24시간 이내 마지막 값 표시, 24시간 뒤 지표 칸 숨긴 카드, 24H 증감(`−2%`) | REQ-323 · B-6-3 |
| 2 | DEX 랜딩 모바일 [28960:130946](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130946) · [28960:130958](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130958) | 모바일 기본 보기를 1열 카드(TVL·24H·`Learn More`·`Get Started`)로 그리고, 리스트 뷰 프레임은 리뷰 점수·`View {DEX}`가 있는 행으로 구분 | REQ-325 · REQ-326 |
| 2 | DEX 랜딩 리스트 뷰 PC [28960:125536](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125536) | 행 버튼 `Label` → `View {DEX}` | REQ-326 |
| 2 | DEX 랜딩 히어로 | 활성 DEX 수가 바뀐 경우(마크 줄 + `{n}` 함께) 예시 하나 | REQ-320 |
| 2 | DEX 상세 히어로 [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) | 이름 옆 `DEX` 배지 · 혜택 줄(ELC `Bullet 1~4`, 체크 목록) 추가 | REQ-337 · G-441 |
| 2 | DEX 상세 오퍼 박스 [28969:129666](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28969-129666) | `노출=Y, 연동가능=N` 상태(`Link Wallet` 숨김, `Get Started` 유지) · 탭 1개(토글 없음) · 둘째 탭 선택(`Plus`/`Maker`) 상태 | G-162 · G-438 · REQ-339 |
| 2 | DEX 상세 계산기 모바일 [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) | PC와 같은 3칸·흐름도·설명 카드 3장 원문으로 맞춘다(`Normal trading fee`, `Stays with the fee`, `Split between {DEX} and TetherMax`, `80%`를 쓸지 정책 확인) | REQ-343 · REQ-344 · REQ-359 |
| 2 | DEX 상세 `How this works` 드로어 | 드로어 프레임 추가 | REQ-344 |
| 2 | 리뷰 [28960:127445](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127445) · 모바일 [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) | 게스트 안내 `Log in or sign up to write a review` + `After signing up, link your {venue} wallet address to post (anyone can read)`(PC에 추가, 모바일 문구 교체) · 0건 상태(`No reviews yet`, 요약·히스토그램 숨김, `Reviews (0)`) DEX판 | REQ-354 · G-169 · REQ-355 |
| 2 | 리뷰 모바일 [28960:131017](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-131017) | Aster 등 다른 DEX 상세에 Lighter 리뷰(`Lighter Global Reviews`, `#lighter`)가 나오지 않게 거래소별로 교체. Lighter 요약 `Cashback arrives at the same time every day.`는 주간 정산과 맞지 않음 | REQ-354 · 정책 8-2 |
| 2 | 리뷰 하위 점수 [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) · [28960:130990](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130990) | 3축 라벨 `Overall experience` · `Cashback earning` · `Cashback withdrawal`(PC `Cashback payouts`, 모바일 `Using the exchange` 교체. `withdrawal`을 `Claim` 계열로 바꿀지는 문구표) | REQ-353 · G-418 |
| 2 | /payback Summary [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) | EdgeX 각주 `*Based on paid trading fees. EdgeX pays in USDC, shown 1:1 in USDT.`(DEX별 각주) | REQ-462 |
| 2 | /payback | DEX 퍼널 Landing(PB-2) · Trading profile(PB-4) PC · 진행 바 · `How we calculated this?` 펼침을 새 헤더로 그린다. 기존판 리드·`Did you know?` 문구는 명세 원문으로 | REQ-453 · REQ-454 · REQ-456 · REQ-458 |
| 2 | 헤더 `Cashback` 패널 [19604:32651](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=19604-32651) | DEX 헤더용 hover 패널(`Centralised Exchanges` · `Decentralised Exchanges` · `Brokers` 3행) 렌더 | REQ-464 |
| 2 | 모바일 웹 드로어 [12085:400249](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12085-400249) · [12216:424053](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12216-424053) | 제품 6항목 `Cashback, Events, Benefits, Calculator, Newsletters, Points` · 회사 행에 `Beginner's Guide` | REQ-465 · REQ-474 |
| 2 | 앱 | 사용자 메뉴 Cashback 진입 · 미지원 페이지 인앱 브라우저 · DEX 링크 실패 다이얼로그(링크 복사 + `Open {DEX}`) | REQ-469 · REQ-470 · G-216 |
| 2 | 프리로그인 랜딩 [28960:128375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375) | `Hero Exchange`에 DEX를 고른 상태(`Promo Tagline` · `CTA Button Title`) | REQ-288 |
| 2 | 서비스 소개 · 프리로그인 랜딩 · /payback 플랫폼 | 거래소 목록(API-001) 실패 상태 — 「파트너 0곳」으로 보이지 않게 | API-001 |
| 2 | 리뷰 작성 | 401 → 로그인 후 같은 상세·작성 상태로 복귀하는 흐름 | API-022 |
| 3 | 단계 가이드 | Step 2(잘못된 체인 경고) · Step 4·5 선택 상태, 단계 수 3개 예시, 영상 실패(첫 프레임 + 글). 모바일 라벨 `step 5`/`step 6`을 화면과 맞춤 | REQ-345 · REQ-346 · REQ-348 |
| 3 | Lighter Step 3 본문 [28960:127444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127444) | `Open Lighter through the TetherMax link and log in. Then copy your wallet address from Lighter and paste it in TetherMax. TetherMax never asks you to connect a wallet.` 원문 반영 여부 문구표로 확정 | REQ-360 |
| 3 | 비교 STEP 3 · Learn and Earn [28960:125521](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125521) | 명세 원문과 다른 문장(자동 지급·쿠폰 매칭 재작성)을 문구표에 등록하고 `{min}`을 변수로 | REQ-328 · REQ-330 · G-158 · G-419 |
| 3 | FAQ [28960:127443](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127443) | 구역 이름 `Payouts & Account Management` ↔ `Withdrawals & Account Management` 문구표 확정 · 두 구역 동시 펼침 · 약관 서랍 펼침 | REQ-350 · REQ-361 · G-418 |
| 3 | 상세 탭 바 | 스크롤 고정 · 다른 탭 활성 상태 | REQ-341 |
| 3 | 리스트 뷰 · Exchange Listings | 리뷰 20개 미만 `-` 표시 예 | REQ-326 · REQ-466 |
| 3 | 8곳 넘침 [28960:125542](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125542) | 자리표시자 `XX%` 교체 | REQ-325 |
| 3 | /payback Summary [29187:119248](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119248) · [29187:119510](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29187-119510) | PC 헤더를 GL-1로 · 모바일에 `Restart` · PC·모바일 같은 예시값(`Order Type Ratio`) | REQ-459 · REQ-464 |
| 3 | 푸터 · 드로어 | 약관 링크 명칭 `Terms of Use`로 통일(푸터 `Terms of Service`) · 프리로그인 랜딩 푸터 `Claim Cashback` 유지 여부 | REQ-474 · REQ-472 |
| 3 | Exchange Listings [22799:96486](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=22799-96486) | 목록 페이지 헤더를 GL-1로 | REQ-466 · B-21-5 |
| 3 | 앱 하단 내비 [25854:1340444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=25854-1340444) | G-215 결정 후 `Exchange`/`Exchanges` · `Points` 표기 반영 | REQ-469 · G-215 |
| 3 | 모바일 드로어 | (선택) 프로모 배너 자리 | REQ-465 |
| 3 | 서비스 소개 · 프리로그인 랜딩 모바일 | DEX 반영 모바일판(캐러셀·`Our Partners` DEX 탭·거래 계정 문구) | REQ-287 · REQ-288 · REQ-715 |
| 3 | TP 소개 페이지 | `trade using the exchange UID linked …`의 UID → 거래 계정 | REQ-715 |

