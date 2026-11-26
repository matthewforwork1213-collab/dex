# 사용자 확인 필요 — 공통 · 셸 · 계산기 · 기존 테더맥스

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| 없음 (푸터·드로어의 `Affiliate Partner Inquiry` 링크만) | 제휴 신청 화면 `partner.apply` | V2.2 · Figma에 화면 없음. LLM_wiki(service-intro)상 파트너십 CTA는 외부 Tally 폼(새 탭) | 사이트 안 화면을 만들지 않고 링크를 외부 폼으로 둔다. 프로토타입에는 설명 문서 화면만 둠 |
| 없음 (랜딩 안 FAQ 블록 3677:42998만) | FAQ 단독 화면 `faq.main` | V2.2·Figma에 단독 화면 없음. 기존 고객지원은 Zendesk Help Center | 코어 푸터의 `FAQ` 링크를 Help Center로 보내고 단독 화면은 만들지 않는다 |
| 없음 (푸터 `Live Chat` · 떠 있는 상담 버튼) | 고객지원 `support.main` | 사이트 안 문의 화면 근거 없음. LLM_wiki: Zendesk 실행 버튼 | 화면을 만들지 않고 Zendesk 위젯 실행으로 둔다 |
| DEX 설계 파일 E1 (bqb4Y2jQwMFpbhRmMbfBK9 · 1279:499846) | GNB `Cashback` hover 패널 3행 | 명세 REQ-464는 hover 패널 3행, Figma 설계는 「클릭 = 허브」만 있고 패널 프레임 없음. 터치 동작 G-213 미정 | 패널 디자인 요청(또는 패널 없이 허브 이동만 할지 결정) |
| `<BottomNavigation>` 8582:155585 | 앱 하단 탭 이름 | Figma `Exchanges` · `Point`, 명세 `Exchange` · `Points`, 코어 셸은 5번째 탭이 `My` | G-215 결정 후 코어 `moNav()` 정정 |
| 모바일 드로어 12085:400249 | 드로어 제품 항목 | Figma `Exchanges · … · Cashback Preview · Point` vs 명세 `Cashback, Events, Benefits, Calculator, Newsletters, Points` | 명세대로 만들었음 — 디자인 갱신 요청 |
| Footer/Web 4639:42858 | Legal 링크 문구 | 푸터는 `Terms of Service`, 드로어·명세는 `Terms of Use` | 한쪽으로 통일 |
| 계산기 P2 (29064:934 · 6510:88151) | 계산기 CEX 타일 | 기존 프레임은 CEX 전 거래소, 새 프레임은 DEX 3곳만 — `All` 칩의 CEX·DEX 혼합 그리드·순서(백오피스)는 프레임 없음 | 혼합 그리드 프레임 요청 |
| `FooterA` 28967:127334(DEX(revision) IF7 · Newsletter 22회 · Quiz) vs `Footer/Web` 4639:42858 | 웹 푸터 현행 판 | FooterA는 섹션 3개(`Economic Calendar` · `Heatmaps` 포함)·버튼 2개·`Footer note`로 Footer/Web과 구성이 다름 | 현행 판 지정. 프로토타입 셸은 지정된 판으로 맞춤 |
| [MAX-] Quiz GNB 드롭다운 19604:32651 | GNB 드롭다운 항목 | 기존 Rewards Hub = `Exchanges Events · Benefits · Points`, Discover = `Beginner's Guide · About TetherMax`. 코어 NAV는 리그·맥스보드·랭킹·공지까지 넣음. DEX 컴포넌트 설명은 Cashback = CEX · DEX · Brokers만 | Rewards Hub·Discover 항목을 기존 드롭다운대로 둘지, 리그·맥스보드·랭킹·공지를 넣을지 결정 |
| 모바일 셸 — 앱 하단 탭 8582:155585 · 25854:1340444([MAX-829] 최신판) | 모바일 웹에 하단 탭이 있는지 | 하단 탭은 mAPP 프레임에만 있고 mWeb 프레임은 상단 바 + 햄버거. 코어는 모든 모바일 화면에 하단 탭 | 프로토타입 모바일 보기를 mWeb 기준(하단 탭 없음)으로 바꾸고 앱 탭은 `cmn.appnav`에서만 보일지 결정 |
| [MAX-508] 오류·초대 코드·비밀번호 재설정 · [MAX-22] 검색 결과 · [MAX-497] 404 · [MAX-273] 점검·앱 업데이트 · 긴급 공지 팝업 | 기존 화면 상태 추가 범위 | V2.2에 없는 기존 화면 상태가 Figma에 많음(`대응_cex.md` · `대응_common.md` 3장) | 404 · 점검 · 앱 업데이트 · 긴급 공지 · 게스트 복귀 로그인/가입은 넣고, 로그인·가입 오류·재설정은 요청 시 |
| 드로어 19604:33156 · 19604:32998 vs 명세 REQ-465 | 드로어 제품 항목 | 최신 기존 드로어 = Exchanges · Brokers · Events · Benefits · Cashback Calculator · Point. 명세 = Cashback · Events · Benefits · Calculator · Newsletters · Points | 실제 제품 기준으로 Figma대로 구현함. 명세를 Figma에 맞출지, Newsletters 행 디자인을 받을지 결정 |
| 거래소 목록 22598:410917 | 명세 Rating 열 | Figma 표에 Rating 열 없음(REQ-466) | Figma대로 구현(열 없음). Rating 열 디자인 요청 또는 명세 조정 |
| 앱 필수 업데이트 2913:17755 | 버튼·폰트가 옛 앱 스타일(#0b7aff · r10 · Pretendard) | 현재 디자인 시스템과 다름 | 현재 버튼으로 표시함. 개정 프레임 필요 여부 |
