# API 스펙 — 백오피스

프로젝트명: TetherMax DEX 캐시백 연동 (Lighter · ApeX · EdgeX · Aster)
작성일: 2026-11-24
버전: v1.0
읽는 사람: 백오피스 화면 API · 파트너 수집(웹훅·폴링) · 10분 주기 자동 지급 · 온체인 지급 · 알림 등 공통 백엔드를 구현하는 백엔드와 백오피스 프론트엔드
입력: `02.기획문서/요구사항정의서.md` v1.1 · 기능명세서 4종(`프론트_기능명세서_사용자.md` · `백엔드_기능명세서_사용자.md` · `프론트_기능명세서_백오피스.md` · `백엔드_기능명세서_백오피스.md`) · 정책 `00_DEX_최종정책.md`(기준일 2026-11-16, 특히 6장 · 부록 D-2 · E · E-11) · 기존 맥스보드 API 스펙(`_맥스보드_원본/분할문서/사용자·백오피스/API스펙_ko.md` 1·2장 규약)
짝 문서: `API스펙_사용자.md`(사용자 화면 API) · `프론트_기능명세서_백오피스.md` · `백엔드_기능명세서_백오피스.md` · `정보구조도_백오피스.md`

---

## 0. 읽는 법

**이 문서의 위치** — 기능명세서의 「관련 API」를 엔드포인트 단위로 풀어 Method · URL · Request · Response · 에러 코드를 적었습니다. 이 문서는 **어드민 API · 웹훅 수신 API · 자동 지급이 호출하는 기존 출금 API(API-011 · API-018) · 내부 작업(JOB) · 파트너 API**을 다룹니다. 우선순위는 **정책 > 요구사항정의서 > 기능명세서 > 이 문서**입니다.

**관련 기능 ID** — 기능명세서 4종의 「관련 API」에서 역으로 만든 값입니다: `FU` 프론트·사용자 · `BU` 백엔드·사용자 · `FA` 프론트·백오피스 · `BA` 백엔드·백오피스(공통 처리 포함).

**공통 백엔드** — 원장 수집 · 10분 주기 자동 지급 · 온체인 송금 · 알림처럼 화면 담당이 나뉘지 않는 서버 처리는 이 문서에 둡니다. 사용자 화면이 읽는 잔액·요약 API는 `API스펙_사용자.md`에 있습니다.

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
| Base URL | 어드민 `/api/admin` · 파트너 웹훅 수신 `/api/webhooks` · 기존 맥스보드 어드민 `/api/admin/maxboard` · 내부 호출 기존 API(API-011 · API-018)는 기존 경로 |
| 인증 방식 | 어드민 = 기존 백오피스 세션 + 역할(`Master`·`Operator`·`PM`·`CS`) + capability. 웹훅 = 파트너 서명 검증(+ ApeX IP 허용 목록). 내부 작업(JOB) = 서버 내부 호출, 외부에 열지 않음 |
| 응답 형식 | JSON (`Content-Type: application/json; charset=utf-8`). 파일 다운로드만 `text/csv`. 성공 `{ "status": "success", "data": …, "meta": { "requestId": "…" } }` · 실패 `{ "status": "error", "error": { "code", "message", "details" }, "meta": { … } }` · 목록은 `meta.pagination { page, size, totalCount, totalPages }`(`page` 1부터, `size` 기본 20 · 최대 100) |
| 시간 | 모든 일시는 **UTC ISO-8601**(`2026-11-11T03:20:00Z`), 날짜만 필요한 값은 `YYYY-MM-DD`(UTC). 백오피스 화면 표기는 기존 백오피스 규칙 |
| 금액 | 사용자 노출 금액 = **USDT, 소수 둘째 자리 절삭된 10진 문자열**(`"12.50"`). 부동소수점 숫자 타입 금지. 파트너 원장 금액은 **전체 정밀도 10진 문자열 + `currency`**(어드민·내부 전용, REQ-186) |
| 식별자 | 지갑 주소는 **입력·저장된 그대로**(대소문자 보존) 내려 준다. **지갑 주소·UID·DEX 계정 ID를 URL 경로·쿼리스트링에 넣지 않는다**(REQ-018) — 계정은 내부 `accountId`로 가리키고, 지갑·UID로 찾는 어드민 조회는 `POST …/search` 본문으로 보낸다. 사용자 API는 DEX 계정 ID를 응답에 넣지 않는다(REQ-017) |
| 멱등 | 자동 지급 신청(API-011 · API-018)은 회원 · 주기 단위 `Idempotency-Key`와 계정 선차감으로 신청 1건 · 차감 1회 · 지급 1회(REQ-160, API-011 중복 방지 규칙). 원장 저장은 파트너 레코드 ID 멱등, 웹훅은 이벤트 ID 멱등. 같은 키 + 다른 본문은 `409 IDEMPOTENCY_KEY_REUSED` 운영자 금액 변경(API-112 정정 · API-125 지급·회수)도 `Idempotency-Key` 필수 — 응답 유실 뒤 같은 키로 재시도하면 처음 만든 결과를 돌려주고 잔액은 한 번만 변한다. 의도적인 같은 금액 재처리는 새 키 |
| 동시 편집 | 어드민 편집 API는 요청에 `version`을 받고, 다르면 `409 VERSION_CONFLICT`(`details.changedBy`·`changedAt`) — REQ-485 |
| 감사 | 어드민 쓰기 API는 감사 레코드와 같은 트랜잭션으로 커밋한다. 감사 기록 실패 시 작업 전체 롤백(`500 AUDIT_WRITE_FAILED`) — REQ-493 |
| 서버 검증 | 서버는 클라이언트 검증을 전부 반복하고 같은 사유 코드를 반환하며, 실패 시 아무것도 저장하지 않는다. UI에서 막힌 행위는 API로도 우회할 수 없다(REQ-264) |
| 캐시 무효화 | 거래소 레코드·콘텐츠·Spending Estimate 저장 시 사용자 공개 API 캐시를 **즉시 무효화**(시간 만료 아님, REQ-260) |

## 공통 에러 코드

| HTTP 상태 코드 | 에러 코드 | 설명 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 형식 오류·필수값 누락. 세부는 `details.fields[].code` |
| 400 | `INVALID_AMOUNT` | 금액이 10진 문자열이 아니거나 허용 자릿수 초과 |
| 400 | `CONFIRMATION_REQUIRED` | 확인 팝업이 필요한 작업에서 `confirmed: true` 누락 |
| 401 | `UNAUTHORIZED` | 백오피스 로그인 필요 |
| 403 | `FORBIDDEN` | 권한 없음. `details.capability`에 필요한 권한(REQ-482) |
| 404 | `NOT_FOUND` | 리소스 없음, 또는 요청자에게 보이지 않는 리소스(남의 계정·비게시 거래소) |
| 409 | `CONCURRENT_REQUEST` | 같은 대상의 처리 중 요청과 충돌. 재조회 후 다시 시도 |
| 409 | `IDEMPOTENCY_KEY_REUSED` | 같은 `Idempotency-Key`에 다른 본문 |
| 409 | `VERSION_CONFLICT` | 편집 대상 버전 불일치 |
| 429 | `RATE_LIMITED` | 호출 제한 초과. `Retry-After` 헤더 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |
| 500 | `AUDIT_WRITE_FAILED` | 감사 기록 실패로 작업 롤백 |
| 503 | `SERVICE_UNAVAILABLE` | 의존 시스템(잔액·원장·파트너 API) 일시 장애 |

### 도메인 에러 코드 — 자동 지급

회원이 신청하는 흐름의 기존 코드 `VERIFICATION_REQUIRED` · `VERIFICATION_FAILED` · `WITHDRAW_EMAIL_24H` · `WITHDRAW_AFTER_PASSWORD_72H` · `IP_EMAIL_VERIFY_1H`는 자동 지급 호출에서 검사하지도 반환하지도 않는다(REQ-155·156).

| HTTP | 에러 코드 | 조건 |
|---|---|---|
| 422 | `NO_ELIGIBLE_ACCOUNT` | 신청 시점 재계산 결과 자격 계정 0(REQ-159) |
| 422 | `PAYOUT_NETWORK_NOT_SET` | 지급 네트워크 미설정 상태의 DEX 지갑(그 계정은 지급하지 않음, REQ-142) |
| 500 | `WITHDRAWAL_CREATE_FAILED` | 신청 생성 실패, 아무것도 차감하지 않고 다음 주기에 재확인(REQ-161) |
| 422 | `INVITATION_REWARD_BELOW_MINIMUM` | 초대 리워드 10 USDT 미만 |
| 422 | `DESTINATION_NOT_ALLOWED` | 목적지가 그 회원의 활성 연동 계정이 아님 |

### 도메인 에러 코드 — 어드민·수집

| HTTP | 에러 코드 | 조건 |
|---|---|---|
| 422 | `EXCHANGE_TYPE_REQUIRED` | `Exchange Type` = `None` 저장 |
| 422 | `WALLET_FORMAT_RULE_UNDEFINED` | 검증 규칙이 정의되지 않은 지갑 형식 선택 |
| 422 | `URL_NOT_HTTPS` | URL이 `https://`로 시작하지 않음 → `Enter a valid https:// URL` |
| 422 | `REFERRAL_CODE_INVALID` | 파트너 검증 결과 무효 코드(ApeX `is_valid false`) |
| 422 | `FILE_TOO_LARGE` · `FILE_TYPE_NOT_SUPPORTED` · `FILE_UNREADABLE` | 업로드 오류 → `File exceeds {limit}` · `File type not supported` · `File could not be read` |
| 409 | `UPLOAD_INCOMPLETE` | 미완료 업로드를 참조한 저장 |
| 422 | `ATTRIBUTION_NOT_CONFIRMED` | 귀속 원장에 없는 지갑의 수동 연동 승인 |
| 409 | `ALREADY_ACTIONED` | 다른 운영자가 먼저 처리 → `Already actioned by {admin}` |
| 409 | `NOT_ATTRIBUTION_PENDING` | 귀속 확인 대기가 아닌 연동(연동 전 잔액 송금 대기 등)에 승인·거절 요청(REQ-722) |
| 409 | `POLL_IN_PROGRESS` | 같은 DEX 수집이 실행 중 |
| 422 | `TEMPLATE_MISMATCH` | 가져오기 파일이 템플릿 형식이 아님(파일 전체 거부) |
| 409 | `FILE_ALREADY_IMPORTED` | 같은 파일 재업로드 → `This file was already imported on {date} by {admin}` |
| 409 | `IMPORT_IN_PROGRESS` | 같은 DEX·기간 동시 가져오기 → `Import in progress by {admin}` |
| 409 | `WEEK_ALREADY_IMPORTED` | 이미 가져온 주차(교체는 `replace: true` + 사유 필수) |
| 422 | `AMOUNT_EXCEEDS_BALANCE` | 회수 금액 > 계정 잔여 |
| 401 | `SIGNATURE_INVALID` | 웹훅 서명 불일치 |
| 403 | `IP_NOT_WHITELISTED` | 웹훅 발신 IP가 허용 목록 밖(ApeX) |
| 400 | `INVALID_EXCHANGE` · `MULTIPLE_EXCHANGES_NOT_ALLOWED` | 기존 맥스보드 생성 검증 코드 |
| 422 | `BATCH_SOURCE_NOT_FOUND` | 기존 맥스보드 복구 코드 — DEX 보드 `batchDate` 재반영 시 그 날짜 파트너 원장(원천)이 없음 → `파트너 원장을 다시 받아 채운 뒤 재시도` |

## 공통 Enum

| Enum | 값 | 의미 |
|---|---|---|
| `ExchangeType` | `CEX` / `DEX` | 거래소 레코드 유형. 생성 기본값 `NONE`은 저장 불가 |
| `AccountKind` | `UID` / `WALLET` | 거래 계정 식별자 종류 |
| `LinkStatus` | 기존 UID 상태 값 그대로 + DEX는 `LINKED`(`연동 완료`) · `MANUAL_LINK_PENDING`(기존 `manual_link_pending`, `연동 시도중이에요`) · `INACTIVE`(DEX 오프보딩) | DEX용 신규 상태 없음(REQ-098). 실제 키 문자열은 기존 상태 키를 따른다 |
| `LinkResult` | `LINKED` / `PROCESSING` | API-007 성공 응답의 결과(실패는 에러 코드) |
| `ProcessingReason` | `PARTNER_LOOKUP` / `PRELINK_PAYOUT` | `PROCESSING`의 이유 — 파트너 귀속 확인 대기 / 연동 전 잔액 출금 대기(REQ-107) |
| `SettlementStatus` | `CREDITED` · `WITHHELD` · `PENDING` · `DATA_PENDING` | DEX 정산 상태 라벨(REQ-047). 전체 enum·전이 G-059 확정: 회원 화면 상태 = `DEX data pending`(미수신, 0 아님) · `Credited` · `Withheld`. Lighter 주중 추정치(`Accruing`)는 회원 화면에 두지 않는다(G-100). 원장의 `Pending`·`Paid`·`Final`은 어드민 전용 |
| `CollectionStatus` | `LIVE` / `DEGRADED` / `MANUAL` / `NOT_INTEGRATED` | DEX별 수집 상태(REQ-201) |
| `WithdrawalStage` | `REQUEST` → `WAIT` → `PROCESSING` → `REVIEW` | 내부 처리 단계. 사용자에게는 하나(「처리 중」) |
| `PayoutStatus` | `PROCESSING` / `SENT` / `FAILED` | 계정별 지급 상태 |
| `SummaryRowType` | `EXCHANGE_CASHBACK` · `EVENT_REWARD` · `WITHDRAWAL` · `WITHDRAWAL_RETURNED` | 캐시백 요약 행 유형 |
| `WebhookResult` | `PROCESSED` / `DUPLICATE` / `REJECTED` | 웹훅 처리 결과 |
| `ExchangeScope` | `ALL` / `CEX` / `DEX` / 거래소 코드 | 그룹 드롭다운 범위 선택 값(REQ-030) |
| `exchangeCode` | 기존 CEX 예 `BITGET`·`OKX` / DEX 값 G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙) | 거래소 코드. DEX 4곳 값이 정해지기 전에는 `exchangeNo`로 식별 |

## API 엔드포인트 목록

엔드포인트 37개 + 내부 작업 14개.

| API-ID | Method | URL | 기능명 | 관련 기능 ID | 구분 | 상태 |
|---|---|---|---|---|---|---|
| API-011 | 기존 | `/payback/member-payback-init-withdrawal` | 출금 신청 (자동 지급 호출, CEX·DEX 통합) | BA-015 · BA-016 · BA-017 · BA-019 · BA-036 | 기존·변경 | ❓ G-044 |
| API-018 | 기존 | 기존 초대 리워드 출금 API | 초대 리워드 출금 (자동 지급) | FA-022 · BA-052 | 기존·변경 ⚠경로 | G-056 확정: 제휴사(A)도 DEX 지갑을 고정 지급 계정으로 지정할 수 있다 — V2는 테더맥스가 Wallet B로 DEX 지갑에 지급하므로 CEX 전용 제한을 없앤다 |
| API-101 | GET | `/api/admin/exchanges` | 거래소 관리 목록 | FA-025 · FA-026 · FA-028 · FA-033 · FA-040 · FA-059 · FA-062 · FA-069 · BA-056 · BA-057 · BA-059 · BA-064 · BA-071 · BA-090 · BA-093 · BA-099 | 기존·변경 ⚠경로 | 확정 |
| API-102 | POST | `/api/admin/exchanges` | 거래소 생성 (Exchange Type 필수) | FA-025 · FA-034 · BA-056 · BA-065 | 기존·변경 ⚠경로 | G-246 확정: 브로커 2건 · test 행 모두 `CEX`로 백필하고 비활성 유지 |
| API-103 | PUT | `/api/admin/exchanges/{exchangeNo}` | 거래소 수정 (DEX 필드·DEX별 설정) | FA-027 · FA-034 · FA-035 · FA-036 · FA-037 · FA-038 · FA-039 · FA-041 · BA-020 · BA-026 · BA-058 · BA-065 · BA-066 · BA-067 · BA-068 · BA-069 · BA-070 | 기존·변경 ⚠경로 | G-393 확정: 일 · 주만 두고 「사용자 표시용 정산 주기, 수집 주기와 별개」 명시 · G-022 · G-031 |
| API-104 | PUT | `/api/admin/exchanges/{exchangeNo}/partner-credentials` | 파트너 API 키 교체 (write-only) | FA-037 · FA-038 · BA-020 · BA-068 · BA-069 | 신규 | 확정 |
| API-105 | POST | `/api/admin/exchanges/{exchangeNo}/partner-credentials/test` | 파트너 API 연결 테스트 | FA-037 · FA-038 · BA-020 · BA-068 · BA-069 | 신규 | 확정 |
| API-106 | PUT | `/api/admin/exchanges/display-order` | 거래소 전역 순위 저장 | FA-027 · FA-033 · BA-058 · BA-064 | 기존·변경 ⚠경로 | 확정 |
| API-107 | POST | `/api/admin/accounts/search` | Account List | FA-028 · FA-035 · FA-044 · FA-047 · BA-059 · BA-066 · BA-075 · BA-078 | 기존·변경 ⚠경로 | G-238 확정: 한 컬럼 `UID / Wallet address` |
| API-108 | POST | `/api/admin/linking-applications/search` | Linking Management (DEX 확인 중 큐) | FA-010 · FA-028 · FA-045 · BA-010 · BA-059 · BA-076 | 기존·변경 ⚠경로 | G-337 확정: `Weekly CSV cut-off` 월요일 23:59 UTC · 2주 미등장 시 `Needs review` + 운영 알림 |
| API-109 | POST | `/api/admin/linking-applications/{applicationId}/decision` | DEX 수동 연동 승인·거절 | FA-005 · FA-010 · FA-045 · FA-047 · BA-005 · BA-010 · BA-011 · BA-076 · BA-078 | 기존·변경 ⚠경로 | G-069 확정: 거절되면 홈 행 제거(한도 점유도 해제) · G-074 확정: `Not a TetherMax referral` · `Bound before program start` · `Ambiguous match not confirmed` · `Other`. `Bound before program start`는 Lighter에서만 허용 |
| API-110 | POST | `/api/admin/linking-audit-logs/search` | 연동 감사 로그 | FA-046 · BA-011 · BA-077 | 신규 | 확정 |
| API-111 | POST | `/api/admin/dex/cashback-records/search` | DEX Cashback Records | FA-050 · FA-051 · BA-021 · BA-023 · BA-081 · BA-082 | 신규 | 원장 필드 = 표준 요건 5필드(G-021) |
| API-112 | POST | `/api/admin/dex/cashback-records/{recordId}/corrections` | 원장 정정 레코드 생성 | FA-050 · BA-024 · BA-081 | 신규 | G-331 확정: 확정 전 직접 수정 불가 · 정정의 정정 허용 · 파트너 음수 정정은 향후 적립에서 상계 · Lighter 정정 레코드 생성 차단 |
| API-115 | POST | `/api/admin/excel/upload` | Lighter 주간 CSV 가져오기 — 제외(G-428) | FA-035 · FA-052 · BA-027 · BA-066 · BA-083 | 기존·변경 ⚠경로 | G-338 확정: UTF-8 · 쉼표 · 50,000행 · 20 MB · ISO 8601 · 소수 6자리 · 동시 잠금 `Import in progress by {admin}` · 재업로드 `This file was already imported on {date} by {admin}` |
| API-116 | GET | `/api/admin/dex/collection-status` | 수집 상태 (Cashback History Status) | FA-049 · BA-025 · BA-080 | 기존·변경 ⚠경로 | G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간 |
| API-117 | POST | `/api/admin/dex/{exchangeNo}/poll` | Poll now (1회 즉시 수집) | FA-049 · BA-080 | 신규 | 확정 |
| API-118 | GET | `/api/admin/dex/webhook-logs` | 웹훅 로그 (ApeX) | FA-049 · BA-025 · BA-080 | 신규 | ❓ G-024 |
| API-121 | POST | `/api/admin/cashback/history/search` | 캐시백 전체 내역 (출금·지급 포함) | FA-028 · FA-048 · FA-054 · BA-034 · BA-059 · BA-079 · BA-085 | 기존·변경 ⚠경로 | 확정 |
| API-124 | GET·PUT | `/api/admin/dex/settings` | DEX 운영 설정값 | FA-055 · BA-015 · BA-026 · BA-030 · BA-033 · BA-086 | 신규 | G-044 · G-117 · G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간 |
| API-125 | POST | `/api/admin/event-rewards` | 이벤트 리워드 지급·회수 | FA-020 · FA-053 · BA-048 · BA-074 · BA-084 | 기존·변경 ⚠경로 | 확정 |
| API-126 | GET | `/api/admin/members/{memberNo}/linked-accounts` | 회원 상세 Linked Accounts | FA-042 · FA-043 · BA-072 · BA-073 | 기존·변경 ⚠경로 | G-237 확정: 분리 표기 `UID {n} · 지갑 {n}` + 필터 `UID만 / 지갑만 / 둘 다` |
| API-127 | GET·PUT | `/api/admin/cashback-products/dex-landing` | DEX Landing Page 콘텐츠·리스트 | FA-027 · FA-064 · FA-065 · BA-058 · BA-094 · BA-095 | 신규 | G-266 확정: 놓으면 자동 저장 + `Saved` + 10초 Undo, 다른 페이지 이동은 `Move to position N`. 값은 전역 순위 · G-002 |
| API-128 | GET·PUT | `/api/admin/cashback-products/exchanges/{exchangeNo}/content` | 거래소 랜딩·상세 콘텐츠 편집 | FA-027 · FA-064 · FA-066 · FA-067 · BA-058 · BA-094 · BA-096 · BA-097 | 신규 | G-366 확정: 운영자 편집 영역도 고정 폴백 문구로 언어팩에 둔다(키 수 재산정은 언어팩 작업 때) 🔴 |
| API-129 | POST | `/api/admin/media` | 미디어 업로드 | FA-064 · FA-067 · BA-094 · BA-097 | 신규 | 일부 미정 |
| API-130 | GET·PUT | `/api/admin/cashback-products/spending-estimate` | Spending Estimate 설정 | FA-027 · FA-068 · BA-058 · BA-098 | 신규 | 확정 |
| API-131 | POST | `/api/admin/messaging/target-count` | 발송 대상 해석 (수동 푸시·이메일 캠페인·쿠폰 발송) | FA-056 · FA-057 · FA-058 · BA-087 · BA-088 · BA-089 | 기존·변경 ⚠경로 | G-240 확정: 회원 수동 캐시백은 DEX 행 포함, 인도네시안 캐시백 내역은 미포함 |
| API-132 | POST | `/api/admin/exports` | 내보내기 | FA-029 · FA-044 · BA-060 · BA-075 | 기존·변경 ⚠경로 | G-232 확정: 10,000행까지 즉시, 초과 시 백그라운드 + 알림 + 7일 만료 링크 · `=` `+` `-` `@` 이스케이프 |
| API-133 | GET | `/api/admin/audit-logs` | 감사 로그 | FA-030 · BA-061 | 기존·변경 ⚠경로 | 확정 |
| API-134 | POST | `/api/admin/global-leagues` | 글로벌 리그 생성 (DEX 운영 거래소) | FA-060 · BA-091 | 기존·변경 ⚠경로 | G-398 확정: 슬러그(`apex` · `edgex` · `aster`) |
| API-135 | GET | `/api/admin/dex/reports` | DEX 리포팅 | FA-026 · FA-055 · BA-030 · BA-057 · BA-086 | 신규 | 일부 미정 |
| API-136 | 기존 | 기존 퀴즈 이벤트 등록·수정 API | 퀴즈 이벤트 설정 (DEX 거래소 · 점수별 보상) | FA-062 · BA-093 | 기존·변경 ⚠경로 | G-205 확정: 콘텐츠(문항·해설·아티클)는 운영 작성 · 보상 단계 금액은 백오피스 설정 · 제출 시 완료(점수 무관), 재응시 없음 |
| API-137 | 기존 | 기존 `Ownership Verification` 큐 조회·승인·거절 API | 소유 확인 큐 — DEX 지갑 신청 포함 | FA-047 · BA-013 · BA-078 | 기존·변경 ⚠경로 | G-063 확정: 1차 출시 미도입 — 기존 CEX처럼 캡차만. REQ-073 다이얼로그·어드민 제한 타입 추가 안 함 |
| MB-API-115 | GET | `/api/admin/maxboard/exchanges` | 맥스보드 생성 거래소 목록 | FA-019 · FA-061 · BA-045 · BA-092 | 기존·변경 | G-317 확정: ① 목록에서 뺌(Lighter 보류 중) · G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙) |
| API-201 | POST | `/api/webhooks/dex/apex` | ApeX 웹훅 수신 | BA-025 · BA-028 | 신규 | ❓ G-024 |
| API-202 | POST | `/api/webhooks/dex/edgex` | EdgeX 웹훅 수신 (로드맵) | BA-025 · BA-029 | 신규 | ⏳ G-033 |
| API-203 | POST | `/api/webhooks/dex/aster` | Aster 웹훅 수신 (요청 단계) | BA-025 | 신규 | ⏳ G-035 |

### 경로 확정 필요 (⚠경로) — 19개

이 목록은 기획 미정 항목이 아니라 **백엔드 연동 작업**입니다(부록 G 미정 건수와 따로 관리). 아래 API는 기능은 이미 있으나 실제 경로를 확인하지 못했습니다. 백엔드 담당이 현재 라우터 기준으로 **Method · 경로 · 인증 주체 · 기존 응답 봉투 · DEX 추가 필드 위치**를 확정해 이 표와 상세에 적어야, 프론트가 실서버와 연동하고 기존 CEX 호출의 회귀를 검증할 수 있습니다. 요청·응답 계약(필드·에러 코드)은 이 문서를 따릅니다.

| API-ID | 기능명 | 이 문서의 경로(설계안) | 확인 단서 |
|---|---|---|---|
| API-018 | 초대 리워드 출금 (자동 지급) | 기존 초대 리워드 출금 API | `inviteReward` 도메인. 앱 API 맵에는 조회 4종(`/inviteReward/get-my-invite-reward-info` 등)만 있고 출금 경로는 없음. 자동 지급 내부 호출의 회원 지정 방식 포함 |
| API-101 | 거래소 관리 목록 | `/api/admin/exchanges` | — |
| API-102 | 거래소 생성 (Exchange Type 필수) | `/api/admin/exchanges` | — |
| API-103 | 거래소 수정 (DEX 필드·DEX별 설정) | `/api/admin/exchanges/{exchangeNo}` | — |
| API-106 | 거래소 전역 순위 저장 | `/api/admin/exchanges/display-order` | — |
| API-107 | Account List | `/api/admin/accounts/search` | — |
| API-108 | Linking Management (DEX 확인 중 큐) | `/api/admin/linking-applications/search` | — |
| API-109 | DEX 수동 연동 승인·거절 | `/api/admin/linking-applications/{applicationId}/decision` | — |
| API-115 | Lighter 주간 CSV 가져오기 — 제외(G-428) | `/api/admin/excel/upload` | 기존 `Excel > Upload` 처리 경로 |
| API-116 | 수집 상태 (Cashback History Status) | `/api/admin/dex/collection-status` | — |
| API-121 | 캐시백 전체 내역 (출금·지급 포함) | `/api/admin/cashback/history/search` | — |
| API-125 | 이벤트 리워드 지급·회수 | `/api/admin/event-rewards` | — |
| API-126 | 회원 상세 Linked Accounts | `/api/admin/members/{memberNo}/linked-accounts` | — |
| API-131 | 발송 대상 해석 (수동 푸시·이메일 캠페인·쿠폰 발송) | `/api/admin/messaging/target-count` | — |
| API-132 | 내보내기 | `/api/admin/exports` | — |
| API-133 | 감사 로그 | `/api/admin/audit-logs` | — |
| API-134 | 글로벌 리그 생성 (DEX 운영 거래소) | `/api/admin/global-leagues` | — |
| API-136 | 퀴즈 이벤트 설정 (DEX 거래소 · 점수별 보상) | 기존 퀴즈 이벤트 등록·수정 API | — |
| API-137 | 소유 확인 큐 — DEX 지갑 신청 포함 | 기존 `Ownership Verification` 큐 조회·승인·거절 API | 기존 `Account > Ownership Verification`(`/UID/ownership`) · `/UID/restrict` 화면이 쓰는 API |

### 두지 않는 API · 작업

| ID | 이름 | 이유 |
|---|---|---|
| API-113 · API-114 | 미매칭 큐 조회 · 수동 매칭·해제 | 미매칭 큐를 두지 않음. 연동 전 레코드는 미연동 지갑 적립분으로 보관했다가 연동 신청 시 연동 전 잔액 처리(출금 후 연동 또는 이관, REQ-107)하고, 거부 레코드는 API-111에서 확인(REQ-196 · REQ-576) |
| API-122 · API-123 | 지급 운영 현황 · 리밸런싱 기록 | 지급 운영 어드민 화면을 두지 않음 — 리밸런싱 · Wallet B · 가스는 운영팀이 직접 온체인으로 처리(G-218). Wallet B 부족은 운영 알림(JOB-D12) |
| API-119 · API-120 · JOB-D11 | 월간 명세서 업로드 · 대사 결과 조회·차이 처리·월 확정 · Wallet A 일별 대사 | 대사를 두지 않음(사용자 2026-11-24, REQ-224 · REQ-250 · REQ-578). 파트너 원장은 그대로 수집·적립하고 정정 레코드는 API-112로 반영 |
| JOB-D06 | 미매칭 재매칭 | 같은 이유. 연동 신청 시 API-007 · API-109 · JOB-D07이 연동 전 잔액 처리 |

## API 상세

### 자동 지급이 호출하는 기존 API

회원 화면에서는 호출하지 않습니다. 10분 주기 자동 지급(JOB-D15)이 호출합니다.

#### API-011. 출금 신청 (자동 지급 호출, CEX·DEX 통합)

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | 기존 회원 출금 신청 API — STG 웹 번들에서 확인한 경로 `/payback/member-payback-init-withdrawal` |
| 설명 | 기존 출금 신청 API다. 회원 화면에서는 부르지 않고(`Auto Claim` 항상 비활성), **10분 주기 자동 지급(JOB-D15)이 회원마다 1회, 그 회원의 자격 계정을 묶어 호출**한다. 기존 회원 출금이 여러 UID를 한 번에 신청하고 실제 입금은 UID별로 처리하는 방식이다(LLM_wiki `policies/payback-withdrawal.md`). 서버가 호출 시점 값으로 출금 가능액을 다시 계산하고, 자격 계정의 전액을 신청번호 아래 계정별 요청으로 만들어 즉시 선차감·지급 예약한다. 목적지는 연동된 계정 고정(주소·네트워크 입력 없음) |
| 구분 | 기존·변경 — 기존 엔드포인트(STG 웹 번들, 2026-11-16 확인). 백엔드가 현재 코드로 대조 |
| 권한 | 내부 호출(JOB-D15). 회원 세션 호출 경로는 화면에 없음 |
| 관련 기능 | BA-015 · BA-016 · BA-017 · BA-019 · BA-036 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | **회원 · 주기 단위 키**(설계안 `{memberNo}:{주기 시작 시각 UTC}`). 같은 주기의 재시도는 같은 키로 보내 첫 응답을 그대로 받는다(REQ-160) |
| memberNo | string | 필수 | 대상 회원. 기존 API가 세션에서 회원을 얻는 구조면 내부 호출의 회원 지정 방식은 백엔드가 정한다(⚠) |
| accountIds | string[] | 필수 | JOB-D15가 고른 자격 계정. 서버는 이 중 호출 시점에 자격 있는 계정만 처리 |

```json
{ "memberNo": "990001234", "accountIds": ["acc_8f21c0", "acc_1102aa"] }
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "requestNo": "WD-20261111-000123",
    "appliedAt": "2026-11-11T03:20:00Z",
    "items": [
      { "accountId": "acc_8f21c0", "exchangeName": "Lighter", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "amount": "35.00", "cashbackPart": "25.00", "eventRewardPart": "10.00", "status": "PROCESSING" }
    ],
    "skipped": [ { "accountId": "acc_1102aa", "reason": "BELOW_MINIMUM" } ],
    "total": "35.00",
    "isFirstWithdrawal": false
  },
  "meta": { "requestId": "req_…" }
}
```

- 처리: 계정별 재계산(`A + MIN(B, A)` 절삭, 10 미만이면 `skipped`) → 신청번호 아래 계정별 요청 생성 + `withdrawal_pre_deducted` 선차감 + 지급액·가스 예약 → 커밋. 내부 단계 `REQUEST → WAIT → PROCESSING → REVIEW`, 처리 API 실패 시 자동 환원(REQ-169).
- **회원 보안 제한을 적용하지 않는다**: `WITHDRAW_AFTER_PASSWORD_72H` · `WITHDRAW_EMAIL_24H`로 보류하지 않고, 캡차·OTP·이메일 인증 토큰을 받지 않는다(REQ-153·155·156, REQ-258). `withdrawal_captcha_required` · `withdrawal_member_otp_default` 상태를 쓰지 않는다(REQ-168).
- 대상: 회원의 CEX UID · DEX 지갑(확인 중 계정 제외), 모든 CEX. HTX처럼 수동 출금이 필요한 거래소의 CEX 신청은 같은 방식으로 생성되고 관리자가 실제 출금 처리한다(REQ-706).
- 보상 종류별 수령 계정을 서버에서 검증한다(REQ-258). DEX 계정의 송금은 JOB-D10이 계정별 1건으로 처리. 지급 네트워크가 설정되지 않았으면 DEX 지갑은 `skipped`(`PAYOUT_NETWORK_NOT_SET`)로 두고 아무것도 보내지 않는다(REQ-142).
- `skipped`만 있고 `items`가 비면 `NO_ELIGIBLE_ACCOUNT`로 실패(아무것도 차감 안 함). 생성 실패 시에도 차감 없이 다음 주기에 다시 확인한다(REQ-161).
- DEX 지갑은 KYC가 없다. 거래소 KYC 미완료 CEX UID의 처리는 현행 정책(REQ-157, G-415).
- `isFirstWithdrawal` = 첫 출금 혜택 판정용(자동 지급 완료 = 출금, REQ-171).
- `skipped[].reason`: `BELOW_MINIMUM`(재계산 결과 10 USDT 미만 — 이미 선차감돼 0인 경우 포함) · `IN_PROGRESS`(같은 계정의 신청 생성이 동시에 진행 중) · `PAYOUT_NETWORK_NOT_SET` · `NOT_LINKED`(호출 사이 해제·확인 중).

**응답 규칙**

| 상황 | HTTP | `items` | `skipped` | 재시도 |
|---|---|---|---|---|
| 일부 계정만 처리 가능(나머지 충돌 `IN_PROGRESS` · 미달 · 네트워크 미설정 · 해제) | 201 | 처리된 계정 | 나머지 + 사유 | 하지 않음 — `skipped` 계정은 다음 주기에 다시 판정 |
| 모든 계정이 `skipped` | 422 `NO_ELIGIBLE_ACCOUNT`(`details.skipped[]`) | — | 전부 | 하지 않음 — 다음 주기 |
| 같은 `Idempotency-Key` 요청이 아직 처리 중 | 409 `CONCURRENT_REQUEST` | — | — | 같은 키로 잠시 뒤 재시도 → 첫 응답 |
| 같은 키 + 같은 본문(처리 끝남) | 첫 응답 그대로(201 또는 422) | 첫 응답 | 첫 응답 | — |
| 같은 키 + 다른 본문 | 409 `IDEMPOTENCY_KEY_REUSED` | — | — | 하지 않음(호출 버그) |
| 신청 생성 실패 | 500 `WITHDRAWAL_CREATE_FAILED` | — | — | 하지 않음 — 차감 없이 다음 주기 |

**중복 방지 규칙**

1. **계정 단위 보장은 선차감이 한다.** 신청이 생성되면 그 계정의 출금 가능액이 즉시 빠지므로, 같은 계정이 다른 묶음·다음 주기에 다시 들어와도 재계산 결과 `skipped`(`BELOW_MINIMUM`)가 된다.
2. 같은 계정의 신청 생성이 동시에 겹치면 계정 단위 잠금으로 한쪽만 만들고, 다른 쪽의 그 계정은 `skipped`(`IN_PROGRESS`)로 둔다. 묶음 안의 다른 계정은 영향 없다.
3. 응답이 유실되면 JOB-D15는 같은 주기 안에서 **같은 키로** 재시도해 첫 응답(같은 신청번호)을 받는다. 재시도 전에 다음 주기가 돌아도 1번 규칙으로 새 신청이 생기지 않는다.
4. DEX 송금은 JOB-D10이 계정별 1건만 실행한다(모든 재시도에서 최대 1회).

> ⚠ 백엔드 확인: 기존 API가 계정 단건 규약이면 JOB-D15가 계정마다 호출하고 키를 `{accountId}:{주기 시작 시각 UTC}`로 바꾼다. 어느 쪽이든 아래 공통 인수 테스트를 통과해야 한다.

**공통 인수 테스트 (REQ-160 · REQ-161)**

| 사례 | 상황 | 기대 결과 |
|---|---|---|
| 1 | 같은 회원의 지갑 2개(12 · 4 USDT), 주기 1회 | JOB-D15가 12 USDT 지갑만 `accountIds`에 넣음(4 USDT는 처음부터 대상 아님). 201 · `items` 1 · `skipped` 0. 차감 1회 · 송금 1회. `Auto Claim`은 계속 비활성 |
| 1-b | 선별 때 12 USDT였던 지갑이 호출 직전 4 USDT로 줄어듦(다른 지갑은 자격 유지) | 201 · 그 지갑만 `skipped`(`BELOW_MINIMUM`) · 다른 지갑은 `items` |
| 1-c | 묶음의 모든 계정이 `skipped`(충돌 · 미달) | 422 `NO_ELIGIBLE_ACCOUNT` + `details.skipped[]`. 차감 0, 다음 주기에 다시 판정 |
| 2 | 첫 호출 응답 유실 → 같은 키로 재시도 | 같은 신청번호 응답. 신청 · 차감 · 송금 각 1회 |
| 3 | 응답 유실 후 재시도 전에 다음 주기 실행(새 키) | 새 신청 0건(선차감으로 출금 가능액 0 → `skipped`). 기존 신청 1건 유지 |
| 4 | 두 호출이 같은 계정에 동시에 도착 | 한쪽만 신청 생성, 다른 쪽의 그 계정은 `skipped`(`IN_PROGRESS`). 차감 · 송금 1회 |
| 5 | 신청 생성 실패(`WITHDRAWAL_CREATE_FAILED`) | 차감 0. 다음 주기에 다시 대상 |
| 6 | 처리 중인 계정에 새 적립 도착 | 처리 중 신청 금액은 그대로. 새 적립분의 처리는 현행 정책(REQ-160) |

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `NOT_FOUND` | 그 회원의 계정이 아님·없는 계정 포함 |
| 409 | `IDEMPOTENCY_KEY_REUSED` | 같은 키 다른 본문 |
| 409 | `CONCURRENT_REQUEST` | 같은 `Idempotency-Key` 요청이 아직 처리 중(계정 충돌은 `skipped`의 `IN_PROGRESS`로 처리) |
| 422 | `NO_ELIGIBLE_ACCOUNT` | 처리할 계정 0(모든 계정이 `skipped`) — `details.skipped[]` |
| 500 | `WITHDRAWAL_CREATE_FAILED` | 신청 생성 실패(차감 없음, 다음 주기 재확인) |

#### API-018. 초대 리워드 출금 (자동 지급)

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | 기존 초대 리워드 출금 API(`inviteReward`·`partner` 도메인) — 경로 문자열은 확인하지 못했다 |
| 설명 | `Available Invitation Rewards` **전액**을 **관리자가 관리자 화면에서 지정한 그 회원의 연동 계정** 1곳으로 자동 지급한다(부분 출금 없음, 최소 10 USDT, 매칭 별개). 회원 화면에서는 부르지 않는다(`Auto Claim` 비활성). DEX 지갑 목적지는 Wallet B에서 USDT 송금 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 내부 호출(자동 지급). 받을 계정 지정은 기존 어드민 기능(현행) |
| 관련 기능 | FA-022 · BA-052 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | 자동 지급 주기 · 회원 단위 키 |
| memberNo | string | 필수 | 초대 리워드 보유 회원 |

- 목적지는 요청으로 받지 않는다. 관리자가 지정한 연동 계정(CEX UID · DEX 지갑 모두 대상, 정책 8-15)을 서버가 읽는다.

**Response (201 Created)**

```json
{
  "status": "success",
  "data": { "requestNo": "IW-20261111-000045", "accountId": "acc_8f21c0", "amount": "52.30", "status": "PROCESSING" },
  "meta": { "requestId": "req_…" }
}
```

- 연동 계정이 하나도 없으면 지급하지 않고 잔액을 유지한다(REQ-417).
- 보안 확인(캡차 · 이메일/OTP · 72h/24h)이 없다. DEX 지갑 목적지의 처리 중·`Sent`·지연·재시도·`Failed`는 회원 캐시백 자동 지급과 똑같다(JOB-D10, REQ-416).
- **실패 시 복원은 초대 리워드 잔액으로**(`debitSource = INVITATION_REWARD`). 예: 초대 리워드 52.30 · 지정 지갑 캐시백 0인 회원의 송금이 최종 실패 → `Available Invitation Rewards` 52.30, 지갑 캐시백 0 그대로. 다음 주기에 다시 자동 지급 대상.
- 제휴사(Affiliate)는 어드민이 지정한 고정 지급 계정(그 제휴사의 활성 연동 계정 중 CEX UID 또는 DEX 지갑)으로 자동 지급한다(REQ-418·REQ-428, G-420 · G-056). DEX 지갑이면 회원 자동 지급과 같은 Wallet B 온체인 송금

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 409 | `IDEMPOTENCY_KEY_REUSED` | 같은 키 다른 본문 |
| 422 | `INVITATION_REWARD_BELOW_MINIMUM` | 10 USDT 미만(지급하지 않고 잔액 유지) |
| 422 | `DESTINATION_NOT_ALLOWED` | 지정 계정이 그 회원의 활성 연동 계정이 아님(해제·연동 미완료·브로커 계정) |
| 422 | `PAYOUT_NETWORK_NOT_SET` | DEX 목적지인데 지급 네트워크 미설정 |

### 어드민 API

공통: 모든 어드민 API는 권한 없는 호출을 `403 FORBIDDEN`(`details.capability`)으로 거부하고, 쓰기 API는 감사 레코드와 같은 트랜잭션으로 커밋한다. 지갑·회원 식별자가 들어간 응답은 그 화면 권한이 있는 운영자에게만 전체 값으로 준다(REQ-495).

#### API-101. 거래소 관리 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/exchanges` |
| 설명 | 거래소 관리 목록(CEX·DEX 한 테이블). 비노출·비활성 포함. 유형 필터를 걸어도 2초 이내 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM · CS(조회) |
| 관련 기능 | FA-025 · FA-026 · FA-028 · FA-033 · FA-040 · FA-059 · FA-062 · FA-069 · BA-056 · BA-057 · BA-059 · BA-064 · BA-071 · BA-090 · BA-093 · BA-099 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType | string | 선택 | `CEX` / `DEX` |
| active · visible | boolean | 선택 | 플래그 필터 |
| page · size | integer | 선택 | 기본 1 · 20 |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "exchangeNo": 41, "nameEn": "Lighter", "exchangeType": "DEX", "iconUrl": "…", "logoUrl": "…", "isVisible": true, "displayOrder": 7, "isLinkable": true, "isActive": true, "asAt": "2026-11-01", "asAtStale": false, "version": 12 } ], "meta": { "requestId": "req_…", "pagination": { "page": 1, "size": 20, "totalCount": 22, "totalPages": 2 } } }
```

- `asAtStale` = as-at 90일 초과(경고, REQ-515). Broker 유형은 필터 선택지에서 제거(G-246 확정: 브로커 2건 · test 행 모두 `CEX`로 백필하고 비활성 유지 기존 레코드 처리).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 메뉴 권한 없음 |

#### API-102. 거래소 생성

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/exchanges` |
| 설명 | 거래소 레코드를 만든다. `Exchange Type`(CEX/DEX) 필수, `None` 저장 불가. DEX는 정산 통화·지갑 주소 형식·레퍼럴 링크/코드 필수 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator |
| 관련 기능 | FA-025 · FA-034 · BA-056 · BA-065 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType | string | 필수 | `CEX` / `DEX` |
| nameEn · nameKo · icon · logo | — | 필수 | 기존 필드 |
| cashbackRate | string | 필수 | `캐시백율(%)`(기존 `페이백율(%)`) |
| settlementCurrency | string | DEX 필수 | `USDT` / `USDC` |
| feeAssetAsUsdtEquivalent | boolean | 선택 | `Fee asset paid, recorded as USDT equivalent` |
| walletAddressFormat | string | DEX 필수 | 거래소가 확인한 주소 형식(예: `EVM`). 거래소별 설정값 |
| referralLink · referralCode | string | DEX 필수 | `https://`만 |
| settlementCycle · dayOfWeek | string | DEX 필수 | `DAILY`/`WEEKLY` · 요일(G-393 확정: 일 · 주만 두고 「사용자 표시용 정산 주기, 수집 주기와 별개」 명시) |
| aggregationStart · aggregationEnd · updateTimeUtc | string | 필수 | 상대 일자(최대 7일 전) · `HH:mm` |
| reason | string | 필수 | 감사 사유 |

**Response (201 Created)**

```json
{ "status": "success", "data": { "exchangeNo": 45, "exchangeType": "DEX", "isVisible": false, "isLinkable": false, "version": 1 }, "meta": { "requestId": "req_…" } }
```

- 생성 직후 노출은 꺼진 상태(V2 조건 확인 전, REQ-183). 노출을 켜면 FCM 30이 자동 발송되는 구조(❓ G-297).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 필수값 누락·글자 수 |
| 422 | `EXCHANGE_TYPE_REQUIRED` | `None` |
| 422 | `WALLET_FORMAT_RULE_UNDEFINED` | 규칙 없는 형식 |
| 422 | `URL_NOT_HTTPS` | 레퍼럴 링크 형식 |

#### API-103. 거래소 수정 (DEX 필드·DEX별 설정)

| 항목 | 내용 |
|---|---|
| Method | PUT |
| URL | `/api/admin/exchanges/{exchangeNo}` |
| 설명 | 레코드 필드와 폼 하단 DEX별 설정 섹션(Lighter Referral Program · ApeX Affiliate API · EdgeX Partner API · Aster), 파트너 API 설정 그룹(문서 버전·base URL·인증 방식·5개 API 상태·가동일), 제한 지역, 래퍼럴 마진을 저장한다. 키 원문은 이 API로 받지 않는다(API-104) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator(마진·DEX별 설정), PM(콘텐츠성 필드) |
| 관련 기능 | FA-027 · FA-034 · FA-035 · FA-036 · FA-037 · FA-038 · FA-039 · FA-041 · BA-020 · BA-026 · BA-058 · BA-065 · BA-066 · BA-067 · BA-068 · BA-069 · BA-070 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | path |
| version | integer | 필수 | 동시 편집 |
| fields | object | 필수 | 바꿀 필드만. 레코드 필드는 API-102와 같음 + `isVisible` · `isLinkable` · `isActive` · `defiLlamaSlug` · `restrictedRegions[]` · `asAt` |
| dexSettings | object | 선택 | DEX별 섹션(아래) |
| partnerApi | object | 선택 | `docVersion` · `baseUrl` · `authMethod` · `apis[]`(`{ name, status, liveSince }`) |
| reason | string | 필수 | 감사 사유 |
| confirmed | boolean | 필수 | 확인 창(필드별 이전·새 값)을 본 뒤 `true` |

`dexSettings` 예:

```json
{
  "lighter": { "referralCode": "TETHERMAX", "pollingIntervalMinutes": 60 },
  "apex": { "referralCode": "TETHERMAX", "referralLink": "https://…", "accountKeyMode": "WALLET_ONLY" },
  "edgex": { "codes": [ { "code": "…", "registrationRate": "…" } ] },
  "aster": null
}
```

**Response (200 OK)**

```json
{ "status": "success", "data": { "exchangeNo": 41, "version": 13, "changes": [ { "field": "settlementCurrency", "before": "USDC", "after": "USDT" } ], "slugRedirect": null }, "meta": { "requestId": "req_…" } }
```

- 이름 변경 시 `slugRedirect: { "from": "…", "to": "…" }`(이전 URL 301, 확인 창에 「공개 URL이 바뀝니다」). 비활성화 시 랜딩·연동·선택 목록에서 즉시 제외, 상세 URL → DEX 랜딩. 저장 시 관련 캐시 무효화.
- ApeX `referralCode` 저장 전 `Validate` — 파트너가 `is_valid false`면 라이브 링크로 저장 불가. EdgeX `registrationRate`는 읽기 전용(EdgeX 콘솔에서만 변경). Aster 섹션 여부 G-251 확정: 둔다 — 필드는 G-035 · G-037 회신 후 확정 · G-035 · G-037, ApeX 키 모드 G-075 확정: 선택 표시 필드만(식별 키 아님) → ApeX `Account key mode` · `Re-key` 만들지 않음.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `CONFIRMATION_REQUIRED` | 확인 창 미확인 |
| 409 | `VERSION_CONFLICT` | 다른 운영자가 먼저 저장 |
| 422 | `REFERRAL_CODE_INVALID` | ApeX `is_valid false` |
| 422 | `URL_NOT_HTTPS` · `WALLET_FORMAT_RULE_UNDEFINED` | 필드 검증 |

#### API-104. 파트너 API 키 교체 (write-only)

| 항목 | 내용 |
|---|---|
| Method | PUT |
| URL | `/api/admin/exchanges/{exchangeNo}/partner-credentials` |
| 설명 | 파트너 API 키·passphrase를 교체한다. 키는 보안 저장소에만 저장, 어떤 응답·화면·로그·내보내기에도 원문 없음, 수정이 아니라 교체만 |
| 구분 | 신규 |
| 권한 | Master · Operator |
| 관련 기능 | FA-037 · FA-038 · BA-020 · BA-068 · BA-069 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | path |
| credentialType | string | 필수 | `API_KEY` / `PASSPHRASE` / `WEBHOOK_SECRET` |
| value | string | 필수 | 새 값(요청 로그에서 마스킹) |
| reason | string | 필수 | 감사 사유 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "credentialType": "API_KEY", "last4": "9f2c", "rotatedAt": "2026-11-11T06:00:00Z" }, "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 빈 값 |
| 403 | `FORBIDDEN` | 권한 없음 |

#### API-105. 파트너 API 연결 테스트

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/exchanges/{exchangeNo}/partner-credentials/test` |
| 설명 | 저장된 자격증명으로 파트너 읽기 전용 엔드포인트를 1회 호출해 연결을 확인한다(`Test connection`) |
| 구분 | 신규 |
| 권한 | Master · Operator |
| 관련 기능 | FA-037 · FA-038 · BA-020 · BA-068 · BA-069 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | path |

**Response (200 OK)**

```json
{ "status": "success", "data": { "ok": false, "httpStatus": 401, "partnerError": "invalid signature", "latencyMs": 412, "testedAt": "2026-11-11T06:01:00Z" }, "meta": { "requestId": "req_…" } }
```

- 실패도 200으로 결과를 돌려준다(`ok: false`). 응답·로그에 키 원문 없음.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `NOT_FOUND` | 자격증명 미설정 |

#### API-106. 거래소 전역 순위 저장

| 항목 | 내용 |
|---|---|
| Method | PUT |
| URL | `/api/admin/exchanges/display-order` |
| 설명 | 기존 전역 1..N 순서에 DEX를 섞어 저장한다(새 순서 시스템 없음). DEX 랜딩 glance·venue·연동 셀렉터가 같은 순서를 읽는다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-027 · FA-033 · BA-058 · BA-064 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| version | integer | 필수 | 순서 전체의 버전 |
| order | integer[] | 필수 | `exchangeNo` 배열(1..N, 빈칸·중복 없음) |

**Response (200 OK)**

```json
{ "status": "success", "data": { "version": 31 }, "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 누락·중복 번호 |
| 409 | `VERSION_CONFLICT` | 동시 편집 |

#### API-107. Account List

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/accounts/search` |
| 설명 | Account List 조회(약 85,000행, 2초 이내). 「이미 다른 회원에게 연동됐나」의 유일한 원본. 지갑 검색은 전체 값만 |
| 구분 | 기존·변경 ⚠경로 (조회를 POST 본문으로) |
| 권한 | Master · Operator · PM · CS |
| 관련 기능 | FA-028 · FA-035 · FA-044 · FA-047 · BA-059 · BA-066 · BA-075 · BA-078 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| category · exchangeNo | — | 선택 | 기존 필터 |
| exchangeType | string | 선택 | `ALL`/`CEX`/`DEX` |
| integrationStatus · ownership | string | 선택 | `Y`/`N`(CEX·DEX 같은 규칙) |
| keywordType | string | 선택 | `TUID` / `UID` / `WALLET` / `DEX_ACCOUNT_ID` |
| keyword | string | 선택 | 전체 값만(축약·부분 불가). trim 후 형식 검증 |
| period | object | 선택 | 누적 캐시백 기간 |
| page · size | integer | 선택 | |

**Response (200 OK)**

```json
{ "status": "success", "data": { "rows": [ { "no": 1, "integration": "LINKED", "exchangeType": "DEX", "exchange": "Lighter", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "dexAccountId": "…", "tuid": "990001234", "linkedAt": "2026-11-11T03:20:11Z", "accumulatedCashback": "120.00" } ], "accumulatedCashbackTotal": "120.00" }, "meta": { "requestId": "req_…", "pagination": { "page": 1, "size": 20, "totalCount": 1, "totalPages": 1 } } }
```

- 컬럼 세부 G-238 확정: 한 컬럼 `UID / Wallet address`. 엑셀은 API-132(`Exports` 권한).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 빈 검색어·공백·주소 형식 오류(전체 결과를 반환하지 않음) |

#### API-108. Linking Management (DEX 확인 중 큐)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/linking-applications/search` |
| 설명 | 기존 `Linking Management`·`Manual Linking Application`을 DEX 확인 중(`manual_link_pending`) 건까지 조회한다. Lighter 큐 = `processStatus = PENDING` + Lighter 저장 필터 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 조회는 Master · Operator · PM · CS. 승인·거절은 API-109의 권한을 적용한다 |
| 관련 기능 | FA-010 · FA-028 · FA-045 · BA-010 · BA-059 · BA-076 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType · exchangeNo | — | 선택 | |
| processStatus | string | 선택 | 기존 상태 값(확인 중 포함) |
| pendingReason | string | 선택 | `PARTNER_UNAVAILABLE` · `APEX_ACCOUNT_ID_MISSING` · `MULTIPLE_DEX_ACCOUNTS`(이상 귀속 확인 대기) · `PRELINK_PAYOUT`(연동 전 잔액 송금 대기 — 승인·거절 대상 아님, 송금 결과로만 끝남, REQ-722) |
| keywordType · keyword | — | 선택 | API-107과 같음 |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "applicationId": "la_…", "tuid": "990001234", "exchange": "Lighter", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "pendingReason": "CHECK_UNAVAILABLE", "appliedAt": "2026-11-11T03:20:11Z", "attributionEvidence": { "found": true, "source": "DAILY_LEDGER", "ledgerDate": "2026-11-10" }, "autoRecheck": { "attempts": 2, "nextAt": "…", "expiresAt": "…" } } ], "meta": { "requestId": "req_…" } }
```

- `attributionEvidence` = 귀속 원장에서 그 지갑을 찾았는지(승인 조건). 자동 재확인은 15분마다 최대 4회, 이후 운영 Slack 알림 → 운영자 판정(자동 만료 없음, G-068).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 권한 없음 |

#### API-109. DEX 수동 연동 승인·거절

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/linking-applications/{applicationId}/decision` |
| 설명 | 확인 중 건을 귀속 원장 확인 후 승인하거나 사유와 함께 거절한다. 원장에 없으면 승인 불가(운영자 재량 없음). 결과 알림 1회(FCM 100/101 · EMAIL 30/31). CS 접수 해제·정정 처리도 이 API의 `UNLINK` 동작으로 한다(화면 여부는 결정 대기) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator만 실행 가능(G-223 · G-224). PM · CS는 조회만 가능 |
| 관련 기능 | FA-005 · FA-010 · FA-045 · FA-047 · BA-005 · BA-010 · BA-011 · BA-076 · BA-078 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| applicationId | string | 필수 | path |
| action | string | 필수 | `APPROVE` / `REJECT` / `UNLINK` |
| rejectReason | string | REJECT 필수 | 회원에게 보이는 사유(형식 G-074 확정: `Not a TetherMax referral` · `Bound before program start` · `Ambiguous match not confirmed` · `Other`. `Bound before program start`는 Lighter에서만 허용) |
| reason | string | 필수 | 내부 감사 사유. 회원 안내와 이메일에는 `rejectReason`만 사용 |

거절 요청 예시 (EdgeX)

```json
{ "action": "REJECT", "rejectReason": "Not a TetherMax referral", "reason": "Attribution ledger checked by operator." }
```

**Response (200 OK)**

```json
{ "status": "success", "data": { "applicationId": "la_…", "linkStatus": "LINKED", "actionedBy": "admin_07", "actionedAt": "2026-11-11T07:00:00Z", "notification": "QUEUED" }, "meta": { "requestId": "req_…" } }
```

- 거절 후 같은 지갑 재연동은 처음부터 다시 검사. 승인 시 연동 전 잔액 처리(REQ-107)를 시작한다 — 10 USDT 미만이면 바로 연동 완료·이관, 이상이면 그 지갑으로 출금한 뒤 자동 연동(실패 = 연동 실패). 금액 기준 시각은 연동 신청 시각.

- 대상은 귀속 확인 대기 건뿐이다. 송금 대기(`PRELINK_PAYOUT`) 건에 요청하면 409 `NOT_ATTRIBUTION_PENDING`. 같은 신청을 자동 재확인이 먼저 확정했으면 409 `ALREADY_ACTIONED` — 연동 전 잔액 처리는 신청 1건당 한 번(정책 5-6 ④).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 409 | `ALREADY_ACTIONED` | 다른 운영자가 먼저 처리(`Already actioned by {admin}`) |
| 409 | `NOT_ATTRIBUTION_PENDING` | 귀속 확인 단계를 지난 신청(연동 전 잔액 송금 대기 등) |
| 422 | `ATTRIBUTION_NOT_CONFIRMED` | 귀속 원장에 없는 지갑 승인 |

#### API-110. 연동 감사 로그

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/linking-audit-logs/search` |
| 설명 | 연동 생성 · 확인 중 → 승인/거절 · 해제 · DEX Account ID 변경 · 연동 전 잔액 처리(출금 · 이관)를 행위당 1건씩 조회한다 |
| 구분 | 신규 |
| 권한 | Master · Operator |
| 관련 기능 | FA-046 · BA-011 · BA-077 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| from · to | string | 필수 | UTC |
| action | string | 선택 | `CREATED` · `APPROVED` · `REJECTED` · `UNLINKED` · `DEX_ACCOUNT_ID_CHANGED` · `PRELINK_BALANCE_PAID_OUT` · `PRELINK_BALANCE_TRANSFERRED` · `GUEST_TO_MEMBER_TRANSFERRED`(CEX UID 게스트 → 회원 이관) |
| actorType | string | 선택 | `SYSTEM` / `ADMIN` |
| actorId | string | 선택 | 운영자 ID(`actorType = ADMIN`일 때) |
| keywordType · keyword | — | 선택 | API-107과 같음 |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "at": "2026-11-11T07:00:00Z", "actor": "admin_07", "action": "APPROVED", "tuid": "990001234", "exchange": "Lighter", "identifier": "0x7a3F…", "before": "MANUAL_LINK_PENDING", "after": "LINKED", "reason": "…" } ], "meta": { "requestId": "req_…" } }
```

- 예: 「이번 주 System이 자동 재확인으로 확정한 건」 = `{ "from": "2026-11-23T00:00:00Z", "to": "2026-11-29T23:59:59Z", "actorType": "SYSTEM", "action": "APPROVED" }` → 행 `{ "actor": "System", "action": "APPROVED", "tuid": "…", "exchange": "EdgeX", "walletAddress": "0x…", "timestamp": "…" }`.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 기간 누락 |

#### API-111. DEX Cashback Records

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/dex/cashback-records/search` |
| 설명 | 적립 원장을 DEX별 뷰로 조회한다(편집·조정·삭제 없음). Lighter = 지갑×주 1행, ApeX = `record_id`, EdgeX = 레코드 `id` |
| 구분 | 신규 |
| 권한 | Master · Operator · PM · CS(조회) |
| 관련 기능 | FA-050 · FA-051 · BA-021 · BA-023 · BA-081 · BA-082 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | DEX별 뷰 |
| from · to | string | 필수 | 거래일·주차 범위 |
| keywordType · keyword | — | 선택 | TUID·지갑·DEX 계정 ID(전체 값) |
| status | string | 선택 | 레코드 상태. 미연동 지갑 적립분 = `UNLINKED_HELD`(회원 칸 비어 있음), 연동 전 잔액 처리로 그 지갑에 출금된 레코드 = `PRELINK_PAID`, 적립하지 않은 레코드 = `REJECTED`(+ `rejectReason`) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "recordKey": "lighter:2026-11-02:0x7a3f…", "week": "2026-11-02", "tuid": "990001234", "wallet": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "tier": "PREMIUM", "cashbackUsdt": "25.00", "cashbackUsdc": "25.000000", "tethermaxShare": "…", "status": "PAID", "txHash": "0x…", "finalized": true },
    { "recordKey": "apx_cm_20261006_14_000184", "tuid": "990001234", "wallet": "0x…", "dexAccountId": null, "accountIdState": "Account ID pending", "rewardPeriodUtc": "2026-10-06T14:00:00Z", "feeBasis": "…", "commission": "…", "currency": "USDT", "status": "PENDING", "finalized": false }
  ],
  "meta": { "requestId": "req_…" }
}
```

- 미매칭 큐 화면·운영자 액션은 없다. 미연동 지갑 적립분(`UNLINKED_HELD`) · 연동 전 출금(`PRELINK_PAID`) · 거부 레코드(`REJECTED`, `rejectReason` = `INVALID_ADDRESS` · `INVALID_CHECKSUM` · `MISSING_FIELD` · `NOT_TETHERMAX_REFERRAL` · `WRONG_TOKEN` · `NOT_ELIGIBLE`)는 이 조회로 확인만 한다(REQ-576). `UNLINKED_HELD`는 그 지갑의 연동 신청 시 연동 전 잔액 처리(REQ-107)에 따라 `PRELINK_PAID`가 되거나 그 회원의 적립 레코드로 이관된다.
- 금액은 전체 정밀도 문자열 + 통화. 회원 적립액은 절삭값으로 별도 필드. 산정식 = `총 커미션 × (1 − 마진율)`(G-046). 원장 필드는 표준 요건 5필드(표준 요건 수락 전제, G-001 · G-021).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | DEX·기간 누락 |

#### API-112. 원장 정정 레코드 생성

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/dex/cashback-records/{recordId}/corrections` |
| 설명 | 확정된 레코드는 직접 수정할 수 없고(원장 수정 API 없음) 이 API로만 고친다. 원본을 바꾸지 않고 원본 ID를 참조하는 정정 레코드(날짜 붙은 `Adjustment`, 음수 가능)를 만든다. 2인 승인·금액 문턱 없음. 음수 정정은 그 계정 향후 적립에서 상계(출금액 회수 없음, 누적 0 아래 불가) |
| 구분 | 신규 |
| 권한 | Master · Operator |
| 관련 기능 | FA-050 · BA-024 · BA-081 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | 정정 1건 = 키 1개. 응답 유실 뒤 같은 키로 재시도하면 처음 만든 `correctionId`를 그대로 반환하고 잔액은 한 번만 변함. 같은 금액을 의도적으로 한 번 더 정정하면 새 키(화면에서 정정 작업을 새로 열 때 발급). 같은 키 + 다른 본문 = 409 `IDEMPOTENCY_KEY_REUSED` |
| recordId | string | 필수 | path(내부 레코드 ID) |
| amount | string | 필수 | 부호 있는 10진 문자열, 원 통화 |
| reason | string | 필수 | 사유 |
| sourceRef | string | 필수 | 출처 참조(파트너 정정 ID 등) |

**Response (201 Created)**

```json
{ "status": "success", "data": { "correctionId": "adj_…", "originalRecordId": "…", "amount": "-1.250000", "currency": "USDC", "effectiveDate": "2026-11-11" }, "meta": { "requestId": "req_…" } }
```

- Lighter 원장은 정정 대상이 아니다(정정·clawback 없음, 유일한 음수 결과는 `Withheld`). 정정 규칙 세부 G-331 확정: 확정 전 직접 수정 불가 · 정정의 정정 허용 · 파트너 음수 정정은 향후 적립에서 상계 · Lighter 정정 레코드 생성 차단.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `NOT_FOUND` | 없는 원본 레코드 |
| 422 | `VALIDATION_ERROR` | Lighter 레코드 정정 시도 |

#### API-115. Lighter 주간 CSV 가져오기 (Preview·Commit) — 제외

> **제외 — G-428 확정: Lighter도 표준 요건(단건·대량 귀속 조회 + T-1 일일 원장)으로 수집한다. 이 API는 만들지 않는다.**

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/excel/upload` |
| 설명 | 기존 `Excel > Upload`에 템플릿 `Lighter weekly CSV`를 추가한다. 2단계: `step=PREVIEW`(검증·요약, 저장 없음) → `step=COMMIT`(확정). 확정하면 그 주 Lighter 금액이 회원 화면에 반영되고, CSV에 나온 **귀속 확인 대기** Lighter 연동의 귀속을 확정해 연동 전 잔액 처리를 시작한다(정책 5-6 ④ · REQ-722 — 바로 연동 완료되는 건만 FCM 102, 송금 대기로 가면 송금 성공 때 1회). Lighter 온보딩 보류(G-428) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator(권한 없으면 템플릿 선택지 비활성) |
| 관련 기능 | FA-035 · FA-052 · BA-027 · BA-066 · BA-083 |

**Request** (`multipart/form-data`)

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| template | string | 필수 | `LIGHTER_WEEKLY_CSV` |
| exchangeNo | integer | 필수 | Lighter |
| file | file | PREVIEW 필수 | CSV |
| step | string | 필수 | `PREVIEW` / `COMMIT` |
| previewId | string | COMMIT 필수 | PREVIEW 응답 ID |
| replace | boolean | 선택 | 이미 가져온 주차 교체(두 번째 확인) |
| reason | string | replace 시 필수 | 교체 사유 |

**Response (200 OK, PREVIEW)**

```json
{
  "status": "success",
  "data": {
    "previewId": "pv_…", "week": "2026-11-02", "fileName": "lighter_2026-11-02.csv",
    "rowsRead": 120, "rowsValid": 116,
    "rowsRejected": [ { "line": 14, "reason": "Invalid checksum" }, { "line": 37, "reason": "Duplicate line" } ],
    "unlinkedWalletRows": 9,
    "totalsByStatus": { "paid": "1520.400000", "withheld": "12.000000" },
    "currency": "USDC",
    "alreadyImported": { "importedAt": "2026-11-10T09:00:00Z", "importedBy": "admin_03", "totals": { "paid": "…" } }
  },
  "meta": { "requestId": "req_…" }
}
```

- 예: `week` = `2026-11-03`(화요일) → `Invalid week`. 정상 주차는 월요일(`2026-11-02`).
- 거부 사유 문자열: `Invalid week` · `Empty address` · `Invalid address` · `Invalid checksum` · `Not eligible` · `Invalid amount` · `Invalid status` · `Missing or invalid tx hash` · `Duplicate line`. 거부 행 리포트 다운로드 제공.
- COMMIT 응답: `{ paidRows, withheldRows, unlinkedRows, confirmedLinks }` — `unlinkedRows` = 연동 없는 지갑 행(미연동 지갑 적립분으로 보관, 연동 신청 시 REQ-107 처리). 전 행 거절이면 이력에 `Failed`. 교체된 파일은 History에 보존·감사. 템플릿 G-338 확정: UTF-8 · 쉼표 · 50,000행 · 20 MB · ISO 8601 · 소수 6자리 · 동시 잠금 `Import in progress by {admin}` · 재업로드 `This file was already imported on {date} by {admin}`.
- ApeX·EdgeX·Aster 일별 원장 CSV 템플릿은 두지 않는다.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 권한 없음 |
| 409 | `FILE_ALREADY_IMPORTED` | 같은 파일 재업로드 |
| 409 | `IMPORT_IN_PROGRESS` | 같은 DEX·기간 동시 가져오기 |
| 409 | `WEEK_ALREADY_IMPORTED` | 교체 확인(`replace`) 없이 같은 주 COMMIT |
| 422 | `TEMPLATE_MISMATCH` | 템플릿 형식 아님(파일 전체 거부) |

#### API-116. 수집 상태 (Cashback History Status)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/dex/collection-status` |
| 설명 | DEX 4곳의 수집 경로·마지막 원장·수집 상태와 Lighter 상세(폴링·rate limit)를 준다. 사용자 API의 지연 표시도 이 상태를 쓴다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM · CS |
| 관련 기능 | FA-049 · BA-025 · BA-080 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 선택 | 상세 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "exchangeNo": 41, "dex": "Lighter", "path": "API_DAILY_LEDGER", "status": "LIVE", "lastLedgerAt": "2026-11-10T09:00:00Z",
      "lighter": { "todayStatus": "OK", "lastPollSuccessAt": "…", "nextPollAt": "…", "consecutiveFailures": 0, "lastError": null, "rateLimitRequests24h": 96 } },
    { "exchangeNo": 42, "dex": "ApeX", "path": "API_WEBHOOK", "status": "DEGRADED", "lastLedgerAt": "…", "degradedSince": "…" }
  ],
  "meta": { "requestId": "req_…" }
}
```

- `status` = `LIVE`/`DEGRADED`/`MANUAL`/`NOT_INTEGRATED`. `DEGRADED` 판정 임계 G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 권한 없음 |

#### API-117. Poll now (1회 즉시 수집)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/dex/{exchangeNo}/poll` |
| 설명 | Lighter·ApeX·EdgeX 수집을 1회 즉시 실행하고 결과·오류를 돌려준다. 누가 언제 눌렀는지 감사 |
| 구분 | 신규 |
| 권한 | Master · Operator(없으면 비활성 + 403) |
| 관련 기능 | FA-049 · BA-080 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | path(Lighter·ApeX·EdgeX) |

**Response (200 OK)**

```json
{ "status": "success", "data": { "runId": "run_…", "result": "SUCCESS", "recordsReceived": 42, "recordsNew": 3, "error": null, "finishedAt": "…" }, "meta": { "requestId": "req_…" } }
```

- Lighter는 레이트리밋(분당 8회 / Builder 80회) 안에서만 실행.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 409 | `POLL_IN_PROGRESS` | 같은 DEX 수집 실행 중 |
| 422 | `VALIDATION_ERROR` | Aster 등 Poll now 대상 아님 |
| 429 | `RATE_LIMITED` | 파트너 레이트리밋 여유 없음 |

#### API-118. 웹훅 로그 (ApeX)

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/dex/webhook-logs` |
| 설명 | 파트너 웹훅 수신 기록을 조회한다 |
| 구분 | 신규 |
| 권한 | Master · Operator |
| 관련 기능 | FA-049 · BA-025 · BA-080 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | |
| from · to | string | 필수 | UTC |
| result | string | 선택 | `PROCESSED` / `DUPLICATE` / `REJECTED` |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "receivedAt": "…", "eventType": "…", "eventId": "…", "result": "REJECTED", "rejectReason": "IP not whitelisted" } ], "meta": { "requestId": "req_…" } }
```

- 페이로드 원문은 보관하되 이 응답에 지갑·계정 ID를 넣지 않는다. 이벤트·서명 형식 ❓ G-024.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 기간 누락 |

#### API-121. 캐시백 전체 내역 (출금·지급 포함)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/cashback/history/search` |
| 설명 | 10분 주기 자동 지급이 만든 CEX·DEX 출금 신청을 같은 전체 내역에서 추적한다. DEX 행은 `거래소 UID` 컬럼에 지갑 주소, 계정별 지급 상태·가스비·네트워크·tx 해시 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM · CS |
| 관련 기능 | FA-028 · FA-048 · FA-054 · BA-034 · BA-059 · BA-079 · BA-085 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| from · to | string | 필수 | |
| exchangeType · exchangeNo | — | 선택 | |
| keywordType | string | 선택 | `REQUEST_NO` · `TUID` · `UID` · `WALLET` · `DEX_ACCOUNT_ID` |
| keyword | string | 선택 | 전체 값 |
| payoutStatus | string | 선택 | `PROCESSING` / `SENT` / `FAILED` |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "requestNo": "WD-20261111-000123", "tuid": "990001234", "exchange": "Lighter", "identifier": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "amount": "35.00", "stage": "PROCESSING", "payout": { "status": "SENT", "network": "…", "gasFee": "…", "txHash": "0x…", "explorerUrl": "…", "attempts": 1 } } ], "meta": { "requestId": "req_…" } }
```

- CEX 신청은 기존 출금 처리 흐름 그대로다. HTX처럼 수동 출금이 필요한 거래소는 자동 생성된 신청을 관리자가 기존 출금 처리 화면에서 실제 출금 처리한다(REQ-706, G-412).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 기간 누락·검색어 형식 |

#### API-124. DEX 운영 설정값

| 항목 | 내용 |
|---|---|
| Method | GET · PUT |
| URL | `/api/admin/dex/settings` |
| 설명 | 하드코딩 없이 운영하는 설정값을 조회·저장한다. 값이 정해지지 않은 항목은 `null`이며, `null`이면 그 기능은 동작하지 않는다(지급 네트워크 `null` → DEX 지갑 자동 지급을 하지 않음, REQ-142) |
| 구분 | 신규 |
| 권한 | GET Master · Operator · PM / PUT Master |
| 관련 기능 | FA-055 · BA-015 · BA-026 · BA-030 · BA-033 · BA-086 |

**Request (PUT)**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| version | integer | 필수 | |
| settings | object | 필수 | 바꿀 키만 |
| reason | string | 필수 | 감사 사유 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "version": 4,
    "settings": {
      "payoutNetwork": null,
      "minimumWithdrawalUsdt": "10.00",
      "payoutRetry": { "maxAttempts": null, "intervalSeconds": null, "delayThresholdHours": null, "gasCap": null },
      "walletBLowBalanceThreshold": null,
      "degradedThresholds": { "APEX": null, "EDGEX": null, "ASTER": null, "LIGHTER": null },
      "manualLinkRecheck": { "intervalMinutes": 15, "maxAttempts": 4 },
      "linkAttemptLimit": { "count": 0, "waitMinutes": null },
      "asterMonthlyCapUsdt": "20000",
      "bingoBatchTimeUtc": "12:30"
    }
  },
  "meta": { "requestId": "req_…" }
}
```

- 값 출처: 네트워크 ❓ G-044 · 재시도 G-117 확정(설정 필드) · ❓ G-118·G-120 · 지연 임계 G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간 · 재확인 15분 × 4회(G-068) · 시도 제한 G-063 확정: 1차 출시 미도입 — 기존 CEX처럼 캡차만. REQ-073 다이얼로그·어드민 제한 타입 추가 안 함(0 = 비활성) · Aster 상한은 정책의 현재값(고정값 아님) · Batch 시각은 현재값 12:30 UTC.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 409 | `VERSION_CONFLICT` | 동시 편집 |
| 422 | `VALIDATION_ERROR` | 범위 밖 값 |

#### API-125. 이벤트 리워드 지급·회수

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/event-rewards` |
| 설명 | `Event Reward Payment`·`회원 수동 캐시백`에서 DEX 지갑에 이벤트 리워드를 지급하거나 잔여 금액 범위 안에서 회수한다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator |
| 관련 기능 | FA-020 · FA-053 · BA-048 · BA-074 · BA-084 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| Idempotency-Key | string(header) | 필수 | 지급·회수 1건 = 키 1개. 응답 유실 뒤 같은 키로 재시도하면 처음 만든 `entryId`를 그대로 반환하고 잔액은 한 번만 변함. 의도적인 같은 금액 재처리는 새 키. 같은 키 + 다른 본문 = 409 `IDEMPOTENCY_KEY_REUSED` |
| action | string | 필수 | `PAY` / `CLAW_BACK` |
| accountId | string | 필수 | 대상 거래 계정 |
| amount | string | 필수 | USDT |
| eventNo | integer | 선택 | 연결 이벤트 |
| reason | string | 필수 | |

**Response (201 Created)**

```json
{ "status": "success", "data": { "entryId": "er_…", "accountId": "acc_8f21c0", "amount": "5.00", "action": "PAY" }, "meta": { "requestId": "req_…" } }
```

- `회원 수동 캐시백`의 DEX 포함 여부 G-240 확정: 회원 수동 캐시백은 DEX 행 포함, 인도네시안 캐시백 내역은 미포함.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 422 | `AMOUNT_EXCEEDS_BALANCE` | 회수액 > 계정 잔여 |

#### API-126. 회원 상세 Linked Accounts

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/members/{memberNo}/linked-accounts` |
| 설명 | 회원 상세·회원 모달·제휴사 하부 내역이 쓰는 회원의 거래 계정과 금액(CEX·DEX 같은 정의) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM · CS |
| 관련 기능 | FA-042 · FA-043 · BA-072 · BA-073 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| memberNo | string | 필수 | path |
| exchangeType | string | 선택 | |

**Response (200 OK)**

```json
{ "status": "success", "data": { "count": 5, "rows": [ { "exchangeType": "DEX", "exchange": "Lighter", "walletAddress": "0x7a3F9c1b2D4e5F60718293a4B5c6D7e8F90151E9", "dexAccountId": "…", "linkStatus": "LINKED", "referralStatus": "Confirmed", "tier": "Unknown", "remainingCashback": "35.00", "receivedCashback": "80.00", "withdrawable": "35.00" } ] }, "meta": { "requestId": "req_…" } }
```

- `receivedCashback` = 출금한 금액, `remainingCashback` = 잔액. Lighter `referralStatus` `Confirmed` / `Linked – confirming referral`. `연동계정수` 분리 표기 G-237 확정: 분리 표기 `UID {n} · 지갑 {n}` + 필터 `UID만 / 지갑만 / 둘 다`.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 404 | `NOT_FOUND` | 없는 회원 |

#### API-127. DEX Landing Page 콘텐츠·리스트

| 항목 | 내용 |
|---|---|
| Method | GET · PUT |
| URL | `/api/admin/cashback-products/dex-landing` |
| 설명 | `DEX Landing Page Listings`(Priority · DEX)와 9개 영역 콘텐츠를 조회·저장한다. `Add DEX`는 활성이면서 랜딩에 없는 DEX만, 레퍼럴 링크·정산 통화가 없으면 추가 불가 |
| 구분 | 신규 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-027 · FA-064 · FA-065 · BA-058 · BA-094 · BA-095 |

**Request (PUT)**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| version | integer | 필수 | |
| listings | object[] | 선택 | `[{ "exchangeNo": 41, "priority": 1 }]` |
| areas | object | 선택 | 언어별 랜딩 영역 콘텐츠(REQ-628). `{ "{lang}": { hero{title, lede}, sectionButtons[2], trust{title, subline, linkLabel, labels[2]}, venueArea{title, description, cardsPerView, overflow}, comparisonRows[3~10]{label, cex, dex}, stepsArea{title, buttonLabel}, steps[2~5]{title, body, duration, imageMediaId}, educationTiles[2~6]{tag, title, body, imageMediaId}, learnAndEarn{tag, title, description, buttonLabel}, finalCta{title, description, buttonLabel, buttonUrl} } }`. 빈 칸은 저장 가능(사용자 화면은 언어팩 기본 문구, G-366). 검증: 개수 범위 · 글자 수 · URL · 이미지 규격(REQ-628) — 키는 API-003 응답과 같다. 파트너 카드 필드는 거래소별이라 API-128 `section=LANDING_CARD` |
| reason | string | 선택 | |

**Response (200 OK)**

```json
{ "status": "success", "data": { "version": 9, "listings": [ { "exchangeNo": 41, "priority": 1 } ], "addable": [ 44 ] }, "meta": { "requestId": "req_…" } }
```

- 언어 구조 = 언어 매트릭스(EN·KO 필수, RU·ID 선택, G-261), 언어팩 키와 편집 영역 중복 G-366 확정: 운영자 편집 영역도 고정 폴백 문구로 언어팩에 둔다(키 수 재산정은 언어팩 작업 때)(🔴). 필수 필드가 빈 언어가 있으면 저장 차단, 오류는 언어 → 필드 순(`details.fields[].field` = `ko.hero.title`).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 필수 언어·필드 누락, 범위 밖 개수 |
| 409 | `VERSION_CONFLICT` | 동시 편집 |
| 422 | `URL_NOT_HTTPS` | URL 필드 |

#### API-128. 거래소 랜딩·상세 콘텐츠 편집

| 항목 | 내용 |
|---|---|
| Method | GET · PUT |
| URL | `/api/admin/cashback-products/exchanges/{exchangeNo}/content` |
| 설명 | `Edit Landing Content`(Venue 카드)와 `Edit Detailed Content`(`EDC-4`~`EDC-23`: 소개·마켓 태그·Deposit·Right Box·주요 특징·Structure·단계 가이드·배너·약관·FAQ)를 조회·저장한다. 요율은 레코드 참조(`{요율}` 치환) |
| 구분 | 신규 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-027 · FA-064 · FA-066 · FA-067 · BA-058 · BA-094 · BA-096 · BA-097 |

**Request (PUT)**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | path |
| version | integer | 필수 | |
| section | string | 필수 | `LANDING_CARD` / `DETAIL` |
| content | object | 필수 | 언어별 필드. 미디어는 API-129 업로드 ID로 참조 |

```json
{ "version": 3, "section": "DETAIL", "content": { "en": { "introduction": "…", "markets": ["BTC"], "deposit": ["CRYPTO"], "additionalNotes": "…", "rightBox": [ { "tabName": "Taker", "line1": "Trading fees cashback up to", "line2": "{요율}", "getStartedUrl": "https://…" } ], "keyFeatures": { "title": "…", "items": [ { "thumbnailId": "md_…", "description": "…" } ] }, "structure": { "minVolume": "1000", "maxVolume": "250000" }, "guide": { "title": "…", "steps": [ { "title": "…", "description": "…", "desktopMediaId": "md_…", "mobileMediaId": "md_…" } ] }, "banner": { "desktopId": "md_…", "mobileId": "md_…", "liner": "…", "ctaTitle": "Join Now", "ctaUrl": "https://…", "style": { "fontSize": "…", "fontWeight": "…", "color": "…" } }, "terms": null, "faq": [ { "sectionName": "…", "items": [ { "q": "…", "a": "…" } ] } ] } } }
```

**Response (200 OK)**

```json
{ "status": "success", "data": { "version": 4, "cacheInvalidated": true }, "meta": { "requestId": "req_…" } }
```

- `section=LANDING_CARD`의 `content.{lang}` = `{ line1, line2, line3, bullets[≤4], learnMoreUrl, getStartedUrl, tvlEndpoint, volumeEndpoint }`(REQ-617, G-269 · G-441). 랜딩 카드(API-003 `venues[].card`)에는 Line 1~3 · 링크만 나가고, `bullets`는 상세 히어로 혜택 줄(API-004 `hero.benefits`)로 나간다(G-157 · G-441).
- Right Box 탭 1개 = 상세 오퍼 박스 토글 1칸(G-438), FAQ는 섹션마다 질문·답변 쌍 1개 이상·섹션 합계 2,000자(G-439), `additionalNotes` = 상세 히어로 자격 안내(선택, G-440). 사용자 응답 대응은 API-004.
- 검증(UI·서버 동일): `Introduction` 필수 300자 · `Key Features Title` 40자 · Right Box 탭 최대 3·전부 필수 · Structure 양의 정수·최대 1조·최대 > 최소 · 배너 데스크톱 854×173 `.webp` + 모바일 2:1 `.webp` 둘 다 · 약관 2,000자(선택) · Venue `Line 1` 20자 · `Line 2` 10자. 글자 수 = 사용자가 보는 글자 단위.
- 단계 가이드·FAQ 구조 G-270 확정: PRD 구조 — Guide Title 100 · 단계 1~5 · Step Title 80 · Description 500 · 데스크톱 2:1 + 모바일 1:1 .mp4 필수 · G-271 확정: 단계 수 축소 시 삭제될 단계 명시 확인 창 · 단계 수는 언어 공통 · 영상은 언어별 선택 업로드 · G-272 · G-439 확정: 섹션 단위 — Section Name 40자 + 질문·답변 쌍(섹션 합계 2,000자), 약관은 거래소별 어드민 입력 · 상세 약관 서랍 표시(G-369).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 필드 제약 위반(언어 → 필드 순 전부) |
| 409 | `VERSION_CONFLICT` · `UPLOAD_INCOMPLETE` | 동시 편집 · 미완료 업로드 참조 |
| 422 | `URL_NOT_HTTPS` | URL |

#### API-129. 미디어 업로드

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/media` |
| 설명 | 콘텐츠 에디터·가이드 편집의 이미지·영상 업로드. 형식·비율·용량을 검사하고 업로드 ID를 돌려준다. 저장(API-127·128)에서 참조될 때 커밋되며, 참조되지 않은 파일은 정리한다 |
| 구분 | 신규 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-064 · FA-067 · BA-094 · BA-097 |

**Request** (`multipart/form-data`)

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| file | file | 필수 | `.webp`·`.mp4` 등 슬롯이 허용하는 형식 |
| slot | string | 필수 | `DETAIL_BANNER_DESKTOP` · `DETAIL_BANNER_MOBILE` · `KEY_FEATURE_THUMBNAIL` · `GUIDE_STEP_DESKTOP`(2:1 `.mp4`) · `GUIDE_STEP_MOBILE`(1:1 `.mp4`) · `WALLET_GUIDE_MOBILE` … (슬롯별 형식·비율·용량) |
| altText | string | 필수 | 대체 텍스트 |

**Response (201 Created)**

```json
{ "status": "success", "data": { "mediaId": "md_…", "width": 854, "height": 173, "previewUrl": "…" }, "meta": { "requestId": "req_…" } }
```

- 용량 권고(`.mp4` 20 MB · `.webp` 1 MB)는 확정 전 설정값.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 422 | `FILE_TOO_LARGE` | `File exceeds {limit}` |
| 422 | `FILE_TYPE_NOT_SUPPORTED` | 확장자만 바꾼 파일 포함 |
| 422 | `FILE_UNREADABLE` | 손상 |
| 422 | `VALIDATION_ERROR` | 비율·크기 불일치(필요한 형식·비율을 `details`에) |

#### API-130. Spending Estimate 설정

| 항목 | 내용 |
|---|---|
| Method | GET · PUT |
| URL | `/api/admin/cashback-products/spending-estimate` |
| 설명 | 탭 `CEX`·`DEX`별(`SPE-1`)로 `Default Exchange`(`SPE-1b`)와 **파트너마다** 거래량 범위(`SPE-2`~`SPE-4`), 기본 선택 거래량·눈금을 저장한다. 저장은 활성 탭만, 저장 시 계산기 캐시 무효화 → API-002에 즉시 반영 |
| 구분 | 신규 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-027 · FA-068 · BA-058 · BA-098 |

**Request (PUT)**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| version | integer | 필수 | |
| tab | string | 필수 | 저장할 탭 `CEX` / `DEX`. 다른 탭은 바뀌지 않음 |
| defaultExchangeNo | integer | 필수 | `Default Exchange` — `None` 불가, 그 탭 유형의 활성 파트너 |
| partners | object[] | 필수 | 파트너마다 `{ "exchangeNo", "minSpend", "maxSpend" }`. 정수 문자열, 0·음수·소수 불가, `minSpend` < `maxSpend` ≤ 1,000,000,000,000. 그 탭 유형의 활성 파트너만 |
| defaultVolume · ticks | string · string[] | 선택 | 기본 선택 거래량 · 슬라이더 눈금. 범위 밖이면 저장 차단 |
| texts | object | 선택 | 언어별 문구 `{ "{lang}": { blockTitle, description({rate} 치환), howThisWorksLabel, resultLabels[3], sliderLabel, takerMakerLabels[2], flow{ title, nodes[3], edges[2], badge }, cards[2~5]{ title, body }, footnote } }`(REQ-626). 편집 언어 = EN·KO 필수, RU·ID 선택(G-261) |

**Response (200 OK)**

```json
{ "status": "success", "data": { "version": 2 }, "meta": { "requestId": "req_…" } }
```

- 예: `How this works` 표시명을 바꿔 저장 → GET · API-002 모두 `texts.{lang}.howThisWorksLabel`(API-002는 `spendingEstimateTexts.howThisWorksLabel`)로 새 값.
- GET 응답은 두 탭을 같은 구조(`defaultExchangeNo` · `partners[]` · `defaultVolume` · `ticks`)로 준다. 비활성 파트너의 설정은 보존하고 API-002에서만 뺀다.
- 범위 값은 운영자가 입력(G-148).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 최소 ≥ 최대, 기본값이 범위 밖 |
| 409 | `VERSION_CONFLICT` | 동시 편집 |

#### API-131. 발송 대상 해석 (수동 푸시·이메일 캠페인·쿠폰 발송)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/messaging/target-count` |
| 설명 | 수동 푸시 블록 5 `연동한 거래소` · 이메일 캠페인 `거래소` 필터 · `Manual Coupon Send` `Linked Exchanges`에 DEX 그룹을 넣고, 발송 전 대상 인원을 계산한다. 연동 거래소 기준은 `연동 완료`만 센다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-056 · FA-057 · FA-058 · BA-087 · BA-088 · BA-089 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| channel | string | 필수 | `PUSH` / `EMAIL_CAMPAIGN` / `COUPON` |
| linkedExchanges | object | 선택 | `{ "scope": "DEX" }` 또는 `{ "exchangeNos": [41, 42] }`, `NOT_LINKED` 포함 가능 |
| otherBlocks | object | 선택 | 기존 블록(회원 구분·커미션 캐시백·이벤트 리워드·출금 여부·날짜) — CEX+DEX 합산 여부 G-301 · G-303 확정: DEX 기준일 = 연동일 · 금액/날짜 선택지는 기존 그대로 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "targetCount": 1240, "computedAt": "…" }, "meta": { "requestId": "req_…" } }
```

- 딥링크 목적지 추가: `Cashback Landing page` · `DEX List page` · `DEX Detail page`(수동 푸시).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 조건 형식 오류 |

#### API-132. 내보내기

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/exports` |
| 설명 | 목록 화면의 필터 조건 그대로 파일을 만든다. 지갑·회원 식별자가 들어간 대상은 `Exports` 권한 필요. 내보낸 행위를 필터 조건과 함께 감사 기록 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | `Exports` capability |
| 관련 기능 | FA-029 · FA-044 · BA-060 · BA-075 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| target | string | 필수 | `DEX_CASHBACK_RECORDS` · `RECONCILIATION` · `LINKING_AUDIT` · `ACCOUNT_LIST` · `INVITE_MEMBER_VIEW` · `INVITE_MONTHLY` · `DEX_REPORT` … |
| filters | object | 필수 | 해당 목록 검색 본문과 같음 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "mode": "IMMEDIATE", "downloadUrl": "…", "rows": 840 }, "meta": { "requestId": "req_…" } }
```

- 대량은 `mode: "BACKGROUND"` + 완료 알림 + 만료 링크(10,000행 기준·7일 만료·수식 이스케이프 G-232 확정: 10,000행까지 즉시, 초과 시 백그라운드 + 알림 + 7일 만료 링크 · `=` `+` `-` `@` 이스케이프).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | `Exports` 권한 없음 |

#### API-133. 감사 로그

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/audit-logs` |
| 설명 | 거래소 레코드 DEX 필드 변경·Exchange Type 지정·설정값·정정·내보내기 등 감사 레코드를 조회한다(연동 행위는 API-110) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master |
| 관련 기능 | FA-030 · BA-061 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| from · to | string | 필수 | UTC |
| target | string | 선택 | `EXCHANGE` · `DEX_SETTINGS` · `CORRECTION` · `RECONCILIATION` · `EXPORT` · `CONTENT` |
| actor | string | 선택 | 운영자 또는 `System` |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "at": "…", "actor": "admin_02", "target": "EXCHANGE", "targetId": "41", "language": null, "field": "settlementCurrency", "before": "USDC", "after": "USDT", "reason": "…" } ], "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | Master 아님 |

#### API-134. 글로벌 리그 생성 (DEX 운영 거래소)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/admin/global-leagues` |
| 설명 | 생성 폼의 운영 거래소에 DEX 4곳을 추가한다(Lighter 포함, G-428). 나머지 필드·제약 기존 그대로, 리그 1개 = 거래소 1개, DEX 리그 생성 시 혜택 카드 자동 생성 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-060 · BA-091 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | DEX 포함 |
| titleKo · titleEn · subtitleKo · subtitleEn | string | 필수 | 각 50자 |
| bannerMobile · bannerPc · ogKo · ogEn | file/ID | 필수·선택 | 5MB WEBP |
| seoTitleKo · seoTitleEn · seoDescKo · seoDescEn | string | 필수 | ≤ 35 · 60 · 70 · 140자 |
| prizes | object[] | 필수 | 순위별 상금(USDT, 이벤트 리워드로 지급) |
| phases | object | 필수 | P0~P6 각 1~60일, 00:00 UTC 시작 |

**Response (201 Created)**

```json
{ "status": "success", "data": { "leagueId": "gl_…", "url": "/golbal_league_{exchangename}_for_team_{n}", "benefitCardCreated": true }, "meta": { "requestId": "req_…" } }
```

- URL의 `{exchangename}` DEX 값 G-398 확정: 슬러그(`apex` · `edgex` · `aster`). 점수 = 커미션 캐시백.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 누락 → 알럿 + 칸 아래 빨간 안내 |
| 400 | `CONFIRMATION_REQUIRED` | `Do you wish to register the league as is?` 미확인 |

#### API-135. DEX 리포팅

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/dex/reports` |
| 설명 | 기간·필터별 DEX 리포트(합산 USDT, USDC 정산 DEX의 커미션 수치는 USDC 유지), DEX별 요약(`RPT-5`, Lighter 포함), Aster 월 상한 소진율 |
| 구분 | 신규 |
| 권한 | Master · Operator · PM |
| 관련 기능 | FA-026 · FA-055 · BA-030 · BA-057 · BA-086 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| report | string | 필수 | `SUMMARY` · `DEX` · `ASTER_CAP` |
| from · to | string | 필수 | |
| exchangeNo | integer | 선택 | |

**Response (200 OK)**

```json
{ "status": "success", "data": { "report": "ASTER_CAP", "month": "2026-11", "capUsdt": "20000", "usedUsdt": "…", "usageRate": "…", "source": "AUTO" }, "meta": { "requestId": "req_…" } }
```

- Aster 상한 초과 처리 G-039·G-344 확정: Lighter 주간 요약 · ApeX/EdgeX 요약 유지, Aster 바인딩 리포트 삭제 → 월 상한 소진율 리포트로 대체(소진율 자동/수동은 G-039 회신 후). 내보내기는 API-132(`DEX_REPORT`).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 기간 누락 |

#### API-136. 퀴즈 이벤트 설정 (DEX 거래소 · 점수별 보상)

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | 기존 `Event > Quiz`(`/event/quiz`) 등록·수정 API — 경로 문자열은 확인하지 못했다 |
| 설명 | 기존 퀴즈 이벤트 등록·수정에 DEX 거래소 선택과 점수 0 / 1 / 2별 보상 단계 금액을 더한다(REQ-606). 거래소 선택지는 API-101 목록에서 고른다 |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 등록·수정 Master · Operator · PM / 조회 CS(기존 규칙) |
| 관련 기능 | FA-062 · BA-093 |

**Request** (추가·변경 필드만)

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeNo | integer | 필수 | 퀴즈 거래소. DEX 선택 가능, 등록 후 수정 불가, 한 번에 한 거래소 |
| rewardTiers | object[] | 필수 | 점수 단계별 보상 `[{ "score": 0, "amount": "…" }, { "score": 1, "amount": "…" }, { "score": 2, "amount": "…" }]` — USDT 10진 문자열, 금액 값 G-205 확정: 콘텐츠(문항·해설·아티클)는 운영 작성 · 보상 단계 금액은 백오피스 설정 · 제출 시 완료(점수 무관), 재응시 없음 |
| version | integer | 수정 시 필수 | 동시 편집 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "quizNo": 31, "exchangeNo": 41, "rewardTiers": [ { "score": 0, "amount": "…" }, { "score": 1, "amount": "…" }, { "score": 2, "amount": "…" } ], "version": 2 }, "meta": { "requestId": "req_…" } }
```

- DEX 모듈 4·5는 최초 채점 완료 후 재응시 불가(G-205·207). 기존 운영 규칙은 퀴즈 쿠폰 30일 · 사전 공개 최소 1일 · 종료 후 7일 노출 · 합계 최대 90일.
- 보상 경로 = 현행 퀴즈 쿠폰 경로(G-206). 사용자 채점 결과는 API-020.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 400 | `VALIDATION_ERROR` | 단계 누락 · 금액 형식 오류 |
| 403 | `FORBIDDEN` | 권한 없음 |
| 409 | `VERSION_CONFLICT` | 동시 편집 |
| 422 | `VALIDATION_ERROR` | 등록 후 거래소 변경 시도 |

#### API-137. 소유 확인 큐 — DEX 지갑 신청 포함

| 항목 | 내용 |
|---|---|
| Method | 기존 Method 유지 |
| URL | 기존 `Account > Ownership Verification`(`/UID/ownership`) · `Ownership Verification Restrictions`(`/UID/restrict`) API — 경로 문자열은 확인하지 못했다 |
| 설명 | 기존 소유 확인 큐의 조회·영상 재생·승인·거절에 DEX 지갑 신청을 더한다. 승인하면 지갑을 신청자 계정으로 이전하고 이전 보유자 행을 해제하며 FCM 24·25를 보낸다(REQ-729) |
| 구분 | 기존·변경 ⚠경로 |
| 권한 | 기존 규칙 그대로 |
| 관련 기능 | FA-047 · BA-013 · BA-078 |

**Request** (추가·변경 필드만)

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| exchangeType | string | 선택 | 목록 필터 `ALL` / `CEX` / `DEX` |
| decision | string | 판정 시 필수 | `APPROVE` / `REJECT` |
| reason | string | 거절 시 필수 | 심사자 입력. 표준 사유: 영상 속 주소 불일치 · 연결 해제·재연결 장면 없음 · 주소가 다 보이지 않음 · 다른 DEX · 재생 불가 · 편집된 영상 |

**Response (200 OK)** (목록의 DEX 행)

```json
{ "status": "success", "data": { "items": [ { "possessionNo": 9123, "tuid": "T…", "exchangeType": "DEX", "exchangeNo": 41, "walletAddress": "0x7a3F9c…51E9", "currentHolderTuid": "T…", "status": "PROCESSING", "requestedAt": "2026-11-24T03:10:00Z", "recordingUrl": "(백오피스 안 스트리밍 전용)" } ] }, "meta": { "requestId": "req_…" } }
```

- 백오피스는 지갑 전체 주소를 표시한다. 녹화는 비공개 저장 · 백오피스 안 스트리밍만(REQ-732).
- 관리자 응답이 10분 안에 없으면 시스템이 자동 실패 처리한다(기존 CEX). 신청 접수 알림은 기존 소유 확인 Slack 채널.
- 지갑 연동 시도 횟수 초과를 제한 타입으로 넣을지 G-063 확정: 1차 출시 미도입 — 기존 CEX처럼 캡차만. REQ-073 다이얼로그·어드민 제한 타입 추가 안 함.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 권한 없음 |
| 409 | `ALREADY_ACTIONED` | 다른 운영자가 먼저 처리 · 10분 자동 실패 후 판정 시도 |
| 422 | `VALIDATION_ERROR` | 거절 사유 없음 |

#### MB-API-115. 맥스보드 생성 거래소 목록

| 항목 | 내용 |
|---|---|
| Method | GET |
| URL | `/api/admin/maxboard/exchanges` |
| 설명 | 빙고판 생성 대상 거래소(단일 선택)에 ApeX·EdgeX·Aster를 추가한다. 기존 백오피스 맥스보드 API(API-101·105~112)는 `uid` 자리에 지갑 주소를 담는다(참여 지갑 수 · 리더보드 `uid` 전체 · 참여자 검색 · CSV `uid` 열 · `summary.uid` · 반영 지갑 수 · 어뷰징 제외 `uid`) |
| 구분 | 기존·변경 |
| 권한 | MASTER · OPERATOR · PM · CS |
| 관련 기능 | FA-019 · FA-061 · BA-045 · BA-092 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| — | — | — | 없음 |

**Response (200 OK)**

```json
{ "status": "success", "data": [ { "code": "BITGET", "name": "Bitget" }, { "code": null, "name": "ApeX" } ], "meta": { "requestId": "req_…" } }
```

- DEX `code` 값 G-318 확정: `LIGHTER` · `APEX` · `EDGEX` · `ASTER`(기존 대문자 규칙). Lighter 처리 G-317 확정: ① 목록에서 뺌(Lighter 보류 중)(목록 제외 / `INVALID_EXCHANGE` / 운영 판단). 참여자 검색의 지갑 부분 일치 대소문자 처리는 G-062와 같은 결정.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 403 | `FORBIDDEN` | 권한 없음 |

### 웹훅 수신 API

공통(REQ-200): 유효한 파트너 서명만 받는다(ApeX는 IP 허용 목록도). 서명 오류·IP 밖이면 거부하고 기록만 남기며 레코드를 쓰지 않는다. **웹훅은 트리거다** — 원장 조회로 확인할 수 없는 레코드를 만들지 않고, 받은 이벤트에 해당하는 원장·귀속을 파트너 API로 다시 조회한다. 중복 제거 키 = 파트너 `event_id`/`eventId`. 처리 결과와 관계없이 서명이 맞으면 `200`을 빨리 돌려준다(파트너는 200을 받을 때까지 24시간 백오프 재시도).

#### API-201. ApeX 웹훅 수신

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/webhooks/dex/apex` |
| 설명 | ApeX 신규 귀속·Pending→Paid 이벤트를 받아 해당 원장·귀속 조회 작업(JOB-D02)을 깨운다 |
| 구분 | 신규 |
| 권한 | ApeX 서명 + IP 허용 목록 |
| 관련 기능 | BA-025 · BA-028 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| 서명 헤더 | string(header) | 필수 | 서명 방식 ❓ G-024(➜ HMAC-SHA256 제안) |
| event_id | string | 필수 | 중복 제거 키 |
| event_type | string | 필수 | 신규 귀속 / 상태 변경(Pending→Paid) |
| payload | object | 필수 | `wallet_address` · `account_id` · 이전/신규 상태 · `record_id` · 갱신 시각(요청안 기준, 확정 ❓ G-024) |

**Response (200 OK)**

```json
{ "status": "success", "data": { "result": "PROCESSED" }, "meta": { "requestId": "req_…" } }
```

- `result` = `PROCESSED` / `DUPLICATE`. 거부는 아래 에러로 응답하고 `Webhook log`에 `Rejected` + 사유.

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `SIGNATURE_INVALID` | 서명 불일치 |
| 403 | `IP_NOT_WHITELISTED` | 허용 목록 밖 IP |
| 400 | `VALIDATION_ERROR` | `event_id` 누락 |

#### API-202. EdgeX 웹훅 수신 (로드맵)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/webhooks/dex/edgex` |
| 설명 | EdgeX 일별 리베이트 푸시·`user.rate_changed`를 받는다. 포맷은 EdgeX 통합 문서 수신 후 확정(⏳ G-033). 수신 전에는 JOB-D03 일 1회 조회만으로 운영 |
| 구분 | 신규 |
| 권한 | EdgeX 서명(`X-edgeX-*` HMAC-SHA256 제안) |
| 관련 기능 | BA-025 · BA-029 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| eventId | string | 필수 | 중복 제거 키 |
| type | string | 필수 | 일별 리베이트 / `user.rate_changed` |

**Response (200 OK)**

```json
{ "status": "success", "data": { "result": "PROCESSED" }, "meta": { "requestId": "req_…" } }
```

- `user.rate_changed`는 거래소 레코드의 EdgeX `registrationRate`(읽기 전용)를 갱신하고 감사(`System`).

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `SIGNATURE_INVALID` | 서명 불일치 |

#### API-203. Aster 웹훅 수신 (요청 단계)

| 항목 | 내용 |
|---|---|
| Method | POST |
| URL | `/api/webhooks/dex/aster` |
| 설명 | Aster 웹훅은 요청했으나 회신이 없다(⏳ G-035). 경로·검증 틀만 만들고 비활성 상태로 둔다 |
| 구분 | 신규 |
| 권한 | Aster 서명(현존 규약 EIP-712 에이전트 서명 — 웹훅 서명 방식 미정) |
| 관련 기능 | BA-025 |

**Request**

| 파라미터 | 타입 | 필수 | 설명 |
|---|---|---|---|
| eventId | string | 필수 | 중복 제거 키 |

**Response (200 OK)**

```json
{ "status": "success", "data": { "result": "PROCESSED" }, "meta": { "requestId": "req_…" } }
```

**에러 Response**

| 상태 코드 | 에러 코드 | 조건 |
|---|---|---|
| 401 | `SIGNATURE_INVALID` | 서명 불일치 |
| 404 | `NOT_FOUND` | 비활성(설정 꺼짐) |

## 내부 작업 (스케줄러·이벤트)

엔드포인트가 아니라 배치 워커·이벤트 소비자로 동작하는 작업입니다. 주기·임계값은 전부 설정값(API-124·거래소 레코드)이며 코드 상수로 두지 않습니다. 모든 작업은 실행 기록(시작·종료·결과·건수·오류)을 남기고, 실패해도 기존 데이터를 지우거나 0으로 만들지 않습니다.

| 작업 ID | 이름 | 트리거·주기 | 처리 | 출력 | 실패 처리 | 관련 기능 |
|---|---|---|---|---|---|---|
| JOB-D01 | Lighter 폴링 — 제외(G-428, Lighter도 공통 수집 JOB) | 시간당(레이트리밋 분당 8회 / Builder 80회 안에서) | `userReferrals`(커서, 최대 300) → 귀속 캐시(마스킹 주소·`is_eligible`·바인딩 시각) 갱신 · `referral/stats`(최근 12주) → 주중 추정치 · main account `transfer_history?type=ReferralProgramPayout` → 주간 이체 | 귀속 캐시, 추정치, 이체 내역 | 연속 실패 → 수집 상태 `DEGRADED`·운영 알림 `Polling failing`(JOB-D12). 캐시가 비면 연동은 확인 중으로 접수 | BA-021 · BA-027 |
| JOB-D02 | ApeX 원장 수집 | 시간당(정산 후 1시간 내) + API-201 트리거 | 원장 조회 → `record_id` 멱등 저장 → JOB-D05 | ApeX 원장 레코드 | 표준 원장 5필드(G-021). 백오프 재시도 | BA-021 · BA-028 |
| JOB-D03 | EdgeX 원장 수집 | 일 1회(01:00 UTC 이후) | 회원당 하루 1건 레코드 `id` 멱등 저장, `payoutId`·`transferId`·`collateralTransactionId` 대조 참조 저장, 0.01 USDC 미만·지급 실패 이월 처리 → JOB-D05 | EdgeX 원장 레코드 | 엔드포인트 ⏳ G-031. 03:00 UTC까지 미도착이면 지연(임계 G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간) | BA-021 · BA-029 |
| JOB-D04 | Aster 원장 수집 | 일 1회(09:00 UTC 공개 후) | `tranId` 멱등 저장, `usdtValue`·`payoutPrice`·`priceTime` 보관, 월 상한 소진율 갱신 → JOB-D05 | Aster 원장 레코드, 소진율 | 🔴 엔드포인트·필드 ⏳ G-035·G-373. `usdtValue` 누락 행 거부 | BA-021 · BA-030 |
| JOB-D05 | 캐시백 산정·적립 | 원장 저장 이벤트 | 행 검증(필수 키·주소·레퍼럴 코드) → 매칭(거래일에 주소 + DEX를 연동 완료로 보유한 회원, 주소 형식별 비교. 없으면 미연동 지갑 적립분으로 보관 — 그 지갑에 연동 신청이 들어오면 API-007 · API-109 · JOB-D07이 연동 전 잔액 처리. 이미 연동 완료된 지갑의 연동 신청 시각 이전 거래분이면 도착 시 늦게 온 연동 전 금액 판정 — REQ-721, 정책 5-6 ⑪. 거래 시각 없이 하루 1건인 원장(EdgeX)은 레코드 날짜 < 연동 신청 날짜(UTC)일 때만 연동 전, 신청 당일 레코드는 연동한 회원 몫 — G-436) → 산정식 적용 → 2자리 절삭 적립 → 늦은 레코드면 합계·요약·랭킹 재계산 → UID 예외 등록 지갑 제외 → 수집 상태 `LIVE` 갱신 · FCM 103 이벤트 · 맥스보드 원장 완료 상태(JOB-D14) | 회원 적립, 미연동 지갑 적립분, 거부 레코드(사유) | 산정식 = `총 커미션 × (1 − 마진율)`(G-046). 멱등 키(❓ G-332)로 1회 적립 보장 | BA-022 · BA-023 · BA-024 · BA-031 |
| JOB-D07 | 확인 중 연동 자동 재확인 | 설정 주기 | **귀속 확인 대기**(`manual_link_pending` 중 `PARTNER_LOOKUP`) 건만 파트너 조회로 다시 판정 — 송금 대기 건은 대상 아님(REQ-722) → 확정이면 연동 전 잔액 처리(REQ-107 — 10 USDT 미만은 바로 `연동 완료`·이관, 이상은 그 지갑으로 출금 후 자동 연동)·알림 1회, 확정적 거절이면 실패·알림 1회, 15분마다 최대 4회 뒤에도 미확정이면 운영 Slack 알림(자동 만료 없음) | 상태 전이 | G-068 확정 | FA-005 · FA-010 · BA-005 · BA-010 |
| JOB-D08 | 제한 지역 동기화 | 매일 1회 | 파트너 restrictions API → DEX 레코드 `제한 지역` 후보 갱신(운영자 편집값 보존, 감사 `System`) | 제한 지역 | 실패 시 마지막 값 유지 + 운영 알림 | FA-036 · BA-067 |
| JOB-D09 | DefiLlama 캐시 갱신 | 설정 주기(24시간 캐시) | TVL `api.llama.fi/tvl/{slug}` · 24H 거래량 `/summary/derivatives/{slug}`(slug `aster`·`lighter`·`edgex`·`apex-protocol`) | 지표 캐시 | 실패 시 24시간은 마지막 값(`stale`), 그 뒤 `null` | FA-014 · BA-040 |
| JOB-D10 | 지급 실행 (Wallet B) | 자동 지급 신청 생성 이벤트(API-011 · API-018) · 연동 전 잔액 출금 요청(API-007 · API-109 · JOB-D07, REQ-107) + 재시도 스케줄 | **지급 구분 `payoutKind`** = `MEMBER_AUTO`(회원 자동 지급) / `PRELINK`(연동 전 출금, REQ-720 · REQ-721). 계정별 1건: 송금 직전 대조(레퍼럴 코드·지갑·DEX 계정 ID) → 네트워크 설정 확인 → Wallet B 잔액 확인(부족 = 지연, 다음 충전 후) → 송금(요청액 = 도착액, 가스 테더맥스 부담) → 확정 시 tx 해시 저장 `SENT` · 드롭·리버트·가스 급등·nonce 충돌·혼잡은 재시도 · RPC 타임아웃은 재전송 없이 결과 확인 · 재시도 소진 시 `FAILED` + 그 계정 금액만 **그 요청이 차감한 잔액**으로 전액 복원 — 지급 요청에 차감 잔액 종류 `debitSource`를 저장해 참조(`ACCOUNT_BALANCE` = 캐시백 자동 지급(API-011) → 그 계정의 회원 잔액 / `INVITATION_REWARD` = 초대 리워드(API-018) → 회원의 `Available Invitation Rewards`, 지갑 캐시백에 더하지 않음 / `PRELINK_BALANCE` = 연동 전 출금 → 그 계정의 연동 전 잔액, 연동 신청 중이면 연동 실패이고 송금 대기 중 따로 보관한 늦은 금액과 합쳐 미연동 보관 — 정책 5-6 ⑧·⑩) · 성공 후 `MEMBER_AUTO`만 TP·초대 리워드 실적·첫 출금 혜택 반영(자동 지급 완료 = 출금), `PRELINK`은 혜택 없이 연동 신청 중이면 연동 완료 1회(정책 5-6 ⑦) · 상태 변화마다 JOB-D16 | 지급 기록, 잔액 복원, 결과 알림 이벤트(JOB-D13) | 계정별 지급 최대 1회(모든 재시도에서). 재시도 값 G-117 확정(설정 필드) · ❓ G-118·G-120, 대조 불일치 G-121·G-122 확정 | FA-005 · BA-005 · BA-018 · BA-032 · BA-034 · BA-035 · BA-050 · BA-051 · BA-104 |
| JOB-D12 | 수집 상태 판정·운영 알림 | 수집 실행 후 + 주기 점검 | DEX별 `LIVE`/`DEGRADED` 판정(예정 시각 + 임계), 운영 알림 공통 규칙(조건 시 1건, 해소까지 최대 24시간에 1번, 해소 시 종료): 귀속 확인 대기 자동 재확인 4회 초과(운영 Slack) · `Degraded` · 수집 실패 · 확정 기한 · Lighter `Polling failing`·`Weekly CSV late` · ApeX `ledger delayed`·중복 지갑 신청 · 원장 D+1 미도착 · Wallet B 부족 · Aster 상한 초과 · 오프보딩 DEX 데이터 유입 | 수집 상태, 운영 메시지 | 알림에 지갑·UID·DEX 계정 ID 금지. 임계 G-348 확정: 예상 도착 + 2시간 — ApeX 2시간 · EdgeX 03:00 UTC · Aster 11:00 UTC(G-036 따라 조정) · Lighter 일일 원장(G-428) — 도착 시각 회신 후 같은 규칙 · 공통 24시간 | BA-025 · BA-107 |
| JOB-D13 | 회원 알림 발송 | 상태 확정 이벤트 | 연동(FCM 100·101·102, EMAIL 30·31·32) · 적립(FCM 103 — ApeX는 회원별로 하루치를 모아 1회, 본문 금액 = 그날 적립 합계: 시간당 적립 24건 → 푸시 1건. 날짜 경계·발송 시각 ❓ G-427) · 보류(FCM 106) · 출금(발송 여부·단위는 현행 정책 — DEX 지갑 완료·실패 푸시는 FCM 104·105, 출금 메일) · EMAIL 28·29 · 기존 행 DEX 분기(FCM 26·27·29·31·32·36·37~41·63~67, EMAIL 16~20·24·25) · 맥스보드 95~99 | 발송 기록 | 이벤트·회원당 1회(이벤트 ID 멱등). 발송 실패해도 판정 유지 + 실패 기록, 수동 재발송 | BA-018 · BA-035 · BA-046 · BA-101 · BA-102 · BA-103 · BA-104 · BA-105 · BA-106 |
| JOB-D14 | 맥스보드 원장 완료 연계 | 원장 저장·마감 | (거래소, 반영일)별 원장 완료/미완료 상태 생성 → 빙고 Batch(설정값 12:30 UTC)가 미완료 날짜를 끊김으로 판정하지 않고 다음 Batch로 넘김 → `batchDelayed` 판정 | 반영일별 완료 상태 | 정정이 이미 반영된 날짜에 생기는 경우 ❓ G-390 | FA-018 · BA-044 |
| JOB-D15 | 10분 주기 자동 지급 | **10분마다** | 회원의 계정별 출금 가능액을 잔액 서비스(API-010과 같은 계산)로 확인 → `A + MIN(B, A)` ≥ 10 USDT인 계정(확인 중 계정 제외, 회원의 CEX UID · DEX 지갑, 모든 CEX)이 하나라도 있는 회원마다 그 회원의 자격 계정을 묶어 **기존 출금 신청 API(API-011)를 1회 호출**(멱등 키 = 회원 · 주기) → 초대 리워드(파트너 허브 제휴사 포함)는 API-018 호출 → **연동 완료 계정 중 연동 전 잔액(늦게 온 연동 전 금액 · 연동 전 출금 실패 복원분)이 남은 계정을 다시 판정**: 10 USDT 이상이면 `PRELINK` 출금 요청(JOB-D10, API-011 아님), 미만이면 회원 잔액으로 이관(정책 5-6 ⑪). 회원 보안 제한(72h/24h)·인증 없음 | 출금 신청(계정별 요청 · 선차감) | 주기 겹침·타임아웃 재시도에도 신청 1건(멱등 + 선차감). 생성 실패는 차감 없이 다음 주기 재확인. 회원이 끄는 설정 없음(항상 자동). 이미 운영 중 — DEX 지갑은 배포 시점부터 대상 | BA-017 |
| JOB-D16 | 지급 결과 분석 이벤트 | 지급 상태 변화(JOB-D10) | DEX 지갑 지급이 `processing` / `sent` / `failed`에 도달하면 백엔드가 분석 이벤트를 서버 이벤트로 전송(웹 `dexw82 webwithdraw_payout_result` · 앱 `DX-AP-08` result 대응). 속성 status · venue. 금액·지갑·해시 없음 | 분석 이벤트 | 전송 실패가 지급 처리에 영향을 주지 않음 | BA-018 |

## 부록. 파트너 API (테더맥스가 호출하는 외부 API)

테더맥스 서버가 백엔드에서만 호출합니다(읽기 전용 키, 클라이언트 노출 금지, IP 허용 목록). 상태 표기: ✔ = 파트너 확인 · ➜ = 우리 요청(미확정) · ⏳ = 회신 대기. 이 표는 정책 부록 E-6·E-7의 사실 기록이며, 바뀌면 정책을 먼저 고칩니다.

| DEX | 용도 | 엔드포인트 | 상태 | 쓰는 곳 |
|---|---|---|---|---|
| Lighter | 표준 요건 API | 단건·대량 귀속 조회(지갑 비마스킹) · T-1 일일 원장(지갑 · `trade_type` · `fee_paid` · `commission` · `referral_code`) — 엔드포인트는 회신 후 | ✔ | 공통 수집 JOB(표준 요건 수락 전제, G-428) |
| ApeX | 귀속 조회 | `POST api/clients`(`wallet_address`) — `is_partner_referral`·`AccountID` | ✔ 구 API, 신규 ❓ G-022 | API-007 |
| ApeX | (사용 안 함) 하위 제휴사 고객 확인 | `POST /v2/api/subs/client/check` | — | 테더맥스 직속 판정에 쓰지 않음 |
| ApeX | 원장 | 표준 요건 T-1 일일 원장(5필드) — 엔드포인트는 회신 후 | ✔ | JOB-D02 |
| ApeX | 웹훅 | 이벤트·payload "개발 완료 후" | ⏳ G-024 | API-201 |
| EdgeX | 귀속 단건 조회 | "attribution endpoint"(Alignment D2·D3 원칙 수락, 경로·파라미터 통합 문서 대기). 요청안 `GET /api/v2/partner/referral/getReferralByEthAddress?ethAddress=`(v1.2 초안, 발송 기록 없음). 가입을 끝낸 사용자만 반환 | ⏳ G-031 · G-345 · G-346 | API-007 |
| EdgeX | 리베이트 레코드 | 회원당 일 1건(`id` · `partnerCommissionAmount` · `payoutId` · `transferId` · `collateralTransactionId` · `accruingAmount` · `pendingAmount` · `totalPaidAmount`), 01:00 UTC까지 조회 가능 | ✔ 구조 / ⏳ 경로 | JOB-D03 |
| EdgeX | 웹훅 | 일별 리베이트 푸시 + `user.rate_changed` | ✔ 있음 / 포맷 ⏳ G-033 | API-202 |
| Aster | 귀속 조회 | `GET /fapi/v3/referral/userStatus?address=` → `address` · `userId`(있으면) · `isTethermaxReferral` · `bindTime` · `rebateRate` | ➜ 요청안(PM 구두 수락, 사양·일정 없음) ⏳ G-035 | API-007 |
| Aster | 리베이트 원장 | `GET /fapi/v3/referral/userIncome?address=&incomeType=REFERRAL_KICKBACK,COMMISSION_REBATE&startTime=`(`tranId`·`address`·`incomeType`·`asset`·`feeBasis`·`income`·`payoutPrice`·`priceTime`·`usdtValue`) | ➜ 요청안 🔴 G-035 · G-373 · G-038 | JOB-D04 |
| Aster | 현존 API(대체 불가) | `GET /fapi/v3/income`(계정 소유자만 — 추천 사용자 리베이트를 테더맥스가 읽을 수 없음) · `/fapi/v3/builder/userTrades` · `/builder/userCommissionRates` · `/builder/userBalances` · `/builder/approvedUserList` | ✔ 현존이나 귀속·원장 용도로 쓸 수 없음 → 요청안 API 없이는 출시 차단 | — |
| 4곳 공통 | 제한(restrictions) | 파트너별 | ApeX만 회신 | JOB-D08 |
| 외부 | DefiLlama | `api.llama.fi/tvl/{slug}` · `/summary/derivatives/{slug}` | TVL ✔ / 24H 거래량 G-349 확정: `api.llama.fi/summary/derivatives/{slug}` · 캐시 24시간 · 24시간 뒤 숨김 | JOB-D09 |

**호출 규약(공통, 정책 E-7-5)** — HTTPS(ApeX TLS 1.2+) · 읽기 전용 키 · 금액 소수 문자열 · 시각 UTC(ApeX ISO 8601 / EdgeX·Aster·Lighter 밀리초) · `429` + `Retry-After` 존중 · 조회 기간 최대 180일 · 개인정보(이름·이메일·IP·KYC) 미수신(ApeX `api/clients`의 `mobile`·`email`은 저장하지 않음) · 레코드 불변·정정은 원본 ID 참조 새 레코드.

## 추적성

- 이 문서의 모든 엔드포인트·내부 작업은 백오피스 기능명세서(FA · BA) 또는 사용자 기능명세서의 기능 하나 이상에서 참조됩니다. 「관련 기능」은 기능명세서 4종의 「관련 API」를 역으로 모은 값입니다(조립 스크립트 확인).
- 10분 주기 자동 지급의 원본은 정책 6-1 · 요구사항 REQ-706 · REQ-155 · REQ-258입니다.
- 비기능 요구사항(감사·동시 편집·식별자 보호 등)은 「API 공통 사항」에 반영했고 원문은 요구사항정의서 2장입니다.
- 파트너 API 사실관계의 원본은 정책 부록 E-6·E-7입니다.
