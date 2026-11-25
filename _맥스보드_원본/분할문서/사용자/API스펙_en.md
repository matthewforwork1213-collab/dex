# API Specification — User Screens

> English translation of `API스펙_ko.md`. If the two differ, the Korean original prevails.
> EN copy not yet in the language pack is marked [EN draft] and needs language-pack review.

| Item | Details |
|------|------|
| Project | TetherMax New Member Bingo Event (service name: MAX BOARD / 맥스보드) |
| Created | 2026-10-01 |
| Version | v1.5 (2026-10-12 consistency review applied (confirmed 2026-10-12): user-initiated unlink concept removed, causes of losing the participating UID = ownership transfer and issue UID, `ParticipantStatus` RESET (participation period) and FORFEITED (after aggregation starts and before payout) redefined, `resetReason` `UNLINKED` removed → `OWNERSHIP_TRANSFER` and `ISSUE_UID`, `EligibilityState` `UNLINKED_RESELECT_REQUIRED` → `RESELECT_REQUIRED`, API-003 `unlinkedUid` and `unlinkedAt` → `resetUid` and `resetAt`, JOB-07 rewritten, user leaderboard frozen during the aggregation stage, vacant places applied at announcement, completers withdrawn or reset during participation removed from the ranking (API-007, JOB-03, JOB-05), `BatchResult` `PENDING` added, run stopped when a miss is confirmed, `recovered` after recovery (JOB-08), `batchDelayed` defined and added to API-002, Slack Bingo Batch anomaly alert (JOB-09), push delayed past 03:05 (5.8), `rewards.achieved[]` structure, Ranking Reward credited right after the payout period starts (API-005, JOB-06), no cache for logged-in leaderboard requests, `serverTime` excluded from cache, cache invalidation events, API-005 reloaded after a cell check, targets of `PARTICIPATION_RESET` and `PARTICIPATION_INACTIVE` clarified, `me: null` for non-participants and `rewardAmount: null` outside the winning places, `lang` only for API-001 and 002, admin/user field name mapping (API-002), registration confirmation popup in the polite 해요 style, API-007 example `lastUpdatedAt`, source documents notation) / v1.4 (2026-10-07 PRD v0.11 applied: API-002 `serverTime` added (participation deadline countdown), `PAYOUT_IN_PROGRESS` screen copy, `winnerCount` not shown on screen (REQ-117, REQ-057, REQ-052)) / v1.3 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, ranking reward total/per-place/column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02: local-time display on user screens, per-exchange batch time examples removed, final winners leaderboard shown through the payout period, email payout date written as a UTC date, UTC wording exception in Notes stated, Bingo Batch introduced, `nextUpdateAt` removed from the user API and `dailyUpdateNotice` added (next update time not shown), aggregation-stage leaderboard shows the last updated ranking, reward wording unified from "pay" to "credit", manual recovery confirmed for days the Bingo Batch itself was missed, leaderboard shows all winning places (all stages), exception for completion after the last day's Bingo Batch, ranking copy for non-completers changed to the polite tone, post-participation screen for non-participants, only "Final Streak: ○ Days" shown for the streak after aggregation, difference between the aggregation ranking and the final ranking and recalculation at announcement confirmed, leaderboard pagination (10 rows per page, My Rank row pinned below the list) and only existing ranks shown when completers are fewer than winning places, non-members explicitly included in the post-participation non-participant screen, "Calculating" (KO "집계 중") label confirmed, API-007 `page`/`size`/`totalCount` added, ranking recalculated at aggregation start (JOB-03/JOB-04/JOB-05, common logic), longest-streak fields of API-005/API-004 marked as unused on user screens, API-007 fixed at 10 rows per page (`size` query removed), PRD v0.9 applied) |
| Audience | User screen developers |
| Scope | 7 user APIs (API-001~007) + 11 internal jobs (JOB-01~11, common) |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/사용자/요구사항정의서_en.md, 기능명세_프론트_en.md, 기능명세_백엔드_en.md, src/mockup/index.html (default screen V2, latest integrated mockup of user screens and back office, Vercel deployment) |

> This document is the reference document (no combined version, organized 2026-10-01).
> **Internal jobs (JOB-01~11)** that run as batches/events **are included with the same content in both the user and back-office documents**. When changing an internal job, change both documents together.
> Admin APIs (API-101~116) are in `분할문서/백오피스/API스펙_en.md`.

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
| Time notation | All date-times are **UTC ISO-8601** (`2026-10-15T03:20:00Z`). Values that need only a date use `YYYY-MM-DD` (UTC date). **The API always returns UTC; conversion to local time for display on user screens is done by the front end** (confirmed 2026-10-02, NFR-011). "UTC" is not appended on screen. Stage periods are shown as date + time converted from `startAt`/`endAt` (date-time); for values that have only `startDate`/`endDate`, the front end adds the boundary times (start 00:00:00 UTC / end 23:59:59 UTC) and converts them. All judgments use UTC as is. No time zone notation (GMT+9, etc.) is added either. Exception: the common Notes text (fixed in the front end) keeps the UTC basis statement ("All dates and times are based on UTC") (it states the judgment basis) |
| Amount notation | All amounts are in **USDT**, as **decimal strings with up to two decimal places** (`"12.50"`, `"0.01"`). Floating-point number types must not be used. If a request has three or more decimal places, `INVALID_AMOUNT` |
| Cell position | `cellNo` 1~9, row-major. `(1,1)=1, (1,2)=2, (1,3)=3, (2,1)=4 ... (3,3)=9`. Responses also include `row` and `col` (1~3) |
| Line identifiers | `ROW_1`, `ROW_2`, `ROW_3` (rows), `COL_1`, `COL_2`, `COL_3` (columns). There are no diagonal identifiers |
| Language | Only API-001 and 002, which have per-language content, accept the `lang` query (`KO`/`EN`/`VI`/`TC`/`RU`/`ID`); otherwise `Accept-Language`. Title, subtitle and OG are KO for `KO` and EN for everything else. API-003~007 do not accept `lang` (no per-language text in the responses, confirmed 2026-10-12) |
| Line breaks | Titles and subtitles (KO/EN) may contain `<br />` (REQ-106, REQ-107). The server stores and returns input as is; the screen shows `<br />`, `<br/>` and `<br>` (case-insensitive) as line breaks and shows any other HTML as literal text. **Applies to titles and subtitles only** (not to SEO title/description or OG). No character limit |
| Cashback batch time | The existing TetherMax per-exchange daily batch (the "cashback batch") runs every day **between 11:00 and 12:00 UTC (20:00 to 21:00 KST)**, one exchange at a time (Bitget runs at 12:00 UTC because it has many UIDs). **Cashback batch date** = the UTC date on which the cashback batch ran (the streak judgment date). MAX BOARD does not use the cashback batch directly |
| Bingo Batch time | The MAX BOARD daily batch (the "Bingo Batch", JOB-01~03) reads the cashback batch results and updates the gauge, streak, streak cell activation and ranking together. It runs **once a day at a fixed time common to all exchanges**; the time is a setting (after Bitget, the latest cashback batch). **The exact time is undecided** (backend discussion, Open Issue #BATCH). Delayed/Missed are judged against the Bingo Batch scheduled time. **The next update time is not shown on user screens, and the user API does not return a next update time (`nextUpdateAt`)** (confirmed 2026-10-02). The screen shows "Updated once a day" only during participation, and whether to show it is given by `dailyUpdateNotice`. 12:30 UTC in this document's examples is an illustrative value |
| Caching | Benefits list (API-001), detail (API-002) and leaderboard (API-007) are response caching targets (NFR-001). However, API-002 `serverTime` is not cached and is filled in on every response (if the cache setup makes this difficult, the front end uses the `Date` response header instead). API-007 uses a public cache **only for logged-out requests**; logged-in requests contain personal data in `me`, so they use `Cache-Control: private, no-store`. Personalized responses (`/eligibility`, `/me`) use `Cache-Control: private, no-store`. **Cache invalidation events** (confirmed 2026-10-12): on a stage change, ranking update, recalculation or confirmation, content edit (title, SEO, images), termination, abuse exclusion, recovery recalculation, or change in the Bingo Batch delay state (`batchDelayed`), the API-001, 002 and 007 caches of that board are invalidated. TTL is set in Infrastructure Architecture (#10) |

### 1.2 Authentication and Authorization

| Type | Method | Notes |
|------|------|------|
| User API | Reuses the existing TetherMax user authentication (login session). The server gets the **TUID** from the authentication info | Benefits list, detail and leaderboard can also be called by non-members (optional authentication). Participation, cell check and My Status require login |

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
| | `RESET` | Reset (confirmed 2026-10-12): the participating UID was lost **during the participation period** (ownership transfer, issue UID designation; users cannot unlink a UID themselves). The user becomes like a first-time visitor on that board (checked cells, lines, Full Board, ranking and achieved rewards all disappear) and can select a new UID. Reason in `resetReason`. Admin screen shows "Reset (Ownership Transfer)" / "Reset (Issue UID)" |
| | `EXCLUDED` | Excluded (abuse, cannot be undone) |
| | `WITHDRAWN` | Withdrawn |
| | `FORFEITED` | Forfeited (confirmed 2026-10-12): the participating UID was lost **after aggregation starts and before payment (crediting)** (ownership transfer, issue UID designation). No new UID selection, no rewards, and a Full Board user's ranking place is left vacant. Reason in `resetReason`. Admin screen shows "Forfeited (Ownership Transfer)" / "Forfeited (Issue UID)". If lost after payment (crediting), the status is not changed and only the history is recorded (no clawback) |
| `ResetReason` (`resetReason`) | `OWNERSHIP_TRANSFER` / `ISSUE_UID` | Cause of `RESET` and `FORFEITED` (and of the UID-change-after-payout history): ownership transfer (someone else takes it through ownership verification) / issue UID designation. The judgment time is the time in the TetherMax account DB history. The former value `UNLINKED` is removed (confirmed 2026-10-12) |
| `EligibilityState` | `GUEST` / `NO_ELIGIBLE_UID` / `NOT_REGISTERED` / `PARTICIPATING` / `RESELECT_REQUIRED` | See API-003. `RESELECT_REQUIRED` (former name `UNLINKED_RESELECT_REQUIRED`) = participating UID lost through ownership transfer or issue UID designation (confirmed 2026-10-12) |
| `BatchResult` | `PENDING` | Before judgment or running (before the scheduled time, or running and within scheduled time + 3 hours, confirmed 2026-10-12) |
| | `NORMAL` | Normal (completed within scheduled time + 3 hours) |
| | `DELAYED` | Delayed (not completed by scheduled time + 3 hours; if it then completes before 00:00 UTC of the next day, the result stays `DELAYED` and is applied) |
| | `MISSING` | Missed (not completed by 00:00 UTC of the next day. The run is stopped at that time and confirmed as missed; late results are not applied. Filled only through [Recover]; after recovery the value stays `MISSING` with `recovered=true` and `recoverable=false`, confirmed 2026-10-12) |
| `LeaderboardEntryStatus` | `NORMAL` / `VACANT` | Normal / Excluded · Vacant (abuse exclusion, withdrawal or forfeiture after aggregation starts). The user API (API-007) does not return `VACANT` rows (Q-06, confirmed 2026-10-05). However, the user response in the aggregation stage stays frozen at the result recalculated at aggregation start, so places vacated in the meantime are applied at announcement (confirmed 2026-10-12) |
| `RewardItemType` | `LINE` / `FULL_BOARD` | API-005 `rewards.achieved[].type`: Bingo Reward (line, ROW_1~COL_3 in `line`) / Full Board Reward (`line: null`). Ranking Rewards are not added to the My Rewards list (API-007 `me.rewardAmount`, confirmed 2026-10-12) |
| `RankingMessage` | `COMPLETE_BOARD_TO_RANK` | Not completed, participation period: "Complete the Full Board to enter the ranking." (KO "빙고판을 완성하면 랭킹에 참여할 수 있어요") |
| | `NOT_RANKED_INCOMPLETE` | Not completed, from aggregation on: "You did not complete the Full Board, so you are not ranked." (KO "빙고판을 완성하지 않아 랭킹 대상이 아니에요") (added 2026-10-02) |
| | `RANK_UPDATES_DAILY` | Completed, ranking not yet updated: "Rankings are updated daily" (KO "랭킹은 매일 업데이트돼요") |
| | `RANK_FINAL_AT_ANNOUNCEMENT` | Completed after the last day's Bingo Batch was applied (no further updates during participation; used only until participation ends. After the recalculation at aggregation start, a rank is returned): "You can check your final rank when the results are announced." (KO "최종 순위는 결과 발표 때 확인할 수 있어요") + announcement date-time (`ANNOUNCEMENT.startAt` in API-002 `phases`) (added 2026-10-02) |
| `Lang` | `KO` / `EN` / `VI` / `TC` / `RU` / `ID` | 6 SEO languages. Title, subtitle and OG are KO/EN only |

### 1.5 Period Notation Rules

- **Confirmed (2026-10-01)**: each stage runs from **start date 00:00:00 UTC to end date 23:59:59 UTC** and **includes the end date** (REQ-004, REQ-053).
- **Next stage start date = previous stage end date + 1 day**. Stage changes happen at 00:00:00 UTC on the start date. A one-day stage has start date = end date (`days=1`).
- Stage object in responses: `startDate`, `endDate` (last day of the stage, inclusive), `startAt` (= startDate 00:00:00Z), `endAt` (= endDate 23:59:59Z), `days` (= endDate − startDate + 1).
  - Example: participation `startDate=2026-10-08`, `endDate=2026-10-21` → `days=14`. Bingo Batches run up to 10-21 (UTC) are reflected in the gauge, and the stage changes to aggregation at 10-22 00:00:00 UTC.
- **Display on user screens (confirmed 2026-10-02)**: the front end converts `startAt`/`endAt` to the local time of the user's device and shows **date and time together**, because the local date can differ from the UTC date.
  - Example: participation `startAt=2026-10-08T00:00:00Z`, `endAt=2026-10-21T23:59:59Z` → on a KST device, "2026.10.08 09:00 ~ 2026.10.22 08:59".
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

### 2.2 User Domain

| HTTP | Error code | Condition | Basis |
|------|-----------|------|------|
| 409 | `PHASE_NOT_PARTICIPATION` | Participating UID registration, reselection or cell check requested outside the participation stage | REQ-033, REQ-045, REQ-054~055 |
| 422 | `UID_NOT_LINKED` | The requested UID is not linked to the requesting TUID | REQ-027 |
| 422 | `UID_EXCHANGE_MISMATCH` | The requested UID is not a UID of the board's exchange | REQ-026 |
| 422 | `UID_REGISTERED_TOO_EARLY` | The UID's **first registration date in the TetherMax DB** (UTC) < participation start date − 30 days | REQ-023 |
| 422 | `UID_ALREADY_PARTICIPATED` | The requested UID already has a participation record on **this board** (including reset, excluded, withdrawn and forfeited; regardless of ownership transfer or return to the original TUID) | REQ-024 |
| 422 | `UID_ISSUE_DESIGNATED` | The requested UID is designated as an issue UID (existing TetherMax feature, confirmed 2026-10-02) | REQ-114 |
| 409 | `ALREADY_PARTICIPATING` | This TUID already has a UID participating on this board (one per board) | REQ-027, REQ-029 |
| 409 | `NOT_PARTICIPATING` | Cell check requested with no participating UID registered | F-007 |
| 409 | `PARTICIPATION_RESET` | This TUID's participation was reset (`RESET`) or forfeited (`FORFEITED`) (participating UID lost through ownership transfer or issue UID designation, confirmed 2026-10-12). The front end refreshes the detail and goes to the API-003 `RESELECT_REQUIRED` screen | REQ-030, REQ-031, REQ-110, REQ-115 |
| 409 | `PARTICIPATION_INACTIVE` | Cannot be processed because the participation status is excluded (`EXCLUDED`) or withdrawn (`WITHDRAWN`) (API-006). The front end refreshes the detail without a separate notice (confirmed 2026-10-12) | REQ-065, REQ-067 |
| 400 | `INVALID_CELL` | `cellNo` is not 1~9 | - |
| 409 | `CELL_ALREADY_CHECKED` | Cell already checked (no undo or move; includes the second of two simultaneous duplicate requests) | REQ-044, NFR-004 |
| 422 | `INSUFFICIENT_GAUGE` | Amount cell: available gauge < target amount | REQ-039 |
| 422 | `STREAK_CELL_NOT_ACTIVATED` | Streak cell: no activation history | REQ-040, REQ-041 |
| 404 | `RANKING_DISABLED` | Leaderboard requested for a ranking OFF board | REQ-082 |

---

## 3. API Endpoint List

### 3.1 User APIs

| API-ID | Method | URL | Description | Permission | F-ID | REQ-ID |
|--------|--------|-----|------|------|------|--------|
| API-001 | GET | `/api/maxboard/boards` | MAX BOARD card list for Benefits | Public | F-001, F-011 | REQ-057, 071, 075, 085 |
| API-002 | GET | `/api/maxboard/boards/{boardId}` (or `/api/maxboard/benefits/{benefitNo}`) | Benefit detail (layout by stage and ranking ON/OFF, SEO) | Public | F-002, F-011 | REQ-054~057, 076, 082, 085~087, 112 |
| API-003 | GET | `/api/maxboard/boards/{boardId}/eligibility` | Participation availability and eligible UID list (including when the participating UID was lost) | Public (`GUEST` for non-members) | F-003, F-005 | REQ-022~027, 030, 031, 077, 110, 114, 115 |
| API-004 | POST | `/api/maxboard/boards/{boardId}/participation` | Register participating UID / reselect after a reset | Login | F-004, F-005 | REQ-023~030, 033, 114 |
| API-005 | GET | `/api/maxboard/boards/{boardId}/me` | My board, gauge, streak and reward status | Login | F-006, F-009 | REQ-063, 078~081, 109, 111 |
| API-006 | POST | `/api/maxboard/boards/{boardId}/cells/{cellNo}/check` | Cell check (amount cell / streak cell) | Login | F-007, F-008, F-009 | REQ-038, 039, 041, 044~048 |
| API-007 | GET | `/api/maxboard/boards/{boardId}/leaderboard` | User leaderboard (masked TUID, winning places, My Rank) | Public (My Rank when logged in) | F-010 | REQ-049~052, 056, 066, 109, 112 |

---

## 4. API Details — User

### API-001. Board List for Benefits

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards` |
| Description | Returns the MAX BOARD cards to show in Benefits. Includes only boards in the `PREVIEW`~`PAYOUT` stages and excludes `SCHEDULED` (Scheduled), `ENDED` and `TERMINATED`. The card shows `title` on top and `subtitle` below (confirmed 2026-10-05). Sorted by **most recently registered** (`createdAt` descending). `benefitNo` is a new benefit number issued when the board is created, and the detail URL is distinguished by `?benefitNo=` like the Global League (path `/{lang}/max-board?benefitNo={n}` confirmed; the number is issued by the backend at creation). The Benefits screen places these results **first**, ahead of other benefits |
| Permission | Public (non-members allowed) |
| Caching | Public cache target. Cache invalidated immediately on termination (REQ-071) |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| query | lang | Lang | Optional | KO title/subtitle for `KO`, EN for everything else |

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

**Error codes**: `500 INTERNAL_ERROR`

---

### API-002. Benefit Detail (Board)

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}` or `/api/maxboard/benefits/{benefitNo}` |
| Description | When the user arrives via the benefit detail URL (`/{lang}/max-board?benefitNo={n}`), the board is looked up by `benefitNo`; the response is the same. API-003~007 are called with the `boardId` in the response (confirmed 2026-10-05). Returns the information needed to build the screen for the stage and ranking ON/OFF. Contains no personalized information (split into API-003 and API-005). For ranking OFF, the `ranking` key and the `ANNOUNCEMENT` stage key are **omitted** from the response |
| Permission | Public (non-members allowed) |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId or benefitNo | string / integer | Required | Board ID or benefit number (`benefitNo` in the detail URL) |
| query | lang | Lang | Optional | Title, subtitle and OG in KO/EN; SEO in the matching one of the 6 languages |

**Processing rules**

| Stage | `actions` | Screen guidance |
|------|-----------|-----------|
| `PREVIEW` | Participation and check not available | View only, participation start date shown, disabled button "Opens on ○○" for all users (no login prompt or Link UID). Logged-in users see the API-003 eligibility result (confirmed 2026-10-05, updated 2026-10-12) |
| `PARTICIPATION` | Participation and check available | Participate, check |
| `AGGREGATION` | Not available | "Calculating" (`notice: AGGREGATING`, disabled "Calculating" for all users, no login prompt). With ranking ON, the leaderboard (API-007) shows the ranking recalculated at aggregation start, frozen (no further updates, confirmed 2026-10-02) |
| `ANNOUNCEMENT` (ON) | Not available | Confirmed rewards and the final winners leaderboard (API-007). Non-participants (API-003 `GUEST`, `NO_ELIGIBLE_UID`, `NOT_REGISTERED`) see "The Participation Period Has Ended" + disabled button "Participation Ended" + "Check the final ranking." |
| `PAYOUT` | Not available | Payout notice, payout start date. With ranking ON, the final winners leaderboard (API-007) stays visible until the end (404). Non-participants (`GUEST`, `NO_ELIGIBLE_UID`, `NOT_REGISTERED`) see "The Participation Period Has Ended" + disabled button "Participation Ended" ("Check the final ranking." added with ranking ON) |
| `SCHEDULED` / `ENDED` / `TERMINATED` | - | **404 `BOARD_NOT_FOUND`** (Scheduled confirmed 2026-10-05) |

- SEO: if the language has an input value, that value is returned; otherwise `null`. For `null` items the front end uses **the TetherMax site's default meta and default preview image** (REQ-086). Requests for unsupported languages are handled as EN (F-011).
- `rewards.maxPerPerson` = 3 rows + 3 columns + Full Board Reward total (maximum reward per person). Used for the hero "Maximum Bingo Rewards ○○ USDT" (REQ-128, confirmed 2026-10-12). The banner (`bannerImageUrl`) is for the Benefits list card and is not shown on the detail screen.
- `batchDelayed` (public, confirmed 2026-10-12): same criterion as API-005 (`true` if, in the participation stage, the Bingo Batch is still not completed after the scheduled time + 3 hours or there is an unrecovered `MISSING`; otherwise `false`). Used for the leaderboard delay notice shown to everyone, including non-members and non-participants.

**Response (200 OK) — ranking ON, participation stage**

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

**Response (200 OK) — ranking OFF, aggregation stage (differences only)**

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

> Ranking OFF responses have no `ranking` key and no `ANNOUNCEMENT` stage. `notice` values: `null` / `AGGREGATING` (aggregation) / `RESULT_ANNOUNCED` (announcement) / `PAYOUT_IN_PROGRESS` (payout period).
> `serverTime` (confirmed 2026-10-07): the server UTC time at response. The front end computes the participation deadline countdown (REQ-117) from the difference between `serverTime` and `PARTICIPATION.endAt`, not from the device clock. API-002 is a public caching target, but **`serverTime` is not cached and is filled in on every response**. If the cache setup makes this difficult, the front end derives the server time from the `Date` response header (adding `Age` for a cached response) (confirmed 2026-10-12). The screen copy for `notice: PAYOUT_IN_PROGRESS` is "Paying Out Sequentially" (KO "순차적으로 지급 중", REQ-057). The exchange logo (REQ-116) uses the front end's existing exchange logo assets by `exchange.code`.

**Field name mapping with the admin API** (confirmed 2026-10-12) — the back-office API (API-102 create, API-103 detail) and this API use different names for the same values.

| This API (API-002) | Back-office API (API-102 / API-103) | Notes |
|------------------|----------------------------------|------|
| `rewards.lines[]` (`line`: ROW_1~COL_3, `amount`) | `rewards.row1`~`row3`, `col1`~`col3` | 6 line rewards |
| `rewards.fullBoard` | `rewards.fullBoard` | Same |
| `rewards.maxPerPerson` | `perPersonCost` | 6 lines + Full Board Reward total (maximum per person) |
| `ranking.tiers[]` | `rankTiers[]` | Per-tier amount per person `amountPerPerson` is the same |
| `ranking.winnerCount`, `ranking.poolTotal` | `ranking.winnerCount`, `ranking.poolTotal` | Same (API-103) |
| `title`, `subtitle` (KO or EN value for the requested `lang`) | `content.titleKo`, `titleEn`, `content.subtitleKo`, `subtitleEn` | |
| `bannerImageUrl` | `content.bannerImageId` (API-102 input) / `content.bannerImage.url` (API-103) | Registered by image ID, read by URL |
| `seo.ogImageUrl` (KO if the requested language is KO, otherwise EN) | `content.ogImageKoId`, `ogImageEnId` / `content.ogImageKo`, `ogImageEn` | |
| `seo.title`, `seo.description` (value for the requested language) | `content.seo.{KO,EN,VI,TC,RU,ID}` | |

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |

---

### API-003. Participation Availability and Eligible UID List

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/eligibility` |
| Description | Determines the participation state of the logged-in TUID and returns **only the list of eligible UIDs** that can be registered (no per-UID gauge returned, REQ-028). The participating UID selection screen and the reselection screen use the same response |
| Permission | Public. Returns `GUEST` for non-members (200) |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | Board ID |

**Eligible UID judgment (REQ-022~026, F-003)** — the TUID sign-up date is not considered. A UID that meets **all** of the following is an eligible UID.

| # | Condition |
|---|------|
| 1 | UID currently linked to the requesting TUID |
| 2 | UID of the board's exchange |
| 3 | **First registration date in the TetherMax DB (UTC date) ≥ participation start date − 30 days**. Includes UIDs registered during participation. Even when linked again (e.g., after an ownership transfer), the first registration date applies |
| 4 | Has never had a participation record on **this board** (records on other boards do not matter) |
| 5 | **Not designated as an issue UID** (existing TetherMax issue UID designation feature, confirmed 2026-10-02) |

**State judgment**

| `state` | Condition | Screen |
|---------|------|------|
| `GUEST` | Not logged in | Login CTA only in the participation stage (disabled buttons in other stages, confirmed 2026-10-12) |
| `PARTICIPATING` | The current TUID has a participation on this board with status `PARTICIPATING`, `EXCLUDED` or `WITHDRAWN` and still holds that participating UID (`EXCLUDED` also uses this state, with no notice text, Q-08) | My board (API-005) |
| `RESELECT_REQUIRED` | Participating UID lost (confirmed 2026-10-12): the current TUID's last participation is `RESET` (ownership transfer or issue UID designation during the participation period) or `FORFEITED` (after aggregation starts and before payout) and there is no active participation, or the participating UID was lost through ownership transfer or issue UID designation after payment (crediting) and only the history remains. Users cannot unlink a UID themselves, so these two are the only causes | Notice at the very top of the benefit detail "You Can No Longer Participate with This UID" (KO "참여 중이던 UID로 더 이상 참여할 수 없어요") + "This UID can no longer join this board." (KO "이 UID로는 이 빙고판에 다시 참여할 수 없어요.") (no distinction by cause). Participation stage + eligible UID available → new UID selection (`canReselect=true`); no eligible UID → "You have no eligible {exchange} UID. Link a new UID to participate again." [EN draft] (KO "참여할 수 있는 {거래소} UID가 없어요. 새 UID를 연동하면 다시 참여할 수 있어요.") + Link UID. Outside the participation stage, `canReselect=false`, notice only without a button (aggregation and announcement add "No event rewards will be paid." [EN draft] (KO "이벤트 리워드는 지급되지 않아요"); not in the payout period) |
| `NOT_REGISTERED` | No participation history + 1 or more eligible UIDs | Eligible UID selection |
| `NO_ELIGIBLE_UID` | No participation history + 0 eligible UIDs | "You have no eligible {exchange} UID" [EN draft] (KO "참여할 수 있는 {거래소} UID가 없어요") + guidance on linking a new UID ({exchange} = `exchange.name`, no hardcoding, REQ-077). [Link UID] only in the participation stage |

- In the announcement and payout periods, `GUEST` (non-member), `NO_ELIGIBLE_UID` and `NOT_REGISTERED` all see the same screen, non-members included: instead of the per-state guidance, "The Participation Period Has Ended" + disabled button "Participation Ended" (with ranking ON, "Check the final ranking." and the final ranking are added; login prompt and payout notice hidden, confirmed 2026-10-02). No response fields change (judged by the combination of `boardStatus` + `state`).
- The state is **also judged in the pre-open stage** (including the eligible UID list; the 30-day rule is computed from the participation start date, confirmed 2026-10-05). `actions.canRegister` is `true` only when the state is `NOT_REGISTERED` and the stage is `PARTICIPATION`. `actions.canReselect` is `true` only when the state is `RESELECT_REQUIRED`, the stage is `PARTICIPATION` and there is at least 1 eligible UID.
- The response always includes `exchange` (`code`, `name`) (for replacing `{exchange}` in screen copy, confirmed 2026-10-12).

**Response (200 OK) — participating UID not registered**

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

**Response (200 OK) — reselection required after losing the participating UID (participation period)**

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

> `resetUid` (the lost participating UID), `resetAt` (time of the ownership transfer or issue UID designation in the TetherMax account DB history) and `resetReason` (`OWNERSHIP_TRANSFER` / `ISSUE_UID`) are returned only for `RESELECT_REQUIRED` (renamed from the former `unlinkedUid`, `unlinkedAt` and `UNLINKED`, confirmed 2026-10-12). The screen is the same regardless of the cause and does not branch on `resetReason` (reason not shown).

**Response (200 OK) — non-member / no eligible UID (summary)**

```json
{ "status": "success", "data": { "boardId": "mb_20261001_bitget01", "boardStatus": "PARTICIPATION", "state": "GUEST", "eligibleUids": [], "actions": { "canRegister": false, "canReselect": false } }, "meta": { "requestId": "req_01J9ZK3Q8W2M" } }
```

```json
{ "status": "success", "data": { "boardId": "mb_20261001_bitget01", "boardStatus": "PARTICIPATION", "state": "NO_ELIGIBLE_UID", "exchange": { "code": "BITGET", "name": "Bitget" }, "uidRegisteredOnOrAfter": "2026-09-08", "eligibleUids": [], "actions": { "canRegister": false, "canReselect": false } }, "meta": { "requestId": "req_01J9ZK3Q8W2M" } }
```

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |
| 503 | `SERVICE_UNAVAILABLE` | Failed to query the account system (UID link information) |

---

### API-004. Register / Reselect Participating UID

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/maxboard/boards/{boardId}/participation` |
| Description | Registers one eligible UID as the participating UID for this board. **A participation record is created** at registration, and afterwards this UID cannot join this board again (REQ-024, REQ-025). If the state is `RESELECT_REQUIRED` (reset during the participation period), the same endpoint handles **reselection** (`mode: RESELECT`). There is no API to change the participating UID (REQ-029) |
| Permission | Login |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | Board ID |
| body | uid | string | Required | UID to register (one of API-003 `eligibleUids`) |
| body | confirmed | boolean | Required | Whether the registration confirmation popup ("You can't change it after registration." (KO "등록 후에는 변경할 수 없어요."); for reselection "If you select a new UID, your progress on this board starts over. You can't change it after registration." (KO "새 UID를 선택하면 이 빙고판의 진행이 처음부터 다시 시작돼요. 등록 후에는 변경할 수 없어요.")) was confirmed. Rejected unless `true` (REQ-028) |

```json
{ "uid": "48377210", "confirmed": true }
```

**Processing order**

1. Check stage = `PARTICIPATION` (any time during participation, including the last day. REQ-033)
2. Check the TUID's participation status on this board: if there is an active participation (`PARTICIPATING`, etc.), `ALREADY_PARTICIPATING`. If there is only `RESET`, reselection mode (`FORFEITED` occurs only after aggregation starts, so it is rejected at step 1)
3. Recheck the requested UID's eligibility (API-003 conditions 1~5)
4. Create the participation record (TUID, UID, registration time) — unique constraints on `(boardId, uid)` and `(boardId, tuid, active)` so only one of simultaneous requests succeeds
5. Link as is the gauge, streak and streak cell activation history already accumulated by that UID since the participation start date (retroactive, REQ-035). For reselection, the user starts on that board like a first-time visitor: cells, lines, Full Board, ranking and achieved rewards of the previous participation are not carried over (REQ-030, confirmed 2026-10-12)
6. Record `UID_REGISTERED` history (including the retroactive gauge value)

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

> `retroactive.maxStreakDays` (longest streak) is **not used on user screens** (user screens show only the current streak, confirmed 2026-10-02. The field is kept).
> `retroactive.reflectedThroughBatchDate` (the last cashback batch date applied) is for consistency checks and CS, and **is not shown on user screens** (Bingo Batch introduced 2026-10-02). After a successful registration, the screen reloads API-005 to render, and during participation shows only "Updated once a day" (next update time not shown, confirmed 2026-10-02).

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `VALIDATION_ERROR` | `uid` missing |
| 400 | `CONFIRMATION_REQUIRED` | `confirmed !== true` |
| 401 | `UNAUTHORIZED` | Not logged in |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |
| 409 | `PHASE_NOT_PARTICIPATION` | Pre-open, or aggregation and later stages |
| 409 | `ALREADY_PARTICIPATING` | This board already has an active participating UID (one per board) |
| 422 | `UID_NOT_LINKED` | UID not linked to the requesting TUID |
| 422 | `UID_EXCHANGE_MISMATCH` | Not a UID of the target exchange |
| 422 | `UID_REGISTERED_TOO_EARLY` | First registration date < participation start date − 30 days |
| 422 | `UID_ALREADY_PARTICIPATED` | UID with a participation record on this board (including UIDs that came back to the original TUID and UIDs transferred from another TUID) |
| 422 | `UID_ISSUE_DESIGNATED` | UID designated as an issue UID (confirmed 2026-10-02) |
| 409 | `CONCURRENT_REQUEST` | Simultaneous registration conflict for the same TUID/UID |

---

### API-005. My Board Status

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/me` |
| Description | Returns the participant's cell states, available gauge, current and longest streak (longest streak not used on user screens), completed lines and Full Board, next goal, and whether to show the batch delay notice. Does not return cell suggestion or highlight information (REQ-038) |
| Permission | Login |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | Board ID |

**Processing rules**

- Participating UID not registered, `RESET`, `FORFEITED`, or participating UID lost after payout: `participation: null`. No gauge is returned (F-006). State guidance uses API-003.
- Cell state: checked → `CHECKED`. An unchecked amount cell is `CHECKABLE` if `availableGauge ≥ targetAmount`, otherwise `LOCKED`. An unchecked streak cell is `CHECKABLE` if it has activation history (kept even after the streak breaks, REQ-042), otherwise `LOCKED`. If the stage is not `PARTICIPATION`, all unchecked cells are `LOCKED`.
- `batchDelayed` (confirmed 2026-10-12): can be `true` only in the participation stage. `true` if (a) the most recent **Bingo Batch** is still not completed after the scheduled time + 3 hours (delay in progress) or (b) there is an unrecovered `MISSING` for a date within the participation period → shows "Cashback update delayed" (KO "페이백 반영이 지연되고 있어요") (REQ-063). Once the batch completes, even late (the result stays `DELAYED`), (a) returns to `false`. The same value is also given in API-002 (public).
- `dailyUpdateNotice` (participation): whether to show the "Updated once a day" notice. `true` in the participation stage before the last day's Bingo Batch has been applied; after the last day's Bingo Batch is applied and from the aggregation stage on there are no more updates, so `false` (the screen hides the notice). **No next update time is returned** (not shown on user screens, confirmed 2026-10-02). If `batchDelayed=true`, the screen shows the delay notice ("Cashback update delayed") first.
- `reflectedThroughBatchDate`: the last cashback batch date applied. For consistency checks and CS; **not shown on user screens** (applied-date wording such as "as of ○ ○" removed, 2026-10-02).
- `nextGoal`: the number of remaining cells in the incomplete line with the fewest remaining cells, and the total number of remaining cells (REQ-080).
- `rewards` (confirmed 2026-10-12): `achieved[]` holds **only Bingo Rewards (lines) and the Full Board Reward**. Item = `type` (`LINE` / `FULL_BOARD`), `line` (`ROW_1`~`ROW_3`, `COL_1`~`COL_3` for `LINE`; `null` for `FULL_BOARD`), `amount` (USDT string). Returned in the order achieved (by line completion time; the Full Board Reward last). `achievedTotal` = total of the list. Ranking Rewards are not included and are shown only through the leaderboard `me.rewardAmount`. When the participating UID is lost and the user is reset, all previously achieved rewards disappear (based on the new participation). Example: `"achieved": [ { "type": "LINE", "line": "ROW_2", "amount": "3.00" }, { "type": "FULL_BOARD", "line": null, "amount": "10.00" } ]`.
- `streak`: `currentDays` (current streak), `maxDays` (longest streak, **not used on user screens**, confirmed 2026-10-02. The field is kept). The participation-stage screen shows `currentDays` with the label "Current Cashback Streak" (KO "현재 연속 페이백 기록") + large number "○ Days" (KO "○일"; "1 Day" for 1) + small "Cashback Streak" (KO "연속 페이백") + progress bar, and does not show the best record. In stages after aggregation (aggregation, announcement, payout period), the label changes to "Final Cashback Streak" (KO "최종 연속 페이백 기록") with the same number shown (progress bar hidden, confirmed 2026-10-12). Since Bingo Batches are no longer applied from aggregation on, `currentDays` stays fixed at its value at the end of participation (confirmed 2026-10-02, no response field changes).
- `ranking` is included only for ranking ON boards. Non-completers get `rank: null` + `message: COMPLETE_BOARD_TO_RANK` in the participation stage ("Complete the Full Board to enter the ranking."), and `message: NOT_RANKED_INCOMPLETE` from aggregation on ("You did not complete the Full Board, so you are not ranked."). If the board is completed but the ranking has not been updated yet, `rank: null` + `message: RANK_UPDATES_DAILY` ("Rankings are updated daily"). However, if the board was **completed after the last day's Bingo Batch was applied**, there are no further updates during participation, so until participation ends `rank: null` + `message: RANK_FINAL_AT_ANNOUNCEMENT` ("You can check your final rank when the results are announced.", announcement date-time from API-002 `ANNOUNCEMENT.startAt`). From the aggregation stage, the rank (`rank`) recalculated at aggregation start is returned, and from announcement on, the final rank (`rank`) (confirmed 2026-10-02). In all cases `lastUpdatedAt` (last update, UTC) is returned but **not shown on screen** (confirmed 2026-10-12). No next update time is returned (confirmed 2026-10-02).

**Response (200 OK) — ranking ON, participating**

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

> `rewards.rewardStatus`: `EXPECTED` (before confirmation) / `CONFIRMED` (ranking ON: from announcement start; OFF: after aggregation ends). Users under abuse exclusion (`EXCLUDED`) are not told about the exclusion (no separate notice state, text or message code, Q-08 confirmed 2026-10-02). During the aggregation period the response is the same as for other participants; in the announcement and payout periods (payout period only for ranking OFF), `rewards.achieved[].amount` and `rewards.achievedTotal` are `null` (screen "-", no credit notice) and `ranking` is `null` (My Rank not shown). `rewards.rewardStatus` returns the same value as for other participants (confirmed 2026-10-05). The screen badge "Calculating" is not a separate value; the front end shows it when the value is `EXPECTED` and API-002 `status=AGGREGATION`.

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 401 | `UNAUTHORIZED` | Not logged in |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |

---

### API-006. Cell Check

| Item | Details |
|------|------|
| Method | POST |
| URL | `/api/maxboard/boards/{boardId}/cells/{cellNo}/check` |
| Description | Checks a cell the user chose. Branches by cell type. **A check cannot be undone** (no undo or move API), and checking a single cell has no reward of its own (REQ-044, REQ-048). Right after the check, line and Full Board completion are judged and included in the response (F-009) |
| Permission | Login |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | Board ID |
| path | cellNo | integer | Required | 1~9 |
| body | - | - | - | No body |

**Processing rules**

| Common | 1) Stage = `PARTICIPATION` 2) Participation status of the requesting TUID = `PARTICIPATING` (not registered → `NOT_PARTICIPATING`; `RESET` or `FORFEITED` → `PARTICIPATION_RESET`; `EXCLUDED` or `WITHDRAWN` → `PARTICIPATION_INACTIVE`, confirmed 2026-10-12) 3) The cell is not checked |
|------|------|
| Amount cell (`AMOUNT`) | Lock the participation record row → check `availableGauge ≥ targetAmount` → save **the gauge deduction and the check record in one transaction** (atomic deduction, NFR-004). Even when other amount cells are checked at the same time, the total does not exceed the gauge |
| Streak cell (`STREAK`) | Check that activation history exists (allowed even if the current streak is broken, as long as there is history) → save the check record. **No gauge change** |
| Completion judgment | Record the completion time of any newly completed line among 3 rows and 3 columns; when all 9 cells are checked, record the Full Board completion time (DB history, ranking tie-break basis) |

**Response (200 OK) — streak cell (7 days) check completes row 2 (no gauge change)**

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

**Response (200 OK) — last cell check completes the board (ranking ON)**

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

> The completion response for a ranking ON board **returns no rank**, only `ranking.message: RANK_UPDATES_DAILY` ("Rankings are updated daily") (no next update time, confirmed 2026-10-02).
> **Exception (confirmed 2026-10-02)**: if the board is completed after the last day's Bingo Batch has been applied (after the user API's `dailyUpdateNotice` has become `false`), `ranking: { "rank": null, "message": "RANK_FINAL_AT_ANNOUNCEMENT" }` is returned, because there are no further ranking updates during participation. The screen shows "You can check your final rank when the results are announced." and the announcement date-time (`ANNOUNCEMENT.startAt` in API-002 `phases`; no separate field added). This user is also ranked: reflected in the recalculation at aggregation start (JOB-03) and finalized at announcement (JOB-05) (confirmed 2026-10-02).
> The rank appears in API-005 and API-007 after the next ranking update (JOB-03) (confirmed 2026-10-01). The completion response for a ranking OFF board returns `payoutStartAt` instead of `ranking` (REQ-081).
> The response contains only the checked cell. A check reduces the gauge and can change the state of other amount cells, so after success the front end **reloads API-005** to update the 9 cell states and Max Cells to Check (confirmed 2026-10-12).

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 400 | `INVALID_CELL` | `cellNo` is not 1~9 |
| 401 | `UNAUTHORIZED` | Not logged in |
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |
| 409 | `PHASE_NOT_PARTICIPATION` | Not the participation stage (no checks from aggregation on) |
| 409 | `NOT_PARTICIPATING` | Participating UID not registered |
| 409 | `PARTICIPATION_RESET` | Participation reset (`RESET`) or forfeited (`FORFEITED`) through ownership transfer or issue UID designation |
| 409 | `PARTICIPATION_INACTIVE` | Participation status is excluded or withdrawn |
| 409 | `CELL_ALREADY_CHECKED` | Cell already checked / simultaneous duplicate request |
| 422 | `INSUFFICIENT_GAUGE` | Amount cell, insufficient gauge |
| 422 | `STREAK_CELL_NOT_ACTIVATED` | Streak cell, not activated |
| 409 | `CONCURRENT_REQUEST` | Another check by the same participant is being processed (lock wait exceeded) |

---

### API-007. User Leaderboard

| Item | Details |
|------|------|
| Method | GET |
| URL | `/api/maxboard/boards/{boardId}/leaderboard` |
| Description | For ranking ON boards, returns **the ranking of all winning places** (all stages, from 1st to `winnerCount`) and **My Rank**. Only users who completed the board are included. The TUID is masked on the server with the same masking rule as the Global League (e.g., `99****76`) (REQ-052). From the announcement stage, returns the **final winners leaderboard** (rank / Ranking Reward amount `rewardAmount` / masked TUID), and **during the payout period returns the same confirmed result until the end (404)** (REQ-052, REQ-056) |
| Permission | Public. Includes `me` when logged in |
| Caching | Only logged-out requests use the public cache. Logged-in requests contain `me`, so `Cache-Control: private, no-store` (confirmed 2026-10-12). Invalidation events: 1.1 "Caching" |

**Request**

| Location | Parameter | Type | Required | Description |
|------|----------|------|------|------|
| path | boardId | string | Required | Board ID |
| query | page | integer | Optional | Page number (from 1, default 1). `entries: []` if out of range. A page is **fixed at 10 rows**, and there is no parameter for the number of rows (confirmed 2026-10-02) |

**Processing rules**

- Ranking: total cashback during participation (cumulative gauge) in descending order; on a tie, the one whose Full Board record was saved (inserted) in the DB first (REQ-049, REQ-050). Updated at each daily Bingo Batch and recalculated once right after the aggregation stage starts (JOB-03, confirmed 2026-10-02). Completers withdrawn or reset during the participation period are left out at the next Bingo Batch calculation (not a vacant place, confirmed 2026-10-12). No next update time is returned (not shown on user screens, confirmed 2026-10-02). `lastUpdatedAt` is returned but not shown on screen (confirmed 2026-10-12). `dailyUpdateNotice` follows the same rule as API-005 (`true` in the participation stage before the last day's Bingo Batch is applied, otherwise `false`), and the screen shows "Updated once a day" only when it is `true`. The delay notice uses API-002 `batchDelayed`.
- Places vacated after aggregation starts through abuse exclusion, withdrawal or forfeiture (ownership transfer, issue UID designation) keep their rank as `status: VACANT`, and lower ranks are not moved up (REQ-066). The user API **leaves vacant rows out** of `entries` **from the announcement on**. The remaining rows keep their original `rank` (e.g., if 15th is vacant, the order is 14, 16; Q-06 confirmed 2026-10-05). In the aggregation stage the recalculated result stays frozen, so rows for places vacated in the meantime are kept as they are and applied at announcement (confirmed 2026-10-12).
- **`entries` range (confirmed 2026-10-02)**: in **all stages** (participation, aggregation, announcement, payout period), **all winning places** are returned (from 1st to `winnerCount`, e.g., up to 30th for 30 winners). Vacant places are left out of the rows (confirmed 2026-10-05). If completers are fewer than the number of winners, only existing ranks are returned. The rank of a user outside the winning places is given only in `me`.
- **Pagination (confirmed 2026-10-02)**: `entries` contains only the rows of the page selected by `page` (fixed at 10 rows per page, the same in all stages). The response `totalCount` is the number of rows to show = rows among the winning places (1st~`winnerCount`) minus vacant places (confirmed 2026-10-05); `page` is the applied value and `size` is always 10. If there is only one page, the screen hides the page buttons. If completers are fewer than the number of winners, only that many are returned (e.g., 30 winners and 18 completers → `totalCount: 18`, 2 pages). `me` is always returned regardless of the page (the screen pins it below the list). Since the response `data` is an object (including `me`), these are placed in `data` instead of the common list format's `meta.pagination`.
- **Winner count (confirmed 2026-10-06)**: `winnerCount` is for the by-place popup and page calculation and is not shown as a total ("All ○ winners") above the screen leaderboard (REQ-052).
- In the pre-open stage, `entries: []`. Total Ranking Rewards and per-place amounts are shown from pre-open using API-002 `ranking.poolTotal` and `ranking.tiers` (confirmed 2026-10-02).
- **In the aggregation stage, the ranking recalculated right after aggregation starts (JOB-03, reflecting all completers during participation) is returned**, and updates stop afterwards (`finalized: false`; `rewardAmount` is the tier amount for that rank). Abuse exclusions, withdrawals and forfeitures that occur in the meantime are also not reflected in the user response (confirmed 2026-10-12). The screen shows it with "Calculating". The aggregation ranking differs from the final ranking only by places vacated this way. At announcement, the final ranking confirmed by JOB-05 is returned (vacant rows left out, lower ranks not moved up) (confirmed 2026-10-02, updated 2026-10-05). In the announcement and payout periods, `finalized: true`, `rewardAmount` included, and the confirmed result is fixed (no updates). The response content is the same in both stages, and the screen label is "Final Ranking" (KO "최종 순위"). Columns are the same in every stage (rank, trader `tuidMasked`, total cashback `totalCashback`, Ranking Reward `rewardAmount`, confirmed 2026-10-12).
- **`me` (confirmed 2026-10-12)**: `"me": null` for non-members, users without a registered participating UID, and users who lost their participating UID (`RESET`, `FORFEITED`, lost after payout) (no My Rank area on screen). Completers outside the winning places (1st~`winnerCount`th) get `rank` but `rewardAmount: null` (screen "-").

**Response (200 OK) — announcement / payout period stage**

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

> In the example, 2nd place is vacant, so 3rd comes after 1st (vacant rows not returned, confirmed 2026-10-05). For space, the example shows only 2 `entries` rows. In practice, the rows of the requested page (fixed at 10 rows) are returned, and all rows are those from 1st to min(number of completers, `winnerCount`) minus vacant places (e.g., all 30 completed and 1 vacant place → `totalCount: 29`, 3 pages). Masking shows the first 2 and last 2 characters (Q-15).
> In the participation and aggregation stages, `finalized: false`, and `rewardAmount` gives the Ranking Reward tier amount for that rank **in all stages** (confirmed 2026-10-02. Before confirmation it means "the prize for this rank" and is not a confirmed payout) (in the participation stage `dailyUpdateNotice` is `true` until the last day's Bingo Batch is applied; in the aggregation stage it is `false`). The example `lastUpdatedAt` is the time of the recalculation right after aggregation starts (no updates afterwards) and is not shown on screen. Users under abuse exclusion (`EXCLUDED`): in the announcement and payout periods `"me": null` (the screen hides the "My Rank" row, no reason text, Q-08); in the aggregation stage, same as other completers. Logged-in non-completers: in the participation stage `"me": { "completed": false, "rank": null, "rewardAmount": null, "message": "COMPLETE_BOARD_TO_RANK" }`, from aggregation on `message: "NOT_RANKED_INCOMPLETE"`. Users who completed after the last day's Bingo Batch was applied: until participation ends `"me": { "completed": true, "rank": null, "rewardAmount": null, "message": "RANK_FINAL_AT_ANNOUNCEMENT" }`, and from the aggregation stage the recalculated rank is given in `rank`. Completers outside the winning places: `"me": { "completed": true, "rank": 41, "totalCashback": "88.10", "rewardAmount": null, "message": null }`. Non-members, non-participants and users who lost their participating UID: `"me": null`. Screen copy for pre-open (`entries: []`): "Rankings Open When the Event Starts" (KO "랭킹은 참여 기간이 시작되면 공개돼요"); for the participation period with 0 completers (`totalCount: 0`): "No one has completed the board yet." (KO "아직 빙고판을 완성한 사람이 없어요") (REQ-130).

**Error codes**

| Status code | Error code | Condition |
|-----------|-----------|------|
| 404 | `BOARD_NOT_FOUND` | Nonexistent board, `SCHEDULED` (Scheduled), `ENDED`, `TERMINATED` |
| 400 | `VALIDATION_ERROR` | `page` is less than 1 |
| 404 | `RANKING_DISABLED` | Ranking OFF board |

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
| Eligibility = first registration date ≥ participation start date − 30 days AND no participation record on this board AND not an issue UID | API-003, API-004 | `UID_REGISTERED_TOO_EARLY`, `UID_ALREADY_PARTICIPATED` |
| Gauge accumulation = 30-day rule only (including participating UIDs); the participation record condition applies only at registration | JOB-01 | Internal rule |
| One participating UID per TUID per board | API-004 (DB unique constraint) | `ALREADY_PARTICIPATING` |
| Participation and cell checks only in the participation stage | API-004, API-006 | `PHASE_NOT_PARTICIPATION` |
| Amount cell: gauge ≥ target, atomic deduction | API-006 (row lock + single transaction) | `INSUFFICIENT_GAUGE`, `CELL_ALREADY_CHECKED` |
| Streak cell: activation required, no gauge used | API-006 | `STREAK_CELL_NOT_ACTIVATED` |
| Page 404 for Scheduled, Ended and Terminated | All user APIs | `BOARD_NOT_FOUND` |
| An issue UID cannot be the participating UID | API-003 (removed from list), API-004 | `UID_ISSUE_DESIGNATED` |
| The detail URL uses `benefitNo` | API-002 (`/benefits/{benefitNo}`) | Later calls use the `boardId` in the response |

---

## 7. Items to Confirm

> The items below were not decided at the PRD.md draft stage, so the API behavior could not be confirmed. Until confirmed, implement with the provisional behavior shown, with values parameterized.

| # | Item | Details to confirm | Provisional behavior (this document) | Related APIs |
|---|------|-----------|--------------------|----------|
| Q-01 | Notation of a period's "end date" | **Confirmed (2026-10-01)**: end date = the last day of the stage (inclusive through 23:59:59 UTC); the next stage starts at 00:00:00 UTC the next day. See 1.5 | Confirmed and applied | API-002, API-102, JOB-04 |
| Q-05 | Basis for the "current rank" right after Full Board | **Confirmed (2026-10-01, updated 2026-10-02)**: right after completion no rank is shown, only the "Rankings are updated daily" notice (no next update time). The rank is shown from the next ranking update. Exception (2026-10-02): completion after the last day's Bingo Batch was applied shows `RANK_FINAL_AT_ANNOUNCEMENT` ("You can check your final rank when the results are announced." + announcement date-time) until participation ends; it is reflected in the recalculation at aggregation start and finalized at announcement | Confirmed and applied | API-006, API-005, API-007, JOB-05 |
| Q-06 | "Vacant" display on the user leaderboard | **Confirmed 2026-10-05**: vacant rows are not shown, and rank numbers are not moved up (e.g., if 15th is vacant, 16th follows 14th) | Confirmed and applied. `VACANT` rows not returned | API-007 |
| Q-07 | Ranking place of completers forfeited, excluded or withdrawn after aggregation | **Confirmed (2026-10-01, updated 2026-10-12)**: completers forfeited (ownership transfer, issue UID designation), excluded or withdrawn after aggregation starts leave their place vacant (`VACANT`); lower ranks are not moved up. Completers withdrawn or reset during the participation period are removed from the ranking (not a vacant place). The user leaderboard is frozen during the aggregation stage and applies these at announcement | Confirmed and applied | API-007, API-106, JOB-03, JOB-07 |
| Q-08 | Excluded user's own screen | **Confirmed (2026-10-02)**: abuse exclusion is not disclosed to the user. No "Not eligible" notice state or text (we have no direct way to verify abuse, so exclusion after aggregation is used only for clear-cut cases). During the aggregation period, same as other participants. Announcement and payout periods (payout period only for ranking OFF): My Rewards amounts "-" (no credit notice), My Rank and the leaderboard "My Rank" row hidden, and that place's row is also not shown in the list (Q-06). No result emails, as before | Confirmed and applied. API-005 reward amounts and `ranking` are `null`; API-007 `me` is `null`. `participantStatus` is for internal distinction | API-003, API-005 |
| Q-09 | Criteria for batch "Delayed"/"Missed" | **Confirmed (2026-10-01, changed to the Bingo Batch basis on 2026-10-02, supplemented 2026-10-12)**: the subject is the Bingo Batch. Before judgment or running = `PENDING`; not completed by the Bingo Batch scheduled time + 3 hours = Delayed; not completed by 00:00 UTC of the next day = Missed (run stopped, late results not applied). The scheduled time is a setting (common to all exchanges) | Confirmed and applied | API-002, API-005, API-110, JOB-08 |
| Q-16 | Bingo Batch run time | Once, common to all exchanges, after the Bitget cashback batch (12:00 UTC). Exact time to be discussed with the backend (PRD Open Issue #BATCH) | Implemented as a setting; document examples use 12:30 UTC (not exposed in the user API) | API-110, JOB-01~03, JOB-08 |
| Q-11 | Fallback order when SEO is not entered for a language | **Confirmed (2026-10-01)**: if there is no value for the language, no other language is substituted; the TetherMax site's default meta and default preview image are used. Whether to add Simplified Chinese (SC) is Open Issue #SC | If there is no value for the language, `null` → site default meta. SC not supported | API-002, API-102, API-104 |
| Q-14 | Authentication integration method | **Confirmed (2026-10-01)**: user login and back-office permissions (Master/Operator/PM/CS) use the existing systems as is. The implementation method is decided by the development team | Confirmed and applied | All |
| Q-15 | Original TUID masking rule | **Confirmed (2026-10-01)**: same masking as the Global League (e.g., `99****76`, first 2 and last 2 characters shown). The Global League masking function is shared | Confirmed and applied | API-007 |
