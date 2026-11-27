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
| 수집한 버튼 | 수집 때 본 결과대로 이동 · 화면 전환 · 오버레이 열기 |
| 로그인 페이지 `Continue` | 입력 없이 눌러도 **회원 상태로 홈 이동** |
| 가입 페이지 가입·다음 버튼 | 회원 상태로 홈 이동 |
| `Log out` | 게스트 상태로 홈 이동 |
| 비활성 버튼 | 모양은 그대로, 눌리면 정상 처리 |
| 그 밖의 버튼 | 「버튼명 처리됨」 토스트(정상 처리로 간주) |
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
| 회원 홈 `See All` · 행 클릭 | `See All` → 연동 계정 목록 모달(결정 Q3, 수집본 모달 대신). 행 → 지갑/UID 상세(여러 UID 묶음 행은 목록 모달). 심사 중 행이 있으면 왼쪽 아래 「테스트 · 소유권 심사 결과」(승인/거절) |
| 회원 홈 | `Linked UID` → `Linked Accounts`, 푸터 `Using multiple platforms? Link more accounts`(Figma HW1), 연동한 계정 행을 금액순 위치에 추가(DEX 칩 `No cashback yet` · 확인 중 `Trying to link`), 총액에 합산. 방금 연동한 행은 스크롤 + 강조 + `Account linked successfully` 토스트 |

수집 도구(`tools/`)·스냅숏(`pages/`)은 고치지 않았다.

### 동작하는 흐름

| 흐름 | 동작 |
|---|---|
| 캐시백 허브 | 라우트 탭(CEX/DEX/Brokers, 알약 이동) · 파트너 드롭다운 · 거래량 입력/슬라이더(드래그·키보드) → 계산기·비교표 금액 실시간(정책 계산식, 2자리 절삭) · 숫자 카운트업 · 비교표 검색(0건 문구)·열 정렬·리스트/카드 · 탭 전환 스켈레톤 · 회원이면 연동 계정 기준 잔액 패널(로딩 스켈레톤 300~800ms, 10 USDT 미만 넛지). Brokers는 lot 기준 계산식이 없어 표본 고정 |
| 거래 계정 연동 | 거래소 선택(검색·CEX/DEX 칩) → DEX 지갑 주소(즉시 검증 REQ-065·067) / CEX UID → Next → 퍼즐 캡차(실제로 끌어 맞춰야 통과, 실패 시 흔들림·되돌림, 3회 실패 시 새 퍼즐) → 처리 중(최소 1초) → 결과 → 홈 새 행. 닫기 X·바깥·Esc, 입력 유지(거래소별 초안), Next 중복 클릭 방지, 모바일은 바텀시트 + 전체 화면 폼 |
| 공통 | 버튼 hover/pressed, 모달·시트 열림/닫힘 전환, 토스트, 드롭다운, 복사 → 클립보드 + `Copied.`. 전환 .2~.3s · `cubic-bezier(.65,0,.35,1)`(스냅숏 CSS) |

### 테스트 주소 규칙 (모달 왼쪽 아래 「테스트 주소」 도움말에서 바로 넣기)

| 지갑 주소 끝 4자리 | UID 끝자리 | 결과 |
|---|---|---|
| `0001` | `1` | 레퍼럴 아님 (L8) |
| `0002` | `2` | 타인 사용 중 (L9) |
| `0003` | `3` | 한도 초과 (L15) |
| `0004` | `4` | 확인 중 (L11) → 홈 행 `Trying to link` |
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
| DEX 상세 | 탭 바 고정 + 스크롤 위치 연동 + 밑줄 이동, 탭 클릭 → 그 구역으로, Taker/Maker 토글 → 오퍼 박스·계산기 값(카운트업), 계산기 슬라이더(눈금 Min 100K~10M), 단계 가이드 단계 클릭 → 패널·미디어, `How this works` 모달(현재 거래량·Taker/Maker 반영), FAQ 여러 구역 동시 펼침, 리뷰 정렬 · `Read more`, `Get Started`·`Join Now` 새 탭 |
| 상세 회원 상태 | 게스트 `Sign Up` · 미연동 `Link Wallet` → 그 DEX가 선택된 연동 모달 · 연동 완료 `Auto Claim`(비활성) + `My review` · 확인 중 지갑만 → 비활성 `Trying to link`(결정 Q6 B) |
| 홈 `See All` | 수집본 CEX 계정 + 연동한 DEX 계정, 거래소별 묶음 · 계정 수 · 합계 · 상태 점, All/CEX/DEX 칩 실제 필터, 행 → 상세, `Close` |
| 캐시백 요약 | 월 이동(이전/다음 · 월 목록), 날짜 선택, 거래소(범위·거래소)·계정(복수)·유형(복수) 필터 → `Search` 적용 · `Reset`. 달력 칸 = 그날 순액, 월간 카드 = 받은 금액·출금·순액 계산 |
| 소유권 인증 | 연동 결과 「타인 사용 중」 `Verify Ownership` → 가이드 3단계(이미지 클릭) → 파일 선택(MP4·MOV, 1GB 초과·다른 형식 = `Upload Failed`) → 업로드 진행률 → 파일 행(× = 제거) → `Submit this claim?` → 홈 행 `Verifying ownership` → 도움말에서 승인(연동 완료) / 거절(`Ownership verification failed`) |

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
| | DEX 개요 `WITHDRAWAL` 카드 라벨 · 비교표 `Where withdrawals go` · 리뷰 요약 표본 `… every day.` | 9차 #2 · #4 |
| 실사이트 랜딩 `/en`(런타임 `dexCopy` · `dexPartners`) | 3단계 `Link your exchange account` / `Link your exchange UID or wallet address to TetherMax` · `Get cashback in USDT automatically` / `Each linked account is paid automatically once its claimable balance reaches 10 USDT.` | 문구표 #44 · Figma 랜딩 28960:128375 |
| | 모바일 `Top Exchanges` → `Our Partners` + 칩 `All` · `Exchanges` · `DEXs`(실제 필터), 목록 끝 두 행 `ApeX 30%` · `Lighter 20%` → 누르면 DEX 상세 | Figma 29386:140183 |
| 실사이트 서비스 소개(런타임 `dexCopy`) | 피드 제목·부제 `Someone is cashing out right now` / `Claim every cent you've earned` · 캐시백 슬라이드 부제 #75 · 파트너십 문장 #76 · `Account linked` / `… link their account.` | 문구표 #41 · #75 · #76 · 9차 #1 |

스냅숏 페이지(`pages/`)는 고치지 않고 런타임에서 문구만 바꾼다(`pt-runtime.js` 상단 `COPY` 표 — 랜딩·서비스 소개만).

**검증** — Playwright 실조작(2회차 시나리오 전체 + 3회차 항목), 페이지 오류 0. 콘솔 오류 1건은 실사이트 스냅숏의 외부 SVG(`tethermax.io/...#kolFunnelClipPath`) CORS 차단 — 런타임 오류 아님. 스크린샷 `05.리포트/실동작프로토타입_img/3_*.png`.

| 아직 없는 것 | 이유 |
|---|---|
| 실사이트 혜택·랭킹 화면의 Figma 3차 문구(`Link a CEX UID to Get Cashback` · 랭킹 캡션 2줄) | 수집본에 해당 문구·자리가 없음(실사이트 화면). 전체 프로토타입에는 반영 |
| 계산기 Summary `Withdrawal Details` / `Withdrawal Time` | `/en/payback`은 실사이트 수집본 그대로(DEX 앱 계산기 아님). 전체 프로토타입에는 반영 |
| 모바일 랜딩 스크롤 | 모바일 랜딩 스냅숏의 `body`가 `position:fixed`로 수집돼 화면이 스크롤되지 않음(수집 시점 상태) — 다음 수집 때 확인 |

### 아직 없는 것 (다음 회차 후보)

| 항목 | 이유 |
|---|---|
| 리뷰 작성 폼 · 리뷰 페이지 이동 | 작성 화면 디자인 없음. `Write a Review`는 토스트 |
| 재청구(이전 보유자 O14~O16) | 이전 보유자 계정 표본이 없음 |
| Brokers 탭 계산식 | 미정 — 표본 값 그대로(화면 표시 없음) |
