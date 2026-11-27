// 10. 캐시백 요약 · 랭킹 — FU-060 ~ FU-063 (V2.2 hist/SUM 12개 · rk/RANK 3개 상태)
// Figma: DEX(revision) › "DEX — Cashback Summary Web [Light]"(CS1~CS5) · "DEX / CS6 Filter dropdowns"(Select · All Accounts · All Types)
//        "DEX — Cashback Ranking Web [Light]"(RK1~RK3 · Wallet address 행) · "사용자 기능 · PC와 모바일 원본 보완"(캐시백 요약 · 모바일/캘린더, 내 캐시백 랭킹 · 모바일/대상 없음)
// Figma 문구가 정책과 다른 곳은 정책을 따른다: 월간 카드 `Claimed` → `Withdrawn`(REQ-369), 유형 `Payout`·`Withdrawal`·`Trading Cashback` →
// `Claim Amount`·`Exchange Cashback`(REQ-367 · G-365 · G-418), 유형 셀렉트 `All Cashback Types` → `All Types`(REQ-378). ref/질문_summary.md 참고.

const W_LIGHTER='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9'; // Figma CS3 · 파트너 허브 모달과 같은 표본
const W_EDGEX='0x884B2e7f90d6a158ce0b4f7d23e9a61c58a01a69';   // Figma 모바일 `0x884B…1a69` 표본(전체 주소는 표본값)
const W_ASTER='0x91c4e2b73f90d6a158ce0b4f7d23e9a61c58a07b';   // Figma RK `Wallet address / 0x91c4…a07b` 원문
const mo=()=>S.vp==='mo';
const short=a=>a.slice(0,6)+'…'+a.slice(-4);
const LOGO={bitget:'inv-logo-bitget.png',okx:'inv-logo-okx.png',bybit:'inv-logo-bybit.png',binance:'link-cex-binance.png',bingx:'link-cex-bingx.png'};
// 거래소 로고: DEX는 공통 에셋, CEX는 Figma에서 받은 inv-logo-*(없으면 연동 모듈 로고 → 글자 아바타)
function logo(name,size=24){
 if(['Lighter','ApeX','EdgeX','Aster'].includes(name))return C.dex(name,size);
 const f=LOGO[name.toLowerCase()];
 if(f&&(!window.ASSETS||ASSETS[f]))return `<img src="${A(f)}" alt="${esc(name)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex:none">`;
 return C.dex(name,size)}
const box=(inner,o={})=>`<div style="background:#fff;border-radius:8px;padding:${o.p??16}px;${o.style||''}">${inner}</div>`;
const amtColor=v=>/^[−-]/.test(v)?'var(--error)':v.startsWith('+')?'var(--blue)':'var(--text-primary)';
const sel=(label,o={})=>`<div class="row between" style="height:40px;border:${o.focus?'2px solid var(--blue)':'1px solid var(--input-border)'};border-radius:4px;padding:0 ${o.focus?11:12}px;background:#fff;cursor:pointer"${o.go?` data-go="${o.go}"`:''}><span class="b2">${label}</span>${ic('arrow-drop-down','ic20')}</div>`;
const chk=on=>`<span class="chk${on?' on':''}"><i></i></span>`;

// ================= 캐시백 요약 =================
// 유형 이름(REQ-367 · G-365): 국문 필터 캐시백/이벤트 리워드/출금 금액, 일별 행 국문 `선물 거래 캐시백`(REQ-371)
const TY={
 ex:()=>T('Exchange Cashback','선물 거래 캐시백'),
 claim:()=>T('Claim Amount','출금 금액'),
};
const rowsNormal=()=>[
 {p:'Bitget',id:'UID ******7462',t:TY.ex(),v:'+25.00'},
 {p:'Lighter',w:W_LIGHTER,t:TY.ex(),v:'+12.40'},
 {p:'Bitget',id:'UID ******7462',t:TY.claim(),v:'−20.00'},
];
// 상태별 표본(Figma 값 그대로. 캘린더 칸 = 그날 순액 REQ-378)
function sumData(st){
 const base={month:'May 2026',today:26,sel:26,days:{5:['−15.00'],12:['−11.80'],26:['+17.40']},card:['+50.00','−40.00','+10.00'],rows:rowsNormal()};
 const big={days:{5:['+12.10K','−20.00'],6:['+150.01M'],26:['+150.00']},card:['+150.02M','−40.00','+150.02M']};
 switch(st){
  case 'otherDay':return {...base,sel:12,rows:[{p:'Bitget',id:'UID ******7462',t:TY.claim(),v:'−11.80'}]};
  case 'eventDay':return {...base,...big,rows:[
   {p:'Bitget',id:'UID ******7462',t:'BTC Prediction Reward',v:'+50.00'},
   {p:'Bitget',id:'UID ******7462',t:'Cashback Challenge Reward',v:'+50.00'},
   {p:'EdgeX',w:W_EDGEX,t:'Cashback Challenge Reward',v:'+50.00'}]};
  case 'noDay':return {...base,...big,days:{5:['+12.10K','−20.00'],6:['+150.01M']},rows:[]};
  case 'noMonth':return {...base,days:{},card:null,rows:[]};
  case 'returned':return {...base,days:{...base.days,26:['+137.40']},rows:[...rowsNormal(),{p:'EdgeX',w:W_EDGEX,t:'Withdrawal returned',v:'+120.00'}]};
  case 'lighter':return {...base,sel:25,today:26,days:{...base.days,25:['+30.00']},rows:[{p:'Lighter',w:W_LIGHTER,t:'Credited',v:'+30.00'},{p:'Lighter',w:W_LIGHTER,t:'Withheld',v:'5.00',muted:true}]};
  case 'oneEmpty':return {...base,days:{},card:null,rows:[],acct:true};
  case 'old':return {...base,month:'Oct 2025',today:null,sel:14,days:{14:['+8.20'],21:['+3.10']},card:['+11.30','0.00','+11.30'],rows:[{p:'Bitget',id:'UID ******7462',t:TY.ex(),v:'+8.20'}]};
  default:return base;
 }
}
// 2026-05 달력(1일 = 금요일). 2025-10(1일 = 수요일, 31일)
function calendar(d){
 const may=d.month==='May 2026',first=may?5:3,len=31;
 const cells=[];for(let i=0;i<first;i++)cells.push('<span></span>');
 for(let n=1;n<=len;n++){
  const future=may&&n>d.today;const on=n===d.sel;
  const vals=(d.days[n]||[]).map(v=>`<span class="tnum" style="font-size:${mo()?9:11}px;line-height:1.3;color:${amtColor(v)}">${v}</span>`).join('');
  cells.push(`<div class="col" style="align-items:center;gap:2px;min-height:${mo()?70:57}px;padding-top:4px"><span class="b2 tnum" style="width:36px;height:36px;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;${on?'border:1px solid var(--text-primary);':''}${future?'color:var(--text-disabled)':''}">${n}</span>${vals}</div>`)}
 const wk=['S','M','T','W','T','F','S'].map(x=>`<span class="b2 c2" style="text-align:center">${x}</span>`).join('');
 return `<div style="display:grid;grid-template-columns:repeat(7,minmax(0,1fr));row-gap:4px">${wk}${cells.join('')}</div>`}
function monthCard(d){return `<div>${monthCard0(d)}</div>`}
function monthCard0(d){
 const cap=`<p class="c2" style="margin:8px 0 0;font-size:${mo()?10:11}px;line-height:1.4">All amounts are shown in USDT. Cashback a DEX pays in USDC is shown 1:1 in USDT. Each calendar day shows the net amount.</p>`;
 const head=`<span class="b2 semi">Monthly total cashback</span>`;
 if(!d.card)return `<div style="border:1px solid var(--divider);border-radius:8px;padding:16px" class="col">${head}<span class="cap c2">There is no cashback history for this month.</span></div>${cap}`;
 const [r,w,n]=d.card;
 const line=(k,v,c)=>`<div class="row between"><span class="cap c2">${k}</span><span class="b2 semi tnum" style="color:${c}">${v} USDT</span></div>`;
 return `<div style="border:1px solid var(--divider);border-radius:8px;padding:16px" class="col">${head}${line('Received',r,'var(--blue)')}${line('Withdrawn',w,w==='0.00'?'var(--text-primary)':'var(--error)')}<hr class="divider" style="margin:4px 0"><div class="row between"><span class="cap c2">Net</span><span class="sub1 semi tnum">${n} USDT</span></div></div>${cap}`}
function dayRow(r){
 const acct=r.w?`Wallet ${mo()?short(r.w):r.w}`:r.id;
 const v=r.pending?'—':`${r.v} USDT`;
 return `<div class="row g12" style="border:1px solid var(--divider);border-radius:8px;padding:10px 12px;background:#fff">${logo(r.p,24)}<div class="col grow" style="gap:2px"><span class="b2 med" style="font-size:13px">${r.t}</span><span class="cap c2" style="word-break:break-all">${r.p} ${acct}</span></div><span class="b2 tnum" style="white-space:nowrap;font-size:13px;color:${r.muted||r.pending?'var(--text-disabled)':amtColor(r.v)}">${v}</span></div>`}
function dayList(d,st){
 const date=d.month==='May 2026'?`2026/05/${String(d.sel).padStart(2,'0')}${d.sel===d.today?' (Today)':''}`:`2025/10/${d.sel}`;
 const empty=st==='oneEmpty'?T('No cashback activity for this account yet.','이 거래 계정에는 아직 캐시백 내역이 없어요.'):'No cashback activity yet.';
 const list=d.rows.length?`<div class="col">${d.rows.map(dayRow).join('')}</div>`:`<div class="b2 c2 center" style="padding:56px 0">${empty}</div>`;
 return `<div class="col" style="gap:4px"><span class="cap c2">Date</span><span class="b2 med">${date}</span></div>${list}`}
// 필터 · 드롭다운 (CS6)
const EX_OPTS=()=>[['h',T('Range','범위')],['o',T('All','전체')],['o','CEX 전체'],['o','DEX 전체',true],['h','CEX'],['o','Bitget (2 UIDs)'],['o','OKX (1 UID)'],['h','DEX'],['o',T('EdgeX (1 wallet)','EdgeX (1 지갑)')],['o',T('Aster (2 wallets)','Aster (2 지갑)')]];
function menu(items){return `<div style="background:#fff;border-radius:4px;box-shadow:var(--elev8);padding:8px 0;margin-top:4px;position:relative;z-index:3">${items}</div>`}
const mItem=(label,on,o={})=>`<div class="row between" style="padding:${o.h?'6px 16px 2px':'13px 16px'};${o.sel?'background:rgba(0,49,198,.08)':''}">${o.h?`<span class="cap c2 med">${label}</span>`:`<span class="row g8 b1">${o.logo||''}${label}</span>${o.box?chk(on):''}`}</div>`;
function filters(st){
 const exLabel=st==='dexRange'?'DEX 전체':T('All Exchanges','모든 거래소');
 const acLabel=st==='oneEmpty'?`Lighter Wallet ${short(W_LIGHTER)}`:T('All Accounts','모든 거래 계정');
 let ex=sel(exLabel,{focus:st==='dexRange'}),ac=sel(acLabel,{focus:st==='account'}),ty=sel(T('All Types','모든 캐시백 유형'),{focus:st==='types'&&!mo()});
 if(st==='dexRange')ex+=menu(EX_OPTS().map(([k,l,s])=>mItem(l,false,{h:k==='h',sel:s})).join(''));
 if(st==='account')ac+=menu([mItem(T('All Accounts','모든 거래 계정'),true,{box:1}),
  mItem('Bitget UID 528633991',false,{box:1,logo:logo('Bitget',20)}),mItem('Bitget UID 528622214',false,{box:1,logo:logo('Bitget',20)}),
  mItem('Bybit UID 135587874',false,{box:1,logo:logo('Bybit',20)}),mItem('OKX UID 534682053632420829',false,{box:1,logo:logo('OKX',20)}),
  mItem(`Lighter Wallet ${short(W_LIGHTER)}`,false,{box:1,logo:logo('Lighter',20)})].join(''));
 const types=()=>[mItem(T('All Types','모든 캐시백 유형'),!mo(),{box:1}),mItem(T('Exchange Cashback','캐시백'),mo(),{box:1}),mItem(T('Event Reward','이벤트 리워드'),mo(),{box:1}),mItem(T('Claim Amount','출금 금액'),false,{box:1})].join('');
 if(st==='types'&&!mo())ty+=menu(types());
 // Reset: Figma CS1 회색(비활성 모양) — 필터가 All이면 되돌릴 것이 없음
 const btns=`<div class="row" style="gap:8px"><button class="btn contained black md" disabled style="width:87px;height:42px">${T('Reset','재설정')}</button><button class="btn contained primary md grow" style="height:42px">${T('Search','검색')}</button></div>`;
 return `<div class="col" style="gap:16px">${ex}${ac}${ty}${btns}</div>`;
}
function typesSheet(){
 const it=(l,on)=>`<div class="row between" style="padding:15px 20px"><span class="b2">${l}</span>${chk(on)}</div>`;
 return `<div style="position:absolute;left:0;right:0;bottom:0;background:#fff;border-radius:16px 16px 0 0;z-index:5;padding-bottom:16px"><div class="sheet-grab" style="margin-top:10px"></div>
  <div class="col center" style="gap:4px;padding:24px 16px 16px"><span class="b2 semi">Select Cashback Type</span><span class="cap c2" style="font-size:13px">You may select more than 1</span></div>
  ${it(T('All Types','모든 캐시백 유형'),false)}${it(T('Exchange Cashback','캐시백'),true)}${it(T('Event Reward','이벤트 리워드'),true)}${it(T('Claim Amount','출금 금액'),false)}</div>`}

R.screen({id:'summary.main',group:'summary',title:'캐시백 요약',route:'/cashback-summary',fu:['FU-060','FU-061','FU-062'],
 shell:{accent:true,back:'home.main',moTitle:['Cashback Summary','캐시백 요약'],noNav:true},
 states:[
  {id:'normal',label:'월 보기 — 필터 · 캘린더 · 월간 카드 · 일별 목록 (CS1)',figma:{pc:'28960:127133',mo:'29065:6687'},note:'V2.2 hist/SUM#normal · Figma CS1 표본값'},
  {id:'otherDay',label:'다른 날 선택 (CS2)',figma:{pc:'28960:127139'},note:'Figma에만 있는 상태(날짜 선택은 REQ-371 기본 동작). CS2 프레임은 하단이 잘려 일별 목록은 CS1 형식으로 구성'},
  {id:'eventDay',label:'이벤트 리워드 날 · 큰 금액 축약 (CS3)',figma:{pc:'28960:127145'},note:'Figma에만 있는 상태(이벤트 리워드 행 REQ-371). 26일 칸은 Figma `+5.00` 대신 일별 순액 +150.00(REQ-378)'},
  {id:'dexRange',label:'거래소 범위 DEX 전체',note:'V2.2 hist/SUM#dexRange — 거래소 드롭다운은 Figma 없음(CS6에 계정·유형만)'},
  {id:'account',label:'계정 필터 드롭다운 (CS6 All Accounts)',figma:{pc:'29265:120180'},note:'V2.2 hist/SUM#account · 좁은 목록이라 지갑은 축약(REQ-366 — 전체 보기·복사 가능)'},
  {id:'types',label:'유형 다중 선택 (CS6 All Types)',figma:{pc:'29265:120387',mo:'29065:6366'},note:'V2.2 hist/SUM#types · 유형값은 정책(REQ-367·G-365·G-418): Exchange Cashback / Event Reward / Claim Amount'},
  {id:'returned',label:'Withdrawal returned 행',note:'V2.2 hist/SUM#returned · G-113 확정: 복원된 날 `+` 부호 행'},
  {id:'lighter',label:'Lighter Credited · Withheld (온보딩 후)',note:'V2.2 hist/SUM#lighter · G-181 정산 월요일 날짜로 기록 · G-059 상태명 · Withheld는 합계 제외. Lighter 보류(G-100 온보딩 때 재확인)'},
  {id:'noMonth',label:'활동 없는 달 (CS5)',figma:{pc:'28960:127157'},note:'V2.2 hist/SUM#noMonth · REQ-375'},
  {id:'noDay',label:'활동 없는 날 · 큰 금액 (CS4)',figma:{pc:'28960:127151'},note:'V2.2 hist/SUM#noDay · REQ-375'},
  {id:'oneEmpty',label:'계정 1개 선택 빈 상태',note:'V2.2 hist/SUM#oneEmpty · G-180 확정 문구'},
  {id:'old',label:'180일 넘은 달',note:'V2.2 hist/SUM#old · REQ-374'},
 ],
 render(st){
  const d=sumData(st);
  const delayed='';   // 반영 지연 표시 없음(결정 10차 「캐시백 요약 반영 지연」)
  const old=st==='old'?`<p class="cap c2" style="margin:8px 0 0">${T('DEX data covers the last 180 days and is not backfilled.','DEX 데이터 조회 범위는 최근 180일 — 백필 안 함')}</p>`:'';
  const monthHead=`<div class="row between"><span class="row g4 b2 semi">${d.month}${ic('arrow-drop-down','ic20')}</span><span class="row g4"><button class="icon-btn" style="padding:6px">${ic('chevron-left','ic20')}</button><button class="icon-btn" style="padding:6px">${ic('chevron-right','ic20')}</button></span></div>`;
  const cal=`${monthHead}${calendar(d)}${old}`;
  if(mo()){
   const sheet=st==='types'?`<div style="position:absolute;inset:0;background:rgba(0,0,0,.4);z-index:4"></div>${typesSheet()}`:'';
   return `<div style="position:relative;padding:16px 16px 32px;min-height:740px" class="col g16">${delayed}${filters(st)}<div class="col g16" style="margin-top:8px">${cal}</div>${monthCard(d)}<div class="col g12 mt16">${dayList(d,st)}</div>${sheet}</div>`;
  }
  return `<div style="max-width:1088px;margin:0 auto;padding:88px 0 120px">${delayed?`<div class="mb24">${delayed}</div>`:''}
   <div style="display:grid;grid-template-columns:347px minmax(0,1fr);gap:24px;align-items:start">
    ${box(filters(st))}
    ${box(`<div class="col" style="gap:24px">${cal}${monthCard(d)}<div class="col g12">${dayList(d,st)}</div></div>`,{p:24})}
   </div></div>`;
 }});

// ================= 캐시백 랭킹 =================
// Figma RK1~RK3: 혜택 화면 위 오른쪽 사이드 패널 `My Cashback Ranking`. 행 = 거래소 · UID 또는 Wallet · 순위(금액 없음, REQ-383)
const RK_ROWS=[{p:'Bitget',id:'UID 7605865687'},{p:'Bybit',id:'UID 08547939171'},{p:'Lighter',w:W_LIGHTER}];
const RK_ROWS_MO=[{p:'Bitget',id:'UID 7605865687'},{p:'Bybit',id:'UID 08547939171'},{p:'EdgeX',w:W_EDGEX}];
const back=()=>`<img src="${A('ic-arrow-forward.svg')}" alt="" class="ic" style="transform:rotate(180deg);opacity:.56">`;
function rkPanel(st){
 const rows=(mo()?RK_ROWS_MO:RK_ROWS).map((r,i)=>{const rank=st==='normal'?['1st','2nd','3rd'][i]:'–';
  const id=r.w?`<span data-go="ranking.main:wallet" style="cursor:pointer">Wallet ${short(r.w)}</span>`:r.id;
  return `<div class="row g12" style="background:#fff;border:1px solid var(--divider);border-radius:8px;padding:12px 14px;box-shadow:0 1px 3px rgba(0,0,0,.06)">${logo(r.p,32)}<div class="col grow" style="gap:0"><span class="b2 semi">${r.p}</span><span class="cap c2">${id}</span></div><span class="b2">${rank}</span></div>`}).join('');
 const body=st==='empty'?`<div class="b2 c2 center" style="padding:${mo()?200:240}px 0 0">There are currently no eligible accounts for ranking.</div>`
  :`<div class="col center" style="gap:12px;align-items:center;margin-top:${mo()?24:4}px"><span style="background:var(--blue);color:#fff;border-radius:12px;padding:2px 8px;font-size:11px;font-weight:500">May 2026</span><span class="h6 bold" style="font-size:${mo()?20:18}px">My Cashback Ranking</span><span class="b2 c2" style="margin-top:-6px">Rankings are updated daily at 00:01</span></div><div class="col" style="gap:8px;margin-top:24px">${rows}</div><div class="col" style="gap:4px;margin-top:16px"><span class="cap c2">${T('Cashback under 0.01 USDT isn’t included in the rankings.','캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다.')}</span><span class="cap c2">${T('Ranking rewards can’t be claimed on their own. They’re matched 1:1 with the same account’s cashback.','랭킹 리워드만으로는 출금할 수 없어요. 같은 계정의 캐시백과 1:1로 매칭돼요.')}</span></div>`;
 return `<div style="background:var(--bg-accent);${mo()?'min-height:812px':'width:375px;height:100%;min-height:900px'};padding:${mo()?'56px 16px':'20px 16px'};box-shadow:var(--elev8)"><button class="icon-btn" data-go="benefits.list" style="padding:4px">${back()}</button>${body}</div>`}
function rkOverlay(inner){
 if(mo())return inner;
 return `<div style="position:relative;min-height:900px">${renderInner('benefits.list',true)}<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:20;display:flex;justify-content:flex-end">${inner}</div></div>`}
// 월간 순위 — 기존 순위표 「페이지」는 없음. 혜택 페이지의 기존 랭킹 카드 [MAX-468] MAXOP-805(mobile 25849:1340946 · PC 26651:60616)를 그대로 쓰고
// 행에 CEX UID와 DEX 지갑을 함께 넣는다(REQ-379). 행 = 로고28 · 이름/식별자(12) · 순위(12 medium) · 보상 메시지(초록 트로피 / 회색)
function rkBoard(st){
 const dex=st==='dex';
 const all=[{p:'Bitget',id:'UID 1210910640',rank:'2nd place',msg:'win'},{p:'EdgeX',w:W_EDGEX,rank:'Top 100%',msg:'more'},{p:'OKX',id:'UID 617755618866586639',rank:'-'},{p:'Aster',w:W_ASTER,rank:'-'}];
 const rows=(dex?all.filter(r=>r.w):all).map(r=>{const id=r.w?`Wallet ${short(r.w)}`:r.id;
  const msg=r.msg==='win'?`<div class="row" style="gap:4px;padding-left:36px"><img src="${A('sum-ic-trophy.svg')}" style="width:16px;height:16px" alt=""><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--success)">You're in the reward zone.</span></div>`
   :r.msg==='more'?`<div style="padding-left:36px;font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">Trade more to get a reward.</div>`:'';
  return `<div class="col" style="gap:4px"><div class="row" style="gap:8px">${logo(r.p,28)}<div class="col grow" style="gap:0;min-width:0;font-size:12px"><span style="font-weight:500;line-height:1.4">${r.p}</span><span style="line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${id}</span></div><span style="font-size:12px;line-height:20px;letter-spacing:.14px;font-weight:500">${r.rank}</span></div>${msg}</div>`}).join('');
 const card=`<div style="background:#fff;border-radius:8px;padding:16px;width:${mo()?'100%':'928px'}" class="col g16"><div class="col" style="gap:4px"><span class="b2 semi">Your May Cashback Ranking</span><span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">Rankings are updated daily at 00:01</span></div><div class="col" style="gap:16px">${rows}</div></div>`;
 const body=`<div style="padding:${mo()?'16px':'40px 0 80px'};display:flex;flex-direction:column;align-items:center;gap:16px">${card}
  ${C.note(`[기존 MAX-468] MAXOP-805 랭킹 카드(25849:1340946 · 26651:60616) 재사용 — 순위표 페이지 디자인 없음. ${dex?'DEX 칩 필터 디자인 없음 — 같은 카드에서 DEX 지갑 행만 남김. ':''}V2.2 rk/RANK 내용 중 디자인 없는 것: 전체/CEX/DEX 칩 · Monthly Top Rewards 박스(1st 100 · 2nd 50 · 3rd 20 · top 10% 10 USDT, 이벤트 리워드로 지급 · 매칭 적용). 순위 기준 = 그달 커미션 캐시백 적립액(REQ-380), 금액 미표시(REQ-383)`)}</div>`;
 if(mo())return `${moTop(T('Cashback Ranking','캐시백 랭킹'),'home.main')}<div class="page accent">${body}</div>${footer()}`;
 return `${gnb('rewards')}<div class="page accent">${body}</div>${footer()}`}

R.screen({id:'ranking.main',group:'summary',title:'캐시백 랭킹',route:'/benefits (My Cashback Ranking 패널)',fu:['FU-063'],shell:false,closeTo:'benefits.list',
 states:[
  {id:'normal',label:'순위 매겨짐 (RK2)',figma:{pc:'28960:127207'},note:'V2.2 rk/RANK#normal(사이드 패널 부분) · 행에 금액 없음(REQ-383) · CEX는 UID, DEX는 Wallet 접두(Figma 메모)'},
  {id:'unranked',label:'순위 미집계 – (RK1)',figma:{pc:'28960:127201',mo:'29065:6980'},note:'Figma에만 있는 상태 — Figma 메모 「순위 미집계는 –로 표시」, REQ-383 순위 밖 `–`'},
  {id:'empty',label:'자격 계정 없음 (RK3)',figma:{pc:'28960:127213',mo:'29065:4998'},note:'V2.2 rk/RANK#empty · REQ-383'},
  {id:'wallet',label:'지갑 주소 전체 보기',figma:{pc:'28984:126296'},note:'Figma `Wallet address` 행(3종 중 0x91c4…a07b) — 축약 지갑의 전체 주소 보기(REQ-366 원칙)'},
  {id:'board',label:'월간 순위 CEX+DEX 한 목록 (혜택 랭킹 카드)',figma:{pc:'26651:60616',mo:'25849:1340946'},note:'[기존 MAX-468] MAXOP-805 랭킹 카드. V2.2 rk/RANK#normal(순위표 부분)'},
  {id:'dex',label:'순위표 DEX 칩',note:'V2.2 rk/RANK#dex — 칩 필터 디자인 없음. 카드는 [기존 MAX-468] MAXOP-805 재사용'},
 ],
 render(st){
  if(st==='board'||st==='dex')return rkBoard(st);
  if(st==='wallet'){
   const dlg=`<div class="dialog" style="width:510px;padding:20px 20px 12px;text-align:left"><div class="h6" style="font-size:20px">Wallet address</div><div class="b1" style="word-break:break-all">${W_ASTER.replace('0x','0×')}</div><div class="row" style="justify-content:flex-end"><button class="btn text primary md" data-go="ranking.main:normal">Close</button></div></div>`;
   return `<div style="position:relative;min-height:${mo()?812:900}px">${rkOverlay(rkPanel('normal'))}<div class="scrim center" style="z-index:30;align-items:center">${dlg}</div></div>`;
  }
  return rkOverlay(rkPanel(st));
 }});
