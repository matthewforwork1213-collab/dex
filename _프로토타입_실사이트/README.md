# TetherMax 실사이트 프로토타입

| 항목 | 내용 |
|---|---|
| 목적 | tethermax.io 기존 화면 전체를 클릭되는 프로토타입으로 만들고, DEX 신규 화면(`dex/app.html`)을 실제 사이트처럼 작동하게 연결한다 |
| 원본 | tethermax.io 실사이트 영문(`/en`) 2026-11-26 수집. 게스트 37페이지 + 회원 전용 5페이지 = 42페이지, 스냅숏 298개 |
| 여는 법 | `index.html`(항상 최신) 또는 `TetherMax_실사이트프로토타입_YYYYMMDD_HHMM.html`. **폴더째로** 열어야 한다(`pages/` · `css/` · `frags/`를 같이 씀) |
| 인터넷 | 필요. 이미지·폰트는 tethermax.io에서 불러온다 |

## 상단 바

| 컨트롤 | 동작 |
|---|---|
| 페이지 | 공개 페이지 / 로그인 필요 페이지로 묶은 전체 목록 |
| 화면 상태 | `기본` · `[클릭] …`(버튼을 눌러 바뀐 화면: GNB 드롭다운, 프로필 패널, 탭·필터) · `[열림] …`(모달·메뉴·알림·언어 선택) |
| 게스트 / 회원 | 로그인 전·후 화면. 회원 전용 페이지를 게스트로 열면 실사이트처럼 로그인 페이지로 간다 |
| 자동 / PC / 모바일 | 자동 = 창 폭 **1024px 이하면 모바일 스냅숏**(사이트 실제 분기점). PC·모바일은 고정 보기 |

## 클릭 규칙 (실제 로직 없음)

| 대상 | 처리 |
|---|---|
| 링크 | 수집한 페이지로 이동. 외부 링크는 새 탭. 수집 안 된 페이지는 안내 토스트 |
| 수집한 버튼 | 수집 때 본 결과대로 이동 · 화면 전환 · 오버레이 열기. 이 뷰포트에서 결과가 없으면 같은 요소의 다른 뷰포트 결과 → 전 페이지에서 같은 라벨의 이동 대상(`pt-acts.js`) |
| 수집 HTML 안의 숨은 마크업 | 접힌 FAQ 답변 펼침 · 목차/앵커 탭 → 그 구역으로 스크롤 · 단계/캐러셀 전환 · 거래소 상세 계산 — 「클릭 전수 점검」 절 |
| 로그인 페이지 `Continue` | 입력 없이 눌러도 **회원 상태로 홈 이동** |
| 가입 페이지 가입·다음 버튼 | 회원 상태로 홈 이동 |
| `Log out` | 게스트 상태로 홈 이동 |
| 비활성 버튼 | 모양은 그대로, 눌리면 정상 처리 |
| 그 밖의 버튼 | 「버튼명 처리됨」 토스트(정상 처리로 간주) — 남은 대상은 `05.리포트/실동작프로토타입_클릭점검.md` 「근거 없음」 표 |
| 오버레이 | 배경·닫기·Esc로 닫힘. 안의 버튼은 닫고 정상 처리 |

## 개인정보

- 회원 화면은 수집한 계정 데이터 위에 **더미 값으로 치환**했다: 이메일 → `user****@example.com`, 회원 ID → `10000001`, 연동 UID 22개 → 같은 자릿수 임의 숫자, 초대 코드 → `SAMPLE`.
- 잔액·거래소 목록·이벤트는 수집 시점 실제 값 그대로다(식별 정보 아님).
- 원본 수집 데이터·치환표·로그인 세션은 프로젝트 폴더에 두지 않는다.

## 아직 없는 것

| 항목 | 이유 · 다음 할 일 |
|---|---|
| 데이터 **있음/없음** 전환 | 지금 회원 화면은 데이터가 있는 계정 1개로 수집했다. 빈 상태 화면은 지어내지 않고, **데이터 없는 계정으로 한 번 더 수집**하면 `회원(빈 계정)` 보기로 추가한다 |
| UID 연동 · 출금 · 소유권 인증 흐름의 다음 단계 | 실제 처리를 일으킬 수 있어 수집 때 확인·제출 버튼을 누르지 않았다. 첫 모달까지만 있다 |
| 회원 모바일 일부 상태 | 캐시백 요약(`/en/rewardHistory`) 모바일 필터·달력은 수집 오류로 기본 화면만 있다 |
| 언어 | 영문만. 언어 메뉴의 다른 언어는 수집하지 않았다 |

## 다시 만들기

| 단계 | 명령 |
|---|---|
| 1. 게스트 수집 | `python -I tools/crawl2.py guest <out> <sitemap_en.txt> 300` |
| 2. 회원 수집 | `python -I tools/crawl2.py member <out> <seeds> 400 --headed` → 뜬 창에서 로그인 → `<out>/GO` 파일 생성 |
| 2-1. 회원 메뉴 탐색 | `python -I tools/discover.py <세션.json> <found.json>` — 헤더·프로필·햄버거 메뉴 항목의 이동 주소(회원 메뉴 항목은 링크가 아니라 버튼이라 링크 추적으로는 안 잡힘). 찾은 주소를 시드로 2를 `--no-home --skip-index=<기존 index.json>`로 다시 돌린다 |
| 2-2. 메뉴 속 패널 | `python -I tools/capture_label.py <세션.json> <out>` — 프로필 메뉴의 `Account Security` · `Notification Settings` 패널 |
| 3. 빌드 | `python -I tools/build.py <게스트수집> <회원수집1+회원수집2…> <치환표.json>` |

- 회원 수집은 로그아웃·출금·삭제·연동 해제·확인·제출·Claim 같은 라벨을 누르지 않고, 열린 오버레이 안의 버튼도 누르지 않는다.
- 회원 상태에서는 사이트가 계속 통신해서 네트워크 정지 대기가 끝나지 않는다. 수집기는 시간 상한으로 기다린다.

## DEX 연결

결정: 실사이트 수집본 + DEX를 합치고, **캐시백 허브가 거래소 목록(`/en/affiliated`) 자리**에 들어간다.

### 구성

| 파일 | 내용 |
|---|---|
| `dex/app.html` | 사이트 모드 DEX 앱(빌드 결과). 경로 `#/hub`(`?tab=CEX\|Brokers` · `&view=cards`) · `#/dex` · `#/dex/{lighter\|apex\|edgex\|aster}`. 쿼리 `auth=guest\|member`, `modal=1`(셸이 여는 연동 모달 전용 · 배경 투명) |
| `dex/build-site.cjs` | `node dex/build-site.cjs` — `../_프로토타입_전체/src`의 코어·화면 모듈을 그대로 묶고 최소 패치(허브 입력값 반영·검색 입력·정렬 표식, 연동 성공 화면 주소, 레이어 높이 등 73건)를 적용. 원본이 바뀌어 패치를 못 찾으면 빌드가 멈춘다. 에셋은 `dex/assets/`로 복사 |
| `dex/src/site-ui.js` | 공통 인터랙션 컴포넌트(드롭다운 · 슬라이더 · 펼침 · 툴팁 · 버튼 물결 · GNB 전환). 값은 `05.리포트/실사이트_인터랙션_기준.md` |
| `dex/src/site.js` · `site.css` · `template.html` | 사이트 런타임(경로 · 허브 동작 · 연동 흐름 · 토스트 · 카운트업) |
| `dex/dex-state.js` | 사용자 데이터 공유 저장소(localStorage `tm-dex-site-v1`). DEX 앱과 스냅숏 런타임이 같이 읽는다. 표본 계정 = 전체 프로토타입 홈 기본값(Lighter 120 · ApeX 14) |

화면 모양·문구는 `_프로토타입_전체` 렌더 함수 그대로이고, 사이트 모드는 동작만 붙인다. 개발 주석(`C.note`)은 숨긴다.

### 셸(`index.html`)에서 고친 곳

| 위치 | 변경 |
|---|---|
| 페이지 목록 | `en__affiliated`를 DEX 앱 `#/hub`로, `/en/dex` · `/en/dex/{slug}` 5개 추가(목록 그룹 「DEX 신규 (DEX 앱)」). 해시에 `dr`(DEX 앱 경로) 추가 |
| `render()` → `renderDex()` | DEX 페이지면 iframe에 `dex/app.html?auth=…#경로`. 경로만 바뀌면 다시 불러오지 않고 앱에 `dexGo` 메시지 |
| 연동 모달 레이어 | `#wrap` 위 `#dexm` iframe(투명). 스냅숏 페이지의 연동 버튼이 `dexLink`를 보내면 `dex/app.html?modal=1`을 띄운다 — 어디서 열어도 같은 모달 |
| 메시지 | `dexRoute`(앱 안 이동 → 주소·목록 동기화) · `dexLink` · `dexModal:'close'` · `dexChanged`(홈 행 즉시 반영) · `dexHome`(Back to Home) |

### 런타임(`pt-runtime.js`)에서 고친 곳

| 대상 | 변경 |
|---|---|
| `Link UID` 버튼 · UID 연동 팝업 오버레이 · 홈 `Link more …` 줄 | 수집 팝업 대신 DEX 앱 연동 모달(거래소 상세 페이지면 그 CEX가 미리 선택됨) |
| GNB `Cashback ▾` | 결정 D4: `Cashback Hub`(→ 허브) · `Cashback Calculator`(→ `/en/payback`). 실사이트 `Exchanges`를 `Cashback Hub`로 바꾸고 `Brokers` 항목을 뺀다. 회원 GNB `Cashback` 클릭 → 허브. 모바일 ☰ → DEX 앱 드로어(같은 D4 구성) |
| 회원 홈 `See All` · 행 클릭 | `See All` → 연동 계정 목록 모달(결정 Q3, 수집본 모달 대신). 행 → 지갑/UID 상세(여러 UID 묶음 행은 목록 모달). DEX 행이 있으면 왼쪽 아래 「테스트 · 연동 계정 행 상태」(행마다 상태 선택 · 심사 중이면 승인/거절) |
| 회원 홈 | `Linked UID` → `Linked Accounts`, 푸터 `Using multiple platforms? Link more accounts`(Figma HW1), 연동한 계정 행을 금액순 위치에 추가(행 상태 표시는 「클릭 전수 점검」 절의 행 상태 표 — 결정 10차), 총액에 합산. 방금 연동한 행은 스크롤 + 강조 + `Account linked successfully` 토스트 |

수집 도구(`tools/`)·스냅숏(`pages/`)은 고치지 않았다.

### 동작하는 흐름

| 흐름 | 동작 |
|---|---|
| 캐시백 허브 | 라우트 탭(CEX/DEX/Brokers, 알약 이동) · 파트너 셀렉트 · 거래량 입력/슬라이더(클릭·드래그·키보드) → 계산기·비교표 금액 즉시(정책 계산식, 2자리 절삭) · 첫 표시 카운트업 · 비교표 검색(0건 문구)·열 정렬·리스트/카드(탭 전환 시 표 즉시) · 회원이면 연동 계정 기준 잔액 패널(로딩 스켈레톤 300~800ms, 10 USDT 미만 넛지). Brokers는 lot 기준 계산식이 없어 표본 고정 |
| 거래 계정 연동 | 거래소 선택(검색·CEX/DEX 칩) → DEX 지갑 주소(즉시 검증 REQ-065·067) / CEX UID → Next → 퍼즐 캡차(실제로 끌어 맞춰야 통과, 실패 시 흔들림·되돌림, 3회 실패 시 새 퍼즐) → 처리 중(최소 1초) → 결과 → 홈 새 행. 닫기 X·바깥·Esc, 입력 유지(거래소별 초안), Next 중복 클릭 방지, 모바일은 바텀시트 + 전체 화면 폼 |
| 공통 | 버튼 hover · 누름 물결, 팝업·시트·드로어 전환, 토스트(실사이트 스낵바 위치), 드롭다운, 툴팁, 복사 → 클립보드 + `Copied.`. 전환 값은 「인터랙션 재구축」 절 |

### 테스트 주소 규칙 (모달 왼쪽 아래 「테스트 주소」 도움말에서 바로 넣기)

| 지갑 주소 끝 4자리 | UID 끝자리 | 결과 |
|---|---|---|
| `0001` | `1` | 레퍼럴 아님 (L8) |
| `0002` | `2` | 타인 사용 중 (L9) |
| `0003` | `3` | 한도 초과 (L15) |
| `0004` | `4` | 확인 중 (L11) → 홈 행 처리 중 점 + 배너 `Trying to link` |
| `0005` | `5` | 최근 소유권 인증 (L12) |
| `0006` | — | 거래소가 주소 거절 → 입력 유지 + 인라인 오류 |
| `0007` | `7` | 기타 실패 (L13) |
| `0008` | `8` | 본인 이미 추가 (L14) — 이미 연동한 주소를 다시 넣어도 같음 |
| `0009` | — | 지원하지 않는 형식 → 입력 유지 + 인라인 오류 |
| 그 밖 | 그 밖 | 연동 성공 |

즉시 입력 오류: 빈 값 · 주소 안 공백 · 제로 주소 · `name.eth` 같은 이름. 도움말의 「연동 데이터 초기화」로 표본 상태로 되돌린다.

### 2회차 (2026-11-27)

| 경로 | 셸 키 | 내용 |
|---|---|---|
| `#/summary` | `/en/rewardHistory` | 캐시백 요약 — 수집본 대신 DEX 앱(전체 프로토타입 FU-060~062 화면). 회원 전용 |
| `#/account` | `/en/account` | 지갑·UID 상세 — 기존 디자인 + Earning Timeline 3단계(결정 N16·N17·N19 · A6) |
| `#/ownership` | `/en/ownership-verification` | 소유권 인증 화면 |

모달 모드 쿼리 `mode=drawer|seeAll|own`(셸 `openDexModal`이 메시지의 키를 그대로 쿼리로 넘김). 앱 소스에 `dex/src/site2.js` 추가.

| 흐름 | 동작 |
|---|---|
| GNB(D4) · 드로어(N1) | 실사이트 드롭다운 · DEX 앱 GNB · 모바일 드로어 모두 `Cashback Hub` · `Cashback Calculator`, 단독 `Calculator` 없음. 드로어 `Cashback Hub` → 캐시백 허브, `Brokers` 행 없음 |
| DEX 랜딩 | 리스트/카드 전환, 카드 → 상세, glance·요율 카운트업, 프로모 배너 캐러셀(5초 자동 · 화살표 · 점, 마우스 올리면 멈춤). 슬라이드 = Figma Aster 배너 + 실사이트 거래소 목록 상단 Bitget 배너(같은 어드민 배너 — 결정 D7·Q7) |
| DEX 상세 | 탭 바 고정(헤더 아래) + 스크롤 위치 연동 + 밑줄 색 전환, 탭 클릭 → 그 구역으로, Taker/Maker 토글 → 오퍼 박스 단계 표(할인 있을 때만 `After discount` 행)·계산기 값, 계산기 슬라이더(눈금 Min 100K~10M), 단계 가이드 단계 클릭 → 패널·미디어(교차 페이드), `How this works` 모달(현재 거래량·Taker/Maker 반영), FAQ 여러 구역 동시 펼침, 리뷰 정렬 · `Read more`, `Get Started`·`Join Now` 새 탭 |
| 상세 회원 상태 | 게스트 `Sign Up` · 미연동 `Link Wallet` → 그 DEX가 선택된 연동 모달 · 연동 완료 `Auto Claim`(비활성) + `My review` · 확인 중 지갑만 → 비활성 `Trying to link`(결정 Q6 B) |
| 홈 `See All` | 수집본 CEX 계정 + 연동한 DEX 계정, 거래소별 묶음 · 계정 수 · 합계 · 상태 점, All/CEX/DEX 칩 실제 필터, 행 → 상세, `Close` |
| 캐시백 요약 | 월 이동(이전/다음 · 월 목록), 날짜 선택, 거래소(범위·거래소)·계정(복수)·유형(복수) 필터 → `Search` 적용 · `Reset`. 달력 칸 = 그날 순액, 월간 카드 = 받은 금액·출금·순액 계산 |
| 소유권 인증 | 연동 결과 「타인 사용 중」 `Verify Ownership` → 가이드 3단계(이미지 클릭) → 파일 선택(MP4·MOV, 1GB 초과·다른 형식 = `Upload Failed`) → 업로드 진행률 → 파일 행(× = 제거) → `Submit this claim?` → 홈 행 처리 중 점 + 배너 `Verifying ownership` → 도움말에서 승인(연동 완료) / 거절(빨간 점 + 배너 `Ownership verification was unsuccessful. View reason.`) |

**표본 데이터**
- 요약 원장은 전체 프로토타입 요약 상태의 표본값(CS1~CS4 · 2025-10)이다. 기준일도 표본의 오늘(2026-05-26)이라 5월이 이번 달로 보인다. DEX 행은 회원이 연동한 같은 거래소 지갑에 붙고, 연동 안 한 DEX 행은 나오지 않는다.
- FAQ 질문·답변은 운영자가 어드민에서 입력한다. 첫 구역과 `Withdrawals & Account Management` 구역은 Figma 운영자 입력 예시 문구, 나머지 구역과 약관 서랍 본문(G-369)은 원문이 없어 펼치면 미정 표시만 나온다.
- `Get Started`의 레퍼럴 링크는 어드민 입력값이라 없다. 각 DEX 공식 사이트를 새 탭으로 연다.

### 3회차 (2026-11-27) — Figma DEX(revision) 3차 결과 · 결정 8차 · 9차

| 위치 | 반영 내용 | 근거 |
|---|---|---|
| DEX 앱(전체 프로토타입 src 공유) | 가이드 Step 2 본문 `Check the receiving network before sending. Sending funds on the wrong network can cause permanent loss.` | 8차 · 28981:129056 |
| | FAQ 6번째 구역 `Withdrawals & Account Management` — 질문 `How do I receive my cashback?` · 답변(운영자 입력 예시), 미정 표시 없음 | 8차 · 29367:138679 |
| | 허브 DEX 패널 H5 형태: `Total event reward` · `Claimable {n} USDT` · `Total claimed` · 각주 `Cashback is sent automatically to your linked {DEX} wallet.` | 문구표 #31 · #32 · H5 29352:145077 |
| | 지갑 상세 하단 `Top Partner Exchanges`(홈과 같은 기존 블록) | 결정 「지갑 상세 하단」 |
| | 제외: 허브 데이터 지연(H6) · 가이드 미디어 실패 상태. 가이드 미디어는 이미지 자리만 | 8차 |
| | DEX 개요 `PAYOUT` 카드 라벨 · 비교표 `Where payouts go`(실서비스·명세 유지) · 리뷰 요약 표본 `… every day.` | 9차 #2 · #4 |
| 실사이트 랜딩 `/en`(런타임 `dexCopy` · `dexPartners`) | 3단계 `Link your exchange account` / `Link your exchange UID or wallet address to TetherMax` · `Get cashback in USDT automatically` / `Each linked account is paid automatically once its claimable balance reaches 10 USDT.` | 문구표 #44 · Figma 랜딩 28960:128375 |
| | 모바일 `Top Exchanges` → `Our Partners` + 칩 `All` · `Exchanges` · `DEXs`(실제 필터), 목록 끝 두 행 `ApeX 30%` · `Lighter 20%` → 누르면 DEX 상세 | Figma 29386:140183 |
| 실사이트 서비스 소개(런타임 `dexCopy`) | 피드 제목·부제 `Someone is cashing out right now` / `Claim every cent you've earned` · 캐시백 슬라이드 부제 #75 · 파트너십 문장 #76 · `Account linked` / `… link their account.` | 문구표 #41 · #75 · #76 · 9차 #1 |

스냅숏 페이지(`pages/`)는 고치지 않고 런타임에서 문구만 바꾼다(`pt-runtime.js` 상단 `COPY` 표 — 랜딩·서비스 소개만).

**검증** — Playwright 실조작(2회차 시나리오 전체 + 3회차 항목), 페이지 오류 0. 콘솔 오류 1건은 실사이트 스냅숏의 외부 SVG(`tethermax.io/...#kolFunnelClipPath`) CORS 차단 — 런타임 오류 아님. 스크린샷 `05.리포트/실동작프로토타입_img/3_*.png`.

| 아직 없는 것 | 이유 |
|---|---|
| 실사이트 혜택·랭킹 화면의 Figma 3차 문구(`Link a CEX UID to Get Cashback` · 랭킹 캡션 2줄) | 수집본에 해당 문구·자리가 없음(실사이트 화면). 전체 프로토타입에는 반영 |

### 아직 없는 것 (다음 회차 후보)

| 항목 | 이유 |
|---|---|
| 리뷰 작성 폼 · 리뷰 페이지 이동 | 작성 화면 디자인 없음. `Write a Review`는 토스트 |
| 재청구(이전 보유자 O14~O16) | 이전 보유자 계정 표본이 없음 |
| Brokers 탭 계산식 | 미정 — 표본 값 그대로(화면 표시 없음) |

### 인터랙션 재구축 (2026-11-27)

화면 모양은 Figma 마크업 그대로 두고, **동작·전환을 라이브 tethermax.io 실측값으로 컴포넌트 단위 공통 구현**(`dex/src/site-ui.js`)으로 바꿨다. 같은 종류의 요소는 모두 같은 함수로 움직인다. 기준표 `05.리포트/실사이트_인터랙션_기준.md`, 점검 결과 `05.리포트/실동작프로토타입_인터랙션점검.md`, 스크린샷 `05.리포트/실동작프로토타입_img/5_*.png`(실사이트 기준 캡처 `5_live_*`).

| 컴포넌트 | 쓰는 곳 | 동작(실사이트 기준) |
|---|---|---|
| `UI.dropdown` | 허브 파트너 셀렉트 · 요약 거래소/계정/유형 필터 · 요약 월 선택 | 클릭으로 열고 유지(마우스가 나가도 닫히지 않음), 열림 200ms · 닫힘 190ms(높이+불투명도), 트리거 아래 4px, 항목 hover .15s, 선택 → 값 반영·닫힘(여러 개 체크는 열린 채), 바깥 누름 · Esc(트리거로 포커스) · Tab 닫힘, ↑↓ Home End Enter 키보드 |
| `UI.slider` | 허브 거래량 · DEX 상세 거래량 · 계산기 레버리지/잔고/주문 비율 | 손잡이 중심 = 트랙 중심, 레일 클릭 → 150ms 이동 후 그대로 끌기, 끄는 동안 전환 없음, 링 hover·포커스 8px / 누름 14px, ←→ · PageUp/Down · Home/End, 값 표시 즉시 |
| `UI.collapse` · `UI.heightFx` | DEX 상세 FAQ · 오퍼 박스 단계 표(2행↔3행) · 리뷰 `Read more` · 계산기 `How we calculated this?` | 높이 300ms ease-in-out |
| `UI.toggleFx` | Taker/Maker 토글 | 선택 칸 .2s, 금액 즉시 |
| 툴팁(`[data-tip]`) | 계산기 정보 아이콘 | MUI Tooltip 모양, 불투명도 .2s, 문구는 실서비스 |
| 버튼 물결 | `.btn` · `.icon-btn` | 누른 위치에서 550ms, 크기 변화(scale) 없음, 배경 .3s |
| 팝업 · 드로어 | 연동 모달 · How this works · See All · 소유권 대화상자 · 모바일 드로어 | 팝업 불투명도 + 30px 이동 220ms(닫힘은 위로), 드로어 오른쪽에서 280ms |
| 밑줄 탭 · 칩 | DEX 상세 탭 · 리뷰 정렬 · 칩 | 밑줄은 미끄러지지 않고 color · border-color .2s, 칩 background .3s |
| GNB 드롭다운 | DEX 앱 GNB | 클릭 펼침·유지(위 「GNB 드롭다운」 블록 그대로) + 열림 200ms · 닫힘 190ms 전환 |
| 토스트 | 전 화면 | 실사이트 스낵바: PC 아래 24px 가운데 · 모바일 아래 16px |

**캐시백 계산기** — 셸 `/en/payback`을 DEX 앱 `#/payback`으로 보낸다(DEXR 한 줄). 실서비스 6단계(소개 → 거래소 선택 → 거래 프로필 → 로딩 1.9초 → What You're Missing Out On(`#/payback?step=result`) → Summary) · 문구 · 기본값(10x · 1,000 USDT · Taker 100%) · 계산식(잔고 × 레버리지 × 월 거래 횟수 × Taker/Maker 수수료 × 캐시백률)을 라이브에서 역산해 그대로 구현했다. DEX 4곳 타일 · DEX 결과 `Did you know?` 숨김 · DEX 각주 · 전 플랫폼 `Daily`는 정책 B-19. `Start {exchange} Cashback`은 DEX 공식 사이트 새 탭(레퍼럴 링크는 어드민 입력값), CEX는 토스트.

**검증** — 자동 테스트(Playwright, PC 1440 · 모바일 390 × 게스트 · 회원 + See All · 소유권 · 셸 경로) 248개 항목 전부 통과, 페이지 오류 0. 전환 시간은 매 프레임 샘플링으로 기준표 값과 비교.

**Figma 5차 · 결정 10차 반영 (2026-11-27)** — 홈 행(`pt-runtime.js`) · See All · 전체 프로토타입 홈 상태를 Figma 29447:141189 기준으로: 칩 전부 없음, 상태 점(초록 정상 · 빨강 이슈/실패 · 주황 연동 해제 · 분홍 확인 중 + 시계 · 파랑 소유 확인 중 + 시계 + `Ownership verification in progress · 경과 시간`), 행 아래 배너(분홍 Error · 주황 Warning). 수동 연동 실패 모달 CEX/DEX(29447:143890 · 144198) · 이슈 모달 CEX/DEX(144506 · 144810), 공통 오류 토스트 `Something went wrong. Please try again.`(29449:145568 — 연동 `Next`·소유권 제출 중복 요청), 모바일 See All 꽉 찬 모달(29449:145601), 캐시백 요약·지갑 상세 반영 지연 표시 없음, Cashback Basics `Claim cashback and rewards`. 가입 `Continue` · 로그인 `Log in` 제출 뒤 이메일 인증 모달(`Email Verification` · 입력한 이메일 · 6칸 코드 · `Paste` · `Verify` · `Resend code in 01:00`, 어떤 6자리든 통과). 스크린샷 `7_*.png`.

## 클릭 전수 점검 (2026-11-27)

수집 스냅숏 페이지(`pages/*` · `pt-runtime.js` · 셸 `index.html`)의 보이는 클릭 요소를 전부 눌러 결과를 분류하고, 빈 동작을 실제 사이트처럼 고쳤다. 결과·전후 수치·「근거 없음」 목록은 `05.리포트/실동작프로토타입_클릭점검.md`, 스크린샷 `05.리포트/실동작프로토타입_img/4_*.png`. DEX 앱 화면(`dex/*`)은 이 점검 범위가 아니다.

| 파일 | 변경 |
|---|---|
| `pt-acts.js`(새 파일) | 수집 동작 보완표 — 같은 페이지 다른 뷰포트(PC↔모바일)의 같은 요소 결과 253건 · 전 페이지에서 대상이 하나로 같은 라벨(게스트 17 · 회원 10). 모바일 수집 때 `body` 고정으로 클릭이 실패한 요소를 PC 수집 결과로 채운다. 수집본에서 다시 만든다(점검 스크립트 `genacts.py`) |
| `pt-runtime.js` | 아래 표의 동작 · 모바일 스크롤 잠금 해제 · GNB 드롭다운 hover/클릭 · `Rewards Hub ▾` 3개 항목 |
| `index.html` | 경로 `en__benefits` → DEX 앱 `#/benefits`(GNB `Benefits`, 결정 「GNB Rewards Hub ▾ 항목」) |

| 동작 | 근거 |
|---|---|
| 모바일 화면 스크롤 — 수집본 `body{position:fixed}`를 런타임에서 풀고, 수집 조각(모달·메뉴)이 열렸을 때만 잠금 | 실사이트 MUI Modal과 같은 방식(열린 동안만 잠금) |
| GNB `Cashback ▾` · `Rewards Hub ▾` · `Discover ▾` — 마우스를 올리면 펼침(.2s), 벗어나면 .2s 뒤 접힘. **클릭하면 펼친 채 유지**(다시 클릭 · 바깥 클릭 · Esc로 닫힘) | 라이브 측정(높이·투명도 약 .2s). 클릭 고정은 사용자 요청 |
| `Rewards Hub ▾` = `Exchange Events` · `Benefits` · `Points` | 결정 기록 「GNB Rewards Hub ▾ 항목」 |
| 홈 FAQ · TP FAQ · 거래소 상세 `Terms & Conditions` 펼침/접힘(FAQ는 하나만 펼침, .3s) | 수집 HTML의 접힌 답변(`height:0`) · 라이브 측정 |
| 가이드 목차 · 브로커 앵커 탭 · 브로커 학습 사이드바 → 그 구역으로 부드러운 스크롤 + 표식 이동. 인피녹스 `Select Account` → Account Type 구역 | 라이브 측정 |
| 랜딩 3단계(PC) 클릭 선택 + 3초 자동 넘김, 모바일 3단계 슬라이더 ‹ · 점 · › + 아래 문구 | 라이브 측정 · 수집 HTML의 단계 이미지·문구 |
| Swiper 캐러셀 점 · 화살표 | 수집 HTML의 전체 슬라이드 |
| 거래소 카드·행(랜딩 Top Exchanges · 회원 홈 Top Partner · 서비스 소개 Cashback Boost · 검색 목록) → 그 거래소 상세 | 라이브 측정(랜딩 행 → `/en/exchangeDetail/{slug}-referral`) |
| 거래소 상세 `Taker`/`Maker` → 할인율·Total Savings·`Pay only …` 문구·계산기 동기, 거래량 슬라이더 → 거래량·수수료·절감액 | 라이브 측정 식: 거래량 = 100K × 100^(값/1000), 수수료 = 거래량 × 표의 요율. 표 요율이 소수 넷째 자리로 반올림돼 있어 큰 거래량에서 라이브와 1달러 차이가 날 수 있다 |
| 거래소 상세 `Sign Up` 팝업 — 지금 거래소 이름, `Sign up with … sign-up link` → 그 거래소 가입 링크 새 탭 | 라이브 측정(16개 거래소 링크). 수집기는 팝업을 한 번만 저장해 모든 상세에 `Binance`가 보였다 |
| `Getting Started Guide` → `/en/kycCertification/detail?…`(수집 안 된 페이지 안내) · 브로커 `What is FX?` 카드 → `/en/brokers/learn` | 라이브 측정 |
| 모바일 앱 배너 × → 배너 닫힘 · `Get App` → Play 스토어 새 탭 · 모바일 `Sign Up` · `Sign Up Now` → 가입 | 라이브 측정 · PC 헤더 `Sign up` |
| `support@tethermax.io`(모바일) → 복사 + `Copied.` | PC 수집 결과(`Copied.`) |
| 언어 메뉴 — `English`는 닫기만, 다른 언어는 실사이트 주소(`/tc/…` · `/jp/…` 등)로 이동 → 영문만 수집해 「수집되지 않은 페이지」 안내 | 라이브 측정 · 페이지 `hreflang` 주소 |
| 이벤트 페이지 배너 → 같은 거래소 첫 이벤트 카드의 `Join Now` 링크 새 탭 | 라이브 측정(같은 URL) |
| 카드 전체 클릭 = 카드 안 하나뿐인 버튼의 수집 결과 · 이미 선택된 탭은 그대로 | 같은 카드의 버튼 수집 결과 |

**검증** — 144개 페이지×상태 클릭 5,188개 재점검: 범용 토스트 2,142 → 558(남은 것은 근거 없음 표), 가려짐 554 → 34, 페이지 오류 0.

점검 스크립트(scratchpad): `clickaudit.py`(셸을 열고 iframe 안 요소를 하나씩 클릭 — 셸 이동은 기록만 하고 막음, DOM이 바뀌면 다시 불러옴) · `agg.py`(분류 집계) · `genacts.py`(보완표 생성).

### 입력 폼 (가입 · 로그인 · 비밀번호 재설정 · 랜딩 이메일)

라이브 tethermax.io에서 같은 칸에 틀린 값을 넣어 채집한 동작·문구 그대로다(제출은 라이브에서 누르지 않음).

| 동작 | 내용 |
|---|---|
| 포커스 · 입력 · 벗어남 | 칸 `focused · floated`(라벨이 테두리 위로 .15s), 벗어나면 값이 있으면 `floated`, 검증 실패면 `error`(빨간 테두리) + 아래 오류 문구. 고쳐서 맞으면 바로 오류가 사라짐 |
| 이메일 | 가입·로그인 `Enter a valid email address` · 재설정 빈 값 `No email has been entered.` / 형식 오류 `Enter a valid email address.` |
| 비밀번호 | 가입: 입력하면 규칙 2줄(`8-16 characters.` · `At least one number and special character (*!@#).`)이 나오고 맞으면 초록 체크. 로그인: 벗어날 때 `8-16 characters.` |
| 비밀번호 눈 아이콘 | 보기/숨기기 전환(아이콘도 바뀜) |
| 약관 동의 체크 | 처음 체크된 상태, 눌러서 해제/체크 |
| 초대 코드(선택) | 1~3자면 `Enter at least 4 characters` |
| 제출 버튼 | 조건을 다 채워야 활성(가입 = 이메일 · 비밀번호 규칙 · 약관 · 초대 코드 4자 이상 또는 빈 값 / 로그인 = 이메일 · 8~16자 / 재설정 = 이메일). 라이브 가입은 Cloudflare 확인(Turnstile)이 더 있다 — 프로토타입은 생략 |
| 제출 후 | 로그인 → 회원 홈. 가입 → 회원 홈(라이브의 인증 코드 단계는 수집 안 됨 — 클릭점검 문서 「근거 없음」). 재설정 → 처리 토스트 |
| 랜딩·검색 `Sign Up Now` 이메일 | 가입 화면으로 이동하며 이메일 칸에 채워 바로 검증(라이브 `/en/signup?email=…`과 같음) |

### 회원 홈 연동 계정 행 상태 (결정 기록 10차)

칩을 쓰지 않고 실사이트 수집본의 기존 디자인(홈 행 점 `LinkedUidDot*` · 연동 계정 목록 팝업의 `StatusAlert*` 배너 · `CenterPopup` 모달 클래스)을 그대로 쓴다. DEX 행은 `UID` 자리를 `Wallet`/`wallet`로.

| 상태 | 점 | 행 아래 배너 | 누르면 |
|---|---|---|---|
| 정상 · 캐시백 0 | 초록 | 없음(0이면 `0.00 USDT`) | 지갑/UID 상세 |
| 확인 중 · 소유권 심사 중 | 처리 중(파랑) | 정보 `Trying to link` · `Verifying ownership` | 지갑/UID 상세 |
| 연동 실패 | 빨강 | 분홍 `UID Linking was unsuccessful. View reason.` / `Wallet linking was unsuccessful. View reason.` | 모달 `UID Linking Unsuccessful`(`Wallet Linking Unsuccessful`) · `Remove UID`/`Remove Wallet`(행 삭제) · `UID Link`/`Link Wallet`(연동 모달) |
| 소유권 인증 실패 | 빨강 | 분홍 `Ownership verification was unsuccessful. View reason.` | 소유권 심사 결과(거절) 모달 |
| 연동 해제(되찾기) | 빨강 | 주황 `This UID has been unlinked. Tap to verify ownership and reclaim it.` / `This wallet has been unlinked. …` | 소유권 인증 화면 |
| 이슈(오프보딩 포함) | 빨강 | 없음 | 행 → 모달 `There is a problem with this UID.`(`… this wallet.`) · `Contact Support` |

`Data delayed` · `Inactive` 칩은 없다. 실패 사유 문구는 계정에 사유가 있을 때만 모달에 나온다(표본 계정에는 없음).

