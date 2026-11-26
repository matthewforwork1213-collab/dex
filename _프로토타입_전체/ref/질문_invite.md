# 질문 — 11. 친구 초대 · 파트너 허브

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| IF1~IF7 약관 (28960:126816 외) | 신규 bullet이 `Invitation Rewards are earned on trading cashback from linked CEX and DEX accounts.` · `Invitation Rewards are paid in USDT to your designated linked account from 50 USDT.` 2개 | REQ-421 원문은 3개(`…receive from trading on centralised exchanges (CEXs) and decentralised exchanges (DEXs) linked to TetherMax.` · `Decentralised exchanges currently include Lighter, ApeX, EdgeX and Aster.` · `…can be withdrawn to a linked exchange UID or a linked DEX wallet.`). 단 G-199(DEX 이름 하드코딩 제거)·G-419(withdrawn → Claim 계열)·자동 지급과는 Figma 쪽이 맞음 | 현재 Figma 문구 9개. 정책 REQ-421 원문을 Figma 문구로 갱신할지 확인 |
| IF1·IF3·IF4·IF5 How it works 3단계 | `…cashback rewards whenever they trade.` | G-198 확정: 「whenever they trade」 → 「when your friends claim their cashback」 | 프로토타입은 확정값 적용. Figma 수정 요청 |
| 친구 초대 · 모바일 (29065:6175) | `Withdraw` 버튼 · `Linked Trading Accounts 31` | 정책 REQ-414(자동 지급, 비활성 `Auto Claim`) · REQ-420(`Exchange Account Registration Status`, 배지 = 합계 38)과 다름 | 프로토타입은 정책값. 모바일 Figma 수정 요청 |
| 파트너 허브 · 모바일 (29065:3660) | `Available to Withdraw` + 활성 `Withdraw`, 퍼널 `Payout Rate`(DEX 캡션 없음) | REQ-428(자동 지급) · REQ-430(`Payout / Settled Rate` + `DEX: cashback settled`)과 다름. PC PH1은 정책과 일치 | 프로토타입 모바일도 PC 문구(`Available for payout` · `Auto Claim` 비활성 · `Payout / Settled Rate`) |
| PH1 약관 첫 줄 (28960:127182) | `Invite Rewards are paid automatically from 50 USDT.` | G-203: 파트너 허브 최소액 초기 10 USDT(영문 50 → 10 정정). REQ-434 원문은 `Invite Rewards can only be withdrawn when the amount is 10 USDT or more.` | 프로토타입은 Figma 문장에 10을 넣음(`…from 10 USDT.`). 최종 문장 확인 |
| Linked Accounts detail (28960:127188) | 행을 CEX/DEX 그룹 헤더 없이 한 목록 + `5 Accounts` | REQ-427 「CEX·DEX를 나눠 세는 표로 바꾸지 않고 그룹 헤더」 — 그룹 헤더를 둔다는 뜻인지 불명(V2.2는 CEX/DEX 헤더) | 프로토타입은 Figma(헤더 없음). 그룹 헤더 필요 여부 확인 |
| IF1 · IF3 상단 오른쪽 `Size=Medium … Contained` 버튼 인스턴스 (I28960:126816;27610:200923) | 레이어에는 있으나 스크린샷에 보이지 않음 | 숨김/투명 여부 불명 | 만들지 않음 |
| [MAX-587] Referral Friends (`15170:208042` · Empty `15170:209058` · mobile `15213:254044`) | IF7 `Referral Details`가 여는 피초대자 목록 | DEX 계정(지갑) 표시 규칙이 정책에 없음 | 넣을지·DEX 지갑 표시 방식 확인 |
| [MAX-587] MAXOP-236 리워드 조회 (`15798:99716`) | `Reward History` 목록 | 자동 지급 이력 표시 기준 미정 | 확인 |
