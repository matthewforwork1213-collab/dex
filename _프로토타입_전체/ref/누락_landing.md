# 디자인 누락 — 2. 랜딩 · 서비스 소개

| 화면id:상태 | 상태 설명 | V2.2 키 | 찾아본 키워드 | 가장 가까운 프레임 | 무엇이 빠졌나 |
|---|---|---|---|---|---|
| landing.main:heroDex | Hero Exchange = DEX | etc/PLP#heroDex | Most popular exchange · Hero | 28960:128434 | DEX를 고른 변형(같은 카드 재사용 가능 — 재사용 처리 전) |
| landing.main:inactive | 비활성 파트너 슬롯 숨김 | etc/PLP#inactive | Our Partners · inactive | 28960:128420 | 슬롯 숨김 후 목록(같은 카드 재사용 가능) |
| about.intro:loading · empty · error / about.feed:loading · empty · error | 피드 로딩·빈·실패 | etc/ABOUT · etc/FEED | skeleton · loading · empty · error · no data | 재사용 후보 [MAX-1244] L9 Loading 23102:1009857 · L6 No results 23102:1009851 · D11 failed 23102:1009879 | 랜딩·서비스 소개 페이지 안에는 없음. 재사용 결정은 났으나 아직 그 컴포넌트대로 다시 그리지 못함 |

## 모바일

| 화면 | 상태 |
|---|---|
| landing.main 모바일 | 기존 Renewal 모바일 19479:46652 · 최신 문구판 20932:96981이 있음 — **아직 구현 안 함**(PC 화면을 좁혀 보여 줌) |
| about.intro 모바일 | [MAX-1000] 19224:4458 · 19224:5152 — **아직 구현 안 함** |
