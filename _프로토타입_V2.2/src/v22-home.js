// ===== V2.2 · 배치 3 — 홈·계정 상세 (FU-037 ~ FU-044) =====
if(MODE==='user'){
const HM_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
const HM_ACC=()=>[
 {partner:'bitget',identifier:'123456789',cash:14,reward:0,st:'연동 완료'},
 {partner:'edgex',identifier:SAMPLE_WALLET,cash:120,reward:20,st:'연동 완료'},
 {partner:'apex',identifier:SAMPLE_WALLET2,cash:14,reward:0,st:'연동 완료'},
 {partner:'aster',identifier:V22_WALLET_UNKNOWN,cash:3.2,reward:0,st:'연동 완료'}];
const hmDot=st=>({'연동 완료':'ok','연동 시도중이에요':'wn','소유 확인중':'wn','이슈':'rd','연동 실패':'rd','소유 확인 실패':'rd','연동 해제':'gy','Inactive':'gy','Data delayed':'wn','No cashback yet':'gy'}[st]||'gy');
function hmRow(a,o={}){
 const p=pBy(a.partner),dex=p.type==='DEX',amt=a.amt!==undefined?a.amt:money(floor2(a.cash+Math.min(a.reward,a.cash)));
 const id=dex?(o.app?'':'Wallet ')+`<span class="mono" title="${esc(a.identifier)}">${esc(o.full?a.identifier:v22Short(a.identifier))}</span>`:'UID '+esc(mask(a.identifier));
 return `<div class="li" data-go="${dex?'home/LKD':'home/S4'}">${v22Mk(p)}<span class="nm">${esc(p.name)}<span class="sb">${id} · <i class="v22-dot ${hmDot(a.st)}"></i>${esc(a.st)}</span>${a.extra||''}</span><span class="am">${amt}${amt==='-'?'':'<small>USDT</small>'}</span></div>`;
}
// ---------- S3 홈 FU-037
function hmS3(c){
 if(c==='app')return `${gnbPC()}<div class="pg v22-mobile"><section class="c"><div class="kv big"><span class="k">Total Cashback Balance</span><span class="v">0.00 USDT</span></div>${v22Auto()}</section><section class="c v22-center"><h3>Link once and cashbacks keep coming</h3><p class="sb">${HM_TBD('cashbacks keep coming / cashback keeps coming 문구 확인','사용자 확인 #48')}</p>${v22Btn('Link Account','','data-go="link/SEL"')}</section></div>`;
 const pending=c==='pendingOnly';
 return `${gnbPC()}<div class="pg"><section class="c"><div class="kv big"><span class="k">Total Cashback Balance</span><span class="v">0.00 USDT</span></div>${v22Auto()}</section>
 <section class="c"><h3>Unlock Your First Cashback in 3 Steps!</h3>
  <div class="li"><span class="ava">✓</span><span class="nm">1 Create TetherMax account</span></div>
  <div class="li"><span class="ava">2</span><span class="nm">Browse partners</span></div>
  <div class="li" data-go="link/SEL"><span class="ava">3</span><span class="nm">Link your account with us <span class="bdg ok">3 USDT</span><span class="sb">${T('3 USDT applies to a first CEX UID link only — not shown on the DEX first-link path','3 USDT는 CEX UID 첫 연동만 — DEX 첫 연동 경로에서는 안내하지 않음')}</span></span></div></section>
 <section class="c" data-go="pbk/P1"><h3>Cashback Preview</h3><p>1,284 of our users earn an average of 12 USDT to 380 USDT in cashback per month.</p><p class="sb">${HM_TBD('Cashback Preview 수치 출처','G-211')}</p></section>
 ${pending?`<section class="c"><h3>Linked Accounts</h3>${hmRow({partner:'edgex',identifier:SAMPLE_WALLET,cash:0,reward:0,st:'연동 시도중이에요',amt:'-'})}<p class="sb">${HM_TBD('확인 중 계정만 있을 때 S3 / S4','G-070')}</p></section>`:''}</div>`;
}
// ---------- S4 홈 FU-038 · 039
const HM_STATUS=[['소유 확인중','-','REQ-272 ①'],['연동 시도중이에요','-','REQ-098 ②'],['이슈','-',''],['연동 완료','120.00',''],['연동 실패','-',''],['소유 확인 실패','-',''],['연동 해제','-','']];
function hmS4(c){
 if(c==='guest')return nativePublic('home/PUBLIC');
 let acc=HM_ACC();const app=c==='app';
 if(c==='chips')acc=[{partner:'edgex',identifier:SAMPLE_WALLET,cash:0,reward:0,st:'No cashback yet',extra:`<span class="sb">${HM_TBD('0원 칩 명칭 · DEX별 배너','G-058 · G-110')}</span>`},{partner:'aster',identifier:SAMPLE_WALLET2,cash:3.2,reward:0,st:'Data delayed',extra:`<span class="sb">Last updated ${shortTime('2026-10-22T09:00:00Z')}</span>`},{partner:'apex',identifier:V22_WALLET_UNKNOWN,cash:12.4,reward:0,st:'Inactive',extra:'<span class="sb">DEX 오프보딩</span>'},{partner:'apex',identifier:SAMPLE_WALLET2,cash:0,reward:0,st:'연동 완료',extra:`<span class="sb">${HM_TBD('ApeX AccountID 미반환 · 제한 IP 칩','G-177')}</span>`}];
 if(c==='statuses')acc=HM_STATUS.map(([st,amt],i)=>({partner:['edgex','apex','aster','edgex','apex','aster','edgex'][i],identifier:[SAMPLE_WALLET,SAMPLE_WALLET2,V22_WALLET_UNKNOWN][i%3],cash:amt==='-'?0:120,reward:0,st,amt:amt==='-'?'-':money(120)}));
 if(c==='many')acc=[...acc,...Array.from({length:8},(_,i)=>({partner:['bybit','okx','edgex','apex','aster','bitget','edgex','okx'][i],identifier:i%2?SAMPLE_WALLET2:String(600000000+i),cash:5+i,reward:0,st:'연동 완료'}))].map(a=>pBy(a.partner).type==='CEX'&&/^0x/.test(a.identifier)?{...a,identifier:'7000'+a.cash}:a);
 const total=acc.filter(a=>!['연동 시도중이에요','소유 확인중','연동 실패','소유 확인 실패','연동 해제'].includes(a.st)).reduce((s,a)=>s+a.cash,0);
 const card=c==='loading'?`<section class="c v22-skel"></section>`:c==='error'?`<section class="c">${v22Note("We can't load your balance right now.",'warn')}${v22Btn('Try again','sec sm')}</section>`
  :`<section class="c"><div class="kv big"><span class="k">Total Cashback Balance</span><span class="v">${money(total)} USDT</span></div>${c==='delayed'?`<p class="sb">Last updated ${shortTime('2026-10-23T00:30:00Z')}</p>`:''}${v22Auto()}</section>`;
 const banner=c==='delayed'?v22Note(`신규 적립 내역 반영이 지연되고 있습니다. 기존 확정 잔액은 그대로이며 출금할 수 있어요. ${HM_TBD('자동 지급 기준으로 다시 쓰기','G-419')}`,'warn'):'';
 const rows=c==='loading'?'<div class="li v22-skel"></div><div class="li v22-skel"></div>':(c==='many'?acc.slice(0,10):acc).map(a=>hmRow(c==='delayed'&&a.partner==='aster'?{...a,extra:`<span class="sb">Last updated ${shortTime('2026-10-22T09:00:00Z')}</span>`}:a,{app,full:c==='full'})).join('');
 const footer=app?'Trading on multiple exchanges? Link more':'Using multiple platforms? Link more accounts';
 return `${gnbPC()}<div class="pg ${app?'v22-mobile':''}">${card}${banner}<section class="c"><div class="ch"><h3>Linked Accounts</h3><span class="more">See All</span></div><div class="v22-scroll">${rows}</div>${c==='many'?`<div class="v22-more">${T('See more','더보기')} (${acc.length-10})</div>`:''}<div class="sb" style="margin-top:11px;color:var(--primary)" data-go="link/SEL">${footer}</div></section>
  ${c==='statuses'?`<p class="sb">상태 우선순위 = 기존 UID 7단계(소유 확인중 1 → 연동 해제 7). 상태 겹침 규칙 ${HM_TBD('데이터 지연·로드 실패 겹침','G-060')}</p>`:''}
  <section class="c"><div class="ch"><h3>${T('Member benefits','회원 전용 혜택')}</h3><span class="more">${T('See All','모두 보기')}</span></div><div class="row2"><div class="c flat" data-go="bnf/UIDM"><div class="nm">${T('Link a CEX UID to Get Cashback','CEX UID 연동하고 캐시백 받기')}</div><div class="sb">3 USDT · CEX 전용</div></div><div class="c flat" data-go="etc/EVT"><div class="nm">${T('Exchange events','거래소 이벤트')}</div></div></div></section></div>`;
}
nativeHome=function(){return hmS4(state.route==='home/S4'?(state.previewCase||'normal'):'normal')};
// ---------- DEX 지갑 상세 FU-040
function hmWallet(c){
 const p=pBy('edgex'),a={identifier:SAMPLE_WALLET,cash:c==='zero'?0:100,reward:c==='zero'||c==='noReward'?0:20};
 const avail=floor2(a.cash+Math.min(a.reward,a.cash)),wd=c==='zero'?0:avail;
 const days=[['16','+25.00'],['17','+0.06'],['18',''],['19','-20.00'],['20','+0.05'],['21',''],['22','+0.42']];
 return `${gnbPC()}<div class="pg"><div class="v22-head"><span data-go="home/S4">←</span><h2>${v22Mk(p)} ${esc(p.name)}</h2></div>
 <section class="c"><div class="li"><span class="nm"><span class="mono">${esc(a.identifier)}</span> <span class="v22-copy" title="copy">⧉</span></span><span class="bdg ok">${c==='pending'?'연동 시도중이에요':'연동 완료'}</span></div>
  <div class="kv big"><span class="k">Available Cashback</span><span class="v">${c==='pending'?'-':money(avail)+' USDT'}</span></div>
  <div class="kv"><span class="k">Exchange Cashback</span><span class="v">${money(a.cash)} USDT</span></div>${a.reward>0?`<div class="kv"><span class="k">Event Reward</span><span class="v">${money(a.reward)} USDT</span></div>`:''}
  ${c==='delayed'?`<p class="sb">Last updated ${shortTime('2026-10-22T00:00:00Z')}</p>`:''}
  <div class="v22-prog"><div class="gg"><i style="width:${Math.min(100,wd*10)}%"></i></div><span class="sb">Withdrawable ${money(wd)} USDT · Minimum 10 USDT ${HM_TBD('영문 withdraw → Claim 계열','G-419')}</span></div>${v22Auto()}
  ${c==='totalClaimed'?`<div class="kv"><span class="k">Total Claimed</span><span class="v">240.00 USDT</span></div><p class="sb">${HM_TBD('Total Claimed 유지 여부','G-053')}</p>`:''}
  ${c==='subaccounts'?`<p class="sb">${HM_TBD('Lighter 하위 계정(account_index) 나열 여부','G-178')}</p>`:''}</section>
 <section class="c"><div class="ch"><h3>Weekly Cashback History</h3><span class="more">View All</span></div><div class="v22-week">${days.map(([d,v])=>`<span><small>${d}</small><b class="${v.startsWith('-')?'neg':''}">${v||'—'}</b></span>`).join('')}</div></section>
 ${c==='reviewed'?'':`<section class="c"><h3>How was ${esc(p.name)}?</h3><p class="sb">Your first review earns you 2 USDT. It takes about a minute.</p>${v22Btn('Write a review, get 2 USDT','','data-go="exd/D2"')}</section>`}
 <section class="c"><div class="ch"><h3>Exclusive Benefit</h3><span class="more">See All</span></div><div class="sb">${T('Exchange events','거래소 이벤트')}</div></section>
 <section class="c"><h3>Top Partner DEXs</h3>${['apex','edgex','aster'].map(id=>{const x=pBy(id);return `<div class="li">${v22Mk(x)}<span class="nm">${esc(x.name)}<span class="sb">Up to ${x.rate}% cashback</span></span></div>`}).join('')}<p class="sb">${HM_TBD('사용자 노출 캐시백율 실값','G-003')}</p></section>
 <section class="c"><h3>${T('Cashback timeline','캐시백 타임라인')}</h3><div class="v22-steps2"><span>Start Trading<small>${v22Clock('00:00')}</small></span><span>Cut-off Time<small>${v22Clock('23:59')}</small></span><span>Updated<small>${v22Clock('01:00')}</small></span></div><p class="sb">${HM_TBD('「최대 1시간 차이」 DEX 기준 재작성','REQ-282')}</p></section></div>`;
}
// ---------- 타임라인 · 누적 캐시백 FU-041
function hmTimeline(c){
 const ex={normal:['EdgeX','Daily D+1'],apex:['ApeX','D+2'],lighter:['Lighter','Weekly W+1']}[c]||['EdgeX','Daily D+1'];
 const compact=c==='compact';
 return `${gnbPC()}<div class="pg"><section class="c"><h3>${T('Cashback timeline','캐시백 타임라인')} · ${ex[0]}</h3>
  ${compact?`<div class="v22-steps2">${['거래 집계','거래소 정산 확인','테더맥스 확인','캐시백 반영 완료'].map(s=>`<span>${s}</span>`).join('')}</div>`
  :`<div class="v22-steps2">${['거래 집계 중','지급 대기','지급 처리 중','지급 완료'].map((s,i)=>`<span class="${i<2?'on':''}">${s}</span>`).join('')}</div>`}
  <div class="kv"><span class="k">대상 거래 기간</span><span class="v">${ex[0]==='Lighter'?'월 ~ 일':'10/21 '+v22Clock('00:00')+' ~ 10/22 '+v22Clock('00:00')}</span></div>
  <div class="kv"><span class="k">지급 주기</span><span class="v">${ex[1]}${ex[0]==='ApeX'?' '+HM_TBD('ApeX 주기·4단계 적합성','G-192 · G-025'):''}</span></div>
  <div class="kv"><span class="k">지급 시각</span><span class="v">${v22Clock('01:00')}</span></div>
  <div class="kv"><span class="k">지급처</span><span class="v">${T('Account','거래 계정')} ${HM_TBD('지급처 중립어 문안','G-192')}</span></div>
  ${c==='warning'?v22Note('거래소별로 순차 지급하고 있어서 몇 분 더 걸릴 수 있어요.','warn'):''}</section>
 <section class="c"><h3>${T('Cumulative cashback','누적 캐시백')} <span class="sb" title="거래로 인한 캐시백과 이벤트 리워드를 합산한 금액을 표시합니다.">ⓘ</span></h3><p class="sb">거래로 인한 캐시백과 이벤트 리워드를 합산한 금액을 표시합니다.</p>
  <div class="kv"><span class="k">누적 캐시백 금액</span><span class="v">1,284.20 USDT</span></div><div class="kv"><span class="k">이번 달 캐시백</span><span class="v">151.20 USDT</span></div><div class="kv"><span class="k">누적 출금 금액</span><span class="v">920.00 USDT</span></div>
  <p class="sb">4개 거래 계정 합산 · ${v22Clock('00:30')} ${HM_TBD('거래소별 갱신 시각 캡션 형식','G-191')}</p></section></div>`;
}
// ---------- 실시간 출금 피드 FU-042
function hmFeed(c){
 const rows=[[SAMPLE_WALLET,'EdgeX',true,'120.00','2026-10-23T02:31:00Z'],['123456789','Bitget',false,'19.50','2026-10-23T02:30:00Z'],[SAMPLE_WALLET2,'Aster',true,'32.22','2026-10-23T02:26:00Z'],['987654321','OKX',false,'14.17','2026-10-23T02:25:00Z']];
 const body=c==='loading'?'<tr><td colspan="5" class="v22-skel"></td></tr>':c==='empty'?`<tr><td colspan="5">${HM_TBD('피드 빈 상태 문구','G-137')}</td></tr>`:c==='error'?`<tr><td colspan="5">${HM_TBD('피드 로드 실패 문구','G-137')}</td></tr>`
  :rows.map(([id,ex,dex,amt,t])=>`<tr><td class="mono">${dex?esc(id):'****'+esc(id.slice(-4))}</td><td>${ex}${dex?' <span class="bdg gy">DEX</span>':''}</td><td>${amt} USDT</td><td>${shortTime(t)}</td><td>${T('Completed','완료')}</td></tr>`).join('');
 return `${gnbPC()}<div class="pg"><section class="c"><h2>지금 이 순간에도 누군가는 캐시백을 받고 있어요</h2><p class="sb">쌓인 캐시백을 한 푼도 빠짐없이 받아가세요</p><div class="v21-table"><table class="t"><thead><tr><th>거래 계정</th><th>거래소</th><th>캐시백</th><th>출금 시각</th><th>상태</th></tr></thead><tbody>${body}</tbody></table></div><p class="sb">${T('Failed payouts are not listed (no Sent).','실패 건은 Sent가 없어 표시하지 않음')} · ${T('Update cadence differs by DEX','DEX마다 갱신 주기 다름 (EdgeX 일간 · ApeX·Aster 확정 후 · Lighter 월요일)')} ${HM_TBD('ApeX·Aster 주기','G-025 · G-036')}</p></section></div>`;
}
// ---------- 서비스 소개 · TP 문구 FU-043
function hmAbout(c){
 const partners=lkLinkablePartners();
 return `${gnbPC()}<div class="pg"><section class="c v22-center"><h2>${T('Official partner exchanges','공식 파트너 거래소')}</h2><div class="v22-round">${partners.map(p=>`<span>${v22Mk(p)}<small>${esc(p.name)}</small>${p.type==='DEX'?'<small class="bdg gy">DEX</small>':''}</span>`).join('')}</div><p class="sb">${T('Content, logos, order and visibility come from the exchange records (API) — no fixed list','표시 내용·로고·순서·노출은 거래소 레코드(API) — 고정 목록 없음')} · DEX ${HM_TBD('DEX 항목 문구·위치','G-190')}</p></section>
 <section class="c"><h3>${T('How it works','이용 방법')}</h3><p>Join an exchange with your TetherMax code and just enter your UID.</p><p class="sb">→ ${HM_TBD('UID → 거래 계정 문구 (links a UID · UID linked 포함)','G-419')}</p></section>
 <section class="c"><h3>TetherMax Point</h3><p>trade using the exchange UID linked to your TetherMax account</p><p class="sb">→ ${HM_TBD('UID → 거래 계정 문구','G-419')}</p></section>${hmFeed(c).replace(gnbPC(),'')}</div>`;
}
const lkLinkablePartners=()=>partnerList('ALL').filter(p=>p.id!=='lighter');
// ---------- 프리로그인 랜딩 FU-043
function hmPrelogin(c){
 const hero=c==='heroDex'?pBy('edgex'):pBy('bitget');
 return `${gnbPC()}<div class="pg"><section class="c v22-center"><span class="sb">Hero Exchange</span><h2>${v22Mk(hero)} ${esc(hero.name)}</h2><p>${c==='heroDex'?'[Promo Tagline — 운영자 입력 EN·KO]':'Promo Tagline'}</p>${v22Btn(c==='heroDex'?'[CTA Button Title — 운영자 입력]':'CTA Button Title')}</section><section class="c"><h3>Featured Exchanges</h3><div class="v22-tiles">${['bitget','edgex','okx','apex'].map((id,i)=>{const p=pBy(id);return `<div class="c flat"><span class="sb">#${i+1} Exchange</span>${v22Mk(p)}<b>${esc(p.name)}</b></div>`}).join('')}</div>${c==='inactive'?v22Note(HM_TBD('Featured·Hero 파트너가 비활성일 때','G-259 · G-260'),'warn'):''}</section></div>`;
}
// ---------- 홈 FAQ FU-044
function hmFaq(c){
 return `${gnbPC()}<div class="pg"><section class="c"><h2>FAQs</h2>
 <details open><summary>${T('How do I get cashback?','캐시백은 어떻게 받나요?')}</summary><p>…select your exchange, UID, and cashback type… → ${HM_TBD('UID → 거래 계정 답변','G-419')}</p></details>
 <p class="sb">비회원 조회 안내 답변 2건(Search for your exchange and UID …)은 삭제 — 게스트 기능 폐지(REQ-711)</p></section></div>`;
}

v22Retire('home/EXP');
v22Register('home/S3',{group:'홈',label:'S3 홈 (연동 0)',after:'S4',states:[['normal','웹 — 체크리스트 · Cashback Preview','REQ-267'],['app','앱·모바일웹 빈 홈 카드','REQ-267 · 사용자 확인 #48'],['pendingOnly','확인 중 계정만 있음','REQ-266 · G-070']],render:hmS3,fu:['FU-037']});
v22Register('home/S4',{label:'S4 홈 (연동 있음)',states:[['normal','CEX·DEX 한 목록 · 총액 = 매칭 전 합계','REQ-268 · 271'],['statuses','상태 7단계 행','REQ-272'],['chips','DEX 칩 — No cashback yet · Data delayed · Inactive','REQ-273'],['loading','로딩 — 스켈레톤','REQ-269 · 271'],['error','잔액 로드 실패','REQ-269'],['delayed','DEX 원장 지연','REQ-269 · 274'],['many','계정 11개 이상','REQ-271'],['app','앱·모바일웹 — Wallet 라벨 없음 · 푸터','REQ-271'],['full','지갑 전체 주소 펼침','REQ-271'],['guest','비로그인 (공개 화면)','REQ-176']],render:hmS4,fu:['FU-038','FU-039'],note:['.c','홈','Total Cashback Balance = CEX + DEX 동일 정의 합계(매칭 전), 연동 미완료 계정 제외(REQ-268). 출금 버튼은 항상 비활성 Auto Claim(REQ-270). 행 선택: CEX → 계정 페이지, DEX → 지갑 페이지.']});
v22Register('home/LKD',{label:'DEX 지갑 상세',states:[['normal','정상','REQ-276~280'],['noReward','이벤트 리워드 0 — Event Reward 행 없음','REQ-277'],['zero','캐시백 0','REQ-277'],['delayed','지연 — Last updated','REQ-277'],['reviewed','리뷰 작성 후 — 리뷰 유도 없음','REQ-278'],['pending','연동 시도중','REQ-098'],['totalClaimed','Total Claimed 행 (유지 시)','REQ-281 · G-053'],['subaccounts','하위 계정 나열 (Lighter)','REQ-281 · G-178']],render:hmWallet,fu:['FU-040'],note:['.c','지갑 상세','테더맥스를 지급자로 씀 — paid by {DEX} · withdraw on {DEX} 없음(REQ-279). 요율은 실제 레코드 값, 트레이더 0% 미표시(REQ-280). 마일스톤 진행바 없음(REQ-278).']});
v22Register('home/TL',{label:'캐시백 타임라인 · 누적',states:[['normal','EdgeX Daily D+1','REQ-282 · 289'],['apex','ApeX D+2','REQ-282 · G-192'],['lighter','Lighter Weekly W+1 (온보딩 후)','REQ-282'],['compact','compact 단계','REQ-289'],['warning','순차 지급 경고','REQ-289']],render:hmTimeline,fu:['FU-041']});
v22Register('home/FAQ',{label:'홈 FAQ',states:[['normal','회원 답변 · 비회원 답변 삭제','REQ-711 · G-419']],render:hmFaq,fu:['FU-044']});
v22Register('etc/FEED',{group:'기타 반영 지점',label:'실시간 출금 피드',states:[['normal','CEX·DEX 시간순 · DEX 배지 · 지갑 전체','REQ-285 · 286'],['loading','불러오는 중','REQ-285'],['empty','내역 없음','G-137'],['error','불러오기 실패','G-137']],render:hmFeed,fu:['FU-042']});
v22Register('etc/ABOUT',{label:'서비스 소개',states:[['normal','파트너 캐러셀 · 출금 피드 · UID 문구','REQ-287 · 715'],['loading','피드 불러오는 중',''],['empty','피드 없음',''],['error','피드 실패','']],render:hmAbout,fu:['FU-043','FU-042']});
v22Register('etc/PLP',{label:'프리로그인 랜딩',states:[['normal','Featured Exchanges — DEX 선택 가능','REQ-288'],['heroDex','Hero Exchange = DEX','REQ-288'],['inactive','Featured·Hero 파트너 비활성','G-259 · G-260']],render:hmPrelogin,fu:['FU-043']});
}
