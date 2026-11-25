# TetherMax → EdgeX — Confirmation of Alignment Points, and Remaining Items

Date: 20 October 2026
From: TetherMax
Reference: EdgeX × TetherMax Alignment (D1–D9), sent 8 October 2026, in reply to TetherMax Partner Integration Requirements v1.1

---


## Summary

Thank you for the detailed alignment document, and apologies for the delay in coming back to you.

**This note confirms points 1 to 8.** Point 9 we already withdrew on 13 October.

We also have four items to add, and answers to your next steps.

| Section | Content |
|---|---|
| 1 | Our confirmation on D1–D8 |
| 2 | Four items we would like added |
| 3 | Answers to your next steps — account registration and testnet |
| 4 | One commercial item still open |

---

## 1. Our confirmation on D1 to D8

### D1 — Rebate and commission, one shared rate · **Confirmed**

We accept the shared-rate model. Trader rebates and TetherMax's commission both come from `fee × partnerRate`, and we decide the trader's share.

Your worked example matches our understanding: with `partnerRate` 60%, A on a 30% code who invited B at 10%, A receives 38, B receives 10, and TetherMax keeps 48, totalling 96 = 160 × 60%.

The `partnerRate` value itself is a commercial item — see section 4.

### D2 — Rates set by TetherMax, no tiers · **Confirmed**

We accept that:
- EdgeX sets `partnerRate` in the partner console
- We set each downline user's rate there, never above `partnerRate`
- Each referral code carries its own `registrationRate`
- Rates never move up automatically with volume
- `registrationRate` replaces the rebate tier in referral validation

**We will display each trader's rate from `rebateRate` and never overstate it.** We will also treat `user.rate_changed` as the signal to refresh a displayed rate.

### D3 — Attribution scope, the whole team · **Confirmed, with one request**

We accept whole-team attribution. Please return `isTethermaxReferral: true` for the whole team with `level`, and we will store `level`, `referrerUserId` and `referralCode` and filter as needed.

We also note that **only users who completed sign-up are returned**, and that a wallet which connected but did not sign up is not attributed. That matches how we handle it: a wallet we cannot confirm is held, not linked.

### D4 — Rebate amount includes the downline override · **Confirmed, and one request**

We understand the four amounts and that `rebateAmount` can exceed `feeBasis × rebateRate` for a member who invited others.

**We will display only `selfRebateAmount` as the member's cashback.** `rebateAmount` and `downlineRewardAmount` will be used for reconciliation only.

**Our request:** we would like EdgeX to **disable member-to-member referral overrides for the TetherMax team.** Two reasons.

1. **It contradicts a rule we state to our users.** TetherMax pays no referral or invite rewards on decentralised exchange activity. If a member on our team earns a downline override, a user would be earning referral income inside our programme, which is exactly what we tell them does not happen
2. **It comes out of the same `partnerRate` pool**, so it reduces our commission

With overrides disabled, `rebateAmount` equals `selfRebateAmount`, `totalPaidAmount` matches what we display, and our reconciliation becomes materially simpler.

**If this is not possible, please tell us** — we will keep displaying `selfRebateAmount` only, and treat the difference as an internal reconciliation item.

### D5 — No withdrawable balance · **Confirmed**

We accept this fully, and we understand why: once paid, the rebate is part of the member's margin and cannot be told apart, and an account's withdrawable amount belongs to the account owner.

Our cards will show:
- **"Paid to your EdgeX account"** = `totalPaidAmount`
- **"On the way"** = `accruingAmount` + `pendingAmount`

instead of an available or withdrawable figure. We will not present a withdrawable amount for EdgeX anywhere.

### D6 — Record id · **Confirmed**

We will use the EdgeX rebate record `id` as our key, and `collateralTransactionId` and `transferId` as the reference against the trader's account.

We have also accounted for amounts below 0.01 USDC and failed payouts rolling over, so that one payout can cover several records sharing a `collateralTransactionId`. Those records stay in "On the way" on our side until a payout covers them.

We note that `FILL_FEE_INCOME` is fee income on EdgeX's fee account and not an entry on the trader's account, and that the rebate reaches the trader as `TRANSFER_IN`.

### D7 — Commission paid daily · **Confirmed, with one question**

Daily automatic payment in USDC to TetherMax's EdgeX perpetual account works for us.

**Question for your side:** our finance team asks whether EdgeX normally provides an **invoice or other statement document** in addition to the daily commission records and the monthly statement. Could you tell us what you usually provide to partners? We will adapt to your standard process.

### D8 — Daily settlement at 00:00 UTC · **Confirmed**

Daily settlement works for us. We roll periods up to the UTC day for display, so the change from the hourly example in our requirements document does not affect what the trader sees.

We have set our "data delayed" rule to follow this cadence: we expect the previous UTC day's records to be available by 01:00 UTC, and we treat the feed as delayed if they have not arrived by a threshold after that.

### D9 — Wallet sign-in records · **Withdrawn**

As confirmed on 13 October, this is out of scope. Disputes over a wallet claimed by two members are handled by our support team. No action needed from EdgeX.

---

## 2. Four items we would like added

### 2-1. A bulk referral list API — **important to us**

Raised by our engineering team on 19 October.

**The daily commission records only include members who traded that day.** That leaves us unable to see members who are attributed to us but did not trade — and we need to see them, for three reasons:

| Why | Detail |
|---|---|
| **Linking** | When a trader pastes their EdgeX wallet address on TetherMax, we must confirm it belongs to our team. If they have not traded yet, they appear in no commission record |
| **Display** | A linked wallet with no cashback is a normal state. We need to tell it apart from "not attributed to us", which is an error state with completely different messaging |
| **Reconciliation** | We cannot reconcile a team we cannot enumerate |

The attribution lookup by `ethAddress` covers the single-user case, but we also need a **paginated list of all accounts attributed to TetherMax**, regardless of trading activity, returning at minimum `ethAddress`, `userId`, `accountId`, registration time, `rebateRate`, `level`, `referrerUserId` and `referralCode`.

### 2-2. The API specification itself

Also raised on 19 October. We have your design, but **not yet the actual endpoints, authentication, parameters or response formats.**

We understand from your next steps that this comes once we confirm the alignment points — which this note does. We would be glad to receive it now.

For planning, we assume authentication with `X-edgeX-Api-Key`, `X-edgeX-Passphrase`, `X-edgeX-Timestamp` and an HMAC-SHA256 `X-edgeX-Signature`, from allowlisted IPs. Please correct us if that is wrong.

### 2-3. Webhooks for new attribution and Pending → Paid

Your design describes `user.rate_changed`. We also need two pushes:

| Event | Payload we need | Why |
|---|---|---|
| **New attribution** | `ethAddress`, `userId`, `accountId`, registration time, unique `eventId` | This is where we first learn which account receives rebates for a given wallet. The member never types it |
| **Rebate Pending → Paid** | `ethAddress`, `userId`, `accountId`, record `id`, `payoutId`, previous and new state, updated time, unique `eventId` | So a trader sees the state change without waiting for our next poll |

We ask that pushes are signed and retried with backoff for 24 hours until we reply HTTP 200, and that each carries a unique `eventId` so we can deduplicate.

If webhooks are not available at launch, polling works — we would simply like to know, so we design for it.

### 2-4. Reversals and restrictions

**Reversals.** How is a correction or reversal of a daily record represented? We expect a new record referencing the original `id`, never a mutation. Our ingestion treats records as immutable and finalises a day 48 hours after it closes.

**Restrictions.** `geoRestrictions` and `otherRestrictions`, such as campaign periods, published in advance. This is our lowest priority.

---

## 3. Your next steps — our answers

### 3-1. Register a main account

Understood. We will register an EdgeX account to serve as TetherMax's main account, used to receive and withdraw commission, sign in to the partner console, and hold the API credentials.

**We will send you the account's wallet address separately** so you can enable partner access.

### 3-2. Joint testing

Yes, please — a testnet environment would help.

**How we plan to test.** We have our own staging environment. We will verify, in this order:

1. **Attribution** — paste a wallet on our staging site, call the attribution lookup, confirm `userId`, `accountId`, `rebateRate` and `level` come back and that a non-attributed wallet is correctly rejected
2. **Daily records** — confirm a day's record appears by 01:00 UTC with the expected amount fields, and that our ingestion is idempotent on the record `id`
3. **State transition** — confirm Pending → Paid and that `payoutId`, `transferId` and `collateralTransactionId` arrive
4. **Roll-over** — confirm an amount below 0.01 USDC stays pending and is later covered by a payout
5. **Rate change** — confirm `user.rate_changed` updates the displayed rate
6. **Reconciliation** — confirm our totals match yours for a test period

**What you asked for from us**
- Egress IPs we will call the API from — **we will send these with the wallet address**
- Email addresses of the people testing — **same**
- A matching test account on testnet — we will register one

---

## 4. One commercial item still open

**The `partnerRate` value.** We accept the model (D1); the number is being agreed between our BD teams. We will come back to you on this separately, and it does not block the technical work above.

---

## Jurisdictions — not blocking

Two questions that affect where we show your programme on TetherMax. Neither blocks integration.

| # | Question | Why we ask |
|---|---|---|
| 1 | Are there jurisdictions where you require that we **not** refer users to you? | We filter partner visibility by the user's country and would rather apply your list than guess. |
| 2 | Can you share the list of countries where you do not offer service? | Same purpose. This would be the initial value of that filter. |

A short answer to each is enough.

---

## Our data rules, for reference

So you can see how we will treat your data.

| Rule | Detail |
|---|---|
| Keys | `ethAddress` + `accountId` keys the account; the EdgeX record `id` keys the record |
| Immutability | Records are never mutated. A correction is a new record referencing the original |
| Finality | One record per member per UTC day, dated to the day it covers. Final 48 hours after the day closes unless a correction follows |
| What members see | `selfRebateAmount` as their cashback, `rebateRate` as their rate |
| Currency | Rebates and commission are USDC. We display them to members as USDT at 1:1 face value. **Records without a coin are rejected** |
| Wallet addresses | Lowercase hex, compared case-insensitively. We validate every partner-supplied address with the same rule we apply to trader input. An invalid address is never matched, corrected or dropped silently — it is held for review and reported back to you |
| Personal data | We ask for none. No names, emails, IP addresses or KYC data |
| Lookback | Up to 180 days for data queries |

### Reconciliation checks we will run

| Level | Check |
|---|---|
| Per record | `selfRebateAmount = feeBasis × rebateRate`, and `rebateAmount = selfRebateAmount + downlineRewardAmount` |
| Per payout | The sum of `rebateAmount` over records sharing a `payoutId` equals the transfer identified by `transferId` and `collateralTransactionId` |
| Per account | `totalPaidAmount` equals the sum of Paid records; `pendingAmount` equals the sum of settled, unpaid records |
| Commission | Each day's `partnerCommissionAmount` across members equals that day's commission record |
| Per month | The sum of records per coin equals the monthly statement |

**Unmatched records are held for review and reported back to you weekly**, never dropped. Either side may raise a discrepancy within 30 days of the statement, quoting the record `id`.

---

## Manual fallback, if the API is not ready at launch

A daily CSV by 02:00 UTC to a shared, access-controlled folder, with these columns:

```
id, ethAddress, userId, accountId, periodStartTime, periodEndTime,
feeBasis, rebateRate, selfRebateAmount, downlineRewardAmount,
rebateAmount, partnerCommissionAmount, coinSymbol, rebateState,
paidTime, payoutId, transferId, collateralTransactionId
```

Payment fields may be blank until paid. Our upload tool rejects any row whose `coinSymbol` is not USDC, or whose `id` or `accountId` is missing.

---

## Security

- Our access is a **read-only partner key** — no trading, transfer or withdrawal capability
- Keys are held in TetherMax's secure key store and used from allowlisted IPs
- No wallet address, `userId` or `accountId` appears in a user-facing URL, an analytics event or an externally visible log line
- **TetherMax never asks a trader for a private key, a seed phrase or a wallet signature.** Traders paste their public wallet address and nothing else. We would appreciate EdgeX stating the same in any co-branded material

---

## Service levels we are requesting

| Item | Target |
|---|---|
| API availability | 99.5% monthly |
| Rebate records available | By 01:00 UTC after each daily settlement |
| Rebate payout to the member's EdgeX account | Between 00:00 and 01:00 UTC each day |
| Notice of a breaking API change | 30 days |
| Notice of a change to settlement currency, `partnerRate` or restrictions | 14 days |
| P0 incident acknowledgement | Within 1 hour, 24/7 |
| Support channel | A shared Telegram group plus a named engineering contact on each side |
| Lookback for data queries | Up to 180 days |

---

## What we need, in order

| Order | Item | Blocking? |
|---|---|---|
| 1 | **The full integration document** — endpoints, authentication, signing, push formats, reconciliation | **Yes** |
| 2 | **Partner API key** scoped to TetherMax's team accounts, read only | **Yes** |
| 3 | **Bulk referral list API** (section 2-1) | **Yes** |
| 4 | Testnet access | **Yes** |
| 5 | Webhooks for attribution and Pending → Paid | High |
| 6 | Reversal representation | Medium |
| 7 | Restrictions API | Low |
| 8 | `partnerRate` value | Commercial, parallel track |

---

## Next step

The alignment points are confirmed. Please send the full integration document and the testnet plan whenever you are ready, and we will come back with the wallet address, egress IPs and tester emails so you can enable partner access.

Thank you for your patience while we worked through this.
