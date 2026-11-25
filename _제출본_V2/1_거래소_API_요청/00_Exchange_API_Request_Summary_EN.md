# Exchange API Requests — Summary (V2)

Written 2026-10-21 · Based on `DEX/DEX3/` partner proposals (settled 2026-10-20)
Korean version: `00_거래소_API_요청_정리_국문.md`

> **The decks in this folder are what gets sent.** This file is an internal tracking summary and is **not for external distribution.**

---

# 0. Files in this folder

| Recipient | Korean | English (sent) |
|---|---|---|
| **Lighter** | `TetherMax___Lighter___DEX_Payback_Integration_Proposal_*.pdf` | `TetherMax___Lighter___DEX_Cashback_Integration_API_Proposal_*.pdf` |
| **ApeX** | `TETHERMAX___ApeX___DEX_페이백_연동_API_협업_요청_*.pdf` | `TETHERMAX___ApeX___DEX_Cashback_Integration_API_Proposal_*.pdf` |
| **EdgeX** | `REQ-EdgeX___DEX_Payback_Integration_Proposal_*.pdf` | `REQ-EdgeX___DEX_Cashback_Integration_Proposal__EN_*.pdf` |
| **Aster** | `TetherMax___Aster___DEX_Payback_Integration_Proposal_*.pdf` | `TetherMax___Aster___DEX_Cashback_Integration_Proposal_*.pdf` |
| Internal announcement | `DEX_연동_방침_공표_*.pdf` | `DEX_Integration_Strategy_Announcement_*.pdf` |

Each partner deck is **11 slides, 16:9**; the internal announcement is **16 slides**.

---

# 1. Common ask — the two preconditions

Slide 4 of every deck, identical wording, and **the only slide that uses red**.

| # | Condition | Where it is set |
|---|---|---|
| 1 | Trader-side cashback rate set to **0%** — automatic payouts disabled | DEX back office |
| 2 | **100% of commission routed to TetherMax Wallet A** | DEX settlement config |

**If either is missing, the whole pipeline — including Wallet B automated payouts — cannot go live.**

> From the ApeX deck: *"We are not asking for a tweak to the structure — we are asking for the conditions that make integration structurally possible."*

---

# 2. Common ask — the ledger API

## 2-1. Required — 5

| # | Field | Description |
|---|---|---|
| 1 | `wallet address` | **DEXs have no UID, so this is the only identifier** |
| 2 | `trade_type` | `spot` / `perp` — keeps the two volumes separate |
| 3 | `fee_paid` | Fee the trader actually paid |
| 4 | `commission` | Commission paid to TetherMax |
| 5 | `referral_code` | Verifies TetherMax attribution |

## 2-2. Optional (revised 2026-10-21)

| # | Field | Purpose | Negotiation weight |
|---|---|---|---|
| 1 | `UID / AID` | CS cross-check, duplicate and gap tracing | Medium |
| 2 | `network (EVM)` | Determines which chain Wallet B settles on | High |
| 3 | `account_tier` | Tracks Lighter Standard/Plus/Premium tier | **Optional** — downgraded 2026-10-22. No warning is shown, so it is **not required** |

> ### ❌ `symbol` · `volume` — **removed from the ask** (2026-10-21)
>
> Previously classified as a *"precondition for Global League and Maxboard"* at **High** weight.
> We have since confirmed that **all three services score on cashback amount, not trading volume.**
>
> | Service | Scoring basis | Source |
> |---|---|---|
> | Global League | `1 USDT commission cashback = 1 point` | MAX-8 §3 Score Logic |
> | Cashback Ranking / Monthly Ranking | Cashback amount | Confirmed 2026-10-21 |
> | Maxboard | Gauge, streak and ranking **all run on cashback** | Maxboard PRD, Service Plan §1.1 |
>
> **TetherMax has no system that records trading volume at all.** The field was never needed.

### ★ Why `account_tier` was added (Lighter)

Lighter pays **0% cashback on Standard accounts**.
Tier can be detected at link time (the link modal warns on a Standard address), but
**there is no way to detect a tier downgrade after linking.**
A user's cashback would stop silently and surface only through a support ticket.

---

## 2-3. Refresh rule

```
D: trades occur → 24h aggregation → exposed at a fixed time on D+1 → TetherMax ingests
```

**00:00 UTC** is the baseline; only Aster is asked to refresh after **09:00**.

### ★ 2-3-1. Hourly UTC timestamps — **new requirement**

> **Daily totals alone are not sufficient.**
> Please include the **UTC timestamp of the trade** on every record.

**Why:** TetherMax serves 15 languages worldwide and renders every date and time in the **viewer's device local time**. Because "today" differs by timezone, a total bucketed by server-side UTC date will not match what the user sees as today.

```
Ask:    1-hour granularity + a UTC timestamp on every record
Use:    the client re-aggregates by the user's local date
Basis:  MAX-431 P-2 / MAX-466 Backend common policy
```

Example — a trade at UTC 2026-10-19 23:30 is
- **20 October** for a user in Korea (UTC+9)
- **19 October** for a user on US Eastern time (UTC−5)

Daily totals make that distinction impossible.

---

## 2-4. Response example (identical across all four) — revised 2026-10-21

```json
{
  "date": "2026-10-19",
  "timestamp_utc": "2026-10-19T23:30:00Z",
  "wallet": "0x##...##",
  "trade_type": "perp",
  "fee_paid": ##.##,
  "commission": ##.##,
  "referral_code": "TM####",
  "account_tier": "premium"
}
```

`##` placeholders are replaced with measured values after final sign-off.

| Field | Change |
|---|---|
| `timestamp_utc` | **New** — hourly re-aggregation (2-3-1) |
| `account_tier` | **New** — Lighter tier tracking (2-2) |
| `symbol` · `volume` | **Removed** |

---

## 2-5. Settlement cadence and time (`update_time`) — **new requirement**

This value is registered in the TetherMax admin field **`Exchange Management > Update (UTC)`**.
It drives the *"next settlement date / settlement time"* shown to the user, in their local time, on the link-success screen.

| Exchange | Current cadence | Label required |
|---|---|---|
| Lighter | Weekly (Monday) | **Weekly** + weekday + time |
| ApeX | Hourly | Daily (if rolled up) + time |
| EdgeX | Daily 00:00 UTC | Daily + time |
| Aster | Daily (calculated 00:00 / published 09:00) | Daily + **09:00** |

> **Ask:** please state each exchange's settlement cadence and its **fixed time (UTC)**.
> TetherMax converts this into the viewer's local time for display.

---

# 3. The five common negotiation items

Present on the last slide of every deck.

| # | Item | Content |
|---|---|---|
| 1 | **Timing alignment** | Ledger refresh time vs payout time |
| 2 | **Wallet verification** | Signature vs allowlist |
| 3 | **API authentication** | Key issuance plus IP allowlist |
| 4 | **Re-aggregation rule** | Handling on error or delay |
| 5 | **Optional field delivery** | **Hourly timestamps · `account_tier` · `network`** |

> **Item 5 revised (2026-10-21):** this previously read *"Volume — Global League and Maxboard hinge on it."*
> All three services were confirmed to score on cashback amount, so **the volume ask is withdrawn.**
> **Hourly timestamps (2-3-1)** take its place as the negotiation item — and matter more:
> without them, aggregating by the user's local date is impossible, and that is a **requirement across every service.**

---

# 4. Per-DEX asks

## 4-1. Aster — four items · **most urgent**

| # | Aster today | TetherMax asks |
|---|---|---|
| 1 | Daily (00:00 calc → 09:00 publish) | **Agree a refresh time after 09:00** |
| 2 | Paid in the fee's margin asset (USDT, ETH, BTC — variable) | **Aster supplies the USDT-converted value** |
| 3 | **365-day referral expiry, renewal undecided** | **Confirm the renewal mechanism** |
| 4 | No external way to verify payouts | **Supply a verification value** |
| **5** | **Post-expiry state undefined (new)** | **Does commission keep accruing after expiry, or stop?** |

> **Item 3 is top priority.** From the deck: *"Until the renewal rule is agreed, payouts will lapse in 12 months."*

### ★ Item 5, added 2026-10-21

The **approaching-expiry** screen (`Expires in 30 days` badge) exists in design, but what happens **after** expiry is undefined on both sides.

```
D-30  expiry badge              → designed
D-0   expired                   → ★ no screen (confirmed as new work)
D+1~  commission on later trades → ★ no policy — needs Aster's answer
```

**To ask Aster:** once a referral has expired, for trades from that wallet —
- (a) does commission keep accruing?
- (b) does accrual stop?
- (c) if the user re-links, is the lapsed period backfilled?

The answer to (a)/(c) changes both the copy and the re-link CTA behaviour on TetherMax.
**TetherMax's position:** no auto-renewal. We show a *"your link has lapsed, please reconnect"* notice with a re-link CTA.

## 4-2. ApeX — five items

| # | ApeX today | TetherMax asks |
|---|---|---|
| 1 | Hourly batch entries | **Can hourly commissions roll up into a daily (D+1) batch?** |
| 2 | USDT, perp account | No conversion needed; ledger amount stays as-is |
| 3 | Claim required in Rewards Center (only one of the four) | New traders accrue nothing at 0% → **scope the discussion around new signups** |
| 4 | **Legacy unclaimed balance may exist** | **Decide separately** |
| 5 | Internal ID present | Agree the ledger reconciliation value |

> The deck recommends: *"Split the conversation — new signups vs legacy unclaimed balance, decided independently."*

## 4-3. Lighter — five items

| # | Lighter today | TetherMax asks |
|---|---|---|
| 1 | Weekly, every Monday (prior Mon–Sun) | **Define the aggregation window across daily ledger and weekly close** |
| 2 | USDC settlement (TetherMax converts 1:1) | **Agree conversion timing and FX basis** |
| 3 | Standard accounts earn 0% cashback | **Display warning / onboarding copy** + **supply `account_tier`** |
| 4 | On-hold weeks unpaid; under $1 unpaid | **Sync rule for how on-hold entries appear in the ledger** |
| 5 | **Payout verification by on-chain hash** (the only one) | Use as the reconciliation basis |
| **6** | **Weekly settlement blocks the Maxboard streak cell (new)** | **Can a daily ledger be supplied?** |

### ★ Item 6, added 2026-10-21 — this raises the weight of item 1

The **streak cell** in Maxboard (bingo) unlocks on *"N consecutive days with cashback, by ledger posting date"* (Maxboard PRD REQ-040).

**With weekly settlement only one day in seven carries cashback, so even a 2-day streak is impossible.**

| Exchange | Cadence | Streak cell |
|---|---|---|
| **Lighter** | **Weekly (Mon)** | **❌ permanently unreachable** |
| ApeX | Hourly | ✅ |
| EdgeX | Daily | ✅ |
| Aster | Daily | ✅ |

**Ask:** keep **payouts** weekly if required, but could the **ledger** be published **daily**? The streak is judged on *ledger posting date*, not payout date — a daily ledger alone resolves it.

**If not possible:** TetherMax will build the Lighter board from **amount cells only**.
(Maxboard PRD REQ-113 already supports this: *"with amount cells only, hide the streak card and let the remaining card span the full width."*)

## 4-4. EdgeX — endpoints plus optional APIs

### Five endpoints requested (only EdgeX has a concrete proposal)

```
GET  /v1/referral/code/{user_id}
GET  /v1/trade/fees/{user_id}?window=24h
GET  /v1/ledger/entries/{user_id}?type=fee
POST /v1/cashback/credit
POST /v1/cashback/revoke
```

**Principle: read-only reads, cashback-only writes, no withdrawal authority.**

### Three safeguards

| Safeguard | Content |
|---|---|
| **Idempotency** | The same `trade_id` is credited exactly once — double payment is structurally blocked |
| **Revocation** | Revoke within 24 hours, before the ledger closes |
| **Separation** | Wallet A (inbound) and Wallet B (outbound) are never the same pool |

### Five optional APIs (proposed to EdgeX only)

| Phase | Item | Content |
|---|---|---|
| 1 | **Webhook** | Replace 30-second polling with real-time push, within 30 days |
| 2 | Affiliate sub-tree | Multi-tier referral, indirect attribution |
| 2 | Staking-aware | Reflect staked balance at trade close |
| 3 | ~~Volume tiering~~ | ~~Raise the cashback share as 30-day volume crosses tiers~~ **→ shelved; volume not collected** |
| 4 | Global League + Maxboard | Tournament surfaces on EdgeX screens **(works on cashback amount)** |

> **Phase 3 revised (2026-10-21):** volume tiering is **shelved** — TetherMax does not record trading volume.
> Phase 4 (Global League + Maxboard) runs on **cashback amount** and is unaffected.

### Pre-flight checklist

```
□ EdgeX back office set to 0% cashback
□ Wallet A routed for 100% commission
□ Five required endpoints live in staging
□ Staging dry-run — 100 trades replayed
□ Both teams approve the go-live window
```

---

# 5. Notes before sending

| # | Note |
|---|---|
| 1 | **`##` placeholders are still in the decks.** Measured values go in after sign-off |
| 2 | **Rates stay blank.** Commercial terms are still being negotiated |
| 3 | This summary (`00_*`) is **not for external distribution** |
| 4 | Send order is **Aster first** (strategy announcement, slide 16) |

---

# 6. Open — confirm before sending

| # | Item | Status |
|---|---|---|
| 1 | ~~Three documents give three different timelines~~ | **Closed (2026-10-21)** — timelines are out of consideration |
| 2 | **The "six surfaces" in the EdgeX deck are EdgeX's own screens**, while the other three decks mean TetherMax screens | Confirm this is intended |
| 3 | The planning doc says 8-slide decks and a 12-slide announcement; **the actual files are 11 and 16** | Open |
| 4 | The announcement is `v1.0 DRAFT` while the Aster deck is `v2.0` — **version scheme needs aligning** | Open |
| **5** | **Commission rates for the four DEXs are undecided** — the hub comparison (Lighter 20% / ApeX 30% / EdgeX 30% / Aster 20%) shows **cashback rates** (user-facing); commission and margin rates await commercial terms | **Undecided (2026-10-21)** |
| **6** | **Payout chain undecided** — a separate owner is researching it for a C-level decision | **Undecided (2026-10-21)** |

---

# 7. Revision summary — 2026-10-21

Reflects analysis of six existing PRDs (MAX-8/10/18/30/431/466) and the Maxboard PRD.

| # | Change | Reason |
|---|---|---|
| 1 | **Removed `symbol` · `volume`** from the optional ask | Global League, rankings and Maxboard **all score on cashback amount**. TetherMax does not record volume |
| 2 | Added **hourly UTC timestamp** requirement | Cross-service policy — the client re-aggregates by the user's local date |
| 3 | Added **`account_tier`** | A Lighter Standard (0%) downgrade after linking is otherwise undetectable |
| 4 | Asked for **`update_time`** (cadence + fixed time) | Drives the "next settlement" notice on the link-success screen |
| 5 | **Aster item 5** — commission accrual after expiry | Neither side has a screen or a policy for the post-expiry state |
| 6 | **Lighter item 6** — daily ledger feasibility | Weekly settlement structurally blocks the Maxboard streak cell |
| 7 | EdgeX Phase 3 **volume tiering shelved** | Volume not collected |
