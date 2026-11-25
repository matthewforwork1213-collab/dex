# DEX 페이백 연동 및 출금 전체 플로우

작성일 2026-10-20 · 최종 수정 2026-10-20
영문본: `영문/3_연동_출금_플로우/DEX_Cashback_Linking_and_Withdrawal_Flow.md`

---

## 용어 주의 / Terminology Note

테더맥스는 같은 개념을 세 계층에서 다르게 부릅니다. 산출물에서는 **현행 UI 용어**를 씁니다.

| 한국어 (사용자 화면) | 현행 영문 UI (공식) | API·구 문서 (쓰지 않음) |
|---|---|---|
| 페이백 / 캐시백 | **cashback** | `payback`, `rebate` |
| 연동 | **Link** / linking | `integration`, `interworking` |
| 연동 해제 | **Unlink** | `disconnect` |
| 비회원 | **non-member** | `guest` |
| 소유 확인 | **ownership verification** | `possession` |
| 회원탈퇴 | **Account Deletion** | `withdrawal` (출금과 혼동 금지) |

> **중요:** 아래 CEX 기준 수치는 **현행 기준**입니다. 기존 문서에는 최소 출금액이 50 / 100 USDT로 기록된 레거시 값이 남아 있으나 현행이 아닙니다.

---

## 1. 구조 개요

### 1-1. CEX와 DEX의 근본적 차이

| 항목 | CEX (현행 17곳) | **DEX (신규 4곳)** |
|---|---|---|
| 식별자 | 거래소가 발급한 **UID** | **지갑 주소** + DEX 자체 계정 ID |
| 귀속 방식 | 거래소 레퍼럴 가입 | 테더맥스 레퍼럴 링크 |
| 캐시백 지급 주체 | **테더맥스** | **DEX가 사용자의 DEX 계정으로 직접** |
| 테더맥스의 역할 | 자금 보유 + 지급 | **조회와 표시만** |
| 출금 경로 | 테더맥스 → 사용자 거래소 지갑 내부이체 | **DEX 사이트에서 사용자가 직접** |
| 출금 최소액 | **UID당 매칭액 10 USDT** | **없음** (DEX 자체 규칙만 적용) |
| 출금 2차 인증 | 캡차 + Google OTP 또는 이메일 | **없음** |
| 이벤트 리워드 | 있음 | **없음** |
| 초대 리워드 | 있음 | **없음** |
| 지갑 연결·서명 | 해당 없음 | **절대 요구하지 않음** |
| 표시 통화 | USDT | **USDT** (USDC는 1:1, Aster는 Aster의 USDT 환산값) |

### 1-2. 핵심 원칙 4가지

1. **테더맥스는 DEX 트레이더의 돈을 움직이지 않습니다.** 지급·승인·출금 레코드를 만들지 않습니다.
2. **지갑 연결이나 서명을 절대 요구하지 않습니다.** 사용자는 주소를 복사해 붙여넣기만 합니다.
3. **모든 금액은 USDT로 표시합니다.** USDC는 1:1 환산, Aster는 Aster가 지급 시점에 계산한 USDT 환산값(`usdtValue`)을 그대로 씁니다. 테더맥스가 자체 환산하지 않습니다.
4. **DEX 활동으로는 이벤트 리워드와 초대 리워드가 발생하지 않습니다.**

### 1-3. DEX 4곳의 구조 차이

| 항목 | Lighter | ApeX | EdgeX | Aster |
|---|---|---|---|---|
| 정산 통화 | USDC | USDT | USDC | 수수료 자산 (가변) |
| 레코드 키 | 지갑 주소 단독 | 지갑 + AccountID | ethAddress + accountId | venue + 주소 |
| 정산 주기 | **주 1회 (월요일)** | 시간당 | 일 1회 (00:00 UTC) | 일 1회 (09:00 UTC 공개) |
| 웹훅 | **없음** (시간당 폴링) | 있음 | 일부 | 요청 단계 |
| 상태 | Accruing / Paid / Withheld | Pending / Paid | Pending / Paid | Pending / Paid |
| 출금 가능 잔액 제공 | 안 함 | `available_balance` | **안 함** | 요청 단계 |
| 고유 제약 | Standard 계정 캐시백 0, 2026-07-28 이후 바인딩만 적격 | AccountID 미반환 | 팀 전체 귀속 | **365일 후 바인딩 만료** |

---

## 2. 연동 플로우

### 2-1. 진입

CEX와 DEX가 **같은 Link Account 플로우**를 씁니다.

| 플랫폼 | 진입점 |
|---|---|
| 웹 | 로그인 홈의 `+ Link Account` 버튼. 연동이 없을 때는 빈 상태에도 노출 |
| 앱·모바일웹 | 홈 카드 `Link once and paybacks keep coming` (연동 0건), 또는 `Trading on multiple exchanges? Link more` (연동 1건 이상) |
| 공통 | DEX 상세 페이지와 Cashback Hub에서도 진입. 해당 거래소가 미리 선택된 상태로 열립니다 |

### 2-2. 거래소 선택

웹은 모달 내 드롭다운, 앱·모바일웹은 바텀시트(`Select an exchange`)입니다. 구성은 동일합니다.

1. 검색 필드 `Search exchanges`
2. `Popular partners` 타일
3. 필터 칩 `All` / `CEX` / `DEX` — 기본값 `All`
4. 거래소 목록. `All` 목록에서 **DEX 항목에는 `DEX` 배지**가 붙습니다

DEX를 선택하면 모달에 부제 `No wallet connection or signature required.`가 표시됩니다.

### 2-3. 지갑 주소 입력

- 필드 라벨: `Paste your wallet address`, Paste 버튼 제공
- 헬퍼 텍스트: `Starts with 0x followed by 40 characters.`
- 입력 후 라벨이 `Wallet address`로 변경
- 주소는 한 줄로 표시하고 뒤를 생략
- 주요 액션(`Next` 또는 `Link wallet address`)은 형식 검증 통과 전까지 비활성. 비활성 중 힌트 `Paste a valid wallet address to continue.`

**DEX별 안내 블록** `How to find your wallet address`가 함께 표시됩니다. 백오피스에서 DEX별로 작성한 지시문과 스크린샷(최대 5장)입니다. 예시(Lighter):

> `Open Lighter and log in. Tap your wallet address in the top right corner, copy it, then paste it above. No wallet connection or signature required.`

계정이 없는 사용자를 위해 `Don't have an account yet? Sign up here`가 제공되며, 해당 DEX의 테더맥스 레퍼럴 가입 경로를 새 탭으로 엽니다.

### 2-4. 주소 검증 규칙

클라이언트와 서버 양쪽에서 **같은 순서로** 검증합니다. 서버가 최종 권한을 가지며 클라이언트 결과를 신뢰하지 않습니다.

| 순서 | 검증 | 실패 시 문구 |
|---|---|---|
| 1 | 앞뒤 공백·탭·줄바꿈 제거. 제거하지 않은 값은 저장하지 않음. 내부 공백은 무효 | — |
| 2 | 빈 값 또는 공백만 거부 | `Enter your wallet address.` |
| 3 | 선택한 DEX가 선언한 형식과 일치 (현재 4곳 모두 EVM) | `This doesn't look like a {DEX} wallet address.` |
| 4 | 소문자 `0x` 접두사. 접두사 없음 또는 `0X`는 거부 | `Enter a valid wallet address starting with 0x followed by 40 characters.` |
| 5 | `0x` 뒤 정확히 40자 16진수. 39자·41자·64자 해시 거부 | 동일 |
| 6 | `0-9`, `a-f`, `A-F`만 허용 | 동일 |
| 7 | 전부 소문자 또는 전부 대문자는 허용. 대소문자 혼용은 **EIP-55 체크섬이 유효할 때만** 허용. 무효한 체크섬을 조용히 소문자로 바꾸지 않음 | `This address has an invalid checksum. Copy it again directly from {DEX}.` |
| 8 | ENS 이름, ICAP/IBAN 형식 거부 | `Paste the 0x wallet address, not a name or other format.` |
| 9 | 영주소(zero address) 거부 | `This address can't be linked.` |

**저장과 표시**
- 저장: **소문자**로 저장하고 대소문자 구분 없이 비교
- 표시: **EIP-55 체크섬 형식**, 공간이 부족하면 생략 (예 `0x7a3F...51e9`)

### 2-5. 캡차

- GEETEST 슬라이드 퍼즐 `Slide to complete the puzzle`
- 통과 시 `Verification Success` 표시 후 다음 단계 진행
- 반복 실패 시 `Verification Limit Reached`

### 2-6. 레퍼럴 귀속 확인

테더맥스가 DEX에 **"이 지갑이 테더맥스 레퍼럴 링크로 가입했는지"**를 확인합니다. DEX는 자체 계정 ID를 반환하고, 테더맥스가 지갑 주소와 함께 저장합니다. **사용자는 계정 ID를 입력하지 않습니다.** 같은 지갑을 여러 DEX에서 쓸 수 있기 때문입니다.

| DEX | 확인 방식 | 계정 키 |
|---|---|---|
| **Lighter** | 수신한 주간 CSV 대조. 없으면 실시간 레퍼럴 목록의 **마스킹 주소**(`0x` + 앞 2자 + 뒤 4자)와 바인딩 시각으로 대조 | 지갑 주소 단독 (서브계정 전부 포함) |
| **ApeX** | `is_partner_referral` 조회 | 지갑 + AccountID. **AccountID 미반환 상태이므로 미해결** |
| **EdgeX** | 귀속 조회. 가입을 완료한 사용자만 반환 | `ethAddress` + `accountId` |
| **Aster** | 주소 조회로 바인딩 시각과 만료 시각 확인 | venue + 주소 |

**즉시 확인이 불가능한 경우** 연동을 `Processing` 상태로 보류하고, 확인이 끝나면 사용자에게 알립니다.

> **Lighter 정정 (A-07).** 처음에는 "Lighter는 마스킹 대조만 가능하므로 다음 월요일 CSV까지 Processing"으로 적었습니다. **10월 19일 senya 답변으로 즉시 확인이 가능해졌습니다.** 마스킹 1건 일치 시 **즉시 연동**하고, `used_at`을 바인딩 시각으로 씁니다. `Processing`은 **마스킹이 2건 이상 겹칠 때만** 발생합니다.

### 2-7. 성공

1. `Wallet Linked` 모달 — `Your {DEX} wallet address has been linked.` + `Back to Home`
2. 홈 토스트 — `Wallet linked successfully`
3. Linked Accounts 패널에 행 추가 (페이지 새로고침 없이)

### 2-8. 실패 및 보류 상태 8종

| 상태 | 문구 | 발생 조건 | 액션 |
|---|---|---|---|
| `Verification Limit Reached` | `Too many attempts. Please wait a few minutes and try again.` | 짧은 시간에 캡차·연동 반복 실패 | Close, Contact Support |
| `Unable to Link Wallet` | `We were unable to link this wallet address. Please contact our support team for assistance.` | 다른 상태가 포괄하지 않는 오류. DEX가 요청을 거부하거나 오류 반환 | Contact Support |
| `Unable to Link Wallet Yet` | `Please withdraw your accumulated cashback before linking a new wallet.` | **CEX 경로 전용.** DEX에서는 표시되지 않음 | Withdraw |
| `Unable to Link Wallet` (레퍼럴 아님) | `Only wallets that joined {DEX} through TetherMax's referral link can be linked.` | DEX가 테더맥스 레퍼럴로 보고하지 않음. Lighter는 마스킹 대조 실패 또는 2026-07-28 이전 바인딩. EdgeX는 가입 미완료 | Close, Contact Support |
| `Wallet Already in Use` | `This wallet address is already linked to another account. If it belongs to you, please contact our support team.` | 같은 DEX에서 다른 테더맥스 계정에 연동된 주소 (공백 제거 후 소문자 비교) | **Contact Support (주 액션)**, Try a different wallet |
| `You've Already Added This Wallet` | `This wallet address is already linked to your account. No further action is needed.` | 본인 계정에 이미 연동된 주소 | Close |
| `You've reached your wallet limit` | `You've reached the maximum number of linked wallets. Remove an existing one to add a new wallet.` | 지갑 한도 도달 | Manage Wallets, Cancel |
| `Processing Your Wallet` | `Your wallet address is being processed. You'll be notified once linking is complete.` | 귀속 확인을 즉시 할 수 없음 | Back to Home |

### 2-9. 지갑 연동 한도

**현재 설계: `3 × 활성 DEX 수`, 전 DEX 합산(풀링)**

- 활성 DEX 4곳 → 총 12개. 10곳 → 30개
- DEX별로 배분하지 않습니다. 한 DEX에 전부 쓸 수도 있습니다
- 같은 주소를 두 DEX에 연동하면 **2칸을 차지**합니다
- `Active` 상태는 한도에 포함됩니다. **`Processing` 포함 여부는 미결정입니다** (`EC-LNK-24`가 포함을 *제안*. B-3-1)
- 지갑을 제거하면 칸이 반환됩니다. ~~소유권 분쟁으로 잃는 경우~~ **A-16으로 해당 경로가 없습니다**
- CEX UID는 이 한도에 포함되지 않습니다
- 서버에서 연동과 **같은 트랜잭션 안에서** 검사합니다
- DEX가 비활성화되어 한도가 이미 연동한 수보다 낮아지면, 기존 연동은 유지되고 한도 미만으로 내려갈 때까지 신규 연동만 차단됩니다

> **검토 필요:** 이 공식은 DEX 활성화·비활성화가 전 회원의 한도에 영향을 줍니다. 1차 출시를 2곳으로 줄이면 한도가 6개가 됩니다. 고정 총량 방식도 검토 대상입니다.

### 2-10. CEX 연동과 달라지는 점 요약

- 하나의 Link Account 플로우에 `All` / `CEX` / `DEX` 필터가 추가됩니다
- DEX 경로에서는 UID 대신 지갑 주소를 붙여넣습니다. **어느 단계에서도 지갑 연결이나 서명을 요구하지 않습니다**
- DEX 계정 ID는 DEX가 제공하고 사용자는 입력하지 않습니다
- 실패 상태 문구가 지갑 기준으로 작성됩니다
- `Unable to Link Wallet Yet`은 CEX 경로에만 있습니다. DEX 캐시백은 DEX에서 출금하기 때문입니다

---

## 3. 적립 플로우

### 3-1. 공통 원칙

- 테더맥스는 각 DEX의 파트너 데이터를 **서버 측에서** 수집합니다. 페이지가 파트너 API를 직접 호출하지 않습니다
- 파트너 키는 **읽기 전용**이며 클라이언트에 노출되지 않습니다
- **조회 가능 기간은 최대 180일**입니다. 그보다 오래된 활동은 소급 수집할 수 없습니다
- 금액은 **DEX의 정산 통화로 저장**하고, 회원에게는 **USDT로 표시**합니다
- 레코드는 불변입니다. 정정은 원본을 참조하는 **새 레코드**로 처리합니다
- 레코드는 마감 후 **48시간**이 지나면 확정됩니다
- 파트너가 보낸 지갑 주소도 회원 입력과 **동일한 규칙으로 검증**합니다. 형식 오류나 체크섬 오류는 조용히 버리지 않고 검토 대기로 보내고 주간으로 DEX에 보고합니다
- API가 개통되기 전에는 **백오피스 엑셀 업로드**로 대체합니다

### 3-2. DEX별 적립 구조

#### Lighter — 주 1회 정산

| 항목 | 내용 |
|---|---|
| 적격 | **2026-07-28 이후 바인딩만.** Plus 또는 Premium 계정만 (Standard는 수수료 0%라 캐시백 없음) |
| 지급 | 매주 월요일, 전주(월 00:00 ~ 일 23:59 UTC) 분. **$1 최소액** |
| 지급 방식 | Lighter가 **USDC L2 이체**로 사용자의 Lighter 메인 계정에 직접 지급 |
| 실시간 데이터 | `userReferrals`를 **1시간마다 폴링**. 주중 누적 수수료와 등급 확인 |
| 정산 기준 | **매주 월요일 CSV가 정산 기준.** 주차·지갑·바인딩 시각·등급·지불 수수료·캐시백·테더맥스 몫·상태·트랜잭션 해시 포함 |
| 상태 3종 | **Accruing** (주중 추정치, 합계에 미포함) / **Paid** (월요일 CSV 확정, 트랜잭션 해시 포함) / **Withheld** (어뷰징 심사로 보류, 합계 미포함) |
| 지급 후 | **환수 없음.** Paid는 최종입니다 |

주중에 보여주는 금액은 **테더맥스가 계산한 추정치**입니다(지불 수수료 × 합의 요율). 반드시 추정치임을 표시하고 적립 합계에 넣지 않습니다.

#### EdgeX — 일 1회 정산, 출금 가능 잔액 미제공

| 항목 | 내용 |
|---|---|
| 지급 | 매일 00:00 UTC 정산. 회원당 UTC일 1건. 00:00~01:00 UTC 사이에 **USDC로 EdgeX 선물 계정에 직접 입금** |
| 조회 가능 | 01:00 UTC까지 |
| 제공 금액 | `totalPaidAmount` (누적 지급) / `accruingAmount` (당일 적립, 미정산) / `pendingAmount` (정산, 미지급) |
| **출금 가능 잔액** | **제공하지 않습니다.** 지급 후에는 마진에 섞여 구분할 수 없고, 출금 가능 금액은 계정 소유자의 정보라는 EdgeX 입장입니다 |
| 화면 표시 | `Paid to your EdgeX account` (= `totalPaidAmount`) / `On the way` (= `accruingAmount` + `pendingAmount`) |
| 소액 처리 | 0.01 USDC 미만과 지급 실패는 다음 지급으로 이월되며 `On the way`에 남습니다 |

#### ApeX — 시간당 정산

| 항목 | 내용 |
|---|---|
| 지급 | 시간당 정산. 배치 단위 원장 레코드. **USDT로 ApeX Rewards Center에 지급** |
| 상태 | **Pending** (정산 대기, 합계 미포함) / **Paid** (Rewards Center 지급 완료, 합계 포함) |
| 추가 표시 | `Available on ApeX` — Rewards Center의 미수령 잔액 (`available_balance`) |
| 레코드 키 | `record_id` (영구 고유, 예 `apx_cm_20261006_14_000184`) |
| 월 명세서 | 매월 1일 00:00 UTC 자동 생성 |
| **미해결** | 원장 레코드에 **캐시백 금액·지갑 주소·토큰·지급 시각이 명시돼 있지 않습니다.** AccountID도 반환되지 않습니다 |

#### Aster — 일 1회 정산, 바인딩 만료 있음

| 항목 | 내용 |
|---|---|
| 지급 | 매일 00:00 UTC 산정, 09:00 UTC 공개, 익일 지급 ($1 최소) |
| 통화 | **수수료 자산으로 지급**합니다 (USDT, USD1, USDC, USDC.e, ETH, BTC, BNB, USDF, asBNB 등) |
| 환산 | **테더맥스는 환산하지 않습니다.** Aster가 지급 시점에 계산한 USDT 환산값(`usdtValue`)만 사용합니다. 원 자산과 금액은 감사용으로만 보관하고, `usdtValue`가 없는 레코드는 거부합니다 |
| **바인딩** | **기본 365일** (`bindExpireTime`) |
| 만료 30일 전 | Aster가 웹훅 발송. `Referral expires on {date}` 표시 + 사용자 1회 알림 |
| 만료 시 | 상태를 `Referral expired`로 변경. 주소·이력·만료 전 금액은 유지되고 Aster에서 출금 가능. **만료 이후 날짜의 레코드는 표시·합산하지 않고 검토 대기로 보내 Aster에 보고** |
| 갱신 | 재바인딩 시 새 바인딩 시각부터 다시 활성. **만료~갱신 사이 거래는 귀속되지 않습니다** |

> **중요:** 갱신 방식(R13)이 확정되지 않으면 **1년 후 Aster 사용자 전원의 캐시백이 중단**됩니다.

### 3-3. 데이터 지연 처리

파트너 데이터가 기준 시간 안에 갱신되지 않으면 **마지막 수신 금액과 수신 시각**을 함께 표시합니다. 0으로 표시하거나 비워 두지 않습니다.

| DEX | 지연 판정 기준 (제안 단계) |
|---|---|
| Lighter | 월요일 23:59 UTC까지 CSV 미도착, 또는 폴링 실패 지속 |
| ApeX | 2시간 (정산 2회분) |
| EdgeX | 03:00 UTC까지 전일 레코드 미도착, 또는 읽기 실패 2시간 |
| Aster | 정산 다음 날 11:00 UTC, 또는 읽기 실패 2시간 |

표시 문구: `{DEX} data is delayed` / `Last updated {date, time}`

### 3-4. CEX 적립과 달라지는 점

| CEX | DEX |
|---|---|
| 매일 11:00~12:00 UTC 단일 배치 | **DEX마다 주기가 다릅니다** (주간 / 일간 / 시간당) |
| `캐시백 = 총 커미션 × (1 - 마진율)` | DEX가 산정한 금액을 그대로 받습니다 |
| USDT 단일 | USDC·USDT·수수료 자산 혼재. 표시는 USDT로 통일 |
| USDT 선물 페어만 | DEX별 적립 대상이 다릅니다 (Lighter는 선물·현물 포함) |
| 테더맥스 잔액에 반영 | **사용자의 DEX 계정에 이미 들어가 있습니다.** 테더맥스는 그 사실을 표시만 합니다 |

---

## 4. 출금 플로우

### 4-1. 핵심 — 테더맥스에서 출금하지 않습니다

DEX 캐시백은 이미 사용자의 DEX 계정에 들어가 있습니다. 테더맥스는 사용자를 DEX로 보내기만 합니다.

### 4-2. 회원 출금 플로우

1. 회원이 Withdraw를 엽니다
2. 드로어 상단에 `Total Cashback Earned`가 **하나의 USDT 금액**으로 표시됩니다 (USDC는 1:1 합산)
3. 연동한 DEX 지갑마다 카드 1개가 표시됩니다. 각 카드에 금액과 `Withdraw on {DEX}` 버튼
4. `Withdraw on {DEX}` 선택
5. 리다이렉트 다이얼로그가 열립니다

   | 행 | 내용 |
   |---|---|
   | DEX | 거래소명 |
   | Wallet | 생략된 지갑 주소 |
   | Exchange Cashback | 금액 (USDT) |

   액션: `Cancel` / `Go to {DEX}`
   각주: `You'll be taken to your {DEX page} ({deep link}) in a new tab. Connect the same wallet there to withdraw your cashback. TetherMax will never ask you to connect or sign with your wallet.`
6. `Go to {DEX}` 선택 → DEX의 리워드 페이지가 **새 탭**으로 열립니다
7. 테더맥스에 토스트 표시: `{DEX page} opened in a new tab`. **출금 드로어는 뒤에 그대로 열려 있습니다**
8. 사용자가 DEX에서 같은 지갑을 연결해 출금합니다
9. 테더맥스 탭으로 돌아오면 드로어가 금액을 다시 조회하고 `Back from {DEX}?` 안내를 표시합니다

**새 탭이 차단된 경우** 다이얼로그가 닫히지 않고 경고를 표시합니다.
- 제목: `Your browser blocked the new tab`
- 본문: `Allow pop-ups for TetherMax, or select "Open {DEX}" to open it now.`
- 주요 버튼이 `Open {DEX}`로 변경됩니다. 직접 클릭이므로 브라우저가 허용합니다

### 4-3. 비회원 출금 플로우

비회원도 동일합니다. 차이는 아래뿐입니다.
- 이벤트 리워드가 없으므로 해당 행이 표시되지 않습니다
- 로그인·이메일 인증·캡차를 요구하지 않습니다
- `Join TetherMax to see all your cashback in one place.` 가입 안내 배너가 표시됩니다

### 4-4. 중요한 표시 규칙

**적립액은 출금해도 줄지 않습니다.** 테더맥스는 DEX에서 일어난 출금을 볼 수 없습니다. 금액은 DEX의 다음 데이터 갱신 때만 바뀝니다.

`Back from {DEX}?` 안내 문구가 이것을 설명합니다.
> `If you withdrew on {DEX}, it can take a few minutes for the latest figures to show here. Exchange Cashback is what you have earned, so it doesn't go down when you withdraw.`

> **검토 필요:** 파트너 정정 레코드가 들어오면 적립액이 **줄어들 수 있습니다.** 위 문구는 "출금으로는 줄지 않는다"로 한정해야 정확합니다.

### 4-5. 영 금액 및 오류 상태

| 상태 | 처리 |
|---|---|
| 로딩 중 | 스켈레톤 표시. 금액과 액션 모두 표시하지 않음 |
| 캐시백 0 (피드 정상) | `0.00 USDT` + 칩 + `Withdraw on {DEX}` 비활성 + 배너 `No exchange cashback yet. Cashback appears here after you trade on your linked DEX.` |
| 데이터 지연 | 마지막 금액 + `Last updated {time} UTC` |
| 조회 실패 | `We can't load your {DEX} cashback right now.` + `Try again`. **다른 카드는 정상 표시하고 `Withdraw on {DEX}`는 유지합니다** (버튼이 DEX를 열기만 하므로) |
| 딥링크 미설정 | `Withdraw on {DEX}` 버튼을 표시하지 않음 |

### 4-6. CEX 출금과 달라지는 점

**DEX에서 완전히 사라지는 것**
- 출금 신청 자체
- 최소 출금액 (CEX는 UID당 매칭액 10 USDT)
- 매칭 공식 `캐시백 + min(이벤트 리워드, 캐시백)`
- 캡차, Google OTP, 이메일 2차 인증
- 자산 선차감과 실패 시 환불
- 비밀번호 변경 후 72시간 출금 차단
- 출금 이메일 인증 10회 실패 시 24시간 차단
- 수동 출금 거래소의 운영자 승인·거부
- 테더맥스 파트너 계정의 USDT 유동성 관리
- 출금 성공·실패 알림

**DEX에 새로 생기는 것**
- 리다이렉트 다이얼로그와 새 탭 열기
- 새 탭 차단 시 대체 경로
- 복귀 시 금액 재조회
- DEX별 딥링크 관리

---

## 5. 지갑 소유권 분쟁 — 🚫 **이번 범위에서 보류 (A-16)**

> **2026-10-20 확정 (A-16).** DEX의 UID 소유권 신청은 **이번 릴리스 범위에서 제외합니다.** 할지 말지는 펜딩입니다.
>
> 아래 5-1~5-5는 **DEX PRD(`OWN-1`~`OWN-8`)를 정리한 것으로, 현행 설계가 아닙니다.** 소유권을 다시 도입할 때의 출발점으로 남겨 둡니다.
>
> **대체 경로:** 지갑 중복은 **고객센터가 처리**합니다. `Wallet Already in Use`의 주 액션은 `Contact Support`입니다 (아래 2-8 참조).
>
> **함께 소멸하는 것:** 30일 쿨다운, 화면 녹화 3단계 가이드, 백오피스 클레임 심사 큐, `EDC-26` 16:9 가이드 이미지 3장, 지갑 한도의 "소유권으로 잃으면 자리 반환".

### 5-1. 발생 조건

사용자가 **다른 테더맥스 계정에 이미 연동된 지갑 주소**를 입력하면 `Wallet Already in Use`가 표시되고, 본인 지갑이라고 주장하는 사용자는 소유권 클레임을 시작할 수 있습니다.

**30일 쿨다운:** 최근 30일 안에 다른 사용자가 해당 지갑을 인증했다면 `Ownership Claim Unavailable`이 표시되고 플로우가 중단됩니다.
> `This wallet address was recently verified by another user. Ownership claims will be available after 30 days.`

### 5-2. 증빙 — 화면 녹화 3단계

**모든 녹화는 DEX에서 이루어집니다. 테더맥스는 어느 단계에서도 지갑에 연결하지 않습니다.**

| 단계 | 제목 | 내용 |
|---|---|---|
| 1 / 3 | `Start recording, then disconnect your wallet` | 화면 녹화를 시작하고 DEX를 열어 우상단 계정 메뉴에서 지갑 연결을 해제 |
| 2 / 3 | `Log back in with the same wallet` | 녹화를 유지한 채 같은 지갑을 DEX에 다시 연결. **지갑 연결·승인 화면이 보여야 합니다** |
| 3 / 3 | `Show your full wallet address` | 계정 메뉴를 열어 전체 지갑 주소를 화면에 표시. **모든 문자가 명확히 보여야** 합니다 |

가이드 이미지는 DEX별로 백오피스에서 작성합니다.

### 5-3. 업로드와 심사

| 항목 | 규칙 |
|---|---|
| 파일 | MP4 또는 MOV, 최대 100MB |
| 안내 | `Most claims are reviewed within 5 minutes. You'll be notified as soon as a decision is made.` |
| 경고 | `Some events may be restricted during the claim period. Existing coupons cannot be transferred.` |
| 제출 확인 | `Submit this claim?` 다이얼로그. `This action cannot be undone after submission.` |
| 심사 | 백오피스 큐에서 운영자가 녹화를 재생하고 승인 또는 거부 (사유 필수) |
| 보안 | 바이러스 검사 후 비공개 저장. 분석 이벤트나 URL에 넣지 않습니다. 모든 결정에 담당자를 기록합니다 |

### 5-4. 결과

| 결과 | 처리 |
|---|---|
| 진행 중 | 홈에 `Ownership verification in progress` + 경과 시간. 금액은 `-` |
| 승인 | `Ownership Verification Complete`. 지갑이 청구자에게 이전되고 금액이 표시됩니다 |
| 거부 | 행에 `Ownership verification was unsuccessful. Please try again.` + 다이얼로그 |
| 이전 보유자 | 행에 `This wallet has been unlinked. Tap to verify ownership and reclaim it.` 표시. `Remove Wallet` 또는 `Submit Wallet Ownership` 선택 (30일 쿨다운 적용) |

### 5-5. CEX와 달라지는 점

- 가이드가 **2단계에서 3단계**로 늘어납니다
- UID를 보여주는 것이 아니라 **지갑에 대한 통제권을 증명**합니다
- 모든 문구가 UID 대신 wallet 기준입니다
- **30일 쿨다운이 추가**됩니다

> **참고:** DEX는 지갑 서명으로 소유를 증명하는 방법(sign message)이 기술적으로 더 강력합니다. 다만 "지갑 연결·서명을 절대 요구하지 않는다"는 원칙 때문에 채택하지 않았습니다. 이 원칙과 증빙 강도의 균형은 재검토 여지가 있습니다.

---

## 6. 비회원 캐시백 조회

### 6-1. 플로우

1. 비회원이 조회 페이지에 진입합니다
   - 제목: `Get your cashback, no sign-up needed`
   - 리드: `Just link your exchange UID or DEX wallet address to claim the fees you've already paid.`
2. 거래소를 선택합니다 (연동 플로우와 같은 선택기)
3. 지갑 주소를 붙여넣습니다
   - 헬퍼: `Paste the wallet address you use on {DEX}. No wallet connection or signature required.`
4. `Claim cashback` 선택
5. GEETEST 캡차
6. 검사 순서
   1. 이 주소가 회원 계정에 연동되어 있는가
   2. DEX가 테더맥스 레퍼럴로 보고하는가
7. 성공 시 비회원 My Cashback 화면이 열립니다

### 6-2. 결과 다이얼로그

| 상태 | 문구 | 액션 |
|---|---|---|
| 회원 계정에 연동됨 | `This wallet address is already linked to a TetherMax member account. Log in to see its cashback.` **금액을 표시하지 않습니다** | Log In, Close |
| 레퍼럴 아님 | `Only wallets that joined {DEX} through TetherMax's referral link can claim cashback here. Join {DEX} through TetherMax to start earning.` | Join {DEX}, Close |
| 시도 한도 초과 | `Too many attempts. Please wait a few minutes and try again.` | Close, Contact Support |
| ~~Lighter 확인 중~~ | ~~`Lighter confirms new referrals once a week...`~~ **A-07로 삭제. 즉시 확인됩니다.** 마스킹 2건 이상 충돌 시에만 별도 문구 필요 | Close, Contact Support |
| 기타 오류 | `We couldn't check this wallet right now. Please try again in a few minutes.` | Try Again, Contact Support |

**비회원에게는 알림을 보내지 않습니다.** 다이얼로그에서 다시 확인하라고 안내합니다.

### 6-3. 회원 가입 시 이관

비회원이 가입한 뒤 같은 지갑을 연동하면 비회원 조회 기록과 이력이 회원 계정으로 이관됩니다. 이후 그 지갑에 대한 비회원 조회는 로그인을 요구합니다.

> **검토 필요:** 캡차만 통과하면 타인의 지갑 주소로 적립액과 이력을 조회할 수 있습니다. 회원 간 중복은 화면 녹화 분쟁 절차가 있으나 비회원 경로에는 없습니다. 또한 이관이 소유권 검증 없이 일어납니다.

---

## 7. CEX → DEX 변경점 종합

| 영역 | CEX (현행) | DEX | 성격 |
|---|---|---|---|
| 식별자 | UID 문자열 | 지갑 주소 + DEX 계정 ID | **대체** |
| 귀속 확인 | 파트너 API로 레퍼럴 하위 조회 | DEX별로 다름. Lighter는 마스킹 대조 | **대체** |
| 연동 한도 | `노출·연동 가능 거래소 수 × 3` | `3 × 활성 DEX 수`, 풀링 | **별도 체계** |
| 소유권 증빙 | 화면 녹화 2단계 (UID 표시) | **없음 — 고객센터 경로로 대체** | **보류 (A-16)** |
| 적립 주기 | 매일 11:00~12:00 UTC | DEX마다 다름 (주간/일간/시간당) | **대체** |
| 적립 계산 | `커미션 × (1 - 마진율)` | DEX 산정값 수신 | **대체** |
| 통화 | USDT | USDC·USDT·수수료 자산 → USDT 표시 | **확장** |
| 캐시백 보유 | 테더맥스 | **사용자의 DEX 계정** | **근본적 변경** |
| 출금 신청 | 있음 | **없음** | **소멸** |
| 최소 출금액 | UID당 매칭액 10 USDT | **없음** | **소멸** |
| 매칭 공식 | `캐시백 + min(이벤트 리워드, 캐시백)` | **없음** | **소멸** |
| 2차 인증 | 캡차 + OTP/이메일 | **없음** | **소멸** |
| 선차감·환불 | 있음 | **없음** | **소멸** |
| 출금 제한 (72h/24h) | 있음 | **없음** | **소멸** |
| 수동 출금 운영 | OKX·HTX 운영자 전송 | **없음** | **소멸** |
| 파트너 유동성 관리 | 필요 | **불필요** | **소멸** |
| 이벤트 리워드 | 있음 | **없음** | **소멸** |
| 초대 리워드 | 있음 | **없음** | **소멸** |
| 출금 알림 | 성공·실패 필수 푸시 | **해당 없음** → 재정의 필요 | **대체** |
| 리다이렉트 | 없음 | **새 탭 + 차단 대응 + 복귀 재조회** | **신규** |
| 바인딩 만료 | 없음 | **Aster 365일** | **신규** |
| 계정 등급 제약 | 없음 | **Lighter Standard는 캐시백 0** | **신규** |

**출금 블록 전체가 DEX에서 소멸합니다.** 문서 구조상 이 블록을 "CEX 전용"으로 명확히 라벨링하는 것이 중요합니다.

---