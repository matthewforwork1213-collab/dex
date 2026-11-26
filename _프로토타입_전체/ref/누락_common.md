# 디자인 누락 — 1. 공통 · 셸 (common)

Figma 어디에도(DEX(revision) · 기존 페이지 · 재사용 컴포넌트) 근거가 없는 상태만 적는다. 근거 대응은 `ref/대응_common.md`.

| 화면id:상태 | 상태 설명 | V2.2 키 | 찾아본 키워드 | 가장 가까운 프레임 | 무엇이 빠졌나 |
|---|---|---|---|---|---|
| cmn.drawer:promo | 드로어 프로모 배너(선택) | cmn/DRAWER#promo | promo · banner · drawer | 드로어 19604:33156 | 배너 이미지·문구·위치 |
| cmn.appnav:inapp | 미지원 Cashback 페이지 → 인앱 브라우저 | cmn/APPNAV#inapp | in-app · webview · deeplink · open app | 앱 홈 8582:154521 | 인앱 브라우저 상단 바·닫기·URL |
| cmn.appnav:linkFail | DEX 링크 실패 — 복사 + `Open {DEX}` | cmn/APPNAV#linkFail | copy link · deeplink · Linking | — | 다이얼로그 전체 |
