# API 스펙 — 백오피스

| 항목 | 내용 |
|------|------|
| 프로젝트명 | TetherMax 신규 회원 빙고 이벤트 (서비스명: 맥스보드 / MAX BOARD) |
| 작성일 | 2026-10-01 |
| 버전 | v1.5 (2026-10-12 정합성 점검 반영(확정 2026-10-12, 2.1 공통 에러·5장 내부 작업은 사용자 문서 기준으로 동기화): 참여 UID 끊김 원인 = 소유권 이전·이슈 UID, `ParticipantStatus` RESET(참여 기간)/FORFEITED(집계 시작 이후~지급 전) 재정의, `resetReason` `OWNERSHIP_TRANSFER`/`ISSUE_UID`(`UNLINKED` 삭제), `EligibilityState` `RESELECT_REQUIRED`, API-106 상태 즉시 표시·순위 고정·`vacantReason` 정리·`finalized`·기본 size, `BatchResult` `PENDING`·누락 확정 시 실행 중단·`recoveryState`, 복구 재계산 범위·`applied` 판단 시점·`SOURCE_CORRECTED`, 지급 후 UID 변경 이력 `UID_LOST_AFTER_PAYOUT`, 캐시 무효화 이벤트, 사용자 API-002 필드 매핑 참조, CS 버튼 근거, API-107 `resetReason` 쿼리, `INVALID_IMAGE_REF`, 최상위 `VALIDATION_ERROR` + `fields[].code`, 확정 이후 예상 지급액, 에러 검사 순서·강제 종료 시 복구 중단, `RANKING_DISABLED` 2.2 추가, 강제 종료·복구 팝업 문구 통일, 근거 문서 표기, 사용자 문서 REQ 참조 표기) / v1.4 (2026-10-07 PRD v0.11·요구사항 v1.6 확인: 백오피스 변경 없음(메뉴 위치 리그/보드 > 맥스보드 목록은 기존 반영). 사용자 화면 변경(REQ-116~123)은 사용자 문서, 공통 로직 변경 없음) / v1.3 (2026-10-05 PRD v0.10 반영(어뷰징 제외 미안내, 소유권 이전·이슈 UID 처리, 내 리워드 빈 상태, 랭킹 리워드 총액·등수별·컬럼, 연속 막대, 유의사항 한 열, 요구사항 추적 정비) / 2026-10-02 변경 반영: 배치 복구 사유 입력 폐지, 사용자 화면 시각 로컬 변환, 배치 시각 거래소별 예시 삭제, 최종 수상자 리더보드 지급 기간까지 노출, 이메일 지급일 UTC 날짜 표기, 유의사항 UTC 문구 예외 명시, 빙고 Batch 도입, 사용자 API `nextUpdateAt` 삭제 반영(어드민 API `scheduledAt`은 유지), 리워드 "지급 → 적립" 표현 통일, 빙고 Batch 자체 누락일·페이백 배치 미완료일 연속 판정 확정, 마지막 날 빙고 Batch 이후 완성자 최종 순위 반영(공통 로직), 집계 중 순위와 최종 순위 차이·결과 발표 재산정 확정 표기(공통 로직), 집계 시작 시 랭킹 재산정(JOB-03·JOB-04·JOB-05 공통 로직, API-106 ① 현황 리더보드 반영, 집계 중 순위와 최종 순위 차이는 비운 자리만), PRD v0.9 반영) |
| 대상 독자 | 백오피스 개발자 |
| 범위 | 어드민 API 16종(API-101~116) + 내부 작업 11종(JOB-01~11, 공통) |
| 근거 문서 | PRD.md v1.0(개요, 상세 이력은 Git v0.11), 분할문서/백오피스/요구사항정의서_ko.md, 기능명세_프론트_ko.md, 기능명세_백엔드_ko.md |

> 이 문서가 기준 문서다(통합본 없음, 2026-10-01 정리).
> 배치·이벤트로 동작하는 **내부 작업(JOB-01~11)은 사용자·백오피스 문서에 같은 내용으로 중복 수록**한다. 내부 작업을 고칠 때는 두 문서를 함께 고친다.
> 사용자 API(API-001~007)는 `분할문서/사용자/API스펙_ko.md`에 있다. 본문에 나오는 API-00x는 그 문서를 가리킨다.

---

## 1. API 공통 사항

### 1.1 기본 정보

| 항목 | 내용 |
|------|------|
| 사용자 API Base | `/api/maxboard` |
| 어드민 API Base | `/api/admin/maxboard` |
| 배치 위치 | M1~M4: Next.js Route Handlers(`src/frontend/app/api/*`), Vercel 통합 배포. 내부 작업은 별도 배치 워커/크론(인프라아키텍처 #10에서 확정) |
| 응답 형식 | JSON (`Content-Type: application/json; charset=utf-8`). CSV 다운로드만 `text/csv` |
| 문자 인코딩 | UTF-8 |
| 시간 표기 | 모든 일시는 **UTC ISO-8601** (`2026-10-15T03:20:00Z`). 날짜만 필요한 값은 `YYYY-MM-DD`(UTC 날짜). API는 사용자·어드민 모두 UTC로 내려주며 변환하지 않는다. **사용자 화면**은 프론트가 기기 로컬 시간으로 변환해 표시하고(기간은 날짜+시각 함께), **백오피스 화면**은 UTC 그대로 표시한다(2026-10-02 변경). 사용자 화면에는 "UTC"나 타임존 표기(GMT+9 등)를 붙이지 않는다. 예외: 공통 유의사항 문구(프론트 고정)는 UTC 기준 안내("모든 기간과 시각은 UTC 기준입니다")를 유지한다(판정 기준 안내) |
| 금액 표기 | 모든 금액은 **USDT**, **소수점 둘째 자리까지의 10진 문자열** (`"12.50"`, `"0.01"`). 부동소수점 숫자 타입 사용 금지. 요청에서 소수점 셋째 자리 이상이 오면 `INVALID_AMOUNT` |
| 칸 위치 | `cellNo` 1~9, 행 우선(row-major). `(1,1)=1, (1,2)=2, (1,3)=3, (2,1)=4 ... (3,3)=9`. 응답에는 `row`, `col`(1~3)을 함께 준다 |
| 줄 식별자 | `ROW_1`, `ROW_2`, `ROW_3`(가로), `COL_1`, `COL_2`, `COL_3`(세로). 대각선 식별자는 없다 |
| 언어 | 사용자 API는 `lang` 쿼리(`KO`/`EN`/`VI`/`TC`/`RU`/`ID`) 우선, 없으면 `Accept-Language`. 제목·부제목·OG는 `KO`면 KO, 그 외는 EN |
| 줄바꿈 | 제목·부제목(KO/EN)에는 `<br />`이 들어갈 수 있다(REQ-106, REQ-107(사용자 요구사항정의서 참조)). 서버는 입력값을 그대로 저장·반환하고, 화면은 `<br />`·`<br/>`·`<br>`(대소문자 무관)을 줄바꿈으로 표시하며 그 밖의 HTML은 문자 그대로 표시한다. **제목·부제목에만 적용**(SEO 타이틀·디스크립션, OG는 제외). 글자 수 제한 없음. 백오피스 목록·상세 상단·참여자 상세처럼 빙고판명을 한 줄로 보여주는 곳은 `<br />`을 공백 한 칸으로 치환해 표시한다 |
| 페이백 배치 시각 | 테더맥스 기존 시스템의 거래소별 일 배치("페이백 배치")가 매일 **UTC 11시부터 12시 사이(KST 20시부터 21시 사이)** 에 거래소마다 순차 실행된다(Bitget은 UID가 많아 UTC 12:00). **페이백 배치 반영일** = 페이백 배치가 실행된 UTC 날짜(연속 판정 기준일). 맥스보드는 페이백 배치를 직접 쓰지 않는다 |
| 빙고 Batch 시각 | 맥스보드 전용 일 배치("빙고 Batch", JOB-01~03)가 페이백 배치 결과를 불러와 게이지·연속 기록·연속 칸 활성화·랭킹을 함께 갱신한다. **하루 1회, 모든 거래소 공통 고정 시각**이며 시각은 설정값(가장 늦은 페이백 배치인 Bitget 이후). **구체 시각은 미정**(백엔드 논의, Open Issue #BATCH). 지연·누락 판정은 빙고 Batch 예정 시각 기준. **사용자 화면에는 다음 업데이트 시각을 표시하지 않으며 사용자 API도 다음 업데이트 시각(`nextUpdateAt`)을 주지 않는다**(확정 2026-10-02, 사용자 API는 "하루 한 번 업데이트돼요" 노출 여부 `dailyUpdateNotice`만 준다). 빙고 Batch 예정 시각은 내부 설정값으로 유지하며 어드민 API(API-110 `scheduledAt` 등)에는 그대로 준다. 본 문서 예시의 12:30 UTC는 설명용 예시값이다 |
| 캐싱 | 혜택 목록·상세·리더보드는 응답 캐싱 대상(NFR-001(사용자 요구사항정의서 참조)). 개인화 응답(`/eligibility`, `/me`)은 `Cache-Control: private, no-store`. TTL은 인프라아키텍처(#10)에서 정함. 캐시 무효화 이벤트는 아래 "캐시 무효화" 표 |
| 캐시 무효화 | 아래 이벤트가 끝나면 해당 사용자 API 캐시를 즉시 무효화한다(빙고판 단위). **어드민 동작**: 콘텐츠 수정(API-104) → API-001·002 / 강제 종료(API-114) → API-001·002·007 / 배치 복구 완료(API-111) → API-002(지연 안내 `batchDelayed`), `applied=true`면 API-007도 / 어뷰징 제외(API-113) → 없음(사용자 리더보드는 집계 동안 고정, 결과 발표 전환 때 반영). **시스템 동작**: 단계 전환(JOB-04) → API-001·002·007 / 랭킹 갱신·재산정·확정(JOB-03·05) → API-007 / 빙고 Batch 지연 판정·완료(JOB-08) → API-002 |

### 1.2 인증·권한

| 구분 | 방식 | 비고 |
|------|------|------|
| 어드민 API | 테더맥스 기존 백오피스 인증·권한 체계 재사용 | 권한 역할: `MASTER`, `OPERATOR`, `PM`, `CS` |

**어드민 권한 매트릭스 (F-030, REQ-020~021, NFR-006)**

| 권한 | 조회(GET) | 생성·수정·어뷰징 제외·배치 복구·강제 종료·이미지 업로드 | CSV 다운로드 |
|------|-----------|----------------------------------------------------------|--------------|
| MASTER / OPERATOR | O | O | O |
| PM | O | O | O |
| CS | O | **X (403 `FORBIDDEN_ROLE`)** | **X (403 `FORBIDDEN_ROLE`)** |

> 화면에서 버튼을 비활성화하는 것과 별개로, 서버는 모든 변경 요청과 CSV 요청에서 역할을 다시 검사한다.

### 1.3 응답 포맷

**성공**

```json
{
  "status": "success",
  "data": { },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**목록(페이지네이션)**

```json
{
  "status": "success",
  "data": [ ],
  "meta": {
    "requestId": "req_01J9ZK3Q8W2M",
    "pagination": { "page": 1, "size": 20, "totalCount": 1284, "totalPages": 65 }
  }
}
```

| 파라미터 | 타입 | 필수 | 기본값 | 설명 |
|----------|------|------|--------|------|
| page | integer | 선택 | 1 | 1부터 시작 |
| size | integer | 선택 | 20 | 최대 100. 초과 시 `VALIDATION_ERROR` |

**에러**

```json
{
  "status": "error",
  "error": {
    "code": "INSUFFICIENT_GAUGE",
    "message": "사용 가능한 빙고 게이지가 칸의 목표 금액보다 적습니다.",
    "details": { "cellNo": 5, "targetAmount": "10.00", "availableGauge": "4.00" }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

- `message`는 개발·로그용 기본 문구다. 사용자 노출 문구는 프론트가 `code` 기준 i18n 리소스로 표시한다(NFR-009).
- 입력 검증 실패는 `details.fields`에 필드별 오류를 담는다: `[{ "field": "cells[3].targetAmount", "code": "AMOUNT_CELL_MIN" }]`.
- **본문 검증 실패의 최상위 코드**: API-102·API-104 본문 검증에 실패하면 최상위 `error.code`는 항상 **`VALIDATION_ERROR`** 이고, 2.2의 항목별 코드("전달 위치"가 `fields[].code`인 코드)는 `details.fields[].code`로만 준다. 실패 항목이 여러 개면 한 번에 모두 담는다. 요청 전체를 거부하는 코드(`CONFIRMATION_REQUIRED`, `LOCKED_FIELD_NOT_EDITABLE`, `FORBIDDEN_ROLE`, `BOARD_CLOSED` 등)는 최상위 코드로 준다.

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "입력값 검증에 실패했습니다.",
    "details": { "fields": [ { "field": "cells[3].targetAmount", "code": "AMOUNT_CELL_MIN" }, { "field": "rankTiers[1].fromRank", "code": "RANK_TIER_GAP" } ] }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

### 1.4 공통 Enum

| Enum | 값 | 의미 |
|------|-----|------|
| `BoardStatus` | `SCHEDULED` | 노출 전 (등록 후 사전공개 시작 전. 사용자 API는 404, 혜택 목록 미노출, 확정 2026-10-05) |
| | `PREVIEW` | 사전공개 |
| | `PARTICIPATION` | 참여 |
| | `AGGREGATION` | 집계 |
| | `ANNOUNCEMENT` | 결과 발표 (랭킹 ON만) |
| | `PAYOUT` | 지급 기간 |
| | `ENDED` | 종료 (지급 기간 종료 후, 사용자 페이지 404) |
| | `TERMINATED` | 강제 종료 (사용자 페이지 404, 정상 종료와 구분) |
| `CellType` | `AMOUNT` | 금액 칸 (목표 금액만큼 게이지 소진) |
| | `STREAK` | 연속 페이백 칸 (N일 연속 시 활성화, 게이지 미소진) |
| `CellState` (사용자) | `CHECKED` | 체크됨 |
| | `CHECKABLE` | 체크 가능 (금액 칸: 사용 가능 게이지 ≥ 목표 / 연속 칸: 활성화됨) |
| | `LOCKED` | 잠김 |
| `CellState` (어드민 미니 보드) | `CHECKED` / `OPEN` / `UNCHECKED` | 체크 완료 / 열렸지만 미체크된 연속 칸 / 미체크 |
| `ParticipantStatus` | `PARTICIPATING` | 참여 |
| | `RESET` | 초기화 (**참여 기간 중** 참여 UID 소유권 이전 또는 이슈 UID 지정. 그 빙고판에서 처음 온 사람처럼 되며 체크 칸·줄·완성·랭킹·달성 리워드가 사라짐, 새 UID 선택 가능). 사유 `resetReason` |
| | `EXCLUDED` | 제외 (어뷰징, 취소 불가) |
| | `WITHDRAWN` | 탈퇴 |
| | `FORFEITED` | 소멸 (**집계 시작 이후~지급 전** 참여 UID 소유권 이전 또는 이슈 UID 지정. 리워드 없음, 완성자면 랭킹 자리 비움). 사유 `resetReason`. 지급(적립) 이후의 소유권 이전·이슈 UID 지정은 상태를 바꾸지 않고 이력 `UID_LOST_AFTER_PAYOUT`만 남김(확정 2026-10-12) |
| `ResetReason` | `OWNERSHIP_TRANSFER` / `ISSUE_UID` | 참여 UID를 잃은 원인: 소유권 이전(다른 사람이 소유권 인증으로 가져감) / 이슈 UID 지정. 사용자가 UID를 직접 연동 해제하는 경우는 없다(`UNLINKED` 삭제, 확정 2026-10-12) |
| `EligibilityState` | `GUEST` / `NO_ELIGIBLE_UID` / `NOT_REGISTERED` / `PARTICIPATING` / `RESELECT_REQUIRED` | API-003 참조. `RESELECT_REQUIRED` = 소유권 이전·이슈 UID로 참여 UID를 잃음(구 `UNLINKED_RESELECT_REQUIRED`, 확정 2026-10-12) |
| `BatchResult` | `PENDING` / `NORMAL` / `DELAYED` / `MISSING` | 판정 전·실행 중 / 정상 / 지연 / 누락. 다음 날 00:00 UTC까지 끝나지 않은 실행은 중단하고 `MISSING` 확정, 복구 후에도 `MISSING` 유지(`recovered=true`) |
| `RecoveryState` | `RUNNING` / `DONE` / `FAILED` | 배치 복구 진행 상태(API-110). 복구 요청이 없으면 `null` |
| `LeaderboardEntryStatus` | `NORMAL` / `VACANT` | 정상 / 제외 · 자리 비움(집계 시작 이후만). 어드민 리더보드(API-106)는 `VACANT` 행을 그대로 주고, 사용자 리더보드(API-007)는 주지 않는다(Q-06, 확정 2026-10-05) |
| `VacantReason` | `EXCLUDED` / `WITHDRAWN` / `FORFEITED` | 어뷰징 제외 / 탈퇴 / 소멸(소유권 이전·이슈 UID). 집계 시작 이후에 생긴 경우만 |
| `Lang` | `KO` / `EN` / `VI` / `TC` / `RU` / `ID` | SEO 6개 언어. 제목·부제목·OG는 KO/EN만 |

### 1.5 기간 표기 규칙

- **확정(2026-10-01)**: 각 단계는 **시작일 00:00:00 UTC ~ 종료일 23:59:59 UTC**이며 **종료일을 포함**한다(REQ-004, REQ-053).
- **다음 단계 시작일 = 앞 단계 종료일 + 1일**. 단계 전환은 시작일 00:00:00 UTC에 일어난다. 하루짜리 단계는 시작일 = 종료일(`days=1`).
- 응답의 단계 객체: `startDate`, `endDate`(그 단계의 마지막 날, 포함), `startAt`(= startDate 00:00:00Z), `endAt`(= endDate 23:59:59Z), `days`(= endDate − startDate + 1).
  - 예: 참여 `startDate=2026-10-08`, `endDate=2026-10-21` → `days=14`. 10-21(UTC)에 실행된 빙고 Batch까지 게이지에 반영되고, 10-22 00:00:00 UTC에 집계로 바뀐다.
- "참여 기간 마지막 날"(D-7·D-3 푸시 기준) = 참여 `endDate`.
- 랭킹 OFF 빙고판의 응답에는 `ANNOUNCEMENT` 단계가 **존재하지 않는다**(키 자체를 생략).

---

## 2. 에러 코드

### 2.1 공통

| HTTP | 에러 코드 | 설명 |
|------|-----------|------|
| 400 | `VALIDATION_ERROR` | 형식 오류, 필수값 누락 등 입력 검증 실패의 최상위 코드. 세부 사유는 `details.fields[].code`(예: `AMOUNT_CELL_MIN`)로 준다 |
| 400 | `INVALID_AMOUNT` | 금액이 문자열 10진수가 아니거나 소수점 셋째 자리 이상 |
| 400 | `CONFIRMATION_REQUIRED` | 확인 팝업이 필요한 작업에서 `confirmed: true` 누락 |
| 401 | `UNAUTHORIZED` | 로그인 필요 |
| 403 | `FORBIDDEN` | 어드민 권한 없음(맥스보드 메뉴 접근 불가) |
| 403 | `FORBIDDEN_ROLE` | CS 역할의 변경·CSV 요청 (조회 전용) |
| 404 | `BOARD_NOT_FOUND` | 빙고판 없음. 사용자 API에서는 `SCHEDULED`(노출 전)·`ENDED`·`TERMINATED` 빙고판도 이 코드로 404 |
| 404 | `NOT_FOUND` | 기타 리소스 없음 |
| 409 | `CONCURRENT_REQUEST` | 같은 대상에 대한 처리 중 요청과 충돌. 재조회 후 다시 시도 |
| 500 | `INTERNAL_ERROR` | 서버 내부 오류 |
| 503 | `SERVICE_UNAVAILABLE` | 의존 시스템(계정·페이백 DB) 일시 장애 |

### 2.2 어드민 도메인

> **전달 위치**: 아래 코드 중 `INVALID_EXCHANGE`, `MULTIPLE_EXCHANGES_NOT_ALLOWED`, `INVALID_SCHEDULE`, `INVALID_CELLS`, `AMOUNT_CELL_MIN`, `STREAK_DAYS_MIN`, `INVALID_REWARDS`, `RANK_TIERS_REQUIRED`, `RANK_TIERS_NOT_ALLOWED`, `RANK_TIER_NOT_FROM_ONE`, `RANK_TIER_GAP`, `RANK_TIER_OVERLAP`, `CONTENT_REQUIRED`, `REWARD_AMOUNT_MIN`, `STREAK_DAYS_EXCEED_PERIOD`, `INVALID_IMAGE_REF`와 2.1의 `INVALID_AMOUNT`는 API-102·104 본문 검증에서 **최상위 `VALIDATION_ERROR`의 `details.fields[].code`** 로 준다(HTTP 400). 나머지는 최상위 `error.code`로 준다.
> **검사 순서**: 변경 API는 권한(403) → 빙고판 존재(404) → 종료 상태(`BOARD_CLOSED`·`ALREADY_TERMINATED`) → 단계 조건(`EXCLUSION_NOT_IN_AGGREGATION` 등) → `confirmed`·본문 검증 → 대상 검증 순으로 검사하고 처음 걸린 것을 반환한다.

| HTTP | 에러 코드 | 조건 | 근거 |
|------|-----------|------|------|
| 400 | `INVALID_EXCHANGE` | 지원하지 않는 거래소 코드 | REQ-001 |
| 400 | `MULTIPLE_EXCHANGES_NOT_ALLOWED` | 거래소를 배열 등으로 2곳 이상 지정(빙고판 1개 = 거래소 1개) | REQ-001 |
| 400 | `INVALID_SCHEDULE` | 날짜 역전, 단계 일수 1일 미만(단계 생략), 랭킹 ON인데 결과 발표 종료일 누락, 랭킹 OFF인데 결과 발표 값 존재 | REQ-004 |
| 400 | `INVALID_CELLS` | 칸 개수 ≠ 9, `cellNo` 중복·누락, 종류 누락, 종류와 값 불일치(금액 칸에 연속 일수 등) | REQ-005 |
| 400 | `AMOUNT_CELL_MIN` | 금액 칸 목표 금액 < `0.01` | REQ-005 |
| 400 | `STREAK_DAYS_MIN` | 연속 칸 연속 일수 N < 1 또는 정수 아님 | REQ-005 |
| 400 | `INVALID_REWARDS` | 7개 리워드 금액(가로 1~3, 세로 1~3, 완성) 중 누락 | REQ-006 |
| 400 | `RANK_TIERS_REQUIRED` | 랭킹 ON인데 랭킹 구간 없음 | REQ-008 |
| 400 | `RANK_TIERS_NOT_ALLOWED` | 랭킹 OFF인데 랭킹 구간 전달 | REQ-008, REQ-082(사용자 요구사항정의서 참조) |
| 400 | `RANK_TIER_NOT_FROM_ONE` | 첫 구간 시작 순위가 1이 아님 | REQ-008 |
| 400 | `RANK_TIER_GAP` | 구간 사이 순위 공백 | REQ-008 |
| 400 | `RANK_TIER_OVERLAP` | 구간 겹침, 또는 구간 내 시작 순위 > 끝 순위 | REQ-008 |
| 400 | `CONTENT_REQUIRED` | 제목·부제목(KO/EN) 또는 배너 이미지 누락(생성 시), 수정 시 필수 항목을 비우려는 경우 | REQ-009 |
| 400 | `LOCKED_FIELD_NOT_EDITABLE` | 콘텐츠 수정 요청에 금액·조건 필드(거래소, 랭킹 ON/OFF, 기간, 칸, 리워드, 랭킹 구간) 포함 | REQ-011 |
| 409 | `BOARD_CLOSED` | `ENDED`·`TERMINATED` 빙고판에 대한 수정·제외·복구·강제 종료 요청 | REQ-011, REQ-069 |
| 409 | `EXCLUSION_NOT_IN_AGGREGATION` | 집계 단계가 아닐 때 어뷰징 제외 요청 | REQ-064 |
| 400 | `EXCLUSION_REASON_REQUIRED` | 제외 사유 누락·공백 | REQ-064 |
| 409 | `PARTICIPANT_NOT_EXCLUDABLE` | 대상 참여자 중 상태가 `PARTICIPATING`이 아닌 건 포함(이미 제외 포함). 전체 요청 거부 | REQ-065 |
| 409 | `BATCH_NOT_RECOVERABLE` | 복구 대상일의 결과가 `MISSING`이 아님(`PENDING` 포함), 빙고판 참여 기간 밖의 날짜, 또는 이미 복구 완료(`recoveryState=DONE`) | REQ-059 |
| 422 | `BATCH_SOURCE_NOT_FOUND` | 테더맥스 페이백 DB에 해당 날짜 원천 데이터 없음(페이백 시스템에서 먼저 채운 뒤 복구) | PRD 배치 누락 복구 |
| 409 | `BATCH_RECOVERY_IN_PROGRESS` | 같은 날짜 복구가 이미 실행 중 | - |
| 409 | `ALREADY_TERMINATED` | 이미 강제 종료된 빙고판 | REQ-068 |
| 400 | `INVALID_IMAGE` | WebP가 아니거나 5MB 초과 | REQ-009 |
| 400 | `INVALID_IMAGE_REF` | API-102·104의 이미지 ID(`bannerImageId`, `ogImageKoId`, `ogImageEnId`)가 API-116으로 업로드된 ID가 아니거나, 업로드 `purpose`가 입력란과 다름(예: OG_KO 이미지를 배너에 지정) | REQ-009 |
| 404 | `RANKING_DISABLED` | 랭킹 OFF 빙고판에 리더보드(API-106) 요청 | REQ-003, REQ-014 |
| 400 | `REWARD_AMOUNT_MIN` | 줄·완성 리워드 또는 랭킹 구간 1인 금액이 0.01 미만(0 포함) | REQ-006, REQ-008 |
| 400 | `STREAK_DAYS_EXCEED_PERIOD` | 연속 칸 N이 참여 기간 일수보다 큼 | REQ-005 |

---

## 3. API 엔드포인트 목록

### 3.1 어드민 API

| API-ID | Method | URL | 설명 | 권한 | F-ID | REQ-ID |
|--------|--------|-----|------|------|------|--------|
| API-101 | GET | `/api/admin/maxboard/boards` | 빙고판 목록(필터) | 전체 | F-021 | REQ-012 |
| API-102 | POST | `/api/admin/maxboard/boards` | 빙고판 생성(등록 즉시 확정) | MASTER/OPERATOR/PM | F-022 | REQ-001~010 |
| API-103 | GET | `/api/admin/maxboard/boards/{boardId}` | 빙고판 상세 상단 요약·설정값 | 전체 | F-024 | REQ-013 |
| API-104 | PATCH | `/api/admin/maxboard/boards/{boardId}/content` | 콘텐츠·SEO 수정 | MASTER/OPERATOR/PM | F-023 | REQ-011 |
| API-105 | GET | `/api/admin/maxboard/boards/{boardId}/stats` | 현황 탭 KPI·줄별 달성·예상 지급액 | 전체 | F-024 | REQ-013, 018 |
| API-106 | GET | `/api/admin/maxboard/boards/{boardId}/leaderboard` | 어드민 리더보드(TUID 전체, 상태) | 전체 | F-024 | REQ-014, 019, 066 |
| API-107 | GET | `/api/admin/maxboard/boards/{boardId}/participants` | 참여자 목록(검색·상태 필터) | 전체 | F-025 | REQ-015, 019 |
| API-108 | GET | `/api/admin/maxboard/boards/{boardId}/participants.csv` | 참여자 목록 CSV 다운로드 | MASTER/OPERATOR/PM | F-025 | REQ-016, 021 |
| API-109 | GET | `/api/admin/maxboard/boards/{boardId}/participants/{participantId}` | 참여자 상세(요약·미니 보드·이력) | 전체 | F-026, F-020 | REQ-017, 019 |
| API-110 | GET | `/api/admin/maxboard/boards/{boardId}/batches` | 배치 탭(날짜별 빙고 Batch 실행 결과) | 전체 | F-027 | REQ-058 |
| API-111 | POST | `/api/admin/maxboard/boards/{boardId}/batches/{batchDate}/recover` | 누락일 빙고 Batch 재실행(복구)·재계산 | MASTER/OPERATOR/PM | F-019, F-027 | REQ-059~062 |
| API-112 | GET | `/api/admin/maxboard/boards/{boardId}/exclusions` | 어뷰징 제외 기록 조회 | 전체 | F-028 | REQ-064 |
| API-113 | POST | `/api/admin/maxboard/boards/{boardId}/exclusions` | 어뷰징 제외(집계 기간, 취소 불가) | MASTER/OPERATOR/PM | F-028 | REQ-064~066 |
| API-114 | POST | `/api/admin/maxboard/boards/{boardId}/terminate` | 강제 종료(취소 불가) | MASTER/OPERATOR/PM | F-029 | REQ-068~070, REQ-071(사용자 요구사항정의서 참조) |
| API-115 | GET | `/api/admin/maxboard/exchanges` | 생성 화면 거래소 선택 목록 | 전체 | F-022 | REQ-001 |
| API-116 | POST | `/api/admin/maxboard/images` | 배너·OG 이미지 업로드 | MASTER/OPERATOR/PM | F-022, F-023 | REQ-009 |

> 빙고판 **삭제 API와 금액·조건 수정 API는 존재하지 않는다**. 등록 후 바꿀 수 있는 것은 API-104(콘텐츠)뿐이다(REQ-010, REQ-011). 강제 종료 취소, 제외 취소 API도 없다(REQ-065, REQ-103).

---

## 4. API 상세 — 어드민

> 어드민 응답은 TUID·UID를 **마스킹하지 않고 전체** 표시한다(REQ-019). 모든 일시는 UTC.

### API-101. 빙고판 목록

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards` |
| 설명 | 빙고판 목록 조회. 참여 UID·완성자·예상 지급액은 조회 시점 실시간 집계 |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| query | status | BoardStatus[] (콤마 구분) | 선택 | 예: `PARTICIPATION,AGGREGATION`. `TERMINATED` 포함 가능 |
| query | exchange | string | 선택 | 거래소 코드 |
| query | ranking | `ON` \| `OFF` | 선택 | 랭킹 여부 |
| query | q | string | 선택 | 빙고판명(제목 KO) 부분 일치 |
| query | page, size | integer | 선택 | 페이지네이션 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "boardId": "mb_20261001_bitget01",
      "titleKo": "비트겟 맥스보드 10월",
      "exchange": { "code": "BITGET", "name": "Bitget" },
      "status": "PARTICIPATION",
      "periodStartAt": "2026-10-05T00:00:00Z",
      "periodEndAt": "2026-11-03T23:59:59Z",
      "rankingEnabled": true,
      "participantUidCount": 1284,
      "completedCount": 96,
      "expectedPayoutTotal": "18452.00",
      "createdAt": "2026-10-01T02:30:00Z"
    }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 20, "totalCount": 1, "totalPages": 1 } }
}
```

> `periodStartAt` = 사전공개 시작, `periodEndAt` = 지급 기간 종료(`endAt`). 정렬 기본값 `createdAt` 내림차순. `titleKo`는 저장값 그대로(`<br />` 포함)이며 화면이 공백으로 치환해 표시한다. `expectedPayoutTotal`은 API-105와 같은 기준(리워드 확정 이후는 확정 지급 목록 기준). [빙고판 생성] 버튼의 CS 비활성은 응답 필드가 아니라 기존 백오피스 세션의 역할 정보로 판단한다.

**에러 코드**: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`

---

### API-102. 빙고판 생성

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards` |
| 설명 | 빙고판을 등록한다. **임시저장 없이 등록 즉시 확정**되며, 금액·조건 항목(거래소, 랭킹 ON/OFF, 기간, 칸, 리워드, 랭킹 구간)은 이후 어떤 API로도 변경할 수 없다(REQ-010). 미리보기 API는 없다(REQ-101) |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| 필드 | 타입 | 필수 | 설명 / 검증 |
|------|------|------|-------------|
| confirmed | boolean | 필수 | 등록 확인 팝업 확인. `true` 아니면 `CONFIRMATION_REQUIRED` |
| exchangeCode | string | 필수 | 거래소 **1곳**(API-115 코드). 배열이면 `MULTIPLE_EXCHANGES_NOT_ALLOWED` |
| rankingEnabled | boolean | 필수 | 등록 후 변경 불가 |
| schedule.previewStartDate | date | 필수 | 사전공개 시작일(UTC). 첫 단계 시작일만 직접 입력 |
| schedule.previewEndDate | date | 필수 | 사전공개 마지막 날(포함). 참여 시작일 = 이 날짜 + 1일 |
| schedule.participationEndDate | date | 필수 | 참여 마지막 날(포함). 집계 시작일 = 이 날짜 + 1일 |
| schedule.aggregationEndDate | date | 필수 | 집계 마지막 날(포함). 다음 날 결과 발표(ON) 또는 지급 기간(OFF) 시작 |
| schedule.announcementEndDate | date | ON 필수 / OFF 금지 | 결과 발표 마지막 날(포함). 지급 기간 시작일 = 이 날짜 + 1일 |
| schedule.payoutEndDate | date | 필수 | 지급 기간 마지막 날(포함). 다음 날 00:00:00 UTC에 페이지 404 |
| cells | array(9) | 필수 | `cellNo` 1~9 각 1개 |
| cells[].cellNo | integer | 필수 | 1~9 |
| cells[].type | CellType | 필수 | `AMOUNT` \| `STREAK`. 종류별 개수·위치 제한 없음(9칸 모두 `STREAK` 가능) |
| cells[].targetAmount | decimal string | `AMOUNT`면 필수 | 최소 `"0.01"` |
| cells[].streakDays | integer | `STREAK`면 필수 | 최소 1, **참여 기간 일수 이하**(`STREAK_DAYS_EXCEED_PERIOD`) |
| rewards.row1 ~ row3 | decimal string | 필수 | 가로 1~3줄 빙고 리워드(각각 다른 금액 가능). 최소 `"0.01"`, 0 불가 |
| rewards.col1 ~ col3 | decimal string | 필수 | 세로 1~3줄 빙고 리워드. 최소 `"0.01"`, 0 불가 |
| rewards.fullBoard | decimal string | 필수 | 완성 리워드. 최소 `"0.01"`, 0 불가 |
| rankTiers | array | ON 필수 / OFF 금지 | 순위 구간. 정렬 후 첫 구간 `fromRank=1`, `다음 fromRank = 이전 toRank + 1`(공백·겹침 금지) |
| rankTiers[].fromRank | integer | 필수 | ≥ 1 |
| rankTiers[].toRank | integer | 필수 | ≥ fromRank |
| rankTiers[].amountPerPerson | decimal string | 필수 | 1인 금액. 최소 `"0.01"`, 0 불가 |
| content.titleKo, content.titleEn | string | 필수 | 혜택 목록 제목으로 사용 |
| content.subtitleKo, content.subtitleEn | string | 필수 | 혜택 목록 부제목으로 사용 |
| content.bannerImageId | string | 필수 | API-116 업로드 결과 ID |
| content.ogImageKoId, content.ogImageEnId | string | 선택 | 미입력 시 사이트 기본 미리보기 이미지 |
| content.seo.{KO\|EN\|VI\|TC\|RU\|ID}.title | string | 선택 | 미입력 시 사이트 기본 메타 |
| content.seo.{KO\|EN\|VI\|TC\|RU\|ID}.description | string | 선택 | 미입력 시 사이트 기본 메타 |

**기간 검증 (`INVALID_SCHEDULE`)**: 각 단계 `종료일 ≥ 시작일`(하루짜리 단계 가능, 단계 생략 불가), 다음 단계 시작일 = 앞 단계 종료일 + 1일(서버가 계산), 날짜 역전 금지, 전체 기간 상한 없음. **과거 날짜 제한 없음**(모든 단계를 과거로 등록 가능, 2026-10-01 확정). 과거 날짜 등록은 **테스트 용도**이며 실제 운영에서는 쓰지 않으므로, 이미 지난 배치 소급·지난 알림·지난 확정·지급에 대한 별도 처리를 만들지 않는다. 같은 거래소 빙고판의 기간 중복은 **검사하지 않는다**(운영 원칙, REQ-002).

**금액·연속 검증**: 리워드 7개와 랭킹 구간 1인 금액은 최소 0.01(0 불가, `REWARD_AMOUNT_MIN`). 연속 칸 N은 참여 기간 일수(= 참여 종료일 − 참여 시작일 + 1) 이하(`STREAK_DAYS_EXCEED_PERIOD`).

**줄바꿈**: `content.titleKo/En`, `content.subtitleKo/En`에는 `<br />`을 넣을 수 있고 그대로 저장한다(REQ-106). 글자 수 제한 없음.

**이미지 ID 검증**: `bannerImageId`는 `purpose=BANNER`, `ogImageKoId`는 `OG_KO`, `ogImageEnId`는 `OG_EN`으로 API-116에 업로드된 ID여야 한다(아니면 `INVALID_IMAGE_REF`).

**사용자 API 필드 매핑**: 어드민 필드 이름(`perPersonCost`, `rewards.row1`~`col3`·`fullBoard`, `bannerImageId`·`ogImageKoId` 등)과 사용자 API-002 필드 이름은 다를 수 있다. 대응 관계는 사용자 `API스펙_ko.md` API-002의 필드 매핑표를 따른다.

```json
{
  "confirmed": true,
  "exchangeCode": "BITGET",
  "rankingEnabled": true,
  "schedule": {
    "previewStartDate": "2026-10-05",
    "previewEndDate": "2026-10-07",
    "participationEndDate": "2026-10-21",
    "aggregationEndDate": "2026-10-24",
    "announcementEndDate": "2026-10-27",
    "payoutEndDate": "2026-11-03"
  },
  "cells": [
    { "cellNo": 1, "type": "AMOUNT", "targetAmount": "5.00" },
    { "cellNo": 2, "type": "STREAK", "streakDays": 3 },
    { "cellNo": 3, "type": "AMOUNT", "targetAmount": "10.00" },
    { "cellNo": 4, "type": "AMOUNT", "targetAmount": "2.00" },
    { "cellNo": 5, "type": "STREAK", "streakDays": 7 },
    { "cellNo": 6, "type": "AMOUNT", "targetAmount": "6.00" },
    { "cellNo": 7, "type": "STREAK", "streakDays": 5 },
    { "cellNo": 8, "type": "AMOUNT", "targetAmount": "15.00" },
    { "cellNo": 9, "type": "AMOUNT", "targetAmount": "20.00" }
  ],
  "rewards": {
    "row1": "3.00", "row2": "3.00", "row3": "5.00",
    "col1": "3.00", "col2": "4.00", "col3": "5.00",
    "fullBoard": "10.00"
  },
  "rankTiers": [
    { "fromRank": 1, "toRank": 1, "amountPerPerson": "300.00" },
    { "fromRank": 2, "toRank": 3, "amountPerPerson": "150.00" },
    { "fromRank": 4, "toRank": 10, "amountPerPerson": "50.00" },
    { "fromRank": 11, "toRank": 30, "amountPerPerson": "27.50" }
  ],
  "content": {
    "titleKo": "비트겟 맥스보드 10월",
    "titleEn": "Bitget MAX BOARD October",
    "subtitleKo": "거래 페이백으로 빙고 칸을 채우고 USDT 리워드 받기",
    "subtitleEn": "Fill your bingo with trading Cashback and earn USDT rewards",
    "bannerImageId": "img_b81c03aa",
    "ogImageKoId": null,
    "ogImageEnId": null,
    "seo": {
      "KO": { "title": "비트겟 맥스보드 | 테더맥스", "description": "거래 페이백으로 빙고를 완성하고 USDT 리워드를 받으세요." },
      "EN": { "title": "Bitget MAX BOARD | TetherMax", "description": "Complete the bingo with trading Cashback and earn USDT." }
    }
  }
}
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "benefitNo": 31,
    "status": "SCHEDULED",
    "perPersonCost": "33.00",
    "ranking": { "winnerCount": 30, "poolTotal": "1500.00" },
    "createdAt": "2026-10-01T02:30:00Z",
    "createdBy": "pm.kim@tethermax.io"
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `perPersonCost` = 6줄 + 완성 리워드 합계. 표시만 하며 금액을 제한하지 않는다(REQ-007). `winnerCount` = 마지막 구간 `toRank`, `poolTotal` = Σ(구간 인원 × 1인 금액). 생성 직후 `status`는 현재 UTC 시각 기준 단계로 정해진다(예시처럼 사전공개 시작일 전이면 `SCHEDULED` 노출 전, 확정 2026-10-05). `benefitNo`는 백엔드가 새로 발급한 혜택 번호(사용자 상세 주소 `?benefitNo=`).

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | 확인 팝업 미확인(최상위) |
| 400 | `VALIDATION_ERROR` | 형식 오류·본문 검증 실패(최상위). 항목별 원인은 `details.fields[].code`로 아래 코드를 준다 |
| 400 | `fields[].code`: `INVALID_EXCHANGE` / `MULTIPLE_EXCHANGES_NOT_ALLOWED` | 거래소 오류 |
| 400 | `fields[].code`: `INVALID_SCHEDULE` | 기간 오류 |
| 400 | `fields[].code`: `INVALID_CELLS` / `AMOUNT_CELL_MIN` / `STREAK_DAYS_MIN` | 칸 오류 |
| 400 | `fields[].code`: `INVALID_REWARDS` / `INVALID_AMOUNT` | 리워드 금액 누락·형식 |
| 400 | `fields[].code`: `RANK_TIERS_REQUIRED` / `RANK_TIERS_NOT_ALLOWED` | 랭킹 ON/OFF와 구간 불일치 |
| 400 | `fields[].code`: `RANK_TIER_NOT_FROM_ONE` / `RANK_TIER_GAP` / `RANK_TIER_OVERLAP` | 구간이 1위부터 끊김 없이 이어지지 않음 |
| 400 | `fields[].code`: `CONTENT_REQUIRED` | 제목·부제목(KO/EN)·배너 누락 |
| 400 | `fields[].code`: `REWARD_AMOUNT_MIN` | 리워드·랭킹 구간 금액 0.01 미만 |
| 400 | `fields[].code`: `STREAK_DAYS_EXCEED_PERIOD` | 연속 일수 N > 참여 기간 일수 |
| 400 | `fields[].code`: `INVALID_IMAGE_REF` | 업로드되지 않았거나 용도가 다른 이미지 ID |
| 403 | `FORBIDDEN_ROLE` | CS(최상위) |

---

### API-103. 빙고판 상세(상단 요약·설정값)

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}` |
| 설명 | 상세 상단 요약과 등록된 전체 설정값을 반환한다. 수정 페이지(잠김 섹션 표시)도 이 응답을 쓴다. `ENDED`·`TERMINATED`도 조회 가능 |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**: path `boardId` (string, 필수)

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "status": "PARTICIPATION",
    "exchange": { "code": "BITGET", "name": "Bitget" },
    "rankingEnabled": true,
    "phases": [
      { "phase": "PREVIEW", "startDate": "2026-10-05", "endDate": "2026-10-07", "startAt": "2026-10-05T00:00:00Z", "endAt": "2026-10-07T23:59:59Z", "days": 3 },
      { "phase": "PARTICIPATION", "startDate": "2026-10-08", "endDate": "2026-10-21", "startAt": "2026-10-08T00:00:00Z", "endAt": "2026-10-21T23:59:59Z", "days": 14 },
      { "phase": "AGGREGATION", "startDate": "2026-10-22", "endDate": "2026-10-24", "startAt": "2026-10-22T00:00:00Z", "endAt": "2026-10-24T23:59:59Z", "days": 3 },
      { "phase": "ANNOUNCEMENT", "startDate": "2026-10-25", "endDate": "2026-10-27", "startAt": "2026-10-25T00:00:00Z", "endAt": "2026-10-27T23:59:59Z", "days": 3 },
      { "phase": "PAYOUT", "startDate": "2026-10-28", "endDate": "2026-11-03", "startAt": "2026-10-28T00:00:00Z", "endAt": "2026-11-03T23:59:59Z", "days": 7 }
    ],
    "cells": [ { "cellNo": 1, "type": "AMOUNT", "targetAmount": "5.00" } ],
    "rewards": { "row1": "3.00", "row2": "3.00", "row3": "5.00", "col1": "3.00", "col2": "4.00", "col3": "5.00", "fullBoard": "10.00" },
    "perPersonCost": "33.00",
    "rankTiers": [ { "fromRank": 1, "toRank": 1, "amountPerPerson": "300.00", "headcount": 1, "subtotal": "300.00" } ],
    "ranking": { "winnerCount": 30, "poolTotal": "1500.00" },
    "content": {
      "titleKo": "비트겟 맥스보드 10월",
      "titleEn": "Bitget MAX BOARD October",
      "subtitleKo": "거래 페이백으로 빙고 칸을 채우고 USDT 리워드 받기",
      "subtitleEn": "Fill your bingo with trading Cashback and earn USDT rewards",
      "bannerImage": { "imageId": "img_b81c03aa", "url": "https://cdn.tethermax.io/maxboard/banner/mb_20261001_bitget01.webp" },
      "ogImageKo": null,
      "ogImageEn": null,
      "seo": { "KO": { "title": "비트겟 맥스보드 | 테더맥스", "description": "..." }, "EN": { "title": "Bitget MAX BOARD | TetherMax", "description": "..." }, "VI": null, "TC": null, "RU": null, "ID": null }
    },
    "editable": { "content": true, "lockedSections": ["BASIC", "SCHEDULE", "BOARD_REWARDS", "RANK_TIERS"] },
    "actions": { "canEditContent": true, "canTerminate": true },
    "createdAt": "2026-10-01T02:30:00Z",
    "createdBy": "pm.kim@tethermax.io",
    "terminatedAt": null,
    "terminatedBy": null
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `actions`는 상태와 요청자 역할을 반영한다. CS는 항상 `false`. `SCHEDULED`(노출 전)부터 `PAYOUT`(지급 기간)까지는 둘 다 `true`. `ENDED`·`TERMINATED`는 `canEditContent=false`, `canTerminate=false`. 예시의 `cells`, `rankTiers`는 일부만 표기. 사용자 API-002와의 필드 이름 대응은 사용자 API-002 필드 매핑표를 참고한다.

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-104. 콘텐츠·SEO 수정

| 항목 | 내용 |
|------|------|
| Method | PATCH |
| URL | `/api/admin/maxboard/boards/{boardId}/content` |
| 설명 | 콘텐츠(⑤ 섹션)만 부분 수정한다. 생성 API와 별도 API. 금액·조건 필드가 하나라도 포함되면 전체 요청을 거부한다 |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request Body** (보낸 필드만 반영)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| titleKo, titleEn, subtitleKo, subtitleEn | string | 선택 | 빈 문자열·`null` 불가(필수 항목) |
| bannerImageId | string | 선택 | `null` 불가(필수 항목) |
| ogImageKoId, ogImageEnId | string \| null | 선택 | `null`이면 삭제 → 사이트 기본 미리보기 이미지 |
| seo.{Lang}.title, seo.{Lang}.description | string \| null | 선택 | `null`이면 삭제 → 사이트 기본 메타 |

허용 외 필드(`exchangeCode`, `rankingEnabled`, `schedule`, `cells`, `rewards`, `rankTiers` 등) 포함 시 `LOCKED_FIELD_NOT_EDITABLE`.

```json
{
  "subtitleKo": "가로·세로 빙고마다 USDT 리워드, 9칸 완성 시 완성 리워드",
  "ogImageKoId": "img_0c55e7d1",
  "seo": { "VI": { "title": "Bitget MAX BOARD | TetherMax", "description": "Hoàn thành bingo bằng Cashback giao dịch." } }
}
```

**Response (200 OK)**

```json
{
  "status": "success",
  "data": { "boardId": "mb_20261001_bitget01", "updatedFields": ["subtitleKo", "ogImageKoId", "seo.VI.title", "seo.VI.description"], "updatedAt": "2026-10-09T08:15:22Z", "updatedBy": "op.lee@tethermax.io" },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 수정 후 사용자 API(API-001, API-002) 캐시를 무효화한다(1.1 캐시 무효화). 이미지 ID 검증은 API-102와 같다(`INVALID_IMAGE_REF`). 검사 순서: 권한 → 빙고판 존재 → `BOARD_CLOSED` → `LOCKED_FIELD_NOT_EDITABLE` → 본문 검증(`VALIDATION_ERROR` + `fields[].code`).

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `LOCKED_FIELD_NOT_EDITABLE` | 금액·조건 필드 포함(최상위) |
| 400 | `VALIDATION_ERROR` | 형식 오류, 지원하지 않는 언어 키. 항목별 `fields[].code`: `CONTENT_REQUIRED`(필수 콘텐츠를 비우려는 요청), `INVALID_IMAGE_REF`(업로드되지 않았거나 용도가 다른 이미지 ID) |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판 |
| 409 | `BOARD_CLOSED` | `ENDED`·`TERMINATED` 빙고판 |

---

### API-105. 현황 탭 지표

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/stats` |
| 설명 | KPI, 줄별 달성 인원(6줄), 예상 지급액(빙고·완성·랭킹·합계)을 실시간 집계한다(REQ-013, REQ-018) |
| 권한 | MASTER / OPERATOR / PM / CS |

**집계 기준**

| 지표 | 정의 |
|------|------|
| participantUidCount | 이 빙고판에 참여 기록이 생성된 UID 수(누적, 초기화 등 모든 상태 포함) |
| activeParticipantCount | 현재 상태 `PARTICIPATING`인 참여자 수 |
| completedCount | 빙고판 완성자 수(상태 `PARTICIPATING`) |
| streakCellActivatedCount | 연속 칸이 1개 이상 활성화된 참여자 수(상태 `PARTICIPATING`) |
| lineAchievements | 줄별 달성 인원(상태 `PARTICIPATING`) |
| expectedPayout | 상태 `PARTICIPATING` 참여자 기준. 빙고 = Σ(달성 줄 × 줄별 금액), 완성 = 완성자 × 완성 리워드, 랭킹 = 현재 순위 기준 구간 금액 합(비운 자리 0). `RESET`·`EXCLUDED`·`WITHDRAWN`·`FORFEITED`는 지급되지 않으므로 제외(초기화된 행의 달성분은 사라짐). **리워드 확정(JOB-05) 이후**(랭킹 ON 결과 발표, OFF 지급 기간)에는 확정 지급 목록 기준으로 계산한다 |
| expectedPayout.basis | `ESTIMATED`(확정 전, 달성 기준) / `CONFIRMED`(확정 지급 목록 기준) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "asOf": "2026-10-15T06:00:12Z",
    "kpi": {
      "participantUidCount": 1284,
      "activeParticipantCount": 1251,
      "completedCount": 96,
      "streakCellActivatedCount": 702
    },
    "lineAchievements": [
      { "line": "ROW_1", "count": 412 }, { "line": "ROW_2", "count": 388 }, { "line": "ROW_3", "count": 205 },
      { "line": "COL_1", "count": 351 }, { "line": "COL_2", "count": 299 }, { "line": "COL_3", "count": 187 }
    ],
    "expectedPayout": {
      "bingo": "6952.00",
      "fullBoard": "960.00",
      "ranking": "1472.50",
      "total": "9384.50",
      "basis": "ESTIMATED"
    },
    "perPersonCost": "33.00"
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 랭킹 OFF 빙고판은 `expectedPayout.ranking` 키를 생략한다.

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-106. 어드민 리더보드

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/leaderboard` |
| 설명 | 빙고판 완성자 전체 순위를 TUID 전체 표시로 반환한다. 매일 빙고 Batch 때 갱신하고, 집계 단계 시작 직후 한 번 재산정한 결과(참여 기간 마지막 날 빙고 Batch 이후 완성자까지 참여 기간 중 모든 완성자 반영, JOB-03, 확정 2026-10-02)를 이후 그대로 반환한다. 참여 기간 중 탈퇴·초기화된 완성자는 다음 빙고 Batch 재산정에서 순위 대상에서 빠진다(자리 비움 아님, 확정 2026-10-12). 집계 시작 이후 어뷰징 제외·탈퇴·소멸된 자리는 행을 지우지 않고 **즉시** `VACANT`(제외 · 자리 비움), 예상 랭킹 리워드 0이며 `rank`·`totalCashback`은 재산정 결과 그대로 고정한다(뒷순위 당김 없음, 확정 2026-10-12). 참고: 사용자 리더보드(API-007)는 집계 동안 재산정 결과 그대로 고정되고 비운 자리는 결과 발표 때 반영된다. 리더보드에는 제외 기능이 없다(제외는 API-113) |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | |
| query | page, size | integer | 선택 | 페이지네이션. 기본 `page=1`, `size=50`(최대 100) |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "lastUpdatedAt": "2026-10-14T12:31:40Z",
    "finalized": false,
    "winnerCount": 30,
    "entries": [
      { "rank": 1, "participantId": "mbp_1a2b3c4d", "tuid": "T102938475", "uid": "48100022", "totalCashback": "5120.44", "boardCompletedAt": "2026-10-11T13:20:05Z", "status": "NORMAL", "vacantReason": null, "expectedRankingReward": "300.00" },
      { "rank": 2, "participantId": "mbp_9e8d7c6b", "tuid": "T203948576", "uid": "48100957", "totalCashback": "4410.10", "boardCompletedAt": "2026-10-10T08:02:41Z", "status": "VACANT", "vacantReason": "EXCLUDED", "resetReason": null, "expectedRankingReward": "0.00" },
      { "rank": 3, "participantId": "mbp_5f6e7d8c", "tuid": "T201577118", "uid": "48203311", "totalCashback": "3988.02", "boardCompletedAt": "2026-10-12T01:44:19Z", "status": "NORMAL", "vacantReason": null, "expectedRankingReward": "150.00" }
    ]
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 50, "totalCount": 96, "totalPages": 2 } }
}
```

> `vacantReason`(`VacantReason`): `EXCLUDED`(어뷰징 제외) / `WITHDRAWN`(집계 시작 이후 탈퇴) / `FORFEITED`(집계 시작 이후 소유권 이전·이슈 UID 지정, 확정 2026-10-12). `resetReason`은 `vacantReason=FORFEITED`일 때 `OWNERSHIP_TRANSFER` / `ISSUE_UID`, 그 외 `null`(예시의 다른 행은 생략). `RESET`은 참여 기간 중에만 생기므로 `vacantReason`에 나오지 않는다. 행 클릭 시 `participantId`로 API-109 이동.
> `finalized`: 리워드 확정(랭킹 ON 결과 발표 시작, JOB-05) 이후 `true`. `true`이면 순위·`VACANT`는 확정 지급 목록과 같고 더 바뀌지 않는다.

**에러 코드**: `400 VALIDATION_ERROR`(size 초과), `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`, `404 RANKING_DISABLED`

---

### API-107. 참여자 목록

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants` |
| 설명 | 참여자(참여 레코드) 목록. 참여 기간 중 소유권 이전·이슈 UID 지정으로 초기화된 뒤 새 UID를 선택한 사용자는 이전 레코드(`RESET`)와 새 레코드가 각각 행으로 나온다. 지급 상태 열은 없다(REQ-102). [CSV 다운로드]·[선택 사용자 어뷰징 제외]의 CS 비활성은 기존 백오피스 세션의 역할 정보로 판단하고, 행 선택 가능 여부는 `excludable`을 따른다 |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| query | q | string | 선택 | TUID 또는 UID (완전 일치 또는 부분 일치) |
| query | status | ParticipantStatus[] (콤마 구분) | 선택 | 상태 필터 |
| query | resetReason | ResetReason | 선택 | 사유 필터: `OWNERSHIP_TRANSFER` / `ISSUE_UID`. 상태 `RESET`·`FORFEITED` 행 중 사유가 같은 행만 반환(예: `status=RESET&resetReason=ISSUE_UID` = "초기화(이슈 UID)"). 다른 값이면 `VALIDATION_ERROR` |
| query | sort | string | 선택 | `registeredAt`(기본, 내림차순) / `rank` / `totalCashback` |
| query | page, size | integer | 선택 | 페이지네이션 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "participantId": "mbp_7f3a91c2",
      "tuid": "T388120456",
      "uid": "48377210",
      "registeredAt": "2026-10-15T03:20:11Z",
      "cumulativeGauge": "39.50",
      "availableGauge": "7.50",
      "checkedCellCount": 9,
      "completedLineCount": 6,
      "boardCompletedAt": "2026-10-20T11:02:33Z",
      "currentStreakDays": 6,
      "maxStreakDays": 7,
      "rank": 12,
      "expectedReward": "60.50",
      "status": "PARTICIPATING",
      "resetReason": null,
      "excludable": false
    }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 20, "totalCount": 1284, "totalPages": 65 } }
}
```

> `resetReason`: 상태가 `RESET`·`FORFEITED`일 때 `OWNERSHIP_TRANSFER`(소유권 이전) / `ISSUE_UID`(이슈 UID 지정), 그 외 `null`(`UNLINKED` 삭제, 확정 2026-10-12). 화면 표시: "초기화(소유권 이전)" / "초기화(이슈 UID)" / "소멸(소유권 이전)" / "소멸(이슈 UID)". 상태 판정: 참여 기간 중 참여 UID를 잃으면 `RESET`, 집계 시작 이후~지급 전이면 `FORFEITED`, 지급(적립) 이후면 상태 변경 없음(API-109 이력 `UID_LOST_AFTER_PAYOUT`만). 판정 시각은 테더맥스 계정 DB 이력 시각이다.
> `cumulativeGauge` = 참여 기간 페이백 총합(= 랭킹 기준 총 페이백), `availableGauge` = 누적 − 금액 칸 사용액. `rank`는 랭킹 ON + 완성자만, 그 외 `null`. `expectedReward` = 달성 줄·완성 리워드 + 현재 순위 기준 랭킹 리워드(상태 `PARTICIPATING` 외에는 `"0.00"`). `excludable` = 집계 단계 + 상태 `PARTICIPATING` + 요청자가 변경 권한 보유.

**에러 코드**: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-108. 참여자 목록 CSV

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants.csv` |
| 설명 | API-107과 같은 필터(`q`, `status`, `sort`)로 전체 행을 CSV로 내려준다(페이지네이션 없음) |
| 권한 | MASTER / OPERATOR / PM. **CS는 403** (REQ-016, REQ-021) |

**Response (200 OK)**

- `Content-Type: text/csv; charset=utf-8` (Excel 호환을 위해 UTF-8 BOM 포함)
- `Content-Disposition: attachment; filename="maxboard_mb_20261001_bitget01_participants_20261015_0600.csv"`
- 시각은 UTC, 금액은 소수점 둘째 자리, TUID·UID 전체 표시. `reset_reason`은 API-107 `resetReason`과 같은 값(`OWNERSHIP_TRANSFER` / `ISSUE_UID` / 빈 값)

```
participant_id,tuid,uid,registered_at_utc,cumulative_gauge,available_gauge,checked_cells,completed_lines,board_completed_at_utc,current_streak,max_streak,rank,expected_reward_usdt,status,reset_reason
mbp_7f3a91c2,T388120456,48377210,2026-10-15T03:20:11Z,39.50,7.50,9,6,2026-10-20T11:02:33Z,6,7,12,60.50,PARTICIPATING,
```

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE`(CS), `404 BOARD_NOT_FOUND`

---

### API-109. 참여자 상세

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants/{participantId}` |
| 설명 | 참여자 1명의 요약, 3×3 미니 보드, 이력(UTC)을 반환한다. 이력은 삭제되지 않는다(REQ-061, REQ-074) |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId, participantId | string | 필수 | |
| query | historyPage, historySize | integer | 선택 | 이력 페이지네이션(기본 1, 50) |

**이력 유형 (`history[].type`)**: `UID_REGISTERED`(소급 게이지 반영) / `BATCH_APPLIED` / `CELL_CHECKED` / `LINE_COMPLETED`(리워드 금액) / `BOARD_COMPLETED` / `STREAK_CELL_ACTIVATED` / `RESET`(참여 기간 중 참여 UID를 잃음, `detail.reason`: `OWNERSHIP_TRANSFER` / `ISSUE_UID`) / `FORFEITED`(집계 시작 이후~지급 전 참여 UID를 잃음, `detail.reason` 같음) / `UID_LOST_AFTER_PAYOUT`(지급(적립) 이후 참여 UID를 잃음, `detail.reason` 같음, 상태·지급 금액 변경 없음, 확정 2026-10-12) / `RECALCULATED`(참여 기간 배치 복구 재계산, 복구한 배치 반영일, 변경 전·후 값) / `SOURCE_CORRECTED`(참여 기간 후 배치 복구, 원천 기록만 보정, 자동 반영 없음, 복구한 배치 반영일·보정 페이백) / `EXCLUDED`(처리자·사유) / `WITHDRAWN`. 화면 라벨은 기능명세_프론트 F-026 라벨표를 따른다.

> `RESET`·`FORFEITED`·`UID_LOST_AFTER_PAYOUT`의 `at`은 테더맥스 계정 DB 이력의 시각(소유권 이전 승인·이슈 UID 지정 시각)이다. 요약 `summary`에는 상태가 `RESET`·`FORFEITED`면 `resetReason`, `EXCLUDED`면 `exclusion`(`excludedAt`, `excludedBy`, `reason`)을 함께 준다.

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "summary": {
      "boardId": "mb_20261001_bitget01",
      "boardTitleKo": "비트겟 맥스보드 10월",
      "participantId": "mbp_7f3a91c2",
      "tuid": "T388120456",
      "uid": "48377210",
      "registeredAt": "2026-10-15T03:20:11Z",
      "cumulativeGauge": "39.50",
      "availableGauge": "7.50",
      "currentStreakDays": 6,
      "maxStreakDays": 7,
      "completedLines": ["ROW_1", "ROW_2", "ROW_3", "COL_1", "COL_2", "COL_3"],
      "boardCompletedAt": "2026-10-20T11:02:33Z",
      "rank": 12,
      "expectedReward": "60.50",
      "status": "PARTICIPATING"
    },
    "board": [
      { "cellNo": 1, "type": "AMOUNT", "targetAmount": "5.00", "state": "CHECKED", "checkedAt": "2026-10-17T02:10:00Z" },
      { "cellNo": 5, "type": "STREAK", "streakDays": 7, "state": "CHECKED", "activatedAt": "2026-10-17T12:31:55Z", "checkedAt": "2026-10-18T05:41:09Z" }
    ],
    "history": [
      { "at": "2026-10-15T03:20:11Z", "type": "UID_REGISTERED", "detail": { "retroactiveGauge": "12.00", "currentStreakDays": 4 }, "actor": "USER" },
      { "at": "2026-10-16T12:31:10Z", "type": "BATCH_APPLIED", "detail": { "batchDate": "2026-10-16", "cashback": "8.20", "cumulativeGauge": "20.20" }, "actor": "SYSTEM" },
      { "at": "2026-10-18T05:41:09Z", "type": "LINE_COMPLETED", "detail": { "line": "ROW_2", "rewardAmount": "3.00" }, "actor": "USER" },
      { "at": "2026-10-19T10:30:00Z", "type": "RECALCULATED", "detail": { "source": "BATCH_RECOVERY", "batchDate": "2026-10-13", "before": { "maxStreakDays": 4 }, "after": { "maxStreakDays": 7 } }, "actor": "op.lee@tethermax.io" }
    ]
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 50, "totalCount": 37, "totalPages": 1 } }
}
```

> 미니 보드 `state`: `CHECKED` / `OPEN`(활성화됐지만 미체크된 연속 칸) / `UNCHECKED`. 예시의 `board`는 일부만 표기(실제 9칸).

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`, `404 NOT_FOUND`(참여자 없음 또는 다른 빙고판 참여자)

---

### API-110. 배치 현황

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/batches` |
| 설명 | 이 빙고판의 **빙고 Batch** 실행 결과를 참여 기간 날짜별로 보여준다(빙고판 1개 = 거래소 1개). 페이백 배치(기존 시스템) 자체의 결과가 아니다 |
| 권한 | MASTER / OPERATOR / PM / CS |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| query | result | BatchResult | 선택 | `PENDING` / `NORMAL` / `DELAYED` / `MISSING` |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "batchDate": "2026-10-15", "scheduledAt": "2026-10-15T12:30:00Z", "executedAt": null, "result": "PENDING", "reflectedUidCount": 0, "reflectedCashback": "0.00", "recoveryState": null, "recovered": false, "recoveredAt": null, "recoveredBy": null, "recoverable": false },
    { "batchDate": "2026-10-14", "scheduledAt": "2026-10-14T12:30:00Z", "executedAt": "2026-10-14T12:31:40Z", "result": "NORMAL", "reflectedUidCount": 2210, "reflectedCashback": "18840.27", "recoveryState": null, "recovered": false, "recoveredAt": null, "recoveredBy": null, "recoverable": false },
    { "batchDate": "2026-10-13", "scheduledAt": "2026-10-13T12:30:00Z", "executedAt": null, "result": "MISSING", "reflectedUidCount": 0, "reflectedCashback": "0.00", "recoveryState": null, "recovered": false, "recoveredAt": null, "recoveredBy": null, "recoverable": true },
    { "batchDate": "2026-10-12", "scheduledAt": "2026-10-12T12:30:00Z", "executedAt": "2026-10-12T15:48:31Z", "result": "DELAYED", "reflectedUidCount": 2104, "reflectedCashback": "17730.02", "recoveryState": null, "recovered": false, "recoveredAt": null, "recoveredBy": null, "recoverable": false },
    { "batchDate": "2026-10-11", "scheduledAt": "2026-10-11T12:30:00Z", "executedAt": null, "result": "MISSING", "reflectedUidCount": 2087, "reflectedCashback": "16902.55", "recoveryState": "DONE", "recovered": true, "recoveredAt": "2026-10-12T09:30:00Z", "recoveredBy": "op.lee@tethermax.io", "recoverable": false }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `batchDate` = 빙고 Batch가 실행되어야 하는 UTC 날짜(배치 반영일), `scheduledAt` = 그날 빙고 Batch 예정 시각(설정값, 예시 12:30 UTC는 예시값 #BATCH), `executedAt` = 실제 완료 시각(복구로 채운 행은 `null` 유지, 복구 시각은 `recoveredAt`). `result`는 JOB-08 기준: 판정 전·실행 중 `PENDING`, 예정 시각 + 3시간 미완료 `DELAYED`(그 뒤 완료돼도 `DELAYED` 유지), 다음 날 00:00 UTC까지 미완료 `MISSING`. **다음 날 00:00 UTC까지 끝나지 않은 실행은 중단하고 `MISSING`으로 확정**하며 늦은 결과는 반영하지 않는다([복구]로만, 확정 2026-10-12). 행은 예정 시각이 지난 참여 기간 날짜까지만 준다.
> 복구: `recoveryState` = `RUNNING`(복구 실행 중) / `DONE`(완료) / `FAILED`(실패, 강제 종료로 중단된 경우 포함) / `null`(복구 요청 없음). `recovered`(= `recoveryState=DONE`), `recoveredAt`(복구 완료 또는 실패 시각), `recoveredBy`(복구 실행자). 복구 후에도 `result`는 `MISSING` 그대로 둔다. `reflectedUidCount`·`reflectedCashback`은 이 빙고판 게이지 적립 대상 UID 기준(복구 완료 행은 복구 반영값).
> `recoverable` = 결과 `MISSING` + `recoveryState`가 `null` 또는 `FAILED` + 요청자가 변경 권한 보유 + 빙고판이 `ENDED`·`TERMINATED` 아님. 복구 완료(`DONE`)·실행 중(`RUNNING`) 행은 `false`.

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-111. 누락일 배치 복구

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/batches/{batchDate}/recover` |
| 설명 | 그날의 **빙고 Batch를 다시 실행**한다. 테더맥스 페이백 DB에서 `batchDate` 데이터를 다시 읽어 **누락일의 배치 기록으로** 반영하고 게이지·연속 기록·연속 칸 활성화·랭킹을 재계산한다(REQ-059~061). 칸 체크는 사용자가 하므로 체크 칸·줄·완성은 바뀌지 않는다. 비동기 작업으로 실행하고 작업 ID를 반환하며, 진행 상태는 API-110 `recoveryState`로 확인한다 |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | batchDate | date | 필수 | 빙고 Batch가 누락된 배치 반영일 |
| body | confirmed | boolean | 필수 | 확인 팝업. 요청 시점 단계로 문구를 나눈다. 참여 기간: "2026-10-13 빙고 Batch를 다시 실행합니다. 테더맥스 페이백 DB에서 2026-10-13 데이터를 다시 읽어 반영하고 게이지·연속 기록·연속 칸 활성화·랭킹을 재계산합니다. 사용자가 체크한 칸·줄·완성은 바뀌지 않습니다." / 참여 기간 이후: "2026-10-13 빙고 Batch 원천 기록만 보정합니다. 참여 기간이 끝난 뒤 복구된 참여 기간분은 자동 반영하지 않고 CS로 개별 처리합니다(게이지·연속 기록·칸·랭킹 재계산 없음)." |

```json
{ "confirmed": true }
```

> 복구 사유는 받지 않는다(2026-10-02 변경). 본문에 `reason` 등 다른 필드가 오면 `VALIDATION_ERROR`.

**처리 규칙**

| 시점 | 동작 |
|------|------|
| 요청 시점 단계 = `PARTICIPATION` (`applied: true`) | 그날 빙고 Batch 재실행: 누락일 배치로 반영 → 게이지 적립(JOB-01과 같은 대상 규칙) → 연속 기록 재계산(누락으로 끊긴 연속이 이어짐) → 연속 칸 활성화 → 랭킹 재산정. **이미 채워진 게이지 회수 없음, 이미 활성화된 연속 칸·체크한 칸 유지, 체크 칸·줄·완성은 바뀌지 않음**(REQ-060). 영향받은 참여자 이력 `RECALCULATED` |
| 요청 시점 단계 = `AGGREGATION` 이후 (`applied: false`, 참여 기간 종료 후 복구, 실행 가능 확정) | 배치 원천 데이터는 누락일 기록으로 저장하되 **게이지·연속 기록·칸·랭킹은 자동 반영하지 않는다**. 참여 기간이 끝난 뒤 복구된 참여 기간분은 CS가 기존 이벤트 리워드 수동 지급 기능으로 개별 처리(REQ-062). 영향받은 참여자 이력 `SOURCE_CORRECTED` |
| 공통 | `applied`는 **요청 시점의 단계**로 정하며, 작업 도중 단계가 바뀌어도 바꾸지 않는다. 대상 UID, 복구한 배치 반영일, 변경 전·후 값, 실행 주체, 시각을 히스토리로 기록(REQ-061). 검사 순서: 권한 → 빙고판 존재 → `BOARD_CLOSED` → `CONFIRMATION_REQUIRED` → `BATCH_NOT_RECOVERABLE` → `BATCH_RECOVERY_IN_PROGRESS` → `BATCH_SOURCE_NOT_FOUND`. 작업 중 강제 종료(API-114)되면 복구를 중단하고 `recoveryState=FAILED` |

**Response (202 Accepted)**

```json
{
  "status": "success",
  "data": {
    "jobId": "mbjob_rc_20261013_01",
    "boardId": "mb_20261001_bitget01",
    "batchDate": "2026-10-13",
    "applied": true,
    "state": "RUNNING",
    "requestedAt": "2026-10-14T09:30:00Z",
    "requestedBy": "op.lee@tethermax.io"
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 작업 완료 후 API-110에서 해당 행이 `recoveryState: DONE`, `recovered: true`, `recoverable: false`로 바뀌고(`result`는 `MISSING` 유지), 영향받은 참여자의 API-109 이력에 `RECALCULATED`(`applied: true`) 또는 `SOURCE_CORRECTED`(`applied: false`)가 남는다. 응답 `state`는 `RecoveryState` 값이다.

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | 확인 미동의 |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판 |
| 409 | `BATCH_NOT_RECOVERABLE` | 결과가 `MISSING` 아님, 참여 기간 밖 날짜, 이미 복구 완료 |
| 409 | `BATCH_RECOVERY_IN_PROGRESS` | 같은 날짜 복구 실행 중 |
| 409 | `BOARD_CLOSED` | `ENDED`·`TERMINATED` |
| 422 | `BATCH_SOURCE_NOT_FOUND` | 원천 데이터 없음 → 페이백 시스템에서 먼저 채운 뒤 재시도 |

---

### API-112. 어뷰징 제외 기록 조회

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/exclusions` |
| 설명 | 이 빙고판의 제외 목록(처리자, 시각, 사유)을 반환한다 |
| 권한 | MASTER / OPERATOR / PM / CS |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "exclusionId": "mbx_0001", "participantId": "mbp_9e8d7c6b", "tuid": "T203948576", "uid": "48100957", "reason": "동일 기기·IP 다계정 자전거래 정황", "excludedAt": "2026-10-23T04:12:00Z", "excludedBy": "op.lee@tethermax.io" }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 20, "totalCount": 1, "totalPages": 1 } }
}
```

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-113. 어뷰징 제외

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/exclusions` |
| 설명 | 선택한 참여자를 이 빙고판 리워드 지급 대상에서 **전체 제외**(빙고·완성·랭킹)한다. **집계 단계에서만** 가능하며 **취소할 수 없다**(취소 API 없음). 랭킹 자리는 비워 두고 뒷순위를 당기지 않는다 |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| participantIds | string[] | 필수 | 1개 이상. 모두 이 빙고판의 `PARTICIPATING` 참여자여야 함(하나라도 아니면 전체 거부) |
| reason | string | 필수 | 공백 불가. 선택한 참여자 모두에 같은 사유 기록 |
| confirmed | boolean | 필수 | "취소할 수 없습니다" 확인 |

```json
{ "participantIds": ["mbp_9e8d7c6b"], "reason": "동일 기기·IP 다계정 자전거래 정황", "confirmed": true }
```

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "excluded": [ { "exclusionId": "mbx_0001", "participantId": "mbp_9e8d7c6b", "status": "EXCLUDED", "vacatedRank": 2 } ],
    "excludedAt": "2026-10-23T04:12:00Z",
    "excludedBy": "op.lee@tethermax.io"
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `EXCLUSION_REASON_REQUIRED` | 사유 누락·공백 |
| 400 | `CONFIRMATION_REQUIRED` | 확인 미동의 |
| 400 | `VALIDATION_ERROR` | `participantIds` 비어 있음 |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판 |
| 409 | `EXCLUSION_NOT_IN_AGGREGATION` | 집계 단계 아님 |
| 409 | `PARTICIPANT_NOT_EXCLUDABLE` | 이미 제외됐거나 `PARTICIPATING`이 아닌 참여자, 다른 빙고판 참여자 포함. `details.participantIds`에 해당 ID |
| 409 | `BOARD_CLOSED` | `ENDED`·`TERMINATED` |

> 검사 순서: 권한(403) → 빙고판 존재(404) → `BOARD_CLOSED` → `EXCLUSION_NOT_IN_AGGREGATION` → `CONFIRMATION_REQUIRED`·`EXCLUSION_REASON_REQUIRED`·`VALIDATION_ERROR` → `PARTICIPANT_NOT_EXCLUDABLE`. 제외는 어드민 리더보드(API-106)에 즉시 `VACANT`로 반영되며(순위·총 페이백 고정), 사용자 리더보드는 집계 동안 고정이므로 결과 발표 때 반영된다.

---

### API-114. 강제 종료

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/terminate` |
| 설명 | **어떤 단계에서든** 빙고판을 즉시 `TERMINATED`로 바꾼다. 게이지 적립·칸 체크·랭킹 갱신·단계 전환·리워드 확정·지급 예정을 모두 중단하고, 예정된 앱 푸시·이메일을 취소하며, 사용자 페이지를 즉시 404로 만들고 혜택 목록에서 내린다. **사유 입력 없음, 알림 없음, 취소 불가** |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| confirmed | boolean | 필수 | 확인 팝업(통일 문구): "진행 중인 모든 처리가 멈추고 사용자 페이지가 바로 404가 됩니다. 지급 기간이 시작되지 않았다면 리워드는 지급되지 않으며, 이미 지급된 리워드는 회수하지 않습니다. 강제 종료는 취소할 수 없습니다." |

> 사유 필드는 받지 않는다. 본문에 `reason` 등 다른 필드가 오면 `VALIDATION_ERROR`.
> 강제 종료 가능 단계: `SCHEDULED`·`PREVIEW`·`PARTICIPATION`·`AGGREGATION`·`ANNOUNCEMENT`·`PAYOUT`(`ENDED`·`TERMINATED` 제외). 검사 순서: 권한(403) → 빙고판 존재(404) → `ALREADY_TERMINATED`·`BOARD_CLOSED` → `CONFIRMATION_REQUIRED`. 실행 중인 배치 복구(API-111)는 중단하고 `recoveryState=FAILED`로 남긴다. 사용자 API-001·002·007 캐시를 무효화한다.

**지급 영향**

| 종료 시점 | 리워드 |
|-----------|--------|
| 지급 기간 시작 전(노출 전~결과 발표) | 지급하지 않음 |
| 지급 기간 중 | 이미 지급된 리워드는 회수하지 않음. 미처리분은 중단 |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "previousStatus": "PARTICIPATION",
    "status": "TERMINATED",
    "terminatedAt": "2026-10-16T01:05:47Z",
    "terminatedBy": "pm.kim@tethermax.io",
    "payoutStarted": false
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | 확인 미동의 |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판 |
| 409 | `ALREADY_TERMINATED` | 이미 강제 종료 |
| 409 | `BOARD_CLOSED` | 지급 기간까지 정상 종료(`ENDED`) |

---

### API-115. 거래소 목록

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/exchanges` |
| 설명 | 빙고판 생성 화면의 대상 거래소 선택 목록(단일 선택) |
| 권한 | MASTER / OPERATOR / PM / CS |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "code": "BITGET", "name": "Bitget" },
    { "code": "OKX", "name": "OKX" }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**에러 코드**: `401 UNAUTHORIZED`, `403 FORBIDDEN`

---

### API-116. 이미지 업로드

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/images` |
| 설명 | 배너·OG 이미지를 업로드하고 `imageId`를 반환한다. 생성(API-102)·수정(API-104)에서 이 ID를 참조한다 |
| 권한 | MASTER / OPERATOR / PM (CS 403) |

**Request** (`multipart/form-data`)

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| file | binary | 필수 | 이미지 파일. **WebP만, 최대 5MB**(위반 시 `INVALID_IMAGE`). 권장 크기는 디자인 확정 후 |
| purpose | string | 필수 | `BANNER` / `OG_KO` / `OG_EN` |

**Response (201 Created)**

```json
{
  "status": "success",
  "data": { "imageId": "img_b81c03aa", "purpose": "BANNER", "url": "https://cdn.tethermax.io/maxboard/banner/img_b81c03aa.webp", "width": 1200, "height": 630 },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**에러 코드**: `400 INVALID_IMAGE`, `400 VALIDATION_ERROR`, `403 FORBIDDEN_ROLE`

---

## 5. 내부 작업 (스케줄러·이벤트)

> 아래 작업은 **외부에 공개하지 않는** 내부 처리다. HTTP 엔드포인트를 두는 경우에도 내부 인증(서비스 토큰)으로만 호출하며 사용자·어드민 API 목록에 포함하지 않는다. 실행 위치(배치 워커, 크론, M5 분리 여부)는 인프라아키텍처(#10)에서 확정한다. 모든 작업은 **멱등**(같은 입력으로 재실행해도 결과 동일)으로 설계하고, `TERMINATED` 빙고판은 처리 대상에서 제외한다.

| JOB-ID | 작업 | 트리거 | 주요 처리 | F-ID / REQ-ID |
|--------|------|--------|-----------|---------------|
| JOB-01 | 빙고 Batch: 페이백 불러오기·게이지 적립 | 매일 1회 **빙고 Batch 예정 시각** 스케줄(모든 거래소 공통 고정 시각, 설정값, Bitget 페이백 배치 이후. 구체 시각 미정 #BATCH) | 아래 5.0, 5.1 | F-012 / REQ-034~037, 114 |
| JOB-02 | 빙고 Batch: 연속 기록 판정·연속 칸 활성화 | 같은 빙고 Batch 안에서 JOB-01 직후 | 아래 5.2 | F-013 / REQ-040, 042, 043 |
| JOB-03 | 빙고 Batch: 랭킹 산정 | 같은 빙고 Batch 안에서 JOB-02 직후(랭킹 ON 빙고판만). 추가로 JOB-04의 집계 단계 전환 직후 1회 재산정(확정 2026-10-02) | 아래 5.3 | F-014 / REQ-049~051, 066 |
| JOB-04 | 기간 단계 전환 | 매일 **UTC 00:00** | 아래 5.4 | F-015 / REQ-053, 057 |
| JOB-05 | 리워드 확정 | JOB-04: 랭킹 ON은 결과 발표 시작, OFF는 집계 종료(= 지급 기간 시작) | 아래 5.5 | F-017 / REQ-056, 065~067 |
| JOB-06 | 리워드 자동 적립 | JOB-04: 지급 기간 시작 직후 | 아래 5.6 | F-018 / REQ-070, 072, 073 |
| JOB-07 | 계정 상태 대조(소유권 이전·이슈 UID 지정·탈퇴) | 맥스보드가 직접 확인: 사용자 요청 시, 매일 빙고 Batch(참여 기간 이후에도 지급 완료까지), JOB-05·JOB-06 직전(확정 2026-10-12) | 아래 5.7 | F-005, F-016 / REQ-024, 030~032, 066, 067, 110, 114, 115 |
| JOB-08 | 빙고 Batch 지연·누락 감지 | 빙고 Batch(JOB-01~03) 완료 여부 감시(모든 빙고판 공통 실행 1회 단위) | 판정 대상은 **빙고 Batch**(페이백 배치 아님). 결과(`BatchResult`, 확정 2026-10-12): 판정 전·실행 중 `PENDING`, 예정 시각(설정값) + 3시간 이내 완료 `NORMAL`, + 3시간까지 미완료 `DELAYED`(이후 완료되면 `DELAYED`로 남고 반영), 다음 날 00:00 UTC까지 미완료면 **실행을 중단하고** `MISSING` 확정(늦은 결과 미반영, 복구 API-111로만 채움, 복구 후 `recovered=true`·`recoverable=false`). 빙고판별로 기록. `batchDelayed`(API-002·005)는 참여 단계에서 지연 진행 중이거나 복구 전 `MISSING`이 있으면 `true`. 지연 진입·누락 확정·실행 오류 시 Slack 알림(JOB-09) | F-019, F-031 / REQ-060~063, 089 |
| JOB-09 | 운영 Slack 알림 | 집계 단계 시작(빙고판별 1회), JOB-08 감지 | 집계 시작 메시지(빙고판명, 거래소, 내용). 빙고 Batch 이상 메시지(확정 2026-10-12): 단위는 빙고 Batch 실행 1회(모든 빙고판 공통), 지연 진입 시 1회, 누락 확정 시 1회, 실행 오류는 즉시(배치 반영일, 예정·실행 시각, 이상 종류, 영향 빙고판 목록). 강제 종료된 빙고판은 알림 없음 | F-031 / REQ-088, 089 |
| JOB-10 | 앱 푸시 자동 발송 | 발송 일정 스케줄 | 아래 5.8 | F-032 / REQ-090~094 |
| JOB-11 | 결과 이메일 자동 발송 | 발송 일정 스케줄 | 아래 5.8 | F-033 / REQ-095~097 |

### 5.0 빙고 Batch와 페이백 배치 (2026-10-02 도입)

| 구분 | 페이백 배치 (기존 시스템) | 빙고 Batch (맥스보드 신규) |
|------|---------------------------|----------------------------|
| 역할 | 거래소별 커미션 기반 페이백을 테더맥스 페이백 DB에 쌓는다. **빙고 Batch의 원천**이며 맥스보드는 직접 쓰지 않는다 | 페이백 DB에서 페이백 배치 결과를 불러와 빙고판에 반영한다. 한 번 실행에 JOB-01(게이지)·JOB-02(연속 기록·연속 칸 활성화)·JOB-03(랭킹)을 **함께 갱신** |
| 실행 | 매일 UTC 11시부터 12시 사이 거래소별 순차(Bitget UTC 12:00) | **하루 1회, 모든 거래소 공통 고정 시각**. 시각은 설정값(가장 늦은 페이백 배치 이후), 구체 시각 미정(#BATCH) |
| 날짜 기준 | **페이백 배치 반영일**(페이백 배치가 실행된 UTC 날짜) = 연속 판정 기준일 | **빙고 Batch 실행 시각** = 게이지 반영 대상(참여 기간 안 실행 여부) 판정 기준 |
| 지연·누락 판정 | 판정 대상 아님 | JOB-08 판정 대상, 어드민 ③ 배치 탭(API-110)·복구(API-111) 단위 |

- **가져오는 범위**: 그날 빙고 Batch는 그날 완료된 페이백 배치 결과와, 전날 빙고 Batch 뒤에 늦게 끝나 전날 가져가지 못한 페이백 배치 결과를 가져온다. 빙고 Batch 자체가 누락된 날의 데이터는 다음 날 빙고 Batch가 자동으로 채우지 않고 어드민 ③ 배치 탭 [복구](API-111)로만 반영한다(확정 2026-10-02).
- **늦게 끝난 페이백 배치**: 페이백 배치가 그날 빙고 Batch 실행 뒤에 끝나면 다음 날 빙고 Batch가 가져가며, **원래 페이백 배치 반영일로 기록**한다(연속 기록이 끊기지 않음). 단 **참여 기간 마지막 날 분이 이렇게 다음 날로 밀리면 반영하지 않는다**(참여 기간 이후 실행되는 빙고 Batch이므로, CS 처리).

### 5.1 JOB-01 빙고 Batch: 페이백 불러오기·게이지 적립

| 항목 | 내용 |
|------|------|
| 반영 대상 | **빙고 Batch 실행 시각**이 빙고판 참여 기간 `[startAt, endAt]` 안인 빙고 Batch가 가져온 페이백만 반영(마지막 날 실행분 포함). 참여 기간 이후 실행된 빙고 Batch는 반영하지 않으며, **마지막 날 빙고 Batch가 지연돼 다음 날 00:00:00 UTC 이후 실행되거나, 마지막 날 페이백 배치가 그날 빙고 Batch 뒤에 끝나 다음 날로 밀린 분도 반영하지 않는다**(CS 처리) |
| 원천 | 테더맥스 페이백 DB의 페이백 배치 결과(UID별 거래 페이백, 페이백 배치 반영일). 5.0의 가져오는 범위를 따른다 |
| 적립 대상 UID | 빙고판 거래소 UID 중 **테더맥스 DB 최초 등록일(UTC) ≥ 참여 시작일 − 30일**인 **모든 UID**. 연동 여부·참여 등록 여부와 무관하며 **비회원 UID와 이미 참여 중인 UID를 포함**한다. "이 빙고판 참여 기록 없음" 조건은 **참여 등록 시점(API-004)에만** 쓰고 적립 대상 판단에는 쓰지 않는다. **이슈 UID로 지정된 기간에는 게이지·연속 기록을 하지 않는다**(그날 페이백 미적립, 연속은 끊김으로 판정해 0부터 다시 시작. 지정이 풀린 뒤 다시 기록하며, 지정 기간분은 소급하지 않음, 확정 2026-10-02) |
| 적립 소스 | 거래로 인한 페이백만(이벤트 리워드 등 제외) |
| 처리 | UID별 누적 게이지 += 페이백, 사용 가능 게이지 += 페이백. 각 페이백은 원래 **페이백 배치 반영일**로 기록하고, 0.01 이상 반영된 날을 연속 판정용 일자로 기록. 게이지 차감·회수 없음 |
| 기록 | 빙고판별 빙고 Batch 실행 이력(배치 반영일, 예정 시각, 실행 시각, 결과, 반영 UID 수, 반영 페이백), 참여자별 `BATCH_APPLIED` 이력(페이백 배치 반영일, 금액) |
| 완료 기한 | 다음 빙고 Batch 전(NFR-002) |

### 5.2 JOB-02 연속 기록 판정·연속 칸 활성화

- 연속 기준일은 **페이백 배치 반영일**이다(빙고 Batch 실행일이 아님). 판정은 빙고 Batch가 실행될 때 한다.
- 페이백 배치 반영일에 0.01 이상 페이백이 있으면 현재 연속 +1, 없으면 0으로 초기화. 이슈 UID로 지정된 날은 페이백이 없는 날로 보아 0으로 초기화(확정 2026-10-02). 최장 연속 갱신. 대상 UID는 JOB-01과 같다(소급 인정).
- 빙고 Batch 실행 시점에 그날 해당 거래소의 페이백 배치가 아직 끝나지 않았으면, 그 날짜는 끊김으로 보지 않고 판정을 다음 빙고 Batch로 넘긴다(늦게 들어온 페이백은 원래 반영일로 기록되므로 연속이 이어짐, 확정 2026-10-02). 이를 위해 **페이백 시스템이 거래소별·날짜별 페이백 배치 완료 상태를 내려준다(확정 2026-10-02)**. 빙고 Batch는 완료 상태인 날짜의 페이백만 가져가고 판정한다.
- 현재 연속 ≥ N인 **모든** 연속 칸을 활성화하고 활성화 이력(시각)을 저장한다. 한 번 활성화된 칸은 이후 끊겨도, 재계산해도 비활성화하지 않는다.

### 5.3 JOB-03 랭킹 산정 (랭킹 ON만)

- 대상: 빙고판 완성자. 기준: 참여 기간 총 페이백(누적 게이지) 내림차순, 동점은 **빙고판 완성 기록이 DB에 먼저 저장(insert)된 순**(완성 기록의 저장 순번으로 판정, 항상 하나의 순위로 정해짐).
- 참여 기간 중 탈퇴(`WITHDRAWN`)·초기화(`RESET`)된 완성자는 자리 비움이 아니라 다음 빙고 Batch 산정에서 순위 대상에서 뺀다(확정 2026-10-12). **집계 시작 이후** 어뷰징 제외(`EXCLUDED`)·탈퇴(`WITHDRAWN`)·소멸(`FORFEITED`, 소유권 이전·이슈 UID 지정)된 완성자는 순위 자리를 유지한 채 `VACANT` 처리, 예상 랭킹 리워드 0. 뒷순위를 당기지 않는다. 어드민 리더보드(API-106)는 이 상태를 즉시 표시하되 순위·총 페이백은 고정하고, 사용자 리더보드(API-007)는 집계 단계 동안 재산정 결과 그대로 두었다가 결과 발표(JOB-05) 때 반영한다(확정 2026-10-12).
- 순위 구간표로 예상 랭킹 리워드 계산, `lastUpdatedAt` 갱신. 다음 갱신 예정 시각은 사용자 API·화면에 내보내지 않는다(빙고 Batch 예정 시각은 내부 설정값으로만 관리, 확정 2026-10-02). 참여 기간 마지막 날 빙고 Batch가 반영되면 사용자 API의 `dailyUpdateNotice`를 `false`로 바꾼다. 랭킹 리워드풀은 빙고·완성 리워드와 이월 없음.
- **집계 시작 시 재산정(확정 2026-10-02)**: 참여 마지막 날 빙고 Batch 이후에도 참여 기간 종료(23:59:59 UTC)까지 칸 체크·참여 UID 등록(비회원이던 UID를 마지막 날 연동·등록해 소급 게이지로 완성하는 경우 포함)이 가능하다. 그래서 JOB-04가 `AGGREGATION`으로 전환한 직후 JOB-03을 한 번 더 실행해 참여 기간 중 완성한 모든 완성자를 반영한다. 새 페이백은 불러오지 않고(JOB-01·02 미실행) 완성자 목록만 갱신하며, 총 페이백 기준·동점 규칙·`VACANT` 처리는 같다. 실행 후 `lastUpdatedAt`을 갱신하고 이후에는 갱신하지 않는다. 결과는 어드민 리더보드(API-106)와 사용자 집계 단계 리더보드(API-007)에 그대로 쓴다.
- 참여 기간 마지막 날 빙고 Batch 반영 후 완성한 사용자는 참여 기간이 끝날 때까지 `RANK_FINAL_AT_ANNOUNCEMENT`로 안내하고, 집계 시작 시 재산정에서 순위를 받는다(확정 2026-10-02).

### 5.4 JOB-04 기간 단계 전환 (UTC 00:00)

| 전환 | 후속 처리 |
|------|-----------|
| → `PREVIEW` | `SCHEDULED`에서 사전공개 시작일 00:00 UTC에 전환. 혜택 목록 노출 시작, 상세 열람 가능, 오픈 예고 푸시(JOB-10, 02:10) (확정 2026-10-05) |
| → `PARTICIPATION` | 게이지 적립 시작(빙고 Batch 대상 편입) |
| → `AGGREGATION` | 참여·칸 체크 차단, (랭킹 ON) 랭킹 재산정(JOB-03 1회, 참여 기간 중 모든 완성자 반영, 확정 2026-10-02), Slack 알림(JOB-09), 어뷰징 제외 허용 시작 |
| → `ANNOUNCEMENT` (ON) | 리워드 확정(JOB-05), 리더보드 `finalized=true` |
| → `PAYOUT` | (OFF) 리워드 확정(JOB-05) 후 자동 적립(JOB-06) / (ON) 자동 적립(JOB-06), 최종 수상자 리더보드는 확정 결과 그대로 종료(404)까지 노출 |
| → `ENDED` | 사용자 페이지 404, 혜택 목록 제외. 수상자 히스토리 보관(삭제 금지) |

### 5.5 JOB-05 리워드 확정

- 상태 `PARTICIPATING` 참여자만 대상. `EXCLUDED`·`WITHDRAWN`·`FORFEITED`·`RESET` 제외.
- 랭킹 ON: 결과 발표 시작 시 집계 시작 시 재산정한 순위(JOB-03, 참여 기간 중 모든 완성자 반영)를 기준으로 최종 순위를 확정한다(확정 2026-10-02). 직전에 계정 상태를 다시 대조한다(JOB-07). 집계 중 순위와 최종 순위의 차이는 집계 시작 이후 어뷰징 제외·탈퇴·소멸로 **비운 자리에서만** 생기며, 그 자리는 `VACANT`로 비워 두고 뒷순위를 당기지 않는다(확정 2026-10-02).
- 빙고 리워드(달성 줄별 금액) + 완성 리워드 + 랭킹 리워드(구간 금액, 비운 자리 미지급)를 확정 지급 목록으로 저장. 확정 후 변경 없음.

### 5.6 JOB-06 리워드 자동 적립

- 지급 기간 시작 직후, **지급 시점의 참여 UID**로 지급되는 금액에 이벤트 리워드(USDT)를 적립. 빙고·완성·랭킹 리워드 모두 지급 기간 시작 직후 함께 적립한다(확정 2026-10-12). 리워드는 지급 기간 시작 때 최종 상태 기준으로 한 번만 지급한다.
- 지급 직전 계정 상태 재확인(JOB-07): 참여 UID가 소유권 이전·이슈 UID 지정으로 끊겼으면 `FORFEITED`(소멸, 미지급), 탈퇴면 미지급. 적립을 마친 뒤의 소유권 이전·이슈 UID 지정은 이미 적립한 리워드를 회수하지 않으며 참여 상태·지급 금액을 바꾸지 않고 이력만 남긴다(확정 2026-10-02, 2026-10-12 갱신).
- 지급은 맥스보드 **이벤트 리워드 지급 배치(신규)** 가 테더맥스 이벤트 리워드 지급 기능으로 처리한다. 지급 건 단위 멱등 키로 중복 지급을 막는다. 지급 실패 처리는 백엔드 담당(어드민 화면·API 없음). 수상자 히스토리는 영구 보관.
- 지급 기간 중 강제 종료되면 **아직 처리되지 않은 지급(실패 후 재시도 중 포함)은 중단**한다. 이미 지급된 건은 회수하지 않는다.

### 5.7 JOB-07 계정 이벤트 처리

| 이벤트 | 처리 |
|--------|------|
| 참여 UID 소유권 이전·이슈 UID 지정 (공통 규칙, 확정 2026-10-12) | 사용자는 UID를 직접 연동 해제할 수 없으므로 참여 UID를 잃는 원인은 소유권 이전(다른 사람이 소유권 인증으로 가져감)과 이슈 UID 지정 두 가지다. 계정 DB 이력의 시각으로 상태를 정한다. **참여 기간 안**: 참여 상태 `RESET`(사유 `OWNERSHIP_TRANSFER` / `ISSUE_UID`), 칸·줄·완성·랭킹·달성 리워드를 이 TUID 진행에서 분리(처음 온 사람처럼), `RESET` 이력 기록. API-003이 `RESELECT_REQUIRED`를 반환하고 새 UID 선택 가능. 완성자였다면 다음 빙고 Batch 산정에서 순위 대상에서 빠짐. 이력 시각이 참여 기간 안이어도 집계 시작 재산정 이후에 감지되면 아래 소멸로 처리(순위를 다시 당기지 않음). **집계 시작 이후~지급(적립) 전**: 참여 상태 `FORFEITED`(같은 사유), 재선택 불가 → 리워드 없음, 완성자면 랭킹 자리 비움(`VACANT`). **지급(적립) 이후**: 회수 없음, 참여 상태·지급 금액 변경 없이 이력(`UID_LOST_AFTER_PAYOUT`)만 기록, API-003은 `RESELECT_REQUIRED`. 잃은 UID는 같은 빙고판에 재참여 불가(원 TUID로 돌아와도, 이슈 UID 지정이 풀려도), 진행 복원 없음 |
| 소유권 이전 추가 규칙 | 참여는 새 TUID로 귀속되지 않는다. 새 TUID에서도 이 빙고판 재참여 불가(`UID_ALREADY_PARTICIPATED`) |
| TUID 탈퇴 | 해당 TUID의 모든 빙고판 참여 상태 `WITHDRAWN`, 리워드 미지급. 참여 기간 중 탈퇴한 완성자는 순위 대상에서 빠지고(자리 비움 아님), 집계 시작 이후 탈퇴면 랭킹 자리 비움 |
| 이슈 UID 지정 추가 규칙 | 지정 기간에는 게이지·연속 기록 안 함(JOB-01·02, 소급 없음). 미참여 UID가 이슈 UID면 API-003 자격 UID 목록에서 제외(`UID_ISSUE_DESIGNATED`) |

> **계정 변경 감지(확정 2026-10-01, 2026-10-12 갱신)**: 기존 시스템이 따로 알려주지 않고 **맥스보드가 직접 확인**한다. 확인 시점은 (1) 사용자가 상세에 진입하거나 참여 등록·칸 체크를 요청할 때 현재 연동 상태 조회, (2) 매일 빙고 Batch 때 참여 UID 소유권·이슈 UID 지정·탈퇴 상태 일괄 대조(참여 기간 이후에도 **지급 완료까지** 계속), (3) 리워드 확정(JOB-05)과 적립(JOB-06) 직전 재확인. 소유권 이전·이슈 UID 지정·탈퇴의 판정 시각은 **테더맥스 계정 DB 이력의 시각**을 쓴다(이력에 있음, 확정 2026-10-12). 집계 시작 이후 소멸·탈퇴된 완성자는 랭킹 자리를 비운다.

### 5.8 JOB-10·11 앱 푸시·이메일

| 구분 | 시점 (UTC) | 대상 |
|------|------------|------|
| 앱 푸시 오픈 예고 | 사전공개 시작일 02:10 | 마케팅 수신 동의자 전체 |
| 앱 푸시 오픈 | 참여 시작일 02:20 | 마케팅 수신 동의자 전체 |
| 참여 독려(자격 UID 있음) | 참여 종료일 기준 D-7·D-3, 02:30 | 참여 UID 미등록(초기화(소유권 이전·이슈 UID 지정) 후 새 UID 미선택 포함) + 해당 거래소 자격 UID 보유 |
| 참여 독려(자격 UID 없음) | D-7·D-3, 02:40 | 참여 UID 미등록(초기화(소유권 이전·이슈 UID 지정) 후 새 UID 미선택 포함) + 자격 UID 없음 |
| 완성 독려 | D-7·D-3, 02:50 | 참여 UID 등록 + 9칸 미완성(체크 0칸 포함) |
| 이메일 리워드 확정 안내 | ON: 결과 발표 시작일 / OFF: 지급 기간 시작일, 06:00 | 빙고·완성 리워드 대상자 중 이메일 마케팅 동의자 |
| 이메일 랭킹 수상 축하 | 결과 발표 시작일 06:10 (ON만) | 랭킹 리워드 대상자 중 이메일 마케팅 동의자 |

- 공통: 발송 시점에 수신 동의 재확인. 발송일이 참여 기간 밖이거나 오픈 푸시와 같은 날이면 그 회차 미발송. 완성자는 독려 제외. 같은 날 같은 종류가 여러 빙고판에 해당하면 등록 순서대로 5분씩 순연하고, 순연된 시각이 다음 종류 푸시와 겹치면 **뒤 종류도 함께 밀어** 항상 5분 간격을 유지한다. 기존 푸시와도 5분 이상 간격을 지킨다: 순연된 시각이 03:00 UTC 기존 푸시(퀴즈·포인트)와 5분 간격을 지킬 수 없으면(02:55 초과~03:05 미만) **03:05 이후로 넘기고** 그 뒤로 5분 간격 순연을 이어간다(확정 2026-10-12). 두 이메일은 각각 발송하며, 본문에 확정본대로 지급일을 넣는다. 이메일은 수신자 기기 시간을 알 수 없으므로 지급일은 **UTC 날짜로 표기**한다(예: 2026-10-31 (UTC)). 제외자·탈퇴자 결과 이메일 미발송. 강제 종료 시 이후 발송 전부 취소. 문구는 확정본([FCM·이메일 문구 시트](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877)) 사용. 푸시 이동 경로는 혜택 상세.

---

## 6. 정책-API 검증 매핑

| 정책 | 강제 위치 | 에러 코드 / 동작 |
|------|-----------|------------------|
| 빙고판 1개 = 거래소 1개 | API-102 | `MULTIPLE_EXCHANGES_NOT_ALLOWED`, `INVALID_EXCHANGE` |
| 랭킹 ON/OFF 생성 시 고정 | API-102만 입력, API-104 거부 | `LOCKED_FIELD_NOT_EDITABLE` |
| 등록 후 콘텐츠만 수정 | API-104만 존재 | `LOCKED_FIELD_NOT_EDITABLE`, 종료·강제 종료는 `BOARD_CLOSED` |
| 랭킹 구간 1위부터 공백·겹침 없음 | API-102 | `RANK_TIER_NOT_FROM_ONE`, `RANK_TIER_GAP`, `RANK_TIER_OVERLAP` |
| 금액 칸 최소 0.01, 연속 N 최소 1 | API-102 | `AMOUNT_CELL_MIN`, `STREAK_DAYS_MIN` |
| 게이지 적립 = 30일 조건만(참여 중 UID 포함), 참여 기록 조건은 등록 시에만 | JOB-01 | 내부 규칙 |
| 제외는 집계 단계만, 사유 필수, 취소 불가 | API-113 (취소 API 없음) | `EXCLUSION_NOT_IN_AGGREGATION`, `EXCLUSION_REASON_REQUIRED` |
| 강제 종료는 정상 종료 전 모든 단계(노출 전 포함), 사유 없음, 취소 불가 | API-114 (취소 API 없음) | `ALREADY_TERMINATED`, `BOARD_CLOSED` |
| 참여 UID를 잃으면 참여 기간 = 초기화, 집계 시작 이후~지급 전 = 소멸, 지급 후 = 기록만 | JOB-07, API-107·109 | `RESET` / `FORFEITED` / 이력 `UID_LOST_AFTER_PAYOUT`, `resetReason` `OWNERSHIP_TRANSFER`·`ISSUE_UID` |
| 누락 복구는 누락일 1회, 재계산 여부는 요청 시점 단계 | API-111 | `BATCH_NOT_RECOVERABLE`, `applied`, 이력 `RECALCULATED`·`SOURCE_CORRECTED` |
| 이미지 ID는 업로드된 같은 용도 이미지만 | API-102, API-104 | `INVALID_IMAGE_REF` |
| 수정 시에도 제목·부제목(KO/EN)·배너 필수 | API-104 | `CONTENT_REQUIRED` |
| CS 조회 전용(변경·CSV 불가) | 공통 인가 미들웨어 | `FORBIDDEN_ROLE` (403) |

---

## 7. 확인 필요

> 아래는 PRD.md 초안 단계에서 정해져 있지 않아 API 동작을 확정할 수 없는 항목이다. 확정 전까지 표시한 잠정 동작으로 구현하되 값은 파라미터화한다.

| # | 항목 | 확인 내용 | 잠정 동작(본 문서) | 관련 API |
|---|------|-----------|--------------------|----------|
| Q-01 | 기간 "종료일" 표기 | **확정(2026-10-01)**: 종료일 = 그 단계의 마지막 날(23:59:59 UTC까지 포함), 다음 단계는 다음 날 00:00:00 UTC 시작. 1.5 참조 | 확정 반영 | API-002, API-102, JOB-04 |
| Q-02 | 과거 날짜 등록 허용 범위 | **확정(2026-10-01)**: 과거 날짜 제한 없음(모든 단계를 과거로 등록 가능). 과거 날짜 등록은 테스트 용도로, 이미 지난 배치·알림·확정·지급에 대한 별도 처리 없음 | 확정 반영 | API-102 |
| Q-03 | 리워드·랭킹 구간 금액 최소값 | **확정(2026-10-01)**: 줄·완성 리워드와 랭킹 1인 금액 최소 0.01, 0 불가, 소수점 둘째 자리까지(`REWARD_AMOUNT_MIN`) | 확정 반영 | API-102 |
| Q-04 | 연속 일수 N 상한 | **확정(2026-10-01)**: 연속 일수 N > 참여 기간 일수면 등록 불가(`STREAK_DAYS_EXCEED_PERIOD`) | 확정 반영 | API-102 |
| Q-05 | 빙고판 완성 직후 "현재 순위" 산정 기준 | **확정(2026-10-01, 2026-10-02 갱신)**: 완성 직후에는 순위를 보여주지 않고 "랭킹은 매일 업데이트돼요" 안내만 준다(다음 업데이트 시각 없음). 다음 랭킹 갱신부터 순위 표시. 예외(2026-10-02): 마지막 날 빙고 Batch 반영 후 완성은 참여 기간 종료까지 `RANK_FINAL_AT_ANNOUNCEMENT`("최종 순위는 결과 발표 때 확인할 수 있어요" + 결과 발표 일시), 집계 시작 시 재산정 때 순위에 반영되고 결과 발표 때 최종 확정 | 확정 반영 | API-006, API-005, API-007, JOB-05 |
| Q-07 | 집계 이후 초기화·소멸된 완성자의 랭킹 자리 | **확정(2026-10-01, 2026-10-12 갱신)**: 집계 시작 이후 참여 UID를 잃은 완성자는 `FORFEITED`(소멸)로 자리 비움(`VACANT`), 뒷순위 당기지 않음. 참여 기간 중 탈퇴·초기화된 완성자는 자리 비움이 아니라 다음 빙고 Batch 재산정에서 순위 대상에서 빠짐. 어드민 리더보드는 상태를 즉시 표시하되 순위·총 페이백 고정, 사용자 리더보드는 집계 동안 고정·결과 발표 때 반영 | 확정 반영 | API-007, API-106, JOB-03, JOB-07 |
| Q-09 | 배치 "지연"·"누락" 판정 기준 | **확정(2026-10-01, 2026-10-02 빙고 Batch 기준으로 변경, 2026-10-12 보완)**: 판정 대상은 빙고 Batch. 판정 전·실행 중 = `PENDING`, 빙고 Batch 예정 시각 + 3시간 미완료 = 지연, 그날 다음 날 00:00 UTC까지 미완료 = 누락(실행 중단, 늦은 결과 미반영, 복구로만). 복구 후 `recovered=true`·`recoverable=false`, `result`는 `MISSING` 유지. 예정 시각은 설정값(모든 거래소 공통) | 확정 반영 | API-005, API-110, JOB-08 |
| Q-16 | 빙고 Batch 실행 시각 | 모든 거래소 공통 1회, Bitget 페이백 배치(UTC 12:00) 이후. 구체 시각은 백엔드 논의(PRD Open Issue #BATCH) | 설정값으로 구현, 문서 예시는 12:30 UTC(사용자 API에는 내보내지 않음) | API-110, JOB-01~03, JOB-08 |
| Q-10 | 배치 복구 사유 입력 | **확정(2026-10-01)**: 참여 기간 종료 후에도 복구 가능(재계산 없음). 복구 사유 입력 없음(2026-10-02 변경, 확인 팝업만. `RECOVERY_REASON_REQUIRED` 삭제) | 확정 반영 | API-111 |
| Q-11 | SEO 언어별 미입력 시 대체 순서 | **확정(2026-10-01)**: 해당 언어 값이 없으면 다른 언어로 대체하지 않고 테더맥스 사이트 기본 메타·기본 미리보기 이미지를 쓴다. 간체(SC) 추가 여부는 Open Issue #SC | 해당 언어 값이 없으면 `null` → 사이트 기본 메타. SC 미지원 | API-002, API-102, API-104 |
| Q-12 | 이미지 규격·업로드 경로 | **확정(2026-10-01)**: WebP만, 최대 5MB. 권장 크기는 디자인 확정 후. 배너 외 추가 이미지는 Open Issue #IMG | 확정 반영 | API-116 |
| Q-13 | 콘텐츠 글자 수 제한 | **확정(2026-10-01)**: 글자 수 제한 없음. 제목·부제목의 `<br />`은 줄바꿈으로 표시 | 확정 반영 | API-102, API-104 |
| Q-14 | 인증 연동 방식 | **확정(2026-10-01)**: 사용자 로그인과 백오피스 권한(마스터/오퍼레이터/PM/CS)은 기존 체계를 그대로 사용. 구현 방식은 개발팀 결정 | 확정 반영 | 전체 |
