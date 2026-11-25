# API 스펙 — 사용자 화면

| 항목 | 내용 |
|------|------|
| 프로젝트명 | TetherMax 신규 회원 빙고 이벤트 (서비스명: 맥스보드 / MAX BOARD) |
| 작성일 | 2026-10-01 |
| 버전 | v1.5 (2026-10-12 정합성 점검 반영(확정 2026-10-12): 사용자 직접 연동 해제 개념 삭제·참여 UID를 잃는 원인 = 소유권 이전·이슈 UID, `ParticipantStatus` RESET(참여 기간)·FORFEITED(집계 시작 이후~지급 전) 재정의, `resetReason` `UNLINKED` 삭제 → `OWNERSHIP_TRANSFER`·`ISSUE_UID`, `EligibilityState` `UNLINKED_RESELECT_REQUIRED` → `RESELECT_REQUIRED`, API-003 `unlinkedUid`·`unlinkedAt` → `resetUid`·`resetAt`, JOB-07 재작성, 사용자 리더보드 집계 단계 고정·비운 자리 결과 발표 때 반영·참여 기간 중 탈퇴·초기화 완성자 순위 제외(API-007·JOB-03·JOB-05), `BatchResult` `PENDING` 추가·누락 확정 시 실행 중단·복구 후 `recovered`(JOB-08), `batchDelayed` 정의·API-002 포함, Slack 빙고 Batch 이상 알림(JOB-09), 푸시 03:05 순연(5.8), `rewards.achieved[]` 구조·랭킹 리워드 적립 = 지급 기간 시작 직후(API-005·JOB-06), 리더보드 로그인 요청 캐시 금지, `serverTime` 캐시 제외, 캐시 무효화 이벤트, 칸 체크 후 API-005 재조회, `PARTICIPATION_RESET`·`PARTICIPATION_INACTIVE` 대상 정리, 미참여자 `me: null`·수상권 밖 `rewardAmount: null`, `lang`은 API-001·002만, 어드민·사용자 필드 이름 매핑(API-002), 등록 확인 팝업 해요체, API-007 예시 `lastUpdatedAt`, 근거 문서 표기) / v1.4 (2026-10-07 PRD v0.11 반영: API-002 `serverTime` 추가(참여 마감 카운트다운), `PAYOUT_IN_PROGRESS` 화면 문구, `winnerCount` 화면 미표기(REQ-117, REQ-057, REQ-052)) / v1.3 (2026-10-05 PRD v0.10 반영(어뷰징 제외 미안내, 소유권 이전·이슈 UID 처리, 내 리워드 빈 상태, 랭킹 리워드 총액·등수별·컬럼, 연속 막대, 유의사항 한 열, 요구사항 추적 정비) / 2026-10-02 사용자 화면 시각 로컬 변환 표시 반영, 배치 시각 거래소별 예시 삭제, 최종 수상자 리더보드 지급 기간까지 노출, 이메일 지급일 UTC 날짜 표기, 유의사항 UTC 문구 예외 명시, 빙고 Batch 도입, 사용자 API에서 `nextUpdateAt` 삭제·`dailyUpdateNotice` 추가(다음 업데이트 시각 미표시), 집계 단계 리더보드 마지막 갱신 순위 노출, 리워드 "지급 → 적립" 표현 통일, 빙고 Batch 자체 누락일 수동 복구 확정, 리더보드 수상 인원 전체 표시(모든 단계), 마지막 날 빙고 Batch 이후 완성 예외, 미완성자 랭킹 문구 해요체 교체, 참여 기간 이후 미참여자 화면, 집계 이후 연속 기록 "최종 연속 ○일"만 표시, 집계 중 순위와 최종 순위 차이·결과 발표 재산정 확정, 리더보드 페이지네이션(한 페이지 10행, 내 순위 행 목록 아래 고정)·완성자가 수상 인원보다 적으면 있는 순위까지만 표시, 참여 기간 이후 미참여자 화면 비회원 포함 명시, "집계 중 / Calculating" 표기 확정, API-007 `page`·`size`·`totalCount` 추가, 집계 시작 시 랭킹 재산정(JOB-03·JOB-04·JOB-05, 공통 로직), API-005·API-004 최장 연속 필드 사용자 화면 미사용 표기, API-007 한 페이지 10행 고정(`size` 쿼리 삭제), PRD v0.9 반영) |
| 대상 독자 | 사용자 화면 개발자 |
| 범위 | 사용자 API 7종(API-001~007) + 내부 작업 11종(JOB-01~11, 공통) |
| 근거 문서 | PRD.md v1.0(개요, 상세 이력은 Git v0.11), 분할문서/사용자/요구사항정의서_ko.md, 기능명세_프론트_ko.md, 기능명세_백엔드_ko.md, src/mockup/index.html(기본 화면 V2, 사용자 화면·백오피스 최신 통합 목업, Vercel 배포본) |

> 이 문서가 기준 문서다(통합본 없음, 2026-10-01 정리).
> 배치·이벤트로 동작하는 **내부 작업(JOB-01~11)은 사용자·백오피스 문서에 같은 내용으로 중복 수록**한다. 내부 작업을 고칠 때는 두 문서를 함께 고친다.
> 어드민 API(API-101~116)는 `분할문서/백오피스/API스펙_ko.md`에 있다.

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
| 시간 표기 | 모든 일시는 **UTC ISO-8601** (`2026-10-15T03:20:00Z`). 날짜만 필요한 값은 `YYYY-MM-DD`(UTC 날짜). **API는 항상 UTC로 내려주고, 사용자 화면 표시용 로컬 시간 변환은 프론트가 한다**(확정 2026-10-02, NFR-011). 화면에는 "UTC"를 붙이지 않는다. 단계 기간은 `startAt`·`endAt`(일시)을 변환해 날짜+시각으로 표시하며, `startDate`·`endDate`만 있는 값은 프론트가 경계 시각(시작 00:00:00 UTC / 끝 23:59:59 UTC)을 붙여 변환한다. 판정은 모두 UTC 그대로다. 타임존 표기(GMT+9 등)도 붙이지 않는다. 예외: 공통 유의사항 문구(프론트 고정)는 UTC 기준 안내("모든 기간과 시각은 UTC 기준입니다")를 유지한다(판정 기준 안내) |
| 금액 표기 | 모든 금액은 **USDT**, **소수점 둘째 자리까지의 10진 문자열** (`"12.50"`, `"0.01"`). 부동소수점 숫자 타입 사용 금지. 요청에서 소수점 셋째 자리 이상이 오면 `INVALID_AMOUNT` |
| 칸 위치 | `cellNo` 1~9, 행 우선(row-major). `(1,1)=1, (1,2)=2, (1,3)=3, (2,1)=4 ... (3,3)=9`. 응답에는 `row`, `col`(1~3)을 함께 준다 |
| 줄 식별자 | `ROW_1`, `ROW_2`, `ROW_3`(가로), `COL_1`, `COL_2`, `COL_3`(세로). 대각선 식별자는 없다 |
| 언어 | 언어별 내용이 있는 API-001·002만 `lang` 쿼리(`KO`/`EN`/`VI`/`TC`/`RU`/`ID`)를 받으며, 없으면 `Accept-Language`. 제목·부제목·OG는 `KO`면 KO, 그 외는 EN. API-003~007은 `lang`을 받지 않는다(응답에 언어별 문구 없음, 확정 2026-10-12) |
| 줄바꿈 | 제목·부제목(KO/EN)에는 `<br />`이 들어갈 수 있다(REQ-106, REQ-107). 서버는 입력값을 그대로 저장·반환하고, 화면은 `<br />`·`<br/>`·`<br>`(대소문자 무관)을 줄바꿈으로 표시하며 그 밖의 HTML은 문자 그대로 표시한다. **제목·부제목에만 적용**(SEO 타이틀·디스크립션, OG는 제외). 글자 수 제한 없음 |
| 페이백 배치 시각 | 테더맥스 기존 시스템의 거래소별 일 배치("페이백 배치")가 매일 **UTC 11시부터 12시 사이(KST 20시부터 21시 사이)** 에 거래소마다 순차 실행된다(Bitget은 UID가 많아 UTC 12:00). **페이백 배치 반영일** = 페이백 배치가 실행된 UTC 날짜(연속 판정 기준일). 맥스보드는 페이백 배치를 직접 쓰지 않는다 |
| 빙고 Batch 시각 | 맥스보드 전용 일 배치("빙고 Batch", JOB-01~03)가 페이백 배치 결과를 불러와 게이지·연속 기록·연속 칸 활성화·랭킹을 함께 갱신한다. **하루 1회, 모든 거래소 공통 고정 시각**이며 시각은 설정값(가장 늦은 페이백 배치인 Bitget 이후). **구체 시각은 미정**(백엔드 논의, Open Issue #BATCH). 지연·누락 판정은 빙고 Batch 예정 시각 기준. **사용자 화면에는 다음 업데이트 시각을 표시하지 않으며 사용자 API도 다음 업데이트 시각(`nextUpdateAt`)을 주지 않는다**(확정 2026-10-02). 화면은 참여 기간 중에만 "하루 한 번 업데이트돼요"를 표시하고, 노출 여부는 `dailyUpdateNotice`로 준다. 본 문서 예시의 12:30 UTC는 설명용 예시값이다 |
| 캐싱 | 혜택 목록(API-001)·상세(API-002)·리더보드(API-007)는 응답 캐싱 대상(NFR-001). 단 API-002 `serverTime`은 캐시하지 않고 응답할 때마다 채운다(캐시 구성상 어려우면 프론트가 응답 헤더 `Date`로 대신). API-007은 **비로그인 요청만** 공개 캐시이고, 로그인 요청은 개인 정보 `me`가 들어 있으므로 `Cache-Control: private, no-store`. 개인화 응답(`/eligibility`, `/me`)은 `Cache-Control: private, no-store`. **캐시 무효화 이벤트**(확정 2026-10-12): 단계 전환, 랭킹 갱신·재산정·확정, 콘텐츠 수정(제목·SEO·이미지), 강제 종료, 어뷰징 제외, 복구 재계산, 빙고 Batch 지연 상태 변경(`batchDelayed`) 시 해당 빙고판의 API-001·002·007 캐시를 무효화한다. TTL은 인프라아키텍처(#10)에서 정함 |

### 1.2 인증·권한

| 구분 | 방식 | 비고 |
|------|------|------|
| 사용자 API | 테더맥스 기존 사용자 인증(로그인 세션) 재사용. 서버는 인증 정보에서 **TUID**를 얻는다 | 혜택 목록·상세·리더보드는 비회원도 호출 가능(선택 인증). 참여·칸 체크·내 현황은 로그인 필수 |

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
| | `RESET` | 초기화 (확정 2026-10-12): **참여 기간 중** 참여 UID를 잃음(소유권 이전·이슈 UID 지정. 사용자는 UID를 직접 연동 해제할 수 없음). 그 빙고판에서 처음 온 사람처럼 되며(체크 칸·줄·완성·랭킹·달성 리워드 전부 사라짐) 새 UID를 선택할 수 있다. 사유는 `resetReason`. 어드민 화면 표시 "초기화(소유권 이전)" / "초기화(이슈 UID)" |
| | `EXCLUDED` | 제외 (어뷰징, 취소 불가) |
| | `WITHDRAWN` | 탈퇴 |
| | `FORFEITED` | 소멸 (확정 2026-10-12): **집계 시작 이후~지급(적립) 전**에 참여 UID를 잃음(소유권 이전·이슈 UID 지정). 새 UID 선택 불가, 리워드 없음, 빙고판 완성자면 랭킹 자리 비움. 사유는 `resetReason`. 어드민 화면 표시 "소멸(소유권 이전)" / "소멸(이슈 UID)". 지급(적립) 이후 잃으면 상태를 바꾸지 않고 이력만 남긴다(회수 없음) |
| `ResetReason` (`resetReason`) | `OWNERSHIP_TRANSFER` / `ISSUE_UID` | `RESET`·`FORFEITED`(및 지급 후 UID 변경 이력)의 원인: 소유권 이전(다른 사람이 소유권 인증으로 가져감) / 이슈 UID 지정. 판정 시각은 테더맥스 계정 DB 이력의 시각. 기존 `UNLINKED` 값은 삭제(확정 2026-10-12) |
| `EligibilityState` | `GUEST` / `NO_ELIGIBLE_UID` / `NOT_REGISTERED` / `PARTICIPATING` / `RESELECT_REQUIRED` | API-003 참조. `RESELECT_REQUIRED`(기존 이름 `UNLINKED_RESELECT_REQUIRED`) = 소유권 이전·이슈 UID 지정으로 참여 UID를 잃음(확정 2026-10-12) |
| `BatchResult` | `PENDING` | 판정 전·실행 중 (예정 시각 전, 또는 실행 중이고 예정 시각 + 3시간 이내, 확정 2026-10-12) |
| | `NORMAL` | 정상 (예정 시각 + 3시간 이내 완료) |
| | `DELAYED` | 지연 (예정 시각 + 3시간까지 미완료. 이후 다음 날 00:00 UTC 전에 완료되면 결과는 `DELAYED`로 남고 반영됨) |
| | `MISSING` | 누락 (다음 날 00:00 UTC까지 미완료. 그 시각에 실행을 중단하고 누락으로 확정, 늦은 결과는 반영하지 않음. [복구]로만 채우며 복구 후에도 값은 `MISSING`, `recovered=true`·`recoverable=false`, 확정 2026-10-12) |
| `LeaderboardEntryStatus` | `NORMAL` / `VACANT` | 정상 / 제외 · 자리 비움(집계 시작 이후 어뷰징 제외·탈퇴·소멸). 사용자 API(API-007)는 `VACANT` 행을 내려주지 않는다(Q-06, 확정 2026-10-05). 단 집계 단계 사용자 응답은 집계 시작 재산정 결과 그대로 고정하므로 그 사이 생긴 비운 자리는 결과 발표 때 반영한다(확정 2026-10-12) |
| `RewardItemType` | `LINE` / `FULL_BOARD` | API-005 `rewards.achieved[].type`: 빙고 리워드(줄, `line`에 ROW_1~COL_3) / 완성 리워드(`line: null`). 랭킹 리워드는 내 리워드 목록에 넣지 않는다(API-007 `me.rewardAmount`, 확정 2026-10-12) |
| `RankingMessage` | `COMPLETE_BOARD_TO_RANK` | 미완성, 참여 기간: "빙고판을 완성하면 랭킹에 참여할 수 있어요" |
| | `NOT_RANKED_INCOMPLETE` | 미완성, 집계 이후: "빙고판을 완성하지 않아 랭킹 대상이 아니에요" (2026-10-02 추가) |
| | `RANK_UPDATES_DAILY` | 완성, 아직 랭킹 갱신 전: "랭킹은 매일 업데이트돼요" |
| | `RANK_FINAL_AT_ANNOUNCEMENT` | 참여 기간 마지막 날 빙고 Batch 반영 후 완성(참여 기간 중 이후 갱신 없음, 참여 기간 종료까지만 사용. 집계 시작 시 재산정 후에는 순위 반환): "최종 순위는 결과 발표 때 확인할 수 있어요" + 결과 발표 일시(API-002 `phases`의 `ANNOUNCEMENT.startAt`) (2026-10-02 추가) |
| `Lang` | `KO` / `EN` / `VI` / `TC` / `RU` / `ID` | SEO 6개 언어. 제목·부제목·OG는 KO/EN만 |

### 1.5 기간 표기 규칙

- **확정(2026-10-01)**: 각 단계는 **시작일 00:00:00 UTC ~ 종료일 23:59:59 UTC**이며 **종료일을 포함**한다(REQ-004, REQ-053).
- **다음 단계 시작일 = 앞 단계 종료일 + 1일**. 단계 전환은 시작일 00:00:00 UTC에 일어난다. 하루짜리 단계는 시작일 = 종료일(`days=1`).
- 응답의 단계 객체: `startDate`, `endDate`(그 단계의 마지막 날, 포함), `startAt`(= startDate 00:00:00Z), `endAt`(= endDate 23:59:59Z), `days`(= endDate − startDate + 1).
  - 예: 참여 `startDate=2026-10-08`, `endDate=2026-10-21` → `days=14`. 10-21(UTC)에 실행된 빙고 Batch까지 게이지에 반영되고, 10-22 00:00:00 UTC에 집계로 바뀐다.
- **사용자 화면 표시(확정 2026-10-02)**: 프론트는 `startAt`·`endAt`을 사용자 기기의 로컬 시간으로 변환해 **날짜와 시각을 함께** 표시한다. 로컬 날짜와 UTC 날짜가 어긋나기 때문이다.
  - 예: 참여 `startAt=2026-10-08T00:00:00Z`, `endAt=2026-10-21T23:59:59Z` → KST 기기에서 "2026.10.08 09:00 ~ 2026.10.22 08:59".
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

### 2.2 사용자 도메인

| HTTP | 에러 코드 | 조건 | 근거 |
|------|-----------|------|------|
| 409 | `PHASE_NOT_PARTICIPATION` | 참여 UID 등록·재선택·칸 체크를 참여 단계가 아닐 때 요청 | REQ-033, REQ-045, REQ-054~055 |
| 422 | `UID_NOT_LINKED` | 요청 UID가 요청 TUID에 연동되어 있지 않음 | REQ-027 |
| 422 | `UID_EXCHANGE_MISMATCH` | 요청 UID가 빙고판 대상 거래소 UID가 아님 | REQ-026 |
| 422 | `UID_REGISTERED_TOO_EARLY` | UID의 **테더맥스 DB 최초 등록일**(UTC) < 참여 시작일 − 30일 | REQ-023 |
| 422 | `UID_ALREADY_PARTICIPATED` | 요청 UID에 **이 빙고판** 참여 기록이 이미 있음(초기화·제외·탈퇴·소멸 포함, 소유권 이전·원 TUID 복귀 무관) | REQ-024 |
| 422 | `UID_ISSUE_DESIGNATED` | 요청 UID가 이슈 UID로 지정됨(테더맥스 기존 기능, 확정 2026-10-02) | REQ-114 |
| 409 | `ALREADY_PARTICIPATING` | 이 TUID가 이 빙고판에 이미 참여 중인 UID를 보유(빙고판당 1개) | REQ-027, REQ-029 |
| 409 | `NOT_PARTICIPATING` | 참여 UID 미등록 상태에서 칸 체크 요청 | F-007 |
| 409 | `PARTICIPATION_RESET` | 이 TUID의 참여가 초기화(`RESET`) 또는 소멸(`FORFEITED`)됨(소유권 이전·이슈 UID 지정으로 참여 UID를 잃음, 확정 2026-10-12). 프론트는 상세를 새로고침해 API-003 `RESELECT_REQUIRED` 화면으로 | REQ-030, REQ-031, REQ-110, REQ-115 |
| 409 | `PARTICIPATION_INACTIVE` | 참여 상태가 제외(`EXCLUDED`)·탈퇴(`WITHDRAWN`)라 처리 불가(API-006). 프론트는 별도 안내 없이 상세 새로고침(확정 2026-10-12) | REQ-065, REQ-067 |
| 400 | `INVALID_CELL` | `cellNo`가 1~9가 아님 | - |
| 409 | `CELL_ALREADY_CHECKED` | 이미 체크한 칸(취소·이동 없음, 동시 중복 요청의 두 번째 요청 포함) | REQ-044, NFR-004 |
| 422 | `INSUFFICIENT_GAUGE` | 금액 칸: 사용 가능 게이지 < 목표 금액 | REQ-039 |
| 422 | `STREAK_CELL_NOT_ACTIVATED` | 연속 칸: 활성화 이력 없음 | REQ-040, REQ-041 |
| 404 | `RANKING_DISABLED` | 랭킹 OFF 빙고판의 리더보드 요청 | REQ-082 |

---

## 3. API 엔드포인트 목록

### 3.1 사용자 API

| API-ID | Method | URL | 설명 | 권한 | F-ID | REQ-ID |
|--------|--------|-----|------|------|------|--------|
| API-001 | GET | `/api/maxboard/boards` | 혜택 목록용 맥스보드 카드 목록 | 공개 | F-001, F-011 | REQ-057, 071, 075, 085 |
| API-002 | GET | `/api/maxboard/boards/{boardId}` (또는 `/api/maxboard/benefits/{benefitNo}`) | 혜택 상세(단계·랭킹 ON/OFF별 구성, SEO) | 공개 | F-002, F-011 | REQ-054~057, 076, 082, 085~087, 112 |
| API-003 | GET | `/api/maxboard/boards/{boardId}/eligibility` | 참여 가능 여부·자격 UID 목록(참여 UID를 잃은 경우 포함) | 공개(비회원은 `GUEST`) | F-003, F-005 | REQ-022~027, 030, 031, 077, 110, 114, 115 |
| API-004 | POST | `/api/maxboard/boards/{boardId}/participation` | 참여 UID 등록 / 초기화 후 재선택 | 로그인 | F-004, F-005 | REQ-023~030, 033, 114 |
| API-005 | GET | `/api/maxboard/boards/{boardId}/me` | 내 빙고판·게이지·연속·리워드 현황 | 로그인 | F-006, F-009 | REQ-063, 078~081, 109, 111 |
| API-006 | POST | `/api/maxboard/boards/{boardId}/cells/{cellNo}/check` | 칸 체크(금액 칸 / 연속 칸) | 로그인 | F-007, F-008, F-009 | REQ-038, 039, 041, 044~048 |
| API-007 | GET | `/api/maxboard/boards/{boardId}/leaderboard` | 사용자 리더보드(마스킹 TUID, 수상권, 내 순위) | 공개(내 순위는 로그인 시) | F-010 | REQ-049~052, 056, 066, 109, 112 |

---

## 4. API 상세 — 사용자

### API-001. 혜택 목록용 빙고판 목록

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards` |
| 설명 | 혜택 목록에 노출할 맥스보드 카드를 반환한다. `PREVIEW`~`PAYOUT` 단계 빙고판만 포함하고 `SCHEDULED`(노출 전)·`ENDED`·`TERMINATED`는 제외한다. 카드는 위에 `title`(제목), 아래에 `subtitle`(부제목)을 표시한다(확정 2026-10-05). 정렬은 **등록 최신순**(`createdAt` 내림차순). `benefitNo`는 빙고판 생성 시 새로 발급되는 혜택 번호이고, 상세 주소는 글로벌 리그처럼 `?benefitNo=`로 구분한다(경로 `/{lang}/max-board?benefitNo={n}` 확정, 번호는 백엔드가 생성 시 발급). 혜택 목록 화면은 이 결과를 다른 혜택보다 **1순위**로 배치한다 |
| 권한 | 공개(비회원 가능) |
| 캐싱 | 공개 캐시 대상. 강제 종료 시 캐시 즉시 무효화(REQ-071) |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| query | lang | Lang | 선택 | `KO`면 KO 제목·부제목, 그 외는 EN |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    {
      "boardId": "mb_20261002_okx01",
      "exchange": { "code": "OKX", "name": "OKX" },
      "status": "PREVIEW",
      "rankingEnabled": false,
      "title": "OKX 신규 UID 빙고",
      "subtitle": "가로·세로 빙고마다 리워드, 9칸 완성 시 완성 리워드",
      "bannerImageUrl": "https://cdn.tethermax.io/maxboard/banner/mb_20261002_okx01.webp",
      "benefitNo": 32,
      "detailPath": "/ko/max-board?benefitNo=32",
      "createdAt": "2026-10-02T04:10:00Z"
    },
    {
      "boardId": "mb_20261001_bitget01",
      "exchange": { "code": "BITGET", "name": "Bitget" },
      "status": "PARTICIPATION",
      "rankingEnabled": true,
      "title": "비트겟 맥스보드 10월",
      "subtitle": "거래 페이백으로 빙고 칸을 채우고 USDT 리워드 받기",
      "bannerImageUrl": "https://cdn.tethermax.io/maxboard/banner/mb_20261001_bitget01.webp",
      "benefitNo": 31,
      "detailPath": "/ko/max-board?benefitNo=31",
      "createdAt": "2026-10-01T02:30:00Z"
    }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**에러 코드**: `500 INTERNAL_ERROR`

---

### API-002. 혜택 상세(빙고판)

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}` 또는 `/api/maxboard/benefits/{benefitNo}` |
| 설명 | 혜택 상세 페이지 주소(`/{lang}/max-board?benefitNo={n}`)로 들어온 경우 `benefitNo`로 조회하며 응답은 같다. 응답의 `boardId`로 API-003~007을 호출한다(확정 2026-10-05). 단계와 랭킹 ON/OFF에 따라 화면 구성에 필요한 정보를 반환한다. 개인화 정보는 포함하지 않는다(API-003, API-005로 분리). 랭킹 OFF면 `ranking`, `ANNOUNCEMENT` 단계 키를 응답에서 **생략**한다 |
| 권한 | 공개(비회원 가능) |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId 또는 benefitNo | string / integer | 필수 | 빙고판 ID 또는 혜택 번호(상세 주소의 `benefitNo`) |
| query | lang | Lang | 선택 | 제목·부제목·OG는 KO/EN, SEO는 6개 언어 중 해당 언어 |

**처리 규칙**

| 단계 | `actions` | 화면 안내 |
|------|-----------|-----------|
| `PREVIEW` | 참여·체크 불가 | 열람만, 참여 시작일 안내, 모든 사용자 비활성 버튼 "○○ 오픈 예정"(로그인 유도·UID 연동하기 없음). 로그인 사용자는 API-003 자격 조회 결과 표시(확정 2026-10-05, 2026-10-12 갱신) |
| `PARTICIPATION` | 참여·체크 가능 | 참여·체크 |
| `AGGREGATION` | 불가 | "집계 중" (`notice: AGGREGATING`, 모든 사용자 비활성 "집계 중", 로그인 유도 없음). 랭킹 ON이면 리더보드(API-007)에 집계 시작 시 재산정한 순위를 고정 노출(이후 갱신 멈춤, 확정 2026-10-02) |
| `ANNOUNCEMENT` (ON) | 불가 | 확정 리워드·최종 수상자 리더보드(API-007). 미참여자(API-003 `GUEST`·`NO_ELIGIBLE_UID`·`NOT_REGISTERED`)는 "참여 기간이 끝났어요" + 비활성 버튼 "참여 기간 종료" + "최종 순위를 확인해보세요." |
| `PAYOUT` | 불가 | 지급 안내, 지급 시작일. 랭킹 ON이면 최종 수상자 리더보드(API-007)를 종료(404)까지 계속 노출. 미참여자(`GUEST`·`NO_ELIGIBLE_UID`·`NOT_REGISTERED`)는 "참여 기간이 끝났어요" + 비활성 버튼 "참여 기간 종료"(랭킹 ON이면 "최종 순위를 확인해보세요." 추가) |
| `SCHEDULED` / `ENDED` / `TERMINATED` | - | **404 `BOARD_NOT_FOUND`** (노출 전은 확정 2026-10-05) |

- SEO: 해당 언어에 입력값이 있으면 그 값을, 없으면 `null`을 준다. 프론트는 `null` 항목에 **테더맥스 사이트 기본 메타·기본 미리보기 이미지**를 쓴다(REQ-086). 지원하지 않는 언어 요청은 EN 기준으로 처리(F-011).
- `rewards.maxPerPerson` = 가로 3줄 + 세로 3줄 + 완성 리워드 합계(1인 최대 리워드). 히어로 "빙고 리워드 최대 ○○ USDT"에 쓴다(REQ-128, 확정 2026-10-12). 배너(`bannerImageUrl`)는 혜택 목록 카드용이며 상세 화면에는 표시하지 않는다.
- `batchDelayed`(공개, 확정 2026-10-12): API-005와 같은 기준(참여 단계에서 예정 시각 + 3시간이 지나도 빙고 Batch 미완료이거나 복구되지 않은 `MISSING`이 있으면 `true`, 그 외 `false`). 비회원·미참여자를 포함한 리더보드 지연 안내에 쓴다.

**Response (200 OK) — 랭킹 ON, 참여 단계**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "benefitNo": 31,
    "status": "PARTICIPATION",
    "rankingEnabled": true,
    "exchange": { "code": "BITGET", "name": "Bitget" },
    "title": "비트겟 맥스보드 10월",
    "subtitle": "거래 페이백으로 빙고 칸을 채우고 USDT 리워드 받기",
    "bannerImageUrl": "https://cdn.tethermax.io/maxboard/banner/mb_20261001_bitget01.webp",
    "phases": [
      { "phase": "PREVIEW", "startDate": "2026-10-05", "endDate": "2026-10-07", "startAt": "2026-10-05T00:00:00Z", "endAt": "2026-10-07T23:59:59Z", "days": 3 },
      { "phase": "PARTICIPATION", "startDate": "2026-10-08", "endDate": "2026-10-21", "startAt": "2026-10-08T00:00:00Z", "endAt": "2026-10-21T23:59:59Z", "days": 14 },
      { "phase": "AGGREGATION", "startDate": "2026-10-22", "endDate": "2026-10-24", "startAt": "2026-10-22T00:00:00Z", "endAt": "2026-10-24T23:59:59Z", "days": 3 },
      { "phase": "ANNOUNCEMENT", "startDate": "2026-10-25", "endDate": "2026-10-27", "startAt": "2026-10-25T00:00:00Z", "endAt": "2026-10-27T23:59:59Z", "days": 3 },
      { "phase": "PAYOUT", "startDate": "2026-10-28", "endDate": "2026-11-03", "startAt": "2026-10-28T00:00:00Z", "endAt": "2026-11-03T23:59:59Z", "days": 7 }
    ],
    "eligibilityRule": { "uidRegisteredOnOrAfter": "2026-09-08" },
    "cells": [
      { "cellNo": 1, "row": 1, "col": 1, "type": "AMOUNT", "targetAmount": "5.00" },
      { "cellNo": 2, "row": 1, "col": 2, "type": "STREAK", "streakDays": 3 },
      { "cellNo": 3, "row": 1, "col": 3, "type": "AMOUNT", "targetAmount": "10.00" },
      { "cellNo": 4, "row": 2, "col": 1, "type": "AMOUNT", "targetAmount": "2.00" },
      { "cellNo": 5, "row": 2, "col": 2, "type": "STREAK", "streakDays": 7 },
      { "cellNo": 6, "row": 2, "col": 3, "type": "AMOUNT", "targetAmount": "6.00" },
      { "cellNo": 7, "row": 3, "col": 1, "type": "STREAK", "streakDays": 5 },
      { "cellNo": 8, "row": 3, "col": 2, "type": "AMOUNT", "targetAmount": "15.00" },
      { "cellNo": 9, "row": 3, "col": 3, "type": "AMOUNT", "targetAmount": "20.00" }
    ],
    "rewards": {
      "lines": [
        { "line": "ROW_1", "amount": "3.00" },
        { "line": "ROW_2", "amount": "3.00" },
        { "line": "ROW_3", "amount": "5.00" },
        { "line": "COL_1", "amount": "3.00" },
        { "line": "COL_2", "amount": "4.00" },
        { "line": "COL_3", "amount": "5.00" }
      ],
      "fullBoard": "10.00",
      "maxPerPerson": "33.00"
    },
    "ranking": {
      "winnerCount": 30,
      "poolTotal": "1500.00",
      "tiers": [
        { "fromRank": 1, "toRank": 1, "amountPerPerson": "300.00" },
        { "fromRank": 2, "toRank": 3, "amountPerPerson": "150.00" },
        { "fromRank": 4, "toRank": 10, "amountPerPerson": "50.00" },
        { "fromRank": 11, "toRank": 30, "amountPerPerson": "27.50" }
      ]
    },
    "actions": { "participationOpen": true, "checkOpen": true },
    "notice": null,
    "batchDelayed": false,
    "serverTime": "2026-10-14T05:12:30Z",
    "seo": {
      "lang": "KO",
      "title": "비트겟 맥스보드 | 테더맥스",
      "description": "거래 페이백으로 빙고를 완성하고 USDT 리워드를 받으세요.",
      "ogImageUrl": null
    }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**Response (200 OK) — 랭킹 OFF, 집계 단계 (차이 부분만)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261002_okx01",
    "status": "AGGREGATION",
    "rankingEnabled": false,
    "phases": [
      { "phase": "PREVIEW", "startDate": "2026-10-10", "endDate": "2026-10-11", "startAt": "2026-10-10T00:00:00Z", "endAt": "2026-10-11T23:59:59Z", "days": 2 },
      { "phase": "PARTICIPATION", "startDate": "2026-10-12", "endDate": "2026-10-25", "startAt": "2026-10-12T00:00:00Z", "endAt": "2026-10-25T23:59:59Z", "days": 14 },
      { "phase": "AGGREGATION", "startDate": "2026-10-26", "endDate": "2026-10-28", "startAt": "2026-10-26T00:00:00Z", "endAt": "2026-10-28T23:59:59Z", "days": 3 },
      { "phase": "PAYOUT", "startDate": "2026-10-29", "endDate": "2026-11-04", "startAt": "2026-10-29T00:00:00Z", "endAt": "2026-11-04T23:59:59Z", "days": 7 }
    ],
    "actions": { "participationOpen": false, "checkOpen": false },
    "notice": "AGGREGATING",
    "batchDelayed": false,
    "seo": { "lang": "EN", "title": null, "description": null, "ogImageUrl": null }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 랭킹 OFF 응답에는 `ranking` 키와 `ANNOUNCEMENT` 단계가 없다. `notice` 값: `null` / `AGGREGATING`(집계) / `RESULT_ANNOUNCED`(결과 발표) / `PAYOUT_IN_PROGRESS`(지급 기간).
> `serverTime`(확정 2026-10-07): 응답 시점의 서버 UTC 시각. 프론트는 참여 마감 카운트다운(REQ-117)을 기기 시계 대신 `serverTime`과 `PARTICIPATION.endAt`의 차이로 계산한다. API-002는 공개 캐시 대상이지만 **`serverTime`은 캐시하지 않고 응답할 때마다 채운다**. 캐시 구성상 어려우면 프론트는 응답 헤더 `Date`(캐시 응답이면 `Age`만큼 더함)로 서버 시각을 구한다(확정 2026-10-12). `notice: PAYOUT_IN_PROGRESS`의 화면 문구는 "순차적으로 지급 중"(EN "Paying Out Sequentially", REQ-057). 거래소 로고(REQ-116)는 `exchange.code`로 프론트의 기존 거래소 로고 리소스를 쓴다.

**어드민 API와 필드 이름 대응** (확정 2026-10-12) — 같은 값을 백오피스 API(API-102 생성, API-103 상세)와 이 API가 다른 이름으로 쓴다.

| 이 API (API-002) | 백오피스 API (API-102 / API-103) | 비고 |
|------------------|----------------------------------|------|
| `rewards.lines[]` (`line`: ROW_1~COL_3, `amount`) | `rewards.row1`~`row3`, `col1`~`col3` | 줄 리워드 6개 |
| `rewards.fullBoard` | `rewards.fullBoard` | 같음 |
| `rewards.maxPerPerson` | `perPersonCost` | 6줄 + 완성 리워드 합계(1인 최대) |
| `ranking.tiers[]` | `rankTiers[]` | 구간별 1인 금액 `amountPerPerson` 같음 |
| `ranking.winnerCount`, `ranking.poolTotal` | `ranking.winnerCount`, `ranking.poolTotal` | 같음(API-103) |
| `title`, `subtitle` (요청 `lang`의 KO 또는 EN 값) | `content.titleKo`·`titleEn`, `content.subtitleKo`·`subtitleEn` | |
| `bannerImageUrl` | `content.bannerImageId`(API-102 입력) / `content.bannerImage.url`(API-103) | 이미지 ID로 등록, URL로 조회 |
| `seo.ogImageUrl` (요청 언어 KO면 KO, 그 외 EN) | `content.ogImageKoId`·`ogImageEnId` / `content.ogImageKo`·`ogImageEn` | |
| `seo.title`, `seo.description` (요청 언어 값) | `content.seo.{KO,EN,VI,TC,RU,ID}` | |

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |

---

### API-003. 참여 가능 여부·자격 UID 목록

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/eligibility` |
| 설명 | 로그인 TUID의 참여 상태를 판정하고, 등록 가능한 **자격 UID 목록만** 반환한다(UID별 게이지 미반환, REQ-028). 참여 UID 선택 화면과 재선택 화면이 같은 응답을 쓴다 |
| 권한 | 공개. 비회원은 `GUEST` 반환(200) |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | 빙고판 ID |

**자격 UID 판정 (REQ-022~026, F-003)** — TUID 가입일은 보지 않는다. 아래를 **모두** 만족하는 UID가 자격 UID다.

| # | 조건 |
|---|------|
| 1 | 요청 TUID에 현재 연동된 UID |
| 2 | 빙고판 대상 거래소의 UID |
| 3 | **테더맥스 DB 최초 등록일(UTC 날짜) ≥ 참여 시작일 − 30일**. 참여 기간 중 등록된 UID 포함. 소유권 이전 등으로 다시 연동돼도 최초 등록일 기준 |
| 4 | **이 빙고판**에 참여 기록이 한 번도 없음(다른 빙고판 기록은 무관) |
| 5 | **이슈 UID로 지정되지 않음**(테더맥스 기존 이슈 UID 지정 기능, 확정 2026-10-02) |

**상태 판정**

| `state` | 조건 | 화면 |
|---------|------|------|
| `GUEST` | 비로그인 | 참여 단계에만 로그인 유도 CTA(다른 단계는 비활성 버튼, 확정 2026-10-12) |
| `PARTICIPATING` | 이 빙고판에 상태 `PARTICIPATING`·`EXCLUDED`·`WITHDRAWN` 중 현재 TUID의 참여가 있고 그 참여 UID를 아직 보유(`EXCLUDED`도 이 상태, 안내 문구 없음, Q-08) | 내 빙고판(API-005) |
| `RESELECT_REQUIRED` | 참여 UID를 잃음(확정 2026-10-12): 현재 TUID의 마지막 참여가 `RESET`(참여 기간 중 소유권 이전·이슈 UID 지정) 또는 `FORFEITED`(집계 시작 이후~지급 전)이고 활성 참여 없음, 또는 지급(적립) 후 소유권 이전·이슈 UID 지정으로 참여 UID를 잃어 이력만 남은 경우. 사용자는 UID를 직접 연동 해제할 수 없으므로 원인은 이 두 가지뿐 | 혜택 상세 맨 위 안내 "참여 중이던 UID로 더 이상 참여할 수 없어요" + "이 UID로는 이 빙고판에 다시 참여할 수 없어요."(원인 구분 없음). 참여 단계 + 자격 UID 있음 → 새 UID 선택(`canReselect=true`), 자격 UID 없음 → "참여할 수 있는 {거래소} UID가 없어요. 새 UID를 연동하면 다시 참여할 수 있어요." + UID 연동하기. 참여 단계가 아니면 `canReselect=false`, 버튼 없이 안내만(집계·결과 발표는 "이벤트 리워드는 지급되지 않아요" 추가, 지급 기간은 없음) |
| `NOT_REGISTERED` | 참여 이력 없음 + 자격 UID 1개 이상 | 자격 UID 선택 |
| `NO_ELIGIBLE_UID` | 참여 이력 없음 + 자격 UID 0개 | "참여할 수 있는 {거래소} UID가 없어요" + 신규 UID 연동 안내({거래소} = `exchange.name`, 하드코딩 금지, REQ-077). 참여 단계에만 [UID 연동하기] |

- 결과 발표·지급 기간에 `GUEST`(비회원)·`NO_ELIGIBLE_UID`·`NOT_REGISTERED`이면 비회원을 포함해 모두 같은 화면으로, 상태별 안내 대신 "참여 기간이 끝났어요" + 비활성 버튼 "참여 기간 종료"를 보여준다(랭킹 ON이면 "최종 순위를 확인해보세요."와 최종 순위 추가, 로그인 유도·지급 안내는 숨김, 확정 2026-10-02). 응답 필드 변경은 없다(`boardStatus` + `state` 조합으로 판단).
- 상태 판정은 **사전공개 단계에도 한다**(자격 UID 목록 포함, 30일 기준은 참여 시작일로 계산, 확정 2026-10-05). `actions.canRegister`는 상태가 `NOT_REGISTERED`이고 단계가 `PARTICIPATION`일 때만 `true`. `actions.canReselect`는 `RESELECT_REQUIRED`이고 단계가 `PARTICIPATION`이고 자격 UID가 1개 이상일 때만 `true`.
- 응답에는 항상 `exchange`(`code`, `name`)를 넣는다(화면 문구 `{거래소}` 치환용, 확정 2026-10-12).

**Response (200 OK) — 참여 UID 미등록**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "boardStatus": "PARTICIPATION",
    "state": "NOT_REGISTERED",
    "exchange": { "code": "BITGET", "name": "Bitget" },
    "uidRegisteredOnOrAfter": "2026-09-08",
    "eligibleUids": [
      { "uid": "48201937" },
      { "uid": "48377210" }
    ],
    "actions": { "canRegister": true, "canReselect": false }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**Response (200 OK) — 참여 UID를 잃어 재선택 필요 (참여 기간)**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "boardStatus": "PARTICIPATION",
    "state": "RESELECT_REQUIRED",
    "exchange": { "code": "BITGET", "name": "Bitget" },
    "resetUid": "48201937",
    "resetAt": "2026-10-14T09:12:44Z",
    "resetReason": "OWNERSHIP_TRANSFER",
    "eligibleUids": [ { "uid": "48377210" } ],
    "actions": { "canRegister": false, "canReselect": true }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `resetUid`(잃은 참여 UID), `resetAt`(테더맥스 계정 DB 이력의 소유권 이전·이슈 UID 지정 시각), `resetReason`(`OWNERSHIP_TRANSFER` / `ISSUE_UID`)은 `RESELECT_REQUIRED`일 때만 준다(기존 `unlinkedUid`·`unlinkedAt`·`UNLINKED`에서 이름 변경, 확정 2026-10-12). 화면은 원인과 관계없이 같고 `resetReason`으로 분기하지 않는다(사유 미표시).

**Response (200 OK) — 비회원 / 자격 UID 없음 (요약)**

```json
{ "status": "success", "data": { "boardId": "mb_20261001_bitget01", "boardStatus": "PARTICIPATION", "state": "GUEST", "eligibleUids": [], "actions": { "canRegister": false, "canReselect": false } }, "meta": { "requestId": "req_01J9ZK3Q8W2M" } }
```

```json
{ "status": "success", "data": { "boardId": "mb_20261001_bitget01", "boardStatus": "PARTICIPATION", "state": "NO_ELIGIBLE_UID", "exchange": { "code": "BITGET", "name": "Bitget" }, "uidRegisteredOnOrAfter": "2026-09-08", "eligibleUids": [], "actions": { "canRegister": false, "canReselect": false } }, "meta": { "requestId": "req_01J9ZK3Q8W2M" } }
```

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |
| 503 | `SERVICE_UNAVAILABLE` | 계정 시스템(UID 연동 정보) 조회 실패 |

---

### API-004. 참여 UID 등록 / 재선택

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/maxboard/boards/{boardId}/participation` |
| 설명 | 자격 UID 1개를 이 빙고판의 참여 UID로 등록한다. 등록 시점에 **참여 기록이 생성**되며 이후 이 UID는 이 빙고판에 재참여할 수 없다(REQ-024, REQ-025). 상태가 `RESELECT_REQUIRED`(참여 기간 중 초기화)이면 같은 엔드포인트로 **재선택**을 처리한다(`mode: RESELECT`). 참여 UID 변경 API는 없다(REQ-029) |
| 권한 | 로그인 |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | 빙고판 ID |
| body | uid | string | 필수 | 등록할 UID (API-003 `eligibleUids` 중 1개) |
| body | confirmed | boolean | 필수 | 등록 확인 팝업("등록 후에는 변경할 수 없어요.", 재선택은 "새 UID를 선택하면 이 빙고판의 진행이 처음부터 다시 시작돼요. 등록 후에는 변경할 수 없어요.") 확인 여부. `true`가 아니면 거부(REQ-028) |

```json
{ "uid": "48377210", "confirmed": true }
```

**처리 순서**

1. 단계 = `PARTICIPATION` 확인(참여 기간 중 언제든, 마지막 날 포함. REQ-033)
2. TUID의 이 빙고판 참여 상태 확인: 활성 참여(`PARTICIPATING` 등) 있으면 `ALREADY_PARTICIPATING`. `RESET`만 있으면 재선택 모드(`FORFEITED`는 집계 시작 이후에만 생기므로 1에서 거부)
3. 요청 UID 자격 재확인(API-003 조건 1~5)
4. 참여 레코드 생성(TUID, UID, 등록 시각) — `(boardId, uid)` 유일 제약, `(boardId, tuid, 활성)` 유일 제약으로 동시 요청 시 1건만 성공
5. 참여 시작일부터 그 UID에 이미 쌓인 게이지·연속 기록·연속 칸 활성화 이력을 그대로 연결(소급, REQ-035). 재선택이면 그 빙고판에서 처음 온 사람처럼 시작: 이전 참여의 칸·줄·완성·랭킹·달성 리워드는 승계하지 않음(REQ-030, 확정 2026-10-12)
6. 이력 `UID_REGISTERED` 기록(소급 게이지 값 포함)

**Response (201 Created)**

```json
{
  "status": "success",
  "data": {
    "participantId": "mbp_7f3a91c2",
    "boardId": "mb_20261001_bitget01",
    "mode": "NEW",
    "uid": "48377210",
    "registeredAt": "2026-10-15T03:20:11Z",
    "participantStatus": "PARTICIPATING",
    "retroactive": {
      "availableGauge": "12.00",
      "currentStreakDays": 4,
      "maxStreakDays": 4,
      "activatedStreakCells": [2],
      "reflectedThroughBatchDate": "2026-10-14"
    }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `retroactive.maxStreakDays`(최장 연속)는 **사용자 화면 미사용**이다(사용자 화면은 현재 연속만 표시, 확정 2026-10-02. 필드는 유지).
> `retroactive.reflectedThroughBatchDate`(마지막으로 반영된 페이백 배치 반영일)는 정합성 확인·CS용이며 **사용자 화면에는 표시하지 않는다**(2026-10-02 빙고 Batch 도입). 등록 성공 후 화면은 API-005를 다시 불러 그리며, 참여 기간 중에는 "하루 한 번 업데이트돼요"만 표시한다(다음 업데이트 시각 미표시, 확정 2026-10-02).

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `VALIDATION_ERROR` | `uid` 누락 |
| 400 | `CONFIRMATION_REQUIRED` | `confirmed !== true` |
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |
| 409 | `PHASE_NOT_PARTICIPATION` | 사전공개·집계 이후 단계 |
| 409 | `ALREADY_PARTICIPATING` | 이 빙고판에 이미 활성 참여 UID가 있음(빙고판당 1개) |
| 422 | `UID_NOT_LINKED` | 요청 TUID에 연동되지 않은 UID |
| 422 | `UID_EXCHANGE_MISMATCH` | 대상 거래소 UID 아님 |
| 422 | `UID_REGISTERED_TOO_EARLY` | 최초 등록일 < 참여 시작일 − 30일 |
| 422 | `UID_ALREADY_PARTICIPATED` | 이 빙고판 참여 기록이 있는 UID(원 TUID로 다시 돌아온 UID, 다른 TUID에서 이전된 UID 포함) |
| 422 | `UID_ISSUE_DESIGNATED` | 이슈 UID로 지정된 UID(확정 2026-10-02) |
| 409 | `CONCURRENT_REQUEST` | 같은 TUID·UID의 동시 등록 충돌 |

---

### API-005. 내 빙고판 현황

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/me` |
| 설명 | 참여자의 칸 상태, 사용 가능 게이지, 현재·최장 연속(최장 연속은 사용자 화면 미사용), 달성 줄·완성, 다음 목표, 배치 지연 안내 여부를 반환한다. 칸 추천·강조 정보는 반환하지 않는다(REQ-038) |
| 권한 | 로그인 |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | 빙고판 ID |

**처리 규칙**

- 참여 UID 미등록·`RESET`·`FORFEITED`·지급 후 참여 UID를 잃은 상태: `participation: null`. 게이지는 반환하지 않는다(F-006). 상태 안내는 API-003을 쓴다.
- 칸 상태: 체크됨 → `CHECKED`. 미체크 금액 칸은 `availableGauge ≥ targetAmount`이면 `CHECKABLE`, 아니면 `LOCKED`. 미체크 연속 칸은 활성화 이력이 있으면 `CHECKABLE`(연속이 끊긴 뒤에도 유지, REQ-042), 없으면 `LOCKED`. 단계가 `PARTICIPATION`이 아니면 미체크 칸은 모두 `LOCKED`.
- `batchDelayed`(확정 2026-10-12): 참여 단계에서만 `true`가 될 수 있다. (a) 가장 최근 **빙고 Batch**가 예정 시각 + 3시간이 지나도 완료되지 않았거나(지연 진행 중) (b) 참여 기간 안 날짜에 복구되지 않은 `MISSING`이 있으면 `true` → "페이백 반영이 지연되고 있어요" 표시(REQ-063). 늦게라도 완료되면(결과는 `DELAYED`로 남음) (a)는 `false`로 돌아간다. 같은 값을 API-002에도 준다(공개).
- `dailyUpdateNotice`(participation): "하루 한 번 업데이트돼요" 안내 노출 여부. 참여 단계이고 아직 참여 기간 마지막 날 빙고 Batch가 반영되기 전이면 `true`, 마지막 날 빙고 Batch 반영 후와 집계 단계부터는 더 이상 업데이트가 없으므로 `false`(화면은 안내를 숨김). **다음 업데이트 시각은 주지 않는다**(사용자 화면 미표시, 확정 2026-10-02). `batchDelayed=true`이면 화면은 지연 안내("페이백 반영이 지연되고 있어요")를 우선 표시한다.
- `reflectedThroughBatchDate`: 마지막으로 반영된 페이백 배치 반영일. 정합성 확인·CS용이며 **사용자 화면에는 표시하지 않는다**("○월 ○일 기준" 같은 반영 날짜 표기 폐지, 2026-10-02).
- `nextGoal`: 미완성 줄 중 남은 칸이 가장 적은 줄의 남은 칸 수, 전체 남은 칸 수(REQ-080).
- `rewards`(확정 2026-10-12): `achieved[]`는 **빙고 리워드(줄)·완성 리워드만** 담는다. 항목 = `type`(`LINE` / `FULL_BOARD`), `line`(`LINE`이면 `ROW_1`~`ROW_3`·`COL_1`~`COL_3`, `FULL_BOARD`면 `null`), `amount`(USDT 문자열). 달성 순서(줄 완성 시각 순, 완성 리워드는 마지막)로 준다. `achievedTotal` = 목록 합계. 랭킹 리워드는 넣지 않으며 리더보드 `me.rewardAmount`로만 보여준다. 참여 UID를 잃어 초기화되면 이전 달성 리워드는 모두 사라진다(새 참여 기준). 예: `"achieved": [ { "type": "LINE", "line": "ROW_2", "amount": "3.00" }, { "type": "FULL_BOARD", "line": null, "amount": "10.00" } ]`.
- `streak`: `currentDays`(현재 연속), `maxDays`(최장 연속, **사용자 화면 미사용**, 확정 2026-10-02. 필드는 유지). 참여 단계 화면은 `currentDays`를 라벨 "현재 연속 페이백 기록"(EN "Current Cashback Streak") + 큰 숫자 "○일"(EN "○ Days", 1이면 "1 Day") + 작게 "연속 페이백"(EN "Cashback Streak") + 진행 막대로 표시하고 최고 기록은 표시하지 않는다. 집계 이후 단계(집계·결과 발표·지급 기간)는 라벨을 "최종 연속 페이백 기록"(EN "Final Cashback Streak")으로 바꾸고 같은 숫자를 표시한다(진행 막대 숨김, 확정 2026-10-12). 집계부터 빙고 Batch가 반영되지 않으므로 `currentDays`는 참여 기간 종료 시점 값으로 고정된다(확정 2026-10-02, 응답 필드 변경 없음).
- `ranking`은 랭킹 ON 빙고판에서만 포함한다. 미완성자는 `rank: null` + 참여 단계 `message: COMPLETE_BOARD_TO_RANK`("빙고판을 완성하면 랭킹에 참여할 수 있어요"), 집계 이후 `message: NOT_RANKED_INCOMPLETE`("빙고판을 완성하지 않아 랭킹 대상이 아니에요"). 빙고판은 완성했지만 아직 랭킹 갱신 전이면 `rank: null` + `message: RANK_UPDATES_DAILY`("랭킹은 매일 업데이트돼요"). 단 **참여 기간 마지막 날 빙고 Batch 반영 후 완성**했으면 참여 기간 중 이후 갱신이 없으므로 참여 기간 종료까지 `rank: null` + `message: RANK_FINAL_AT_ANNOUNCEMENT`("최종 순위는 결과 발표 때 확인할 수 있어요", 결과 발표 일시는 API-002 `ANNOUNCEMENT.startAt`). 집계 단계부터는 집계 시작 시 재산정한 순위(`rank`)를 주고, 결과 발표부터는 최종 순위(`rank`)를 준다(확정 2026-10-02). 모든 경우 `lastUpdatedAt`(마지막 갱신, UTC)을 주지만 **화면에는 표시하지 않는다**(확정 2026-10-12). 다음 업데이트 시각은 주지 않는다(확정 2026-10-02).

**Response (200 OK) — 랭킹 ON, 참여 중**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "boardStatus": "PARTICIPATION",
    "participation": {
      "participantId": "mbp_7f3a91c2",
      "uid": "48377210",
      "registeredAt": "2026-10-15T03:20:11Z",
      "participantStatus": "PARTICIPATING",
      "availableGauge": "4.00",
      "streak": { "currentDays": 4, "maxDays": 4 },
      "reflectedThroughBatchDate": "2026-10-14",
      "dailyUpdateNotice": true,
      "batchDelayed": false,
      "cells": [
        { "cellNo": 1, "type": "AMOUNT", "targetAmount": "5.00", "state": "LOCKED" },
        { "cellNo": 2, "type": "STREAK", "streakDays": 3, "state": "CHECKED", "checkedAt": "2026-10-15T03:25:40Z", "activatedAt": "2026-10-11T12:31:13Z" },
        { "cellNo": 3, "type": "AMOUNT", "targetAmount": "10.00", "state": "LOCKED" },
        { "cellNo": 4, "type": "AMOUNT", "targetAmount": "2.00", "state": "CHECKED", "checkedAt": "2026-10-15T03:24:02Z" },
        { "cellNo": 5, "type": "STREAK", "streakDays": 7, "state": "LOCKED" },
        { "cellNo": 6, "type": "AMOUNT", "targetAmount": "6.00", "state": "CHECKED", "checkedAt": "2026-10-15T03:23:51Z" },
        { "cellNo": 7, "type": "STREAK", "streakDays": 5, "state": "LOCKED" },
        { "cellNo": 8, "type": "AMOUNT", "targetAmount": "15.00", "state": "LOCKED" },
        { "cellNo": 9, "type": "AMOUNT", "targetAmount": "20.00", "state": "LOCKED" }
      ],
      "completedLines": [],
      "boardCompletedAt": null,
      "nextGoal": { "cellsToNextBingo": 1, "cellsToFullBoard": 6 },
      "rewards": {
        "achieved": [],
        "achievedTotal": "0.00",
        "rewardStatus": "EXPECTED",
        "payoutStartAt": "2026-10-28T00:00:00Z"
      },
      "ranking": { "rank": null, "message": "COMPLETE_BOARD_TO_RANK", "lastUpdatedAt": "2026-10-14T12:30:00Z" }
    }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> `rewards.rewardStatus`: `EXPECTED`(확정 전) / `CONFIRMED`(랭킹 ON: 결과 발표 시작, OFF: 집계 종료 후). 어뷰징 제외(`EXCLUDED`) 사용자에게는 제외 사실을 알리지 않는다(별도 안내 상태·문구·메시지 코드 없음, Q-08 확정 2026-10-02). 집계 기간에는 일반 참여자와 같게 응답하고, 결과 발표·지급 기간(랭킹 OFF는 지급 기간)에는 `rewards.achieved[].amount`·`rewards.achievedTotal`을 `null`(화면 "-", 적립 안내 미표시), `ranking`을 `null`(내 순위 미표시)로 응답한다. `rewards.rewardStatus`는 일반 참여자와 같은 값을 준다(확정 2026-10-05). 화면 배지 "집계 중"은 별도 값이 아니라 `EXPECTED`이면서 API-002 `status=AGGREGATION`일 때 프론트가 표시한다.

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |

---

### API-006. 칸 체크

| 항목 | 내용 |
|------|------|
| Method | POST |
| URL | `/api/maxboard/boards/{boardId}/cells/{cellNo}/check` |
| 설명 | 사용자가 직접 고른 칸을 체크한다. 칸 종류로 분기한다. **체크는 되돌릴 수 없고**(취소·이동 API 없음), 칸 1개 체크 자체에는 리워드가 없다(REQ-044, REQ-048). 체크 직후 줄·빙고판 완성을 판정해 응답에 포함한다(F-009) |
| 권한 | 로그인 |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | 빙고판 ID |
| path | cellNo | integer | 필수 | 1~9 |
| body | - | - | - | 본문 없음 |

**처리 규칙**

| 공통 | 1) 단계 = `PARTICIPATION` 2) 요청 TUID의 참여 상태 = `PARTICIPATING`(미등록 `NOT_PARTICIPATING`, `RESET`·`FORFEITED` `PARTICIPATION_RESET`, `EXCLUDED`·`WITHDRAWN` `PARTICIPATION_INACTIVE`, 확정 2026-10-12) 3) 해당 칸 미체크 |
|------|------|
| 금액 칸(`AMOUNT`) | 참여 레코드 행 잠금 → `availableGauge ≥ targetAmount` 확인 → **게이지 차감과 체크 기록을 한 트랜잭션으로** 저장(원자적 차감, NFR-004). 다른 금액 칸을 동시에 체크해도 합계가 게이지를 넘지 않는다 |
| 연속 칸(`STREAK`) | 활성화 이력 존재 확인(현재 연속이 끊겼어도 이력이 있으면 가능) → 체크 기록 저장. **게이지 변동 없음** |
| 완성 판정 | 가로 3·세로 3 줄 중 새로 완성된 줄의 완성 시각 기록, 9칸 모두 체크 시 빙고판 완성 시각 기록(DB 히스토리, 랭킹 동점 기준) |

**Response (200 OK) — 연속 칸(7일) 체크로 가로 2줄 완성 (게이지 변동 없음)**

```json
{
  "status": "success",
  "data": {
    "cell": { "cellNo": 5, "type": "STREAK", "state": "CHECKED", "checkedAt": "2026-10-18T05:41:09Z" },
    "gaugeUsed": "0.00",
    "availableGauge": "4.00",
    "newlyCompletedLines": [
      { "line": "ROW_2", "rewardAmount": "3.00", "completedAt": "2026-10-18T05:41:09Z" }
    ],
    "completedLines": ["ROW_2"],
    "boardCompleted": false,
    "boardCompletedAt": null,
    "nextGoal": { "cellsToNextBingo": 1, "cellsToFullBoard": 4 }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**Response (200 OK) — 마지막 칸 체크로 빙고판 완성 (랭킹 ON)**

```json
{
  "status": "success",
  "data": {
    "cell": { "cellNo": 9, "type": "AMOUNT", "state": "CHECKED", "checkedAt": "2026-10-20T11:02:33Z" },
    "gaugeUsed": "20.00",
    "availableGauge": "7.50",
    "newlyCompletedLines": [
      { "line": "ROW_3", "rewardAmount": "5.00", "completedAt": "2026-10-20T11:02:33Z" },
      { "line": "COL_3", "rewardAmount": "5.00", "completedAt": "2026-10-20T11:02:33Z" }
    ],
    "completedLines": ["ROW_1", "ROW_2", "ROW_3", "COL_1", "COL_2", "COL_3"],
    "boardCompleted": true,
    "boardCompletedAt": "2026-10-20T11:02:33Z",
    "fullBoardRewardAmount": "10.00",
    "nextGoal": { "cellsToNextBingo": 0, "cellsToFullBoard": 0 },
    "ranking": { "rank": null, "message": "RANK_UPDATES_DAILY" }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 랭킹 ON 빙고판의 완성 응답은 **순위를 주지 않고** `ranking.message: RANK_UPDATES_DAILY`("랭킹은 매일 업데이트돼요")만 준다(다음 업데이트 시각 없음, 확정 2026-10-02).
> **예외(확정 2026-10-02)**: 참여 기간 마지막 날 빙고 Batch가 반영된 뒤(사용자 API `dailyUpdateNotice=false`가 된 뒤) 완성하면 `ranking: { "rank": null, "message": "RANK_FINAL_AT_ANNOUNCEMENT" }`를 준다. 참여 기간 중에는 이후 랭킹 갱신이 없기 때문이다. 화면은 "최종 순위는 결과 발표 때 확인할 수 있어요"와 결과 발표 일시(API-002 `phases`의 `ANNOUNCEMENT.startAt`, 별도 필드 추가 없음)를 보여준다. 이 사용자도 랭킹 대상이며 집계 시작 시 재산정(JOB-03)에서 순위에 반영되고 결과 발표(JOB-05) 때 최종 확정된다(확정 2026-10-02).
> 순위는 다음 랭킹 갱신(JOB-03) 후 API-005·API-007에서 보인다(확정 2026-10-01). 랭킹 OFF 빙고판의 완성 응답에는 `ranking` 대신 `payoutStartAt`을 준다(REQ-081).
> 응답에는 체크한 칸만 들어 있다. 체크로 게이지가 줄면 다른 금액 칸의 상태가 바뀔 수 있으므로 프론트는 성공 후 **API-005를 다시 조회**해 9칸 상태·체크 가능한 최대 칸을 갱신한다(확정 2026-10-12).

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 400 | `INVALID_CELL` | `cellNo`가 1~9 아님 |
| 401 | `UNAUTHORIZED` | 비로그인 |
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |
| 409 | `PHASE_NOT_PARTICIPATION` | 참여 단계 아님(집계부터 체크 불가) |
| 409 | `NOT_PARTICIPATING` | 참여 UID 미등록 |
| 409 | `PARTICIPATION_RESET` | 소유권 이전·이슈 UID 지정으로 참여가 초기화(`RESET`)·소멸(`FORFEITED`)됨 |
| 409 | `PARTICIPATION_INACTIVE` | 참여 상태가 제외·탈퇴 |
| 409 | `CELL_ALREADY_CHECKED` | 이미 체크한 칸 / 동시 중복 요청 |
| 422 | `INSUFFICIENT_GAUGE` | 금액 칸, 게이지 부족 |
| 422 | `STREAK_CELL_NOT_ACTIVATED` | 연속 칸, 미활성 |
| 409 | `CONCURRENT_REQUEST` | 같은 참여자의 다른 체크가 처리 중(잠금 대기 초과) |

---

### API-007. 사용자 리더보드

| 항목 | 내용 |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/leaderboard` |
| 설명 | 랭킹 ON 빙고판에서 **수상 인원 전체의 순위**(모든 단계, 1위부터 `winnerCount`위까지)와 **내 순위**를 반환한다. 대상은 빙고판 완성자만. TUID는 글로벌 리그와 같은 마스킹 규칙(예: `99****76`)을 서버에서 적용한다(REQ-052). 결과 발표 단계부터는 **최종 수상자 리더보드**(순위 / 랭킹 리워드 금액 `rewardAmount` / 마스킹 TUID)를 반환하며, **지급 기간에도 종료(404)까지 같은 확정 결과**를 반환한다(REQ-052, REQ-056) |
| 권한 | 공개. 로그인 시 `me` 포함 |
| 캐싱 | 비로그인 요청만 공개 캐시. 로그인 요청은 `me`가 들어 있으므로 `Cache-Control: private, no-store`(확정 2026-10-12). 무효화 이벤트는 1.1 "캐싱" |

**Request**

| 위치 | 파라미터 | 타입 | 필수 | 설명 |
|------|----------|------|------|------|
| path | boardId | string | 필수 | 빙고판 ID |
| query | page | integer | 선택 | 페이지 번호(1부터, 기본 1). 범위를 벗어나면 `entries: []`. 한 페이지는 **10행 고정**이며 행 수를 정하는 파라미터는 없다 (확정 2026-10-02) |

**처리 규칙**

- 순위: 참여 기간 총 페이백(누적 게이지) 내림차순, 동점이면 빙고판 완성 기록이 DB에 먼저 저장(insert)된 순(REQ-049, REQ-050). 매일 빙고 Batch 때 갱신하고 집계 단계 시작 직후 한 번 재산정한다(JOB-03, 확정 2026-10-02). 참여 기간 중 탈퇴·초기화된 완성자는 다음 빙고 Batch 산정에서 대상에서 빠진다(자리 비움 아님, 확정 2026-10-12). 다음 업데이트 시각은 주지 않는다(사용자 화면 미표시, 확정 2026-10-02). `lastUpdatedAt`은 주지만 화면에 표시하지 않는다(확정 2026-10-12). `dailyUpdateNotice`는 API-005와 같은 기준(참여 단계이고 마지막 날 빙고 Batch 반영 전이면 `true`, 그 외 `false`)이며 화면은 `true`일 때만 "하루 한 번 업데이트돼요"를 표시한다. 지연 안내는 API-002 `batchDelayed`를 쓴다.
- 집계 시작 이후 어뷰징 제외·탈퇴·소멸(소유권 이전·이슈 UID 지정)로 비운 자리는 `status: VACANT`로 순위를 유지하고 뒷순위를 당기지 않는다(REQ-066). 사용자 API는 **결과 발표부터** 비운 자리 행을 `entries`에서 **빼고** 보낸다. 남은 행의 `rank`는 원래 순위를 그대로 쓴다(예: 15위가 비면 14, 16 순서, Q-06 확정 2026-10-05). 집계 단계에는 재산정 결과 그대로 고정하므로 그 사이 생긴 비운 자리도 행을 그대로 두고 결과 발표 때 반영한다(확정 2026-10-12).
- **`entries` 범위(확정 2026-10-02)**: 참여·집계·결과 발표·지급 기간 **모든 단계에서 수상 인원 전체**(1위부터 `winnerCount`위까지, 예: 30명이면 30위까지)를 반환한다. 비운 자리는 행에서 뺀다(확정 2026-10-05). 완성자가 수상 인원보다 적으면 있는 순위까지만 반환한다. 수상권 밖 사용자의 순위는 `me`로만 준다.
- **페이지네이션(확정 2026-10-02)**: `entries`는 `page`로 자른 해당 페이지 행만 준다(한 페이지 10행 고정, 모든 단계 동일). 응답 `totalCount`는 표시 대상 행 수 = 수상 순위(1위~`winnerCount`위) 중 비운 자리를 뺀 행 수(확정 2026-10-05), `page`는 적용값, `size`는 항상 10이다. 1페이지뿐이면 화면은 페이지 버튼을 숨긴다. 완성자가 수상 인원보다 적으면 그만큼만 준다(예: 수상 30명·완성 18명이면 `totalCount: 18`, 2페이지). `me`는 페이지와 관계없이 항상 준다(화면은 목록 아래 고정). 응답 `data`가 객체(`me` 포함)라서 공통 목록 형식의 `meta.pagination` 대신 `data`에 둔다.
- **수상 인원 표기(확정 2026-10-06)**: `winnerCount`는 등수별 팝업과 페이지 계산용이며, 화면 리더보드 위에 총 인원("수상 인원 ○명 전체")으로 표기하지 않는다(REQ-052).
- 사전공개 단계는 `entries: []`. 총 랭킹 리워드와 등수별 금액은 API-002 `ranking.poolTotal`·`ranking.tiers`로 사전공개부터 표시한다(확정 2026-10-02).
- **집계 단계에는 집계 시작 직후 재산정한 순위(JOB-03, 참여 기간 중 모든 완성자 반영)를 반환**하고 이후 갱신을 멈춘다(`finalized: false`, `rewardAmount`는 그 순위의 구간 금액). 그 사이 생긴 어뷰징 제외·탈퇴·소멸도 사용자 응답에는 반영하지 않는다(확정 2026-10-12). 화면은 "집계 중"과 함께 노출한다. 집계 중 순위와 최종 순위의 차이는 이렇게 비운 자리에서만 생긴다. 결과 발표 때는 JOB-05에서 확정한 최종 순위(비운 자리 행은 빼고, 뒷순위 당기지 않음)를 반환한다(확정 2026-10-02, 2026-10-05 갱신). 결과 발표·지급 기간은 `finalized: true`, `rewardAmount` 포함, 확정 결과 고정(갱신 없음). 두 단계의 응답 내용은 같고, 화면 라벨은 "최종 순위"(EN "Final Ranking")다. 컬럼은 모든 단계 같다(순위, 트레이더 `tuidMasked`, 총 페이백 `totalCashback`, 랭킹 리워드 `rewardAmount`, 확정 2026-10-12).
- **`me`(확정 2026-10-12)**: 비회원, 참여 UID 미등록, 참여 UID를 잃은 사용자(`RESET`·`FORFEITED`·지급 후 잃음)는 `"me": null`(화면 내 순위 영역 없음). 수상권(1위~`winnerCount`위) 밖 완성자는 `rank`는 주고 `rewardAmount: null`(화면 "-").

**Response (200 OK) — 결과 발표·지급 기간 단계**

```json
{
  "status": "success",
  "data": {
    "boardId": "mb_20261001_bitget01",
    "boardStatus": "ANNOUNCEMENT",
    "lastUpdatedAt": "2026-10-22T00:05:00Z",
    "dailyUpdateNotice": false,
    "winnerCount": 30,
    "totalCount": 29,
    "page": 1,
    "size": 10,
    "finalized": true,
    "entries": [
      { "rank": 1, "status": "NORMAL", "tuidMasked": "T1****75", "totalCashback": "5120.44", "rewardAmount": "300.00" },
      { "rank": 3, "status": "NORMAL", "tuidMasked": "T2****18", "totalCashback": "3988.02", "rewardAmount": "150.00" }
    ],
    "me": { "completed": true, "rank": 12, "totalCashback": "412.37", "rewardAmount": "27.50", "message": null }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

> 예시는 2위가 비운 자리라 1위 다음에 3위가 온다(비운 자리 행 미반환, 확정 2026-10-05). 예시는 지면상 `entries` 2행만 적었다. 실제로는 요청한 페이지의 행(10행 고정)을 반환하며, 전체 행은 1위부터 min(완성자 수, `winnerCount`)위까지에서 비운 자리를 뺀 행이다(예: 30명 모두 완성·비운 자리 1곳이면 `totalCount: 29`, 3페이지). 마스킹은 앞 2자리·뒤 2자리 노출(Q-15).
> 참여·집계 단계에서는 `finalized: false`이고, `rewardAmount`는 **모든 단계에서** 그 순위의 랭킹 리워드 구간 금액을 준다(확정 2026-10-02. 확정 전 단계에서는 "이 순위의 상금"이라는 뜻이며 지급 확정이 아니다)(참여 단계 `dailyUpdateNotice`는 마지막 날 빙고 Batch 반영 전까지 `true`, 집계 단계는 `false`). 예시의 `lastUpdatedAt`은 집계 시작 직후 재산정 시각이며(이후 갱신 없음) 화면에는 표시하지 않는다. 어뷰징 제외(`EXCLUDED`) 사용자: 결과 발표·지급 기간에는 `"me": null`(화면은 "내 순위" 행 숨김, 이유 문구 없음, Q-08), 집계 단계는 일반 완성자와 같음. 미완성 로그인 사용자: 참여 단계 `"me": { "completed": false, "rank": null, "rewardAmount": null, "message": "COMPLETE_BOARD_TO_RANK" }`, 집계 이후 `message: "NOT_RANKED_INCOMPLETE"`. 마지막 날 빙고 Batch 반영 후 완성자: 참여 기간 종료까지 `"me": { "completed": true, "rank": null, "rewardAmount": null, "message": "RANK_FINAL_AT_ANNOUNCEMENT" }`, 집계 단계부터는 재산정 순위를 `rank`로 준다. 수상권 밖 완성자: `"me": { "completed": true, "rank": 41, "totalCashback": "88.10", "rewardAmount": null, "message": null }`. 비회원·미참여자·참여 UID를 잃은 사용자: `"me": null`. 사전공개(`entries: []`) 화면 문구 "랭킹은 참여 기간이 시작되면 공개돼요", 참여 기간 완성자 0명(`totalCount: 0`) 화면 문구 "아직 빙고판을 완성한 사람이 없어요"(REQ-130).

**에러 코드**

| 상태 코드 | 에러 코드 | 조건 |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | 없는 빙고판, `SCHEDULED`(노출 전), `ENDED`, `TERMINATED` |
| 400 | `VALIDATION_ERROR` | `page`가 1 미만 |
| 404 | `RANKING_DISABLED` | 랭킹 OFF 빙고판 |

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
| 자격 = 최초 등록일 ≥ 참여 시작일 − 30일 AND 이 빙고판 참여 기록 없음 AND 이슈 UID 아님 | API-003, API-004 | `UID_REGISTERED_TOO_EARLY`, `UID_ALREADY_PARTICIPATED` |
| 게이지 적립 = 30일 조건만(참여 중 UID 포함), 참여 기록 조건은 등록 시에만 | JOB-01 | 내부 규칙 |
| TUID당 빙고판별 참여 UID 1개 | API-004 (DB 유일 제약) | `ALREADY_PARTICIPATING` |
| 참여·칸 체크는 참여 단계만 | API-004, API-006 | `PHASE_NOT_PARTICIPATION` |
| 금액 칸: 게이지 ≥ 목표, 원자적 차감 | API-006 (행 잠금 + 단일 트랜잭션) | `INSUFFICIENT_GAUGE`, `CELL_ALREADY_CHECKED` |
| 연속 칸: 활성화 필요, 게이지 미소진 | API-006 | `STREAK_CELL_NOT_ACTIVATED` |
| 노출 전·종료·강제 종료 페이지 404 | 사용자 API 전체 | `BOARD_NOT_FOUND` |
| 이슈 UID는 참여 UID 불가 | API-003(목록 제외), API-004 | `UID_ISSUE_DESIGNATED` |
| 상세 주소는 `benefitNo` | API-002(`/benefits/{benefitNo}`) | 응답의 `boardId`로 이후 호출 |

---

## 7. 확인 필요

> 아래는 PRD.md 초안 단계에서 정해져 있지 않아 API 동작을 확정할 수 없는 항목이다. 확정 전까지 표시한 잠정 동작으로 구현하되 값은 파라미터화한다.

| # | 항목 | 확인 내용 | 잠정 동작(본 문서) | 관련 API |
|---|------|-----------|--------------------|----------|
| Q-01 | 기간 "종료일" 표기 | **확정(2026-10-01)**: 종료일 = 그 단계의 마지막 날(23:59:59 UTC까지 포함), 다음 단계는 다음 날 00:00:00 UTC 시작. 1.5 참조 | 확정 반영 | API-002, API-102, JOB-04 |
| Q-05 | 빙고판 완성 직후 "현재 순위" 산정 기준 | **확정(2026-10-01, 2026-10-02 갱신)**: 완성 직후에는 순위를 보여주지 않고 "랭킹은 매일 업데이트돼요" 안내만 준다(다음 업데이트 시각 없음). 다음 랭킹 갱신부터 순위 표시. 예외(2026-10-02): 마지막 날 빙고 Batch 반영 후 완성은 참여 기간 종료까지 `RANK_FINAL_AT_ANNOUNCEMENT`("최종 순위는 결과 발표 때 확인할 수 있어요" + 결과 발표 일시), 집계 시작 시 재산정 때 순위에 반영되고 결과 발표 때 최종 확정 | 확정 반영 | API-006, API-005, API-007, JOB-05 |
| Q-06 | 사용자 리더보드의 "자리 비움" 표시 | **확정 2026-10-05**: 비운 자리 행은 보여주지 않고 순위 번호는 당기지 않는다(예: 15위가 비면 14위 다음 16위) | 확정 반영. `VACANT` 행 미반환 | API-007 |
| Q-07 | 집계 이후 소멸·제외·탈퇴된 완성자의 랭킹 자리 | **확정(2026-10-01, 2026-10-12 갱신)**: 집계 시작 이후 소멸(소유권 이전·이슈 UID 지정)·제외·탈퇴된 완성자는 자리 비움(`VACANT`), 뒷순위 당기지 않음. 참여 기간 중 탈퇴·초기화된 완성자는 순위 대상에서 빠짐(자리 비움 아님). 사용자 리더보드는 집계 단계 동안 고정, 결과 발표 때 반영 | 확정 반영 | API-007, API-106, JOB-03, JOB-07 |
| Q-08 | 제외 사용자 본인 화면 | **확정(2026-10-02)**: 어뷰징 제외 사실을 사용자에게 알리지 않는다. "지급 대상 아님" 안내 상태·문구는 두지 않는다(어뷰징을 직접 확인할 방법이 없어 집계 후 제외는 명백한 경우에만 하므로). 집계 기간은 일반 참여자와 같음. 결과 발표·지급 기간(랭킹 OFF는 지급 기간): 내 리워드 금액 "-"(적립 안내 미표시), 내 순위·리더보드 "내 순위" 행 숨김, 목록에서도 그 자리 행은 보이지 않음(Q-06). 결과 이메일 미발송은 기존대로 | 확정 반영. API-005 리워드 금액·`ranking` `null`, API-007 `me` `null`. `participantStatus`는 내부 구분용 | API-003, API-005 |
| Q-09 | 배치 "지연"·"누락" 판정 기준 | **확정(2026-10-01, 2026-10-02 빙고 Batch 기준으로 변경, 2026-10-12 보강)**: 판정 대상은 빙고 Batch. 판정 전·실행 중 = `PENDING`, 빙고 Batch 예정 시각 + 3시간 미완료 = 지연, 그날 다음 날 00:00 UTC까지 미완료 = 누락(실행 중단, 늦은 결과 미반영). 예정 시각은 설정값(모든 거래소 공통) | 확정 반영 | API-002, API-005, API-110, JOB-08 |
| Q-16 | 빙고 Batch 실행 시각 | 모든 거래소 공통 1회, Bitget 페이백 배치(UTC 12:00) 이후. 구체 시각은 백엔드 논의(PRD Open Issue #BATCH) | 설정값으로 구현, 문서 예시는 12:30 UTC(사용자 API에는 내보내지 않음) | API-110, JOB-01~03, JOB-08 |
| Q-11 | SEO 언어별 미입력 시 대체 순서 | **확정(2026-10-01)**: 해당 언어 값이 없으면 다른 언어로 대체하지 않고 테더맥스 사이트 기본 메타·기본 미리보기 이미지를 쓴다. 간체(SC) 추가 여부는 Open Issue #SC | 해당 언어 값이 없으면 `null` → 사이트 기본 메타. SC 미지원 | API-002, API-102, API-104 |
| Q-14 | 인증 연동 방식 | **확정(2026-10-01)**: 사용자 로그인과 백오피스 권한(마스터/오퍼레이터/PM/CS)은 기존 체계를 그대로 사용. 구현 방식은 개발팀 결정 | 확정 반영 | 전체 |
| Q-15 | TUID 마스킹 규칙 원문 | **확정(2026-10-01)**: 글로벌 리그와 같은 마스킹(예: `99****76`, 앞 2자리·뒤 2자리 노출). 글로벌 리그 마스킹 함수 공용 사용 | 확정 반영 | API-007 |
