# 디자인 누락 — 10. 캐시백 요약 · 랭킹

DEX(revision)와 기존 페이지(`[MAX-601]` · `[MAX-693]` · `[MAX-468]` MAXOP-805) 어디에도 프레임이 없는 상태는 없다. 아래는 상태 정의만 있고 모양을 재사용 컴포넌트로 만든 상태다. 근거 전체는 `ref/대응_summary.md`.

| 화면id:상태 | 상태 정의 | 재사용한 모양(출처) | 빠진 것 |
|---|---|---|---|
| summary.main:returned | 흐름 S6_05 `Withdrawal returned` 29002:129233 | CS1 일별 행 | `+` 부호 행 실물 |
| summary.main:lighter | 흐름 S6_08 · S6_09 · S6_10 | CS1 일별 행 | Credited/Withheld 행 표기 |
| summary.main:oneEmpty | 흐름 S6_13 | CS5 빈 달 문구 자리 · `[MAX-601]` emptyState 13762:193297 | 계정 1개 선택 빈 문구(G-180) 자리 |
| summary.main:delayed | 흐름 S6_07 | Hub H6 28960:126914 | 요약 화면 안 지연 배너 위치 |
| summary.main:old | 흐름 S6_18 | `[MAX-601]` [Select month] 12772:344403 | 180일 안내 문구 위치 |
| ranking.main:dex | — | MAXOP-805 랭킹 카드 25849:1340946 | 전체/CEX/DEX 칩 필터, 0.01 USDT 하한 안내, Monthly Top Rewards 박스(V2.2 rk/RANK) |
