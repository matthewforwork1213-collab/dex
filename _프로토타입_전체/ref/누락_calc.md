# 디자인 누락 목록 — 9. 계산기 /payback (calc)

Figma 원본: 기존 페이지 `[MAX-146] Cashback Calculator`(3565:13728)의 Web section(6510:89547) · mWeb section(8135:170235) · MAXOP-405(17996:179540), DEX(revision)의 `계산기 · 계산 과정`(29064:934 · 29064:1384).

## 1. 디자인 없는 상태

[기존 MAX-146] 같은 화면 프레임에서 요소만 빼거나 값만 바꾸는 상태(p1:noUsers · p3:normal · p4:normal · p5 DEX 4개)는 재사용으로 처리했다(근거 `대응_calc.md`). 어디에도 없는 것은 아래뿐이다.

| 화면id:상태 | 상태 설명 | 무엇이 빠졌나 |
|---|---|---|
| calc.p3:normal (일부) | 빈도 선택됨 | MAX-146 P3 세 프레임(6510:88401 · 8135:170237 · 7260:73533) 모두 미선택 — 빈도 카드 선택 스타일은 P2 타일 선택 스타일로 대신함 |
| calc.p5 DEX 4개 (일부) | EdgeX · Aster · ApeX · Lighter Summary | DEX 각주·Weekly 표기의 Figma 문구(현재 명세 REQ-459·462 문구) |

## 2. 한쪽 화면만 디자인 있음

| 화면id:상태 | 있는 쪽 | 빠진 쪽 |
|---|---|---|
| calc.p5:mobile | 모바일 (8135:170693) | PC(모바일 전용 상태) |

## 3. 만들지 않는 상태

| 화면id:상태 | V2.2 키 | 이유 |
|---|---|---|
| calc.p3l:normal (doc) | pbk/P3L#normal | REQ-457 · G-210: Lighter 계정 유형 단계(PB-5) 삭제 확정 — 문서 화면으로만 남김(누락 집계 제외) |

## 4. 명세 우선 적용 · 대조 메모

| 대상 | 내용 |
|---|---|
| P1 리드 문구 | Figma `See how much cashback are you missing out.` → 명세 REQ-454 `See how much cashback you're missing out on, across exchanges, DEXs and brokers.` |
| P5 첫 줄 라벨 | Figma `Exchange` → 명세 REQ-459 `Platform` |
| P2 · P3 · P4C 레이아웃 | P1 · P4 · P5는 `get_design_context`로 대조(에셋 내려받음). P2(29064:934)는 스크린샷 대조, P3 · P4C는 저해상도 개요 스크린샷만 보고 만듦 — 툴팁 문구·계산 중 애니메이션(「Pending animation from Khoa」)·P3 카드 세부 간격 미대조 |
| CEX 타일 로고 | 계산기 원본 타일 에셋이 아니라 연동 모듈의 Figma 로고를 복사해 씀 |
