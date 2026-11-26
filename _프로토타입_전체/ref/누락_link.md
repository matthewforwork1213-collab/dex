# 디자인 누락 목록 — 5. 거래 계정 연동 (link)

## 1. 디자인 없는 상태 (`figma:null`, V2.2 내용으로 만듦)

| 화면id:상태 | 상태 설명 | V2.2 키 | 가장 가까운 Figma 프레임(노드) | 무엇이 빠졌나 |
|---|---|---|---|---|
| link.select:all | 웹 칩 All 목록 | link/SEL#normal(칩 목록) | S3-2 Link Account modal (live) (28960:127765) · L1 (28960:127271) | 웹 선택기의 검색 `Search partners` · `Popular partners` · 칩 3개 · 행 배지 |
| link.select:none | All 칩에서 검색 0건 | link/SEL#none | Link / DEX search no results (29051:104597, DEX 칩) | All 칩 0건 · 웹 0건 |
| link.select:region | 지역 제한 DEX 목록 제외 | link/SEL#region | L1 (28960:127271) | 제외된 목록(G-161, 이유 표시 없음) |
| link.select:fail | 파트너 목록 로드 실패(캐시 없음) | link/SEL#fail | API 상태 보드 S5_05 `Partners couldn’t load` (29002:128426, 연동 섹션 밖) | 선택기 안 오류 + `Retry`(G-097) |
| link.select:intro | STG 웹 진입 질문 | link/SEL#intro | — | `/uidlinking` 첫 질문 화면 전체 |
| link.addr:paste | Paste 권한 거부 | link/ADDR#paste | L2 (28960:127275) | 직접 붙여넣기 힌트(문구도 미정 REQ-061) |
| link.addr:kept | 실패 후 주소 유지 | link/ADDR#kept | L3 (28960:127279) | 결과 화면에서 돌아온 상태(G-380) |
| link.addr:hub | 허브 진입 — ApeX 미리 선택 | link/SEL#hub | L2 (28960:127275) | ApeX 선택 상태 · ApeX 지갑 주소 찾기 안내 문구·스크린샷 |
| link.captcha:retry | 퍼즐 실패·만료 — 주소 유지 재시도 | link/CAPTCHA#retry | L5 (28960:127287) · API 보드 S1_14 (29002:126248) · [MAX-792]은 퍼즐 이미지뿐 | 연동 모달 안 인라인 오류 |
| link.captcha:scriptFail | 캡차 스크립트 로드 실패 | link/CAPTCHA#scriptFail | L5 (28960:127287) · API 보드 S1_13 (29002:126223) | 연동 모달 안 인라인 오류 + `Retry` |
| link.done:truncated | 180일 넘는 기록 — `Cashback shown from` | link/DONE#truncated | S4-5 (28960:127861) · API 보드 S2_13 `Cashback history` (29002:126835) | 성공 본문 안 안내 줄(문구만 보드에 있음) |

## 2. 한쪽 화면만 디자인 있음

| 화면id:상태 | 있는 쪽 | 빠진 쪽 |
|---|---|---|
| link.select:cex · dex · one · many · dexbit | 모바일 (Filter CEX/DEX · DEX search) | PC(웹 칩 선택기) |
| link.addr:e2 · case · rejected · e6 · e7 | PC (Address validation) | 모바일 |
| link.signup:prompt · return | PC (Signup + Link Wallet 2 · 3) | 모바일 |
| link.result:other | PC (L13) | 모바일(모바일 같은 문구는 `unavailable` 프레임) |
| link.result:unavailable | 모바일 (Linking unavailable) | PC |

## 3. Figma 대조 결과

디자인이 있는 상태는 모두 Figma 프레임 내용(문구·Severity·버튼)을 받아 맞췄습니다. Figma와 정책·결정이 갈린 곳(L8 · L11 · L15 · L7 제목)은 결정값을 따르고 `질문_link.md`에 적었습니다.
