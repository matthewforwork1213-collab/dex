// ===== V2.2 · 배치 5b — 공통 (FU-011 · 076 · 083 ~ 088) =====
if(MODE==='user'){
const CM_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
// ---------- 헤더 · 드로어 · 푸터 · 앱 하단 내비 FU-083 · 085
function cmHeader(c){
 const right=c==='guest'?'<span class="lk">Login</span> <span class="btn sm">Sign up</span> ☀ 🌐':c==='bellFail'?'🔔<small>(안 읽음 점 숨김)</small> 👤 ☀ 🌐':'🔔• 👤 ☀ 🌐';
 const panel=c==='hover'?`<div class="c flat v22-menu"><div class="li">Centralised Exchanges</div><div class="li">Decentralised Exchanges</div><div class="li">Brokers</div></div>`:'';
 return `<div class="v22-gnb"><b>∞ TetherMax</b><span>Cashback ˅</span><span>Rewards Hub ˅</span><span>Discover ˅</span><span>Calculator</span><span class="v22-sp"></span><span>${right}</span></div>${panel}<div class="pg"><p class="sb">${T('Sticky header. Cashback click = hub, hover = exactly 3 rows. Collapses into the mobile drawer below the desktop breakpoint.','sticky 헤더. Cashback 클릭 = 허브, hover = 정확히 3행. 데스크톱 브레이크포인트 아래에서 모바일 드로어로 접힘')}${c==='bellFail'?' · 알림 피드·아바타 로드 실패 시 안 읽음 점만 숨기고 헤더를 막지 않음':''}</p></div>`;
}
function cmDrawer(c){
 const guest=c!=='member';
 return `<div class="pg v22-mobile"><div class="c v22-drawer">${c==='promo'?'<div class="c flat">[프로모 배너 — 선택]</div>':''}${guest?`<div class="c flat"><p>Welcome to TetherMax! Create an account or log in to start earning Cashback.</p><div class="row2">${v22Btn('Log In','sec')}${v22Btn('Sign Up')}</div></div>`:''}${['Cashback','Events','Benefits','Calculator','Newsletters','Points'].map(x=>`<div class="li"><span class="nm">${x}</span><span class="am">›</span></div>`).join('')}<div class="li"><span class="nm">☀ Theme · 🌐 Language</span></div><div class="sb">Terms of Use · Privacy Policy</div><div class="sb">About TetherMax · Notices · Beginner's Guide · Affiliate Partner Inquiry</div><div class="v22-fab">💬</div></div></div>`;
}
function cmFooter(){
 return `<div class="pg"><footer class="c v22-footer"><b>∞ TetherMax</b><div class="sb">support@tethermax.io ⧉ · ${T('Live chat','실시간 채팅')}</div><div class="row2"><div><b class="sb">Company</b><div class="sb">About TetherMax · Notices · Affiliate Partner Inquiry</div></div><div><b class="sb">Legal</b><div class="sb">Terms of Use · Privacy Policy</div></div></div><div class="sb">X · Telegram · YouTube · Instagram</div></footer></div>`;
}
function cmAppNav(c){
 const items=['Home','Events','Benefits','Exchange','Points'],on={normal:0,events:1,benefits:2,exchange:3,points:4}[c]||0;
 return `<div class="pg v22-mobile"><div class="c flat" style="min-height:220px">${c==='linkFail'?`<div class="dlg"><h3>Open EdgeX</h3><p class="sb">${T('The link could not open. Copy it or try again.','링크를 열 수 없음 — 다이얼로그·카드를 열어 둔 채 복사')}</p><div class="row2">${v22Btn(T('Copy link','링크 복사'),'sec')}${v22Btn('Open EdgeX')}</div></div>`:c==='inapp'?`<p class="sb">${T('Unsupported Cashback page → opens the web route in the in-app browser (no blank screen).','앱 빌드가 지원하지 않는 Cashback 페이지 → 인앱 브라우저로 웹 경로(빈 화면 금지)')}</p>`:`<p class="sb">${T('Cashback products are entered from the user menu.','Cashback 제품 진입점 = 사용자 메뉴')} ${CM_TBD('앱 Cashback 진입 위치 · 앱에서 DEX로 가는 경로','G-214')}</p>`}</div><div class="v22-tabbar">${items.map((x,i)=>`<span class="${i===on?'on':''}">${x}</span>`).join('')}</div><p class="sb">${T('Payouts never open the DEX.','출금은 절대 DEX를 열지 않음')}</p></div>`;
}
// ---------- Exchange Listings Page FU-084 (CEX만)
function cmListing(c){
 const cex=partnerList('CEX');
 return `${gnbPC()}<div class="pg"><section class="c"><h3>Top Centralised Exchanges</h3><div class="v22-round">${cex.map(p=>`<span>${v22Mk(p)}<small>${esc(p.name)}</small></span>`).join('')}</div></section><section class="c"><input class="v22-input" placeholder="Search for an exchange"><div class="tabs"><span class="on">Recommended</span><span>All</span><span>Cashback Boost</span><span>Events</span><span class="sb">▤ ▦</span></div>
 ${c==='cards'?`<div class="v22-tiles">${cex.map(p=>`<div class="c flat">${v22Mk(p)}<b>${esc(p.name)}</b><span class="sb">${p.rate}%</span></div>`).join('')}</div>`:`<div class="v21-table"><table class="t"><thead><tr><th>Exchange</th><th>Avg. Cashback</th><th>Rating</th><th>Live Campaigns</th></tr></thead><tbody>${cex.map((p,i)=>`<tr><td>${v22Mk(p)} ${esc(p.name)}</td><td>${p.rate}%</td><td>${['4.2 (23)','-','4.6 (41)'][i%3]}</td><td>${i}</td></tr>`).join('')}</tbody></table></div>`}
 <p class="sb">${T('CEX only — DEX appears only on the DEX overview and the hub comparison table. Rating under 20 reviews = "-", card view omits rating.','CEX만 — DEX는 DEX 개요·허브 비교표에만. Rating 20개 미만 "-", 카드 뷰 평점 생략')}</p></section></div>`;
}
// ---------- 공지 FU-086
function cmNotice(){
 return `${gnbPC()}<div class="pg"><section class="c"><h2>Notices</h2><div class="tabs">${['거래소 이벤트','테더맥스 이벤트','신규 거래소 추가','거래소 지원 종료','업데이트 소식','점검','신규 서비스','안내'].map((x,i)=>`<span class="${i===2?'on':''}">${x}</span>`).join('')}</div><div class="li"><span class="nm">[신규 거래소 추가] EdgeX 캐시백을 시작합니다<span class="sb">${T('Readable without login. Must not read as "TetherMax listed it" (TetherMax is not an exchange).','로그인 없이 열람 · 「테더맥스가 상장했다」로 읽히지 않게(BG-03)')}</span></span></div><p class="sb">${T('Notice content 6 languages / UI 15 languages. Email unsubscribe identified only by a signed token.','공지 콘텐츠 6개 언어 / UI 15개 언어. 수신거부는 서명 토큰으로만 식별')}</p></section></div>`;
}
// ---------- 약관 FU-088
function cmTerms(c){
 return `${gnbPC()}<div class="pg"><section class="c"><h2>${c==='use'?'Terms of Use':'Privacy Policy'}</h2>${c==='use'?`<h4>6.8</h4><p><s>Users who have their own user code can link multiple UIDs, but only their own UIDs can be bound.</s></p><p>→ ${CM_TBD('거래 계정(UID · 지갑) 기준 — 본인 지갑만 연동 가능','G-425 법무')}</p>`:`<h4>(b) ${T('Members','회원')}</h4><p>exchange name, exchange UID, exchange futures transaction history (date, volume) + ${CM_TBD('지갑 주소 · DEX 거래 기록(수수료·거래 시각 등)','G-425 법무')}</p><h4>(c) ${T('Non-members','비회원')}</h4><p class="sb">${T('Deleted — guest features removed','삭제 — 게스트 기능 폐지')}</p>`}</section></div>`;
}
// ---------- Beginner's Guide Cashback Basics FU-076
function cmBasics(){
 return `${gnbPC()}<div class="pg"><section class="c"><span class="sb">Beginner's Guide</span><h2>Cashback Basics</h2>
 <p><s>Minimum claim: … for a UID reaches 10 USDT</s> → ${CM_TBD('거래 계정 기준 문장','G-419')}</p>
 <p><s>Event reward rule: … for the same UID</s> → ${CM_TBD('거래 계정 기준 문장','G-419')}</p>
 <p><s>How: Members log in and click Claim from the home screen.</s> → ${CM_TBD('10 USDT 이상이면 자동 지급 문장','G-419')}</p>
 <p class="sb">${T('Guest sentence deleted (guest features removed).','게스트 문장 삭제 — 게스트 기능 폐지')}</p><p>Link your UID: 3 USDT <span class="sb">(${T('CEX first link only — kept','CEX 첫 연동만 — 그대로')})</span></p></section></div>`;
}
// ---------- DEX 정산 상태 라벨 FU-011
function cmLabels(c){
 const rows=[['Lighter','Accruing this week (estimate)',"Accruing this week (estimate) 4.20 USDT, added to your balance after Lighter's weekly settlement.",'합계 미포함 · 매시간 갱신'],['Lighter','Credited','월요일 주간 원장 수신 — 추정 줄 사라지고 원장 금액으로 교체 · Available Cashback에 가산',''],['Lighter','Withheld by Lighter after review','어뷰징 심사 보류 주차 — 미적립 · 초대 리워드 없음 · clawback 없음',''],['Lighter','Under the $1 minimum, not credited','주 $1 미만 — 미적립',''],['ApeX','Pending','일 원장 전 시간당 배치 — USDT 별도 줄, 합계 미포함',''],['EdgeX','DEX data pending','그날 원장 도착 전 — Exchange Cashback 불변',''],[T('All','공통'),'DEX data pending','원장 미수신 날짜 · 필수 필드 빠진 기록이 있는 날 — 0 표시 금지','']];
 return `${gnbPC()}<div class="pg"><section class="c"><h2>${T('DEX settlement status labels','DEX 정산 상태 라벨')}</h2><div class="v21-table"><table class="t"><thead><tr><th>DEX</th><th>${T('Label','라벨')}</th><th>${T('Meaning / copy','의미·문구')}</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td><span class="bdg gy">${r[1]}</span></td><td class="sb">${r[2]}</td><td class="sb">${r[3]}</td></tr>`).join('')}</tbody></table></div><p class="sb">${T('Lighter rows apply after onboarding (on hold).','Lighter 줄은 온보딩 후(보류 G-428)')} · ${T('If the Lighter tier is unknown, do not guess — show 연동 완료.','Lighter 등급을 못 받으면 추측하지 않고 연동 완료')}</p></section></div>`;
}
v22Group2('cmn','공통 · 내비게이션');
v22Register('cmn/HEADER',{label:'데스크톱 헤더',states:[['normal','로그인','REQ-464'],['guest','비로그인 — Login · Sign up','REQ-464'],['hover','Cashback hover 패널 3행','REQ-464'],['bellFail','알림·아바타 로드 실패','REQ-471']],render:cmHeader,fu:['FU-083']});
v22Register('cmn/DRAWER',{label:'모바일 웹 드로어',states:[['normal','비로그인 — 환영 블록','REQ-465 · 474'],['member','로그인','REQ-465'],['promo','프로모 배너 (선택)','REQ-465']],render:cmDrawer,fu:['FU-083']});
v22Register('cmn/FOOTER',{label:'푸터',states:[['normal','지원 · Company · Legal · 소셜','REQ-472']],render:cmFooter,fu:['FU-083']});
v22Register('cmn/APPNAV',{label:'앱 하단 내비',states:[['normal','Home 활성','REQ-469'],['events','Events 활성','REQ-469'],['exchange','Exchange 활성','REQ-469'],['inapp','미지원 Cashback 페이지 → 인앱 브라우저','REQ-470'],['linkFail','DEX 링크 실패 — 복사 + Open {DEX}','REQ-470']],render:cmAppNav,fu:['FU-085']});
v22Register('cmn/LISTING',{label:'Exchange Listings Page (CEX만)',states:[['normal','표 — Rating 열','REQ-466 · 475'],['cards','카드 뷰 — 평점 생략','REQ-466']],render:cmListing,fu:['FU-084']});
v22Register('cmn/NOTICE',{label:'공지',states:[['normal','카테고리 8개 · 신규 거래소 추가','REQ-468 · 473']],render:cmNotice,fu:['FU-086']});
v22Register('cmn/TERMS',{label:'약관 · 개인정보처리방침',states:[['normal','개인정보처리방침','REQ-717 · G-425'],['use','이용약관 6.8','REQ-718 · G-425']],render:cmTerms,fu:['FU-088']});
v22Register('cmn/BASICS',{label:"Beginner's Guide · Cashback Basics",states:[['normal','본문 교체','REQ-714 · G-419']],render:cmBasics,fu:['FU-076']});
v22Register('cmn/LABELS',{label:'DEX 정산 상태 라벨',states:[['normal','라벨 세트','REQ-047']],render:cmLabels,fu:['FU-011']});
}
