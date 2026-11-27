// 7. 캐시백 허브 — FU-045 ~ FU-048 (V2.2 hub/HUB 18개 상태 + Figma에만 있는 H3·H4)
// Figma: DEX(revision) › "DEX — Cashback Hub Web [Selected Design]" (H1 · H2 · H3 · H4 · H7 · H8 · H1-CEX · H1-Broker, H5 참고),
//        "DEX — Cashback Hub Mobile [Selected Design]" 라이트 프레임. H9·H10(Aster 귀속 만료)은 숨김 폐기안이라 쓰지 않는다.
// "Hub withdraw, Exchanges Web"(HC1~HC6, 회원 출금 팝업·퍼즐·이메일 인증)은 10분 주기 자동 지급(정책 6-1 · G-412: CEX·DEX 모두)과
// 충돌하므로 만들지 않는다. 출금 자리는 비활성 `Auto Claim`.
// 모든 H 프레임은 같은 컴포넌트(GNB · hero(HA5) · routes + compare table · why sign up · footer) 인스턴스다 → 섹션 함수를 상태마다 재사용.

// ---------- 표본 레코드 (Figma 비교표 값. Final = 수수료 × (1 − 캐시백율), G-150) ----------
const HB_DEX=[ // 순서 = Figma 표 순서(전역 순위, G-151)
 {id:'edgex',name:'EdgeX',taker:.038,maker:.015,rate:30},
 {id:'apex',name:'ApeX',taker:.05,maker:.02,rate:30},
 {id:'lighter',name:'Lighter',tier:'Premium',taker:.028,maker:.004,rate:20},
 {id:'aster',name:'Aster',taker:.035,maker:0,rate:20},
];
const cx=(id,name,taker,maker,rate,rating)=>({id,name,taker,maker,rate,rating,lg:'t-'+id});
const HB_CEX=[ // Figma H1-CEX 비교표 16행
 cx('bitget','Bitget',.06,.02,50,[4.2,23]),cx('okx','OKX',.05,.02,25,[4.6,41]),cx('bybit','Bybit',.055,.02,45),cx('binance','Binance',.05,.02,20),
 cx('mexc','MEXC',.02,0,40),{...cx('gate','Gate',.05,.02,35,[3.9,27]),lg:'gate'},{...cx('deepcoin','DeepCoin',.06,.02,70),lg:'deepcoin'},cx('bingx','BingX',.05,.02,50),
 cx('bitmex','BitMEX',.05,.02,70),cx('lbank','LBank',.06,.02,65),cx('blockfin','BlockFin',.05,.02,70),{...cx('kucoin','Kucoin',.05,.02,65),lg:'kucoin'},
 cx('zoomex','Zoomex',.05,.02,50),cx('bitunix','Bitunix',.05,.02,85),cx('biofin','BioFin',.05,.02,70),cx('bvox','BVOX',.05,.02,60),
];
const HB_BRK=[ // Figma H1-Broker 비교표 (lot 기준)
 {id:'rs',name:'RS Finance',cb:'$21 / lot',comm:'$30.00 / lot',disc:'$9.00 / lot',est:42,lg:'rs'},
 {id:'infinox',name:'INFINOX',cb:'Up to 84% off',comm:'$7.00 / lot',disc:'$1.40 / lot',est:11.2,lg:'infinox'},
];
const HB_CEX_LOGOS=['binance','okx','bitget','bybit','gate','mexc','woox','bingx','deepcoin','bitmart','kucoin','htx','coincatch','toobit','flipster','lbank']; // 라우트 행 로고(Figma)
const HB_VOL=100000;
const fl2=n=>Math.floor((n+1e-9)*100)/100;
const usd=n=>'$'+fl2(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const usd0=n=>'$'+n.toLocaleString('en-US');
const amt=n=>fl2(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})+' USDT';
const pct4=n=>(Math.round(n*1e4+1e-7)/1e4).toFixed(4)+'%';
const mo=()=>S.vp==='mo';
const WALLET='0x7a3f9c2e4b1d8a6f5e0c3b2a1d9e8f7c6b5a4d3e';

// ---------- 공통 조각 ----------
const rule=()=>`<img src="${A('hub-rule.svg')}" alt="" style="width:100%;height:1px;display:block">`;
function logo(id,size=32){const d=HB_DEX.find(x=>x.id===id);if(d)return C.dex(d.name,size);
 return `<img src="${A(`hub-logo-${id}.png`)}" alt="" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex:none">`}
const plogo=(p,size)=>HB_DEX.includes(p)?logo(p.id,size):logo(p.lg,size);
const routeList=r=>r==='DEX'?HB_DEX:r==='CEX'?HB_CEX:HB_BRK;
const upTo=r=>r==='Brokers'?84:Math.max(...routeList(r).map(p=>p.rate)); // Brokers: INFINOX `Up to 84% off`(lot 기준이라 % 요율 레코드 없음)
const lineKV=(k,sub,v,o={})=>`<div class="row between" style="align-items:flex-start;gap:12px"><div class="col" style="gap:2px"><span class="b1${o.kc?' '+o.kc:''}">${k}</span>${sub?`<span class="${o.subSize||'cap'} c2">${sub}</span>`:''}</div><span class="b1 tnum${o.vc?' '+o.vc:''}" style="white-space:nowrap">${v}</span></div>`;
const bigLine=(k,v)=>mo()?`<div class="col" style="gap:4px"><span class="b1 semi">${k}</span><span class="h4 cb tnum">${v}</span></div>`
 :`<div class="row between" style="align-items:baseline;gap:12px"><span class="b1 semi">${k}</span><span class="h4 cb tnum" style="white-space:nowrap">${v}</span></div>`;
const capRow=(a,b,o={})=>`<div class="row b2 c2" style="gap:24px;flex-wrap:wrap"><span${o.blue?' class="cb"':''}>${a}</span><span>${b}</span></div>`;
const stars=r=>`<span class="col" style="gap:0;align-items:flex-end"><span class="row" style="gap:0">${[1,2,3,4,5].map(i=>`<img src="${A(i<=Math.floor(r[0]+.1)?'hub-star-on.svg':'hub-star-off.svg')}" alt="" style="width:18px;height:18px">`).join('')}</span><span class="cap"><b>${r[0]}</b> <span class="c2">(${r[1]})</span></span></span>`;

// 라우트 세그먼트 탭 (CEX · DEX · Brokers) — 선택 = 흰 채움 + 그림자 + semibold. 모바일 라벨 CEXs · DEXs · Brokers(Figma 모바일)
function seg(route){
 const it=[['CEX','hub-ic-cex.svg',mo()?'CEXs':T('Centralised Exchanges','중앙화 거래소'),'cex'],['DEX','hub-ic-dex.svg',mo()?'DEXs':T('Decentralised Exchanges','탈중앙화 거래소'),'normal'],['Brokers','hub-ic-fx.svg','Brokers','brokers']];
 return `<div class="row" style="background:var(--action-hover);border-radius:12px;padding:4px;gap:0;justify-content:space-between">${it.map(([k,i,l,s])=>{const on=k===route;
  return `<span class="row" style="gap:8px;padding:10px 12px;border-radius:8px;white-space:nowrap;cursor:pointer;${mo()?'flex:1;justify-content:center;':''}${on?'background:#fff;box-shadow:0 4px 10px rgba(0,0,0,.1)':''}" data-go="hub.main:${s}"><img src="${A(i)}" alt="" style="width:20px;height:20px;${on?'':'opacity:.7'}"><span class="b2${on?' semi':' c2'}">${l}</span></span>`}).join('')}</div>`}
function partnerSel(p,extra){return `<div class="col" style="gap:8px;flex:1;min-width:0"><span class="b2 med c2" style="line-height:24px">PARTNER</span><div class="row" style="gap:10px;border:1px solid var(--divider);border-radius:12px;padding:10px 12px;background:#fff;cursor:pointer">${plogo(p,28)}<span class="b1 semi grow">${esc(p.name)}${extra?`<span class="b2 c2" style="font-weight:400;margin-left:12px">${extra}</span>`:''}</span>${ic('arrow-drop-down')}</div></div>`}

// 영수증 카드 (계산기 · 잔액 패널 공용) — 흰 카드 + 아래 찢김 + 우상단 3D 계산기
function receipt(inner){
 const calc3d=`<img src="${A('hub-calc-3d.png')}" alt="" style="position:absolute;${mo()?'right:-14px;top:-56px;width:80px;height:80px':'right:-110px;top:-64px;width:158px;height:158px'};transform:rotate(-8deg);pointer-events:none">`;
 return `<div style="width:${mo()?'100%':'608px'};position:relative">${calc3d}<div class="col" style="background:#fff;border-radius:4px 4px 0 0;box-shadow:0 24px 48px rgba(0,0,0,.12);padding:${mo()?'24px 20px':'32px'};gap:24px">${inner}</div><img src="${A('hub-torn.svg')}" alt="" style="width:100%;height:10px;display:block"></div>`}
const rHead=t=>`<span class="b1 med" style="line-height:24px">${t}</span>`;
const autoClaim=()=>C.btn('Auto Claim',{full:true,disabled:true});

// ---------- 계산기 (CASHBACK ESTIMATE) FU-045 ----------
function calcCard(route,o={}){
 const p=route==='DEX'?HB_DEX.find(x=>x.id===(o.pid||'lighter')):route==='CEX'?HB_CEX.find(x=>x.id==='bybit'):HB_BRK[0];
 const range=route==='DEX'?['$1K','$250K']:route==='CEX'?['$10K','$500K']:['$10K','$20M'];
 const slider=`<div class="col" style="gap:0"><div style="position:relative;height:25px"><div style="position:absolute;left:0;right:0;top:11px;height:4px;border-radius:100px;background:var(--blue);opacity:.15"></div><div style="position:absolute;left:0;top:10px;width:44px;height:6px;border-radius:100px;background:var(--blue)"></div><img src="${A('hub-slider-thumb.svg')}" alt="" style="position:absolute;left:33px;top:-1px;width:30px;height:30px"></div>
  <div class="row between cap c2"><span>${range[0]}</span><span>${range[1]}</span></div></div>`;
 const inputs=`<div class="row" style="gap:24px;align-items:flex-start;${mo()?'flex-direction:column;align-items:stretch':''}">${partnerSel(p)}<div class="col" style="gap:8px;flex:1"><span class="sub2 c2">Monthly trading volume</span><span class="h5">${usd0(HB_VOL)}</span></div></div>`;
 let body;
 if(o.rateFail){
  body=`<div class="col" style="gap:12px;padding:24px 0;align-items:center;text-align:center"><span class="h6">Estimate unavailable</span>${C.btn('Try again',{v:'outlined',c:'primary',size:'md'})}</div>`;
 }else{
  let fees,cb,after,feeSub,cbLbl,afterLbl='Trading fees after cashback';
  if(route==='Brokers'){fees=60;cb=42;after=18;feeSub='RS Finance commission, $30.00 / lot';cbLbl='Cashback, $21.00 / lot';afterLbl='Trading cost after cashback'}
  else{fees=fl2(HB_VOL*p.taker/100);cb=fl2(fees*p.rate/100);after=fl2(fees-cb);
   feeSub=route==='CEX'?`${esc(p.name)} taker fee, ${pct4(p.taker)}`:`${esc(p.name)}${p.tier?' '+p.tier:''} taker, ${pct4(p.taker)}`;cbLbl=`Cashback, ${p.rate}%`}
  body=`${lineKV('Trading fees',feeSub,usd(fees))}
   ${lineKV(cbLbl,T('Paid to your TetherMax balance','테더맥스 잔액으로 적립돼요'),'−'+usd(cb),{kc:'semi cb',vc:'semi cb',subSize:'b2'})}
   ${rule()}${lineKV(afterLbl,'',usd(after))}${bigLine('Estimated monthly cashback',usd(cb))}
   ${capRow(`Per day ${usd(cb/30)}`,`Per year ${usd(cb*12)}`)}`;
 }
 const member=o.member?capRow(T('Paid to your TetherMax balance','테더맥스 잔액으로 적립돼요'),'Minimum 10 USDT'):'';
 const learn=C.btn('Learn More',{v:'outlined',c:'primary',full:true,go:route==='DEX'?`dex.detail:${p.id}`:route==='CEX'?'cex.list':''});
 return receipt(`${rHead('CASHBACK ESTIMATE')}${rule()}${seg(route)}${inputs}${slider}${rule()}${body}${member}${o.rateFail?'':learn}`)+
  C.note(o.rateFail?'요율 서비스 실패: 숫자 대신 `Estimate unavailable` + `Try again`(G-144 확정 · DEX(revision) 상태 정의 S5_11 29002:128580 전환 「다시 불러오기」). `$0` 표시 금지, 탭은 계속 사용 가능(REQ-296). 영수증·버튼은 H1 계산기 컴포넌트 재사용(실패 화면 프레임 없음). V2.2 `hub/HUB#rateFail`.':
   `계산식: Trading fees = 월 거래량 × taker fee · Cashback = fees × 캐시백율 · 일 = 월 ÷ 30, 연 = 월 × 12, 2자리 <b>절삭</b>(REQ-293·317 — Figma의 반올림 값 \`Per day $0.19\`·\`$0.83\` 대신 \`$0.18\`·\`$0.82\`). 슬라이더 범위는 Spending Estimate 설정값(Figma: DEX $1K~$250K · CEX $10K~$500K · Brokers $10K~$20M). 계산기 각주 문구 원문 없음(REQ-292).${route==='Brokers'?' Brokers는 lot 기준 수수료(Figma H1-Broker 표본).':''}`)}

// ---------- 잔액 패널 (YOUR CASHBACK) FU-046 ----------
function panelCard(c){
 // CEX 패널 (H3 · H4) — Figma에만 있는 상태
 if(c==='cexPanel'||c==='cexBelowMin'){
  const low=c==='cexBelowMin',[a,b]=low?[5,2]:[28.4,4],w=fl2(a+Math.min(a,b));
  let n=0;while(fl2(a+n+Math.min(b,a+n))<10&&n<10)n=fl2(n+.01);
  const sub2=T('From events. Invitation rewards are separate.','이벤트에서 받은 리워드예요. 초대 리워드는 따로 쌓여요.');
  return receipt(`${rHead('YOUR CASHBACK')}${rule()}${seg('CEX')}<div class="row">${partnerSel(HB_CEX.find(x=>x.id==='bybit'))}</div>${bigLine('Total available cashback',amt(w))}${rule()}
   ${lineKV('Total exchange cashback','From your Bybit trades',amt(a))}${lineKV('Total event reward',sub2,amt(b),{subSize:'b2'})}${rule()}
   ${low?capRow(T(`You can claim if you receive an additional ${amt(n).replace(' USDT','')} USDT in exchange cashback.`,`거래소 캐시백을 ${amt(n).replace(' USDT','')} USDT 더 받으면 출금할 수 있어요.`),'Minimum 10 USDT',{blue:true}):capRow(`Claimable ${amt(w)}`,'Minimum 10 USDT')}
   ${autoClaim()}<p class="cap c2" style="margin:0">${low?'Minimum per account: 10 USDT.':'Cashback is paid to your TetherMax balance.'}</p>`)+
   C.note(low?'H4 CEX 잔액 10 USDT 미만 — 넛지는 G-139 확정 문구(Figma `Just 3.00 USDT more to qualify.` 대신), 금액은 매칭 기준 부족분(A=5 · B=2 → 3.00). Figma에만 있는 상태(정책 B-5-4 유효).':'H3 CEX UID 연동 — Figma에만 있는 상태(정책 B-5-4 유효). 금액 = 매칭 후 A + MIN(B, A). `Events and invites` 하위 줄은 정책상 틀림(G-140 미정).')}
 const pid={aster:'aster',lighterAccruing:'lighter'}[c]||'edgex';
 const p=HB_DEX.find(x=>x.id===pid);
 const multi='';
 const sel=`<div class="row">${partnerSel(p,c==='dexMulti'?'+1':'')}</div>${multi}`;
 const head=`${rHead('YOUR CASHBACK')}${rule()}${seg('DEX')}${sel}`;
 const dest=`<p class="cap c2" style="margin:0">${T(`Cashback is sent automatically to your linked ${esc(p.name)} wallet.`,`캐시백은 연동한 ${esc(p.name)} 지갑으로 자동 지급돼요.`)}</p>`;
 const paid=capRow(T('Paid to your TetherMax balance','테더맥스 잔액으로 적립돼요'),'Minimum 10 USDT');
 if(c==='dexLoading')return receipt(`${head}<div class="col" style="gap:14px">${C.skel('60%',28)}${C.skel('100%',18)}${C.skel('100%',18)}${C.skel('40%',14)}</div>${autoClaim()}`)+C.note('로딩: 0 대신 스켈레톤(REQ-301). 근거: DEX(revision) 지갑 잔액 카드 메모(29026:97581) 「조회 중에는 스켈레톤」 — 같은 잔액 줄 자리에 코어 스켈레톤(C.skel). 로딩 화면 프레임 자체는 없음. V2.2 `hub/HUB#dexLoading`.');
 if(c==='dexError')return receipt(`${head}<span class="b1 semi">Cashback could not load</span>${C.btn('Try again',{v:'outlined',c:'primary',full:true})}${autoClaim()}<p class="cap c2" style="margin:0">We could not load your cashback. Please try again.</p>`)+
  C.note('H7 잔액 로드 실패 — Figma H7은 CEX(Bybit) 탭이고 `Auto Claim` 버튼이 없음. DEX 탭으로 옮기고, REQ-301 「버튼은 항상 비활성 `Auto Claim`」에 따라 버튼을 둠. 0 표시 금지.');
 if(c==='dexPanel')return receipt(`${head}${bigLine(T('Paid to your TetherMax balance','테더맥스 잔액으로 적립돼요'),'3.10 USDT')}${rule()}${lineKV('Total exchange cashback','Paid records, reported by EdgeX','3.10 USDT')}${rule()}${lineKV('Reported next day','','1.25 USDT')}${paid}${autoClaim()}${dest}`)+
  C.note('H8 EdgeX 지갑 연동 — Figma 그대로(표본 금액 3.10 · 1.25). 큰 숫자 라벨이 H5(`Total available cashback`)와 다르고, REQ-300 원문(`Withdrawable {amount} USDT` · `Total event reward` · 각주 `You withdraw on TetherMax, …`)과도 다름 → 질문_hub #3.');
 // H5 구성 재사용: Total available cashback · Total exchange cashback + Reported by · Total event reward · Claimable · Total claimed · Paid to / Minimum · Auto Claim · 각주
 const v={dexPartial:[3,8],dexBelowMin:[4,3],dexMulti:[12,0],aster:[18,0],totalClaimed:[100,20],lighterAccruing:[120,5]}[c]||[100,20];
 const [a,b]=v,w=fl2(a+Math.min(a,b));
 const reported=c==='aster'?'Reported by Aster, USDT value at payout':`Reported by ${p.name}`;
 let n=0;if(c==='dexBelowMin')while(fl2(a+n+Math.min(b,a+n))<10&&n<10)n=fl2(n+.01);
 const lines=`${lineKV('Total exchange cashback',reported,amt(a))}${b>0?`${rule()}${lineKV('Total event reward','',amt(c==='dexPartial'?Math.min(a,b):b))}`:''}`;
 let need=0;if(c==='dexPartial')while(fl2(a+need+Math.min(b,a+need))<10&&need<10)need=fl2(need+.01);
 const partial=c==='dexPartial'?`<div class="col" style="gap:0;font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)"><span>Matched ${amt(Math.min(a,b)).replace(' USDT','')} / ${amt(b)} in event rewards</span><span>Claimable ${amt(w)} · Minimum 10 USDT</span>${w<10?`<span>Additional exchange cashback needed: ${amt(need)}</span>`:''}</div>`:'';
 const claimable=c==='dexPartial'?'':`<span class="b1">${T(`Claimable ${amt(w)}`,`출금 가능 ${amt(w)}`)}</span>`;
 const claimed=lineKV('Total claimed','',c==='totalClaimed'?'240.00 USDT':'0.00 USDT');
 const multiNote=c==='dexMulti'?`<p class="b2 c2" style="margin:0">${T('Wallets: 12.00 (auto-paid next cycle) · 4.00 (not included)','지갑 12.00(다음 10분 주기 자동 지급) · 4.00(제외)')}</p>`:'';
 const accr='';
 const bottom=c==='dexBelowMin'?`${rule()}${capRow(T(`You can claim if you receive an additional ${amt(n).replace(' USDT','')} USDT in exchange cashback.`,`거래소 캐시백을 ${amt(n).replace(' USDT','')} USDT 더 받으면 출금할 수 있어요.`),'Minimum 10 USDT',{blue:true})}${autoClaim()}<p class="cap c2" style="margin:0">${T('Cashback is claimed automatically once your claimable amount reaches 10 USDT.','출금 가능액이 10 USDT가 되면 자동으로 출금돼요.')}</p>${dest}`
  :`${paid}${autoClaim()}${dest}`;
 const notes={
  dexPartial:'A=3 · B=8 → 3 + MIN(8, 3) = 6.00. 패널은 H5(28960:126908) 구성, 매칭 설명 3줄은 DEX(revision) 지갑 잔액 카드 「부분 매칭 · 최소액 미만」(29026:97704) 문구·스타일 그대로(<code>Matched … in event rewards</code> · <code>Claimable … · Minimum 10 USDT</code> · <code>Additional exchange cashback needed</code>). Total event reward 줄 = 매칭된 금액 min(A,B). V2.2 `hub/HUB#dexPartial`(V2.2 안내 문장 대신 Figma 문구).',
  dexBelowMin:'H4(28960:126902) — 웹 SCREEN-LABEL `DEX & CEX balance under 10 USDT`(28960:126903)라 DEX에도 이 프레임. 프레임은 CEX 탭이라 DEX 탭 · H5 줄 구성으로 그림. 넛지 = G-139 확정 문구(DEX(revision) 지갑 카드의 `Additional exchange cashback needed: {n} USDT`와 다름 — 결정대로), 금액은 매칭 기준 부족분(A=4 · B=3 → 3.00) + `Minimum 10 USDT` + 각주(REQ-301). 버튼은 숨기지 않고 비활성.',
  dexMulti:'파트너 선택 `EdgeX   +1` 표기 = DEX(revision) 상태 정의 S4_18 `EdgeX   +1`(29002:128037, 전환 「선택한 패널 유지」). 같은 DEX 지갑 2개(12 · 4) → 12 USDT 지갑만 다음 10분 주기 자동 지급, 4 USDT 지갑 제외(REQ-302). 패널은 H5 구성 재사용(전용 프레임 없음). V2.2 `hub/HUB#dexMulti`.',
  aster:'Aster: `Reported by Aster, USDT value at payout`(REQ-300). H9·H10(귀속 만료)은 범위 밖 폐기안. 패널은 H5(28960:126908) 구성 재사용 — 이벤트 리워드 0이면 Total event reward 줄 숨김(DEX(revision) 상태 정의 S4_22 「이벤트 행 숨김」 29002:128137). `USDT value at payout` 줄 디자인은 어디에도 없음. V2.2 `hub/HUB#aster`.',
  totalClaimed:'`Total claimed` 유지(G-053 확정) — 테더맥스를 통해 지급한 누계, `Sent` 시 증가(REQ-307). H5 패널 줄(Figma 29352:145077, 기본 0.00 USDT) — 이 상태는 누계가 있는 표본(240.00). V2.2 `hub/HUB#totalClaimed`.',
  lighterAccruing:'Lighter: Figma H5의 `Accruing this week (estimate)` 3.20 USDT 추정 줄은 G-100 확정(주중 「집계 전」, 추정치 미표시)으로 쓰지 않음. 나머지는 H5 구성. 「집계 전」 표시 자리·영문 문구는 어디에도 없음(DEX(revision) 상태 정의 S6_06 `DEX data pending` 29002:129262는 캐시백 요약 쪽) → C.tbd 유지. Lighter 온보딩 보류(G-428).',
 };
 return receipt(`${head}${bigLine('Total available cashback',amt(w))}${rule()}${lines}${accr}${claimable}${claimed}${partial}${multiNote}${bottom}`)+(notes[c]?C.note(notes[c]):'')}

// ---------- 히어로 (HA5) ----------
function hero(right,route){
 const badge={CEX:'hub-badge-cex.png',DEX:'hub-badge-dex.png',Brokers:'hub-badge-fx.png'};
 const order=route==='CEX'?['Brokers','CEX','DEX']:route==='Brokers'?['DEX','Brokers','CEX']:['CEX','DEX','Brokers'];
 const bg='background:radial-gradient(ellipse 60% 55% at 76% 52%,#9ccbf0 0%,rgba(156,203,240,0) 70%),linear-gradient(160deg,#cfe9ff 0%,#bbe2ff 45%,#a9d6f7 100%)';
 const copy=`<div class="col" style="gap:${mo()?12:24}px"><h1 class="h2" style="margin:0;${mo()?'font-size:36px;line-height:1.2':'width:560px'}">Trade, Earn Back. Repeat.</h1><p class="${mo()?'b2':'b1'} c2" style="margin:0;${mo()?'':'width:480px'}">Compare cashback opportunities across exchanges and brokers in one place.</p></div>`;
 if(mo())return `<section style="${bg};padding:32px 16px 40px" class="col g24">${copy}<div class="row center"><img src="${A(badge[route])}" alt="" style="width:200px;height:200px;object-fit:contain"></div><div style="position:relative">${right}</div></section>`;
 return `<section style="position:relative;height:922px;${bg}">
  <div style="position:absolute;inset:0;overflow:hidden">
  <img src="${A('hub-badge-glow.svg')}" alt="" style="position:absolute;left:96px;top:552px;width:536px;height:186px">
  <img src="${A(badge[order[0]])}" alt="" style="position:absolute;left:-132px;top:432px;width:240px;height:240px;opacity:.45;object-fit:contain">
  <img src="${A('hub-badge-shadow.svg')}" alt="" style="position:absolute;left:111px;top:593px;width:507px;height:288px">
  <img src="${A(badge[order[1]])}" alt="" style="position:absolute;left:124px;top:352px;width:480px;height:480px;object-fit:contain">
  <img src="${A(badge[order[2]])}" alt="" style="position:absolute;left:572px;top:432px;width:240px;height:240px;opacity:.45;object-fit:contain"></div>
  <div style="position:absolute;left:120px;top:88px">${copy}</div>
  <div style="position:absolute;left:712px;top:72px">${right}</div>
 </section>`}

// ---------- 라우트 선택 블록 FU-047 ----------
function routes(){
 // 순서 CEX → DEX → Brokers 고정(G-138 확정). Figma는 DEX → CEX → Broker(하드코딩). 강조(파란 화살표)는 Figma의 DEX 행 hover 표현
 const rows=[
  {k:'CEX',ic:'hub-3d-dex.png',name:'Centralised exchanges',sub:'For futures traders on exchanges',logos:HB_CEX_LOGOS.map(id=>logo(id)),cap:'Claimed automatically from 10 USDT',unit:'futures cashback',go:'cex.list'},
  {k:'DEX',ic:'hub-3d-cex.png',name:'Decentralised exchanges',sub:'For traders who keep their own keys',logos:['lighter','apex','edgex','aster'].map(id=>logo(id)),cap:'Claimed automatically from 10 USDT',unit:'trading fee cashback',go:'dex.overview'},
  {k:'Brokers',ic:'hub-3d-fx.png',name:'Brokers',sub:'For forex and CFD traders',logos:HB_BRK.map(p=>logo(p.lg)),cap:'Forex, commodities and indices',unit:'cashback',go:'brokers.list'},
 ];
 const row=r=>{const on=r.k==='DEX';
  const lg=`<div class="row wrap" style="gap:12px 0;max-width:${mo()?"320px":"250px"}">${r.logos.map(l=>`<span style="margin-right:-6px;display:inline-flex;border-radius:50%">${l}</span>`).join('')}</div>`;
  const go=`<span style="width:50px;height:50px;border-radius:999px;flex:none;display:inline-flex;align-items:center;justify-content:center;${on?'background:var(--blue);border:1px solid var(--blue)':'border:1px solid var(--divider)'}"><img src="${A(on?'hub-go-on.svg':'hub-go.svg')}" alt="" style="width:24px;height:24px"></span>`;
  const at=r.go?` data-go="${r.go}" style="cursor:pointer;`:` style="`;
  if(mo()){const rt=`<div class="col" style="gap:0;align-items:flex-end;text-align:right;flex:none"><span class="b2 med c2" style="line-height:24px">UP TO</span><span${on?' class="cb"':''} style="font-size:34px;line-height:1.235;letter-spacing:.25px">${upTo(r.k)}%</span><span class="b2 c2" style="margin-top:10px">${r.unit}</span></div>`;
   const lgm=`<div class="row wrap" style="gap:12px 0">${r.logos.map(l=>`<span style="margin-right:-6px;display:inline-flex;border-radius:50%">${l}</span>`).join('')}</div>`;
   const bottom=r.k==='CEX'?`<div class="col" style="gap:12px"><span class="b2 med c2" style="line-height:24px">PARTNERS</span>${lgm}<div class="row between" style="align-items:flex-start;gap:12px"><span class="b2 c2" style="max-width:165px;margin-top:23px">${r.cap}</span>${rt}</div></div>`
    :`<div class="row between" style="align-items:flex-start;gap:12px"><div class="col" style="gap:12px"><span class="b2 med c2" style="line-height:24px">PARTNERS</span>${lgm}${r.k==='DEX'?'':`<span class="b2 c2">${r.cap}</span>`}</div>${rt}</div>`;
   return `<div class="col" data-m-lift${at}background:#fff;border-radius:8px;padding:20px 16px;gap:16px"><div class="row" style="gap:12px"><img src="${A(r.ic)}" alt="" style="width:56px;height:56px;border-radius:12px"><div class="col grow" style="gap:8px"><span class="h6" style="line-height:32px">${r.name}</span><span class="b2 c2">${r.sub}</span></div>${go}</div>${bottom}</div>`}
  const rate=`<div class="col" style="gap:0"><span class="b2 med c2" style="line-height:24px">UP TO</span><span class="h2${on?' cb':''}">${upTo(r.k)}%</span><span class="b2 c2">${r.unit}</span></div>`;
  return `<div class="row" data-m-lift${at}background:#fff;border-radius:8px;padding:32px 24px;gap:32px"><img src="${A(r.ic)}" alt="" style="width:96px;height:96px;border-radius:16px;flex:none"><div class="col" style="width:360px;gap:8px;flex:none"><span class="h5">${r.name}</span><span class="b1 c2">${r.sub}</span></div><div class="col" style="width:260px;gap:12px;flex:none"><span class="b2 med c2" style="line-height:24px">PARTNERS</span>${lg}<span class="b2 c2">${r.cap}</span></div><div class="grow">${rate}</div>${go}</div>`};
 const t=T('Pick where you trade','어디서 거래하시나요?'),d='Every route pays back a share of your trading fees. Open one to see its partners and rates.';
 const head=mo()?`<div class="col" style="gap:12px"><h2 class="h3" style="margin:0;font-size:34px">${t}</h2><p class="b2 c2" style="margin:0">${d}</p></div>`
  :`<div class="row between" style="align-items:flex-start;gap:120px"><h2 class="h3" style="margin:0;width:504px">${t}</h2><p class="b1 c2" style="margin:8px 0 0;width:576px">${d}</p></div>`;
 return `${head}<div class="col" style="gap:16px;margin-top:32px;filter:drop-shadow(0 10px 10px rgba(0,0,0,.06))">${mo()?'':rule()}${rows.map(row).join('')}</div>
  <p class="b2 c2" style="margin:32px 0 0">"Up to" is the highest rate among the partners on that route. Each partner's own rate is in the table and on its page.</p>
  ${C.note('라우트 순서 CEX → DEX → Brokers 고정(G-138 확정 — Figma는 DEX 첫 행). `UP TO` = 그 라우트 레코드 최고 요율 계산값(REQ-297): CEX 85%(Bitunix) — Figma 하드코딩 90%와 다름, Brokers 84%는 INFINOX `Up to 84% off`. 세 번째 줄은 Figma `Automatic payouts from 10 USDT`(정책 RT-3 원문 `Paid daily, withdraw from 10 USDT`와 다름 → 질문_hub #4). 행 → DEX 랜딩 / CEX 목록, Brokers 페이지는 목적지 없음(링크 없이 렌더).')}`}

// ---------- 비교표 FU-048 ----------
function compare(chip,c){
 const list=routeList(chip),n=list.length,brk=chip==='Brokers';
 const title=brk?`Compare cashback across ${n} brokers`:mo()&&chip==='DEX'?`Compare cashback across ${n} DEXs`:`Compare cashback across ${n} exchanges`;
 const sub=brk?'Monthly cashback at 2 lots a month, from the calculator above.':`Monthly cashback at ${usd0(HB_VOL)} monthly trading volume, from the calculator above.`;
 const ph=chip==='DEX'?'Search for a DEX':brk?'Search for a broker':'Search for a partner';
 const est=p=>brk?p.est:fl2(HB_VOL*p.taker/100*p.rate/100);
 const top=list.reduce((m,p)=>m==null||est(p)>est(m)?p:m,null);
 const chips=[['CEX',mo()?'CEX':'Centralised Exchanges','cex'],['DEX',mo()?'DEX':'Decentralised Exchanges','normal'],['Brokers','Brokers','brokers']].map(([k,l,s])=>`<span class="chip" style="border:0;height:auto;padding:${mo()?'7px 10px':'4px 10px'};border-radius:100px;line-height:18px;${k===chip?'background:var(--blue);color:#fff':'background:var(--action-selected)'}" data-go="hub.main:${s}">${l}</span>`).join('');
 const view=c==='cards'?'card':'table';
 const toggle=mo()?'':`<div class="row" style="border:1px solid var(--divider);border-radius:8px;padding:2px;gap:0">${[['table','hub-ic-list.svg','normal'],['card','hub-ic-grid.svg','cards']].map(([k,i,s])=>`<span style="width:36px;height:36px;border-radius:6px;display:inline-flex;align-items:center;justify-content:center;${k===view?'background:var(--divider)':''}" data-go="hub.main:${s}"><img src="${A(i)}" alt="" style="width:20px;height:20px"></span>`).join('')}</div>`;
 const es=c==='emptySearch';
 const search=`<div class="row" style="gap:12px"><div class="row grow" style="border:${es?'2px solid var(--blue)':'1px solid var(--input-border)'};border-radius:4px;padding:${es?'7px 11px':'8px 12px'};gap:8px;background:#fff"><img src="${A('hub-ic-search.svg')}" alt="" style="width:24px;height:24px"><span class="b2 grow ${es?'':'c3'}" style="line-height:20px">${es?'Hyperliquid':ph}</span>${es?`<span title="Clear" style="cursor:pointer;display:inline-flex">${ic('close')}</span>`:''}</div>${toggle}</div>`;
 const go=p=>chip==='DEX'?`dex.detail:${p.id}`:chip==='CEX'?'cex.list':'';
 const join=p=>C.btn(`Join ${esc(p.name)}`,{v:'outlined',c:'primary',size:'md',go:go(p)});
 const hp=p=>p===top?C.badge('Highest payout','blue'):'';
 const sortIc=`<img src="${A('hub-sort.svg')}" alt="" style="width:5px;height:8px;margin-left:6px;display:inline-block;vertical-align:middle">`;
 const box='background:#fff;border-radius:8px;box-shadow:0 10px 20px rgba(0,0,0,.06)';
 let body;
 if(es){
  body=`<p class="b2 c2" style="margin:0;padding:6px 0">No exchanges match your search</p>`+C.note('[기존 MAX-22] mWeb allPartnerExchanges(5145:50887) 빈 검색 배치: 검색창(포커스 · 입력값 · 오른쪽 X로 검색어 지우기) 아래 왼쪽 정렬 한 줄. 기존 문구 <code>No results found for {검색어}</code> 대신 G-151 확정 <code>No exchanges match your search</code>. 검색어 지우기 = 검색창 X(기존 컴포넌트) — 별도 버튼 없음. PC 빈 검색 프레임은 없어 같은 배치를 씀. V2.2 <code>hub/HUB#emptySearch</code>.');
 }else if(mo()){
  // Figma 모바일 카드: 로고·이름·chevron / Up to N% cashback ⓘ / Final Taker · Final Maker
  body=`<div class="col" style="gap:16px">${list.map(p=>`<div class="col" data-go="${go(p)}" style="${box};border:1px solid var(--divider);box-shadow:none;padding:16px;gap:12px;cursor:pointer"><div class="row" style="gap:8px">${plogo(p,32)}<span class="b1 semi grow">${esc(p.name)}</span>${hp(p)}${ic('chevron-right','ic20')}</div>
   <span class="b1 semi">${brk?esc(p.cb):`Up to ${p.rate}% cashback`} <span style="display:inline-flex;width:16px;height:16px;border:1.5px solid var(--text-secondary);border-radius:50%;font-size:10px;align-items:center;justify-content:center;color:var(--text-secondary);vertical-align:middle">i</span></span><hr class="divider">
   <div class="row between b2"><span><span class="c2">${brk?'Commission':'Final Taker'}</span> <b>${brk?p.comm:pct4(p.taker*(1-p.rate/100))}</b></span><span><span class="c2">${brk?'Discounted':'Final Maker'}</span> <b>${brk?p.disc:pct4(p.maker*(1-p.rate/100))}</b></span></div></div>`).join('')}</div>`+
   (view==='card'?C.note('카드 뷰: 모바일은 원래 카드(G-151). 평점 생략(REQ-313).'):C.note('모바일 비교표 = 카드(G-151 확정 · Figma 모바일 H1). 카드 전체가 그 거래소 상세로 이동(정책 B-5-8).'));
 }else if(view==='card'){
  const card=p=>`<div class="col" data-m-lift style="background:#fff;border:1px solid var(--divider);border-radius:14px;padding:18px 20px 20px;gap:10px">
   <div class="row" style="align-items:center;gap:16px"><div class="col" style="gap:6px"><div class="row" style="gap:16px"><span class="row" style="gap:8px">${plogo(p,24)}<span style="font-size:20px;line-height:1.6;font-weight:700;letter-spacing:.15px">${esc(p.name)}</span></span>${hp(p)}</div>
    <span class="row" style="gap:4px"><span class="b1 semi cb">${brk?esc(p.cb):`Up to ${p.rate}% cashback`}</span></span></div><span class="grow"></span>${C.btn(`Join ${esc(p.name)}`,{go:go(p)})}</div>
   <div style="height:1px;background:var(--divider)"></div>
   <div class="row between b2"><span class="row" style="gap:6px"><span class="c2">${brk?'Commission':'Final Taker'}</span><b class="semi">${brk?p.comm:pct4(p.taker*(1-p.rate/100))}</b></span><span class="row" style="gap:6px"><span class="c2">${brk?'Discounted':'Final Maker'}</span><b class="semi">${brk?p.disc:pct4(p.maker*(1-p.rate/100))}</b></span></div></div>`;
  body=`<div class="col" style="gap:16px">${list.map(card).join('')}</div>`+
   C.note('[기존 MAX-1216] CMT-08 Exchange list — CARD view(22807:98684)의 exchange card(22807:99777) 값 그대로: 로고 24 · 이름 20 Bold · 파란 줄 + 정보 아이콘 · 구분선 · Final Taker/Maker · 오른쪽 contained 버튼. 버튼 문구는 허브 표의 <code>Join {partner}</code>(REQ-311, 기존 <code>View {exchange}</code>), 파란 줄은 <code>Up to {rate}% cashback</code>(기존 <code>{n}% Total Savings</code>). 부스트 칩·평점은 레코드 없음 → 생략(REQ-313). V2.2 <code>hub/HUB#cards</code>.');
 }else{
  const th=(l,w,al='right',u)=>`<th style="background:#fff;border:0;padding:16px 8px;width:${w};text-align:${al};font-weight:400;color:var(--text-secondary);white-space:nowrap">${u?`<span style="text-decoration:underline dotted">${l}</span>`:l}${sortIc}</th>`;
  const cols=brk?[['Cashback','130px',1],['Commission','140px'],['Discounted commission','190px'],['Est. monthly cashback','180px'],['Rating','140px']]:[['Cashback','130px',1],['Final Taker','150px'],['Final Maker','150px'],['Est. monthly cashback','180px'],['Rating','150px']];
  const cell=(p,i)=>brk?[p.cb,p.comm,p.disc,usd(p.est),'-'][i]:[p.rate+'%',pct4(p.taker*(1-p.rate/100)),pct4(p.maker*(1-p.rate/100)),usd(est(p)),p.rating?stars(p.rating):'-'][i];
  body=`<div style="${box};padding:0 16px 24px"><table class="tbl" style="table-layout:fixed"><thead><tr><th style="background:#fff;border:0;width:28px;font-size:10px;color:var(--text-secondary);font-weight:400;padding:16px 4px">#</th>${th(chip==='DEX'?'DEX':brk?'Broker':'Exchange','200px','left')}${cols.map(([l,w,u])=>th(l,w,'right',u)).join('')}<th style="background:#fff;border:0"></th></tr></thead>
   <tbody>${list.map((p,i)=>`<tr><td style="border:0;padding:16px 4px;font-size:12px;text-align:center">${i+1}</td><td style="border:0;padding:16px 8px"><span class="row" style="gap:8px">${plogo(p,24)}<span class="b2 semi">${esc(p.name)}</span>${hp(p)}</span></td>${cols.map((_,k)=>`<td class="r semi tnum" style="border:0;padding:16px 8px">${cell(p,k)}</td>`).join('')}<td class="r" style="border:0;padding:16px 8px">${join(p)}</td></tr>`).join('')}</tbody></table></div>`;
 }
 return `<div class="col" style="gap:16px;margin-top:${mo()?40:32}px"><div class="row" style="gap:16px"><h3 class="h5 bold" style="margin:0;${mo()?'font-size:20px':'white-space:nowrap'}">${title}</h3>${mo()?'':'<span class="grow" style="height:1px;background:var(--divider)"></span>'}</div>
  <p class="b2 c2" style="margin:0">${sub}</p>${search}<div class="row wrap" style="gap:8px">${chips}</div>${body}</div>
  ${C.note('비교표: 레코드 자동 생성. Final Taker/Maker = 레코드 수수료 × (1 − 캐시백율) 계산값, `Highest payout` = 현재 필터 최고 1개(Figma에 없음, G-150 확정), `Live Campaigns` 컬럼 삭제. Rating 리뷰 20개 미만 `-`(REQ-313). 행 끝 `Join {partner}` → 그 거래소의 테더맥스 상세(REQ-311). Figma CEX 표 Bitunix 옆 `Chip` 자리표시는 내용 없어 뺌.')}`}

// ---------- 게스트 이유 카드 (RT-7) ----------
function why(){
 const cards=[['hub-why-support.png','Support in 2 minutes','Responsive customer support, query attended in 2 minutes.','Speak to us','support.main'],['hub-why-events.png','More cashback from events','Earn more cashbacks by completing tasks and exchange event challenges.','See Benefits','benefits.list'],['hub-why-invite.png','Invite friends, earn more','Grow your cashback when you invite partners and friends.','Find out more','invite.main']];
 return `<section style="padding:${mo()?'24px 16px 64px':'24px 120px 96px'};background:var(--bg-accent)"><h2 class="h5" style="margin:0 0 ${mo()?24:32}px;${mo()?'font-size:20px':''}">Why sign up with TetherMax?</h2><div class="${mo()?'col':'row'}" style="gap:${mo()?16:24}px;align-items:stretch">${cards.map(([i,t,b,l,go])=>`<div class="col" style="flex:1;background:#fff;border:1px solid var(--divider);border-radius:8px;padding:${mo()?21:28}px;gap:12px"><img src="${A(i)}" alt="" style="width:${mo()?56:72}px;height:${mo()?56:72}px;object-fit:cover"><span class="h6">${t}</span><span class="b1 c2">${b}</span><span class="b2 semi cb" data-go="${go}" style="cursor:pointer;white-space:pre">${l}  →</span></div>`).join('')}</div></section>`}

// ---------- 페이지 조립 ----------
const GUEST=['normal','cex','brokers','rateFail','cards','emptySearch'];
const PANEL=['dexPanel','dexPartial','dexBelowMin','dexLoading','dexError','dexMulti','aster','totalClaimed','lighterAccruing','cexPanel','cexBelowMin'];
function shell(guest,body){
 // 허브 상태가 회원 여부를 정한다 → 헤더도 상태에 맞춰 그린다(도구의 게스트/회원 토글과 무관). 셸은 코어 함수(gnb·moTop·footer) 그대로 — 모바일 웹에는 하단 탭 없음
 const keep=S.auth;S.auth=guest?'guest':'s4';
 const top=mo()?moTop(''):gnb('cashback');S.auth=keep;
 return `${top}<div class="page accent">${body}</div>${footer()}`}

R.screen({id:'hub.main',group:'hub',title:'캐시백 허브',route:'/cashback-hub',fu:['FU-045','FU-046','FU-047','FU-048'],shell:false,
 states:[
  {id:'normal',label:'게스트 · DEX 탭 계산기 (H1)',figma:{pc:'28960:126884',mo:'28960:130794'},note:'V2.2 hub/HUB#normal · 기본 파트너는 Figma대로 Lighter(온보딩 보류 G-428 — 질문_hub #1)'},
  {id:'cex',label:'게스트 · CEX 탭 (H1-CEX, Bybit $100,000)',figma:{pc:'28960:126944',mo:'28960:130854'},note:'V2.2 hub/HUB#cex · 검증값 $55.00 / −$24.75 / $30.25 / $24.75'},
  {id:'brokers',label:'게스트 · Brokers 칩 비교표 (H1-Broker)',figma:{pc:'28960:126950',mo:'28960:130860'},note:'V2.2 hub/HUB#brokers'},
  {id:'member',label:'로그인 · 연동 0 — 이유 카드 없음 (H2)',figma:{pc:'28960:126890',mo:'28960:130800'},note:'V2.2 hub/HUB#member'},
  {id:'cexPanel',label:'CEX UID 연동 — CEX 잔액 패널 (H3)',figma:{pc:'28960:126896',mo:'28960:130806'},note:'Figma에만 있는 상태 — 정책 B-5-4 「로그인 · 선택 파트너에 연동 계정 있음 → YOUR CASHBACK」 유효'},
  {id:'cexBelowMin',label:'CEX 잔액 10 USDT 미만 (H4)',figma:{pc:'28960:126902',mo:'28960:130812'},note:'Figma에만 있는 상태 — 정책 B-5-4 유효 · 넛지 문구는 G-139'},
  {id:'dexPanel',label:'DEX 잔액 패널 — EdgeX 지갑 연동 (H8)',figma:{pc:'28960:126926',mo:'28960:130836'},note:'V2.2 hub/HUB#dexPanel'},
  {id:'dexPartial',label:'A=3 · B=8 — 일부만 출금',note:'V2.2 hub/HUB#dexPartial · 재사용: H5 패널 + 지갑 잔액 카드 「부분 매칭 · 최소액 미만」(29026:97704)'},
  {id:'dexBelowMin',label:'최소액 미만 — 넛지 (H4 · DEX & CEX)',figma:{pc:'28960:126902',mo:'28960:130812'},note:'V2.2 hub/HUB#dexBelowMin · H4 웹 라벨 `DEX & CEX balance under 10 USDT`(28960:126903)'},
    {id:'dexLoading',label:'패널 로딩',note:'V2.2 hub/HUB#dexLoading · 재사용: H5 패널 + 코어 스켈레톤(지갑 카드 메모 29026:97581 「조회 중에는 스켈레톤」)'},
  {id:'dexError',label:'패널 로드 실패 (H7 — CEX 탭 시안을 DEX로)',figma:{pc:'28960:126920',mo:'28960:130830'},note:'V2.2 hub/HUB#dexError · Figma H7은 Bybit(CEX) 탭'},
  {id:'dexMulti',label:'같은 DEX 복수 지갑 +N',note:'V2.2 hub/HUB#dexMulti · 재사용: H5 패널 · `EdgeX +1` 표기는 상태 정의 S4_18(29002:128037)'},
  {id:'aster',label:'Aster — USDT value at payout',note:'V2.2 hub/HUB#aster · 재사용: H5 패널 · H9·H10은 숨김 폐기안이라 쓰지 않음'},
  {id:'totalClaimed',label:'Total claimed (G-053 유지)',note:'V2.2 hub/HUB#totalClaimed · 재사용: H5 패널 + 기존 `Total Claimed` 줄(29035:97792)'},
  {id:'noLedger',label:'원장 미수신 DEX → 계산기 (H2와 같은 화면)',figma:{pc:'28960:126890',mo:'28960:130800'},note:'V2.2 hub/HUB#noLedger · 화면은 H2(로그인 계산기)와 같음(REQ-299)'},
  {id:'rateFail',label:'요율 서비스 실패',note:'V2.2 hub/HUB#rateFail · 재사용: H1 계산기 영수증 · 문구 근거 DEX(revision) 상태 정의 S5_11 `Estimate unavailable`(29002:128580) = G-144'},
  {id:'lighterAccruing',label:'Lighter 주중 「집계 전」 (G-100)',note:'V2.2 hub/HUB#lighterAccruing · 가장 가까운 Figma H5(28960:126908)는 추정치 줄 — G-100으로 미표시'},
  {id:'cards',label:'비교표 카드 뷰 (평점 생략)',figma:{pc:'22807:98684',mo:'28960:130794'},note:'[기존 MAX-1216] CMT-08 Exchange list — CARD view · 모바일은 H1 비교표 카드 · V2.2 hub/HUB#cards'},
  {id:'emptySearch',label:'비교표 빈 검색',figma:{mo:'5145:50887'},note:'[기존 MAX-22] mWeb allPartnerExchanges 「No results found for …」 배치 · 문구 G-151 · PC는 같은 배치 재사용 · V2.2 hub/HUB#emptySearch'},
 ],
 render(st){
  const guest=GUEST.includes(st);
  const route=st==='cex'||st==='cexPanel'||st==='cexBelowMin'?'CEX':st==='brokers'?'Brokers':'DEX';
  const right=PANEL.includes(st)?panelCard(st):calcCard(route,{member:!guest,rateFail:st==='rateFail',pid:st==='noLedger'?'edgex':'lighter'});
  const extra=st==='noLedger'?C.note('원장 미수신 DEX(EdgeX 연동, 데이터 미수신) → 잔액 패널 대신 계산기. 빈 패널·0 표시 금지(REQ-299). 잔액 서비스는 미연동·미수신 파트너 잔액을 반환하지 않음 → 계산기 폴백.'):
   st==='member'?C.note('로그인 · 연동 0: 계산기 + `Paid to your TetherMax balance · Minimum 10 USDT` 줄(10은 서버값, 정책 B-5-2 — Figma H2에는 없음), 이유 카드 없음(REQ-298).'):'';
  const pad=mo()?'40px 16px 64px':'96px 120px 120px';
  const body=`${hero(right,route)}${extra}<section style="padding:${pad}">${routes()}${compare(route,st)}</section>${guest?why():''}
   ${C.note('출금 자리는 비활성 `Auto Claim`(정책 6-1). Figma `Hub withdraw` HC1~HC6(출금 팝업·퍼즐·이메일 인증)은 자동 지급과 충돌해 만들지 않음 — CEX도 자동 지급(G-412). 히어로 배경은 Figma ripple shader(WebGPU)를 단일 HTML에 넣을 수 없어 그라데이션으로 대체.')}`;
  return shell(guest,body);
 }});
