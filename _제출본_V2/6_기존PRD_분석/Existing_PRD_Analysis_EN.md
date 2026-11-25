# Analysis of the six existing PRDs — from a DEX perspective

Written: 2026-10-21 · Revised: 2026-10-22
Documents: MAX-8, MAX-10, MAX-18, MAX-30, MAX-431, MAX-466

> This is an internal analysis. We read the six already-settled PRDs from a DEX angle and kept
> **only what directly affects the DEX work.**
> It is not a deliverable for the exchanges.

> **2026-10-22 note** — two entries in Chapter 7 (items 4 and 5) record the state as of 10-21 and were **reversed the next day** by policy decisions. They are marked inline.

---

## 0. What we read

| Jira | Title | Status | DRI | Size |
|---|---|---|---|---:|
| MAX-18 | Withdrawal Policy Adjustment | IN PROGRESS | Matthew | 5,905 lines |
| MAX-466 | Benefits Page PRD | IN PROGRESS | Kyle Choi | 6,882 lines |
| MAX-431 | Improved ownership verification | IN PROGRESS | Matthew | 2,844 lines |
| MAX-8 | Global League | **IN REVIEW** | Matthew | 2,649 lines |
| MAX-30 | UID linking | IN PROGRESS | Kyle Choi / Matthew | 1,579 lines |
| MAX-10 | Global League backoffice | IN PROGRESS | Matthew | 1,032 lines |

---

## 1. ★ The most important — the payout formula changes (MAX-18)

### 1-1. Matched withdrawal

```
Actual payout = A + MIN(B, A)
   A = cashback (from trading fees)
   B = event reward

Eligible when A + MIN(B, A) ≥ 10 USDT     ※ judged per UID
Decimals      2 places, floored at the third
```

**An event reward can never exceed the cashback amount.**

| # | A (cashback) | B (event) | Payout | Eligible | Note |
|---:|---:|---:|---|:--:|---|
| 1 | 5 | 5 | 5 + 5 = 10 | ✅ | standard 1:1 match |
| 2 | 2 | 8 | 2 + 2 = 4 | ❌ | still under the threshold after matching |
| 3 | 10 | 0 | 10 + 0 = 10 | ✅ | cashback alone is enough |
| 4 | **0** | 50 | 0 + 0 = **0** | ❌ | **zero cashback means no payout** |
| 5 | 6 | 4 | 6 + 4 = 10 | ✅ | reward < cashback, so all of it counts |
| 6 | 7 | 100 | 7 + 7 = 14 | ✅ | the reward is capped at the cashback |
| 7 | 100 | 7 | 100 + 7 = 107 | ✅ | cashback dominates |
| 8 | 4.5 | 4.5 | 4.5 + 4.5 = 9 | ❌ | fully matched but under 10 |
| 9 | 5.5 | 4.5 | 5.5 + 4.5 = 10 | ✅ | just over the line |
| 10 | 9.5 | 0.4 | 9.9 | ❌ | misses on the decimals |

**Why it exists (from the PRD):**
> *"Increasing cases of users cherry-picking event rewards without generating real trades, weakening the platform's trading incentive"*

→ It is a guard against harvesting event rewards without trading.

### 1-2. What it means for DEX

| Scenario | Result |
|---|---|
| Event rewards **not applied** to DEX (B=0) | Payout = A. Needs 10 USDT of cashback. The designer's DW1 card (only an `Exchange Cashback` row) would be **correct** |
| Event rewards **applied** to DEX | DW1 needs an `Event Reward` row, and `Available Cashback` must be shown as `A + MIN(B,A)` |

**The key constraint:** even with event rewards applied to DEX in V2,
**if DEX cashback is zero, the event reward cannot be withdrawn either** (case #4).
This has to appear in user-facing copy.

### 1-3. Correcting an earlier record

What I had recorded from Figma:
```
Available Cashback = Exchange Cashback + Event Reward    ← wrong
```
Actual:
```
Available Cashback = A + MIN(B, A)                       ← corrected
```
It looked like a plain sum because the sample data happened to have B ≤ A.

> **Verified 2026-10-22 against live screens.** Bitget UID 1432873105: A = 5.00, B = 232.00, claimable **10.00**. A plain sum would be 237.

### 1-4. Other settled points

**Pending states**
```
REQUEST → WAIT → PROCESSING → REVIEW     (4 internal stages)
         ↓
    the user only ever sees "Pending"
```
- The amount is **deducted immediately at REQUEST** and reflected in the balance
- On API failure it is **refunded automatically**

**Authentication flow (member)**
```
withdrawal list → Confirm Withdraw → confirm modal
   → slide-puzzle CAPTCHA
   → OTP (if registered) or a 6-digit email code (if not)
   → Success → (Share) → completion bottom sheet
```
- Email: **10 failures → locked for 24 hours**, code valid 10 minutes, resend cooldown 60 seconds
- OTP: **unlimited retries**, no cooldown
- Input is **preserved** on failure (it used to reset — this is a change)

**Authentication flow (non-member)**
```
UID search → UID detail → Withdraw → confirm modal
   → slide-puzzle CAPTCHA → submitted immediately
```
- **No OTP or email verification**
- **A single UID only**, no `+N`
- No completion notification exists (Open Question #10, unresolved)

**UID card states**
| Condition | Display |
|---|---|
| A + MIN(B,A) ≥ 10 | `Available` badge (green) |
| A + MIN(B,A) < 10 | `Inactive` badge (grey) + dimmed card + no interaction |
| All inactive | `Not eligible to withdraw` badge + Confirm disabled |

**17 milestone tiers**
| Tier | USDT | Reward | | Tier | USDT | Reward |
|---:|---:|---|---|---:|---:|---|
| 1 | 100 | TradingView subscription | | 10 | 2,000 | gaming PC |
| 2 | 200 | mechanical keyboard | | 11 | 5,000 | motorcycle |
| 3 | 300 | Nintendo Switch | | 12 | 10,000 | Omega watch |
| 4 | 400 | PlayStation 5 | | 13 | 15,000 | Rolex Submariner |
| 5 | 500 | Sony camera | | 14 | 20,000 | designer handbag |
| 6 | 600 | 4K monitor | | 15 | 30,000 | travel package |
| 7 | 800 | iPhone | | 16 | 40,000 | Tesla Model 3 |
| 8 | 1,000 | iPad Pro | | 17 | 50,000 | supercar |
| 9 | 1,200 | MacBook Air | | | | |

- `achieved_tier` = 0 (under 100) to 17
- Progress = `amount / achieved_threshold × 100%` (the final tier can exceed 100%)
- Two styling flags: `standard` (< 10K) / `vip` (≥ 10K)
- The DW1 modal's `First Milestone ≈ TradingView Subscription (100 USDT)` is tier 1

> **Checked 2026-10-22:** the milestone gauge **does not appear in the live withdrawal modal.** It lives elsewhere.

**Account deletion**
- Deletion is **blocked** if any UID has Available Cashback ≥ 10 USDT
- Event rewards on UIDs under 10 USDT are **forfeited** → a consent checkbox is required

**Completion bottom sheet**
- `You received [total] USDT` broken out as `[cashback] + [event reward] USDT`
- A **QR code** (referral sign-up link with the invite code applied). If there is no invite code, a `Generate Invite Code` button
- Download (save image) / Share (native share sheet)

**Invite rewards are out of scope**
> *"Invite reward withdrawals are not included in this change and will retain existing policy and logic"*

---

## 2. UID linking (MAX-30)

### 2-1. ★ The input rules conflict with DEX wallet addresses

Specified in QA cases QA50–QA64:

| Input | Result |
|---|---|
| `a` | **`A`** — auto-uppercased |
| `abc123XYZ` | **`ABC123XYZ`** |
| `!` `@#$%^&*()` space `,` `.` `/` `;` `'` | **blocked** |
| Paste `xyz!@#456` | `XYZ456` (specials stripped, uppercased) |

**The problem:** an EVM wallet address uses **mixed case** for its EIP-55 checksum.

```
Input:   0x7a3F9c2B41dE8806f5A1b3C9e4D2F07a6B8c51E9
Result:  0X7A3F9C2B41DE8806F5A1B3C9E4D2F07A6B8C51E9   ← checksum destroyed
```

**Required:** DEX wallet input needs **its own validation branch**
- preserve case
- allow the `0x` prefix (lowercase x)
- fixed 42 characters
- hex only (`0-9a-fA-F`)

This is not "another screen" — it is **a branch at the input component level.**

### 2-2. Seven error codes

| Code | Modal title | Message | Primary CTA | Secondary |
|---|---|---|---|---|
| `FAILED_NOT_FOUND_UID` | Unable to Link UID | Only accounts registered with the TetherMax referral code can be linked | Close | Contact Support |
| `FAILED_ALREADY_INTEGRATION` | UID Already in Use | This UID is already linked to another account | **Ownership Verify** | Contact Support |
| `FAILED_MY_INTEGRATION` | You've Already Added This UID | no further action | Close | — |
| `INTEGRATION_MAX_COUNT_OVER` | You've reached your UID limit | remove an existing UID first | Manage UIDs | Cancel |
| `FAILED_ISSUE_UID` | Unable to Link UID | contact support | Contact Support | — |
| **`FAILED_NEED_RECEIVE`** | **Unable to Link UID Yet** | **withdraw your accrued cashback first** (unclaimed ≥ 100 USD) | **Withdraw** | Contact Support |
| `FAILED_RECENT_POSSESSION` | Verification Limit Reached | a recent ownership check exists | Close | Contact Support |

**Also:** `Processing Your UID` (awaiting manual handling)

> **2026-10-22** — on a DEX wallet, `FAILED_ALREADY_INTEGRATION` must **not** offer the `Ownership Verify` CTA. Ownership verification is confirmed unsupported, so the CTA would promise something impossible. Route it to support instead.

### 2-3. ★ `FAILED_NEED_RECEIVE` ↔ the ApeX risk

If unclaimed cashback is **100 USD or more**, linking is blocked outright.
This maps exactly onto the ApeX "pre-existing unclaimed balance" risk.
→ Add this condition to the ApeX question in `02_데이터_확보_매트릭스`.

### 2-4. The link success screen is a settlement-cycle notice

```
┌───────────────────────────────┐
│ ✓ UID linking completed       │
│   {exchange} / {UID}          │
├───────────────────────────────┤
│ ⬤ Lighter   [Daily settlement]│
│   Next settlement: Thu, Mar 19│
│   Settlement time: 21:00 GMT+9│  ← update_time(UTC) → local
└───────────────────────────────┘
   [ Home ]
```

- `update_time` is **a field that already exists in the exchange admin**
- It only needs **exposing** in the `GET /ttmax/exchange/get-exchange-list` response
- Conversion: `Intl.DateTimeFormat().resolvedOptions().timeZone`

**The DEX problem:** Lighter settles **weekly (Monday)**, so a `Daily settlement` badge is wrong.
→ **A `Weekly` badge must be added.**

| Exchange | Settlement | Badge needed |
|---|---|---|
| Lighter | weekly (Mon) | **Weekly** |
| ApeX | hourly | Hourly or Daily |
| EdgeX | daily, 00:00 UTC | Daily |
| Aster | calculated 00:00 / published 09:00 | Daily (mind the time) |

### 2-5. API response fields

`GET /ttmax/exchange/get-exchange-list?imageType=ICON`

| Field | Use |
|---|---|
| `exchangeNo` | identifier |
| `name` | exchange name |
| `logo_url` | logo |
| `cashback_rate` | cashback rate |
| `referral_sign_up_url` | referral sign-up link |
| **`update_time`** (UTC) | settlement time — **newly exposed** |
| `brand_color_hex` | card background (falls back to the default) |
| `total_savings_rate` | shows `XX% Total Savings` (hidden / N/A if absent) |
| `is_featured` | whether it appears in Top Partner Exchanges |

### 2-6. Exchange picker structure

```
Select an exchange                              [X]
🔍 Search for an exchange
─────────────────────────────────────
Top Partner Exchanges        ← is_featured=true, circular icons in a row
  (○) (○) (○) (○)
─────────────────────────────────────
All Exchanges (N)            ← 3-column grid, square cards
  [logo / name / XX% Total Savings]
  background = brand_color_hex
```
When searching: `Top Partner Exchanges` hides and the header becomes `Search Results (N)`.

> **2026-10-22** — the DEX split pattern is settled: **one control, with CEX and DEX grouped inside it.** Not two tabs, not two modals.

---

## 3. Ownership verification (MAX-431)

The source PRD behind the O0–O16 states seen in Figma.

> **★ 2026-10-22 — ownership verification is confirmed unsupported on DEX.** Everything in this chapter remains in force **for CEX.** The DEX production volume noted in 3-3 is cancelled.

### 3-1. ★ A 30-day ownership cooldown

> Once an ownership claim is **approved**, **nobody can file a new claim on that UID for 30 days.**
> When blocked, the modal shows the **release date (D-n)**.

### 3-2. ★ Auto-fail at 10 minutes, with 6 polls

```
submit ─┬─ 2m ─┬─ 4m ─┬─ 7m ─┬─ 8m ─┬─ 9m ─┬─ 10m
        │      │      │      │      │      │
   (detects an early response)   (1-minute steps to the timeout)
                                              ↓
                                   no admin response → auto-fail

※ a manual refresh calls the API immediately
```

**Before → after**
| Item | Before | After |
|---|---|---|
| Auto-fail timeout | 15 min | **10 min** |
| API calls | every 5 min | **fixed 6 calls at 2, 4, 7, 8, 9, 10 min** |

**→ "reviewed within 5 minutes" is an average, and the real deadline is 10 minutes.**
Past 10 minutes the user is shown "failed" **with no reason.**

### 3-3. ★ A new backoffice section

> **`Exchange Guide → UID Ownership Verification`**
> Register and manage **mobile and PC slides** per exchange.
> One slide = **title + image + description text**
> Two or more → a dot indicator appears automatically. Reflected live.

**DEX production volume:**
```
4 DEXs × 2 devices (mobile/PC) × N slides = at least 8 sets
each set = title + image + description
```
The existing YouTube guide video is **removed.**

※ This backoffice section exists **because of CEX too** — it is not DEX-driven.

> **★ Cancelled for DEX (2026-10-22).** With ownership verification unsupported on DEX, the 4 × 2 × N production **disappears.** The section itself is still new work, for CEX.

### 3-4. Seventeen states

| Group | Screens |
|---|---|
| **A · Entry** | O0 home / other wallet linking / O1 already in use / O2 cannot claim |
| **B · Claim page** | O3 guide step 1 / O4 step 2 / O5 step 3 / O6 uploading / O7 uploaded / O8 upload failed / O9 server error / O10 submit confirmation |
| **C · Post-submit home** | O11 in review / O12 approved / O13 rejected / O14 unlinked by another claim / O15 re-claim / O16 re-claim rejected (with reason) |

**Four upload failure types:**
| Type | Copy | Buttons |
|---|---|---|
| Format | Only MP4 or MOV files are supported. | (toast, client-side) |
| Size | File size must be 100MB or less. | (toast, client-side) |
| Network | Upload failed. Please check your connection and try again. | Try again / Cancel |
| Server (5xx) | Something went wrong. Please try again later. | Try again / Contact Support / Cancel |

※ On a network failure the file **does not need re-attaching** (kept in memory).

### 3-5. Status display rules

| State | Dot | Inline banner | Cashback amount |
|---|---|---|---|
| In review | blue (1.4s pulse) | — (timer removed) | `–` |
| Approved | — | — | normal |
| Failed / timed out | **red** | `Ownership verification failed · Tap to retry` | `–` |
| Unlinked by another claim | **amber** | `Unlinked by ownership claim — Tap to reclaim` | — |

### 3-6. Three notifications

| Recipient | Trigger | Copy |
|---|---|---|
| Claimant | approved | Your ownership claim has been approved. [Exchange] UID [number] is now linked to your account. |
| Claimant | rejected | Your ownership claim was not approved. Please try again with a clearer screen recording. |
| **Displaced user** | someone else approved | Your [Exchange] UID [number] has been unlinked. Another user has claimed ownership. Tap to reclaim. |

Sent as both a push and an email. The dispatch logic is **unchanged**; only the copy is retoned.

> **2026-10-22 correction** — the live FCM sheet carries **two** ownership rows, not three. There is no separate row for the rejection. All of them are **not applicable to DEX.**

### 3-7. When the result modal appears

> The result modal appears **only while the user is on the home screen.**
> Elsewhere, only a push is sent.

The rejection reason is **not shown in the modal**. It is only revealed via the `View reason` link in the UID detail.
An automatic timeout has no reason → `No reason provided`.

There is **no limit on re-claims** (stated in Out of Scope).

---

## 4. Global League (MAX-8 / MAX-10)

### 4-1. ★ Score = commission cashback only

> **Out of scope: Event rewards and invite rewards are excluded.**
> `1 USDT (commission cashback) = 1 point`

→ **Event and invite rewards do not score.** Only pure commission cashback does.
→ TetherMax receives 100% of the DEX commission, so **the amount is computable → the league works**
→ **`volume` data is not needed** (corrected from "conditional" to "supported" in the re-assessment)

### 4-2. Six phases, P0–P6

| Phase | Name | Content |
|---|---|---|
| P0 | Pre-launch | page is public, no user actions |
| P1 | Early Bird | create, join and leave teams. Joiners get **+10% score** for the first 3 days of P3 |
| P2 | Recruitment | create, join and leave teams |
| P3 | Competition | scoring. **Only teams of 3 or more** take part |
| P4 | Pending | an admin manually excludes abusive TUIDs |
| P5 | Results | results published, exclusions shown |
| P6 | Rewards | prizes paid as event rewards. **The page is deleted afterwards → 404** |

- Each phase runs **1 to 60 days**
- Starts at **00:00 UTC**
- `P1 end = P2 start` … `P5 end = P6 start`, chained automatically. **No phase can be skipped**

### 4-3. Team creation requirements (all AND)

| Requirement | Threshold |
|---|---|
| Affiliate | designated an influencer in the TetherMax admin |
| Cumulative cashback | **≥ 500 USDT across every linked UID** |
| Last 30 days | **≥ 100 USDT across every UID** |
| Country code | not T1 / XX (by last-login IP) |
| Last season's contribution | if they led a team, it must **not be zero** (delegated leaders excepted) |

- Creating or joining a team is **once per UTC day**
- Maximum team size **10,000**
- Team names are **2–20 characters**, unique (exact match including spaces)
- Team image JPG/JPEG/PNG, **under 1MB**, **editable once per season**
- Four mandatory consent checkboxes

### 4-4. Entry UID

- **One UID on the league's exchange** (required)
- **Cannot be changed** during P1–P3
- Exception: if ownership transfer unlinks it, it may be reassigned
- If not linked: `{exchange} UID must be linked to participate`

> **DEX note:** since a DEX wallet is never unlinked by ownership transfer, that exception never fires on a DEX league.

### 4-5. Prize distribution (P5)

```
Leader takes 10% up front
The remaining 90% is split by contribution
Individual = (total prize × 90%) × (my score / team total)
Floored at 3 decimals, displayed at 2
```
- Any remainder is **forfeited** (no redistribution, carry-over or bonus)
- Amounts from excluded abusers are **not redistributed**; the rank is **left vacant** (no promotion)
- Exclusion is **per TUID**, never per team
- Payment type: `league prize` (visible in My Cashback History)

### 4-6. Batches

| Job | Cadence |
|---|---|
| Dashboard Aggregator | **15 min** |
| Participant information | 15 min |
| Ranking, Score Calculator | **daily at 13:30 UTC** |
| Early Bird Bonus | first 3 days of P3 |
| Final Settlement | P4–P5 |

### 4-7. Backoffice (MAX-10)

**League creation inputs**
```
a. Title / b. Subtitle
c. top banner image (mobile) / d. (PC)      ※ 5MB, WEBP, no slider, one each
e. prizes by rank (table: rank / prize / prize image, +/- rows)
f. P0–P6 dates
g. OG image (KO) / h. (EN)                  ※ 5MB, WEBP
i. SEO title (KO ≤35) / j. (EN ≤60)
k. SEO description (KO ≤70) / l. (EN ≤140)
m. operating exchange dropdown ← ★ the four DEXs must be added
```

**Policy**
- Multiple leagues can run **simultaneously**, and **the same exchange may repeat**
- One league = one exchange (1:1)
- **Either** individual or team, not both (run two leagues for both)
- Editable after creation: Title, Subtitle, banners, OG, SEO **only**
- Permissions: Master / Operator / PM
- LNB: `League` added under the `Points` section

**P4 abuse exclusion**
- The button is only active during P4
- Per TUID, with a confirmation: *"Excluding this user from the prize pool will not result in the prize pool being filled by another user"*
- Once excluded the button is disabled and labelled `Exclusion Complete`
- There is no separate save (it finalises when P5 starts)
- **A Slack alert fires at P4 start** — `Global league result Manage Period`

**Force close**
- Possible at any point in P0–P6
- Confirmation: *"Do you wish to delete the ongoing league?"*
- History is retained only up to the point of closure

**Team management**
- Team names use **LIKE search** (`A1B2` finds `A1B2C3`, but not `A1C3B2`)
- Country-change modal (admin only; users cannot)
- Deleting a team removes everyone and all scores. **Irreversible, no history kept**
- The same leader cannot recreate a team the same day it was deleted (UTC)

**CSV**
- Level 1: `golbal_league_history_{today}.csv` ※ the typo `golbal` is preserved from the original
- Level 2: `global_league_history_{start}_{end}.csv`

---

## 5. Benefits page (MAX-466)

### 5-1. The full benefits list (by priority)

| P | Benefit (EN) | Amount Main | Amount Sub | CTA |
|---:|---|---|---|---|
| 5 | Sign up for the exchange | Extra | Cashback | Sign up |
| 7 | Today also quiz time | {price} | USDT MAX | Join |
| 8 | Only one time quiz | {price} | USDT | Join |
| 9 | Guess the bitcoin price | 1K | USDT MAX | Join |
| 10 | Achieve Cashback goal | 37 | USDT MAX | View |
| 11 | Achieve Cashback goal | 67 | USDT MAX | View |
| 12 | You referred to your friend | 10 | USDT MAX | Claim |
| 13 | It's your first time visiting our site | 5 | USDT MAX | Claim |
| 14 | **Turn on alarm** | 1 | USDT | Turn on → **on web, `Download App`** |
| 15 | Calculate estimated cashback | 2 | USDT | Calculate |
| 16 | **Link your UID** | 3 | USDT | Link |
| 17 | **Claim your first cashback** | 10 | USDT | Claim |
| 18 | Join events | Extra | Profits | View |
| 19 | **Claim cashback monthly** | 100 | USDT MAX | Claim |
| 20 | Invite friends | Extra | Profits | Invite |
| — | **TetherMax Global League with {exchange}** | {total prize} | USDT | Join |

`{price}`, `{exchange}` and `{total prize}` are substituted at runtime.
→ **Opening a DEX league generates its benefit card automatically.**

> **2026-10-22** — priority 16, `Link your UID`, is **the one benefit that excludes DEX.** Linking a wallet does not complete the mission and no coupon is issued.

### 5-2. Tabs

```
[ Ongoing (N) ] [ Completed ]
```
- **Only Ongoing carries a count badge**; Completed has none
- Special Benefits are **excluded from both counts**
- Completable benefits move to Completed when done
- Non-completable (recurring, referral) stay in Ongoing **permanently**
- A completed card shows **the amount at the time of completion** (which may differ from the current admin value)
- The `NEW` badge is **removed entirely**

**Empty states**
| Audience | Copy | Button |
|---|---|---|
| Guest | Become a member to access completed rewards | Sign up → `/signup` |
| Member (none completed) | No Completed Rewards Yet | Explore Ongoing Rewards → Ongoing tab |

### 5-3. Localisation policy

> **Only KO and EN are managed.** Every other language **falls back to EN.**

DB fields:
```
amountMainLabel_ko / _en    (required)
amountSubLabel_ko  / _en    (optional, nullable)
title_ko / _en              (required, max 100)
subtitle_ko / _en           (required, max 200)
ctaLabel_ko / _en           (required, max 30) ← new
isSpecial (boolean) / specialSortOrder
```

**→ My estimate of "101 strings × 15 languages = 1,515" has to be corrected.**
The benefits area takes **KO and EN only**, with fallback for the rest.
Areas needing 15 languages and areas needing only KO/EN must be separated.

### 5-4. Detail page

- URL `/benefits/:benefitId`, **accessible to guests**
- When complete, a `Reward Received` banner and the amount sit above the hero; the CTA becomes `Completed` (disabled)
- **The completion timestamp is not shown**
- The three quizzes (P7/8/9) are **out of scope for this redesign** — existing designs stay
- Routing and API endpoints are **unchanged**

### 5-5. Backoffice

```
1. Benefit Management     — CRUD, KO/EN input, image upload, CTA route dropdown
2. Special Benefits       — Special toggle, drag-and-drop ordering, preview panel
3. Completion Logic       — per-benefit completion editor, completable toggle, completion stats
```
- CTAs use **predefined routes only** (no custom URLs in Phase 1)
- Special image: required when isSpecial=true, 5MB, PNG/JPG/WebP
- Benefits are **created manually only** (nothing is auto-generated)

---

## 6. Policies baked into every PRD

### 6-1. Local time display (MAX-18 / 30 / 431 / 466, all of them)

> Even when the server returns UTC, **the front end converts to the device's local time.**
> The conversion happens **on the client**, not the server.
> `Intl.DateTimeFormat().resolvedOptions().timeZone`
> Example: `2026.05.12 14:35`
> **Relative times such as countdowns are excluded.**

**Where this applies to DEX:**
| Location | Current | Action |
|---|---|---|
| DEX refresh notice | D+1 00:00 UTC | convert to local (09:00 KST) |
| Cashback challenge | `daily at 13:00` | convert |
| League leaderboard | `Next Update: 13:30 UTC` | convert |
| Cashback ranking | `updated daily at 00:01` | convert |
| Withdrawal request time | `26/07/2024 18:09:33` | convert |

### 6-2. ★ Store aggregates hourly (MAX-431 / MAX-466)

> Anywhere that displays a daily aggregate, the backend must **store at one-hour granularity**
> and include a **UTC timestamp on every record.**
> The client **re-aggregates by the user's local date.**
> Reason: "today" means something different in every time zone.

**→ Data received from the DEX ledger APIs also needs hourly retention.**
The exchange API request document currently says only "D-day trades → 24h aggregate → shown on D+1",
so **the hourly timestamp requirement is missing.**

### 6-3. Every screen must support both dark and light (stated in MAX-431)

---

## 7. What needs correcting in our own documents

| # | Document | Previously recorded | Correction |
|---|---|---|---|
| 1 | 3_연동_출금_플로우 | `Available = Exchange Cashback + Event Reward` | **`A + MIN(B, A)`**; zero cashback means zero payout |
| 2 | 4_백오피스_vs_하드코딩 | 101 strings × 15 languages = 1,515 | **separate the KO/EN areas from the 15-language areas** |
| 3 | 5_부가서비스 | Global League = conditional (depends on `volume`) | **Supported** (scoring is commission cashback) |
| 4 | 5_부가서비스 | UID ownership claim = not supported | ~~**Supported** (video upload, O0–O16)~~ → ⚠️ **Reversed on 2026-10-22. Back to not supported for DEX** (A-16) |
| 5 | 5_부가서비스 | Invite reward = supported | ~~**Not supported, or on hold** (MAX-18 also says "excluded")~~ → ⚠️ **Reversed on 2026-10-22. Supported** (A-2). MAX-18's exclusion refers to the withdrawal-policy change, not to DEX |
| 6 | 1_거래소_API_요청 | daily aggregation | **add hourly timestamp retention** |
| 7 | 1_거래소_API_요청 | — | **add `update_time` (settlement time)** |
| 8 | 2_화면_수정_필요 | DEX hides event rewards | **show them** (CS3 `Event reward day`) |
| 9 | 02_데이터_확보_매트릭스 | ApeX unclaimed balance | **link the `FAILED_NEED_RECEIVE` 100 USD condition** |
| 10 | 03_정책_결정_기록 | ownership undecided | **Settled: video upload + 30-day cooldown + 10-minute timeout** — for CEX. DEX unsupported |

---

## 8. New development and production items

| # | Item | Type | Note |
|---|---|---|---|
| 1 | **Dedicated validation for DEX wallet addresses** | Dev | preserve case; branch from the existing UID input |
| 2 | **Add a `Weekly` settlement badge** | Dev | Lighter settles weekly |
| 3 | **Add the four DEXs to the league admin exchange dropdown** | Dev | the MAX-10 league creation form |
| 4 | ~~**Backoffice ownership guide slides**~~ | ~~Content~~ | ⚠️ **Cancelled for DEX on 2026-10-22.** Still required for CEX |
| 5 | **Hourly ledger storage** | Dev (BE) | for local-date re-aggregation |
| 6 | **Register `update_time` for each DEX** | Ops | an existing field in the exchange admin |

---

## 9. Open questions in the PRDs themselves (unrelated to our decisions)

| Source | Question | Status |
|---|---|---|
| MAX-18 OQ#5 | **processing order** for multi-UID withdrawals | OPEN |
| MAX-18 OQ#6 | **partial failure** handling (refund everything vs partial success) | OPEN |
| MAX-18 OQ#2 | CAPTCHA retry limit | OPEN |
| MAX-18 OQ#10 | **no completion notification** for non-member withdrawals | OPEN |
| MAX-466 OQ-2 | per-benefit **completion criteria** | **dev blocker** |
| MAX-466 OQ-4 | source of truth for dynamic variables | **dev blocker** |
| MAX-466 OQ-8 | aggregation window for Total Event Rewards | **dev blocker** |

→ Of these, **partial failure (OQ#6)** is far more serious on DEX,
because an on-chain transfer **has already spent the gas when it fails.**

> **Added 2026-10-22** — in V2, withdrawal is a **single merged request across CEX and DEX.** That makes OQ#5 and OQ#6 harder, not easier: a request can succeed on its CEX legs and fail on-chain on its DEX leg, and the user receives both notifications at once.
