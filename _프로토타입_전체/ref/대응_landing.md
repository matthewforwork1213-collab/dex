# 상태 → Figma 근거 대응 — 2. 랜딩 · 서비스 소개 (landing)

조사일 2026-11-26. Figma 연결 없이 로컬 색인(`ref/figma_index.tsv` · `ref/figma_pages/*.xml`)으로 찾았다. 확신 「후보」는 연결 후 스크린샷으로 확인한다. 셸 노드는 `대응_common.md` 1장.

## 기본 페이지 프레임

| 화면 | PC | 모바일 웹 | 메모 |
|---|---|---|---|
| 프리로그인 랜딩 | DEX 28960:128375 `Landing / Desktop / Light (DEX)` (1440×6948) | 기존 [MAX-] Landing Page Renewal `메인페이지_라이트모드` 19479:46652 (375×5915) · 최신 문구판 20932:96981(`update clause max-1208`) · 배경 보정판 20850:86758 | DEX PC는 Renewal PC 19479:46267(같은 1440×6948)을 바탕으로 함. 모바일은 DEX에 없어 Renewal 모바일이 근거 — 세 판 중 현행은 스크린샷으로 정함 |
| 이전 랜딩(참고) | [MAX-7] Web S1/S2 4060:49023 · 3448:22914+3448:22966 | [MAX-7] `Landing Page (Full)` 8549:141661 | Renewal 이전 판 |
| 서비스 소개 | DEX 28960:129521 `Service intro / PC / Light (DEX)` (1440×15907) | 기존 [MAX-1000] `서비스 소개_mo_라이트모드` 19224:4458 · 19224:5152 / 이전 [MAX-] Service Introduction mWeb 11435:88594 · mAPP 11490:108935 | DEX PC는 [MAX-1000] 19224:1267(같은 1440×15907) 기반 |
| 출금 피드 섹션 | DEX 28960:128520(랜딩 안) · 표 애니메이션 28960:129611(서비스 소개 안) | 없음(서비스 소개 모바일 안 피드 섹션 후보) | |

## 상태 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류 | 확신 | 찾은 키워드 |
|---|---|---|---|---|---|---|
| landing.main:normal | Our Partners·Featured에 DEX 포함 | PC 28960:128375 / mWeb 19479:46652 | DEX 28960:128375(Our Partners 28960:128420 · Most popular exchange 28960:128434) / 기존 모바일 19479:46652 · 20932:96981 | DEX(PC) · 기존(모바일) | PC 확실 · 모바일 후보 | `Landing` `메인페이지` |
| landing.main:heroDex | Hero Exchange = 운영자가 고른 DEX | PC 28960:128375 | 재사용: 「Most popular exchange」 카드 28960:128434(로고 인스턴스 28960:128438만 DEX로) | 재사용 컴포넌트 | 후보 | `Most popular exchange` `Hero` |
| landing.main:inactive | 비활성 파트너 슬롯 숨김 | PC 28960:128375 | 재사용: 「Our Partners」 목록 28960:128420(행 인스턴스 `거래소 호버` 28960:128430~433 중 한 행 제거) | 재사용 컴포넌트 | 후보 | `Our Partners` `inactive` |
| about.intro:normal | 파트너 캐러셀(DEX 포함) · 피드 · 거래 계정 문구 | PC 28960:129521 / mWeb 19224:4458 | DEX 28960:129521 / 기존 모바일 19224:4458 · 19224:5152 · 11435:88594 | DEX(PC) · 기존(모바일) | PC 확실 · 모바일 후보 | `Service intro` `서비스 소개` |
| about.intro:loading | 피드 불러오는 중 | PC 28960:129521 | 재사용 후보: [MAX-1244] Newsletter `L9 Loading` 23102:1009857 | 재사용 컴포넌트 | 후보 | `loading` `skeleton` |
| about.intro:empty | 피드 없음 | PC 28960:129521 | 재사용 후보: [MAX-1244] `L6 No results` 23102:1009851 | 재사용 컴포넌트 | 후보 | `empty state` `no data` `No results` |
| about.intro:error | 피드 실패 | PC 28960:129521 | 재사용 후보: [MAX-1244] `D11 Comments failed to load` 23102:1009879 | 재사용 컴포넌트 | 후보 | `load fail` `error` |
| about.feed:normal | CEX·DEX 시간순 · DEX 배지 · 마스킹 | PC 28960:128520 / mWeb 없음 | DEX 28960:128520 · 28960:129611 | DEX | 확실 | `Real-time cashback` `표 애니메이션` |
| about.feed:loading | 불러오는 중 | PC 28960:128520 | 재사용 후보 23102:1009857 | 재사용 컴포넌트 | 후보 | `loading` `skeleton` |
| about.feed:empty | 내역 없음 | PC 28960:128520 | 재사용 후보 23102:1009851 | 재사용 컴포넌트 | 후보 | `empty state` `No results` |
| about.feed:error | 불러오기 실패 | PC 28960:128520 | 재사용 후보 23102:1009879 | 재사용 컴포넌트 | 후보 | `load fail` `error` |

## 어디에도 없음

없음 — 단 피드 로딩·빈·실패의 재사용 후보는 **다른 페이지(Newsletter)** 컴포넌트다. 같은 랜딩·서비스 소개 페이지 안에는 스켈레톤·빈 상태·오류 컴포넌트가 없다(키워드 `skeleton` `loading` `empty` `error` `no data` — 랜딩·Renewal·[MAX-1000]·[MAX-] Service Introduction 0건). 다른 페이지 컴포넌트 재사용을 인정하지 않으면 이 6개 상태는 「어디에도 없음」이다 → `질문_landing.md`에 올린다.
