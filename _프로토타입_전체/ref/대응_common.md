# 상태 → Figma 근거 대응 — 1. 공통 · 셸 (common)

조사일 2026-11-26. 색인으로 찾은 뒤 Figma `get_screenshot` · `get_design_context`로 확인했다. 구현에 쓴 노드는 각 상태의 `figma`와 같다.

| 확신 | 뜻 |
|---|---|
| 확실 | 노드 이름 또는 위쪽 라벨(`labels`)·섹션 이름이 상태와 일치, 또는 이번 작업에서 스크린샷으로 확인 |
| 후보 | 크기·섹션 위치·이름으로 추정. 스크린샷 대조 필요 |

## 1. 셸 — 실제 디자인 노드

| 셸 요소 | 상태 | 노드 | 페이지 | 근거 종류 | 확신 | 메모 |
|---|---|---|---|---|---|---|
| 웹 GNB 바 | 로그인 | 28967:127332 `DEX / Web / Navigation` (컴포넌트 27610:192948) | DEX(revision) | DEX | 확실 | 로고 · `Cashback˅` `Rewards Hub˅` `Discover˅` `Calculator` · 벨 · 계정 · 테마 · 언어. 컴포넌트 설명: 「Calculator is separate. Cashback menu has CEX, DEX, Brokers」 |
| 웹 GNB 바 | 비로그인 | 19604:32577 `webPrelogin` (위 줄) | [MAX-] Quiz › GNB | 기존 | 확실 | `Login`(outlined) · `Sign Up`(contained) · 테마 · 언어. DEX(revision) 쪽 후보: DEX overview 게스트 프레임의 `GNB` 인스턴스 I28960:125521;27610:199365 |
| 웹 GNB 드롭다운 | Cashback · Rewards Hub · Discover 열림 | 19604:32651 `합체` · 항목 atom 19604:32646 `atom2` · 캐럿 atom 19604:32639 | [MAX-] Quiz › GNB | 기존 | 확실 | 기존 패널 항목: Cashback = `Exchanges` · `Brokers` · `Cashback Calculator` / Rewards Hub = `Exchanges Events` · `Benefits` · `Points` / Discover = `Beginner's Guide` · `About TetherMax`. DEX 패널(CEX · DEX · Brokers)은 그린 프레임 없음 → 같은 패널에 DEX 컴포넌트 설명의 항목을 얹는다 |
| 웹 GNB 벨 열림 | 알림 패널 | 8643:121393 · 8643:124416 (라벨 `Notifications`) | [MAX-7] Web › S3 | 기존 | 확실 | 로그인 GNB의 벨 클릭 상태 |
| 웹 GNB 언어 | 언어 메뉴 | 12216:428728 · 12216:428729(`onHover`) 비로그인 / 12216:432837 · 12216:434928(`onHover`) 로그인 | [MAX-497] Web › lightMode | 기존 | 후보 | 섹션 라벨 「S1 & S2 (Guest)」·「S3 & S4 (Members)」 위치로 구분. 언어 메뉴인지 스크린샷 확인 필요 |
| 웹 푸터 | 기본 | 4639:42858 `Footer/Web` | [MAX-7] | 기존 | 확실 | 10-common.js `cmnFooter`의 근거 |
| 웹 푸터 | 최신판 | 28967:127334 `FooterA` (1440×389, 섹션 3개 — 그중 `Economic Calendar` · `Heatmaps` 링크, 버튼 2개, `Footer note`) | DEX(revision) › IF7 Invitation Reward tab | DEX | 후보 | Newsletter 페이지(23053:166460)에 22회, Quiz 19604:31881에도 같은 `FooterA`. Footer/Web보다 새 판으로 보임 — 어느 쪽이 현행인지 스크린샷으로 정한다 |
| 모바일 웹 푸터 | 기본 | 4639:42761 `Footer/mWeb` · DEX(revision) 사본 29062:118042 · 29062:116410 | [MAX-7] · DEX(revision) | 기존·DEX | 확실 | |
| 모바일 웹 푸터 | Company › Claim Cashback | 29072:1797 `Footer / Company / Claim Cashback` | DEX(revision) › 게스트 캐시백 | DEX | 확실 | 게스트 조회 진입 링크가 들어간 푸터 |
| 모바일 웹 상단 바 | 비로그인 | 29058:108394 `top nav`(TopNav = Logo + IconButton) · DEX overview 모바일 I28960:130946;27610:306271 `top nav` | DEX(revision) | DEX | 확실 | 375×106 = 상태 바 50 + 바 56. 우측 아이콘 1개(햄버거로 추정) |
| 모바일 웹 상단 바 | 앱 설치 배너 + AppBar | 19479:46919 `<AppBar>`(y=48) + 위 `<Snackbar>` | [MAX-] Landing Page Renewal 모바일 | 기존 | 후보 | 랜딩 모바일 최신판의 상단(Get App 스낵바 48 + 툴바 64). 로그인 화면 모바일(10548:207012)도 같은 설치 배너 |
| 모바일 웹 상단 바 | 로그인 | 8582:154799(Logo + IconButton 3개) | [MAX-7] S3/S4 mobileAPP 홈 8582:154521 | 기존 | 후보 | mWeb S4 홈 4060:25384 상단도 후보 |
| 모바일 웹 드로어 | 비로그인 | 12085:400249 `mWeb/landingPage/Post-login`(라벨 `Hamburger Menu (Entrypoint)`) | [MAX-497] mWeb · S1 & S2 (Guest) | 기존 | 확실 | 이름은 Post-login이지만 섹션 라벨이 Guest. [MAX-426] `Pre-login` 10981:110986 · 10061:179743도 후보 |
| 모바일 웹 드로어 | 로그인 | 12216:424053(375×850) · 10061:197517 `Post-login` | [MAX-497] S3 & S4 · [MAX-426] | 기존 | 확실 | 파트너는 `Partners Hub` 행 10981:110987, 비파트너 `Invite Friends` 10061:197518 |
| 언어 설정 시트 | 기본 · 스크롤 · 전체 목록 | 12085:400397 · 12085:400250(`onScroll`) · 12085:400563(`Full list`) | [MAX-497] mWeb | 기존 | 확실 | 드로어 `Language` 행 → 바텀시트 |
| 앱 하단 탭 | Home 활성 | 8582:155585 `<BottomNavigation>` (부모 `<BottomNav>5-v2` 8582:155583) | [MAX-7] S3/S4 mobileAPP 홈 8582:154521 | 기존 | 확실 | Home · Events · Benefits · Exchanges · Point |
| 앱 하단 탭 | 최신판 · 빨간 점 | 25854:1340444 `App nav (new) · TM MUI BottomNavigation` · 25854:1340443(`dot on Benefits`) · 25854:1340473(`dot on Point`) | [MAX-829] APP user action | 기존 | 후보 | MAXOP-758 App nav red dot. 8582:155585보다 새 판 |
| 앱 상단 | 상태 바 + 스낵바 + 툴바 | 8582:154770 `<TopNav>` · 8582:154772 `<Snackbar>` · 8582:154799 | [MAX-7] S3/S4 mobileAPP | 기존 | 후보 | |
| 떠 있는 상담 버튼 | 웹 · 모바일 | 8643:127877 (Web) · 3138:23463 · 8643:78976 (mWeb) — 라벨 `Contact Support Floating icon` | [MAX-7] | 기존 | 확실 | 우하단 Zendesk 버튼 |

### 셸에서 확인된 차이 (코드는 고치지 않음 — 연결 후 반영)

| 위치 | 지금 코어 | Figma |
|---|---|---|
| `NAV.rewards` 항목 | Events · Benefits · Global League · MaxBoard · TetherMax Point | 기존 드롭다운 = `Exchanges Events` · `Benefits` · `Points` |
| `NAV.discover` 항목 | Service Introduction · Beginner's Guide · Cashback Ranking · Notice | 기존 드롭다운 = `Beginner's Guide` · `About TetherMax` |
| `NAV.cashback` 3행 | Centralised Exchanges · Decentralised Exchanges · Cashback Hub | DEX 컴포넌트 설명 = CEX · DEX · Brokers (기존 = Exchanges · Brokers · Cashback Calculator) |
| 모바일 셸 | 모든 모바일 화면에 하단 탭 `moNav()` | 하단 탭은 **앱(mAPP)에만**. 모바일 웹은 상단 바 + 햄버거 드로어, 하단 탭 없음 |
| 모바일 상단 | 로고/뒤로 + 제목 | 비로그인 = 로고 + 햄버거, 로그인 = 로고 + 아이콘 3개(후보) |

## 2. 상태 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| cmn.header:normal | 로그인 GNB | PC 28967:127332 / mWeb 해당 없음(드로어) | DEX 28967:127332 | DEX | 확실 | `Navigation` `GNB` |
| cmn.header:guest | 비로그인 GNB | PC 19604:32577 | 기존 19604:32577 · DEX I28960:125521;27610:199365 | 기존 | 확실 | `GNB` `webPrelogin` |
| cmn.header:hover | Cashback 드롭다운 3행 | PC 19604:32651 | 기존 19604:32651 · 19604:32646 (DEX 항목은 컴포넌트 설명 27610:192948) | 기존 | 확실 | `GNB` `합체` `atom2` |
| cmn.header:bellFail | 알림·아바타 로드 실패(점 숨김) | PC 28967:127332 | 재사용: 28967:127332 벨(점 없는 기본 아이콘) | 재사용 컴포넌트 | 후보 | `Notifications` `bell` `error` |
| cmn.drawer:normal | 비로그인 드로어 | mWeb 12085:400249 | 기존 12085:400249 · 10981:110986 · 10061:179743 | 기존 | 확실 | `Hamburger` `Pre-login` `drawer` |
| cmn.drawer:member | 로그인 드로어 | mWeb 12216:424053 | 기존 12216:424053 · 10061:197517 · 10981:110987 | 기존 | 확실 | `Post-login` `Hamburger` |
| cmn.drawer:promo | 드로어 프로모 배너 | mWeb 12085:400249 | — | 없음 | — | `promo` `banner` `drawer` |
| cmn.footer:normal | 푸터 | PC 4639:42858 (최신 후보 28967:127334) / mWeb 4639:42761 | 기존 4639:42858 · 4639:42761 · DEX 28967:127334 `FooterA` · 29062:118042 | 기존 | 확실 | `Footer` `FooterA` |
| cmn.appnav:normal | 앱 하단 탭 Home | mAPP 8582:154521 | 기존 8582:155585 · 25854:1340444 | 기존 | 확실 | `BottomNavigation` `App nav` |
| cmn.appnav:events | Events 활성 | mAPP 8582:154521 | 기존 8582:155585 (활성 탭만 다름) | 기존 | 후보 | `BottomNavigationAction` |
| cmn.appnav:exchange | Exchanges 활성 | mAPP 8582:154521 | 기존 8582:155585 (활성 탭만 다름) | 기존 | 후보 | `BottomNavigationAction` |
| cmn.appnav:inapp | 미지원 페이지 → 인앱 브라우저 | — | — | 없음 | — | `in-app` `webview` `deeplink` `open app` |
| cmn.appnav:linkFail | DEX 링크 실패 · 복사 + Open | — | — | 없음 | — | `copy link` `deeplink` `Linking unavailable`(28969:127153는 연동 불가 화면이라 다름) |
| cmn.listing:normal | 거래소 목록 표 | PC 22598:410917 / mWeb 5145:52544 | 기존 22598:410917([MAXOP-692] Figma (Updated)) · 5145:52544(`All Exchanges (list view)`) · 검색 결과 5145:51653 | 기존 | 확실 | `All Exchanges` `MAXOP-692` |
| cmn.listing:cards | 카드 뷰 | PC 8643:107720 / mWeb 8471:65818 | 기존 8471:65818(`All Exchanges`) · PC 8643:107720(MAX-22 Web S1/S2) | 기존 | 모바일 확실 · PC 후보 | `All Exchanges` `card` |
| notice.list:normal | 공지 목록 | — | 재사용 후보: [MAX-1244] Newsletter 목록 23102:1009753 / 모바일 23102:1010436 | 재사용 컴포넌트 | 후보 | `notice` `Newsletter` `list` |
| terms.use:normal | 이용약관 | PC 12474:202799 / mWeb 11572:247028 | 기존 12474:202799 · 11572:247028 · 11572:246052 | 기존 | 확실 | `Terms of Use` |
| terms.privacy:normal | 개인정보처리방침 | PC 12474:202970 / mWeb 11572:247029 | 기존 12474:202970 · 11572:247029 · 11572:246053 | 기존 | 확실 | `Privacy Policy` |

## 3. 범위 지시로 추가할 화면 (아직 코드에 없음)

| 화면id:상태(예정) | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드 | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| cmn.notfound:guest | 404 · 비로그인 | PC 12216:419863 / mWeb 12085:401487 | 기존 (섹션 `404 error lightMode`, 라벨 S1 & S2) | 기존 | 확실 | `404` |
| cmn.notfound:member | 404 · 로그인 | PC 12216:421961 / mWeb 12216:421112 | 기존 (라벨 S3 & S4) · 앱 12216:422278 · 12216:420284 · 12216:436515 | 기존 | 확실(앱은 후보) | `404` `mobileAPP` |
| cmn.maint:normal | 점검 페이지 | PC 17000:883 / 모바일 17000:844 | 기존 MAXOP-299 개정판(변형 17000:47442 · 47591 · 3858 / 47366 · 47552 · 3819) · 이전판 2913:17118 / 2913:16910 | 기존 | 확실(변형 차이는 후보) | `maintenance` |
| cmn.appupdate:normal | 앱 필수 업데이트 | 앱 2913:17755 | 기존 | 기존 | 확실 | `updateRequiredMobileApp` |
| notice.urgent:normal | 긴급 공지 팝업 | PC 13086:341658 / mWeb 13086:341140 | 기존 · 「오늘 하루 보지 않기」 개정 MAXOP-767: PC 26019:10981 + 26019:11272(Backdrop) / mWeb 26019:11412 + 26019:11601 | 기존 | 확실 | `Urgent notice` `MAXOP-767` |
| cmn.lang:sheet | 언어 설정 바텀시트 | mWeb 12085:400397 | 기존 12085:400250 · 12085:400563 | 기존 | 확실 | `Language settings` |
| cmn.header:bell | 알림 패널 열림 | PC 8643:121393 / mWeb 8582:160728 | 기존 8643:124416 · 앱 8705:44264 | 기존 | 확실 | `Notifications` |

## 4. 어디에도 없음

| 화면id:상태 | 찾아본 키워드 |
|---|---|
| cmn.drawer:promo | promo · banner · drawer |
| cmn.appnav:inapp | in-app · webview · deeplink · open app |
| cmn.appnav:linkFail | copy link · deeplink · Linking |
| notice.list:normal (웹 공지 목록 자체) | notice · 공지 — 기존 앱은 Zendesk Help Center 링크. 재사용 후보로 Newsletter 목록만 있음 |

## 5. 확인 결과 (2026-11-26, Figma 연결 후)

| 항목 | 확인 · 결정 | 구현 근거 노드 |
|---|---|---|
| 웹 푸터 | 결정: 최신 `FooterA` | PC 28967:127334 · 모바일 Footer/mWeb 29062:118042 · 게스트 모바일 29072:1797(Company 3행 = Claim Cashback) |
| 모바일 웹 상단 바 | 비로그인 = 로고 + 햄버거(29058:108394) · 로그인 = 로고 + 계정 + 햄버거, 회색 원 IconButton(DEX 소유권 모바일 29102:120647) | 하위 화면 제목 행 = ← + h6(29102:120517) |
| 모바일 드로어 | 최신판은 [MAX-] Quiz › GNB 섹션: 비로그인 19604:33156 · 로그인 19604:32998 (Brokers · Cashback Calculator · Beginner’s Guide 포함). [MAX-497]·[MAX-426] 드로어는 이전판 | 19604:33156 · 19604:32998 |
| 계정 드로어(마이) | 19604:32844 (프로필 · Cashback Summary · Invite Friends · Ranking · My Coupons · Account Security · Log Out) | 마이 담당(my.main) 화면 — 공통에서 그리지 않음 |
| 웹 GNB 비로그인 | Login · Sign Up 은 large 버튼(px24 py8) | 19604:32578 |
| 벨 알림 | 별도 알림 패널 디자인 없음 — 빨간 점(8643:121393) · hover 회색 원(8643:124416)만 | cmn.header:unread |
| 앱 하단 탭 | 8582:155585 구현. [MAX-829] 25854:1340444(빨간 점 개정판)은 미대조 | |
| 긴급 공지 | MAXOP-767 Paper 26019:11273(웹) · Dialog 26019:11602(모바일) — 「Don't show again today」 텍스트 버튼 | notice.urgent |
| 404 · 점검 · 앱 업데이트 | 12216:419863/12085:401487 · 12216:421961/12216:421112 · 17000:883/17000:844 · 2913:17755 | cmn.notfound · cmn.maint · cmn.appupdate |
| 공지 목록 | 결정: 다른 페이지 재사용 허용 → [MAX-1244] Newsletter / List 23102:1009753 · 23102:1010436 | notice.list (세부 레이아웃 미대조) |
