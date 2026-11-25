# 기존 PRD 6종 분석 — DEX 연동 관점

작성일: 2026-10-21
대상 문서: MAX-8, MAX-10, MAX-18, MAX-30, MAX-431, MAX-466

> 이 문서는 기존에 확정된 6개 PRD를 DEX 연동 관점에서 읽고,
> **DEX 작업에 직접 영향을 주는 것만** 추려낸 내부 분석 문서입니다.
> 거래소에 보내는 산출물이 아닙니다.

---

## 0. 읽은 문서

| Jira | 제목 | 상태 | DRI | 분량 |
|---|---|---|---|---:|
| MAX-18 | Withdrawal Policy Adjustment | IN PROGRESS | Matthew | 5,905줄 |
| MAX-466 | Benefits Page PRD | IN PROGRESS | Kyle Choi | 6,882줄 |
| MAX-431 | Improved ownership verification | IN PROGRESS | Matthew | 2,844줄 |
| MAX-8 | Global League | **IN REVIEW** | Matthew | 2,649줄 |
| MAX-30 | UID linking | IN PROGRESS | Kyle Choi / Matthew | 1,579줄 |
| MAX-10 | Global League backoffice | IN PROGRESS | Matthew | 1,032줄 |

---

## 1. ★ 가장 중요 — 출금 공식이 바뀝니다 (MAX-18)

### 1-1. 매칭 출금 (Matched Withdrawal)

```
실제 출금액 = A + MIN(B, A)
   A = 페이백 (거래 수수료 기반)
   B = 이벤트 리워드

Eligible 조건 = A + MIN(B, A) ≥ 10 USDT     ※ UID 단위로 판정
소수점       = 2자리, 3자리에서 버림 (floor)
```

**이벤트 리워드는 페이백 금액을 절대 초과할 수 없습니다.**

| # | A (페이백) | B (이벤트) | 실제 출금 | Eligible | 설명 |
|---:|---:|---:|---|:--:|---|
| 1 | 5 | 5 | 5 + 5 = 10 | ✅ | 표준 1:1 매칭 |
| 2 | 2 | 8 | 2 + 2 = 4 | ❌ | 매칭 후에도 임계 미달 |
| 3 | 10 | 0 | 10 + 0 = 10 | ✅ | 페이백 단독으로 충족 |
| 4 | **0** | 50 | 0 + 0 = **0** | ❌ | **페이백 0이면 출금 불가** |
| 5 | 6 | 4 | 6 + 4 = 10 | ✅ | 리워드 < 페이백이면 전액 |
| 6 | 7 | 100 | 7 + 7 = 14 | ✅ | 리워드가 페이백만큼만 |
| 7 | 100 | 7 | 100 + 7 = 107 | ✅ | 페이백 우세 |
| 8 | 4.5 | 4.5 | 4.5 + 4.5 = 9 | ❌ | 완전 매칭이나 10 미달 |
| 9 | 5.5 | 4.5 | 5.5 + 4.5 = 10 | ✅ | 턱걸이 통과 |
| 10 | 9.5 | 0.4 | 9.9 | ❌ | 소수점 차이로 미달 |

**도입 배경 (PRD 원문):**
> *"Increasing cases of users cherry-picking event rewards without generating real trades, weakening the platform's trading incentive"*

→ 이벤트 리워드만 빼가는 어뷰징을 막는 장치입니다.

### 1-2. DEX에 미치는 영향

| 시나리오 | 결과 |
|---|---|
| DEX에 이벤트 리워드 **미적용** (B=0) | 출금액 = A. 페이백 10 USDT 이상 필요. 디자이너 DW1 카드(`Exchange Cashback` 행만)가 **정확** |
| DEX에 이벤트 리워드 **적용** | DW1 카드에 `Event Reward` 행 추가 필요. 단 `Available Cashback = A + MIN(B,A)` 로 표기 |

**핵심 제약:** V2에서 이벤트 리워드를 DEX에 적용하더라도,
**DEX 페이백이 0이면 이벤트 리워드도 출금할 수 없습니다.**
(표 #4 케이스) 이 제약을 사용자 안내 문구에 반영해야 합니다.

### 1-3. 기존 기록 정정

제가 Figma에서 확인해 기록한 공식:
```
Available Cashback = Exchange Cashback + Event Reward    ← 오류
```
실제:
```
Available Cashback = A + MIN(B, A)                        ← 정정
```
화면이 단순 합산처럼 보였던 것은 예시 데이터에서 B ≤ A 였기 때문으로 보입니다.

### 1-4. 그 외 확정 사항

**Pending 상태**
```
REQUEST → WAIT → PROCESSING → REVIEW     (내부 4단계)
         ↓
    사용자에게는 "Pending" 하나로만 표시
```
- 자산은 **REQUEST 즉시 선차감**, Balance에 즉시 반영
- API 실패 시 **자동 환원 (Refund)**

**인증 플로우 (회원)**
```
출금 목록 → Confirm Withdraw → Confirm 모달
   → 슬라이드 퍼즐 CAPTCHA
   → OTP (등록자) 또는 이메일 6자리 (미등록자)
   → Success → (Share) → Completion 바텀시트
```
- 이메일 인증: **10회 실패 → 24시간 잠금**, 코드 유효 10분, 재발송 쿨다운 60초
- OTP: **무제한 재시도**, 쿨다운 없음
- 실패 시 입력값 **유지** (기존엔 초기화했음 — 변경점)

**인증 플로우 (비회원)**
```
UID 검색 → UID 상세 → Withdraw → Confirm 모달
   → 슬라이드 퍼즐 CAPTCHA → 즉시 제출
```
- **OTP/이메일 인증 없음**
- **단일 UID만**, `+N` 표시 없음
- 완료 알림 수단 없음 (Open Question #10, 미해결)

**UID 카드 상태**
| 조건 | 표시 |
|---|---|
| A + MIN(B,A) ≥ 10 | `Available` 뱃지 (초록) |
| A + MIN(B,A) < 10 | `Inactive` 뱃지 (회색) + 카드 dimmed + 상호작용 차단 |
| 전체 Inactive | `Not eligible to withdraw` 뱃지 + Confirm 버튼 비활성 |

**17단계 마일스톤**
| Tier | USDT | 보상 | | Tier | USDT | 보상 |
|---:|---:|---|---|---:|---:|---|
| 1 | 100 | TradingView 구독 | | 10 | 2,000 | 게이밍 PC |
| 2 | 200 | 기계식 키보드 | | 11 | 5,000 | 오토바이 |
| 3 | 300 | 닌텐도 스위치 | | 12 | 10,000 | 오메가 시계 |
| 4 | 400 | PlayStation 5 | | 13 | 15,000 | 롤렉스 서브마리너 |
| 5 | 500 | 소니 카메라 | | 14 | 20,000 | 명품 핸드백 |
| 6 | 600 | 4K 모니터 | | 15 | 30,000 | 여행 패키지 |
| 7 | 800 | 아이폰 | | 16 | 40,000 | 테슬라 모델 3 |
| 8 | 1,000 | iPad Pro | | 17 | 50,000 | 슈퍼카 |
| 9 | 1,200 | MacBook Air | | | | |

- `achieved_tier` = 0 (100 미만) ~ 17
- 진행률 = `amount / achieved_threshold × 100%` (최종 티어는 100% 초과 가능)
- 스타일 플래그 2종: `standard` (< 10K) / `vip` (≥ 10K)
- DW1 모달의 `First Milestone ≈ TradingView Subscription (100 USDT)` 가 Tier 1

**계정 삭제 연동**
- Available Cashback ≥ 10 USDT인 UID가 하나라도 있으면 **계정 삭제 차단**
- 10 USDT 미만 UID의 이벤트 리워드는 **소멸** → 동의 체크박스 필수

**Completion 바텀시트**
- `You received [total] USDT` + `[페이백] + [이벤트 리워드] USDT` 분해 표시
- **QR 코드** (레퍼럴 가입 링크, 초대코드 자동 적용). 초대코드 없으면 `Generate Invite Code` 버튼
- Download (이미지 저장) / Share (네이티브 공유 시트)

**초대 리워드는 범위 밖**
> *"Invite reward withdrawals are not included in this change and will retain existing policy and logic"*

---

## 2. UID 연동 (MAX-30)

### 2-1. ★ DEX 지갑 주소와 충돌하는 입력 규칙

QA 케이스 QA50~QA64에 명시:

| 입력 | 결과 |
|---|---|
| `a` | **`A`** — 자동 대문자 변환 |
| `abc123XYZ` | **`ABC123XYZ`** |
| `!` `@#$%^&*()` 공백 `,` `.` `/` `;` `'` | **차단** |
| 붙여넣기 `xyz!@#456` | `XYZ456` (특수문자 제거 + 대문자화) |

**문제:** EVM 지갑 주소는 EIP-55 체크섬이 **대소문자 혼용**입니다.

```
입력:  0x7a3F9c2B41dE8806f5A1b3C9e4D2F07a6B8c51E9
결과:  0X7A3F9C2B41DE8806F5A1B3C9E4D2F07A6B8C51E9   ← 체크섬 파괴
```

**필요 조치:** DEX 지갑 주소 입력은 **별도 검증 규칙 분기**
- 대소문자 보존
- `0x` prefix 허용 (소문자 x)
- 42자 고정
- hex 문자만 (`0-9a-fA-F`)

이는 "화면 추가"가 아니라 **입력 컴포넌트 레벨의 분기**입니다.

### 2-2. 에러 코드 7종

| 코드 | 모달 제목 | 메시지 | Primary CTA | Secondary |
|---|---|---|---|---|
| `FAILED_NOT_FOUND_UID` | Unable to Link UID | Only accounts registered with the TetherMax referral code can be linked | Close | Contact Support |
| `FAILED_ALREADY_INTEGRATION` | UID Already in Use | This UID is already linked to another account | **Ownership Verify** | Contact Support |
| `FAILED_MY_INTEGRATION` | You've Already Added This UID | 추가 조치 불필요 | Close | — |
| `INTEGRATION_MAX_COUNT_OVER` | You've reached your UID limit | 기존 UID 삭제 후 추가 | Manage UIDs | Cancel |
| `FAILED_ISSUE_UID` | Unable to Link UID | 고객센터 문의 | Contact Support | — |
| **`FAILED_NEED_RECEIVE`** | **Unable to Link UID Yet** | **누적 페이백을 먼저 출금하세요** (미수령 ≥ 100 USD) | **Withdraw** | Contact Support |
| `FAILED_RECENT_POSSESSION` | Verification Limit Reached | 최근 소유 확인 이력 있음 | Close | Contact Support |

**추가 상태:** `Processing Your UID` (수동 처리 대기)

### 2-3. ★ `FAILED_NEED_RECEIVE` ↔ ApeX 리스크

미수령 페이백이 **100 USD 이상**이면 연동 자체가 차단됩니다.
ApeX의 "기존 미수령 잔액" 리스크와 정확히 맞물리는 지점입니다.
→ `02_데이터_확보_매트릭스`의 ApeX 질문에 이 조건을 추가해야 합니다.

### 2-4. 연동 성공 화면 = 정산 주기 안내

```
┌───────────────────────────────┐
│ ✓ UID linking completed       │
│   {거래소명} / {UID}           │
├───────────────────────────────┤
│ ⬤ Lighter   [Daily settlement]│
│   Next settlement: Thu, Mar 19│
│   Settlement time: 21:00 GMT+9│  ← update_time(UTC) → 로컬 변환
└───────────────────────────────┘
   [ Home ]
```

- `update_time` 은 **기존 거래소 어드민에 이미 존재하는 필드**
- `GET /ttmax/exchange/get-exchange-list` 응답에 **노출만** 하면 됨
- 변환: `Intl.DateTimeFormat().resolvedOptions().timeZone`

**DEX 적용 시 문제:** Lighter는 **주 1회(월요일)** 정산이라 `Daily settlement` 뱃지가 맞지 않습니다.
→ **정산 주기 뱃지에 `Weekly` 추가 필요**

| 거래소 | 정산 주기 | 필요 뱃지 |
|---|---|---|
| Lighter | 주 1회 (월) | **Weekly** |
| ApeX | 시간당 | Hourly 또는 Daily |
| EdgeX | 일 1회 00:00 UTC | Daily |
| Aster | 00:00 산정 / 09:00 공개 | Daily (시각 주의) |

### 2-5. API 응답 필드

`GET /ttmax/exchange/get-exchange-list?imageType=ICON`

| 필드 | 용도 |
|---|---|
| `exchangeNo` | 식별자 |
| `name` | 거래소명 |
| `logo_url` | 로고 |
| `cashback_rate` | 페이백 요율 |
| `referral_sign_up_url` | 레퍼럴 가입 링크 |
| **`update_time`** (UTC) | 정산 시각 — **신규 노출** |
| `brand_color_hex` | 카드 배경색 (없으면 기본색) |
| `total_savings_rate` | `XX% Total Savings` 표시 (없으면 숨김/N/A) |
| `is_featured` | Top Partner Exchanges 섹션 노출 여부 |

### 2-6. 거래소 선택 모달 구조

```
Select an exchange                              [X]
🔍 Search for an exchange
─────────────────────────────────────
Top Partner Exchanges        ← is_featured=true, 원형 아이콘 가로 배열
  (○) (○) (○) (○)
─────────────────────────────────────
All Exchanges (N)            ← 3열 그리드, 사각 카드
  [로고 / 이름 / XX% Total Savings]
  배경색 = brand_color_hex
```
검색 시: `Top Partner Exchanges` 숨김 + 헤더가 `Search Results (N)` 으로 변경

---

## 3. 소유 확인 (MAX-431)

Figma에서 확인한 O0~O16의 원본 PRD입니다.

### 3-1. ★ 30일 Ownership Cooldown

> 소유 확인이 **승인**되면, 해당 UID에 대해 **30일간 누구도 새 신청 불가**.
> 차단 시 모달에 **해제일 (D-n)** 표시.

### 3-2. ★ 자동 실패 10분 + 폴링 6회

```
제출 ─┬─ 2분 ─┬─ 4분 ─┬─ 7분 ─┬─ 8분 ─┬─ 9분 ─┬─ 10분
      │       │       │       │       │       │
   (조기 응답 감지)      (1분 간격 타임아웃까지)
                                              ↓
                                   어드민 무응답 → 자동 실패

※ 사용자가 수동 새로고침 시 즉시 API 호출
```

**변경 전 → 후**
| 항목 | 기존 | 변경 |
|---|---|---|
| 자동 실패 타임아웃 | 15분 | **10분** |
| API 호출 | 5분 간격 | **2, 4, 7, 8, 9, 10분 고정 6회** |

**→ "5분 내 심사"는 평균 안내 문구이고, 실제 데드라인은 10분입니다.**
10분 초과 시 사용자에게 **사유 없이** "실패"로 표시됩니다.

### 3-3. ★ 백오피스 신규 섹션

> **`Exchange Guide → UID Ownership Verification`**
> 거래소별 **모바일/PC 슬라이드**를 각각 등록·관리.
> 슬라이드 1장 = **제목 + 이미지 + 설명 텍스트**
> 2장 이상 → dot indicator 자동 표시. 실시간 반영.

**DEX 제작 물량:**
```
4개 DEX × 2 디바이스(모바일/PC) × N 슬라이드 = 최소 8세트
각 세트 = 제목 + 이미지 + 설명 텍스트
```
기존 YouTube 가이드 영상은 **제거**됩니다.

※ 이 백오피스 섹션은 DEX 때문에 생긴 게 아니라, **CEX용으로도 신규**입니다.

### 3-4. 상태 17종

| 그룹 | 화면 |
|---|---|
| **A · 진입** | O0 홈·다른 지갑 연동 / O1 이미 사용중 / O2 신청 불가 |
| **B · 신청 페이지** | O3 가이드 1단계 / O4 2단계 / O5 3단계 / O6 업로드중 / O7 업로드 완료 / O8 업로드 실패 / O9 서버 오류 / O10 제출 확인 |
| **C · 제출 후 홈** | O11 심사중 / O12 승인 / O13 반려 / O14 타 신청으로 해제 / O15 재신청 / O16 재신청 반려(사유) |

**업로드 실패 4종 구분:**
| 유형 | 문구 | 버튼 |
|---|---|---|
| 형식 오류 | Only MP4 or MOV files are supported. | (토스트, 클라이언트 검증) |
| 용량 초과 | File size must be 100MB or less. | (토스트, 클라이언트 검증) |
| 네트워크 | Upload failed. Please check your connection and try again. | Try again / Cancel |
| 서버 (5xx) | Something went wrong. Please try again later. | Try again / Contact Support / Cancel |

※ 네트워크 실패 시 **파일 재첨부 불필요** (메모리 보존)

### 3-5. 상태 표시 규칙

| 상태 | 점 색 | 인라인 배너 | 페이백 금액 |
|---|---|---|---|
| 심사중 | 파랑 (1.4s 펄스) | — (타이머 제거됨) | `–` |
| 승인 | — | — | 정상 |
| 실패/타임아웃 | **빨강** | `Ownership verification failed · Tap to retry` | `–` |
| 타 신청으로 해제 | **호박색** | `Unlinked by ownership claim — Tap to reclaim` | — |

### 3-6. 알림 3종

| 대상 | 트리거 | 문구 |
|---|---|---|
| 신청자 | 승인 | Your ownership claim has been approved. [Exchange] UID [번호] is now linked to your account. |
| 신청자 | 반려 | Your ownership claim was not approved. Please try again with a clearer screen recording. |
| **피해제자** | 타인 승인 | Your [Exchange] UID [번호] has been unlinked. Another user has claimed ownership. Tap to reclaim. |

푸시 + 이메일 동시 발송. 발송 로직은 **변경 없음**, 문구만 영문 톤으로 교체.

### 3-7. 결과 모달 표시 조건

> 결과 모달은 **홈 화면에 있을 때만** 표시.
> 다른 페이지에 있으면 **푸시로만** 알림.

반려 사유는 **모달에 표시하지 않음**. UID 상세의 `View reason` 링크에서만 공개.
자동 타임아웃은 사유 없음 → `No reason provided`.

재신청 **횟수 제한 없음** (Out of Scope에 명시).

---

## 4. 글로벌리그 (MAX-8 / MAX-10)

### 4-1. ★ 점수 = 커미션 페이백만

> **Out of scope: Event rewards and invite rewards are excluded.**
> `1 USDT (commission cashback) = 1 point`

→ **이벤트·초대 리워드는 점수에서 제외.** 순수 커미션 페이백만 점수화.
→ DEX는 커미션 100%를 테더맥스가 수신하므로 **금액 산출 가능 → 리그 성립**
→ **`volume` 데이터 불필요** (기존 재판정에서 "조건부"로 둔 것을 "O"로 수정)

### 4-2. P0~P6 6단계

| 단계 | 명칭 | 내용 |
|---|---|---|
| P0 | Pre-launch | 페이지 공개, 사용자 액션 불가 |
| P1 | Early Bird | 팀 생성·가입·탈퇴. 이 기간 가입자는 P3 첫 3일 **+10% 점수** |
| P2 | Recruitment | 팀 생성·가입·탈퇴 |
| P3 | Competition | 점수 집계. **3명 이상 팀만** 참가 |
| P4 | Pending | 어드민이 어뷰징 TUID 수동 제외 |
| P5 | Results | 결과 공개, 제외자 표시 |
| P6 | Rewards | 이벤트 리워드로 상금 지급. **종료 후 페이지 삭제 → 404** |

- 각 단계 **최소 1일 ~ 최대 60일**
- 시작은 **00:00 UTC**
- `P1 end = P2 start` ... `P5 end = P6 start` 자동 연결, **단계 건너뛰기 불가**

### 4-3. 팀 생성 자격 (전부 AND)

| 조건 | 기준 |
|---|---|
| Affiliate | 테더맥스 어드민에서 인플루언서로 지정 |
| 누적 페이백 | 계정에 연동된 **모든 UID 합산 ≥ 500 USDT** |
| 최근 30일 페이백 | 모든 UID 합산 **≥ 100 USDT** |
| 국가 코드 | T1 / XX 아님 (마지막 접속 IP 기준) |
| 지난 시즌 기여도 | 팀장이었다면 **0점이 아닐 것** (위임받은 팀장은 예외) |

- 팀 생성 / 팀 가입 모두 **UTC 기준 1일 1회**
- 팀 최대 인원 **10,000명**
- 팀명 **2~20자**, 중복 불가 (공백 포함 완전일치)
- 팀 이미지 JPG/JPEG/PNG, **1MB 이하**, **시즌당 1회만 수정**
- 필수 동의 체크박스 4종

### 4-4. 참가 UID

- **리그 운영 거래소의 UID 1개** 지정 (필수)
- P1~P3 중 **변경 불가**
- 예외: 소유권 이전으로 연동 해제되면 재지정 허용
- 미연동 시 알림: `{exchange} UID must be linked to participate`

### 4-5. 상금 분배 (P5)

```
팀장 10% 선지급
나머지 90% = 기여도 비례
개인 보상 = (총상금 × 90%) × (내 점수 / 팀 총점)
소수점 3자리 버림, 2자리 표시
```
- 잔여 끝전은 **소멸** (재분배·이월·추가 보너스 없음)
- 어뷰징 제외자 금액도 **재분배 없음**, 순위는 **공석 유지** (하위 팀 승격 없음)
- 어뷰징 제외는 **TUID 단위**, 팀 단위 불가
- 지급 유형: `league prize` (My Cashback History에 표시)

### 4-6. 배치

| 작업 | 주기 |
|---|---|
| Dashboard Aggregator | **15분** |
| Participant information | 15분 |
| Ranking, Score Calculator | **매일 13:30 UTC** |
| Early Bird Bonus | P3 첫 3일 |
| Final Settlement | P4~P5 |

### 4-7. 어드민 (MAX-10)

**리그 생성 입력**
```
a. Title / b. Subtitle
c. 상단 배너 이미지 (모바일) / d. (PC)      ※ 5MB, WEBP, 슬라이더 없음, 1장씩
e. 순위별 상금 (표: 순위/상금/상금이미지, +/- 행 추가)
f. P0~P6 기간
g. OG 이미지 (한) / h. (영)                 ※ 5MB, WEBP
i. SEO 타이틀 (한 ≤35) / j. (영 ≤60)
k. SEO 설명 (한 ≤70) / l. (영 ≤140)
m. 운영 거래소 드롭다운 ← ★ DEX 4곳 추가 필요
```

**정책**
- 리그 여러 개 **동시 운영 가능**, 같은 거래소 **중복 허용**
- 리그 1개 = 거래소 1개 (1:1)
- 개인전 / 팀전 중 **하나만** 선택 (동시 운영하려면 리그 2개 생성)
- 생성 후 수정 가능: Title, Subtitle, 배너, OG, SEO **만**
- 권한: Master / Operator / PM
- LNB: `Points` 섹션 아래 `League` 추가

**P4 어뷰징 제외**
- P4 기간에만 버튼 활성
- TUID 단위 제외, 확인 모달: *"Excluding this user from the prize pool will not result in the prize pool being filled by another user"*
- 제외 완료 시 버튼 비활성 + 라벨 `Exclusion Complete`
- 별도 저장 버튼 없음 (P5 시작 시 자동 확정)
- **P4 시작 시 Slack 알림** `Global league result Manage Period`

**강제 종료**
- P0~P6 중 언제든 가능
- 확인 모달: *"Do you wish to delete the ongoing league?"*
- 진행 시점까지만 히스토리 저장

**팀 관리**
- 팀명 **LIKE 검색** (`A1B2` → `A1B2C3` 조회됨, `A1C3B2` 안 됨)
- 국가 변경 모달 (어드민만 가능, 사용자 불가)
- 팀 삭제 → 전원 참가 해제 + 점수 삭제, **복구 불가, 이력 미보존**
- 팀 삭제 당일 같은 리더는 재생성 불가 (UTC 기준)

**CSV**
- 1Depth: `golbal_league_history_{오늘날짜}.csv` ※ 원문 오타 `golbal` 유지
- 2Depth: `global_league_history_{시작일}_{종료일}.csv`

---

## 5. 혜택 페이지 (MAX-466)

### 5-1. 혜택 전체 목록 (Priority 순)

| P | 혜택명 (EN) | Amount Main | Amount Sub | CTA |
|---:|---|---|---|---|
| 5 | Sign up for the exchange | Extra | Cashback | Sign up |
| 7 | Today also quiz time | {price} | USDT MAX | Join |
| 8 | Only one time quiz | {price} | USDT | Join |
| 9 | Guess the bitcoin price | 1K | USDT MAX | Join |
| 10 | Achieve Cashback goal | 37 | USDT MAX | View |
| 11 | Achieve Cashback goal | 67 | USDT MAX | View |
| 12 | You referred to your friend | 10 | USDT MAX | Claim |
| 13 | It's your first time visiting our site | 5 | USDT MAX | Claim |
| 14 | **Turn on alarm** | 1 | USDT | Turn on → **웹은 `Download App`** |
| 15 | Calculate estimated cashback | 2 | USDT | Calculate |
| 16 | **Link your UID** | 3 | USDT | Link |
| 17 | **Claim your first cashback** | 10 | USDT | Claim |
| 18 | Join events | Extra | Profits | View |
| 19 | **Claim cashback monthly** | 100 | USDT MAX | Claim |
| 20 | Invite friends | Extra | Profits | Invite |
| — | **TetherMax Global League with {exchange}** | {total prize} | USDT | Join |

동적 변수 `{price}` `{exchange}` `{total prize}` 는 런타임 치환.
→ **DEX 리그를 열면 혜택 카드가 자동 생성됩니다.**

### 5-2. 탭 구조

```
[ Ongoing (N) ] [ Completed ]
```
- **Ongoing만 카운트 뱃지**, Completed는 뱃지 없음
- Special Benefits는 **양쪽 카운트에서 제외**
- Completable: 완료 시 Completed 탭으로 이동
- Non-completable (반복·추천): Ongoing에 **영구 잔류**
- 완료 카드는 **완료 당시 금액** 표시 (현재 어드민 설정값과 다를 수 있음)
- `NEW` 뱃지 **완전 제거**

**빈 상태**
| 대상 | 문구 | 버튼 |
|---|---|---|
| 게스트 | Become a member to access completed rewards | Sign up → `/signup` |
| 회원 (완료 0건) | No Completed Rewards Yet | Explore Ongoing Rewards → Ongoing 탭 |

### 5-3. 다국어 정책

> **KO/EN 2개만 관리.** 그 외 언어는 **EN fallback**.

DB 필드:
```
amountMainLabel_ko / _en    (필수)
amountSubLabel_ko  / _en    (선택, nullable)
title_ko / _en              (필수, 최대 100자)
subtitle_ko / _en           (필수, 최대 200자)
ctaLabel_ko / _en           (필수, 최대 30자) ← 신규
isSpecial (boolean) / specialSortOrder
```

**→ 제가 "언어팩 101 × 15언어 = 1,515건"으로 추산한 것을 수정해야 합니다.**
혜택 영역은 **KO/EN 2개**만 입력하고 나머지는 fallback입니다.
15언어가 필요한 영역과 KO/EN만 필요한 영역을 분리해야 합니다.

### 5-4. 상세 페이지

- URL: `/benefits/:benefitId`, **게스트도 접근 가능**
- 완료 시 히어로 위에 `Reward Received` 배너 + 금액, CTA는 `Completed` (비활성)
- **완료 타임스탬프는 표시하지 않음**
- 퀴즈 3종 (P7/8/9) 은 **이번 리디자인 범위 밖** — 기존 디자인 유지
- 라우팅·API 엔드포인트 **변경 없음**

### 5-5. 백오피스

```
1. Benefit Management     — CRUD, KO/EN 입력, 이미지 업로드, CTA 라우트 드롭다운
2. Special Benefits       — Special 토글, 드래그앤드롭 정렬, 미리보기 패널
3. Completion Logic       — 혜택별 완료 기준 에디터, completable 토글, 완료 통계
```
- CTA는 **사전 정의된 라우트만** (Phase 1에서 커스텀 URL 불가)
- Special 이미지: 필수(isSpecial=true 시), 5MB, PNG/JPG/WebP
- 혜택은 **수동 생성만** (자동 생성 없음)

---

## 6. 모든 PRD에 공통으로 박힌 정책

### 6-1. 로컬 타임 표시 (MAX-18 / 30 / 431 / 466 전부)

> 서버가 UTC로 반환하더라도 **프론트엔드가 디바이스 로컬 타임으로 변환해 표시**한다.
> 변환은 **클라이언트**에서 수행하며, 서버가 아니다.
> `Intl.DateTimeFormat().resolvedOptions().timeZone`
> 표시 예: `2026.05.12 14:35`
> 카운트다운 등 **상대 시간은 제외**.

**DEX 적용 대상:**
| 위치 | 현재 표기 | 조치 |
|---|---|---|
| DEX 갱신 안내 | D+1 00:00 UTC | 로컬 변환 (KST 기준 09:00) |
| ~~페이백 챌린지~~ | `daily at 13:00` | 🟢 **불필요해짐** — 챌린지 DEX 미반영 확정(10-22)으로 DEX 갱신 시각을 덮을 필요가 없습니다 |
| 리그 리더보드 | `Next Update: 13:30 UTC` | 로컬 변환 |
| 페이백 랭킹 | `updated daily at 00:01` | 로컬 변환 |
| 출금 신청 시각 | `26/07/2024 18:09:33` | 로컬 변환 |

### 6-2. ★ 시간당(hourly) 집계 저장 (MAX-431 / MAX-466)

> 일별 집계를 표시하는 모든 영역은 백엔드가 **1시간 단위로 저장**하고,
> 각 레코드에 **UTC 타임스탬프를 함께 포함**해야 한다.
> 클라이언트가 **사용자 로컬 날짜 기준으로 재집계**한다.
> 이유: "오늘"의 정의가 타임존마다 다르기 때문.

**→ DEX 원장 API 수신 데이터도 1시간 단위 보존이 필요합니다.**
현재 거래소 API 요청서에는 "D일 거래 → 24h 집계 → D+1 노출"로만 적혀 있어
**시간당 타임스탬프 보존 요건이 누락**되어 있습니다.

### 6-3. 모든 화면 다크/라이트 양쪽 필수 (MAX-431 명시)

---

## 7. 기존 문서에서 수정해야 할 것

| # | 대상 문서 | 기존 기록 | 수정 내용 |
|---|---|---|---|
| 1 | 3_연동_출금_플로우 | `Available = Exchange Cashback + Event Reward` | **`A + MIN(B, A)`**, 페이백 0이면 출금 0 |
| 2 | 4_백오피스_vs_하드코딩 | 언어팩 101 × 15언어 = 1,515건 | **KO/EN 영역과 15언어 영역 분리** |
| 3 | 5_부가서비스_연동가능여부 | 글로벌리그 = 조건부 (`volume` 의존) | **O 적용** (점수는 커미션 페이백 기준) |
| 4 | 5_부가서비스_연동가능여부 | UID 소유권 신청 = X | **O 적용** (영상 업로드, O0~O16) |
| 5 | 5_부가서비스_연동가능여부 | 초대 리워드 = O | **X 또는 보류** (MAX-18에서도 "제외" 명시) |
| 6 | 1_거래소_API_요청 | 일 단위 집계 | **시간당 타임스탬프 보존 추가** |
| 7 | 1_거래소_API_요청 | — | **`update_time` (정산 시각) 추가** |
| 8 | 2_화면_수정_필요 | DEX는 이벤트 리워드 숨김 | **표시** (CS3 `Event reward day`) |
| 9 | 02_데이터_확보_매트릭스 | ApeX 미수령 잔액 | **`FAILED_NEED_RECEIVE` 100 USD 조건 연결** |
| 10 | 03_정책_결정_기록 | 소유확인 미결정 | **확정: 영상 업로드 + 30일 쿨다운 + 10분 타임아웃** |

---

## 8. 새로 생긴 개발·제작 항목

| # | 항목 | 분류 | 비고 |
|---|---|---|---|
| 1 | **DEX 지갑 주소 전용 입력 검증** | 개발 | 대소문자 보존, 기존 UID 입력과 분기 |
| 2 | **정산 주기 뱃지 `Weekly` 추가** | 개발 | Lighter 주 1회 |
| 3 | **리그 어드민 거래소 드롭다운에 DEX 4곳** | 개발 | MAX-10 리그 생성 폼 |
| 4 | **백오피스 소유확인 가이드 슬라이드 등록** | 콘텐츠 | 4 DEX × 2 디바이스 × N 슬라이드 |
| 5 | **원장 데이터 시간당 저장** | 개발(BE) | 로컬 날짜 재집계용 |
| 6 | **DEX `update_time` 등록** | 운영 | 거래소 어드민 기존 필드 |

---

## 9. PRD 자체가 미해결인 것 (우리 결정과 무관)

| 출처 | 질문 | 상태 |
|---|---|---|
| MAX-18 OQ#5 | 다중 UID 출금 **처리 순서** | OPEN |
| MAX-18 OQ#6 | **부분 실패** 처리 (전부 환원 vs 부분 성공) | OPEN |
| MAX-18 OQ#2 | CAPTCHA 재시도 횟수 제한 | OPEN |
| MAX-18 OQ#10 | 비회원 출금 완료 **알림 수단 없음** | OPEN |
| MAX-466 OQ-2 | 혜택별 **완료 기준** 정의 | **개발 블로커** |
| MAX-466 OQ-4 | 동적 변수 source of truth | **개발 블로커** |
| MAX-466 OQ-8 | Total Event Rewards 집계 기간 | **개발 블로커** |

→ 이 중 **부분 실패 처리(OQ#6)** 는 DEX에서 더 심각합니다.
DEX는 온체인 전송이라 **실패 시 가스비가 이미 소진**되기 때문입니다.
