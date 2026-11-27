// 12-1. 혜택 상세 (FU-071) — 혜택 목록(benefits.list) 각 행에서 들어가는 상세 페이지 10종 × 상태
// 디자인: 기존 Figma [MAX-468] Benefits Page 상세(Web S1/S2 게스트 · S3/S4 회원 · mWeb) + MAXOP-805 랭킹 카드 + DEX(revision) 「혜택 · UID 연동 상세」·「혜택 · 첫 캐시백 상세」
// 상태 정의 원본: 05.리포트/혜택상세_상태정의.md (쿠폰형 = 수행 전 / 수행 후 쿠폰 미수령 / 수행 후 쿠폰 수령 + 그 밖에 문구가 바뀌는 상태)
// 이 파일은 120-rewards.js의 지역 함수에 기대지 않는다(모듈마다 IIFE) — 필요한 조각은 여기서 다시 그린다.
const MO=()=>S.vp==='mo';
const LOGO={Binance:'rw-logo-binance.png',Bybit:'rw-logo-bybit.png',OKX:'rw-logo-okx.png',Bitget:'rw-logo-bitget.png'};
const logo=(n,s=24)=>LOGO[n]?`<img src="${A(LOGO[n])}" style="width:${s}px;height:${s}px;border-radius:50%;object-fit:cover;flex:none" alt="${n}">`:C.dex(n,s);
const W_EDGEX='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9';
const short=a=>a.slice(0,6)+'…'+a.slice(-4);
const B='benefits.detail';
const G=st=>`${B}:${st}`;

// ---------- 공통 조각 ([MAX-468] 상세 공통 틀 — 10976:53104 · 11731:356403) ----------
// 모바일 상단: 뒤로(혜택 목록) + 쿠폰 아이콘(회원만, PRD 5-5 #19). 미수령 쿠폰이 있으면 빨간 점 + 흔들림
const STYLE=`<style>@keyframes bdShake{0%,100%{transform:translateX(0)}20%{transform:translateX(-3px)}40%{transform:translateX(3px)}60%{transform:translateX(-2px)}80%{transform:translateX(2px)}}.bd-dot{position:absolute;right:2px;top:2px;width:8px;height:8px;border-radius:50%;background:#d32f2f;border:1px solid #fff}.bd-shake{animation:bdShake .6s ease-in-out infinite;animation-delay:1s}</style>`;
const couponIc=(o,dark)=>`<span style="position:relative;display:inline-flex"${o.dot?' class="bd-shake"':''}><img src="${A(dark?'rw-ic-coupon-w.svg':'rw-ic-coupon.svg')}" class="ic" alt="">${o.dot?'<span class="bd-dot"></span>':''}</span>`;
const moHead=o=>`<div class="row between" style="padding:16px 16px 0;background:var(--bg-accent)"><button class="icon-btn" data-go="${o.back||'benefits.list'}"><img src="${A('rw-ic-back-k.svg')}" class="ic" alt=""></button>${o.member?`<button class="icon-btn" data-go="coupon.box">${couponIc(o)}</button>`:'<span style="width:40px"></span>'}</div>`;
const kv=(k,v,blue)=>`<div class="row between" style="gap:16px"><span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">${k}</span><span style="font-size:12px;font-weight:500;line-height:20px;text-align:right;${blue?'color:var(--blue)':''}">${v}</span></div>`;
const detailsBox=rows=>`<div style="background:rgba(207,216,220,.2);border-radius:8px;padding:16px;width:100%" class="col g16"><span style="font-size:14px;font-weight:600;line-height:1.43">Reward Details</span><div class="col g8">${rows.map(r=>kv(...r)).join('')}</div></div>`;
const infoBox=html=>`<div style="background:rgba(207,216,220,.2);border-radius:4px;padding:12px;display:flex;gap:10px;align-items:flex-start;width:100%"><img src="${A('rw-ic-info.svg')}" style="width:16px;height:16px;margin-top:1px;flex:none" alt=""><span style="font-size:10px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${html}</span></div>`;
const doneChip=()=>`<span style="align-self:center;background:rgba(0,0,0,.08);border-radius:16px;padding:4px 10px;font-size:13px;line-height:18px;letter-spacing:.16px">Completed</span>`;
const amount=t=>`<span style="font-size:20px;font-weight:700;line-height:1.6;color:var(--blue)">${t}</span>`;
const btnP=(label,go,o={})=>`<button class="btn contained primary lg${o.full?' full':''}" style="${o.full?'':`min-width:${o.w||200}px`}"${go?` data-go="${go}"`:''}${o.dis?' disabled':''}${o.toast?` data-bd-toast="${o.toast}"`:''}>${label}</button>`;
const btnO=(label,go,o={})=>`<button class="btn outlined black lg${o.full?' full':''}" style="${o.full?'':`min-width:${o.w||200}px`}"${go?` data-go="${go}"`:''}${o.toast?` data-bd-toast="${o.toast}"`:''}>${label}</button>`;
const viewCoupon=dot=>`<button class="btn outlined black lg" style="width:200px" data-go="coupon.box">${couponIc({dot})}View Coupon</button>`;
// 토스트 — [MAX-468] 「Congrats! You got 3 USDT.」(10976:53106) · 「Invite code copied」(10976:50390) · 「Link copied」(10976:50394)
const toast=(msg,ok)=>`<div style="position:fixed;left:50%;bottom:40px;transform:translateX(-50%);z-index:30;background:#1c1c1e;color:#fff;border-radius:8px;min-width:${MO()?'327px':'343px'};padding:12px 16px;display:flex;align-items:center;gap:12px;font-size:13px;line-height:1.5;box-shadow:var(--elev8)">${ok?`<img src="${A('rw-ic-check.svg')}" style="width:24px;height:24px;flex:none" alt="">`:''}<span>${msg}</span></div>`;
// 히어로 — 이미지 · 제목 · 부제 · 금액(또는 Completed 칩)
const hero=o=>`<div class="col center" style="align-items:center;gap:8px;text-align:center;width:100%">${o.img?`<div style="margin-bottom:8px">${o.img}</div>`:''}<span class="b1 semi">${o.title}</span><span class="b2 c2" style="padding:0 16px">${o.sub}</span>${o.done?doneChip():o.amt?amount(o.amt):''}</div>`;
const img=(f,w,h)=>`<img src="${A(f)}" style="width:${w}px;height:${h}px;object-fit:contain;display:block" alt="">`;
// 3 simple ways 캐러셀(LINK UID 상세) — 기존 bdPhone(10976:52748)과 같은 그림
function ways(){return `<div class="col" style="gap:${MO()?16:40}px;align-items:center;width:100%"><span style="font-size:12px;letter-spacing:1px;text-transform:uppercase;color:var(--text-secondary);text-align:center">3 simple ways to earn CASHBACK</span><div class="col" style="gap:16px;align-items:center;width:${MO()?'100%':'375px'}"><div style="position:relative;width:285px;height:309px"><div style="position:absolute;left:50%;top:0;transform:translateX(-50%);width:150px;height:309px;border-radius:22px;background:#000;border:1.6px solid #373634;box-shadow:0 22px 17px rgba(0,0,0,.15),0 10px 5px rgba(0,0,0,.25);padding:6px 7px;overflow:hidden"><img src="${A('rw-bd-screen.png')}" style="width:100%;height:100%;object-fit:cover;border-radius:16px" alt=""></div>
  <div style="position:absolute;left:50%;top:139px;transform:translateX(-50%);background:rgba(255,255,255,.95);border:.4px solid rgba(0,0,0,.05);border-radius:8px;box-shadow:0 3.2px 3.2px rgba(0,0,0,.15);padding:12px;display:flex;flex-direction:column;gap:8px"><span class="row" style="gap:3px;font-size:9.6px;color:#5d6067">Referral Code ${ic('arrow-drop-down','ic16')}</span><div style="width:202px;border:.5px solid #5d6067;border-radius:8px;background:rgba(240,240,240,.25);padding:6px 12.8px;display:flex;align-items:center"><span style="flex:1;font-size:12.8px;font-weight:600;color:#2e7d32">TetherMax code</span><img src="${A('rw-ic-check.svg')}" style="width:19px;height:19px" alt=""></div><span style="font-size:8px;color:#2e7d32;padding:0 11px">You will receive a 20% discount for 90 days.</span></div></div>
  <div class="row" style="gap:40px"><button class="icon-btn" data-bd-slide="-1">${ic('chevron-left')}</button><img src="${A('rw-bd-dots.svg')}" style="width:56px;height:8px" alt=""><button class="icon-btn" data-bd-slide="1">${ic('chevron-right')}</button></div>
  <div class="col center" style="gap:16px;align-items:center;text-align:center"><span style="font-size:24px;font-weight:700;line-height:1">Getting Started with TetherMax</span><span style="font-size:14px;font-weight:500;line-height:1;color:var(--text-secondary)">Sign up to the exchange using our referral code</span></div></div></div>`}

// 페이지 틀: PC = 가운데 928폭(버튼 줄: View Coupon + CTA) · 모바일 = 상단 뒤로/쿠폰 + 하단 고정 CTA
// o: {member, dot, hero, cta(PC), moCta, mid(히어로 아래 본문), rows, info, after(약관 등), overlay, toast, noCoupon}
function page(o){const mo=MO();
 const coupon=o.member&&!o.noCoupon;
 const btns=mo?'':(o.cta||coupon)?`<div class="row" style="gap:12px;justify-content:center;flex-wrap:wrap">${coupon?viewCoupon(o.dot):''}${o.cta||''}</div>`:'';
 const body=`${hero(o.hero)}${btns}${o.mid||''}${o.rows?detailsBox(o.rows):''}${o.info?infoBox(o.info):''}${o.after||''}`;
 let html=mo?`${moHead({member:o.member&&!o.noCoupon,dot:o.dot})}<div class="col" style="gap:24px;padding:16px 16px ${o.moCta?24:40}px;align-items:center">${body}</div>${o.moCta?`<div style="position:sticky;bottom:0;padding:16px;background:#fff;box-shadow:0 -1px 0 var(--divider);z-index:5">${o.moCta}</div>`:''}`
  :`<div style="max-width:1088px;margin:0 auto;padding:40px 0 64px"><div class="col" style="gap:24px;align-items:center;padding:0 80px">${body}</div></div>`;
 if(o.overlay)html=`<div style="position:relative">${html}<div class="scrim pt-fixed center" style="${mo?'':'align-items:center'}">${o.overlay}</div></div>`;
 return STYLE+html+(o.toast?toast(o.toast,o.toastOk):'')}

// 쿠폰 뽑기 다이얼로그 — [MAX-468] Draw Coupon flow(PC 11446:259194 · 11446:259419 / 모바일 11446:257946 · 11529:129514)
function drawDialog(max,result,next){const mo=MO();
 const dg=v=>`<span style="position:absolute;top:47px;width:51px;height:80px;display:flex;align-items:center;justify-content:center;font-size:64px;font-weight:600;color:#fff;line-height:1">${v}</span>`;
 const [a,b]=result==null?['?','?']:String(result).padStart(2,'0').split('');
 return `<div style="background:#fff;border-radius:${mo?'8px':'4px'};width:${mo?'343px':'480px'};max-width:100%;box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);text-align:center">
  <div style="padding:16px 24px 0;font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.15px">Draw up to ${max} USDT</div><div class="b2 c2">Check your winning rewards</div>
  <div style="position:relative;width:${mo?300:342}px;height:${mo?172:196}px;margin:0 auto;transform-origin:top center"><img src="${A('rw-bd-slot.png')}" style="width:100%;height:100%" alt="">${dg(a).replace('top:47px',`top:${mo?40:47}px;left:${mo?'21%':'22%'}`)}${dg(b).replace('top:47px',`top:${mo?40:47}px;left:${mo?'54%':'54%'}`)}</div>
  <div style="padding:24px">${btnP(result==null?'Draw Coupon':'Claim Coupon',next,{full:true})}</div></div>`}

// =====================================================================
// 혜택별 정의
// =====================================================================
const issued=()=>['Issued to',MO()?'My Coupon':'TetherMax Account'];
const ONCE='This reward can only be claimed once per account.';

// 1. EXTRA CASHBACK BOOST — [MAX-468] MAX-500 「Sign up for the exchange Get extra cashback」(PC 10976:50395 · 게스트 9814:193626 · 모바일 10739:232256)
const BOOST_EX=[['Binance','40%','40%','50%'],['Bybit','30%','50%','75%'],['OKX','50%','54%','65%']];
const BOOST_TERMS=['If trades are made without linking to TetherMax immediately after signing up for the exchange, the boost may not be applied. Therefore, we recommend linking your UID to TetherMax right after registration.','This event may be terminated without prior notice due to circumstances of the Company or its affiliates.','Details of this event (additional rates, etc.) are subject to change without prior notice due to circumstances of the Company or its affiliates.','The benchmark for determining rates higher than TetherMax is based on the Cashback Boost rate.','The timing for the application of the additional boost rate is based on UTC and may differ slightly from the membership registration date.','The additional boost rate applies starting from the day after the membership registration date, based on UTC.','The boost application count is based on the time cashback is credited each day at 11:00 UTC (12:00 UTC for Bitget).',
 // 원문 `non-members` · `non-member inquiry` → 용어 규칙 `guest`(CLAUDE.md 도메인 용어)
 'The boost also applies to guests.','Users who participate in the event through abnormal methods may have their access to TetherMax services restricted without prior notice.','Only TetherMax accounts registered using an invite code from a KOL (affiliate), rather than a regular user, will receive the boost for 4 weeks.','The boost amount may not be paid if the cashback amount is too small.','For the Bitget exchange, please check the Bitget Super Boost page under "Benefit List."','For the OKX Cashback Boost, of the total 65%, 30% is provided through the exchange’s own cashback program, and the remaining 35% is paid out by TetherMax.','For OKX exchange, the process begins after you link UID on TetherMax or perform a guest inquiry. If you only signed up for the exchange, Boost might not be applied.'];
const termsCard=list=>`<div style="background:#fff;border-radius:16px;padding:16px;width:100%" class="col g16"><span class="b1 semi">Terms &amp; Conditions</span><ul class="b2 c2" style="margin:0;padding-left:21px;display:flex;flex-direction:column;gap:4px">${list.map(t=>`<li>${t}</li>`).join('')}</ul></div>`;
function boostPage(st){const mo=MO();
 const ex=BOOST_EX.map(([n,o,p,b])=>`<div style="background:#fff;border-radius:8px;box-shadow:0 1px 3px rgba(0,0,0,.08);width:100%"><div class="row between" style="padding:12px 16px;border-bottom:1px solid var(--divider);cursor:pointer" data-go="cexd:${n.toLowerCase()}"><span class="row g8">${logo(n,24)}<span class="b2 semi">${n}</span></span>${ic('chevron-right','ic20')}</div><div class="col" style="gap:6px;padding:12px 16px;font-size:12px"><div class="row between"><span class="c2">Other Platforms</span><span class="c2">${o}</span></div><div class="row between" style="color:var(--blue);font-weight:500"><span>Official Partner of TetherMax</span><span>${p}</span></div><div class="row between" style="color:#d32f2f;font-weight:500"><span>With Boost</span><span>🚀 ${b}</span></div></div></div>`).join('');
 const body=`<div class="col" style="gap:${mo?24:40}px;align-items:center;width:100%">
  <div class="col" style="gap:16px;align-items:center;width:100%"><img src="${A('rw-bd-boost.png')}" style="width:${mo?'100%':'672px'};max-width:100%;display:block" alt="CASHBACK BOOST"><button class="btn contained primary lg" style="width:${mo?'100%':'300px'}" data-go="${G('boost-share')}">Share ${ic('share','ic20')}</button></div>
  <div class="col center" style="gap:8px;align-items:center;text-align:center;width:100%"><span class="h6" style="font-weight:700;font-size:20px">What is Cashback Boost?</span><span class="b2 c2">A special buff that lets you trade with a higher cashback rate for 3 weeks.</span><ul style="margin:8px 0 0;width:100%;text-align:left;background:rgba(207,216,220,.2);border-radius:4px;padding:8px 8px 8px 28px;font-size:10px;line-height:1.66;color:var(--text-secondary)"><li>Extra rates are paid as event rewards for new exchange users only.</li><li>If invited by a TetherMax KOL, a cashback boost applies for 4 weeks!</li></ul></div>
  <div class="col" style="gap:12px;width:100%"><span class="b1 semi center">Exchanges with Cashback Boost</span>${ex}</div>
  <div class="col center" style="gap:12px;align-items:center;text-align:center"><img src="${A('rw-bd-guarantee.png')}" style="width:120px;height:120px" alt=""><span class="h6" style="font-weight:700;font-size:20px">Enjoy the highest cashback. Guaranteed.</span><span class="b2 c2">The only exchange offering an official contract service. Found a higher cashback rate elsewhere? Let us know immediately.</span><button class="btn outlined black lg" style="width:${mo?'100%':'300px'}" data-go="support.main">Report to Customer Support</button></div>
  ${termsCard(BOOST_TERMS)}</div>`;
 const html=mo?`${STYLE}${moHead({})}<div style="padding:16px 16px 40px">${body}</div>`:`<div style="max-width:1088px;margin:0 auto;padding:56px 0 64px"><div style="padding:0 104px">${body}</div></div>`;
 return html+(st==='boost-share'?toast('Link copied'):'')}

// 2. MONTHLY CASHBACK — [MAX-468] 「Claim cashback monthly Get up to 100 USDT」(PC 10976:50393 · 50392 · 50391 / 게스트 9814:197465) + MAXOP-805 랭킹 카드(26651:60616 · 25849:1340946) + 지난달 입상 모달(28972:60379)
const MB_PRIZE=[['1st place Prize','100 USDT','rw-bd-medal1.png','#fff8e1','#f9a825'],['2nd place Prize','50 USDT','rw-bd-medal2.png','#f1f5f9','#5d6067'],['3rd place Prize','20 USDT','rw-bd-medal3.png','#fbf3ec','#a1683a']];
// 행 = CEX UID · DEX 지갑을 한 카드에(본문 8-10 「한 순위표」 · REQ-379). DEX 행은 `Wallet` + 축약 주소(랭킹 패널과 같은 표기)
const MB_ROWS={ranked:[{p:'Bitget',id:'UID 1210910640',rank:'2nd place',msg:'win'},{p:'EdgeX',w:W_EDGEX,rank:'Top 100%',msg:'more'},{p:'OKX',id:'UID 617755618866586639',rank:'-'}],
 unranked:[{p:'Bitget',id:'UID 1210910640',rank:'-'},{p:'EdgeX',w:W_EDGEX,rank:'-'}]};
function mbRank(st){const mo=MO();
 if(st==='monthly-guest'||st==='monthly-noacct')return `<div style="background:#fff;border-radius:8px;padding:24px 16px;width:100%;text-align:center" class="col g4"><span class="b2 semi">No Ranking Available</span><span class="cap c2">Link your UID to view your ranking</span></div>`;
 const rows=MB_ROWS[st==='monthly-unranked'?'unranked':'ranked'].map(r=>{const id=r.w?`Wallet ${short(r.w)}`:r.id;
  const msg=r.msg==='win'?`<div class="row" style="gap:4px;padding-left:36px"><img src="${A('sum-ic-trophy.svg')}" style="width:16px;height:16px" alt=""><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--success)">You're in the reward zone.</span></div>`
   :r.msg==='more'?`<div style="padding-left:36px;font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">Trade more to get a reward.</div>`:'';
  return `<div class="col" style="gap:4px"><div class="row" style="gap:8px">${logo(r.p,28)}<div class="col grow" style="gap:0;min-width:0;font-size:12px"><span style="font-weight:500;line-height:1.4">${r.p}</span><span style="line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${id}</span></div><span style="font-size:12px;line-height:20px;letter-spacing:.14px;font-weight:500">${r.rank}</span></div>${msg}</div>`}).join('');
 return `<div style="background:#fff;border-radius:8px;padding:16px;width:100%" class="col g16"><div class="col" style="gap:4px"><span class="b2 semi">Your May Cashback Ranking</span><span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">Rankings are updated daily at 00:01</span></div><div class="col" style="gap:16px">${rows}</div>
  <div class="col" style="gap:4px;border-top:1px solid var(--divider);padding-top:12px"><span class="cap c2">${T('Cashback under 0.01 USDT isn’t included in the rankings.','캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다.')}</span><span class="cap c2">${T('Ranking rewards can’t be claimed on their own. They’re matched 1:1 with the same account’s cashback.','랭킹 리워드만으로는 출금할 수 없어요. 같은 계정의 캐시백과 1:1로 매칭돼요.')}</span></div></div>`}
const MB_TERMS=['Applies only to cashback payments made from the 1st place to the last day of each month (UTC).','Event rewards are calculated according to the cashback history for the month and are paid within 5 days after the end of the month.','This event is eligible to traders who have cashback history in that month.','Since each exchange processes it individually, you can receive rewards from more than one exchange.','The ranking criteria are based on each UID referred to the TetherMax account in exchange.','This benefit may change at any time depending on our circumstances.'];
// 지난달 입상 안내 모달 — Figma 28972:60379(1st·2nd·3rd·Top 10% 4종 중 1st). Figma 메모: 매월 1일 배치 후 그 TUID로 로그인하면 자동 안내
function prizeModal(){const mo=MO();
 const row=(k,v)=>`<div class="row between" style="font-size:12px;line-height:20px"><span class="c2">${k}</span><b style="font-weight:600">${v}</b></div>`;
 return `<div style="background:#fff;border-radius:${mo?'16px 16px 0 0':'4px'};width:${mo?'100%':'480px'};${mo?'align-self:flex-end':''};box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14);padding:24px" class="col g16">${mo?'<div class="sheet-grab"></div>':''}
  <div class="col center" style="gap:4px;align-items:center;text-align:center"><img src="${A('rw-bd-prize1.png')}" style="width:177px;height:134px;margin-bottom:16px" alt="100 USDT"><span style="font-size:20px;font-weight:500;line-height:1.6">Cashback Ranking Reward</span><span class="b2 c2">Check last month’s ranking to claim prize</span></div>
  <div class="col g8">${row('Exchange','Binance')}${row('UID','1222787462')}${row('Ranking','1st place')}</div>
  ${btnP('Close',G('monthly-ranked'),{full:true})}</div>`}
function monthlyPage(st){const mo=MO(),member=st!=='monthly-guest';
 const prize=MB_PRIZE.map(([l,v,ico,bg,c])=>`<div class="row between" style="background:linear-gradient(90deg,${bg},#fff);border:1px solid ${bg==='#fff8e1'?'#ffe082':'var(--divider)'};border-radius:4px;height:48px;padding:0 16px 0 0"><span class="row" style="gap:8px"><img src="${A(ico)}" style="width:50px;height:46px" alt=""><span class="b2 semi" style="color:${c}">${l}</span></span><span style="font-size:12px;font-weight:600">${v.replace(' USDT','')} <span style="font-size:9px">USDT</span></span></div>`).join('')
  +`<div class="row between" style="background:#fff;border:1px solid var(--divider);border-radius:4px;height:36px;padding:0 16px;font-size:12px"><span>Within top 10 %</span><span>10 USDT</span></div>`;
 const cta=st==='monthly-guest'?btnP('Sign Up to Get Started','auth.signup',{w:300}):st==='monthly-noacct'?btnP('Link UID','link.select',{w:300}):'';
 const moCta=st==='monthly-guest'?C.btn('Sign Up to Get Started',{full:true,go:'auth.signup'}):st==='monthly-noacct'?C.btn('Link UID',{full:true,go:'link.select'}):'';
 return page({member,noCoupon:true,hero:{img:img('rw-bd-monthly.png',220,220),title:'Monthly Top Trader Rewards',sub:'Top traders each month earn exclusive rewards based on cashback earned.',amt:'Up to 100 USDT'},cta,moCta,
  mid:`<div class="col" style="gap:8px;width:100%">${prize}</div>${mbRank(st)}`,
  rows:[['Reward amount','Event Reward'],issued(),['Participation','Every Month']],after:termsCard(MB_TERMS),overlay:st==='monthly-prize'?prizeModal():''})}

// 3. INVITE FRIENDS & EARN — [MAX-468] 「Invite friends Get extra profits」(PC 10976:47799 · 10976:50390 / 게스트 9961:167635 / 모바일 10739:232634 · 12340:51395 · 12340:51396)
function invitePage(st){const mo=MO(),guest=st==='invite-guest',noCode=st==='invite-nocode',has=!guest&&!noCode;
 const code=has?'654321T':'TetherMax Invitation Code';
 const step=(n,t,s)=>`<div class="row" style="gap:8px;align-items:flex-start"><span style="width:20px;height:20px;border-radius:50%;background:var(--blue);color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center;flex:none;position:relative;z-index:1">${n}</span><div class="col" style="gap:8px;padding-top:1px"><span style="font-size:12px;line-height:1.4">${t}</span>${s||''}</div></div>`;
 const codeBox=`<div class="row between" style="border:1px solid var(--divider);border-radius:8px;background:#fff;padding:10px 12px;width:${mo?'100%':'318px'}"><div class="col" style="gap:2px"><span style="font-size:10px;letter-spacing:.4px;color:var(--text-secondary)">INVITE CODE</span><span class="b2${has?'':' c2'}" style="font-weight:500">${code}</span></div>${has?`<button class="icon-btn" data-go="${G('invite-codecopied')}"><img src="${A('inv-ic-copy.svg')}" style="width:20px;height:20px" alt="copy"></button>`:''}</div>`;
 const steps=`<div style="position:relative;width:${mo?'100%':'318px'}"><span style="position:absolute;left:9px;top:14px;bottom:30px;width:2px;background:var(--blue)"></span><div class="col" style="gap:16px;position:relative">${step(1,'Invite your friends',codeBox)}${step(2,'Share with friends who trade crypto','<span class="cap c2">They sign up for an exchange via your link</span>')}${step(3,'Earn a rewards every time they withdraw','<span class="cap c2">Your rewards is updated daily</span>')}</div></div>`;
 const pcCta=guest?btnP('Sign Up to Invite Friends','auth.signup',{w:300}):noCode?btnP('Issue invitation code',G('invite-issued'),{w:300}):`${btnO('Copy Invite',G('invite-linkcopied'),{w:300})}${btnP('Invite Friends','invite.main:code',{w:300})}`;
 const moCta=guest?C.btn('Sign Up to Invite Friends',{full:true,go:'auth.signup'}):noCode?C.btn('Issue invitation code',{full:true,go:G('invite-issued')}):`<div class="row" style="gap:12px">${btnO('Copy Invite',G('invite-linkcopied'),{full:true})}${btnP('Invite Friends','invite.main:code',{full:true})}</div>`;
 const t={'invite-issued':'Invitation code issued','invite-codecopied':'Invite code copied','invite-linkcopied':'Invite link copied'}[st];
 return page({member:!guest,noCoupon:true,hero:{img:`<div style="width:240px;height:154px;overflow:hidden;position:relative"><img src="${A('inv-hero-people.png')}" alt="" style="position:absolute;left:0;top:-27.72%;width:100%;height:155.45%;object-fit:cover"></div>`,title:'Refer a Friend &amp; Earn',sub:'Earn extra when your friends get cashback. The more they earn, the more you earn.'},
  cta:pcCta,moCta,mid:steps,rows:[['Payment method','Invitation Reward'],issued(),['Reward Type','Rewards on friend’s cashback']],
  info:'Your rewards depends on your friends’ trading activity. The more they trade, the more you earn. No limit on referrals.',toast:t})}

// 4. 쿠폰형 공통(WELCOME GIFT · CASHBACK PREVIEW · LINK UID · FIRST CASHBACK · INVITATION REWARD)
// 단계: guest(게스트) · before(수행 전) · ready(수행 후 쿠폰 미수령) · draw/drawn(뽑기형) · claimed(수령 직후 토스트) · done(수행 후 쿠폰 수령)
const CP={
 welcome:{max:5,draw:true,title:'Welcome Gift for New Traders',sub:'Get a coupon worth up to 5 USDT, just for getting started.',amt:'Up to 5 USDT',got:5,img:()=>img('rw-bd-welcome.png',200,220),
  ready:'Claim Up to 5 USDT',doneCta:['View More Benefits','benefits.list']},
 referred:{max:10,draw:true,title:'Here’s a welcome gift for you!',sub:'New traders who sign up through a referral will receive a surprise coupon worth up to 10 USDT.',amt:'Up to 10 USDT',got:10,img:()=>img('rw-bd-referred.png',200,220),
  ready:'Claim Up to 10 USDT',doneCta:['View More Benefits','benefits.list']},
 preview:{title:'Cashback Preview',sub:'Calculate your estimated cashback',amt:'+2 USDT',got:2,img:()=>img('rw-bd-calc.png',240,131),
  guestCta:['Check My Cashback','calc.p1'],before:['Check My Cashback and Get 2 USDT','calc.p1'],ready:'Claim 2 USDT Coupon',moReady:'Claim 2 USDT',doneCta:['Check My Cashback','calc.p1'],moDoneCta:false},
 uid:{title:()=>T('Link a CEX UID to Get Cashback','CEX UID 연동하고 캐시백 받기'),sub:()=>T('Link a CEX exchange UID to start earning cashback and receive 3 USDT.','CEX 거래소 UID를 연동하여 캐시백을 받고 3 USDT를 수령하세요.'),amt:'+3 USDT',got:3,img:()=>img('rw-bd-uid.png',200,220),ways:true,
  before:['Link UID and Get 3 USDT','link.select'],moBefore:'Link UID and Get 3 USDT Coupon',ready:'Claim 3 USDT Coupon',doneCta:['Link Additional UID','link.select'],
  eligible:()=>T('CEX only','CEX 전용'),info:()=>`${ONCE} ${T('Linking a DEX wallet does not qualify for this reward.','DEX 지갑 연동은 이 보상 대상이 아닙니다.')}`},
 first:{title:'First Withdrawal Reward',sub:()=>T('Withdraw your first cashback to receive a 10 USDT coupon.','첫 캐시백을 출금하고 10 USDT 쿠폰을 받으세요.'),amt:'+10 USDT',got:10,img:()=>`<div style="position:relative;width:200px;height:162px"><img src="${A('rw-bd-first.png')}" style="width:100%;height:100%;object-fit:cover" alt=""><img src="${A('rw-bd-first-obj.png')}" style="position:absolute;left:27.75%;width:46%;top:calc(50% - 10px);transform:translateY(-50%)" alt=""></div>`,
  before:['Auto Claim',null,true],ready:'Claim 10 USDT Coupon',doneCta:['View More Benefits','benefits.list'],eligible:()=>T('CEX and DEX','CEX · DEX 모두')},
};
const v=x=>typeof x==='function'?x():x;
function couponPage(key,step){const c=CP[key],mo=MO(),guest=step==='guest';
 const got=['done','claimed','drawn'].includes(step);
 const heroAmt=got&&step!=='drawn'?null:c.amt;
 let cta='',moCta='';
 if(guest){const [l,g]=c.guestCta||['Sign Up to Get Started','auth.signup'];cta=btnP(l,g,{w:300});moCta=C.btn(l,{full:true,go:g})}
 else if(step==='before'){const [l,g,dis]=c.before;cta=btnP(l,g,{dis,w:dis?308:200});moCta=dis?`<button class="btn contained primary lg full" disabled>${l}</button>`:C.btn(c.moBefore||l,{full:true,go:g})}
 else if(step==='noacct'){cta=btnP('Link Account','link.select');moCta=C.btn('Link Account',{full:true,go:'link.select'})}
 else if(step==='ready'||step==='draw'||step==='drawn'){const nx=c.draw?G(key+'-draw'):G(key+'-claimed');cta=btnP(c.ready,nx);moCta=C.btn(c.moReady||c.ready,{full:true,go:nx})}
 else if(got){const [l,g]=c.doneCta;cta=btnP(l,g);moCta=c.moDoneCta===false?'':C.btn(l,{full:true,go:g})}
 const rows=[['Reward amount',got?`${c.got} USDT`:c.amt.replace('+',''),1],['Payment method','Event Reward'],issued()];
 if(c.eligible)rows.push([T('Eligible Exchanges','적용 거래소'),v(c.eligible)]);
 const overlay=step==='draw'?drawDialog(c.max,null,G(key+'-drawn')):step==='drawn'?drawDialog(c.max,c.got,G(key+'-done')):'';
 return page({member:!guest,dot:step==='ready'||step==='draw',hero:{img:c.img(),title:v(c.title),sub:v(c.sub),amt:heroAmt,done:got&&step!=='drawn'},cta,moCta,
  mid:c.ways?ways():'',rows,info:c.info?v(c.info):ONCE,overlay,
  toast:step==='claimed'||step==='drawn'?`Congrats! You got ${c.got} USDT.`:'',toastOk:true})}

// 5. NOTIFICATIONS — [MAX-468] 「Turn on alarm Get 1 USDT」(PC 10976:51542 · 게스트 9961:168191 / 모바일 10739:232641 · 9622:105026). 웹은 게스트·회원 모두 앱 설치 안내(PRD 5-5 #17)
function notifPage(st){const mo=MO();
 const qr=mo?'':`<div style="background:rgba(207,216,220,.2);border-radius:8px;padding:24px 16px;width:100%" class="col center g16"><span class="b2 semi center">Download the app to enable notifications</span><img src="${A('rw-bd-qr.png')}" style="width:100px;height:100px;margin:0 auto;display:block" alt="QR"></div>`;
 return page({member:st==='notif-member',noCoupon:true,hero:{title:mo?'Turn On Notifications':'Turn On Notifications &amp; Get 1 USDT',sub:'Get alerts for cashback withdrawals, exchange airdrops, and trading competitions.',amt:'+1 USDT'},
  mid:`<img src="${A('rw-bd-alarm.png')}" style="width:320px;max-width:100%;display:block" alt="">${qr}`,moCta:`<button class="btn contained primary lg full" data-bd-store="1">Download App</button>`,
  rows:[['Reward amount','1 USDT',1],['Payment method','Event Reward'],issued()],info:ONCE})}

// =====================================================================
// 화면 등록 — 상태 id = {혜택}-{단계}
// =====================================================================
R.screen({id:B,group:'rewards',title:'혜택 상세',route:'/benefits/{benefitId}',fu:['FU-071'],shell:{nav:'rewards',accent:true,noTop:true},
 states:[
  // EXTRA CASHBACK BOOST
  {id:'boost-normal',label:'EXTRA CASHBACK BOOST · 기본 (게스트·회원 같음)',figma:{pc:'10976:50395',mo:'10739:232256'},note:'[기존 MAX-468] MAX-500 「Sign up for the exchange Get extra cashback」. 게스트 9814:193626과 문구 같음. 쿠폰형 아님(거래소 가입 이벤트 — 이벤트 리워드로 지급). 대상 거래소 Binance·Bybit·OKX = CEX — DEX 변경 없음. 약관의 <code>non-member</code> 2곳은 용어 규칙으로 <code>guest</code>'},
  {id:'boost-share',label:'EXTRA CASHBACK BOOST · Share → 링크 복사 (게스트·회원 같음)',figma:{pc:'10976:50394',mo:'10739:232255'},note:'[기존 MAX-468] 「CTA &gt; Share」 — 토스트 <code>Link copied</code>'},
  // MONTHLY CASHBACK
  {id:'monthly-guest',label:'MONTHLY CASHBACK · 게스트',figma:{pc:'9814:197465',mo:'9622:114576'},note:'[기존 MAX-468] S1/S2 — CTA <code>Sign Up to Get Started</code> · 랭킹 칸 <code>No Ranking Available</code>. 부제 <code>trading activity</code> → <code>cashback earned</code>(REQ-400 · REQ-384)'},
  {id:'monthly-noacct',label:'MONTHLY CASHBACK · 회원 연동 계정 없음',figma:{pc:'10976:50393',mo:'11731:355965'},note:'[기존 MAX-468] 「For when user has not linked any UID post-login」 — <code>Link UID</code>. DEX 지갑도 순위 대상(본문 8-10)이라 <code>Link your UID to view your ranking</code> · <code>Link UID</code> 문구는 ❓ 결정 필요 B-2(원문 유지 표시)'},
  {id:'monthly-unranked',label:'MONTHLY CASHBACK · 회원 · 연동 · 순위 밖(–)',figma:{pc:'10976:50392',mo:'10730:183393'},note:'[기존 MAX-468] 「If user does not qualify in the ranks」 + MAXOP-805 카드. 행에 CEX UID와 DEX 지갑을 함께(REQ-379). 카드 아래 하한·매칭 안내 = 문구표 #52·53(본문 8-10)'},
  {id:'monthly-ranked',label:'MONTHLY CASHBACK · 회원 · 연동 · 순위 안',figma:{pc:'26651:60616',mo:'25849:1340946'},note:'MAXOP-805 「Ranking card with reward messages」 — <code>You\'re in the reward zone.</code> · <code>Trade more to get a reward.</code>(10976:50391 「If user get 1st place」를 대체한 개정)'},
  {id:'monthly-prize',label:'MONTHLY CASHBACK · 회원 · 지난달 입상 안내 모달',figma:{pc:'28972:60379'},note:'[기존 MAX-468] 「Cashback Ranking Reward」(1st·2nd·3rd·Top 10% 4종) — <code>Close</code>. 순위 보상은 쿠폰(10/20/50/100 USDT)으로 쿠폰함에 지급. Figma 메모: 매월 1일 배치 후 그 TUID로 로그인하면 자동 안내. 노출 위치·DEX 행 라벨(<code>UID</code>→<code>Wallet</code>)은 ❓ 결정 필요 B-3'},
  // INVITE FRIENDS & EARN
  {id:'invite-guest',label:'INVITE FRIENDS & EARN · 게스트',figma:{pc:'9961:167635',mo:'9622:104684'},note:'PRD 5-5 #18 — 코드 자리 <code>TetherMax Invitation Code</code>(값 없음) + <code>Sign Up to Invite Friends</code>. Figma PC는 <code>TetherMax Referral Code</code>, 모바일은 오타 <code>Invitaion</code> → PRD 문구로'},
  {id:'invite-nocode',label:'INVITE FRIENDS & EARN · 회원 · 초대 코드 없음',figma:{mo:'12340:51395'},note:'[기존 MAX-468] 「Invite friends Enter before invitation code issuance」 — <code>Issue invitation code</code>(PRD 5-5 #18). PC 프레임 없음 — 같은 틀'},
  {id:'invite-issued',label:'INVITE FRIENDS & EARN · 회원 · 코드 발급 토스트',figma:{mo:'12340:51396'},note:'PRD 5-5 #18 — 새로고침 없이 코드 있는 상태로 바뀌고 토스트 <code>Invitation code issued</code>'},
  {id:'invite-code',label:'INVITE FRIENDS & EARN · 회원 · 초대 코드 있음',figma:{pc:'10976:47799',mo:'10739:232634'},note:'<code>Copy Invite</code>(전체 링크 복사) · <code>Invite Friends</code>(파트너 → 파트너 허브, 그 외 → 초대 페이지, PRD 5-5 #18). 초대 리워드는 CEX·DEX 하위 출금 모두(본문 4-3) — 자동 지급·최소 10 USDT는 초대 페이지 쪽(이 상세에 금액 없음)'},
  {id:'invite-codecopied',label:'INVITE FRIENDS & EARN · 회원 · 코드 복사 토스트',figma:{pc:'10976:50390'},note:'토스트 <code>Invite code copied</code>'},
  {id:'invite-linkcopied',label:'INVITE FRIENDS & EARN · 회원 · 링크 복사 토스트',note:'PRD 5-5 #18 토스트 <code>Invite link copied</code> — Figma 프레임 없음(같은 토스트 틀)'},
  // WELCOME GIFT
  {id:'welcome-guest',label:'WELCOME GIFT · 게스트 (수행 전)',figma:{pc:'9961:168195',mo:'9622:116148'},note:'수행 = 초대 코드 없이 가입. 게스트 CTA <code>Sign Up to Get Started</code>'},
  {id:'welcome-ready',label:'WELCOME GIFT · 회원 · 수행 후 쿠폰 미수령',figma:{pc:'10976:50276',mo:'10739:232636'},note:'<code>Claim Up to 5 USDT</code> · 쿠폰 버튼 빨간 점 + 흔들림(PRD 5-5 #19)'},
  {id:'welcome-draw',label:'WELCOME GIFT · 회원 · 쿠폰 뽑기',figma:{pc:'11446:258745',mo:'11446:257847'},note:'<code>Draw up to 5 USDT</code> — Figma PC 다이얼로그는 <code>10 USDT</code>로 잘못 적혀 있어 모바일(11446:257946) 값으로'},
  {id:'welcome-drawn',label:'WELCOME GIFT · 회원 · 뽑기 결과',figma:{pc:'11446:259215',mo:'11529:129465'},note:'결과 숫자 + 토스트 <code>Congrats! You got 5 USDT.</code>'},
  {id:'welcome-done',label:'WELCOME GIFT · 회원 · 수행 후 쿠폰 수령 (Completed)',figma:{pc:'10976:50275',mo:'10739:232637'},note:'금액 자리 <code>Completed</code> · <code>View More Benefits</code> · 지급액 = 받은 금액(PRD 5-5 #15). 쿠폰은 DEX 지갑에도 사용 가능(REQ-404)'},
  // CASHBACK PREVIEW
  {id:'preview-guest',label:'CASHBACK PREVIEW · 게스트',figma:{pc:'9961:168192',mo:'9622:109468'},note:'<code>Check My Cashback</code> → 계산기'},
  {id:'preview-before',label:'CASHBACK PREVIEW · 회원 · 수행 전',figma:{pc:'10976:50736'},note:'<code>Check My Cashback and Get 2 USDT</code> → 계산기. DEX를 골라 계산해도 완료(G-194)'},
  {id:'preview-ready',label:'CASHBACK PREVIEW · 회원 · 수행 후 쿠폰 미수령',figma:{pc:'10976:50878',mo:'10739:232640'},note:'<code>Claim 2 USDT Coupon</code>(모바일 <code>Claim 2 USDT</code>)'},
  {id:'preview-claimed',label:'CASHBACK PREVIEW · 회원 · 수령 직후',figma:{pc:'11100:200688',mo:'10739:232639'},note:'토스트 <code>Congrats! You got 2 USDT.</code>'},
  {id:'preview-done',label:'CASHBACK PREVIEW · 회원 · 수행 후 쿠폰 수령 (Completed)',figma:{pc:'11100:200688',mo:'10739:232638'},note:'PC CTA <code>Check My Cashback</code> 유지 · 모바일 CTA 없음'},
  // NOTIFICATIONS
  {id:'notif-guest',label:'NOTIFICATIONS · 웹 (게스트)',figma:{pc:'9961:168191',mo:'9622:105026'},note:'PRD 5-5 #17 — 웹은 게스트·회원 모두 앱 설치 안내(PC QR · 모바일 <code>Download App</code>), 수령은 앱에서만. Figma PC 표 첫 줄 라벨 <code>Payment method</code>·안내문(초대 문구)은 오기 — 모바일 원문(<code>Reward amount</code> · 1회 안내)으로'},
  {id:'notif-member',label:'NOTIFICATIONS · 웹 (회원)',figma:{pc:'10976:51542',mo:'10739:232641'},note:'게스트와 같은 화면 + 모바일 쿠폰 아이콘. 앱의 쿠폰 3상태(켜기 전 <code>Turn on</code> / 미수령 / 수령)는 웹 프로토타입 범위 밖'},
  // LINK UID
  {id:'uid-guest',label:'LINK UID · 게스트',figma:{pc:'9961:168193',mo:'9622:110779'},note:'제목·부제·적용 거래소·하단 안내는 DEX(revision) 「혜택 · UID 연동 상세」(29327:403008 · 29327:403439) 문구(REQ-396)'},
  {id:'uid-before',label:'LINK UID · 회원 · 수행 전 (CEX 첫 연동 전 — DEX 지갑만 연동 · 확인 중 포함)',figma:{pc:'29327:403008',mo:'29327:403439'},note:'<code>Link UID and Get 3 USDT</code>(모바일 <code>…Coupon</code>) → CEX UID 연동. DEX 지갑만 연동했거나 CEX 첫 연동이 확인 중이어도 이 상태(완료 판정 CEX 조건 · 확인 중은 <code>연동 완료</code> 시 발급, REQ-396 · REQ-407)'},
  {id:'uid-ready',label:'LINK UID · 회원 · 수행 후 쿠폰 미수령',figma:{pc:'10976:53105',mo:'11546:132500'},note:'<code>Claim 3 USDT Coupon</code> · 쿠폰 버튼 빨간 점. 발급은 CEX 첫 연동만, 사용은 DEX 지갑 포함(REQ-396)'},
  {id:'uid-claimed',label:'LINK UID · 회원 · 수령 직후',figma:{pc:'10976:53106',mo:'11546:132501'},note:'토스트 <code>Congrats! You got 3 USDT.</code>'},
  {id:'uid-done',label:'LINK UID · 회원 · 수행 후 쿠폰 수령 (Completed)',figma:{pc:'10976:53106',mo:'11546:131473'},note:'<code>Completed</code> + <code>Link Additional UID</code>'},
  // FIRST CASHBACK
  {id:'first-guest',label:'FIRST CASHBACK · 게스트',figma:{pc:'9814:198094',mo:'29327:400148'},note:'DEX(revision) 「혜택 · 첫 캐시백 상세 / 모바일」 — <code>Sign Up to Get Started</code>. Figma PC 게스트 표의 <code>5 USDT</code>는 오기 → 10'},
  {id:'first-noacct',label:'FIRST CASHBACK · 회원 연동 계정 없음',figma:{mo:'11446:138576'},note:'기존 「Withdraw flow | For when user has not linked any UID」의 <code>Link UID</code> → 거래 계정 연동 버튼. 문구는 ❓ 결정 필요 B-5(쿠폰 연동 안내의 확정 버튼 <code>Link Account</code>(G-196)를 표본으로 표시)'},
  {id:'first-before',label:'FIRST CASHBACK · 회원 · 수행 전 (자동 지급 대기)',figma:{pc:'29327:399908',mo:'29381:137277'},note:'DEX(revision) — <code>Auto Claim</code> 비활성(문구표 #55 · G-419). 수행 = 첫 자동 지급 완료(G-411), CEX·DEX 모두(REQ-398). 연동 전 출금은 제외(본문 5-3)'},
  {id:'first-ready',label:'FIRST CASHBACK · 회원 · 수행 후 쿠폰 미수령',figma:{pc:'10978:69401',mo:'10739:232645'},note:'<code>Claim 10 USDT Coupon</code> · 쿠폰 버튼 빨간 점'},
  {id:'first-claimed',label:'FIRST CASHBACK · 회원 · 수령 직후',figma:{pc:'10978:69403'},note:'토스트 <code>Congrats! You got 10 USDT.</code>'},
  {id:'first-done',label:'FIRST CASHBACK · 회원 · 수행 후 쿠폰 수령 (Completed)',figma:{pc:'10978:69403',mo:'10739:232644'},note:'<code>Completed</code> + <code>View More Benefits</code>'},
  // INVITATION REWARD (피초대자 가입 쿠폰)
  {id:'referred-guest',label:'INVITATION REWARD · 게스트',figma:{pc:'9961:168194',mo:'9622:180933'},note:'목록 행 <code>INVITATION REWARD · Referred a friend</code>의 상세 = 초대받아 가입한 회원의 가입 쿠폰(최대 10 USDT, 뽑기). 초대한 사람의 초대 리워드(자동 지급·최소 10 USDT)와 다른 혜택'},
  {id:'referred-ready',label:'INVITATION REWARD · 회원 · 수행 후 쿠폰 미수령',figma:{pc:'10978:69493',mo:'11731:358566'},note:'<code>Claim Up to 10 USDT</code>'},
  {id:'referred-draw',label:'INVITATION REWARD · 회원 · 쿠폰 뽑기',figma:{pc:'10978:69661',mo:'10978:58110'},note:'<code>Draw up to 10 USDT</code>'},
  {id:'referred-drawn',label:'INVITATION REWARD · 회원 · 뽑기 결과',figma:{pc:'10978:69858',mo:'10978:68273'},note:'토스트 <code>Congrats! You got 10 USDT.</code>'},
  {id:'referred-done',label:'INVITATION REWARD · 회원 · 수행 후 쿠폰 수령 (Completed)',figma:{pc:'11100:200482',mo:'10739:232646'},note:'<code>Completed</code> + <code>View More Benefits</code>'},
 ],
 render(st){
  const s=st||'uid-before',[key,stp]=s.split('-');
  if(key==='boost')return boostPage(s);
  if(key==='monthly')return monthlyPage(s);
  if(key==='invite')return invitePage(s);
  if(key==='notif')return notifPage(s);
  if(CP[key])return couponPage(key,stp);
  return boostPage('boost-normal');
 }});

// 로그인 상태(목록판 상단 게스트·회원 전환)와 상태를 맞춘다 — 코어 AUTH_STATE 규칙(결정 12차)에 이 화면을 올린다.
// 게스트로 바꾸면 그 혜택의 게스트 상태, 회원으로 바꾸면 회원 첫 상태. 회원 상태를 고르면 회원으로, 게스트 상태를 고르면 게스트로.
const BD_GUEST={monthly:'guest',invite:'guest',welcome:'guest',preview:'guest',notif:'guest',uid:'guest',first:'guest',referred:'guest'};
const BD_MEMBER={monthly:'unranked',invite:'code',welcome:'ready',preview:'before',notif:'member',uid:'before',first:'before',referred:'ready'};
const bdAuth=a=>{const st=(S.screen===B&&S.state)||'uid-before',[k,step]=st.split('-');if(!BD_GUEST[k])return st;
 if(a==='guest')return k+'-'+BD_GUEST[k];return step===BD_GUEST[k]?k+'-'+BD_MEMBER[k]:st};
// 동작판(site2.js)·목록판 공용: 혜택 k의 상태 st를 로그인 상태에 맞춘다(없으면 첫 상태)
window.BD_STATE=(k,st,member)=>{const ids=R.byId[B].states.map(x=>x.id);if(!ids.some(x=>x.startsWith(k+'-')))k='uid';
 if(!st||!ids.includes(st)||!st.startsWith(k+'-'))st=k==='boost'?'boost-normal':k+'-'+(member?BD_MEMBER[k]:BD_GUEST[k]);
 if(!BD_GUEST[k])return st;const step=st.slice(k.length+1);
 if(!member)return k+'-'+BD_GUEST[k];return step===BD_GUEST[k]?k+'-'+BD_MEMBER[k]:st};
try{AUTH_STATE[B]={get guest(){return bdAuth('guest')},get s3(){return bdAuth('s3')},get s4(){return bdAuth('s4')}}}catch(e){}

// 혜택 목록 행 → 상세 상태(120-rewards.js BNF_ROWS가 쓴다). 행 클릭 = 상세, 버튼 = 정책 B-11 「혜택 행 CTA」 목적지
window.BNF_DETAIL={
 'EXTRA CASHBACK BOOST':['boost-normal','boost-normal'],
 'MONTHLY CASHBACK':['monthly-guest','monthly-unranked'],
 'INVITE FRIENDS &amp; EARN':['invite-guest','invite-code'],
 'WELCOME GIFT':['welcome-guest','welcome-ready'],
 'CASHBACK PREVIEW':['preview-guest','preview-before'],
 'NOTIFICATIONS':['notif-guest','notif-member'],
 'LINK UID':['uid-guest','uid-before'],
 'FIRST CASHBACK':['first-guest','first-before'],
 'INVITATION REWARD':['referred-guest','referred-ready'],
};

// 동작: 캐러셀 ‹ › · 앱 설치 버튼(OS별 스토어 — PRD 5-5 #17, 프로토타입은 안내 토스트)
document.addEventListener('click',e=>{
 const s=e.target.closest&&e.target.closest('[data-bd-slide]');
 if(s){e.preventDefault();const dots=s.parentNode.querySelector('img');if(dots){dots.style.transition='transform .2s';dots.style.transform=`translateX(${s.dataset.bdSlide*4}px)`;setTimeout(()=>{dots.style.transform=''},200)}return}
 const a=e.target.closest&&e.target.closest('[data-bd-store]');
 if(a){e.preventDefault();const ua=navigator.userAgent||'';const ios=/iPhone|iPad|Mac/.test(ua);const t=document.createElement('div');t.innerHTML=toast(ios?'App Store':'Google Play');document.body.appendChild(t.firstChild);setTimeout(()=>{const x=document.body.lastChild;if(x&&x.textContent&&/App Store|Google Play/.test(x.textContent))x.remove()},1500)}
});
