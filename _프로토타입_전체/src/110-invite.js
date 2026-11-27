// 11. 친구 초대 · 파트너 허브 — FU-077 ~ FU-080 (V2.2 inv/IF8 5개 · ph/PHUB 2개 상태)
// Figma: DEX(revision) › "DEX — Invite Friends Web [Light]"(IF1~IF7. IF8~IF11 출금 계정 선택·UID Link Required는 숨김 폐기안 → 만들지 않음)
//        "DEX — Partner Hub Web [Light]"(PH1 · Sub-Account / Linked Accounts detail · PH2 Total 집계 모달)
//        "사용자 기능 · PC와 모바일 원본 보완"(친구 초대 · 모바일 / 초대 이력 없음, 파트너 허브 · 모바일)
// 정책 고정: 초대 리워드·파트너 허브 모두 자동 지급 → 버튼은 비활성 `Auto Claim`(REQ-414 · 428). 모바일 Figma의 `Withdraw` 버튼은 쓰지 않는다.
// 회원 초대 리워드 최소 50 USDT, 파트너 허브 최소 10 USDT(G-203), 제휴사도 DEX 지갑 지정 가능(G-056).

const mo=()=>S.vp==='mo';
const LOGO={bitget:'inv-logo-bitget.png',okx:'inv-logo-okx.png',bybit:'inv-logo-bybit.png',binance:'link-cex-binance.png',bingx:'link-cex-bingx.png',bitmex:'link-cex-bitmex.png'};
function logo(name,size=24){
 if(['Lighter','ApeX','EdgeX','Aster'].includes(name))return C.dex(name,size);
 const f=LOGO[name.toLowerCase()];
 if(f&&(!window.ASSETS||ASSETS[f]))return `<img src="${A(f)}" alt="${esc(name)}" style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex:none">`;
 return C.dex(name,size)}
const icx=(f,s=20)=>`<img src="${A(f)}" alt="" style="width:${s}px;height:${s}px;flex:none">`;
const box=(inner,o={})=>`<div style="background:#fff;border-radius:8px;padding:${o.p??16}px;${o.style||''}">${inner}</div>`;
const badge=(n,tone)=>`<span style="display:inline-flex;align-items:center;justify-content:center;min-width:20px;height:20px;padding:0 6px;border-radius:10px;font-size:12px;font-weight:500;color:#fff;background:${tone==='grey'?'#616161':'var(--blue)'}">${n}</span>`;
const W_LIGHTER='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9';
const W_APEX='0x4bd2'+'0'.repeat(31)+'9Af03';

// ================= 친구 초대 =================
// 약관 bullet 9개 — Figma IF1~IF7 화면 문구(4곳 동일, REQ-421). 정책 원문과의 차이는 ref/질문_invite.md
const TERMS=['If you sign up using this link, you do not need to enter a separate friend invitation code.',
 'If you do not sign up using this link, you can enter the friend invitation code to receive a \'Friend Invitation Completion Coupon.\'',
 'Invitation Rewards are earned when friends you invite receive eligible trading cashback from centralised exchanges (CEXs) or decentralised exchanges (DEXs) linked to TetherMax.',
 'Once your available Invitation Rewards reach 10 USDT, they are paid automatically in USDT to your designated linked account (exchange UID or DEX wallet).',   // 최소액 10 USDT — 결정 D8
 'Members who signed up before being invited by a friend are excluded from the event.',
 'The invitation code can only be entered once and cannot be changed after entry.',
 'If you participate in the event through abnormal means, the coupon may be revoked without notice.',
 'The event may be changed or discontinued without prior notice due to the operator\'s circumstances.',
 'There is no limit to the number of friends you can invite, but the reward ratio may change or be limited due to the operator\'s circumstances.'];
function terms(list,open){
 // Figma는 약관 전체가 글머리표 목록 한 덩어리(텍스트 1개) — 한 블록 안 글머리 줄로 그린다
 const ul=`<div class="b2 c2" role="list" style="margin:0;padding-left:20px">${list.map((t,i)=>`<span role="listitem" style="display:list-item;list-style:disc;${i?`margin-top:${list===TERMS?4:20}px`:''}">${esc(t)}</span>`).join('')}</div>`;
 if(mo()&&!open)return box(`<div class="row between"><span class="b1 semi">Terms &amp; Conditions</span>${ic('arrow-drop-down','ic20')}</div>`,{p:16});
 return box(`<div class="col g16"><div class="row between"><span class="b1 semi">Terms &amp; Conditions</span>${mo()?`<span style="transform:rotate(180deg);display:inline-flex">${ic('arrow-drop-down','ic20')}</span>`:''}</div>${ul}</div>`,{p:16,style:'border-radius:12px'})}
const hero=(title,sub)=>`<div class="col center" style="align-items:center;gap:8px;padding-top:16px"><div style="width:240px;height:154px;overflow:hidden;position:relative"><img src="${A('inv-hero-people.png')}" alt="" style="position:absolute;left:0;top:-27.72%;width:100%;height:155.45%;object-fit:cover"></div><span class="b1 semi" style="margin-top:8px">${title}</span><span class="b2 c2">${sub}</span></div>`;
function steps(list){
 return `<div style="position:relative;width:${mo()?'100%':'311px'};margin:0 auto"><span style="position:absolute;left:9.5px;top:12px;bottom:20px;width:2px;background:var(--blue)"></span>
  <div class="col" style="gap:16px;position:relative">${list.map((t,i)=>`<div class="row" style="align-items:flex-start;gap:8px"><span style="width:20px;height:20px;border-radius:50%;background:var(--blue);color:#fff;font-size:12px;display:inline-flex;align-items:center;justify-content:center;flex:none">${i+1}</span><span class="cap" style="font-size:12px;line-height:1.33;padding-top:2px">${t}</span></div>`).join('')}</div></div>`}
// How it works 3단계(REQ-433) — 3단계 끝은 G-198 확정(「whenever they trade」 → 「when your friends claim their cashback」)
const STEPS_INV=()=>['Share your invitation code with a friend.','Your friend signs up and receives a Friend Invitation Coupon.','Earn a portion of your friend\'s cashback rewards when your friends claim their cashback.'];
const tabsTop=()=>`<div class="tabs" style="border-bottom:0;${mo()?'':'padding-left:0'}">${[['TetherMax Point (TP)','tp.main'],['Invite Friends','']].map(([l,g],i)=>`<span class="tab${i?' on':''}"${g?` data-go="${g}"`:''} style="${mo()?'flex:1;text-align:center;':''}font-size:14px;letter-spacing:.17px;font-weight:400">${l}</span>`).join('')}</div>`;
const toggle=sub=>`<div style="display:inline-flex;background:#eef0f3;border-radius:4px;padding:4px;gap:0">${[['Invite','invite.main:code'],['Invitation Reward','invite.main:rewards']].map(([l,g])=>`<span data-go="${g}" style="cursor:pointer;padding:2px 8px;border-radius:3px;font-size:13px;line-height:20px;${(sub==='reward')===(l!=='Invite')?'background:#fff;color:var(--text-primary)':'color:var(--text-secondary)'}">${l}</span>`).join('')}</div>`;
function shareBox(toast){
 const item=(lbl,val,help)=>`<div class="row g16"><div class="col grow" style="gap:4px"><span class="cap c2 med" style="letter-spacing:0">${lbl}</span><span class="b2 med" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${val}</span><span class="cap c2" style="line-height:1.33;letter-spacing:.2px">${help}</span></div><button class="icon-btn" style="padding:5px">${icx('inv-ic-copy.svg')}</button></div>`;
 return `<div class="col g8" style="position:relative"><span class="b2 semi center">Share Your Invitation Link</span>
  <div class="col g16" style="background:#fff;border:1px solid var(--divider);border-radius:8px;padding:16px">${item('FRIEND INVITATION CODE','654321T','Share this code with your friends.')}<hr class="divider">${item('FRIEND INVITATION LINK','https://www.TetherMax.io/signup?inviteCode=654321T','Friends are taken directly to the sign-up page.')}</div>
  ${toast?`<div class="toast" style="bottom:-28px;background:#1c1c1e;border-radius:8px;min-width:240px">${toast}</div>`:''}</div>`}
// 거래소 계정 등록 현황(REQ-420 · 433): DEX 4행, 배지 = 등록 계정 수 합(Figma 38)
const REG=[['Bitget',1,'123,123.00'],['BingX',10,'123,123.00'],['Binance',10,'123,123.00'],['Bybit',10,'123,123.00'],['Lighter',2,'18.40'],['ApeX',1,'7.60'],['EdgeX',3,'24.00'],['Aster',1,'3.00']];
function regTable(){
 const n=REG.reduce((a,r)=>a+r[1],0);
 const th=(t,r)=>`<th style="background:none;border:0;padding:12px 0;font-weight:400;font-size:12px;color:var(--text-secondary);white-space:normal;${r?'text-align:right':''}">${t}</th>`;
 const rows=REG.map(([e,c,v])=>`<tr><td style="border:0;padding:20px 0;width:45%"><span class="row g4">${logo(e,24)}<span class="b2 semi">${e}</span></span></td><td style="border:0;text-align:right;padding-right:0" class="b2 tnum">${c}</td><td style="border:0;text-align:right;padding-right:0" class="b2 tnum">${v}</td></tr>`).join('');
 return `<div class="col g8"><div class="row g8"><span class="b1 semi">${T('Exchange Account Registration Status','거래소 계정 등록 현황')}</span>${badge(n)}</div><span class="cap c2">Rewards include trading cashback from linked CEX and DEX accounts.</span>
  <table class="tbl" style="margin-top:8px"><thead><tr>${th('Exchange')}${th(T('No. of Registered Accounts','등록 계정 수'),1)}${th('Cumulative Invitation Rewards (USDT)',1)}</tr></thead><tbody>${rows}</tbody></table></div>`}
function rewardCard(amount,st){
 const btn2=`<button class="btn outlined black md" style="height:36px">Reward History</button><button class="btn outlined black md" style="height:36px">Referral Details</button>`;
 const auto=`<button class="btn contained primary md" disabled style="height:36px;min-width:136px">Auto Claim</button>`;
 const below=st==='below50'?`<p class="cap c2" style="margin:8px 0 0">${T('Invitation rewards are claimed automatically at 10 USDT. Just 0.01 USDT more to go.','초대 리워드는 10 USDT가 되면 자동으로 출금돼요. 0.01 USDT만 더 모이면 돼요.')}</p>`:'';
 const head=`<div class="col" style="gap:2px"><span class="cap c2">Available Invitation Rewards</span><span class="h6 semi tnum" style="font-size:${mo()?18:16}px">${amount} USDT</span></div>`;
 if(mo())return box(`<div class="col g12">${head}${auto.replace('min-width:136px','width:100%')}<div class="grid2" style="grid-template-columns:1fr 1fr;gap:8px">${btn2}</div>${below}</div>`);
 return box(`<div class="row between">${head}<div class="row g16">${auto}${btn2}</div></div>${below}`);
}
function invPage(st){
 const sub=['rewards','below50','empty'].includes(st)?'reward':'invite';
 const head=`${tabsTop()}<div style="margin:${mo()?'16px 0 24px':'24px 0'}">${toggle(sub)}</div>`;
 let body='';
 if(st==='empty')body=`<div class="col center" style="align-items:center;gap:8px;padding:${mo()?120:150}px 0 ${mo()?160:180}px"><span class="b1 semi">You haven't invited any friends yet${mo()?'.':''}</span><span class="b2 c2" style="max-width:325px">Share your invitation code with friends and help them start earning cashback rewards.</span><button class="btn outlined primary lg" data-go="invite.main:code" style="width:311px;max-width:100%;margin-top:12px">Share Invitation Code ${icx('inv-ic-share.svg',24)}</button></div>`;
 else if(sub==='reward')body=`<div class="col" style="gap:40px">${rewardCard(st==='below50'?'9.99':'0.00',st)}${regTable()}</div>`;
 else if(st==='normal'||st==='terms')body=`${hero('Invite friends to earn cashback with TetherMax','Share the benefits and help friends get more value from their trades.')}<div class="col g16" style="margin-top:48px">${steps(STEPS_INV())}<button class="btn outlined primary lg" data-go="invite.main:code" style="width:311px;margin:0 auto">Get Friend Invitation Code</button></div>`;
 else body=`${hero('Invite friends to earn cashback with TetherMax','Share the benefits and help friends get more value from their trades.')}<div class="col" style="gap:24px;margin-top:48px">${steps(STEPS_INV())}${shareBox(st==='codeCopied'?'Invite code copied':st==='linkCopied'?'Invite link copied':'')}</div>`;
 // 초대 랜딩(IF1)은 상단 탭에 토글이 없다
 const top=st==='normal'||st==='terms'?`${tabsTop()}<div style="height:24px"></div>`:head;
 return `<div style="max-width:${mo()?'none':'928px'};margin:0 auto;padding:${mo()?'8px 16px 32px':'40px 0 64px'}">${top}${body}<div style="margin-top:${mo()?24:48}px">${terms(TERMS,st==='terms')}</div></div>`}

R.screen({id:'invite.main',group:'invite',title:'친구 초대',route:'/point/invite',fu:['FU-077','FU-078','FU-079'],
 shell:{nav:'rewards',accent:true,noTop:true,noNav:true},
 states:[
  {id:'normal',label:'초대 랜딩 (IF1)',figma:{pc:'28960:126816',mo:'12474:203982'},note:'모바일은 [기존 MAX-587] Invite Friends mWeb 1행(같은 문구·약관 아코디언 접힘) · V2.2 inv/IF8#normal · 3단계 끝 문구는 G-198 확정값으로 교체(Figma는 「whenever they trade」)'},
  {id:'code',label:'Invite 탭 — 코드·링크 (IF3)',figma:{pc:'28960:126828',mo:'12503:260211'},note:'모바일 [기존 MAX-587] mWeb 2행 · Figma에만 있는 상태 — 초대 코드 받기 후 화면(정책 B-8-15 초대 탭)'},
  {id:'codeCopied',label:'코드 복사 토스트 (IF4)',figma:{pc:'28960:126834'},note:'IF4 Code copied — 토스트 상태 · 모바일은 재사용: 기존 mWeb 2행(12503:260211) + [기존 MAX-468] 「Toast when issuing invitation code」(12340:51396) 토스트'},
  {id:'linkCopied',label:'링크 복사 토스트 (IF5)',figma:{pc:'28960:126840'},note:'IF5 Link copied — 토스트 상태 · 모바일은 재사용: 기존 mWeb 2행 + [기존 MAX-468] 토스트(12340:51396)'},
  {id:'empty',label:'Invitation Reward 탭 — 0명 빈 상태 (IF6)',figma:{pc:'28960:126846',mo:'29065:5700'},note:'V2.2 inv/IF8#empty · REQ-419 — 약관은 계속 표시'},
  {id:'terms',label:'약관 bullet 펼침',figma:null,note:'V2.2 inv/IF8#terms · PC는 약관이 항상 펼쳐짐(IF1과 같음). 모바일 펼친 상태는 재사용 — [기존 MAX-425] 「Terms&NotesExpanded」(4923:56476) 틀'},
  {id:'rewards',label:'Invitation Reward 탭 — 자동 지급 (IF7)',figma:{pc:'28967:127210',mo:'29065:6175'},note:'V2.2 inv/IF8#rewards · REQ-413·414 — `Auto Claim` 비활성, 계정 선택 없음(관리자 지정 계정으로 50 USDT부터 자동 지급). 모바일 Figma `Withdraw`·`Linked Trading Accounts 31`은 정책 문구로 바꿈'},
  {id:'below50',label:'10 USDT 미만',figma:null,note:'V2.2 inv/IF8#below50 · REQ-414 · 결정 D8(최소 10 USDT) — 안내 문구 = 05.리포트/문구표_DEX.md'},
 ],
 render(st){return invPage(st)}});

// 초대받은 사람 가입 랜딩 (IF2) — 게스트 화면
const STEPS_LANDING=['Click the \'Sign up and receive up to 15 USDT\' button','Sign up for TetherMax','Receive a Friend Invitation Celebration Coupon with random USDT rewards.'];
R.screen({id:'invite.landing',group:'invite',title:'초대받은 사람 가입 랜딩',route:'/signup?inviteCode={code}',fu:['FU-079'],
 shell:{accent:true,noNav:true,noTop:true},
 states:[{id:'normal',label:'피초대자 가입 랜딩 (IF2)',figma:{pc:'28960:126822',mo:'12565:243367'},note:'모바일 [기존 MAX-587] mWeb 5행 · Figma에만 있는 화면 — 약관 4곳 중 하나(REQ-421 「피초대자 가입 랜딩」). 게스트 GNB로 보면 실제와 같다'}],
 render(){
  return `<div style="max-width:${mo()?'none':'928px'};margin:0 auto;padding:${mo()?'16px 16px 32px':'40px 0 64px'}">${hero('Start Trading and Earn Cashback Together','Sign up for TetherMax and enjoy exclusive rewards alongside the friend who invited you.')}
   <div class="col g16" style="margin-top:48px">${steps(STEPS_LANDING)}<button class="btn contained primary lg" data-go="auth.signup" style="width:311px;max-width:100%;margin:0 auto">Sign Up and Receive Up to 15 USDT</button></div>
   <div style="margin-top:56px">${terms(TERMS)}</div></div>`}});

// ================= 파트너 허브 =================
// 약관 — Figma PH1 문구. 최소액은 G-203 확정(초기 10 USDT, 영문 50 표기는 10으로 정정)
const PH_TERMS=['Invite Rewards are paid automatically from 10 USDT.',
 'Invite Rewards are only earned on the "trading-generated cashback" portion of a sub-account\'s payout.',
 'Invite Rewards are earned on cashback from both centralised exchanges (CEXs) and decentralised exchanges (DEXs) linked to TetherMax.',
 'Invite Rewards are always paid in USDT.',
 'Signing up via the copied URL removes the need to manually enter an invite code.',
 'If not signing up via the link, entering the invite code will designate that person as your invited friend.',
 'Members who registered before being invited are excluded from this event.',
 'The invite code can only be entered once and cannot be changed after entry.',
 'There is no limit on the number of friends you can invite, but reward rates may be changed or restricted at the operator\'s discretion.',
 'If a member participates through fraudulent means, Invite Rewards may be reclaimed without prior notice.',
 'This event may be changed or discontinued without prior notice at the operator\'s discretion.',
 'For some exchanges or DEXs, Invite Rewards may not be earned even if a sub-account earns cashback.',
 'If you would like to promote a sub-account to Partner status, please contact your TetherMax manager'];
// Linked Accounts(REQ-426 · 434): 행 금액 = 하위 계정 캐시백, DEX는 `{n} wallets`
const PH_ACC=[['Bitget','89 UIDs','4,521.30'],['OKX','52 UIDs','3,102.18'],['Bybit','34 UIDs','2,890.44'],['Lighter','12 wallets','1,204.55'],['ApeX','9 wallets','980.10'],['Binance','1 UID','61.89'],['BitMEX','1 UID','24.12']];
const accRow=([n,c,v],s=30,last)=>`<div class="row g12" style="padding:14px 0;${last?'':'border-bottom:1px solid var(--divider)'}">${logo(n,s)}<div class="col grow" style="gap:0"><span class="b2${s>30?'':' '}" style="font-size:${s>30?14:13}px">${n}</span><span class="cap c2">${c}</span></div><span class="b2 semi tnum">${v} USDT</span></div>`;
function lineChart(pts,labels){
 const W=380,H=170,max=20;const x=i=>18+i*(W-24)/(pts.length-1),y=v=>H-14-(v/max)*(H-30);
 const grid=[20,10,0].map(v=>`<line x1="18" x2="${W}" y1="${y(v)}" y2="${y(v)}" stroke="rgba(0,0,0,.1)" stroke-dasharray="2 3"/><text x="0" y="${y(v)+3}" font-size="8" fill="rgba(0,0,0,.6)">${v}</text>`).join('');
 const lab=labels.map((l,i)=>`<text x="${x(i)}" y="${H+4}" font-size="8" fill="rgba(0,0,0,.6)" text-anchor="middle">${l}</text>`).join('');
 return `<svg viewBox="0 0 ${W+4} ${H+10}" style="width:100%;height:auto;display:block">${grid}<polyline fill="none" stroke="#0031c6" stroke-width="1.5" points="${pts.map((v,i)=>x(i)+','+y(v)).join(' ')}"/>${pts.map((v,i)=>`<circle cx="${x(i)}" cy="${y(v)}" r="2.5" fill="#fff" stroke="#0031c6" stroke-width="1.2"/>`).join('')}${lab}</svg>`}
const range=()=>`<div style="display:grid;grid-template-columns:repeat(3,1fr);background:#f2f4f7;border-radius:4px;padding:4px;margin-top:12px">${['7D','1M','3M'].map((l,i)=>`<span class="b2 center" style="padding:6px 0;border-radius:3px;${i?'':'background:#e2e6ec'}">${l}</span>`).join('')}</div>`;
const card=(inner,o={})=>`<div style="background:#fff;border-radius:8px;padding:${o.p??24}px;${o.style||''}">${inner}</div>`;
function trendCard(){
 const stat=(k,v)=>`<div class="col center" style="align-items:center;border:1px solid var(--divider);border-radius:4px;padding:8px 4px;gap:0"><span class="c2" style="font-size:10px">${k}</span><span class="cap tnum" style="font-size:12px">${v}</span></div>`;
 return card(`<div class="col g12"><span class="b1 semi" style="font-size:17px">Invite Reward Trend</span><div class="grid3" style="gap:8px;grid-template-columns:repeat(3,1fr)">${stat('Total','36.20 USDT')}${stat('Average','5.17 USDT')}${stat('Highest','75.04 USDT')}</div>
  <div class="col" style="gap:0;margin-top:8px"><span class="h6 bold tnum" style="font-size:20px">20.00 USDT</span><span class="b2 c2">2026/04/14 (Today)</span></div>${lineChart([0,1,2.2,4,8,5.5,17,18.5,20],['3/25','','3/26','3/27','3/28','3/29','3/30','','3/31'])}${range()}</div>`)}
function linkedCard(){
 return card(`<div class="col" style="gap:4px"><div class="row between"><span class="row g8"><span class="b1 semi">Linked Accounts</span>${badge(7,'grey')}</span><span class="row g4 cap c2" data-go="partner.hub:total" style="cursor:pointer">198 Total ${icx('inv-ic-chevron.svg',20)}</span></div>
  <span class="cap c2" style="text-align:right;margin:12px 0 4px">Sub-accounts’ cashback in USDT (USDC shown 1:1).</span>${PH_ACC.slice(0,5).map((r,i,a)=>accRow(r,30,i===a.length-1)).join('')}</div>`)}
function shareCard(){
 const it=(l,v,h)=>`<div class="row g16"><div class="col grow" style="gap:4px;min-width:0"><span class="c2 med" style="font-size:11px">${l}</span><span class="b1" style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${v}</span><span class="c2" style="font-size:11px">${h}</span></div>${icx('inv-ic-copy.svg')}</div>`;
 const grp=(a,b)=>`<div class="col g16" style="border:1px solid var(--divider);border-radius:8px;padding:16px">${a}<hr class="divider">${b}</div>`;
 return card(`<div class="col g12"><span class="b1 semi">Share Your Invitation Link</span><span class="c2 med" style="font-size:11px">FOR DIRECT SIGN UP</span>${grp(it('INVITATION CODE','654321T','Share this code with your friends'),it('SIGN-UP LINK','https://www.tethermax.io/signup?inviteCode=654321T','Friends are taken directly to the sign-up page'))}
  <span class="row g4 c2 med" style="font-size:11px;margin-top:8px">FOR BRIEF INTRODUCTION ${icx('inv-ic-info.svg',16)}</span>${grp(it('INVITATION LINK','https://www.tethermax.io?REF=654','Direct homepage for easy entry'),it('CASHBACK LINK','https://www.tethermax.io?REF=654','Cashback preview for curious users'))}</div>`,{p:16})}
function subCard(){
 const node=(l,n,bg)=>`<div class="col center" style="align-items:center;background:${bg};color:#fff;border-radius:2px;padding:4px 0;gap:0;font-size:11px;line-height:1.35"><span>${l}</span><span>${n}</span></div>`;
 return card(`<div class="col g8"><span class="b1 semi">My Sub-Accounts</span><span class="h6 semi tnum">184</span>
  <div class="col center" style="align-items:center;gap:0;margin-top:4px"><span style="background:#1c1c1e;color:#fff;border-radius:4px;padding:3px 8px;font-size:11px">My Account (Partner)</span><span style="width:1px;height:14px;background:var(--divider)"></span><span style="width:66%;height:1px;background:var(--divider)"></span>
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;width:100%;max-width:312px;margin-top:14px">${node('Partner',3,'#0031c6')}${node('Affiliate',41,'#0288d1')}${node('Member',140,'#5d6067')}</div></div></div>`,{p:16})}
// 전환 퍼널(REQ-430): Registered → Account-Linked → Cashback Recipients · Link Rate · Payout / Settled Rate + `DEX: cashback settled`
function funnelCard(){
 const lv=(n,l,w,c,top)=>`<div style="position:relative;width:${w}px;height:58px;margin:0 auto;background:${c};clip-path:polygon(0 0,100% 0,${100-top}% 100%,${top}% 100%);color:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.25"><b class="tnum" style="font-size:${l==='Registered'?15:12.5}px">${n}</b><span style="font-size:9.5px;text-align:center">${l}</span></div>`;
 const rate=(v,l,s)=>`<div class="row g12" style="align-items:center"><span style="width:8px;height:8px;border:1px solid #000;border-radius:50%"></span><div class="col" style="gap:0;line-height:1.35"><b class="tnum" style="font-size:11px">${v}</b><span class="c2" style="font-size:11px">${l}</span>${s?`<span class="c2" style="font-size:10px">${s}</span>`:''}</div></div>`;
 return card(`<div class="col g12"><span class="b1 semi">Conversion Funnel</span><div class="row" style="gap:16px;align-items:center;justify-content:center"><div style="width:190px">${lv('100,804','Registered',190,'#0031c6',12)}${lv('100,021','Account-Linked',146,'#2456e8',12)}${lv('10,021','Cashback<br>Recipients',104,'#1565c0',22)}</div><div class="col" style="gap:34px">${rate('65.7%','Link Rate')}${rate('81%','Payout / Settled Rate','DEX: cashback settled')}</div></div></div>`,{p:16})}
function distCard(){
 const leg=(c,l,n,p)=>`<div class="row" style="gap:8px"><span style="width:8px;height:8px;border-radius:50%;background:${c}"></span><span class="cap c2 grow">${l}</span><b class="cap tnum">${n}</b><span class="c2" style="font-size:10px">${p}</span></div>`;
 const donut=`<div style="width:${mo()?92:164}px;height:${mo()?92:164}px;border-radius:50%;background:conic-gradient(#5d6067 0 23.9%,#e0e0e0 23.9% 50%,#0031c6 50% 100%);display:flex;align-items:center;justify-content:center;flex:none"><div style="width:58%;height:58%;border-radius:50%;background:#fff;display:flex;flex-direction:column;align-items:center;justify-content:center"><b class="tnum" style="font-size:${mo()?13:20}px">284</b><span class="c2" style="font-size:${mo()?9:14}px">Total</span></div></div>`;
 const legend=`<div class="col g12" style="width:${mo()?'auto':'254px'};flex:1">${leg('#0031c6','Active (&lt;7 days)',142,'(50.0%)')}${leg('#5d6067','Idle (7-21 days)',68,'(23.9%)')}${leg('#e0e0e0','Inactive (21+ days)',74,'(26.1%)')}</div>`;
 return card(`<div class="col g16"><span class="b1 semi">Sub-Account Activity Distribution</span><div class="${mo()?'row g16':'col g24'}" style="align-items:center">${donut}${legend}</div></div>`,{p:16})}
function growthCard(){return card(`<div class="col g12"><span class="b1 semi">Growth Trend</span><div class="col" style="gap:0"><span class="h6 bold tnum" style="font-size:20px">307</span><span class="b2 c2">2026/04/14 (Today)</span></div>${lineChart([0,1,2.2,4,8,5.5,17,18.5,20],['03/25','','03/26','03/27','03/28','03/29','03/30','','03/31'])}${range()}</div>`,{p:16})}
function phDashboard(){
 const updated=`<span class="row g4 b2 c2">${icx('inv-ic-update.svg',16)}Updated in 15mins</span>`;
 const tabs=`<div class="tabs" style="border-bottom:0">${['Dashboard','Sub-Account'].map((l,i)=>`<span class="tab${i?'':' on'}" style="${mo()?'flex:1;text-align:center;':''}font-size:14px;font-weight:400">${l}</span>`).join('')}</div>`;
 const avail=card(`<div class="row between g12"><div class="col" style="gap:8px"><span class="b2 c2">Available for payout</span><span class="b1 semi tnum" style="font-size:16px">63.87 USDT</span></div><button class="btn contained primary md" disabled style="min-width:103px;height:36px">Auto Claim</button></div>`);
 const cum=card(`<div class="row between g12"><div class="col" style="gap:4px"><span class="b2 c2">Total Cumulative Invite Reward</span><span class="b2 semi tnum">8,241.70 USDT</span></div><span class="row g4 c2" style="font-size:11px">View history ${icx('inv-ic-chevron.svg',16)}</span></div>`);
 const rate=card(`<div class="col" style="gap:4px"><span class="b2 c2">Reward Rate</span><span class="b2 semi">45%</span><span class="c3" style="font-size:10px">Contact Manager to Update</span></div>`);
 const tc=terms(PH_TERMS);
 if(mo())return `<div class="col g12" style="padding:8px 16px 32px">${tabs}${updated}${avail}${cum}${rate}${linkedCard()}${trendCard()}${shareCard()}${subCard()}${funnelCard()}${distCard()}${growthCard()}${tc}</div>`;
 return `<div style="max-width:1088px;margin:0 auto;padding:40px 0 80px" class="col g24"><div class="row between">${tabs}${updated}</div>
  <div class="grid3" style="gap:24px">${avail}${cum}${rate}</div>
  <div class="grid2" style="gap:24px;align-items:start">${trendCard()}${linkedCard()}</div>
  <div class="grid2" style="gap:24px;align-items:start">${shareCard()}<div class="col g24">${subCard()}${funnelCard()}</div></div>
  <div class="grid2" style="gap:24px;align-items:stretch">${distCard()}${growthCard()}</div>${tc}</div>`}
function phShell(inner){return mo()?`${moTop('Partner Hub','my.main')}<div class="page accent">${inner}</div>`:`${gnb()}<div class="page accent">${inner}</div>${footer()}`}

R.screen({id:'partner.hub',group:'invite',title:'파트너 허브',route:'/partner-hub',fu:['FU-080','FU-077'],shell:false,closeTo:'partner.hub:normal',
 states:[
  {id:'normal',label:'대시보드 — Linked Accounts · 퍼널 (PH1)',figma:{pc:'28960:127182',mo:'29065:3660'},note:'V2.2 ph/PHUB#normal · REQ-426·428·430·434 — `Auto Claim` 비활성(모바일 Figma `Withdraw`는 쓰지 않음). 약관 최소액 50→10 USDT(G-203)'},
  {id:'total',label:'Total → 거래소별 집계 모달 (PH2)',figma:{pc:'29042:100846',mo:'6266:13382'},note:'모바일 [기존 MAX-425] 「When there are more than 5 exchanges (open full modal)」 — 같은 목록 모달(343폭, 스크롤) · Figma에만 있는 상태 — REQ-426 「Total을 누르면 거래소별 연동 계정 수와 캐시백 합계만, Close로 대시보드 복귀」'},
  {id:'modal',label:'하위 회원별 연동 계정 모달',figma:{pc:'28960:127188'},note:'V2.2 ph/PHUB#modal · REQ-427 — Sub-Account의 Member ID에서 연다. CEX 마스킹, DEX 전체 주소, `{n} Accounts`(G-394)'},
 ],
 render(st){
  const page=phShell(phDashboard());
  if(st==='normal')return page;
  let dlg;
  if(st==='total')dlg=`<div class="dialog" style="width:444px;gap:8px;text-align:left"><div class="row between"><span class="row g8"><span class="b2 semi">Linked Accounts</span>${badge(7,'grey')}</span><span class="cap c2">198 Total</span></div>${PH_ACC.map((r,i,a)=>accRow(r,24,i===a.length-1)).join('')}<button class="btn contained primary lg full" data-go="partner.hub:normal" style="margin-top:16px">Close</button></div>`;
  else{
   const rows=[['Binance','********7C92','+61.89'],['Bitget','********6102','+24.12'],['OKX','********8261','+12.11'],['Lighter',W_LIGHTER,'+18.40'],['ApeX',W_APEX,'+9.75']]
    .map(([n,a,v])=>`<div class="row g12" style="border:1px solid var(--divider);border-radius:4px;padding:10px 12px">${logo(n,30)}<div class="col grow" style="gap:2px;min-width:0"><span class="b1">${n}</span><span class="b2 c2" style="word-break:break-all">${a}</span></div><span class="b2 tnum" style="color:var(--success);white-space:nowrap">${v} USDT</span></div>`).join('');
   dlg=`<div class="dialog" style="width:460px;gap:8px;text-align:left"><div class="col" style="gap:0"><span class="h6" style="font-size:20px">${T('Linked Accounts','연동 계정')}</span><span class="b2 c2">Member ID 9900690997</span></div><span class="b2 c2" style="margin-top:12px">${T('5 Accounts','5개 계정')}</span>${rows}<button class="btn contained primary lg full" data-go="partner.hub:normal" style="margin-top:16px">Close</button></div>`;
  }
  return `<div style="position:relative;min-height:${mo()?812:900}px">${page}<div class="scrim center" style="align-items:${mo()?'center':'flex-start'}">${dlg}</div></div>`;
 }});
