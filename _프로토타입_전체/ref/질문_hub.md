# 질문 — 7. 캐시백 허브 (hub)

| # | Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|---|
| 1 | H1 `28960:126884` · H5 `28960:126908` · H6 `28960:126914` | DEX 계산기 기본 파트너와 잔액 패널 표본이 Lighter | Lighter는 온보딩 보류(G-428). 기본 파트너는 운영자가 지정한 활성 DEX(REQ-295) | 프로토타입은 Figma대로 Lighter로 둔다. 개발 기본값은 REQ-295(활성 DEX 중 운영자 지정)를 따른다 |
| 2 | H3 `28960:126896` · H4 `28960:126902` | CEX UID 연동 잔액 패널과 10 USDT 미만 상태. V2.2에는 없었음 | 정책 B-5-4에서 유효로 판정돼 있어 상태(`hub.main:cexPanel` · `cexBelowMin`)로 추가함. 다만 하위 줄 `Events and invites`는 정책상 틀린 문구(G-140 미정)이고, H4 넛지 `Just 3.00 USDT more to qualify.`는 G-139 확정 문구로 바꿈 | 추가를 유지할지 확인. G-140 대체 문구 결정 |
| 3 | H5 `28960:126908` · H8 `28960:126926` | 잔액 패널 문구가 REQ-300 원문과 다름: 큰 숫자 라벨 `Total available cashback`(H5) / `Paid to your TetherMax balance`(H8), `Event Reward`, H8 `Paid records, reported by EdgeX` · `Reported next day`, 각주 `Payout destination: linked {DEX} wallet.` | REQ-300은 `Withdrawable {amount} USDT` · `Total event reward` · `You withdraw on TetherMax, to your linked {DEX} wallet.`. Figma 문구가 자동 지급과 더 맞지만 H5와 H8의 큰 숫자 라벨끼리도 다름 | Figma 문구를 채택하고 큰 숫자 라벨은 `Total available cashback`으로 통일. REQ-300 원문 갱신 |
| 4 | H1 계열 routes 블록 (`I28960:126884;27610:202743` · `…202774`) | DEX·CEX 행 세 번째 줄이 `Automatic payouts from 10 USDT` | 정책 RT-3 · REQ-315 원문은 CEX `Paid daily, withdraw from 10 USDT`, DEX는 「CEX와 같은 지급 조건 문구」(REQ-309) | Figma 문구(자동 지급 반영)를 채택하고 REQ-309 · 315 원문 갱신 |
| 5 | H1-Broker `28960:126950` 비교표 제목 | Brokers 칩 비교표 제목 원문(Figma · 정책 B-5-8)에 금지 용어가 들어 있음 | 용어 규칙상 화면에 쓸 수 없어 `C.tbd`로 비워 둠 | `Compare cashback across {n} brokers`로 교체 |
| 6 | H7 `28960:126920` | 잔액 로드 실패 시안이 CEX(Bybit) 탭이고 `Auto Claim` 버튼이 없음 | REQ-301은 DEX 패널 로드 실패 + 「버튼은 항상 비활성 `Auto Claim`」 | DEX 탭으로 옮겨 쓰고 비활성 `Auto Claim`을 둔 현재 구현 유지(확인만) |
| 7 | H2 `28960:126890` | 로그인 · 연동 0 계산기에 `Paid to your TetherMax balance · Minimum 10 USDT` 줄이 없음 | 정책 B-5-2는 로그인 상태 계산기에 이 줄을 둠 | 정책대로 줄을 넣은 현재 구현 유지(Figma 보완 요청) |
| 8 | H1-CEX `28960:126944` 비교표 14행 | Bitunix 옆에 빨간 `Chip` 자리표시 칩 | 내용이 없는 자리표시라 무엇을 뜻하는지 알 수 없음. 구현에서는 뺌 | 프로모션·부스트 배지 의도라면 문구와 노출 조건 정의 |
