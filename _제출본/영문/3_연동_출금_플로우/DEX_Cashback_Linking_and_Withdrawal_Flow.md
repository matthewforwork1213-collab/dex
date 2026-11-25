# DEX Cashback Linking and Withdrawal Flow

Written 2026-10-20 · Last updated 2026-10-20
Korean version: `국문/3_연동_출금_플로우/DEX_페이백_연동_출금_전체플로우.md`

---

## Terminology Note

TetherMax names the same concept differently across three layers. These documents use the **current UI terms**.

| Korean (user-facing) | Current English UI (official) | API / legacy docs (do not use) |
|---|---|---|
| 페이백 / 캐시백 | **cashback** | `payback`, `rebate` |
| 연동 | **Link** / linking | `integration`, `interworking` |
| 연동 해제 | **Unlink** | `disconnect` |
| 비회원 | **non-member** | `guest` |
| 소유 확인 | **ownership verification** | `possession` |
| 회원탈퇴 | **Account Deletion** | `withdrawal` (never confuse with cash withdrawal) |

> **Important:** the CEX figures below are **current**. Older documents still carry legacy minimum-withdrawal values of 50 / 100 USDT; those are not current.

---

## 1. Structural Overview

### 1-1. How DEX differs fundamentally from CEX

| Item | CEX (17 live) | **DEX (4 new)** |
|---|---|---|
| Identifier | **UID** issued by the exchange | **Wallet address** + the DEX's own account ID |
| Attribution | Sign-up through the exchange's referral | TetherMax referral link |
| Who pays the cashback | **TetherMax** | **The DEX, directly into the trader's own DEX account** |
| TetherMax's role | Holds and pays funds | **Reads and displays only** |
| Withdrawal path | TetherMax → the trader's exchange wallet, internal transfer | **On the DEX's own site, by the trader** |
| Minimum withdrawal | **10 USDT matched, per UID** | **None** (only the DEX's own rules apply) |
| Second factor | Captcha + Google OTP or email | **None** |
| Event rewards | Yes | **None** |
| Invite rewards | Yes | **None** |
| Wallet connection or signature | Not applicable | **Never requested** |
| Display currency | USDT | **USDT** (USDC at 1:1; Aster as Aster's own USDT equivalent) |

### 1-2. Four governing principles

1. **TetherMax never moves a DEX trader's money.** It creates no payout, approval or withdrawal record.
2. **TetherMax never asks the trader to connect a wallet or sign a message.** The trader pastes an address, and nothing else.
3. **Every amount shown to a member is in USDT.** USDC counts 1:1. Aster amounts are Aster's own USDT equivalent at payout (`usdtValue`); TetherMax never converts.
4. **DEX activity generates no event rewards and no invite rewards.**

### 1-3. The four DEXs differ from each other

| Item | Lighter | ApeX | EdgeX | Aster |
|---|---|---|---|---|
| Settlement currency | USDC | USDT | USDC | The fee asset (varies) |
| Record key | Wallet address alone | Wallet + AccountID | ethAddress + accountId | Venue + address |
| Settlement frequency | **Weekly (Monday)** | Hourly | Daily (00:00 UTC) | Daily (published 09:00 UTC) |
| Webhooks | **None** (hourly polling) | Yes | Partial | Requested |
| States | Accruing / Paid / Withheld | Pending / Paid | Pending / Paid | Pending / Paid |
| Exposes a withdrawable balance | No | `available_balance` | **No** | Requested |
| Specific constraint | No cashback on Standard accounts; only bindings on or after 28 Jul 2026 | Returns no AccountID | Whole-team attribution | **Referral binding expires after 365 days** |

---

## 2. Linking Flow

### 2-1. Entry points

CEX and DEX share **one Link Account flow**.

| Platform | Entry |
|---|---|
| Web | `+ Link Account` on the signed-in home, shown in the empty state too |
| App and mobile web | Home card `Link once and paybacks keep coming` (nothing linked), or `Trading on multiple exchanges? Link more` (one or more linked) |
| Both | Also opens from a DEX detail page and from the Cashback Hub, with that exchange preselected |

### 2-2. Exchange selector

A dropdown inside the modal on web; a `Select an exchange` bottom sheet on app and mobile web. Both carry, top to bottom:

1. A search field, `Search exchanges`
2. `Popular partners` tiles
3. Filter chips `All` / `CEX` / `DEX`, with `All` selected by default
4. The exchange list. In the `All` list, **every DEX entry carries a `DEX` badge**

Selecting a DEX adds the subtitle `No wallet connection or signature required.`

### 2-3. Wallet address entry

- Field label `Paste your wallet address`, with a Paste control
- Helper text `Starts with 0x followed by 40 characters.`
- Once filled, the label becomes `Wallet address`
- A pasted address renders on one line, truncated at the end
- The primary action (`Next` or `Link wallet address`) stays disabled until the address passes format validation, with the hint `Paste a valid wallet address to continue.`

A per-DEX instruction block, `How to find your wallet address`, renders alongside it — operator-authored copy and up to five screenshots. For Lighter:

> `Open Lighter and log in. Tap your wallet address in the top right corner, copy it, then paste it above. No wallet connection or signature required.`

`Don't have an account yet? Sign up here` opens that DEX's TetherMax referral route in a new tab.

### 2-4. Address validation

Validation runs client side for immediate feedback and server side as the authority, **in the same order**. The server never trusts the client result.

| Order | Rule | Error copy |
|---|---|---|
| 1 | Trim leading and trailing spaces, tabs and line breaks. Untrimmed values are never stored. Internal whitespace makes the address invalid | — |
| 2 | Reject empty and whitespace-only values | `Enter your wallet address.` |
| 3 | Match the format declared on the selected DEX record (EVM for all four today) | `This doesn't look like a {DEX} wallet address.` |
| 4 | Require the lowercase `0x` prefix. A missing prefix or `0X` is rejected | `Enter a valid wallet address starting with 0x followed by 40 characters.` |
| 5 | Exactly 40 hexadecimal characters after `0x`. 39, 41 or a 64-character hash is rejected | Same |
| 6 | Only `0-9`, `a-f` and `A-F` after `0x` | Same |
| 7 | All-lowercase or all-uppercase is accepted. Mixed case is treated as EIP-55 and accepted **only if the checksum is valid**; an invalid checksum is never silently lowercased | `This address has an invalid checksum. Copy it again directly from {DEX}.` |
| 8 | Reject ENS names and ICAP/IBAN-format addresses | `Paste the 0x wallet address, not a name or other format.` |
| 9 | Reject the zero address | `This address can't be linked.` |

**Storage and display**
- Stored **lowercased** and compared case-insensitively
- Displayed in **EIP-55 checksum form**, truncated where space is short (for example `0x7a3F...51e9`)

### 2-5. Captcha

- A GEETEST slide puzzle, `Slide to complete the puzzle`
- On success, `Verification Success` shows and the flow continues
- Repeated failures lead to `Verification Limit Reached`

### 2-6. Attribution and the account ID

TetherMax asks the DEX whether **this wallet joined through the TetherMax referral link**. The DEX returns its own account ID, which TetherMax stores with the address. **The member never types it**, because the same wallet can be used on several DEXs.

| DEX | How attribution is checked | Account key |
|---|---|---|
| **Lighter** | Against the weekly CSVs already received; otherwise against the live referee list by **masked address** (`0x` + first 2 + last 4) and bind time | Wallet address alone, covering the main account and all sub-accounts |
| **ApeX** | `is_partner_referral` lookup | Wallet + AccountID. **Open: ApeX returns no AccountID** |
| **EdgeX** | Attribution lookup; only users who completed sign-up are returned | `ethAddress` + `accountId` |
| **Aster** | Address lookup returning bind time and expiry | Venue + address |

**When attribution cannot be confirmed immediately**, the link is held as `Processing` and the member is notified when it resolves.

> **Lighter correction (A-07).** This originally read "for Lighter this is the masked-match case, which waits for the next Monday CSV". **Senya's reply of 19 October made immediate verification possible.** A single masked match links **immediately**, using `used_at` as the binding time. `Processing` now applies **only when two or more masked addresses collide**.

### 2-7. Success

1. A `Wallet Linked` modal — `Your {DEX} wallet address has been linked.` with `Back to Home`
2. A home toast — `Wallet linked successfully`
3. A new row in the Linked Accounts panel, without a page reload

### 2-8. The eight failure and pending states

| State | Copy | When | Actions |
|---|---|---|---|
| `Verification Limit Reached` | `Too many attempts. Please wait a few minutes and try again.` | Too many failed captcha or link attempts in a short period | Close, Contact Support |
| `Unable to Link Wallet` | `We were unable to link this wallet address. Please contact our support team for assistance.` | Any reason no other state covers, for example the DEX rejects the request or returns an error | Contact Support |
| `Unable to Link Wallet Yet` | `Please withdraw your accumulated cashback before linking a new wallet.` | **CEX path only.** Never shown on a DEX | Withdraw |
| `Unable to Link Wallet` (not a referral) | `Only wallets that joined {DEX} through TetherMax's referral link can be linked.` | The DEX does not report the wallet as a TetherMax referral. Lighter: no eligible masked match, or bound before 28 Jul 2026. EdgeX: sign-up not completed | Close, Contact Support |
| `Wallet Already in Use` | `This wallet address is already linked to another account. If it belongs to you, please contact our support team.` | The address, compared trimmed and lowercased, is linked to another TetherMax account on the same DEX | **Contact Support (primary)**, Try a different wallet |
| `You've Already Added This Wallet` | `This wallet address is already linked to your account. No further action is needed.` | Already linked to the member's own account on the same DEX | Close |
| `You've reached your wallet limit` | `You've reached the maximum number of linked wallets. Remove an existing one to add a new wallet.` | The wallet limit is reached | Manage Wallets, Cancel |
| `Processing Your Wallet` | `Your wallet address is being processed. You'll be notified once linking is complete.` | Attribution cannot be confirmed immediately | Back to Home |

### 2-9. Wallet limit

**Current design: `3 × the number of active DEXs`, pooled across all DEXs.**

- Four active DEXs gives 12 in total; ten gives 30
- The allowance is not allocated per DEX. A member may use all of it on one DEX
- Each wallet-and-DEX pair counts once, so the same address linked on two DEXs **uses two places**
- `Active` and `Processing` links both count
- Removing a wallet frees its place. ~~Losing it through an ownership claim~~ **no longer applies (A-16)**
- CEX UIDs do not count
- The limit is checked server side on every attempt, **inside the same transaction as the link**
- If a DEX is deactivated and the limit falls below what a member has already linked, existing links stay and no new wallet can be linked until the member is below the limit

> **To confirm:** this formula makes DEX activation and deactivation change every member's allowance. Launching with two DEXs would give six. A fixed total is worth considering.

### 2-10. What changes from the CEX flow

- One Link Account flow, with an `All` / `CEX` / `DEX` filter in the selector
- On the DEX path the member pastes a wallet address instead of a UID. **No wallet connection or signature at any point**
- The DEX's account ID is supplied by the DEX and never typed by the member
- Failure states are worded for wallets
- `Unable to Link Wallet Yet` is on the CEX path only, because DEX cashback is withdrawn on the DEX

---

## 3. Cashback Accrual

### 3-1. Common rules

- TetherMax ingests each DEX's partner data **server side**. No page calls a partner API directly
- Partner keys are **read only** and are never exposed to the client
- **Lookback is at most 180 days.** Activity older than that cannot be backfilled
- Amounts are **stored in the DEX's settlement currency** and shown to members **in USDT**
- Records are immutable. A correction is a **new record** referencing the original
- Records for a period are final **48 hours** after it closes
- Every partner-supplied wallet address is validated with the **same rule as member entry**. An invalid or wrong-checksum address is never matched, corrected or dropped silently: it is held for review and reported back to the DEX weekly
- Until a feed is live, data is uploaded through the **backoffice Excel path**

### 3-2. Accrual by DEX

#### Lighter — weekly

| Item | Detail |
|---|---|
| Eligibility | **Only bindings on or after 28 Jul 2026.** Only Plus and Premium accounts (Standard pays 0% fees, so it earns nothing) |
| Payout | Every Monday for the previous week (Mon 00:00 to Sun 23:59 UTC), with a **$1 minimum** |
| How it is paid | Lighter sends a **USDC L2 transfer** straight to the trader's own Lighter main account |
| Live data | `userReferrals` is **polled hourly** for week-to-date fees and tier |
| Ledger of record | **The Monday CSV is the ledger of record**, carrying week, wallet, bind time, tier, fees paid, cashback, TetherMax's share, status and tx hash |
| Three states | **Accruing** — a week-to-date estimate, not in any total / **Paid** — final, from the Monday CSV, with its tx hash / **Withheld** — withheld after Lighter's abuse review, not in any total |
| After payout | **No clawback.** Paid is final |

The mid-week figure is **an estimate TetherMax computes** (fees paid this week × the agreed rate). It must be labelled as an estimate and must never count in a paid total.

#### EdgeX — daily, no withdrawable balance

| Item | Detail |
|---|---|
| Payout | Settles daily at 00:00 UTC, one record per member per UTC day. Paid in **USDC directly into the trader's EdgeX perpetual account** between 00:00 and 01:00 UTC |
| Records available | By 01:00 UTC |
| Amounts provided | `totalPaidAmount` (paid to date), `accruingAmount` (earned today, not yet settled), `pendingAmount` (settled, not yet paid) |
| **Withdrawable balance** | **Not provided.** Once paid, the rebate is part of the member's margin and cannot be told apart; EdgeX treats the withdrawable amount as the account owner's data |
| What the card shows | `Paid to your EdgeX account` (= `totalPaidAmount`) and `On the way` (= `accruingAmount` + `pendingAmount`) |
| Small amounts | Anything below 0.01 USDC, and failed payouts, roll over and stay in `On the way` |

#### ApeX — hourly

| Item | Detail |
|---|---|
| Payout | Settles hourly as batch-level ledger records. Paid in **USDT into the trader's ApeX Rewards Center** |
| States | **Pending** — awaiting settlement, not in any total / **Paid** — distributed to the Rewards Center, counted |
| Also shown | `Available on ApeX` — the unclaimed balance in the Rewards Center (`available_balance`) |
| Record key | `record_id`, globally unique and immutable (for example `apx_cm_20261006_14_000184`) |
| Monthly statement | Generated on the 1st at 00:00 UTC |
| **Open** | The spec does not list **the cashback amount, the wallet address, the token or the paid time** on a ledger record, and returns no AccountID |

#### Aster — daily, with a binding expiry

| Item | Detail |
|---|---|
| Payout | Calculated at 00:00 UTC, published 09:00 UTC, paid the following day, $1 minimum |
| Currency | Paid **in the fee asset** (USDT, USD1, USDC, USDC.e, ETH, BTC, BNB, USDF, asBNB and others) |
| Conversion | **TetherMax never converts.** It uses only Aster's own USDT equivalent at payout (`usdtValue`, with `payoutPrice` and `priceTime`). The original asset and amount are kept for audit only, and a row without `usdtValue` is rejected |
| **Binding** | **365 days by default** (`bindExpireTime`) |
| 30 days before expiry | Aster sends the expiring-binding webhook. TetherMax shows `Referral expires on {date}` and notifies the trader once |
| At expiry | The account reads `Referral expired`. The address, the history and pre-expiry amounts stay, and are still withdrawn on Aster. **Records dated after expiry are not shown or totalled; they are held for review and reported to Aster** |
| Renewal | A new binding makes the account active from the new bind time. **Trades between expiry and renewal are not attributed** |

> **Important:** without a renewal mechanism (R13), **every TetherMax trader on Aster stops earning cashback after one year.**

### 3-3. Data delayed handling

When a partner feed has not refreshed within its threshold, the card shows **the last reported amount with its updated time**. It never shows zero and never blanks.

| DEX | Threshold (proposed) |
|---|---|
| Lighter | CSV not received by Monday 23:59 UTC, or polling failing beyond the threshold |
| ApeX | 2 hours (two hourly settlements) |
| EdgeX | Previous UTC day's records not received by 03:00 UTC, or reading failing for 2 hours |
| Aster | 11:00 UTC the day after settlement, or reading failing for 2 hours |

Copy: `{DEX} data is delayed` / `Last updated {date, time}`

### 3-4. What changes from CEX accrual

| CEX | DEX |
|---|---|
| One daily batch, 11:00–12:00 UTC | **The cadence differs per DEX** (weekly, daily, hourly) |
| `cashback = total commission × (1 − margin rate)` | TetherMax receives the amount the DEX calculated |
| USDT only | USDC, USDT and fee assets, all displayed as USDT |
| USDT futures pairs only | Scope differs per DEX (Lighter includes perpetuals and spot) |
| Credited to the TetherMax balance | **Already in the trader's DEX account.** TetherMax only reports it |

---

## 4. Withdrawal

### 4-1. The key point — nothing is withdrawn through TetherMax

DEX cashback is already in the trader's own DEX account. TetherMax only sends the trader there.

### 4-2. Member flow

1. The member opens Withdraw
2. The drawer's top card, `Total Cashback Earned`, shows **one combined USDT figure** (USDC counted 1:1)
3. One card renders per linked DEX wallet, each with its amount and a `Withdraw on {DEX}` action
4. The member selects `Withdraw on {DEX}`
5. A redirect dialog opens

   | Row | Content |
   |---|---|
   | DEX | The venue name |
   | Wallet | The truncated wallet address |
   | Exchange Cashback | The amount, in USDT |

   Actions: `Cancel` and `Go to {DEX}`
   Footnote: `You'll be taken to your {DEX page} ({deep link}) in a new tab. Connect the same wallet there to withdraw your cashback. TetherMax will never ask you to connect or sign with your wallet.`
6. `Go to {DEX}` opens the DEX's own rewards page in a **new tab**
7. TetherMax shows the toast `{DEX page} opened in a new tab`. **The withdraw drawer stays open behind it**
8. The trader connects the same wallet on the DEX and withdraws there
9. When the member returns to the TetherMax tab, the drawer refetches its figures and shows the `Back from {DEX}?` notice

**If the browser blocks the new tab**, the dialog stays open and shows a warning.
- Title: `Your browser blocked the new tab`
- Body: `Allow pop-ups for TetherMax, or select "Open {DEX}" to open it now.`
- The primary button becomes `Open {DEX}`. Selecting it is a direct click, so the browser allows it

### 4-3. Non-member flow

Identical, with these differences only:
- No event reward row, because there are none
- No sign-in, email verification or captcha is requested
- A sign-up banner shows: `Join TetherMax to see all your cashback in one place.`

### 4-4. A display rule that matters

**Earned cashback does not go down when the trader withdraws.** TetherMax cannot see a withdrawal made on the DEX. Figures change only when the DEX's next data update arrives.

The `Back from {DEX}?` notice says so:
> `If you withdrew on {DEX}, it can take a few minutes for the latest figures to show here. Exchange Cashback is what you have earned, so it doesn't go down when you withdraw.`

> **To confirm:** a partner correction record **can** reduce the earned figure. The copy should be scoped to "does not go down when you withdraw".

### 4-5. Zero, delayed and error states

| State | Handling |
|---|---|
| Loading | Skeletons. No figure and no action renders |
| Zero cashback, feed healthy | `0.00 USDT`, a chip, a disabled `Withdraw on {DEX}`, and the banner `No exchange cashback yet. Cashback appears here after you trade on your linked DEX.` |
| Data delayed | The last amount with `Last updated {time} UTC` |
| Load failed | `We can't load your {DEX} cashback right now.` with `Try again`. **Other cards still render, and `Withdraw on {DEX}` still renders**, because it only opens the DEX |
| No deep link configured | `Withdraw on {DEX}` does not render |

### 4-6. What changes from the CEX flow

**What disappears entirely on a DEX**
- The withdrawal request itself
- The minimum (10 USDT matched per UID on a CEX)
- The matching formula `cashback + min(event reward, cashback)`
- Captcha, Google OTP and email verification
- Pre-deduction of the asset, and the refund when a transfer fails
- The 72-hour withdrawal block after a password change
- The 24-hour block after ten failed withdrawal email verifications
- Operator approval and rejection on manual-withdrawal exchanges
- USDT liquidity management on TetherMax's partner accounts
- Withdrawal success and failure notifications

**What is new on a DEX**
- The redirect dialog and the new tab
- A fallback when the new tab is blocked
- Refetching figures when the trader returns
- Per-DEX deep link configuration

---

## 5. Wallet Ownership Verification — 🚫 **Deferred (A-16)**

> **Decided 2026-10-20 (A-16).** Wallet ownership claims for DEX are **out of scope for this release.** Whether to build them at all is still open.
>
> Sections 5-1 to 5-5 below restate the DEX PRD (`OWN-1`–`OWN-8`). **They are not the current design.** They are kept as the starting point if ownership returns.
>
> **What replaces it:** duplicate wallets are handled by **customer support**. The primary action on `Wallet Already in Use` is `Contact Support` (see 2-8).
>
> **Also dropped with it:** the 30-day cooldown, the three-step screen-recording guide, the back-office claim review queue, the three 16:9 `EDC-26` guide images, and the wallet-limit rule that a place is freed when ownership is lost.

### 5-1. When it happens

When a member submits a wallet address **already linked to another TetherMax account**, `Wallet Already in Use` opens, and a member who owns the wallet can start an ownership claim.

**A 30-day cooldown applies.** If someone else verified the wallet within the last 30 days, `Ownership Claim Unavailable` shows and the flow stops.
> `This wallet address was recently verified by another user. Ownership claims will be available after 30 days.`

### 5-2. The evidence — a three-step screen recording

**All recording happens on the DEX. TetherMax does not connect to the wallet at any point.**

| Step | Title | What the member does |
|---|---|---|
| 1 of 3 | `Start recording, then disconnect your wallet` | Start the screen recording, open the DEX, and disconnect the wallet from the account menu at the top right |
| 2 of 3 | `Log back in with the same wallet` | Keep recording and reconnect the same wallet. **The wallet connection and approval screens must be visible** |
| 3 of 3 | `Show your full wallet address` | Open the account menu and show the full wallet address on screen, with **every character clearly visible** |

Guide images are authored per DEX in the backoffice.

### 5-3. Upload and review

| Item | Rule |
|---|---|
| File | MP4 or MOV, up to 100MB |
| Info note | `Most claims are reviewed within 5 minutes. You'll be notified as soon as a decision is made.` |
| Warning note | `Some events may be restricted during the claim period. Existing coupons cannot be transferred.` |
| Confirmation | A `Submit this claim?` dialog, stating `This action cannot be undone after submission.` |
| Review | An operator plays the recording in the backoffice queue and approves or rejects it with a reason |
| Security | Virus scanned and stored privately, never in an analytics payload or a URL. Every decision records the operator |

### 5-4. Outcomes

| Outcome | Handling |
|---|---|
| Processing | Home shows `Ownership verification in progress` with an elapsed timer; the amount shows `-` |
| Approved | `Ownership Verification Complete`. The wallet moves to the claimant and the amount shows |
| Rejected | The row reads `Ownership verification was unsuccessful. Please try again.`, with a dialog |
| Previous holder | The row reads `This wallet has been unlinked. Tap to verify ownership and reclaim it.`, offering `Remove Wallet` or `Submit Wallet Ownership` (subject to the 30-day cooldown) |

### 5-5. What changes from the CEX flow

- The guide has **three steps instead of two**
- It proves **control of the wallet** rather than showing a UID
- All wording says wallet instead of UID
- **A 30-day cooldown is added**

> **Note:** proving ownership by wallet signature would be technically stronger. It was not adopted because of the principle that TetherMax never requests a wallet connection or signature. The balance between that principle and the strength of the evidence is worth revisiting.

---

## 6. Non-member Cashback Claim

### 6-1. Flow

1. The non-member opens the claim page
   - H1: `Get your cashback, no sign-up needed`
   - Lede: `Just link your exchange UID or DEX wallet address to claim the fees you've already paid.`
2. They select an exchange, using the same selector as Link Account
3. They paste the wallet address
   - Helper: `Paste the wallet address you use on {DEX}. No wallet connection or signature required.`
4. They select `Claim cashback`
5. A GEETEST captcha runs
6. Checks run in this order
   1. Is this address linked to a member account?
   2. Does the DEX report it as a TetherMax referral?
7. On success, the non-member My Cashback view opens

### 6-2. Outcome dialogs

| State | Copy | Actions |
|---|---|---|
| Linked to a member account | `This wallet address is already linked to a TetherMax member account. Log in to see its cashback.` **No amount is shown** | Log In, Close |
| Not a referral | `Only wallets that joined {DEX} through TetherMax's referral link can claim cashback here. Join {DEX} through TetherMax to start earning.` | Join {DEX}, Close |
| Attempt limit reached | `Too many attempts. Please wait a few minutes and try again.` | Close, Contact Support |
| ~~Lighter still confirming~~ | ~~`Lighter confirms new referrals once a week...`~~ **Removed per A-07 — verification is immediate.** Only needed when two or more masked addresses collide | Close, Contact Support |
| Other error | `We couldn't check this wallet right now. Please try again in a few minutes.` | Try Again, Contact Support |

**No notification is sent to a non-member.** The dialog asks them to check back.

### 6-3. Transfer on sign-up

When a non-member signs up and links the same wallet, the claim record and its history move to the member account. Afterwards, a non-member claim on that wallet asks the visitor to log in.

> **To confirm:** passing a captcha is enough to read another person's earned amount and history. Members have the screen-recording dispute path; non-members have no equivalent. The transfer also happens without ownership verification.

---

## 7. CEX → DEX Change Summary

| Area | CEX (current) | DEX | Nature |
|---|---|---|---|
| Identifier | UID string | Wallet address + DEX account ID | **Replaced** |
| Attribution check | Partner API referral lookup | Differs per DEX; Lighter uses masked matching | **Replaced** |
| Link limit | `exchanges visible and linkable × 3` | `3 × active DEXs`, pooled | **Separate scheme** |
| Ownership evidence | Two-step recording (shows the UID) | **None — handled by customer support** | **Deferred (A-16)** |
| Accrual cadence | Daily, 11:00–12:00 UTC | Differs per DEX (weekly, daily, hourly) | **Replaced** |
| Accrual calculation | `commission × (1 − margin rate)` | The DEX's own figure is ingested | **Replaced** |
| Currency | USDT | USDC, USDT, fee assets → shown as USDT | **Extended** |
| Who holds the cashback | TetherMax | **The trader's DEX account** | **Fundamental change** |
| Withdrawal request | Yes | **None** | **Removed** |
| Minimum withdrawal | 10 USDT matched per UID | **None** | **Removed** |
| Matching formula | `cashback + min(event reward, cashback)` | **None** | **Removed** |
| Second factor | Captcha + OTP/email | **None** | **Removed** |
| Pre-deduction and refund | Yes | **None** | **Removed** |
| 72h / 24h withdrawal blocks | Yes | **None** | **Removed** |
| Manual withdrawal operations | Operator transfers on OKX and HTX | **None** | **Removed** |
| Partner liquidity management | Required | **Not required** | **Removed** |
| Event rewards | Yes | **None** | **Removed** |
| Invite rewards | Yes | **None** | **Removed** |
| Withdrawal notifications | Required push on success and failure | **Not applicable** — needs redefinition | **Replaced** |
| Redirect | None | **New tab, blocked-tab fallback, refetch on return** | **New** |
| Binding expiry | None | **Aster, 365 days** | **New** |
| Account tier constraint | None | **Lighter Standard earns nothing** | **New** |

**The entire withdrawal block disappears on a DEX.** Labelling that block clearly as CEX-only is the most important structural decision in this document.

---

## 8. 미결 항목 / Open Items

| # | 항목 / Item | 담당 / Owner |
|---|---|---|
| 1 | ApeX 원장에 캐시백 금액·지갑 주소·토큰·지급 시각이 포함되는지 / Whether ApeX ledger records carry the cashback amount, wallet address, token and paid time | ApeX |
| 2 | ApeX AccountID 추가, 또는 지갑 1개 = 계정 1개 확인 / ApeX to add `account_id`, or confirm one wallet maps to one account | ApeX |
| 3 | ApeX 인증 방식과 base URL / ApeX authentication method and base URL | ApeX |
| 4 | Aster 요구사항 회신 / Aster's response to the requirements | Aster |
| 5 | Aster 365일 바인딩 갱신 방식 / Aster's renewal mechanism for the 365-day binding | Aster |
| 6 | Lighter 합의 요율 (주중 추정치 계산에 필요) / The agreed Lighter rates, needed for the week-to-date estimate | Lighter |
| 7 | Lighter가 주간 CSV 전에 전체 주소를 확인해 줄 수 있는지 / Whether Lighter can confirm a full address before the weekly CSV | Lighter |
| 8 | EdgeX partnerRate 값 / The `partnerRate` value | EdgeX |
| 9 | 지갑 한도 공식 확정 (고정 총량 검토) / Finalise the wallet limit formula; consider a fixed total | 내부 / Internal |
| 10 | 데이터 지연 임계치 확정 / Confirm the data-delayed thresholds | 내부 / Internal |
| 11 | 정정 레코드로 적립액이 감소할 때의 안내 / How to communicate a reduction caused by a correction | 내부 / Internal |
| 12 | 비회원 조회의 소유권 공백 / The ownership gap in the non-member claim | 내부 / Internal |
| 13 | DEX 연동·지급 관련 신규 알림 정의 / Define new notifications for DEX linking and payout | 내부 / Internal |
