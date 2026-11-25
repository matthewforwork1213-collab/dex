# Functional Specification — Back Office Front-end

> English translation of `기능명세_프론트_ko.md`. If the two differ, the Korean original prevails.

| Item | Details |
|------|------|
| Project name | TetherMax New Member Bingo Event (service name: 맥스보드 / MAX BOARD) |
| Created | 2026-10-01 |
| Version | v1.8 (2026-10-12 consistency review applied (confirmed 2026-10-12): terms achieved / paid (credited) and Reset / Forfeited defined, concept of users unlinking a UID themselves removed, participant statuses and filters organized into Reset (ownership transfer / issue UID) / Forfeited, leaderboard status shown immediately with ranks fixed, Full Board users withdrawn or reset during participation removed from the ranking, Batch tab Pending · Running display, Missed confirmation and recovery progress, recovery recalculation scope and popup branch after the participation period, Terminate popup text unified, screen label table for history types and where exclusion records are shown, basis for disabling CS buttons, `<br />` in board names in lists replaced with spaces, validation before registration, tier row deletion, abuse exclusion selection conditions, and recovery row run-by and time specified, source document notation) / v1.7 (2026-10-07 PRD v0.11 and requirements v1.6 checked: no back-office change (menu location League/Board > MAX BOARD List already applied). User screen changes (REQ-116~123) are in the user documents; no common logic change) / v1.6 (2026-10-05 PRD v0.10 applied (abuse exclusion not disclosed, ownership transfer and issue UID handling, My Rewards empty state, Ranking Reward total / per place / column, streak bar, Notes in a single column, requirement traceability cleanup) / 2026-10-02 changes applied: batch recovery reason input removed, user-screen local time conversion distinguished, mockup 20261002_1053, Bingo Batch introduced, days on which the Bingo Batch itself was missed confirmed as [Recover]-only, ranking recalculation at aggregation start applied to the ① Status leaderboard (all completers during participation), mockup 20261002_1247, PRD v0.9 applied) |
| Audience | Front-end developers of the back-office (admin) screens |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/백오피스/요구사항정의서_en.md, 분할문서/백오피스/API스펙_en.md, 분할문서/사용자·백오피스/정보구조도_en.md, 03.구현문서/맥스보드_어드민_목업_20261002_1247.html |

> This document is the reference document (no consolidated version; organized 2026-10-01).
> **Scope**: what the back-office screens show and take as input. Server validation, storage and batches are in `기능명세_백엔드_en.md`.
> Screen layout follows the **admin mockup (03.구현문서/맥스보드_어드민_목업_20261002_1247.html)**.
> F-IDs keep the consolidated numbering from before the split. Items marked **[Tentative]** are not yet confirmed in planning.
> **Baseline screen (2026-10-07)**: the back-office screens of the deployed mockup `src/mockup/index.html` (default screen V2) are the latest implementation baseline (including the League/Board > MAX BOARD List menu). The role switch at the top of the mockup is for demos only.
> **Development defaults for open items (2026-10-07)**: develop with the values below until they are decided, then update this document. Service name = 맥스보드 / MAX BOARD (#NAME); board background color = fixed TetherMax default blue with no back-office input (color change feature under review); large title at the top of the benefit detail = the admin-entered title (`<br />` line breaks applied); Bingo Batch run time = setting (example 12:30 UTC, #BATCH); SEO Simplified Chinese = not supported (#SC); images other than the banner = none (#IMG). "Ends Today" uses the device's local date (confirmed 2026-10-07).
> EN copy not yet in the language pack is marked [EN draft] and needs language-pack review.

---

## 1. Screen List

| Screen ID | Screen name | Path | Access | Related F-IDs |
|---------|--------|------|------|-----------|
| SCR-A01 | 1. Board list (menu: League/Board > MAX BOARD List, confirmed 2026-10-05) | `/admin/maxboard` | All of Master/Operator/PM, CS view | F-021, F-030 |
| SCR-A02 | 2. Create board | `/admin/maxboard/new` | Master/Operator/PM | F-022 |
| SCR-A02-P1 | Registration confirmation popup | Popup inside SCR-A02 | Master/Operator/PM | F-022 |
| SCR-A03 | 3. Edit board | `/admin/maxboard/{boardId}/edit` | Master/Operator/PM (not for ended or terminated boards) | F-023 |
| SCR-A04 | 4. Board detail (top) | `/admin/maxboard/{boardId}` | All, CS view | F-024, F-029 |
| SCR-A04-T1 | Tab ① Status | `?tab=status` | All, CS view | F-024 |
| SCR-A04-T2 | Tab ② Participants | `?tab=participants` | All, CS view | F-025, F-028 |
| SCR-A04-T3 | Tab ③ Batch | `?tab=batches` | All, CS view | F-027 |
| SCR-A04-P1 | Termination confirmation popup | Popup inside SCR-A04 | Master/Operator/PM | F-029 |
| SCR-A04-P2 | Abuse exclusion (reason input and confirmation) | Popup inside SCR-A04-T2 | Master/Operator/PM | F-028 |
| SCR-A04-P3 | Batch recovery confirmation popup | Popup inside SCR-A04-T3 | Master/Operator/PM | F-027 |
| SCR-A05 | 5. Participant detail | `/admin/maxboard/{boardId}/participants/{participantId}` | All, CS view | F-026 |

---

## 2. Common Rules

| Item | Rule | Basis |
|------|------|------|
| Permissions | Master/Operator and PM can use all functions. **CS is view only**: the [Create Board], [Edit], [Terminate], [Exclude Selected (Abuse)], [Recover] and [Download CSV] buttons are shown **disabled**. The server also rejects with 403, so disabling on screen is a convenience. Button disabling is decided from the **role in the existing back-office login session** (MASTER / OPERATOR / PM / CS), including buttons with no enable value in the response, such as [Create Board] and [Download CSV] on the list. If the response has `actions`, `excludable` or `recoverable`, those values are also followed | REQ-020, REQ-021 |
| Masking | The back office does **not mask** TUIDs or UIDs. They are shown in full in the list, leaderboard and participant detail | REQ-019 |
| Time | Back-office screens show all date-times in UTC with "UTC" written next to them (the user screen converts to device local time, but the back office does not convert, 2026-10-02) | NFR-011 |
| Amounts | API amounts are decimal strings with two decimal places. Live totals are also calculated with decimal arithmetic to two decimal places (no floating-point errors). Unit USDT | API Specification 1.1 |
| Ranking OFF | Boards with ranking OFF do not draw the announcement stage row, ④ Ranking reward tiers, the leaderboard or the expected Ranking Reward | NFR-008 |
| Language labels | Traditional Chinese is labeled **TC** | Confirmed in mockup |
| Error messages | Input validation errors from API `details.fields` (field name, code) are shown next to the relevant input | API Specification 1.3 |
| Confirmation popup | Every irreversible action (registration, abuse exclusion, batch recovery, termination) goes through a confirmation popup and is called with `confirmed: true` | REQ-010, REQ-064, REQ-068 |
| Status colors | The current status is distinguished by color, and terminated uses a different color from a normal end | REQ-012, REQ-069 |
| Language | The back-office screens support KO/EN (screen language switch). Entered values (title, etc.) are not translated | NFR |
| Board name display | Wherever the board name is shown on one line, such as the list, the top of the detail and the participant detail, `<br />`, `<br/>` and `<br>` (case-insensitive) in the title (KO) are **replaced with a single space** (the stored value is unchanged) | REQ-106 |
| Terms (confirmed 2026-10-12) | **Achieved** = a completed line, a Full Board or a place within the ranking (due to be paid; no money has been paid yet). The "expected reward / expected payout" on screens is based on achievements. **Paid (credited)** = the rewards confirmed at the start of the payout period are actually credited to the participating UID. Users cannot unlink a UID themselves; a participating UID is lost for only two reasons, **ownership transfer** and **issue UID designation** (withdrawal is separate). **Reset** = the participating UID is lost during the participation period and the user becomes like a newcomer on that board (checked cells, lines, Full Board, ranking and achieved rewards all disappear; a new UID can be selected). **Forfeited** = the participating UID is lost from aggregation start until before payout (no rewards, ranking place left vacant). An ownership transfer or issue UID designation after payment (crediting) does not take back amounts already paid; the participation status stays as it is and only the history is kept | Requirements Definition terms |

---

## 3. Function Details

### F-021. Board List

| Item | Details |
|------|------|
| Description | Lists registered boards. |
| Screen | SCR-A01 |
| API called | API-101 `GET /api/admin/maxboard/boards`, API-115 (exchange filter list) |
| Input | Filters: status, exchange, ranking ON/OFF, board name search |
| Display | Columns: board name (`<br />` replaced with a space, shown on one line), exchange, current status (Scheduled / Pre-open / Participation / Aggregation / Announcement / Payout / Ended / Terminated, color-coded, Terminated in its own color), period, ranking, participating UIDs, completers, expected payout. [Create Board] button at the top (disabled for CS, based on the session role) |
| Behavior | Row click → board detail (SCR-A04) |
| States / exceptions | No results → empty state notice |
| Related requirements | REQ-012 |

### F-022. Create Board

| Item | Details |
|------|------|
| Description | Registers a new board. There is no draft saving or preview; it is finalized immediately on [Register]. |
| Screen | SCR-A02 → SCR-A02-P1 |
| API called | API-115 (exchange list), API-116 (banner/OG image upload), API-102 `POST /api/admin/maxboard/boards` |
| ① Basic settings | Select **1** exchange, ranking ON/OFF |
| ② Periods | Only the pre-open start date is entered directly. **Later stage start dates are filled in automatically as the day after the previous stage's end date.** The end date is the stage's last day (inclusive to 23:59:59 UTC); days = end date − start date + 1 (for a one-day stage, start date = end date). End date and days are linked. Stages cannot be skipped, there is no upper limit on the total period, and **past dates can be entered**. With ranking OFF the announcement row is hidden No stage can be skipped; to effectively skip pre-open, enter yesterday as the pre-open start and end dates |
| ③ Board setup · rewards | For each of the 3×3 cells, a type (amount cell / streak cell) and a value (target USDT / streak days N). No limit on the number or position of each type (all 9 cells can be streak cells). Reward input positions: **row rewards to the right of each row, column rewards below each column, Full Board Reward and total cost per person to the right of the board** Streak cells use a different background color, and reward inputs are styled differently from cells. If all 9 cells share the same N, the board can be completed at once on day N, so the operator balances difficulty |
| ④ Ranking reward tiers (ON only) | Tier rows (from rank, to rank, amount per person) are added with [Add Tier] and deleted with the [Delete] button on the right of each row (the last remaining row cannot be deleted). Number of winners and ranking reward pool total calculated live |
| ⑤ Content · SEO | Required: title and subtitle (KO/EN), banner image. Optional: OG image (KO/EN), SEO title/description (KO/EN/VI/TC/RU/ID). A notice says that site defaults are used for SEO fields left empty. Next to the title/subtitle inputs, the notice "Enter `<br />` for a line break." [EN draft] (KO "`<br />`을 입력하면 줄바꿈됩니다") (`<br/>` and `<br>` also accepted, no character limit). Line breaks are not applied to SEO/OG inputs. Image upload is **WebP only, 5MB or less** (violations are flagged before upload). **There is no Notes input** (only a notice that the common fixed text for all boards is shown automatically) |
| Live calculation | Total cost per person = 6 lines + Full Board Reward. Recalculated immediately when an amount changes. **Display only; amounts are not limited** (operations guideline) Operations guideline: keep the per-user maximum reward below TetherMax's share generated by that user completing the board |
| On-screen validation | Missing required values, amount cell below 0.01, streak days below 1 or fractional, **streak days greater than the number of participation days**, **reward or ranking tier amount per person below 0.01 (0 not allowed)**, amounts with three or more decimal places, ranking tiers not starting from 1st / gaps / overlaps / from rank > to rank, reversed dates (end date < start date). When [Register] is pressed, on-screen validation runs **before the confirmation popup opens**; if there are errors, no popup is shown, the error fields are marked (scrolling to the first error) and [Register] is blocked. The server runs the same validation, and on failure the `details.fields[].code` of the top-level `VALIDATION_ERROR` is shown in the relevant input. Overlapping periods for the same exchange and past dates are not blocked |
| Behavior | [Register] → confirmation popup "Once registered, the exchange, ranking ON/OFF, periods, cell conditions and reward amounts cannot be changed…" (KO "등록하면 거래소, 랭킹 ON/OFF, 기간, 칸 조건, 리워드 금액은 수정할 수 없습니다…") → on [Confirm], API-102 with `confirmed: true` → on success, go to the board detail Full popup text: "Once registered, the exchange, ranking ON/OFF, periods, cell conditions and reward amounts cannot be changed. Only the title, SEO and images can be edited later." |
| States / exceptions | No draft save button or preview button is built. If an uploaded image ID is invalid (`INVALID_IMAGE_REF`), the relevant image input asks the user to upload again |
| Related requirements | REQ-001~010, REQ-106 |

### F-023. Edit Board

| Item | Details |
|------|------|
| Description | Edits only the content of a registered board. This is a separate page from creation. |
| Screen | SCR-A03 |
| API called | API-103 (current values), API-116 (images), API-104 `PATCH /api/admin/maxboard/boards/{boardId}/content` |
| Display | Amount/condition sections ①–④ are shown **dimmed, hatched and labeled "Locked · Cannot Edit"** (KO "잠김 · 수정 불가") and cannot be edited. Only ⑤ Content · SEO is highlighted and editable. The `<br />` line break notice for the title/subtitle is the same as on the creation screen Top notice: "This board is registered. Amount/condition items (①–④) cannot be changed; only ⑤ Content · SEO can be edited." Locked sections are grayscale + hatched background + dashed border, the "Locked · Cannot Edit" label is red, and [Add Tier] is hidden. ⑤ has a highlighted border and an "Editable" label |
| Behavior | Edit ⑤ → [Save] → go to the detail. The request contains only ⑤ fields |
| States / exceptions | For ended or terminated boards, the [Edit] button on the detail is disabled and the edit page cannot be opened. Show the `LOCKED_FIELD_NOT_EDITABLE`, `BOARD_CLOSED`, `CONTENT_REQUIRED` and `INVALID_IMAGE_REF` errors. Title, subtitle (KO/EN) and banner are also required when editing (cannot be saved empty, because they become the Benefits list card's title and subtitle, confirmed 2026-10-05) |
| Related requirements | REQ-011, REQ-106 |

### F-024. Board Detail · Status

| Item | Details |
|------|------|
| Description | Shows the board summary, operating metrics and leaderboard. |
| Screen | SCR-A04, SCR-A04-T1 |
| API called | API-103 (top summary), API-105 (status metrics), API-106 (admin leaderboard, ranking ON) |
| Top summary | Board name, current status, exchange, ranking, stage periods, total cost per person, [Edit] [Terminate] buttons |
| ① Status tab | KPIs (participating UIDs, completers, streak cell activations), achievements per line (6 lines), expected payout (Bingo, Full Board, Ranking, total; Ranking based on the current rank) Completions by line are shown as bars for rows 1~3 and columns 1~3. Completers, streak cell activations, achievements per line and expected payout are based on participants with the status "Participating". After rewards are confirmed (announcement for ranking ON, payout period for ranking OFF), the expected payout switches to the confirmed payout list (label "Confirmed Payout" [EN draft] (KO "확정 지급액")) |
| Leaderboard (ON only) | Columns: rank, TUID (full), total cashback, completion time, status (Normal / **Excluded · Vacant**. Vacancy reasons: abuse exclusion, withdrawal, Forfeited (ownership transfer), Forfeited (issue UID). Places become vacant only after aggregation starts), expected Ranking Reward. Updated after the Bingo Batch every day, recalculated once at aggregation start (all completers during participation, including those who completed after the last participation day's Bingo Batch, confirmed 2026-10-02). Last update time (UTC) shown. If an exclusion, withdrawal or forfeiture occurs after aggregation starts, the row's status changes **immediately** to "Excluded · Vacant", while the rank and total cashback stay fixed (lower ranks are not moved up). The screen shows the note "The user leaderboard stays fixed during aggregation, and vacant places are applied at announcement." [EN draft] (KO "사용자 리더보드는 집계 동안 고정되며 비운 자리는 결과 발표 때 반영됩니다") (confirmed 2026-10-12). Full Board users withdrawn or reset during the participation period are not left vacant; they drop out of the list in the next Bingo Batch recalculation (confirmed 2026-10-12). If API-106 `finalized=true` (from announcement onward), the label "Final Ranking" is shown. 50 rows per page by default |
| Behavior | Leaderboard row click → participant detail (SCR-A05). Tab switching ① Status / ② Participants / ③ Batch |
| Button enablement | [Edit] follows API-103 `actions.canEditContent`, and [Terminate] follows `actions.canTerminate` (always false for CS and for ended or terminated boards). The board name in the top summary is shown with `<br />` replaced by a space |
| States / exceptions | The leaderboard has no exclusion function (exclusion is in the Participants tab). For boards with ranking OFF, API-105 does not return the `expectedPayout.ranking` key, and the Ranking Reward item in the expected payout is hidden (PRD: with ranking OFF, all ranking-related UI is removed) |
| Related requirements | REQ-013, REQ-014, REQ-018 |

### F-025. Participant List · CSV

| Item | Details |
|------|------|
| Description | Lists the board's participants and downloads them as CSV. |
| Screen | SCR-A04-T2 |
| API called | API-107 `GET .../participants`, API-108 `GET .../participants.csv` |
| Input | Search (TUID, UID), status filter (Participating / Reset / Forfeited / Excluded / Withdrawn), reason filter (Ownership Transfer / Issue UID, used when Reset or Forfeited is selected, API-107 `resetReason`), page |
| Display | Columns: select, TUID, participating UID (full), registration time, **accumulated / available gauge**, checked cells, completed lines, completion time, current / longest streak, rank, expected reward, status. There is no payout status column. Status display (confirmed 2026-10-12): Participating / Reset (Ownership Transfer) / Reset (Issue UID) / Forfeited (Ownership Transfer) / Forfeited (Issue UID) / Excluded / Withdrawn. Reset = the participating UID was lost during the participation period (a new UID can be selected; that row's achieved rewards disappear); Forfeited = the participating UID was lost from aggregation start until before payout (no rewards). A user who selected a new UID after a reset appears in two rows: the previous row (Reset) and the new row (Participating). An ownership transfer or issue UID designation after payment (crediting) does not change the status (recorded only in the participant detail history) |
| Terms | Accumulated gauge = total cashback during the participation period (ranking basis). Available gauge = accumulated − amount spent on amount cells |
| Behavior | Row click → participant detail (SCR-A05). [Download CSV] (disabled for CS, based on the session role) |
| Related requirements | REQ-015, REQ-016, REQ-019 |

### F-026. Participant Detail

| Item | Details |
|------|------|
| Description | Shows one participant's status and history on a separate page. |
| Screen | SCR-A05 |
| API called | API-109 `GET .../participants/{participantId}` |
| Display | Summary (board, TUID, participating UID, registration time, accumulated / available gauge, current / longest streak, completed lines, expected reward, status). The status uses the same notation as F-025 (Reset and Forfeited include the reason). If the status is "Excluded", **exclusion info** (processed by, time (UTC), reason) is shown below the summary (using the detail values of the `EXCLUDED` history entry). 3×3 mini board (checked / open / unchecked). History (UTC) is shown according to the label table below. The times of Reset, Forfeited and UID-change-after-payout history entries are the times in the TetherMax account DB history |
| History labels (confirmed 2026-10-12) | `UID_REGISTERED` participating UID registered (retroactive gauge) / `BATCH_APPLIED` batch applied / `CELL_CHECKED` cell checked / `LINE_COMPLETED` line completed (reward amount) / `BOARD_COMPLETED` Full Board / `STREAK_CELL_ACTIVATED` streak cell activated / `RESET` Reset (reason: ownership transfer / issue UID) / `FORFEITED` Forfeited (reason: ownership transfer / issue UID) / `UID_LOST_AFTER_PAYOUT` UID change after payout (reason, no change to paid amounts) / `RECALCULATED` recalculated (batch recovery, recovered batch date, before and after values) / `SOURCE_CORRECTED` source corrected (batch recovery after the participation period, not applied automatically, for individual CS handling) / `EXCLUDED` abuse exclusion (processed by, reason) / `WITHDRAWN` withdrawal. Each history entry shows who performed it (user / system / admin account) |
| States / exceptions | No TUID/UID masking. View-only screen |
| Related requirements | REQ-017, REQ-019 |

### F-027. Batch Status · Missed Batch Recovery

| Item | Details |
|------|------|
| Description | Shows this board's per-date **Bingo Batch** run results and recovers missed days (re-runs that day's Bingo Batch). These are not the results of the cashback batch (existing system) itself. |
| Screen | SCR-A04-T3 → SCR-A04-P3 |
| API called | API-110 `GET .../batches`, API-111 `POST .../batches/{batchDate}/recover` |
| Display | Title "Bingo Batch Results" [EN draft] (KO "빙고 Batch 실행 결과"). Columns: batch date, run time (scheduled time may be shown together, UTC), result (Pending · Running / Normal / Delayed / Missed), UIDs applied, cashback applied, recovery (button or recovery status). Result criteria: before judgment or while running = Pending · Running (`PENDING`); not finished within Bingo Batch scheduled time (setting) + 3 hours = Delayed; not finished by 00:00 UTC the next day = Missed (the run is stopped and confirmed as Missed, late results are not applied, confirmed 2026-10-12). Recovery column: while recovering (`recoveryState=RUNNING`) "Recovering" [EN draft] (KO "복구 중"); done (`DONE`) "Recovered" [EN draft] (KO "복구 완료") + run by (`recoveredBy`) and time (`recoveredAt`, UTC); failed (`FAILED`) "Recovery Failed" [EN draft] (KO "복구 실패") + run by and time. A recovered row keeps the result "Missed", and the [Recover] button does not appear again |
| Behavior | [Recover] on a missed row (disabled for CS) → confirmation popup (no reason input) → API-111 → show the result, then refresh the list. The popup text depends on the **stage at the time of the request** (confirmed 2026-10-12). Participation period: "This re-runs the {batch date} Bingo Batch. That day's data is read again from the TetherMax cashback DB and applied, and gauges, streak records, streak cell activation and rankings are recalculated. Cells, lines and Full Boards checked by users do not change." [EN draft] (KO "{배치 반영일} 빙고 Batch를 다시 실행합니다. 테더맥스 페이백 DB에서 해당일 데이터를 다시 읽어 반영하고 게이지·연속 기록·연속 칸 활성화·랭킹을 재계산합니다. 사용자가 체크한 칸·줄·완성은 바뀌지 않습니다.") After the participation period ends (aggregation onward): "Only the source record of the {batch date} Bingo Batch is corrected. Participation-period data recovered after the participation period ends is not applied automatically and is handled individually through CS (no recalculation of gauges, streak records, cells or rankings)." [EN draft] (KO "{배치 반영일} 빙고 Batch 원천 기록만 보정합니다. 참여 기간이 끝난 뒤 복구된 참여 기간분은 자동 반영하지 않고 CS로 개별 처리합니다(게이지·연속 기록·칸·랭킹 재계산 없음).") |
| Error handling | Notices for `BATCH_NOT_RECOVERABLE` (not missed / outside the participation period), `BATCH_SOURCE_NOT_FOUND` (no source data; must be filled in the cashback system first), `BATCH_RECOVERY_IN_PROGRESS` |
| Button enablement | [Recover] is shown and enabled only when the API-110 row has `recoverable=true` (result Missed + not already recovered or running + change permission + not ended or terminated). A row whose recovery failed (`FAILED`) can be recovered again. Recovery rows show who ran it (`recoveredBy`) and when (`recoveredAt`) |
| States / exceptions | Recovery is an asynchronous job (202 + jobId), so the result changes only after the list is reloaded on completion (progress is checked with `recoveryState`). If the board is terminated, a recovery in progress is stopped. [Recover] can be used even after the participation period ends (confirmed). Days on which the Bingo Batch itself was missed are not filled in automatically by the next day's Bingo Batch, so they are filled only with this [Recover] (confirmed 2026-10-02). The column name "batch date" (KO "배치 반영일") is kept as an admin term (not shown to users) |
| Related requirements | REQ-058, REQ-059 |

### F-028. Abuse Exclusion

| Item | Details |
|------|------|
| Description | Excludes abusive users from reward payout during the aggregation period. |
| Screen | SCR-A04-T2 → SCR-A04-P2 |
| API called | API-113 `POST .../exclusions`, API-112 (exclusion record lookup) |
| Behavior | Select participants → [Exclude Selected (Abuse)] → reason input popup (**required**; the next-step button is disabled while it is empty) → confirm "This cannot be undone." [EN draft] (KO "취소할 수 없습니다") → API-113 → refresh the list (status "Excluded"; the admin leaderboard immediately shows "Excluded · Vacant" with rank and total cashback fixed) |
| Exclusion record display (confirmed 2026-10-12) | At the bottom of the ② Participants tab, an "Abuse Exclusion Records" [EN draft] (KO "어뷰징 제외 기록") table (API-112: TUID, participating UID, reason, processed at (UTC), processed by) is shown when there is at least one exclusion record. Each participant's exclusion info is also shown in the summary and history of the participant detail (F-026) |
| States / exceptions | The button is **enabled only during the aggregation period** (always disabled for CS; disabled in other stages, and the reason popup does not open either). Only rows with status "Participating" can be selected; checkboxes for Reset, Excluded, Withdrawn and Forfeited rows are disabled (IA-9, confirmed 2026-10-05). No UI for undoing an exclusion. The popup states that all rewards of the excluded user (Bingo, Full Board, Ranking) are not paid and lower ranks are not moved up. Show the `EXCLUSION_NOT_IN_AGGREGATION`, `EXCLUSION_REASON_REQUIRED` and `PARTICIPANT_NOT_EXCLUDABLE` errors. Selection checkboxes are enabled only for API-107 rows with `excludable=true` (aggregation stage + status Participating + change permission). If other statuses are mixed in, the API rejects the whole request |
| Related requirements | REQ-064~066 |

### F-029. Termination

| Item | Details |
|------|------|
| Description | Ends a board immediately at any stage. |
| Screen | SCR-A04 → SCR-A04-P1 |
| API called | API-114 `POST .../terminate` |
| Behavior | [Terminate] (disabled for CS) → confirmation popup → [Confirm] → API-114 → status shown as terminated. Full popup text (unified, confirmed 2026-10-12): "All processing in progress stops and the user page immediately becomes 404. If the payout period has not started, no rewards are paid, and rewards already paid are not taken back. Termination cannot be undone." [EN draft] (KO "진행 중인 모든 처리가 멈추고 사용자 페이지가 바로 404가 됩니다. 지급 기간이 시작되지 않았다면 리워드는 지급되지 않으며, 이미 지급된 리워드는 회수하지 않습니다. 강제 종료는 취소할 수 없습니다.") |
| States / exceptions | Stages where termination is allowed: Scheduled, Pre-open, Participation, Aggregation, Announcement, Payout. For boards that ended normally (payout period ended) or are already terminated, the [Terminate] button is disabled (IA-11, confirmed 2026-10-05). No reason input, no undo button. Batch recovery in progress is also stopped |
| Related requirements | REQ-068~070, REQ-071 (see User Requirements Definition) |

### F-030. Permission Control

| Item | Details |
|------|------|
| Description | Restricts MAX BOARD functions with the existing back-office permission system. |
| Screen | All admin screens |
| Processing | Receives the role (MASTER / OPERATOR / PM / CS) from the existing back-office login session and, for CS, disables all change and CSV buttons (MAX BOARD API responses have no separate role field). On a `403 FORBIDDEN_ROLE` response, show a no-permission notice; on `403 FORBIDDEN`, show a menu-access-denied notice |
| Related requirements | REQ-020, REQ-021 |
