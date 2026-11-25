# Functional Specification — User Screen Back-end

> English translation of `기능명세_백엔드_ko.md`. If the two differ, the Korean original prevails.

| Item | Content |
|------|------|
| Project name | TetherMax New Member Bingo Event (service name: MAX BOARD) |
| Date written | 2026-10-01 |
| Version | v1.8 (2026-10-12 consistency review applied (confirmed 2026-10-12): user-initiated unlink concept removed, causes of losing the participating UID = ownership transfer and issue UID, `RESET` during the participation period / `FORFEITED` after aggregation starts and before payout / history only after payout, `resetReason` = `OWNERSHIP_TRANSFER` and `ISSUE_UID`, `UNLINKED_RESELECT_REQUIRED` → `RESELECT_REQUIRED` (F-003~F-006, F-016), reset = like a first-time visitor, achieved rewards forfeited, user leaderboard frozen during the aggregation stage, vacant places applied at announcement, completers withdrawn or reset during participation removed from the ranking (F-010, F-014, F-017), `BatchResult` `PENDING` added, run stopped when a miss is confirmed, `recovered` after recovery (F-019), `batchDelayed` defined and added to API-002 (F-002, F-006), judgment time = account DB history, account check continued until payout is complete, Slack Bingo Batch anomaly alert (F-031), push delayed past 03:05 (F-032), `rewards.achieved[]` structure, Ranking Reward credited right after the payout period starts (F-006, F-018), leaderboard cache, `me` and `rewardAmount`, `serverTime` excluded from cache, API-005 reloaded after a cell check, `PARTICIPATION_RESET` and `PARTICIPATION_INACTIVE` distinguished, recovery recalculation scope, timing of the `applied` decision, `SOURCE_CORRECTED` (F-019), recovery API = API-111, source documents notation) / v1.7 (2026-10-07 PRD v0.11 applied: API-002 `serverTime` (basis of the participation deadline countdown), no winner count above the leaderboard (REQ-117, REQ-052)) / v1.6 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, Ranking Reward total, by place and column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02 batch recovery reason input removed, user screen times shown converted to local time, batch time notation cleaned up, final winners leaderboard shown until the end of the payout period, email payout date shown as a UTC date, Bingo Batch introduced, `nextUpdateAt` removed and `dailyUpdateNotice` added in the user API, aggregation-stage leaderboard shows the last updated ranking, reward wording unified from "pay" to "credit", streak judgment confirmed for days when the Bingo Batch itself was missed and days when the cashback batch was not completed, leaderboard shows all winning places (all stages), exception for completion after the last day's Bingo Batch, ranking copy for non-completers changed to the polite informal style, post-participation screen for non-participants, after aggregation the streak shows only "Final Streak: ○ Days", difference between the aggregation ranking and the final ranking and recalculation at announcement confirmed, leaderboard pagination (10 rows per page, My Rank row pinned below the list) and showing only existing ranks when completers are fewer than winning places, non-members explicitly included in the post-participation non-participant screen, "Calculating" label confirmed, ranking recalculated at aggregation start (common logic F-014, F-015, F-017; the aggregation ranking differs from the final ranking only by vacant places), user API longest streak field marked as not used on screen, API-007 fixed at 10 rows per page (`size` parameter removed), PRD v0.9 applied) |
| Audience | User API and batch back-end developers |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/사용자/요구사항정의서_en.md, 분할문서/사용자/API스펙_en.md, 03.구현문서/시스템정의서.md, src/mockup/index.html (default screen V2, latest integrated user screen and back-office mockup, Vercel deployment) |

> This document is the reference document (no consolidated version; organized 2026-10-01).
> **Scope**: (1) server processing for the user APIs (API-001~007) (2) common system logic F-012~F-020 (3) common notifications F-031~F-033.
> **The common sections (2) and (3) are duplicated with the same content in the back-office back-end document.** When editing, update both documents together.
> F-IDs keep the consolidated numbering from before the split. The same F-ID also appears in the front-end document; the front-end covers the screen and the back-end covers server processing.
> All date and time judgments are in **UTC**, and amounts are in **USDT** (decimal string with two decimal places, no floating point). Date-times in API responses are returned in UTC ISO-8601, and the front-end converts them to local time on the user screen (NFR-011; the server does not convert).
> **Development defaults for open items (2026-10-07)**: develop with the values below until they are decided, then update this document. Service name = 맥스보드 / MAX BOARD (#NAME); board background color = fixed TetherMax default blue with no back-office input (color change feature under review, #COLOR); large title at the top of the benefit detail = the admin-entered title (`<br />` line breaks applied, #TITLE); Bingo Batch run time = setting (example 12:30 UTC, #BATCH); SEO Simplified Chinese = not supported (#SC); images other than the banner = none (the banner is only for the Benefits list card, #IMG). "Ends Today" uses the device's local date (confirmed 2026-10-07).
> **Implementation basis (confirmed 2026-10-12)**: mockup default screen (V2) layout + document rules (for copy and policy the documents prevail). **Terms**: achieved = the state of being expected to receive a reward through a completed line or Full Board (or a ranking place) (no money paid yet); paid (credited) = actually paid to the participating UID at the start of the payout period (Requirements Definition "Terms").

---

## 1. User API Server Processing

### F-001. Benefits List Retrieval

| Item | Content |
|------|------|
| Description | Returns the list of MAX BOARD cards to show in the Benefits list. |
| API | API-001 `GET /api/maxboard/boards` (public) |
| Input | `lang` |
| Processing | Retrieves only boards whose stage is PREVIEW~PAYOUT (excluding SCHEDULED, ENDED, TERMINATED). Sorted by newest registration (`createdAt` descending). If `lang=KO`, KO title and subtitle; otherwise EN |
| Output | Card list (boardId, benefitNo, exchange, stage, ranking ON/OFF, title, subtitle, banner URL, detail path, registration time). Title and subtitle are returned as stored, including `<br />` (REQ-107). The detail path is `/{lang}/max-board?benefitNo={n}` (same pattern as the Global League; the number is issued by the backend when the board is created) |
| Exceptions | Subject to public caching. Cache invalidation events: API Specification 1.1 "Caching" (stage change, content edit, termination, etc.). **Cache invalidated immediately on termination** (REQ-071) |
| Related requirements | REQ-057, REQ-071, REQ-075, REQ-085 |

### F-002. Benefit Detail Retrieval

| Item | Content |
|------|------|
| Description | Returns the detail composition matching the stage and ranking ON/OFF. No personalized information is included. |
| API | API-002 `GET /api/maxboard/boards/{boardId}` or `GET /api/maxboard/benefits/{benefitNo}` (public, identical response, includes `benefitNo`, confirmed 2026-10-05) |
| Input | `boardId`, `lang` |
| Processing | Computes per-stage `actions` (participationOpen, checkOpen) and `notice` (AGGREGATING / RESULT_ANNOUNCED / PAYOUT_IN_PROGRESS). For each stage period, provides `startDate`, `endDate` (last day, inclusive), `startAt` (start date 00:00:00Z), `endAt` (end date 23:59:59Z), `days` (end date − start date + 1). If ranking is OFF, the `ranking` key and the `ANNOUNCEMENT` stage are omitted from the response. `batchDelayed` (public, confirmed 2026-10-12) is computed with the same criterion as F-006 (can be true only in the participation stage) and used for the delay notice for non-members and on the leaderboard. `rewards.maxPerPerson` = 3 rows + 3 columns + Full Board Reward total (hero "Maximum Bingo Rewards", confirmed 2026-10-12) |
| Output | Board basic information, stage schedule, eligibility reference date (`uidRegisteredOnOrAfter` = participation start date − 30 days), 9-cell composition, the 7 rewards and the maximum amount per person, ranking tiers (ON), SEO, `batchDelayed`, server UTC time at response `serverTime` (basis of the participation deadline countdown, confirmed 2026-10-07). `serverTime` is excluded from the public cache and filled in on every response (if the cache setup makes this difficult, the `Date` response header is used instead, confirmed 2026-10-12) |
| Exceptions | Nonexistent board, SCHEDULED (Scheduled), ENDED, TERMINATED → `404 BOARD_NOT_FOUND`. Notes are fixed front-end copy and are not sent through the API (REQ-108). Subject to public caching; invalidation events: API Specification 1.1 "Caching" (including changes in the Bingo Batch delay state) |
| Related requirements | REQ-054~057, REQ-063, REQ-076, REQ-082, REQ-112, REQ-117, REQ-128 |

### F-003. Participation Eligibility Check

| Item | Content |
|------|------|
| Description | Determines the participation state of the logged-in TUID and returns the eligible UID list. |
| API | API-003 `GET /api/maxboard/boards/{boardId}/eligibility` (public, GUEST for non-members. `Cache-Control: private, no-store`) |
| Input | TUID from the authentication information, list of UIDs linked to the TUID (account system), the board's exchange and participation start date, per-board participation records |
| Processing | Eligible UID = a UID that satisfies **all** of the following. (1) currently linked to the requesting TUID (2) a UID of the board's target exchange (3) **first registration date in the TetherMax DB (UTC date) ≥ participation start date − 30 days** (including registration during participation; based on the first registration date even when linked again) (4) no participation record on **this board** (5) **not designated as an issue UID** (confirmed 2026-10-02). The TUID sign-up date is not considered. The same criterion (participation start date − 30 days) also applies during the pre-open stage (confirmed 2026-10-05). State determination: GUEST / PARTICIPATING (the current TUID has a PARTICIPATING, EXCLUDED or WITHDRAWN participation and still holds that participating UID) / RESELECT_REQUIRED (participating UID lost: the last participation is RESET or FORFEITED and there is no active participation, or the participating UID was lost through ownership transfer or issue UID designation after payment (crediting) and only the history remains, confirmed 2026-10-12) / NOT_REGISTERED (1 or more eligible UIDs) / NO_ELIGIBLE_UID (0). Users cannot unlink a UID themselves, so the only causes of losing the participating UID are ownership transfer and issue UID designation |
| Output | `state`, `exchange` (exchange code and name, for replacing `{exchange}` in screen copy), `eligibleUids` (**UIDs only**, no gauge returned), `actions.canRegister` (NOT_REGISTERED + PARTICIPATION stage), `actions.canReselect` (RESELECT_REQUIRED + PARTICIPATION stage + eligible UIDs ≥ 1). For RESELECT_REQUIRED, `resetUid` (the lost participating UID), `resetAt` (account DB history time), `resetReason` (`OWNERSHIP_TRANSFER` / `ISSUE_UID`, not used to branch the screen) |
| Exceptions | `404 BOARD_NOT_FOUND`, account system lookup failure → `503 SERVICE_UNAVAILABLE` |
| Related requirements | REQ-022~027, REQ-030, REQ-031, REQ-077, REQ-110, REQ-114, REQ-115 |

### F-004·F-005. Participating UID Registration and Reselection

| Item | Content |
|------|------|
| Description | Registers one eligible UID as the participating UID. Reselection after a reset (`RESET`) caused by losing the participating UID is handled by the same API. |
| API | API-004 `POST /api/maxboard/boards/{boardId}/participation` (login) body `{ uid, confirmed }` |
| Processing steps | 1) Stage = PARTICIPATION (including the last day) 2) Check the TUID's participation state on this board: reject if there is an active participation; reselect mode (`mode: RESELECT`) if there is only RESET. FORFEITED occurs only after aggregation starts, so it is rejected at 1) 3) Recheck the requested UID's eligibility (F-003 conditions 1~5) 4) Create the participation record (TUID, UID, registration time) — **the participation record is created at this point** 5) Link the gauge, streak record and streak cell activation history accumulated on that UID since the participation start date as is (retroactive). On reselection, the user starts on that board like a first-time visitor: cells, lines, Full Board, ranking and achieved rewards from the previous participation are not carried over (confirmed 2026-10-12) 6) Record `UID_REGISTERED` history (including the retroactive gauge value) |
| Concurrency | Unique constraints on `(boardId, uid)` and `(boardId, tuid, active)`, so only one of concurrent requests succeeds |
| Output | participantId, mode (NEW / RESELECT), uid, registration time, retroactive result (available gauge, current and longest streak (longest streak not used on the user screen), active streak cells, as-of date). The as-of date is for consistency checks and CS and is not shown on screen. The next update time is not provided (confirmed 2026-10-02) |
| Error codes | `VALIDATION_ERROR`, `CONFIRMATION_REQUIRED` (confirmed≠true), `UNAUTHORIZED`, `BOARD_NOT_FOUND`, `PHASE_NOT_PARTICIPATION`, `ALREADY_PARTICIPATING`, `UID_NOT_LINKED`, `UID_EXCHANGE_MISMATCH`, `UID_REGISTERED_TOO_EARLY`, `UID_ALREADY_PARTICIPATED` (including UIDs that came back to the original TUID and UIDs transferred from another TUID), `UID_ISSUE_DESIGNATED` (issue UID), `CONCURRENT_REQUEST` |
| Exceptions | There is no API to change the participating UID. Users who lost their participating UID after aggregation starts (forfeited) cannot reselect → no rewards |
| Related requirements | REQ-023~031, REQ-033, REQ-114 |

### F-006. My Board Status Retrieval

| Item | Content |
|------|------|
| Description | Returns the participant's cell states, gauge, streak, completed lines, next goal and delay status. |
| API | API-005 `GET /api/maxboard/boards/{boardId}/me` (login, no caching) |
| Processing | If not registered, RESET, FORFEITED or the participating UID was lost after payout, `participation: null` (no gauge returned). Cell state: checked → CHECKED. An unchecked amount cell is CHECKABLE if `availableGauge ≥ targetAmount`, otherwise LOCKED. An unchecked streak cell is CHECKABLE if it has activation history (kept even after the streak breaks), otherwise LOCKED. Outside the participation stage, all unchecked cells are LOCKED. `batchDelayed` (confirmed 2026-10-12): can be true only in the participation stage; true if (a) the most recent Bingo Batch is still not completed after the scheduled time + 3 hours (3 hours passed in `PENDING` = `DELAYED` in progress) or (b) there is an unrecovered `MISSING` for a date within the participation period. Once the batch completes, even late (the result stays `DELAYED`), (a) becomes false. `dailyUpdateNotice` (participation) indicates whether to show "Updated once a day" (KO "하루 한 번 업데이트돼요"): true during the participation stage before the last day's Bingo Batch is applied, false after the last day's Bingo Batch is applied and from the aggregation stage on (the next update time is not provided, confirmed 2026-10-02). `nextGoal` is the number of remaining cells in the incomplete line with the fewest remaining cells, and the total number of remaining cells. `rewards.achieved[]` (confirmed 2026-10-12) holds only Bingo Rewards and the Full Board Reward: item `type` (`LINE` / `FULL_BOARD`), `line` (ROW_1~ROW_3, COL_1~COL_3 for `LINE`; `null` for `FULL_BOARD`), `amount`. Ranking Rewards are not included (API-007 `me.rewardAmount`). `achievedTotal` = total of the list. If ranking is ON, `ranking` is included (non-completers get `rank: null`, with `message: COMPLETE_BOARD_TO_RANK` in the participation stage / `message: NOT_RANKED_INCOMPLETE` from aggregation on / completed but before the next ranking update: `rank: null`, `message: RANK_UPDATES_DAILY` / completed after the last day's Bingo Batch was applied: `rank: null`, `message: RANK_FINAL_AT_ANNOUNCEMENT` until participation ends (the rank is provided after the recalculation at aggregation start, confirmed 2026-10-02) / always `lastUpdatedAt` (not shown on screen)) |
| Prohibited | No cell recommendation or highlight information is returned |
| Output | participation (participation information, available gauge, streak, as-of date (not shown on screen), dailyUpdateNotice, batchDelayed, 9 cell states, completed lines, completion time, nextGoal, rewards (achieved rewards `achieved[]` and `achievedTotal`, rewardStatus EXPECTED / CONFIRMED, payout start date), ranking) |
| Exceptions | `UNAUTHORIZED`, `BOARD_NOT_FOUND`. Abuse-excluded (EXCLUDED) users are not told about the exclusion (no separate notice state, copy or message code, confirmed 2026-10-02). During aggregation, the response is the same as for regular participants. In the announcement and payout periods (the payout period for ranking OFF), `rewards.achieved[].amount` and `rewards.achievedTotal` are returned as `null` and `ranking` as `null`, and API-007 `me` is also returned as `null`. `participantStatus` is sent for internal distinction only; the front-end does not use it for screen branching |
| Related requirements | REQ-063, REQ-078~081, REQ-109, REQ-111 |

### F-007·F-008·F-009. Cell Check and Line/Full Board Judgment

| Item | Content |
|------|------|
| Description | Checks the cell the user chose, then immediately judges line and Full Board completion. |
| API | API-006 `POST /api/maxboard/boards/{boardId}/cells/{cellNo}/check` (login, no body) |
| Common checks | 1) Stage = PARTICIPATION 2) The requesting TUID's participation state = PARTICIPATING (no participating UID registered → `NOT_PARTICIPATING`; `RESET` or `FORFEITED` → `PARTICIPATION_RESET`; `EXCLUDED` or `WITHDRAWN` → `PARTICIPATION_INACTIVE`, confirmed 2026-10-12) 3) The cell is unchecked |
| Amount cell (F-007) | **Row lock** on the participation record → check `availableGauge ≥ targetAmount` → save **the gauge deduction and the check record in one transaction**. Even if other amount cells are checked concurrently, the total does not exceed the gauge |
| Streak cell (F-008) | Confirm that activation history exists (allowed if the history exists even when the current streak is broken) → save the check record. **No gauge change** |
| Completion judgment (F-009) | Among the 3 rows and 3 columns (no diagonals), find newly completed lines, record the **line completion time** and add them to the Bingo Reward targets. When all 9 cells are checked, record the **Full Board time**. Ranking ties are decided by the DB save (insert) order of this completion record; add to the Full Board Reward targets, and if ranking is ON, add to the ranking. Calculate the next goal |
| Output | Checked cell, gaugeUsed, availableGauge, newlyCompletedLines (line, reward amount, completion time), completedLines, boardCompleted, boardCompletedAt, fullBoardRewardAmount, nextGoal. On completion with ranking ON, `ranking` (`rank: null`, `message: RANK_UPDATES_DAILY`, no next update time. If completed after the last day's Bingo Batch was applied, `message: RANK_FINAL_AT_ANNOUNCEMENT`, confirmed 2026-10-02); on completion with OFF, payoutStartAt. The other cell states are not included in the response; the front end reloads API-005 after success (confirmed 2026-10-12) |
| Error codes | `INVALID_CELL`, `UNAUTHORIZED`, `BOARD_NOT_FOUND`, `PHASE_NOT_PARTICIPATION`, `NOT_PARTICIPATING`, `PARTICIPATION_RESET` (reset, forfeited), `PARTICIPATION_INACTIVE` (excluded, withdrawn), `CELL_ALREADY_CHECKED` (including the second of concurrent duplicate requests), `INSUFFICIENT_GAUGE`, `STREAK_CELL_NOT_ACTIVATED`, `CONCURRENT_REQUEST` (lock wait exceeded) |
| Exceptions | There is no cancel or move API. A single cell check has no reward. Rewards are only "registered as targets" here; confirmation and crediting are F-017 and F-018. The rank is not calculated right after completion. The rank is reflected after the next ranking update (F-014) (confirmed) |
| Data and history | Cell check time, line completion time and Full Board time are kept as DB history (NFR-003) |
| Related requirements | REQ-038, REQ-039, REQ-041, REQ-044~048, NFR-004 |

### F-010. User Leaderboard Retrieval

| Item | Content |
|------|------|
| Description | Returns the ranking of all winning places on a ranking-ON board (all stages, from 1st to `winnerCount`th) and my rank. |
| API | API-007 `GET /api/maxboard/boards/{boardId}/leaderboard` (public, `me` when logged in) |
| Processing | Reads the JOB-03 (F-014) calculation result. Only users who completed the board are included. Ranking: total cashback descending; for ties, the user whose completion record was saved to the DB first. **TUID masking is applied on the server** with the same rule as the Global League (e.g., `99****76`). The participation stage uses the daily Bingo Batch calculation result (completers withdrawn or reset during the participation period are left out). **In the aggregation stage, the ranking recalculated right after aggregation starts** (F-014, reflecting all completers during participation) is returned frozen as-is and no further updates are made (`finalized: false`; the screen shows it with "Calculating" (KO "집계 중"), confirmed 2026-10-02). Abuse exclusions, withdrawals and forfeitures that occur during the aggregation stage are also not reflected in the user response; they are applied at announcement (confirmed 2026-10-12). From the announcement on, the final ranking confirmed in F-017 is returned; vacant places (`VACANT`) are removed from `entries`, and the remaining rows keep their rank numbers (lower ranks are not moved up, confirmed 2026-10-05). The aggregation ranking differs from the final ranking only by places vacated this way (confirmed 2026-10-02). `rewardAmount` is, **in all stages**, the Ranking Reward tier amount for that rank (confirmed 2026-10-02). In the announcement and payout periods, the confirmed result with `finalized: true` (final winners leaderboard, screen label "Final Ranking" (KO "최종 순위")) is returned as is, and the result stays the same until the payout period ends (404). The next update time is not provided; only `dailyUpdateNotice` (same criterion as F-006) is provided. `lastUpdatedAt` is for internal and consistency checks and is not shown on screen (confirmed 2026-10-12). Pre-open returns `entries: []`. **`entries` contains all winning places in every stage: participation, aggregation, announcement and payout** (from 1st to `winnerCount`th, vacant rows excluded from the announcement on, only existing ranks if there are fewer completers) (confirmed 2026-10-02). `me` (confirmed 2026-10-12): `null` for non-members, users without a registered participating UID, and users who lost their participating UID (RESET, FORFEITED, lost after payout). Also `null` for abuse-excluded users in the announcement and payout periods. For participants, `me.message` follows the same criteria as F-006 `ranking.message` (`COMPLETE_BOARD_TO_RANK` / `NOT_RANKED_INCOMPLETE` / `RANK_UPDATES_DAILY` / `RANK_FINAL_AT_ANNOUNCEMENT`); completers outside the winning places (1st~`winnerCount`th) get `me.rewardAmount: null`. **Pagination (confirmed 2026-10-02)**: accepts only `page` (from 1, default 1) and slices `entries` at **a fixed 10 rows per page** (no `size` parameter, not user-adjustable). `totalCount` = number of rows to display (vacant places excluded from the announcement on). `me` is always provided regardless of the page. An out-of-range `page` returns `entries: []` |
| Output | lastUpdatedAt, dailyUpdateNotice, winnerCount, totalCount, page, size (always 10), finalized, entries (rank, status, tuidMasked, totalCashback, rewardAmount), me (completed, rank, totalCashback, rewardAmount, message). `winnerCount` is for the by-place popup and page calculation and is not shown as a total above the leaderboard (REQ-052, confirmed 2026-10-06) |
| Exceptions | `BOARD_NOT_FOUND`, ranking OFF → `404 RANKING_DISABLED`. Only logged-out requests use the public cache; logged-in requests contain `me`, so `Cache-Control: private, no-store` (confirmed 2026-10-12) |
| Related requirements | REQ-049~052, REQ-056, REQ-066, REQ-109, REQ-112 |

### F-011. SEO Meta Provision

| Item | Content |
|------|------|
| Description | Puts per-language SEO values in the API-002 response. |
| API | API-002 |
| Processing | Title, subtitle and OG in KO/EN. SEO title and description: the value for the requested language among 6 languages (KO/EN/VI/TC/RU/ID). **If not entered, `null`** → the front-end uses the TetherMax site default meta and default preview image. Requests for unsupported languages fall back to EN |
| Line breaks | `<br />` in the title and subtitle is returned as stored and rendered by the front-end (REQ-107). No character limit |
| Exceptions | SC (Simplified Chinese) not supported (Open Issue #SC) |
| Related requirements | REQ-085~087, REQ-107 |

---

## 2. Common System Logic (same as the back-office back-end document)

> F-012~F-020 below are the batch, judgment and payout logic used by both the user and back-office sides. They were carried over verbatim from the pre-split Functional Specification v1.3. For internal job details (JOB-01~11), also see Chapter 5 of `API스펙_en.md`.
>
> **Bingo Batch (introduced 2026-10-02)**: MAX BOARD does not use the exchange cashback batch (an existing TetherMax system, hereafter "cashback batch") directly; it has a **Bingo-only daily batch, the "Bingo Batch"**, that reads the cashback batch results. The Bingo Batch runs **once a day at a fixed time common to all exchanges** (a setting, after the latest cashback batch, Bitget at 12:00 UTC; the exact time is undecided, PRD Open Issue #BATCH) and updates F-012 (gauge), F-013 (streak record and streak cell activation) and F-014 (ranking) together in one run. Delay/miss judgment and recovery are all based on the Bingo Batch. The user screen does not show the next update time and shows "Updated once a day" (KO "하루 한 번 업데이트돼요") only during participation (confirmed 2026-10-02). The streak reference date is the **cashback batch date** (not the Bingo Batch run date).

### F-012. Bingo Batch: Cashback Application and Gauge Accumulation

| Item | Content |
|------|------|
| Description | The Bingo Batch reads the cashback batch results and adds them to the gauges of eligible UIDs on boards in progress. |
| Input | Cashback batch results in the TetherMax cashback DB (trading cashback per UID, cashback batch date), list of boards in progress |
| Trigger | The Bingo Batch scheduled time, once a day (a fixed time common to all exchanges, a setting, exact time undecided #BATCH). The cashback batch runs sequentially per exchange between 11:00 and 12:00 UTC every day (Bitget at 12:00 UTC because it has many UIDs) and is the source of the Bingo Batch |
| Processing | Only cashback brought in by Bingo Batches whose **run time** falls **within** the board's **participation period (from 00:00:00 UTC on the start date to 23:59:59 UTC on the end date)** is applied (including the last day's run). Each day's Bingo Batch brings in the cashback batch results completed that day and those that finished late after the previous day's Bingo Batch. Late cashback is **recorded under its original cashback batch date** (the streak is kept). Targets: all UIDs of the board's exchange whose **first registration date in the TetherMax DB ≥ participation start date − 30 days** (regardless of linking or participation registration, including non-member UIDs and **UIDs already participating**). The "no participation record on the same board" condition applies only at participation registration and is not used to decide accumulation targets. **No gauge or streak is recorded while the UID is designated as an issue UID** (that day's cashback is not accumulated, and the streak is judged as broken and restarts from 0. Recording resumes after the designation is lifted, and the designated period is not applied retroactively, confirmed 2026-10-02). Only cashback from trading is accumulated (Event Rewards excluded). Cumulative gauge += cashback, available gauge += cashback. Days with 0.01 or more applied are recorded as dates for streak judgment (F-013) A board with streak cells only still tracks the gauge (total cashback) as usual (the gauge card is not shown on screen), and the ranking basis (total cashback) is the same (confirmed 2026-10-05) |
| Output | Cumulative and available gauge per UID, per-board Bingo Batch run history (batch date, scheduled and run time, result, number of UIDs applied and cashback), per-participant batch application history |
| Exception handling | Bingo Batches run after the participation period are not applied: both when the last day's Bingo Batch is delayed and runs after 00:00:00 UTC of the next day, and when the last day's cashback batch finishes after that day's Bingo Batch and slips to the next day, nothing is applied (handled by CS). Data for a day on which the Bingo Batch was missed is not filled automatically by the next day's Bingo Batch; it is filled only with [Recover] in the admin ③ Batch tab (F-019, confirmed 2026-10-02). No gauge deduction or clawback. Application and recalculation are **completed before the next Bingo Batch** (NFR-002). Bingo Batch delay/miss judgment and alerts are covered by F-019 and F-031 |
| Related screens | Benefit detail, admin ③ Batch tab |
| Related API | Bingo Batch worker (internal, JOB-01) |
| Related requirements | REQ-022, REQ-023, REQ-025, REQ-034~037, REQ-114 |

### F-013. Streak Judgment and Streak Cell Activation

| Item | Content |
|------|------|
| Description | Calculates the number of consecutive days based on the cashback batch date and activates streak cells. Runs inside the Bingo Batch right after F-012. |
| Input | Cashback application dates per UID (F-012), list of N values of the board's streak cells |
| Processing | The streak reference date is the **cashback batch date** (not the Bingo Batch run date), and the judgment is made when the Bingo Batch runs. If there is cashback of 0.01 or more on the cashback batch date, current streak +1; otherwise it is reset to 0 (also reset to 0 on days designated as an issue UID, confirmed 2026-10-02). Update the longest streak (target UIDs are the same as the F-012 accumulation targets). Activate all streak cells with current streak ≥ N and **save the activation history** (kept even if the streak breaks later). Periods before participation registration and as a non-member are also calculated retroactively |
| Output | Current and longest streak (the longest streak is for internal records and admin display, not used on the user screen), streak cell activation history |
| Exception handling | Cells already activated are not deactivated by recalculation. If that exchange's cashback batch for the day has not finished when the Bingo Batch runs, that date is not treated as a break and is judged at the next Bingo Batch (late cashback is recorded under its original date, confirmed 2026-10-02). The cashback system provides per-exchange, per-date cashback batch completion status (confirmed 2026-10-02). A streak broken by a missed Bingo Batch is continued upon recovery (F-019) |
| Related screens | Benefit detail, participant detail |
| Related API | Bingo Batch worker (internal, JOB-02) |
| Related requirements | REQ-040, REQ-042, REQ-043, REQ-114 |

### F-014. Ranking Calculation

| Item | Content |
|------|------|
| Description | Calculates the ranking of completers on ranking-ON boards daily, and recalculates it once right after the aggregation stage starts. |
| Input | List of users who completed the board, each one's total cashback during participation (cumulative gauge), Full Board time |
| Processing | Runs daily inside the Bingo Batch right after F-013. Total cashback descending; for ties, the user whose Full Board record was saved (inserted) to the DB first. Completers withdrawn or reset (ownership transfer, issue UID designation) during the participation period do not leave a vacant place; they are removed from the ranking at the next calculation (confirmed 2026-10-12). Completers abuse-excluded, withdrawn or forfeited (ownership transfer, issue UID designation) after aggregation starts keep their places but are marked "vacant" (`VACANT`), and lower ranks are not moved up. The admin leaderboard shows this status immediately while ranks and total cashback stay fixed; the user leaderboard keeps the recalculated result during the aggregation stage and removes vacant rows at announcement (confirmed 2026-10-05, updated 2026-10-12). After the update, the last update time is recorded (the next scheduled update time is not exposed in the user API or screen, and the last update time is not shown on the user screen, confirmed 2026-10-02, 10-12). After the last day's Bingo Batch of the participation period is applied, the "Updated once a day" display flag (`dailyUpdateNotice`) is turned off. Expected Ranking Rewards are calculated with the rank tier table. **Recalculated once right after the aggregation stage starts** (triggered by the F-015 stage change, JOB-04 → JOB-03): since cell checks and participating UID registration are possible until participation ends (23:59:59 UTC), all users who completed during participation (including those who completed after the last day's Bingo Batch was applied) are reflected. No new cashback is applied; only the completer list is updated, and the total cashback and tie rules are the same. After the recalculation, the last update time is recorded and no further updates are made. This result is shown on the admin ① Status leaderboard and the user's aggregation-stage leaderboard (confirmed 2026-10-02) |
| Output | Ranking table, expected Ranking Rewards, last update time |
| Exception handling | Not run for ranking-OFF boards. The ranking reward pool has no carry-over with Bingo and Full Board Rewards |
| Related screens | User leaderboard, admin ① Status leaderboard |
| Related API | Bingo Batch worker (internal, JOB-03) |
| Related requirements | REQ-049~051, REQ-066 |

### F-015. Automatic Stage Transition

| Item | Content |
|------|------|
| Description | Changes the board stage automatically at 00:00 UTC. |
| Input | Per-board stage schedule, ranking ON/OFF |
| Processing | A 00:00 UTC scheduler performs the stage transitions. After registration and before pre-open starts, the board is Scheduled (SCHEDULED; 404 for users, not shown in the Benefits list) and changes to PREVIEW on the pre-open start date (confirmed 2026-10-05). 5 stages with ranking ON, 4 with OFF. At aggregation start, Slack alert (F-031) and ranking recalculation (ranking ON, F-014, confirmed 2026-10-02); at aggregation end (OFF) or announcement start (ON), reward confirmation (F-017); at payout period start, automatic crediting (F-018); at payout period end, the page returns 404 |
| Output | Current stage of the board |
| Exception handling | Transitions stop for terminated boards (F-029) |
| Related screens | All screens |
| Related API | Scheduler (internal) |
| Related requirements | REQ-053, REQ-057, REQ-069 |

### F-016. UID Ownership Transfer and Withdrawal Handling

| Item | Content |
|------|------|
| Description | Applies ownership transfer of the participating UID, issue UID designation and TUID withdrawal. Users cannot unlink a UID themselves, so there are two causes of losing the participating UID: ownership transfer (someone else takes it through ownership verification) and issue UID designation (confirmed 2026-10-12). |
| Input | Ownership transfer history, issue UID designation history and TUID withdrawal history in the account DB (all checked directly by MAX BOARD). The judgment time is **the time in the TetherMax account DB history** (confirmed 2026-10-12) |
| Processing | Check timing: on user requests (detail entry, participation registration, cell check), in the daily Bingo Batch (checking continues after the participation period **until payout is complete**, confirmed 2026-10-12), and right before reward confirmation (F-017) and crediting (F-018). Ownership transfer and issue UID designation are handled by the same rules, with the status decided by the history time: (1) within the participation period → reset (`RESET`, reason `OWNERSHIP_TRANSFER` / `ISSUE_UID`). The user becomes like a first-time visitor on that board (checked cells, lines, Full Board, ranking and achieved rewards are all detached from this TUID's progress). A new UID can be selected, and the new UID starts with its own gauge and streak history. A completer is removed from the ranking at the next Bingo Batch calculation (not a vacant place). However, even if the history time is within the participation period, if it is **detected after the recalculation at aggregation start**, it is handled as (2) forfeited so that ranks are not moved up again (confirmed 2026-10-12) (2) after aggregation starts and before payment (crediting) → forfeited (`FORFEITED`, same reasons). No new UID selection, no rewards, and a completer's ranking place is left vacant (3) after payment (crediting) → amounts already paid are not clawed back, participation status and paid amounts are not changed, and only the history is recorded. Rewards are paid only once, at the start of the payout period, based on the final state, so there is no double payment (confirmed 2026-10-12). A transferred participation does not move to the new TUID. Issue UIDs are excluded from the eligible UID list (F-003), and no gauge or streak is recorded during the designated period (F-012). Withdrawal: participation status `WITHDRAWN` on every board of that TUID, no rewards paid. Completers who withdraw during the participation period are removed from the ranking; withdrawal after aggregation starts leaves the ranking place vacant |
| Output | Participation status (reset `RESET` / forfeited `FORFEITED` / withdrawn `WITHDRAWN`) and reason (`resetReason`: `OWNERSHIP_TRANSFER` / `ISSUE_UID`, common to RESET and FORFEITED), history (reset `RESET`, forfeited `FORFEITED`, UID change after payout `UID_LOST_AFTER_PAYOUT`, including the account DB history time) |
| Exception handling | A transferred UID cannot rejoin the same board under the new TUID, nor when it comes back to the original TUID (no progress restored). Rejoining is not possible even if the issue UID designation is lifted |
| Related screens | Benefit detail, admin participant list |
| Related API | Account system event receipt (internal) |
| Related requirements | REQ-024, REQ-030~032, REQ-066, REQ-067, REQ-110, REQ-115 |

### F-017. Reward Confirmation

| Item | Content |
|------|------|
| Description | Confirms the rewards to be paid when aggregation ends. |
| Input | Line and Full Board achievement records, ranking result, exclusion list, withdrawal and forfeiture status |
| Processing | Confirmation timing: announcement start for ranking ON, aggregation end for OFF. For ranking ON, the final ranking is confirmed based on the ranking recalculated at aggregation start (F-014, reflecting all completers during participation) (confirmed 2026-10-02). The account status is checked again right before (F-016). Only participants with status PARTICIPATING are included (excluded, withdrawn, forfeited and reset participants are left out). Bingo Rewards (amount per line) + Full Board Reward + Ranking Reward (tier amount) are confirmed. Vacant ranking places are not paid. The aggregation ranking differs from the final ranking only by places vacated after aggregation starts through abuse exclusion, withdrawal or forfeiture; those places are left vacant and lower ranks are not moved up (confirmed 2026-10-02). The user leaderboard removes vacant rows from this confirmation on (confirmed 2026-10-12) |
| Output | Confirmed payout list (TUID, participating UID, amount per reward type) |
| Exception handling | No changes after confirmation. Confirmation stops on termination |
| Related screens | User announcement, admin status |
| Related API | Scheduler (internal) |
| Related requirements | REQ-046~048, REQ-056, REQ-065~067, REQ-109 |

### F-018. Automatic Reward Crediting

| Item | Content |
|------|------|
| Description | When the payout period starts, automatically credits the confirmed rewards to the amount paid to the participating UID. |
| Input | Confirmed payout list (F-017) |
| Processing | Right after the payout period starts, the MAX BOARD **Event Reward payout batch (new)** credits the Event Reward (USDT) to the amount paid to the participating UID at payout time (idempotent per credit). Bingo, Full Board and Ranking Rewards are all credited together right after the payout period starts (confirmed 2026-10-12). The account status is rechecked right before payout (F-016): ownership transfer or issue UID designation → `FORFEITED`, not paid; withdrawal → not paid. Ownership transfer or issue UID designation after crediting is complete is not clawed back; only the history is recorded, without changing participation status or paid amounts. The Bingo Batch keeps checking account status until payout is complete |
| Output | Payout result (backend) |
| Exception handling | Payout failures are handled by the backend (no admin screen). If terminated before the payout period starts, nothing is paid. If terminated during the payout period, unprocessed payouts (including those being retried) stop, and rewards already paid are not clawed back |
| Related screens | None |
| Related API | Event Reward payout batch (internal) |
| Related requirements | REQ-031, REQ-070, REQ-072, REQ-073, REQ-115 |

### F-019. Bingo Batch Delay/Miss Judgment, Missed Batch Recovery and Recalculation

| Item | Content |
|------|------|
| Description | Recovers a missed Bingo Batch by running it again and recalculates the related values. |
| Input | Target board and batch date for recovery, executor. Only a confirmation popup; **no reason is entered** (confirmed 2026-10-02) |
| Judgment | The subject is the **Bingo Batch** (not the cashback batch; one run common to all boards). Result values (`BatchResult`, confirmed 2026-10-12): `PENDING` (before judgment or running, within scheduled time + 3 hours), `NORMAL` (completed within scheduled time + 3 hours), `DELAYED` (not completed by scheduled time + 3 hours; if it then completes before 00:00 UTC of the next day, the result stays `DELAYED` and is applied), `MISSING` (not completed by 00:00 UTC of the next day). At 00:00 UTC of the next day, an unfinished run is **stopped and confirmed as `MISSING`**, and late results are not applied (filled only through [Recover]). The delay notice (`batchDelayed`, API-002 and API-005) is true in the participation stage while the batch is still not completed after the scheduled time + 3 hours, and while there is an unrecovered `MISSING` (F-006). Slack alerts: F-031 |
| Processing | **Runs that day's Bingo Batch again**: re-reads that day's data from the TetherMax cashback DB and applies it **as the missed day's batch record** → recalculates the gauge (F-012), streak record and streak cell activation (F-013) and ranking (F-014). Cell checks are made by the user, so checked cells, lines and Full Board do not change. Streaks broken by the miss are continued. After recovery, that date's row keeps the result `MISSING` and is marked `recovered=true`, `recoverable=false` (cannot be recovered again) (confirmed 2026-10-12). Whether the recalculation is applied (`applied`) is decided by **the stage at the time of the recovery request**: requested during the participation period → recalculation applied; requested after the participation period ends → only the source records are corrected, recorded with history type `SOURCE_CORRECTED` (confirmed 2026-10-12) |
| Output | Recalculation result, recovery/recalculation history (target UIDs, recovered batch date, before and after values, executor, time) |
| Exception handling | Streak cells already activated and cells already checked are kept. **Recovery can still be run after participation ends, but it only corrects the source records and is not applied automatically** (`SOURCE_CORRECTED`; CS handles each case individually with the existing manual payout feature). If the source data is missing, the cashback system fills it first, then recovery is run. On termination, a recovery in progress is also stopped |
| Related screens | Admin ③ Batch tab |
| Related API | API-110 (batch result lookup), API-111 `POST /api/admin/maxboard/boards/{boardId}/batches/{batchDate}/recover` (recovery, back-office API Specification) |
| Related requirements | REQ-058~063 |

### F-020. Winner and History Retention

| Item | Content |
|------|------|
| Description | Keeps the winner history and all other history permanently. |
| Input | Payout results; cell check, line completion, streak activation, reset, forfeiture, UID change after payout, recalculation, source correction and exclusion history |
| Processing | Kept with no delete function. Retained even after the page returns 404 |
| Output | History data (for future use targeting winners) |
| Exception handling | None |
| Related screens | Admin participant detail |
| Related API | Internal |
| Related requirements | REQ-061, REQ-074 |

---

## 3. Common Notifications (same as the back-office back-end document)

### F-031. Operations Slack Alerts

| Item | Content |
|------|------|
| Description | Notifies the operations channel of aggregation start and Bingo Batch issues. |
| Input | Stage transition event, Bingo Batch result (JOB-08) |
| Processing | One alert per board when the aggregation period starts. Bingo Batch anomaly alerts (confirmed 2026-10-12): one alert unit = one Bingo Batch run (common to all boards). Once on entering delay (not completed by scheduled time + 3 hours, `DELAYED`), once when a miss is confirmed (00:00 UTC of the next day, run stopped, `MISSING`), and immediately on detecting a run error |
| Output | Slack message (aggregation start: board name, exchange, content / Bingo Batch anomaly: batch date, scheduled and run times, anomaly type (delay / miss / run error), list of affected boards) |
| Exception handling | No alerts on termination |
| Related screens | None |
| Related API | Slack Webhook (internal) |
| Related requirements | REQ-088, REQ-089 |

### F-032. Automatic App Push

| Item | Content |
|------|------|
| Description | Sends app pushes automatically according to the confirmed rules. The copy uses the confirmed FCM sheet ([FCM and email copy sheet](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877)). |
| Input | Board schedule, user marketing consent, participation status, whether the user has an eligible UID, completion status, number of remaining cells |
| Processing | Open preview (pre-open start date 02:10, all consenting users), Open (participation start date 02:20, all consenting users) — the copy of these two pushes does not include the new-UID condition; join reminder, eligible (D-7·D-3 02:30, no participating UID registered (including users who have not chosen a new UID after a reset (ownership transfer, issue UID designation)) + has an eligible UID); join reminder, not eligible (D-7·D-3 02:40, same not-registered criterion + no eligible UID); completion reminder (D-7·D-3 02:50, participating + not completed). D-n is counted from the last day of participation (participation end date). Marketing consent is rechecked at send time Use the marketing-revised copy in the copy sheet (the column next to the original) if present; otherwise the original copy. The participation reminder (no eligible UID) tells users they can participate by registering a new UID during the participation period |
| Output | FCM push (destination: benefit detail) |
| Exception handling | If the send date is outside the participation period or on the same day as the Open push, that round is not sent. Completers are excluded from the reminders. When the same type applies to several boards on the same day, they are delayed 5 minutes each in registration order; if this collides with the next push type, the later type is pushed back too to keep 5-minute intervals. A gap of at least 5 minutes is also kept from existing pushes: if a delayed time cannot keep a 5-minute gap from the existing 03:00 UTC pushes (quiz, points) (later than 02:55 and earlier than 03:05), it **moves to 03:05 or later** and the 5-minute delays continue from there (confirmed 2026-10-12). On termination, later sends are canceled |
| Related screens | None |
| Related API | FCM sending (internal) |
| Related requirements | REQ-090~094 |

### F-033. Automatic Result Email

| Item | Content |
|------|------|
| Description | Notifies reward confirmation and ranking wins by email. The copy uses the email tab of the [FCM and email copy sheet](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877). |
| Input | Confirmed payout list, email marketing consent |
| Processing | Reward confirmation notice (ranking ON: announcement start date, OFF: payout period start date, 06:00, Bingo and Full Board Reward recipients). Ranking win congratulations (announcement start date 06:10, Ranking Reward recipients). The two emails are sent separately. Since the recipient's device time is unknown, the payout date in the body is **shown as a UTC date** (e.g., 2026-10-31 (UTC)) Subject lines come from the copy sheet (the marketing-revised column if present) |
| Output | Email (achieved reward list and payout date / rank, Ranking Reward and payout date) |
| Template structure | Same structure as existing TetherMax system emails (600px wide, table-based layout, inline styles): (1) top banner (TetherMax logo + event image) (2) title (H1) (3) highlight box (reward confirmation: confirmed reward total / ranking win: rank and Ranking Reward) (4) body text (5) detail table (reward confirmation: achieved rewards and amounts / ranking win: rank, total cashback, Ranking Reward) (6) payout date (UTC date) (7) button (go to the benefit detail) (8) divider (9) social icons (10) footer (no-reply notice, account inquiry notice, unsubscribe, copyright). The customer support, unsubscribe and social links in the footer use the same addresses as existing TetherMax system emails (confirmed 2026-10-07). No "If you need further assistance, please contact Customer Support" notice under the body (confirmed 2026-10-07). Languages KO/EN; placeholders such as `{exchange}` and `{rank}` follow the copy sheet. Outline HTML: `03.구현문서/이메일템플릿/` (final design converted to HTML after the Figma design is confirmed). The sheet has subject lines only, so the body copy is a draft that needs marketing review. Tracking (link parameters, etc.) to be added later |
| Exception handling | Not sent to excluded or withdrawn users. Canceled on termination. Not sent to users without email marketing consent |
| Related screens | None |
| Related API | Email sending (internal) |
| Related requirements | REQ-095~097 |
