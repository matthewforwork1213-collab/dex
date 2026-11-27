# Figma(DEX(revision)) 수정 — 사용자 결정 기록

| 날짜 | 항목 | 결정 |
|---|---|---|
| 2026-11-26 | 출금 화면(`/withdrawal-apply` · `/withdrawal`) | **둔다** — 기존 출금 모달 디자인 기준, 버튼은 비활성 `Auto Claim`. 「독립 출금 화면 제외」 메모(28987:126383)·개발 인계 색인 FU-036 문구 정정. 출금 확인 다이얼로그는 쓰지 않음 |
| 2026-11-26 | 프로토타입·Figma 담당 | 이 세션(dex-d5). Figma는 기존 디자인 페이지를 근거로만 수정, 수정 전·후 캡처 보고 |

## 결정 항목 D1~D9 · N1~N19 (2026-11-26, 아래 외에는 설명서 권장안대로)

| # | 결정 |
|---|---|
| D1 | 권장안: Figma 문구 채택 + 명세 갱신(11-25 확정 결정과 다르면 결정 문구) |
| D2 | **`Withdrawn`** — 실제 출금된 금액이므로 Withdraw 계열. `Claim`은 출금을 시도·요청하는 동작에 쓴다(용어 기준: 결과/실적 = Withdraw, 요청/동작 = Claim) |
| D3 | **3탭**(`Special Events` · `Exclusive` · `Exchange Events`) — 세 가지 모두 나올 수 있음 |
| D4 | 허브가 CEX·DEX·Brokers를 다 포함하므로 `Cashback` 메뉴는 **Cashback Hub · Cashback Calculator**를 띄운다(3행 CEX/DEX/Brokers 패널 아님) |
| D5 | 권장안: Figma `Exchanges` · `Point` |
| D6 | **현행 유지** — 별도 순위표 페이지 없음(혜택 화면 랭킹 패널) |
| D7 | 설명 후 재확인(질문 대기) |
| D8 | **초대 리워드 최소 10 USDT로 확정·시행 중(회원·파트너 허브 모두)** — 10 USDT 넘으면 자동 출금 요청. 전 문서·화면을 10으로 |
| D9 | 권장안: `출금 가능 캐시백`(REQ-150) |
| N1 | 모바일 드로어 항목 이름은 **`Cashback Hub`**(D4와 같은 구성), 누르면 Cashback Hub로 이동 (2026-11-27) |
| N2 | 거래소 목록 `Rating` 열 **있어야 함** |
| N3 | 앱 업데이트 다이얼로그 **옛 스타일 유지** |
| N4 | A — 맥스보드 게스트·미참여 단계 화면 넣음 |
| N5 | 문구는 **Account로 통일**(UID/Wallet 대신). 시안은 권장안 B |
| N6 | 개인 리그에도 DEX 적용 |
| N7 | **Boost는 이번 범위 아님** |
| N8 | 실제처럼 고침(배지 = 실제 개수) |
| N9 | 첫 캐시백 상세 CTA **비활성 + Claim 계열로 전환** |
| N10 | UID가 아니라 **Account**로 |
| N11 | 이미 정해진 기능 — 그대로 둠 |
| N12 | KEY TAKEAWAYS를 **Account 기준**으로 교체(초안 작성은 이 세션) |
| N13 | **`No results found for {검색어}`**(기존 문구) — G-151 대체 |
| N14 | A |
| N15 | **B — 외부 링크 아이콘 유지** |
| N16·N17·N19 | **기존 Earning Timeline 디자인 그대로 사용**(예: `[MAX-7]` mWeb 9193:119755 — `Start Trading` · `Cut-off Time` · `Updated` 3단계). 새 4단계·캐러셀로 만들지 않음. UID 연동 상세도 기존 디자인 |
| N18 | 해당 없음 — 출금은 Auto Claim이라 제목 문제 삭제 |
| (단독) | 소유권 업로드 한도 **1GB**(현행) |

## 용어 규칙 (2026-11-26)
- CEX·DEX 공통 문맥(맥스보드·챌린지·쿠폰 등 계정 선택)은 `UID`·`Wallet` 대신 **`Account`**.
- 출금 **실적·결과**(출금된 금액·내역) = `Withdraw`/`Withdrawn`, 출금 **요청·동작** = `Claim`.

## 추가 결정 (2026-11-26 2차)

| # | 결정 |
|---|---|
| D7 | 프로모 배너 **넣는다** — 관리는 기존 어드민 「거래소 목록 상단 배너」(이미지 · 제목/내용 한·영 · 한/영 링크, 항목 추가)를 그대로 사용(G-156 해소) |
| D4 | GNB `Cashback ▾` = **Cashback Hub · Cashback Calculator**. 계산기는 Cashback 하위 메뉴 — 상단 단독 `Calculator` 메뉴 없음 |
| N16 | 누적 캐시백 카드(기존 MAXOP-731, [MAX-7] 페이지 22913:1054295 — DEX(revision) 페이지에는 없음) 캡션은 Account 규칙 적용: `Sum of {n} linked accounts · Update times vary by exchange`(타임존 라벨 없음, G-191) |

## 현행 판 확인서 32건 — 앞선 결정으로 정리

| # | 결정 |
|---|---|
| A1 | 새 GNB(D4 반영: `Cashback ▾`(Hub · Calculator) · `Rewards Hub ▾` · `Discover ▾`) |
| A6 | UID·지갑 상세 = 기존 디자인(9193:119755 계열, Earning Timeline 3단계) — N16·17·19 결정 |
| B1 | CEX 거래소 상세 상단은 DEX 범위 밖(DEX 상세는 자체 오퍼 박스) — 이번에 정하지 않음 |
| B3 | MAX 1216 CMT-08(`Rating` 열 — N2) |
| B6 | 출금 확인 다이얼로그 없음 — 출금 화면은 두되 버튼 없음(Auto Claim) |
| C2 | 챌린지 레벨 금액은 운영 설정값 — 디자인은 구성만 따르고 금액은 표본 |
| C3 | Boost 범위 밖(N7) |
| C5 | 시안 B(N5) |
| C6 | MAXOP-236(N11 — 기존 기능 그대로) |
| 나머지 | 확인서 권장안대로(A2~A5 · A7~A11 · B2 · B4 · B5 · B7~B12 · C1 · C4 · C7~C9) |
| A-18 | **Cashback Milestone(마일스톤·VIP 진행바)은 없어진 기능** — UID·지갑 상세 등 모든 화면에서 제외(기존 23rd June 판의 Milestone 블록 포함) |
| 지갑 상세 하단 | 기존 디자인 `Top Partner Exchanges`(CEX·DEX 공통) — `Top Partner DEXs` 폐기(사용자, dex-10 경유) |
| 요약 유형값 | `Claim Amount` STG 현행 유지(사용자, dex-10 경유) |
| 명세 반영 | REQ-278 · 정책 B-3-4: `Weekly Cashback History` · 마일스톤 없음. 결정정합 A-18 닫힘(0/13) |

## 보류 12건 결정 (2026-11-26 3차)

| # | 항목 | 결정 |
|---|---|---|
| 1 | 캡차 스크립트 로드 실패 (G-098) | 다루지 않음(디자인·문구 없음) |
| 2 | `Paste` 권한 거부 (G-351) | 별도 안내 없음 |
| 3 | 지갑 상세 404 · 요약 180일 이전 달 · 필터 빈 · 피드 빈 · 조회 실패 (G-454·459·477) | 기존 빈 상태로 둔다. **지급 네트워크는 서비스가 정하는 값(정책: 전 DEX 공통 1개 설정값) — 사용자가 고르지 않음**. 「미설정」은 운영 설정 누락이라 사용자 화면 상태가 아님 |
| 4 | 요약 쿠폰 사용 행 유형명 (REQ-371) | 서버가 정하는 값 — 프론트가 알 수 있게 **유형명 목록을 사전 정의**해야 함(명세 항목) |
| 5 | 허브 연동 없는 파트너 선택 | 정책 그대로 — REQ-299 · 정책 B-3-5(미연동 파트너는 잔액 미반환 → 계산기 폴백). G-149(H13 복귀 후 갱신 프레임)와는 다른 주제 |
| 6 | 프리로그인 랜딩 `Hero Exchange` DEX (G-466) | **DEX도 Hero로 지정 가능**(막지 않음). 같은 Hero 카드 사용 |
| 7 | 앱 DEX 외부 링크 실패 (G-216) | 외부 브라우저로 열리므로 앱 쪽 실패 다이얼로그 없음 |
| 8 | 상세 약관 서랍 (G-369) | 거래소마다 다르며 **어드민에서 입력** — 상세 약관 서랍 표시 |
| 9 | 맥스보드 참여 기간 아님 · 동시 요청 | 별도 문구 없음 — 참여 기간이 아니면 버튼 비활성, 처리 중 중복 클릭 방지 |
| 10 | 429 · 중복 요청 · 잘못된 값 (G-459) | 공통 오류 토스트 하나로 통일 |
| 11 | 파트너 허브 403 | 현행(기존 서비스 동작) 그대로 |
| 12 | 초대 등록 현황 친구 0명 (G-200) | 현행(기존 서비스 화면) 그대로 |

## 문구 원칙 (2026-11-26)
새 문구는 즉석으로 쓰지 않는다. 기존 서비스 문구 · 확정 정책 문구를 먼저 재사용하고, 새로 필요한 것은 **한 장의 문구표**로 모아 용어 규칙(Account · Withdraw/Claim · cashback)과 톤을 맞춰 승인받은 뒤 Figma에 넣는다.

## 승인 요약 결정 필요 10건 (2026-11-26 4차)

| Q | 결정 |
|---|---|
| Q1 G-448 | **출금 화면으로 들어오는 경로가 없음 → 출금 화면(`/withdrawal-apply` · `/withdrawal`) 삭제**(앞선 「둔다」 결정을 대체). Figma 출금 화면 추가 계획 취소 |
| Q2 G-449 | Q1로 해소(화면 없음) |
| Q3 G-451 | 홈 `Using multiple platforms? Link more accounts` → Link Account 연동 모달(웹 모달 · 모바일 꽉 찬 모달). 홈 `See All` → 연동 계정 목록 모달(기존 9401:160223 — 거래소별 묶음 · 계정 수 · 거래소 합계 · 계정별 금액 · 상태 점 · `Close`), 표기는 UID가 아니라 **Accounts**(`Linked Accounts {n}` · `{n} Total` · `{n} accounts`) |
| Q4 G-451 | 홈 Linked Accounts 행 상태별 표시는 기존 디자인(9401:87675 — 거래소별 UID 행 · 상태 점 · 진행 중 시계 아이콘)에 이미 정의 — 그대로 |
| Q7 G-463 | 거래소 목록이 캐시백 허브로 바뀌므로 문제 없음 — 같은 배너 사용(A) |
| Q9 | A — 쿠폰 계정 선택 모달은 계정이 1개여도 선택 없이 뜸(지금 Figma처럼) |
| Q5 G-460 | **점검 중 상태를 다루지 않음** — 테더맥스가 DEX 점검 여부를 알 수 없음. 연동을 시도해 실패하면 기존 연동 실패 오류 메시지만 보여 줌. 점검 표시 배지·`Link Wallet` 숨김 없음(G-162의 상세 적용 없음) |
| Q6 G-460 | **B** — 확인 중 지갑만 있는 회원의 DEX 상세 오퍼 박스에 「확인 중」 상태 표시(비활성). 참고: 귀속 확인은 대부분 즉시 응답이라 이 상태는 짧게 나타남 |
| Q8 | Cashback Basics 요약 박스(KEY TAKEAWAYS)는 다른 모듈 내용이라 틀림 → 수정. 초안 3줄(`Cashback is tracked per account.` · `Payouts are automatic.` · `Anyone can check, members get paid.`)을 문구표에 넣어 승인 |
| Q10 | 프로토타입에 먼저 추가하고 이미지로 확인받은 뒤 Figma에 반영. #6(점검 중 표시)는 Q5로 삭제 |
| 진행 방식 | Figma 수정은 마지막에 모아서 한 번에. 지금은 결정만 |

## 프로토타입 추가 상태 확인 (2026-11-26 6차)

| 항목 | 결정 |
|---|---|
| 홈 `See All` 목록 모달 | **All · CEX · DEX 칩 추가** |
| DEX 상세 「확인 중」 | 한국어 아님 — 영문 언어팩 원문 **`Trying to link`**(키 `link status processing`, 국문 `연동 시도중이에요`) |
| CEX UID 형식 오류 | **CEX는 현행 그대로**(새 상태 없음). DEX는 주소 검증 로직이 추가돼 있음 |
| 맥스보드 불러오기 실패 | 별도 디자인 없이 그대로(공통 오류 처리). 원인은 서버 쪽 5xx(503) |
| 챌린지 수령 완료 | 기존 디자인에 다 있음 — 추가 없음 |
| 쿠폰 404 | 기존 404 화면 그대로(추가한 프로토타입 상태 유지) |
| G-162 「연동가능=N」 | **보류 — Figma에 넣지 않음.** dex-10 확인: 실제 어드민에 「연동가능」 필드가 없음(비노출하면 허브에서 사라져 연동 불가). 실제 어드민·STG 확인 후 명세 정정 예정. `LINK_UNAVAILABLE` 프레임(content 계획 CT-12 ①) 보류 |

## Figma 2차 · 실동작 (2026-11-26 7차)

| 항목 | 결정 |
|---|---|
| 컴포넌트 안에 줄을 넣어야 하는 항목 | **A — DEX(revision) 해당 화면 인스턴스만 분리(detach)해 수정**, 컴포넌트 메인·다른 페이지는 고치지 않음 |
| 기존 원본이 없는 화면(퀴즈 모바일 상태 · Cashback Basics 모바일 · 혜택 상세 회원 모바일 CTA · 모바일 홈 첫 연동) | **가장 가까운 기존 컴포넌트로 그림** |
| 프로토타입 방향 | **실사이트 수집본(`_프로토타입_실사이트/`) + DEX 합치기, 실제 사이트처럼 작동**(입력·검증·토스트·탭·애니메이션). 캐시백 허브가 거래소 목록(`/en/affiliated`) 자리 |

## Figma 2차 남은 항목 (2026-11-27 8차)

| 항목 | 결정 |
|---|---|
| 기존 원본이 없는 화면 | 지금 디자인 기조(같은 페이지의 기존 컴포넌트·간격·글꼴)를 살려 새로 그림 — CT-33 서비스 소개 모바일 `Our Partners` 탭(`All` · `Exchanges` · `DEXs`) 포함 |
| 불러오기 실패 상태 | 만들지 않음 — 허브 H6 `DEX data pending` · CT-14 ③ 파트너 캐러셀 실패 · CT-28 ③ 영상 재생 실패 |
| 영상 자리 | 영상이라는 것만 표시(재생·실패 상태 없음) |
| 홈 누적 캐시백 블록 모바일 | 이번에 넣지 않음 |
| 다크 모드 | 자동 변환 — 다크 프레임 별도 반영 안 함 |
| CT-24 Landing | 기존 화면(PB-3)과 중복 — 만들지 않음 |
| 가이드 Step 2 본문 | DEX(revision) 기존 프레임 `DEX guide / Step 2 of 5`(28981:129056)의 문구 사용: `Check the receiving network before sending. Sending funds on the wrong network can cause permanent loss.` |
| CT-29 FAQ `Withdrawals & Account Management` 펼친 상태 | 같은 FAQ 첫 질문 답변 문구(`Your cashback is credited to your TetherMax balance. Eligible balances of 10 USDT or more are paid automatically to your linked wallet.`)를 운영자 입력 예시로 사용 |

## Figma 3차 남은 항목 (2026-11-27 9차, 모두 권장안)

| # | 항목 | 결정 |
|---|---|---|
| 1 | 서비스 소개 `Three steps to start earning cashback` 부제 | 문구표 #75로 통일(PC·다크·모바일) |
| 2 | `payout` 표현 | 계산기 Summary `Payout Details` · `Payout Time`(적립 시점, REQ-459)과 DEX 개요 타일 `PAYOUT`(REQ-329)은 실서비스 계산기·명세 그대로 유지. 그 밖의 홍보 문장 `payout`도 유지 |
| 3 | 쿠폰 약관 `… based on UTC` | 기존 서비스 약관 원문 유지 |
| 4 | AI 리뷰 요약 표본 `… every week.` | `every day`(G-428 일 1회) |
| 5 | 서버·운영 값 표기 `{rate}%` · `{date}` · `{local_time}` | 화면에는 표본 값(같은 화면의 다른 값과 일관), 「서버·어드민 값」은 개발 인계 메모에 |
| 6 | 계산기 단계명 `Boost` · `Start Cashback Preview` | 기존 /payback 퍼널 단계명 유지(N7은 Boost 기능 범위 제외) |
| 7 | 공개 피드 로딩·오류 | 만들지 않음(8차 불러오기 실패 제외) |
| 8 | 모바일 캐시백 요약 상태 4종(월간 카드 · 계정 시트 · 빈 달 · 빈 날) | 디자인 기조대로 새로 그림(캘린더 `DEX data pending`은 제외) |
| 9 | 랭킹 | 로딩 제외, 모바일 주소 팝오버만 새로 그림 |
| 10 | CEX UID 상세 | 새로 그리지 않음 — 기존 디자인([MAX-7] 9193:119755 계열) 노드를 인계 메모에 연결 |
| 11 | 문구표 행 중 화면이 없는 것(#12 · #16 · #19 · #36 · #49 · #51 · #54 · #3~#5) | 기존 컴포넌트로 상태 프레임을 그림. 홈 행 이슈·실패 칩은 Q4 기존 디자인 |
| GNB `Rewards Hub ▾` 항목 (2026-11-27) | Figma 기준 3개 `Exchange Events` · `Benefits` · `Points`(Figma의 `Exchanges Events`는 `Exchange Events`로). 실사이트 스냅숏 화면·DEX 화면·Figma 모두 이 구성 |
| 오퍼 박스 할인 단계 (2026-11-27) | `After discount` 행은 레코드 할인율(선택한 Taker/Maker 기준)이 0보다 클 때만 표시, 할인이 없으면 `Without TetherMax` · `After cashback` 2행(모든 DEX, Lighter 포함). EdgeX 등 Maker 할인 전 값이 없으므로 Maker 선택 시 할인 행 숨김(2행) |
| 리뷰 외 옛 파랑(#1976D2) (2026-11-27) | `How this works` 글자·아이콘 · `Read more` · 모바일 Lighter 오퍼 `After cashback` 값도 버튼 색 `primary/blue/main`(#0031C6)으로 통일 |
| 계산기(`/payback`) 프로토타입 (2026-11-27) | 실서비스 계산기 화면(`05.리포트/실사이트_계산기_img/calc_01~06.png`) 흐름·문구·동작 그대로 — 소개 → 거래소 선택 → 거래 프로필 → 로딩 → What You're Missing Out On → Summary(`Payout Details`) |

## 홈 연동 계정 행 상태 표시 (2026-11-27 10차)

| 항목 | 결정 |
|---|---|
| 연동 실패 | 자동 연동 실패는 홈 목록에 표시하지 않음(연동 결과 화면에서 끝남). **수동 연동 실패**는 기존 디자인: 빨간 점 + 분홍 배너 `UID Linking was unsuccessful. View reason.` › → 모달 `UID Linking Unsuccessful` / 사유 문구(예 `UID is not found in the tetherMax database. Please contact customer service for assistance.`) / `Remove UID` · `UID Link` |
| 캐시백 0 | 칩 없음. `0.00 USDT` 그대로 (`No cashback yet` 칩 없음) |
| 이슈 · 소유 확인 실패 · 연동 해제(되찾기) | 칩이 아니라 **기존 디자인**(9401:87675 계열): 행 상태 점 + 행 아래 배너(`Ownership verification was unsuccessful. View reason.` · `This UID has been unlinked. Tap to verify ownership and reclaim it.`), 이슈 행 탭 → 모달 `There is a problem with this UID.` / `Please contact our support team for assistance.` / `Contact Support` |
| 반영 지연 · 오프보딩 | `Data delayed` 칩 없음(거래소 API 응답을 바로 받음). `Inactive` 칩 없음 — 오프보딩 계정은 **이슈 처리**(빨간 점, 누르면 `There is a problem with this UID.` 모달) |
| 행 배너·모달 문구의 계정 표기 | 행 하나는 CEX 또는 DEX 하나이므로 용어 규칙대로 분기: CEX 행 = 기존 `UID` 문구 그대로, DEX 행 = `UID` 자리를 `Wallet`/`wallet`로(문구표에서 확정) |
| 캐시백 0원 안내 | 없음 — CEX와 같이 `0.00 USDT`만 표시. 지갑 상세 0원 배너(G-110 문구)·홈 0원 칩 모두 두지 않음 |
| 캐시백 요약 반영 지연 | `Delayed` 상태·`Last updated` 지연 표시 없음(반영 지연 표시 없음 원칙과 같음) |
| 확인 중 · 소유 확인 중 행 표시 | 칩이 아니라 기존 디자인: 확인 중 = 분홍 점 + 시계 아이콘, 소유 확인 중 = 파란 점 + 시계 + `Ownership verification in progress · {경과 시간}`(9401:87675 계열). DEX 상세 오퍼 박스 비활성 `Trying to link` 버튼(Q6)은 그대로 |

## 남은 결정 (2026-11-27 11차)

| 항목 | 결정 |
|---|---|
| 미정 항목 결정안 98건(`05.리포트/미정항목_결정안.md`) | 결정안대로 채택 |
| 맥스보드·리그 약관 `based on UTC` | 기존 약관 원문 유지 |
| Cashback Basics 소제목 `Withdraw cashback and rewards` | `Claim cashback and rewards`(요청·동작 = Claim) |
| 가입·로그인 이메일 인증 | 실서비스 모달: `Email Verification` · `We've sent a code to {email}` · 6칸 코드 · `Paste` · `Verify` · `Resend code in 01:00` |
| 허브 `YOUR CASHBACK` 패널 · 지갑 상세 금액 카드의 송금 완료 누계 라벨 | `Total Claimed`(허브 패널은 `Total claimed`) 유지 — G-053 |
| 캐시백 요약 `DEX data pending`(달력 `P`) · 맥스보드 `Cashback Update Delayed` 안내 | 없음 — 실서비스에 없는 표시(반영 지연 표시 없음 원칙) |
| 게스트 조회 결과 집계 대기(`DATA_PENDING`) | 안내 없음 — 금액을 그대로 표시(반영 지연 표시 없음 원칙) |
| 첫 연동 쿠폰 이름 | 기존 `LINK UID` 그대로(발급이 CEX 첫 연동만, G-326) |
| GNB 큰 메뉴 클릭 | 이동하지 않고 아래로 펼침(펼친 채 유지) — 실제 동작판·화면 목록판 모두 |

## 화면 요소 정의 (2026-11-27 12차, `05.리포트/화면요소_정의_전수점검.md`)

| 항목 | 결정 |
|---|---|
| 🔴 결정 필요 48건 | 전부 권장안 |
| 🟡 기존 서비스 동작으로 정의할 173건 | 기존 동작 그대로 문서에 정의 |
| 상단 로고 | 홈(기존 서비스) |
| 허브 `Learn More` · `Join {partner}` | `Learn More` = 상세, `Join` = 레퍼럴 가입 새 탭 |
| 연동 모달 `Sign up here` · `Register here` | 선택한 거래소의 레퍼럴 가입 새 탭(문서대로) |
| 연동 모달 첫 상태 | **첫 거래소가 기본 선택**(실서비스와 같이 목록 첫 항목 `WOO X Pro`, G-379) |
| 글로벌 리그 상금 | `Receive Prize`·수령 화면 없음 — 참가 계정으로 지급(REQ-391) |
| 화면 목록판(`full.html`) 표시 | 왼쪽 LNB를 빼고 실사이트처럼 — 화면을 고정 틀로 자르지 않고 전체 폭·전체 높이로. 상단 로그인 상태(게스트·회원 연동 0·회원 연동) 전환 시 그 상태의 화면으로 바뀜(예: 은색 테더맥스 로고 히어로 랜딩은 게스트 전용) |
| 연동 모달 가입 중간 안내 `Start by signing up for Lighter?` | 없음 — 가입 링크는 바로 선택한 거래소 레퍼럴 가입 새 탭 |
| 연동 모달 가입 링크 문구 | `Don't have an account yet? Register here`(실서비스) |
| 허브 CEX 라우트 행 목적지 | 허브 CEX 탭(별도 Exchange Listings 페이지 없음) |
| REQ-039 비활성 버튼 조건 안내 예외 | 계산기 `Next`·`Check Results`, 소유권 `Submit Claim` — 조건 안내 없이 비활성만(기존 화면) |
| EMAIL 31 버튼 링크 | 해당 DEX가 선택된 연동 모달로(문서대로, Figma 메일에 링크 추가) |
| 테더맥스 포인트(TP) 진입 (2026-11-27) | 소개 페이지(`/en/tethermax-point-introduction`)는 게스트·회원 모두 볼 수 있음. CTA = 스크롤하면 나타나는 고정 버튼 `Check My TP` — 회원 → 포인트 페이지(`/en/tethermax-point`), 게스트 → 가입(`/en/signup`). 게스트가 포인트 페이지를 직접 열면 소개 페이지로. 근거 www-dev 실측 · Figma [MAX-659] TetherMax Point(13033:27246) |
| 계산기 Summary `Start {거래소} Cashback` (2026-11-27) | 외부 가입 새 탭이 아니라 **그 거래소 상세 페이지로 이동**(CEX = 거래소 상세, DEX = DEX 상세) |
| 이벤트 페이지 상단 배너 캐러셀 | 3초마다 자동으로 넘김 |
| 축약 지갑 주소 전체 보기 (2026-11-27) | **DEX 지갑 주소에만 적용**(CEX UID에는 툴팁 없음). 축약 주소(`0x7a3F…51e9`)를 **모바일은 탭, PC는 호버**하면 전체 주소가 **기존 어두운 툴팁**(거래소 상세 `Total Savings` ⓘ 툴팁과 같은 모양 — 제목·`Close` 없는 말풍선)으로 표시. 복사 아이콘은 그대로. 카드형 `Wallet address` 팝오버는 쓰지 않음(모바일 랭킹 주소 팝오버 포함) **행 전체가 상세로 가는 목록(홈 Linked Accounts 행 · See All 모달 행)에는 툴팁 없음**, 주소 밑줄 표시도 없음 |
| 홈 누적 캐시백 블록(MAXOP-731) | 없음 — 이번 범위에서 제외. Figma DEX(revision) 홈·프로토타입에서 빼고 N16 캡션 결정은 효력 없음 |
| Brokers 페이지 (2026-11-27) | `/brokers` · `/brokers/learn` · `/brokers/compare` · `/brokers/rs-finance` · `/brokers/infinox` 모두 유지(실서비스·Figma [MAX-]FX V2 그대로). 없애는 것은 GNB `Cashback ▾`의 `Brokers` 진입뿐(D4) |
| 허브 Brokers 비교표 `Join {broker}` | 브로커 상세(`/{lang}/brokers/{slug}`, 현재 탭) — 브로커만의 예외. CEX·DEX `Join`은 레퍼럴 가입 새 탭 유지(12차) |
| 혜택 상세 상태 (2026-11-27) | 쿠폰을 주는 혜택은 상세마다 **수행 전 / 수행 후 쿠폰 미수령 / 수행 후 쿠폰 수령** 3상태를 정의. 그 밖에 텍스트가 바뀌는 상태는 모두 정의. 기존 정책 중 DEX로 바뀌어야 하는 부분(용어·조건·대상)은 반영 |
