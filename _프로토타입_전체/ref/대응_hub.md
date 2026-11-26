# 상태 ↔ Figma 근거 대응 — 7. 캐시백 허브 (`hub.main`)

- 찾은 방법: `tools/figfind.py` · `ref/figma_index.tsv` · `ref/figma_pages/*.xml`(오프라인 메타데이터). 2026-11-26 Figma 스크린샷·`get_design_context`로 대조했다.
- 확신: **확실** = 프레임 이름·SCREEN-LABEL·상태 카드 제목이 상태와 일치 / **후보** = 추정. 「API 상태 흐름」 카드는 렌더되지 않는 와이어라 상태 정의·문구 근거로만 쓴다(모양은 실제 페이지 컴포넌트).
- 「DEX(상태 카드)」 = DEX(revision) `API 상태 흐름 4·5·6`(29002:127590 · 29002:128327 · 29002:129132)의 `S4_nn · {제목}` 카드 안 `화면 · {제목}` 프레임(446×262 축소 화면). 상태가 디자인돼 있다는 근거이고, 페이지 배치는 H 프레임을 따른다.
- 기본 페이지 프레임(셸 포함): PC **H1 `28960:126884`** · mWeb **H1 `28960:130794`** (DEX(revision) › DEX — Cashback Hub Web/Mobile [Selected Design]). 기존 `[MAX-…]` 페이지에 허브 페이지는 없다(신규 화면).

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| hub.main:normal | 게스트 · DEX 탭 계산기 (H1) | 28960:126884 / 28960:130794 | H1 PC 28960:126884 · mo 28960:130794 | DEX | 확실 | `Cashback Hub` `H1 Guest, DEX route` |
| hub.main:cex | 게스트 · CEX 탭 (H1-CEX) | 28960:126944 / 28960:130854 | H1-CEX PC 28960:126944 · mo 28960:130854 | DEX | 확실 | `H1-CEX Guest, calculator on Exchanges` |
| hub.main:brokers | 게스트 · Brokers 탭 (H1-Broker) | 28960:126950 / 28960:130860 | H1-Broker PC 28960:126950 · mo 28960:130860 | DEX | 확실 | `H1-Broker Guest, calculator on Brokers` |
| hub.main:member | 로그인 · 연동 0 (H2) | 28960:126890 / 28960:130800 | H2 PC 28960:126890 · mo 28960:130800 | DEX | 확실 | `H2 Signed in, nothing linked` |
| hub.main:cexPanel | CEX UID 연동 패널 (H3) | 28960:126896 / 28960:130806 | H3 PC 28960:126896 · mo 28960:130806 | DEX | 확실 | `H3 Signed in, exchange UID linked` |
| hub.main:cexBelowMin | CEX 10 USDT 미만 (H4) | 28960:126902 / 28960:130812 | H4 PC 28960:126902 · mo 28960:130812 | DEX | 확실 | `H4 Exchange balance under 10 USDT` |
| hub.main:dexPanel | DEX 잔액 패널 — EdgeX (H8) | 28960:126926 / 28960:130836 | H8 PC 28960:126926 · mo 28960:130836 · 같은 구성 H5 PC 28960:126908 · mo 28960:130818(DW0 28960:125773 = H5 인스턴스) · 상태 카드 S4_06 `Available Cashback` 29002:127732 | DEX | 확실 | `H8 EdgeX wallet linked` `H5 Signed in, DEX wallet linked` `DW0 Hub, DEX balance` |
| hub.main:dexPartial | A=3 · B=8 — 이벤트 리워드 일부만 출금 | 28960:126908 / 28960:130818 (H5) | DEX(revision) `지갑 상세 · 이벤트 리워드 매칭 상태`(29026:97581) › `지갑 잔액 카드 · 부분 매칭 · 최소액 미만` 29026:97704 (`Matched {x} / {y} USDT in event rewards` · `Additional exchange cashback needed`) · 상태 카드 S4_11 `Event Reward` 29002:127857 | 재사용 컴포넌트 | 확실 — 지갑 카드 스크린샷 대조, H5 패널에 3줄 문구로 얹음 | `부분 매칭` `Matched` `Event Reward` |
| hub.main:dexBelowMin | DEX 최소액 미만 — 넛지 | 28960:126902 / 28960:130812 (H4) | H4 웹 SCREEN-LABEL 28960:126903 문구 **`DEX & CEX balance under 10 USDT`** → H4가 DEX에도 쓰임(프레임은 CEX 탭으로 그려짐, 모바일 라벨 28960:130813은 `Exchange balance…`만) · 지갑 카드 `캐시백만 보유 · 최소액 미만` 29026:97646 | DEX | 확실(웹 라벨) | `under 10 USDT` `Below minimum` `최소액 미만` |
| hub.main:dexDelayed | 데이터 지연 (H6) | 28960:126914 / 28960:130824 | H6 PC 28960:126914 · mo 28960:130824 · 상태 카드 S4_13 `Data delayed` 29002:127907 | DEX | 확실 | `H6 DEX data delayed` `Data delayed` |
| hub.main:dexLoading | 잔액 패널 로딩 | 28960:126908 / 28960:130818 (H5) | DEX(revision) 게스트 캐시백 `Guest cashback / loading` PC 29035:98575(560×208, 부모 `Web / Guest / loading · 거래소 조회 중` 29035:98526) · mo 29035:98625(부모 29035:98580) · 기존 `[MAX 1216]` `S7 Loading` PC 22442:219836 · mo 22956:85536 | 재사용 컴포넌트 | 확실 — 지갑 카드 메모 29026:97581 「조회 중에는 스켈레톤」. 게스트 로딩(29035:98575)은 `Searching…` 버튼형이라 쓰지 않음 | `loading` `Loading` `skeleton` |
| hub.main:dexError | 잔액 로드 실패 (H7) | 28960:126920 / 28960:130830 | H7 PC 28960:126920 · mo 28960:130830(SCREEN-LABEL `Error with Try again, never zeros (CH-10)`) · 상태 카드 S4_15 `Cashback could not load` 29002:127957 | DEX | 확실 | `H7 Balance did not load` `Cashback could not load` |
| hub.main:dexMulti | 같은 DEX 지갑 여러 개 +N | 28960:126908 / 28960:130818 (H5) | 상태 카드 S4_18 **`EdgeX   +1`** 29002:128037 (전환 `선택한 패널 유지`) | 재사용 컴포넌트(H5) + 문구 S4_18 | 확실 | `+1` `EdgeX   +1` |
| hub.main:aster | Aster — `USDT value at payout` | 28960:126908 / 28960:130818 (H5) | H5 구성 재사용 · 상태 카드 S4_22 `Available Cashback`(전환 `이벤트 행 숨김`) 29002:128137 · H9/H10(Aster 귀속 만료)은 숨김 폐기안 | 재사용 컴포넌트(H5) | 확실(구성) · `USDT value at payout` 줄 디자인 없음 | `Aster` `USDT value at payout`(DEX(revision)·기존 어디에도 없음) |
| hub.main:totalClaimed | `Total claimed` 줄 (G-053) | 28960:126908 / 28960:130818 (H5) | `Total Claimed` 줄 컴포넌트: DEX(revision) 게스트 조회 결과 카드 `Web / Guest / above · 조회 성공 · 10 USDT 이상` 29035:97792 안 29090:3777(모바일 29090:5006) · 기존 `[MAX-7]` mWeb 홈 카드 6267:55313 · `[MAX-18]` 8316:204930 | 재사용 컴포넌트 | 확실 | `Total Claimed` `Total withdrawn` |
| hub.main:noLedger | 원장 미수신 DEX → 계산기 | 28960:126890 / 28960:130800 (H2) | H2 PC 28960:126890 · mo 28960:130800 · 상태 카드 S4_16 `Cashback estimate`(전환 `Learn More`) 29002:127987 · 대안 S4_14 `Partner data unavailable` 29002:127932 | DEX | 확실 | `Cashback estimate` `Partner data unavailable` |
| hub.main:rateFail | 요율 서비스 실패 | 28960:126884 / 28960:130794 (H1) | 상태 카드 S5_11 **`Estimate unavailable`**(전환 `다시 불러오기`) 29002:128580 · S5_10 `Cashback estimate unavailable`(전환 `계산 표시 없음`) 29002:128560 | 재사용 컴포넌트(H1 영수증) + 문구 S5_11 | 확실 | `Estimate unavailable` |
| hub.main:lighterAccruing | Lighter 주중 「집계 전」 (G-100) | 28960:126908 / 28960:130818 (H5, Lighter 패널) | H5(Lighter · `Accruing this week (estimate)` 줄 — G-100으로 추정치 미표시) · 상태 카드 S6_06 `DEX data pending` 29002:129262 · S6_08 `Accruing this week (estimate)` 29002:129302(캐시백 요약 쪽) | 없음(H5 구성 + C.tbd) | — | `DEX data pending` `Accruing this week` |
| hub.main:cards | 비교표 카드 뷰 (평점 생략) | 28960:126884 / 28960:130794 | 기존 `[MAX 1216]` **`CMT-08 Exchange list — CARD view`** PC 22807:98684 · 모바일은 H1 mo 28960:130794 비교표가 원래 카드(+ 기존 `CMT-08 Exchange list — mobile 375` 26382:789181) | 기존 | 확실 — CMT-08 CARD view = 행 카드 목록(22807:99777) 값으로 구현 | `CARD view` `Exchange list` `card` |
| hub.main:emptySearch | 비교표 빈 검색 | 28960:126884 / 28960:130794 | 기존 `[MAX-22]` mWeb `allPartnerExchanges` 5145:50887 (`No results found for Crypto.com`, 라벨 `No results` 5145:51650) · DEX(revision) `Link / DEX search no results / Light` 29051:104597 (`No results found for “bit”`) · PC 프레임 없음 | 기존 | 모바일 확실 · PC는 같은 배치 재사용 | `No results` `No results found for` `Search Results` |

## 확인 결과와 남은 질문

| 대상 | 내용 |
|---|---|
| emptySearch 문구 | 기존 제품 패턴은 `No results found for {검색어}`(MAX-22 · DEX(revision) 연동 검색 모두). G-151 확정 문구 `No exchanges match your search`와 다름 → 어느 쪽을 쓸지 질문 필요 |
| dexBelowMin | H4 웹 라벨은 `DEX & CEX`인데 프레임은 CEX(Bybit) 탭. DEX 탭 넛지는 H4 배치에 지갑 카드 문구 `Additional exchange cashback needed: {n} USDT`(29026:97646)를 쓰는지 확인 |
| dexPartial | 지갑 카드의 `Matched {x} / {y} USDT in event rewards` 줄이 허브 패널(H5)에도 들어가는지 확인 |
| 상태 카드 위치 | S4·S5 카드의 `위치`·`출발` 텍스트는 메타데이터에서 레이어 이름(`위치`)만 보임 → 허브용인지 홈·지갑 상세용인지 스크린샷으로 확인 |

## Figma에만 있는 허브 관련 상태 (현재 프로토타입에 없음, 위치 확인 후 판단)

| 노드 | 제목 | 비고 |
|---|---|---|
| 29002:127882 | S4_12 `No cashback yet` | 연동했지만 적립 0 — 허브 패널인지 홈 카드인지 확인 |
| 29002:127932 | S4_14 `Partner data unavailable` | 전환 `해당 카드 재조회` |
| 29002:128012 | S4_17 `Inactive exchange` | 전환 `기존 잔액 유지` |
