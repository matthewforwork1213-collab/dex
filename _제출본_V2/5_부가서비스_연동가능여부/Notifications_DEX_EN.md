# Notifications (FCM · Email) — DEX

**Written** 2026-10-22 · **Targets** `FCM.xlsx` `EMAIL.xlsx`
**Source** 106 live FCM entries across 108 rows / **30** live email entries across **32** rows

---

## 0. One-page summary

| Category | Count | Where |
|---|---|---|
| **DEX-only, new or rewritten** | **16** | `FCM.xlsx` rows 100–108 · `EMAIL.xlsx` **rows 26–32** |
| **Existing notifications needing a DEX branch** | **12** | Chapter 2 — no new rows; the existing rows branch |
| **Existing notifications that do not apply to DEX** | **2** | Ownership. Chapter 3 |

> 🔴 **This sheet does not contain the transactional emails.** The login verification code and the UID-linked email are both sent in production (captures under `E_알림_실물/`) yet have no row in `EMAIL.xlsx`. All 29 original rows are campaign or notice emails. That means **the DEX wallet-linked email cannot be compared side by side with its CEX counterpart**, and an omission cannot be caught by eye. That is why rows 30–32 were added **in this sheet's format** — the actual implementation lives with the transactional templates.

> **Languages** — the sheet is structured for five: `title(ko)` `title(en)` `title(tc)` `title(ru)` `title(vi)`. However, **the existing CEX rows only have ko and en filled in; tc, ru and vi are empty throughout.** That means translation is a separate process, so **the DEX rows were written in ko and en only.**

> **Email bodies** — the sheet has **no body column at all.** Only subjects are managed; bodies are written on top of the template. (The Maxboard PRD says the same: "email bodies are not in the sheet and are drafts.") The live template structure is in Chapter 4.

---

## 1. The 16 DEX entries (rewritten)

### 1-1. What reversed from the V1 draft ★

The earlier draft was written on the V1 premise that **each DEX pays the trader directly.** V2 is the opposite — **trader cashback 0%, TetherMax receives 100% of the commission, and TetherMax pays on-chain.**

| Row | V1 draft | **V2 rewrite** |
|---|---|---|
| FCM 103 | `DEX cashback paid` — *"cashback has been paid into your {exchange} account"* | **`DEX cashback accrued`** — *"{amount} USDT {exchange} cashback has been **added**"* (TetherMax balance) |
| FCM 108 | `payout delayed or carried over` — *"below the minimum payout, carried to the next settlement"* | **`DEX withdrawal failed (on-chain)`** — gas spike, nonce collision, RPC timeout, Wallet B underfunded, chain congestion |
| — | (did not exist) | **`DEX withdrawal completed (on-chain)`** — arrival in the customer's wallet |
| EMAIL 28 | The user claims all ApeX cashback themselves | **Narrowed to the pre-link unclaimed balance only.** Anything earned after linking comes to TetherMax |

### 1-2. FCM, 9 entries (rows 100–108)

| # | Name | Nature | Title (ko) |
|---|---|---|---|
| 100 | DEX wallet linking completed | DEX counterpart of CEX row 22 | 💡 지갑 연동완료 알림 |
| 101 | DEX wallet linking failed | DEX counterpart of CEX row 23 | 💡 지갑 연동실패 알림 |
| 102 | DEX wallet linking confirmed | **DEX-only, new** (Lighter) | 💡 지갑 연동확정 알림 |
| 103 | **DEX cashback accrued** | ★ V2 rewrite | 💡 캐시백 적립 알림 |
| 104 | **DEX withdrawal completed (on-chain)** | ★ V2 new · counterpart of CEX row 20 | 💡 출금 완료 알림 |
| 105 | **DEX withdrawal failed (on-chain)** | ★ V2 rewrite · counterpart of CEX row 21 | 💡 출금 실패 알림 |
| 106 | DEX cashback withheld | **DEX-only, new** (Lighter) | 💡 캐시백 보류 알림 |
| 107 | Aster referral expiring soon | **DEX-only, new** | 💡 레퍼럴 만료 예정 알림 |
| 108 | Aster referral expired | **DEX-only, new** | 💡 레퍼럴 만료 알림 |

### 1-3. Email, 7 entries (rows 26–32)

| # | Name | Note |
|---|---|---|
| 26 | Aster referral expiring soon | Sent as **both** a push and an email — cashback accrual stops, which is a material change |
| 27 | Aster referral expired | The body **must** say that already-accrued cashback is still withdrawable |
| 28 | ApeX unclaimed cashback reminder | ★ **Narrowed to the pre-link unclaimed balance** |
| 29 | DEX service termination notice | DEX counterpart of the BVOX offboarding mail (row 23) |
| **30** | **DEX wallet linking completed** | ★ **New.** DEX counterpart of the live CEX mail `[TetherMax] UID Binding Success` |
| **31** | **DEX wallet linking failed** | ★ **New.** The CEX counterpart **exists** (Figma `UID 연동 실패`), plus a separate auto-reject variant |
| **32** | **DEX wallet linking confirmed (pending released)** | ★ **New.** Lighter only. Paired with the choice of **when** row 30 fires |

> **Rows 30–32 are unlike the ownership entries.** The two ownership notifications drop because DEX has no such path at all, but **linking does happen on DEX exactly as it does on CEX**. FCM already had it as rows 100–101; only email was missing.

> ⚠️ **30 and 32 are an either/or.** On Lighter a masked address collision leaves the wallet `Processing` for up to seven days. Send "completed" at link time and it may not be confirmed yet; wait for confirmation and the user hears nothing for a week. **Sending both is a duplicate**, so one has to be chosen (`N-4`).

### 1-4. Decisions this work surfaced

| # | Item | Detail |
|---|---|---|
| **N-1** | **How many notifications per merged withdrawal** | A withdrawal is **one merged request** across CEX and DEX, but notifications go out **per account** (existing row 26 says *"Sent per UID"*). A three-account request sends three pushes. **Decide whether to batch them.** |
| **N-2** | **Mixed success and failure** | In a merged request where CEX succeeds and only the DEX leg fails on-chain, a success notification and a failure notification **arrive together.** The user cannot tell whether the withdrawal happened. |
| **N-3** | **RPC timeout copy** | The only failure mode where **it is unknown whether the transfer was sent.** Writing "please try again" invites duplicate-send requests. **It needs its own copy.** |
| **N-4** | **Lighter pending window** | When masked addresses collide, a wallet stays in Processing for **up to 7 days.** Row 100 (linked) and row 102 (confirmed) can be a week apart, so the on-screen state for that interval must be defined alongside. |
| **N-5** | **Settlement cadence differs sharply** | Row 103 fires **weekly** for Lighter and **hourly, rolled up** for ApeX. Decide whether the cadence belongs in the copy. |
| **N-6** | **Residual cashback when a DEX is dropped** | On CEX it sits in the exchange account, but **DEX cashback sits in the TetherMax balance**, so it must remain withdrawable after termination. Decide whether to set a **deadline.** |

---

## 2. Existing notifications that need a DEX branch — 12

**No new rows.** The existing rows branch on exchange type.

### 2-1. A variable substitution is enough

| FCM # | Title | Current text | DEX handling |
|---|---|---|---|
| 26 | 💡 Ready for withdrawal | `{exchange} {UID} cashback withdrawal is available.` | `{UID}` → `{wallet}`. **See the misfire below first** |
| 29 | 🏆 Cashback ranking event reward paid | `{UID} {amount} USDT …` | `{UID}` → `{wallet}`. DEX is eligible for event rewards |
| 31 | 💌 Invite reward paid | no identifier | usable as is |
| 36 | A friend you invited linked their UID | `UID` in both title and body | **needs a neutral word** if DEX wallet links count too |

#### ★ Row 26 — "you can withdraw now" is sent to people who cannot 🔴

The sheet's trigger reads:

> *"When the linked/owned UID reaches **50 or more** due to **commission updates and event reward payments**"*

That is a **plain sum of commission + event reward ≥ 50.** Actual eligibility is **`A + MIN(B, A) ≥ 10`** (A = exchange cashback, B = event reward).

| Account | Plain sum | Sent? | Actually withdrawable | Result |
|---|---|---|---|---|
| A = 0 · B = 992.44 | 992.44 | **sent** | `0 + MIN(992, 0)` = **0** | 🔴 **Receives "you can withdraw" and opens the modal to "There is no UID available for withdrawal"** |
| A = 5 · B = 232 | 237 | sent | `5 + MIN(232, 5)` = 10 | ✅ correct |

A live capture (`_캡처자료/_추가요청/D_사용자화면/D-1a`) shows exactly this — **exchange cashback 0.00 / event reward 992.44 / withdrawable 0.00.** **This misfire already happens on CEX.**

**DEX makes it far more common**, because the DEX funnel runs `link wallet → see events → join` — **earning an event reward before the first trade is the normal path, not the exception.**

> **Action** — change the trigger to `A + MIN(B, A) ≥ threshold`. Decide at the same time whether the 50 threshold stays (the withdrawal minimum is 10).

### 2-2. Titles whose `UID` does not hold for DEX

A DEX has no UID. **Pick one neutral word and use it across every notification.**

| FCM # | Current | Problem |
|---|---|---|
| 53·54 | `VIP {tier} has been assigned to the UID you requested` | Decide first whether VIP applies to DEX at all |
| 55 | `A linked UID is eligible to apply for VIP` | 〃 |
| 56 | `A linked UID may lose its VIP status` | 〃 |
| 97 | `(AD) Only {D} days left to join {exchange} MAX BOARD!` / body `Register your UID to join` | The Maxboard split documents contain **zero mentions of DEX across all 22 files** |
| 98 | `(AD) Join MAX BOARD with a new {exchange} UID!` | 〃 |

> ★ **Maxboard was designed without DEX in scope.** A board maps to one exchange (`REQ-001`), so a DEX board can be opened, but eligibility, reset and forfeiture are all built on **UIDs and ownership transfer** and do not hold as written. **The product decision comes before the notification copy.**

### 2-3. Invite rewards — the paths diverge ⚠️

| FCM # | Title | Caution |
|---|---|---|
| 32 | 💌 Invite reward withdrawn | **The member path now includes DEX wallets** (reversed in V2); **the partner path stays CEX-only.** One string cannot cover both |

> The bigger problem is that **the amount may be zero.** Invite reward = `downline withdrawal × exchange margin rate × reward ratio`, and **the DEX margin rate is undecided.** Set it to 0 and the DEX invite reward is permanently 0, so this notification never fires. See the 2026-10-22 entry in `확정_결정_기록`.

---

## 3. Does not apply to DEX — 2

Ownership verification is **confirmed unsupported** (A-16), so these never occur on DEX. **They remain in use on the CEX path.**

| FCM # | Title | Why |
|---|---|---|
| 24 | 💡 UID unlinked (`someone else was granted ownership`) | DEX has no ownership-transfer path |
| 25 | 💡 UID ownership confirmed | The claim itself is impossible |

> Earlier notes recorded **three** ownership notifications being dropped. Checking the live sheet, **FCM has two.** The third — a "rejected" notification — has no row of its own.

---

## 4. The email template — what DEX actually needs built

Based on the two live emails under `_캡처자료/_추가요청/E_알림_실물/` compared against the **Figma template library**.

### 4-0. ✅ Figma template library, checked (2026-10-22)

The email-template section of the `UI-UX-Design` file was gone through in full. **Two open questions are now closed.**

| Template | Note |
|---|---|
| `UID linked` | The baseline for the DEX version |
| **`UID link failed`** | ✅ **It exists.** `EMAIL row 31` stays |
| **`UID link failed (auto-reject, 2+ submissions)`** | ★ **A separate template.** Same body, different trigger |
| `UID unlinked` | For ownership transfer. **Does not apply to DEX** |
| **`Cashback withdrawal failed`** | The withdrawal-failure mail carries an extra **`Important notes` (anti-phishing) block** |
| `Google OTP unlink code` | Unrelated to DEX |

**Each template is drawn in five languages** (ko, en, tc, ru, vi confirmed). The sheet fills only ko and en, but **the design has all five.**

> 🔴 **This changes the effort.** The `8 new strings` in 4-5 is a **ko/en figure**. Matched to the templates it becomes **4 strings × 5 languages = 20**. **A choice is needed between following the sheet and following the templates** — they currently disagree.

**The live Korean copy** (the starting point for the DEX version)

```
Subject  UID 연동 완료
Body     UID가 테더맥스에 연동되었습니다. 자세한 내용은 다음과 같습니다.
         거래소   MEXC
         UID     1234567
         추가 지원이 필요한 경우 테더맥스 고객센터를 통해 문의하시기 바랍니다.
```

→ For DEX the two `UID` occurrences become **`지갑 주소`** and the value grows to 42 characters.

> **The Korean `페이백 출금 실패` template uses 페이백.** That is the live evidence for the terminology rule: Korean says 페이백, English says cashback.

> ⚠️ **The banner differs between the design and production.** Figma shows an illustration banner; the mail that actually ships uses the ambassador banner. Figma was not updated after the swap. **The conclusion is unchanged** — either way it is a shared asset unrelated to any exchange, so nothing new is drawn for DEX.

---

### 4-1. The shell is shared — nothing new to design

The login-code email and the UID-linked email use an **identical shell**.

```
┌─────────────────────────────────┐
│  Blue banner — ∞ TetherMax + ambassador │  ← shared; DEX keeps it
├─────────────────────────────────┤
│  H2 heading                      │  ← must change
│  One-line body                   │  ← must change
│  [ variable area ]               │  ← differs per email
│     login mail  → code box       │
│     linked mail → 2 label/value  │  ← this is the crux
│  Customer support link           │  ← shared
├─────────────────────────────────┤
│  4 socials · notice · © 2026     │  ← shared
└─────────────────────────────────┘
```

> **🟢 The banner does not need to be remade.** The ambassador banner is a brand asset unrelated to any exchange and works for CEX and DEX alike. **Zero new design assets.**

### 4-2. Four things change

| # | Where | CEX today | DEX |
|---|---|---|---|
| 1 | **Subject line** | `[TetherMax] UID Binding Success` | `[TetherMax] Wallet Binding Success` |
| 2 | **H2** | `UID linkage completed` | `Wallet linkage completed` |
| 3 | **Body** | `The UID has been linked to TetherMax. Here are the details.` | `The wallet has been linked to TetherMax. Here are the details.` |
| 4 | **Detail block label** | `Exchange` / `UID` | `Exchange` / **`Wallet address`** |

> **Item 1 matters most.** The subject is the only text visible **before** the email is opened. `UID Binding Success` arriving for a wallet link reads as somebody else's mail.

> 🟢 **The CEX mail is not touched.** All four places keep `UID` and the value stays a short numeric UID. **DEX is a separate template, not a modification of this one** — two mails, not one mail branching.

> **Keep the `Exchange` label.** Lighter and Aster are called "exchanges" everywhere else in the product; there is no reason for this one screen to differ.

### 4-3. 🔴 The value length breaks the block's assumption

```
CEX   UID              DEX   Wallet address
      1234567                0x7a3F9c2b4D8e1A5f6C0b3E2d9A8c7B6a5F4e3D21
      └ 7 chars              └ 42 chars (6×)
```

The block was built for **short values**. A 42-character hex string fits the desktop width (~580px) but **breaks on mobile**. Three things need specifying.

| # | Decision | Recommendation |
|---|---|---|
| 1 | Line breaking | `word-break: break-all` with a monospace face. An address has **no meaningful units**, so breaking anywhere is fine |
| 2 | Full vs masked | **Full.** The product UI shortens to `0x7a3F…c51E9`, but **an email is the record the member keeps** and its purpose is comparison. Masking defeats that |
| 3 | Font size | One step below body copy; keep the bold weight |

> **Item 2 contradicts the existing masking policy on purpose.** The CEX rows in the FCM sheet are annotated *"Last 4 digits of UID masked"*. **A push appears on a lock screen, so masking is right there; an email sits inside the member's own inbox**, which is a different bar. The two should not be decided together.

### 4-4. Chain label — a decision is needed

The same address exists on several chains at once. The block has no chain row today.

| Option | Detail | Assessment |
|---|---|---|
| A | **Add a row** (`Network` / `Arbitrum`) | Matches how the withdrawal email has to read. Uses whatever chain `D-2` settles on |
| B | Leave it out | The DEX fixes the chain at link time, so the information adds little |

> **Recommendation — A.** The withdrawal notification has to name a chain; if the link email alone omits it, the user cannot reconcile the two emails.

### 4-5. Effort

| Item | Count | Note |
|---|---|---|
| New **images** | **0** | Banner, socials and footer are all shared |
| New **strings** (ko/en) | **8** | 2 subjects + 2 H2s + 2 bodies + 2 labels — new language-pack entries. **20 if matched to the templates' five languages** (4-0) |
| **CSS** change to the block | **1** | Value area line breaking (4-3) |
| New **template files** | **1–3** | Linked / (failed) / (confirmed) — matching rows 30–32 |

---

## 5. What the backend has to wire up

The 12 DEX notifications **cannot reuse the existing triggers.** Every CEX notification originates from an internal TetherMax event (an admin approval, a ledger change); **half of the DEX ones arrive from outside.**

### 5-1. The triggers come from different places

| Origin | CEX | DEX |
|---|---|---|
| TetherMax internal | Link approval · withdrawal approval · ledger change | Withdrawal request accepted |
| **Partner API response** | — | **Wallet referral attribution confirmed** |
| **Partner webhook** | — | **Aster 30-days-to-expiry · expiry** |
| **Weekly CSV** | — | **Lighter pending released · abuse withheld** |
| **On-chain transaction receipt** | — | **Withdrawal delivered · transfer failed** |

### 5-2. Six new connections

| # | Connection | Fires | Note |
|---|---|---|---|
| 1 | **Partner referral attribution response** → linked / failed | FCM 100·101 · EMAIL 30·31 | Synchronous. The rejection reason must come through split into **permanent vs retryable**, or the copy cannot branch |
| 2 | **Lighter weekly CSV parser** → pending released | FCM 102 · EMAIL 32 | Mondays only. Up to seven days of lag |
| 3 | **Lighter weekly CSV parser** → `Withheld` verdict | FCM 106 | Same file, **opposite outcome** |
| 4 | **DEX settlement received → ledger** | FCM 103 | Cadence differs per exchange — Lighter weekly (Mon) · EdgeX daily (00:00 UTC) · Aster daily (after 09:00 UTC) · ApeX hourly |
| 5 | **On-chain receipt check** | FCM 104·105 | Both outcomes. **An RPC timeout is a third state** — neither success nor failure — and needs its own handling (`N-3`) |
| 6 | **Aster expiry webhook (R8)** | FCM 107·108 · EMAIL 26·27 | Once per binding, twice: 30 days out and at expiry |

### 5-3. 🔴 What breaks when the identifier changes

**DEX has no UID; it only has a wallet address.** Anything in the notification payload built around `{UID}` is affected.

| # | Item | Detail |
|---|---|---|
| 1 | **Variable name** | `{UID}` → `{wallet}`. This is **why the CEX and DEX rows were kept separate** (row 100 vs row 22). Branching inside one row would require renaming the variable to something neutral |
| 2 | **Masking rule** | CEX masks *"the last 4"*; DEX needs **first 6 + last 4** (`0x7a3F…c51E9`). Showing only `0x` identifies nothing |
| 3 | **Length limits** | Push bodies are length-capped per platform. A full 42 characters **truncates the exchange name and the amount** → pushes must mask |
| 4 | **Case sensitivity** | An EIP-55 checksummed address carries meaning in its capitalisation. **Normalising to lowercase on store and restoring on display** makes it look different from what the user compares against |
| 5 | **Deep links** | Column `L` (in-app route) points at the UID detail page for CEX. DEX needs its own **wallet detail route** |

### 5-4. Consent

| Kind | Consent required | New DEX rows |
|---|---|---|
| `Essential` | No | FCM 100–108, **all** |
| `- (Sent regardless of consent)` | No | EMAIL 26–32, **all** |

> **Every DEX notification is a service notice.** They must go out regardless of marketing consent — a failed link, a failed withdrawal and an expired referral all have to reach members who never opted in.

---

## 6. Next

| Priority | Item |
|---|---|
| 🔴 | **Row 26 misfire** — correct the trigger to `A + MIN(B, A)`. **It already happens on CEX, and DEX makes it common** |
| 🔴 | **N-1 · N-2 merged-withdrawal notification policy** — per account or batched, and how to present mixed success and failure |
| 🔴 | **Set the DEX margin rate** — without it the invite-reward notification (row 32) never fires |
| 🟠 | **Settle the neutral word for `UID`** — notifications, email subjects and the link modal must all use the same one |
| 🟠 | **Decide when the linked email fires — at link time or at confirmation** — row 30 vs row 32. Sending both is a duplicate |
| 🟠 | **Decide whether the email shows the full wallet address** — judge this separately from the push masking rule (4-3) |
| 🟠 | **Follow the sheet (2 languages) or the templates (5)?** — they currently disagree (4-0) |
| 🟡 | **Copy for the auto-reject mail on DEX** — CEX reuses the same body, but DEX has no ownership path so the guidance differs (4-0) |
| 🟠 | **Decide whether Maxboard applies to DEX** — the product decision comes before the copy. **VIP is closed** (out of scope, 10-22) |
| 🟡 | tc · ru · vi translation — the existing CEX rows are empty too, so this looks like a separate process |
