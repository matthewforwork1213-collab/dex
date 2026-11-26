# 질문 목록 — 5. 거래 계정 연동 (link)

Figma와 정책·결정이 갈리거나 근거가 애매한 항목입니다. 「처리함」은 결정 근거가 생겨 화면에 넣은 항목입니다.

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| L16 S3 Signed in, nothing linked (28960:127367) | S3 홈 위에 DEX 목록 모달(L1과 같은 모달) | REQ-051: 웹 홈 S3 체크리스트 진입은 「아무 거래소도 선택되지 않은 상태」(`Select a partner`). Figma S3-2(28960:127765)가 그 상태를 그리고 있어 L16과 겹침 | S3 진입 = S3-2로 두고 L16은 폐기 또는 「푸터 진입」으로 이름 변경 |
| L1 Select a DEX (28960:127271) | D1 Lighter 상세 배경 위 DEX 목록 | REQ-051: DEX 상세 진입은 「해당 DEX 선택 상태」(= L2 주소 입력). 상세 배경에서 DEX 목록이 열리는 경로가 정책에 없음 | `link.select:dexlist`는 L17(S4 홈 배경)을 대표로 쓰고 L1은 같은 모달의 다른 배경으로만 기록. 상세 진입은 L2로 확정할지 |
| L10 Lighter Standard account (28960:127309) · 모바일 Link / Lighter Standard (28969:127146) | Standard 계정 안내 모달 | REQ-116: Standard 경고 화면·`Upgrade…` 카피를 두지 않음 | 만들지 않음 — 폐기 확인 |
| L11 Checking your referral (28960:127313 · 모바일 28969:127080) | 제목 `Checking Your Referral` · 본문 `We’ll notify you once your exchange confirms your referral.` | G-094 확정 영문은 `We're checking your account link` / `We'll let you know the result after checking the exchange's referral records.` — Figma와 다름 | 프로토타입은 G-094 문구. Figma를 G-094로 고칠지 확인 |
| L8 Not joined through TetherMax (28960:127301 · 모바일 28969:127125) | MAXOP-751 원문 적용 | `Unable to Link Account` · `Close` · `Need help? Contact Support` | 피그마·프로토타입 동일 |
| L15 Wallet limit reached (28960:127349 · 모바일 28969:127118) | Figma 본문 `You can link up to 12 trading accounts.` · 버튼 `Close` | G-091 확정: 본문 `You've linked the maximum number of accounts ({n}).` · CTA `Contact Support`만 | 프로토타입은 G-091. Figma 반영 요청 |
| L7 Account linked (28960:127297) | MAXOP-751 성공 원문에서 연동 대상 UID를 Account로 표기 | `Account Link Completed` · `Linked successfully.` | 지갑 주소와 정산 정보는 REQ-095 적용 |
| Signup + Link Wallet / 2 Signup (28960:127418) | 3단계 마지막 라벨 `Link your wallet` | DEX 전용 흐름의 식별자는 지갑 | 반영 완료 |
| Signup + Link Wallet / 3 Return (28960:127422) | 상세 페이지에서 `Link Wallet`이 주 버튼으로 바뀜 | 상세 화면은 DEX 담당(`dex.detail`) — 연동 모듈은 복귀 후 열리는 연동 모달만 그림 | DEX 담당에 「복귀 강조 상태」 추가 요청 |
| Link / Bitget UID · existing mobile form (29051:100488) | 기존 CEX UID 입력 모바일 폼 | — | **처리함**: `link.uid`로 넣음(웹 9105:196091). 다음 단계(캡차·결과)는 기존 CEX 흐름 |
| Signup + Link Wallet / 1 Entry · 2 Signup · 3 Return (28960:127376 · 127391 · 127396 · 127404 · 127416 · 127418 · 127422) | 가입 후 연동으로 돌아오는 흐름 | — | **처리함**: G-402 확정 근거로 `link.signup`(prompt · return)에 넣음. 복귀 안내 문구는 `C.tbd(…,'G-402 문구표')` |
| Link / Linking unavailable (28969:127153) | 모바일 연동 불가 결과 | — | **처리함**: 선택 뒤 연동 불가로 바뀐 예외로 `link.result:unavailable`에 넣음(G-161 이유 표시 없음). Figma 문구는 L13과 같은 일반 실패 |
| 웹 칩 선택기(All / Centralised / Decentralised) | 웹 Figma에는 칩 선택기 없음(S3-2 드롭다운 · L1 DEX 목록만) | REQ-055는 웹 칩·`Popular partners`를 정함. 웹 드롭다운을 열면 무엇이 보이는지 디자인 없음 | 웹 드롭다운 열린 상태 디자인 요청 |
