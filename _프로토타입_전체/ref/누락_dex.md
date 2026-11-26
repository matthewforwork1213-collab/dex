# 디자인 누락 — 8. DEX 개요 · 상세 (`src/80-dex.js`)

DEX(revision) · 기존 페이지 어디에도 디자인이 없는 상태만 적는다. 나머지는 `대응_dex.md`.

| 화면id:상태 | 상태 설명 | V2.2 키 | 가장 가까운 Figma 프레임(노드) | 무엇이 빠졌나 | 찾아본 키워드 |
|---|---|---|---|---|---|
| dex.overview:noBanner | 게시 배너 없음 — 렌더 안 함 (G-156 답변 대기) | lnd/LANDING#noBanner | OA 28960:125521 | 배너 없는 개요 프레임(glance → venue 간격) | `banner` `promo banner` |
| dex.overview:defiStale (일부) | DefiLlama 실패 — 캐시값 표시 | lnd/LANDING#defiStale | OA glance 서브라인 · 상태 정의 S5_07 | venue 아래 `Source: DefiLlama, as of {time}.` 줄 위치 | `DefiLlama` `as of` `stale` |
| dex.detail:mediaFail | 가이드 미디어 실패 | exd/DETAIL#mediaFail | D1 step panel 28960:127443 | 정지 첫 프레임·캡션 자리표시자 | `could not load` `failed to load` `video` `image` `media` `placeholder` |

## 모바일만 없는 상태 (PC 프레임은 있음)

| 화면id:상태 | 있는 PC 프레임 | 처리 |
|---|---|---|
| dex.overview:overflow | 28960:125542 | 모바일 glance 가로 스크롤 — 프레임 없음 |
| dex.detail:signupReturn | 28960:127422 | 모바일 D1/D4 오퍼 박스에 같은 버튼 배치 |
| dex.detail:unlinked · linked | 28969:129666 · 28969:129751 | 모바일 D4 오퍼 박스(28960:131011)에 PC 회원 CTA를 얹음 |
