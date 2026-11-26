# Figma 수정 결과 — rewards (맥스보드 · 리그 · 쿠폰 · 혜택 · 챌린지 · 이벤트 · 퀴즈 · TP · 친구 초대 · 파트너 허브 · 이메일)

2026-11-26 · Figma `UI-UX-Design` [DEX(revision)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519) · 계획서 [Figma수정계획_rewards](Figma수정계획_rewards.md) · 결정 [_Figma수정_결정](_Figma수정_결정.md) · 문구표 [문구표_DEX](문구표_DEX.md)(확정본)

## 요약

| 구분 | 수 | 내용 |
|---|---|---|
| 완료 | **33 / 33** | R-01 ~ R-33. 일부 항목은 아래 「못 한 것」의 범위를 빼고 완료 |
| 문구 대기 | **0** | 계획서의 「문구 원문 없음」 항목은 문구표 확정 문구(#55 ~ #74 · #80)로 모두 채움. 값 미정(G-425 · G-025 · G-036 · G-089)에 걸리는 rewards 텍스트는 없음 |
| 새 프레임 | **58** | 기존 프레임을 복제한 뒤 텍스트·값·속성만 바꿈(+ 제목 띠 26개) |
| 숨김 처리 | 4 | 맥스보드 결과 발표·제외 2프레임(R-28) · 파트너 허브 연동 계정 모달 원본 1(R-23, 그룹 헤더판으로 대체) · 리그 상금 배경 옛 GNB(투명, R-33) |

### 못 한 것 · 일부만 한 것

| 항목 | 내용 | 이유 |
|---|---|---|
| R-06 모바일 | Cashback Basics MO 프레임을 만들지 않음 | 기존 `[MAX-]Quiz` 페이지에 Cashback Basics(Module 3) MO 원본이 없음. PC만 있음(`19604:32207`). 계획서가 MO 원본으로 적은 `19604:31955`는 다른 모듈(선물 거래) |
| R-21 상태 16종 | MO 아티클 2 · 퀴즈 2만 만들고, 상태 16종(Validation · Login required · Submit failed · Scoring unavailable · 결과 3종 · Previously completed × 2모듈)은 만들지 않음 | 기존 mWeb에 인라인 상태 틀이 없어 새 모양이 필요함. MO 원본(`19604:32020` · `19604:32311`)이 다크 테마라 복제본도 다크 |
| R-02 모바일 CTA | MO 복제본의 하단 CTA는 게스트용 `Sign Up to Get Started` 그대로 | MO 원본(`9622:112561`)이 게스트 화면. 회원용 CTA가 있는 MO 원본 없음. PC는 비활성 `Auto Claim`으로 바꿈 |
| R-14 PC | `Total Amount` 행은 넣었으나 구분선은 넣지 않음, PC 수정 전 캡처 없음 | 표 안에 구분선 요소가 없음. 캡처 전에 행을 추가함 |
| R-15 · R-32 모바일 | MO 약관·FAQ 문구를 고치지 않음 | MO 프레임(`29062:116256` · `29062:114572`)은 약관이 접힌 상태라 해당 텍스트가 없음 |
| R-10 보드 칸 | 보드 이름·거래소 표기·Notes만 바꾸고 빙고 칸 구성은 기존 Bingo 그대로 | DEX 프레임과의 칸 구성 대조는 하지 않음 |
| 공통 GNB | 다른 페이지에서 복제한 PC 프레임(혜택·쿠폰·챌린지·이벤트) 상단은 옛 GNB(`Exchanges · Events · Benefits …`) 그대로 | GNB는 content 담당 공통 요소(지시서 「공통 요소는 content 담당만」). R-33만 계획서대로 교체 |

### 새로 만든 프레임

| 위치(섹션 · 줄) | 항목 | 노드 |
|---|---|---|
| 사용자 기능 · y 23000 | R-02 · R-17 · R-18 · R-19 | `29327:399908` `29327:400148` · `29327:401035` `29327:401359` · `29327:401970` `29327:402446` · `29327:403008` `29327:403439` |
| 사용자 기능 · y 26000 | R-09 · R-11 · R-12 · R-13 · R-27 | `29330:190799` `29330:190825` `29330:190851` `29330:190871` `29330:190891` · `29330:190914` `29330:190925` · `29330:190939` `29330:191295` · `29330:191656` `29330:192021` · `29330:192386` `29330:192447` |
| 사용자 기능 · y 33000 | R-10 | `29333:136433` `29333:136679` `29333:136933` `29333:137288` `29333:137648` `29333:137992` `29333:138341` `29333:138685` `29333:139034` `29333:139379` |
| 사용자 기능 · y 40000 | R-14 · R-16 · R-25 · R-29 · R-30 · R-20 | `29335:137816` · `29335:137823` `29335:138417` `29335:138649` `29335:139152` · `29335:139384` `29335:139635` · `29335:140206` `29335:140457` · `29335:140570` `29335:140714` · `29335:142890` `29335:143129` `29335:143474` `29335:143585` `29335:144127` `29335:144217` |
| 파트너 허브 섹션 | R-23 | `29327:312369` |
| 퀴즈 섹션 | R-06 · R-21 | `29328:132677` · `29350:140312` `29350:140379` `29350:140446` `29350:140491` |
| 사용자 이메일 섹션 | R-26 | `29349:139404` `29349:139470` `29349:139536` `29349:139602` |

---

## 우선 1

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| R-01 맥스보드 Account | [참여 전 자격 없음](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-8176) · [재선택 가능](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-8888) · [선택지 없음](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-9601) · [보드 완성](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-10322) 외 맥스보드 22프레임(PC·MO) | 버튼 `Link Account` · `Select New Account` / 제목 `You have no eligible EdgeX account` / 둘째 문장 `Only EdgeX accounts registered with TetherMax after Sep 3, 09:00 can participate. Link a new EdgeX account to participate.` / `You Can No Longer Participate with This Account` · `This account can no longer join this board.` / 주황 배너 `You have no eligible EdgeX account` + `Link a new account to participate again.` / 지급일 `Event Rewards will be paid to your participating account from Oct 31, 09:00.`(중복 줄 삭제) / 자격 있음 배너 `You Have an Eligible Account` / Notes `wallet(s)` → `account(s)` | REQ-655 원문 · 결정 N5 · 용어 규칙 | 전/후 아래 |
| R-02 첫 캐시백 상세 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-399908) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-400148) | 기존 MAX-468 상세 복제 · `Eligible Exchanges` = `CEX and DEX` 행 추가 · PC CTA 비활성 `Auto Claim` | REQ-398 · N9 · 문구표 #55 · 기존 `10978:69402` `9622:112561` | 전/후 아래 |
| R-03 친구 초대 MO | [친구 초대 · 모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-6175) | `Withdraw` → 비활성 `Auto Claim`(같은 Button 세트 State=Disabled) · 제목 `Exchange Account Registration Status` · 열 `No. of Registered Accounts` · PC 캡션 복제 · 행 CEX 4(Bybit 추가) + DEX 4(Lighter·ApeX·EdgeX·Aster, PC 값) · 배지 `38` · 푸터·프레임 높이 보정 | REQ-414 · 415 · 420 · 433 · PC IF7 `28967:127210` | 전/후 아래 |
| R-04 초대 최소 10 USDT | IF1 · IF2 · IF3 · IF6 · IF7 · [약관 펼침 MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29243-123606) · [PH1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127182) · 메모 `29243:123768` | `reach 50 USDT` → `reach 10 USDT`(회원 6곳) · `paid automatically from 10 USDT`(파트너 허브) · 메모 `10 USDT부터` | 결정 D8 · REQ-414 | 전/후 아래 |
| R-05 파트너 허브 MO | [파트너 허브 · 모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-3660) · PH1 | 버튼 비활성 `Auto Claim` · 금액 라벨 PC·MO `Claimable Amount` · 퍼널 `Payout / Settled Rate` + `DEX: cashback settled` · Linked Accounts 아래 `Sub-accounts’ cashback in USDT (USDC shown 1:1).` · 프레임 높이 보정 | REQ-428 · 430 · 434 · 문구표 #56 | 전/후 아래 |
| R-06 Cashback Basics | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-132677) | 기존 Module 3 복제 · 출금 절 4줄 = 문구표 #67 ~ #70(게스트 문장 삭제) · 캐시백 내역 `by exchange, account, and reward type.`(#71) · KEY TAKEAWAYS 3줄 = #72 ~ #74(주장 문장 굵게) · 제목 오타 `KEY TAKEWAYS` → `KEY TAKEAWAYS` | REQ-714 · N12 · Q8 · 기존 `19604:32207` | 전/후 아래 |
| R-07 EMAIL 29 EN | [630](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29061-1308) · [375](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-2592) | `Please ensure to withdraw any cashback accrued before the termination date.` 삭제 | REQ-669 · KO 판 `29062:118802` | 전/후 아래 |

![R-01 전 — 참여 전 자격 없음](Figma수정결과_img/rewards_R01a_before.jpg) ![R-01 후](Figma수정결과_img/rewards_R01a_after.jpg)

![R-01 전 — 재선택 가능](Figma수정결과_img/rewards_R01b_before.jpg) ![R-01 후](Figma수정결과_img/rewards_R01b_after.jpg)

![R-01 전 — 선택지 없음](Figma수정결과_img/rewards_R01c_before.jpg) ![R-01 후](Figma수정결과_img/rewards_R01c_after.jpg)

![R-01 전 — 보드 완성 지급일](Figma수정결과_img/rewards_R01d_before.jpg) ![R-01 후](Figma수정결과_img/rewards_R01d_after.jpg)

![R-02 전 — 기존 MAX-468](Figma수정결과_img/rewards_R02_before.jpg) ![R-02 후](Figma수정결과_img/rewards_R02_after.jpg)

![R-03 전](Figma수정결과_img/rewards_R03_before.jpg) ![R-03 후](Figma수정결과_img/rewards_R03_after.jpg)

![R-04 전 — IF1 약관](Figma수정결과_img/rewards_R04a_before.jpg) ![R-04 후](Figma수정결과_img/rewards_R04a_after.jpg)

![R-04 전 — 파트너 허브 약관](Figma수정결과_img/rewards_R04b_before.jpg) ![R-04 후](Figma수정결과_img/rewards_R04b_after.jpg)

![R-04 전 — MO 약관 펼침](Figma수정결과_img/rewards_R04c_before.jpg) ![R-04 후](Figma수정결과_img/rewards_R04c_after.jpg)

![R-05 전 — PH1 상단](Figma수정결과_img/rewards_R05a_before.jpg) ![R-05 후](Figma수정결과_img/rewards_R05a_after.jpg)

![R-05 전 — MO 상단](Figma수정결과_img/rewards_R05b_before.jpg) ![R-05 후](Figma수정결과_img/rewards_R05b_after.jpg)

![R-05 전 — MO 퍼널](Figma수정결과_img/rewards_R05c_before.jpg) ![R-05 후](Figma수정결과_img/rewards_R05c_after.jpg)

![R-06 전 — 기존 Module 3](Figma수정결과_img/rewards_R06_before.jpg) ![R-06 후](Figma수정결과_img/rewards_R06_after.jpg)

![R-07 전](Figma수정결과_img/rewards_R07_before.jpg) ![R-07 후](Figma수정결과_img/rewards_R07_after.jpg)

## 우선 2

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| R-08 `Updated once a day` | [정산 지연](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29062-111741) · [집계](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-12448) · 결과 발표 · 지급 기간 · 제외(PC·MO) · [보드 완성](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-10322) | 지연 2곳 · 집계 이후 단계 1곳씩 숨김(12개) · 보드 완성 리더보드 위 `Rankings are updated daily.` · 지급일 중복 줄 삭제(R-01과 같이) | REQ-639 · 640 · 654 · 문구표 #62 | 전/후 아래 |
| R-09 참여 계정 선택·확인 | [선택](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-190799) · [확인 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-190851) · MO 3 | 시안 B 6프레임 복제 · `Select an Account to Participate` · `Only eligible EdgeX accounts are shown.` · `Would you like to participate with this account?` · 재선택 본문 REQ-655 원문 · 행 `EdgeX · Wallet` + 전체 주소(줄바꿈) | REQ-646 · 655 · 문구표 #64 ~ #66 · 기존 `28537:463009` 외 | 전/후 아래 |
| R-10 게스트·미참여 5단계 | [사전공개 · 게스트 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29333-136433) 외 9 | 기존 Bingo 10프레임 복제 · `October EdgeX MAX BOARD` · 거래소 표기 블록을 DEX 프레임의 EdgeX 블록으로(Bitget 블록 숨김) · Notes를 DEX Notes로 | 결정 N4 · REQ-634 | 전/후 아래 |
| R-11 등록 실패 토스트 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-190914) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-190925) | warning 토스트 복제 · `You can't participate with this account.` | REQ-649 · 655 · 기존 `28537:451988` | 전/후 아래 |
| R-12 오늘 마감 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-190939) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-191295) | 참여 가능 복제 · 일정 `Ends Today` · 카운트다운 일수 `0D` | REQ-639 | 전/후 아래 |
| R-13 마지막 날 Batch 후 완성 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-191656) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-192021) | 보드 완성 복제 · 리더보드 위 `Final rankings will be shown when results are announced · {date}` | REQ-654 · 문구표 #63 | 전/후 아래 |
| R-14 쿠폰 적용 완료 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-7079) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-137816) | PC `Total Amount` 행 · MO 복제 → `Event rewards can be withdrawn only up to the amount of cashback you have earned.` · `EdgeX` · `Wallet` + 전체 주소 · `Total Amount` | REQ-405 · 기존 `25994:12167` | 전/후 아래 |
| R-15 쿠폰 약관 | [쿠폰 · 사용 / 만료 이력 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29062-115768) | `To use a coupon, you must link at least one account (UID or wallet).` · `'Coupon for UID binding' is given the first time you link a UID from a centralised exchange. Linking a DEX wallet does not qualify.` | REQ-404 · 문구표 #58 · #59 | 전/후 아래 |
| R-16 쿠폰 다이얼로그 | [연동 없음 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-137823) · [연동 없음 MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-138417) · [이미 사용 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-138649) · [이미 사용 MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-139152) | 연동 없음: `Unable to Use Coupon` / `You need to link an account to use the coupon.` / `Cancel` · `Link Account`(2버튼 다이얼로그 복제) · 이미 사용: `Unable to Use Coupon` / `This coupon has already been used.` / `OK` | G-196 · API-017 · 문구표 #60 · #61 · 기존 `12474:164021` | 전/후 아래 |
| R-17 혜택 진행 중(회원) | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-401035) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-401359) | `LINK UID` 행 부제 `Link a CEX UID to Get Cashback` | REQ-396 · 400 · 기존 `10954:228708` `17170:172813` | 전/후 아래 |
| R-18 혜택 완료 0건 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-401970) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-402446) | `No Completed Rewards Yet` · 버튼 `Explore Ongoing Rewards` | REQ-401 · 기존 `10954:230325` `11100:221304` | 전/후 아래 |
| R-19 UID 연동 3 USDT | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-403008) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-403439) | `Link a CEX UID to Get Cashback` · `Link a CEX exchange UID to start earning cashback and receive 3 USDT.` · `Eligible Exchanges` = `CEX only` · 안내 박스 둘째 줄 `Linking a DEX wallet does not qualify for this reward.` | REQ-396 · 기존 `10976:53104` `11731:356403` | 전/후 아래 |
| R-20 캐시백 챌린지 | [진행 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-142890) · [수령 계정 선택 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-143474) · [계정 연동 필요 PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-144127) · MO 3 | 부제 `Cashback history is updated daily at {local_time}` · 약관 3곳 `account` · 선택 모달 `Select an account to receive the reward` + 목록을 쿠폰 계정 선택 블록(All/CEX/DEX 칩 · 그룹 헤더)으로 교체(옛 목록 숨김) · `Account Link Required` · `Link your account to join the event and start earning rewards.` · `Unlocks after linking an account` | REQ-399 · 410 · N10 · 기존 `10981:85015` `85017` `85016` · 쿠폰 계정 선택 `29062:117713` | 전/후 아래 |
| R-21 퀴즈 MO | [Module 4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29350-140312) · [Module 5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29350-140379) · [Quiz 4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29350-140446) · [Quiz 5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29350-140491) | 기존 mWeb 아티클·퀴즈 복제 → PC(DEX) 프레임의 제목·본문·KEY TAKEAWAYS·문항·보기 그대로 옮김(남는 7번째 절 숨김, 높이 보정). 상태 16종은 「못 한 것」 | REQ-443 ~ 448 · 기존 `19604:32020` `19604:32311` | 전/후 아래 |
| R-22 모듈 5 `rebate` | [Signed In, Module 5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130685) | 3곳 `rebate` → `cashback` | 용어 규칙 · REQ-444 | 전/후 아래 |
| R-23 하위 회원 연동 계정 모달 | [그룹 헤더판](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-312369)(원본 `28960:127188` 숨김) | `Centralised Exchanges` · `Decentralised Exchanges` 헤더(쿠폰 계정 선택 텍스트 복제) | REQ-427 · G-394 | 전/후 아래 |
| R-24 How it works | IF1 · IF3 | `whenever they trade` → `when your friends claim their cashback` | G-198 · REQ-433 | 전/후 아래 |
| R-25 초대 10 USDT 미만 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-139384) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-139635) | 금액 `9.99 USDT` · 카드 아래 경고 줄 `Invitation rewards are claimed automatically at 10 USDT. Just 0.01 USDT more to go.`(기존 파트너 허브 최소액 경고 줄 복제) | REQ-414 · D8 · 문구표 #57 · 기존 `5654:105991` | 전/후 아래 |
| R-26 EMAIL 31 연동 전 잔액 출금 실패 | [EN 630](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29349-139404) · KO 630 · EN 375 · KO 375 | 운영자 거절 메일 복제 · 사유 = 문구표 #80(EN·KO) | D-5-2 · G-426 · 기존 `29061:1106` 외 | 전/후 아래 |

![R-08 전 — 정산 지연](Figma수정결과_img/rewards_R08a_before.jpg) ![R-08 후](Figma수정결과_img/rewards_R08a_after.jpg)

![R-08 전 — 집계](Figma수정결과_img/rewards_R08b_before.jpg) ![R-08 후](Figma수정결과_img/rewards_R08b_after.jpg)

![R-08 전 — 보드 완성](Figma수정결과_img/rewards_R08c_before.jpg) ![R-08 후](Figma수정결과_img/rewards_R08c_after.jpg)

![R-09 전 — 시안 B 선택](Figma수정결과_img/rewards_R09a_before.jpg) ![R-09 후](Figma수정결과_img/rewards_R09a_after.jpg)

![R-09 전 — 시안 B 확인·재선택](Figma수정결과_img/rewards_R09b_before.jpg) ![R-09 후](Figma수정결과_img/rewards_R09b_after.jpg)

![R-10 전 — 기존 Bingo 사전공개 게스트](Figma수정결과_img/rewards_R10_before.jpg) ![R-10 후](Figma수정결과_img/rewards_R10_after.jpg)

![R-11 전 — 기존 warning 토스트](Figma수정결과_img/rewards_R11_before.jpg) ![R-11 후](Figma수정결과_img/rewards_R11_after.jpg)

![R-12 전 — 참여 가능](Figma수정결과_img/rewards_R12_before.jpg) ![R-12 후](Figma수정결과_img/rewards_R12_after.jpg)

![R-13 전 — 보드 완성](Figma수정결과_img/rewards_R13_before.jpg) ![R-13 후](Figma수정결과_img/rewards_R13_after.jpg)

![R-14 후 — PC](Figma수정결과_img/rewards_R14a_after.jpg)

![R-14 전 — 기존 MO](Figma수정결과_img/rewards_R14b_before.jpg) ![R-14 후 — MO](Figma수정결과_img/rewards_R14b_after.jpg)

![R-15 전](Figma수정결과_img/rewards_R15_before.jpg) ![R-15 후](Figma수정결과_img/rewards_R15_after.jpg)

![R-16 전 — 기존 MO 사용 불가](Figma수정결과_img/rewards_R16_before.jpg) ![R-16 후 — 연동 없음 MO](Figma수정결과_img/rewards_R16c_after.jpg) ![R-16 후 — 이미 사용 MO](Figma수정결과_img/rewards_R16d_after.jpg)

![R-16 후 — 연동 없음 PC](Figma수정결과_img/rewards_R16a_after.jpg) ![R-16 후 — 이미 사용 PC](Figma수정결과_img/rewards_R16b_after.jpg)

![R-17 전](Figma수정결과_img/rewards_R17_before.jpg) ![R-17 후](Figma수정결과_img/rewards_R17_after.jpg)

![R-18 전](Figma수정결과_img/rewards_R18_before.jpg) ![R-18 후](Figma수정결과_img/rewards_R18_after.jpg)

![R-19 전](Figma수정결과_img/rewards_R19_before.jpg) ![R-19 후](Figma수정결과_img/rewards_R19_after.jpg)

![R-20 전 — 수령 UID 선택](Figma수정결과_img/rewards_R20b_before.jpg) ![R-20 후](Figma수정결과_img/rewards_R20b_after.jpg)

![R-20 전 — UID Link Required](Figma수정결과_img/rewards_R20c_before.jpg) ![R-20 후](Figma수정결과_img/rewards_R20c_after.jpg)

![R-21 전 — 기존 mWeb Module 4](Figma수정결과_img/rewards_R21a_before.jpg) ![R-21 후 — DEX Module 4 MO](Figma수정결과_img/rewards_R21a_after.jpg)

![R-22 전](Figma수정결과_img/rewards_R22a_before.jpg) ![R-22 후](Figma수정결과_img/rewards_R22a_after.jpg)

![R-22 전 — KEY TAKEAWAYS](Figma수정결과_img/rewards_R22b_before.jpg) ![R-22 후](Figma수정결과_img/rewards_R22b_after.jpg)

![R-23 전](Figma수정결과_img/rewards_R23_before.jpg) ![R-23 후](Figma수정결과_img/rewards_R23_after.jpg)

![R-24 전](Figma수정결과_img/rewards_R24_before.jpg) ![R-24 후](Figma수정결과_img/rewards_R24_after.jpg)

![R-25 전 — 친구 초대 MO](Figma수정결과_img/rewards_R25_before.jpg) ![R-25 후](Figma수정결과_img/rewards_R25_after.jpg)

![R-26 전 — 운영자 거절](Figma수정결과_img/rewards_R26_before.jpg) ![R-26 후](Figma수정결과_img/rewards_R26_after.jpg)

## 우선 3

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| R-27 등수별 랭킹 리워드 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-192386) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-192447) | 시안 B modal1 복제 · `4st` ~ `9st place` → `4th` ~ `9th place` | 원본 F-010 · 현행 판 C5 · 기존 `28537:463082` `463143` | 전/후 아래 |
| R-28 결과 발표 · 제외 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-14754) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29064-15127) | 두 프레임 숨김 · 이름 끝 `= 결과 발표 · 참여자와 같음` | D-1-8 | 전만(숨김) |
| R-29 쿠폰 없음 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-140206) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-140457) | 기존 쿠폰 없음 복제 · 탭 배지 `0` | 결정 N8 · 기존 `11982:388195` `387214` | 전/후 아래 |
| R-30 이벤트 필터 0건 | [PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-140570) · [MO](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29335-140714) | 거래소 이벤트 복제 · 필터 값 `EdgeX` · 목록 숨기고 기존 빈 상태(`No Events Yet` / `We don't have any events at the moment. Stay tuned for upcoming rewards and offers!`) 삽입 | REQ-437 · 결정 D3(3탭 유지) · 기존 `11366:318672` `9733:148686` | 전/후 아래 |
| R-31 퀴즈 4 보기 문구 | [Login required](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28978-127406) · [Submit failed](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28978-127476) | `access the funds directly` → `withdraw straight from the blockchain` | REQ-445 | 전/후 아래 |
| R-32 TP FAQ | [TP PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29062-114041) | `USDT payback` → `USDT cashback`(`TP earned upon withdrawal`은 그대로) | 용어 규칙 · D2 | 전/후 아래 |
| R-33 리그 상금 수령 배경 GNB | [PC · 리그 상금 수령 완료](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29183-118342) | 팀 리더보드의 `DEX 회원 헤더` 인스턴스 복제(`29327:389512`)를 배경 위에 배치 · 옛 GNB 투명 처리 | 결정 A1 · D4 · `29185:121068` | 전/후 아래 |

![R-27 전](Figma수정결과_img/rewards_R27_before.jpg) ![R-27 후](Figma수정결과_img/rewards_R27_after.jpg)

![R-28 전(현재 숨김)](Figma수정결과_img/rewards_R28_before.jpg)

![R-29 전](Figma수정결과_img/rewards_R29_before.jpg) ![R-29 후](Figma수정결과_img/rewards_R29_after.jpg)

![R-30 전 — 거래소 이벤트](Figma수정결과_img/rewards_R30_before.jpg) ![R-30 후](Figma수정결과_img/rewards_R30_after.jpg)

![R-31 전](Figma수정결과_img/rewards_R31_before.jpg) ![R-31 후](Figma수정결과_img/rewards_R31_after.jpg)

![R-32 전](Figma수정결과_img/rewards_R32_before.jpg) ![R-32 후](Figma수정결과_img/rewards_R32_after.jpg)

![R-33 전](Figma수정결과_img/rewards_R33_before.jpg) ![R-33 후](Figma수정결과_img/rewards_R33_after.jpg)

## 결정으로 수정하지 않은 것

| 항목 | 결정 |
|---|---|
| 이벤트 3탭(`Special Events` · `Exclusive` · `Exchange Events`) | D3 — 3탭 유지 |
| Cashback Boost | N7 — 범위 밖 |
| 캐시백 챌린지 수령 완료 · 맥스보드 불러오기 실패(503) | 결정 6차 — 추가하지 않음 |
| 맥스보드 `PHASE_NOT_PARTICIPATION` · `CONCURRENT_REQUEST` | 결정 3차 #9 — 문구 없음(버튼 비활성·중복 클릭 방지) |
| 쿠폰 계정 1개 분기 · 쿠폰 404 · 429류 · 파트너 허브 403 · 초대 친구 0명 | Q9 · 결정 6차 · 3차 #10 · #11 · #12 — 현행 그대로 |
| Referral Details · Reward History · 출금 실적 `Withdraw` 문구 | N11 · D2 |
