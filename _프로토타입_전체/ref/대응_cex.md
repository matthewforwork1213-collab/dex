# 상태 → Figma 근거 대응 — 15. 기존 테더맥스 (로그인 · 가입 · 거래소 목록)

조사일 2026-11-26. 색인으로 찾고 Figma로 확인했다(`22598:410917`은 로컬 메타데이터에 없는 [MAXOP-692] 페이지 — 지난 세션에서 Figma로 받은 노드라 확실로 둔다). 확신 「후보」는 연결 후 스크린샷으로 확인한다.

## 기본 페이지 프레임

| 화면 | PC | 모바일 웹 | 앱 |
|---|---|---|---|
| 로그인 | [MAX-508] 10548:210709 (라벨 `Login`) | 10548:207012 | `mobileAPP - Login` 10548:212113 외 |
| 회원가입 | [MAX-508] 10548:103656 (라벨 `Sign up`) · 문구 개정 MAXOP-696 23327:1124738 | 10542:101933 · MAXOP-696 23327:1124323 | `mobileAPP - Login` 10548:221874 외 |
| 거래소 목록 | [MAXOP-692] `Figma (Updated)` 22598:410917 · 이전 [MAX-22] 8643:107720 | [MAX-22] 5145:52544 (`All Exchanges (list view)`) · 카드 8471:65818 · 로그인 8473:71020 | — |

## 상태 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| auth.login:normal | 로그인 · 빈 입력 | 10548:210709 / 10548:207012 | 기존 10548:210709 · 10548:207012 (같은 라벨 변형 10548:210710 · 11049:151476 ~ 152753 / 10548:207009 · 10548:207010) | 기존 | 확실 | `Login` |
| auth.signup:normal | 가입 첫 단계 | 10548:103656 / 10542:101933 | 기존 10548:103656 · 10542:101933 · 문구 개정판 23327:1124738 / 23327:1124323 | 기존 | 확실(개정판이 현행인지는 후보) | `Sign up` `MAXOP-696` |
| cex.list:normal | 거래소 목록 표 | 22598:410917 / 5145:52544 | 기존 22598:410917 · 5145:52544 | 기존 | 확실 | `All Exchanges` `MAXOP-692` |

## 추가할 수 있는 상태 (프레임 있음 · 코드에 아직 없음)

| 화면id:상태(예정) | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 노드 | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| auth.login:guest | 게스트 조회 결과에서 로그인 | 29037:110849 / 29037:110880 | DEX `Web / Guest auth / login` · `Mobile / Guest auth / login` | DEX | 확실 | `Guest auth` |
| auth.signup:guest | 게스트 조회 결과에서 가입 | 29037:110754 / 29037:110789 | DEX `Web / Guest auth / signup` · `Mobile / Guest auth / signup` | DEX | 확실 | `Guest auth` |
| auth.login:error | 로그인 오류 | 11049:154170 · 11073:164581 ~ 165036 / 10548:215467 · 11049:85824 | 기존 (라벨 `Error states`) | 기존 | 후보(어느 오류인지 확인) | `Error states` |
| auth.signup:error | 가입 오류 | 11049:147536 ~ 149362 / 10548:205271 · 10548:199901 외 | 기존 (라벨 `Error states`) | 기존 | 후보 | `Error states` |
| auth.signup:invite | 초대 코드로 가입 · 초대 리워드 | 10548:199108 / 10548:191334 · 12328:78361 | 기존 (라벨 `If there is Invitation Reward` · `Signing up with/without Invition Code`) | 기존 | 확실 | `Invitation` |
| auth.signup:verify | 이메일 인증 | 10548:191336 / — | 기존 `Email Verification` | 기존 | 후보 | `Email Verification` |
| auth.reset:normal | 비밀번호 재설정 | 11073:165120 · 11073:70045 외 / 11073:163739 · 11049:97669 ~ 97673 | 기존 (라벨 `Forget Password (Reset Password)`) | 기존 | 확실 | `Forget Password` |
| cex.list:search | 거래소 검색 결과 | — / 5145:51653 | 기존 (라벨 `Search Results`) | 기존 | 확실 | `Search Results` |
| cex.list:member | 로그인 · 연동 계정 있음 목록 | 8643:118995 / 8473:73693 | 기존 (`S3,S4 (post-login-UID list Y)`) | 기존 | 후보 | `post-login` `All Exchanges` |

V2.2에는 이 화면들의 상태가 없다(기존 화면). 어디까지 넣을지는 `질문_common.md`에 묻는다.

## 어디에도 없음

없음.

## 확인 결과 (Figma 연결 후)

| 상태 | 결과 |
|---|---|
| auth.login:normal · auth.signup:normal | get_design_context 실제 값으로 다시 구현(Content 400 · p24 · gap24, 프로모 배너 · 에셋) |
| auth.login:guest · auth.signup:guest | DEX 29037:110849 · 29037:110754 = 기존 로그인·가입과 같은 화면 — 같은 렌더 + 복귀 흐름 note |
| auth.login:error | 11049:154170 확인(Password `This field is required`) — 구현 |
| auth.login:reset | 11073:165120 확인(완료 토스트 `Password reset successfully.`) — 구현 |
| auth.signup:invite · error | 구현했으나 스크린샷 미대조(후보 유지) |
| cex.list:normal | 22598:410917 get_design_context 실제 값(배너 · Top Partner 4 · 표 14행 · 추천/Boost 배지 · View Event) |
| cex.list 모바일 | 5145:52544 스크린샷만 확인 — 표를 1열 요약(번호 · 로고 · 이름 · 배지 · Total Savings)으로 구현, 실제 값 미수신 |
| auth.reset 재설정 단계 화면 | 만들지 않음(완료 토스트 상태만) |
