# DEX integration — decision log

Settled: 2026-10-21 · Extended: 2026-10-22
Basis: analysis of the six existing PRDs (MAX-8/10/18/30/431/466) plus the Maxboard PRD, followed by a Q&A round

> This records the answers to 38 questions plus 5 follow-ups, as given.
> Each ID is cited as the source when the change is applied elsewhere.

---

## A. Reward policy

| ID | Decision | Impact |
|---|---|---|
| **A-1** | **Event rewards are paid on DEX too** (the structure changed so that TetherMax receives the commission) | Add an `Event Reward` row to the withdrawal modal. Show event rewards in cashback history |
| **A-2** | **Invite rewards can be withdrawn on DEX. Treated identically to a CEX UID.** | Four strings in the design must change, plus a behaviour change in the payout modal |
| **A-3** | **The payout network (chain) is undecided.** A separate owner will research it and decide via a C-level report | Everything that depends on the network is marked `to be sized once the chain is settled` |

### Consequence of A-1 — the matching constraint still applies

```
Actual payout = A + MIN(B, A)       A = cashback, B = event reward
```
**If DEX cashback (A) is zero, the event reward cannot be withdrawn either** (MAX-18 case #4).
Paying event rewards on DEX does not lift this constraint.

### Consequence of A-2 — four strings to change

| Location | Current string | Action |
|---|---|---|
| Partner Hub Linked Accounts | *"DEX wallets earn you no Invite Rewards."* | **Delete** |
| Partner Hub T&C | *"Invite Rewards are only earned on centralised exchange cashback. Sub-accounts trading on DEXs do not generate Invite Rewards."* | **Delete** |
| Invite-friends T&C | *"Trading on DEXs such as Lighter, ApeX, EdgeX and Aster does not earn Invitation Rewards"* | **Delete** |
| Invite-reward payout modal | *"can only be withdrawn to a linked centralised exchange UID"* + CEX UIDs only | **Delete the string and add DEX wallets to the list** (behaviour change) |

※ The **sub-of-sub exclusion** belongs to trading commission and has nothing to do with invite rewards.
The invite-reward sub-exclusion is **TetherMax's own internal logic**, and **DEX follows it exactly as before** (Q4).

---

## B. Facts confirmed

| ID | Finding |
|---|---|
| **B-1** | **The UID field is case-sensitive.** Lowercase input returns nothing → **follow the current system.** No separate branch is needed for DEX wallet input |
| **B-2** | MAX-30's `update_time` = the admin's `Exchange Management > Updated (UTC)` — **correct** |
| **B-3** | **DEX cashback counts** toward the Global League team-creation thresholds (500 cumulative / 100 in 30 days) |
| **B-4** | The ownership guide slides are **produced by Content BD** |
| **B-5** | Linking is blocked at **10 USDT or more unclaimed**. Follow the current system; **the same applies to DEX** |

> **B-1 note:** QA50–QA64 in the MAX-30 PRD specify automatic uppercasing, which does not match reality.
> The PRD is either unimplemented or out of date. **We follow the current system.**
>
> **B-5 note:** the MAX-30 PRD says `FAILED_NEED_RECEIVE = remaining payback ≥ 100 USD`, but the real value is **10**. It appears to have been adjusted alongside the minimum withdrawal dropping from 50 to 10.

---

## C. Language pack / document scope

| ID | Decision |
|---|---|
| **C-1** | **Areas the admin does not localise into all 15 languages → the hardcoded language pack covers all 15.** Areas where the admin supports only KO/EN → KO/EN only |
| **C-2** | MAX-8 is **final.** The `IN REVIEW` in the PDF is a stale Jira status |
| **C-3** | (withdrawal failure reasons — merged into F-5 below) |

### Applying C-1

```
Hardcoded language pack: 101 items × 15 languages = 1,515            ← unchanged
Admin-operated items: 23, each keeping its existing coverage          ← same for DEX, no separate classification
```
※ **Q5** — the 23 admin-operated items **work exactly as they do today, so we are not investigating them separately.**

> **Qualified 2026-10-22** — MAX-466 states that the Benefits area manages **KO and EN only** with EN fallback, and the exchange guide content is **KO/EN only** by instruction. So the 1,515 figure applies to the hardcoded pack, not to everything. Separate the 15-language areas from the KO/EN areas before sizing the work.

---

## E. Admin field definitions

| ID | Decision |
|---|---|
| **E-1** | Exchange detail `Cashback (%)` = **the share of the fee the user paid that is returned to them.** 100 means the entire fee is returned |
| **E-2** | The aggregation-date dropdown's `4 days ago` → **extend it** (to cover Lighter's weekly aggregation) |
| **E-3** | Event push defaults to **Y**. Both `WITH` and `EXCHANGE` **exist** |
| **E-4** | The partner ratio field **does not need attention.** The only change is *"not possible on DEX in V1 → now possible on DEX"* |
| **E-5** | Member grade **`U` = User**, **`A` = Affiliate (partner)** |
| **E-6** | Event reward claw-back = **an admin can reclaim the full remaining amount on a UID by entering the amount** |
| **E-7** | **`Received` = the amount withdrawn**, **`Remaining` = the balance** |
| **E-8** | The server stores **only the cashback rate and the margin rate.** **The commission rate is not stored** |

### E-8 — how the rates relate

```
Commission rate, cashback rate   denominator = the fee the user paid
Margin rate                      denominator = the commission

e.g. commission rate 60%, cashback rate 54%
     margin = 6pp (of the fee)
     margin rate = 6 / 60 = 10%          ← the value stored on the server
     commission rate = cashback rate ÷ (1 − margin rate) = 54 ÷ 0.9 = 60%   ← derived
```

| Q1 | **The commission rates for the four DEXs are undecided.** The Hub comparison table's Lighter 20% / ApeX 30% / EdgeX 30% / Aster 20% are **cashback rates** (what the user sees); the commission and margin rates come later |

> **★ 2026-10-22 — this field is now a blocker.** See "DEX margin rate conflict" below.

---

## F. Gas — ★ settled

| ID | Decision |
|---|---|
| **F-1** | **TetherMax absorbs the gas in full.** |
| **F-2** | **Check the gas and send it with the payout.** If the customer requests 10, **exactly 10 must arrive in their wallet** |
| **F-3** | **Do not show the fee on any user screen.** (No `Network fee` row in the confirm modal) |
| **F-4** | The four undecided numbers (daily A→B transfer / buffer ratio / days of gas cached / first-day cap) are **sized once the chain is settled** |
| **F-5** | **Gas is treated as a pure loss.** That is the business decision |

### Consequence — what Wallet B needs

```
Wallet B required = Σ(customer payouts) + Σ(gas)
```
At 2–5 USDT of gas per transaction, **a single 10 USDT payout costs TetherMax 12–15 USDT.**
In a structure that passes 100% of the cashback to the user, **gas is a total loss.**

→ **This is the central evaluation criterion for A-3 (network research).**
The researcher should be asked to size **"gas per transaction × expected payout count = monthly loss."**

### Withdrawal failure modes (DEX-specific)

A CEX withdrawal is an internal ledger move, so none of these occur there.

| Cause | Description |
|---|---|
| Gas spike | gas exceeds the configured ceiling just before sending |
| Nonce collision | ordering breaks when the same wallet sends concurrently |
| RPC timeout | the node does not respond — **it is unknown whether it was sent** |
| Wallet B underfunded | rebalancing runs once a day and the balance ran out in between |
| Chain congestion | the transaction sits pending for a long time |

---

## G. Non-member withdrawal

| ID | Decision |
|---|---|
| **G-1** | **Non-members can use DEX exactly as they use CEX.** |
| **G-2** | **No abuse mitigation needed.** Only the full amount can be withdrawn at once, so repeated withdrawals cannot burn gas |
| **G-3** | **Non-members never had notifications.** Current policy stands |

---

## H. Per-exchange risks

| ID | Decision |
|---|---|
| **H-1** | **Build the post-expiry Aster screens.** No auto-renewal → *"the connection has lapsed, please reconnect"* plus a re-link CTA |
| **H-2** | **If we can see a Lighter account tier, we must display it.** |
| **H-3** | EdgeX internal ID — **transfers use the wallet address, so it works.** The internal ID is for **verification and evidence**, and that part is weak |
| **H-4** | Blocking linking at 10 USDT unclaimed applies to **every exchange.** ApeX was singled out because **in V1 only ApeX required the user to claim manually, so an unclaimed balance has already built up** |

### H-2 rationale — tier detection already works at link time
- The link modal **L10** warns when a Standard address is entered
- The exchange detail page has `Premium | Plus` tabs and states *"Cashback applies to Premium and Plus"*

**→ But nothing in the ledger API lets us track a tier change after linking.**
If a user later drops to Standard, cashback stops and we cannot detect it.
→ **Add `account_tier` to the exchange API request document.**

---

## I. Ownership and schedule

| ID | Decision |
|---|---|
| **I-1** | **Ignore the schedule.** (The 6-week policy announcement / 10-week EdgeX / Nov–Dec plan inconsistencies are set aside) |
| **I-2** | Operational risks ② and ③ are defined as **"the minimum transfer that keeps a buffer."** But **this cannot be sized until the chain is chosen**, so it is not a decision for now |
| **I-3** | The home screen is designed by someone else. Documents should note **"Andrew's plan takes precedence"** |
| **I-4** | All the PRDs we were given are **final.** |

---

## J. Admin screens not yet built

| ID | Decision |
|---|---|
| **J-1** | **Spending Estimate = the Hub's `CASHBACK ESTIMATE` calculator** (confirmed from the attached image) |
| **J-2** | The ELC landing content editor — **to be built later** |
| **J-3** | **Build manual DEX linking for now.** Approval condition = the record exists in the partner ledger (no operator discretion) |
| **J-4** | Ownership-claim Slack alerts use **the existing channel** |

### ★ There are two calculators

| | Input | Output | Purpose | Status |
|---|---|---|---|---|
| **Spending Estimate** | monthly volume slider | estimated cashback | sign-up driver | designed, in the Hub |
| **Matching Calculator** (MAX-18 §5-9) | cashback and reward sliders | claimable amount + eligibility | explains `A+MIN(B,A)` | **design not seen** |

---

## K. Benefits and ranking

| ID | Decision |
|---|---|
| **K-1** | **Both the cashback ranking and the Global League are based entirely on cashback.** Not on volume |
| **K-2** | `Claim your first cashback` (first withdrawal, 10 USDT) **applies to a first DEX withdrawal too** |
| **K-3** | (per-benefit completion criteria — MAX-466 OQ-2. We define the DEX part) |

### Consequence of K-1 — drop `volume`

| Item | Previously | Settled |
|---|---|---|
| Global League | conditional (depends on `volume`) | **supported** — cashback-based |
| Cashback / monthly ranking | conditional (depends on `volume`) | **supported** — cashback-based |
| Maxboard | unverified | **supported** — gauge, streak and ranking are all cashback-based |

→ **Remove the optional `symbol` and `volume` asks from the exchange API request document.**

### Consequence of K-1 — copy to change

The monthly ranking screen (`Monthly Top Trader Rewards`) currently reads:
> *"Top traders each month earn exclusive rewards based on **trading activity**"*

Since it is cashback-based, replace **`trading activity` with `cashback earned`.**

---

## L. Content

| ID | Decision |
|---|---|
| **L-1** | **Produce every piece of new content required.** For now we only acknowledge that; the writing happens later |

To produce:
- ELC venue card body copy (4 DEXs)
- Exchange guide — how to find your wallet address (4 × mobile/PC)
- ~~Ownership guide slide text~~ ※ ~~Content BD owns it (B-4)~~ → **cancelled for DEX by P-1**
- Exchange terms and cautions (KO/EN)
- Outbound-link modal copy
- Post-expiry Aster copy (H-1)

> **2026-10-22** — six items became **five** once the ownership guide was dropped.

---

## M. Maxboard (new analysis)

PRD repository: `github.com/matthewforwork1213-collab/max_board-bingo-`

### Structure

```
Maxboard = a 3×3 bingo board, run repeatedly, one exchange at a time

  Amount cell — check it by spending gauge once the cashback target is reached
  Streak cell — opens after N consecutive days of cashback (spends no gauge; stays open once opened)

Rewards   3 rows + 3 columns + 1 full board = up to 7, no cap on participants
Ranking   on/off per board. Finishers only, by total cashback, refreshed daily
Eligible  a UID in the TetherMax DB from 30 days before the join start (UID, not TUID)
Backdating  accrues from the join start date. The non-member period counts
Batch     the bingo Batch runs once a day at a time shared by every exchange (undecided, #BATCH)
```

| M-1 | **We intend to open DEX boards on Maxboard.** (Q3) |

### ★ M-2. The Lighter streak-cell problem

> **REQ-040**: a streak cell opens after **N consecutive days** of cashback, by **cashback batch posting date**

| Exchange | Settlement | Streak cell |
|---|---|---|
| **Lighter** | **weekly (Monday)** | ❌ not even two days in a row |
| ApeX | hourly | ✅ |
| EdgeX | daily, 00:00 UTC | ✅ |
| Aster | daily (published 09:00) | ✅ |

**Decision (Q2):** **proceed on the assumption that it is possible.**
If the settlement cycle cannot change it is impossible anyway, so **include the request to change Lighter's settlement cycle in the exchange API request document.**
If it cannot change, **build the board from amount cells only** (PRD **REQ-113** already supports this: *"if there are only amount cells, hide the streak card and show the remaining card at full width"*).

> **Superseded by O-2** — the amount-cells-only fallback **was not adopted.** See below.

### ★ M-3. Bingo Batch time vs Aster 09:00

> **REQ-036**: the bingo Batch runs once a day at **a fixed time shared by every exchange**, after the Bitget cashback batch (time undecided, `#BATCH`)

Aster **calculates at 00:00 UTC and publishes after 09:00.**
If the bingo Batch runs before 09:00 UTC, **Aster cashback slips a day every day, and the streak test slips with it.**

→ Add **"after Aster's 09:00 UTC"** to the bingo Batch time conditions.

### M-4. Other DEX touchpoints

| REQ | Content | For DEX |
|---|---|---|
| REQ-022/023 | Eligibility is **per UID**, registered from **30 days before** the join start | Same for wallets. The reference is the first registration date in the TetherMax DB |
| REQ-028 | The entry UID **cannot be changed** after registration | Same for wallets |
| REQ-030/115 | **Ownership transfer or issue UID → reset (RESET)** | ~~Same when a DEX wallet's ownership transfers~~ → ⚠️ **Reversed by P-1. A DEX wallet has no ownership path, so only the `ISSUE_UID` branch fires** |
| REQ-035 | Non-member UIDs accrue gauge, backdated on linking | Same for wallets |
| REQ-063 | *"cashback posting is delayed"* when the batch is late | May conflict with the DEX D+1 00:00 UTC refresh |
| REQ-108 | Terms in **15 languages** | Consistent with C-1 |
| REQ-077 | *"You have no eligible {exchange} UID"* — exchange name is a variable, **hardcoding forbidden** | DEX needs "wallet", not "UID" |

---

## N. Policies shared across the PRDs

| ID | Content |
|---|---|
| **N-1** | **Local time display** — even when the server returns UTC, the front end converts to the device's local time. Relative times such as countdowns are excluded |
| **N-2** | **Store aggregates hourly** — anywhere that displays a daily aggregate, the backend stores at one-hour granularity with a UTC timestamp on each record; the client re-aggregates by the user's local date |
| **N-3** | Every screen must support **both dark and light** |

**N-2 has to be added to the DEX ledger API requirements.** The request document currently says only "D-day trades → 24h aggregate → shown on D+1", so **the hourly timestamp requirement is missing.**

---

## Applied — round 1 (groups A–N), 30 items

| # | Document | Change | Source |
|---|---|---|---|
| 1 | 1_Exchange API request (KO/EN) | **Remove** optional `symbol` and `volume` | K-1 |
| 2 | 〃 | Add **hourly timestamp retention** | N-2 |
| 3 | 〃 | Add **`update_time`** (settlement cycle and time) | B-2 |
| 4 | 〃 | Add **`account_tier`** (Lighter tier tracking) | H-2 |
| 5 | 〃 | Add the question **"does cashback still accrue after Aster expiry?"** | H-1 |
| 6 | 〃 | Add the question **"can Lighter move to a daily ledger?"** | M-2 |
| 7 | 3_Linking and withdrawal flow (KO/EN) | Correct the formula to **`A + MIN(B, A)`** | A-1 |
| 8 | 〃 | Add the **gas policy** (absorbed in full / received amount guaranteed / not shown / pure loss) | F-1–F-5 |
| 9 | 〃 | Wallet B required = Σ payouts + Σ gas | F-2 |
| 10 | 〃 | The four undecided numbers → **sized after the chain is settled** | F-4, I-2 |
| 11 | 〃 | **Non-member DEX withdrawal allowed** | G-1–G-3 |
| 12 | 〃 | Minimum withdrawal 10 / linking blocked at 10 unclaimed | B-5 |
| 13 | 〃 | **Five on-chain failure modes** | F-5 |
| 14 | 5_Add-on services (KO/EN) | Global League and ranking **conditional → supported** | K-1 |
| 15 | 〃 | **Maxboard → supported** (with the Lighter streak caveat) | M-1, M-2 |
| 16 | 〃 | UID ownership claim **not supported → supported** | design O0–O16 |
| 17 | 〃 | Invite reward **→ supported** | A-2 |
| 18 | 2_Screen changes | Delete the four invite-reward DEX strings + change the payout modal behaviour | A-2 |
| 19 | 〃 | Monthly ranking `trading activity` → `cashback earned` | K-1 |
| 20 | 〃 | Hub calculator `Paid into your Lighter account` → `Paid to your TetherMax balance` | A-1 |
| 21 | 〃 | **New post-expiry Aster screens** | H-1 |
| 22 | 〃 | Add a **`Weekly`** settlement badge | B-2 |
| 23 | 〃 | **Show event rewards** in cashback history | A-1 |
| 24 | 〃 | Mark home items **"Andrew's plan takes precedence"** | I-3 |
| 25 | 4_Backoffice vs hardcoded (KO/EN) | Confirm the language pack at **101 × 15 = 1,515** | C-1 |
| 26 | 〃 | New: **Exchange Guide → UID Ownership Verification** slides | MAX-431 |
| 27 | 〃 | **Add the four DEXs** to the league creation exchange dropdown | MAX-10 |
| 28 | 〃 | **Extend the aggregation-date dropdown from 4 to 7 days** | E-2 |
| 29 | 〃 | **Manual DEX linking** (approval: present in the partner ledger) | J-3 |
| 30 | New | **Maxboard DEX impact** document | M-1–M-4 |

> ⚠️ Item 16 was **reversed on 2026-10-22** by P-1 — ownership verification is not supported on DEX.

---

## O. Additional decisions, 2026-10-21 (round 2)

| ID | Decision | Impact |
|---|---|---|
| **O-1** | **We are not doing My Portfolio.** The feature does not exist | Confirms one "not supported" in the re-assessment. No follow-up |
| **O-2** | **No Lighter Maxboard unless the settlement cycle changes** | The amount-cells-only fallback is **not adopted.** First candidates: ApeX, EdgeX, Aster |
| **O-3** | **Leave the Aster expiry work for now** | Keep the question about post-expiry accrual, but lower its priority |
| **O-4** | **Add a DEX group to the `Linked exchanges` audience filter** | New admin work. See O-4 detail below |

### O-2 — why the amount-cells-only option is not used

The PRD **already supports** an amount-cells-only board (REQ-113, REQ-122).
This is **an operational judgement, not a technical constraint.**

> The streak cell is the differentiator named in service plan §4.1 — *"streak cells build a trading habit."*
> Without it, one of Maxboard's core values disappears.

→ **Lighter's answer on a daily ledger decides whether a Lighter board runs at all.**
→ If the policy changes later, an amount-cells-only board can be made **from backoffice settings alone.** No development needed.

### O-4 — the manual-push audience filter

**Screen confirmed:** `Push > Manual push > [Choose audience] > Push selection` (direct filter)
Six conditions combine to narrow the audience.

```
1. Member type       [All] [Has commission cashback] [None]
2. Commission cashback   Amount type ▾ [min] ~ [max]
   2-1. Event reward     Amount type ▾ [min] ~ [max]
3. Withdrawal        [All] [Has withdrawn] [Never]
4. Last login        [start] — [end]
5. Linked exchanges  ( )AND (●)OR  [Select all] [WOO X Pro] … [None]   ★ the request
6. Date              Date type ▾ [start] — [end]

Top right: [Cashback Excel upload]    Bottom: Recipients: N → [Confirm audience]
```

#### ① The request — add a DEX group to item 5

```
CEX  [All CEX] [WOO X Pro] [Bitget] …
DEX  [All DEX] [Aster] [Lighter] [ApeX] [EdgeX]   ★ new
     [None]                                        ← outside both groups
```

| # | Question | Options |
|---|---|---|
| 1 | Scope of `Select all` | (A) keep it global / **(B) rename to `All CEX` and add `All DEX`** / (C) group-header checkboxes |
| 2 | Migrating saved conditions | needs redefining if (B) is taken |
| 3 | Meaning of `None` | (a) no CEX and no DEX / (b) no CEX only → **(a) recommended** |
| 4 | AND/OR between groups | one shared operator, or per group |

#### ② ★ More important than the chips — the other four conditions

**This is not a screen where adding chips finishes the job.** The aggregation scope of every other condition is undefined.

| Condition | Question | If missed |
|---|---|---|
| 1. Member type | Does `has commission cashback` count DEX? | A DEX-only member is classed as **"none" and drops out of sends** |
| 2. Commission cashback | Is the amount range CEX + DEX? | Amount-band targeting drifts |
| 2-1. Event reward | Are DEX event rewards included? | Violates A-1 |
| 3. Withdrawal | Are DEX withdrawals included? | In V2 the withdrawal is through TetherMax, so including them is natural |
| 6. Date | Does `Date type` need a DEX basis? | The dropdown has not been checked |

**Recommended principle: combine CEX and DEX for 1, 2, 2-1 and 3.**
In V2, DEX cashback accrues to the same TetherMax balance and is withdrawn from TetherMax, so there is no basis for splitting.

#### ③ `Cashback Excel upload` — wallet-address support unconfirmed

> ✅ **Resolved 2026-10-22.** The upload has no fixed template — it was built as a fallback for exchanges with no commission-lookup API. All four DEXs provide one, so it is **not on the DEX path.**

#### ④ Scope — confirm with engineering whether coupons, email, newsletter and invite-friends share the same builder

> 🟢 **Largely resolved 2026-10-22.** Manual push, manual coupon and the event-notice email all carry **the same ~40-chip list**, test rows and the `None` chip included. The email campaign is the only outlier at 18 in a single-select dropdown.

#### ⑤ Tidying the exchange names is out of scope

The list contains `test` and `QAHL*` entries, but that is **separate from the DEX work and low priority.**
Recorded only. (Same as `B-7-12`)

---

## Applied — round 2 (group O), 6 items

| # | Document | Change | Source |
|---|---|---|---|
| 31 | 5_Add-on services (KO/EN) | My Portfolio **confirmed — not doing it** | O-1 |
| 32 | 〃 | Lighter Maxboard **conditional on a settlement change**; fallback not adopted | O-2 |
| 33 | 7_Maxboard | Same, plus naming ApeX, EdgeX and Aster as the first candidates | O-2 |
| 34 | DEX/08_Admin screens | New **13-9 manual-push audience filter** (13-9-0 to 5) | O-4 |
| 35 | 〃 | Policy decisions 12 → **21** (including round 3) | O-4, O-5 |
| 36 | 4_Backoffice (KO/EN) | New **7-5 manual-push audience filter** | O-4 |

---

## O-5. Round 3, 2026-10-21 — the email campaign (further captures)

**Screen:** `Email > Email campaign > New campaign > ② Audience > [Filter]`

```
①Compose ─ ②Audience ─ ③Review ─ ④Test send ─ ⑤Send

[Filter] [Excel upload]
┌ Audience filter — all filters combine with AND ──────┐
│ [Cumulative commission ▾] [≥ ▾] [enter a value]  🗑 │
│ [Exchange              ▾] [= ▾] [dropdown ▾]     🗑 │
│ [+ Add filter]                                       │
└──────────────────────────────────────────────────────┘
```

### ① The request — add the four DEXs to the `Exchange` dropdown

Currently 18, all CEX:
```
Toobit · HTX · BloFin · Bitunix · Zoomex · KuCoin · BlockFin · LBank
Gate · DeepCoin · BingX · Flipster · MEXC · OKX · Bybit · Binance
Bitget · WOO X Pro
```

### ② ★ It is **a separate implementation** from push

| | Manual push | Email campaign |
|---|---|---|
| Pattern | six fixed condition blocks | key-operator-value rows, added dynamically |
| Exchange choice | multi-select chips | **single dropdown** |
| Operators | AND / OR toggle | **AND only** |
| Exchange list | **~40** (test rows included) | **18** (no test rows) |

→ **Not a shared component. Each has to be fixed separately.**

### ③ ★ The exchange list differs per screen — this is the fork in the workload

```
Possibility ① each screen hardcodes its own        → fix all 23 points individually
Possibility ② one API with different filters       → fix the filter conditions
Possibility ③ per-screen visibility flags          → set the flags
```
**Engineering has to confirm this before the DEX workload can be sized.**

### ④ Whether `Cumulative commission` includes DEX — the same question as O-4 ②

### ⑤ Full audit of exchange selection points — 23

| Group | Count | Status |
|---|---:|---|
| A. Confirmed from captures | 10 | applied |
| B. Confirmed from PRDs | 3 | applied |
| **C. Inferred — captures needed** | **10** | **pending** |

**Group C priority:** coupons · newsletter · event-notice email (all dispatch-related, so almost certainly present)

> 🟢 **Updated 2026-10-22.** Coupons, the event-notice email and the invite-reward screens were checked directly. **Newsletter and invite-reward history have no exchange dimension and are out of scope.** Six remain (VIP, points, Excel, app, SEO, design) and are low priority.

---

## Applied — round 3 (O-5), 5 items

| # | Document | Change | Source |
|---|---|---|---|
| 37 | DEX/08_Admin screens | New **13-10 email campaign audience filter** | O-5 |
| 38 | 〃 | New **13-11 full audit of exchange selection points** (A10/B3/C10) | O-5 |
| 39 | 4_Backoffice (KO/EN) | New **7-6 email campaign audience filter** | O-5 |
| 40 | 〃 | New **7-7 full audit of exchange selection points** | O-5 |
| 41 | 00_Folder guide | New **§2-2** (rounds 2 and 3) and **§3** (5 unapplied) | O-4, O-5 |

---

## Status

### Applied

```
Round 1 (A–N)      30   PRD analysis + 38 Q&A
Round 2 (O-1–O-4)   6   My Portfolio · Lighter · Aster · manual push
Round 3 (O-5)       5   email campaign · full audit
Round 4 (P)         7   ownership reversal · LINK UID coupon
──────────────────────
Total              48
```

**Full cross-check: 0 omissions across 55 verification items.**

### Unapplied — 5 → **2** (updated 2026-10-22)

| # | Item | Status |
|---|---|---|
| ~~1~~ | ~~Rewrite the 13 notifications in FCM.xlsx and EMAIL.xlsx~~ | ✅ **Done (10-22).** The 13 V1 drafts rewritten for V2, plus a new `Notifications_DEX_EN.md` |
| ~~2~~ | ~~English version of document 2~~ | ✅ **Done (10-22)** — `Screen_Changes_Required_EN.md` |
| ~~3~~ | ~~English versions of documents 6 and 7~~ | ✅ **Done (10-22)** — this file, `Existing_PRD_Analysis_EN.md`, `Maxboard_DEX_Impact_EN.md` |
| 4 | Group C admin, 10 screens | 🟢 **Largely resolved (10-22).** Six low-priority screens remain |
| 5 | Content drafts, 6 → **5** | ⬜ Only "we will produce them" is settled (L-1). The ownership guide was **dropped by P-1** |

---

## P. Additional decisions, 2026-10-22 (round 4) — ★ includes a reversal

| ID | Decision | Impact |
|---|---|---|
| **P-1** | **DEX does not support ownership verification** | **Reverses** the 10-21 "supported" verdict. Six knock-ons |
| **P-2** | **The `LINK UID` coupon (3 USDT) excludes DEX** | A wallet link cannot complete the mission. The only exception among the benefits |

### P-1 — the reversal

On 10-21 this was raised to **supported** on the strength of the design (17 states, O0–O16).
**Policy then settled it as unsupported on DEX.**

**The design is not wasted — O0–O16 remains in use on the CEX path.**

| What disappears | Status |
|---|---|
| Claim pages O3–O10 · review states O11–O16 | n/a for DEX |
| 30-day cooldown · `FAILED_RECENT_POSSESSION` | n/a for DEX |
| Three ownership notifications | n/a for DEX → notification rewrite scope **drops by three** |
| Guide slides, **4 DEX × 2 devices × N** | **not needed** |
| Video player on the admin review screen (DEX rows) | not needed |
| Maxboard `OWNERSHIP_TRANSFER` reset branch | **never fires** on a DEX wallet |

**Verdict distribution:** `O 27 / X 1` → **`O 26 / X 2`**

**🔴 The gap this leaves** — a wallet address is public on-chain. A user can link an address they do not own, and with no ownership path **support is the only correction.**
→ **The support rule has to be decided** (unlink on request, or require evidence).

> **2026-10-22 correction** — the live FCM sheet carries **two** ownership rows, not three. There is no separate rejection row. The notification rewrite scope drops by two, not three.

> **Four further knock-ons found 2026-10-22**, on screens that never mention ownership: the review `✓ Verified` badge; Maxboard's reset/forfeit state machine (half unreachable, two of four admin reason labels never appear); the linked-UID unlink warning; and the wrong-wallet trap created by Maxboard's premise that a user cannot unlink a UID themselves.

### P-2 — `LINK UID` coupon excludes DEX

| Benefit | Amount | DEX |
|---|---|---|
| **`LINK UID`** (Priority 16) | 3 USDT | **excluded** |
| Everything else | — | applies |

**Five actions**

```
1. A CEX-only badge on the benefits list row
2. "Linking a DEX wallet does not complete this" on the detail page
3. Add a CEX condition to the completion check
4. Rewrite the copy — "exchange UID" currently reads as though any exchange qualifies
5. Hide DEX wallets in the coupon-wallet picker, for this coupon only
```

> MAX-466 OQ-2 (per-benefit completion criteria) is a dev blocker, and **the DEX part is defined by P-2.**

---

## Applied — round 4 (group P), 7 items

| # | Document | Change | Source |
|---|---|---|---|
| 42 | 5_Add-on services (KO/EN) | Verdicts **O 27/X 1 → O 26/X 2**, §2-2 rewritten | P-1 |
| 43 | 〃 | New **§3-0 `LINK UID` coupon excludes DEX** | P-2 |
| 44 | 〃 | Ch. 9 **three ownership notifications excluded for DEX** | P-1 |
| 45 | 7_Maxboard | **§6-1 rewritten — ownership transfer n/a for DEX** | P-1 |
| 46 | 4_Backoffice (KO/EN) | §7-1 **DEX slides not needed**, video player CEX-only | P-1 |
| 47 | 2_Screen changes | New **16-10 coupon exclusion · 16-11 ownership unsupported** (101 → 103) | P-1, P-2 |
| 48 | Prototypes (user / backoffice) | Both decisions applied + **JS SyntaxError fixed** | P-1, P-2 |

---

### Undecided — awaiting external input

| Item | Owner |
|---|---|
| Payout network (chain) | separate research → C-level |
| Commission and margin rates for the four DEXs | commercial negotiation |
| Buffer ratio · days of gas cached · daily transfer · first-day cap | after the chain is settled |
| **Whether the exchange list has a single source** | **engineering — a precondition for sizing the admin work** |
| Partial-failure policy for multi-account withdrawals | discussion with the MAX-18 owner |
| Whether Lighter can provide a daily ledger | partner reply — **decides whether a Lighter Maxboard runs** |
| **How duplicate DEX wallets are handled** | **support — unlink on request, or require evidence (P-1)** |
| Whether Aster commission accrues after expiry | partner reply |

---

## Settled 2026-10-22 — the CEX / DEX distinction in the UI

### Q — do we separate CEX and DEX on each screen?

| Mode | Scope | Settled |
|---|---|---|
| **Merged** | Withdrawal, **one place** | **Do not split DEX and CEX into tabs.** Keep the existing policy — list them in priority order and withdraw everything at once |
| **Distinguished** | **Every other screen** | CEX and DEX are **distinguished.** But the `Exchange` selector stays **one dropdown button**, with CEX and DEX separated **inside it** |

> In the user's words — *"in commerce, checkout doesn't separate tops from bottoms (and TetherMax cannot withdraw only part of a balance), but filtering results does."*

### Where it applies

| Screen | Mode | Note |
|---|---|---|
| Withdrawal (DW1 · DW2 · DW6) | **Merged** | every eligible account in one list |
| Non-member withdrawal (NM) | n/a | structurally a single wallet |
| Cashback history filter | Distinguished | one `All Exchanges ▾` + groups inside |
| Event list filter | Distinguished | named directly by the user |
| Hub comparison table | Distinguished (already) | filter chips already in place |
| Guest link list (E4) | Distinguished (already) | chips + a `DEX` badge — **the reference pattern** |
| Coupon · challenge · league account pickers | Distinguished | selection UI also groups inside one list |
| Invite-reward payout picker | Distinguished | ⚠️ its own 50 USDT minimum — confirm the grouped pattern applies |
| Admin cashback history | Distinguished | `Exchange: All ▾` with groups inside |
| Admin manual push (SD-1) | Distinguished (already) | already has CEX / DEX groups — **the admin reference pattern** |
| Admin email campaign (SD-2) | Distinguished | add group headers to the single dropdown |
| Admin partner registration (AC-3) | Distinguished | separate the chip groups |

### Knock-on — the admin gap a merged withdrawal creates

A merged withdrawal produces **several ledger rows from one user action.** The admin `All cashback history` has **no way to tell they belong to the same request.**

- Operations cannot distinguish **one two-account request** from **two separate requests**
- When an on-chain leg fails partially, that distinction is the first thing support needs
- → **A shared request ID column**, or grouping by it, is required (a new requirement)

### Still to confirm

| Item | Detail |
|---|---|
| Grouped dropdown spec | what `All` means (both groups, or within the active group) · whether each row needs a `DEX` badge when the group header already says DEX · behaviour at phone width — **define once and reuse** |
| Claim modal branches | the 1 / ≤5 / >5 branches see a different count once four DEX wallets exist. Do group headers count toward the threshold? |
| Invite-reward payout | its own 50 USDT minimum sits between the merged and distinguished rules |
| Merged request ID | a new column is needed in the admin ledger |

---

## Discovered 2026-10-22 — the DEX margin rate conflicts 🔴

This surfaced while adding `Exchange referral management` to the backoffice prototype. **The recommendation in doc 08 §10-2 no longer holds under V2.**

### What broke

Doc 08 §10-2 recommended **(a) add DEX rows with a margin rate of 0**, on this basis:

> If an exchange's margin rate is 0, neither the user nor the partner generates an invite reward → no blocking logic needed

That recommendation assumes **"DEX generates no invite reward." A V1 premise.**

| Decision | Content | Date |
|---|---|---|
| A-19 | **DEX invites do generate invite rewards. DEX rows show the real cumulative amount** | 2026-10-20 |
| A-2 (user's answer) | DEX invite rewards **supported** | 2026-10-22 |

→ **A margin rate of 0 no longer enforces the policy automatically; it now contradicts it.**

### One field, two formulas, opposite behaviour

| Formula | DEX handling | Why |
|---|---|---|
| `cashback = total commission × (1 − margin rate)` | **must be bypassed entirely** | TetherMax does not calculate DEX cashback. It takes the amount the DEX reports, unchanged |
| `invite reward = downline withdrawal × exchange margin × reward ratio` | **must apply, and be non-zero** | At 0, A-19's "real cumulative amount" is always zero |

> **Implementation requirement** — **split this field by path.** Ignore it on the cashback path; use it only on the invite-reward path. Without this in the spec, DEX cashback silently becomes whatever the formula produces.

### One input already changed in V2

| Input | V1 | **V2** |
|---|---|---|
| Downline withdrawal | **0** — DEX had no TetherMax withdrawal | **a real number** — DEX withdraws through TetherMax |
| Exchange margin | planned to be 0 | **undecided — see below** |

Doc 08's statement that "DEX withdrawal is 0, so it zeroes out automatically" is void with it.

### 🔴 The commercial decision that is blocking

| | |
|---|---|
| **V2 premise** | **100% of the commission goes to the trader** → TetherMax has **no DEX margin** |
| **A-19 requires** | DEX invite rewards **must exist** → there **must be** a margin |
| **Therefore** | either the passthrough is not actually 100%, or **DEX invite rewards are funded from somewhere other than the margin** |

**This is a commercial judgement, not an implementation problem.** Until it is settled, the four DEX rows on the referral screen cannot be filled, and DEX rows in the user-facing invite reward are fixed at `0.00` — where listing them looks more broken than omitting them.

> **Sharpened 2026-10-22** — the reward ratio is **fixed at 10% of the TetherMax margin for ordinary users** and **adjustable per partner.** Both multiply the exchange margin rate, so at 0 the invite reward is 0 for ordinary users and partners alike. No setting anywhere rescues it.

### Knock-on — the partner sub-account label is also wrong

Doc 08 §3-4 recommended a **`not eligible for invite rewards`** label on DEX rows. It contradicts A-19, so **it must not be added.**

> **Corrected further 2026-10-22** — the live sub-account modal is **member-scoped and has no exchange column at all.** It lists downline member numbers by tier with a percentage. So there are no DEX rows to label. Exchange-level invite-reward detail lives on the **withdrawal tree** screen instead.

### Still open

| ID | Content |
|---|---|
| **B-2-8** | **No payout trigger defined for DEX** — the existing rule fires "when a withdrawal happens", which was written for CEX. *(May already be closed: in V2, DEX withdrawals do happen.)* |
| **B-2-9** | **An inviter who has only linked a DEX** has no payout route on the partner path (`Payout exchange` and `Payout UID` are CEX-only) |

### The partner path and the member path diverged in V2 ⚠️

Easy to miss.

| Path | Payout destination |
|---|---|
| **Member** invite-reward payout (IF8) | **DEX wallets included** — reversed in V2 |
| **Partner** reward payout (partner list) | **stays CEX-only** |

---

## Prototype additions 2026-10-22 — four new backoffice screens

Screens present in doc 08 but missing from the prototype. **13 → 18 screens** (21 after the coupon and invite-friends additions).

| ID | Screen | Core finding |
|---|---|---|
| **EX-4** | Exchange referral management | The whole margin-rate conflict above. Also: rows are **per referral account, not per exchange** (Bybit has two), so "add four DEX rows" was wrong — the row count is however many referral accounts each DEX gives us |
| **EX-5** | Exchange event management | ★ **"TetherMax-only events are unavailable to DEX" was a V1 premise and is void** — nothing needs blocking, and the work item disappears |
| **EX-6** | Exchange guide detail | KYC section **hidden for DEX** · `Find your UID` → **`Find your wallet address`** · ownership guide CEX-only · **content is KO/EN only** (settled; the DEX PRD's four-language ask is overridden) |
| **MB-3** | Partner list | Payout columns CEX-only · the `Exchange (UID search)` filter excludes DEX (an exception to the grouping rule, since the field has no DEX values) · the sub-account modal has **no exchange column** |

> **EX-6 note** — if the `Find your wallet address` guide is missing for a language, **that DEX disappears from the link flow in that language entirely** (`EDC-25`). It is the **one** mandatory guide for DEX, since the ownership guide was dropped by P-1.

---

## Settled 2026-10-22 (round 5) — five scope calls

Five user decisions. Four widen the scope, one narrows it.

| # | Settled | Direction |
|---|---|---|
| **R-1** | **VIP is not in this release.** It moves to the next one | narrows |
| **R-2** | **Points do apply to DEX** — but not along an exchange axis | widens |
| **R-3** | **The invite-a-friend `featured exchange` dropdown gains the four DEXs** | widens |
| **R-4** | **The timeline belongs to `Home`, not `Other`** | relocation |
| **R-5** | **Cashback Boost does not consider DEX** | narrows |

### R-1 — VIP is "out of scope", not an X

The V2 re-assessment had raised VIP to `O` on the grounds that the VIP rate differential could be paid as an event reward. That is reversed. **It remains structurally possible** — it is simply **not in this release**, so the table reads **`out of scope`** rather than `X`. It will be re-assessed next time.

### R-2 — Points: DEX applies, but there is no exchange axis

The `99…` numbers on the points history screen are **TUIDs (TetherMax member numbers), not exchange UIDs**. There is nowhere on that screen to hang an exchange, so DEX applies without producing any per-exchange branching. The docs now say *"applies to DEX · no screen change"*.

### R-3 — Invite-a-friend `featured exchange`

The admin-selected **`featured exchange` dropdown must include the four DEXs**. This dropdown was **missing from the 23-point exchange-selector inventory**; it has been added.

### R-4 — Timeline location

The timeline is a **Home** surface, not an `Other touchpoints` one. Moved to the `home` group in the prototype.

### R-5 — Cashback Boost 🔴 reversal

Item 8 of the V2 re-assessment goes **`O` → `X`**. **Same conclusion as V1, different reason.**

| | V1 reasoning | V2 reasoning |
|---|---|---|
| Why X | No payout vehicle | **No number to compare against, and the boost concept does not exist for DEX** |

Each row needs three numbers and DEX can supply **one**.

| Column | CEX | DEX |
|---|---|---|
| `Other platforms` | A rival cashback service's rate | **No source.** No competitor publishes a DEX figure |
| `Official partner` | Our cashback rate | Pending commercial agreement (→ `D-1`) |
| `🚀 With boost` | The boosted final rate | **Does not exist.** There is no boosted rate to show |

→ A DEX row would ship with **two of three columns blank**.

**Four consequences**

| # | Target | Action |
|---|---|---|
| 1 | User `Cashback Boost` screen | **No DEX rows** — the exchange list stays CEX-only |
| 2 | Admin `boost-eligible exchange` picker | **Exclude DEX** |
| 3 | Boost copy | Remove any wording that implies DEX is included |
| 4 | Decision request `D-7` | **Closed** — settled as recommended |

### Applied in

| File | Change |
|---|---|
| `5_add-on/Add-on_Service_DEX_Support_V2_EN.md` | Distribution `O 24 / X 3 / out of scope 1 / under review 4` + two explanatory notes |
| `_prototype/사용자화면_DEX영향도.html` | `etc/BST` — Lighter row **removed**, `to confirm` annotation → **`settled`**, one dangling `NEXT` reference cleaned up |
| `00_결정요청_국문.md` | `D-7` moved into a new section 0 "already settled" · product decisions **11 → 10** |

---

## 2026-10-22 — Notifications: the linking family re-checked (R-6)

**The question** — *"Unlink and ownership notifications can go, but surely linking-completed has to stay?"*

Correct. **FCM had it; email did not.**

| | FCM | EMAIL |
|---|---|---|
| Linking completed | ✅ row 100 | ❌ **missing** → **row 30 added** |
| Linking failed | ✅ row 101 | ❌ **missing** → **row 31 added** |
| Pending released (Lighter) | ✅ row 102 | ❌ **missing** → **row 32 added** |
| Unlinked (ownership) | ⛔ N/A (row 24) | — |
| Ownership confirmed | ⛔ N/A (row 25) | — |

### 🔴 Why it was missed — the sheet has no transactional mails

All 29 rows of `EMAIL.xlsx` are **campaign and notice mails**. The login verification code mail and the UID-linked mail are both sent in production yet **have no row at all** (captures under `E_알림_실물/`).

→ The DEX linking mail had **no CEX counterpart to sit beside**, so the omission could not be caught by eye.
→ Rows 30–32 were added **in the sheet's format**. The real implementation lives with the transactional templates.

**FCM rows 22–25 were annotated with a `[DEX]` marker** so the sheet alone shows which rows have a DEX counterpart and which do not apply.

### The email template — read against the live mail

**🟢 Zero new design assets.** The login-code mail and the linked mail use an **identical shell**, and the banner, socials and footer are brand assets with nothing exchange-specific in them.

**Only four things change.**

| # | Where | CEX | DEX |
|---|---|---|---|
| 1 | Subject | `[TetherMax] UID Binding Success` | `[TetherMax] Wallet Binding Success` |
| 2 | H2 | `UID linkage completed` | `Wallet linkage completed` |
| 3 | One-line body | `The UID has been linked to…` | `The wallet has been linked to…` |
| 4 | Detail block label | `Exchange` / `UID` | `Exchange` / **`Wallet address`** |

> **Item 1 matters most.** The subject is the only text visible **before** the mail is opened.
> **Keep the `Exchange` label** — Lighter and Aster are called exchanges everywhere else in the product.

**🔴 The value length breaks the block's assumption** — `1234567` (7 chars) → `0x7a3F…3D21` (42 chars, 6×). It fits the desktop width but breaks on a phone. The value area needs a **monospace face plus `word-break: break-all`** (an address has no meaningful units, so breaking anywhere is fine).

**Effort** — new images **0** · new strings **8** (ko/en × subject, H2, body, label) · CSS **1** · template files **1–3**

### Two settled, one to decide

| | Item | Note |
|---|---|---|
| ✅ Settled | **Email shows the full wallet address** | Same rule as the admin. An email is **the record the member keeps** and comparison is the point, so masking defeats it. **Pushes stay masked** — they land on a lock screen and are length-capped. **The two must not be decided together** |
| ✅ Settled | **Add a chain row** (`Network`) to the linking mail | The withdrawal notification names a chain; if the linking mail omits it the member cannot reconcile the two |
| 🔴 `D-12` | **When does the linking notification fire?** | Lighter holds a wallet pending for up to **seven days** when masked addresses collide. Firing at submission says "completed" **while it is not yet confirmed**; waiting for confirmation leaves the member with **nothing for a week**. **Recommended — `received` on submission, `completed` on confirmation.** Neither is false, and the other three DEXs confirm instantly so they only ever get the second |

### Six new backend connections

DEX notifications **cannot reuse the existing triggers.** Every CEX one comes from an internal TetherMax event; **half the DEX ones arrive from outside.**

| # | Connection | Fires | Note |
|---|---|---|---|
| 1 | Partner referral attribution response | FCM 100·101 · EMAIL 30·31 | The rejection reason must arrive split into **permanent vs retryable** or the copy cannot branch |
| 2 | Lighter weekly CSV → pending released | FCM 102 · EMAIL 32 | Mondays only · up to seven days of lag |
| 3 | Lighter weekly CSV → `Withheld` | FCM 106 | **Same file, opposite outcome** |
| 4 | DEX settlement received → ledger | FCM 103 | Cadence differs per exchange |
| 5 | On-chain receipt check | FCM 104·105 | **An RPC timeout is a third state** — neither success nor failure |
| 6 | Aster expiry webhook (R8) | FCM 107·108 · EMAIL 26·27 | Twice per binding (30 days out, at expiry) |

### 🔴 Five things the identifier change breaks

**DEX has no UID; only a wallet address.**

| # | Item | Detail |
|---|---|---|
| 1 | Variable name | `{UID}` → `{wallet}`. **This is why the CEX and DEX rows were kept separate** (row 100 vs row 22) |
| 2 | Masking rule | CEX *"last 4"* → DEX **first 6 + last 4**. Showing only `0x` identifies nothing |
| 3 | Length limits | 42 characters in a length-capped push **truncates the exchange name and the amount** → pushes must mask |
| 4 | Case sensitivity | EIP-55 checksums carry meaning in capitalisation; normalising to lowercase and restoring **looks different to the user** |
| 5 | Deep links | Column `L` points at the UID detail page for CEX. DEX needs its own **wallet detail route** |

### Applied in — R-6

| File | Change |
|---|---|
| `EMAIL.xlsx` | **Rows 30–32 added** (linked · failed · pending released) |
| `FCM.xlsx` | `[DEX]` counterpart markers on rows 22–25 |
| `알림_DEX_반영_국문.md` · `Notifications_DEX_EN.md` | Chapter 4 **replaced with a build spec** · **Chapter 5 on backend wiring added** · email entries 4 → **7** |
| `00_결정요청_국문.md` | **`D-12` added** · defaults **31 → 33** (full address in email, chain row) |
| `_prototype/사용자화면` | `etc/EML` — the four change points marked · the language question **turned into a settled note** · missing transactional mails · `D-12` |

---

## Settled 2026-10-22 — the Cashback Challenge does not reflect DEX (R-10)

The V2 re-assessment had moved this from **partial → O**; it goes back to **X**. This is the second reversal after Boost.

### V1's half-in state goes away with it

| | Gauge | Claim |
|---|---|---|
| **V1 (partial)** | DEX counted | **DEX barred** |
| V2 re-assessment (O) | counted | allowed |
| **Settled (X)** | **not counted** | **not shown** |

> *"The gauge fills but you cannot claim"* was a state **the user had no way to understand**. The challenge is now CEX-only, one rule.

### 🔴 One open decision — does the gauge count DEX cashback?

The screen says **"cashback"**, and **the home total includes DEX.**

```
Home        Total cashback   1,240.00 USDT   ← CEX + DEX
Challenge   Level 1           980 / 1,000 USDT  ← CEX only?
```

A member trading on both **sees two numbers disagree with no way to tell why.**

| Option | Detail |
|---|---|
| **A (recommended)** | Exclude DEX from the gauge and **state "based on CEX trading" on the screen** |
| B | Count DEX in the gauge but allow claims on CEX only — **back to the state just removed** |

> **Excluding it is not enough on its own.** Without the wording, A confuses as much as B.

### Five actions

| # | Target | Action |
|---|---|---|
| 1 | Gauge screen | **No** DEX wording |
| 2 | Claim-account picker | **Remove the DEX group and wallet rows** — CEX UIDs only |
| 3 | Cashback-history `type` filter | Mark `Challenge reward` **`CEX only`** |
| 4 | Challenge notifications | **Exclude** DEX |
| 5 | The hardcoded `daily at 13:00 (UTC)` | 🟢 **No longer needs fixing on this screen** |

**Item 5 came free.** One fixed time could not cover the DEX refresh schedules (D+1 00:00 UTC, Aster after 09:00); dropping DEX removes the problem here. **The other screens still need it fixed.**

### What moved rather than vanished

The picker's **`1 / up-to-5 / over-5` branching** does not go away. Only this modal stops gaining four wallet rows; **coupon use, invite-reward withdrawal and league entry** still have to be checked.

### How this differs from Boost

| | Why X |
|---|---|
| Cashback Boost | **No number to compare against** — three per row, DEX supplies one |
| **Cashback Challenge** | **A policy call** — structurally it would work fine |
