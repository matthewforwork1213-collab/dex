# 상태별 근거 대응 — 13. 퀴즈 · Beginner’s Guide (src/130-quiz.js)

2026-11-26 Figma 스크린샷 대조 후 확정. 「재사용」은 기존 다른 프레임·컴포넌트를 그대로 쓴 것(출처 노드 기재). 코드의 각 상태 note 맨 앞 `[기존 MAX-nnn]`이 기존 페이지 근거.

| 화면id:상태 | 상태 설명 | PC 근거 | PC 종류 | 모바일 근거 | 모바일 종류 | 비고(note 요약) |
|---|---|---|---|---|---|---|
| `quiz.list:guest` | 게스트 (Not Signed In) | 28960:130554 | DEX | 29058:108346 | DEX | V2.2 qz/QUIZ#normal의 모듈 4·5 카드 · 기존 3장과 같은 카드 구조(REQ-443) |
| `quiz.list:normal` | 회원 · 모듈 4·5 카드 | 28960:130554 | DEX | MO — 기존 Quiz mWeb 「Not Signed In」 19604:31510 목록 틀 | 재사용 | V2.2 qz/QUIZ#normal · 회원도 카드 구성 같음(GNB만 다름) — 같은 Figma 프레임 기준 |
| `quiz.list:completed` | 완료 모듈 (Completed) | 19604:31447 | 기존 | MO — 기존 mWeb 카드 + 카드 상태 19604:31447 | 재사용 | [기존 MAX-] Quiz 카드 상태 「Post claim rewards」 — 빨간 Completed 칩 + View(outlined) · V2.2 qz/QUIZ#completed(REQ-447). 모바일 카드 상태 프레임 없음 — 같은 칩·버튼을 모 |
| `quiz.article:guest4` | 게스트 · 모듈 4 (Login to Take Quiz) | 28960:130629 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#guestArticle · 게스트는 아티클 전문을 게이트 없이 열람(REQ-444) |
| `quiz.article:member5` | 회원 · 모듈 5 (Take the Quiz) | 28960:130685 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#article(V2.2는 모듈 4 기준) — Figma 회원 프레임은 모듈 5 |
| `quiz.play:q4` | 모듈 4 · 문항 2개 | 28960:130741 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#quiz · 4지선다 라디오, 기본 선택 없음, Submit 항상 활성(REQ-445) |
| `quiz.play:q5` | 모듈 5 · 문항 2개 | 28960:130764 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#quiz(모듈 5) |
| `quiz.play:val4` | 모듈 4 · 미응답 제출 차단 (Validation) | 28978:127308 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#unanswered |
| `quiz.play:val5` | 모듈 5 · Validation | 28978:127939 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#unanswered(모듈 5) |
| `quiz.play:login4` | 모듈 4 · 게스트 제출 → 로그인 필요 | 28978:127406 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | Figma에만 있는 상태 — G-207 확정 「게스트 제출 시 로그인 유도」 |
| `quiz.play:login5` | 모듈 5 · 로그인 필요 | 28978:128037 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | G-207 · 화면은 모듈 4 프레임과 같은 틀(모듈 5 프레임 대조 못 함) |
| `quiz.play:fail4` | 모듈 4 · 제출 실패 | 28978:127476 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#submitFail · G-207 답안 유지 + 재시도 |
| `quiz.play:fail5` | 모듈 5 · 제출 실패 | 28978:128107 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#submitFail(모듈 5) · 모듈 5 프레임 대조 못 함 |
| `quiz.play:score4` | 모듈 4 · 채점 불가 (정답·해설 로드 실패) | 28978:127543 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#answersFail |
| `quiz.play:score5` | 모듈 5 · 채점 불가 | 28978:128174 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#answersFail(모듈 5) · 모듈 5 프레임 대조 못 함 |
| `quiz.result:r0_4` | 모듈 4 · 0 / 2 | 28978:127606 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#result0 · 0점은 쿠폰 블록 없음 |
| `quiz.result:r1_4` | 모듈 4 · 1 / 2 | 28978:127673 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | Figma에만 있는 상태 — 점수 0/1/2별 보상 단계(REQ-442) |
| `quiz.result:r2_4` | 모듈 4 · 2 / 2 | 28978:127742 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#result |
| `quiz.result:done4` | 모듈 4 · 이미 완료 (재응시 없음) | 28978:127811 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | Figma에만 있는 상태 — G-205·G-207 「재응시 없음, 기존 결과 표시」 |
| `quiz.result:r0_5` | 모듈 5 · 0 / 2 | 28978:128237 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#result0(모듈 5) · 모듈 5 프레임 대조 못 함 |
| `quiz.result:r1_5` | 모듈 5 · 1 / 2 | 28978:128304 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | 모듈 5 프레임 대조 못 함 |
| `quiz.result:r2_5` | 모듈 5 · 2 / 2 | 28978:128373 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | V2.2 qz/QUIZ#result(모듈 5) |
| `quiz.result:done5` | 모듈 5 · 이미 완료 | 28978:128442 | DEX | MO — 기존 Quiz mWeb 「Quiz 4」 19604:32311 / 아티클 19604:32020 틀 + DEX PC 상태 문구 | 재사용 | G-205·G-207 · 모듈 5 프레임 대조 못 함 |
| `quiz.basics:normal` | 본문 교체 (거래 계정 · 자동 지급) | 19604:32207 | 기존 | MO — 기존 Quiz mWeb 아티클 19604:31955 틀 | 재사용 | [기존 MAX-] Quiz 「Signed In, Module 3」 — Cashback Basics 아티클 원문 · V2.2 cmn/BASICS#normal · REQ-714: 「Withdraw cashback and rewards」 문단의 UID 기준 |

## 집계 (상태 24개 × PC·모바일 = 48)

| 근거 종류 | 수 |
|---|---|
| DEX | 23 |
| 기존 | 2 |
| 재사용 | 23 |

어디에도 없음: 없음

## Figma에만 있는 상태 (지금 프로토타입에 없음 — 참고)

| 노드 | 내용 |
|---|---|
| 기존 카드 상태 「Default」 `19604:31403` · 「Quiz In progress」 `19604:31414` · 「Claiming rewards」 `19604:31436` | 카드 진행·수령 중 상태 |
| 기존 보상 다이얼로그 「You’ve earned 1 USDT」 `19604:32475` · 「You’ve earned 2 USDT」 `19604:32503` · `19604:32517` / 모바일 `19672:148299` · 「Option 1 (CHOSEN)」 `19604:32401` | 기존 퀴즈 제출 후 보상 팝업(DEX 결과 화면은 인라인) |
| 기존 「토스트 메세지 디자인」 `19604:31458` · `19604:31461` | 토스트 |

## 메모

- `quiz.basics`는 기존 「Signed In, Module 3」(`19604:32207`) 아티클 원문으로 다시 만들었다. REQ-714 교체 대상 3문장만 `[미정 G-419]`, 원문은 note에.
- 완료 카드는 기존 카드 상태 「Post claim rewards」(`19604:31447`) — 빨간 `Completed` 칩 + `View`.
- 모바일 퀴즈·결과·상태 화면은 DEX에 모바일 프레임이 없어 기존 Quiz mWeb 틀 + DEX PC 문구(재사용). 기존 mWeb 프레임 내용은 모듈 1이라 레이아웃 근거로만 썼다.
- 모듈 5 상태 프레임(Login required · Submit failed · Scoring unavailable · 결과 · 이미 완료)은 이번에도 스크린샷 대조를 하지 못했다(모듈 4와 같은 틀).
