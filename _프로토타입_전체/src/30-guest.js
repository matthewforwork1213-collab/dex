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
// 거래소 로고·타일 배경 = 연동 선택기와 같은 에셋(link-cex-* · calc-*). 거래소 선택 목록 = 실서비스 /en/search 팝업과 같은 순서(Top 5 + 나머지) + DEX 4곳
const LG={'WOO X Pro':'calc-wooxpro.png',Bitget:'link-cex-bitget.png',Binance:'link-cex-binance.png',Bybit:'link-cex-bybit.png',Flipster:'calc-flipster.png',OKX:'link-cex-okx.png',MEXC:'link-cex-mexc.png',BingX:'link-cex-bingx.png',DeepCoin:'link-cex-deepcoin.png',Gate:'link-cex-gate.png',LBank:'link-cex-lbank.svg',BlockFin:'link-cex-blockfin.svg',KuCoin:'link-cex-kucoin.png',Zoomex:'link-cex-zoomex.png',Bitunix:'link-cex-bitunix.svg',BloFin:'link-cex-blofin.png',HTX:'link-cex-htx.svg',Toobit:'calc-toobit.svg'};
const BGC={OKX:'#000',MEXC:'#212425',BingX:'#2a54ff',DeepCoin:'#19181d',Gate:'#0051d2',LBank:'#000',BlockFin:'#111',KuCoin:'#2dbd96',Zoomex:'#121b24',Bitunix:'#121212',BloFin:'#000',HTX:'#f2f2f5',Toobit:'#f2f2f5'};
const TOP=['WOO X Pro','Bitget','Binance','Bybit','Flipster'],REST=['OKX','MEXC','BingX','DeepCoin','Gate','LBank','BlockFin','KuCoin','Zoomex','Bitunix','BloFin','HTX','Toobit'],DX=['Lighter','ApeX','EdgeX','Aster'];
const isDexEx=n=>DX.includes(n);
const logo=(n,sz)=>LG[n]?img(LG[n],`width:${sz}px;height:${sz}px;border-radius:50%;object-fit:contain;flex:none`):C.dex(n,sz);
const mark=(n,s)=>n==='Bitget'?img('lnd-bitget.png',`width:${s}px;height:${s}px;border-radius:50%;flex:none`):LG[n]?logo(n,s):C.dex(n,s);
// 화면에서 실제로 고르고 입력한 값(목록판 상태 선택·도구 막대를 누르면 지움 — Figma 상태 그림은 고정 표본 그대로)
const GS=window.GUEST_LIVE=window.GUEST_LIVE||{on:false,ex:null,val:'',email:'',retried:false};
const PH=ex=>!ex?'Select an exchange first':isDexEx(ex)?'Enter your wallet address':'Enter your UID';
// 모바일웹 앱 설치 배너(Figma 게스트 모바일 프레임 29035:97732 등 · 기존 mWeb 스마트 배너): 닫기 · 앱 아이콘 · 안내 · `Get the App`. 로그인 후 복귀 화면은 관리 문구
const appBanner=(t='Sign up in the app and earn more cashback')=>mo()?`<div class="row" data-app-banner style="gap:10px;height:56px;padding:0 12px;background:#0b0b0d;color:#fff;margin:0 -16px"><button class="icon-btn" aria-label="Close" style="padding:4px;color:rgba(255,255,255,.6)" onclick="this.closest('[data-app-banner]').remove()">×</button><span style="width:32px;height:32px;border-radius:8px;background:#0031c6;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:18px;flex:none">∞</span><span class="col grow" style="gap:0;min-width:0"><b style="font-size:13px;line-height:1.3">TetherMax</b><span style="font-size:10px;line-height:1.3;color:rgba(255,255,255,.7)">${t}</span></span><button class="btn outlined sm" style="flex:none;border-color:rgba(255,255,255,.7);color:#fff">Get the App</button></div>`:'';
const help=()=>`<span style="width:20px;height:20px;border:1.6px solid var(--text-secondary);border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;color:var(--text-secondary);flex:none">?</span>`;
const DEV_RESULT='개발 메모(Figma 「조회 응답 → 화면」): API-023 FOUND → amount = 0이면 No cashback yet, 0 초과 10 미만은 최소 금액 안내, 10 이상은 기준 충족 안내. 모든 구간에서 지급 전 같은 계정을 연동해야 함. NO_PUBLIC_RESULT → 결과 없음·회원 전용 공통 안내. DATA_PENDING → 집계 대기(두 상태는 금액을 숨김). 400 → 입력 오류, 429 → Retry-After 이후 재조회, 500·503 → 같은 입력으로 재시도. 거래소 선택은 게시·조회 지원 목록. 거래소를 바꾸면 이전 입력·결과를 지움. 지갑 주소 대소문자 유지, 0x 형식 강제 안 함.';
const DEV_SAMPLE='프로토타입 조회 표본(입력 끝 4자리): DEX 기본 → 10 이상(14.00) · <code>1111</code> → 10 미만 · <code>0000</code> → 0 / CEX 기본 → 10 미만(8.00) / 공통 <code>4040</code> → 결과 없음 · <code>5000</code> → 일시 오류(Try again은 성공) · <code>4290</code> → 조회 제한. DEX 입력칸을 비운 채 벗어나면 입력 오류.';
const DEV_AUTH='개발 메모(Figma 「인증 후 복귀」): 가입·로그인 성공 → 조회한 거래소·계정으로 복귀. 로그인만으로 연동·지급을 처리하지 않음. 인증 취소 → 조회 결과로 복귀. 이미 본인에게 연동된 계정은 회원 상세로 이동, 다른 회원의 잔액·이력은 공개하지 않음. 결과 예시 14 USDT = 거래소 캐시백 7 + 매칭된 이벤트 리워드 7(매칭 공식 A + MIN(B, A)). 연동 후 지급은 회원의 기존 잔액·최저 지급액 규칙.';

// ---------- 검색 카드 (유리 카드 + 동전 3개) ----------
// o: {ex:'Lighter'|'Bitget'|null, value, ph, err, loading, enabled}
// 검색 카드 안쪽(선택 칸 · 입력칸 · 오류 · 버튼). 화면 안 동작(아래 「화면 안 동작」)이 거래소를 고르면 이 함수로 다시 그린다
const SUB='Choose your exchange and enter your UID or wallet address to check your cashback.',SUB_LOADING='Checking this account with the exchange...';
function cardPanel(o){
 const box=(inner,st='',at='')=>`<div ${at} style="background:rgba(238,243,251,.72);border:1px solid rgba(255,255,255,.8);border-radius:8px;padding:${mo()?'14px 16px':'14px 16px'};${st}">${inner}</div>`;
 const sel=box(`<span class="cap c2" style="display:block;margin-bottom:6px">Select exchange</span><div class="row" style="gap:10px">${o.ex?mark(o.ex,28):''}<span class="b1 med grow">${o.ex||'Select an exchange'}</span>${ic('arrow-drop-down','ic20')}</div>`,'cursor:pointer',`data-gs-sel tabindex="0" aria-haspopup="dialog"`);
 // 실제 입력칸(textarea — 긴 지갑 주소는 Figma처럼 줄바꿈). 거래소 선택 전 = 비활성 `Select an exchange first`
 const dis=!o.ex||o.loading;
 const val=`<textarea data-gs-in rows="1" class="b1${o.value?' mono':''}" autocomplete="off" autocapitalize="off" spellcheck="false" aria-label="${esc(o.ph||'')}" placeholder="${esc(o.ph||'')}"${dis?' disabled':''} style="display:block;width:100%;min-height:24px;border:0;outline:0;background:transparent;padding:0;margin:0;resize:none;overflow:hidden;field-sizing:content;font-family:${o.value?'':'inherit'};color:${o.loading?'var(--text-disabled)':'var(--text-secondary)'};word-break:break-all;letter-spacing:${o.value?'.5px':'inherit'}">${esc(o.value||'')}</textarea>`;
 const field=box(`<div class="row" style="gap:12px;min-height:40px"><div class="grow">${val}</div><span data-gs-help role="button" tabindex="0" aria-label="${o.ex&&isDexEx(o.ex)?'How to find your wallet address':'What is UID?'}" style="display:inline-flex;cursor:pointer;flex:none">${help()}</span></div>`,o.err?'border:1px solid var(--error);background:rgba(238,243,251,.72)':'','data-gs-field');
 const btn=`<button class="btn ${o.enabled?'contained primary':'contained'} lg full" data-gs-check ${o.enabled?'':'disabled'} style="border-radius:4px">${o.loading?'Searching...':'Check cashback'}</button>`;
 return `<div class="col" data-gs-panel data-ex="${esc(o.ex||'')}" style="position:relative;gap:8px;padding:8px;border-radius:8px;background:rgba(255,255,255,.35);border:1px solid rgba(0,49,198,.08);backdrop-filter:blur(12px)">${sel}${field}${o.err?`<span class="cap ce" data-gs-err style="padding:0 2px">${o.err}</span>`:''}${btn}</div>`}
function searchCard(o){
 const coin=(f,st)=>img(f,`position:absolute;${st};pointer-events:none`);
 return `<div style="position:relative;width:${mo()?'100%':'344px'};margin:0 auto">
  ${coin('guest-coin-a.png',mo()?'left:-60px;top:10px;width:130px':'left:-120px;top:-62px;width:210px')}${coin('guest-coin-b.png',mo()?'right:-52px;top:20px;width:100px':'left:262px;top:-66px;width:150px')}
  ${cardPanel(o)}
  ${coin('guest-coin-c.png',mo()?'right:-70px;bottom:-80px;width:140px':'left:280px;top:100px;width:200px')}
  <a class="row center b1" data-go="cex.list" style="gap:8px;margin-top:${mo()?24:28}px;position:relative;cursor:pointer">No account? Join our partner exchange <span style="font-size:18px">⟶</span></a></div>`}
// 이메일 칸(하단 띠 · 모바일 진입 홈 히어로 같은 모양) — 입력한 이메일을 가입 화면 Email 칸에 채운다(REQ-175 · 기존 동작)
const emailBox=(right)=>`<form data-gs-email-form style="position:relative;width:100%;${right==null?'max-width:400px;margin-top:32px;':''}background:#fff;border-radius:1000px;margin-bottom:0" onsubmit="return false"><div style="border:1px solid var(--input-border);border-radius:5000px;padding:16px;text-align:left"><input data-gs-email type="email" inputmode="email" autocomplete="email" class="b1" placeholder="Email address" aria-label="Email address" style="display:block;width:calc(100% - 140px);border:0;outline:0;background:transparent;padding:0;margin:0;font:inherit;line-height:24px;color:var(--text-primary)"></div><button class="btn contained primary lg" data-go="auth.signup" style="position:absolute;right:${right??7}px;top:50%;transform:translateY(-50%);border-radius:1000px">Sign Up Now</button></form>`;
function band(){
 return `<section style="background:#cfe0fb url('${A('guest-band.jpg')}') center/cover;padding:${mo()?'64px 16px':'56px 24px'};text-align:center"><div class="col" style="gap:8px;align-items:center"><p style="margin:0;font-size:24px;line-height:1.334;font-weight:700">Don't leave your cashback behind.</p><p class="b2 c2" style="margin:0">Sign up or log in and link this trading account to receive your cashback.</p>
  ${emailBox()}</div></section>`}
function searchPage(o,sub){
 return `<section style="padding:${mo()?'48px 16px 72px':'96px 24px 104px'};background:#f8fafc;overflow:hidden"><div class="col" style="gap:${mo()?32:48}px;align-items:center"><div class="col" style="gap:12px;text-align:center;align-items:center"><h1 style="margin:0;font-size:${mo()?34:40}px;line-height:1.2;font-weight:700;letter-spacing:-.5px">Check your cashback</h1><p class="b1 c2" data-gs-sub style="margin:0;max-width:${mo()?330:'none'}px">${sub||SUB}</p></div>${searchCard(o)}</div></section>${band()}`}

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
  // 화면에서 고른 거래소·입력값이 있으면 그대로 보인다(Search again 복귀 · 동작판 /search). 조회 중 상태는 Figma 그림 그대로
  const o=GS.on&&st!=='loading'&&st!=='bad'?{ex:GS.ex,value:GS.val,ph:PH(GS.ex),enabled:!!(GS.ex&&GS.val.trim())}:s.o;
  return `<div style="padding:0 ${mo()?16:40}px;background:#f8fafc">${appBanner()}${C.note(`<b>흐름</b> ${s.flow}<br>REQ-178: 조회에 로그인 불필요. 게스트 출금 버튼·캡차·완료 토스트 없음(REQ-175). ${st==='search'?DEV_RESULT+'<br>'+DEV_SAMPLE:''}`)}</div>${searchPage(o,s.sub)}`;
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
 // 화면에서 조회한 거래소·계정이 있으면 그 계정(지갑 = 앞 6 · 끝 4, UID = 끝 4자리)
 const live=GS.on&&GS.ex&&GS.val.trim()&&(isDexEx(GS.ex)?'dex':'cex')===r.a,v=live?GS.val.trim():'';
 const a=live?(r.a==='dex'?{name:GS.ex,kind:'Wallet',short:v.length>12?v.slice(0,6)+'...'+v.slice(-4):v,tip:v.length>12?v:''}:{name:GS.ex,kind:'UID',short:'••••'+v.slice(-4)}):ACC[r.a],linkGo=r.a==='dex'?'link.addr:empty':'link.uid';
 const banner=`<div class="row" data-go="${r.handoff?linkGo:'auth.login'}" style="position:relative;height:36px;background:var(--blue);gap:8px;justify-content:flex-end;padding:0 16px;cursor:pointer;overflow:hidden">${img('guest-banner-inf.png','position:absolute;left:-6px;top:50%;transform:translateY(-50%);width:76px')}<span style="font-size:11px;color:#fff;line-height:1.2">${r.handoff?'Link this trading account':'Already a member? Log in to link this account'}</span>${img('ic-chevron-right.svg','width:16px;height:16px;filter:invert(1)')}</div>`;
 const top=`<div style="background:#fff;border-radius:8px;overflow:hidden"><div class="row" style="gap:8px;padding:12px 16px">${mark(a.name,40)}<div class="col" style="gap:0"><span class="b2 semi">${a.name}</span><span class="cap c2">${a.kind}&nbsp; ${a.tip?`<span data-addr="${esc(a.tip)}">${esc(a.short)}</span>`:esc(a.short)}</span></div></div>${banner}</div>`;
 let body;
 if(r.handoff)body=`<div class="col" style="gap:12px"><span class="b1 center">Link this trading account</span><hr class="divider"><span style="font-size:10px;color:var(--text-secondary)">Finish linking this account to receive cashback.</span>${C.btn('Link account',{full:true,go:linkGo})}</div>`;
 else body=`<div class="col" style="gap:12px"><div class="row between"><span class="b2">Available Cashback</span><span class="b1 bold">${r.amt}</span></div><hr class="divider">${(r.rows||[]).map(([k,v])=>`<div class="row between" style="font-size:11px;color:var(--text-secondary)"><span>${k}</span><span>${v}</span></div>`).join('')}<span style="font-size:10px;color:var(--text-secondary)">${Array.isArray(r.cap)?T(...r.cap):r.cap}</span>${C.btn('Sign up to link account',{full:true,go:'auth.signup'})}</div>`;
 return `<div class="col" style="gap:12px;width:${mo()?'100%':'346px'};flex:none">${top}<div style="background:#fff;border-radius:8px;padding:16px">${body}</div></div>`}
function sideRecs(){
 const tile=(n,bg,inner,pct)=>`<div class="col" style="gap:4px;flex:none;width:${mo()?106:155}px"><div style="height:${mo()?60:80}px;background:${bg};display:flex;align-items:center;justify-content:center;overflow:hidden">${inner}</div><span class="cap" style="color:var(--text-secondary)">${n}</span><span class="cap med">${pct} Total Savings</span></div>`;
 const tiles=[tile('Bitget','#00f0ff',img('lnd-bitget.png','width:40px;height:40px'),'54%'),tile('Bybit','#171a26',img('guest-bybit.png','height:100%'),'55%'),tile('Binance','#1e2026',img('home-logo-binance.png','width:40px;height:40px;border-radius:50%'),'50%'),tile('OKX','#000',img('guest-okx.png','height:100%'),'65%')];
 const head=t=>`<div class="row between"><span class="${mo()?'b1 semi':'h5 bold'}" style="${mo()?'':'font-size:24px'}">${t}</span><button class="btn text primary sm" data-go="${t==='Top Partner Exchanges'?'cex.list':'benefits.list'}">See All</button></div>`;
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
  return `<div style="padding:0 ${mo()?16:40}px;background:#f8fafc">${appBanner(r.handoff?'Manage your cashback in the TetherMax app':undefined)}${C.note(flow)}</div><section style="background:#f8fafc;padding:${mo()?'8px 16px 0':'24px 24px 56px'}"><div class="col" style="max-width:1090px;margin:0 auto;gap:${mo()?16:40}px">
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
  const m=MODAL[st];
  const inner=/^picker/.test(st)?pickerInner(st==='pickerCex'?'cex':st==='pickerDex'?'dex':'all'):dialogInner(st);
  const note=`<div style="position:absolute;left:16px;right:16px;bottom:8px;z-index:25">${C.note(`<b>흐름</b> ${m.flow}`)}</div>`;
  return `<div style="position:relative">${C.overlay(m.bg,inner,{center:!/^picker/.test(st)})}${note}</div>`;
 }});
// 거래소 선택 팝업 안쪽(PC 480 팝업 · 모바일 바텀시트 — 실서비스 /en/search 「Select Exchange」와 같은 구성). f = all | cex | dex
// 상태 그림(목록판 guest.modal:picker*)과 화면 안 팝업(검색 화면 `Select exchange`)이 같은 함수를 쓴다. data-gs-* = 화면 안 동작용 표식
function pickerInner(f){
 const go=n=>DX.includes(n)?'guest.search:emptydex':'guest.search:emptycex';
 const pick=n=>`data-go="${go(n)}" data-gs-pick="${n}"`;
 const topTile=n=>`<button type="button" ${pick(n)} style="flex:none;width:${mo()?76:88}px;height:${mo()?72:76}px;background:#fff;border:1px solid var(--divider);border-radius:4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:inherit;padding:0">${logo(n,32)}<span style="font-size:11px;line-height:1.4">${n}</span></button>`;
 const tile=n=>{const dex=DX.includes(n);return `<button type="button" ${pick(n)} style="min-width:0;background:transparent;border:0;padding:0;display:flex;flex-direction:column;gap:2px;cursor:pointer;color:inherit;text-align:left"><span style="height:${mo()?48:56}px;border-radius:4px;background:${dex?'#f0f1f4':BGC[n]||'#f0f1f4'};display:flex;align-items:center;justify-content:center">${logo(n,32)}</span><span style="font-size:11px;line-height:1.4;color:var(--text-secondary)">${n}</span>${dex&&f==='all'?'<span style="font-size:10px;line-height:1;color:var(--text-secondary)">DEX</span>':''}</button>`};
 const list=f==='dex'?DX:f==='cex'?REST:[...REST,...DX];
 const head=f==='dex'?`Decentralised Exchanges (${list.length})`:f==='cex'?`Centralised Exchanges (${list.length})`:`All Exchanges (${list.length})`;
 const CH=[['all','All','picker'],['cex','CEX','pickerCex'],['dex','DEX','pickerDex']];
 const chips=`<div class="row g8" role="group" aria-label="Exchange type">${CH.map(([k,l,to])=>`<span class="chip ft${f===k?' on':''}" data-go="guest.modal:${to}" data-gs-chip="${k}" role="button" tabindex="0" aria-pressed="${f===k}">${l}</span>`).join('')}</div>`;
 const top=f==='dex'?'':`<div class="col" data-gs-top style="gap:8px"><span class="b2 semi">Top Popular Exchanges</span><div style="position:relative"><div class="row" style="gap:8px;overflow:hidden">${TOP.map(topTile).join('')}</div><button class="icon-btn" aria-label="Next" style="position:absolute;right:-8px;top:50%;transform:translateY(-50%);width:24px;height:24px;padding:0;background:#fff;border-radius:50%;box-shadow:0 1px 4px rgba(0,0,0,.2)">${ic('chevron-right','ic16')}</button></div></div>`;
 const search=`<div class="tf sm"><div class="in"><img src="${A('link-ic-search.svg')}" class="ic20" alt=""><input type="search" data-gs-q placeholder="Search for an exchange" aria-label="Search for an exchange"></div></div>`;
 const body=`${search}${chips}${top}<div class="col" style="gap:8px"><span class="b2 semi" data-gs-head>${head}</span><div data-gs-grid style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:${mo()?'12px 8px':'16px'};max-height:${mo()?'none':'220px'};overflow-y:auto">${list.map(tile).join('')}</div></div>`;
 if(mo()){
  // 모바일 바텀시트 = Figma 29035:98094 · 29179:116351 · 29179:116630: 높이 640 · 안쪽 24×16 · 간격 24 · 손잡이 27×3 · 칩 64×34 · 인기 타일 81×66 · 3열 타일 102×68(배너 46)
  const chipM=([k,l,to])=>`<span class="chip" data-go="guest.modal:${to}" data-gs-chip="${k}" role="button" tabindex="0" aria-pressed="${f===k}" style="width:64px;height:34px;border-radius:17px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;line-height:17px;cursor:pointer;border:0;padding:0;background:${f===k?'#1043cc':'#f2f4f8'};color:${f===k?'#fff':'#20232a'}">${l}</span>`;
  const topM=n=>`<button type="button" ${pick(n)} style="flex:none;width:81px;height:66px;background:#fff;border:1px solid var(--divider);border-radius:8px;display:flex;flex-direction:column;align-items:center;gap:4px;padding:6px 0 0;cursor:pointer;color:inherit">${logo(n,36)}<span style="font-size:10px;line-height:12px;font-weight:500;color:#616161;white-space:nowrap">${n}</span></button>`;
  const tileM=n=>{const dex=DX.includes(n);return `<button type="button" ${pick(n)} style="width:102px;min-height:68px;background:transparent;border:0;padding:0;display:flex;flex-direction:column;gap:3px;cursor:pointer;color:inherit;text-align:left"><span style="height:46px;width:100%;border-radius:4px;background:${dex?'#f0f1f4':BGC[n]||'#f0f1f4'};display:flex;justify-content:center;padding-top:6px">${logo(n,34)}</span><span style="font-size:10px;line-height:12px;font-weight:500;color:#616161">${n}</span>${dex&&f==='all'?'<span style="font-size:10px;line-height:1;color:var(--text-secondary)">DEX</span>':''}</button>`};
  const topM2=f==='dex'?'':`<span data-gs-top style="font-size:14px;font-weight:600;line-height:17px;color:#202124">Top Popular Exchanges</span><div data-gs-top style="position:relative;margin:10px 0 5px"><div class="row" style="gap:6px;overflow:hidden;height:68px;align-items:flex-start">${TOP.map(topM).join('')}</div><button class="icon-btn" aria-label="Next" style="position:absolute;right:-6px;top:21px;width:24px;height:24px;padding:0;background:#fff;border:1px solid var(--divider);border-radius:12px">${ic('chevron-right','ic16')}</button></div>`;
  return `<div data-gs-sheet style="position:relative;width:100%;height:640px;max-height:100%;background:#fff;border-radius:16px 16px 0 0;box-shadow:var(--elev24);padding:24px 16px;display:flex;flex-direction:column;gap:24px;overflow:hidden;text-align:left"><span style="position:absolute;left:50%;top:9px;width:27px;height:3px;margin-left:-13.5px;border-radius:1.5px;background:#d9d9d9"></span>
   <div class="row between" style="height:32px;flex:none"><span style="font-size:20px;font-weight:500;line-height:32px;color:rgba(0,0,0,.87)">Select Exchange</span><button class="icon-btn" aria-label="Close" style="width:30px;height:30px;padding:5px" data-go="guest.search:search">${ic('close')}</button></div>
   <div class="col" style="gap:12px;flex:none">${search.replace('<div class="tf sm">','<div class="tf sm" style="height:40px">').replace('<div class="in">','<div class="in" style="height:40px;box-sizing:border-box">')}<div class="row" style="gap:8px" role="group" aria-label="Exchange type">${CH.map(chipM).join('')}</div></div>
   <div class="col" style="flex:1;min-height:0;overflow-y:auto;gap:0">${topM2}<span data-gs-head style="font-size:14px;font-weight:600;line-height:17px;color:#202124">${head}</span><div data-gs-grid style="display:grid;grid-template-columns:repeat(3,102px);justify-content:space-between;row-gap:10px;padding:0 4px;margin-top:11px">${list.map(tileM).join('')}</div></div></div>`;
 }
 return gDialog('Select Exchange',body,'',{w:480,sheet:1,close:'guest.search:search'});
}
// 안내 팝업(결과 없음 · 일시 오류 · 조회 제한) — 상태 그림과 화면 안 팝업이 같은 함수
function dialogInner(st){
 if(st==='none')return gDialog('No public result',`<p class="b2 c2" style="margin:0">Check the exchange and account details, or log in to view your linked account.</p>`,C.btn('Log in',{full:true,go:'auth.login'})+back());
 if(st==='error')return gDialog('Couldn’t load cashback',`<p class="b2 c2" style="margin:0">Your search details are saved. Try again with the same exchange and account.</p>`,C.btn('Try again',{full:true,go:'guest.search:loading'}).replace('<button ','<button data-gs-retry ')+back());
 return gDialog('Too many searches',`<p class="b2 c2" style="margin:0">Please wait before searching again.</p>`,back('guest.search:dex','primary'));
}

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
   ${emailBox(6)}</div>
  <div class="row" style="position:absolute;left:16px;right:0;top:610px;gap:12px;overflow-x:auto;scrollbar-width:none">${stat('199,092','Total registered users')}${stat('24/7','Live support center')}${stat('370,342 USDT','Cumulative cashback')}${stat('2,103 USDT','Cashback paid today (24h)')}</div></section>`;
 const foot=footer();
 return `${hero}<div style="padding:0 16px">${C.note('<b>진입 경로</b> 모바일 홈(게스트) 푸터 Company › <b>Claim Cashback</b>(점선) → guest.search:search. 히어로는 프리로그인 랜딩 모바일과 같은 컴포넌트.')}</div>${foot}`}
R.screen({id:'guest.entry',group:'guest',title:'모바일 진입 홈 (Claim Cashback)',route:'/ (모바일 · 비로그인)',fu:['FU-012'],shell:false,
 states:[{id:'normal',label:'모바일 홈 푸터 → Claim Cashback',figma:{mo:'29037:113704'},note:'Figma 「Mobile / Guest entry / Home」 — 웹은 landing.main 푸터 Company › Claim Cashback'}],
 render(){
  if(!mo())return renderInner('landing.main:normal');
  const o=S.auth;S.auth='guest';try{return `${moTop()}${moEntry()}`}finally{S.auth=o}
 }});

// ---------- 화면 안 동작(목록판 · 동작판 공통 — REQ-175 · 화면요소 정의 guest.search / guest.modal) ----------
// 기준: 실서비스 /en/search(dev, 2026-11-27 직접 조작) — `Select exchange` = 거래소 선택 팝업(PC 가운데 480 · 모바일 바텀시트) · 고르면 닫히고 그 거래소로 바뀜 ·
// 입력칸 `?` = `What is UID?` 팝업 · 하단 띠 이메일 → 가입 화면 Email 칸. 화면(Figma) = 선택 전 입력칸 비활성 `Select an exchange first` · 입력 전 `Check cashback` 비활성 · 조회 중 `Searching...`.
// 전환 = 공통 모션 토큰: 팝업 --m-modal(불투명도 + --m-modal-shift) · 바텀시트 --m-drawer · 내용 교체 UI.swapFx(--m-std)
if(!window.__gsBound&&typeof document!=='undefined'&&document.addEventListener){window.__gsBound=1;
 const tok=(k,d)=>{try{const v=getComputedStyle(document.documentElement).getPropertyValue(k).trim();return v.endsWith('ms')?parseFloat(v):v.endsWith('s')?parseFloat(v)*1000:(parseFloat(v)||d)}catch(e){return d}};
 const reduced=()=>!!(window.MOTION&&MOTION.reduced&&MOTION.reduced());
 const E_STD='cubic-bezier(.4,0,.2,1)';
 const fx=(el,kf,dur)=>{if(!el||reduced()||!el.animate)return null;try{return el.animate(kf,{duration:dur,easing:E_STD,fill:'both'})}catch(e){return null}};
 const swap=els=>{if(window.UI&&UI.swapFx)UI.swapFx(els.filter(Boolean))};
 const inList=()=>!!document.getElementById('pt-frame')&&!document.body.classList.contains('site');
 const curO=x=>Object.assign({ex:GS.ex,value:GS.val,ph:PH(GS.ex),enabled:!!(GS.ex&&GS.val.trim())},x||{});
 const panelEl=()=>document.querySelector('[data-gs-panel]');
 const reset=()=>{GS.on=false;GS.ex=null;GS.val='';GS.retried=false};
 let LY=null,BUSY=false;
 // ---- 팝업 층(거래소 선택 · UID 안내 · 결과 없음 · 일시 오류 · 조회 제한)
 function openLayer(kind,html,o={}){
  closeLayer(true);
  const list=inList(),host=list?document.getElementById('pt-frame'):document.body;
  const el=document.createElement('div');
  el.className='scrim'+(list?' pt-fixed':'')+(o.center?' center':'');
  el.setAttribute('data-gs-layer',kind);el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');
  if(!list)el.style.cssText='position:fixed;inset:0;z-index:1400';
  if(o.mid&&!mo())el.style.alignItems='center';
  el.innerHTML=html;host.appendChild(el);
  const sheet=mo()&&!o.center;
  LY={el,kind,f:o.f||'all',back:o.back||null,sheet};
  if(!list)document.documentElement.style.overflow='hidden';
  fx(el,[{opacity:0},{opacity:1}],tok('--m-modal',220));
  const p=el.firstElementChild;
  if(sheet)fx(p,[{transform:'translateY(100%)'},{transform:'none'}],tok('--m-drawer',280));
  else fx(p,[{opacity:0,transform:`translateY(${tok('--m-modal-shift',30)}px)`},{opacity:1,transform:'none'}],tok('--m-modal',220));
  el.addEventListener('click',onLayerClick);
  const q=el.querySelector('[data-gs-q]');if(q&&!mo())try{q.focus({preventScroll:true})}catch(e){}
  return el}
 function closeLayer(now){
  if(!LY)return;const {el,back,sheet}=LY;LY=null;
  if(!inList())document.documentElement.style.overflow='';
  if(back&&back.isConnected&&!now)try{back.focus({preventScroll:true})}catch(e){}
  if(now||!el.isConnected||reduced())return el.remove();
  el.style.pointerEvents='none';
  const p=el.firstElementChild;
  if(sheet)fx(p,[{transform:'none'},{transform:'translateY(100%)'}],tok('--m-drawer',280));
  else fx(p,[{opacity:1,transform:'none'},{opacity:0,transform:`translateY(${tok('--m-modal-shift',30)}px)`}],tok('--m-modal',220));
  const a=fx(el,[{opacity:1},{opacity:0}],tok('--m-modal',220));
  if(a)a.onfinish=()=>el.remove();else el.remove()}
 // ---- 거래소 선택: 검색어 · 유형 칩(검색은 고른 칩 안에서 — REQ-056) · 0건 `No results found for “…”`(연동 선택기와 같은 문구)
 const HEAD={all:'All Exchanges',cex:'Centralised Exchanges',dex:'Decentralised Exchanges'};
 function filterPicker(){
  if(!LY||LY.kind!=='picker')return;
  const p=LY.el,inp=p.querySelector('[data-gs-q]'),raw=(inp&&inp.value||'').trim(),q=raw.toLowerCase(),grid=p.querySelector('[data-gs-grid]');let n=0;
  grid.querySelectorAll('[data-gs-pick]').forEach(b=>{const ok=!q||b.dataset.gsPick.toLowerCase().includes(q);b.style.display=ok?'':'none';if(ok)n++});
  p.querySelectorAll('[data-gs-top]').forEach(top=>{if(top.dataset.d==null)top.dataset.d=top.style.display||'';top.style.display=q?'none':top.dataset.d});
  const h=p.querySelector('[data-gs-head]');if(h)h.textContent=`${HEAD[LY.f]} (${n})`;
  let em=p.querySelector('[data-gs-empty]');
  if(n){if(em)em.remove()}else{if(!em){em=document.createElement('p');em.setAttribute('data-gs-empty','');em.className='b2 c2';em.style.margin='8px 0 0';grid.after(em)}em.textContent=`No results found for “${raw}”`}
 }
 function setChip(f){
  if(!LY)return;const q=(LY.el.querySelector('[data-gs-q]')||{}).value||'';
  const tmp=document.createElement('div');tmp.innerHTML=pickerInner(f);const np=tmp.firstElementChild,op=LY.el.firstElementChild;
  op.replaceWith(np);LY.f=f;
  const qi=np.querySelector('[data-gs-q]');if(qi){qi.value=q;if(q||!mo())try{qi.focus({preventScroll:true})}catch(e){}}
  filterPicker();swap([np.querySelector('[data-gs-grid]')]);
 }
 function openPicker(trigger){openLayer('picker',pickerInner('all'),{back:trigger})}
 // ---- 거래소 고름 → 검색 카드 다시 그림(같은 거래소면 입력 유지, 바꾸면 입력 지움 — REQ-175 G-457)
 function selectEx(name){
  if(GS.ex!==name||!GS.on){GS.ex=name;GS.val='';GS.retried=false}
  GS.on=true;closeLayer();
  const panel=panelEl();
  if(!panel)return window.go(isDexEx(name)?'guest.search:emptydex':'guest.search:emptycex');   // 목록판 상태 그림(guest.modal:picker)에서 고른 경우
  repaint(panel,{},true);
 }
 function repaint(panel,x,focus){
  const tmp=document.createElement('div');tmp.innerHTML=cardPanel(curO(x));const np=tmp.firstElementChild;
  panel.replaceWith(np);
  if(!(x&&x.loading))swap([np.querySelector('[data-gs-sel] .row'),np.querySelector('[data-gs-field] .row')]);
  const i=np.querySelector('[data-gs-in]');if(focus&&i&&!i.disabled)try{i.focus({preventScroll:true})}catch(e){}
  return np}
 function setErr(panel,msg){
  const f=panel.querySelector('[data-gs-field]');if(!f)return;
  f.style.borderColor=msg?'var(--error)':'rgba(255,255,255,.8)';
  let er=panel.querySelector('[data-gs-err]');
  if(!msg){if(er)er.remove();return}
  if(!er){er=document.createElement('span');er.className='cap ce';er.setAttribute('data-gs-err','');er.style.padding='0 2px';f.after(er)}
  er.textContent=msg;
 }
 function syncBtn(panel){const b=panel.querySelector('[data-gs-check]');if(!b)return;const ok=!!(panel.dataset.ex&&GS.val.trim());b.disabled=!ok;b.classList.toggle('primary',ok)}
 // ---- Check cashback → 조회 중(Figma 29035:98526) → 결과 화면 또는 안내 팝업. 결과 구분은 프로토타입 표본(입력 끝 4자리, 개발 메모 DEV_SAMPLE)
 function runCheck(){
  const panel=panelEl();if(!panel||BUSY)return;
  const ex=panel.dataset.ex,inp=panel.querySelector('[data-gs-in]'),v=(inp&&inp.value||'').trim();if(!ex||!v)return;
  GS.on=true;GS.ex=ex;GS.val=v;BUSY=true;
  repaint(panel,{loading:1,enabled:0});
  const sub=document.querySelector('[data-gs-sub]');if(sub){sub.textContent=SUB_LOADING;swap([sub])}
  setTimeout(()=>{
   BUSY=false;
   const k=v.slice(-4),dex=isDexEx(ex);
   const out=k==='4040'?'none':k==='4290'?'limit':k==='5000'&&!GS.retried?'error':dex?(k==='0000'?'zero':k==='1111'?'below':'above'):'belowcex';
   if(out==='error')GS.retried=true;
   const p=panelEl();if(!p)return;
   if(sub&&sub.isConnected){sub.textContent=SUB;swap([sub])}
   if(['none','error','limit'].includes(out)){repaint(p,{});return openLayer(out,dialogInner(out),{center:true})}
   window.go('guest.result:'+out);
  },1000);
 }
 function openHelp(panel,trigger){
  const ex=panel&&panel.dataset.ex;
  const html=ex&&isDexEx(ex)
   ?gDialog('How to find your wallet address',`<p class="b2 c2" style="margin:0">Open ${ex} and copy the wallet address from your account. Paste it above.</p>`,'',{w:480,sheet:1,close:'guest.search:search'})
   :gDialog('What is UID?',`<p style="margin:0;font-size:12px;line-height:20px;color:var(--text-primary)">This is a unique number code that can be found in \`My Information\` after signing up for the exchange.</p>`,'',{w:480,sheet:1,close:'guest.search:search'});
  openLayer('help',html,{back:trigger,mid:true});
 }
 function onLayerClick(e){
  const t=e.target;if(!LY)return;
  const stop=()=>{e.preventDefault();e.stopPropagation()};
  if(t===LY.el){stop();return closeLayer()}                       // 바깥(어두운 부분) = 닫기
  const pk=t.closest('[data-gs-pick]');if(pk){stop();return selectEx(pk.dataset.gsPick)}
  const ch=t.closest('[data-gs-chip]');if(ch){stop();if(ch.dataset.gsChip!==LY.f)setChip(ch.dataset.gsChip);return}
  if(t.closest('[data-gs-retry]')){stop();closeLayer(true);return runCheck()}
  const ib=t.closest('.icon-btn');
  if(ib&&ib.getAttribute('aria-label')==='Next'){stop();const row=ib.parentElement.querySelector('.row');if(row)row.scrollBy({left:row.clientWidth*.8,behavior:reduced()?'auto':'smooth'});return}
  if(ib){stop();return closeLayer()}                                // 닫기 X — 선택 없이 닫힘(입력 유지)
  const g=t.closest('[data-go]');
  if(g&&/^Back to search$/.test((g.textContent||'').trim())){stop();return closeLayer()}   // 검색 화면 그대로(거래소·입력 유지)
  if(g){stop();const k=g.dataset.go;closeLayer(true);if(k)window.go(k)}                   // Log in 등
 }
 // ---- 문서 단위 이벤트
 document.addEventListener('click',e=>{
  const t=e.target;if(!t||!t.closest)return;
  if(t.closest('#pt-bar,#pt-side'))return reset();                 // 목록판 도구(상태 고르기·로그인 전환) = 표본 그림으로
  const pk=t.closest('[data-gs-pick]');
  if(pk&&!t.closest('[data-gs-layer]')){GS.on=true;GS.ex=pk.dataset.gsPick;GS.val='';GS.retried=false}   // 거래소 선택 상태 그림(guest.modal:picker*)에서 고름
  const g=t.closest('[data-go]');
  if(g&&!t.closest('[data-gs-layer]')){
   if(g.dataset.go==='guest.search:search')reset();               // 푸터 Claim Cashback 등 새로 들어옴
   if(g.dataset.go==='auth.signup'){const f=g.closest('[data-gs-email-form]'),i=f&&f.querySelector('[data-gs-email]');GS.email=i?i.value.trim():'';if(GS.email)setTimeout(fillSignup,0)}
  }
 },true);
 document.addEventListener('change',e=>{if(e.target&&e.target.closest&&e.target.closest('#pt-bar'))reset()},true);
 function fillSignup(){const i=document.querySelector('[data-tf-form] .tf-in[placeholder="Email"]');if(!i||!GS.email)return;i.value=GS.email;GS.email='';i.dispatchEvent(new Event('input',{bubbles:true}))}
 document.addEventListener('click',e=>{
  const t=e.target;if(!t||!t.closest||t.closest('[data-gs-layer]'))return;
  const sel=t.closest('[data-gs-sel]');if(sel){e.preventDefault();if(!BUSY)openPicker(sel);return}
  const hp=t.closest('[data-gs-help]');if(hp){e.preventDefault();return openHelp(hp.closest('[data-gs-panel]'),hp)}
  if(t.closest('[data-gs-check]')){e.preventDefault();return runCheck()}
 });
 document.addEventListener('input',e=>{
  const t=e.target;if(!t||!t.matches)return;
  if(t.matches('[data-gs-q]'))return filterPicker();
  if(!t.matches('[data-gs-in]'))return;
  if(/[\r\n]/.test(t.value))t.value=t.value.replace(/\s*[\r\n]+\s*/g,'');
  const panel=t.closest('[data-gs-panel]');GS.on=true;GS.ex=panel.dataset.ex||null;GS.val=t.value;t.dataset.touched='1';
  t.classList.toggle('mono',!!t.value);t.style.fontFamily=t.value?'':'inherit';t.style.letterSpacing=t.value?'.5px':'inherit';
  setErr(panel,null);syncBtn(panel);
 });
 // DEX 입력칸을 비운 채 벗어나면 Figma 입력 오류(29035:98401) — CEX UID 오류 문구는 Figma·실서비스에 없어 표시하지 않음
 document.addEventListener('focusout',e=>{const t=e.target;if(!t||!t.matches||!t.matches('[data-gs-in]')||!t.dataset.touched||t.value.trim())return;const panel=t.closest('[data-gs-panel]');if(panel&&isDexEx(panel.dataset.ex))setErr(panel,'Enter your wallet address.')});
 document.addEventListener('keydown',e=>{
  const t=e.target;
  if(e.key==='Escape'&&LY){e.preventDefault();e.stopPropagation();return closeLayer()}
  if(!t||!t.matches)return;
  if(e.key==='Enter'&&t.matches('[data-gs-in]')){e.preventDefault();return runCheck()}
  if(e.key==='Enter'&&t.matches('[data-gs-email]')){e.preventDefault();const b=t.closest('[data-gs-email-form]').querySelector('[data-go]');if(b)b.click();return}
  if((e.key==='Enter'||e.key===' ')&&t.matches('[data-gs-sel],[data-gs-help],[data-gs-chip]')){e.preventDefault();t.click()}
 },true);
 // 입력칸 자리표시 색(Figma: 선택 후 회색 · 선택 전 흐림)
 try{const st=document.createElement('style');st.textContent='[data-gs-in]::placeholder{color:var(--text-secondary);opacity:1}[data-gs-in]:disabled::placeholder{color:var(--text-disabled)}[data-gs-in]:disabled{cursor:default}[data-gs-email]::placeholder{color:var(--text-secondary);opacity:1}';(document.head||document.documentElement).appendChild(st)}catch(x){}
}
