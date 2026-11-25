# TetherMax ↔ Aster — Integration Requirements, Follow-up

Date: 20 October 2026
From: TetherMax
Reference: TetherMax ↔ Aster cashback integration requirements v1.3

---

## Summary

We sent our integration requirements (v1.3) and have not yet received a response. We would like to **confirm receipt and agree a timeline.**

Our understanding of what Aster offers today:
- Reading a referred user's **fees** is possible through the Builder API for approved users
- Reading **rebates** is available to the account owner only
- There is no documented way for TetherMax to read the rebates of users referred under our code

That last point blocks our launch, so we would like to agree an approach with you.

**Two items deserve attention early.**

**The 365-day binding.** Aster binds a referred address to a referrer for 365 days by default. Without a renewal path, **every TetherMax trader on Aster stops earning cashback through TetherMax after one year.** Separately, we need to read the remaining days at any time in order to warn the trader before expiry — which requires `bindExpireTime` on every lookup, not only at binding. Both parts are item 9 below.

**The 20,000 USDT monthly cap.** We have noted it. We would like to understand what happens to rebates once the cap is reached mid-month, and whether we can read how much of it has been used. This is F5 below.

P0 blocks launch. P1 is needed within 30 days of launch. P2 is nice to have.

---

## Blocking items — P0

### 1. Partner access to referred users

We need **read-only access** to the accounts referred under TetherMax's referral, plus a **testnet environment** for our QA.

Two options appear possible from your documentation:

**(a)** Return referral-bound users the way the Builder approved-user list works (`GET /fapi/v3/builder/approvedUser`), or

**(b)** TetherMax registers as a builder with a **builder fee of zero**, which users approve at sign-up

**Please tell us which you prefer.** In either case our access must be read only, with no trading, transfer or withdrawal capability.

### 2. Look up a wallet address and return its attribution

An endpoint that takes a wallet address and returns:

| Field | Purpose |
|---|---|
| `isTethermaxReferral` | Whether the address joined through our referral |
| `bindTime` | When the binding was created |
| `bindExpireTime` | When it expires |
| `rebateRate` | The rate that applies to this address |
| Internal user id, if one exists | Stored for reconciliation only |

We proposed `GET /fapi/v3/referral/userStatus?address=`. **The path is a proposal; the fields are what we need.**

### 3. Rebate records per address and settlement day

One record per address, asset and settlement day, carrying:

```
tranId, address, incomeType, asset, feeBasis, income,
payoutPrice, priceTime, usdtValue, feeBasisUsdt,
settlementDay, state (PENDING or PAID), time
```

`tranId`, or an equivalent permanent id, is the key we use for reconciliation and disputes.

### 4. `usdtValue` on every record, statement row and webhook

**This is the single most important item in this document after partner access.**

Aster pays rebates in the fee asset — USDT, USD1, USDC, USDC.e, ETH, BTC, BNB, USDF, asBNB and others. **TetherMax does not convert between assets.** We use only **Aster's own USDT equivalent at payout time** for display, totals, statements, reconciliation and webhooks. We keep the original asset and amount for audit only.

We therefore need **`usdtValue`, with `payoutPrice` and `priceTime`**, on:
- every rebate record
- every monthly statement row
- every webhook payload

**A record without `usdtValue` is rejected by our ingestion.** We cannot display it, because we have no price of our own to apply.

### 5. Rebate balance per address, in USDT equivalent

So that we can show the trader what is still held on Aster.

### 6. Referral code validation

An endpoint that validates that a TetherMax referral code or link is approved by Aster, returning `isValid` and the rebate tier. We call it before publishing a link.

---

## Needed within 30 days of launch — P1

### 7. Monthly rebate and commission statement

In USDT equivalent, whose total equals the sum of `usdtValue` across that month's records.

### 8. Partner webhooks

Three events, each carrying the address, event type, previous and new state, the original asset and amount, `usdtValue`, `payoutPrice`, `priceTime`, `tranId`, the time and a unique `eventId`:

| Event | When |
|---|---|
| **New binding** | A trader binds our referral, including a renewal or re-bind |
| **Binding about to expire** | 30 days before `bindExpireTime` |
| **Rebate paid** | A rebate moves to Paid |

We ask that pushes are signed, and retried with backoff for 24 hours until we reply HTTP 200.

### 9. The 365-day binding — renewal, and reading the remaining days

**This is the item with the largest commercial impact, and it has two parts.**

#### 9a. Renewal (P1)

You bind a referred address to TetherMax for 365 days by default (`bindExpireTime`). Without a renewal path, every trader we refer stops earning cashback through TetherMax after one year, and we have no way to restore it.

Either of the following resolves it:

**(a)** Keep TetherMax bindings active while the trader keeps trading, or

**(b)** Let the trader re-bind the TetherMax referral code after expiry

In either case, please return the new bind time and expiry, and send the binding webhook so we can restore the account to active.

#### 9b. Reading `bindTime` and `bindExpireTime` on every lookup — **P0**

We show the trader how many days remain before their binding expires, so they can renew in time. To do that we need the expiry to be **readable at any moment, not only at the moment the binding is created.**

**Please confirm that the attribution lookup (looking up a wallet address) always returns `bindTime` and `bindExpireTime`, whenever we call it.**

Your product manager's reply listed the referred-user detail endpoint as returning "wallet address, account ID, **registration date**, qualified-referee flag, and current discount or commission eligibility state". **Registration date is not the same as the binding expiry**, so we would like to confirm this specific point.

**Why this matters to us, concretely.**

On TetherMax, a wallet address is linked to a TetherMax account, and that link can change over time — a trader can remove a wallet and add it again, or a different TetherMax account can take over the wallet after an ownership dispute. The binding itself lives on your side, between the wallet and Aster, and is unaffected by any of this.

So there are two possible designs, and which one we build depends on your answer:

| If Aster returns the expiry on every lookup | If Aster only sends it once, at binding time |
|---|---|
| We read `bindExpireTime` whenever we need it and always show the correct remaining days | We can only record what we happened to receive, at the moment we received it |
| A wallet moving between TetherMax accounts is a non-issue — we simply look it up again | A wallet that moves to a different TetherMax account loses its expiry information, and we would have to count from the date **we** first recorded it, which is not the real binding date |
| Correct for wallets that bound before they ever linked to TetherMax | **Wrong** for any wallet that bound to Aster before it ever appeared on TetherMax |

The second case produces a visibly wrong countdown for the trader, and we would rather avoid it.

**What we are asking for, in order of preference**

1. `bindTime` and `bindExpireTime` returned on **every** attribution lookup by wallet address — this resolves it completely
2. Failing that, a bulk endpoint we can poll to refresh expiry dates across all our referred wallets
3. Failing that, confirmation that the binding is always exactly 365 days from a `bindTime` that you do return, so we can compute the expiry ourselves

---

## Nice to have — P2

### 10. Restricted regions and platform rules

`geoRestrictions` and `otherRestrictions`, such as campaign periods, published in advance.

### 11. Ownership confirmation flag · **Withdrawn**

We had asked whether a wallet signed in to Aster within a time window, to help us settle disputes over a wallet claimed by two members. **We have taken ownership claims out of scope for this release, so we are withdrawing this request.** No action needed.

---

## Questions

1. **Does the attribution lookup return `bindTime` and `bindExpireTime` every time we call it?** (item 9b — our most important question)
2. Can referral-bound users be returned like the Builder approved-user list, or should TetherMax register as a builder with a zero fee that users approve at sign-up?
3. Is `tranId` unique across income types for a user, or only within one income type?
4. **Can a rebate be reversed, and how is that shown?** We expect a new record referencing the original, never a mutation.
5. **Which price does Aster use for the USDT equivalent — mark, index or spot — and at what moment of the payout?** Can you confirm the USDT equivalent is fixed once paid and never recalculated?
6. On renewal (item 9a): will you keep TetherMax bindings active while the trader keeps trading, or let the trader re-bind after expiry?
7. Does Aster hold an internal user or account id that it can return?

### Follow-ups from our earlier discussion

Your product manager's reply raised six points. We have numbered them **F1 to F6** so they are not confused with items 1 to 11 above. Four need an answer from you; **F4 and F6 we are simply confirming back to you.**

**F1. Settlement period — one hour or one day?**

Your reply said *"time period is 1h"* for the commission and cashback ledger. Our requirements document assumed a daily settlement day, with records published at 09:00 UTC the following day.

Please confirm which is correct, because it changes how we display the data:

| If hourly | If daily |
|---|---|
| We roll hourly periods up to the UTC business day for display | We show one record per day directly |
| We poll more frequently | We poll once a day after publication |
| Our "data delayed" threshold is a few hours | Our threshold is the day after settlement |

**F2. Pending amounts**

Your reply said *"pending amount is not easy to provide"*. We understand.

If Pending is genuinely unavailable, we will show **only Paid amounts** to the trader and treat everything else as not yet reported. We would simply ask that you confirm this, so we design for it rather than leaving an empty field. A record's `state` at the moment we read it is enough; we do not need a running pending balance.

**F3. Where payouts land**

Your reply said *"all paid on Aster chain perp/spot account"*. We have reflected this: our interface tells the trader their cashback is already in their Aster account and links them there to withdraw. Please correct us if a trader could receive it somewhere else.

**F4. The "wallet-to-account lookup" item**

Your reply said this one was unclear, which is our fault for how we phrased it. What we meant is simply: **when a trader pastes their Aster wallet address on TetherMax, we need to confirm it belongs to our referral and get back whatever identifier you use for that account.** Since Aster has no separate account ID and the address is the account, item 2 above covers it, and this item can be dropped.

**F5. Monthly payout cap**

We noted the agreed cap of **20,000 USDT per month**, program-wide, reassessed before month-end based on volume, with a 7-day review period.

Two questions so we handle it correctly on our side:
- **When the cap is reached mid-month, what happens to further rebates?** Are they stopped, deferred to the following month, or reduced proportionally?
- **Can we see how much of the cap has been used?** If there is a field or endpoint for this, we would like to read it so we can monitor it and raise it with you before the cap binds.

**F6. Referral link generation**

We understand a referral link can only be generated when the account balance is above zero. This is now resolved on our side. We mention it only so it can be documented for future partners.

---

## How we handle binding expiry today

So that our behaviour is transparent to you:

| Stage | What TetherMax does |
|---|---|
| **30 days before expiry** | On receiving your expiring-binding webhook, we show "Referral expires on {date}" on the trader's Aster account and notify them once, with renewal steps only if renewal is available |
| **At expiry** | We mark the account "Referral expired" instead of "Active" and stop expecting new rebate records for it |
| **After expiry** | The address stays linked, so the trader keeps their history. Rebates earned before expiry stay visible in their cashback summary and are still withdrawn on Aster. **Records dated after `bindExpireTime` are held for review and reported back to you, not shown to the trader** |
| **On renewal** | We set the account back to active from the new bind time. Rebates for the gap between expiry and renewal are not attributed to TetherMax |

---

## Jurisdictions — P2

Two questions that affect where we show your programme on TetherMax. Neither blocks integration.

| # | Question | Why we ask |
|---|---|---|
| 1 | Are there jurisdictions where you require that we **not** refer users to you? | We filter partner visibility by the user's country and would rather apply your list than guess. |
| 2 | Can you share the list of countries where you do not offer service? | Same purpose. This would be the initial value of that filter. |

A short answer to each is enough.

---

## How the programme works, as we understand it

| # | From | To | Step |
|---|---|---|---|
| 1 | Trader | Aster | Signs up via the TetherMax referral link; Aster binds the address under TetherMax's referral for 365 days by default |
| 2 | Trader | TetherMax | Pastes their Aster wallet address |
| 3 | TetherMax | Aster | Looks up the address |
| 4 | Aster | TetherMax | Confirms attribution and returns the bind time and expiry |
| 5 | Trader | Aster | Trades in their chosen margin asset; Aster calculates fees and the rebate |
| 6 | Aster | TetherMax | Exposes rebate records per address and day, each with its USDT equivalent at payout |
| 7 | Aster | Trader | Pays the rebate in the fee asset into the trader's Aster account the following day |
| 8 | Aster | TetherMax | Pushes the paid rebate with its `tranId` and USDT equivalent |
| 9 | Trader | TetherMax | Views cashback and selects "Withdraw on Aster" |
| 10 | TetherMax | Trader | Opens Aster in a new tab |

**TetherMax never holds or moves a trader's funds.** We display what Aster reports and link the trader to Aster.

In Aster's income history the rebate appears as `REFERRAL_KICKBACK` or `COMMISSION_REBATE`.

---

## Identifiers

Aster has **no separate account ID**: the wallet address is the account, and each sub-account has its own address. We therefore key Aster records on **venue + address**, and treat each sub-account address as a separate linked account. Aster's internal `userId` is stored only if Aster returns one.

The main wallet address is EVM today. If Aster supports Solana addresses for the same programme, please tell us — we would need to define a separate validation rule before we can accept them.

---

## Manual fallback until the ledger API is live

If the rebate API is not available at launch, please send a **daily CSV after 09:00 UTC** to a shared, access-controlled folder, with these columns:

```
tranId, address, settlementDay, incomeType, asset, feeBasis,
income, payoutPrice, priceTime, usdtValue, state, time
```

`time` may be blank if not yet paid. **Our upload tool rejects any row without a USDT equivalent.**

---

## Data rules on our side

| Rule | Detail |
|---|---|
| Record key | Venue + address. Each sub-account address is a separate account |
| USDT equivalent | We use only `usdtValue`. The original asset and amount are kept for audit. **Records without `usdtValue` are rejected** |
| Immutability | Records are never mutated. A correction is a new record referencing the original |
| Finality | Records for a settlement day are final 48 hours after Aster publishes them at 09:00 UTC, unless a correction follows |
| Attribution window | A rebate record is attributed to TetherMax only if its trade time falls between `bindTime` and `bindExpireTime`. **Records outside that window are held for review** and reported to you |
| Wallet addresses | Lowercase hex, compared case-insensitively. We validate every partner-supplied address with the same rule we apply to trader input. An invalid address is never matched, corrected or dropped silently |
| Personal data | We ask for none |
| Lookback | Up to 180 days for data queries |

---

## Reconciliation

- Records are matched to a member through the linked wallet address
- **Unmatched records are held for review and reported back to you weekly**, never dropped
- At month end, the sum of `usdtValue` must equal the monthly statement in USDT. Original asset amounts are kept for audit but not reconciled separately
- Either side may raise a discrepancy within **30 days** of the statement, quoting the `tranId`

---

## Security

- Our access is a **read-only agent** — no trading, transfer or withdrawal capability
- Keys are held in TetherMax's secure key store and used from allowlisted IPs
- No wallet address appears in a user-facing URL, an analytics event or an externally visible log line
- **TetherMax never asks a trader for a private key, a seed phrase or a wallet signature.** Traders paste their public wallet address and nothing else. We would appreciate Aster stating the same in any co-branded material

---

## Service levels we are requesting

| Item | Target |
|---|---|
| API availability | 99.5% monthly |
| Rebate records available | By 09:00 UTC the day after each settlement day, in line with Aster's referral page |
| Notice of a breaking API change | 30 days |
| Notice of a change to the USDT price source, rebate rate, binding period or restrictions | 14 days |
| P0 incident acknowledgement | Within 1 hour, 24/7 |
| Support channel | A shared Telegram group plus a named engineering contact on each side |
| Lookback for data queries | Up to 180 days |

---

## Build priority, in order

This is **our** implementation order, not a list of further asks. It includes items you have already confirmed as available, because we still have to build against them. The priority column is how critical each item is to our build.

| Order | Item | Priority |
|---|---|---|
| 1 | Partner access to referred users — Builder access or a referral-scoped agent, plus testnet | **P0** |
| 2 | Lookup by address returning `isTethermaxReferral`, **`bindTime` and `bindExpireTime` on every call** (item 9b) | **P0** |
| 3 | Rebate income records with state, fee basis and a permanent `tranId` | **P0** |
| 4 | `usdtValue`, `payoutPrice` and `priceTime` on every record, statement row and webhook | **P0** |
| 5 | Rebate balance per address in USDT equivalent | P0 |
| 6 | Rebate rate per referred address (the `rebateRate` field in item 2) | P0 |
| 7 | Referral code validation | P0 |
| 8 | Partner webhooks for binding, expiry and paid rebates | P1 |
| 9 | Monthly statement in USDT equivalent | P1 |
| 10 | **Renewal or re-binding after the 365-day expiry** | P1 |
| 11 | Restricted regions and other restrictions | P2 |

---

## Next step

We would appreciate confirmation that this reached the right team, and an indication of which of items 1 to 6, and item 9b, are feasible — those are the ones that block our launch. We are happy to walk through any of this on a call.

We would also like to agree a named engineering contact on each side and set up a shared Telegram group.
