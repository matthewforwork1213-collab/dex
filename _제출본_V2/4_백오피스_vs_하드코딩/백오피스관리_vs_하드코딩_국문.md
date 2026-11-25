> ## ⚠️ V2 적용 안내 (2026-10-21)
>
> 이 문서는 **V1 구조**(DEX가 고객에게 직접 지급) 기준으로 작성됐습니다.
> **2026-10-20 신규 방침으로 구조가 바뀌었습니다** — 커미션 100%를 테더맥스가 받아 테더맥스가 지급합니다.
>
> | 유효성 | 내용 |
> |---|---|
> | ✅ **유효** | 하드코딩 10 / 운영자 관리 23 / 언어팩 101 / 디자인 에셋 32 — 방침 공표 13장이 그대로 인용했습니다. **전면 유효합니다.** |
> | ✅ **재검토 완료** | `Event and invite rewards` 행 · 게스트 유도 카드 2장 · 최소 출금액 문구 — **2026-10-23 처리 완료.** 5-3 참조. 카드 2장은 숨기지 않고, 최소액 값은 맞고, 비교 행만 고칩니다. |
>
> 신규 구조 전체는 `../DEX_신규방침_종합정리.md` 를 참조하십시오.

---

# 백오피스 관리 vs 하드코딩 구분

작성일 2026-10-20
대상 페이지: **Cashback Hub**, **DEX 나열 페이지 (DEX overview)**
영문본: `Backoffice_Managed_vs_Hardcoded_EN.md`
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
| ~~H11~~ | ~~Withdraw on Lighter 다이얼로그~~ | **V2 폐기** — 테더맥스에서 직접 출금 |
| ~~H12~~ | ~~Lighter 새 탭 열림~~ | **V2 폐기** |
| H13 | 복귀 후 갱신 | 900 |
| ~~H14~~ | ~~새 탭 차단~~ | **V2 폐기** |

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
| **페이백 라벨** | **`Cashback, 20%`** | **🔴 HC** | → `Cashback, {rate}%` | **요율이 라벨에 박힘** |
| 지급처 | `Paid into your Lighter account` | **LANG + 변수** | 언어팩 | `{DEX}` 변수화 필요 |
| 페이백 값 | `value` | **CALC** | — | |
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

⚠️ **카드 2 `More cashback from events`와 카드 3 `Invite friends, earn more`는 CEX에서만 발생합니다.** DEX 페이지에서 "이벤트로 페이백 더 받기", "친구 초대로 더 벌기"를 보여주면, 바로 위 비교 섹션에서 "DEX는 이벤트·초대 리워드 없음"이라고 한 것과 충돌합니다.

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
| ~~출금 딥링크 (`EXT-11`)~~ | **V2 폐기** — 출금 경로가 아닙니다 |
| 노출 여부·순위 | 목록 노출과 순서 |

## 4-1-1. 🔴 두 신규 영역의 **메뉴 위치가 정해지지 않았습니다** (2026-10-22)

**🔧 정정 (2026-10-22).** 위치는 **정의돼 있습니다.** `NAV-1` 이 **`Cashback Products` 라는 최상위 신규 메뉴**를 두고 그 아래 `Spending Estimate` · `DEX Landing Page` · `Brokers` 를 둡니다.

> **왜 독립 최상위인가** — 레코드와 콘텐츠를 분리하기 때문입니다. `거래소` 메뉴는 **파트너 레코드(파트너당 1행)**, 이 메뉴는 **페이지 콘텐츠**입니다. **레코드를 등록해도 랜딩에 자동 노출되지 않습니다.**

아래는 위치를 못 찾았을 때 적어 둔 후보 검토입니다.

| 후보 | 근거 | 문제 |
|---|---|---|
| **최상위 신규 메뉴** | 둘 다 독립 에디터이고 **거래소 한 곳에 속하지 않습니다** | 메뉴가 하나 늘어납니다 |
| `프리로그인 랜딩 페이지` 하위 | ELC가 그 페이지의 **Venue 카드를 채웁니다** | **SPE가 갈 곳을 잃습니다** |
| `거래소` 하위 | 거래소별 설정이라면 자연스럽습니다 | **SPE는 거래소별이 아닙니다** — 계산기 전체의 슬라이더 범위와 요율을 들고 있습니다 |

> **개발 착수 전에 정해야 합니다. 메뉴가 곧 담당입니다.**
>
> ※ 프로토타입이 한동안 이것을 `거래소` 하위로 그리고 있었는데, **결정이 아니라 추정**이었습니다. 지금은 `(메뉴 위치 미정)` 으로 표기합니다.

---

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

## 4-5. 언어팩 — **1,515건 확정** (2026-10-21)

**101개 항목 × 15개 언어 = 1,515건**입니다.

### 적용 규칙 (결정 C-1)

```
어드민이 15개 언어를 모두 지원하지 않는 영역
   → 하드코딩 언어팩으로 15개 언어 전부 공급        ← 본 문서의 LANG 101건이 여기

어드민이 한/영만 지원하는 영역
   → 한/영만 입력, 나머지 언어는 EN fallback
```

| 구분 | 항목 수 | 언어 | 합계 |
|---|---:|---|---:|
| **LANG — 하드코딩 언어팩** | 101 | **15개 전부** | **1,515** |
| **ADMIN — 운영자 관리** | 23 | 영역별 기존 지원 범위 그대로 | — |

> **운영자 관리 23건은 별도 조사하지 않습니다.** DEX도 **기존 CEX와 동일한 패턴**을 따르므로,
> 각 어드민 화면이 원래 지원하던 언어 범위를 그대로 상속합니다. (결정 Q5)

### MAX-466의 확인

혜택 영역(ADMIN)은 **KO/EN 2개만** 입력받습니다.

```
amountMainLabel_ko / _en     (필수)
amountSubLabel_ko  / _en     (선택)
title_ko / _en               (필수, ≤100자)
subtitle_ko / _en            (필수, ≤200자)
ctaLabel_ko / _en            (필수, ≤30자) ← 신규 필드
```
> *"Language fallback: EN used if other language requested and not KO"*

### 맥스보드의 확인

맥스보드 PRD도 같은 구조입니다.
- **유의사항: 15개 언어** (REQ-108) — 하드코딩 언어팩
- 혜택 제목/부제목: **KO/EN** — 어드민 입력
- SEO 타이틀·디스크립션: **6개 언어**, OG 이미지: **KO/EN**

→ **같은 서비스 안에서도 영역마다 언어 범위가 다릅니다.** 일괄 15언어가 아닙니다.

---

# 5. 조치가 필요한 것

## 5-1. 🔴 하드코딩 → 백오피스·파생 이관 (10건)

| # | 요소 | 현재 | 이관 대상 |
|---|---|---|---|
| 1 | 계산기 페이백 라벨 | `Cashback, 20%` | `Cashback, {rate}%` ← `SPE` |
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
| 1 | 비교 섹션 `Event and invite rewards` DEX 값 | `Quiz rewards only, claimed to an exchange...` | 🟢 **2026-10-23 확정.** ~~A-09 전면 배제~~ → **A-1·A-2로 DEX도 이벤트·초대 리워드를 받습니다.** 문구를 `Event and invite rewards` **CEX와 동일**로 고칩니다. `Quiz rewards only` 는 **틀렸습니다** |
| 2 | 게스트 이유 카드 2·3 | `More cashback from events`, `Invite friends, earn more` | 🟢 **2026-10-23 확정. 숨길 필요가 없습니다.** A-1·A-2로 둘 다 DEX에 성립하므로 **그대로 둡니다** |
| 3 | 최소액 박힌 문구 2곳 | `On TetherMax, from 10 USDT`, `Paid daily, withdraw from 10 USDT` | 🟢 **2026-10-23 확정. 값은 맞습니다** — V2는 DEX도 10 USDT입니다. 다만 변수화는 그대로 권고합니다 |

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

---

# 7. 2026-10-21 추가 — 신규 백오피스 4건

기존 PRD 6종과 맥스보드 PRD 분석 결과, **백오피스 작업 4건이 추가**되었습니다.
근거 결정은 `../6_기존PRD_분석/확정_결정_기록_20261021.md` 참조.

| # | 항목 | 분류 | 근거 |
|---|---|---|---|
| 1 | **Exchange Guide → UID Ownership Verification** 슬라이드 등록 | **신규 구축** | MAX-431 |
| 2 | **리그 생성 거래소 드롭다운에 DEX 4곳 추가** | 기존 확장 | MAX-10 |
| 3 | **집계 일자 드롭다운 4일 → 7일 확장** | 기존 확장 | 결정 E-2 |
| 4 | **DEX 수동 연동** | 신규 구축 | 결정 J-3 |
| **5** | **수동 푸시 대상 선택 필터 — DEX 반영** | 기존 확장 | 2026-10-21 요청 |
| **6** | **이메일 캠페인 발송 대상 필터 — DEX 반영** | 기존 확장 | 2026-10-21 요청 |

---

## 7-1. 🔴 신규 — `Exchange Guide → UID Ownership Verification`

MAX-431이 **신설을 지시한 백오피스 섹션**입니다. DEX 때문에 생긴 것이 아니라 **CEX용으로도 신규**입니다.

> *"[New] Backoffice — add **"UID Ownership Verification"** section under **"Exchange Guide"**:
> UI for registering and managing per-exchange mobile/PC slides (title + image + description text)
> that populate the ownership claim page in **real time**"*

### 구조

```
Exchange Guide
 └─ UID Ownership Verification
     └─ 거래소 선택
         ├─ 모바일 슬라이드   [1] 제목 + 이미지 + 설명
         │                   [2] 제목 + 이미지 + 설명
         │                   [3] …
         └─ PC 슬라이드       [1] [2] [3] …
```

| 규칙 | 내용 |
|---|---|
| 디바이스 분리 | **모바일/PC를 각각 등록.** 사용자 디바이스에 맞는 것만 노출 |
| dot indicator | **2장 이상이면 자동 표시.** 1장이면 미표시 |
| 반영 | **실시간** |
| 대체 | 기존 YouTube 가이드 영상 임베드는 **제거** |
| PC 레이아웃 | 슬라이드 영역과 파일 첨부 영역을 **2열 side-by-side** |

### ★ DEX 제작 물량 — **불필요** (2026-10-22)

```
(구) 4개 DEX × 2 디바이스 × N 슬라이드 = 최소 8세트
(신) 제작 불필요 — DEX는 소유권 인증을 지원하지 않습니다
```

**이 섹션 자체는 여전히 신규 구축입니다.** MAX-431이 **CEX용으로** 지시한 것이며,
DEX 세트만 빠집니다. 콘텐츠 BD가 이것 때문에 DEX 4곳 계정을 만들 필요는 없어졌습니다.

현재 디자인(O3)에는 **3단계**가 그려져 있습니다 (`Step 1 of 3`).
1단계 예시: *"Start recording, then disconnect your wallet — Start your screen recording, open Lighter, and disconnect your wallet from the account menu at the top right."*

> **담당: 콘텐츠 BD** (결정 B-4). 각 DEX에 실제 계정이 있어야 스크린샷 촬영이 가능합니다.

### 어드민 측 추가 요건 (CEX 한정)

소유 확인은 **영상 파일**(MP4/MOV, 100MB)을 받습니다. 기존 CEX가 이미지였다면 저장·재생 요건이 다릅니다.
**DEX 행은 이 큐에 들어오지 않으므로 영상 플레이어도 DEX에는 불필요합니다.**

| 항목 | 요건 |
|---|---|
| 심사 화면 | **영상 플레이어** 필요 |
| 반려 | **사유 입력** 필수 (사용자 `View reason`에 노출) |
| 데드라인 | **10분.** 무응답 시 자동 실패 |
| 알림 | 신청 접수 시 **슬랙 알림** — DEX도 **기존과 같은 채널** (결정 J-4) |

---

## 7-2. 리그 생성 — 거래소 드롭다운에 DEX 4곳 추가

MAX-10 리그 생성 폼의 입력 항목 중 **m. 운영 거래소 드롭다운**입니다.

```
a. Title                       g. OG 이미지 (한)
b. Subtitle                    h. OG 이미지 (영)
c. 상단 배너 이미지 (모바일)     i. SEO 타이틀 (한 ≤35)
d. 상단 배너 이미지 (PC)        j. SEO 타이틀 (영 ≤60)
e. 순위별 상금 (표)             k. SEO 설명 (한 ≤70)
f. P0~P6 기간                  l. SEO 설명 (영 ≤140)
                               m. 운영 거래소 드롭다운  ← ★ DEX 4곳 추가
```

| 제약 | 내용 |
|---|---|
| 리그 1개 = 거래소 1개 | **1:1.** 여러 거래소를 한 리그에 넣을 수 없음 |
| 동시 운영 | 가능. 같은 거래소 **중복 허용** |
| 개인전 / 팀전 | **하나만 선택.** 둘 다 하려면 리그 2개 생성 |
| 생성 후 수정 | Title, Subtitle, 배너, OG, SEO **만** 가능. 거래소·기간·유형 변경 불가 |

> 리그 점수는 **페이백 금액 기준**(`1 USDT 커미션 페이백 = 1 point`)이므로 DEX도 그대로 성립합니다.
> 팀 생성 자격(누적 500 USDT / 최근 30일 100 USDT)에도 **DEX 페이백이 합산**됩니다 (결정 B-3).

---

## 7-3. 집계 일자 드롭다운 — 4일 → 7일 확장

**🔧 위치를 특정했습니다 (2026-10-22).** 이 항목은 **`거래소 > 거래소 리스트 > 생성·수정` 폼의 `집계 시작(UTC)` · `집계 종료(UTC)`** 드롭다운입니다.

실물 폼에서 두 필드가 각각 **「상대 일자 ▾ + 하루 중 시각」** 조합이고, **상대 일자 목록이 `4일 전`까지**만 됩니다.

> **`페이백 > 전체 내역` 의 `집계 일자` 필터가 아닙니다.** 그쪽은 **조회 필터**라 거래소별로 다를 수 없습니다. 아래 표가 **거래소마다 필요 범위를 다르게** 적고 있다는 것이 위치를 가르는 근거입니다 — 거래소별 **설정**이어야만 성립합니다.

**Lighter는 주 1회(월요일, 전주 월~일) 정산**이라 **7일**이 필요합니다.

| 거래소 | 필요 범위 |
|---|---|
| **Lighter** | **7일** |
| ApeX | 1일 (시간당 → 롤업) |
| EdgeX | 1일 |
| Aster | 1일 |

**결정 E-2: 확장합니다.**

---

## 7-4. DEX 수동 연동

**결정 J-3: 일단 만들어 둡니다.**

API가 없어서가 아니라 **원장이 늦게 오기 때문**에 필요합니다.
Lighter는 주 1회 정산이므로, 금요일에 거래한 유저는 **최대 3일간 "연동은 됐는데 금액이 0"** 입니다.
그 사이 CS가 들어오면 수동 처리 경로가 없으면 막힙니다.

### 승인 조건

| 조건 | 규칙 |
|---|---|
| **필수** | **파트너 원장에 해당 지갑이 존재할 것** |
| **운영자 재량** | **불가.** 원장에 없으면 승인할 수 없음 |
| 거절 | **사유 코드화** 필요 |

### 상태값

```
신청 → 검토중 → 승인 / 거절(사유)
```

> 기존 CEX 수동 연동과 같은 구조를 따르되, **식별자가 UID가 아닌 지갑 주소**입니다.


---

## 7-5. 🔴 수동 푸시 — 대상 선택 필터에 DEX 반영

**메뉴 위치:** `푸시 > 수동 푸시 > [대상 선택] > 푸시 선택`
조건 6개를 조합해 발송 대상을 추리는 화면입니다.

```
┌ 1. 회원 구분      [전체] [커미션 페이백 이력 존재] [이력 없음]
┌ 2. 커미션 페이백  금액 구분 ▾  [최소] ~ [최대]
│  2-1. 이벤트 리워드  금액 구분 ▾  [최소] ~ [최대]
┌ 3. 출금 여부      [전체] [출금 이력 있음] [이력 없음]
┌ 4. 최근 접속일    [시작] — [종료]
┌ 5. 연동한 거래소  ( )AND (●)OR   [전체 선택] [WOO X Pro] … [없음]
┌ 6. 날짜 선택      날짜 구분 ▾  [시작] — [종료]
                                            [검색] [초기화]
전송대상: 0명            [ 대상 확정 ]
```

### ① 5번 `연동한 거래소` — DEX 그룹 추가 (직접 요청)

```
현재   [전체 선택] [WOO X Pro] [Bitget] … [없음]        ← CEX만

요청   CEX  [CEX 전체] [WOO X Pro] [Bitget] …
       DEX  [DEX 전체] [Aster] [Lighter] [ApeX] [EdgeX]   ★ 신규
            [없음]                                         ← 그룹 밖
```

| # | 변경 | 분류 |
|---|---|---|
| 1 | DEX 칩 4개 추가 | **DERIVED** — 거래소 레코드에서 파생 |
| 2 | `DEX 전체` 일괄 선택 칩 | 개발 |
| 3 | `전체 선택` → `CEX 전체` 범위 명확화 | **정책 결정 선행** |
| 4 | CEX / DEX 그룹 시각 분리 | 디자인 |
| 5 | `없음` 칩을 그룹 밖으로 | 개발 |

**결정 필요 3건**

| # | 쟁점 | 선택지 |
|---|---|---|
| 1 | `전체 선택` 범위 | (A) 전체 유지 / **(B) `CEX 전체`로 개명 + `DEX 전체` 신설** / (C) 그룹 헤더 체크박스 |
| 2 | 기존 저장 조건 마이그레이션 | B안 채택 시 재정의 필요 |
| 3 | `없음` 의미 | (a) CEX·DEX 모두 없음 / (b) CEX만 없음 → **(a) 권장** |

> **(3)이 (a)인 이유:** DEX만 연동한 회원은 `DEX 전체`로 잡으면 됩니다.
> `없음`을 "CEX만 없음"으로 두면 **DEX 연동자가 미연동자로 섞여 오발송**이 납니다.

---

### ② 🔴 거래소 칩보다 중요 — 나머지 조건 4개의 DEX 포함 여부

**이 화면은 칩만 추가하면 끝나는 게 아닙니다.** 다른 조건들의 집계 범위가 전부 미정입니다.

| 조건 | 쟁점 | 누락 시 |
|---|---|---|
| **1. 회원 구분** | `커미션 페이백 이력 존재/없음` 에 DEX 페이백 포함? | DEX만 쓰는 회원이 **"이력 없음"으로 분류 → 발송 누락** |
| **2. 커미션 페이백** | 금액 범위가 CEX+DEX 합산? | 금액대 타겟팅이 어긋남 |
| **2-1. 이벤트 리워드** | DEX 이벤트 리워드 포함? | **A-1로 DEX에도 지급하므로 포함되어야 함** |
| **3. 출금 여부** | `출금 이력` 에 DEX 출금 포함? | V2는 DEX도 테더맥스 출금이므로 **포함이 자연스러움** |
| **6. 날짜 선택** | `날짜 구분` 드롭다운에 DEX 기준일 필요? | 드롭다운 내용 미확인 |

**원칙 제안**

> **1·2·2-1·3번 모두 CEX·DEX를 합산해야 합니다.**
> V2에서 DEX 페이백도 **테더맥스 잔액**에 쌓이고 **테더맥스에서 출금**되므로 분리할 근거가 없습니다.
>
> 특히 1번을 분리하면, 페이백을 받고 있는 DEX 회원이
> *"아직 페이백이 없는 회원"* 대상 푸시를 받게 됩니다.

→ **확인 필요:** `금액 구분` / `날짜 구분` 드롭다운의 선택지 목록

---

### ③ 🟠 `페이백 엑셀 업로드` — 지갑 주소 지원 여부

화면 우상단 버튼. 대상을 엑셀로 직접 올리는 경로로 보입니다.

| 쟁점 | 내용 |
|---|---|
| 식별자 | 현재 UID 기준으로 추정. **지갑 주소도 받는가** |
| 검증 | 지갑 주소 형식 검증 |
| 혼합 | 한 파일에 UID와 지갑 주소 혼용 가능 여부 |

→ **업로드 템플릿 확인 필요.**

---

### ④ 🟡 적용 범위

이 화면은 **수동 푸시** 전용이나, 좌측 메뉴에 유사 발송 기능이 더 있습니다.

```
푸시 ← 이 화면 / 쿠폰 / 이메일 / 뉴스레터 / 친구 초대
```

**조건 빌더를 공유하면 한 번, 화면별 구현이면 전부 고쳐야 합니다.** → 개발 확인 필요.

> 상세는 [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) 13-9 참조.

---

## 7-6. 🔴 이메일 캠페인 — 발송 대상 필터에 DEX 반영

**메뉴 위치:** `이메일 > 이메일 캠페인 > 새 이메일 캠페인 > ② 발송 대상 > [필터로 선택]`

```
 ①본문 작성 ─── ②발송 대상 ─── ③대상 확인 ─── ④테스트 발송·컨펌 ─── ⑤발송

 [필터로 선택]  [엑셀 업로드]
 ┌ 발송 대상 필터 — 필터는 모두 AND 조건으로 결합돼요. ──────┐
 │ [누적 커미션 ▾] [≥ ▾] [값을 입력하세요]              🗑 │
 │ [거래소     ▾] [= ▾] [드롭다운 ▾]                   🗑 │
 │ [+ 필터 추가]                                            │
 └──────────────────────────────────────────────────────────┘
```

### ① `거래소` 드롭다운에 DEX 4곳 추가

현재 18개, **CEX만**:
```
Toobit · HTX · BloFin · Bitunix · Zoomex · KuCoin · BlockFin · LBank
Gate · DeepCoin · BingX · Flipster · MEXC · OKX · Bybit · Binance
Bitget · WOO X Pro
```
→ **Aster · Lighter · ApeX · EdgeX 추가**

### ② 🔴 푸시 화면과 별개 구현입니다

| | 수동 푸시 (7-5) | **이메일 캠페인 (7-6)** |
|---|---|---|
| 패턴 | 고정 조건 6블록 | **키-연산자-값 행 동적 추가** |
| 거래소 선택 | 멀티셀렉트 칩 | **단일 선택 드롭다운** |
| 연산자 | AND / OR 토글 | **전부 AND 고정** |
| 거래소 목록 | 약 40개 (test 포함) | **18개** (test 없음) |

**→ 공용 컴포넌트가 아닙니다. 두 곳을 각각 고쳐야 합니다.**

### ③ 🔴 거래소 목록이 화면마다 다릅니다 — 작업량이 여기서 갈립니다

```
가능성 ① 각 화면이 별도 하드코딩          → 전부 개별 수정
가능성 ② 같은 API에 서로 다른 필터 적용    → 필터 조건만 수정
가능성 ③ 노출 플래그가 화면별로 존재       → 플래그 설정
```
→ **개발 확인 선행 필요.**

### ④ 🟠 `누적 커미션` 에 DEX 포함 여부

7-5 ②와 같은 쟁점입니다. **V2에서 DEX 페이백도 테더맥스 잔액이므로 합산해야 합니다.**

### ⑤ 🟡 확인 필요

`+ 필터 추가` 의 전체 키 목록 / 연산자 선택지 / 거래소 복수 선택 필요 여부 /
`엑셀 업로드` 탭의 지갑 주소 지원 여부

> 상세 및 **거래소 선택 지점 전수 점검표**는
> [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) 13-10 · 13-11 참조.

---

# 7-7. 📋 거래소 선택 지점 전수 점검표

DEX 4곳을 추가해야 하는 지점을 **화면 단위로** 추적합니다.
**직접 확인한 것과 추정만 한 것을 구분**했습니다.

| 그룹 | 수 | 상태 |
|---|---:|---|
| A. 캡처로 직접 확인 | 10 | 반영 완료 |
| B. PRD로 확인 | 3 | 반영 완료 |
| C. 추정 — 캡처 필요 | **4** | 우선순위 낮음 |
| D. 해소 완료 | **7** | 캡처 수령 + 2026-10-22 결정 (24번 신설 포함) |
| **합계** | **24** | |

## A. 확인 완료 — 캡처로 직접 본 화면

| # | 메뉴 경로 | 형태 | 상태 |
|---|---|---|---|
| 1 | `푸시 > 수동 푸시 > 푸시 선택` — 5. 연동한 거래소 | 멀티 칩 + AND/OR | 🔴 **DEX 추가** (7-5) |
| 2 | `이메일 > 이메일 캠페인 > 발송 대상 필터` — 거래소 | 단일 드롭다운 | 🔴 **DEX 추가** (7-6) |
| 3 | `거래소 > 거래소 리스트` | 레코드 | 🔴 DEX 온보딩 중심 |
| 4 | `거래소 > 거래소 래퍼럴 관리` | 목록 | 🟠 DEX 행 추가 여부 |
| 5 | `거래소 > 거래소 이벤트 관리` | 목록 | 🟠 |
| 6 | `거래소 > 거래소 가이드` | 목록 + 상세 | 🔴 구조 변경 |
| 7 | `UID > UID 리스트` | 필터 + 컬럼 | 🔴 가장 큰 변경 |
| 8 | `회원관리 > 회원 리스트` | 필터 + 컬럼 | 🟠 |
| 9 | `페이백 > 전체 내역` | 필터 | 🟠 DEX 행이 생기면 안 됨 |
| 10 | `회원관리 > 제휴사 등록 모달` | 거래소 선택 | 🔴 필수 변경 |

## B. 문서로 확인 — PRD 기준

| # | 메뉴 경로 | 형태 | 상태 |
|---|---|---|---|
| 11 | `리그/보드 > 글로벌 리그 생성` — 운영 거래소 | 단일 드롭다운 | 🔴 **DEX 추가** (7-2) |
| 12 | `리그/보드 > 맥스보드 목록 > 빙고판 생성` — 거래소 | 단일 드롭다운 | 🔴 **DEX 추가** (맥스보드 REQ-001) |
| 13 | `거래소 가이드 > UID 소유 확인` 슬라이드 | 거래소별 등록 | 🔴 **신규 구축** (7-1) |

## C. 추정 — ★ 캡처 확인 필요

좌측 메뉴 기준으로 거래소 조건이 있을 법한 곳입니다. **직접 보지 못했습니다.**

| # | 메뉴 | 확인할 것 | 가능성 |
|---|---|---|---|
| 20 | **엑셀** | 업로드·다운로드 템플릿의 거래소 컬럼 | 중간 |
| 21 | **앱** | 거래소 노출 제어 | 낮음 |
| 22 | **SEO** | 거래소별 페이지 메타 | 낮음 |
| 23 | **디자인** | 거래소별 에셋·배너 | 낮음 |

> **남은 건 4곳이고 전부 우선순위가 낮습니다.** 14~19번은 캡처 수령과 결정으로 해소됐습니다(아래 D).

## D. 해소 완료

| # | 메뉴 | 판정 | 조치 |
|---|---|---|---|
| 14 | **쿠폰 발송** — 거래소 목록 | 🔴 **DEX 추가** | 수동 푸시 필터와 같은 구조. 같은 목록을 씁니다 |
| 15 | **뉴스레터** | ⚪ **범위 밖** | 거래소 차원이 없습니다 |
| 16 | **이벤트 안내 이메일** | 🔴 **DEX 추가** | 쿠폰과 동일 |
| 17 | **친구 초대** — `주목할 거래소` 드롭다운 | 🔴 **DEX 추가** | 어드민이 고르는 `주목할 거래소` 선택지에 DEX 4곳 (`R-3`, 2026-10-22). **초대 리워드 내역 화면**은 거래소 차원이 없어 범위 밖 |
| 18 | **VIP** | ⚪ **범위 밖** | 이번 개발 범위가 아닙니다. 다음 개발에서 재판정 (`R-1`, 2026-10-22) |
| 19 | **포인트** | 🟢 **변경 없음** | DEX 적립은 됩니다. 다만 적립 내역의 `99…` 번호는 **거래소 UID가 아니라 TUID** 라 거래소를 걸 자리가 없습니다 (`R-2`, 2026-10-22) |
| **24** | **페이백 부스트** — `부스트 적용 거래소` 선택 | ⛔ **DEX 제외** | 부스트는 DEX를 고려하지 않습니다. 선택지에 DEX를 넣지 않습니다 (`R-5`, 2026-10-22) |

> **24번은 원래 이 표에 없던 지점입니다.** 부스트 판정이 `O`에서 `X`로 바뀌면서 "DEX를 넣는 곳"이 아니라 **"DEX를 명시적으로 빼는 곳"** 으로 들어왔습니다. 개발 시 **선택지에 DEX가 섞여 들어가지 않는지** 확인해야 합니다.

## 7-7-1. 🔴 선행 확인 — 거래소 목록의 단일 소스 여부

| 화면 | 항목 수 | test 계열 |
|---|---:|---|
| 수동 푸시 `연동한 거래소` | 약 40 | **포함** |
| 이메일 캠페인 `거래소` | 18 | 없음 |

**같은 "거래소"인데 목록이 다릅니다.**

```
가능성 ① 각 화면이 별도 하드코딩          → 23개 지점 전부 개별 수정
가능성 ② 같은 API에 서로 다른 필터 적용    → 필터 조건만 수정
가능성 ③ 노출 플래그가 화면별로 존재       → 플래그 설정
```

**→ 이것이 확인되어야 DEX 추가 작업량을 산정할 수 있습니다. 개발 확인 선행 필요.**

## 7-7-2. 공통 작업 — 어디에 추가하든 동일

| # | 항목 | 내용 |
|---|---|---|
| 1 | **DEX 4곳 추가** | Aster · Lighter · ApeX · EdgeX |
| 2 | **그룹 구분** | CEX / DEX 시각 분리 (멀티 선택 UI인 경우) |
| 3 | **집계 범위** | 금액·이력 조건이 **CEX+DEX 합산**인지 확인 |
| 4 | **식별자 표기** | `UID 123456789` ↔ `0x7a3F…c51E9` |
| 5 | **목록 소스** | 화면마다 다른 거래소 목록의 단일 소스 여부 |

> 화면별 상세는 [08_어드민_화면별_DEX_반영사항.md](../../DEX/08_어드민_화면별_DEX_반영사항.md) 13-9 · 13-10 · 13-11 참조.
---

# 8. 2026-10-21 개정 요약

| # | 변경 | 근거 |
|---|---|---|
| 1 | 언어팩 **101 × 15 = 1,515건** 확정 (4-5) | 결정 C-1 |
| 2 | 운영자 관리 23건은 **기존 패턴 상속**, 별도 조사 불필요 | 결정 Q5 |
| 3 | **`Exchange Guide → UID Ownership Verification`** 신규 (7-1) | MAX-431 |
| 4 | **리그 거래소 드롭다운에 DEX 4곳** (7-2) | MAX-10 |
| 5 | **집계 일자 4일 → 7일** (7-3) | 결정 E-2 |
| 6 | **DEX 수동 연동** 승인 조건 확정 (7-4) | 결정 J-3 |

## 8-2. 2026-10-22 개정

| # | 변경 | 근거 |
|---|---|---|
| 1 | **소유확인 가이드 슬라이드 DEX 세트 제작 불필요** (7-1) | DEX 소유권 인증 미지원 확정 |
| 2 | 어드민 심사 화면 **영상 플레이어는 CEX 한정** | 위 1번 |
| 3 | 소유 확인 큐에 **Exchange Type 필터를 CEX 고정**으로 추가 | 위 1번 |
| 4 | **중복 DEX 지갑은 고객센터 경유** — 처리 규칙 미정 | 위 1번 |

> **`Exchange Guide → UID Ownership Verification` 섹션 자체는 여전히 신규 구축입니다.**
> CEX용이며, DEX 세트만 빠집니다.
| 7 | **수동 푸시 대상 선택 필터 — DEX 반영** (7-5) | 2026-10-21 요청 |
| 8 | **이메일 캠페인 발송 대상 필터 — DEX 반영** (7-6) | 2026-10-21 요청 |
| 9 | **거래소 선택 지점 전수 점검표** (7-7) — A 10곳 확인 / B 3곳 / **C 10곳 캡처 필요** | 2026-10-21 |

## 8-1. 확정된 어드민 필드 정의

본 문서 작성 중 미확인이었던 어드민 필드들이 확정되었습니다.

| 필드 | 정의 | ID |
|---|---|---|
| 거래소 상세 `페이백(%)` | **유저가 낸 수수료 중 유저가 돌려받는 비율.** 100이면 수수료 전액 반환 | E-1 |
| `마진율` | **분모가 커미션.** 예: 커미션율 60%, 페이백률 54% → 마진 6%p → 마진율 6/60 = **10%** | E-8 |
| `커미션율` | **서버에 저장하지 않음.** `페이백률 ÷ (1 − 마진율)` 로 역산 | E-8 |
| 회원 등급 `U` / `A` | **U = User**(일반 회원) / **A = Affiliate**(제휴사 = 파트너) | E-5 |
| `Received` / `Remaining` | **Received = 출금한 금액** / **Remaining = 잔액** | E-7 |
| 이벤트 리워드 `회수 가능 금액` | 관리자가 해당 UID **잔여 금액 전부**를 금액 입력으로 회수 | E-6 |
| 이벤트 푸시 기본값 | **Y**. `WITH` / `EXCHANGE` **둘 다 존재** | E-3 |
| `업데이트(UTC)` | MAX-30의 **`update_time`**. 연동 성공 화면의 정산 시각 안내에 사용 | B-2 |

> **DEX 4곳의 커미션율·마진율은 미정입니다.** 허브 비교표의 Lighter 20% / ApeX 30% / EdgeX 30% / Aster 20%는
> **페이백률**(사용자 노출값)이며, 커미션율은 상업 협의 결과를 기다립니다. (Q1)
