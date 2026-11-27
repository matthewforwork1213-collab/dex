// 3. 비회원 캐시백 조회 — FU-012 (REQ-175 · 178 · 179 · 180)
// Figma: DEX(revision) › "게스트 캐시백 · 비회원 조회와 연동 후 지급" — Web/Mobile Guest 프레임 19쌍 + Mobile Guest entry Home.
// V2.2에는 화면이 없었음(규칙만). 정책 범위 안이 자명해 Figma 프레임을 전부 상태로 옮김.
// 게스트는 조회만 한다(출금·캡차·완료 토스트 없음). 0 · 10 미만 · 10 이상 모두 읽기 전용. 결과 없음·집계 중·일시 장애·조회 제한은 0으로 보이지 않음.
// 인증(가입·로그인) 성공 → 조회한 거래 계정을 이어받아 기존 연동 검증(link.*). 인증 취소 → 직전 결과로 복귀.
// Figma 문구는 영문만 있음 → T(en)만 쓴다(번역하지 않음).
const mo=()=>S.vp==='mo';
const img=(f,st='')=>`<img src="${A(f)}" alt="" style="${st}">`;
const WAL='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9';
const ACC={dex:{name:'Lighter',kind:'Wallet',short:'0x7a3F...51e9',tip:'0x7a3F9C2B…C51e9'},cex:{name:'Bitget',kind:'UID',short:'••••5687'}};
const mark=(n,s)=>n==='Bitget'?img('lnd-bitget.png',`width:${s}px;height:${s}px;border-radius:50%;flex:none`):C.dex(n,s);
const help=()=>`<span style="width:20px;height:20px;border:1.6px solid var(--text-secondary);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text-secondary);flex:none">?</span>`;
const DEV_RESULT='개발 메모(Figma 「조회 응답 → 화면」): API-023 FOUND → amount = 0이면 No cashback yet, 0 초과 10 미만은 최소 금액 안내, 10 이상은 기준 충족 안내. 모든 구간에서 지급 전 같은 계정을 연동해야 함. NO_PUBLIC_RESULT → 결과 없음·회원 전용 공통 안내. DATA_PENDING → 집계 대기(두 상태는 금액을 숨김). 400 → 입력 오류, 429 → Retry-After 이후 재조회, 500·503 → 같은 입력으로 재시도. 거래소 선택은 게시·조회 지원 목록. 거래소를 바꾸면 이전 입력·결과를 지움. 지갑 주소 대소문자 유지, 0x 형식 강제 안 함.';
const DEV_AUTH='개발 메모(Figma 「인증 후 복귀」): 가입·로그인 성공 → 조회한 거래소·계정으로 복귀. 로그인만으로 연동·지급을 처리하지 않음. 인증 취소 → 조회 결과로 복귀. 이미 본인에게 연동된 계정은 회원 상세로 이동, 다른 회원의 잔액·이력은 공개하지 않음. 결과 예시 14 USDT = 거래소 캐시백 7 + 매칭된 이벤트 리워드 7(매칭 공식 A + MIN(B, A)). 연동 후 지급은 회원의 기존 잔액·최저 지급액 규칙.';

// ---------- 검색 카드 (유리 카드 + 동전 3개) ----------
// o: {ex:'Lighter'|'Bitget'|null, value, ph, err, loading, enabled}
function searchCard(o){
 const box=(inner,st='')=>`<div style="background:rgba(238,243,251,.72);border:1px solid rgba(255,255,255,.8);border-radius:8px;padding:${mo()?'14px 16px':'14px 16px'};${st}">${inner}</div>`;
 const sel=box(`<span class="cap c2" style="display:block;margin-bottom:6px">Select exchange</span><div class="row" style="gap:10px">${o.ex?mark(o.ex,28):''}<span class="b1 med grow">${o.ex||'Select an exchange'}</span>${ic('arrow-drop-down','ic20')}</div>`,'cursor:pointer');
 const val=o.value?`<span class="b1 mono" style="color:${o.loading?'var(--text-disabled)':'var(--text-secondary)'};word-break:break-all;letter-spacing:.5px">${o.value}</span>`:`<span class="b1 c2" style="${o.ex?'':'color:var(--text-disabled)'}">${o.ph}</span>`;
 const field=box(`<div class="row" style="gap:12px;min-height:40px"><div class="grow">${val}</div>${help()}</div>`,o.err?'border:1px solid var(--error);background:rgba(238,243,251,.72)':'');
 const btn=`<button class="btn ${o.enabled?'contained primary':'contained'} lg full" ${o.enabled?'data-go="guest.search:loading"':'disabled'} style="border-radius:4px">${o.loading?'Searching...':'Check cashback'}</button>`;
 const coin=(f,st)=>img(f,`position:absolute;${st};pointer-events:none`);
 return `<div style="position:relative;width:${mo()?'100%':'344px'};margin:0 auto">
  ${coin('guest-coin-a.png',mo()?'left:-60px;top:10px;width:130px':'left:-120px;top:-62px;width:210px')}${coin('guest-coin-b.png',mo()?'right:-52px;top:20px;width:100px':'left:262px;top:-66px;width:150px')}
  <div class="col" style="position:relative;gap:8px;padding:8px;border-radius:8px;background:rgba(255,255,255,.35);border:1px solid rgba(0,49,198,.08);backdrop-filter:blur(12px)">${sel}${field}${o.err?`<span class="cap ce" style="padding:0 2px">${o.err}</span>`:''}${btn}</div>
  ${coin('guest-coin-c.png',mo()?'right:-70px;bottom:-80px;width:140px':'left:280px;top:100px;width:200px')}
  <a class="row center b1" data-go="hub.main:cex" style="gap:8px;margin-top:${mo()?24:28}px;position:relative;cursor:pointer">No account? Join our partner exchange <span style="font-size:18px">⟶</span></a></div>`}
function band(){
 return `<section style="background:#cfe0fb url('${A('guest-band.jpg')}') center/cover;padding:${mo()?'64px 16px':'56px 24px'};text-align:center"><div class="col" style="gap:8px;align-items:center"><p style="margin:0;font-size:24px;line-height:1.334;font-weight:700">Don't leave your cashback behind.</p><p class="b2 c2" style="margin:0">Sign up or log in and link this trading account to receive your cashback.</p>
  <div style="position:relative;width:100%;max-width:400px;margin-top:32px;background:#fff;border-radius:1000px"><div style="border:1px solid var(--input-border);border-radius:5000px;padding:16px;text-align:left"><span class="b1 c2">Email address</span></div><button class="btn contained primary lg" data-go="auth.signup" style="position:absolute;right:7px;top:50%;transform:translateY(-50%);border-radius:1000px">Sign Up Now</button></div></div></section>`}
function searchPage(o,sub){
 return `<section style="padding:${mo()?'48px 16px 72px':'96px 24px 104px'};background:#f8fafc;overflow:hidden"><div class="col" style="gap:${mo()?32:48}px;align-items:center"><div class="col" style="gap:12px;text-align:center;align-items:center"><h1 style="margin:0;font-size:${mo()?34:40}px;line-height:1.2;font-weight:700;letter-spacing:-.5px">Check your cashback</h1><p class="b1 c2" style="margin:0;max-width:${mo()?330:'none'}px">${sub||'Choose your exchange and enter your UID or wallet address to check your cashback.'}</p></div>${searchCard(o)}</div></section>${band()}`}

const SEARCH={
 search:{o:{ex:null,ph:'Select an exchange first'},label:'검색 · 초기',fig:{pc:'29035:97622',mo:'29035:97732'},flow:'진입: 홈 푸터 Company › Claim Cashback(또는 /{lang}/search). 거래소 선택 → guest.modal:picker'},
 emptydex:{o:{ex:'Lighter',ph:'Enter your wallet address'},label:'DEX 선택 · 입력 대기',fig:{pc:'29037:102201',mo:'29037:102272'},flow:'DEX 선택 → 지갑 주소 입력란. 입력 전 Check cashback 비활성'},
 emptycex:{o:{ex:'Bitget',ph:'Enter your UID'},label:'CEX 선택 · 입력 대기',fig:{pc:'29037:102332',mo:'29037:102403'},flow:'CEX 선택 → UID 입력란(REQ-180). 유형을 바꾸면 이전 입력을 지움'},
 dex:{o:{ex:'Lighter',value:WAL,enabled:1},label:'DEX · 지갑 주소 입력 완료',fig:{pc:'29035:98155',mo:'29035:98218'},flow:'Check cashback → guest.search:loading → guest.result:above / below / zero 또는 guest.modal:none·delay·error·limit'},
 cex:{o:{ex:'Bitget',value:'7605865687',enabled:1},label:'CEX · UID 입력 완료',fig:{pc:'29035:98278',mo:'29035:98341'},flow:'Check cashback → loading → guest.result:belowcex'},
 bad:{o:{ex:'Lighter',ph:'Enter your wallet address',err:'Enter your wallet address.'},label:'입력 오류 · 선택 거래소 기준',fig:{pc:'29035:98401',mo:'29035:98465'},flow:'400(입력 오류) — 선택한 거래소 기준 안내. Check cashback 비활성'},
 loading:{o:{ex:'Lighter',value:WAL,loading:1},sub:'Checking this account with the exchange...',label:'거래소 조회 중',fig:{pc:'29035:98526',mo:'29035:98580'},flow:'조회 중 — 입력·버튼 비활성(Searching...)'},
};
R.screen({id:'guest.search',group:'guest',title:'비회원 캐시백 조회',route:'/{lang}/search',fu:['FU-012'],shell:{noNav:true},
 states:Object.entries(SEARCH).map(([id,s])=>({id,label:s.label,figma:s.fig,note:'Figma 전용 상태(V2.2 화면 없음) · REQ-175·179·180'})),
 render(st){
  const s=SEARCH[st];
  return `<div style="padding:0 ${mo()?16:40}px;background:#f8fafc">${C.note(`<b>흐름</b> ${s.flow}<br>REQ-178: 조회에 로그인 불필요. 게스트 출금 버튼·캡차·완료 토스트 없음(REQ-175). ${st==='search'?DEV_RESULT:''}`)}</div>${searchPage(s.o,s.sub)}`;
 }});

// ---------- 조회 결과 (읽기 전용) ----------
const RES={
 above:{a:'dex',amt:'14.00 USDT',rows:[['Exchange Cashback','7.00 USDT'],['Matched event reward','7.00 USDT']],cap:['10 USDT minimum reached. Link this account to receive it.','최소 금액 10 USDT를 넘었어요. 이 거래 계정을 연동하면 받을 수 있어요.'],label:'조회 성공 · 10 USDT 이상',fig:{pc:'29035:97792',mo:'29035:97855'}},
 below:{a:'dex',amt:'6.00 USDT',cap:['Below the 10 USDT minimum to claim.','출금 최소 금액 10 USDT에 못 미쳐요.'],label:'조회 성공 · 10 USDT 미만',fig:{pc:'29035:98631',mo:'29035:98694'}},
 zero:{a:'dex',amt:'0.00 USDT',cap:'No cashback recorded yet.',label:'조회 성공 · 잔액 0',fig:{pc:'29035:98754',mo:'29035:98817'}},
 belowcex:{a:'cex',amt:'8.00 USDT',cap:['Below the 10 USDT minimum to claim.','출금 최소 금액 10 USDT에 못 미쳐요.'],label:'CEX · UID 잔액 조회 성공',fig:{pc:'29035:99309',mo:'29035:99372'}},
 handoff:{a:'dex',handoff:1,label:'로그인 후 · 계정 미연동 (DEX)',fig:{pc:'29035:97915',mo:'29035:97974'}},
 handoffcex:{a:'cex',handoff:1,label:'CEX · 로그인 후 같은 UID 연동',fig:{pc:'29037:102463',mo:'29037:102530'}},
};
function acctCard(r){
 const a=ACC[r.a],linkGo=r.a==='dex'?'link.addr:empty':'link.uid';
 const banner=`<div class="row" data-go="${r.handoff?linkGo:'auth.login'}" style="position:relative;height:36px;background:var(--blue);gap:8px;justify-content:flex-end;padding:0 16px;cursor:pointer;overflow:hidden">${img('guest-banner-inf.png','position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:76px')}<span style="font-size:11px;color:#fff;line-height:1.2">${r.handoff?'Link this trading account':'Already a member? Log in to link this account'}</span>${img('ic-chevron-right.svg','width:16px;height:16px;filter:invert(1)')}</div>`;
 const top=`<div style="background:#fff;border-radius:8px;overflow:hidden"><div class="row" style="gap:8px;padding:12px 16px">${mark(a.name,40)}<div class="col" style="gap:0"><span class="b2 semi">${a.name}</span><span class="cap c2">${a.kind}&nbsp; ${a.tip?`<span data-addr="${a.tip}">${a.short}</span>`:a.short}</span></div></div>${banner}</div>`;
 let body;
 if(r.handoff)body=`<div class="col" style="gap:12px"><span class="b1 center">Link this trading account</span><hr class="divider"><span style="font-size:10px;color:var(--text-secondary)">Finish linking this account to receive cashback.</span>${C.btn('Link account',{full:true,go:linkGo})}</div>`;
 else body=`<div class="col" style="gap:12px"><div class="row between"><span class="b2">Available Cashback</span><span class="b1 bold">${r.amt}</span></div><hr class="divider">${(r.rows||[]).map(([k,v])=>`<div class="row between" style="font-size:11px;color:var(--text-secondary)"><span>${k}</span><span>${v}</span></div>`).join('')}<span style="font-size:10px;color:var(--text-secondary)">${Array.isArray(r.cap)?T(...r.cap):r.cap}</span>${C.btn('Sign up to link account',{full:true,go:'auth.signup'})}</div>`;
 return `<div class="col" style="gap:12px;width:${mo()?'100%':'346px'};flex:none">${top}<div style="background:#fff;border-radius:8px;padding:16px">${body}</div></div>`}
function sideRecs(){
 const tile=(n,bg,inner,pct)=>`<div class="col" style="gap:4px;flex:none;width:${mo()?106:155}px"><div style="height:${mo()?60:80}px;background:${bg};display:flex;align-items:center;justify-content:center;overflow:hidden">${inner}</div><span class="cap" style="color:var(--text-secondary)">${n}</span><span class="cap med">${pct} Total Savings</span></div>`;
 const tiles=[tile('Bitget','#00f0ff',img('lnd-bitget.png','width:40px;height:40px'),'54%'),tile('Bybit','#171a26',img('guest-bybit.png','height:100%'),'55%'),tile('Binance','#1e2026',img('home-logo-binance.png','width:40px;height:40px;border-radius:50%'),'50%'),tile('OKX','#000',img('guest-okx.png','height:100%'),'65%')];
 const head=t=>`<div class="row between"><span class="${mo()?'b1 semi':'h5 bold'}" style="${mo()?'':'font-size:24px'}">${t}</span><button class="btn text primary sm" data-go="${t==='Top Partner Exchanges'?'hub.main:cex':'benefits.list'}">See All</button></div>`;
 const evPc=(f,t,v)=>`<div style="flex:1;background:#fff;border-radius:8px;box-shadow:0 4px 5px rgba(0,0,0,.1);padding:12px;display:flex;flex-direction:column;gap:12px"><div style="height:140px;position:relative;background:#000;border-radius:4px;overflow:hidden">${img(f,'position:absolute;right:0;top:0;height:100%')}<span class="row" style="position:absolute;left:4px;top:4px;gap:4px;background:#1c1c1e;border-radius:4px;padding:2px 8px">${img('lnd-chip-bitget.png','width:14px;height:14px')}<span style="font-size:11px;color:#fff">Bitget</span></span><span style="position:absolute;left:16px;top:28px;width:150px;color:#fff;font-weight:600;font-size:15px;line-height:1.6">${t}</span></div><div class="row between b2"><span class="row c2" style="gap:4px">${img('lnd-ic-redeem.svg','width:20px;height:20px')}Rewards</span><span>${v}</span></div>${'<span class="cap c2" style="align-self:flex-start;background:#e6e7e9;border-radius:4px;padding:4px;line-height:12px">Ongoing</span>'}<button class="btn contained primary md full" data-go="benefits.list">Join Now</button></div>`;
 const evMo=(f,t,d)=>`<div class="col" style="gap:4px;flex:none;width:160px"><div style="height:155px;position:relative;background:#000;border-radius:8px;overflow:hidden">${img(f,'position:absolute;left:50%;top:55%;transform:translate(-50%,-50%);width:150%')}<span class="row" style="position:absolute;left:6px;top:6px;gap:4px;background:#1c1c1e;border-radius:4px;padding:2px 8px">${img('lnd-chip-bitget.png','width:14px;height:14px')}<span style="font-size:11px;color:#fff">Bitget</span></span></div><span class="b2 semi">${t}</span><span class="cap c2">${d}</span></div>`;
 const evs=mo()?evMo('guest-ev-btc.png','Guess Bitcoin Price','Win Up to 1,000 USDT')+evMo('guest-ev-cash.png','Earn More Cashback','Earn extra USDT')
  :evPc('guest-ev-btc.png','Predict Bitcoin price and win up to 1,000.00 USDT','Up to 1,000.00 USDT')+evPc('guest-ev-cash.png','Earn More Cashback. Earn Extra USDT.','Up to 37 USDT');
 return `<div class="col" style="gap:${mo()?0:56}px;flex:1;min-width:0;${mo()?'':'background:#fff;border-radius:8px;padding:24px 24px 32px'}">
  <div class="col" style="gap:16px;${mo()?'padding:24px 0':''};position:relative">${head('Top Partner Exchanges')}<div class="row" style="gap:12px;overflow:hidden;align-items:flex-start">${tiles.join('')}</div>${mo()?'':`<button class="icon-btn" style="position:absolute;right:-12px;top:84px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)">${ic('chevron-right','ic20')}</button>`}</div>
  <div class="col" style="gap:16px;${mo()?'background:#fff;margin:0 -16px;padding:24px 16px':''}">${head('Exclusive For Members')}<div class="row" style="gap:16px;align-items:stretch;${mo()?'overflow:hidden':''}">${evs}</div></div></div>`}
R.screen({id:'guest.result',group:'guest',title:'비회원 조회 결과 (읽기 전용)',route:'/{lang}/search (결과)',fu:['FU-012'],shell:{noNav:true},
 states:Object.entries(RES).map(([id,r])=>({id,label:r.label,figma:r.fig,note:'Figma 전용 상태(V2.2 화면 없음) · REQ-175·178·179'+(r.a==='cex'?' · 180':'')})),
 render(st){
  const r=RES[st];
  const flow=r.handoff?`<b>흐름</b> 가입·로그인 성공 후 복귀(같은 거래 계정을 이어받음) — 로그인만 하고 미연동이면 지급 불가(REQ-178). Link account → ${r.a==='dex'?'<code>link.addr</code>(지갑 주소 미리 채움)':'<code>link.uid</code>(같은 UID — REQ-107·709 적용)'} → 기존 연동 검증. 이 상태는 회원 로그인 상태(헤더는 도구 상단 「회원」으로 확인). ${DEV_AUTH}`
   :`<b>흐름</b> Sign up to link account → <code>auth.signup</code> · 배너 「Already a member? Log in…」 → <code>auth.login</code>. 인증 성공 → guest.result:${r.a==='dex'?'handoff':'handoffcex'}, 취소 → 이 결과로 복귀. 결과에서 출금 0건(REQ-175). ${st==='above'?'14.00 = 거래소 캐시백 7 + MIN(이벤트 리워드 7, 7).':''}`;
  return `<div style="padding:0 ${mo()?16:40}px;background:#f8fafc">${C.note(flow)}</div><section style="background:#f8fafc;padding:${mo()?'8px 16px 0':'24px 24px 56px'}"><div class="col" style="max-width:1090px;margin:0 auto;gap:${mo()?16:40}px">
   <a class="row" data-go="guest.search:dex" style="gap:16px;cursor:pointer">${img('ic-arrow-forward.svg','width:24px;height:24px;transform:scaleX(-1);opacity:.6')}${mo()?'':'<span class="h6" style="font-weight:500">Search again</span>'}</a>
   <div style="display:flex;flex-direction:${mo()?'column':'row'};gap:${mo()?16:24}px;align-items:flex-start">${acctCard(r)}${sideRecs()}</div></div></section>`;
 }});

// ---------- 거래소 선택 · 결과 없음 · 집계 중 · 일시 오류 · 조회 제한 (오버레이) ----------
function gDialog(title,body,actions,o={}){
 return `<div style="text-align:left;${!mo()&&!o.sheet?'margin-top:180px;':''}background:#fff;border-radius:${mo()&&o.sheet?'16px 16px 0 0':'4px'};box-shadow:var(--elev24);width:${mo()?'100%':(o.w||480)+'px'};${o.h&&!mo()?`min-height:${o.h}px;`:''}padding:24px;display:flex;flex-direction:column;gap:${o.gap||16}px">
  <div class="row between"><span class="h6" style="font-weight:500;font-size:20px">${title}</span><button class="icon-btn" data-go="${o.close||'guest.search:dex'}">${ic('close')}</button></div>${body}${actions?`<div class="col" style="gap:8px;margin-top:8px">${actions}</div>`:''}</div>`}
const back=(go='guest.search:dex',v='text')=>`<button class="btn ${v==='text'?'text black':'contained primary'} lg full" data-go="${go}">Back to search</button>`;
const MODAL={
 picker:{label:'거래소 선택',bg:'guest.search:search',fig:{pc:'29035:98030',mo:'29035:98094'},
  flow:'거래소 선택 목록 = 서비스에 게시되고 조회가 지원되는 거래소(프로토타입 예시 Lighter · Bitget). CEX 선택 → guest.search:emptycex, DEX 선택 → guest.search:emptydex. 거래소를 바꾸면 이전 입력·결과를 지움.'},
 pickerCex:{label:'거래소 선택 · CEX 필터',bg:'guest.search:search',fig:{mo:'29179:116351'},flow:'유형 칩 CEX — 중앙화 거래소만(검색은 선택한 칩 안에서, REQ-056)'},
 pickerDex:{label:'거래소 선택 · DEX 필터',bg:'guest.search:search',fig:{pc:'29179:116130',mo:'29179:116630'},flow:'유형 칩 DEX — DEX만, Top Popular Exchanges 숨김'},
 none:{label:'공개 조회 결과 없음',bg:'guest.search:dex',fig:{pc:'29035:98877',mo:'29035:98933'},flow:'NO_PUBLIC_RESULT — 결과 없음·회원 전용 계정 공통 안내. 금액 숨김(0으로 표시하지 않음).'},
 error:{label:'일시 오류 · 재조회',bg:'guest.search:dex',fig:{pc:'29035:99091',mo:'29035:99147'},flow:'500·503 — 입력값 유지, Try again → 같은 거래소·계정으로 재조회.'},
 limit:{label:'조회 제한 · 대기',bg:'guest.search:dex',fig:{pc:'29035:99200',mo:'29035:99256'},flow:'429 — Retry-After 이후 재조회. 대기 시간 표기는 Figma에 없음.'},
};
R.screen({id:'guest.modal',group:'guest',title:'비회원 조회 — 선택·안내 팝업',route:'/{lang}/search (오버레이)',fu:['FU-012'],shell:false,closeTo:'guest.search:dex',
 states:Object.entries(MODAL).map(([id,m])=>({id,label:m.label,figma:m.fig,note:'Figma 전용 상태(V2.2 화면 없음) · REQ-175·179'})),
 render(st){
  const m=MODAL[st];let inner;
  if(/^picker/.test(st)){
   const f=st==='pickerCex'?'cex':st==='pickerDex'?'dex':'all';
   // 로고·타일 배경 = 연동 선택기와 같은 에셋(link-cex-* · calc-*)
   const LG={'WOO X Pro':'calc-wooxpro.png',Bitget:'link-cex-bitget.png',Binance:'link-cex-binance.png',Bybit:'link-cex-bybit.png',Flipster:'calc-flipster.png',OKX:'link-cex-okx.png',MEXC:'link-cex-mexc.png',BingX:'link-cex-bingx.png',DeepCoin:'link-cex-deepcoin.png',Gate:'link-cex-gate.png',LBank:'link-cex-lbank.svg',BlockFin:'link-cex-blockfin.svg',KuCoin:'link-cex-kucoin.png',Zoomex:'link-cex-zoomex.png',Bitunix:'link-cex-bitunix.svg',BloFin:'link-cex-blofin.png',HTX:'link-cex-htx.svg',Toobit:'calc-toobit.svg'};
   const BGC={OKX:'#000',MEXC:'#212425',BingX:'#2a54ff',DeepCoin:'#19181d',Gate:'#0051d2',LBank:'#000',BlockFin:'#111',KuCoin:'#2dbd96',Zoomex:'#121b24',Bitunix:'#121212',BloFin:'#000',HTX:'#f2f2f5',Toobit:'#f2f2f5'};
   const TOP=['WOO X Pro','Bitget','Binance','Bybit','Flipster'],REST=['OKX','MEXC','BingX','DeepCoin','Gate','LBank','BlockFin','KuCoin','Zoomex','Bitunix','BloFin','HTX','Toobit'],DX=['Lighter','ApeX','EdgeX','Aster'];
   const logo=(n,sz)=>LG[n]?img(LG[n],`width:${sz}px;height:${sz}px;border-radius:50%;object-fit:contain;flex:none`):C.dex(n,sz);
   const go=n=>DX.includes(n)?'guest.search:emptydex':'guest.search:emptycex';
   const topTile=n=>`<button type="button" data-go="${go(n)}" style="flex:none;width:${mo()?76:88}px;height:${mo()?72:76}px;background:#fff;border:1px solid var(--divider);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:inherit;padding:0">${logo(n,32)}<span style="font-size:11px;line-height:1.4">${n}</span></button>`;
   const tile=n=>{const dex=DX.includes(n);return `<button type="button" data-go="${go(n)}" style="min-width:0;background:transparent;border:0;padding:0;display:flex;flex-direction:column;gap:2px;cursor:pointer;color:inherit;text-align:left"><span style="height:${mo()?48:56}px;border-radius:4px;background:${dex?'#f0f1f4':BGC[n]||'#f0f1f4'};display:flex;align-items:center;justify-content:center">${logo(n,32)}</span><span style="font-size:11px;line-height:1.4;color:var(--text-secondary)">${n}</span>${dex&&f==='all'?'<span style="font-size:10px;line-height:1;color:var(--text-secondary)">DEX</span>':''}</button>`};
   const list=f==='dex'?DX:f==='cex'?REST:[...REST,...DX];
   const head=f==='dex'?`Decentralised exchanges (${list.length})`:f==='cex'?`Centralised exchanges (${list.length})`:`All Exchanges (${list.length})`;
   const chips=`<div class="row g8" role="group" aria-label="Exchange type">${[['all','All','picker'],['cex','CEX','pickerCex'],['dex','DEX','pickerDex']].map(([k,l,to])=>`<span class="chip ft${f===k?' on':''}" data-go="guest.modal:${to}">${l}</span>`).join('')}</div>`;
   const top=f==='dex'?'':`<div class="col" style="gap:8px"><span class="b2 semi">Top Popular Exchanges</span><div style="position:relative"><div class="row" style="gap:8px;overflow:hidden">${TOP.map(topTile).join('')}</div><button class="icon-btn" aria-label="Next" style="position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:24px;height:24px;padding:0;background:#fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.2)">${ic('chevron-right','ic16')}</button></div></div>`;
   const search=`<div class="tf sm"><div class="in"><img src="${A('link-ic-search.svg')}" class="ic20" alt=""><input type="search" placeholder="Search for an exchange" aria-label="Search for an exchange"></div></div>`;
   const body=`${search}${chips}${top}<div class="col" style="gap:8px"><span class="b2 semi">${head}</span><div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${mo()?'12px 8px':'16px'};max-height:${mo()?'none':'220px'};overflow-y:auto">${list.map(tile).join('')}</div></div>`;
   inner=gDialog('Select Exchange',(mo()?'<div class="sheet-grab" style="margin:-12px auto 0"></div>':'')+body,'',{w:480,sheet:1,close:'guest.search:search'});
  }else if(st==='none')inner=gDialog('No public result',`<p class="b2 c2" style="margin:0">Check the exchange and account details, or log in to view your linked account.</p>`,C.btn('Log in',{full:true,go:'auth.login'})+back());
  else if(st==='error')inner=gDialog('Couldn’t load cashback',`<p class="b2 c2" style="margin:0">Your search details are saved. Try again with the same exchange and account.</p>`,C.btn('Try again',{full:true,go:'guest.search:loading'})+back());
  else inner=gDialog('Too many searches',`<p class="b2 c2" style="margin:0">Please wait before searching again.</p>`,back('guest.search:dex','primary'));
  const note=`<div style="position:absolute;left:16px;right:16px;bottom:8px;z-index:25">${C.note(`<b>흐름</b> ${m.flow}`)}</div>`;
  return `<div style="position:relative">${C.overlay(m.bg,inner,{center:!/^picker/.test(st)})}${note}</div>`;
 }});

// ---------- 모바일 진입 홈 (Mobile / Guest entry / Home) ----------
function moEntry(){
 const stat=(v,l)=>`<div class="col" style="gap:0;flex:none;width:240px;background:#f8fafc;border-radius:16px;padding:16px"><span class="h6 bold cb">${v}</span><span class="cap c2">${l}</span></div>`;
 const hero=`<section style="position:relative;overflow:hidden;height:702px;background:#e6efff url('${A('guest-mo-herobg.jpg')}') center/cover">
  ${img('guest-mo-ambassador.png','position:absolute;left:50%;top:24px;transform:translateX(-50%);width:340px;height:auto')}
  ${img('guest-mo-sign.png','position:absolute;right:40px;top:230px;width:110px;filter:brightness(0)')}
  <div class="col" style="position:absolute;right:48px;top:325px;gap:0;align-items:flex-end;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.4)"><span class="b2 med">YUN SI YUN</span><span class="b2" style="opacity:.8">Official TetherMax Ambassador</span></div>
  <div class="col" style="position:absolute;left:16px;right:16px;top:372px;gap:16px;align-items:center;color:#fff;text-align:center">
   <p style="margin:0;font-size:32px;line-height:1.2;font-weight:700;text-shadow:0 2px 6px rgba(0,0,0,.35)">Found a higher rate?<br>We want to hear it</p>
   <span class="row" style="gap:6px;font-size:17px;font-weight:500">${img('lnd-ic-reward.svg','width:22px;height:22px')}Sign up and get up to <b style="color:#ff9800">10,000 USDT</b>!</span>
   <div style="position:relative;width:100%;background:#fff;border-radius:1000px"><div style="border:1px solid var(--input-border);border-radius:5000px;padding:16px;text-align:left"><span class="b1 c2">Email address</span></div><button class="btn contained primary lg" data-go="auth.signup" style="position:absolute;right:6px;top:50%;transform:translateY(-50%);border-radius:1000px">Sign Up Now</button></div></div>
  <div class="row" style="position:absolute;left:16px;top:610px;gap:12px">${stat('199,092','Total registered users')}${stat('24/7','Live support center')}</div></section>`;
 const foot=footer();
 return `${hero}<div style="padding:0 16px">${C.note('<b>진입 경로</b> 모바일 홈(게스트) 푸터 Company › <b>Claim Cashback</b>(점선) → guest.search:search. 히어로는 프리로그인 랜딩 모바일과 같은 컴포넌트.')}</div>${foot}`}
R.screen({id:'guest.entry',group:'guest',title:'모바일 진입 홈 (Claim Cashback)',route:'/ (모바일 · 비로그인)',fu:['FU-012'],shell:false,
 states:[{id:'normal',label:'모바일 홈 푸터 → Claim Cashback',figma:{mo:'29037:113704'},note:'Figma 「Mobile / Guest entry / Home」 — 웹은 landing.main 푸터 Company › Claim Cashback'}],
 render(){
  if(!mo())return renderInner('landing.main:normal');
  const o=S.auth;S.auth='guest';try{return `${moTop()}${moEntry()}`}finally{S.auth=o}
 }});
