# 상태 ↔ Figma 근거 대응 — 요약·랭킹 그룹 (summary.main · ranking.main)

작성 2026-11-26 · Figma 연결 없이 `tools/figfind.py` · `ref/figma_index.tsv` · `ref/figma_pages/*.xml`만으로 찾음. 확신 「후보」는 Figma 연결 후 스크린샷으로 확인할 목록이다. 근거 종류·확신·`흐름 S6_nn`의 뜻은 `ref/대응_home.md` 머리말과 같다(`흐름 S6_nn` = DEX(revision) `API 상태 흐름 6 · 캐시백 요약·캘린더·랭킹` 29002:129132의 상태 카드 — 와이어라 시각 근거 아님).

## 기본 페이지 프레임

| 화면 | PC | mWeb | mAPP | 비고 |
|---|---|---|---|---|
| 캐시백 요약 | `[MAX-601]` MAXOP-732 `Web / Cashback Summary / Monthly total` 25887:713885 (1440×1622) · Metrics 변형 27624:28312 · 구판 Web 12772:344799 | `mWeb / Cashback Summary / Monthly total` 25886:1340772 · Metrics 27624:27380 · 구판 12772:24573 [Default] | 25887:714436 · Metrics 27624:29433 · 구판 12773:333079 | DEX 변경: CS1~CS5 · CS6 · 모바일 29065:6687 · 29065:6366. 월간 카드 Receipt/Metrics 중 어느 쪽이 확정인지 스크린샷 확인(27624:27307 Receipt · 27624:27320 Metrics) |
| 내 캐시백 랭킹 | `[MAX-693]` Web 13074:242317 · 13074:243321 · 13074:244316 (라벨 없음, 심볼) | mWeb/landingPage/Post-login 13060:149154 · 13060:149480 · 13086:342311 · 13074:240899 · 13060:234675 | 13086:344446 · 13086:344870 · 13086:344589 · 13086:344687 · 13099:348182 | 기존은 마이 메뉴 `Cashback Ranking`(`[MAX-426]` 17170:235039)에서 여는 패널. DEX 변경: RK1~RK3 · 모바일 29065:6980 · 29065:4998 |

## summary.main

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| summary.main:normal | 월 보기 — 필터·캘린더·월간 카드·일별 목록 | 25887:713885 / 25886:1340772 | DEX CS1 28960:127133 · 모바일 `캐시백 요약 · 캘린더` 29065:6687 · 흐름 S6_01 `Cashback Summary` 29002:129136 · S6_12 `Monthly total cashback` 29002:129373 | DEX | 확실 | `CS1` · `MAXOP-732` · `Monthly total` |
| summary.main:otherDay | 다른 날 선택 | 〃 | DEX CS2 28960:127139 · 흐름 S6_14 `Daily cashback` 29002:129418 · 기존 mWeb 12772:24573 [Default] | DEX | 확실 | `CS2` · `other day selected` |
| summary.main:eventDay | 이벤트 리워드 날 · 큰 금액 | 〃 | DEX CS3 28960:127145 · 모바일 29065:6366(`BTC Prediction Reward` · `Cashback Challenge Reward` 행) · 흐름 S6_03 `Event Reward` 29002:129193 | DEX | 확실 | `CS3` · `Event reward day` |
| summary.main:dexRange | 거래소 범위 DEX 전체 | 〃 | 기존 mWeb 12772:28944 · 12772:337243 [Select Exchange] · app 12773:333675 · 12773:334330 · DEX CS6 `<Select>` 28960:127164 — `DEX 전체` 옵션 자체는 어디에도 없음 | 기존 | 확실 | `Select Exchange` · `<Select>` |
| summary.main:account | 계정 필터 드롭다운 | 〃 | DEX CS6 `All Accounts` 29265:120180 · 기존 mWeb [Select UIDs] 12772:306034 · 12772:334785 · [When there is more than 4 UIDs] 13099:353475 · 13114:110726 · app 12773:334948 | DEX | 확실 | `All Accounts` · `Select UIDs` · `more than 4 UIDs` |
| summary.main:types | 유형 다중 선택 | 〃 | DEX CS6 `All Types` 29265:120387 · 모바일 29065:6366(`All Types` · `Trading Cashback` · `Event Reward` · `Withdrawal`) | DEX | 확실 | `All Types` |
| summary.main:pending | DEX data pending — 0 아님 | 〃 | DEX CS1 25일 칸 표시(28960:127133 설명 `Day 25 shows the DEX data pending mark`) · 흐름 S6_06 `DEX data pending` 29002:129253 — 그날 일별 목록 행은 없음 | DEX | 후보 | `DEX data pending` |
| summary.main:returned | Withdrawal returned 행 | 〃 | 흐름 S6_05 `Withdrawal returned` 29002:129233 · 행 모양 = CS1 일별 행 | 재사용 | 후보 | `Withdrawal returned` |
| summary.main:lighter | Lighter Credited · Withheld | 〃 | 흐름 S6_08 `Accruing this week (estimate)` 29002:129293 · S6_09 `Withheld` 29002:129313 · S6_10 `Under minimum` 29002:129333 · 행 = CS1 일별 행 | 재사용 | 후보 | `Withheld` · `Credited`(0건) |
| summary.main:noMonth | 활동 없는 달 | 〃 | DEX CS5 28960:127157 · 기존 MAXOP-732 empty month Web 27200:24888 · mWeb 27200:24437 · app 27200:25444 · 구판 emptyState 13762:193297 / 13762:174885 (텍스트 `There is no cashback history`) | DEX | 확실 | `CS5` · `empty month` · `emptyState` |
| summary.main:noDay | 활동 없는 날 · 큰 금액 | 〃 | DEX CS4 28960:127151 · 기존 mWeb [Large amounts on calendar Thousand (K) and Million (M)] 13074:238814 · app 13060:100153 | DEX | 확실 | `CS4` · `Large amounts` · `(K)` |
| summary.main:oneEmpty | 계정 1개 선택 빈 상태 | 〃 | 재사용 CS5 28960:127157 빈 문구 자리 · 기존 emptyState 13762:193297 · 흐름 S6_13 `Daily activity`(필터 초기화) 29002:129393 | 재사용 | 후보 | `emptyState` · `Daily activity` |
| summary.main:delayed | 데이터 지연 | 〃 | 흐름 S6_07 `Data delayed` 29002:129273 · 재사용 Hub H6 28960:126914 / 28960:130824 | 재사용 | 후보 | `Data delayed` · `H6` |
| summary.main:old | 180일 넘은 달 | 〃 | 흐름 S6_18 `Check the selected month`(유효한 월 재선택) 29002:129498 · 기존 mWeb [Select month] 12772:344403 · app 12773:338727 | 재사용 | 후보 | `Select month` · `Check the selected month` |

## ranking.main

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| ranking.main:normal | 순위 매겨짐 | 13074:242317 / 13060:149154 | DEX RK2 28960:127207 · 흐름 S6_15 29002:129438 · 기존 `[MAX-693]` Web 3종 중 순위 있는 것(스크린샷으로 구분) · 모바일 순위 있음 프레임은 DEX에 없음 → `[MAX-693]` mWeb 중 1st/2nd 표기 프레임 | DEX | 확실 | `RK2` · `ranked` · `[MAX-693]` |
| ranking.main:unranked | 순위 미집계 – | 〃 | DEX RK1 28960:127201 · 모바일 `내 캐시백 랭킹 · 모바일` 29065:6980(순위 `–`) · 흐름 S6_16(순위 밖 표시) 29002:129458 | DEX | 확실 | `RK1` · `–` |
| ranking.main:empty | 자격 계정 없음 | 〃 | DEX RK3 28960:127213 · 모바일 `내 캐시백 랭킹 · 대상 없음` 29065:4998 · 흐름 S6_17(빈 순위표 유지) 29002:129478 | DEX | 확실 | `RK3` · `대상 없음` |
| ranking.main:wallet | 지갑 주소 전체 보기 | 〃 | DEX `Wallet address / 0x91c4…a07b` 28984:126296 · 같은 행 3종 28984:126300 · 28984:126304 | DEX | 확실 | `Wallet address` |
| ranking.main:board | 월간 순위표 CEX+DEX | 혜택 페이지 `[MAX-468]` | 순위표 「페이지」는 없음. 기존 혜택 페이지 랭킹 카드 MAXOP-805 `Ranking card with reward messages` mobile 343 25849:1340946 · PC 928 26651:60616 · Before 25849:1340933(텍스트 `Your September Cashback Ranking` · `2nd place` · `Top 100%` · `Reward message`) · `[MAX-7]` 텍스트 `April Cashback Ranking` · `Ranking Reward` | 기존 | 확실 | `ranking` · `leaderboard`(0건) · `MAXOP-805` |
| ranking.main:dex | 순위표 DEX 칩 필터 | — | 칩 필터 프레임 없음 — MAXOP-805 랭킹 카드(25849:1340946)를 재사용해 DEX 지갑 행만 남김 | 재사용 | 후보 | `ranking` · `DEX` 칩 |

## 집계 (20상태)

| 근거 종류 | 확실 | 후보 | 계 |
|---|---|---|---|
| DEX | 11 | 1 | 12 |
| 기존 | 2 | 0 | 2 |
| 재사용 | 0 | 6 | 6 |
| 없음 | — | — | 0 |
