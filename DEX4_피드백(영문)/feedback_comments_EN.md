# DEX PRD Feedback - English Comments

PDF page numbers count the first page as page 1. Repeated comments are consolidated; original comments remain attached at every source location.

## 🟠 Missing requirement M-3 - Hourly UTC timestamps must be preserved

Locations:

- [Review] PRD-Cashback Integration (DEX Partner APIs)-231026-030235.pdf - p4


Confirmed: The ledger must be stored at **hourly granularity, with `timestamp_utc` on every record**. The client re-aggregates it by the user's local date.

Reason: The same trade falls on different dates for different viewers.
  2026-10-19 23:30 UTC = October 20 in Korea / October 19 in the eastern United States.
If we receive only daily totals grouped by the server's UTC date, they will not match the user's 'today'. This requirement applies across the service.

This replaced `volume` in item 5 of the partner negotiation checklist. **It must appear in the request sent to partners, but is missing from this PRD.**

---

## 🟠 Missing requirement M-9 - Local-time conversion rules are missing

Locations:

- [Review] PRD-Cashback Integration (DEX Partner APIs)-231026-030235.pdf - p4


Confirmed policy (N-1): **Even when the server returns UTC, the frontend converts timestamps to the device's local time for display.** Relative times, such as countdowns, are exceptions.

The existing rules point in the same direction: 'KST for Korean views, UTC for other languages' and 'convert to the user's local time zone on the UID-link success screen'.

Across all 13 PRDs, there are **no occurrences** of `local time`, `local date` or `timezone`. UTC appears 108 times, with only the instruction 'labelled (UTC) where a day or month boundary matters'.

This goes together with M-3 (hourly timestamps). Local-date re-aggregation requires an hourly ledger, and receiving an hourly ledger enables local-time conversion. **Specifying only one leaves the requirement incomplete.**

---

## 🔴 Conflict C-8 - Global League still depends on `volume`

Locations:

- [Review] PRD-Cashback Integration (DEX Partner APIs)-231026-030235.pdf - p7


Confirmed policy (K-1): **Both cashback rankings and Global League use cashback amounts**, not trading volume.

Reference: MAX-8, Section 3, Score Logic - `1 USDT of commission cashback = 1 point`. TetherMax has no system of its own that records trading volume.

This line, together with p19's `symbol + volume - Required if Lighter wants to power Global League and Maxboard`, changes the **optional fields in the partner API request**. Under the confirmed policy, that item was replaced with **hourly UTC timestamps** (M-3).

The league works without volume. Remove it from the partner requirements and request timestamps instead. **This changes what we ask partners to provide.**

---------------------
✅ **Confirmed (2026-10-23)**
League and rankings are based on **cashback amounts, rather than trading volume**. Please replace all descriptions that depend on `volume` with **cashback amounts**.

---

## 🟠 Missing requirement M-4 - Aster's monthly payout cap of 20,000 USDT is missing

Locations:

- [Review] PRD-Cashback Integration (DEX Partner APIs)-231026-030235.pdf - p10


This was agreed on Telegram:
  "Total program-wide payout starts capped at $20,000/month. If the cap is reached before month-end, the cap is reassessed and can be adjusted. Review period of 7 days."

None of the 13 PRDs mentions `20,000` or a monthly cap.

---------------------
✅ **Confirmed (2026-10-23)**
**Handling depends on Aster's response. The conditional rules have been decided in advance.**

| Aster's response | TetherMax handling |
| Carryover is allowed | **1. Carry over to the next month** (preferred) |
| Carryover is not allowed | **2. Stop accrual when the cap is reached** |
| Cap utilization can be queried | **3. Show the remaining allowance to users** |
| Cap utilization cannot be queried | **Do not show it to users.** Reconcile manually against monthly statements in the backoffice |

🔴 **We have already asked, and Aster has not answered.** The two questions in `Aster API Request F5` cover exactly this: 'What happens to subsequent rebates if the monthly cap is reached mid-month: do they stop, carry over to the next month, or get reduced proportionally?' and 'Can cap utilization be queried?'

**These questions were not addressed in the eight-item PM reply on October 1, and there is no official Aster response document yet.**

⚠️ The outlook is not promising: the same reply said **"pending amount is not easy to provide"**. Utilization requires summing accruing commission, so **option 3 may well be unavailable**.

In either case, **the backoffice needs the cap setting and a way to view utilization, automatically or manually**. This belongs with the M-17 reporting views.

---

## 🟠 Missing requirement M-21 - Maxboard operating conditions are missing: Lighter daily ledger and common batch time

Locations:

- [Review] PRD-Cashback Integration (DEX Partner APIs)-231026-030235.pdf - p19


Confirmed policy:
  - **O-2:** If a **daily ledger cannot be obtained for Lighter, do not operate Lighter Maxboard**. The fallback of using amount-only squares was also rejected.
  - **D-10:** The bingo batch runs at **12:30 UTC, without exceptions**.

The PRD describes Maxboard data only as `symbol + volume`, without linking it to **Lighter's daily-ledger prerequisite or the 12:30 UTC batch**. There are **zero occurrences** of `12:30` in the documents.

This appears alongside C-8 (Global League's volume dependency) and M-3 (hourly timestamps), but is a **different issue**: those concern scoring, while this concerns **operating prerequisites and batch timing**.

Lighter settles **weekly**. Without a daily ledger, the bingo progress cannot be updated each day. Unless this prerequisite is specified, **Maxboard could be developed before the required ledger is available**.

Whether Lighter can actually provide the daily ledger remains subject to partner discussions.

---

## 🔴🔴 Structural issue S-1 - This backoffice PRD still uses V1 assumptions

Locations:

- [Review] PRD-DEX Backoffice PRD - As a TetherMax admin & content operator, I would like to administrate and manage the Decentralised Exchanges via the Backoffice [MAX-1270]-231026-030236.pdf - p3


**The user and API PRDs were rewritten for V2, but the backoffice PRDs were not updated.**

Counts by document:
   - API: 0 V1 phrases / 59 V2 phrases
   - Five user documents: 3 V1 phrases / 38 V2 phrases
   - Three backoffice documents: **35 V1 phrases / 1 V2 phrase** <- the problem

Comparing the October 20 and October 23 exports explains why. `As a TetherMax admin`, `Part 2 Linking/Settlement/Messaging` and `Part 4 Broker Content Editors` are **byte-for-byte identical**. While Service Flows gained 4,614 lines and Hub and Navigation grew from 19 to 41 pages, the backoffice documents were untouched.

The backoffice PRDs therefore still say:
   - "TetherMax never settles or pays DEX trading cashback"
   - "TetherMax pays no event rewards to DEX traders"
   - "Invite rewards are CEX only"
   - "DEX trading cashback is withdrawn on the DEX through the Withdraw on {DEX} redirect"
   - Out of Scope: "Any payment of DEX trading cashback or DEX event rewards by TetherMax ... There is therefore **no DEX payout approval, omni account, payout file, layer two internal transfer**"

**The API document in the same PRD package says the opposite:** 100% of commission goes to Wallet A, Wallet B pays traders directly, and TetherMax pays the gas.

🔴 **Consequently, all of the following are missing from the backoffice:**
   - Wallet A to Wallet B rebalancing operations
   - DEX withdrawal approval, execution and failure handling
   - Gas funding and consumption management
   - DEX event reward payments, blocked as CEX-only by LST-21
   - DEX invite reward withdrawals, blocked as CEX-only by LST-46

C-2 (link-cap formula), C-5 (broker editor), C-6 (first-link coupon) and C-7 (address masking) all originate in these three documents. **The entire backoffice PRD must be reviewed against V2; isolated edits will not be enough.**

---

## 🔴 F-2 - S-1 action list: nine modules still contain V1 assumptions

Locations:

- [Review] PRD-DEX Backoffice PRD - As a TetherMax admin & content operator, I would like to administrate and manage the Decentralised Exchanges via the Backoffice [MAX-1270]-231026-030236.pdf - p3


S-1 only says that 'three backoffice PRDs remain on V1'. That is not actionable without identifying **which modules need which changes**. The modules were checked individually.

| Module | Location | Remaining V1 statement |
| `Event Reward Payment` | BO Edge p6 | "CEX only; no DEX in any filter" |
| `Invite Reward Withdrawal` (LST-46) | Part 1 p31 | "Invite rewards are **CEX only**" |
| `Invite Friends` (INV-1, INV-2) | Part 1 p31 | "DEX wallets are **rejected by server validation**" |
| `Guest Manual Cashback` | Overview p3 | "pays no event rewards to DEX" |
| `Cashback Pre-Settlement` (LST-49) | Part 1 p32 | Pre-settlement itself is out of scope (see C-15) |
| Settlement ingestion `CSB-11` | Part 2 p44 | "**No TetherMax payout for DEX traders**" |
| Withdrawal/payout API | BO Edge p6 | "Withdrawal or payout to a DEX wallet ... **Rejected by the server**" |
| `LST-51`: DEX rows are data-only | Part 1 p47 | "**data only** in cashback and payout modules" |
| `EXT-11` rewards deep link | Part 1 p5 | "used by the **Withdraw on {DEX} redirect**" (see C-21) |

🔴 **The following required screens are also completely absent:**
   - **Wallet A to Wallet B rebalancing operations**
   - **DEX withdrawal approval, execution and failure handling**
   - **Gas funding and consumption management**

**No backoffice screen covers the actual movement of money under V2.** These three areas need new designs when S-1 is addressed.

---

## 🔴 Conflict C-11 - The PRD allows a different withdrawal minimum for each DEX

Locations:

- [Review] PRD-DEX Backoffice PRD_ Edge Cases and Error Handling-231026-030257.pdf - p4


Confirmed policy: **A minimum of 10 USDT applies uniformly per account**. Another section of this PRD also says, "The minimum is 10 USDT per linked account, on every route".

However, `BEC-EXT-8a` adds a **per-DEX minimum withdrawal field** to the exchange record and says **`Empty means no minimum`**. An operator can therefore remove the minimum for a DEX by leaving the field empty.

This breaks:
  - The rule that Confirm Withdraw withdraws every wallet with 10 USDT or more
  - The basis for applying the per-account matching formula
  - The economics of withdrawals smaller than their gas cost, such as a 0.5 USDT withdrawal with 2-5 USDT in gas

**Choose one consistent rule: a configurable field or a fixed 10 USDT minimum.**

---------------------
✅ **Confirmed (2026-10-23)**
The minimum **cannot vary by DEX**. Apply a **uniform 10 USDT minimum across all exchanges**. Do not add a per-exchange minimum withdrawal setting.

---

## 🟠 Clarification M-16 - A new two-person approval rule was added for corrections over 100 USDT

Locations:

- [Review] PRD-DEX Backoffice PRD_ Edge Cases and Error Handling-231026-030257.pdf - p23


`COR-3` requires Corrections permission, a reason and a source reference, plus **a second approver for amounts over 100 USDT**.

---------------------
✅ **Confirmed (2026-10-23)**
**Do not introduce two-person approval.** The TetherMax backoffice **has no concept of a second approver**.

Please **delete** "Amounts over 100 USDT require a second approver" from `COR-3`. **Keep Corrections permission, the mandatory reason and the source reference.**

Removing the second approver also **removes the monetary threshold**. Do not put an amount threshold in `COR-3`. (**10 USDT is the minimum withdrawal amount**, C-11; it is not a threshold for manual corrections.)

---

## 🔴 Conflict O-4 - A warning prohibiting DEX event rewards remains in event-email targeting

Locations:

- [Review] PRD-DEX Backoffice PRD_ Edge Cases and Error Handling-231026-030257.pdf - p26


`BEC-MSG-7 Event email targets DEX-linked members` says: **"Warning that no DEX event reward may be promised."**

Confirmed policy A-1 **allows event rewards for DEX users**. This warning is incorrect and shows operators **the wrong restriction every time they send event email to DEX-linked members**. Please remove it.

Also address:
  - Existing all-CEX audiences **must not automatically expand to DEX**, preserving the meaning of saved audiences
  - Provide **All / All CEX / All DEX** scope selection
  - **Not linked** means a member with no linked account on **any CEX or DEX**

This is a sub-item of S-1, the remaining V1 backoffice assumptions.

---

## 🟡 Supplement M-26 - Recommending one language list erases differences between modules

Locations:

- [Review] PRD-DEX Backoffice PRD_ Edge Cases and Error Handling-231026-030257.pdf - p28


Author's recommendation, Points to resolve #1: **"State the full language list once"** and reference it from every editor, with English and Korean mandatory.

The existing baseline records **five different language sets**: 15 site-wide, 6 for manual push, 4 for SEO, 2 for the exchange guide editor and 4 for the DEX content editor. **One unified list cannot represent this structure.**

---------------------
✅ **Confirmed (2026-10-23)**
**Operator-authored content exists only in the languages supported by its admin interface; users of other languages see English.** Supporting 15 languages for every admin field is not feasible, so this is **intentional behavior**.

🟢 **English fallback is already defined in the PRD:** "A language with no content **falls back to English** rather than rendering blank sections" (BO Overview), `BEC-GD-7` and `BEC-MSG-2`. **Leave those provisions unchanged.**

Only recommendation #1 needs to change. **Keep the language set specified for each module rather than unifying them into one list.**

---

## 🟠 Missing requirement M-25 - Aggregation frequency and weekday settings are missing (supplement to M-11)

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p6


Confirmed policy R-22: In **Exchange Create/Edit**,
  - Extend the relative dates for aggregation **start and end**
  - Add **frequency (daily/weekly)** and **weekday** settings

M-11 only said 'extend the aggregation-date dropdown to seven days'. **That was incomplete.** Extending to seven days alone **does not express a once-a-week aggregation schedule**.

Lighter settles the previous Monday-Sunday period **every Monday**. Without a weekday setting, the exchange record cannot represent this schedule, and operators lack a basis for querying and reconciliation.

The PRD **describes** Lighter's weekly settlement and includes Lighter-specific settings in `EXT-18`, but has **no common aggregation-frequency and weekday fields for exchanges**.

The location is **Exchange Create/Edit**, not a query filter in Cashback All History.

---

## 🔴 Conflict C-2 - The link cap still uses a DEX-only formula

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p10


Confirmed on 2026-10-23: Apply **one cap to the member's total number of trading accounts**, combining CEX and DEX. The separate DEX formula was discarded.

The PRD, `EXT-17`, retains `3 x number of active DEXs` and explicitly excludes CEX UIDs.

Why this needs attention:
1. An existing CEX cap already has the same shape: `number of exposed, linkable exchanges x 3`, regardless of exchange type.
2. Registering four DEXs as exchange records therefore **already increases the existing CEX cap by 12**. Adding a separate DEX cap counts the same records twice.
3. Consumption rules also conflict: failed or unlinked CEX UIDs keep occupying slots and cannot be self-unlinked, whereas this document says 'removed or unlinked wallets do not count'.

---------------------
✅ **Confirmed (2026-10-23)**
Use **a unified cap**, based on **the member's total number of trading accounts**, without separating CEX and DEX. Discard the DEX-only formula.

---

## 🟠 Conflict C-7 - Wallet-address masking length

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p19


Confirmed: **Mask the address, leaving only its last four characters visible.**

The PRD shows the first four and last four, such as `2341...2332`.

**The PRD is closer to common practice.** Ethereum addresses always start with `0x`, so retaining only the last four characters noticeably increases the likelihood that different addresses look identical. The existing CEX API-key rule also retains the first four and last four.

However, **notification rules for push/email are separate**. The existing rule says 'mask UIDs in notifications, leaving the last four characters'. Screen and notification rules should be considered separately.

---------------------
✅ **Confirmed (2026-10-23)**
Leave **only the last four characters** visible. Do not expose the first four.

---

## 🔴 Conflict C-15 - DEX is being added to the pre-settlement module

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p32


Confirmed policy, 2026-10-23: **Pre-settlement** is not an existing feature and is excluded from the support review and development scope. Quiz support is included.

LST-49, Cashback > Cashback Pre-Settlement, adds Exchange Type, wallet-address and account-ID columns to this module. LST-51 also assumes DEX pre-settlement.

Fixing S-1, the remaining V1 backoffice assumptions, will not remove this feature from scope. Because pre-settlement itself is out of scope, LST-49 and its related references must be cleaned up.

---------------------
✅ **Confirmed (2026-10-23)**
**Remove DEX from pre-settlement.** Pre-settlement is not a feature in this release's scope. Delete the DEX additions to that module.
Note: **Quiz support has been confirmed.** Do not group quiz and pre-settlement together as nonexistent features; see C-13.

---

## 🟡 Missing requirement M-11 - The aggregation-date dropdown has not been extended

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p39


Confirmed policy E-2: **Extend the admin aggregation-date dropdown (`Today` / `1 day ago` / `2 days ago` / ...)** because **Lighter settles weekly** and the existing range is insufficient.

The PRD does not describe this extension. Its references to `7 days` concern pending-link retries and export expiry, which are different issues.

Operators need the dropdown to reach at least seven days back to inspect Lighter's weekly settlements.

---------------------
✅ **Confirmed (2026-10-23)**
Extend the aggregation-date dropdown to **a seven-day range**.

---

## 🔴 Structural issue S-1 (continued) - LST-21 blocks DEX event rewards

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p43


`LST-21` restricts Event Reward Payment to **CEX only**, based on the statement "TetherMax pays no event rewards to DEX traders".

**Confirmed policy A-1 pays event rewards to DEX users too.** This became possible when the structure changed so that TetherMax receives the commission. The user document in the same PRD package also says 'event rewards apply to DEX traders'.

The same problem affects `LST-46`, Invite Reward Withdrawal, marked CEX-only: confirmed policy A-2 treats DEX invite rewards the same way as CEX UIDs.

See S-1.

---------------------
✅ **Confirmed (2026-10-23)**
**DEX users also receive event rewards.** Remove the CEX-only restriction from `LST-21 Event Reward Payment` and **include DEX in filters, eligible recipients and payment history**.

---

## 🔴 Conflict B-01 - LST-30 contradicts itself within one requirement

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 1, Classification, Priority and Landing Content-231026-030304.pdf - p45


`LST-30` says to "manage DEXes similarly to how Central Exchanges are managed", then immediately says **"Event Reward Accrual Rate does not apply to DEXs, because TetherMax pays no event rewards"**.

Confirmed policy: DEXs are included in Point Management, use the same input and validation rules as CEXs, and treat unset values as zero. **A-1 grants event rewards to DEX users**, so the reason for disabling this field no longer applies.

Please remove the statement disabling the event reward accrual rate and specify point accrual for DEX activity in line with the confirmed policy. This is a sub-item of S-1.

---

## 🟠 Conflict C-6 - First-link 3 USDT coupon

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p35


Confirmed: The 3 USDT UID-link coupon is **CEX-only; DEX is excluded**.

The PRD, LNK-30, issues the coupon for a first DEX link too, but holds it in `Awaiting UID` until the member has a CEX UID to receive it.

**The PRD may offer a better design here.** It recognizes eligibility but restricts the payout destination to CEX, consistent with the previous distinction between 'DEX activity may establish eligibility' and 'only CEX may receive the money'. Whether to adopt that approach requires review.

---------------------
✅ **Confirmed (2026-10-23)**
The first-link 3 USDT coupon **can be used on DEX**, but **a DEX link does not qualify for issuance**. In other words, **a first DEX link does not issue a coupon, while an already-issued coupon can be used on DEX**.

---

## 🔴 Conflict C-20 - First-link coupon: backoffice and user documents directly contradict each other

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p35


**The PRD is internally inconsistent.**

Backoffice, `LNK-30` and `BEC-LNK-33`:
   "The coupon is credited only to a CEX UID: **it can never be credited to a DEX wallet address**."
   "First-link coupon claimed to a DEX wallet, including through the API - **Rejected**"

User documents, `EC-CPN-1` and Service Flows:
   "First-link coupon (3 USDT) **moves to the linked wallet's Available Cashback**."
   "The member applies it from My Coupons to **one linked account they choose**"

**One side rejects DEX-wallet receipt on the server; the other applies the coupon to a DEX wallet.** Implementing this as written would let users apply a coupon in the UI only to have the API reject it.

Confirmed policy P-2 excludes DEX from the 3 USDT `LINK UID` coupon. However, as noted in C-6, the backoffice `Awaiting UID` compromise may be preferable. Whichever approach is chosen, **both documents must agree**.

---------------------
✅ **Confirmed (2026-10-23)**
Same as C-6: **Issue only for a first CEX link; allow usage on DEX too.** Align the backoffice and user documents with this rule.

---

## 🟡 Supplement M-7 - Challenge module: we can provide the missing answer

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p40


This entry is blank because the author 'does not understand the module's purpose well enough to describe the impact'.

**Confirmed on 2026-10-22: Cashback Challenge does not include DEX.** DEX wallets must not appear when selecting the account that receives a challenge reward.

Rationale: Challenge rewards are paid as event rewards. The previous assessment distinguished between 'DEX may establish eligibility' and 'DEX may not be the destination receiving money'. Progress accumulation could be possible, but all DEX participation is excluded from this release's scope.

---------------------
✅ **Confirmed (2026-10-23)**
**The answer to the blank entry: DEX exchanges cannot be used either for challenge progress accumulation or for selecting a participating UID.** The challenge module includes no DEX participation. This is the same rule as C-19.

---

## 🔴 Structural issue S-1 (continued) - CSB-11 states the opposite of V2

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p44


`CSB-11 No TetherMax payout for DEX traders` says: "TetherMax pays no event rewards to DEX traders and never moves money for DEX traders. DEX trading cashback is paid by the DEX into the trader's DEX account and withdrawn on the DEX."

**The API document in the same PRD package says Wallet B sends money directly to traders' wallets.** This changes the entire settlement-module design. Under this document, **there are no screens for payout approval, execution or failure handling**.

See S-1. The three backoffice PRDs were not updated from the October 20 version.

---------------------
✅ **Confirmed (2026-10-23)**
**TetherMax pays users under V2.** The CSB-11 statement 'never moves money for DEX traders' is a V1 assumption and **must be discarded**. DEX users also receive **event rewards**, and cashback is paid **from the TetherMax balance through Wallet B**. Consequently, **payout approval, execution and failure-handling screens need new designs**; see F-2.

**Rewrite this paragraph around V2.** This changes the underlying premise, beyond a wording edit: TetherMax is the payer, Wallet B transfers funds to traders' wallets, and the associated **approval, execution and failure-handling screens are required**.

---

## 🟡 Missing requirement M-17 - Three DEX reporting views are missing from our deliverables

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p86


PRD `RPT-2` through `RPT-5` define DEX reporting:
  - **Lighter weekly summary:** weekly referee count, accrual and withheld weeks
  - **Aster binding report:** counts by binding status, Active/Expiring/Expired/Renewed, and upcoming expiries
  - **ApeX / EdgeX summary:** linked-account counts by day and month

**These views are absent from our backoffice comparison document.** This is a gap in our coverage, rather than a criticism of the PRD.

The Aster binding report is especially necessary. The 365-day expiry is the biggest risk; without a view showing upcoming expiries, **operators may miss the time to act**. M-4, viewing utilization of the monthly 20,000 USDT payout cap, should be included here too.

---------------------
✅ **Confirmed (2026-10-23)**
**Add the three reporting views.**
However, **the PRD does not specify their location**. `RPT-3`, `RPT-4` and `RPT-5` all refer to RPT-2 with 'Module and menu path: **the DEX reporting views (RPT-2)**', but **RPT-2 itself has no menu path**.
Please **specify RPT-2's menu path first**. Once it is defined, we can place the views at the same location in our backoffice comparison document.

This is **not a decision for us to make**. The PRD author must fill in the missing RPT-2 menu path. We will then align our backoffice comparison document with it.

---

## 🔴 Conflict R-3 - Invite Friends is defined as CEX-only

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 2, Linking, Settlement and Messaging-231026-030259.pdf - p88


  - `INV-1`: "The Invitation Reward calculation for Invite Friends reads **only centralised exchange cashback records**... DEX ingested records are [refused]"
  - `INV-2`: "An Invitation Reward withdrawal is processed **only to one of the inviter's own active linked centralised exchange UIDs**"

🔴 This directly conflicts with confirmed policies A-2 and A-19: **DEX referrals generate invite rewards and are treated the same way as CEX UIDs**.

The PRD also entirely omits the **Featured Exchange dropdown within Invite Friends**. `LST-7 Featured Exchange` belongs to Exchange > Exchange List, a different module.

Address this together with S-1 and C-17, the invite reward accrual trigger.

---

## 🔴 Conflict C-21 - Part 3 also retains V1 reasoning

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 3, DEX Landing Page Listings, Edit Landing Content, Detailed Content and Cashback Landing page-231026-030254.pdf - p3


This line remains unchanged:
   "**Withdraw on {DEX} stays available** while the rewards deep link (EXT-11) is configured, **because the cashback sits in the trader's DEX account**."

**Under V2, cashback does not sit in the trader's DEX account.** It sits in the TetherMax balance and Wallet B pays it out. The `Withdraw on {DEX}` button based on that premise must also be discarded.

Clean up the related locations together: `EXT-11 DEX rewards deep link`, Part 1; `BEC-EXT-8`, BO Edge; and `MSG-2` push deep-link destinations, Part 2.

The user document already says the opposite in `EC-WD-9`: **"No DEX page, new tab or deep link opens."**

Address this together with N-6 and S-1.

---

## 🔴 Conflict C-18 - Calculator rates are entered and stored separately

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 3, DEX Landing Page Listings, Edit Landing Content, Detailed Content and Cashback Landing page-231026-030254.pdf - p17


Confirmed policy R-25: Spending Estimate separately manages **only the trading-volume slider range**. **Rates are read from the existing exchange record.**

`SPE-5` requires **two rates per partner, before and after TetherMax**, and stores them separately: 'Two rate fields replace the single cashback field ... Both are mandatory.' `SPE-6` rejects a fourth decimal place.

🔴 **Storing the rates in two places will cause inconsistencies.** Updating the exchange record would leave the calculator displaying old rates.

⚠️ **This was also a gap in our feedback.** Our Screen Changes Required item 11-9 already says 'SPE rate table duplicates the exchange record', but we failed to carry that finding into this PRD feedback.

Do not define a new decimal precision here. Lighter's rate table uses four decimal places. First move to a single source of truth, then have the implementation team confirm actual field precision. This is separate from M-14, the standalone calculator.

---------------------
✅ **Confirmed (2026-10-23)**
**Only the trading-volume slider range is managed separately. Rates come from the values entered in Exchange Details.** Remove 'Two rate fields ... Both are mandatory' from `SPE-5` and replace it with a reference to the exchange record.

---

## 🔴 Conflict C-5 - Broker content editors

Locations:

- [Review] PRD-DEX Backoffice PRD_ Functional Requirements Part 4, Broker Content Editors-231026-030303.pdf - p1


Confirmed: **Broker content is hardcoded; there is no separate admin menu.**

The PRD designs all 14 pages of Part 4 as Broker Content Editors: a listing table, add modal, Compare/Detailed editors and drag-and-drop priority.

Please confirm whether operators now need to edit broker content themselves, or whether the DEX editor structure was simply copied for brokers. If it is the latter, this entire part falls outside the development scope.

---

## 🔴 Conflict C-12 - The PRD displays a Lighter Standard warning

Locations:

- [Review] PRD-DEX PRD_ Edge Cases and Error Handling-231026-030245.pdf - p19


Confirmed policy D-6: **Do not warn or block.** Link the wallet just like any other wallet.

The initial idea was to 'allow linking and show a warning', but this changed to 'we may not be able to identify Standard, and even if we can, there seems no reason to block or warn'. **The final decision was to take no action.**

The PRD, `EC-LNK-21` and `LW-12`, displays **a non-blocking inline warning** below the wallet-address field.

🔴 **The more significant impact:** Displaying this warning requires `account_tier`. The PRD **polls the Lighter tier hourly** and adds a `Tier (Plus/Premium/Standard/Unknown)` admin column. Under D-6, the confirmed policy downgraded the **`account_tier` API from required to optional**. Keeping the warning **makes this Lighter partner dependency mandatory again**.

---

## 🔴 Conflict M-15 - Do not impose a concurrent-withdrawal restriction

Locations:

- [Review] PRD-DEX PRD_ Edge Cases and Error Handling-231026-030245.pdf - p46


`WD-4` and `WD-8` use 'Account already has a pending withdrawal' to **block another request while processing**.

✅ **Confirmed (2026-10-23): Do not apply this restriction.** There is no basis for blocking, and it is uncertain whether we can reliably evaluate the condition.

Withdrawal-card behavior has also been decided: **Leave the card as it is while processing, then show the success/failure result once processing finishes.** Do not create a separate blocking state for processing.

Please remove the pending-withdrawal blocking rules from `WD-4` and `WD-8`.

---

## 🟠 Missing requirement M-12 - The ranking eligibility threshold differs from the existing rule

Locations:

- [Review] PRD-DEX PRD_ Edge Cases and Error Handling-231026-030245.pdf - p58


PRD `EC-RNK-2`: An Active linked account is eligible if it has accrued cashback greater than 0 USDT.

The existing and confirmed rule excludes cashback below 0.01 USDT.

Difference: An account with 0.005 USDT qualifies under the PRD but is excluded under the existing rule. Aster converts fee assets into USDT, so records in this range can actually occur.

Address this together with M-2, displaying amounts below 0.01 as zero.

---------------------
✅ **Confirmed (2026-10-23)**
Rankings **follow the existing rule: 0.01 USDT or more qualifies**. Do not introduce a separate threshold.

---

## 🔴 Conflict C-16 - Accounts still being checked are allowed to write reviews

Locations:

- [Review] PRD-DEX PRD_ Edge Cases and Error Handling-231026-030245.pdf - p61


Confirmed policy D-5: A user can write a review only when **linking for the relevant exchange account is complete**. Cashback history is not an additional condition.

`EC-PG-14` says 'Can post while the link exists' even for Aster Expired or **Lighter Processing**.

`Processing` means attribution verification is unfinished. Lighter can hold a link for **up to seven days** if masked addresses collide. Allowing reviews during this period can leave **reviews from users whose link ultimately fails**.

This differs from M-6, the `✓ Verified` badge condition. **Define the badge condition and permission to write a review separately.**

Aster attribution expiry is different from a link still being processed. This comment does not introduce a blanket ban for expiry on the same grounds.

---------------------
✅ **Confirmed (2026-10-23)**
**Accounts in Processing must never qualify to write reviews.** Only accounts with **completed linking** qualify.

---

## 🟠 Missing requirement M-6 - Review `✓ Verified` badge conditions are missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, DEX Pages and Cross Cutting-231026-030226.pdf - p26


Confirmed policy D-4: Display the `✓ Verified` badge next to a reviewer on Exchange Details **when linking for that exchange account is complete**. CEX and DEX share the same condition. Do not add cashback history or separate ownership verification as conditions.

The PRD does not define the badge condition. DEX has no ownership verification, so 'linking complete' provides a different assurance level from CEX while using the same badge. If this is intentional, state it explicitly.

---------------------
✅ **Confirmed (2026-10-23)**
**Completed linking qualifies for `✓ Verified`.** Cashback history is not a condition.

---

## 🔴 Conflict C-1 - The withdrawal matching formula is written as a simple sum

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, DEX Pages and Cross Cutting-231026-030226.pdf - p34


Confirmed policy: `Withdrawable amount = cashback + MIN(event reward, cashback)`. The event reward portion cannot exceed the cashback amount.

The PRD simply adds the two, producing opposite eligibility outcomes in some cases:
  - Cashback 2 / event reward 8: PRD 10, withdrawable; confirmed policy 4, not withdrawable
  - Cashback 0 / event reward 50: PRD 50, withdrawable; confirmed policy 0, not withdrawable

Reference: MAX-18 Problem Statement. Matching prevents users from harvesting only event rewards without actual trading. It already applies to CEX. Applying a different DEX rule would give the same member different results depending on the route.

The example in this document, cashback 7.00 / event reward 7.00 = 14.00, happens to produce the same result under both formulas because B <= A. The example alone does not reveal the difference.

---------------------
✅ **Confirmed (2026-10-23)**
**Use matching, rather than a simple sum.** `Withdrawable amount = cashback + MIN(event reward, cashback)`.

---

## 🔴 Missing requirement M-2 - Small-amount display rule is missing: show amounts below 0.01 USDT as zero

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Hub and Navigation-231026-030217.pdf - p22


Confirmed on 2026-10-23: **Display amounts below 0.01 USDT after conversion as zero**, preserving the ledger's original precision. Rankings also **exclude cashback below 0.01 USDT**.

The PRD specifies only truncation to two decimal places, MC-6, without the small-amount threshold. Every reference to 0.01 concerns **EdgeX's payout minimum**, carrying forward amounts below 0.01 USDC, which is a different issue.

This particularly affects Aster, which settles in the fee asset and converts it to USDT. Records worth a few cents can occur routinely. Without a rule, CEX could show 0.00 while DEX shows 0.003 USDT.

---------------------
✅ **Confirmed (2026-10-23)**
**Amounts below 0.01 USDT are not paid under the existing policy.** Therefore, MC-6's rule that sub-cent amounts are neither carried forward nor credited later **matches our policy and can remain unchanged**.

Only one issue remains: **The PRD does not state that the payout threshold is 0.01 USDT.** Its references to 0.01 all concern **EdgeX's own payout minimum**, carrying forward sub-0.01 USDC amounts. Please state it as **a common payout threshold across all exchanges**.

---

## 🟡 Missing requirement M-10 - DEX inclusion in Global League team-creation eligibility is unspecified

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Hub and Navigation-231026-030217.pdf - p24


Confirmed policy B-3: **Include DEX cashback in the Global League team-creation eligibility totals: 500 USDT lifetime / 100 USDT over 30 days.**

The PRD mentions Global League only as a screen reflecting balance changes. It does not specify **whether DEX counts toward participation and team-creation eligibility**.

A-11 already includes DEX in rankings. Excluding it only from eligibility calculation would mean **users appear in the rankings but cannot create a team**.

---------------------
✅ **Confirmed (2026-10-23)**
**Include DEX cashback in Global League team-creation eligibility.**

---

## 🟡 New issue M-13 - How are ranking rewards paid to DEX wallets?

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Hub and Navigation-231026-030217.pdf - p24


**Both the PRD and our documents have a gap here.** Neither defines this behavior, so it is raised as a new issue.

CEX already has ranking rewards: **100 USDT for 1st, 50 USDT for 2nd, 20 USDT for 3rd and 10 USDT for the top 10%**. They are **added to the UID as event rewards**, without a separate withdrawal.

A-11 brings **DEX wallets into rankings**. We therefore need to specify where the reward goes if a DEX wallet takes first place.

A-1 allows DEX users to receive event rewards, so **crediting the reward to the wallet account is structurally possible**. However, no document says so. The payout rule must be decided alongside ranking inclusion.

---------------------
✅ **Confirmed (2026-10-23)**
Ranking rewards are **paid as event rewards** and therefore **subject to the C-1 matching formula**. Ranking rewards alone cannot be withdrawn.

---

## 🟠 Missing requirement M-22 - Location-specific criteria for the partner carousel and withdrawal feed are missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Hub and Navigation-231026-030217.pdf - p29


Confirmed policy, 2026-10-23:
  - The official-partner **auto-rotating carousel** belongs on **Service Introduction**. Display content, logos, ordering and exposure for CEX and DEX come **from the API**.
  - The completed **withdrawal feed** includes CEX and DEX on **both Home and Service Introduction**, using the existing **last-four-character masking**.

PRD status:
  - `RT-6` describes route-row partner logos as 'a static group ... **not a rotating carousel**', contrary to the confirmed policy.
  - `DX-14` is a **promotional banner carousel**, a **different component** whose slides are managed in the backoffice.
  - The withdrawal feed is mentioned in several places as an updated surface, but **there are no separate acceptance criteria for Home and Service Introduction**.

**This does not claim the screens are entirely absent.** The components and their display locations need explicit acceptance criteria.

---------------------
✅ **Confirmed (2026-10-23)**
**Auto-rotating carousel: Service Introduction.**
**Withdrawal feed: both Guest Home and Service Introduction.**

---

## 🔴 Missing requirement M-14 - We missed this calculator entirely

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Hub and Navigation-231026-030217.pdf - p34


**This is a gap in our analysis, rather than a criticism of the PRD.** That needs to be stated first.

`PB-1` through `PB-9` define a **standalone funnel calculator**: Landing > Choose platform > Trading profile > Calculating > What You're Missing Out On > Summary. It appears **nowhere in our documents**.

In J-1, we treated Spending Estimate as only the hub's CASHBACK ESTIMATE widget. This is **a separate nine-page feature**, Figma `Calculator / Web / CC1 Landing` through `CC6 Summary`.

DEX clearly affects it:
  - `PB-3` adds a **DEX group** to platform-selection tiles
  - `PB-5` asks for the **Lighter account type**, Premium / Plus / Standard, directly related to C-12
  - `PB-8` gets rates from the backoffice

Our screen-change list, backoffice comparison and prototypes do not cover it, so **we must fill this gap in our deliverables**.

---------------------
✅ **Confirmed (2026-10-23)**
**Add it.** Its location has been confirmed: this is **a dedicated `/payback` page, separate from the Cashback Hub**.
`PB-1`: 'One page with a progress bar under the global header ... **Entry points: the Calculator destination in the Cashback sitemap and the Cashback Preview card**'.
The hub is therefore only **an entry point**. This is a **separate screen** from the hub's CASHBACK ESTIMATE widget, J-1. Add the six-step `/payback` funnel to our deliverables: Landing > Choose platform > Trading profile > Calculating > What You're Missing Out On > Summary.

**No separate backoffice input screen is needed.** All calculator values are **read from existing exchange records**, the same rule as C-18. What we must add is **the six user-facing steps**, not new admin inputs.

---

## 🟠 Clarification C-13 (continued) - LE-10 reward terms were reversed from the October 20 version

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Learn and Earn Quiz Module-231026-030220.pdf - p4


| October 20 version | 'the score is zero, one or two and **no reward tier is applied**' |
| October 23 version | '...and **the reward tier for that score is applied once**' |

`LE-9` was also changed to 'the USDT reward for that score is granted once, following the existing quiz logic, and **credited to their TetherMax balance as an event reward**'.

✅ **Confirmed (2026-10-23): Quiz support is included.** The October 23 reward-payment provision therefore stands. Because rewards are **credited to the TetherMax balance as event rewards**, the following automatically applies:
  - The **C-1 matching formula** applies. Quiz rewards alone cannot be withdrawn, and **the event reward portion cannot exceed the cashback amount**.
  - The M-8 first-withdrawal benefit and M-13 ranking rewards are also event rewards.

Please state explicitly in `LE-9` and `LE-10` that **the matching formula applies**.

---

## 🔴 Missing requirement M-1 - It is unspecified whether the 72-hour / 24-hour account restrictions apply to DEX withdrawals

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p2


Confirmed on 2026-10-23: **Apply the 72-hour restriction after a password change and the 24-hour restriction after 10 failed withdrawal-email verification attempts equally to member CEX and DEX withdrawals.** Guests are exempt because they have no account information.

The PRD has only one line saying withdrawal verification follows 'the existing 24 hour restriction', Service Flows p19. **The 72-hour restriction is absent from all 13 documents.** It also does not explicitly state whether the 24-hour restriction applies to DEX withdrawals.

Under V1, TetherMax did not pay users, so there was no place to apply these restrictions. This PRD now pays from the TetherMax balance through the same captcha/OTP flow, exactly the route those restrictions protect.

**As written, an account with a compromised password could be blocked from CEX withdrawal for 72 hours yet withdraw through DEX immediately**, despite using the same TetherMax balance.

---

## 🟠 Missing requirement M-5 - Withdrawal email policy is missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p2


Confirmed on 2026-10-23: **One receipt email per request, followed by a final success/failure email for each account.** Do not add intermediate emails. Do not send emails to guests.

A DEX withdrawal request sends separate payments to multiple wallets, so **the number of emails differs from CEX**. The PRD does not describe this.

Transactional emails were also missing from EMAIL.xlsx, so rows 30-32 were added. Align this requirement with that sheet.

---

## 🔴 Conflict C-14 - Withdrawals are split into separate CEX and DEX tabs

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p2


Confirmed policy: **Do not separate CEX and DEX withdrawals.** List eligible accounts **together in the existing priority order and submit them in one request**. Do not introduce selection of only some accounts.

Reason: **TetherMax structurally does not support partial withdrawals.** A request withdraws the full amount from every eligible account, so separating them into tabs serves no purpose.

The PRD uses Centralised Exchanges and Decentralised Exchanges tabs. CEX selects and withdraws one UID at a time; DEX withdraws all eligible wallets within its tab. The agreement table on API p8 also labels a separate DEX tab as `Agreed`.

**The same member would withdraw CEX accounts individually but DEX accounts all at once.**

The backoffice must also trace per-account processing records from one request through **a common request ID or grouping**. This links to C-9, the representative account on the share card.

---------------------
✅ **Confirmed (2026-10-23)**
**Do not split withdrawals by CEX and DEX.** Put eligible accounts in **one list**, in the existing priority order, and **submit them together**.

---

## 🔴 Conflict C-19 - Challenges are included in DEX event rewards

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p5


Confirmed policy D-13, 2026-10-22: **Cashback Challenge does not include DEX.** Exclude DEX both from reward-receiving accounts and **from progress accumulation itself**.

This line says: 'Event rewards (quizzes, **challenges**, benefits, event cashback and event commission) **apply to DEX users** as well as CEX users'.

This is **broader than M-7**, where backoffice CSB-4 is blank because the author does not understand the module well enough to describe its impact. The user document already states that DEX is **included**. Update the challenge detail and account-selection screens together to **explain that the feature is CEX-only**.

This does not mean adding a general notice back to the entire Benefits List page.

---------------------
✅ **Confirmed (2026-10-23)**
**DEX cannot be used for either challenge participation or progress accumulation.** Both are excluded. Remove DEX from the challenge module entirely.

---

## 🔴 Conflict C-3 - DEX ownership claims were excluded from this release

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p6


Confirmed on 2026-10-20, A-16: **DEX wallet ownership claims are excluded from this release**, with customer support as the alternative route.

The PRD designs the full workflow: three screen-recording steps, a 30-day cooldown, the LNK-13 backoffice review queue and OWN-1 through OWN-8.

Either the exclusion still stands and all this is out of scope, or ownership claims are now included and A-16 must be withdrawn. **Please confirm which applies.**

Note: The risk identified in Section 17-13, wallet ownership risk, is that a wallet can be linked by pasting without a signature, allowing withdrawal of someone else's accrual. If the ownership workflow is removed, that risk must be addressed another way.

---------------------
✅ **Confirmed (2026-10-23)**
**Ownership transfer is excluded from this release.** Please remove the DEX wallet ownership-claim workflow from the release scope.

---

## 🔴 Conflict C-10 - Members are allowed to remove their own wallets

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p12


Existing confirmed policy, owner decision on 2026-07-21: Users **cannot unlink their own accounts in the app or web**. They contact support, then a developer deletes the DB record. There is an explicit rule **not to direct users to a self-service unlink button**.

The 2026-10-23 confirmation is the same: 'Incorrect links, duplicates and unlinks are handled by the backend only for requests submitted through CS. Do not add self-service unlinking.'

The PRD includes a member-facing **Remove Wallet** action, with several requirements built on it:
  - `EC-WD-6`: a member removes a wallet while its payout is Processing
  - `EC-WD-19`: all wallets removed
  - `EXT-17`: removed or unlinked wallets do not count toward the cap

Address this together with C-2, the linking cap. Without self-service removal, the rule that removing a wallet returns a slot also does not hold.

---------------------
✅ **Confirmed (2026-10-23)**
Members **cannot remove links themselves**. Provide only the customer-support route.

---

## 🔴 Conflict C-4 - Milestone progress bar

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p15


Confirmed on 2026-10-23: **Milestones are not an existing feature, so exclude them from the screens.**

The PRD renders milestones even for DEX-only members and specifies 'First Milestone approximately TradingView Subscription (100 USDT)'.

One of these statements is incorrect. First confirm **whether milestones actually exist in the current service**. If they do, the confirmed policy needs correction; otherwise, remove this entire section.

---------------------
✅ **Confirmed (2026-10-23)**
**Milestones do not exist.** Please exclude them from the screens.

---

## 🟠 Conflict C-9 - The share card says payment is complete

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p19


Confirmed policy: The share card can appear **after a withdrawal request is successfully submitted**. Its wording must say **request submitted**, not payment received.

The PRD uses `Withdrawal complete`.

**This is inconsistent within the same document.** The PRD also says 'each payout shows Processing until it is Sent'. Saying 'complete' before the on-chain transfer finishes makes users think **the funds have already arrived in their wallet**.

DEX payments can actually fail due to gas spikes, nonce conflicts or RPC timeouts, making this risk greater than on CEX.

---------------------
✅ **Confirmed (2026-10-23)**
Use **request submitted**, not payment complete.

---

## 🟠 Missing requirement M-24 - The share card has no rule for choosing its representative account

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p19


Confirmed policy: Choose the share card's **representative account using the priority order of the current withdrawal-request list**.

`WD-4` describes the card as **a single DEX chip and wallet address**, without specifying **which account represents a request containing multiple accounts or a mix of CEX and DEX**.

This is a routine case because **one DEX withdrawal request sends separate payments to multiple wallets**.

This supplements C-9, where 'Withdrawal complete' is inappropriate at request submission, and C-14, unified withdrawals. **Use the existing priority order; do not invent a new sort order.**

---

## 🔴 F-1 - There are requirements but no corresponding designs for 21 screen areas

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p24


WHAT THIS MEANS
The PRD references Figma nodes alongside requirements, with 220 citations in total. For some requirements, **the PRD itself says 'not in Figma yet' instead of providing a node**. A full count found 21 such areas, and **those 21 areas happen to include the new V2 screens**.

WHY IT MATTERS
Where development follows designs, requirements without designs mean **implementation cannot start until the designs arrive**. Existing screens have designs, while the new areas do not. This makes **the new V2 features the last part of the schedule to finish**.

**All places where the PRD explicitly says 'not in Figma / not drawn yet' were counted: 21 in total.** Many concern the new V2 structure.

CORE V2 AREAS WITHOUT DESIGNS
  - `WD-7`, Lighter weekly settlement card: 'Not designed in the Figma yet'
  - `WD-10`, ApeX hourly batches: same
  - `WD-11`, EdgeX daily settlement: same
  - `WD-12`, Aster daily ledger: same
  - **Daily Wallet A to Wallet B rebalancing:** same
  - `GW-3` and `GW-4`, **guest withdrawals:** same
  - Withdrawal-card **loading, zero-balance, delayed and error states:** 'not drawn yet'
  - DEX-card **event reward, estimate and expiry lines:** 'not drawn yet'

OTHER AREAS
  - Aster renewal steps; `PB-8` expandable calculation explanation; calculator card view/empty results; app home/web empty states; Link Account's **CEX UID path**; Global League guest state

DESIGNS THE PRD ALREADY IDENTIFIES AS INCONSISTENT
  - `CS1`: 'day 26 reads +37.40 USDT while its day list nets +17.40 USDT (**design to align**)'
  - `PB-2`: the lead mentions brokers, but PB-3 offers no broker choice (**design to confirm**)

HANDLING DIRECTION (2026-10-23)
  - Once the mockups are available, **we will identify the missing screens**. These design gaps are not decisions to resolve in the current PRD review.
  - However, CS1 and PB-2 are **inconsistencies already acknowledged by the PRD**, so the author should resolve them first.
  - This is the **same coverage gap** as F-2, three missing backoffice areas, and F-3, areas absent from the prototypes.

---

## 🟠 Missing requirement M-23 - Exchange-filter grouping, scope selection and the definition of Not linked are missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p39


Confirmed policy:
  - Outside withdrawal screens, **distinguish CEX and DEX within a single exchange-selection list**, using badge rules and grouped dropdowns.
  - Target filters containing both groups offer **All / All CEX / All DEX** scope choices.
  - **An existing All CEX manual-push audience must not automatically expand to DEX**, preserving the meaning of saved audiences.
  - **Not linked** means a member with **no linked account on any CEX or DEX**.

The PRD renames All UIDs to All Accounts and lists CEX and DEX together in CS-1, but **does not define group-level scope selection**. MSG-1 only adds DEX options, and the Not linked definition is not connected to LST-17 audience selection.

🔴 **Silently broadening existing audiences is the biggest risk.** If a saved All CEX push audience starts including DEX members, recipients increase without the operator realizing it.

Address this together with the O-4 correction.

---

## 🟠 Missing requirement M-8 - The first-withdrawal benefit, Claim your first cashback, is missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p50


Confirmed policy K-2: **The Claim your first cashback benefit, the 10 USDT first-withdrawal benefit, applies equally to a first DEX withdrawal.** Do not introduce a separate benefit amount or payout frequency.

The PRD includes the **first-link** 3 USDT coupon, LNK-30, and the Unlock Your First Cashback in 3 Steps checklist, but **never describes the first-withdrawal benefit itself**.

First-link and first-withdrawal benefits are different. Please specify that a first withdrawal to a DEX wallet qualifies for this benefit.

---

## 🟠 Missing requirement M-19 - Link blocking due to unreceived cashback is missing

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p60


Confirmed policies B-5 and H-4: **Unreceived cashback of 10 USDT or more blocks linking itself**, `FAILED_NEED_RECEIVE`. This is the current CEX policy and **applies unchanged to DEX**, across all exchanges.

This state is **absent** from LW-8's failure/held-state list. The list includes Verification Limit Reached, Unable to Link Wallet for support/not-a-referral cases, wallet limit and Processing, among others.

🔴 **This will immediately affect ApeX.** Under V1, ApeX was the only partner where traders claimed directly, so **many users have existing unreceived balances**. They should be blocked when attempting to link, but no blocking state is defined.

How to query or migrate ApeX's existing unreceived balances remains subject to partner discussions. This comment does not decide that handling; it identifies **the missing blocking condition and user guidance**.

---

## 🔴 Conflict C-17 - The invite reward accrual trigger is different

Locations:

- [Review] PRD-DEX PRD_ Functional Requirements, Service Flows_ Linking, Ownership, Withdrawals, Cashback Summary and Ranking-231026-030244.pdf - p88


Existing formula: Invite reward = **`downstream withdrawal amount` x exchange margin x reward rate**. In other words, it accrues **only when the downstream member withdraws**. The 2026-10-23 confirmation also explicitly describes 'zero rewards because the downstream member has made no withdrawals'.

`IF-1` says 'Given an invited friend's DEX cashback **is credited** from the ledger' and 'DEX cashback counts **once it is credited**'. PH-1 also uses crediting as the trigger.

**Crediting and withdrawal happen at different times.** Under a crediting-based rule, the inviter receives rewards even if the downstream member never withdraws, creating a different calculation basis from existing CEX referrals.

This is **separate from S-1**, which says invite rewards are CEX-only in the backoffice. That concerns eligibility, while this concerns the accrual trigger.

Actual contracted margins and funding remain subject to discussions.

---------------------
✅ **Confirmed (2026-10-23)**
**Invite rewards accrue when the downstream member withdraws.** Keep the existing formula: downstream withdrawal amount x exchange margin x reward rate.

---
