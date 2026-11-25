# MAX BOARD — DEX impact

Written 2026-10-21
Source: the Maxboard PRD repository `github.com/matthewforwork1213-collab/max_board-bingo-`
(service plan v1.1 / user requirements v1.7 / backoffice requirements)

> **We intend to run DEX boards on Maxboard** (decision M-1).
> This document reads the Maxboard PRD from a DEX point of view and records **what applies and where it conflicts.**

---

# 0. Conclusion first

| Verdict | Detail |
|---|---|
| ✅ **Applies** | The gauge, the ranking and the rewards are all based on **cashback amounts**, so they hold for DEX unchanged. `volume` is not needed |
| ⚠️ **One conflict** | **Lighter settles weekly, so a streak cell can never open** → **a change to the settlement cycle is a precondition. Without it, no Lighter board** |
| ⚠️ **One to confirm** | **The bingo Batch must run after Aster's 09:00 UTC publication** |
| 📝 **Copy changes** | *"You have no {exchange} UID"* has to say "wallet" on a DEX |

---

# 1. What Maxboard is

```
A 3×3 bingo board, run repeatedly, one exchange at a time

  Amount cell — check it by spending gauge once the cashback target is reached
  Streak cell — opens after N consecutive days of cashback (spends no gauge; once open, stays open)

Rewards   3 rows + 3 columns + 1 full board = up to 7, with no cap on participants
Ranking   on or off per board. Finishers only, ordered by total cashback, refreshed daily
Eligible  a UID registered in the TetherMax DB from 30 days before the join period opens (UID, not TUID)
Backdating  accrues automatically from the join start date. The non-member period counts
```

> The PRD in one line: *"a new-user activation event where **the cashback you earn trading with a newly registered UID becomes the bingo gauge**, and every completed row, column and full board pays a USDT reward **with no cap on winners**."*

## 1-1. Phases

| Ranking ON | Ranking OFF |
|---|---|
| Pre-announce → Join → Tally → **Results** → Payout (5) | Pre-announce → Join → Tally → Payout (4) |

- Phases advance automatically at **00:00 UTC**
- Only the first start date is entered; the rest chain automatically. **No phase can be skipped**
- Between registration and pre-announce the board is `Not yet visible` (404 to users)
- The page is deleted after the payout period ends

---

# 2. ✅ DEX applies — `volume` is not needed

Maxboard had been classified as *"works only if `symbol` and `volume` are provided"*. **That was wrong.**

| Element | Basis | Source |
|---|---|---|
| Bingo gauge | **cashback amount** | service plan §1.1 |
| Checking an amount cell | **cashback target** | REQ-078 |
| Streak cell | **consecutive days by cashback batch posting date** | REQ-040 |
| Ranking | **total cashback** | §4.2 MVP |
| Reward design | *"the cell target is a cashback amount"* | §6.2 |

**Trading volume is used nowhere.** A DEX can produce a commission cashback figure, so the whole thing holds.

→ The `symbol` and `volume` asks were **withdrawn** from the exchange API request document,
→ and Maxboard was promoted from **conditional to supported** in the V2 re-assessment.

---

# 3. ⚠️ Conflict 1 — Lighter streak cells never open

## 3-1. The problem

> **REQ-040**: a streak cell opens after **N consecutive days** of cashback, measured by the **cashback batch posting date**.
> The reference date is the **posting date**, not the day the bingo Batch runs. There is no per-day amount condition (**0.01 or more** counts).

**Lighter settles weekly** — on Monday, covering the previous Monday to Sunday.
Cashback lands on one day out of seven, so **not even a two-day streak is possible.**

| Exchange | Settlement | Streak cell | Amount cell |
|---|---|:-:|:-:|
| **Lighter** | **weekly (Mon)** | **❌ never** | ✅ |
| ApeX | hourly | ✅ | ✅ |
| EdgeX | daily, 00:00 UTC | ✅ | ✅ |
| Aster | daily (published 09:00) | ✅ | ✅ |

## 3-2. Response — **a settlement change is a precondition** (settled 2026-10-21)

> **Decision:** we do not run a Lighter Maxboard unless the settlement cycle changes.

```
Precondition — ask Lighter for a daily ledger
   Payouts may remain weekly.
   The streak test uses the "ledger posting date", not the "payout date",
   so a daily ledger alone resolves it.
   → added to the exchange API request document, §4-3, Lighter item 6

If it cannot change → do not open a Lighter board
```

### Kept as an option only — an amount-cells-only board

The PRD does support a board made entirely of amount cells.

> **REQ-113**: *"if there are only amount cells, hide the streak card and show the remaining card at full width"*
> **REQ-122**: *"amount cells: the number of unchecked cells where available gauge ≥ target"*

**It is technically possible, but we decided operationally not to do it.**
The streak cell is *"the device that builds a trading habit"* (service plan §4.1, differentiator 4), and removing it removes one of Maxboard's core values.

> If the policy changes later, an amount-cells-only board can be created **from backoffice settings alone.**
> No additional development is required.

## 3-3. (Reference) How the screen differs with amount cells only

Recorded in case the policy changes.

| Element | Mixed | **Amount only** |
|---|---|---|
| Gauge card | shown | shown (full width) |
| Streak record card | shown | **hidden** |
| Streak progress bar | shown | **hidden** (REQ-113: *"no bar if there are no streak cells"*) |
| `Maximum checkable cells` | amount + streak | amount cells only |
| Cell labels | `5 USDT` and `4 days` mixed | `5 USDT` only |

---

# 4. ⚠️ Conflict 2 — bingo Batch time vs Aster 09:00

## 4-1. The problem

> **REQ-036**: the bingo Batch is a Maxboard-specific daily batch that pulls in cashback batch results.
> It runs **once a day at a fixed time shared by every exchange** (a setting, **after the Bitget cashback batch**, exact time undecided, `#BATCH`),
> and refreshes the gauge, streak records, streak-cell activation and the ranking together.

**Aster calculates at 00:00 UTC and publishes after 09:00.**
If the bingo Batch runs before 09:00, **Aster cashback slips a day every day, and the streak test slips with it.**

## 4-2. The current default is safe

The PRD's open issue `#BATCH` records a **development default of `12:30 UTC`.**

```
Aster published   09:00 UTC
Bingo Batch       12:30 UTC   ← 3h30m of headroom. The current default is safe
```

**But it is not final.** When the bingo Batch time is settled, one more condition has to be added.

```
Existing condition  after the Bitget cashback batch
New condition       + after Aster's 09:00 UTC        ← required once DEX is in scope
```

## 4-3. A buffer already exists

> **REQ-040**: if the day's cashback batch has not finished when the bingo Batch runs,
> **that date is not judged as a break; it is judged at the next bingo Batch.**
> (The cashback system reports completion status per exchange per date.)

→ So a late Aster **does not break a streak immediately.** The test is simply deferred by a day.
However, the gauge on the user's screen does slip by a day, so **the REQ-063 delay notice would appear every day.**

> **REQ-063**: when the bingo Batch is delayed, show *"cashback posting is delayed"*.
> Delayed = still incomplete 3 hours after the scheduled bingo Batch time.

---

# 5. 📝 Copy changes — "UID" → "wallet"

The Maxboard PRD treats the exchange name as a variable but **leaves "UID" as fixed text.**

> **REQ-077**: the "no eligible UID" copy uses the exchange name as a variable
> (title *"You have no eligible **{exchange} UID**"*, **hardcoding forbidden**)

A DEX has no UID; the identifier is a **wallet address.** These strings have to branch.

| REQ | Current | DEX |
|---|---|---|
| REQ-077 | *"You have no eligible {exchange} UID"* | *"You have no eligible {exchange} wallet"* |
| REQ-030 | *"You can no longer participate with this UID"* | *"…with this wallet"* |
| REQ-030 | *"Link a new UID to join again"* + `[Link UID]` | *"Link a new wallet…"* + `[Link wallet]` |
| REQ-028 | *"Choosing a new UID restarts this board from the beginning"* | *"Choosing a new wallet…"* |
| REQ-124 | `Link UID` button | `Link wallet` |

**The same applies in English** — `UID` → `wallet`, `You Can No Longer Participate with This UID` → `…This Wallet`.

> These strings live in the **hardcoded language pack (15 languages)** and need to branch by exchange type.

---

# 6. ✅ Rules that apply unchanged

Items that need no special DEX handling.

| REQ | Rule | For DEX |
|---|---|---|
| REQ-022 | Eligibility is judged **per UID, not per TUID** | judged per wallet |
| REQ-023 | Only UIDs registered from **30 days before** the join start. The reference is the **first registration date in the TetherMax DB** (unchanged by re-linking) | same |
| REQ-028 | The entry UID **cannot be changed** once registered | same |
| REQ-030 | **Ownership transfer or issue-UID designation → reset (`RESET`)**, a new UID may be chosen | **DEX has no ownership path, so the `OWNERSHIP_TRANSFER` branch never fires.** Only `ISSUE_UID` applies |
| REQ-031 | Losing it between tally start and payout → **forfeited (`FORFEITED`)**, no reward | same |
| REQ-032 | An ownership transfer **does not move the entry to the new TUID** | same |
| REQ-035 | **Non-member UIDs accrue gauge too**, backdated on linking | same for non-member wallets |
| REQ-114 | **An issue UID cannot be chosen as the entry UID** | same for issue wallets |
| REQ-108 | Terms in **15 languages** | same |
| REQ-053 | Phases advance at **00:00 UTC**; user screens **convert to device local time** | same |

## 6-1. ★ Ownership-transfer linkage — not applicable to DEX (2026-10-22)

Maxboard **checks ownership transfers directly** (REQ-032).

```
Checked   ① on user request
          ② at every daily bingo Batch (continuing past the join period until payout completes)
          ③ immediately before rewards are finalised and credited
Judged by the timestamp in the TetherMax account DB history
```

Since **ownership verification is confirmed unsupported on DEX** (V2 re-assessment §2-2),
**a DEX wallet is never reset or forfeited through `OWNERSHIP_TRANSFER`.**

| Cause | CEX UID | DEX wallet |
|---|:-:|:-:|
| `OWNERSHIP_TRANSFER` | ✅ | **n/a** |
| `ISSUE_UID` | ✅ | ✅ |

→ A DEX wallet can lose its entry eligibility in **exactly one way: being designated an issue wallet.**
→ Which makes **a DEX participant's reset risk lower than a CEX participant's.**

> **Knock-on for the backoffice:** the participant list shows four reason labels — `RESET(OWNERSHIP)`, `RESET(ISSUE_UID)`, `FORFEITED(OWNERSHIP)`, `FORFEITED(ISSUE_UID)`. **Two of them can never appear on a DEX board.** The user-facing copy is shared between causes and names no reason, so it still reads correctly.

---

# 7. Backoffice — DEX

## 7-1. Creating a board (REQ-001)

> **One board maps to one exchange.** Only one exchange can be selected at creation.

→ **Add the four DEXs to the exchange dropdown.**
(The same kind of work as the Global League creation form — see backoffice document §7-2.)

## 7-2. Menu location

```
League / Board                ← renamed from "League"
 ├─ Global League list
 ├─ Global League team list
 └─ Maxboard list             ← here
```

> **To confirm:** this menu was not visible in the admin LNB captures we have. It may sit below the visible scroll, or it may not be built yet.

## 7-3. Fields that cannot be edited after registration

> Confirmation dialog: *"Once registered, the **exchange, ranking on/off, period, cell conditions and reward amounts** cannot be changed"*

**Whether a Lighter board uses amount cells only has to be decided before registration.** It cannot be changed later.

## 7-4. Operational monitoring

| Metric | Content |
|---|---|
| Header summary | board name, current state, **exchange**, ranking, phase dates, **total cost per participant**, [Edit] · [Force close] |
| Status tab | entry UIDs, finishers, **streak cells activated**, completions per line (6), projected payout |

> **On a Lighter board, "streak cells activated" is always 0.** With amount cells only, the metric is meaningless.

---

# 8. Operational caution — overlapping periods on one exchange

> **REQ-002**: if two boards for the same exchange have overlapping join periods,
> **the same UID earns rewards twice from the same cashback**, so operations must not overlap them.
> (The system does not prevent it — **it is managed as an operating rule.**)

**There is no system block.** Take particular care when running DEX boards repeatedly.

---

# 9. Still to confirm

| # | Item | Status |
|---|---|---|
| 1 | **Whether Lighter can provide a daily ledger** | Added to the exchange API request document §4-3 item 6. **Awaiting reply — this decides whether a Lighter board runs at all** |
| 2 | **The final bingo Batch time** | PRD open issue `#BATCH`. Default 12:30 UTC (safe). **When settled, add the "after Aster 09:00" condition** |
| 3 | DEX board **cell layout and reward amounts** | Undecided. See §6.2 for the reward design principles. **The first candidates are ApeX, EdgeX and Aster** |
| 4 | How *"{exchange} UID"* **branches by exchange type** | Needs a language-pack key design |
| 5 | Whether the `LINK UID` coupon policy affects **board eligibility** | A separate benefit, but the copy overlaps — needs checking |

> **Added 2026-10-22** — the split documents (22 files, Korean and English) contain **no mention of `DEX`, `Lighter` or `Aster` anywhere.** Maxboard was designed without DEX in scope, so every item above is an addition rather than an adjustment.

---

# 10. Summary

```
Applicable      ✅ yes. No volume needed; everything is cashback-based

Two conflicts
  ① Lighter streak cells impossible  → a settlement change is a precondition.
                                       Without it, no Lighter board (settled)
  ② Bingo Batch time                 → add the "after Aster 09:00 UTC" condition

Changes needed
  · "UID" → "wallet" branching (5 REQs, 15 languages)
  · Add the four DEXs to the board-creation exchange dropdown

Applies unchanged   eligibility, backdating, reset, forfeiture, issue UID,
                    phase advancement — 10 REQs
```
