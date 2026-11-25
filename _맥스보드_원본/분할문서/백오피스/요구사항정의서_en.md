# Requirements Definition — Back Office

> English translation of `요구사항정의서_ko.md`. If the two differ, the Korean original prevails.

| Item | Content |
|------|------|
| Project name | TetherMax New Member Bingo Event (service name: 맥스보드 / MAX BOARD) |
| Date written | 2026-10-01 |
| Version | v1.7 (2026-10-12 consistency review applied (confirmed 2026-10-12): concept of users unlinking a UID themselves removed; the participating UID is lost only through ownership transfer or issue UID designation, Reset and Forfeited states distinguished and the terms achieved / paid (credited) defined, admin leaderboard shows status immediately with ranks fixed, Full Board users withdrawn or reset during participation removed from the ranking, Bingo Batch PENDING and run stopped when confirmed as Missed, recovery recalculation scope organized, stages where termination is allowed, chapter 5 #SC added and development defaults unified, source document notation, notation for REQ references to the user document) / v1.6 (2026-10-07 PRD v0.11 applied: back-office menu location (REQ-012), Open Issue #NAME. User screen changes (REQ-116~123) are in the user document) / v1.5 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, Total Ranking Rewards / Ranking Rewards by Place / leaderboard column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02 changes applied: batch recovery reason input removed, user screen times converted to local time, email payout date in UTC date format, UTC wording exception in Notes stated, Bingo Batch introduced, reward wording unified from "pay" to "credit", manual recovery for days the Bingo Batch itself was missed and streak judgment for days the cashback batch was not completed confirmed, users who completed after the last day's Bingo Batch reflected in the final ranking (common logic), difference between the aggregation ranking and the final ranking and recalculation at announcement marked as confirmed (common logic), ranking recalculated at aggregation start (all completers during participation reflected, shown on the ① Status leaderboard; the aggregation ranking differs from the final ranking only by vacant places) (common logic), PRD v0.9 applied) |
| Audience | Back-office developers |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 03.구현문서/맥스보드_어드민_목업_20261002_1247.html, src/mockup/index.html (default screen V2, latest combined mockup, Vercel deployment) |

> This document is the reference document (no merged version, organized 2026-10-01).
> **Scope**: back-office-only requirements (AD) + system logic (SYS) + notifications (NTF). SYS and NTF are common logic without screens, so they are **duplicated with the same content in both the User and Back Office documents**. User-screen-only requirements are in `분할문서/사용자/요구사항정의서_en.md`.
> **ID rule**: REQ numbers keep the merged numbering from before the split (skipped numbers are requirements of the other part).
> **Type**: FR = user screen (front-end), AD = admin (back office), SYS = system logic (batch, judgment, payout), NTF = notification.
> All period and date judgments are **based on UTC**, and rewards are in **USDT**. The back-office screen shows UTC, and the user screen shows times converted to device local time (NFR-011).
> REQ numbers marked **"(see User Requirements Definition)"** are not in this document and are in `분할문서/사용자/요구사항정의서_en.md`.

**Terms (confirmed 2026-10-12)**

| Term | Definition |
|------|------|
| Achieved | The state of a completed line (Bingo Reward), a Full Board (Full Board Reward) or a place within the ranking. The reward is **only due**; no money has been paid yet. The "expected reward / expected payout" on admin screens is the amount based on achievements |
| Paid (credited) | Actually crediting the rewards confirmed at the start of the payout period to the amount payable to the participating UID. Rewards are paid only once, at the start of the payout period, based on the final state |
| Losing the participating UID | Users cannot unlink a UID themselves. A participating UID is lost for only two reasons: **ownership transfer** (another person takes the UID through ownership verification) and **issue UID designation** (withdrawal is a separate state). The time of the judgment is the time in the TetherMax account DB history |
| Reset (`RESET`) | The participating UID is lost during the participation period. The user becomes **like a newcomer** on that board (checked cells, lines, Full Board, ranking and achieved rewards all disappear). A new UID can be selected, and the new UID starts with its own gauge. Reason `OWNERSHIP_TRANSFER` / `ISSUE_UID` |
| Forfeited (`FORFEITED`) | The participating UID is lost from the start of aggregation until before payout. No rewards; if the user has a Full Board, the ranking place is left vacant. Reason `OWNERSHIP_TRANSFER` / `ISSUE_UID` |
| UID change after payout | Ownership transfer or issue UID designation after payment (crediting). Amounts already paid are not taken back, and the original TUID's participation status and paid amounts are not changed; only the history is kept |

---

## 1. Functional Requirements

### 1.1 Board Creation · Operations (Admin)

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-001 | AD | Admins can create a board. One board corresponds to one exchange. | Must | Only one exchange can be selected at creation. Multiple exchanges cannot be selected |
| REQ-002 | AD | Several boards can be run at the same time. | Must | Two or more boards with overlapping periods each run independently (the system does not block overlapping periods for the same exchange; managed as an operating principle). Opening boards for the same exchange with overlapping participation periods would let the same UID earn rewards twice from the same cashback, so operations avoids overlaps |
| REQ-003 | AD | Ranking Reward ON/OFF is decided when the board is created. | Must | Once ON/OFF is selected and the board is registered, it cannot be changed |
| REQ-004 | AD | Set the dates of the period stages (Pre-open → Participation → Aggregation → Announcement → Payout). With ranking OFF, there are 4 stages without Announcement. | Must | Only the first stage's start date is entered directly; later stage start dates are set automatically to the day after the previous stage's end date. The end date is the stage's last day (inclusive to 23:59:59 UTC); days = end date − start date + 1 (one-day stages allowed). End date and days are linked when entered. Stages cannot be skipped. No upper limit on the total period. No restriction on past dates. With ranking OFF, the announcement row is hidden. No stage can be skipped; to effectively skip pre-open, set the pre-open date to yesterday |
| REQ-005 | AD | Set the type (amount cell / streak cell) and value (target cashback USDT / streak days N) for each of the 3×3 cells. | Must | Type and value are required for all 9 cells. No limit on the count or position of each type (all 9 cells can be streak cells). Amount cell minimum 0.01; streak cell minimum 1 day and maximum the number of participation period days (registration blocked if exceeded). If all 9 cells share the same N, the board can be completed at once on day N, so balancing is the operator's judgment |
| REQ-006 | AD | Set different reward amounts for rows 1·2·3, columns 1·2·3 and the Full Board. | Must | 7 amounts entered individually (each minimum 0.01, 0 not allowed, up to two decimal places). Row rewards are placed to the right of each row, column rewards below each column, and the Full Board Reward to the right of the board |
| REQ-007 | AD | Show the cost per user total (6 lines + Full Board) automatically. | Must | Recalculated immediately when reward amounts change. Amounts are not forcibly limited (operating guide). Operations guideline: keep the per-user maximum reward (6 lines + Full Board) below TetherMax's share generated by that user completing the board |
| REQ-008 | AD | For ranking ON boards, set amounts per rank tier and the number of winners. | Must | Tiers (from rank, to rank, amount per person) can be added. Amount per person minimum 0.01 (0 not allowed). Number of winners and ranking reward pool total calculated automatically. Registration blocked if tiers overlap or leave rank gaps. Section hidden with ranking OFF |
| REQ-009 | AD | Enter title/subtitle (KO/EN), banner image, OG image (KO/EN), and SEO title/description (KO/EN/VI/TC/RU/ID). | Must | The title and subtitle are used as the Benefits title and subtitle. **Title, subtitle and banner image are required**; all SEO info (including the OG image) is optional, and if not entered the site's default meta and default preview image are used. No character limit. Banner and OG images are WebP, up to 5MB. Notes are not entered (the fixed text common to all boards is shown automatically, REQ-108 (see User Requirements Definition)) |
| REQ-010 | AD | Pressing [Register] confirms the board, with no draft saving. | Must | A confirmation popup is shown before registration ("Once registered, the exchange, ranking ON/OFF, periods, cell conditions and reward amounts cannot be changed…", KO "등록하면 거래소, 랭킹 ON/OFF, 기간, 칸 조건, 리워드 금액은 수정할 수 없습니다…"). Confirmed immediately on confirmation |
| REQ-011 | AD | After registration, only content (title/subtitle, SEO, images) can be edited. When editing, the title/subtitle (KO/EN) and banner are still required (confirmed 2026-10-05). Ended or terminated boards cannot have their content edited either. | Must | The edit page is separate from the create page. Amount/condition sections (①–④) are dimmed, hatched and labeled "Locked · Cannot Edit" (KO "잠김 · 수정 불가") and cannot be entered; only ⑤ Content · SEO is highlighted and editable |
| REQ-106 | AD | Line breaks can be set by entering `<br />` in the title/subtitle (KO/EN) fields. | Must | Supported on both create and edit. The input is saved as is, including `<br />` (`<br/>` and `<br>` also accepted). Not applied to SEO or OG fields. A line break usage guide is shown next to the field. No character limit |
| REQ-012 | AD | View the board list. | Must | Filters (status, exchange, ranking, name search). Status includes "Scheduled" (KO "노출 전", after registration and before pre-open starts) (confirmed 2026-10-05). Columns: board name, exchange, current status, period, ranking, participating UIDs, Full Board users, expected payout Menu location: League/Board > MAX BOARD List (after Global League List and Global League Team List; the existing "League" menu is renamed "League/Board") (confirmed 2026-10-05) |
| REQ-013 | AD | View operating metrics in the top summary and the Status tab of the board detail. | Must | Top summary: board name, current status, exchange, ranking, stage periods, cost per user total, [Edit] and [Terminate] buttons. Status tab: participating UIDs, Full Board users, streak cell activations, completions per line (6 lines), expected payout (Bingo, Full Board, Ranking, total; Ranking based on current ranks) |
| REQ-014 | AD | For ranking ON boards, view the leaderboard in the detail. | Must | Columns: rank, TUID (full), total cashback, Full Board time, status (Normal / Excluded · Vacant), expected Ranking Reward. Updated after each daily Bingo Batch, recalculated once at aggregation start (all completers during participation reflected, confirmed 2026-10-02). Last update time shown. Selecting a row opens the participant detail. The leaderboard has no exclusion function. If an abuse exclusion, withdrawal or forfeiture occurs after aggregation starts, the row's status changes **immediately** to "Excluded · Vacant", while the rank and total cashback stay fixed at the recalculated result (lower ranks are not moved up). Note: the user leaderboard stays fixed at the recalculated result during the aggregation stage, and vacant places are applied at announcement (confirmed 2026-10-12). Full Board users withdrawn or reset during the participation period are not left vacant; they are removed from the ranking in the next Bingo Batch recalculation (confirmed 2026-10-12). Final ranks are shown from the announcement stage |
| REQ-015 | AD | View the participant list. | Must | Search (TUID, UID), status filter (including reason filter). Columns: select, TUID, participating UID (full), registered at, total / available gauge, checked cells, completed lines, Full Board time, current / longest streak, rank, expected reward, status (Participating / Reset / Forfeited / Excluded / Withdrawn). No payout status column. Reset (participating UID lost during participation) and Forfeited (participating UID lost from aggregation start until before payout) are shown with the reason: "Reset (Ownership Transfer)" / "Reset (Issue UID)" / "Forfeited (Ownership Transfer)" / "Forfeited (Issue UID)" (confirmed 2026-10-12). A user who selected a new UID after a reset appears in two rows, one for the previous participation and one for the new participation |
| REQ-016 | AD | Download the participant list as CSV. | Must | Master/Operator and PM only; not CS |
| REQ-017 | AD | View one participant's board state and history on the participant detail page. | Must | Separate page. Summary, 3×3 mini board (checked / opened / unchecked), history (UID registration, batch applied, cell checked, line completed, Full Board, streak activated, reset, forfeited, UID change after payout, recalculated, source corrected, excluded, withdrawn). Reset, forfeited and UID-change-after-payout history entries show the reason (ownership transfer / issue UID) and the time in the account DB history |
| REQ-018 | AD | Check the expected payout in real time on the operating status. | Must | Since there is no headcount limit, per-board achievement counts and expected payout are updated and shown. The expected payout is based on the achievements of participants with the status "Participating". After rewards are confirmed (announcement for ranking ON, payout period for ranking OFF), it is based on the confirmed payout list |
| REQ-019 | AD | The back office does not mask TUIDs or UIDs. | Must | Shown in full in the list, leaderboard and participant detail. Masking applies only to the user leaderboard |

### 1.2 Permissions

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-020 | AD | Master/Operator and PM can use all functions. | Must | Create, edit, abuse exclusion, batch recovery, termination and CSV all available |
| REQ-021 | AD | CS can only view. | Must | Can enter pages and view. Create, edit, abuse exclusion, batch recovery, termination and CSV buttons are disabled |

### 1.3 Eligibility · Participating UID

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-022 | SYS | Eligibility is judged by UID, not by TUID. | Must | The TUID sign-up time is not used for judgment |
| REQ-023 | SYS | Only UIDs registered in the TetherMax DB from 30 days before the participation start date can join. | Must | UIDs newly registered during the participation period can also join. Based on the UTC date. The reference date is the **first registration date in the TetherMax DB** (unchanged by relinking) |
| REQ-024 | SYS | A UID with even one participation record on a board cannot join that board again. | Must | No rejoining whether the UID moved to another TUID by ownership transfer, came back to the original TUID, or had its issue UID designation lifted (no progress restored). No restriction on other boards |
| REQ-025 | SYS | A participation record is created when the user registers (selects) the UID as the participating UID. | Must | Automatic gauge accumulation alone does not create a participation record |
| REQ-031 | SYS | If the participating UID is lost (ownership transfer, issue UID designation) after aggregation starts and before payment (crediting), it is processed as forfeited (`FORFEITED`); a new UID cannot be selected and there are no rewards. | Must | No rewards paid to that user; if the user completed the Full Board, the ranking place is left vacant (REQ-066). If lost during the participation period, it is a reset (`RESET`, a new UID can be selected, REQ-030 (user Requirements Definition)). If lost after payment (crediting), amounts already paid are not clawed back, participation status and paid amounts are not changed, and only the history is recorded. The judgment time for reset and forfeiture is the time in the TetherMax account DB history (confirmed 2026-10-12) |
| REQ-032 | SYS | Even if UID ownership is transferred, participation does not move to the new TUID. | Must | Progress is not shown on the new TUID. The original TUID is reset during the participation period (`RESET`, reason `OWNERSHIP_TRANSFER`) and forfeited after aggregation starts and before payout (`FORFEITED`, no rewards). Ownership transfer, withdrawal and issue UID designation are checked by MAX BOARD itself (on user requests, in the daily Bingo Batch (continuing after the participation period until payout is complete), and right before reward confirmation and crediting). The judgment time is the time in the TetherMax account DB history (confirmed 2026-10-12) |
| REQ-114 | SYS | A UID designated as an issue UID cannot be selected as the participating UID. | Must | Removed from the eligible UID list; registration requests are rejected (`UID_ISSUE_DESIGNATED`). Based on TetherMax's existing issue UID designation feature (confirmed 2026-10-02) |
| REQ-115 | SYS | If the participating UID in use is designated as an issue UID, it is handled exactly like an ownership transfer. | Must | During the participation period, reset (`RESET`, reason `ISSUE_UID`, a new UID can be selected); after aggregation starts and before payout, forfeited (`FORFEITED`, no rewards, ranking place left vacant for Full Board users); after payment (crediting), no clawback (history only). Even if the designation is lifted, the UID cannot rejoin the same board. No gauge or streak is recorded during the designated period (no retroactive application). The user screen shows the same notice as for an ownership transfer (reason not shown) (confirmed 2026-10-02, updated 2026-10-12) |

### 1.4 Gauge · Cells

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-034 | SYS | The gauge reflects only cashback from trading. | Must | Other sources such as Event Rewards are excluded |
| REQ-035 | SYS | Once the participation period starts, the gauge of eligible UIDs accumulates automatically. Non-member UIDs are also recorded. | Must | When the participating UID is registered, the gauge accumulated since the participation start date is already reflected (retroactive) |
| REQ-036 | SYS | The gauge reflects only cashback brought in by **Bingo Batches** run during the participation period (including the last day). The Bingo Batch is a MAX BOARD-only daily batch that reads the results of the cashback batch (the existing per-exchange daily batch); once a day, at a fixed time common to all exchanges (a setting, after the Bitget cashback batch, exact time undecided #BATCH), it updates the gauge, streak, streak cell activation and ranking together. | Must | Cashback arriving after the last day's Bingo Batch is not reflected. Not reflected if the last day's Bingo Batch is delayed and runs after 00:00:00 UTC of the next day, or if the last day's cashback batch finishes after that day's Bingo Batch and slips to the next day (handled by CS). On other dates, a cashback batch that finished late is recorded by the next day's Bingo Batch under the original cashback batch date |
| REQ-037 | SYS | A gauge already filled is not clawed back. | Must | No gauge decrease |
| REQ-040 | SYS | A streak cell is activated when cashback is received on N consecutive days based on the cashback batch date. | Must | The reference date is the cashback batch date (not the Bingo Batch run date); judged when the Bingo Batch runs. No daily amount condition (counted if 0.01 or more is reflected). Retroactive. One streak opens all streak cells with N or lower. If that day's cashback batch has not finished at Bingo Batch time, the day is not judged as a break and is judged at the next Bingo Batch (confirmed 2026-10-02; the cashback system provides per-exchange, per-date completion status) |
| REQ-042 | SYS | A streak cell, once activated, is recorded in history and stays active even if the streak breaks. | Must | Checkable even if the streak breaks later |
| REQ-043 | SYS | If the streak breaks before a streak cell opens, the streak count restarts from 0. | Must | Current streak reset to 0; longest streak kept |

### 1.5 Rewards · Ranking

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-046 | SYS | Each time one of the 3 rows or 3 columns is completed, a Bingo Reward is given. There are no diagonals. | Must | Line completion time recorded in DB history. No headcount limit |
| REQ-047 | SYS | Checking all 9 cells gives the Full Board Reward. | Must | No headcount limit. Up to 7 rewards per user (6 lines + Full Board) |
| REQ-048 | SYS | There is no reward for checking a single cell. | Must | No per-cell payout |
| REQ-049 | SYS | On ranking ON boards, only Full Board users are ranked by total cashback during the participation period. | Must | Based on total cashback, independent of the amount spent on cells. Updated at each daily Bingo Batch. Completers who withdraw or are reset during the participation period do not leave a vacant place; they drop out of the ranking at the next Bingo Batch recalculation (confirmed 2026-10-12). **Recalculated once right after the aggregation stage starts (the 00:00 UTC stage change on the next day)** to reflect everyone who completed during participation (including users who completed after the last day's Bingo Batch). No new cashback is applied; only the completer list is updated, with the same total cashback and tie rules. The recalculated result is shown on the admin ① Status leaderboard and the user's aggregation-stage leaderboard (confirmed 2026-10-02). The user leaderboard stays frozen at the recalculated result during the aggregation stage, and places vacated in the meantime are applied at announcement; the admin leaderboard shows excluded, withdrawn and forfeited statuses immediately while ranks and total cashback stay fixed (confirmed 2026-10-12). At announcement it is finalized based on this ranking; the aggregation ranking and the final ranking differ only by places vacated after aggregation starts through abuse exclusion, withdrawal or forfeiture (ownership transfer, issue UID designation) (the place is left vacant and lower ranks are not moved up, confirmed 2026-10-02) |
| REQ-050 | SYS | On a ranking tie, the user who completed the board first ranks higher. | Must | Based on the order in which the Full Board record was saved (inserted) into the DB |
| REQ-051 | SYS | The ranking reward pool is run separately from Bingo and Full Board Rewards. | Must | No carry-over between them |

### 1.6 Period Status

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-053 | SYS | Stages change automatically at 00:00 UTC. | Must | Stage change time 00:00 UTC. After registration and before pre-open starts, the board is in the Scheduled state (user 404, not shown in Benefits, confirmed 2026-10-05). Periods on the user screen are converted to device local time (NFR-011) |

### 1.7 Batch · Recovery

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-058 | AD | View the per-date **Bingo Batch** run results of the board in the Batch tab of the board detail. | Must | Columns: batch date, run time, result (Pending · Running / Normal / Delayed / Missed), UIDs applied, cashback applied, recovery (run by, time, progress). Results are based on the Bingo Batch scheduled time (a setting): before judgment or while running = Pending · Running, not completed by + 3 hours = Delayed, not completed by 00:00 UTC of the next day = Missed. A run not finished by 00:00 UTC of the next day is **stopped and confirmed as Missed**, and late results are not applied (filled only with [Recover]). A recovered row keeps the result Missed, is shown as recovered, and cannot be recovered again (confirmed 2026-10-12) |
| REQ-059 | AD | Recover missed dates. | Must | [Recover] → confirmation popup (no reason input) → re-runs that day's Bingo Batch (re-reads that day's data from the TetherMax cashback DB, applies it as the missed day's batch record, and recalculates gauges, streak records, streak cell activation and rankings. Cell checks are made by users, so checked cells, lines and Full Boards do not change). Can be run even after the participation period ends; in that case the popup states that "participation-period data recovered after the participation period ends is not applied automatically and is handled individually through CS" (only the source record is corrected, no recalculation). Whether to recalculate is decided by the stage at the time of the recovery request. Master/Operator and PM only. Days on which the Bingo Batch itself was missed are not filled automatically by the next day's Bingo Batch and are filled only with this [Recover] (confirmed 2026-10-02) |
| REQ-060 | SYS | After recovery, recalculate the gauge, streak, streak cell activation and ranking. | Must | A streak broken by the miss continues. Cell checks are made by the user, so checked cells, lines and Full Board do not change, and streak cells already opened are kept. Whether to recalculate is decided by the stage at the time of the recovery request (if requested after the participation period ends, REQ-062) (confirmed 2026-10-12) |
| REQ-061 | SYS | Every recovery and recalculation is kept in history. | Must | Records the target UID, recovered batch date, values before and after, actor and time. No reason is entered on recovery (confirmation popup only) |
| REQ-062 | SYS | Participation-period data recovered after the participation period ends is not applied automatically. | Must | Only the source records are corrected (history type `SOURCE_CORRECTED`); gauge, streak, cells, lines, Full Board and ranking stay as they are. CS handles each case individually with the existing manual Event Reward payout feature |

### 1.8 Aggregation · Exclusion · Termination

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-064 | AD | During the aggregation period, exclude abusive users from the participant list. | Must | Button active only during the aggregation period. Only participants with the status "Participating" can be selected (confirmed 2026-10-05). Select participants → enter a reason → confirm "This cannot be undone" (KO "취소할 수 없습니다") → recorded in the exclusion list (handler, time, reason) |
| REQ-065 | SYS | Exclusion is per board, withholds all of that user's rewards and cannot be canceled. | Must | No Bingo, Full Board or Ranking Rewards paid |
| REQ-066 | SYS | The ranking places of excluded users, withdrawn users, and Full Board users forfeited (ownership transfer, issue UID designation) after aggregation starts are left vacant, and lower ranks are not moved up. | Must | Places are vacated only after aggregation starts. Completers who withdraw or are reset during the participation period do not leave a vacant place; they drop out of the ranking at the next Bingo Batch recalculation (REQ-049). The back-office leaderboard shows that row's status as "Excluded · Vacant" immediately (rank and total cashback stay fixed); the user leaderboard keeps the recalculated result during the aggregation stage, hides that row from the announcement on, and keeps the numbering (confirmed 2026-10-05, updated 2026-10-12); the amount for that rank is not paid |
| REQ-067 | SYS | Withdrawn users are not paid rewards. | Must | Excluded from payout |
| REQ-068 | AD | A board can be terminated at any stage. | Must | Applicable stages: Scheduled, Pre-open, Participation, Aggregation, Announcement, Payout (excluding normally ended `ENDED` and already terminated `TERMINATED`). Run after a confirmation popup, no reason input, cannot be undone. Master/Operator and PM only. Popup text: "All processing in progress stops and the user page immediately becomes 404. If the payout period has not started, no rewards are paid, and rewards already paid are not taken back. Termination cannot be undone." Batch recovery in progress is also stopped |
| REQ-069 | SYS | Termination stops all progress and shows the terminated status. | Must | Gauge accumulation, cell checks, ranking updates and scheduled payouts stop. Shown as a status different from normal end |
| REQ-070 | SYS | If terminated before the payout period starts, rewards are not paid. Rewards already paid are not clawed back. | Must | If terminated during the payout period, amounts already paid are kept and unprocessed payouts (including those being retried) are stopped |

### 1.9 Payout

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-072 | SYS | Right after the payout period starts, Event Rewards (USDT) are credited automatically to the amount payable to confirmed users' participating UIDs. | Must | Bingo, Full Board and Ranking Rewards are all credited right after the payout period starts (confirmed 2026-10-12). Rewards are paid only once, at the start of the payout period, based on the final state (rewards achieved before a reset and rewards achieved with the new UID are never paid on top of each other). Handled by the MAX BOARD Event Reward payout batch (new) |
| REQ-073 | SYS | Payout failures during automatic crediting are handled by the backend. | Must | No separate back-office screen |
| REQ-074 | SYS | Records of reward recipients (winner history) are not deleted. | Must | Data kept even after the page returns 404 |

### 1.12 Notifications

| ID | Type | Requirement | Priority | Acceptance criteria |
|----|------|----------|----------|-----------|
| REQ-088 | NTF | Notify the operations Slack when the aggregation period starts. | Must | Once per board |
| REQ-089 | NTF | Notify the operations Slack of Bingo Batch anomalies (delay, miss, run error). | Must | One alert unit = one Bingo Batch run (common to all boards). Once on entering delay (not completed by scheduled time + 3 hours), once when a miss is confirmed (not completed by 00:00 UTC of the next day, run stopped), and immediately on a run error (confirmed 2026-10-12) |
| REQ-090 | NTF | Send the opening notice app push at 02:10 UTC on the pre-open start date to all marketing opt-in users. | Must | The copy uses the FCM tab of the [FCM and email copy sheet](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877). The new-UID condition is not mentioned in the copy |
| REQ-091 | NTF | Send the opening app push at 02:20 UTC on the participation start date to all marketing opt-in users. | Must | The new-UID condition is not mentioned in the copy |
| REQ-092 | NTF | Send the join reminder app push on D-7 and D-3 before the last day of the participation period. | Must | Non-participants with an eligible UID at 02:30, non-participants without an eligible UID at 02:40 UTC. Non-participant = no participating UID registered (including users who have not selected a new UID after a reset (ownership transfer, issue UID designation)) |
| REQ-093 | NTF | Send the completion reminder app push at 02:50 UTC on D-7 and D-3 to users who joined but have not completed the board. | Must | Includes users with 0 checked cells |
| REQ-094 | NTF | Follow the common app push rules. | Must | If the send date is outside the participation period or on the same day as the opening push, that round is not sent. Full Board users excluded. Marketing consent rechecked at send time. Sent per board; when several fall on the same day, they are delayed 5 minutes each in registration order. If a delay collides with the next push type, the later type is pushed back too to keep 5-minute gaps. At least 5 minutes from existing pushes: if a delayed time cannot keep a 5-minute gap from the existing 03:00 UTC pushes (quiz, points), it moves to 03:05 or later and continues to be delayed at 5-minute intervals (confirmed 2026-10-12). Every push links to the benefit detail (MAX BOARD) |
| REQ-095 | NTF | Send the reward confirmation email. | Must | Ranking ON: announcement start date; OFF: payout period start date, at 06:00 UTC. Email marketing opt-in users among Bingo and Full Board Reward recipients. The payout date in the body is written as a UTC date (e.g., 2026-10-31 (UTC)) |
| REQ-096 | NTF | Send the ranking winner congratulation email. | Must | 06:10 UTC on the announcement start date, to email marketing opt-in users among Ranking Reward recipients. Sent separately from the reward confirmation email. The payout date in the body is written as a UTC date (e.g., 2026-10-31 (UTC)) |
| REQ-097 | NTF | Result emails are not sent to excluded or withdrawn users, and all later sends for a terminated board are canceled. | Must | Not sent to those targets. Email consent rechecked at send time |

### 1.13 Out of Scope (Won't)

| ID | Type | Requirement | Priority | Reason |
|----|------|----------|----------|------|
| REQ-098 | SYS | Diagonal line rewards | Won't | Lines confirmed as 6 rows/columns |
| REQ-099 | SYS | Per-cell rewards, board prize pool, first-come limit | Won't | Confirmed as payout to everyone who meets the condition |
| REQ-100 | AD | Reverse margin calculation display | Won't | Feature removed |
| REQ-101 | AD | Draft saving, user screen preview | Won't | Confirmed immediately on registration, no preview |
| REQ-102 | AD | Payout status column in the participant list, payout failure screen | Won't | Payout processing is handled by the backend |
| REQ-103 | AD | Undoing termination, reason input, termination notification | Won't | Confirmed as no undo, no reason and no notification |

---

## 2. Non-Functional Requirements


| ID | Type | Requirement | Target |
|----|------|----------|--------|
| NFR-002 | Performance | Bingo Batch application and recalculation finish before the next Bingo Batch. | Completed within the Bingo Batch cycle (1 day) |
| NFR-003 | Consistency | The cashback batch results read by the Bingo Batch match the gauge, streak, cells, lines and ranks. | Cell check, line completion, Full Board and streak activation times recorded in DB history |
| NFR-005 | Security · abuse | Eligibility, participation and rewards are judged by UID. | Rejoining the same board blocked, attribution on ownership transfer blocked, manual exclusion during aggregation |
| NFR-006 | Security | Back-office functions are restricted by permission. | Master/Operator and PM all functions, CS view only |
| NFR-007 | Reusability | Exchange, periods, cells, rewards, ranking and content are taken as parameters to run several boards at once. | No hardcoded values |
| NFR-008 | Conditional UI | User and admin screens and period stages differ by ranking ON/OFF. | ON 5 stages, OFF 4 stages |
| NFR-010 | Data retention | Winner history and recovery/recalculation history are not deleted. | Kept permanently |
| NFR-011 | Time basis | All period and date judgments are based on UTC. The back-office screen shows UTC, and the user screen shows UTC values converted to device local time (periods with date and time together, no "UTC" or time zone label, changed 2026-10-02). Exceptions: the common Notes text keeps the UTC basis notice, and the email payout date is written as a UTC date. | Stage change at 00:00 UTC, API in UTC ISO-8601 |

---

## 3. Priority Matrix (MoSCoW)

| Priority | Requirement IDs | Count |
|----------|-------------|------|
| Must | REQ-001~025, REQ-031~032, REQ-034~037, REQ-040, REQ-042~043, REQ-046~051, REQ-053, REQ-058~062, REQ-064~070, REQ-072~074, REQ-088~097, REQ-106, REQ-114~115 | 69 |
| Won't | REQ-098~103 | 6 |

> Of the 75 requirements in this document, 69 are to be implemented, excluding Won't. Common (SYS·NTF) requirements also appear with the same numbers in the other part's document.

---

## 4. User Stories


| ID | As a [user] | I want [feature] | So that [value] |
|----|---------------|---------------|----------------|
| US-009 | Operator | to create boards per exchange and run them at the same time without development | I can run the event repeatedly |
| US-010 | Operator | to see the cost per user total and expected payout when entering rewards | I can check costs even without a headcount limit |
| US-011 | Operator | to exclude abusive users during the aggregation period | I can prevent unfair reward payouts |
| US-012 | Operator | to recover a missed Bingo Batch and recalculate | users are not disadvantaged by system issues |
| US-013 | Operator | to terminate a problematic board immediately | I can stop the damage from spreading |
| US-014 | CS agent | to look up a participant's gauge, cell and streak history | I can answer inquiries accurately and request a manual payout if needed |

---

## 5. Open Issues (linked to PRD Open Issues)


| # | Item | Related requirements |
|---|------|---------------|
| SC | Whether to add Simplified Chinese to SEO (front-end developer to confirm). Development default: not supported (SEO in 6 languages only) | REQ-009, REQ-087 (see User Requirements Definition) |
| IMG | Whether images other than the detail page banner are needed (design discussion). Development default: no additional images (the banner is only for the Benefits list card) | REQ-009, REQ-075·REQ-078 (see User Requirements Definition) |
| NAME | Service name review (candidates: MAX BOARD / Max Bingo Board / Cashback Bingo / Max Bingo / Bingo Challenge). Development default: 맥스보드 / MAX BOARD. Once decided, screen name, menu name, detail URL (`/max-board`) and push/email copy change | REQ-012, REQ-075·REQ-083·REQ-116 (see User Requirements Definition) |
| COLOR | Board background color change (exchange brand color presets; bright colors automatically switch the text on the board to dark; text inside cells fixed). Input method and editability undecided. Development default: fixed TetherMax default blue, no back-office input | REQ-009, REQ-011, REQ-078·REQ-120 (see User Requirements Definition) |
| TITLE | Whether the large title at the top of the benefit detail uses the admin-entered title or is fixed to the service name. Development default: admin-entered title (`<br />` line breaks applied) | REQ-009, REQ-075·REQ-116 (see User Requirements Definition) |
| BATCH | Bingo Batch run time (once, common to all exchanges, after the Bitget cashback batch) (backend discussion). Development default: setting (document example 12:30 UTC) | REQ-036, REQ-040, REQ-049, REQ-058, REQ-089, REQ-063 (see User Requirements Definition) |
