# TetherMax ↔ Lighter — Remaining Integration Items

Date: 20 October 2026
From: TetherMax
Reference: Lighter × TetherMax v2 (11 October), plus the follow-ups in our shared group through 19 October

---


## Summary

Thank you for the v2 response and for the quick follow-ups in the group — the masked-matching answer on 19 October resolved the biggest open question in our design, and we appreciate it.

Five items remain.

| # | Item | Priority |
|---|---|---|
| 1 | Confirm the agreed rates | **P0** |
| 2 | Masked-match collisions — the one case we cannot resolve on our own | **P0** |
| 3 | Confirm our implementation of masked matching | P1 |
| 4 | Weekly CSV delivery — mechanism, time and coverage | P1 |
| 5 | Weeks below the $1 minimum | P1 |

---

## 1. The agreed rates — P0

On 10 October you mentioned you were switching the first-week rebate to **a 10% referee fee discount that carries over the weeks, combined with a 20% referral fee kickback** to TetherMax. You also noted that since referral payments are processed weekly and not yet automated, the split can be calculated as we see fit — for example rebating a higher percentage to the referee out of our kickback.

Two things we need to close this out:

**(a) Is the 20% kickback and 10% referee discount now live, or still being switched over?** We would like to state the correct numbers to traders from day one.

**(b) If we choose to pass part of our 20% kickback to the referee, how do we tell you the split?** Is it a value you configure on your side per the agreement, or do we tell you a number each week, or do we simply receive the full 20% and handle the trader's share ourselves?

**Why this matters.** We show a week-to-date estimate between Monday payouts, computed from `userReferrals` as fees paid this week × the agreed rate. Without the final number, **we cannot show a trader any figure between payouts** — their cashback would appear once a week and be blank in between.

We always label that figure as an estimate and never count it in a paid total.

---

## 2. Masked-match collisions — P0

This is the one part of the masked-matching flow we cannot resolve on our own, and we would value your view.

**The situation.** Following your 19 October instructions, when a trader pastes their Lighter wallet we mask it the same way and look for a matching row in `userReferrals`. The mask keeps the first 4 and last 4 characters of the checksummed address, which is **6 identifying hexadecimal characters**.

**The risk.** Six characters are not unique. As the referee list grows, two different wallets will eventually share a mask. When that happens we cannot tell which row belongs to the trader in front of us.

**Why we cannot simply ignore it.** If we match the wrong row, we would attach another trader's binding time — and, worse, our week-to-date estimate for that row — to the wrong person. That is a correctness problem, not a cosmetic one.

**How we plan to handle it, unless you advise otherwise**

| Case | Our handling |
|---|---|
| Exactly one masked match | Link immediately, using `used_at` as the binding time |
| **Two or more masked matches** | **Do not link.** Hold the wallet and confirm it against the next weekly CSV, which carries full wallets |
| No match | Treat as not a TetherMax referral |

**What would remove the problem entirely.** Any of these, in order of preference:

1. **An endpoint that takes one full wallet address and returns whether it is a TetherMax referee**, with `used_at` and `tier`. A yes/no plus two fields would be enough; it need not expose any other referee's data
2. A longer mask — even 8 identifying characters instead of 6 would make collisions negligible at our scale
3. Confirmation that collisions are acceptable to leave to the weekly CSV, in which case we will implement the table above

Option 1 is what we would most like, but we understand the privacy reasoning behind masking and we are not asking you to weaken it for other partners.

---

## 3. Confirming our implementation of masked matching — P1

So that we do not build this wrong, please confirm our reading of your 19 October answer.

| Step | Our implementation |
|---|---|
| 1 | Poll `GET /api/v1/referral/userReferrals?l1_address=<our code's wallet>&limit=300` with our read-only token, on a schedule, and cache the results |
| 2 | Results come back **newest first**, so a trader who has just signed up appears on the first page |
| 3 | When a trader pastes a wallet, we convert it to **EIP-55 checksum form**, then keep **the first 4 and last 4 characters of that string** — giving `0x12…abcd` — and look for a matching row in the cache |
| 4 | `used_at` on the matching row gives us the binding time |
| 5 | We call the public `GET /api/v1/accountsByL1Address?l1_address=<pasted wallet>` for the main account index and any sub-accounts, and treat the referral binding as covering all of them |
| 6 | The weekly CSV later confirms the full wallet |

**Two specific points we want to be sure about**

**(a) The mask is computed on the checksummed address, not the lowercase one.** We store addresses lowercased for matching, so we must re-derive the EIP-55 form before masking. If we masked the lowercase form, the characters would not match. Please confirm this is correct.

**(b) "First 4 and last 4 characters" means the first 4 characters of the whole string, including the `0x` prefix** — so `0x` plus 2 hexadecimal characters, then the last 4 hexadecimal characters. That matches both your example `0x12…abcd` and the "0x + first 2 + last 4 hex" wording in the v2 document. Please confirm.

---

## 4. Weekly CSV delivery — P1

Three questions.

**(a) The mechanism.** We propose a shared, access-controlled folder. Please tell us if you prefer another method.

**(b) The time on Monday.** We propose **by Monday 23:59 UTC**. If it has not arrived by then, we show the Lighter figures as delayed, with the last reported amount and its timestamp, rather than showing nothing or a zero.

**(c) Coverage — is every referee listed each week, or only referees who paid fees that week?**

This third question matters more than it looks. If only fee-paying referees appear, a referee who did not trade that week is simply absent from the file, and **we must not read that absence as a failed or expired referral.** Knowing the rule lets us handle a quiet week correctly.

---

## 5. Weeks below the $1 minimum — P1

If a referee's week falls below the **$1 minimum**, does the amount **roll into a later payout**, or is it **dropped**?

We show nothing as Paid for that week either way. The answer determines whether we keep the amount visible as still accruing or clear it.

---

## Jurisdictions — P2

Two questions that affect where we show your programme on TetherMax. Neither blocks integration.

| # | Question | Why we ask |
|---|---|---|
| 1 | Are there jurisdictions where you require that we **not** refer users to you? | We filter partner visibility by the user's country and would rather apply your list than guess. |
| 2 | Can you share the list of countries where you do not offer service? | Same purpose. This would be the initial value of that filter. |

A short answer to each is enough.

---

## Items already settled — recorded so we are working from the same picture

Please correct anything we have misread.

| Topic | Our understanding | Source |
|---|---|---|
| **Route** | Referral Program only, not Partner Attribution. No integrator approval needed, and fills with a non-zero integrator fee are excluded | v2 §2 |
| **Code and link** | `TETHERMAX`, format `^[A-Z0-9]{4,14}$`, one-time change on our main account. Link `app.lighter.xyz/?referral=TETHERMAX` | v2 §3 |
| **Binding** | Permanent, done in Lighter's own UI with one signature there. **TetherMax never asks the trader for a signature** | v2 §1 |
| **Programme start** | Only bindings on or after **28 Jul 2026** are eligible (`is_eligible=true`) | v2 R2 |
| **Account tier** | Cashback only on Plus and Premium. Standard pays 0% fees and earns nothing. We read `tier` from `userReferrals` and warn Standard traders. No tier-change history, no reason codes | v2 R8 |
| **Sign-up flow** | The referral sign-up flow prompts new users to pick Premium; existing users switch on their Portfolio page | Group, 10 Oct |
| **Spot** | **Included and cannot be excluded.** Cashback is calculated on fees from both perpetuals and spot, as long as the trader is on Plus or Premium. Spot fees are valued in USD and paid in USDC | Group, 14 Oct |
| **Fee basis** | Gross fees paid after the binding time. No netFee | v2 R6 |
| **Payout** | Weekly, every Monday, for Mon 00:00 to Sun 23:59 UTC, $1 minimum, as a USDC L2 transfer | v2 §2 |
| **Where it lands** | Each referee's cashback goes straight to their own Lighter main account; TetherMax's share goes to our main account. **TetherMax never holds or moves trader funds** | v2 R19 |
| **Key** | `l1_address`. `account_index` is informational, and attribution covers the main account and all sub-accounts | v2 R15 |
| **States** | Accruing (our estimate) → Paid (final, with tx hash) or Withheld after abuse review. **No clawback on a paid transfer** | v2 R4 |
| **Webhooks** | None. Polling is the supported method; hourly is sufficient because payouts are weekly | v2 R10 |
| **Rate limits** | `referral/*` has weight 3000. We understand you are **moving our account to Builder type**, raising us to about 80 requests per minute. Please confirm when that is done | v2 R14, Group 16 Oct |
| **Code validation** | No public endpoint. We confirm our own code with `referral/get` | v2 R11 |
| **Testnet** | `testnet.app.lighter.xyz`, chain ID 300. Weekly payouts run on mainnet only | v2 R13 |
| **Ownership** | Not needed on your side, since cashback is only paid to the wallet bound to our code. We keep our own duplicate-wallet rule, and our support team handles any dispute over a wallet claimed by two members | v2 R18 |
| **No points** | Cashback is a weekly USDC L2 transfer. Not points | v2 §5 |

---

## Endpoints we rely on

| Endpoint | Auth | Use |
|---|---|---|
| `GET /api/v1/referral/userReferrals?l1_address=` | Read-only token | One row per referee: masked address, code, `used_at`, `tier`, `source`, `trade_stats`. Cursor paging, up to 300. **Polled hourly** |
| `GET /api/v1/referral/stats?l1_address=` | Read-only token | Last 12 weekly buckets, summed across referees |
| `GET /api/v1/transfer_history?account_index=&type=ReferralProgramPayout` | Account owner | Weekly payout transfers: id, amount, timestamp, tx hash |
| `GET /api/v1/referral/get?account_index=` | Read-only token | Our own active code |
| `GET /api/v1/accountsByL1Address?l1_address=` | Public | Main account index and sub-accounts |
| Weekly CSV | — | TetherMax referees only: week, full wallet, `account_index`, bind time, tier, fees paid, cashback, TetherMax share, status, tx hash |

---

## Our data rules, for reference

| Rule | Detail |
|---|---|
| Key | `l1_address`, lowercase hex, compared case-insensitively. One linked Lighter account per wallet |
| Week-to-date estimate | Fees paid this week × the agreed rate. **Always labelled as an estimate, never counted in a paid total** |
| Masked addresses | Used only to match a pasted wallet. **Never shown to a member as an identifier** |
| Currency | Everything is USDC, displayed to members as USDT at 1:1 face value |
| Standard tier | Accrues zero. We show the Standard state from `tier` |
| Eligibility | Only bindings on or after 28 Jul 2026 |
| Ledger of record | The Monday CSV. It replaces that week's estimate and is the only source of Paid and Withheld |
| Import validation | We reject any row without a wallet, week, status or amount |
| Personal data | We ask for none |
| Lookback | Up to 180 days |

### Reconciliation

- Each weekly CSV is matched to linked wallets on the **full wallet address**
- CSV lines for wallets not yet linked on TetherMax are kept and matched when the wallet is linked later. They also confirm wallets we linked on a masked match
- The sum of a week's TetherMax share in the CSV must equal our own `ReferralProgramPayout` transfer for that week
- The week's fees are checked against the `referral/stats` weekly bucket
- We raise discrepancies within 30 days, quoting the week and the tx hash

---

## Security

- We hold a **read-only token** and no key that can move funds, in a secure key store, used from allowlisted IPs
- No wallet address or `account_index` appears in a user-facing URL, an analytics event or an externally visible log line
- **TetherMax never asks a trader for a private key, a seed phrase or a wallet signature.** Referral binding happens in Lighter's own interface. We would appreciate Lighter stating the same in any co-branded material

---

## Service levels we are requesting

| Item | Target |
|---|---|
| API availability | 99.5% monthly |
| Live referral data | `userReferrals` live, polled hourly |
| Weekly CSV | Every Monday for the previous week, delivered by **Monday 23:59 UTC** |
| Notice of a breaking API change | 30 days |
| Notice of a change to settlement currency, fees, tier or programme rules | 14 days |
| P0 incident acknowledgement | Within 1 hour, 24/7 |
| Support channel | The shared Telegram group plus a named engineering contact on each side |

---

## Next step

Items 1 and 2 are the two that affect what a trader sees, so those are the ones we would most like to close.

Item 1 is commercial and we are happy to discuss it however suits you. Item 2 is a short technical conversation — if a single-wallet lookup is possible we would take it; if not, we will implement the hold-and-confirm behaviour described above and we are comfortable with that.

Thank you again for the speed of your responses so far.
