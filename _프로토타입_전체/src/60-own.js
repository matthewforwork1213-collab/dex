// 6. 소유권 인증 — O1·O2 결과 스플래시 · O3~O10 인증 화면 · O11~O16 홈 심사 상태
// Figma: DEX(revision) › "DEX — Ownership verification Web [Light]"(웹 O1~O16 — O3·O8·O9·O10은 기존 [MAX-561] 원본 `Web` 컴포넌트로 다시 그려짐),
//        "Mobile · Wallet ownership verification and transfer"(모바일). 기존 원본 [MAX-561] Ownership Verification(12474:14170)
// 정책: FU-026(REQ-114·125) · FU-027(REQ-723~728) · FU-028(REQ-729). 근거 표 ref/대응_own.md
const OWN_DEX='Lighter';
const OWN_ADDR='0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9'; // Figma 예시 주소(저장된 대소문자 그대로 표시, REQ-723)
const OWN_SHORT='0x7a3f…51e9';
let OWN_FULL=OWN_ADDR;   // 축약 주소의 전체 값(툴팁 · 복사). 사이트 모드는 setOwn으로 바뀜
const ownAddr=()=>/^0x/.test(OWN_SHORT)?`${T('Wallet','지갑')} <span data-addr="${esc(OWN_FULL)}">${OWN_SHORT}</span>`:OWN_SHORT;
const oic=(n,s=24)=>`<img src="${A('own-ic-'+n+'.svg')}" style="width:${s}px;height:${s}px;flex:none" alt="">`;
const oAlert=(tone,text,o={})=>{const m={info:['#e5f6fd','#014361','info'],warn:['#fff4e5','#663c00','warn'],err:['#fdeded','#5f2120',null]}[tone];
 const icon=m[2]?oic(m[2],20):`<span style="width:20px;height:20px;border-radius:50%;background:var(--error);color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:12px;font-weight:700;flex:none">!</span>`;
 return `<div style="display:flex;align-items:center;gap:12px;background:${m[0]};color:${m[1]};border-radius:4px;padding:6px 16px;width:100%"><span style="padding:7px 0;display:flex;align-self:flex-start">${icon}</span><p class="b2" style="margin:0;padding:8px 0;flex:1">${text}</p>${o.chevron?ic('chevron-right','ic20'):''}</div>`};

// MUI <Dialog>(기존 [MAX-561] 원본) — 웹 480 · 모바일 343, elevation 16
// 버튼: 웹 = 가로 균등(보조 = 흰색 contained #f2f2f5) · 모바일 = 세로
const mBtn=(label,go,v='primary')=>`<button class="btn lg" style="${v==='primary'?'background:var(--blue);color:#fff':v==='white'?'background:#f2f2f5;color:var(--text-primary)':'background:transparent;color:var(--text-primary)'};${S.vp==='mo'?'width:100%':'flex:1;min-width:0'}" data-go="${esc(go)}">${label}</button>`;
function muiDialog({title,body,extra,actions,center,close}){
 const mo=S.vp==='mo';
 return `<div role="dialog" aria-modal="true" style="background:var(--paper);border-radius:4px;box-shadow:0 6px 30px 5px rgba(0,0,0,.12),0 16px 24px 2px rgba(0,0,0,.14),0 8px 10px -5px rgba(0,0,0,.2);width:${mo?343:480}px;max-width:100%;text-align:${center?'center':'left'}">
  ${title?`<div style="display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:24px 24px 0;font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.15px"><span>${title}</span>${close?`<button class="icon-btn" type="button" aria-label="Close" data-go="${esc(close)}">${ic('close')}</button>`:''}</div>`:''}
  ${body?`<div style="padding:${title?16:8}px 24px 0;font-size:14px;line-height:1.43;font-weight:500;letter-spacing:.17px;color:var(--text-secondary)">${body}</div>`:''}${extra||''}
  ${actions?`<div style="padding:24px;display:flex;${mo?'flex-direction:column;':''}gap:8px">${actions}</div>`:`<div style="height:24px"></div>`}</div>`}
// 같은 화면 위 다이얼로그 — 뷰포트(웹 900 − GNB 64 · 모바일 812) 높이로 자르고 가운데에 띄운다(Figma Backdrop)
function ownLayer(page,dlg){
 const h=S.vp==='mo'?812:836;
 return `<div style="position:relative;height:${h}px;overflow:hidden">${page}<div class="scrim center" style="align-items:center;justify-content:center;bottom:auto;height:${h}px;padding:16px">${dlg}</div></div>`}

// ---------- 결과 스플래시 (UID link result / Splash, MAXOP-751) ----------
// 웹 O1 28960:127644 · O2 28960:127650 — 연동 결과 L9(link.result:inuse)와 같은 컴포넌트·문구. 화면은 연동 모듈의 스플래시를 그대로 씀
R.screen({id:'own.inuse',group:'own',title:'이미 사용 중 · 신청 불가(30일)',route:'/link (전체 화면 모달)',fu:['FU-027'],shell:false,
 states:[
  {id:'normal',label:'Account Already in Use (O1)',figma:{pc:'28960:127644',mo:'28969:127109'},note:'V2.2 <code>own/O1#normal</code>. DEX(revision) O1 = 결과 스플래시(error) — <code>Verify Ownership</code>은 인증 화면, <code>Try a different wallet</code>은 주소 입력으로(SCREEN-LABEL 원문). 연동 결과 <code>link.result:inuse</code>와 같은 화면. 기존 [MAX-561] UID already in use(웹 12792:59661 · mWeb 12874:18663)의 DEX판'},
  {id:'cooldown',label:'Ownership Claim Unavailable — 30일 쿨다운 (O2)',figma:{pc:'28960:127650',mo:'28982:126298'},note:'V2.2 <code>own/O2#normal</code> · REQ-724. DEX(revision) O2 = 결과 스플래시(warning) — O1 대신 표시(최근 30일 안에 다른 회원이 인증). 기존 [MAX-561] Ownership cooldown time(웹 12792:61035 · mWeb 12783:405465)의 DEX판. 「DEX는 소유권 인증을 지원하지 않습니다」류 문구 금지(REQ-125)'},
 ],
 render(st){
  if(st==='cooldown')return window.LINK_SPLASH('warning',T('Ownership Claim Unavailable'),[`<span class="row" style="gap:8px;justify-content:center;align-items:center">${C.dex(OWN_DEX,24)}<span class="b1 semi" style="color:var(--text-primary)">${OWN_DEX}</span><span>${ownAddr()}</span></span>`,T('This wallet address was recently verified by another user. Ownership claims will be available after 30 days.')],C.btn(T('Try a different wallet'),{full:true,go:'link.addr:empty'})+C.btn(T('Close','닫기'),{v:'outlined',c:'black',full:true,go:'link.addr:kept'}),{close:'link.addr:kept'});
  return renderInner('link.result:inuse')}});

// ---------- O3~O10 : 인증 화면 ----------
const STEPS=[
 {t:'Start recording, then disconnect your wallet',b:'Start your screen recording, open Lighter, and disconnect your wallet from the account menu at the top right.',ko:'화면 녹화를 시작하고 DEX를 연 뒤, 오른쪽 위 계정 메뉴에서 지갑 연결을 해제하세요.'},
 {t:'Log back in with the same wallet',b:'Keep recording and reconnect your wallet to Lighter. Make sure the wallet connection and approval screens are visible.',ko:'녹화를 계속하면서 같은 지갑으로 DEX에 다시 연결하세요. 지갑 연결·승인 화면이 보여야 합니다.'},
 {t:'Show your full wallet address',b:'Open your account menu and show your full wallet address on screen. Make sure every character is clearly visible before you stop recording.',ko:'계정 메뉴를 열어 전체 지갑 주소가 한 글자도 빠짐없이 보이게 한 뒤 녹화를 멈추세요.'},
];
const stepIdx=st=>st==='s2'?1:['s3','uploading','failed','uploaded','confirm'].includes(st)?2:0;
const NEXT={normal:'s2',s2:'s3',s3:'normal'};
// 조각 — 기존 [MAX-561] 원본 `Web` 컴포넌트(웹 그리드 346.67 | 717.33)와 모바일이 같은 카드를 쓴다
const vWallet=()=>`<div style="background:#fff;border-radius:8px;padding:12px 16px;display:flex;align-items:center;gap:8px">${C.dex(OWN_DEX,30)}<div class="col" style="gap:0"><span class="b2 semi">${OWN_DEX}</span><span class="row" style="gap:4px"><span style="font-size:12px;line-height:12px;color:var(--text-secondary)">${ownAddr()}</span><span data-copy="${esc(OWN_FULL)}" style="padding:2px;display:flex;cursor:pointer">${oic('copy',16)}</span></span></div></div>`;
function vGuide(st){const i=stepIdx(st),s=STEPS[i];
 return `<div style="background:#fff;border-radius:8px;padding:16px;display:flex;flex-direction:column;gap:16px"><span class="b1 semi">${T('Ownership Video Recording Guide')}</span>
  <div style="border-radius:8px;display:flex;flex-direction:column;gap:8px"><div style="position:relative;border-radius:8px 8px 0 0;overflow:hidden;cursor:pointer" data-go="own.verify:${NEXT[['normal','s2','s3'][i]]}"><img src="${A('own-guide-lighter.png')}" style="width:100%;aspect-ratio:1280/929;object-fit:cover"><span style="position:absolute;left:16px;top:16px;background:#0031c6;color:#fff;border-radius:100px;padding:2px 7px;font-size:11px;line-height:1.38;letter-spacing:.16px">${T(`Step ${i+1} of 3`)}</span></div>
  <div class="col" style="gap:4px;padding:8px"><span class="b2 med">${T(s.t)}</span><span class="b2 c2">${T(s.b,s.ko)}</span></div></div>
  <div class="row between" style="align-items:center;gap:8px">${i>0?`<button class="icon-btn" aria-label="Previous step" data-go="own.verify:${['normal','s2','s3'][i-1]}">${ic('chevron-left')}</button>`:'<button class="icon-btn" aria-label="Previous step" disabled style="opacity:.38">'+ic('chevron-left')+'</button>'}<img src="${A('own-mo-step'+(i+1)+'.svg')}" style="flex:1;min-width:0;height:6px" alt="">${i<2?`<button class="icon-btn" aria-label="Next step" data-go="own.verify:${['normal','s2','s3'][i+1]}">${ic('chevron-right')}</button>`:'<button class="icon-btn" aria-label="Next step" disabled style="opacity:.38">'+ic('chevron-right')+'</button>'}</div></div>`}
function vZone(file){
 return file
  ?`<div style="border:1px dashed rgba(0,0,0,.12);border-radius:4px;padding:24px 16px;display:flex;align-items:center;gap:16px"><span style="width:40px;height:40px;display:inline-flex;align-items:center;justify-content:center;flex:none">${oic('videocam',24)}</span><div class="col grow" style="gap:0"><span class="b1">lighter-ownership.mp4</span><span class="row b2 c2" style="gap:8px">3.2 MB<span>•</span>${T('Complete')}</span></div><button class="icon-btn" data-go="own.verify:uploading" style="width:36px;height:36px" title="Replace" aria-label="Replace file">${oic('x',20)}</button></div>`
  :`<div style="border:1px dashed rgba(0,0,0,.12);border-radius:4px;padding:24px 16px;display:flex;flex-direction:column;align-items:center;gap:8px;text-align:center;cursor:pointer" data-go="own.verify:uploading">${oic('upload')}<span class="b2">${T('Upload your screen recording')}</span><span class="b2 c2">${T('MP4 or MOV (max. 1GB)')}</span></div>`}
const vAlert=(tone,lines)=>{const [bg,c,icn]=tone==='info'?['#e5f6fd','#014361','info']:['#fff4e5','#663c00','warn'];
 return `<div style="display:flex;gap:12px;background:${bg};color:${c};border-radius:4px;padding:6px 16px"><span style="padding:8px 0 7px;display:flex">${oic(icn,20)}</span><div class="col" style="gap:8px;padding:8px 0;font-size:14px;line-height:1.43;letter-spacing:.17px">${lines.map(l=>`<span>${l}</span>`).join('')}</div></div>`};
const vAlerts=()=>vAlert('info',[T('It must be a screen recording file showing the navigation path, not a captured image.'),T('The process from the start of the recording to the wallet address verification must be visible without interruption.'),T('Please log in to the affiliated exchange account for ownership verification, record the screen so the wallet address is visible, then attach the recording file and click the [Submit Claim] button to submit.'),T('Most requests are reviewed within 5 minutes.')])
 +vAlert('warn',[T('Ownership verification is restricted for 30 days from completion.'),T('Some events may be restricted during the claim period. Existing coupons cannot be transferred.')]);
const fileOf=st=>st==='uploaded'||st==='confirm';
// 웹: 상단 40 · 좌우 80(1248 컨테이너) · 제목 줄(뒤로 40 + h6 Medium 20) → 40 → 좌 346.67 | 우 717.33(간격 24)
function verifyPage(st){
 const file=fileOf(st);
 const upload=`<div style="background:#fff;border-radius:8px;padding:24px;display:flex;flex-direction:column;gap:16px"><p style="margin:0;font-size:24px;line-height:1.334;font-weight:700">${T('Upload Recording')}</p>
  <div class="col" style="gap:8px">${vZone(file)}${vAlerts()}</div>${C.btn(T('Submit Claim'),{full:true,disabled:!file,go:file?'own.verify:confirm':''})}</div>`;
 return `<div style="width:1248px;max-width:100%;margin:0 auto;padding:40px 80px 64px;display:flex;flex-direction:column;gap:40px">
  <div class="row" style="gap:8px"><button class="icon-btn" data-go="back:home.main">${oic('back')}</button><span style="font-size:20px;line-height:1.6;font-weight:500;letter-spacing:.15px">${T('Ownership Verification')}</span></div>
  <div style="display:grid;grid-template-columns:minmax(0,1fr) minmax(0,2fr);gap:24px;align-items:start"><div class="col g16">${vWallet()}${vGuide(st)}</div>${upload}</div></div>`;
}
// 모바일(Figma 28982:126103~ · 기존 [MAX-561] mWeb): mWeb 헤더(로고 · 계정 · 메뉴) → 제목 줄 → 카드 → 업로드 → 제출
const moHead=()=>`<div style="height:56px;display:flex;align-items:center;justify-content:space-between;padding:0 16px;background:#f8fafc"><img src="${A('logo.svg')}" style="width:142px;height:16px" alt="TetherMax"><div class="row" style="gap:6px"><span style="width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center"><img src="${A('own-mo-account.svg')}" style="width:20px;height:20px" alt=""></span><span style="width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.04);display:inline-flex;align-items:center;justify-content:center"><img src="${A('own-mo-menu.svg')}" style="width:20px;height:20px" alt=""></span></div></div>`;
function verifyPageMo(st){
 const file=fileOf(st);
 return `${moHead()}<div style="padding:16px 16px 0;display:flex;align-items:center;gap:4px"><button class="icon-btn" data-go="back:home.main">${oic('back')}</button><span style="font-size:20px;font-weight:500;line-height:1.6">${T('Ownership Verification')}</span></div>
  <div style="padding:16px;display:flex;flex-direction:column;gap:24px">${vWallet()}${vGuide(st)}
  <div class="col" style="gap:8px"><span class="b1 semi">${T('Upload Recording')}</span><div style="background:#fff;border-radius:8px;padding:16px">${vZone(file)}</div>${vAlerts()}</div>
  ${C.btn(T('Submit Claim'),{full:true,disabled:!file,go:file?'own.verify:confirm':''})}</div>`;
}
R.screen({id:'own.verify',group:'own',title:'소유권 인증 · 업로드 · 제출',route:'/ownership-verification',fu:['FU-027'],
 shell:{accent:true,noTop:true,noNav:true},
 states:[
  {id:'normal',label:'Step 1 · 파일 없음 (O3)',figma:{pc:'28960:127635',mo:'28982:126103'},note:'[기존 MAX-561] V2.2 <code>own/O3#normal</code>. 웹 O3는 기존 원본 `Web` 컴포넌트(With carousel 12792:171647)에 DEX 값을 얹은 프레임'},
  {id:'s2',label:'Step 2 (O4)',figma:{pc:'28960:127664',mo:'28982:126127'},note:'V2.2 <code>own/O3#s2</code>'},
  {id:'s3',label:'Step 3 (O5)',figma:{pc:'28960:127670',mo:'28982:126151'},note:'V2.2 <code>own/O3#s3</code>'},
  {id:'uploading',label:'업로드 중 (O6)',figma:{pc:'28960:127676',mo:'28982:126175'},note:'V2.2 <code>own/O3#uploading</code>'},
  {id:'uploaded',label:'업로드 완료 · 제출 가능 (O7)',figma:{pc:'28960:127682',mo:'28982:126199'},note:'V2.2 <code>own/O3#uploaded</code>'},
  {id:'failed',label:'Upload Failed (O8)',figma:{pc:'28960:127688',mo:'28982:126223'},note:'[기존 MAX-561] V2.2 <code>own/O3#failed</code>. 웹 O8 = 원본 `Web` + MUI Dialog'},
  {id:'error',label:'Something Went Wrong (O9)',figma:{pc:'28960:127694',mo:'29102:132023'},note:'[기존 MAX-561] V2.2 <code>own/O3#error</code>. 웹 = 「소유권 인증 원본 상태 · O9」 · 모바일 = Ownership / Unexpected error'},
  {id:'confirm',label:'Submit this claim? (O10)',figma:{pc:'28960:127700',mo:'28982:126238'},note:'[기존 MAX-561] V2.2 <code>own/O10#normal</code>. 원본 상태판 29102:133221'},
 ],
 render(st,ctx){
  const mo=S.vp==='mo';
  const nt=C.note({
   normal:'<b>O3</b> 지갑 카드(DEX 마크 · <code>Wallet</code> 축약 주소 + 복사, 상태 칩 없음) · 녹화 가이드(이미지 위 파란 <code>Step n of 3</code> 칩 · 제목 · 본문 · 단계 점, 이미지를 누르면 다음 단계) · 업로드 영역 · 안내/경고 · <code>Submit Claim</code>(업로드 전 비활성, REQ-726). 가이드 이미지는 DEX별 백오피스 작성(REQ-530), 없는 단계가 있으면 게시 차단(REQ-725). 파일 한도: Figma <code>max. 1GB</code> → 정책 REQ-726 <code>max. 100MB</code>. 경고 둘째 줄: Figma <code>…coupon usage period. Existing coupons are non-transferable.</code> → REQ-726 문구',
   s2:'<b>O4</b> 다음 단계 → 칩·점·제목·본문·이미지가 함께 바뀜(REQ-725). 가이드 이미지는 Figma 예시',
   s3:'<b>O5</b> 3단계 — 전체 주소가 모든 글자 보이게 표시 후 녹화 종료',
   uploading:'<b>O6</b> 가운데 진행 다이얼로그(스피너 · <code>Uploading File</code> · <code>Do not close this window.</code>) — 누르면 완료 상태로',
   uploaded:'<b>O7</b> 파일 행(동영상 아이콘 · 파일명 · <code>3.2 MB • Complete</code> · ×) — × = 파일 제거(빈 영역으로) · <code>Submit Claim</code> 활성',
   failed:'<b>O8</b> 120MB MOV 선택 등 → <code>Upload Failed</code> · <code>OK</code> = 빈 영역으로(REQ-726)',
   error:'<b>O9</b> <code>Contact Support</code> = 고객센터 · <code>Try again</code> = 업로드 재시작(REQ-726). 웹 = 가로 버튼(보조 흰색) · 모바일 = 세로(<code>Try again</code> 위)',
   confirm:'<b>O10</b> <code>Cancel</code> = 닫고 파일 유지 · <code>Submit Claim</code> = 신청 생성 → 홈 → 처리 중, 연타해도 1건(REQ-727). <code>Average review time: ~5 minutes</code>는 Figma 원문(자동 실패 10분은 REQ-728)',
  }[st]);
  const page=mo?verifyPageMo(st):verifyPage(st);
  const wrap=h=>h+`<div style="${mo?'padding:0 16px 24px':'width:1088px;max-width:100%;margin:0 auto 24px'}">${nt}</div>`;
  if(!['uploading','failed','error','confirm'].includes(st)||ctx.asBg)return wrap(page);
  const walletBox=`<div style="margin:16px 24px 0;border:.5px solid var(--divider);border-radius:8px;padding:8px 16px;display:flex;align-items:center;gap:8px">${C.dex(OWN_DEX,24)}<span class="b2 semi">${OWN_DEX}</span><span class="cap c2">${ownAddr()}</span><span data-copy="${esc(OWN_FULL)}" style="display:flex;cursor:pointer">${oic('copy',16)}</span></div>`;
  const dlg={
   uploading:`<div style="background:#fff;border-radius:4px;box-shadow:var(--elev24);width:${mo?343:480}px;max-width:100%;padding:24px;display:flex;flex-direction:column;align-items:center;text-align:center"><img src="${A('own-spinner.svg')}" style="width:40px;height:40px" alt=""><div style="padding-top:16px;font-size:20px;font-weight:500;line-height:1.6">${T('Uploading File')}</div><div class="b2 c2" style="margin-top:8px;cursor:pointer" data-go="own.verify:uploaded">${T('Do not close this window.')}</div></div>`,
   failed:muiDialog({title:T('Upload Failed'),body:T('We couldn’t upload your file. Please try again or select a different file.'),actions:`<button class="btn contained primary lg" style="width:100%" data-go="own.verify:s3">${T('OK')}</button>`}),
   error:muiDialog({title:T('Something Went Wrong'),body:T('An unexpected error occurred. Please try again.'),actions:mo?mBtn(T('Try again'),'own.verify:uploading')+mBtn(T('Contact Support'),'support.main','white'):mBtn(T('Contact Support'),'support.main','white')+mBtn(T('Try again'),'own.verify:uploading')}),
   confirm:muiDialog({title:T('Submit this claim?'),body:`${T('Our team will review your recording and verify ownership. This action cannot be undone after submission.')}<div style="margin-top:8px;color:var(--text-disabled);font-weight:400">${T('Average review time: ~5 minutes')}</div>`,extra:walletBox,
    actions:mo?mBtn(T('Submit Claim'),'own.home:review')+mBtn(T('Cancel'),'own.verify:uploaded','text'):mBtn(T('Cancel'),'own.verify:uploaded','white')+mBtn(T('Submit Claim'),'own.home:review')}),
  }[st];
  return wrap(ownLayer(page,dlg));
 }});

// ---------- O11~O16 : 홈 연동 계정 행 · 심사 결과 ----------
// 배경 = 실제 회원 홈(home.main:normal, 홈 담당) — Linked Accounts 카드만 소유권 상태 행으로 바꾼다(Figma O11~O16과 같은 4행)
function ownRows(st){
 const H=window.HOME_ROWS,mo=S.vp==='mo';
 const k={review:'own',approved:'ok',rejected:'ownfail',unlinked:'unlinked',reclaim:'unlinked',reclaimUid:'unlinked',reclaimRejected:'reclaimfail'}[st]||'ok';
 const me={ex:OWN_DEX,id:OWN_FULL,amt:k==='ok'?120:null,st:k};
 return H.linkedCard([H.R_BITGET,me,H.R_APEX,{ex:'Aster',id:H.WAL.aster,amt:3.2,st:'ok'}],{app:mo});
}
// home.main:normal을 그리고 Linked Accounts 카드를 ownRows로 바꾼다(홈 모듈은 그대로)
function ownHome(st){
 const html=renderInner('home.main:normal',true);
 if(typeof document==='undefined')return html;
 const t=document.createElement('template');t.innerHTML=html;
 const head=[...t.content.querySelectorAll('span')].find(s=>s.textContent.trim()==='Linked Accounts');
 const card=head&&head.parentElement&&head.parentElement.parentElement;
 if(!card)return html+C.note('홈 Linked Accounts 카드를 찾지 못함 — home.main 구조 변경 확인');
 const box=document.createElement('div');box.innerHTML=ownRows(st);card.replaceWith(box.firstElementChild);
 const d=document.createElement('div');d.appendChild(t.content.cloneNode(true));return d.innerHTML;
}
R.screen({id:'own.home',group:'own',title:'홈 · 심사 상태 · 이전 보유자 재청구',route:'/ (홈 연동 계정)',fu:['FU-027','FU-028'],shell:false,
 states:[
  {id:'review',label:'소유 확인중 (O11)',figma:{pc:'28960:127709',mo:'28982:126253'},note:'V2.2 <code>own/O11#normal</code>'},
  {id:'approved',label:'승인 — Ownership Verification Complete (O12)',figma:{pc:'29205:124141',mo:'28982:126268'},note:'V2.2 <code>own/O11#approved</code>'},
  {id:'rejected',label:'거절 — Ownership Verification Unsuccessful (O13)',figma:{pc:'29205:124663',mo:'28982:126283'},note:'V2.2 <code>own/O11#rejected</code>'},
  {id:'unlinked',label:'이전 보유자 · 연동 해제 행 (O14)',figma:{pc:'28960:127727',mo:'12783:404139'},note:'V2.2 <code>own/O14#normal</code>. 모바일 = [기존 MAX-561] mWeb Unlinked and UID claim by others(행 아래 경고 Alert + 오른쪽 화살표) — DEX 모바일 프레임 없음'},
  {id:'reclaim',label:'재청구 다이얼로그 (O15)',figma:{pc:'29202:120092',mo:'28982:126318'},note:'V2.2 <code>own/O14#reclaim</code>'},
  {id:'reclaimUid',label:'재청구 다이얼로그 — CEX UID (기존 MAX-561)',note:'CEX 해제 행은 기존 UID 문구 — 지갑 문구(O15)를 쓰지 않음'},
  {id:'reclaimRejectedRow',label:'재청구 거절 · 홈 계정 행',figma:null,note:'행 전용 Figma 프레임 없음 — 29202:120644 · 28982:126338은 행을 누른 뒤 O16 다이얼로그(<code>reclaimRejected</code>)'},
  {id:'reclaimRejected',label:'재청구 거절 · 사유 (O16)',figma:{pc:'29202:120644',mo:'28982:126338'},note:'V2.2 <code>own/O14#rejected</code>'},
 ],
 render(st,ctx){
  const mo=S.vp==='mo';
  const nt=C.note({
   review:'<b>O11</b> 처리 중 = 금액 <code>-</code> · <code>소유 확인중</code>(우선순위 1) · <code>Ownership verification in progress · {경과 시간}</code>. 결과 조회는 기존 CEX 방식. 관리자 응답 10분 없으면 자동 실패(REQ-728). Figma 상태 칩 라벨은 미입력(<code>Chip</code>) → V2.2 <code>소유 확인중</code>(영문 원문 없음). Figma Aster 행의 주황 칩은 「만료」 표현 금지로 그리지 않음',
   approved:'<b>O12</b> 승인 → 다이얼로그 <code>OK</code> 뒤 행에 금액 표시 · 지갑이 신청자 계정 <code>연동 완료</code>(REQ-728·729). FCM 25(신청자)',
   rejected:'<b>O13</b> 실패 = 금액 <code>-</code> · 행 안내 + 다이얼로그(REQ-728)',
   unlinked:'<b>O14</b> 승인 시 이전 보유자 행 = 금액 <code>-</code> · <code>This wallet has been unlinked. Tap to verify ownership and reclaim it.</code> 행을 누르면 O15(REQ-729). FCM 24(이전 보유자)',
   reclaim:'<b>O15</b> <code>Remove Wallet</code> = 그 행 제거 · <code>Submit Wallet Ownership</code> = 인증 화면(쿨다운 적용 → 30일 이내면 O2)(REQ-729). 모달 구성은 MAX-561 원본을 따름',
   reclaimRejected:'<b>O16</b> 재청구 거절 → <code>Reason from review: {reason}</code>(심사자 사유 그대로) · <code>Remove Wallet</code> · <code>Apply for Ownership</code>(REQ-729)',
   reclaimRejectedRow:'<b>O16</b> 홈 계정 행의 실패 안내를 누르면 심사 사유를 봅니다(REQ-729).',
  }[st]);
  const ntWrap=`<div style="${mo?'padding:0 16px 24px':'width:1088px;max-width:100%;margin:8px auto 24px'}">${nt}</div>`;
  const page=ownHome(st==='reclaimRejectedRow'?'reclaimRejected':st);
  if(!['approved','rejected','reclaim','reclaimUid','reclaimRejected'].includes(st)||ctx.asBg)return page+ntWrap;
  const account=`<div class="row g8" style="margin:16px 24px 0;padding:8px 16px;border:1px solid var(--divider);border-radius:4px">${C.dex(OWN_DEX,24)}<span class="b2 med">${OWN_DEX}</span><span class="cap c2">${ownAddr()}</span></div>`;
  const ok=mBtn(T('OK'),'home.main');
  const remove=mBtn(T('Remove Wallet'),'home.main','white');
  const submit=mBtn(T('Submit Wallet Ownership'),'own.verify:normal');
  const apply=mBtn(T('Apply for Ownership'),'own.verify:normal');
  const dlg={
   approved:{title:T('Ownership Verification Complete'),extra:account,body:T('Your wallet ownership has been successfully verified.'),actions:ok},
   rejected:{title:T('Ownership Verification Unsuccessful'),extra:account,body:T('We were unable to verify your wallet ownership. Please review your submission and try again.'),actions:ok},
   reclaim:{title:T('Verify Ownership to Reclaim This Wallet'),body:T('This wallet address was unlinked after another user verified ownership. If it belongs to you, submit a new claim.'),actions:mo?submit+remove:remove+submit,close:'own.home:unlinked'},
   reclaimUid:{title:T('Verify Ownership to Reclaim This UID'),body:T('This UID was unlinked after another user verified ownership. If it belongs to you, submit a new claim.'),actions:mo?mBtn(T('Submit UID Ownership'),'own.verify:normal')+mBtn(T('Remove UID'),'home.main','white'):mBtn(T('Remove UID'),'home.main','white')+mBtn(T('Submit UID Ownership'),'own.verify:normal'),close:'home.main:statuses'},
   reclaimRejected:{title:T('Ownership Verification Unsuccessful'),body:`${T('We were unable to verify your wallet ownership.')}<br><br>${T('Reason from review')}: ${T('The full wallet address is not visible in the recording.')}`,actions:mo?apply+remove:remove+apply,close:'own.home:reclaimRejectedRow'},
  }[st];
  return `<div style="position:relative">${page}<div class="scrim pt-fixed center" style="align-items:center;justify-content:center;padding:16px">${muiDialog(dlg)}</div></div>${ntWrap}`;
 }});
