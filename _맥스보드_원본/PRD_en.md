# PRD: TetherMax New Member Bingo Event

> This document is the project **overview**. It covers only what we are building, why, and the core rules. Details of screens, APIs and processing rules are defined in the **split documents** (see "Document guide" below), and development follows the split documents only. English translation of `PRD.md`; if the two differ, the Korean original prevails.

| Item | Details |
|------|---------|
| Project | TetherMax New Member Bingo Event |
| Service name | **MAX BOARD (맥스보드)** (name under review, Open Issue #NAME) |
| Client | TetherMax |
| Tech stack | Next.js + Tailwind CSS / Express.js / PostgreSQL / Vercel |
| Benchmark | tethermax.io Global League |
| Latest mockup | `src/mockup/index.html` (Vercel deployment, default screen V2) |
| Document version | v1.1 (2026-10-12 consistency review applied) / v1.0 (2026-10-07 restructured as an overview. Detailed rules moved to the split documents; the previous detailed version is in Git history as v0.11) |

---

## 1. Overview

### 1.1 Goal

A limited-time bingo event that increases early trading of **newly registered UIDs** on TetherMax.

- During the participation period, a UID's gauge fills by its **trading cashback**, and the user **chooses and checks** cells on a 3×3 bingo board.
- A reward is paid **each time a row or column is completed** and **when all 9 cells are checked**. There is no winner cap; everyone who meets the condition is paid.
- On boards with ranking turned on, an extra **Ranking Reward** goes to the top cashback earners among users who complete the board.
- Built as a reusable module so that **several boards (one per exchange) run at the same time**.

### 1.2 Core features

| # | Feature | Summary |
|---|---------|---------|
| 1 | Board creation and operation | Per board (one exchange) in the back office: periods, cell conditions, reward amounts, ranking ON/OFF, content |
| 2 | Eligibility | Decided **per UID**, not per TUID. UIDs registered within 30 days before the participation start date |
| 3 | Cashback gauge | Trading cashback is added automatically once a day. Non-member UIDs are recorded too and credited retroactively on joining |
| 4 | Cell check | Two cell types: amount cells (use the gauge) and cashback streak cells (open after N consecutive days) |
| 5 | Bingo and Full Board Rewards | A Bingo Reward per line (3 rows, 3 columns), a Full Board Reward for all 9 cells |
| 6 | Ranking Reward (ON/OFF) | Total-cashback ranking among completers, separate reward pool, leaderboard |
| 7 | Abuse exclusion | Admins exclude users from payout during aggregation |
| 8 | Automatic reward crediting | Event Rewards credited to the participating UID right after the payout period starts |
| 9 | Benefits listing and detail | Benefits list card and detail page |
| 10 | Multilingual and SEO | Title and subtitle KO/EN, SEO in 6 languages |
| 11 | Notifications | App push (marketing opt-in), result emails, operations Slack |
| 12 | Operations monitoring | Completions and expected payout per board in real time |

### 1.3 Target users

| Type | View | Join | Notes |
|------|------|------|-------|
| Member with an eligible UID | O | O | TUID sign-up date does not matter |
| Member without an eligible UID | O | X | Can join by linking a new UID |
| Non-member | O | X | View only. An eligible UID's gauge is recorded and credited later |
| Operator | - | - | Creates and runs boards in the back office |

### 1.4 Design premises (TetherMax account structure)

| Platform characteristic | Event design |
|-------------------------|--------------|
| A TUID can be created without limit using only an email | Eligibility, participation and rewards are decided **per UID** |
| A UID can exist without a member account | Non-member UIDs also accumulate a gauge, credited on joining |
| A UID can move to another TUID | Participation does not move to the new TUID. No rejoining the same board |
| Users cannot unlink a UID themselves | A participating UID is lost only through ownership transfer or issue-UID designation |
| A withdrawn TUID turns its UIDs into non-member UIDs | Withdrawn users are not paid |

---

## 2. Core rules summary

| Area | Rule |
|------|------|
| Eligibility | UIDs of the board's exchange first registered in the TetherMax DB within 30 days before the participation start date. UIDs registered during the participation period also qualify. UIDs with a record on the same board and issue UIDs do not |
| Participating UID | One per TUID per board; cannot be changed after registration. If it is lost through ownership transfer or issue-UID designation: during participation the user starts over (can select a new UID); from aggregation until payout, no rewards; after payout, nothing is taken back |
| Gauge | Only cashback from trading. Updated once a day by the Bingo Batch. Only batches run during the participation period (including the last day) count. Filled gauge is never taken back |
| Cells | Amount cell: checked by spending its target amount from the gauge. Cashback streak cell: opens after N consecutive days of cashback and uses no gauge. The user chooses cells; no cancel or move. No reward for a single cell |
| Rewards | Bingo Rewards (6 lines) + Full Board Reward (1) = up to 7 per person, in USDT. No diagonals. No winner cap. Paid once when the payout period starts |
| Terms | Achieved = a line or the board is completed (reward pending). Paid (Credited) = actually paid to the participating UID when the payout period starts |
| Ranking (ON only) | Completers only, ranked by total cashback during participation. Ties go to whoever completed first. Places vacated after aggregation starts (exclusion, withdrawal, etc.) stay empty; lower ranks are not moved up |
| Abuse exclusion | Per board during aggregation; all of the user's rewards are withheld; cannot be undone. Not disclosed to the user |
| Registration and edits | Final on registration (no drafts). Amount and condition items (exchange, cells, rewards, ranking, periods) cannot be edited; content can |
| Termination | Possible at any stage; cannot be undone. If before payout, no rewards are paid; rewards already paid are not taken back |
| Time | All judgments in UTC. The user screen shows device local time; the back office shows UTC |

---

## 3. Stages

Ranking ON boards have 5 stages; OFF boards have 4 (no Announcement). Stages change automatically at 00:00 UTC on each start date.

| Stage | User page | Join and check | Description |
|-------|-----------|----------------|-------------|
| Scheduled | 404 | No | After registration, before pre-open starts |
| Pre-open | Open | No | Board and reward layout, eligibility shown in advance |
| Participation | Open | Yes | Gauge accumulates, cells can be checked, deadline countdown |
| Aggregation | Open | No | Calculating. Abuse exclusion |
| Announcement (ON only) | Open | No | Rewards confirmed, final ranking announced |
| Payout | Open | No | Rewards credited automatically |
| Ended / Terminated | 404 | - | Winner records are never deleted |

---

## 4. Back office summary

- **Menu**: League/Board > MAX BOARD List
- **Roles**: Master, Operator and PM have all functions; CS is view only

| Screen | Main functions |
|--------|----------------|
| Board list | Status, exchange and ranking filters; create button |
| Create board | Exchange, ranking, periods, cell conditions, rewards and content; automatic cost per user; final on registration |
| Edit board | Content only (title, subtitle, SEO, images) |
| Board detail | Status (completions, expected payout, leaderboard), participants (search, CSV, abuse exclusion), batch (results, missed-day recovery), terminate |
| Participant detail | One participant's board state and history |

---

## 5. User screen summary

- **Benefits list**: MAX BOARD cards are listed first, using the admin-entered title and subtitle.
- **Benefit detail**: TetherMax and exchange logos at the top, reward summary, participation deadline countdown, My Bingo Board, event schedule, check guide, My Rewards and ranking, Notes.
- **Joining**: the participating UID is selected and registered inside the detail. Non-members return to the same detail after logging in.
- **Principles**: no recommendation of which cell to check first. The next goal is shown right after a line or the board is completed. The gauge only says "Updated once a day", without the next update time.
- **Terms**: confirmed terms such as Reward, Bingo, Full Board, Check and Bingo Gauge; English uses Cashback for payback. Sentence tone follows the TetherMax language pack.

---

## 6. Notifications

| Channel | Audience | Content |
|---------|----------|---------|
| App push | Marketing opt-in users | Opening notice, opening, join reminders (D-7, D-3), completion reminders (D-7, D-3) |
| Email | Reward recipients who opted in to marketing email | Reward confirmation, ranking congratulations |
| Slack | Operations channel | Aggregation start, Bingo Batch delay, miss or error |

Copy: [FCM and email copy sheet](https://docs.google.com/spreadsheets/d/1u_oQzyT0XEz9pUkSCduZxpslB1QOCcDiT3qBqyw0D6A/edit?gid=1933179877#gid=1933179877)

- Push copy and email subject lines follow the sheet (reviewed by marketing, 2026-09-30). The email body is not in the sheet, so it is a draft that needs marketing review.
- Send times, audience conditions and stagger rules are in the back-end functional specifications (F-031~F-033).

---

## 7. Non-functional requirements

| Item | Requirement |
|------|-------------|
| Performance | Cache the detail and leaderboard for heavy concurrent views. Gauge and ranking update once a day by batch |
| Consistency | Batch results match gauges, cells, lines and ranks. Check and completion times are kept as DB history |
| Reusability | Exchange, periods, cell conditions, rewards, ranking and content are all settings; no hardcoding |
| Multilingual | Screens KO/EN, SEO in 6 languages, Notes in 15 languages |
| Data retention | Winner records kept permanently |
| Responsive | PC and mobile each optimized |

---

## 8. Open issues

| # | Item | Development default |
|---|------|---------------------|
| NAME | Service name change (candidates: MAX BOARD / Max Bingo Board / Cashback Bingo / Max Bingo / Bingo Challenge) | MAX BOARD |
| COLOR | Board background color change | Fixed TetherMax default blue |
| TITLE | Whether the large title at the top of the detail uses the admin-entered title | Admin-entered title |
| BATCH | Bingo Batch run time | Setting (example 12:30 UTC) |
| SC | Adding Simplified Chinese SEO | Not supported |
| IMG | Images other than the banner | None |

---

## 9. Document guide

The documents below define the detailed rules. The user screen and the back office have separate developers, so the documents are split; common logic (batches, judgments, payout, notifications) appears identically in both back-end documents.

| What you need | Document |
|---------------|----------|
| Requirements list | `02.기획문서/분할문서/{사용자,백오피스}/요구사항정의서_ko.md` |
| Screen behavior, button destinations, screen copy | `02.기획문서/분할문서/{사용자,백오피스}/기능명세_프론트_ko.md` |
| Mixpanel events | `02.기획문서/분할문서/사용자/믹스패널이벤트_ko.md` |
| Server processing, batches, payout, notification rules, email template structure | `02.기획문서/분할문서/{사용자,백오피스}/기능명세_백엔드_ko.md` |
| API requests and responses, error codes, internal jobs | `02.기획문서/분할문서/{사용자,백오피스}/API스펙_ko.md` |
| Screen structure and navigation | `02.기획문서/분할문서/{사용자,백오피스}/정보구조도_ko.md` |
| Test cases | `04.검수문서/테스트시나리오.md` |
| Copy tone | `05.리포트/맥스보드_문구_톤가이드.md` |

English versions use the `_en` suffix (PRD: `PRD_en.md`).
