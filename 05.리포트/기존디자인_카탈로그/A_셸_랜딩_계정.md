# 기존 디자인 카탈로그 — A_셸_랜딩_계정

Figma `UI-UX Design`(fileKey `hsa3bSV9QmFTe2jsf6tzTm`)의 사용자 화면 페이지 10개를 섹션 단위로 캡처하고, 캡처를 직접 보며 판정했습니다. 캡처는 `img/<pageid>__<sectionid>.jpg`입니다. Windows 파일명 제약 때문에 `:`는 `-`로 바꿨습니다. 아주 긴 단일 프레임은 세로로 잘라 여러 단으로 이어 붙였습니다.

## 요약

| 항목 | 값 |
|---|---|
| 페이지 | 10 |
| 캡처한 섹션 | 69 (라이트 68 + 비교용 다크 1: `14849:424734`) |
| 캡처 파일 | 69장 |
| 판이 여러 개인 화면 | 25건 (「셸 비교」 6건: GNB · 푸터 · 모바일 상단 바 · 드로어 · 앱 하단 탭 · 회원 홈 + 그 밖의 화면 19건. 페이지 절의 표에 겹쳐 나오는 S4 홈 · 하단 탭 빨간 점 · 앱 업데이트는 한 번만 셈) |
| 캡처 제외(기록만) | 다크 섹션 전부 · QA 보드 6 · 아이디어/리서치 보드 8 · 레퍼런스 보드 3 · 숨김 섹션 1 · 애니메이션 조각 프레임 |

### 사용자 확인 필요

| # | 내용 | 근거·현재 판단 |
|---|---|---|
| 1 | **Web GNB는 어느 쪽이 기준인가**: 기존(`Exchanges · Events · Benefits · Cashback Preview · Point`)인가, Renewal(`Cashback ▾ · Rewards Hub ▾ · Discover ▾`)인가 | DEX(revision)은 기존 GNB를 씁니다(`webPrelogin` 29064:1295의 텍스트가 Exchanges/Events/Benefits/Cashback Preview/Point). Renewal GNB는 Renewal 페이지에만 있습니다 |
| 2 | Service Introduction(3710) Web GNB에만 `About Us` 메뉴가 있음 | 다른 페이지 GNB에는 없습니다. 서비스 소개 페이지 전용인지 확인 필요 |
| 3 | **게스트 랜딩의 현행판**: MAX-7 S1/S2 「Trade More, Pay Less.」(UID 입력 폼 히어로)인가, Renewal 「Found a higher rate? We want to hear it」(앰배서더 히어로)인가 | DEX(revision)은 `원본 적용 · mWeb/landingPage/firstFold`(MAX-7 컴포넌트)를 씁니다 |
| 4 | Renewal 메인(Web)은 히어로에 가입 CTA가 있는데 헤더 우측이 회원용 아이콘(벨·프로필·테마·언어) | 게스트 화면인지 회원 화면인지 확인 필요. 같은 Renewal의 비회원 페이지 헤더는 Login · Sign Up입니다 |
| 5 | 로그인 문구: 기본판 「Hi, welcome back!」과 Improvement판 「Your cashback awaits.」 중 현행 | Improvement 섹션(18330:114980)에 날짜·MAXOP 번호가 없습니다 |
| 6 | UID 상세: MAXOP-476에 있던 `Weekly Cashback History`가 MAX-1216 · MAXOP-783 판에는 없음 | 빠진 것이 의도인지 확인 필요 |
| 7 | Web My Page: 우측 패널(본 섹션)인가, `plan B` 전체 페이지(12085:417285)인가 | 본 섹션 쪽이 현행으로 보이지만 plan B를 버린 근거는 없습니다 |
| 8 | 앱(mAPP) S3 홈 프레임(8582:154521)에 웹용 `Get App` 배너가 있음 | 앱 안에서 앱 설치 배너를 띄우는 것은 맞지 않습니다. 실수인지 확인 필요 |
| 9 | 서비스 소개 개선판 모바일 두 프레임(19224:4458 / 19224:5152)이 픽셀상 다르지만, 눈으로 차이를 찾지 못함 | 어느 쪽을 쓸지 확인 필요 |
| 10 | mWeb 가입·로그인 화면의 상단 앱 배너가 프레임마다 다름(같은 섹션에서도 첫 줄은 없고 오류 줄은 있음) | 배너를 띄울지 확인 필요 |
| 11 | Renewal 비회원 페이지 두 판(19479:48810 / 19479:55983)의 차이는 Web 푸터 Company의 `Claim Cashback` 링크 하나 | 뒤에 만든 판(55983)을 현행으로 봤습니다 |

---

## 0. 셸 비교 (GNB · 푸터 · 모바일 상단 바 · 드로어 · 앱 하단 탭 · 회원 홈)

여러 페이지에 흩어진 셸 판을 한곳에 모았습니다. 판별 노드와 캡처는 각 페이지 절에도 있습니다.

### 0-1. Web GNB

| 판 | 대표 노드 | 구성 | 쓰는 곳 | 판정 |
|---|---|---|---|---|
| Lo-fi | 123:2719 | Logo · Exchanges · How It Works · Log In · Create Account · 다운로드 · 언어 | MAX-7 Lo-fi | 폐기 |
| **기존 GNB(게스트)** | 3448:22879 · 12216:419863 | Logo · **Exchanges · Events · Benefits · Cashback Preview · Point** · Login(외곽선) · Sign Up(채움) · 테마 · 언어 | MAX-7 S1/S2 · MAX-497 · MAX-508 · MAX-686 · MAXOP-476 | **현행** (DEX(revision)이 씀) |
| **기존 GNB(회원)** | 6487:76563 · 12216:421961 | 위와 같은 메뉴 · 벨 · 프로필 · 테마 · 언어 | MAX-7 S3/S4 · MAX-497 · MAX-426 · MAX-1000 · MAXOP-731/783 · MAX-1216 | **현행** |
| 기존 GNB 호버 | 10343:156373 | 호버한 메뉴 글자만 브랜드 블루 | MAX-7 hoverState | 현행 |
| 기존 GNB 어두운 히어로 위 | 4060:70293 | 히어로 위에서는 배경이 투명하고 글자가 흰색. 히어로를 지나면 기본 배경으로 바뀜 (「GNB switch to main background after hero section」) | MAX-7 S1/S2 Web | 현행 |
| 기존 GNB + About Us | 12792:229228 | 기존 게스트 GNB 끝에 `About Us` 추가 | Service Introduction(3710) | ❓ 사용자 확인 #2 |
| Renewal GNB | 19479:53440 · 19479:48811 | Logo · **Cashback ▾ · Rewards Hub ▾ · Discover ▾** · (게스트) Login · Sign Up · 테마 · 언어 / (메인) 벨 · 프로필 · 테마 · 언어 | Renewal(19479) 전용 | ❓ 사용자 확인 #1 |

### 0-2. 푸터

| 판 | 대표 노드 | 구성 | 판정 |
|---|---|---|---|
| 구 푸터(2022) | 7993:142925 내 | `Support : Live Chat Support (00:00 - 24:00)` · 이메일 · `copyright 2022` · Notices / Affiliate Partner Inquiry / Terms of Use / Privacy Policy 한 줄 · SNS | 폐기(기존 화면) |
| **현행 푸터 Web** | 6487:76563 하단 | 좌: 로고 · `Live Chat` 버튼 · `support@tethermax.io`+복사 / 우: **Company**(About TetherMax · Notices · Affiliate Partner Inquiry) · **Legal**(Privacy Policy · Terms of Service) / 구분선 / SNS 5개(Instagram · Linktree형 · YouTube · X · Telegram) / `© 2026 TetherMax. All rights reserved.` | **현행** |
| **현행 푸터 mWeb** | `Footer/mWeb` 19224:4153 · 4060:25384 하단 | 같은 내용을 세로로 쌓음 | **현행** (DEX(revision)이 `Footer/mWeb` 인스턴스를 씀) |
| 푸터 + Claim Cashback | 19479:55984 | Company에 `Claim Cashback` 추가 | Renewal 비회원 페이지 전용 |
| 이메일 복사 스낵바 | 8798:159753 | 푸터 하단에 `Copied` 다크 스낵바 | 현행 |
| 앱 | — | 푸터 없음(하단 탭) | — |

### 0-3. 모바일 상단 바 (mWeb · mAPP)

| 판 | 대표 노드 | 구성 | 판정 |
|---|---|---|---|
| 구 mWeb | 7993:142925 | 소문자 `tetherMax` 로고 · 햄버거 | 폐기 |
| **mWeb 게스트** | 8549:141661 · 12085:401487 | (앱 배너: X · 앱 아이콘 · `TetherMax / Earn more cashback when you sign up` · `Get App`) + 로고 · 햄버거 | 현행 기본 |
| **mWeb 게스트 + Sign Up** | 17531:228765 (MAXOP-398) | 로고 · **`Sign Up` 버튼** · 햄버거 | **현행으로 보임** (MAXOP 번호가 있는 최신 수정. Renewal 모바일도 같은 배치) |
| **mWeb 회원** | 4060:25384 · 12216:421112 | 로고 · 벨 · 프로필 · 햄버거 | **현행** |
| 배너 3종 | 4248:33574 / 8377:221056 / 8377:218393 | `Get App` / 앱 설치 사용자에게 `Open App` / 배너 없음 | 현행(상황별) |
| mWeb 배너 없는 로고+햄버거 | 19224:4458 | 서비스 소개 개선판 모바일 | 페이지 전용 |
| mWeb 가입·로그인 | 10542:101933 · 23327:1124323 | 로고만(햄버거 없음). 배너는 프레임마다 다름 | ❓ 사용자 확인 #10 |
| **mAPP** | 10981:111020 · 12216:422278 | 로고 · 벨 · 프로필 · **헤드셋(고객지원)**. 햄버거 없음 | **현행** |
| mAPP 가입·로그인 | 10548:221874 | ← 뒤로 + 제목. 로고 없음 | 현행 |
| 구 앱 | 2913:17755 | 소문자 `tetherMax` · 벨 | 폐기 |

### 0-4. mWeb 드로어(햄버거 메뉴)

| 판 | 대표 노드 | 구성 | 판정 |
|---|---|---|---|
| 구 드로어(레퍼런스 보드) | 7993:140530 내 | Partner Exchanges · Event · Benefits · Test Cashback · Service Introduction · tetherMax Point · My Page · Theme · Language + 연동 UID 목록 | 폐기(초안) |
| 초안 드로어(레퍼런스 보드) | 7993:140530 우하단 | 게스트 카드 + 메뉴 5 · Theme(Light Mode) · Language · Contact support · Terms · Privacy · About us · `Version 1.0.1 / Last login` | 초안 |
| **게스트 드로어** | 12085:400249(10677:56480) · 10061:179743 | X 닫기 / `Welcome to TetherMax!` 카드(`Log In` · `Sign Up`) / Exchanges · Events · Benefits · Cashback Preview · Point / Theme 토글 · Language(English) / Terms of Use · Privacy Policy / About TetherMax · Notices · Affiliate Partner Inquiry / 헤드셋 플로팅 버튼 | **현행** |
| **회원 드로어** | 12216:424053(12216:422716) · 10061:197517 | 게스트 드로어에서 Welcome 카드만 빠짐 | **현행** |
| 회원 My Page 시트(mWeb, 프로필 아이콘) | 10061:197518 | 아바타 · 마스킹 이메일 · Member ID+복사 / 2×2(Cashback Summary · Invite Friends · Cashback Ranking · My Coupons) / Account Security · Notification settings / Log Out | 현행 |
| mAPP My Page(드로어 대체) | 10981:111021 | 위 + Theme · Language · Terms of Use · Privacy Policy · About Us · Log Out | 현행 |

### 0-5. 앱 하단 탭

| 판 | 대표 노드 | 구성 | 판정 |
|---|---|---|---|
| 구 4탭 | 2913:17755 · 14578:33678 | 홈 · 혜택 · 제휴거래소 · 마이페이지 (Home · Benefits · Partner Exchange · My Page) | 폐기 |
| **현행 5탭** | 14727:399969 · 10981:111020 · 8582:154521 | **Home · Events · Benefits · Exchanges · Point** | **현행** (MAX-829 「Updated as of 8th June」) |
| 5탭 + 빨간 점 | 25854:1340443 · 25854:1340473 | Benefits에 점(받을 보상) / Point에 점(확인할 포인트) | **현행** (MAXOP-758, 2026-09-29) |
| 구 탭 + 점(숨김) | 25847:1340915 · 25847:1340959 | My Page에 점 — 「superseded 2026-09-29: old nav」 | 폐기 |

DEX(revision)의 `<BottomNav>5-v2`(28960:125932)는 탭 바가 아니라 하단 CTA 버튼 바입니다.

### 0-6. 회원 홈 (S3 · S4)

| 판 | 대표 노드 | 구성 | 판정 |
|---|---|---|---|
| 구 앱 홈 | 2913:17755 · 14578:33204 | `나의 리워드 0 USDT` 파란 카드 · `출금` · 내 거래소 · 거래소를 둘러보세요 | 폐기 |
| **S3 mWeb (연동 UID 없음)** | 4248:33574 | `0 USDT Total Cashback Balance` + 비활성 Withdraw / `Unlock Your First Cashback in 3 Steps!`(Create account ✓ · Browse partner exchange · Link your UID `🎁 3 USDT`) / Cashback Preview 카드 / Limited Time Offers / Exclusive For Members / Top Partner Exchanges / All Partner Exchanges(검색 · Recommended · All · Cashback Boost · Events 칩 · 카드/리스트 전환) / 푸터 | **현행** |
| S3 Web | 4060:57161 | 좌: 잔액·3단계·Cashback Preview / 우: Limited · Exclusive · Top · All Partner | 현행 |
| S3 mAPP | 8582:154521 | S3 mWeb와 같고 상단 바는 앱용, 하단 5탭 | 현행(배너는 ❓ 사용자 확인 #8) |
| **S4 mWeb (연동 UID 있음)** | 4060:25384 | 잔액 + Withdraw / Linked UID 카드(거래소·UID·금액, `Using multiple exchanges? Link more UIDs`) / Exclusive For Members / Limited Time Offers / Top Partner Exchanges / 푸터 | 기본판 |
| S4 Web | 6487:76563 | 좌: 잔액·Linked UID / 우: Exclusive · Limited · Top | 기본판 |
| S4 mAPP | 8582:156599 | Linked UID · Exclusive · Limited · Top + 5탭 | 현행 |
| **S4 + 누적 캐시백 카드** | 22913:1051713 · 22913:1052131 | Linked UID 아래에 `10,001.00 USDT Total cumulative cashback` · `This month` · `Total withdrawn` · `View history` · `Sum of 3 linked UIDs · Updated daily at 09:00 KST` | **현행으로 보임** (MAXOP-731. S4 홈의 최신 수정) |
| UID 개수 변형 | 5947:95236 · 5947:95730 · 7633:92140 · 7633:90865 · 6042:90851 | UID 1개 / 3개 거래소 / 거래소당 2개 이상(접힘·펼침) / 긴 UID(OKX) | 현행 |

---

## 1. [MAX-7] Landing Page (1:6)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| S1 & S2 (Guest) - lightMode (mWeb) | 3132:9578 | ![](img/1-6__3132-9578.jpg) | 28 + Carousel 2 |
| S3 - lightMode (mWeb) | 3969:44475 | ![](img/1-6__3969-44475.jpg) | 7 |
| S4 - lightMode (mWeb) | 4060:22402 | ![](img/1-6__4060-22402.jpg) | 10 |
| S1/S2 lightMode (Web) | 3760:29931 | ![](img/1-6__3760-29931.jpg) | 23 + carousel 1 |
| S3 lightMode (Web) | 4060:54416 | ![](img/1-6__4060-54416.jpg) | 6 |
| S4 lightMode (Web) | 4060:59454 | ![](img/1-6__4060-59454.jpg) | 4 |
| hoverState (Web) | 10343:156424 | ![](img/1-6__10343-156424.jpg) | 1 |
| S3/S4 mobileAPP | 8582:158408 | ![](img/1-6__8582-158408.jpg) | 6 (라이트 3) |
| Existing screens | 2961:27015 | ![](img/1-6__2961-27015.jpg) | 구 화면 다수 |
| Lo-fi Mockup based on PRD | 123:3408 | ![](img/1-6__123-3408.jpg) | 5 |
| S1 (흐름도) | 2845:30675 | ![](img/1-6__2845-30675.jpg) | 흐름도 |
| S2 (흐름도) | 2845:30698 | ![](img/1-6__2845-30698.jpg) | 흐름도 |
| MAXOP-307 - Improvement FAQ text | 17000:49001 | ![](img/1-6__17000-49001.jpg) | 6 |
| MAXOP-398 - making sign up button in landing page | 17531:228489 | ![](img/1-6__17531-228489.jpg) | 2 |
| [MAXOP-401] mock-up redesign | 17531:229940 | ![](img/1-6__17531-229940.jpg) | 캐러셀 목업 |
| MAXOP-476 | 18126:146050 | ![](img/1-6__18126-146050.jpg) | 6 |
| [MAXOP-731] Accumulated Cashback | 22913:1052130 | ![](img/1-6__22913-1052130.jpg) | 4 (라이트 2) |
| [MAX-1216] UID detail update › Light | 25867:1061140 | ![](img/1-6__25867-1061140.jpg) | 4 |
| MAXOP-783 Earning timeline readability (2026-09-30) | 26047:56578 | ![](img/1-6__26047-56578.jpg) | 캐러셀 + 2 (다크 포함 캡처) |

제외(기록만): 다크 섹션 6개(8316:201565 · 8366:210595 · 8377:222564 · 8467:68632 · 8468:80338 · 8468:86060) · Hierarchy/IA 73:7271 · Legend 78:7725 · Onboarding Users 78:7733 · Affinity Mapping 2263:7585 · Top 5 critical issues 2263:16880 · S3 2845:30799(빈 섹션) · Discovery 7922:86519(탐색 70프레임) · Idea2 8582:152528 · QA maxop-181 15021:113873 · MAX-1216 Dark 25867:1063437 · mobileWeb 섹션 바로 아래 낱개 프레임(selectExchange 4개 · issue · Frame 등).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| Landing Page (Full) | 8549:141661 | mWeb | 게스트 랜딩 전체: 「Trade More, Pay Less.」 + 거래소 선택·UID 입력·`Claim cashback` · 19+/70,000/24/7 · Limited Time Offers · Exclusive · Marketing Video · Top Partner · 3단계 캐러셀 · Already on an exchange? · FAQs · 푸터 |
| Enter UID / Verification | 3112:18902 · 3112:19411 · 3112:19914 · 3112:20479 | mWeb | UID 입력(숫자 키패드) → 슬라이드 퍼즐 → `Verification Success` |
| What is UID? (LBank 외 / LBank) | 8566:64273 · 8566:64290 | mWeb | UID 위치 안내 모달 |
| Select an exchange | 4997:37081 | mWeb | 거래소 선택 시트(검색 · Top Partner · All Exchanges 19) |
| Failed UID link scenarios | 7922:103130 · 7922:104555 · 7922:105040 · 11713:129274 | mWeb | `Unable to Search UID` / `UID Already in Use` / `Unable to Search UID`(지원 문의) / 재시도 대기 시간 |
| User did not enter UID | 3138:23462 · 3138:23898 · 3138:24386 | mWeb | 빈 UID 상태 |
| Contact Support Floating icon | 8643:78975 | mWeb | 우하단 헤드셋 플로팅 |
| header + banner fixed top | 9193:79272 | mWeb | 스크롤 시 배너+헤더 고정 |
| Cashback page per UID (guest) | 9193:119755 · 5947:98085 | mWeb | 게스트 UID 캐시백 상세: 출금 가능 / 불가(`Minimum withdrawal amount 10 USDT`) |
| Email copied | 8798:159753 | mWeb | 푸터 이메일 복사 스낵바 |
| FAQ (EN·KO·TC·RS·ID·VN) | 3677:42998 외 | mWeb | 언어별 FAQ 펼침 |
| Landing Page (S3 - no linked UIDs) | 4248:33574 | mWeb | 0.6절 S3 |
| Exchange (list view) | 9193:121178 | mWeb | All Partner Exchanges 리스트형 |
| Without 'Get APP' banner | 8377:218393 | mWeb | 배너 없는 S3 |
| Open App 배너 | 8377:221056 | mWeb | 앱 설치 사용자용 `Open App` |
| Notifications | 8582:160728 · 8582:159853 · 8582:159903 | mWeb | 벨 빨간 점 / 알림 목록(`Notifications 10`) / `No Notifications` |
| S4 full view | 4060:25384 | mWeb | 0.6절 S4 |
| 1 UID / 3 UID / 2+ UID / 탭 펼침 / 긴 UID | 5947:95236 · 5947:95730 · 7633:92140 · 7633:90865 · 6042:90851 | mWeb | Linked UID 카드 변형 |
| UID Detail (Member) 출금 가능 / 불가 | 6042:88184 · 12792:46713 | mWeb | Available/Total Claimed · Exchange Cashback · Event Reward · Earning Timeline · Top Partner · Exclusive · Withdraw · View Cashback Summary |
| Copy UID | 8582:167558 | mWeb | `UID Copied` 스낵바 |
| Homepage | 3448:22879 | Web | 게스트 랜딩 전체(어두운 히어로) |
| Select an exchange · What is UID? · onHover | 8468:75336 · 8582:158504 · 8582:158756 · 8468:75550 · 8468:75731 · 8468:75912 | Web | 거래소 선택 모달(기본·호버·스크롤) · UID 안내 |
| Enter UID → 퍼즐 → 성공 | 8366:214198 · 8366:214813 · 8366:215436 | Web | 인증 흐름 |
| My Cashback (guest) 출금 가능 / 불가 | 4060:49023 · 8468:77304 | Web | 게스트 UID 캐시백 상세 |
| Failed UID link scenarios | 8836:70767 · 8836:70897 · 8836:70932 | Web | `Unable to Link UID` ×2 · `UID Already in Use` 다이얼로그 |
| GNB switch / Contact Support / header fixed | 4060:70293 · 8643:127876 · 9193:79943 | Web | 스크롤 시 GNB · 플로팅 · 고정 헤더 |
| S3 Web / All Partner / Notifications | 4060:57161 · 8267:186758 · 8643:121393 · 8643:124416 | Web | S3 홈 · 전체 거래소 · 알림 패널(목록·빈 상태) |
| 알림 패널(mAPP/LP) | 8705:44264 · 8705:44418 | Web | 알림 드롭다운 목록 · 빈 상태 |
| S4 Web / UID 상세 출금 가능·불가 / 거래소 4개 초과 | 6487:76563 · 6267:53830 · 8135:174941 · 8582:165553 | Web | S4 홈 · UID 상세 · Top Partner 캐러셀(최대 6) |
| hoverState | 10343:156373 | Web | GNB 호버 |
| S3 / S4 / UID 상세 | 8582:154521 · 8582:156599 · 8582:157676 | mAPP | 앱 홈 S3 · S4 · UID 상세 |
| Existing screens | 2825:30654 외 | mWeb/mAPP | 구(2022~) 테더맥스 화면: 스플래시 · 구 랜딩 · 구 가입 · 구 홈 · 구 캐시백 리포트 |
| Lo-fi | 123:2509 · 123:3153 · 1647:6780 · 123:2719 · 123:3267 | mWeb/Web | 「Don't Just Trade. Get Rewarded.」 와이어프레임 |
| S1 · S2 흐름도 | 2845:30679 · 2845:30701 | — | 게스트 흐름 문제 정의 |
| MAXOP-307 | 17000:64488 · 17000:86131 · 17000:65400 · 17000:66970 · 17000:65869 · 17000:67309 | mWeb/Web | 랜딩 FAQ와 TetherMax Point 페이지 FAQ 글자 크기(16/14px)·펼침 규칙 |
| MAXOP-398 | 17531:228765 · 17531:229198 | mWeb | 헤더에 `Sign Up` 버튼(라이트·다크) |
| MAXOP-401 | 17531:229940 | — | 3단계 캐러셀 목업 VERSION 1 → UPDATED(KR/EN) |
| MAXOP-476 | 18700:65581 · 18700:49998 · 18700:65573 · 18700:66462 · 18700:54657 · 18700:57300 | mWeb/Web | 게스트 UID 검색 결과(이벤트 1개·여러 개) · 회원 UID 상세(Weekly Cashback History 추가) |
| MAXOP-731 | 22913:1051713 · 22913:1052131 | mWeb/Web | 누적 캐시백 카드 |
| MAX-1216 | 25867:1347701 · 25867:1348199 · 25867:1348700 · 25867:1348944 | Web/mWeb | UID 상세 리뷰 유도(`How was Bitget? … Write a review, get 2 USDT` / 이미 작성 시 `Share your Bitget experience`) |
| MAXOP-783 | 26047:56685 · 26047:1348691 · 26047:1349155 | mWeb/Web | Earning Timeline을 Step 1~3 탭 캐러셀로 변경(화살표·스와이프, 동작 설명 포함) |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 게스트 랜딩 히어로 | Lo-fi | Lo-fi Mockup | 123:2509 | — | 「Don't Just Trade. Get Rewarded.」 회색 와이어 | 폐기 |
| | Existing | Existing screens | 2961:27015 | — | 구 테더맥스(소문자 로고, 파란 톤) | 폐기 |
| | **MAX-7 S1/S2** | S1&S2 / S1/S2 | 8549:141661 · 3448:22879 | — | 「Trade More, Pay Less.」 + UID 입력 폼 | **현행 후보** (DEX(revision)이 이 컴포넌트를 씀) |
| | MAXOP-398 | MAXOP-398 | 17531:228765 | MAXOP-398 | 위 + mWeb 헤더 Sign Up | MAX-7 위의 수정 |
| | Renewal | 19479 페이지 | 2절 | — | 앰배서더 히어로 | ❓ 사용자 확인 #3 |
| UID 상세(회원) | 기본 | S4 | 6042:88184 · 6267:53830 | — | 잔액 블록 · Earning Timeline(3아이콘) · Top · Exclusive · Withdraw | 구판 |
| | MAXOP-476 | MAXOP-476 | 18700:54657 · 18700:57300 | MAXOP-476 | Weekly Cashback History(요일 원형) · Limited · Exclusive · Top 추가 | 중간판 |
| | MAX-1216 | MAX-1216 Light | 25867:1347701 외 | MAX-1216 | 리뷰 유도 배너 2종(미작성·작성) | 중간판 |
| | **MAXOP-783** | MAXOP-783 | 26047:1348691 · 26047:1349155 | 2026-09-30 | Earning Timeline을 Step 탭 캐러셀로. 리뷰 배너 유지 | **현행** (섹션 이름 날짜가 가장 늦음). Weekly History 누락은 ❓ #6 |
| S4 홈 | 기본 | S4 | 4060:25384 · 6487:76563 | — | Linked UID 카드 | 구판 |
| | **MAXOP-731** | MAXOP-731 | 22913:1051713 · 22913:1052131 | MAXOP-731 | 누적 캐시백 카드 추가 | **현행으로 보임** (가장 최신 MAXOP) |
| 게스트 UID 캐시백 상세 | 기본 | S1&S2 | 9193:119755 · 4060:49023 | — | Earning Timeline · Top Partner · Exclusive · Withdraw | 구판 |
| | MAXOP-476 | MAXOP-476 | 18700:65581 · 18700:65573 | MAXOP-476 | `Join TetherMax now to earn more cashback` 띠 · Events 카드 · 하단 Withdraw | **현행으로 보임** |
| 랜딩 FAQ | 기본 | S1&S2 | 3677:42998 외 | — | FAQ 목록 | 구판 |
| | MAXOP-307 | MAXOP-307 | 17000:64488 · 17000:86131 | MAXOP-307 | 질문 14px·제목 16px, 한 번에 하나만 펼침 | **현행** |
| 3단계 캐러셀 | VERSION 1 | MAXOP-401 | 17531:229940 | MAXOP-401 | 작은 목업 | 폐기 |
| | UPDATED (KR/EN) | MAXOP-401 | 17531:229940 | MAXOP-401 | 큰 목업 · KR 문구판 | **현행** |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 빈 상태(알림 없음 `No Notifications`) | MAX-7 | 8582:159903 · 8705:44418 | 1-6__3969-44475 · 1-6__4060-54416 |
| 다이얼로그(UID 연동 실패 3종) | MAX-7 | 7922:103130 · 7922:104555 · 7922:105040 · 8836:70767 · 8836:70897 · 8836:70932 | 1-6__3132-9578 · 1-6__3760-29931 |
| 바텀시트(거래소 선택 / What is UID?) | MAX-7 | 4997:37081 · 8566:64273 | 1-6__3132-9578 |
| 스낵바(`UID Copied` · `Copied`) | MAX-7 | 8582:167558 · 8798:159753 | 1-6__4060-22402 · 1-6__3132-9578 |
| 인라인 경고(`Minimum withdrawal amount 10 USDT`, 주황 배경) | MAX-7 | 5947:98085 · 12792:46713 · 8135:174941 | 1-6__4060-22402 · 1-6__4060-59454 |
| 비활성 버튼(Withdraw · Claim cashback) | MAX-7 | 4248:33574 · 12792:46713 | 1-6__3969-44475 · 1-6__4060-22402 |
| 배지/칩(`Active` 초록 · `Ongoing` 회색 · `Ends in 45 M 37 S` 주황 · `🎁 3 USDT` · 필터 칩) | MAX-7 | 6042:88184 · 4248:33574 | 1-6__4060-22402 · 1-6__3969-44475 |
| 벨 빨간 점 · 알림 개수 배지 | MAX-7 | 8582:160728 | 1-6__3969-44475 |
| 슬라이드 퍼즐 → 성공 모달 | MAX-7 | 3112:19914 · 3112:20479 | 1-6__3132-9578 |
| 플로팅 고객지원 버튼 | MAX-7 | 8643:78975 · 8643:127876 | 1-6__3132-9578 |

---

## 2. [MAX-] Landing Page Renewal (19479:45824)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| 메인페이지 (1차) | 19479:46266 | ![](img/19479-45824__19479-46266.jpg) | 라이트 Web 1 · mWeb 1 (+다크 2 · 애니메이션 조각 5) |
| 비회원 페이지 (1차) | 19479:48810 | ![](img/19479-45824__19479-48810.jpg) | 라이트 2 (+다크 2) |
| 메인페이지 (2차) | 19479:53439 | ![](img/19479-45824__19479-53439.jpg) | 라이트 2 (+다크 2 · 조각 8) |
| 비회원 페이지 (2차) | 19479:55983 | ![](img/19479-45824__19479-55983.jpg) | 라이트 2 (+다크 2) |
| Updated ysy bg blending | 20850:89507 | ![](img/19479-45824__20850-89507.jpg) | 라이트 2 (+다크 2) |
| update clause max-1208 | 20932:96536 | ![](img/19479-45824__20932-96536.jpg) | 라이트 2 (+다크 2) |

제외: Landing Page QA Results 21205:151412 (QA 11장) · 페이지 바로 아래 낱개 프레임 4개(19479:47973 · 48252 · 48531 · 55146 등 메인페이지 사본, 20972:197090 다크).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| 메인페이지_라이트모드 (1차) | 19479:46267 · 19479:46652 | Web · mWeb | 「The world's highest cashback / Best rate, or we pay the difference.」 + 이메일 가입 · 통계 4카드 · Up to 90% cashback(거래소 표 · 인기 거래소 · TOP 5 트레이더 · 추이 차트) · Someone is cashing out · 영상 · Three steps · New to futures? · Exchange Events · TetherMax Benefits · FAQs · 푸터 |
| 메인페이지_라이트모드 (2차) | 19479:53440 · 19479:53825 | Web · mWeb | 히어로가 앰배서더 사진 + 「Found a higher rate? We want to hear it」, `Sign up and get up to 10,000 USDT!` |
| bg blending | 20850:86315 · 20850:86758 | Web · mWeb | 2차의 히어로 배경 블렌딩 보정 |
| clause max-1208 | 20932:96537 · 20932:96981 | Web · mWeb | 제목 두 줄(`Up to 90% cashback, / for as long as you trade`) · `*Our cashback rate is matched against WOO X PRO's published rate.` 각주 · `More ways to earn` |
| 비회원 페이지_라이트버전 | 19479:48811 · 19479:48848 / 19479:55984 · 19479:56021 | Web · mWeb | 「Already signed up on our Partner Exchanges?」 UID 연동 폼 · 「Don't leave your cashback behind.」 가입 띠 · 푸터 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| Renewal 메인 | 1차 | 메인페이지 | 19479:46267 | — | 「Best rate, or we pay the difference.」, 사진 없음 | 폐기 |
| | 2차 | 메인페이지 | 19479:53440 | — | 앰배서더 히어로 | 중간판 |
| | bg blending | Updated ysy bg blending | 20850:86315 | — | 히어로 배경 보정 | 중간판 |
| | **clause max-1208** | update clause max-1208 | 20932:96537 · 20932:96981 | MAX-1208 | WOO X PRO 기준 각주 · 제목 줄바꿈 | **Renewal 안에서는 현행** (번호가 붙은 마지막 판). 랜딩 전체 기준 여부는 ❓ #3 · GNB는 ❓ #1 · 헤더 아이콘은 ❓ #4 |
| Renewal 비회원 | 1차 | 비회원 페이지 | 19479:48811 | — | Web 푸터 Company 3개 | 구판 |
| | 2차 | 비회원 페이지 | 19479:55984 | — | Company에 `Claim Cashback` 추가 | **현행으로 보임** (❓ #11) |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 해당 없음 (마케팅 페이지. 상태 프레임 없음) | — | — | — |

---

## 3. [MAX-] Service Introduction (3710:45128)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb › service introduction - lightMode | 11435:127340 | ![](img/3710-45128__11435-127340.jpg) | 5 |
| mAPP › service introduction - lightMode | 11490:108934 | ![](img/3710-45128__11490-108934.jpg) | 3 |
| Web › lightMode | 11490:107664 | ![](img/3710-45128__11490-107664.jpg) | 6 |

제외: 다크 섹션 3개(11435:127341 · 11490:108930 · 11490:108928) · QA results 14374:489136 · 낱개 프레임 16343:374638 · 16343:376132.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| mWeb/landingPage/firstFold | 11435:88594 | mWeb | 「Earn Cashback on Every Trade」 · Why Serious Traders Choose(거래소 로고 · Binance/Bybit/OKX 비교 카드) · #1 Cashback Platform · Special Benefits · Welcome Bonus · Invite Friends · 캐시백 계산기 · Get Started · Terms & Conditions 접힘 · 푸터 |
| 게스트 하단 잘린 판 | 13114:384410 | mWeb | 「For members, remove this section」 |
| Terms&NotesExpanded | 13344:273806 | mWeb | 약관 펼침 |
| CTA enabled / Results | 11435:90025 · 11435:90026 | mWeb | 계산기 입력 완료 · 결과(`19,600.20 USDT` · Try Again) |
| mAPP 본문 | 11490:108935 | mAPP | mWeb와 같고 푸터 없음 |
| Web 본문 | 12792:229228 | Web | 같은 구성 Web판 (GNB에 About Us) |
| image / Service intro KR / More than 2 cards | 13074:234707 · 17523:227278 · 13114:391849 | Web | 배지 이미지 EN/KR · 혜택 카드 3장 이상 캐러셀 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 서비스 소개 | Service Introduction | 3710 | 12792:229228 · 11435:88594 | — | 「Earn Cashback on Every Trade」 | 구판 |
| | service intro improvement | 18784 | 4절 | MAX-1000 | 「TetherMax, Your Crypto Cashback Partner」 전면 재구성 | **현행으로 보임** (MAX 번호가 더 큼) |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 비활성 버튼(계산기 `Calculate`) | 3710 | 11435:88594 | 3710-45128__11435-127340 |
| 결과 카드 + 재시도(`Try Again`) | 3710 | 11435:90026 | 3710-45128__11435-127340 |

---

## 4. [MAX-1000] service intro improvement (18784:49879)

섹션이 없고 페이지 바로 아래에 프레임이 있습니다. 라이트 본 화면 4개를 프레임 단위로 캡처했습니다.

### 섹션(프레임)

| 프레임 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| 서비스 소개_pc_라이트모드 | 19224:1267 | ![](img/18784-49879__19224-1267.jpg) | 1 |
| Lay out all exchange orders in full row instead of cropping them | 22012:74385 | ![](img/18784-49879__22012-74385.jpg) | 1 |
| 서비스 소개_mo_라이트모드 (A) | 19224:4458 | ![](img/18784-49879__19224-4458.jpg) | 1 |
| 서비스 소개_mo_라이트모드 (B) | 19224:5152 | ![](img/18784-49879__19224-5152.jpg) | 1 |

제외: 서비스 소개_pc_다크모드 19224:1993 · Service Intro QA Results 21268:155831 · 애니메이션·조각 프레임(KOL ×6 · 101 · 102 · 1~8 · 히어로/숫자/표/거래소 롤링 애니메이션 · Dropdown · 테더맥스를 선택하는 이유 ×5 등) · 숨김 webPrelogin 19224:1987.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| 서비스 소개 PC | 19224:1267 | Web | 회원 GNB · 「TetherMax, Your Crypto Cashback Partner」 · 거래소 로고 띠 · 19+ · 24/7 Customer Support · 실시간 출금 표 · Why traders never leave · How is cashback even possible? · 3 minutes … first payout · New here? Take 90% · 계산기 · More rewards · 경쟁 이벤트 · Earn While You Learn · Your audience trades(KOL) · creators · 리뷰 · Find a better rate · Get the app(QR) · 푸터 |
| 거래소 줄 전체 배치판 | 22012:74385 | Web | 위와 같고 거래소 로고 줄을 자르지 않고 한 줄로 |
| 서비스 소개 mo (A/B) | 19224:4458 · 19224:5152 | mWeb | 모바일판(로고+햄버거, 배너 없음) |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 서비스 소개 PC | 기본 | — | 19224:1267 | — | 거래소 로고 줄을 양끝에서 자름 | 구판 |
| | full row | — | 22012:74385 | — | 프레임 이름대로 로고 줄을 자르지 않음 | **현행으로 보임** (수정 지시가 프레임 이름) |
| 서비스 소개 mo | A / B | — | 19224:4458 · 19224:5152 | — | 픽셀상 다르나 눈으로 차이 미확인 | ❓ #9 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 해당 없음 (마케팅 페이지) | — | — | — |

---

## 5. [MAX-497] Urgent Notice, Error Page, Language Settings (7596:82106)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Web › lightMode (게스트 언어) | 12216:428730 | ![](img/7596-82106__12216-428730.jpg) | 2 |
| Web › lightMode (회원 언어) | 12216:430122 | ![](img/7596-82106__12216-430122.jpg) | 2 |
| Web › Urgent notice - lightMode | 13086:341661 | ![](img/7596-82106__13086-341661.jpg) | 1 |
| mWeb › Language Settings - lightMode (게스트) | 10677:56480 | ![](img/7596-82106__10677-56480.jpg) | 4 |
| mWeb › Language Settings - lightMode (회원) | 12216:422716 | ![](img/7596-82106__12216-422716.jpg) | 4 |
| mWeb › Urgent Notice - lightMode | 13086:341283 | ![](img/7596-82106__13086-341283.jpg) | 1 |
| mWeb › 404 error lightMode (게스트) | 12216:420479 | ![](img/7596-82106__12216-420479.jpg) | 1 |
| mWeb › 404 error lightMode (회원) | 12216:420765 | ![](img/7596-82106__12216-420765.jpg) | 1 |
| mWeb › mobileAPP › lightMode | 12216:422516 | ![](img/7596-82106__12216-422516.jpg) | 3 |
| Web › 404 error lightMode (게스트) | 12216:420616 | ![](img/7596-82106__12216-420616.jpg) | 1 |
| Web › 404 error lightMode (회원) | 12216:421421 | ![](img/7596-82106__12216-421421.jpg) | 1 |
| MAXOP-767 › Light | 26019:10979 | ![](img/7596-82106__26019-10979.jpg) | 2 |
| MAXOP-767 › KR (popup only) | 26030:11517 | ![](img/7596-82106__26030-11517.jpg) | 4 (라이트 2 · 다크 2) |

제외: 다크 섹션 8개(12216:434929 · 12216:428731 · 13086:341662 · 12216:424276 · 12085:400567 · 13086:341284 · 12216:420480 · 12216:420768 · 12216:422517 · 12216:422012 · 12216:420617 · 26019:715170) · References 13032:55700(구 긴급공지·404 시안 16장) · QA updated as of 8th June 14762:409429.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| 언어 모달(게스트) 기본 / onHover | 12216:428728 · 12216:428729 | Web | 게스트 랜딩 위 `Language` 2열 모달(15개 언어, 선택 ✓ 블루), 호버 시 회색 행 |
| 언어 모달(회원) 기본 / onHover | 12216:432837 · 12216:434928 | Web | 회원 홈 위 같은 모달 |
| Urgent notice | 13086:341658 | Web | 회원 홈 위 `MEXC Event Has Ended` 확성기 다이얼로그 + `OK` |
| Hamburger Menu (Entrypoint) · 시트 · onScroll · Full list | 12085:400249 · 12085:400397 · 12085:400250 · 12085:400563 | mWeb | 게스트 드로어 → `Language` 바텀시트(스크롤 · 전체 목록) |
| 같은 흐름(회원) | 12216:424053 · 12216:424123 · 12216:424193 · 12216:424275 | mWeb | 회원 드로어에서 진입 |
| Urgent Notice | 13086:341140 | mWeb | 회원 홈 위 긴급 공지 |
| 404 (게스트/회원) | 12085:401487 · 12216:421112 | mWeb | `Error 404` 일러스트 · `Page Not Found` · 지원 메일 안내 · `Back to Home` |
| 404 / No Internet / 언어 시트 | 12216:422278 · 12216:420284 · 12216:436515 | mAPP | 앱 404 · `No Internet Connection` + `Reload` · My Page에서 연 언어 시트 |
| 404 (게스트/회원) | 12216:419863 · 12216:421961 | Web | Web 404 |
| Urgent notice / do not show today | 26019:10980 · 26019:11373 | Web · mWeb | `OK` 아래 `Don't show again today` 추가 |
| KR popup | 26030:15231 · 26030:15379 | Web · mWeb | `MEXC 이벤트 종료 안내` · `확인` · `오늘 하루 보지 않기` |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 긴급 공지 | 구 시안 | References | 13070:28964 외 | — | `긴급 공지` 구 시안 | 폐기(참고용) |
| | 기본 | Urgent notice | 13086:341658 · 13086:341140 | — | `OK`만 | 구판 |
| | **MAXOP-767** | MAXOP-767 | 26019:10980 · 26019:11373 · 26030:15231 | 2026-09-30 | `Don't show again today` / `오늘 하루 보지 않기` 추가 | **현행** (날짜) |
| 언어 설정 진입 | 게스트 / 회원 | Language Settings 두 섹션 | 10677:56480 · 12216:422716 | — | 드로어만 다름(Welcome 카드 유무) | 판 차이가 아니라 상태 차이. 둘 다 현행 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 오류 페이지(404) Web·mWeb·mAPP, 게스트·회원 | MAX-497 | 12216:419863 · 12216:421961 · 12085:401487 · 12216:421112 · 12216:422278 | 7596-82106__12216-420616 외 |
| 네트워크 오류(`No Internet Connection` + `Reload`) | MAX-497 | 12216:420284 | 7596-82106__12216-422516 |
| 다이얼로그(긴급 공지, `오늘 하루 보지 않기`) | MAX-497 | 26019:10980 · 26030:15231 | 7596-82106__26019-10979 · 7596-82106__26030-11517 |
| 바텀시트(언어, 스크롤바) | MAX-497 | 12085:400397 · 12085:400563 | 7596-82106__10677-56480 |
| 모달(Web 언어, 호버 행) | MAX-497 | 12216:428729 | 7596-82106__12216-428730 |

---

## 6. [MAX-273] Maintenance & Mandatory APP update (2139:54508)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Mandatory App Update | 2913:17184 | ![](img/2139-54508__2913-17184.jpg) | 1 |
| Korean (앱 업데이트) | 2913:18277 | ![](img/2139-54508__2913-18277.jpg) | 1 |
| Maintenance Page | 2905:16629 | ![](img/2139-54508__2905-16629.jpg) | 2 |
| Maintenance Page [Updated as of 23rd June MAXOP-299] | 17000:843 | ![](img/2139-54508__17000-843.jpg) | 8 (라이트 4 · 다크 4) |
| Korean (점검) | 2913:18452 | ![](img/2139-54508__2913-18452.jpg) | 2 |

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| updateRequiredMobileApp (EN/KR) | 2913:17755 · 2913:18278 | mAPP | 구 앱 홈 위 `Update Required` / `업데이트 필요` 다이얼로그 + `Update Now`(밝은 파랑) |
| maintenaceMobile / maintenanceDesktop | 2913:16910 · 2913:17118 | mWeb · Web | 렌치 든 손 일러스트 · `System Maintenance` · 일정 `Feb 11, 2026 (Wed) 15:00 – 16:00 KST` · 로고 |
| MAXOP-299 EN 라이트 | 17000:844 · 17000:883 | mWeb · Web | 톱니 일러스트, 일정에 `KST` 없음 |
| MAXOP-299 KR 라이트 | 17000:47366 · 17000:47442 | mWeb · Web | `시스템 유지보수` · `유지보수 일정` |
| Korean (구) | 2913:18453 · 2913:18492 | mWeb · Web | 구판 한국어 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 점검 페이지 | 기본(EN·KR) | Maintenance Page · Korean | 2913:16910 · 2913:17118 · 2913:18453 | — | 렌치 일러스트, `KST` 표기 | 구판 |
| | **MAXOP-299** | Maintenance Page [Updated as of 23rd June] | 17000:844 · 17000:883 · 17000:47366 · 17000:47442 | MAXOP-299, 6/23 | 톱니 일러스트, 타임존 라벨 없음, 다크 포함 | **현행** (섹션 이름 날짜·번호) |
| 앱 강제 업데이트 | 기본 | Mandatory App Update | 2913:17755 | — | 구 앱 홈·구 4탭 위, 밝은 파랑 버튼 | 구판 |
| | **MAX-829 Updated** | 7절 | 14849:432474 · 14727:399969 | 6/8 | 현행 앱 홈·5탭 위, 브랜드 블루 `Update Now` | **현행** |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 점검 전체 화면 | MAX-273 | 17000:844 · 17000:883 | 2139-54508__17000-843 |
| 다이얼로그(강제 업데이트) | MAX-273 | 2913:17755 | 2139-54508__2913-17184 |

---

## 7. [MAX-829] APP user action (14578:32853)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Updated as of 8th June | 14715:396400 | ![](img/14578-32853__14715-396400.jpg) | 3 + 조각 3 |
| Out of Scope (라이트) | 14852:4700 | ![](img/14578-32853__14852-4700.jpg) | 5 |
| Out of Scope (다크, 비교용) | 14849:424734 | ![](img/14578-32853__14849-424734.jpg) | 5 |
| Existing for ref | 14727:399987 | ![](img/14578-32853__14727-399987.jpg) | 8 |
| MAXOP-758 App nav red dot (revision 2026-09-29) | 25847:1340913 | ![](img/14578-32853__25847-1340913.jpg) | 2 (+숨김 3) |

제외: Updated as of 8th June - darkMode 14727:405360 · MAXOP-758 [Dark] 25856:1342836 · 낱개 Group 4614 15502:66774.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| Withdrawal Updates | 14727:398314 | mAPP | 회원 홈 위 바텀시트: 알림 권한 요청 · 폰 알림 미리보기 · `Maybe Later` / `Notify Me` |
| Ownership Updates | 14727:399067 | mAPP | 소유권 인증 알림 권한 요청 시트 |
| Update Required | 14727:399969 | mAPP | 현행 홈 위 강제 업데이트 다이얼로그 · 하단 5탭 |
| Friend Invitation Reward / Welcome Bonus | 14852:4701 · 14852:4702 | mAPP | 쿠폰 일러스트 · `Claim Now` 시트 |
| Get Withdrawal Alerts / BingX Competition | 14852:4703 · 14852:4704 | mAPP | 알림 권한 요청 시트(범위 외) |
| Update Available | 14852:4708 | mAPP | 선택 업데이트 · `Update Now` / `Remind Me Later` |
| 전체_로그인 후 · 회원가입메인_mo1_2 | 14578:32902 외 7 | mAPP | 구 앱의 같은 흐름(구 4탭, 밝은 파랑) |
| App nav (new) · dot on Benefits / Point | 25854:1340443 · 25854:1340473 | mAPP | 5탭에 빨간 점 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 알림 권한 요청 시트 | 구 | Existing for ref | 14578:33204 외 | — | 구 앱 홈, `Get Notifications`/`Later` | 폐기 |
| | **Updated** | Updated as of 8th June | 14727:398314 · 14727:399067 | 6/8 | 현행 홈, `Maybe Later`/`Notify Me` | **현행** |
| | Out of Scope | Out of Scope | 14852:4701~4704 | — | 보상 시트 · 기타 권한 요청 | 범위 외(섹션 이름) |
| 앱 업데이트 | 구 | Existing for ref | 14578:33576 · 14578:33678 | — | `There is a mandatory update.` / `Do not show for 3 days` | 폐기 |
| | **Updated** | Updated as of 8th June | 14727:399969 | 6/8 | `Update Required` | **현행** |
| | 선택 업데이트 | Out of Scope | 14852:4708 | — | `Update Available` · `Remind Me Later` | 범위 외 |
| 하단 탭 빨간 점 | 구 탭 점 | MAXOP-758 | 25847:1340915 · 25847:1340959 (숨김) | superseded 2026-09-29 | My Page 점 | 폐기 |
| | **새 탭 점** | MAXOP-758 | 25854:1340443 · 25854:1340473 | 2026-09-29 | Benefits · Point 점 | **현행** |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 바텀시트(알림 권한 요청, 2버튼) | MAX-829 | 14727:398314 | 14578-32853__14715-396400 |
| 다이얼로그(강제·선택 업데이트) | MAX-829 | 14727:399969 · 14852:4708 | 14578-32853__14715-396400 · 14578-32853__14852-4700 |
| 배지(탭 빨간 점) | MAX-829 | 25854:1340443 | 14578-32853__25847-1340913 |

---

## 8. [MAX-508] log-in, sign-up (7960:60465)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mobileAPP - Login | 7993:142374 | ![](img/7960-60465__7993-142374.jpg) | 16 |
| Existing (EN) | 7993:142925 | ![](img/7960-60465__7993-142925.jpg) | 4 + 구 화면 |
| Existing (KR) | 10548:225603 | ![](img/7960-60465__10548-225603.jpg) | 35 |
| mWeb › Login/Sign up lightMode | 8086:166580 | ![](img/7960-60465__8086-166580.jpg) | 49 |
| Web › Login/Sign up lightMode | 10548:199133 | ![](img/7960-60465__10548-199133.jpg) | 38 |
| Improvement | 18330:114980 | ![](img/7960-60465__18330-114980.jpg) | 2 |
| MAXOP-696 Account Creation Page - Revise Text Area | 23327:1123006 | ![](img/7960-60465__23327-1123006.jpg) | 2 |

제외: 다크 섹션 2개(11049:85847 · 11073:165125) · QA 13665:136646 · references 18330:115937 · Note 18330:116720.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| Sign up (기본 → 입력 → 이메일 추천 → 퍼즐 → 성공 → 이메일 인증 빈칸 → 입력) | 10542:101933 · 10542:102440 · 10548:219091 · 11630:295019 · 10542:102717 · 10548:191335 · 10542:103004 · 10542:103005 | mWeb | `Create Account` · `Sign up and trade to earn rewards / up to 100 USDT` · Email · Password · Referral Code (optional) · 약관 체크 · `Continue` → 슬라이드 퍼즐 → 6자리 코드 |
| Signing up with / without Invitation Code | 10548:191334 · 12328:78361 | mWeb | 가입 직후 홈 위 `Invitation Reward Received` / `First Reward Received` 다이얼로그 |
| Terms of Use / Privacy Policy | 11572:246052 · 11572:246053 | mWeb | 약관 전문 + `Close` |
| Error states (가입) | 10548:199901 · 10548:216386 · 10548:200428 · 11049:148559 · 10548:205271 · 11490:137001 | mWeb | 빈 이메일 · 형식 오류 · 비밀번호 규칙 · 너무 짧음 · 추천 코드 · `Invalid invitation code` |
| Wrong code | 12474:44152 | mWeb | 이메일 인증 실패 토스트(`We're unable to verify you. You have 9 attempts left.`) |
| Verify via google authenticator (가입) | 11630:252380 · 11630:252158 | mWeb | `Google Verification` 6자리 · `Verify via Email` |
| Login | 10548:207012 · 10548:207010 · 10548:207009 · 11630:295653 · 10548:207011 · 10548:215093 · 10548:215091 · 10548:215092 | mWeb | `Hi, welcome back!` · `Log in now to complete missions to earn more USDT` · Email · Password · `Forgot Password?` · `Continue` → 퍼즐 → 이메일 인증 → Home |
| Verify via google authenticator (로그인) | 11630:291825 · 11630:292242 | mWeb | Google 인증 |
| Error states / Resend code (로그인) | 10548:215467 · 11049:85824 · 11630:293470 · 11630:294332 | mWeb | `This field is required` · `Your email or password is incorrect. You have 9 attempts left.` 토스트 · 코드 오류 토스트 · `Resend Code` |
| Forget Password (Reset Password) | 11049:97669 ~ 11049:97675 · 11049:94567 · 11073:163739 | mWeb | 이메일 → 퍼즐 → 성공 → 코드 → 새 비밀번호(규칙 체크) → `Password reset successfully.` 토스트 |
| Error states (재설정) | 11049:94568 · 11049:94569 · 11049:94570 | mWeb | 형식 오류 · 빈 이메일 · `This member is not registered. Please sign up first.` 토스트 |
| Sign up / Login 등 | 10548:103656 · 10548:103657 · 10548:185124 · 10548:191338 · 10548:191336 · 10548:191337 · 10548:199108 · 13762:252017 · 13762:251710 · 11049:147536 ~ 11049:149362 · 10548:210709 ~ 11073:165121 · 11049:154170 · 11049:154171 · 11073:70045 ~ 11073:165120 · 11073:164581 · 11073:164867 · 11073:165036 | Web | mWeb와 같은 흐름 Web판(가운데 폼 + 기존 GNB) |
| mobileAPP Sign up / Login | 10548:221874 ~ 10548:219098 · 10548:212113 ~ 10548:212389 | mAPP | ← 뒤로 + 제목, 로고 없음. 가입 후 `Invitation Reward Received`(홈은 mWeb 셸) |
| Existing (EN·KR) | 11490:314541 외 · 10548:225603 내 | mWeb/mAPP | 구 `tetherMax` 로그인·가입·`All done!` 쿠폰 · 구 푸터 · 한국어 구 흐름 |
| Improvement | 18330:116309 · 18330:116709 | Web · mWeb | `Your cashback awaits.` · `Log in to track your cashback and see what you've earned` · `Log In` · `New here? Start earning cashback. Sign Up Now` |
| MAXOP-696 | 23327:1124323 · 23327:1124738 | mWeb · Web | 혜택 띠 문구 순서 변경: 굵은 `Up to 100 USDT` 위 + 작은 `Sign up and trade to earn rewards` 아래 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| 가입(Create Account) | Existing | Existing ×2 | 7993:142925 · 10548:225603 | — | 구 `tetherMax` 화면 | 폐기 |
| | 기본 | mWeb/Web lightMode | 10542:101933 · 10548:103656 | — | 띠: 작은 `Sign up and trade to earn rewards` + 굵은 `up to 100 USDT` | 구판 |
| | Security URL 판 | MAX-686 | 13303:130996 · 13303:201998 | — | 기본판 + 공식 도메인 토스트 | 10절 |
| | **MAXOP-696** | MAXOP-696 | 23327:1124323 · 23327:1124738 | MAXOP-696 | 띠 문구 순서 뒤집음(`Up to 100 USDT` 먼저) | **현행** (MAXOP 번호) |
| 로그인 | 기본 | mWeb/Web lightMode | 10548:207012 · 10548:210709 | — | `Hi, welcome back!` · `Continue` · `Don't have an account? Sign Up Now` | ❓ #5 |
| | Improvement | Improvement | 18330:116309 · 18330:116709 | — | `Your cashback awaits.` · 트로피 · `Log In` · `New here? Start earning cashback.` | ❓ #5 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 인라인 오류(빨간 테두리 + 하단 문구) | MAX-508 | 10548:199901 · 10548:200428 · 10548:215467 | 7960-60465__8086-166580 |
| 비밀번호 규칙 체크(✓ 8-16 characters · ✓ number and special character) | MAX-508 | 10548:200428 · 11049:97673 | 7960-60465__8086-166580 |
| 오류 토스트(다크 + 빨간 X 원) | MAX-508 | 12474:44152 · 11049:85824 · 11630:293470 · 11049:94570 | 7960-60465__8086-166580 |
| 성공 토스트(다크 + 초록 ✓, `Password reset successfully.`) | MAX-508 | 11073:163739 | 7960-60465__8086-166580 |
| 비활성 버튼(`Continue` · `Verify` · `Reset Password`) | MAX-508 | 10542:101933 · 10542:103004 | 7960-60465__8086-166580 |
| 다이얼로그(6자리 코드 · `Send code again 00:20` · `Paste` · `Resend Code`) | MAX-508 | 10542:103004 · 11630:294332 | 7960-60465__8086-166580 |
| 슬라이드 퍼즐 · `Verification Success` | MAX-508 | 11630:295019 · 10542:102717 | 7960-60465__8086-166580 |
| 다이얼로그(가입 보상 `Invitation Reward Received`) | MAX-508 | 10548:191334 | 7960-60465__8086-166580 |

---

## 9. [MAX-426, MAX-498] My Page, Change Password (7884:41063)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Reference | 7993:140530 | ![](img/7884-41063__7993-140530.jpg) | 3 + 벤치마크 |
| mWeb › My Page, Change Password lightMode | 9961:108353 | ![](img/7884-41063__9961-108353.jpg) | 19 + 하위 3섹션(5 · 20 · 12) |
| Web(12474) › My Page, Change Password lightMode | 12474:173498 | ![](img/7884-41063__12474-173498.jpg) | 10 + 하위 3섹션(11 · 16 · 2) |
| mobileAPP › lightMode | 10061:185995 | ![](img/7884-41063__10061-185995.jpg) | 6 |
| plan B | 12085:417284 | ![](img/7884-41063__12085-417284.jpg) | 1 |

제외: 다크 섹션(11010:221046 · 12474:173566 · 11010:254250) · **숨김 Web 섹션 11010:229367**(12474:173497과 같은 구성의 이전 사본) · QA 13883:149393 · 낱개 프레임 21174:282962 · 21120:141496 · 21120:141488 · 21184:42116.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| Pre-login · 드로어 · Terms/Privacy | 10981:110986 · 10061:179743 · 11572:247028 · 11572:247029 | mWeb | 게스트 랜딩 → 게스트 드로어 → 언어 · 약관 |
| Post-login 홈 · 회원 드로어 · My Page 시트 | 10981:110985 · 10061:197517 · 10061:197518 | mWeb | 0-4절 |
| Account Security(Google 미연동 / 연동) | 10061:197519 · 10981:110988 | mWeb | Set New Password · Google Verification · Account Deletion |
| Partners Hub 판 · Copy Member ID toast | 10981:110987 · 10981:110989 | mWeb | 파트너 회원은 Invite Friends 자리에 Partners Hub · `Copied` 토스트 |
| Notification settings(on/off) · 끄기 확인 · 마케팅 동의 | 10061:197520 · 11572:247899 · 11572:248705 · 11572:248810 · 11572:248974 | mWeb | 토글 · `Turn Off Notifications?` · `Marketing Consent Details` |
| Log out confirmation | 11572:249737 | mWeb | `Confirm Log Out` |
| Set new password (20) | 10061:192390 하위 | mWeb | 현재·새·확인 비밀번호 · 규칙 체크 · Incorrect password · 불일치 · Field is required · `Something went wrong` 토스트 · 성공 후 홈 토스트 |
| Google Authenticator (12) | 10061:193137 하위 | mWeb | QR · 키 복사 토스트 · 6자리 입력 · 만료(`Current verification page has expired`) · 해제(`Remove Google Authenticator?` 빨간 버튼) · 보안 인증 · 재전송 · 오류 |
| Upload image / Choose avatar (5) | 10981:196046 하위 | mWeb | 아바타 선택 그리드 · 사진 업로드 · 변경 |
| Post-login(Web) | 12474:173502 · 17170:235039 · 12474:173503 · 12474:173505 · 12474:173500 · 12474:173504 · 12474:173501 | Web | S4 홈 · 우측 My Page 패널 · Account Security 패널 · 알림 패널 · Partners Hub · Google 연동 · Member ID 복사 |
| Terms of Use / Privacy Policy | 12474:202799 · 12474:202970 | Web | 약관 전문 페이지 |
| Set new password / Google / Avatar (Web) | 12474:173527 · 12474:173507 · 12474:173561 하위 | Web | mWeb와 같은 상태의 Web판(모달·패널) |
| mAPP | 10981:111020 · 10981:111021 · 10981:111025 · 10981:111023 · 10981:111024 · 11490:111233 | mAPP | 앱 홈 · My Page(Invite Friends / Partners Hub) · Account Security · Notification Settings(Essential · Marketing · 이메일 동의) · `Turn Off Notifications?` |
| plan B | 12085:417285 | Web | My Page를 전체 페이지로 |
| Reference | 7993:140530 내 | mWeb/Web | 구 테더맥스 My Page · 드로어 초안 · Bing · Weverse · Bybit · Trip.com · KuCoin 벤치마크 |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| Web My Page | **우측 패널** | Web(12474) | 17170:235039 | — | 홈 위 우측 슬라이드 패널 | **현행으로 보임** (본 섹션) · ❓ #7 |
| | plan B | plan B | 12085:417285 | — | 전체 페이지 | ❓ #7 |
| Web 섹션 사본 | 숨김 사본 | Web(11010, 숨김) | 11010:229367 | — | 같은 구성 | 폐기(숨김) |
| | **현행 사본** | Web(12474) | 12474:173497 | — | — | **현행** (보이는 쪽) |
| My Page 구성 | 구 | Reference | 7993:140530 | — | Coupon · Invite · Cashback Ranking · My Rewards · Change Password · Google OTP · Contact Customer Support · Settings | 폐기 |
| | **현행** | mWeb/Web/mAPP | 10061:197518 · 10981:111021 | — | 0-4절 | **현행** |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 다이얼로그(`Turn Off Notifications?` Cancel/Confirm) | MAX-426 | 11490:111233 · 11572:247899 | 7884-41063__10061-185995 |
| 다이얼로그(`Confirm Log Out`) | MAX-426 | 11572:249737 | 7884-41063__9961-108353 |
| 위험 다이얼로그(`Remove Google Authenticator?` 빨간 버튼) | MAX-426 | 10061:193137 하위 | 7884-41063__9961-108353 |
| 인라인 오류(비밀번호) · Field is required | MAX-498 | 10061:192390 하위 | 7884-41063__9961-108353 |
| 오류 토스트(`Something went wrong`) · 성공 토스트 | MAX-498 | 10061:192390 하위 | 7884-41063__9961-108353 |
| 스낵바(Member ID `Copied`) | MAX-426 | 10981:110989 · 12474:173501 | 7884-41063__9961-108353 · 7884-41063__12474-173498 |
| 토글(알림) | MAX-426 | 10981:111024 | 7884-41063__10061-185995 |
| 우측 패널(Web My Page) | MAX-426 | 17170:235039 | 7884-41063__12474-173498 |

---

## 10. [MAX-686] Security URL page (13040:134149)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb › lightMode | 13040:134155 | ![](img/13040-134149__13040-134155.jpg) | 1 |
| Web › lightMode | 13040:134173 | ![](img/13040-134149__13040-134173.jpg) | 1 |

제외: darkMode 13040:134158 · 13040:134176 · 스크린샷 14787:24336.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 화면 |
|---|---|---|---|
| mWeb/landingPage | 13303:130996 | mWeb | Create Account 위 하단 토스트: 방패 아이콘 · `You have been securely connected via the official domain.` · `Please verify the 'tethermax.io' address.` · X · 진행 막대 |
| Web | 13303:201998 | Web | 같은 토스트 Web판(게스트 GNB) |

### 판이 여러 개인 화면

| 화면 | 판 이름 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정·근거 |
|---|---|---|---|---|---|---|
| (8절 「가입」 표에 포함) | — | — | — | — | 가입 화면 문구는 MAXOP-696 이전 순서 | 토스트만 이 페이지의 현행 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 정보 토스트(다크 · 방패 아이콘 · 닫기 · 자동 닫힘 진행 막대) | MAX-686 | 13303:130996 · 13303:201998 | 13040-134149__13040-134155 · 13040-134149__13040-134173 |

---

## 캡처하지 못한 섹션

캡처 시도는 모두 성공했습니다(중간에 Figma 호출 한도에 두 번 걸렸으나 기다린 뒤 다시 받았습니다). 아래는 지시대로 **캡처하지 않고 존재만 기록한** 섹션입니다.

| 페이지 | 섹션 | 이유 |
|---|---|---|
| MAX-7 | 다크 6 · Hierarchy/IA · Legend · Onboarding Users · Affinity Mapping · Top 5 critical issues · S3(빈 섹션) · Discovery · Idea2 · QA maxop-181 · MAX-1216 Dark | 다크 · 리서치 · 아이디어 · QA |
| Renewal | Landing Page QA Results · 페이지 직속 사본 프레임 | QA · 사본 |
| Service Introduction | 다크 3 · QA results · 낱개 프레임 2 | 다크 · QA |
| MAX-1000 | PC 다크 · Service Intro QA Results · 애니메이션 조각 | 다크 · QA · 조각 |
| MAX-497 | 다크 12 · References · QA updated as of 8th June | 다크 · 레퍼런스 · QA |
| MAX-273 | (없음) | — |
| MAX-829 | 다크 2 · Group 4614 | 다크 |
| MAX-508 | 다크 2 · QA · references · Note | 다크 · QA |
| MAX-426 | 다크 3 · 숨김 Web 11010:229367 · QA · 낱개 프레임 4 | 다크 · 숨김 · QA |
| MAX-686 | 다크 2 | 다크 |
