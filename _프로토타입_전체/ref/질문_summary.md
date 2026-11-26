# 질문 — 10. 캐시백 요약 · 랭킹

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| CS1 · CS4 월간 카드 (28960:127133 · 28960:127151) | 두 번째 줄 라벨 `Claimed` | 정책 REQ-369는 `Received` / `Withdrawn` / `Net`. 자동 지급 전환 후 `Claimed`가 의도된 개명인지 불분명 | 현재 `Withdrawn`(정책). 개명이 맞다면 정책·명세에 반영 후 교체 |
| CS1 일별 행 · 모바일 유형 시트 (29065:6366) | 모바일 유형 시트에 `Trading Cashback`과 `Withdrawal` 표기 | 정책은 `Exchange Cashback`(G-365), `Event Reward`, `Claim Amount`(G-418) | PC CS6 All Types (29265:120387)에는 정책값 반영 완료. 다른 상태는 별도 확인 대상 |
| CS1 유형 셀렉트 (28960:127133) | 셀렉트 기본값 `All Cashback Types` | REQ-378은 `All Types`로 변경, CS6 드롭다운 첫 항목은 `All Types` | 현재 `All Types` |
| CS3 Event reward day (28960:127145) | 26일 칸 `+5.00`, 일별 목록 합 +150.00 | REQ-378 「같은 날 캘린더 칸 = 일별 순액」과 어긋남 | 프로토타입은 칸을 `+150.00`으로 맞춤. Figma 수정 요청 |
| CS2 Month view, other day selected (28960:127139) | 프레임 높이 900에서 캘린더 3주차까지만 보이고 선택일·일별 목록이 잘림 | 「다른 날 선택」 시 무엇이 보여야 하는지 Figma로 확인 불가 | CS1 형식(선택일 원 + 그날 목록)으로 구성. 프레임 높이 확장 요청 |
| RK1~RK3 (28960:127201 · 127207 · 127213) | 랭킹이 혜택 화면 위 사이드 패널(`My Cashback Ranking`)만 있음 | V2.2·REQ-379~382의 월간 순위표(전체/CEX/DEX 칩, 0.01 USDT 하한 안내, 랭킹 리워드 박스)를 둘 화면이 없음. GNB `Discover › Cashback Ranking`의 대상이 패널인지 별도 페이지인지 불명 | 패널을 기본 상태로, 순위표는 `board`·`dex` 상태(디자인 없음)로 유지. 순위표 페이지 존치 여부 확인 |
| Wallet address 행 3종 (28984:126296 · 126300 · 126304) | `0×91c4…`(곱셈 기호 ×) 표기 | Figma 원문은 `0×`이지만 주소 표기 원칙상 `0x`가 맞아 보임 | 프로토타입은 Figma 그대로 `0×`. 오기라면 Figma 수정 |
