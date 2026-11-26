# 기존 디자인 카탈로그 — B_거래소_연동_잔액

Figma `UI-UX Design`(fileKey `hsa3bSV9QmFTe2jsf6tzTm`)의 기존 사용자 화면 10개 페이지를 섹션 캡처로 직접 보고 정리했습니다. 노드 id는 Figma 기준이며 캡처는 `img/<pageid>__<sectionid>.jpg`입니다. 화면 이름(라벨)은 캔버스의 보라색 라벨·SCREEN-LABEL 문구를 그대로 옮겼습니다.

## 요약

| 항목 | 값 |
|---|---|
| 페이지 수 | 10 |
| 라이트 섹션(캡처 대상) | 92 |
| 캡처 수 | 92 |
| 제외·다크·숨김·QA·아이디어로 기록만 한 섹션 | 57 (페이지별 「제외 섹션」 줄) |
| 판이 여러 개인 화면 | 18건 (아래 각 페이지 표 + 「판 비교 종합」) |
| 상태 컴포넌트 | 57건 |

### 사용자 확인 필요

| # | 내용 | 관련 판 |
|---|---|---|
| 1 | 거래소 상세 **상단 영역**의 현행 판: MAX 1216 상세(S1~S25) 상단 카드 vs `Exchange Detail Page top area (Hailey's Design)` 시안 A·A-수정·A-수정2·A-수정3·B 중 채택안. 시안 페이지에 날짜·채택 표시가 없음 | 판 #2 |
| 2 | 거래소 상세의 **리뷰(Discussion/Review) 영역**은 MAX 1216 회의 메모에 「Suspended for now」로 적혀 있음. 리뷰 포함 화면(S1~S25, CMT-xx)을 현행으로 볼지, 리뷰 없는 상세를 현행으로 볼지 | 판 #1 |
| 3 | 거래소 목록의 현행 판: MAX-22(카드형 + 칩 태그) · MAXOP-408(태그 제거 제안) · MAX 1216 CMT-08(Rating 열·외곽선 하이라이트) · MAXOP-692 실측 라이브(새 GNB) 중 기준 | 판 #4 |
| 4 | 캐시백 요약 월 합계(MAXOP-732)의 레이아웃: `Layout=Receipt`(세로 Received/Withdrawn/Net) vs `Layout=Metrics`(가로 3칸). 같은 섹션·같은 날짜(2026-09-29) | 판 #13 |
| 5 | 캐시백 요약 mWeb 기본 화면과 mAPP 「Default show total cashback」 차이(앱만 월 합계 표시?)가 의도된 플랫폼 차이인지 | 판 #14 |
| 6 | 출금 확인 다이얼로그: 단일 UID 판(MAX-18 기본) vs 다중 UID 목록 판(Improvement 23rd June). 23rd June 판이 현행으로 보이나 명시 없음 | 판 #10 |
| 7 | 출금 후 앱 리뷰 요청: 전체 화면 「How do you like TetherMax?」(Leave a review, APP only) vs 바텀시트 별점(for future use) | 판 #12 |
| 8 | 소유권 확인 mWeb의 「Unlinked UID detail」「Verification failed detail」 두 화면이 흐리게(반투명) 처리돼 있음. mAPP·Web 쪽은 정상 표시. 폐기인지 | 판 #18 |
| 9 | 연동 결과 MAXOP-751 스플래시의 「UID Already in Use」에는 MAX-561의 `Try a different UID` 보조 버튼·UID 칩이 없고, `Ownership Claim Unavailable`(쿨다운) 결과가 없음. 스플래시에 두 요소를 합칠지 | 판 #7·#8 |
| 10 | MAXOP-751 스플래시의 `UID Link Completed` 버튼: mWeb 인스턴스는 `Close`, App·Desktop은 `Back to Home`(컴포넌트 기본값은 `Back to Home` + `Need help? Contact Support`) | 판 #7 |
| 11 | `[MAX-601]` 페이지 왼쪽 떨어진 프레임 `Frame 1984078537`(22592:233087, 큰 글씨 mWeb 요약)이 MUI 글씨 키움 판인지 | 판 #14 |
| 12 | MAX-146 계산기 섹션 `mWeb`(8135:170235)은 이름은 mWeb이지만 내용은 다크 모드. 다크로 취급해도 되는지 | — |

### 캡처하지 못했거나 일부만 읽힌 섹션

| 페이지 | 노드 | 사유 |
|---|---|---|
| [MAX 1216] | 22442:219446 `Review — Web [Light]`(42910×6587) | 캡처는 했으나 4000px로 줄이면 라벨이 읽히지 않음. 화면 판정은 메타데이터 SCREEN-LABEL + S1 단독 캡처(22442:219455)로 보완 |
| [MAX 1216] | 22442:217903 `Components`(23648×23254) | 캡처는 했으나 축소율이 커서 개별 컴포넌트 판독 불가. 컴포넌트 이름은 메타데이터로 기록 |
| [MAX-22] | 떠 있는 프레임 7993:130484 · 18754:154463(Web 1440) · 17829:128499 · 13114:271342(mWeb individualExchange) · 배너 프레임 16230:* · 하이라이트 옵션 7260:65460 외 3 | 섹션 밖 개별 프레임. 미캡처 |
| [MAX-146] | 떠 있는 프레임 8135:173138 · 8135:173170 · 8135:173147(436폭 팝업류) | 섹션 밖. 미캡처 |
| [MAX-30] | 떠 있는 프레임 17933:67318(375×640) | 섹션 밖. 미캡처 |
| [MAX-18] | 떠 있는 프레임 17913:151585(375×812) | 섹션 밖. 미캡처 |
| 전체 | 다크·QA·아이디어 섹션 | 지시대로 제외(존재만 기록) |

Figma MCP 호출 한도에 두 번 걸렸고, 기다린 뒤 재시도해 라이트 섹션은 모두 받았습니다.

---

## 1. [MAX-22] Exchange List/Exchange Details (5113:47485)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mobileWeb › S1/S2 Guest (Pre-login) lightMode | 5113:48951 | ![](img/5113-47485__5113-48951.jpg) | 18 |
| mobileWeb › S3,S4 (post-login-UID list N) lightMode | 5113:53239 | ![](img/5113-47485__5113-53239.jpg) | 11 |
| mobileWeb › S3,S4 (post-login-UID list Y) lightMode | 5943:58368 | ![](img/5113-47485__5943-58368.jpg) | 3 |
| Web › S1/S2 Guest Pre-login lightMode | 6286:50225 | ![](img/5113-47485__6286-50225.jpg) | 12 |
| Web › S3,S4 (post-login-UID list N) lightMode | 8062:157084 | ![](img/5113-47485__8062-157084.jpg) | 10 |
| Web › S3,S4 (post-login-UID list Y) lightMode | 8316:207808 | ![](img/5113-47485__8316-207808.jpg) | 1 |
| mobileAPP (라이트·다크 함께) | 8798:157272 | ![](img/5113-47485__8798-157272.jpg) | 4 |
| Updated as of 21st May (상세 mWeb·Web + PC 다이얼로그) | 12085:404939 | ![](img/5113-47485__12085-404939.jpg) | 3 |
| Updated as of 21st May (목록 mWeb) | 12184:417519 | ![](img/5113-47485__12184-417519.jpg) | 1 |
| Improvement (darker card border) as of 23rd June | 17079:47458 | ![](img/5113-47485__17079-47458.jpg) | 2 |
| Updated to tabs (ID verification, take a photo, KYC completion) As of 12th May 2026 | 10061:180976 | ![](img/5113-47485__10061-180976.jpg) | 6 |
| MAXOP-408 | 17618:329595 | ![](img/5113-47485__17618-329595.jpg) | 5 |
| Exchange banner (PC) | 15409:166392 | ![](img/5113-47485__15409-166392.jpg) | 0 (배너 6) |
| exchange banner for mobile | 17599:326938 | ![](img/5113-47485__17599-326938.jpg) | 0 (배너 6) |

제외 섹션: darkMode 3개(8473:110332 · 8473:117401 · 8643:100026 — 이름에 dark가 없으나 다크), Web darkMode 3개(8643:104260 · 8643:113046 · 8643:118997), 아이디어 `ideas`(6377:127672) · `mockuop`(6042:51042) · `maker/taker rate`(6042:67360).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| All Exchanges | 8471:65818 | mWeb | All Partner Exchanges 목록: 상단 배너 캐러셀, Here's What You Need to Know, Top Partner Exchanges, Limited Time Offers, 검색 + 칩(Recommended/All/Cashback Boost/Events) + 카드 목록 |
| All Exchanges (list view) | 5145:52544 | mWeb | 같은 목록의 표형(순위·Total Savings 열) |
| No results / Search Results | 5145:51653 | mWeb | 검색 결과 없음(`No results found for Crypto.com`) · 결과 있음 |
| Tooltip | — | mWeb | Total Savings 툴팁 다이얼로그(Close) |
| 🚀 Cashback Boost / Events | 8267:188334 · 8267:189508 | mWeb | 칩 필터 적용 목록 |
| Freeze 1st column for horizontal scroll | — | mWeb | 표형 가로 스크롤 시 첫 열 고정 |
| When no 'After Discount' in grey section (*added on 10th June) | — | mWeb | 수수료 표에 After discount 행이 없는 거래소 |
| Individual Exchange (Default) | 17170:89361 | mWeb | 상세(게스트): 로고·54% Total Savings·Taker/Maker·수수료 표 3행·Need help? Start Tour·$41.51 Est. total savings 슬라이더·Recent Average Cashback 차트·March Top Earners·Ongoing Events·Getting Started Guide·Terms & Conditions·Sign Up / Already have an account? |
| Individual Exchange (with cashback boost) | 8471:61205 | mWeb | 부스트 거래소(55% · Default 30% 취소선) |
| 'How it works' Tour (For Guest) | 8471:62274 외 | mWeb | 코치마크 3단계(가입→UID 연동→이미 가입했으면 지원팀) + 계산기 안내 |
| Already have a Bitget Account? | — | mWeb | 다이얼로그(Contact Customer Support / Close) |
| Terms & Conditions 펼침 | 8267:195295 | mWeb | 약관 전체 |
| Getting Started Guide | 8471:64430 외 3 | mWeb | 거래소 선택 → How do I sign up? → What's next after signing up? → KYC Verification 긴 페이지 |
| All Exchanges / Individual Exchange (S3,S4 UID N) | 8473:71020 · 8473:71021 · 8473:71022 | mWeb | 로그인·UID 미연동: 하단 `Sign Up` + `Link UID` 버튼, `Already have an account?` 링크, 하단 탭바 |
| Link UID flow 연결 | — | mWeb | Link UID 탭 → Link UID 흐름(MAX-30) |
| How it works Tour (S3,S4 N) | 8473:73017 외 | mWeb | 로그인 사용자용 투어 4단계 |
| All Exchanges / Individual Exchange (S3,S4 UID Y) | 8473:73693 · 8473:76479 · 8473:76481 | mWeb | UID 연동 완료: 하단 `Sign up` + `Trade ↗` (새 탭 또는 거래소 앱으로) |
| Web 목록·상세 (S1/S2) | 8643:107720 · 8473:104612 외 | Web | 표형 목록(Live Campaigns `View Event` 열) · 상세 2열(좌 요약·우 수수료 표) · 투어 · 가이드 |
| Web 상세 (S3,S4 N) | 8473:107766 외 | Web | Sign Up + Link UID 버튼, 투어 4단계 |
| Web 상세 (S3,S4 Y) | 8316:207808 내 | Web | Sign up + Trade, 부스트 카드 보조 프레임 |
| mobileAPP 목록·상세 | 8798:155222 · 8798:156898 | mAPP | 앱 목록(하단 탭바)·상세(Sign Up / Link UID) 라이트·다크 |
| Updated 21st May 상세 | 13992:430635 · 12085:406240 | mWeb·Web | 상세 하단 버튼 순서 `Already have an account?`(외곽) + `Sign Up ↗`(채움) |
| Dialog for PC | 12565:365214 | Web | 「Do you already have a Bitget account?」(Contact Customer Support / Close) |
| Updated 21st May 목록 | 12184:417517 | mWeb | 상단 「Here's What You Need to Know」(Cashback Preview·Getting Started Guide 카드) 포함 목록 |
| darker card border | 17079:47458 내 | mWeb | 목록 카드 테두리 진하게(라이트·다크) |
| Updated to tabs (12th May 2026) | 10061:179941 · 10061:180977 외 | mWeb·Web | 가이드 KYC 단계를 탭(ID verification / take a photo / KYC completion)으로 분리 |
| MAXOP-408 | 17618:333016 외 | mWeb·Web | 목록 행 안의 프로모션 태그(🚀·이벤트) 제거, 칩(Top/Cashback Boost/Events)만으로 분류하자는 제안 + 근거 메모 |
| Exchange banner | 15409:166392 | Web·mWeb | 배너 원본 3종 + 문구 얹은 판(Bitget KOT·Trading Competition·Binance Boost) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|---|---|
| 상세 하단 CTA | 기본(S1/S2) | Guest | 17170:89361 | — | `Sign Up` 채움 + `Already have an account?` 텍스트 버튼(세로) | **21st May 판**: 날짜가 가장 늦고 Web·mWeb·PC 다이얼로그까지 갖춤 |
| | 21st May | Updated as of 21st May | 13992:430635 · 12085:406240 | 21 May | Web은 가로 2버튼(외곽 `Already have an account?` 왼쪽, `Sign Up ↗` 오른쪽), PC는 다이얼로그 | |
| | S3,S4 UID N | S3,S4 N | 8473:71021 | — | `Sign Up` + `Link UID` 가로 2버튼 | 로그인·미연동 상태 전용(별개 상태) |
| | S3,S4 UID Y | S3,S4 Y | 8473:76479 | — | `Sign up` + `Trade ↗` | 연동 완료 상태 전용 |
| 목록 카드 | 기본 | S1/S2 Guest | 8471:65818 | — | 카드 + 이름 옆 태그(🚀 55% · 이벤트 수) | 아래 「판 비교 종합 #4」 — **사용자 확인 필요** |
| | darker card border | Improvement 23rd June | 17079:47458 | 23 June | 카드 테두리 진하게 | |
| | MAXOP-408 | MAXOP-408 | 17618:333016 | MAXOP-408 | 행 안 태그 제거, 칩 `Top`·`Cashback Boost`·`Events` | |
| 시작 가이드 | 긴 단일 페이지 | Guest | 8471:65568 | — | 한 페이지에 모든 단계 | MAX 1216 Sign-up guide(G1~G5)가 더 늦은 판 — 판 비교 #16 |
| | 탭형 | Updated to tabs | 10061:179941 | 12 May 2026 | KYC 단계를 탭으로 분리 | |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 빈 상태(검색 결과 없음) `No results found for Crypto.com` | MAX-22 | 5145:51653 부근 | ![](img/5113-47485__5113-48951.jpg) |
| 다이얼로그 `Already have a Bitget Account?` | MAX-22 | 5113:48951 내 | 같음 |
| 다이얼로그(PC) `Do you already have a Bitget account?` | MAX-22 | 12565:365214 | ![](img/5113-47485__12085-404939.jpg) |
| 툴팁 다이얼로그 `Total Savings` | MAX-22 | 5113:48951 내 | ![](img/5113-47485__5113-48951.jpg) |
| 코치마크(투어 말풍선 Next/Done) | MAX-22 | 8471:62237 · 8473:71518 외 | ![](img/5113-47485__5113-53239.jpg) |
| 배지/칩: 부스트(🚀 55%)·이벤트 수·Recommended/All/Cashback Boost/Events 칩·Active Users 칩·`Ends in` 타이머 칩 | MAX-22 | 5113:48951 내 | ![](img/5113-47485__5113-48951.jpg) |

---

## 2. [MAX 1216] Exchange Detail Updates (22044:758840)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Exchange Detail Page - Whats updated and improved | 22044:759623 | ![](img/22044-758840__22044-759623.jpg) | 8 |
| Components | 22442:217903 | ![](img/22044-758840__22442-217903.jpg) | 34 |
| Web › Review — Web [Light] | 22442:219446 | ![](img/22044-758840__22442-219446.jpg) | 22 |
| └ S1 Guest (Web 단독) | 22442:219455 | ![](img/22044-758840__22442-219455.jpg) | 1 |
| Web › Review — Permalink Web [Light] | 22442:219957 | ![](img/22044-758840__22442-219957.jpg) | 3 |
| Web › Review — Tag archive Web [Light] | 22442:220028 | ![](img/22044-758840__22442-220028.jpg) | 3 |
| Web › Review — Reward detail Web [Light] | 22757:90565 | ![](img/22044-758840__22757-90565.jpg) | 4 |
| Web › Review — Post-withdrawal prompt [Light] | 22779:96156 | ![](img/22044-758840__22779-96156.jpg) | 1 |
| Web › Review — Exchange list [Light] | 22799:92732 | ![](img/22044-758840__22799-92732.jpg) | 2 |
| Web › Review — My page nickname [Light] | 22817:95233 | ![](img/22044-758840__22817-95233.jpg) | 7 |
| Web › Review — Write gates [Light] | 22919:73787 | ![](img/22044-758840__22919-73787.jpg) | 2 |
| Web › Review — Photo viewer [Light] | 22933:77488 | ![](img/22044-758840__22933-77488.jpg) | 1 |
| Web › Review — Inline messages [Light] | 22934:77485 | ![](img/22044-758840__22934-77485.jpg) | 1 |
| Web › Review — Blog page Web [Light] | 23029:155486 | ![](img/22044-758840__23029-155486.jpg) | 1 |
| Web › Review — UID detail Web [Light] | 25763:1324620 | ![](img/22044-758840__25763-1324620.jpg) | 2 |
| Web › Review — Sign-up guide Web [Light] | 25800:1336401 | ![](img/22044-758840__25800-1336401.jpg) | 5 |
| Web › MAX-1216 Sign-up guide: step with 2+ parts (2026-09-30) | 26007:1563218 | ![](img/22044-758840__26007-1563218.jpg) | 4 |
| Presentation / Guided flows [Light] | 22552:59523 | ![](img/22044-758840__22552-59523.jpg) | 6 |
| Mobile › Review — Mobile [Light] | 22913:1055440 | ![](img/22044-758840__22913-1055440.jpg) | 29 |
| Mobile › Review — Permalink Mobile [Light] | 22913:1059569 | ![](img/22044-758840__22913-1059569.jpg) | 3 |
| Mobile › Review — Tag archive Mobile [Light] | 22913:1059658 | ![](img/22044-758840__22913-1059658.jpg) | 3 |
| Mobile › Review — Blog page Mobile [Light] | 23029:155681 | ![](img/22044-758840__23029-155681.jpg) | 1 |
| Mobile › Review — Reward detail Mobile [Light] | 25748:175075 | ![](img/22044-758840__25748-175075.jpg) | 4 |
| Mobile › Review — UID detail Mobile [Light] | 25790:6236 | ![](img/22044-758840__25790-6236.jpg) | 2 |
| Mobile › Review — Sign-up guide Mobile [Light] | 25807:1336556 | ![](img/22044-758840__25807-1336556.jpg) | 5 |
| Mobile › Review — Exchange list Mobile [Light] | 26382:786429 | ![](img/22044-758840__26382-786429.jpg) | 1 |
| App › Review — App [Light] | 22913:1057491 | ![](img/22044-758840__22913-1057491.jpg) | 29 |
| Improvement after meeting | 23137:1089216 | ![](img/22044-758840__23137-1089216.jpg) | 5 |
| MOTION / developer handoff | 23347:1136584 | ![](img/22044-758840__23347-1136584.jpg) | 1 |
| Title sizing heirarchy updates | 23780:459282 | ![](img/22044-758840__23780-459282.jpg) | 2 |

제외 섹션: 각 `[Dark]` 짝 22개(22442:219877 · 22442:219992 · 22442:220060 · 22757:90566 · 22779:96157 · 22799:92733 · 22817:95234 · 22933:73827 · 22934:918068 · 22913:1055353 · 23029:155487 · 25763:1328488 · 25800:1339438 · 22980:318743 · 22980:319212 · 22989:125318 · 23029:155682 · 25748:1348556 · 25790:1333757 · 25807:1338739 · 26382:789187 · 22989:146382 — 웹·모바일·앱 합산), `Support / QA / Dark`(22442:218663). `Support / QA / Light`(22442:218631)는 Components 캡처 안에 포함.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| S1 Guest | 22442:219455 · 22956:82157 · 22966:305790 | Web·mWeb·mAPP | 새 상세(현 MAX1216): 로고·별점 4.0(23)·77% Total Savings·부스트 칩·Taker/Maker·Fee stage 3행(Without TetherMax 취소선 / After discount / After cashback)·`Pay only $3…` 안내·Sign Up / Link UID → 탭(Structure/Guide/User Data/Policy) → How much you get back(How this works, 거래량 슬라이더, $18.49 Effective fee) → Where your cashback comes from(3단계) → Recent Average Cashback → March Top Earners → Ongoing Events → 가이드 카드 → Terms & Conditions → Global Reviews |
| S2 Member, UID not linked | 22442:219812 · 22956:82158 | Web·mWeb | 리뷰 영역 `Link UID` 버튼, 가이드 카드 「KYC verification is your next step」 |
| S3 Linked, no review yet | 22442:219818 · 22956:83609 | Web·mWeb | 리뷰 `Write a review` 버튼, 가이드 카드 「Stuck on KYC verification?」 |
| S4 Linked, already posted | 22442:219824 | Web | 숨김 — `retired 2026-09-02, duplicate` |
| S5 Write modal — empty / S10 filled / S14 confirm / S15 success / S18 photos uploading | 22442:219849 · 22442:219860 · 22544:42203 · 22544:173298 · 22544:174537 | Web | 리뷰 작성 모달 단계(모바일은 Write sheet) |
| S6 Empty — 0 reviews | 22442:219830 | Web | 리뷰 0건 빈 상태 |
| S7 Loading | 22442:219836 | Web | 리뷰 스켈레톤 |
| S8 Post failed / S9 List failed | 22442:219842 · 22442:219848 | Web | 리뷰 등록·목록 오류 |
| S11 Sort — Oldest / S12 Most useful | 22442:219866 · 22442:219872 | Web | 정렬 |
| S13 Review written, with review | 22493:292283 | Web | 내 리뷰 고정 표시 |
| S16 Delete confirm | 22544:179308 | Web | 삭제 확인 다이얼로그 |
| S17 Rate limit toast / S23 Unsupported file format toast / S24 Burst guard toast / S25 Reaction toast | 22544:180444 · 22734:88031 · 22734:88041 · 22734:302345 | Web | 토스트(S24·S25 Web 화면은 숨김, 라벨만) |
| S19 Events popover / S20 Savings popover / S22 Fee compare popover | 22544:181576 · 22544:181963 · 23327:1130802 | Web | 이벤트·절감 칩·수수료 비교 팝오버 |
| S21 How this works modal | 22544:808136 | Web | 「How your cashback is worked out」 계산 설명 모달 |
| CMT-07 UID review prompt / CMT-13 Review coupon row | 22734:88049 · 22734:88087 | Web | UID 연동 화면용 리뷰 유도 블록·쿠폰 행 |
| A1~A25 | 22966:305790 외 | mAPP | S 계열과 같은 상태의 앱판(작성은 시트) |
| CMT-02 Permalink (Default/Deleted/Not found) | 22442:219957 내 | Web·mWeb | 리뷰 단건 페이지 |
| CMT-03 Tag archive (Default/Empty/Paginated) | 22442:220028 내 | Web·mWeb | 태그별 리뷰 목록 |
| CMT-06 R1 Signed out / R2 Not yet earned / R3 Earned, not claimed / R4 Earned and claimed | 25748:175076 외 | Web·mWeb | 리뷰 보상(+2 USDT) 안내 페이지 |
| CMT-12 Post-withdrawal review prompt | 22779:932793 | Web | 출금 직후 모달 「How was Bybit?」 +2 USDT, Later / Write a review |
| CMT-08 Exchange list — table / cards | 22799:96486 · 22807:98684 | Web | 목록에 Rating 열, 상위 2행 외곽선 하이라이트(Bitget × TetherMax / Promoted) |
| CMT-08 Exchange list mobile | 26382:789181 | mWeb | 카드형 목록 + 리뷰 별점 |
| CMT-09 Nickname card/sheet | 22817:95233 내 | mWeb | 마이페이지 닉네임 설정 7상태 |
| CMT-05 Write gate — signed out / no UID linked | 22919:73787 내 | Web | 「Log in or sign up to write a review」·「Link your exchange UID to write a review」 다이얼로그 |
| CMT-05 Inline messages | 22934:77485 | Web | 입력 오류 문구 8종(MUI FormHelperText) |
| Blog page | 23029:155486 · 23029:155681 | Web·mWeb | 블로그 글 본문 |
| UID detail U3 Linked, no reviews yet | 25867:1349190 · 25867:1351184 | Web·mWeb | 기존 UID 상세 + 상단 리뷰 프롬프트 「How was Bitget? … Write a review, get 2 USDT」 |
| UID detail U4 Linked, reviewed another exchange | 25867:1349687 · 25867:1351427 | Web·mWeb | 같은 페이지, 보상 없는 「Share your Bitget experience」 |
| UID detail U1·U2·U5 | 25763:1326127 · 25763:1326986 · 25780:1328918 | Web·mWeb | 숨김 — `superseded 2026-09-29: redesign not needed, existing page + review prompt used` |
| Sign-up guide G1~G5 | 25800:1336401 · 25807:1336556 내 | Web·mWeb | Bitget sign-up guide 5단계 페이저(How do I sign up? → After signing up → KYC·ID check → Camera capture → Confirmation, end → Link your UID) |
| Sign-up guide: step with 2+ parts | 26007:1563218 | mWeb | 한 단계에 이미지 여러 장일 때(2026-09-30) |
| Guided flows 1~6 | 22552:59524 외 | Web | 리뷰 작성 시연 흐름 |
| Whats updated: Prototype / Our version ×2 / New Modals / Live | 22044:759624 · 22442:173513 · 22044:759634 | Web | 상세 개편 비교 + Changes 01~08 + Meeting Notes |
| Improvement after meeting | 23242:162347 · 23305:163229 · 23283:437118 · 23286:166500 · 23312:168905 · 23375:172463 | Web·mWeb | Top area 리서치·TLDR·live vs new 비교·모바일 343 대안·Fee compare popover 대안·Promoted placement |

Meeting Notes(22044:759623 내) 핵심: ① Discussion/Review 영역은 보류(Suspended for now, 개정 PRD 확정까지 손대지 않음) ② 최소 글자 12px ③ MUI 토큰 기준 ④ Inter 대신 Wanted Sans ⑤ 거래소명·절감 수치 키움 ⑥ 부스트 이벤트 노출 ⑦ 인플루언서 비교를 주 구조로 쓰지 않음 ⑧ `Start Tour`는 페이지 이동 없음.

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|---|---|
| 거래소 상세 전체 | Prototype(참고 캡처) | Whats updated | 22044:759624 | — | Matthew 프로토타입 | **MAX1216 S1~S3(리뷰 제외 부분)** — Changes 01~08·Meeting Notes가 반영된 최신, Web·mWeb·mAPP 전 상태 존재. 단 리뷰 영역 보류 → **사용자 확인 필요 #2** |
| | Our version | Whats updated | 22442:173513 | — | 개편안 | |
| | Live | Whats updated | 22044:759634 | — | 운영 중 화면 캡처 | |
| | S1~S25 | Review — Web/Mobile/App | 22442:219455 외 | 2026-09 | 리뷰 포함 전 상태 | |
| UID 상세 | U1~U5 재설계 | UID detail | 25763:1326127 외 | — | 새 레이아웃 | **U3·U4(기존 페이지 + 프롬프트)** — U1·U2·U5에 `superseded 2026-09-29` 명시 |
| 거래소 목록 | CMT-08 table / cards / mobile | Exchange list | 22799:96486 · 22807:98684 · 26382:789181 | — | Rating 열·하이라이트 외곽선 | 판 비교 #4 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 로딩/스켈레톤 S7 Loading · `Reviews / Section / loading` | MAX 1216 | 22442:219836 · 22442:218081 | ![](img/22044-758840__22913-1055440.jpg) |
| 빈 상태 S6 Empty — 0 reviews · `Reviews / Section / empty` | MAX 1216 | 22442:219830 · 22442:218055 | 같음 |
| 인라인 오류 S8 Post failed · S9 List failed (`errorPost`·`errorList`) | MAX 1216 | 22442:219842 · 22442:219848 | 같음 |
| 토스트 `Reviews / Delete limit toast`·`Unsupported file toast`·`Burst guard toast (CMT-11)`·`Reaction toast`·`File too large toast`·`Photo removed toast` | MAX 1216 | 22442:219187 · 22705:86727 · 22719:87945 · 22719:298749 · 23094:1003828 · 23094:1003843 | ![](img/22044-758840__22442-217903.jpg) |
| 다이얼로그 `Reviews / Delete confirm`(Web 440 / mobile 343) | MAX 1216 | 22493:290208 · 22985:102966 | 같음 |
| 다이얼로그 Write gate(로그인/UID 연동 요구) | MAX 1216 | 22914:73861 · 22985:102984 | ![](img/22044-758840__22919-73787.jpg) |
| 모달 `How this works`(Web 560 / mobile 343) | MAX 1216 | 22468:39428 · 22985:103042 | ![](img/22044-758840__22442-217903.jpg) |
| 팝오버 events · total savings · fee compare | MAX 1216 | 22468:39427 · 22468:39429 · 23337:166722 | 같음 |
| 바텀시트 `Reviews / Write sheet / mobile 375` | MAX 1216 | 22984:103131 | 같음 |
| 인라인 메시지(FormHelperText 8종) | MAX 1216 | 22934:77485 | ![](img/22044-758840__22934-77485.jpg) |
| 모달 CMT-12 Post-withdrawal review prompt | MAX 1216 | 22779:96158 | ![](img/22044-758840__22779-96156.jpg) |
| 배지/칩 부스트 칩·별점·`Ongoing`·`Active Users` | MAX 1216 | 22956:82157 내 | ![](img/22044-758840__22913-1055440.jpg) |

---

## 3. Exchange Detail Page top area (Hailey's Design) (25978:811)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| 시안 A | 25978:868 | ![](img/25978-811__25978-868.jpg) | 2 |
| 시안 A - 수정 | 25978:1003 | ![](img/25978-811__25978-1003.jpg) | 2 |
| 시안 A - 수정 2 | 25978:1138 | ![](img/25978-811__25978-1138.jpg) | 2 |
| 시안 A - 수정 3 | 25978:1407 | ![](img/25978-811__25978-1407.jpg) | 2 |
| 시안 B | 25978:1273 | ![](img/25978-811__25978-1273.jpg) | 2 |

제외 섹션: 없음. 시안마다 안에 `signal / events`·`signal / cashback rate`(superseded by Signal chip 1311:49426)와 `old bare 3`·`old bare 55%`(superseded) 프레임이 있음.

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| 시안 A | 25978:868 | Web·mWeb | 2카드: 왼쪽(Taker/Maker 탭·로고·Bitget·칩 `3 events`·`55% boosted cashback`·77%·Total Savings) / 오른쪽(Fee stage 표·안내·`Sign up for Bitget ↗`·`Already have a Bitget account?` 세로) + 하늘색 `Need help? Learn more! Start tour` |
| 시안 A - 수정 | 25978:1003 | Web·mWeb | 칩이 채움형(하늘·주황), Taker/Maker가 오른쪽 카드 위로, 도움 바 진한 파랑 |
| 시안 A - 수정 2 | 25978:1138 | Web·mWeb | 칩을 Total Savings 설명 아래로 이동, 거래소명 크게 |
| 시안 A - 수정 3 | 25978:1407 | Web·mWeb | 한 카드 2열, 버튼을 카드 하단 가로 2개(외곽 `Already have a Bitget account?` 왼쪽, 채움 `Sign up for Bitget ↗` 오른쪽) |
| 시안 B | 25978:1273 | Web·mWeb | 오른쪽 수수료 영역을 연한 파랑 박스로, 단계 번호 채움 원, 보조 버튼을 텍스트 링크로 |

### 판이 여러 개인 화면

| 화면 | 판 | 노드 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|
| 상세 상단 영역 | 시안 A / A-수정 / A-수정2 / A-수정3 / B | 25978:868 · 1003 · 1138 · 1407 · 1273 | 위 표 | **사용자 확인 필요 #1** — 날짜·채택 표시 없음. 「수정 3」이 번호상 마지막. MAX1216 S1 상단(별점 포함)과도 다름 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 배지/칩 `3 events`(외곽·채움) · `55% boosted cashback`(외곽·채움) | Hailey | 25978:868 · 25978:1003 | ![](img/25978-811__25978-1003.jpg) |
| 정보 바 `Need help? Learn more! Start tour` | Hailey | 25978:868 | ![](img/25978-811__25978-868.jpg) |

---

## 4. [MAXOP-692] Exchange List font sizes (22598:410643)

### 섹션

이 페이지는 section 없이 프레임 3개로 구성되어 있어 프레임 단위로 캡처했습니다.

| 섹션(프레임) | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| 10. MAXOP-692 — Exchange List font sizes, audit and fix spec | 22598:410669 | ![](img/22598-410643__22598-410669.jpg) | 0 (문서) |
| Figma (Updated) — `Web` 인스턴스 | 22649:1010 | ![](img/22598-410643__22649-1010.jpg) | 1 |
| Live Site — image 579 | 22598:411381 | ![](img/22598-410643__22598-411381.jpg) | 1 |

제외: 원본 심볼 `Web`(22598:410917, 22649:1010이 그 인스턴스).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| 감사·수정 명세 | 22598:410669 | 문서 | 2026-09-03 `/en/affiliated` 실측: Bold 20px 미만 금지, 12px 미만 금지, 수치는 `-nums` 변형. 15건 수정 표(ExchangeList_Item 15/700→body1 semi 16 등) + 인수 조건 4개 |
| Figma (Updated) | 22649:1010 | Web | 구 GNB(Exchanges/Events/Benefits/Cashback Preview/Point) 목록: Bitget KOT 배너·Top Partner Exchanges·All Partner Exchanges 표 |
| Live Site | 22598:411381 | Web | 운영 화면 캡처: 새 GNB(`Cashback ▾`·`Rewards Hub ▾`·`Discover ▾`), WOO X PRO 배너, `Top Popular Exchanges`, 상위 2행 색 하이라이트(초록·노랑) |

### 판이 여러 개인 화면

| 화면 | 판 | 노드 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|
| 거래소 목록(Web) | Figma (Updated) vs Live Site | 22649:1010 · 22598:411381 | GNB 구성·섹션 제목(Top Partner vs Top Popular)·하이라이트 색 | **Live Site가 운영 실물**(2026-09-03 실측). 다만 Figma 원본은 구 GNB로 남아 있음 — 판 비교 #4 |

### 상태 컴포넌트

해당 없음(타이포 명세 페이지).

---

## 5. [MAX-146] Cashback Calculator (3565:13728)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb | 5123:31759 | ![](img/3565-13728__5123-31759.jpg) | 6 |
| mWeb (내용은 다크) | 8135:170235 | ![](img/3565-13728__8135-170235.jpg) | 6 |
| Web | 6510:89547 | ![](img/3565-13728__6510-89547.jpg) | 6 |
| display huge values | 7148:138923 | ![](img/3565-13728__7148-138923.jpg) | 3 |
| Prototype | 7260:76210 | ![](img/3565-13728__7260-76210.jpg) | 1 |
| MAXOP-405 | 17996:179540 | ![](img/3565-13728__17996-179540.jpg) | 3 |
| To be discussed | 9903:204324 | ![](img/3565-13728__9903-204324.jpg) | 2 |

제외 섹션: 없음(8135:170235는 다크 내용이지만 이름이 mWeb이라 캡처함 — 사용자 확인 필요 #12).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| 1 시작 | 5123:31759 내 | mWeb | 「You're paying too many fees.」 금고 이미지·Did you know?·`Start Cashback Preview` |
| 2 거래소 선택 | 같음 | mWeb | 「First, which exchange do you use most?」 3열 그리드·Back/Next |
| 3 거래 프로필 | 같음 | mWeb | 레버리지·잔고·Order Type Ratio 슬라이더, 거래 빈도 카드(Rarely~All Day), `Check Results` 비활성 |
| 정보 시트 | 같음 | mWeb | What is leverage? / What is current trading balance? / Order Type Ratio 바텀시트 |
| 4 로딩 | 같음 | mWeb | 「You might be surprised…」(Pending animation from Khoa) |
| 5 결과 | 같음 | mWeb | 「What you're missing out on」 +4.70 vs -4.70, How we calculated this?(펼침), Next |
| 6 요약 | 같음 | mWeb | 「You're all set. Here's your summary.」 Payout Details, `Start Bitget Cashback ↗` |
| Web 1~6 | 6510:89547 | Web | 같은 흐름 Web판 + 툴팁 hover 메모 |
| display huge values | 7148:138923 | mWeb | 결과 금액 +4.70 / +7,500.00 / +2,677,500.00 |
| Prototype | 7260:76210 | mWeb | 거래 프로필 + 레버리지 시트 |
| MAXOP-405 | 17996:179540 | mWeb·Web | 거래소 선택 4열(mWeb)·5열(Web), 라벨 아래로, Flipster 추가 |
| To be discussed | 9903:204324 | Web | 외부 레퍼런스(Zoom·Vapi·Salesforce·Duolingo) + 거래소 선택 옵션 1·2 |

### 판이 여러 개인 화면

| 화면 | 판 | 노드 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|
| 거래소 선택 단계 | 기본(3열 + Cashback %) | 5123:31759 내 | 거래소별 `54% Cashback` 표기 | **MAXOP-405** — 번호 붙은 후속 판, Flipster 추가 |
| | MAXOP-405 | 17996:179540 | 4열/5열, %표기 없음 | |
| | To be discussed 옵션 1·2 | 9903:204324 | 6열 Web | 논의용 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 바텀시트(정보) What is leverage? 외 2 | MAX-146 | 5123:31759 내 | ![](img/3565-13728__5123-31759.jpg) |
| 로딩 「You might be surprised…」 | MAX-146 | 5123:31759 내 | 같음 |
| 비활성 버튼 `Check Results` | MAX-146 | 5123:31759 내 | 같음 |
| 선택 카드(거래 빈도 선택됨 외곽선) | MAX-146 | 5123:31759 내 | 같음 |

---

## 6. [MAX-30] Link UID (8013:42844)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mobileWeb & App › Link UID lightMode | 9287:170253 | ![](img/8013-42844__9287-170253.jpg) | 25 |
| Web › Link UID lightMode | 9287:180087 | ![](img/8013-42844__9287-180087.jpg) | 11 |
| mobileAPP | 9287:185443 | ![](img/8013-42844__9287-185443.jpg) | 2 |
| Updated 18 May (다이얼로그 8종) | 11100:113522 | ![](img/8013-42844__11100-113522.jpg) | 0 (다이얼로그 8) |
| Updated 18 May (Web 드롭다운) | 11100:117003 | ![](img/8013-42844__11100-117003.jpg) | 1 |
| To update as of 3rd June | 13992:388782 | ![](img/8013-42844__13992-388782.jpg) | 1 |
| MAXOP-751 › Light | 25960:1342565 | ![](img/8013-42844__25960-1342565.jpg) | 27 |
| MAXOP-751 › `UID link result / Splash / mWeb 375`(컴포넌트 세트) | 25960:1342528 | ![](img/8013-42844__25960-1342528.jpg) | 12 |
| Group 6090(제목 보드) | 7993:136165 | ![](img/8013-42844__7993-136165.jpg) | 0 |

제외 섹션: `Link UID darkMode` 2개(9287:170254 · 9287:185482), MAXOP-751 `Dark`(25960:1343173).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| Link Exchange Flow | 9105:188079 · 9105:188464 · 9105:188659 · 9105:188792 · 9105:189066 | mWeb·mAPP | 「Link your exchange UID」 페이지: 거래소 선택·UID 입력·Steps to link UID 이미지 → 입력(키보드) → Next 활성 → 퍼즐 캡차 → Verification Success |
| Successful Modal | 22924:231329 | mWeb | 다이얼로그 「UID Link Completed / Linked successfully.」 `Back to Home` |
| Successful verification | 9733:177641 | mWeb | 홈 이동 + 토스트 `UID added successfully` |
| When there is more than 1 screenshot > display carousel dots | 9622:145758 | mWeb | 안내 이미지 캐러셀 점 |
| Vertical Scroll | 9622:147002 | mWeb | 안내 문단 스크롤 |
| Select Exchange Bottom Sheet: Default / Top Partner Exchange - Selected / All Exchange - Selected / No results found / Multiple results found / 1 result found | 9105:193204 · 9105:193869 · 9105:194509 · 9105:194510 · 9105:194538 · 9105:194735 | mWeb | 거래소 선택 시트(검색·Top Partner 4개·All Exchanges (19) 그리드) |
| Failed UID link scenarios ×8 | 9105:191132 · 9105:191459 · 9105:191735 · 9105:192023 · 9105:192305 · 9105:192548 · 9105:192776 · 22924:231330 | mWeb | 다이얼로그: Verification Limit Reached / Unable to Link UID(Contact Support) / Unable to Link UID Yet(Withdraw) / Unable to Link UID(레퍼럴 아님) / UID Already in Use(Verify Ownership) / You've Already Added This UID / You've reached your UID limit(Manage UIDs·Cancel) / Processing Your UID |
| Withdraw Cashback → 출금 완료 | 9733:176367 · 9733:176701 | mWeb | Unable to Link UID Yet → Withdraw → 확인 다이얼로그 → 토스트 `Withdrawal request completed` |
| Web Link UID 모달 | 9105:196091 · 9287:185462 외 | Web | 홈 위 모달: 입력 → 캡차 → 성공(Auto Direct to homepage) → 홈 토스트 `UID added successfully`, 드롭다운(체크 표시), 검색 결과 없음/있음, Verification Limit Reached |
| mobileAPP | 9287:185360 · 9287:185361 | mAPP | 입력 첫 화면 라이트·다크 |
| Updated 18 May 다이얼로그 | 11100:113522 | 공통 | 8종 문구 개정: `UID Already in Use` 버튼 `Ownership Verify`, `Withdraw Cashback`(Are you sure… / Withdraw·Cancel) 추가 |
| Updated 18 May Web | 11100:114272 · 11100:114535 | Web | 드롭다운 안에 검색 + Top Partner Exchanges 4칸 + 목록 |
| To update as of 3rd June | 13992:388676 | mWeb | `You've reached your UID limit` 다이얼로그(Manage UIDs / Cancel) |
| MAXOP-751 Splash mWeb ×9 | 27827:216063 · 25963:13554 · 25963:13630 · 25963:13706 · 25963:13769 · 25963:13832 · 25963:13895 · 25963:13971 · 25963:14034 | mWeb | 결과를 전체 화면으로: 아이콘 원(성공 초록·오류 빨강·경고 주황·정보 파랑) + 제목 + 설명 + 하단 버튼 + `Need help? Contact Support` |
| MAXOP-751 Splash App ×9 | 25963:710540 외 | mAPP | 같은 9종, 주소창 없음 |
| MAXOP-751 Splash Desktop ×9 | 25963:711132 외 | Web | 1440 전체 화면, 버튼 가운데 |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|---|---|
| 연동 결과(성공·실패) | 다이얼로그 원판 | Link UID lightMode | 9105:191132 외 · 22924:231329 | — | 입력 화면 위 다이얼로그 | **MAXOP-751 스플래시** — 날짜 2026-09-30로 가장 늦고, DEX(revision)가 `UID link result / Splash / mWeb 375`를 16회 인스턴스로 씀. 단 사용자 확인 #9·#10 |
| | 18 May 개정 | Updated 18 May | 11100:113522 | 18 May | 버튼 문구 개정 | |
| | 3 June UID limit | To update as of 3rd June | 13992:388676 | 3 June | Manage UIDs/Cancel | |
| | MAXOP-751 스플래시 | MAXOP-751 | 25960:1342528 · 25960:1342565 | 2026-09-30 | 전체 화면, mWeb/App/Desktop × 9종 | |
| 거래소 선택 | 바텀시트(mWeb) | Link UID lightMode | 9105:193204 외 | — | 그리드 시트 | mWeb은 바텀시트 단일 판 |
| | Web 드롭다운 원판 | Web | 9287:185463 외 | — | 단순 목록 + 체크 | **18 May 판**(Top Partner 4칸 + 목록) — 날짜가 늦음 |
| | Web 드롭다운 18 May | Updated 18 May | 11100:114272 | 18 May | 검색 + Top Partner + 목록 | |
| 성공 피드백 | 다이얼로그 + 홈 토스트 | Link UID lightMode | 22924:231329 · 9733:177641 | — | `UID Link Completed` 다이얼로그 → 홈 토스트 | MAXOP-751 `UID Link Completed` 스플래시 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 토스트(성공) `UID added successfully` | MAX-30 | 9733:179205 | ![](img/8013-42844__9287-170253.jpg) |
| 토스트(성공) `Withdrawal request completed` | MAX-30 | 9733:176856 | 같음 |
| 다이얼로그 실패 8종(원판) | MAX-30 | 9105:191132 외 | 같음 |
| 다이얼로그 8종(18 May 개정) | MAX-30 | 11100:113522 | ![](img/8013-42844__11100-113522.jpg) |
| 전체 화면 결과(Severity=Success/Error/Warning/Info × Platform=mWeb/App/Desktop) | MAX-30 | 25960:1342528 | ![](img/8013-42844__25960-1342528.jpg) |
| 바텀시트 Select Exchange(기본·선택·결과 없음·다수·1건) | MAX-30 | 9105:193204 외 | ![](img/8013-42844__9287-170253.jpg) |
| 캡차(퍼즐) · Verification Success | MAX-30 | 9105:188792 · 9105:189066 | 같음 |
| 비활성 버튼 `Next`(UID 미입력) | MAX-30 | 9105:188079 | 같음 |
| 빈 상태 드롭다운 `No results found for Crypto.com`(Web) | MAX-30 | 9287:180087 내 | ![](img/8013-42844__9287-180087.jpg) |

---

## 7. [MAX-561] Ownership Verification (12474:14170)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb › Ownership Verification - lightMode | 12874:29936 | ![](img/12474-14170__12874-29936.jpg) | 18 |
| mAPP › Ownership Verification - lightMode | 12881:50192 | ![](img/12474-14170__12881-50192.jpg) | 16 |
| Web › Ownership Verification - lightMode | 12881:45015 | ![](img/12474-14170__12881-45015.jpg) | 18 |

제외 섹션: darkMode 3개(12874:29937 · 12881:139002 · 12881:45016), `Idea dump`(12881:45014), `Reference screens`(12874:29935).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| UID already in use | 12874:18663 | mWeb | 다이얼로그 「UID Already in Use」 UID 칩 + `Verify Ownership` + `Try a different UID` + Need help? |
| Ownership cooldown time | 12783:405465 | mWeb | 다이얼로그 「Ownership Claim Unavailable」(30일 후) `Try a different UID` / Close |
| With carousel / Without carousel | 12773:343687 · 12773:345019 | mWeb | Ownership Verification 페이지: 녹화 가이드(Step 1 of 2) + Upload Recording + 안내 2개 + `Submit Claim` 비활성 |
| Loading | 12779:52609 | mWeb | Uploading File(Do not close this window.) |
| Uploaded successfully | 12773:345467 | mWeb | 파일 카드(100MB · Complete) + Submit Claim 활성 |
| Fail scenarios | 12783:397830 · 12881:17759 | mWeb | Upload Failed(OK) / Something Went Wrong(Try again / Contact Support) |
| Confirmation | 12773:347156 | mWeb | 「Submit this claim?」 Average review time ~5 minutes, Submit Claim / Cancel |
| Processing with timer | 12792:2788 | mWeb | 홈 Linked UID 행에 `Ownership verification in progress 06:46` |
| Ownership approved / failed | 12783:402634 · 12783:403053 | mWeb | 결과 다이얼로그(OK) |
| Unlinked and UID claim by others | 12783:404139 | mWeb | 홈 행 경고 「This UID has been unlinked. Tap to verify ownership and reclaim it.」 → 다이얼로그 「Verify Ownership to Reclaim This UID」(Submit UID Ownership / Remove UID) |
| Verification Failed → Modal | 12783:404266 · 13060:144265 | mWeb | 행 오류 「Ownership verification was unsuccessful. View reason.」 → 다이얼로그(Reason provided by backend, Apply for Ownership / Remove UID) |
| Unlinked UID detail / Verification failed detail | 12792:47639 · 12783:405078 | mWeb | UID 상세 판(Reclaim Ownership of Your UID…) — **흐리게 처리** |
| Web 동일 상태 | 12881:45015 내 | Web | 모달 판(가로 버튼 배치) |
| mAPP 동일 상태 | 12881:70012 외 | mAPP | 하단 탭바 포함, Unlinked/Verification failed detail은 정상 표시 |

### 판이 여러 개인 화면

| 화면 | 판 | 노드 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|
| UID Already in Use | MAX-30 원판 / 18 May / MAX-561 / MAXOP-751 | 9105:192023 · 11100:113522 · 12874:18663 · 25963:13832 | 버튼 `Verify Ownership`(원판) → `Ownership Verify`(18 May) → UID 칩 + `Try a different UID` 추가(MAX-561) → 전체 화면, 보조 버튼 없음(MAXOP-751) | 형식은 MAXOP-751, 내용은 MAX-561 — **사용자 확인 필요 #9** |
| 소유권 실패·해제 UID 상세 | mWeb(흐림) / mAPP(정상) | 12792:47639 · 12783:405078 / mAPP 섹션 내 | 같은 화면 표시 여부 | **사용자 확인 필요 #8** |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 로딩 `Uploading File` | MAX-561 | 12779:52609 | ![](img/12474-14170__12874-29936.jpg) |
| 다이얼로그 Upload Failed / Something Went Wrong / Submit this claim? / Complete / Unsuccessful / Reclaim | MAX-561 | 12783:397830 · 12881:17759 · 12773:347156 · 12783:402634 · 12783:403053 · 12783:404139 | 같음 |
| 인라인 알림(행 안 경고·오류·진행 타이머) | MAX-561 | 12792:2788 · 12783:404139 · 12783:404266 | 같음 |
| 정보·경고 박스(`Most claims are reviewed within 5 minutes…` / `Some events may be restricted…`) | MAX-561 | 12773:343687 | 같음 |
| 비활성 버튼 `Submit Claim` | MAX-561 | 12773:345019 | 같음 |

---

## 8. [MAX-18] Withdrawal flow (10 USDT) (8013:42845)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| Group 6091 — 제목 「S3/S4 Withdrawal flow (min.10 USDT)」 | 7993:138420 | ![](img/8013-42845__7993-138420.jpg) | 0 |
| mobileWeb › S3/S4 Withdrawal lightMode | 8873:165905 | ![](img/8013-42845__8873-165905.jpg) | 26 |
| web › Withdrawal lightMode | 9071:142509 | ![](img/8013-42845__9071-142509.jpg) | 20 |
| mobileAPP › Leave a review (APP only) lightMode | 10548:183947 | ![](img/8013-42845__10548-183947.jpg) | 10 |
| mobileAPP › Leave a review (APP only) lightMode(내용은 다크) | 10548:183948 | ![](img/8013-42845__10548-183948.jpg) | 10 |
| for future use (improvements) › Leave a review (APP only) lightMode | 10444:138466 | ![](img/8013-42845__10444-138466.jpg) | 6 |
| Group 6092 — 제목 「S2 Withdrawal flow (min.10 USDT)」 | 9254:162230 | ![](img/8013-42845__9254-162230.jpg) | 0 |
| mobileWeb › S2 Withdrawal lightMode | 9254:156875 | ![](img/8013-42845__9254-156875.jpg) | 11 |
| web › S2 Withdrawal lightMode | 9254:164394 | ![](img/8013-42845__9254-164394.jpg) | 4 |
| Improvement as of 23rd June (UID 상세 개편) | 17000:115844 | ![](img/8013-42845__17000-115844.jpg) | 6 |
| Improvement as of 23rd June (출금 확인 다중 UID) | 17023:235814 | ![](img/8013-42845__17023-235814.jpg) | 10 |
| [MAXOP-761] Share after withdrawal, redesign (2026-10-01) | 26132:29297 | ![](img/8013-42845__26132-29297.jpg) | 4 |

제외 섹션: `Withdrawal darkMode`(8873:165906) · web darkMode(9071:142510) · `for future use` darkMode(10507:113226) · S2 darkMode 2개(9254:159599 · 9254:164395). 10548:183948은 이름이 lightMode이지만 다크 내용(캡처는 함).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| Withdrawal (Withdraw 페이지) | 8873:164829 | mWeb | Total Available Cashback 35.00 USDT + 마일스톤 바 + UID 카드(Bitget·Available·Exchange Cashback/Event Reward) + `Confirm Withdraw` |
| Confirm Withdrawal? | 8873:164420 | mWeb | 다이얼로그(Exchange/UID/Amount, Cancel/Withdraw, 「To change the withdrawal exchange or UID for invitation rewards, please contact support.」) |
| 캡차 → Verification Success | 8873:163663 외 | mWeb | 퍼즐 → 성공 |
| Email Verification(빈/입력) | 8970:179037 외 | mWeb | 6자리 코드·Paste·Verify·Send code again 60 |
| Your withdrawal request was sent | 10444:139415 | mWeb | 결과 페이지(Exchange/UID/Amount/Application Time, Close / Share) |
| Pending | 10444:141294 | mWeb | Withdraw 페이지 UID 카드 `Pending`, 버튼 `Pending` 비활성 |
| You received 23.12 USDT(공유 카드) | 10444:141410 | mWeb | 공유 카드 다이얼로그(Download/Share, 레퍼럴 코드·QR) |
| Explore This Limited-Time Event | 10444:141510 | mWeb | 이벤트 유도 다이얼로그(Close / Learn more) |
| For when user has no referral code yet | 10548:184768 | mWeb | 공유 카드 레퍼럴 코드 없음(Share 비활성) |
| Display toast message when a 24-hour withdrawal restriction is placed on the TUID. | 12085:403390 | mWeb | 토스트 `Please try again after 24 hours.` |
| Resend code when timer runs out | 8873:172393 | mWeb | Resend Code |
| Failed scenarios for email verification (Incorrect email code) | 8970:184346 외 | mWeb | 빨간 테두리 + 토스트 `We're unable to verify you. You have 9 attempts left.` |
| Users registered with google OTP / Failed scenarios for OTP | 8970:179037 · 8970:184533 | mWeb | Google OTP Verification, 토스트 `Invalid code. Please try again.`, `Didn't receive OTP? Verify via email` |
| 0 / 35 / 250 / 1,500 / 12,500 USDT / Final milestone / Scroll past 1st card | 10498:41192 · 10498:41196 · 10498:41194 · 10498:41193 · 10280:144557 · 10548:106422 · 10498:41195 | mWeb | 마일스톤 단계별(0 USDT는 `No UIDs are eligible for withdrawal.` + `Back to Home`, VIP 배지) |
| Web Withdraw 모달 흐름 | 8970:173588 외 | Web | 홈 위 모달: Withdraw → Confirm → 캡차 → 성공 → Please check your email → 결과 → Share/Download link(Copy link) |
| Pending withdrawal / Not eligible to withdraw / 24-hour 토스트 / 12,500 USDT / Withdrawal Completed / When there is more than 2 UIDs | 10501:104627 · 10500:94074 · 10548:105024 · 12936:390597 · 10444:140775 · 12936:389796 | Web | 모달 상태별 |
| S2 UID 상세 → 출금 | 9254:159594 외 | mWeb | Bitget UID 상세(Join TetherMax 배너·Available Cashback 14.00·Total Claimed·Exchange Cashback/Event Reward·Withdrawable 7.00/100.00·마일스톤·Earning Timeline·`Withdraw`) → Confirm → 캡차 → 성공 → `Pending` + 토스트 `Your withdrawal request was sent.` / 실패 토스트 `Something went wrong. Please try again.` / `Minimum withdrawal amount 10 USDT` |
| Non-member 0 / 850 / 12.5K / 75K USDT | 10498:41190 · 10061:200784 · 10498:41191 · 10500:89069 | mWeb | S2 UID 상세 금액별(Top Partner Exchanges·Exclusive For Members 포함) |
| S2 Web | 9254:162234 외 | Web | 같은 흐름 Web |
| Improvement 23rd June — MobileWeb ×4 / Web / MobileAPP | 17000:115172 · 17000:115841 · 17000:116492 · 17000:117172 · 17023:56436 · 17000:117396 | mWeb·Web·mAPP | UID 상세 개편(Cashback Milestone 블록, Web 2열 「My Cashback」), 앱 Withdraw |
| Improvement 23rd June — 출금 확인 | 17023:233630 · 17023:235098 · 17023:235376 · 17023:235667 · 17023:235816 | mWeb | Withdraw 페이지(여러 UID) + Confirm Withdrawal? 다이얼로그에 거래소·UID 목록 + Total Amount, 620px 넘으면 세로 스크롤 |
| Leave a review (APP only) | 10548:183946 외 | mAPP | 「How do you like TetherMax?」 → Not so much / It's great → 피드백 입력 다이얼로그(10자 이상, Send) → Thank You for Your Feedback |
| for future use | 10507:113220 외 | mAPP | 홈 위 바텀시트 별점 5개 → 입력 → 토스트 `Thank you for your feedback!` |
| MAXOP-761 Share card | 27504:29246 · 26133:33095 · 26133:33942 | mWeb·Web | 새 공유 카드(Withdrawal complete 1,250.00 USDT, 거래소 칩, 날짜·UID, QR·Referral code) 다크·라이트, mWeb Download/Share · Web Download/Copy link |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|---|---|
| 출금 화면(S3/S4) | mWeb 페이지 / Web 모달 | S3/S4 · web | 8873:164829 · 8970:173588 | — | mWeb은 페이지, Web은 모달 | 플랫폼 차이(둘 다 현행). DEX(revision)는 자체 `withdraw popup`을 씀(이 페이지 인스턴스 아님) |
| 출금 확인 다이얼로그 | 단일 UID | S3/S4 | 8873:164420 | — | Exchange/UID/Amount 한 줄씩 | **23rd June 판**(다중 UID 목록 + 스크롤 규칙) — 날짜가 늦음. **사용자 확인 필요 #6** |
| | 다중 UID | Improvement 23rd June | 17023:235098 외 | 23 June | 거래소별 UID 목록 + Total Amount | |
| UID 상세(S2) | S2 원판 | S2 Withdrawal | 9254:159594 외 | — | Join TetherMax 배너 + 마일스톤 + Earning Timeline | **23rd June 판** — 섹션 안이 메인 컴포넌트(symbol)이고, MAX 1216 U3(2026-09-29)가 「existing page」로 이 구성을 씀 |
| | 23rd June 개편 | Improvement 23rd June | 17000:115172 외 | 23 June | Cashback Milestone 블록, Web 2열 | |
| | MAX 1216 U3/U4 | UID detail | 25867:1349190 · 25867:1351184 | 2026-09-29 | 위 페이지 + 리뷰 프롬프트 | |
| 출금 후 공유 카드 | old share card | S3/S4 · web | 10444:141410 · 13099:347728 | — | 흰 카드(You received 23.12 USDT) | **MAXOP-761** — 이 페이지 안 old 판 이름에 `superseded MAXOP-761 2026-10-01`, DEX(revision)가 `Share card / Withdrawal` 인스턴스를 씀 |
| | MAXOP-761 | MAXOP-761 | 27504:29246 외 | 2026-10-01 | 새 카드 디자인 | |
| 출금 후 리뷰 요청 | APP 전체 화면 | Leave a review | 10548:183946 외 | — | 앱 평가 + 피드백 | **사용자 확인 필요 #7** |
| | 바텀시트 별점 | for future use | 10507:113220 외 | — | 별점 시트 | 「for future use」 표시 — 미래안 |
| | CMT-12 거래소 리뷰 프롬프트 | MAX 1216 | 22779:932793 | — | 거래소 리뷰 +2 USDT 모달 | 리뷰 영역 보류(사용자 확인 #2)와 연동 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 토스트(오류) `Please try again after 24 hours.` | MAX-18 | 12085:403390 · 10548:105024 | ![](img/8013-42845__8873-165905.jpg) |
| 토스트(오류) `We're unable to verify you. You have 9 attempts left.` | MAX-18 | 8970:184346 | 같음 |
| 토스트(오류) `Invalid code. Please try again.` | MAX-18 | 8970:184533 | 같음 |
| 토스트(성공) `Your withdrawal request was sent.` / (오류) `Something went wrong. Please try again.` | MAX-18 | 9254:156875 내 | ![](img/8013-42845__9254-156875.jpg) |
| 인라인 경고 `Minimum withdrawal amount 10 USDT` · `No UIDs are eligible for withdrawal.` | MAX-18 | 9254:156875 내 · 10498:41192 | 같음 · ![](img/8013-42845__8873-165905.jpg) |
| 인라인 오류(코드 입력 빨간 테두리) | MAX-18 | 8970:184346 | ![](img/8013-42845__8873-165905.jpg) |
| 다이얼로그 Confirm Withdrawal?(단일·다중) | MAX-18 | 8873:164420 · 17023:235098 | ![](img/8013-42845__17023-235814.jpg) |
| 다이얼로그 Email/Google OTP Verification | MAX-18 | 8970:179037 외 | ![](img/8013-42845__8873-165905.jpg) |
| 비활성 버튼 `Pending` · `Confirm Withdraw`(0 USDT) · `Verify` | MAX-18 | 10444:141294 · 10498:41192 | 같음 |
| 배지/칩 UID 카드 `Available`·`Pending`·`Unavailable`, VIP 배지 | MAX-18 | 8873:165905 내 | 같음 |
| 바텀시트 별점 피드백 + 토스트 `Thank you for your feedback!` | MAX-18 | 10507:113220 외 | ![](img/8013-42845__10444-138466.jpg) |

---

## 9. [MAX-601] Cashback Summary (9287:167854)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb › cashback summary - lightMode | 12772:357583 | ![](img/9287-167854__12772-357583.jpg) | 14 |
| mAPP › cashback summary - lightMode | 12773:148316 | ![](img/9287-167854__12773-148316.jpg) | 11 |
| Web › cashback summary - lightMode | 12772:362037 | ![](img/9287-167854__12772-362037.jpg) | 4 |
| MAXOP-732 Monthly total (2026-09-29) › Light | 25886:18957 | ![](img/9287-167854__25886-18957.jpg) | 6 |
| MAXOP-732 › Metrics / Light | 27624:27305 | ![](img/9287-167854__27624-27305.jpg) | 7 |
| (떠 있는 프레임) Frame 1984078537 | 22592:233087 | ![](img/9287-167854__22592-233087.jpg) | 1 |

제외 섹션: darkMode 3개(12772:357584 · 12773:338728 · 12773:35900), MAXOP-732 `Dark`(25886:1340773) · `Metrics / Dark`(27624:27306), QA 보드 `mobile web & PC QA`(14408:495854) · `Mobile App QA`(14504:41318).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| Default | 12772:24573 | mWeb | 필터 3개(All Exchanges/All UIDs/All Cashback Types) + Reset/Search + 월 달력(일자별 +/− 금액) + 선택일 내역(BTC Prediction Reward +50 USDT 등) |
| Select Exchange | 12772:28944 · 12772:337243 | mWeb | 바텀시트(All Exchanges / Bitget (2 UIDs) …) |
| Select UIDs (복수 선택) | 12772:306034 외 | mWeb | 바텀시트 체크박스(You may select more than 1) |
| When there is more than 4 UIDs | 13099:353475 · 13114:110726 | mWeb | 시트 스크롤 |
| Select Cashback Type | 12772:333214 외 | mWeb | All Types / Trading Cashback / Event Reward / Withdrawal |
| Select month | 12772:344403 | mWeb | 연·월 선택 팝업 |
| Large amounts on calendar Thousand (K) and Million (M) | 13074:238814 | mWeb | +12.10K / +150.01M |
| emptyState | 13762:174885 | mWeb | `No cashback activity yet.` |
| Default show total cashback | 12773:333079 | mAPP | 앱 기본 화면(총 캐시백 표시) |
| Web Default / 드롭다운 / 월 선택 / emptyState | 12772:344799 · 12772:348511 · 13074:240358 · 13762:193297 | Web | 좌 필터·우 달력·내역 |
| MAXOP-732 Monthly total (Receipt) | 25886:1340772 · 25887:713885 · 25887:714436 | mWeb·Web·mAPP | 달력 아래 「Monthly total cashback」 Received / Withdrawn / Net 세로 |
| MAXOP-732 empty month | 27200:24437 · 27200:24888 · 27200:25444 | mWeb·Web·mAPP | 「There is no cashback history for this month.」 |
| MAXOP-732 Metrics | 27624:27380 · 27624:28312 · 27624:29433 (+ empty 3) | mWeb·Web·mAPP | 같은 정보를 가로 3칸(Received/Withdrawn/Net) 또는 Net 크게 |
| Frame 1984078537 | 22592:233087 | mWeb | 요약 기본 화면을 큰 글씨로 |

### 판이 여러 개인 화면

| 화면 | 판 | 노드 | 날짜/번호 | 차이 | 현행으로 보이는 판·근거 |
|---|---|---|---|---|---|
| 월 합계 블록 | Receipt | 25886:1340772 외 | MAXOP-732 2026-09-29 | 세로 3줄 | **사용자 확인 필요 #4** — 같은 컴포넌트의 `Layout=Receipt`/`Layout=Metrics` 변형(27624:27307 · 27624:27320). Metrics가 노드 번호상 나중 |
| | Metrics | 27624:27380 외 | 같음 | 가로 3칸 | |
| 요약 기본 화면 | mWeb Default | 12772:24573 | — | 월 합계 없음 | **사용자 확인 필요 #5·#11** |
| | mAPP Default show total cashback | 12773:333079 | — | 총 캐시백 표시 | |
| | Frame 1984078537 | 22592:233087 | — | 큰 글씨 | |

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 빈 상태 `No cashback activity yet.` | MAX-601 | 13762:174885 · 13762:193297 | ![](img/9287-167854__12772-357583.jpg) |
| 빈 상태 `There is no cashback history for this month.` | MAX-601 | 27200:24437 외 | ![](img/9287-167854__25886-18957.jpg) |
| 바텀시트 Select Exchange / Select UIDs / Select Cashback Type | MAX-601 | 12772:28944 · 12772:306034 · 12772:333214 | ![](img/9287-167854__12772-357583.jpg) |
| 월 선택 팝업(Cancel/Ok) | MAX-601 | 12772:344403 | 같음 |
| 비활성 버튼 `Reset` | MAX-601 | 12772:24573 | 같음 |

---

## 10. [MAX-693] Cashback Ranking (13099:348171)

### 섹션

| 섹션 | 노드 | 캡처 | 화면 수 |
|---|---|---|---|
| mWeb › Cashback Ranking - lightMode | 13099:348173 | ![](img/13099-348171__13099-348173.jpg) | 5 |
| mAPP › Cashback Ranking - lightMode | 13099:348181 | ![](img/13099-348171__13099-348181.jpg) | 5 |
| Web › lightMode | 13099:348190 | ![](img/13099-348171__13099-348190.jpg) | 3 |

제외 섹션: darkMode 3개(13099:348174 · 13099:348183 · 13099:348191), `QA`(14631:167507).

### 화면 판정

| 라벨 | 노드 | 플랫폼 | 내용 |
|---|---|---|---|
| 마이페이지 진입 | 13060:149154 | mWeb | 메뉴 카드 Cashback Summary / Invite Friends / Cashback Ranking / My Coupons |
| My Cashback Ranking — 순위 없음 | 13060:149480 | mWeb | `May 2026` 칩, 「Rankings are updated daily at 00:01」, UID별 행 `–` |
| 순위 있음 | 13086:342311 | mWeb | `Previous Month's Rank 1st / 2nd / 3rd` |
| 빈 상태 | 13074:240899 | mWeb | `There are currently no eligible UIDs for ranking.` |
| 많은 UID | 13060:234675 | mWeb | 스크롤 목록 |
| mAPP 동일 + 마이페이지 | 13086:344446 외 · 13099:348182 | mAPP | 앱 마이페이지에 Theme 토글·Language·Terms of Use·Privacy Policy·About Us 추가 |
| Web 오른쪽 패널 | 13074:242317 · 13074:243321 · 13074:244316 | Web | 홈 위 오른쪽 사이드 패널(순위 없음/있음/빈 상태) |

### 판이 여러 개인 화면

없음(플랫폼별 단일 판).

### 상태 컴포넌트

| 종류 | 페이지 | 노드 | 캡처 |
|---|---|---|---|
| 빈 상태 `There are currently no eligible UIDs for ranking.` | MAX-693 | 13074:240899 · 13074:244316 | ![](img/13099-348171__13099-348173.jpg) |
| 배지 `May 2026` 월 칩 | MAX-693 | 13060:149480 | 같음 |
| 사이드 패널(Web 오른쪽 드로어) | MAX-693 | 13074:242317 | ![](img/13099-348171__13099-348190.jpg) |

---

## 판 비교 종합 (거래소 상세 · 연동 · 결과 · 출금 · 요약 · UID 상세)

| # | 화면 | 판(노드) | 현행으로 보이는 판 | 근거 |
|---|---|---|---|---|
| 1 | 거래소 상세 전체 | MAX-22 S1~S4(17170:89361 · 8473:71021 · 8473:76479) → 21st May(13992:430635) → MAX1216 Our version(22442:173513) → MAX1216 S1~S25(22442:219455 외) | MAX1216 S 계열(리뷰 제외) | 2026-09 작업, Meeting Notes 반영. 리뷰 영역은 보류 — 사용자 확인 #2 |
| 2 | 거래소 상세 상단 영역 | MAX1216 S1 상단(별점·77%·칩·Fee stage·Sign Up/Link UID) · Hailey 시안 A/A-수정/A-수정2/A-수정3/B(25978:*) · Improvement after meeting `COMPARE / Top area, live vs new`(23283:437118) · `ALT / Top area — mobile 343`(23286:166500) | 미정 | 사용자 확인 #1 |
| 3 | 상세 하단 CTA | 기본 → 21st May(가로 2버튼·PC 다이얼로그) → MAX1216(Sign Up + Link UID 가로) | MAX1216 | 날짜가 가장 늦음. 상태별(게스트·미연동·연동) 버튼 조합은 MAX-22 S1~S4가 원본 |
| 4 | 거래소 목록 | MAX-22 카드/표 · darker border(23 June) · MAXOP-408 · MAX1216 CMT-08 table/cards/mobile · MAXOP-692 Figma vs Live | 미정 | 운영 실물은 Live(2026-09-03, 새 GNB). 사용자 확인 #3 |
| 5 | 연동 입력(모달/페이지) | mWeb 페이지(9105:188079) · Web 모달(9105:196091) · mAPP(9287:185360) | 플랫폼별 단일 판 | — |
| 6 | 거래소 선택 | mWeb 바텀시트(9105:193204) · Web 드롭다운 원판(9287:185463) → 18 May(11100:114272) | Web은 18 May | 날짜 |
| 7 | 연동 결과 | 다이얼로그 원판(9105:191132 외) → 18 May(11100:113522) → 3 June(13992:388676) → MAXOP-751 스플래시(25960:1342528) | MAXOP-751 | 2026-09-30, DEX(revision) 인스턴스 16회. 사용자 확인 #9·#10 |
| 8 | UID Already in Use | 원판 → 18 May → MAX-561(12874:18663) → MAXOP-751(25963:13832) | 형식 MAXOP-751 + 내용 MAX-561 | 사용자 확인 #9 |
| 9 | 출금 화면 | mWeb 페이지(8873:164829) · Web 모달(8970:173588) · mAPP(17000:117396) | 플랫폼별 | DEX(revision)는 자체 `withdraw popup` |
| 10 | 출금 확인 다이얼로그 | 단일(8873:164420) → 다중 UID(17023:235098) | 다중 UID(23rd June) | 날짜. 사용자 확인 #6 |
| 11 | 출금 후 공유 카드 | old(10444:141410 · 13099:347728) → MAXOP-761(27504:29246) | MAXOP-761 | `superseded MAXOP-761 2026-10-01` 표기 + DEX(revision) 인스턴스 |
| 12 | 출금 후 리뷰 요청 | APP 전체 화면(10548:183946) · 바텀시트(10507:113220, for future use) · CMT-12(22779:932793) | 미정 | 사용자 확인 #7 |
| 13 | 요약 월 합계 | Receipt(25886:1340772) · Metrics(27624:27380) | 미정 | 사용자 확인 #4 |
| 14 | 요약 기본 | mWeb(12772:24573) · mAPP total(12773:333079) · 큰 글씨(22592:233087) | 미정 | 사용자 확인 #5·#11 |
| 15 | UID 상세 | S2 원판(9254:159594) → 23rd June(17000:115172 · 17023:56436) → MAX1216 U3/U4(25867:1349190 · 25867:1351184), U1·U2·U5 폐기 | 23rd June 페이지 + MAX1216 프롬프트 | `superseded 2026-09-29: existing page + review prompt used` |
| 16 | 가입 가이드 | MAX-22 긴 페이지(8471:65568) → 12 May 탭형(10061:179941) → MAX1216 G1~G5(25800:1336401 · 25807:1336556) + 2+ parts(26007:1563218, 2026-09-30) | MAX1216 G1~G5 | 날짜 |
| 17 | 계산기 거래소 선택 | 기본(5123:31759) → MAXOP-405(17996:179540) · To be discussed | MAXOP-405 | 번호 붙은 후속 판 |
| 18 | 소유권 실패·해제 UID 상세 | mWeb 흐림(12792:47639 · 12783:405078) · mAPP 정상 | 미정 | 사용자 확인 #8 |
