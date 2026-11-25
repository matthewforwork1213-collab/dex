# TetherMax ↔ ApeX — Outstanding Integration Items

Date: 20 October 2026
From: TetherMax
Reference: TetherMax ↔ ApeX cashback integration requirements v1.6, and ApeX's "ApeX Omni New Affiliate API information"

---

## Summary

Thank you for the affiliate API specification. We have mapped each of our v1.6 requirements to it, and most are covered.

Seven items remain open. **Four of them block our launch**, because without them we cannot render a cashback figure to a trader at all.

| Priority | Item |
|---|---|
| **P0** | 1. Ledger record fields — the cashback amount, wallet address, token and paid time |
| **P0** | 2. Account ID |
| **P0** | 3. Authentication method and base URL |
| **P0** | 4. Webhook events and payload |
| P1 | 5. Reversals and corrections |
| P1 | 6. Special events rates |
| P1 | 7. Lookup key behaviour |

P0 blocks launch. P1 is needed within 60 days of launch, as written in our v1.6 draft.

---

## 1. Ledger record fields — P0

Your specification lists `commission_state`, `reward_period`, `fee_basis`, `available_balance` and `record_id` on each ledger record.

It does not list four fields we need:

| Field | Why we need it |
|---|---|
| **The cashback amount** | This is the figure we show the trader. Without it there is nothing to display |
| **`wallet_address`** | We match records to a trader by the wallet address they pasted on TetherMax |
| **`token`** | We require a currency on every amount and reject records without one |
| **`payout_time`** | We show when the cashback reached the trader's Rewards Center |

**Could you confirm that each ledger record carries these four fields?** If any of them is named differently in your implementation, please tell us the field name.

Our engineering team raised the same point on 19 October — *"the commission API doesn't include the commission amount, rate, or user ID. Right now we can't tell how much commission each user earned."* We are restating it here because it is the single item that blocks our launch: without the amount, there is no number to put on the screen.

---

## 2. Account ID — P0

We key every DEX record on the wallet address **plus the DEX's own account ID**, because the same wallet can be used on several DEXs.

On 15 October you confirmed that the current Affiliate API returns both the wallet address and the UID, and that the upgraded Affiliate API will do the same. Thank you — that resolves the attribution lookup.

**What we would still like to confirm is that the same identifier appears on ledger records and webhook payloads**, not only on the attribution response. The written specification lists no `account_id` in any of the three places, so we want to be sure the upgrade covers all of them.

Two paths work for us:

**(a)** The account identifier (the `id` field we highlighted on 7 October) is returned on **API 2, every ledger record, and every webhook payload**.

**(b)** You confirm that **each wallet address maps to exactly one ApeX account**. In that case we will key ApeX records on the wallet address alone, as we do for Lighter, and no `account_id` is needed anywhere.

**Please tell us which applies.** Option (b) is simpler for both sides if it is accurate — and given that ApeX Omni has no sub-account mechanism, it may well be.

---

## 3. Authentication and base URL — P0

The specification does not state the authentication method or the base URL.

We propose:
- An API key with an **HMAC-SHA256 request signature**
- A timestamp rejected after **5 minutes**
- Requests from **allowlisted IPs**
- **TLS 1.2 or higher**

Please confirm this, or tell us your method, and provide the base URL.

---

## 4. Webhook events and payload — P0

Your specification states that ApeX pushes data at key milestones, and that receiving URLs and the IP whitelist are configured through our account manager. It does not list the events or the payload.

We need two events:

| Event | When | Payload we need |
|---|---|---|
| **New user attributed** | A trader's account is bound under TetherMax's referral tree. This is where we first receive the AccountID | `wallet_address`, `account_id`, previous and new status, updated timestamp, `record_id` where applicable, a unique `event_id` |
| **Commission Pending → Paid** | A commission record moves to Paid | `wallet_address`, `account_id`, `record_id`, previous and new status, updated timestamp, a unique `event_id` |

We also ask that:
- Pushes are **signed the same way as requests**
- Failed deliveries are **retried with backoff for 24 hours** until we reply HTTP 200
- Each push carries a **unique `event_id`**, so we can deduplicate

Please confirm the event list, the payload, the signing method and the retry policy.

---

## 5. Reversals and corrections — P1

How is a reversal or correction represented in the ledger?

**We expect a new record referencing the original `record_id`, never a mutation of the original record.** Our ingestion treats records as immutable and finalises them 48 hours after the period closes.

Please confirm your approach.

---

## 6. Special events rates — P1

`current_eligibility` returns cashback ratios for perpetual contracts, prediction markets and special events.

**Do the special-events rates change the cashback rate we should display to the trader?**

We display the trader's own cashback rate only, and we pay no event rewards to DEX traders. Unless you advise otherwise, we plan to exclude special-events rates from what we display, and to show only the perpetuals and prediction-markets rates exactly as you return them.

---

## 7. Lookup key behaviour — P1

API 2 accepts a wallet address or a platform UID. **We send only the wallet address the trader pasted.**

Please confirm that a lookup by wallet address returns **every attributed account** for that wallet.

---

## Points already settled in our discussions

Recorded here so our two sides are working from the same picture. Please correct anything we have misunderstood.

| Topic | Our understanding |
|---|---|
| **Cashback withdrawal stays with the user** | We accept your position fully. The claim is a user-initiated L2 signature in the Reward Center, and TetherMax will never hold or execute a user's signing. Our interface shows the trader what they have earned and links them to ApeX to claim it |
| **Deep link destination** | Based on your 14 October explanation, we point the trader to **`https://omni.apex.exchange/rewards`** to claim. We understand that moving funds out afterwards requires a Perp → Funding transfer and then a withdrawal, which happens entirely on ApeX |
| **No sub-accounts** | ApeX Omni has no sub-account mechanism, so one wallet does not fan out into several accounts the way it can on a CEX |
| **Bulk referral list** | Supported today through the Direct Client Query Interface |
| **Referral and affiliate systems are separate** | We understand they are being integrated, expected November, after which referral data will appear in the Affiliate API. **Our launch design assumes the affiliate route only**, so this is not a blocker for us — but we would appreciate advance notice of the change, since it will widen the set of users we see |
| **Default cashback rate 20%** | Noted. We will display whatever rate `current_eligibility` returns for a given trader, never a higher one |
| **VIP levels reduce fees** | Understood and accepted. A trader reaching a higher VIP tier pays lower fees, which reduces commission. This is normal and we will not present it as an error |
| **Korea access** | Noted that CDN nodes in Korea may be rerouted to Japan or mainland China, with slower speeds but full functionality. We have no comparable restriction from our other partners. If the situation changes, please let us know early — we would want to warn users rather than have them discover it |

---

## Jurisdictions — P2

Two questions that affect where we show your programme on TetherMax. Neither blocks integration.

| # | Question | Why we ask |
|---|---|---|
| 1 | Are there jurisdictions where you require that we **not** refer users to you? | We filter partner visibility by the user's country and would rather apply your list than guess. |
| 2 | Can you share the list of countries where you do not offer service? | Same purpose. This would be the initial value of that filter. |

A short answer to each is enough.

---

## What we already have from you

For reference, so you can correct us if we have misread anything. These need no further action.

| ID | Item | Status |
|---|---|---|
| R4 | USDT as the single settlement currency, never converted, with no multi-currency mixing | Covered |
| R6 | `available_balance` — the unclaimed, transferable balance in the trader's Rewards Center | Covered |
| R7 | Monthly statement for the previous calendar month, generated on the 1st at 00:00 UTC, with the ledger as CSV in a shared secure space | Covered |
| R9 | `current_eligibility` — cashback ratios per product | Covered |
| R10 | `geo_restrictions` and `other_restrictions` | Covered |
| R11 | Referral Validation API returning `is_valid` and `referral_info` | Covered |
| R3 | `record_id`, globally unique and immutable (for example `apx_cm_20261006_14_000184`) | Covered |
| R5 | Mainnet test accounts and API keys, simulated trading volume, triggered commission state changes, ticket support | Partly covered — authentication method still needed (item 3) |

---

## How the programme works, as we understand it

| # | From | To | Step |
|---|---|---|---|
| 1 | Trader | ApeX | Signs up via the TetherMax referral link; ApeX records the AccountID under TetherMax's referral tree |
| 2 | Trader | TetherMax | Pastes their ApeX wallet address |
| 3 | TetherMax | ApeX | Looks up the wallet address (API 2) |
| 4 | ApeX | TetherMax | Confirms attribution via `is_partner_referral` and returns the registration date and the AccountID |
| 5 | Trader | ApeX | Trades; ApeX calculates fees and cashback and settles hourly |
| 6 | ApeX | TetherMax | Exposes commission records per account and settlement period (API 3) |
| 7 | ApeX | Trader | Pays the cashback into the trader's ApeX Rewards Center |
| 8 | ApeX | TetherMax | Pushes the Pending → Paid change with its record ID (API 5) |
| 9 | Trader | TetherMax | Views cashback and selects "Withdraw on ApeX" |
| 10 | TetherMax | Trader | Opens the ApeX Rewards Center in a new tab |

**TetherMax never holds or moves a trader's funds.** We display what ApeX reports and link the trader to the Rewards Center.

---

## Manual fallback until the ledger API is live

If API 3 is not available at launch, please send a daily CSV by **02:00 UTC** to a shared, access-controlled folder, with these columns:

```
record_id, wallet_address, account_id, reward_period, fee_basis,
amount, token, commission_state, payout_time
```

`payout_time` may be blank until paid. **Our upload tool rejects any row whose `token` is not USDT, or whose `record_id` is missing.**

---

## Data rules on our side

| Rule | Detail |
|---|---|
| Record key | `wallet_address` + `account_id` — pending item 2 |
| Immutability | Records are never mutated. A correction is a new record referencing the original |
| Finality | Hourly settlement periods roll up to the UTC business day; a day is final 48 hours after it closes unless a correction follows |
| Amounts | Decimal strings with up to 6 decimal places, never floats |
| Wallet addresses | Lowercase hex, compared case-insensitively. We validate every partner-supplied address with the same rule we apply to trader input. An invalid address is never matched, corrected or dropped silently — it is held for review and reported back to you |
| Token | Mandatory on every amount. Records without it are rejected |
| Personal data | We ask for none. No names, emails, IP addresses or KYC data |
| Lookback | Up to 180 days for data queries |

---

## Reconciliation

- Records are matched through the linked wallet address and the AccountID you supply
- **Unmatched records are held for review and reported back to you weekly**, never dropped
- At month end, the sum of records per token must equal the monthly statement
- Either side may raise a discrepancy within **30 days** of the statement, quoting the `record_id`

---

## Security

- Our access is **read only** — no trading, transfer or withdrawal capability
- Keys are held in TetherMax's secure key store and used from allowlisted IPs
- No wallet address or Account ID appears in a user-facing URL, an analytics event or an externally visible log line
- **TetherMax never asks a trader for a private key, a seed phrase or a wallet signature.** Traders paste their public wallet address and nothing else. We would appreciate ApeX stating the same in any co-branded material

---

## Service levels we are requesting

| Item | Target |
|---|---|
| API availability | 99.5% monthly |
| Commission records available | Within 1 hour of each hourly settlement |
| Monthly statement | Previous calendar month, generated on the 1st at 00:00 UTC, in USDT, with the ledger as CSV in a shared secure space |
| Notice of a breaking API change | 30 days |
| Notice of a change to settlement currency, rebate rate or restrictions | 14 days |
| P0 incident acknowledgement | Within 1 hour, 24/7 |
| Support channel | A shared Telegram group plus a named engineering contact on each side |
| Lookback for data queries | Up to 180 days |

---

## Build priority, in order

This is **our** implementation order, not a list of further asks. It includes items you have already confirmed as available, because we still have to build against them. The priority column is how critical each item is to our build.

| Order | Item | API | Priority |
|---|---|---|---|
| 1 | Ledger records carrying the cashback amount, wallet address, token and paid time | API 3 | **P0** |
| 2 | `is_partner_referral` and the AccountID, looked up by wallet address | API 2 | **P0** |
| 3 | Authentication method, API keys and base URL | — | **P0** |
| 4 | `available_balance` per account | API 3 | P0 |
| 5 | `registration_date` | API 2 | P0 |
| 6 | Mainnet test accounts and API keys | — | P0 |
| 7 | Webhooks for attribution and Pending → Paid, with `account_id` | API 5 | P0 |
| 8 | `current_eligibility` per product | API 2 | P0 |
| 9 | Referral Validation | API 1 | P0 |
| 10 | Monthly statement | API 3 | P1 |
| 11 | `geo_restrictions` and `other_restrictions` | API 4 | P2 |

---

## Next step

We would appreciate a response on items 1 to 4, which block our launch. We are happy to walk through any of this on a call, and we would like to agree a named engineering contact on each side and set up a shared Telegram group.
