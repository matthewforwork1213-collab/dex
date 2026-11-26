# 상태 ↔ Figma 근거 대응 — 8. DEX 개요 · 상세 (`dex.overview` · `dex.detail`)

- 찾은 방법: `tools/figfind.py` · `ref/figma_index.tsv` · `ref/figma_pages/*.xml`(오프라인 메타데이터). 2026-11-26 Figma 스크린샷·`get_design_context`로 대조했다.
- 확신: **확실** = 프레임 이름·SCREEN-LABEL·상태 카드 제목이 상태와 일치 / **후보** = 추정(연결 후 스크린샷으로 확인).
- 「DEX(상태 카드)」 = DEX(revision) `API 상태 흐름 5 · 탐색·계산기·거래소 상세와 리뷰`(29002:128327)의 `S5_nn · {제목}` 카드 안 `화면 · {제목}` 축소 화면.
- 기본 페이지 프레임
  - 개요: PC **OA `28960:125521`** · mWeb **OA `28960:130946`** (DEX(revision) › DEX overview Web / Mobile [Exploration A · Light]). 기존 페이지에 DEX 개요는 없다(신규). 셸 비교 대상은 기존 거래소 목록 `[MAX-22]` Web `8643:107720` · mWeb `8471:65818`.
  - 상세: PC **D4 EdgeX `28960:127454`** · mWeb **D4 `28960:131011`**. 실제 운영 중인 기존 상세 = `[MAX 1216]` `S1 Guest` PC `22442:219455` · mobile `22956:82157`(+ `[MAX-22]` 상세 · `Exchange Detail Page top area` 시안 A 수정 3 PC `25978:1408` · MO `25978:1477`).

## dex.overview

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| dex.overview:normal | 게스트 — 이유 카드·CTA 띠까지 | 28960:125521 / 28960:130946 | OA PC 28960:125521 · mo 28960:130946 · venue 카드 상태 카드 S5_01 `EdgeX`(전환 `Get Started`) 29002:128340 | DEX | 확실 | `OA Guest, DEX overview (keys)` |
| dex.overview:member | 로그인 — Learn and Earn으로 끝 | 28960:125522 / 28960:130952 | OB PC 28960:125522 · mo 28960:130952 (SCREEN-LABEL `OB Signed in`) | DEX | 확실 | `OB Signed in` |
| dex.overview:list | Venue 리스트 뷰 | 28960:125536 / 28960:130958 | OC PC 28960:125536 · mo 28960:130958 · 리스트 행 상태 카드 S5_08 `EdgeX`(전환 `상세 보기`) 29002:128510 · S5_09 `Exchange rating` 29002:128535 | DEX | 확실(OC) · S5_08/09 후보 | `OC Guest, partner list view` `list view` |
| dex.overview:defiStale | DefiLlama 실패 — 마지막 캐시값 + 기준 시각 | 28960:125521 / 28960:130946 | glance 서브라인 `TVL and 24H volume from DefiLlama, as of 14 Oct 2026`(OA 안 텍스트) · 상태 카드 S5_07 `24H trading volume` 29002:128485 | 재사용 컴포넌트(OA glance 서브라인) | 확실(형식) · 위치 디자인 없음 | `DefiLlama` `as of` `24H trading volume` |
| dex.overview:defiHidden | DefiLlama 24시간 넘게 실패 — 지표 숨김 | 28960:125521 / 28960:130946 | 상태 카드 S5_07 `24H trading volume` 29002:128485 (숨김 변형인지 확인) | 재사용 컴포넌트(OA 카드에서 지표 칸 제외) | 확실(구성) | `TVL` `24H Vol` `DefiLlama` |
| dex.overview:noBanner | 게시 배너 없음 — 렌더 안 함 | 28960:125521 / 28960:130946 | 배너 없는 개요 프레임 없음(배너 레이어 `promo banner (mobile)` · `Banner - mobile`만 있음) | 없음 | — | `banner` `promo banner` `Banner` |
| dex.overview:empty | 노출 DEX 0개 | 28960:125521 / 28960:130946 | 상태 카드 S5_02 **`No DEX partners are available`**(전환 `빈 목록 유지`) 29002:128365 | 결정 G-160(영역 숨김) — Figma S5_02 문구는 쓰지 않음 | 확실 | `No DEX partners` |
| dex.overview:maint | 특정 DEX 점검·일시 연동 불가 | 28960:125521 / 28960:130946 | 상태 카드 S5_03 **`Temporarily under maintenance`**(전환 `상세 보기`) 29002:128385 · S5_04 `Linking unavailable`(전환 `공개 상세 보기`) 29002:128410 · 연동 쪽 `Link / Linking unavailable / Light` 28969:127153 | 결정 G-162(카드 변화 없음) — Figma S5_03 문구는 쓰지 않음 | 확실 | `maintenance` `Linking unavailable` |
| dex.overview:lighter | Lighter 카드 (온보딩 후) | 28960:125521 / 28960:130946 | OA(Lighter 포함 4개) | DEX | 확실 | `OA DEX overview` |
| dex.overview:overflow | 파트너 8개 — glance 가로 넘침 | 28960:125542 / — | PC 28960:125542 (`OA 8 partner DEXs, overflow`) · 모바일 프레임 없음 | DEX | PC 확실 · mo 없음 | `overflow` `8 partner DEXs` |

## dex.detail

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| dex.detail:normal | 게스트 — EdgeX | 28960:127454 / 28960:131011 | D4 PC 28960:127454 · mo 28960:131011 · 오퍼 `DEX detail / Guest` 28969:129578 · 상태 카드 S5_13 `Get cashback with EdgeX`(전환 `로그인·가입 후 복귀`) 29002:128630 · 기존 `[MAX 1216] S1 Guest` 22442:219455 / 22956:82157 | DEX | 확실 | `D4 EdgeX key features` `DEX detail / Guest` |
| dex.detail:edgex | EdgeX (회원 상태 토글) | 28960:127454 / 28960:131011 | 위와 같음 | DEX | 확실 | `EdgeX detail` |
| dex.detail:unlinked | 회원 · 미연동 — Link Wallet | 28969:129666 / — | PC `DEX detail / Member without a linked wallet` 28969:129666 · 상태 카드 S5_14 `Link your EdgeX wallet`(전환 `Link Account`) 29002:128667 · 모바일: 기존 `[MAX 1216] S2 Member, UID not linked / mobile 375` 22956:82158 | DEX · 모바일은 D4 모바일 오퍼 박스 재사용 | PC 확실 · mo 재사용 | `Member without a linked wallet` `UID not linked` |
| dex.detail:linked | 회원 · 연동 — Auto Claim · 리뷰 쓰기 | 28969:129751 / — | PC `DEX detail / Member with a linked wallet` 28969:129751 · 상태 카드 S5_15 `Your linked account`(전환 `리뷰 쓰기`) 29002:128699 · 모바일: 기존 `[MAX 1216] S3 Linked, no review yet / mobile 375` 22956:83609 | DEX · 모바일은 D4 모바일 오퍼 박스 재사용 | PC 확실 · mo 재사용 | `Member with a linked wallet` `Linked, no review yet` |
| dex.detail:signupReturn | 가입 후 돌아온 상세 — `Link Wallet` 주 버튼 강조 | 28960:127422 / — | PC **`Signup + Link UID / 3 Return / Light`** 28960:127422(자식 `DEX / Detail PC 1440` 인스턴스 28960:127423) · 앞 단계 `1 Entry` 28960:127416 · `2 Signup` 28960:127418 · 모바일 프레임 없음 | DEX | PC 확실 — 구현함 · mo 없음 | `Signup + Link UID` `Return` |
| dex.detail:maker | Maker 토글 | 28960:127454 / 28960:131011 | 기존 `[MAX-22]` 섹션 `maker/taker rate` 6042:67360(mWeb 5568:79208 · 5568:79708 · 5568:80077 · 5568:120037, 텍스트 `Maker`/`Taker` 토글) · `[MAX 1216] S22 Fee compare popover` PC 23327:1130802 · mo 23337:167953(ALT 23312:168910 · 23312:168947 `Maker is selected.`) · `Exchange Detail Page top area` 시안 A 수정 3 PC 25978:1408 · MO 25978:1477(ToggleButtonGroup · `Final Maker`) | 재사용 컴포넌트(D4 Taker/Maker 토글 선택 변형) | 확실 | `Maker` `maker/taker rate` `Fee compare` `ToggleButtonGroup` |
| dex.detail:aster | Aster (D5) | 28960:127627 / 28960:131017 | D5 PC 28960:127627 · mo 28960:131017 | DEX | 확실 | `D5 Aster key features` |
| dex.detail:apex | ApeX (D6) | 28960:127633 / 28960:131023 | D6 PC 28960:127633 · mo 28960:131023 | DEX | 확실 | `D6 ApeX key features` |
| dex.detail:lighter | Lighter (D1) | 28960:127443 / 28960:130990 | D1 PC 28960:127443 · mo 28960:130990 | DEX | 확실 | `D1 Key features` |
| dex.detail:drawer | How this works | 28960:127454 / 28960:131011 | 상태 카드 S5_12 **`How this works`**(전환 `Close`) 29002:128605 · 기존 `[MAX 1216] S21 How this works modal` PC 22544:808136 · mo 22988:114502(오버레이 22988:115257) · 컴포넌트 `Modal / How this works / mobile 343` 22985:103042 · `Cashback explainer / "How this works" modal` 22442:172208 | 기존(MAX-1216 모달) | 확실 — 컴포넌트 22985:103042 값으로 모달 구현(드로어 폐기) | `How this works` `Cashback explainer` |
| dex.detail:step3 | 단계 가이드 Step 3 (D2) | 28960:127444 / 28960:130999 | D2 PC 28960:127444 · mo 28960:130999 · `DEX guide / Step 3 of 5` 28981:129062 | DEX | 확실 | `D2 Step guide` `Step 3 of 5` |
| dex.detail:mediaFail | 가이드 미디어 실패 | 28960:127444 / 28960:130999 | DEX(revision)·기존(1216 Guide·Sign-up guide 포함) 어디에도 미디어 실패·자리표시자 디자인 없음 | 없음 | — | `could not load` `failed to load` `video` `image` `media` `placeholder` `reduced motion` |
| dex.detail:moderation | 리뷰 검토 중 | 28960:127445 / 28960:131005 (D3) | 상태 카드 S5_20 **`This review is under moderation`**(전환 `본문 미노출`) 29002:128826 · 기존 `[MAX 1216]` 컴포넌트 `Reviews / Card` › **`Translation=Done, State=In moderation`** PC 27392:937 · mo 27392:1062 · `Reviews / Section / 375 / hidden` 23094:1003451 | 기존 | 확실 — Reviews/Card In moderation 27392:937 값으로 구현 | `under moderation` `In moderation` |
| dex.detail:reviewsEmpty | 리뷰 없음 (G-169) | 28960:127445 / 28960:131005 (D3) | 상태 카드 S5_19 **`Global Reviews (0)`**(전환 `빈 상태 유지`) 29002:128806 · 기존 `[MAX 1216] S6 Empty — 0 reviews` PC 22442:219830 · mo 22956:84690 | 기존 | 확실 — S6 배치 + G-169 문구 | `Global Reviews (0)` `Empty — 0 reviews` |
| dex.detail:offboarded | DEX 오프보딩 — 랜딩 리다이렉트 | 28960:125521 / 28960:130946 | 상태 카드 S5_16 `Exchange unavailable`(전환 `DEX 목록`) 29002:128736 · S5_17 `Decentralised Exchanges`(전환 `자동 이동`) 29002:128761 | 결정(301 리다이렉트) | 확실 | `Exchange unavailable` `자동 이동` |

## 확인 결과와 남은 질문

| 대상 | 내용 |
|---|---|
| empty · maint · offboarded | 상태 카드가 있다: `No DEX partners are available`(S5_02) · `Temporarily under maintenance`(S5_03) · `Exchange unavailable`(S5_16). 지금 구현은 확정 결정 G-160(빈 상태 화면 두지 않음)·G-162(카드 변화 없음)·301 리다이렉트를 따른다 → Figma 카드와 결정이 다르면 결정이 맞는지 질문 |
| drawer 형태 | 기존 제품 모달로 구현함. 웹 S21 프레임에서 모달 위치를 찾지 못해 PC도 343 폭 컴포넌트를 가운데 띄움 |
| step3 라벨 | 웹 프레임 이름은 `step 3`, 웹 SCREEN-LABEL은 `step 4`, 모바일 라벨은 `step 5` — 어느 단계 화면인지 스크린샷 확인 |
| maker | 기존 실제 제품은 Maker가 기본(1216 메모: live default MAKER). DEX 상세 토글 기본값 확인 |

## Figma에만 있는 개요·상세 상태 (현재 프로토타입에 없음)

| 노드 | 제목 | 비고 |
|---|---|---|
| 29002:128435 | S5_05 `Partners couldn’t load` | 개요 목록 조회 실패(전환 `목록 재조회`) |
| 29002:128460 | S5_06 `Exchange information unavailable` | 상세 정보 조회 실패(전환 `다시 불러오기`) |
| 29002:128786 | S5_18 `FAQs` | FAQ 없으면 섹션 미노출 |
| 29002:128846 · 128890 · 128915 | S5_21 `Write a review` · S5_22 `Link a trading account to write a review` · S5_23 `Review posted` | 리뷰 쓰기 흐름(기존 1216 S5·S10·S14·S15와 대응) |
| 29002:128940 · 128965 · 128985 | S5_24 `Recent payouts couldn’t load` · S5_25/26 `Recent payouts` | 위치 확인 필요 |
| 22442:219836 · 22442:219848 | 기존 1216 `S7 Loading` · `S9 List failed` | 상세·리뷰 로딩/목록 실패 |


## 모바일 상세 대조 결과 (D4 28960:131011)

| 항목 | 반영 |
|---|---|
| 이름 옆 `DEX` 배지 | Figma PC·모바일 모두 없음 → 뺌 |
| 모바일 오퍼 박스 | `Get Started`만, 게스트 `Sign Up`은 하단 고정 CTA(`Sign Up` + `Already have an account?`, I28960:131011;27610:306639)로 |
| 계산기(Structure) | 인셋 카드(16px 여백 · radius 8) · Taker/Maker 토글 전폭 · 단계 번호 파란색 |
| 가이드 | 제목 20px · 스크린샷 360 높이 |
| 마지막 배너 | 모바일 전용 밝은 아트워크 `closing card`(I28960:131011;27610:306621) · 24 Regular 검정 |
| 상단 바 | Figma는 뒤로·공유 서브페이지 헤더 — 코어 셸(묶음 1) 담당이라 보고만 |
