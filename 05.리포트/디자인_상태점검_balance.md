# 디자인 상태 전수 점검 — balance (잔액·출금·홈·허브·요약·랭킹)

2026-11-26 · [Figma DEX(revision)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519) · 담당 기능 FU-001~011 · FU-030~048 · FU-060~063

## 요약

| 항목 | 수 |
|---|---|
| 점검한 상태 | **190개** — PC·모바일을 따로 판정한 380칸 중 Figma 판정 대상 352칸(`➖` 28칸은 화면 상태가 아닌 서버·데이터 규칙 또는 미정 G 항목). 아래 수는 칸 수 |
| ✅ 있음 | 98 |
| 🗂 기존 페이지에 있음 | 8 |
| ❌ 없음 | 184 |
| ⚠ 있으나 정책과 다름 | 46 |
| 🔀 중복·모순 | 16 |
| 명세 누락 후보 (Figma에만 있거나 명세에 표시가 없는 상태) | 15 |
| 디자이너 요청 | 우선 1: 6건 · 우선 2: 19건 · 우선 3: 13건 |

**개발 판단**

- **출금 화면(`/withdrawal-apply`·`/withdrawal`)이 Figma에 없다.** Figma 메모는 「회원이 직접 진입하는 출금 페이지는 제외」했지만, 정책은 출금 화면을 잔액·계정 카드·상태 표시용으로 남긴다(정책 6-1, REQ-134 · REQ-710). FU-031~033·036의 상태 23개(PC·모바일 46칸)가 이 결정 하나에 묶여 있다. 화면을 둘지 먼저 정해야 한다.
- 정책 6장이 Figma에 요구한 상태 4종(선차감 반영 · 실패 시 복원 · 전부 불가 · 같은 DEX 복수 지갑)이 보이는 프레임에 없다.
- 허브 Lighter 패널의 주중 추정치 줄(`Accruing this week (estimate)`)과 EdgeX 패널 H8의 금액 불일치는 화면대로 만들면 정책과 다르게 동작한다. 수정 전에는 개발하지 않는다.
- 홈 잔액 카드·Linked Accounts·지갑 상세는 정상 흐름(PC)만 있다. 로딩·오류·지연·칩 상태와 모바일 시안이 없다.
- 캐시백 허브(PC·모바일)와 캐시백 랭킹은 대부분의 상태가 있다. 정상 흐름은 착수할 수 있다.

**판정 기호** — ✅ 있음 · 🗂 기존 페이지에 있음(DEX 미반영 포함) · ❌ 없음 · ⚠ 있으나 정책과 다름 · 🔀 중복·모순 · ➖ 화면 상태가 아님(서버·데이터 규칙, 또는 미정 G 항목이라 판정 보류). 판정은 보이는 프레임의 텍스트 레이어와 렌더 이미지로 했다. 모바일 열은 모바일 웹 기준이고, 앱 전용 화면은 담당 범위에 없다.

**기준** — [정책](../00_DEX_최종정책.md)(부록 G 확정 포함) > [요구사항정의서](../02.기획문서/요구사항정의서.md) > [프론트 명세](../02.기획문서/프론트_기능명세서_사용자.md) · [백엔드 명세](../02.기획문서/백엔드_기능명세서_사용자.md) > [사용자 API](../02.기획문서/API스펙_사용자.md) > [이메일 문구](이메일템플릿_문구변경.md). 참고 [V2.2 화면상태표](프로토타입_V2.2_기능별_화면상태표.md).

## API 응답·오류 코드 → 화면 표시

| API | 응답·코드 | 화면 | 사용자 표시(명세) | Figma |
|---|---|---|---|---|
| API-008 내 거래 계정 목록 | 200 · `MANUAL_LINK_PENDING` 행 `availableCashback: null` | 홈 Linked Accounts | 행 노출, 금액 `-`, 집계 제외 | ❌ |
| | 200 · `isExchangeActive: false` | 홈 행 | `Inactive` 칩 | ❌ |
| | 401 `UNAUTHORIZED` | 홈 | 기존 로그인 이동 | ➖ |
| API-009 지갑 상세 | 200 · `eventReward` null/0 · 양수 | 지갑 상세 | 행 숨김 / `Matched {M} / {B}` | ✅ [지갑 상세 10종][WD] |
| | 200 · `settlement.status` `CREDITED`·`WITHHELD`·`DATA_PENDING`·`PENDING` | 지갑 상세 | 정산 라벨 | ❌ |
| | 200 · `lastUpdatedAt` 있음(`DEGRADED`) | 지갑 상세 | 금액 + `Last updated {time}` | ❌ (메모 텍스트만) |
| | 401 · 404 `NOT_FOUND` | 지갑 상세 | 명세에 표시 없음 | ❌ · 명세 누락 후보 |
| API-010 잔액 | 200 · `eligible` true/false · `shortfall` | 출금 화면·허브·홈 | `Available`/`Unavailable` 칩, 부족분 문구 | ⚠ (허브·지갑 상세만, 문구 다름) |
| | 200 · `loadError: "PARTNER_UNAVAILABLE"` | 출금 화면 카드 · 허브 | `We can't load your latest {DEX} cashback right now.` + `Try again` | ❌ 출금 화면 · ✅ 허브 H7 |
| | 200 · `collectionStatus: DEGRADED` · `lastUpdatedAt` | 출금·홈·허브 | `Last updated {time}` + 지연 문구 | ✅ 허브 H6 · ❌ 홈·출금 |
| | 200 · `preAccrual` | 출금 카드 | 적립 전 별도 줄(합계 미포함) | ❌ |
| | 200 · `payoutNetwork.configured: false` | 출금 화면 | 지갑 목적지 비활성 | ❌ · 문구 명세 누락 |
| | 200 · 원장 미수신 DEX(계정 행 없음) | 허브 | 계산기 | ✅ H2 구성 |
| | 503 `SERVICE_UNAVAILABLE` | 출금·홈·허브 | `We can't load your balance right now.` + `Try again`(0 금지) / 허브 `Cashback could not load` | ✅ 허브 H7 · ❌ 홈·출금 |
| | 401 | 각 화면 | 기존 로그인 이동 | ➖ |
| API-012·013 요약·캘린더 | 200 · `dexPendingDates` | 캐시백 요약 | `DEX data pending`(0 금지) | ✅ [CS1][CS1] |
| | 200 · `collection[].status: DEGRADED` | 캐시백 요약 | 허브 H6과 같은 지연 표시 | ❌ |
| | 200 · `WITHDRAWAL_RETURNED` 행 | 캐시백 요약 | `Withdrawal returned` + 부호 | ❌ |
| | 200 · `range.dexFrom`보다 오래된 달 | 캐시백 요약 | 이미 수집된 것만 — 안내 문구 없음 | ❌ · 명세 누락 후보 |
| | 400 `VALIDATION_ERROR`(month·tz) · 5xx | 캐시백 요약 | 명세에 표시 없음 | ❌ · 명세 누락 후보 |
| API-014 랭킹 | 200 · `rank: null` · `notRankedNotice: true` | 랭킹 | `–` · `캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다.` | ✅ `–` · ❌ 안내 |
| | 400 · 5xx | 랭킹 | 명세에 표시 없음 | ❌ · 명세 누락 후보 |
| API-015 출금 피드 | 200 · 빈 배열 | 랜딩·서비스 소개 | 명세에 표시 없음 | ❌ · 명세 누락 후보 |
| | 503 | 랜딩·서비스 소개 | 「오류 + 다시 불러오기」(문구 없음) | ❌ |
| API-001·002 허브 | 503 | 허브 비교표·계산기 | 빈 목록을 0곳으로 보이지 않음(문구 없음) · 요율 실패 `Estimate unavailable` + `Try again` | ❌ |
| 공통 | 429 `RATE_LIMITED` · 500 | 담당 화면 전체 | 명세에 표시 없음 | ❌ · 명세 누락 후보 |

## 1. 공통 규칙

### FU-001. 용어·상태 표기 통일

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 비교표 | 캐시백 용어 | 화면 문구 | 제목 | `Compare cashback across {n} …` (`rebate` 금지) | REQ-001 · REQ-005 | ⚠ [H1-Broker][H1B] `Compare rebates across 2 brokers` | ⚠ [모바일 H1-Broker][mH1B] 같음 |
| 2 | 요약·피드·허브 | 출금 영문 `Claim` 계열, `payout` 금지 | 화면 문구 | 행·열·각주 | `Claim Amount` 등 | REQ-005 · REQ-719 · G-418 | ⚠ [CS1][CS1] 출금 행 `Payout` · [피드][SIfeed] 열 `Payout Time` · [H5][H5] `Automatic payouts from 10 USDT` · `Payout destination: …` | ⚠ [모바일 요약][mCS] 유형 시트 `Withdrawal` · [모바일 H5][mH5] `payouts` |
| 3 | 지갑 상세·홈 | `연동 완료` 라벨 CEX와 동일, DEX용 `Active` 금지 | 연동 완료 지갑 | 칩 | `연동 완료` | REQ-008 · REQ-273 | ⚠ [PW1][PW1] 칩 `Active` | ❌ 모바일 지갑 상세 없음 |
| 4 | 홈·요약·랭킹 | CEX·DEX 공용 자리는 `거래 계정`/`Account` | 화면 문구 | 라벨 | `All Accounts` · `Link more accounts` | REQ-002 | ✅ [HW1][HW1] · [CS6 계정][CS6acct] | ✅ [모바일 요약][mCS] |
| 5 | 신규 문구 국문 | en만 있는 문구 국문 등록 | 언어팩 | — | — | REQ-046 · ❓ G-367 · G-368 | ➖ | ➖ |

### FU-002. 지갑 주소 표시·복사

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈·지갑 상세·요약 | DEX 주소 비마스킹, 좁은 자리 6+4 축약 | DEX 행 | 식별자 줄 | `0x7a3F…51E9` | REQ-009 · REQ-010 | ✅ [HW1][HW1] · [PW1][PW1] · [CS1][CS1] | ✅ [모바일 요약][mCS] `0x884B…1a69` |
| 2 | 홈·요약 | 축약 자리에서 누르면 전체 보기·복사 | 축약 주소 탭 | 팝오버 | `Wallet address` + 전체 + `Close`(랭킹 시안) | REQ-010 · REQ-366 | ⚠ [랭킹 팝오버][RKpop]만 있음, 홈 행·요약 일별·계정 필터는 축약만 | ❌ |
| 3 | 지갑 상세 헤더 | 주소 옆 복사 아이콘 | 상세 진입 | 아이콘 | — | REQ-013 · REQ-276 | ✅ [PW1][PW1] | ❌ |
| 4 | 지갑 상세 | 복사 완료 토스트 | 복사 아이콘 탭 | 토스트 | 명세에 문구 없음 | REQ-013 | ❌ | 🗂 [기존 Copy UID][X-copy] (CEX) |
| 5 | 홈 행 | 앱·모바일웹은 `Wallet` 라벨 없이 주소만 | 모바일 홈 | 식별자 줄 | — | REQ-013 · REQ-271 | ➖ (웹은 라벨 있음 ✅) | ❌ 모바일 홈 DEX 시안 없음 · 🗂 [기존 S4][X-mS4]는 CEX만 |
| 6 | 요약 필터 | 거래소별 개수 `Lighter (2 wallets)` | 거래소 드롭다운 | 행 라벨 | `Lighter (1 wallet)` | REQ-014 · REQ-365 | ✅ [CS6 All][CS6a] | ✅ [모바일 CS6][mCS6] |
| 7 | 공개 피드 | 고정 마스크 + 끝 4자리 | 피드 행 | 식별자 | `********…51e9` | REQ-285 | ✅ [서비스 소개 피드][SIfeed] · [랜딩][LL] | ❌ 모바일 피드 없음 |
| 8 | 이메일 | 전체 주소 + `Network` 행 / 푸시 마스킹 | 메일·푸시 발송 | 메일 본문 | — | REQ-011 | ✅ [완료 메일][E-ok] | ✅ [완료 메일 모바일][E-okM] |
| 9 | 주소 값 영역 | 고정폭 + break-all, 360px 넘침 없음 | 긴 주소 | — | — | REQ-012 | ➖ 구현 검증 | ➖ 구현 검증 |

### FU-004. 금액 계산·표시 규칙

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 지갑 상세 | 둘째 자리 절삭 | 9.999 | 금액 | `9.99 USDT` | REQ-019 | ✅ [지갑 상세 10종][WD] | ❌ |
| 2 | 허브 계산기 | 일/연 환산 절삭 | 월 $5.60 · $24.75 | 금액 | `Per day $0.18` · `$0.82` | REQ-317 · REQ-042 | ⚠ [H1][H1] `$0.19` · [H1-CEX][H1C] `$0.83`(반올림) | ⚠ [모바일 H1][mH1] · [모바일 H1-CEX][mH1C] 같음 |
| 3 | 홈·랭킹 카드 | 실제 0은 `0.00 USDT` | 잔액 0 | 금액 | `0.00 USDT` | REQ-023 · REQ-267 | ⚠ [S3-1][S3-1] · [RK1][RK1] 사이드 카드 `0 USDT` | ⚠ [모바일 랭킹][mRK] `0 USDT` |
| 4 | 요약 행 | `+`/`−` 부호 + 색, 소수 둘째 자리 | 적립·출금 행 | 금액 | `+25.00 USDT` | REQ-024 | ✅ [CS1][CS1] · [PW1][PW1] 주간 띠 | ⚠ [모바일 요약][mCS] `150.00 USDT`(부호 없음) · `+50 USDT`(소수 없음) |
| 5 | 요약 캘린더 | 큰 금액 K·M | 12,100.5 | 칸 | `+12.10K` | REQ-042 | ✅ [CS3][CS3] · [CS4][CS4] | ❌ |
| 6 | 요약 월간 카드 | USDC 1:1, USDT만 | DEX USDC 적립 | 캡션 | `All amounts are shown in USDT. Cashback a DEX pays in USDC is shown 1:1 in USDT. Each calendar day shows the net amount.` | REQ-022 · REQ-378 | ✅ [CS1][CS1] | ❌ 모바일 월간 카드 없음 |
| 7 | 요약·홈 | 합계 = 표시된 행 합 | 합계 표시 | 금액 | — | REQ-021 · REQ-268 | 🔀 [CS1][CS1] 월 `Net +10.00` ↔ 캘린더 일 순액 합 `−4.40` · [S3-7][S3-7] 총액 `5,137.70` ↔ 행 `0.00` 1개 · [S4-1][S4-1] `5,137.70` ↔ 행 합 `134.00` | ❌ |
| 8 | 요약 월간 카드 | Net 값 표시 | 큰 금액 달 | 금액 | — | REQ-369 | ⚠ [CS4][CS4] `Net` 값이 비어 있음 | ❌ |
| 9 | 전 화면 | 절삭 적용 범위 | — | — | — | ❓ G-049 · ❓ G-054 | ➖ | ➖ |

### FU-005. 시각 처리

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브·랭킹·요약 | 로컬 시각, 타임존 라벨 없음 | 시각 표시 | 텍스트 | `Rankings are updated daily at 00:01` | REQ-026 · REQ-043 | ✅ [H6][H6] · [RK1][RK1] | ✅ [모바일 H6][mH6] · [모바일 랭킹][mRK] |
| 2 | 전 화면 | 표시 형식 하나 | 시각 표시 | 텍스트 | 예 `2026.05.12 14:35` | REQ-043 | 🔀 [H6][H6] `14 Oct 2026, 09:12` · [PW1][PW1] `Mar 17 00:00` · [피드][SIfeed] `07/24/2026, 18:18` · [CS1][CS1] `2026/05/26` | 🔀 [모바일 H6][mH6] · [모바일 요약][mCS] `2026/03/05`(캘린더는 May 2026) |
| 3 | 랭킹·요약 | 월 경계 | — | — | — | ❓ G-185 | ➖ | ➖ |

### FU-006. CEX·DEX 구분 컨트롤과 배지

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 요약 필터 | `거래소 ▾` 1개 + CEX/DEX 그룹 헤더 | 드롭다운 열기 | 드롭다운 | `Centralised Exchanges` / `Decentralised Exchanges` | REQ-029 | ✅ [CS6 All][CS6a] | ✅ [모바일 CS6][mCS6] |
| 2 | 요약 필터 | 상단 범위 선택 + 선택 후 트리거 문구 | `DEX 전체` 선택 | 트리거 | 트리거 `DEX 전체` | REQ-030 | ⚠ [CS6 DEX][CS6dex] 드롭다운 안 `All·CEX·DEX` 세그먼트 + `All DEX exchanges` 행은 있음, 선택 후 트리거 상태 시안 없음 | ⚠ [모바일 CS6 DEX][mCS6dex] 같음 |
| 3 | 랭킹 | 칩 `All / CEX / DEX` | 칩 선택 | 칩 | — | REQ-379 | ✅ [RK CEX][RKcex] · [RK DEX][RKdex] | ✅ [모바일 CEX][mRKcex] · [모바일 DEX][mRKdex] |
| 4 | 공개 피드 | 거래소 이름 옆 `DEX` 배지 | DEX 행 | 배지 | `DEX` | REQ-031 · REQ-285 | ⚠ [피드][SIfeed] 로고만, 거래소 이름·배지 없음 | ❌ |
| 5 | 전 화면 | `CEX` 배지 없음, 식별자 있는 자리 `DEX` 배지 없음 | — | — | — | REQ-031 · REQ-135 | ✅ [HW1][HW1] · [PW1][PW1] | ✅ [모바일 H5][mH5] |

### FU-007. 계정 단위 판정과 집계 범위

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈 Linked Accounts | 확인 중 지갑: 행 노출 · 금액 `-` · 총액·계정 수 제외 | `MANUAL_LINK_PENDING` | 행 | 상태 `연동 시도중이에요` | REQ-034 · API-008 | ❌ 설명만 있음([S3-F5 라벨][S3-F5]) | ❌ |
| 2 | 출금·허브 | 같은 DEX 지갑 2개 → 카드 2장, 판정 각각 | 지갑 2개(12·4) | 카드 | — | REQ-033 · REQ-302 · 정책 6장 | ❌ | ❌ |

### FU-008. 거래소 레코드 단일 원본·국가 노출

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브·비교표 | 제한 국가 DEX 서버 제외, 0곳이면 영역 숨김 | 국가 코드 | — | — | REQ-037 · REQ-045 · ❓ B-2-1 | ➖ 서버 제외 · 전부 차단 화면은 미정 | ➖ |

### FU-009. 화면 공통 동작

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈·허브·지갑 상세 | `Auto Claim` 비활성, 옆 안내 문구 없음 | 항상 | 버튼 | `Auto Claim` | REQ-039 · REQ-144 | ✅ [HW1][HW1] · [PW1][PW1] · [H5][H5] | ✅ [모바일 H5][mH5] |
| 2 | 홈 행 | 상태 점에 텍스트 병기 | 행 표시 | 점 + 텍스트 | — | REQ-039 · REQ-271 | ⚠ [HW1][HW1] 초록 점만, Aster 주황 점 아래 `Chip` 자리표시 | ❌ |
| 3 | 허브 | 설정 없는 컨트롤 미렌더 | 외부 경로 없음 | — | — | REQ-038 | ➖ | ➖ |
| 4 | 담당 화면 전체 | 429·500 등 공통 오류 | 공통 오류 코드 | 명세에 없음 | — | API 공통 | ❌ · 명세 누락 후보 | ❌ |

### FU-010. 외부 가입 경로

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 비교표 | `Join {partner}` → 테더맥스 상세로 직접 이동 | 행 버튼 | 링크 | `Join EdgeX` | REQ-044 · REQ-312 | ✅ [H1][H1] · [허브 메모][MEMO-HUB] | ✅ [모바일 H1][mH1] 카드 |

### FU-011. DEX 정산 상태 라벨

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 패널·카드 | Lighter 주중 「집계 전」(금액·추정치 줄 없음) | Lighter 주중 | 라벨 | 「집계 전」 | REQ-047 · REQ-303 · G-100 · G-059 | ⚠ [H5][H5] · [DW0][DW0] `Accruing this week (estimate)` · `Lighter settles weekly. Not in the totals above.` · `3.20 USDT` | ⚠ [모바일 H5][mH5] 같음 |
| 2 | 카드·요약 | Lighter `Credited` | 월요일 원장 수신 | 라벨 + 금액 | `Credited` | REQ-047 · REQ-372 · 보류 G-428 | ❌ | ❌ |
| 3 | 카드·요약 | Lighter `Withheld` | 어뷰징 보류 주차 | 라벨 | `Withheld by Lighter after review` | REQ-047 · 보류 G-428 | ❌ | ❌ |
| 4 | 카드 | Lighter 주 $1 미만 | 주 $1 미만 | 라벨 | `Under the $1 minimum, not credited` | REQ-047 · ⏳ G-016 · G-059(회원 화면 3종) | ➖ 명세 정리 필요 | ➖ |
| 5 | 출금 카드 | ApeX `Pending` 별도 줄 | ApeX 원장 전 배치 노출 시 | 줄 | `Pending` | REQ-047 · G-127 | ❌ | ❌ |
| 6 | 요약 캘린더 | `DEX data pending`(0 금지) | `dexPendingDates` | 칸 라벨 | `DEX data pending` | REQ-047 · REQ-373 | ✅ [CS1][CS1] 25일 | ❌ |
| 7 | 카드·패널·지갑 상세 | `DEX data pending` | 원장 미수신 날 | 라벨 | `DEX data pending` | REQ-047 | ❌ | ❌ |
| 8 | 허브 EdgeX 패널 | 어드민 전용 상태어 노출 금지 | EdgeX 연동 | 패널 줄 | `Paid`·`Final`은 어드민 전용 | G-059 | ⚠ [H8][H8] `Paid records, reported by EdgeX` | ⚠ [모바일 H8][mH8] 같음 |

## 3. 출금 (10분 주기 자동 지급)

> 아래 FU-031~033·036의 출금 화면 상태는 [독립 출금 화면 제외 메모][MEMO-WD]와 [인계 색인 FU-036][HO-036]이 화면 자체를 뺐다. 정책 6-1·6-4와 REQ-134·REQ-710은 화면을 유지한다. 기존 CEX 출금 드로어([기존 출금][X-WD] · [기존 Not eligible][X-NE])는 활성 `Withdraw`·마일스톤 구판이라 DEX·`Auto Claim`이 반영되지 않았다.

### FU-030. 매칭 공식·출금 자격 판정

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 지갑 상세·허브 | 계정별 `A + MIN(B, A)` 절삭, 10 기준 | API-010 `matchedAmount` · `eligible` | 금액·칩 | — | REQ-129 | ✅ [지갑 상세 10종][WD] · [H3][H3] `Claimable 32.40 USDT` | ✅ [모바일 H3][mH3] |
| 2 | 지갑 상세·허브·출금 | 부족분 문구(계산값) | `eligible: false` · `shortfall` | 인라인 | `You can claim cashback if you receive an additional {n} USDT in exchange Cashback.` · 허브 G-139 `You can claim if you receive an additional {n} USDT in exchange cashback.` | REQ-130 · G-139 | ⚠ [지갑 상세][WD] `Additional exchange cashback needed: {n} USDT` · [H4][H4] `Just 3.00 USDT more to qualify.` | ⚠ [모바일 H4][mH4] 같음 |

### FU-031. 출금 화면 — 계정 목록·카드·합계·`Auto Claim`

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | `/withdrawal-apply` | 화면 존재(제목 `Claim`) | 진입 | 페이지 | `Claim` · `Total Claimable Cashback` | 정책 6-1 · REQ-134 | 🔀 [제외 메모][MEMO-WD] ↔ 정책 · 🗂 [기존 출금][X-WD] | 🔀 같음 |
| 2 | `/withdrawal-apply` | 한 목록, 가능 위·불가 아래, 확인 중 제외 | 계정 여러 개 | 카드 목록 | — | REQ-134 · ❓ G-115 | ❌ | ❌ |
| 3 | `/withdrawal-apply` | DEX 카드 구성(`Wallet {전체}` · `Available Cashback` · `Exchange Cashback` · 조건부 `Event Reward` · 칩 · 부족분) | DEX 계정 | 카드 | — | REQ-135 | ❌ | ❌ |
| 4 | `/withdrawal-apply` | `Available` 초록 / `Inactive` 회색 dimmed | 매칭 ≥10 / <10 | 칩 | `Available` · `Unclaimable` | REQ-136 · 정책 STG 문구 | 🗂 [기존 출금][X-WD] (CEX) | ❌ |
| 5 | `/withdrawal-apply` | 같은 주소 DEX별 카드 따로 | 같은 주소 Lighter·EdgeX | 카드 2장 | — | REQ-136 | ❌ | ❌ |
| 6 | `/withdrawal-apply` | `Cashback updates` 행 + 정보 아이콘 | DEX 카드 | 행·툴팁 | Lighter `Every Monday` + `Lighter reports every Monday for the week before. New trades show after the next report.` · EdgeX `Daily, {로컬 시각}` | REQ-137 · ⏳ G-036 · G-025 | ❌ | ❌ |
| 7 | `/withdrawal-apply` | 적립 전 별도 줄(합계 미포함) | `preAccrual` | 줄 | — | REQ-138 · G-127 | ❌ | ❌ |
| 8 | `/withdrawal-apply` | 상단 합계 = 자격 계정 합 | 자격 계정 있음 | 합계 카드 | `Total Claimable Cashback` | REQ-139 | ❌ | ❌ |
| 9 | `/withdrawal-apply` | 계정 11개 이상 → 10개 + `더보기` | 계정 ≥11 | 버튼 | `더보기` | REQ-134 · G-114 | ❌ | ❌ |
| 10 | 출금 화면 하단 | `Auto Claim` 비활성, 팝업 없음 | 항상 | 버튼 | `Auto Claim` | REQ-133 | ❌ (출금 화면 없음) | ❌ |
| 11 | `/withdrawal-apply` | DEX 오프보딩 계정 | `isExchangeActive: false` | 배지 | `Inactive` | REQ-273 · API-008 | ❌ | ❌ |

### FU-032. 출금 화면 상태

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | `/withdrawal-apply` | 로딩 — 스켈레톤, 금액·버튼 미렌더 | 응답 전 | 스켈레톤 | — | REQ-145 | ❌ | ❌ |
| 2 | `/withdrawal-apply` | 전부 불가 — `0.00 USDT` + 이유 + 매칭 안내 + `Not eligible to withdraw` 배지 | 전 계정 `eligible: false` | 합계 카드 + 배지 | `출금 가능한 계정이 없어요. 캐시백 {n} USDT가 더 쌓이면 출금할 수 있어요.` / en G-108 `No account can be claimed yet. You can claim once {n} USDT more cashback accrues.` · `이벤트 리워드는 같은 계정의 캐시백과 1:1로 매칭됩니다. 최소 출금액은 계정별 10 USDT입니다.` | REQ-136 · REQ-139 · G-108 · 정책 6장 | 🗂 [기존 Not eligible][X-NE] `No UIDs are eligible for withdrawal.`(교체 대상) | ❌ |
| 3 | `/withdrawal-apply` | 0원 DEX 카드 + 배너 | DEX 캐시백 0 | 카드 + 배너 | 일 정산 `Cashback appears here the day after you trade on your linked DEX.` · Lighter `Cashback appears here after Lighter's Monday settlement.` | REQ-146 · G-110 | ❌ | ❌ |
| 4 | `/withdrawal-apply` | 데이터 지연 — 카드 `Last updated {time}`, 자동 지급 유지 | `DEGRADED` | 카드 캡션 | `Last updated {time}` | REQ-147 · G-348 | ❌ | ❌ |
| 5 | `/withdrawal-apply` | 파트너 오류 — 그 카드만 | `loadError: PARTNER_UNAVAILABLE` | 카드 인라인 | `We can't load your latest {DEX} cashback right now.` + `Try again` | REQ-148 | ❌ | ❌ |
| 6 | `/withdrawal-apply` | 잔액 오류 — 0 금지 | API-010 503 | 합계 카드 | `We can't load your balance right now.` + `Try again` | REQ-149 | ❌ | ❌ |

### FU-033. 출금 단위·목적지·네트워크·가스

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | `/withdrawal-apply` | `Network` 행(선택 불가) + 안내 | `payoutNetwork.configured: true` | 행 | `Deposits are made to the above wallet address on {network name}.` | REQ-141 · ⏳ G-044 | ❌ | ❌ |
| 2 | `/withdrawal-apply` | `Network fee` 줄 = 테더맥스 부담(숫자·`TBC` 없음) | 항상 | 줄 | 「테더맥스가 전액 부담」(en 미정) | REQ-143 | ❌ | ❌ |
| 3 | `/withdrawal-apply` | 지급 네트워크 미설정 — 지갑 목적지 비활성 | `configured: false` | 행 | 명세에 문구 없음 | REQ-142 | ❌ · 명세 누락 후보 | ❌ |
| 4 | 출금 관련 화면 | 금액·주소·네트워크 입력 요소 없음 | — | — | — | REQ-140 · REQ-141 | ✅ [HW1][HW1] · [PW1][PW1] · [H5][H5] | ✅ [모바일 H5][mH5] |

### FU-034. 자동 지급 신청 생성 (선차감)

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈·허브·지갑 상세·출금 | 선차감된 잔액 + 줄어든 이유 문구 | 자동 지급 신청 생성 | 인라인 캡션 | 예 `출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다`(en G-112 문구표) | REQ-158 · G-112 · 정책 6장 | ❌ ([지갑 상세][WD] 메모에 「서버가 차감한 잔액으로 갱신」만) | ❌ |
| 2 | 홈·허브·출금 | 같은 새로고침에 같은 값 | — | — | — | REQ-158 | ➖ 구현 검증 | ➖ |

### FU-035. 자동 지급 결과 처리·전달

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 회원 화면 | 결과 화면·tx 해시·익스플로러 없음 | — | — | — | REQ-163 | ✅ [자동 지급 메모][MEMO-AC] 「팝업·인증·완료·공유 화면 숨김」 | ✅ 같은 메모 |
| 2 | 이메일 | 자동 지급 접수 | 신청 접수(현행 경로) | 메일 | EN `Cashback payout received` / KO `캐시백 자동 지급이 접수되었습니다.` | REQ-163 · G-405 · REQ-719 | ⚠ [접수 EN][E-acc] 제목 `payout` · ✅ [접수 KO][E-accKO] | ⚠ [접수 EN 모바일][E-accM] · ✅ [접수 KO 모바일][E-accKOM] |
| 3 | 이메일 | 계정별 지급 완료 | `SENT` | 메일 | EN `Auto-Cashback Withdrawal Completed` / KO `캐시백 자동 출금 완료` | REQ-163 · REQ-719 | ⚠ [완료 EN][E-ok] `Withdrawal` 표현 · ✅ [완료 KO][E-okKO] | ⚠ [완료 EN 모바일][E-okM] · ✅ [완료 KO 모바일][E-okKOM] |
| 4 | 이메일 | 계정별 최종 실패 + 잔액 복원 | 재시도 종료·복원 | 메일 | EN `Cashback withdrawal failed` / KO `캐시백 자동 지급 실패` | REQ-163 · REQ-164 | ⚠ [실패 EN][E-fail] `withdrawal` 표현 · ✅ [실패 KO][E-failKO] | ⚠ [실패 EN 모바일][E-failM] · ✅ [실패 KO 모바일][E-failKOM] |
| 5 | 푸시 | 접수·완료·실패 푸시 | 현행 정책 | 푸시 | FCM.xlsx | REQ-163 | ➖ Figma 대상 아님 | ➖ |
| 6 | 홈·허브·지갑 상세·요약 | 복원 후 잔액 표시 | 최종 실패 → 복원 | 금액 | — | REQ-164 · 정책 6장 | ❌ | ❌ |
| 7 | 공개 피드 | 실패 건 행 없음 | 실패 | — | — | REQ-164 · G-137 | ➖ 데이터 | ➖ |

### FU-036. 두 번째 출금 화면 (`/withdrawal`)

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | `/withdrawal` | 출금 가능 계정 없음 화면 | 자격 계정 0 | 페이지 | `Trading just a bit more and you can claim.` · `Cashback to be Claimed` · `Go back` | REQ-710 · 정책 S-14 | 🔀 [인계 색인][HO-036] 「사용자 직접 출금 진입점 폐지」 ↔ REQ-710 | 🔀 같음 |
| 2 | `/withdrawal` | DEX 행(지갑 전체 주소) + 매칭 기준 안내(거래 계정) | DEX 계정 | 행·안내 | 「캐시백 10 USDT 이상」 → 매칭 기준 문구(문구표) | REQ-710 · G-419 | ❌ | ❌ |

## 6. 홈·계정 상세

### FU-037. 홈 상태 분기

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈 S3 | 체크리스트 3단계 + `Cashback Preview` | 가입·연동 0 | 카드 | `Unlock Your First Cashback in 3 Steps!` · `{n} of our users earn an average of {min} USDT to {max} USDT in cashback per month.` | REQ-267 | ✅ [S3-1][S3-1] | ➖ (웹 전용) |
| 2 | 홈 S3 | DEX 첫 연동 경로 `3 USDT` 획득 안내 없음 | DEX 선택 | 배지 숨김 | — | REQ-267 | ✅ [홈 연동 메모][MEMO-HOME] | ➖ |
| 3 | 홈 S3 | 앱·모바일웹 빈 홈 카드 | 가입·연동 0 | 카드 | `Link once and cashbacks keep coming` + `Link Account` | REQ-267 · ❓ 사용자 확인 #48 | ➖ | 🗂 [기존 모바일 S3][X-mS3] (DEX 미반영) |
| 4 | 홈 S3 | `0.00 USDT` + `Auto Claim` 비활성 | 연동 0 | 카드 | `Total Cashback Balance` | REQ-267 | ⚠ [S3-1][S3-1] `0 USDT`(FU-004 #3과 같은 건) | ❌ |
| 5 | 홈 | DEX만 연동 → S4 | DEX 지갑 1개 | 홈 S4 | — | REQ-266 | ✅ [S3-7][S3-7] | ❌ |
| 6 | 홈 | 확인 중 지갑만 있음 | `MANUAL_LINK_PENDING`만 | 홈 행 | — | REQ-266 · REQ-034 | ❌ | ❌ |

### FU-038. 총 캐시백 잔액 카드

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈 | 총액 = CEX+DEX 매칭 전 합, 연동 미완료 제외 | API-010 `totalCashbackBalance` | 카드 | `Total Cashback Balance` | REQ-268 · ❓ G-052 | ✅ [HW1][HW1] `151.20` | ❌ |
| 2 | 홈 | 로딩 — 스켈레톤 | 응답 전 | 스켈레톤 | — | REQ-269 | ❌ | ❌ |
| 3 | 홈 | 로드 실패 — 0 금지 | API-010 503 | 카드 | `We can't load your balance right now.` + `Try again` | REQ-269 | ❌ | ❌ |
| 4 | 홈 | DEX 원장 하나 지연 — 총액 + 최근 갱신 시각 | `DEGRADED` | 캡션 | `Last updated {time}` | REQ-269 | ❌ | ❌ |
| 5 | 홈 | `Auto Claim` 항상 비활성 | 항상 | 버튼 | `Auto Claim` | REQ-270 | ✅ [HW1][HW1] | ❌ |
| 6 | 허브 | 원장 미수신 DEX → 계산기(빈 패널 금지) | 계정 행 없음 | 계산기 | — | REQ-275 · REQ-299 | ✅ [H2][H2] 구성 | ✅ [모바일 H2][mH2] |

### FU-039. Linked Accounts 목록·상태 칩

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈 | CEX·DEX 한 목록(로고·이름·금액·식별자·점) | 연동 계정 있음 | 행 | `UID {UID}` / `Wallet {주소}` | REQ-271 | ✅ [HW1][HW1] · [S4-1][S4-1] | ❌ · 🗂 [기존 모바일 S4][X-mS4] (CEX만) |
| 2 | 홈 | 행 선택 CEX → 계정, DEX → 지갑 상세 | 행 탭 | 이동 | — | REQ-271 | ✅ [지갑 상세 메모][WD] | ❌ |
| 3 | 홈 | 푸터 링크 | 항상 | 링크 | 웹 `Using multiple platforms? Link more accounts` / 앱·모바일웹 `Trading on multiple exchanges? Link more` | REQ-271 | ✅ [HW1][HW1] | ❌ |
| 4 | 홈 | 11개 이상 → 10개 + `더보기`, 패널 안 스크롤 | 계정 ≥11 | 버튼 | `더보기` | REQ-271 | ❌ | ❌ |
| 5 | 홈 | 로딩 — 스켈레톤 행 | 응답 전 | 스켈레톤 | — | REQ-271 | ❌ | ❌ |
| 6 | 홈 | 상태 7단계 우선순위(소유 확인중~연동 해제) | 상태별 행 | 칩·정렬 | 기존 UID 칩 | REQ-272 | ❌ (DEX 행 시안 없음) | ❌ |
| 7 | 홈 | 캐시백 0 DEX 행 | `availableCashback` 0 | 칩 | `No cashback yet` 계열(`Unavailable` 금지) | REQ-273 | ⚠ [S4-6][S4-6] · [HW1][HW1] 주황 칩 텍스트 `Chip`(자리표시) | ❌ |
| 8 | 홈 | 데이터 지연 행 | `DEGRADED` | 칩 + 문구 | `Data delayed` · `신규 적립 내역 반영이 지연되고 있습니다. 기존 확정 잔액은 그대로이며 출금할 수 있어요.` + `Last updated {time}` | REQ-273 · REQ-274 | ❌ | ❌ |
| 9 | 홈 | DEX 오프보딩 행 | `isExchangeActive: false` | 칩 | `Inactive` | REQ-273 | ❌ | ❌ |
| 10 | 홈 | 새 지갑 행 `0.00 USDT` + 성공 토스트 | 연동 완료 복귀 | 행 + 토스트 | `Account linked successfully` | REQ-271 | ✅ [S4-6][S4-6] · [S3-7][S3-7] | ❌ |

### FU-040. DEX 지갑 상세

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 지갑 상세 | 헤더 로고·이름·주소+복사·칩 | 진입 | 헤더 | 칩 `연동 완료` | REQ-276 | ⚠ [PW1][PW1] 칩 `Active`(FU-001 #3과 같은 건) | ❌ |
| 2 | 지갑 상세 | 금액 카드 + `Claimable {amount} USDT · Minimum 10 USDT` + 진행 막대 | API-009 | 카드 | — | REQ-277 | ✅ [PW1][PW1] · [지갑 상세 10종][WD] | ❌ |
| 3 | 지갑 상세 | 리워드 없음 / 0원 / 리워드만 / 부분 매칭 / 경계값 10.00 | A·B 조합 | 카드 | `Matched {M} / {B} USDT in event rewards` | REQ-277 · FU-040 본문 표 | ✅ [지갑 상세 10종][WD] | ❌ |
| 4 | 지갑 상세 | 지연 — 금액 + `Last updated {time}` | `lastUpdatedAt` | 캡션 | `Last updated {time}` | REQ-277 | ❌ (메모 텍스트만) | ❌ |
| 5 | 지갑 상세 | 로딩 — 스켈레톤 | 응답 전 | 스켈레톤 | — | REQ-145 · FU-040 본문 | ❌ (메모 텍스트만) | ❌ |
| 6 | 지갑 상세 | 조회 실패 — 오류 + 재시도(0과 구분) | API-009 5xx · API-010 503 | 카드 | 명세는 「오류 + 재시도」 | FU-040 본문 | ❌ (메모 텍스트만) | ❌ |
| 7 | 지갑 상세 | 404 — 없는·남의 계정 | API-009 404 | 페이지 | 명세에 표시 없음 | API-009 | ❌ · 명세 누락 후보 | ❌ |
| 8 | 지갑 상세 | `Weekly Cashback History` 7일 띠 + `View All` | 진입 | 띠 | `+25.00` · `-20.00` | REQ-278 | ✅ [PW1][PW1] | ❌ |
| 9 | 지갑 상세 | 리뷰 유도(이 DEX 리뷰 전) | 리뷰 없음 | 배너 | `How was {DEX}?` / `Your first review earns you 2 USDT. It takes about a minute.` / `Write a review, get 2 USDT` | REQ-278 | ⚠ [PW1][PW1] 버튼 `Label`(자리표시) | ❌ |
| 10 | 지갑 상세 | 리뷰 작성 후 — 리뷰 유도 없음 | 리뷰 있음 | 숨김 | — | REQ-278 | ❌ | ❌ |
| 11 | 지갑 상세 | `Exclusive Benefit` + `Top Partner DEXs` | 진입 | 섹션 | `Up to {rate}% cashback` | REQ-278 · REQ-280 · ⏳ G-003 | ✅ [PW1][PW1] | ❌ |
| 12 | 지갑 상세 | `Total Claimed` 유지 | `Sent` 누계 | 줄 | `Total Claimed` | REQ-281 · G-053 | ❌ | ❌ |
| 13 | 지갑 상세 | 테더맥스 지급자 표현(`paid by {DEX}` 없음) · 마일스톤 없음 · 하위 계정 없음 | — | — | — | REQ-279 · REQ-281 | ✅ [PW1][PW1] | ❌ |

### FU-041. 캐시백 타임라인·누적 캐시백

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 지갑 상세 | 타임라인 3단계 | 진입 | 단계 | `Start Trading` · `Cut-off Time` · `Updated` | REQ-289 | ✅ [PW1][PW1] | 🗂 [기존 타임라인 모바일][X-mTL] (CEX) |
| 2 | 타임라인 | 지급 상세 4행 + 주기 `Daily D+1` / `D+2` / `Weekly W+1` + 지급처 `Account` | 거래소별 | 표 | `대상 거래 기간` / `지급 주기` / `지급 시각` / `지급처` | REQ-282 · REQ-289 | 🗂 [기존 타임라인][X-TL] (지급처 `Your UID on TetherMax`, DEX 미반영) | 🗂 [기존 타임라인 모바일][X-mTL] |
| 3 | 타임라인 | compact 단계 | compact 자리 | 단계 | `거래 집계 → 거래소 정산 확인 → 테더맥스 확인 → 캐시백 반영 완료` | REQ-289 | ❌ | ❌ |
| 4 | 타임라인 | 순차 지급 경고 | 업데이트 지연 | 인라인 | `거래소별로 순차 지급하고 있어서 몇 분 더 걸릴 수 있어요.` | REQ-289 | ❌ | ❌ |
| 5 | 홈 | 누적 캐시백 블록 | 진입 | 블록 | `누적 캐시백 금액` / `이번 달 캐시백` / `누적 출금 금액` · `{n}개 거래 계정 합산` + 갱신 시각 | REQ-283 · REQ-290 | ❌ | ❌ |

### FU-042. 실시간 출금 피드

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 게스트 홈(랜딩)·서비스 소개 | 정상 — CEX·DEX 시간순, 컬럼 | API-015 200 | 표 | 컬럼 `거래 계정 · 거래소 · 캐시백 · 출금 시각 · 상태` | REQ-285 | ⚠ [서비스 소개 피드][SIfeed] · [랜딩][LL] 컬럼 `Accounts · Partner · Cashback · Payout Time · Status`, 거래소는 로고만 | ❌ 모바일 랜딩·서비스 소개 없음 |
| 2 | 게스트 홈·서비스 소개 | 섹션 제목·부제 그대로 | — | 제목 | `지금 이 순간에도 누군가는 캐시백을 받고 있어요` / `쌓인 캐시백을 한 푼도 빠짐없이 받아가세요` | REQ-285 | 🔀 [랜딩][LL] `Someone is cashing out right now` / `Claim every cent you've earned` ↔ [서비스 소개][SI] `Someone just got paid. Watch it happen.` | ❌ |
| 3 | 피드 | 로딩 | 응답 전 | 스켈레톤 | — | REQ-285 | ❌ | ❌ |
| 4 | 피드 | 빈 피드 | 200 빈 배열 | 빈 상태 | 명세에 문구 없음 | G-137 | ❌ · 명세 누락 후보 | ❌ |
| 5 | 피드 | 조회 실패 — 피드 영역만 오류 + 다시 불러오기 | API-015 503 | 인라인 | 명세에 문구 없음 | API-015 | ❌ | ❌ |
| 6 | 피드 | 갱신 주기 DEX별 | — | — | — | REQ-286 · ⏳ G-025 · G-036 | ➖ | ➖ |

### FU-043. 서비스 소개·프리로그인 랜딩

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 서비스 소개 | 파트너 캐러셀 DEX 포함(API) | API-001 | 캐러셀 | — | REQ-287 | ✅ [서비스 소개][SI] | ❌ |
| 2 | 랜딩 | 3단계 자동 지급 문구 | — | 단계 | — | REQ-287 · 정책 6-1 | 🔀 [랜딩 라이트][LL] `Get automatic payouts in USDT` ↔ [랜딩 다크][LDk] `Get paid daily in USDT` | ❌ |
| 3 | 서비스 소개 | UID → 거래 계정 | — | 문구 | — | REQ-715 | ✅ [서비스 소개][SI] `link your exchange UID or DEX wallet address` | ❌ |
| 4 | 프리로그인 랜딩 | `Featured Exchanges`·`Hero Exchange`에 DEX | 운영자 선택 | 모듈 | `Promo Tagline` · `CTA Button Title` | REQ-288 | ❌ | ❌ |

### FU-044. 홈 FAQ

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 홈 FAQ | 회원 답변 = 거래 계정 기준 자동 지급, 비회원 답변 = 조회 후 같은 거래 계정 연동 | — | 아코디언 | 명세에 문구 없음(방향만) | REQ-711 | 🔀 [인계 색인 FU-044][HO-044] 「비회원 답변 삭제」 ↔ REQ-711 · 🗂 [기존 FAQ][X-FAQ] | 🗂 [기존 FAQ 모바일][X-mFAQ] |

## 7. 캐시백 허브

### FU-045. 허브 히어로·계산기

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 | 히어로 + 계산기(게스트·DEX 탭) | 진입 | 카드 | `Trade, Earn Back. Repeat.` · `CASHBACK ESTIMATE` | REQ-291 · REQ-292 | ✅ [H1][H1] | ✅ [모바일 H1][mH1] |
| 2 | 허브 | CEX·Brokers 탭 계산 검증값 | 탭 전환 | 카드 | Bybit `$55.00 / −$24.75 / $30.25 / $24.75` | REQ-293 | ✅ [H1-CEX][H1C] · [H1-Broker][H1B] | ✅ [모바일 H1-CEX][mH1C] · [모바일 H1-Broker][mH1B] |
| 3 | 허브 | 탭별 슬라이더 범위 | 탭 전환 | 슬라이더 | DEX `$1K`~`$250K` · CEX `$10K`~`$500K`(운영 설정) | REQ-294 · REQ-317 | ✅ [H1][H1] · [H1-CEX][H1C] | 🔀 [모바일 H1-CEX][mH1C] CEX 탭인데 `$1K`~`$250K` |
| 4 | 허브 | 로그인 줄 | 로그인 | 줄 | `Paid to your TetherMax balance    Minimum 10 USDT` | REQ-292 | ⚠ [H2][H2] `Minimum 10 USDT` 없음 | ⚠ [모바일 H2][mH2] 같음 |
| 5 | 허브 | 요율 서비스 실패 | API-001·002 실패 | 카드 | `Estimate unavailable` + `Try again` | REQ-296 · G-144 | ❌ | ❌ |
| 6 | 허브 | 요율 있는 파트너 0인 라우트 · 수수료 없는 등급 | — | — | — | ❓ G-143 · ❓ G-145 · ❓ G-147 | ➖ | ➖ |

### FU-046. 허브 상태 분기·DEX 잔액 패널

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 | 게스트 / 로그인·연동 0(이유 카드 없음) | 로그인 상태 | 페이지 | — | REQ-298 | ✅ [H1][H1] · [H2][H2] | ✅ [모바일 H1][mH1] · [모바일 H2][mH2] |
| 2 | 허브 | 연동 파트너 선택 → `YOUR CASHBACK` 패널 | 연동 있음 | 패널 | — | REQ-298 | ✅ [H3][H3] · [H5][H5] | ✅ [모바일 H3][mH3] · [모바일 H5][mH5] |
| 3 | 허브 | 연동 없는 파트너 선택 → 계산기 복귀 | 파트너 변경 | 카드 교체 | — | REQ-298 · ❓ G-149 | ❌ | ❌ |
| 4 | 허브 | DEX 패널 구성 | DEX 연동 + 원장 수신 | 패널 | `Total exchange cashback` + `Reported by {DEX}` · `Total event reward` · `Withdrawable {amount} USDT` · `Paid to your TetherMax balance` · `Minimum 10 USDT` · `Auto Claim` · `You withdraw on TetherMax, to your linked {DEX} wallet.` | REQ-300 · REQ-306 | ⚠ [H5][H5] `Event Reward`, `Withdrawable` 줄 없음(머리 `Total available cashback`), 각주 `Payout destination: linked Lighter wallet.` | ⚠ [모바일 H5][mH5] 같음 |
| 5 | 허브 | 이벤트 리워드 > 캐시백 → 일부만 출금 안내 | A=3·B=8 | 인라인 | 「일부만 출금할 수 있습니다」(en 미정) | REQ-300 | ❌ | ❌ |
| 6 | 허브 | Aster 보고 문구 | Aster 선택 | 줄 | `Reported by Aster, USDT value at payout` | REQ-300 | ❌ | ❌ |
| 7 | 허브 | 패널 로딩 | 응답 전 | 로딩 | 0 대신 로딩 | REQ-301 | ❌ | ❌ |
| 8 | 허브 | 패널 로드 실패 | API-010 503 · 파트너 오류 | 패널 | `Cashback could not load` / `We could not load your cashback. Please try again.` / `Try again` | REQ-301 | ✅ [H7][H7] | ✅ [모바일 H7][mH7] |
| 9 | 허브 | 최소액 미만 — 넛지 + 각주 | 매칭액 <10 | 줄·각주 | G-139 `You can claim if you receive an additional {n} USDT in exchange cashback.` + `You can withdraw once your available cashback reaches 10 USDT.` | REQ-301 · G-139 | ⚠ [H4][H4] `Just 3.00 USDT more to qualify.` · `Minimum per account: 10 USDT.`(CEX 예시만, DEX 미만 시안 없음) | ⚠ [모바일 H4][mH4] 같음 |
| 10 | 허브 | 데이터 지연 | `DEGRADED` | 캡션 | `Last updated {date}, {time}` + `{DEX} has not sent new data yet. Amounts show the last update.` | REQ-301 | ✅ [H6][H6] | ✅ [모바일 H6][mH6] |
| 11 | 허브 | 같은 DEX 복수 지갑(`+N`), 넛지는 10에 가장 가까운 지갑 | 지갑 ≥2 | 패널 | — | REQ-302 · 정책 6장 | ❌ | ❌ |
| 12 | 허브 | `Total claimed` 유지 | `Sent` 누계 | 줄 | `Total claimed` | REQ-307 · G-053 | ❌ | ❌ |
| 13 | 허브 | EdgeX 패널 — 금액 일관성 | EdgeX 연동 | 패널 | 머리 금액 = `Total exchange cashback` + 매칭 리워드 | REQ-300 · G-059 | 🔀 [H8][H8] 머리 `3.10 USDT` ↔ `Total exchange cashback 1.25 USDT`(리워드 줄 없음), `Reported next day` | 🔀 [모바일 H8][mH8] 같음 |

### FU-047. 라우트 선택 블록·이유 카드

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 | 라우트 블록 3행 + 주석 | 진입 | 블록 | `Pick where you trade` · `"Up to" is the highest rate …` | REQ-308 · REQ-315 | ✅ [H1][H1] | ✅ [모바일 H1][mH1] |
| 2 | 허브 | DEX·CEX 행 지급 조건 줄 | — | 줄 | `Paid … withdraw from {min} USDT` · CEX `Paid daily, withdraw from 10 USDT` | REQ-309 · REQ-315 | ⚠ [H1][H1] `Automatic payouts from 10 USDT`(`payout` 어휘 · 명세 원문은 `withdraw`라 REQ-719와도 어긋남) | ⚠ [모바일 H1][mH1] 같음 |
| 3 | 허브 | 게스트 이유 카드 3장 / 로그인 시 없음 | 로그인 상태 | 카드 | `Support in 2 minutes` · `More cashback from events` · `Invite friends, earn more` | REQ-310 · REQ-316 | ✅ [H1][H1] · [H2][H2] | ✅ [모바일 H1][mH1] · [모바일 H2][mH2] |

### FU-048. 비교표·로고 그리드

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 허브 | DEX 칩 비교표(제목 n=4 · `Search for a DEX` · 열 `DEX`) | DEX 칩 | 표 | `Compare cashback across {n} exchanges` | REQ-312 | ✅ [H1][H1] | ✅ [모바일 H1][mH1] 카드 `Compare cashback across 4 DEXs` |
| 2 | 허브 | CEX 칩 제목 n | CEX 칩 | 제목 | `Compare cashback across {n} exchanges` | REQ-312 | ✅ [H3][H3] `16 exchanges` | 🔀 [모바일 H3][mH3] `23 partners` |
| 3 | 허브 | Rating `-`(리뷰 <20), 카드 뷰 평점 생략 | `rating.count` <20 | 셀 | `4.2 (23)` / `-` | REQ-313 | ✅ [H1][H1] | ✅ [모바일 H1][mH1] |
| 4 | 허브 | 빈 검색 | 검색 결과 0 | 빈 상태 | `No exchanges match your search` + 검색어 지우기 | G-151 | ❌ | ❌ |
| 5 | 허브 | 비교표 데이터 조회 실패 | API-002 503 | 영역 | 명세에 문구 없음(0곳으로 보이지 않음) | API-001 · API-002 | ❌ · 명세 누락 후보 | ❌ |

## 10. 캐시백 요약·랭킹

### FU-060. 캐시백 요약 필터

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 요약 | 거래소 필터 All / CEX / DEX 범위 | 드롭다운 | 드롭다운 | `All Exchanges` | REQ-365 | ✅ [CS6 All][CS6a] · [CS6 CEX][CS6cex] · [CS6 DEX][CS6dex] | ✅ [모바일 CS6][mCS6] · [모바일 CS6 DEX][mCS6dex] |
| 2 | 요약 | 계정 필터 — 거래소별 계정, 지갑 전체(좁으면 축약 + 전체 보기·복사) | 계정 드롭다운 | 드롭다운 | `All Accounts` | REQ-366 | ⚠ [CS6 계정][CS6acct] 지갑 축약만 | ❌ 모바일 계정 시트 없음 |
| 3 | 요약 | 계정 필터 빈 상태(CEX·DEX) | 계정 0 | 빈 상태 | 명세에 문구 없음 | REQ-366 | ❌ · 명세 누락 후보 | ❌ |
| 4 | 요약 | 유형 필터 체크박스 3유형 | 유형 드롭다운 | 체크박스 | `Exchange Cashback` · `Event Reward` · `Claim Amount` | REQ-367 · G-418 | ✅ [CS6 유형][CS6type] | ⚠ [모바일 요약][mCS] `Trading Cashback` · `Withdrawal` |
| 5 | 요약 | 유형 트리거 문구 | 기본값 | 트리거 | `All Types` | REQ-378 | 🔀 [CS1][CS1] `All Cashback Types` ↔ [CS6 유형][CS6type] `All Types` | ⚠ [모바일 요약][mCS] `All Cashback Types` |
| 6 | 요약 | `Search`로 적용, `Reset` = 전부 All | 버튼 | 버튼 | `Reset` / `Search` | REQ-368 | ✅ [CS1][CS1] | ✅ [모바일 요약][mCS] |

### FU-061. 월간 카드·캘린더·일별 목록

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 요약 | 월간 카드 Received / 출금 / Net | 월 조회 | 카드 | `Monthly total cashback` · `Received` · `Claimed` · `Net` | REQ-369 · G-418 | ✅ [CS1][CS1] | ❌ [모바일 요약][mCS] 월간 카드 없음 |
| 2 | 요약 | 일별 목록 — 거래소 캐시백 행 | `EXCHANGE_CASHBACK` | 행 | `Exchange Cashback · Bitget UID … · +25.00 USDT` | REQ-371 | ✅ [CS1][CS1] | ⚠ [모바일 요약][mCS] 유형 `Cashback` · `150.00 USDT` |
| 3 | 요약 | 이벤트 리워드 행(DEX 포함) | `EVENT_REWARD` | 행 | `BTC Prediction Reward · Lighter {지갑} · +2.00 USDT` | REQ-371 | ✅ [CS3][CS3] | ✅ [모바일 캘린더][mCSc] |
| 4 | 요약 | 출금 행 | `WITHDRAWAL` | 행 | `Claim Amount · {partner} {식별자} · −{amount} USDT` | REQ-371 · G-418 | ⚠ [CS1][CS1] `Payout -20.00 USDT` | ❌ |
| 5 | 요약 | 쿠폰 사용 행(DEX 지갑 포함) | 쿠폰 사용 | 행 | — | REQ-371 | ❌ | ❌ |
| 6 | 요약 | DEX 행 지갑 주소 표기 | DEX 행 | 식별자 | DEX는 지갑 주소 전체 | REQ-371 | 🔀 [CS1][CS1] 축약 ↔ [CS3][CS3] 전체 | ✅ [모바일 캘린더][mCSc] 축약 |
| 7 | 요약 | 복원 행 `Withdrawal returned`(+) | `WITHDRAWAL_RETURNED` | 행 | `Withdrawal returned` | REQ-372 · G-113 · 정책 6장 | ❌ | ❌ |
| 8 | 요약 | Lighter `Credited`·`Withheld` 줄(정산 월요일) | Lighter 원장 | 행 | — | REQ-372 · 보류 G-428 | ❌ | ❌ |
| 9 | 요약 | 원장 미도착 날 — CEX만 합산, DEX 0 미표시 | `dexPendingDates` | 칸 라벨 | `DEX data pending` | REQ-373 | ✅ [CS1][CS1] | ❌ |
| 10 | 요약 | 빈 달 | 활동 0 | 카드 + 목록 | `There is no cashback history for this month.` + `No cashback activity yet.` | REQ-375 | ✅ [CS5][CS5] | ❌ |
| 11 | 요약 | 빈 날·필터 결과 없음 | 활동 0 | 목록 | `No cashback activity yet.` | REQ-375 | ✅ [CS4][CS4] | ❌ |
| 12 | 요약 | 180일 이전 달 | `range.dexFrom` 이전 | — | 명세에 안내 없음 | REQ-374 | ❌ · 명세 누락 후보 | ❌ |
| 13 | 요약 | 로딩 | 응답 전 | 스켈레톤 | — | — | ❌ | ❌ |
| 14 | 요약 | 조회 실패 | API-012·013 400·5xx | 영역 | 명세에 문구 없음 | API-012 · API-013 | ❌ · 명세 누락 후보 | ❌ |

### FU-062. 요약 데이터 지연·행 상태

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 요약 | 데이터 지연(허브 H6과 같음) | `collection[].status: DEGRADED` | 캡션 | `Last updated {time}` · `{DEX} has not sent new data yet. Amounts show the last update.` | REQ-376 | ❌ | ❌ |
| 2 | 요약 | DEX 행 상태 `DEX data pending` | 원장 미수신 날 | 라벨 | `DEX data pending` | REQ-377 | ✅ [CS1][CS1] | ❌ |

### FU-063. 캐시백 랭킹

| # | 화면 | 상태 | 트리거 | 표시 | 원문 문구 | 근거 | PC | 모바일 |
|---|---|---|---|---|---|---|---|---|
| 1 | 랭킹 | 한 순위표 CEX+DEX, 순위 밖 `–`, 행 금액 없음 | API-014 | 사이드 패널 | `My Cashback Ranking` | REQ-379 · REQ-383 | ✅ [RK1][RK1] | ✅ [모바일 랭킹][mRK] |
| 2 | 랭킹 | 순위 `1st`·`2nd`·`3rd`(지갑 포함) | 순위 있음 | 행 | — | REQ-383 | ✅ [RK2][RK2] | ✅ [모바일 랭킹][mRK] |
| 3 | 랭킹 | 부제(로컬) | — | 캡션 | `Rankings are updated daily at 00:01` | REQ-383 · REQ-043 | ✅ [RK1][RK1] | ✅ [모바일 랭킹][mRK] |
| 4 | 랭킹 | 빈 상태 | 자격 계정 0 | 빈 상태 | `There are currently no eligible accounts for ranking.` | REQ-383 | ✅ [RK3][RK3] | ✅ [모바일 빈 상태][mRK3] |
| 5 | 랭킹 | 0.01 미만 안내 | `notRankedNotice: true` | 인라인 | `캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다.` | REQ-381 | ❌ | ❌ |
| 6 | 랭킹 | 랭킹 리워드만으로 출금 불가 안내 | 리워드 표시 | 인라인 | 「랭킹 리워드만으로는 출금 불가」(en·위치 미정) | REQ-382 | ❌ | ❌ |
| 7 | 랭킹 | 지갑 주소 전체 보기 | 축약 주소 탭 | 팝오버 | `Wallet address` + 전체 + `Close` | REQ-010 | ✅ [랭킹 팝오버][RKpop] | ❌ |
| 8 | 랭킹 | 로딩·조회 실패 | API-014 400·5xx | 영역 | 명세에 문구 없음 | API-014 | ❌ | ❌ |
| 9 | 홈 랭킹 카드 | 홈 `Linked Accounts` 카드에 DEX 유지 | — | 카드 | — | REQ-386 | ✅ [RK1][RK1] | ❌ |

## Figma에만 있는 상태 (명세 누락 후보)

| # | Figma | 내용 | 명세에서 정할 것 |
|---|---|---|---|
| 1 | [H8][H8] · [모바일 H8][mH8] | EdgeX 패널 「정산 기록과 회원 잔액을 분리 표시」(`Paid records, reported by EdgeX` · `Reported next day`) | 이 표시를 둘지. 둔다면 G-059(어드민 상태어 비노출)와 맞는 문구 |
| 2 | [랭킹 팝오버][RKpop] | 축약 주소 → `Wallet address` 팝오버 + `Close` | 홈 행·요약 계정 필터·일별 목록에도 같은 패턴을 쓸지(REQ-010의 「누르면 전체」 구현 형태) |
| 3 | [지갑 상세][WD] | 진행 막대 아래 별도 줄 `Additional exchange cashback needed: {n} USDT` | REQ-130 문구와 하나로 맞출지 |
| 4 | [H4][H4] | 각주 `Minimum per account: 10 USDT.` | G-139 각주와 하나로 |
| 5 | [서비스 소개 피드][SIfeed] | 피드 부제 `Eligible account balances are paid automatically from 10 USDT.` | 「섹션 제목·부제 그대로」(REQ-285)와 다른 신규 문구 채택 여부 |
| 6 | [랜딩][LL] | 3단계 `Get automatic payouts in USDT` / `Each linked account is paid automatically once its claimable balance reaches 10 USDT.` | 문구표 등록(`payout` 어휘 포함) |
| 7 | [피드][SIfeed] | 상태값 `Completed` | API `SENT`의 사용자 표시 문구 |
| 8 | [CS1][CS1] | 월간 카드 `Claimed` | REQ-369 원문 `Withdrawn`을 G-418 `Claim` 계열로 고칠지 |
| 9 | [CS6 DEX][CS6dex] | 드롭다운 행 `All CEX exchanges` / `All DEX exchanges` | REQ-030 `CEX 전체`/`DEX 전체`의 영문 확정 |
| 10 | [접수 메일][E-acc] | 자동 지급 접수 메일 | FU-035는 「현행 정책」만 적음 — 접수 메일 발송을 명세에 적을지 |
| 11 | — | 복사 완료 토스트 | 문구·노출 시간 |
| 12 | — | 피드 빈 상태 · 피드·비교표·요약·랭킹 조회 실패 | 사용자 문구와 재시도 동작 |
| 13 | — | 지급 네트워크 미설정 시 지갑 목적지 비활성 표시 | 문구 |
| 14 | — | 지갑 상세 404 · 요약 180일 이전 달 · 계정 필터 빈 상태 | 화면 처리와 문구 |
| 15 | — | 공통 429·500 | 담당 화면의 사용자 표시 |

## 디자이너 요청 목록

우선순위: 1 = 개발 막힘·정책 위반 · 2 = 개발자가 추측해야 함 · 3 = 다듬기.

| 우선 | 화면 | 요청 | 현재 | 근거 |
|---|---|---|---|---|
| 1 | 출금 화면 `/withdrawal-apply` · `/withdrawal` (PC·모바일) | 출금 화면을 잔액·계정 카드·상태 표시용으로 되살리고 상태를 그린다: 목록(가능 위·불가 아래) · DEX 카드 · 같은 주소 DEX별 카드 · `Cashback updates` · 적립 전 줄 · 상단 합계 · 전부 불가(G-108 문구) · 0원 배너(G-110) · 로딩 · 지연 · 파트너 오류(그 카드만) · 잔액 오류 · 10개 + `더보기` · `Network`/`Network fee` · 네트워크 미설정 · 오프보딩 `Inactive` · 하단 비활성 `Auto Claim` · `/withdrawal` DEX 행과 매칭 기준 안내 | [제외 메모][MEMO-WD] · [인계 색인][HO-036]이 화면을 뺌. 기존 [CEX 출금][X-WD]은 구판 | 정책 6-1 · 6-4 · REQ-134~150 · REQ-710 |
| 1 | 허브 Lighter 패널 ([H5][H5] · [DW0][DW0] · [모바일 H5][mH5] · 다크 사본) | 주중 추정치 줄과 설명 문장을 빼고 금액 없이 「집계 전」 | `Accruing this week (estimate)` · `3.20 USDT` | G-100 · G-059 · REQ-303 |
| 1 | 허브 EdgeX 패널 ([H8][H8] · [모바일 H8][mH8]) | 머리 금액과 내역을 같은 정의로 맞추고 `Paid records` 표기를 뺀다 | 머리 `3.10` ↔ 내역 `1.25`, 어드민 상태어 | REQ-300 · G-059 |
| 1 | 홈·허브·지갑 상세 | 자동 지급 신청 후 선차감된 잔액 + 줄어든 이유 문구 상태 | 없음 | 정책 6장 · REQ-158 · G-112 |
| 1 | 홈·허브·지갑 상세 · 캐시백 요약 | 최종 실패 복원 상태: 잔액 복원 표시 + 요약 `Withdrawal returned`(+) 행 | 없음 | 정책 6장 · REQ-164 · REQ-372 · G-113 |
| 1 | 허브 DEX 패널 · 출금 화면 | 같은 DEX 복수 지갑: 허브 `+N` 패턴과 넛지(10에 가장 가까운 지갑), 출금 화면 카드 2장 | 없음 | 정책 6장 · REQ-033 · REQ-302 |
| 2 | 홈 총액 카드 | 로딩 스켈레톤 · 로드 실패(`We can't load your balance right now.` + `Try again`) · 원장 지연(`Last updated`) | 정상만([HW1][HW1]) | REQ-269 |
| 2 | 홈 Linked Accounts | 상태 점 텍스트 병기, Aster 행 `Chip` 자리표시를 `No cashback yet` 계열로, `Data delayed`(지연 문구 포함) · `Inactive` · 확인 중 행(`-`) · 7단계 상태 행 · 로딩 행 · 11개 이상 `더보기` | [HW1][HW1] · [S4-6][S4-6] 점만, `Chip` | REQ-034 · REQ-039 · REQ-271~274 |
| 2 | 모바일 홈·지갑 상세 | DEX 행(`Wallet` 라벨 없이 주소) · 푸터 `Trading on multiple exchanges? Link more` · 빈 홈 카드 · 모바일 지갑 상세 | 모바일 시안 없음(기존 CEX만) | REQ-013 · REQ-267 · REQ-271 · REQ-276~281 |
| 2 | 지갑 상세 ([PW1][PW1]) | 칩 `연동 완료`(CEX와 같은 라벨) · 리뷰 버튼 `Write a review, get 2 USDT` · `Total Claimed` · 지연·로딩·조회 실패 · 리뷰 작성 후 | 칩 `Active` · 버튼 `Label` · 나머지는 메모 텍스트만 | REQ-008 · REQ-276~281 · G-053 |
| 2 | 지갑 상세 · 허브 H4 | 부족분 문구를 확정 원문으로 | `Additional exchange cashback needed:` · `Just 3.00 USDT more to qualify.` | REQ-130 · G-139 |
| 2 | 허브 DEX 패널 | `Total event reward` · `Withdrawable {amount} USDT` 줄 · 각주 `You withdraw on TetherMax, to your linked {DEX} wallet.` · 일부만 출금 안내 · 패널 로딩 · DEX 최소액 미만 · `Total claimed` | [H5][H5] 문구 다름, 나머지 없음 | REQ-300~302 · REQ-307 · G-053 |
| 2 | 허브 계산기 | 일/연 환산 절삭(`$0.18`·`$0.82`) · 요율 실패 `Estimate unavailable` + `Try again` | `$0.19`·`$0.83`, 실패 상태 없음 | REQ-317 · G-144 |
| 2 | 허브 비교표 | 빈 검색 `No exchanges match your search` + 검색어 지우기 | 없음 | G-151 |
| 2 | 공개 피드 | 거래소 이름 + `DEX` 배지 · 로딩 · 빈 상태 · 503 오류 + 다시 불러오기 · 모바일 | 로고만, 상태 없음 | REQ-031 · REQ-285 · API-015 |
| 2 | 전 화면 | 시각 표시 형식 하나로 | 5가지 형식 혼재 | REQ-043 |
| 2 | 캐시백 요약 | 데이터 지연 · 로딩 · 조회 실패 · 출금 행 `Claim Amount` · 쿠폰 행 | 없음 / `Payout` | REQ-371 · REQ-376 · G-418 |
| 2 | 모바일 캐시백 요약 ([모바일 요약][mCS]) | 월간 카드 · 계정 시트 · 유형값 `Exchange Cashback`/`Event Reward`/`Claim Amount` · `DEX data pending` · 빈 달·빈 날 | 월간 카드 없음, `Trading Cashback`/`Withdrawal` | REQ-367 · REQ-369 · REQ-373 · REQ-375 |
| 2 | 캐시백 랭킹 | 0.01 미만 안내 · 랭킹 리워드만으로 출금 불가 안내 | 없음 | REQ-381 · REQ-382 |
| 2 | 홈 FAQ | 회원·비회원 답변 문구(REQ-711 기준) — 인계 색인의 「비회원 답변 삭제」와 정리 | [기존 FAQ][X-FAQ] 구판 · [인계 색인][HO-044] | REQ-711 |
| 2 | 타임라인·누적 캐시백 | 지급 상세 4행(`Weekly W+1` 등, 지급처 `Account`) · compact 단계 · 순차 지급 경고 · 누적 캐시백 블록(`{n}개 거래 계정 합산`) | [기존 타임라인][X-TL] CEX 구판만 | REQ-282 · REQ-283 · REQ-289 · REQ-290 |
| 2 | 카드·패널·지갑 상세 | `DEX data pending` 라벨 · ApeX `Pending` 별도 줄(G-127 조건부) | 요약 캘린더에만 있음 | REQ-047 · G-127 |
| 2 | 사용자 화면 용어 | `Payout`·`payouts`·`Payout Time`·`Payout destination` → `Claim` 계열 또는 중립어, `rebates` → `cashback` | [CS1][CS1] · [H1][H1] · [SIfeed][SIfeed] · [H1-Broker][H1B] | REQ-001 · REQ-005 · REQ-719 · G-418 |
| 2 | 랜딩 다크 ([LDk][LDk]) | 3단계 문구를 라이트판과 같게 | `Get paid daily in USDT` | 정책 6-1 |
| 2 | 홈 연동 스토리 · 요약 | 예시 금액을 행 합과 맞춘다 | [S3-7][S3-7] · [S4-1][S4-1] `5,137.70` · [CS1][CS1] Net `+10.00` ↔ 일 합 `−4.40` | REQ-021 · REQ-268 |
| 3 | 홈 S3 · 랭킹 카드 | `0 USDT` → `0.00 USDT` | [S3-1][S3-1] · [RK1][RK1] · [모바일 랭킹][mRK] | REQ-023 · REQ-267 |
| 3 | 모바일 요약 행 | 부호·소수 둘째 자리(`+150.00` · `+50.00`), 선택일과 캘린더 월 일치 | `150.00 USDT` · `+50 USDT` · `2026/03/05` | REQ-019 · REQ-024 |
| 3 | 요약 [CS4][CS4] | 월간 카드 `Net` 값 | 비어 있음 | REQ-369 |
| 3 | 요약 | 유형 트리거 `All Types`로 통일, DEX 행 주소 표기(전체/축약) 통일, 계정 필터 축약 시 전체 보기 | [CS1][CS1] ↔ [CS3][CS3] · [CS6 유형][CS6type] | REQ-366 · REQ-371 · REQ-378 |
| 3 | 요약 필터 | `DEX 전체` 선택 후 트리거 상태 | 없음 | REQ-030 |
| 3 | 모바일 허브 | CEX 탭 슬라이더 범위, CEX 비교표 제목 n(`23 partners` ↔ 웹 `16 exchanges`) | [모바일 H1-CEX][mH1C] · [모바일 H3][mH3] | REQ-312 · REQ-317 |
| 3 | 허브 H2 | 로그인 줄 `Minimum 10 USDT` | 없음 | REQ-292 |
| 3 | 허브 | Aster `Reported by Aster, USDT value at payout` · 연동 없는 파트너 선택 시 계산기 복귀(G-149 결정 후) | 없음 | REQ-298 · REQ-300 |
| 3 | 카드·요약 (Lighter 온보딩 후) | Lighter `Credited` · `Withheld` 표시와 요약 줄 | 없음 | REQ-047 · REQ-372 · G-428 |
| 3 | 프리로그인 랜딩 | `Featured Exchanges`·`Hero Exchange`에 DEX가 선택된 상태 | 없음 | REQ-288 |
| 3 | 공개 피드 | 랜딩·서비스 소개 섹션 제목·부제 통일, 열 이름 `Partner` → 거래소 | 두 화면 문구 다름 | REQ-285 |
| 3 | 자동 지급 메일 EN | 제목·본문 `payout`·`Withdrawal` 표현을 `Claim` 계열로(문구표) | [접수][E-acc] · [완료][E-ok] · [실패][E-fail] | REQ-719 · G-418 |
| 3 | 랭킹 · 지갑 상세 | 랭킹 로딩·조회 실패, 모바일 지갑 주소 팝오버, 웹 복사 완료 토스트 | 없음 | REQ-010 · REQ-013 · API-014 |

## 확인하지 못한 것

- 모바일 허브 다크 사본(28960:130866), 모바일 DEX 개요 다크는 라이트와 같은 문구라고 보고 개별 텍스트를 읽지 않았다.
- 푸시(FCM)는 Figma 대상이 아니어서 `FCM.xlsx`와 대조하지 않았다.
- 거래소/DEX 상세·DEX 카드의 `Auto Claim`(REQ-133 위치 중 2곳)은 담당 범위(FU-054)라 보지 않았다.
- 기존 홈의 CEX 상태 칩 7단계·누적 캐시백 블록이 기존 페이지 어디에 있는지 노드를 찾지 못했다(색인 이름에 없음).
- 홈 CEX UID 표기가 화면마다 다르다(홈 `UID 685432171` · 웹 요약 `******7462` · 모바일 요약 `UID 1222787462`). 기존 운영 화면의 마스킹 규칙을 확인하지 못해 판정하지 않았다.
- 혜택 월간 랭킹(`Monthly Top Trader Rewards`, REQ-384)은 DEX(revision)에 없어 확인하지 않았다.
- 스켈레톤·포커스·스크린리더·실제 API 연동은 실행 검증 대상이다.

[DW0]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125773
[PW1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125943
[HW1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126108
[WD]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29026-97581
[MEMO-WD]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28987-126383
[MEMO-AC]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123621
[MEMO-HUB]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123629
[MEMO-HOME]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123653
[HO-036]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-888
[HO-044]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-912
[H1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126884
[H2]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126890
[H3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126896
[H4]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126902
[H5]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126908
[H6]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126914
[H7]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126920
[H8]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126926
[H1C]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126944
[H1B]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126950
[mH1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130794
[mH2]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130800
[mH3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130806
[mH4]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130812
[mH5]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130818
[mH6]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130824
[mH7]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130830
[mH8]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130836
[mH1C]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130854
[mH1B]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130860
[CS1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127133
[CS3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127145
[CS4]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127151
[CS5]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127157
[CS6a]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29190-127304
[CS6cex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29190-127401
[CS6dex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29190-127498
[CS6acct]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29265-120180
[CS6type]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29265-120387
[mCS6]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29191-120035
[mCS6dex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29191-120131
[mCS]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-6366
[mCSc]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-6687
[RK1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-121828
[RK2]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-123588
[RK3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-124091
[RKcex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-122197
[RKdex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-122566
[RKpop]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28984-126304
[mRK]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-6980
[mRKcex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-123337
[mRKdex]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-123432
[mRK3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-124549
[S3-1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127759
[S3-7]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127795
[S3-F5]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127823
[S4-1]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127837
[S4-6]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127867
[LDk]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127917
[LL]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-128375
[SI]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-129521
[SIfeed]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-129606
[E-acc]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29061-1381
[E-accKO]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-7848
[E-accM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-2655
[E-accKOM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-7989
[E-ok]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29061-1451
[E-okKO]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29061-1522
[E-okM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-2718
[E-okKOM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-2781
[E-fail]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29061-1593
[E-failKO]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-7918
[E-failM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-2844
[E-failKOM]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-8052
[X-WD]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=8970-173588
[X-NE]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=10500-94074
[X-FAQ]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=17000-86187
[X-mFAQ]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=17000-64552
[X-TL]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=26047-1349155
[X-mTL]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=26047-1348691
[X-copy]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=8582-167558
[X-mS3]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=4248-33574
[X-mS4]: https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=4060-25384
