> ## ⚠️ V2 applied — further corrections 2026-10-23
>
> This document was originally written against the **V1 structure**, in which each DEX paid the trader directly.
> **The 2026-10-20 policy change reversed that** — TetherMax now receives 100% of the commission and pays the trader itself — and on **2026-10-22 every remaining V1 assumption was cleared out.**
>
> | Chapter | What changed |
> |---|---|
> | **6. Withdrawal modal** | **Rewritten end to end.** The payout formula `A + MIN(B, A)` is now verified against live data. `Withdraw on {DEX}` deep links, new-tab redirects and "your balance does not go down when you withdraw" are **all retired** |
> | **14-4 Withdraw modal** | **Settled.** The "four things that break if we merge" were V1 premises and are **all resolved** |
> | **14-3 Live withdrawal feed** | Concerns about the `Withdrawal time` and `Status` columns are **resolved** |
> | **14-5 Type filter** | `Event reward` and `Withdrawal amount` are **both valid for DEX** |
> | **1-1 · 5-1** | "does not go down when you withdraw" → **retired.** It is a TetherMax balance, so it decreases |
>
> For the full new structure see `../DEX_신규방침_종합정리.md`.

> ## 📌 Added 2026-10-21 — **read Chapter 16 first**
>
> We analysed the six existing PRDs (MAX-8/10/18/30/431/466) and the Maxboard PRD, and closed the outstanding policy questions.
> **Eleven screen changes were added, bringing the total to 103**, and **one earlier item was reversed.**
>
| New | Item |
|---|---|
| 🔴 16-1 | **Payout formula was wrong** — corrected to `A + MIN(B, A)` |
| 🔴 16-2 | Designer's assumption #5 corrected (`No Event Reward row for DEXs`) |
| 🔴 16-3 | **Delete four "DEX excluded" strings about invite rewards** + behaviour change in the payout modal |
| 🔴 16-4 | **Aster post-expiry screens must be built** |
| 🟠 16-5 | Monthly ranking: `trading activity` → `cashback earned` |
| 🟠 16-6 | Hub calculator: `Paid into your Lighter account` → `Paid to your TetherMax balance` |
| 🟠 16-7 | Add a `Weekly` settlement-cycle badge |
| 🟠 16-8 | **Show DEX event rewards in cashback history** (reverses the earlier "hide" instruction) |
| 🟡 16-9 | Home screen — mark as "Andrew's plan takes precedence" |
| 🔴 16-10 | **UID-link coupon excludes DEX** (new, 10-22) |
| 🔴 16-11 | **Ownership verification unsupported on DEX** (new, 10-22) — remove the modal CTA |
| ⛔ 16-13 | **Cashback Boost excludes DEX** (settled 10-22) — **no change** is the instruction |
| ⛔ 16-14 | **Cashback Challenge does not reflect DEX** (settled 10-22) — drop the DEX group from the claim picker |
| 🟠 16-15 | **Shortened wallet addresses can collide** (new, 10-22) — two wallets on one exchange become indistinguishable |

> **16-12 lists the eight previously undecided items that are now settled.**
> Source decisions: `../6_기존PRD_분석/확정_결정_기록_20261021.md`.

---

# Screen changes required

Written 2026-10-20
Sources: 13 DEX PRDs + the existing TetherMax policy wiki + **the actual Figma designs** (`27267:342601`)
Purpose: a worklist for Figma (John) and for the documents (Hayley)

> Chapters 1–12 are written against the **requirements documents**. Chapter 13 covers findings that appear **only when the Figma file is compared element by element**. Chapter 14 covers findings from **comparing six live CEX screens**.

---

## Severity

| Mark | Meaning | When to fix |
|---|---|---|
| **🔴 Critical** | Tells the user something that is not true. Must be fixed before launch | Now |
| **🟠 Important** | Causes confusion, or becomes an operational problem | Before launch |
| **🟡 Cleanup** | Inconsistency, typo, omission. A quality issue | Batch before launch |

**92 items** in chapters 1–14.

| Group | 🔴 | 🟠 | 🟡 | Total |
|---|---:|---:|---:|---:|
| Ch. 1–12 (from requirements) | 9 | 32 | 33 | **74** |
| Ch. 13 (new, from Figma) | 3 | 7 | 2 | **12** |
| Ch. 14 (new, from live CEX screens) | 4 | 2 | 0 | **6** |
| **Total** | **16** | **41** | **35** | **92** |

> An earlier version said "47" and then "59". **Both were wrong** — items were added without updating the headline number. The figures above were obtained by counting the actual `###` headings.

---

## 0. Summary — the ten to fix first

| # | Screen | Problem | Requirement ID |
|---|---|---|---|
| 1 | DEX detail — calculator | **Describes the money flow backwards.** Drawn as "exchange → TetherMax → user" | VD-5, VD-6 |
| 2 | DEX detail — step guide | **"Deposit into your TetherMax wallet".** TetherMax has no wallet | VD-7 |
| 3 | DEX landing — hero | **"Connect a wallet".** Directly contradicts the rule that we never ask for a wallet connection | DX-1 |
| 4 | All screens | **"Available Cashback" means something different in V2.** In V1 it was a cumulative total that never went down; in V2 it is a TetherMax balance, so it **decreases when you withdraw** | LK-7, CH-11, WD-2, GW-2 |
| 5 | DEX card · non-member card | **No Total Claimed data exists.** None of the four DEXs provide it | LK-7, GW-2, PH-4 |
| 6 | Home — DEX balance card | **Sums numbers that mean different things on different DEXs** | LK-5 |
| 7 | Backoffice — Spending Estimate | **The decimal limit makes the documented example impossible to enter** (3 places allowed vs an example of 0.0005) | SPE-6, SPE-7 |
| 8 | Hub — partner comparison table | **There is a `DEXs` filter but not one DEX row.** All 16 rows are CEX | 13-1 |
| 9 | Hub — logo grid vs comparison table | **The same page lists exchanges two different ways, differing by six entries each** | 13-2 |
| 10 | DEX overview — comparison section | **The `Event and invite rewards` value for DEX differs across the PRD, the design and our own decision** | DX-12, 13-3 |

---

## 1. Global / shared

### 1-1. 🔴 Redefine "Available Cashback"

**Today:** DEX cards show `Available Cashback`, but the value is a **cumulative amount already paid**.

**Problems**
- ~~The number does not go down when the user withdraws on the DEX~~ → **Retired in V2.** It is a TetherMax balance, so it decreases.
- The underlying meaning differs per DEX.

| DEX | What the value actually is |
|---|---|
| Lighter | Cumulative Paid, per the weekly CSV |
| ApeX | Cumulative Paid. A separate `Available on ApeX` holds the real balance |
| EdgeX | `totalPaidAmount` — cumulative paid |
| Aster | Undefined |

**The ApeX card carries two different "Available" values**, so there is no way to tell which one is money the user can actually take.

**Fix:** rename to a `Paid` form across every DEX. Keep ApeX's `available_balance` as `Available on ApeX` — that one is genuinely withdrawable.

**Screens affected:** DEX selection card, Hub balance panel, withdrawal drawer, non-member My Cashback, Cashback Summary filter.

---

### 1-2. 🔴 Remove Total Claimed

**Today:** `Total Claimed` appears on the DEX card and the non-member card.

**Problem:** **none of the four DEXs provide a cumulative withdrawal figure**, and there is no structural reason they would — withdrawing happens inside the DEX and TetherMax is not a party to it. Only EdgeX has a substitute, in `Paid to your EdgeX account` / `On the way`.

**Fix:** remove it from every DEX screen.

---

### 1-3. 🟠 Establish a master list of status chips

**Today:** status chips are scattered across the documents with **no master list and no precedence order.**

Chips found so far: `Active` / `Processing` / `Unavailable` / `Standard account, no cashback` / `Expires in {n} days` / `Referral expired` / `Inactive` / `Ownership verification in progress` / `This wallet has been unlinked` / `Ownership verification was unsuccessful` / `Data delayed`

**Problems**
- No precedence when two apply at once (Aster expiring soon + data delayed; Lighter Standard + Processing)
- Rows (Linked Accounts) and cards (selected account) display differently
- EdgeX and ApeX have states with no chip at all (AccountID not returned, restricted-IP trading)

**Reference:** TetherMax already has a **UID status precedence 1–7**. It is the only global rule of this kind, so extending it in the same shape (an integer priority) is the consistent choice.

**Fix:** write a separate status table. Columns: name / condition / priority / row display / card display / shows an amount / action state / applies to which DEX.

---

### 1-4. 🟠 Rename the `Unavailable` chip

**Today:** shown when cashback is zero.

**Problem:** a new user who linked successfully reads it as "this does not work". What it actually means is "you have not traded yet, so nothing has accrued".

**Fix:** use a `No cashback yet` form.

---

### 1-5. 🟠 Remove hardcoded rates

**Today:** `CH-16` forbids hardcoding rates, yet these are fixed strings:
- `RT-3` / `RT-4` / `RT-5`: "UP TO 90% / 30% / 84%"
- `CH-4`: "0.0280%"

**Problem:** changing a rate requires a deploy.

**Fix:** use `UP TO {n}%` and compute the highest rate among the partners on that route.

---

### 1-6. 🟡 "Exchange Cashback" is used for two different things

The CEX-only card is `Exchange Cashback Balance`, while a line item inside the DEX card is also `Exchange Cashback`.

**Fix:** rename the DEX one to `Trading Cashback` or `{DEX} Cashback`.

---

### 1-7. 🟡 Match the official language pack

Official English, per the existing pack:

| Korean | Official English | Do not use |
|---|---|---|
| 페이백 / 캐시백 | `cashback` | `payback`, `rebate` |
| 연동 | `Link` | `integration`, `interworking` |
| 연동 해제 | `Unlink` | `disconnect` |
| 비회원 | `guest` | `non-member` | 🔄 **Changed 2026-10-23.** The language pack still carries the old pair and needs the same change |
| 포인트 | `point` / TP | `Points` (plural is non-standard) |

**The DEX PRDs use `cashback` correctly.** There is an inconsistency between `Points` (GN-6) and `Point` (4.20).

---

### 1-8. 🟡 Unify time-zone notation

**Fix:** member screens use UTC throughout with an explicit `(UTC)`. Backoffice uses UTC as the primary with KST as a secondary, for Korean operators.

---

### 1-9. 🟡 Decimal places for amounts

**Today:** the calculator shows daily amounts to four places (`$0.0333`) while every other amount uses two. There is no unifying rule.

**Proposed rule:** store at full precision; display rounded to two places (half-up); sum the unrounded values first and round the total. Ranking order uses the unrounded value.

---

## 2. Cashback Hub

### 2-1. 🟠 Wrong CEX partner count

`RT-6` says "16 CEX marks", but the main PRD and `LW-26` say 17 (23 = 17 + 4 + 2).

### 2-2. 🟠 Route order inconsistent

`GL-2` and `CH-4` order it CEX → DEX → broker; `RT-2` orders it DEX → CEX → broker. Confirm the intent and unify.

### 2-3. 🟠 Calculator volume ranges differ

The Hub uses 1K–250K for DEX; the detail page uses 100K–10M. **Same DEX, same calculation, different range.**

**Fix:** hold one range per DEX in the backoffice (Spending Estimate) and have both screens read it.

### 2-4. 🟠 Guest reason cards carry CEX-only content

Two of the three cards in `RT-7` — "More cashback from events" and "Invite friends, earn more" — **only happen on CEX.** They are reused as-is on the DEX landing page (`DX-8`).

**Fix:** hide those cards in a DEX context, or qualify them.

### 2-5. 🟡 Comparison table column name

The column is `Exchange` and the search placeholder is `Search for an exchange`, but the table includes DEXs and brokers.

### 2-6. 🟡 Undefined items in the comparison table

- How to show Final Taker / Maker for brokers
- Which formula a broker's Monthly cashback uses
- The basis for the `Highest payout` badge (per filter, or overall)
- Where Rating data comes from

### 2-7. 🟡 Touch behaviour conflict

In `GL-2`, a touch device opens the Cashback panel on tap, while clicking the label navigates to the landing page. What a single tap does needs defining.

### 2-8. 🟡 App entry path

`GN-6` calls Cashback "the single entry point for all Cashback products" while keeping the Exchanges tab. The path to DEX inside the app is undefined.

### 2-9. 🔴 Cashback calculator (live screen) — DEX must be added

**Screen:** `Cashback Preview` → step 1, `First, which exchange do you use most often?`
**Form:** progress bar at the top + a single-select grid of exchange cards + `Back` / `Next`

> **Instruction (2026-10-20): "DEX has to be here too. I believe the design already exists."**
> The Figma Hub calculator (doc ④, 1-3) appears to replace this screen, but **the two have different shapes** — see below.

#### Current screen

| Element | Value |
|---|---|
| Question | `First, which exchange do you use most often?` |
| Card | logo + exchange name + **`Final cashback rate N%`** |
| Selection | **single select** (Bitget highlights when chosen) |
| Exchanges shown | **12** — WOO X Pro 100 / Bitget 77 / Bybit 64 / OKX 55 / Flipster 70 / DeepCoin 75 / Gate 81 / LBank 99 / BlockFin 70 / Bitunix 94 / HTX 54 / Toobit 70 |
| Buttons | `Back` / `Next` (`Next` disabled until a card is chosen) |

#### 🔴 Action 1 — put DEX in the options

**Include**, per A-08. A calculator input is not a payout destination; it is an eligibility and lookup surface.

#### 🔴 Action 2 — the result screen has to differ for DEX

> 🔴 **Corrected 2026-10-23 — this table was V1 and all four rows are reversed.**
> What follows is V2. Building from the previous table produces the result screen **backwards**.

Under V2 **TetherMax is the payer**. The calculator result screen uses the **same structure** for CEX and DEX; the only difference is the identifier label (UID vs wallet address).

| Item | CEX | DEX (V2) | Source |
|---|---|---|---|
| Who pays | TetherMax | **TetherMax** — same | V2 structure |
| Paid into | TetherMax balance | **TetherMax balance** — same | V2 structure |
| Minimum withdrawal | 10 USDT | **10 USDT** — same | V2 4-3 |
| Matching reward | yes | **yes** `A + MIN(B, A)` | A-1 |
| Identifier | UID | **wallet address** | the only difference |

~~`Paid into your Lighter account`~~ and similar copy **must not be used.** The destination is the TetherMax balance.

The Figma Hub calculator handles this with one line, **`Paid into your Lighter account`** (doc ④, 1-3). **The live calculator needs the same treatment.**

> ⚠️ This whole sub-section is written on the V1 premise. Under V2 the DEX also pays into the TetherMax balance with the same 10 USDT minimum — see 16-6, which replaces that line with `Paid to your TetherMax balance`.

#### 🟠 Action 3 — a fourth different exchange list

Doc ④ noted that Figma's logo grid (16) and comparison table (16) **differ by six entries each**. The **live calculator is a third list of 12.**

| List | Count | Note |
|---|---:|---|
| Live calculator | **12** | a mix drawn from both Figma lists |
| Figma logo grid | 16 | |
| Figma comparison table | 16 | differs from the grid by six |
| Figma table heading | **23** | `across 23 partners` |
| PRD body | **17** | the CEX count |

**Five numbers, all different.** `NFR 11` says the partner count must be computed from published records and never written into the markup. **This screen has to be record-driven too.**

Confirm whether 12 is the whole list or a paginated slice.

#### 🟠 Action 4 — the terminology differs

| Screen | Label |
|---|---|
| Live calculator | **`Final cashback rate`** |
| Figma comparison table | `Final Taker` / `Final Maker` (**split in two**) |
| Figma calculator | `Cashback, 20%` |

**It is unclear whether these are the same value.** The live `Final cashback rate 100%` (WOO X Pro) does not match the Figma table's highest value of 85% (Bitunix). Resolve together with 1-6 and 1-7.

#### ⚠️ To confirm — how the two screens relate

| | Live calculator | Figma Hub calculator |
|---|---|---|
| Shape | **stepped wizard** (progress bar + back/next) | **single page** (slider updates immediately) |
| Exchange choice | single-select card grid | `PARTNER` select |
| Volume input | presumably the next step | slider `$1K–$250K` |
| Route split | **none** | `route segmented` tabs (CEX/DEX/FX) |

**Confirm whether the Figma screen replaces this one or both stay.** If it replaces it, the DEX work here is unnecessary; if both stay, **both need doing.**

---

---

## 2-10. 🔴 Route selection — **only the DEX row never says how you get paid** (2026-10-22, Hub HA5 frame)

**Screen:** cashback hub, guest, `Where do you trade?` — three rows

The third line of each row carries **a different kind of information.**

| Route | Current copy | Kind |
|---|---|---|
| Centralised exchanges | `Paid daily, withdraw from 10 USDT` | ✅ **payout terms** |
| **Decentralised exchanges** | `Paste your wallet, never connect` | 🔴 **how to link** |
| Brokers | `Forex, commodities and indices` | asset classes |

**In V1 the asymmetry was correct.** A DEX paid the trader directly, so TetherMax had no payout terms to state.

**In V2 both routes pay identically** — TetherMax pays, minimum 10 USDT. So a guest comparing the two **learns the payout terms for CEX and nothing for DEX**, which is the exact question that decides whether they link a wallet.

**Fix:** give the DEX row **the same payout line as CEX**, and move `Paste your wallet, never connect` or let the two share the slot.

> The baked-in minimum (13-10) still applies. When it goes into the DEX row it has to be **a server-returned variable.**

### ✅ Three items **resolved** in the same frame

Recorded earlier against an older hub frame (`27267:346729`).

| # | Previously recorded | This frame |
|---|---|---|
| **13-1** | not one DEX row in the comparison table | ✅ **four DEX rows** |
| **13-6** | `across 23 partners` baked into the heading | ✅ **`across 4 exchanges`** — follows the active filter |
| **2-4** | guest cards carry CEX-only content | ✅ **A-1 and A-2 make both true for DEX** — `More cashback from events` and `Invite friends, earn more` both stand |

> Capture: `_캡처자료/_추가요청/D_사용자화면/D-6_허브_게스트_DEX라우트_HA5.png`

### Still open, re-confirmed in this frame

| # | Item |
|---|---|
| **16-6** | calculator `Paid into your Lighter account` → `Paid to your TetherMax balance` |
| **13-5** | `Cashback, 20%` and `Lighter Premium taker, 0.0280%` hardcoded |
| **13-12** | the `Rating` column is **`-` on all four DEX rows** |

## 3. DEX landing page

### 3-1. 🔴 Hero lead copy

**Today:** `No KYC checks. Connect a wallet, and start trading!`

**Problem:** the whole document set repeats that we **never** ask for a wallet connection, and **the first sentence the user reads contradicts it.** The edge-case document already flags this as open item #16.

**Fix:** separate what happens on the DEX (connect a wallet, trade) from what happens on TetherMax (paste an address) into two sentences.

### 3-2. 🟠 Four different DEX orderings

| Location | Order |
|---|---|
| `DX-11` summary tiles | Lighter, Aster, EdgeX, ApeX |
| `DX-4` venue cards | Lighter, ApeX, EdgeX, Aster |
| `LK-2` link modal | Lighter, ApeX, EdgeX, Aster |
| `LK-2` selector | Lighter, Aster, EdgeX, ApeX |

**Some acceptance criteria pin the order.** The backoffice display order must be the single source.

### 3-3. 🟡 ApeX deposit methods inconsistent

`DX-5` says Fiat + Crypto, `VD-12` says USDT. `VD-1`'s acceptance criteria require them to agree.

### 3-4. 🟡 24h volume source not settled

The 24-hour volume endpoint in `DX-5` is still a proposal. TVL is settled (`api.llama.fi/tvl/{slug}`); volume is not.

---

## 4. DEX detail page — the most changes

### 4-1. 🔴 The calculator describes the money flow backwards

**Current `VD-5` diagram**
```
You → Trading fee → {venue} → Partner settlement → TetherMax → "Cashback returned to you"
```

**Current explanation card**
> `TetherMax gives cashback` — TetherMax returns {cashback} to you, so your effective fee becomes {effective fee}.

**Current `VD-6` drawer**
> the exchange settles with TetherMax, and TetherMax returns most of it

**The FAQ on the same page (`VD-8`) says the opposite.**
> Lighter pays your cashback in USDC **into your own Lighter account**, and you withdraw it on Lighter.

The landing page (`DX-3`, `DX-12`) also says "Paid by the DEX, into your account".

**Impact:** the user believes it accrues to their TetherMax balance, goes to withdraw, and cannot find it. That becomes support tickets and lost trust.

**Cause:** the CEX template was copied verbatim. This is not a copy fix — **the diagram's structure has to be redesigned.**

**Fix**
- Change the diagram to `You → Trading fee → {DEX} → {DEX} pays into your {DEX} account`
- Present TetherMax as the party that tracks and displays
- Remove `Partner settlement`, a CEX term
- The disclaimer's "exchange partner settlements" is also a CEX term and needs changing

> ⚠️ Written on the V1 premise. Under V2 the flow really is `{DEX} → TetherMax → you`, so the original diagram was closer to correct than this fix. What remains valid is that the page contradicts itself and that `Partner settlement` is the wrong term for a DEX. Rewrite against V2.

### 4-2. 🔴 Step-guide default copy

**Current `VD-7` step 2 label:** `Deposit {currency} into your TetherMax wallet`

**Problem:** TetherMax has no wallet. There is no way for the user to follow this instruction.

**Fix:** change to "transfer {currency} from an exchange or wallet to {DEX}". Operators write these steps in the backoffice, so only the default needs changing.

### 4-3. 🟠 Calculator volume range

Differs from the Hub (1K–250K). See 2-3.

### 4-4. 🟠 No account-tier selector

The `VD-5` explanation card references `{account tier}`, but no UI for choosing a tier is defined.

### 4-5. 🟠 Placement and enforcement of the three safety messages

Three safety messages are mandatory:
1. Keep your 12-word recovery phrase private
2. Sending on the wrong chain loses the funds
3. Check the referral code inside the DEX after signing up

**Problem:** two approaches conflict — detect them in free text and block saving (`EDC-17`), or insert them as fixed system strings (backoffice edge cases). **Detecting the presence of a message inside multilingual free text is not realistic.**

**Fix:** the system inserts fixed strings and the operator only chooses placement.

### 4-6. 🟠 How the EdgeX headline rate is validated

The EdgeX "up to 30%" in `VD-12` must not exceed the highest `registrationRate` among TetherMax's active codes. The headline is free text, and no comparison method is defined.

### 4-7. 🟡 Aster leverage conditions inconsistent

The landing page says "selected markets"; the detail page says "BTC in Simple Mode".

### 4-8. 🟡 Aster Solana mention

`VD-12` detail content mentions Aster's Solana support, but link validation is EVM-only (`EXT-13`).

### 4-9. 🟡 Review sub-score `Cashback withdrawal`

> ⚠️ Written on the V1 premise that withdrawal happens on the DEX. Under V2, TetherMax performs the withdrawal, so this sub-score **is** meaningful for DEX — although it measures something structurally different (an on-chain transfer that can fail for reasons no CEX withdrawal has). See the Reviews section of the prototype.

### 4-10. 🟡 Source of the figures

The figures in `VD-12` come from third-party reviews and need partner confirmation.

### 4-11. 🟡 Missing assets

The EdgeX banner and the 3D render for Step 4 do not exist yet, and the ApeX chips may need trimming.

---

## 5. Home / Linked Accounts

### 5-1. 🔴 Definition of DEX Cashback Balance

**Today:** a single USDT figure summing every linked DEX.

**Problem:** it adds numbers that mean different things per DEX (see 1-1). The user reads it as "money I can take right now", but it is "money I have received so far". It stays the same even after the user has withdrawn everything.

**Fix (V2 update):** ~~`Paid to your DEX accounts`~~ is **retired**. In V2 the DEX amount is also a TetherMax balance, so it uses **the same name as CEX** — it must match `Claimable cashback` in the withdrawal modal. Do not add a "does not go down when you withdraw" caption.

### 5-2. 🟠 EdgeX card not designed

`LK-10` is "Not designed in the Figma yet". The `Paid to your EdgeX account` / `On the way` structure is not reflected in the design.

### 5-3. 🟠 Lighter / ApeX settlement states not designed

Accruing / Paid / Withheld (Lighter) and Pending / Paid (ApeX) are absent from Figma.

### 5-4. 🟠 Aster expiry trigger defined twice

`LK-8`'s acceptance criteria are webhook-based; `LK-1`'s are date-calculation-based. **What happens if the webhook never arrives** is undefined.

### 5-5. 🟡 `Cut-off Time` in the Earning Timeline

Stated as "unchanged", but nothing says how it maps onto Lighter's weekly, EdgeX's daily and ApeX's hourly cycles.

**Fix:** expose each DEX's settlement cycle as it is. Do not force the CEX cut-off concept onto it.

### 5-6. 🔴 Milestone progress bar — **A-18's premise no longer holds. Re-confirm**

> 🔴 **2026-10-23 — this document and the prototype say opposite things.**
> This section says *remove*; prototype `home/S4` says *include*. **Raised as `N-1` in the decision request.**

`WD-1` says to render it even for DEX-only members; `GW-2` says to hide it from non-members.

**A-18 (confirmed 2026-10-20) removed DEX from the milestone and VIP progress bars.** Its reason was that the bar is the UI for reaching the CEX 10 USDT minimum and **DEX had no minimum**.

**That reason is gone under V2.** DEX cashback accrues to the same TetherMax balance under the **same 10 USDT minimum**, so the bar now has something to measure.

| | Milestone bar | VIP gauge |
|---|---|---|
| A-18's reason | DEX had no minimum | reward is an event reward, which DEX could not earn |
| Under V2 | 🔴 **reason gone** — same 10 USDT minimum | 🟢 reason holds (below) |
| Recommendation | **add DEX amounts and render for DEX-only members** | **keep excluded** |

**VIP is a separate matter.** It was confirmed **out of scope for this release** on 2026-10-22 and will be re-judged in the next one. The VIP reasoning below still holds.

The VIP gauge is calculated **per UID, not per TUID.** A DEX UID cannot receive event rewards, so there is nothing to grade. The challenge (A-13) was settled as "the gauge fills on DEX too", but **VIP does not separate eligibility from reward** — the tier is the rate, and the rate is the event reward, so filling the gauge yields nothing to give.

**Do not render the progress bar at all for a DEX-only member.** It cannot be filled, and filling it would mean nothing.

> ⚠️ Written on the V1 premise that DEX earns no event rewards. Under V2 (A-1) DEX does earn them, so this decision needs revisiting — see Chapter 16.

---

## 6. Withdrawal modal — ★ rewritten for V2 (2026-10-22)

> **This whole chapter was rewritten.** The V1 content — `Withdraw on {DEX}` deep links, new-tab redirects, "your accrued balance does not go down when you withdraw" — is **entirely retired.** In V2 **TetherMax withdraws on-chain directly**, so DEX uses the same withdrawal modal as CEX.
>
> Verified against live screens — `_캡처자료/_추가요청/D_사용자화면/D-1a · D-1b · D-2 · D-2b`

### 6-0. ✅ Settled — no tabs

| Item | Settled |
|---|---|
| Splitting CEX and DEX | **No.** Every linked account in **one list**, in priority order |
| Partial withdrawal | **Structurally impossible.** One request takes the full eligible amount |
| Sort order | **Eligible on top, ineligible below** (confirmed live) |
| Header total | **Sums only the eligible accounts** (live: `10.00 + 31.68 = 41.68`) |
| Milestone gauge | **Not in this modal** (confirmed live) |

### 6-1. ✅ The payout formula, verified against live data

```
Claimable cashback = A + MIN(B, A)      A = exchange cashback · B = event reward
Eligible to withdraw = A + MIN(B, A) ≥ 10 USDT     ※ judged per account
```

| Live case | A | B | Claimable | Check |
|---|---|---|---|---|
| Bitget UID 1432873105 | 5.00 | 232.00 | **10.00** | `5 + MIN(232,5)` = 10 ✅ |
| OKX UID 617755618866586639 | 31.68 | 0.00 | **31.68** | `31.68 + MIN(0,31.68)` = 31.68 ✅ |
| Bitget UID 2404441483 | 0.00 | **992.44** | **0.00** | `0 + MIN(992,0)` = 0 ✅ |

> Not a plain sum (`A + B`). **An event reward can never exceed the exchange cashback.**

### 6-2. ✅ The shortfall line is a calculated value

Live copy — `You can withdraw once you earn {n} USDT more in exchange cashback.`

| B (event reward) | Additional A needed | Why |
|---|---|---|
| B ≥ 5 | **5.00** | `5 + MIN(B,5)` = 10 |
| B = 0 | **10.00** | `10 + MIN(0,10)` = 10 |

**This is existing copy, not a new string.** The same line has to work on a DEX card.

### 6-3. 🔴 What changes on a DEX card — only three things

| Element | CEX | DEX |
|---|---|---|
| Identifier | `UID 1432873105` (18 digits) | **`Wallet 0x7a3F…c51E9`** (42 hex characters) |
| Label | `UID` | **needs a neutral word** — the same one used by the link modal and the email subject |
| Badge | — | **`DEX` badge** |

> **Left-hand linked panel** — live, accounts are grouped and collapsed per exchange, e.g. `Bitget 14 UIDs`. Decide **whether a member can link several wallets to one DEX**, and what the DEX equivalent of `14 UIDs` reads as.

### 6-4. 🔴 Event rewards with zero cashback — DEX makes this far more common

A live capture shows an account holding **992.44 USDT in event rewards with 0.00 withdrawable.** This already happens on CEX, but **DEX makes it the normal path.**

| | CEX | DEX |
|---|---|---|
| Funnel order | sign up → trade → events | **link wallet → see events → join** |
| This state | transient | **persists until the first trade** |

**Knock-on — a misfiring push.** `FCM row 26` triggers on a plain sum of **`commission + event reward ≥ 50`**. The account above sits at 992.44, so the member **receives "you can withdraw now" and opens the modal to find "There is no UID available for withdrawal."** The trigger must be corrected to `A + MIN(B, A)`.

### 6-5. 🔴 Multi-account summary

| Screen | Live display |
|---|---|
| Request complete | `Exchange: Bitget +1` · `UID: 1432873105 +1` |
| Share card | `Exchange: Bitget +1` · `UID: ****3105 +1` (**masked**) |

**To decide** — with DEX in the mix, the identifier line mixes an 18-digit UID and a 42-character wallet address. **Define which account is primary** (today it appears to be the first card in sort order).

### 6-6. 🔴 On-chain failures — modes CEX never had

| Mode | Note |
|---|---|
| Gas spike · nonce collision · Wallet B underfunded · chain congestion | retryable |
| **RPC timeout** | **you cannot tell whether it was sent.** Writing "please try again" invites a double send |

In a merged request where **CEX succeeds and only DEX fails**, success and failure notifications arrive together. `MAX-18 OQ#6` (partial failure across multiple withdrawals) needs a **DEX-specific policy** — a full refund **does not recover the gas already spent.**

### 6-7. ✅ Gas — never shown

The live completion screen has **no network-fee row, and that is correct.** TetherMax absorbs it in full: request 10 and exactly 10 lands in the wallet.

> Internally: `Wallet B required = Σ payouts + Σ gas`. At 2–5 USDT per transaction, a 10 USDT payout costs 12–15. Since 100% of the cashback goes to the trader, **gas is a pure loss** — which makes **per-transaction gas the deciding factor in choosing the chain.**

### 6-8. 🟠 The referral code on the share card

The share card carries a referral code and a QR offering **up to 26 USDT on sign-up**. **Where should a DEX share send people?** A generic sign-up page produces an unattributed wallet, and **attribution cannot be fixed afterwards.**

### 6-9. 🟡 Non-member withdrawal screen not designed

Status: `"Designs exist for members; guest designs to follow"`. A non-member has **a single wallet**, so there is no `+N` and the merged-list structure does not apply.

### 6-10. ✅ Retired V1 items

| V1 content | Disposition |
|---|---|
| Three display conditions for `Withdraw on Lighter` (`LK-7`·`LK-9`·`EC-WD-8`) | **Retired** — the button does not exist |
| DEX deep-link destinations must be settled | **Not needed** — it is not a withdrawal path |
| `Exchange Cashback is what you have earned, so it doesn't go down when you withdraw` | **Retired** — it is a TetherMax balance, so it decreases |
| Fallback when the new tab is blocked (`H12`·`H14`) | **Retired** |
| `Pending` used twice (Lighter `Accruing` vs `Pending payout`) | **Still valid** — settlement states still need display |

---

## 7. Link modal

### 7-1. 🟠 `Unable to Link Wallet Yet` copy

A CEX-only dialog whose copy says "linking a new **wallet**". It should say UID.

**Also:** if the CEX balance is under 10 USDT, the user is deadlocked — unable to withdraw and unable to link.

### 7-2. 🟠 `Unable to Link Wallet` title used twice

The same title covers two situations (a generic error, and "not a referral").

**Fix:** rename the referral dialog to `Not a TetherMax Referral`.

### 7-3. 🟠 Three versions of the Lighter Standard copy

| Location | String |
|---|---|
| `LK-4`, `LK-9` | `Upgrade to Plus or Premium on Lighter to earn cashback.` |
| `EC-LNK-21` | `Switch to Plus or Premium on your Lighter Portfolio page to earn cashback.` |
| `EC-DEX-5` | `Switch to Plus or Premium on Lighter to earn cashback.` |

There are also two state names (`Standard account, no cashback` / `Standard account -- no cashback`) and two buttons (`Upgrade on Lighter` / `Continue`).

**Fix:** check Lighter's own UI wording (Upgrade or Switch) and unify on one.

### 7-4. 🟡 Scope of `Wallet Already in Use`

`OWN-1` does not scope it to a DEX, while `LW-8` and `LW-22` say the same DEX.

**Fix:** unify on address + DEX.

### 7-5. 🟡 Mixed wallet-address formats

`2341...2332` and `0x884B...1a69` both appear. Saying "42 characters" assumes EVM and breaks if another chain is added.

**Fix:** unify on `0x` plus EIP-55 checksum.

---

## 8. Non-member lookup

### 8-1. 🟠 Total Claimed shown

Shown for every DEX, but EdgeX does not provide the value. See 1-2.

### 8-2. 🟠 Milestone bar

Shown to non-members, but DEX has no minimum.

> ⚠️ V1 premise. Under V2 the DEX minimum is 10 USDT, the same as CEX.

### 8-3. 🟡 Lighter / Aster states

How Lighter's Accruing and Aster's expiry appear on the non-member screen is undefined.

### 8-4. 🟡 "Checking another DEX" dialog

No dedicated design; it follows Lighter's, but the button order is reversed. The copy says "check back in a few minutes" while the trigger includes **manual confirmation**, which may take far longer.

### 8-5. 🟡 Mobile screen not designed

The S2 mobile design is pending; S4 is reused until then.

---

## 9. Cashback Summary / Ranking / Partner Hub

### 9-1. 🟠 No ranking reward rule

`RK-1` and `LST-22` put CEX UIDs and DEX wallets in one ranking, but **there is no reward rule for the ranks.**

The existing cashback ranking pays 10/20/50/100 USDT by rank **as event rewards.** A DEX user has no way to receive them.

### 🔴 9-1-1. A-11 was **reversed** in V2 (checked 2026-10-22)

| When | Conclusion |
|---|---|
| ~~A-11 (2026-10-21)~~ | ~~Exclude DEX wallets from the ranking entirely~~ |
| **V2 (settled)** | **DEX is in the ranking.** `RK-1` and `LST-22` **are not reverted — the original design was right** |

**A-11's only ground has gone.** It rested on *"DEX users have no way to receive a rank prize"*; under V2 TetherMax pays on-chain from Wallet B, so **there is a way.**

| # | Action | Owner |
|---|---|---|
| 1 | `RK-1` · `LST-22` — **leave them.** No revert work | Development |
| 2 | **Label DEX rows separately** so the figure is not read as an exchange payout | Design |
| 3 | Rank-prize payout — **on-chain from Wallet B**, split from the CEX path | Development |

> **This is the only item that flipped and then flipped back.** Section 9-1 was frozen at the A-11 moment and read as *"drop DEX from the ranking"*.

My original proposal — show them but pay nothing, or state that only CEX is eligible — **was not adopted.** The cut was made more simply.

~~**Designs to roll back:** `RK-1`, `LST-22`.~~ **Neither is rolled back** — see 9-1-1.
**`RK-2` (the home `Linked Accounts` card) is unrelated to ranking and keeps DEX.**

> ✅ Resolved — see 9-1-1 above. A-11 is reversed and DEX stays in the ranking.

### 9-2. 🟡 Cashback Type filter name

`CS-1` proposes renaming `Trading Cashback` to `Exchange Cashback`. Decide together with 1-6.

### 9-3. 🟡 Partner Hub metrics can mislead

DEX rows are shown with a caption explaining there are no invite rewards. **A partner could read it as "I earn on my sub-accounts' DEX cashback"**, so the distinction needs strengthening.

### 9-4. 🟡 Arithmetic error in the IF-5 badge example

Written as "1 + 10 + 10 = 31", but that sums to 21. With four exchanges it is presumably "1+10+10+10".

### 9-5. 🔴 Invite friends — DEX handling (live screen, A-19)

**Screen:** `Point > Invite friends > Invite rewards`

| Area | Action | Owner |
|---|---|---|
| **`Exchange UID registration status` list** | **Add DEX rows.** Exchange name, UID count and cumulative invite reward all display as they do for CEX | Dev |
| **Count badge** (currently `18`) | **Count DEX in.** Otherwise the badge and the list disagree | Dev |
| **DEX rows in the `Cumulative invite reward` column** | **Show the real amount.** Not `-` and not a fixed `0` | Dev |
| 🔴 **Payout UID picker** (`Select a UID to withdraw referral rewards`) | **Do not render DEX rows.** ⚠️ **Not disabled and greyed — absent entirely** | Dev + Design |

#### Why absent rather than disabled

| Treatment | What the user reads |
|---|---|
| Disabled (grey) | "I cannot pick it now, but **I could if I met some condition**" |
| **Absent (adopted)** | "This destination **does not exist**" |

A DEX wallet can never become a payout account, no matter what the user does. Leaving it disabled produces **"why not, what do I have to do"** support tickets.

#### ⚠️ A new state that needs design — zero options

**A member who has only linked DEX wallets** opens the payout modal and finds **nothing to choose.** No design exists for this.

An empty modal reads as a bug. It needs **"to withdraw, link an exchange UID" plus a link.** (B-2-9)

DEX has no KYC, so entry is easy and **this state will genuinely occur.**

#### 🟠 Check alongside — `0 USDT` vs `-`

CEX rows already show `0 USDT`. Since DEX rows will show an amount there is no conflict, but **nothing anywhere distinguishes "zero so far" from "not applicable".**

> ⚠️ The payout-picker instruction above is V1. Under V2 (A-2) invite rewards apply to DEX and **DEX wallets do appear in the picker** — see 16-3.

### 9-6. 🟠 Partner Hub — DEX handling (live screen, A-20)

**Screen:** `Partner Hub` (dashboard / sub-accounts)

| # | Area | Action |
|---|---|---|
| 1 | Dashboard `Withdraw` modal (`Confirm Withdrawal?`) | **No work.** The payout exchange and UID are fixed by admin, so A-01 already blocks it |
| 2 | Dashboard `Exchange UIDs` list | **Add DEX rows.** The badge (`10`) and `198 Total` count DEX in |
| 3 | `Sub-accounts` > member-ID modal (`Linked UIDs`) | **Add DEX UIDs.** The `1 UIDs` count includes them |

Item 1 rests on the line at the bottom of the modal:

> `To change the withdrawal exchange or UID for invitation rewards, please contact support.`

**The user cannot choose the payout exchange or UID.** Whatever was set in the admin partner registration is used, and DEX was already excluded there. **Whether that exclusion is actually implemented still needs checking.**

### 9-7. 🟠 Partner Hub minimum withdrawal is both 10 and 50

| Location | Value |
|---|---|
| Korean dashboard warning | `Minimum withdrawal 10 USDT` |
| English `Terms & Conditions` | `Invite Rewards can only be withdrawn when the amount is **50 USDT** or more.` |

**Two values inside one feature.** Confirm whether the partner invite-reward minimum genuinely differs from the 10 USDT cashback minimum, or whether one of them is stale. (`D-21`)

Not DEX-specific, but **worth fixing while the same screen is open.**

---

## 10. Benefits / quiz

### 10-1. 🟠 The amount at the top of Benefits is permanently zero

The top of the Benefits page shows members their **total event rewards.** A DEX-only user sees **0 USDT permanently**, making it identical to the non-member view.

**Reference:** there is precedent for removing the amount area entirely for non-members. The same pattern can be applied.

> ⚠️ V1 premise. Under V2 (A-1) a DEX-only member does earn event rewards, so this will not be permanently zero.

### 10-2. 🟠 Quiz reward display

The two DEX learning modules carry no reward (`LE-9`, `LE-10`), yet `LE-1` requires them to be "structurally identical" to the existing cards. **If the existing three modules show a reward, users will expect one.**

`LE-11` being a gap in the numbering also looks like a deleted reward row.

**Fix:** hide the reward area on DEX cards and omit reward copy from the result screen.

### 10-3. 🟠 Block DEX when assigning a quiz exchange

Existing quizzes allow participation and coupon receipt **without an exchange account**, but **using** the coupon requires the assigned exchange's UID, and the outcome is an event reward. **If a DEX is set as the assigned exchange, there is nothing to spend the coupon on.**

Worse, the `Exchange` field **cannot be edited after registration**, so it cannot be undone.

**Fix:** block DEX in the backoffice quiz exchange selector.

### 10-4. 🟡 No quiz content

Body text, questions, options and explanations are absent from the PRD. **Only the answer keys exist** ("module 4: Q1 is 2, Q2 is 3"). Content production needs to be split out as separate work.

### 10-5. 🟡 Quiz completion criteria undefined

Whether submitting is enough or 2/2 is required, whether retries are allowed, and the button state after completion are all undefined.

### 10-6. 🟡 The 3 USDT coupon badge

A 3 USDT badge sits next to "Link your wallet with us" in the S3 home checklist. **A member who has only linked a DEX wallet cannot receive this coupon** (the existing rule requires at least one completed UID link). It also cuts against `RT-4`'s "do not promise rewards in the DEX panel".

**Confirmed (A-14): keep the badge and add an explanatory line.** The coupon **can be received but cannot be used on DEX.** State **"usable once a CEX UID is linked"** in the coupon wallet. The review-reward coupon (A-17) works the same way.

> ⚠️ Superseded by 16-10. As of 2026-10-22, **linking a DEX wallet does not complete this mission and no coupon is issued at all.**

---

## 11. Backoffice

### 11-1. 🔴 Spending Estimate decimal-limit bug

`SPE-6` allows three decimal places for a rate, but the example in the same document, `SPE-7`, is 0.05% = **0.0005** — four places. Lighter's rate table allows four.

**As specified, the documented example cannot be entered.**

**Fix:** allow four decimal places.

### 11-2. 🟠 No Aster section

Lighter (`EXT-18`), ApeX (`EXT-19`) and EdgeX (`EXT-20`) each have a dedicated section. **Aster has none.** There is no screen for managing the 365-day binding, usdtValue or webhook settings.

### 11-3. 🟠 No screen for wallet limits

The front end specifies "3 × the number of active DEXs, counted in total", but the backoffice has **no place to set it, no per-member usage view and no exception handling.**

### 11-4. 🟠 No preview or draft

This is bulk multilingual authoring, yet **saving publishes.** Only the banner has a preview. Each DEX takes roughly 100 operator-entered fields plus 26 media assets.

### 11-5. 🟡 `EDC-14` heading error

The heading reads "Min & Max **Fees**" but the fields are Volume.

### 11-6. 🟡 Line 2 length limits — **the landing 10 is fine; only the detail 4 remains**

Landing allows 10 characters, the detail Right Box allows 4.

**Checked against Figma: 10 is appropriate for the landing.** The design is a three-part structure — `Up to` / `20%` / `trading fees rebate` — and **Line 2 holds the rate, e.g. `20%`** (see 13-13). My original note said "same headline, different limits", but **they are not the same headline.**

**What remains is the detail Right Box's 4 characters.** We need to know what goes in that field.

### 11-7. 🟡 Mixed save models

The DEX list and broker list save the instant the mouse is released; Edit Display Priority uses Edit/Save/Cancel. Instant save may also conflict with the keyboard alternative (`NFR-8`).

### 11-8. 🟡 `Execution Modal` typo

A label in the broker comparison editor. The document itself instructs that it be corrected to `Execution Model`.

---

## 12. Deferred to the second deadline

Items for "reviewing policy gaps in the Figma DEX Listings" at the second deadline (Thursday 17:00).

| Item | Why |
|---|---|
| Status chip master list (1-3) | Needs a full screen sweep first to be accurate |
| Unfinished Figma areas | EdgeX card, Lighter/ApeX settlement states, non-member withdrawal, S2 mobile, Aster notifications |
| Proposed-state screens | Estimate unavailable, DEX card error, Adjustment, DEX data pending, Inactive row, ownership delay notice — no Figma links exist at all |
| ~~Full element-by-element screen mapping~~ | **Done.** Cashback Hub and DEX overview are reflected in [11_백오피스관리_vs_하드코딩.md](../../DEX/11_백오피스관리_vs_하드코딩.md). See Chapter 13 |

---

## 13. New findings from comparing the actual Figma designs (2026-10-20)

**Twelve new items** found by comparing Cashback Hub `27267:346729` and DEX overview `27267:347023` element by element.
Chapters 1–12 were written against the requirements documents; this chapter covers **what is only visible in the design file itself.**

### 13-1. 🔴 Not one DEX row in the comparison table

- **Where** Cashback Hub partner comparison table
- **What** The filter chips offer `All / Exchanges / DEXs / Brokers`, but all 16 rows in the table are **CEX**. Nothing is designed to show when `DEXs` is selected.
- **Values that still need defining**

| Column | For DEX |
|---|---|
| `Cashback` | available |
| `Final Taker` / `Final Maker` | available, though Lighter Standard is 0% |
| `Monthly cashback` | computable |
| `Rating` | possible, since DEX reviews are allowed (A-17). Initially no reviews exist, so `rating not applicable` |

- **Owner** Design (John) + policy

### 13-2. 🔴 The logo grid and the comparison table list different exchanges

Within one page, the CEX lists **differ by six entries each way.**

| Only in the logo grid | Only in the comparison table |
|---|---|
| WOO X Pro, Bitmart, HTX, CoinCatch, Toobit, Flipster | BitMEX, BlockFin, Zoomex, Bitunix, BioFin, BVOX |

Common to both (10): Binance, OKX, Bitget, Bybit, Gate, MEXC, BingX, DeepCoin, KuCoin, LBank

- **Action** Both must be **generated from the published exchange records** (`NFR 11`). Drawn separately as they are now, they will diverge permanently.
- **Owner** Dev + Design

### 13-3. 🔴 `Event and invite rewards` has three different DEX values

| Source | DEX value |
|---|---|
| PRD `DX-12` | `None for DEX trading` |
| **Actual design** | **`Quiz rewards only, claimed to an exchange...`** |
| ~~Our decision A-09~~ | ~~Event rewards excluded entirely~~ → 🔴 **superseded by A-1. DEX does earn event rewards** |
| Our decisions A-14 / A-17 | Mission and review **triggers** count on DEX; **receiving** the reward requires a CEX UID |

The design copy is closest to our decision. However, **the DEX quiz modules carry no reward** (`LE-9`, `LE-10`), so whether `Quiz rewards only` holds needs checking.
This is **the single line** from which a user understands DEX reward policy, so it must be rewritten once settled.

- **Owner** Policy → documents (Hayley) → design (John)

> ⚠️ A-09 is superseded. Under V2 (A-1) DEX does earn event rewards, so this line needs rewriting against V2, not against A-09.

### 13-4. 🟠 The calculator footnote is hidden

The `footnote` layer is `hidden="true"`. `CH-4` requires a footnote.

### 13-5. 🟠 Computed values and rates are baked into the calculator as text

| Element | Now | Should be |
|---|---|---|
| Cashback label | `Cashback, 20%` | `Cashback, {rate}%` |
| Fee description | `Lighter Premium taker, 0.0280%` | partner, tier and rate as variables |
| Daily | `Per day $0.19` | `Per day {value}` |
| Yearly | `Per year $67.20` | `Per year {value}` |

A concrete instance of 1-5. The source is the backoffice Spending Estimate.

### 13-6. 🟠 The partner count is baked into the table heading

`Compare cashback across 23 partners` → `across {n} partners`. `NFR 11` explicitly says not to write the number into the markup.
**Same root cause as 2-1.** Logo grid 16 / comparison table 16 / heading 23 / PRD 17 — four different numbers.

### 13-7. 🟠 DEX order differs twice within the same page

| Location | Order |
|---|---|
| Partner DEXs at a glance | Lighter, **Aster**, EdgeX, **ApeX** |
| Venue cards 2×2 | Lighter, **ApeX**, EdgeX, **Aster** |

Confirms that 3-2 **reproduces inside the design file as well.** Both places must read one `Edit Display Priority` setting.

### 13-8. 🟠 All four "at a glance" cards are dummies

All four read `20%` · `$1.485B` · `$1.12B`, and **the name layer says `Lighter` on all four.** The component overrides were never applied.

### 13-9. 🟠 The "at a glance" subline does not match the metrics shown

| | |
|---|---|
| PRD | `TVL and 24H volume from DefiLlama, as of {date}` |
| Design | `Volume and open interest on our partner ...` |

The cards actually show TVL and 24H volume. **Open interest appears nowhere.**

### 13-10. 🟠 The minimum withdrawal is baked into copy in two places

- Route selection, CEX row: `Paid daily, withdraw from 10 USDT`
- Comparison section, `Where you withdraw`, exchange column: `On TetherMax, from 10 USDT`

If the matching-withdrawal policy changes, both have to be edited by hand. They should be variables fed from the server.

### 13-11. 🟡 Three unfinished assets

| Item | Now |
|---|---|
| Hub hero background | `wave bg (John placeholder; live: ripple shader)` |
| Broker logos | INFINOX plus **one empty circle** (RS Finance not produced) |
| DEX learning block 3D icons | Tiles 1, 3 and 4 have the 3D `hidden`, substituted with `magnific_*` images |

Adds to 4-11.

### 13-12. 🟡 Four undefined items

| Item | Detail |
|---|---|
| `Rating` data source | Only 3 of 16 rows have a value (`4.2 (23)`, `4.6 (41)`, `3.9 (27)`); the other 13 are `rating not applicable` |
| `Final Taker` / `Final Maker` | Every row is placeholder text |
| `tag / highest payout` | Attached to Bitunix (85%). Selection criteria undefined |
| `Live Campaigns` column | A hidden column exists. Purpose unknown |

The concrete list behind 2-6.

### 13-13. ✅ Checked — no change needed

| Item | Detail |
|---|---|
| `H8 EdgeX wallet linked` | A **state frame exists** in the Hub. `LK-10`'s "not designed in Figma" does not apply to the Hub (5-2 is about the home selected-account card and needs separate checking) |
| `ELC-4` Line 2 10-character limit | The design is a three-part structure — `Up to` / `20%` / `trading fees rebate`. **10 characters is right for a rate like `20%`.** Only the detail-page Right Box 4-character issue remains in 11-6 |
| Learn and Earn band | No copy promising a reward. Consistent with the unrewarded DEX quiz |
| Route selection `UP TO` rate | The design uses a `rate value` variable. **Better than the PRD body's hardcoded 90/30/84%** |

---

## 14. Making the live CEX screens accept DEX (2026-10-20 instruction, six live screens)

Six existing CEX-only screens need DEX added. **In every case the problem is that DEX is simply absent from the screen.** How to distinguish them was **settled on 2026-10-22** (14-1); one item conflicts with an earlier decision.

| # | Screen | Severity | Split or merge |
|---|---|---|---|
| 14-1 | Exchange UID link modal | 🔴 | **✅ Distinguish** — one control, groups inside |
| 14-2 | Non-member exchange picker | 🔴 | **✅ Distinguish** (same as 14-1) |
| 14-3 | Non-member home — live withdrawal feed | 🟠 | n/a |
| 14-4 | Withdraw modal | 🔴 | **✅ Merge** — no tabs |
| 14-5 | Cashback summary (history) | 🔴 | n/a |
| 14-6 | Event list | 🟠 | **conflicts with an earlier decision** |

---

### 14-1. 🔴 Exchange UID link modal — DEX must be added

**Screen:** `Link exchange UID` modal → exchange picker (member)

| Element | Current value |
|---|---|
| Modal title | `Link exchange UID` |
| Search | `Search exchanges` |
| `Popular partners` | WOO X Pro / Bitget / Binance / Bybit / Flipster (5 tiles) |
| Full list | OKX … (scrolls) |
| Filter | **none** |
| Button | `Next` (disabled until a selection is made) |
| Footer | `Don't have an account yet? Sign up here` |

#### 🔴 Action 1 — put the four DEXs in the list

With no DEX in this modal, **linking cannot be started at all.**

#### ✅ Settled — how CEX and DEX are distinguished (2026-10-22)

**Option (b), filter chips inside a single control.** The description in doc 05 §2-2 turns out to have been right, and it is now settled rather than proposed.

| Option | Verdict |
|---|---|
| (a) One flat list, badge only | ❌ the distinction is not visible in the UI |
| **(b) One control with internal grouping** | ✅ **settled** |
| (c) Separate tabs | ❌ that makes it two controls |

**The product-wide rule (settled 2026-10-22)**

| Mode | Where it applies | Pattern |
|---|---|---|
| **Merged** | **Withdrawal only** | No tabs, no groups. One list in priority order, withdrawn in one request |
| **Distinguished** | **Everywhere else** | **One** exchange control, with CEX and DEX grouped **inside** it |

> Why withdrawal is the exception — **partial withdrawal is structurally impossible** at TetherMax. One request takes the full eligible amount across every account, so there is nothing to separate. In commerce terms: **checkout does not separate tops from bottoms, but a results filter does.**

> ⚠️ Never make it two controls. There is one `Exchange ▾` button, and opening it reveals `CEX` and `DEX` group headers inside.

### Badge rule — **settled** (2026-10-22)

**No `CEX` badge is added.** Badges come off wherever something else already does the job.

| Situation | Badge | What distinguishes instead |
|---|---|---|
| **The identifier is visible** — withdrawal list, history, pickers | **none** | `UID 1432873105` vs `Wallet 0x7a3F…c51E9` — not mistakable |
| **The list is grouped** — filter dropdowns, link modal | **none** | the header already says `CEX` / `DEX` |
| **Neither — just a name** — guest link list, exchange detail | **`DEX` badge** | there is nothing else |

> **Nothing in the existing 17 exchange rows has to change.** The DEX project creates no work for the CEX side.

**Applied in the prototype** — 16 badges removed (withdrawal list, rule page, pickers, link modal, league); **4 kept** (guest link list ×3, exchange detail ×1).
---

### 14-2. 🔴 Non-member exchange picker — DEX must be added (same as 14-1)

**Screen:** non-member home `Get cashback without signing up` → `Choose an exchange` modal

| Element | Current value |
|---|---|
| Title | `Choose an exchange` |
| Search | `Search exchanges` |
| `Popular exchanges` | WOO X Pro / Bitget / Bybit / Flipster |
| `All exchanges (8)` | OKX / DeepCoin / Gate / LBank / BlockFin / Bitunix / HTX / Toobit |

#### 🔴 Action 1 — add the four DEXs, using exactly the 14-1 pattern

If the two modals follow different rules the user is confused. **Apply the 14-1 decision as-is.**

#### 🟠 Action 2 — `All exchanges (8)` is hardcoded

Adding four DEXs makes it `(12)`. Per `NFR 11` — compute the partner count from published records, never write it into the markup — this must become **record-generated.** Same root cause as 2-9 Action 3.

#### 🔴 Action 3 — non-member DEX lookup takes a different input

Non-member CEX lookup takes a UID; **DEX takes a wallet address.** The screen has to branch immediately after selection. Handle alongside Chapter 8.

---

### 14-3. 🟠 Live withdrawal feed — three of five columns do not hold for DEX

**Screen:** non-member home, `Someone is getting cashback right now`
**Current columns:** `UID` / `Exchange` / `Cashback` / `Withdrawal time` / `Status`

DEX entries belong in this feed, and **three of the five columns mean something different.**

| Column | CEX | DEX | Action |
|---|---|---|---|
| **`UID`** | masked exchange UID (`*****6974`) | **no UID.** Only a wallet address | 🔴 Neutral header (`UID / Wallet` or `Account`). Mask wallets as `0x7a3F…51e9` |
| `Exchange` | logo | same | — |
| `Cashback` | amount | same (converted to USDT) | — |
| `Withdrawal time` | when TetherMax sent it | **same.** In V2 TetherMax sends on-chain directly | ✅ Resolved in V2 — no action |
| `Status = complete` | TetherMax withdrawal complete | **same.** But DEX is on-chain, so **more failure modes exist** | 🟠 Decide whether a state is needed beyond complete/failed to carry on-chain failure reasons (gas, nonce, RPC timeout, underfunded, congestion) |

> The section title `Someone is getting cashback right now` and the subtitle `Claim every bit of the cashback you've built up` **fit DEX even better** (DEX pays automatically, so people really are receiving it). No title change needed.

**Data availability to confirm:** Lighter settles weekly by CSV, so rows appear **only on Mondays.** The design has to reflect that real-time-ness differs per DEX (Lighter weekly / EdgeX and Aster daily / ApeX hourly).

---

### 14-4. 🔴 Withdraw modal — DEX must be added

**Screen:** `Withdraw` modal (member)

| Element | Current value |
|---|---|
| Header | `Withdrawable cashback` `0.00 USDT` |
| UID card | exchange logo + name + `UID 99925851` + `Not available` chip |
| Card warning | `You can withdraw once you earn 5.00 USDT more in exchange cashback` |
| Card breakdown | `Exchange cashback` 0.00 / `Event reward` 5.00 |
| Footer warning | `There is no UID available for withdrawal` |
| Button | `Withdraw` (disabled) |

**Existing policy:** request the **full withdrawable amount across every eligible UID at once** (no partial withdrawal).

#### ✅ Settled — no tabs (2026-10-22)

Every linked account is listed **in one list in priority order** and withdrawn in one request. Details are in **Chapter 6.**

#### ✅ The four things V1 said would break if merged — all resolved

All four rested on the V1 premise that **DEX money never passes through TetherMax.** That premise reversed in V2, and **all four now hold.**

| # | V1 concern | **V2 outcome** |
|---|---|---|
| 1 | The `Withdrawable cashback` total — DEX amounts are "already received", so they must not be summed | **Summing is correct.** DEX money is a TetherMax balance too. Confirmed live — `10.00 + 31.68 = 41.68`, counting only eligible accounts |
| 2 | The `Event reward` row — DEX never earns them (A-09) | **The row is required.** A-1 makes DEX eligible for event rewards |
| 3 | `You can withdraw once you earn N USDT more…` — DEX has no minimum, so the line would be false | **It is true.** DEX also has the 10 USDT minimum and the same `A + MIN(B,A)` calculation |
| 4 | `There is no UID available for withdrawal` — a DEX-only member sees it forever | **It is transient.** It clears once cashback accrues. But **this state is more common on DEX** — see 6-4 |

#### ✅ Resolved — the `Withdraw` button works for DEX unchanged (V2, 2026-10-22)

~~In V1, DEX had no withdrawal request at all — each card opened `Go to {DEX}` individually, so they could not be grouped under one button.~~ **That premise reversed in V2.**

```
V1  CEX [Withdraw] ──▶ one batch request  /  DEX [Go to EdgeX] … ──▶ N new tabs
V2  [Withdraw] ──▶ one batch request across every eligible account, CEX and DEX alike
```

> Confirmed against live screens — no tabs, one list in priority order, one button. See Chapter 6.

#### Note — why the split option was dropped

V1 held that merging would break the definition of the `Withdrawable cashback` figure at the top, because **"money TetherMax owes you" and "money the DEX already gave you" were different things.**

In V2 **they are the same thing.** The reason to split disappeared, and splitting would break the existing one-request policy.

**Related:** Chapter 6 (withdrawal modal, rewritten for V2), 1-1 (`Available Cashback` naming), 1-2 (removing Total Claimed), [03 B-1-4·B-6-7](../../DEX/03_정책_결정_기록.md)

---

### 14-5. 🔴 Cashback summary — DEX must be added; two type filters do not hold

**Screen:** `Cashback summary` — three filters on the left + a monthly calendar + a list for the selected day

| Element | Current value |
|---|---|
| Filter 1 | `All exchanges` → `WOO X Pro (1 UID)` |
| Filter 2 | `All UIDs` |
| Filter 3 | `All cashback types` → `Cashback` / `Event reward` / `Withdrawal amount` (multi-select checkboxes) |
| Buttons | `Reset` / `Search` |
| Calendar | monthly, with a daily total under each date (`+5.00`) |
| List | `Coupon used` + exchange name + UID + `+5 USDT` |

#### 🔴 Action 1 — put DEX in the exchange filter and the history list

DEX entries currently **cannot be looked up at all.** The dropdown form `WOO X Pro (1 UID)` does not hold for DEX — there is no UID, so a neutral form such as `(1 wallet)` is needed. Same root cause as the `UID` column in 14-3.

#### 🔴 Action 2 — which type filters hold for DEX

| Type | V1 | **V2** | Note |
|---|---|---|---|
| `Cashback` | ✅ exists (different meaning) | **✅ exists, same meaning** | a TetherMax balance |
| `Event reward` | ❌ excluded entirely by A-09 | **✅ exists** | A-1 — DEX earns event rewards |
| `Withdrawal amount` | ❌ no TetherMax withdrawal | **✅ exists** | TetherMax withdraws on-chain directly |

→ **All three types are valid for DEX.** There is no longer any reason to hide or disable the filter. `B-7-20` is resolved.

#### 🟠 Action 3 — the daily calendar total mixes meanings

The `+5.00` under a calendar date means, for CEX, **"how much the TetherMax balance grew that day."** Adding DEX amounts mixes in **"what the DEX put into my account."** Same root cause as 1-1 and 5-1.

> ⚠️ V1 premise. In V2 both are increases to the TetherMax balance, so the meanings no longer mix.

#### ⚠️ To confirm 1 — the date boundary splits between UTC and KST

DEX records are on a **UTC day boundary** (EdgeX 00:00 UTC, Aster published 09:00 UTC). If the calendar is KST, **entries land on the wrong day.** Decide together with 1-8 and [03 B-6-4](../../DEX/03_정책_결정_기록.md).

#### ⚠️ To confirm 2 — Lighter only ever marks Mondays

Weekly settlement means **only four or five cells per month carry an amount** and the rest are blank. Users may read that as "nothing accrued", so weekly-settlement DEXs need a marker.

---

### 14-6. 🟠 Event list — show DEX. **But "TetherMax-only" conflicts with an earlier decision**

**Screen:** event list — two tabs, `TetherMax events` (with type) / `Exchange events` (exchange type), each with a multi-select exchange dropdown and `Apply`

#### ✅ `Exchange events` (exchange type) — consistent with the earlier decision

[08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) §11-1 already settled that **exchange events are available to DEX** (they are outbound-link announcements that TetherMax does not pay for). Registering one in admin should surface it on this tab.

#### 🔴 `TetherMax events` (with type) — **direct conflict**

| Source | Content |
|---|---|
| **Doc 08 §11-1** | **TetherMax-only events are unavailable to DEX.** "The reward is an event reward, and DEX users have no way to receive one" → decided to **block registration** in admin |
| **A-09** | Event rewards excluded from DEX entirely — accrual, payout, claw-back and picker lists |
| **Instruction (2026-10-20)** | A DEX event registered in admin must appear on this tab |

**We decided to block registration and are now asked to display it.** One of the two has to change → [03 B-7-21](../../DEX/03_정책_결정_기록.md)

**Options**

| Option | Content |
|---|---|
| (a) Keep doc 08 | Registration is impossible, so nothing surfaces. No work on this tab |
| (b) **Allow only unrewarded events** | Announcement and promotional events that pay no event reward may be registered for DEX. Leaves A-09 untouched |
| (c) Relax A-09 | Pay event rewards on DEX too. **B-2-9 — a DEX-only user cannot withdraw — recurs exactly** |

**Choosing (c) creates a state where the reward is paid but cannot be withdrawn.** Event rewards accrue to the TetherMax balance, and DEX does not appear in the payout UID picker (A-09, A-12). The user watches it accumulate and can never take it out.

> ✅ **Resolved 2026-10-22.** Option (c) was taken, and the objection no longer applies: under V2 a DEX-only member **can** withdraw, so there is no "accrues but cannot be taken out" state. Both tabs are open to DEX and nothing needs blocking in admin.

#### 🟡 To confirm — the exchange filter looks auto-generated

The `TetherMax events` tab filter currently shows **only OKX and HTX.** That suggests it lists only exchanges with a registered event, in which case registering a DEX event adds it **with no extra work.** Confirm it is not hardcoded (same question as 14-2 Action 2).

> **Out of scope, noted here:** event card titles render raw HTML — `1<br>2`, `OKX<br> with 2`. This looks like an escaping bug. It is pre-existing and unrelated to DEX, so it is only recorded here. The `test` exchange rows are already covered in [03 B-7-12](../../DEX/03_정책_결정_기록.md).

---

## 15. Ownership of the fixes

| Owner | Items | Main content |
|---|---|---|
| **Design (John)** | ~24 | Redesign the calculator diagram, status chips, undesigned areas, **new DEX rows in the comparison table**, replace dummy values, unfinished assets |
| **Documents (Hayley)** | ~26 | Copy fixes, terminology, numeric inconsistencies, ordering, **turning minimums, rates and partner counts into variables** |
| **Dev** | ~11 | SPE decimals, removing hardcoded rates, **generating the exchange list**, validation logic |
| **Needs a policy decision first** | ~14 | 3 USDT coupon, ranking rewards, wallet limits, `Available` naming, **the `Event and invite rewards` line** — see [03_정책_결정_기록.md](../../DEX/03_정책_결정_기록.md) |

The owner totals (24+26+11+14 = 75) fall short of 92 because **some items have no owner assigned yet.** Some items span two owners and are counted twice.

**The full list of hardcoded items that need moving into the backoffice is in [11_백오피스관리_vs_하드코딩.md](../../DEX/11_백오피스관리_vs_하드코딩.md) §5-1.**

---

# 16. Added 2026-10-21 — from the existing-PRD analysis and the settled decisions

Having analysed the six existing PRDs (MAX-8/10/18/30/431/466) and the Maxboard PRD and closed the policy questions,
**nine screen changes were added and one was reversed.**

Source decisions: `../6_기존PRD_분석/확정_결정_기록_20261021.md`.

| | 🔴 | 🟠 | 🟡 | Total |
|---|---:|---:|---:|---:|
| Ch. 16 (new from PRD analysis, 10-21) | 4 | 4 | 1 | **9** |
| Ch. 16 (from settled policy, 10-22) | 2 | 0 | 0 | **2** |
| **Ch. 16 total** | **6** | **4** | **1** | **11** |

**92 → 103 items.**

---

### 🔴 16-1. The payout formula was wrong — `A + MIN(B, A)`

**Applies to:** withdrawal modal (DW1) · non-member wallet detail · cashback summary

The formula I previously recorded from Figma was **wrong.**

```
(old) Available Cashback = Exchange Cashback + Event Reward     ← wrong
(new) Available Cashback = A + MIN(B, A)                        ← corrected
         A = cashback · B = event reward
```

It looked like a plain sum on screen **because the sample data happened to have B ≤ A.**

**Actions**
1. Add an `Event Reward` row to the withdrawal modal card (today it only has `Exchange Cashback`)
2. Reflect that `Available Cashback` is **not a plain sum**
3. State that the `Inactive` badge triggers at `A + MIN(B,A) < 10 USDT`

**New user-facing copy needed**

> **If DEX cashback is zero, the event reward cannot be withdrawn either.**
> (MAX-18 table #4: `A=0, B=50 → payout 0`)
> We decided to pay event rewards on DEX (decision A-1), but this constraint still applies.
> **Say explicitly that you have to trade on the DEX before the event reward can be taken out.**

---

### 🔴 16-2. The designer's assumption #5 is wrong

**Applies to:** the note on the DEX canvas section `DEX withdraw on TetherMax · first pass (2026-10-21)`

While drawing the V2 withdrawal flow (DW0–DW6) on 2026-10-21, the designer attached this assumption:

> *"Assumptions to confirm: … 5) **No Event Reward row for DEXs.**"*

**That assumption is V1 and does not match current policy.** Event rewards returned in the 2026-10-20 decision, and decision A-1 on 2026-10-21 confirmed that **DEX earns them too.**

**Action:** ask the designer to correct the note, and add an `Event Reward` row to the DW1 card.

---

### 🔴 16-3. Delete four "DEX excluded" strings about invite rewards

**Decision A-2:** invite rewards can be withdrawn on DEX, **treated identically to a CEX UID.**

The design currently states the opposite in **four places.**

| # | Location | Current string | Action |
|---|---|---|---|
| 1 | Partner Hub Linked Accounts note | *"**DEX wallets earn you no Invite Rewards.**"* | **Delete** |
| 2 | Partner Hub T&C | *"Invite Rewards are only earned on **centralised exchange** cashback. Sub-accounts trading on DEXs do not generate Invite Rewards."* | **Delete** |
| 3 | Invite-friends T&C | *"Trading on decentralised exchanges (DEXs) such as Lighter, ApeX, EdgeX and Aster **does not earn Invitation Rewards**, even if your friend signed up with your invitation code."* | **Delete** |
| 4 | Invite-reward payout modal | *"Invitation Rewards are paid in USDT and can only be withdrawn to a **linked centralised exchange UID**."* | **Delete** |

**Item 4 is a behaviour change, not just copy.**

```
Now     Select a UID to withdraw referral rewards
          ⬤ Bybit   UID 123456789
          ⬤ Bitget  UID 936582739     ← CEX UIDs only
          ⬤ KuCoin  UID 123456789

Change  ⬤ Bybit    UID 123456789
        ⬤ Bitget   UID 936582739
        ⬤ Lighter  0x7a3F…c51E9  [DEX]   ← DEX wallets added
        ⬤ ApeX     0x91c4…a07b  [DEX]
```

The `Exchange UID Registration Status` table's note — *"Only centralised exchange UIDs earn Invitation Rewards"* — must go, and **DEX rows must be added** to the cumulative reward table.

**Note — the sub-of-sub exclusion is unchanged.** The invite-reward sub-exclusion is TetherMax's own **internal rule** and is separate from the "sub-of-sub exclusion" on trading commission. **DEX follows it exactly as before.**

> ⚠️ The payout amount depends on an input nobody has set: `invite reward = downline withdrawal × exchange margin rate × reward ratio`, and **the DEX margin rate is blank.** Set it to 0 and every DEX row reads 0.00 forever. See the 2026-10-22 entry in the decision log.

---

### 🔴 16-4. There are no post-expiry Aster screens — they must be built

**Applies to:** home Linked Accounts · wallet detail

Current state:

```
D-30   [Expires in 30 days] orange badge + orange dot   → designed
D-0    expired                                          → ★ no screen
D+1~   prompt to re-link                                → ★ no screen
```

**Decision H-1:** there is no automatic renewal. Show *"the connection has lapsed, please reconnect"* and a **re-link CTA.**

**Three screens needed**
1. Home Linked Accounts — the state of an expired Aster wallet (grey dot + inline banner)
2. Wallet detail — expiry banner + `Re-link` CTA
3. Re-link flow — confirm whether the existing link flow can be reused

**Open:** whether commission still accrues after expiry has been **put to Aster** (API request doc §4-1, item 5).
(a) it accrues → "reconnect and you will receive what accrued in the meantime"
(b) it stops → "if you do not reconnect now, nothing accrues"
→ **the copy and the urgency of the CTA depend on the answer.**

---

### 🟠 16-5. The monthly ranking copy is wrong — it is not volume

**Applies to:** benefit detail `Monthly Top Trader Rewards` (Priority 19)

Current copy:
> *"Top traders each month earn exclusive rewards based on **trading activity**."*

**Decision K-1:** both the cashback ranking and the Global League are based entirely on **cashback earned**, not trading volume.

**Action:** replace `trading activity` with `cashback earned`.
The title's `Top Trader` also suggests volume and should be reconsidered.

> **Side effect:** this item had been classified in the V2 re-assessment as *"conditional, depends on `volume`"*. That **is now lifted.** Global League, cashback ranking and Maxboard are all promoted to **supported.**

---

### 🟠 16-6. Hub calculator copy — `Paid into your Lighter account`

**Applies to:** the cashback hub `CASHBACK ESTIMATE` panel (guest state)

```
Cashback, 20%                     −$5.60
Paid into your Lighter account              ← V1 copy
```

The signed-in state of the same screen (DW0) reads:

```
Paid to your TetherMax balance    Minimum 10 USDT
```

**The same position says two contradictory things before and after sign-in.**

**Action:** `Paid into your {DEX} account` → **`Paid to your TetherMax balance`**

> For reference, the `When your cashback comes from` section on the exchange detail page (D1) **already uses the V2 structure** — *"Lighter pays a settlement → TetherMax gives cashback"*. Only this one line in the Hub calculator is still V1.

---

### 🟠 16-7. Add a `Weekly` settlement-cycle badge

**Applies to:** the UID/wallet link success screen

The link success screen defined by MAX-30 shows a **settlement-cycle badge.**

```
┌ ⬤ Lighter   [Daily settlement] ┐      ← wrong; Lighter is weekly
│   Next settlement: Thu, Mar 19  │
│   Settlement time: 21:00 GMT+9  │
└─────────────────────────────────┘
```

| Exchange | Settlement cycle | Badge needed |
|---|---|---|
| **Lighter** | **weekly (Mon)** | **`Weekly` — does not exist today** |
| ApeX | hourly | Daily (if rolled up by agreement) |
| EdgeX | daily, 00:00 UTC | Daily |
| Aster | daily (published 09:00) | Daily |

**Action:** add `Weekly` to the badge set. Take the time from `update_time` (the admin `Updated (UTC)` field) and **convert to the viewer's local time.**

---

### 🟠 16-8. Show DEX event rewards in cashback history

**Applies to:** the cashback history calendar (CS1–CS6)

An earlier document recorded *"when a DEX is selected, event rewards must not be shown."*
**That was a V1 premise and decision A-1 reverses it.**

A **`CS3 Event reward day`** state is already designed on the DEX canvas.

```
Cashback history (calendar)
  Filters: All Exchanges ▾ / All Accounts ▾ / All Cashback Types ▾
  Date cell: +amount (blue) / −amount (red)
  Detail below:
    ⬤ BTC Prediction Reward      +50.00 USDT    ← event reward
       Bitget UID 1222787462
    ⬤ Cashback Challenge Reward  +50.00 USDT
```

**Actions**
1. **Show event rewards** in the `Cashback type` filter even when a DEX is selected
2. Add **DEX wallets** to the `All Accounts` dropdown
3. Display wallets as `Lighter 0x7a3F…c51E9` (a masked address where the UID goes)

---

### 🟡 16-9. Home screen — note the owner

**Applies to:** home Linked Accounts, Total Cashback Balance

MAX-431 states a **Landing Page Priority Rule.**

> *"Where any screen element in this PRD overlaps with content owned by the colleague responsible for the Landing Page (Home, UID linking screens, etc.), **the Landing Page design and PRD take precedence.**"*

**Decision I-3:** the home screen is designed by someone else.

**Action:** mark home-related items **"Andrew's plan takes precedence."**
The home-related findings in this document are **for reference**; implement only after syncing with the home owner.

---

### 🔴 16-10. UID-link coupon — excludes DEX (new, 2026-10-22)

**Applies to:** benefits list `LINK UID` (Priority 16) · benefit detail · coupon wallet

> **Linking a DEX wallet does not complete this mission, and no 3 USDT coupon is issued.**

Benefits and coupons are broadly open to DEX, and **this is the one exception.** Without a note, the user links a wallet, sees nothing happen, and **contacts support.**

| # | Action | Owner |
|---|---|---|
| 1 | Add a **`CEX only` badge** to the `LINK UID` row in the benefits list | Design |
| 2 | Add **"linking a DEX wallet does not complete this"** to the detail page | Design, Docs |
| 3 | **Add a CEX condition to the completion check** — a wallet link must not complete it | Dev |
| 4 | The current copy `exchange UID` reads as though any exchange qualifies — **rewrite** | Docs |
| 5 | Hide DEX wallets in the coupon-wallet account picker **for this coupon only** | Dev |

> MAX-466 OQ-2 (per-benefit completion criteria) is open as a dev blocker, and **the DEX part is defined by this.**

---

### 🔴 16-11. Ownership verification — unsupported on DEX (new, 2026-10-22)

**Applies to:** the `Wallet Already in Use` modal · home account list states · notifications

Raised to supported on 10-21, then **reversed by policy.**

**The most important part — remove the CTA from the modal**

```
CEX   [Try another UID]  [Verify ownership]        ← keep
DEX   [Try another wallet]  [Contact support]      ← remove the ownership CTA
```

If `FAILED_ALREADY_INTEGRATION` **raises an ownership CTA on a DEX wallet, it promises something that cannot be done.** The trailing part of the copy (*"you can claim ownership to get it back"*) must go too.

**What disappears as a consequence**

| Item | DEX |
|---|---|
| Claim pages O3–O10 (video upload, guide slides) | n/a |
| Review states O11–O16 | n/a |
| The three home account-list states: in review, failed, unlinked | n/a |
| 30-day cooldown · `FAILED_RECENT_POSSESSION` | n/a |
| Three ownership notifications | n/a *(the live sheet has **two**, not three — there is no separate rejection row)* |
| Guide slides, **4 DEX × 2 devices × N** | **not needed** |

> **The O0–O16 design is not wasted.** It stays in use on the CEX path.

**🔴 The gap this leaves** — a wallet address is public on-chain, so **a user can link an address they do not own.** With no ownership path, **support is the only correction.** Decide whether support unlinks on request or requires evidence.

**Knock-ons that do not mention ownership anywhere on screen**

| Screen | Why it changes |
|---|---|
| Review `✓ Verified` badge | Almost certainly means a verified UID at that exchange. Either no DEX review is ever verified, or the badge is redefined for DEX as "linked wallet with cashback history" |
| Maxboard, losing your entry UID | `REQ-030`/`REQ-115` define exactly two causes — ownership transfer and issue-UID designation. On DEX only the second can occur, so **half the state machine is unreachable** and two of the four reason labels never appear in admin |
| Linked-UID panel unlink warning | Its only trigger is an ownership transfer |
| Linking the wrong wallet | Maxboard states as a premise that **a user cannot unlink a UID themselves.** On DEX that becomes a trap — anyone can paste anyone's public address and nobody can undo it |

---

### ⛔ 16-13. Cashback Boost — excludes DEX (settled 2026-10-22) · **no change**

**Targets:** the user `Cashback Boost` screen · the admin boost-eligible exchange picker

> **Leave this screen alone. That is the instruction.**

Nearly every other screen is being opened to DEX, so **silence here means development will add DEX too.**
This "no change" is therefore recorded as an **explicit item**.

**Why it must not be added — each row needs three numbers and DEX can supply one**

| Column | CEX | DEX |
|---|---|---|
| `Other platforms` | A rival cashback service's rate | **No source.** No competitor publishes a DEX figure |
| `Official partner` | Our cashback rate | Pending commercial agreement (decision request `D-1`) |
| `🚀 With boost` | The boosted final rate | **Does not exist.** There is no boosted rate to show |

→ A DEX row would ship with **two of three columns blank**.

| # | Action | Owner |
|---|---|---|
| 1 | User `Cashback Boost` exchange list — **no DEX rows** | Development |
| 2 | Admin boost-eligible exchange picker — **DEX must not appear as an option** | Development |
| 3 | Remove any boost copy that reads as if DEX were included | Documentation |

> **Same conclusion as V1, different reason.** V1 said *"no payout vehicle"*; V2 says *"no number to compare against, and the boost concept does not exist for DEX"*. Decision request `D-7` is closed.
>
> **Where to see it in the prototype** — user screens, `Other touchpoints > Cashback Boost`

---

### ⛔ 16-14. Cashback Challenge — DEX not reflected (settled 2026-10-22)

**Targets:** the `Cashback Challenge` gauge screen · the claim-account picker · the `type` filter in cashback history

> **The challenge is CEX-only. A DEX wallet neither fills the gauge nor appears in the claim list.**

The V2 re-assessment had raised this from partial to applied on the grounds that the claim-UID restriction was gone. That is reversed.

**V1's half-in state goes away with it**

| | Gauge | Claim |
|---|---|---|
| V1 (partial) | DEX counted | **DEX barred** |
| V2 re-assessment | counted | allowed |
| **Settled** | **not counted** | **not shown** |

> *"The gauge fills but you cannot claim"* was a state the user had no way to understand. There is now one rule.

| # | Action | Owner |
|---|---|---|
| 1 | Gauge screen — **no** DEX wording | Documentation |
| 2 | Claim-account picker — **remove the DEX group and wallet rows** | Development · design |
| 3 | Cashback-history `type` filter — mark `Challenge reward` **`CEX only`**. Combined with a DEX account it always returns empty | Design |
| 4 | Challenge notifications — **exclude** DEX | Development |
| 5 | 🟢 The hardcoded `daily at 13:00 (UTC)` line — **no longer needs fixing on this screen.** It still does on the others | — |

**🔴 One open decision — does the gauge count DEX cashback?**

The screen says **"cashback"**, and **the home total includes DEX.**

```
Home        Total cashback    1,240.00 USDT   ← CEX + DEX
Challenge   Level 1            980 / 1,000 USDT  ← CEX only?
```

→ A member trading on both **sees two numbers disagree with no way to tell why.**
**Recommended — exclude DEX from the gauge and state "based on CEX trading" on the screen.** Excluding it silently does not solve the problem.

> **The over-5 branching question does not disappear, it moves.** This modal gains no wallet rows so its counts are unchanged, but **coupon use, invite-reward withdrawal and league entry** still have to be checked.
>
> **Where to see it in the prototype** — user screens, `Cashback Challenge > Challenge gauge / Claim picker`

---

### 🟠 16-15. When two shortened wallet addresses collide (new, 2026-10-22)

**Targets:** coupon use · invite-reward withdrawal · league entry — **every account picker**

> **Settled — user-facing screens shorten the address.** The full 42 characters are never shown.

That is the industry norm, and we have nowhere that needs the full form: the only situation that does is confirming a destination before sending, and **the withdrawal destination is the linked wallet** — the user never types an address. Full-length copies live only in the admin and the email record.

**🟠 One case breaks it**

```
0x7a3F…c51E9
  └┬─┘  └┬─┘
  first 6  last 4   →  0x is fixed, so only 8 characters distinguish
```

**This collision is not hypothetical.** Lighter already holds a wallet in `Processing` when shortened addresses collide — it happens inside our own system.

→ If a member links two wallets on the same exchange and both shorten to the same string, the picker shows **two identical rows** and they cannot tell which is which.

| # | Action | Owner |
|---|---|---|
| 1 | **Expand to a longer form** when shortened values collide within one exchange | Development |
| 2 | Or support a **user-set nickname** (`My main wallet`) | Product |
| 3 | Otherwise **keep shortening** — do not switch to full display | — |

> **Recommended — 1.** A nickname adds an input step and most members have one wallet per exchange.

---

## 16-12. Previously undecided items, now settled

| Previously undecided | Settled | Source |
|---|---|---|
| UID link screen: split or merge CEX/DEX | **Merged + type filter chips + `DEX` badge** | design E4 |
| Non-member exchange picker: split or merge | **Same — merged** | design E4 |
| Withdrawal modal: split or merge | **Merged. No tabs** — one list in priority order, withdrawn in full at once | decision 2026-10-22 |
| Exchange selection on every other screen | **One control + CEX/DEX groups inside it** | decision 2026-10-22 |
| Whether the payout destination needs ownership verification | **Fixed to the linked wallet.** Changes go through support | design DW2 |
| Wallet address display format | **`0x7a3F…c51E9`** (first 6 + … + last 4) | design DW1/DW2 |
| Whether non-members can withdraw on DEX | **Yes.** Identical to CEX | decision G-1 |
| Whether gas is shown | **Not shown** | decision F-3 |
| Case sensitivity in the wallet address field | **The current system is case-sensitive.** No separate branch needed | decision B-1 |

### E4 — the merged pattern, for reference

```
Get your cashback, no sign-up needed
Just link your exchange UID or DEX wallet address to claim the fees you've already paid.

🔍 Search partners
Popular partners
  [Bitget] [WOO X Pro] [Gate] [Lighter]          ← CEX and DEX mixed
  (All) (Centralised Exchanges) (Decentralised Exchanges)   ← type filter chips
  ⬤ Bitget                        →
  ⬤ Lighter              [DEX]    →              ← DEX badge
  ⬤ Aster                [DEX]    →
  ⬤ ApeX                 [DEX]    →
```

The home `Linked Accounts` list is merged the same way — `UID 685432171` and `Wallet 0x7a3f…51e9`
**sit in the same list with only the label changing.**
