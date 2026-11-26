# 상태 ↔ Figma 근거 대응 — 홈 그룹 (home.main · home.wallet · home.timeline · wd.claim · wd.second · wd.reflect · my.main)

작성 2026-11-26 · Figma 스크린샷 확인 반영(MAXOP-731 · MAXOP-783 캐러셀 26047:56685 · MAX-18 출금 모달 12936:389796 · Pending withdrawal 10501:104627 · My Page 17170:235039). 색인 검색은 `tools/figfind.py` · `ref/figma_index.tsv` · `ref/figma_pages/*.xml`(텍스트 레이어 이름)만으로 찾음. 확신 「후보」는 Figma 연결 후 `get_screenshot`으로 확인할 목록이다.

- 근거 종류: **DEX** = DEX(revision) 화면 프레임 · **기존** = 기존 페이지(`[MAX-…]`) 프레임 · **재사용** = 같은/가까운 페이지의 컴포넌트를 그대로 가져다 씀 · **없음**
- 확신: **확실** = 프레임 이름·라벨·텍스트 레이어가 상태와 일치 · **후보** = 추정(스크린샷 확인 필요)
- `흐름 S4_nn` = DEX(revision) `API 상태 흐름 4 · 홈·허브·지갑 상세 · 실제 잔액 영역`(29002:127590)의 상태 카드. 상태·전환은 정의하지만 레이아웃은 와이어(headline/description 자리표시)라 시각 근거는 아니다. `흐름 S6_nn` = `API 상태 흐름 6 · 캐시백 요약·캘린더·랭킹`(29002:129132)

## 기본 페이지 프레임 (셸 포함 「진짜 제품」 기준)

| 화면 | PC | mWeb | mAPP | 비고 |
|---|---|---|---|---|
| 회원 홈 S3 | `[MAX-7]` Web › S3 lightMode 4060:57161 (1440×4019) | mWeb/landingPage 4248:33574 [Landing Page (S3 - no linked UIDs)] | 8582:154521 · 8582:155619 | DEX 변경: S3-1 28960:127759 |
| 회원 홈 S4 | `[MAX-7]` [MAXOP-731] Accumulated Cashback Web 22913:1052131 · 22913:1054569 (1440×1613, 푸터 포함) | 22913:1051713 · 22913:1054334 (375×844) · 전체 길이판 4060:25384 [S4 full view] | 8582:156599 · 8582:157110 | DEX 변경: HW1 28960:126108 · S4-1 28960:127837. MAXOP-731 두 변형의 차이(툴팁 등)는 스크린샷 확인 |
| 연동 계정 상세(지갑 상세) | `[MAX-7]` [MAX-1216] UID detail / Web / Review not written 25867:1347701 · MAXOP-783 UID detail / web / new timeline 26047:1349155 (1440×1731) | UID detail / Mobile 25867:1348700 · 26047:1348691 (375×1391) · 구판 mWeb individualExchange 6042:88184 [Able to Withdraw] · 12792:46713 [Unable to Withdraw] | 8582:157676 · 8582:158110 | DEX 변경: PW1 28960:125943 · 매칭 카드 29026:97581 |
| 출금 화면 /withdrawal-apply | `[MAX-18]` web › Withdrawal lightMode Web 8970:173588 [Withdrawal] (홈 위 모달, 내용은 심볼) | Backdrop 8873:163663 · 9193:116549 · 9230:143243 [Withdrawal] | mobileAPP mWeb/LP 9071:154791 · 9071:154792 | 정책: 출금 버튼·보안 인증 → 비활성 `Auto Claim`(DEX 흐름 S4_06·S4_10 「자동 지급 버튼 비활성」) |
| 마이 | `[MAX-426, MAX-498]` Web 17170:235039 [Post-login] (홈 위 오른쪽 패널) · 12474:173502 | mWeb/landingPage/Post-login 10061:197517 [Post-login] | 10981:111021 [non-partners · Invite Friends] · 10981:111025 [partners · Partners Hub] | |

## home.main

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| home.main:auto | 로그인 상태(게스트·S3·S4) 별칭 | — | guest · s3 · normal을 따름 | (별칭, 집계 제외) | — | — |
| home.main:guest | 비로그인 공개 화면 | PC = landing.main(랜딩 담당, `[MAX-7]` S1/S2 Web 3448:22914+3448:22966) / mo 29037:113704 | DEX `Mobile / Guest entry / Home` 29037:113704 | DEX | 확실 | `Guest entry` · `S1/S2 lightMode` |
| home.main:s3 | S3 연동 0 — 체크리스트 · Cashback Preview | 4060:57161 / 4248:33574 · app 8582:154521 | DEX S3-1 28960:127759 · 기존 S3 Web 4060:57161 · mWeb 4248:33574 (텍스트 `Unlock Your First Cashback in 3 Steps!`) | DEX | 확실 | `S3-1` · `S3 lightMode` · `no linked UIDs` |
| home.main:s3App | S3 앱·모바일웹 빈 홈 카드 | 4248:33574 · app 8582:154521 | 기존 mAPP S3 8582:154521 · mWeb 4248:33574 — 체크리스트 카드는 같고 V2.2 `Link once and cashbacks keep coming` 카드는 어디에도 없음 | 기존 | 후보 | `S3/S4 mobileAPP` · `Link once`(0건) |
| home.main:s3Pending | 확인 중 계정만 → S4 | S4 기본 | DEX S4-1 28960:127837 · 흐름 S4_04 `Checking your referral` 29002:127671 · 기존 탐색안 5017:42617 [1 linked account Status: In Progress (manual linking)] | DEX | 후보 | `In Progress` · `Checking your referral` |
| home.main:normal | S4 연동 있음 — CEX·DEX 한 목록 | 22913:1052131 / 22913:1051713 · app 8582:156599 | DEX S4-1 28960:127837 · 기존 MAXOP-731 22913:1052131 | DEX | 확실 | `S4-1` · `MAXOP-731` · `Linked UID` |
| home.main:hw1 | 총액 카드 · 4행 + Aster 칩 | S4 기본 | DEX HW1 28960:126108 | DEX | 확실 | `HW1` |
| home.main:statuses | 상태 7단계 행 | S4 기본 | 흐름 S4_03 `Ownership verification in progress` 29002:127651 · S4_04 29002:127671 · S4_05 `Account issue` 29002:127698 · S4_07 `Link unsuccessful` 29002:127748 · S4_08 `Ownership verification unsuccessful` 29002:127773 · S4_09 `Wallet unlinked` 29002:127798 · 행·칩 = HW1 · 기존 탐색안 5017:43182 [Failed] · 5017:47137 [Active/In Progress/Failed] | 재사용 | 후보 | `Failed` · `In Progress` · `S4_0` |
| home.main:chips | DEX 칩 3종 | S4 기본 | 흐름 S4_12 `No cashback yet` 29002:127873 · S4_13 `Data delayed` 29002:127898 · S4_17 `Inactive exchange` 29002:128003 · 칩 모양 = HW1 Aster 칩 | 재사용 | 후보 | `No cashback yet` · `Data delayed` · `Inactive` |
| home.main:loading | 로딩 스켈레톤 | S4 기본 | 재사용: `[MAX-425]` Web 5702:12582 [Loading state](Skeleton 컴포넌트) · `[MAX 1216]` S7 Loading 22442:219836 / 22956:85536 | 재사용 | 후보 | `Loading state` · `Skeleton` |
| home.main:error | 잔액 로드 실패 | S4 기본 | 흐름 S4_15 `Cashback could not load` 29002:127948 · 재사용 Hub H7 `Balance did not load` 28960:126920 / 28960:130830 | 재사용 | 후보 | `could not load` · `Try again` · `H7` |
| home.main:delayed | DEX 원장 지연 — Last updated | S4 기본 | 흐름 S4_13 29002:127898(마지막 확정값 유지) · 재사용 Hub H6 `DEX data delayed` 28960:126914 / 28960:130824 | 재사용 | 후보 | `Data delayed` · `H6` · `Last updated`(DEX 0건) |
| home.main:many | 계정 11개 이상 — 10개 + 더보기 | S4 기본 | 기존 탐색안 5017:44864 [more than 3 linked accounts > Display ‘Show all’] · 5017:47828 · 카드 헤더 `See All`(MAXOP-731) | 기존 | 후보 | `Show all` · `More than 3` |
| home.main:app | 앱·모바일웹 — Wallet 라벨 없음 | app 8582:156599 / mWeb 22913:1051713 | 기존 mAPP S4 8582:156599 · 8582:157110 | 기존 | 확실 | `S3/S4 mobileAPP` |
| home.main:full | 지갑 전체 주소 펼침 | S4 기본 | 재사용 DEX `Wallet address / 0x91c4…a07b` 28984:126296(`Full wallet address` · `Dismiss`) | 재사용 | 후보 | `Wallet address` · `Full wallet address` |
| home.main:first | 첫 연동 — S4 + 토스트 | S4 기본 | DEX S3-7 28960:127795 (모바일 = 연동 그룹 `UID link result / Splash / mWeb 375`) | DEX | 확실 | `S3-7` |
| home.main:newRow | 새 행 맨 아래 · 0.00 | S4 기본 | DEX S4-6 28960:127867 | DEX | 확실 | `S4-6` |
| home.main:transferred | 10 USDT 미만 이관 4.00 | S4 기본 | DEX S4-6 28960:127867(새 행) · 흐름 S4_19 `Total Cashback Balance` 29002:128053(확정 잔액 갱신) | DEX | 후보 | `S4-6` · `S4_19` |
| home.main:pending | 확인 중 새 행 | S4 기본 | DEX S4-6 28960:127867 · 흐름 S4_04 29002:127671 | DEX | 후보 | `Checking your referral` |
| home.main:inactive | DEX 오프보딩 Inactive | S4 기본 | 흐름 S4_17 `Inactive exchange` 29002:128003(기존 잔액 유지) · 행 = HW1 | 재사용 | 후보 | `Inactive exchange` |
| home.main:multi | 같은 DEX 지갑 여러 개 | S4 기본 | 기존 mWeb 7633:92140 [2 or more UID per exchange · Default] · 7633:90865 [When user tap on ‘Bitget’] · Web MAXOP-731 22913:1052131(`Bitget · 2 UIDs` 묶음) | 기존 | 확실 | `2 or more UID per exchange` · `2 UIDs` |
| home.main:rejected | 확인 중 거절 → 행 제거 | S4 기본 | DEX S4-1 28960:127837 · 흐름 S4_04 → S4_07 `Link unsuccessful` 29002:127748 | DEX | 후보 | `Link unsuccessful` |
| home.main:labels | DEX 정산 상태 라벨 | S4 기본 | 흐름 S6_08 `Accruing this week (estimate)` 29002:129293 · S6_09 `Withheld` 29002:129313 · S6_10 `Under minimum` 29002:129333 · S6_11 `Pending settlement` 29002:129353 · 칩 = HW1 | 재사용 | 후보 | `Accruing` · `Withheld` · `Under minimum` |
| home.main:faq | 홈 FAQ — 회원 답변 | S4 기본 | 회원 홈(S3·S4) 프레임에 FAQ 없음. 재사용 `[MAX-7]` MAXOP-307 FAQ Web 17000:66970 · mWeb 17000:65401 · Questions 17000:65869 (게스트 랜딩 FAQ) | 재사용 | 후보 | `FAQ` · `MAXOP-307` |

## home.wallet (연동 계정 상세 = 기존 UID 상세 + DEX 변경)

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| home.wallet:normal | 부분 매칭 · 최소액 이상 | 25867:1347701 · 26047:1349155 / 25867:1348700 · 26047:1348691 · app 8582:157676 | DEX PW1 28960:125943 · 매칭 카드 `부분 매칭 · 최소액 이상` 29026:97733 · 흐름 S4_11 `Event Reward` 29002:127848 | DEX | 확실 | `PW1` · `individualExchange` · `UID detail` |
| home.wallet:noReward | 리워드 없음 · 최소액 이상 | 〃 | 29026:97588 · 흐름 S4_22 `Available Cashback`(이벤트 행 숨김) 29002:128128 | DEX | 확실 | `리워드 없음` |
| home.wallet:zero | 모든 적립 잔액 0 | 〃 | 29026:97617 · 흐름 S4_12 `No cashback yet` 29002:127873 | DEX | 확실 | `모든 적립 잔액 0` |
| home.wallet:cashBelow | 캐시백만 · 최소액 미만 | 〃 | 29026:97646 | DEX | 확실 | `캐시백만 보유` |
| home.wallet:rewardOnly | 리워드만 | 〃 | 29026:97675 | DEX | 확실 | `리워드만 보유` |
| home.wallet:partialBelow | 부분 매칭 · 최소액 미만 | 〃 | 29026:97704 | DEX | 확실 | `부분 매칭 · 최소액 미만` |
| home.wallet:fullBelow | 전액 매칭 · 최소액 미만 | 〃 | 29026:97762 | DEX | 확실 | `전액 매칭 · 최소액 미만` |
| home.wallet:fullEqual | 전액 매칭 · 최소액과 일치 | 〃 | 29026:97791 | DEX | 확실 | `최소액과 일치` |
| home.wallet:fullAbove | 전액 매칭 · 최소액 초과 | 〃 | 29026:97820 | DEX | 확실 | `최소액 초과` |
| home.wallet:edge | 소수점 절삭 · 기준 직전 | 〃 | 29026:97849 | DEX | 확실 | `소수점 절삭` |
| home.wallet:loading | 잔액 로딩 | 〃 | 29026:97581 하단 `처리 상태`·`조회 상태` 메모 · 재사용 `[MAX-425]` 5702:12582 [Loading state] · `[MAX 1216]` S7 Loading 22442:219836 | 재사용 | 후보 | `Loading state` · `조회 상태` |
| home.wallet:error | 잔액 조회 실패 | 〃 | 흐름 S4_15 29002:127948 · 재사용 Hub H7 28960:126920 / 28960:130830 | 재사용 | 후보 | `could not load` · `H7` |
| home.wallet:delayed | 파트너 지연 — Last updated | 〃 | 흐름 S4_13 29002:127898 · S4_14 `Partner data unavailable` 29002:127923 · 재사용 Hub H6 28960:126914 | 재사용 | 후보 | `Data delayed` · `Partner data unavailable` |
| home.wallet:reviewed | 리뷰 작성 후 — 리뷰 유도 없음 | 25867:1348199 / 25867:1348944 | 기존 `[MAX-1216]` UID detail / Web / Review already written (Plain) 25867:1348199 · Mobile 25867:1348944 | 기존 | 확실 | `Review already written` |
| home.wallet:pending | 연동 시도중 | 〃 | DEX PW1 헤더 칩 자리 · 흐름 S4_04 29002:127671 | DEX | 후보 | `Checking your referral` |
| home.wallet:totalClaimed | Total Claimed 행 | 〃 | 기존 mAPP individualExchange 8582:157676(텍스트 `Total Claimed` `1,000.00 USDT`) · mWeb 6042:88184 | 기존 | 확실 | `Total Claimed` |
| home.wallet:subaccounts | 하위 계정 미표시 (= normal) | 〃 | DEX PW1 28960:125943 | DEX | 확실 | `PW1` |

## home.timeline (캐시백 타임라인 · 누적 캐시백)

`improvement_13` 이름의 프레임은 색인·XML 어디에도 없음. 가장 가까운 것은 `[MAX-7]` MAXOP-783 Earning timeline(2026-09-30)과 Improvements 페이지의 Earning Timeline 카드.

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| home.timeline:normal | EdgeX Daily D+1 | 지갑 상세 기본(26047:1349155 / 26047:1348691) · 누적 = 홈 S4 22913:1052131 | 기존 MAXOP-783 `Earning Timeline / carousel 343` Step=1 26047:56579 · Step=2 26047:56615 · Step=3 26047:56650 · 누적 카드 = MAXOP-731(`Total cumulative cashback` · `This month` · `Total withdrawn` · `Sum of 3 linked UIDs · Updated daily at 09:00 KST` · `View history`) 22913:1052131 / 22913:1051713 | 기존 | 확실 | `timeline` · `Earning` · `cumulative` · `MAXOP-731` |
| home.timeline:apex | ApeX D+2 | 〃 | 〃 (같은 컴포넌트, 값만 다름) | 기존 | 확실 | 〃 |
| home.timeline:lighter | Lighter Weekly W+1 | 〃 | 〃 | 기존 | 확실 | 〃 |
| home.timeline:compact | compact 단계 | 〃 | `Improvements` 페이지 Earning Timeline 카드 18950:146957(`Start Trading` · `Cut-off Time` · `Updated` · `*Updates may vary by up to 1 hour.`) · 구판 PW1 안 Earning Timeline | 기존 | 확실 | `Earning Timeline` · `Cut-off Time` |
| home.timeline:warning | 순차 지급 경고 | 〃 | 없음. 가장 가까운 것 `*Updates may vary by up to 1 hour.` 18919:116130 | 없음 | — | `순차` · `sequential` · `may vary` |

## wd.claim (/withdrawal-apply — 기존 출금 모달, 출금 요소는 비활성 Auto Claim으로 대체)

모달 안 내용은 심볼이라 XML 텍스트가 없음 → 대부분 후보. DEX(revision)의 출금 화면(DW1·HW2·HW3·PS1~PS3)은 숨김(폐기).

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| wd.claim:normal | 가능 위 · 불가 아래 | 8970:173588 / 8873:163663 · app 9071:154791 | 기존 `[MAX-18]` Web [Withdrawal] 8970:173588 · 10500:99141 · 10500:100058 · 10500:100646 · 10500:101079 · Improvement as of 23rd June Web 17023:56436 · 흐름 S4_06·S4_10 `Available Cashback`(자동 지급 버튼 비활성) 29002:127723 · 29002:127823 | 기존 | 확실 | `Withdrawal lightMode` · `[Withdrawal]` |
| wd.claim:allBlocked | 전부 불가 | 〃 | 기존 Web 10500:94074 [Not eligible to withdraw] | 기존 | 확실 | `Not eligible to withdraw` |
| wd.claim:zero | DEX 캐시백 0 배너 | 〃 | 흐름 S4_12 `No cashback yet` 29002:127873 · 재사용 매칭 카드 29026:97617 | 재사용 | 후보 | `No cashback yet` |
| wd.claim:loading | 로딩 | 〃 | 재사용 `[MAX-425]` 5702:12582 [Loading state] | 재사용 | 후보 | `Loading state` |
| wd.claim:delayed | 데이터 지연 | 〃 | 흐름 S4_13 29002:127898 · 재사용 Hub H6 28960:126914 | 재사용 | 후보 | `Data delayed` |
| wd.claim:partner | 파트너 오류 — 그 카드만 | 〃 | 흐름 S4_14 `Partner data unavailable` 29002:127923(해당 카드 재조회) · 재사용 Hub H7 28960:126920 | 재사용 | 후보 | `Partner data unavailable` |
| wd.claim:balanceError | 잔액 오류 | 〃 | 흐름 S4_15 29002:127948 · 재사용 Hub H7 28960:126920 | 재사용 | 후보 | `could not load` |
| wd.claim:deducted | 선차감 반영 | 〃 | 기존 Web 10501:104627 [Pending withdrawal] | 기존 | 확실 | `Pending withdrawal` |
| wd.claim:preAccrual | 적립 전 줄 | 〃 | 흐름 S6_11 `Pending settlement` 29002:129353 · 칩 = HW1 | 재사용 | 후보 | `Pending settlement` |
| wd.claim:many | 11개 이상 — 10개 + 더보기 | 〃 | 기존 Web 12936:389796 · 12936:389797 [When there is more than 2 UIDs] | 기존 | 확실 | `more than 2 UIDs` |
| wd.claim:noNetwork | 지급 네트워크 미설정 | 〃 | 흐름 S4_20 `Network unavailable` 29002:128078 · 시각 = 매칭 카드 비활성 Auto Claim | 재사용 | 후보 | `Network unavailable` |
| wd.claim:lighter | Lighter 카드 — Every Monday | 〃 | 재사용 Hub H5 `Signed in, DEX wallet linked` 28960:126908 / 28960:130818 의 DEX 카드 | 재사용 | 후보 | `Hub H5` |
| wd.claim:pending | 확인 중 계정 미표시 (= normal) | 〃 | 〃 normal | 기존 | 확실 | — |

## wd.second · wd.reflect · my.main

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| wd.second:normal | /withdrawal 출금 가능 계정 없음 | `[MAX-18]` mWeb 8873:165689 · 8873:167623 | 기존 mWeb/allPartnerExchange 8873:165689 · mWeb/cashback/individualExchange [Withdrawal] 8873:167623 — V2.2 STG 문구 `Trading just a bit more…`는 XML에 0건 | 기존 | 후보 | `bit more`(0건) · `allPartnerExchange` |
| wd.reflect:normal | 지급 전 | 홈 S4 22913:1052131 | 기존 MAXOP-731 총액·누적 카드(`Total withdrawn`) 22913:1052131 | 기존 | 후보 | `Total withdrawn` |
| wd.reflect:deducted | 선차감 | 〃 | 기존 `[MAX-18]` 10501:104627 [Pending withdrawal] | 기존 | 확실 | `Pending withdrawal` |
| wd.reflect:restored | 복원 — Withdrawal returned | 〃 · 요약 CS1 28960:127133 | 흐름 S6_05 `Withdrawal returned` 29002:129233(복원된 날짜 유지) · 행 = CS1 일별 행 | 재사용 | 후보 | `Withdrawal returned` |
| my.main:normal | 마이 메뉴 | 17170:235039 / 10061:197517 · app 10981:111021 | 기존 Web 17170:235039(텍스트 `Cashback Summary` · `Invite Friends` · `Cashback Ranking` · `My Coupons` · `Account Security` · `Notification Settings` · `Log Out`) · mWeb 10061:197517 [Post-login] · 10981:110987 [For partners, show ‘Partners Hub’] · 로그아웃 확인 11572:249786 | 기존 | 확실 | `[MAX-426` · `Post-login` |

## 집계 (auto 제외 63상태)

| 근거 종류 | 확실 | 후보 | 계 |
|---|---|---|---|
| DEX | 17 | 5 | 22 |
| 기존 | 15 | 4 | 19 |
| 재사용 | 0 | 21 | 21 |
| 없음 | — | — | 1 |

## Figma에만 있고 상태로 없는 것 (확인 후 판단)

| 노드 | 내용 | 메모 |
|---|---|---|
| 흐름 S4_21 `Wallet unavailable` 29002:128103 | 회원 홈 → Back to Home | 지갑 상세 진입 시 지갑이 없어진 경우로 보임. home.wallet 상태 후보 |
| 기존 `[MAX-7]` mWeb 8582:167558 [Copy UID] | UID 복사 토스트 | 지갑 상세 주소 복사 토스트로 재사용 가능 |
| 기존 `[MAX-7]` 8582:160728 · 8643:121393 [Notifications] | 홈 알림 패널 | 셸(공통) 담당 영역 |
