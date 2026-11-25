> ## ⚠️ V2 notice (2026-10-21)
>
> This document was written under the **V1 structure** (the DEX pays the trader directly).
> **The structure changed on 2026-10-20** — TetherMax now receives 100% of the commission and pays the trader.
>
> | Status | Detail |
> |---|---|
> | ✅ **Still valid** | Hardcoded 10 / operator-managed 23 / i18n keys 101 / design assets 32 — quoted verbatim in slide 13 of the strategy announcement. **Fully valid.** |
> | ⚠️ **Re-check** | The `Event and invite rewards` DEX value, the two guest reason cards, and the minimum-withdrawal copy change because event rewards now apply. |
>
> See `../DEX_신규방침_종합정리.md` for the full new structure.

---

# Backoffice-managed vs hardcoded

Written 2026-10-20
Pages covered: **Cashback Hub**, **DEX overview page**
Sources: **the actual Figma designs** + `CH-1`–`CH-17`, `RT-1`–`RT-8`, `DX-1`–`DX-13` + backoffice `EXT` / `ELC` / `EDC` / `SPE`
Korean version: `백오피스관리_vs_하드코딩_국문.md`

Figma: `UI-UX-Design` → `DEX` canvas
- Cashback Hub `27267:346729` (light) / `27267:346935` (dark) — **14 states**
- DEX overview `27267:347023` (light) / `27267:347246` (dark)

---

# 0. Classification key

| Tag | Meaning | How it changes | Deploy needed |
|---|---|---|---|
| **BO** | **Backoffice-managed.** An operator enters or edits the value | Backoffice | No |
| **LANG** | **Language-pack key.** Fixed UI copy supplied per language | Language-pack sheet | No |
| **LIVE** | **Live or periodic data.** External API or internal service | Automatic | No |
| **CALC** | **Derived value.** Computed from other values | Automatic when the source changes | No |
| **ASSET** | **Media asset** | Backoffice upload or bundled at build | Sometimes |
| **HC** | **Hardcoded in code** | Code change | **Yes** |

### Principles the PRD already sets

| Principle | Source |
|---|---|
| All user-facing text is **supplied from translation keys. No hardcoding** | `NFR 7` |
| Rates, partner counts, units, deposit methods and benefit copy **must agree everywhere; publishing is blocked when they disagree** | `NFR 11` |
| **Partner counts are computed from published records.** No number is written into the markup | `NFR 11` |
| Rates are **read from the backoffice Spending Estimate.** No page-level hardcoding | `CH-16` |

---

# 🔴 Conclusions first — 12 problems found in the design review

| # | Problem | Where | Severity |
|---|---|---|---|
| 1 | **The comparison table has no DEX rows at all.** All 16 rows are CEX, yet a `DEXs` filter chip exists | Hub comparison table | 🔴 |
| 2 | **The logo grid and the comparison table list different exchanges — six differ on each side** | Hub | 🔴 |
| 3 | **`Cashback, 20%`** — the rate is baked into the label text | Hub calculator | 🔴 |
| 4 | **`Compare cashback across 23 partners`** — the partner count is baked into the copy | Hub comparison table | 🔴 |
| 5 | **`Per day $0.19` / `Per year $67.20`** — computed values are baked into text | Hub calculator | 🟠 |
| 6 | **The calculator footnote is `hidden`** | Hub calculator | 🟠 |
| 7 | **The "at a glance" subline says "Volume and open interest" while the actual field is TVL** | DEX overview | 🟠 |
| 8 | **All four "at a glance" cards carry identical dummy values** (`20%`, `$1.485B`, `$1.12B`) and **every name layer reads `Lighter`** | DEX overview | 🟠 |
| 9 | **DEX ordering differs within the same page** — "at a glance" is `Lighter, Aster, EdgeX, ApeX`; the 2×2 cards are `Lighter, ApeX, EdgeX, Aster` | DEX overview | 🟠 |
| 10 | **The comparison section's `Event and invite rewards` DEX value reads `Quiz rewards only, claimed to an exchange…`** — which differs from the PRD's "None for DEX trading" and needs checking against our decision (A-09) | DEX overview | 🔴 |
| 11 | **`On TetherMax, from 10 USDT`** — the minimum is baked into the copy | DEX overview comparison | 🟠 |
| 12 | **The three guest reason cards appear unchanged on the DEX page** — two of them are CEX-only content | Both | 🟠 |

---

# 1. Cashback Hub

## 1-1. The 14 designed states

The design is finer-grained than the PRD. Each state exists as its own frame.

| ID | State | Height |
|---|---|---|
| H1 / HA5 | Guest, DEX route (condensed hero + routes + comparison table) | 4200 |
| H2 | Signed in, nothing linked | 3750 |
| H3 | Signed in, CEX UID linked | 3750 |
| H4 | CEX balance under 10 USDT | 3750 |
| **H5** | **Signed in, DEX wallet linked** | 3750 |
| **H6** | **DEX data delayed** | 3750 |
| H7 | Balance failed to load | 3750 |
| **H8** | **EdgeX wallet linked** | 3750 |
| **H9** | **Aster referral expiring soon** | 3750 |
| **H10** | **Aster referral expired** | 3750 |
| ~~H11~~ | ~~Withdraw on Lighter dialog~~ | **Retired in V2** — withdrawal happens on TetherMax |
| ~~H12~~ | ~~Lighter opened in a new tab~~ | **Retired in V2** |
| H13 | Refresh after returning | 900 |
| ~~H14~~ | ~~New tab blocked~~ | **Retired in V2** |

**`H8 EdgeX wallet linked` exists as its own state.** The PRD's `LK-10` says "not designed in Figma", but **the Hub does have a design.** (The home selected-account card still needs checking separately.)

## 1-2. Hero

| Element | Design value | Class | Managed in |
|---|---|---|---|
| Background | `wave bg (John placeholder; live: ripple shader)` | **ASSET** | ⚠️ **Placeholder.** The live asset is a ripple shader |
| Three route badges | `badge / CEX` 240×160, **`badge / DEX` 480×320**, `badge / FX (Brokers)` 240×160 | **ASSET** | The active route renders larger |
| `badge glow` | 440×90 | ASSET | Glow behind the active badge |
| H1 | `headline` (content not recorded) | **LANG** | Language pack |
| Lede | `subhead` | **LANG** | Language pack |
| 3D object | `3D calculator printing a receipt (asset 206:52393)` | **ASSET** | Asset ID is stated |
| Three hotspots | `hotspot / CEX`, `/ DEX`, `/ Broker` | — | Route tab interaction |

## 1-3. Calculator (receipt)

| Element | Design value | Class | Managed in | Note |
|---|---|---|---|---|
| Label | `CASHBACK ESTIMATE` | **LANG** | Language pack | |
| Route chip | `chip label` | **LANG** | Language pack | Variable |
| Route tabs | `route segmented` instance | **LANG** | Language pack | |
| `PARTNER` label | Fixed | **LANG** | Language pack | |
| Partner mark | `partner mark` | **BO (ASSET)** | Exchange record | |
| Partner name | `Lighter` | **BO** | Exchange record | |
| Volume label | `Monthly trading volume` | **LANG** | Language pack | |
| **Default volume** | **`$100,000`** | **🔴 HC** | → `SPE` | |
| **Slider range** | **`$1K` – `$250K`** | **🔴 HC** | → `SPE` | **DEX range 1K–250K confirmed** |
| Fee label | `Trading fees` | **LANG** | Language pack | |
| **Fee description** | **`Lighter Premium taker, 0.0280%`** | **🔴 HC** | → composed from BO | Partner name, tier and rate in one string |
| Fee value | `value` | **CALC** | — | Variable |
| **Cashback label** | **`Cashback, 20%`** | **🔴 HC** | → `Cashback, {rate}%` | **The rate is baked into the label** |
| Destination | `Paid into your Lighter account` | **LANG + variable** | Language pack | `{DEX}` must become a variable |
| Cashback value | `value` | **CALC** | — | |
| Net fee label | `Trading fees after cashback` | **LANG** | Language pack | |
| Net fee value | `value` | **CALC** | — | |
| Total label | `Estimated monthly cashback` | **LANG** | Language pack | |
| Total value | `total value` | **CALC** | — | |
| **Per day / per year** | **`Per day $0.19`, `Per year $67.20`** | **🔴 HC** | → `Per day {value}` | **Computed values baked into text** |
| **Footnote** | `footnote` **`hidden=true`** | **LANG** | Language pack | ⚠️ **Hidden.** `CH-4` requires a footnote |

## 1-4. Route selection

| Element | Design value | Class | Note |
|---|---|---|---|
| Title | `Pick where you trade` | **LANG** | |
| Description | `Every route pays back a share of your tr...` | **LANG** | |
| **Row order** | **DEX → CEX → Broker** | **🔴 HC** | ⚠️ Disagrees with `GL-2` and `CH-4` |
| 3D icons | `3D icon / Swap`, `/ Stack`, `/ Chart` | **ASSET** | |
| DEX row name | `Decentralised exchanges` / `For traders who keep their own keys` | **LANG** | |
| DEX subcopy | `Paste your wallet, never connect` | **LANG** | |
| CEX row name | `Centralised exchanges` / `For futures traders on exchanges` | **LANG** | |
| CEX subcopy | **`Paid daily, withdraw from 10 USDT`** | **LANG** | ⚠️ Minimum baked into copy |
| Broker row name | `Brokers` / `For forex and CFD traders` | **LANG** | |
| Broker subcopy | `Forex, commodities and indices` | **LANG** | |
| `PARTNERS` label | Fixed | **LANG** | |
| **DEX logos** | Lighter, ApeX, EdgeX, Aster **(4)** | **BO (ASSET)** | |
| **CEX logos** | **16** (see 1-5) | **BO (ASSET)** | ⚠️ Count needs confirming |
| **Broker logos** | INFINOX **plus one empty circle** | **BO (ASSET)** | ⚠️ **RS Finance logo not produced** |
| `UP TO` label | Fixed | **LANG** | |
| **Rate value** | **`rate value`** | **CALC or BO** | The design treats it as a variable. **Better than the PRD's hardcoded 90 / 30 / 84%** |
| Unit copy | `trading fee rebate` / `futures cashback` / `rebates` | **LANG** | |
| Footnote | `up to footnote` | **LANG** | |

## 1-5. 🔴 The exchange list differs between two places

The CEX list differs within the same page.

| Logo grid (16) | Comparison table (16 rows) |
|---|---|
| Binance, OKX, Bitget, Bybit, Gate.io, MEXC, **WOO X Pro**, BingX, DeepCoin, **Bitmart**, KuCoin, **HTX**, **CoinCatch**, **Toobit**, **Flipster**, LBank | Bitget, OKX, Bybit, Binance, MEXC, Gate, DeepCoin, BingX, **BitMEX**, LBank, **BlockFin**, Kucoin, **Zoomex**, **Bitunix**, **BioFin**, **BVOX** |

**In both (10):** Binance, OKX, Bitget, Bybit, Gate, MEXC, BingX, DeepCoin, KuCoin, LBank
**Logo grid only (6):** WOO X Pro, Bitmart, HTX, CoinCatch, Toobit, Flipster
**Comparison table only (6):** BitMEX, BlockFin, Zoomex, Bitunix, BioFin, BVOX

**Both must be generated from published records.** Drawn separately, as they are now, they will disagree forever.

**`RT-6`'s "16 CEX marks" matches the design.** The PRD body, however, says 17.

**Decided (doc 03, D-1): change `16` to `17`. A mechanical fix, no discussion needed.** The partner count is 23 = 17 CEX + 4 DEX + 2 brokers. This was first written up as "the real partner count needs confirming", but **D-1 had already settled it.**

What remains is that **the logo grid and the comparison table both show 16 while listing different exchanges** (1-5 above).

## 1-6. Partner comparison table

| Element | Design value | Class | Note |
|---|---|---|---|
| **Title** | **`Compare cashback across 23 partners`** | **🔴 HC** | → `across {n} partners` |
| Search | `<TextField>` | **LANG** | Placeholder needs confirming |
| Filter chips | `All`, `Exchanges`, `DEXs`, `Brokers` | **LANG** | |
| View toggle | `View switch (list view on, tap shows cards)` **hidden** | — | Hidden |
| Columns | `#`, `Exchange`, `Cashback`, `Final Taker`, `Final Maker`, `Monthly cashback`, `Rating` | **LANG** | All columns sortable |
| **`Live Campaigns` column** | **hidden** | — | ⚠️ A hidden column exists |
| Row numbers | 1–16 | **CALC** | |
| Exchange logo and name | 16 | **BO** | |
| **Cashback** | `50%`, `25%`, `45%`, `20%`, `40%`, `35%`, `70%`, `50%`, `70%`, `65%`, `70%`, `65%`, `50%`, `85%`, `70%`, `60%` | **BO** | Filled with dummy values |
| **Final Taker / Maker** | **`final taker` / `final maker` (placeholders)** | **BO** | ⚠️ **Real values undecided** |
| **Monthly cashback** | `$30.00`, `$12.50`, … | **CALC** | Based on the calculator volume |
| **Rating** | **Only three have values** — Bitget `4.2 (23)`, OKX `4.6 (41)`, Gate `3.9 (27)`. **The other 13 read `rating not applicable`** | **LIVE** | ⚠️ Source undefined |
| `tag / highest payout` | Attached to **Bitunix (85%)** | **CALC** | Appears to key off the highest overall rate |
| Join button | `<Button>` | **LANG** | |
| Referral link | — | **BO** | `EXT-10` |

### 🔴 The comparison table has no DEX rows

The `DEXs` filter chip exists, but **all 16 rows are CEX.** There is no row design for what a DEX selection should show.

The values a DEX row would carry also need defining.

| Column | For a DEX |
|---|---|
| `Cashback` | Available (the rate) |
| `Final Taker` / `Final Maker` | **Available — DEXs have maker/taker too.** Note Lighter Standard is 0% |
| `Monthly cashback` | Computable |
| **`Rating`** | **Available, since DEX reviews are allowed (A-17).** At launch there will be no reviews, so `rating not applicable` |

## 1-7. Guest reason cards

| Element | Design value | Class |
|---|---|---|
| Title | `Why sign up with TetherMax?` | **LANG** |
| Card 1 | `Support in 2 minutes` / `Responsive customer support, query atten...` / `Speak to us →` | **LANG** |
| Card 2 | **`More cashback from events`** / `Earn more cashbacks by completing tasks ...` / `See Benefits →` | **LANG** |
| Card 3 | **`Invite friends, earn more`** / `Grow your cashback when you invite partn...` / `Find out more →` | **LANG** |
| Three icons | `magnific_*` images | **ASSET** |

⚠️ **Cards 2 and 3 are CEX-only content.** They appear identically on the DEX page (see 2-9).

---

# 2. DEX overview page

Total height **7,618px**, nine sections.

## 2-1. Hero

| Element | Design value | Class | Note |
|---|---|---|---|
| Background | `conveyor banner (Light: material_r08_light; Dark: material_r08_dark)` | **ASSET** | Separate asset per theme |
| H1 | `headline (DX-1)` | **LANG** | |
| Lede | `lede (C-28)` | **LANG** | ⚠️ The PRD's `Connect a wallet` error needs checking |
| Two buttons | `<Button>` ×2 (DEX Overview / Guide to DEX) | **LANG** | Anchor scroll |
| **Risk disclaimer** | **`risk disclaimer (keep visible)`** | **LANG** | The design annotates "keep visible" explicitly |

## 2-2. Partner DEXs at a glance

| Element | Design value | Class | Note |
|---|---|---|---|
| Title | `Partner DEXs at a glance` | **LANG** | |
| **Subline** | **`Volume and open interest on our partner ...`** | **LANG** | ⚠️ **The PRD says "TVL and 24H volume from DefiLlama, as of {date}".** The design says "open interest" |
| Link | `link / hub compare` | **LANG** | |
| **Card order** | **Lighter → Aster → EdgeX → ApeX** | **🔴 HC** | → BO display priority |
| Logo | `Platform logo` slot → `DEX / Mark` | **BO (ASSET)** | |
| Name | ⚠️ **All four text layers read `Lighter`** | **BO** | Component overrides not applied |
| `Up to` + rate | ⚠️ **All four read `20%`** | **BO** | Dummy value |
| Volume | ⚠️ **All four read `$1.485B`** | **LIVE** | Dummy value |
| TVL | ⚠️ **All four read `$1.12B`** | **LIVE** | Dummy value |
| Two labels | `label` ×2 | **LANG** | Content not recorded |

## 2-3. Exchange vs DEX comparison

| Element | Design value | Class |
|---|---|---|
| Title | `Who holds your money changes.\nYour cashb...` | **LANG** |
| Lede | `On an exchange, the exchange holds your ...` | **LANG** |
| Panel heading | `ON AN EXCHANGE` / `The exchange holds them` | **LANG** |
| Panel heading | `ON A DEX` / `You hold the keys` | **LANG** |
| 3D object | `3D lock (arrives on the DEX side)` 278×278 | **ASSET** |
| Seam badge | `seam badge (key crosses here)` | **ASSET** |

### The six comparison rows

| Row | Exchange | DEX | Class |
|---|---|---|---|
| `Who holds your funds` | `The exchange` | `You, in your own wallet` | **LANG** |
| `How you sign up` | `Account with an identity check` | `Email or a wallet, no KYC check` | **LANG** |
| `How you link to TetherMax` | `Your exchange UID` | `Your wallet address, pasted` | **LANG** |
| `Where cashback is paid` | `Your TetherMax balance` | `Your DEX account, paid by the DEX` + chip `Your cashback` | **LANG** |
| `Where you withdraw` | **`On TetherMax, from 10 USDT`** | `On the DEX, no TetherMax minimum` | ⚠️ **Minimum baked in** |
| **`Event and invite rewards`** | `Yes` | **`Quiz rewards only, claimed to an exchang...`** | 🔴 **See below** |

### 🔴 The `Event and invite rewards` row differs in three places

| Source | DEX value |
|---|---|
| **PRD `DX-12`** | `None for DEX trading` |
| **The actual design** | **`Quiz rewards only, claimed to an exchange...`** |
| **Our decision (A-09)** | Event rewards **excluded entirely** |
| **Our decision (A-14, A-17)** | Missions and reviews may be triggered by DEX activity, but **rewards are claimed only to a CEX UID** |

The design's "quiz rewards only, claimed to an exchange account" is **closer to our decision.** However, the **DEX quiz module has been confirmed to carry no rewards** (`LE-9`, `LE-10`), so whether "Quiz rewards only" is correct still needs checking.

**This single line must be rewritten once settled.** It is the sentence from which users understand the DEX reward policy.

## 2-4. Education block (bento tiles)

An asymmetric 2×2: row 1 = 700 + 476, row 2 = 476 + 700.

| Tile | Eyebrow | Title | Body | 3D |
|---|---|---|---|---|
| 1 | `CUSTODY` | `You hold the keys.` | `Your collateral stays under your control...` | hidden, replaced by an image |
| 2 | `ORDER BOOK` | `Onchain order book` | `Onchain matching via rollup or sequencer...` | `DEX / 3D icon` 270×270 |
| 3 | `PAYOUT` | `Paid by the DEX, into your account` | `Your trades are tracked through our refe...` | hidden, `magnific_*` image |
| 4 | `TRADING COSTS` | `Low fees don't always mean low trading c...` | `Compare liquidity, slippage, funding, an...` | hidden, `magnific_*` image |

All **LANG**. Nothing here varies by partner.

⚠️ **Three of the 3D icons are `hidden` and replaced by `magnific_*` images.** Whether these are final or temporary needs confirming.

## 2-5. Venue cards (2×2) — **the core of DEX onboarding**

**Card order: Lighter → ApeX / EdgeX → Aster** (matches `DX-4`; differs from "at a glance")

| Element | Design value | Class | Managed in |
|---|---|---|---|
| Section title | `Our Partner Decentralised Exchanges` | **LANG** | Language pack |
| Section description | `Pick one, join through our link, then pa...` | **LANG** | Language pack |
| Mark | `DEX / Mark` 40×40 | **BO (ASSET)** | Exchange record |
| Name | `Lighter` | **BO** | Exchange record |
| **Offer — three parts** | `Up to` + **`20%`** + `trading fees rebate` | **BO** | **Maps to `ELC-4` Line 1/2/3** |
| **Metrics** | **`TVL $770.86M 24H Vol $6.8M, −2%`** | **LIVE** | DefiLlama. **Includes day-over-day change** |
| Source | `Source: DefiLlama, as of 10:42 UTC.` | **LANG + LIVE** | |
| `Deposit:` | Label | **LANG** | |
| Deposit chips | `chip / fiat`, `chip / crypto` | **BO** | `ELC-4` checkboxes |
| **Four benefit lines** | Check icon + text | **BO, per language** | `ELC-5`, 50 characters each |
| Two buttons | `<Button>` ×2 (Learn More / Get Started) | **LANG** | |
| Links | — | **BO** | `ELC-6` |

### The `ELC-4` field mapping is confirmed

| `ELC-4` field | Limit | Design counterpart |
|---|---|---|
| Line 1 (small) | 20 chars | **`Up to`** |
| Line 2 (big) | **10 chars** | **`20%`** |
| Line 3 (small) | 30 chars | **`trading fees rebate`** |

An earlier note said "landing Line 2 is 10 characters while the detail Right Box is 4, so they disagree". In fact **10 characters is appropriate for a rate string such as `20%`**; only the detail page's 4-character limit is tighter.

### Lighter benefit copy, as built

```
Trade crypto, RWAs and pre IPO perps onchain
Earn Lighter points while you trade
Leverage up to 50x on selected markets
0% maker and taker fees on Standard accounts
```

## 2-6. The three-step path

| Element | Design value | Class |
|---|---|---|
| Title | `A simple 3 step path` | **LANG** |
| Progress line | `progress line (fills as you scroll)` + three nodes + `filled part (step 2 shown active)` | — |
| STEP 1 | `Create a Web 3 Wallet` / `Install a self-custody wallet, or sign u...` / `About 2 minutes` | **LANG** |
| STEP 2 | `Join the DEX through our link` / `Deposit funds and connect your wallet on...` / `About 3 minutes` | **LANG** |
| STEP 3 | `Trade & get rewarded` / `The DEX pays your cashback into your own...` / `From your next trade` | **LANG** |
| 3D assets | `206:52394`, `206:52389`, `206:52383` | **ASSET** |
| Bottom button | `join button` | **LANG** |

**All fixed copy.** The per-partner step guides (`EDC-16`, `EDC-17`) live separately on the **DEX detail page**. Do not confuse the two.

## 2-7. Learn and Earn band

| Element | Design value | Class |
|---|---|---|
| Eyebrow | `LEARN AND EARN` | **LANG** |
| Title | `Learn DEX trading in short lessons.` | **LANG** |
| Body | `Short lessons on decentralised perps, th...` | **LANG** |
| Button | `join button` | **LANG** |
| Image | `Image / icon11_rocket_4k` 416×416 | **ASSET** |

✅ **No copy promises a reward.** This is consistent with the DEX module carrying none.

## 2-8. Final CTA band

| Element | Design value | Class |
|---|---|---|
| Title | `Your keys. Your trades.\nOur cashback.` | **LANG** |
| Body | `Join TetherMax, pick a partner DEX, and ...` | **LANG** |
| Button | `join button` | **LANG** |
| Background | `TetherMax_keychain_loop_1080`, `seamless-transition` | **ASSET** |

`always dark, the last hook` — this band stays dark regardless of theme.

## 2-9. Guest reason cards

**Identical to the Hub's three cards.** The same component is reused.

⚠️ **Card 2 `More cashback from events` and card 3 `Invite friends, earn more` only happen on CEX.** Showing "earn more cashback from events" and "earn more by inviting friends" on the DEX page contradicts the comparison section directly above it, which states that DEX carries no event or invite rewards.

**Following decision A-09, these two cards need handling on the DEX page** — hidden, qualified, or replaced with DEX-specific cards.

---

# 3. Totals by category

| Category | BO | LANG | LIVE | CALC | ASSET | **HC** |
|---|---:|---:|---:|---:|---:|---:|
| **Hub** hero | 0 | 2 | 0 | 0 | 6 | 0 |
| **Hub** calculator | 2 | 10 | 0 | 4 | 0 | **5** |
| **Hub** route selection | 3 | 11 | 0 | 1 | 4 | **2** |
| **Hub** comparison table | 4 | 5 | 1 | 3 | 0 | **1** |
| **Hub** guest cards | 0 | 7 | 0 | 0 | 3 | 0 |
| **DEX** hero | 0 | 4 | 0 | 0 | 2 | 0 |
| **DEX** at a glance | 4 | 4 | 2 | 0 | 1 | **1** |
| **DEX** comparison section | 0 | 16 | 0 | 0 | 2 | 0 |
| **DEX** education block | 0 | 12 | 0 | 0 | 4 | 0 |
| **DEX** venue cards | **9** | 5 | 2 | 0 | 1 | **1** |
| **DEX** three-step path | 0 | 11 | 0 | 0 | 3 | 0 |
| **DEX** Learn and Earn | 1 | 4 | 0 | 0 | 1 | 0 |
| **DEX** final CTA | 0 | 3 | 0 | 0 | 2 | 0 |
| **DEX** guest cards | 0 | 7 | 0 | 0 | 3 | 0 |
| **Total** | **23** | **101** | **5** | **8** | **32** | **10** |

**There are 101 language-pack entries.** Translation volume is that figure multiplied by the number of supported languages.

---

# 4. Regrouped by backoffice screen

## 4-1. Exchange record (`Exchange > exchange list > edit`)

| Field | What it drives |
|---|---|
| Exchange name, icon, logo | Logo grid, comparison table, at-a-glance tiles, venue card marks |
| Exchange Type | Route classification, partner counts, comparison-table filters |
| maker / taker fee | Calculator, comparison table `Final Taker` / `Final Maker` |
| **Referral link** (`EXT-10`) | `Get Started`, `Join {partner}`, every outbound link |
| ~~Withdrawal deep link (`EXT-11`)~~ | **Retired in V2** — it is not a withdrawal path. Nothing reads the field → decision `N-6` |
| Visibility and priority | Listing and ordering |

## 4-1-1. 🔴 Neither new area **has a menu location** (2026-10-22)

**🔧 Corrected (2026-10-22).** The location **is** defined. `NAV-1` creates a new top-level menu called **`Cashback Products`** holding `Spending Estimate`, `DEX Landing Page` and `Brokers`.

> **Why its own top level** — it separates records from content. The `Exchanges` menu holds **partner records (one row per partner)**; this menu holds **page content**. **Registering a record does not put it on the landing page.**

What follows is the candidate analysis written before the location was found.

| Candidate | Rationale | Problem |
|---|---|---|
| **A new top-level menu** | Both are editors in their own right and **belong to no single exchange** | One more menu |
| Under `Pre-login landing page` | ELC fills **the Venue cards on that page** | **SPE is left with nowhere to go** |
| Under `Exchange` | Natural if they were per-exchange settings | **SPE is not per-exchange** — it holds the slider range and the rates for the whole calculator |

> **Decide before development starts. The menu decides who owns the screen.**
>
> ※ The prototype showed these under `Exchange` for a while. That was **a guess, not a decision.** It now reads `(menu location TBD)`.

---

## 4-2. Spending Estimate

**Calculator-only. All four currently hardcoded values must move here.**

| Field | What it drives |
|---|---|
| Tabs (CEX / DEX / Brokers) | Route tabs |
| Partner selection | PARTNER select |
| **Min / Max spend** | **Slider range `$1K`–`$250K`** |
| **Two rates** | **`Cashback, 20%`, `Lighter Premium taker, 0.0280%`** |

## 4-3. Landing content editor (`ELC`)

**Venue cards only. Per language. Nine of the 23 BO items live here.**

| Field | Design counterpart | Limit |
|---|---|---|
| Line 1 | `Up to` | 20 chars |
| Line 2 | `20%` | 10 chars |
| Line 3 | `trading fees rebate` | 30 chars |
| Deposit | `chip / fiat`, `chip / crypto` | Required |
| Bullet 1–4 | The four benefit lines | 50 chars each |
| Learn More URL | Left button | https |
| Get Started URL | Right button | https |
| **TVL endpoint** (`ELC-12`) | `TVL $770.86M` | |
| **24H volume endpoint** (`ELC-13`) | `24H Vol $6.8M, −2%` | **Includes the change rate** |

⚠️ **`ELC-7`–`ELC-11` are missing numbers.** Nothing in the design corresponds to them, so they appear to have been deleted. This needs confirming.

## 4-4. Display priority (`Edit Display Priority`)

**DEX ordering is used twice on the same page with different values.**

| Place | Order |
|---|---|
| At-a-glance tiles | Lighter, **Aster**, EdgeX, **ApeX** |
| Venue cards 2×2 | Lighter, **ApeX**, EdgeX, **Aster** |

**Both must read one setting.**

## 4-5. Language pack — **1,515 entries confirmed** (2026-10-21)

**101 entries × 15 languages = 1,515.**

### The rule (decision C-1)

```
Area where the backoffice does NOT offer all 15 languages
   → supplied through the hardcoded language pack, all 15 languages
      ← the 101 LANG entries in this document sit here

Area where the backoffice offers KO/EN only
   → KO/EN entered; every other language falls back to EN
```

| Class | Entries | Languages | Total |
|---|---:|---|---:|
| **LANG — hardcoded language pack** | 101 | **all 15** | **1,515** |
| **ADMIN — operator-managed** | 23 | inherits each area's existing range | — |

> **The 23 operator-managed entries need no separate survey.** DEX follows **the same pattern as CEX**,
> inheriting whatever language range each admin screen already supports. (decision Q5)

### Confirmed by MAX-466

The benefits area (ADMIN) takes **KO/EN only**.

```
amountMainLabel_ko / _en     (required)
amountSubLabel_ko  / _en     (optional)
title_ko / _en               (required, ≤100 chars)
subtitle_ko / _en            (required, ≤200 chars)
ctaLabel_ko / _en            (required, ≤30 chars) ← new field
```
> *"Language fallback: EN used if other language requested and not KO"*

### Confirmed by Maxboard

The Maxboard PRD has the same split.
- **Notes: 15 languages** (REQ-108) — hardcoded language pack
- Benefit title / subtitle: **KO/EN** — backoffice entry
- SEO title and description: **6 languages**; OG image: **KO/EN**

→ **Even inside one service the language range differs by area.** It is not a blanket 15.

---

# 5. What needs action

## 5-1. 🔴 Move from hardcoded to backoffice or derived (10 items)

| # | Element | Current | Move to |
|---|---|---|---|
| 1 | Calculator cashback label | `Cashback, 20%` | `Cashback, {rate}%` ← `SPE` |
| 2 | Calculator fee description | `Lighter Premium taker, 0.0280%` | Composed from variables ← BO + `SPE` |
| 3 | Calculator per-day figure | `Per day $0.19` | `Per day {value}` ← CALC |
| 4 | Calculator per-year figure | `Per year $67.20` | `Per year {value}` ← CALC |
| 5 | Default volume | `$100,000` | `SPE` |
| 6 | Slider range | `$1K` – `$250K` | `SPE` |
| 7 | Comparison table title | `across 23 partners` | `across {n} partners` ← CALC |
| 8 | Route row order | DEX → CEX → Broker | BO, or confirm the intent |
| 9 | At-a-glance order | Lighter, Aster, EdgeX, ApeX | `Edit Display Priority` |
| 10 | Venue card order | Lighter, ApeX, EdgeX, Aster | Same |

## 5-2. 🔴 Design work still needed (6 items)

| # | Item | Detail |
|---|---|---|
| 1 | **Comparison table DEX rows** | The `DEXs` filter exists but no row design does |
| 2 | **Exchange list mismatch** | The 16-logo grid and the 16-row table differ by six entries each |
| 3 | **Calculator footnote** | `hidden`, while `CH-4` requires it |
| 4 | **At-a-glance dummy values** | All four cards identical, every name layer reads `Lighter` |
| 5 | **Broker logo** | RS Finance is an empty-circle placeholder |
| 6 | **Hero background** | `John placeholder; live: ripple shader` |

## 5-3. 🔴 Copy that must change once policy is settled (3 items)

| # | Element | Current | Settled position |
|---|---|---|---|
| 1 | Comparison section `Event and invite rewards`, DEX value | `Quiz rewards only, claimed to an exchange...` | 🟢 **Settled 2026-10-23.** ~~A-09 excludes them~~ → **A-1 and A-2 give DEX both event and invite rewards.** The copy becomes **same as CEX**. `Quiz rewards only` is **wrong** |
| 2 | Guest reason cards 2 and 3 | `More cashback from events`, `Invite friends, earn more` | Need handling on the DEX page |
| 3 | Two places with the minimum baked in | `On TetherMax, from 10 USDT`, `Paid daily, withdraw from 10 USDT` | Make variable, served from the backend |

## 5-4. 🟠 Undefined items (4)

| # | Item |
|---|---|
| 1 | Data source for the comparison table `Rating` |
| 2 | Real values for `Final Taker` / `Final Maker` |
| 3 | Selection rule for `tag / highest payout` |
| 4 | Purpose of the hidden `Live Campaigns` column |

## 5-5. 🟡 PRD and design disagree (2)

| # | Item | PRD | Design |
|---|---|---|---|
| 1 | At-a-glance subline | `TVL and 24H volume from DefiLlama, as of {date}` | `Volume and open interest on our partner ...` |
| 2 | Comparison section title | `Who holds your money changes. Your DEX cashback does not.` | `Who holds your money changes.\nYour cashb...` (`DEX` possibly dropped) |

---

# 6. Remaining work

| # | Item | Note |
|---|---|---|
| 1 | **Obtain the real copy** for text whose content is not in the layer name | `headline`, `subhead`, `lede`, `label`, `up to footnote`, `value` and so on. Needed to map language-pack keys |
| 2 | Check **how elements differ across Hub states H2–H14** | This document is based on H1 (guest). The DEX balance panel appears in H5, H6, H8, H9 and H10 |
| 3 | Check **dark-mode differences** | Assets are split per theme (`material_r08_light` / `_dark`) |
| 4 | Check **mobile layouts** | This document is based on desktop at 1440 |

---

# 7. Added 2026-10-21 — four new backoffice items

Analysis of the six existing PRDs and the Maxboard PRD adds **four backoffice work items.**
Source decisions: `../6_기존PRD_분석/확정_결정_기록_20261021.md`.

| # | Item | Class | Basis |
|---|---|---|---|
| 1 | **Exchange Guide → UID Ownership Verification** slide registration | **New build** | MAX-431 |
| 2 | **Add the four DEXs to the league-creation exchange dropdown** | Extension | MAX-10 |
| 3 | **Extend the aggregation-date dropdown from 4 to 7 days** | Extension | decision E-2 |
| 4 | **Manual DEX linking** | New build | decision J-3 |
| **5** | **Manual push audience filter — reflect DEX** | Extension | requested 2026-10-21 |
| **6** | **Email campaign audience filter — reflect DEX** | Extension | requested 2026-10-21 |

---

## 7-1. 🔴 New — `Exchange Guide → UID Ownership Verification`

A backoffice section **MAX-431 instructs us to create.** It is **new for CEX as well** — not DEX-driven.

> *"[New] Backoffice — add **"UID Ownership Verification"** section under **"Exchange Guide"**:
> UI for registering and managing per-exchange mobile/PC slides (title + image + description text)
> that populate the ownership claim page in **real time**"*

### Structure

```
Exchange Guide
 └─ UID Ownership Verification
     └─ select exchange
         ├─ mobile slides   [1] title + image + description
         │                  [2] title + image + description
         │                  [3] …
         └─ PC slides       [1] [2] [3] …
```

| Rule | Detail |
|---|---|
| Device split | **Register mobile and PC separately.** Only the matching set is shown |
| Dot indicator | **Automatic at two or more slides.** Hidden at one |
| Propagation | **Real time** |
| Replaces | The existing YouTube guide embed is **removed** |
| PC layout | Slide area and file-attachment area sit **side by side in two columns** |

### ★ DEX production volume — **not required** (2026-10-22)

```
(was) 4 DEXs × 2 device types × N slides = at least 8 sets
(now) not required — DEX does not support ownership verification
```

**The section itself is still new work.** MAX-431 calls for it **on the CEX side**; only the DEX sets
drop out. Content BD no longer needs accounts on the four DEXs for this.

The current design (O3) shows **three steps** (`Step 1 of 3`).
Step 1 reads: *"Start recording, then disconnect your wallet — Start your screen recording, open Lighter, and disconnect your wallet from the account menu at the top right."*

> **Owner: content BD** (decision B-4). Screenshots require a real account on each DEX.

### Additional admin-side requirements (CEX only)

Ownership claims arrive as **video files** (MP4/MOV, 100 MB). If CEX previously used images, the storage and playback requirements differ.
**DEX rows never reach this queue, so no video player is needed on the DEX side.**

| Item | Requirement |
|---|---|
| Review screen | **Video player** required |
| Rejection | **Reason entry** mandatory (surfaced to the user via `View reason`) |
| Deadline | **10 minutes.** Auto-fails on no response |
| Alerting | Slack alert on submission — DEX uses **the same channel** (decision J-4) |

---

## 7-2. League creation — add the four DEXs to the exchange dropdown

Field **m** of the MAX-10 league-creation form.

```
a. Title                       g. OG image (KO)
b. Subtitle                    h. OG image (EN)
c. Top banner image (mobile)   i. SEO title (KO ≤35)
d. Top banner image (PC)       j. SEO title (EN ≤60)
e. Prize money by rank (table) k. SEO description (KO ≤70)
f. P0–P6 periods               l. SEO description (EN ≤140)
                               m. Running exchange dropdown  ← ★ add the four DEXs
```

| Constraint | Detail |
|---|---|
| One league = one exchange | **1:1.** Multiple exchanges cannot share a league |
| Concurrency | Allowed. The **same exchange may be reused** |
| Individual vs team | **Pick one.** Running both requires two leagues |
| Post-creation edits | Title, Subtitle, banners, OG, SEO **only.** Exchange, periods and type are locked |

> League scoring is **cashback-based** (`1 USDT of commission cashback = 1 point`), so DEX works as-is.
> **DEX cashback also counts** toward the team-creation thresholds (500 USDT cumulative / 100 USDT in 30 days). (decision B-3)

---

## 7-3. Aggregation-date dropdown — 4 days → 7 days

The settlement admin's aggregation-date dropdown currently reaches only **4 days back**.

**Lighter settles weekly (Monday, covering the prior Mon–Sun)**, so **7 days** are needed.

| Exchange | Range needed |
|---|---|
| **Lighter** | **7 days** |
| ApeX | 1 day (hourly → rolled up) |
| EdgeX | 1 day |
| Aster | 1 day |

**Decision E-2: extend it.**

---

## 7-4. Manual DEX linking

**Decision J-3: build it.**

Not because an API is missing, but because **the ledger arrives late.**
Lighter settles weekly, so a trader who traded on Friday sits for **up to three days "linked, but showing zero."**
Without a manual path, any support ticket raised in that window is a dead end.

### Approval conditions

| Condition | Rule |
|---|---|
| **Required** | **The wallet must exist in the partner ledger** |
| **Operator discretion** | **None.** Absent from the ledger means it cannot be approved |
| Rejection | Reasons must be **coded** |

### States

```
submitted → under review → approved / rejected (with reason)
```

> Mirrors the existing CEX manual-link flow, except **the identifier is a wallet address, not a UID.**


---

## 7-5. 🔴 Manual push — reflect DEX in the audience filter

**Menu path:** `Push > Manual push > [Select audience] > Push selection`
Six conditions combine to narrow the send list.

```
┌ 1. Member type     [All] [Has commission cashback] [No commission cashback]
┌ 2. Commission cashback   Amount type ▾  [min] ~ [max]
│  2-1. Event reward       Amount type ▾  [min] ~ [max]
┌ 3. Withdrawal      [All] [Has withdrawn] [Never withdrawn]
┌ 4. Last access     [start] — [end]
┌ 5. Linked exchanges  ( )AND (●)OR  [Select all] [WOO X Pro] … [None]
┌ 6. Date            Date type ▾  [start] — [end]
                                            [Search] [Reset]
Recipients: 0            [ Confirm audience ]
```

### ① Condition 5 `Linked exchanges` — add a DEX group (direct request)

```
Today      [Select all] [WOO X Pro] [Bitget] … [None]        ← CEX only

Requested  CEX  [All CEX] [WOO X Pro] [Bitget] …
           DEX  [All DEX] [Aster] [Lighter] [ApeX] [EdgeX]   ★ new
                [None]                                        ← outside both
```

| # | Change | Class |
|---|---|---|
| 1 | Add four DEX chips | **DERIVED** — from the exchange record |
| 2 | Add an `All DEX` bulk-select chip | Development |
| 3 | Rescope `Select all` to `All CEX` | **Policy decision first** |
| 4 | Visually separate CEX and DEX groups | Design |
| 5 | Move the `None` chip outside both groups | Development |

**Three decisions needed**

| # | Question | Options |
|---|---|---|
| 1 | Scope of `Select all` | (A) keep global / **(B) rename to `All CEX`, add `All DEX`** / (C) group-header checkboxes |
| 2 | Migrating saved conditions | Needs a ruling if (B) is chosen |
| 3 | Meaning of `None` | (a) no CEX and no DEX / (b) no CEX only → **(a) recommended** |

> **Why (a):** DEX-only members are reachable via `All DEX`.
> Defining `None` as "no CEX" would **mix DEX-linked members into the unlinked audience and misfire sends.**

---

### ② 🔴 More important than the chips — do the other four conditions include DEX?

**Adding chips does not finish this screen.** The aggregation scope of every other condition is undefined.

| Condition | Question | If omitted |
|---|---|---|
| **1. Member type** | Does `has / has no commission cashback` count DEX cashback? | DEX-only members classed as **"none" → dropped from sends** |
| **2. Commission cashback** | Is the amount range CEX+DEX combined? | Amount-band targeting drifts |
| **2-1. Event reward** | Are DEX event rewards included? | **A-1 grants them on DEX, so they must be** |
| **3. Withdrawal** | Does `has withdrawn` include DEX withdrawals? | V2 routes DEX withdrawals through TetherMax, so **inclusion is natural** |
| **6. Date** | Does the `Date type` dropdown need DEX-specific bases? | Dropdown contents unverified |

**Proposed principle**

> **Conditions 1, 2, 2-1 and 3 should all combine CEX and DEX.**
> In V2, DEX cashback accrues to the **TetherMax balance** and is **withdrawn from TetherMax** — there is no basis to split them.
>
> Splitting condition 1 in particular would send DEX members who are earning cashback
> a push aimed at *"members with no cashback yet."*

→ **To verify:** the option lists in the `Amount type` and `Date type` dropdowns.

---

### ③ 🟠 `Payback Excel upload` — does it accept wallet addresses?

The button at the top right. It appears to be a path for uploading an audience directly.

| Question | Detail |
|---|---|
| Identifier | Presumed UID-based today. **Does it accept wallet addresses?** |
| Validation | Wallet-address format checking |
| Mixing | Can one file contain both UIDs and wallet addresses? |

→ **Upload template needs checking.**

---

### ④ 🟡 Blast radius

This screen is **manual push only**, but the left menu holds similar send features.

```
Push ← this screen / Coupon / Email / Newsletter / Invite friends
```

**A shared builder means one fix; per-screen implementations mean fixing all.** → Development to confirm.

> Details in [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) §13-9.

---

## 7-6. 🔴 Email campaign — reflect DEX in the audience filter

**Menu path:** `Email > Email campaign > New email campaign > ② Audience > [Filter]`

```
 ①Compose ─── ②Audience ─── ③Review ─── ④Test send · confirm ─── ⑤Send

 [Filter]  [Excel upload]
 ┌ Audience filter — all filters combine with AND ───────────┐
 │ [Cumulative commission ▾] [≥ ▾] [enter a value]       🗑 │
 │ [Exchange              ▾] [= ▾] [dropdown ▾]          🗑 │
 │ [+ Add filter]                                            │
 └───────────────────────────────────────────────────────────┘
```

### ① Add the four DEXs to the `Exchange` dropdown

18 options today, **CEX only**:
```
Toobit · HTX · BloFin · Bitunix · Zoomex · KuCoin · BlockFin · LBank
Gate · DeepCoin · BingX · Flipster · MEXC · OKX · Bybit · Binance
Bitget · WOO X Pro
```
→ **Add Aster · Lighter · ApeX · EdgeX**

### ② 🔴 A separate implementation from the push screen

| | Manual push (7-5) | **Email campaign (7-6)** |
|---|---|---|
| Pattern | Six fixed condition blocks | **Dynamically added key-operator-value rows** |
| Exchange input | Multi-select chips | **Single-select dropdown** |
| Operator | AND / OR toggle | **AND only, fixed** |
| Exchange list | ~40 (includes test rows) | **18** (no test rows) |

**→ Not a shared component. Both screens need fixing separately.**

### ③ 🔴 The exchange list differs by screen — this determines the effort

```
Possibility ① each screen hardcodes its own     → fix every screen
Possibility ② one API, different filters        → fix the filter conditions
Possibility ③ per-screen visibility flags       → set the flags
```
→ **Development must confirm this first.**

### ④ 🟠 Does `Cumulative commission` include DEX?

Same question as 7-5 ②. **In V2 DEX cashback is part of the TetherMax balance, so it should be combined.**

### ⑤ 🟡 To verify

Full key list behind `+ Add filter` / operator options / whether the exchange filter needs multi-select /
whether the `Excel upload` tab accepts wallet addresses

> Details and the **full inventory of exchange-selection points** are in
> [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) §13-10 and §13-11.

---

# 7-7. 📋 Full inventory of exchange-selection points

Tracks, screen by screen, where the four DEXs must be added.
**Directly verified screens are separated from inferred ones.**

| Group | Count | Status |
|---|---:|---|
| A. Verified in a capture | 10 | Applied |
| B. Verified from the PRD | 3 | Applied |
| C. Inferred — captures needed | **4** | Low priority |
| D. Closed | **7** | Captures received + decisions of 2026-10-22 (incl. the new item 24) |
| **Total** | **24** | |

## A. Verified — seen in a capture

| # | Menu path | Form | Status |
|---|---|---|---|
| 1 | `Push > Manual push > Push selection` — 5. Linked exchanges | Multi chips + AND/OR | 🔴 **Add DEX** (7-5) |
| 2 | `Email > Email campaign > Audience filter` — Exchange | Single dropdown | 🔴 **Add DEX** (7-6) |
| 3 | `Exchange > Exchange list` | Record | 🔴 Core of DEX onboarding |
| 4 | `Exchange > Referral management` | List | 🟠 Whether to add DEX rows |
| 5 | `Exchange > Exchange event management` | List | 🟠 |
| 6 | `Exchange > Exchange guide` | List + detail | 🔴 Structural change |
| 7 | `UID > UID list` | Filter + columns | 🔴 Largest change |
| 8 | `Members > Member list` | Filter + columns | 🟠 |
| 9 | `Cashback > All history` | Filter | 🟠 DEX rows must not appear |
| 10 | `Members > Partner registration modal` | Exchange select | 🔴 Mandatory change |

## B. Verified from documents — PRD-based

| # | Menu path | Form | Status |
|---|---|---|---|
| 11 | `League/Board > Create global league` — Running exchange | Single dropdown | 🔴 **Add DEX** (7-2) |
| 12 | `League/Board > Maxboard list > Create board` — Exchange | Single dropdown | 🔴 **Add DEX** (Maxboard REQ-001) |
| 13 | `Exchange guide > UID ownership verification` slides | Per-exchange registration | 🔴 **New build** (7-1) |

## C. Inferred — ★ captures needed

Places in the left menu likely to carry an exchange condition. **Not seen directly.**

| # | Menu | What to check | Likelihood |
|---|---|---|---|
| 20 | **Excel** | Exchange column in upload/download templates | Medium |
| 21 | **App** | Exchange visibility controls | Low |
| 22 | **SEO** | Per-exchange page metadata | Low |
| 23 | **Design** | Per-exchange assets and banners | Low |

> **Four are left and all are low priority.** Items 14–19 were closed by captures and decisions (section D).

## D. Closed

| # | Menu | Verdict | Action |
|---|---|---|---|
| 14 | **Coupon send** — exchange list | 🔴 **Add DEX** | Same structure as the manual-push filter and draws the same list |
| 15 | **Newsletter** | ⚪ **Out of scope** | It has no exchange dimension |
| 16 | **Event notice email** | 🔴 **Add DEX** | Same as the coupon |
| 17 | **Invite friends** — `featured exchange` dropdown | 🔴 **Add DEX** | The admin-selected `featured exchange` list gains the four DEXs (`R-3`, 2026-10-22). The **invite-reward history screen** has no exchange dimension and stays out of scope |
| 18 | **VIP** | ⚪ **Out of scope** | Not in this release; re-assessed in the next one (`R-1`, 2026-10-22) |
| 19 | **Point** | 🟢 **No change** | DEX does earn points, but the `99…` numbers in the history are **TUIDs, not exchange UIDs**, so there is nowhere to hang an exchange (`R-2`, 2026-10-22) |
| **24** | **Cashback Boost** — boost-eligible exchange picker | ⛔ **Exclude DEX** | Boost does not consider DEX; the picker must not offer them (`R-5`, 2026-10-22) |

> **Item 24 was never on this list.** When Boost flipped from `O` to `X` it entered not as a place to **add** DEX but as a place to **explicitly leave it out** — development has to confirm DEX does not leak into that picker.

## 7-7-1. 🔴 Confirm first — is there a single source for the exchange list?

| Screen | Entries | Test rows |
|---|---:|---|
| Manual push `Linked exchanges` | ~40 | **Included** |
| Email campaign `Exchange` | 18 | None |

**Same "exchange", different lists.**

```
Possibility ① each screen hardcodes its own  → fix all 23 points individually
Possibility ② one API, different filters     → fix the filter conditions
Possibility ③ per-screen visibility flags    → set the flags
```

**→ The effort estimate for adding DEX depends on this. Development must confirm it first.**

## 7-7-2. Common work — identical wherever DEX is added

| # | Item | Detail |
|---|---|---|
| 1 | **Add the four DEXs** | Aster · Lighter · ApeX · EdgeX |
| 2 | **Group separation** | Split CEX / DEX visually (where multi-select) |
| 3 | **Aggregation scope** | Confirm amount and history conditions combine **CEX + DEX** |
| 4 | **Identifier display** | `UID 123456789` ↔ `0x7a3F…c51E9` |
| 5 | **List source** | Whether the differing per-screen lists share one source |

> Per-screen detail in [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) §13-9, §13-10, §13-11.
---

# 8. Revision summary — 2026-10-21

| # | Change | Basis |
|---|---|---|
| 1 | Language pack confirmed at **101 × 15 = 1,515** (4-5) | decision C-1 |
| 2 | The 23 operator-managed entries **inherit existing patterns**; no survey needed | decision Q5 |
| 3 | **`Exchange Guide → UID Ownership Verification`** added (7-1) | MAX-431 |
| 4 | **Four DEXs added to the league exchange dropdown** (7-2) | MAX-10 |
| 5 | **Aggregation dates 4 → 7** (7-3) | decision E-2 |
| 6 | **Manual DEX linking** approval conditions set (7-4) | decision J-3 |

## 8-2. Revision — 2026-10-22

| # | Change | Basis |
|---|---|---|
| 1 | **DEX guide slide sets no longer produced** (7-1) | DEX does not support ownership verification |
| 2 | Video player on the review screen is **CEX only** | see 1 |
| 3 | Ownership queue gains an **Exchange Type filter pinned to CEX** | see 1 |
| 4 | **Duplicate DEX wallets go through support** — handling rule undecided | see 1 |

> **The section `Exchange Guide → UID Ownership Verification` is still new work.**
> It is for CEX; only the DEX sets drop out.
| 7 | **Manual push audience filter — DEX reflected** (7-5) | requested 2026-10-21 |
| 8 | **Email campaign audience filter — DEX reflected** (7-6) | requested 2026-10-21 |
| 9 | **Full inventory of exchange-selection points** (7-7) — 10 verified / 3 from PRD / **10 need captures** | 2026-10-21 |

## 8-1. Admin field definitions, now confirmed

Fields that were unverified while this document was written have since been confirmed.

| Field | Definition | ID |
|---|---|---|
| Exchange detail `Cashback (%)` | **The share of the trader's own fees returned to them.** 100 means the full fee comes back | E-1 |
| `Margin rate` | **Denominated against commission.** e.g. commission 60%, cashback 54% → 6 pp margin → margin rate 6/60 = **10%** | E-8 |
| `Commission rate` | **Not stored on the server.** Derived as `cashback rate ÷ (1 − margin rate)` | E-8 |
| Member grade `U` / `A` | **U = User** (regular member) / **A = Affiliate** (partner) | E-5 |
| `Received` / `Remaining` | **Received = amount withdrawn** / **Remaining = balance** | E-7 |
| Event reward `recoverable amount` | An admin can recover **the full remaining balance** on a UID by entering an amount | E-6 |
| Event push default | **Y.** Both `WITH` and `EXCHANGE` exist | E-3 |
| `Update (UTC)` | MAX-30's **`update_time`**. Drives the settlement-time notice on the link-success screen | B-2 |

> **Commission and margin rates for the four DEXs are undecided.** The hub comparison — Lighter 20% / ApeX 30% / EdgeX 30% / Aster 20% —
> shows **cashback rates** (user-facing); commission rates await commercial terms. (Q1)
