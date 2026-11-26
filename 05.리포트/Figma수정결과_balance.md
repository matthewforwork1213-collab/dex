# Figma 수정 결과 — balance (잔액·홈·허브·지갑 상세·요약·랭킹)

2026-11-26 · 대상 [DEX(revision)](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125519) · 계획 [Figma수정계획_balance](Figma수정계획_balance.md) · 기준 [결정 기록](_Figma수정_결정.md) > [문구표](문구표_DEX.md) > 정책·요구사항정의서

수정한 섹션: 「DEX · 기존 홈 / 허브 / 지갑 상세의 잔액 표시」(28960:125772) · 「DEX — Cashback Hub Web」(28960:126880) · 「DEX — Cashback Hub Mobile」(28960:130790 · 28960:130866) · 「DEX — Cashback Summary Web」(28960:127124) · 「DEX — Cashback Ranking Web」(28960:127192) · 「DEX — Link stories on home」(28960:127750) 홈 프레임 · 개발 인계 색인 FU-036 · FU-044. 메인 컴포넌트와 다른 페이지 노드는 고치지 않았습니다(복제 원본으로만 사용).

## 요약

| 구분 | 수 | 내용 |
|---|---|---|
| 완료 | **51건** | 홈·지갑 상세·메모 23 · 허브 17 · 요약·랭킹 11 (표의 행 기준) |
| 새 프레임 | **31개** | 홈·지갑 상세 16 · 허브 9 · 요약·랭킹 6(필터·팝오버 표본 포함) — 각 절의 「새 프레임」 표와 맨 아래 목록 |
| 문구 대기 | **0건** | 문구표 확정본(2026-11-26)으로 모두 채움. 값 미정(G-425 · G-025 · G-036 · G-089) 해당 텍스트 없음 |
| 취소(결정) | 3건 | #1 · #2 · #3 출금 화면 — 결정 Q1(G-448)로 출금 화면 삭제. 대신 #4 메모·색인 정리 |
| 못 한 것 | 12건 | 아래 표 |

### 못 한 것

| 항목 | 이유 |
|---|---|
| #12 모바일 지갑 상세 — 헤더 로고 | 헤더가 기존 mWeb 상세의 중첩 인스턴스라 로고 인스턴스를 Lighter 마크로 바꿨는데도 다른 레이어의 Bitget 로고가 화면에 보임. 헤더 인스턴스 구조 확인 필요 |
| #12 모바일 지갑 상세 — 리뷰 유도 블록 | U3 mWeb(25867:1351184) 블록 복제 미완(호출 한도) |
| #13 · #16 ① `Total claimed` 행(PW1 · 허브 H5) | PW1·허브 패널이 인스턴스라 행을 새로 넣을 수 없음. 메인 컴포넌트(다른 페이지)에 행을 추가해야 함 |
| #13 리뷰 버튼 모양 | 문구는 `Write a review, get 2 USDT`로 바꿨으나 U3 채움 버튼(화살표)으로 인스턴스 교체는 하지 않음 |
| #25 홈 누적 캐시백 블록 | HW1 홈이 인스턴스라 블록을 넣으려면 인스턴스를 분리해야 함 — 기존 프레임 구조 변경이라 보류. 모바일 홈(#11)에도 미적용 |
| #26 허브 H6 `DEX data pending` | 허브 패널에 날짜 칸이 없어 라벨 자리가 없음(지갑 상세 칸은 승인 조정으로 제외) |
| H8 패널 빈 띠 | `Reported next day` 행을 숨긴 뒤 카드 아래 빈 띠가 남음(카드 높이가 메인 구조로 고정) |
| #20 요약 날짜 형식 | REQ-378이 선택일 표기를 `2026/05/26 (Today)`로 명시해 계획 형식(`2026.05.26`)과 다름 — 기존 값 유지, 확인 필요 |
| #22 · #31 모바일 요약, #23 · #30 · #40 모바일 랭킹 부분 | 대상 프레임(29065:6366 · 29065:6980)이 「사용자 기능 · PC와 모바일 원본 보완」 섹션 — balance 지정 섹션 밖 |
| #19 · #27(피드 열) · #28 · #38 · #39 · 추가-5 | 랜딩·서비스 소개 섹션(「DEX update · Landing + Service intro」) — balance 지정 섹션 밖 |
| 추가-1 CEX UID 상세 | 지정 섹션에 대상 프레임 없음 |
| 기존 출금 흐름 프레임(DW1~DW6 · PW2~PW8 · HW2 · HW3 · PS · PE · BW · SW) | 계획 범위 밖이라 그대로 둠. 결정 Q1(출금 화면 삭제)·B6(확인 다이얼로그 없음)과 맞지 않는 화면이므로 숨김 여부 확인 필요 |

---

## 1. 홈 · 지갑 상세 · 메모 (섹션 28960:125772 · 28960:127750 · 개발 인계)

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거(결정·REQ·기존 노드) | 전/후 캡처 |
|---|---|---|---|---|
| #4 메모 | [정책 변경 메모](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28987-126383) | 제목 `출금 화면 없음 · 기존 잔액 영역`, 본문 「출금 화면(/withdrawal-apply · /withdrawal)은 두지 않습니다(G-448). 출금 버튼은 모두 비활성 Auto Claim이며 눌러도 아무것도 열리지 않습니다. 정상·미달·지연·일부 장애·전체 오류는 기존 홈·허브·지갑 상세의 상태로 확인합니다.」 | 결정 Q1 · Q2 · REQ-270 | [전](Figma수정결과_img/balance_04-memo_before.jpg) · [후](Figma수정결과_img/balance_04-memo_after.jpg) |
| #4 FU-036 | [FU-036](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-888) | 제목 `FU-036  출금 화면 없음 (/withdrawal-apply · /withdrawal)`, 본문 「출금 화면은 두지 않음(G-448). 출금 버튼은 비활성 Auto Claim. 잔액·상태는 기존 홈·허브·지갑 상세에서 확인.」(링크 줄 유지) | 결정 Q1 · 문구표 #83 | [전](Figma수정결과_img/balance_04-FU036_before.jpg) · [후](Figma수정결과_img/balance_04-FU036_after.jpg) |
| #24 FU-044 | [FU-044](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29066-912) | 「회원 답변 = 문구표 #13(Go to Cashback Summary, then select your exchange, account, and cashback type to view your cashback history by date.) · 게스트 답변 삭제」 | 문구표 #13 · REQ-711 · S-11 | [전](Figma수정결과_img/balance_24-FU044_before.jpg) · [후](Figma수정결과_img/balance_24-FU044_after.jpg) |
| See All 모달 🆕 | [HW1 · See All modal](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-382890) | HW1 복제 + HW2 Backdrop 복제 + 기존 연동 계정 목록 모달(9401:160223) 복제. `Linked UIDs` → `Linked Accounts` · 배지 `4` · `4 Total` · 랭킹의 `All`/`CEX`/`DEX` 칩(29192:123060) 복제 · 거래소별 묶음 4개(Bitget UID 685432171 14.00 · Lighter Wallet 0x7a3f…51e9 120.00 · ApeX Wallet 0x91c4…a07b 14.00 · Aster Wallet 0x5e0d…c2f4 0.00, 로고는 홈 행 인스턴스 복제) · `Close`. 여러 계정 묶음 패턴은 `2 accounts` · `10 accounts`로 바꿔 숨김 보관 | 결정 Q3 · 6차(칩) · REQ-271 · 9401:160223 | [전(원본)](Figma수정결과_img/balance_SA-ref9401_before.jpg) · [후](Figma수정결과_img/balance_SA-HW1seeall_after.jpg) |
| #10 ① 홈 행 칩 | [HW1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126108) | Aster 행 자리표시 `Chip` → `No cashback yet`, 금액 `3.20` → `0.00`, 총액 `151.20` → `148.00 USDT`(행 합). 제목 `Linked Accounts` 유지 | REQ-273 · 문구표 #9 · REQ-268 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_10-HW1_after.jpg) |
| #9 총액 로딩 🆕 | [HW1 · Balance loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-409544) | 총액·버튼 자리를 S7 `<Skeleton>`으로(금액 미렌더) | REQ-269 · S7 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_09-loading_after.jpg) |
| #9 총액 실패 🆕 | [HW1 · Balance error](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-410386) | 총액 숨김(0 표시 없음) + S9 `<Alert>` `We can't load your balance right now.` + `Try again` | REQ-269 · 문구표 #48 · S9 22442:219848 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_09-error_after.jpg) |
| #9 원장 지연 🆕 | [HW1 · Balance delayed](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-411242) | 총액 아래 `Last updated 2026.05.12 14:35` · Lighter 행 `Data delayed` 칩 + 자기 갱신 시각 `Last updated 2026.05.11 09:00` | REQ-269 · REQ-274 · 문구표 #10 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_09-delayed_after.jpg) |
| #10 ② 행 상태 🆕 | [HW1 · Linked Accounts States](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-142352) | 정책 우선순위 정렬: ApeX `Trying to link`(금액 `-`, 총액 제외) → Lighter `Data delayed` + `Last updated …` → EdgeX `Inactive` + `No longer supported. Cashback already earned is still sent to this wallet automatically.` → Aster `No cashback yet` 0.00 → Bitget 정상. 총액 `136.40 USDT` | REQ-098 · REQ-272~274 · REQ-121 · 문구표 #1 · #8~#11 · 결정 Q4 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_10-states_after.jpg) |
| #10 ③ 행 로딩 🆕 | [HW1 · Linked Accounts Loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-143413) | 행 자리 S7 스켈레톤 행 4개 | REQ-271 · S7 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_10-loading_after.jpg) |
| #10 ④ 10개 초과 🆕 | [HW1 · Linked Accounts More than 10](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29328-144444) | 행 10개(CEX 2 · Lighter 3 · ApeX 2 · EdgeX 2 · Aster 1) + `Show More`, 총액 `205.05 USDT`(11번째 계정 5.00 포함) | REQ-271 · 문구표 #14 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_10-more10_after.jpg) |
| #7 홈 선차감 🆕 | [HW1 · Pre-deducted](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29329-132465) | Lighter 120.00 → 0.00, 총액 `28.00 USDT`, 카드 아래 `Amounts being claimed are excluded from your balance until the result is confirmed.` 버튼은 비활성 `Auto Claim`, 토스트 없음 | 정책 6장 · REQ-158 · G-112 · 문구표 #37 · 결정 B6 | [전](Figma수정결과_img/balance_10-HW1_before.jpg) · [후](Figma수정결과_img/balance_07-HW1pre_after.jpg) |
| #13 · #20 · 결정 지갑 상세 | [PW1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-125943) | 리뷰 버튼 `Label` → `Write a review, get 2 USDT` · `Weekly Cashback History` 블록 숨김 · `Top Partner DEXs` → `Top Partner Exchanges` · 타임라인 `Mar 17 00:00` 등 → `2026.03.17 00:00` 형식 | REQ-278 · 결정 「지갑 상세 하단」 · REQ-043 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_13-PW1_after.jpg) |
| #15 지갑 상세 부족분 | [지갑 상세 · 이벤트 리워드 매칭 상태](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29026-97581) | 카드 6장의 `Additional exchange cashback needed: {n} USDT` → `You can claim cashback if you receive an additional {n} USDT in exchange Cashback.`(n = 10.00 · 7.00 · 5.00 · 3.00 · 1.00 · 0.01, 매칭 계산값 그대로) | REQ-130 · G-139 · 문구표 #34 | [전](Figma수정결과_img/balance_15-WD_before.jpg) · [후](Figma수정결과_img/balance_15-WD_after.jpg) |
| #7 지갑 선차감 🆕 | [PW1 · Pre-deducted](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-197859) | `Available Cashback 0.00` · 거래소·리워드 0.00 · `Claimable 0.00 USDT` + 선차감 캡션(문구표 #37) | 정책 6장 · 문구표 #37 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_07-PW1pre_after.jpg) |
| #14 지연 🆕 | [PW1 · Delayed](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-199016) | 금액 카드 아래 `Last updated 2026.05.11 09:00` | REQ-277 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_14-delayed_after.jpg) |
| #14 로딩 🆕 | [PW1 · Loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-200173) | 금액 카드 → S7 스켈레톤(띠 없음) | REQ-145 · 승인 조정 #14 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_14-loading_after.jpg) |
| #14 조회 실패 🆕 | [PW1 · Error](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-201351) | 금액 카드 → S9 `We can't load your balance right now.` + `Try again`(0 표시 없음) | REQ-149 · 문구표 #48 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_14-error_after.jpg) |
| #14 리뷰 작성 후 🆕 | [PW1 · Reviewed](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-202522) | 리뷰 유도 배너 숨김 | REQ-278 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_14-reviewed_after.jpg) |
| #40 복사 토스트 🆕 | [PW1 · Copied](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-203678) | 기존 mWeb `UID Copied` 토스트(8582:167801) 복제 → `Copied.` | REQ-276 · 문구표 #15 | [전](Figma수정결과_img/balance_13-PW1_before.jpg) · [후](Figma수정결과_img/balance_40-copied_after.jpg) |
| #12 모바일 지갑 상세 🆕 | [Wallet detail / mWeb · Lighter](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-208223) | 기존 mWeb UID 상세(8582:167558) 복제: `Lighter` · `0x7a3f…51e9`(Wallet 라벨 없음) · `Total Claimed 0.00 USDT` · 진행 줄 `Matched 7.00 / 100.00 USDT in event rewards` / `Claimable 14.00 USDT · Minimum 10 USDT` · 타임라인 날짜 형식 · `Withdraw` → 비활성 `Auto Claim`(State=Disabled) · `View Cashback Summary` 숨김 · 토스트 숨김 · 하단 `Top Partner Exchanges` 유지 | REQ-276~281 · N16·N17·N19 · 승인 조정 #12 | [전(원본)](Figma수정결과_img/balance_12-ref8582_before.jpg) · [후](Figma수정결과_img/balance_12-mweb_after.jpg) |
| #11 모바일 홈 🆕 | [Home / mWeb / S4 DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29330-208569) | 기존 S4 mWeb 홈(4060:25384) 복제: `Linked UID` → `Linked Accounts` · 행 Bitget `UID 685432171` 14.00 + Lighter `0x7a3f…51e9` 120.00 + ApeX `0x91c4…a07b` 14.00(DEX 마크, Wallet 라벨 없음) · 총액 `148.00 USDT` · `Withdraw` → 비활성 `Auto Claim` · 푸터 `Trading on multiple exchanges? Link more` | REQ-013 · REQ-271 · N5 | 원본 4060:25384 · [후](Figma수정결과_img/balance_11-mhome_after.jpg) |
| #29 · #30 홈 스토리 | [S3-1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127759) · [S3-7](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127795) · [S4-1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127837) · [S4-6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127867) | S3-1 `0 USDT` → `0.00 USDT` · 총액 `5,137.70` → 행 합(S3-7 `0.00` · S4-1 `148.00` · S4-6 `148.00 USDT`). 홈 제목은 이미 `Linked Accounts` | REQ-021 · REQ-023 · REQ-268 | [전 S3-1](Figma수정결과_img/balance_29-S3-1_before.jpg) · [후 S3-1](Figma수정결과_img/balance_29-S3-1_after.jpg) · [전 S4-1](Figma수정결과_img/balance_29-S4-1_before.jpg) · [후 S4-1](Figma수정결과_img/balance_29-S4-1_after.jpg) |

![전](Figma수정결과_img/balance_04-memo_before.jpg) ![후](Figma수정결과_img/balance_04-memo_after.jpg)
![전](Figma수정결과_img/balance_04-FU036_before.jpg) ![후](Figma수정결과_img/balance_04-FU036_after.jpg)
![전](Figma수정결과_img/balance_24-FU044_before.jpg) ![후](Figma수정결과_img/balance_24-FU044_after.jpg)
![전](Figma수정결과_img/balance_SA-ref9401_before.jpg) ![후](Figma수정결과_img/balance_SA-HW1seeall_after.jpg)
![전](Figma수정결과_img/balance_10-HW1_before.jpg) ![후](Figma수정결과_img/balance_10-HW1_after.jpg)
![후 로딩](Figma수정결과_img/balance_09-loading_after.jpg) ![후 실패](Figma수정결과_img/balance_09-error_after.jpg) ![후 지연](Figma수정결과_img/balance_09-delayed_after.jpg)
![후 상태](Figma수정결과_img/balance_10-states_after.jpg) ![후 로딩](Figma수정결과_img/balance_10-loading_after.jpg) ![후 10개 초과](Figma수정결과_img/balance_10-more10_after.jpg)
![후 홈 선차감](Figma수정결과_img/balance_07-HW1pre_after.jpg)
![전](Figma수정결과_img/balance_13-PW1_before.jpg) ![후](Figma수정결과_img/balance_13-PW1_after.jpg)
![전](Figma수정결과_img/balance_15-WD_before.jpg) ![후](Figma수정결과_img/balance_15-WD_after.jpg)
![후 선차감](Figma수정결과_img/balance_07-PW1pre_after.jpg) ![후 지연](Figma수정결과_img/balance_14-delayed_after.jpg) ![후 로딩](Figma수정결과_img/balance_14-loading_after.jpg)
![후 실패](Figma수정결과_img/balance_14-error_after.jpg) ![후 리뷰 후](Figma수정결과_img/balance_14-reviewed_after.jpg) ![후 복사](Figma수정결과_img/balance_40-copied_after.jpg)
![전](Figma수정결과_img/balance_12-ref8582_before.jpg) ![후](Figma수정결과_img/balance_12-mweb_after.jpg) ![후 모바일 홈](Figma수정결과_img/balance_11-mhome_after.jpg)
![전](Figma수정결과_img/balance_29-S3-1_before.jpg) ![후](Figma수정결과_img/balance_29-S3-1_after.jpg)
![전](Figma수정결과_img/balance_29-S4-1_before.jpg) ![후](Figma수정결과_img/balance_29-S4-1_after.jpg)

---

## 2. 캐시백 허브 (Web 28960:126880 · Mobile 28960:130790 · 28960:130866)

허브 프레임은 모두 인스턴스(메인 `DEX / Web / Hub H1 … (main)` 27610:202719)라 메인은 고치지 않고 인스턴스 오버라이드(텍스트·visible·크기)로만 바꿨다. 라이트를 고친 내용은 같은 이름의 모바일 다크 사본(28960:130866 섹션)에도 같이 넣었다. 새 프레임은 섹션 폭을 넓혀 기존 열 오른쪽(Web x 19080~, Mobile x 6300~)에 두고, 같은 섹션의 SCREEN-LABEL을 복제해 라벨을 달았다.

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거 | 전/후 캡처 |
|---|---|---|---|---|
| #5 Lighter 주중 추정치 삭제 | [H5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126908) · [mH5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130818) · [mH5 다크](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130894) | `Accruing this week (estimate)` 행의 캡션 `Lighter settles weekly. Not in the totals above.`과 금액 `3.20 USDT` 숨김. 행 자리는 #16의 `Claimable` 줄로 씀 | G-428 · 문구표 #40(표시 없음) · REQ-303 제외 | [전](Figma수정결과_img/balance_05-H5_before.jpg) · [후](Figma수정결과_img/balance_05-H5_after.jpg) |
| #16 ① DEX 패널 줄 구성 | H5 · mH5 · mH5 다크(위와 같음) | `Event Reward` → `Total event reward` · 줄 `Claimable 125.00 USDT` 추가(매칭 후 = 120 + MIN(5, 120)) · 각주 `Payout destination: linked Lighter wallet.` → `Cashback is sent automatically to your linked Lighter wallet.` | REQ-300 · 문구표 #31 · #32 | 위 #5 캡처와 같음 |
| #6 EdgeX 패널 | [H8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126926) · [mH8](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130836) · [mH8 다크](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130912) | 머리 라벨 `Paid to your TetherMax balance` → `Total available cashback`(H5와 같은 정의, 3.10) · 캡션 `Paid records, reported by EdgeX` → `Reported by EdgeX` · `Reported next day 1.25 USDT` 행 숨김 · 각주 → `Cashback is sent automatically to your linked EdgeX wallet.` | REQ-300 · G-059 · 문구표 #32 | [전](Figma수정결과_img/balance_06-H8_before.jpg) · [후](Figma수정결과_img/balance_06-H8_after.jpg) |
| #15 허브 부족분 넛지·각주 | [H4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126902) · [mH4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130812) · [mH4 다크](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130888) | `Just 3.00 USDT more to qualify.` → `You can claim cashback if you receive an additional 3.00 USDT in exchange Cashback.`(줄바꿈 폭 지정, `Minimum 10 USDT` 유지) · 각주 `Minimum per account: 10 USDT.` → `Cashback is claimed automatically once your claimable amount reaches 10 USDT.` | REQ-130 · REQ-301 · 문구표 #34 · #33 | [전](Figma수정결과_img/balance_15-H4_before.jpg) · [후](Figma수정결과_img/balance_15-H4_after.jpg) · 모바일 [전](Figma수정결과_img/balance_15-mH4_before.jpg) · [후](Figma수정결과_img/balance_15-mH4_after.jpg) |
| #30(문구표) CEX 리워드 캡션 | H3 · H4 · mH3 · mH4(라이트·다크) | `Events and invites` → `From events. Invitation rewards are separate.` | G-140 · 문구표 #30 | H4 캡처와 같음 |
| #17 계산기 절삭 | H1 · H2 · H1-CEX · mH1 · mH2 · mH1-CEX(라이트·다크) | `Per day $0.19` → `$0.18`, `Per day $0.83` → `$0.82` | REQ-317 · REQ-042 | [전](Figma수정결과_img/balance_17-H1_before.jpg) · [후](Figma수정결과_img/balance_17-H1_after.jpg) · CEX [전](Figma수정결과_img/balance_17-H1C_before.jpg) · [후](Figma수정결과_img/balance_17-H1C_after.jpg) |
| #27 라우트 행 · Brokers 비교표 | 허브 Web 12 · Mobile 24 프레임 전부 · [H1-Broker](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126950) · [mH1-Broker](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130860) · [다크](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130936) | 라우트 행 `Automatic payouts from 10 USDT` → `Claimed automatically from 10 USDT`(CEX·DEX 행) · `Compare rebates across 2 brokers` → `Compare cashback across 2 brokers` | REQ-309 · REQ-312 · G-418 · 문구표 #38 · #39 | [전](Figma수정결과_img/balance_27-H1B_before.jpg) · [후](Figma수정결과_img/balance_27-H1B_after.jpg) · 모바일 [전](Figma수정결과_img/balance_27-mH1B_before.jpg) · [후](Figma수정결과_img/balance_27-mH1B_after.jpg) |
| #20 시각 형식 | [H6](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126914) · mH6(라이트·다크) | `Last updated 14 Oct 2026, 09:12` → `Last updated 2026.10.14, 09:12` | REQ-043 · REQ-301(`{date}, {time}`) | [전](Figma수정결과_img/balance_20-H6_before.jpg) · [후](Figma수정결과_img/balance_20-H6_after.jpg) |
| #35 모바일 허브 값 | [mH1-CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130854)(라이트·다크) · [mH3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-130806) · mH4 · mH7 · mH1-CEX(라이트·다크) | 슬라이더 `$1K`~`$250K` → `$10K`~`$500K` · `Compare cashback across 23 partners` → `Compare cashback across 16 exchanges` | REQ-294 · REQ-312 · Web H1-CEX · H3 | [전](Figma수정결과_img/balance_35-mH1C_before.jpg) · [후](Figma수정결과_img/balance_35-mH1C_after.jpg) · mH3 [전](Figma수정결과_img/balance_35-mH3_before.jpg) · [후](Figma수정결과_img/balance_35-mH3_after.jpg) |
| #36 H2 로그인 줄 | [H2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-126890) · mH2(라이트·다크) | `Paid to your TetherMax balance` → `Paid to your TetherMax balance    Minimum 10 USDT` | REQ-292 | [전](Figma수정결과_img/balance_36-H2_before.jpg) · [후](Figma수정결과_img/balance_36-H2_after.jpg) |
| #16 ② 새 프레임 | [H4-DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-390594) | H5 복제(DEX 탭): 7.00 / 5.00 / 2.00, `Claimable` 줄 → 넛지 `You can claim cashback if you receive an additional 3.00 USDT in exchange Cashback.`, 각주 문구표 #33 | REQ-301 · REQ-130 · H4 구성 · 문구표 #33 · #34 | [전(H4)](Figma수정결과_img/balance_15-H4_before.jpg) · [후](Figma수정결과_img/balance_16-H4DEX_after.jpg) |
| #16 ③ 새 프레임 | [H5-Partial](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-391315) | H5 복제: 거래소 3.00 · 리워드 8.00 · 머리 6.00 · `Claimable 6.00 USDT` + 캡션 `Only part of this balance can be claimed.` | REQ-300 · 매칭 `A + MIN(B, A)` · 문구표 #35 | [전(H5)](Figma수정결과_img/balance_05-H5_before.jpg) · [후](Figma수정결과_img/balance_16-H5Partial_after.jpg) |
| #16 ④ 새 프레임 | [H5-Loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-397356) | H5 복제 + 금액 4곳(머리·거래소·리워드·Claimable) 숨기고 S7 `<Skeleton>`(22442:219836 안) 복제 배치, 0 표시 없음 | REQ-301 · S7 | [전(H5)](Figma수정결과_img/balance_05-H5_before.jpg) · [후](Figma수정결과_img/balance_16-H5Loading_after.jpg) |
| #37 새 프레임 | [H5-Aster](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-392036) | H5 복제: 파트너 `Aster`(마크 Venue=Aster) · 캡션 `Reported by Aster, USDT value at payout` · 각주 `… linked Aster wallet.` | REQ-300 · 문구표 #32 | [전(H5)](Figma수정결과_img/balance_05-H5_before.jpg) · [후](Figma수정결과_img/balance_37-H5Aster_after.jpg) |
| #7 허브 선차감 새 프레임 | [H5-Pre-deducted](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-392758) | H5 복제: 머리·거래소·`Claimable` 0.00, 리워드 행 숨김(매칭분 소진), 캡션 `Amounts being claimed are excluded from your balance until the result is confirmed.` 버튼은 비활성 `Auto Claim` 그대로, 팝업·토스트 없음 | 정책 6장 · REQ-158 · G-112 · 문구표 #37 · 결정 B6 | [전(H5)](Figma수정결과_img/balance_05-H5_before.jpg) · [후](Figma수정결과_img/balance_07-H5Prededucted_after.jpg) |
| #17 새 프레임 | [H1-Rate error](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-398082) · [mH1-Rate error](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-412884) | H1 복제: 결과 금액 → `Estimate unavailable`, 요율 의존 금액(`$28.00` · `−$5.60` · `$22.40`)·Per day/Per year 숨김, S9 `Try again` 버튼(22442:219848 안) 복제 배치 | REQ-296 · G-144 · 문구표 #50 · S9 | [전(H1)](Figma수정결과_img/balance_17-H1_before.jpg) · [후](Figma수정결과_img/balance_17-H1RateError_after.jpg) · 모바일 [전](Figma수정결과_img/balance_17-mH1_before.jpg) · [후](Figma수정결과_img/balance_17-mH1RateError_after.jpg) |
| #18 새 프레임 | [H1-No results](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-398826) · [mH1-No results](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-413500) | H1 복제: 검색창에 입력값(`Hyperliquid`), 표(모바일 카드 목록) 숨김, MAX-30 빈 검색 줄(9287:166523) 복제 → `No results found for Hyperliquid` | N13 · G-151 · MAX-30 9105:194510 계열 | [전(H1)](Figma수정결과_img/balance_17-H1_before.jpg) · [후](Figma수정결과_img/balance_18-H1NoResults_after.jpg) · 모바일 [후](Figma수정결과_img/balance_18-mH1NoResults_after.jpg) |

![전](Figma수정결과_img/balance_05-H5_before.jpg) ![후](Figma수정결과_img/balance_05-H5_after.jpg)
![전](Figma수정결과_img/balance_05-mH5_before.jpg) ![후](Figma수정결과_img/balance_05-mH5_after.jpg)
![전](Figma수정결과_img/balance_05-mH5d_before.jpg) ![후](Figma수정결과_img/balance_05-mH5d_after.jpg)
![전](Figma수정결과_img/balance_06-H8_before.jpg) ![후](Figma수정결과_img/balance_06-H8_after.jpg)
![전](Figma수정결과_img/balance_06-mH8_before.jpg) ![후](Figma수정결과_img/balance_06-mH8_after.jpg)
![전](Figma수정결과_img/balance_15-H4_before.jpg) ![후](Figma수정결과_img/balance_15-H4_after.jpg)
![전](Figma수정결과_img/balance_15-mH4_before.jpg) ![후](Figma수정결과_img/balance_15-mH4_after.jpg)
![전](Figma수정결과_img/balance_17-H1_before.jpg) ![후](Figma수정결과_img/balance_17-H1_after.jpg)
![전](Figma수정결과_img/balance_17-H1C_before.jpg) ![후](Figma수정결과_img/balance_17-H1C_after.jpg)
![전](Figma수정결과_img/balance_17-mH1_before.jpg) ![후](Figma수정결과_img/balance_17-mH1_after.jpg)
![전](Figma수정결과_img/balance_27-H1B_before.jpg) ![후](Figma수정결과_img/balance_27-H1B_after.jpg)
![전](Figma수정결과_img/balance_27-mH1B_before.jpg) ![후](Figma수정결과_img/balance_27-mH1B_after.jpg)
![전](Figma수정결과_img/balance_20-H6_before.jpg) ![후](Figma수정결과_img/balance_20-H6_after.jpg)
![전](Figma수정결과_img/balance_35-mH1C_before.jpg) ![후](Figma수정결과_img/balance_35-mH1C_after.jpg)
![전](Figma수정결과_img/balance_35-mH3_before.jpg) ![후](Figma수정결과_img/balance_35-mH3_after.jpg)
![전](Figma수정결과_img/balance_36-H2_before.jpg) ![후](Figma수정결과_img/balance_36-H2_after.jpg)
![전](Figma수정결과_img/balance_15-H4_before.jpg) ![후](Figma수정결과_img/balance_16-H4DEX_after.jpg)
![전](Figma수정결과_img/balance_05-H5_before.jpg) ![후](Figma수정결과_img/balance_16-H5Partial_after.jpg)
![전](Figma수정결과_img/balance_05-H5_before.jpg) ![후](Figma수정결과_img/balance_16-H5Loading_after.jpg)
![전](Figma수정결과_img/balance_05-H5_before.jpg) ![후](Figma수정결과_img/balance_37-H5Aster_after.jpg)
![전](Figma수정결과_img/balance_05-H5_before.jpg) ![후](Figma수정결과_img/balance_07-H5Prededucted_after.jpg)
![전](Figma수정결과_img/balance_17-H1_before.jpg) ![후](Figma수정결과_img/balance_17-H1RateError_after.jpg)
![전](Figma수정결과_img/balance_17-H1_before.jpg) ![후](Figma수정결과_img/balance_18-H1NoResults_after.jpg)
![전](Figma수정결과_img/balance_17-mH1_before.jpg) ![후](Figma수정결과_img/balance_17-mH1RateError_after.jpg)
![전](Figma수정결과_img/balance_17-mH1_before.jpg) ![후](Figma수정결과_img/balance_18-mH1NoResults_after.jpg)

### 2. 문구 대기
- 없음. 문구표 확정본(#30~#39 · #50)으로 모두 채웠고, 레이어명의 `G-419 문구표` 표시는 없다.

### 못 한 것
| 항목 | 이유 |
|---|---|
| #16 ① `Total claimed` 행 추가(H5) | 패널이 인스턴스라 행을 새로 넣을 수 없다(오버라이드로는 텍스트·표시만 가능). 메인 컴포넌트(다른 페이지 `DEX` 27610:202719)에 행을 추가해야 함 |
| #26 H6 `DEX data pending` 표본 | 허브 패널에 날짜 칸이 없어 라벨을 둘 자리가 없다. 인스턴스 구조 변경 없이는 넣을 수 없음 |
| H8 패널 높이 | `Reported next day` 행을 숨긴 뒤 영수증 카드 아래 지그재그 장식과 카드 사이에 빈 띠가 남는다(카드 고정 높이 — 메인 구조) |

### 새 프레임(이 영역)
| 노드 | 이름 |
|---|---|
| 29327:390594 | DEX / Web / Hub H4-DEX DEX balance under 10 USDT (S4) / Light (라벨 29327:391310) |
| 29327:391315 | DEX / Web / Hub H5-Partial Only part claimable (S4) / Light (라벨 29327:392031) |
| 29327:397356 | DEX / Web / Hub H5-Loading DEX balance loading (S4) / Light (라벨 29327:398073) |
| 29327:392036 | DEX / Web / Hub H5-Aster Aster wallet linked (S4) / Light (라벨 29327:392752) |
| 29327:392758 | DEX / Web / Hub H5-Pre-deducted Auto claim requested (S4) / Light (라벨 29327:393474) |
| 29327:398082 | DEX / Web / Hub H1-Rate error Estimate unavailable (S1) / Light (라벨 29327:398810) |
| 29327:398826 | DEX / Web / Hub H1-No results Comparison search empty (S1) / Light (라벨 29327:399554) |
| 29327:412884 | DEX / Mobile / Hub H1-Rate error Estimate unavailable (S1) / Light (라벨 29327:413484) |
| 29327:413500 | DEX / Mobile / Hub H1-No results Comparison search empty (S1) / Light (라벨 29327:414100) |

---

## 3. 캐시백 요약 Web · 캐시백 랭킹 Web (28960:127124 · 28960:127192)

| 항목 | 화면(노드 링크) | 바꾼 것 | 근거 | 전/후 캡처 |
|---|---|---|---|---|
| #21 ①② · #29 · #33 | [CS1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127133) · [CS2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127139) | 월간 카드 `Claimed` → `Withdrawn` · 출금 행 유형 `Payout` → `Claim Amount` · 월 합계를 캘린더 일 순액(-15.00 · -11.80 · +17.40)에 맞춰 `Received +50.60` / `Withdrawn -60.00` / `Net -9.40 USDT` · 유형 트리거 `All Cashback Types` → `All Types` · 일별 목록 Lighter 행 주소 전체(`0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9`, CS3와 같은 표본) | D2 · REQ-369 · REQ-371 · REQ-378 · REQ-367 | [전](Figma수정결과_img/balance_21-CS1_before.jpg) / [후](Figma수정결과_img/balance_21-CS1_after.jpg) |
| #33 | [CS3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127145) · [CS5](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127157) | 유형 트리거 `All Types` | REQ-378 | [전](Figma수정결과_img/balance_21-CS3_before.jpg) / [후](Figma수정결과_img/balance_21-CS3_after.jpg) |
| #21 ① · #32 | [CS4](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=28960-127151) | `Claimed` → `Withdrawn`, 값 `-40.00` → `-20.00 USDT`(캘린더 5일 `-20.00`과 일치, `Net +150.02M USDT` 유지) · 선택일(26일, 목록 `No cashback activity yet.`) 칸의 `+5.00` 숨김 · 유형 트리거 `All Types` | REQ-369 · REQ-378 | [전](Figma수정결과_img/balance_21-CS4_before.jpg) / [후](Figma수정결과_img/balance_21-CS4_after.jpg) |
| #8 | [CS1 · Withdrawal returned](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-118685) | CS1 인스턴스 복제. 26일 행 3 = `Withdrawal returned` · `Lighter Wallet {전체 주소}` · `+20.00 USDT`(파란 + 색, Lighter 로고) · 26일 칸 `+57.40` · 월 `Received +70.60` / `Withdrawn -40.00` / `Net +30.60 USDT` | REQ-372 · 정책 6장 · G-113 | [전](Figma수정결과_img/balance_21-CS1_before.jpg) / [후](Figma수정결과_img/balance_8-CSReturned_after.jpg) |
| #21 ③ | [CS1 · Delayed](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-126239) | CS1 복제(분리). 캘린더 위 S9 `<Alert>` 인스턴스 `Lighter has not sent new data yet. Amounts show the last update.` + 캡션 `Last updated 2026.05.25 09:12`. 금액은 마지막 보고값 유지 | REQ-376 · REQ-301 · 정책(데이터 지연 각주) · S9 22442:219848 | [전](Figma수정결과_img/balance_21-CS1_before.jpg) / [후](Figma수정결과_img/balance_21-CSDelayed_after.jpg) |
| #21 ④ | [CS1 · Loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-128305) | CS1 복제(분리). 캘린더·월간 카드·일별 목록을 숨기고 S7 `State / loading` 스켈레톤으로 대체(금액 0 미표시) | REQ-269 계열 · S7 22442:219836 | [전](Figma수정결과_img/balance_21-CS1_before.jpg) / [후](Figma수정결과_img/balance_21-CSLoading_after.jpg) |
| #34 | [CS6 · DEX selected](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-312441) | CS6dex 복제 → 드롭다운 닫힘, 트리거 `All DEX exchanges` | REQ-030 · CS6dex 29190:127498 | [전](Figma수정결과_img/balance_34-CS6dex_before.jpg) / [후](Figma수정결과_img/balance_34-CS6dex_after.jpg) |
| #33 | [All Accounts · Wallet address popover](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-312548) + [팝오버](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-312732) | 계정 필터(29265:120180) 복제 옆에 랭킹 주소 팝오버(`Wallet address` + 전체 주소 + `Close`) 복제 표본 1개 | REQ-366 · REQ-010 · RKpop 28984:126304 | [전](Figma수정결과_img/balance_33-RKpop_before.jpg) / [후](Figma수정결과_img/balance_33-CS6acct_after.jpg) · [팝오버](Figma수정결과_img/balance_33-RKpop_after.jpg) |
| #30 · #23 · 추가-2 | [RK1](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-121828) | 사이드 패널 `0 USDT` → `0.00 USDT`(RK1·RK2·RK3·CEX·DEX 5개) · 목록 아래 캡션 2줄 `Cashback under 0.01 USDT isn’t included in the rankings.` / `Ranking rewards can’t be claimed on their own. They’re matched 1:1 with the same account’s cashback.` · 배경 홈 → 혜택 화면(29062:113000 복제, 기존 홈 본문 숨김) | REQ-023 · REQ-381 · REQ-382 · 문구표 #52·#53 · D6 · REQ-379 | [전](Figma수정결과_img/balance_30-RK1_before.jpg) / [후](Figma수정결과_img/balance_30-RK1_after.jpg) |
| 추가-2 | [RK2](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-123588) · [RK3](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-124091) · [CEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-122197) · [DEX](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29192-122566) | 배경 홈 → 혜택 화면(같은 방식, 패널 그대로) | D6 · REQ-379 · REQ-383 | [전](Figma수정결과_img/balance_A2-RKDEX_before.jpg) / [후](Figma수정결과_img/balance_A2-RKDEX_after.jpg) |
| #40 | [RK1 · Loading](https://www.figma.com/design/hsa3bSV9QmFTe2jsf6tzTm/UI-UX-Design?node-id=29327-379476) | RK1 복제, 패널 행·캡션 숨기고 S7 스켈레톤 행(배경 혜택 화면) | API-014 · S7 22442:219836 | [전](Figma수정결과_img/balance_30-RK1_before.jpg) / [후](Figma수정결과_img/balance_40-RKLoading_after.jpg) |

![전](Figma수정결과_img/balance_21-CS1_before.jpg) ![후](Figma수정결과_img/balance_21-CS1_after.jpg)
![전](Figma수정결과_img/balance_21-CS2_before.jpg) ![후](Figma수정결과_img/balance_21-CS2_after.jpg)
![전](Figma수정결과_img/balance_21-CS3_before.jpg) ![후](Figma수정결과_img/balance_21-CS3_after.jpg)
![전](Figma수정결과_img/balance_21-CS4_before.jpg) ![후](Figma수정결과_img/balance_21-CS4_after.jpg)
![전](Figma수정결과_img/balance_21-CS5_before.jpg) ![후](Figma수정결과_img/balance_21-CS5_after.jpg)
![전](Figma수정결과_img/balance_21-CS1_before.jpg) ![후 Withdrawal returned](Figma수정결과_img/balance_8-CSReturned_after.jpg)
![전](Figma수정결과_img/balance_21-CS1_before.jpg) ![후 Delayed](Figma수정결과_img/balance_21-CSDelayed_after.jpg)
![전](Figma수정결과_img/balance_21-CS1_before.jpg) ![후 Loading](Figma수정결과_img/balance_21-CSLoading_after.jpg)
![전](Figma수정결과_img/balance_34-CS6dex_before.jpg) ![후](Figma수정결과_img/balance_34-CS6dex_after.jpg)
![전](Figma수정결과_img/balance_33-CS6_before.jpg) ![후 계정 필터](Figma수정결과_img/balance_33-CS6acct_after.jpg) ![후 팝오버](Figma수정결과_img/balance_33-RKpop_after.jpg)
![전](Figma수정결과_img/balance_30-RK1_before.jpg) ![후](Figma수정결과_img/balance_30-RK1_after.jpg)
![전](Figma수정결과_img/balance_A2-RKDEX_before.jpg) ![후](Figma수정결과_img/balance_A2-RKDEX_after.jpg)
![전](Figma수정결과_img/balance_30-RK1_before.jpg) ![후 Loading](Figma수정결과_img/balance_40-RKLoading_after.jpg)

### 3. 문구 대기
- 없음(문구표 #52·#53을 RK1에 반영). 문구표 #54 `Claim Amount (before linking)`(G-426 연동 전 출금 행)은 이 영역 계획 항목에 해당 프레임이 없어 넣지 않음.

### 못 한 것
- #20 CS 날짜 형식: REQ-378이 일별 목록 선택일을 `2026/05/26 (Today)`로 명시 — 계획 형식(`2026.05.26`)과 충돌해 기존 값 유지. 확인 필요.
- 캘린더 앞뒤 달 칸(4월 26~30 자리에 `1` 반복, 6월 자리 `25~30` 반복 셀)은 인스턴스 내부 숨김 셀이라 화면에 보이지 않아 손대지 않음.
- CS4 5일 칸이 `+12.10K` / `-20.00` 두 줄(일 순액 1개 규칙과 다름) — 계획 항목 밖이라 유지.

### 새 프레임(이 영역)
| 노드 | 이름 |
|---|---|
| 29327:118685 (+ 라벨 29327:119231) | DEX / CS1 Month view / light · Withdrawal returned |
| 29327:126239 (+ 라벨 29327:126785) | DEX / CS1 Month view / light · Delayed |
| 29327:128305 (+ 라벨 29327:128870) | DEX / CS1 Month view / light · Loading |
| 29327:312441 | 캐시백 요약 거래소 필터 · DEX · DEX selected |
| 29327:312548 · 29327:312732 (+ 라벨 29327:312736) | All Accounts · Wallet address popover / Wallet address / 0x7a3f…51e9 · Accounts filter |
| 29327:379476 (+ 라벨 29327:379882) | DEX / RK1 Ranking, rows / light · Loading |

캐시백 요약 섹션(28960:127124) 폭 9850 → 16000(새 프레임 오른쪽 배치).

---

## 새 프레임 목록 — 홈 · 지갑 상세 (섹션 28960:125772)

| 노드 | 이름 | 위치 |
|---|---|---|
| 29327:382890 | DEX / Web / DEX withdraw HW1 Home, Total Cashback Balance / Light · See All modal | 행 C, HW3 오른쪽 |
| 29327:409544 | … HW1 … · Balance loading | 행 C |
| 29327:410386 | … HW1 … · Balance error | 행 C |
| 29327:411242 | … HW1 … · Balance delayed | 행 C |
| 29328:142352 | DEX / Web / DEX withdraw HW1 Home, Linked Accounts / Light · States | 행 D |
| 29328:143413 | … HW1 Home, Linked Accounts … · Loading | 행 D |
| 29329:132465 | … HW1 Home, Total Cashback Balance … · Pre-deducted | 행 D |
| 29330:197859 | DEX / Web / DEX withdraw PW1 My Cashback, Lighter selected / Light · Pre-deducted | 행 D |
| 29328:144444 | … HW1 Home, Linked Accounts … · More than 10 | 행 E |
| 29330:208223 | Wallet detail / mWeb · Lighter | 행 E |
| 29330:208569 | Home / mWeb / S4 DEX | 행 E |
| 29330:199016 | … PW1 … · Delayed | 행 G |
| 29330:200173 | … PW1 … · Loading | 행 G |
| 29330:201351 | … PW1 … · Error | 행 G |
| 29330:202522 | … PW1 … · Reviewed | 행 G |
| 29330:203678 | … PW1 … · Copied | 행 G |

새 프레임 안의 홈·상세 인스턴스는 복제본에서만 분리(detach)해 행·칩을 넣었습니다. 원본 HW1·PW1과 메인 컴포넌트는 인스턴스 상태 그대로입니다.
