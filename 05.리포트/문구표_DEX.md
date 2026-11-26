# 문구표 — TetherMax DEX (확정본)

> 원문이 없던 화면·메일 문구를 한 곳에 모은 확정 문구표입니다. 채우는 순서: ① 언어팩(`(Important) TetherMax Lang. Pack(Final Ver.) (5).xlsx`) 같은 뜻의 키 → ② 기존 서비스 문구(STG · 기존 Figma · 이메일 템플릿) → ③ 신규 작성. 정책에 없는 값(주기·법무 문안)은 지어내지 않고 「값 미정」으로 둡니다.
> 용어: 출금 요청·동작 = `Claim`, 출금 실적·결과 = `Withdraw`/`Withdrawn` · CEX·DEX 공통 = `Account`/거래 계정, CEX만 `UID`, DEX만 `Wallet`/지갑 · `cashback`/캐시백 · `guest`/게스트 · 연동/`Link` · 사용자 시각에 타임존 라벨 없음. 국문은 앱 언어팩(`app` 시트) 말투인 「~해요/~했어요」 체, 약관·메일·FAQ는 원본 말투(「~합니다」)를 따릅니다.
> 프로토타입(`_프로토타입_전체/src`) 반영 완료. `{}`는 서버 값 자리.

## 요약

| 구분 | 행 수 | 설명 |
|---|---|---|
| 총 행 | **95** | 같은 뜻의 빈칸은 한 행으로 묶음 |
| 언어팩 재사용 | **13** | 키의 국문·영문을 그대로 씀(`페이백`→`캐시백` 치환만 허용) |
| 기존 문구 재사용 | **9** | STG · 기존 Figma · 이메일 템플릿 · 확정 정책 원문 |
| 신규 작성 | **59** | 언어팩 키를 UID→Account 등으로 고친 것(출처 칸에 바탕 키 표기)과, 영문은 정책 원문이 있고 국문만 새로 쓴 것(G-367 등) 포함 |
| 표시 없음(결정) | **9** | 사용자 결정으로 문구·상태를 두지 않음 |
| 운영 입력값 | **3** | 어드민·레코드가 채우는 값 — 문구표 대상 아님(프로토타입은 표본) |
| 값 미정 | **2** | G-425(법무 문안) · G-025 · G-036(정산 주기) · G-089(지역 판정) — 4장 |

## 1. 연동 · 홈 Linked Accounts

| # | 위치(화면 · 상태) | 쓰임 | EN | KO | 출처 | 근거 |
|---|---|---|---|---|---|---|
| 1 | 홈 연동 행 · 확인 중 / DEX 상세 오퍼 박스 확인 중 | 칩 | Trying to link | 연동 시도중이에요 | 언어팩 `link status processing` | 결정 6차 · Q6 · REQ-272 |
| 2 | 홈 연동 행 · 소유 확인 중 | 칩 | Verifying ownership | 소유 확인중이에요 | 언어팩(app) `link status owner` | L-12 · REQ-272 |
| 3 | 홈 연동 행 · 이슈 | 칩 | There’s an issue | 문제가 있어요 | 언어팩(app) `link status problem` | REQ-272 |
| 4 | 홈 연동 행 · 연동 실패 | 칩 | Linking failed | 연동 실패했어요 | 언어팩(app) `link status fail` | REQ-272 |
| 5 | 홈 연동 행 · 소유 확인 실패 | 칩 | Ownership verification failed | 소유 확인에 실패했어요 | 언어팩(app) `link status owner fail` | REQ-272 |
| 6 | 홈 연동 행 · 연동 해제 | 칩 | Unlinked | 연동 해제되었어요 | 언어팩(app) `link status disconnect` | REQ-272 |
| 7 | 홈 연동 행 · 연동 완료 | 칩 | Linked | 연동 완료 | 신규(EN) · KO 기존 상태명 | REQ-272 |
| 8 | 홈 연동 행 · 오프보딩 | 칩 | Inactive | 비활성 | 언어팩 `inactive` | REQ-121 · G-128 · G-367 |
| 9 | 홈 연동 행 · 캐시백 0 | 칩 | No cashback yet | 아직 캐시백이 없어요 | EN 정책(8-1) · KO 신규 | REQ-273 · G-367 |
| 10 | 홈 연동 행 · 지연 | 칩 | Data delayed | 반영 지연 | EN 정책(8-1) · KO 신규 | REQ-273 · G-367 |
| 11 | 홈 연동 행 · 오프보딩 | 본문(행 안내) | No longer supported. Cashback already earned is still sent to this wallet automatically. | 지원이 종료된 거래소예요. 적립된 캐시백은 이 지갑으로 계속 자동 지급돼요. | 신규 | REQ-121 |
| 12 | 홈 S3 앱·모바일웹 빈 홈 카드 | 제목 | Link once and cashback keeps coming | 한 번 연동하면 캐시백이 계속 쌓여요 | 신규(단수 표기 확정) | REQ-267 · 사용자 확인 #48 |
| 13 | 홈 FAQ `How do I get cashback?` 회원 답변(게스트 답변 삭제) | 본문 | Go to Cashback Summary, then select your exchange, account, and cashback type to view your cashback history by date. | [캐시백 요약] 메뉴에서 거래소 / 거래 계정 / 캐시백 유형을 선택하면 날짜별 캐시백 적립 내역을 확인하실 수 있습니다. | 언어팩 FAQ 시트(회원 답변) UID→account 치환 | S-11 · G-419 |
| 14 | 홈·허브 목록 10개 초과 | 버튼 | Show More | 더 보기 | 언어팩 `show more` | REQ-134 · balance 「더보기」 |
| 15 | 지갑 상세 · 주소 복사 | 토스트 | Copied. | 복사되었습니다. | 언어팩 `copied` | balance #40 |
| 16 | 웹 `/uidlinking` 진입 질문 | 본문 | You must link your account to receive USDT from TetherMax. | 테더맥스에서 USDT를 받으려면 거래 계정 연동이 꼭 필요해요. | 신규(언어팩 `uidlinking subTitle` 바탕) | REQ-712 |
| 17 | 거래소 선택기 · 목록 로드 실패(L-10) / DEX 랜딩·허브·서비스 소개 파트너 로드 실패 | 제목 · 본문 · 버튼 | Partners couldn’t load / Please try loading the exchange list again. / Retry | 거래소 목록을 불러오지 못했어요 / 거래소 목록을 다시 불러와 주세요. / 다시 시도 | EN 기존 Figma 상태 보드 S5_05 · KO 신규(버튼 언어팩 `try again`) | L-10 · G-097 · content CT |
| 18 | DEX 상세 게스트 CTA | 버튼 | Sign Up | 회원가입 | 기존 화면 문구 | G-402 |
| 19 | 연동 모달 · 가입 후 복귀(그 DEX 미리 선택) | 안내 | Signed up on {DEX}? Paste your {DEX} wallet address to link it. | {DEX} 가입을 마쳤다면 {DEX} 지갑 주소를 붙여넣어 연동해 주세요. | 신규 | G-402 |
| 20 | 처리 중 · 연동 전 잔액 출금 대기(L-07) | 본문 | Your previous cashback of {amount} USDT is being sent to this account. Linking completes once the transfer is confirmed. | 이전에 쌓인 캐시백 {amount} USDT를 이 거래 계정으로 보내고 있어요. 송금이 확인되면 연동이 완료돼요. | 신규 | G-426 · REQ-108 |
| 21 | 연동 결과 · 연동 전 잔액 출금 실패 | 본문 | We couldn’t send your previous cashback, so this account wasn’t linked. The amount is back in this account’s balance. You can try linking again. | 이전에 쌓인 캐시백을 보내지 못해 연동하지 못했어요. 금액은 이 거래 계정의 잔액으로 돌아왔어요. 다시 연동을 시도할 수 있어요. | 신규 | G-426 · REQ-107 |
| 22 | 지갑 주소 입력 · 빈 값 | 인라인 오류 | Enter your wallet address. | 지갑 주소를 입력해 주세요. | EN 정책 A-12 · KO 신규 | G-367 |
| 23 | 지갑 주소 입력 · 내부 공백 | 인라인 오류 | Remove spaces within the wallet address. | 지갑 주소 안의 공백을 지워 주세요. | EN 정책 A-12 · KO 신규 | G-367 |
| 24 | 지갑 주소 입력 · 지원하지 않는 형식 | 인라인 오류 | This address is not supported for the selected exchange. | 선택한 거래소에서 지원하지 않는 주소예요. | EN 정책 A-12 · KO 신규 | G-367 |
| 25 | 지갑 주소 입력 · 거래소 확인 실패 | 인라인 오류 | We couldn’t verify this wallet address. Copy it again from the exchange. | 지갑 주소를 확인하지 못했어요. 거래소에서 다시 복사해 주세요. | EN 정책 A-12 · KO 신규 | G-367 |
| 26 | 지갑 주소 입력 · 이름 입력 | 인라인 오류 | Paste the wallet address, not an account name. | 계정 이름이 아닌 지갑 주소를 붙여넣어 주세요. | EN 정책 A-12 · KO 신규 | G-367 |
| 27 | 지갑 주소 입력 · 제로 주소 | 인라인 오류 | This address can’t be linked. | 연동할 수 없는 주소예요. | EN 정책 A-12 · KO 신규 | G-367 |
| 28 | 공통 · 429 · 중복 요청 · 잘못된 값 | 토스트 | Something went wrong. Please try again. | 문제가 발생했습니다. 다시 시도해 주세요. | 언어팩 `something went wrong try again` (기존 MAX-18 토스트) | 결정 3차 #10 · G-459 |
| 29 | 소유권 O9 등 `Something Went Wrong` 다이얼로그 | 제목 | Something went wrong | 문제가 발생했습니다 | 언어팩 `something went wrong` | G-367 |

## 2. 잔액 · 허브 · 피드 · 게스트 조회

| # | 위치(화면 · 상태) | 쓰임 | EN | KO | 출처 | 근거 |
|---|---|---|---|---|---|---|
| 30 | 허브 CEX 패널 · `Total event reward` 하위 줄 | 캡션 | From events. Invitation rewards are separate. | 이벤트에서 받은 리워드예요. 초대 리워드는 따로 쌓여요. | 신규 | G-140 |
| 31 | 허브 DEX 패널 · 출금 가능액 줄 | 라벨 | Claimable {amount} USDT | 출금 가능 {amount} USDT | 신규(STG `Total Claimable Cashback` 계열) | REQ-300 · G-418 |
| 32 | 허브 DEX 패널 · 각주 | 캡션 | Cashback is sent automatically to your linked {DEX} wallet. | 캐시백은 연동한 {DEX} 지갑으로 자동 지급돼요. | 신규 | REQ-300 · 정책 2350줄(국문 재작성) · G-419 |
| 33 | 허브 DEX 패널 · 10 USDT 미만 | 캡션 | Cashback is claimed automatically once your claimable amount reaches 10 USDT. | 출금 가능액이 10 USDT가 되면 자동으로 출금돼요. | 신규 | REQ-301 · G-419 |
| 34 | 허브 CEX·DEX 패널 · 부족분 넛지 | 캡션 | You can claim cashback if you receive an additional {n} USDT in exchange Cashback. | 거래소 캐시백을 {n} USDT 더 받으면 출금할 수 있어요. | 기존 STG 현행 | G-139 · G-418 · 정책 4-1 |
| 35 | 허브 DEX 패널 · 일부만 출금(H5-Partial) | 캡션 | Only part of this balance can be claimed. | 일부만 출금할 수 있습니다 | KO 기존(계획 원문) · EN 신규 | balance #13 · G-419 |
| 36 | 홈·허브 · 매칭 안내 | 캡션 | Event rewards are matched 1:1 with the same account’s cashback. The minimum per account is 10 USDT. | 이벤트 리워드는 같은 계정의 캐시백과 1:1로 매칭됩니다. 최소 출금액은 계정별 10 USDT입니다. | KO 기존(계획 원문) · EN 신규 | 정책 4-1 · G-419 |
| 37 | 홈·요약 · 선차감 | 캡션 | Amounts being claimed are excluded from your balance until the result is confirmed. | 출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다 | KO 정책 예시 · EN 신규 | G-112 · REQ-158 |
| 38 | 허브 라우트 행(CEX · DEX) | 캡션 | Claimed automatically from 10 USDT | 10 USDT부터 자동 출금 | 신규 | REQ-309 · G-419 |
| 39 | 허브 Brokers 비교표 | 제목 | Compare cashback across {n} brokers | — | 기존 비교표 제목 형식(`Compare cashback across {n} exchanges`) | balance #27 · 질문_hub #5 |
| 40 | 허브 Lighter 주중 「집계 전」 줄 | — | (표시 없음) | (표시 없음) | 표시 없음(결정) | G-100 해소 · G-428 |
| 41 | 랜딩·서비스 소개 실시간 피드 | 제목 · 부제 | Someone is cashing out right now / Claim every cent you've earned | 지금 이 순간에도 누군가는 캐시백을 받고 있어요 / 쌓인 캐시백을 한 푼도 빠짐없이 받아가세요 | 기존 랜딩 문구(두 화면 통일) | balance #39 · REQ-285 |
| 42 | 피드 열 | 열 이름 | Withdrawal Time | 출금 시각 | EN 신규 · KO 기존 | balance #39 · D2 |
| 43 | 피드 · 빈 상태 / 로드 실패 | 본문 | No cashback activity yet. | 아직 캐시백 내역이 없습니다. | 언어팩 `no cashback activity yet`(페이백→캐시백) | 결정 3차 #3 · G-137 |
| 44 | 랜딩 3단계 · 3번째 줄(라이트·다크 공통) | 제목 | Get cashback in USDT automatically | 캐시백을 USDT로 자동으로 받아요 | 신규 | balance #28 |
| 45 | 게스트 조회 결과 · 10 USDT 이상 | 캡션 | 10 USDT minimum reached. Link this account to receive it. | 최소 금액 10 USDT를 넘었어요. 이 거래 계정을 연동하면 받을 수 있어요. | 신규 | 정책 6-5 · G-419 |
| 46 | 게스트 조회 결과 · 10 USDT 미만(DEX · CEX) | 캡션 | Below the 10 USDT minimum to claim. | 출금 최소 금액 10 USDT에 못 미쳐요. | 신규 | L-27 · G-419 |
| 47 | 허브 잔액 로드 실패 | 제목 · 본문 | Cashback could not load / We could not load your cashback. Please try again. | 캐시백을 불러오지 못했어요 / 캐시백을 불러오지 못했어요. 다시 시도해 주세요. | EN 정책 CH-10 · KO 신규 | G-367 |
| 48 | 홈 잔액 로드 실패 | 본문 | We can't load your balance right now. | 지금은 잔액을 불러올 수 없어요. | EN 정책 · KO 신규 | G-367 · REQ-269 |
| 49 | DEX 카드 파트너 오류 | 본문 | We can't load your latest {DEX} cashback right now. | 지금은 {DEX}의 최신 캐시백을 불러올 수 없어요. | EN 정책 · KO 신규 | G-367 · REQ-148 |
| 50 | 계산기 요율 로드 실패 | 수치 자리 | Estimate unavailable | 예상 금액을 계산할 수 없어요 | EN 정책(G-144) · KO 신규 | G-367 |
| 51 | 홈·지갑 상세 · DEX 0원 배너 · 갱신 주기(Lighter 포함) | 본문 · 칸 | Cashback appears here the day after you trade on your linked DEX. / Daily, {로컬 시각} | (기존 국문 짝) | 확정 정책 원문 | G-110 · G-428 |
| 52 | 랭킹 목록 아래 | 캡션 | Cashback under 0.01 USDT isn’t included in the rankings. | 캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다. | KO 기존(계획 원문) · EN 신규 | balance #36 |
| 53 | 랭킹 목록 아래 | 캡션 | Ranking rewards can’t be claimed on their own. They’re matched 1:1 with the same account’s cashback. | 랭킹 리워드만으로는 출금할 수 없어요. 같은 계정의 캐시백과 1:1로 매칭돼요. | 신규 | balance #36 · 정책 4-1 |
| 54 | 캐시백 요약 · 연동 전 출금 행 | 유형명 | Claim Amount (before linking) | 연동 전 출금 | 신규(STG 유형값 `Claim Amount` 바탕) | G-426 · G-418 |

## 3. 리워드 · 초대 · 쿠폰 · 맥스보드 · 콘텐츠 · 메일

| # | 위치(화면 · 상태) | 쓰임 | EN | KO | 출처 | 근거 |
|---|---|---|---|---|---|---|
| 55 | 혜택 상세 · 첫 캐시백 10 USDT(PC · MO) | 버튼(비활성) | Auto Claim | Auto Claim | 기존 STG 버튼 | R-02 · N9 · G-419 |
| 56 | 파트너 허브 · 금액 라벨(PC·MO 통일) | 라벨 | Claimable Amount | 출금 가능 금액 | 신규(STG Claim 계열) | R-05 · G-418 |
| 57 | 친구 초대 · 10 USDT 미만 / 파트너 허브 최소액 미만 | 경고 줄 | Invitation rewards are claimed automatically at 10 USDT. Just {amount} USDT more to go. | 초대 리워드는 10 USDT가 되면 자동으로 출금돼요. {amount} USDT만 더 모이면 돼요. | 신규 | R-25 · D8 · REQ-414 · G-419 |
| 58 | 쿠폰함 약관 · How to use coupon | 약관 | To use a coupon, you must link at least one account (UID or wallet). | 쿠폰을 사용하려면 거래 계정(UID 또는 지갑)을 1개 이상 연동해야 합니다. | 신규(언어팩 `uid interworking is required to use the coupon` 바탕) | R-15 · S-07 · 8-14 |
| 59 | 쿠폰함 약관 · Coupon for UID binding | 약관 | 'Coupon for UID binding' is given the first time you link a UID from a centralised exchange. Linking a DEX wallet does not qualify. | 'UID 연동 쿠폰'은 중앙화 거래소 UID를 처음 연동하면 지급됩니다. DEX 지갑 연동은 대상이 아닙니다. | 신규 | R-15 · REQ-404 |
| 60 | 쿠폰 · 연동 계정 없음 | 다이얼로그 본문 | You need to link an account to use the coupon. | 쿠폰을 사용하려면 거래 계정 연동이 필요해요 | 신규(언어팩 `uid interworking is required to use the coupon` UID→account) | R-16 · G-196 |
| 61 | 쿠폰 · 이미 사용(409) | 제목 · 본문 · 버튼 | Unable to Use Coupon / This coupon has already been used. / OK | 쿠폰을 사용할 수 없어요 / 이미 사용한 쿠폰입니다. / 확인 | 제목 기존 다이얼로그 · 본문 언어팩 `E033` | R-16 |
| 62 | 맥스보드 · 보드 완성(랭킹 ON) | 안내 | Rankings are updated daily. | 랭킹은 매일 업데이트돼요 | 신규(언어팩 `benefit detail exchange ranking updated` 바탕, 시각 제외) · KO 정책 | R-08 · REQ-654 |
| 63 | 맥스보드 · 마지막 날 Batch 후 완성 | 안내 | Final rankings will be shown when results are announced · {date} | 최종 순위는 결과 발표 때 확인할 수 있어요 · {date} | 신규 · KO 정책 | R-13 |
| 64 | 맥스보드 · 참여 계정 선택 | 제목 | Select an Account to Participate | 참여할 거래 계정을 선택하세요 | 신규(기존 `Select a UID to Participate` 치환) | R-09 · REQ-655 · N5 |
| 65 | 맥스보드 · 참여 계정 선택 | 부제 | Only eligible {exchange} accounts are shown. | 참여 가능한 {exchange} 거래 계정만 표시돼요. | 신규(기존 UID 문장 치환) | R-09 · REQ-655 |
| 66 | 맥스보드 · 등록 확인 | 제목 | Would you like to participate with this account? | 이 거래 계정으로 참여할까요? | 신규(기존 UID 문장 치환) | R-09 · REQ-655 |
| 67 | Cashback Basics · 최소 출금 | 본문 | Minimum claim: Once an account’s remaining cashback plus matched event rewards reaches 10 USDT or more, it is claimed automatically. | 최소 출금 금액: 한 거래 계정의 잔여 캐시백과 매칭된 이벤트 리워드 합계가 10 USDT 이상이 되면 자동으로 출금돼요. | 신규(언어팩 `beginner guide m3 s8 b1 i1` 바탕, STG 머리말 `Minimum claim`) | R-06 · REQ-714 · G-419 ① |
| 68 | Cashback Basics · 이벤트 리워드 규칙 | 본문 | Event reward rule: Event rewards can only be withdrawn alongside exchange cashback for the same account, at a 1:1 ratio. Your cashback for that account must be at least equal to the event reward amount. | 이벤트 리워드 규칙: 이벤트 리워드는 같은 거래 계정의 거래소 캐시백 금액의 최대 1:1까지 합산해서 출금돼요. 이벤트 리워드는 보유한 캐시백 금액을 초과해 출금할 수 없어요. | 신규(언어팩 `beginner guide m3 s8 b1 i2` UID→account) | R-06 · G-419 ② |
| 69 | Cashback Basics · 입금 시점 문장 | 본문 | Once requirements are met, TetherMax sends the amount to that account automatically. You don’t need to request it. | 조건을 충족하면 신청하지 않아도 테더맥스가 그 거래 계정으로 자동으로 보내드려요. | 신규(언어팩 `beginner guide m3 s8 b1 i3` 대체) | R-06 · 정책 6-1 |
| 70 | Cashback Basics · 방법(게스트 문장 삭제) | 본문 | How: Link your account. Each account is claimed automatically once it reaches 10 USDT, with nothing to press. | 방법: 거래 계정을 연동하세요. 계정마다 10 USDT가 되면 누를 것 없이 자동으로 출금돼요. | 신규(언어팩 `beginner guide m3 s8 b1 i4` 대체) | R-06 · G-419 ③ |
| 71 | Cashback Basics · 캐시백 내역 | 본문 | …by exchange, account, and reward type. | …거래소별, 거래 계정별, 리워드 유형별로 확인할 수 있어요. | 신규(언어팩 `beginner guide m3 s9 b1 text` UID→account) | R-06 |
| 72 | Cashback Basics · KEY TAKEAWAYS 1 | 요약 | **Cashback is tracked per account.** Each linked exchange UID or DEX wallet has its own balance, and event rewards are added only up to the cashback earned on the same account. | **캐시백은 거래 계정별로 쌓여요.** 연동한 거래소 UID와 DEX 지갑마다 잔액이 따로 있고, 이벤트 리워드는 같은 계정의 캐시백만큼만 함께 출금돼요. | 신규 | Q8 · N12 · 정책 B-17 |
| 73 | Cashback Basics · KEY TAKEAWAYS 2 | 요약 | **Claims are automatic.** When an account’s claimable amount reaches 10 USDT, TetherMax sends it to that account. There’s no button to press. | **출금은 자동이에요.** 계정의 출금 가능액이 10 USDT가 되면 테더맥스가 그 계정으로 보내드려요. 따로 누를 버튼이 없어요. | 신규 | Q8 · 정책 6-1 |
| 74 | Cashback Basics · KEY TAKEAWAYS 3 | 요약 | **Anyone can check, members get paid.** Guests can look up cashback with an exchange and a UID or wallet address, but you need to sign up and link the account to receive it. | **조회는 누구나, 지급은 회원만.** 게스트도 거래소와 UID 또는 지갑 주소로 캐시백을 조회할 수 있지만, 받으려면 가입하고 그 계정을 연동해야 해요. | 신규 | Q8 · 정책 6-5 |
| 75 | 서비스 소개 · 캐시백 슬라이드 부제 | 본문 | Join an exchange with your TetherMax code and just link your account. Done, under 3 minutes! | 테더맥스 코드로 거래소에 가입하고 거래 계정만 연동하면 끝! 3분도 안 걸려요! | 신규(언어팩 `service intro cashback slide subtitle` UID→account) | S-13 · G-424 |
| 76 | 서비스 소개 · 파트너십 부제 | 본문 | Every time a trader you invite links an account and trades, you earn rewards. | 초대한 트레이더가 거래 계정을 연동하고 거래할 때마다, 보상으로 리워드를 받을 수 있어요. | 신규(언어팩 `service intro partnership subtitle` UID→account) | S-13 · G-424 |
| 77 | TP 페이지 · 연동 완료 표기 | 라벨 | Account linked | 거래 계정 연동 완료 | 신규(기존 `UID linked` 치환) | S-13 · G-424 |
| 78 | TP 페이지 · 적립 조건 | 본문 | …trade with an account linked to TetherMax. | …테더맥스에 연동한 거래 계정으로 거래하면 | 신규(기존 `trade using the exchange UID linked to your TetherMax account` 치환) | S-13 · G-424 |
| 79 | 앱 My Page · Cashback 허브 이동 행 | 행 라벨 | Cashback Hub | 캐시백 허브 | 기존 메뉴명(GNB `Cashback ▾`) | content CT · D4 |
| 80 | EMAIL 31 지갑 연동 실패 · 연동 전 잔액 출금 실패 사유 | 메일 본문 | We couldn’t send your previous cashback, so this account wasn’t linked. The amount is back in this account’s balance. You can try linking again. | 연동 전에 쌓인 캐시백을 송금하지 못해 연동이 완료되지 않았습니다. 금액은 해당 거래 계정의 잔액으로 복원되었으며, 다시 연동을 신청할 수 있습니다. | 신규(#21과 같은 뜻, 메일 말투) | R-26 · G-426 |
| 81 | EMAIL T14 출금 실패 · 잔액 복원 줄 | 메일 본문 | The amount is back in your balance. | 출금 금액은 잔액으로 복원되었습니다. | EN 정책 A-31 원문 · KO 신규 | 이메일템플릿 T14 |
| 82 | 출금 완료 메일 제목 | 메일 제목 | Cashback withdrawal completed | 캐시백 출금이 완료되었습니다. | 기존 템플릿 T13 | G-405 · U9 |

## 4. 표시 없음(결정) · 운영 입력값 · 값 미정

| # | 위치(화면 · 상태) | 쓰임 | EN | KO | 출처 | 근거 |
|---|---|---|---|---|---|---|
| 83 | 출금 화면 `/withdrawal-apply` · `/withdrawal` 문구 일체(`Network fee` 「테더맥스가 전액 부담」 · `Your withdrawable amount changed.` · 지급 네트워크 미설정 · 출금 가능 계정 없음 안내) | — | (표시 없음) | (표시 없음) | 표시 없음(결정) | Q1 · G-448 — 화면 삭제 |
| 84 | 연동 L2 · `Paste` 권한 거부 힌트 | — | (표시 없음) | (표시 없음) | 표시 없음(결정) | 결정 3차 #2 · G-351 |
| 85 | 연동 L5 · 캡차 스크립트 로드 실패 | — | (표시 없음) | (표시 없음) | 표시 없음(결정) | 결정 3차 #1 · G-098 |
| 86 | 게스트 조회 · CEX 연동 폼 · UID 형식 오류 | — | (현행 그대로 — 새 상태 없음) | (현행 그대로) | 표시 없음(결정) | 결정 6차 |
| 87 | 맥스보드 불러오기 실패(503) | — | (공통 오류 처리 — 별도 문구 없음) | — | 표시 없음(결정) | 결정 6차 · X-1 |
| 88 | 맥스보드 `PHASE_NOT_PARTICIPATION` · `CONCURRENT_REQUEST` | — | (버튼 비활성 · 중복 클릭 방지 — 문구 없음) | — | 표시 없음(결정) | 결정 3차 #9 · X-2 |
| 89 | 캐시백 챌린지 수령 완료 | — | (기존 디자인 그대로) | — | 표시 없음(결정) | 결정 6차 |
| 90 | DEX 상세 · 가이드 영상 로드 실패 | — | (정지된 첫 프레임 이미지 + 단계 글 그대로 — 별도 문구 없음) | — | 표시 없음(결정) | REQ-348 · content CT-09 |
| 91 | 지역 차단 이유 문구 | 본문 | 값 미정(G-089) | 값 미정(G-089) | 값 미정 | G-367 · G-089(지역 판정 신호 미정) |
| 92 | 거래소 가이드 단계 제목·설명(Lighter 외 DEX · Step 2 잘못된 체인 경고) | 본문 | (어드민 거래소 가이드 입력 — 표본: `Open {DEX} and copy the wallet address from your account. Paste it above.`) | (표본: `{DEX}에서 계정의 지갑 주소를 복사해 위에 붙여넣으세요.`) | 운영 입력값 | G-443 · REQ-533 |
| 93 | 프리로그인 랜딩 Hero DEX · `Promo Tagline` · `CTA Button Title` · `Total Savings` / DEX 상세 Plus 요율 · 카드 표본 요율 | 라벨 · 버튼 · 수치 | (운영자 입력 EN·KO · 레코드 `total_savings_rate`) | (운영자 입력) | 운영 입력값 | REQ-288 · REQ-060 · G-466 |
| 94 | 모바일 드로어 · 프로모 배너 / DEX 개요 배너 | 이미지 · 제목 · 내용 | (기존 어드민 「거래소 목록 상단 배너」 입력 — 한·영) | (같음) | 운영 입력값 | G-156 · D7 2차 |
| 95 | 이용약관 6.8 · 개인정보처리방침 (b) 지갑 주소·DEX 거래 기록 · (c) 게스트 조회 처리 범위 / ApeX·Aster 정산 주기 표기(`Daily` 여부 · 공개 시각) | 약관 · 칸 | 값 미정(G-425 법무 문안) / 값 미정(G-025 · G-036) | 값 미정(G-425) / 값 미정(G-025 · G-036) | 값 미정 | G-425 🔴 · G-025 ⏳ · G-036 ⏳ |
