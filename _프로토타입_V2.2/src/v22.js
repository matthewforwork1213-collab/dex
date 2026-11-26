// ===== V2.2 layer — 2026-11-24 확정 문서 기준 (정책 00_DEX_최종정책.md · 요구사항정의서 · 기능명세서 · API스펙) =====
// V2.1 위에 덮어씁니다. V2.1 소스는 바꾸지 않습니다.
// 반영: 10분 주기 자동 지급(Auto Claim 비활성) · 게스트 기능 폐지 · 연동 전 잔액 처리 · DEX 소유권 인증·이전 ·
//       챌린지·부스트 DEX 포함 · 맥스보드 DEX · 지갑 주소 전체 노출 · Lighter 온보딩 보류 · 캐시백 용어 · 백오피스 신규 화면

const V22_LABEL='V2.2 | 2026-11-25';
const V22_WALLET_UNKNOWN='0x7a3F9c2B8e41D05a6F3b7C91e2D4a8B0c6E551E9'; // 원본 화면의 0x7a3F…51E9 예시를 전체 주소로 맞춘 표본
const V22_TX='0x3f9b2c7d1e8a4f60b5c2d9e7a1f3b8c6d4e2a0f7b9c1d3e5f7a9b2c4d6e8f0a1';

// ---------- 표본 데이터: Lighter는 온보딩 보류(G-428) → 대표 DEX 표본을 EdgeX로
for(const list of [BASE_ACCOUNTS,state.accounts]){const a=list.find(x=>x.id==='a3');if(a)a.partner='edgex'}
if(FEED[0])FEED[0].partner='edgex';if(state.feed&&state.feed[0])state.feed[0].partner='edgex';
state.partner='edgex';

// ---------- 공통 도우미
const v22Short=s=>/^0x[0-9a-fA-F]{40}$/.test(String(s))?String(s).slice(0,6)+'…'+String(s).slice(-4):String(s);
const v22Clock=utc=>new Intl.DateTimeFormat(S.lang==='en'?'en-US':'ko-KR',{hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date('2026-10-23T'+utc+':00Z'));
const v22Wallets=()=>{const m={};for(const w of [SAMPLE_WALLET,SAMPLE_WALLET2,V22_WALLET_UNKNOWN])m[w.slice(-4).toLowerCase()]=w;return m};
const v22Mk=p=>`<span class="ava">${esc(p.name.slice(0,1))}</span>`;
const v22Dex=()=>state.accounts.find(a=>pBy(a.partner).type==='DEX')||state.accounts[2];
const v22Btn=(label,cls='',attrs='')=>`<button type="button" class="btn ${cls}" ${attrs}>${esc(label)}</button>`;
const v22Auto=()=>`<button type="button" class="btn v22-auto" disabled aria-disabled="true">Auto Claim</button>`;
const v22Dlg=(inner,cls='')=>`<div class="pg"><div class="dlg ${cls}">${inner}</div></div>`;
const v22Wrow=(a,full=true)=>`<div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)} <span class="bdg gy">${pBy(a.partner).type}</span><span class="sb mono">${pBy(a.partner).type==='DEX'?esc(full?a.identifier:v22Short(a.identifier)):'UID '+esc(mask(a.identifier))}</span></span><span class="am">${money(available(a))}<small>USDT</small></span></div>`;
const v22AdminShell=(original,title,body)=>preserveShell(original?cleanLegacy(original()):'',body,title);
const v22Tbl=(heads,rows)=>`<div class="v21-table"><table class="t"><thead><tr>${heads.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const v22Box=(title,body)=>MODE==='user'?`<section class="c">${title?`<h2>${esc(title)}</h2>`:''}${body}</section>`:`<section class="bx">${title?`<h2>${esc(title)}</h2>`:''}${body}</section>`;
const v22Note=(body,t='')=>`<div class="note ${t==='warn'?'wn':t==='error'?'rd':''}" role="note">${body}</div>`;

// ---------- 화면 목록(P) 정리
const v22Group=id=>P.find(p=>p.id===id);
function v22Drop(g,ids){const p=v22Group(g);if(p)p.states=p.states.filter(s=>!ids.includes(s.id))}
function v22Label(g,id,ko){const p=v22Group(g);const s=p&&p.states.find(x=>x.id===id);if(s){s.ko=ko;s.en=ko}}
function v22Add(g,id,ko,after){const p=v22Group(g);if(!p)return;const k=g+'/'+id;if(p.states.some(s=>s.id===id))return;const item={id,ko,en:ko,dko:'V2.2 신규 화면 — 2026-11-24 확정 문서 기준',den:'V2.2 new screen',r:()=>renderPage(k,null)};const at=after?p.states.findIndex(s=>s.id===after):-1;if(at>=0)p.states.splice(at+1,0,item);else p.states.push(item)}
function v22NewGroup(id,ko,states){if(v22Group(id))return;P.push({id,en:ko,ko,dot:'c',states:[]});for(const [sid,sko] of states)v22Add(id,sid,sko)}
if(MODE==='user'){
 v22Drop('home',['EXP']);v22Label('home','PUBLIC','비로그인 홈');
 const hub=v22Group('hub');if(hub){hub.ko='캐시백 허브';hub.en='Cashback hub'}
 v22Label('hub','H1-CEX','비로그인 · CEX 탭');v22Label('hub','H1-DEX','비로그인 · DEX 탭');v22Label('hub','H5','회원 · 캐시백 패널');
 v22Drop('link',['E4']);v22Label('link','L8','레퍼럴 아님');v22Label('link','L10','Lighter Standard');
 v22Label('link','PENDING','확인 중 · 귀속 확인 대기');
 v22Add('link','PRELINK','확인 중 · 연동 전 잔액 출금','PENDING');v22Add('link','PRELINKFAIL','연동 실패 · 연동 전 잔액 출금 실패','PRELINK');
 const own=v22Group('own');if(own){own.ko='소유권 인증';own.en='Ownership'}
 v22Label('own','O1','O1 Wallet Already in Use');
 v22Add('own','O2','O2 신청 불가 (30일)','O1');v22Add('own','O3','O3~O9 인증 화면 · 업로드','O2');v22Add('own','O10','O10 제출 확인','O3');v22Add('own','O11','O11~O13 홈 · 심사 상태','O10');v22Add('own','O14','O14~O16 이전 보유자 · 재청구','O11');
 v22Drop('wd',['DW2','DW3','NM']);v22Label('wd','DW1','출금 화면 (표시 전용)');v22Label('wd','DW0','출금 가능 계정 없음');
 const hist=v22Group('hist');if(hist){hist.ko='캐시백 요약';hist.en='Cashback summary'}
 const rk=v22Group('rk');if(rk){rk.ko='캐시백 랭킹';rk.en='Cashback ranking'}
 const ch=v22Group('ch');if(ch){ch.ko='캐시백 챌린지';ch.en='Cashback challenge'}
 v22Label('exd','D1','DEX 상세');v22Label('inv','IF8','초대 리워드 · 자동 지급');v22Label('etc','BST','부스트 · CEX·DEX');
 v22NewGroup('pbk','/payback 계산기',[['P1','Landing'],['P2','Choose platform'],['P3','Trading profile'],['P4','결과'],['P5','Summary']]);
}else{
 v22Label('ex','EX-3','소유권 확인 가이드 · CEX·DEX');v22Label('ex','EX-2','거래소 추가 · 캐시백율');
 v22Label('ac','AC-2','소유 확인 심사 · CEX·DEX');v22Label('ac','AC-3','연동 신청 수동관리 · DEX');
 const ac=v22Group('ac');if(ac){ac.ko='Account';ac.en='Account'}
 v22Label('pb','PB-1','전체 내역 · 자동 지급');
 v22NewGroup('dx','DEX 신규·확장',[['REC','DEX Cashback Records'],['AUD','연동 감사 로그'],['RPT','DEX 리포팅'],['BST','Account > Boost'],['CHS','챌린지 현황'],['QZ','퀴즈 설정']]);
}
for(const p of P)for(const it of p.states)if(it.dko)it.dko=String(it.dko).replace(/V2\.1/g,'V2.2');
validDesignRoutes.clear();for(const p of P)for(const it of p.states)validDesignRoutes.add(p.id+'/'+it.id);

// ---------- 화면 레지스트리 (기능 단위 · 상태 · 근거 REQ)
// v22Register('그룹/ID',{label,group,after,states:[[값,라벨,근거]],render:(상태)=>html,modal,fu:[...],note:[선택자,제목,본문]})
const V22_REG={},V22_ALIAS={};
function v22Group2(g,ko){let p=v22Group(g);if(!p){p={id:g,en:ko,ko,dot:'c',states:[]};P.push(p)}else if(ko){p.ko=ko;p.en=ko}return p}
function v22Register(k,o){const [g,id]=k.split('/');const p=v22Group2(g,o.group);let it=p.states.find(s=>s.id===id);
 if(!it){it={id,ko:o.label,en:o.label,dko:'V2.2 — 2026-11-24 확정 문서 기준',den:'V2.2',r:()=>renderPage(k,null)};const at=o.after?p.states.findIndex(s=>s.id===o.after):-1;if(at>=0)p.states.splice(at+1,0,it);else p.states.push(it)}
 else{it.ko=o.label;it.en=o.label;it.r=()=>renderPage(k,null)}
 V22_REG[k]=o;if(o.modal)MODAL_SCREENS[MODE][k]=o.modal;else delete MODAL_SCREENS[MODE][k];
 if(typeof validDesignRoutes!=='undefined')validDesignRoutes.add(k);}
function v22Retire(k,alias){const [g,id]=k.split('/');const p=v22Group(g);if(p)p.states=p.states.filter(s=>s.id!==id);delete MODAL_SCREENS[MODE][k];if(alias){V22_ALIAS[k]=alias;validDesignRoutes.add(k)}}
function v22Order(g,ids){const p=v22Group(g);if(!p)return;p.states.sort((a,b)=>{const x=ids.indexOf(a.id),y=ids.indexOf(b.id);return (x<0?999:x)-(y<0?999:y)})}
const v22BaseNav=nav;nav=function(route,seed){return v22BaseNav(V22_ALIAS[route]||route,seed)};V21_READY.nav=nav;V21_READY.V22_REG=V22_REG;V21_READY.V22_ALIAS=V22_ALIAS;

// 모달 설정: 새 화면도 기존 오버레이를 씀
Object.assign(MODAL_SCREENS.user,{
 'link/PRELINK':{background:'home/S4'},'link/PRELINKFAIL':{background:'home/S4'},
 'own/O1':{background:'home/S4'},'own/O2':{background:'home/S4'},'own/O10':{background:'own/O3'},'own/O14':{existingBackground:true}
});
delete MODAL_SCREENS.user['inv/IF8'];delete MODAL_SCREENS.user['wd/DW2'];delete MODAL_SCREENS.user['wd/DW3'];delete MODAL_SCREENS.user['wd/NM'];

// ---------- 지갑 표시: DEX는 전체 주소(정책 #37), CEX UID는 기존 마스킹
showIdentifier=function(a,full=false){return pBy(a.partner).type==='DEX'?`<span class="mono v22-addr">${esc(a.identifier)}</span>`:`<span class="sb">UID ${esc(mask(a.identifier))}</span>`};

// ---------- 사용자 화면
function v22OwnInUse(){
 const a=v22Dex();
 return v22Dlg(`<h3>Wallet Already in Use</h3><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>This wallet address is already linked to another account. If it belongs to you, submit a claim to recover it.</p><div class="row2">${v22Btn('Try a different wallet','sec','data-go="link/L3"')}${v22Btn('Verify Ownership','','data-go="own/O3"')}</div><p class="sb v22-help" data-action="support">Need help? Contact Support</p>`);
}
function v22OwnCooldown(){
 const a=v22Dex();
 return v22Dlg(`<h3>Ownership Claim Unavailable</h3><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>This wallet address was recently verified by another user. Ownership claims will be available after 30 days.</p><div class="row2">${v22Btn('Try a different wallet','sec','data-go="link/L3"')}${v22Btn('Close','','data-go="home/S4"')}</div>`);
}
const V22_GUIDE=[['Start recording, then disconnect your wallet','화면 녹화를 시작하고 DEX를 연 뒤, 오른쪽 위 계정 메뉴에서 지갑 연결을 해제하세요.'],['Log back in with the same wallet','녹화를 계속하면서 같은 지갑으로 DEX에 다시 연결하세요. 지갑 연결·승인 화면이 보여야 합니다.'],['Show your full wallet address','계정 메뉴를 열어 전체 지갑 주소가 한 글자도 빠짐없이 보이게 한 뒤 녹화를 멈추세요.']];
function v22OwnPage(){
 const a=v22Dex(),c=state.previewCase||'normal',step=c==='s2'?1:c==='s3'?2:0;
 const upload={
  normal:`<div class="v22-drop"><b>Upload your screen recording</b><span class="sb">MP4 or MOV (max. 1GB)</span></div>`,
  s2:`<div class="v22-drop"><b>Upload your screen recording</b><span class="sb">MP4 or MOV (max. 1GB)</span></div>`,
  s3:`<div class="v22-drop"><b>Upload your screen recording</b><span class="sb">MP4 or MOV (max. 1GB)</span></div>`,
  uploading:`<div class="v22-drop"><b>Uploading File</b><span class="sb">Do not close this window.</span><div class="gg"><i style="width:46%"></i></div></div>`,
  uploaded:`<div class="v22-drop done"><b>edgex_ownership.mp4</b><span class="sb">38.2 MB · Complete</span><span class="sb" style="color:var(--primary)">Remove</span></div>`,
  failed:`<div class="v22-drop"><b>Upload your screen recording</b><span class="sb">MP4 or MOV (max. 1GB)</span></div>`,
  error:`<div class="v22-drop"><b>Upload your screen recording</b><span class="sb">MP4 or MOV (max. 1GB)</span></div>`
 }[c]||'';
 const ready=c==='uploaded';
 const popup=c==='failed'?`<div class="dlg"><h3>Upload Failed</h3><p>We couldn't upload your file. Please try again or select a different file.</p>${v22Btn('OK','','data-go="own/O3"')}</div>`:c==='error'?`<div class="dlg"><h3>Something Went Wrong</h3><p>An unexpected error occurred. Please try again.</p><div class="row2">${v22Btn('Contact Support','sec','data-action="support"')}${v22Btn('Try again','','data-go="own/O3"')}</div></div>`:'';
 const [title,body]=V22_GUIDE[step];
 return `${gnbPC()}<div class="pg"><div class="v22-head"><span data-go="own/O1">←</span><h2>Ownership Verification</h2></div><div class="row2 v22-own">
  <div><section class="c"><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(checksumAddress(a.identifier))}</span></span><span class="bdg ok">연동 완료</span></div></section>
  <section class="c"><h3>Ownership Video Recording Guide</h3><div class="v22-guide"><div class="ph" role="img" aria-label="guide image">${esc(pBy(a.partner).name)} · Step ${step+1}</div><span class="bdg gy">Step ${step+1} of 3</span><h4>${esc(title)}</h4><p class="sb">${esc(body)}</p><div class="v22-dots">${[0,1,2].map(i=>`<i class="${i===step?'on':''}"></i>`).join('')}</div></div></section></div>
  <div><section class="c"><h3>Upload Recording</h3>${upload}${v22Note('Some events may be restricted during the claim period. Existing coupons cannot be transferred.','warn')}${ready?v22Btn('Submit Claim','','data-go="own/O10"'):`<button type="button" class="btn" disabled aria-disabled="true">Submit Claim</button>`}</section></div>
 </div></div>${popup}`;
}
function v22OwnConfirm(){
 const a=v22Dex();
 return v22Dlg(`<h3>Submit this claim?</h3><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>Our team will review your recording and verify ownership. This action cannot be undone after submission.</p><div class="row2">${v22Btn('Cancel','sec','data-go="own/O3"')}${v22Btn('Submit Claim','','data-go="own/O11"')}</div>`);
}
function v22OwnHome(){
 const a={...v22Dex()},c=state.previewCase||'normal';
 const others=state.accounts.filter(x=>x.id!==a.id).map(x=>v22Wrow(x,false)).join('');
 let row,extra='';
 if(c==='normal'){row=`<div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)} <span class="bdg gy">소유 확인중</span><span class="sb mono">${esc(v22Short(a.identifier))}</span></span><span class="am">-</span></div><div class="v22-strip">Ownership verification in progress · 06:46</div>`}
 else if(c==='approved'){row=v22Wrow(a,false);extra=`<div class="dlg"><h3>Ownership Verification Complete</h3><div class="li"><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>Your wallet ownership has been successfully verified.</p>${v22Btn('OK','','data-go="home/S4"')}</div>`}
 else{row=`<div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)} <span class="bdg gy">소유 확인 실패</span><span class="sb mono">${esc(v22Short(a.identifier))}</span><span class="sb">Ownership verification was unsuccessful. Please try again.</span></span><span class="am">-</span></div>`;extra=`<div class="dlg"><h3>Ownership Verification Unsuccessful</h3><p>We were unable to verify your wallet ownership. Please review your submission and try again.</p>${v22Btn('OK','','data-go="own/O11"')}</div>`}
 return `${gnbPC()}<div class="pg"><div class="c"><div class="kv big"><span class="k">총 캐시백 잔액</span><span class="v">${money(state.accounts.filter(x=>x.id!==a.id).reduce((s,x)=>s+x.cash,0))} USDT</span></div>${v22Auto()}</div><div class="c"><div class="ch"><h3>연동된 계정</h3></div>${others}${row}</div></div>${extra}`;
}
function v22OwnDisplaced(){
 const a=v22Dex(),c=state.previewCase||'normal';
 const reason='Address in the video does not match.';
 const rowText=c==='rejected'?'Ownership verification was unsuccessful. View reason.':'This wallet has been unlinked. Tap to verify ownership and reclaim it.';
 const others=state.accounts.filter(x=>x.id!==a.id).map(x=>v22Wrow(x,false)).join('');
 const dlg=c==='reclaim'?`<div class="dlg"><h3>Verify Ownership to Reclaim This Wallet</h3><div class="li"><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>This wallet address was unlinked after another user verified ownership. If it belongs to you, submit a new claim.</p><div class="row2">${v22Btn('Remove Wallet','sec','data-go="home/S4"')}${v22Btn('Submit Wallet Ownership','','data-go="own/O3"')}</div></div>`
  :c==='rejected'?`<div class="dlg"><h3>Ownership Verification Unsuccessful</h3><div class="li"><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div><p>We were unable to verify your wallet ownership.</p><p class="sb">Reason from review: ${esc(reason)}</p><div class="row2">${v22Btn('Remove Wallet','sec','data-go="home/S4"')}${v22Btn('Apply for Ownership','','data-go="own/O3"')}</div></div>`:'';
 return `${gnbPC()}<div class="pg"><div class="c"><div class="kv big"><span class="k">총 캐시백 잔액</span><span class="v">${money(state.accounts.filter(x=>x.id!==a.id).reduce((s,x)=>s+x.cash,0))} USDT</span></div>${v22Auto()}</div><div class="c"><div class="ch"><h3>연동된 계정</h3></div>${others}<div class="li" data-go="own/O14"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)} <span class="bdg gy">연동 해제</span><span class="sb mono">${esc(v22Short(a.identifier))}</span><span class="sb">${rowText}</span></span><span class="am">-</span></div></div></div>${dlg}`;
}
function v22Prelink(){
 const a=v22Dex();
 return v22Dlg(`<h3>지갑 연동을 확인하고 있어요</h3><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(a.identifier)}</span></span></div><div class="c flat"><div class="kv"><span class="k">연동 전에 쌓인 캐시백</span><span class="v">12.00 USDT</span></div><div class="kv"><span class="k">받는 곳</span><span class="v">이 지갑</span></div></div><p class="sb v22-tbd">[연동 전 잔액 출금 안내 문구 — 미정]</p>${v22Btn('홈으로','','data-go="home/S4"')}`);
}
function v22PrelinkFail(){
 const a=v22Dex();
 return v22Dlg(`<h3>지갑을 연동하지 못했어요</h3><div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb mono">${esc(a.identifier)}</span></span></div><p class="sb v22-tbd">[연동 전 잔액 출금 실패 안내 문구 — 미정]</p><div class="row2">${v22Btn('다시 연동하기','sec','data-go="link/L3"')}${v22Btn('닫기','','data-go="home/S4"')}</div>`);
}
function v22Referral(){
 const a=v22Dex(),name=pBy(state.partner).type==='DEX'?pBy(state.partner).name:pBy(a.partner).name;
 return v22Dlg(`<h3>연동할 수 없는 지갑</h3><p>Only wallets that joined ${esc(name)} through TetherMax's referral link can be linked.</p><p class="sb">가입 경로가 다르다면 고객센터로 문의해 주세요.</p>${v22Btn('Close','','data-go="home/S4"')}`);
}
function v22Linked(){
 const a=v22Dex(),p=pBy(a.partner);
 return v22Dlg(`<div class="ico">🛡️</div><h3>지갑이 연동되었어요</h3><div class="li"><span class="ava">${esc(p.name.slice(0,1))}</span><span class="nm">${esc(p.name)} <span class="bdg gy">DEX</span><span class="sb mono">${esc(a.identifier)}</span></span></div><div class="c flat"><div class="kv"><span class="k">정산 주기</span><span class="v"><span class="bdg ok">Daily</span></span></div><div class="kv"><span class="k">다음 업데이트</span><span class="v">매일 ${v22Clock('00:00')}</span></div></div>${v22Btn('홈으로 돌아가기','','data-go="home/S4"')}`);
}
function v22Withdraw(empty){
 const c=state.previewCase||'normal';
 let accounts=state.accounts.map(a=>({...a}));
 if(empty)accounts=accounts.map(a=>({...a,cash:pBy(a.partner).type==='DEX'?5:Math.min(a.cash,4),reward:a.reward}));
 const deducted=c==='deducted';
 const card=a=>{const p=pBy(a.partner),ok=isWithdrawable(a)&&!deducted,dex=p.type==='DEX',n=needed(a);
  const amt=deducted&&isWithdrawable(a)?0:available(a);
  return `<div class="c ${ok?'':'dim'}"><div class="ch"><span class="nm">${esc(p.name)}</span><span class="bdg ${ok?'ok':'gy'}">${ok?'Available':'Unavailable'}</span></div><div class="sb mono">${dex?'Wallet '+esc(a.identifier):'UID '+esc(mask(a.identifier))}</div>
   ${c==='delayed'&&dex?`<div class="sb">Last updated ${shortTime('2026-10-22T00:00:00Z')}</div>`:''}
   ${c==='partner'&&dex?v22Note(`We can't load your latest ${esc(p.name)} cashback right now.`,'warn')+v22Btn('Try again','sec'):''}
   <div class="kv"><span class="k">출금 가능 캐시백</span><span class="v">${money(amt)} USDT</span></div>
   <div class="kv"><span class="k">거래소 캐시백</span><span class="v">${money(deducted&&isWithdrawable(a)?0:a.cash)} USDT</span></div>
   ${a.reward>0?`<div class="kv"><span class="k">이벤트 리워드</span><span class="v">${money(a.reward)} USDT</span></div>`:''}
   ${dex?`<div class="kv"><span class="k">Cashback updates ⓘ</span><span class="v">Daily, ${v22Clock('00:00')}</span></div>`:''}
   ${!isWithdrawable(a)&&n>0?`<div class="sb" style="color:var(--down,#d33)">거래소 캐시백을 ${money(n)} USDT 더 받으면 출금할 수 있어요.</div>`:''}</div>`};
 const total=deducted?0:accounts.filter(isWithdrawable).reduce((s,a)=>s+available(a),0);
 const count=deducted?0:accounts.filter(isWithdrawable).length;
 const allBlocked=!accounts.some(isWithdrawable);
 const body=c==='loading'?`<div class="c v22-skel"></div><div class="c v22-skel"></div>`:accounts.sort((x,y)=>Number(isWithdrawable(y))-Number(isWithdrawable(x))).map(card).join('');
 return `<div class="pg"><div class="dlg v22-wd"><h3>Claim</h3><div class="c flat"><div class="kv big"><span class="k">출금 가능 캐시백 · ${count}개 계정</span><span class="v">${money(total)} USDT</span></div>${deducted?`<p class="sb">출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다</p>`:''}${allBlocked?`<p class="sb">출금 가능한 계정이 없어요. 캐시백 ${money(Math.min(...accounts.map(needed).filter(x=>x>0)))} USDT가 더 쌓이면 출금할 수 있어요.</p>`:''}</div>${body}
  <div class="c flat"><div class="kv"><span class="k">Network</span><span class="v">BNB Smart Chain (BEP20)</span></div><p class="sb">Deposits are made to the above wallet address on BNB Smart Chain (BEP20).</p><div class="kv"><span class="k">Network fee</span><span class="v">테더맥스가 전액 부담</span></div><p class="sb">이벤트 리워드는 같은 계정의 캐시백과 1:1로 매칭됩니다. 최소 출금액은 계정별 10 USDT입니다.</p></div>${v22Auto()}</div></div>`;
}
function v22Invite(){
 return `${gnbPC()}<div class="pg"><div class="tabs"><span>TetherMax Point</span><span class="on">친구 초대</span></div><section class="c"><h2>초대 리워드</h2><div class="kv big"><span class="k">Available Invitation Rewards</span><span class="v">12.00 USDT</span></div><div class="kv"><span class="k">받는 계정</span><span class="v">관리자가 지정한 연동 계정</span></div><p class="sb">10 USDT 이상이 되면 자동으로 지급돼요. 캐시백 매칭과는 별개예요.</p>${v22Auto()}</section></div>`;
}
function v22ChallengePick(){
 const accounts=state.accounts.filter(a=>a.status==='Active'),sel=state.rewardSelected||'';
 return `<div class="pg"><div class="dlg"><h3>보상을 받을 계정 선택</h3><div class="c flat">${['CEX','DEX'].map(t=>`<div class="dd-g">${t}</div>${accounts.filter(a=>pBy(a.partner).type===t).map(a=>`<div class="li ${sel===a.id?'selected':''}" role="radio" aria-checked="${sel===a.id}" tabindex="0" data-action="selectRewardAccount" data-value="${a.id}"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}${showIdentifier(a)}</span><span class="am">${sel===a.id?'◉':'○'}</span></div>`).join('')}`).join('')}</div><p class="sb">한 번 선택하면 변경할 수 없어요.</p><div class="row2">${v22Btn('취소','sec','data-go="ch/CH1"')}<button type="button" class="btn" ${sel?'':'disabled'} data-go="ch/CH1">확인</button></div></div></div>`;
}
function v22Board(){
 const a=v22Dex(),p=pBy(a.partner),cells=['5 USDT','10 USDT','20 USDT','3일 연속','30 USDT','7일 연속','50 USDT','80 USDT','100 USDT'],on=[0,1,3];
 return `${gnbPC()}<div class="pg"><section class="c"><div class="ch"><h2>${esc(p.name)} 맥스보드</h2><span class="bdg gy">DEX</span></div><div class="kv"><span class="k">참여 기간</span><span class="v">11. 01 ~ 11. 30</span></div><div class="kv"><span class="k">참여 지갑</span><span class="v mono">${esc(v22Short(a.identifier))}</span></div><div class="kv"><span class="k">누적 캐시백</span><span class="v">42.30 USDT</span></div><p style="margin-top:12px">캐시백으로 빙고를 완성하세요.</p><div class="bingo">${cells.map((x,i)=>`<span class="${on.includes(i)?'on':''}">${x}</span>`).join('')}</div><p class="sb">보드 리워드는 이벤트 리워드로 참여 지갑에 적립되며, 보드 리워드만으로는 출금할 수 없어요.</p><p class="muted" style="margin-top:12px">매일 ${v22Clock('12:30')} 업데이트</p></section></div>`;
}
function v22Funnel(step){
 const bar=`<div class="v22-steps">${['Landing','Choose platform','Trading profile','Calculating','What You\'re Missing Out On','Summary'].map((s,i)=>`<span class="${[0,1,2,4,5][step]>=i?'on':''}">${s}</span>`).join('')}</div>`;
 const p=pBy(state.partner).type==='DEX'?pBy(state.partner):pBy('edgex');
 const dexes=partnerList('ALL').filter(x=>x.id!=='lighter');
 let body='';
 if(step===0)body=`<section class="c v22-center"><h2>You're paying too many fees.</h2><p>See how much cashback you're missing out on, across exchanges, DEXs and brokers.</p><div class="c flat"><b>Did you know?</b><p class="sb">1,284 of our users earn an average of 37.20 USDT in cashback per month.</p></div>${v22Btn('Start Cashback Preview','','data-go="pbk/P2"')}</section>`;
 if(step===1)body=`<section class="c"><h2>${T('First, where do you trade most?','먼저, 가장 자주 사용하는 거래소는 어디인가요?')}</h2><div class="tabs"><span class="on">전체</span><span>CEX</span><span>DEX</span></div><div class="v22-tiles">${dexes.map(x=>`<div class="c flat ${x.id===p.id?'selected':''}"><span class="ava">${esc(x.name.slice(0,1))}</span><b>${esc(x.name)}</b><span class="sb">${T(x.rate+'% Cashback','최종 캐시백률 '+x.rate+'%')}</span></div>`).join('')}</div><div class="row2">${v22Btn(T('Back','뒤로'),'sec','data-go="pbk/P1"')}${v22Btn(T('Next','다음'),'','data-go="pbk/P3"')}</div></section>`;
 if(step===2)body=`<section class="c"><h2>Next, let's check your trading profile.</h2><div class="c flat"><b>What leverage do you usually use?</b><div class="v22-chips">${['1x','5x','10x','20x','50x','100x'].map((x,i)=>`<span class="${i===2?'on':''}">${x}</span>`).join('')}</div></div><div class="c flat"><b>What is your current account balance?</b><span class="sb">USDT</span><div class="v22-chips">${['500','1K','5K','10K','25K','50K'].map((x,i)=>`<span class="${i===2?'on':''}">${x}</span>`).join('')}</div></div><div class="c flat"><b>Order Type Ratio</b><div class="kv"><span class="k">Maker 30%</span><span class="v">Taker 70%</span></div></div><div class="c flat"><b>How often do you trade per day?</b>${[['Rarely','Barely once a day'],['Sometimes','1–2 trades a day'],['Regularly','2–5 trades a day'],['Very Active','5–10 trades a day'],['All Day','10+ trades a day']].map(([t,d],i)=>`<div class="li ${i===2?'selected':''}"><span class="nm">${t}<span class="sb">${d}</span></span></div>`).join('')}</div><div class="row2">${v22Btn(T('Back','뒤로'),'sec','data-go="pbk/P2"')}${v22Btn('Check Results','','data-go="pbk/P4"')}</div></section>`;
 if(step===3)body=`<section class="c v22-center"><h2>What You're Missing Out On</h2><div class="row2"><div class="c flat"><span class="sb">YOUR CASHBACK (USDT)</span><b class="v22-big">Trade with TetherMax +42.00</b></div><div class="c flat"><span class="sb">FEES LOST (USDT)</span><b class="v22-big">Without TetherMax -42.00</b></div></div><details><summary>How we calculated this?</summary><p class="sb">Trading Fees × Cashback Rate = Cashback</p></details>${v22Btn('Next','','data-go="pbk/P5"')}</section>`;
 if(step===4)body=`<section class="c"><h2>You're all set. Here's your summary.</h2><div class="v22-tiles">${[['Platform',p.name],['Account balance','5,000 USDT'],['Leverage','10x'],['Order Type Ratio','Maker 30% · Taker 70%'],['Trading frequency','Regularly']].map(([k,v])=>`<div class="c flat"><span class="sb">${k}</span><b>${esc(v)}</b></div>`).join('')}</div><div class="c flat v22-receipt"><div class="kv"><span class="k">Trading Fees</span><span class="v">210.00 USDT/mo</span></div><div class="kv"><span class="k">× Cashback Rate</span><span class="v">×${p.rate}%</span></div><div class="kv big"><span class="k">Cashback</span><span class="v">42.00 USDT/mo*</span></div></div><div class="c flat"><b>Payout Details</b><div class="kv"><span class="k">Schedule</span><span class="v">Daily</span></div><div class="kv"><span class="k">Payout Time</span><span class="v">${v22Clock('00:00')}</span></div><div class="kv"><span class="k">Destination</span><span class="v">TetherMax Account</span></div></div><p class="sb">*Based on paid trading fees. ${esc(p.name)} pays in USDC, shown 1:1 in USDT.</p><div class="row2">${v22Btn('Restart','sec','data-go="pbk/P1"')}${v22Btn('Start '+p.name+' Cashback','')}</div></section>`;
 return `${gnbPC()}${bar}<div class="pg">${body}</div>`;
}

// ---------- 백오피스 화면
function v22AdminOwnership(original){
 const filter=`<div class="v22-filter"><label>Exchange Type <select><option>전체</option><option>CEX</option><option>DEX</option></select></label><label>상태 <select><option>심사 대기</option><option>승인</option><option>거절</option><option>자동 실패</option></select></label></div>`;
 const rows=[['9900690902','Bybit <span class="bdg gy">CEX</span>','<span class="mono">123456789</span>','11. 25. 10:02','<span class="lk">▶ 녹화 재생</span>','심사 대기','07:12'],['9900690760','EdgeX <span class="bdg gy">DEX</span>',`<span class="mono">${SAMPLE_WALLET}</span>`,'11. 25. 10:05','<span class="lk">▶ 녹화 재생</span>','심사 대기','09:48'],['9900690611','ApeX <span class="bdg gy">DEX</span>',`<span class="mono">${SAMPLE_WALLET2}</span>`,'11. 25. 09:20','<span class="lk">▶ 녹화 재생</span>','자동 실패','—']];
 const reasons=['영상 속 주소 불일치','연결 해제·재연결 장면 없음','주소가 다 보이지 않음','다른 DEX','재생 불가','편집된 영상'];
 const decide=v22Box('판정 · EdgeX 지갑',`<p class="sb">관리자 응답이 10분 안에 없으면 자동 실패 처리됩니다.</p><label>거절 사유 <select>${reasons.map(r=>`<option>${r}</option>`).join('')}<option>직접 입력</option></select></label><div class="row2">${v22Btn('승인','')}${v22Btn('거절','o')}</div>`);
 return v22AdminShell(original,'소유 확인 심사',filter+v22Box('신청 목록',v22Tbl(['회원 번호','거래소','UID / 지갑','신청 시각','녹화','상태','남은 시간'],rows))+decide);
}
function v22AdminManual(original){
 const c=state.previewCase||'normal';
 const prelink=c==='prelink',ledger=c!=='noledger',status=c==='approved'?'승인 완료':c==='rejected'?'거절 완료':prelink?'연동 전 잔액 송금 대기':'귀속 확인 대기';
 const rows=[['9900690760','EdgeX <span class="bdg gy">DEX</span>',`<span class="mono">${SAMPLE_WALLET}</span>`,'11. 25. 09:40',status,prelink?'—':'2 / 4회',prelink?'—':ledger?'확인됨':'없음']];
 const act=prelink?v22Note('송금 대기 건은 판정 대상이 아닙니다. 송금 결과로만 끝납니다(성공 = 연동 완료, 실패 = 연동 실패).'):c==='approved'||c==='rejected'?v22Note(`${status} · 처리자 admin_kim · 사유 기록됨`):`<label>확인 근거 또는 거절 사유 (필수)<textarea rows="2"></textarea></label><div class="row2"><button type="button" class="btn" ${ledger?'':'disabled'}>승인</button>${v22Btn('거절','o')}</div>${ledger?'':v22Note('귀속 원장에 없는 지갑은 승인할 수 없습니다.','warn')}`;
 return v22AdminShell(original,'연동 신청 수동관리',`<div class="v22-filter"><label>Exchange Type <select><option>DEX</option><option>CEX</option><option>전체</option></select></label><label>확인 중 사유 <select><option>전체</option><option>귀속 확인 대기</option><option>연동 전 잔액 송금 대기</option></select></label></div>`+v22Box('확인 중 신청',v22Tbl(['회원 번호','거래소','지갑','신청 시각','확인 중 사유','자동 재확인','귀속 원장'],rows))+v22Box('처리',act));
}
function v22AdminPayouts(original){
 const rows=[
  ['WD-1125-0412','Bitget <span class="bdg gy">CEX</span> · UID 123456789','10.00','회원 자동 지급','성공','거래소 처리'],
  ['WD-1125-0412','OKX <span class="bdg gy">CEX</span> · UID 987654321','31.68','회원 자동 지급','실패 · 잔액 복원','거래소 처리'],
  ['WD-1125-0413',`EdgeX <span class="bdg gy">DEX</span> · <span class="mono">${SAMPLE_WALLET}</span>`,'120.00','회원 자동 지급','Sent',`<span class="mono">${v22Short(V22_TX)}</span>`],
  ['WD-1125-0414',`ApeX <span class="bdg gy">DEX</span> · <span class="mono">${SAMPLE_WALLET2}</span>`,'30.00','연동 전 출금','처리 중','—']];
 return v22AdminShell(original,'전체 내역',`<div class="v22-filter"><label>거래소 유형 <select><option>전체</option><option>CEX</option><option>DEX</option></select></label><label>지급 구분 <select><option>전체</option><option>회원 자동 지급</option><option>연동 전 출금</option></select></label></div>`+v22Box('10분 주기 자동 지급 신청',v22Tbl(['신청 번호','계정','금액 (USDT)','지급 구분','상태','지급 증빙'],rows)+`<p class="sb">연동 전 출금은 TP · 초대 리워드 실적 · 첫 출금 혜택을 만들지 않습니다. 실패하면 그 요청이 차감한 잔액으로 복원합니다. 메일은 현행 정책대로 발송합니다.</p>`));
}
function v22AdminGuide(original){
 const p=pBy(state.partner);
 if(p.type!=='DEX')return null;
 const slides=V22_GUIDE.map(([t,b],i)=>`<div class="bx"><h3>슬라이드 ${i+1}</h3><label>제목 (EN)<input value="${esc(t)}"></label><label>제목 (KO)<input placeholder="국문 제목"></label><label>본문 (EN · KO)<textarea rows="2">${esc(b)}</textarea></label><div class="row2"><div class="ph">KO 이미지</div><div class="ph">EN 이미지</div></div></div>`).join('');
 return v22AdminShell(original,'거래소 가이드',`<div class="v22-filter"><label>거래소 <select>${partnerOptions(state.partner)}</select></label><label>디바이스 <select><option>모바일</option><option>PC</option></select></label></div>`+v22Box('UID 소유권 확인 · '+p.name+' 지갑 녹화 가이드 (3단계)',slides+v22Note('필수 언어(EN·KO)에서 이미지가 빠진 단계가 있으면 이 거래소의 가이드를 게시할 수 없습니다.','warn')));
}
function v22AdminNew(k){
 const id=k.split('/')[1];
 if(id==='REC')return v22AdminShell(null,'DEX Cashback Records',`<div class="v22-filter"><label>DEX <select><option>전체</option><option>ApeX</option><option>EdgeX</option><option>Aster</option></select></label><label>상태 <select><option>전체</option><option>적립</option><option>미연동 보관</option><option>연동 전 출금</option><option>거부</option></select></label><label>기간 (UTC) <input value="2026-11-01 ~ 2026-11-24"></label></div>`+v22Box('원장 레코드',v22Tbl(['거래일 (UTC)','DEX','지갑','원장 ID','커미션 (원통화)','캐시백 (USDT)','상태','사유 · 회원'],[
  ['2026-11-23','EdgeX',`<span class="mono">${SAMPLE_WALLET}</span>`,'edx-88213','3.10 USDC','2.48','적립','TUID 9900690902'],
  ['2026-11-23','Aster',`<span class="mono">${SAMPLE_WALLET2}</span>`,'ast-55102','1.20 USDT','0.96','미연동 보관','—'],
  ['2026-11-22','ApeX',`<span class="mono">${V22_WALLET_UNKNOWN}</span>`,'apx-10931','15.00 USDT','12.00','연동 전 출금','TUID 9900690760'],
  ['2026-11-22','ApeX','<span class="mono">0x0f4E8a1c3B5d7E9f2A4c6E8b0D2f4A6c8E0a77a1</span>','apx-10932','0.80 USDT','—','거부','레퍼럴 코드 없음']])+`<p class="sb">미연동 보관 금액은 만료 없이 보관하고, 그 지갑에 연동 신청이 들어오면 연동 전 잔액으로 처리합니다. 미매칭 큐·운영자 매칭 액션은 없습니다.</p>`)+v22Box('정정',`<div class="row2">${v22Btn('정정 레코드 추가','o')}${v22Btn('CSV 내보내기','o')}</div>`));
 if(id==='AUD')return v22AdminShell(null,'연동 감사 로그',`<div class="v22-filter"><label>행위자 <select><option>전체</option><option>회원</option><option>운영자</option><option>System</option></select></label><label>행위 <select><option>전체</option><option>연동 신청</option><option>연동 완료</option><option>운영자 승인·거절</option><option>소유권 이전</option><option>운영자 해제</option></select></label></div>`+v22Box('로그',v22Tbl(['시각 (UTC)','행위자','행위','거래소','지갑','이전 → 새 값','사유'],[
  ['2026-11-25 01:10:22','System','자동 재확인 · 귀속 확정','EdgeX',`<span class="mono">${SAMPLE_WALLET}</span>`,'확인 중 → 연동 완료','—'],
  ['2026-11-25 00:52:03','admin_kim','운영자 승인','Aster',`<span class="mono">${SAMPLE_WALLET2}</span>`,'확인 중 → 연동 완료','원장 2026-11-24 행 확인'],
  ['2026-11-24 14:03:41','admin_lee','소유권 이전 승인','ApeX',`<span class="mono">${V22_WALLET_UNKNOWN}</span>`,'TUID 9900690611 → 9900690760','녹화 확인']])+`<p class="sb">감사 기록은 수정·삭제할 수 없습니다.</p>`));
 if(id==='RPT')return v22AdminShell(null,'DEX 리포팅',v22Box('DEX 요약 (2026-11)',v22Tbl(['DEX','연동 지갑','적립 캐시백 (USDT)','Paid (USDT)','미연동 보관 (건 · USDT)','수집 상태'],[['ApeX','412','8,214.20','6,930.00','38 · 211.40','LIVE'],['EdgeX','298','5,102.88','4,410.12','21 · 96.30','LIVE'],['Aster','187','3,880.50','3,120.00','17 · 84.10','DEGRADED'],['Lighter','212','3,410.20','2,960.80','14 · 61.40','LIVE']])+`<p class="sb">USDC 정산 DEX의 커미션은 원통화와 USDT 환산값을 함께 표시합니다. Aster 월 상한 소진율 리포트는 회신 대기입니다.</p>`));
 if(id==='BST')return v22AdminShell(null,'Account > Boost',v22Box('부스트 적용 거래소',v22Tbl(['거래소','유형','부스트율','기간','대상','관리'],[['Bybit','CEX','55%','3주','신규 UID',v22Btn('수정','o sm')],['Gate.io','CEX','50%','3주','신규 UID',v22Btn('수정','o sm')],['EdgeX','DEX','—','—','신규 지갑',v22Btn('수정','o sm')]])+`<p class="sb">DEX 선택 가능. DEX의 부스트 적용 방식과 화면 표시는 결정 후 입력합니다. Bitget Boost는 Bitget 전용 메뉴 그대로입니다.</p>`));
 if(id==='CHS')return v22AdminShell(null,'챌린지 현황',v22Box('신규·기존 회원 캐시백 챌린지',v22Tbl(['TUID','챌린지','게이지 (USDT)','수령 계정','레벨','상태'],[['9900690902','신규 회원 (90일)','182.40','Bitget · UID 123456789','Level 1 수령','진행 중'],['9900690760','기존 회원','620.10',`EdgeX · <span class="mono">${SAMPLE_WALLET}</span>`,'Level 2 수령 가능','진행 중']])+`<p class="sb">게이지는 CEX·DEX 커미션 캐시백 합산. 이벤트·초대 리워드는 제외합니다.</p>`));
 if(id==='QZ')return v22AdminShell(null,'퀴즈 설정',v22Box('퀴즈 이벤트 설정',`<label>거래소 (등록 후 수정 불가)<select>${partnerOptions('edgex')}</select></label>${v22Tbl(['점수','보상 금액 (USDT)'],[['0점','<input value="">'],['1점','<input value="">'],['2점','<input value="">']])}<p class="sb">보상은 현행 Beginner's Guide 퀴즈 방식 — 정답 시 퀴즈 쿠폰 발급, 지정 거래소 계정에서 사용하면 이벤트 리워드로 적립합니다.</p>${v22Btn('저장','')}`));
 return null;
}

// ---------- renderPage
function v22Render(k,original){
 if(V22_REG[k])return V22_REG[k].render(state.previewCase||'normal',original);
 if(MODE==='user'){
  if(k==='own/O1')return v22OwnInUse();
  if(k==='own/O2')return v22OwnCooldown();
  if(k==='own/O3')return v22OwnPage();
  if(k==='own/O10')return v22OwnConfirm();
  if(k==='own/O11')return v22OwnHome();
  if(k==='own/O14')return v22OwnDisplaced();
  if(k==='link/PRELINK')return v22Prelink();
  if(k==='link/PRELINKFAIL')return v22PrelinkFail();
  if(k==='link/L8')return v22Referral();
  if(k==='link/L7')return v22Linked();
  if(['link/L3','link/L10','link/ERROR'].includes(k)&&state.previewCase==='other')return v22OwnInUse();
  if(['link/L3','link/L10','link/ERROR'].includes(k)&&state.previewCase==='referral')return v22Referral();
  if(['link/L3','link/L10','link/ERROR'].includes(k)&&state.previewCase==='pending')return v22Prelink();
  if(k==='wd/DW1')return v22Withdraw(false);
  if(k==='wd/DW0')return v22Withdraw(true);
  if(k==='inv/IF8')return v22Invite();
  if(k==='ch/CH2')return v22ChallengePick();
  if(k==='mb/MB1')return v22Board();
  if(k.startsWith('pbk/'))return v22Funnel(Number(k.slice(-1))-1);
 }else{
  if(k==='ac/AC-2')return v22AdminOwnership(original);
  if(k==='ac/AC-3')return v22AdminManual(original);
  if(k==='pb/PB-1')return v22AdminPayouts(original);
  if(k==='ex/EX-3'){const g=v22AdminGuide(original);if(g)return g}
  if(k.startsWith('dx/'))return v22AdminNew(k);
 }
 return null;
}
const v22BaseRender=renderPage;
renderPage=function(k,original){
 const mine=v22Render(k,original);
 if(mine===null)return v22BaseRender(k,original);
 state.route=k;
 const host=document.createElement('div');host.innerHTML=mine;mountProductModals(host,null,k,true);return host.innerHTML;
};

// ---------- 화면 상태(외부 선택) 보정
const v22BaseControls=externalControls;
externalControls=function(){
 const k=key();
 const regStates=V22_REG[k]&&V22_REG[k].states;
 const mine=regStates?regStates.map(([v,l])=>[v,l]):{
  'own/O3':[['normal','Step 1 · 파일 없음'],['s2','Step 2'],['s3','Step 3'],['uploading','업로드 중'],['uploaded','업로드 완료'],['failed','Upload Failed'],['error','Something Went Wrong']],
  'own/O11':[['normal','심사 중'],['approved','승인'],['rejected','거절']],
  'own/O14':[['normal','해제 행'],['reclaim','재청구 다이얼로그'],['rejected','재청구 거절 · 사유']],
  'wd/DW1':[['normal','정상'],['deducted','선차감 반영'],['loading','로딩'],['delayed','데이터 지연'],['partner','파트너 오류']],
  'wd/DW0':[['normal','전부 불가']],
  'ac/AC-3':[['normal','귀속 확인 대기 · 원장 있음'],['noledger','귀속 확인 대기 · 원장 없음'],['prelink','연동 전 잔액 송금 대기'],['approved','승인 완료'],['rejected','거절 완료']]
 }[k];
 if(!mine){v22BaseControls();
  const sel=document.getElementById('design-state');
  if(sel&&['link/L3','link/L10','link/ERROR'].includes(k)){for(const o of Array.from(sel.options)){if(o.value==='repeat'||o.value==='manual')o.remove();if(o.value==='pending')o.textContent='연동 전 잔액 출금 중';if(o.value==='referral')o.textContent='레퍼럴 아님';if(o.value==='other')o.textContent='다른 회원의 지갑 (소유권 인증)'}}
  if(sel&&k==='home/S4'){for(const o of Array.from(sel.options))if(o.value==='guest')o.textContent='비로그인 (공개 화면)'}
  if(sel&&k==='home/LKD'){for(const o of Array.from(sel.options))if(o.value==='processing')o.textContent='연동 확인 중'}
  return;}
 const prior=document.getElementById('design-states');if(prior)prior.remove();
 const box=document.createElement('div');box.id='design-states';box.className='design-states';
 box.innerHTML=`<label for="design-state">화면 상태</label><select id="design-state" data-preview-state>${options(mine,state.previewCase||'normal')}</select>`;
 document.getElementById('intro').after(box);
};

const v22BaseSelect=selectPreview;
selectPreview=function(value){
 const k=key();
 if(MODE==='user'&&['link/L3','link/L10','link/ERROR'].includes(k)&&['other','referral','pending'].includes(value)){state.previewCase=value;state.error='';state.notice='';state.linkScenario='normal';render();return}
 return v22BaseSelect(value);
};

// ---------- 렌더 결과 다듬기 (용어 · 지갑 표시 · 출금 버튼 · 정책 문구)
const V22_TEXT_USER=[
 ['UID 연동하고 페이백 받기','CEX UID 연동하고 캐시백 받기'],['거래소 UID 연동하기','CEX UID 연동하고 캐시백 받기'],
 ['UID를 연동하고 페이백을 받기 시작하면 3 USDT를 드려요.','CEX UID를 연동하고 캐시백을 받기 시작하면 3 USDT를 드려요.'],
 ['CEX 전용 보상입니다. DEX 지갑 연동은 이 보상 대상에 포함되지 않습니다.','DEX 지갑 연동은 이 보상 대상이 아닙니다.'],
 ['첫 페이백 받기 — 10 USDT','첫 캐시백을 출금하고 10 USDT 쿠폰을 받으세요.'],
 ['페이백 목표를 달성하세요!','캐시백 목표를 달성하세요!'],
 ['CEX 전용 챌린지입니다. DEX 페이백은 진행률에 포함되지 않으며 DEX 계정으로 보상을 받을 수 없습니다.',''],
 ['2026.10.23 · 현지 날짜','2026.10.23'],
 ['커미션 페이백 · 환산 소액','캐시백'],['커미션 페이백 적립','캐시백'],['일반 이벤트 리워드 적립','이벤트 리워드'],
 ['회원가입 없이도, 페이백 받을 수 있어요',''],
 ['레퍼럴 귀속 기간 365일','거래 계정 연동'],
 ['TVL · 24H 거래량: 파트너 데이터 확인 중','TVL · 24H 거래량 · DefiLlama'],
 ['사용할 계정 선택','이 쿠폰을 적용할 계정을 선택하세요'],
 ['초대 리워드를 받을 계정 선택','초대 리워드 · 관리자가 지정한 계정으로 자동 지급'],
 ['페이백률','캐시백률'],['페이백','캐시백'],['Payback','Cashback'],['payback','cashback']
];
const V22_TEXT_ADMIN=[
 ['페이백율 (%)','캐시백율 (%)'],['페이백 챌린지 · CEX 전용','캐시백 챌린지 · CEX/DEX'],['UID 소유권 확인 · CEX 전용','UID 소유권 확인'],
 ['일별 원장 확보가 확인되지 않아 맥스보드를 운영할 수 없습니다. 금액 칸만 운영하는 방식도 적용하지 않습니다.','Lighter도 일 1회 원장이라 다른 DEX와 같이 빙고판을 만들 수 있습니다(G-428).'],
 ['DEX에는 소유권 심사 대상이 없습니다. 수동 연동 승인은 별도 화면에서 진행합니다.',''],
 ['한국어와 영문을 한 화면에서 같이 입력합니다.','언어 매트릭스(EN·KO 필수, RU·ID 선택) 기준으로 입력합니다.'],['입력은 두 언어를 함께 저장합니다.','입력은 언어별로 저장합니다.'],['한국어·영문 동시 입력','언어 매트릭스']
];
function v22Text(root){
 const pairs=MODE==='user'?V22_TEXT_USER:V22_TEXT_ADMIN,tails=v22Wallets();
 const k=key(),feed=['home/PUBLIC','etc/FEED','etc/ABOUT'].includes(k);
 const walk=document.createTreeWalker(root,4);const nodes=[];let n;while(n=walk.nextNode())if(!n.parentElement.closest('script,style,textarea'))nodes.push(n);
 for(const node of nodes){let t=node.textContent,o=t;
  for(const [a,b] of pairs)if(t.includes(a))t=t.split(a).join(b);
  t=t.replace(/\*\*\*\*([0-9A-Fa-f]{4})\b/g,(m,tail)=>{const full=tails[tail.toLowerCase()];if(!full)return m;return MODE==='admin'||feed?full:v22Short(full)});
  t=t.replace(/(\S+)\s*·\s*전체 주소 보기/g,'$1');
  if(MODE==='user'){t=t.replace('랭킹은 매일 00:01에 갱신돼요',`랭킹은 매일 ${v22Clock('00:01')}에 갱신돼요`).replace('매일 13:00 (UTC)에 캐시백 내역이 업데이트 돼요',`캐시백 내역은 매일 ${v22Clock('13:00')}에 업데이트됩니다`).replace(/ · 현지 시간$/,'')}
  if(t!==o)node.textContent=t;}
 // 빈 문단·안내 정리
 root.querySelectorAll('.note,p,.sb').forEach(el=>{if(!el.textContent.trim()&&!el.children.length)el.remove()});
}
function v22Buttons(root){
 if(MODE!=='user')return;
 root.querySelectorAll('button,.btn,[data-go],[data-action]').forEach(el=>{
  const t=el.textContent.trim();
  if(!['출금하기','Withdraw','리워드 출금','Claim'].includes(t))return;
  if(/^H[1-6]$/.test(el.tagName))return;
  const b=document.createElement('button');b.type='button';b.className='btn v22-auto';b.disabled=true;b.setAttribute('aria-disabled','true');b.textContent='Auto Claim';el.replaceWith(b);
 });
}
function v22Screens(root){
 const k=key();
 if(MODE==='user'){
  if(k==='etc/BST'){const list=root.querySelector('.c');if(list&&!list.querySelector('.v22-dexrow')){const a=v22Dex(),p=pBy(a.partner);list.insertAdjacentHTML('beforeend',`<div class="li v22-dexrow"><span class="ava">${esc(p.name.slice(0,1))}</span><span class="nm">${esc(p.name)} <span class="bdg gy">DEX</span><span class="sb">타 플랫폼 — · 공식 파트너 ${p.rate}%</span></span><span class="am" style="color:var(--primary)">🚀 <span class="v22-tbd">[DEX 부스트 요율·표시 — 미정 G-430 · G-431]</span></span></div>`)}
   root.querySelectorAll('p').forEach(el=>{if(el.textContent.includes('3주 동안 더 높은'))el.textContent='3주 동안 더 높은 캐시백률로 거래할 수 있는 특별 혜택이에요.'})}
  if(k==='exd/D1'&&state.partner!=='lighter'){root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&/Standard 계정은|Premium과 Plus 계정에/.test(el.textContent))el.remove()})}
  if(k==='hist/CS3'){root.querySelectorAll('*').forEach(el=>{if(el.children.length===0){if(/^Lighter · /.test(el.textContent))el.textContent=el.textContent.replace('Lighter · ','EdgeX · ');}});root.querySelectorAll('.ava').forEach(el=>{if(el.textContent.trim()==='L')el.textContent='E'})}
  if(k==='rk/RK2'){root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&el.textContent.trim()==='Lighter')el.textContent='ApeX'});root.querySelectorAll('.ava').forEach(el=>{if(el.textContent.trim()==='L')el.textContent='A'})}
  if(k==='exd/D1'&&state.partner!=='lighter'){const p=pBy(state.partner),fee=v=>v.toFixed(4)+'%';root.querySelectorAll('*').forEach(el=>{if(el.children.length)return;const t=el.textContent.trim();if(t==='Premium'||t==='Plus')el.remove();else if(t==='0.0280%')el.textContent=fee(p.fee);else if(t==='0.0224%')el.textContent=fee(p.fee*(1-p.rate/100));else if(t==='0.0040%'||t==='0.0032%')el.textContent='—'})}
  if(k==='home/LKD'){root.querySelectorAll('*').forEach(el=>{if(el.children.length===0&&el.textContent.trim()==='신청 가능한 캐시백')el.textContent='출금 가능 캐시백';if(el.children.length===0&&el.textContent.trim()==='신청 가능한 페이백')el.textContent='출금 가능 캐시백'})}
  if(k==='cp/CP1'){const h=root.querySelector('.dlg h3');if(h&&!root.querySelector('.v22-once')){h.insertAdjacentHTML('afterend','<p class="sb v22-once">한 번 적용하면 변경할 수 없습니다.</p>')}}
  root.querySelectorAll('a,span,li,div').forEach(el=>{if(el.children.length===0&&['페이백 신청','캐시백 신청'].includes(el.textContent.trim()))el.remove()});
  if(k==='link/L0'||k==='link/L1'){root.querySelectorAll('.li,.c').forEach(el=>{if(el.children.length&&/^L\s*Lighter/.test(el.textContent.trim())){const sb=el.querySelector('.sb');if(sb)sb.textContent=sb.textContent}})}
 }else{
  const side=Array.from(root.querySelectorAll('*')).find(el=>el.children.length>3&&el.textContent.includes('프리로그인 랜딩 페이지')&&el.textContent.includes('리그/보드')&&!el.querySelector('.ct'));
  if(side){const w=document.createTreeWalker(side,4);let n;while(n=w.nextNode()){const t=n.textContent.trim();if(t==='UID')n.textContent=n.textContent.replace('UID','Account');else if(t==='UID 리스트')n.textContent=n.textContent.replace('UID 리스트','계정 리스트')}}
  if(k==='ex/EX-2'&&pBy(state.partner).type==='DEX')root.querySelectorAll('button,.btn,a,span').forEach(el=>{if(el.textContent.trim()==='페이백 엑셀 업로드')el.remove()});
  if(k==='iv/IV-1'){}
  if(k==='nw/NW-1'&&!root.querySelector('.v22-default')){const ct=root.querySelector('.ct');const first=ct&&ct.querySelector('.bx,section,.c');const html=`<section class="bx v22-default"><h2>탭별 기본 거래소 · 파트너별 거래량</h2><div class="tabs"><span>CEX</span><span class="on">DEX</span></div><label>Default Exchange (필수 · 활성 파트너만)<select>${partnerList('DEX').filter(p=>p.id!=='lighter').map(p=>`<option ${p.id==='edgex'?'selected':''}>${esc(p.name)}</option>`).join('')}</select></label>${v22Tbl(['파트너','최소 월 거래량','최대 월 거래량','기본 선택 거래량','눈금'],partnerList('DEX').filter(p=>p.id!=='lighter').map(p=>[esc(p.name),'<input value="1,000">','<input value="250,000">','<input value="100,000">','<input value="1K, 50K, 100K, 250K">']))}${v22LangMatrix()}</section>`;if(first)first.insertAdjacentHTML('beforebegin',html);else if(ct)ct.insertAdjacentHTML('beforeend',html)}
  if(['nw/NW-2','nw/NW-3'].includes(k)&&!root.querySelector('.v22-lang')){const ct=root.querySelector('.ct');const first=ct&&ct.querySelector('.bx,section,.c');const html=`<section class="bx">${v22LangMatrix()}</section>`;if(first)first.insertAdjacentHTML('beforebegin',html)}
  root.querySelectorAll('p,div,span').forEach(el=>{if(el.children.length===0&&el.textContent.trim()==='한국어와 영문을 한 화면에서 같이 입력합니다.')el.textContent='언어 매트릭스: EN·KO 필수, RU·ID 선택. 필수 필드가 빈 언어가 있으면 저장할 수 없습니다.'});
 }
}
function v22LangMatrix(){return `<div class="v22-lang"><h3>Language</h3>${v22Tbl(['언어','Content Created','관리'],[['English','필수','Edit'],['Korean','필수','Edit'],['Russian','—','Edit · Remove'],['Indonesian','—','Edit · Remove']])}<span class="sb">Add — 아직 없는 언어만 추가할 수 있어요. English·Korean은 삭제할 수 없습니다.</span></div>`}
const v22BaseRefine=refineRendered;
refineRendered=function(root){v22BaseRefine(root);v22Screens(root);v22Text(root);v22Buttons(root)};

// ---------- stage: 기본 거래소 · 버전 표기 · 메뉴 라벨
const v22BaseStage=stage;let v22Last='';
stage=function(){
 const k=key(),fresh=k!==v22Last;v22Last=k;
 if(fresh&&['hub/H1-DEX','pbk/P2','pbk/P5','ac/AC-3','ex/EX-3','bd/LG-2'].includes(k)&&(pBy(state.partner).type!=='DEX'||state.partner==='lighter'))state.partner='edgex';
 if(fresh&&MODE==='user'&&k==='exd/D1'&&state.partner==='lighter')state.partner='edgex';
 v22BaseStage();
 const tag=document.querySelector('.pb-tag');if(tag)tag.textContent=V22_LABEL;
 for(const el of document.querySelectorAll('#g1 button,#g2 button'))if(/페이백/.test(el.textContent))el.textContent=el.textContent.replace(/페이백/g,'캐시백');
};

// ---------- 변경점 표시: 지난 정책 문구 교체 + V2.2 항목 추가
const V22_NOTE_FIX=[
 ['만료일로 표시합니다',null],['신청 성공 상태입니다',null],['지급 완료가 아니라 출금 신청 성공 후',null],
 ['식별자는 뒤 4자리만 공개','CEX·DEX의 자동 지급 완료 건을 같은 피드에 시간순으로 표시합니다. DEX 지갑은 전체 주소, CEX UID는 기존 마스킹, 시각은 현지 시간(8-2, G-411).'],
 ['뒤 4자리만 남겨 마스킹','CEX는 UID(기존 마스킹), DEX는 지갑 주소 전체를 표시합니다. 좁은 자리만 앞 6 + … + 뒤 4로 줄입니다(#37).'],
 ['Lighter Standard도 연동할 수 있으며','DEX는 UID 대신 지갑 주소를 입력합니다. Lighter Standard도 연동할 수 있습니다(경고·차단 없음).'],
 ['UID·KYC·지갑 서명·소유권 인증을 추가로 요구하지 않습니다','DEX 연동은 지갑 주소만 입력합니다(UID·KYC·지갑 서명 없음). 다른 회원이 이미 연동한 지갑은 소유권 인증으로 되찾습니다(5-10).'],
 ['DEX에 별도 소유권 인증 단계를 추가하지 않습니다','연동 성공 화면에 정산 주기 배지와 다음 업데이트 시각(로컬)을 표시합니다. DEX 첫 연동은 3 USDT 쿠폰 안내가 없습니다(REQ-095 · 097).'],
 ['가입 경로 확인과 고객센터 안내를 제공합니다','본문은 REQ-088 원문. 영구 거부라 재시도를 권하지 않습니다. 제목 분리·`Join {DEX}` 버튼은 미정(G-092).'],
 ['다른 회원에 연동된 지갑은 고객센터로 안내합니다','Wallet Already in Use — Try a different wallet · Verify Ownership + Need help? Contact Support(5-10, OWN-1).'],
 ['테더맥스의 공통 출금 버튼을 사용합니다','10분 주기 자동 지급. 버튼은 비활성 Auto Claim이며 보안 제한(72h/24h)은 자동 지급에 걸지 않습니다. 처리 중·완료·실패를 보여 주는 회원 화면은 없습니다(6-1).'],
 ['선택한 DEX의 설명·요율·거래 조건을 표시합니다. Lighter Standard','선택한 DEX의 설명·요율·거래 조건을 표시합니다. 요율은 거래소 레코드 값입니다.'],
 ['DEX 페이백은 챌린지 진행률에 포함하지 않으며','DEX 지갑의 커미션 캐시백도 게이지에 산입합니다(8-17). DEX 원장 반영 시점은 미정(G-429).'],
 ['챌린지 수령 목록에는 CEX 계정만','수령 계정 선택에 DEX 그룹·지갑 행을 둡니다. 한 번 고르면 변경할 수 없습니다(8-17).'],
 ['DEX도 지원 조건에 따라 참여합니다. Lighter는 일별 원장','DEX 4곳 보드를 운영합니다(Lighter 포함, G-428). 사용자는 거래소를 고르지 않고 어드민이 등록한 빙고판을 봅니다(REQ-634).'],
 ['일반 회원 초대 리워드 출금에 DEX 계정도 선택할 수 있습니다','초대 리워드도 자동 지급합니다. 받을 계정은 관리자가 지정하며 회원 화면에 계정 선택이 없습니다(REQ-414 · 417).'],
 ['일반 이벤트 쿠폰의 수령 계정에 DEX를 포함합니다','일반 이벤트·챌린지 쿠폰을 DEX 지갑에도 적용합니다. LINK UID 쿠폰도 DEX 지갑에 적용 가능(발급만 CEX 첫 연동). 확인 중 지갑은 목록에서 제외(REQ-403).'],
 ['부스트는 CEX 전용으로 유지','DEX를 부스트 거래소 목록에 넣습니다(8-18). DEX 적용 방식 G-430 · DEX 행 표시 G-431 미정.'],
 ['소유권 확인 가이드는 CEX 전용입니다','DEX도 소유권 녹화 가이드(3단계)를 둡니다. 필수 언어에서 빠진 단계가 있으면 게시 불가. 형식 미정(G-432).'],
 ['UID 연동 3 USDT·챌린지와 같은 CEX 전용 보상은','일반 거래소 이벤트 관리에 DEX도 포함합니다. UID 연동 3 USDT 같은 CEX 전용 보상은 별도 대상 제한을 유지합니다.'],
 ['DEX에 KYC·소유권 확인 가이드를 만들지 않습니다','UID 찾기 대신 지갑 주소 찾기 콘텐츠를 관리합니다. KYC 섹션은 DEX에서 숨깁니다. 소유권 녹화 가이드는 소유권 확인 가이드 화면에서 관리합니다.'],
 ['소유권 확인 심사는 CEX 전용입니다','소유 확인 심사에 DEX 지갑 신청을 포함합니다. 관리자 응답 10분 없으면 자동 실패(기존 CEX), 거절 사유 필수(REQ-565).'],
 ['귀속 원장 없이 승인하지 않으며 소유권 인증으로 대체하지 않습니다','귀속 원장 없이 승인하지 않습니다. 확인 중은 귀속 확인 대기 / 연동 전 잔액 송금 대기로 나눠 표시하며, 송금 대기는 판정 대상이 아닙니다(REQ-555 · 722). 자동 재확인 15분 × 4회 뒤 운영 Slack.'],
 ['일반 이벤트 리워드는 CEX·DEX 지원, UID 연동 3 USDT·챌린지는 CEX 전용','일반 이벤트 리워드·챌린지는 CEX·DEX, UID 연동 3 USDT만 CEX 전용입니다(REQ-593).'],
 ['Lighter는 일별 원장이 확보되지 않으면 운영하지 않습니다. 업데이트는','DEX 4곳 보드를 운영합니다(Lighter 포함, G-428). Batch 12:30 UTC, 사용자에게는 현지 시각.']
];
const V22_NOTES={
 'own/O1':['.dlg','소유권 인증 진입','원문 OWN-1. 다른 회원이 이미 연동한 지갑을 실제 주인이 되찾는 경로(5-10, REQ-723).'],
 'own/O2':['.dlg','30일 쿨다운','그 지갑의 마지막 소유권 승인 시각부터 30일. 신청을 만들지 않음(REQ-724).'],
 'own/O3':['.v22-own','녹화 가이드 · 업로드','3단계 가이드(OWN-3)는 DEX별 백오피스 작성, 형식 미정(G-432). MP4·MOV 최대 1GB. 업로드 완료 전 Submit Claim 비활성(REQ-725 · 726).'],
 'own/O10':['.dlg','제출 확인','Cancel하면 파일 유지. 중복 제출 방지(REQ-727).'],
 'own/O11':['.c:last-of-type','심사 상태','처리 중 = 소유 확인중(우선순위 1) + 경과 시간. 관리자 응답 10분 없으면 자동 실패(기존 CEX). 승인 시 지갑 이전(REQ-728 · 729).'],
 'own/O14':['.c:last-of-type','이전 보유자','소유권 이전으로 해제된 행. Remove Wallet은 이 행에만 있음(셀프 해제 아님). FCM 24 발송. 잔액 처리 G-433(REQ-729 · 730).'],
 'link/PRELINK':['.dlg','연동 전 잔액 출금','연동 전 잔액이 10 USDT 이상이면 그 지갑으로 먼저 출금한 뒤 자동 연동. 출금 중엔 확인 중(송금 대기). 안내 문구 미정(G-426)(5-6, REQ-107 · 722).'],
 'link/PRELINKFAIL':['.dlg','출금 실패 = 연동 실패','금액은 연동 전 잔액으로 복원, 다시 신청 가능. 문구 미정(G-426)(5-6 ⑧).'],
 'link/L7':['.dlg','정산 카드','지갑 주소 전체 · Daily 배지(DEX 4곳 일 1회) · 다음 업데이트 로컬 시각(REQ-095).'],
 'link/L8':['.dlg','레퍼럴 아님','REQ-088 원문. 제목 분리 미정(G-092).'],
 'wd/DW1':['.v22-wd','표시 전용 출금 화면','카드 = 식별자(DEX 지갑 전체) · Available/Unavailable · 금액. 결과 표시 없음. 선차감 사유 문구 영문 미정. 네트워크 예시값(체인 G-044)(A-23 · A-27).'],
 'wd/DW0':['.v22-wd','전부 불가','합계 0.00 + 한 줄 사유 + 매칭 안내(6-1).'],
 'home/LKD':['.pg','지갑 상세','출금 버튼은 비활성 Auto Claim. 타임라인의 「최대 1시간 차이」 문구는 DEX 기준으로 다시 써야 함(문구 미정, 7장).'],
 'pbk/P1':['.c','/payback 퍼널','허브와 별개 퍼널. 사용자 수가 없으면 Did you know 카드를 숨김(REQ-453 · 454).'],
 'pbk/P5':['.c','Summary','Destination = TetherMax Account. 각주는 DEX별 원문(REQ-459 · 462). Lighter 포함(G-428).'],
 'inv/IF8':['.c','초대 리워드 자동 지급','회원 화면에 계정 선택 없음. 실패 시 초대 리워드 잔액으로 복원(REQ-414 · 416).'],
 'ch/CH2':['.dlg','DEX 수령 계정','챌린지 DEX 포함(8-17, REQ-438).'],
 'mb/MB1':['.c','DEX 보드','어드민이 등록한 빙고판. 거래소 선택 없음. DEX 보드 라벨은 지갑(REQ-634 · 603).'],
 'etc/BST':['.v22-dexrow','DEX 부스트 행','적용 방식 G-430 · 표시 G-431 미정(8-18).'],
 'ac/AC-2':['.bx','소유 확인 심사 DEX','Exchange Type 필터 · 영상 플레이어 DEX · 10분 자동 실패 · 표준 거절 사유(5-10, API-137).'],
 'ac/AC-3':['.bx','확인 중 사유 분리','귀속 확인 대기 / 연동 전 잔액 송금 대기(REQ-722). 기존 연동 신청 수동관리 화면 확장(9-4).'],
 'pb/PB-1':['.bx','자동 지급 내역','지급 구분 MEMBER_AUTO / PRELINK · DEX tx 해시 · 실패 시 차감한 잔액으로 복원(JOB-D10).'],
 'nw/NW-1':['.v22-default','기본 거래소 · 파트너별 범위','Default Exchange는 활성 파트너만(REQ-295). 언어 매트릭스(G-261).'],
 'dx/REC':['.bx','DEX Cashback Records','미연동 보관 · 연동 전 출금 · 거부 + 사유(C-5-4 · C-5-5).'],
 'dx/AUD':['.bx','연동 감사 로그','행위자 System 포함, 수정·삭제 불가(NFR-13).'],
 'dx/RPT':['.bx','DEX 리포팅','Aster 상한 소진율 회신 대기(G-039).'],
 'dx/BST':['.bx','Account > Boost DEX','DEX 선택 가능, 적용 방식 G-430.'],
 'dx/CHS':['.bx','챌린지 현황 DEX','게이지 · 수령 계정에 DEX 지갑(8-17).'],
 'dx/QZ':['.bx','퀴즈 설정','점수 0/1/2 보상 단계(API-136). 금액 G-205.']
};
const v22BaseNotes=currentChangeNotes;
currentChangeNotes=function(root){
 let list=v22BaseNotes(root)||[];
 list=list.map(n=>{const hit=V22_NOTE_FIX.find(([a])=>String(n.body).includes(a)||String(n.title).includes(a));if(!hit)return n;return hit[1]===null?null:{...n,body:hit[1]}}).filter(Boolean).map(n=>({...n,body:String(n.body).replace(/페이백/g,'캐시백'),title:String(n.title).replace(/페이백/g,'캐시백')}));
 const reg=V22_REG[key()];
 if(reg){const host=root.querySelector('.v21-modal-overlay,.v21-member-overlay')||root;const st=(reg.states||[]).find(x=>x[0]===(state.previewCase||'normal'));const el=host.querySelector((reg.note&&reg.note[0])||'.dlg,.c,.bx')||host.firstElementChild;if(el&&!list.some(n=>n.el===el))list.push({el,title:(reg.note&&reg.note[1])||reg.label,body:[(reg.note&&reg.note[2])||'',st&&st[2]?('이 상태: '+st[1]+' — '+st[2]):'',reg.fu?('기능: '+reg.fu.join(' · ')):''].filter(Boolean).join(' / '),kind:'chg'})}
 const spec=V22_NOTES[key()];
 if(spec){const host=root.querySelector('.v21-modal-overlay,.v21-member-overlay')||root;const el=host.querySelector(spec[0]);if(el&&!list.some(n=>n.el===el))list.push({el,title:spec[1],body:spec[2],kind:'chg'})}
 return list;
};
