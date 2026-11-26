# 사용자 확인 필요 — 4. 홈 · 잔액 · 지갑 상세

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| HW1 Home, Total Cashback Balance (28960:126108) | Aster 행의 주황 점 + 채움 칩 `Chip`(컴포넌트 변형 `Expiring`) | Aster 만료 칩은 정책상 금지(REQ-273). 자리표시 라벨이라 무슨 상태인지 알 수 없음 | 같은 주의 스타일로 `Data delayed`를 넣어 둠. 의도한 칩을 알려 주면 바꿈 |
| S4-6 Back on home, new row (28960:127867) | 새 Aster 행의 주황 점 + 파랑 외곽선 칩 `Chip`, 금액 0.00 | V2.2는 `연동 완료 0.00`. 라벨 자리표시라 상태가 불명확 | 캐시백 0 칩 `No cashback yet`(REQ-273)로 둠 |
| HW1 · S4-1 Linked Accounts 행 | `연동 완료` 행은 점만 있고 상태 텍스트가 없음 | REQ-271은 「상태 점(텍스트 병기)」 | Figma대로 점만 두고, 다른 상태만 칩으로 텍스트 표시. 연동 완료에도 텍스트를 붙일지 확인 필요 |
| 상태 라벨 전반(HW1 · S4-6 · PW1) | 상태 7단계 영문 라벨 | 한국어 라벨(`연동 시도중이에요` 등)만 원문이 있고 영문 원문이 없음. 칩 색 4토큰(G-058)도 Figma에 정의 없음 | EN 보기에서도 한국어 라벨 표시. 색은 완료 연녹 · 진행 파랑 외곽선 · 주의 주황 채움 · 실패/해제 회색으로 임시 지정 — 디자인 확정 요청 |
| PW1 My Cashback, Lighter selected (28960:125943) | 헤더 칩 `Active` | REQ-273은 `Active` → `연동 완료`(CEX와 같은 라벨) | KO는 `연동 완료`, EN은 Figma `Active` 유지. EN도 바꿀지 확인 |
| PW1 (28960:125943) | Top Partner DEXs 요율 `Up to 20% / 30% cashback` | 사용자 노출 캐시백율 실값 미정(G-003), 레코드 값 사용(REQ-280) | Figma 표본값 그대로 둠 |
| S4-1 · S3-7 (28960:127837 · 28960:127795) | 총액 `5,137.70 USDT` | 행 합계(148.00 · 0.00)와 다름. 총액 = 연동 계정 합계(REQ-268) | 행 합계로 표시 |
| DW0 Hub, DEX balance (28960:125773) | 허브 DEX 잔액 패널 | 허브(`hub.main`) 담당 화면 | 홈 그룹에서는 만들지 않음 — 허브 담당 확인 |
| Mobile / Guest entry / Home (29037:113704) | 게스트 모바일 홈(히어로 · 가입 · 통계 · 푸터) | 랜딩(`landing.main`) 담당과 겹칠 수 있음 | `home.main:guest` 모바일로 구현, 웹은 `landing.main`을 그대로 씀. 랜딩 담당이 같은 프레임을 쓰면 한쪽으로 합칠지 확인 |
| `[MAX-7]` MAXOP-731 누적 캐시백 카드 (22913:1054295) | 캡션 `Sum of 3 linked UIDs · Updated daily at 09:00 KST` | UID 표기 · KST 라벨이 정책(거래 계정 · 타임존 라벨 없음)과 다름 | G-191 확정 문구 `Total of {n} accounts · Update times vary by exchange`로 표시함. Figma 캡션 교체 요청 |
| `[MAX-7]` MAXOP-783 Earning Timeline 캐러셀 (26047:56685) | 3단계(Start Trading · Cut-off Time · Cashback Accumulated) | 정책은 4단계(REQ-282 · G-192), 단계별 영문 원문 없음 | 탭 4개 + V2.2 국문 단계명으로 둠. 4단계 영문 문구 요청 |
| `[MAX-18]` 출금 모달 (12936:389796) | 제목 `Withdraw` · `Confirm Withdraw` · 마일스톤 진행바 | 자동 지급 정책에서 회원 출금 행위 없음 | 버튼은 비활성 `Auto Claim`, 마일스톤 제거, 제목은 기존 `Withdraw` 유지 — 제목 변경 여부 확인 |
| PW1 (28960:125943) vs 기존 UID 상세 (26047:1349155) | 지갑 상세의 Earning Timeline이 구버전(아이콘 3개) | 기존 UID 상세는 MAXOP-783 캐러셀로 개편됨 | 지갑 상세는 PW1대로 둠. 캐러셀로 맞출지 확인 |
