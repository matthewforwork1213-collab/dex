// 9. 계산기 (/payback) — FU-081 · FU-082 (V2.2 pbk/P1 ~ P5)
// 기준: 실서비스 계산기 화면(05.리포트/실사이트_계산기_img/calc_01~06.png)과 라이브 https://tethermax.io/en/payback 조작 기록(2026-11-27) — 결정 기록 「계산기(/payback) 프로토타입」.
//       흐름 = 소개 → 거래소 선택 → 거래 프로필 → 로딩 → What You're Missing Out On → Summary. 문구는 실화면 그대로.
// DEX 추가분은 정책 B-19(PB 절): 거래소 선택에 DEX 4곳(`{rate}% Cashback`), DEX 결과는 `Did you know?` 숨김, DEX 각주, Schedule `Daily`(ApeX `Hourly` 금지).
// 사이트 모드(dex/app.html)는 window.SITEC로 입력값을 넘겨 같은 화면을 다시 그린다.

const CL_FILL={p1:.2,p2:.4,p3:.6,p4:.8,p5:1};   // 라이브 진행 바: 단계마다 20%씩, 로딩 중에는 바 없음
// 월 거래 횟수(라이브 실측: 잔고 1,000 · 10x · Taker 100%에서 역산) — Rarely · Sometimes · Regularly · Very Active · All Day
const CL_TRADES=[25.2,63,126,315,840];
const CL_FREQ=[['Rarely','Barely once a day'],['Sometimes','1–2 trades a day'],['Regularly','2–5 trades a day'],['Very Active','5–10 trades a day'],['All Day','10+ trades a day']];
// CEX — 라이브 타일 순서·Total Savings · 결과 Cashback Rate · Taker/Maker 수수료(%)(실측 역산)
const CL_CEX=[
 ['bitget','Bitget',77,54,.04,.02,'calc-bitget.png','#00efff'],['bybit','Bybit',52,30,.044,.02,'calc-bybit.png','#131827'],['toobit','Toobit',65,65,.06,.02,'calc-flipster.png','#0d1113'],
 ['binance','Binance',20,20,.05,.02,'calc-binance.png','#0c1011'],['okx','OKX',55,45,.05,.02,'calc-okx.png','#000000'],['woox','WOO X Pro',93,90,.042,.02,'calc-wooxpro.png','#000000'],
 ['mexc','MEXC',50,50,.02,0,'calc-mexc.png','#202324'],['gate','Gate',75,75,.05,.02,'calc-gate.png','#0053d7'],['flipster','Flipster',70,70,.06,.02,'calc-toobit.svg','#1e90ff'],
 ['deepcoin','DeepCoin',75,50,.04,.02,'calc-deepcoin.png','#141414'],['bingx','BingX',60,60,.05,.02,'calc-bingx.png','#0645f5'],['lbank','LBank',71,65,.05,.02,'calc-lbank.svg','#000000'],
 ['zoomex','Zoomex',50,50,.06,.02,'calc-zoomex.png','#121d28'],['bitunix','Bitunix',75,75,.06,.02,'calc-bitunix.svg','#000000'],['biofin','BloFin',70,70,.06,.02,'calc-biofin.png','#000000'],
 ['htx','HTX',54,54,.06,.02,'calc-htx.svg','#0d1a2b'],
].map(([id,name,savings,rate,taker,maker,logo,color])=>({id,name,savings,rate,taker,maker,logo,color,type:'CEX'}));
// DEX — 정책 PB-3 예시 요율(G-003 ⏳)과 DEX 상세 레코드 표본의 할인 후 수수료(80-dex.js DX와 같은 값)
const CL_DEX=[['lighter','Lighter',20,.028,.004,'#000000'],['apex','ApeX',30,.05,.02,'#211a0a'],['edgex','EdgeX',30,.04,.015,'#101916'],['aster','Aster',20,.035,0,'#251a10']]
 .map(([id,name,rate,taker,maker,color])=>({id,name,rate,taker,maker,color,type:'DEX'}));
const clBy=id=>[...CL_CEX,...CL_DEX].find(p=>p.id===id);
const fl=n=>Math.floor(n*100+1e-6)/100;                       // 2자리 절삭(프로젝트 규칙)
const num=n=>fl(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const mo=()=>S.vp==='mo';
// UTC 시각 → 사용자 로컬 표시(타임존 라벨 없음)
const localHM=h=>{const d=new Date(Date.UTC(2026,0,5,h,0));return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};
// 입력값: 사이트 모드는 window.SITEC, 상태 화면은 표본(라이브 기본값 — 10x · 1,000 USDT · Taker 100%)
const CL_DEF={pid:null,lev:10,bal:1000,ratio:100,freq:null,how:false};
const cv=o=>Object.assign({},CL_DEF,o||{},window.SITEC||{});
// 월 거래 수수료 = 잔고 × 레버리지 × 월 거래 횟수 × (Taker% × Taker 수수료 + Maker% × Maker 수수료)
function clCalc(v){
 const p=clBy(v.pid);if(!p)return {fees:0,cb:0,p:null};
 const fee=(v.ratio/100)*p.taker+(1-v.ratio/100)*p.maker;
 const fees=v.bal*v.lev*(v.freq==null?0:CL_TRADES[v.freq])*fee/100;
 return {p,fees:fl(fees),cb:fl(fl(fees)*p.rate/100)};
}
const ratioText=r=>r>=100?'100% Taker':r<=0?'100% Maker':`${100-r}% Maker / ${r}% Taker`;
const balText=b=>num(b)+' USDT';

const SHELL={nav:'calc',accent:true,noFooter:true,noNav:true,moTitle:['Calculator','계산기']};
function bar(k){return k==='p4c'?'':`<div data-calc-bar style="padding:0 ${mo()?0:24}px"><div style="height:8px;background:#eaeaed;overflow:hidden"><div data-calc-gage style="height:8px;width:${CL_FILL[k]*100}%;background:#2453f0;transition:width .3s ease-in-out"></div></div></div>`}
// 페이지 골격: 진행 바 + 본문(가운데 정렬 컨테이너) + 하단 버튼 줄(선택)
function page(k,body,o={}){
 const w=o.w||744;
 const foot=o.foot?`<div style="padding:${mo()?'12px 16px 24px':'16px 24px 40px'};display:flex;justify-content:space-between;gap:8px;max-width:${mo()?'none':'800px'};margin:0 auto;width:100%;box-sizing:border-box">${o.foot}</div>`:'';
 return `<div data-calc-page="${k}" style="display:flex;flex-direction:column;min-height:${mo()?756:836}px">${bar(k)}
  <div style="flex:1;padding:${mo()?'24px 16px 32px':'40px 24px 48px'}"><div style="max-width:${w}px;margin:0 auto" class="col g24">${body}</div></div>${foot}</div>${o.note?C.note(o.note):''}`}
const backBtn=go=>`<button class="btn contained lg" data-calc-back style="background:#f2f2f5;color:var(--text-primary);width:${mo()?'50%':'200px'}" data-go="${go}">${T('Back','뒤로')}</button>`;
const nextBtn=(label,go,dis,attr='')=>`<button class="btn contained primary lg" ${attr} style="width:${mo()?'50%':'200px'}"${dis?' disabled':''} data-go="${go}">${label}</button>`;
const title=(t)=>`<h1 style="margin:0;text-align:center;font-size:${mo()?20:24}px;line-height:1.334;font-weight:700">${t}</h1>`;
// 정보 아이콘 — hover 시 실서비스 툴팁 문구(data-tip)
const tipIc=tip=>`<span data-tip="${esc(tip)}" tabindex="0" style="width:18px;height:18px;border-radius:50%;border:1.5px solid var(--action-active);color:var(--action-active);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none;cursor:default">i</span>`;
// Did you know 카드 (Figma aiReasoning/didyouknow: 연파랑 그라데이션 · 테두리 #c7d6ff · 제목 #7f9fff)
const dyk=(html,w)=>`<div style="border:1px solid #c7d6ff;border-radius:8px;padding:16px;box-shadow:1px 1px 15px rgba(28,28,30,.04);background:linear-gradient(160deg,rgba(199,214,255,.08),rgba(0,49,198,.08) 230%);${w?`width:${w}px;max-width:100%;margin:0 auto`:''}" class="col g12"><div class="row g8"><img src="${A('calc-ic-tips.svg')}" style="width:16px;height:16px" alt=""><span class="b2 semi" style="color:#7f9fff">Did you know?</span></div><div class="cap" style="line-height:1.4;letter-spacing:.2px">${html}</div></div>`;
// 실서비스 집계값(측정일 표시값) — Landing·결과 카드
const CL_USERS='95,000',CL_UPTO='284';

// 거래소 타일: 브랜드 배경 + 로고 + 이름 + CEX `{n}% Total Savings` / DEX `{rate}% Cashback`. 선택 = 파란 테두리
function tile(p,on){
 const size=p.logo==='calc-toobit.svg'?(mo()?16:21):(mo()?32:40);   // 파일 이름이 실제 로고와 엇갈려 있음(calc-toobit.svg = Flipster F, calc-flipster.png = Toobit)
 const logo=p.type==='DEX'?C.dex(p.name,size):`<img src="${A(p.logo)}" style="width:${size}px;height:${size}px;object-fit:contain${p.logo==='calc-flipster.png'?';border-radius:50%':''}" alt="">`;
 const rate=p.type==='CEX'?T(`${p.savings}% Total Savings`,`총 절감률 ${p.savings}%`):T(`${p.rate}% Cashback`,`최종 캐시백률 ${p.rate}%`);
 return `<button type="button" aria-pressed="${on}" data-calc-platform="${p.id}" style="font:inherit;color:inherit;min-width:0;text-align:left;border-radius:8px;padding:8px;cursor:pointer;border:1px solid ${on?'#0031c6':'transparent'};background:${on?'rgba(187,226,255,.2)':'transparent'};transition:border-color .2s">
  <span style="height:${mo()?42:60}px;border-radius:4px;background:${p.color};display:flex;align-items:center;justify-content:center">${logo}</span>
  <span class="cap c2" style="display:block;margin-top:4px;line-height:1.4">${esc(p.name)}</span><span class="cap" style="display:block;font-weight:500;line-height:1.4">${rate}</span></button>`}
const pill=(l,on,k)=>`<button type="button" aria-pressed="${on}" data-calc-chip="${k}" data-go="calc.p2:${k==='All'?'none':k==='CEX'?'cexChip':'dexChip'}" style="height:34px;min-width:64px;border:0;padding:0 12px;border-radius:18px;font-size:13px;font-weight:500;cursor:pointer;transition:background-color .3s,color .3s;${on?'background:#0031c6;color:#fff':'background:#e9ecf1;color:var(--text-primary)'}">${l}</button>`;
// 상태 화면(전체 프로토타입)용 타일 클릭 — 사이트 모드는 site2.js가 처리
let selectedPlatform=null;
document.addEventListener('click',event=>{
 if(window.SITEC_LIVE)return;
 const button=event.target.closest('[data-calc-platform]');
 if(!button)return;
 selectedPlatform=button.dataset.calcPlatform;
 const selection=button.closest('[data-calc-selection]');
 selection.querySelectorAll('[data-calc-platform]').forEach(tile=>{
  const selected=tile===button;
  tile.setAttribute('aria-pressed',String(selected));
  tile.style.borderColor=selected?'#0031c6':'transparent';
  tile.style.background=selected?'rgba(187,226,255,.2)':'transparent';
 });
 const next=selection.closest('[data-calc-page]').querySelector('[data-calc-next]');
 next.disabled=false;
});

R.screen({id:'calc.p1',group:'calc',title:'P1 Landing',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'Did you know 카드',figma:{pc:'7260:88375',mo:'8135:170663'},note:'실서비스 calc_01'},
  {id:'noUsers',label:'사용자 수 없음 — 카드 숨김',figma:null,note:'[기존 MAX-146] 재사용: P1에서 Did you know 카드만 뺌 · V2.2 pbk/P1#noUsers'},
 ],
 render(st){
  const card=st==='noUsers'?'':dyk(`Cashback made simple — up to <b>${CL_UPTO} USDT</b> a month.<br>Trusted by <b>${CL_USERS}</b> users.`,343);
  const body=`<div class="col g8" style="text-align:center">${title('Check your missed Cashback,<br>in just 1 minute')}<p class="b2 c2" style="margin:0">Check now</p></div>
   <img src="${A('calc-hero.png')}" style="width:${mo()?320:480}px;max-width:100%;margin:-24px auto -12px" alt="">${card}<div class="row center" style="padding:0 10px">${C.btn('Start Cashback Preview',{go:'calc.p2:none',full:true})}</div>`;
  return page('p1',body,{w:500,note:st==='noUsers'?'사용자 수가 없으면 카드를 숨기고 0을 표시하지 않는다(<code>Trusted by 0 users</code> 금지, 정책 PB-2).':'제목·부제·카드 문구는 실서비스 화면(calc_01). 숫자 284 · 95,000은 측정일 실서비스 집계값(G-211 집계 자동).'});
 }});

R.screen({id:'calc.p2',group:'calc',title:'P2 Choose platform',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'통합 그리드(전체) — 선택됨',figma:{pc:'29194:120700',mo:'29194:121368'},note:'V2.2 pbk/P2#normal'},
  {id:'none',label:'미선택 — Next 비활성',figma:{pc:'29194:120700',mo:'29194:121368'},note:'V2.2 pbk/P2#none'},
  {id:'cexChip',label:'CEX 필터',figma:{pc:'29194:120979',mo:'29194:121473'}},
  {id:'dexChip',label:'DEX 필터',figma:{pc:'29064:934',mo:'29064:1384'},note:'V2.2 pbk/P2#dexChip'},
 ],
 render(st){
  const v=cv(st==='normal'?{pid:'bitget'}:{});
  const type=v.chip||({cexChip:'CEX',dexChip:'DEX'}[st]||'All');
  const list=type==='DEX'?CL_DEX:type==='CEX'?CL_CEX:[...CL_CEX,...CL_DEX];
  const candidate=window.SITEC?v.pid:(selectedPlatform||v.pid);
  const sel=list.some(p=>p.id===candidate)?candidate:null;
  const grid=`<div data-calc-selection style="display:grid;grid-template-columns:repeat(${mo()?3:6},minmax(0,1fr));gap:${mo()?'8px':'8px 8px'}">${list.map(p=>tile(p,p.id===sel)).join('')}</div>`;
  const body=`${title(T('First, which exchange do you use most?','먼저, 가장 자주 사용하는 거래소는 어디인가요?'))}<div class="row center g8">${pill(T('All','전체'),type==='All','All')}${pill('CEX',type==='CEX','CEX')}${pill('DEX',type==='DEX','DEX')}</div>${grid}`;
  const next=`<button type="button" class="btn contained primary lg" style="width:${mo()?'50%':'200px'}" data-calc-next data-go="calc.p3"${sel?'':' disabled'}>${T('Next','다음')}</button>`;
  return page('p2',body,{w:800,foot:backBtn('calc.p1')+next,
   note:'CEX 타일 순서·<code>Total Savings</code>는 실서비스 화면(calc_02). DEX 4곳은 정책 PB-3(<code>{rate}% Cashback</code>, 요율 G-003 ⏳). 선택 후 <code>Next</code> 활성.'});
 }});

// 슬라이더(실서비스 MUI Slider 모양: 레일 4px 불투명 .38 · 트랙 6px · 손잡이 20px · 눈금 7개)
function clSlider(key,p){
 const marks=[0,1,2,3,4,5,6].map(i=>`<span style="position:absolute;top:11px;left:calc(${i/6*100}% - 1px);width:2px;height:2px;border-radius:1px;background:#fff;opacity:.8;z-index:1"></span>`).join('');
 return `<div data-calc-slider="${key}" style="position:relative;height:24px;margin:8px 10px 0"><div style="position:absolute;left:0;right:0;top:10px;height:4px;border-radius:12px;background:#0031c6;opacity:.38"></div><div data-sl-fill style="position:absolute;left:0;top:9px;width:${p*100}%;height:6px;border-radius:12px;background:#0031c6"></div>${marks}<div data-sl-thumb style="position:absolute;left:calc(${p*100}% - 10px);top:2px;width:20px;height:20px;border-radius:50%;background:#0031c6"></div></div>`}
const CL_LEV={min:1,max:125,chips:[1,5,10,20,50,100]},CL_BAL={min:100,max:100000,chips:[500,1000,5000,10000,25000,50000]};
const kfmt=n=>n>=1000?(n/1000)+'K':String(n);
R.screen({id:'calc.p3',group:'calc',title:'P3 Trading profile',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'카드 4장 — 빈도 선택됨',figma:null,note:'실서비스 calc_03 + 빈도 선택 표시(라이브: 파란 1px 테두리)'},
  {id:'noFreq',label:'빈도 미선택 — Check Results 비활성',figma:{pc:'6510:88401',mo:'8135:170237'},note:'실서비스 calc_03'},
 ],
 render(st){
  const v=cv(st==='normal'?{freq:3}:{});
  const chipRow=(key,arr,val,f)=>`<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:${mo()?'4px':'8px'}">${arr.map(x=>{const on=x===val;return `<button type="button" data-calc-chipv="${key}:${x}" aria-pressed="${on}" style="font:inherit;height:34px;border-radius:8px;font-size:13px;letter-spacing:.16px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:#fff;transition:border-color .15s,color .15s;${on?'border:1px solid #0031c6;color:#0031c6':'border:.5px solid var(--divider);color:var(--text-secondary)'}">${f(x)}</button>`}).join('')}</div>`;
  const card=(h,val,inner,tip)=>`<div class="card" style="padding:${mo()?16:16}px;border-radius:8px"><div class="row between" style="align-items:flex-start"><div class="col g4"><span class="b2">${h}</span>${val?`<span class="h6" data-calc-val style="color:#0031c6;font-weight:700">${val}</span>`:''}</div>${tip?tipIc(tip):''}</div><div class="col g12 mt16">${inner}</div></div>`;
  const fq=`<div style="display:grid;grid-template-columns:repeat(${mo()?1:2},minmax(0,1fr));gap:12px">${CL_FREQ.map(([t,d],i)=>{const on=v.freq===i;return `<button type="button" data-calc-freq="${i}" aria-pressed="${on}" style="font:inherit;color:inherit;text-align:left;border-radius:8px;padding:16.5px;cursor:pointer;background:#fff;transition:border-color .15s;${on?'border:1px solid #0031c6':'border:.5px solid var(--divider)'}"><div class="b2 semi">${t}</div><div class="cap c2">${d}</div></button>`}).join('')}</div>`;
  const pct=(x,r)=>(x-r.min)/(r.max-r.min);
  const body=`${title("Next, let's check your trading profile.")}
   ${card('What leverage do you usually use?',v.lev+'x',chipRow('lev',CL_LEV.chips,v.lev,x=>x+'x')+clSlider('lev',pct(v.lev,CL_LEV)),"This means how much bigger your trade is compared to your actual money.\n\nExample: If you use $100 and trade like it's $1,000 – that's 10x.")}
   ${card('What is your current account balance?',balText(v.bal),chipRow('bal',CL_BAL.chips,v.bal,kfmt)+clSlider('bal',pct(v.bal,CL_BAL)),'Your total funds available for trading')}
   ${card('Order Type Ratio','',`<div class="row between cap c2" data-calc-ratio><span>Maker ${100-v.ratio}%</span><span>Taker ${v.ratio}%</span></div>`+clSlider('ratio',v.ratio/100),'Maker\nA limit order that adds liquidity. Lower fee.\n\nTaker\nA market order that takes liquidity. Higher fee.')}
   ${card('How often do you trade per day?','',fq)}`;
  return page('p3',body,{foot:backBtn('calc.p2')+nextBtn('Check Results','calc.p4c',v.freq==null,'data-calc-check'),
   note:'칩 ↔ 슬라이더 양방향(칩은 값이 정확히 같을 때만 선택 표시), 빈도 미선택 시 <code>Check Results</code> 비활성, CEX·DEX 동일(정책 PB-4). 기본값·범위·툴팁 문구는 라이브 실측(레버리지 1~125 · 잔고 100~100,000 · Taker 100%).'});
 }});

R.screen({id:'calc.p3l',group:'calc',title:'P3L Lighter 계정 유형 (삭제)',route:'/payback',fu:['FU-081'],shell:SHELL,doc:true,
 states:[{id:'normal',label:'Premium · Plus · Standard — 단계 삭제 확정',figma:null,note:'V2.2 pbk/P3L#normal · REQ-457 · G-210 삭제'}],
 render(){
  return page('p3',`${C.note('<b>이 단계는 만들지 않는다.</b> REQ-457 · G-210 확정: Lighter 계정 유형 단계(PB-5)를 두지 않는다(Lighter 온보딩 보류 — 온보딩 때 재검토, 분석 이벤트 dexw88도 보류). 아래는 V2.2에 있던 내용(참고용).')}
   <div class="note">${title('Which Lighter account do you use?')}<ul class="b2"><li>Premium — Taker 0.0280%, Maker 0.0040%</li><li>Plus — Taker 0.0050%, Maker 0.0050%</li><li>Standard — No trading fees, so no cashback</li></ul></div>`);
 }});

R.screen({id:'calc.p4c',group:'calc',title:'P4C Calculating',route:'/payback',fu:['FU-082'],shell:SHELL,
 states:[{id:'normal',label:'You might be surprised...',figma:{pc:'6510:88879',mo:'8135:170655'},note:'실서비스 calc_04'}],
 render(){
  const body=`<div class="col center" style="align-items:center;padding-top:${mo()?160:200}px;gap:16px"><img src="${A('calc-calculator.png')}" style="width:100px;height:88px" alt=""><p class="b1 c2" style="margin:0">You might be surprised...</p></div>`;
  return page('p4c',body,{w:480,note:'라이브: 정지 이미지 + 문구, 진행 바 숨김, 약 1.9초 뒤 결과로 자동 진행(정책 PB-6).'});
 }});

function result(v,cex,o={}){
 const {p,fees,cb}=clCalc(v);
 const tag=(pre,bg)=>`<span style="position:absolute;top:0;left:50%;transform:translateX(-50%);background:${bg};color:#fff;border-radius:16px;padding:4px 10px;font-size:10px;letter-spacing:.4px;white-space:nowrap"><span style="color:rgba(255,255,255,.7)">${pre}</span> <b>Tethermax</b></span>`;
 const cardA=`<div style="position:relative;height:183px;flex:1"><div style="position:absolute;top:16px;left:0;right:0;height:140px;background:#fff;border:1px solid #0031c6;border-radius:8px;box-shadow:0 4px 5px rgba(9,54,189,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding-top:8px"><img src="${A('calc-money.png')}" style="width:30px;height:30px" alt=""><div style="text-align:center"><div style="font-size:20px;font-weight:700;line-height:1.6;color:#0031c6" class="tnum">+${num(cb)}</div><div style="font-size:10px;line-height:1;color:var(--text-secondary)">YOUR CASHBACK (USDT)</div></div></div>${tag('Trade with','rgba(0,49,198,.9)')}</div>`;
 const cardB=`<div style="position:relative;height:183px;flex:1"><div style="position:absolute;top:16px;left:0;right:0;height:140px;background:rgba(255,255,255,.5);border:.5px solid rgba(0,0,0,.05);border-radius:8px;opacity:.8;backdrop-filter:blur(5px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:8px"><img src="${A('calc-money-wings.png')}" style="width:40px;height:40px;opacity:.7" alt=""><div class="b2 semi tnum" style="color:var(--error)">-${num(cb)}</div><div style="font-size:10px;line-height:1;color:var(--text-secondary)">FEES LOST (USDT)</div></div>${tag('Without','rgba(28,28,30,.9)')}</div>`;
 const hero=`<div style="position:relative;height:341px;width:343px;max-width:100%;margin:0 auto"><img src="${A('calc-phone.png')}" style="position:absolute;left:26px;top:0;width:290px;height:290px" alt=""><div class="row" style="position:absolute;left:0;right:0;top:185px;gap:7px;align-items:stretch">${cardA}${cardB}</div></div>`;
 const row=(k,val,b)=>`<div class="row between b2" style="padding:${b?'12px 0 0':'0'}"><span class="c2">${k}</span><span class="tnum${b?' semi':''}" style="${b?'font-size:16px':''}">${val}</span></div>`;
 // How we calculated this? — 라이브: 접힌 채 시작, grid-template-rows 0fr↔1fr .3s, 화살표 회전 .2s
 const how=`<div data-calc-how class="${v.how?'open':''}" style="background:rgba(207,216,220,.2);border:.5px solid rgba(0,0,0,.05);border-radius:8px;padding:12px 16px">
  <button type="button" data-calc-how-head aria-expanded="${!!v.how}" class="row between b2 med" style="width:100%;border:0;background:transparent;padding:0;font:inherit;color:inherit;cursor:pointer">How we calculated this?<img src="${A('calc-ic-expand.svg')}" style="width:16px;height:16px;transition:transform .2s;transform:rotate(${v.how?180:0}deg)" alt=""></button>
  <div data-calc-how-wrap style="display:grid;grid-template-rows:${v.how?'1fr':'0fr'};transition:grid-template-rows .3s"><div style="overflow:hidden"><div class="col g12" style="padding-top:16px">${row('Trading Fees',num(fees)+' USDT/mo')}${row('Cashback Rate','x '+p.rate+'%')}<hr class="divider" style="margin:0">${row('Monthly Cashback',num(cb)+' USDT/mo*',1)}</div></div></div></div>`;
 const tip=cex?`<div>${dyk(`On average, ${CL_USERS} <b>${esc(p.name)}</b> traders like you earn about <b>${num(cb)} USDT/mo.</b>`)}</div>`:'';
 const body=`${title("What You're Missing Out On")}${hero}${how}${tip}<div style="padding-top:24px">${C.btn(T('Next','다음'),{go:'calc.p5:'+(o.next||(cex?'cex':'normal')),full:true})}</div>`;
 return page('p4',body,{w:480,note:cex?'CEX만 <code>Did you know?</code>(정책 PB-7). 숫자는 바로 표시(라이브 카운트업 없음).':'DEX 결과에는 <code>Did you know?</code>를 숨긴다(정책 PB-7). 결과 구조는 CEX와 같다.'});
}
R.screen({id:'calc.p4',group:'calc',title:"P4 What You're Missing Out On",route:'/payback/result',fu:['FU-082'],shell:SHELL,
 states:[
  {id:'normal',label:'DEX(EdgeX) — Did you know 숨김',figma:null,note:'실서비스 calc_05 구조 · DEX'},
  {id:'cex',label:'CEX(BloFin) — On average… · 계산 펼침',figma:{pc:'6922:77328',mo:'7922:99923'},note:'실서비스 calc_05'},
 ],
 render(st){
  const cex=st==='cex';
  const v=cv(cex?{pid:'biofin',freq:3,how:true}:{pid:'edgex',freq:3});
  return result(v,clBy(v.pid).type==='CEX');
 }});

R.screen({id:'calc.p5',group:'calc',title:'P5 Summary',route:'/payback/result',fu:['FU-082'],shell:SHELL,
 states:[
  {id:'normal',label:'EdgeX — Daily',figma:null,note:'실서비스 calc_06 구조 · EdgeX 각주'},
  {id:'cex',label:'CEX(BloFin)',figma:{pc:'6510:89041',mo:'8135:170693'},note:'실서비스 calc_06'},
  {id:'aster',label:'Aster 각주',figma:null,note:'실서비스 calc_06 구조 · Aster 각주'},
  {id:'apex',label:'ApeX — Daily',figma:null,note:'실서비스 calc_06 구조 · ApeX(Hourly 금지)'},
  {id:'lighter',label:'Lighter — Daily',figma:null,note:'실서비스 calc_06 구조 · Lighter 각주'},
  {id:'mobile',label:'375폭 (모바일 보기로 확인)',figma:{mo:'8135:170693'},note:'V2.2 pbk/P5#mobile — 모바일 보기 전용 상태'},
 ],
 render(st){
  const pid={cex:'biofin',aster:'aster',apex:'apex',lighter:'lighter'}[st]||'edgex';
  const v=cv({pid,freq:3});
  const {p,fees,cb}=clCalc(v),dex=p.type==='DEX';
  // Schedule · Payout Time: 어드민 값(정책 B-19-3). 전 플랫폼 Daily. 시각은 거래소 레코드 업데이트(UTC) → 로컬
  const sched=['Daily',localHM(p.id==='bybit'?2:0)];
  const foot=dex?{edgex:'*Based on paid trading fees. EdgeX pays in USDC, shown 1:1 in USDT.',aster:'*Based on paid trading fees. Aster pays in the fee asset (USDT, ETH or BTC).',apex:'*Based on paid trading fees, paid in USDT.',lighter:'*Based on paid trading fees. Lighter pays in USDC, shown 1:1 in USDT.'}[p.id]:'*Calculated based on paid trading fees';
  const logo=dex?C.dex(p.name,20):`<img src="${A(p.logo)}" style="width:20px;height:20px;border-radius:50%;object-fit:contain;background:${p.color}" alt="">`;
  const box='background:rgba(207,216,220,.2);border:.5px solid rgba(0,0,0,.05);border-radius:4px;padding:16px';
  const g=(k,val)=>`<div style="${box}"><div style="font-size:12px;line-height:1;color:var(--text-secondary)">${k}</div><div class="b2 med" style="margin-top:4px">${val}</div></div>`;
  const tiles=`<div class="col g8"><div style="${box}" class="row between"><span style="font-size:12px;color:var(--text-secondary)">Exchange</span><span class="row g4 b2 med">${logo}${esc(p.name)}</span></div>
   <div class="grid2" style="gap:8px;grid-template-columns:1fr 1fr">${g('Account balance',balText(v.bal))}${g('Leverage',v.lev+'x')}${g('Order Type Ratio',ratioText(v.ratio))}${g('Trading frequency',v.freq==null?'—':CL_FREQ[v.freq][1])}</div></div>`;
  const row=(k,val)=>`<div class="row between b2"><span class="c2">${k}</span><span class="tnum">${val}</span></div>`;
  const receipt=`<div style="border:1px solid #0031c6;border-radius:4px;padding:16px;background:#fff" class="col g16">${row('Trading Fees',num(fees)+' USDT/mo')}${row('× Cashback Rate','× '+p.rate+'%')}<hr class="divider">
   <div class="row between"><span class="b1 semi">Cashback</span><span class="tnum"><b style="font-size:16px">${num(cb)}</b> <span class="b2">USDT/mo*</span></span></div><div style="font-size:10px;line-height:1;color:var(--text-secondary);text-align:center">${foot}</div></div>`;
  const pcol=(icn,k,val)=>`<div class="col" style="align-items:center;gap:8px;width:${mo()?'auto':'110px'};flex:${mo()?1:'none'};position:relative;z-index:1"><span style="background:#e6e7e9;border-radius:8px;padding:16px;display:flex"><img src="${A('calc-ic-'+icn+'.svg')}" style="width:24px;height:24px" alt=""></span><span style="font-size:10px;line-height:1;color:var(--text-secondary)">${k}</span><span style="font-size:10px;line-height:1;letter-spacing:.15px;white-space:nowrap">${val}</span></div>`;
  const payout=`<div style="${box.replace('4px;padding:16px','8px;padding:16px 16px 16px')}"><div class="b1 semi" style="text-align:center">Payout Details</div><div class="row center" style="margin-top:16px;gap:${mo()?8:16}px;align-items:flex-start;position:relative"><span style="position:absolute;top:28px;left:${mo()?'20%':'50%'};${mo()?'right:20%':'width:250px;transform:translateX(-50%)'};border-top:1px dashed rgba(0,0,0,.2)"></span>${pcol('schedule','Schedule',sched[0])}${pcol('atm','Payout Time',sched[1])}${pcol('pin','Destination','TetherMax Account')}</div></div>`;
  const btns=`<div class="grid2" style="gap:8px;grid-template-columns:1fr 1fr;padding-top:8px"><button class="btn contained lg" data-calc-restart style="background:#f2f2f5;color:#000" data-go="calc.p1"><img src="${A('calc-ic-restart.svg')}" style="width:24px;height:24px" alt="">Restart</button><button class="btn contained primary lg" data-go="${p.type==='DEX'?'dex.detail:'+p.id:'cexd:'+p.id}">Start ${esc(p.name)} Cashback</button></div>`;
  const body=`<h1 style="margin:0;text-align:center;font-size:${mo()?20:24}px;line-height:1.334;font-weight:700">You're all set.<br>Here's your summary.</h1>${tiles}${receipt}${payout}${btns}`;
  const notes={normal:'타일·영수증·Payout Details 구성과 문구는 실서비스 화면(calc_06). DEX 각주·Daily는 정책 B-19-3. Destination = <code>TetherMax Account</code>(DEX 직접 지급 표현 금지). 금액 2자리 절삭. <code>Start {exchange} Cashback</code> = 그 거래소 상세(DEX = DEX 상세, CEX = 거래소 상세 <code>/en/exchangeDetail/{slug}-referral</code>, 결정 12차) · 외부 링크 아이콘 없음.',
   cex:'CEX 각주 <code>*Calculated based on paid trading fees</code>(실서비스).',aster:'Aster 각주(정책 B-19-3).',
   apex:'ApeX도 <code>Daily</code> — <code>Hourly</code>/<code>Every hour</code> 금지(정책 B-19-3).',lighter:'Lighter 각주(정책 B-19-3). 전 플랫폼 Daily.',mobile:'375폭: 같은 단계·같은 문구, 1열, 가로 스크롤 없음(정책 PB-9).'};
  return page('p5',body,{w:752,note:notes[st]});
 }});
;window.CALCX={CL_CEX,CL_DEX,CL_LEV,CL_BAL,clBy,clCalc,result};
