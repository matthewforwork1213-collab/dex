# Functional Specification — Back Office Back-end

> English translation of `기능명세_백엔드_ko.md`. If the two differ, the Korean original prevails.

| Item | Content |
|------|------|
| Project name | TetherMax New Member Bingo Event (service name: MAX BOARD) |
| Date written | 2026-10-01 |
| Version | v1.8 (2026-10-12 consistency review applied (confirmed 2026-10-12; chapter 1 admin API server processing only. The common sections in chapters 2 and 3 are synchronized based on the user document): participating UID lost only through ownership transfer or issue UID, `resetReason` `OWNERSHIP_TRANSFER`/`ISSUE_UID` (`UNLINKED` removed), Reset (RESET) / Forfeited (FORFEITED) distinguished, admin leaderboard shows status immediately with ranks fixed, `vacantReason` organized, `BatchResult` `PENDING`, run stopped when confirmed as Missed, `recoveryState`, recovery recalculation scope, when `applied` is decided, `SOURCE_CORRECTED`, judgment time = time in the account DB history, history entry `UID_LOST_AFTER_PAYOUT` for UID changes after payout, `finalized`, `INVALID_IMAGE_REF`, top-level `VALIDATION_ERROR` + `fields[].code`, expected payout basis after confirmation, error check order and recovery stopped on termination, cache invalidation, session role, source document notation) / v1.7 (2026-10-07 PRD v0.11 and requirements v1.6 checked: no back-office change (menu location League/Board > MAX BOARD List already applied). User screen changes (REQ-116~123) are in the user documents; no common logic change) / v1.6 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, Ranking Reward total, by place and column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02 changes applied: batch recovery reason input removed, user screen times converted to local time, batch time notation cleaned up, email payout date shown as a UTC date, Bingo Batch introduced, next update time hidden from users reflected in the common logic, reward wording unified from "pay" to "credit", streak judgment confirmed for days when the Bingo Batch itself was missed and days when the cashback batch was not completed, completers after the last day's Bingo Batch reflected in the final ranking (common logic), difference between the aggregation ranking and the final ranking and recalculation at announcement marked as confirmed (common logic), ranking recalculated at aggregation start (common logic F-014, F-015, F-017; reflected in the API-106 ① Status leaderboard; the aggregation ranking differs from the final ranking only by vacant places), PRD v0.9 applied) |
| Audience | Admin API and batch back-end developers |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/백오피스/요구사항정의서_en.md, 분할문서/백오피스/API스펙_en.md, 03.구현문서/시스템정의서.md |

> This document is the reference document (no consolidated version; organized 2026-10-01).
> **Scope**: (1) server processing for the admin APIs (API-101~116) (2) common system logic F-012~F-020 (3) common notifications F-031~F-033.
> **The common sections (2) and (3) are duplicated with the same content in the user back-end document.** When editing, update both documents together.
> F-IDs keep the consolidated numbering from before the split. The same F-ID also appears in the front-end document; the front-end covers the screen and the back-end covers server processing.
> All date and time judgments are in **UTC** (API responses are also in UTC; the user screen is converted to the device's local time by the front-end, and the back-office screen shows UTC), and amounts are in **USDT** (decimal string with two decimal places, no floating point). Admin responses **do not mask** TUIDs or UIDs.
> **Development defaults for open items (2026-10-07)**: develop with the values below until they are decided, then update this document. Service name = 맥스보드 / MAX BOARD (#NAME); board background color = fixed TetherMax default blue with no back-office input (color change feature under review); large title at the top of the benefit detail = the admin-entered title (`<br />` line breaks applied); Bingo Batch run time = setting (example 12:30 UTC, #BATCH); SEO Simplified Chinese = not supported (#SC); images other than the banner = none (#IMG). "Ends Today" uses the device's local date (confirmed 2026-10-07).

---

## 1. Admin API Server Processing

### F-030. Permission Control (common to all admin APIs)

| Item | Content |
|------|------|
| Description | Restricts the MAX BOARD APIs with the existing back-office authentication and permission system. |
| Processing | The common authorization middleware checks the role (MASTER / OPERATOR / PM / CS). MASTER, OPERATOR, PM: all. CS: read (GET) only. **Change requests (create, edit, exclude, recover, terminate, image upload) and CSV return `403 FORBIDDEN_ROLE` for CS**. Without MAX BOARD menu permission, `403 FORBIDDEN` |
| Output | Button-enable values in read responses, such as `actions`, `excludable` and `recoverable`, reflect the requester's role (always false for CS). Buttons with no enable value in the response, such as [Create Board] and [Download CSV] on the list, are decided by the screen from the **role in the existing back-office session**, so the MAX BOARD API has no separate role field |
| Exceptions | Separately from disabling buttons on screen, the server rechecks the role on every change request |
| Related requirements | REQ-020, REQ-021, NFR-006 |

### F-021. Board List

| Item | Content |
|------|------|
| Description | Retrieves registered boards. |
| API | API-101 `GET /api/admin/maxboard/boards` (all roles) |
| Input | Filters (status, exchange, ranking ON/OFF), board name search term, page |
| Processing | Retrieves boards matching the conditions. Aggregates per board the number of participating UIDs, number of completers and expected payout (same basis as F-024) |
| Output | Board name (the stored title KO value as is; replacing `<br />` with a space is done on screen), exchange, current status (ENDED and TERMINATED distinguished), period, ranking, participating UIDs, completers, expected payout (same basis as F-024 API-105; after confirmation, based on the confirmed payout list) |
| Related requirements | REQ-012 |

### F-022. Board Creation

| Item | Content |
|------|------|
| Description | Registers a new board. It is **confirmed immediately on registration, with no draft save**. |
| API | API-102 `POST /api/admin/maxboard/boards`, API-115 (exchange list), API-116 (image upload) |
| Input | `confirmed`, 1 exchange, ranking ON/OFF, stage schedule (pre-open start date and each stage's end date), 9 cells (type and value), 7 rewards (Row 1~3, Column 1~3, Full Board), ranking tiers (ON only), content (title and subtitle KO/EN, banner, OG KO/EN, SEO in 6 languages) |
| Validation | `confirmed=true` required. 1 exchange (rejected if an array). Period: each stage's end date ≥ start date (one-day stages allowed, stages cannot be skipped), the end date is the last day of that stage (inclusive until 23:59:59 UTC), no date reversal, no upper limit on the total period, **no restriction on past dates** (all stages can be in the past), announcement end date required with ranking ON and prohibited with OFF. Cells: 9, cellNo 1~9 with no duplicates or gaps, amount cell target ≥ 0.01, streak cell N an integer ≥ 1 and not more than the number of participation days, type and value must match. All 7 rewards required, each at least 0.01 (0 not allowed). Ranking tiers: required with ON and prohibited with OFF, the first tier starts at 1st, next start = previous end + 1 (no gaps or overlaps), start ≤ end, amount per person at least 0.01 (0 not allowed). Content: title, subtitle (KO/EN) and banner required (stored as is including `<br />`, no character limit), OG and SEO optional. Images must be WebP and 5MB or less. Image IDs must be IDs uploaded through API-116, and their use (`purpose`) must match the input field (otherwise `INVALID_IMAGE_REF`). Amounts are decimal strings with two decimal places. Check order: permission (403) → `confirmed` → body validation. Body validation failures are returned at once as a **top-level `VALIDATION_ERROR`**, and the per-item codes (those in the list below other than `CONFIRMATION_REQUIRED` and `FORBIDDEN_ROLE`) are put in `details.fields[].code` (API Specification 1.3) |
| Processing | On save, stages are stored contiguously with next stage start date = previous stage end date + 1 day. The backend issues a new **benefit number (benefitNo)** for each board (used in the detail URL `/{lang}/max-board?benefitNo=`). Calculates the total cost per person (6 lines + Full Board), the number of winners (end rank of the last tier) and the ranking reward pool (Σ tier headcount × amount per person). The status right after creation is the stage at the current UTC time (`SCHEDULED` (Scheduled) if before the pre-open start date, confirmed 2026-10-05). Registrant and registration time are recorded |
| Output | boardId, benefitNo, current status, total cost per person, number of winners and reward pool, registration time and registrant |
| Error codes | Top-level: `CONFIRMATION_REQUIRED`, `VALIDATION_ERROR`, `FORBIDDEN_ROLE`. `details.fields[].code`: `INVALID_EXCHANGE`, `MULTIPLE_EXCHANGES_NOT_ALLOWED`, `INVALID_SCHEDULE`, `INVALID_CELLS`, `AMOUNT_CELL_MIN`, `STREAK_DAYS_MIN`, `INVALID_REWARDS`, `INVALID_AMOUNT`, `RANK_TIERS_REQUIRED`, `RANK_TIERS_NOT_ALLOWED`, `RANK_TIER_NOT_FROM_ONE`, `RANK_TIER_GAP`, `RANK_TIER_OVERLAP`, `CONTENT_REQUIRED`, `REWARD_AMOUNT_MIN`, `STREAK_DAYS_EXCEED_PERIOD`, `INVALID_IMAGE_REF` |
| Exceptions | The total cost per person is only calculated; amounts are not limited. Overlapping periods for the same exchange are not checked (operating principle). No preview or draft API. Registration with past dates is for testing, so no special handling is built for batches, alerts, confirmations or payouts that are already past (confirmed) |
| Related requirements | REQ-001~010, REQ-106 |

### F-023. Board Edit

| Item | Content |
|------|------|
| Description | Partially edits only the content of a registered board. |
| API | API-104 `PATCH /api/admin/maxboard/boards/{boardId}/content` |
| Input | Only the fields sent are applied: title and subtitle (KO/EN), banner, OG (KO/EN), SEO (6 languages) |
| Processing | If any amount/condition field (exchange, ranking ON/OFF, period, cells, rewards, ranking tiers) is present, **the whole request is rejected**. Title, subtitle and banner cannot be empty or null (stored as is including `<br />`). OG and SEO are deleted when null (site defaults used). Image ID validation is the same as F-022 (`INVALID_IMAGE_REF`). Check order: permission (403) → board exists (404) → ended state (`BOARD_CLOSED`) → locked fields (`LOCKED_FIELD_NOT_EDITABLE`) → body validation. Editor and edit time are recorded. **After saving, the user API (API-001, API-002) cache is invalidated** (API Specification 1.1 Caching) |
| Output | List of edited fields, edit time, editor |
| Error codes | `LOCKED_FIELD_NOT_EDITABLE`, `VALIDATION_ERROR` (including unsupported language keys; per-item `details.fields[].code`: `CONTENT_REQUIRED`, `INVALID_IMAGE_REF`), `FORBIDDEN_ROLE`, `BOARD_NOT_FOUND`, `BOARD_CLOSED` (ENDED, TERMINATED) |
| Related requirements | REQ-011, REQ-106 |

### F-024. Board Detail · Status

| Item | Content |
|------|------|
| Description | Provides the top summary and settings, status metrics and the admin leaderboard. |
| API | API-103 `GET .../boards/{boardId}`, API-105 `GET .../stats`, API-106 `GET .../leaderboard` |
| API-103 processing | Returns all settings and the summary (ENDED and TERMINATED can also be viewed). `editable.lockedSections` for showing locked items on the edit page. `actions.canEditContent` and `actions.canTerminate` reflect status and role (always false for CS; both false for ENDED and TERMINATED) |
| API-105 aggregation | Number of participating UIDs (cumulative, all statuses), number of active participants (PARTICIPATING), number of completers (PARTICIPATING), number of participants with at least 1 activated streak cell (PARTICIPATING), number of achievers per line (6 lines, PARTICIPATING), expected payout: Bingo = Σ(completed lines × amount per line), Full Board = completers × Full Board Reward, Ranking = sum of tier amounts by current rank (0 for vacant places), total. Expected payout covers PARTICIPATING only (RESET, EXCLUDED, WITHDRAWN, FORFEITED excluded; achievements of reset participation rows have disappeared and are not included). **After reward confirmation (JOB-05)** (announcement for ranking ON, payout period for ranking OFF), it is calculated from the confirmed payout list with `expectedPayout.basis=CONFIRMED` (`ESTIMATED` before confirmation). If ranking is OFF, the `expectedPayout.ranking` key is omitted |
| API-106 processing | Full ranking of completers (updated at each daily Bingo Batch and recalculated once at aggregation start to reflect all completers during participation, JOB-03, confirmed 2026-10-02), full TUID and UID shown. Full Board users withdrawn or reset during the participation period are removed from the ranking in the next Bingo Batch recalculation (not left vacant, confirmed 2026-10-12). Full Board users excluded for abuse, withdrawn or forfeited (ownership transfer, issue UID) **after aggregation starts** are not deleted but shown **immediately** as `VACANT` (`vacantReason` `EXCLUDED` / `WITHDRAWN` / `FORFEITED`; for `FORFEITED`, `resetReason` `OWNERSHIP_TRANSFER` / `ISSUE_UID`), with an expected Ranking Reward of 0. In this case `rank` and `totalCashback` stay fixed at the recalculated result (lower ranks are not moved up, confirmed 2026-10-12). The user leaderboard (API-007) stays fixed during aggregation, and vacant places are applied at announcement (for reference). `finalized` = `true` after reward confirmation (start of announcement). Last update time. Default page size 50 (max 100). Ranking OFF → `404 RANKING_DISABLED` |
| Exceptions | The leaderboard has no exclusion function (exclusion is F-028) |
| Related requirements | REQ-013, REQ-014, REQ-018, REQ-019 |

### F-025. Participant List · CSV

| Item | Content |
|------|------|
| Description | Retrieves the board's participants and exports them as CSV. |
| API | API-107 `GET .../participants`, API-108 `GET .../participants.csv` |
| Input | `q` (TUID or UID), `status` (comma-separated), `resetReason` (`OWNERSHIP_TRANSFER` / `ISSUE_UID`, applies to rows with status RESET or FORFEITED), `sort` (registeredAt default / rank / totalCashback), page |
| Processing | Retrieved per participation record (a user who selected a new UID after being reset by an ownership transfer or issue UID during the participation period has separate rows for the RESET record and the new record). Cumulative gauge = total cashback during participation (ranking basis), available gauge = cumulative − amount used on amount cells, number of checked cells, number of completed lines, completion time, current and longest streak, rank (ranking ON completers only), expected rewards (completed lines and Full Board + Ranking by current rank; `0.00` for statuses other than PARTICIPATING), status, reason (`resetReason`: `OWNERSHIP_TRANSFER` / `ISSUE_UID` when the status is RESET or FORFEITED, otherwise `null`). Status judgment (confirmed 2026-10-12): if the participating UID is lost during the participation period, `RESET` (a new UID can be selected); from aggregation start until before payout, `FORFEITED` (no rewards, ranking place left vacant); after payment (crediting), no status change (only the history entry `UID_LOST_AFTER_PAYOUT` is recorded). The judgment time is the time in the TetherMax account DB history. The Bingo Batch keeps checking account status (ownership transfer, withdrawal, issue UID) after the participation period until payout is complete (JOB-07). `excludable` = aggregation stage + PARTICIPATING + requester has change permission |
| CSV | All rows with the same filters (no pagination). `text/csv; charset=utf-8` + UTF-8 BOM, file name `maxboard_{boardId}_participants_{YYYYMMDD_HHMM}.csv`, times in UTC, amounts with two decimal places, full TUID and UID. **403 for CS** |
| Exceptions | No payout status column |
| Related requirements | REQ-015, REQ-016, REQ-019, REQ-021 |

### F-026. Participant Detail

| Item | Content |
|------|------|
| Description | Provides one participant's summary, 3×3 mini board and history. |
| API | API-109 `GET .../participants/{participantId}` |
| Processing | Summary (board, TUID, participating UID, registration time, cumulative and available gauge, current and longest streak, completed lines, completion time, rank, expected rewards, status, reason `resetReason`). If the status is EXCLUDED, exclusion info (handler, time, reason). Mini board states: CHECKED / OPEN (activated but unchecked streak cell) / UNCHECKED. History pagination (default 50) |
| History types | UID_REGISTERED (retroactive gauge) / BATCH_APPLIED / CELL_CHECKED / LINE_COMPLETED (reward amount) / BOARD_COMPLETED / STREAK_CELL_ACTIVATED / RESET (reason `OWNERSHIP_TRANSFER` / `ISSUE_UID`, participation period) / FORFEITED (reason `OWNERSHIP_TRANSFER` / `ISSUE_UID`, from aggregation start until before payout) / UID_LOST_AFTER_PAYOUT (same reasons, after payout, no change to status or paid amounts) / RECALCULATED (recalculation by recovery during participation, recovered batch date, before and after values) / SOURCE_CORRECTED (recovery after the participation period, only the source record corrected, not applied automatically) / EXCLUDED (handler and reason) / WITHDRAWN. The `at` of RESET, FORFEITED and UID_LOST_AFTER_PAYOUT is the time in the TetherMax account DB history. Each history entry has an executor (USER / SYSTEM / admin account) |
| Exceptions | Participant of another board → `404 NOT_FOUND`. History is not deleted |
| Related requirements | REQ-017, REQ-019 |

### F-027. Batch Status · Missed Batch Recovery Request

| Item | Content |
|------|------|
| Description | Provides this board's per-date **Bingo Batch** run results and accepts recovery requests for missed days (running that day's Bingo Batch again). The recovery logic itself is F-019. |
| API | API-110 `GET .../batches`, API-111 `POST .../batches/{batchDate}/recover` |
| API-110 processing | Per date in the participation period (up to dates whose scheduled time has passed): batch date, Bingo Batch scheduled time and run time, result (`PENDING` / `NORMAL` / `DELAYED` / `MISSING`, per the JOB-08 criteria), number of UIDs applied and cashback (based on the UIDs eligible for accumulation on this board). `PENDING` = before judgment or running. If that day's Bingo Batch has not finished by 00:00 UTC of the next day, **the run is stopped and confirmed as `MISSING`** (late results not applied, only [Recover], confirmed 2026-10-12). Recovery: `recoveryState` (`RUNNING` / `DONE` / `FAILED`, `null` if no recovery was requested), `recovered` (true if DONE), `recoveredAt`, `recoveredBy`. `result` stays `MISSING` even after recovery. `recoverable` = MISSING + `recoveryState` null or FAILED + change permission + not ENDED or TERMINATED (false after recovery is done) |
| API-111 processing | Check order: permission (403) → board exists (404) → ended state (`BOARD_CLOSED`) → `confirmed=true` → whether the target date's result is MISSING, the date is within the participation period and it has not been recovered yet (`BATCH_NOT_RECOVERABLE`) → whether recovery for the same date is already running (`BATCH_RECOVERY_IN_PROGRESS`) → run F-019 as an **asynchronous job**, return `202 Accepted` + jobId, `recoveryState=RUNNING`. `applied` is decided by the **stage at the time of the request**: during the participation stage `true` (gauges, streak records, streak cell activation and rankings recalculated; history `RECALCULATED` for affected participants. Checked cells, lines and Full Boards are user checks and do not change); from aggregation on `false` (source records saved only, not applied automatically, history `SOURCE_CORRECTED`, individual CS handling). If the board is terminated during the job, the recovery stops with `recoveryState=FAILED`. When recovery is done, the user API-002 (`batchDelayed`) and API-007 (when `applied=true`) caches are invalidated |
| Error codes | `CONFIRMATION_REQUIRED`, `VALIDATION_ERROR` (including other fields such as `reason`), `FORBIDDEN_ROLE`, `BOARD_NOT_FOUND`, `BATCH_NOT_RECOVERABLE` (not missed, outside the participation period, or already recovered), `BATCH_RECOVERY_IN_PROGRESS`, `BOARD_CLOSED`, `BATCH_SOURCE_NOT_FOUND` (fill it in the cashback system first, then retry) |
| Exceptions | Input is `confirmed` only. No recovery reason is accepted (changed 2026-10-02). Recovery can be run even after participation ends (source records corrected only, no recalculation. Participation-period data recovered after the participation period ends is not applied automatically and is handled individually through CS) |
| Related requirements | REQ-058, REQ-059 |

### F-028. Abuse Exclusion

| Item | Content |
|------|------|
| Description | Excludes selected participants entirely from reward payout during the aggregation period. |
| API | API-113 `POST .../exclusions`, API-112 `GET .../exclusions` |
| Input | `participantIds` (1 or more), `reason` (**required, cannot be blank**), `confirmed` |
| Processing | Check order: permission (403) → board exists (404) → ended state (`BOARD_CLOSED`, ENDED, TERMINATED) → stage = AGGREGATION (`EXCLUSION_NOT_IN_AGGREGATION`) → `confirmed`, reason and body validation → check that all targets are PARTICIPATING on this board (if any is not, **the whole request is rejected**, `PARTICIPANT_NOT_EXCLUDABLE`) → change the status to EXCLUDED, save the exclusion record (handler, time, reason), record EXCLUDED in the participant history → reflect VACANT on the admin leaderboard immediately (rank and total cashback fixed, lower ranks not moved up). The user leaderboard is fixed during aggregation, so the user API cache is not invalidated, and the change is applied at announcement |
| Output | Exclusion result (exclusionId, participantId, vacated rank), processing time, handler |
| Error codes | `EXCLUSION_REASON_REQUIRED`, `CONFIRMATION_REQUIRED`, `VALIDATION_ERROR`, `FORBIDDEN_ROLE`, `BOARD_NOT_FOUND`, `EXCLUSION_NOT_IN_AGGREGATION`, `PARTICIPANT_NOT_EXCLUDABLE` (`details.participantIds`), `BOARD_CLOSED` (ENDED, TERMINATED) |
| Exceptions | Exclusion per board. No rewards at all (Bingo, Full Board, Ranking). **No cancel API** |
| Related requirements | REQ-064~066 |

### F-029. Termination

| Item | Content |
|------|------|
| Description | Changes a board to TERMINATED immediately, at any stage. |
| API | API-114 `POST .../terminate` |
| Input | `confirmed` only. If other fields such as a reason are sent, `VALIDATION_ERROR` |
| Processing | Check order: permission (403) → board exists (404) → ended state (`ALREADY_TERMINATED`, `BOARD_CLOSED` (ENDED)) → `confirmed`. Status TERMINATED, terminator and time recorded → gauge accumulation, cell checks, ranking updates, stage transitions, reward confirmation, scheduled payouts and **batch recovery in progress (`recoveryState=FAILED`)** **all stop** → scheduled app pushes and emails canceled → user API-001, 002 and 007 caches invalidated (page 404 immediately, removed from the Benefits list) |
| Payout impact | Terminated before the payout period starts: nothing is paid. Terminated during the payout period: rewards already paid are not clawed back, and unprocessed payouts stop |
| Output | Previous status, TERMINATED, termination time, terminator, whether payout had started |
| Error codes | `CONFIRMATION_REQUIRED`, `FORBIDDEN_ROLE`, `BOARD_NOT_FOUND`, `ALREADY_TERMINATED`, `BOARD_CLOSED` (ENDED) |
| Exceptions | No notification, **no cancel API**. If terminated during the payout period, failed payouts and payouts being retried stop (confirmed). The full confirmation popup text is in Functional Specification (Front-end) F-029 |
| Related requirements | REQ-068~070, REQ-071 (see User Requirements Definition) |

### Other APIs

| API | Processing | Permission |
|-----|------|------|
| API-115 Exchange list | Target exchange selection list on the creation screen (code, name) | All |
| API-116 Image upload | Multipart upload, `purpose` BANNER / OG_KO / OG_EN, returns imageId, URL and size. **WebP only, max 5MB** (`INVALID_IMAGE` on violation). Recommended size to be set after the design is finalized. The returned imageId can be used in API-102 and 104 only for the input field with the same `purpose` (otherwise `INVALID_IMAGE_REF`) | MASTER / OPERATOR / PM |

---

## 2. Common System Logic (same as the user back-end document)

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

## 3. Common Notifications (same as the user back-end document)

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
