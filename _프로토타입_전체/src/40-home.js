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

// 행 상태(REQ-272) — Figma 29447:141189(기존 디자인 9401:87675 · MAX-561 계열): 칩 없음. 상태 점 색 = 초록 정상 · 빨강 이슈/실패 · 주황 연동 해제 · 분홍 확인 중(+시계) · 파랑 소유 확인 중(+시계 · 경과 시간)
// 결정 10차: 자동 연동 실패는 홈 목록에 없음(연동 결과 화면에서 끝남) · 수동 연동 실패 = 빨간 점 + 분홍 배너 → 사유 모달 · 캐시백 0은 칩 없이 `0.00 USDT`
//   이슈·오프보딩 = 빨간 점, 행 탭 → 문제 안내 모달 · 소유 확인 실패·연동 해제 = 점 + 행 아래 배너 · `Data delayed`·`Inactive` 칩 없음
//   배너·모달의 계정 표기: CEX 행 = `UID` 문구, DEX 행 = `Wallet`/`wallet`
const ST={
 own:{get lb(){return T('Verifying ownership','소유 확인중이에요')},tone:'own',pri:1,linked:false,clock:true},
 pend:{get lb(){return T('Trying to link','연동 시도중이에요')},tone:'proc',pri:2,linked:false,clock:true},
 issue:{get lb(){return T('There’s an issue','문제가 있어요')},tone:'err',pri:3,linked:false,noChip:true},
 ok:{get lb(){return T('Linked','연동 완료')},tone:'done',pri:4,linked:true},
 fail:{get lb(){return T('Linking failed','연동 실패했어요')},tone:'err',pri:5,linked:false,noChip:true},
 ownfail:{get lb(){return T('Ownership verification failed','소유 확인에 실패했어요')},tone:'err',pri:6,linked:false,noChip:true},
 unlinked:{get lb(){return T('Unlinked','연동 해제되었어요')},tone:'warn',pri:7,linked:false,noChip:true},
 reclaimfail:{get lb(){return T('Ownership verification failed','소유 확인에 실패했어요')},tone:'err',pri:6,linked:false,noChip:true},
};
const DOT={done:'#2e7d32',prog:'#ed6b03',warn:'#ef6c00',off:'rgba(0,0,0,0.38)',err:'#d32f2f',proc:'#fecdd2',own:'#0031c6'};
// 시계 아이콘(MUI AccessTimeRounded) — 확인 중 · 소유 확인 중 행 오른쪽
const CLOCK=`<svg viewBox="0 0 24 24" width="20" height="20" aria-label="In progress" style="display:block;fill:rgba(0,0,0,.56)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24.21-.34.1-.79-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72"/></svg>`;
// 소유 확인 중 경과 시간(표본 06:46 — Figma MAX-561 12866:10182). 사이트 모드는 신청 시각에서 계산
const ownElapsed=a=>{if(!a.ts)return '06:46';const s=Math.max(0,Math.floor((Date.now()-a.ts)/1000));const h=Math.floor(s/3600),m=Math.floor(s%3600/60),x=s%60;const p=n=>String(n).padStart(2,'0');return h?`${h}:${p(m)}:${p(x)}`:`${p(m)}:${p(x)}`};
const ownLine=a=>`<div data-own-elapsed="${a.ts||''}" style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${T('Ownership verification in progress')} · <span class="tnum">${ownElapsed(a)}</span></div>`;
// 행 아래 상태 배너 — 실서비스 연동 계정 목록(SelectMyExchangePopup StatusAlert): 모서리 4 · 좌우 10 · 12px 글자 · 오류 #fdeded/#5f2120 · 주의 #fff4e5/#663c00 · 오른쪽 화살표
const SVG_ERR='M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1 4h-2v-2h2z',SVG_WARN='M1 21h22L12 2zm12-3h-2v-2h2zm0-4h-2v-4h2z',SVG_CHEV='M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01';
// 소유 확인 중 행 아래 안내 — Figma O11 29453:143874 `ownership notice`(MUI Alert info: #e5f6fd · 글자 #014361 14px/1.43 · InfoRounded 20 #0288d1 · 안쪽 6×16)
const ownBanner=a=>`<div data-own-elapsed="${a.ts||''}" style="display:flex;background:#e5f6fd;border-radius:4px;padding:6px 16px;color:#014361"><span style="flex:none;display:flex;padding:7px 12px 7px 0;color:#0288d1">${svgI('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 15c-.55 0-1-.45-1-1v-4c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1-8h-2V7h2z')}</span><p style="margin:0;padding:8px 0;font-size:14px;line-height:1.43;letter-spacing:.17px">${T('Ownership verification in progress')} · <span class="tnum">${ownElapsed(a)}</span></p></div>`;
const svgI=(d,s=20)=>`<svg viewBox="0 0 24 24" width="${s}" height="${s}" aria-hidden="true" style="display:block;fill:currentColor"><path d="${d}"/></svg>`;
function rowBanner(a){
 const cex=isCex(a.ex);
 const b={fail:['err',cex?T('UID Linking was unsuccessful. View reason.'):T('Wallet linking was unsuccessful. View reason.'),cex?'home.main:linkFail':'home.main:linkFailWallet'],
  ownfail:['err',T('Ownership verification was unsuccessful. Please try again.'),'own.home:rejected'],
  reclaimfail:['err',T('Ownership verification was unsuccessful. View reason.'),'own.home:reclaimRejected'],
  unlinked:['warn',cex?T('This UID has been unlinked. Tap to verify ownership and reclaim it.'):T('This wallet has been unlinked. Tap to verify ownership and reclaim it.'),cex?'own.home:reclaimUid':'own.home:reclaim']}[a.st];
 if(!b)return '';
 const [bg,fg]=b[0]==='err'?['#fdeded','#5f2120']:['#fff4e5','#663c00'];
 return `<div data-row-banner="${a.st}" data-go="${b[2]}" style="display:flex;align-items:center;border-radius:4px;padding:0 10px;margin:0 0 8px;overflow:hidden;cursor:pointer;background:${bg};color:${fg}"><span style="flex:none;display:flex;align-self:flex-start;padding:8px 8px 7px 0;color:${b[0]==='err'?'#d32f2f':'#ed6c02'}">${svgI(b[0]==='err'?SVG_ERR:SVG_WARN)}</span><p style="margin:0;flex:1;min-width:0;font-size:12px;line-height:1.33;letter-spacing:.2px;padding:8px 0">${b[1]}</p><span style="flex:none;display:flex;margin-left:8px">${svgI(SVG_CHEV)}</span></div>`}
// 행 모달(결정 10차) — MUI Dialog(웹 480 · 모바일 343). 이슈: 문제 안내 + Contact Support / 수동 연동 실패: 사유 + Remove · Link
function rowDialog(title,body,actions,close){
 const mo=S.vp==='mo';
 return `<div role="dialog" aria-modal="true" style="background:var(--paper);border-radius:4px;box-shadow:0 6px 30px 5px rgba(0,0,0,.12),0 16px 24px 2px rgba(0,0,0,.14),0 8px 10px -5px rgba(0,0,0,.2);width:${mo?343:480}px;max-width:100%"><div style="padding:24px 24px 0;font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.15px;display:flex;align-items:flex-start;justify-content:space-between;gap:12px"><span>${title}</span>${close?`<button class="icon-btn" type="button" aria-label="Close" style="margin:-4px -8px 0 0" data-go="${close}">${ic('close')}</button>`:''}</div><div style="padding:16px 24px 0;font-size:14px;line-height:1.43;font-weight:500;letter-spacing:.17px;color:var(--text-secondary)">${body}</div><div style="padding:24px;display:flex;${mo?'flex-direction:column;':''}gap:8px">${actions}</div></div>`}
const dBtn=(label,go,white)=>`<button class="btn lg" style="${white?'background:#f2f2f5;color:var(--text-primary)':'background:var(--blue);color:#fff'};${S.vp==='mo'?'width:100%':'flex:1;min-width:0'}" data-go="${go}">${label}</button>`;
const issueDialog=dex=>rowDialog(dex?T('There is a problem with this wallet.'):T('There is a problem with this UID.'),T('Please contact our support team for assistance.'),dBtn(T('Contact Support'),'support.main'),'home.main:normal');
// 사유 문구는 거래소 응답별 — CEX는 결정 기록 예시 문구, DEX 사유 원문은 아직 없음
const failDialog=dex=>rowDialog(dex?T('Wallet Linking Unsuccessful'):T('UID Linking Unsuccessful'),dex?'{Reason provided by backend}':T('UID is not found in the tetherMax database. Please contact customer service for assistance.'),
 dBtn(dex?T('Remove Wallet'):T('Remove UID'),'home.main:normal',true)+dBtn(dex?T('Link Wallet'):T('UID Link'),dex?'link.addr:lighter':'link.uid:empty'));
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
// 공통 오류 토스트(Figma 29449:145568 · 기존 [MAX-426] Error 토스트 — 실사이트 ToastPopup 모양): 429 · 중복 요청 · 잘못된 값
const toastErr=()=>{const mo=S.vp==='mo';return `<div role="alert" style="position:absolute;left:50%;top:${mo?72:88}px;transform:translateX(-50%);width:${mo?343:360}px;z-index:15;border-radius:8px;background:#1c1c1e;box-shadow:0 16px 24px rgba(0,0,0,.14),0 6px 30px rgba(0,0,0,.12),0 8px 10px rgba(0,0,0,.2);display:flex;align-items:center;gap:16px;padding:12px 16px;color:#fff;font-size:13px;line-height:1.8;letter-spacing:-.13px"><span style="width:28px;height:28px;border-radius:50%;background:rgba(94,36,41,.55);display:inline-flex;align-items:center;justify-content:center;flex:none"><span style="width:16px;height:16px;border-radius:50%;background:#e5484d;color:#1c1c1e;font-size:12px;font-weight:700;line-height:16px;text-align:center">×</span></span><span>${T('Something went wrong. Please try again.')}</span></div>`};
// 모바일 = 기존 MAX-30 mWeb 토스트(Figma 29381:137457 Toast: #1c1c1e · 모서리 8 · 안쪽 12×16 · 아이콘 원 32 #303746 + 초록 체크 · 13px/1.8 흰 글자, 화면 아래쪽)
const toastLinked=()=>S.vp==='mo'?`<div style="position:absolute;left:16px;right:16px;top:560px;z-index:15;border-radius:8px;box-shadow:0 8px 10px rgba(0,0,0,.2),0 6px 30px rgba(0,0,0,.12),0 16px 24px rgba(0,0,0,.14);background:#1c1c1e;display:flex;align-items:center;gap:16px;padding:12px 16px;overflow:hidden"><span style="width:32px;height:32px;border-radius:50%;background:#303746;display:flex;align-items:center;justify-content:center;flex:none;color:#00df80">${svgI('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2M9.29 16.29 5.7 12.7a.996.996 0 0 1 0-1.41c.39-.39 1.02-.39 1.41 0L10 14.17l6.88-6.88c.39-.39 1.02-.39 1.41 0s.39 1.02 0 1.41l-7.59 7.59c-.38.39-1.02.39-1.41 0')}</span><span style="color:#fff;font-size:13px;line-height:1.8">Account linked successfully</span></div>`
 :`<div style="position:absolute;left:50%;top:${S.vp==='mo'?72:88}px;transform:translateX(-50%);width:${S.vp==='mo'?343:360}px;z-index:15;border-radius:8px;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px rgba(0,0,0,.14),0 1px 18px rgba(0,0,0,.12);background:var(--blue);display:flex;align-items:center;padding:6px 16px"><span style="padding:7px 12px 7px 0;display:flex">${hic('toast-check',20)}</span><span class="b2 med" style="color:#fff;padding:8px 0;letter-spacing:.15px">Account linked successfully</span></div>`;

// ---------- 홈 왼쪽 열: 총액 카드 · Linked Accounts (Figma HW1 · S4-1) ----------
function balanceCard(o={}){
 if(o.loading)return `<div style="background:#fff;border-radius:8px;height:72px;box-shadow:0 4px 10px rgba(0,0,0,.04);padding:16px 16px 16px 58px;display:flex;flex-direction:column;justify-content:center;gap:6px">${C.skel('40%',18)}${C.skel('55%',12)}</div>`;
 if(o.error)return `<div style="background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,.04);padding:12px 16px" class="col g12">${C.alert('warn','',"We can't load your balance right now.")}${C.btn('Try again',{v:'outlined',size:'sm'})}</div>`;
 const amt=o.amount==null?'0.00':n2(o.amount);
 return `<div style="background:#fff;border-radius:8px;box-shadow:0 4px 10px rgba(0,0,0,.04);position:relative;overflow:hidden;min-height:72px;display:flex;align-items:center;gap:8px;padding:${o.sub?'12px':'0'} 0 ${o.sub?'12px':'0'} 58px">
  <img src="${HA('tokens.png')}" style="position:absolute;left:-48px;top:-11px;width:106px;height:106px;object-fit:cover" alt="">
  <div class="grow" style="min-width:0"><div class="b1 semi">${o.raw||amt+' USDT'}</div><div style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">Total Cashback Balance</div>${o.sub||''}</div>
  <button class="btn contained md" disabled style="flex:none;${S.vp==='mo'?'min-width:103px;height:36px;margin:0 9px 0 0;padding:6px 16px':'min-width:119px;height:40px;margin:4px -3px 0 0;padding:8px 24px'}">Auto Claim</button></div>`}

// 행: 로고 · 이름 · (상태 점 + 식별자) · 칩 · 금액. 웹은 `Wallet` 라벨, 앱·모바일웹은 주소만(REQ-271)
function accRow(a,o={}){
 const st=ST[a.st||'ok'];const cex=isCex(a.ex);const app=o.app;
 const id=cex?`UID ${esc(a.id)}`:`${app?'':'Wallet '}${o.full?`<span style="word-break:break-all">${esc(a.id)}</span>`:short(a.id)}`;
 const amt=a.amt==null?'-':a.amt;
 if(S.vp==='mo'){
  // 모바일 행 — DEX(revision) mWeb 홈 29330:208569: 로고 30 · 이름·금액 14 Medium · 둘째 줄 상태 점 8(왼쪽 10) + 식별자 12/16 · 행 70(위아래 8)
  const go2=a.st==='issue'?`home.main:${cex?'issue':'issueWallet'}`:a.st==='unlinked'?(cex?'own.home:reclaimUid':'own.home:reclaim'):cex||a.st!=='ok'&&a.st!=null?'':'home.wallet:normal';
  return `<div${go2?` data-go="${go2}"`:''} style="${go2?'cursor:pointer;':''}display:flex;flex-direction:column;gap:8px;padding:8px 0">
   <div class="row" style="gap:8px;height:30px">${mark(a.ex,30)}<span class="grow" style="font-size:14px;line-height:20px;font-weight:500;color:rgba(0,0,0,.87)">${a.ex}</span><span class="tnum" style="font-size:14px;line-height:20px;font-weight:500;color:rgba(0,0,0,.87);white-space:nowrap">${amt==='-'?'-':n2(amt)+' USDT'}</span>${st.clock?CLOCK:''}</div>
   <div class="row" style="gap:0;height:16px"><span style="width:28px;flex:none;display:flex;justify-content:center"><span style="width:8px;height:8px;border-radius:50%;background:${DOT[st.tone]}"></span></span><span style="font-size:12px;line-height:16px;color:rgba(0,0,0,.6);min-width:0">${id}</span></div></div>${a.st==='own'?ownBanner(a):''}${rowBanner(a)}`}
 const amtHtml=amt==='-'?`<span class="b1 semi">-</span>`:`<span class="row" style="gap:4px;align-items:baseline;white-space:nowrap"><span class="b1 semi">${n2(amt)}</span><span class="b2 c2">USDT</span></span>`;
 const go=a.st==='issue'?` data-go="home.main:${cex?'issue':'issueWallet'}" style="cursor:pointer;`:a.st==='unlinked'?` data-go="${cex?'own.home:reclaimUid':'own.home:reclaim'}" style="cursor:pointer;`:cex||a.st!=='ok'&&a.st!=null?'':` data-go="home.wallet:normal" style="cursor:pointer;`;
 return `<div class="row g12"${go||' style="'}display:flex;padding:10px 12px;border-radius:12px;align-items:center">
  ${mark(a.ex,32)}
  <div class="col grow" style="gap:2px;min-width:0"><span class="b2 semi">${a.ex}</span>
   <span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)"><span style="color:${DOT[st.tone]}">●</span>&nbsp; ${id}</span>
   ${a.extra?`<span style="font-size:12px;line-height:1.5;color:var(--text-secondary)">${a.extra}</span>`:''}</div>
  <div class="row" style="flex:none;gap:8px">${amtHtml}${st.clock?CLOCK:''}</div></div>${a.st==='own'?ownBanner(a):''}${rowBanner(a)}`}
function linkedCard(rows,o={}){
 const app=o.app||S.vp==='mo';
 const foot=app?'Trading on multiple exchanges? Link more':'Using multiple platforms? Link more accounts';
 const list=o.loading?[1,2,3].map(()=>`<div class="row g12" style="padding:10px 12px"><span class="skel" style="width:32px;height:32px;border-radius:50%"></span><div class="col grow" style="gap:6px">${C.skel('40%',12)}${C.skel('70%',10)}</div>${C.skel('64px',14)}</div>`).join('')
  :rows.map((a,i)=>o.max&&i>=o.max?`<div data-more-row hidden>${accRow(a,{app,full:o.full})}</div>`:accRow(a,{app,full:o.full})).join('');
 const more=o.max&&rows.length>o.max?`<button class="btn text black sm full" data-more>${T('Show More','더보기')}</button>`:'';
 if(S.vp==='mo')return `<div data-no-addr-tip style="background:#fff;border-radius:8px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row between" style="height:28px"><span class="b1 semi">Linked Accounts</span><button class="btn text primary sm" style="padding:4px 5px" data-go="home.main:seeAll">See All</button></div>
  ${o.top||''}<div class="col" style="gap:16px">${list}</div>${more}
  <div class="row" style="border-top:1px solid var(--divider);padding-top:15px;gap:4px;cursor:pointer" data-go="link.select:all"><span style="width:30px;height:30px;flex:none;display:flex;align-items:center;justify-content:center;color:rgba(0,0,0,.6)">${svgI('M12 7c-.55 0-1 .45-1 1v3H8c-.55 0-1 .45-1 1s.45 1 1 1h3v3c0 .55.45 1 1 1s1-.45 1-1v-3h3c.55 0 1-.45 1-1s-.45-1-1-1h-3V8c0-.55-.45-1-1-1m0-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8')}</span><span style="font-size:12px;line-height:17px;font-weight:500;color:rgba(0,0,0,.6)">${foot}</span></div></div>`;
 return `<div data-no-addr-tip style="background:#fff;border-radius:8px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));padding:16px;display:flex;flex-direction:column;gap:12px">
  <div class="row between"><span class="b1 semi">Linked Accounts</span><button class="btn text primary sm" style="padding:4px 5px" data-go="home.main:seeAll">See All</button></div>
  ${o.top||''}<div class="col" style="gap:12px">${list}</div>${more}
  <button class="btn text primary sm full" style="padding:4px 5px" data-go="link.select:all">${foot}</button></div>`}
// ---------- 홈 오른쪽 열: 기존 홈 콘텐츠 (Figma HW1 main) ----------
const secHead=(t,go)=>`<div class="row" style="gap:16px;min-height:42px"><span style="font-size:24px;line-height:1.334;font-weight:700;white-space:nowrap">${t}</span><span class="grow"></span><button class="btn text primary md" style="padding:8px 11px;font-size:15px"${go?` data-go="${go}"`:''}>See All</button></div>`;
function evBanner(img,title,tag){
 const tg=tag==='Lighter'?C.dex('Lighter',14):`<img src="${HA('bitget-sm.png')}" style="width:14px;height:14px;border-radius:50%" alt="">`;
 return `<div style="height:140px;border-radius:4px;position:relative;overflow:hidden;background:#000">
  <img src="${HA(img)}" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover" alt="">
  <p style="position:absolute;left:0;top:0;margin:0;padding:24px 16px 16px;width:${S.vp==='mo'?'62%':'180px'};color:#fff;font-size:16px;line-height:1.5;font-weight:600;letter-spacing:.15px">${title}</p>
  <span style="position:absolute;left:0;top:0;background:#1c1c1e;border-radius:4px 0 4px 0;padding:4px 8px;display:flex;align-items:center;gap:4px;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;color:#fff;letter-spacing:.16px">${tag}</span></span></div>`}
const evCard=(banner,mid,join,basis)=>`<div style="background:#fff;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px;flex:${basis?basis+' 1 0':'1'};min-width:0">${banner}${mid}${join}</div>`;
const evRow=(icon,k,v,g=4)=>`<div class="row between" style="line-height:20px"><span class="row" style="gap:${g}px">${hic(icon,16)}<span class="b2 c2" style="line-height:20px">${k}</span></span><span class="b2" style="line-height:20px">${v}</span></div>`;
const ongoing=`<span style="align-self:flex-start;background:#e6e7e9;border-radius:4px;padding:4px;font-size:12px;line-height:12px;color:var(--text-secondary)">Ongoing</span>`;
const joinBtn=(outlined,go='benefits.list')=>`<button class="btn ${outlined?'outlined primary':'contained primary'} md full" data-go="${go}">Join Now</button>`;
function memberEvents(tag,outlined){
 const grid=S.vp==='mo'?'display:flex;flex-direction:column;gap:16px':'display:flex;gap:16px';
 return `<div style="${grid}">
  ${evCard(evBanner('ev-btc.jpg','Predict Bitcoin price and win up to 1,000.00 USDT',tag),evRow('redeem','Rewards','Up to 1,000.00 USDT',8)+ongoing,joinBtn(outlined))}
  ${evCard(evBanner('ev-challenge.jpg','Earn More Cashback. Earn Extra USDT',tag),evRow('redeem','Rewards','Up to 37 USDT',8)+ongoing,joinBtn(outlined,'challenge.detail'))}</div>`}
// 모바일 홈 본문 — 기존 mWeb MAXOP-731 Content(22913:1051714): 흰 블록(Exclusive For Members 2열 카드 · Limited Time Offers 1장 + 페이지 점) + 회색 블록(Top Partner Exchanges 가로 목록)
const moHead=(t,go,line)=>`<div class="row" style="gap:16px"><span class="b1 semi" style="white-space:nowrap">${t}</span>${line?'<span class="grow" style="height:1px;background:var(--divider)"></span>':'<span class="grow"></span>'}<button class="btn text primary sm" style="padding:4px 5px"${go?` data-go="${go}"`:''}>See All</button></div>`;
function moMemberCards(tag='Bitget',title='Exclusive For Members'){
 const tg=tag==='Bitget'?`<img src="${HA('logo-bitget.png')}" style="width:24px;height:24px;border-radius:16px" alt="">`:C.dex(tag,24);
 const card=(img,t,s)=>`<div class="col" style="gap:8px;flex:0 0 180px;min-width:0" data-go="benefits.list"><div style="height:155px;border-radius:8px;background:#000;position:relative;overflow:hidden"><img src="${HA(img)}" style="position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);object-fit:cover" alt="">
  <span style="position:absolute;left:8px;top:123px;background:${tag==='Bitget'?'#00f0ff':'#fff'};border-radius:4px;padding:2px 4px;display:flex;align-items:center;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;letter-spacing:.16px;padding:0 4px">${tag}</span></span></div>
  <div class="col" style="gap:0"><span class="b2 semi">${t}</span><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${s}</span></div></div>`;
 return `<div class="col" style="gap:16px">${moHead(title,'benefits.list')}<div class="row" style="gap:16px;align-items:stretch;overflow:hidden;margin-right:-16px">${card('mo-lotto.png','Guess Bitcoin Price','Win Up to 1,000 USDT')}${card('mo-piggy.png','Earn More Cashback','Earn extra USDT')}</div></div>`}
function homeMainMo(tag='Bitget'){
 const head=moHead;
 const tg=tag==='Bitget'?`<img src="${HA('logo-bitget.png')}" style="width:24px;height:24px;border-radius:16px" alt="">`:C.dex(tag,24);
 const card=(img,t,s)=>`<div class="col" style="gap:8px;flex:0 0 180px;min-width:0" data-go="benefits.list"><div style="height:155px;border-radius:8px;background:#000;position:relative;overflow:hidden"><img src="${HA(img)}" style="position:absolute;left:50%;top:50%;width:120px;height:120px;transform:translate(-50%,-50%);object-fit:cover" alt="">
  <span style="position:absolute;left:8px;top:123px;background:${tag==='Bitget'?'#00f0ff':'#fff'};border-radius:4px;padding:2px 4px;display:flex;align-items:center;max-height:24px">${tg}<span style="font-size:11px;line-height:1.38;letter-spacing:.16px;padding:0 4px">${tag}</span></span></div>
  <div class="col" style="gap:0"><span class="b2 semi">${t}</span><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary)">${s}</span></div></div>`;
 const cd=x=>`<span style="background:rgba(207,216,220,.2);border-radius:4px;padding:4px;font-size:12px;line-height:12px;font-weight:500">${x}</span>`;
 const cd2=(arr)=>arr.map((x,i)=>i%2?`<span style="padding:0 4px 0 2px">${x}</span>`:`<span style="background:rgba(255,224,178,.25);padding:0 4px;border-radius:4px">${x}</span>`).join('');
 const timer=`<span style="align-self:flex-start;border:1px solid #ef6c00;border-radius:999px;padding:2px 4px;display:inline-flex;align-items:center;font-size:11px;line-height:1.38;color:#ef6c00;letter-spacing:.16px">${hic('alarm',16)}<span style="padding:0 2px 0 4px">Ends in</span>${cd2(['45','M','37','S'])}</span>`;
 const comp=`<div style="background:#fff;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">${evBanner('ev-comp.jpg','Trade to win up to $100K prize pool','Bitget')}${evRow('trophy','Rewards','$100,000.00')}${timer}<button class="btn contained primary md full" data-go="events.list">Join Now</button></div>`;
 const parts=[['Bitget','#00f0ff','54%'],['Bybit','#15192a','55%'],['Binance','#181a20','50%'],['OKX','#000','65%']];
 return `<div class="col" style="gap:16px">
  <div style="background:#fff;padding:16px;display:flex;flex-direction:column;gap:32px">
   ${moMemberCards(tag)}
   <div class="col" style="gap:16px;align-items:center">${`<div style="width:100%">${head('Limited Time Offers','events.list',true)}</div>`}<div style="width:100%">${comp}</div><img src="${HA('mo-dots.svg')}" style="width:44px;height:6px" alt=""></div></div>
  <div style="background:var(--bg-accent);padding:16px" class="col g16">${head('Top Partner Exchanges','hub.main:cex',true)}
   <div class="row" style="gap:10px;overflow:hidden;align-items:flex-start;margin-right:-16px">${parts.map(([n,bg,p])=>`<div class="col" style="gap:4px;width:108px;flex:none"><div style="background:${bg};height:60px;border-radius:4px;display:flex;align-items:center;justify-content:center">${mark(n,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${n}</span><span style="font-size:12px;line-height:20px;font-weight:500;letter-spacing:.14px">${p} Total Savings</span></div>`).join('')}</div></div></div>`}
function homeMain(){
 if(S.vp==='mo')return homeMainMo();
 const cd=(arr)=>arr.map((x,i)=>i%2?`<span style="padding:0 4px 0 2px">${x}</span>`:`<span style="background:rgba(255,224,178,.25);padding:0 4px;border-radius:4px">${x}</span>`).join('');
 const ends=`<span style="align-self:flex-start;border:1px solid #ef6c00;border-radius:999px;padding:2px 4px;display:inline-flex;align-items:center;font-size:11px;line-height:1.38;color:#ef6c00;letter-spacing:.16px">${hic('alarm',16)}<span style="padding:0 2px 0 4px">Ends in</span>${cd(['45','M','37','S'])}</span>`;
 const timer=`<div class="row" style="gap:4px;min-height:20px;font-size:12px;color:var(--text-secondary)">${hic('time',16)}<span>--</span> D <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">16</b> H <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">00</b> M <b style="background:#f2f2f5;padding:0 3px;color:var(--text-primary);font-weight:500">30</b> S</div>`;
 const grid=S.vp==='mo'?'display:flex;flex-direction:column;gap:16px':'display:flex;gap:16px';
 const partners=[['Bitget','#00f0ff','54%'],['Bybit','#15192a','55%'],['Binance','#181a20','50%'],['OKX','#000','65%']];
 return `<div style="background:#fff;border-radius:8px;display:flex;flex-direction:column;gap:24px;width:${S.vp==='mo'?'100%':'717px'}">
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Exclusive For Members','benefits.list')}${memberEvents('Bitget',false)}</div>
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Limited Time Offers','events.list')}<div style="${grid}">
   ${evCard(evBanner('ev-comp.jpg','Trade to win up to $100K prize pool','Bitget'),evRow('trophy','Rewards','$100,000.00')+ends,joinBtn(),317)}
   ${evCard(evBanner('ev-vip.jpg','Become a VIP &amp; enjoy the benefits.','Bitget'),evRow('voucher','Voucher','Claim VIP2 Trial')+timer,joinBtn(),336)}</div></div>
  <div class="col" style="padding:${S.vp==='mo'?16:24}px;gap:16px">${secHead('Top Partner Exchanges','hub.main:cex')}<div style="display:grid;grid-template-columns:repeat(${S.vp==='mo'?2:4},minmax(0,1fr));gap:16px">
   ${partners.map(([n,bg,p])=>`<div class="col" style="gap:4px"><div style="background:${bg};height:80px;border-radius:4px;display:flex;align-items:center;justify-content:center">${mark(n,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${n}</span><span style="font-size:12px;line-height:20px;font-weight:500">${p} Total Savings</span></div>`).join('')}</div></div></div>`}

// 홈 2열 레이아웃(347 + 24 + 717) · 모바일 1열
function homeLayout(left,o={}){
 const right=o.right??homeMain();
 if(S.vp==='mo')return `<div style="position:relative;padding:8px 0 16px;display:flex;flex-direction:column;gap:16px">${o.toast?toastLinked():''}${o.errToast?toastErr():''}<div class="col" style="gap:16px;padding:0 16px">${left}</div>${right}</div>`;
 return `<div style="position:relative;padding:40px 0 80px;display:flex;justify-content:center">${o.toast?toastLinked():''}${o.errToast?toastErr():''}<div style="display:flex;gap:24px;align-items:flex-start"><div style="width:347px;display:flex;flex-direction:column;gap:16px;flex:none">${left}</div>${right}</div></div>`}

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
  <div class="row between" style="padding:0 16px;cursor:pointer" data-go="hub.main"><span class="row">${badge(2)}${lbl('Browse partners')}</span>${hic('chevron',24)}</div>${div}
  <div class="row" style="padding:0 16px;cursor:pointer" data-go="link.select">${badge(3)}<span class="grow">${lbl('Link your account with us')}</span>${chip}${hic('chevron',24)}</div></div>`}
// 앱·모바일웹 S3 빈 홈 카드(REQ-267) — DEX(revision) Home / mWeb / S3 · Empty home card 29420:138295(카드 343×124 · 제목 · Link Account 311×36)
const s3Empty=()=>`<div style="background:#fff;border-radius:8px;filter:drop-shadow(0 4px 5px rgba(0,0,0,.1));padding:16px 16px 32px;display:flex;flex-direction:column;gap:16px"><span class="b1 semi" style="line-height:24px">Link once and cashback keeps coming</span><button class="btn contained primary md full" style="height:36px" data-go="link.select:all">Link Account</button></div>`;
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

// ---------- See All — 연동 계정 목록 모달 (기존 9401:160223 구성, 표기 Accounts — 결정 Q3) ----------
// 제목 + 원형 배지(계정 수) · 오른쪽 {n} Total · 거래소별 묶음(로고 · 이름 · {n} accounts · 거래소 합계) · 계정 행(상태 점 · 식별자 · 금액) · 구분선 · 세로 스크롤 · 하단 Close
const SEE_ALL=[
 {ex:'Bitget',id:'685432171',amt:14,st:'ok'},
 {ex:'Bybit',id:'512093847',amt:42.5,st:'ok'},{ex:'Bybit',id:'512093912',amt:8.1,st:'ok'},
 {ex:'Lighter',id:WAL.lighter,amt:120,st:'ok'},
 {ex:'ApeX',id:WAL.apex,amt:14,st:'ok'},
 {ex:'Aster',id:WAL.aster,amt:null,st:'pend'}];
function seeAllModal(){
 const mob=S.vp==='mo';const rows=SEE_ALL.filter(r=>ST[r.st]);   // 연동 실패(fail)는 목록에 없음(결정 10차)
 const groups=[];rows.forEach(r=>{let g=groups.find(x=>x.ex===r.ex);if(!g)groups.push(g={ex:r.ex,rows:[]});g.rows.push(r)});
 const amt=v=>v==null?`<span class="b2 semi">-</span>`:`<span class="row" style="gap:4px;align-items:baseline;white-space:nowrap"><span class="b2 semi tnum">${n2(v)}</span><span class="cap c2">USDT</span></span>`;
 const idTxt=r=>isCex(r.ex)?`UID ${esc(r.id)}`:`Wallet ${short(r.id)}`;
 const seeGo=r=>{const c=isCex(r.ex);const g=r.st==='ok'?(c?'':'home.wallet:normal'):r.st==='issue'?`home.main:${c?'issue':'issueWallet'}`:r.st==='unlinked'?(c?'own.home:reclaimUid':'own.home:reclaim'):'';return g?` data-go="${g}"`:''};
 const grp=g=>{const sum=g.rows.reduce((a,r)=>a+(ST[r.st].linked&&r.amt?r.amt:0),0);
  return `<div class="col" style="gap:4px;padding:12px 0">
   <div class="row g12">${mark(g.ex,32)}<div class="col grow" style="gap:0;min-width:0"><span class="b2 semi">${g.ex}</span><span class="cap c2">${g.rows.length} ${g.rows.length===1?'account':'accounts'}</span></div>${g.rows.some(r=>ST[r.st].linked)?`<span class="row" style="gap:4px;align-items:baseline;white-space:nowrap"><span class="b1 semi tnum">${n2(sum)}</span><span class="b2 c2">USDT</span></span>`:`<span class="b1 semi">-</span>`}</div>
   ${g.rows.map(r=>`<div class="row between"${seeGo(r)} style="${seeGo(r)?'cursor:pointer;':''}padding:6px 0 6px 44px;gap:12px"><span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:var(--text-secondary);min-width:0"><span style="color:${DOT[ST[r.st].tone]}">●</span>&nbsp; ${idTxt(r)}</span><span class="row" style="gap:8px">${amt(r.st==='ok'?r.amt:null)}${ST[r.st].clock?CLOCK:''}</span></div>${r.st==='own'?ownLine(r).replace('style="','style="padding:0 0 4px 44px;'):''}${rowBanner(r).replace('margin:0 12px 4px 56px','margin:0 0 4px 44px')}`).join('')}</div>`};
 const list=groups.map(grp).join('<hr class="divider" style="margin:0">');
 const box=`<div data-see-all style="background:#fff;border-radius:${mob?'0':'8px'};box-shadow:${mob?'none':'var(--elev24)'};width:${mob?'100%':'444px'};max-width:100%;display:flex;flex-direction:column;${mob?'height:100%;min-height:100vh;':''}max-height:${mob?'none':'680px'}">
  <div class="row between" style="padding:${mob?'16px 16px 8px':'24px 24px 8px'}"><span class="row" style="gap:8px"><span class="h6">Linked Accounts</span><span style="min-width:24px;height:24px;padding:0 7px;border-radius:12px;background:var(--blue);color:#fff;font-size:12px;font-weight:600;display:inline-flex;align-items:center;justify-content:center">${rows.length}</span></span><span class="b2 c2">${rows.length} Total</span></div>
  <div class="row g8" style="padding:4px ${mob?16:24}px 8px">${C.chip('All',true,{sm:false})}${C.chip('CEX',false)}${C.chip('DEX',false)}</div>
  <div style="overflow-y:auto;padding:0 ${mob?16:24}px;flex:1;min-height:0">${list}</div>
  <div style="padding:${mob?'12px 16px 16px':'16px 24px 24px'}">${C.btn('Close',{full:true,go:'home.main:normal'})}</div></div>`;
 return C.overlay('home.main:normal',box,{center:!mob,clip:mob?812:900});
}

// ---------- home.main ----------
const autoKey=()=>S.auth==='guest'?'guest':S.auth==='s3'?'s3':'normal';
const N_FIG='FU-038·039 행 디자인(로고·점·칩·금액)은 HW1/S4-1 컴포넌트를 그대로 썼고, 이 상태 프레임은 없음';
const HOME_STATES=[
 {id:'auto',label:'기본 — 로그인 상태(게스트·S3·S4)를 따름',note:'도구의 게스트/회원·연동0/회원·연동 선택에 따라 guest · s3 · normal 상태를 보여 줌'},
 {id:'guest',label:'비로그인 — 공개 화면 (home/S4#guest)',figma:{mo:'29037:113704'},note:'V2.2 home/S4#guest · REQ-176. 웹은 랜딩(landing.main)을 그대로 씀, 모바일은 Figma Mobile / Guest entry / Home'},
 {id:'s3',label:'S3 연동 0 — 체크리스트 · Cashback Preview (S3-1)',figma:{pc:'28960:127759',mo:'29420:138295'},note:'모바일 = 앱·모바일웹 빈 홈 카드(REQ-267) DEX(revision) Home / mWeb / S3 · Empty home card 29420:138295. V2.2 home/S3#normal. L16(연동 화면 배경)도 이 화면'},
 {id:'s3App',label:'S3 앱·모바일웹 빈 홈 카드',figma:{mo:'29420:138295'},note:'DEX(revision) Home / mWeb / S3 · Empty home card 29420:138295(Figma 4차 #12 — 문구 `Link once and cashback keeps coming` · `Link Account`). V2.2 home/S3#app · REQ-267'},
 {id:'s3Pending',label:'확인 중 계정만 있음 → S4 전환',note:'V2.2 home/S3#pendingOnly · G-070 확정: S4로 전환하고 행에 확인 중 표시'},
 {id:'normal',label:'S4 연동 있음 — CEX·DEX 한 목록 (S4-1)',figma:{pc:'28960:127837',mo:'29330:208569'},note:'페이지 전체 = [기존 MAX-7] MAXOP-731 Web 22913:1052131 · mWeb 22913:1051713(누적 캐시백 카드 22913:1054295 포함) + DEX S4-1. V2.2 home/S4#normal · REQ-268·271. L17(연동 화면 배경)도 이 화면. 총액은 행 합계(매칭 전) — Figma 표본 5,137.70은 행 합계와 달라 합계로 씀'},
 {id:'hw1',label:'총액 카드 · 4행 (HW1)',figma:{pc:'28960:126108'},note:'Figma HW1. Figma의 Aster 칩 자리는 결정 10차(`Data delayed` 칩 없음)로 비움'},
 {id:'statuses',label:'상태 행(CEX) — 점 색 · 시계(확인 중 · 소유 확인 중) · 배너(수동 연동 실패 · 소유 확인 실패 · 해제), 칩 없음',note:'V2.2 home/S4#statuses · REQ-272 · 결정 10차: 자동 연동 실패 행 없음, 칩 대신 기존 디자인(9401:87675 계열 행 점 + 행 아래 배너). '+N_FIG},
 {id:'walletStates',label:'상태 행(DEX 지갑) — wallet 문구 분기',note:'결정 10차 — DEX 행은 `UID` 자리를 `Wallet`/`wallet`로'},
 {id:'linkFail',label:'수동 연동 실패 배너 탭 → UID Linking Unsuccessful',note:'결정 10차 — 사유 문구는 거래소 응답별(예시 문구) · `Remove UID` · `UID Link`'},
 {id:'linkFailWallet',label:'수동 연동 실패(DEX) → Wallet Linking Unsuccessful',note:'결정 10차 — `Remove Wallet` · `Link Wallet`. DEX 사유 원문 없음'},
 {id:'issue',label:'이슈 행 탭 → 문제 안내 모달',note:'결정 10차 — `There is a problem with this UID.` / `Please contact our support team for assistance.` / `Contact Support`'},
 {id:'issueWallet',label:'이슈(DEX) → There is a problem with this wallet.',note:'결정 10차 — DEX 행 문구 분기'},
 {id:'errToast',label:'공통 오류 토스트 — Something went wrong. Please try again.',figma:{pc:'29449:145568'},note:'Figma 29449:145568([MAX-426, MAX-498] Error 토스트) · 429 · 중복 요청 · 잘못된 값 공통(결정 3차 #10 · G-459)'},
 {id:'loading',label:'로딩 — 스켈레톤',note:'V2.2 home/S4#loading · REQ-269·271'},
 {id:'error',label:'잔액 로드 실패',note:'V2.2 home/S4#error · REQ-269'},
 {id:'many',label:'계정 11개 이상 — 10개 + 더보기',note:'V2.2 home/S4#many · REQ-271'},
 {id:'app',label:'앱·모바일웹 — Wallet 라벨 없음 · 푸터 문구',figma:{mo:'8582:156599'},note:'[기존 MAX-7] mAPP S4 8582:156599 — 하단 탭은 앱에서만. V2.2 home/S4#app · REQ-271. 모바일 보기에서는 모든 상태에 같은 규칙'},
 {id:'first',label:'첫 연동 — 체크리스트 없는 S4 + 토스트 (S3-7)',figma:{pc:'28960:127795'},note:'V2.2 link/HOME#first · REQ-096 · G-070. Figma 총액 5,137.70은 표본이라 행 합계 0.00으로 씀'},
 {id:'newRow',label:'새 행 맨 아래 · 0.00 USDT (S4-6)',figma:{pc:'28960:127867',mo:'29381:137457'},note:'모바일 = DEX(revision) Home / mWeb / S4 DEX · After first link (Lighter) 29381:137457(Figma 2차 「모바일 홈 첫 연동」 — 기존 계정이 있는 상태의 첫 DEX 연동, 새 행 맨 아래). V2.2 link/HOME#normal · REQ-094·273 · 결정 10차: 캐시백 0은 칩 없이 `0.00 USDT`'},
 {id:'transferred',label:'10 USDT 미만 이관 4.00',note:'V2.2 link/HOME#transferred · REQ-107'},
 {id:'pending',label:'확인 중 — 연동 시도중이에요 · -',note:'V2.2 link/HOME#pending · REQ-098'},
 {id:'inactive',label:'DEX 오프보딩 — 이슈 처리(빨간 점 → 문제 안내 모달)',note:'V2.2 link/HOME#inactive · REQ-121 · 결정 10차: `Inactive` 칩 없음, 오프보딩 계정은 이슈 처리'},
 {id:'multi',label:'같은 DEX 지갑 3개 · Aster 하위 계정',figma:{mo:'7633:92140'},note:'[기존 MAX-7] mWeb [2 or more UID per exchange] 7633:92140 · 7633:90865(거래소별 묶음 패턴). V2.2 link/HOME#multi · REQ-118·084 · G-087 확정: 하위 계정마다 따로 연동'},
 {id:'rejected',label:'확인 중 거절 — 행 제거',note:'V2.2 link/HOME#rejected · REQ-102 · G-069 확정: 거절되면 홈 행 제거(한도 점유 해제)'},
 {id:'faq',label:'홈 FAQ — 회원 답변',note:'V2.2 home/FAQ · FU-044 · REQ-711'},
 {id:'seeAll',label:'See All — 연동 계정 목록 모달',figma:null,note:'All · CEX · DEX 칩(사용자 결정 2026-11-26, 쿠폰 계정 선택과 같은 칩) · 근거: 기존 9401:160223 연동 UID 목록 모달(거래소별 묶음 · 계정 수 · 거래소 합계 · 계정별 금액 · 상태 점 · <code>Close</code>) — 표기는 Accounts(결정 Q3 · N5). 행 표기는 홈 Linked Accounts 행과 같게(CEX <code>UID</code> · DEX <code>Wallet</code> 축약). 모바일은 바텀시트. <b>Figma 미반영 — 승인 후 Figma에 추가</b>'},
];
const hm=R.screen({id:'home.main',group:'home',title:'홈 (S3 · S4 · 게스트)',route:'/',fu:['FU-037','FU-038','FU-039','FU-029','FU-022','FU-011','FU-044'],shell:false,
 states:HOME_STATES,
 render(st0){
  const st=st0==='auto'?autoKey():st0;
  if(st==='guest')return guestHome();
  if(st==='seeAll')return seeAllModal();
  if(st==='issue'||st==='issueWallet')return C.overlay(st==='issue'?'home.main:statuses':'home.main:walletStates',issueDialog(st==='issueWallet'),{center:true});
  if(st==='linkFail'||st==='linkFailWallet')return C.overlay(st==='linkFail'?'home.main:statuses':'home.main:walletStates',failDialog(st==='linkFailWallet'),{center:true});
  const app=st==='app'||S.vp==='mo';
  let left='',o={};
  const card=(rows,x={})=>balanceCard({amount:sumLinked(rows),...x});
  if(st==='s3'||st==='s3App')left=balanceCard({amount:0})+(S.vp==='mo'?s3Empty():s3Checklist()+s3Preview());   // 웹 = 체크리스트 · Cashback Preview, 앱·모바일웹 = 빈 홈 카드(REQ-267)
  else{
   let rows=[R_BITGET,R_LIGHTER,R_APEX],x={},lc={app};
   if(st==='s3Pending')rows=[{ex:'EdgeX',id:WAL.edgex,amt:null,st:'pend'}];
   if(st==='hw1')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:0,st:'ok'}];
   if(st==='statuses')rows=Object.entries(ST).filter(([,v])=>v.pri).sort((a,b)=>a[1].pri-b[1].pri).map(([k],i)=>({ex:['Bitget','Bybit','Bitget','OKX','OKX','Bybit','Binance','Binance'][i],id:['685432171','512093847','685432179','734305240','734305277','512093855','40213377','40213391'][i],amt:k==='ok'?120:null,st:k}));
   if(st==='loading'){x={loading:true};lc.loading=true}
   if(st==='error')x={error:true};
   if(st==='many'){rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:3.2,st:'ok'},...['Bybit','OKX','EdgeX','ApeX','Aster','Bitget','EdgeX','OKX','Binance'].map((e,i)=>({ex:e,id:isCex(e)?String(70001230+i):[WAL.edgex,WAL.w2][i%2],amt:5+i,st:'ok'}))];lc.max=10}
   if(st==='errToast')o.errToast=true;
   if(st==='first'){rows=[{ex:'Lighter',id:WAL.lighter,amt:0,st:'ok'}];o.toast=true}
   if(st==='newRow'){rows=S.vp==='mo'?[R_BITGET,R_APEX,{ex:'Lighter',id:WAL.lighter,amt:0,st:'ok'}]:[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:0,st:'ok'}];o.toast=true}   // 모바일 = Figma 29381:137457(새로 연동한 Lighter가 맨 아래 0.00 USDT)
   if(st==='transferred')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:4,st:'ok'}];
   if(st==='pending')rows=[R_BITGET,R_LIGHTER,R_APEX,{ex:'Aster',id:WAL.aster,amt:null,st:'pend'}];
   if(st==='inactive')rows=[R_BITGET,R_LIGHTER,{ex:'ApeX',id:WAL.apex,amt:null,st:'issue'}];
   if(st==='walletStates')rows=[R_LIGHTER,{ex:'EdgeX',id:WAL.edgex,amt:null,st:'fail'},{ex:'ApeX',id:WAL.apex,amt:null,st:'issue'},{ex:'Aster',id:WAL.aster,amt:null,st:'unlinked'},{ex:'Lighter',id:WAL.w2,amt:null,st:'ownfail'},{ex:'EdgeX',id:WAL.w2,amt:null,st:'reclaimfail'}];
   if(st==='multi')rows=[R_BITGET,...[[WAL.lighter,3.2],[WAL.w2,0],[WAL.edgex,11.05]].map(([w,a])=>({ex:'Lighter',id:w,amt:a,st:'ok'})),...[WAL.aster,WAL.apex].map(w=>({ex:'Aster',id:w,amt:0,st:'ok'}))];
   if(st==='rejected')rows=[R_BITGET,R_LIGHTER,R_APEX];
   left=card(rows,x)+linkedCard(rows,lc);
   if(st==='statuses')left+=C.note('상태 우선순위 = 기존 UID 순서(소유 확인 중 → 연동 해제). 표시는 칩 없이 점 색 · 시계 · 행 아래 배너(Figma 29447:141189). 반영 지연·오프보딩 표시는 두지 않음(결정 10차)');
   if(st==='rejected')left+=C.note('거절된 확인 중 행(Aster)은 홈에서 사라짐 — G-069');
   if(st==='s3Pending')left+=C.note('확인 중 계정만 있어도 체크리스트(S3) 대신 S4 목록 — G-070');
   if(st==='newRow'||st==='first')left+=C.note('새로고침 없이 새 행을 맨 아래에 추가. 금액 = 연동 시 이관된 금액(REQ-094). 사용자 셀프 해제 버튼 없음(REQ-113). DEX 첫 연동은 3 USDT 안내 없음(REQ-097)');
  }
  if(st==='faq'){
   const faq=`<div style="background:#fff;border-radius:8px;padding:24px;width:${S.vp==='mo'?'100%':'717px'}" class="col g16"><span style="font-size:24px;font-weight:700">FAQs</span>
    <details open style="border-bottom:1px solid var(--divider);padding:12px 0"><summary class="b1 semi" style="cursor:pointer">${T('How do I get cashback?','캐시백은 어떻게 받나요?')}</summary><p class="b2 c2">${T('Go to Cashback Summary, then select your exchange, account, and cashback type to view your cashback history by date.','[캐시백 요약] 메뉴에서 거래소 / 거래 계정 / 캐시백 유형을 선택하면 날짜별 캐시백 적립 내역을 확인하실 수 있습니다.')}</p></details>
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
 if(o.error){A=0;B=0}
 const {m,claim,need}=match(A,B);
 const small=(k,v)=>`<div class="row between" style="color:var(--text-secondary)"><span style="font-size:12px;line-height:1.33;letter-spacing:.2px">${k}</span><span style="font-size:12px;line-height:1.4;font-weight:500">${v}</span></div>`;
 const pending=o.pending;
 const cap=[B>0?`Matched ${n2(m)} / ${n2(B)} USDT in event rewards`:'',`Claimable ${n2(claim)} USDT · Minimum 10 USDT`,need>0?`You can claim cashback if you receive an additional ${up2(need)} USDT in exchange Cashback.`:''].filter(Boolean);
 return `<div style="background:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row between"><span class="b2">Available Cashback</span><span class="b1 semi">${pending?'-':n2(claim)+' USDT'}</span></div>
  <div class="row between" style="color:var(--text-secondary);margin-top:-4px"><span class="b2">Total Claimed</span><span class="b2 tnum">${pending?'-':(o.totalClaimed?'240.00':'0.00')+' USDT'}</span></div>
  <hr class="divider">
  <div class="col" style="gap:8px">${small('Exchange Cashback',pending?'-':n2(A)+' USDT')}${B>0&&!pending?small('Event Reward',n2(m)+' USDT'):''}
   ${pending?'':`<div style="height:4px;border-radius:4px;background:rgba(187,226,255,.2);overflow:hidden"><div style="height:100%;width:${Math.min(100,claim*10)}%;background:#2453f0;border-radius:4px"></div></div>
   <div style="font-size:10px;line-height:14px;letter-spacing:.15px;color:var(--text-secondary)">${cap.join('<br>')}</div>`}
   </div>
  ${S.vp==='mo'?'':'<button class="btn contained lg full" disabled>Auto Claim</button>'}</div>`}
// 모바일 지갑 상세: Auto Claim은 화면 아래 고정 바(Figma 29474:136690 · 기존 UID 상세 mWeb)
const moClaimBar=()=>`<div style="position:sticky;bottom:0;z-index:5;background:#fff;padding:16px;margin:0 -16px -16px;box-shadow:0 -1px 0 var(--divider)"><button class="btn contained lg full" disabled>Auto Claim</button></div>`;
function earningTimeline(ex,times){const tt=times||['2026.03.17 00:00','2026.03.18 00:00','2026.03.18 10:50'];
 const step=(ic,k,v)=>`<div class="col" style="gap:8px;align-items:center;width:80px;position:relative;z-index:1"><span style="background:#f2f2f5;padding:16px;border-radius:8px;display:flex">${hic(ic,24)}</span><span style="font-size:10px;line-height:10px;color:var(--text-secondary);white-space:nowrap">${k}</span><span style="font-size:10px;line-height:12px;font-weight:500;white-space:nowrap">${v}</span></div>`;
 return `<div style="background:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px">
  <div class="row" style="gap:4px"><span class="b1 semi">Earning Timeline${ex?' · '+ex:''}</span>${S.vp==='mo'?'':hic('star',36)}</div>
  <div class="row between" style="position:relative;align-items:flex-start"><span style="position:absolute;left:40px;right:40px;top:28px;border-top:1px dashed var(--divider)"></span>${step('candle','Start Trading',tt[0])}${step('clock','Cut-off Time',tt[1])}${step('checkc','Updated',tt[2])}</div></div>`}
function walletRight(o={}){
 const review=o.reviewed?'':`<div style="position:relative;background:rgba(0,123,255,.1);border-radius:8px;padding:16px 16px 16px 124px;display:flex;flex-wrap:wrap;gap:16px;align-items:center">
  <div style="position:absolute;left:8px;top:-14px;width:104px;height:88px;overflow:hidden"><img src="${HA('review.png')}" style="position:absolute;height:142.56%;left:-39.21%;top:-21.21%;width:177.17%;max-width:none" alt=""></div>
  <div class="col grow" style="gap:2px;min-width:178px;flex-basis:0"><span class="b2 semi">How was ${o.ex||'Lighter'}?</span><span class="cap c2" style="font-size:14px;line-height:20px;letter-spacing:.17px">Your first review earns you 2 USDT. It takes about a minute.</span></div>
  <button class="btn contained primary md" style="gap:8px;flex:none;padding:6px 18px;min-width:239px;justify-content:center" data-go="${o.cex?'cexd':'dex.detail'}:${(o.ex||'Lighter').toLowerCase()}">Write a review, get 2 USDT<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true" style="display:block;fill:currentColor"><path d="M12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"/></svg></button></div>`;
 if(o.onlyReview)return review;
 // 하단 = `Top Partner Exchanges`(결정 「지갑 상세 하단」) — Figma PW1 28960:125943: DEX 4곳 타일 · `Up to n% cashback` · 다음 화살표
 const parts=[['Lighter','#00f0ff','20%'],['ApeX','#15192a','30%'],['EdgeX','#181a20','30%'],['Aster','#000','20%']];
 const tile=([n,bg,p],w)=>`<div class="col" style="gap:4px;cursor:pointer;${w?`width:${w}px;flex:none`:''}" data-go="dex.detail:${n.toLowerCase()}"><div style="background:${bg};height:${w?60:80}px;border-radius:4px;display:flex;align-items:center;justify-content:center">${mark(n,48)}</div><span style="font-size:12px;line-height:1.4;color:var(--text-secondary);font-weight:500">${n}</span><span style="font-size:12px;line-height:20px;font-weight:500">Up to ${p} cashback</span></div>`;
 const next=`<button class="icon-btn" aria-label="Next" style="position:absolute;right:-24px;top:20px;width:40px;height:40px;background:#fff;border-radius:50%;box-shadow:0 2px 6px rgba(0,0,0,.16)">${ic('chevron-right','ic20')}</button>`;
 const top=`<div style="background:#fff;border-radius:8px;padding:24px 20px;display:flex;flex-direction:column;gap:16px">${secHead('Top Partner Exchanges','hub.main:dex')}
  <div style="position:relative;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px">${parts.map(x=>tile(x)).join('')}${next}</div></div>`;
 if(S.vp==='mo'){ // 기존 UID 상세 모바일(26047:1348691 · 25867:1348700) 순서: 리뷰 유도 → Top Partner(가로) → Exclusive For Members(2열)
  const topMo=`<div style="background:#fff;border-radius:8px;padding:16px" class="col g16"><div class="row between"><span class="b1 semi">Top Partner Exchanges</span><button class="btn text primary sm" style="padding:4px 5px" data-go="hub.main:dex">See All</button></div>
   <div class="row" style="gap:12px;overflow:hidden;align-items:flex-start">${parts.map(x=>tile(x,100)).join('')}</div></div>`;
  return `<div class="col" style="gap:16px;width:100%">${topMo}<div style="background:#fff;border-radius:8px;padding:16px" class="col g16">${moMemberCards('Lighter','Exclusive Benefit')}</div></div>`}
 return `<div style="display:flex;flex-direction:column;gap:24px;width:${S.vp==='mo'?'100%':'717px'}">${review}
  <div style="background:#fff;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:16px">${secHead('Exclusive Benefit','benefits.list')}${memberEvents('Lighter',true)}</div>${top}</div>`}
const WALLET_FIG='29026:97581';
const WALLET_STATES=[
 {id:'normal',label:'정상 — 부분 매칭 · 최소액 이상 (PW1)',figma:{pc:'28960:125943',mo:'29474:136690'},ab:[7,100],note:'V2.2 home/LKD#normal · REQ-276~280. A=7.00 · B=100.00'},
 {id:'noReward',label:'리워드 없음 · 최소액 이상 — Event Reward 행 없음',figma:{pc:'29026:97588'},ab:[120,null],note:'V2.2 home/LKD#noReward · REQ-277. A=120.00 · B=null'},
 {id:'zero',label:'모든 적립 잔액 0',figma:{pc:'29026:97617'},ab:[0,0],note:'V2.2 home/LKD#zero · REQ-277. A=0 · B=0'},
 {id:'cashBelow',label:'캐시백만 보유 · 최소액 미만',figma:{pc:'29026:97646'},ab:[3,0],note:'Figma 매칭 상태 프레임에만 있음 — 매칭 공식(REQ-129·130) 표시 규칙이라 넣음. A=3.00 · B=0'},
 {id:'rewardOnly',label:'리워드만 보유',figma:{pc:'29026:97675'},ab:[0,8],note:'Figma 매칭 상태 프레임에만 있음. A=0 · B=8.00'},
 {id:'partialBelow',label:'부분 매칭 · 최소액 미만',figma:{pc:'29026:97704'},ab:[2,8],note:'Figma 매칭 상태 프레임에만 있음. A=2.00 · B=8.00'},
 {id:'fullBelow',label:'전액 매칭 · 최소액 미만',figma:{pc:'29026:97762'},ab:[4.5,4.5],note:'Figma 매칭 상태 프레임에만 있음. A=4.50 · B=4.50'},
 {id:'fullEqual',label:'전액 매칭 · 최소액과 일치',figma:{pc:'29026:97791'},ab:[5.5,4.5],note:'Figma 매칭 상태 프레임에만 있음. A=5.50 · B=4.50'},
 {id:'fullAbove',label:'전액 매칭 · 최소액 초과',figma:{pc:'29026:97820'},ab:[12,4],note:'Figma 매칭 상태 프레임에만 있음. A=12.00 · B=4.00'},
 {id:'edge',label:'소수점 절삭 · 기준 직전',figma:{pc:'29026:97849'},ab:[9.999,0],note:'Figma 매칭 상태 프레임에만 있음. A=9.999 · B=0 → 9.99, 필요액 0.01'},
 {id:'loading',label:'잔액 로딩 — 스켈레톤',ab:[7,100],note:'Figma 매칭 상태 프레임 하단 메모(REQ-145) — 화면 프레임 없음'},
 {id:'error',label:'잔액 조회 실패 — 기존 빈 상태',ab:[7,100],note:'G-459 — 조회 실패는 기존 빈 상태(0 표시), 재시도 버튼 없음'},
 {id:'reviewed',label:'리뷰 작성 후 — 리뷰 유도 없음',figma:{pc:'28960:125943'},ab:[7,100],note:'[기존 MAX-7] MAX-1216 UID detail / Review already written (Plain). V2.2 home/LKD#reviewed · REQ-278'},
 {id:'totalClaimed',label:'Total Claimed 행',figma:{pc:'28960:125943'},ab:[7,100],note:'[기존 MAX-7] UID 상세 잔액 카드의 Total Claimed 행(Web 26047:1349155 · mAPP 8582:157676). V2.2 home/LKD#totalClaimed · REQ-281 · G-053 확정: 유지(테더맥스 경유 출금 누계)'},
 {id:'subaccounts',label:'하위 계정 나열 안 함 (Lighter)',figma:{pc:'28960:125943'},ab:[7,100],note:'V2.2 home/LKD#subaccounts · REQ-281 · G-178 확정: 미표시 — 정상 화면과 같음'},
];
R.screen({id:'home.wallet',group:'home',title:'DEX 지갑 상세',route:'/dex/wallet (지갑 상세)',fu:['FU-040'],shell:{accent:true,back:'back:home.main',moNav:'home'},
 states:WALLET_STATES,
 render(st,ctx){
  const SW=window.SITEW;const [A0,B0]=SW?[SW.a,SW.b]:ctx.state.ab;const pending=SW?SW.st==='pend':st==='pending';
  const ex=SW?SW.ex:'Lighter',wid=SW?SW.id:WAL.lighter,cex=SW&&SW.type==='CEX';
  // 식별자: CEX = `UID …`(툴팁 없음) · DEX = 웹 `Wallet` + 축약 주소(모바일은 주소만, Figma 29474:136690). 축약 주소만 전체 주소 툴팁(결정 12차 「축약 지갑 주소 전체 보기」)
  const idTxt=cex?`UID ${esc(wid)}`:`${S.vp==='mo'?'':T('Wallet','지갑')+' '}<span data-addr="${esc(wid)}">${short(wid)}</span>`;
  const w343=S.vp==='mo'?'':'width:343px;box-sizing:border-box;';
  const head=`<div style="background:#fff;border-radius:8px;padding:12px 16px;${w343}" class="row between">
   <div class="row" style="gap:8px">${SW?mark(ex,30):C.dex(ex,30)}<div class="col" style="gap:0"><span class="b2 semi">${ex}</span><span class="row" style="gap:4px"><span style="font-size:12px;line-height:12px;color:var(--text-secondary)">${idTxt}</span><button class="icon-btn" data-copy="${esc(wid)}" aria-label="Copy" style="padding:2px">${hic('copy',16)}</button></span></div></div>
   ${pending?hChip(T('Trying to link','연동 시도중이에요'),'prog'):hChip(T('Active','연동 완료'),'done')}</div>`;
  const tl=earningTimeline().replace('<div style="background:#fff;border-radius:8px;padding:16px;','<div style="background:#fff;border-radius:8px;padding:16px;'+w343);
  const left=`${head}${walletBalance(A0,B0,{loading:st==='loading',error:st==='error',pending,totalClaimed:st==='totalClaimed'})}${tl}
   ${st==='totalClaimed'?C.note('Total Claimed = 테더맥스를 통해 지급된 누계(G-053). 디자인 없음 — 잔액 카드 작은 행으로 둠'):''}
   ${st==='subaccounts'?C.note('Lighter 하위 계정(account_index)은 나열하지 않음 — G-178'):''}
   ${st==='normal'?C.note('테더맥스를 지급자로 씀 — paid by {DEX} · withdraw on {DEX} 없음(REQ-279). 요율은 실제 레코드 값, 트레이더 0% 미표시(REQ-280). 마일스톤 진행바 없음(REQ-278) — 막대는 계정별 지급 기준(10 USDT)까지의 진행률. Figma 헤더 칩 <code>Active</code>는 KO에서 REQ-273 라벨 <code>연동 완료</code>. 리뷰 버튼 Figma 자리표시 <code>Label</code> → V2.2 문구'):''}
   ${st.startsWith('full')||['cashBelow','rewardOnly','partialBelow','edge','noReward','zero'].includes(st)?C.note('B가 null 또는 0이면 리워드 행과 매칭 설명을 숨김. B가 양수이면 매칭액이 0이어도 행을 표시(Figma 매칭 상태 프레임)'):''}`;
  const right=walletRight({reviewed:st==='reviewed',ex,cex});
  // 모바일 순서(Figma 29474:136690): 헤더 → 잔액 → 리뷰 유도 → Earning Timeline → Top Partner → Exclusive Benefit, Auto Claim은 아래 고정 바
  if(S.vp==='mo')return `<div style="padding:16px" class="col g16">${left.replace(tl,walletRight({reviewed:st==='reviewed',ex,cex,onlyReview:1})+tl)}${right}${moClaimBar()}</div>`;
  return `<div style="padding:40px 0 80px;display:flex;justify-content:center"><div style="display:flex;gap:24px;align-items:flex-start"><div style="width:347px;display:flex;flex-direction:column;gap:16px;flex:none">${left}</div>${right}</div></div>`;
 }});

// ---------- 캐시백 타임라인 · 누적 캐시백 (FU-041) — 디자인 없음, V2.2 내용 ----------
R.screen({id:'home.timeline',group:'home',title:'캐시백 타임라인 (섹션)',route:'/ (홈 · 지갑 상세 안 섹션)',fu:['FU-041'],shell:{accent:true,moNav:'home'},
 states:[
  {id:'normal',label:'EdgeX Daily D+1',figma:{pc:'5947:87400',mo:'5947:87400'},note:'[기존 MAX-7] mWeb individualExchange Earning Timeline 5947:87400(343) — 기존 Earning Timeline 3단계(Start Trading · Cut-off Time · Updated), 캐러셀 없음 — 결정 N16·N17·N19 · REQ-282 · 289. 홈·지갑 상세 안의 섹션(별도 화면 아님 · 뒤로 없음)'},
  {id:'apex',label:'ApeX D+2',note:'같은 3단계 — 날짜만 주기대로'},
  {id:'lighter',label:'Lighter Weekly W+1 (온보딩 후)',note:'같은 3단계 — 주간 집계'},
  {id:'warning',label:'순차 지급 경고',note:'V2.2 home/TL#warning · REQ-289. 경고 자리 디자인 없음 — 기존 MUI Alert(warning) 재사용'},
 ],
 render(st){
  const ex={normal:['EdgeX',['2026.10.21 00:00','2026.10.22 00:00','2026.10.22 01:00']],apex:['ApeX',['2026.10.20 00:00','2026.10.21 00:00','2026.10.22 01:00']],lighter:['Lighter',['2026.10.13 00:00','2026.10.20 00:00','2026.10.20 01:00']],warning:['EdgeX',['2026.10.21 00:00','2026.10.22 00:00','2026.10.22 01:00']]}[st]||['EdgeX'];
  const tl=earningTimeline(ex[0],ex[1])+(st==='warning'?C.alert('warn','','거래소별로 순차 지급하고 있어서 몇 분 더 걸릴 수 있어요.'):'');
  const w=S.vp==='mo'?'100%':'343px';
  return `<div style="padding:${S.vp==='mo'?'16px':'40px 0 80px'};display:flex;justify-content:center"><div class="col g16" style="width:${w}">${tl}</div></div>`;
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
   ${sec(T('Cashback Summary','캐시백 요약'),sum)}${sec(T('Live withdrawals','실시간 출금'),feed)}
   ${C.note({normal:'지급 완료된 건만 피드에 표시',deducted:'처리 중 — 피드에 아직 없음(자동 지급 완료 = 출금일 때만 표시). 영문 선차감 문구는 G-112 문구표 확정분(원문 없음)',restored:'실패해 복원된 건은 피드에 Sent 항목이 생기지 않음. 잔액은 복원 후 다시 같은 조건으로 판정'}[st]+' · 홈 · 캐시백 요약 · 실시간 출금 피드가 같은 레코드에서 같은 새로고침에 반영. 결과를 보여 주는 회원 화면은 없음(REQ-163)')}`;
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
// 소유권 홈(60-own.js)이 같은 Linked Accounts 행·카드를 쓴다(결정 10차 행 표시 — 칩 없이 점 · 시계 · 배너)
window.HOME_ROWS={accRow,linkedCard,WAL,R_BITGET,R_APEX};
// Linked Accounts `Show More`(계정 11개 이상, REQ-271): 숨긴 행을 펼치고 버튼은 사라짐. 행은 아래 8px에서 떠오름(모션 명세 공통 등장)
document.addEventListener('click',e=>{const b=e.target&&e.target.closest&&e.target.closest('[data-more]');if(!b)return;e.preventDefault();
 const card=b.parentElement;const rows=[...card.querySelectorAll('[data-more-row][hidden]')];rows.forEach((r,i)=>{r.hidden=false;if(r.animate&&!(window.UI&&UI.reduced&&UI.reduced()))r.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:300,delay:i*30,easing:'ease-out',fill:'backwards'})});b.remove()});
