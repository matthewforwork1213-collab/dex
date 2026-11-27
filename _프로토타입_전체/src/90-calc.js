// 9. 계산기 (/payback) — FU-081 · FU-082 (V2.2 pbk/P1 ~ P5)
// Figma: 기존 페이지 [MAX-146] Cashback Calculator(3565:13728) › Web section(6510:89547) · mWeb section(8135:170235) · MAXOP-405(17996:179540)
//        + DEX(revision) › 사용자 기능 · PC와 모바일 원본 보완 › 계산기 · 계산 과정(PC 29064:934 · 모바일 29064:1384, DEX 칩)
// 문구는 명세(REQ-453 ~ 462) 우선 — 기존 Figma 문구와 다르면 명세가 맞다(예: P1 리드에 DEXs·brokers 포함).
// Lighter 계정 유형 단계(PB-5)는 두지 않는다(REQ-457 · G-210 삭제). Lighter는 온보딩 보류라 P2 타일에서 뺀다.

const CL_STEPS=['Landing','Choose platform','Trading profile','Calculating',"What You're Missing Out On",'Summary'];
const CL_FILL={p1:.2,p2:.4,p3:.6,p4c:.7,p4:.8,p5:1};
const CL_FEES=210; // 예시 월 거래 수수료(USDT) — V2.2 표본값
// 선택 화면의 CEX 총 절감률은 첨부 시안의 예시값. 결과 화면의 캐시백률은 별도 값이다.
const CL_CEX=[
 ['woox','WOO X Pro',72,'calc-wooxpro.png','#000000'],['bitget','Bitget',98,'calc-bitget.png','#00efff'],['binance','Binance',20,'calc-binance.png','#0c1011'],
 ['bybit','Bybit',44,'calc-bybit.png','#131827',45],['okx','OKX',77,'calc-okx.png','#000000'],['mexc','MEXC',50,'calc-mexc.png','#202324'],
 ['flipster','Flipster',70,'calc-flipster.png','#0c1011'],['bingx','BingX',60,'calc-bingx.png','#0645f5'],['deepcoin','DeepCoin',75,'calc-deepcoin.png','#141414'],
 ['gate','Gate',81,'calc-gate.png','#0053d7'],['lbank','LBank',83,'calc-lbank.svg','#000000'],['blockfin','BlockFin',70,'calc-blockfin.svg','#171717'],
 ['kucoin','KuCoin',65,'calc-kucoin.png','#26b496'],['zoomex','Zoomex',50,'calc-zoomex.png','#121d28'],['bitunix','Bitunix',94,'calc-bitunix.svg','#000000'],
 ['biofin','BloFin',70,'calc-biofin.png','#000000'],['htx','HTX',54,'calc-htx.svg','#0d1a2b'],['toobit','Toobit',70,'calc-toobit.svg','#0d1113'],
].map(([id,name,savings,logo,color,rate])=>({id,name,savings,logo,color,rate,type:'CEX'}));
const CL_DEX=[['edgex','EdgeX',30,'#101916'],['apex','ApeX',30,'#211a0a'],['aster','Aster',20,'#251a10']].map(([id,name,rate,color])=>({id,name,rate,color,type:'DEX'}));
const CL_LIGHTER={id:'lighter',name:'Lighter',rate:20,type:'DEX'}; // Premium 표본 (온보딩 보류 G-428)
const clBy=id=>[...CL_CEX,...CL_DEX,CL_LIGHTER].find(p=>p.id===id);
const fl=n=>Math.floor(n*100+1e-6)/100;
const num=n=>fl(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const mo=()=>S.vp==='mo';
// UTC 시각 → 사용자 로컬 표시(타임존 라벨 없음)
const localHM=h=>{const d=new Date(Date.UTC(2026,0,5,h,0));return String(d.getHours()).padStart(2,'0')+':'+String(d.getMinutes()).padStart(2,'0')};

const SHELL={nav:'calc',accent:true,noFooter:true,noNav:true,moTitle:['Calculator','계산기']};
function bar(k){return `<div style="padding:0 ${mo()?0:24}px"><div style="height:8px;background:#eaeaed;overflow:hidden"><div style="height:8px;width:${CL_FILL[k]*100}%;background:#2453f0"></div></div></div>`}
// 페이지 골격: 진행 바 + 본문(가운데 정렬 컨테이너) + 하단 버튼 줄(선택)
function page(k,body,o={}){
 const w=o.w||744;
 const foot=o.foot?`<div style="border-top:1px solid var(--divider);background:#fff;padding:${mo()?'12px 16px':'16px 24px'};display:flex;justify-content:center;gap:${mo()?'8px':'288px'}">${o.foot}</div>`:'';
 return `<div${k==='p2'?' data-calc-page':''} style="display:flex;flex-direction:column;min-height:${mo()?756:836}px">${bar(k)}
  <div style="flex:1;padding:${mo()?'24px 16px 32px':'40px 24px 48px'}"><div style="max-width:${w}px;margin:0 auto" class="col g24">${body}</div></div>${foot}</div>${o.note?C.note(o.note):''}`}
const backBtn=go=>`<button class="btn contained lg" style="background:#eef0f3;color:var(--text-primary);width:${mo()?'50%':'200px'}" data-go="${go}">${T('Back','뒤로')}</button>`;
const nextBtn=(label,go,dis)=>`<button class="btn contained primary lg" style="width:${mo()?'50%':'200px'}"${dis?' disabled':` data-go="${go}"`}>${label}</button>`;
const title=(t)=>`<h1 style="margin:0;text-align:center;font-size:${mo()?20:24}px;line-height:1.334;font-weight:700">${t}</h1>`;
const tipIc=`<span style="width:18px;height:18px;border-radius:50%;border:1.5px solid var(--action-active);color:var(--action-active);font-size:11px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex:none">i</span>`;
// Did you know 카드 (Figma aiReasoning/didyouknow: 연파랑 그라데이션 · 테두리 #c7d6ff · 제목 #7f9fff)
const dyk=(html,w)=>`<div style="border:1px solid #c7d6ff;border-radius:8px;padding:16px;box-shadow:1px 1px 15px rgba(28,28,30,.04);background:linear-gradient(160deg,rgba(199,214,255,.08),rgba(0,49,198,.08) 230%);${w?`width:${w}px;max-width:100%;margin:0 auto`:''}" class="col g12"><div class="row g8"><img src="${A('calc-ic-tips.svg')}" style="width:16px;height:16px" alt=""><span class="b2 semi" style="color:#7f9fff">Did you know?</span></div><div class="cap" style="line-height:1.33;letter-spacing:.2px">${html}</div></div>`;

// 계산기 브랜드 배너 + 거래소 이름 + 유형별 비율. 선택 표시는 기존 파란 테두리.
function tile(p,on){
 const size=p.id==='toobit'?(mo()?16:21):(mo()?32:40);
 const logo=p.type==='DEX'?C.dex(p.name,size):`<img src="${A(p.logo)}" style="width:${size}px;height:${size}px;object-fit:contain${p.id==='flipster'?';border-radius:50%':''}" alt="">`;
 const rate=p.type==='CEX'?T(`${p.savings}% Total Savings`,`총 절감률 ${p.savings}%`):T(`${p.rate}% Cashback`,`최종 캐시백률 ${p.rate}%`);
 return `<button type="button" aria-pressed="${on}" data-calc-platform="${p.id}" style="font:inherit;color:inherit;min-width:0;text-align:left;border-radius:6px;padding:4px;cursor:pointer;border:1px solid ${on?'#2453f0':'transparent'};background:${on?'#e9f0ff':'transparent'}">
  <span style="height:${mo()?42:60}px;border-radius:4px;background:${p.color};display:flex;align-items:center;justify-content:center">${logo}</span>
  <span class="cap c2" style="display:block;margin-top:4px;line-height:1.4">${esc(p.name)}</span><span class="cap" style="display:block;font-weight:500;line-height:1.4">${rate}</span></button>`}
const pill=(l,on,go)=>`<button type="button" aria-pressed="${on}" data-go="${go}" style="height:34px;min-width:64px;border:0;padding:0 12px;border-radius:18px;font-size:13px;font-weight:500;cursor:pointer;${on?'background:#0031c6;color:#fff':'background:#e9ecf1;color:var(--text-primary)'}">${l}</button>`;
let selectedPlatform=null;
document.addEventListener('click',event=>{
 const button=event.target.closest('[data-calc-platform]');
 if(!button)return;
 selectedPlatform=button.dataset.calcPlatform;
 const selection=button.closest('[data-calc-selection]');
 selection.querySelectorAll('[data-calc-platform]').forEach(tile=>{
  const selected=tile===button;
  tile.setAttribute('aria-pressed',String(selected));
  tile.style.borderColor=selected?'#2453f0':'transparent';
  tile.style.background=selected?'#e9f0ff':'transparent';
 });
 const next=selection.closest('[data-calc-page]').querySelector('[data-calc-next]');
 next.disabled=false;
});

R.screen({id:'calc.p1',group:'calc',title:'P1 Landing',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'Did you know 카드',figma:{pc:'7260:88375',mo:'8135:170663'},note:'V2.2 pbk/P1#normal'},
  {id:'noUsers',label:'사용자 수 없음 — 카드 숨김',figma:null,note:'[기존 MAX-146] 재사용: P1(7260:88375 · 8135:170663)에서 Did you know 카드만 뺌 · V2.2 pbk/P1#noUsers'},
 ],
 render(st){
  const card=st==='noUsers'?'':dyk('<b>81,836</b> of our users earn an average of<br><b>284.00 USDT</b> in cashback per month.',343);
  const body=`<div class="col g8" style="text-align:center">${title("You're paying too many fees.")}<p class="b2 c2" style="margin:0">See how much cashback you're missing out on, across exchanges, DEXs and brokers.</p></div>
   <img src="${A('calc-hero.png')}" style="width:${mo()?320:480}px;max-width:100%;margin:-40px auto -12px" alt="">${card}<div class="row center" style="padding:0 10px">${C.btn('Start Cashback Preview',{go:'calc.p2:none',full:true})}</div>`;
  return page('p1',body,{w:500,note:st==='noUsers'?'사용자 수가 없으면 카드를 숨기고 0을 표시하지 않는다(<code>Trusted by 0 users</code> 금지, REQ-454). {n}·{amount}는 집계 자동(G-211).':'리드 문구는 명세 REQ-454(기존 Figma: <i>See how much cashback are you missing out.</i>). {n}·{amount}는 집계 자동(G-211). 진입점 = 헤더 <code>Calculator</code> · S3 홈 <code>Cashback Preview</code>(REQ-453).'});
 }});

R.screen({id:'calc.p2',group:'calc',title:'P2 Choose platform',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'통합 그리드(전체) — 선택됨',figma:{pc:'29194:120700',mo:'29194:121368'},note:'V2.2 pbk/P2#normal'},
  {id:'none',label:'미선택 — Next 비활성',figma:{pc:'29194:120700',mo:'29194:121368'},note:'V2.2 pbk/P2#none'},
  {id:'cexChip',label:'CEX 필터',figma:{pc:'29194:120979',mo:'29194:121473'}},
  {id:'dexChip',label:'DEX 필터',figma:{pc:'29064:934',mo:'29064:1384'},note:'V2.2 pbk/P2#dexChip'},
 ],
 render(st){
  const type={cexChip:'CEX',dexChip:'DEX'}[st]||'All';
  const list=type==='DEX'?CL_DEX:type==='CEX'?CL_CEX:[...CL_CEX,...CL_DEX];
  const candidate=selectedPlatform||(st==='normal'?'bitget':null);
  const sel=list.some(p=>p.id===candidate)?candidate:null;
  const grid=`<div data-calc-selection style="display:grid;grid-template-columns:repeat(${mo()?3:6},minmax(0,1fr));gap:${mo()?'12px 15px':'18px 16px'}">${list.map(p=>tile(p,p.id===sel)).join('')}</div>`;
  const body=`${title(T('First, which exchange do you use most?','먼저, 가장 자주 사용하는 거래소는 어디인가요?'))}<div class="row center g8">${pill(T('All','전체'),type==='All','calc.p2:none')}${pill('CEX',type==='CEX','calc.p2:cexChip')}${pill('DEX',type==='DEX','calc.p2:dexChip')}</div>${grid}`;
  const next=`<button type="button" class="btn contained primary lg" style="width:${mo()?'50%':'200px'}" data-calc-next data-go="calc.p3"${sel?'':' disabled'}>${T('Next','다음')}</button>`;
  return page('p2',body,{w:800,foot:backBtn('calc.p1')+next,
   note:'CEX 카드의 <code>Total Savings</code> 값은 참고 화면의 표본이며, DEX 카드에는 <code>Cashback</code>을 표시합니다. 선택 후 <code>Next</code>가 활성화됩니다. 파트너 구성과 요율은 운영 데이터에 따릅니다.'});
 }});

R.screen({id:'calc.p3',group:'calc',title:'P3 Trading profile',route:'/payback',fu:['FU-081'],shell:SHELL,
 states:[
  {id:'normal',label:'카드 4장 — 빈도 선택됨',figma:null,note:'[기존 MAX-146] 재사용: P3(6510:88401 · mWeb 8135:170237 · Prototype 7260:73533 모두 빈도 미선택 — 스크린샷 확인) + 선택 표시는 같은 퍼널 P2 타일 선택 스타일 · V2.2 pbk/P3#normal'},
  {id:'noFreq',label:'빈도 미선택 — Check Results 비활성',figma:{pc:'6510:88401',mo:'8135:170237'},note:'[기존 MAX-146] 스크린샷으로 미선택·`Check Results` 비활성 확인 · V2.2 pbk/P3#noFreq'},
 ],
 render(st){
  const chipRow=(arr,on)=>`<div style="display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:${mo()?'4px':'8px'}">${arr.map((x,i)=>`<span style="height:32px;border-radius:4px;font-size:13px;display:flex;align-items:center;justify-content:center;cursor:pointer;${i===on?'border:1px solid #2f62f5;color:#2f62f5;background:#fff':'border:1px solid transparent;color:var(--text-secondary)'}">${x}</span>`).join('')}</div>`;
  const slider=p=>`<div style="position:relative;height:16px;margin:4px 6px 0"><div style="position:absolute;left:0;right:0;top:7px;height:2px;background:#c9d3f5"></div><div style="position:absolute;left:0;width:${p}%;top:6px;height:4px;background:#2f62f5;border-radius:2px"></div><div style="position:absolute;left:calc(${p}% - 7px);top:1px;width:14px;height:14px;border-radius:50%;background:#2f62f5"></div></div>`;
  const card=(h,val,inner)=>`<div class="card" style="padding:${mo()?16:20}px;border-radius:8px"><div class="row between" style="align-items:flex-start"><div class="col g4"><span class="b2 c2">${h}</span>${val?`<span class="h6" style="color:#2f62f5;font-weight:700">${val}</span>`:''}</div>${tipIc}</div><div class="col g12 mt16">${inner}</div></div>`;
  const freq=[['Rarely','Barely once a day'],['Sometimes','1–2 trades a day'],['Regularly','2–5 trades a day'],['Very Active','5–10 trades a day'],['All Day','10+ trades a day']];
  const fq=`<div style="display:grid;grid-template-columns:repeat(${mo()?1:2},minmax(0,1fr));gap:8px">${freq.map(([t,d],i)=>{const on=st==='normal'&&i===2;return `<div style="border-radius:4px;padding:12px 16px;cursor:pointer;${on?'border:1px solid #2f62f5;background:#eef3ff':'border:1px solid var(--divider);background:#fff'}"><div class="b2 semi">${t}</div><div class="cap c2">${d}</div></div>`}).join('')}</div>`;
  const body=`${title("Next, let's check your trading profile.")}
   ${card('What leverage do you usually use?','10x',chipRow(['1x','5x','10x','20x','50x','100x'],2)+slider(20))}
   ${card('What is your current account balance?','5,000.00 USDT',chipRow(['500','1K','5K','10K','25K','50K'],2)+slider(40))}
   ${card('Order Type Ratio','',`<div class="row between cap c2"><span>Maker 30%</span><span>Taker 70%</span></div>`+slider(70))}
   ${card('How often do you trade per day?','',fq)}`;
  return page('p3',body,{foot:backBtn('calc.p2')+nextBtn('Check Results','calc.p4c',st==='noFreq'),
   note:'칩 ↔ 슬라이더 양방향 동기, 빈도 미선택 시 <code>Check Results</code> 비활성, CEX·DEX 동일(REQ-456). 툴팁 아이콘 hover 시 설명 — 툴팁 문구는 Figma 원본(6510:89547 Tooltip) 미수록.'});
 }});

R.screen({id:'calc.p3l',group:'calc',title:'P3L Lighter 계정 유형 (삭제)',route:'/payback',fu:['FU-081'],shell:SHELL,doc:true,
 states:[{id:'normal',label:'Premium · Plus · Standard — 단계 삭제 확정',figma:null,note:'V2.2 pbk/P3L#normal · REQ-457 · G-210 삭제'}],
 render(){
  return page('p3',`${C.note('<b>이 단계는 만들지 않는다.</b> REQ-457 · G-210 확정: Lighter 계정 유형 단계(PB-5)를 두지 않는다(Lighter 온보딩 보류 — 온보딩 때 재검토, 분석 이벤트 dexw88도 보류). 아래는 V2.2에 있던 내용(참고용).')}
   <div class="note">${title('Which Lighter account do you use?')}<ul class="b2"><li>Premium — Taker 0.0280%, Maker 0.0040%</li><li>Plus — Taker 0.0050%, Maker 0.0050%</li><li>Standard — No trading fees, so no cashback</li></ul></div>`);
 }});

R.screen({id:'calc.p4c',group:'calc',title:'P4C Calculating',route:'/payback',fu:['FU-082'],shell:SHELL,
 states:[{id:'normal',label:'You might be surprised...',figma:{pc:'6510:88879',mo:'8135:170655'},note:'V2.2 pbk/P4C#normal'}],
 render(){
  const body=`<div class="col center" style="align-items:center;padding-top:${mo()?160:200}px;gap:16px"><div class="spinner"></div><p class="b2 c2" style="margin:0">You might be surprised...</p></div>`;
  return page('p4c',body,{w:480,note:'자동 진행 → 결과(REQ-458). Figma는 계산기 아이콘 애니메이션 자리(「Pending animation from Khoa」) — 애니메이션 미정이라 스피너로 둠.'});
 }});

function result(p,cex){
 const cb=fl(CL_FEES*p.rate/100);
 const tag=(pre,bg)=>`<span style="position:absolute;top:0;left:50%;transform:translateX(-50%);background:${bg};color:#fff;border-radius:16px;padding:4px 10px;font-size:10px;letter-spacing:.4px;white-space:nowrap"><span style="color:rgba(255,255,255,.7)">${pre}</span> <b>TetherMax</b></span>`;
 const cardA=`<div style="position:relative;height:183px;flex:1"><div style="position:absolute;top:16px;left:0;right:0;height:140px;background:#fff;border:1px solid #0031c6;border-radius:8px;box-shadow:0 4px 5px rgba(9,54,189,.1);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;padding-top:8px"><img src="${A('calc-money.png')}" style="width:30px;height:30px" alt=""><div style="text-align:center"><div style="font-size:20px;font-weight:700;line-height:1.6;color:#0031c6" class="tnum">+${num(cb)}</div><div style="font-size:10px;line-height:1;color:var(--text-secondary)">YOUR CASHBACK (USDT)</div></div></div>${tag('Trade with','rgba(0,49,198,.9)')}</div>`;
 const cardB=`<div style="position:relative;height:183px;flex:1"><div style="position:absolute;top:16px;left:0;right:0;height:140px;background:rgba(255,255,255,.5);border:.5px solid rgba(0,0,0,.05);border-radius:8px;opacity:.8;backdrop-filter:blur(5px);display:flex;flex-direction:column;align-items:center;justify-content:center;padding-top:8px"><img src="${A('calc-money.png')}" style="width:40px;height:40px;opacity:.7" alt=""><div class="b2 semi tnum" style="color:var(--error)">-${num(cb)}</div><div style="font-size:10px;line-height:1;color:var(--text-secondary)">FEES LOST (USDT)</div></div>${tag('Without','rgba(28,28,30,.9)')}</div>`;
 const hero=`<div style="position:relative;height:341px;width:343px;max-width:100%;margin:0 auto"><img src="${A('calc-phone.png')}" style="position:absolute;left:26px;top:0;width:290px;height:290px" alt=""><div class="row" style="position:absolute;left:0;right:0;top:185px;gap:7px;align-items:stretch">${cardA}${cardB}</div></div>`;
 const how=`<details style="background:rgba(207,216,220,.2);border:.5px solid rgba(0,0,0,.05);border-radius:8px;padding:11px 16px"><summary class="b2 med row between" style="cursor:pointer;list-style:none">How we calculated this?<img src="${A('calc-ic-expand.svg')}" style="width:16px;height:16px" alt=""></summary><p class="b2 c2" style="margin:8px 0 0">Trading Fees × Cashback Rate = Cashback</p></details>`;
 const tip=cex?`<div style="padding:0 16px">${dyk(`On average, 81,836 <b>${esc(p.name)}</b> traders like you earn about <b>${num(cb)} USDT/mo.</b>`)}</div>`:'';
 const body=`${title("What You're Missing Out On")}${hero}${how}${tip}<div style="padding-top:24px">${C.btn(T('Next','다음'),{go:'calc.p5:'+(cex?'cex':'normal'),full:true})}</div>`;
 return page('p4',body,{w:480,note:cex?'CEX만 <code>Did you know?</code>(REQ-458 · 461). 문구 <code>On average, {n} {platform} traders like you earn about {amount} USDT/mo.</code>':'DEX 결과에는 <code>Did you know?</code>를 숨긴다(REQ-458). 결과 구조는 CEX와 같다.'});
}
R.screen({id:'calc.p4',group:'calc',title:"P4 What You're Missing Out On",route:'/payback',fu:['FU-082'],shell:SHELL,
 states:[
  {id:'normal',label:'DEX(EdgeX) — Did you know 숨김',figma:null,note:'[기존 MAX-146] 재사용: P4(6922:77328 · 7922:99923)에서 Did you know만 뺌 · V2.2 pbk/P4#normal'},
  {id:'cex',label:'CEX(Bybit) — On average…',figma:{pc:'6922:77328',mo:'7922:99923'},note:'V2.2 pbk/P4#cex'},
 ],
 render(st){return result(clBy(st==='cex'?'bybit':'edgex'),st==='cex')}});

R.screen({id:'calc.p5',group:'calc',title:'P5 Summary',route:'/payback',fu:['FU-082'],shell:SHELL,
 states:[
  {id:'normal',label:'EdgeX — Daily',figma:null,note:'[기존 MAX-146] 재사용: Summary(6510:89041 · 8135:170693) — 플랫폼·각주·주기 값만 다름 · V2.2 pbk/P5#normal'},
  {id:'cex',label:'CEX(Bybit)',figma:{pc:'6510:89041',mo:'8135:170693'},note:'V2.2 pbk/P5#cex'},
  {id:'aster',label:'Aster 각주',figma:null,note:'[기존 MAX-146] 재사용: Summary(6510:89041 · 8135:170693) — 플랫폼·각주·주기 값만 다름 · V2.2 pbk/P5#aster'},
  {id:'apex',label:'ApeX — 표기 G-025 대기',figma:null,note:'[기존 MAX-146] 재사용: Summary(6510:89041 · 8135:170693) — 플랫폼·각주·주기 값만 다름 · V2.2 pbk/P5#apex'},
  {id:'lighter',label:'Lighter Weekly · Every Monday (온보딩 후)',figma:null,note:'[기존 MAX-146] 재사용: Summary(6510:89041 · 8135:170693) — 플랫폼·각주·주기 값만 다름 · V2.2 pbk/P5#lighter'},
  {id:'mobile',label:'375폭 (모바일 보기로 확인)',figma:{mo:'8135:170693'},note:'V2.2 pbk/P5#mobile — 모바일 보기 전용 상태'},
 ],
 render(st){
  const pid={cex:'bybit',aster:'aster',apex:'apex',lighter:'lighter'}[st]||'edgex';const p=clBy(pid),dex=p.type==='DEX';
  const cb=fl(CL_FEES*p.rate/100);
  const tbdApex=C.tbd('ApeX 표기 — 일 롤업 합의 시 Daily','G-025');
  const sched=pid==='lighter'?['Weekly','Every Monday']:pid==='apex'?[tbdApex,tbdApex]:['Daily',localHM(pid==='bybit'?2:0)];
  const foot={bybit:'*Calculated based on paid trading fees',edgex:'*Based on paid trading fees. EdgeX pays in USDC, shown 1:1 in USDT.',aster:'*Based on paid trading fees. Aster pays in the fee asset (USDT, ETH or BTC).',apex:'*Based on paid trading fees, paid in USDT.',lighter:'*Based on paid trading fees. Lighter pays in USDC, shown 1:1 in USDT.'}[pid];
  const logo=dex?C.dex(p.name,20):`<img src="${A(p.logo)}" style="width:20px;height:20px;border-radius:50%" alt="">`;
  const box='background:rgba(207,216,220,.2);border:.5px solid rgba(0,0,0,.05);border-radius:4px;padding:16px';
  const g=(k,v)=>`<div style="${box}"><div style="font-size:12px;line-height:1;color:var(--text-secondary)">${k}</div><div class="b2 med" style="margin-top:4px">${v}</div></div>`;
  const tiles=`<div class="col g8"><div style="${box}" class="row between"><span style="font-size:12px;color:var(--text-secondary)">Platform</span><span class="row g4 b2 med">${logo}${esc(p.name)}${pid==='lighter'?' Premium':''}</span></div>
   <div class="grid2" style="gap:8px;grid-template-columns:1fr 1fr">${g('Account balance','5,000 USDT')}${g('Leverage','10x')}${g('Order Type Ratio','Maker 30% · Taker 70%')}${g('Trading frequency','Regularly')}</div></div>`;
  const row=(k,v)=>`<div class="row between b2"><span class="c2">${k}</span><span class="tnum">${v}</span></div>`;
  const receipt=`<div style="border:1px solid #0031c6;border-radius:4px;padding:16px;background:#fff" class="col g16">${row('Trading Fees',num(CL_FEES)+' USDT/mo')}${row('× Cashback Rate','× '+p.rate+'%')}<hr class="divider">
   <div class="row between"><span class="b1 semi">Cashback</span><span class="tnum"><b style="font-size:16px">${num(cb)}</b> <span class="b2">USDT/mo*</span></span></div><div style="font-size:10px;line-height:1;color:var(--text-secondary)">${foot}</div></div>`;
  const pcol=(icn,k,v)=>`<div class="col" style="align-items:center;gap:8px;width:${mo()?'auto':'80px'};flex:${mo()?1:'none'};position:relative;z-index:1"><span style="background:#e6e7e9;border-radius:8px;padding:16px;display:flex"><img src="${A('calc-ic-'+icn+'.svg')}" style="width:24px;height:24px" alt=""></span><span style="font-size:10px;line-height:1;color:var(--text-secondary)">${k}</span><span style="font-size:10px;line-height:1;letter-spacing:.15px;white-space:nowrap">${v}</span></div>`;
  const payout=`<div style="${box.replace('4px;padding:16px','8px;padding:16px 16px 16px')}"><div class="b1 semi" style="text-align:center">Withdrawal Details</div><div class="row center" style="margin-top:16px;gap:${mo()?8:36}px;align-items:flex-start;position:relative"><span style="position:absolute;top:28px;left:${mo()?'20%':'50%'};${mo()?'right:20%':'width:175px;transform:translateX(-50%)'};border-top:1px dashed rgba(0,0,0,.2)"></span>${pcol('schedule','Schedule',sched[0])}${pcol('atm','Withdrawal Time',sched[1])}${pcol('pin','Destination','TetherMax Account')}</div></div>`;
  const btns=`<div class="grid2" style="gap:8px;grid-template-columns:1fr 1fr;padding-top:8px"><button class="btn contained lg" style="background:#f2f2f5;color:#000" data-go="calc.p1"><img src="${A('calc-ic-restart.svg')}" style="width:24px;height:24px" alt="">Restart</button><button class="btn contained primary lg">Start ${esc(p.name)} Cashback<img src="${A('calc-ic-open.svg')}" style="width:24px;height:24px" alt=""></button></div>`;
  const body=`<h1 style="margin:0;text-align:center;font-size:${mo()?20:24}px;line-height:1.334;font-weight:700">You're all set.<br>Here's your summary.</h1>${tiles}${receipt}${payout}${btns}`;
  const notes={normal:'Schedule·Withdrawal Time은 거래소 레코드 <code>주기</code>·<code>요일</code>·<code>업데이트(UTC)</code>에서 파생, 로컬 표시(REQ-459). Destination = <code>TetherMax Account</code>(전 플랫폼, DEX 직접 지급 표현 금지). 영수증 2자리 절삭. <code>Start {platform} Cashback</code> = 귀속 새 탭.',
   cex:'CEX 각주 <code>*Calculated based on paid trading fees</code>(REQ-462). Bybit 업데이트 02:00 UTC → 로컬 표시.',aster:'Aster 각주(REQ-462).',
   apex:'ApeX <code>Hourly</code>/<code>Every hour</code> 금지. G-025(ApeX 일 롤업) 합의 시 <code>Daily</code>(G-099).',lighter:'Lighter <code>Weekly</code>·<code>Every Monday</code>(REQ-459). Lighter는 온보딩 보류(G-428) — 온보딩 후 노출.',mobile:'375폭: 같은 단계·같은 문구, 1열, 가로 스크롤 없음(REQ-460).'};
  return page('p5',body,{w:752,note:notes[st]+' · 타일 첫 줄 라벨은 명세 <code>Platform</code>(기존 Figma <code>Exchange</code>).'});
 }});
