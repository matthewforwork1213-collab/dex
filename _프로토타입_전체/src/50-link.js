// 5. 거래 계정 연동 — FU-013 ~ FU-025 (FU-022 홈 반영 상태는 홈 담당) + 기존 CEX UID 입력(link.uid)
// Figma: DEX(revision) › "DEX — Link, all states and detail page entry"(웹 L1~L15 · Address validation · Verification success · Pre-link · Signup + Link Wallet) ·
//        "DEX — Link stories on home (S3, S4)"(S3-2 Link Account 모달) · "Mobile · Link Account"(모바일, 라이트) · [MAX-30] Link UID(9105:196091)
// 결과 화면은 Figma 「연동 결과 · 전체 화면 모달」(UID link result / Splash) 컴포넌트 — Severity가 아이콘·색을 정한다.
const DEXES=['Lighter','ApeX','EdgeX','Aster'];
const MO_DEXES=['Lighter','EdgeX','ApeX','Aster']; // 모바일 시트 타일 순서(Figma)
const ADDR='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9'; // Figma L3 예시 주소(원문 대소문자)
const BG='dex.detail:lighter'; // 웹 모달 배경 = D1 Lighter 상세 (Figma: Background / D1 Lighter detail)
// CEX 마크(모바일 Figma "Select an exchange · original mobile sheet"의 로고·타일 배경·Total Savings 예시값)
const CEX=[['Bitget','bitget.png','#00f0ff',54],['Bybit','bybit.png','#15192a',55],['Binance','binance.png','#181a20',50],['OKX','okx.png','#000',65],['MEXC','mexc.png','#212425',50],['Gate','gate.png','#0051d2',75],['DeepCoin','deepcoin.png','#19181d',50],['BingX','bingx.png','#2a54ff',60],['BitMEX','bitmex.png','#fff',70],['LBank','lbank.svg','#fff',50],['BlockFin','blockfin.svg','#fff',70],['KuCoin','kucoin.png','#2dbd96',65],['Zoomex','zoomex.png','#121b24',50],['Bitunix','bitunix.svg','#fff',85],['BitMart','bitmart.png','#19181d',70],['WOOX','woox.png','#121b24',60],['BioFin','blofin.png','#fff',70],['HTX','htx.svg','#fff',54],['BVOX','bvox.png','#ee7724',60]];
const cexBy=n=>CEX.find(c=>c[0]===n);
const mark=(n,s=32)=>{const c=cexBy(n);return c?`<img class="dexmark" src="${A('link-cex-'+c[1])}" style="width:${s}px;height:${s}px" alt="${n}">`:C.dex(n,s)};
const limg=(n,s=24)=>`<img src="${A('link-'+n)}" style="width:${s}px;height:${s}px;flex:none" alt="">`;

// ---------- 공통 조각 ----------
// 웹: 600폭 모달(헤더 바 56 · 본문 · 액션)
function linkModal(body,actions,o={}){return C.modal(T('Link Account','거래 계정 연동하기'),body,actions,{w:o.w||600,close:o.close||'home.main',full:S.vp==='mo'})}
// 모바일: 전체 화면 폼(Figma "모바일 원본" — 액센트 배경 · 뒤로 + h6 · 하단 고정 액션 흰 영역, REQ-052 Next 항상 닿음)
function moForm(title,body,actions,back='home.main'){
 return `<div style="background:var(--bg-accent);min-height:812px;display:flex;flex-direction:column">
  <div class="row" style="gap:8px;padding:16px 16px 0">${`<button class="icon-btn" style="padding:5px" data-go="${back}">${limg('ic-back.svg')}</button>`}<span class="h6" style="font-weight:500">${title}</span></div>
  <div class="col" style="gap:16px;padding:16px;flex:1">${body}</div>
  <div style="background:#fff;padding:16px;display:flex;flex-direction:column;gap:8px;position:sticky;bottom:0">${actions}</div></div>`}
const moHint=t=>`<p style="margin:0;font-size:12px;color:#545a63;text-align:center">${t}</p>`;
const trust=()=>`<p class="b2 c2" style="margin:0">${T('No wallet connection or signature required.','지갑 연결이나 서명은 필요하지 않아요.')}</p>`;
const signUp=(ex)=>`<p class="b1 med" style="margin:0;text-align:center;padding:8px 0">${T('Don’t have an account yet?','아직 계정이 없으신가요?')} <a class="cb" style="cursor:pointer" data-ref-signup="${esc(ex||selectedExchange||'')}">${T('Register here','여기서 가입하세요')}</a></p>`;
const help=()=>C.btn(T('Need help? Contact Support'),{v:'text',c:'black',full:true,go:'support.main'});
const dexSel=(d,s=32)=>S.vp==='mo'
 ? `<button type="button" class="sel" data-go="link.select:normal">${C.dex(d,s)}<span class="b1 grow">${d}</span>${ic('arrow-drop-down')}</button>`
 : webExchangeField(d);
// 지갑 주소 찾기 안내 — 웹 = 좌우 화살표 + 점 캐러셀(REQ-069) + 보안 문구(G-392) / 모바일 = Figma 모바일 원문 + 세로 이미지
const guideText={Lighter:'Open Lighter and log in. Tap your wallet address in the top right corner, copy it, then paste it above. No wallet connection or signature required.'};
function guide(d){
 if(S.vp==='mo'){
  const txt=d==='Lighter'?T('Open Lighter and copy the wallet address from your account. Paste it above. TetherMax never asks for your private key, seed phrase, or a wallet signature.'):T(`Open ${d} and copy the wallet address from your account. Paste it above.`,`${d}에서 계정의 지갑 주소를 복사해 위에 붙여넣으세요.`);
  return `<div class="col g8"><span class="b1 semi">${T('How to find your wallet address','지갑 주소 찾는 방법')}</span><p class="cap" style="margin:0">${txt}</p>
   <div style="height:256px;background:#eaeef4;overflow:hidden">${d==='Lighter'?`<img src="${A('guide-lighter-1.png')}" style="width:100%;height:100%;object-fit:contain">`:''}</div></div>`;
 }
 const txt=guideText[d]?T(guideText[d],'Lighter에 로그인한 뒤 오른쪽 위 지갑 주소를 눌러 복사하고 위에 붙여넣으세요. 지갑 연결이나 서명은 필요하지 않아요.'):T(`Open ${d} and copy the wallet address from your account. Paste it above.`,`${d}에서 계정의 지갑 주소를 복사해 위에 붙여넣으세요.`);
 const shot=guideText[d]?`<img src="${A('guide-lighter-1.png')}" style="width:100%;height:100%;object-fit:cover">`:`<div style="width:100%;height:100%;background:var(--bg-accent);display:flex;align-items:center;justify-content:center" class="cap c3">${d} screenshot 1 / 3</div>`;
 const arrow=(side,i)=>`<button class="icon-btn" style="position:absolute;${side}:12px;top:89px;background:#fff;box-shadow:0 2px 3px rgba(0,0,0,.16);padding:6px">${ic(i,'ic20')}</button>`;
 return `<div class="col g8"><span class="b1 semi">${T('How to find your wallet address','지갑 주소 찾는 방법')}</span><p class="b2 c2" style="margin:0">${txt}</p>
  <div style="position:relative;height:210px;border-radius:4px;overflow:hidden">${shot}${arrow('left','chevron-left')}${arrow('right','chevron-right')}</div>
  <div class="row center" style="gap:6px"><span style="width:24px;height:8px;border-radius:4px;background:var(--blue)"></span><span style="width:8px;height:8px;border-radius:4px;background:var(--divider)"></span><span style="width:8px;height:8px;border-radius:4px;background:var(--divider)"></span></div>
  <p class="cap c2" style="margin:0">${T('TetherMax never asks for your private key, seed phrase, or a wallet signature.','테더맥스는 개인키 · 시드 문구 · 지갑 서명을 요구하지 않아요.')}</p></div>`}

// 연동 결과 · 전체 화면 모달 — 웹: 상단 바 72(닫기 48) · 본문 좌우 480 · 버튼이 본문 안 / 모바일: 상단 바 56 · 본문 좌우 32 · 버튼이 하단(패딩 16)
// sev = info(InfoRounded) · success(CheckCircleRounded) · warning(WarningRounded) · error(ErrorRounded), 플레이트 = 같은 색 12% 원
const SEV={info:'#0288D1',success:'#2E7D32',warning:'#EF6C00',error:'#D32F2F'};
window.LINK_SPLASH=(...a)=>splash(...a);
function splash(sev,title,msg,btns,o={}){
 const mo=S.vp==='mo';
 const lines=[].concat(msg||[]).map(l=>`<p class="b1 c2" style="margin:0 0 8px;text-align:center;word-break:break-word">${l||'&nbsp;'}</p>`).join('');
 const acts=btns?`<div class="col g8" style="width:100%">${btns}</div>`:'';
 return `<div style="position:relative;background:#fff;min-height:${mo?812:900}px;display:flex;flex-direction:column">
  <div style="height:${mo?56:72}px;display:flex;align-items:center;justify-content:flex-end;padding:0 ${mo?8:24}px;flex:none"><button class="icon-btn" style="width:48px;height:48px" data-go="${o.close||'home.main'}">${ic('close')}</button></div>
  <div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding:0 ${mo?32:480}px">
   <div style="width:96px;height:96px;border-radius:48px;background:${SEV[sev]}1f;display:flex;align-items:center;justify-content:center;flex:none"><img src="${A('link-ic-'+sev+'.svg')}" style="width:48px;height:48px" alt=""></div>
   <div style="height:16px"></div>
   <p class="h5" style="margin:0;text-align:center">${title}</p>
   <div style="width:100%">${lines}</div>
   ${!mo&&acts?`<div style="height:24px"></div>${acts}`:''}
  </div>${mo&&acts?`<div style="padding:16px;flex:none">${acts}</div>`:`<div style="height:72px;flex:none"></div>`}${o.toast||''}</div>`}

// ---------- FU-013 거래소 선택 ----------
// 웹은 기존 연동 폼의 거래소 필드 아래 공통 팝오버. 새로 열 때 All부터 시작한다.
// 모바일(Figma "Mobile · Link Account"): 모바일 연동 폼 위 바텀시트 `Select an exchange` · 칩 All/CEX/DEX · Top Partner Exchanges · 3열 타일
const SEL={ // 칩 · 검색어 · 제외 DEX · 실패
 normal:{chip:'all'},uid:{chip:'all'},uidFilled:{chip:'all'},dexlist:{chip:'all'},cex:{chip:'cex'},dex:{chip:'dex'},one:{chip:'dex',q:'lighter'},many:{chip:'dex',q:'a'},none:{chip:'all',q:'zzz'},dexbit:{chip:'dex',q:'bit'},region:{chip:'all',drop:'Aster'},fail:{chip:'all',fail:true},
};
const WEB_CEX=['WOO X Pro','Bitget','Binance','Bybit','Flipster','OKX','MEXC','BingX','DeepCoin','Gate','LBank','BlockFin','KuCoin','Zoomex','Bitunix','BloFin','HTX','Toobit'];
const EXTRA_MARKS={'WOO X Pro':'calc-wooxpro.png',Flipster:'calc-flipster.png',Toobit:'calc-toobit.svg',BloFin:'link-cex-blofin.png'};
const WEB_TOP=WEB_CEX.slice(0,5);
const webMark=(n,s)=>EXTRA_MARKS[n]?`<img class="dexmark" src="${A(EXTRA_MARKS[n])}" style="width:${s}px;height:${s}px;object-fit:contain" alt="">`:mark(n,s);
let selectedExchange=null;
function selList(c,web){
 const cx=web?WEB_CEX:CEX.map(x=>x[0]);
 const dx=(web?DEXES:MO_DEXES).map(n=>({n,t:'DEX'})),cs=cx.map(n=>({n,t:'CEX'}));
 const l=web?[...cs,...dx]:[...dx,...cs]; // 웹 V2.2 순서(CEX 먼저) · 모바일 Figma 순서(DEX 타일 먼저)
 return l.filter(x=>c.chip==='all'||x.t===c.chip.toUpperCase()).filter(x=>!c.q||x.n.toLowerCase().includes(c.q)).filter(x=>x.n!==c.drop)}
function failBox(){return `<div class="col center" style="align-items:center;padding:24px 0;gap:4px"><span class="b1 semi">${T('Partners couldn’t load','거래소 목록을 불러오지 못했어요')}</span><span class="b2 c2">${T('Please try loading the exchange list again.','거래소 목록을 다시 불러와 주세요.')}</span><div class="mt8">${C.btn(T('Retry','다시 시도'),{v:'outlined',c:'black',size:'md'})}</div></div>`}
function webExchangeField(selected,st){
 const c=SEL[st]||SEL.normal;
 const tabs=[['all',T('All','전체')],['cex','CEX'],['dex','DEX']];
 const button=(name,kind,top=false)=>`<button type="button" data-link-venue="${esc(name)}" data-link-type="${kind}"${top?' data-link-top':''} aria-pressed="${name===selected}" style="${top?'min-height:56px;border:1px solid '+(name===selected?'var(--blue)':'var(--divider)')+';border-radius:8px;flex-direction:column;justify-content:center;gap:4px;':'min-height:44px;border:0;padding:0 12px;gap:8px;'}align-items:center;background:${name===selected&&top?'#eef6fc':'transparent'};color:inherit;text-align:left;cursor:pointer;display:${top||((c.chip==='all'||kind.toLowerCase()===c.chip)&&(!c.q||name.toLowerCase().includes(c.q)))?'flex':'none'}">${webMark(name,top?22:20)}<span class="${top?'cap c2':'b1 grow'}">${name}</span>${top?'':`${kind==='DEX'?`<span data-picker-badge style="display:${c.chip==='all'?'inline':'none'}">${C.badge('DEX','dex')}</span>`:''}${name===selected?`<img class="ic20" src="${A('link-ic-check.svg')}" alt="">`:''}`}</button>`;
 const popular=`<div data-link-popular class="col g12" style="padding-bottom:8px;display:${c.q||c.chip==='dex'?'none':'flex'}"><span class="b1 semi">${T('Top Partner Exchanges','인기 제휴 거래소')}</span><div style="display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px">${WEB_TOP.map(n=>button(n,'CEX',true)).join('')}</div></div>`;
 const opts=selList({chip:'all',drop:c.drop},true);
 const results=`<div data-link-list class="col" style="gap:4px">${opts.map(x=>button(x.n,x.t)).join('')}</div><p data-link-empty class="empty" style="margin:12px 0;display:${selList(c,true).length?'none':'block'}">${c.q?`No results found for “${esc(c.q)}”`:T('No results found','검색 결과가 없어요.')}</p>`;
 return `<details data-link-picker data-type="${c.chip}" data-current="${esc(selected||'')}" style="position:relative"${st?' open':''}>
  <summary class="sel" style="list-style:none;cursor:pointer;padding:16px 12px;min-height:58px">${selected?webMark(selected,24):''}<span class="b1 grow">${selected||T('Select a partner','거래소를 선택하세요')}</span>${ic('arrow-drop-down')}</summary>
  <div style="position:absolute;z-index:5;top:calc(100% + 4px);left:0;right:0;border-radius:4px;background:var(--paper);box-shadow:var(--elev24);padding:16px;display:flex;flex-direction:column;gap:12px">
   <label class="tf sm focus" style="display:block"><span class="in">${limg('ic-search.svg',20)}<input data-link-search type="search" aria-label="Search for an exchange" placeholder="${T('Search for an exchange','거래소 검색')}" value="${esc(c.q||'')}"></span></label>
   <div class="row g8" role="group" aria-label="Exchange type">${tabs.map(([key,name])=>`<button type="button" class="chip ft${c.chip===key?' on':''}" data-link-filter="${key}" aria-pressed="${c.chip===key}">${name}</button>`).join('')}</div>
   <div style="max-height:246px;overflow-y:auto;display:flex;flex-direction:column;gap:12px">${c.fail?failBox():popular+results}</div>
  </div></details>`;
}
function moSheet(st,origin){
 const c=SEL[st];const list=selList({chip:'all',drop:c.drop},false);
 const chips=`<div class="row g8" role="group" aria-label="Exchange type">${[['all','All'],['cex','CEX'],['dex','DEX']].map(([k,l])=>`<button type="button" class="chip ft${c.chip===k?' on':''}" data-link-filter="${k}" aria-pressed="${c.chip===k}">${l}</button>`).join('')}</div>`;
 const head=t=>`<div class="row" style="gap:16px;min-height:24px"><span class="b1 semi" style="white-space:nowrap">${t}</span>${c.q?'':'<span style="flex:1;height:1px;background:var(--divider)"></span>'}</div>`;
 const top=c.fail?'':`<div data-link-popular class="col" style="gap:12px;display:${c.q||c.chip==='dex'?'none':'flex'}">${head(T('Top Partner Exchanges'))}<div class="row" style="gap:8px;align-items:flex-start">${['Bitget','Bybit','Binance','OKX'].map(n=>`<button type="button" data-link-venue="${n}" data-link-type="CEX" style="flex:1;min-width:0;background:var(--paper);color:inherit;border:.5px solid var(--divider);border-radius:8px;box-shadow:0 4px 5px rgba(0,0,0,.04);padding:8px;display:flex;flex-direction:column;align-items:center;gap:4px;cursor:pointer">${mark(n,48)}<span class="cap c2 med">${n}</span></button>`).join('')}</div></div>`;
 const tile=x=>{const cx=cexBy(x.n);const match=(c.chip==='all'||x.t.toLowerCase()===c.chip)&&(!c.q||x.n.toLowerCase().includes(c.q));return `<button type="button" style="min-width:0;padding:8px;border-radius:8px;border:0;background:transparent;color:inherit;text-align:left;display:${match?'flex':'none'};flex-direction:column;gap:4px;cursor:pointer" data-link-venue="${x.n}" data-link-type="${x.t}">
   <div style="height:60px;border-radius:4px;position:relative;${cx?`background:${cx[2]};display:flex;align-items:center;justify-content:center`:''}">${cx?mark(x.n,48):`<span style="position:absolute;left:0;top:0">${C.dex(x.n,40)}</span>`}</div>
   <span class="cap c2 med" style="line-height:1.4">${x.n}</span>${cx?`<span style="font-size:10px;line-height:10px;letter-spacing:.15px">${cx[3]}% Total Savings</span>`:`<span data-picker-badge style="font-size:10px;display:${c.chip==='all'?'inline':'none'}">DEX</span>`}</button>`};
 const count=selList(c,false).length;
 const all=c.fail?failBox():`<div class="col g12"><span class="b1 semi" data-link-count>${pickerCount(c.chip,c.q,count)}</span><div data-link-list style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px">${list.map(tile).join('')}</div><p data-link-empty class="empty" style="display:${count?'none':'block'}">${c.q?`No results found for “${esc(c.q)}”`:T('No results found')}</p></div>`;
 const search=`<div class="tf sm${c.q?' focus':''}"><div class="in"><img src="${A('link-ic-search.svg')}" class="ic20" alt=""><input type="search" data-link-search value="${esc(c.q||'')}" placeholder="${esc(T('Search exchanges'))}" aria-label="Search exchanges"></div></div>`;
 return `<div data-link-picker data-type="${c.chip}" style="background:var(--paper);border-radius:16px 16px 0 0;width:100%;height:640px;overflow:auto;padding:24px 16px;display:flex;flex-direction:column;gap:24px">
  <div class="row between"><span class="h6" style="font-weight:500">${T('Select an exchange')}</span><button class="icon-btn" style="padding:5px" data-go="${origin}">${ic('close','ic20')}</button></div>${search}${chips}${top}${all}</div>`}

// 닫기: 사이트 모드(dex/app.html)는 공통 드롭다운 닫힘 전환(UI.closeDetails), 그 밖에는 바로 닫는다
const closePicker=picker=>{if(window.UI&&UI.closeDetails)UI.closeDetails(picker);else picker.open=false};
function pickerCount(type,q,count){
 if(q)return `${count} ${count===1?'exchange':'exchanges'} found`;
 const title={all:'All exchanges',cex:'Centralised exchanges',dex:'Decentralised exchanges'}[type];
 return `${title} (${count})`;
}
function filterExchanges(picker){
 const type=picker.dataset.type;
 const q=picker.querySelector('[data-link-search]').value.trim().toLowerCase();
 let count=0;
 for(const item of picker.querySelectorAll('[data-link-list] [data-link-venue]')){
  const show=(type==='all'||item.dataset.linkType.toLowerCase()===type)&&item.dataset.linkVenue.toLowerCase().includes(q);
  item.style.display=show?'flex':'none';
  if(show)count++;
 }
 const popular=picker.querySelector('[data-link-popular]');
 if(popular)popular.style.display=q||type==='dex'?'none':'flex';
 const empty=picker.querySelector('[data-link-empty]');
 if(empty){empty.style.display=count?'none':'block';const raw=picker.querySelector('[data-link-search]').value.trim();empty.textContent=raw?`No results found for “${raw}”`:'No results found'}
 const caption=picker.querySelector('[data-link-count]');
 if(caption)caption.textContent=pickerCount(type,q,count);
 for(const badge of picker.querySelectorAll('[data-picker-badge]'))badge.style.display=type==='all'?'inline':'none';
}
document.addEventListener('input',event=>{
 if(event.target.matches('[data-link-search]'))filterExchanges(event.target.closest('[data-link-picker]'));
});
document.addEventListener('click',event=>{
 const filter=event.target.closest('[data-link-filter]');
 if(filter){
  const picker=filter.closest('[data-link-picker]');
  picker.dataset.type=filter.dataset.linkFilter;
  for(const button of picker.querySelectorAll('[data-link-filter]')){
   const selected=button===filter;
   button.classList.toggle('on',selected);
   button.setAttribute('aria-pressed',String(selected));
  }
  filterExchanges(picker);
 }
 const venue=event.target.closest('[data-link-venue]');
 if(venue){
  const picker=venue.closest('[data-link-picker]');
  if(picker.tagName==='DETAILS'&&picker.dataset.current===venue.dataset.linkVenue){closePicker(picker);return;}
  selectedExchange=venue.dataset.linkVenue;
  window.go(venue.dataset.linkType==='DEX'?'link.addr:empty':'link.uid:empty');
 }
 if(!event.target.closest('[data-link-picker]'))document.querySelectorAll('details[data-link-picker][open]').forEach(closePicker);
});
document.addEventListener('toggle',event=>{
 const picker=event.target;
 if(!picker.matches('details[data-link-picker]'))return;
 const search=picker.querySelector('[data-link-search]');
 if(picker.open){search.focus();return;}
 picker.dataset.type='all';search.value='';
 for(const tab of picker.querySelectorAll('[data-link-filter]')){
  const isAll=tab.dataset.linkFilter==='all';
  tab.classList.toggle('on',isAll);tab.setAttribute('aria-pressed',String(isAll));
 }
 filterExchanges(picker);
},true);
document.addEventListener('keydown',event=>{
 if(event.key!=='Escape')return;
 const picker=event.target.closest('details[data-link-picker][open]');
 if(picker){closePicker(picker);picker.querySelector('summary').focus();}
});

R.screen({id:'link.select',group:'link',title:'거래소 선택',route:'/link (웹 꽉 찬 모달 · 앱 바텀시트)',fu:['FU-013'],shell:false,
 states:[
  {id:'normal',label:'진입 — 첫 거래소 WOO X Pro 기본 선택 (G-379)',figma:null,note:'맞는 Figma 프레임 없음(결정 12차 「연동 모달 첫 상태」 — 실서비스 첫 항목 WOO X Pro 기본 선택). PC 28960:127765는 숨김 프레임, 모바일 28969:126953은 선택기 시트(<code>dexlist</code>·<code>all</code>이 그 프레임). V2.2 <code>link/SEL#normal</code> · <code>link/SHEET#normal</code> · <code>link/GRID#normal</code>. 웹 = Figma S3-2 「Link Account modal (live)」 기본 상태(Select a partner · Link Account 비활성). 모바일 = 연동 폼 위 선택 시트(Top Partner · All exchanges (23))'},
  {id:'dexlist',label:'홈 Linked Accounts 푸터 → 공통 선택기 All',figma:{pc:'28960:127381',mo:'28969:126953'}},
  {id:'all',label:'기존 연동 폼의 검색 팝오버 · All',figma:{pc:'28960:127381',mo:'28969:126953'}},
  {id:'uid',label:'UID 입력 화면에서 연 공통 선택기',figma:{pc:'28960:127381',mo:'28969:126953'}},
  {id:'uidFilled',label:'UID 입력 후 연 공통 선택기',figma:{pc:'28960:127381',mo:'28969:126953'}},
  {id:'cex',label:'칩 CEX',figma:{pc:'29192:119719',mo:'28986:126528'},note:'모바일 Figma Filter CEX(Top Partner 유지 · Centralised exchanges (19)). CEX 선택 → <code>link.uid</code>'},
  {id:'dex',label:'칩 DEX (배지 없음)',figma:{pc:'29192:119723',mo:'28986:126557'},note:'모바일 Figma Filter DEX(Top Partner 숨김 · Decentralised exchanges (4))'},
  {id:'one',label:'검색 결과 1건',figma:{mo:'29051:104415'},note:'V2.2 <code>link/SEL#one</code>. 모바일 Figma DEX search one result(«lighter» → 1 exchange found). 검색 시 Top 숨김(REQ-124)'},
  {id:'many',label:'검색 결과 여러 건',figma:{mo:'29051:104229'},note:'V2.2 <code>link/SEL#many</code> · <code>link/GRID#search</code>. 모바일 Figma DEX search multiple results(«a» → 2 exchanges found)'},
  {id:'none',label:'검색 결과 없음 (All 칩)',figma:null,note:'V2.2 <code>link/SEL#none</code>. 모바일 0건 디자인은 DEX 칩 «bit»(<code>dexbit</code>)에만 있음 — 문구는 그 원문'},
  {id:'dexbit',label:'DEX 칩에서 «bit» → 0건',figma:{mo:'29051:104597'},note:'V2.2 <code>link/SEL#dexbit</code> — 검색은 선택된 칩 안에서만(REQ-056). 모바일 Figma DEX search no results(<code>No results found for “bit”</code>)'},
  {id:'region',label:'지역 제한 DEX — 목록에서 제외',figma:null,note:'V2.2 <code>link/SEL#region</code>. G-161 확정: 이유 표시 없음 — 서버가 제외(EX-05). 예시: Aster 제외'},
  {id:'fail',label:'파트너 목록 로드 실패 (캐시 없음)',figma:null,note:'V2.2 <code>link/SEL#fail</code>. G-097 확정: 캐시된 목록 우선, 캐시도 없을 때만 오류 + <code>Retry</code>, <code>Popular partners</code> 숨김. 오류 문구는 Figma API 상태 보드 S5_05 원문'},
  {id:'intro',label:'STG 웹 진입 질문',figma:null,note:'V2.2 <code>link/SEL#intro</code> — 현행 <code>/uidlinking</code> 첫 질문(REQ-712)'},
 ],
 render(st){
  const mo=S.vp==='mo';
  if(st==='intro'){
   const body=`<p class="h6" style="margin:0">${T('Have you registered a trading account with the TetherMax referral code?')}</p><p class="b1 c2" style="margin:0">${T('You must link your account to receive USDT from TetherMax.','테더맥스에서 USDT를 받으려면 거래 계정 연동이 꼭 필요해요.')}</p>`;
   return C.overlay('home.main',linkModal(body,`${C.btn(T('Yes, I have one!'),{full:true,go:'link.select:normal'})}${C.btn(T('No, not yet!'),{v:'outlined',c:'black',full:true,go:'link.select:normal'})}${signUp()}`));
  }
  if(st==='normal')return uidLinkForm('empty');   // 결정 12차: 연동 모달 첫 상태 = 첫 거래소(WOO X Pro) 기본 선택 — 실서비스와 같음
  if(mo){
   const origin={uid:'link.uid:empty',uidFilled:'link.uid:filled'}[st]||'link.addr:empty';
   return C.overlay(origin,moSheet(st==='all'?'normal':st,origin));
  }
  // 선택기를 연 배경 폼 = Figma 표본(Bitget 선택 · Bitget UID 안내, 28960:127381 · 29192:119719). 사이트 모드는 사용자가 고른 거래소 그대로
  if(window.SITEL&&!window.PT_EMBED)return uidLinkForm(st==='uidFilled'?'filled':'empty',st==='all'?'normal':st);
  const keep=selectedExchange;selectedExchange='Bitget';try{return uidLinkForm(st==='uidFilled'?'filled':'empty',st==='all'?'normal':st)}finally{selectedExchange=keep}
 }});

// ---------- 기존 CEX UID 입력 (현행 테더맥스 UID 연동) ----------
// Figma 웹 [MAX-30] Link UID 9105:196091(모달 9105:196055) · 모바일 Link / Bitget UID · existing mobile form 29051:100488
function uidGuide(mo,d){
 if(d!=='Bitget')return `<div class="col g8"><span class="b1 semi">${T('Steps to link UID')}</span><p class="cap" style="margin:0">${T('Copy the UID from your exchange account and paste it above.')}</p></div>`;
 return `<div class="col g8"><span class="b1 semi">${T('Steps to link UID')}</span>
  <p class="cap" style="margin:0">${T('Log in to the Bitget Website. Go to My Profile icon in the top right corner. Tap/Click on the copy icon to copy your UID.')}</p>
  <div style="height:${mo?256:410}px;background:#eaeef4;overflow:hidden"><img src="${A('link-uid-guide-1.png')}" style="width:100%;height:100%;object-fit:cover"></div>
  ${mo?'':`<img src="${A('link-uid-guide-2.png')}" style="width:100%;aspect-ratio:1280/929;object-fit:cover">`}</div>`}

function uidLinkForm(st,openPicker){
 const mo=S.vp==='mo',filled=st==='filled',fmtErr=st==='formatError';
 const d=WEB_CEX.includes(selectedExchange)||cexBy(selectedExchange)?selectedExchange:WEB_CEX[0];   // 첫 상태 = 목록 첫 거래소 기본 선택(WOO X Pro, G-379 · 결정 12차)
 const sel=mo?`<button type="button" class="sel" style="border-color:var(--input-border);padding:16px 12px" data-go="link.select:${filled?'uidFilled':'uid'}">${webMark(d,24)}<span class="b1 grow">${d}</span>${ic('arrow-drop-down')}</button>`:webExchangeField(d,openPicker);
 const field=C.field({label:null,value:filled?'1234567':fmtErr?'12345abc':null,ph:T('Enter your UID'),focus:filled,error:null});
 const reg=signUp(d);
 const next=C.btn(T('Next'),{full:true,size:mo?'lg':'md',disabled:!filled});   // 모바일 42(Figma 29051:100488)
 if(mo)return moForm(T('Link your exchange UID'),`${sel}${field}${uidGuide(true,d)}`,`${next}${reg}`);
 const modal=`<div style="background:var(--paper);border-radius:4px;box-shadow:var(--elev24);width:600px;max-width:100%;height:800px;display:flex;flex-direction:column">
  <div class="row between" style="padding:16px 24px 0"><span class="h6" style="font-weight:500">${T('Link your exchange UID')}</span><button class="icon-btn" data-go="home.main">${ic('close')}</button></div>
  <div class="col" style="gap:16px;padding:16px 24px;overflow:auto;flex:1">${sel}${field}${uidGuide(false,d)}</div>
  <div class="col g8" style="padding:24px">${next}${reg}</div></div>`;
 return C.overlay('home.main',modal,{center:true,clip:900});
}
R.screen({id:'link.uid',group:'link',title:'CEX UID 입력 (기존)',route:'/uidlinking (웹 모달 · 모바일 전체 화면)',fu:['FU-013'],shell:false,
 states:[
  {id:'empty',label:'빈 값 — Next 비활성',figma:{pc:'9105:196091',mo:'29051:100488'},note:'기존 테더맥스 UID 연동(REQ-712). 선택기·시트에서 CEX를 고르면 여기로(REQ-056 CEX = UID 경로). 거래소를 DEX로 바꾸면 입력값을 지우고 지갑 경로로(REQ-057). 기존 화면이라 국문 원문 없음 → 영문'},
  {id:'filled',label:'UID 입력 완료 — Next 활성 (게스트 조회 handoffcex 포함)',figma:{pc:'9287:185462',mo:'9105:188659'},note:'[기존 MAX-30] Link Exchange Flow — 값 입력(포커스 테두리) · Next 활성. 게스트 조회 <code>guest.result:handoffcex</code> → 로그인 후 같은 UID가 채워진 채 여기로(REQ-180 · REQ-107). Next 이후(캡차 → 결과)는 기존 CEX 흐름'},
 ],
 render(st){   // 목록판 표본 = Figma(Bitget 선택 · Bitget UID 안내, 9105:196091 · 29051:100488). 사이트 모드는 고른 거래소
  if((window.SITEL&&!window.PT_EMBED)||selectedExchange)return uidLinkForm(st);
  selectedExchange='Bitget';try{return uidLinkForm(st)}finally{selectedExchange=null}}});

// ---------- FU-015 · FU-016 지갑 주소 입력 · 검증 · 안내 ----------
// 웹: Figma L2 · L3 · Address validation(Empty · Preserve original case · Internal whitespace(=L4) · Partner rejected · Name instead of address · Zero address)
// 모바일: Figma Enter wallet address · Valid address · Invalid address(주소 안 공백)
const IN={ // [값, 오류, Next 활성]
 empty:['',null,false],valid:[ADDR,null,true],paste:['',null,false],kept:[ADDR,null,true],hub:['',null,false],
 e2:['','Enter your wallet address.',false],
 ws:['7V9QmYpN Xszw7qpX2YkA6H3','Remove spaces within the wallet address.',false],
 case:['7V9QmYpNXszw7qpX2YkA6H3dr4fMEcTtRjNzLhPvu4B',null,true],
 rejected:['0x52908400098527886E0F7030069857D2E4169Ee7','We couldn’t verify this wallet address. Copy it again from the exchange.',false],
 e6:['example.eth','Paste the wallet address, not an account name.',false],
 e7:['0x0000000000000000000000000000000000000000','This address can’t be linked.',false],
};
// 주소 검증 오류 국문(G-367) — 05.리포트/문구표_DEX.md
const ADDR_KO={'Enter your wallet address.':'지갑 주소를 입력해 주세요.','Remove spaces within the wallet address.':'지갑 주소 안의 공백을 지워 주세요.','This address is not supported for the selected exchange.':'선택한 거래소에서 지원하지 않는 주소예요.','We couldn’t verify this wallet address. Copy it again from the exchange.':'지갑 주소를 확인하지 못했어요. 거래소에서 다시 복사해 주세요.','Paste the wallet address, not an account name.':'계정 이름이 아닌 지갑 주소를 붙여넣어 주세요.','This address can’t be linked.':'연동할 수 없는 주소예요.'};
R.screen({id:'link.addr',group:'link',title:'지갑 주소 입력',route:'/link (웹 꽉 찬 모달 · 앱 전체 화면)',fu:['FU-015','FU-016'],shell:false,
 states:[
  {id:'empty',label:'빈 값 — 안내 보임, Next 비활성 (L2)',figma:{pc:'28960:127275',mo:'28969:126986'},note:'V2.2 <code>link/ADDR#normal</code> · <code>link/SEL#detail</code>(DEX 상세 진입 = 그 DEX 선택 상태로 바로 주소 입력, 배경 D1 상세) · <code>link/SHEET#screen</code>(모바일 전체 화면 Link Account — Next 항상 닿음)'},
  {id:'valid',label:'유효 주소 — Next 활성 (L3)',figma:{pc:'28960:127279',mo:'28969:126996'},note:'V2.2 <code>link/ADDR#valid</code>. 안내는 유효 주소에서도 유지(REQ-069 · Figma L3)'},
  {id:'e2',label:'빈 값 제출 — Enter your wallet address.',figma:{pc:'28980:132144'},note:'V2.2 <code>link/ADDR#e2</code> · Figma Address validation / Empty'},
  {id:'ws',label:'주소 안 공백 — Remove spaces… (L4)',figma:{pc:'28980:132242',mo:'28969:127006'},note:'Figma Address validation / Internal whitespace · L4 Format error(28960:127283)도 같은 화면 · 모바일 Invalid address · REQ-067'},
  {id:'case',label:'다른 형식 · 대소문자 원문 유지 — 오류 없음',figma:{pc:'28980:132193'},note:'V2.2 <code>link/ADDR#e3</code>(base58) · <code>#e4</code>(0X·길이·문자) · <code>#e5</code>(체크섬)을 대신함 — REQ-065: 공통 0x 접두어·42자·16진수·EIP-55 검사로 거부하지 않고 서버·파트너가 최종 판정. Figma Address input / Preserve original case'},
  {id:'rejected',label:'거래소가 주소 거절 — 입력 유지',figma:{pc:'28980:132291'},note:'Figma Address validation / Partner rejected address · REQ-065·067(파트너 거절 = 입력 유지 + 사유). V2.2 e4·e5 형식 오류는 이 경로로 표시'},
  {id:'e6',label:'ENS·이름 입력',figma:{pc:'28980:132340'},note:'V2.2 <code>link/ADDR#e6</code> · Figma Address validation / Name instead of address'},
  {id:'e7',label:'제로 주소',figma:{pc:'28980:132389'},note:'V2.2 <code>link/ADDR#e7</code> · Figma Address validation / Zero address'},
  {id:'kept',label:'실패 후 주소 유지',figma:null,note:'V2.2 <code>link/ADDR#kept</code>. G-380 확정: 새로고침·실패 후에도 입력 주소 유지'},
  {id:'hub',label:'허브 진입 — 그 거래소 미리 선택',figma:null,note:'V2.2 <code>link/SEL#hub</code>(허브 → ApeX 선택). 선택 DEX는 지갑 경로로 바로 감(REQ-051·056)'},
  ...DEXES.map(d=>({id:d.toLowerCase(),label:`${d} 상세 진입 — 거래소 미리 선택`})),
 ],
 render(st){
  const preset=DEXES.find(d=>d.toLowerCase()===st);
  const d=preset||(st==='hub'?'ApeX':st==='empty'&&DEXES.includes(selectedExchange)?selectedExchange:'Lighter');
  const [val,err,ok]=IN[preset?'empty':st];
  const mo=S.vp==='mo';
  const fld=C.field({label:val?T('Wallet address','지갑 주소'):null,value:val||null,ph:T('Paste your wallet address','지갑 주소를 붙여넣으세요'),error:err?T(err,ADDR_KO[err]):null,focus:mo&&st==='valid',help:T('Paste the wallet address you use on this exchange.','이 거래소에서 쓰는 지갑 주소를 붙여넣으세요.')});
  const extra='';
  const nt=st==='kept'?C.note('실패 다이얼로그를 닫거나 새로고침해도 선택 거래소·입력 주소 유지(REQ-064 · G-380)'):'';
  const hintTxt=T('Paste a valid wallet address to continue.','올바른 지갑 주소를 붙여넣으면 계속할 수 있어요.');
  const paste=preset||st==='empty'||st==='paste'||st==='hub'?`<button class="btn contained primary sm" data-paste style="position:absolute;right:12px;top:${mo?12:16}px">${T('Paste','붙여넣기')}</button>`:'';
  if(mo){
   const sel=`<div class="sel" style="border-color:var(--input-border);padding:16px 12px;cursor:pointer" data-go="link.select:normal">${C.dex(d,24)}<span class="b1 grow">${d}</span>${ic('arrow-drop-down')}</div>`;
   const acts=`${C.btn(T('Next','다음'),{full:true,size:'lg',disabled:!ok,go:ok?'link.captcha:normal':''})}${ok?'':moHint(hintTxt)}${signUp(d)}`;
   return moForm(T('Link Account','거래 계정 연동하기'),`${sel}<div style="position:relative">${fld}${paste}</div>${extra}${nt}${guide(d)}`,acts,st==='hub'?'hub.main':'home.main');
  }
  const body=`${trust()}${dexSel(d)}<div style="position:relative">${fld}${paste}</div>${extra}${nt}${guide(d)}`;
  const hint=preset||st==='empty'||st==='paste'||st==='hub'?`<p class="cap c2 center" style="margin:0">${hintTxt}</p>`:'';
  const actions=`${C.btn(T('Next','다음'),{full:true,disabled:!ok,go:ok?'link.captcha:normal':''})}${hint}${signUp(d)}`;
  const origin=preset?`dex.detail:${preset.toLowerCase()}`:st==='hub'?'hub.main':BG;
  return C.overlay(origin,linkModal(body,actions,{close:preset||st==='hub'?origin:'home.main'}));
 }});

// ---------- G-402 가입 후 복귀 (Signup + Link Wallet) ----------
// Figma 1 Entry(28960:127416, DEX 상세 — Get Started 주 버튼) → 2 Signup(28960:127418, 모달 「DEX / Signup before redirect」) → 3 Return(28960:127422, 상세 — Link Wallet 주 버튼)
R.screen({id:'link.signup',group:'link',title:'가입 후 연동 복귀 (G-402) — 중간 안내 없음',route:'/exchange/{dex} (모달)',fu:['FU-013'],shell:false,
 states:[
  {id:'return',label:'3 Return — 상세로 돌아와 Link Wallet → 미리 선택된 연동 모달',figma:null,note:'근거 프레임 3 Return(28960:127422)은 DEX 상세 페이지(<code>dex.detail:lighter</code> 담당) — 이 상태는 그 다음 화면. Figma 3 Return: 상세 페이지에서 <code>Link Wallet</code>이 주 버튼(파랑)으로, <code>Get Started</code>가 보조로 바뀜 — 상세 화면은 DEX 담당(<code>dex.detail:lighter</code>)이라 버튼 강조는 그쪽 반영 필요. 여기서는 복귀 후 열리는 연동 모달(G-402: 그 DEX 미리 선택)을 보여 줌. 복귀 안내 문구는 문구표'},
 ],
 render(st){
  {
   const body=`${trust()}${dexSel('Lighter')}${C.field({ph:T('Paste your wallet address','지갑 주소를 붙여넣으세요'),help:T('Paste the wallet address you use on this exchange.','이 거래소에서 쓰는 지갑 주소를 붙여넣으세요.')})}<p class="cap c2" style="margin:0">${T('Signed up on Lighter? Paste your Lighter wallet address to link it.','Lighter 가입을 마쳤다면 Lighter 지갑 주소를 붙여넣어 연동해 주세요.')}</p>${guide('Lighter')}`;
   if(S.vp==='mo')return renderInner('link.addr:empty');
   return C.overlay(BG,linkModal(body,`${C.btn(T('Next','다음'),{full:true,disabled:true})}${signUp('Lighter')}`));
  }
 }});

// ---------- FU-017 캡차 ----------
// Figma L5: 주소 모달 위 두 번째 스크림 + 「Live / GEETEST slide puzzle」 278×286 (모달 위쪽 80px) — 퍼즐 이미지는 GEETEST 위젯이 그림
function puzzle(){
 return `<div style="width:278px;background:#fff;border-radius:4px;box-shadow:var(--elev8);padding:10px;display:flex;flex-direction:column;gap:10px">
  <div style="height:160px;border-radius:2px;background:url(${A('link-captcha-1.png')}) center/cover;position:relative;overflow:hidden"><span style="position:absolute;left:198px;top:56px;width:40px;height:48px;border-radius:6px;background:rgba(0,0,0,.35);box-shadow:inset 0 0 0 2px rgba(255,255,255,.7)"></span><span style="position:absolute;left:6px;top:56px;width:40px;height:48px;border-radius:6px;background:linear-gradient(135deg,#a7b8cf,#cdbf9f);box-shadow:0 2px 6px rgba(0,0,0,.4)"></span></div>
  <div style="height:40px;border:1px solid var(--divider);border-radius:20px;background:#f3f6fa;display:flex;align-items:center;position:relative"><span style="width:40px;height:40px;border-radius:20px;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.25);display:inline-flex;align-items:center;justify-content:center;margin-left:-1px">${ic('arrow-forward','ic20')}</span><span class="cap c2" style="flex:1;text-align:center">${T('Slide to complete the puzzle')}</span></div>
  <div style="height:1px;background:var(--divider)"></div><span class="cap c3" style="text-align:right">${T('Powered by GEETEST')}</span></div>`}
function addrModal(extra,nextOn){
 const field=C.field({label:T('Wallet address','지갑 주소'),value:ADDR,help:T('Paste the wallet address you use on this exchange.','이 거래소에서 쓰는 지갑 주소를 붙여넣으세요.')});
 return linkModal(`${trust()}${dexSel('Lighter')}${field}${extra||''}${guide('Lighter')}`,`${C.btn(T('Next','다음'),{full:true,disabled:!nextOn})}${signUp('Lighter')}`)}
R.screen({id:'link.captcha',group:'link',title:'캡차',route:'/link (모달)',fu:['FU-017'],shell:false,
 states:[
  {id:'normal',label:'GEETEST 퍼즐 (L5)',figma:{pc:'28960:127287',mo:'28969:127016'},note:'V2.2 <code>link/CAPTCHA#normal</code>. 퍼즐 배경 = [기존 MAX-792] Captcha 1(13992:429798, 테더맥스 캡차 이미지). 퍼즐은 GEETEST 라이브 위젯(퍼즐 이미지·닫기/새로고침/도움 아이콘은 위젯이 그림 — 에셋 아님)'},
  {id:'success',label:'Verification Success',figma:{pc:'28966:124154',mo:'28969:127073'},note:'V2.2 <code>link/CAPTCHA#success</code> · <code>link/DONE#app</code>. Figma: 웹 <code>Back to Home</code> · 모바일 <code>Close</code>'},
  {id:'retry',label:'퍼즐 실패·만료 — 주소 유지 재시도',figma:null,note:'V2.2 <code>link/CAPTCHA#retry</code>. 연동을 시도하지 않고 같은 거래소·주소 유지(REQ-072). 문구는 Figma API 상태 보드 S1_14 원문'},
 ],
 render(st){
  const mo=S.vp==='mo';
  if(st==='success')return splash('success',T('Verification Success'),T('Verification is complete. We’re checking your referral.'),`${C.btn(T('Back to Home'),{full:true,go:'home.main'})}${help()}`,{close:'home.main'});
  const layer=`<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);display:flex;justify-content:center;align-items:flex-start;padding-top:${mo?213:152}px">${puzzle()}</div>`;
  if(st==='normal'){
   if(mo)return `<div style="position:relative;height:812px;overflow:hidden">${renderInner('link.addr:valid')}${layer}</div>`;
   return C.overlay(BG,`${addrModal('',true)}${layer}`);
  }
  // 퍼즐 실패·만료(retry)만 — 캡차 스크립트 로드 실패 상태는 두지 않음(결정 3차 보류 #1 · G-098)
  const box=`<div class="alert err"><span class="ai">!</span><div class="ab"><b>${T('Verification expired')}</b>${T('Complete a new puzzle to continue.')}<div class="mt8">${C.btn(T('Retry verification'),{v:'outlined',c:'black',size:'sm',go:'link.captcha:normal'})}</div></div></div>`;
  if(mo)return moForm(T('Link Account','거래 계정 연동하기'),`<div class="sel" style="border-color:var(--input-border);padding:16px 12px">${C.dex('Lighter',24)}<span class="b1 grow">Lighter</span>${ic('arrow-drop-down')}</div>${C.field({label:T('Wallet address','지갑 주소'),value:ADDR})}${box}${guide('Lighter')}`,`${C.btn(T('Next','다음'),{full:true,size:'md',disabled:true})}${signUp('Lighter')}`);
  return C.overlay(BG,addrModal(box,false));
 }});

// ---------- FU-014 · FU-023 처리 중 ----------
R.screen({id:'link.proc',group:'link',title:'처리 중 (Processing Your Account)',route:'/link (전체 화면 모달)',fu:['FU-023','FU-014'],shell:false,
 states:[
  {id:'normal',label:'귀속 조회 중 — 최소 1초 (L6)',figma:{pc:'28960:127293',mo:'25963:14034'},note:'V2.2 <code>link/PROC#normal</code> · REQ-091. Severity info. 모바일 = [기존 MAX-30] MAXOP-751 <code>mWeb/LP/SPLASH/INTEGRATION_PROCESSING</code>(같은 스플래시 컴포넌트, 문구는 DEX L6)'},
  {id:'prelink',label:'연동 전 잔액 출금 대기',figma:{pc:'28966:124158',mo:'28969:127087'},note:'V2.2 <code>link/PROC#prelink</code> · REQ-108(처리 중 화면 재사용) · 본문은 Figma 원문(G-426 문구표). Severity info'},
 ],
 render(st){
  const msg=st==='prelink'?T('Your previous cashback of 14.00 USDT is being sent to this account. Linking completes once the transfer is confirmed.','이전에 쌓인 캐시백 14.00 USDT를 이 거래 계정으로 보내고 있어요. 송금이 확인되면 연동이 완료돼요.'):T("Your account is being processed. You'll be notified once linking is complete.");
  return splash('info',T('Processing Your Account'),msg,C.btn(T('Back to Home'),{full:true,go:'home.main'})+help());
 }});

// ---------- FU-023 · FU-024 · FU-014 연동 결과 ----------
const RNOTE='MAXOP-751 원문에서 연동 대상 UID를 Account로 표기';
R.screen({id:'link.result',group:'link',title:'연동 결과',route:'/link (전체 화면 모달)',fu:['FU-023','FU-024','FU-014'],shell:false,
 states:[
  {id:'normal',label:'레퍼럴 아님 — Unable to Link Account (L8)',figma:{pc:'28960:127301',mo:'28969:127125'},note:'FAILED_NOT_FOUND_UID · REQ-088. '+RNOTE+' · Close로 입력 유지(REQ-093)'},
  {id:'inuse',label:'타인 사용 중 — Account Already in Use (L9)',figma:{pc:'28960:127305',mo:'28969:127109'},note:'FAILED_ALREADY_INTEGRATION · REQ-089·723. '+RNOTE+' · Verify Ownership으로 신청 화면 진입'},
  {id:'cooldown',label:'최근 소유권 인증 — Verification Limit Reached (L12)',figma:{pc:'28960:127322',mo:'28969:127132'},note:'FAILED_RECENT_POSSESSION · REQ-724. 마지막 소유권 승인에서 30일 이내인 경우. Close로 입력 유지. 소유권 신청 단계는 O2.'},
  {id:'mine',label:'본인 이미 추가 — You’ve Already Added This Account (L14)',figma:{pc:'28960:127340',mo:'28969:127139'},note:'V2.2 <code>link/RESULT#mine</code> · <code>FAILED_MY_INTEGRATION</code> · REQ-090. '+RNOTE+'(info · Close)'},
  {id:'other',label:'기타 실패 — Unable to Link Account (L13)',figma:{pc:'28960:127331',mo:'28969:127153'},note:'V2.2 <code>link/RESULT#other</code> · REQ-092. '+RNOTE+'(error · Contact Support)'},
  {id:'unavailable',label:'선택 뒤 연동 불가로 바뀐 거래소',figma:{mo:'28969:127153'},note:'선택 후 그 거래소가 연동 불가(오프보딩·지역 제한 등)로 바뀐 예외. G-161: 이유 표시 없음(목록에서는 서버가 제외). Figma 모바일 Linking unavailable — 문구는 L13과 같은 일반 실패(error · Contact Support). 웹 디자인 없음'},
  {id:'limit',label:'한도 초과 — Trading account limit reached (L15)',figma:{pc:'28960:127349',mo:'28969:127118'},note:'V2.2 <code>link/RESULT#limit</code> · <code>INTEGRATION_MAX_COUNT_OVER</code> · REQ-112. Figma: warning · <code>You can link up to 12 trading accounts.</code> · Close. G-091 확정에 따라 본문 <code>You’ve linked the maximum number of accounts ({n}).</code> · CTA <code>Contact Support</code>만(질문 목록). 21 = 예시 숫자'},
  {id:'pending',label:'확인 중 — manual_link_pending (L11)',figma:{pc:'28960:127313',mo:'28969:127080'},note:'V2.2 <code>link/RESULT#pending</code> · REQ-075·098~100. 국문 REQ-100, 영문 G-094 확정 문구 — Figma L11 원문(<code>Checking Your Referral</code> / <code>We’ll notify you once your exchange confirms your referral.</code>)과 다름 → 질문 목록. info. 홈 행은 <code>연동 시도중이에요</code>(홈 담당)'},
  {id:'prelinkFail',label:'연동 전 잔액 출금 실패 = 연동 실패',figma:{pc:'28966:124162',mo:'28969:127094'},note:'V2.2 <code>link/RESULT#prelinkFail</code> · REQ-107(실패 = 연동 실패, 금액은 연동 전 잔액으로 복원, 다시 신청 가능). 문구·버튼 Figma 원문(error · Try again)'},
 ],
 render(st){
  if(st==='cooldown')return splash('warning',T('Verification Limit Reached'),T('This account has been ownership verified recently.'),C.btn(T('Close','닫기'),{full:true,go:'link.addr:kept'})+help(),{close:'link.addr:kept'});
  const close=C.btn(T('Close','닫기'),{full:true,go:'link.addr:kept'});
  const support=C.btn(T('Contact Support'),{full:true,go:'support.main'});
  if(st==='normal')return splash('warning',T('Unable to Link Account'),T('Only accounts registered with the TetherMax referral code can be linked.'),close+help(),{close:'link.addr:kept'});
  if(st==='inuse')return splash('error',T('Account Already in Use'),T('This account is already linked to another account. Please use a different account to continue.'),C.btn(T('Verify Ownership'),{full:true,go:'own.verify:normal'})+help(),{close:'link.addr:kept'});
  if(st==='mine')return splash('info',T("You've Already Added This Account"),T('This account is already linked to your account. No further action is needed.'),close,{close:'link.addr:kept'});
  if(st==='other'||st==='unavailable')return splash('error',T('Unable to Link Account'),T('We were unable to link this account. Please contact our support team for assistance.'),support,{close:'link.addr:kept'});
  if(st==='limit')return splash('warning',T('Trading account limit reached'),T('You’ve linked the maximum number of accounts (21).','연동할 수 있는 거래 계정을 모두 사용했어요 (21개)'),`${support}${help()}`);
  if(st==='pending')return splash('info',T('We’re checking your account link','지갑 연동을 확인하고 있어요'),T('We’ll let you know the result after checking the exchange’s referral records.','거래소의 귀속 내역 확인 후 연동 결과를 알려드릴게요.'),`${C.btn(T('Back to Home'),{full:true,go:'home.main'})}${help()}`);
  return splash('error',T('Unable to Link Account'),T('We couldn’t send your previous cashback, so this account wasn’t linked. The amount is back in this account’s balance. You can try linking again.','이전에 쌓인 캐시백을 보내지 못해 연동하지 못했어요. 금액은 이 거래 계정의 잔액으로 돌아왔어요. 다시 연동을 시도할 수 있어요.'),`${C.btn(T('Try again'),{full:true,go:'link.addr:kept'})}${help()}`,{close:'link.addr:kept'});
 }});

// ---------- FU-023 · FU-025 연동 성공 ----------
// Figma L7(29018:130828 웹 · 29018:132194 모바일): success · 본문 = 안내 / 빈 줄 / `Wallet  {주소}` / 정산 줄 · Back to Home + Need help?
// 제목과 본문은 MAXOP-751 연동 완료 원문. 다음 업데이트는 레코드 업데이트(UTC)를 로컬 시각으로 표시(REQ-095).
const pad2=n=>String(n).padStart(2,'0');
const localNext=(y,mo,d,h)=>{const t=new Date(Date.UTC(y,mo-1,d,h));return `${String(t.getFullYear()).slice(2)}.${pad2(t.getMonth()+1)}.${pad2(t.getDate())} ${pad2(t.getHours())}:${pad2(t.getMinutes())}`};
R.screen({id:'link.done',group:'link',title:'연동 성공',route:'/link (전체 화면 모달)',fu:['FU-023','FU-025'],shell:false,
 states:[
  {id:'weekly',label:'Lighter — Weekly (L7)',figma:{pc:'28960:127297',mo:'28969:127101'},note:'V2.2 <code>link/DONE#weekly</code> · REQ-095(Lighter = Weekly). Figma L7 그대로(웹 <code>Weekly · Next update …</code> · 모바일 <code>Weekly settlement · Monday</code>). Lighter 온보딩 보류(G-428)'},
  {id:'normal',label:'EdgeX · Daily',figma:{pc:'28960:127861'},note:'V2.2 <code>link/DONE#normal</code>. 웹 = DEX S4-5 Account linked(Aster · <code>Daily · Next update …</code>) — 값만 EdgeX. 모바일은 L7 모바일(28969:127101) 구조 재사용(Daily 모바일 프레임 없음). 토스트 <code>Account linked successfully</code> · Back to Home → 홈 새 행(홈 담당). DEX 첫 연동은 3 USDT 쿠폰 안내 없음(REQ-097)'},
  {id:'apex',label:'ApeX — Daily (G-025 롤업 합의 전제)',figma:{pc:'28960:127861'},note:'V2.2 <code>link/DONE#apex</code>. 웹 = S4-5 Daily 스플래시에 ApeX 값. G-099 확정: ApeX는 G-025 롤업 합의 시 <code>Daily</code>'},
  {id:'truncated',label:'180일 넘는 기록 — Cashback shown from',figma:null,note:'V2.2 <code>link/DONE#truncated</code> · REQ-119. 디자인 없음 — L7/S4-5 스플래시에 줄만 추가, 문구는 Figma API 상태 보드 S2_13 <code>Cashback history</code>(29002:126835). 날짜는 서버 값을 로컬 표시, null이면 숨김'},
  {id:'apexIdPending',label:'ApeX AccountID 미반환 — 회원에게는 연동 완료',figma:{pc:'28960:127861'},note:'V2.2 <code>link/DONE#apexIdPending</code>. 화면 = S4-5 Daily 스플래시(일반 성공과 같음). G-177 확정: 칩 없음 — 회원에게는 <code>연동 완료</code>, <code>Account ID pending</code>은 어드민만 → 회원 화면은 일반 성공과 같음'},
 ],
 render(st){
  const mo=S.vp==='mo',wk=st==='weekly';
  const settle=wk?(mo?T('Weekly settlement · Monday'):`Weekly&nbsp;&nbsp;·&nbsp;&nbsp;${T('Next update')} ${localNext(2026,11,30,0)}`)
   :`Daily&nbsp;&nbsp;·&nbsp;&nbsp;${T('Next update')} ${localNext(2026,11,26,0)}${st==='apex'?' '+C.tbd('G-025 롤업 합의 전제','G-025'):''}`;
  const lines=[T('Linked successfully.'),'',`${T('Wallet')}&nbsp;&nbsp;${ADDR}`,settle];
  if(st==='truncated')lines.push(`${T('Cashback shown from')} 2026.05.28`);
  return splash('success',T('Account Link Completed','거래 계정 연동 완료'),lines,`${C.btn(T('Back to Home'),{full:true,go:'home.main'})}${help()}`,{toast:C.toast(T('Account linked successfully'))});
 }});

// ---------- FU-025 · FU-016 Lighter 가이드 (온보딩 보류) ----------
// Figma DEX(revision) D2 Step guide, step 3 (28960:127444) › guide 섹션(I28960:127444;354:49328) — 컴포넌트 DEX / Step rail item · DEX / Step panel
const LG_STEPS=['Create a Web3 wallet','Deposit USDC into your wallet','Join Lighter and link your wallet','Deposit USDC into Lighter','Trade and get rewarded'];
R.screen({id:'link.lguide',group:'link',title:'Lighter 가이드 (보류)',route:'/exchange/lighter (가이드 영역)',fu:['FU-016','FU-025'],shell:{nav:'cashback',accent:true,back:'dex.detail',moTitle:['Lighter guide','Lighter 가이드']},
 states:[{id:'normal',label:'Lighter 가이드 Step 3 — Plus·Premium 안내 (D2)',figma:{pc:'29357:145019'},note:'V2.2 <code>exd/LGUIDE#normal</code> — REQ-347·116·126 · Lighter 온보딩 보류(G-428). DEX(revision) D2 Step guide, step 3의 가이드 섹션(1·2단계 완료 체크 · 3단계 활성 · 스크린샷 · <code>Step 3 of 5</code> · 안내 Alert). 단계 본문은 Figma 초안 문구(Step panel 설명: DRAFT). 모바일 D2(28960:130999)는 미대조 — 레일을 위에 쌓아 표시'}],
 render(){
  const mo=S.vp==='mo';
  const rail=LG_STEPS.map((t,i)=>{const done=i<2,act=i===2;
   return `<div style="display:flex;gap:12px;align-items:center;min-height:56px;padding:12px 16px;border-radius:12px;${act?'background:var(--divider)':''}"><span style="width:32px;height:32px;border-radius:16px;flex:none;display:inline-flex;align-items:center;justify-content:center;background:${done||act?'var(--blue)':'rgba(207,216,220,.2)'};color:${act?'rgba(255,255,255,.87)':'var(--text-primary)'};font-size:14px;font-weight:600">${done?`<img src="${A('link-ic-check.svg')}" style="width:18px;height:18px" alt="">`:i+1}</span><span class="b1" style="flex:1;${act?'font-weight:600;':''}color:${i>2?'var(--text-secondary)':'var(--text-primary)'}">${T(t)}</span></div>`}).join('');
  const support=`<div style="background:rgba(0,123,255,.1);border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:12px;align-items:flex-start"><img src="${A('link-ic-headset.svg')}" style="width:24px;height:24px" alt=""><span class="b2 semi">${T('Stuck partway through?')}</span><span class="b2 c2">${T('Live chat replies in about 2 minutes.')}</span><a style="padding:4px 5px;font-size:13px;font-weight:500;color:var(--blue);text-decoration:underline;cursor:pointer" data-go="support.main">${T('Chat with support')}</a></div>`;
  const panel=`<div class="col" style="flex:1;min-width:0;gap:16px;padding:${mo?0:'0 16px 16px'}">
   <img src="${A('link-lguide-step3.png')}" style="width:100%;height:${mo?190:360}px;object-fit:cover;border-radius:12px" alt="">
   <span style="align-self:flex-start;background:rgba(187,226,255,.2);color:var(--blue);border-radius:100px;padding:3px 9px;font-size:13px;line-height:18px;letter-spacing:.16px">${T('Step 3 of 5')}</span>
   <p class="h5" style="margin:0">${T('Join the DEX through the TetherMax link and paste your wallet address')}</p>
   <p class="b2 c2" style="margin:0">${T('After you sign up, confirm the TetherMax referral code on Lighter’s referral page. Copy your public address from Lighter and paste it on TetherMax.')}</p>
   <div style="display:flex;align-items:center;gap:12px;background:#e5f6fd;color:#014361;border-radius:4px;padding:6px 16px"><img src="${A('link-ic-info20.svg')}" style="width:20px;height:20px;flex:none" alt=""><p class="b2" style="margin:0;padding:8px 0">${T('Cashback applies only to Plus and Premium accounts. Standard accounts pay no fees.')}</p></div></div>`;
  const body=mo?`<div class="col" style="gap:4px">${rail}</div>${panel}${support}`
   :`<div style="display:flex;gap:32px;align-items:stretch"><div class="col" style="width:320px;flex:none;gap:4px">${rail}<span style="flex:1"></span>${support}</div>${panel}</div>`;
  return `<div style="padding:20px ${mo?16:0}px 48px"><div style="background:#fff;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.04);padding:24px;width:${mo?'auto':'1056px'};max-width:100%;margin:0 auto;display:flex;flex-direction:column;gap:24px">
   <p style="margin:0;font-size:24px;line-height:1.334;font-weight:700">${T('Step by step guide on starting your trading journey on Lighter')}</p>${body}</div>
   <div style="width:${mo?'auto':'1056px'};max-width:100%;margin:8px auto 0">${C.note('필수 서술 4개(REQ-347): ① Plus·Premium은 Lighter 레퍼럴 가입 중 선택(또는 Portfolio 페이지에서 전환) ② 레퍼럴 코드는 Lighter 화면 안에서 1회 영구 바인딩 ③ 인티그레이터 승인 불필요 ④ 테더맥스는 서명을 요구하지 않음 — Figma 3단계 본문·안내에는 ②·Plus/Premium만 있음. 나머지는 백오피스 가이드 문구(REQ-126, 원본 위치 미정 G-370). Standard 계정도 연동 허용 — 경고·차단·홈 칩 없음(REQ-116). 온보딩 보류(G-428)')}</div></div>`;
 }});
