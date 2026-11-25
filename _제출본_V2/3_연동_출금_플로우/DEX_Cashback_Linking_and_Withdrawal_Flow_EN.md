# DEX Cashback Linking and Withdrawal Flow (V2)

Written 2026-10-21 · Based on `DEX/DEX3/` strategy announcement and partner proposals (settled 2026-10-20)
Korean version: `DEX_페이백_연동_출금_전체플로우_국문.md`

> **This fully replaces V1.** V1 assumed "the DEX pays the trader directly and TetherMax only reads and displays". **That assumption has been retired.**

---

## Terminology

| Korean (user-facing) | Current English UI | Do not use |
|---|---|---|
| 페이백 / 캐시백 | **cashback** | `payback`, `rebate` |
| 연동 | **Link** / linking | `integration` |
| 연동 해제 | **Unlink** | `disconnect` |
| 비회원 | **non-member** | `guest` |
| 회원탈퇴 | **Account Deletion** | `withdrawal` (never confuse with cash withdrawal) |
| 커미션 정산 지갑 | **Wallet A** | — |
| 캐시백 전용 지갑 | **Wallet B** | — |
| 리밸런싱 | **Rebalancing** | — |

---

# 1. Structure

## 1-1. The core — TetherMax pays

```
          Four DEXs (Lighter · ApeX · EdgeX · Aster)
                     │
                     │  100% of commission
                     ▼
        ┌────────────────────────┐
        │  Wallet A              │  Commission Settlement
        │                        │  Receives 100% from all four
        └───────────┬────────────┘
                    │  ★ Manual rebalance · once a day
                    │     previous-day expected payout + gas only
                    ▼
        ┌────────────────────────┐
        │  Wallet B              │  Cashback-Only
        │                        │  Trader-facing · gas pre-funded
        └───────────┬────────────┘
                    │  Automated payout (gas included)
                    ▼
            Trader's EVM wallet
```

**Wallet A and Wallet B are never the same pool.** A receives settlement inbound; B holds trader-facing cashback.

## 1-2. CEX vs DEX V1 vs DEX V2

| Item | CEX (17 live) | **DEX V1 (retired)** | **DEX V2 (new)** |
|---|---|---|---|
| Identifier | Exchange UID | Wallet + DEX account ID | **Wallet address** (DEXs have no UID) |
| Who pays the cashback | TetherMax | ~~The DEX~~ | **TetherMax** |
| TetherMax's role | Holds and pays funds | ~~Reads and displays only~~ | **Receives, computes, pays — end to end** |
| Where the trader withdraws | TetherMax | ~~The DEX's own site~~ | **TetherMax app / web** |
| Minimum withdrawal | 10 USDT | ~~None~~ | **10 USDT** |
| What the figure means | Account balance | ~~A receipt~~ | **Account balance** |
| Event rewards | Yes | ~~None~~ | **Yes (re-verdict pending)** |
| Wallet connect / signature | N/A | Never requested | **Never requested (unchanged)** |
| Gas fee | None (internal transfer) | None | **TetherMax pays (new)** |

**V2 is almost identical to CEX.** The only differences are the identifier (wallet address) and the gas-fee burden.

## 1-3. The two preconditions

| # | Condition | Where it is set |
|---|---|---|
| 1 | Trader-side cashback rate set to **0%** — automatic payouts disabled | DEX back office |
| 2 | **100% of commission routed to Wallet A** | DEX settlement config |

**Integration is impossible until both are agreed.** If either is missing, the whole pipeline — including Wallet B automated payouts — cannot go live.

## 1-4. Four governing principles

1. **TetherMax pays the cashback.** It owns receipt, computation, payout and withdrawal.
2. **TetherMax never asks the trader to connect a wallet or sign.** The trader pastes an address.
3. **Every amount is shown in USDT.** USDC at 1:1; for Aster, the USDT equivalent Aster supplies.
4. **TetherMax covers the gas fee.** It is pre-funded in Wallet B.

## 1-5. The four DEXs — new baseline

| Item | Lighter | ApeX | EdgeX | Aster |
|---|---|---|---|---|
| Settlement cycle | Weekly (Mon–Sun) | Hourly | Daily (00:00 UTC) | Daily (00:00 calc / 09:00 publish) |
| Currency | USDC (1:1) | USDT | USDC (1:1) | **Fee asset, variable** |
| Payout verification | **On-chain hash** | Internal ID | Internal ID | **None — requested** |
| Special risk | Standard tier 0% · abuse holds | **Legacy unclaimed balance** | — | **365-day referral expiry** |

> **The "legacy payout location" and "user-side action" rows are retired.** They become meaningless once automatic cashback is blocked. **"Settlement cycle" and "currency" become API ledger design conditions instead.**

---

# 2. Linking flow

## 2-1. Entry points

CEX and DEX share the same Link Account flow.

| Platform | Entry |
|---|---|
| Web | `+ Link Account` on the signed-in home |
| App / mobile web | Home card `Link once and paybacks keep coming` |
| Both | DEX detail page, Cashback Hub |

## 2-2. Exchange selection

**⬜ Undecided — split CEX and DEX, or unify** (decision 1 in the strategy announcement)

| Option | Content |
|---|---|
| (a) Unified list | One list, DEX items carry a badge |
| (b) Filter chips | `All` / `CEX` / `DEX` |
| (c) Separate tabs | Split at the top level |

**Settled regardless of the outcome**
- Remove **UID** from the modal title `거래소 UID 연동하기`. DEXs have no UID concept
- When a DEX is selected, show the subtitle `No wallet connection or signature required.`
- `Sign up here` must point to the **TetherMax referral sign-up path**

## 2-3. Wallet address entry

- Label `Paste your wallet address` plus a Paste button
- Helper `Starts with 0x followed by 40 characters.`
- Once a value is entered the label becomes `Wallet address`
- The primary action stays disabled until format validation passes
- A per-DEX block `How to find your wallet address` with up to five screenshots (per DEX × per language)

## 2-4. Address validation — nine steps

Client and server validate **in the same order**, and **the server has final authority**.

| Step | Check | Failure copy |
|---|---|---|
| 1 | Trim leading/trailing spaces, tabs, line breaks. Internal spaces are invalid | — |
| 2 | Reject empty or whitespace-only | `Enter your wallet address.` |
| 3 | Match the format declared for that DEX (EVM for all four today) | `This doesn't look like a {DEX} wallet address.` |
| 4 | Lowercase `0x` prefix | `Enter a valid wallet address starting with 0x followed by 40 characters.` |
| 5 | Exactly 40 hex characters after `0x` | Same |
| 6 | Only `0-9`, `a-f`, `A-F` | Same |
| 7 | Mixed case only with a **valid EIP-55 checksum** | `This address has an invalid checksum. Copy it again directly from {DEX}.` |
| 8 | Reject ENS and ICAP/IBAN | `Paste the 0x wallet address, not a name or other format.` |
| 9 | Reject the zero address | `This address can't be linked.` |

**Stored lowercased, displayed in EIP-55 checksum form** (`0x7a3F…51e9`). An invalid checksum is never silently lowercased.

## 2-5. Attribution

The ledger API's `referral_code` field verifies TetherMax attribution. **The wallet address is the only identifier.**

## 2-6. Failure and pending states

| State | When | Actions |
|---|---|---|
| `Verification Limit Reached` | Too many failed attempts in a short period | Close, Contact Support |
| `Unable to Link Wallet` | Generic error or DEX rejection | Contact Support |
| `Unable to Link Wallet` (not a referral) | The DEX does not report the wallet as a TetherMax referral | Close, Contact Support |
| `Wallet Already in Use` | Linked to another TetherMax account | **Contact Support (primary)** |
| `You've Already Added This Wallet` | Already linked to the member's own account | Close |
| `You've reached your wallet limit` | Wallet limit reached | Manage Wallets, Cancel |
| `Processing Your Wallet` | Attribution cannot be confirmed immediately | Back to Home |

> **`Unable to Link Wallet Yet` ("withdraw before linking a new wallet") may now apply to DEX.** It was CEX-only in V1 because there was no TetherMax withdrawal. **V2 creates a TetherMax balance, so this needs re-examination.**

## 2-7. Wallet limit

**Current design: `3 × the number of active DEXs`, pooled.** Four DEXs gives 12.

> **To confirm:** DEX activation and deactivation change every member's allowance. Launching with two DEXs would give six. A fixed total is worth considering.

---

# 3. Accrual flow

## 3-1. Common rules

- TetherMax collects the ledger API **server side**. Pages never call it directly
- Partner keys are **read-only** and never exposed to the client
- **All four partners expose the same schema** — previous-day, daily granularity
- Records are immutable; corrections run through the revoke API within 24 hours
- **Idempotency** — the same `trade_id` is credited exactly once, which structurally prevents double payment

## 3-2. Ledger API schema

### Required — 5

| # | Field | Description |
|---|---|---|
| 1 | `wallet address` | **The only identifier** |
| 2 | `trade_type` | `spot` / `perp` |
| 3 | `fee_paid` | Fee the trader paid on the trade |
| 4 | `commission` | Commission paid to TetherMax |
| 5 | `referral_code` | Verifies TetherMax attribution |

### Optional — 3

| # | Field | Purpose |
|---|---|---|
| 1 | `UID / AID` | CS cross-check, duplicate and gap tracing |
| 2 | **`symbol` · `volume`** | **Required for Global League and Maxboard to work** |
| 3 | `network (EVM)` | Determines which chain Wallet B settles on |

### Response example

```json
{
  "date": "2026-10-19",
  "wallet": "0x##...##",
  "trade_type": "perp",
  "fee_paid": ##.##,
  "commission": ##.##,
  "referral_code": "TM####"
}
```

## 3-3. Refresh timeline

```
 D        Trades occur, fees charged
   ▼
 24h      The DEX rolls up the day
   ▼
 D+1      Ledger exposed at a fixed time (00:00 UTC; Aster after 09:00)
   ▼
 TetherMax  Ingest → refresh every surface → rebalance A to B
```

Polling runs at 30-second cadence; EdgeX proposed replacing it with a **webhook in Phase 1**.

## 3-4. Per-DEX notes

### Lighter — weekly

| Item | Detail |
|---|---|
| Settlement | Every Monday, aggregating the previous Mon–Sun |
| Currency | USDC → USDT at 1:1 |
| **Ask** | **Daily ledger rows even though settlement is weekly** · how on-hold entries appear |
| Note | **Standard accounts pay 0% fees, so no commission arises** — a warning is required at linking |
| Verification | **On-chain hash** (the only one of the four) |

### ApeX — hourly

| Item | Detail |
|---|---|
| Settlement | Hourly batches |
| Currency | USDT (no conversion) |
| **Ask** | **Roll hourly batches up into a daily (D+1) aggregate** |
| **Open** | **Legacy unclaimed balance — decided separately** |
| Resolved | The claim dependency disappears under the new structure |

### EdgeX — daily

| Item | Detail |
|---|---|
| Settlement | Daily at 00:00 UTC |
| Currency | USDC → USDT at 1:1 |
| **Ask** | One ledger row per member per day, plus a payout identifier |
| Resolved | **The withdrawable-balance problem disappears** — TetherMax executes the withdrawal |

### Aster — daily

| Item | Detail |
|---|---|
| Settlement | 00:00 calculation → 09:00 publication |
| Currency | **Fee asset, variable** (USDT, ETH, BTC and others) |
| **Ask** | **Aster supplies the USDT equivalent** · state the payout asset and network |
| **Top risk** | **365-day referral expiry, renewal terms undecided** |

> **If Aster's renewal rule is not agreed, accrual stops for every linked Aster trader in 12 months.** A 30-day pre-expiry alert is already designed in.

---

# 4. Withdrawal flow

## 4-1. The core — the trader withdraws from TetherMax

**This is the opposite of V1.** Cashback accrues to a TetherMax balance and the trader requests a withdrawal in the TetherMax app or web.

## 4-2. Member withdrawal

| # | Step | Actor |
|---|---|---|
| 1 | Check the balance on home or the withdrawal screen | Trader |
| 2 | At **10 USDT or more**, request a withdrawal (one tap) | Trader |
| 3 | Wallet B confirms payout amount plus gas is held | Automated |
| 4 | On-chain EVM transfer plus transaction log | Automated |
| 5 | Funds arrive in the trader's EVM wallet, hash recorded | Automated |
| 6 | Deltas reflect across six surfaces | Automated |

```
Trader: check balance → 10 USDT+ → request payout (one manual tap)
                                        │
            Wallet B: payout + gas ─────┤
                                        ▼
                             On-chain EVM transfer + tx log
                                        ▼
                             Arrives in the trader's wallet
                                        ▼
                          Six surfaces refresh immediately
```

## 4-3. ★ Withdrawal amount formula — matched withdrawal (confirmed 2026-10-21)

**DEX uses the same matching formula as CEX.**

```
Actual withdrawal = A + MIN(B, A)

   A = cashback (from trading fees)
   B = event reward

Eligible when  A + MIN(B, A) ≥ 10 USDT      // judged per wallet (per UID)
Precision      2 decimal places, floor at the 3rd
```

**An event reward can never exceed the cashback amount.**
Rationale: block users who harvest event rewards without generating real trades (MAX-18, Problem Statement).

| # | Cashback A | Event B | Actual withdrawal | Eligible |
|---:|---:|---:|---|:--:|
| 1 | 5 | 5 | 5 + 5 = **10** | ✅ |
| 2 | 2 | 8 | 2 + 2 = 4 | ❌ |
| 3 | 10 | 0 | 10 + 0 = 10 | ✅ |
| 4 | **0** | 50 | 0 + 0 = **0** | ❌ |
| 6 | 7 | 100 | 7 + 7 = **14** | ✅ |
| 10 | 9.5 | 0.4 | 9.9 | ❌ |

### ★ What this means for DEX — case #4

> **If DEX cashback (A) is zero, the event reward cannot be withdrawn either.**

V2 grants event rewards on DEX (decision A-1), but this constraint still applies.
**A trader must actually trade on the DEX to unlock the event reward.** The user-facing copy must say so.

### Correction to earlier records

```
(old) Available Cashback = Exchange Cashback + Event Reward     ← wrong
(new) Available Cashback = A + MIN(B, A)                        ← corrected
```
The screen looked like a plain sum only because the sample data had B ≤ A.

---

## 4-4. Display rules

| Item | Rule |
|---|---|
| Minimum withdrawal | **10 USDT** on `A + MIN(B,A)`. Below that: `Inactive` badge, card dimmed |
| Unit of judgement | **Per wallet.** Eligibility differs wallet by wallet |
| Trader effort | **One tap.** No Claim button, no follow-up steps |
| Gas fee | **TetherMax pays in full.** Never charged to the trader and **never shown on screen** |
| Amount received | **Request 10 and exactly 10 lands in the trader's wallet** |
| The accrued figure | **Decreases on withdrawal** (the opposite of V1) |

> **V1's line "Exchange Cashback is what you have earned, so it doesn't go down when you withdraw" is retired.** In V2 this is a TetherMax balance and it does go down.

### State display

| Condition | Display |
|---|---|
| `A + MIN(B,A)` ≥ 10 | `Available` badge (green) |
| `A + MIN(B,A)` < 10 | `Inactive` badge (grey), card dimmed, interaction disabled |
| All wallets inactive | `Not eligible to withdraw` badge, Confirm button disabled |

---

## 4-5. Verification flow

### Member (same as CEX)

```
Withdrawal list → Confirm Withdraw → Confirm modal
   → slide-puzzle CAPTCHA
   → OTP (if registered) or 6-digit email code (if not)
   → Success → (Share) → Completion bottom sheet
```

| Item | Rule |
|---|---|
| Email code | 6 digits, valid 10 min, 60 s resend cooldown, **10 failures → 24 h lockout** |
| OTP | Google Authenticator TOTP, **unlimited retries** |
| On failure | Entered digits are **retained** (changed from the previous behaviour, per MAX-18) |
| Asset handling | **Pre-deducted** the moment verification succeeds → Pending |

### ★ Non-member — DEX withdrawal allowed (confirmed 2026-10-21, changed from V1)

> **Non-members can use DEX exactly as they use CEX.** (decision G-1)

```
Wallet address search → wallet detail → Withdraw → Confirm modal
   → slide-puzzle CAPTCHA → submitted immediately
```

| Item | Rule |
|---|---|
| Extra verification | **None.** Neither OTP nor email |
| Scope | **Single wallet only.** No `+N` display |
| Amount | **Full available amount only** (no partial withdrawal) |
| Completion notice | **None.** Non-members never received notifications (decision G-3) |

> **No abuse exposure (decision G-2):** wallet addresses are public on-chain, so a third party could trigger
> someone else's payout. But **only the full amount can be withdrawn at once**, so repeated withdrawals
> cannot be used to burn gas. The destination is the wallet itself, so no funds are misdirected.

### Linking block

> **Linking is blocked outright when unclaimed cashback is 10 USDT or more** (`FAILED_NEED_RECEIVE`).
> This matches current CEX policy and **applies identically to DEX.** (decision B-5)

**→ Watch ApeX:** under V1, ApeX alone required traders to claim on ApeX's own site, so
**users with an existing unclaimed balance will be blocked the moment they try to link.** This needs a separate decision.

---

## 4-6. ★ Withdrawal failure — modes unique to DEX

**Correct data is not enough.** These modes do not exist on CEX, where a withdrawal is an internal ledger move.

| Cause | Description | Outcome |
|---|---|---|
| Gas spike | Gas exceeds the configured ceiling just before send | Not sent |
| Nonce collision | Concurrent sends from the same wallet clash | One fails |
| RPC timeout | Node does not respond | **Send status unknown** — the worst case |
| Wallet B underfunded | Rebalancing runs once daily and the balance drained in between | Not sent |
| Chain congestion | Transaction sits pending | Delayed |

> **MAX-18 Open Question #6 (partial-failure handling) is worse on DEX.**
> On CEX, failing one leg of a multi-withdrawal can be resolved by refunding everything.
> **On DEX the gas for already-sent legs is spent.** A full refund does not recover it.
> → A **DEX-specific partial-failure policy** needs to be agreed with the MAX-18 owner.

---

## 4-7. What differs from CEX withdrawal

| CEX | DEX V2 |
|---|---|
| Exchange internal transfer | **On-chain EVM transfer** |
| No transfer fee | **Gas fee — paid in full by TetherMax, not shown on screen** |
| Paid to a UID | **Paid to a wallet address** (fixed to the linked wallet; changes go through support) |
| Failures are rare | **Five on-chain failure modes** (4-6) |
| Matching formula `A + MIN(B, A)` | **Applies identically** |
| 10 USDT minimum | **Same** |
| Non-member withdrawal | **Same** |

---

# 5. Operations — rebalancing and gas

## 5-1. Rebalancing A to B

**Once a day, manually.** The previous day's ledger drives the expected payout plus gas, which moves from Wallet A to Wallet B.

## 5-2. Four operational risks

| # | Risk | Response |
|---|---|---|
| 1 | Wallet B shortfall → payout delay | Compute previous-day expected plus a buffer ratio; alert on shortfalls |
| 2 | **Gas-fee volatility per network** | Poll continuously, fold into the transfer amount, top up on shortage |
| 3 | **Excess idle balance in Wallet B** | Transfer only the minimum required |
| 4 | Event-driven spikes (e.g. Aster expiry) | Recompute expected from ledger history; alert when limits are crossed |

### ★ Resolving the 2 ↔ 3 tension (confirmed 2026-10-21)

What previously read only as *"risks 2 and 3 pull in opposite directions"* is now defined as:

> **Principle: transfer the minimum that still keeps a working reserve.**
>
> Always hold enough to prevent a payout delay, and within that bound keep the transfer as small as possible.

**But the balance point — the buffer ratio — cannot be computed before the chain is chosen,** because gas volatility differs entirely by chain. (decision I-2)

---

## 5-3. Four undecided numbers — **to be computed once the chain is fixed**

Strategy announcement, slide 6 — *"pre-final example values, to confirm in Phase 3"*

| Item | Current value | Computable when |
|---|---|---|
| Daily A → B target | `## USDT` | chain fixed |
| Buffer policy | `##×` daily expected | **chain fixed** (depends on gas volatility) |
| Gas-fee cache | `##` days of network fee | **chain fixed** (depends on per-tx gas) |
| First-day cap | `##` users | chain fixed |

> **The payout chain is undecided.** A separate owner is researching it for a C-level decision. (decision A-3)
> All four numbers depend on that choice, so **none of them is a decision to make now.**

---

## 5-4. ★ Gas — policy confirmed (2026-10-21)

```
V1 structure   TetherMax never sent funds       → no gas line at all
CEX            Exchange internal transfer       → no on-chain fee
DEX V2         On-chain EVM transfer per payout → real cost per payout ★
```

### The four confirmed points

| # | Decision | ID |
|---|---|---|
| 1 | **TetherMax absorbs gas in full** | F-1 |
| 2 | **Gas is checked and sent alongside the payout.** Request 10, and **exactly 10 must land in the trader's wallet** | F-2 |
| 3 | **No fee is shown to the user** (no `Network fee` row in the Confirm modal) | F-3 |
| 4 | **Gas is booked as a pure loss.** Business-side decision | F-5 |

### Consequence — what Wallet B must hold

```
Wallet B requirement = Σ(trader payouts) + Σ(gas)
```

At 2–5 USDT of gas per transaction:

```
Trader receives   10.00 USDT
Gas               +2–5 USDT   ← absorbed by TetherMax
────────────────────────────
Cost per payout   12–15 USDT
```

**Because 100% of the cashback goes to the trader, gas is a full loss.**

### → The key criterion for the chain research

The A-3 owner should be asked to compute:

```
Monthly loss = per-transaction gas × expected monthly withdrawals
```

This is not a technical preference for a cheaper chain — it is **a decision with direct P&L impact.**
Per-transaction gas differences move the monthly loss by multiples.

---

# 6. Platform surfaces — six touchpoints

Ledger deltas land across six surfaces at once.

| # | Surface | Content |
|---|---|---|
| 1 | **TetherMax coupons** | Coupons and perks recompute against the new delta |
| 2 | **Cashback withdrawal screen** | Pre- and post-withdrawal balance; withdrawable total refreshes |
| 3 | **Cashback ranking** | DEX earnings included (**separate labelling recommended**) · **scored on cashback amount** |
| 4 | **Global League** (members only) | **Scored on cashback amount** — `volume` not required |
| 5 | **Live withdrawal feed** | DEX payouts added to the feed |
| 6 | **Trader ranking** | **CEX and DEX unified** |

> **Row 4 corrected (2026-10-21):** the earlier text — *"works only if the optional `volume` field is supplied"* — was **wrong**.
> Global League scores at `1 USDT of commission cashback = 1 point` (MAX-8 §3 Score Logic):
> **cashback amount, not trading volume.** It works without `volume`.
> Cashback ranking, monthly ranking and Maxboard all score on **cashback amount** as well.

> The "six surfaces" in the EdgeX proposal refer to **EdgeX's own screens** (trade screen, cashback dashboard, receipt toast, asset page, email digest, tournaments). That is a different list and the intent needs confirming.

---

# 7. Decision status (updated 2026-10-21)

## 7-1. Resolved

| # | Item | Decision | ID |
|---|---|---|---|
| 1 | Split or unify CEX and DEX screens | **Unified + type filter chips + `DEX` badge** (confirmed in design E4) | — |
| 3 | Allow DEX in TetherMax-only events | **Allowed.** The structure now supports paying event rewards | A-1 |
| 4 | Re-verdict the 11 exclusions | **Complete** — see the V2 re-verdict in folder 5 | — |
| 7 | Gas-cost mitigation | **TetherMax absorbs it in full; booked as a pure loss** | F-1, F-5 |
| 9 | Whether `Unable to Link Wallet Yet` applies to DEX | **It does.** Linking blocked at ≥10 USDT unclaimed | B-5 |
| — | Withdrawal destination | **Fixed to the linked wallet.** Changes go through support | design DW2 |
| — | Ownership verification method | **Screen-recording upload** (MP4/MOV, 100 MB) + 30-day cooldown | MAX-431 |
| — | Non-member DEX withdrawal | **Allowed.** Same as CEX | G-1 |
| — | Invite rewards on DEX | **Allowed.** Treated the same as a CEX UID | A-2 |

## 7-2. Open — awaiting the chain decision

| # | Item | Status |
|---|---|---|
| 6 | Buffer ratio · gas-cache days | **Computable once the chain is fixed** (I-2) |
| — | Payout chain | **Separate owner researching → C-level decision** (A-3) |

## 7-3. Open — other

| # | Item | Status |
|---|---|---|
| 2 | Split the withdrawal modal into tabs | Undecided |
| 5 | Aster 365-day renewal terms | **Awaiting partner · highest priority** |
| 8 | Wallet limit formula | Undecided |
| **10** | **Commission and margin rates for the four DEXs** | **Undecided** — the hub's 20/30/30/20 are cashback rates (Q1) |
| **11** | **Partial-failure policy for multi-wallet withdrawal** | **MAX-18 OQ#6 open.** A full refund is impossible on DEX once gas is spent |

---

# 8. What V1 content is now void

| V1 statement | V2 |
|---|---|
| "TetherMax never moves money for DEX traders" | **Retired** — TetherMax pays |
| "Earned cashback does not go down when you withdraw" | **Retired** — it is a balance and it does |
| `Withdraw on {DEX}` opening a new tab | **Retired** — the trader withdraws on TetherMax |
| DEX deep-link destinations must be confirmed | **No longer needed** — not a withdrawal path |
| No minimum withdrawal | **10 USDT applies** (on `A + MIN(B,A)`) |
| Event rewards excluded entirely | **Retired** — **DEX earns them too** (A-1) |
| Invite rewards excluded on DEX | **Retired** — **treated the same as a CEX UID** (A-2) |
| Non-members can only look up | **Retired** — **non-members can withdraw on DEX** (G-1) |
| League works only if `volume` is supplied | **Retired** — **scored on cashback, so not needed** (K-1) |
| Per-DEX "legacy payout location" and "user-side action" comparison | **Retired** — meaningless now |

---

# 9. Revision log — 2026-10-21

Reflects analysis of six existing PRDs (MAX-8/10/18/30/431/466) and the Maxboard PRD.
Source decisions: `6_기존PRD_분석/확정_결정_기록_20261021.md`.

| # | Change | ID |
|---|---|---|
| 1 | **Corrected the withdrawal formula to `A + MIN(B, A)`** (4-3) | A-1 |
| 2 | Stated that zero cashback also blocks the event reward | A-1 |
| 3 | **Gas policy confirmed** — absorbed in full / amount guaranteed / hidden on screen / pure loss (5-4) | F-1–F-5 |
| 4 | Wallet B requirement = Σ payouts + Σ gas | F-2 |
| 5 | Four undecided numbers → **computed once the chain is fixed** (5-3) | F-4, A-3 |
| 6 | Risks ②③ → **"transfer the minimum that keeps a working reserve"** (5-2) | I-2 |
| 7 | **Non-member DEX withdrawal allowed** (4-5) | G-1–G-3 |
| 8 | Linking blocked at ≥10 USDT unclaimed | B-5 |
| 9 | **Five on-chain failure modes** added (4-6) | F-5 |
| 10 | **Corrected** the Global League `volume` dependency (section 6) | K-1 |
| 11 | Invite rewards allowed on DEX | A-2 |
