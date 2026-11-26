# 디자인 누락 — 7. 캐시백 허브 (`hub.main`)

DEX(revision) · 기존 페이지 어디에도 디자인이 없는 상태만 적는다. 나머지 상태의 근거는 `대응_hub.md`.

| 화면id:상태 | 상태 설명 | V2.2 키 | 가장 가까운 Figma 프레임(노드) | 무엇이 빠졌나 | 찾아본 키워드 |
|---|---|---|---|---|---|
| hub.main:lighterAccruing | Lighter 주중 「집계 전」 (G-100) | hub/HUB#lighterAccruing | H5 28960:126908(추정치 줄 `Accruing this week (estimate)` — G-100으로 미사용) · 상태 정의 S6_06 `DEX data pending`(캐시백 요약 쪽) | 허브 패널의 「집계 전」 표시 자리와 영문 문구(현재 C.tbd) | `Accruing` `pending` `집계` `this week` |
| hub.main:aster (일부) | Aster `Reported by Aster, USDT value at payout` 줄 | hub/HUB#aster | H5 28960:126908 | `USDT value at payout` 보조 줄 — 패널 구성은 H5 재사용 | `USDT value at payout` `Aster` |
| hub.main:emptySearch (PC) | 비교표 빈 검색 — PC | hub/HUB#emptySearch | 기존 [MAX-22] mWeb 5145:50887 | PC 빈 검색 프레임(모바일 배치를 그대로 씀) | `No results` `Search Results` |
