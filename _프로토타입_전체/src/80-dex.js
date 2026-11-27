// 8. DEX 개요 · 상세 (FU-049 ~ FU-059)
// Figma: DEX(revision) › "DEX — DEX overview Web" (OA keys concept · list view · 8 partner DEXs overflow),
//        "DEX — DEX overview Mobile [Exploration A · aw…]", "DEX — DEX detail Web [Light]" (D1~D6),
//        "DEX — DEX detail Mobile [Light]", "DEX 상세 · 회원 상태별 오퍼"
// 원칙: Figma 인스턴스 문구 > V2.2 문구 > C.tbd. 정책(FU 명세)과 다르면 정책을 따른다.
const mo=()=>S.vp==='mo';
const DTM='Decentralised Exchanges';

// ---------- 거래소 레코드 표본 (요율은 레코드 값 — G-045 실값 회신 전 표본) ----------
// list = Without TetherMax, taker/maker = After discount(할인 후 수수료), rate = 헤드라인 캐시백율
const DX={
 lighter:{id:'lighter',name:'Lighter',rate:20,tiers:true,taker:.028,maker:.004,cur:'USDC',
  desc:'Lighter is a decentralized trading platform designed for security, scale, and performance in a zero-fee trading environment. It is the first exchange to offer verifiable order matching and liquidations while delivering performance comparable to traditional exchanges.',
  chips:['Crypto','Tokenised Equity','Pre-IPO','Commodities','Indices & ETFs','Forex'],dep:['Fiat','Crypto'],
  why:['Zero trading maker and taker fees forever on standard accounts','80+ markets, up to 50x leverage','Earn weekly points, potential LIT airdrop rewards when you trade','CEX level speed millisecond execution with DeFi security']},
 apex:{id:'apex',name:'ApeX',rate:30,list:.05,taker:.05,maker:.02,cur:'USDT',
  desc:'ApeX Omni is a self-custodial, multichain perpetual DEX. Trade 100+ crypto perpetuals, US stock perps and prediction markets with up to 100x leverage, zero gas fees, and cross-chain deposits and withdrawals.',
  chips:['Crypto','Tokenised Equity','Indices & ETFs','Commodities'],dep:['Fiat','Crypto'],
  why:['Zero gas fees with one-click trading, no wallet approvals','100+ perpetual markets, up to 100x leverage','Trade crypto, US stock perps & prediction markets','Earn trade-to-earn rewards every time you trade']},
 edgex:{id:'edgex',name:'EdgeX',rate:30,list:.06,taker:.04,maker:.015,cur:'USDT',
  desc:'EdgeX is a high-performance perpetual DEX built on StarkEx, combining CEX-level speed with the self-custody and security of Ethereum. Trade 160+ crypto perpetuals with up to 100x leverage and zero gas fees.',
  chips:['Crypto'],dep:['Crypto'],
  why:['Zero gas fees on trades, with low tiered maker/taker fees','160+ perpetual markets, up to 100x leverage','Self-custody, secured by StarkEx ZK proofs on Ethereum','CEX-level speed: sub-10ms latency, up to 200K TPS']},
 aster:{id:'aster',name:'Aster',rate:20,list:.035,taker:.035,maker:0,cur:'USDT',
  desc:'Aster is a multichain perpetual DEX on BNB Chain, Ethereum and Arbitrum. Trade crypto, tokenized stocks, gold and forex onchain with up to 1001x leverage, 0% maker fees, and yield-bearing collateral such as USDF and asBNB.',
  chips:['Crypto','Tokenised Equity','Commodities','Forex'],dep:['Crypto'],
  why:['0% maker fees on all perpetual markets','Trade crypto, stocks, gold & forex perps onchain','Up to 1001x leverage on BTC in Simple Mode','Multichain: BNB Chain, Ethereum & Arbitrum']},
};
// Figma "8 partner DEXs (overflow)" 전용 — 레이아웃 확장 검증용 이름·요율(Figma 그대로)
const EXTRA=[{name:'Hyperliquid',rate:30},{name:'dYdX',rate:20},{name:'GMX',rate:20},{name:'Drift',rate:20}];
const ORDER=['apex','edgex','aster'];                 // 활성 DEX(레코드 전역 순서). Lighter는 온보딩 보류
const ORDER_L=['lighter','apex','edgex','aster'];      // Lighter 온보딩 후
const DEFI={tvl:'$770.86M',vol:'$6.8M'};
const pct=n=>n.toFixed(4)+'%';
const fin=(d,k)=>(d[k]*(1-d.rate/100));                // 테더맥스 캐시백 후 수수료
// 오퍼 박스 단계(REQ-339): `After discount`는 할인율 > 0일 때만. Taker = list(할인 전) > taker(할인 후)일 때 3행. Maker는 할인 전 값이 데이터에 없어 2행
const stageRows=(d,maker)=>{const k=maker?'maker':'taker';const disc=!maker&&d.list!=null&&d.list>d.taker;
 return disc?[{key:'without',label:'Without TetherMax',v:d.list,strike:1},{key:'discount',label:'After discount',v:d.taker},{key:'cashback',label:'After cashback',v:fin(d,k)}]
  :[{key:'without',label:'Without TetherMax',v:d[k],strike:1},{key:'cashback',label:'After cashback',v:fin(d,k)}]};
const fl2=n=>Math.floor(n*100+1e-6)/100;
const usd=n=>'$'+fl2(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const usdS=n=>Number.isInteger(fl2(n))?'$'+fl2(n):usd(n);
const ext=()=>`<img src="${A('dex-ov-ic-open.svg')}" style="width:20px;height:20px" alt="">`;
const wrap=(inner,w=1200)=>`<div style="width:100%;max-width:${w}px;margin:0 auto;padding:0 ${mo()?16:0}px;box-sizing:border-box">${inner}</div>`;
const sec=(inner,o={})=>`<section style="padding:${o.pad||(mo()?'32px 0':'48px 0')};${o.bg?`background:${o.bg};`:''}">${inner}</section>`;
const eyebrow=(t,c='var(--blue)')=>`<span style="font-size:14px;line-height:24px;font-weight:500;letter-spacing:.17px;color:${c}">${t}</span>`;
const outlinedP=(label,o={})=>`<button class="btn outlined primary ${o.size||'lg'}${o.full?' full':''}" style="border-color:var(--blue)"${o.go?` data-go="${o.go}"`:''}>${label}</button>`;

// =====================================================================
// DEX 개요 (/dex) — FU-049 ~ FU-053
// =====================================================================
function ovHero(list){
 const marks=`<div style="display:flex">${list.map((id,i)=>`<span style="margin-right:${i<list.length-1?-9:0}px;border-radius:50%;box-shadow:0 0 0 2px #fff">${C.dex(DX[id].name,37)}</span>`).join('')}</div>`;
 // Figma 최신 OA(29361:137628 · 모바일 29363:135072): 제목 → 마크 → 파트너 수 → 설명(한 줄) → 버튼
 const copy=`<div class="col" style="gap:${mo()?16:32}px">
  <h1 style="margin:0;max-width:480px;font-weight:400;font-size:${mo()?34:60}px;line-height:1.2;letter-spacing:-.5px">Trade onchain,${mo()?' ':'<br>'}keep your cashback</h1>
  <div class="col" style="gap:8px">${marks}<div class="col" style="gap:2px"><span class="b2 semi">${list.length} partner DEXs you can start earning Cashback with</span><span class="b2 c2">${T('Trade with your own wallet on the DEX. Paste your wallet address into TetherMax and we pay your cashback into your TetherMax balance.','내 지갑으로 DEX에서 거래하고, 테더맥스에 지갑 주소만 붙여넣으면 캐시백을 테더맥스 잔액으로 드려요.')}</span></div></div>
  <div class="row" style="gap:16px">${C.btn('DEX Overview',{cls:mo()?'grow':''}).replace('<button','<button data-scroll-to="dex-venues"')}${outlinedP('Guide to DEX').replace('<button','<button data-scroll-to="dex-steps"')}</div></div>`;
 const risk=`<p class="cap c2" style="margin:0;max-width:720px">※ Decentralized trading carries risks, including smart contract vulnerabilities, slippage, MEV, and potential loss of funds. Please conduct your own research prior to trading onchain.</p>`;
 if(mo())return `<section style="background:linear-gradient(180deg,#eef2f8 0%,#e6edf8 70%,#fff 100%)"><div style="height:300px;background:url(${A('dex-ov-hero.jpg')}) 78% 30%/auto 420px no-repeat"></div><div class="col" style="gap:24px;padding:0 16px 40px">${copy}${risk}</div></section>`;
 return `<section style="position:relative;height:810px;background:#eef2f8 url(${A('dex-ov-hero.jpg')}) center/cover no-repeat"><div style="position:absolute;left:max(120px, calc((100% - 1440px) / 2 + 120px));top:150px">${copy}</div><div style="position:absolute;left:max(120px, calc((100% - 1440px) / 2 + 120px));bottom:20px">${risk}</div></section>`;   // 넓은 화면: 1440 틀 가운데(실사이트 규칙)
}
function ovGlance(list,c){
 // Figma 최신 OA(29361:136089) glance 카드: 위 줄(로고·이름 / Up to) + TVL · 24H Vol 칸 두 개(115×69). DefiLlama 24시간 실패면 칸 숨김(REQ-323)
 const gbox=(k,v)=>`<div class="col" style="flex:1 1 0;min-width:0;gap:4px;border:1px solid var(--divider);border-radius:8px;padding:10px 12px"><span class="cap c2" style="line-height:20px">${k}</span><span class="b1 semi" style="line-height:23px">${v}</span></div>`;
 // 모바일(29363:135072): 카드 230폭, TVL · 24H Vol 칸이 세로로(180×69, 간격 8), 카드 간격 12
 const gstat=c==='defiHidden'?'':`<div class="${mo()?'col':'row'}" style="gap:8px">${gbox('TVL',DEFI.tvl)}${gbox('24H Vol',DEFI.vol)}</div>`;
 const card=(name,rate,mark)=>`<div style="flex:${mo()?'0 0 230px':c==='overflow'?'0 0 288px':'1 1 0'};min-width:0;background:#fff;border:1px solid var(--divider);border-radius:16px;padding:24px;display:flex;flex-direction:column;gap:14px">
  <div style="display:flex;align-items:center;justify-content:space-between"><div class="row" style="gap:12px">${mark}<span class="b1 semi">${name}</span></div>
  <div class="col" style="gap:0;align-items:flex-end"><span class="b1 c2">Up to</span><span style="font-size:34px;line-height:1.235;font-weight:700;letter-spacing:.25px;color:var(--blue)">${rate}%</span></div></div>${gstat}</div>`;
 let cards=list.map(id=>card(DX[id].name,DX[id].rate,C.dex(DX[id].name,32)));
 if(c==='overflow')cards=cards.concat(EXTRA.map(x=>card(x.name,x.rate,C.dex(x.name,32))));
 const sub=c==='defiHidden'?'':`<span class="cap" style="font-weight:500">TVL and 24H volume from DefiLlama, as of ${c==='defiStale'?'13 Oct 2026':'14 Oct 2026'}</span>`;
 const fade=c==='overflow'&&!mo()?`<div style="position:absolute;left:0;top:0;bottom:0;width:80px;background:linear-gradient(90deg,#fff,rgba(255,255,255,0))"></div><div style="position:absolute;right:0;top:0;bottom:0;width:80px;background:linear-gradient(270deg,#fff,rgba(255,255,255,0))"></div>`:'';
 const row=`<div style="position:relative"><div style="display:flex;gap:${mo()?12:16}px;overflow-x:${mo()||c==='overflow'?'auto':'visible'};${c==='overflow'&&!mo()?'padding:0 40px;':''}scrollbar-width:none">${cards.join('')}</div>${fade}</div>`;
 const head=`<div style="display:flex;${mo()?'flex-direction:column;gap:4px':'align-items:flex-end;justify-content:space-between'}"><div class="col" style="gap:0"><span class="h5" style="line-height:1.334">Partner DEXs at a glance</span>${sub}</div><a class="b1 semi cb" data-go="hub.main" style="cursor:pointer">Compare monthly cashback on the Cashback Hub</a></div>`;
 return `<section style="background:#fff;padding:${mo()?'40px 0 24px':'56px 0 24px'}">${wrap(`<div class="col" style="gap:20px">${head}${row}</div>`)}</section>`;
}
function ovBanner(){
 const dots=`<img src="${A('dex-ov-dots.svg')}" style="width:44px;height:6px;margin:0 auto" alt="">`;
 const copy=`<div class="col" style="gap:24px;${mo()?'padding:24px 16px':'padding:0 48px;height:350px;justify-content:center;max-width:521px'}">
  <div class="row" style="gap:12px">${C.dex('Aster',40)}<span style="font-size:24px;line-height:1.334;font-weight:600;color:#fff">Aster</span></div>
  <div class="col" style="gap:0"><span style="font-size:24px;line-height:1.334;font-weight:700;color:#fff">Trade with Aster and get Cashback!</span><span style="font-size:20px;line-height:1.6;font-weight:500;color:#e6e7e9">Win up to 2,000,000 USDT</span></div>
  <div>${C.btn('Join Now')}</div></div>`;
 const box=mo()?`<div style="background:#151515;border-radius:8px;overflow:hidden"><div style="height:120px;background:url(${A('dex-ov-banner-mo.jpg')}) center/cover"></div>${copy}</div>`
  :`<div style="background:#151515 url(${A('dex-ov-banner.jpg')}) right center/auto 100% no-repeat;border-radius:8px;overflow:hidden;height:350px">${copy}</div>`;
 return `<section style="background:#fff;padding:0 0 ${mo()?8:24}px">${wrap(`<div class="col" style="gap:24px">${box}${dots}</div>`)}${C.note('프로모 배너(DX-14) — Figma 그대로. 배너는 어드민 DEX Landing Page 프로모 배너 영역에서 관리(G-156). 게시 슬라이드 0개면 렌더하지 않음(상태 <code>noBanner</code>)')}</section>`;
}
function venueCard(d,c,i){
 const box=(k,v)=>`<div style="flex:1 1 0;min-width:0;border:1px solid var(--divider);border-radius:8px;padding:10px 12px" class="col g4"><span class="cap c2">${k}</span><span class="b2 semi">${v}</span></div>`;
 const stats=[box('Final Taker',pct(fin(d,'taker'))),box('Final Maker',pct(fin(d,'maker')))];
 if(c!=='defiHidden')stats.push(box('TVL',DEFI.tvl),box('24H Vol',DEFI.vol));
 if(mo())return venueCardMo(d,c);
 const left=i%2===0;
 const bd=mo()?'padding:24px 0;border-bottom:1px solid var(--divider)':`padding:40px ${left?'40px 40px 0':'0 40px 40px'};${left?'border-right:1px solid var(--divider);':''}`;
 return `<div class="col" data-m-lift style="gap:16px;${bd}">
  <div class="row between"><div class="row" style="gap:12px">${C.dex(d.name,40)}<span class="h5">${d.name}</span></div><div class="col" style="gap:0;align-items:flex-end"><span class="cap c2">Cashback up to</span><span style="font-size:34px;line-height:1.235;font-weight:700;color:var(--blue)">${d.rate}%</span></div></div>
  <div class="row" style="gap:8px;align-items:stretch;${mo()?'flex-wrap:wrap':''}">${stats.join('')}</div>
  ${c==='maint'&&d.id==='aster'?C.note('점검·일시 연동 불가(G-162 확정): 카드·상세는 그대로 노출하고 가입 링크(<code>Get Started</code>)도 유지. 연동 진입만 숨긴다 — 랜딩 카드에는 연동 버튼이 없어 화면 차이 없음'):''}
  <div class="row" style="gap:12px">${outlinedP('Learn More',{size:'md',go:'dex.detail:'+d.id,full:true})}<button class="btn contained primary md full">Get Started${ext()}</button></div></div>`;
}
// 리스트 행 · 모바일 카드 공통 조각 — Figma 리스트 뷰(29361:138251 · 모바일 29363:136978) · 모바일 카드(29363:135072)
const vStars=()=>`<span class="row" style="gap:0">${[1,2,3].map(()=>`<img src="${A('dex-dt-ic-star-full.svg')}" style="width:14px;height:14px" alt="">`).join('')}<img src="${A('dex-dt-ic-star-full.svg')}" style="width:14px;height:14px;clip-path:inset(0 50% 0 0)" alt=""><img src="${A('dex-dt-ic-star-empty.svg')}" style="width:14px;height:14px" alt=""></span><span class="b2">4.0</span><span class="b2 c2">(23)</span>`;
const vHead=(d,stars)=>`<div class="row" style="gap:${mo()?8:8}px">${C.dex(d.name,mo()?32:24)}<span class="${mo()?'b1':'h5'} semi">${d.name}</span>${stars?`<span class="row" style="gap:6px;margin-left:${mo()?8:12}px">${vStars()}</span>`:''}</div>`;
const vUpTo=d=>`<span class="b1 semi cb">Up to ${d.rate}% cashback</span>`;
const vFees=d=>`<div class="row" style="gap:24px"><span class="row" style="gap:6px"><span class="b2 c2">Final Taker</span><span class="b2 semi">${pct(fin(d,'taker'))}</span></span><span class="row" style="gap:6px"><span class="b2 c2">Final Maker</span><span class="b2 semi">${pct(fin(d,'maker'))}</span></span></div>`;
function listRow(d){
 const btn=`<button class="btn contained black lg${mo()?' full':''}" data-go="dex.detail:${d.id}">View ${d.name}</button>`;
 if(mo())return `<div style="border:1px solid var(--divider);border-radius:8px;padding:15px;background:#fff" class="col">
  <div class="col" style="gap:12px">${vHead(d,true)}${vUpTo(d)}</div><hr class="divider" style="margin:12px 0">${vFees(d)}<div style="height:12px"></div>${btn}</div>`;
 return `<div style="border:1px solid var(--divider);border-radius:8px;padding:17px 19px 19px;background:#fff" class="col">
  <div class="row between"><div class="col" style="gap:6px">${vHead(d,true)}${vUpTo(d)}</div>${btn}</div>
  <hr class="divider" style="margin:10px 0">${vFees(d)}</div>`;
}
// 모바일 기본(카드) 뷰 — 29363:135072: 머리(마크·이름 / Up to) · 구분선 · Final Taker/Maker · TVL·24H Vol 칸 · Learn More / Get Started
function venueCardMo(d,c){
 const box=(k,v)=>`<div style="flex:1 1 0;min-width:0;border:1px solid var(--divider);border-radius:8px;padding:10px 12px" class="col g4"><span class="cap c2">${k}</span><span class="b2 semi">${v}</span></div>`;
 return `<div class="col" data-m-lift data-dex-card="${d.id}" style="border:1px solid var(--divider);border-radius:8px;padding:15px;background:#fff">
  <div class="col" style="gap:12px">${vHead(d,false)}${vUpTo(d)}</div><hr class="divider" style="margin:12px 0">${vFees(d)}
  ${c==='defiHidden'?'':`<div class="row" style="gap:8px;margin-top:12px">${box('TVL',DEFI.tvl)}${box('24H Vol',DEFI.vol)}</div>`}
  ${c==='maint'&&d.id==='aster'?C.note('점검·일시 연동 불가(G-162 확정): 카드·상세는 그대로 노출하고 가입 링크(<code>Get Started</code>)도 유지. 연동 진입만 숨긴다'):''}
  <div class="row" style="gap:12px;margin-top:12px">${outlinedP('Learn More',{size:'md',go:'dex.detail:'+d.id,full:true})}<button class="btn contained primary md full">Get Started${ext()}</button></div></div>`;
}
function ovVenues(list,c){
 const isList=c==='list';   // 모바일도 기본은 카드(29363:135072), 리스트는 전환 시(29363:136978)
 const desc=isList||mo()?'Join through our referral and link your wallet address. TVL and 24H volume from DefiLlama.':'Pick one, join through our link, then paste your wallet address. TVL and 24H volume from DefiLlama.';
 const sw=`<button class="icon-btn" title="${isList?'grid':'list'}">${isList?`<span style="display:grid;grid-template-columns:8px 8px;gap:3px">${'<i style="width:8px;height:8px;border-radius:2px;background:rgba(0,0,0,.56)"></i>'.repeat(4)}</span>`:`<img src="${A('dex-ov-ic-list.svg')}" style="width:24px;height:24px" alt="">`}</button>`;
 const head=mo()?`<div class="col" style="gap:8px"><div class="row between" style="align-items:flex-start"><h2 id="dex-venues" tabindex="-1" class="h3" style="margin:0;font-size:34px;line-height:1.235;outline:0">Our Partner Decentralised Exchanges</h2>${sw}</div><p class="b2 c2" style="margin:0">${desc}</p></div>`
  :`<div class="row" style="gap:120px;align-items:flex-end;justify-content:space-between"><h2 id="dex-venues" tabindex="-1" class="h3" style="margin:0;width:560px;outline:0">Our Partner Decentralised Exchanges</h2><div class="row" style="gap:16px"><p class="b1 c2" style="margin:0;width:460px;text-align:right">${desc}</p>${sw}</div></div>`;
 const ds=list.map(id=>DX[id]);
 let body;
 if(isList)body=`<div class="col" style="gap:${mo()?12:16}px">${ds.map(listRow).join('')}</div>`;
 else if(mo())body=`<div class="col" style="gap:12px">${ds.map((d,i)=>venueCard(d,c,i)).join('')}</div>`;
 else{const rows=[];for(let i=0;i<ds.length;i+=2)rows.push(`<div style="display:grid;grid-template-columns:1fr 1fr;${i?'border-top:1px solid var(--divider)':''}">${venueCard(ds[i],c,0)}${ds[i+1]?venueCard(ds[i+1],c,1):'<div></div>'}</div>`);
  body=`<div style="border-top:1px solid var(--divider);border-bottom:1px solid var(--divider)">${rows.join('')}</div>`}
 const stale=c==='defiStale'?`<p class="cap c2" style="margin:0">Source: DefiLlama, as of 10. 13. 15:00.</p>${C.note('DefiLlama 실패 — 서버 캐시의 마지막 값과 기준 시각을 최대 24시간 표시(REQ-323). 문구 원문 <code>Source: DefiLlama, as of {time}.</code> · 디자인 없음')}`:'';
 const hid=c==='defiHidden'?C.note('DefiLlama 24시간 넘게 실패 — TVL·24H Vol 칸과 glance 서브라인을 숨기고(0 표시 안 함) 카드 나머지는 정상(REQ-323) · 디자인 없음'):'';
 const odd=ds.length%2&&!isList?C.note('홀수 칸 — 마지막 칸 왼쪽 정렬, 빈칸 유지(G-168 디자이너 결정)'):'';
 return `<section style="background:#fff;padding:${mo()?'32px 0':'32px 0 120px'}">${wrap(`<div class="col" style="gap:${mo()?24:48}px">${head}${body}${stale}${hid}${odd}</div>`)}</section>`;
}
function ovCompare(){
 const row=(k,v,dex,chip)=>`<div class="col" style="gap:4px;border-top:1px solid var(--divider);padding:16px 0"><span class="cap c2">${k}</span><span style="${dex?'font-size:20px;line-height:1.6;font-weight:600;letter-spacing:.15px':'font-size:16px;line-height:1.5'}">${v}</span>${chip?`<span class="cap cb" style="border:1px solid var(--blue);border-radius:999px;padding:0 8px;align-self:flex-start;margin-top:4px">${chip}</span>`:''}</div>`;
 // 비교 행 = 정책 8-4 · REQ-327 · Figma 최신 OA(29361:137628). 최소액 10은 서버값 표본
 const ex=[['Who holds your funds','The exchange'],['How you sign up','Account with an identity check'],['How you link to TetherMax','Your exchange UID'],['Where cashback is paid','Your TetherMax balance'],['Where you withdraw','On TetherMax, from 10 USDT'],['Event and invite rewards','Yes']];
 const dx=[['Who holds your funds','You, in your own wallet'],['How you sign up','Email or a wallet, no KYC check'],['How you link to TetherMax','Your wallet address, pasted'],['Where cashback is paid','Your TetherMax balance','Your Cashback'],['Where you withdraw','On TetherMax, from 10 USDT, to your linked wallet'],['Event and invite rewards','Yes']];
 const panel=(dex)=>`<div style="position:relative;flex:1 1 0;min-width:0;background:#fff;border:${dex?'2px solid var(--blue)':'1px solid var(--divider)'};border-radius:8px;padding:${mo()?'40px':'40px 40px 16px'};box-shadow:${dex?'0 16px 40px rgba(26,64,217,.14)':'0 10px 20px rgba(0,0,0,.06)'};gap:0" class="col">
  <div class="col" style="gap:8px">${eyebrow(dex?'ON A DEX':'ON AN EXCHANGE',dex?'var(--blue)':'var(--text-secondary)')}<span style="font-size:${mo()?24:34}px;line-height:1.235;letter-spacing:.25px">${dex?'You hold the keys':'The exchange holds them'}</span></div><div style="height:24px"></div>
  ${(dex?dx:ex).map(r=>row(r[0],r[1],dex,r[2])).join('')}
  ${dex?`<img src="${A('dex-ov-lock.webp')}" style="position:absolute;${mo()?'right:16px;top:-24px;width:80px;height:80px':'right:-48px;top:-86px;width:278px;height:278px'};pointer-events:none" alt="">`:''}</div>`;
 const seam=`<div style="${mo()?'align-self:center;margin:-36px 0':'position:absolute;left:570px;top:330px'};z-index:2;width:60px;height:60px;border-radius:999px;background:var(--blue);display:flex;align-items:center;justify-content:center"><img src="${A('dex-ov-ic-arrow.svg')}" style="width:28px;height:28px;${mo()?'transform:rotate(90deg)':''}" alt=""></div>`;
 const stage=mo()?`<div class="col" style="gap:0">${panel(false)}${seam}${panel(true)}</div>`:`<div style="position:relative;display:flex;gap:24px">${panel(false)}${panel(true)}${seam}</div>`;
 return `<section style="background:#fff;padding:${mo()?'48px 0':'80px 0 96px'}">${wrap(`<div class="col" style="gap:56px;align-items:stretch"><div class="col center" style="gap:16px;align-items:center"><h2 style="margin:0;font-weight:400;font-size:${mo()?28:48}px;line-height:1.167">Who holds your money changes.<br>Your DEX cashback does not.</h2><p class="b1 c2" style="margin:0;max-width:640px">On an exchange, the exchange holds your funds. On a DEX, you do. TetherMax only follows the address you paste.</p></div>${stage}</div>`)}</section>`;
}
function ovSteps(){
 const st=[['STEP 1','Create a Web 3 Wallet','Install a self-custody wallet, or sign up on the DEX with email to get a wallet made for you.','About 2 minutes','dex-ov-step1.webp'],
  ['STEP 2','Join the DEX through our link','Deposit funds and connect your wallet on the DEX via the TetherMax referral, then paste your address in TetherMax.','About 3 minutes','dex-ov-step2.webp'],
  ['STEP 3','Trade & get rewarded','TetherMax credits your cashback to your balance. Eligible balances of 10 USDT or more are paid to your linked wallet.','From your next trade','dex-ov-step3.webp']];
 const step=([c,t,b,m,img])=>`<div class="col" style="flex:1 1 0;min-width:0;gap:16px;align-items:center;text-align:center"><div style="width:220px;height:${mo()?200:208}px;display:flex;align-items:center;justify-content:center;overflow:visible"><img src="${A(img)}" style="width:190px;height:${img.endsWith('step3.webp')?'auto':'190px'};max-height:240px;object-fit:contain" alt=""></div>
  <span style="border:1px solid var(--blue);border-radius:999px;padding:4px 12px;color:var(--blue);font-size:14px;line-height:24px;font-weight:500">${c}</span><span class="h5">${t}</span><span class="b1 c2">${b}</span><span class="cap c2">${m}</span></div>`;
 const card=`<div style="background:#fff;border:1px solid var(--divider);border-radius:8px;padding:${mo()?'32px 24px':'48px'};box-shadow:0 10px 24px rgba(0,0,0,.05)" class="col g32">${mo()?'':`<img src="${A('dex-ov-progress.svg')}" style="width:100%;height:24px" alt="">`}<div style="display:flex;${mo()?'flex-direction:column;gap:40px':'gap:32px'}">${st.map(step).join('')}</div></div>`;
 return `<section style="background:#fff;padding:${mo()?'48px 0':'120px 0 96px'}">${wrap(`<div class="col" style="gap:48px;align-items:center"><h2 id="dex-steps" tabindex="-1" style="margin:0;font-weight:400;font-size:${mo()?24:48}px;line-height:1.167;text-align:center;outline:0">A simple 3 step path</h2><div style="align-self:stretch">${card}</div>${outlinedP('See partner DEXs').replace('<button','<button data-scroll-to="dex-venues"')}</div>`)}</section>`;
}
function ovBento(){
 const tile=(o)=>`<div style="position:relative;${mo()?'':`flex:0 0 ${o.w}px;`}height:${mo()?(o.h>420?340:320):o.h}px;border-radius:8px;overflow:${mo()?'visible':'hidden'};${o.blue?'background:var(--blue)':'background:#fff;border:1px solid var(--divider)'}">
  <img src="${A(o.img)}" style="position:absolute;${o.ip};pointer-events:none" alt="">
  <div class="col" style="position:absolute;left:${mo()?20:40}px;right:${mo()?20:40}px;bottom:${mo()?24:(o.blue||o.h>420)?40:24}px;gap:12px;max-width:420px">${eyebrow(o.k,o.blue?'rgba(255,255,255,.87)':'var(--blue)')}<span style="font-size:${mo()?24:o.big?48:34}px;line-height:${o.big?1.167:1.235};color:${o.blue?'rgba(255,255,255,.87)':'var(--text-primary)'}">${o.t}</span><span class="b1" style="color:${o.blue?'rgba(255,255,255,.6)':'var(--text-secondary)'}">${o.b}</span></div></div>`;
 const T1={w:700,h:460,big:1,k:'CUSTODY',t:'You hold the keys.',b:'Your collateral stays under your control. No one can freeze it, and no one can restore it for you.',img:'dex-ov-bento-wallet.webp',ip:mo()?'right:16px;top:8px;width:160px':'left:120px;top:-71px;width:402px'};
 const T2={w:476,h:460,k:'ORDER BOOK',t:'Onchain order book',b:'Onchain matching via rollup or sequencer for verification.',img:'dex-ov-bento-chart.webp',ip:mo()?'right:16px;top:16px;width:160px':'left:180px;top:11px;width:270px;border-radius:21px'};
 const T3={w:476,h:400,k:'PAYOUT',t:'Paid to your TetherMax balance',b:'Your trades are tracked through our referral. TetherMax pays the cashback into your TetherMax balance.',img:'dex-ov-bento-plane.webp',ip:mo()?'right:8px;top:-20px;width:180px':'left:180px;top:-58px;width:315px'};
 const T4={w:700,h:400,big:1,blue:1,k:'TRADING COSTS',t:"Low fees don't always mean low trading costs",b:'Compare liquidity, slippage, funding, and gas, not just the advertised fee.',img:'dex-ov-bento-calc.webp',ip:mo()?'right:8px;top:-20px;width:180px':'left:398px;top:-59px;width:310px'};
 const body=mo()?`<div class="col" style="gap:12px">${[T1,T2,T3,T4].map(tile).join('')}</div>`:`<div class="col" style="gap:24px"><div class="row" style="gap:24px;align-items:stretch">${tile(T1)}${tile(T2)}</div><div class="row" style="gap:24px;align-items:stretch">${tile(T3)}${tile(T4)}</div></div>`;
 return `<section style="background:#fff;padding:${mo()?'24px 0 48px':'24px 0 120px'}">${wrap(body)}</section>`;
}
function ovLearn(){
 const copy=`<div class="col" style="gap:16px;flex:1 1 0;min-width:0">${eyebrow('LEARN AND EARN')}<span style="font-size:${mo()?24:48}px;line-height:1.167">Learn DEX trading in short lessons.</span><span class="b1 c2">Complete a quiz to earn a coupon. Redeem it on a linked account as an event reward. It matches trading cashback 1:1.</span></div>`;
 const btn=outlinedP('Start learning',{go:'quiz.list',full:mo()});
 const card=mo()?`<div style="position:relative;background:#fff;border:1px solid var(--divider);border-radius:8px;padding:120px 20px 24px;margin-top:60px" class="col g24"><img src="${A('dex-ov-rocket.webp')}" style="position:absolute;left:50%;top:-60px;transform:translateX(-50%);width:180px" alt="">${copy}${btn}</div>`
  :`<div style="position:relative;background:#fff;border:1px solid var(--divider);border-radius:8px;padding:48px 56px 48px 330px;display:flex;gap:48px;align-items:center"><img src="${A('dex-ov-rocket.webp')}" style="position:absolute;left:-56px;top:-52px;width:416px;height:416px" alt="">${copy}${btn}</div>`;
 return `<section style="background:#fff;padding:0 0 ${mo()?40:120}px">${wrap(card)}${C.note('Learn and Earn 본문은 Figma 인스턴스 문구(쿠폰·이벤트 리워드 매칭 1:1). G-158 확정(퀴즈 보상 규칙과 같은 표현일 때 언급)과 일치. <code>Start learning</code> → Beginner’s Guide DEX 트랙(REQ-330)')}</section>`;
}
function ovWhy(){
 const r=[['dex-ov-why-support.png','Support in 2 minutes','Responsive customer support, query attended in 2 minutes.','Speak to us','support.main'],['dex-ov-why-events.png','More cashback from events','Earn more cashbacks by completing tasks and exchange event challenges.','See Benefits','benefits.list'],['dex-ov-why-invite.png','Invite friends, earn more','Grow your cashback when you invite partners and friends.','Find out more','invite.main']];
 const card=([img,t,b,l,go])=>`<div class="col" style="flex:1 1 0;min-width:0;gap:12px;background:#fff;border:1px solid var(--divider);border-radius:8px;padding:28px"><img src="${A(img)}" style="width:72px;height:72px" alt=""><span class="h6">${t}</span><span class="b1 c2">${b}</span><a class="b2 semi cb" data-go="${go}" style="cursor:pointer">${l}&nbsp; →</a></div>`;
 return `<section style="background:#fff;padding:${mo()?'0 0 48px':'24px 0 96px'}">${wrap(`<div class="col" style="gap:32px"><span class="h5">Why sign up with TetherMax?</span><div style="display:flex;${mo()?'flex-direction:column;gap:12px':'gap:24px'}">${r.map(card).join('')}</div></div>`)}</section>`;
}
function ovCta(){
 const call=`<div class="col" style="gap:28px;max-width:620px"><h2 style="margin:0;font-weight:400;font-size:${mo()?34:60}px;line-height:1.2;color:#fff;${mo()?'':'white-space:nowrap'}">Your keys. Your trades.<br>Your Cashback.</h2><p class="b1" style="margin:0;color:rgba(255,255,255,.7);max-width:446px">Join TetherMax, pick a partner Decentralised Exchange, and the Cashback starts with your next trade.</p><div>${C.btn('Sign Up Now',{go:'auth.signup'}).replace('<button ','<button data-after="dex.overview" ')}</div></div>`;
 const bg='linear-gradient(180deg,#a7aab0,#acb0b6)';
 if(mo())return `<section style="background:${bg}"><div style="height:340px;background:url(${A('dex-ov-keychain.jpg')}) center/cover"></div><div style="padding:24px 16px 48px">${call}</div></section>`;
 return `<section style="position:relative;height:640px;background:${bg};overflow:hidden"><img src="${A('dex-ov-keychain.jpg')}" style="position:absolute;right:0;top:0;width:746px;height:640px;object-fit:cover" alt=""><div style="position:absolute;left:120px;top:175px">${call}</div></section>`;
}
function ovPage(c){
 const guest=c!=='member';
 const list=c==='lighter'||c==='overflow'?ORDER_L:ORDER;
 const empty=c==='empty';
 const notes=[];
 if(c==='lighter')notes.push('Lighter 카드 — <b>Lighter 온보딩 후 표시(현재 보류)</b>. benefit 4줄은 G-157 확정(입금 칩·혜택 줄은 상세에만, 카드는 오퍼 3줄만)에 따라 카드에 넣지 않는다. V2.2 <code>lnd/LANDING#lighter</code>');
 if(c==='overflow')notes.push('Figma 전용 프레임 「8 partner DEXs (overflow)」 — glance 가로 스크롤·양끝 페이드 검증용. Hyperliquid·dYdX·GMX·Drift는 레이아웃 검증용 이름(Figma 그대로), 파트너 아님. 마크 미보유라 글자 마크');
 if(empty)notes.push('노출 DEX 0개 — G-160 확정: glance·배너·venue 영역을 숨기고 빈 상태 화면은 두지 않는다 · 히어로 숫자 줄 0 · 디자인 없음. V2.2 <code>lnd/LANDING#empty</code>');
 if(c==='noBanner')notes.push('게시 배너 0개 — 배너 영역을 렌더하지 않고 빈 공간도 남기지 않는다(REQ-324) · 관리 = DEX Landing Page 프로모 배너 영역(G-156) · 디자인 없음. V2.2 <code>lnd/LANDING#noBanner</code>');
 if(c==='member')notes.push('로그인 — Learn and Earn 띠로 끝(이유 카드·마지막 CTA 띠 없음, REQ-318). V2.2 <code>lnd/LANDING#member</code>');
 const hero=empty?ovHero([]).replace(/0 partner DEXs you can start earning Cashback with/,'0 partner DEXs you can start earning Cashback with'):ovHero(list);
 return `${notes.length?`<div style="padding:8px 16px">${notes.map(C.note).join('')}</div>`:''}${hero}
  ${empty?'':ovGlance(list,c)}${empty||c==='noBanner'?'':ovBanner()}${empty?'':ovVenues(list,c)}
  ${ovCompare()}${ovSteps()}${ovBento()}${ovLearn()}${guest?ovWhy()+ovCta():''}`;
}

R.screen({id:'dex.overview',group:'dex',title:'DEX 개요 (랜딩)',route:'/dex',fu:['FU-049','FU-050','FU-051','FU-052','FU-053'],
 shell:{nav:'cashback'},
 states:[
  {id:'normal',label:'게스트 — 이유 카드 · 마지막 CTA 띠까지',figma:{pc:'29361:137628',mo:'29363:135072'},note:'V2.2 lnd/LANDING#normal · Figma는 Lighter 포함 4개, 정책상 Lighter 보류라 3개로 렌더(카드 구조 동일)'},
  {id:'member',label:'로그인 — Learn and Earn 띠로 끝',figma:{pc:'29361:136789',mo:'29363:136040'},note:'V2.2 lnd/LANDING#member'},
  {id:'list',label:'Venue 리스트 뷰',figma:{pc:'29361:138251',mo:'29363:136978'},note:'V2.2 lnd/LANDING#list · Figma 버튼 라벨 「Label」 → 명세 REQ-326 `View {DEX}`'},
  {id:'defiStale',label:'DefiLlama 실패 — 마지막 캐시값 + 기준 시각',note:'V2.2 lnd/LANDING#defiStale · 재사용: OA glance 서브라인 `… as of {date}` 형식 · 상태 정의 S5_07 `24H trading volume`(29002:128485)'},
  {id:'defiHidden',label:'DefiLlama 24시간 넘게 실패 — 숨김',note:'V2.2 lnd/LANDING#defiHidden · OA 카드에서 지표 칸만 뺌 · 상태 정의 S5_07(29002:128485)'},
  {id:'noBanner',label:'게시 배너 없음 — 렌더 안 함',note:'V2.2 lnd/LANDING#noBanner'},
  {id:'empty',label:'노출 DEX 0개 — 영역 숨김 (G-160)',note:'V2.2 lnd/LANDING#empty · Figma 상태 정의 S5_02 `No DEX partners are available`(29002:128365)는 G-160(빈 상태 화면 없음)과 충돌 → 결정대로'},
  {id:'maint',label:'특정 DEX 점검·일시 연동 불가 (G-162)',note:'V2.2 lnd/LANDING#maint · Figma 상태 정의 S5_03 `Temporarily under maintenance`(29002:128385)는 G-162(카드 변화 없음)와 충돌 → 결정대로'},
  {id:'lighter',label:'Lighter 카드 (온보딩 후 — 보류)',figma:{pc:'29361:136089',mo:'29363:135072'},note:'V2.2 lnd/LANDING#lighter · Lighter 온보딩 보류'},
  {id:'overflow',label:'파트너 8개 — glance 가로 넘침 (Figma 전용)',figma:{pc:'28960:125542'},note:'Figma 「OA DEX overview, 8 partner DEXs (overflow)」 — 레이아웃 확장 검증용(REQ-322 넘치면 가로 스크롤+페이드)'},
 ],
 render(st){return ovPage(st)}});

// =====================================================================
// DEX 상세 (/dex/{slug}) — 공용 템플릿 FU-054 ~ FU-059
// =====================================================================
const box1056=(inner,o={})=>`<div style="padding:${mo()?'0':'20px 0'};${o.outer||''}"><div data-m-reveal style="width:100%;max-width:1056px;margin:0 auto;background:${o.bg||'#fff'};border-radius:${mo()?0:8}px;${o.noShadow?'':'box-shadow:0 10px 20px rgba(0,0,0,.04);'}padding:${o.pad||(mo()?'24px 16px':'24px')};box-sizing:border-box;${o.style||''}">${inner}</div></div>`;
const toggle=(a,b,on)=>`<div style="background:rgba(207,216,220,.2);border-radius:4px;padding:4px;display:inline-flex;height:32px;box-sizing:border-box">${[a,b].map((x,i)=>`<span style="padding:0 8px;display:flex;align-items:center;font-size:14px;font-weight:500;border-radius:4px;${i===on?'background:#fff;color:var(--text-primary)':'color:var(--text-secondary)'}">${x}</span>`).join('')}</div>`;
const numBadge=(n,on)=>`<span style="width:20px;height:20px;border-radius:100px;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:500;${on?'background:var(--blue);color:#fff':'background:#f2f2f5;color:var(--tm-secondary-dark)'}">${n}</span>`;
function offerBox(d,member,maker){
 const lighter=d.tiers;
 const k=maker?'maker':'taker';
 const tbl=lighter?`<div style="border:1px solid var(--divider);border-radius:8px;overflow:hidden">
   <div class="row between" style="background:rgba(207,216,220,.2);padding:12px 16px"><span class="b1 semi">Fee stage</span><span class="row b2 semi" style="gap:16px"><span>Final Taker</span><span style="width:80px;text-align:right">Final Maker</span></span></div>
   <div class="row between" style="border-top:1px solid var(--divider);padding:12px 16px"><span class="row b2 med c2" style="gap:8px">${numBadge(1)}Without TetherMax</span><span class="row b2 semi c3" style="gap:16px"><s style="width:80px;text-align:right">${pct(d.taker)}</s><s style="width:80px;text-align:right">${pct(d.maker)}</s></span></div>
   <div class="row between" style="border-top:1px solid var(--divider);padding:12px 16px"><span class="row b2 med cb" style="gap:8px">${numBadge(2,1)}After cashback</span><span class="row b2 semi cb" style="gap:16px"><span style="width:80px;text-align:right">${pct(fin(d,'taker'))}</span><span style="width:80px;text-align:right">${pct(fin(d,'maker'))}</span></span></div></div>`
  :`<div data-stage-tbl style="border:1px solid var(--divider);border-radius:8px;overflow:hidden">
   <div class="row between" style="background:rgba(207,216,220,.2);padding:12px 16px;align-items:flex-start"><span class="b1 semi" style="line-height:24px">Fee stage</span><span class="b2 semi" style="line-height:20px">${maker?'Final Maker':'Final Taker'}</span></div>
   ${stageRows(d,maker).map((r,i,a)=>{const last=i===a.length-1;return `<div class="row between" data-stage-row="${r.key}" style="border-top:1px solid var(--divider);padding:11px 16px 11px"><span class="row b2 med${last?' cb':i===0?' c2':''}" style="gap:8px">${numBadge(i+1,last?1:0)}${r.label}</span>${r.strike?`<s class="b2 semi c3">${pct(r.v)}</s>`:`<span class="b2 semi${last?' cb':''}">${pct(r.v)}</span>`}</div>`}).join('')}</div>`;
 const ret=member==='return';
 const linkWallet=`link.addr:${d.name.toLowerCase()}`;
 const cta={guest:mo()?'':outlinedP(T('Sign Up','회원가입'),{full:true,go:'auth.signup'}).replace('<button ',`<button data-after="${linkWallet}" `),
  return:C.btn(T('Link Wallet','연동하기'),{full:true,go:linkWallet}),
  unlinked:outlinedP(T('Link Wallet','연동하기'),{full:true,go:linkWallet}),
  linked:`<button class="btn outlined black lg full" disabled>Auto Claim</button>`,
  pending:`<button class="btn outlined black lg full" disabled>${T('Trying to link','연동 시도중이에요')}</button>`}[member];
 return `<div class="col" style="gap:12px;${mo()?'border-left:1px solid var(--divider);padding:0 0 0 16px':'width:400px;flex:none;border-left:1px solid var(--divider);padding:0 16px 0 24px'}">
  <div class="row between" style="align-items:flex-start"><div class="col" style="gap:0"><span class="b2 med">Trading fees cashback up to</span><span style="font-size:34px;line-height:1.235;font-weight:700;color:var(--blue)">${d.rate}%</span></div>${lighter?toggle('Premium','Plus',0):toggle('Taker','Maker',maker?1:0)}</div>
  ${tbl}${ret?outlinedP('Get Started',{full:true}):`<button class="btn contained primary lg full">Get Started${ext()}</button>`}${cta}</div>`;
}
function dtHero(d,member,maker){
 const chip=(x,out)=>`<span style="height:24px;display:inline-flex;align-items:center;padding:0 9px;border-radius:100px;font-size:13px;line-height:18px;letter-spacing:.16px;${out?'border:1px solid #bdbdbd':'background:var(--action-selected)'}">${esc(x)}</span>`;
 const elig=d.tiers?T('Cashback applies to Premium and Plus accounts. Standard accounts pay 0% fees, so there is no cashback on them.','캐시백은 Premium과 Plus 계정에 적용됩니다. Standard 계정은 캐시백이 쌓이지 않아요.')
  :T(`Cashback applies to eligible trading fees on ${d.name}.`,`${d.name}에서 발생한 대상 거래 수수료에 캐시백이 적용돼요.`);
 const venue=`<div class="col" style="flex:1 1 0;min-width:0;gap:20px">
  <div class="col" style="gap:8px"><div class="row" style="gap:8px;align-items:center">${C.dex(d.name,32)}<span class="h5">${d.name}</span>${chip('DEX')}</div><p class="b2" style="margin:0">${esc(d.desc)}</p></div>
  <div class="col" style="gap:16px"><div class="row" style="gap:8px;align-items:flex-start"><span class="b2 semi c2" style="width:73px;flex:none">Perpetuals</span><div class="row wrap" style="gap:8px;max-width:378px">${d.chips.map(x=>chip(x)).join('')}</div></div>
   ${d.tiers?`<div class="col" style="gap:4px">${['Trade crypto, RWAs and pre IPO perps onchain','Earn Lighter points while you trade','Leverage up to 50x on selected markets','0% maker and taker fees on Standard accounts'].map(x=>`<span class="b2">✓ ${x}</span>`).join('')}</div>`:''}
   <div class="row" style="gap:8px"><span class="b2 semi c2" style="width:73px;flex:none">Deposit</span>${d.dep.map(x=>chip(x,1)).join('')}</div></div>
  <p class="b2 c2" style="margin:0">${elig}</p></div>`;
 const crumb=`<div class="row b2" style="gap:8px"><a class="cb" data-go="dex.overview" style="cursor:pointer">${T(DTM,'탈중앙화 거래소')}</a><span class="c2">/</span><span>${d.name}</span></div>`;
 return box1056(`<div class="col" style="gap:24px">${crumb}<div style="display:flex;${mo()?'flex-direction:column;gap:24px':'gap:48px;align-items:flex-start'}">${venue}${offerBox(d,member,maker)}</div></div>`,{outer:mo()?'':'padding-top:20px'});
}
function dtTabs(c){
 const n=c==='reviewsEmpty'?0:23;
 const tabs=['Key Features','Structure','Guide','Policy',`Reviews (${n})`];
 // Figma 「tab bar (sticky)」(28960:127486): 1px 가로줄은 바 전체 폭(1440) 아래, 탭(높이 42 = 밑줄 2 포함)은 1056 안에서 8px 간격
 return `<div data-dt-tabs style="background:var(--bg-accent);border-bottom:1px solid var(--divider);${mo()?'overflow-x:auto':''}"><div style="max-width:1056px;margin:0 auto;display:flex;gap:8px;${mo()?'padding:0 16px':''}">${tabs.map((t,i)=>`<span style="padding:9px 16px;font-size:14px;line-height:22px;font-weight:500;white-space:nowrap;${i===0?'color:var(--blue);border-bottom:2px solid var(--blue)':'color:var(--text-secondary);border-bottom:2px solid transparent'}">${t}</span>`).join('')}</div></div>`;
}
function dtWhy(d){
 const card=(t,i)=>`<div class="row" style="flex:1 1 0;min-width:0;gap:12px;border:1px solid var(--divider);border-radius:8px;padding:16px;background:#fff"><img src="${A('dex-dt-why-'+(i+1)+'.png')}" style="width:92px;height:92px;border-radius:16px;flex:none" alt=""><span class="b1 semi">${esc(t)}</span></div>`;
 const rows=mo()?`<div class="col" style="gap:12px">${d.why.map(card).join('')}</div>`:`<div class="col" style="gap:24px"><div class="row" style="gap:24px;align-items:stretch">${card(d.why[0],0)}${card(d.why[1],1)}</div><div class="row" style="gap:24px;align-items:stretch">${card(d.why[2],2)}${card(d.why[3],3)}</div></div>`;
 return box1056(`<div class="col" style="gap:24px"><span class="h5 bold">Why traders choose ${d.name}</span>${rows}</div>`);
}
function calc(d,maker){
 const k=maker?'maker':'taker',vol=400000,fee=vol*d[k]/100,cb=fee*d.rate/100,eff=fee-cb;
 return {vol,fee:fl2(fee),cb:fl2(cb),eff:fl2(fee)-fl2(cb),k};
}
function dtStructure(d,maker){
 const x=calc(d,maker);
 const icon=(src,sz=42)=>`<span style="width:72px;height:72px;border-radius:44px;background:var(--blue-accentlight);display:inline-flex;align-items:center;justify-content:center;flex:none">${src}</span>`;
 const img=(n,s=42)=>`<img src="${A(n)}" style="width:${s}px;height:${s}px" alt="">`;
 const steps=[[icon(img('dex-dt-ic-chart.svg')),`You trade on ${d.name}`,d.tiers?`Your selected $400K volume on a Premium account generates an estimated ${usdS(x.fee)} in ${x.k} fees.`:`Your selected $400K volume generates an estimated ${usdS(x.fee)} in ${x.k} fees.`],
  [icon(img('dex-dt-ic-bank.svg')),`${d.name} pays a settlement`,'Eligible trading activity generates a settlement for the referring partner.'],
  [icon(img('dex-dt-ic-wallet.svg')),'TetherMax gives cashback',`TetherMax returns ${usd(x.cb)} (${d.rate}%) to you, so your effective fee becomes ${usd(x.eff)}.`]];
 const stepCard=([ic,t,b],i)=>`<div class="col" style="flex:1 1 0;min-width:0;gap:8px;background:rgba(207,216,220,.2);border-radius:8px;padding:16px 16px 13px"><span style="width:24px;height:24px;border-radius:12px;background:var(--blue);color:#fff;font-size:12px;font-weight:500;display:inline-flex;align-items:center;justify-content:center">${i+1}</span><div style="display:flex;justify-content:center">${ic}</div><div class="col center" style="gap:4px;align-items:center"><span class="b1 semi" style="line-height:24px">${t}</span><span class="b2 c2" style="line-height:20px">${b}</span></div></div>`;
 const star=`<span style="display:flex;align-items:center;flex:none">${img('dex-dt-ic-star.svg',20)}</span>`;
 const ticks=['Min 100K','250K','500K','750K','1M','5M','10M'];
 const slider=`<div class="col" style="gap:8px"><div class="row between"><span class="b2 c2">Total volume</span><span class="b1 semi">$400K</span></div>
  <div style="position:relative;height:25px"><div style="position:absolute;left:0;right:0;top:11px;height:4px;border-radius:100px;background:var(--blue);opacity:.15"></div><div style="position:absolute;left:0;width:27%;top:10px;height:6px;border-radius:100px;background:var(--blue)"></div><div style="position:absolute;left:calc(27% - 10px);top:3px;width:20px;height:20px;border-radius:50%;background:var(--blue);box-shadow:var(--elev2)"></div></div>
  <div class="row between b2 c2">${ticks.map(t=>`<span>${t}</span>`).join('')}</div></div>`;
 const fees=`<div style="background:var(--blue-accentlight);border:1px solid var(--blue);border-radius:12px;padding:13px 33px;display:flex;align-items:center">${[[usd(x.fee),'Trading fee','Without TetherMax',''],['−'],[usd(x.cb),'Cashback','Returned to you','var(--blue)'],['='],[usd(x.eff),'Effective fee','With TetherMax','']].map(a=>a.length===1?`<span style="width:67px;text-align:center;font-size:24px;font-weight:600;color:var(--text-secondary)">${a[0]}</span>`:`<div class="col" style="flex:1 1 0;gap:2px;align-items:center"><span style="font-size:34px;line-height:1.235;font-weight:700;${a[3]?`color:${a[3]}`:''}">${a[0]}</span><span class="b2 med" style="line-height:20px">${a[1]}</span><span class="cap c2" style="line-height:16px;margin-top:3px">${a[2]}</span></div>`).join('')}</div>`;
 const node=(ic,label)=>`<div class="col" style="gap:8px;align-items:center;width:100px;flex:none"><span style="width:80px;height:80px;border-radius:40px;background:var(--blue-accentlight);display:flex;align-items:center;justify-content:center">${ic}</span><span class="b1 semi">${label}</span></div>`;
 const arrow=label=>`<div class="col" style="flex:1 1 0;gap:8px;align-items:center;padding-bottom:52px"><span style="font-size:12px;line-height:20px;font-weight:500">${label}</span><div style="width:100%;height:2px;background:linear-gradient(90deg,#d9dbe0,#d9dbe0);position:relative"><span style="position:absolute;right:-2px;top:-5px;width:10px;height:10px;border-top:2px solid #c4c7cc;border-right:2px solid #c4c7cc;transform:rotate(45deg)"></span></div></div>`;
 const flow=`<div class="col" style="gap:16px;padding:16px 0"><div class="row" style="align-items:center">${node(img('dex-dt-ic-person.svg',40),'You')}${arrow('Trading fee '+usdS(x.fee))}${node(C.dex(d.name,40),d.name)}${arrow('Partner settlement')}${node(img('dex-dt-ic-tm.svg',40),'TetherMax')}</div>
  <div style="position:relative;height:36px;margin:0 50px;border:2px solid var(--blue);border-top:0;border-radius:0 0 8px 8px"><span class="row" style="position:absolute;left:50%;top:18px;transform:translateX(calc(-50% - 4px));gap:8px;background:var(--blue);color:#fff;border-radius:100px;padding:4px 12px;white-space:nowrap">${img('dex-dt-ic-paid.svg',24)}<span class="b1 semi">${usd(x.cb)} Cashback returned to you</span></span></div></div>`;
 const head=`<div class="row between" style="align-items:flex-start;${mo()?'flex-wrap:wrap;gap:8px':''}"><div class="row" style="gap:17px;${mo()?'flex-direction:column;align-items:flex-start;gap:4px':''}"><span class="h5 bold">How much you get back</span><span class="row b2 semi" style="gap:4px;color:var(--blue);cursor:pointer" data-go="dex.detail:drawer"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" style="flex:none;display:block"><path d="M7.99333 1.33333C4.31333 1.33333 1.33333 4.32 1.33333 8C1.33333 11.68 4.31333 14.6667 7.99333 14.6667C11.68 14.6667 14.6667 11.68 14.6667 8C14.6667 4.32 11.68 1.33333 7.99333 1.33333ZM8 13.3333C5.05333 13.3333 2.66667 10.9467 2.66667 8C2.66667 5.05333 5.05333 2.66667 8 2.66667C10.9467 2.66667 13.3333 5.05333 13.3333 8C13.3333 10.9467 10.9467 13.3333 8 13.3333Z" fill="currentColor"/><path d="M8.66667 10.6667C8.66667 11.0333 8.36667 11.3333 8 11.3333C7.63333 11.3333 7.33333 11.0333 7.33333 10.6667V8C7.33333 7.63333 7.63333 7.33333 8 7.33333C8.36667 7.33333 8.66667 7.63333 8.66667 8V10.6667Z" fill="currentColor"/><path d="M7.33333 4.66667H8.66667V6H7.33333V4.66667Z" fill="currentColor"/></svg><span>How this works</span></span></div>${mo()?`<div style="width:100%">${toggle('Taker','Maker',maker?1:0).replace('display:inline-flex','display:flex;width:100%').replace(/padding:0 8px;display:flex/g,'flex:1;justify-content:center;padding:0 8px;display:flex')}</div>`:toggle('Taker','Maker',maker?1:0).replace(/font-size:14px/g,'font-size:13px')}</div>`;
 const disc=`<div class="row" style="gap:8px">${img('dex-dt-ic-info.svg',16)}<span class="b2 c2">Cashback comes from eligible exchange partner settlements. Final amounts vary by exchange, tier and trading activity.</span></div>`;
 if(mo()){
  const kv=(k,s,v,big)=>`<div class="row between" style="padding:8px 0"><div class="col" style="gap:0"><span class="b2">${k}</span><span class="cap c2">${s}</span></div><span style="${big?'font-size:34px;font-weight:700':'font-size:16px;font-weight:600'}">${v}</span></div>`;
  const bar=`<div style="display:flex;height:40px;border-radius:4px;overflow:hidden"><span style="width:${d.rate}%;background:var(--blue);color:#fff;display:flex;align-items:center;justify-content:center" class="b2 semi">${d.rate}%</span><span style="flex:1;background:#e0e0e0;color:#fff;display:flex;align-items:center;justify-content:center" class="b2">${100-d.rate}%</span></div>`;
  const leg=(c,t,s)=>`<div class="row" style="gap:8px;align-items:flex-start"><i style="width:12px;height:12px;background:${c};border-radius:2px;margin-top:4px"></i><div class="col" style="gap:0"><span class="b2">${t}</span><span class="cap c2">${s}</span></div></div>`;
  return box1056(`<div class="col" style="gap:16px">${head}<hr class="divider">${kv('Normal trading fee','Without TetherMax',usd(x.fee))}${kv('Cashback','Returned to you','−'+usd(x.cb))}<hr class="divider">${kv('Effective fee','With TetherMax',usd(x.eff),1)}${slider}
   <span class="h6" id="dex-flow" style="margin-top:16px">Where your cashback comes from</span>${bar}${leg('var(--blue)',`Returned to you — ${usd(x.cb)}`,'Paid to your TetherMax balance.')}${leg('#e0e0e0',`Stays with the fee — ${usd(x.eff)}`,`Split between ${d.name} and TetherMax.`)}
   <div class="col" style="gap:8px">${steps.map(stepCard).join('')}</div>${disc}</div>`,{outer:'padding:20px 16px',style:'border-radius:8px;padding:16px'});
 }
 return box1056(`<div class="col" style="gap:16px">${head}<hr class="divider">${fees}${slider}
  <div class="col" style="gap:16px;padding:0 0 16px;margin-top:-3px"><span style="font-size:20px;font-weight:700;text-align:center">Where your cashback comes from</span>${flow}
  <div class="row" style="gap:8px;align-items:stretch">${steps.map((s,i)=>(i?star:'')+stepCard(s,i)).join('')}</div><div style="margin-top:3px">${disc}</div></div></div>`,{pad:'16px'});
}
function guideData(d){
 const L=d.tiers,cur=d.cur;
 const rail=L?['Create a Web3 wallet','Deposit USDC into your wallet','Join Lighter and link your wallet','Deposit USDC into Lighter','Trade and get rewarded']
  :['Create a Web3 wallet',`Deposit ${cur} into your wallet`,`Join ${d.name} and link your wallet`,`Deposit ${cur} into ${d.name}`,'Trade and get rewarded'];
 // G-270 · G-437: 단계마다 Step N Title 하나(왼쪽 목록 = 오른쪽 패널 제목) + Step N Description(경고·안전 메시지 포함)
 const bodies=[(L?'Install a self-custody wallet, or sign up on Lighter with email to get a wallet made for you.':'Install a self-custody wallet such as MetaMask.')+' Keep your 12-word recovery phrase private. TetherMax never asks for a private key, recovery phrase or wallet signature.',
  'Check the receiving network before sending. Sending funds on the wrong network can cause permanent loss.',
  L?'Open Lighter through the TetherMax link and log in. Then copy your wallet address from Lighter and paste it in TetherMax. TetherMax never asks you to connect a wallet. After you sign up, confirm the TetherMax referral code on Lighter’s referral page. Cashback applies only to Plus and Premium accounts. Standard accounts pay no fees.'
   :`After you sign up, confirm the TetherMax referral code on ${d.name}’s referral page. Copy your public address from ${d.name} and paste it on TetherMax.`,
  `Transfer ${cur} to ${d.name}.`,'TetherMax pays your cashback into your TetherMax balance.'];
 return {rail,bodies};
}
function dtGuide(d,c){
 const g=guideData(d),cur=c==='step3'?2:c==='step2'?1:0;
 const item=(t,i)=>`<div class="row" style="gap:12px;height:56px;padding:12px 16px;border-radius:12px;box-sizing:border-box;${i===cur?'background:rgba(207,216,220,.2)':''}"><span style="width:32px;height:32px;border-radius:16px;flex:none;display:inline-flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;${i===cur?'background:var(--blue);color:rgba(255,255,255,.87)':'background:rgba(207,216,220,.2)'}">${i+1}</span><span class="b1 ${i===cur?'semi':'c2'}">${t}</span></div>`;
 const support=`<div class="col" style="gap:12px;background:rgba(0,123,255,.1);border-radius:8px;padding:16px"><img src="${A('dex-dt-ic-headset.svg')}" style="width:24px;height:24px" alt=""><span class="b2 semi">Stuck partway through?</span><span class="b2 c2">Live chat replies in about 2 minutes.</span><a class="cb" data-go="support.main" style="font-size:13px;font-weight:500;text-decoration:underline;cursor:pointer;padding:5px 5px;line-height:18px">Chat with support</a></div>`;
 const shot=`<img src="${A(cur===2&&d.tiers?'dex-dt-guide-lighter-3.jpg':'dex-dt-guide-lighter-1.jpg')}" style="width:100%;height:360px;object-fit:cover;border-radius:12px" alt="">`;
 const safe=cur!==0?`<p class="cap c2" style="margin:0">${T('TetherMax never asks for your private key, seed phrase, or a wallet signature.','테더맥스는 개인키 · 시드 문구 · 지갑 서명을 요구하지 않아요.')}</p>`:'';
 const panel=`<div class="col" style="flex:1 1 0;min-width:0;gap:16px;padding:${mo()?0:'0 16px 16px'}">${shot}<span style="align-self:flex-start;background:var(--blue-accentlight);color:var(--blue);border-radius:100px;padding:3px 9px;font-size:13px;line-height:18px">Step ${cur+1} of 5</span><span class="h5" style="line-height:32px">${g.rail[cur]}</span><p class="b2 c2" style="margin:0;line-height:20px">${g.bodies[cur]}</p>${safe}</div>`;
 const rail=`<div class="col" style="gap:4px;${mo()?'':'width:320px;flex:none'}">${g.rail.map(item).join('')}${mo()?'':'<div style="flex:1;min-height:56px"></div>'}${support}</div>`;
 const n=[];
 if(c==='step3'&&d.tiers)n.push('Step 3 — Figma D2(Lighter). 경고 문장은 Description 안(G-437), 영문은 정책 A-22 후보(사용자 확인 #37). Lighter 온보딩 보류');
 return box1056(`<div class="col" style="gap:24px"><span class="h5 bold" style="${mo()?'font-size:20px;line-height:1.6':''}">Step by step guide on starting your trading journey on ${d.name}</span><div style="display:flex;${mo()?'flex-direction:column;gap:24px':'gap:32px;align-items:stretch'}">${rail}${panel}</div>${n.map(C.note).join('')}</div>`);
}
function dtClosing(d){
 if(mo())return `<div style="padding:20px 0"><div style="position:relative;overflow:hidden;border-radius:8px;padding:32px 20px;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center;background:#fff"><img src="${A('dex-dt-closing-mo.jpg')}" style="position:absolute;left:0;top:-118.36%;width:100%;height:291.18%;pointer-events:none" alt=""><span style="position:relative;font-size:24px;line-height:1.334;color:#000">Start Earning Cashback with ${d.name}</span><button class="btn contained lg" style="position:relative;background:#2453f0;color:#fff">Join Now</button></div></div>`;
 return `<div style="padding:20px 0"><div style="max-width:1056px;margin:0 auto;border-radius:8px;overflow:hidden;background:#0a0b10 url(${A('dex-dt-closing.jpg')}) center/cover;padding:48px 16px;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:center"><span style="font-size:34px;line-height:1.235;font-weight:700;color:#fff">Start Earning Cashback with ${d.name}</span><button class="btn contained lg" style="background:#2453f0;color:#fff">Join Now</button></div></div>`;
}
function dtFaq(d,c){
 const ico=open=>`<span style="width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;font-size:24px;color:var(--action-active)">${open?'−':'+'}</span>`;
 const tail=d.cur==='USDC'||d.id==='edgex'?' Shown in USDT, 1:1 with USDC.':' Amounts are shown in USDT.';
 const secs=['General Partnership','Cashback & Referral Rewards','Points Program & Airdrop','Account Types & Eligibility','Prohibited Activity & Compliance','Withdrawals & Account Management','Contact & Support'];
 // 펼친 구역: 첫 구역(REQ-350) · faq2 상태는 6번째 `Withdrawals & Account Management`도(Figma CT-29 ② 29367:138679 — 운영자 입력 예시)
 const qa={0:[`How does TetherMax cashback work on ${d.name}?`,`Join ${d.name} through the TetherMax link and trade. Your cashback is credited to your TetherMax balance. Eligible balances of 10 USDT or more are paid automatically to your linked wallet.${tail}`],
  5:['How do I receive my cashback?','Your cashback is credited to your TetherMax balance. Eligible balances of 10 USDT or more are paid automatically to your linked wallet.']};
 const open=i=>i===0||(c==='faq2'&&i===5);
 const acc=(s,i)=>`<div style="border-bottom:1px solid var(--divider)"><div class="row between" style="padding:16px"><span class="b1 semi">${esc(s)}</span>${ico(open(i))}</div>${qa[i]&&(open(i)||window.SITED)?`<div class="col" style="gap:8px;padding:16px${open(i)?'':';display:none'}"><span class="b1 semi">${qa[i][0]}</span><span class="b1 c2">${qa[i][1]}</span></div>`:''}</div>`;
 return box1056(`<div class="col" style="gap:24px"><span class="h5 bold">FAQs</span><div>${secs.map(acc).join('')}</div><div class="row between" style="padding:16px"><span class="b1 semi">Terms and conditions</span>${ico(false)}</div>${C.note('FAQ 질문·답변은 운영자가 어드민에서 입력(G-265 · G-272 · G-439) — 여기 문구는 Figma 운영자 입력 예시(첫 구역 28960:127610 · `Withdrawals & Account Management` 29367:138679). 나머지 구역 내용은 어드민 입력값. 약관 서랍 본문은 거래소별 어드민 입력(G-369)')}</div>`);
}
function stars(v,sz=18){let h='';for(let i=1;i<=5;i++){const f=v>=i?1:v>=i-.5?.5:0;h+=f===1?`<img src="${A('dex-dt-ic-star-full.svg')}" style="width:${sz}px;height:${sz}px" alt="">`:f?`<span style="position:relative;width:${sz}px;height:${sz}px;display:inline-block"><img src="${A('dex-dt-ic-star-empty.svg')}" style="position:absolute;inset:0;width:${sz}px;height:${sz}px" alt=""><img src="${A('dex-dt-ic-star-full.svg')}" style="position:absolute;inset:0;width:${sz}px;height:${sz}px;clip-path:inset(0 50% 0 0)" alt=""></span>`:`<img src="${A('dex-dt-ic-star-empty.svg')}" style="width:${sz}px;height:${sz}px" alt="">`}return `<span class="row" style="gap:0">${h}</span>`}
function dtReviews(d,member,c){
 const empty=c==='reviewsEmpty';const n=empty?0:23;
 const head=`<div class="row between"><div class="row" style="gap:8px"><span class="h6">Global Reviews</span><span class="b2 c2">${n}</span></div>${member==='guest'?`<button class="btn contained primary md" style="width:150px;box-shadow:var(--elev2)" data-go="auth.signup">Sign up</button>`:''}</div>`;
 // 게스트 리뷰 안내 = Figma D4 리뷰 영역의 안내 카드(태그 줄 아래 · 1008×210: 제목 · 안내 · 전폭 Sign up 48)
 const gateCard=member==='guest'?`<div class="col" style="border:1px solid var(--divider);border-radius:8px;padding:${mo()?'32px 16px 16px':'60px 24px 16px'};gap:0;text-align:center"><span style="font-size:20px;line-height:32px;font-weight:600">Log in or sign up to write a review</span><span class="b1 c2" style="line-height:24px">After signing up, link your ${d.name} wallet address to post (anyone can read)</span><button class="btn contained primary" style="height:48px;width:100%;margin-top:30px" data-go="auth.signup">Sign up</button></div>`:'';
 const gate=member==='guest'?''
  :member==='unlinked'?`<p class="b2 c2" style="margin:0">${T(`Link your ${d.name} wallet to write a review.`)}</p>`:'';
 if(empty){
  // [기존 MAX-1216] S6 Empty — 0 reviews (22442:219830 · mobile 22956:84690): 헤더 줄 + 구분선 + 가운데 한 줄. 문구는 G-169 확정 `No reviews yet`
  const btn=member==='guest'?`<button class="btn contained primary md" style="width:150px;box-shadow:var(--elev2)" data-go="auth.signup">Sign up</button>`:member==='linked'||member==='return'?C.btn('Write a review',{size:'md'}):'';
  return `<div style="padding:${mo()?'16px 0 40px':'32px 0 80px'}"><div style="max-width:1056px;margin:0 auto;background:#fff;border:1px solid var(--divider);border-radius:${mo()?0:16}px;padding:${mo()?'24px 16px':'24px'}" class="col"><div class="row between" style="padding-bottom:16px;border-bottom:1px solid var(--divider)"><div class="row" style="gap:8px"><span class="h6">Global Reviews</span><span class="b2 c2">0</span></div>${btn}</div>${gate?`<div style="padding-top:12px">${gate}</div>`:''}<p class="b2 c2" style="margin:0;padding:48px 0 ${mo()?40:50}px;text-align:center">${T('No reviews yet','아직 작성된 리뷰가 없습니다')}</p>${C.note('[기존 MAX-1216] S6 Empty — 0 reviews 배치(헤더·구분선·가운데 한 줄). 기존 문구 <code>Be the first to review.</code> 대신 G-169 확정 <code>No reviews yet</code>, 요약·히스토그램·AI 요약 숨김, 탭 <code>Reviews (0)</code>(REQ-355). DEX(revision) 상태 정의 S5_19 <code>Global Reviews (0)</code>(29002:128806).')}</div></div>`;
 }
 const hist=[['5 Stars',7],['4 Stars',13],['3 Stars',2],['2 Stars',1],['1 Star',0]].map(([l,v])=>`<div class="row" style="gap:12px"><span class="cap ${v?'c2':'c3'}" style="width:44px">${l}</span><div style="flex:1;height:8px;border-radius:999px;background:var(--divider);overflow:hidden;${v?'':'opacity:.5'}">${v?`<div style="width:40%;height:100%;background:var(--blue);border-radius:999px"></div>`:''}</div><span class="cap ${v?'c2':'c3'}" style="width:30px">(${v})</span></div>`).join('');
 const axis=(v,l)=>`<div class="col" style="gap:2px;align-items:center"><span class="h5">${v}</span><span class="cap c2">${l}</span></div>`;
 const vdiv=mo()?'<hr class="divider">':'<div style="width:1px;height:99px;background:var(--divider)"></div>';
 const summary=`<div style="border:1px solid var(--divider);border-radius:12px;padding:24px;display:flex;${mo()?'flex-direction:column;gap:16px':'gap:24px;align-items:center'}"><div class="col" style="gap:4px;align-items:center"><span style="font-size:48px;line-height:1.2;font-weight:600">4.0</span>${stars(3.5)}<span class="b2 c2">23 reviews</span></div>${vdiv}<div class="col" style="flex:1;gap:4px">${hist}</div>${vdiv}<div class="row" style="gap:12px;justify-content:center">${axis('4.2','Overall experience')}${axis('4.2','Cashback earning')}${axis('3.7','Cashback payouts')}</div></div>`;
 const ai=`<div class="col" style="gap:10px;background:rgba(0,49,198,.04);border-radius:12px;padding:16px 20px 18px"><span class="row b2 semi" style="gap:6px;color:var(--blue)"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" style="flex:none;display:block"><path d="M12.9733 5.33333L13.5 4.16666L14.6667 3.63999C14.9267 3.51999 14.9267 3.15333 14.6667 3.03333L13.5 2.50666L12.9733 1.33333C12.8533 1.07333 12.4867 1.07333 12.3667 1.33333L11.84 2.49999L10.6667 3.02666C10.4067 3.14666 10.4067 3.51333 10.6667 3.63333L11.8333 4.15999L12.36 5.33333C12.48 5.59333 12.8533 5.59333 12.9733 5.33333ZM7.66667 6.33333L6.60667 3.99999C6.37334 3.47999 5.62667 3.47999 5.39334 3.99999L4.33334 6.33333L2.00001 7.39333C1.48001 7.63333 1.48001 8.37332 2.00001 8.60666L4.33334 9.66666L5.39334 12C5.63334 12.52 6.37334 12.52 6.60667 12L7.66667 9.66666L10 8.60666C10.52 8.36666 10.52 7.62666 10 7.39333L7.66667 6.33333ZM12.36 10.6667L11.8333 11.8333L10.6667 12.36C10.4067 12.48 10.4067 12.8467 10.6667 12.9667L11.8333 13.4933L12.36 14.6667C12.48 14.9267 12.8467 14.9267 12.9667 14.6667L13.4933 13.5L14.6667 12.9733C14.9267 12.8533 14.9267 12.4867 14.6667 12.3667L13.5 11.84L12.9733 10.6667C12.8533 10.4067 12.48 10.4067 12.36 10.6667Z" fill="currentColor"/></svg><span>AI review summary</span></span>
  <div class="col" style="gap:6px">${[['Cashback reaches my TetherMax balance every day.',11],[`Frequent traders notice the cashback on ${d.tiers?'Premium ':''}fees.`,7],['Support replies quickly, even at weekends.',4]].map(([t,k])=>`<div class="row" style="gap:10px;align-items:flex-start"><span class="b2 semi" style="color:var(--blue)">·</span><span class="b2 semi grow" style="line-height:20px">${t}</span><span class="cap c2" style="line-height:20px">(${k} reviews)</span></div>`).join('')}</div>
  <span class="cap c2" style="line-height:20px">From real reviews, summarised by AI. Wording may differ from individual reviews.</span></div>`;
 const tagChip=(t,on,big)=>`<span style="border:1px solid #bdbdbd;border-radius:100px;padding:${big?'6px 10px':'3px 10px'};font-size:13px;line-height:18px;${on?'background:rgba(0,0,0,.12)':''}">${t}</span>`;
 const tags=`<div class="row wrap" style="gap:6px;padding:9px 12px 10px;border-radius:10px"><span class="cap c2" style="line-height:20px">Browse by tag</span>${tagChip('#'+d.name,1,1)}${tagChip('#Fee',0,1)}${tagChip('#Cashback',0,1)}</div>`;
 const sorts=['Newest','Oldest','Highest rated','Lowest rated','Most useful'];
 const SW=[81,75,119,116,106];   // Figma 정렬 탭 폭(28960:127454)
 const sort=`<div class="row" style="gap:${mo()?12:25}px;${mo()?'overflow-x:auto':''}"><div class="row" style="gap:0">${sorts.map((s,i)=>`<span style="padding:9px 16px;${mo()?'':`width:${SW[i]}px;box-sizing:border-box;`}font-size:14px;font-weight:500;white-space:nowrap;${i===0?'color:var(--blue);border-bottom:2px solid var(--blue)':'color:var(--text-secondary)'}">${s}</span>`).join('')}</div><span class="cap c2" style="white-space:nowrap">23 reviews</span></div>`;
 const thumb=(n,l)=>`<span class="row b2 c2" style="gap:5px"><img src="${A('dex-dt-ic-thumb-'+n+'.svg')}" style="width:16px;height:16px" alt=""><span>${l}</span></span>`;
 const rv=(o)=>`<div class="col" style="gap:${o.mod?16:8}px;padding:${o.mod?'24px 0':'20px 0 18px'};border-bottom:1px solid var(--divider)">
  ${o.mod?'':`<div class="row between"><span class="row" style="gap:6px">${stars(o.v)}<span style="font-size:13px">${o.v}</span></span><span class="cap c2">${o.date}</span></div>`}
  <div class="row" style="gap:8px"><span style="width:32px;height:32px;border-radius:999px;background:${o.col};color:#fff;display:inline-flex;align-items:center;justify-content:center" class="b2 semi">${o.nick[0]}</span><span class="b2 semi">${o.nick}</span><span class="row" style="gap:3px;color:var(--success)"><span class="b2 semi">✓</span><span style="font-size:12px;font-weight:500">Verified</span></span></div>
  ${o.mod?`<div class="col" style="gap:4px;background:var(--action-selected);border-radius:8px;padding:12px 16px"><span class="b1 semi">This review is under moderation</span><span class="cap c2">It was flagged and is hidden while our team checks it against the review guidelines.</span></div>`
   :`<span class="b1 semi" style="line-height:24px">${o.title}</span><span class="b2" style="line-height:20px">${o.body}</span><span style="font-size:13px;line-height:18px;color:var(--blue);margin-top:2px">Read more</span><div class="row" style="gap:8px">${tagChip('#'+d.name,1,1)}${tagChip('#Fee',0,1)}</div>
  <div class="row between"><span class="row" style="gap:14px"><span class="b2">Helpful?</span>${thumb('up','Yes 12')}${thumb('down','No')}</span><span class="row cap" style="gap:8px">${o.tr?`<span class="c2">Translated from Korean</span><span class="cb">Show original</span>`:`<span class="cb">Show translation</span>`}</span></div>`}</div>`;
 const list=[{v:3.3,date:'2026-08-30',col:'#c77333',nick:'연동고민중',title:'A question about linking',body:'Does it support ApeX too? I linked my Lighter wallet already and I am not sure whether a second DEX needs a separate verification step.',tr:1},
  ...(c==='moderation'?[{v:1.0,date:'2026-08-29',col:'#6b5ca5',nick:'익명트레이더',mod:1}]:[]),
  {v:4.7,date:'2026-08-28',col:'#338c73',nick:'차트보는곰',title:'몇 군데 비교하고 여기로 정했어요',body:'여러 DEX를 비교해보고 수수료 때문에 여기로 정했어요. 캐시백이 매주 들어오고 출금이 막힌 적도 없습니다.'}];
 const pag=`<div class="row center" style="gap:6px;padding-top:8px">${['«','‹','1','2','3','4','5','6','7','›','»'].map((p,i)=>`<span style="width:26px;height:26px;border-radius:100px;display:inline-flex;align-items:center;justify-content:center;font-size:14px;${p==='1'?'background:var(--blue);color:#fff':i<2?'opacity:.38':''}">${p}</span>`).join('')}</div>`;
 const mnote=c==='moderation'?C.note('검토 중 리뷰 — 제목·본문 숨김 + <code>This review is under moderation</code> 줄(REQ-354·362) · 디자인 없음'):'';
 return `<div style="padding:${mo()?'16px 0 40px':'32px 0 80px'}"><div style="max-width:1056px;margin:0 auto;background:#fff;border:1px solid var(--divider);border-radius:${mo()?0:16}px;padding:${mo()?'24px 29px':'24px'}" class="col" >${[head,gate,summary,ai,tags,gateCard,`<div style="border-top:1px solid var(--divider);padding-top:18px">${sort}</div>`,`<div>${list.map(rv).join('')}</div>`,pag,mnote].filter(Boolean).join('<div style="height:2px"></div>')}</div></div>`;
}
function dtMyReview(){
 return `<div style="max-width:${mo()?'none':'1200px'};margin:0 auto;padding:${mo()?'24px 16px':'36px 0 24px'};display:flex;align-items:center;justify-content:space-between"><span style="font-size:${mo()?20:28}px;font-weight:600">My review</span>${outlinedP('Write a Review',{size:'lg'})}</div>`;
}
function dtDrawer(d,maker){
 const x=calc(d,maker);
 const cap=t=>`<span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${t}</span>`;
 const row=(k,v,sub)=>`<div class="col" style="gap:4px"><div class="row between" style="font-size:16px;line-height:1.5;font-weight:600;letter-spacing:.15px"><span>${k}</span><span class="cb" style="white-space:nowrap">${v}</span></div><span style="font-size:13px;line-height:18px;letter-spacing:.16px;color:var(--text-secondary)">${sub}</span></div>`;
 const num=v=>`<span style="font-size:20px;line-height:1.6;font-weight:700">${v}</span>`,op=t=>`<span class="b1 c2">${t}</span>`;
 const lbl=(t,w,c)=>`<span style="width:${w}px;font-size:12px;line-height:1.33;letter-spacing:.2px;text-align:center;color:${c||'var(--text-secondary)'}">${t}</span>`;
 const echo=`<div style="background:var(--blue-accentlight);border:1px solid var(--blue);border-radius:10px;padding:14px 16px" class="col"><div class="row between">${num(usd(x.fee))}${op('−')}${num(usd(x.cb))}${op('=')}${num(usd(x.eff))}</div><div class="row between" style="align-items:flex-start">${lbl('Normal trading fee',69)}<span style="width:10px"></span>${lbl('Cashback',63,'var(--blue)')}<span style="width:10px"></span>${lbl('Effective fee',66)}</div></div>`;
 return `<div style="width:343px;max-width:100%;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.24);overflow:hidden;text-align:left">
  <div class="row" style="align-items:flex-start;justify-content:space-between;padding:24px 20px 16px 24px"><div class="col" style="gap:4px;flex:1"><span style="font-size:20px;line-height:1.6;font-weight:700;letter-spacing:.15px">How your cashback is worked out</span><span class="b2 c2">Move the slider and all three numbers change together.</span></div><button data-go="dex.detail:edgex" style="width:32px;height:32px;border-radius:999px;border:0;background:var(--action-hover);color:var(--text-secondary);font-size:14px;cursor:pointer">✕</button></div>
  <hr class="divider" style="margin:0">
  <div class="col" style="gap:24px;padding:24px">${cap('WHAT YOU CHOOSE')}<div class="col" style="gap:16px">${row('Total volume','$400K','How much you trade in a month. Drag the slider to match your own trading.')}${row('Taker or Maker',maker?'Maker':'Taker','Exchanges charge two different fees. Taker is when you take an order that is already there. Maker is when you place one that waits.')}</div>
   ${cap('WHAT WE WORK OUT')}${echo}<div class="col" style="gap:16px">${row('Normal trading fee',usd(x.fee),'What the exchange would charge you on that volume, without TetherMax.')}${row('Cashback',usd(x.cb),'The part of that fee TetherMax sends back to your account.')}${row('Effective fee',usd(x.eff),'What the trade really costs you once the cashback arrives.')}</div>
   <div class="col" style="gap:8px"><span class="b2 med c2">WHERE THE MONEY COMES FROM</span><div class="col" style="gap:8px;background:var(--action-hover);border-radius:10px;padding:12px 14px;font-size:13px"><span style="line-height:18px;letter-spacing:.16px">The exchange pays TetherMax a partner settlement for your trading. TetherMax returns most of it to you. Nothing is added to your fee.</span><span class="cb" role="button" tabindex="0" data-full-flow style="font-weight:500;line-height:1.5;cursor:pointer">See the full flow&nbsp; ↓</span></div></div>
   ${cap('These are estimates. Final amounts vary by exchange, tier and trading activity.')}</div>
  <hr class="divider" style="margin:0"></div>`;
}
function dtPage(c){
 const id=['aster','apex','lighter','edgex'].includes(c)?c:c==='step3'||c==='step2'||c==='signupReturn'||c==='faq2'?'lighter':'edgex';
 const d=DX[id];
 const member=c==='normal'?'guest':c==='unlinked'?'unlinked':c==='linked'?'linked':c==='signupReturn'?'return':c==='pendingLink'?'pending':({guest:'guest',s3:'unlinked',s4:'linked'}[S.auth]||'guest');
 const maker=c==='maker';
 const notes=[];
 if(c==='lighter')notes.push('Lighter 상세(Premium/Plus) — <b>Lighter 온보딩 후 표시(현재 보류)</b>. Plus 요율 미수신이라 Premium 값만. V2.2 <code>exd/DETAIL#lighter</code>');
 if(c==='maker')notes.push('Maker 토글 — D4(28960:127454) 오퍼 박스·계산기의 Taker/Maker 토글 컴포넌트를 Maker 선택 변형으로 재사용, 단계 표 열 <code>Final Maker</code>(REQ-339·364). Maker 선택 화면 프레임은 없음(기존 상세 [MAX-22] maker/taker rate 6042:67360 · [MAX 1216] Fee compare popover 23312:168910도 토글 선택 변형만 보여 줌). V2.2 <code>exd/DETAIL#maker</code>');
 if(c==='normal'||c==='edgex')notes.push('EdgeX 요율: Figma D4 상세 단계표(0.0600 → 0.0400 → 0.0184%)와 개요 카드(0.0266%)가 서로 달라 REQ-339(헤드라인·After cashback = 카드 값)에 맞춰 레코드 표본으로 통일 — 실값 G-045');
 if(member==='guest')notes.push('게스트 CTA <code>Sign Up</code> → 회원가입. 가입 뒤 이 DEX가 미리 선택된 연동 모달로 복귀(G-402 확정)');
 if(member==='unlinked')notes.push('미연동 CTA <code>Link Wallet</code> → 이 DEX가 미리 선택된 연동 모달(<code>link.addr</code>). V2.2 <code>exd/DETAIL#unlinked</code>');
 if(member==='return')notes.push('가입 후 복귀(Signup + Link Wallet / 3 Return, 28960:127422) — 회원 GNB, 오퍼 박스 주 버튼이 <code>Link Wallet</code>(contained), <code>Get Started</code>는 outlined로 낮춤. <code>Link Wallet</code> → 이 DEX가 미리 선택된 연동 모달(G-402). Figma 예시는 Lighter(온보딩 보류 G-428) — 실제로는 가입 전에 보던 DEX. GNB는 상단 도구의 회원 토글을 따른다(회원·연동0 선택)');
 if(member==='pending')notes.push('확인 중 지갑만 있는 회원 — 오퍼 박스 연동 버튼 자리를 비활성 「확인 중」 표시로(결정 Q6 B). 문구는 홈 행 확인 중 칩과 같은 <code>연동 시도중이에요</code>(홈 모듈 ST.pend — 영문 원문 없어 EN에서도 같은 문자열). 버튼 모양은 연동 완료 <code>Auto Claim</code>과 같은 비활성 외곽선 버튼. 귀속 확인은 대부분 즉시 응답이라 짧게 나타남');
 if(member==='linked')notes.push('연동 완료 — 출금 자리는 비활성 <code>Auto Claim</code>(10분 주기 자동 지급), 리뷰 쓰기. V2.2 <code>exd/DETAIL#linked</code>');
 if(c==='offboarded')return `<div style="padding:8px 16px">${C.note('DEX 오프보딩 — 상세 URL <code>/dex/{slug}</code>는 DEX 랜딩으로 301 리다이렉트(REQ-121·358). 아래는 리다이렉트된 랜딩 · 디자인 없음. V2.2 <code>exd/DETAIL#offboarded</code>')}</div>${ovPage('normal')}`;
 const top=`${notes.length?`<div style="padding:8px 16px">${notes.map(C.note).join('')}</div>`:''}`;
 const sticky=mo()&&member==='guest'?`<div style="position:sticky;bottom:0;z-index:5;background:#fff;padding:16px;display:flex;flex-direction:column;gap:8px;box-shadow:0 -1px 0 var(--divider)"><button class="btn contained primary lg full" data-go="auth.signup" data-after="link.addr:${d.name.toLowerCase()}">Sign Up${ext()}</button><button class="btn outlined black lg full" data-go="auth.login" data-after="link.addr:${d.name.toLowerCase()}">Already have an account?</button></div>${C.note('모바일 게스트 하단 고정 CTA — DEX(revision) 모바일 D4 「sticky bottom CTA (guest)」(I28960:131011;27610:306639): <code>Sign Up</code> + <code>Already have an account?</code>. 모바일 오퍼 박스에는 <code>Get Started</code>만 있다.')}`:'';
 return `${top}${dtHero(d,member,maker)}${member==='linked'?dtMyReview():''}${dtTabs(c)}${dtWhy(d)}${dtStructure(d,maker)}${dtGuide(d,c)}${dtClosing(d)}${dtFaq(d,c)}${dtReviews(d,member,c)}${sticky}`;
}

R.screen({id:'dex.detail',group:'dex',title:'DEX 상세 (공용 템플릿)',route:'/dex/{slug}',fu:['FU-054','FU-055','FU-056','FU-057','FU-058','FU-059'],
 shell:{nav:'cashback',accent:true,back:'dex.overview'},
 states:[
  {id:'normal',label:'게스트 — EdgeX',figma:{pc:'28960:127454',mo:'29360:144056'},note:'V2.2 exd/DETAIL#normal · Figma D4 EdgeX + 「DEX detail / Guest」(28969:129578) 오퍼 박스'},
  {id:'edgex',label:'EdgeX (회원 상태는 상단 토글)',figma:{pc:'28960:127454',mo:'29360:144056'},note:'공용 템플릿 EdgeX — 회원 상태는 상단 게스트/연동0/연동 토글을 따른다'},
  {id:'unlinked',label:'회원 · 미연동 — Link Wallet',figma:{pc:'28969:129666'},note:'V2.2 exd/DETAIL#unlinked · Figma 「DEX detail / Member without a linked wallet」(Lighter 예시) · 상태 정의 S5_14 `Link your EdgeX wallet`(29002:128667). 모바일은 회원 오퍼 프레임 없음 → 모바일 D4(28960:131011) 오퍼 박스에 PC 회원 CTA를 얹음'},
  {id:'signupReturn',label:'가입 후 복귀 — Link Wallet 주 버튼 강조',figma:{pc:'28960:127422'},note:'Figma 「Signup + Link Wallet / 3 Return」(28960:127422, 연동 담당 요청). 모바일 프레임 없음 → 모바일 D1/D4 오퍼 박스에 같은 버튼 배치'},
  {id:'linked',label:'회원 · 연동 완료 — Auto Claim · 리뷰 쓰기',figma:{pc:'28969:129751'},note:'V2.2 exd/DETAIL#linked · Figma 「DEX detail / Member with a linked wallet」 · 상태 정의 S5_15 `Your linked account`(29002:128699). 모바일 회원 오퍼 프레임 없음 → 모바일 D4 오퍼 박스 재사용'},
  {id:'maker',label:'Maker 토글 (D4 토글 선택 변형 재사용)',note:'V2.2 exd/DETAIL#maker · 재사용: D4 28960:127454 Taker/Maker 토글'},
  {id:'aster',label:'Aster',figma:{pc:'29357:147710',mo:'29360:145006'},note:'V2.2 exd/DETAIL#aster · Figma D5'},
  {id:'apex',label:'ApeX',figma:{pc:'29357:148976',mo:'29360:145980'},note:'V2.2 exd/DETAIL#apex · Figma D6'},
  {id:'lighter',label:'Lighter — Premium/Plus (온보딩 후 — 보류)',figma:{pc:'29357:143619',mo:'29360:146954'},note:'V2.2 exd/DETAIL#lighter · Figma D1 · 연동 모달 배경으로도 쓰임'},
  {id:'drawer',label:'How this works 드로어 (REQ-344)',figma:null,note:'디자인 없음 — [기존 MAX-1216] S21(22544:808136 · 모바일 22988:114502)은 CEX 상세 전체 페이지로 `How this works` 진입 링크만 있고 열린 모습이 없음. 내용은 V2.2 exd/DETAIL#drawer · 상태 정의 S5_12(29002:128605)'},
  {id:'step2',label:'단계 가이드 Step 2 (Lighter)',figma:{pc:'29386:137364'},note:'Figma CT-28 「Step 2 선택」 — 본문은 DEX(revision) `DEX guide / Step 2 of 5`(28981:129056) 원문(8차 결정)'},
  {id:'step3',label:'단계 가이드 Step 3 (Lighter)',figma:{pc:'29357:144968',mo:'29360:142096'},note:'V2.2 exd/DETAIL#step3 · Figma D2'},
  {id:'faq2',label:'FAQ 두 구역 펼침 — Withdrawals & Account Management',figma:{pc:'29367:138679'},note:'Figma CT-29 ② — 첫 구역과 `Withdrawals & Account Management` 동시 펼침. 질문·답변은 운영자 입력 예시(8차 결정)'},
  {id:'moderation',label:'리뷰 검토 중',figma:{pc:'27392:937',mo:'27392:1062'},note:'[기존 MAX-1216] Reviews / Card · State=In moderation(27392:937 · 모바일 27392:1062) · 상태 정의 S5_20(29002:128826) · V2.2 exd/DETAIL#moderation'},
  {id:'reviewsEmpty',label:'리뷰 없음 (G-169)',figma:{pc:'29367:137704',mo:'29369:136809'},note:'Figma D3 「Reviews 0」(29367:137704 · 모바일 29369:136809) · 문구는 G-169 `No reviews yet` · V2.2 exd/DETAIL#reviewsEmpty'},
  {id:'pendingLink',label:'확인 중 지갑만 있음 — 연동 버튼 자리 비활성 「확인 중」',figma:null,note:'근거: DEX 상세 회원 오퍼 박스(28969:129666 · 28969:129751)의 버튼 자리 + 홈 행 확인 중 표기(<code>연동 시도중이에요</code>) · 결정 Q6 B. <b>Figma 미반영 — 승인 후 Figma에 추가</b>'},
  {id:'offboarded',label:'DEX 오프보딩 — 랜딩 리다이렉트',note:'V2.2 exd/DETAIL#offboarded · 상태 정의 S5_16 `Exchange unavailable`·S5_17 자동 이동(29002:128736·128761) — 결정(301 리다이렉트)대로 별도 화면 없음'},
 ],
 render(st,ctx){
  if(st==='drawer'&&!ctx.asBg)return `<div style="position:relative">${dtPage('edgex')}<div class="scrim pt-fixed" data-drawer-scrim style="display:block;padding:0"><div class="pt-side-drawer" style="position:absolute;top:0;right:0;bottom:0;width:${mo()?'100%':'420px'};background:#fff;overflow:auto;box-shadow:-8px 0 24px rgba(0,0,0,.2)">${dtDrawer(DX.edgex,false).replace('width:343px;max-width:100%;background:#fff;border-radius:16px;box-shadow:0 12px 40px rgba(0,0,0,.24)','width:100%;background:#fff;border-radius:0;box-shadow:none')}</div></div></div>`;
  return dtPage(st);
 }});
