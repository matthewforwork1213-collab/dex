# API Specification — Back Office

> English translation of `API스펙_ko.md`. If the two differ, the Korean original prevails.
> EN copy not yet in the language pack is marked [EN draft] and needs language-pack review.

| Item | Details |
|------|------|
| Project | TetherMax New Member Bingo Event (service name: MAX BOARD / 맥스보드) |
| Created | 2026-10-01 |
| Version | v1.5 (2026-10-12 consistency review applied (confirmed 2026-10-12; 2.1 common errors and chapter 5 internal jobs are synchronized based on the user document): participating UID lost only through ownership transfer or issue UID, `ParticipantStatus` RESET (participation period) / FORFEITED (from aggregation start until before payout) redefined, `resetReason` `OWNERSHIP_TRANSFER`/`ISSUE_UID` (`UNLINKED` removed), `EligibilityState` `RESELECT_REQUIRED`, API-106 status shown immediately, ranks fixed, `vacantReason` organized, `finalized`, default size, `BatchResult` `PENDING`, run stopped when confirmed as Missed, `recoveryState`, recovery recalculation scope, when `applied` is decided, `SOURCE_CORRECTED`, history entry `UID_LOST_AFTER_PAYOUT` for UID changes after payout, cache invalidation events, reference to the user API-002 field mapping, basis for CS buttons, API-107 `resetReason` query, `INVALID_IMAGE_REF`, top-level `VALIDATION_ERROR` + `fields[].code`, expected payout after confirmation, error check order and recovery stopped on termination, `RANKING_DISABLED` added to 2.2, Terminate and recovery popup text unified, source document notation, notation for REQ references to the user document) / v1.4 (2026-10-07 PRD v0.11 and requirements v1.6 checked: no back-office change (menu location League/Board > MAX BOARD List already applied). User screen changes (REQ-116~123) are in the user documents; no common logic change) / v1.3 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, ranking reward total/per-place/column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02 changes applied: batch recovery reason input removed, local-time conversion on user screens, per-exchange batch time examples removed, final winners leaderboard shown through the payout period, email payout date written as a UTC date, UTC wording exception in Notes stated, Bingo Batch introduced, removal of `nextUpdateAt` from the user API applied (admin API `scheduledAt` kept), reward wording unified from "pay" to "credit", streak judgment confirmed for days the Bingo Batch itself was missed and days the cashback batch had not finished, final ranking for users who completed after the last day's Bingo Batch (common logic), difference between the aggregation ranking and the final ranking and recalculation at announcement marked as confirmed (common logic), ranking recalculated at aggregation start (JOB-03/JOB-04/JOB-05 common logic, applied to the API-106 ① Status leaderboard; the aggregation ranking differs from the final ranking only by vacant places), PRD v0.9 applied) |
| Audience | Back-office developers |
| Scope | 16 admin APIs (API-101~116) + 11 internal jobs (JOB-01~11, common) |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/백오피스/요구사항정의서_en.md, 기능명세_프론트_en.md, 기능명세_백엔드_en.md |

> This document is the reference document (no combined version, organized 2026-10-01).
> **Internal jobs (JOB-01~11)** that run as batches/events **are included with the same content in both the user and back-office documents**. When changing an internal job, change both documents together.
> User APIs (API-001~007) are in `분할문서/사용자/API스펙_en.md`. API-00x mentioned in the body refers to that document.

---

## 1. API Common Items

### 1.1 Basic Information

| Item | Details |
|------|------|
| User API Base | `/api/maxboard` |
| Admin API Base | `/api/admin/maxboard` |
| Deployment location | M1~M4: Next.js Route Handlers (`src/frontend/app/api/*`), integrated Vercel deployment. Internal jobs run on a separate batch worker/cron (to be confirmed in Infrastructure Architecture #10) |
| Response format | JSON (`Content-Type: application/json; charset=utf-8`). Only CSV downloads use `text/csv` |
| Character encoding | UTF-8 |
| Time notation | All date-times are **UTC ISO-8601** (`2026-10-15T03:20:00Z`). Values that need only a date use `YYYY-MM-DD` (UTC date). The API returns UTC for both users and admins, without conversion. **User screens** are converted by the front end to the device's local time (periods shown as date + time together), and the **back-office screens** show UTC as is (changed 2026-10-02). On user screens, "UTC" and time zone notation (GMT+9, etc.) are not added. Exception: the common Notes text (fixed in the front end) keeps the UTC basis statement ("All dates and times are based on UTC") (it states the judgment basis) |
| Amount notation | All amounts are in **USDT**, as **decimal strings with up to two decimal places** (`"12.50"`, `"0.01"`). Floating-point number types must not be used. If a request has three or more decimal places, `INVALID_AMOUNT` |
| Cell position | `cellNo` 1~9, row-major. `(1,1)=1, (1,2)=2, (1,3)=3, (2,1)=4 ... (3,3)=9`. Responses also include `row` and `col` (1~3) |
| Line identifiers | `ROW_1`, `ROW_2`, `ROW_3` (rows), `COL_1`, `COL_2`, `COL_3` (columns). There are no diagonal identifiers |
| Language | User APIs use the `lang` query (`KO`/`EN`/`VI`/`TC`/`RU`/`ID`) first, otherwise `Accept-Language`. Title, subtitle and OG are KO for `KO` and EN for everything else |
| Line breaks | Titles and subtitles (KO/EN) may contain `<br />` (REQ-106, REQ-107 (see User Requirements Definition)). The server stores and returns input as is; the screen shows `<br />`, `<br/>` and `<br>` (case-insensitive) as line breaks and shows any other HTML as literal text. **Applies to titles and subtitles only** (not to SEO title/description or OG). No character limit. Where the board name is shown on one line, such as the back-office list, the top of the detail and the participant detail, `<br />` is replaced with a single space |
| Cashback batch time | The existing TetherMax per-exchange daily batch (the "cashback batch") runs every day **between 11:00 and 12:00 UTC (20:00 to 21:00 KST)**, one exchange at a time (Bitget runs at 12:00 UTC because it has many UIDs). **Cashback batch date** = the UTC date on which the cashback batch ran (the streak judgment date). MAX BOARD does not use the cashback batch directly |
| Bingo Batch time | The MAX BOARD daily batch (the "Bingo Batch", JOB-01~03) reads the cashback batch results and updates the gauge, streak, streak cell activation and ranking together. It runs **once a day at a fixed time common to all exchanges**; the time is a setting (after Bitget, the latest cashback batch). **The exact time is undecided** (backend discussion, Open Issue #BATCH). Delayed/Missed are judged against the Bingo Batch scheduled time. **The next update time is not shown on user screens, and the user API does not return a next update time (`nextUpdateAt`)** (confirmed 2026-10-02; the user API returns only `dailyUpdateNotice`, whether to show "Updated once a day"). The Bingo Batch scheduled time is kept as an internal setting and returned as is in admin APIs (API-110 `scheduledAt`, etc.). 12:30 UTC in this document's examples is an illustrative value |
| Caching | Benefits list, detail and leaderboard are response caching targets (NFR-001 (see User Requirements Definition)). Personalized responses (`/eligibility`, `/me`) use `Cache-Control: private, no-store`. TTL is set in Infrastructure Architecture (#10). Cache invalidation events are in the "Cache invalidation" row below |
| Cache invalidation | When the events below finish, the relevant user API caches are invalidated immediately (per board). **Admin actions**: content edit (API-104) → API-001, 002 / termination (API-114) → API-001, 002, 007 / batch recovery done (API-111) → API-002 (delay notice `batchDelayed`), plus API-007 if `applied=true` / abuse exclusion (API-113) → none (the user leaderboard is fixed during aggregation and updated at the switch to announcement). **System actions**: stage transition (JOB-04) → API-001, 002, 007 / ranking update, recalculation and confirmation (JOB-03, 05) → API-007 / Bingo Batch delay judgment and completion (JOB-08) → API-002 |

### 1.2 Authentication and Authorization

| Type | Method | Notes |
|------|------|------|
| Admin API | Reuses the existing TetherMax back-office authentication and permission system | Permission roles: `MASTER`, `OPERATOR`, `PM`, `CS` |

**Admin permission matrix (F-030, REQ-020~021, NFR-006)**

| Permission | View (GET) | Create, edit, abuse exclusion, batch recovery, termination, image upload | CSV download |
|------|-----------|----------------------------------------------------------|--------------|
| MASTER / OPERATOR | O | O | O |
| PM | O | O | O |
| CS | O | **X (403 `FORBIDDEN_ROLE`)** | **X (403 `FORBIDDEN_ROLE`)** |

> Apart from disabling buttons on screen, the server rechecks the role on every change request and CSV request.

### 1.3 Response Format

**Success**

```json
{
  "status": "success",
  "data": { },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**List (pagination)**

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

| Parameter | Type | Required | Default | Description |
|----------|------|------|--------|------|
| page | integer | Optional | 1 | Starts at 1 |
| size | integer | Optional | 20 | Max 100. `VALIDATION_ERROR` if exceeded |

**Error**

```json
{
  "status": "error",
  "error": {
    "code": "INSUFFICIENT_GAUGE",
    "message": "The available Bingo Gauge is less than the cell's target amount.",
    "details": { "cellNo": 5, "targetAmount": "10.00", "availableGauge": "4.00" }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

- `message` is a default text for development and logs. User-facing text is shown by the front end from i18n resources based on `code` (NFR-009).
- Input validation failures put per-field errors in `details.fields`: `[{ "field": "cells[3].targetAmount", "code": "AMOUNT_CELL_MIN" }]`.
- **Top-level code for body validation failures**: when body validation of API-102 or API-104 fails, the top-level `error.code` is always **`VALIDATION_ERROR`**, and the per-item codes in 2.2 (codes whose "delivery" is `fields[].code`) are given only in `details.fields[].code`. If several items fail, all are included at once. Codes that reject the whole request (`CONFIRMATION_REQUIRED`, `LOCKED_FIELD_NOT_EDITABLE`, `FORBIDDEN_ROLE`, `BOARD_CLOSED`, etc.) are given as the top-level code.

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Input validation failed.",
    "details": { "fields": [ { "field": "cells[3].targetAmount", "code": "AMOUNT_CELL_MIN" }, { "field": "rankTiers[1].fromRank", "code": "RANK_TIER_GAP" } ] }
  },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

### 1.4 Common Enums

| Enum | Value | Meaning |
|------|-----|------|
| `BoardStatus` | `SCHEDULED` | Scheduled (after registration, before pre-open starts. User APIs return 404, not shown in Benefits, confirmed 2026-10-05) |
| | `PREVIEW` | Pre-open |
| | `PARTICIPATION` | Participation |
| | `AGGREGATION` | Aggregation |
| | `ANNOUNCEMENT` | Announcement (ranking ON only) |
| | `PAYOUT` | Payout period |
| | `ENDED` | Ended (after the payout period ends, user page 404) |
| | `TERMINATED` | Terminated (user page 404, distinguished from a normal end) |
| `CellType` | `AMOUNT` | Amount cell (uses gauge equal to the target amount) |
| | `STREAK` | Cashback streak cell (activated after N consecutive days, uses no gauge) |
| `CellState` (user) | `CHECKED` | Checked |
| | `CHECKABLE` | Checkable (amount cell: available gauge ≥ target / streak cell: activated) |
| | `LOCKED` | Locked |
| `CellState` (admin mini board) | `CHECKED` / `OPEN` / `UNCHECKED` | Checked / streak cell opened but not checked / not checked |
| `ParticipantStatus` | `PARTICIPATING` | Participating |
| | `RESET` | Reset (ownership transfer or issue UID designation of the participating UID **during the participation period**. The user becomes like a newcomer on that board: checked cells, lines, Full Board, ranking and achieved rewards disappear, and a new UID can be selected). Reason `resetReason` |
| | `EXCLUDED` | Excluded (abuse, cannot be undone) |
| | `WITHDRAWN` | Withdrawn |
| | `FORFEITED` | Forfeited (ownership transfer or issue UID designation of the participating UID **from aggregation start until before payout**. No rewards; if the user has a Full Board, the ranking place is left vacant). Reason `resetReason`. An ownership transfer or issue UID designation after payment (crediting) does not change the status; only the history entry `UID_LOST_AFTER_PAYOUT` is kept (confirmed 2026-10-12) |
| `ResetReason` | `OWNERSHIP_TRANSFER` / `ISSUE_UID` | Why the participating UID was lost: ownership transfer (another person takes the UID through ownership verification) / issue UID designation. Users never unlink a UID themselves (`UNLINKED` removed, confirmed 2026-10-12) |
| `EligibilityState` | `GUEST` / `NO_ELIGIBLE_UID` / `NOT_REGISTERED` / `PARTICIPATING` / `RESELECT_REQUIRED` | See API-003. `RESELECT_REQUIRED` = the participating UID was lost through ownership transfer or issue UID (formerly `UNLINKED_RESELECT_REQUIRED`, confirmed 2026-10-12) |
| `BatchResult` | `PENDING` / `NORMAL` / `DELAYED` / `MISSING` | Before judgment or running / Normal / Delayed / Missed. A run not finished by 00:00 UTC of the next day is stopped and confirmed as `MISSING`; it stays `MISSING` after recovery (`recovered=true`) |
| `RecoveryState` | `RUNNING` / `DONE` / `FAILED` | Batch recovery progress (API-110). `null` if no recovery was requested |
| `LeaderboardEntryStatus` | `NORMAL` / `VACANT` | Normal / Excluded · Vacant (only after aggregation starts). The admin leaderboard (API-106) returns `VACANT` rows as they are, and the user leaderboard (API-007) does not return them (Q-06, confirmed 2026-10-05) |
| `VacantReason` | `EXCLUDED` / `WITHDRAWN` / `FORFEITED` | Abuse exclusion / withdrawal / forfeiture (ownership transfer, issue UID). Only when it occurs after aggregation starts |
| `Lang` | `KO` / `EN` / `VI` / `TC` / `RU` / `ID` | 6 SEO languages. Title, subtitle and OG are KO/EN only |

### 1.5 Period Notation Rules

- **Confirmed (2026-10-01)**: each stage runs from **start date 00:00:00 UTC to end date 23:59:59 UTC** and **includes the end date** (REQ-004, REQ-053).
- **Next stage start date = previous stage end date + 1 day**. Stage changes happen at 00:00:00 UTC on the start date. A one-day stage has start date = end date (`days=1`).
- Stage object in responses: `startDate`, `endDate` (last day of the stage, inclusive), `startAt` (= startDate 00:00:00Z), `endAt` (= endDate 23:59:59Z), `days` (= endDate − startDate + 1).
  - Example: participation `startDate=2026-10-08`, `endDate=2026-10-21` → `days=14`. Bingo Batches run up to 10-21 (UTC) are reflected in the gauge, and the stage changes to aggregation at 10-22 00:00:00 UTC.
- "Last day of participation" (basis for D-7/D-3 pushes) = participation `endDate`.
- Responses for ranking OFF boards **do not have** an `ANNOUNCEMENT` stage (the key itself is omitted).

---

## 2. Error Codes

### 2.1 Common

| HTTP | Error code | Description |
|------|-----------|------|
| 400 | `VALIDATION_ERROR` | Top-level code for input validation failures such as format errors and missing required values. The detailed reason is given in `details.fields[].code` (e.g., `AMOUNT_CELL_MIN`) |
| 400 | `INVALID_AMOUNT` | Amount is not a decimal string or has three or more decimal places |
| 400 | `CONFIRMATION_REQUIRED` | `confirmed: true` missing on an action that requires a confirmation popup |
| 401 | `UNAUTHORIZED` | Login required |
| 403 | `FORBIDDEN` | No admin permission (cannot access the MAX BOARD menu) |
| 403 | `FORBIDDEN_ROLE` | Change or CSV request by the CS role (view only) |
| 404 | `BOARD_NOT_FOUND` | Board not found. In user APIs, `SCHEDULED` (Scheduled), `ENDED` and `TERMINATED` boards also return 404 with this code |
| 404 | `NOT_FOUND` | Other resource not found |
| 409 | `CONCURRENT_REQUEST` | Conflicts with a request already being processed for the same target. Retry after reloading |
| 500 | `INTERNAL_ERROR` | Internal server error |
| 503 | `SERVICE_UNAVAILABLE` | Temporary failure of a dependent system (account / cashback DB) |

### 2.2 Admin Domain

> **Delivery**: of the codes below, `INVALID_EXCHANGE`, `MULTIPLE_EXCHANGES_NOT_ALLOWED`, `INVALID_SCHEDULE`, `INVALID_CELLS`, `AMOUNT_CELL_MIN`, `STREAK_DAYS_MIN`, `INVALID_REWARDS`, `RANK_TIERS_REQUIRED`, `RANK_TIERS_NOT_ALLOWED`, `RANK_TIER_NOT_FROM_ONE`, `RANK_TIER_GAP`, `RANK_TIER_OVERLAP`, `CONTENT_REQUIRED`, `REWARD_AMOUNT_MIN`, `STREAK_DAYS_EXCEED_PERIOD`, `INVALID_IMAGE_REF` and `INVALID_AMOUNT` in 2.1 are given in body validation of API-102 and 104 as **`details.fields[].code` of the top-level `VALIDATION_ERROR`** (HTTP 400). The rest are given as the top-level `error.code`.
> **Check order**: change APIs check in the order permission (403) → board exists (404) → ended state (`BOARD_CLOSED`, `ALREADY_TERMINATED`) → stage condition (`EXCLUSION_NOT_IN_AGGREGATION`, etc.) → `confirmed` and body validation → target validation, and return the first one that fails.

| HTTP | Error code | Condition | Basis |
|------|-----------|------|------|
| 400 | `INVALID_EXCHANGE` | Unsupported exchange code | REQ-001 |
| 400 | `MULTIPLE_EXCHANGES_NOT_ALLOWED` | Two or more exchanges specified, e.g., as an array (one board = one exchange) | REQ-001 |
| 400 | `INVALID_SCHEDULE` | Dates in reverse order, a stage shorter than 1 day (stage skipped), announcement end date missing with ranking ON, announcement value present with ranking OFF | REQ-004 |
| 400 | `INVALID_CELLS` | Number of cells ≠ 9, duplicate or missing `cellNo`, missing type, type and value mismatch (streak days on an amount cell, etc.) | REQ-005 |
| 400 | `AMOUNT_CELL_MIN` | Amount cell target amount < `0.01` | REQ-005 |
| 400 | `STREAK_DAYS_MIN` | Streak cell streak days N < 1 or not an integer | REQ-005 |
| 400 | `INVALID_REWARDS` | Any of the 7 reward amounts (rows 1~3, columns 1~3, Full Board) missing | REQ-006 |
| 400 | `RANK_TIERS_REQUIRED` | Ranking ON but no rank tiers | REQ-008 |
| 400 | `RANK_TIERS_NOT_ALLOWED` | Ranking OFF but rank tiers sent | REQ-008, REQ-082 (see User Requirements Definition) |
| 400 | `RANK_TIER_NOT_FROM_ONE` | The first tier's start rank is not 1 | REQ-008 |
| 400 | `RANK_TIER_GAP` | Rank gap between tiers | REQ-008 |
| 400 | `RANK_TIER_OVERLAP` | Overlapping tiers, or start rank > end rank within a tier | REQ-008 |
| 400 | `CONTENT_REQUIRED` | Title/subtitle (KO/EN) or banner image missing (on creation), or an attempt to empty a required item on edit | REQ-009 |
| 400 | `LOCKED_FIELD_NOT_EDITABLE` | A content edit request includes amount/condition fields (exchange, ranking ON/OFF, periods, cells, rewards, rank tiers) | REQ-011 |
| 409 | `BOARD_CLOSED` | Edit, exclusion, recovery or termination request for an `ENDED` or `TERMINATED` board | REQ-011, REQ-069 |
| 409 | `EXCLUSION_NOT_IN_AGGREGATION` | Abuse exclusion requested outside the aggregation stage | REQ-064 |
| 400 | `EXCLUSION_REASON_REQUIRED` | Exclusion reason missing or blank | REQ-064 |
| 409 | `PARTICIPANT_NOT_EXCLUDABLE` | Target participants include one whose status is not `PARTICIPATING` (including already excluded). The whole request is rejected | REQ-065 |
| 409 | `BATCH_NOT_RECOVERABLE` | The result for the recovery date is not `MISSING` (including `PENDING`), the date is outside the board's participation period, or it has already been recovered (`recoveryState=DONE`) | REQ-059 |
| 422 | `BATCH_SOURCE_NOT_FOUND` | No source data for that date in the TetherMax cashback DB (fill it in the cashback system first, then recover) | PRD Missed Batch Recovery |
| 409 | `BATCH_RECOVERY_IN_PROGRESS` | Recovery for the same date is already running | - |
| 409 | `ALREADY_TERMINATED` | Board already terminated | REQ-068 |
| 400 | `INVALID_IMAGE` | Not WebP or over 5MB | REQ-009 |
| 400 | `INVALID_IMAGE_REF` | An image ID in API-102 or 104 (`bannerImageId`, `ogImageKoId`, `ogImageEnId`) was not uploaded through API-116, or its upload `purpose` differs from the input field (e.g. an OG_KO image set as the banner) | REQ-009 |
| 404 | `RANKING_DISABLED` | Leaderboard (API-106) requested for a ranking OFF board | REQ-003, REQ-014 |
| 400 | `REWARD_AMOUNT_MIN` | Line/Full Board reward or rank tier per-person amount below 0.01 (including 0) | REQ-006, REQ-008 |
| 400 | `STREAK_DAYS_EXCEED_PERIOD` | Streak cell N is greater than the number of participation days | REQ-005 |

---

## 3. API Endpoint List

### 3.1 Admin APIs

| API-ID | Method | URL | Description | Permission | F-ID | REQ-ID |
|--------|--------|-----|------|------|------|--------|
| API-101 | GET | `/api/admin/maxboard/boards` | Board list (filters) | All | F-021 | REQ-012 |
| API-102 | POST | `/api/admin/maxboard/boards` | Board creation (finalized on registration) | MASTER/OPERATOR/PM | F-022 | REQ-001~010 |
| API-103 | GET | `/api/admin/maxboard/boards/{boardId}` | Board detail top summary and settings | All | F-024 | REQ-013 |
| API-104 | PATCH | `/api/admin/maxboard/boards/{boardId}/content` | Content and SEO edit | MASTER/OPERATOR/PM | F-023 | REQ-011 |
| API-105 | GET | `/api/admin/maxboard/boards/{boardId}/stats` | Status tab KPIs, per-line achievement, expected payout | All | F-024 | REQ-013, 018 |
| API-106 | GET | `/api/admin/maxboard/boards/{boardId}/leaderboard` | Admin leaderboard (full TUID, status) | All | F-024 | REQ-014, 019, 066 |
| API-107 | GET | `/api/admin/maxboard/boards/{boardId}/participants` | Participant list (search, status filter) | All | F-025 | REQ-015, 019 |
| API-108 | GET | `/api/admin/maxboard/boards/{boardId}/participants.csv` | Participant list CSV download | MASTER/OPERATOR/PM | F-025 | REQ-016, 021 |
| API-109 | GET | `/api/admin/maxboard/boards/{boardId}/participants/{participantId}` | Participant detail (summary, mini board, history) | All | F-026, F-020 | REQ-017, 019 |
| API-110 | GET | `/api/admin/maxboard/boards/{boardId}/batches` | Batch tab (Bingo Batch run results by date) | All | F-027 | REQ-058 |
| API-111 | POST | `/api/admin/maxboard/boards/{boardId}/batches/{batchDate}/recover` | Re-run (recover) the Bingo Batch for a missed date and recalculate | MASTER/OPERATOR/PM | F-019, F-027 | REQ-059~062 |
| API-112 | GET | `/api/admin/maxboard/boards/{boardId}/exclusions` | View abuse exclusion records | All | F-028 | REQ-064 |
| API-113 | POST | `/api/admin/maxboard/boards/{boardId}/exclusions` | Abuse exclusion (aggregation period, cannot be undone) | MASTER/OPERATOR/PM | F-028 | REQ-064~066 |
| API-114 | POST | `/api/admin/maxboard/boards/{boardId}/terminate` | Terminate (cannot be undone) | MASTER/OPERATOR/PM | F-029 | REQ-068~070, REQ-071 (see User Requirements Definition) |
| API-115 | GET | `/api/admin/maxboard/exchanges` | Exchange selection list for the creation screen | All | F-022 | REQ-001 |
| API-116 | POST | `/api/admin/maxboard/images` | Banner and OG image upload | MASTER/OPERATOR/PM | F-022, F-023 | REQ-009 |

> **There is no board deletion API and no API to edit amounts or conditions**. After registration, only API-104 (content) can change anything (REQ-010, REQ-011). There are also no APIs to cancel a termination or an exclusion (REQ-065, REQ-103).

---

## 4. API Details — Admin

> Admin responses show TUIDs and UIDs **in full, without masking** (REQ-019). All date-times are UTC.

### API-101. Board List

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards` |
| Description | Board list. Participating UIDs, completers and expected payout are aggregated in real time at query time |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| query | status | BoardStatus[] (comma-separated) | Optional | e.g., `PARTICIPATION,AGGREGATION`. May include `TERMINATED` |
| query | exchange | string | Optional | Exchange code |
| query | ranking | `ON` \| `OFF` | Optional | Ranking enabled or not |
| query | q | string | Optional | Partial match on board name (KO title) |
| query | page, size | integer | Optional | Pagination |

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

> `periodStartAt` = pre-open start, `periodEndAt` = payout period end (`endAt`). Default sort is `createdAt` descending. `titleKo` is the stored value as is (including `<br />`), and the screen replaces it with a space for display. `expectedPayoutTotal` uses the same basis as API-105 (after reward confirmation, the confirmed payout list). Disabling the [Create Board] button for CS is decided from the role in the existing back-office session, not from a response field.

**Error codes**: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`

---

### API-102. Board Creation

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards` |
| Description | Registers a board. **It is finalized immediately on registration, with no draft saving**, and amount/condition items (exchange, ranking ON/OFF, periods, cells, rewards, rank tiers) cannot be changed afterwards by any API (REQ-010). There is no preview API (REQ-101) |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| Field | Type | Required | Description / validation |
|------|------|------|-------------|
| confirmed | boolean | Required | Registration confirmation popup confirmed. `CONFIRMATION_REQUIRED` unless `true` |
| exchangeCode | string | Required | **One** exchange (API-115 code). `MULTIPLE_EXCHANGES_NOT_ALLOWED` if an array |
| rankingEnabled | boolean | Required | Cannot be changed after registration |
| schedule.previewStartDate | date | Required | Pre-open start date (UTC). Only the first stage's start date is entered directly |
| schedule.previewEndDate | date | Required | Last day of pre-open (inclusive). Participation start date = this date + 1 day |
| schedule.participationEndDate | date | Required | Last day of participation (inclusive). Aggregation start date = this date + 1 day |
| schedule.aggregationEndDate | date | Required | Last day of aggregation (inclusive). Announcement (ON) or payout period (OFF) starts the next day |
| schedule.announcementEndDate | date | Required for ON / not allowed for OFF | Last day of announcement (inclusive). Payout period start date = this date + 1 day |
| schedule.payoutEndDate | date | Required | Last day of the payout period (inclusive). The page becomes 404 at 00:00:00 UTC the next day |
| cells | array(9) | Required | One each for `cellNo` 1~9 |
| cells[].cellNo | integer | Required | 1~9 |
| cells[].type | CellType | Required | `AMOUNT` \| `STREAK`. No limit on the count or position of each type (all 9 cells can be `STREAK`) |
| cells[].targetAmount | decimal string | Required if `AMOUNT` | Minimum `"0.01"` |
| cells[].streakDays | integer | Required if `STREAK` | Minimum 1, **no more than the number of participation days** (`STREAK_DAYS_EXCEED_PERIOD`) |
| rewards.row1 ~ row3 | decimal string | Required | Bingo Rewards for rows 1~3 (each can be a different amount). Minimum `"0.01"`, 0 not allowed |
| rewards.col1 ~ col3 | decimal string | Required | Bingo Rewards for columns 1~3. Minimum `"0.01"`, 0 not allowed |
| rewards.fullBoard | decimal string | Required | Full Board Reward. Minimum `"0.01"`, 0 not allowed |
| rankTiers | array | Required for ON / not allowed for OFF | Rank tiers. After sorting, the first tier has `fromRank=1`, and `next fromRank = previous toRank + 1` (no gaps or overlaps) |
| rankTiers[].fromRank | integer | Required | ≥ 1 |
| rankTiers[].toRank | integer | Required | ≥ fromRank |
| rankTiers[].amountPerPerson | decimal string | Required | Amount per person. Minimum `"0.01"`, 0 not allowed |
| content.titleKo, content.titleEn | string | Required | Used as the Benefits title |
| content.subtitleKo, content.subtitleEn | string | Required | Used as the Benefits subtitle |
| content.bannerImageId | string | Required | ID from the API-116 upload result |
| content.ogImageKoId, content.ogImageEnId | string | Optional | Site default preview image if not entered |
| content.seo.{KO\|EN\|VI\|TC\|RU\|ID}.title | string | Optional | Site default meta if not entered |
| content.seo.{KO\|EN\|VI\|TC\|RU\|ID}.description | string | Optional | Site default meta if not entered |

**Period validation (`INVALID_SCHEDULE`)**: for each stage `end date ≥ start date` (one-day stages allowed, stages cannot be skipped), next stage start date = previous stage end date + 1 day (computed by the server), no dates in reverse order, no upper limit on the total period. **No restriction on past dates** (all stages can be registered in the past, confirmed 2026-10-01). Registering past dates is **for testing** and is not used in real operations, so no special handling is built for retroactive past batches, past notifications, past confirmation or payout. Overlapping periods of boards for the same exchange are **not checked** (operating principle, REQ-002).

**Amount and streak validation**: the 7 rewards and the rank tier per-person amounts are at least 0.01 (0 not allowed, `REWARD_AMOUNT_MIN`). Streak cell N is no more than the number of participation days (= participation end date − participation start date + 1) (`STREAK_DAYS_EXCEED_PERIOD`).

**Line breaks**: `content.titleKo/En` and `content.subtitleKo/En` may contain `<br />`, stored as is (REQ-106). No character limit.

**Image ID validation**: `bannerImageId` must be an ID uploaded through API-116 with `purpose=BANNER`, `ogImageKoId` with `OG_KO`, and `ogImageEnId` with `OG_EN` (otherwise `INVALID_IMAGE_REF`).

**User API field mapping**: admin field names (`perPersonCost`, `rewards.row1`~`col3` and `fullBoard`, `bannerImageId`, `ogImageKoId`, etc.) may differ from the user API-002 field names. The correspondence follows the field mapping table in API-002 of the user `API스펙_en.md`.

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

> `perPersonCost` = sum of the 6 lines + Full Board Reward. Display only; it does not limit amounts (REQ-007). `winnerCount` = last tier's `toRank`, `poolTotal` = Σ(tier headcount × per-person amount). Right after creation, `status` is set to the stage for the current UTC time (if before the pre-open start date, as in the example, `SCHEDULED` (Scheduled), confirmed 2026-10-05). `benefitNo` is the new benefit number issued by the backend (user detail URL `?benefitNo=`).

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | Confirmation popup not confirmed (top-level) |
| 400 | `VALIDATION_ERROR` | Format error or body validation failure (top-level). The per-item causes are given as the codes below in `details.fields[].code` |
| 400 | `fields[].code`: `INVALID_EXCHANGE` / `MULTIPLE_EXCHANGES_NOT_ALLOWED` | Exchange error |
| 400 | `fields[].code`: `INVALID_SCHEDULE` | Period error |
| 400 | `fields[].code`: `INVALID_CELLS` / `AMOUNT_CELL_MIN` / `STREAK_DAYS_MIN` | Cell error |
| 400 | `fields[].code`: `INVALID_REWARDS` / `INVALID_AMOUNT` | Reward amount missing or malformed |
| 400 | `fields[].code`: `RANK_TIERS_REQUIRED` / `RANK_TIERS_NOT_ALLOWED` | Ranking ON/OFF and tiers do not match |
| 400 | `fields[].code`: `RANK_TIER_NOT_FROM_ONE` / `RANK_TIER_GAP` / `RANK_TIER_OVERLAP` | Tiers do not run continuously from 1st place |
| 400 | `fields[].code`: `CONTENT_REQUIRED` | Title/subtitle (KO/EN) or banner missing |
| 400 | `fields[].code`: `REWARD_AMOUNT_MIN` | Reward or rank tier amount below 0.01 |
| 400 | `fields[].code`: `STREAK_DAYS_EXCEED_PERIOD` | Streak days N > number of participation days |
| 400 | `fields[].code`: `INVALID_IMAGE_REF` | Image ID not uploaded or uploaded for a different use |
| 403 | `FORBIDDEN_ROLE` | CS (top-level) |

---

### API-103. Board Detail (Top Summary and Settings)

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}` |
| Description | Returns the detail top summary and all registered settings. The edit page (showing locked sections) also uses this response. `ENDED` and `TERMINATED` can also be viewed |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**: path `boardId` (string, required)

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

> `actions` reflects the status and the requester's role. Always `false` for CS. Both `true` from `SCHEDULED` (Scheduled) through `PAYOUT` (Payout). For `ENDED` and `TERMINATED`, `canEditContent=false`, `canTerminate=false`. `cells` and `rankTiers` in the example show only part. For the correspondence with user API-002 field names, see the user API-002 field mapping table.

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-104. Content and SEO Edit

| Item | Details |
|------|------|
| Method | PATCH |
| URL | `/api/admin/maxboard/boards/{boardId}/content` |
| Description | Partially edits only the content (section ⑤). A separate API from creation. If even one amount/condition field is included, the whole request is rejected |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request Body** (only the fields sent are applied)

| Field | Type | Required | Description |
|------|------|------|------|
| titleKo, titleEn, subtitleKo, subtitleEn | string | Optional | Empty string or `null` not allowed (required items) |
| bannerImageId | string | Optional | `null` not allowed (required item) |
| ogImageKoId, ogImageEnId | string \| null | Optional | `null` deletes it → site default preview image |
| seo.{Lang}.title, seo.{Lang}.description | string \| null | Optional | `null` deletes it → site default meta |

If fields outside those allowed (`exchangeCode`, `rankingEnabled`, `schedule`, `cells`, `rewards`, `rankTiers`, etc.) are included, `LOCKED_FIELD_NOT_EDITABLE`.

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

> After an edit, the user API (API-001, API-002) cache is invalidated (1.1 Cache invalidation). Image ID validation is the same as API-102 (`INVALID_IMAGE_REF`). Check order: permission → board exists → `BOARD_CLOSED` → `LOCKED_FIELD_NOT_EDITABLE` → body validation (`VALIDATION_ERROR` + `fields[].code`).

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `LOCKED_FIELD_NOT_EDITABLE` | Includes amount/condition fields (top-level) |
| 400 | `VALIDATION_ERROR` | Format error, unsupported language key. Per-item `fields[].code`: `CONTENT_REQUIRED` (request to empty required content), `INVALID_IMAGE_REF` (image ID not uploaded or uploaded for a different use) |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board |
| 409 | `BOARD_CLOSED` | `ENDED` or `TERMINATED` board |

---

### API-105. Status Tab Metrics

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/stats` |
| Description | Aggregates KPIs, achievers per line (6 lines) and expected payout (Bingo, Full Board, ranking, total) in real time (REQ-013, REQ-018) |
| Permission | MASTER / OPERATOR / PM / CS |

**Aggregation basis**

| Metric | Definition |
|------|------|
| participantUidCount | Number of UIDs with a participation record created on this board (cumulative, including all statuses such as reset) |
| activeParticipantCount | Number of participants currently in status `PARTICIPATING` |
| completedCount | Number of users who completed the board (status `PARTICIPATING`) |
| streakCellActivatedCount | Number of participants with at least 1 activated streak cell (status `PARTICIPATING`) |
| lineAchievements | Achievers per line (status `PARTICIPATING`) |
| expectedPayout | Based on participants in status `PARTICIPATING`. Bingo = Σ(completed lines × per-line amount), Full Board = completers × Full Board Reward, ranking = sum of tier amounts by current rank (0 for vacant places). `RESET`, `EXCLUDED`, `WITHDRAWN` and `FORFEITED` are excluded since they are not paid (achievements of reset rows have disappeared). **After reward confirmation (JOB-05)** (announcement for ranking ON, payout period for ranking OFF), it is calculated from the confirmed payout list |
| expectedPayout.basis | `ESTIMATED` (before confirmation, based on achievements) / `CONFIRMED` (based on the confirmed payout list) |

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

> For ranking OFF boards, the `expectedPayout.ranking` key is omitted.

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-106. Admin Leaderboard

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/leaderboard` |
| Description | Returns the full ranking of users who completed the board, with full TUIDs. Updated at each daily Bingo Batch, and the result recalculated once right after the aggregation stage starts (reflecting all completers during participation, including those who completed after the last day's Bingo Batch, JOB-03, confirmed 2026-10-02) is returned as is afterwards. Full Board users withdrawn or reset during the participation period are removed from the ranking in the next Bingo Batch recalculation (not left vacant, confirmed 2026-10-12). Places of users excluded for abuse, withdrawn or forfeited after aggregation starts are not deleted but shown **immediately** as `VACANT` (Excluded · Vacant), with an expected Ranking Reward of 0, while `rank` and `totalCashback` stay fixed at the recalculated result (lower ranks are not moved up, confirmed 2026-10-12). Note: the user leaderboard (API-007) stays fixed at the recalculated result during aggregation, and vacant places are applied at announcement. The leaderboard has no exclusion function (exclusion is API-113) |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | |
| query | page, size | integer | Optional | Pagination. Default `page=1`, `size=50` (max 100) |

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

> `vacantReason` (`VacantReason`): `EXCLUDED` (abuse exclusion) / `WITHDRAWN` (withdrawal after aggregation starts) / `FORFEITED` (ownership transfer or issue UID designation after aggregation starts, confirmed 2026-10-12). `resetReason` is `OWNERSHIP_TRANSFER` / `ISSUE_UID` when `vacantReason=FORFEITED`, otherwise `null` (omitted in the other rows of the example). `RESET` occurs only during the participation period, so it does not appear in `vacantReason`. Clicking a row goes to API-109 with `participantId`.
> `finalized`: `true` after reward confirmation (start of announcement for ranking ON, JOB-05). When `true`, the ranks and `VACANT` rows match the confirmed payout list and no longer change.

**Error codes**: `400 VALIDATION_ERROR` (size exceeded), `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`, `404 RANKING_DISABLED`

---

### API-107. Participant List

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants` |
| Description | List of participants (participation records). A user who selected a new UID after being reset by an ownership transfer or issue UID designation during the participation period appears as separate rows for the previous record (`RESET`) and the new record. There is no payout status column (REQ-102). Disabling [Download CSV] and [Exclude Selected (Abuse)] for CS is decided from the role in the existing back-office session, and whether a row can be selected follows `excludable` |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| query | q | string | Optional | TUID or UID (exact or partial match) |
| query | status | ParticipantStatus[] (comma-separated) | Optional | Status filter |
| query | resetReason | ResetReason | Optional | Reason filter: `OWNERSHIP_TRANSFER` / `ISSUE_UID`. Returns only `RESET` and `FORFEITED` rows with the same reason (e.g. `status=RESET&resetReason=ISSUE_UID` = "Reset (Issue UID)"). Any other value returns `VALIDATION_ERROR` |
| query | sort | string | Optional | `registeredAt` (default, descending) / `rank` / `totalCashback` |
| query | page, size | integer | Optional | Pagination |

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

> `resetReason`: when the status is `RESET` or `FORFEITED`, `OWNERSHIP_TRANSFER` (ownership transfer) / `ISSUE_UID` (issue UID designation); otherwise `null` (`UNLINKED` removed, confirmed 2026-10-12). Screen display: "Reset (Ownership Transfer)" / "Reset (Issue UID)" / "Forfeited (Ownership Transfer)" / "Forfeited (Issue UID)". Status judgment: if the participating UID is lost during the participation period, `RESET`; from aggregation start until before payout, `FORFEITED`; after payment (crediting), no status change (only the API-109 history entry `UID_LOST_AFTER_PAYOUT`). The judgment time is the time in the TetherMax account DB history.
> `cumulativeGauge` = total cashback during participation (= total cashback used for ranking), `availableGauge` = cumulative − amount used on amount cells. `rank` is only for ranking ON + completers, otherwise `null`. `expectedReward` = completed line and Full Board Rewards + Ranking Reward by current rank (`"0.00"` for statuses other than `PARTICIPATING`). `excludable` = aggregation stage + status `PARTICIPATING` + the requester has change permission.

**Error codes**: `400 VALIDATION_ERROR`, `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-108. Participant List CSV

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants.csv` |
| Description | Returns all rows as CSV with the same filters as API-107 (`q`, `status`, `sort`) (no pagination) |
| Permission | MASTER / OPERATOR / PM. **403 for CS** (REQ-016, REQ-021) |

**Response (200 OK)**

- `Content-Type: text/csv; charset=utf-8` (includes a UTF-8 BOM for Excel compatibility)
- `Content-Disposition: attachment; filename="maxboard_mb_20261001_bitget01_participants_20261015_0600.csv"`
- Times in UTC, amounts with two decimal places, TUID and UID shown in full. `reset_reason` has the same values as API-107 `resetReason` (`OWNERSHIP_TRANSFER` / `ISSUE_UID` / empty)

```
participant_id,tuid,uid,registered_at_utc,cumulative_gauge,available_gauge,checked_cells,completed_lines,board_completed_at_utc,current_streak,max_streak,rank,expected_reward_usdt,status,reset_reason
mbp_7f3a91c2,T388120456,48377210,2026-10-15T03:20:11Z,39.50,7.50,9,6,2026-10-20T11:02:33Z,6,7,12,60.50,PARTICIPATING,
```

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN_ROLE` (CS), `404 BOARD_NOT_FOUND`

---

### API-109. Participant Detail

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/participants/{participantId}` |
| Description | Returns one participant's summary, 3×3 mini board and history (UTC). History is never deleted (REQ-061, REQ-074) |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId, participantId | string | Required | |
| query | historyPage, historySize | integer | Optional | History pagination (default 1, 50) |

**History types (`history[].type`)**: `UID_REGISTERED` (retroactive gauge applied) / `BATCH_APPLIED` / `CELL_CHECKED` / `LINE_COMPLETED` (reward amount) / `BOARD_COMPLETED` / `STREAK_CELL_ACTIVATED` / `RESET` (participating UID lost during the participation period, `detail.reason`: `OWNERSHIP_TRANSFER` / `ISSUE_UID`) / `FORFEITED` (participating UID lost from aggregation start until before payout, same `detail.reason`) / `UID_LOST_AFTER_PAYOUT` (participating UID lost after payment (crediting), same `detail.reason`, no change to status or paid amounts, confirmed 2026-10-12) / `RECALCULATED` (recalculation by batch recovery during participation; recovered batch date, values before and after) / `SOURCE_CORRECTED` (batch recovery after the participation period, only the source record corrected, not applied automatically; recovered batch date and corrected cashback) / `EXCLUDED` (handler, reason) / `WITHDRAWN`. Screen labels follow the label table in Functional Specification (Front-end) F-026.

> The `at` of `RESET`, `FORFEITED` and `UID_LOST_AFTER_PAYOUT` is the time in the TetherMax account DB history (time the ownership transfer was approved or the issue UID was designated). The `summary` also returns `resetReason` when the status is `RESET` or `FORFEITED`, and `exclusion` (`excludedAt`, `excludedBy`, `reason`) when it is `EXCLUDED`.

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

> Mini board `state`: `CHECKED` / `OPEN` (streak cell activated but not checked) / `UNCHECKED`. The example `board` shows only part (actually 9 cells).

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`, `404 NOT_FOUND` (no such participant, or a participant of another board)

---

### API-110. Batch Status

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/batches` |
| Description | Shows this board's **Bingo Batch** run results by date in the participation period (one board = one exchange). Not the results of the cashback batch (existing system) itself |
| Permission | MASTER / OPERATOR / PM / CS |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| query | result | BatchResult | Optional | `PENDING` / `NORMAL` / `DELAYED` / `MISSING` |

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

> `batchDate` = the UTC date on which the Bingo Batch should run (batch date), `scheduledAt` = that day's Bingo Batch scheduled time (a setting; 12:30 UTC in the example is an illustrative value, #BATCH), `executedAt` = actual completion time (stays `null` for rows filled by recovery; the recovery time is `recoveredAt`). `result` follows JOB-08: before judgment or running `PENDING`, not completed by scheduled time + 3 hours `DELAYED` (stays `DELAYED` even if it completes later), not completed by 00:00 UTC the next day `MISSING`. **A run not finished by 00:00 UTC the next day is stopped and confirmed as `MISSING`**, and late results are not applied (only [Recover], confirmed 2026-10-12). Rows are returned only up to participation-period dates whose scheduled time has passed.
> Recovery: `recoveryState` = `RUNNING` (recovery running) / `DONE` (done) / `FAILED` (failed, including when stopped by termination) / `null` (no recovery requested). `recovered` (= `recoveryState=DONE`), `recoveredAt` (time the recovery was done or failed), `recoveredBy` (who ran the recovery). `result` stays `MISSING` even after recovery. `reflectedUidCount` and `reflectedCashback` are based on the UIDs accumulated for this board's gauge (for recovered rows, the recovered values).
> `recoverable` = result `MISSING` + `recoveryState` is `null` or `FAILED` + the requester has change permission + the board is not `ENDED` or `TERMINATED`. `false` for recovered (`DONE`) and running (`RUNNING`) rows.

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-111. Missed Batch Recovery

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/batches/{batchDate}/recover` |
| Description | **Re-runs that day's Bingo Batch**. Re-reads the `batchDate` data from the TetherMax cashback DB, applies it **as the batch record of the missed date**, and recalculates gauges, streak records, streak cell activation and rankings (REQ-059~061). Cell checks are made by users, so checked cells, lines and Full Boards do not change. Runs as an asynchronous job and returns the job ID; progress is checked with API-110 `recoveryState` |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | batchDate | date | Required | Batch date on which the Bingo Batch was missed |
| body | confirmed | boolean | Required | Confirmation popup. The text depends on the stage at the time of the request. Participation period: "This re-runs the 2026-10-13 Bingo Batch. The 2026-10-13 data is read again from the TetherMax cashback DB and applied, and gauges, streak records, streak cell activation and rankings are recalculated. Cells, lines and Full Boards checked by users do not change." [EN draft] / After the participation period: "Only the source record of the 2026-10-13 Bingo Batch is corrected. Participation-period data recovered after the participation period ends is not applied automatically and is handled individually through CS (no recalculation of gauges, streak records, cells or rankings)." [EN draft] |

```json
{ "confirmed": true }
```

> No recovery reason is accepted (changed 2026-10-02). If other fields such as `reason` are in the body, `VALIDATION_ERROR`.

**Processing rules**

| Timing | Behavior |
|------|------|
| Stage at request time = `PARTICIPATION` (`applied: true`) | Re-run that day's Bingo Batch: apply as the missed date's batch → gauge accumulation (same target rules as JOB-01) → streak record recalculation (a streak broken by the miss continues) → streak cell activation → ranking recalculation. **Gauge already filled is not taken back; activated streak cells and checked cells stay; checked cells, lines and Full Boards do not change** (REQ-060). History `RECALCULATED` for affected participants |
| Stage at request time = `AGGREGATION` or later (`applied: false`, recovery after participation ends; confirmed as runnable) | The batch source data is saved as the missed date's record, but **gauge, streak records, cells and ranking are not applied automatically**. Participation-period data recovered after the participation period ends is handled individually by CS using the existing manual Event Reward payout feature (REQ-062). History `SOURCE_CORRECTED` for affected participants |
| Common | `applied` is decided by the **stage at the time of the request** and does not change even if the stage changes during the job. Target UIDs, recovered batch date, values before and after, actor and time are recorded in history (REQ-061). Check order: permission → board exists → `BOARD_CLOSED` → `CONFIRMATION_REQUIRED` → `BATCH_NOT_RECOVERABLE` → `BATCH_RECOVERY_IN_PROGRESS` → `BATCH_SOURCE_NOT_FOUND`. If the board is terminated (API-114) during the job, the recovery stops with `recoveryState=FAILED` |

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

> After the job completes, the row in API-110 changes to `recoveryState: DONE`, `recovered: true`, `recoverable: false` (`result` stays `MISSING`), and `RECALCULATED` (`applied: true`) or `SOURCE_CORRECTED` (`applied: false`) is left in the API-109 history of affected participants. The response `state` is a `RecoveryState` value.

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | Not confirmed |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board |
| 409 | `BATCH_NOT_RECOVERABLE` | Result is not `MISSING`, the date is outside the participation period, or it has already been recovered |
| 409 | `BATCH_RECOVERY_IN_PROGRESS` | Recovery for the same date is running |
| 409 | `BOARD_CLOSED` | `ENDED`, `TERMINATED` |
| 422 | `BATCH_SOURCE_NOT_FOUND` | No source data → fill it in the cashback system first, then retry |

---

### API-112. View Abuse Exclusion Records

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/boards/{boardId}/exclusions` |
| Description | Returns this board's exclusion list (handler, time, reason) |
| Permission | MASTER / OPERATOR / PM / CS |

**Response (200 OK)**

```json
{
  "status": "success",
  "data": [
    { "exclusionId": "mbx_0001", "participantId": "mbp_9e8d7c6b", "tuid": "T203948576", "uid": "48100957", "reason": "Signs of wash trading across multiple accounts on the same device/IP", "excludedAt": "2026-10-23T04:12:00Z", "excludedBy": "op.lee@tethermax.io" }
  ],
  "meta": { "requestId": "req_01J9ZK3Q8W2M", "pagination": { "page": 1, "size": 20, "totalCount": 1, "totalPages": 1 } }
}
```

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`, `404 BOARD_NOT_FOUND`

---

### API-113. Abuse Exclusion

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/exclusions` |
| Description | **Fully excludes** the selected participants from this board's reward payout (Bingo, Full Board, ranking). Possible **only in the aggregation stage** and **cannot be undone** (no cancellation API). The ranking place is left vacant and lower ranks are not moved up |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| Field | Type | Required | Description |
|------|------|------|------|
| participantIds | string[] | Required | 1 or more. All must be `PARTICIPATING` participants of this board (if even one is not, the whole request is rejected) |
| reason | string | Required | Cannot be blank. The same reason is recorded for all selected participants |
| confirmed | boolean | Required | "This cannot be undone" (KO "취소할 수 없습니다") confirmation |

```json
{ "participantIds": ["mbp_9e8d7c6b"], "reason": "Signs of wash trading across multiple accounts on the same device/IP", "confirmed": true }
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

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `EXCLUSION_REASON_REQUIRED` | Reason missing or blank |
| 400 | `CONFIRMATION_REQUIRED` | Not confirmed |
| 400 | `VALIDATION_ERROR` | `participantIds` is empty |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board |
| 409 | `EXCLUSION_NOT_IN_AGGREGATION` | Not the aggregation stage |
| 409 | `PARTICIPANT_NOT_EXCLUDABLE` | Includes participants already excluded or not `PARTICIPATING`, or participants of another board. Their IDs are in `details.participantIds` |
| 409 | `BOARD_CLOSED` | `ENDED`, `TERMINATED` |

> Check order: permission (403) → board exists (404) → `BOARD_CLOSED` → `EXCLUSION_NOT_IN_AGGREGATION` → `CONFIRMATION_REQUIRED`, `EXCLUSION_REASON_REQUIRED`, `VALIDATION_ERROR` → `PARTICIPANT_NOT_EXCLUDABLE`. An exclusion is applied immediately to the admin leaderboard (API-106) as `VACANT` (rank and total cashback fixed); the user leaderboard is fixed during aggregation, so it is applied at announcement.

---

### API-114. Terminate

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/boards/{boardId}/terminate` |
| Description | Changes the board to `TERMINATED` immediately, **at any stage**. Stops gauge accumulation, cell checks, ranking updates, stage changes, reward confirmation and scheduled payouts; cancels scheduled app pushes and emails; makes the user page 404 immediately and removes it from Benefits. **No reason input, no notification, cannot be undone** |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request Body**

| Field | Type | Required | Description |
|------|------|------|------|
| confirmed | boolean | Required | Confirmation popup (unified text): "All processing in progress stops and the user page immediately becomes 404. If the payout period has not started, no rewards are paid, and rewards already paid are not taken back. Termination cannot be undone." |

> No reason field is accepted. If other fields such as `reason` are in the body, `VALIDATION_ERROR`.
> Stages where termination is allowed: `SCHEDULED`, `PREVIEW`, `PARTICIPATION`, `AGGREGATION`, `ANNOUNCEMENT`, `PAYOUT` (excluding `ENDED` and `TERMINATED`). Check order: permission (403) → board exists (404) → `ALREADY_TERMINATED`, `BOARD_CLOSED` → `CONFIRMATION_REQUIRED`. Batch recovery in progress (API-111) is stopped and left as `recoveryState=FAILED`. The user API-001, 002 and 007 caches are invalidated.

**Payout impact**

| Termination timing | Rewards |
|-----------|--------|
| Before the payout period starts (Scheduled through announcement) | Not paid |
| During the payout period | Rewards already paid are not clawed back. Unprocessed payouts are stopped |

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

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `CONFIRMATION_REQUIRED` | Not confirmed |
| 403 | `FORBIDDEN_ROLE` | CS |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board |
| 409 | `ALREADY_TERMINATED` | Already terminated |
| 409 | `BOARD_CLOSED` | Ended normally through the payout period (`ENDED`) |

---

### API-115. Exchange List

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/admin/maxboard/exchanges` |
| Description | Target exchange selection list on the board creation screen (single selection) |
| Permission | MASTER / OPERATOR / PM / CS |

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

**Error codes**: `401 UNAUTHORIZED`, `403 FORBIDDEN`

---

### API-116. Image Upload

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/admin/maxboard/images` |
| Description | Uploads a banner or OG image and returns `imageId`. Creation (API-102) and edit (API-104) reference this ID |
| Permission | MASTER / OPERATOR / PM (CS 403) |

**Request** (`multipart/form-data`)

| Field | Type | Required | Description |
|------|------|------|------|
| file | binary | Required | Image file. **WebP only, up to 5MB** (`INVALID_IMAGE` on violation). Recommended size after the design is finalized |
| purpose | string | Required | `BANNER` / `OG_KO` / `OG_EN` |

**Response (201 Created)**

```json
{
  "status": "success",
  "data": { "imageId": "img_b81c03aa", "purpose": "BANNER", "url": "https://cdn.tethermax.io/maxboard/banner/img_b81c03aa.webp", "width": 1200, "height": 630 },
  "meta": { "requestId": "req_01J9ZK3Q8W2M" }
}
```

**Error codes**: `400 INVALID_IMAGE`, `400 VALIDATION_ERROR`, `403 FORBIDDEN_ROLE`

---

## 5. Internal Jobs (Scheduler / Events)

> The jobs below are internal processing **not exposed externally**. Even if an HTTP endpoint is provided, it is called only with internal authentication (service token) and is not included in the user or admin API lists. The execution location (batch worker, cron, whether to split at M5) is confirmed in Infrastructure Architecture (#10). All jobs are designed to be **idempotent** (re-running with the same input gives the same result), and `TERMINATED` boards are excluded from processing.

| JOB-ID | Job | Trigger | Main processing | F-ID / REQ-ID |
|--------|------|--------|-----------|---------------|
| JOB-01 | Bingo Batch: load cashback, accumulate gauge | Scheduled once a day at the **Bingo Batch scheduled time** (fixed time common to all exchanges, a setting, after the Bitget cashback batch. Exact time undecided #BATCH) | See 5.0, 5.1 below | F-012 / REQ-034~037, 114 |
| JOB-02 | Bingo Batch: streak judgment, streak cell activation | Right after JOB-01 within the same Bingo Batch | See 5.2 below | F-013 / REQ-040, 042, 043 |
| JOB-03 | Bingo Batch: ranking calculation | Right after JOB-02 within the same Bingo Batch (ranking ON boards only). Also recalculated once right after JOB-04 changes the stage to aggregation (confirmed 2026-10-02) | See 5.3 below | F-014 / REQ-049~051, 066 |
| JOB-04 | Period stage change | Every day at **00:00 UTC** | See 5.4 below | F-015 / REQ-053, 057 |
| JOB-05 | Reward confirmation | JOB-04: announcement start for ranking ON, aggregation end (= payout period start) for OFF | See 5.5 below | F-017 / REQ-056, 065~067 |
| JOB-06 | Automatic reward crediting | JOB-04: right after the payout period starts | See 5.6 below | F-018 / REQ-070, 072, 073 |
| JOB-07 | Account status check (ownership transfer, issue UID designation, withdrawal) | Checked directly by MAX BOARD: on user requests, in the daily Bingo Batch (continuing after the participation period until payout is complete), and right before JOB-05 and JOB-06 (confirmed 2026-10-12) | See 5.7 below | F-005, F-016 / REQ-024, 030~032, 066, 067, 110, 114, 115 |
| JOB-08 | Bingo Batch delay/miss detection | Monitors completion of the Bingo Batch (JOB-01~03) (one run common to all boards) | The subject is the **Bingo Batch** (not the cashback batch). Result (`BatchResult`, confirmed 2026-10-12): before judgment or running `PENDING`; completed within the scheduled time (setting) + 3 hours `NORMAL`; not completed by + 3 hours `DELAYED` (if it completes later, it stays `DELAYED` and is applied); not completed by 00:00 UTC of the next day → **the run is stopped** and `MISSING` is confirmed (late results not applied, filled only through recovery API-111; after recovery `recovered=true`, `recoverable=false`). Recorded per board. `batchDelayed` (API-002, 005) is `true` in the participation stage while a delay is in progress or there is an unrecovered `MISSING`. Slack alert on entering delay, confirming a miss, or a run error (JOB-09) | F-019, F-031 / REQ-060~063, 089 |
| JOB-09 | Operations Slack alert | Aggregation stage start (once per board), JOB-08 detection | Aggregation start message (board name, exchange, content). Bingo Batch anomaly message (confirmed 2026-10-12): one unit = one Bingo Batch run (common to all boards); once on entering delay, once when a miss is confirmed, and immediately on a run error (batch date, scheduled and run times, anomaly type, list of affected boards). No alert for terminated boards | F-031 / REQ-088, 089 |
| JOB-10 | Automatic app push sending | Sending schedule | See 5.8 below | F-032 / REQ-090~094 |
| JOB-11 | Automatic result email sending | Sending schedule | See 5.8 below | F-033 / REQ-095~097 |

### 5.0 Bingo Batch and Cashback Batch (introduced 2026-10-02)

| Type | Cashback batch (existing system) | Bingo Batch (new for MAX BOARD) |
|------|---------------------------|----------------------------|
| Role | Accumulates per-exchange commission-based cashback in the TetherMax cashback DB. **The source of the Bingo Batch**; MAX BOARD does not use it directly | Reads cashback batch results from the cashback DB and applies them to boards. One run **updates together** JOB-01 (gauge), JOB-02 (streak, streak cell activation) and JOB-03 (ranking) |
| Execution | Every day between 11:00 and 12:00 UTC, one exchange at a time (Bitget 12:00 UTC) | **Once a day at a fixed time common to all exchanges**. The time is a setting (after the latest cashback batch); exact time undecided (#BATCH) |
| Date basis | **Cashback batch date** (the UTC date on which the cashback batch ran) = streak judgment date | **Bingo Batch run time** = basis for judging gauge application (whether it ran within the participation period) |
| Delay/miss judgment | Not judged | Judged by JOB-08; the unit of the admin ③ Batch tab (API-110) and recovery (API-111) |

- **Range loaded**: a day's Bingo Batch loads the cashback batch results completed that day, plus cashback batch results that finished late after the previous day's Bingo Batch and could not be loaded the previous day. Data for a day on which the Bingo Batch itself was missed is not filled in automatically by the next day's Bingo Batch; it is applied only through [Recover] (API-111) in the admin ③ Batch tab (confirmed 2026-10-02).
- **Late cashback batch**: if a cashback batch finishes after that day's Bingo Batch has run, the next day's Bingo Batch loads it and **records it under the original cashback batch date** (the streak is not broken). However, **if the last day of participation's portion slips to the next day this way, it is not applied** (the Bingo Batch runs after the participation period; handled by CS).

### 5.1 JOB-01 Bingo Batch: Load Cashback, Accumulate Gauge

| Item | Details |
|------|------|
| Applied scope | Only cashback loaded by a Bingo Batch whose **Bingo Batch run time** is within the board's participation period `[startAt, endAt]` is applied (including the last day's run). Bingo Batches run after the participation period are not applied, and **the portion from a last-day Bingo Batch that was delayed and ran after 00:00:00 UTC of the next day, or from a last-day cashback batch that finished after that day's Bingo Batch and slipped to the next day, is not applied either** (handled by CS) |
| Source | Cashback batch results in the TetherMax cashback DB (trading cashback per UID, cashback batch date). Follows the range loaded in 5.0 |
| UIDs accumulated | **All UIDs** of the board's exchange whose **first registration date in the TetherMax DB (UTC) ≥ participation start date − 30 days**. Regardless of linking or participation registration, **including non-member UIDs and UIDs already participating**. The "no participation record on this board" condition is used **only at participation registration (API-004)**, not for deciding what to accumulate. **No gauge or streak is recorded while a UID is designated as an issue UID** (that day's cashback is not accumulated, and the streak is judged as broken and restarts from 0. Recording resumes after the designation is lifted; the designated period is not applied retroactively, confirmed 2026-10-02) |
| Accumulation source | Trading cashback only (Event Rewards, etc. excluded) |
| Processing | Per UID, cumulative gauge += cashback, available gauge += cashback. Each cashback is recorded under its original **cashback batch date**, and days with 0.01 or more applied are recorded as days for streak judgment. No gauge deduction or clawback |
| Records | Per-board Bingo Batch run history (batch date, scheduled time, run time, result, number of UIDs applied, cashback applied), per-participant `BATCH_APPLIED` history (cashback batch date, amount) |
| Completion deadline | Before the next Bingo Batch (NFR-002) |

### 5.2 JOB-02 Streak Judgment, Streak Cell Activation

- The streak basis date is the **cashback batch date** (not the Bingo Batch run date). Judgment is made when the Bingo Batch runs.
- If there is 0.01 or more cashback on a cashback batch date, current streak +1; otherwise reset to 0. A day designated as an issue UID is treated as a day without cashback and reset to 0 (confirmed 2026-10-02). Longest streak updated. Target UIDs are the same as JOB-01 (retroactive).
- If that day's cashback batch for the exchange has not finished when the Bingo Batch runs, that date is not treated as a break, and its judgment is passed to the next Bingo Batch (late cashback is recorded under its original date, so the streak continues, confirmed 2026-10-02). For this, **the cashback system provides per-exchange, per-date cashback batch completion status (confirmed 2026-10-02)**. The Bingo Batch loads and judges only cashback for dates in completed status.
- **All** streak cells with current streak ≥ N are activated, and the activation history (time) is saved. Once activated, a cell is never deactivated, even if the streak breaks later or a recalculation occurs.

### 5.3 JOB-03 Ranking Calculation (Ranking ON Only)

- Target: users who completed the board. Basis: total cashback during participation (cumulative gauge) in descending order; ties go to **the one whose Full Board record was saved (inserted) in the DB first** (judged by the save sequence of the completion record, always resolving to a single rank).
- Completers withdrawn (`WITHDRAWN`) or reset (`RESET`) during the participation period do not leave a vacant place; they are removed from the ranking at the next Bingo Batch calculation (confirmed 2026-10-12). Completers abuse-excluded (`EXCLUDED`), withdrawn (`WITHDRAWN`) or forfeited (`FORFEITED`, ownership transfer or issue UID designation) **after aggregation starts** keep their rank place and are marked `VACANT`, with an expected Ranking Reward of 0. Lower ranks are not moved up. The admin leaderboard (API-106) shows this status immediately while ranks and total cashback stay fixed; the user leaderboard (API-007) keeps the recalculated result during the aggregation stage and applies it at announcement (JOB-05) (confirmed 2026-10-12).
- Expected Ranking Rewards are calculated from the rank tier table, and `lastUpdatedAt` is updated. The next scheduled update time is not exposed in the user API or screens (the Bingo Batch scheduled time is managed only as an internal setting, confirmed 2026-10-02). When the last day's Bingo Batch of participation is applied, the user API's `dailyUpdateNotice` is changed to `false`. The ranking reward pool has no carryover with the Bingo and Full Board Rewards.
- **Recalculation at aggregation start (confirmed 2026-10-02)**: even after the last day's Bingo Batch, cell checks and participating UID registration are possible until participation ends (23:59:59 UTC) (including linking and registering a former non-member UID on the last day and completing with the retroactive gauge). So right after JOB-04 changes the stage to `AGGREGATION`, JOB-03 runs once more to include everyone who completed during participation. No new cashback is loaded (JOB-01/02 not run); only the completer list is updated, with the same total cashback basis, tie rule and `VACANT` handling. `lastUpdatedAt` is updated after the run and not updated afterwards. The result is used as is for the admin leaderboard (API-106) and the user aggregation-stage leaderboard (API-007).
- Users who completed after the last day's Bingo Batch of participation was applied are shown `RANK_FINAL_AT_ANNOUNCEMENT` until participation ends, and receive a rank in the recalculation at aggregation start (confirmed 2026-10-02).

### 5.4 JOB-04 Period Stage Change (00:00 UTC)

| Change | Follow-up processing |
|------|-----------|
| → `PREVIEW` | Changes from `SCHEDULED` at 00:00 UTC on the pre-open start date. Listing in Benefits starts, detail viewable, opening notice push (JOB-10, 02:10) (confirmed 2026-10-05) |
| → `PARTICIPATION` | Gauge accumulation starts (included in the Bingo Batch targets) |
| → `AGGREGATION` | Participation and cell checks blocked, (ranking ON) ranking recalculated (JOB-03 once, reflecting all completers during participation, confirmed 2026-10-02), Slack alert (JOB-09), abuse exclusion allowed from now |
| → `ANNOUNCEMENT` (ON) | Reward confirmation (JOB-05), leaderboard `finalized=true` |
| → `PAYOUT` | (OFF) Reward confirmation (JOB-05) then automatic crediting (JOB-06) / (ON) automatic crediting (JOB-06); the final winners leaderboard stays visible with the confirmed result until the end (404) |
| → `ENDED` | User page 404, removed from Benefits. Winner history kept (deletion prohibited) |

### 5.5 JOB-05 Reward Confirmation

- Only participants with status `PARTICIPATING`. `EXCLUDED`, `WITHDRAWN`, `FORFEITED` and `RESET` are excluded.
- Ranking ON: at announcement start, the final ranking is confirmed based on the ranking recalculated at aggregation start (JOB-03, reflecting all completers during participation) (confirmed 2026-10-02). The account status is checked again right before (JOB-07). The aggregation ranking differs from the final ranking **only by places vacated** after aggregation starts through abuse exclusion, withdrawal or forfeiture; those places are left vacant as `VACANT` and lower ranks are not moved up (confirmed 2026-10-02).
- Bingo Rewards (amount per completed line) + Full Board Reward + Ranking Reward (tier amount; not paid for vacant places) are saved as the confirmed payout list. No changes after confirmation.

### 5.6 JOB-06 Automatic Reward Crediting

- Right after the payout period starts, Event Rewards (USDT) are credited to the amount payable to **the participating UID at the time of payout**. Bingo, Full Board and Ranking Rewards are all credited together right after the payout period starts (confirmed 2026-10-12). Rewards are paid only once, at the start of the payout period, based on the final state.
- The account status is rechecked right before payout (JOB-07): if the participating UID was cut off by ownership transfer or issue UID designation, `FORFEITED` (forfeited, not paid); if withdrawn, not paid. Ownership transfer or issue UID designation after crediting is done does not claw back rewards already credited; participation status and paid amounts are not changed and only the history is recorded (confirmed 2026-10-02, updated 2026-10-12).
- Payout is processed by the MAX BOARD **Event Reward payout batch (new)** using TetherMax's Event Reward payout feature. An idempotency key per payout item prevents duplicate payouts. Payout failure handling is the backend's responsibility (no admin screen or API). Winner history is kept permanently.
- If the board is terminated during the payout period, **payouts not yet processed (including those being retried after a failure) are stopped**. Payouts already made are not clawed back.

### 5.7 JOB-07 Account Event Handling

| Event | Processing |
|--------|------|
| Participating UID ownership transfer or issue UID designation (common rule, confirmed 2026-10-12) | Users cannot unlink a UID themselves, so there are two causes of losing the participating UID: ownership transfer (someone else takes it through ownership verification) and issue UID designation. The status is decided by the time in the account DB history. **Within the participation period**: participation status `RESET` (reason `OWNERSHIP_TRANSFER` / `ISSUE_UID`); cells, lines, Full Board, ranking and achieved rewards are detached from this TUID's progress (like a first-time visitor); `RESET` history recorded. API-003 returns `RESELECT_REQUIRED` and a new UID can be selected. A completer is removed from the ranking at the next Bingo Batch calculation. Even if the history time is within the participation period, if it is detected after the recalculation at aggregation start, it is handled as forfeited below (ranks are not moved up again). **After aggregation starts and before payment (crediting)**: participation status `FORFEITED` (same reasons), no reselection → no rewards; a completer's ranking place is left vacant (`VACANT`). **After payment (crediting)**: no clawback; only the history (`UID_LOST_AFTER_PAYOUT`) is recorded without changing participation status or paid amounts; API-003 returns `RESELECT_REQUIRED`. The lost UID cannot rejoin the same board (even if it comes back to the original TUID or the issue UID designation is lifted); progress is not restored |
| Additional rule for ownership transfer | Participation does not move to the new TUID. The new TUID cannot join this board with it either (`UID_ALREADY_PARTICIPATED`) |
| TUID withdrawal | All of the TUID's board participations become `WITHDRAWN`, no rewards paid. Completers who withdraw during the participation period are removed from the ranking (not a vacant place); withdrawal after aggregation starts leaves the ranking place vacant |
| Additional rule for issue UID designation | No gauge or streak is recorded during the designated period (JOB-01, 02; no retroactive application). A non-participating UID designated as an issue UID is excluded from the API-003 eligible UID list (`UID_ISSUE_DESIGNATED`) |

> **Account change detection (confirmed 2026-10-01, updated 2026-10-12)**: the existing system does not send separate notifications; **MAX BOARD checks directly**. Check points: (1) when the user enters the detail page or requests participation registration or a cell check, the current link status is queried; (2) at each daily Bingo Batch, the ownership, issue UID designation and withdrawal status of participating UIDs is reconciled in bulk (continuing after the participation period **until payout is complete**); (3) rechecked right before reward confirmation (JOB-05) and crediting (JOB-06). The judgment time for ownership transfer, issue UID designation and withdrawal is **the time in the TetherMax account DB history** (available in the history, confirmed 2026-10-12). Completers forfeited or withdrawn after aggregation starts have their ranking place left vacant.

### 5.8 JOB-10/11 App Push and Email

| Type | Time (UTC) | Audience |
|------|------------|------|
| App push opening notice | Pre-open start date 02:10 | All marketing opt-in users |
| App push opening | Participation start date 02:20 | All marketing opt-in users |
| Join reminder (eligible UID) | D-7 and D-3 before the participation end date, 02:30 | No participating UID registered (including users who have not chosen a new UID after a reset (ownership transfer, issue UID designation)) + has an eligible UID for the exchange |
| Join reminder (no eligible UID) | D-7, D-3, 02:40 | No participating UID registered (including users who have not chosen a new UID after a reset (ownership transfer, issue UID designation)) + no eligible UID |
| Completion reminder | D-7, D-3, 02:50 | Participating UID registered + not all 9 cells checked (including 0 checks) |
| Email reward confirmation notice | ON: announcement start date / OFF: payout period start date, 06:00 | Bingo/Full Board Reward recipients who opted in to marketing email |
| Email ranking congratulations | Announcement start date 06:10 (ON only) | Ranking Reward recipients who opted in to marketing email |

- Common: consent is rechecked at sending time. If the sending date is outside the participation period or on the same day as the opening push, that round is not sent. Completers are excluded from reminders. If the same type applies to multiple boards on the same day, they are delayed by 5 minutes each in registration order; if a delayed time overlaps the next type's push, **the later type is also pushed back** so the 5-minute gap is always kept. A gap of at least 5 minutes is also kept from existing pushes: if a delayed time cannot keep a 5-minute gap from the existing 03:00 UTC pushes (quiz, points) (later than 02:55 and earlier than 03:05), it **moves to 03:05 or later** and the 5-minute delays continue from there (confirmed 2026-10-12). The two emails are sent separately, and the payout date is included in the body as in the final copy. Since the recipient's device time is unknown for emails, the payout date is **written as a UTC date** (e.g., 2026-10-31 (UTC)). No result emails to excluded or withdrawn users. On termination, all later sends are cancelled. The copy is the final version ([FCM and email copy sheet](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877)). The push landing page is the benefit detail.

---

## 6. Policy–API Enforcement Mapping

| Policy | Enforced at | Error code / behavior |
|------|-----------|------------------|
| One board = one exchange | API-102 | `MULTIPLE_EXCHANGES_NOT_ALLOWED`, `INVALID_EXCHANGE` |
| Ranking ON/OFF fixed at creation | Input only in API-102, rejected by API-104 | `LOCKED_FIELD_NOT_EDITABLE` |
| Only content can be edited after registration | Only API-104 exists | `LOCKED_FIELD_NOT_EDITABLE`; `BOARD_CLOSED` for Ended and Terminated |
| Rank tiers from 1st with no gaps or overlaps | API-102 | `RANK_TIER_NOT_FROM_ONE`, `RANK_TIER_GAP`, `RANK_TIER_OVERLAP` |
| Amount cell minimum 0.01, streak N minimum 1 | API-102 | `AMOUNT_CELL_MIN`, `STREAK_DAYS_MIN` |
| Gauge accumulation = 30-day rule only (including participating UIDs); the participation record condition applies only at registration | JOB-01 | Internal rule |
| Exclusion only in the aggregation stage, reason required, cannot be undone | API-113 (no cancellation API) | `EXCLUSION_NOT_IN_AGGREGATION`, `EXCLUSION_REASON_REQUIRED` |
| Termination at any stage before a normal end (including Scheduled), no reason, cannot be undone | API-114 (no cancellation API) | `ALREADY_TERMINATED`, `BOARD_CLOSED` |
| If the participating UID is lost: participation period = Reset, from aggregation start until before payout = Forfeited, after payout = recorded only | JOB-07, API-107, 109 | `RESET` / `FORFEITED` / history `UID_LOST_AFTER_PAYOUT`, `resetReason` `OWNERSHIP_TRANSFER`, `ISSUE_UID` |
| Missed batch recovery once per missed date; whether to recalculate is decided by the stage at request time | API-111 | `BATCH_NOT_RECOVERABLE`, `applied`, history `RECALCULATED`, `SOURCE_CORRECTED` |
| Image IDs only for uploaded images of the same use | API-102, API-104 | `INVALID_IMAGE_REF` |
| Title/subtitle (KO/EN) and banner required on edit too | API-104 | `CONTENT_REQUIRED` |
| CS view only (no changes or CSV) | Common authorization middleware | `FORBIDDEN_ROLE` (403) |

---

## 7. Items to Confirm

> The items below were not decided at the PRD.md draft stage, so the API behavior could not be confirmed. Until confirmed, implement with the provisional behavior shown, with values parameterized.

| # | Item | Details to confirm | Provisional behavior (this document) | Related APIs |
|---|------|-----------|--------------------|----------|
| Q-01 | Notation of a period's "end date" | **Confirmed (2026-10-01)**: end date = the last day of the stage (inclusive through 23:59:59 UTC); the next stage starts at 00:00:00 UTC the next day. See 1.5 | Confirmed and applied | API-002, API-102, JOB-04 |
| Q-02 | Allowed range for registering past dates | **Confirmed (2026-10-01)**: no restriction on past dates (all stages can be registered in the past). Registering past dates is for testing; no special handling for batches, notifications, confirmation or payouts already past | Confirmed and applied | API-102 |
| Q-03 | Minimum reward and rank tier amounts | **Confirmed (2026-10-01)**: line/Full Board rewards and the per-person ranking amount are at least 0.01, 0 not allowed, up to two decimal places (`REWARD_AMOUNT_MIN`) | Confirmed and applied | API-102 |
| Q-04 | Upper limit of streak days N | **Confirmed (2026-10-01)**: registration is not allowed if streak days N > number of participation days (`STREAK_DAYS_EXCEED_PERIOD`) | Confirmed and applied | API-102 |
| Q-05 | Basis for the "current rank" right after Full Board | **Confirmed (2026-10-01, updated 2026-10-02)**: right after completion no rank is shown, only the "Rankings are updated daily" notice (no next update time). The rank is shown from the next ranking update. Exception (2026-10-02): completion after the last day's Bingo Batch was applied shows `RANK_FINAL_AT_ANNOUNCEMENT` ("You can check your final rank when the results are announced." + announcement date-time) until participation ends; it is reflected in the recalculation at aggregation start and finalized at announcement | Confirmed and applied | API-006, API-005, API-007, JOB-05 |
| Q-07 | Ranking place of completers reset or forfeited after aggregation | **Confirmed (2026-10-01, updated 2026-10-12)**: completers who lose the participating UID after aggregation starts become `FORFEITED` and their place is left vacant (`VACANT`); lower ranks are not moved up. Full Board users withdrawn or reset during the participation period are not left vacant; they are removed from the ranking in the next Bingo Batch recalculation. The admin leaderboard shows the status immediately with rank and total cashback fixed; the user leaderboard stays fixed during aggregation and is updated at announcement | Confirmed and applied | API-007, API-106, JOB-03, JOB-07 |
| Q-09 | Criteria for batch "Delayed"/"Missed" | **Confirmed (2026-10-01, changed to the Bingo Batch basis on 2026-10-02, supplemented 2026-10-12)**: the subject is the Bingo Batch. Before judgment or running = `PENDING`; not completed by the Bingo Batch scheduled time + 3 hours = Delayed; not completed by 00:00 UTC of the next day = Missed (the run is stopped, late results are not applied, filled only by recovery). After recovery `recovered=true`, `recoverable=false`, and `result` stays `MISSING`. The scheduled time is a setting (common to all exchanges) | Confirmed and applied | API-005, API-110, JOB-08 |
| Q-16 | Bingo Batch run time | Once, common to all exchanges, after the Bitget cashback batch (12:00 UTC). Exact time to be discussed with the backend (PRD Open Issue #BATCH) | Implemented as a setting; document examples use 12:30 UTC (not exposed in the user API) | API-110, JOB-01~03, JOB-08 |
| Q-10 | Batch recovery reason input | **Confirmed (2026-10-01)**: recovery is possible even after participation ends (no recalculation). No recovery reason input (changed 2026-10-02, confirmation popup only; `RECOVERY_REASON_REQUIRED` removed) | Confirmed and applied | API-111 |
| Q-11 | Fallback order when SEO is not entered for a language | **Confirmed (2026-10-01)**: if there is no value for the language, no other language is substituted; the TetherMax site's default meta and default preview image are used. Whether to add Simplified Chinese (SC) is Open Issue #SC | If there is no value for the language, `null` → site default meta. SC not supported | API-002, API-102, API-104 |
| Q-12 | Image specs and upload path | **Confirmed (2026-10-01)**: WebP only, up to 5MB. Recommended size after the design is finalized. Additional images besides the banner are Open Issue #IMG | Confirmed and applied | API-116 |
| Q-13 | Content character limit | **Confirmed (2026-10-01)**: no character limit. `<br />` in titles and subtitles is shown as a line break | Confirmed and applied | API-102, API-104 |
| Q-14 | Authentication integration method | **Confirmed (2026-10-01)**: user login and back-office permissions (Master/Operator/PM/CS) use the existing systems as is. The implementation method is decided by the development team | Confirmed and applied | All |
