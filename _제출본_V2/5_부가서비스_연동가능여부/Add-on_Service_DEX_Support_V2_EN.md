# Add-on Service DEX Support — V2 Re-verdict

Written 2026-10-21 · Based on `DEX/DEX3/` strategy announcement (settled 2026-10-20)
Korean version: `부가서비스_DEX연동_가능여부_V2재판정_국문.md`
V1 original: `부가서비스_DEX연동_가능여부_국문.md` (kept for reference)

---

# 0. Why everything is re-judged

All **11 exclusions** in V1 shared exactly one reason:

> **"TetherMax had no way to send money to DEX users."**

V2 introduces **automated payouts from Wallet B.** That reason is gone, so **all 11 exclusions must be re-judged.** Slide 15 of the strategy announcement names this as **decision 4 — new and the heaviest.**

## 0-1. The governing principle changes

| | V1 principle (A-08) | **V2 principle** |
|---|---|---|
| Rule | Include DEX where eligibility is earned, **exclude DEX wherever money is received** | **A payout path now exists, so the exclusion basis is void** |
| New rule | — | **Apply where the data exists; exclude where it does not** |

In V2 the only reason to exclude is **"the DEX does not supply the data we need."** Funding is no longer a constraint.

## 0-2. ~~The new constraint — optional fields~~ → **corrected: no constraint** (2026-10-21)

> ### This section was **wrong**.
>
> It previously read:
> ```
> Optional field 02   symbol · volume
>      ├─▶ supplied     Global League · Maxboard work
>      └─▶ not supplied Both features are impossible
> ```
> and concluded this was *"V2's only functional constraint."* **None of the three services uses volume.**

| Service | Actual scoring basis | Source |
|---|---|---|
| **Global League** | `1 USDT of commission cashback = 1 point` | MAX-8 §3 Score Logic |
| **Cashback / monthly ranking** | Cashback amount | Confirmed 2026-10-21 (K-1) |
| **Maxboard** | Gauge, streak and ranking **all run on cashback** | Maxboard PRD, Service Plan §1.1 |

> From the Maxboard PRD: *"the cashback a newly registered UID earns from trading **becomes the bingo gauge** itself"*
> and the ranking is *"completers only, ranked by **total cashback**, refreshed daily."*

**TetherMax has no system that records trading volume at all.** `symbol` / `volume` were never needed, and the ask has been **removed** from the exchange API request.

→ **No data-dependent constraint remains in V2. Zero conditional verdicts.**

---

# 1. Re-verdict summary (updated 2026-10-21)

| Verdict | V1 | V2 (10-20) | V2 (10-21) | **Final (10-22)** | vs V1 |
|---|---:|---:|---:|---:|---|
| O — applied | 12 | 24 | 27 | **26** | **+14** |
| X — excluded | 11 | 2 | 1 | **2** | **−9** |
| Partial | 4 | 0 | 0 | **0** | −4 |
| Conditional (data-dependent) | 0 | 2 | 0 | **0** | — |
| Under review | 5 | 4 | 4 | **4** | −1 |
| **Total** | 32 | 32 | 32 | **32** | — |

### Three changes on 10-21

| Service | 10-20 | **10-21** | Reason |
|---|:-:|:-:|---|
| **Global League** | Conditional | **O** | Scored on cashback — `volume` not needed (K-1) |
| **Maxboard** | Conditional | **O** | Same; confirmed against the Maxboard PRD (M-1) |
| ~~UID ownership claim~~ | ~~X~~ | ~~O~~ | **Reversed on 10-22 — see below** |

### One change on 10-22 — a reversal

| Service | 10-21 | **10-22 final** | Reason |
|---|:-:|:-:|---|
| **UID ownership claim** | O | **X** | **Decided: DEX will not support ownership verification** |

> It was raised to applied on 10-21 on the strength of the design (17 states, O0–O16).
> **Policy has since settled that DEX does not support ownership verification.**
> The design is not wasted — **O0–O16 remain in use as the CEX path.**

**Exclusions stand at two:** UID ownership claim and My Portfolio.

---

# 2. The 11 exclusions, re-judged

| # | Service | V1 | **V2** | Basis |
|---|---|:-:|:-:|---|
| 1 | **Event rewards** | X | **O** | Payable from Wallet B. The exclusion basis is void |
| 2 | **TetherMax Points (TP)** | X | **O** | Accrual and spend are both internal. No constraint |
| 3 | **Cashback ranking** | X | **O** | **Slide 11 already states "DEX earnings included in ranking."** Separate labelling recommended |
| 4 | **Global League** | X | **O** | **Scored on cashback amount.** `1 USDT of commission cashback = 1 point` (MAX-8 §3) |
| 5 | **Maxboard** | X | **O** | **Cashback is the bingo gauge.** Ranking is by total cashback (Maxboard PRD) |
| 6 | **Matched withdrawal / cashback detail** | X | **O** | **It is a TetherMax-balance withdrawal screen — and in V2, DEX cashback is a TetherMax balance** |
| 7 | **VIP service** | X | **O** | The VIP rate differential is paid as an event reward, which is now payable |
| 8 | **Cashback boost** | X | **O** | The boost differential is paid as an event reward — same |
| 9 | **Exchange-specific events (WOO X Pro type)** | X | **O** | Payable **to a wallet address** instead of `receiver_uid` |
| 10 | **Pre-settlement** | X (assumed) | **Under review** | Structurally possible now, but **the D+1 ledger changes how pre-payment risk is sized** |
| 11 | **Coin draw / price prediction** | X (assumed) | **O** | Event-reward family — now payable |

## 2-1. Items 3, 4 and 6 were effectively already decided

Slide 11 of the strategy announcement describes the six surfaces and **states the following as settled**:

| Surface | What it says |
|---|---|
| Cashback ranking | *"DEX earnings included in ranking (separate labeling recommended)"* |
| Global League | *"Volume data bridged (when optional field is provided)"* |
| Customer ranking | *"Unified ranking across CEX + DEX"* |
| Cashback payout screen | *"Pre- and post-withdrawal balance shown, withdrawable total refreshes"* |

→ **For the three ranking-family items and the withdrawal screen, this is less a re-verdict than recording a decision already made.**

---

# 2-2. ★ UID ownership claim — **not supported on DEX** (2026-10-22)

> **Conclusion: DEX does not support ownership verification.**
>
> It was raised to applied on 10-21 on the strength of the design, then **reversed by policy on 10-22.**
> Everything below **remains valid as the CEX path**; only DEX skips this branch.

## 2-2-1. Work that disappears with the reversal

| Item | Status |
|---|---|
| Claim page O3–O10 (video upload, guide slides, submit sheet) | **N/A for DEX** |
| Review states O11–O16 | **N/A for DEX** |
| 30-day ownership cooldown · `FAILED_RECENT_POSSESSION` | **N/A for DEX** |
| Three ownership notifications | **N/A for DEX** → notification rewrite scope drops by three |
| Backoffice guide slides, **4 DEX × 2 devices × N** | **No longer produced** |
| Video player on the admin review screen (DEX rows) | **Not needed** |
| The `Verify Ownership` CTA on `FAILED_ALREADY_INTEGRATION` | **Removed on the DEX branch** → routes to support |

> **The backoffice section `Exchange Guide → UID Ownership Verification` is still new work.**
> MAX-431 calls for it on the CEX side; only the DEX sets drop out.

## 2-2-2. 🔴 The gap this leaves — duplicate wallets

A wallet address is **public on-chain**. Someone can link an address they do not own, and with no
ownership path, **support is the only way to correct it.**

**To decide:** does support unlink on request, or require evidence of some kind?

---

## 2-2-3. (Reference) The CEX path — still valid

What follows **applies to CEX** and is kept for reference.

**DEX canvas, `Ownership verification` section — O0 to O16, 17 states**

```
A · Entry        O0 home / link another wallet · O1 already in use · O2 claim unavailable
B · Claim page   O3 guide step 1 · O4 step 2 · O5 step 3 · O6 uploading
                 O7 uploaded · O8 upload failed · O9 server error · O10 submit confirm
C · After submit O11 reviewing · O12 approved · O13 rejected
                 O14 unlinked by another claim · O15 reclaim · O16 reclaim rejected (reason)
```

### Method — screen-recording upload

```
┌ ⬤ Lighter        [Active] ┐  ┌ Upload Recording ──────────────┐
│   0x7a3F…c51E9  ⧉        │  │  ⬆ Upload your screen recording│
└───────────────────────────┘  │     MP4 or MOV (max. 100MB)    │
┌ Ownership Video Recording ┐  └────────────────────────────────┘
│  Guide   [Step 1 of 3]    │  ⓘ Most claims are reviewed within
│  "Start recording, then   │    5 minutes.
│   disconnect your wallet" │  ⚠ Some events restricted while claiming
└───────────────────────────┘  [ Submit Claim ]
```

### Operating rules defined by MAX-431

| Item | Rule |
|---|---|
| **Ownership cooldown** | **30 days** after approval, no new claim on that wallet. The blocking modal shows the unlock date (D-n) |
| **Auto-failure** | **10 minutes** (reduced from 15) |
| **Polling** | **Fixed calls at 2 / 4 / 7 / 8 / 9 / 10 min**, six in total. A manual refresh calls immediately |
| **Review notice** | *"about 5 minutes"* is guidance; **the real deadline is 10 minutes** |
| **Rejection reason** | Not shown in the modal. Revealed only via `View reason` on the UID detail screen |
| **Resubmission** | **No attempt limit** |
| **Result modal** | Shown **only while the user is on Home**. Otherwise push only |

### New backoffice section required

> **`Exchange Guide → UID Ownership Verification`** (introduced by MAX-431)
> Register **mobile and PC slides separately, per exchange**. One slide = title + image + description text.
> Dot indicator appears automatically at two or more slides. Reflected on the claim page in real time.

```
DEX production volume = 4 DEXs × 2 device types (mobile/PC) × N slides
```
※ Owned by **content BD** (decision B-4)
※ This backoffice section is **new for CEX as well** — it is not DEX-driven

---

# 3. The four partial items — all promoted to full

| # | Service | V1 constraint | **V2** |
|---|---|---|---|
| 1 | **Invite friends / partner page** | DEX cannot be set as the payout destination | **O** — payable to a wallet address |
| 2 | **Cashback challenge (missions)** | Gauge fills, but **DEX excluded from the claim UID list** | **O** — claimable |
| 3 | **Benefits / coupons** | Mission trigger accepted, **coupon use limited to CEX UIDs** | **O** — usable on DEX |
| 4 | **Exchange reviews** | Review allowed, **the coupon could not be used on a DEX** | **O** — usable |

## 3-0. ★ One exception — the UID-link coupon excludes DEX (2026-10-22)

Benefits and coupons opened up to DEX broadly, with **one exception**.

| Benefit | Amount | DEX |
|---|---|---|
| **`LINK UID` — paid on linking a UID** (Priority 16) | 3 USDT | **Excluded** |
| Everything else (event rewards, challenge, league, first withdrawal…) | — | Applies |

> **Linking a DEX wallet does not complete this mission and issues no coupon.**

**Required work**

| # | Item |
|---|---|
| 1 | State **CEX only** on the `LINK UID` row in the benefit list |
| 2 | Add a *"linking a DEX wallet does not complete this"* line on the detail page |
| 3 | Add a **CEX condition to the completion logic** — a wallet link must not complete the mission |
| 4 | The copy reads `exchange UID`, which implies any exchange qualifies — **rewrite it** |

> Without the notice, a user links a wallet, sees nothing happen, and files a ticket.
> MAX-466 OQ-2 (per-benefit completion criteria) is open as a development blocker — **this defines the DEX half of it.**

---

## 3-1. Two existing gaps close structurally

The gaps created by decision A-19 in V1 disappear.

| Gap | V2 |
|---|---|
| **B-2-8** No payout trigger for invite rewards — the trigger is "the downline withdraws", which DEX users never did on TetherMax | **Closed.** V2 withdrawals happen on TetherMax, so the trigger fires |
| **B-2-9** A DEX-only inviter could never withdraw — DEX was absent from the payout UID list | **Closed.** Payable to a wallet address |

---

# 4. The two items still excluded in V2

| # | Service | Reason | Status |
|---|---|---|---|
| 1 | **UID ownership claim** | **Policy: not supported on DEX.** Duplicate wallets go through support | **Confirmed** (2026-10-22) |
| 2 | **My Portfolio** | **The DEXs expose no such API.** No data available | **Confirmed — not doing it** (2026-10-21) |

**Excluded because the data does not exist, not because money cannot be sent.** That is consistent with the V2 principle.

> **Confirmed 2026-10-21:** My Portfolio is **a feature that does not exist**, so it is out of scope for DEX.
> It is not up for re-review and generates no follow-up work.

> **The UID ownership claim returned to the exclusion list on 2026-10-22.** → see 2-2

---

# 5. ~~The two conditional items~~ → **zero conditional items** (2026-10-21)

Global League and Maxboard were previously classed as *"does not work without the optional `symbol` / `volume` fields."*
**All three services were confirmed not to use trading volume, so the condition is lifted.**

| # | Service | Former precondition | **Actual** |
|---|---|---|---|
| 1 | Global League | Needs `symbol` / `volume` | **Scored on cashback** — not needed |
| 2 | Maxboard | Same | **Scored on cashback** — not needed |

**The `symbol` / `volume` ask has been withdrawn from the exchange API request.**
**Hourly UTC timestamps** take its place as the negotiation item — a requirement shared by every service.

---

# 5-2. ★ Maxboard — the one DEX-specific constraint that remains

Maxboard works, but **the streak cell can never unlock on Lighter.**

> **Maxboard PRD REQ-040:** the streak cell unlocks on **N consecutive days with cashback, by ledger posting date**

| Exchange | Cadence | Streak cell | Amount cell |
|---|---|:-:|:-:|
| **Lighter** | **Weekly (Mon)** | **❌** | ✅ |
| ApeX | Hourly | ✅ | ✅ |
| EdgeX | Daily 00:00 UTC | ✅ | ✅ |
| Aster | Daily (published 09:00) | ✅ | ✅ |

With weekly settlement, only one day in seven carries cashback — **even a 2-day streak is impossible.**

### Response — **contingent on a settlement-cycle change** (confirmed 2026-10-21)

```
Precondition   ask Lighter for a daily ledger (payouts may stay weekly)
                 └─ the streak is judged on ledger posting date, not payout date,
                    so a daily ledger alone resolves it

If refused   →   do not run a Lighter board
```

> **An amount-cells-only board is technically possible (REQ-113) but has not been adopted,** as an operational call.
> The streak cell is the habit-forming mechanic; without it one of Maxboard's core values disappears.
> → **The first wave of Maxboard covers ApeX · EdgeX · Aster.**

### Also — the bingo batch time

> **REQ-036:** the bingo batch runs once daily at a **fixed time shared by all exchanges**, after the Bitget cashback batch (time undecided, `#BATCH`)

Aster calculates at **00:00 UTC and publishes after 09:00**.
If the bingo batch runs before 09:00, **Aster cashback slips by a day every day — and so does the streak judgement.**

→ The bingo batch time must also satisfy **"after 09:00 UTC"**.

---

# 6. The four items under review

| # | Service | Open question |
|---|---|---|
| 1 | **Quiz (Learn and Earn)** | Coupon use requires a designated exchange UID → **confirm whether a wallet address can substitute in V2** |
| 2 | **Terms of service** | **TetherMax now custodies funds**, so the disclosure scope needs re-examination — more consequential than in V1 |
| 3 | **Pre-settlement** | Structurally possible, but **the D+1 ledger changes how pre-payment risk is sized** |
| 4 | **FX / brokers** | Out of scope, but **structurally identical to DEX** — worth testing the V2 model against it |

---

# 7. Full verdict table (32 services)

| # | Service | V1 | V2 | Note |
|---|---|:-:|:-:|---|
| 1 | Event rewards | X | **O** | Payout path secured |
| 2 | TetherMax Points (TP) | X | **O** | |
| 3 | Cashback ranking | X | **O** | Settled in slide 11 |
| 4 | Global League | X | **O** | Scored on cashback |
| 5 | Maxboard | X | **O** | Scored on cashback · **Lighter depends on a settlement-cycle change** (5-2) |
| 6 | Matched withdrawal / cashback detail | X | **O** | TetherMax-balance screen |
| 7 | VIP service | X | **O** | |
| 8 | Cashback boost | X | **O** | |
| 9 | Exchange-specific events | X | **O** | Paid to a wallet address |
| 10 | Pre-settlement | X | **Review** | D+1 risk sizing |
| 11 | Coin draw / price prediction | X | **O** | |
| 12 | Invite friends / partner page | Partial | **O** | Closes B-2-8 and B-2-9 |
| 13 | Cashback challenge | Partial | **O** | |
| 14 | Benefits / coupons | Partial | **O** | |
| 15 | Exchange reviews | Partial | **O** | |
| 16 | Push notifications | O | **O** | Content needs full rewrite |
| 17 | Email notifications | O | **O** | Same |
| 18 | Event listing | O | **O** | Payout now possible too |
| 19 | Non-member lookup UID list | O | **O** | |
| 20 | DEX linking | O | **O** | |
| 21 | History page | O | **O** | |
| 22 | Country-level exchange visibility | O | **O** | Mandatory |
| 23 | Cumulative cashback | O | **O** | **Separate labelling no longer needed** — same balance |
| 24 | Cashback timeline | O | **O** | DEX-specific stage no longer needed |
| 25 | Notices | O | **O** | |
| 26 | Email unsubscribe | O | **O** | |
| 27 | Cashback preview (calculator) | O | **O** | **Result screen must be rewritten** — TetherMax pays |
| 28 | UID ownership claim | Held | **X** | **DEX not supported** (2-2) · O0–O16 stay as the CEX path |
| 29 | My Portfolio | Unjudged | **X** | No API |
| 30 | Quiz (Learn and Earn) | Review | **Review** | |
| 31 | Terms of service | Review | **Review** | **Raised in importance by fund custody** |
| 32 | FX / brokers | Review | **Review** | |

---

# 8. Follow-up work this re-verdict creates

| # | Task | Affected document |
|---|---|---|
| 1 | **Retire principle A-08 and establish a new one** | 03 decision record |
| 2 | **Revise exclusion decisions A-09 to A-19 (11 items)** | 03 |
| 3 | **Reconsider the "separate labelling" rule for cumulative cashback** | 04, 07 |
| 4 | **Rewrite all 13 DEX push and email notifications** | FCM.xlsx, EMAIL.xlsx |
| 5 | **Include DEX in the matched-withdrawal screen** | 07 screen changes |
| 6 | **Restore the milestone and VIP progress bars** | 07 (V1 had them removed) |
| 7 | **Add DEX to the invite-reward payout UID list** | 07, 08 |
| 8 | ~~Make the optional field (`volume`) the top partner-negotiation priority~~ → **withdrawn.** **Hourly UTC timestamps** take top priority instead | Folder 1, API request |
| **9** | **Delete the four "DEX excluded" invite-reward strings + change the payout modal behaviour** | Folder 2, screen changes |
| **10** | **Register ownership-guide slides in the backoffice** (4 DEXs × 2 device types) | Folder 4, backoffice |
| **11** | **Add the four DEXs to the league-creation exchange dropdown** | Folder 4, backoffice |
| **12** | **Extend the aggregation-date dropdown from 4 to 7 days** (Lighter weekly) | Folder 4, backoffice |
| **13** | **Ask Lighter for a daily ledger** (Maxboard streak cell) | Folder 1, API request |

## 8-1. What flips — things V1 said to remove

| V1 instruction | V2 |
|---|---|
| **Remove** milestone and VIP progress bars from DEX | **Restore** — VIP now applies |
| **Exclude** DEX from cashback ranking (revert `RK-1`, `LST-22`) | **Do not revert** — the original design was right |
| **Do not render** DEX in the invite-reward payout UID list | **Render it** |
| **Separate** DEX amounts in cumulative cashback | **Can be merged** |
| **Exclude** DEX from event-reward payout screens | **Include it** |

> **Several designs that V1 flagged as "needing to be reverted" turn out to have been correct all along.** Not having started that revert work is fortunate.

---

# 9. Notification rewrite scope

All 13 DEX-specific notifications written under V1 are **void**.

| V1 notification | V2 |
|---|---|
| DEX wallet linking completed / failed | **Keep** |
| DEX wallet linking confirmed (Lighter pending released) | Keep |
| **DEX cashback paid** | **Retire** → revert to the CEX-equivalent **withdrawal completed** |
| **ApeX unclaimed cashback reminder** | **Retire** — the claim step is gone |
| **DEX cashback withheld (Lighter)** | Keep — abuse holds still exist |
| Aster referral expiring soon / expired | **Keep** — the 365-day expiry still exists |
| **DEX cashback payout carried over** | **Retire** → revert to **withdrawal failed** |
| — | **New: withdrawal completed / failed** (same shape as CEX) |
| — | ~~New: ownership claim approved / rejected / wallet unlinked~~ → **N/A for DEX** (2026-10-22) |

**Event-reward notifications now apply to DEX as well.** Coupon, challenge and league notifications excluded in V1 all come back.
**Invite-reward notifications apply to DEX too** (decision A-2, 2026-10-21).

### ~~The three ownership notifications~~ → excluded for DEX (2026-10-22)

The three MAX-431 §5-5 notices (approved, rejected, displaced-user unlinked) **go out on CEX only.**
DEX does not support ownership verification, so **none of them fires on a wallet.**

→ **The notification rewrite scope drops by three.** The "UID → wallet" rewording is not needed for them either.

---

# 10. Revision log — 2026-10-21

Reflects analysis of six existing PRDs (MAX-8/10/18/30/431/466) and the Maxboard PRD.
Source decisions: `6_기존PRD_분석/확정_결정_기록_20261021.md`.

| # | Change | Basis |
|---|---|---|
| 1 | **Global League** conditional → **O** | K-1 — `1 USDT cashback = 1 point` (MAX-8 §3) |
| 2 | **Maxboard** conditional → **O** | M-1 — cashback is the bingo gauge (Maxboard PRD) |
| 3 | ~~UID ownership claim X → O~~ → **reversed to X on 10-22** | Policy decision |
| 4 | **Conditional verdicts: 2 → 0** | `symbol` / `volume` confirmed unnecessary |
| 5 | ~~Exclusions: 2 → 1~~ → **final: 2** (ownership claim · My Portfolio) | see 3 above |
| 6 | Removed the *"only functional constraint"* claim in 0-2 | It was wrong |
| 7 | Added the **Lighter streak-cell constraint** (5-2) | Maxboard PRD REQ-040 |
| 8 | Added the **bingo batch ↔ Aster 09:00** clash | Maxboard PRD REQ-036 |
| 9 | Follow-up tasks: 8 → **13** | throughout |
| 10 | Added the three ownership notifications | MAX-431 §5-5 |

## 10-2. Revision log — 2026-10-22

| # | Change | Basis |
|---|---|---|
| 1 | **UID ownership claim O → X** (2-2) | Policy — not supported on DEX |
| 2 | Distribution **O 27 / X 1 → O 23 / X 4 / out of scope 1** | see 1 and the 2026-10-22 entries |
| 3 | **Ownership notifications excluded for DEX** → rewrite scope drops by three (§9) | see 1 |
| 4 | **DEX guide slide sets no longer produced** | see 1 |
| 5 | **`LINK UID` coupon excludes DEX** added (3-0) | Policy |

## 10-1. Final verdict distribution

```
O — applied     23  ████████████████████████
X — excluded     4  ████
Out of scope     1  █
Under review     4  ████
Conditional      0
────────────────────
Total           32
```

**What began as 11 exclusions in V1 ends as 4** — the UID ownership claim, My Portfolio, **Cashback Boost** and **the Cashback Challenge**.

> **The Cashback Challenge excludes DEX (settled 2026-10-22).** The V2 re-assessment had raised it from partial to applied; that is reversed. Unlike Boost, nothing structural blocks it — this is a policy call. It also removes V1's half-in state, where the gauge filled but DEX could not claim. **One open question remains: whether DEX cashback counts toward the gauge total.** Home shows a total that includes DEX, so a gauge that silently excludes it leaves two numbers disagreeing with no on-screen explanation.

> **VIP is not an X but "out of scope".** It is structurally possible; it was simply **left out of this release** (2026-10-22) and will be re-assessed in the next one.

> **Cashback Boost excludes DEX (settled 2026-10-22).** Of its three columns, `other platforms` has no source — no competitor publishes a DEX figure — and `boost applied` does not exist for DEX at all. A DEX row would ship with two of three columns blank.

### One exception to remember

Even inside the 26 applied, **the `LINK UID` coupon (3 USDT) alone excludes DEX** (see 3-0).
Take care not to read the benefits area as uniformly open.
