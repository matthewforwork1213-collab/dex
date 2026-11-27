# 상태 → Figma 근거 대응 — 6. 소유권 인증 (own)

근거는 로컬 메타데이터(`ref/figma_pages/28960-125519.xml` · `12474-14170.xml` · `ref/figma_index.tsv`)로만 찾았다. 「후보」는 Figma 연결 후 스크린샷으로 확인할 목록이다.

## 기본 페이지 프레임

| 화면 | PC | mWeb / mAPP |
|---|---|---|
| own.inuse | DEX O1 `28960:127644` · O2 `28960:127650`(둘 다 `UID link result / Splash` 1440 인스턴스 — 다이얼로그가 아니라 전체 화면 스플래시) · 기존 [MAX-561] 웹 Entry point `12792:59661` · cooldown `12792:61035` | DEX 모바일 `28969:127109`(Account already in use) · `28982:126298`(Cooldown) · 기존 [MAX-561] mWeb `12874:18663` · `12783:405465` · mAPP `12881:57737` · `12881:69614` |
| own.verify | DEX O3 `28960:127635` | DEX `28982:126103` · 기존 [MAX-561] mWeb With carousel `12773:343687` · mAPP `12881:70012` |
| own.home | DEX O11 `29453:143874`(홈 배경) | DEX `28982:126253` · 기존 [MAX-561] mWeb Processing with timer `12783:400655`(프레임 `12792:2788`) · mAPP `12881:71452` |

[MAX-561] 라벨 → 프레임(같은 x 좌표): 웹 = Entry point `12792:59661` · Ownership cooldown time `12792:61035` · With carousel `12792:171647` · Without carousel `12792:171648` · Uploading `12792:173938` · Uploaded successfully `12792:174487` · Fail scenarios `12792:175307`·`12792:184063` · Confirmation `12792:185242` · Processing with timer `12792:231646` · Ownership approved `12866:10959` · Ownership failed `12866:53932` · Unlinked and UID claim by others `12866:55106`·`13060:147708` · Verification Failed `12866:56631`·`13060:146914` · Unlinked UID detail `12866:57246` · Verification failed detail `12874:11696`. mWeb = UID already in use `12874:18663` · cooldown `12783:405465` · With carousel `12773:343687` · Without carousel `12773:345019` · Loading `12779:52609` · Uploaded successfully `12773:345467` · Fail scenarios `12783:397830`·`12881:17759` · Confirmation `12773:347156` · Processing with timer `12783:400655` · approved `12783:402634` · failed `12783:403053` · Unlinked and UID claim by others `12783:404139`·`13060:145360` · Verification Failed `12783:404266` · Modal `13060:144265` · Unlinked UID detail `12792:47639` · Verification failed detail `12783:405078`. mAPP는 같은 배치(`12881:57737` · `69614` · `70012` · `70252` · `70470` · `70639` · `70825` · `71127` · `71449` · `71452` · `113842` · `114349` · `114816` · `115197` · `138725` · `138917`).

## 상태별 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류(DEX/기존/재사용 컴포넌트/없음) | 확신(확실=이름·라벨 일치 / 후보=추정) | 찾은 키워드 |
|---|---|---|---|---|---|---|
| own.inuse:normal | Account Already in Use (O1) | `28960:127644` / `28969:127109` | PC O1 `28960:127644` = 결과 스플래시(error) — 연동 L9와 같은 화면, 화면은 `link.result:inuse`를 그대로 씀 · 기존 [MAX-561] `12792:59661`·`12874:18663` | DEX | 확실(design_context 반영) | O1 |
| own.inuse:cooldown | Ownership Claim Unavailable (O2) | `28960:127650` / `28982:126298` | PC O2 `28960:127650` = 결과 스플래시(warning) · 화면은 `link.result:cooldown` · 기존 [MAX-561] `12792:61035`·`12783:405465` | DEX | 확실(design_context 반영) | O2 |
| own.verify:normal | Step 1 · 파일 없음 (O3) | `28960:127635` / `28982:126103` | PC `28960:127635` · mo `28982:126103` · 기존 [MAX-561] `12792:171647` / mWeb `12773:343687` | DEX | 확실 | O3 Guide step 1 · Recording guide 1 · With carousel |
| own.verify:s2 | Step 2 (O4) | 〃 | PC `28960:127664` · mo `28982:126127` | DEX | 확실 | O4 · Recording guide 2 |
| own.verify:s3 | Step 3 (O5) | 〃 | PC `28960:127670` · mo `28982:126151` | DEX | 확실 | O5 · Recording guide 3 |
| own.verify:uploading | 업로드 중 (O6) | 〃 | PC `28960:127676` · mo `28982:126175` · 기존 웹 Uploading `12792:173938` · mWeb Loading `12779:52609` | DEX | 확실 | O6 Uploading · Loading |
| own.verify:uploaded | 업로드 완료 (O7) | 〃 | PC `28960:127682` · mo Ready to submit `28982:126199` · 기존 `12792:174487` / `12773:345467` | DEX | 확실 | O7 Uploaded · Uploaded successfully |
| own.verify:failed | Upload Failed (O8) | 〃 | PC `28960:127688` · mo `28982:126223` · 기존 Fail scenarios 웹 `12792:175307` / mWeb `12783:397830` | DEX | 확실 | O8 Upload failed · Fail scenarios |
| own.verify:error | Something Went Wrong (O9) | `28960:127694` / `29102:132023` | PC 「소유권 인증 원본 상태 · O9」 `28960:127694`(MUI Dialog 480 · 보조 흰색 + Try again) · mo `Ownership / Unexpected error` `29102:132023`(세로 버튼) | DEX | 확실(design_context 반영) | O9 · Unexpected error |
| own.verify:confirm | Submit this claim? (O10) | 〃 | PC `28960:127700` · mo Confirm submission `28982:126238` · 기존 Confirmation `12792:185242` / `12773:347156` | DEX | 확실 | O10 · Confirm submission · Confirmation |
| own.home:review | 소유 확인중 (O11) | `29453:143874` / `28982:126253` | PC `29453:143874` · mo `28982:126253` · 기존 Processing with timer `12792:231646` / `12783:400655` | DEX | 확실 | O11 Review in progress · Processing with timer |
| own.home:approved | 승인 (O12) | 〃 | PC `29205:124141` · mo `28982:126268` · 기존 `12866:10959` / `12783:402634` | DEX | 확실 | O12 Ownership approved |
| own.home:rejected | 거절 (O13) | 〃 | PC `29205:124663` · mo `28982:126283` · 기존 `12866:53932` / `12783:403053` | DEX | 확실 | O13 Ownership not approved · Ownership failed |
| own.home:unlinked | 이전 보유자 · 연동 해제 행 (O14) | `28960:127727` / `12783:404139` | PC `28960:127727` · mo 기존 [MAX-561] mWeb `12783:404139`(행 아래 경고 Alert + 화살표, 스크린샷 확인) · 배경 = 실제 홈 `home.main:normal` | DEX(PC) / 기존(mo) | 확실 | O14 · Unlinked and UID claim by others |
| own.home:reclaim | 재청구 다이얼로그 (O15) | 〃 | PC `29202:120092` · mo Reclaim wallet `28982:126318` · 기존 웹 `13060:147708` / mWeb `13060:145360` | DEX | 확실 | O15 Reclaim this wallet · Reclaim wallet |
| own.home:reclaimRejected | 재청구 거절 · 사유 (O16) | 〃 | PC `29202:120644` · mo Reclaim rejected `28982:126338` · 기존 Verification Failed 웹 `12866:56631`·`13060:146914` / mWeb `12783:404266` | DEX | 확실 | O16 Reclaim not approved · Verification Failed |

## 참고 — Figma에만 있는 프레임

| 프레임 | 처리 |
|---|---|
| O0 Home, link another wallet `28960:127748` | 홈 담당(질문_own) |
| [MAX-561] Unlinked UID detail(웹 `12866:57246` · mWeb `12792:47639`) · Verification failed detail(웹 `12874:11696` · mWeb `12783:405078`) | 거래 계정 상세(지갑 상세) 화면의 소유권 상태 — 홈 담당 `home.wallet` 범위. 소유권 모듈에서는 만들지 않음 |
| [MAX-561] mWeb Modal `13060:144265` | 내용 미확인 — 연결 후 확인 |
| 보드 S3_13 Trading account limit reached `29002:127398` · S3_14 Review in progress `29002:127423` · S3_15 `29002:127448` | 연결 후 확인 — 승인 시 한도 초과 예외일 수 있음 |
