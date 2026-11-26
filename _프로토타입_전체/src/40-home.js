// 4. 홈 · 잔액 · 지갑 상세
// Figma: DEX(revision) › "DEX · 기존 홈 / 허브 / 지갑 상세의 잔액 표시 · Web"(HW1 · PW1 · 지갑 상세 이벤트 리워드 매칭 상태)
//        "DEX — Link stories on home (S3, S4)"(S3-1 · S3-7 · S4-1 · S4-6) · "게스트 캐시백"(Mobile / Guest entry / Home)
// 정책: FU-011 · FU-022 · FU-029~FU-041 · FU-044. 출금 자리는 항상 비활성 Auto Claim(10분 주기 자동 지급, REQ-270)
// 기능 ID와 V2.2 키: home/S3 · home/S4 · home/LKD · home/TL · home/FAQ · link/HOME · wd/CLAIM · wd/SECOND · wd/REFLECT · cmn/LABELS

// ---------- 공통 ----------
const HA=n=>A('home-'+n);
const hic=(n,s=24)=>`<img src="${HA('ic-'+n+'.svg')}" style="width:${s}px;height:${s}px;flex:none" alt="">`;
const n2=n=>(Math.floor(n*100+1e-6)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const up2=n=>(Math.ceil(n*100-1e-6)/100).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const clk=iso=>new Date(iso).toLocaleString(S.lang==='ko'?'ko-KR':'en-US',{month:'short',day:'numeric',hour:'2-digit',minute:'2-digit',hour12:false});
const short=a=>a.slice(0,6)+'…'+a.slice(-4);
const WAL={ // 표본 주소(대소문자 보존 REQ-063). 앞 6 · 뒤 4자리는 Figma 예시와 같다
 lighter:'0x7a3F9c2B8e41D05a6F3b7C91e2D4a8B0c6E551e9',
 apex:'0x91c4E2a7B5d03F6c8A1e9D2b7C4f6A3e8B05a07b',
 aster:'0x5e0d7B3a9C1f4E6d2A8b5C3e7F9a1D4c6B82c2f4',
 edgex:'0x52908400098527886E0F7030069857D2E4169EE7',
 w2:'0xde709f2102306220921060314715629080e2fb77'};
const CEXLOGO={Bitget:'logo-bitget.png',Bybit:'logo-bybit.png',Binance:'logo-binance.png',OKX:'logo-okx.png'};
const mark=(name,s=32)=>CEXLOGO[name]?`<img src="${HA(CEXLOGO[name])}" style="width:${s}px;height:${s}px;border-radius:50%;flex:none;object-fit:cover" alt="${name}">`:C.dex(name,s);
const isCex=n=>!!CEXLOGO[n];

// 상태 7단계(REQ-272) + DEX 칩(REQ-273). 색은 의미별 4토큰(G-058): done 완료 · prog 진행 · warn 주의 · off 실패/해제
const ST={
 own:{lb:'소유 확인중',tone:'prog',pri:1,linked:false},
 pend:{lb:'연동 시도중이에요',tone:'prog',pri:2,linked:false},
 issue:{lb:'이슈',tone:'warn',pri:3,linked:false},
 ok:{lb:'연동 완료',tone:'done',pri:4,linked:true},
 fail:{lb:'연동 실패',tone:'off',pri:5,linked:false},
 ownfail:{lb:'소유 확인 실패',tone:'off',pri:6,linked:false},
 unlinked:{lb:'연동 해제',tone:'off',pri:7,linked:false},
 zero:{lb:'No cashback yet',tone:'prog',linked:true},
 delayed:{lb:'Data delayed',tone:'warn',linked:true},
 inactive:{lb:'Inactive',tone:'off',linked:true},
};
const DOT={done:'#2ea652',prog:'#ed6b03',warn:'#ed6b03',off:'rgba(0,0,0,0.38)'};
// 칩: Figma HW1(주의 = 채움 #e65100) · S4-6(진행 = 파랑 외곽선) · PW1(완료 = 연녹 채움). 실패/해제는 MUI 기본 칩
function hChip(label,tone){
 const base='display:inline-flex;align-items:center;max-height:24px;min-height:24px;border-radius:100px;font-size:13px;line-height:18px;letter-spacing:.16px;white-space:nowrap;padding:3px 10px;';
 const t={done:'background:#c8e6c9;color:#1b5e20;font-size:11px;min-height:20px;max-height:20px;padding:2px 7px;',
  prog:'border:1px solid #0031c6;color:#0031c6;',
  warn:'background:#e65100;color:#fff;',
  off:'background:rgba(0,0,0,0.08);color:rgba(0,0,0,0.87);'}[tone];
 return `<span style="${base}${t}">${label}</span>`}

// ---------- 셸 (게스트 상태에서 랜딩 화면을 통째로 쓰기 위해 홈은 셸을 직접 그린다) ----------
// 모바일: 기존 mWeb(22913:1051713)은 상단 바 + 본문 + 푸터, 하단 탭은 mAPP(8582:156599)에만 — o.app일 때만 moNav
function hShell(body,o={}){
 if(S.vp==='mo')return `${moTop(o.moTitle||'',o.back)}<div class="page accent">${body}</div>${moNav(o.moNav||'home',{app:o.app})}${footer()}`;
 return `${gnb(o.nav)}<div class="page accent">${body}</div>${footer()}`}
const toastLinked=()=>`<div style="position:absolute;left:50%;top:${S.vp==='mo'?72:88}px;transform:translateX(-50%);width:${S.vp==='mo'?343:360}px;z-index:15;border-radius:8px;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px rgba(0,0,0,.14),0 1px 18px rgba(0,0,0,.12);background:var(--blue);display:flex;align-items:center;padding:6px 16px"><span style="padding:7px 12px 7px 0;display:flex">${hic('toast-check',20)}</span><span class="b2 med" style="color:#fff;padding:8px 0;letter-spacing:.15px">Account linked successfully</span></div>`;

// ---------- 홈 왼쪽 열: 총액 카드 · Linked Accounts (Figma HW1 · S4-1) ----------
function balanceCard(o={}){
 if(o.loading)return `<div style="background:#fff;border-radius:8px;height:72px;box-shadow:0 4px 10px rgba(0,0,0,.04);padding:16px 16px 16px 58px;display:flex;flex-direction:column;justify-content:center;gap:6px">${C.skel('40%',18)}${C.skel('55%',12)}</div>`;
 if(o.error)return `<div style="background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,.04);padding:12px 16px" class="col g12">${C.alert('warn','',"We can't load your balance right now.")}${C.btn('Try again',{v:'outlined',size:'sm'})}</div>`;
 const amt=o.amount==null?'0.00':n2(o.amount);
 return `<div style="background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,.04);position:relative;overflow:hidden;min-height:72px;display:flex;align-items:center;gap:8px;padding:${o.sub?'12px':'0'} 0 ${o.sub?'12px':'0'} 58px">
  <img src="${HA('tokens.png')}" style="position:absolute;left:-48px;top:-11px;width:106px;height:106px;object-fit:cover" alt="">
  <div class="grow" style="min-width:0"><div class="b1 semi">${o.raw||amt+' USDT'}</div><div style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">Total Cashback Balance</div>${o.sub||''}</div>
  <button class="btn contained md" disabled style="margin-right:${S.vp==='mo'?12:0}px;padding:8px 24px">Auto Claim</button></div>`}

// 행: 로고 · 이름 · (상태 점 + 식별자) · 칩 · 금액. 웹은 `Wallet` 라벨, 앱·모바일웹은 주소만(REQ-271)
function accRow(a,o={}){
 const st=ST[a.st||'ok'];const cex=isCex(a.ex);const app=o.app;
 const id=cex?`UID ${esc(a.id)}`:`${app?'':'Wallet '}${o.full?`<span style="word-break:break-all">${esc(a.id)}</span>`:short(a.id)}`;
 const showChip=a.st&&a.st!=='ok';
 const amt=a.amt==null?'-':a.amt;
 const amtHtml=amt==='-'?`<span class="b1 semi">-</span>`:`<span class="row" style="gap:4px;align-items:baseline;white-space:nowrap"><span class="b1 semi">${n2(amt)}</span><span class="b2 c2">USDT</span></span>`;
 const go=cex?'':` data-go="home.wallet:${a.st==='pend'?'pending':'normal'}" style="cursor:pointer;`;
 return `<div class="row g12"${go||' style="'}display:flex;padding:10px 12px;border-radius:12px;align-items:center">
  ${mark(a.ex,32)}
  <div class="col grow" style="gap:2px;min-width:0"><span class="b2 semi">${a.ex}</span>
   <span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)"><span style="color:${DOT[st.tone]}">●</span>&nbsp; ${id}</span>
   ${showChip?`<span>${hChip(st.lb,st.tone)}</span>`:''}${a.extra?`<span style="font-size:12px;line-height:1.5;color:var(--text-secondary)">${a.extra}</span>`:''}</div>
  <div style="flex:none">${amtHtml}</div></div>`}
function linkedCard(rows,o={}){
 const app=o.app||S.vp==='mo';
 const foot=app?'Trading on multiple exchanges? Link more':'Using multiple platforms? Link more accounts';
 const list=o.loading?[1,2,3].map(()=>`<div class="row g12" style="padding:10px 12px"><span class="skel" style="width:32px;height:32px;border-radius:50%"></span><div class="col grow" style="gap:6px">${C.skel('40%',12)}${C.skel('70%',10)}</div>${C.skel('64px',14)}</div>`).join('')
  :(o.max?rows.slice(0,o.max):rows).map(a=>accRow(a,{app,full:o.full})).join('');
 const more=o.max&&rows.length>o.max?`<button class="btn text black sm full">${T('See more','더보기')} (${rows.length-o.max})</button>`:'';
 const line=`<hr class="divider" style="margin:0">`;
 const cum=o.cum===false||o.loading?'':`${line}${cumulative(rows)}`;
 return `<div style="background:#fff;border-radius:8px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));padding:16px;display:flex;flex-direction:column;gap:12px">
  <div class="row between"><span class="b1 semi">Linked Accounts</span><button class="btn text primary sm" style="padding:4px 5px">See All</button></div>
  ${o.top||''}<div class="col" style="gap:12px">${list}</div>${more}
  ${cum?line:''}<button class="btn text primary sm full" style="padding:4px 5px" data-go="link.select:all">${foot}</button>${cum}</div>`}
// 누적 캐시백 요약 — 기존 [MAX-7] MAXOP-731 `Cumulative Cashback Summary`(Web 22913:1054295 · mWeb 22931:51476)를 Linked Accounts 카드 안 맨 아래에 그대로
const CUM={total:1284.2,month:151.2,withdrawn:920}; // V2.2 home/TL 표본값(누적 캐시백 · 이번 달 · 누적 출금)
function cumulative(rows=[]){
 const n=rows.filter(r=>ST[r.st||'ok'].linked).length||rows.length;
 const metric=(v,k)=>`<div class="col grow" style="gap:4px;padding:12px 12px 12px 0;min-width:0"><span class="b2 med tnum" style="white-space:nowrap">${n2(v)} USDT</span><span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">${k}</span></div>`;
 return `<div class="col" style="gap:12px">
  <div class="row" style="gap:10px;height:58px"><img src="${HA('safe.png')}" style="width:58px;height:58px;object-fit:cover;flex:none" alt="">
   <div class="col" style="gap:4px"><span class="row" style="gap:4px"><span class="b1 semi tnum">${n2(CUM.total)} USDT</span><img src="${HA('ic-info.svg')}" style="width:16px;height:16px" title="거래로 인한 캐시백과 이벤트 리워드를 합산한 금액을 표시합니다." alt=""></span><span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">Total cumulative cashback</span></div></div>
  <div class="row" style="gap:12px;align-items:flex-start">${metric(CUM.month,'This month')}${metric(CUM.withdrawn,'Total withdrawn')}</div>
  <div class="row between"><span style="width:162px;font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">${T(`Total of ${n} accounts · Update times vary by exchange`,`${n}개 거래 계정 합산 · 거래소마다 갱신 시각이 달라요`)}</span><button class="btn text primary sm" style="padding:4px 5px" data-go="summary.main">View history</button></div></div>`}

// ---------- 홈 오른쪽 열: 기존 홈 콘텐츠 (Figma HW1 main) ----------
const secHead=(t,go)=>`<div class="row" style="gap:16px"><span style="font-size:24px;line-height:1.334;font-weight:700;white-space:nowrap">${t}</span><span class="grow" style="height:1px;background:var(--divider)"></span><button class="btn text primary md" style="padding:8px 11px;font-size:15px"${go?` data-go="${go}"`:''}>See All</button></div>`;
function evBanner(img,title,tag){
 const tg=tag==='Lighter'?C.dex('Lighter',14):`<img src="${HA('bitget-sm.png')}" style="width:14px;height:14px;border-radius:50%" alt="">`;
 return `<div style="height:140px;border-radius:4px;position:relative;overflow:hidden;background:#000">
  <img src="${HA(img)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="">
  <p style="position:absolute;left:0;top:0;margin:0;padding:24px 16px 16px;width:${S.vp==='mo'?'62%':'180px'};color:#fff;font-size:16px;line-height:1.5;font-weight:600;letter-spacing:.15px">${title}</p>
  <span style="position:absolute;left:0;top:0;background:#1c1c1e;border-radius:4px 0 4px 0;padding:4px 8px;display:flex;align-items:center;gap:4px;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;color:#fff;letter-spacing:.16px">${tag}</span></span></div>`}
const evCard=(banner,mid,join)=>`<div style="background:#fff;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px;flex:1;min-width:0">${banner}${mid}${join}</div>`;
const evRow=(icon,k,v)=>`<div class="row between"><span class="row" style="gap:4px">${hic(icon,16)}<span class="b2 c2">${k}</span></span><span class="b2">${v}</span></div>`;
const ongoing=`<span style="align-self:flex-start;background:#e6e7e9;border-radius:4px;padding:4px;font-size:12px;line-height:12px;color:var(--text-secondary)">Ongoing</span>`;
const joinBtn=(outlined)=>`<button class="btn ${outlined?'outlined primary':'contained primary'} md full" data-go="events.list">Join Now</button>`;
function memberEvents(tag,outlined){
 const grid=S.vp==='mo'?'display:flex;flex-direction:column;gap:16px':'display:flex;gap:16px';
 return `<div style="${grid}">
  ${evCard(evBanner('ev-btc.jpg','Predict Bitcoin price and win up to 1,000.00 USDT',tag),evRow('redeem','Rewards','Up to 1,000.00 USDT')+ongoing,joinBtn(outlined))}
  ${evCard(evBanner('ev-challenge.jpg','Earn More Cashback. Earn Extra USDT',tag),evRow('redeem','Rewards','Up to 37 USDT')+ongoing,joinBtn(outlined))}</div>`}
// 모바일 홈 본문 — 기존 mWeb MAXOP-731 Content(22913:1051714): 흰 블록(Exclusive For Members 2열 카드 · Limited Time Offers 1장 + 페이지 점) + 회색 블록(Top Partner Exchanges 가로 목록)
const moHead=(t,go,line)=>`<div class="row" style="gap:16px"><span class="b1 semi" style="white-space:nowrap">${t}</span>${line?'<span class="grow" style="height:1px;background:var(--divider)"></span>':'<span class="grow"></span>'}<button class="btn text primary sm" style="padding:4px 5px"${go?` data-go="${go}"`:''}>See All</button></div>`;
function moMemberCards(tag='Bitget',title='Exclusive For Members'){
 const tg=tag==='Bitget'?`<img src="${HA('logo-bitget.png')}" style="width:24px;height:24px;border-radius:16px" alt="">`:C.dex(tag,24);
 const card=(img,t,s)=>`<div class="col grow" style="gap:8px;min-width:0" data-go="benefits.list"><div style="height:155px;border-radius:8px;background:#000;position:relative;overflow:hidden"><img src="${HA(img)}" style="position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);object-fit:cover" alt="">
  <span style="position:absolute;left:8px;top:123px;background:${tag==='Bitget'?'#00f0ff':'#fff'};border-radius:4px;padding:2px 4px;display:flex;align-items:center;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;letter-spacing:.16px;padding:0 4px">${tag}</span></span></div>
  <div class="col" style="gap:0"><span class="b2 semi">${t}</span><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${s}</span></div></div>`;
 return `<div class="col" style="gap:16px">${moHead(title,'benefits.list')}<div class="row" style="gap:16px;align-items:stretch">${card('mo-lotto.png','Guess Bitcoin Price','Win Up to 1,000 USDT')}${card('mo-piggy.png','Earn More Cashback','Get Extra USDT')}</div></div>`}
function homeMainMo(tag='Bitget'){
 const head=moHead;
 const tg=tag==='Bitget'?`<img src="${HA('logo-bitget.png')}" style="width:24px;height:24px;border-radius:16px" alt="">`:C.dex(tag,24);
 const card=(img,t,s)=>`<div class="col grow" style="gap:8px;min-width:0" data-go="benefits.list"><div style="height:155px;border-radius:8px;background:#000;position:relative;overflow:hidden"><img src="${HA(img)}" style="position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);object-fit:cover" alt="">
  <span style="position:absolute;left:8px;top:123px;background:${tag==='Bitget'?'#00f0ff':'#fff'};border-radius:4px;padding:2px 4px;display:flex;align-items:center;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;letter-spacing:.16px;padding:0 4px">${tag}</span></span></div>
  <div class="col" style="gap:0"><span class="b2 semi">${t}</span><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${s}</span></div></div>`;
 const cd=x=>`<span style="background:rgba(207,216,220,.2);border-radius:4px;padding:4px;font-size:12px;line-height:12px;font-weight:500">${x}</span>`;
 const timer=`<div class="row" style="gap:8px">${hic('alarm',16)}<span class="row" style="gap:4px;font-size:12px;line-height:12px;color:var(--text-secondary)">${cd('--')}D${cd('--')}H${cd('45')}M${cd('00')}S</span></div>`;
 const comp=`<div style="background:#fff;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">${evBanner('ev-comp.jpg','Trade to win up to $100K prize pool','Bitget')}${evRow('trophy','Rewards','$100,000.00')}${timer}<button class="btn contained primary md full" data-go="events.list">Join Now</button></div>`;
 const parts=[['Bitget','#00f0ff','54%'],['Bybit','#15192a','55%'],['Binance','#181a20','50%'],['OKX','#000','65%']];
 return `<div class="col" style="gap:16px">
  <div style="background:#fff;padding:16px;display:flex;flex-direction:column;gap:32px">
   ${moMemberCards(tag)}
   <div class="col" style="gap:16px;align-items:center">${`<div style="width:100%">${head('Limited Time Offers','events.list',true)}</div>`}<div style="width:100%">${comp}</div><img src="${HA('mo-dots.svg')}" style="width:44px;height:6px" alt=""></div></div>
  <div style="background:var(--bg-accent);padding:16px" class="col g16">${head('Top Partner Exchanges','cex.list',true)}
   <div class="row" style="gap:12px;overflow:hidden;align-items:flex-start">${parts.map(([n,bg,p])=>`<div class="col" style="gap:4px;width:100px;flex:none"><div style="background:${bg};height:60px;border-radius:4px;display:flex;align-items:center;justify-content:center">${mark(n,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${n}</span><span style="font-size:12px;line-height:20px;font-weight:500;letter-spacing:.14px">${p} Cashback</span></div>`).join('')}</div></div></div>`}
function homeMain(){
 if(S.vp==='mo')return homeMainMo();
 const cd=(arr)=>arr.map((x,i)=>i%2?`<span style="padding:0 4px 0 2px">${x}</span>`:`<span style="background:rgba(255,224,178,.25);padding:0 4px;border-radius:4px">${x}</span>`).join('');
 const ends=`<span style="align-self:flex-start;border:1px solid #ef6c00;border-radius:999px;padding:2px 4px;display:inline-flex;align-items:center;font-size:11px;line-height:1.38;color:#ef6c00;letter-spacing:.16px">${hic('alarm',16)}<span style="padding:0 2px 0 4px">Ends in</span>${cd(['45','M','37','S'])}</span>`;
 const timer=`<div class="row" style="gap:4px;font-size:12px;color:var(--text-secondary)">${hic('time',16)}<span>--</span> D <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">16</b> H <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">00</b> M <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">30</b> S</div>`;
 const grid=S.vp==='mo'?'display:flex;flex-direction:column;gap:16px':'display:flex;gap:16px';
 const partners=[['Bitget','#00f0ff','54%'],['Bybit','#15192a','55%'],['Binance','#181a20','50%'],['OKX','#000','65%']];
 return `<div style="background:#fff;border-radius:8px;display:flex;flex-direction:column;gap:24px;width:${S.vp==='mo'?'100%':'717px'}">
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Exclusive For Members','benefits.list')}${memberEvents('Bitget',false)}</div>
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Limited Time Offers','events.list')}<div style="${grid}">
   ${evCard(evBanner('ev-comp.jpg','Trade to win up to $100K prize pool','Bitget'),evRow('trophy','Rewards','$100,000.00')+ends,joinBtn())}
   ${evCard(evBanner('ev-vip.jpg','Become a VIP &amp; enjoy the benefits.','Bitget'),evRow('voucher','Voucher','Claim VIP2 Trial')+timer,joinBtn())}</div></div>
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Top Partner Exchanges','cex.list')}<div style="display:grid;grid-template-columns:repeat(${S.vp==='mo'?2:4},minmax(0,1fr));gap:16px">
   ${partners.map(([n,bg,p])=>`<div class="col" style="gap:4px"><div style="background:${bg};height:80px;border-radius:4px;display:flex;align-items:center;justify-content:center">${mark(n,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${n}</span><span style="font-size:12px;line-height:20px;font-weight:500">${p} Total Savings</span></div>`).join('')}</div></div></div>`}

// 홈 2열 레이아웃(347 + 24 + 717) · 모바일 1열
function homeLayout(left,o={}){
 const right=o.right??homeMain();
 if(S.vp==='mo')return `<div style="position:relative;padding:8px 0 16px;display:flex;flex-direction:column;gap:16px">${o.toast?toastLinked():''}<div class="col" style="gap:16px;padding:0 16px">${left}</div>${right}</div>`;
 return `<div style="position:relative;padding:40px 0 80px;display:flex;justify-content:center">${o.toast?toastLinked():''}<div style="display:flex;gap:24px;align-items:flex-start"><div style="width:347px;display:flex;flex-direction:column;gap:16px;flex:none">${left}</div>${right}</div></div>`}

// ---------- 표본 계정 ----------
const R_BITGET={ex:'Bitget',id:'685432171',amt:14,st:'ok'};
const R_LIGHTER={ex:'Lighter',id:WAL.lighter,amt:120,st:'ok'};
const R_APEX={ex:'ApeX',id:WAL.apex,amt:14,st:'ok'};
const sumLinked=rows=>rows.filter(r=>ST[r.st||'ok'].linked&&r.amt!=null).reduce((s,r)=>s+r.amt,0); // 총액 = 매칭 전 합계, 연동 미완료 제외(REQ-268)

// ---------- S3 홈 (FU-037) ----------
function s3Checklist(){
 const badge=n=>`<span style="width:15px;height:15px;border-radius:70px;background:#5d6067;color:#fff;font-size:6px;font-weight:500;display:inline-flex;align-items:center;justify-content:center;flex:none">${n}</span>`;
 const lbl=t=>`<span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">${t}</span>`;
 const div=`<div style="height:1px;background:var(--divider);margin:15px 16px"></div>`;
 const chip=`<span style="background:#0031c6;border-radius:100px;padding:2px 3px;display:inline-flex;align-items:center;max-height:24px">${hic('present',20)}<span style="font-size:11px;line-height:1.38;color:#fff;padding:0 4px">3 USDT</span></span>`;
 return `<div style="background:#fff;border-radius:8px;padding-bottom:24px">
  <div class="b2 semi" style="padding:24px 16px 16px">Unlock Your <span class="cb">First Cashback</span> in 3 Steps!</div>
  <div class="row between" style="padding:0 16px"><span class="row">${badge(1)}${lbl('Create TetherMax account')}</span>${hic('check-step',24)}</div>${div}
  <div class="row between" style="padding:0 16px;cursor:pointer" data-go="cex.list"><span class="row">${badge(2)}${lbl('Browse partners')}</span>${hic('chevron',24)}</div>${div}
  <div class="row" style="padding:0 16px;cursor:pointer" data-go="link.select">${badge(3)}<span class="grow">${lbl('Link your account with us')}</span>${chip}${hic('chevron',24)}</div></div>`}
const s3Preview=()=>`<div data-go="calc.p1" style="cursor:pointer;border:1px solid #c7d6ff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:12px;box-shadow:1px 1px 15px rgba(28,28,30,.04);background:linear-gradient(160deg,rgba(199,214,255,.08),rgba(199,214,255,.35))">
 <div class="row between"><span class="row">${hic('calc',16)}<span class="b2 semi" style="color:#7f9fff">Cashback Preview</span></span>${hic('chevron-blue',16)}</div>
 <p style="margin:0;font-size:12px;line-height:1.33;letter-spacing:.2px"><b class="semi">81,836</b> of our users earn an average of <b class="semi">47.00 USDT</b> to <b class="semi">284.00 USDT</b> in cashback per month.</p></div>`;

// ---------- 게스트(비로그인) 공개 홈 — 모바일 Figma "Mobile / Guest entry / Home", 웹은 랜딩 화면 ----------
function guestHome(){
 if(S.vp==='pc'){
  if(R.byId['landing.main'])return renderInner('landing.main');
  return `${gnb()}<div class="page"><div class="empty">${C.note('웹 게스트 홈 = 랜딩(<code>landing.main</code>, 랜딩·게스트 담당). 아직 등록 전')}</div></div>${footer()}`}
 const stat=(v,k)=>`<div style="flex:none;width:240px;background:#f8fafc;border:1px solid #f2f2f5;border-radius:12px;padding:16px;display:flex;flex-direction:column;gap:4px"><span class="b1 semi cb">${v}</span><span style="font-size:12px;line-height:12px;color:var(--text-secondary)">${k}</span></div>`;
 const link=(t,go)=>`<a class="b2 med c2" data-go="${go}" style="cursor:pointer">${t}</a>`;
 return `<div style="background:#f6f8fa">
 <div style="height:56px;background:#f8fafc;display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:10"><img src="${A('logo.svg')}" style="width:142px;height:16px" alt="TetherMax"><button class="icon-btn" style="background:var(--action-hover);padding:5px">${hic('menu',24)}</button></div>
 <div style="position:relative;height:752px;overflow:hidden;background:#000;display:flex;flex-direction:column;justify-content:flex-end;padding:0 16px 20px">
  <img src="${HA('g-bg.png')}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="">
  <img src="${HA('g-amb.png')}" style="position:absolute;left:16px;top:124px;width:356px;height:737px;object-fit:cover" alt="">
  <div style="position:absolute;right:47px;top:284px;display:flex;flex-direction:column;align-items:flex-end;gap:8px"><img src="${HA('g-sign.png')}" style="width:97px;height:86px;object-fit:cover" alt=""><div style="text-align:right;font-size:12px;font-weight:500;text-shadow:0 2px 1px rgba(0,0,0,.2)"><div style="color:#fff;letter-spacing:.15px;text-transform:uppercase;line-height:12px">Yun Si Yun</div><div style="color:rgba(255,255,255,.38);line-height:1.4;margin-top:4px">Official TetherMax Ambassador</div></div></div>
  <div style="position:relative;display:flex;flex-direction:column;gap:48px">
   <div class="col" style="gap:16px"><p style="margin:0;font-size:32px;line-height:1.2;font-weight:700;letter-spacing:-.96px;color:#fafafa;text-align:center;text-shadow:0 2px 1px rgba(0,0,0,.2),0 1px 3px rgba(0,0,0,.12)">Found a higher rate? We want to hear it</p>
    <div class="row center" style="gap:4px">${`<img src="${HA('g-reward.svg')}" style="width:24px;height:24px" alt="">`}<span class="b1" style="color:#fff">Sign up and get up to <b style="color:#ff9800;font-weight:600">10,000 USDT</b>!</span></div>
    <div style="position:relative;background:#f8fafc;border-radius:1000px;border:1px solid var(--input-border);padding:16px"><span class="b1 c2">Email address</span><button class="btn contained primary lg" data-go="auth.signup" style="position:absolute;right:7px;top:50%;transform:translateY(-50%);border-radius:1000px">Sign Up Now</button></div></div>
   <div style="display:flex;gap:13px;overflow:hidden;height:72px">${stat('199,092','Total registered users')}${stat('24/7','Live support center')}${stat('370,342 USDT','Cumulative cashback')}${stat('2,103 USDT','Cashback paid today (24h)')}</div></div></div>
 <div style="background:#fff;padding:32px 16px;display:flex;flex-direction:column;gap:24px">
  <img src="${A('logo.svg')}" style="width:142px;height:16px" alt="TetherMax">
  <div class="col" style="gap:8px;align-items:flex-start"><button class="btn contained primary md" data-go="support.main">${hic('headset',20)}Live Chat</button><span class="row b2 med" style="gap:8px;padding:6px 0">support@tethermax.io ${hic('copy2',16)}</span></div>
  <div class="col" style="gap:16px"><span class="b1 semi">Company</span><div class="col" style="gap:8px">${link('About TetherMax','about.intro')}${link('Notices','notice.list')}${link('Claim Cashback','guest.search')}</div></div>
  <div class="col" style="gap:16px"><span class="b1 semi">Legal</span><div class="col" style="gap:8px">${link('Privacy Policy','terms.privacy')}${link('Terms of Service','terms.use')}</div></div>
  <hr class="divider" style="margin:8px 0">
  <div class="row" style="gap:16px">${[1,2,3,4,5].map(i=>`<img src="${HA('sns-'+i+'.svg')}" style="width:${i===4?23:32}px;height:${i===4?24:i===5?28:32}px" alt="">`).join('')}</div>
  <span class="cap" style="line-height:12px">© 2026 TetherMax. All rights reserved.</span></div></div>`}

// ---------- home.main ----------
const autoKey=()=>S.auth==='guest'?'guest':S.auth==='s3'?'s3':'normal';
const N_FIG='FU-038·039 행 디자인(로고·점·칩·금액)은 HW1/S4-1 컴포넌트를 그대로 썼고, 이 상태 프레임은 없음';
const HOME_STATES=[
 {id:'auto',label:'기본 — 로그인 상태(게스트·S3·S4)를 따름',note:'도구의 게스트/회원·연동0/회원·연동 선택에 따라 guest · s3 · normal 상태를 보여 줌'},
 {id:'guest',label:'비로그인 — 공개 화면 (home/S4#guest)',figma:{mo:'29037:113704'},note:'V2.2 home/S4#guest · REQ-176. 웹은 랜딩(landing.main)을 그대로 씀, 모바일은 Figma Mobile / Guest entry / Home'},
 {id:'s3',label:'S3 연동 0 — 체크리스트 · Cashback Preview (S3-1)',figma:{pc:'28960:127759',mo:'4248:33574'},note:'모바일 [기존 MAX-7] mWeb S3 4248:33574. V2.2 home/S3#normal · REQ-267. L16(연동 화면 배경)도 이 화면'},
 {id:'s3App',label:'S3 앱·모바일웹 빈 홈 카드',figma:{mo:'8582:154521'},note:'[기존 MAX-7] mAPP S3 8582:154521(체크리스트 카드 — V2.2의 Link once 카드는 디자인 없음). V2.2 home/S3#app · REQ-267 · 사용자 확인 #48'},
 {id:'s3Pending',label:'확인 중 계정만 있음 → S4 전환',note:'V2.2 home/S3#pendingOnly · G-070 확정: S4로 전환하고 행에 확인 중 표시'},
 {id:'normal',label:'S4 연동 있음 — CEX·DEX 한 목록 (S4-1)',figma:{pc:'28960:127837',mo:'22913:1051713'},note:'페이지 전체 = [기존 MAX-7] MAXOP-731 Web 22913:1052131 · mWeb 22913:1051713(누적 캐시백 카드 22913:1054295 포함) + DEX S4-1. V2.2 home/S4#normal · REQ-268·271. L17(연동 화면 배경)도 이 화면. 총액은 행 합계(매칭 전) — Figma 표본 5,137.70은 행 합계와 달라 합계로 씀'},
 {id:'hw1',label:'총액 카드 · 4행 + Aster 칩 (HW1)',figma:{pc:'28960:126108'},note:'Figma HW1. Aster 칩은 Figma가 Expiring 변형("Chip")인데 Aster 만료 칩 금지(REQ-273)라 같은 주의 스타일로 Data delayed를 넣음'},
 {id:'statuses',label:'상태 7단계 행',note:'V2.2 home/S4#statuses · REQ-272 · G-060(데이터 지연·로드 실패는 그 뒤 번호). '+N_FIG},
 {id:'chips',label:'DEX 칩 — No cashback yet · Data delayed · Inactive',note:'V2.2 home/S4#chips · REQ-273 · G-058 · G-177(ApeX Account ID 미반환 칩 없음). '+N_FIG},
 {id:'loading',label:'로딩 — 스켈레톤',note:'V2.2 home/S4#loading · REQ-269·271'},
 {id:'error',label:'잔액 로드 실패',note:'V2.2 home/S4#error · REQ-269'},
 {id:'delayed',label:'DEX 원장 지연 — Last updated',note:'V2.2 home/S4#delayed · REQ-269·274'},
 {id:'many',label:'계정 11개 이상 — 10개 + 더보기',note:'V2.2 home/S4#many · REQ-271'},
 {id:'app',label:'앱·모바일웹 — Wallet 라벨 없음 · 푸터 문구',figma:{mo:'8582:156599'},note:'[기존 MAX-7] mAPP S4 8582:156599 — 하단 탭은 앱에서만. V2.2 home/S4#app · REQ-271. 모바일 보기에서는 모든 상태에 같은 규칙'},
 {id:'full',label:'지갑 전체 주소 펼침',note:'V2.2 home/S4#full · REQ-271'},
 {id:'first',label:'첫 연동 — 체크리스트 없는 S4 + 토스트 (S3-7)',figma:{pc:'28960:127795'},note:'V2.2 link/HOME#first · REQ-096 · G-070. Figma 총액 5,137.70은 표본이라 행 합계 0.00으로 씀'},
 {id:'newRow',label:'새 행 맨 아래 · 0.00 + No cashback yet (S4-6)',figma:{pc:'28960:127867'},note:'V2.2 link/HOME#normal · REQ-094·273. Figma "Chip" 자리 = 캐시백 0 칩 No cashback yet'},
 {id:'transferred',label:'10 USDT 미만 이관 4.00',note:'V2.2 link/HOME#transferred · REQ-107'},
 {id:'pending',label:'확인 중 — 연동 시도중이에요 · -',note:'V2.2 link/HOME#pending · REQ-098'},
 {id:'inactive',label:'DEX 오프보딩 — Inactive',note:'V2.2 link/HOME#inactive · REQ-121'},
 {id:'multi',label:'같은 DEX 지갑 3개 · Aster 하위 계정',figma:{mo:'7633:92140'},note:'[기존 MAX-7] mWeb [2 or more UID per exchange] 7633:92140 · 7633:90865(거래소별 묶음 패턴). V2.2 link/HOME#multi · REQ-118·084 · G-087 확정: 하위 계정마다 따로 연동'},
 {id:'rejected',label:'확인 중 거절 — 행 제거',note:'V2.2 link/HOME#rejected · REQ-102 · G-069 확정: 거절되면 홈 행 제거(한도 점유 해제)'},
 {id:'labels',label:'DEX 정산 상태 라벨 (홈 행 칩)',note:'V2.2 cmn/LABELS · FU-011 · REQ-047'},
 {id:'faq',label:'홈 FAQ — 회원 답변',note:'V2.2 home/FAQ · FU-044 · REQ-711'},
];
const hm=R.screen({id:'home.main',group:'home',title:'홈 (S3 · S4 · 게스트)',route:'/',fu:['FU-037','FU-038','FU-039','FU-029','FU-022','FU-011','FU-044'],shell:false,
 states:HOME_STATES,
 render(st0){
  const st=st0==='auto'?autoKey():st0;
  if(st==='guest')return guestHome();
  const app=st==='app'||S.vp==='mo';
  let left='',o={};
  const card=(rows,x={})=>balanceCard({amount:sumLinked(rows),...x});
  if(st==='s3')left=balanceCard({amount:0})+s3Checklist()+s3Preview();
  else if(st==='s3App')left=balanceCard({amount:0})+`<div style="background:#fff;border-radius:8px;padding:24px 16px;text-align:center" class="col g12"><span class="b1 semi">Link once and cashbacks keep coming</span><span class="cap c2">${C.tbd('cashbacks keep coming / cashback keeps coming 문구 확인','사용자 확인 #48')}</span>${C.btn('Link Account',{go:'link.select',full:true})}</div>`;
  else{
   let rows=[R_BITGET,R_LIGHTER,R_APEX],x={},lc={app};
   if(st==='s3Pending')rows=[{ex:'EdgeX',id:WAL.edgex,amt:null,st:'pend'}];
   if(st==='hw1')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:3.2,st:'delayed'}];
   if(st==='statuses')rows=Object.entries(ST).filter(([,v])=>v.pri).sort((a,b)=>a[1].pri-b[1].pri).map(([k],i)=>({ex:['EdgeX','ApeX','Aster','EdgeX','ApeX','Aster','Lighter'][i],id:[WAL.edgex,WAL.w2,WAL.aster,WAL.lighter,WAL.apex,WAL.w2,WAL.lighter][i],amt:k==='ok'?120:null,st:k}));
   if(st==='chips')rows=[{ex:'EdgeX',id:WAL.edgex,amt:0,st:'zero'},{ex:'Aster',id:WAL.aster,amt:3.2,st:'delayed',extra:`Last updated ${clk('2026-10-22T09:00:00Z')}`},{ex:'ApeX',id:WAL.w2,amt:12.4,st:'inactive'},{ex:'ApeX',id:WAL.apex,amt:0,st:'zero'}];
   if(st==='loading'){x={loading:true};lc.loading=true}
   if(st==='error')x={error:true};
   if(st==='delayed'){rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:3.2,st:'delayed',extra:`Last updated ${clk('2026-10-22T09:00:00Z')}`}];x={sub:`<div style="font-size:12px;color:var(--text-secondary)">Last updated ${clk('2026-10-23T00:30:00Z')}</div>`};}
   if(st==='many'){rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:3.2,st:'ok'},...['Bybit','OKX','EdgeX','ApeX','Aster','Bitget','EdgeX','OKX','Binance'].map((e,i)=>({ex:e,id:isCex(e)?String(70001230+i):[WAL.edgex,WAL.w2][i%2],amt:5+i,st:'ok'}))];lc.max=10}
   if(st==='full')lc.full=true;
   if(st==='first'){rows=[{ex:'Lighter',id:WAL.lighter,amt:0,st:'ok'}];o.toast=true}
   if(st==='newRow'){rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:0,st:'zero'}];o.toast=true}
   if(st==='transferred')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:4,st:'ok'}];
   if(st==='pending')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:null,st:'pend'}];
   if(st==='inactive')rows=[R_BITGET,R_LIGHTER,{ex:'ApeX',id:WAL.apex,amt:12.4,st:'inactive',extra:C.tbd('Inactive 행 안내 문구 (오프보딩 — 적립 캐시백은 자동 지급 유지)','REQ-121')}];
   if(st==='multi')rows=[R_BITGET,...[[WAL.lighter,3.2],[WAL.w2,0],[WAL.edgex,11.05]].map(([w,a])=>({ex:'Lighter',id:w,amt:a,st:a?'ok':'zero'})),...[WAL.aster,WAL.apex].map(w=>({ex:'Aster',id:w,amt:0,st:'zero'}))];
   if(st==='labels')rows=[
    {ex:'Lighter',id:WAL.lighter,amt:120,st:'ok',extra:hChip(T('Not yet tallied','집계 전'),'prog')},
    {ex:'Lighter',id:WAL.w2,amt:14,st:'ok',extra:hChip('Credited','done')},
    {ex:'Lighter',id:WAL.edgex,amt:0,st:'ok',extra:hChip('Withheld by Lighter after review','off')},
    {ex:'Lighter',id:WAL.apex,amt:0,st:'ok',extra:hChip('Under the $1 minimum, not credited','off')},
    {ex:'ApeX',id:WAL.apex,amt:14,st:'ok',extra:`${hChip('Pending','prog')} 2.10 USDT`},
    {ex:'EdgeX',id:WAL.edgex,amt:120,st:'ok',extra:hChip('DEX data pending','prog')}];
   if(st==='rejected')rows=[R_BITGET,R_LIGHTER,R_APEX];
   const banner=st==='delayed'?C.alert('warn','','신규 적립 내역 반영이 지연되고 있습니다. 기존 확정 잔액은 그대로이며 출금할 수 있어요.'):'';
   left=card(rows,x)+banner+linkedCard(rows,lc);
   if(st==='statuses')left+=C.note('상태 우선순위 = 기존 UID 7단계(소유 확인중 1 → 연동 해제 7). 데이터 지연·로드 실패는 G-060 확정대로 그 뒤 번호(8·9)로 이어 붙임. 금액은 연동 완료만 표시, 나머지 <code>-</code>. 한국어 상태 라벨만 원문이 있어 EN 보기에서도 한국어로 표시(영문 라벨 원문 없음)');
   if(st==='chips')left+=C.note('칩 명칭은 REQ-273 그대로(G-058). 색 = 의미별 4토큰: 완료 연녹 · 진행 파랑 외곽선 · 주의 주황 채움 · 실패/해제 회색. ApeX Account ID 미반환은 회원에게 칩 없이 연동 완료(G-177)');
   if(st==='labels')left+=C.note('FU-011 라벨 세트(V2.2 cmn/LABELS): Lighter 주중 = 금액 없이 「집계 전」, 추정치 줄 없음(G-100) · Credited = 월요일 원장 수신 후 Available Cashback에 가산 · Withheld by Lighter after review = 어뷰징 심사 보류, 미적립 · Under the $1 minimum, not credited = 주 $1 미만 미적립 · Pending = ApeX 일 원장 전 시간당 배치, 합계 미포함(G-127: ApeX가 노출할 때만) · DEX data pending = 원장 미수신 날짜 — 0 표시 금지. Lighter 줄은 온보딩 후. Lighter 등급을 못 받으면 추측하지 않고 연동 완료');
   if(st==='rejected')left+=C.note('거절된 확인 중 행(Aster)은 홈에서 사라짐 — G-069');
   if(st==='s3Pending')left+=C.note('확인 중 계정만 있어도 체크리스트(S3) 대신 S4 목록 — G-070');
   if(st==='newRow'||st==='first')left+=C.note('새로고침 없이 새 행을 맨 아래에 추가. 금액 = 연동 시 이관된 금액(REQ-094). 사용자 셀프 해제 버튼 없음(REQ-113). DEX 첫 연동은 3 USDT 안내 없음(REQ-097)');
  }
  if(st==='faq'){
   const faq=`<div style="background:#fff;border-radius:8px;padding:24px;width:${S.vp==='mo'?'100%':'717px'}" class="col g16"><span style="font-size:24px;font-weight:700">FAQs</span>
    <details open style="border-bottom:1px solid var(--divider);padding:12px 0"><summary class="b1 semi" style="cursor:pointer">${T('How do I get cashback?','캐시백은 어떻게 받나요?')}</summary><p class="b2 c2">…select your exchange, UID, and cashback type… ${C.tbd('UID → 거래 계정 답변 — 문구표 확정분','G-419')}</p></details>
    ${C.note('게스트 조회 안내 답변 2건(Search for your exchange and UID …)은 삭제 — REQ-711')}</div>`;
   return hShell(homeLayout(balanceCard({amount:148})+linkedCard([R_BITGET,R_LIGHTER,R_APEX],{app}),{right:faq}),{moNav:'home'});
  }
  return hShell(homeLayout(left,o),{moNav:'home',app:st==='app'||st==='s3App'});
 }});
// 기본 상태의 디자인 표시는 로그인 상태에 따라 바뀐다
{const a=hm.states.find(s=>s.id==='auto');Object.defineProperty(a,'figma',{get(){return hm.states.find(s=>s.id===autoKey()).figma},configurable:true,enumerable:true})}

// ---------- DEX 지갑 상세 (FU-040, Figma PW1 + 지갑 상세 · 이벤트 리워드 매칭 상태) ----------
// Exchange Cashback = 확정 캐시백 A · Event Reward = 매칭액 min(A,B) · Available = A + min(A,B) (소수 둘째 자리 절삭)
function match(A,B){const m=B?Math.min(A,B):0;const claim=Math.floor((A+m)*100+1e-6)/100;const req=(B||0)>=5?5:10-(B||0);return {m,claim,need:claim>=10?0:Math.max(0,req-A)}}
function walletBalance(A,B,o={}){
 if(o.loading)return `<div style="background:#fff;border-radius:8px;padding:16px" class="col g16">${C.skel('100%',22)}${C.skel('100%',12)}${C.skel('100%',12)}${C.skel('100%',40)}</div>`;
 if(o.error)return `<div style="background:#fff;border-radius:8px;padding:16px" class="col g12">${C.alert('warn','',"We can't load your balance right now.")}${C.btn('Try again',{v:'outlined',size:'sm'})}</div>`;
 const {m,claim,need}=match(A,B);
 const small=(k,v)=>`<div class="row between" style="color:var(--text-secondary)"><span style="font-size:12px;line-height:1.33;letter-spacing:.2px">${k}</span><span style="font-size:12px;line-height:1.4;font-weight:500">${v}</span></div>`;
 const pending=o.pending;
 const cap=[B>0?`Matched ${n2(m)} / ${n2(B)} USDT in event rewards`:'',`Claimable ${n2(claim)} USDT · Minimum 10 USDT`,need>0?`Additional exchange cashback needed: ${up2(need)} USDT`:''].filter(Boolean);
 return `<div style="background:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row between"><span class="b2">Available Cashback</span><span class="b1 semi">${pending?'-':n2(claim)+' USDT'}</span></div>
  ${o.totalClaimed?'<div class="row between" style="color:var(--text-secondary);margin-top:-8px"><span class="b2">Total Claimed</span><span class="b2 tnum">240.00 USDT</span></div>':''}
  ${o.updated?`<span style="font-size:12px;color:var(--text-secondary);margin-top:-10px">Last updated ${o.updated}</span>`:''}
  <hr class="divider">
  <div class="col" style="gap:8px">${small('Exchange Cashback',pending?'-':n2(A)+' USDT')}${B>0&&!pending?small('Event Reward',n2(m)+' USDT'):''}
   ${pending?'':`<div style="height:4px;border-radius:4px;background:rgba(187,226,255,.2);overflow:hidden"><div style="height:100%;width:${Math.min(100,claim*10)}%;background:#2453f0;border-radius:4px"></div></div>
   <div style="font-size:10px;line-height:14px;letter-spacing:.15px;color:var(--text-secondary)">${cap.join('<br>')}</div>`}
   </div>
  <button class="btn contained lg full" disabled>Auto Claim</button></div>`}
function earningTimeline(){
 const step=(ic,k,v)=>`<div class="col" style="gap:8px;align-items:center;width:80px;position:relative;z-index:1"><span style="background:#f2f2f5;padding:16px;border-radius:8px;display:flex">${hic(ic,24)}</span><span style="font-size:10px;line-height:10px;color:var(--text-secondary);white-space:nowrap">${k}</span><span style="font-size:10px;line-height:12px;font-weight:500;white-space:nowrap">${v}</span></div>`;
 return `<div style="background:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row" style="gap:4px"><span class="b1 semi">Earning Timeline</span>${hic('star',36)}</div>
  <div class="row between" style="position:relative;align-items:flex-start"><span style="position:absolute;left:40px;right:40px;top:28px;border-top:1px dashed var(--divider)"></span>${step('candle','Start Trading','Mar 17 00:00')}${step('clock','Cut-off Time','Mar 18 00:00')}${step('checkc','Updated','Mar 18 10:50')}</div></div>`}
function walletRight(o={}){
 const days=[['20'],['21'],['22'],['23'],['24'],['25'],['26','+25.00','-20.00']];
 const week=`<div style="background:#fff;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:16px">
  <div class="row between"><span class="b1 semi">Weekly Cashback History</span><button class="btn text primary md" style="padding:4px 5px;font-size:15px" data-go="summary.main">View All</button></div>
  <div class="row" style="align-items:flex-start;gap:0">${days.map(([d,p,mi],i)=>`<div class="col grow" style="align-items:center;gap:4px;padding-bottom:4px"><span style="width:36px;height:36px;border-radius:100px;display:flex;align-items:center;justify-content:center;font-size:14px;${i===6?'border:1px solid rgba(0,0,0,.56)':''}">${d}</span><span style="font-size:10px;line-height:10px;color:#0031c6;${p?'':'visibility:hidden'}">${p||'+0.00'}</span><span style="font-size:10px;line-height:10px;color:#d32f2f;${mi?'':'visibility:hidden'}">${mi||'-0.00'}</span></div>`).join('')}</div></div>`;
 const review=o.reviewed?'':`<div style="position:relative;background:rgba(0,123,255,.1);border-radius:8px;padding:16px 16px 16px 124px;display:flex;flex-wrap:wrap;gap:16px;align-items:center">
  <div style="position:absolute;left:8px;top:-14px;width:104px;height:88px;overflow:hidden"><img src="${HA('review.png')}" style="position:absolute;height:142.56%;left:-39.21%;top:-21.21%;width:177.17%;max-width:none" alt=""></div>
  <div class="col grow" style="gap:2px;min-width:178px"><span class="b2 semi">How was Lighter?</span><span class="cap c2">Your first review earns you 2 USDT. It takes about a minute.</span></div>
  <button class="btn md" style="background:#f2f2f5" data-go="dex.detail:lighter">Write a review, get 2 USDT</button></div>`;
 const dexes=['Lighter','ApeX','EdgeX','Aster'],rate=['20','30','30','20'],bg=['#00f0ff','#15192a','#181a20','#000'];
 const top=`<div style="background:#fff;border-radius:8px;padding:24px 20px;display:flex;flex-direction:column;gap:16px">${secHead('Top Partner DEXs','dex.overview')}
  <div style="display:grid;grid-template-columns:repeat(${S.vp==='mo'?2:4},minmax(0,1fr));gap:16px">${dexes.map((d,i)=>`<div class="col" style="gap:4px;cursor:pointer" data-go="dex.detail:${d.toLowerCase()}"><div style="background:${bg[i]};height:80px;border-radius:4px;display:flex;align-items:center;justify-content:center">${C.dex(d,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${d}</span><span style="font-size:12px;line-height:20px;font-weight:500">Up to ${rate[i]}% cashback</span></div>`).join('')}</div></div>`;
 if(S.vp==='mo'){ // 기존 UID 상세 모바일(26047:1348691 · 25867:1348700) 순서: 리뷰 유도 → Top Partner(가로) → Exclusive For Members(2열)
  const topMo=`<div style="background:#fff;border-radius:8px;padding:16px" class="col g16"><div class="row between"><span class="b1 semi">Top Partner DEXs</span><button class="btn text primary sm" style="padding:4px 5px" data-go="dex.overview">See All</button></div>
   <div class="row" style="gap:12px;overflow:hidden;align-items:flex-start">${dexes.map((d,i)=>`<div class="col" style="gap:4px;width:100px;flex:none" data-go="dex.detail:${d.toLowerCase()}"><div style="background:${bg[i]};height:60px;border-radius:4px;display:flex;align-items:center;justify-content:center">${C.dex(d,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${d}</span><span style="font-size:12px;line-height:20px;font-weight:500">Up to ${rate[i]}% cashback</span></div>`).join('')}</div></div>`;
  return `<div class="col" style="gap:16px;width:100%">${week.replace('padding:24px','padding:16px')}${review.replace('padding:16px 16px 16px 124px','padding:16px 16px 16px 112px')}${topMo}<div style="background:#fff;border-radius:8px;padding:16px" class="col g16">${moMemberCards('Lighter','Exclusive Benefit')}</div></div>`}
 return `<div style="display:flex;flex-direction:column;gap:24px;width:${S.vp==='mo'?'100%':'717px'}">${week}${review}
  <div style="background:#fff;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:16px">${secHead('Exclusive Benefit','benefits.list')}${memberEvents('Lighter',true)}</div>${top}</div>`}
const WALLET_FIG='29026:97581';
const WALLET_STATES=[
 {id:'normal',label:'정상 — 부분 매칭 · 최소액 이상 (PW1)',figma:{pc:'28960:125943',mo:'26047:1348691'},ab:[7,100],note:'V2.2 home/LKD#normal · REQ-276~280. A=7.00 · B=100.00'},
 {id:'noReward',label:'리워드 없음 · 최소액 이상 — Event Reward 행 없음',figma:{pc:WALLET_FIG},ab:[120,null],note:'V2.2 home/LKD#noReward · REQ-277. A=120.00 · B=null'},
 {id:'zero',label:'모든 적립 잔액 0',figma:{pc:WALLET_FIG},ab:[0,0],note:'V2.2 home/LKD#zero · REQ-277. A=0 · B=0'},
 {id:'cashBelow',label:'캐시백만 보유 · 최소액 미만',figma:{pc:WALLET_FIG},ab:[3,0],note:'Figma 매칭 상태 프레임에만 있음 — 매칭 공식(REQ-129·130) 표시 규칙이라 넣음. A=3.00 · B=0'},
 {id:'rewardOnly',label:'리워드만 보유',figma:{pc:WALLET_FIG},ab:[0,8],note:'Figma 매칭 상태 프레임에만 있음. A=0 · B=8.00'},
 {id:'partialBelow',label:'부분 매칭 · 최소액 미만',figma:{pc:WALLET_FIG},ab:[2,8],note:'Figma 매칭 상태 프레임에만 있음. A=2.00 · B=8.00'},
 {id:'fullBelow',label:'전액 매칭 · 최소액 미만',figma:{pc:WALLET_FIG},ab:[4.5,4.5],note:'Figma 매칭 상태 프레임에만 있음. A=4.50 · B=4.50'},
 {id:'fullEqual',label:'전액 매칭 · 최소액과 일치',figma:{pc:WALLET_FIG},ab:[5.5,4.5],note:'Figma 매칭 상태 프레임에만 있음. A=5.50 · B=4.50'},
 {id:'fullAbove',label:'전액 매칭 · 최소액 초과',figma:{pc:WALLET_FIG},ab:[12,4],note:'Figma 매칭 상태 프레임에만 있음. A=12.00 · B=4.00'},
 {id:'edge',label:'소수점 절삭 · 기준 직전',figma:{pc:WALLET_FIG},ab:[9.999,0],note:'Figma 매칭 상태 프레임에만 있음. A=9.999 · B=0 → 9.99, 필요액 0.01'},
 {id:'loading',label:'잔액 로딩 — 스켈레톤',ab:[7,100],note:'Figma 매칭 상태 프레임 하단 메모(REQ-145) — 화면 프레임 없음'},
 {id:'error',label:'잔액 조회 실패 — 오류 · 재시도',ab:[7,100],note:'Figma 매칭 상태 프레임 하단 메모(REQ-149) — 화면 프레임 없음'},
 {id:'delayed',label:'파트너 지연 — 마지막 확정 금액 · Last updated',ab:[7,100],note:'V2.2 home/LKD#delayed · REQ-277'},
 {id:'reviewed',label:'리뷰 작성 후 — 리뷰 유도 없음',figma:{pc:'25867:1348199',mo:'25867:1348944'},ab:[7,100],note:'[기존 MAX-7] MAX-1216 UID detail / Review already written (Plain). V2.2 home/LKD#reviewed · REQ-278'},
 {id:'pending',label:'연동 시도중',ab:[0,null],note:'V2.2 home/LKD#pending · REQ-098'},
 {id:'totalClaimed',label:'Total Claimed 행',figma:{pc:'26047:1349155',mo:'8582:157676'},ab:[7,100],note:'[기존 MAX-7] UID 상세 잔액 카드의 Total Claimed 행(Web 26047:1349155 · mAPP 8582:157676). V2.2 home/LKD#totalClaimed · REQ-281 · G-053 확정: 유지(테더맥스 경유 출금 누계)'},
 {id:'subaccounts',label:'하위 계정 나열 안 함 (Lighter)',figma:{pc:'28960:125943'},ab:[7,100],note:'V2.2 home/LKD#subaccounts · REQ-281 · G-178 확정: 미표시 — 정상 화면과 같음'},
];
R.screen({id:'home.wallet',group:'home',title:'DEX 지갑 상세',route:'/dex/wallet (지갑 상세)',fu:['FU-040'],shell:{accent:true,back:'home.main',moTitle:['Lighter','Lighter'],moNav:'home'},
 states:WALLET_STATES,
 render(st,ctx){
  const [A0,B0]=ctx.state.ab;const pending=st==='pending';
  const head=`<div style="background:#fff;border-radius:8px;padding:12px 16px" class="row between">
   <div class="row" style="gap:8px">${C.dex('Lighter',30)}<div class="col" style="gap:0"><span class="b2 semi">Lighter</span><span class="row" style="gap:4px"><span style="font-size:12px;line-height:12px;color:var(--text-secondary)">${short(WAL.lighter)}</span><button class="icon-btn" style="padding:2px">${hic('copy',16)}</button></span></div></div>
   ${pending?hChip('연동 시도중이에요','prog'):hChip(T('Active','연동 완료'),'done')}</div>`;
  const left=`${head}${walletBalance(A0,B0,{loading:st==='loading',error:st==='error',pending,totalClaimed:st==='totalClaimed',updated:st==='delayed'?clk('2026-10-22T00:00:00Z'):null})}${earningTimeline()}
   ${st==='totalClaimed'?C.note('Total Claimed = 테더맥스를 통해 지급된 누계(G-053). 디자인 없음 — 잔액 카드 작은 행으로 둠'):''}
   ${st==='subaccounts'?C.note('Lighter 하위 계정(account_index)은 나열하지 않음 — G-178'):''}
   ${st==='normal'?C.note('테더맥스를 지급자로 씀 — paid by {DEX} · withdraw on {DEX} 없음(REQ-279). 요율은 실제 레코드 값, 트레이더 0% 미표시(REQ-280). 마일스톤 진행바 없음(REQ-278) — 막대는 계정별 지급 기준(10 USDT)까지의 진행률. Figma 헤더 칩 <code>Active</code>는 KO에서 REQ-273 라벨 <code>연동 완료</code>. 리뷰 버튼 Figma 자리표시 <code>Label</code> → V2.2 문구'):''}
   ${st.startsWith('full')||['cashBelow','rewardOnly','partialBelow','edge','noReward','zero'].includes(st)?C.note('B가 null 또는 0이면 리워드 행과 매칭 설명을 숨김. B가 양수이면 매칭액이 0이어도 행을 표시(Figma 매칭 상태 프레임)'):''}`;
  const right=walletRight({reviewed:st==='reviewed'});
  if(S.vp==='mo')return `<div style="padding:16px" class="col g16">${left}${right}</div>`;
  return `<div style="padding:40px 0 80px;display:flex;justify-content:center"><div style="display:flex;gap:24px;align-items:flex-start"><div style="width:343px;display:flex;flex-direction:column;gap:16px;flex:none">${left}</div>${right}</div></div>`;
 }});

// ---------- 캐시백 타임라인 · 누적 캐시백 (FU-041) — 디자인 없음, V2.2 내용 ----------
R.screen({id:'home.timeline',group:'home',title:'캐시백 타임라인 · 누적 캐시백',route:'/ (홈 · 지갑 상세 섹션)',fu:['FU-041'],shell:{accent:true,back:'home.main',moTitle:['Cashback timeline','캐시백 타임라인']},
 states:[
  {id:'normal',label:'EdgeX Daily D+1',figma:{pc:'26047:56579',mo:'26047:56579'},note:'[기존 MAX-7] MAXOP-783 Earning Timeline 캐러셀(26047:56685, Step=1 26047:56579) + MAXOP-731 누적 카드(22913:1054295). V2.2 home/TL#normal · REQ-282·289'},
  {id:'apex',label:'ApeX D+2',figma:{pc:'26047:56615',mo:'26047:56615'},note:'[기존 MAX-7] MAXOP-783 Step=2 26047:56615. V2.2 home/TL#apex · REQ-282 · G-192 확정: ApeX도 같은 4단계'},
  {id:'lighter',label:'Lighter Weekly W+1 (온보딩 후)',figma:{pc:'26047:56650',mo:'26047:56650'},note:'[기존 MAX-7] MAXOP-783 Step=3 26047:56650. V2.2 home/TL#lighter · REQ-282'},
  {id:'compact',label:'compact 단계',figma:{pc:'26047:56579',mo:'26047:56579'},note:'[기존 MAX-7] MAXOP-783 탭 줄만 사용. V2.2 home/TL#compact · REQ-289'},
  {id:'warning',label:'순차 지급 경고',note:'V2.2 home/TL#warning · REQ-289. 경고 자리 디자인 없음 — 기존 MUI Alert(warning) 재사용'},
 ],
 render(st){
  const ex={normal:['EdgeX','Daily D+1',1],apex:['ApeX','D+2',2],lighter:['Lighter','Weekly W+1',3],compact:['EdgeX','Daily D+1',0],warning:['EdgeX','Daily D+1',1]}[st];
  const labels=st==='compact'?['거래 집계','거래소 정산 확인','테더맥스 확인','캐시백 반영 완료']:['거래 집계 중','지급 대기','지급 처리 중','지급 완료'];
  const cur=ex[2];
  const t=h=>new Intl.DateTimeFormat(S.lang==='en'?'en-US':'ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date('2026-10-23T'+h+':00Z'));
  const blue='filter:invert(13%) sepia(90%) saturate(5000%) hue-rotate(226deg)';
  const arrow=(f,dis)=>`<span style="width:32px;height:32px;border-radius:16px;background:#f2f2f5;display:flex;align-items:center;justify-content:center"><img src="${HA(f)}" style="width:24px;height:24px;${dis?'opacity:.38':''}" alt=""></span>`;
  const tabs=`<div class="row" style="gap:8px;align-items:flex-start">${labels.map((l,i)=>{const on=i+1===cur,done=i+1<cur;return `<div class="col grow" style="gap:6px;min-width:0"><span class="b2 med" style="color:${on?'#0031c6':done?'var(--text-primary)':'var(--text-secondary)'};white-space:nowrap">Step ${i+1}</span><span style="height:4px;border-radius:2px;background:${on?'#0031c6':done?'rgba(0,49,198,.4)':'#f2f2f5'}"></span></div>`}).join('')}</div>`;
  const icons=[['candle-b.svg',''],['clock.svg',blue],['checkc.svg',blue],['checkc.svg',blue]];
  const stepCard=cur?`<div style="background:#fff;border-radius:12px;box-shadow:0 4px 10px rgba(0,0,0,.1);padding:16px" class="col g12"><div class="row" style="gap:12px"><span style="width:48px;height:48px;border-radius:24px;background:rgba(187,226,255,.2);display:flex;align-items:center;justify-content:center;flex:none"><img src="${HA('ic-'+icons[cur-1][0])}" style="width:24px;height:24px;${icons[cur-1][1]}" alt=""></span>
    <div class="col grow" style="gap:2px"><span class="b2 semi" style="color:#0031c6">10/22 ${t('01:00')}</span><span class="b1 semi">${labels[cur-1]}</span></div></div>
    <div>${C.kv('대상 거래 기간',ex[0]==='Lighter'?'월 ~ 일':`10/21 ${t('00:00')} ~ 10/22 ${t('00:00')}`)}${C.kv('지급 주기',ex[1]+(ex[0]==='ApeX'?' '+C.tbd('ApeX 주기','G-025'):''))}${C.kv('지급 시각',t('01:00'))}${C.kv('지급처',T('Account','거래 계정'))}</div></div>`:`<div class="row" style="gap:8px">${labels.map(l=>`<span class="grow cap c2" style="text-align:center">${l}</span>`).join('')}</div>`;
  const tl=`<div style="background:#fff;border-radius:8px;padding:16px" class="col g16"><div class="row between"><span class="b1 semi">Earning Timeline · ${ex[0]}</span><span class="row g4">${arrow('ic-chev-l.svg',cur<=1)}${arrow('ic-chev-r2.svg',cur>=4)}</span></div>${tabs}${stepCard}
   ${st==='warning'?C.alert('warn','','거래소별로 순차 지급하고 있어서 몇 분 더 걸릴 수 있어요.'):''}</div>`;
  const cum=`<div style="background:#fff;border-radius:8px;padding:16px">${cumulative([R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:3.2,st:'ok'}])}</div>`;
  const w=S.vp==='mo'?'100%':'343px';
  return `<div style="padding:${S.vp==='mo'?'16px':'40px 0 80px'};display:flex;justify-content:center"><div class="col g16" style="width:${w}">${tl}${cum}${C.note('MAXOP-783은 3단계(Start Trading · Cut-off Time · Cashback Accumulated)이지만 정책(REQ-282 · G-192)은 4단계라 탭을 4개로 두고 단계명은 V2.2 국문(영문 원문 없음 — EN 보기에서도 국문). 카드 안 상세 행은 V2.2 내용. 누적 카드 = MAXOP-731 컴포넌트, 캡션은 G-191 확정 문구')}</div></div>`;
 }});

// ---------- 출금 화면 /withdrawal-apply (FU-030~034) — 표시 전용, 모든 버튼은 비활성 Auto Claim ----------
const WD_ACC=()=>[
 {ex:'Bitget',id:'123456789',cash:5,reward:232},
 {ex:'OKX',id:'987654321',cash:31.68,reward:0},
 {ex:'EdgeX',id:WAL.edgex,cash:100,reward:20},
 {ex:'Aster',id:WAL.edgex,cash:12,reward:0},
 {ex:'ApeX',id:WAL.w2,cash:3,reward:0}];
const wdAvail=a=>Math.floor((a.cash+Math.min(a.reward,a.cash))*100+1e-6)/100;
const wdNeed=a=>{const r=a.reward>=5?5:10-a.reward;return Math.max(0,r-a.cash)};
function wdUpdates(ex){
 if(ex==='EdgeX')return `Daily, ${new Intl.DateTimeFormat(S.lang==='en'?'en-US':'ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date('2026-10-23T00:00:00Z'))}`;
 if(ex==='Lighter')return `Every Monday<div class="cap c2" style="font-weight:400">Lighter reports every Monday for the week before. New trades show after the next report.</div>`;
 return C.tbd(ex+' 주기·공개 시각',ex==='Aster'?'G-036':'G-025');
}
// 계정 카드 — 기존 [MAX-18] 출금 모달 계정 카드(12936:346690): 0.5px 테두리 · 그림자 · 로고30/이름/UID · Available 칩 · Available Cashback 행 · 구분선 · 작은 행
function wdCard(a,st,deducted){
 const cex=isCex(a.ex),av=deducted&&wdAvail(a)>=10?0:wdAvail(a),ok=av>=10,err=st==='partner'&&a.ex==='Aster';
 const zero=!cex&&a.cash===0;
 const chip=deducted&&wdAvail(a)>=10?`<span style="background:rgba(0,0,0,.08);color:var(--text-primary);border-radius:100px;padding:2px 7px;font-size:11px;line-height:1.38;letter-spacing:.16px">Pending</span>`:ok?`<span style="background:#c8e6c9;color:#1b5e20;border-radius:100px;padding:2px 7px;font-size:11px;line-height:1.38;letter-spacing:.16px">Available</span>`:`<span style="background:rgba(0,0,0,.08);color:var(--text-primary);border-radius:100px;padding:2px 7px;font-size:11px;line-height:1.38;letter-spacing:.16px">Unavailable</span>`;
 const small=(k,v)=>`<div class="row between" style="color:var(--text-secondary);font-size:12px"><span style="line-height:1.33;letter-spacing:.2px">${k}</span><span style="font-weight:500;line-height:1.33;text-align:right">${v}</span></div>`;
 return `<div style="background:#fff;border:.5px solid var(--divider);border-radius:8px;filter:drop-shadow(0 1px 2.5px rgba(0,0,0,.1));padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row between"><span class="row" style="gap:8px;min-width:0">${mark(a.ex,30)}<span class="col" style="gap:0;min-width:0"><span class="b2 semi">${a.ex}</span><span style="font-size:12px;line-height:12px;color:var(--text-secondary);word-break:break-all">${cex?'UID '+a.id:'Wallet '+a.id}</span></span></span>${chip}</div>
  ${st==='delayed'&&a.ex==='EdgeX'?`<div class="cap c2" style="margin-top:-8px">Last updated ${clk('2026-10-22T00:00:00Z')}</div>`:''}
  ${err?`<div class="col g8">${C.alert('warn','',`We can't load your latest ${a.ex} cashback right now.`)}<span>${C.btn('Try again',{v:'outlined',size:'sm'})}</span></div>`:''}
  <div class="col" style="gap:16px"><div class="row between"><span class="b2">Available Cashback</span><span class="b2 med tnum">${n2(av)} USDT</span></div><hr class="divider">
   <div class="col" style="gap:8px">${small('Exchange Cashback',n2(deducted&&wdAvail(a)>=10?0:a.cash)+' USDT')}${a.reward>0?small('Event Reward',n2(deducted&&wdAvail(a)>=10?Math.max(0,a.reward-Math.min(a.reward,a.cash)):a.reward)+' USDT'):''}
   ${cex?'':small('Cashback updates ⓘ',wdUpdates(a.ex))}
   ${st==='preAccrual'&&a.ex==='ApeX'?small('Pending','2.10 USDT'):''}</div></div>
  ${st==='noNetwork'&&!cex?C.alert('warn','',C.tbd('지급 네트워크 미설정 — 지갑 목적지 비활성 표시','REQ-142')):''}
  ${!ok&&!err&&!(deducted&&wdAvail(a)>=10)?`<div class="cap c2">${T(`You can claim cashback if you receive an additional ${up2(wdNeed(a))} USDT in exchange Cashback.`,`거래소 캐시백을 ${up2(wdNeed(a))} USDT 더 받으면 출금할 수 있어요.`)}</div>`:''}
  ${zero?C.alert('info','',`No exchange cashback yet. ${a.ex==='Lighter'?"Cashback appears here after Lighter's Monday settlement.":'Cashback appears here the day after you trade on your linked DEX.'}`):''}</div>`}
const WD_NOTE='[기존 MAX-18] 출금 모달 Web 12936:389796([When there is more than 2 UIDs]) · 계정 카드 12936:346690. 정책(10분 주기 자동 지급)에 따라 `Confirm Withdraw` → 비활성 `Auto Claim`(DEX HW1·PW1), 마일스톤 진행바(First Milestone)는 REQ-278로 뺌. ';
R.screen({id:'wd.claim',group:'home',title:'출금 화면 (/withdrawal-apply)',route:'/withdrawal-apply',fu:['FU-030','FU-031','FU-032','FU-033','FU-034'],shell:false,closeTo:'home.main',
 states:[
  {id:'normal',label:'정상 — 가능 위 · 불가 아래, 같은 주소 DEX별 카드',figma:{pc:'12936:389796',mo:'8873:163663'},note:WD_NOTE+'V2.2 wd/CLAIM#normal · REQ-134~137'},
  {id:'allBlocked',label:'전부 불가 — Not eligible to withdraw',figma:{pc:'10500:94074'},note:'[기존 MAX-18] Web [Not eligible to withdraw] 10500:94074. V2.2 wd/CLAIM#allBlocked · REQ-136·139 · G-108 확정'},
  {id:'zero',label:'DEX 캐시백 0 — 배너',note:'V2.2 wd/CLAIM#zero · REQ-146 · G-110. 상태 정의 = DEX 흐름 S4_12 `No cashback yet`(29002:127873). 배너 모양 디자인 없음 — MUI Alert(info) 재사용'},
  {id:'loading',label:'로딩 — 스켈레톤, 금액·버튼 없음',note:'V2.2 wd/CLAIM#loading · REQ-145. 재사용: [MAX-425] Loading state 5702:12582 스켈레톤'},
  {id:'delayed',label:'데이터 지연 — Last updated',note:'V2.2 wd/CLAIM#delayed · REQ-147 · G-348. 상태 정의 = DEX 흐름 S4_13 29002:127898'},
  {id:'partner',label:'파트너 오류 — 그 카드만',note:'V2.2 wd/CLAIM#partner · REQ-148. 상태 정의 = DEX 흐름 S4_14 `Partner data unavailable` 29002:127923 · 오류 모양 = Hub H7 28960:126920'},
  {id:'balanceError',label:'잔액 오류',note:'V2.2 wd/CLAIM#balanceError · REQ-149. 상태 정의 = DEX 흐름 S4_15 29002:127948 · 오류 모양 = Hub H7 28960:126920'},
  {id:'deducted',label:'선차감 반영',figma:{pc:'10501:104627'},note:'[기존 MAX-18] Web [Pending withdrawal] 10501:104627 — 처리 중 계정 카드 칩 Pending(회색). 하단 버튼은 기존 Pending(비활성) 대신 정책상 비활성 Auto Claim. V2.2 wd/CLAIM#deducted · REQ-158 · G-112'},
  {id:'preAccrual',label:'적립 전 줄 (합계 미포함)',note:'V2.2 wd/CLAIM#preAccrual · REQ-138 · G-127. 상태 정의 = DEX 흐름 S6_11 `Pending settlement` 29002:129353'},
  {id:'many',label:'계정 11개 이상 — 10개 + 더보기',figma:{pc:'12936:389796'},note:'[기존 MAX-18] [When there is more than 2 UIDs] 12936:389796(모달 안 스크롤). V2.2 wd/CLAIM#many · REQ-134 · G-114'},
  {id:'noNetwork',label:'지급 네트워크 미설정',note:'V2.2 wd/CLAIM#noNetwork · REQ-142. 상태 정의 = DEX 흐름 S4_20 `Network unavailable` 29002:128078. 모양 디자인 없음'},
  {id:'lighter',label:'Lighter 카드 (온보딩 후) — Every Monday · Lighter (2 wallets)',note:'V2.2 wd/CLAIM#lighter · REQ-137·150. 카드 = 기존 계정 카드 재사용'},
  {id:'pending',label:'확인 중 계정은 목록에 없음',figma:{pc:'12936:389796',mo:'8873:163663'},note:WD_NOTE+'V2.2 wd/CLAIM#pending · REQ-134 — 화면은 normal과 같고 확인 중 계정만 빠짐'},
 ],
 render(st){
  let acc=WD_ACC();
  if(st==='allBlocked')acc=acc.map(a=>({...a,cash:Math.min(a.cash,3),reward:Math.min(a.reward,2)}));
  if(st==='zero')acc=acc.map(a=>isCex(a.ex)?a:{...a,cash:0,reward:0});
  if(st==='lighter')acc=[...acc,{ex:'Lighter',id:WAL.lighter,cash:14,reward:0},{ex:'Lighter',id:WAL.w2,cash:2,reward:0}];
  if(st==='many')acc=[...acc,...['Bybit','OKX','Bitget','ApeX','Aster','EdgeX','Bybit'].map((e,i)=>({ex:e,id:isCex(e)?String(555000000+i):WAL.w2,cash:12+i,reward:0}))];
  const deducted=st==='deducted';
  acc.sort((x,y)=>Number(wdAvail(y)>=10)-Number(wdAvail(x)>=10));
  const avail=acc.filter(a=>wdAvail(a)>=10);const blocked=!avail.length;
  const total=deducted?0:avail.reduce((s,a)=>s+wdAvail(a),0);
  const minNeed=Math.min(...acc.map(wdNeed));
  const box=inner=>`<div style="background:#fff;border:.5px solid var(--divider);border-radius:8px;filter:drop-shadow(0 1px 2.5px rgba(0,0,0,.1));padding:16px" class="col g12">${inner}</div>`;
  const top=st==='balanceError'?box(`${C.alert('warn','',"We can't load your balance right now.")}<span>${C.btn('Try again',{v:'outlined',size:'sm'})}</span>`)
   :st==='loading'?box(`${C.skel('40%',14)}${C.skel('30%',28)}`)
   :box(`<div class="col" style="gap:4px"><span style="font-size:12px;line-height:1.4;color:var(--text-secondary)">Total Available Cashback</span><span class="row" style="gap:4px;align-items:baseline"><span style="font-size:24px;line-height:32px;font-weight:600" class="tnum">${n2(total)}</span><span class="b2 c2">USDT</span></span></div>
    ${blocked?`<span>${C.badge('Not eligible to withdraw')}</span>`:''}
    ${deducted?`<p class="cap c2" style="margin:0">${T(C.tbd('영문 — 문구표 확정분','G-112'),'출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다')}</p>`:''}
    ${blocked?`<p class="b2 c2" style="margin:0">${T(`No account can be claimed yet. You can claim once ${up2(minNeed)} USDT more cashback accrues.`,`출금 가능한 계정이 없어요. 캐시백 ${up2(minNeed)} USDT가 더 쌓이면 출금할 수 있어요.`)}</p><p class="cap c2" style="margin:0">${T('Each account needs at least 10 USDT (cashback + matched event rewards).','이벤트 리워드는 같은 계정의 캐시백과 1:1로 매칭됩니다. 최소 출금액은 계정별 10 USDT입니다.')}</p>`:''}`);
  const shown=st==='many'?acc.slice(0,10):acc;
  const cards=st==='loading'?box(C.skel('100%',80))+box(C.skel('100%',80)):shown.map(a=>wdCard(a,st,deducted)).join('')+(st==='many'?`<button class="btn text black sm full">${T('See more','더보기')} (${acc.length-10})</button>`:'');
  const foot=st==='loading'?'':`<div style="padding:0 2px">${C.kv('Network',st==='noNetwork'?'—':'BNB Smart Chain (BEP20)')}<p class="cap c2" style="margin:0 0 8px">Deposits are made to the above wallet address on BNB Smart Chain (BEP20).</p>${C.kv('Network fee',T('covered by TetherMax','테더맥스가 전액 부담'))}</div>`;
  const notes=`${st==='pending'?C.note('확인 중(연동 시도중이에요) 계정은 이 목록에 없음 — 자동 지급 대상 아님'):''}${C.note('카드 = 기존 출금 모달 계정 카드 그대로 + DEX 지갑 식별자(전체 주소) · Cashback updates 행(V2.2). DEX 배지 없음(REQ-135). 금액·주소·네트워크 입력 없음(REQ-140·141). Auto Claim 옆 안내 문구 없음(REQ-144). 네트워크 줄은 V2.2 내용(디자인 없음). 제목 `Withdraw`는 기존 모달 원문')}`;
  const mo=S.vp==='mo';
  const panel=`<div style="background:#fff;border-radius:${mo?'16px 16px 0 0':'4px'};box-shadow:var(--elev24);width:${mo?'100%':'600px'};max-height:${mo?'740px':'680px'};display:flex;flex-direction:column;overflow:hidden">
   ${mo?'<div class="sheet-grab"></div>':''}<div class="row between" style="height:56px;padding:${mo?'0 16px':'0 24px'};flex:none"><span class="h6" style="font-size:20px">Withdraw</span><button class="icon-btn" data-go="home.main">${ic('close')}</button></div>
   <div class="col" style="gap:16px;padding:16px ${mo?16:24}px;overflow:auto">${top}${cards}${foot}${notes}</div>
   <div style="padding:${mo?'16px':'24px'};flex:none">${st==='loading'?'':`<button class="btn contained md full" disabled style="height:42px">Auto Claim</button>`}</div></div>`;
  return C.overlay('home.main:normal',panel,{clip:mo?812:null,center:!mo});
 }});

// ---------- 두 번째 출금 화면 /withdrawal (FU-036) ----------
R.screen({id:'wd.second',group:'home',title:'두 번째 출금 화면 (/withdrawal)',route:'/withdrawal',fu:['FU-036'],shell:{accent:true,back:'home.main',moTitle:['Claim','출금'],moNav:'home'},
 states:[{id:'normal',label:'출금 가능 계정 없음 — STG 문구 + DEX 행',note:'V2.2 wd/SECOND#normal · REQ-710 · G-419(문구표에서 확정 — 확정 문안 원문 없음)'}],
 render(){
  const acc=WD_ACC().map(a=>({...a,cash:Math.min(a.cash,4),reward:0}));
  return `<div class="container" style="max-width:720px;padding-top:40px;padding-bottom:80px"><div class="card col g16">
   <span class="h5">Trading just a bit more and you can claim.</span><p class="b1 c2" style="margin:0">Cashback can be claimed for UIDs with 10 USDT or more in cashback.</p>
   <p class="cap" style="margin:0">${C.tbd('UID → 거래 계정 · 「10 USDT 이상」 → 매칭 기준(A + MIN(B, A) ≥ 10) 문장 — 문구표 확정분','G-419')}</p>
   <div>${acc.map(a=>`<div class="row g12" style="padding:12px 0;border-bottom:1px solid var(--divider)">${mark(a.ex,32)}<div class="col grow" style="gap:2px;min-width:0"><span class="b2 semi">${a.ex}</span><span class="cap c2" style="word-break:break-all">${isCex(a.ex)?'UID '+a.id:a.id}</span></div><div class="col" style="gap:0;align-items:flex-end"><span class="b1 semi">${n2(wdAvail(a))} <span class="b2 c2">USDT</span></span><span class="cap c2">Trading just a bit more</span></div></div>`).join('')}</div>
   <div class="row between"><span class="b1">Cashback to be Claimed</span><span class="h6">${n2(acc.reduce((s,a)=>s+wdAvail(a),0))} USDT</span></div>
   ${C.btn('Go back',{v:'outlined',go:'home.main',full:true})}</div></div>`;
 }});

// ---------- 선차감 · 복원 반영 위치 (FU-034 · 035) ----------
R.screen({id:'wd.reflect',group:'home',title:'선차감 · 복원 반영 위치',route:'/ · /cashback-summary · 실시간 출금 피드',fu:['FU-034','FU-035'],shell:{accent:true,back:'home.main',moNav:'home'},
 states:[
  {id:'normal',label:'지급 전',note:'V2.2 wd/REFLECT#normal · REQ-158'},
  {id:'deducted',label:'신청 생성 — 선차감 (같은 새로고침에 반영)',note:'V2.2 wd/REFLECT#deducted · REQ-158 · G-112'},
  {id:'restored',label:'최종 실패 — 복원',note:'V2.2 wd/REFLECT#restored · REQ-164 · G-113 확정: 복원된 날 + 부호 행(Withdrawal returned)'},
 ],
 render(st){
  const bal=st==='deducted'?16.68:136.68;
  const row=(t,amt)=>`<div class="row g12" style="padding:10px 0;border-bottom:1px solid var(--divider)">${C.dex('EdgeX',32)}<div class="col grow" style="gap:2px;min-width:0"><span class="b2 semi">${t}</span><span class="cap c2" style="word-break:break-all">${WAL.edgex}</span></div><span class="b1 semi">${amt}</span></div>`;
  const sum=st==='normal'?'<p class="b2 c2" style="margin:0">—</p>':row(`${T('Claim Amount','출금 금액')} · EdgeX`,'-120.00')+(st==='restored'?row('Withdrawal returned','+120.00'):'');
  const feed=st==='normal'?row('EdgeX','120.00 USDT'):`<p class="b2 c2" style="margin:0">—</p>`;
  const sec=(t,b,go)=>`<div style="background:#fff;border-radius:8px;padding:16px" class="col g12"><div class="row between"><span class="b1 semi">${t}</span>${go?`<button class="btn text primary sm" data-go="${go}">See All</button>`:''}</div>${b}</div>`;
  const body=`${balanceCard({amount:bal,sub:st==='deducted'?`<div class="cap c2">출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다</div>`:''})}
   ${sec(T('Cashback Summary','캐시백 요약'),sum,'summary.main')}${sec(T('Live withdrawals','실시간 출금'),feed,'about.feed')}
   ${C.note({normal:'지급 완료된 건만 피드에 표시',deducted:'처리 중 — 피드에 아직 없음(자동 지급 완료 = 출금일 때만 표시). 영문 선차감 문구는 G-112 문구표 확정분(원문 없음)',restored:'실패해 복원된 건은 피드에 Sent 항목이 생기지 않음. 잔액은 복원 후 다시 같은 조건으로 판정'}[st]+' · 출금 화면 · 홈 · 캐시백 요약 · 실시간 출금 피드가 같은 레코드에서 같은 새로고침에 반영. 결과를 보여 주는 회원 화면은 없음(REQ-163)')}`;
  return `<div style="padding:${S.vp==='mo'?16:40}px 16px 80px;display:flex;justify-content:center"><div class="col g16" style="width:${S.vp==='mo'?'100%':'480px'}">${body}</div></div>`;
 }});

// ---------- 마이 — 기존 [MAX-426, MAX-498] My Page: 웹은 홈 위 오른쪽 375 패널(17170:235039, 패널 16517:304968), 모바일은 같은 패널을 전체 화면(mWeb 10061:197517 · mAPP 10981:111021) ----------
function myPanel(st){
 const tile=(icon,t,go)=>`<div class="col grow" style="gap:24px;padding:12px;background:#fff;border-radius:16px;filter:drop-shadow(0 1px 2.5px rgba(93,96,103,.05));min-width:0;cursor:pointer" data-go="${go}"><img src="${HA('my-ic-'+icon+'.svg')}" style="width:24px;height:24px" alt=""><span style="font-size:12px;line-height:20px;letter-spacing:.14px;font-weight:500">${t}</span></div>`;
 const item=(icon,t,go)=>`<div class="row" style="gap:16px;padding:8px 0;cursor:pointer"${go?` data-go="${go}"`:''}><img src="${HA('my-ic-'+icon+'.svg')}" style="width:20px;height:20px" alt=""><span class="b2 med">${t}</span></div>`;
 const box=inner=>`<div style="padding:0 16px"><div style="background:#fff;border-radius:8px;filter:drop-shadow(0 1px 2.5px rgba(93,96,103,.05));padding:16px" class="col g8">${inner}</div></div>`;
 const partner=st==='partner';
 return `<div class="col" style="gap:16px;background:var(--bg-accent);${S.vp==='mo'?'min-height:756px':'width:375px;min-height:900px'};padding-bottom:24px">
  <div class="row between" style="padding:16px 16px 0"><span style="width:34px"></span><button class="icon-btn" style="padding:5px" data-go="home.main"><img src="${HA('my-ic-close.svg')}" style="width:24px;height:24px" alt=""></button></div>
  <div class="col" style="gap:16px;align-items:center;padding:0 16px 16px"><img src="${HA('my-avatar.png')}" style="width:48px;height:48px;border-radius:50%" alt="">
   <div class="col" style="gap:4px;align-items:center"><span style="font-size:20px;line-height:1.6;font-weight:700;letter-spacing:.15px">abc****@live.com</span><span class="row" style="gap:4px"><span class="b2 c2">Member ID: 10047039</span><img src="${HA('my-ic-copy.svg')}" style="width:16px;height:16px" alt=""></span></div></div>
  <div class="col" style="gap:8px;padding:0 16px"><div class="row" style="gap:8px;align-items:stretch">${tile('analytics','Cashback Summary','summary.main')}${partner?tile('drafts','Partners Hub','partner.hub'):tile('drafts','Invite Friends','invite.main')}</div>
   <div class="row" style="gap:8px;align-items:stretch">${tile('leaderboard','Cashback Ranking','ranking.main')}${tile('activity','My Coupons','coupon.box')}</div></div>
  ${box(item('security','Account Security')+item('notif','Notification Settings'))}
  ${box(item('logout','Log Out','landing.main'))}</div>`}
R.screen({id:'my.main',group:'home',title:'마이 (My Page)',route:'mypage (홈 위 패널)',fu:[],shell:false,closeTo:'home.main',
 states:[
  {id:'normal',label:'회원 — Invite Friends (비파트너)',figma:{pc:'17170:235039',mo:'10061:197518'},note:'[기존 MAX-426] Web 17170:235039 [Post-login](패널 16517:304968) · mWeb 10061:197518 [Post-login | For non-partners, show ‘Invite Friends’] · mAPP 10981:111021. 셀프 탈퇴 항목 없음(정책)'},
  {id:'partner',label:'파트너 — Partners Hub',figma:{pc:'12474:173500',mo:'10981:110987'},note:'[기존 MAX-426] Web 12474:173500 · mWeb 10981:110987 [For partners, show ‘Partners Hub’] — 타일 하나만 바뀜(아이콘은 비파트너 패널 것 재사용)'},
 ],
 render(st){
  const panel=myPanel(st);
  if(S.vp==='mo')return `<div class="page accent">${panel}</div>`;
  return `<div style="position:relative;min-height:900px;overflow:hidden">${renderInner('home.main:normal',true)}<div style="position:absolute;inset:0;background:rgba(0,0,0,.5);z-index:20;display:flex;justify-content:flex-end">${panel}</div></div>`;
 }});
