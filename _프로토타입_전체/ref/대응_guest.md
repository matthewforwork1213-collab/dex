# 상태 → Figma 근거 대응 — 3. 비회원 캐시백 조회 (guest)

조사일 2026-11-26. Figma 연결 없이 로컬 색인으로 찾았다. 모든 상태가 DEX(revision) 섹션 「게스트 캐시백 · 비회원 조회와 연동 후 지급」의 프레임 이름(`Web / Guest / <상태>` · `Mobile / Guest / <상태>`)과 일치한다.

## 기본 페이지 프레임

| 화면 | PC | 모바일 웹 | 메모 |
|---|---|---|---|
| 비회원 조회 페이지 | 기존 [MAX-] Landing Page Renewal `비회원 페이지_라이트버전` 19479:48811 (1440×1445) | 19479:48848 (375×1743) | DEX `search` 프레임(1440×1445 · 375×1743)과 크기가 같음 — DEX가 이 페이지 위에 그린 것으로 보임(후보) |
| 이전 비회원 결과(참고) | — | [MAX-7] `Non-Member (search results)` 9193:119755(출금 가능) · 5947:98085(출금 불가) | 정책상 게스트 출금 없음 → 참고만 |

## 상태 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| guest.search:search | 검색 · 초기 | 19479:48811 / 19479:48848 | DEX 29035:97622 / 29035:97732 | DEX | 확실 | `Guest / search` |
| guest.search:emptydex | DEX 선택 · 입력 대기 | 〃 | DEX 29037:102201 / 29037:102272 (폼 오버레이 29037:102258 / 29037:102317) | DEX | 확실 | `emptydex` |
| guest.search:emptycex | CEX 선택 · 입력 대기 | 〃 | DEX 29037:102332 / 29037:102403 (폼 29037:102389 / 29037:102448) | DEX | 확실 | `emptycex` |
| guest.search:dex | DEX · 지갑 주소 입력 완료 | 〃 | DEX 29035:98155 / 29035:98218 (폼 29035:98204 / 29035:98263) | DEX | 확실 | `Guest / dex` |
| guest.search:cex | CEX · UID 입력 완료 | 〃 | DEX 29035:98278 / 29035:98341 (폼 29035:98327 / 29035:98386) | DEX | 확실 | `Guest / cex` |
| guest.search:bad | 입력 오류 | 〃 | DEX 29035:98401 / 29035:98465 (폼 29035:98450 / 29035:98510) | DEX | 확실 | `Guest / bad` |
| guest.search:loading | 거래소 조회 중 | 〃 | DEX 29035:98526 / 29035:98580 (오버레이 29035:98575 / 29035:98625) | DEX | 확실 | `Guest / loading` |
| guest.result:above | 조회 성공 · 10 USDT 이상 | 19479:48811 / 19479:48848 | DEX 29035:97792 / 29035:97855 | DEX | 확실 | `Guest / above` |
| guest.result:below | 조회 성공 · 10 USDT 미만 | 〃 | DEX 29035:98631 / 29035:98694 (결과 오버레이 29035:98680 / 29035:98739) | DEX | 확실 | `Guest / below` |
| guest.result:zero | 조회 성공 · 잔액 0 | 〃 | DEX 29035:98754 / 29035:98817 (29035:98803 / 29035:98862) | DEX | 확실 | `Guest / zero` |
| guest.result:belowcex | CEX · UID 잔액 조회 성공 | 〃 | DEX 29035:99309 / 29035:99372 (29035:99358 / 29035:99417) | DEX | 확실 | `belowcex` |
| guest.result:handoff | 로그인 후 · 계정 미연동 (DEX) | 〃 | DEX 29035:97915 / 29035:97974 | DEX | 확실 | `handoff` |
| guest.result:handoffcex | CEX · 로그인 후 같은 UID 연동 | 〃 | DEX 29037:102463 / 29037:102530 (오버레이 29037:102520 / 29037:102575) | DEX | 확실 | `handoffcex` |
| guest.modal:picker | 거래소 선택 | 〃 | DEX 29035:98030 / 29035:98094 (오버레이 29035:98079 / 29035:98139) | DEX | 확실 | `picker` |
| guest.modal:none | 공개 조회 결과 없음 | 〃 | DEX 29035:98877 / 29035:98933 (29035:98926 / 29035:98978) | DEX | 확실 | `Guest / none` |
| guest.modal:delay | 거래 데이터 집계 중 | 〃 | DEX 29035:98986 / 29035:99040 (29035:99035 / 29035:99085) | DEX | 확실 | `delay` |
| guest.modal:error | 일시 오류 · 재조회 | 〃 | DEX 29035:99091 / 29035:99147 (29035:99140 / 29035:99192) | DEX | 확실 | `Guest / error` |
| guest.modal:limit | 조회 제한 · 대기 | 〃 | DEX 29035:99200 / 29035:99256 (29035:99249 / 29035:99301) | DEX | 확실 | `limit` |
| guest.entry:normal | 모바일 홈 푸터 → Claim Cashback | mWeb 29037:113704 | DEX 29037:113704 `Mobile / Guest entry / Home` · 푸터 29072:1797 `Footer / Company / Claim Cashback` | DEX | 확실 | `Guest entry` `Claim Cashback` |

## 같은 섹션의 연결 프레임 (다른 묶음 화면)

| 프레임 | 노드 | 쓰는 화면 |
|---|---|---|
| `Web / Guest auth / signup` · `Mobile / Guest auth / signup` | 29037:110754 / 29037:110789 | auth.signup (게스트 결과에서 가입) — `대응_cex.md` |
| `Web / Guest auth / login` · `Mobile / Guest auth / login` | 29037:110849 / 29037:110880 | auth.login (게스트 결과에서 로그인) — `대응_cex.md` |

## 어디에도 없음

없음.
