# STG 대조 점검 — 기존 산출물 누락·오류

작성일: 2026-11-16
대상: www-dev.tethermax.io (게스트 · 회원, PC 1440 / 모바일 390), 언어 `/en` (STG 언어 목록에 한국어 없음 → 한국어는 언어팩으로 확인)
대조 문서: `00_DEX_최종정책.md` · PRD · 요구사항정의서 · 기능명세서 · API스펙 · 정보구조도 · 언어팩 `(Important) TetherMax Lang. Pack(Final Ver.) (5).xlsx`

## 0. 순회 범위

| 구분 | 범위 | 결과 |
|---|---|---|
| 페이지 | 게스트·회원 각 122경로(링크 순회 46 + 앱 번들에서 찾은 경로 76), PC 1440 · 모바일 390 | 열리는 화면 약 45종. 회원·게스트 모두 홈으로 돌아가는 경로: `/benefit/*` · `/global-league/*` · `/campaign/*` · `/mypage/rank*` · `/draw` · `/paybackBoost` (S-16) |
| 모달 (자동) | 게스트 40페이지 · 회원 16페이지, 버튼을 눌러 열리는 모달 수집 | 거래소 상세 정보 모달 19종(`Total Savings` · 요율 비교 · 부스트 설명 · 이벤트 목록 · `How this works`) — CEX 상세라 DEX 문구 변경 없음 |
| 모달 (지정) | 회원: 캐시백 요약 필터 3종 · 쿠폰 `Claim` 계정 선택 · 웹 UID 연동 1·2단계 · 초대 리워드·파트너 허브 필터 | 쿠폰 계정 선택 `Select a UID to apply this coupon` / `Once applied, it cannot be changed.` → 정책 REQ-403 변경안과 일치. 요약 필터는 S-17 |
| 열지 않은 것 | 출금·`Claim`·연동 제출·저장·삭제·탈퇴·`Upgrade` 등 상태를 바꾸는 버튼 | 연동 결과 다이얼로그는 정책·디자인으로 대조. 출금 확인·캡차는 `Auto Claim` 비활성으로 회원 화면에서 빠짐 |

> 결정(2026-11-16): DEX 배포와 함께 **게스트(비회원) 기능을 CEX 포함 전부 폐지**합니다. 아래 표의 게스트 관련 조치(S-08 (c) · S-10 게스트 문장 · S-11 비회원 답변)는 「DEX 불가 명시」가 아니라 **삭제**로 처리합니다. 상세: 자동출금_영향검토 5장.

## 1. 발견 사항

| # | 구분 | 내용 | 근거 (STG) | 산출물 현재 | 조치 제안 |
|---|---|---|---|---|---|
| S-01 | 🔴 기준선 불일치 | **출금 화면이 정책·산출물 작성 이후 바뀌었음.** STG 출금 화면은 제목 `Claim`, 합계 `Total Claimable Cashback`, 계정 카드 칩 `Unclaimable`, 남은 금액 안내 `You can claim cashback if you receive an additional N USDT in exchange Cashback.`, 하단 경고 `No UIDs are eligible to claim.`, 버튼 `Auto Claim`(자동 지급으로 비활성) · `Back to Home` | `/withdrawal-apply` (회원) | 정책·요구사항·기능명세 모두 `Available Cashback` · `Withdraw` · `Confirm Withdrawal?` · 인증 · `Your withdrawal request was sent` 흐름 기준. 위 STG 문구가 산출물에 0건 | 자동 지급 결정(자동출금_영향검토 D-02·D-05)과 함께 출금 화면 요구사항을 STG 현재 화면 기준으로 다시 씀 |
| S-02 | 🔴 문구 원본 없음 | S-01의 문구(`Claim` 계열)가 언어팩(Final Ver. 5)에 없음 — 언어팩이 STG보다 오래됨 | 언어팩 검색 0건 | 산출물의 한국어 문구는 언어팩 기준(`신청 가능한 페이백` 등) | 최신 언어팩을 받아 한국어 문구 확인 ❓ |
| S-03 | ⚪ 용어 | `No UIDs are eligible to claim.`은 UID만 가리킴 → DEX 도입 후 CEX·DEX를 함께 가리키므로 `Account` 표현 필요 | `/withdrawal-apply` | 해당 문구 없음 | 언어팩 수정 대상에 추가 (예: `No accounts are eligible to claim.` ❓ 문구 확정 필요) |
| S-04 | 🟢 일치 확인 | 카드의 남은 금액이 5.00(리워드 충분) / 10.00(리워드 없음)으로 표시 → 매칭 공식 `A + MIN(B, A)` ≥ 10과 일치 | `/withdrawal-apply` | REQ-128~131 | 조치 없음 |
| S-05 | 🟢 일치 확인 | 캐시백 요약(`/rewardHistory`, 제목 `Cashback Summary`) 필터 `All Exchanges` · `All UIDs` · `All Cashback Types` · `Reset` · `Search` | `/rewardHistory` | F-077에 `All UIDs` → `All Accounts`, 그룹 필터 반영됨 | 조치 없음 |
| S-07 | 🔴 누락 | **쿠폰함 약관 문구가 DEX 정책과 충돌.** `In order to use a coupon, ‘UID binding’ must be completed with at least one exchange.` — 정책은 쿠폰 **사용에 DEX 지갑 포함**(정책 「혜택/쿠폰」 `#11`). 같은 약관의 `Coupon for UID binding`(첫 연동 쿠폰)은 발급이 CEX 첫 연동만이므로 그대로 두되 CEX 한정임이 드러나야 함 | `/coupon` 하단 `Terms & Conditions` (회원) | 정책·요구사항·기능명세 어디에도 쿠폰함 약관 문구 언급 없음 | 요구사항(쿠폰 영역)에 약관 문구 변경 추가: 사용 조건 = 「거래 계정(UID 또는 지갑) 1개 이상 연동」, 첫 연동 쿠폰 = 「거래소 UID 첫 연동 시」 명시. 문구 ❓ 확정 필요 |
| S-08 | 🔴 누락 (법무) | **개인정보처리방침에 지갑 주소 수집 항목이 없음.** 현재 (b) 회원 수집 항목 = `exchange name, exchange UID, exchange futures transaction history`, (c) 비회원 = 같은 항목. DEX 도입으로 회원의 **지갑 주소 · DEX 거래 원장(수수료·거래 시각 등)** 을 새로 수집·보관 | `/terms/privacy` | 정책·산출물에 개인정보처리방침 개정 언급 없음(파트너에게서 개인정보를 받지 않는다는 REQ-212만 있음) | 요구사항 추가: 개인정보처리방침 (b) 회원 항목에 지갑 주소·DEX 거래 기록 추가, (c) 비회원 항목은 변경 없음(게스트 DEX 불가). 법무 검토 ❓ |
| S-09 | 🔴 누락 (법무) | **이용약관 6.8** `Users who have their own user code can link multiple UIDs, but only their own UIDs can be bound.` — UID만 언급. DEX 지갑도 본인 지갑만 연동 가능하다는 조항 필요 | `/terms/use` | 이용약관 개정 언급 없음 | 요구사항 추가: 6.8을 거래 계정(UID·지갑) 기준으로 개정. 법무 검토 ❓ |
| S-10 | 🔴 누락 + 자동 지급 충돌 | **Beginner's Guide 아티클 `Cashback Basics`** 본문: `Minimum claim: … for a UID reaches 10 USDT` · `Event reward rule: … for the same UID, at a 1:1 ratio` · `How: Members log in and click Claim from the home screen. Guest can select their exchange, enter their UID, and claim cashback from the homepage.` · `Link your UID: 3 USDT` | `/beginner-guide/cashback-basics` | 산출물은 Beginner's Guide 4·5번 DEX 모듈 추가만 다룸(REQ-441~444). 기존 1~3번 아티클 본문 수정은 없음 | ① UID → 거래 계정 ② `click Claim` → 자동 지급 설명으로 교체(자동출금 D-02) ③ 게스트 문장에 「CEX만」 명시 ④ `Link your UID: 3 USDT`는 CEX 첫 연동만이므로 그대로 |
| S-11 | ✏️ 누락 | **홈 FAQ** 비회원 답변 `Search for your exchange and UID on the TetherMax homepage to check the cashback timeline.` · `Search for your exchange and UID to view your available cashback…` — 게스트 DEX 조회 불가 예외가 드러나지 않음. 회원 답변 `select your exchange, UID, and cashback type`도 UID만 | 홈 `/` FAQ | 홈 FAQ 문구 변경 없음 | 회원 답변 UID → 거래 계정, 비회원 답변에 「CEX 거래소만 조회 가능」 추가 |
| S-12 | ✏️ 확인 필요 | **홈 실시간 출금 피드 표 머리** `UID · Exchange · Cashback · Withdrawal Time · Status` — DEX 지급이 피드에 섞이면 `UID` 열 이름이 맞지 않음 | 홈 `/` | REQ-285 실시간 출금 피드는 있으나 열 이름 언급 없음 | 열 이름 `UID` → `Account`, DEX 행 식별자 표기(축약 형식) 확인 ❓ |
| S-13 | ✏️ 문구 | 서비스 소개 `Join an exchange with your TetherMax code and just enter your UID.` · 초대 설명 `links a UID` · `UID linked` / TP 페이지 `trade using the exchange UID linked to your TetherMax account` | `/service-intro-new` · `/tethermax-point` | 서비스 소개는 「DEX 추가」만, 문구 단위 변경 없음 | CEX 전용 맥락이면 유지, 서비스 전체 설명이면 거래 계정으로. 페이지별 판정 필요 |
| S-14 | 🔴 누락 + 자동 지급 충돌 | **두 번째 출금 화면 `/withdrawal`** (출금 가능 계정이 없을 때): 제목 `Trading just a bit more and you can claim.` · 안내 `Cashback can be claimed for UIDs with 10 USDT or more in cashback.` · UID별 금액 + `Trading just a bit more` · 합계 `Cashback to be Claimed` · `Go back` | `/withdrawal` (회원) | 산출물에 이 화면·문구 없음 | ① UID → 거래 계정(DEX 행은 지갑 표기) ② 안내 문장이 매칭 공식(`A + MIN(B, A)`)을 「캐시백 10 USDT 이상」으로만 표현 — 정확한 문구 재작성 ③ 자동 지급 안내로 바꿀지(자동출금 D-02) |
| S-15 | ✏️ 누락 | **웹 UID 연동 진입 `/uidlinking`**: `Have you registered a trading account with the TetherMax referral code?` · `You must link your UID to claim USDT from TetherMax.` · `Yes, I have one!` / `No, not yet!` | `/uidlinking` (회원, 웹) | 정보구조도는 `uidlinking`을 **앱 경로**로만 기록. 웹 화면의 DEX 분기·문구 변경 없음 | 웹 `/uidlinking`도 DEX 분기 대상에 추가, 문구 UID → 거래 계정 / 지갑 |
| S-16 | ❓ 확인 필요 | **웹에서 홈으로 돌려보내는 경로**(회원·게스트 모두): `/benefit/*` · `/global-league/*` · `/campaign/*` · `/mypage/rank` · `/mypage/rankdetail` · `/draw` · `/paybackBoost`. `/mypage/mypage`·`/mypage/invitefriend`는 `Unable to retrieve information` | STG 웹 | 산출물은 혜택·글로벌 리그·랭킹 등을 웹 화면 포함으로 서술 | 이 기능들이 **웹에서는 앱 전용(또는 비활성)** 인지 개발 확인 → 웹 변경 범위 조정 |
| S-17 | 🔴 오류 | **캐시백 요약 유형 필터 값이 STG와 다름.** STG 유형값 = `Trading Cashback` · `Event Reward` · `Claim Amount` | `/rewardHistory` `All Cashback Types` 드롭다운 | 기능명세 F-077 ③은 `Exchange Cashback` / `Event Reward` / `Withdrawal`로 기재 — 정책은 `Trading Cashback` → `Exchange Cashback` 개명을 **제안(❓ G-365)** 으로만 둠. `Withdrawal` 값은 STG에 없음 | F-077 ③을 STG 현재값 기준으로 고치고, 개명은 G-365 결정 대기로 표시. `Claim Amount`는 `Claim` 용어 결정과 함께 |
| S-18 | ✏️ 콘텐츠 | **웹 UID 연동 2단계(`/uidlinking?page=2`) 거래소 배지가 영문 화면에서 한국어**로 나옴(`최상위 거래소` · `신규 제휴` · `추천 거래소` · **`최대 페이백`** 등). `페이백`은 공식 용어(캐시백) 위반 | `/uidlinking?page=2` | 산출물 범위 밖(어드민 입력 배지) | 어드민 배지 다국어 입력 확인 + `최대 페이백` → `최대 캐시백`. DEX 배지 입력 시 같은 문제 방지 |
| S-06 | ✏️ 보완 가능 | 정보구조도 IA-Q1 「사용자 웹 라우트 목록 없음」 → STG 앱 번들에서 화면 경로 확보(약 90개, 예: `/withdrawal-apply` · `/rewardHistory` · `/coupon` · `/uidlinking` · `/mypage/*` · `/kycCertification` · `/campaign/*`) | 앱 번들 | IA-Q1 미해결, 3.1 URL 열 공란 | 순회 완료 후 정보구조도 3.1 URL 열을 채우고 IA-Q1 해소 |
