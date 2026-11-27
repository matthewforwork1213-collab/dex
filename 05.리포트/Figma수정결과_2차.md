# Figma 수정 결과 — 2차 (인스턴스 분리 수정 · 미룬 항목 · 원본 없던 모바일 4건)

2026-11-27 · 대상 Figma `DEX(revision)` [28960:125519](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519) · 1차 결과 [content](Figma수정결과_content.md) · [balance](Figma수정결과_balance.md) · [rewards](Figma수정결과_rewards.md) · [link](Figma수정결과_link.md) · 결정 [_Figma수정_결정.md](_Figma수정_결정.md) · 문구 [문구표_DEX.md](문구표_DEX.md) · 캡처 [Figma수정결과_img/](Figma수정결과_img/) `r2_*.jpg`

## 요약

| 구분 | 수 | 항목 |
|---|---|---|
| 완료 | **24** | balance 7(PW1 `Total Claimed`·리뷰 버튼 · 허브 H5 `Total claimed` · H8 빈 띠 · 홈 누적 캐시백 · 모바일 지갑 상세 로고 · 리뷰 유도 · 요약 날짜) · content 13(CT-04 · 16 · 18 · 19 · 20 · G-441 혜택 줄 · 21 · 24 · 25 · 27 · 28 · 29 · 30) · 공통 GNB 교체 1 · 원본 없던 모바일 4(퀴즈 상태 16 · Cashback Basics · 혜택 상세 회원 CTA · 홈 첫 연동) |
| 일부 완료 | **1** | CT-33 — 이 회차는 문장만, 탭·DEX 로고는 [3차](Figma수정결과_3차.md)에서 반영 |
| 문구 대기 | **0** | CT-28 Step 2 본문 · CT-29 `Withdrawals & Account Management` 질문·답변은 [3차](Figma수정결과_3차.md)에서 채움 |
| 결정으로 제외 | **6** | 아래 「결정으로 제외」 |
| 새 프레임 | **31** | 아래 「새로 만든 프레임」 |
| 분리한 인스턴스 | 아래 「분리(detach)한 노드」 | 컴포넌트 메인 · 다른 페이지는 고치지 않음 |

### 작업 방식

- 사용자 결정(A): 기존 컴포넌트 안에 줄을 끼워 넣어야 하는 항목은 **DEX(revision) 해당 화면의 인스턴스만 분리**해서 고쳤다. 메인 컴포넌트와 다른 페이지 노드는 읽기·복제 원본으로만 썼다.
- 인스턴스 오버라이드로 되는 것(텍스트·표시·속성·인스턴스 교체)은 분리하지 않았다(예: 모바일 상세 계산기 CT-19, 상세 탭·FAQ 상태 CT-29·30).
- 새 줄·블록은 기존 노드를 복제했다(행 · 칩 · 버튼 · 블록). 새로 만든 것은 레이아웃용 투명 자동 레이아웃 틀(혜택 줄 묶음 · 모바일 내용 열)뿐이다.
- 정책 위반·대체 요소는 지우지 않고 숨겼다(`visible=false`): 옛 GNB 19곳, 모바일 상세 계산기 막대 12곳, 모바일 지갑 상세 Bitget 로고 이미지, 리뷰 0건 프레임의 요약·목록, 모바일 퀴즈 상태 프레임의 소개 본문.
- Figma MCP 호출 한도 때문에 일부 캡처는 `use_figma` 안의 노드 스크린샷으로 남겼다(같은 노드 · 같은 배율).

---

## 1. balance

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| PW1 `Total Claimed` 행 | [PW1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125943) — 분리본 29352:144467 | 금액 카드에 숨어 있던 기존 `Total Claimed` 행(29352:144492)을 켜고 `0.00 USDT` | REQ-281 · REQ-307 · UID 상세 웹 17023:56436 | `r2_PW1_before` / `r2_PW1_after` |
| PW1 리뷰 버튼 모양 | 같은 화면 | 버튼 인스턴스를 U3의 채움 버튼으로 교체(같은 Button 세트), `End Icon` 화살표 켬 · `Write a review, get 2 USDT` | REQ-278 · U3 25867:1349190 | 같은 캡처 |
| 허브 H5 `Total claimed` | [H5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29352-145077) · mH5 29352:145635 · mH5 다크 29352:146129 | `Claimable` 줄 아래에 같은 패널의 `Total event reward` 줄을 복제해 `Total claimed` · `0.00 USDT`. PC는 영수증 아래 톱니 장식을 영수증 끝으로 옮김 | REQ-300 · REQ-307 | 전 `balance_05-H5_after`(1차 후) / 후 `r2_H5_after` · `r2_mH5_after` · `r2_mH5d_after` |
| 허브 H8 빈 띠 | [H8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29354-139273) | 톱니 장식(`torn edge`)을 영수증 끝(y 700)으로 옮겨 빈 띠 제거. 모바일 H8은 자동 레이아웃이라 빈 띠 없음 | 1차 못 한 것 | 전 `balance_06-H8_after`(1차 후) / 후 `r2_H8_after` |
| 홈 누적 캐시백 블록 | [HW1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126108) — 분리본 29355:140941 | Linked Accounts 카드 아래에 MAXOP-731 누적 블록(22913:1054295)과 구분선 복제: `148.00 USDT` Total cumulative cashback · `148.00 USDT` This month · `0.00 USDT` Total withdrawn · `Sum of 4 linked accounts · Update times vary by exchange` · `View history` | 결정 N16(2차) · REQ-283 · REQ-290 · G-191 · 근거 22913:1052131 | `r2_HW1_before` / `r2_HW1_after` · 근거 `r2_ref_MAXOP731` |
| 모바일 지갑 상세 헤더 로고 | [Wallet detail / mWeb · Lighter](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-208223) | 원인: 헤더 로고가 Bitget 이미지 채움 원(29330:208231). 원은 숨기고 PW1의 `DEX / Mark`(Lighter) 인스턴스 복제(29355:141948) | REQ-276 · PW1 헤더 | `r2_mWD_before` / `r2_mWD_after` |
| 모바일 지갑 상세 리뷰 유도 | 같은 화면 | U3 mWeb의 `CMT-07 UID review prompt / mobile 343`(25867:1351184 안) 복제 → 금액 카드와 Earning Timeline 사이, `How was Lighter?` | REQ-278 · U3 mWeb 25867:1351184 | 같은 캡처 |
| 요약 날짜 형식 | 모바일 [캐시백 요약](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29065-6366) | 선택일 `2026/03/05 (Today)` → `2026/05/26 (Today)`(캘린더 May 2026과 같은 달), 필터 `All Cashback Types` → `All Types`, 유형 `Trading Cashback` → `Exchange Cashback` · `Withdrawal` → `Claim Amount`. PC CS1~CS5는 이미 `2026/05/26 (Today)` | REQ-378 · REQ-367 | `r2_mCS_before` / `r2_mCS_after`(선택일 줄은 시트 아래라 화면에 가려짐) |

![전](Figma수정결과_img/r2_PW1_before.jpg) ![후](Figma수정결과_img/r2_PW1_after.jpg)
![전 H5](Figma수정결과_img/balance_05-H5_after.jpg) ![후 H5](Figma수정결과_img/r2_H5_after.jpg)
![후 mH5](Figma수정결과_img/r2_mH5_after.jpg) ![후 mH5 다크](Figma수정결과_img/r2_mH5d_after.jpg)
![전 H8](Figma수정결과_img/balance_06-H8_after.jpg) ![후 H8](Figma수정결과_img/r2_H8_after.jpg)
![전](Figma수정결과_img/r2_HW1_before.jpg) ![후](Figma수정결과_img/r2_HW1_after.jpg) ![근거 MAXOP-731](Figma수정결과_img/r2_ref_MAXOP731.jpg)
![전](Figma수정결과_img/r2_mWD_before.jpg) ![후](Figma수정결과_img/r2_mWD_after.jpg)
![전](Figma수정결과_img/r2_mCS_before.jpg) ![후](Figma수정결과_img/r2_mCS_after.jpg)

---

## 2. content

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| CT-04 glance TVL · 24H Vol | PC [OA keys concept](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29361-136089) · 29361:136789 · 리스트 뷰 29361:138251 · 넘침 28960:125542 · 3곳 29361:137628 · 모바일 라이트 29363:135072 · 29363:136040 · 29363:136978 | glance 카드마다 같은 DEX venue 카드의 `stats` 복제 → `Final Taker`·`Final Maker` 칸 숨김, `TVL $770.86M` · `24H Vol $6.8M, −2%`. 모바일은 카드 폭(230)에 맞게 두 칸을 세로로 | REQ-322 · venue 카드 stats | `r2_CT04_before` / `r2_CT04_after` · 모바일 `r2_CT04m_before` / `r2_CT04m_after` |
| CT-16 모바일 기본 1열 카드 | 모바일 [기본](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29363-135072) · OB signed in 29363:136040 | 목록 행마다 PC venue 카드의 `stats`(TVL · 24H) · `actions`(`Learn More` · `Get Started`) 복제 | REQ-325 · PC venue 카드 | `r2_CT16_before` / `r2_CT16_after` |
| CT-16 모바일 리스트 뷰 | 모바일 [리스트 뷰](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29363-136978) | 행 머리에 PC 리스트 행의 별점 `4.0 (23)`, 행 아래 `View {DEX}` 버튼 복제 | REQ-326 · PC 리스트 28960:125536 | `r2_CT16list_after` |
| CT-18 `DEX` 칩 | PC 상세 6([D1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29357-143619) · D2 29357:144968 · D3 29357:146245 · EdgeX 28960:127454 · Aster 29357:147710 · ApeX 29357:148976) · 모바일 12(라이트 29360:141115 · 142096 · 143077 · 144056 · 145006 · 145980 / 다크 29360:146954 · 147933 · 148914 · 149893 · 150843 · 151817) | 거래소 이름 오른쪽에 CEX 상세 알약 칩(`<Chip>` Filled Light, 22442:219830 안) 복제 → 아이콘 끔 · `DEX` | REQ-337 · CEX 상세 22442:219830 | `r2_CT18_before` / `r2_CT18_after` · EdgeX `r2_CT18_edgex_*` · 모바일 `r2_CT18m_before` / `r2_CT18m_after` · 다크 `r2_CT18md_after` |
| G-441 상세 히어로 혜택 줄 | Lighter 상세 PC 3 · 모바일 6(라이트·다크) | `Perpetuals` 줄 아래에 히어로 설명 텍스트 스타일 4줄 `✓ Trade crypto, RWAs and pre IPO perps onchain` · `✓ Earn Lighter points while you trade` · `✓ Leverage up to 50x on selected markets` · `✓ 0% maker and taker fees on Standard accounts`(정책 예시 = 프로토타입 표시와 같음). 다른 DEX는 예시 문구가 없어 넣지 않음(빈 줄 미표시 규칙) | REQ-337 · G-441 · 정책 C-9(ELC 5) · 승인 Q10 #8 | 같은 캡처 |
| CT-19 ②③ 모바일 계산기 | 모바일 상세 12 | 막대·범례 블록(`Cashback`) 숨김 — 단계 카드 3장이 흐름도 역할(PC 가로 흐름도는 311 폭에서 깨져 쓰지 않음). 카드 1 `Your selected $400K volume on a Premium account generates an estimated $112 in taker fees.` · 카드 2 `Eligible trading activity generates a settlement for the referring partner.` · 고지 `Cashback comes from eligible exchange partner settlements. Final amounts vary by exchange, tier and trading activity.`(PC 원문). 인스턴스 오버라이드 | REQ-343 · REQ-344 · REQ-359 · PC D1 | `r2_CT19_before` / `r2_CT19_after` |
| CT-20 ① PC 게스트 안내 | PC 상세 6 | 정렬 탭 위에 모바일 `Reviews / Write gate panel`(State=Guest) 복제: `Log in or sign up to write a review` · `After signing up, link your {DEX} wallet address to post (anyone can read)` · `Sign up` | REQ-353 · REQ-362 · 모바일 28960:130990 안 | `r2_CT20_before` / `r2_CT20_after` |
| CT-21 리뷰 0건 | 새 PC [29367:137704](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29367-137704) · 모바일 [29369:136809](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29369-136809) | D3 복제 → 요약·히스토그램·AI 요약·태그·정렬·목록·페이지 숨김, CEX 빈 상태 블록(`State / empty` — `Be the first to review.`) 복제, 개수 `0` · 탭 `Reviews (0)`. 게스트 안내 블록 유지 | REQ-355(기존 CEX 빈 상태와 같게) · G-169 · 22442:219830 · 22956:84690 | `r2_CT21_after` · `r2_CT21m_new` |
| CT-24 /payback Trading profile · 계산 근거 펼침 | 새 [Trading profile PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29370-136469) · [펼침 모바일](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29370-136865) | [MAX-146] 6510:88401 복제 → 옛 GNB 숨기고 새 GNB(회원), 진행 막대 유지. 5123:32498 복제 → `x 30%` · `1.89 USDT`(EdgeX 결과 6.30 × 30%) | REQ-456 · REQ-458 · REQ-461 | `r2_CT24_new_profile` · `r2_CT24_new_calcexp` |
| CT-25 Exchange Listings | 새 [Exchange Listings / PC](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29370-138808) | CMT-08 컴포넌트(22799:96486) 인스턴스를 만들어 분리 → 옛 헤더 숨기고 새 GNB(게스트). `Rating` 열 · DEX 없음 그대로 | 결정 N2 · B3 · REQ-466 | `r2_CT25_new` |
| CT-27 앱 My Page Cashback 진입 | 새 [앱 My Page](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29370-140683) | mAPP My Page(10981:111021) 인스턴스 → 분리, `Account Security` 행을 복제해 그 묶음 첫 행 `Cashback Hub` | REQ-469 · G-214 · 문구표 #79 | `r2_CT27_new` |
| CT-28 단계 가이드 추가 상태 | 새 [Step 2 선택](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29386-137364) · [3단계](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29386-137485) | D2 복제. ① 레일 step 2 `State=Active`, step 1 `Done`, step 3 `Default`, 칩 `Step 2 of 5`, 제목 = 레일 라벨 `Deposit USDC into your wallet`, 본문 `Check the receiving network before sending. Sending funds on the wrong network can cause permanent loss.`(28981:129056 원문, 3차) ② step 4·5 숨김, 칩 `Step 3 of 3` | REQ-345 · REQ-346 · REQ-348 | `r2_CT28_step2` · `r2_CT28_3steps` |
| CT-29 ② FAQ 두 구역 동시 펼침 | 새 [29367:138679](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29367-138679) | D3 복제 → 6번째 `<Accordion>` `Expanded?=True`, 본문 슬롯을 `DEX / FAQ answer`(27610:193910)로 바꾸고 질문 `How do I receive my cashback?` · 답변 `Your cashback is credited to your TetherMax balance. Eligible balances of 10 USDT or more are paid automatically to your linked wallet.`(운영자 입력 예시, 3차) | REQ-350 · REQ-361 | `r2_CT29_before` / `r2_CT29_after` |
| CT-30 탭 바 고정 · Reviews 활성 | 새 [29367:139672](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29367-139672) | D3 복제 → 히어로~약관 숨겨 탭 바를 GNB 바로 아래로, `<Tab>` `Reviews (23)` Active · `Policy` 비활성 | REQ-341 | `r2_CT30_new` |
| CT-33 서비스 소개 · 프리로그인 모바일 | 새 [Service intro / mo](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29386-139409) · [Landing / mWeb](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29386-140103) | 19224:4458 · 20932:96981 복제. 서비스 소개 `Join an exchange with your TetherMax code and just enter your UID…` → PC 문장 `Join a partner through your TetherMax referral and link your exchange UID or DEX wallet address.` (`Our Partners` 탭 · DEX 로고는 3차) | REQ-287 · REQ-715 · G-424 · PC 28960:129521 | `r2_CT33_svc_m` |

![전](Figma수정결과_img/r2_CT04_before.jpg) ![후](Figma수정결과_img/r2_CT04_after.jpg)
![전 모바일](Figma수정결과_img/r2_CT04m_before.jpg) ![후 모바일](Figma수정결과_img/r2_CT04m_after.jpg)
![전](Figma수정결과_img/r2_CT16_before.jpg) ![후](Figma수정결과_img/r2_CT16_after.jpg) ![후 리스트](Figma수정결과_img/r2_CT16list_after.jpg)
![근거 CEX 칩](Figma수정결과_img/r2_ref_cexhero.jpg)
![전](Figma수정결과_img/r2_CT18_before.jpg) ![후](Figma수정결과_img/r2_CT18_after.jpg)
![전 EdgeX](Figma수정결과_img/r2_CT18_edgex_before.jpg) ![후 EdgeX](Figma수정결과_img/r2_CT18_edgex_after.jpg)
![전 모바일](Figma수정결과_img/r2_CT18m_before.jpg) ![후 모바일](Figma수정결과_img/r2_CT18m_after.jpg) ![후 다크](Figma수정결과_img/r2_CT18md_after.jpg)
![전](Figma수정결과_img/r2_CT19_before.jpg) ![후](Figma수정결과_img/r2_CT19_after.jpg)
![전](Figma수정결과_img/r2_CT20_before.jpg) ![후](Figma수정결과_img/r2_CT20_after.jpg)
![새 PC](Figma수정결과_img/r2_CT21_after.jpg) ![새 모바일](Figma수정결과_img/r2_CT21m_new.jpg)
![새 Trading profile](Figma수정결과_img/r2_CT24_new_profile.jpg) ![새 펼침](Figma수정결과_img/r2_CT24_new_calcexp.jpg)
![새](Figma수정결과_img/r2_CT25_new.jpg) ![새](Figma수정결과_img/r2_CT27_new.jpg)
![새 Step 2](Figma수정결과_img/r2_CT28_step2.jpg) ![새 3단계](Figma수정결과_img/r2_CT28_3steps.jpg)
![전](Figma수정결과_img/r2_CT29_before.jpg) ![후](Figma수정결과_img/r2_CT29_after.jpg)
![새](Figma수정결과_img/r2_CT30_new.jpg) ![새](Figma수정결과_img/r2_CT33_svc_m.jpg)

---

## 3. 공통 GNB — 다른 페이지에서 복제한 프레임

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거 | 전/후 캡처 |
|---|---|---|---|---|
| 옛 GNB → 새 GNB | 「사용자 기능 · PC와 모바일 원본 보완」 PC 19프레임: 쿠폰 계정 선택 29062:117713 · 이벤트 29062:112586 · 혜택 진행 중 29365:134382 · TP 29365:134702 · 쿠폰 이력 29365:135006 · 쿠폰 적용 29065:7079 · 쿠폰 계정 선택 CEX 29190:126026 · DEX 29190:126206 · 첫 캐시백 29327:399908 · 혜택 회원 29327:401035 · 완료 0건 29327:401970 · [UID 연동 상세 29327:403008](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-403008) · 쿠폰 연동 없음 29335:137823 · 이미 사용 29335:138649 · 쿠폰 없음 29335:140206 · 이벤트 0건 29335:140570 · 챌린지 진행 29335:142890 · 수령 계정 29335:143474 · 연동 필요 29335:144127 | 옛 `webPrelogin`(Exchanges · Events · Benefits · Cashback Preview · Point)을 숨기고 새 `DEX / Web / Navigation` 인스턴스(단독 Calculator 숨김 오버라이드 포함) 복제. 로그인 버튼이 있던 3곳은 게스트판(29327:414419), 나머지는 회원판(29352:144815) | 결정 A1 · D4 · REQ-464 | 전 `rewards_R19_after`(1차 후) / 후 `r2_GNB_after_uid` |

![전](Figma수정결과_img/rewards_R19_after.jpg) ![후](Figma수정결과_img/r2_GNB_after_uid.jpg)

---

## 4. 원본이 없던 모바일 4건 (사용자 결정: 가장 가까운 기존 컴포넌트로)

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거 노드 | 캡처 |
|---|---|---|---|---|
| 퀴즈 모바일 상태 16종 | 퀴즈 섹션 새 16: Quiz 4 — All answers correct [29378:136858](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29378-136858) · Login required 29378:136953 · No correct answers 29378:137046 · One correct answer 29378:137139 · Previously completed 29378:137234 · Scoring unavailable 29378:137324 · Submit failed 29378:137413 · Validation 29378:137506 / Quiz 5 — 29378:137680 · 137775 · 137868 · 137961 · 138056 · 138146 · 138235 · 138328 | 라이트 mWeb 원본이 없어(카탈로그·색인: 기존 mWeb 퀴즈 19604:32311 등은 1차에서 다크로 확인) DEX(revision) 라이트 모바일 퀴즈 프레임(29058:108346)을 복제해 상단 바·배경을 쓰고, 본문은 숨긴 뒤 PC 상태 프레임(28978:127308~128442)의 Breadcrumb · 제목 · `Quiz state`를 343 폭 세로 배치로 옮김(문구·상태 그대로) | 29058:108346 · PC 28978:127308~128442 | `r2_R21_m_validation` · `r2_R21_m_allcorrect` · `r2_R21_m_previously` |
| Cashback Basics 모바일 | 새 [29381:137153](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29381-137153) | 같은 틀(29058:108346) + PC Cashback Basics(29328:132677)의 아티클 열(본문 · 이미지 · KEY TAKEAWAYS)을 343 폭으로 | 29058:108346 · 29328:132677 | `r2_R06_m_basics` |
| 혜택 상세 회원 모바일 CTA | 새 [29381:137277](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29381-137277) | 게스트판 MO(29327:400148) 복제 → 하단 CTA 같은 Button 세트 `State=Disabled` · `Auto Claim`(PC와 같음) | 29327:400148 · 결정 N9 | `r2_R02_m_member` |
| 모바일 홈 「첫 연동」 | 새 [29381:137457](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29381-137457)(모바일 연동 결과 섹션, 성공 28969:127101 오른쪽) | 모바일 S4 홈(29330:208569) 복제 → 새로 연동한 Lighter 행을 맨 아래로 `0.00 USDT`, 총액 `28.00 USDT`, MAX-30 mWeb 토스트(9733:177641 안) 복제 `Account linked successfully` | REQ-094 · REQ-096 · 29330:208569 · 9733:177641 | `r2_L22_m_firstlink` |

![Validation](Figma수정결과_img/r2_R21_m_validation.jpg) ![All correct](Figma수정결과_img/r2_R21_m_allcorrect.jpg) ![Previously](Figma수정결과_img/r2_R21_m_previously.jpg)
![Basics](Figma수정결과_img/r2_R06_m_basics.jpg) ![회원 CTA](Figma수정결과_img/r2_R02_m_member.jpg) ![첫 연동](Figma수정결과_img/r2_L22_m_firstlink.jpg)

---

## 결정으로 제외 (8차 결정, 2026-11-27)

| 항목 | 결정 |
|---|---|
| 허브 H6 `DEX data pending` | 불러오기 실패·대기 상태는 만들지 않음. 요약 캘린더(CS1 25일)에만 있음 |
| CT-14 ③ 서비스 소개 파트너 캐러셀 실패 | 만들지 않음 |
| CT-28 ③ 영상 실패 | 만들지 않음 — 영상 자리는 영상이라는 것만 표시 |
| 홈 누적 캐시백 블록 — 모바일 홈 | 이번에 넣지 않음. PC HW1만 있음 |
| CT-04 · CT-16 모바일 다크 3프레임 | 다크 모드는 자동 변환 — 다크 프레임 별도 반영 안 함(라이트만) |
| CT-24 Landing | 기존 화면(PB-3 29194:120700)과 중복 — 만들지 않음 |

## 문구 대기

없음. 남은 확인 사항은 [3차 결과](Figma수정결과_3차.md) 「남은 것」.

## 새로 만든 프레임

| 노드 | 이름 | 섹션 |
|---|---|---|
| 29367:137704 | DEX / detail / D3 … · Reviews 0 | DEX — DEX detail Web |
| 29367:138679 | DEX / detail / D3 … · FAQ two sections open | 같음 |
| 29367:139672 | DEX / detail / D3 … · Tab bar pinned, Reviews active | 같음 |
| 29386:137364 | DEX / detail / D2 Step guide / light · Step 2 selected | 같음 |
| 29386:137485 | DEX / detail / D2 Step guide / light · 3 steps | 같음 |
| 29369:136809 | DEX / Mobile / detail / D3 … · Reviews 0 | DEX detail Mobile [Light] |
| 29370:136469 | 계산기 · Trading profile / PC (DEX) | 사용자 기능 · PC와 모바일 원본 보완 |
| 29370:136865 | 계산기 · 계산 근거 펼침 / 모바일 (DEX 결과) | 같음 |
| 29370:138808 | Exchange Listings / PC | 같음 |
| 29370:140683 | 앱 My Page · Cashback Hub 행 | 같음 |
| 29381:137277 | 혜택 · 첫 캐시백 상세 / 모바일 · 회원 | 같음 |
| 29378:136858 ~ 29378:138328 (16) | Mobile / Quiz 4·5 / {상태} / Light | Quiz Module page with Decentralised Trading |
| 29381:137153 | Mobile / Cashback Basics (Module 3) / Light | 같음 |
| 29381:137457 | Home / mWeb / S4 DEX · After first link (Lighter) | Mobile · Link Account / selector, form and all outcomes |
| 29386:139409 | Service intro / mo / Light (DEX) | DEX update · Landing + Service intro |
| 29386:140103 | Landing / mWeb / Light (DEX) | 같음 |

섹션 크기 조정: DEX detail Web(28960:127424) 폭 9600 · 퀴즈 섹션 · 모바일 연동 결과 섹션 · 사용자 기능 섹션 · 랜딩/서비스 소개 섹션은 새 프레임이 들어가도록 늘림.

## 분리(detach)한 노드 — DEX(revision) 안 인스턴스만

| 원래 노드 | 분리 후 | 이유 |
|---|---|---|
| PW1 안 페이지 인스턴스 28960:125944 | 29352:144467 | `Total Claimed` 행 · 버튼 |
| 허브 H5 28960:126908 · mH5 28960:130818 · 다크 28960:130894 | 29352:145077 · 29352:145635 · 29352:146129(+ 안쪽 hero/영수증 카드) | `Total claimed` 줄 |
| 허브 H8 28960:126926 | 29354:139273(+ hero 29354:139608) | 톱니 장식 위치 |
| HW1 안 home 28960:126109 · Linked Accounts | 29355:140941 · 29355:141285 | 누적 블록 |
| DEX 상세 PC D1 28960:127443 · D2 28960:127444 · D3 28960:127445 · Aster 28960:127627 · ApeX 28960:127633 (+ EdgeX 28960:127454 안쪽) | 29357:143619 · 29357:144968 · 29357:146245 · 29357:147710 · 29357:148976 | `DEX` 칩 · 혜택 줄 · 게스트 안내(리뷰 섹션 인스턴스 포함) |
| DEX 상세 모바일 12(28960:130990 · 130999 · 131005 · 131011 · 131017 · 131023 · 131033 · 131042 · 131048 · 131054 · 131060 · 131066) | 29360:141115 ~ 29360:151817 | `DEX` 칩 · 혜택 줄(계산기는 분리 전 오버라이드로) |
| 랜딩 PC 28960:125521 · 125522 · 125536 · 29330:193664 (+ 125542 안쪽) | 29361:136089 · 29361:136789 · 29361:138251 · 29361:137628 | glance 칸 |
| 랜딩 모바일 28960:130946 · 130952 · 130958 | 29363:135072 · 29363:136040 · 29363:136978 | glance 칸 · 목록 행 |
| 사용자 기능 섹션의 PC 인스턴스 프레임 29062:113000 · 29062:114041 · 29062:115768 | 29365:134382 · 29365:134702 · 29365:135006 | GNB 교체 |

## 개발 인계 메모(이번 수정으로 생긴 것)

- 상세 화면 · 허브 · 홈 · 랜딩 프레임 다수가 분리본이 됐다. 메인 컴포넌트에는 `DEX` 칩 · 혜택 줄 · `Total claimed` 줄 · glance 지표 칸 · 누적 블록이 **없다**. 메인을 고칠 때 이 문서의 분리본을 기준으로 옮긴다.
- 혜택 줄은 ELC `Bullet 1~4` 어드민 입력값이다. 화면의 4줄은 정책 예시(Lighter)이며, 비면 줄을 그리지 않는다.
- glance · 모바일 카드의 TVL · 24H 값은 venue 카드와 같은 표본이다(DefiLlama, 24시간 경과 시 숨김 — CT-15 프레임).
