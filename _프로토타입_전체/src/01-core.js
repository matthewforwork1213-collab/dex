// TetherMax 전체 프로토타입 — 코어 (레지스트리 · 라우터 · 셸 · 공통 컴포넌트)
// 화면 모듈은 R.screen({...})으로 등록한다. 규칙은 README.md 참고.
const FIGMA_FILE='hsa3bSV9QmFTe2jsf6tzTm';
const figmaUrl=id=>`https://www.figma.com/design/${FIGMA_FILE}/UI-UX-Design?node-id=${String(id).replace(':','-')}`;
const S={lang:'en',vp:'pc',auth:'s4',design:false,screen:null,state:null};
try{Object.assign(S,JSON.parse(localStorage.getItem('tm-full-proto')||'{}'))}catch(e){}
const save=()=>{try{localStorage.setItem('tm-full-proto',JSON.stringify({lang:S.lang,vp:S.vp,auth:S.auth,design:S.design}))}catch(e){}};
const T=(en,ko)=>S.lang==='ko'&&ko!=null?ko:en;
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const A=n=>(window.ASSETS&&ASSETS[n])||('assets/'+n);
const ic=(n,cls='ic')=>`<img class="${cls}" src="${A('ic-'+n+'.svg')}" alt="">`;

// ---------- 레지스트리 ----------
const R={screens:[],byId:{},groups:[],
 group(id,label,order){if(!this.groups.find(g=>g.id===id))this.groups.push({id,label,order:order??this.groups.length*10})},
 screen(def){
  if(this.byId[def.id])throw Error('중복 화면 id '+def.id);
  def.states=(def.states||[{id:'normal',label:'기본'}]).map(s=>({figma:null,...s}));
  def.fu=[].concat(def.fu||[]);
  this.screens.push(def);this.byId[def.id]=def;return def}};
window.R=R;

// ---------- 공통 컴포넌트 ----------
const C={
 btn(label,o={}){const v=o.v||'contained',c=o.c||(v==='contained'?'primary':'black'),sz=o.size||'lg';
  const at=o.go?` data-go="${esc(o.go)}"`:'';const dis=o.disabled?' disabled':'';
  return `<button class="btn ${v} ${c} ${sz}${o.full?' full':''}${o.cls?' '+o.cls:''}"${at}${dis}${o.title?` title="${esc(o.title)}"`:''}>${o.icon?ic(o.icon,'ic20'):''}${label}${o.iconEnd?ic(o.iconEnd,'ic20'):''}</button>`},
 field(o={}){const st=o.error?' err':o.ok?' ok':o.focus?' focus':o.disabled?' dis':'';
  return `<div class="tf${st}${o.sm?' sm':''}">${o.label?`<span class="lbl">${o.label}</span>`:''}<div class="in">${o.start||''}<input ${o.value!=null?`value="${esc(o.value)}"`:''} placeholder="${esc(o.ph||'')}" ${o.disabled?'disabled':''}>${o.end||''}</div>${o.help||o.error?`<div class="help">${typeof o.error==='string'?o.error:o.help}</div>`:''}</div>`},
 dex(name,size=32){const f={Lighter:'dex-lighter.png',ApeX:'dex-apex.png',EdgeX:'dex-edgex.png',Aster:'dex-aster.png'}[name];
  return f?`<img class="dexmark" src="${A(f)}" style="width:${size}px;height:${size}px" alt="${name}">`:`<span class="dexmark" style="width:${size}px;height:${size}px;display:inline-flex;align-items:center;justify-content:center;font-size:${Math.round(size*.38)}px;font-weight:700;background:#eef1f6;color:#333">${esc(name[0])}</span>`},
 chip(label,on,o={}){return `<span class="chip${on?' on':''}${o.sm?' sm':''}"${o.go?` data-go="${esc(o.go)}"`:''}>${label}</span>`},
 badge(label,tone=''){return `<span class="badge ${tone}">${label}</span>`},
 alert(tone,title,body){const i={info:'i',warn:'!',err:'!',ok:'✓'}[tone];return `<div class="alert ${tone}"><span class="ai">${i}</span><div class="ab">${title?`<b>${title}</b>`:''}${body||''}</div></div>`},
 modal(title,body,actions,o={}){return `<div class="modal${o.full?' full':''}" style="${o.w?`width:${o.w}px`:''}">${S.vp==='mo'&&!o.full?'<div class="sheet-grab"></div>':''}<div class="mh"><span class="t">${title}</span><button class="icon-btn" data-go="${esc(o.close||'')}">${ic('close')}</button></div><div class="mb">${body}</div>${actions?`<div class="ma">${actions}</div>`:''}</div>`},
 dialog(title,body,actions){return `<div class="dialog">${title?`<div class="dt">${title}</div>`:''}<div class="dc">${body}</div>${actions?`<div class="da">${actions}</div>`:''}</div>`},
 // 배경 화면 위에 오버레이(모달·다이얼로그·시트)를 겹친다. bg = 'screenId' 또는 'screenId:state'
 // o.clip: 높이(px)를 고정해 배경을 자른다(모바일 바텀시트가 첫 화면 안에 보이게). 모바일 기본 812
 overlay(bg,inner,o={}){const clip=o.clip??(S.vp==='mo'?812:null);return `<div style="position:relative;${clip?`height:${clip}px;overflow:hidden`:`min-height:900px`}">${renderInner(bg,true)}<div class="scrim${o.center?' center':''}"${clip?` style="bottom:auto;height:${clip}px"`:''}>${inner}</div></div>`},
 toast(msg){return `<div class="toast">${msg}</div>`},
 skel(w='100%',h=14){return `<div class="skel" style="width:${w};height:${h}px"></div>`},
 // 개발 보기 전용 주석: 디자인 보기에서 숨는다. 사용자에게 보이는 문구를 여기에 넣지 않는다.
 note(html){return `<div class="note">${html}</div>`},
 tbd(text,g){return `<span class="tbd">[${text}${g?` — 미정 ${g}`:''}]</span>`},
 addr(full,short){return short?`<span class="addr">${full.slice(0,6)}…${full.slice(-4)}</span>`:`<span class="addr">${full}</span>`},
 usdt(n){return (Math.floor(n*100)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' USDT'},
 kv(k,v){return `<div class="kv"><span class="k">${k}</span><span class="v">${v}</span></div>`},
};
window.C=C;

// ---------- 셸 (실제 디자인 — 근거 노드는 ref/대응_common.md 1장) ----------
// 웹 GNB 28967:127332(DEX / Web / Navigation) · 비로그인 우측 19604:32577(webPrelogin) · 드롭다운 19604:32652~32678(atom3 · atom2)
// 드롭다운 — Cashback: 결정 D4(Cashback Hub · Cashback Calculator, 단독 Calculator 메뉴 없음) / Rewards Hub · Discover: 기존 GNB 드롭다운 항목 그대로
const NAV={
 cashback:{en:'Cashback',ko:'캐시백',items:[['hub.main','Cashback Hub','Cashback Hub'],['calc.p1','Cashback Calculator','Cashback Calculator']]},
 rewards:{en:'Rewards Hub',ko:'리워드 허브',items:[['events.list','Exchange Events','거래소 이벤트'],['benefits.list','Benefits','혜택'],['tp.main','Points','포인트']]},
 discover:{en:'Discover',ko:'둘러보기',items:[['quiz.list','Beginner’s Guide','초보자 가이드'],['about.intro','About TetherMax','테더맥스 소개']]},
};
const shIc=(f,cls='ic')=>`<img class="${cls}" src="${A(f)}" alt="">`;
// gnb(active, {open:'cashback'|'rewards'|'discover'}) — open이면 그 드롭다운을 펼친 상태로 그린다(hover 상태 화면용). 실제 hover에서도 펼쳐진다.
function gnb(active,o={}){
 const authed=S.auth!=='guest';
 const nav=Object.entries(NAV).map(([k,n])=>`<div class="ni${o.open===k?' open':''}"><a class="${active===k||o.open===k?'on':''}" data-nav-toggle role="button" aria-haspopup="true">${T(n.en,n.ko)}${ic('arrow-drop-down')}</a><div class="gnb-dd">${n.items.map(([go,en,ko])=>`<a data-go="${go}">${T(en,ko)}</a>`).join('')}</div></div>`).join('');
 const right=authed?`<button class="icon-btn" data-go="${o.bellGo||'cmn.header:unread'}" title="Notifications">${shIc('cmn-ic-bell.svg')}</button><button class="icon-btn" data-go="my.main" title="My">${shIc('cmn-ic-account.svg')}</button>`
  :`${C.btn(T('Login','로그인'),{v:'outlined',go:'auth.login'})}${C.btn(T('Sign Up','회원가입'),{go:'auth.signup'})}`;
 return `<header class="gnb"><div class="row g24"><img src="${A('logo.svg')}" style="width:142px;height:16px;cursor:pointer" data-go="${authed?'home.main':'landing.main'}" alt="TetherMax"><nav class="nav">${nav}</nav></div><div class="right">${right}<button class="icon-btn">${ic('light-mode')}</button><button class="icon-btn" data-lang>${ic('language')}</button></div></header>`}
// 푸터 — PC FooterA 28967:127334 · 모바일 Footer/mWeb 29062:118042 · 게스트 모바일 Company 3행 = Claim Cashback(29072:1797)
function footer(){
 const mob=S.vp==='mo',guest=S.auth==='guest';
 const company=[['about.intro','About TetherMax'],['notice.list','Notices'],guest&&mob?['guest.search:search','Claim Cashback']:['partner.apply','Affiliate Partner Inquiry']];
 const legal=[['terms.privacy','Privacy Policy'],['terms.use','Terms of Service']];
 const sec=(h,items)=>`<div class="fsec"><b>${h}</b><div class="flinks">${items.map(([go,t])=>`<a data-go="${go}">${t}</a>`).join('')}</div></div>`;
 const btns=`<div class="fbtns"><button class="btn contained primary md fchat">${shIc('cmn-ic-headset.svg','ic20')}Live Chat</button><button class="btn text black md fmail">support@${mob?'tethermax':'TetherMax'}.io${shIc('cmn-ic-copy.svg','ic16')}</button></div>`;
 const sns=`<div class="fsns">${[1,2,3].map(i=>`<img src="${A('cmn-fa-sns-'+i+'.svg')}" style="width:32px;height:32px" alt="">`).join('')}<span style="width:31px;height:32px;display:flex;align-items:center;justify-content:center"><img src="${A('cmn-fa-sns-4.svg')}" style="width:23.4px;height:24.3px" alt=""></span><img src="${A('cmn-fa-sns-5.svg')}" style="width:32px;height:28px" alt=""></div>`;
 const copy=`<p class="fcopy">© 2026 TetherMax. All rights reserved.</p>`;
 if(mob)return `<footer class="ftm"><img src="${A('logo.svg')}" style="width:142px;height:16px" alt="TetherMax">${btns}${sec('Company',company)}${sec('Legal',legal)}<div class="fdiv"><i></i></div>${sns}${copy}</footer>`;
 return `<footer class="ftA"><div class="fin"><div class="ftop"><div class="fl"><img src="${A('logo.svg')}" style="width:142px;height:16px" alt="TetherMax">${btns}</div><div class="fr">${sec('Company',company)}${sec('Legal',legal)}</div></div><div class="fdiv"><i></i></div>${sns}${copy}</div></footer>`}
// 모바일 웹 상단 — 비로그인 top nav 29058:108394(로고 + 햄버거) · 로그인 29102:120647(로고 + 계정 + 햄버거, 회색 원 IconButton)
// title/back이 있으면 그 아래 제목 행 29102:120517(← + h6)을 붙인다 — 기존 mWeb 하위 화면 구조
function moTop(title,back){
 const authed=S.auth!=='guest';
 const right=authed?`<div class="row" style="gap:6px"><button class="icon-btn mt-ib" data-go="my.main">${shIc('cmn-ic-account-f.svg')}</button><button class="icon-btn mt-ib" data-go="cmn.drawer:member">${shIc('cmn-ic-menu-f.svg')}</button></div>`
  :`<button class="icon-btn" data-go="cmn.drawer:normal">${shIc('cmn-ic-menu.svg')}</button>`;
 const bar=`<div class="mo-top"><img src="${A('logo.svg')}" style="width:142px;height:16px;cursor:pointer" data-go="${authed?'home.main':'landing.main'}" alt="TetherMax">${right}</div>`;
 const tt=title?`<div class="mo-title">${back?`<button class="icon-btn" data-go="${back}">${shIc('cmn-ic-back.svg')}</button>`:''}<span>${title}</span></div>`:'';
 return bar+tt}
// 앱 하단 탭 — <BottomNavigation> 8582:155585 (Home · Events · Benefits · Exchanges · Point). 앱(mAPP) 전용
function moNav(active,o={}){if(!o.app)return '';
 const it=[['home','home.main','Home','홈','cmn-tab-home.svg'],['events','events.list','Events','이벤트','cmn-tab-event.svg'],['benefits','benefits.list','Benefits','혜택','cmn-tab-benefit.svg'],['exchange','cex.list','Exchanges','거래소','cmn-tab-exchange.svg'],['point','tp.main','Point','포인트','']];
 const icon=(k,f)=>k==='point'?`<span class="tp"><img src="${A('cmn-tab-point-b.svg')}" alt=""></span>`:`<img src="${A(f)}" alt="">`;
 return `<nav class="mo-nav">${it.map(([k,go,en,ko,f])=>`<a class="${active===k?'on':''}${k==='home'?' home':''}" data-go="${go}">${icon(k,f)}<span>${T(en,ko)}</span></a>`).join('')}</nav>`}

// ---------- 렌더 ----------
function parseKey(k){const [id,st]=String(k).split(':');return {id,st}}
function renderInner(key,asBg){
 const {id,st}=parseKey(key);const sc=R.byId[id];
 if(!sc)return asBg?`${S.vp==='pc'?gnb():moTop()}<div class="page accent" style="min-height:${S.vp==='mo'?756:836}px"></div>`:`<div class="empty">없는 화면: ${esc(id)}</div>`;
 const state=sc.states.find(s=>s.id===st)||sc.states[0];
 let body;try{body=sc.render(state.id,{state,screen:sc,asBg})}catch(e){body=`<pre style="color:#b00;padding:16px">${esc(e.stack||e)}</pre>`}
 if(sc.shell===false)return body;
 const sh=typeof sc.shell==='object'?sc.shell:{};
 if(S.vp==='mo')return `${sh.noTop?'':moTop(sh.moTitle?T(...sh.moTitle):'',sh.back)}<div class="page${sh.accent?' accent':''}">${body}</div>${sh.noNav?'':moNav(sh.moNav,{app:sh.app})}${sh.noFooter?'':footer()}`;
 return `${gnb(sh.nav)}<div class="page${sh.accent?' accent':''}">${body}</div>${sh.noFooter?'':footer()}`}
window.renderInner=renderInner;

// ---------- 도구 UI ----------
function designBadge(sc,state){
 const f=state.figma;const vpKey=S.vp;
 const node=f&&(typeof f==='string'?f:(f[vpKey]||null));
 const other=f&&typeof f==='object'?Object.entries(f).filter(([k,v])=>k!==vpKey&&v):[];
 if(node)return `<a class="pt-b ok" href="${figmaUrl(node)}" target="_blank">● 디자인 있음 · ${node}</a>`;
 if(other.length)return `<span class="pt-b mid">◐ ${vpKey==='pc'?'PC':'모바일'} 디자인 없음</span>`+other.map(([k,v])=>`<a class="pt-b ok" href="${figmaUrl(v)}" target="_blank">${k==='pc'?'PC':'모바일'} ${v}</a>`).join('');
 return `<span class="pt-b no">○ 디자인 없음 — 기존 프로토타입 내용</span>`}
function coverage(){let a=0,b=0;for(const sc of R.screens.filter(x=>!x.doc))for(const s of sc.states){b++;if(s.figma)a++}return {a,b}}
function sidebar(){
 const gs=[...R.groups].sort((x,y)=>x.order-y.order);
 return gs.map(g=>{const list=R.screens.filter(s=>s.group===g.id);if(!list.length)return '';
  return `<details class="pt-g" ${list.some(s=>s.id===S.screen)?'open':''}><summary>${g.label} <span>${list.length}</span></summary>${list.map(s=>{const n=s.states.length,d=s.states.filter(x=>x.figma).length;
   return `<a class="pt-s ${s.id===S.screen?'on':''}" data-go="${s.id}"><span>${s.title}</span><em class="${d===n?'ok':d?'mid':'no'}">${d}/${n}</em></a>`}).join('')}</details>`}).join('')}
function render(){
 const sc=R.byId[S.screen]||R.screens[0];S.screen=sc.id;
 const state=sc.states.find(s=>s.id===S.state)||sc.states[0];S.state=state.id;
 document.body.classList.toggle('design',S.design);
 const cv=coverage();
 document.getElementById('pt-side').innerHTML=`<div class="pt-brand">TetherMax 전체 프로토타입<small>디자인 반영 ${cv.a}/${cv.b} 상태</small></div><input class="pt-q" placeholder="화면 검색" oninput="ptFilter(this.value)">${sidebar()}`;
 const fu=sc.fu.length?`<span class="pt-fu">${sc.fu.join(' · ')}</span>`:'';
 document.getElementById('pt-bar').innerHTML=`<div class="pt-l"><b>${sc.title}</b>${sc.route?`<code>${sc.route}</code>`:''}${fu}</div>
 <div class="pt-r"><select id="pt-state">${sc.states.map(s=>`<option value="${s.id}" ${s.id===state.id?'selected':''}>${s.figma?'●':'○'} ${s.label}</option>`).join('')}</select>
 <span class="pt-seg">${[['pc','PC'],['mo','모바일']].map(([k,l])=>`<span data-vp="${k}" class="${S.vp===k?'on':''}">${l}</span>`).join('')}</span>
 <span class="pt-seg">${[['en','EN'],['ko','KO']].map(([k,l])=>`<span data-lg="${k}" class="${S.lang===k?'on':''}">${l}</span>`).join('')}</span>
 <span class="pt-seg">${[['guest','게스트'],['s3','회원·연동0'],['s4','회원·연동']].map(([k,l])=>`<span data-au="${k}" class="${S.auth===k?'on':''}">${l}</span>`).join('')}</span>
 <label class="pt-ck"><input type="checkbox" id="pt-design" ${S.design?'checked':''}> 디자인 보기(주석 숨김)</label></div>
 <div class="pt-d">${designBadge(sc,state)}${state.note?`<span class="pt-n">${state.note}</span>`:''}</div>`;
 const fr=document.getElementById('pt-frame');fr.className='pt-frame vp-'+S.vp;
 fr.innerHTML=renderInner(sc.id+':'+state.id);
 const h=`#${sc.id}/${state.id}`;if(location.hash!==h)history.replaceState(null,'',h);
 document.getElementById('pt-state').onchange=e=>{S.state=e.target.value;render()};
 document.getElementById('pt-design').onchange=e=>{S.design=e.target.checked;save();render()};
 document.querySelectorAll('[data-vp]').forEach(x=>x.onclick=()=>{S.vp=x.dataset.vp;save();render()});
 document.querySelectorAll('[data-lg]').forEach(x=>x.onclick=()=>{S.lang=x.dataset.lg;save();render()});
 document.querySelectorAll('[data-au]').forEach(x=>x.onclick=()=>{S.auth=x.dataset.au;save();render()});
 const on=document.querySelector('.pt-s.on');if(on)on.scrollIntoView({block:'nearest'});
}
window.ptFilter=q=>{q=q.trim().toLowerCase();document.querySelectorAll('.pt-s').forEach(a=>{a.style.display=!q||a.textContent.toLowerCase().includes(q)?'':'none'});document.querySelectorAll('.pt-g').forEach(d=>{if(q)d.open=true})};
function go(key){if(!key)return;const [id,st]=key.split(':');if(!R.byId[id]){alert('아직 없는 화면입니다: '+id);return}S.screen=id;S.state=st||null;render();document.getElementById('pt-frame').scrollTop=0;window.scrollTo(0,0)}
window.go=go;
// GNB 큰 메뉴: 클릭하면 이동하지 않고 아래로 펼침(펼친 채 유지) · 다시 클릭·바깥 클릭·Esc로 닫힘 — 실사이트와 같음
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('[data-nav-toggle]');
 if(t){e.preventDefault();e.stopPropagation();const ni=t.parentNode;document.querySelectorAll('.gnb .nav .ni.open').forEach(n=>{if(n!==ni)n.classList.remove('open')});ni.classList.toggle('open');return}
 if(!(e.target.closest&&e.target.closest('.gnb-dd')))document.querySelectorAll('.gnb .nav .ni.open').forEach(n=>n.classList.remove('open'))},true);
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('.gnb .nav .ni.open').forEach(n=>n.classList.remove('open'))});
document.addEventListener('click',e=>{
 const g=e.target.closest('[data-go]');if(g&&g.dataset.go!==undefined){e.preventDefault();if(g.dataset.go)go(g.dataset.go);else if(S.screen){const sc=R.byId[S.screen];if(sc.closeTo)go(sc.closeTo)}return}
 if(e.target.closest('[data-lang]')){S.lang=S.lang==='en'?'ko':'en';save();render()}});
window.addEventListener('hashchange',()=>{const m=location.hash.slice(1).split('/');if(m[0]&&R.byId[m[0]]&&(m[0]!==S.screen||m[1]!==S.state)){S.screen=m[0];S.state=m[1]||null;render()}});
window.PT_START=()=>{const m=location.hash.slice(1).split('/');if(m[0]&&R.byId[m[0]]){S.screen=m[0];S.state=m[1]||null}render()};
