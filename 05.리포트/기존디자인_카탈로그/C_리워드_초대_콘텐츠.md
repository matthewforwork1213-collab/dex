# 기존 디자인 카탈로그 — C. 리워드 · 초대 · 콘텐츠

Figma `UI-UX Design`(fileKey `hsa3bSV9QmFTe2jsf6tzTm`) 기존 사용자 화면 12페이지를 섹션 단위로 캡처해 직접 보고 판정한 카탈로그. 캡처는 `img/<pageid>__<sectionid>.jpg`(긴 변 4000 이하, 긴 섹션은 `_p2`·`_p3`로 나눔). 라벨은 캔버스의 보라색 라벨(shape-with-text)·프레임 이름에서 옮김.

## 요약

| 항목 | 값 |
|---|---|
| 페이지 수 | 12 |
| 라이트 섹션 수(캡처 대상) | 131 |
| 캡처 파일 수 | 168 |
| 판이 여러 개인 화면 | 33 |
| 미캡처 섹션 | 21 |

### 「사용자 확인 필요」 목록

1. **Events** — Web Special Events: 기본판(`11184:163371`, Bitget 배너)과 `Updated as of 18 May`(`11169:150668`, BioFin 배너 + 화살표) 중 18 May판을 현행으로 봄. 맞는지.
2. **Benefits** — 캐시백 챌린지 레벨 금액: 같은 `Updated as of 25th May` 이름의 두 판이 5/7/10/15 USDT(`15987:55661`)와 7/10/20/30 USDT(`15987:55664`)로 다름. 어느 쪽이 현행인지.
3. **Benefits / Boost** — Cashback Boost 상세: Benefits `For discussion`(`17351:190450`)·MAX-500 판과 `Boost Improvement` 페이지 중 무엇이 현행인지(Boost Improvement가 대체하는지).
4. **Global League** — Web Summary: 핸드오프(`1058:36620`, 배너 자리표시자) 대신 최상위 단독 Web(`16399:86822`, 실배너·`Unlock rewards`)을 현행으로 봄. 맞는지.
5. **Bingo** — UID 선택 모달 1~3과 404 화면의 시안 A(흰 카드+테두리, 핸들 없음) / 시안 B(회색 카드, 드래그 핸들) 중 채택안.
6. **Invite Friends** — 최상위 단독 `리워드 조회` 4프레임(`15750:78334` 등)과 `MAXOP-236`(`15798:102378`) 보상 내역의 관계(어느 쪽이 현행인지).
7. **Quiz** — 랜딩: `ysy removed`(`27090:1357115`, 사진 제거)를 현행으로 봄. 결과 모달도 엄지 일러스트판이 현행인지.
8. **Email Template** — WOO X PRO 이벤트 메일(`21322:1088`): CTA 메모판(파란 배경) / CTA 반영판(검은 배경) 중 뒤쪽을 현행으로 봄. 맞는지.
9. **Newsletter** — 같은 이름 섹션 세트 두 벌: `23102:*`(symbol 원본) / `24403:*`(instance 복사본, `공지사항`·Empty state 추가). 화면 기준은 24403 세트로 봄. 맞는지.

### 캡처하지 않은(못한) 섹션

- [MAX-502] Email Template › Group 4853 (최상위) (`18781:50141`)
- [MAX-502] Email Template › Group 4854 (최상위) (`19190:1028`)
- [MAX-502] Email Template › Group 4855 (최상위) (`19222:1023`)
- [MAX-502] Email Template › Group 4856 (최상위) (`19222:1024`)
- [MAX-502] Email Template › Group 4857 (최상위) (`19238:1027`)
- [MAX-502] Email Template › Group 4858 (최상위) (`19238:1295`)
- [MAX-502] Email Template › Group 4859 (최상위) (`19368:1087`)
- [MAX-502] Email Template › Group 4860 (최상위) (`19405:1156`)
- [MAX-502] Email Template › Frame (최상위 375x2336) (`19451:1358`)
- [MAX-502] Email Template › Frame (최상위 375x2536) (`19454:1151`)
- [MAX-502] Email Template › Frame (최상위 384x2555) (`21362:1106`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter — Web 1440 [Light] (23102 세트) (`23102:1009752`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter — Mobile 375 [Light] (23102 세트) (`23102:1010435`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter / Components [Light] (24403 세트) (`24403:338662`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter — Overlays [Light] (24403 세트) (`24403:339647`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter / Components / mobile 343 [Light] (24403 세트) (`24403:339706`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter — Verification [Light] (23102 세트 쪽) (`23627:226232`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter / Components / email [Light] (`23102:1010685`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter - Email [Light] (`23102:1010883`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter / Components / email [Light] (24403) (`24403:340289`)
- [MAX-1244] Newsletter Listings, Detailed Page & Email Template › Newsletter - Email [Light] (24403) (`24403:340470`)

### 판정 기준

- 다크·QA 보드·참고(레퍼런스)·폐기 표시 섹션은 존재만 기록하고 화면 판정에서 뺌. 이름이 `Light`/`lightMode`인데 캡처가 다크인 섹션 3곳(`1095:110407`, `13033:28084`, `12565:263286`)은 「다크(이름은 라이트)」로 표시.
- 「현행」 근거: 섹션 이름의 날짜·MAXOP 번호(늦을수록), `PASS`·`Ready for dev` 표시, 같은 화면의 플랫폼·라이트/다크 세트가 갖춰졌는지, 노드 번호(뒤일수록 나중 작업). 근거가 약하면 「사용자 확인 필요」.
- `[MAX-468] Benefits`의 S1/S2(로그인 전)·S3/S4(로그인 후)와 `[MAX-] Bingo`의 단계 × 사용자 상태는 **판이 아니라 상태 구분**이므로 판 표에 넣지 않음.

## [MAX-492] Events Page (`9681:103050`)

이벤트 목록(Special · Exclusive · Exchange 3탭) 화면. 배너 캐러셀 + 탭 + 거래소 드롭다운·유형 칩 + 이벤트 카드(보상·마감 카운트다운·Join Now). 헤더 GNB는 `Exchanges · Events · Benefits · Cashback Preview · Point`.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Events Page › mobileWeb › Events lightMode | `9733:148685` | 라이트 | ![](img/9681-103050__9733-148685.jpg) | 6 | mWeb 목록 6판 + 거래소 선택 바텀시트 2 + 마감 카운트다운 4종 + 거래소별 배너 카드 |
| Events Page › mobileWeb › Events darkMode | `9733:148711` | 다크 — 제외 | — | 7 |  |
| Events Page › Web › Events lightMode | `9733:148738` | 라이트 | ![](img/9681-103050__9733-148738.jpg) | 3 | Web 3탭 + 거래소 드롭다운(기본·선택·Bitget+1) |
| Events Page › Web › Events darkMode | `9733:148763` | 다크 — 제외 | — | 3 |  |
| Events Page › mobileAPP | `9733:148788` | 라이트 | ![](img/9681-103050__9733-148788.jpg) | 2 | 라이트·다크 1쌍(좌 라이트) |
| Events Page › Updated as of 18 May (to add arrow on banner) | `11169:150957` | 라이트 | ![](img/9681-103050__11169-150957.jpg) | 1 | Web Special Events, 배너 BioFin |
| Events Page › interaction | `11366:321171` | 라이트 | ![](img/9681-103050__11366-321171.jpg) | 0 | 배너 hover 화살표·점(dot) 클릭 규칙 |
| To export | `15502:130327` | 라이트 | ![](img/9681-103050__15502-130327.jpg) | 0 | 거래소별 배너 카드·배너 이미지 묶음(화면 아님) |

### 화면 판정

**Events Page › mobileWeb › Events lightMode** (`9733:148685`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| No Events | `9733:148686` | mWeb | mWeb/LP | 이벤트 없음 빈 상태(아이콘+안내 문구) |
| Event Page (All 3 tabs) Special Events (default) | `9733:148707` | mWeb | mWeb/LP | 이벤트 목록 3탭(Special/Exclusive/Exchange), Special 기본 |
| Exchange Events Page | `9733:148708` | mWeb | mWeb/LP | 거래소 이벤트 탭 목록 |
| Event Page (2 tabs - no special events) | `17170:182975` | mWeb | Frame 1984078516 | 이벤트 목록 2탭(스페셜 없음), 거래소 드롭다운·유형 칩 |
| Event Page (1 tab) | `9733:148710` | mWeb | mWeb/LP | 이벤트 목록 탭 1개일 때 |
| When chips exceed the horizontal space, to make it horizonalScroll | `9814:199974` | mWeb | mWeb/LP | 칩·카드가 넘칠 때 가로 스크롤 |

**Events Page › Web › Events lightMode** (`9733:148738`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Special Events | `11184:163371` | Web | Web | 스페셜 이벤트 탭(Web) |
| Exclusive Events | `11184:163863` | Web | Events | 독점 이벤트 탭 + 거래소 드롭다운·유형 칩 |
| Exchange Events | `11184:164531` | Web | Web | 거래소 이벤트 탭 목록 |

**Events Page › mobileAPP** (`9733:148788`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `9733:148789` | mAPP | mWeb/LP | 앱 이벤트 목록(라이트) |
| — | `9733:148790` | mAPP | mWeb/LP | 앱 이벤트 목록(다크) — 같은 프레임 안 다크 |

**Events Page › Updated as of 18 May (to add arrow on banner)** (`11169:150957`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11169:150668` | Web | Web | Web Special Events(BioFin 배너, 배너 화살표 개정) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| Web Special Events | 기본판 | Web › Events lightMode | `11184:163371` | — | 상단 배너 Bitget KOT, 배너 화살표 없음 | 보조 |
| 〃 | 18 May 개정판 | Updated as of 18 May (to add arrow on banner) | `11169:150668` | 18 May | 배너 BioFin, hover 시 좌우 화살표(규칙은 interaction `11366:321171`) | **현행으로 보임** — 섹션 이름에 날짜·개정 목적. 「사용자 확인 필요」 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 빈 상태 | Events | `9733:148686` | `9681-103050__9733-148685.jpg` | No Events Yet(아이콘+2줄 안내) |
| 바텀시트(체크 목록 + Close/Apply) | Events | `9733:148685` 안 Select Exchanges 2판 | `9681-103050__9733-148685.jpg` | 미선택 / 1개 선택 `Apply (1)` |
| 드롭다운(체크 목록, 비활성 Apply) | Events Web | `9733:148738` 오른쪽 | `9681-103050__9733-148738.jpg` | 미선택 시 Apply 비활성, 선택 시 `Apply (2)`, 닫힌 값 `Bitget+1` |
| 배지/칩 | Events | 카운트다운 4종(60초·60분·24시간 미만, 24시간 이상) | `9681-103050__9733-148685.jpg` | 주황 `Ends in` 배지 ↔ 회색 D/H/M/S 칩 |
| 상태 배지 | Events Web | Special 카드 | `9681-103050__11169-150957.jpg` | `Ongoing` 회색 배지 |


## [MAX-468] Benefits Page (`7884:30642`)

혜택 메인(스페셜 혜택 카드 + Ongoing/Completed 리스트)과 혜택 상세(웰컴 기프트·캐시백 미리보기·알림·UID 연동·첫 출금·친구 초대·월간 랭킹 = MAX-468, 캐시백 챌린지 = MAX-503, BTC 맞히기·부스트 = MAX-500). S1/S2 = 로그인 전, S3/S4 = 로그인 후 (판이 아니라 사용자 상태 구분).

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| mWeb › S1/S2 lightMode › MAX-468 | `13992:351956` | 라이트 | ![](img/7884-30642__13992-351956.jpg) | 11 | 로그인 전 혜택 메인·상세 |
| mWeb › S1/S2 lightMode › MAX-503 | `13992:351955` | 라이트 | ![](img/7884-30642__13992-351955.jpg) | 3 | 캐시백 챌린지(로그인 전) |
| mWeb › S1/S2 lightMode › MAX-500 | `13992:351954` | 라이트 | ![](img/7884-30642__13992-351954.jpg) | 6 | BTC 맞히기·부스트(로그인 전) |
| mWeb › S1/S2 darkMode | `13992:351957` | 다크 — 제외 | — | 20 |  |
| mWeb › S3/S4 lightMode › MAX-468 | `13992:356418` | 라이트 | ![](img/7884-30642__13992-356418.jpg) ![](img/7884-30642__13992-356418_p2.jpg) | 40 | 로그인 후 혜택 메인·상세·받기 흐름 |
| mWeb › S3/S4 lightMode › MAX-503 | `13992:356414` | 라이트 | ![](img/7884-30642__13992-356414.jpg) | 15 | 캐시백 챌린지 UID 상태별 |
| mWeb › S3/S4 lightMode › MAX-500 | `13992:356413` | 라이트 | ![](img/7884-30642__13992-356413.jpg) | 6 |  |
| mWeb › S3/S4 darkMode | `13992:356419` | 다크 — 제외 | — | 61 |  |
| mAPP › S3/S4 lightMode › MAX-468 | `13992:366399` | 라이트 | ![](img/7884-30642__13992-366399.jpg) ![](img/7884-30642__13992-366399_p2.jpg) | 32 |  |
| mAPP › S3/S4 lightMode › MAX-500 | `13992:366396` | 라이트 | ![](img/7884-30642__13992-366396.jpg) | 17 | BTC 맞히기 입력·확인·결과 |
| mAPP › S3/S4 lightMode › MAX-503 | `13992:366398` | 라이트 | ![](img/7884-30642__13992-366398.jpg) | 21 | 내부에 `Updated as of 25th May` 2개 포함 |
| mAPP › S3/S4 darkMode | `13992:366400` | 다크 — 제외 | — | 70 |  |
| Web › S1/S2 lightMode › MAX-468 | `13992:338449` | 라이트 | ![](img/7884-30642__13992-338449.jpg) ![](img/7884-30642__13992-338449_p2.jpg) | 11 |  |
| Web › S1/S2 lightMode › MAX-503 | `13992:338448` | 라이트 | ![](img/7884-30642__13992-338448.jpg) | 2 |  |
| Web › S1/S2 lightMode › MAX-500 | `13992:338447` | 라이트 | ![](img/7884-30642__13992-338447.jpg) | 4 |  |
| Web › S1/S2 darkMode | `10954:217819` | 다크 — 제외 | — | 17 |  |
| Web › S3/S4 lightMode › MAX-468 | `13992:342870` | 라이트 | ![](img/7884-30642__13992-342870.jpg) ![](img/7884-30642__13992-342870_p2.jpg) ![](img/7884-30642__13992-342870_p3.jpg) | 33 | 메인 3판(기본·완료 탭·스페셜 3개) + `View Coupons` 버튼 상태 |
| Web › S3/S4 lightMode › MAX-503 | `13992:342866` | 라이트 | ![](img/7884-30642__13992-342866.jpg) | 9 |  |
| Web › S3/S4 lightMode › MAX-500 | `13992:342865` | 라이트 | ![](img/7884-30642__13992-342865.jpg) | 4 |  |
| Web › S3/S4 darkMode | `13992:342871` | 다크 — 제외 | — | 45 |  |
| [MAXOP-412] | `17585:306499` | 라이트 | ![](img/7884-30642__17585-306499.jpg) | 2 | 메인 상단 카드 `View Coupons`·앱 `History` 버튼, 스페셜 카드 3개(부스트 추가) |
| MAXOP-474 | `18111:80081` | 라이트 | ![](img/7884-30642__18111-80081.jpg) ![](img/7884-30642__18111-80081_p2.jpg) | 24 | 상세 하단 CTA를 `Back` + 주 CTA 2버튼으로, 긴 문구는 세로 쌓기 |
| MAXOP-763 Bitcoin Guess text area (revision 2026-09-29) | `25848:60375` | 라이트 | ![](img/7884-30642__25848-60375.jpg) | 2 | BTC 입력 영역 문구 위치 변경 전/후 |
| MAXOP-805 Cashback Ranking messages (revision 2026-09-29) | `25849:1340930` | 라이트 | ![](img/7884-30642__25849-1340930.jpg) | 0 | 랭킹 카드 Before/After(보상 구간·더 거래하기 문구, 다중 UID) |
| MAXOP-763 … [Dark] | `25856:1342571` | 다크 — 제외 | — | 1 |  |
| MAXOP-805 … [Dark] | `25856:1342783` | 다크 — 제외 | — | 0 |  |
| Updated as of 25th May (2094x1536) | `15987:55661` | 라이트 | ![](img/7884-30642__15987-55661.jpg) | 2 | 캐시백 챌린지 5/7/10/15 USDT, 83% 진행 |
| Updated as of 25th May (3278x1536) | `15987:55664` | 라이트 | ![](img/7884-30642__15987-55664.jpg) | 2 | 캐시백 챌린지 7/10/20/30 USDT, 레벨 카드 4종 |
| For discussion | `17351:190450` | 라이트 | ![](img/7884-30642__17351-190450.jpg) | 2 | Cashback Boost 상세 Web 2판 |
| For reference | `13992:366397` | 제외(QA·참고·폐기) | ![](img/7884-30642__13992-366397.jpg) | 4 | 구 한국어 「페이백 챌린지」 화면(참고용). 캡처함 |
| Section 1 | `18110:75889` | 제외(QA·참고·폐기) | ![](img/7884-30642__18110-75889.jpg) | 0 | 타사 혜택 화면 레퍼런스(Mobbin). 캡처함 |
| Frame 1984078607 (최상위) | `16343:377105` | 라이트 | ![](img/7884-30642__16343-377105.jpg) | 1 | 스페셜 혜택 썸네일 4종(Guess BTC·Earn More·Boost·Global League) + 카드 3종 |
| mWeb/allPartnerExchange (최상위) | `10977:56014` | 라이트 | ![](img/7884-30642__10977-56014.jpg) | 2 | 단독 프레임 |
| 페이백 퀘스트 (Web, 최상위) | `15987:55379` | 라이트 | ![](img/7884-30642__15987-55379.jpg) | 1 | 구 한국어 퀘스트 화면 |
| 페이백 퀘스트 (mWeb, 최상위) | `15987:55536` | 라이트 | ![](img/7884-30642__15987-55536.jpg) | 1 | 구 한국어 퀘스트 화면 |
| QA Cashback Challenge for S1 & S2 | `14923:108051` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |
| QA Cashback Challenge for S3 | `14933:53966` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |
| QA Cashback Challenge for S4 | `14933:54068` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |
| QA for Cashback boost & Guess BTC | `15020:394701` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |
| Benefit Page QA | `15516:97192` | 제외(QA·참고·폐기) | — | 1 | QA 보드 |
| 3d asset | `10343:158820` | 제외(QA·참고·폐기) | — | 0 | 3D 이미지 소스 |

### 화면 판정

**mWeb › S1/S2 lightMode › MAX-468** (`13992:351956`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Ongoing tab | `9365:198005` | mWeb | mWeb/allPartnerExchange | 혜택 메인 진행 중 탭(혜택 리스트+CTA) |
| Completed tab | `9365:199934` | mWeb | mWeb/allPartnerExchange | 혜택 메인 완료 탭 |
| You referred to your friend Get up to 10 USDT | `9622:180933` | mWeb | mWeb/allPartnerExchange | 친구 초대 보상(최대 10 USDT) 상세 |
| Invite friends Get extra profits | `9622:104684` | mWeb | mWeb/allPartnerExchange | 친구 초대 혜택 상세(초대 코드·3단계 안내) |
| Turn on alarm Get 1 USDT | `9622:105026` | mWeb | mWeb/allPartnerExchange | 알림 켜기 혜택(+1 USDT) 상세 |
| Calculate est. cashback Get 2 USDT | `9622:109468` | mWeb | mWeb/allPartnerExchange | 캐시백 미리보기 혜택(+2 USDT) 상세 |
| Bind your UID Get 3 USDT | `9622:110779` | mWeb | mWeb/allPartnerExchange | UID 연동 혜택(+3 USDT) 상세 |
| Claim cashback monthly Get up to 100 USDT | `9622:114576` | mWeb | mWeb/allPartnerExchange | 월간 캐시백 랭킹 보상(최대 100 USDT) 상세 |
| Its your 1st time visiting our site Get up to 5 USDT | `9622:116148` | mWeb | mWeb/allPartnerExchange | 웰컴 기프트(최대 5 USDT) 상세 |
| Claim your first cashback Get 10 USDT | `9622:112561` | mWeb | mWeb/allPartnerExchange | 첫 출금 보상(+10 USDT) 상세 |
| More than 2 special benefits card (max 4) | `10790:327979` | mWeb | mWeb/allPartnerExchange | 스페셜 혜택 카드 3개 이상(최대 4) 가로 배치 |

**mWeb › S1/S2 lightMode › MAX-503** (`13992:351955`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Get Cashback Get Extra USDT | `9733:148566` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지(레벨 보상) 상세 |
| Get Cashback Get Extra USDT | `10954:208709` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지(레벨 보상) 상세 |
| Horizontal Scroll | `10739:225323` | mWeb | mWeb/allPartnerExchange | 칩·카드가 넘칠 때 가로 스크롤 |

**mWeb › S1/S2 lightMode › MAX-500** (`13992:351954`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Guess Bitcoin Price Max 1,000 USDT Prize | `10704:241681` | mWeb | mWeb/allPartnerExchange | BTC 가격 맞히기 이벤트 상세(기본) |
| Event Ended | `9998:178653` | mWeb | mWeb/allPartnerExchange | 이벤트 종료 상태 |
| — | `9622:180876` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| — | `9622:180915` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| Cta > Share | `10790:324761` | mWeb | mWeb/allPartnerExchange | 공유 CTA |
| Sign Up for the exchange Get extra cashback | `11100:203371` | mWeb | mWeb/allPartnerExchange | 거래소 가입 추가 캐시백(부스트) 상세 |

**mWeb › S3/S4 lightMode › MAX-468** (`13992:356418`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| You referred to your friend Get up to 10 USDT | `11731:358566` | mWeb | mWeb/allPartnerExchange | 친구 초대 보상(최대 10 USDT) 상세 |
| Completed | `10739:232646` | mWeb | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Invite friends Get extra profits | `10739:232634` | mWeb | mWeb/allPartnerExchange | 친구 초대 혜택 상세(초대 코드·3단계 안내) |
| Invite friends Enter before invitation code issuance | `12340:51395` | mWeb | mWeb/allPartnerExchange | 친구 초대 상세, 초대 코드 발급 전 |
| Copy invite | `10739:232633` | mWeb | mWeb/allPartnerExchange | 초대 코드 복사 토스트 |
| Toast when issuing invitation code | `12340:51396` | mWeb | mWeb/allPartnerExchange | 초대 코드 발급 토스트 |
| Calculate est. cashback Get 2 USDT | `11731:356147` | mWeb | mWeb/allPartnerExchange | 캐시백 미리보기 혜택(+2 USDT) 상세 |
| Claim 2 USDT | `10739:232640` | mWeb | mWeb/allPartnerExchange | 캐시백 미리보기 혜택 받기(2 USDT)·완료 토스트 |
| Cashback Preview flow / Claim 2 USDT | `10739:232639` | mWeb | mWeb/allPartnerExchange | 캐시백 미리보기 흐름 연결 |
| Claim 2 USDT | `15170:174208` | mWeb | mWeb/allPartnerExchange | 캐시백 미리보기 혜택 받기(2 USDT)·완료 토스트 |
| Completed | `10739:232638` | mWeb | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Link your UID Get 3 USDT | `11731:356403` | mWeb | mWeb/allPartnerExchange | UID 연동 혜택(+3 USDT) 상세 |
| Receive coupon Completed | `10739:232642` | mWeb | mWeb/allPartnerExchange | UID 연동 혜택 쿠폰 받기 완료 |
| Claim 3 USDT | `11546:131473` | mWeb | mWeb/allPartnerExchange | UID 연동 혜택 받기(3 USDT)·완료 토스트 |
| Claim 3 USDT | `11546:132500` | mWeb | mWeb/allPartnerExchange | UID 연동 혜택 받기(3 USDT)·완료 토스트 |
| Link UID flow / Claim 3 USDT | `11546:132501` | mWeb | mWeb/allPartnerExchange | UID 연동 흐름 연결 |
| For when user has not linked any UID post-login / Claim cashback monthly Get up to 100 USD | `11731:355965` | mWeb | mWeb/allPartnerExchange | 월간 랭킹 혜택, 로그인·UID 미연동(Link UID CTA) |
| If user does not qualify in the ranks (1 UID) | `10730:183393` | mWeb | mWeb/allPartnerExchange | 랭킹 미진입(UID 1개) |
| If user get 1st place | `25418:256948` | mWeb | Frame 1984078624 | 랭킹 1위 달성 |
| Its your 1st time visiting our site Get up to 5 USDT | `10739:232636` | mWeb | mWeb/allPartnerExchange | 웰컴 기프트(최대 5 USDT) 상세 |
| Claim 5 USDT | `11446:257707` | mWeb | mWeb/allPartnerExchange | 웰컴 기프트 쿠폰 뽑기·받기 |
| — | `11446:257848` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| Claim 5 USDT | `11446:257895` | mWeb | Backdrop | 웰컴 기프트 쿠폰 뽑기·받기 |
| — | `11529:129466` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| Claim 5 USDT | `11529:129513` | mWeb | Backdrop | 웰컴 기프트 쿠폰 뽑기·받기 |
| Completed | `10739:232635` | mWeb | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Withdraw flow / For when user has not linked any UID post-login | `11446:138576` | mWeb | mWeb/allPartnerExchange | 첫 출금 보상, UID 미연동 시(Link UID) |
| Claim 10 USDT | `11731:355753` | mWeb | mWeb/allPartnerExchange | 첫 출금 보상 받기(10 USDT)·완료 토스트 |
| Claim 10 USDT | `10739:232645` | mWeb | mWeb/allPartnerExchange | 첫 출금 보상 받기(10 USDT)·완료 토스트 |
| Completed | `10739:232644` | mWeb | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Claim 5 USDT | `10739:232637` | mWeb | mWeb/allPartnerExchange | 웰컴 기프트 쿠폰 뽑기·받기 |
| Turn on alarm Get 1 USDT | `10739:232641` | mWeb | mWeb/allPartnerExchange | 알림 켜기 혜택(+1 USDT) 상세 |
| Draw Coupon flow | `10978:58110` | mWeb | mWeb/allPartnerExchange | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| Draw Coupon flow | `10978:68273` | mWeb | mWeb/allPartnerExchange | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| — | `11100:99830` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| Draw Coupon flow | `11100:99877` | mWeb | Backdrop | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| Completed benefits | `11903:362068` | mWeb | mWeb/allPartnerExchange | 완료 탭 완료 혜택 목록(View) |
| Ongoing tab | `17170:172813` | mWeb | Frame 1984078611 | 혜택 메인 진행 중 탭(혜택 리스트+CTA) |
| Completed tab | `11100:221304` | mWeb | mWeb/allPartnerExchange | 혜택 메인 완료 탭 |
| More than 2 special benefits card (max 4) | `11100:221305` | mWeb | mWeb/allPartnerExchange | 스페셜 혜택 카드 3개 이상(최대 4) 가로 배치 |

**mWeb › S3/S4 lightMode › MAX-503** (`13992:356414`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| When user has linked UID | `11546:144939` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `11546:144938` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10981:80098` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| Completed and claimed | `10981:80498` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지 완료·수령 |
| When user has linked UID | `10981:80099` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10981:80100` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| Get Cashback Get Extra USDT / When user has not linked any UID | `21772:102786` | mWeb | Frame 1984078622 | 캐시백 챌린지, UID 미연동(잠금 카드·Link 다이얼로그) |
| When user has linked UID | `10739:232622` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has claimed level 1 reward | `10739:232627` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:232625` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:232624` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:232623` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has linked UID | `10739:232621` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| Horizontal Scroll | `10739:232618` | mWeb | mWeb/allPartnerExchange | 칩·카드가 넘칠 때 가로 스크롤 |
| Get Cashback Get Extra USDT / When user has not linked any UID | `10739:232617` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지, UID 미연동(잠금 카드·Link 다이얼로그) |

**mWeb › S3/S4 lightMode › MAX-500** (`13992:356413`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Guess Bitcoin Price Max 1,000 USDT Prize | `21772:102787` | mWeb | Frame 1984078623 | BTC 가격 맞히기 이벤트 상세(기본) |
| Event Ended | `10718:173024` | mWeb | mWeb/allPartnerExchange | 이벤트 종료 상태 |
| — | `10718:173045` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| — | `10718:173047` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| Sign up for the exchange Get extra cashback | `10739:232256` | mWeb | mWeb/allPartnerExchange | 거래소 가입 추가 캐시백(부스트) 상세 |
| CTA > Share | `10739:232255` | mWeb | mWeb/allPartnerExchange | 공유 CTA |

**mAPP › S3/S4 lightMode › MAX-468** (`13992:366399`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| You referred to your friend Get up to 10 USDT | `11100:227835` | mAPP | mWeb/allPartnerExchange | 친구 초대 보상(최대 10 USDT) 상세 |
| Completed | `11100:228274` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Invite friends Get extra profits | `10739:280737` | mAPP | mWeb/allPartnerExchange | 친구 초대 혜택 상세(초대 코드·3단계 안내) |
| Copy invite | `10739:280736` | mAPP | mWeb/allPartnerExchange | 초대 코드 복사 토스트 |
| Calculate est. cashback Get 2 USDT | `10739:279954` | mAPP | mWeb/allPartnerExchange | 캐시백 미리보기 혜택(+2 USDT) 상세 |
| Claim 2 USDT | `10739:279953` | mAPP | mWeb/allPartnerExchange | 캐시백 미리보기 혜택 받기(2 USDT)·완료 토스트 |
| Claim 2 USDT | `10739:279952` | mAPP | mWeb/allPartnerExchange | 캐시백 미리보기 혜택 받기(2 USDT)·완료 토스트 |
| Completed | `10739:279951` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Bind your UID Get 3 USDT | `10739:279314` | mAPP | mWeb/allPartnerExchange | UID 연동 혜택(+3 USDT) 상세 |
| Completed | `10739:279313` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Claim 3 USDT | `10739:279312` | mAPP | mWeb/allPartnerExchange | UID 연동 혜택 받기(3 USDT)·완료 토스트 |
| Claim 3 USDT | `10739:279311` | mAPP | mWeb/allPartnerExchange | UID 연동 혜택 받기(3 USDT)·완료 토스트 |
| For when user has not linked any UID post-login / Claim cashback monthly Get up to 100 USD | `10739:281080` | mAPP | mWeb/allPartnerExchange | 월간 랭킹 혜택, 로그인·UID 미연동(Link UID CTA) |
| If user does not qualify in the ranks (1 UID) | `10739:281079` | mAPP | mWeb/allPartnerExchange | 랭킹 미진입(UID 1개) |
| If user get 1st place | `10739:281078` | mAPP | mWeb/allPartnerExchange | 랭킹 1위 달성 |
| Its your 1st time visiting our site Get up to 5 USDT | `10739:280282` | mAPP | mWeb/allPartnerExchange | 웰컴 기프트(최대 5 USDT) 상세 |
| Completed | `10739:280281` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Claim your first cashback Get 10 USDT | `10739:278596` | mAPP | mWeb/allPartnerExchange | 첫 출금 보상(+10 USDT) 상세 |
| Claim 10 USDT | `10739:278594` | mAPP | mWeb/allPartnerExchange | 첫 출금 보상 받기(10 USDT)·완료 토스트 |
| Claim 10 USDT | `10739:278593` | mAPP | mWeb/allPartnerExchange | 첫 출금 보상 받기(10 USDT)·완료 토스트 |
| Completed | `10739:278595` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Draw Coupon flow | `11100:229233` | mAPP | mWeb/allPartnerExchange | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| Draw Coupon flow | `11100:229234` | mAPP | mWeb/allPartnerExchange | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| Draw Coupon flow | `11100:229232` | mAPP | mWeb/allPartnerExchange | 초대 보상 쿠폰 뽑기(슬롯) 흐름 |
| Claim 5 USDT | `10739:280280` | mAPP | mWeb/allPartnerExchange | 웰컴 기프트 쿠폰 뽑기·받기 |
| Turn on alarm Get 1 USDT | `10739:247610` | mAPP | mWeb/allPartnerExchange | 알림 켜기 혜택(+1 USDT) 상세 |
| Completed | `10739:264849` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| Claim 1 USDT | `10739:279524` | mAPP | mWeb/allPartnerExchange | 알림 혜택 받기(1 USDT) |
| Claim 1 USDT | `10739:264850` | mAPP | mWeb/allPartnerExchange | 알림 혜택 받기(1 USDT) |
| Ongoing tab | `11100:226199` | mAPP | mWeb/allPartnerExchange | 혜택 메인 진행 중 탭(혜택 리스트+CTA) |
| Completed tab | `11100:224610` | mAPP | mWeb/allPartnerExchange | 혜택 메인 완료 탭 |
| More than 2 special benefits card (max 4) | `11100:226198` | mAPP | mWeb/allPartnerExchange | 스페셜 혜택 카드 3개 이상(최대 4) 가로 배치 |

**mAPP › S3/S4 lightMode › MAX-500** (`13992:366396`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Guess Bitcoin Price Max 1,000 USDT Prize / Default | `10739:266078` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기 이벤트 상세(기본) |
| when user has not turned on notitications / when user has submitted prediction for BTC pri | `10739:252250` | mAPP | mWeb/allPartnerExchange | BTC 맞히기, 알림 미설정·예측 제출 후 |
| when user has already turn on notification | `10739:264843` | mAPP | mWeb/allPartnerExchange | BTC 맞히기, 알림 설정 완료 |
| when user has not turned on notitications / when user has submitted prediction for BTC pri | `10739:276374` | mAPP | mWeb/allPartnerExchange | BTC 맞히기, 알림 미설정·예측 제출 후 |
| when user has already turn on notification | `10739:264842` | mAPP | mWeb/allPartnerExchange | BTC 맞히기, 알림 설정 완료 |
| Guess Bitcoin Price Max 1,000 USDT Prize / Enter 1st digit | `10739:275669` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기, 첫 자리 입력 |
| Guess Bitcoin Price Max 1,000 USDT Prize / When all digits are filled, show CTA | `10739:276044` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기, 전 자리 입력 후 CTA 활성 |
| If user does not have any cashback record | `10739:264847` | mAPP | mWeb/allPartnerExchange checked | 캐시백 기록 없음 안내 |
| User has not link UID | `10739:264848` | mAPP | mWeb/allPartnerExchange checked | UID 미연동 안내 |
| Guess Bitcoin Price Max 1,000 USDT Prize / Confirmation | `10739:264844` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기, 제출 확인 |
| Guess Bitcoin Price Max 1,000 USDT Prize / Confirmation | `10739:264846` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기, 제출 확인 |
| Guess Bitcoin Price Max 1,000 USDT Prize / Confirmation | `10739:264845` | mAPP | mWeb/allPartnerExchange | BTC 가격 맞히기, 제출 확인 |
| — | `10739:248660` | mAPP | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| User 1st prize winner | `10739:255678` | mAPP | mWeb/allPartnerExchange | BTC 맞히기 1등 당첨 |
| Event Ended | `10739:266362` | mAPP | mWeb/allPartnerExchange | 이벤트 종료 상태 |
| — | `10739:239254` | mAPP | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| Sign up for the exchange Get extra cashback | `10739:281737` | mAPP | mWeb/allPartnerExchange | 거래소 가입 추가 캐시백(부스트) 상세 |

**mAPP › S3/S4 lightMode › MAX-503** (`13992:366398`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `10739:239257` | mAPP | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| Get Cashback Get Extra USDT / When user has not linked any UID | `10739:276521` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 미연동(잠금 카드·Link 다이얼로그) |
| When user has linked UID | `10739:276846` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has claimed level 1 reward | `10739:278162` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:278161` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:278163` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:278164` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10954:207777` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10954:207778` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has claimed level 1 reward | `10739:278165` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, 레벨 1 수령 후 레벨 2 진행 |
| When user has linked UID | `10739:276990` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10739:277134` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10954:206838` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10954:207265` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| When user has linked UID | `10739:277298` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 연동·진행률·UID 선택 다이얼로그 |
| Horizontal Scroll | `10739:239273` | mAPP | mWeb/allPartnerExchange | 칩·카드가 넘칠 때 가로 스크롤 |
| Get Cashback Get Extra USDT / When user has not linked any UID | `10739:276703` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지, UID 미연동(잠금 카드·Link 다이얼로그) |
| — | `12474:155684` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지 25th May 판(레벨 카드) |
| — | `12474:155683` | Web | Web | 캐시백 챌린지 25th May 판(레벨 카드) |
| — | `12474:156198` | mAPP | mWeb/allPartnerExchange | 캐시백 챌린지 25th May 판(레벨 카드) |
| — | `12474:156500` | Web | Web | 캐시백 챌린지 25th May 판(레벨 카드) |

**Web › S1/S2 lightMode › MAX-468** (`13992:338449`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `9961:168204` | Web | Web | Web 혜택 메인(로그인 전) 기본/완료 탭 |
| — | `9961:168203` | Web | Web | Web 혜택 메인(로그인 전) 기본/완료 탭 |
| More than 2 special benefits | `10954:228709` | Web | Web | 스페셜 혜택 카드 3개 이상(최대 4) 가로 배치 |
| Claim cashback monthly Get up to 100 USDT | `9814:197465` | Web | Web | 월간 캐시백 랭킹 보상(최대 100 USDT) 상세 |
| Invite friends Get extra profits | `9961:167635` | Web | Web | 친구 초대 혜택 상세(초대 코드·3단계 안내) |
| Its your 1st time visiting our site Get up to 5 USDT | `9961:168195` | Web | Web | 웰컴 기프트(최대 5 USDT) 상세 |
| Calculate est. cashback Get 2 USDT | `9961:168192` | Web | Web | 캐시백 미리보기 혜택(+2 USDT) 상세 |
| Turn on alarm Get 1 USDT | `9961:168191` | Web | Web | 알림 켜기 혜택(+1 USDT) 상세 |
| Bind your UID Get 3 USDT | `9961:168193` | Web | Web | UID 연동 혜택(+3 USDT) 상세 |
| Claim your first cashback Get 5 USDT | `9814:198094` | Web | Web | 첫 출금 보상(+10 USDT) 상세 |
| You referred to your friend Get up to 10 USDT | `9961:168194` | Web | Web | 친구 초대 보상(최대 10 USDT) 상세 |

**Web › S1/S2 lightMode › MAX-503** (`13992:338448`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Get Cashback Get Extra USDT | `9961:168196` | Web | Web | 캐시백 챌린지(레벨 보상) 상세 |
| Get Cashback Get Extra USDT | `10954:213052` | Web | Web | 캐시백 챌린지(레벨 보상) 상세 |

**Web › S1/S2 lightMode › MAX-500** (`13992:338447`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Sign up for the exchange Get extra cashback | `9814:193626` | Web | Web | 거래소 가입 추가 캐시백(부스트) 상세 |
| CTA > Share | `10790:332256` | Web | Web | 공유 CTA |
| Guess Bitcoin Price Max 1,000 USDT Prize | `9961:168197` | Web | Web | BTC 가격 맞히기 이벤트 상세(기본) |
| Event Ended | `10954:40778` | Web | Web | 이벤트 종료 상태 |

**Web › S3/S4 lightMode › MAX-468** (`13992:342870`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `10954:230325` | Web | Web | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `10954:228708` | Web | Web | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `11446:260040` | Web | Frame 1984078594 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| Invite friends Get extra profits | `10976:47799` | Web | Web | 친구 초대 혜택 상세(초대 코드·3단계 안내) |
| Copy invite | `10976:50390` | Web | Web | 초대 코드 복사 토스트 |
| Its your 1st time visiting our site Get up to 5 USDT | `10976:50276` | Web | Web | 웰컴 기프트(최대 5 USDT) 상세 |
| — | `11446:258746` | Web | Frame 1948757815 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| Claim 5 USDT | `11446:259193` | Web | Backdrop | 웰컴 기프트 쿠폰 뽑기·받기 |
| — | `11446:259216` | Web | Frame 1948757815 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `11446:259251` | Web | Backdrop | 모달/바텀시트 오버레이(딤 배경) |
| Completed | `11100:200891` | Web | Frame 1984078589 | 혜택/탭 완료 상태 |
| Calculate est. cashback Get 2 USDT | `10976:50736` | Web | Web | 캐시백 미리보기 혜택(+2 USDT) 상세 |
| Claim 2 USDT | `10976:50878` | Web | Web | 캐시백 미리보기 혜택 받기(2 USDT)·완료 토스트 |
| — | `11100:200688` | Web | Frame 1984078587 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| Turn on alarm Get 1 USDT | `10976:51542` | Web | Web | 알림 켜기 혜택(+1 USDT) 상세 |
| Bind your UID Get 3 USDT | `10976:53104` | Web | Web | UID 연동 혜택(+3 USDT) 상세 |
| Claim 3 USDT | `10976:53105` | Web | Web | UID 연동 혜택 받기(3 USDT)·완료 토스트 |
| — | `10976:53106` | Web | Web | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| Claim your first cashback Get 10 USDT | `10978:69402` | Web | Web | 첫 출금 보상(+10 USDT) 상세 |
| Claim 10 USDT | `10978:69401` | Web | Web | 첫 출금 보상 받기(10 USDT)·완료 토스트 |
| — | `10978:69403` | Web | Web | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| You referred to your friend Get up to 10 USDT | `10978:69493` | Web | Web | 친구 초대 보상(최대 10 USDT) 상세 |
| — | `11100:200482` | Web | Frame 1984078585 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `10978:69662` | Web | Frame 1948757815 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `10978:69756` | Web | Backdrop | 모달/바텀시트 오버레이(딤 배경) |
| — | `10978:69859` | Web | Frame 1948757815 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| — | `10978:69893` | Web | Backdrop | 모달/바텀시트 오버레이(딤 배경) |
| More than 2 special benefits | `10954:229568` | Web | Web | 스페셜 혜택 카드 3개 이상(최대 4) 가로 배치 |
| — | `10976:50275` | Web | Web | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |
| Claim cashback monthly Get up to 100 USDT / For when user has not linked any UID post-logi | `10976:50393` | Web | Web | 월간 캐시백 랭킹 보상(최대 100 USDT) 상세 |
| If user does not qualify in the ranks (1 UID) | `10976:50392` | Web | Web | 랭킹 미진입(UID 1개) |
| If user get 1st place | `10976:50391` | Web | Web | 랭킹 1위 달성 |
| — | `28972:60379` | — | Frame 1984078632 | Web 혜택 상세·받기 흐름(같은 열 위 라벨 참조 — 모달·토스트 상태 포함) |

**Web › S3/S4 lightMode › MAX-503** (`13992:342866`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Get Cashback Get Extra USDT / When user has linked UID | `10981:85015` | Web | Web | 캐시백 챌린지(레벨 보상) 상세 |
| — | `10981:85019` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |
| — | `10981:85020` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |
| — | `10981:85021` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |
| — | `10981:85022` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |
| Get Cashback Get Extra USDT / When user has not linked any UID | `10981:85014` | Web | Web | 캐시백 챌린지, UID 미연동(잠금 카드·Link 다이얼로그) |
| — | `10981:85016` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |
| Get Cashback Get Extra USDT / When user has linked UID | `10981:85017` | Web | Web | 캐시백 챌린지(레벨 보상) 상세 |
| — | `10981:85018` | Web | Web | Web 캐시백 챌린지 상태(UID 연동·레벨 진행·수령) |

**Web › S3/S4 lightMode › MAX-500** (`13992:342865`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Sign up for the exchange Get extra cashback | `10976:50395` | Web | Web | 거래소 가입 추가 캐시백(부스트) 상세 |
| CTA > Share | `10976:50394` | Web | Web | 공유 CTA |
| Guess Bitcoin Price Max 1,000 USDT Prize | `10981:85469` | Web | Web | BTC 가격 맞히기 이벤트 상세(기본) |
| Event Ended | `10981:85294` | Web | Web | 이벤트 종료 상태 |

**[MAXOP-412]** (`17585:306499`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `17581:305572` | mWeb | mWeb/allPartnerExchange | MAXOP-412 혜택 메인(앱 History 버튼 / Web View Coupons) |
| — | `17581:305587` | Web | Web | MAXOP-412 혜택 메인(앱 History 버튼 / Web View Coupons) |

**MAXOP-474** (`18111:80081`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `18111:79597` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:78949` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:78497` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:78182` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:77857` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:76971` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:76538` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:76215` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18110:75694` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `18110:75754` | mWeb | Footer/mWeb | 푸터 조각 |
| — | `18111:76979` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `18111:77043` | mWeb | Footer/mWeb | 푸터 조각 |
| — | `18111:77172` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `18111:77236` | mWeb | Footer/mWeb | 푸터 조각 |
| — | `18111:80074` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18111:80272` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `18111:80336` | mWeb | Footer/mWeb | 푸터 조각 |
| — | `18114:81704` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:82769` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:83235` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:83791` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:84129` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:84622` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |
| — | `18114:85706` | mWeb | mWeb/allPartnerExchange | MAXOP-474 혜택 상세 하단 Back+주 CTA(윗줄 로그인 전·아랫줄 로그인 후) |

**MAXOP-763 Bitcoin Guess text area (revision 2026-09-29)** (`25848:60375`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25848:60376` | — | Before (instance) | 변경 전(Before) |
| — | `25848:60660` | — | MAXOP-763 / Bitcoin Guess, title outside the | MAXOP-763 After — 입력 박스 위 제목, 안내는 아래 |

**Updated as of 25th May (2094x1536)** (`15987:55661`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15987:55662` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지 5/7/10/15 USDT(25th May) |
| — | `15987:55663` | Web | Web | 캐시백 챌린지 5/7/10/15 USDT(25th May) |

**Updated as of 25th May (3278x1536)** (`15987:55664`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15987:55665` | mWeb | mWeb/allPartnerExchange | 캐시백 챌린지 7/10/20/30 USDT(25th May) |
| — | `15987:55666` | Web | Web | 캐시백 챌린지 7/10/20/30 USDT(25th May) |

**For discussion** (`17351:190450`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `17351:190154` | Web | Web | Cashback Boost 상세 Web(논의용) |
| — | `17351:190160` | Web | Web | Cashback Boost 상세 Web(논의용) |

**Frame 1984078607 (최상위)** (`16343:377105`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `16343:377105` | Web | Frame 1984078607 | 스페셜 혜택 썸네일·카드 모음 |

**mWeb/allPartnerExchange (최상위)** (`10977:56014`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `10977:56015` | mWeb | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `10977:56062` | mWeb | Backdrop | 모달/바텀시트 오버레이(딤 배경) |

**페이백 퀘스트 (Web, 최상위)** (`15987:55379`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15987:55379` | Web | 페이백 퀘스트 | 구 한국어 「페이백 퀘스트」 Web |

**페이백 퀘스트 (mWeb, 최상위)** (`15987:55536`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15987:55536` | — | 페이백 퀘스트 | 구 한국어 「페이백 퀘스트」 mWeb |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 혜택 상세 하단 CTA | 기본 | MAX-468(mWeb S1/S2·S3/S4) | `9622:104684` 등 | — | 하단 단일 CTA(예: `Sign Up to Invite Friends`) | 보조 |
| 〃 | MAXOP-474 | MAXOP-474 | `18111:80081` | MAXOP-474 | `Back` + 주 CTA 2버튼, 긴 문구는 세로 쌓기(포스트잇), 러시아어 긴 문구 예시 | **현행** — 기본판보다 늦은 MAXOP 개정 |
| 혜택 메인 상단 카드 | 기본 | Web S3/S4 MAX-468 | `10954:228708` | — | 총 이벤트 보상 + `View History` | 보조 |
| 〃 | MAXOP-412 | [MAXOP-412] | `17585:306499` | MAXOP-412 | 상단 카드 `View Coupons`, 앱 헤더 `History`, 스페셜 3카드(Boost) | **현행** — Web S3/S4 섹션도 `View Coupons`(Default / New coupons available) 반영 |
| 캐시백 챌린지 레벨 금액 | 기본 | MAX-503(mWeb·Web) | `13992:356414` | — | 레벨 5/7/10/15 USDT | 보조 |
| 〃 | 25th May 판 ① | Updated as of 25th May | `15987:55661` | 25 May | 5/7/10/15, 진행률 83% | 보조 |
| 〃 | 25th May 판 ② | Updated as of 25th May | `15987:55664` | 25 May | 7/10/20/30, 500 USDT 목표 | 「사용자 확인 필요」 — 같은 날짜 두 판이 금액이 다름. mAPP MAX-503 안에도 같은 이름 섹션 2개(`12474:155696`·`12474:155697`) |
| BTC 맞히기 입력 영역 | 기본 | MAX-500 | `10739:275669` 등 | — | 입력 박스 안에 「6자리 모두 맞히면…」 안내 | 보조 |
| 〃 | MAXOP-763 | MAXOP-763 (revision 2026-09-29) | `25848:60375` | 2026-09-29 | 박스 위 제목 `Enter the Bitcoin price`, 안내는 박스 아래 | **현행** — 최신 날짜 |
| 월간 랭킹 카드 | 기본 | MAX-468 | `10730:183393` 등 | — | 거래소·UID·순위 1줄 | 보조 |
| 〃 | MAXOP-805 | MAXOP-805 (revision 2026-09-29) | `25849:1340930` | 2026-09-29 | `You're in the reward zone.` / `Trade more to get a reward.` 줄 추가, PC 1440판 | **현행** — 최신 날짜 |
| Cashback Boost 상세 | For discussion | For discussion | `17351:190450` | — | Web 2판(상단만 / 전체) | 「사용자 확인 필요」 — 논의용 섹션. MAX-500 `Sign up for the exchange` 판과 관계 불명 |
| 캐시백 챌린지(한국어) | 구판 | For reference | `13992:366397` | — | 「페이백 챌린지!」 구 GNB | 구판(참고) |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 다이얼로그(취소/확인, 확인 비활성) | Benefits MAX-503 | `10981:80098` 등 | `7884-30642__13992-356414.jpg` | `Select a UID to receive the reward` 미선택 시 Confirm 비활성 |
| 다이얼로그(안내 + Link) | Benefits MAX-503 | `10739:232617` | `7884-30642__13992-356414.jpg` | `UID Link Required` · `Link your UID to receive challenge reward` |
| 다이얼로그(단일 OK, 불가 안내) | Benefits MAX-503 | 같은 섹션 오른쪽 | `7884-30642__13992-356414.jpg` | `This UID has previously joined the cashback challenge` |
| 성공 토스트(체크 아이콘) | Benefits | `10739:232622` 등 | `7884-30642__13992-356414.jpg` | `Congrats! You got 5 USDT.` 하단 고정 |
| 토스트(복사) | Benefits | `10739:232633` · `12340:51396` | `7884-30642__13992-356418.jpg` | `Invite code copied` / 초대 코드 발급 |
| 비활성 버튼 | Benefits | `Claim 5 USDT Coupon` 회색 | `7884-30642__15987-55661.jpg` | 조건 미달 시 회색 CTA |
| 배지/칩 | Benefits | Ongoing 탭 카운트 `10`, `Completed` 회색 배지, `Level 1 Reward` 파란 칩 | `7884-30642__17585-306499.jpg` | |
| 버튼 상태(기본/새 쿠폰 점) | Benefits Web | `View Coupons` Default / New coupons available | `7884-30642__13992-342870.jpg` | 새 쿠폰 표시 |
| 빈 상태 | Benefits | 완료 탭 `You haven't completed any benefits yet.` | `7884-30642__17585-306499.jpg` | |
| 빈 상태(랭킹) | Benefits | `No Ranking Available` | `7884-30642__13992-356418.jpg` | 월간 랭킹 카드 |
| 잠금 카드 | Benefits MAX-503 | `Unlocks after linking UID` · `Complete level 1 reward to unlock` | `7884-30642__13992-356414.jpg` | 진행 전 잠금 표시 |


## [MAX-499] My Coupons (`9287:175233`)

내 쿠폰 목록(Coupons/Completed 탭) · 쿠폰 사용(UID 선택 → 지급 완료) · 빈 상태 · 오류.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| reference | `11982:382620` | 라이트 | ![](img/9287-175233__11982-382620.jpg) | 2 | 혜택 완료 후 다시 받기 안내 메모 + 참고 화면 |
| Web › My Coupons - lightMode | `11982:373113` | 라이트 | ![](img/9287-175233__11982-373113.jpg) | 7 |  |
| Web › My Coupons - darkMode | `11982:389656` | 다크 — 제외 | — | 7 |  |
| mWeb › My Coupons - lightMode | `11982:373114` | 라이트 | ![](img/9287-175233__11982-373114.jpg) | 10 | 오류·비활성 UID·만료 쿠폰·`View Benefits` 버튼 상태 포함 |
| mWeb › My Coupons - darkMode | `11982:381265` | 다크 — 제외 | — | 8 |  |
| mAPP › My Coupons - lightMode | `11982:391531` | 라이트 | ![](img/9287-175233__11982-391531.jpg) | 9 |  |
| mAPP › My Coupons - darkMode | `12085:398435` | 다크 — 제외 | — | 9 |  |
| MAXOP-796 Coupon status (revision 2026-09-29) | `25847:1339360` | 라이트 | ![](img/9287-175233__25847-1339360.jpg) | 4 | 완료 탭 `Used`/`Expired` 칩 Before/After + PC |
| MAXOP-806 App header title (revision 2026-09-29) | `25851:1340108` | 라이트 | ![](img/9287-175233__25851-1340108.jpg) | 2 | 앱 헤더 타이틀 `My Coupons` Before/After |
| MAXOP-782 Coupon claim close X (revision 2026-09-30) › Light | `25994:11889` | 라이트 | ![](img/9287-175233__25994-11889.jpg) | 3 | 지급 완료 화면에 닫기(X) |
| MAXOP-782 … › Dark | `25994:12293` | 다크 — 제외 | — | 3 |  |
| MAXOP-796 … [Dark] | `25856:1340448` | 다크 — 제외 | — | 3 |  |
| MAXOP-806 … [Dark] | `25856:1340683` | 다크 — 제외 | — | 1 |  |
| QA | `14631:164932` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |

### 화면 판정

**reference** (`11982:382620`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| After completing the benefits, users must claim here again to select the exchange where th | `9287:175254` | — | Frame 427322035 | 혜택 완료 후 쿠폰함에서 다시 받기 참고 화면 |
| — | `9287:175357` | — | Frame 8100 | 혜택 완료 후 쿠폰함에서 다시 받기 참고 화면 |

**Web › My Coupons - lightMode** (`11982:373113`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Coupons available | `11982:372438` | Web | Web | 쿠폰 목록(사용 가능, Use 버튼) |
| No coupons | `11982:388195` | Web | Web | 쿠폰 없음 빈 상태(View Benefits) |
| No completed coupons | `11982:389627` | Web | Web | 완료 쿠폰 없음 빈 상태(View Coupons) |
| Use coupon to receive rewards | `11982:375723` | Web | Web | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| Use coupon to receive rewards | `11982:396726` | Web | Web | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| — | `11982:376470` | Web | Web | 쿠폰 지급 완료(Web 모달) |
| Completed | `11982:373083` | Web | Web | 혜택/탭 완료 상태 |

**mWeb › My Coupons - lightMode** (`11982:373114`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Coupons available | `11922:364127` | mWeb | mWeb/allPartnerExchange | 쿠폰 목록(사용 가능, Use 버튼) |
| No coupons | `11982:387214` | mWeb | mWeb/allPartnerExchange | 쿠폰 없음 빈 상태(View Benefits) |
| Use coupon to receive rewards | `11982:373721` | mWeb | mWeb/allPartnerExchange | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| Error state | `12474:164021` | mWeb | mWeb/allPartnerExchange | 쿠폰 사용 불가 다이얼로그(Unable to Use Coupon) |
| Use coupon to receive rewards | `11982:375030` | mWeb | mWeb/allPartnerExchange | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| Deactivated UIDs | `12474:164724` | mWeb | mWeb/allPartnerExchange | 비활성 UID 선택 불가 표시 |
| Completed | `11922:364126` | mWeb | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| No completed coupons | `11982:388898` | mWeb | mWeb/allPartnerExchange | 완료 쿠폰 없음 빈 상태(View Coupons) |
| Use coupon to receive rewards | `11982:376671` | mWeb | mWeb/LP | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| — | `11982:381264` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |

**mAPP › My Coupons - lightMode** (`11982:391531`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Coupons available | `11982:395358` | mAPP | mWeb/allPartnerExchange | 쿠폰 목록(사용 가능, Use 버튼) |
| No coupons | `11982:397744` | mAPP | mWeb/allPartnerExchange | 쿠폰 없음 빈 상태(View Benefits) |
| Use coupon to receive rewards | `11982:396263` | mAPP | mWeb/allPartnerExchange | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| Use coupon to receive rewards | `11982:396708` | mAPP | mWeb/allPartnerExchange | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |
| Completed | `11982:395818` | mAPP | mWeb/allPartnerExchange | 혜택/탭 완료 상태 |
| No completed coupons | `11982:397960` | mWeb | Frame 1948757999 | 완료 쿠폰 없음 빈 상태(View Coupons) |
| — | `11982:397989` | mWeb | Footer/mWeb (숨김) | 푸터 조각 |
| — | `11982:394896` | mAPP | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| Use coupon to receive rewards | `11982:397071` | mAPP | mWeb/LP | 쿠폰 사용, UID 선택 다이얼로그 → 지급 완료 |

**MAXOP-796 Coupon status (revision 2026-09-29)** (`25847:1339360`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25847:1339663` | — | Frame 1948757999 | 모달/바텀시트 오버레이(딤 배경) |
| — | `25847:1339809` | mWeb | Footer/mWeb | 푸터 조각 |
| — | `25847:1339888` | — | Before: current Completed tab (instance) | 혜택 메인 완료 탭 |
| — | `26648:710899` | Web | MAXOP-796 / Completed tab with Used and Expi | 혜택 메인 완료 탭 |

**MAXOP-806 App header title (revision 2026-09-29)** (`25851:1340108`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25851:1340109` | mAPP | Before (instance) | 변경 전(Before) |
| — | `25851:1340999` | mAPP | MAXOP-806 / My Coupons, app header title / a | 앱 헤더 타이틀 My Coupons(After) |

**MAXOP-782 Coupon claim close X (revision 2026-09-30) › Light** (`25994:11889`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25994:11890` | Web | Web / Coupon claimed / with close | 쿠폰 지급 완료 + 닫기(X) |
| — | `25994:12167` | mWeb | mWeb / Coupon claimed / with close | 쿠폰 지급 완료 + 닫기(X) |
| — | `25994:12233` | mAPP | mAPP / Coupon claimed / with close | 쿠폰 지급 완료 + 닫기(X) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 완료 탭 | 기본 | mWeb/Web/mAPP lightMode | `11922:364126` · `11982:373083` | — | 회색 처리만, 상태 칩 없음 | 보조 |
| 〃 | MAXOP-796 | MAXOP-796 (revision 2026-09-29) | `26648:710899`(PC) · `25847:1339663` | 2026-09-29 | 우측 `Used`(파랑)/`Expired`(회색) 칩 | **현행** — 최신 MAXOP |
| 쿠폰 목록 앱 헤더 | 기본 | mAPP lightMode | `11982:395358` | — | 뒤로가기만 | 보조 |
| 〃 | MAXOP-806 | MAXOP-806 (revision 2026-09-29) | `25851:1340999` | 2026-09-29 | 헤더에 `My Coupons` 타이틀 | **현행** |
| 쿠폰 지급 완료 | 기본 | mWeb/mAPP lightMode | `11982:376671` · `11982:397071` | — | 닫기 없음, `Back to Home`/`View Rewards` | 보조 |
| 〃 | MAXOP-782 | MAXOP-782 (revision 2026-09-30) Light | `25994:11890`(Web 모달) · `25994:12167` · `25994:12233` | 2026-09-30 | 우상단 X 추가, Web은 모달(다중 거래소 `Bitget +1`) | **현행** — 가장 최근 날짜 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 빈 상태 + 보조 버튼 | My Coupons | `11982:387214` · `11982:388898` | `9287-175233__11982-373114.jpg` | `No coupons available` + `View Benefits` / `You haven't use any coupons yet.` + `View Coupons` |
| 보조 버튼 3상태 | My Coupons | `View Benefits` Default/hover/disabled | `9287-175233__11982-373114.jpg` | 비활성 버튼 시안 |
| 다이얼로그(선택형, 확인 비활성) | My Coupons | `11982:373721` | `9287-175233__11982-373114.jpg` | `Select a UID to apply this coupon` · `Once applied, it cannot be changed.` |
| 오류 다이얼로그(단일 OK) | My Coupons | `12474:164021` | `9287-175233__11982-373114.jpg` | `Unable to Use Coupon` |
| 비활성 항목 | My Coupons | `12474:164724` | `9287-175233__11982-373114.jpg` | 비활성 UID 흐리게, 선택 불가 |
| 상태 칩 | My Coupons | MAXOP-796 | `9287-175233__25847-1339360.jpg` | `Used` / `Expired` |
| 만료 쿠폰 행 | My Coupons | Expired Coupon | `9287-175233__11982-373114.jpg` | `Expired` 회색 텍스트 |
| 탭 카운트 배지 | My Coupons | `Coupons 7` | `9287-175233__25851-1340108.jpg` | 파란 원형 숫자 |
| 결과 모달/전체 화면 | My Coupons | MAXOP-782 | `9287-175233__25994-11889.jpg` | 지급 완료(거래소·UID·금액 요약 + 2버튼 + X) |


## [MAX-117] Global League (`1017:4262`)

글로벌 리그(팀·개인) Summary · Team League · Team Details. 최상위 섹션 이름 `Ready for dev as of 13 March 2026 [Version 1.0]`. 핸드오프 GNB는 구 GNB(`Partner Exchanges · Events · Benefits · Test Cashback · Service Introduction`), 배너는 자리표시자(`Banner Image`).

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Ready for dev › mWeb Handoff - Light › Non-registered users (Team League) | `1017:8480` | 라이트 | ![](img/1017-4262__1017-8480.jpg) | 7 |  |
| Ready for dev › mWeb Handoff - Light › Registered users (Team League) | `1017:17853` | 라이트 | ![](img/1017-4262__1017-17853.jpg) | 8 |  |
| Ready for dev › mWeb Handoff - Light › Individual League | `1058:56089` | 라이트 | ![](img/1017-4262__1058-56089.jpg) | 5 |  |
| Ready for dev › mWeb Handoff - Dark | `1095:94139` | 다크 — 제외 | — | 7 |  |
| Ready for dev › Web Handoff - Light › Non-registered users - Team League | `1058:36620` | 라이트 | ![](img/1017-4262__1058-36620.jpg) | 4 | Summary·Team League·Team Details + `Members Only` 다이얼로그 |
| Ready for dev › Web Handoff - Light › Non-registered users - Individual league | `1095:68555` | 라이트 | ![](img/1017-4262__1095-68555.jpg) | 3 | 드롭다운 처리 포함 |
| Ready for dev › Web Handoff - Light › Registered users (Team League) | `1095:64184` | 라이트 | ![](img/1017-4262__1095-64184.jpg) ![](img/1017-4262__1095-64184_p2.jpg) | 4 |  |
| Ready for dev › Web Handoff - Light(2) › Non-registered users - Team League | `1095:110407` | 다크(이름은 라이트) | ![](img/1017-4262__1095-110407.jpg) | 4 | **이름은 Light지만 캡처상 다크 화면** — 다크판으로 분류 |
| Ready for dev › mobileAPP | `1095:81269` | 라이트 | ![](img/1017-4262__1095-81269.jpg) | 9 |  |
| Ready for dev › verticalScroll Handling | `2913:26672` | 라이트 | ![](img/1017-4262__2913-26672.jpg) | 3 |  |
| >1 UID handling | `2913:22486` | 라이트 | ![](img/1017-4262__2913-22486.jpg) | 6 | 팀 생성 UID 선택 모달 1 / 최대 5 / 5개 초과(스크롤) |
| createTeam handling | `2913:24413` | 라이트 | ![](img/1017-4262__2913-24413.jpg) | 2 |  |
| Web (최상위 단독, 1440x4208) | `16399:86822` | 라이트 | ![](img/1017-4262__16399-86822.jpg) | 2 | Summary 실배너(트로피 TOP 20) 적용판 |
| Web (최상위 단독, 768x1666) | `3210:21395` | 라이트 | ![](img/1017-4262__3210-21395.jpg) | 2 | 태블릿 폭 시안 |
| mWeb/TeamDetails (최상위 단독) | `6727:63351` | 라이트 | ![](img/1017-4262__6727-63351.jpg) | 1 |  |

### 화면 판정

**Ready for dev › mWeb Handoff - Light › Non-registered users (Team League)** (`1017:8480`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1017:16214` | mWeb | mWeb/teamLeague | 비회원 팀 리그 — Team League/Summary/Team Details |
| — | `1017:4335` | mWeb | mWeb/Summary | 비회원 팀 리그 — Team League/Summary/Team Details |
| — | `1017:16688` | mWeb | mWeb/TeamDetails | 비회원 팀 리그 — Team League/Summary/Team Details |
| Vertical scroll interaction | `1058:42854` | mWeb | mWeb/Summary | 세로 스크롤 인터랙션 |
| Vertical scroll interaction | `1058:43874` | mWeb | mWeb/Summary | 세로 스크롤 인터랙션 |
| Vertical scroll interaction | `1058:43140` | mWeb | mWeb/Summary | 세로 스크롤 인터랙션 |
| Event Rules - Expanded | `1058:53217` | mWeb | Event Rules - expanded | 이벤트 규칙 펼침 |

**Ready for dev › mWeb Handoff - Light › Registered users (Team League)** (`1017:17853`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1017:17857` | mWeb | mWeb/teamLeague | 회원 팀 리그 — Team League/Summary/Team Details |
| When user has joined a team | `1053:24990` | mWeb | mWeb/teamLeague | 팀 가입 후 상태 |
| — | `1017:18063` | mWeb | mWeb/Summary | 회원 팀 리그 — Team League/Summary/Team Details |
| When user has joined a team | `1058:26099` | mWeb | mWeb/Summary | 팀 가입 후 상태 |
| — | `1017:18498` | mWeb | mWeb/TeamDetails | 회원 팀 리그 — Team League/Summary/Team Details |
| When user has joined a team | `1053:25398` | mWeb | mWeb/TeamDetails | 팀 가입 후 상태 |
| When user is eligible to create team | `2913:24073` | mWeb | mWeb/Home | 팀 생성 가능 안내 |
| — | `7646:55235` | mWeb | mWeb/TeamDetails | 회원 팀 리그 — Team League/Summary/Team Details |

**Ready for dev › mWeb Handoff - Light › Individual League** (`1058:56089`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Summary | `1058:54685` | mWeb | mWeb/Summary | 개인 리그 Summary |
| When user has registered for the event | `1058:56100` | mWeb | mWeb | 이벤트 등록 후 |
| Event Rules - Expanded | `1058:55250` | mWeb | Event rules - expanded | 이벤트 규칙 펼침 |
| Individual League | `1058:55649` | mWeb | mWeb/individualLeague | 개인 리그 탭 |
| When user has registered for the event | `1058:56581` | mWeb | Content | 이벤트 등록 후 |

**Ready for dev › Web Handoff - Light › Non-registered users - Team League** (`1058:36620`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1796:21063` | Web | Frame 1948757814 | 비회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1895:17723` | Web | Frame 1948757815 | 비회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1095:62236` | Web | Web | 비회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1095:63475` | Web | Web | 비회원 팀 리그 Web — 배너·Summary·Team League·Team Details |

**Ready for dev › Web Handoff - Light › Non-registered users - Individual league** (`1095:68555`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1895:18319` | Web | Frame 1948757815 | 비회원 개인 리그 Web — 배너·Summary·리그 |
| — | `1095:68639` | Web | Frame 9338 | 비회원 개인 리그 Web — 배너·Summary·리그 |
| — | `1095:68889` | Web | Web | 비회원 개인 리그 Web — 배너·Summary·리그 |

**Ready for dev › Web Handoff - Light › Registered users (Team League)** (`1095:64184`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1796:21115` | Web | Frame 1948757815 | 회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1095:64268` | Web | Frame 9338 | 회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1095:64518` | Web | Web | 회원 팀 리그 Web — 배너·Summary·Team League·Team Details |
| — | `1095:64732` | Web | Web | 회원 팀 리그 Web — 배너·Summary·Team League·Team Details |

**Ready for dev › mobileAPP** (`1095:81269`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `1095:82310` | mAPP | mAPP/teamLeague | 앱 팀 리그·Summary(상태별) |
| — | `1095:90029` | mAPP | mAPP/teamLeague | 앱 팀 리그·Summary(상태별) |
| — | `1095:90697` | mAPP | mAPP/teamLeague | 앱 팀 리그·Summary(상태별) |
| — | `1095:89009` | mAPP | mAPP/teamLeague | 앱 팀 리그·Summary(상태별) |
| — | `1095:84664` | mAPP | mAPP/Summary | 앱 팀 리그·Summary(상태별) |
| — | `1095:86312` | mAPP | mAPP/Summary | 앱 팀 리그·Summary(상태별) |
| — | `1095:88410` | mAPP | mAPP/Summary | 앱 팀 리그·Summary(상태별) |
| — | `2877:31596` | mAPP | mAPP/Summary | 앱 팀 리그·Summary(상태별) |
| — | `2877:32911` | mAPP | mAPP/Summary | 앱 팀 리그·Summary(상태별) |

**Ready for dev › verticalScroll Handling** (`2913:26672`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `2913:25335` | mAPP | mAPP/teamLeague | 앱 팀 리그 세로 스크롤 처리 |
| — | `2913:26208` | mAPP | mAPP/teamLeague | 앱 팀 리그 세로 스크롤 처리 |
| — | `2913:24910` | mAPP | mAPP/teamLeague | 앱 팀 리그 세로 스크롤 처리 |

**>1 UID handling** (`2913:22486`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Max 5 UID | `2913:21161` | mWeb | mWeb/teamLeague | Create team UID 선택 모달(1개/최대 5/5개 초과) |
| More than 5 UID | `2913:22019` | mWeb | mWeb/teamLeague | Create team UID 선택 모달(1개/최대 5/5개 초과) |
| 1 UID | `2913:19878` | mWeb | mWeb/teamLeague | Create team UID 선택 모달(1개/최대 5/5개 초과) |
| Max 5 UID | `2913:21369` | — | Backdrop | 모달/바텀시트 오버레이(딤 배경) |
| More than 5 UID | `2913:22227` | — | Backdrop | 모달/바텀시트 오버레이(딤 배경) |
| 1 UID | `2913:20086` | — | Backdrop | 모달/바텀시트 오버레이(딤 배경) |

**createTeam handling** (`2913:24413`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `2913:24150` | mWeb | mWeb/Home | 팀 생성 가능 안내(mWeb 홈·Web) |
| — | `2913:24305` | Web | Desktop - 1 | 팀 생성 가능 안내(mWeb 홈·Web) |

**Web (최상위 단독, 1440x4208)** (`16399:86822`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `16399:86859` | Web | Frame 1948757815 | Web Summary 실배너판(배너+본문) |
| — | `16399:86906` | Web | Frame 9338 | Web Summary 실배너판(배너+본문) |

**Web (최상위 단독, 768x1666)** (`3210:21395`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `3210:21432` | Web | Frame 1948757815 | 태블릿 폭 Summary 시안 |
| — | `3210:21574` | — | Frame 1948757773 | 태블릿 폭 Summary 시안 |

**mWeb/TeamDetails (최상위 단독)** (`6727:63351`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `6727:63351` | mWeb | mWeb/TeamDetails | Team Details |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| Web Summary | 핸드오프판 | Web Handoff - Light › Non-registered | `1058:36620` 안 Summary | 13 March 2026 v1.0 | 배너 자리표시자, Countries `Global` · Total Cashback `Calculating` | 보조 |
| 〃 | 단독 Web | (최상위) | `16399:86822` | — | 실배너 이미지, Countries `Calculating` · Total Cashback `Unlock rewards` | **현행으로 보임** — 노드 번호가 훨씬 뒤이고 실데이터 문구. 「사용자 확인 필요」 |
| Web Team League(비회원) | Light | Web Handoff - Light | `1058:36620` | v1.0 | 라이트 | 현행(라이트) |
| 〃 | 「Light」 이름의 다크판 | Web Handoff - Light(`1095:110406`) | `1095:110407` | v1.0 | 실제 다크 | 다크판 — 섹션 이름 오기 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 다이얼로그(가입 유도) | Global League | Web `Members Only` | `1017-4262__1058-36620.jpg` | `Sign up for a TetherMax account to join the Global League` + Cancel/Sign Up |
| 다이얼로그(선택형, 확인 비활성, 스크롤) | Global League | `2913:22486` | `1017-4262__2913-22486.jpg` | `Create team` · UID 1/5/5개 초과(스크롤) · Confirm 비활성 |
| 페이지네이션 | Global League | Leaderboard | `1017-4262__16399-86822.jpg` | 처음/이전/번호/다음/끝 |
| 단계 표시(Stepper) | Global League | League Schedule | `1017-4262__16399-86822.jpg` | 현재 단계 `LIVE` 배지 |
| 상태 값 문구 | Global League | Summary 지표 | `1017-4262__16399-86822.jpg` | `Opening soon` · `Calculating` · `Forming` — 집계 전 상태 표기 |


## [MAX-] Bingo (`28537:444337`)

「October Bitget MAX BOARD」 빙고 이벤트. 단계(사전공개 → 참여 기간 → 집계 → 결과 발표 → 지급 기간) × 사용자 상태를 열로 나열. 한 열이 한 화면(여러 section 프레임을 세로로 쌓음). 새 GNB(`Compare · How it works · Notes`). 라이트만 있음.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| PC · 단계 × 사용자 상태 | `28537:444419` | 라이트 | ![](img/28537-444337__28537-444419.jpg) ![](img/28537-444337__28537-444419_p2.jpg) ![](img/28537-444337__28537-444419_p3.jpg) | 28 | 28개 열(화면) + toast 섹션 |
| MO · 단계 × 사용자 상태 | `28537:452314` | 라이트 | ![](img/28537-444337__28537-452314.jpg) ![](img/28537-444337__28537-452314_p2.jpg) | 27 | 27개 열 + popover·toast 섹션 |
| PC 빙고판 | `28537:460092` | 라이트 | ![](img/28537-444337__28537-460092.jpg) | 0 | 칸 색 규칙(blue/yellow/orange × lock/default/checked/loading) + `bingo_color_rule` |
| MO 빙고판 | `28537:461410` | 라이트 | ![](img/28537-444337__28537-461410.jpg) | 0 |  |
| 시안 A__modal1 | `28537:462694` | 라이트 | ![](img/28537-444337__28537-462694.jpg) | 2 |  |
| 시안 A__modal2 | `28537:462851` | 라이트 | ![](img/28537-444337__28537-462851.jpg) | 3 | UID 선택(Select a UID to Participate) |
| 시안 A__modal3 | `28537:462922` | 라이트 | ![](img/28537-444337__28537-462922.jpg) | 2 |  |
| 시안 B__modal1 | `28537:463081` | 라이트 | ![](img/28537-444337__28537-463081.jpg) | 2 |  |
| 시안 B__modal2 | `28537:463008` | 라이트 | ![](img/28537-444337__28537-463008.jpg) | 3 |  |
| 시안 B__modal3 | `28537:462947` | 라이트 | ![](img/28537-444337__28537-462947.jpg) | 3 |  |
| modal4 | `28537:463217` | 라이트 | ![](img/28537-444337__28537-463217.jpg) | 3 |  |

### 화면 판정

**PC · 단계 × 사용자 상태** (`28537:444419`)

| 라벨(상태) | 노드 | 플랫폼 | 크기 | 무엇을 보여 주나 |
|---|---|---|---|---|
| PC · 사전공개 · 비회원 | `28537:444420` | Web | 1440x3235 | 사전공개 · 비회원(오픈 예정, 비활성 CTA) |
| PC · 사전공개 · 자격 UID 없음 | `28537:444666` | Web | 1440x3235 | 사전공개 · 자격 UID 없음(경고 배너) |
| PC · 사전공개 · 자격 UID 있음 | `28537:444912` | Web | 1440x3235 | 사전공개 · 자격 UID 있음 |
| PC · 집계 · 비회원/미참여 | `28537:445158` | Web | 1440x3953 | 집계 · 비회원/미참여(Calculating) |
| PC · 집계 · 참여 UID 잃음 (리워드 없음) | `28537:445502` | Web | 1440x4037 | 집계 · 참여 UID 잃음(리워드 없음) |
| PC · 결과 발표 · 미참여 | `28537:445847` | Web | 1440x3953 | 결과 발표 · 미참여 |
| PC · 지급 기간 · 미참여 | `28537:446191` | Web | 1440x3953 | 지급 기간 · 미참여 |
| PC · 지급 기간 · 참여 UID 잃음 (지급 후) | `28537:446536` | Web | 1440x4037 | 지급 기간 · 참여 UID 잃음(지급 후) |
| PC · 참여 기간 · 비회원 | `28537:446882` | Web | 1440x3961 | 참여 기간 · 비회원(Log in to Participate) |
| PC · 리더보드 · 완성자 0명 | `28537:447237` | Web | 1440x734 | 리더보드 · 완성자 0명(빈 상태) |
| PC · 랭킹 OFF 빙고판 · 참여 중 | `28537:447265` | Web | 1440x2915 | 랭킹 OFF 빙고판 · 참여 중 |
| PC · 빙고 Batch 지연 안내 | `28537:447558` | Web | 1440x4047 | 빙고 Batch 지연 안내 |
| popover | `28537:447976` | Web | 1440x1120 | 팝오버(설명) |
| PC · 참여 기간 · 자격 UID 없음 | `28537:448183` | Web | 1440x3961 | 참여 기간 · 자격 UID 없음(Link UID) |
| PC · 참여 기간 · 참여 전 | `28537:448538` | Web | 1440x3997 | 참여 기간 · 참여 전(Join NOW) |
| PC · 참여 기간 · 참여 UID 잃음 (고를 UID 있음) | `28537:448894` | Web | 1440x4045 | 참여 기간 · 참여 UID 잃음(고를 UID 있음 → Select a New UID) |
| PC · 참여 기간 · 참여 UID 잃음 (고를 UID 없음) | `28537:449250` | Web | 1440x4121 | 참여 기간 · 참여 UID 잃음(고를 UID 없음) |
| PC · 참여 기간 · 참여 중 | `28537:449610` | Web | 1440x4087 | 참여 기간 · 참여 중(빙고판 진행) |
| PC · 참여 기간 · 참여 중 (빙고판 완성) | `28537:450028` | Web | 1440x2809 | 참여 기간 · 참여 중(빙고판 완성) |
| PC · 집계 · 참여자 | `28537:450393` | Web | 1440x4047 | 집계 · 참여자 |
| PC · 결과 발표 · 참여자 | `28537:450771` | Web | 1440x4047 | 결과 발표 · 참여자 |
| PC · 지급 기간 · 참여자 | `28537:451149` | Web | 1440x4120 | 지급 기간 · 참여자 |
| PC · 결과 발표 · 어뷰징 제외자 | `28537:451547` | Web | 1440x3905 | 결과 발표 · 어뷰징 제외자 |
| PC · 노출 전 · 지급 종료 · 강제 종료 (404) - 시안 A | `28537:451920` | Web | 1440x800 | 노출 전·지급 종료·강제 종료(404) 시안 A |
| PC · 노출 전 · 지급 종료 · 강제 종료 (404) - 시안 B | `28537:451930` | Web | 1440x800 | 노출 전·지급 종료·강제 종료(404) 시안 B |
| event schedule__open | `28537:451942` | Web | 1440x302 | 이벤트 일정 펼침 |
| PC · 빙고판 구성 · 금액 칸만 | `28537:451992` | Web | 1440x1120 | 빙고판 구성 · 금액 칸만 |
| PC · 빙고판 구성 · 연속 칸만 | `28537:452145` | Web | 1440x1120 | 빙고판 구성 · 연속 칸만 |

**MO · 단계 × 사용자 상태** (`28537:452314`)

| 라벨(상태) | 노드 | 플랫폼 | 크기 | 무엇을 보여 주나 |
|---|---|---|---|---|
| MO · 사전공개 · 비회원 | `28537:452315` | mWeb | 375x4416 | 사전공개 · 비회원 |
| MO · 사전공개 · 자격 UID 없음 | `28537:452566` | mWeb | 375x4456 | 사전공개 · 자격 UID 없음 |
| MO · 사전공개 · 자격 UID 있음 | `28537:452817` | mWeb | 375x4456 | 사전공개 · 자격 UID 있음 |
| MO · 리더보드 · 완성자 0명 | `28537:453068` | mWeb | 375x764 | 리더보드 · 완성자 0명(빈 상태) |
| MO · 참여 기간 · 비회원 | `28537:453097` | mWeb | 375x5482 | 참여 기간 · 비회원 |
| MO · 참여 기간 · 자격 UID 없음 | `28537:453454` | mWeb | 375x5502 | 참여 기간 · 자격 UID 없음 |
| MO · 참여 기간 · 참여 전 | `28537:453811` | mWeb | 375x5538 | 참여 기간 · 참여 전 |
| MO · 참여 기간 · 참여 UID 잃음 (고를 UID 있음) | `28537:454169` | mWeb | 375x5482 | 참여 기간 · 참여 UID 잃음(고를 UID 있음) |
| MO · 참여 기간 · 참여 UID 잃음 (고를 UID 없음) | `28537:454526` | mWeb | 375x5558 | 참여 기간 · 참여 UID 잃음(고를 UID 없음) |
| MO · 집계 · 비회원/미참여 | `28537:454887` | mWeb | 375x5480 | 집계 · 비회원/미참여 |
| MO · 집계 · 참여 UID 잃음 (리워드 없음) | `28537:455233` | mWeb | 375x5500 | 집계 · 참여 UID 잃음(리워드 없음) |
| MO · 결과 발표 · 미참여 | `28537:455579` | mWeb | 375x5460 | 결과 발표 · 미참여 |
| MO · 지급 기간 · 미참여 | `28537:455925` | mWeb | 375x5460 | 지급 기간 · 미참여 |
| MO · 지급 기간 · 참여 UID 잃음 (지급 후) | `28537:456272` | mWeb | 375x5480 | 지급 기간 · 참여 UID 잃음(지급 후) |
| MO · 결과 발표 · 참여자 | `28537:456619` | mWeb | 375x6092 | 결과 발표 · 참여자 |
| MO · 지급 기간 · 참여자 | `28537:456998` | mWeb | 375x6241 | 지급 기간 · 참여자 |
| MO · 결과 발표 · 어뷰징 제외자 | `28537:457396` | mWeb | 375x5990 | 결과 발표 · 어뷰징 제외자 |
| MO · 집계 · 참여자 | `28537:457770` | mWeb | 375x5976 | 집계 · 참여자 |
| MO · 참여 기간 · 참여 중 | `28537:458145` | mWeb | 375x6218 | 참여 기간 · 참여 중 |
| MO · 랭킹 OFF 빙고판 · 참여 중 | `28537:458566` | mWeb | 375x4658 | 랭킹 OFF 빙고판 · 참여 중 |
| MO · 빙고 Batch 지연 안내 | `28537:458869` | mWeb | 375x6330 | 빙고 Batch 지연 안내 |
| MO · 참여 기간 · 참여 중 (빙고판 완성) | `28537:459293` | mWeb | 375x4061 | 참여 기간 · 참여 중(빙고판 완성) |
| MO · 노출 전 · 지급 종료 · 강제 종료 (404) - 시안 A | `28537:459655` | mWeb | 375x800 | 노출 전·지급 종료·강제 종료(404) 시안 A |
| MO · 노출 전 · 지급 종료 · 강제 종료 (404) - 시안 B | `28537:459665` | mWeb | 375x800 | 노출 전·지급 종료·강제 종료(404) 시안 B |
| event schedule__open | `28537:459721` | mWeb | 375x550 | 이벤트 일정 펼침 |
| MO · 빙고판 구성 · 금액 칸만 | `28537:459766` | mWeb | 375x1548 | 빙고판 구성 · 금액 칸만 |
| MO · 빙고판 구성 · 연속 칸만 | `28537:459921` | mWeb | 375x1594 | 빙고판 구성 · 연속 칸만 |

**시안 A__modal1** (`28537:462694`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:462695` | Web | [PC] modal | 모달1 시안 A(PC 모달 / MO 바텀시트) |
| — | `28537:462766` | — | [MO] modal | 모달1 시안 A(PC 모달 / MO 바텀시트) |

**시안 A__modal2** (`28537:462851`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:462852` | Web | [PC] modal | 모달2 시안 A — Select a UID to Participate(미선택/선택) |
| — | `28537:462882` | — | [MO] modal | 모달2 시안 A — Select a UID to Participate(미선택/선택) |
| — | `28537:462902` | — | [MO] modal | 모달2 시안 A — Select a UID to Participate(미선택/선택) |

**시안 A__modal3** (`28537:462922`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:462923` | Web | [PC] modal | 모달3 시안 A |
| — | `28537:462933` | — | [MO] modal | 모달3 시안 A |

**시안 B__modal1** (`28537:463081`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:463082` | Web | [PC] modal | 모달1 시안 B |
| — | `28537:463143` | — | [MO] modal | 모달1 시안 B |

**시안 B__modal2** (`28537:463008`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:463009` | Web | [PC] modal | 모달2 시안 B — Select a UID to Participate(미선택/선택) |
| — | `28537:463035` | — | [MO] modal | 모달2 시안 B — Select a UID to Participate(미선택/선택) |
| — | `28537:463058` | — | [MO] modal | 모달2 시안 B — Select a UID to Participate(미선택/선택) |

**시안 B__modal3** (`28537:462947`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:462948` | Web | [PC] modal | 모달3 시안 B |
| — | `28537:462968` | — | [MO] modal | 모달3 시안 B |
| — | `28537:462988` | — | [MO] modal | 모달3 시안 B |

**modal4** (`28537:463217`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `28537:463218` | Web | [PC] modal | 모달4(PC/MO) |
| — | `28537:463542` | — | [MO] modal | 모달4(PC/MO) |
| — | `28537:463738` | — | [MO] modal | 모달4(PC/MO) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 모달 1~3 | 시안 A | 시안 A__modal1~3 | `28537:462694` · `28537:462851` · `28537:462922` | — | 옵션 카드 흰 바탕+테두리, MO 바텀시트에 핸들 없음(제목+X) | 「사용자 확인 필요」 — A/B 채택 표시 없음 |
| 〃 | 시안 B | 시안 B__modal1~3 | `28537:463081` · `28537:463008` · `28537:462947` | — | 옵션 카드 회색 채움, MO 바텀시트 상단 드래그 핸들 + X | 「사용자 확인 필요」 |
| 404(노출 전·지급 종료·강제 종료) | 시안 A / B | PC·MO 단계 × 사용자 상태 | PC `28537:451920`/`28537:451930` · MO `28537:459655`/`28537:459665` | — | 같은 상태 두 시안 | 「사용자 확인 필요」 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 경고 배너(주황) | Bingo | 사전공개·참여 기간 자격 UID 없음 | `28537-444337__28537-452314.jpg` | `No Eligible Bitget UID` |
| 오류 배너(빨강) | Bingo | 참여 UID 잃음 | `28537-444337__28537-452314.jpg` | `You Can No Longer Participate with This UID` |
| 비활성 버튼 | Bingo | 사전공개 `Opens on Oct 3, 09:00` · 집계 `Calculating` · `Participation Ended` | `28537-444337__28537-444419.jpg` | 회색 CTA |
| 빈 상태 | Bingo | 리더보드 완성자 0명 `No one has completed the board yet.` | `28537-444337__28537-444419.jpg` | |
| 다이얼로그/바텀시트(라디오 선택, Next 비활성) | Bingo | 시안 A/B modal2 | `28537-444337__28537-462851.jpg` · `28537-444337__28537-463008.jpg` | `Select a UID to Participate` · `Only eligible Bitget UIDs are shown.` |
| 토스트 | Bingo | PC `28537:451987` · MO `28537:459712` | `28537-444337__28537-444419_p3.jpg` · `28537-444337__28537-452314_p2.jpg` | |
| 팝오버 | Bingo | MO `28537:459677` | `28537-444337__28537-452314_p2.jpg` | 설명 팝오버 |
| 로딩(칸) | Bingo | PC 빙고판 `*_loading` | `28537-444337__28537-460092.jpg` | blue/yellow/orange 칸 로딩 |
| 카운트다운 칩 | Bingo | 참여 기간 `9D 23H 59m 21s` | `28537-444337__28537-452314.jpg` | |
| 배지 | Bingo | `Pending` 주황 배지(내 보상), `Full Board Only` | `28537-444337__28537-452314.jpg` | |


## [MAX-659] TetherMax Point (`13033:27246`)

TP(TetherMax Point) 탭: 보유 TP · TP/Earning History/Real-Time Ranking 칩 · 스와이프로 받기 팝업 · FAQ. `Section 7~12`는 구 GNB·좌측 메뉴 레이아웃의 초기판, `Web/mWeb/mAPP`이 새 GNB판.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Web › TP - lightMode (2476x15346) | `13033:28081` | 라이트 | ![](img/13033-27246__13033-28081.jpg) ![](img/13033-27246__13033-28081_p2.jpg) | 7 | 7화면 + 스와이프 받기 팝업 3단계 |
| Web › TP - lightMode (2476x13320) | `13033:28084` | 다크(이름은 라이트) | ![](img/13033-27246__13033-28084.jpg) ![](img/13033-27246__13033-28084_p2.jpg) | 6 | **이름은 lightMode지만 캡처상 다크** — 다크판 |
| mWeb › TP - lightMode | `13033:28067` | 라이트 | ![](img/13033-27246__13033-28067.jpg) ![](img/13033-27246__13033-28067_p2.jpg) | 6 |  |
| mWeb › TP - darkMode | `13033:28068` | 다크 — 제외 | — | 6 |  |
| mAPP › TP - lightMode | `13033:28305` | 라이트 | ![](img/13033-27246__13033-28305.jpg) ![](img/13033-27246__13033-28305_p2.jpg) | 9 |  |
| mAPP › TP - darkMode | `13033:28315` | 다크 — 제외 | — | 9 |  |
| Section 7 | `13033:27910` | 라이트 | ![](img/13033-27246__13033-27910.jpg) | 2 | 초기판 Web/mWeb + FAQ 아코디언·스와이프 버튼 컴포넌트 |
| Section 8 | `13033:27247` | 라이트 | ![](img/13033-27246__13033-27247.jpg) | 2 | 초기판 |
| Section 9 | `13033:27539` | 라이트 | ![](img/13033-27246__13033-27539.jpg) | 2 | 초기판 |
| Section 10 | `13033:27714` | 라이트 | ![](img/13033-27246__13033-27714.jpg) | 2 | 초기판 |
| Section 11 | `13033:28096` | 라이트 | ![](img/13033-27246__13033-28096.jpg) ![](img/13033-27246__13033-28096_p2.jpg) | 3 | 초기판(한국어 실시간 랭킹) |
| Section 12 | `13033:27796` | 라이트 | ![](img/13033-27246__13033-27796.jpg) | 2 | 초기판 |
| 팝업 | `13033:28040` | 라이트 | ![](img/13033-27246__13033-28040.jpg) | 0 | 초기판 팝업(Section 6) |
| QA in progress | `14537:121464` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |

### 화면 판정

**Web › TP - lightMode (2476x15346)** (`13033:28081`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Fix width to fit footer. Grey space border around footer. To fix: To fix footer to fit the | `12565:360745` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `12565:376145` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `12565:383691` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `13992:423122` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `12565:379010` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `12565:381879` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |
| — | `12565:380259` | Web | Web | TP 탭 Web — 메인(정보 배너·히어로·How To Earn·FAQ)/Earning History/Real-Time Ranking/빈 상태 |

**mWeb › TP - lightMode** (`13033:28067`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12565:265042` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |
| — | `12565:366633` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |
| — | `12565:377660` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |
| — | `12565:379692` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |
| — | `12565:381399` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |
| — | `12565:383076` | mWeb | mWeb/allPartnerExchange | TP 탭 mWeb — 메인/내역/랭킹 |

**mAPP › TP - lightMode** (`13033:28305`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:28309` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13033:28310` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13033:28311` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13033:28312` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13033:28313` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13040:157897` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13040:157507` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13040:158380` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |
| — | `13040:158511` | mAPP | mWeb/allPartnerExchange | TP 탭 mAPP — 메인/내역/랭킹/받기 팝업 |

**Section 7** (`13033:27910`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:27911` | — | TMX 포인트 | 초기판 TP 메인(Web/mWeb) |
| — | `13033:28002` | — | Frame 427322121 | 초기판 TP 메인(Web/mWeb) |

**Section 8** (`13033:27247`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:27248` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |
| — | `13033:27443` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |

**Section 9** (`13033:27539`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:27540` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |
| — | `13033:27657` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |

**Section 10** (`13033:27714`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:27715` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |
| — | `13033:27770` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |

**Section 11** (`13033:28096`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:28097` | — | TMX 포인트 | 초기판 실시간 랭킹(한국어) |
| — | `13033:28198` | — | TMX 포인트 | 초기판 실시간 랭킹(한국어) |
| — | `13033:28247` | — | TMX 포인트 | 초기판 실시간 랭킹(한국어) |

**Section 12** (`13033:27796`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `13033:27797` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |
| — | `13033:27874` | — | TMX 포인트 | 초기판 TP(Web/mWeb) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| TP 메인 | 초기판 | Section 7 | `13033:27910` | — | 구 GNB(`Partner Exchanges … tetherMax Point · My Portfolio`), 좌측 메뉴(tetherMax Point/Invite Friends), `Hold on! You have tetherMax Points waiting` 배너, `Earn TP!` 목록 | 구판 |
| 〃 | 새 GNB판 | Web › TP - lightMode | `12565:360745` | — | 새 GNB, 상단 탭(TetherMax Point (TP) / Invite Friends), 정보 배너 `View`, 다크 히어로 배너, `How To Earn` 목록 | **현행** — 플랫폼별(Web/mWeb/mAPP)·라이트/다크 세트가 갖춰진 판 |
| 실시간 랭킹 | 초기판 | Section 11 | `13033:28096` | — | 한국어, 순위·누적 TP 표 | 구판 |
| 〃 | 새 GNB판 | Web › TP - lightMode | `12565:381879` 등 | — | `MY RANK` 카드 + 트로피 1~3위 | **현행** |
| Web TP | 「lightMode」 이름의 다크판 | Web › TP - lightMode(`13033:28084`) | `13033:28085` 등 | — | 실제 다크, 첫 화면 라벨 `Discussed with Terry for improvement, using card design` | 다크판 — 섹션 이름 오기 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 스와이프 버튼 3상태 | TP | 팝업 `You can now claim 30.01 TP` | `13033-27246__13033-28081.jpg` | 기본 → 드래그 중 → `I received 30.01 TP` |
| 정보 배너(닫기/View) | TP | 상단 `You have TetherMax Points available to claim.` | `13033-27246__13033-28081.jpg` | 파란 정보 배너 |
| 아코디언(FAQ) 열림/닫힘 | TP | FAQ | `13033-27246__13033-27910.jpg` | |
| 기간 칩 | TP | Earning History `Today · 7D · 30D · 90D · Set Custom Range` | `13033-27246__13033-28081.jpg` | |
| 페이지네이션 | TP | Earning History | `13033-27246__13033-28081.jpg` | |
| 로딩/준비 중 문구 | TP | `Preparing payback deduction details` | `13033-27246__13033-27910.jpg` | 비활성 입력형 안내 |


## [MAX-587] Invite Friends (`10981:111026`)

친구 초대(Invite / Invitation Reward 탭): 초대 코드 발급 → 코드·링크 복사 → 초대 보상 · 보상 내역 · 추천 상세. `Section 1~5`는 구 GNB 초기판.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Web › Invite Friends - lightMode | `12565:252514` | 라이트 | ![](img/10981-111026__12565-252514.jpg) ![](img/10981-111026__12565-252514_p2.jpg) | 11 |  |
| Web › Invite Friends - darkMode | `12565:252515` | 다크 — 제외 | — | 11 |  |
| mWeb › Invite Friends - lightMode | `12565:252513` | 라이트 | ![](img/10981-111026__12565-252513.jpg) ![](img/10981-111026__12565-252513_p2.jpg) | 9 |  |
| mWeb › Invite Friends - darkMode | `12565:252512` | 다크 — 제외 | — | 9 |  |
| mAPP › Invite Friends - lightMode (1) | `12565:256837` | 라이트 | ![](img/10981-111026__12565-256837.jpg) | 7 |  |
| mAPP › Invite Friends - lightMode (2) | `12565:263286` | 다크(이름은 라이트) | ![](img/10981-111026__12565-263286.jpg) | 7 | **이름은 lightMode지만 캡처상 다크** — 다크판 |
| Referral Friends | `15213:211010` | 라이트 | ![](img/10981-111026__15213-211010.jpg) | 6 | 추천 상세(Web): 결과 있음·10명 초과·검색 결과 없음·빈 상태·거래소 10개 초과 |
| Referral Friends - darkMode | `15213:211011` | 다크 — 제외 | — | 6 |  |
| mobile | `15312:453708` | 라이트 | ![](img/10981-111026__15312-453708.jpg) | 6 | 추천 상세(모바일) |
| mobile - darkMode | `15312:453709` | 다크 — 제외 | — | 6 |  |
| MAXOP-236 [Added on 15th June] | `15798:102378` | 라이트 | ![](img/10981-111026__15798-102378.jpg) ![](img/10981-111026__15798-102378_p2.jpg) | 12 | 보상 내역(누적 초대 보상) + 빈 상태 |
| Section 1 | `12565:256825` | 라이트 | ![](img/10981-111026__12565-256825.jpg) | 2 | 초기판(일반 유저) |
| Section 2 | `12565:256827` | 라이트 | ![](img/10981-111026__12565-256827.jpg) ![](img/10981-111026__12565-256827_p2.jpg) | 2 | 초기판 |
| Section 3 | `12565:256828` | 라이트 | ![](img/10981-111026__12565-256828.jpg) | 2 | 초기판 |
| Section 4 | `12565:256829` | 라이트 | ![](img/10981-111026__12565-256829.jpg) | 3 | 초기판 + 팝업 |
| Section 5 | `12565:256830` | 라이트 | ![](img/10981-111026__12565-256830.jpg) | 2 | 초기판 |
| Not needed as per Matthew's comment | `13060:114846` | 라이트 | ![](img/10981-111026__13060-114846.jpg) | 4 | 폐기 표시 섹션 |
| 리워드 조회 (mWeb 375x962, 최상위) | `15750:78334` | 라이트 | ![](img/10981-111026__15750-78334.jpg) | 1 |  |
| 리워드 조회 (mWeb 375x812, 최상위) | `15750:78400` | 라이트 | ![](img/10981-111026__15750-78400.jpg) | 1 |  |
| 리워드 조회 (Web 1920x938, 최상위) | `15750:78413` | 라이트 | ![](img/10981-111026__15750-78413.jpg) | 1 |  |
| 리워드 조회 (Web 1920x843, 최상위) | `15750:78472` | 라이트 | ![](img/10981-111026__15750-78472.jpg) | 1 |  |
| QA | `14175:474052` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |
| QA for referral page | `15476:53708` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |

### 화면 판정

**Web › Invite Friends - lightMode** (`12565:252514`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12503:258116` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12565:244240` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12503:281300` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `14175:476417` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `14175:476517` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12503:283042` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12547:95646` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12565:239008` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12565:240627` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `13051:55080` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |
| — | `12565:241395` | Web | Web | 친구 초대 Web — 코드 발급 전/코드·링크/복사 토스트/Invitation Reward 빈 상태·목록 |

**mWeb › Invite Friends - lightMode** (`12565:252513`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12503:283598` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| — | `12547:229272` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| When there more than 3 UIDs | `13051:54465` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| When user has not link UID | `12565:231178` | mWeb | mWeb/allPartnerExchange | UID 미연동 안내 |
| — | `12565:229925` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| — | `12474:203982` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| — | `12503:260211` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| — | `12503:282296` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |
| — | `12565:243367` | mWeb | mWeb/allPartnerExchange | 친구 초대 mWeb — 코드 발급 전/코드·링크/토스트/보상 탭 |

**mAPP › Invite Friends - lightMode (1)** (`12565:256837`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12565:261805` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:263116` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:263118` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:263117` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:260879` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:261168` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |
| — | `12565:261414` | mAPP | mWeb/allPartnerExchange | 친구 초대 앱 — 코드 발급 전/코드·링크/보상(출금·UID 선택·UID 연동 필요) |

**Referral Friends** (`15213:211010`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Default for when there are results | `15170:208042` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |
| Default for when there are information in user code | `15213:210111` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |
| When there are more than 10 exchange | `15213:210408` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |
| When there are more than 10 users | `15170:209478` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |
| Empty State | `15170:209058` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |
| When there are no matching results | `15170:209281` | Web | Web | 추천 상세 Web(결과 있음/10명 초과/검색 결과 없음/빈 상태/거래소별) |

**mobile** (`15312:453708`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Default for when there are results | `15213:254044` | mWeb | mWeb/allPartnerExchange | 추천 상세 모바일 |
| — | `15409:82816` | mWeb | mWeb/allPartnerExchange | 추천 상세 모바일 |
| When there are more than 10 users | `15213:284497` | mWeb | Frame 1984078473 | 추천 상세 모바일 |
| — | `15213:284539` | mWeb | Footer/mWeb | 푸터 조각 |
| When there are no matching results | `15213:284289` | mWeb | mWeb/allPartnerExchange | 추천 상세 모바일 |
| Empty State | `15245:304419` | mWeb | mWeb/allPartnerExchange | 추천 상세 모바일 |

**MAXOP-236 [Added on 15th June]** (`15798:102378`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15798:99716` | Web | Web | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| Empty State | `15798:100642` | Web | Web | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| Empty State | `15798:100643` | Web | Web | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| — | `15798:99717` | Web | Web | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| — | `15798:101258` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| Empty State | `15798:102233` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| Empty State | `15798:102238` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| — | `15798:101397` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| mobile APP | `15798:102975` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| mobile APP | `15798:103329` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| mobile APP | `15798:103324` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |
| mobile APP | `15798:103330` | mWeb | mWeb/allPartnerExchange | MAXOP-236 초대 보상 내역(목록/빈 상태, Web·mWeb·앱) |

**Section 1** (`12565:256825`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11731:304245` | — | 친구초대-일반유저 | 초기판 친구 초대(일반 유저) |
| — | `11731:305566` | — | 친구초대-일반유저 | 초기판 친구 초대(일반 유저) |

**Section 2** (`12565:256827`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11731:304281` | — | 친구초대-일반유저 | 초기판 친구 초대 |
| — | `11731:305636` | — | 친구초대-일반유저 | 초기판 친구 초대 |

**Section 3** (`12565:256828`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11731:304323` | — | 친구초대-일반유저 | 초기판 친구 초대 |
| — | `11731:305677` | — | 친구초대-일반유저 | 초기판 친구 초대 |

**Section 4** (`12565:256829`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11731:304353` | — | 친구초대-일반유저 | 초기판 친구 초대 + 예상 페이백 모달 |
| — | `11731:305705` | — | 친구초대-일반유저 | 초기판 친구 초대 + 예상 페이백 모달 |
| — | `11731:305754` | — | 예상 페이백 계산 내역 모달(연결 완료) | 초기판 친구 초대 + 예상 페이백 모달 |

**Section 5** (`12565:256830`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11731:304401` | — | 초대받은 유저 | 초기판 초대받은 유저 |
| — | `11731:305601` | — | 초대받은 유저 | 초기판 초대받은 유저 |

**Not needed as per Matthew's comment** (`13060:114846`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12565:242428` | Web | Web | 폐기된 계정 생성 화면 |
| — | `12565:238145` | mAPP | mAPP/createAccount/email | 폐기된 계정 생성 화면 |
| — | `12565:249733` | mAPP | mAPP/createAccount/email | 폐기된 계정 생성 화면 |
| — | `15039:394951` | mAPP | mAPP/createAccount/email | 폐기된 계정 생성 화면 |

**리워드 조회 (mWeb 375x962, 최상위)** (`15750:78334`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15750:78334` | — | 리워드 조회 | 리워드 조회(단독) |

**리워드 조회 (mWeb 375x812, 최상위)** (`15750:78400`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15750:78400` | — | 리워드 조회 | 리워드 조회(단독) |

**리워드 조회 (Web 1920x938, 최상위)** (`15750:78413`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15750:78413` | Web | 리워드 조회 | 리워드 조회(단독) |

**리워드 조회 (Web 1920x843, 최상위)** (`15750:78472`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `15750:78472` | Web | 리워드 조회 | 리워드 조회(단독) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 친구 초대 메인 | 초기판 | Section 1~5 | `12565:256825` 등 | — | 구 GNB·좌측 메뉴 레이아웃 | 구판 |
| 〃 | 새 GNB판 | Web/mWeb/mAPP lightMode | `12565:252514` 등 | — | 상단 탭(TetherMax Point (TP)/Invite Friends) + Invite/Invitation Reward 세그먼트 | **현행** |
| 보상 내역 | MAXOP-236 | MAXOP-236 [Added on 15th June] | `15798:102378` | 15 June · MAXOP-236 | 누적 초대 보상 + 날짜별 거래소 목록(무한 스크롤) + 빈 상태 | **현행**(추가 화면) |
| 〃 | 리워드 조회(최상위 단독) | (최상위) | `15750:78334` · `15750:78413` 등 | — | 같은 목적의 단독 프레임 4개 | 「사용자 확인 필요」 — MAXOP-236과 관계 불명 |
| 폐기 | Not needed | Not needed as per Matthew's comment | `13060:114846` | — | 섹션 이름에 불필요 명시 | 폐기 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 토스트(복사) | Invite | `Invite code copied` · `Invite link copied` | `10981-111026__12565-252514.jpg` | 하단 검정 토스트 |
| 빈 상태 + 보조 CTA | Invite | `You haven't invited any friends yet` + `Share Invitation Code` | `10981-111026__12565-252514.jpg` | |
| 빈 상태(텍스트만) | Invite | `You don't have any friend invitation rewards yet.` | `10981-111026__15798-102378.jpg` | |
| 검색 결과 없음 | Invite | `No matching user found. Try again.` | `10981-111026__15213-211010.jpg` | |
| 빈 상태(추천) | Invite | `No referrals yet. Share your link to get started.` | `10981-111026__15213-211010.jpg` | |
| 다이얼로그(선택형, 확인 비활성) | Invite mAPP | `Select a UID to withdraw referral rewards` | `10981-111026__12565-263286.jpg`(다크) | 라이트판은 `12565:256837` |
| 다이얼로그(Link 유도) | Invite mAPP | `UID Link Required` | `10981-111026__12565-263286.jpg`(다크) | |
| 비활성 버튼 | Invite mAPP | 잔액 0일 때 `Withdraw` 회색 | `10981-111026__12565-256837.jpg` | |
| 탭 카운트 배지 | Invite mAPP | `Exchange UID Registration Status 31` | `10981-111026__12565-256837.jpg` | |


## [MAX-425] Partner Hub (`4519:38131`)

파트너 허브: 대시보드(출금 가능액·초대 보상 추이·거래소 UID·전환 퍼널·서브 계정 분포·성장 추이) · 초대 보상 내역(필터) · 서브 계정 · 출금 흐름.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| mWeb/partnerHub | `4960:92199` | 라이트 | ![](img/4519-38131__4960-92199.jpg) ![](img/4519-38131__4960-92199_p2.jpg) | 34 | Member Growth Trend·invite reward trend 하위 섹션 포함 |
| mWeb/partnerHub/Dark | `6335:72045` | 다크 — 제외 | — | 25 |  |
| mAPP/partnerHub | `5863:44785` | 라이트 | ![](img/4519-38131__5863-44785.jpg) ![](img/4519-38131__5863-44785_p2.jpg) | 25 |  |
| Web (`5702:10292`) | `5702:10292` | 라이트 | ![](img/4519-38131__5702-10292.jpg) ![](img/4519-38131__5702-10292_p2.jpg) | 17 |  |
| Web (`6335:99135`) | `6335:99135` | 다크 — 제외 | — | 17 | 이름은 `Web`, 캡처 확인 결과 다크판 |
| Toast message design to be used for light and dark mode | `7993:146604` | 라이트 | ![](img/4519-38131__7993-146604.jpg) | 2 | 서브 계정 + `Switched to Member` 토스트(라이트·다크) |
| MAXOP - 156 (lightMode/darkMode) | `10739:222395` | 라이트 | ![](img/4519-38131__10739-222395.jpg) | 0 | All Types 바텀시트 Confirm 비활성/활성 |
| emptyState (최상위) | `8135:173394` | 라이트 | ![](img/4519-38131__8135-173394.jpg) | 0 | 빈 상태 컴포넌트 |
| emptyState (다크, 최상위) | `8135:173466` | 다크 — 제외 | — | 0 |  |

### 화면 판정

**mWeb/partnerHub** (`4960:92199`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Dashboard | `4895:26609` | mWeb | mWeb/PartnerHub | 파트너 허브 대시보드 |
| Partner rate confirmation modal | `4936:60725` | mWeb | mWeb/PartnerHub | 파트너 요율 확인 모달 |
| Member ID (TUID) tap → Linked UID list modal | `4936:65393` | mWeb | mWeb/PartnerHub | 멤버 ID 탭 → 연동 UID 목록 모달 |
| Advocate promotion to Partner | `4936:68369` | mWeb | mWeb/PartnerHub | 파트너 승격 확인 |
| Advocate rate edit | `4936:79698` | mWeb | mWeb/PartnerHub | 요율 수정 |
| Partner rate confirmation modal | `4936:61824` | mWeb | Backdrop | 파트너 요율 확인 모달 |
| Member ID (TUID) tap → Linked UID list modal | `4936:65879` | mWeb | Backdrop | 멤버 ID 탭 → 연동 UID 목록 모달 |
| When there are more than 5 exchanges (open full modal) | `6266:13382` | mWeb | Frame | 거래소 5개 초과 전체 모달 |
| Advocate promotion to Partner | `4936:68855` | mWeb | Backdrop | 파트너 승격 확인 |
| Advocate rate edit | `4936:80184` | mWeb | Backdrop | 요율 수정 |
| — | `4923:56476` | mWeb | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| No members (Day 0) | `5568:26624` | mWeb | mWeb/PartnerHub | 멤버 없음(Day 0) 빈 상태 |
| Withdrawal flow | `5654:106902` | mWeb | mWeb/PartnerHub | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |
| Partner Hub info | `5753:62621` | mWeb | Frame 1984078430 | 파트너 허브 안내 모달 |
| onScroll | `5691:115618` | mWeb | mWeb/PartnerHub | 스크롤 시 헤더 축약 |
| Select start/end date | `5470:56202` | mWeb | <MobileDatePicker> | 날짜 범위 선택 피커 |
| Select start/end date | `5691:114833` | mWeb | <MobileDatePicker> | 날짜 범위 선택 피커 |
| Sub-Account | `5702:17964` | mWeb | mWeb/PartnerHub | 서브 계정 상세 |
| Advocate promotion to Partner | `5774:62745` | mWeb | Frame 1984078437 | 파트너 승격 확인 |
| Advocate rate edit | `5774:63079` | mWeb | Frame 1984078438 | 요율 수정 |
| Switch (downgrade) to a General user. | `5774:63116` | mWeb | Frame 1984078440 | 일반 회원으로 강등 확인 |
| No results | `5702:59569` | mWeb | mWeb/PartnerHub | 결과 없음 |
| Select Types | `5702:60247` | mWeb | mWeb/PartnerHub | 유형 선택 드롭다운/시트 |
| Select Status | `5702:63591` | mWeb | mWeb/PartnerHub | 상태 선택 드롭다운/시트 |
| 1 type selected | `5702:65278` | mWeb | mWeb/PartnerHub | 유형 1개 선택 |
| More than 1 type selected | `5702:65945` | mWeb | mWeb/PartnerHub | 유형 1개 선택 |
| 1 type selected | `5702:62269` | mWeb | mWeb/PartnerHub | 유형 1개 선택 |
| More than 1 type selected | `5702:62933` | mWeb | mWeb/PartnerHub | 유형 1개 선택 |
| Entrypoint from dashboard | `5721:69806` | mWeb | mWeb/landingPage | 진입점, 대시보드 |
| Entrypoint from Profile (my page) | `5720:60305` | mWeb | mWeb/landingPage/Post-login | 진입점, 프로필(마이페이지) |
| Invite Reward History | `5837:114278` | mWeb | mWeb/PartnerHub | 초대 보상 내역 |
| No results | `5863:76101` | mWeb | mWeb/PartnerHub | 결과 없음 |
| Withdrawal flow | `6216:42106` | mWeb | Backdrop | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |
| Withdrawal flow | `6216:42153` | mWeb | Backdrop | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |

**mAPP/partnerHub** (`5863:44785`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Dashboard | `5863:44995` | mAPP | mWeb/PartnerHub | 파트너 허브 대시보드 |
| — | `5863:47686` | mAPP | Terms&NotesExpanded | 이용 약관(Terms & Conditions) 펼침 |
| No members (Day 0) | `5863:48143` | mAPP | mWeb/PartnerHub | 멤버 없음(Day 0) 빈 상태 |
| Withdrawal flow | `5863:48334` | mAPP | mWeb/PartnerHub | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |
| onScroll | `5863:49569` | mAPP | mWeb/PartnerHub | 스크롤 시 헤더 축약 |
| Members | `5863:50939` | mAPP | mWeb/PartnerHub | 서브 계정(멤버) 목록 |
| Advocate promotion to Partner | `5863:51436` | mAPP | mWeb/PartnerHub | 파트너 승격 확인 |
| Advocate rate edit | `5863:51945` | mAPP | mWeb/PartnerHub | 요율 수정 |
| Switch (downgrade) to a General user. | `5863:52453` | mAPP | mWeb/PartnerHub | 일반 회원으로 강등 확인 |
| No results | `5863:52961` | mAPP | mWeb/PartnerHub | 결과 없음 |
| Select Types | `5863:53056` | mAPP | mWeb/PartnerHub | 유형 선택 드롭다운/시트 |
| Select Status | `5863:53545` | mAPP | mWeb/PartnerHub | 상태 선택 드롭다운/시트 |
| 1 type selected | `5863:54034` | mAPP | mWeb/PartnerHub | 유형 1개 선택 |
| More than 1 type selected | `5863:54523` | mAPP | mWeb/PartnerHub | 유형 1개 선택 |
| 1 type selected | `5863:55012` | mAPP | mWeb/PartnerHub | 유형 1개 선택 |
| More than 1 type selected | `5863:55501` | mAPP | mWeb/PartnerHub | 유형 1개 선택 |
| Invite Reward History | `5863:56308` | mAPP | mWeb/PartnerHub | 초대 보상 내역 |
| mobileAPP - dashboard | `5863:61674` | mAPP | mAPP/LP | 진입점, 앱 대시보드 |
| mobileAPP - Profile (my page) | `5863:61843` | mAPP | mAPP/LP | 진입점, 앱 프로필 |
| Show toast when link copied | `6128:58550` | mAPP | mWeb/PartnerHub | 링크 복사 토스트 |
| Select start/end date | `6128:70846` | mAPP | <MobileDatePicker> | 날짜 범위 선택 피커 |
| Select start/end date | `6128:70847` | mAPP | <MobileDatePicker> | 날짜 범위 선택 피커 |
| No results | `6128:70848` | mAPP | mWeb/PartnerHub | 결과 없음 |
| Withdrawal flow | `6377:115939` | mAPP | Backdrop | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |
| Withdrawal flow | `6377:115986` | mAPP | Backdrop | 출금 흐름(확인 모달·퍼즐 인증·완료 토스트) |

**Web (`5702:10292`)** (`5702:10292`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Multi-select ‘All Types’ | `6322:65161` | Web | Desktop - 7 | 유형 다중 선택(All Types) 모달 |
| Partner rate confirmation modal | `5702:10874` | Web | Desktop - 6 | 파트너 요율 확인 모달 |
| Search Member ID | `5702:11673` | Web | Web | 멤버 ID 검색 |
| Member ID not found | `6335:68161` | Web | Web | 멤버 ID 결과 없음 |
| Exchanges selected | `5702:11885` | Web | Web | 기간 선택(날짜 피커) |
| — | `5702:12118` | Web | Web | 초대 보상 내역 기간 선택 진행(날짜 피커 열림) |
| — | `5702:12351` | Web | Web | 초대 보상 내역 기간 선택 진행(날짜 피커 열림) |
| Loading state | `5702:12582` | Web | Web | 로딩 상태 |
| No results | `6322:66795` | Web | Web | 결과 없음 |
| Search by member ID | `5702:12632` | Web | Frame 1948757815 | 멤버 ID 검색 |
| Multi-Select Types | `5702:12846` | Web | Web | 유형 선택 드롭다운/시트 |
| Multi-Select Status | `5702:13127` | Web | Web | 상태 선택 드롭다운/시트 |
| Members | `5702:13546` | Web | Web | 서브 계정(멤버) 목록 |
| Entrypoint | `5721:70340` | Web | Web | 진입점, 대시보드 |
| Invite Reward History | `5837:117520` | Web | Web | 초대 보상 내역 |
| Dashboard | `6042:45341` | Web | Web | 파트너 허브 대시보드 |
| — | `6128:83935` | Web | Frame | Exchange UIDs 전체 목록 모달(Web) |

**Toast message design to be used for light and dark mode** (`7993:146604`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `7993:146152` | Web | Web | 서브 계정 + Switched to Member 토스트 |
| — | `7993:146605` | Web | Web | 서브 계정 + Switched to Member 토스트 |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| Web 전체 | `Web` 2개 | Web `5702:10292` / Web `6335:99135` | 같은 17화면 구성 | — | 앞은 라이트, 뒤는 다크(이름 동일) | 라이트 = `5702:10292` |
| All Types 선택 | 기본 | mWeb/mAPP `Select Types` | `5702:60247` · `5863:53056` | — | 바텀시트 | 보조 |
| 〃 | MAXOP-156 | MAXOP - 156 | `10739:222210`(light) | MAXOP-156 | 미선택 Confirm 비활성, 선택 시 활성 | **현행** — MAXOP 개정 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 빈 상태 | Partner Hub | `8135:173394` | `4519-38131__8135-173394.jpg` | 차트·목록용 빈 상태 |
| 빈 상태(차트) | Partner Hub | Growth/Invite Reward Trend `Empty State` | `4519-38131__4960-92199.jpg` | 0값 차트 |
| 결과 없음 | Partner Hub | `No results found` / `No results found for 1234567890` | `4519-38131__5702-10292.jpg` | |
| 로딩 상태 | Partner Hub Web | `5702:12582` Loading state | `4519-38131__5702-10292_p2.jpg` | |
| 인라인 경고 | Partner Hub | `Minimum withdrawal amount 50 USDT` + 비활성 Withdraw | `4519-38131__4960-92199.jpg` | 금액 미달 |
| 확인 다이얼로그 | Partner Hub | `Confirm Withdrawal?` (거래소·UID·금액) | `4519-38131__4960-92199.jpg` | 출금 전 확인 |
| 퍼즐 인증 → 성공 | Partner Hub | Withdrawal flow | `4519-38131__4960-92199.jpg` | `Verification Success` |
| 성공 토스트 | Partner Hub | `Withdrawal request submitted.` · `Switched to Member` | `4519-38131__4960-92199.jpg` · `4519-38131__7993-146604.jpg` | |
| 토스트(복사) | Partner Hub | `Link Copied` | `4519-38131__4960-92199.jpg` | |
| 상태 배지 | Partner Hub | 출금 `Pending` · 유형 `Partner/Affiliate/Member` · 상태 `Active/Idle/Inactive` | `4519-38131__7993-146604.jpg` | |
| 바텀시트(체크, Confirm 비활성) | Partner Hub | MAXOP-156 | `4519-38131__10739-222395.jpg` | |
| 날짜 피커 | Partner Hub | Select start/end date · Today/Selected 표기 | `4519-38131__4960-92199.jpg` | |
| 툴팁 | Partner Hub Web | onHover tooltip · Partner Hub infotip | `4519-38131__5702-10292.jpg` | |


## [MAX-] Quiz (`19604:22232`)

「Earn Cashback While You Learn to Trade Smarter」 학습 퀴즈: 랜딩(아티클 카드) · 아티클 모듈 · 문항 · 결과 모달 · GNB(Rewards Hub/Discover).

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| 퀴즈 | `19604:31401` | 라이트 | ![](img/19604-22232__19604-31401.jpg) | 4 | 랜딩(앰배서더 사진 히어로) + 카드 상태 + 토스트 디자인 |
| ysy removed | `27090:1357115` | 라이트 | ![](img/19604-22232__27090-1357115.jpg) ![](img/19604-22232__27090-1357115_p2.jpg) | 8 | 랜딩에서 앰배서더 사진 제거판 |
| Content Article Module pages | `19604:31764` | 라이트 | ![](img/19604-22232__19604-31764.jpg) ![](img/19604-22232__19604-31764_p2.jpg) | 7 |  |
| Quiz | `19604:32287` | 라이트 | ![](img/19604-22232__19604-32287.jpg) | 9 | 문항 화면 + 결과 모달(앰배서더/엄지 일러스트) |
| GNB | `19604:32575` | 라이트 | ![](img/19604-22232__19604-32575.jpg) | 9 | 라이트·다크 GNB 합본 + mWeb 메뉴(섹션 안에 다크 1화면 포함) |
| Coupon names & Expiry | `21111:285932` | 라이트 | ![](img/19604-22232__21111-285932.jpg) | 0 | 쿠폰 이름 3종 · 만료 90일 메모 |
| 1600×1200 | `21871:124059` | 라이트 | ![](img/19604-22232__21871-124059.jpg) | 1 | 배경 이미지 |
| ysy_white_table-update (최상위) | `22438:168250` | 라이트 | ![](img/19604-22232__22438-168250.jpg) | 1 | 이미지 소스 |
| Frame 1984078441 (최상위 mWeb) | `21871:143202` | 라이트 | ![](img/19604-22232__21871-143202.jpg) | 1 |  |
| Option 2 (Ignore this) | `19604:32440` | 제외(QA·참고·폐기) | — | 2 | 이름에 무시 표시 |
| Quiz QA Results | `21510:165823` | 제외(QA·참고·폐기) | — | 12 | QA 보드 |

### 화면 판정

**퀴즈** (`19604:31401`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `19604:31464` | Web | Not Signed In | 퀴즈 랜딩(앰배서더 사진) |
| — | `19604:31510` | — | Not Signed In | 퀴즈 랜딩(앰배서더 사진) |
| — | `19604:31578` | — | Not Signed In | 퀴즈 랜딩(앰배서더 사진) |
| — | `19604:31646` | Web | Not Signed In | 퀴즈 랜딩(앰배서더 사진) |

**ysy removed** (`27090:1357115`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `27090:1357234` | Web | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27096:1358740` | — | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27090:1357287` | — | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27090:1357364` | — | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27096:1358817` | — | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27090:1357440` | Web | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27091:6563` | Web | Not Signed In | 퀴즈 랜딩(사진 제거) |
| — | `27096:1358481` | Web | Not Signed In | 퀴즈 랜딩(사진 제거) |

**Content Article Module pages** (`19604:31764`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `19604:31765` | Web | Not Signed In, Module 1 | 콘텐츠 아티클 모듈(비로그인) |
| — | `19604:31824` | Web | Not Signed In, Module 3 | 콘텐츠 아티클 모듈(비로그인) |
| — | `19604:31955` | — | Not Signed In, Module 2 | 콘텐츠 아티클 모듈(비로그인) |
| — | `19604:32020` | — | Not Signed In, Module 4 | 콘텐츠 아티클 모듈(비로그인) |
| — | `19604:32085` | Web | Signed In, Module 1 | 콘텐츠 아티클 모듈(로그인) |
| — | `19604:32144` | Web | Signed In, Module 2 | 콘텐츠 아티클 모듈(로그인) |
| — | `19604:32207` | Web | Signed In, Module 3 | 콘텐츠 아티클 모듈(로그인) |

**Quiz** (`19604:32287`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `19604:32288` | Web | Quiz 1 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32311` | — | Quiz 4 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32356` | — | Quiz 5 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32402` | Web | Frame 1984078442 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32424` | Web | Frame 1984078756 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32529` | Web | Quiz 2 | 퀴즈 문항(Submit)·결과 모달 |
| — | `19604:32552` | Web | Quiz 3 | 퀴즈 문항(Submit)·결과 모달 |
| — | `21327:164639` | Web | Frame 1984078442 | 퀴즈 문항(Submit)·결과 모달 |
| — | `21327:164661` | Web | Frame 1984078756 | 퀴즈 문항(Submit)·결과 모달 |

**GNB** (`19604:32575`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `19604:32651` | Web | 합체 | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:32791` | Web | 다크합체 | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:32844` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:32997` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:32998` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:33155` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:33156` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:33321` | mWeb | mWeb/landingPage/Post-login | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |
| — | `19604:33322` | — | GNB 프로토타입 확인 | GNB(Rewards Hub·Discover) Web/mWeb 메뉴 |

**1600×1200** (`21871:124059`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `21871:124067` | Web | 1600×1200 | 배경 이미지 |

**ysy_white_table-update (최상위)** (`22438:168250`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `22438:168250` | Web | ysy_white_table-update | 이미지 소스 |

**Frame 1984078441 (최상위 mWeb)** (`21871:143202`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| Shape with text / 퀴즈 : 가상 자산 거래 VS. 전통 금융 거래 퀴즈: 가상 자산 현물 거래 VS. 선물 거래 퀴즈 : 테더맥스 101   EXP | `21871:143202` | — | Frame 1984078441 | 퀴즈 카드(mWeb) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 퀴즈 랜딩 | 앰배서더판 | 퀴즈 | `19604:31464`(Web) · `19604:31510`(mWeb) | — | 히어로에 앰배서더(YSY) 사진 | 보조 |
| 〃 | 사진 제거판 | ysy removed | `27090:1357234`(Web) · `27096:1358740`(mWeb) | — | 사진 제거, 문구 중앙 정렬 | **현행으로 보임** — 섹션 이름이 제거 결정을 나타내고 노드가 더 뒤. 「사용자 확인 필요」 |
| 결과 모달 | 앰배서더 사진판 | Quiz | `19604:32287` 안 | — | Good Effort!/Nice Job!/Nice Try 3종(사진) | 보조 |
| 〃 | 일러스트판 | Quiz | `19604:32287` 안 오른쪽 | — | 엄지 일러스트 | 「사용자 확인 필요」 — ysy removed와 짝으로 보이나 표시 없음 |
| 퀴즈 결과 Web | Option 2 | Option 2 (Ignore this) | `19604:32440` | — | 대안 시안 | 폐기 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 카드 상태(시작/계속/완료/보상 받기/보기) | Quiz | 퀴즈 섹션 `상태` | `19604-22232__19604-31401.jpg` | `Start Learning` → `Continue` → `Completed` 배지 + `Claim reward` → `View` |
| 성공 토스트 | Quiz | 토스트 메세지 디자인 | `19604-22232__19604-31401.jpg` | `Congrats! You got 2 USDT.`(라이트/다크) |
| 결과 모달 | Quiz | Quiz | `19604-22232__19604-32287.jpg` | 점수·획득 USDT + Back/Claim, 0점이면 Back만 |
| 라디오 문항 | Quiz | Quiz | `19604-22232__19604-32287.jpg` | 선택 상태 |


## Boost Improvement (`25683:829`)

Cashback Boost 랜딩 개편안: 히어로(거래소 탭·Base+Boost) · 지원 거래소 카드 그리드 · 비교 차트 · 3단계 · Notes · 가입 모달. 새 GNB(`Compare · How it works · Notes`).

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| [PC] main | `25683:830` | 라이트 | ![](img/25683-829__25683-830.jpg) | 3 | 단독 프레임(섹션 아님) |
| [MO] main | `25683:1047` | 라이트 | ![](img/25683-829__25683-1047.jpg) ![](img/25683-829__25683-1047_p2.jpg) | 4 |  |
| grid - banner | `25683:1249` | 라이트 | ![](img/25683-829__25683-1249.jpg) | 0 | MO 배너 그리드 가이드 |
| grid - section1 | `25683:1325` | 라이트 | ![](img/25683-829__25683-1325.jpg) | 6 | 거래소 1~6개일 때 카드 배치 |
| [PC] modal | `25683:1583` | 라이트 | ![](img/25683-829__25683-1583.jpg) | 1 | 가입 모달(기본/hover) |
| [MO] modal | `25683:1670` | 라이트 | ![](img/25683-829__25683-1670.jpg) | 6 | 바텀시트(코드 `Copy`) |
| [MO] modal_copied | `25683:1896` | 라이트 | ![](img/25683-829__25683-1896.jpg) | 6 | 바텀시트(코드 `Copied!`) |
| [MO] modal__전체 | `25683:2122` | 라이트 | ![](img/25683-829__25683-2122.jpg) | 1 | 바텀시트 전체 높이 |
| (KR)modal | `25804:5855` | 라이트 | ![](img/25683-829__25804-5855.jpg) | 12 | 한국어 모달 — 안내 문구 있음/없음 Case |
| Dark mode · Design system palette | `25702:4866` | 다크 — 제외 | — | 21 | 다크·팔레트 |

### 화면 판정

**[PC] main** (`25683:830`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:876` | Web | section1 | PC 랜딩 구간 |
| — | `25683:913` | Web | section2 | PC 랜딩 구간 |
| — | `25683:1034` | Web | section4 | PC 랜딩 구간 |

**[MO] main** (`25683:1047`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:1049` | — | banner | MO 랜딩 구간 |
| — | `25683:1121` | — | section2 | MO 랜딩 구간 |
| — | `25683:1202` | — | section3 | MO 랜딩 구간 |
| — | `25683:1236` | — | section4 | MO 랜딩 구간 |

**grid - section1** (`25683:1325`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:1326` | Web | 1 | 지원 거래소 카드 개수별 배치 |
| — | `25683:1341` | Web | 2 | 지원 거래소 카드 개수별 배치 |
| — | `25683:1367` | Web | 3 | 지원 거래소 카드 개수별 배치 |
| — | `25683:1404` | Web | 4 | 지원 거래소 카드 개수별 배치 |
| — | `25683:1454` | Web | 5 | 지원 거래소 카드 개수별 배치 |
| — | `25683:1513` | Web | 6 | 지원 거래소 카드 개수별 배치 |

**[PC] modal** (`25683:1583`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:1583` | Web | [PC] modal | PC 가입 모달(기본/hover) |

**[MO] modal** (`25683:1670`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:1672` | — | Frame 33 | MO 가입 바텀시트(스크롤 내용 조각) |
| — | `25683:1705` | — | Frame 24 | MO 가입 바텀시트(스크롤 내용 조각) |
| — | `25683:1736` | — | Frame 30 | MO 가입 바텀시트(스크롤 내용 조각) |
| — | `25683:1808` | — | Frame 26 | MO 가입 바텀시트(스크롤 내용 조각) |
| — | `25683:1836` | — | Frame 27 | MO 가입 바텀시트(스크롤 내용 조각) |
| — | `25683:1855` | — | [MO] modal__전체 | MO 가입 바텀시트(스크롤 내용 조각) |

**[MO] modal_copied** (`25683:1896`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:1898` | — | Frame 33 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |
| — | `25683:1931` | — | Frame 24 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |
| — | `25683:1962` | — | Frame 30 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |
| — | `25683:2034` | — | Frame 26 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |
| — | `25683:2062` | — | Frame 27 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |
| — | `25683:2081` | — | [MO] modal__전체 | MO 가입 바텀시트 Copied!(스크롤 내용 조각) |

**[MO] modal__전체** (`25683:2122`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25683:2122` | — | [MO] modal__전체 | MO 가입 바텀시트 전체 |

**(KR)modal** (`25804:5855`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25804:5937` | — | Frame 33 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:5970` | — | Frame 24 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:6001` | — | Frame 30 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:6073` | — | Frame 26 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:6101` | — | Frame 27 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:6120` | — | [MO] modal__전체 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:83864` | — | Frame 33 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:83897` | — | Frame 24 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:83928` | — | Frame 30 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:84000` | — | Frame 26 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:84028` | — | Frame 27 | 국문 가입 모달 조각(안내 있음/없음) |
| — | `25804:84047` | — | [MO] modal__전체 | 국문 가입 모달 조각(안내 있음/없음) |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| MO 가입 모달 | 기본 | [MO] modal | `25683:1670` | — | 코드 박스 `Copy` | 상태 쌍(판 아님) |
| 〃 | 복사됨 | [MO] modal_copied | `25683:1896` | — | `Copied!` | 상태 쌍 |
| 가입 모달(국문) | 안내문구 있음/없음 | (KR)modal | `25804:5855` | — | PC·MO 각각 안내 bullet 유무 | 상태 쌍. 한국어판이 `페이백` 표기 — 용어 정리 필요 |
| Cashback Boost 상세 | 구판 | Benefits `For discussion`·MAX-500 | `17351:190450` 등(Benefits 페이지) | — | 혜택 상세 안의 부스트 | 「사용자 확인 필요」 — Boost Improvement가 대체하는지 표시 없음 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 복사 버튼 상태 | Boost | `Copy` → `Copied!` | `25683-829__25683-1896.jpg` | 코드 박스(점선 테두리) |
| 강조 안내 박스(주황) | Boost | `Special Bonus: {90}% Total Saving Rate` | `25683-829__25683-1583.jpg` | 프로모션 안내 |
| 단계 표시 | Boost | Sign up → Return to TetherMax → Link your UID | `25683-829__25683-1583.jpg` | PC 가로 / MO 세로 |
| 카드 그리드 개수별 | Boost | grid - section1 | `25683-829__25683-1325.jpg` | 1~6개 배치 규칙 |


## [MAX-502] Email Template (`7596:82127`)

시스템 이메일 템플릿(인증 코드·환영·로그인 제한·비밀번호·출금 신청/취소/완료/실패·UID 연동·소유권 인증 등). 화면 크기 프레임이 아니어서 색인상 화면 수가 적음 — 섹션 단위로 판정.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Existing (old) | `11572:246051` | 라이트 | ![](img/7596-82127__11572-246051.jpg) ![](img/7596-82127__11572-246051_p2.jpg) ![](img/7596-82127__11572-246051_p3.jpg) | 39 | 구 디자인(밝은 파란 배너·`tetherMax`), ko/en/tc/ru/vi 5개 언어 열 |
| Updated templates | `12727:395556` | 라이트 | ![](img/7596-82127__12727-395556.jpg) ![](img/7596-82127__12727-395556_p2.jpg) ![](img/7596-82127__12727-395556_p3.jpg) | 3 | 새 디자인(짙은 파란 배너·`TetherMax`), 영어 + 5개 언어 열, 대부분 `PASS ✅` 표시 |
| With DEX | `27690:2726` | 라이트 | ![](img/7596-82127__27690-2726.jpg) ![](img/7596-82127__27690-2726_p2.jpg) | 0 | UID + 지갑(CEX 먼저) 판: 출금 신청 접수·취소·완료·실패, 연동 해제, 소유권 인증 완료/거절/자동 취소, 연동 실패/완료 |
| Global League | `27690:1127` | 라이트 | ![](img/7596-82127__27690-1127.jpg) | 0 | 글로벌 리그 참여 감사(팀/개인)·최종 결과 메일, 5개 언어 |
| Cashback report as of 9th Jul | `17939:52905` | 라이트 | ![](img/7596-82127__17939-52905.jpg) | 0 | 시장 정보 리포트·운영 현황 조사 메일(영/한) |
| Group 4851 (최상위) | `17873:1544` | 라이트 | ![](img/7596-82127__17873-1544.jpg) | 2 | LBank 점검 공지 메일(한/영, 데스크톱·모바일) |
| Group 4852 (최상위) | `18079:2021` | 라이트 | ![](img/7596-82127__18079-2021.jpg) | 2 | 뉴스레터 제목 표기 오류 안내 공지(한/영, 데스크톱·모바일) |
| Group 4861 (최상위) | `21322:1088` | 라이트 | ![](img/7596-82127__21322-1088.jpg) | 4 | 「WOO X PRO 이메일」 앰배서더 + 100% 당첨 이벤트 메일(한/영 × 데스크톱·모바일) 2벌 |
| Group 4853 (최상위) | `18781:50141` | 미캡처 | — | 2 | 공지 메일 묶음(2프레임) — 미캡처 |
| Group 4854 (최상위) | `19190:1028` | 미캡처 | — | 2 | 〃 |
| Group 4855 (최상위) | `19222:1023` | 미캡처 | — | 2 | 〃 |
| Group 4856 (최상위) | `19222:1024` | 미캡처 | — | 2 | 〃 |
| Group 4857 (최상위) | `19238:1027` | 미캡처 | — | 2 | 〃 |
| Group 4858 (최상위) | `19238:1295` | 미캡처 | — | 2 | 〃 |
| Group 4859 (최상위) | `19368:1087` | 미캡처 | — | 2 | 〃 |
| Group 4860 (최상위) | `19405:1156` | 미캡처 | — | 2 | 〃 |
| Frame (최상위 375x2336) | `19451:1358` | 미캡처 | — | 1 | 〃 |
| Frame (최상위 375x2536) | `19454:1151` | 미캡처 | — | 1 | 〃 |
| Frame (최상위 384x2555) | `21362:1106` | 미캡처 | — | 1 | 〃 |
| For future use (WIP) | `15953:164904` | 제외(QA·참고·폐기) | — | 0 | 작업 중 표시 |
| QA | `15386:479091` | 제외(QA·참고·폐기) | — | 0 | QA 보드 |

### 화면 판정

**Existing (old)** (`11572:246051`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `11572:241773` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:241812` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:241850` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:241888` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:241926` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:241962` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:242001` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:242039` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:242077` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:242115` | — | 이메일 | 구 디자인 메일(언어별) |
| — | `11572:242151` | — | 이메일 tetherMax Point 내역 | 구 디자인 메일(언어별) |
| — | `11572:242208` | — | 이메일 tetherMax Point 내역 | 구 디자인 메일(언어별) |
| — | `11572:242266` | — | 이메일 tetherMax Point 내역 | 구 디자인 메일(언어별) |
| — | `11572:242323` | — | 이메일 tetherMax Point 내역 | 구 디자인 메일(언어별) |
| — | `11572:242380` | — | 이메일 tetherMax Point 내역 | 구 디자인 메일(언어별) |
| — | `11572:242437` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242482` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242531` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242599` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242667` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242736` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242804` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242872` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:242940` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243008` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243150` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243293` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243387` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243436` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243485` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243534` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243579` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243624` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243669` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243714` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243730` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243746` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243762` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |
| — | `11572:243778` | — | 이메일 Bitget 90% 부스트 사용 금액 | 구 디자인 메일(언어별) |

**Updated templates** (`12727:395556`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `12772:23041` | — | Frame | 새 디자인 메일 |
| — | `12772:23124` | — | Frame | 새 디자인 메일 |
| — | `14762:410550` | — | Frame | 새 디자인 메일 |

**Group 4851 (최상위)** (`17873:1544`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `17873:1306` | — | Frame | LBank 점검 공지 메일(한/영) |
| — | `17873:1479` | — | Frame | LBank 점검 공지 메일(한/영) |

**Group 4852 (최상위)** (`18079:2021`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `18079:2086` | — | Frame | 뉴스레터 제목 오류 공지 메일(한/영) |
| — | `18079:2214` | — | Frame | 뉴스레터 제목 오류 공지 메일(한/영) |

**Group 4861 (최상위)** (`21322:1088`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `21322:1090` | — | Frame | WOO X PRO 이벤트 메일 |
| — | `21343:1674` | — | Frame | WOO X PRO 이벤트 메일 |
| — | `21322:1283` | — | Frame | WOO X PRO 이벤트 메일 |
| — | `21343:1082` | — | Frame | WOO X PRO 이벤트 메일 |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 시스템 메일 전체 | 구판 | Existing (old) | `11572:246051` | — | 밝은 파란 배너·캐릭터 일러스트, 5개 언어 | 구판(섹션 이름) |
| 〃 | 새판 | Updated templates | `12727:395556` | — | 짙은 파란 배너, 6개 언어 열, `PASS ✅` | **현행** — QA 통과 표시. 문구 변경안은 `05.리포트/이메일템플릿_문구변경.md` |
| 출금·연동·소유권 메일 | DEX 반영판 | With DEX | `27690:2726` | — | 계정 줄에 UID/지갑, CEX 먼저, Network 행 | DEX 작업 기준 판(새판 위 수정) |
| WOO X PRO 이벤트 메일 | 파란 배경 4프레임 | Group 4861 왼쪽 | `21322:1090` · `21343:1674` | — | CTA 자리에 `CTA Botton (…)` 메모 텍스트, 이름 표기 `Yoon Shi Yoon` | 보조 |
| 〃 | 검은 배경 4프레임 | Group 4861 오른쪽 | `21322:1283` · `21343:1082` | — | 실제 파란 CTA 버튼 반영, 영문 이름 `Yun Si Yun` | **현행으로 보임** — CTA 반영본. 「사용자 확인 필요」 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 경고/주의 박스 | Email | `Important Notes` 회색 박스 | `7596-82127__27690-2726.jpg` | 출금 메일 하단 |
| 강조 경고 박스(분홍) | Email | `Warning: Out of 45 services…` | `7596-82127__17939-52905.jpg` | 리포트 메일 |
| 코드 박스 | Email | 인증 코드 `123456` | `7596-82127__12727-395556.jpg` | |


## [MAX-1244] Newsletter Listings, Detailed Page & Email Template (`23053:166460`)

뉴스레터 목록·상세·댓글·구독·인증 메일. **상태 컴포넌트 재사용 후보 위주**로 캡처. 같은 이름의 섹션 세트가 두 벌(`23102:*` / `24403:*`) 있음.

### 섹션

| 섹션 | 노드 | 구분 | 캡처 | 화면 수 | 비고 |
|---|---|---|---|---|---|
| Newsletter / Components [Light] (23102 세트) | `23102:1009128` | 라이트 | ![](img/23053-166460__23102-1009128.jpg) ![](img/23053-166460__23102-1009128_p2.jpg) | 2 | 컴포넌트 원본(symbol) — 댓글 상태·토스트·다이얼로그·구독·인증 모달 |
| Newsletter — Overlays [Light] (23102 세트) | `23102:1009884` | 라이트 | ![](img/23053-166460__23102-1009884.jpg) ![](img/23053-166460__23102-1009884_p2.jpg) | 11 | 오버레이 11종(다이얼로그 4·케밥 2·토스트 4·GNB 드롭다운) |
| Newsletter / Components / mobile 343 [Light] (23102 세트) | `23102:1009943` | 라이트 | ![](img/23053-166460__23102-1009943.jpg) ![](img/23053-166460__23102-1009943_p2.jpg) | 13 | 모바일 컴포넌트 원본 |
| Newsletter — Verification [Light] (24403 세트) | `24403:340617` | 라이트 | ![](img/23053-166460__24403-340617.jpg) | 5 | 구독 이메일 인증 흐름 |
| Newsletter — Dropdowns [Light] | `25837:1339706` | 라이트 | ![](img/23053-166460__25837-1339706.jpg) | 2 |  |
| Newsletter — Web 1440 [Light] (24403 세트) | `24403:339344` | 라이트 | ![](img/23053-166460__24403-339344.jpg) ![](img/23053-166460__24403-339344_p2.jpg) | 24 |  |
| Newsletter — Mobile 375 [Light] (24403 세트) | `24403:340113` | 라이트 | ![](img/23053-166460__24403-340113.jpg) ![](img/23053-166460__24403-340113_p2.jpg) | 16 |  |
| Newsletter — Web 1440 [Light] (23102 세트) | `23102:1009752` | 미캡처 | — | 24 | 24403 세트와 구조 동일(인스턴스 이름만 다름) — 미캡처 |
| Newsletter — Mobile 375 [Light] (23102 세트) | `23102:1010435` | 미캡처 | — | 16 | 〃 |
| Newsletter / Components [Light] (24403 세트) | `24403:338662` | 미캡처 | — | 2 | 23102 세트의 인스턴스 복사본 — 미캡처 |
| Newsletter — Overlays [Light] (24403 세트) | `24403:339647` | 미캡처 | — | 11 | 〃 |
| Newsletter / Components / mobile 343 [Light] (24403 세트) | `24403:339706` | 미캡처 | — | 13 | 〃 |
| Newsletter — Verification [Light] (23102 세트 쪽) | `23627:226232` | 미캡처 | — | 5 | 24403 세트와 노드 수 동일 — 미캡처 |
| Newsletter / Components / email [Light] | `23102:1010685` | 미캡처 | — | 3 | 메일 컴포넌트 — 미캡처 |
| Newsletter - Email [Light] | `23102:1010883` | 미캡처 | — | 4 | 〃 |
| Newsletter / Components / email [Light] (24403) | `24403:340289` | 미캡처 | — | 3 | 〃 |
| Newsletter - Email [Light] (24403) | `24403:340470` | 미캡처 | — | 4 | 〃 |
| Newsletter / Parking lot [removed 2026-09-09, may return] | `23378:448767` | 제외(QA·참고·폐기) | — | 0 | 보류(2026-09-09 제거) |
| Newsletter / Parking lot … (24403) | `24403:340588` | 제외(QA·참고·폐기) | — | 0 | 〃 |
| Web 1440 [Dark] 외 다크 6개 | `23102:1010549` | 다크 — 제외 | — | 21 |  |

### 화면 판정

**Newsletter / Components [Light] (23102 세트)** (`23102:1009128`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `23102:1009337` | — | Newsletter / Comment dialog | 컴포넌트(댓글 섹션·구독 박스) |
| — | `23102:1009510` | Web | Newsletter / Subscribe hero | 컴포넌트(댓글 섹션·구독 박스) |

**Newsletter — Overlays [Light] (23102 세트)** (`23102:1009884`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `23102:1009885` | Web | O1 Sign in gate | O1 Sign in gate |
| — | `23102:1009890` | Web | O2 Link UID gate | O2 Link UID gate |
| — | `23102:1009895` | Web | O3 Delete this comment | O3 Delete this comment |
| — | `23102:1009900` | Web | O4 Report this comment | O4 Report this comment |
| — | `23102:1009905` | Web | O5 Kebab menu, own comment | O5 Kebab menu, own comment |
| — | `23102:1009909` | Web | O6 Kebab menu, other comment | O6 Kebab menu, other comment |
| — | `23102:1009913` | Web | O7 Comment deleted | O7 Comment deleted |
| — | `23102:1009917` | Web | O8 Reported to moderators | O8 Reported to moderators |
| — | `23102:1009921` | Web | O9 Rate limited | O9 Rate limited |
| — | `23102:1009925` | Web | O10 Subscribed | O10 Subscribed |
| — | `23102:1009930` | Web | page behind | page behind |

**Newsletter / Components / mobile 343 [Light] (23102 세트)** (`23102:1009943`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `23102:1010055` | — | Newsletter / Subscribe hero / mobile 343 | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1009977` | — | Newsletter / Comment composer / mobile 343 | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010207` | — | Liked=False | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010235` | — | Liked=True | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010276` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010385` | — | Newsletter / Comment dialog / mobile 343 | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010286` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010296` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010306` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010316` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010326` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010336` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |
| — | `23102:1010347` | — | Newsletter / Comment section / mobile 343 /  | 모바일 컴포넌트(구독·댓글 상태) |

**Newsletter — Verification [Light] (24403 세트)** (`24403:340617`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `24403:340618` | Web | Newsletter Verification / Not Subscribed / l | 구독 이메일 인증 단계 |
| — | `24403:340771` | Web | Newsletter Verification / Success - Subscrib | 구독 이메일 인증 단계 |
| — | `24403:340924` | Web | Newsletter Verification / Verification Start | 구독 이메일 인증 단계 |
| — | `24403:341079` | Web | Newsletter Verification / Verification Input | 구독 이메일 인증 단계 |
| — | `24403:341234` | Web | Newsletter Verification / Verifying / light | 구독 이메일 인증 단계 |

**Newsletter — Dropdowns [Light]** (`25837:1339706`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `25837:1338442` | Web | L11 Exchange dropdown open | L11 Exchange dropdown open |
| — | `25837:1339107` | Web | L12 Sort dropdown open | L12 Sort dropdown open |

**Newsletter — Web 1440 [Light] (24403 세트)** (`24403:339344`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `24410:339234` | Web | Frame 1984078806 | 뉴스레터 목록 Web 기본(섹션 첫 화면) |
| — | `24403:339346` | Web | Newsletter / Detail / PC 1441 | Newsletter / Detail / PC 1441 |
| — | `24403:339347` | Web | L1 Guest, grid view | L1 Guest, grid view |
| — | `24403:339349` | Web | L2 Member, not subscribed | L2 Member, not subscribed |
| — | `24403:339351` | Web | L3 Member, subscribed | L3 Member, subscribed |
| — | `24403:339353` | Web | L4 List view | L4 List view |
| — | `24403:339509` | Web | L5 Filtered by exchange and keyword | L5 Filtered by exchange and keyword |
| — | `24403:339511` | Web | L6 No results | 결과 없음 |
| — | `24403:339513` | Web | L7 Nothing pinned | L7 Nothing pinned |
| — | `24403:339515` | Web | L8 Card hover | L8 Card hover |
| — | `24403:339517` | Web | L9 Loading | L9 Loading |
| — | `24403:339519` | Web | D1 Guest | D1 Guest |
| — | `24403:339521` | Web | D2 Signed in, no linked UID | D2 Signed in, no linked UID |
| — | `24403:339523` | Web | D3 Linked, ready to comment | D3 Linked, ready to comment |
| — | `24403:339525` | Web | D4 Typing | D4 Typing |
| — | `24403:339527` | Web | D5 Character limit reached | D5 Character limit reached |
| — | `24403:339529` | Web | D6 Submitted an empty comment | D6 Submitted an empty comment |
| — | `24403:339531` | Web | D7 Own comment posted | D7 Own comment posted |
| — | `24403:339533` | Web | D8 Replies expanded | D8 Replies expanded |
| — | `24403:339535` | Web | D9 No comments yet | D9 No comments yet |
| — | `24403:339537` | Web | D10 Comments loading | D10 Comments loading |
| — | `24403:339539` | Web | D11 Comments failed to load | D11 Comments failed to load |
| — | `24403:339541` | Web | D12 First publish, no Last updated (retired  (숨김) | D12 First publish, no Last updated (retired  |
| — | `24403:339544` | Web | L11 Featured section hidden | L11 Featured section hidden |

**Newsletter — Mobile 375 [Light] (24403 세트)** (`24403:340113`)

| 라벨(상태) | 노드 | 플랫폼 | 프레임 이름 | 무엇을 보여 주나 |
|---|---|---|---|---|
| — | `24403:340114` | — | Newsletter / List / mobile 376 | Newsletter / List / mobile 376 |
| — | `24403:340115` | — | Newsletter / Detail / mobile 376 | Newsletter / Detail / mobile 376 |
| — | `24403:340116` | — | L1m Guest | L1m Guest |
| — | `24403:340118` | — | L2m Member, subscribed | L2m Member, subscribed |
| — | `24403:340119` | — | L2m Member, subscribed | L2m Member, subscribed |
| — | `24403:340122` | — | L3m No results | 결과 없음 |
| — | `24403:340124` | — | L4m Nothing pinned | L4m Nothing pinned |
| — | `24403:340126` | — | L5m Loading | L5m Loading |
| — | `24403:340128` | — | D1m Guest | D1m Guest |
| — | `24403:340130` | — | D2m No linked UID | D2m No linked UID |
| — | `24403:340132` | — | D3m Linked, ready to comment | D3m Linked, ready to comment |
| — | `24403:340134` | — | D4m Own comment posted | D4m Own comment posted |
| — | `24403:340136` | — | D5m Replies expanded | D5m Replies expanded |
| — | `24403:340138` | — | D6m No comments yet | D6m No comments yet |
| — | `24403:340140` | — | O1m Sign in gate | O1m Sign in gate |
| — | `24403:340145` | — | O2m Comment deleted | O2m Comment deleted |

### 판이 여러 개인 화면

| 화면 | 판 | 섹션 | 노드 | 날짜/번호 | 차이 | 현행 판정 |
|---|---|---|---|---|---|---|
| 섹션 세트 전체 | 23102 세트 | Components·Web·Overlays·Mobile·Email·Verification | `23102:1009128` 등 | — | 컴포넌트가 symbol(원본), Web 화면 라벨 `Link` | 컴포넌트 원본 |
| 〃 | 24403 세트 | 같은 이름 | `24403:338662` 등 | — | 모두 instance(복사본), GNB에 `공지사항` 텍스트, Components에 `Empty state`·`결과 24개` 인스턴스 추가 | **화면 현행으로 보임**(노드가 뒤·국문 반영). 「사용자 확인 필요」 |

### 상태 컴포넌트

| 종류 | 페이지 | 노드/위치 | 캡처 파일 | 메모 |
|---|---|---|---|---|
| 다이얼로그 4종(취소/주 버튼) | Newsletter | Overlays 01~04 | `23053-166460__23102-1009884.jpg` | Sign in to comment · You are almost there(Link UID) · Delete this comment?(빨강 Delete) · Report this comment? |
| 케밥 메뉴 | Newsletter | Overlays 05~06 | `23053-166460__23102-1009884.jpg` | 내 댓글 Delete / 남의 댓글 Report |
| 토스트 4종 + 링크 복사 | Newsletter | Overlays 07~10 · Components 03 | `23053-166460__23102-1009884_p2.jpg` · `23053-166460__23102-1009128.jpg` | Comment deleted · Reported to moderators · Please try again later(Rate limited) · You are subscribed · Link copied. 3초 자동 닫힘, 데스크톱 우하단·모바일 하단 중앙 |
| 댓글 게이트(게스트/미연동) | Newsletter | Components 03 Comment gate | `23053-166460__23102-1009128.jpg` | 로그인 유도 / UID 연동 유도 박스 |
| 입력 상태(빈/입력 중/가득/오류) | Newsletter | Comment composer | `23053-166460__23102-1009128.jpg` | 글자 수 카운터·초과 시 빨간 테두리(인라인 오류) |
| 구독 박스 상태(게스트/회원/구독됨) | Newsletter | Subscribe hero | `23053-166460__23102-1009128.jpg` | `You're subscribed` 체크 |
| 인증 코드 모달(미완/준비/확인 중) | Newsletter | Email verification modal | `23053-166460__23102-1009128_p2.jpg` · `23053-166460__24403-340617.jpg` | 6자리 입력·Verify 비활성/활성·재전송 |
| 빈 상태 | Newsletter | `Newsletter / Empty state`(24403 세트) | `23053-166460__24403-339344.jpg` | 목록 빈 상태 |
| 칩(카테고리·태그) | Newsletter | Category chip · Tag chip | `23053-166460__23102-1009128.jpg` | |
| 드롭다운 | Newsletter | Dropdowns [Light] | `23053-166460__25837-1339706.jpg` | |

