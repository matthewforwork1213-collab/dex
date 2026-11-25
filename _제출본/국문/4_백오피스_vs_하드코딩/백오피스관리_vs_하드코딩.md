# 백오피스 관리 vs 하드코딩 구분

작성일 2026-10-20
대상 페이지: **Cashback Hub**, **DEX 나열 페이지 (DEX overview)**
근거: **Figma 실제 디자인** + `CH-1`~`CH-17`, `RT-1`~`RT-8`, `DX-1`~`DX-13` + 백오피스 `EXT`·`ELC`·`EDC`·`SPE`

Figma: `UI-UX-Design` → `DEX` 캔버스
- Cashback Hub `27267:346729` (라이트) / `27267:346935` (다크) — **상태 14종**
- DEX overview `27267:347023` (라이트) / `27267:347246` (다크)

---

# 0. 분류 기준

| 표기 | 의미 | 변경 방법 | 배포 필요 |
|---|---|---|---|
| **BO** | **백오피스 관리.** 운영자가 값을 입력·수정 | 백오피스 | 불필요 |
| **LANG** | **언어팩 번역 키.** 고정 UI 문구를 언어별로 공급 | 언어팩 시트 | 불필요 |
| **LIVE** | **실시간·주기 데이터.** 외부 API 또는 내부 서비스 | 자동 | 불필요 |
| **CALC** | **파생값.** 다른 값에서 계산 | 원본 변경 시 자동 | 불필요 |
| **ASSET** | **미디어 에셋** | 백오피스 업로드 또는 빌드 포함 | 경우에 따라 |
| **HC** | **코드 하드코딩** | 코드 수정 | **필요** |

### PRD가 정한 원칙

| 원칙 | 출처 |
|---|---|
| 모든 사용자 노출 텍스트는 **번역 키에서 공급. 하드코딩 금지** | `NFR 7` |
| 요율·파트너 수·단위·입금 수단·혜택 문구는 **모든 곳에서 일치해야 하고 어긋나면 게시 차단** | `NFR 11` |
| **파트너 수는 게시된 레코드에서 계산.** 마크업에 숫자를 적지 않음 | `NFR 11` |
| 요율은 **백오피스 Spending Estimate에서 읽음.** 페이지 하드코딩 금지 | `CH-16` |

---

# 🔴 결론 먼저 — 디자인 검토로 확인된 문제 12건

| # | 문제 | 위치 | 심각도 |
|---|---|---|---|
| 1 | **비교표에 DEX 행이 하나도 없다.** 16행 전부 CEX인데 `DEXs` 필터 칩은 존재 | Hub 비교표 | 🔴 |
| 2 | **로고 그리드와 비교표의 거래소 목록이 서로 6개씩 다르다** | Hub | 🔴 |
| 3 | **`Cashback, 20%`** — 요율이 라벨 텍스트에 박힘 | Hub 계산기 | 🔴 |
| 4 | **`Compare cashback across 23 partners`** — 파트너 수가 문구에 박힘 | Hub 비교표 | 🔴 |
| 5 | **`Per day $0.19` / `Per year $67.20`** — 계산값이 텍스트에 박힘 | Hub 계산기 | 🟠 |
| 6 | **계산기 각주가 `hidden`** | Hub 계산기 | 🟠 |
| 7 | **at a glance 서브라인이 "Volume and open interest"인데 실제 필드는 TVL** | DEX overview | 🟠 |
| 8 | **at a glance 카드 4개가 전부 동일한 더미값** (`20%`, `$1.485B`, `$1.12B`) + **이름 레이어가 전부 `Lighter`** | DEX overview | 🟠 |
| 9 | **DEX 순서가 같은 페이지 안에서 다르다** — at a glance는 `Lighter, Aster, EdgeX, ApeX`, 2×2 카드는 `Lighter, ApeX, EdgeX, Aster` | DEX overview | 🟠 |
| 10 | **비교 섹션의 `Event and invite rewards` DEX 값이 `Quiz rewards only, claimed to an exchange...`** — PRD의 "None for DEX trading"과 다르고, 우리 결정(A-09)과도 확인 필요 | DEX overview | 🔴 |
| 11 | **`On TetherMax, from 10 USDT`** — 최소액이 문구에 박힘 | DEX overview 비교 | 🟠 |
| 12 | **게스트 이유 카드 3장이 DEX 페이지에도 그대로** — 2장이 CEX 전용 내용 | 양쪽 | 🟠 |

---

# 1. Cashback Hub

## 1-1. 설계된 상태 14종

디자인이 PRD보다 촘촘합니다. 각 상태가 별도 프레임으로 존재합니다.

| ID | 상태 | 높이 |
|---|---|---|
| H1 / HA5 | Guest, DEX route (축약 히어로 + 라우트 + 비교표) | 4200 |
| H2 | 로그인, 미연동 | 3750 |
| H3 | 로그인, CEX UID 연동 | 3750 |
| H4 | CEX 잔액 10 USDT 미만 | 3750 |
| **H5** | **로그인, DEX 지갑 연동** | 3750 |
| **H6** | **DEX 데이터 지연** | 3750 |
| H7 | 잔액 로드 실패 | 3750 |
| **H8** | **EdgeX 지갑 연동** | 3750 |
| **H9** | **Aster 레퍼럴 만료 임박** | 3750 |
| **H10** | **Aster 레퍼럴 만료** | 3750 |
| H11 | Withdraw on Lighter 다이얼로그 | 900 |
| H12 | Lighter 새 탭 열림 | 900 |
| H13 | 복귀 후 갱신 | 900 |
| H14 | 새 탭 차단 | 900 |

**`H8 EdgeX wallet linked`가 별도 상태로 존재합니다.** PRD `LK-10`은 "Figma 미디자인"이라고 했는데 **Hub에서는 설계가 있습니다.** (홈 선택 계정 카드는 별도 확인 필요)

## 1-2. 히어로

| 요소 | 디자인 값 | 분류 | 관리 위치 |
|---|---|---|---|
| 배경 | `wave bg (John placeholder; live: ripple shader)` | **ASSET** | ⚠️ **플레이스홀더.** 실제는 ripple shader |
| 라우트 배지 3종 | `badge / CEX` 240×160, **`badge / DEX` 480×320**, `badge / FX (Brokers)` 240×160 | **ASSET** | 활성 라우트가 크게 표시 |
| `badge glow` | 440×90 | ASSET | 활성 배지 뒤 광원 |
| H1 | `headline` (내용 미기재) | **LANG** | 언어팩 |
| 리드 | `subhead` | **LANG** | 언어팩 |
| 3D 오브젝트 | `3D calculator printing a receipt (asset 206:52393)` | **ASSET** | 에셋 ID 명시 |
| 핫스팟 3개 | `hotspot / CEX`, `/ DEX`, `/ Broker` | — | 라우트 탭 인터랙션 |

## 1-3. 계산기 (영수증)

| 요소 | 디자인 값 | 분류 | 관리 위치 | 비고 |
|---|---|---|---|---|
| 라벨 | `CASHBACK ESTIMATE` | **LANG** | 언어팩 | |
| 라우트 칩 | `chip label` | **LANG** | 언어팩 | 변수 |
| 라우트 탭 | `route segmented` 인스턴스 | **LANG** | 언어팩 | |
| `PARTNER` 라벨 | 고정 | **LANG** | 언어팩 | |
| 파트너 마크 | `partner mark` | **BO (ASSET)** | 거래소 레코드 | |
| 파트너명 | `Lighter` | **BO** | 거래소 레코드 | |
| 거래량 라벨 | `Monthly trading volume` | **LANG** | 언어팩 | |
| **거래량 기본값** | **`$100,000`** | **🔴 HC** | → `SPE` | |
| **슬라이더 범위** | **`$1K` ~ `$250K`** | **🔴 HC** | → `SPE` | **DEX 범위 1K~250K 확인됨** |
| 수수료 라벨 | `Trading fees` | **LANG** | 언어팩 | |
| **수수료 설명** | **`Lighter Premium taker, 0.0280%`** | **🔴 HC** | → BO 조합 | 파트너명·등급·요율이 한 문자열 |
| 수수료 값 | `value` | **CALC** | — | 변수 |
| **캐시백 라벨** | **`Cashback, 20%`** | **🔴 HC** | → `Cashback, {rate}%` | **요율이 라벨에 박힘** |
| 지급처 | `Paid into your Lighter account` | **LANG + 변수** | 언어팩 | `{DEX}` 변수화 필요 |
| 캐시백 값 | `value` | **CALC** | — | |
| 순수수료 라벨 | `Trading fees after cashback` | **LANG** | 언어팩 | |
| 순수수료 값 | `value` | **CALC** | — | |
| 합계 라벨 | `Estimated monthly cashback` | **LANG** | 언어팩 | |
| 합계 값 | `total value` | **CALC** | — | |
| **일/연 환산** | **`Per day $0.19`, `Per year $67.20`** | **🔴 HC** | → `Per day {value}` | **계산값이 텍스트에 박힘** |
| **각주** | `footnote` **`hidden=true`** | **LANG** | 언어팩 | ⚠️ **숨겨져 있음.** `CH-4`는 각주를 요구 |

## 1-4. 라우트 선택

| 요소 | 디자인 값 | 분류 | 비고 |
|---|---|---|---|
| 제목 | `Pick where you trade` | **LANG** | |
| 설명 | `Every route pays back a share of your tr...` | **LANG** | |
| **행 순서** | **DEX → CEX → Broker** | **🔴 HC** | ⚠️ `GL-2`·`CH-4`와 불일치 |
| 3D 아이콘 | `3D icon / Swap`, `/ Stack`, `/ Chart` | **ASSET** | |
| DEX 행 이름 | `Decentralised exchanges` / `For traders who keep their own keys` | **LANG** | |
| DEX 보조 문구 | `Paste your wallet, never connect` | **LANG** | |
| CEX 행 이름 | `Centralised exchanges` / `For futures traders on exchanges` | **LANG** | |
| CEX 보조 문구 | **`Paid daily, withdraw from 10 USDT`** | **LANG** | ⚠️ 최소액이 문구에 박힘 |
| Broker 행 이름 | `Brokers` / `For forex and CFD traders` | **LANG** | |
| Broker 보조 문구 | `Forex, commodities and indices` | **LANG** | |
| `PARTNERS` 라벨 | 고정 | **LANG** | |
| **DEX 로고** | Lighter, ApeX, EdgeX, Aster **(4개)** | **BO (ASSET)** | |
| **CEX 로고** | **16개** (아래 1-5) | **BO (ASSET)** | ⚠️ 수 확인 필요 |
| **Broker 로고** | INFINOX **1개 + 빈 원 1개** | **BO (ASSET)** | ⚠️ **RS Finance 로고 미제작** |
| `UP TO` 라벨 | 고정 | **LANG** | |
| **요율 값** | **`rate value`** | **CALC 또는 BO** | 디자인은 변수로 처리. **PRD의 하드코딩 90/30/84%보다 나음** |
| 단위 문구 | `trading fee rebate` / `futures cashback` / `rebates` | **LANG** | |
| 각주 | `up to footnote` | **LANG** | |

## 1-5. 🔴 거래소 목록이 두 곳에서 다릅니다

같은 페이지 안에서 CEX 목록이 다릅니다.

| 로고 그리드 (16개) | 비교표 (16행) |
|---|---|
| Binance, OKX, Bitget, Bybit, Gate.io, MEXC, **WOO X Pro**, BingX, DeepCoin, **Bitmart**, KuCoin, **HTX**, **CoinCatch**, **Toobit**, **Flipster**, LBank | Bitget, OKX, Bybit, Binance, MEXC, Gate, DeepCoin, BingX, **BitMEX**, LBank, **BlockFin**, Kucoin, **Zoomex**, **Bitunix**, **BioFin**, **BVOX** |

**양쪽에 다 있는 것 10개:** Binance, OKX, Bitget, Bybit, Gate, MEXC, BingX, DeepCoin, KuCoin, LBank
**로고에만 6개:** WOO X Pro, Bitmart, HTX, CoinCatch, Toobit, Flipster
**비교표에만 6개:** BitMEX, BlockFin, Zoomex, Bitunix, BioFin, BVOX

**둘 다 게시된 레코드에서 자동 생성되어야 합니다.** 지금처럼 각각 그려 넣으면 영원히 어긋납니다.

**`RT-6`의 "16 CEX marks"는 디자인과 일치합니다.** 다만 PRD 본문은 17곳이라고 합니다.

**확정 (03 문서 D-1): `16`을 `17`로 고칩니다. 논의 불필요한 기계적 수정입니다.** 파트너 수는 23 = CEX 17 + DEX 4 + 브로커 2입니다. 처음에 "실제 파트너 수 확인이 필요하다"고 적었는데, **D-1에서 이미 정리돼 있었습니다.**

다만 **디자인의 로고 그리드와 비교표가 16개씩이면서 구성이 서로 다른 문제는 그대로 남습니다** (위 1-5).

## 1-6. 파트너 비교표

| 요소 | 디자인 값 | 분류 | 비고 |
|---|---|---|---|
| **제목** | **`Compare cashback across 23 partners`** | **🔴 HC** | → `across {n} partners` |
| 검색 | `<TextField>` | **LANG** | placeholder 확인 필요 |
| 필터 칩 | `All`, `Exchanges`, `DEXs`, `Brokers` | **LANG** | |
| 뷰 전환 | `View switch (list view on, tap shows cards)` **hidden** | — | 숨겨짐 |
| 컬럼 | `#`, `Exchange`, `Cashback`, `Final Taker`, `Final Maker`, `Monthly cashback`, `Rating` | **LANG** | 전 컬럼 정렬 |
| **`Live Campaigns` 컬럼** | **hidden** | — | ⚠️ 숨겨진 컬럼 존재 |
| 행 번호 | 1~16 | **CALC** | |
| 거래소 로고·이름 | 16개 | **BO** | |
| **Cashback** | `50%`, `25%`, `45%`, `20%`, `40%`, `35%`, `70%`, `50%`, `70%`, `65%`, `70%`, `65%`, `50%`, `85%`, `70%`, `60%` | **BO** | 더미값으로 채워짐 |
| **Final Taker / Maker** | **`final taker` / `final maker` (플레이스홀더)** | **BO** | ⚠️ **실제 값 미정** |
| **Monthly cashback** | `$30.00`, `$12.50`, … | **CALC** | 계산기 거래량 기준 |
| **Rating** | **3곳만 값 있음** — Bitget `4.2 (23)`, OKX `4.6 (41)`, Gate `3.9 (27)`. **나머지 13곳 `rating not applicable`** | **LIVE** | ⚠️ 출처 미정의 |
| `tag / highest payout` | **Bitunix (85%)** 에 부착 | **CALC** | 전체 최고 요율 기준으로 보임 |
| Join 버튼 | `<Button>` | **LANG** | |
| 레퍼럴 링크 | — | **BO** | `EXT-10` |

### 🔴 비교표에 DEX 행이 없습니다

`DEXs` 필터 칩은 있는데 **16행 전부 CEX**입니다. DEX를 선택했을 때 보여줄 행 디자인이 없습니다.

DEX 행에 들어갈 값도 정의가 필요합니다.

| 컬럼 | DEX에서 |
|---|---|
| `Cashback` | 가능 (요율) |
| `Final Taker` / `Final Maker` | **DEX도 maker/taker가 있으므로 가능.** 다만 Lighter Standard는 0% |
| `Monthly cashback` | 계산 가능 |
| **`Rating`** | **DEX 리뷰 작성을 허용했으므로(A-17) 가능.** 단 초기에는 리뷰가 없어 `rating not applicable` |

## 1-7. 게스트 이유 카드

| 요소 | 디자인 값 | 분류 |
|---|---|---|
| 제목 | `Why sign up with TetherMax?` | **LANG** |
| 카드 1 | `Support in 2 minutes` / `Responsive customer support, query atten...` / `Speak to us →` | **LANG** |
| 카드 2 | **`More cashback from events`** / `Earn more cashbacks by completing tasks ...` / `See Benefits →` | **LANG** |
| 카드 3 | **`Invite friends, earn more`** / `Grow your cashback when you invite partn...` / `Find out more →` | **LANG** |
| 아이콘 3종 | `magnific_*` 이미지 | **ASSET** |

⚠️ **카드 2·3은 CEX 전용 내용입니다.** DEX 페이지에도 동일하게 들어가 있습니다 (아래 2-9).

---

# 2. DEX 나열 페이지 (DEX overview)

전체 높이 **7,618px**. 섹션 9개입니다.

## 2-1. 히어로

| 요소 | 디자인 값 | 분류 | 비고 |
|---|---|---|---|
| 배경 | `conveyor banner (Light: material_r08_light; Dark: material_r08_dark)` | **ASSET** | 테마별 에셋 분리 |
| H1 | `headline (DX-1)` | **LANG** | |
| 리드 | `lede (C-28)` | **LANG** | ⚠️ PRD의 `Connect a wallet` 오류 확인 필요 |
| 버튼 2개 | `<Button>` ×2 (DEX Overview / Guide to DEX) | **LANG** | 앵커 스크롤 |
| **리스크 디스클레이머** | **`risk disclaimer (keep visible)`** | **LANG** | 디자인에 "keep visible" 주석 명시 |

## 2-2. Partner DEXs at a glance

| 요소 | 디자인 값 | 분류 | 비고 |
|---|---|---|---|
| 제목 | `Partner DEXs at a glance` | **LANG** | |
| **서브라인** | **`Volume and open interest on our partner ...`** | **LANG** | ⚠️ **PRD는 "TVL and 24H volume from DefiLlama, as of {date}".** 디자인은 "open interest" |
| 링크 | `link / hub compare` | **LANG** | |
| **카드 순서** | **Lighter → Aster → EdgeX → ApeX** | **🔴 HC** | → BO 노출 순서 |
| 로고 | `Platform logo` slot → `DEX / Mark` | **BO (ASSET)** | |
| 이름 | ⚠️ **4장 전부 텍스트 레이어명이 `Lighter`** | **BO** | 컴포넌트 override 미적용 상태 |
| `Up to` + 요율 | ⚠️ **4장 전부 `20%`** | **BO** | 더미값 |
| 거래량 | ⚠️ **4장 전부 `$1.485B`** | **LIVE** | 더미값 |
| TVL | ⚠️ **4장 전부 `$1.12B`** | **LIVE** | 더미값 |
| 라벨 2개 | `label` ×2 | **LANG** | 내용 미기재 |

## 2-3. 거래소 vs DEX 비교

| 요소 | 디자인 값 | 분류 |
|---|---|---|
| 제목 | `Who holds your money changes.\nYour cashb...` | **LANG** |
| 리드 | `On an exchange, the exchange holds your ...` | **LANG** |
| 패널 제목 | `ON AN EXCHANGE` / `The exchange holds them` | **LANG** |
| 패널 제목 | `ON A DEX` / `You hold the keys` | **LANG** |
| 3D 오브젝트 | `3D lock (arrives on the DEX side)` 278×278 | **ASSET** |
| 이음새 배지 | `seam badge (key crosses here)` | **ASSET** |

### 비교 행 6개

| 행 | 거래소 | DEX | 분류 |
|---|---|---|---|
| `Who holds your funds` | `The exchange` | `You, in your own wallet` | **LANG** |
| `How you sign up` | `Account with an identity check` | `Email or a wallet, no KYC check` | **LANG** |
| `How you link to TetherMax` | `Your exchange UID` | `Your wallet address, pasted` | **LANG** |
| `Where cashback is paid` | `Your TetherMax balance` | `Your DEX account, paid by the DEX` + 칩 `Your cashback` | **LANG** |
| `Where you withdraw` | **`On TetherMax, from 10 USDT`** | `On the DEX, no TetherMax minimum` | ⚠️ **최소액 박힘** |
| **`Event and invite rewards`** | `Yes` | **`Quiz rewards only, claimed to an exchang...`** | 🔴 **아래 참조** |

### 🔴 `Event and invite rewards` 행이 세 군데서 다릅니다

| 출처 | DEX 값 |
|---|---|
| **PRD `DX-12`** | `None for DEX trading` |
| **실제 디자인** | **`Quiz rewards only, claimed to an exchange...`** |
| **우리 확정 (A-09)** | 이벤트 리워드 **전면 배제** |
| **우리 확정 (A-14, A-17)** | 미션·리뷰 트리거는 DEX 인정, **보상 수령은 CEX UID로만** |

디자인의 "퀴즈 리워드만, 거래소 계정으로 청구"는 **우리 결정에 더 가깝습니다.** 다만 **DEX 퀴즈 모듈에는 보상이 없다**(`LE-9`, `LE-10`)고 확인됐으므로 "Quiz rewards only"가 맞는지 확인이 필요합니다.

**확정 후 이 한 줄을 다시 써야 합니다.** 사용자가 DEX 보상 정책을 이해하는 핵심 문장입니다.

## 2-4. 교육 블록 (벤토 타일)

비대칭 2×2입니다. row1 = 700 + 476, row2 = 476 + 700.

| 타일 | eyebrow | 제목 | 본문 | 3D |
|---|---|---|---|---|
| 1 | `CUSTODY` | `You hold the keys.` | `Your collateral stays under your control...` | hidden, 이미지로 대체 |
| 2 | `ORDER BOOK` | `Onchain order book` | `Onchain matching via rollup or sequencer...` | `DEX / 3D icon` 270×270 |
| 3 | `PAYOUT` | `Paid by the DEX, into your account` | `Your trades are tracked through our refe...` | hidden, `magnific_*` 이미지 |
| 4 | `TRADING COSTS` | `Low fees don't always mean low trading c...` | `Compare liquidity, slippage, funding, an...` | hidden, `magnific_*` 이미지 |

전부 **LANG**입니다. 파트너별로 달라지지 않습니다.

⚠️ **3D 아이콘 3개가 `hidden`이고 `magnific_*` 이미지로 대체돼 있습니다.** 최종 에셋인지 임시인지 확인이 필요합니다.

## 2-5. Venue 카드 (2×2) — **DEX 온보딩의 핵심**

**카드 순서: Lighter → ApeX / EdgeX → Aster** (`DX-4`와 일치, at a glance와는 다름)

| 요소 | 디자인 값 | 분류 | 관리 위치 |
|---|---|---|---|
| 섹션 제목 | `Our Partner Decentralised Exchanges` | **LANG** | 언어팩 |
| 섹션 설명 | `Pick one, join through our link, then pa...` | **LANG** | 언어팩 |
| 마크 | `DEX / Mark` 40×40 | **BO (ASSET)** | 거래소 레코드 |
| 이름 | `Lighter` | **BO** | 거래소 레코드 |
| **오퍼 — 3토막** | `Up to` + **`20%`** + `trading fees rebate` | **BO** | **`ELC-4` Line 1/2/3에 대응** |
| **지표** | **`TVL $770.86M 24H Vol $6.8M, −2%`** | **LIVE** | DefiLlama. **전일 대비 변화율 포함** |
| 출처 | `Source: DefiLlama, as of 10:42 UTC.` | **LANG + LIVE** | |
| `Deposit:` | 라벨 | **LANG** | |
| 입금 칩 | `chip / fiat`, `chip / crypto` | **BO** | `ELC-4` 체크박스 |
| **benefit 4줄** | 체크 아이콘 + 텍스트 | **BO, 언어별** | `ELC-5`, 각 50자 |
| 버튼 2개 | `<Button>` ×2 (Learn More / Get Started) | **LANG** | |
| 링크 | — | **BO** | `ELC-6` |

### `ELC-4` 필드 매핑이 확인됐습니다

| `ELC-4` 필드 | 제한 | 디자인 대응 |
|---|---|---|
| Line 1 (small) | 20자 | **`Up to`** |
| Line 2 (big) | **10자** | **`20%`** |
| Line 3 (small) | 30자 | **`trading fees rebate`** |

제가 앞서 "랜딩 Line 2가 10자, 상세 Right Box가 4자라 불일치"라고 했는데, **10자는 `20%` 같은 요율 표기용**이라 적절합니다. 상세의 4자가 더 타이트한 것뿐입니다.

### Lighter benefit 실제 문구

```
Trade crypto, RWAs and pre IPO perps onchain
Earn Lighter points while you trade
Leverage up to 50x on selected markets
0% maker and taker fees on Standard accounts
```

## 2-6. 3단계 경로

| 요소 | 디자인 값 | 분류 |
|---|---|---|
| 제목 | `A simple 3 step path` | **LANG** |
| 진행선 | `progress line (fills as you scroll)` + 노드 3개 + `filled part (step 2 shown active)` | — |
| STEP 1 | `Create a Web 3 Wallet` / `Install a self-custody wallet, or sign u...` / `About 2 minutes` | **LANG** |
| STEP 2 | `Join the DEX through our link` / `Deposit funds and connect your wallet on...` / `About 3 minutes` | **LANG** |
| STEP 3 | `Trade & get rewarded` / `The DEX pays your cashback into your own...` / `From your next trade` | **LANG** |
| 3D 에셋 | `206:52394`, `206:52389`, `206:52383` | **ASSET** |
| 하단 버튼 | `join button` | **LANG** |

**전부 고정 문구입니다.** 파트너별 단계 가이드(`EDC-16`, `EDC-17`)는 **DEX 상세 페이지**에 따로 있습니다. 혼동 주의.

## 2-7. Learn and Earn 밴드

| 요소 | 디자인 값 | 분류 |
|---|---|---|
| eyebrow | `LEARN AND EARN` | **LANG** |
| 제목 | `Learn DEX trading in short lessons.` | **LANG** |
| 본문 | `Short lessons on decentralised perps, th...` | **LANG** |
| 버튼 | `join button` | **LANG** |
| 이미지 | `Image / icon11_rocket_4k` 416×416 | **ASSET** |

✅ **리워드를 약속하는 문구가 없습니다.** DEX 모듈에 보상이 없다는 점과 맞습니다.

## 2-8. 최종 CTA 밴드

| 요소 | 디자인 값 | 분류 |
|---|---|---|
| 제목 | `Your keys. Your trades.\nOur cashback.` | **LANG** |
| 본문 | `Join TetherMax, pick a partner DEX, and ...` | **LANG** |
| 버튼 | `join button` | **LANG** |
| 배경 | `TetherMax_keychain_loop_1080`, `seamless-transition` | **ASSET** |

`always dark, the last hook` — 테마와 무관하게 항상 다크입니다.

## 2-9. 게스트 이유 카드

**Hub와 완전히 동일한 3장입니다.** 같은 컴포넌트를 재사용했습니다.

⚠️ **카드 2 `More cashback from events`와 카드 3 `Invite friends, earn more`는 CEX에서만 발생합니다.** DEX 페이지에서 "이벤트로 캐시백 더 받기", "친구 초대로 더 벌기"를 보여주면, 바로 위 비교 섹션에서 "DEX는 이벤트·초대 리워드 없음"이라고 한 것과 충돌합니다.

**A-09 확정 이후 이 두 장은 DEX 페이지에서 처리가 필요합니다.** 숨기거나, 단서를 붙이거나, DEX용 카드로 교체해야 합니다.

---

# 3. 카테고리별 집계

| 카테고리 | BO | LANG | LIVE | CALC | ASSET | **HC** |
|---|---:|---:|---:|---:|---:|---:|
| **Hub** 히어로 | 0 | 2 | 0 | 0 | 6 | 0 |
| **Hub** 계산기 | 2 | 10 | 0 | 4 | 0 | **5** |
| **Hub** 라우트 선택 | 3 | 11 | 0 | 1 | 4 | **2** |
| **Hub** 비교표 | 4 | 5 | 1 | 3 | 0 | **1** |
| **Hub** 게스트 카드 | 0 | 7 | 0 | 0 | 3 | 0 |
| **DEX** 히어로 | 0 | 4 | 0 | 0 | 2 | 0 |
| **DEX** at a glance | 4 | 4 | 2 | 0 | 1 | **1** |
| **DEX** 비교 섹션 | 0 | 16 | 0 | 0 | 2 | 0 |
| **DEX** 교육 블록 | 0 | 12 | 0 | 0 | 4 | 0 |
| **DEX** Venue 카드 | **9** | 5 | 2 | 0 | 1 | **1** |
| **DEX** 3단계 | 0 | 11 | 0 | 0 | 3 | 0 |
| **DEX** Learn and Earn | 1 | 4 | 0 | 0 | 1 | 0 |
| **DEX** 최종 CTA | 0 | 3 | 0 | 0 | 2 | 0 |
| **DEX** 게스트 카드 | 0 | 7 | 0 | 0 | 3 | 0 |
| **합계** | **23** | **101** | **5** | **8** | **32** | **10** |

**언어팩 항목이 101개**입니다. 지원 언어 수를 곱한 만큼 번역이 필요합니다.

---

# 4. 백오피스 화면별로 다시 묶으면

## 4-1. 거래소 레코드 (`Exchange > 거래소 리스트 > 수정`)

| 필드 | 영향 요소 |
|---|---|
| 거래소명·아이콘·로고 | 로고 그리드, 비교표, at a glance 타일, Venue 카드 마크 |
| Exchange Type | 라우트 분류, 파트너 수 계산, 비교표 필터 |
| maker / taker fee | 계산기, 비교표 `Final Taker`/`Final Maker` |
| **레퍼럴 링크** (`EXT-10`) | `Get Started`, `Join {partner}`, 모든 아웃바운드 |
| 출금 딥링크 (`EXT-11`) | Hub DEX 패널 `Withdraw on {DEX}` |
| 노출 여부·순위 | 목록 노출과 순서 |

## 4-2. Spending Estimate

**계산기 전용**입니다. **현재 하드코딩된 4개가 전부 여기로 와야 합니다.**

| 필드 | 영향 요소 |
|---|---|
| 탭 (CEX / DEX / Brokers) | 라우트 탭 |
| 파트너 선택 | PARTNER 셀렉트 |
| **Min / Max spend** | **슬라이더 범위 `$1K`~`$250K`** |
| **요율 2개** | **`Cashback, 20%`, `Lighter Premium taker, 0.0280%`** |

## 4-3. 랜딩 콘텐츠 에디터 (`ELC`)

**Venue 카드 전용. 언어별입니다. BO 항목 23개 중 9개가 여기 있습니다.**

| 필드 | 디자인 대응 | 제한 |
|---|---|---|
| Line 1 | `Up to` | 20자 |
| Line 2 | `20%` | 10자 |
| Line 3 | `trading fees rebate` | 30자 |
| Deposit | `chip / fiat`, `chip / crypto` | 필수 |
| Bullet 1~4 | benefit 4줄 | 각 50자 |
| Learn More URL | 좌측 버튼 | https |
| Get Started URL | 우측 버튼 | https |
| **TVL 엔드포인트** (`ELC-12`) | `TVL $770.86M` | |
| **24H 거래량 엔드포인트** (`ELC-13`) | `24H Vol $6.8M, −2%` | **변화율 포함** |

⚠️ **`ELC-7`~`ELC-11`이 결번입니다.** 디자인을 봐도 추가 항목이 보이지 않아, 삭제된 것으로 보입니다. 확인이 필요합니다.

## 4-4. 노출 순서 (`Edit Display Priority`)

**DEX 순서가 같은 페이지 안에서 두 번 쓰이는데 값이 다릅니다.**

| 위치 | 순서 |
|---|---|
| at a glance 타일 | Lighter, **Aster**, EdgeX, **ApeX** |
| Venue 카드 2×2 | Lighter, **ApeX**, EdgeX, **Aster** |

**하나의 설정을 두 곳이 읽어야 합니다.**

## 4-5. 언어팩

**101개 항목**입니다. 지원 언어 수가 곱해집니다.

---

# 5. 조치가 필요한 것

## 5-1. 🔴 하드코딩 → 백오피스·파생 이관 (10건)

| # | 요소 | 현재 | 이관 대상 |
|---|---|---|---|
| 1 | 계산기 캐시백 라벨 | `Cashback, 20%` | `Cashback, {rate}%` ← `SPE` |
| 2 | 계산기 수수료 설명 | `Lighter Premium taker, 0.0280%` | 변수 조합 ← BO + `SPE` |
| 3 | 계산기 일 환산 | `Per day $0.19` | `Per day {value}` ← CALC |
| 4 | 계산기 연 환산 | `Per year $67.20` | `Per year {value}` ← CALC |
| 5 | 거래량 기본값 | `$100,000` | `SPE` |
| 6 | 슬라이더 범위 | `$1K` ~ `$250K` | `SPE` |
| 7 | 비교표 제목 | `across 23 partners` | `across {n} partners` ← CALC |
| 8 | 라우트 행 순서 | DEX → CEX → Broker | BO 또는 의도 확정 |
| 9 | at a glance 순서 | Lighter, Aster, EdgeX, ApeX | `Edit Display Priority` |
| 10 | Venue 카드 순서 | Lighter, ApeX, EdgeX, Aster | 동일 |

## 5-2. 🔴 디자인 보완이 필요한 것 (6건)

| # | 항목 | 내용 |
|---|---|---|
| 1 | **비교표 DEX 행** | `DEXs` 필터는 있는데 행 디자인이 없음 |
| 2 | **거래소 목록 불일치** | 로고 그리드 16개와 비교표 16행이 6개씩 다름 |
| 3 | **계산기 각주** | `hidden` 상태. `CH-4`가 요구 |
| 4 | **at a glance 더미값** | 4장 전부 동일값, 이름 레이어가 전부 `Lighter` |
| 5 | **Broker 로고** | RS Finance가 빈 원 플레이스홀더 |
| 6 | **히어로 배경** | `John placeholder; live: ripple shader` |

## 5-3. 🔴 정책 확정 후 문구를 고쳐야 하는 것 (3건)

| # | 요소 | 현재 | 확정 내용 |
|---|---|---|---|
| 1 | 비교 섹션 `Event and invite rewards` DEX 값 | `Quiz rewards only, claimed to an exchange...` | A-09 이벤트 리워드 전면 배제. **문구 재작성 필요** |
| 2 | 게스트 이유 카드 2·3 | `More cashback from events`, `Invite friends, earn more` | DEX 페이지에서 처리 필요 |
| 3 | 최소액 박힌 문구 2곳 | `On TetherMax, from 10 USDT`, `Paid daily, withdraw from 10 USDT` | 서버 반환값으로 변수화 |

## 5-4. 🟠 미정의 항목 (4건)

| # | 항목 |
|---|---|
| 1 | 비교표 `Rating` 데이터 출처 |
| 2 | 비교표 `Final Taker` / `Final Maker` 실제 값 |
| 3 | `tag / highest payout` 선정 기준 |
| 4 | 숨겨진 `Live Campaigns` 컬럼의 용도 |

## 5-5. 🟡 PRD와 디자인 불일치 (2건)

| # | 항목 | PRD | 디자인 |
|---|---|---|---|
| 1 | at a glance 서브라인 | `TVL and 24H volume from DefiLlama, as of {date}` | `Volume and open interest on our partner ...` |
| 2 | 비교 섹션 제목 | `Who holds your money changes. Your DEX cashback does not.` | `Who holds your money changes.\nYour cashb...` (`DEX` 누락 가능성) |

---

# 6. 남은 작업

| # | 항목 | 비고 |
|---|---|---|
| 1 | 내용이 레이어명에 없는 텍스트의 **실제 문구 확보** | `headline`, `subhead`, `lede`, `label`, `up to footnote`, `value` 등. 언어팩 키 매핑에 필요 |
| 2 | **Hub 상태 H2~H14의 요소 차이** 확인 | 본 문서는 H1(게스트) 기준. DEX 잔액 패널은 H5·H6·H8·H9·H10에 있음 |
| 3 | **다크 모드 차이** 확인 | 에셋이 테마별로 분리됨 (`material_r08_light` / `_dark`) |
| 4 | **모바일 화면** 확인 | 본 문서는 PC 1440 기준 |
