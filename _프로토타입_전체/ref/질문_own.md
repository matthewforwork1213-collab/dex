# 소유권 인증 — 사용자 확인 필요 (2026-11-25)

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| O3 Guide step 1 (28960:127635) · 모바일 Recording guide 1 (28982:126103) | 단계 제목 `Start recording, then disconnect your wallet` · 본문 `…disconnect your wallet from the account menu…` | 정책 REQ-725 확정 문구이자 Figma 문구인데, 금지어 `disconnect`(연동 해제는 Unlink)에 걸려 점검 오류 24건(own.verify의 step 1 배경을 쓰는 상태 전부). 여기서는 DEX 사이트에서 지갑 연결을 끊는 동작이라 테더맥스 연동 해제와 다른 뜻 | 문구 유지 + 점검 도구에 이 문장 예외 등록(코어 변경 요청). 바꾼다면 정책 REQ-725도 함께 수정 |
| O0 Home, link another wallet (28960:127748) | 홈 연동 계정 패널 + `Using multiple platforms? Link more accounts` | V2.2 소유권 상태에 없고, 화면 자체는 홈(home.main) | 소유권에서 만들지 않음. 홈 담당이 home.main에 반영 |
| O11~O16 홈 행 (29453:143874 등) | Aster 행 `Expiring` 경고 칩(주황) | 「귀속 기간/만료」 표현 금지 정책과 충돌 | 소유권 홈 행에서는 칩 없이 그림 |
| O16 Reclaim not approved (28960:127739) | `Reason from review` 박스가 초록 외곽선 + 체크 아이콘(Success Alert) | 거절 사유인데 성공 색 | Figma 그대로 둠. 오류/경고 색으로 바꿀지 디자이너 확인 |
| O9 · O10 · O15 · O16 다이얼로그 | 보조 버튼(`Contact Support` · `Cancel` · `Remove Wallet`)이 흰색 외곽선·흰 글자(흰 배경에서 안 보임) | 다크 테마 버튼이 라이트에 남은 것으로 보임 | 검정 외곽선 버튼으로 그림. 디자이너 확인 |
| O11 Review in progress (29453:143874) | Lighter 행 상태 칩 라벨이 `Chip`(미입력) | 라벨 원문 없음 | V2.2 `소유 확인중` 사용. 영문 라벨 원문 없음 → EN에서도 한국어 라벨 |
