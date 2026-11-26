# 질문 — 8. DEX 개요 · 상세

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| DEX guide / Step 1·2·3 of 5 (28981:129050 · 129056 · 129062) | `Guide to DEX trading` 카드형 가이드(예: Step 3 `Verify the referral on the DEX` — 가입 후 DEX 레퍼럴 페이지에서 코드 확인 → 테더맥스에 공개 주소 붙여넣기) | 상세 D1~D6의 단계 레일 가이드(5단계, 스크린샷)와 구조·문구가 다르고, 어디서 쓰는지(상세 대체안인지, 개요 `Guide to DEX` 버튼 목적지인지) 표시가 없다 | 상세는 D1 단계 레일 유지. 이 카드는 개요 `Guide to DEX` 목적지 후보로 확인 후 반영 |
| DEX detail D4 EdgeX (28960:127454) | 오퍼 박스 `0.0600% → 0.0400% → 0.0184%`, 개요 카드 EdgeX `Final Taker 0.0266%` | REQ-339(헤드라인·`After cashback` = 카드 값)를 Figma 스스로 어긴다. 30% 기준으로는 0.0400 → 0.0280 | 프로토타입은 레코드 표본 0.0600 → 0.0400 → 0.0280%로 통일. 실값은 G-045 회신 후 |
| OA DEX overview — final CTA band (28960:125759) | 마지막 CTA 띠 배경이 밝은 회색 + 키체인 이미지 | REQ-331 「테마와 무관하게 항상 다크」와 다르다(Figma 레이어 이름도 `always dark`) | Figma대로 회색 유지, 다크 여부는 디자이너 확인 |
| OA DEX overview — learn and earn (list view 28960:125536 등 인스턴스) | 본문 `Complete a quiz to earn a coupon. Redeem it on a linked account as an event reward. It matches trading cashback 1:1.` | REQ-330 원문은 `Short lessons on decentralised perps, then a quiz.` 하나. 새 문구는 G-158(퀴즈 보상 규칙과 같은 표현일 때 언급)과 맞지만 명세 갱신이 안 됨 | Figma 문구 사용. 명세 REQ-330 갱신 여부 확인 |
| OA DEX overview — glance 머리 (28960:125542 · 125536) | 서브라인 `TVL and 24H volume from DefiLlama, as of 14 Oct 2026` 표시 | 사용자 확인 #40(서브라인 삭제 / 날짜 없이 / 날짜 포함)이 Figma에서 「날짜 포함」으로 정해진 것인지 불명 | Figma대로 날짜 포함 표시. #40 종결로 볼지 확인 |
| OA DEX overview — hero (28960:125521) | Figma는 리드(C-28)를 숨기고 마크 아래 `Trade on the DEX. Paste your address on TetherMax.` 한 줄만 둔다 | G-154 확정 리드(`Trade with your own wallet on the DEX. Paste your wallet address…`)를 어디에 둘지 Figma에 자리가 없다 | 숨김 리드 자리(H1 아래)에 G-154 문구를 넣음. Figma 한 줄과 중복이면 하나만 둘지 확인 |
| DEX detail reviews (28960:127443 Reviews 섹션) | 세 번째 평점 축 `Cashback payouts` | REQ-353은 `Cashback withdrawal`(국문 `캐시백 출금`). 자동 지급 기준으로 바뀐 것으로 보이나 국문이 없다 | 영문은 Figma대로, 국문 문구표 확인 |
| DEX overview Mobile (28960:130946) — 배너 | 모바일 Aster 슬라이드 위 이미지가 BloFin(CEX) 85% 이미지 | Aster 슬라이드에 다른 파트너 이미지가 들어간 시안용 자리로 보임(G-156 배너 관리 미정) | 시안 이미지 그대로 두고 G-156 답변 때 교체 |
