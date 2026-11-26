# 질문 — 2. 랜딩 · 서비스 소개

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| 랜딩 피드 표 28960:128525 · 서비스 소개 표 28960:129611 | Partner 열이 로고만 있고 `DEX` 배지가 없음 | REQ-285는 「거래소 이름 옆 DEX 배지」를 요구 | 프로토타입은 로고 옆에 `DEX` 배지를 덧붙임(정책 우선). 디자인에 배지 자리 추가 요청 |
| 랜딩 「Our Partners」 28960:128420 · 「Most popular exchange」 28960:128434 | V2.2의 `Featured Exchanges`(#1~#4 순위 슬롯)·`Hero Exchange`(Promo Tagline·CTA Button Title)를 이 두 카드로 대응시켰음 | Figma에 모듈 라벨 `Exchange`·운영자 입력 문구 자리가 드러나지 않음(REQ-288) | 대응이 맞는지 확인. 맞으면 Hero 카드의 「Official Partner Exchanges」·「Browse Partner Exchange」가 운영자 입력 자리인지 확인 |
| 랜딩 TOP 5 Traders 28960:128445 · Our Partners | 표본 로고가 이름과 다름(BingX trader = Bitunix 로고, Bitmart trader = OKX 로고, Gate = BVOX 로고) | 디자인 표본 데이터 오류로 보임 | Figma 그대로 옮김. 실제는 레코드 로고 사용 |
| 피드 빈 상태·실패(etc/FEED · etc/ABOUT) | 문구 원문 없음 | G-137 확정은 「완료 건만·실패 사유 미표시」뿐, 빈/실패 문구는 없음 | 문구표에 빈 상태·실패 문구 추가 요청 |
| 서비스 소개 28960:129521 전체 | 한국어 원문 없음 | G-419 「문구표에서 확정」 — 문구표 미수신 | 국문 문구표 수신 후 반영 |
| [MAX-1244] Newsletter `L9 Loading` 23102:1009857 · `L6 No results` 23102:1009851 · `D11 Comments failed to load` 23102:1009879 | 피드 로딩·빈·실패(about.intro · about.feed 6상태)의 재사용 후보 | 랜딩·서비스 소개 페이지 안에는 스켈레톤·빈·오류 컴포넌트가 없어 다른 페이지 컴포넌트뿐 | 다른 페이지 컴포넌트 재사용을 인정할지 결정. 인정하지 않으면 6상태를 「디자인 없음」으로 둔다 |
| 랜딩 모바일: Renewal 19479:46652 · `update clause max-1208` 20932:96981 · `bg blending` 20850:86758 | 랜딩 모바일 근거 | DEX(revision)에는 랜딩 PC만 있고, 기존 Renewal 모바일이 세 판 | 현행 판 지정(스크린샷 대조 후 제안) |
