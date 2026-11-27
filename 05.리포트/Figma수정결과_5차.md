# Figma 수정 결과 — 5차 (최종 점검 대응 · 10차 결정 반영)

2026-11-27 · 대상 Figma `DEX(revision)` [28960:125519](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519) · 결정 [_Figma수정_결정.md](_Figma수정_결정.md)(10차 · 4차 Q1·Q3·Q5 · 3차 #10 · D8) · 점검 [Figma_최종상태점검.md](Figma_최종상태점검.md) · 이전 결과 [4차](Figma수정결과_4차.md) · 캡처 [Figma수정결과_img/](Figma수정결과_img/) `r5_*.jpg`

노드 링크: `https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id={앞}-{뒤}`. 다른 페이지(`[MAX-…]`)는 읽기·복제 원본으로만 썼고 고치지 않았다. 컴포넌트 메인도 고치지 않았다.

## 요약

| 구분 | 수 | 내용 |
|---|---|---|
| 처리한 항목 | **17** | 10차 결정 홈 행 상태 1(기존 디자인으로 다시 그림 + 칩 정리 + 0원 안내 숨김) · 우선 1 CEX UID 상세 1 · 결정 위반 4 · 우선 2 상위 4 · 추가 결정(0원 안내 없음) 1 · 기존 노드·원문 조사 2(배너·모달 원본 · 행 상태 표시 방식) · 반영 지연 숨김 1(요약 · 허브 H6 · 홈 · 지갑 상세 · 메모) · 처리 중 행 기존 디자인 1 · Cashback Basics 소제목 1 |
| 새 프레임 | **7** | 홈 행 상태 1 · 배너를 누른 모달 4(수동 연동 실패 CEX·DEX · 이슈 CEX·DEX) · 공통 오류 토스트 1 · 모바일 `See All` 꽉 찬 모달 1 (아래 「새 프레임 목록」) |
| 숨김 | 프레임 8 · 라벨 4 · 칩 13 · 보조 문구 3 | 4차 「Issue and failed」 29418:141446 · 4차 「Zero balance」 29423:139494 · 반영 지연 프레임 6(요약 `Delayed` · 허브 H6 PC·모바일 라이트·다크 · 홈 `Balance delayed` · 지갑 상세 `Delayed`) + 라벨 4 · `Trying to link` · `Verifying ownership` 칩(점 + 시계로) · 홈·`See All` 모달의 `No cashback yet` · `Data delayed` · `Inactive` 칩 · `Last updated …` 2 · `No longer supported …` 1 |
| ✏️ 문구표 승인 대상 | **6** | DEX 행 배너·모달의 `Wallet` 표기(아래 「DEX 행 문구」) |
| 못 한 것 | **3** | 아래 표 |

### 못 한 것

| 항목 | 이유 |
|---|---|
| 수동 연동 실패 배너·모달의 Figma 원본 노드 | Figma 9페이지·오프라인 색인 검색 0건(아래 검색 기록). 배너 문구는 실사이트 수집본(`_프로토타입_실사이트/frags/member__en.pc.55bc12d8.js`)에만 있고, 모달 문구는 결정 10차 기록 문구. 그래서 **배너는 같은 홈 배너 컴포넌트(`ownership notice`, Error)**, **모달은 [MAX-561] 기존 사유 모달(13060:147002)**을 복제해 문구만 바꿨다 |
| DEX 수동 연동 실패 모달의 사유 문구 | DEX용 사유 원문 없음 — 기존 노드 문구 `{Reason provided by backend}` 그대로 둠(문구 대기) |
| 국문(KO) 원문 | `KO Polishing` 페이지(22680:229975) 검색 0건, 실사이트 수집본에 국문 조각 없음. 국문은 언어팩 확인 필요 |

---

## 0. 10차 결정 — 홈 연동 계정 행 상태 (우선 처리)

### 0-1. 기존 노드와 원문

| 요소 | 기존 노드(페이지) | 원문 EN | 표시 |
|---|---|---|---|
| 행 상태 점 | [MAX-7] mWeb [9401:87675](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9401-87675) — `<Badge>` 점 4종 | — | 정상 = 초록 `success/main` #2E7D32 · 이슈 = 빨강 `error/main` #D32F2F · 처리 중 = 분홍 `error/accent` #FECDD2 + 시계 아이콘 `AccessTimeRounded` |
| 이슈 모달 | [MAX-7] mWeb `issue` [9401:87912](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9401-87912)(`<Paper>` 343) | `There is a problem with this UID.` / `Please contact our support team for assistance.` / `Contact Support` | 제목 옆 닫기 아이콘, 파란 버튼 1개 |
| 연동 해제(되찾기) 배너 | [MAX-561] mWeb [12783:404139](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12783-404139) · Web [12866:55106](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12866-55106) | `This UID has been unlinked. Tap to verify ownership and reclaim it.` | 주황 점 `#EF6C00` · 금액 `-` · 주황 배너(Warning) › |
| 소유 확인 실패 배너 | [MAX-561] mWeb [12783:404266](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12783-404266) · Web [12866:56631](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12866-56631) · 재시도형 13060:144265 | `Ownership verification was unsuccessful. View reason.` · `Ownership verification was unsuccessful. Please try again.` | 빨간 점 · 금액 `-` · 분홍 배너(Error) › |
| 사유 모달(`Remove UID` 2버튼) | [MAX-561] Web [13060:147002](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=13060-147002)(`<Paper>` 480 · Backdrop 13060:146999) | `Ownership Verification Unsuccessful` / `{Reason provided by backend}` / `Remove UID` · `Apply for Ownership` | 회색 · 파랑 버튼 |
| 수동 연동 실패 배너 | Figma 원본 없음 · 실사이트 수집본 | `UID Linking was unsuccessful. View reason.` | 결정 10차: 빨간 점 + 분홍 배너 › |
| 수동 연동 실패 모달 | Figma 원본 없음 · 결정 10차 | `UID Linking Unsuccessful` / `UID is not found in the tetherMax database. Please contact customer service for assistance.` / `Remove UID` · `UID Link` | 회색 · 파랑 버튼 |
| DEX 배너 컴포넌트 | DEX(revision) O14·O16에 이미 쓰는 `ownership notice`(Severity=Error·Warning, 27267:342699 · 27267:342669) | `This wallet has been unlinked. Tap to verify ownership and reclaim it.`(REQ-729 · 정책 `OWN-8` 원문) | 위 MAX-561 배너와 같은 모양 |

### 0-2. DEX 행 문구 (✏️ 문구표 승인 대상)

| CEX 행(기존 그대로) | DEX 행 | 근거 |
|---|---|---|
| `UID Linking was unsuccessful. View reason.` | ✏️ `Wallet linking was unsuccessful. View reason.` | 결정 10차 표기 규칙 |
| `UID Linking Unsuccessful` | ✏️ `Wallet Linking Unsuccessful` | 결정 10차 |
| `Remove UID` · `UID Link` | ✏️ `Remove Wallet` · `Link Wallet` | 결정 10차(`Remove Wallet` = REQ-729 원문, `Link Wallet` = DEX 기존 버튼) |
| `There is a problem with this UID.` | ✏️ `There is a problem with this wallet.` | 결정 10차 |
| `This UID has been unlinked. Tap to verify ownership and reclaim it.` | `This wallet has been unlinked. Tap to verify ownership and reclaim it.` | REQ-729 원문(확정) |
| `Ownership verification was unsuccessful. View reason.` | 같음(계정 표기 없음) | REQ-729 원문 |

### 0-3. 바꾼 것

| 항목 | 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|---|
| 잘못 만든 4차 프레임 | 「Issue and failed」 [29418:141446](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29418-141446) | 숨김. 이 프레임을 가리키던 메모 링크 없음(인계 섹션·잔액 섹션·Mobile·사용자 기능 섹션 하이퍼링크 검사) | 10차 | 전 `r5_00_homeRows_before` |
| 홈 행 상태(기존 디자인) | 새 프레임 [29447:141189](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-141189) — 4차 프레임 복제 후 칩 전부 숨김, 행 7개 | ① Bitget UID 685432171 초록 점 14.00 USDT ② Bitget UID 128112233 빨간 점 `-` + 분홍 배너 `UID Linking was unsuccessful. View reason.`(수동 연동 실패 CEX) ③ Lighter 0x7a3f…51e9 빨간 점 `-` + 분홍 배너 `Ownership verification was unsuccessful. View reason.` ④ Lighter 0x2b8e…91d0 빨간 점 `-` + 분홍 배너 ✏️`Wallet linking was unsuccessful. View reason.`(수동 연동 실패 DEX) ⑤ ApeX 주황 점 `-` + 주황 배너 `This wallet has been unlinked. …`(되찾기) ⑥ EdgeX 빨간 점 2.40 USDT(이슈 — 누르면 모달) ⑦ Aster 초록 점 `0.00 USDT`(칩 없음). 자동 연동 실패 행 없음 | 10차 · REQ-728 · REQ-729 · 0-1 기존 노드 | 전 `r5_00_homeRows_before` · 후 `r5_00_homeRows_after` |
| 배너를 누른 모달 4장 | 새 프레임 29447:143890 · 29447:144198 · 29447:144506 · 29447:144810 | 홈 행 상태 프레임 위 Backdrop(MAX-561 13060:146999 복제) + 모달. 수동 연동 실패 = MAX-561 사유 모달 복제(CEX 문구 · DEX ✏️ 문구, DEX 사유 `{Reason provided by backend}` 유지). 이슈 = MAX-7 `issue` 9401:87912 복제(CEX 원문 · DEX ✏️ `wallet`) | 10차 | `r5_00_modalCexFail_new` · `r5_00_modalDexFail_new` · `r5_00_modalCexIssue_new` · `r5_00_modalDexIssue_new` |
| 소유 확인 실패 · 되찾기 모달 | 기존 DEX(revision) O16 [29202:120644](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29202-120644) · O15 [29202:120092](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29202-120092) | 새로 만들지 않음 — 이미 있음 | REQ-729 | — |

### 0-4. 칩 정리 (DEX(revision) 홈 · `See All` 모달 · 지갑 목록)

검색: 잔액·홈 스토리·허브·요약·Mobile·사용자 기능·게스트·소유권·연동·오퍼·초대·파트너 허브·랭킹·개요·상세·랜딩 섹션의 보이는 TEXT 정규식 `^(Linking failed|No cashback yet|There.s an issue|Ownership verification failed|Data delayed|Inactive)$|Cashback appears here the day after|No exchange cashback yet`.

| 프레임 | 숨긴 칩(노드) | 함께 바꾼 것 | 전/후 |
|---|---|---|---|
| HW1 홈 기본 [28960:126108](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126108) | `No cashback yet` 29355:141319 | 행 점 초록(29355:141318) | `r5_00_HW1_before` · `_after` |
| `See All` 모달 PC [29327:382890](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-382890) | `No cashback yet`(인스턴스 오버라이드 I29327:382891;354:49560;354:49508) | Aster 점 초록 | `r5_00_seeAll_before` · `_after` |
| 홈 Balance 2장 29327:409544 · 29327:410386 | `No cashback yet`(오버라이드 …;354:49508) | Aster 점 초록 | — |
| 홈 Balance 지연 [29327:411242](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-411242) | `Data delayed` 29327:412259 · `No cashback yet` 29327:412250 | `Last updated …` 29327:412265 숨김, 점 초록 | `r5_00_delayed_before` · `_after` |
| 홈 행 States [29328:142352](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-142352) | `Data delayed` 29328:143383 · `Inactive` 29328:143394 · `No cashback yet` 29328:143355 | Lighter `Last updated …` 29328:143389 숨김·점 초록 / EdgeX(오프보딩) `No longer supported …` 29328:143400 숨김·**점 빨강(이슈 처리)** / Aster 점 초록. ApeX `Trying to link`는 5장에서 기존 디자인으로 | `r5_00_states_before` · `_after` |
| 홈 10개 초과 [29328:144444](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-144444) | `No cashback yet` 29328:145447 | 점 초록 | `r5_00_more10_before` · `_after` |
| 홈 선차감 29329:132465 | `No cashback yet` 29329:133468 | 점 초록 | — |
| 4차 Issue and failed 29418:141446 | `Linking failed` · `Ownership verification failed` · `There’s an issue` · `No cashback yet` | 프레임 전체 숨김(0-3) | — |

| 남긴 것 | 이유 |
|---|---|
| 파트너 허브 하위 계정 필터 `Inactive` 7곳(29197:119818 · 29197:120253) | 홈 목록이 아니라 기존 파트너 허브 하위 계정 상태값 |
| 모바일 섹션 | 대상 칩·문구 0건 |

### 0-5. 처리 중 상태의 기존 표시

| 상태 | 기존 디자인 | 지금 DEX(revision) |
|---|---|---|
| `Trying to link`(연동 시도 중) | [MAX-7] 9401:87675 첫 행: **분홍 점**(`error/accent` #FECDD2) + 오른쪽 **시계 아이콘**, 칩 없음, 금액 표시 | 5장에서 기존 디자인으로 바꿈(29328:142352 ApeX) |
| `Verifying ownership`(소유 확인 중) | [MAX-561] Web 12792:231646: **파란 점**(#0031C6) + 시계 아이콘 + 행 아래 문구 `Ownership verification in progress` + 경과 시간 `06:46`, 금액 `-` (텍스트 12866:10182) | 5장에서 기존 디자인으로 바꿈(O11 29453:143874) |
| `Data delayed` | 기존 디자인에 표시 없음 | 이번에 칩 숨김(0-4) |
| `Inactive` | 기존 디자인에 표시 없음 — 결정 10차로 이슈(빨간 점 + 이슈 모달) | 이번에 칩 숨김 · 점 빨강(0-4) |

---

## 1. 우선 1 — CEX UID 상세

| 항목 | 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|---|
| 인계 메모 FU-040 | [29066:900](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-900) | 제목 문단 끝에 `버튼은 지갑 상세 PW1과 같은 비활성 Auto Claim, 최소액 10 USDT 표기(Claimable … · Minimum 10 USDT).` 추가. 겹쳐 있던 본문 줄을 제목 아래로 내림 | REQ-133 · REQ-150 · 9차 #10 · PW1 29423:139539 표기 | `r5_01_FU040_before` · `_after` |
| 정책 변경 메모 · 자동 지급 및 계정별 잔액 | [28965:123621](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123621) | 같은 한 줄 추가, 메모 높이 286 → 307 | 같음 | `r5_01_memoBal_before` · `_after` |

연결된 기존 노드(25867:1347701 · 25867:1348700, [MAX-1216] 페이지)는 고치지 않았다.

## 2. 결정 위반 1~4

| # | 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|---|
| ① | 정책 변경 메모 · 친구 초대 [28965:123625](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28965-123625) | `50 USDT부터` → `10 USDT부터` | D8 | `r5_02_memoInvite_before` · `_after` |
| ② | FU-030 29066:870 · FU-032 29066:876 · FU-033 29066:879 · FU-034 29066:882 | 출금 화면 상태 줄(`전부 불가 — Not eligible to withdraw …`)을 카드별로 교체 — FU-030 `출금 화면 없음(자동 지급). 계정별 매칭 A + MIN(B, A)과 10 USDT 기준은 홈·허브·지갑 상세의 잔액 영역에 표시.` · FU-032 `… 로딩·0원·지연·오류는 홈·허브·지갑 상세의 잔액 영역 상태를 따름.` · FU-033 `… 지급 네트워크는 서비스 설정값(회원이 고르지 않음), 가스비는 테더맥스 부담.` · FU-034 `… 10분 주기로 10 USDT 이상 계정을 선차감해 신청 — 홈·허브·지갑 상세의 선차감 표시.` 링크(피그마·프로토타입)는 그대로 | Q1 · G-448 · 결정 3차 #3 · CLAUDE.md 구조(V2) | `r5_02_FU030_before` · `_after` |
| ③ | 정책 수정 안내 · 주요 화면 바로가기 [28988:126328](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28988-126328) | 바로가기 `DEX 미노출 · 점검 · 지역 제한` → `DEX 미노출 · 지역 제한`(링크 없는 라벨, 프레임 이름 같이) · 안내 `빈 상태·점검 문구` → `빈 상태 문구` | Q5 · G-460 | `r5_02_shortcut_before` · `_after` |
| ④ | 모바일 DEX 상세 리뷰 AI 요약 상자 7곳(I29360:141208 · 142189 · 143170 · 144149 · 145099 · 146073 · I29427:143972 ;22953:80447) | 칠 변수 `primary/_states/hover`(#1976D2) → `primary/blue/main`(#0031C6), 불투명도 4% 유지 | 리뷰 외 옛 파랑 통일 | `r5_02_aiBg_before` · `_after` |

## 3. 우선 2 상위

| # | 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|---|
| ① 공통 오류 토스트 | 새 프레임 [29449:145568](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29449-145568)(개발 인계 섹션 29065:114377 아래) · FU-009 [29066:807](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-807) | [MAX-426, MAX-498] 기존 `Error` 토스트 복제 — Web 11010:71581 · mWeb·App 10061:192535(`Something went wrong. Please try again.`). FU-009에 `공통 오류 토스트 Something went wrong. Please try again. — 429 · 중복 요청 · 잘못된 값 공통(결정 3차 #10 · G-459).` 한 줄 + `피그마 오류 토스트 열기` 링크 | 문구표 #28 · 3차 #10 | `r5_03_FU009_before` · `_after` · `r5_03_toast_new` |
| ② 개발 인계 메모 링크 4장 | 29010:126471 · 29010:126483 · 29010:126475 · 29010:126487 | 숨긴 `API 상태 흐름 1·5·3·7`을 가리키던 `상태별 진입·복귀 경로 열기 →`를 보이는 프레임으로 다시 연결하고 문구를 대상에 맞춤 — `L3-R 입력 유지 복귀 화면 열기 →` → 29327:385103 · `빈 리뷰 화면 열기 →` → 29367:137704 · `O10 제출 확인 화면 열기 →` → 28960:127700 · `제출 실패 화면 열기 →` → 28978:127476(Quiz 4 / Submit failed) | 결정 7차 | `r5_03_memoLink_*` · `r5_03_memoDetail_*` · `r5_03_memoOwn_*` · `r5_03_memoQuiz_*` |
| ③ FU 카드 링크 4장 | FU-071 29066:993 · FU-074 29066:1002 · FU-075 29066:1005 · FU-087 29066:1041 | 삭제된 29062:113000 · 29062:114041 대신 — FU-071 → 혜택 · 진행 중 · 회원 29327:400264 · FU-074 → TP · 포인트 내역 29062:114990 · FU-075 → 캐시백 챌린지 · 진행 29335:140752 · FU-087 → 혜택 · 진행 중 29062:114038(링크 문구 `피그마 앱·공지·약관 열기` → `피그마 혜택 열기`) | 결정 7차 | `r5_03_FU071_before` · `_after` |
| ④ 모바일 `See All` 꽉 찬 모달 | 새 프레임 [29449:145601](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29449-145601)(Mobile · Link Account 섹션 28969:126952, 모바일 홈 29381:137457 오른쪽) | 모바일 꽉 찬 모달 껍데기(28969:126986 — 상태 표시줄 · 하단 브라우저 바) + PC 모달 29327:382893 내용(`Linked Accounts` 4 · `4 Total` · `All`/`CEX`/`DEX` · 거래소 묶음 · `Close`)을 375 폭 전체로 | Q3 · 6차 칩 · 9401:160223 | `r5_03_mSeeAll_new` |

## 4. 추가 결정 — 캐시백 0원 안내 없음

| 항목 | 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|---|
| 지갑 상세 0원 | 4차 「Zero balance」 [29423:139494](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29423-139494) | 프레임 숨김(G-110 배너 `Cashback appears here the day after you trade on your linked DEX.` 포함) | 추가 결정(0이면 `0.00 USDT`만) | `r5_00_PW1zero_before` |
| 그 밖의 0원 안내 | — | `Cashback appears here the day after` 보이는 곳은 위 1곳뿐, `No exchange cashback yet` 0건. `No cashback yet` 칩은 0-4에서 숨김 | 같음 | — |

---

## 새 프레임 목록

| 노드 | 이름 | 섹션 |
|---|---|---|
| [29447:141189](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-141189) | DEX / Web / DEX withdraw HW1 Home, Linked Accounts / Light · Row status (existing design) | 잔액 표시 28960:125772 (새 줄 y 11100) |
| [29447:143890](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-143890) | … · Manual link failed modal (CEX) | 같음 |
| [29447:144198](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-144198) | … · Manual link failed modal (DEX) ✏️ | 같음 |
| [29447:144506](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-144506) | … · Issue modal (CEX) | 같음 |
| [29447:144810](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29447-144810) | … · Issue modal (DEX) ✏️ | 같음 |
| [29449:145568](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29449-145568) | 공통 · 오류 토스트 · Something went wrong. Please try again. | 개발 인계 29065:114377 |
| [29449:145601](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29449-145601) | Home / mWeb / S4 · See All · Linked Accounts (full modal) | Mobile · Link Account 28969:126952 |

섹션 크기: 28960:125772 높이 10875 → 12900 · 29065:114377 높이 5886 → 6500 · 28969:126952 폭 → 10275.

## 캡처

| 항목 | 전 | 후 |
|---|---|---|
| 홈 행 상태 | ![전](Figma수정결과_img/r5_00_homeRows_before.jpg) | ![후](Figma수정결과_img/r5_00_homeRows_after.jpg) |
| 수동 연동 실패 모달 CEX · DEX | ![CEX](Figma수정결과_img/r5_00_modalCexFail_new.jpg) | ![DEX](Figma수정결과_img/r5_00_modalDexFail_new.jpg) |
| 이슈 모달 CEX · DEX | ![CEX](Figma수정결과_img/r5_00_modalCexIssue_new.jpg) | ![DEX](Figma수정결과_img/r5_00_modalDexIssue_new.jpg) |
| 홈 행 States | ![전](Figma수정결과_img/r5_00_states_before.jpg) | ![후](Figma수정결과_img/r5_00_states_after.jpg) |
| `See All` 모달 PC | ![전](Figma수정결과_img/r5_00_seeAll_before.jpg) | ![후](Figma수정결과_img/r5_00_seeAll_after.jpg) |
| HW1 홈 | ![전](Figma수정결과_img/r5_00_HW1_before.jpg) | ![후](Figma수정결과_img/r5_00_HW1_after.jpg) |
| 홈 지연 | ![전](Figma수정결과_img/r5_00_delayed_before.jpg) | ![후](Figma수정결과_img/r5_00_delayed_after.jpg) |
| 홈 10개 초과 | ![전](Figma수정결과_img/r5_00_more10_before.jpg) | ![후](Figma수정결과_img/r5_00_more10_after.jpg) |
| 지갑 상세 0원(숨김) | ![전](Figma수정결과_img/r5_00_PW1zero_before.jpg) | (숨김) |
| FU-040 | ![전](Figma수정결과_img/r5_01_FU040_before.jpg) | ![후](Figma수정결과_img/r5_01_FU040_after.jpg) |
| 정책 메모 · 잔액 | ![전](Figma수정결과_img/r5_01_memoBal_before.jpg) | ![후](Figma수정결과_img/r5_01_memoBal_after.jpg) |
| 정책 메모 · 초대 | ![전](Figma수정결과_img/r5_02_memoInvite_before.jpg) | ![후](Figma수정결과_img/r5_02_memoInvite_after.jpg) |
| FU-030(032 · 033 · 034 같은 방식) | ![전](Figma수정결과_img/r5_02_FU030_before.jpg) | ![후](Figma수정결과_img/r5_02_FU030_after.jpg) |
| 바로가기 | ![전](Figma수정결과_img/r5_02_shortcut_before.jpg) | ![후](Figma수정결과_img/r5_02_shortcut_after.jpg) |
| 모바일 리뷰 AI 배경 | ![전](Figma수정결과_img/r5_02_aiBg_before.jpg) | ![후](Figma수정결과_img/r5_02_aiBg_after.jpg) |
| FU-009 · 오류 토스트 | ![전](Figma수정결과_img/r5_03_FU009_before.jpg) | ![후](Figma수정결과_img/r5_03_FU009_after.jpg) ![새](Figma수정결과_img/r5_03_toast_new.jpg) |
| 인계 메모 · 연동 | ![전](Figma수정결과_img/r5_03_memoLink_before.jpg) | ![후](Figma수정결과_img/r5_03_memoLink_after.jpg) |
| 인계 메모 · 상세 | ![전](Figma수정결과_img/r5_03_memoDetail_before.jpg) | ![후](Figma수정결과_img/r5_03_memoDetail_after.jpg) |
| 인계 메모 · 소유권 | ![전](Figma수정결과_img/r5_03_memoOwn_before.jpg) | ![후](Figma수정결과_img/r5_03_memoOwn_after.jpg) |
| 인계 메모 · 퀴즈 | ![전](Figma수정결과_img/r5_03_memoQuiz_before.jpg) | ![후](Figma수정결과_img/r5_03_memoQuiz_after.jpg) |
| FU-071(074 · 075 · 087 같은 방식) | ![전](Figma수정결과_img/r5_03_FU071_before.jpg) | ![후](Figma수정결과_img/r5_03_FU071_after.jpg) |
| 모바일 `See All` 꽉 찬 모달 | — | ![새](Figma수정결과_img/r5_03_mSeeAll_new.jpg) |

## 검색 기록

| 찾은 것 | 범위 · 검색어 | 결과 |
|---|---|---|
| 소유 확인 실패 · 되찾기 배너 | 오프라인 색인 `figma_pages/*.xml` `has been unlinked|Ownership verification|View reason` → Figma [MAX-561] 12474:14170 전체 TEXT `verification was unsuccessful|has been unlinked\. Tap|reclaim it|There is a problem` | MAX-561 28건(mWeb · Web · 다크) |
| 이슈 모달 | [MAX-7] 1:6 전체 TEXT 같은 정규식 · 9401:87675 주변 프레임 | 9401:87912 1건 |
| 수동 연동 실패 배너·모달 | 색인 xml `Linking was unsuccessful|Linking Unsuccessful|not found in the tetherMax|Remove UID` 0건 → Figma [MAX-30] 8013:42844 · [MAX-7] 1:6 · [MAX-561] 12474:14170 · Improvements 18919:114978 · Retention 22290:778 · KO Polishing 22680:229975 · [MAX 1216] 22044:758840 · [MAX-601] 9287:167854 TEXT 같은 정규식 | Figma 0건(`Remove UID`는 MAX-561 소유권 모달만). 실사이트 수집본 `member__en.pc.55bc12d8.js`에 배너 문구 1건 |
| 국문 원문 | KO Polishing TEXT `연동에 실패|연동 실패|문제가 있|소유권 인증에 실패|연동이 해제` · 실사이트 국문 조각 | 0건 |
| 공통 오류 토스트 | [MAX-426, MAX-498] 7884:41063 TEXT `Something went wrong` | `Error` 인스턴스 5건(원본 Web 11010:71581 · mWeb 10061:192535) |
| 칩 · 0원 안내 | 0-4 정규식, DEX(revision) 섹션 단위 | 0-4 표 |

---

## 최종점검 항목 대응

| 점검 행([Figma_최종상태점검.md](Figma_최종상태점검.md)) | 처리 결과 |
|---|---|
| 1 · 우선 1 · CEX UID 상세 — 메모에 `Auto Claim` · 10 USDT 지시 없음 | 처리 — FU-040 · 28965:123621에 한 줄(1장) |
| 2-1 · 공통 오류 토스트 없음 | 처리 — 새 프레임 29449:145568 + FU-009 한 줄·링크(3장 ①) |
| 2-1 · 개발 인계 메모 4장 링크가 숨긴 프레임 | 처리 — 보이는 프레임으로 재연결 · 문구 맞춤(3장 ②) |
| 2-1 · FU-071 · 074 · 075 · 087 링크 대상 없음 | 처리 — 재연결(3장 ③) |
| 2-1 · 모바일 `See All` 꽉 찬 모달 없음 | 처리 — 새 프레임 29449:145601(3장 ④) |
| 4 · 결정 위반 1 · 초대 `50 USDT` | 처리 — `10 USDT`(2장 ①) |
| 4 · 결정 위반 2 · FU-030 · 032 · 033 · 034 출금 화면 상태 줄 | 처리 — 「출금 화면 없음(자동 지급)」 기준으로 교체(2장 ②) |
| 4 · 결정 위반 3 · 바로가기 `점검` | 처리 — `점검` 삭제 · 안내 문구 정리(2장 ③) |
| 4 · 결정 위반 4 · 모바일 리뷰 AI 요약 옛 파랑 7노드 | 처리 — `primary/blue/main` 4%(2장 ④) |
| 4 · 결정 위반 5 · 옛 GNB 패널(컴포넌트 메인) | 이번 범위 아님 — 컴포넌트 메인 수정 금지 |
| 4 · ❓6 · ❓7 사용자 확인 | 이번 범위 아님 |
| 3-3 · 홈·지갑 상세 모바일 짝(0원 포함) | 일부 해당 — 0원 상태는 추가 결정으로 없음(0-4 · 4장). 나머지 모바일 짝은 이번 범위 아님 |
| 2-2 · 홈 H3 · H4 · 지갑 상세 D7 등 동작 규칙 미정 | 이번 범위 아님(부록 G 결정 대기) |
| (점검 이후 결정) 10차 홈 행 상태 · 칩 | 처리 — 0장 |
| (점검 이후 결정) 캐시백 0원 안내 없음 | 처리 — 4장 |
| (점검 이후 결정) 요약 반영 지연 없음 · 처리 중 행 기존 디자인 | 처리 — 5장 |
| 4 · ❓8 · Cashback Basics `Withdraw cashback and rewards` | 처리 — 11차 결정으로 `Claim cashback and rewards`(6장) |

## 프로토타입에 반영할 것

| # | 내용 | 기준 노드 |
|---|---|---|
| 1 | 홈·`See All` 모달·지갑 목록에서 `No cashback yet` · `Data delayed` · `Inactive` 칩 제거. 0원은 `0.00 USDT`만, 지연은 정상 행(`Last updated` 줄 없음), 오프보딩은 빨간 점 + 이슈 모달 | 29328:142352 · 29447:141189 |
| 2 | 행 아래 배너 4종(수동 연동 실패 · 소유 확인 실패 · 되찾기) 모양을 `ownership notice` 컴포넌트(분홍 Error · 주황 Warning)로, 점 색 초록·빨강·주황 | 29447:141189 |
| 3 | 수동 연동 실패 모달: CEX `UID Linking Unsuccessful` · 사유 · `Remove UID`(회색) · `UID Link`(파랑) / DEX ✏️ `Wallet Linking Unsuccessful` · 사유 `{Reason provided by backend}` · `Remove Wallet` · `Link Wallet` | 29447:143890 · 29447:144198 |
| 4 | 이슈 모달 DEX 문구 ✏️ `There is a problem with this wallet.` | 29447:144810 |
| 5 | 지갑 상세 0원 배너(`Cashback appears here the day after …`) 제거 | 29423:139494(숨김) |
| 6 | 공통 오류 토스트 `Something went wrong. Please try again.` — 429 · 중복 요청 · 잘못된 값 | 29449:145568 |
| 7 | 모바일 홈 `See All` = 꽉 찬 모달(상태 표시줄 아래 전체, `All`/`CEX`/`DEX` 칩, `Close`) | 29449:145601 |
| 8 | 모바일 DEX 상세 리뷰 AI 요약 배경 `primary/blue/main` 4% | 29360:141208 |
| 9 | `Trying to link` 칩 → 분홍 점 + 시계 아이콘, `Verifying ownership` 칩 → 파란 점 + 시계 + 행 아래 `Ownership verification in progress · {경과 시간}`(DEX 상세 오퍼 박스 비활성 `Trying to link` 버튼은 그대로) | 29328:142352 · 29453:143874 |
| 10 | 반영 지연(`Delayed` · `DEX data delayed` · `Last updated`) 표시 제거 — 요약 · 허브 H6 · 홈 잔액 · 지갑 상세 | 29327:126239 · 28960:126914 · 29327:411242 · 29330:199016(숨김) |
| 11 | Cashback Basics 소제목 `Claim cashback and rewards`(본문 · 목차, PC · 모바일) | 29328:132715 · 29381:137257 |

---

## 5. 반영 지연 표시 없음 · 처리 중 상태 기존 디자인 (10차 추가 결정)

### 5-1. 기존 노드 원문

| 상태 | 기존 노드 | 원문 EN | KO |
|---|---|---|---|
| `Trying to link`(연동 시도 중) | [MAX-7] mWeb 9401:87675 첫 UID 행 — 점 `<Badge>` 9401:87908(`error/accent` #FECDD2) · 시계 `AccessTimeRounded` [9401:123881](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=9401-123881) | 행 문구 없음(`UID 685432171` + 점 + 시계만) | — |
| `Verifying ownership`(소유 확인 중) | [MAX-561] Web 12792:231646 행 — 파란 점(#0031C6) · 시계 · 텍스트 [12866:10182](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=12866-10182) | `Ownership verification in progress` · `06:46`(경과 시간 표본) | Figma에 없음(KO Polishing 검색 0건) |
| DEX(revision) O11 안내 배너(이미 있음) | O11 행 아래 Info 배너 | `Ownership verification in progress · 06:46` | — |

### 5-2. 바꾼 것 (노드 8)

| 항목 | 화면(노드) | 바꾼 것 | 전/후 |
|---|---|---|---|
| 요약 `Delayed` | CS1 Month view · Delayed [29327:126239](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-126239) · 라벨 29327:126785 | 프레임·라벨 숨김(`Last updated 2026.05.25 09:12` 포함). 요약 섹션에 남은 `Last updated`·지연 문구 0건. 모바일 요약 짝은 없음(Mobile 섹션 검색 0건) | `r5_05_CSdelayed_before` |
| 홈 행 `Trying to link` | 홈 행 States [29328:142352](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-142352) ApeX 행 | 칩 29328:143374 숨김 · 점 분홍 #FECDD2(29328:143346) · 금액 칸 아래 시계 아이콘(9401:123881 복제 → 29453:143872) | `r5_05_states_before` · `_after` |
| 홈 행 `Verifying ownership` | 소유권 O11 Review in progress — 인스턴스 28960:127709를 DEX(revision)에서만 분리 → [29453:143874](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29453-143874) | 칩(…;354:49492) 숨김 · 점 파랑 #0031C6(…;354:49489) · 시계 아이콘 29453:144359. 행 아래 `Ownership verification in progress · 06:46` 배너는 그대로 | `r5_05_O11_before` · `_after` |
| 그대로 둔 것 | DEX 상세 오퍼 박스 비활성 `Trying to link` 버튼 29327:389568(Q6) | 변경 없음 | — |

검색: 잔액·홈 스토리·허브·소유권·연동·사용자 기능·게스트·오퍼 섹션 TEXT `^(Trying to link|Verifying ownership|Ownership verification in progress)` → 칩 2(States ApeX · O11) + 오퍼 버튼 1 + O11 배너 1. Mobile 섹션 → 칩 0(소유권 모바일 4프레임은 안내 문구만). 요약 섹션 `Last updated|[Dd]elayed` → 29327:126239 · 126785만.


| 전 | 후 |
|---|---|
| ![전](Figma수정결과_img/r5_05_states_before.jpg) | ![후](Figma수정결과_img/r5_05_states_after.jpg) |
| ![전](Figma수정결과_img/r5_05_O11_before.jpg) | ![후](Figma수정결과_img/r5_05_O11_after.jpg) |
| ![전](Figma수정결과_img/r5_05_CSdelayed_before.jpg) | (숨김) |

### 5-3. 다른 화면의 반영 지연 표시

검색: DEX(revision) 전 섹션(섹션 단위) 보이는 TEXT `Last updated|data delayed`.

| 화면(노드) | 처리 | 전 |
|---|---|---|
| 허브 `H6 DEX data delayed` PC [28960:126914](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126914) + 라벨 28960:126915 | 숨김(`Last updated 2026.10.14, 09:12`) — 8차 H6 제외 · 반영 지연 표시 없음 | `r5_06_hubH6_before` |
| 허브 H6 모바일 라이트 [28960:130824](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130824) + 라벨 28960:130825 · 다크 28960:130900 + 라벨 28960:130901 | 숨김 | `r5_06_hubH6m_before` |
| 홈 `Balance delayed` [29327:411242](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-411242) | 프레임 숨김(`Last updated 2026.05.12 14:35`) | `r5_06_balDelayed_before` |
| 지갑 상세 `Delayed` [29330:199016](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-199016) | 프레임 숨김(`Last updated 2026.05.11 09:00`) | `r5_06_PW1delayed_before` |
| 인계 메모 FU-038 29066:896 · FU-039 29066:899 | `DEX 칩 — No cashback yet · Data delayed · Inactive` → `상태 칩 없음 — 0원 0.00 USDT · 이슈·오프보딩 빨간 점 · 확인 중 분홍 점+시계 · 소유 확인 중 파란 점+시계` | `r5_06_FU038_before` · `_after` |
| 인계 메모 FU-040 29066:902 | ` · 지연 — Last updated` 삭제 | `r5_01_FU040_after` |

검색 결과 남은 보이는 `Last updated`·`data delayed` 0건.

## 6. Cashback Basics 소제목 (11차 결정)

| 화면(노드) | 바꾼 것 | 근거 | 전/후 |
|---|---|---|---|
| Cashback Basics PC 29328:132677 — 본문 소제목 [29328:132715](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-132715) · 목차 항목 I29328:132739;19604:32283(인스턴스 오버라이드) | `Withdraw cashback and rewards` → `Claim cashback and rewards` | 11차 · D2(요청·동작 = Claim) | ![전](Figma수정결과_img/r5_06_basicsPCtitle_before.jpg) → ![후](Figma수정결과_img/r5_06_basicsPCtitle_after.jpg) |
| Cashback Basics 모바일 29381:137153 — [29381:137257](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29381-137257) | 같음(두 줄 → 한 줄, 폭 343 안) | 같음 | ![전](Figma수정결과_img/r5_06_basicsMtitle_before.jpg) → ![후](Figma수정결과_img/r5_06_basicsMtitle_after.jpg) |

검색: 퀴즈 · Mobile · 랜딩 · 사용자 기능 섹션 TEXT `Withdraw cashback` → 위 3노드. TP 포인트 내역의 `Withdraw Cashback`(29365:134760 · I29062:114572;12565:318983)은 기존 TP 서비스의 포인트 적립 유형명이라 대상 아님.

| 전 | 후 |
|---|---|
| ![전](Figma수정결과_img/r5_06_hubH6_before.jpg) | (숨김) |
| ![전](Figma수정결과_img/r5_06_PW1delayed_before.jpg) | (숨김) |
| ![전](Figma수정결과_img/r5_06_FU038_before.jpg) | ![후](Figma수정결과_img/r5_06_FU038_after.jpg) |
