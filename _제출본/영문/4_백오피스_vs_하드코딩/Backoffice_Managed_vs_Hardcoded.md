# Backoffice-managed vs hardcoded

Written 2026-10-20
Pages covered: **Cashback Hub**, **DEX overview page**
Sources: **the actual Figma designs** + `CH-1`–`CH-17`, `RT-1`–`RT-8`, `DX-1`–`DX-13` + backoffice `EXT` / `ELC` / `EDC` / `SPE`
Korean version: `국문/4_백오피스_vs_하드코딩/백오피스관리_vs_하드코딩.md`

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
| H11 | Withdraw on Lighter dialog | 900 |
| H12 | Lighter opened in a new tab | 900 |
| H13 | Refresh after returning | 900 |
| H14 | New tab blocked | 900 |

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
| Withdrawal deep link (`EXT-11`) | Hub DEX panel `Withdraw on {DEX}` |
| Visibility and priority | Listing and ordering |

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

## 4-5. Language pack

**101 entries**, multiplied by the number of supported languages.

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
| 1 | Comparison section `Event and invite rewards`, DEX value | `Quiz rewards only, claimed to an exchange...` | A-09 excludes event rewards entirely. **Copy must be rewritten** |
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
