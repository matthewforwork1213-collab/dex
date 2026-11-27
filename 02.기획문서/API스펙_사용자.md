# API 스펙 — 사용자 화면

프로젝트명: TetherMax DEX 캐시백 연동 (Lighter · ApeX · EdgeX · Aster)
작성일: 2026-11-24
버전: v1.0
읽는 사람: 사용자 웹·모바일 웹·앱이 호출하는 API를 구현·연동하는 백엔드·프론트엔드
입력: `02.기획문서/요구사항정의서.md` v1.1 · 기능명세서 4종(`프론트_기능명세서_사용자.md` · `백엔드_기능명세서_사용자.md` · `프론트_기능명세서_백오피스.md` · `백엔드_기능명세서_백오피스.md`) · 정책 `00_DEX_최종정책.md`(기준일 2026-11-16, 특히 6장 · 부록 D-2 · E · E-11) · 기존 맥스보드 API 스펙(`_맥스보드_원본/분할문서/사용자·백오피스/API스펙_ko.md` 1·2장 규약)
짝 문서: `API스펙_백오피스.md`(어드민 · 웹훅 · 자동 지급 · 내부 작업) · `프론트_기능명세서_사용자.md` · `백엔드_기능명세서_사용자.md` · `정보구조도_사용자.md`

---

## 0. 읽는 법

**이 문서의 위치** — 기능명세서의 「관련 API」를 엔드포인트 단위로 풀어 Method · URL · Request · Response · 에러 코드를 적었습니다. 이 문서는 **사용자 웹·모바일 웹·앱이 호출하는 API(사용자 API · 기존 맥스보드 사용자 API의 DEX 변경)**을 다룹니다. 우선순위는 **정책 > 요구사항정의서 > 기능명세서 > 이 문서**입니다.

**관련 기능 ID** — 기능명세서 4종의 「관련 API」에서 역으로 만든 값입니다: `FU` 프론트·사용자 · `BU` 백엔드·사용자 · `FA` 프론트·백오피스 · `BA` 백엔드·백오피스(공통 처리 포함).

**출금** — 출금은 10분 주기 자동 지급이라 회원이 호출하는 출금 API가 없습니다. 자동 지급(JOB-D15)과 그것이 호출하는 기존 출금 신청 API(API-011) · 초대 리워드 출금 API(API-018)는 `API스펙_백오피스.md`에 있습니다.

**구분 표기**

| 표기 | 뜻 |
|---|---|
| `기존` | 테더맥스에 이미 있는 API를 그대로 씀 |
| `기존·변경` | 이미 있는 API에 DEX 필드·분기를 더함. **기존 필드는 지우거나 의미를 바꾸지 않고 추가만 한다**(CEX 회귀 방지, REQ-497) |
| `기존·변경 ⚠경로` | 기능은 이미 있으나 이 문서 작성 시점에 실제 경로를 확인하지 못한 API. 표의 경로는 제안이며, **실제 경로로 바꾸고 요청·응답 계약(필드·에러 코드)은 이 문서대로** 적용한다 |
| `신규` | 새로 만드는 API. 경로는 이 문서가 정한 설계안이다 |

**기존 엔드포인트의 형식** — `기존·변경` API는 **기존 경로·Method·응답 봉투(envelope)를 유지**하고, 이 문서의 Request·Response는 **추가·변경되는 필드의 계약**을 보여 줍니다. 기존 경로는 LLM_wiki의 앱 바이너리 맵·Postman 맵(2026-07-23 기준)에서 확인한 것이며, 그 뒤 바뀌었을 수 있으므로 백엔드가 현재 코드로 대조합니다. 경로 문자열을 찾지 못한 기존 API는 `⚠경로`로 남기고 상세에 도메인을 적었습니다.

**미정 값** — 업무 값이 정해지지 않은 필드는 지어내지 않고 `❓ G-nnn`(정책 부록 G의 미정 ID)으로 표시했습니다. 필드 자리는 만들어 두고 값은 결정 후 설정으로 채웁니다. JSON 예시의 금액·개수·주소·ID·날짜는 형식을 보여 주는 예시값이며 실제 값이 아닙니다. 정책에 정해진 값은 본문 설명에 따로 적었습니다.

## API 공통 사항

| 항목 | 내용 |
|---|---|
| Base URL | 사용자 `/api` · 기존 거래소 목록 `/ttmax` · 기존 맥스보드 `/api/maxboard` · 기존 도메인 경로(`/payback/*` · `/uid/*` · `/coupon/*` · `/rank/*` · `/partner/*` · `/guest/*` 공개 콘텐츠)는 각 API 상세의 경로 그대로 |
| 인증 방식 | 테더맥스 기존 로그인 세션 재사용, 서버가 인증 정보에서 **TUID**를 얻는다(요청 본문의 회원 ID를 믿지 않음). 공개 API(거래소 목록·허브·DEX 랜딩·상세·출금 피드·이벤트 목록·랭킹·비회원 캐시백 조회 API-023)는 선택 인증 — 비로그인도 공개 화면은 열람한다. 그 밖의 API는 로그인 필수(401)이며, 비회원은 공개 조회만 가능하다. 회원 잔액 조회와 거래 계정 연동에는 로그인이 필요하다(REQ-175·176·178) |
| 응답 형식 | JSON (`Content-Type: application/json; charset=utf-8`). 파일 다운로드만 `text/csv`. 성공 `{ "status": "success", "data": …, "meta": { "requestId": "…" } }` · 실패 `{ "status": "error", "error": { "code", "message", "details" }, "meta": { … } }` · 목록은 `meta.pagination { page, size, totalCount, totalPages }`(`page` 1부터, `size` 기본 20 · 최대 100) |
| 사용자 문구 | `error.message`는 개발·로그용이다. 사용자 노출 문구는 프론트가 `error.code` 기준 i18n 리소스로 표시한다. 입력 검증 실패는 `details.fields[]`에 `{ field, code }` |
| 시간 | 모든 일시는 **UTC ISO-8601**(`2026-11-11T03:20:00Z`), 날짜만 필요한 값은 `YYYY-MM-DD`(UTC). 사용자 화면의 로컬 변환은 프론트가 하며 타임존 라벨을 붙이지 않는다(REQ-026) |
| 금액 | 사용자 노출 금액 = **USDT, 소수 둘째 자리 절삭된 10진 문자열**(`"12.50"`). 부동소수점 숫자 타입 금지 |
| 식별자 | 회원 전용 응답의 지갑 주소는 입력·저장된 대소문자를 보존한다. 공개 출금 피드는 끝 4자리만 남긴 표시값을 제공한다(REQ-285). **지갑 주소·UID·DEX 계정 ID를 URL 경로·쿼리스트링에 넣지 않는다**(REQ-018) — 계정은 내부 `accountId`로 가리키고, 지갑·UID로 찾는 어드민 조회는 `POST …/search` 본문으로 보낸다. 사용자 API는 DEX 계정 ID를 응답에 넣지 않는다(REQ-017) |
| 멱등 | 제출 API(API-007 연동 · API-017 쿠폰 · API-020 퀴즈)는 헤더 `Idempotency-Key`(UUID) 필수. 같은 키 + 같은 본문 재요청은 첫 응답을 그대로 반환, 같은 키 + 다른 본문은 `409 IDEMPOTENCY_KEY_REUSED`. 키 보관 기간은 설정값 |
| 서버 검증 | 서버는 클라이언트 검증을 전부 반복하고 같은 사유 코드를 반환하며, 실패 시 아무것도 저장하지 않는다. UI에서 막힌 행위는 API로도 우회할 수 없다(REQ-264) |
| 국가 노출 | 로그인 회원 요청은 IP 국가 코드(Cloudflare)와 `거래소별 국가 노출 관리`·DEX `제한 지역`으로 **서버가 응답에서 제외**한다(REQ-045) |
| 캐싱 | 공개 API(API-001~004·015)는 응답 캐시 대상. 개인화 응답은 `Cache-Control: private, no-store`. 거래소 레코드·콘텐츠·Spending Estimate 저장 시 관련 캐시를 **즉시 무효화**(시간 만료 아님, REQ-260) |
| 언어 | 언어별 콘텐츠가 있는 API(API-002~005)는 `lang` 쿼리, 없으면 `Accept-Language`. 필수 언어에 콘텐츠가 없으면 영어 폴백 |
| 출금 | 회원이 출금을 신청하는 API는 없다. 출금은 10분 주기 자동 지급이 서버에서 처리하며(`API스펙_백오피스.md` JOB-D15 · API-011 · API-018), 사용자 API는 잔액·상태를 읽기만 한다 |

## 공통 에러 코드

| HTTP 상태 코드 | 에러 코드 | 설명 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 형식 오류·필수값 누락. 세부는 `details.fields[].code` |
| 400 | `CONFIRMATION_REQUIRED` | 확인 팝업이 필요한 작업에서 `confirmed: true` 누락(MB-API-004) |
| 401 | `UNAUTHORIZED` | 로그인 필요(회원 잔액 조회·연동·회원 전용 제출). 공개 조회 API-023은 비로그인 허용 |
| 404 | `NOT_FOUND` | 리소스 없음, 또는 요청자에게 보이지 않는 리소스(남의 계정·비게시 거래소) |
| 409 | `CONCURRENT_REQUEST` | 같은 대상의 처리 중 요청과 충돌. 재조회 후 다시 시도 |
| 409 | `IDEMPOTENCY_KEY_REUSED` | 같은 `Idempotency-Key`에 다른 본문 |
| 429 | `RATE_LIMITED` | 호출 제한 초과. `Retry-After` 헤더 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |
| 503 | `SERVICE_UNAVAILABLE` | 의존 시스템(잔액·원장·파트너 API) 일시 장애 |

### 도메인 에러 코드 — 연동

주소 검증 코드는 REQ-065 순서대로 판정하고 처음 걸린 하나만 반환한다. 기존 CEX 결과 코드는 이름을 그대로 쓴다(REQ-122).

| HTTP | 에러 코드 | 조건 | 사용자 문구(원문) |
|---|---|---|---|
| 422 | `ADDRESS_EMPTY` | trim 후 빈 값 | `Enter your wallet address.` |
| 422 | `ADDRESS_WRONG_FORMAT_FOR_DEX` | 해당 DEX가 지원하지 않는 형식으로 확인됨 | `This address is not supported for the selected exchange.` |
| 422 | `ADDRESS_INVALID` | 내부 공백 또는 선택한 거래소의 최종 주소 검증 실패 | 내부 공백 `Remove spaces within the wallet address.` / 거래소 거절 `We couldn’t verify this wallet address. Copy it again from the exchange.` |
| 422 | `ADDRESS_INVALID_CHECKSUM` | 기존 파트너별 응답 호환용. 공통 입력 검증에는 사용하지 않는다 | `We couldn’t verify this wallet address. Copy it again from the exchange.` |
| 422 | `ADDRESS_NAME_NOT_ALLOWED` | 지갑 주소 대신 이름을 입력 | `Paste the wallet address, not an account name.` |
| 422 | `ADDRESS_ZERO` | 제로 주소 | `This address can't be linked.` |
| 400 | `CAPTCHA_REQUIRED` | 캡차 토큰 없음 | — (캡차 없이 제출 불가) |
| 422 | `CAPTCHA_FAILED` | 캡차 토큰 검증 실패·만료·재사용 | 캡차 재시도 |
| 422 | `EXCHANGE_NOT_LINKABLE` | 비노출·연동불가·비활성·지역 제한·그 언어의 지갑 주소 찾기 가이드 없음 | 연동 진입 숨김(화면에서 도달하지 않음) |
| 422 | `INTEGRATION_MAX_COUNT_OVER` | 연동 한도 초과(기존 코드) | 한도 초과 화면 `L15` |
| — | `PRELINK_PAYOUT_FAILED` | 연동 전 잔액 출금이 실패해 연동 실패(비동기 — 연동 상태·알림으로 전달, REQ-107). `FAILED_NEED_RECEIVE`로 연동을 막지 않음 | 문구 G-426 확정: 문구표에서 확정 · 피드에는 미노출 · 요약에는 `연동 전 출금` 행 표시 |
| 422 | `FAILED_NOT_FOUND_UID` | 레퍼럴 아님(기존 코드) | `Only accounts registered with the TetherMax referral code can be linked.` |
| 409 | `FAILED_ALREADY_INTEGRATION` | 같은 DEX에 다른 회원이 연동(확인 중 포함, 기존 코드) | `Account Already in Use`(`Verify Ownership` 포함) |
| 409 | `FAILED_RECENT_POSSESSION` | 그 지갑의 마지막 소유권 승인 후 30일 이내(기존 코드) | `Verification Limit Reached`(연동 결과) |
| 409 | `FAILED_MY_INTEGRATION` | 본인이 이미 같은 DEX에 추가(기존 코드) | `You've Already Added This Account` |
| 422 | `LINK_REJECTED` | 위로 설명되지 않는 DEX 거절·오류 | `Unable to Link Account` |

### 도메인 에러 코드 — 혜택

| HTTP | 에러 코드 | 조건 |
|---|---|---|
| 422 | `COUPON_ACCOUNT_NOT_ELIGIBLE` | 쿠폰 적용 계정이 `연동 완료`가 아니거나 이슈 계정. 챌린지 계열 쿠폰과 `LINK UID` 첫 연동 쿠폰은 DEX 지갑에도 적용 가능(REQ-397) |
| 403 | `REVIEW_NOT_ELIGIBLE` | 해당 거래소 `연동 완료` 계정 없음 |

## 공통 Enum

| Enum | 값 | 의미 |
|---|---|---|
| `ExchangeType` | `CEX` / `DEX` | 거래소 레코드 유형. 생성 기본값 `NONE`은 저장 불가 |
| `AccountKind` | `UID` / `WALLET` | 거래 계정 식별자 종류 |
| `LinkStatus` | 기존 UID 상태 값 그대로 + DEX는 `LINKED`(`연동 완료`) · `MANUAL_LINK_PENDING`(기존 `manual_link_pending`, `연동 시도중이에요`) · `INACTIVE`(DEX 오프보딩) | DEX용 신규 상태 없음(REQ-098). 실제 키 문자열은 기존 상태 키를 따른다 |
| `LinkResult` | `LINKED` / `PROCESSING` | API-007 성공 응답의 결과(실패는 에러 코드) |
| `ProcessingReason` | `PARTNER_LOOKUP` / `PRELINK_PAYOUT` | `PROCESSING`의 이유 — 파트너 귀속 확인 대기 / 연동 전 잔액 출금 대기(REQ-107) |
| `SettlementStatus` | `CREDITED` · `WITHHELD` · `PENDING` · `DATA_PENDING` | DEX 정산 상태 라벨(REQ-047). 전체 enum·전이 G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용 |
| `PayoutStatus` | `SENT` | 출금 피드(API-015)에 나오는 값. 피드는 성공 확정 건만 준다 |
| `SummaryRowType` | `EXCHANGE_CASHBACK` · `EVENT_REWARD` · `WITHDRAWAL` · `WITHDRAWAL_RETURNED` | 캐시백 요약 행 유형 |
| `ExchangeScope` | `ALL` / `CEX` / `DEX` / 거래소 코드 | 그룹 드롭다운 범위 선택 값(REQ-030) |
| `exchangeCode` | 기존 CEX 예 `BITGET`·`OKX` / DEX 값 G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙) | 거래소 코드. DEX 4곳 값이 정해지기 전에는 `exchangeNo`로 식별 |

## API 엔드포인트 목록

엔드포인트 26개.

| API-ID | Method | URL | 기능명 | 관련 기능 ID | 구분 | 상태 |
|---|---|---|---|---|---|---|
| API-001 | GET | `/ttmax/exchange/get-exchange-list` | 거래소 목록 (CEX·DEX 레코드) | FU-008 · FU-010 · FU-012 · FU-013 · FU-025 · FU-029 · FU-041 · FU-043 · FU-045 · FU-047 · FU-048 · FU-081 · FU-082 · FU-084 · BU-008 · BU-010 · BU-012 · BU-013 · BU-025 · BU-036 · BU-038 · BU-039 · BU-041 · BU-042 · BU-072 · BU-073 | 기존·변경 | G-096 확정: `total_savings_rate` = 그 DEX의 테더맥스 캐시백율(G-003 값) · `brand_color_hex` = 운영자 입력 · `is_featured` = 운영자 설정(기본 false) · G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙) |
| API-002 | GET | `/api/cashback-hub` | 캐시백 허브 구성 (라우트·계산기 설정·비교표) | FU-045 · FU-046 · FU-047 · FU-048 · BU-039 · BU-040 · BU-041 · BU-042 | 신규 | G-142 확정: 요율 없는 기본 파트너면 첫 설정 파트너로 + 백오피스 경고. CEX 기본은 Bybit(REQ-295 지정 예정값) |
| API-003 | GET | `/api/dex-landing` | DEX 랜딩 콘텐츠·신뢰 지표 | FU-010 · FU-049 · FU-050 · FU-051 · FU-052 · FU-053 · BU-010 · BU-043 · BU-044 · BU-045 · BU-046 | 신규 | G-349 확정: `api.llama.fi/summary/derivatives/{slug}` · 캐시 24시간 · 24시간 뒤 숨김 |
| API-004 | GET | `/api/exchanges/{slug}/detail` | 거래소 상세(Venue) 콘텐츠 | FU-010 · FU-054 · FU-055 · FU-056 · FU-057 · FU-058 · FU-059 · FU-084 · BU-010 · BU-047 · BU-048 · BU-049 · BU-050 · BU-051 · BU-052 | 신규 | G-270 확정: PRD 구조 — Guide Title 100 · 단계 1~5 · Step Title 80 · Description 500 · 데스크톱 2:1 + 모바일 1:1 .mp4 필수 · G-272 · G-439 확정: 섹션 단위 — Section Name 40자 + 질문·답변 쌍(섹션 합계 2,000자) |
| API-005 | 기존 | `/exchange/get-exchange-guide-info` | 연동 가이드 (DEX = 지갑 주소 찾기) | FU-016 · FU-027 · BU-016 | 기존·변경 | 확정 |
| API-006 | GET | `/api/link/precheck` | 연동 사전 확인 (한도·연동 가능) | FU-013 · FU-014 · BU-013 · BU-014 | 기존·변경 ⚠경로 | 확정 |
| API-007 | POST | `/api/accounts/dex-wallets` | DEX 지갑 연동 신청 | FU-003 · FU-009 · FU-012 · FU-014 · FU-015 · FU-017 · FU-018 · FU-019 · FU-020 · FU-021 · FU-022 · FU-023 · FU-024 · FU-025 · FU-027 · BU-003 · BU-009 · BU-012 · BU-014 · BU-015 · BU-017 · BU-018 · BU-019 · BU-020 · BU-021 · BU-022 · BU-023 · BU-024 · BU-025 · BU-027 | 신규 | ❓ G-098 · G-350 확정 |
| API-008 | 기존 | `/uid/get-my-uid-list` | 내 거래 계정 목록 (CEX UID + DEX 지갑) | FU-002 · FU-003 · FU-007 · FU-023 · FU-025 · FU-037 · FU-039 · FU-054 · FU-070 · BU-002 · BU-003 · BU-007 · BU-023 · BU-025 · BU-032 · BU-034 · BU-047 · BU-063 | 기존·변경 | 확정 |
| API-009 | GET | `/api/accounts/dex-wallets/{accountId}` | DEX 지갑 상세 | FU-002 · FU-011 · FU-040 · BU-002 · BU-011 · BU-035 | 신규 | G-053 확정: 유지 — V2에서는 테더맥스를 통해 출금한 누계라 데이터가 있음 · G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용 |
| API-010 | 기존 | `/payback/payback-availability-withdrawal` | 캐시백 잔액 (계정별 매칭·출금 가능) | FU-002 · FU-004 · FU-007 · FU-011 · FU-030 · FU-031 · FU-032 · FU-033 · FU-036 · FU-037 · FU-038 · FU-039 · FU-040 · FU-046 · BU-002 · BU-004 · BU-007 · BU-011 · BU-029 · BU-030 · BU-032 · BU-033 · BU-034 · BU-035 · BU-040 | 기존·변경 | G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용 · G-100: Lighter도 일 1회 원장이라 주중 표시 문제 없음(G-428) |
| API-012 | GET | `/api/cashback/summary` | 캐시백 요약 (월간 카드·일별 목록) | FU-004 · FU-005 · FU-006 · FU-007 · FU-011 · FU-035 · FU-041 · FU-060 · FU-061 · FU-062 · BU-004 · BU-005 · BU-006 · BU-007 · BU-011 · BU-036 · BU-053 · BU-054 · BU-055 | 기존·변경 ⚠경로 | G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용 |
| API-013 | GET | `/api/cashback/calendar` | 캘린더용 일별 합계 (회원 시간대) | FU-004 · FU-005 · FU-061 · BU-004 · BU-005 · BU-054 | 신규 | 확정 |
| API-014 | 기존 | `/rank/get-my-ranking-list` | 캐시백 랭킹 | FU-004 · FU-006 · FU-007 · FU-063 · BU-004 · BU-006 · BU-007 · BU-056 | 기존·변경 | 일부 미정 |
| API-015 | GET | `/api/feed/withdrawals` | 완료 출금 통합 피드 | FU-002 · FU-042 · BU-002 · BU-037 | 기존·변경 ⚠경로 | G-137 확정: 완료 건만(원본) — 실패 사유 미표시 |
| API-016 | GET | `/api/global-leagues/{leagueId}/selectable-accounts` | 글로벌 리그 참가·수령 계정 후보 | FU-064 · BU-057 | 기존·변경 ⚠경로 | G-187 확정: 참가 계정과 동일(기존 MAX-8 · MAX-10 구조) |
| API-017 | 기존 | `/coupon/use-coupon` (+ `/coupon/get-member-uid-coupon-availability`) | 쿠폰 적용 (DEX 지갑 포함) | FU-009 · FU-070 · BU-009 · BU-063 | 기존·변경 | 일부 미정 |
| API-019 | 기존 | `/partner/partner-info-main` | 파트너 허브 계정 목록·지표 | FU-077 · FU-080 · BU-069 · BU-071 | 기존·변경 | G-394 확정: `{n} Accounts` / `{n}개 계정` |
| API-020 | POST | `/api/quizzes/{quizId}/submit` | 퀴즈 제출 (DEX 퀴즈) | FU-009 · FU-073 · BU-009 · BU-066 | 기존·변경 ⚠경로 | G-350 확정 |
| API-021 | 기존 | `/guest/get-total-event-list` (+ `/guest/get-exchange-event-list`) | 이벤트 목록 (거래소 그룹 필터) | FU-006 · FU-072 · BU-006 · BU-065 | 기존·변경 | 확정 |
| API-022 | POST | `/api/details/{id}/comments` | 거래소 리뷰(댓글) 작성 — 작성 자격 | FU-058 · BU-051 | 기존·변경 | 확정 |
| API-023 | POST | 기존 공개 조회 경로 확인 필요 | 비회원 캐시백 조회(읽기 전용) | FU-012 · BU-012 | 기존·변경 ⚠경로 | 공개 조회와 게스트 출금 차단 분리 |
| API-025 | POST | `/possession/init-possession-request` | 소유권 신청 — DEX 지갑 (녹화 업로드·제출) | FU-026 · FU-027 · BU-026 · BU-027 | 기존·변경 | G-434 확정 · ❓ G-435 |
| API-026 | GET | `/possession/get-possession-status` | 소유권 신청 상태 조회 (DEX 지갑 포함) | FU-026 · FU-027 · FU-028 · BU-026 · BU-027 · BU-028 | 기존·변경 | 확정 |
| MB-API-002 | GET | `/api/maxboard/boards/{boardId}` | 맥스보드 상세 (DEX 보드) | FU-065 · FU-066 · FU-068 · BU-058 · BU-059 · BU-061 | 기존·변경 | G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙) |
| MB-API-003 | GET | `/api/maxboard/boards/{boardId}/eligibility` | 맥스보드 참여 자격 (지갑) | FU-067 · FU-068 · BU-060 · BU-061 | 기존·변경 | G-314 확정: ② 연동 시점(G-436 「연동 후」와 같은 기준) · G-315 확정: 이름 유지 + 값만 지갑(하위 호환) |
| MB-API-004 | POST | `/api/maxboard/boards/{boardId}/participation` | 맥스보드 참여 지갑 등록 | FU-067 · FU-068 · BU-060 · BU-061 | 기존·변경 | G-315 확정: 이름 유지 + 값만 지갑(하위 호환) · G-316 확정: `UID_*` 재사용 + 프론트가 보드 거래소 유형으로 문구 분기 |
| MB-API-005 | GET | `/api/maxboard/boards/{boardId}/me` | 맥스보드 내 현황 | FU-065 · FU-068 · BU-058 · BU-061 | 기존·변경 | G-315 확정: 이름 유지 + 값만 지갑(하위 호환) |

### 경로 확정 필요 (⚠경로) — 6개

이 목록은 기획 미정 항목이 아니라 **백엔드 연동 작업**입니다(부록 G 미정 건수와 따로 관리). 아래 API는 기능은 이미 있으나 실제 경로를 확인하지 못했습니다. 백엔드 담당이 현재 라우터 기준으로 **Method · 경로 · 인증 주체 · 기존 응답 봉투 · DEX 추가 필드 위치**를 확정해 이 표와 상세에 적어야, 프론트가 실서버와 연동하고 기존 CEX 호출의 회귀를 검증할 수 있습니다. 요청·응답 계약(필드·에러 코드)은 이 문서를 따릅니다.

| API-ID | 기능명 | 이 문서의 경로(설계안) | 확인 단서 |
|---|---|---|---|
| API-006 | 연동 사전 확인 (한도·연동 가능) | `/api/link/precheck` | — |
| API-012 | 캐시백 요약 (월간 카드·일별 목록) | `/api/cashback/summary` | 기존 `payback-analysis` 도메인(내 캐시백 리포트·내역) |
| API-015 | 완료 출금 통합 피드 | `/api/feed/withdrawals` | — |
| API-016 | 글로벌 리그 참가·수령 계정 후보 | `/api/global-leagues/{leagueId}/selectable-accounts` | 기존 `league` 도메인의 「UID simple list」 |
| API-020 | 퀴즈 제출 (DEX 퀴즈) | `/api/quizzes/{quizId}/submit` | 기존 `quiz` 도메인의 정답 확인 |
| API-023 | 비회원 캐시백 조회 | 기존 공개 UID 조회 경로 확인 필요 | `/guest` 도메인의 공개 조회 핸들러·DEX 지원 여부 확인 |

### API-023 비회원 캐시백 조회 (개정 설계)

POST 본문에 거래소와 CEX UID 또는 DEX 지갑 주소 중 하나를 전달한다. 기존 UID 조회 경로의 DEX 지원 여부와 최종 경로는 서버 확인 대상이다. 식별자는 URL과 분석 로그에 넣지 않는다. 공개 응답에는 해당 거래 계정의 조회 허용 금액만 제공한다. 금액은 USDT 십진 문자열이며 미확인 금액을 0으로 대체하지 않는다.

아래 필드명과 상태값은 프론트·백엔드 간 설계 계약이다. 실서버 경로와 기존 응답 봉투 매핑은 위 경로 확인 표에서 추적한다.

| 요청 본문 | 형식 | 규칙 |
|---|---|---|
| `exchangeNo` | 정수 | 게시 중이며 비회원 조회를 지원하는 거래소를 선택한다 |
| `uid` / `walletAddress` | 문자열 | CEX는 `uid`, DEX는 `walletAddress` 하나만 보낸다. 선행 0과 대소문자를 보존한다. DEX 전체에 공통 `0x` 규칙을 적용하지 않는다 |

| HTTP 및 결과 | 응답 데이터와 화면 처리 |
|---|---|
| 200 · `FOUND` | `data.amount`는 확정된 USDT 십진 문자열. `0`은 적립 없음, 0 초과 10 미만은 최소 금액 안내, 정확히 10부터는 기준 충족 안내. 세 경우 모두 가입·로그인 및 같은 계정 연동으로 이어진다 |
| 200 · `NO_PUBLIC_RESULT` | 공개 결과가 없거나 회원 전용인 경우 동일한 응답과 안내. `amount`와 금액 상세를 생략한다 |
| 200 · `DATA_PENDING` | 집계 대기 안내. `amount`와 금액 상세를 생략한다 |
| 400 · `VALIDATION_ERROR` | 입력 필드에 오류 표시. 거래소와 입력값을 유지한다 |
| 429 · `RATE_LIMITED` | `Retry-After`에 따라 재조회 허용 |
| 500 · `INTERNAL_ERROR` / 503 · `SERVICE_UNAVAILABLE` | 일시 오류 안내. 같은 거래소와 입력값으로 다시 조회 |

DEX 조회 성공 예시. `breakdown`은 두 항목을 공개할 수 있을 때의 예시이며, 제공되지 않은 금액 줄은 숨긴다.

```json
{ "status": "success", "data": { "result": "FOUND", "amount": "14.00", "asset": "USDT", "breakdown": { "exchangeCashback": "7.00", "matchedEventReward": "7.00" } }, "meta": { "requestId": "req_example" } }
```

[비회원 검색과 결과 상태의 웹·모바일 시안](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29033-99901)


거래소가 공개 가능한 금액 구성을 제공하면 거래소 캐시백과 매칭된 이벤트 리워드를 결과에 표시한다. 응답에 없는 내역은 추정하지 않는다. 회원의 초대 리워드·누적 지급 이력은 조회 금액에 포함하지 않는다.

가입·로그인 후 같은 거래 계정을 연동하고 검증한다. 검색 응답은 소유권 증명이 아니며 출금 초기화·잔액 차감·자동 지급 신청을 만들지 않는다.

### 사용자 화면에서 호출하지 않는 API

| API-ID | 기능명 | 처리 | 근거 |
|---|---|---|---|
| API-011 | 출금 신청 | 회원 화면에서 부르지 않음 — 10분 주기 자동 지급(JOB-D15)이 호출. 상세는 `API스펙_백오피스.md` | REQ-133 · REQ-706 |
| API-018 | 초대 리워드 출금 | 회원 화면에서 부르지 않음 — 자동 지급, 받을 계정은 관리자 지정. 상세는 `API스펙_백오피스.md` | REQ-414 · REQ-415 |
| API-023 (출금) | 게스트 출금 준비·실행 | /guest/payback-init-withdrawal 및 /guest/payback-withdrawal 거부. 지급 요청과 기록을 만들지 않는다. | REQ-175 · REQ-176 |

## API 상세

### 사용자 API

#### API-001. 거래소 목록 (CEX·DEX 레코드)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/ttmax/exchange/get-exchange-list` |
| 설명 | 기존 거래소 목록에 DEX 레코드를 같은 필드로 포함한다. 허브·DEX 랜딩·연동 선택기·/payback·서비스 소개가 공통으로 쓴다. 고객 공개 목록만 반환(비노출·비게시 제외), 로그인 회원은 국가 노출 규칙으로 서버가 제외. 파트너 수 = 반환 목록 길이 |
| 구분 | 기존·변경 (응답 필드 추가) |
| 권한 | 공개(선택 인증) |
| 관련 기능 | FU-008 · FU-010 · FU-012 · FU-013 · FU-025 · FU-029 · FU-041 · FU-043 · FU-045 · FU-047 · FU-048 · FU-081 · FU-082 · FU-084 · BU-008 · BU-010 · BU-012 · BU-013 · BU-025 · BU-036 · BU-038 · BU-039 · BU-041 · BU-042 · BU-072 · BU-073 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| imageType | string | 선택 | 기존 값(`ICON` 등) |
| exchangeType | string | 선택 | 신규. `CEX` / `DEX`, 없으면 전체 |
| linkableOnly | boolean | 선택 | 신규. `true`면 연동 가능(노출 + 활성 + 그 언어 지갑 가이드 있음)만 — 연동 선택기용 |
| lang | string | 선택 | 지갑 가이드 유무 판정 언어 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "exchangeNo": 41,
      "exchangeCode": null,
      "name": "Lighter",
      "exchangeType": "DEX",
      "logo_url": "https://cdn.example/lighter.webp",
      "cashback_rate": "…",
      "taker_fee": "…",
      "referral_sign_up_url": "https://app.lighter.xyz/?referral=TETHERMAX",
      "update_time": "00:00",
      "settlement": { "cycle": "WEEKLY", "dayOfWeek": "MONDAY", "currency": "USDC", "feeAssetAsUsdtEquivalent": false },
      "walletAddressFormat": "EVM",
      "isVisible": true,
      "isLinkable": true,
      "isActive": true,
      "displayOrder": 7,
      "brand_color_hex": null,
      "total_savings_rate": null,
      "is_featured": false,
      "detailSlug": "lighter",
      "asAt": "2026-11-01"
    }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

- `referral_sign_up_url`은 귀속 서비스가 해석한 URL(캠페인 파라미터 포함, 사용자 식별자 없음). 경로가 없으면 `null` → 외부 버튼 미렌더(REQ-038).
- `exchangeCode` DEX 값 G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙). `brand_color_hex`·`total_savings_rate`·`is_featured`의 DEX 값 G-096 확정: `total_savings_rate` = 그 DEX의 테더맥스 캐시백율(G-003 값) · `brand_color_hex` = 운영자 입력 · `is_featured` = 운영자 설정(기본 false)(`null`이면 기본색·숨김).
- 요율 필드는 레코드 원본값(하드코딩 금지). 요율이 없는 파트너는 계산기 셀렉트에 노출하지 않는다(프론트, REQ-296).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `exchangeType`이 `CEX`/`DEX`가 아님 |
| 503 | `SERVICE_UNAVAILABLE` | 레코드 캐시·DB 장애(빈 목록을 「파트너 0곳」으로 반환하지 않음) |

#### API-002. 캐시백 허브 구성

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/cashback-hub` |
| 설명 | 허브의 라우트 목록·계산기 설정(Spending Estimate)·비교표 데이터를 한 번에 준다. 요율·파트너는 API-001과 같은 레코드에서 계산한다 |
| 구분 | 신규 |
| 권한 | 공개(선택 인증) |
| 관련 기능 | FU-045 · FU-046 · FU-047 · FU-048 · BU-039 · BU-040 · BU-041 · BU-042 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| lang | string | 선택 | 문구 언어 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "routes": [
      { "route": "DEX", "partnerCount": 4, "upToRate": "…", "defaultPartnerNo": 41, "partners": [41, 42, 43, 44] },
      { "route": "CEX", "partnerCount": 18, "upToRate": "…", "defaultPartnerNo": 3, "partners": [] },
      { "route": "BROKERS", "partnerCount": 2, "upToRate": "…", "defaultPartnerNo": 90, "partners": [] }
    ],
    "spendingEstimate": {
      "DEX": { "defaultExchangeNo": 41, "defaultVolume": "…", "ticks": ["…"], "partners": [ { "exchangeNo": 41, "minSpend": "1000", "maxSpend": "250000" }, { "exchangeNo": 43, "minSpend": "500", "maxSpend": "100000" } ] },
      "CEX": { "defaultExchangeNo": 3, "defaultVolume": "…", "ticks": ["…"], "partners": [ { "exchangeNo": 3, "minSpend": "10000", "maxSpend": "500000" } ] }
    },
    "spendingEstimateTexts": { "lang": "en", "blockTitle": "…", "description": "… {rate} …", "howThisWorksLabel": "How this works", "resultLabels": ["…", "…", "…"], "sliderLabel": "…", "takerMakerLabels": ["Taker", "Maker"], "flow": { "title": "…", "nodes": ["…", "…", "…"], "edges": ["…", "…"], "badge": "…" }, "cards": [ { "title": "…", "body": "…" } ], "footnote": "…" },
    "comparison": [
      { "exchangeNo": 41, "rating": { "score": "4.2", "count": 23 } }
    ]
  },
  "meta": { "requestId": "req_…" }
}
```

- `upToRate` = 그 라우트에서 요율 있는 파트너 중 최고 계산값(REQ-297). 요율 있는 파트너가 0이면 `partners: []`, `upToRate: null`.
- `spendingEstimateTexts` = 운영자가 Spending Estimate에서 편집한 문구(REQ-626, API-130 `texts`). 요청 `lang`의 문구, 없으면 영어. 편집 언어는 EN·KO 필수, RU·ID 선택(G-261).
- `defaultPartnerNo` = 운영자가 `Default Exchange`(API-130)에 지정한 활성 파트너(REQ-295). 지정 예정값 CEX = Bybit · Brokers = RS Finance, DEX = 활성 DEX 중 운영자 지정(G-142 확정: 요율 없는 기본 파트너면 첫 설정 파트너로 + 백오피스 경고. CEX 기본은 Bybit(REQ-295 지정 예정값)·G-146 확정: 로그인 시 잔액이 가장 큰 연동 파트너를 미리 선택). 슬라이더 범위는 운영자 설정값(G-148).
- `rating.count` < 20이면 프론트가 `-` 표시(REQ-313).
- `spendingEstimate.{탭}.partners[]` = 파트너마다 저장한 거래량 범위(`Min. spend`·`Max spend`, REQ-627). 그 탭의 활성 파트너만 들어 있다. 파트너를 바꾸면 프론트가 이 배열의 범위로 슬라이더를 바꾸고 추가 호출 없이 재계산한다(REQ-294). `defaultVolume`·`ticks`는 탭 단위로 내려 주며, 파트너 범위 밖이면 범위 안으로 클램프한다.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 503 | `SERVICE_UNAVAILABLE` | 레코드·설정 조회 실패 |

#### API-003. DEX 랜딩 콘텐츠·신뢰 지표

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/dex-landing` |
| 설명 | DEX 랜딩 9개 영역 콘텐츠, 랜딩에 올린 DEX 목록(우선순위 순), glance 타일, DefiLlama 지표(서버 캐시)를 준다 |
| 구분 | 신규 |
| 권한 | 공개(선택 인증) |
| 관련 기능 | FU-010 · FU-049 · FU-050 · FU-051 · FU-052 · FU-053 · BU-010 · BU-043 · BU-044 · BU-045 · BU-046 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| lang | string | 선택 | 콘텐츠 언어(없으면 영어 폴백) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "hero": { "title": "Trade onchain, keep your cashback", "lede": "…", "partnerCountText": "{n} partner DEXs you can start earning Cashback with", "riskNotice": "…" },
    "sectionButtons": ["DEX Overview", "Guide to DEX"],
    "trust": { "title": "Partner DEXs at a glance", "subline": "TVL and 24H volume from DefiLlama, as of {date}", "linkLabel": "…", "labels": ["…", "…"] },
    "venueArea": { "title": "Our Partner Decentralised Exchanges", "description": "…", "cardsPerView": "…", "overflow": "…" },
    "venues": [
      {
        "exchangeNo": 41, "name": "Lighter", "priority": 1,
        "card": { "line1": "…", "line2": "…", "line3": "…" },
        "learnMoreUrl": "https://…",
        "getStartedUrl": "https://app.lighter.xyz/?referral=TETHERMAX&…",
        "detailSlug": "lighter",
        "metrics": { "tvlUsd": "…", "volume24hUsd": "…", "volumeChange24h": "…", "asOf": "2026-11-11T00:00:00Z", "stale": false }
      }
    ],
    "glance": [41, 42, 43, 44],
    "promoBanners": [ { "imageUrl": "…", "title": "…", "content": "…", "linkUrl": "…" } ],
    "comparisonRows": [ { "label": "…", "cex": "…", "dex": "…" } ],
    "stepsArea": { "title": "A simple 3 step path", "buttonLabel": "…" },
    "steps": [ { "no": 1, "title": "Create a Web 3 Wallet", "body": "…", "duration": "About 2 minutes", "imageUrl": "…" } ],
    "educationTiles": [ { "tag": "CUSTODY", "title": "You hold the keys.", "body": "…", "imageUrl": "…" } ],
    "learnAndEarn": { "enabled": true, "tag": "…", "title": "…", "description": "…", "buttonLabel": "…" },
    "finalCta": { "title": "…", "description": "…", "buttonLabel": "…", "buttonUrl": "…" }
  },
  "meta": { "requestId": "req_…" }
}
```

- 운영자 편집 영역은 API-127 `areas`와 같은 키(REQ-628, 정책 C-12-3): `hero`(`title` = H1 · `lede` = 리드) · `sectionButtons` · `trust` · `venueArea` · `comparisonRows` · `stepsArea`·`steps` · `educationTiles` · `learnAndEarn` · `finalCta`. 비운 칸은 언어팩 기본 문구로 채워 준다(G-366). 파트너 카드 `card`(Line 1~3) · `learnMoreUrl` · `getStartedUrl`은 거래소별 Edit Landing Content(API-128 `LANDING_CARD`) — 카드에는 오퍼 3줄만(G-157). `partnerCountText`·`riskNotice`(G-155)는 고정 문구, 히어로 배경 등 빌드 에셋은 응답에 없다.
- `metrics`: 실패 시 24시간은 마지막 값(`stale: true`), 그 뒤 `null`(영역 숨김, REQ-323). 24H 거래량 출처 G-349 확정: `api.llama.fi/summary/derivatives/{slug}` · 캐시 24시간 · 24시간 뒤 숨김.
- `venues[]`에는 상태 값을 두지 않는다 — 비노출 DEX는 응답에서 빠지고(G-162), 점검 상태도 없다(G-460). 노출 DEX가 0이면 `venues: []`.
- 히어로 리드는 G-154의 언어별 확정 문구를 사용한다. 위험 고지는 언어팩 고정 문구(G-155)로 표시한다. 비교 문구는 `Your DEX cashback does not.`(G-401), 퀴즈 보상은 이벤트 리워드 매칭 규칙(G-158)을 따른다. 벤토 이미지는 최종 디자인 자산(G-159)을 사용한다. 선택 콘텐츠 값이 비면 해당 요소만 숨긴다.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 503 | `SERVICE_UNAVAILABLE` | 콘텐츠 조회 실패 |

#### API-004. 거래소 상세(Venue) 콘텐츠

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/exchanges/{slug}/detail` |
| 설명 | DEX 상세 페이지 콘텐츠(히어로·오퍼 박스·이유 카드·계산기 범위·단계 가이드·FAQ·약관·리뷰 요약)와 회원 상태 분기 값을 준다 |
| 구분 | 신규 |
| 권한 | 공개(선택 인증, 로그인 시 `memberState` 개인화 → `private, no-store`) |
| 관련 기능 | FU-010 · FU-054 · FU-055 · FU-056 · FU-057 · FU-058 · FU-059 · FU-084 · BU-010 · BU-047 · BU-048 · BU-049 · BU-050 · BU-051 · BU-052 |

> 기존 API: 기존 CEX 상세는 `/exchange/get-exchange-detail`이다. DEX 상세는 콘텐츠 구성이 달라 별도 엔드포인트로 둔다(경로 분기는 `Exchange Type`).

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| slug | string | 필수 | path. 상세 슬러그(이름 변경 시 이전 슬러그는 301) |
| lang | string | 선택 | 콘텐츠 언어 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "exchangeNo": 41, "name": "Lighter", "exchangeType": "DEX",
    "memberState": "exchange_member_unlinked",
    "hero": { "introduction": "…", "markets": ["Crypto", "Tokenised Equity"], "deposit": ["FIAT", "CRYPTO"], "benefits": ["…", "…", "…", "…"], "eligibilityNote": "…" },
    "offerBox": { "tabs": [ { "name": "Premium", "label": "Trading fees cashback up to", "headline": "20%", "getStartedUrl": "…", "stages": [ { "feeStage": "Without TetherMax", "finalTaker": "0.0280%", "finalMaker": "0.0040%" }, { "feeStage": "After cashback", "finalTaker": "0.0224%", "finalMaker": "0.0032%" } ] } ] },
    "reasonCards": { "title": "Why traders choose Lighter", "items": [ { "imageUrl": "…", "alt": "…", "description": "…" } ] },
    "calculator": { "minVolume": "…", "maxVolume": "…" },
    "guide": { "title": "Step by step guide on starting your trading journey on Lighter", "steps": [ { "no": 1, "title": "Create a Web3 wallet", "description": "…", "media": { "desktop": { "url": "…/step1_2x1.mp4", "alt": "…" }, "mobile": { "url": "…/step1_1x1.mp4", "alt": "…" } } } ] },
    "banner": { "desktopImageUrl": "…", "mobileImageUrl": "…", "liner": "Start Earning Cashback with Lighter", "ctaTitle": "Join Now", "ctaUrl": "…", "style": { "fontSize": "…", "fontWeight": "…", "color": "…" } },
    "faq": [ { "section": "General Partnership", "items": [ { "q": "…", "a": "…" } ] } ],
    "terms": null,
    "reviews": { "count": 0, "score": null, "histogram": {}, "aiSummary": [] },
    "seo": { "title": "…", "description": "…", "canonical": "…" }
  },
  "meta": { "requestId": "req_…" }
}
```

- `memberState` = 기존 상태 `exchange_guest` / `exchange_member_unlinked` / `exchange_member_linked`(REQ-338).
- 어드민 Edit Detailed Content(API-128 `DETAIL`)와 1:1이다: `hero.introduction` = `Introduction` · `hero.markets` = 마켓 태그(G-273) · `hero.deposit` = `Deposit` · `hero.benefits` = Edit Landing Content `Bullet 1~4`(빈 줄 제외, G-157 · G-441) · `hero.eligibilityNote` = `Additional Notes`(거래소별 자격 안내, 비면 `null` → 숨김, G-440) · `offerBox.tabs[]` = Right Box 탭(`name` = `Tab Name` · `label` = `Line 1` · `headline` = `Line 2`의 `{요율}` 치환값 · `getStartedUrl` = `Get Started link`, G-438). 탭이 1개면 토글 없음, `stages`는 레코드 요율로 서버가 계산 · `reasonCards` = `Key Features Title` + 주요 특징 4개(썸네일 · 설명) · `calculator` = `Structure` · `banner` = 배너(`Banner Liner` · `CTA button title` · `CTA link` · 문구 스타일) · `faq[].items` = 섹션의 질문·답변 쌍(G-439) · `terms` = `Terms and Conditions`. `seo`는 SEO 관리(REQ-630)에서 온다.
- `guide`는 어드민 REQ-622 필드와 1:1이다: `guide.title` = `Guide Title` · `steps[].title` = `Step N Title`(왼쪽 목록과 오른쪽 패널 제목 공용) · `steps[].description` = `Step N Description`(경고·안전 메시지 포함, 별도 필드 없음) · `steps[].media.desktop` = 2:1 `.mp4` · `steps[].media.mobile` = 1:1 `.mp4`. `steps` 길이 = `No. of Guide Steps`(1~5)이고 `Step n of N`의 N은 배열 길이다. 요청 언어 영상이 없으면 영어 영상 URL을 준다. 지원 카드(`Stuck partway through?`)는 고정 문구라 응답에 없다.
- `terms: null`이면 약관 섹션 숨김. 약관은 거래소별로 어드민(EDC `Terms and Conditions`)에서 입력(G-369). 단계 가이드 구조 G-270 · G-437 확정, FAQ 구조 G-272 · G-439 확정: 섹션 단위 — Section Name 40자 + 질문·답변 쌍(섹션 합계 2,000자).
- 오프보딩 DEX 요청은 404가 아니라 `301` → DEX 랜딩(REQ-358).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 301 | — | 이전 슬러그 또는 오프보딩 DEX(Location 헤더) |
| 404 | `NOT_FOUND` | 없는 슬러그·비게시 |

#### API-005. 연동 가이드 (DEX = 지갑 주소 찾기)

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/exchange/get-exchange-guide-info` |
| 설명 | 연동 화면의 안내 블록을 준다. DEX는 지갑 주소 찾기 블록과 소유권 녹화 가이드(3단계, REQ-725)를 반환하고 UID 찾기 변형은 반환하지 않는다 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준) |
| 권한 | 로그인 |
| 관련 기능 | FU-016 · FU-027 · BU-016 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | 거래소. 요청 위치(쿼리 · 본문)는 기존 `/exchange/get-exchange-guide-info` 라우터 기준 ⚠ — 경로 변수 아님 |
| lang | string | 선택 | 없으면 영어 폴백 |
| device | string | 선택 | `MOBILE` / `PC`(단계 이미지 세트) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "variant": "WALLET_ADDRESS",
    "title": "How to find your wallet address",
    "steps": [ { "no": 1, "imageUrl": "…/1.webp", "title": "…", "description": "Open Lighter and log in. Tap your wallet address in the top r…", "extra": null } ],
    "safetyNotice": "…",
    "helper": "Paste the wallet address you use on this exchange.",
    "ownershipGuide": { "steps": [ { "no": 1, "imageUrl": "…", "title": "Start recording, then disconnect your wallet", "description": "…", "extra": null } ] }
  },
  "meta": { "requestId": "req_…" }
}
```

- `steps` = 어드민 거래소 가이드 `UID 찾기` 단계 편집기(DEX = 지갑 주소 찾기, REQ-533 · G-443): 요청 `device`의 이미지 + 요청 언어의 제목·설명·부가(한/영, 그 외 언어는 영어). 이미지 대체 텍스트는 단계 제목. `ownershipGuide.steps` = 같은 메뉴 `소유 확인 가이드` 편집기(REQ-530 · REQ-725 · G-443). `safetyNotice`(G-392) · `helper`는 고정 문구.
- 필수 언어(EN·KO)에 완성된 단계가 없으면 그 DEX는 그 언어에서 연동 불가(API-001 `linkableOnly`에서 빠짐, REQ-070). 피싱 방지 문구 G-392 확정: 가이드 하단에 `테더맥스는 개인키 · 시드 문구 · 지갑 서명을 요구하지 않아요.` / `TetherMax never asks for your private key, seed phrase, or a wallet signature.`.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `NOT_FOUND` | 없는 거래소·가이드 없음 |

#### API-006. 연동 사전 확인 (한도·연동 가능)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/link/precheck` |
| 설명 | 주소 입력 전에 연동 한도와 그 거래소의 연동 가능 여부를 판정한다. 결과는 안내용이며, API-007이 같은 판정을 트랜잭션 안에서 다시 한다. 연동 전 잔액은 주소가 정해진 뒤 API-007에서 처리한다(REQ-107) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 로그인 |
| 관련 기능 | FU-013 · FU-014 · BU-013 · BU-014 |

> 기존 API: 기존 `uid` 도메인(`/uid/get-integration-status` 등)에 같은 판정이 있으면 그 API를 확장한다.

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 선택 | 지정하면 그 거래소 연동 가능 여부도 판정 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "canLink": false,
    "blockReason": "INTEGRATION_MAX_COUNT_OVER",
    "accountLimit": { "used": 12, "limit": 66 },
    "exchangeLinkable": true
  },
  "meta": { "requestId": "req_…" }
}
```

- `blockReason`: `null` / `INTEGRATION_MAX_COUNT_OVER` / `EXCHANGE_NOT_LINKABLE`. `FAILED_NEED_RECEIVE`로 연동을 막지 않는다(REQ-107). 화면은 결과 숫자만 보이고 산식을 공개하지 않는다(REQ-112).
- `accountLimit.limit` = 기존 공통 설정값(현행 산식, G-479). `used`는 상태 무관 전부(확인 중·실패·해제 포함).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |

#### API-007. DEX 지갑 연동 신청

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/accounts/dex-wallets` |
| 설명 | 지갑 주소를 검증하고 파트너 귀속을 확인해 연동한다. 순서: 게이트(한도) → 주소 검증 → 캡차 검증 → 파트너 귀속 조회 → 중복 판정(DB 유일 제약) → **연동 전 잔액 처리**(REQ-107) → 결과. 한도 검사와 행 생성은 한 트랜잭션 |
| 구분 | 신규 |
| 권한 | 로그인 |
| 관련 기능 | FU-003 · FU-009 · FU-012 · FU-014 · FU-015 · FU-017 · FU-018 · FU-019 · FU-020 · FU-021 · FU-022 · FU-023 · FU-024 · FU-025 · FU-027 · BU-003 · BU-009 · BU-012 · BU-014 · BU-015 · BU-017 · BU-018 · BU-019 · BU-020 · BU-021 · BU-022 · BU-023 · BU-024 · BU-025 · BU-027 |

> 기존 API: CEX 연동은 기존 `/uid/uid-integration-init`이다. DEX는 주소 검증·귀속 조회 단계가 달라 별도 엔드포인트로 두되, 기존 API를 확장해도 계약(요청·응답·에러 코드)은 이 문서를 따른다.

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | UUID |
| exchangeNo | integer | 필수 | DEX 거래소 |
| walletAddress | string | 필수 | 붙여넣은 주소. 서버가 trim 후 검증, 저장은 trim 결과 그대로(대소문자 보존) |
| captchaToken | string | 필수 | GEETEST 결과. 1회용·주소 바인딩 여부 ❓ G-098 |
| entryPoint | string | 선택 | `checklist` · `empty_state` · `home` · `hub` · `venue` · `maxboard`(분석용, 식별자 아님) |

```json
{ "exchangeNo": 41, "walletAddress": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "captchaToken": "gt_…" }
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "result": "LINKED",
    "accountId": "acc_8f21c0",
    "exchangeNo": 41,
    "walletAddress": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9",
    "linkStatus": "LINKED",
    "processingReason": null,
    "prelinkPayoutAmount": null,
    "prelinkTransferredAmount": "4.00",
    "accrualStartsAt": "2026-11-11T03:20:11Z",
    "cashbackShownFrom": null,
    "settlementCard": { "cycle": "WEEKLY", "nextUpdateAt": "2026-11-16T00:00:00Z" },
    "isFirstLink": false
  },
  "meta": { "requestId": "req_…" }
}
```

- `result: "PROCESSING"`이면 `linkStatus: "MANUAL_LINK_PENDING"`, `accrualStartsAt: null`. 파트너 조회 타임아웃·5xx·429 · ApeX `AccountID` 미반환 · 한 지갑 = DEX 계정 여러 개일 때(REQ-099). 접수 단계에서는 알림을 보내지 않는다.
- **연동 전 잔액 처리(REQ-107 · REQ-720)**: 귀속·중복 판정을 통과하면 이 요청 시각 기준으로 그 지갑의 연동 전 잔액(미연동 지갑 적립분 · 해제 이후 쌓인 금액)을 확정한다.
  - 매칭 출금 가능액 10 USDT 미만 → `result: "LINKED"`, 잔액을 같은 트랜잭션에서 이 회원에게 이관하고 감사 로그를 남긴다.
  - 10 USDT 이상 → 확정 금액을 **그 지갑으로 출금 요청**(JOB-D10이 Wallet B에서 송금)하고 `result: "PROCESSING"`, `processingReason: "PRELINK_PAYOUT"`, `prelinkPayoutAmount`를 준다. 그 지갑은 이 신청이 점유한다(다른 회원 신청은 `FAILED_ALREADY_INTEGRATION`). 출금이 성공하면 자동으로 `LINKED`가 되고 남은 금액(매칭에서 빠진 이벤트 리워드 · 10 USDT 미만 잔여)을 이관한다. 실패하면 연동 실패(`PRELINK_PAYOUT_FAILED`)이며 금액은 그 지갑의 연동 전 잔액으로 복원한다. 결과 전달은 확인 중 → 완료/실패 알림과 같은 경로(문구 G-426 확정: 문구표에서 확정 · 피드에는 미노출 · 요약에는 `연동 전 출금` 행 표시).
  - 이 출금은 회원 출금이 아니다 — TP · 초대 리워드 실적 · 첫 출금 혜택을 만들지 않는다(REQ-720).
  - 파트너 귀속 확인 대기(`processingReason: "PARTNER_LOOKUP"`)로 접수된 연동은 승인 시점에 이 처리를 시작한다(API-109 · JOB-D07). 두 대기 사유는 따로 저장·조회한다(REQ-722). 금액 기준 시각은 이 요청 시각.
- `cashbackShownFrom`: 원장 수집 시작 전 기록이 파트너 조회 한도(180일)로 잘린 경우 그 날짜(`Cashback shown from {date}`), 아니면 `null`.
- DEX 계정 ID(ApeX `AccountID` 등)는 저장만 하고 응답에 넣지 않는다.
- 귀속 조회는 거래소별 경로를 쓴다: DEX 4곳 모두 표준 요건의 단건 귀속 조회(지갑 비마스킹, 표준 요건 수락 전제, G-001 · G-428). 부록 「파트너 API」 참조.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 필수값 누락 |
| 400 | `CAPTCHA_REQUIRED` | 캡차 토큰 없음 |
| 401 | `UNAUTHORIZED` | 비로그인 |
| 409 | `IDEMPOTENCY_KEY_REUSED` | 같은 키 다른 본문 |
| 409 | `FAILED_ALREADY_INTEGRATION` | 같은 DEX에 다른 회원이 연동(확인 중 포함, 동시 제출 시 뒤 요청) → `Verify Ownership`(API-025) |
| 409 | `FAILED_RECENT_POSSESSION` | 그 지갑의 마지막 소유권 승인 후 30일 이내 → `Verification Limit Reached`(연동 결과, 신청 불가) |
| 409 | `FAILED_MY_INTEGRATION` | 동일 DEX에 본인이 이미 연동. 동일 여부는 주소 형식별 비교 규칙에 따른다(G-062) |
| 422 | `ADDRESS_EMPTY` · `ADDRESS_WRONG_FORMAT_FOR_DEX` · `ADDRESS_INVALID` · `ADDRESS_INVALID_CHECKSUM` · `ADDRESS_NAME_NOT_ALLOWED` · `ADDRESS_ZERO` | 주소 검증(처음 걸린 하나) |
| 422 | `CAPTCHA_FAILED` | 캡차 검증 실패 |
| 422 | `EXCHANGE_NOT_LINKABLE` | 비노출·연동불가·비활성·지역 제한·지갑 가이드 없음 |
| 422 | `INTEGRATION_MAX_COUNT_OVER` | 한도 초과 |
| 422 | `FAILED_NOT_FOUND_UID` | 레퍼럴 아님 |
| 422 | `LINK_REJECTED` | 그 밖의 확정적 거절 |

#### API-008. 내 거래 계정 목록

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/uid/get-my-uid-list` |
| 설명 | 홈 Linked Accounts·쿠폰/리그/초대 계정 선택이 쓰는 회원의 거래 계정 목록(CEX UID + DEX 지갑, 상태 우선순위 순) |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준). 응답 행에 DEX 지갑 추가 |
| 권한 | 로그인 |
| 관련 기능 | FU-002 · FU-003 · FU-007 · FU-023 · FU-025 · FU-037 · FU-039 · FU-054 · FU-070 · BU-002 · BU-003 · BU-007 · BU-023 · BU-025 · BU-032 · BU-034 · BU-047 · BU-063 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType | string | 선택 | `CEX` / `DEX` |
| purpose | string | 선택 | `HOME` / `COUPON` / `INVITATION_WITHDRAW` / `LEAGUE` — 용도별 선택 가능 여부(`selectable`) 계산 |
| page · size | integer | 선택 | 기본 1 · 20 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "accountId": "acc_8f21c0",
      "accountKind": "WALLET",
      "exchangeNo": 41, "exchangeName": "Lighter", "exchangeType": "DEX",
      "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9",
      "linkStatus": "LINKED",
      "statusPriority": 4,
      "availableCashback": "0.00",
      "selectable": true,
      "isIssue": false,
      "isExchangeActive": true
    },
    {
      "accountId": "acc_1102aa", "accountKind": "UID",
      "exchangeNo": 3, "exchangeName": "Bitget", "exchangeType": "CEX",
      "identifier": "4820****37",
      "linkStatus": "LINKED", "statusPriority": 4, "availableCashback": "12.40",
      "selectable": true, "isIssue": false, "isExchangeActive": true
    }
  ],
  "meta": { "requestId": "req_…", "pagination": { "page": 1, "size": 20, "totalCount": 2, "totalPages": 1 }, "countByExchange": [ { "exchangeNo": 41, "count": 1 } ] }
}
```

- `identifier`: DEX 지갑 = 전체 주소, CEX UID = 기존 마스킹(REQ-009). DEX 계정 ID 미포함.
- `MANUAL_LINK_PENDING` 행은 `availableCashback: null`(화면 `-`), `selectable: false`(REQ-034).
- `isExchangeActive: false` = DEX 오프보딩(홈 행은 이슈 표시 — 빨간 점, 탭 → `There is a problem with this wallet.` 모달 · 출금 목적지로는 계속 선택 가능).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |

#### API-009. DEX 지갑 상세

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/accounts/dex-wallets/{accountId}` |
| 설명 | 지갑 상세 화면의 헤더·금액·정산 상태·주간 내역(7일)을 준다 |
| 구분 | 신규 |
| 권한 | 로그인(본인 계정만) |
| 관련 기능 | FU-002 · FU-011 · FU-040 · BU-002 · BU-011 · BU-035 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| accountId | string | 필수 | path. 내부 계정 ID(주소를 경로에 넣지 않음) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "accountId": "acc_8f21c0",
    "exchangeNo": 41, "exchangeName": "Lighter",
    "walletAddress": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9",
    "linkStatus": "LINKED",
    "availableCashback": "25.00",
    "exchangeCashback": "25.00",
    "eventReward": null,
    "withdrawable": "25.00",
    "minimumWithdrawal": "10.00",
    "rate": "…",
    "settlement": { "cycle": "WEEKLY", "status": "CREDITED", "lastUpdatedAt": null },
    "weeklyHistory": [ { "date": "2026-11-10", "net": "25.00" }, { "date": "2026-11-09", "net": "-20.00" } ]
  },
  "meta": { "requestId": "req_…" }
}
```

- `eventReward: null`이면 행 미표시. `withdrawable` = 매칭 후, 절삭.
- API-009 지갑 상세 카드에서 `exchangeCashback`은 이 지갑의 확정 캐시백 A, `eventReward`는 매칭 전 이벤트 보유액 B다. B가 0인 경우에도 행을 숨긴다. B > 0이면 리워드 행에 min(A, B), 보조 설명에 매칭액 / B를 표시한다. 예: A=7, B=100 → 행 7.00, 설명 7.00 / 100.00 USDT, 상세 합계와 진행 줄은 `withdrawable` 14.00. A=2, B=8이면 상세 합계 4.00으로 최소액 미달이다. API-010 홈의 매칭 전 합계와 구분한다.
- `settlement.status`는 기능 플래그(G-100: Lighter도 일 1회 원장이라 주중 표시 문제 없음(G-428)·G-127 확정: ApeX가 원장 전 배치를 노출할 때만 `Pending` 줄 표시·G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용). 수집 상태 `DEGRADED`면 `lastUpdatedAt` 채움.
- `weeklyHistory.date`는 UTC 날짜가 아니라 **시간 단위 원천을 회원 로컬 기준으로 묶은 값이 필요**하므로, 프론트가 API-013으로 재집계하는 방식도 허용(같은 결과여야 함). `Total Claimed`·하위 계정 G-053 확정: 유지 — V2에서는 테더맥스를 통해 출금한 누계라 데이터가 있음(결정 전 미포함).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `NOT_FOUND` | 없는 계정·남의 계정·CEX 계정 |

#### API-010. 캐시백 잔액 (계정별 매칭·출금 가능)

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/payback/payback-availability-withdrawal` |
| 설명 | 잔액 서비스. 홈 총 잔액·허브 패널·지갑 상세가 쓰는 계정별 A·B·매칭액·자격과 원장 일자를 준다. 10분 주기 자동 지급(JOB-D15)도 같은 계산으로 대상 계정을 고른다 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준). 홈 총 잔액·허브 패널이 다른 기존 API에서 금액을 받으면 그 API에도 같은 필드를 추가 |
| 권한 | 로그인 |
| 관련 기능 | FU-002 · FU-004 · FU-007 · FU-011 · FU-030 · FU-031 · FU-032 · FU-033 · FU-036 · FU-037 · FU-038 · FU-039 · FU-040 · FU-046 · BU-002 · BU-004 · BU-007 · BU-011 · BU-029 · BU-030 · BU-032 · BU-033 · BU-034 · BU-035 · BU-040 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType | string | 선택 | `CEX` / `DEX`(허브 DEX 패널) |
| exchangeNo | integer | 선택 | 특정 거래소만 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "totalCashbackBalance": "37.40",
    "totalWithdrawable": "35.00",
    "payoutNetwork": { "name": "…", "configured": true },
    "accounts": [
      {
        "accountId": "acc_8f21c0", "accountKind": "WALLET",
        "exchangeNo": 41, "exchangeName": "Lighter", "exchangeType": "DEX",
        "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9",
        "exchangeCashback": "25.00",
        "eventReward": "10.00",
        "availableCashback": "35.00",
        "matchedAmount": "35.00",
        "minimumWithdrawal": "10.00",
        "eligible": true,
        "shortfall": null,
        "stateKey": "cashback_matched_available",
        "ledgerDate": "2026-11-10",
        "collectionStatus": "LIVE",
        "lastUpdatedAt": null,
        "preAccrual": { "status": "PENDING", "amount": "3.10" },
        "cashbackUpdates": { "cycle": "WEEKLY", "caption": "…" },
        "loadError": null,
        "isExchangeActive": true
      }
    ]
  },
  "meta": { "requestId": "req_…" }
}
```

- 계정마다: `minimumWithdrawal` = 그 계정의 최소액(설정값, 배포 없이 변경, REQ-159·REQ-257) · `matchedAmount` = 출금 가능액 `A + MIN(B, A)` 절삭(10진 문자열) · `eligible` = 출금 가능 여부(boolean, `matchedAmount ≥ minimumWithdrawal`) · `ledgerDate` = 원장 일자(`YYYY-MM-DD`, UTC) · `shortfall` = 부족분(`eligible`이면 `null`). REQ-257 인수 기준의 최소액 · 출금 가능 여부 · 출금 가능액 · 원장 일자가 이 네 필드다.
- `totalCashbackBalance` = 매칭 전 `availableCashback` 합(홈), `totalWithdrawable` = 자격 계정 `matchedAmount` 합(자동 지급 판정·허브 패널). 연동 미완료 계정 제외.
- `preAccrual`은 어떤 합계에도 넣지 않는다(G-100: Lighter도 일 1회 원장이라 주중 표시 문제 없음(G-428)·G-127 확정: ApeX가 원장 전 배치를 노출할 때만 `Pending` 줄 표시, 결정 전 `null`).
- 파트너 오류 시 그 계정만 `loadError: "PARTNER_UNAVAILABLE"`(금액은 마지막 확정값 유지, 0으로 만들지 않음). 원장을 아직 받지 않은 DEX는 계정 행을 반환하지 않는다(→ 계산기 폴백, REQ-275).
- 정렬: 우선순위 순, 자격 계정 먼저(G-114 확정: 10개 + `더보기`(본문 6-1)·G-115). 확인 중(`MANUAL_LINK_PENDING`) 계정은 넣지 않는다(REQ-134).
- 자동 지급 신청이 생성된 금액은 선차감되어 `availableCashback`·`matchedAmount`에서 이미 빠져 있다(REQ-132·REQ-158). 응답에 「신청」용 필드(버튼 활성 여부 등)는 없다 — 화면의 `Auto Claim`은 항상 비활성(REQ-133).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 503 | `SERVICE_UNAVAILABLE` | 잔액 서비스 장애 → 프론트 `We can't load your balance right now.` + `Try again`(0 표시 금지) |

#### API-012. 캐시백 요약 (월간 카드·일별 목록)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/cashback/summary` |
| 설명 | 캐시백 요약 화면의 월간 카드와 일별 목록 행을 준다. 캘린더 칸 합계는 API-013이 **같은 `tz`로** 계산해 주며 일별 목록 · 월 합계와 같다(REQ-027) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 로그인 |
| 관련 기능 | FU-004 · FU-005 · FU-006 · FU-007 · FU-011 · FU-035 · FU-041 · FU-060 · FU-061 · FU-062 · BU-004 · BU-005 · BU-006 · BU-007 · BU-011 · BU-036 · BU-053 · BU-054 · BU-055 |

> 기존 API: 기존 `payback-analysis` 도메인(내 캐시백 리포트·내역·내역 상세)의 API다. 경로 문자열은 확인하지 못했다.

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| month | string | 필수 | `YYYY-MM`(회원 로컬 월) |
| tz | string | 필수 | IANA 시간대(`Asia/Seoul`) — 로컬 날짜 경계 계산 |
| scope | string | 선택 | `ExchangeScope`(기본 `ALL`) |
| accountId | string | 선택 | 계정 필터 |
| types | string[] | 선택 | `EXCHANGE_CASHBACK` · `EVENT_REWARD` · `WITHDRAWAL`(복수) |
| date | string | 선택 | `YYYY-MM-DD` — 일별 목록 날짜 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "monthly": { "received": "120.50", "withdrawn": "80.00" },
    "dexPendingDates": [ { "date": "2026-11-10", "exchangeNo": 43 } ],
    "rows": [
      { "date": "2026-11-10", "type": "EXCHANGE_CASHBACK", "exchangeNo": 41, "exchangeName": "Lighter", "identifier": "0x7a3F…51E9", "amount": "25.00", "settlementStatus": "CREDITED" },
      { "date": "2026-11-10", "type": "WITHDRAWAL_RETURNED", "exchangeNo": 41, "exchangeName": "Lighter", "identifier": "0x7a3F…51E9", "amount": "20.00", "settlementStatus": null }
    ],
    "collection": [ { "exchangeNo": 43, "status": "DEGRADED", "lastUpdatedAt": "2026-11-10T01:00:00Z" } ],
    "range": { "dexFrom": "2026-05-15" }
  },
  "meta": { "requestId": "req_…" }
}
```

- `identifier`는 전체 주소를 보내고 화면 폭 축약은 프론트가 한다(위 예시는 표기 예). 금액은 USDT(USDC 1:1).
- `dexPendingDates`: DEX 원장 미수신 날짜 → `DEX data pending`(0과 구분, REQ-373). `range.dexFrom` = 최근 180일 경계.
- `WITHDRAWAL` = 자동 지급 출금 행, `WITHDRAWAL_RETURNED` = 최종 실패 복원 행(G-113 확정: 복원된 날 `+` 부호 행(`Withdrawal returned`)). 출금 행에 tx 해시·익스플로러 링크를 넣지 않는다(회원 화면에 결과·tx 해시 없음, REQ-163).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `month`·`tz` 형식 오류 |
| 401 | `UNAUTHORIZED` | 비로그인 |

#### API-013. 캘린더용 일별 합계 (회원 시간대)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/cashback/calendar` |
| 설명 | 캐시백 요약 캘린더의 날짜 칸 합계를 회원 기기 시간대(`tz`)로 서버가 계산해 준다. 일별 목록·월 합계(API-012)와 같은 `tz` · 같은 원천 시각(UTC)으로 계산하므로 세 합계가 항상 같다(REQ-027). 시간 단위 버킷은 내려 주지 않는다 — UTC+05:30 · +05:45처럼 30 · 45분 시간대에서 같은 시간 버킷의 두 건이 다른 날짜로 갈리기 때문 |
| 구분 | 신규 |
| 권한 | 로그인 |
| 관련 기능 | FU-004 · FU-005 · FU-061 · BU-004 · BU-005 · BU-054 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| month | string | 필수 | `YYYY-MM`(회원 로컬 월) |
| tz | string | 필수 | IANA 시간대(`Asia/Kolkata` 등). API-012와 같은 값 |
| scope · accountId · types | — | 선택 | API-012와 같음 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "days": [
      { "date": "2026-11-10", "credit": "2.10", "debit": "0.00" },
      { "date": "2026-11-11", "credit": "1.40", "debit": "0.00" }
    ],
    "dailyOnly": [ { "exchangeNo": 43, "dateUtc": "2026-11-10", "credit": "4.00", "placedOn": "2026-11-10" } ]
  },
  "meta": { "requestId": "req_…" }
}
```

- 예: `tz = Asia/Kolkata`(UTC+05:30)에서 `18:20Z` 1.00과 `18:40Z` 0.40 → `2026-11-10`(23:50) 1.00 · `2026-11-11`(00:10) 0.40.
- `dailyOnly`: 시간 타임스탬프 없이 UTC 일 1레코드로 오는 원장(EdgeX). 로컬 날짜로 나눌 수 없어 레코드의 날짜(UTC 거래일) 칸(`placedOn` = `dateUtc`)에 그대로 넣는다(G-329). 같은 규칙을 API-012에도 쓴다.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `month`·`tz` 형식 오류 |
| 401 | `UNAUTHORIZED` | 비로그인 |

#### API-014. 캐시백 랭킹

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/rank/get-my-ranking-list` |
| 설명 | CEX UID와 DEX 지갑을 한 순위표로 매긴 월간 캐시백 랭킹과 내 계정 순위를 준다 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준) |
| 권한 | 공개(내 순위는 로그인) |
| 관련 기능 | FU-004 · FU-006 · FU-007 · FU-063 · BU-004 · BU-006 · BU-007 · BU-056 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| month | string | 필수 | `YYYY-MM`(월 경계 ❓ G-185) |
| exchangeType | string | 선택 | `ALL` / `CEX` / `DEX` |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "updatedAt": "2026-11-11T00:01:00Z",
    "mine": [ { "accountId": "acc_8f21c0", "exchangeName": "Lighter", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "rank": 3 } ],
    "notRankedNotice": true
  },
  "meta": { "requestId": "req_…" }
}
```

- 정렬값 = 그달 커미션 캐시백 적립액(USDT, USDC 1:1). 0.01 USDT 미만·`연동 완료` 아닌 계정은 제외(`rank: null` → `–`). 행에 금액 없음.
- 동점(❓ G-182)·고정 시점(❓ G-183)·월중 출금 영향(❓ G-184).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `month` 형식 오류 |

#### API-015. 완료 출금 통합 피드

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/feed/withdrawals` |
| 설명 | 홈(비로그인 공개 화면)·서비스 소개의 실시간 출금 피드. 성공 확정된 계정별 자동 지급만 시간순으로 준다(자동 지급 완료 = 출금, G-411) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 공개 |
| 관련 기능 | FU-002 · FU-042 · BU-002 · BU-037 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| limit | integer | 선택 | 기본 20, 최대 50 |
| cursor | string | 선택 | 다음 페이지 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "exchangeName": "Lighter", "exchangeType": "DEX", "identifier": "********…51E9", "amount": "35.00", "asset": "USDT", "completedAt": "2026-11-11T04:02:10Z", "status": "SENT" }
  ],
  "meta": { "requestId": "req_…", "nextCursor": "…" }
}
```

- `identifier`는 서버가 마스킹한 공개 표시값이다. DEX는 주소 형식과 무관하게 `********…` 뒤에 원문 마지막 4자를 대소문자 그대로 붙인다. CEX UID는 기존 마스킹을 적용한다. 로그인 여부와 관계없이 원문 식별자는 응답에 포함하지 않는다. 실패·처리 중·결과 불명은 반환하지 않는다(G-137 확정: 완료 건만(원본) — 실패 사유 미표시). tx 해시 공개·실시간 방식(폴링/SSE) 미정 — 결정 전 tx 해시 미포함, 폴링.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 503 | `SERVICE_UNAVAILABLE` | 피드 조회 실패 → 프론트 오류 + 다시 불러오기 |

#### API-016. 글로벌 리그 참가·수령 계정 후보

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/global-leagues/{leagueId}/selectable-accounts` |
| 설명 | 리그 참가 계정 선택 목록에 DEX 지갑을 포함해 준다(보상은 참가 계정으로 지급, G-187) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 로그인 |
| 관련 기능 | FU-064 · BU-057 |

> 기존 API: 기존 `league` 도메인의 「UID simple list」 API다. 경로 문자열은 확인하지 못했다.

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| leagueId | string | 필수 | path |
| purpose | string | 필수 | `PARTICIPATE` / `RECEIVE_REWARD` |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "groups": [
      { "exchangeType": "DEX", "accounts": [ { "accountId": "acc_8f21c0", "exchangeName": "EdgeX", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "selectable": true } ] }
    ],
    "locked": false
  },
  "meta": { "requestId": "req_…" }
}
```

- 참가 계정은 리그 거래소의 `연동 완료` 계정만, P1~P3 동안 변경 불가(`locked: true`). 수령 계정이 참가 계정과 같아야 하는지 G-187 확정: 참가 계정과 동일(기존 MAX-8 · MAX-10 구조).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `NOT_FOUND` | 없는 리그 |

#### API-017. 쿠폰 적용

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/coupon/use-coupon` · 적용 가능 계정 조회 `/coupon/get-member-uid-coupon-availability` |
| 설명 | 쿠폰을 거래 계정(DEX 지갑 포함)에 적용해 그 계정의 이벤트 리워드로 적립한다. 적용 후 계정 변경 불가 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준) |
| 권한 | 로그인 |
| 관련 기능 | FU-009 · FU-070 · BU-009 · BU-063 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | UUID(중복 적용 1회) |
| couponId | string | 필수 | 쿠폰 ID. 요청 위치(본문 · 쿼리)는 기존 `/coupon/use-coupon` 라우터 기준 ⚠ — 경로 변수 아님 |
| accountId | string | 필수 | 적용할 거래 계정 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": { "couponId": "cp_…", "accountId": "acc_8f21c0", "amount": "3.00", "credited": "EVENT_REWARD", "appliedAt": "2026-11-11T05:00:00Z" },
  "meta": { "requestId": "req_…" }
}
```

- **발급과 사용을 나눈다.** `LINK UID` 첫 연동 쿠폰은 **CEX UID 첫 연동에서만 발급**한다(DEX 지갑 연동은 발급하지 않음, 발급은 이 API가 아님). 이미 보유한 `LINK UID` 쿠폰은 **DEX 지갑(연동 완료)에 적용할 수 있다**(REQ-397).
- 예: `LINK UID` 쿠폰(3 USDT)을 EdgeX 지갑에 적용 → `200`, `{ "couponId": "cp_link_…", "accountId": "acc_8f21c0", "amount": "3.00", "credited": "EVENT_REWARD" }` · 챌린지 쿠폰을 `연동 완료` DEX 지갑에 적용 → `200`(챌린지는 CEX·DEX 모두, REQ-403) · 확인 중 지갑에 적용 → `422 COUPON_ACCOUNT_NOT_ELIGIBLE`.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `NOT_FOUND` | 없는 쿠폰·남의 쿠폰 |
| 409 | `CONCURRENT_REQUEST` | 이미 사용된 쿠폰 |
| 422 | `COUPON_ACCOUNT_NOT_ELIGIBLE` | `연동 완료` 아님 · 이슈 계정 |

#### API-019. 파트너 허브 계정 목록·지표

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/partner/partner-info-main` |
| 설명 | 파트너 허브 `Linked Accounts` 카드·연동 계정 모달·퍼널 지표에 DEX 지갑 수와 하위 DEX 실적을 포함해 준다 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준) |
| 권한 | 로그인(파트너) |
| 관련 기능 | FU-077 · FU-080 · BU-069 · BU-071 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| memberId | string | 선택 | 하위 회원 연동 계정 모달용 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "linkedAccounts": { "total": 198, "byExchange": [ { "exchangeName": "Lighter", "exchangeType": "DEX", "count": 12, "unit": "wallets" } ] },
    "funnel": { "registered": 500, "accountLinked": 240, "cashbackRecipients": 120, "linkRate": "48.00" },
    "rewardMetrics": { "includesDex": true }
  },
  "meta": { "requestId": "req_…" }
}
```

- `accountLinked` = UID + 지갑 합산. 모달 구조 G-394 확정: `{n} Accounts` / `{n}개 계정`.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 403 | `FORBIDDEN` | 파트너 아님 |

#### API-020. 퀴즈 제출

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/quizzes/{quizId}/submit` |
| 설명 | DEX 퀴즈(Beginner's Guide 4·5) 답안을 채점하고 최초 채점 결과를 기록한다. 보상 대상이면 퀴즈 쿠폰을 한 번 발급하며, 쿠폰 사용 시 이벤트 리워드가 적립된다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 로그인(비로그인은 답을 유지한 채 로그인 요청, REQ-446) |
| 관련 기능 | FU-009 · FU-073 · BU-009 · BU-066 |

> 기존 API: 기존 `quiz` 도메인의 정답 확인(correct check) API다. 경로 문자열은 확인하지 못했다.

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | UUID(G-350) |
| quizId | string | 필수 | path |
| answers | object[] | 필수 | 모듈 4·5는 문항별 `questionNo`와 선택한 보기의 고정 `choiceId`를 보낸다. 두 문항 모두 한 번씩 포함해야 한다. 기존 고정 순서 화면의 `choice` 숫자는 해당 콘텐츠의 원본 보기 순서로 해석한다 |

DEX 요청 예시. 보기 ID는 설명용이며 실제 값은 퀴즈 콘텐츠에서 받는다.

```json
{ "answers": [ { "questionNo": 1, "choiceId": "q4_1_b" }, { "questionNo": 2, "choiceId": "q4_2_a" } ] }
```

보기 순서를 섞어도 ID는 유지한다. 서버는 해당 문항에 속한 보기인지 검사한 후 ID로 채점한다. 정답 ID와 해설은 채점 완료 응답에만 포함한다. 프론트는 `correctChoiceId`로 해설의 보기를 표시한다.

**Response (200 OK)**

```json
{
  "status": "success",
  "data": { "score": 1, "total": 2, "results": [ { "questionNo": 1, "correct": true, "correctChoice": 2, "correctChoiceId": "q4_1_b", "explanation": "…" }, { "questionNo": 2, "correct": false, "correctChoice": 3, "correctChoiceId": "q4_2_c", "explanation": "…" } ], "completed": true, "rewardGranted": true, "reward": { "type": "COUPON", "couponId": "cp_…" }, "firstCompletion": true },
  "meta": { "requestId": "req_…" }
}
```

- `results[]` = 문항별 정답 여부 · 정답 보기 · 해설(REQ-445). 정답 정보는 **제출 응답에만** 있고 제출 전 화면·응답에는 없다. 보상은 현행 Beginner's Guide 퀴즈 방식(정답 시 퀴즈 쿠폰 발급 → 지정 거래소 계정에서 사용 시 이벤트 리워드, G-206). 단계 금액은 API-136 설정.
- DEX 모듈 4·5는 점수와 관계없이 최초 채점 완료 후 재응시할 수 없다(G-205·207). 이미 완료한 회원의 새 제출은 저장된 결과를 반환한다(`firstCompletion: false`, `rewardGranted: false`). 새 답으로 다시 채점하지 않는다. 동일 키·동일 요청 재전송은 공통 멱등성 규칙을 따른다. 제출에 실패해 완료 기록이 없으면 선택한 답으로 재시도할 수 있다.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 미응답·중복 문항 또는 해당 문항에 속하지 않는 보기 |
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `NOT_FOUND` | 없는 퀴즈 |

#### API-021. 이벤트 목록

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | `/guest/get-total-event-list` · `/guest/get-exchange-event-list` |
| 설명 | 3탭(`Special Events` · `Exclusive` · `Exchange Events`)에 DEX 이벤트를 포함하고 거래소 그룹 필터를 지원한다 |
| 구분 | 기존·변경 — 기존 엔드포인트(LLM_wiki 앱 바이너리·Postman 맵, 2026-07-23 기준) |
| 권한 | 공개 |
| 관련 기능 | FU-006 · FU-072 · BU-006 · BU-065 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| tab | string | 필수 | 기존 값(테더맥스 전용 / 거래소) |
| scope | string | 선택 | `ExchangeScope` |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "eventNo": 501, "title": "…", "exchangeName": "Lighter", "exchangeType": "DEX" } ], "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | `scope` 값 오류 |

#### API-022. 거래소 리뷰 작성

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/details/{id}/comments` |
| 설명 | 기존 상세 댓글(리뷰) 작성 API의 작성 자격을 넓힌다: 그 거래소 계정이 `연동 완료`인 회원(CEX UID 또는 DEX 지갑, 확인 중 계정 불가)을 서버가 재검사. 답글(`POST /api/comments/{id}/replies`)도 같은 자격 |
| 구분 | 기존·변경 — 기존 거래소 상세 댓글(리뷰) API(Project 4). 작성 자격에 DEX 지갑 `연동 완료` 추가 |
| 권한 | 로그인 |
| 관련 기능 | FU-058 · BU-051 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| id | string | 필수 | path. 기존 상세 리소스 ID |
| 기존 필드 | — | 필수 | 기존 댓글(리뷰) 필드 그대로(본문 1,000자 등). 1 TUID = 상세당 최상위 댓글 1개(기존 규칙) |

**Response (201 Created)**

```json
{ "status": "success", "data": { "reviewId": "rv_…", "verified": true }, "meta": { "requestId": "req_…" } }
```

- `verified` = `연동 완료`면 `true`(`✓ Verified`, CEX·DEX 같은 규칙).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 403 | `REVIEW_NOT_ELIGIBLE` | `연동 완료` 계정 없음 |

#### API-025. 소유권 신청 — DEX 지갑 (녹화 업로드·제출)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/possession/init-possession-request` |
| 설명 | 다른 회원이 연동한 지갑에 대한 소유권 신청을 만든다. 기존 CEX 소유권 신청 API에 DEX 지갑 식별(거래소 + 지갑 주소)을 더한다. 녹화 파일은 바이러스 검사를 통과해야 심사 큐에 들어간다 |
| 구분 | 기존·변경 |
| 권한 | 로그인(게스트 불가) |
| 관련 기능 | FU-026 · FU-027 · BU-026 · BU-027 |

> 기존 API: 앱 API 맵의 `possession` 도메인(`/possession/init-possession-request`). 계약은 기존 CEX 신청과 같고 아래 필드만 더한다.

**Request** (추가·변경 필드만)

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | DEX 거래소 |
| walletAddress | string | 필수 | trim 후 원문을 보존하며 형식별 비교 규칙으로 확인(G-062) |
| recording | file | 필수 | MP4·MOV, 최대 1GB(기존 CEX 업로드 규칙) |

**Response (200 OK)**

```json
{ "status": "success", "data": { "possessionNo": 9123, "exchangeNo": 41, "walletAddress": "0x7a3F…51E9", "status": "PROCESSING", "requestedAt": "2026-11-24T03:10:00Z" }, "meta": { "requestId": "req_…" } }
```

- 신청 생성 = 홈 `소유 확인중`(우선순위 1). 관리자 응답이 10분 안에 없으면 자동 실패(기존 CEX 규칙).
- `소유 확인중` · `소유 확인 실패` 행은 통합 연동 한도를 점유한다(REQ-731).
- 응답의 `walletAddress`는 예시 표기다. 실제 응답은 전체 주소.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 주소 형식 오류 · 파일 형식(MP4·MOV 아님) · 1GB 초과 |
| 409 | `FAILED_RECENT_POSSESSION` | 그 지갑의 마지막 소유권 승인 후 30일 이내(기존 코드) → `Ownership Claim Unavailable` |
| 409 | `INTEGRATION_MAX_COUNT_OVER` | 통합 연동 한도 도달(기존 코드) |
| 409 | 기존 중복 제출 코드 | 같은 신청 연타 · 진행 중 신청 있음 — 제한 규칙은 기존 그대로(G-434) |
| 422 | 기존 코드 | 지갑이 다른 회원의 `확인 중` 상태 — 허용 여부 ❓ G-435 |
| 500 | `INTERNAL_ERROR` | 업로드·바이러스 검사 실패 → `Something Went Wrong`, 신청 생성 안 함 |

#### API-026. 소유권 신청 상태 조회 (DEX 지갑 포함)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/possession/get-possession-status` |
| 설명 | 회원의 소유권 신청 상태와 소유권 이전으로 해제된 행을 조회한다. 기존 CEX 조회에 DEX 지갑 행을 더한다. 조회 시점은 기존 CEX 방식(정해진 분 단위 조회 · 새로고침 시 즉시 조회) |
| 구분 | 기존·변경 |
| 권한 | 로그인 |
| 관련 기능 | FU-026 · FU-027 · FU-028 · BU-026 · BU-027 · BU-028 |

**Response (200 OK)** (DEX 행 예)

```json
{ "status": "success", "data": { "items": [ { "possessionNo": 9123, "exchangeNo": 41, "exchangeType": "DEX", "walletAddress": "0x7a3F…51E9", "status": "PROCESSING", "requestedAt": "2026-11-24T03:10:00Z" }, { "possessionNo": 9001, "exchangeNo": 42, "exchangeType": "DEX", "walletAddress": "0x19aB…77C0", "status": "DISPLACED", "reason": null } ] }, "meta": { "requestId": "req_…" } }
```

| status | 화면 |
|---|---|
| `PROCESSING` | 금액 `-` · `소유 확인중` · `Ownership verification in progress · {경과 시간}` |
| `APPROVED` | `Ownership Verification Complete` 다이얼로그 → 행 `연동 완료` |
| `REJECTED` | `소유 확인 실패` · `Ownership Verification Unsuccessful`. 재청구 거절이면 `reason`(심사자 사유 그대로) |
| `DISPLACED` | 이전 보유자 행 `연동 해제`(소유권 이전) · `This wallet has been unlinked. Tap to verify ownership and reclaim it.` |

- 상태 값 이름은 기존 CEX 응답 값을 그대로 쓴다. 위 표는 화면 대응을 보이기 위한 것.
- 실패 행 처리(기존 `/possession/update-failed-possession`)도 지갑 행을 받도록 확장하며 용도는 기존 그대로.
- 응답의 `walletAddress`는 예시 표기다. 실제 응답은 전체 주소.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 로그인 안 함 |

### 기존 맥스보드 사용자 API의 DEX 변경

기존 계약(`_맥스보드_원본/분할문서/사용자/API스펙_ko.md`)은 그대로 두고 아래만 바꾼다. 필드 이름을 유지하고 값만 지갑 주소로 담을지, 중립 이름으로 바꿀지 G-315 확정: 이름 유지 + 값만 지갑(하위 호환) — **이 문서는 이름 유지안을 기본으로 적는다.** `UID_*` 에러 코드 재사용 G-316 확정: `UID_*` 재사용 + 프론트가 보드 거래소 유형으로 문구 분기(재사용 시 프론트가 보드 거래소 유형으로 문구 분기).

#### MB-API-002. 맥스보드 상세 (DEX 보드)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}` |
| 설명 | DEX 보드에서 `exchange.code`·`exchange.name`이 DEX 값이 된다. `batchDelayed`는 DEX 원장 완료 상태(JOB-D14)로 판정 |
| 구분 | 기존·변경 |
| 권한 | 공개 |
| 관련 기능 | FU-065 · FU-066 · FU-068 · BU-058 · BU-059 · BU-061 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| boardId | string | 필수 | path(기존) |
| lang | string | 선택 | 기존 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "boardId": "mb_…", "exchange": { "code": null, "name": "ApeX", "type": "DEX" }, "batchDelayed": false }, "meta": { "requestId": "req_…" } }
```

- DEX `exchange.code` 값 G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙)(결정 전 `null`, 로고는 프론트 기존 리소스를 거래소 번호로 매핑). 추가 필드 `exchange.type`(`CEX`/`DEX`) — 프론트 문구 분기용(지갑 문구, REQ-646). 나머지 필드는 기존 그대로.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `BOARD_NOT_FOUND` | 기존 그대로 |

#### MB-API-003. 맥스보드 참여 자격 (지갑)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/eligibility` |
| 설명 | DEX 보드의 `eligibleUids[].uid`에 지갑 주소(입력 그대로)를 담는다. 자격 = `연동 완료` 지갑 · 보드 DEX의 지갑 · 최초 등록일 조건 · 이 보드 참여 기록 없음 · 이슈 지정 아님 |
| 구분 | 기존·변경 |
| 권한 | 공개(비회원 `GUEST`) |
| 관련 기능 | FU-067 · FU-068 · BU-060 · BU-061 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| boardId | string | 필수 | path |

**Response (200 OK)**

```json
{ "status": "success", "data": { "state": "NOT_REGISTERED", "eligibleUids": [ { "uid": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9" } ], "eligibilityRule": { "uidRegisteredOnOrAfter": "2026-10-09" }, "resetUid": null, "resetAt": null, "resetReason": null }, "meta": { "requestId": "req_…" } }
```

- 확인 중 지갑은 `eligibleUids`에 없음. 다른 DEX에 연동된 같은 주소는 제외. `resetReason`은 CEX와 같음(`OWNERSHIP_TRANSFER` · `ISSUE_UID`) — 소유권 이전 시 이전 회원 참여는 `RESET`, 새 회원에게 승계되지 않음. 최초 등록일 정의 G-314 확정: ② 연동 시점(G-436 「연동 후」와 같은 기준).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `BOARD_NOT_FOUND` | 기존 그대로 |

#### MB-API-004. 맥스보드 참여 지갑 등록

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/maxboard/boards/{boardId}/participation` |
| 설명 | body `uid`에 지갑 주소를 담아 등록한다. `eligibleUids` 값과 문자열이 같아야 한다(저장은 입력 그대로, 비교는 주소 형식별 규칙 — G-062) |
| 구분 | 기존·변경 |
| 권한 | 로그인 |
| 관련 기능 | FU-067 · FU-068 · BU-060 · BU-061 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| uid | string | 필수 | 지갑 주소(`eligibleUids` 중 1개) |
| confirmed | boolean | 필수 | 등록 확인(DEX 문구 `새 지갑을 선택하면 …`) |

**Response (201 Created)**

```json
{ "status": "success", "data": { "participantId": "mbp_…", "uid": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "participantStatus": "PARTICIPATING" }, "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 409 | `PARTICIPATION_RESET` · `ALREADY_PARTICIPATING` · `PHASE_NOT_PARTICIPATION` · `CONCURRENT_REQUEST` | 기존 그대로 |
| 422 | `UID_NOT_LINKED` | 지갑 미연동 **또는 확인 중** |
| 422 | `UID_EXCHANGE_MISMATCH` | 다른 DEX에 연동된 같은 주소 포함 |
| 422 | `UID_REGISTERED_TOO_EARLY` | 최초 등록일 조건(정의 G-314 확정: ② 연동 시점(G-436 「연동 후」와 같은 기준)) |
| 422 | `UID_ALREADY_PARTICIPATED` | 이 보드 참여 기록 있음 |
| 422 | `UID_ISSUE_DESIGNATED` | 이슈 지정 지갑(개념 G-078 확정: 이슈 지갑을 별도 상태로 둔다(ApeX AID 미반환 · 제한 IP 거래). 맥스보드 REQ-114·115 적용) |

#### MB-API-005. 맥스보드 내 현황

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/me` |
| 설명 | `participation.uid`에 지갑 주소. 게이지·연속 칸은 DEX 원장 반영일 기준 |
| 구분 | 기존·변경 |
| 권한 | 로그인 |
| 관련 기능 | FU-065 · FU-068 · BU-058 · BU-061 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| boardId | string | 필수 | path |

**Response (200 OK)**

```json
{ "status": "success", "data": { "participation": { "uid": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "status": "PARTICIPATING" } }, "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `BOARD_NOT_FOUND` | 기존 그대로 |

## 추적성

- 이 문서의 모든 엔드포인트는 사용자 기능명세서(FU · BU)의 기능 하나 이상에서 참조됩니다. 「관련 기능」은 기능명세서 4종의 「관련 API」를 역으로 모은 값입니다(조립 스크립트 확인).
- 비기능 요구사항(성능·캐시 무효화·식별자 보호 등)은 「API 공통 사항」에 반영했고 원문은 요구사항정의서 2장입니다.
- 자동 지급 · 어드민 · 웹훅 · 내부 작업 · 파트너 API는 `API스펙_백오피스.md`에 있습니다.
