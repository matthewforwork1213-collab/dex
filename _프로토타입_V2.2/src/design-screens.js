// Design review layer: the preview contains product UI only. Fixture controls live outside it.
const designBaseRender=renderPage,designBaseRefine=refineRendered,designBaseStage=stage,designBaseAction=v21Action;
const PREVIEW_WALLET={id:'guest-preview',partner:'lighter',identifier:SAMPLE_WALLET,cash:42,reward:0,earned:42,paid:0,status:'Active'};
nativeHome=function(){
 if(state.previewCase==='guest')return nativePublic('home/PUBLIC');
 const accounts=state.previewCase==='unlinked'?[]:state.accounts;
 return `${gnbPC()}<div class="pg"><div class="c"><div class="kv big"><span class="k">총 페이백 잔액</span><span class="v">${money(accounts.reduce((s,a)=>s+a.cash,0))} USDT</span></div>${btn('출금하기','nav','wd/DW1','primary',!accounts.some(isWithdrawable))}</div><div class="c"><div class="ch"><h3>연동된 계정</h3>${accounts.length?'<span class="more" data-go="hub/H5">모두 보기</span>':''}</div>${accounts.map(a=>`<div class="li" data-action="account" data-value="${a.id}"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}<span class="sb">${pBy(a.partner).type==='DEX'?'지갑':'UID'} ${esc(mask(a.identifier))}</span></span><span class="am">${money(available(a))}<small>USDT</small></span></div>`).join('')||'<div class="v21-empty">연동된 거래 계정이 없습니다.</div>'}<div class="sb" style="margin-top:11px;color:var(--primary)" data-go="link/L0">⊕ 여러 거래소를 사용 중이신가요? 거래 계정을 추가로 연동하세요</div></div><div class="c"><div class="ch"><h3>회원 전용 혜택</h3><span class="more" data-go="bnf/LIST">모두 보기</span></div><div class="row2"><div class="c flat" data-go="bnf/UIDM"><div class="nm">UID 연동하고 페이백 받기</div><div class="sb">3 USDT · CEX 전용</div></div><div class="c flat" data-go="etc/EVT"><div class="nm">거래소 이벤트</div><div class="sb">이벤트 혜택을 확인하세요</div></div></div></div></div>`;
};
function previewRequest(){return state.request||{id:'WD-20261023-001',guest:state.guest,createdAt:FIXED_NOW,status:'pending',items:(state.guest?[state.guestAccount||PREVIEW_WALLET]:BASE_ACCOUNTS).filter(isWithdrawable).map(a=>({accountId:a.id,partner:a.partner,identifier:a.identifier,amount:available(a),status:'pending'}))}}
function designAccountPicker(invite=false){const accounts=state.accounts.filter(a=>a.status==='Active'),used=!invite&&state.previewCase==='used',selected=state.rewardSelected||'';return `${invite?gnbPC():back(T('My Coupons','내 쿠폰'))}<div class="pg">${invite?'<div class="tabs"><span>TetherMax Point</span><span class="on">친구 초대</span></div><div class="c flat">'+kv('수령 가능한 초대 리워드','50.00 USDT')+'</div>':'<div class="c"><div class="ch"><h3>10 USDT</h3><span class="bdg '+(used?'gy':'ok')+'">'+(used?'사용 완료':'사용 가능')+'</span></div><div class="sb">출금이 가능한 USDT 쿠폰이에요</div></div>'}${used?'':`<div class="dlg"><h3>${invite?'초대 리워드를 받을 계정 선택':'사용할 계정 선택'}</h3><form data-form="${invite?'invite':'reward'}"><input type="hidden" name="kind" value="general"><input type="hidden" name="receiveAccount" value="${esc(selected)}"><div class="c flat">${['CEX','DEX'].map(type=>`<div class="dd-g">${type}</div>${accounts.filter(a=>pBy(a.partner).type===type).map(a=>`<div class="li ${selected===a.id?'selected':''}" role="radio" aria-checked="${selected===a.id}" tabindex="0" data-action="selectRewardAccount" data-value="${a.id}"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}${showIdentifier(a)}</span></div>`).join('')}`).join('')}</div><div class="row2">${btn('취소','nav',invite?'ph/PH1':'bnf/LIST','sec')}<button class="btn" type="submit" ${!selected?'disabled':''}>확인</button></div></form></div>`}</div>`}
function designCompletion(){const r=previewRequest(),first=r.items[0],extra=r.items.length>1?' +'+(r.items.length-1):'';return `<div class="pg" style="padding-top:22px"><div class="dlg"><div class="ico">🧾</div><h3>페이백 출금 신청이 완료되었어요</h3><p>${r.guest?'신청한 페이백의 출금 내역을 확인해 주세요.':'신청한 페이백의 출금 결과는 알림, 이메일로 알려드릴게요!'}</p><div class="c flat">${kv('거래소',esc(pBy(first.partner).name)+extra)}${kv(pBy(first.partner).type==='DEX'?'지갑 주소':'UID',esc(mask(first.identifier))+extra)}${kv('가격',money(r.items.reduce((s,x)=>s+x.amount,0))+' USDT')}${kv('신청시간',shortTime(r.createdAt))}</div><div class="row2">${btn('닫기','nav',r.guest?'home/PUBLIC':'home/S4','sec')}${btn('공유하기','nav','wd/DW3','primary')}</div></div></div>`}
function designShare(){const r=previewRequest(),first=r.items[0],extra=r.items.length>1?' +'+(r.items.length-1):'';return `<div class="pg" style="padding-top:22px"><div class="dlg" style="max-width:300px"><div class="ico">∞</div><h3 style="font-size:23px">${money(r.items.reduce((s,x)=>s+x.amount,0))} USDT 출금을 신청했어요</h3><p>${shortTime(r.createdAt)}</p><div class="c flat">${kv('거래소',esc(pBy(first.partner).name)+extra)}${kv(pBy(first.partner).type==='DEX'?'지갑 주소':'UID',esc(mask(first.identifier))+extra)}</div><div class="c flat"><div class="sb" style="color:var(--primary)">추천인 코드 : 2LZUMN</div><div class="sb">QR 코드를 스캔하여 가입하고 최대 26 USDT를 받으세요</div></div><div class="row2"><button class="btn sec" type="button" data-action="shareDownload">다운로드</button><button class="btn" type="button" data-action="shareCopy">링크 복사</button></div></div></div>`}
function designAccount(){
 const a=clone(state.accounts.find(a=>a.id===state.selectedAccount)||BASE_ACCOUNTS[2]);
 if(state.previewCase==='low'){a.cash=0;a.reward=0}if(state.previewCase==='processing')a.status='Processing';
 const active=isWithdrawable(a),p=pBy(a.partner);
 const timeline=[['거래 시작','10/21','20:00'],['마감 시간','10/22','20:00'],['업데이트','10/22','20:00']];
 return `${gnbPC()}<div class="pg"><div class="row2 account-layout">
  <div class="account-stack">
   <div class="c account-balance">
    <div class="account-heading"><button type="button" class="account-back" data-go="home/S4" aria-label="뒤로">←</button><div class="account-heading-name"><strong>${esc(p.name)}</strong>${showIdentifier(a)}</div><span class="bdg ${a.status==='Active'?'ok':'gy'}">${a.status==='Active'?'활성':'확인 중'}</span></div>
    <div class="account-totals"><div class="kv big"><span class="k">신청 가능한 페이백</span><span class="v">${money(available(a))} <small>USDT</small></span></div>${kv('누적 페이백',money(a.earned)+' USDT')}</div>
    <div class="account-breakdown">${kv('거래소 페이백',money(visibleAmount(a.cash))+' USDT')}${kv('이벤트 리워드',money(visibleAmount(a.reward))+' USDT')}</div>
    <div class="account-progress"><div class="sb">출금 가능 ${money(a.cash)} USDT / ${money(a.reward)} USDT</div><div class="gg" aria-hidden="true"><i style="width:${Math.min(100,available(a)/10*100)}%"></i></div></div>
    ${!active?notice(a.status==='Processing'?'거래 계정 연동을 확인하고 있습니다.':'최소 출금 금액 10 USDT','warn'):''}
    ${btn('출금하기','nav','wd/DW1','primary',!active)}
   </div>
   <div class="c account-timeline"><div class="ch"><h3>페이백 타임라인</h3></div><div class="timeline-grid">${timeline.map(([label,date,time])=>`<div class="timeline-cell"><span>${label}</span><div><span>${date}</span><strong>${time}</strong></div></div>`).join('')}</div><p class="fieldhelp">*업데이트는 최대 1시간까지 차이가 날 수 있습니다</p></div>
  </div>
  <div class="account-stack"><div class="c account-weekly"><div class="ch"><h3>주간 페이백 내역</h3><span class="more" data-go="hist/CS3">전체보기</span></div><div class="week-scroll"><div class="week-strip">${[16,17,18,19,20,21,22].map((day,i)=>`<div class="week-cell"><span>${day}</span><strong>${['+0.42','+0.06','+0.03','+0.05','+0.01','—','—'][i]}</strong></div>`).join('')}</div></div></div>
 </div></div>`;
}
function designLeague(){
 let html=cleanLegacy(ORIGINALS.get('lg/LG1')());const split=html.indexOf('<div class="dlg"');
 html=(split<0?html:html.slice(0,split)).replace('∞ TetherMax × ⬤ Lighter','∞ TetherMax').replace('Next Update: 13:30 UTC','다음 업데이트: '+shortTime('2026-10-23T13:30:00Z'));
 if(!['picker','noaccount'].includes(state.previewCase))return html+'</div>';
 const accounts=state.accounts.filter(a=>a.status==='Active'),selected=state.leagueSelected||'';
 if(state.previewCase==='noaccount')return html+`<div class="dlg"><h3>참가할 수 있는 거래 계정이 없어요</h3><p>리그에 참가하려면 거래 계정을 연동해 주세요.</p>${btn('연동하기','nav','link/L0','primary')}</div></div>`;
 return html+`<div class="dlg"><h3>참가할 계정 선택</h3><p>Dragon Squad에 참가할 계정을 하나 선택하세요.</p><div class="c flat">${accounts.map(a=>`<div class="li ${selected===a.id?'selected':''}" role="radio" aria-checked="${selected===a.id}" tabindex="0" data-action="selectLeagueAccount" data-value="${a.id}"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}${showIdentifier(a)}</span><span class="am">${selected===a.id?'◉':'○'}</span></div>`).join('')}</div><div class="row2">${btn('취소','leagueOverview','','sec')}${btn('확인','leagueConfirm','','primary',!selected)}</div></div></div>`;
}
function designInvitedAccounts(){const accounts=state.member==='9900690902'?state.accounts:[{...BASE_ACCOUNTS[2],partner:'aster',identifier:SAMPLE_WALLET2}];return `<div class="pg"><div class="dlg"><div class="ch"><h3>연동된 계정</h3></div><p class="fieldhelp">TUID ${esc(state.member)} · ${accounts.length}개 계정</p><div class="c flat">${['CEX','DEX'].map(type=>{const list=accounts.filter(a=>pBy(a.partner).type===type);return list.length?`<div class="dd-g">${type}</div>${list.map(a=>`<div class="li"><span class="ava">${esc(pBy(a.partner).name.slice(0,1))}</span><span class="nm">${esc(pBy(a.partner).name)}${showIdentifier(a)}</span><span class="am">${money(visibleAmount(a.cash))}<small>USDT</small></span></div>`).join('')}`:''}).join('')}</div></div></div>`}
function designAdminMemberModal(){
 const background=designBaseRender('mb/MB-1',ORIGINALS.get('mb/MB-1'));
 const rows=state.accounts.map(a=>[accountMarkup(a,true),money(a.cash),money(a.reward),money(available(a))]);
 return `${background}<div class="v21-member-overlay" data-member-backdrop><section class="v21-member-dialog" role="dialog" aria-modal="true" aria-labelledby="member-dialog-title" aria-describedby="member-dialog-account" tabindex="-1"><header class="v21-member-dialog-head"><div><h3 id="member-dialog-title">연동 계정</h3><p id="member-dialog-account">TUID 9900690902</p></div><button type="button" class="v21-member-close" data-action="memberModalClose" aria-label="닫기">×</button></header><div class="v21-member-dialog-body">${table(['거래 계정','남은 페이백','이벤트 리워드','출금 가능'],rows)}</div><footer class="v21-member-dialog-foot">${btn('닫기','memberModalClose','','o')}</footer></section></div>`;
}
// Completion previews do not depend on a previous form or mutate ledger balances.
requestView=designCompletion;
shareView=designShare;
const designWalletForm=walletForm;
walletForm=function(guest=false){return designWalletForm(guest).replace(/<details class="summary">[\s\S]*?<\/details>/g,'').replace('DEX는 지갑 주소만 입력하면 됩니다.','사용 중인 지갑 주소를 입력해 주세요.').replace('기존 CEX는 거래소 UID를 입력합니다.','거래소 UID를 입력해 주세요.').replace('연동 확인 · 시연','연동하기')};
linkResult=function(){const a=state.linked||{...PREVIEW_WALLET,partner:pBy(state.partner).type==='DEX'?state.partner:'lighter',identifier:state.linkAddress||SAMPLE_WALLET};return `<div class="narrow">${card('지갑이 연동되었어요',`<div class="ico">🛡️</div><p>${esc(pBy(a.partner).name)} 지갑 주소가 연동되었어요.</p>${accountMarkup(a)}<div class="actions">${btn('홈으로 돌아가기','nav','home/S4','primary')}</div>`)}</div>`};
// The partner logo marquee belongs to service introduction. The home feed remains on home.
nativePublic=function(k){const about=k==='etc/ABOUT',source=cleanLegacy(ORIGINALS.get('etc/FEED')()),hero=source.match(/<div class="hero">[\s\S]*?<\/div>/)?.[0]||'<div class="hero"><h2>회원가입 없이도, 페이백 받을 수 있어요</h2></div>';return `${gnbGuest()}<div class="pg">${about?'<div class="hero"><h2>지금 이 순간에도<br>페이백을 받아 가고 있어요!</h2><p>24시간 실시간 페이백 출금으로 페이백을 받아요.</p></div>':hero}${about?`<div class="c">${carousel()}</div>`:''}<div class="c"><div class="ch"><h3>최근 출금</h3></div>${feedView()}</div></div>`};
carousel=function(){const ps=partnerList(),v=[...ps.slice(state.carousel%ps.length),...ps.slice(0,state.carousel%ps.length)];return `<h3>공식 파트너 거래소</h3><div class="carousel"><div class="partner-track" id="partner-track">${v.map(p=>`<button class="partner-tile" data-action="partner" data-value="${p.id}"><span class="avatar">${esc(p.name.slice(0,1))}</span><b>${esc(p.name)}</b></button>`).join('')}</div></div>`};
renderPage=function(k,original){
 if(MODE==='admin'&&k==='mb/MB-4')return designAdminMemberModal();
 if(MODE==='user'){
  if(k==='home/LKD')return designAccount();
  if(k==='wd/DW2')return designCompletion();if(k==='wd/DW3')return designShare();
  if(k==='wd/NM'&&!state.guestAccount)state.guestAccount={...PREVIEW_WALLET,partner:pBy(state.partner).type==='DEX'?state.partner:'lighter'};
  if(k==='own/O1')return nativeShell(card('이미 사용 중인 지갑',notice('다른 회원에게 연동된 지갑입니다. 고객센터로 문의해 주세요.','warn')+btn('고객센터 문의','support','','primary')));
  if(k==='link/GUIDE')return nativeShell(card('지갑 주소 찾는 방법',`<p>${esc(pBy(state.partner).name)}의 계정 정보에서 사용 중인 지갑 주소를 복사해 주세요.</p><p>복사한 지갑 주소를 테더맥스의 지갑 주소 입력란에 붙여 넣어 주세요.</p>`));
  if(k==='link/ERROR')return nativeShell(walletForm(false));
  if(k==='inv/IF8')return designAccountPicker(true);
  if(k==='cp/CP1')return designAccountPicker(false);
  if(k==='lg/LG1')return designLeague();
  if(k==='ch/CH1')return cleanLegacy(ORIGINALS.get(k)()).replace(/<\/div>\s*$/,()=>notice('CEX 전용 챌린지입니다. DEX 페이백은 진행률에 포함되지 않으며 DEX 계정으로 보상을 받을 수 없습니다.')+'</div>');
  if(k==='ch/CH2')return cleanLegacy(ORIGINALS.get(k)());
  if(k==='ph/PH3')return designInvitedAccounts();
  if(k==='exd/D2'&&state.previewCase==='empty')return nativeShell(card(esc(pBy(state.partner).name)+' 리뷰','<div class="v21-empty">아직 작성된 리뷰가 없습니다.</div>'));
 }
 return designBaseRender(k,original);
};
// All non-product material is outside #appin/#ad, or in the policy Markdown files.
const removedRoutes=new Set(MODE==='user'?['wd/AUTH','wd/RESULT','rule/R1','rule/R2','own/CMP','own/OWN2','hist/TZ','etc/TERM','etc/EML','etc/PARTNERS','pending/LIST']:['api/MAP','pending/LIST','nw/NW-4']);
for(let i=P.length-1;i>=0;i--){P[i].states=P[i].states.filter(s=>!removedRoutes.has(P[i].id+'/'+s.id));if(!P[i].states.length)P.splice(i,1)}
if(MODE==='user'){
 add('link','GUIDE','지갑 주소 찾는 방법');add('link','ERROR','연동 오류');
 const done=P.find(p=>p.id==='wd').states.find(s=>s.id==='DW2');done.ko=done.en='신청 완료';
 const extra=P.find(p=>p.id==='etc');for(const s of extra.states){if(s.id==='FEED')s.ko=s.en='홈 · 실시간 출금';if(s.id==='ABOUT')s.ko=s.en='서비스 소개'}
 NEXT['wd/DW1']='wd/DW2';NEXT['wd/NM']='wd/DW2';delete NEXT['wd/DW2'];
 for(const f of FLOWS){if(f.id==='wd')f.steps=['home/S4','home/LKD','wd/DW1','wd/DW2','wd/DW3'];if(f.id==='gst')f.steps=['link/E4','wd/NM','wd/DW2'];}
}
const validDesignRoutes=new Set(P.flatMap(p=>p.states.map(s=>p.id+'/'+s.id)));
// Dropdown helper notes and change markers were review annotations, not product content.
for(const o of Object.values(OPT)){delete o.nt;if(o.g)o.g=o.g.map(([label,items])=>[label,items.filter(it=>!/^…/.test(it[0])).map(it=>it[2]==='new'?it.slice(0,2):it)])}
for(const [k,v] of Object.entries(NEXT))if(!validDesignRoutes.has(k)||!validDesignRoutes.has(v))delete NEXT[k];
for(let i=FLOWS.length-1;i>=0;i--){FLOWS[i].steps=FLOWS[i].steps.filter(k=>validDesignRoutes.has(k));if(!FLOWS[i].steps.length)FLOWS.splice(i,1)}
for(const k of Object.keys(GO))GO[k]=GO[k].filter(x=>validDesignRoutes.has(x[2]));
for(const p of P)for(const s of p.states){s.dko='';s.den='';}
// Screen tabs are independent previews. Do not imply a service journey between them.
FLOWS.length=0;
for(const k of Object.keys(NEXT))delete NEXT[k];
flowbar=function(){};
autoWire=function(){};
// Strip developer instructions and preview-only controls, including inherited V3 notes.
const internalCopy=/시연|프로토타입|기존 CEX|기존 화면|기존 명세|이번 작업|이번 범위|사용자 요청|개발 시|개발 대상|원장 정밀도|서버 검증|임의 계산|임의 지정|사업 확인 대상|입력 형식은 기존|실제 계약값|파트너 확인 대기|실제 업로드|실제 게시|미확정|단계별 거래량.*필드|언어팩|CEX·DEX 모두 같은 의미|확정 잔액은 유지됩니다.*협의/;
function cleanDesignRoot(root){
 const ledger=root.querySelector('#ledgerFound');if(ledger){const d=document.createElement('div');d.className='kv';d.innerHTML='<span class="k">귀속 원장</span><span class="v">'+(state.ledgerFound?'확인됨':'없음')+'</span>';ledger.closest('.demo-tag')?.replaceWith(d);}
 root.querySelectorAll('.demo-tag,.v21-status,.doc-h,.icm,.v21-order-controls,[data-kind],.v21-scope-only').forEach(el=>{if(el.matches('.demo-tag,.v21-status,.doc-h,.icm,.v21-order-controls'))el.remove();else{el.removeAttribute('data-kind');el.removeAttribute('title')}});
 const v22Own=typeof V21_READY!=='undefined'&&V21_READY.V22_REG&&V21_READY.V22_REG[key()];
 if(!v22Own)root.querySelectorAll('p,small,.fieldhelp,.note,.sb,.sm,.fnt').forEach(el=>{if((internalCopy.test(el.textContent)||/파트너 수가 현재|변수여야|EDC-26|UID 찾는 방법 대체|자동 표시|현지 시각을 함께|같은 요율을 두 곳|기존 공통 설정값 연결/.test(el.textContent))&&!el.querySelector('input,select,textarea,button,.btn'))el.remove()});
 root.querySelectorAll('button,.btn,[role=button]').forEach(el=>{
  if(el.closest('form[data-form=reward]')&&/계정 확인|수령 계정 확인/.test(el.textContent))el.textContent=key()==='cp/CP1'?'사용하기':'수령하기';
  if(/^(账号列表|계정 목록|지갑 관리 안내|지원 기능 보기|대상 계정 확인|수령 계정 확인|계정 확인|이메일 예시 보기|신청 공유 카드|출금 결과 확인|DEX 회원 예시)$/.test(el.textContent.trim())){el.remove();return}
  for(const n of el.childNodes)if(n.nodeType===3)n.textContent=n.textContent.replace(/\s*[··]\s*시연/g,'').replace(/예시 (설정 |안내 |제휴사 |리그 |보드 )?저장/g,'저장').replace('시연 초안 저장·미리보기','저장').replace('설정안 저장','저장').replace('팀 참가','참가하기').replace('보상 상세','자세히 보기').replace('혜택 안내','자세히 보기').replace('고객센터 안내','고객센터 문의');
 });
 root.querySelectorAll('input').forEach(el=>{if(/시연|123456/.test(el.placeholder))el.placeholder=el.name==='code'?'인증번호 입력':'';if(el.pattern==='123456')el.removeAttribute('pattern')});
 root.querySelectorAll('option').forEach(el=>{el.textContent=el.textContent.replace(/\s*·\s*시연/g,'')});
 root.querySelectorAll('label').forEach(el=>{for(const n of el.childNodes)if(n.nodeType===3)n.textContent=n.textContent.replace(/\s*·\s*(시연용?|예시)/g,'')});
 // Remove links to reference material from the product preview.
 root.querySelectorAll('[data-go],[data-action=nav]').forEach(el=>{const dest=el.dataset.go||el.dataset.value;if(dest&&!validDesignRoutes.has(dest))el.remove()});
 if(MODE==='user'){
  root.querySelectorAll('[data-action=rewardCheck]').forEach(el=>el.remove());
  if(key()==='bnf/UIDM')root.querySelectorAll('#receiveAccount').forEach(el=>el.closest('.pg')?.remove());
  if(key()==='exd/D2')root.querySelectorAll('.fieldhelp').forEach(el=>el.remove());
 }
 // A read-only ledger result is product data; changing the result is a review control.
 root.querySelectorAll('h2,h3').forEach(el=>{el.textContent=el.textContent.replace(/ · \d+개 (영역|필드 그룹)/g,'')});
 if(MODE==='admin'&&key()==='ex/EX-6')root.querySelectorAll('.bx').forEach(el=>{if(/KYC 내용|소유 확인 가이드/.test(el.textContent))el.remove()});
 root.querySelectorAll('.tg').forEach(el=>{if(/NEW|^신규$|DEX에서 숨김/.test(el.textContent.trim()))el.remove()});
 root.querySelectorAll('[data-action=selectRewardAccount],[data-action=selectLeagueAccount]').forEach(el=>el.setAttribute('role','radio'));
 root.querySelectorAll('.clk,.v21-scope-only').forEach(el=>el.classList.remove('clk','v21-scope-only'));
 // Product warnings stay in their relevant forms. Cross-screen implementation notes stay in Markdown.
 if(MODE==='admin')root.querySelectorAll('.note').forEach(el=>{if(/백엔드|최종 결과는 성공·실패|이 화면에서는 거래량 범위만|CEX·DEX 커미션 페이백을 집계/.test(el.textContent))el.remove()});
 if(MODE==='user'&&key()==='exd/D2')root.querySelectorAll('.pg').forEach(el=>{if(/^✓ Verified · 연동 완료 계정$/.test(el.textContent.trim()))el.remove()});
 if(MODE==='user'&&key()==='bnf/UIDM'&&!root.textContent.includes('DEX 지갑 연동은')){const detail=root.querySelector('.dlg')||root.querySelector('.pg');if(detail){const p=document.createElement('p');p.className='fieldhelp';p.textContent='CEX 전용 보상입니다. DEX 지갑 연동은 이 보상 대상에 포함되지 않습니다.';detail.appendChild(p)}}
 if(MODE==='user'&&key()==='ph/PH1'){const small=root.querySelector('.metric small');if(!small){const unit=document.createElement('small');unit.textContent=' USDT';root.querySelector('.metric')?.appendChild(unit)}}
 if(MODE==='user')root.querySelectorAll('.ph').forEach(el=>{const t=el.textContent.trim();if(/스크린샷|^이벤트 배너$/.test(t)){el.setAttribute('role','img');el.setAttribute('aria-label',t);el.textContent=''}else if(/Key Features?\s*(4개|x4)/i.test(t))el.textContent='주요 특징';else if(/^FAQ\s*x7$/i.test(t))el.textContent='자주 묻는 질문';else if(/단계별 가이드 4단계|Step guide x4/i.test(t))el.textContent='이용 가이드'});
 if(document.createTreeWalker){const walk=document.createTreeWalker(root,4);let node;while(node=walk.nextNode())if(!node.parentElement.closest('script,style,textarea,option'))node.textContent=node.textContent.replace(/\s*·\s*예시/g,'').replace('USDT · 시연 잔액','USDT').replace('네트워크 · 거래 해시: 시연 미제공','—').replace('기존 공통 설정값 연결','—').replace(/DEMO-WD-/g,'WD-');}
}
refineRendered=function(root){designBaseRefine(root);cleanDesignRoot(root)};
function externalControls(){const prior=document.getElementById('design-states');if(prior)prior.remove();const k=key();let list=[],selected=state.previewCase||'normal';
 if(MODE==='user'){
  if(k==='home/S4')list=[['normal','회원 · 연동 계정 있음'],['unlinked','회원 · 연동 계정 없음'],['guest','비회원']];
  else if(k==='exd/D2')list=[['normal','리뷰 있음'],['empty','리뷰 없음']];
  else if(['link/L3','link/L10','link/E4','link/ERROR'].includes(k))list=[['normal','정상'],['pending','연동 확인 중'],['manual','수동 확인 대기'],['referral','추천 코드 불일치'],['other','다른 회원의 지갑'],['limit','연동 한도 도달'],['repeat','조회 횟수 초과'],['failure','조회 실패'],['invalid','주소 형식 오류']];
  else if(['wd/DW1','wd/DW0'].includes(k))list=[['normal','정상'],['password','비밀번호 변경 · 출금 제한'],['email','이메일 인증 실패 · 출금 제한']];
  else if(['home/PUBLIC','etc/FEED','etc/ABOUT'].includes(k))list=[['normal','정상'],['loading','불러오는 중'],['empty','출금 내역 없음'],['error','불러오기 실패']];
  else if(k==='home/LKD')list=[['normal','출금 가능'],['low','최소 출금액 미만'],['processing','연동 확인 중']];
  else if(k==='cp/CP1')list=[['normal','사용 계정 선택 전'],['selected','사용 계정 선택 완료'],['used','쿠폰 사용 완료']];
  else if(k==='inv/IF8')list=[['normal','수령 계정 선택 전'],['selected','수령 계정 선택 완료']];
  else if(k==='lg/LG1')list=[['normal','팀 리그'],['picker','참가 계정 선택'],['noaccount','참가 가능한 계정 없음']];
 }else if(k==='ac/AC-3')list=[['normal','귀속 원장 있음'],['noledger','귀속 원장 없음'],['approved','승인 완료'],['rejected','거절 완료']];
 else if(k==='pt/PT-1')list=[['normal','목록'],['manage','적립률 관리'],['featured','강조할 거래소']];
 else if(['nw/NW-2','nw/NW-3'].includes(k))list=[['normal','편집'],['preview','미리보기']];
 if(!list.length)return;const box=document.createElement('div');box.id='design-states';box.className='design-states';box.innerHTML=`<label for="design-state">화면 상태</label><select id="design-state" data-preview-state>${options(list,selected)}</select>`;document.getElementById('intro').after(box);
}
let lastDesignRoute='';
stage=function(){
 const k=key();if(k!==lastDesignRoute){state.previewCase='normal';state.rewardSelected='';state.leagueSelected='';state.contentPreview=false;state.pointPartner=null;state.saved.featuredOpen=false;state.error='';state.notice='';state.feedStatus='ready';state.feed=clone(FEED);state.security='none';state.linkScenario='normal';if(MODE==='user'&&(!['wd/DW2','wd/DW3'].includes(k)||!['wd/NM','wd/DW2'].includes(lastDesignRoute)))state.guest=['wd/NM','link/E4'].includes(k);if(MODE==='admin'&&k==='ac/AC-3'&&pBy(state.partner).type!=='DEX')state.partner='lighter';if(k==='link/ERROR'){state.previewCase='failure';state.error='조회에 실패했습니다. 잠시 후 다시 시도해 주세요.'}lastDesignRoute=k;}
 designBaseStage();const root=$(legacyHost);cleanDesignRoot(root);
 const dialog=root.querySelector('.v21-member-dialog');
 root.classList.toggle('v21-has-member-modal',!!dialog);
 if(dialog){for(const child of root.children)if(!child.matches('.v21-member-overlay')){child.inert=true;child.setAttribute('aria-hidden','true')}dialog.querySelector('.v21-member-close').focus({preventScroll:true});}
 // Feedback is limited to customer/operator copy; implementation explanations never enter the preview.
 root.querySelectorAll('.v21-feedback').forEach(el=>{if(internalCopy.test(el.textContent)||/예시|실제.*않|파일|설정안|확인 대기입니다/.test(el.textContent))el.remove()});
 const sd=$('sd');if(sd){sd.textContent='';sd.style.display='none'}externalControls();
};
function selectPreview(value){state.previewCase=value;state.notice='';state.error='';const k=key();
 if(MODE==='user'){
  if(['link/L3','link/L10','link/E4','link/ERROR'].includes(k)){
   const errors={referral:'테더맥스 추천 코드로 확인되지 않은 지갑입니다. 가입 경로를 확인해 주세요.',other:'다른 회원에게 연동된 지갑입니다. 고객센터로 문의해 주세요.',limit:'연동 가능한 계정 수를 초과했습니다.',repeat:'조회 횟수를 초과했습니다. 잠시 후 다시 시도해 주세요.',failure:'조회에 실패했습니다. 잠시 후 다시 시도해 주세요.',invalid:'올바른 지갑 주소를 입력해 주세요.'};
   state.linkScenario=value==='invalid'?'normal':value;state.error=errors[value]||'';
   if(value==='pending'||value==='manual')state.notice='거래소의 귀속 내역을 확인하고 있습니다. 확인 후 연동 결과를 알려드릴게요.';
 }else if(k.startsWith('wd/'))state.security=value==='normal'?'none':value;
  else if(k==='home/LKD'){}
  else if(k==='home/S4')state.guest=value==='guest';
  else if(k==='exd/D2'){}
  else if(k==='lg/LG1')state.leagueSelected='';
  else if(['cp/CP1','inv/IF8'].includes(k))state.rewardSelected=value==='selected'?(state.accounts.find(a=>a.status==='Active')?.id||''):'';
  else if(['home/PUBLIC','etc/FEED','etc/ABOUT'].includes(k)){state.feedStatus=value==='normal'?'ready':value;state.feed=value==='empty'?[]:clone(FEED);}
 }else if(k==='ac/AC-3'){state.ledgerFound=value!=='noledger';state.manualStatus=value==='approved'?'approved':value==='rejected'?'rejected':'pending';}
 else if(k==='pt/PT-1'){state.pointPartner=value==='manage'?'lighter':null;state.saved.featuredOpen=value==='featured';}
 else if(['nw/NW-2','nw/NW-3'].includes(k)){state.contentPreview=value==='preview';}
 render();
}
document.addEventListener('change',e=>{if(e.target.hasAttribute('data-preview-state')){e.stopImmediatePropagation();selectPreview(e.target.value)}},true);
document.addEventListener('keydown',e=>{if(['Enter',' '].includes(e.key)&&e.target.matches('[data-action=selectRewardAccount],[data-action=selectLeagueAccount]')){e.preventDefault();e.target.click()}});
v21Action=function(action,value){
 if(MODE==='admin'&&action==='memberModalClose'){nav('mb/MB-1',false);$(legacyHost).querySelector('[data-action="nav"][data-value="mb/MB-4"]')?.focus({preventScroll:true});return;}
 if(action==='scopeInfo')return;
 if(MODE==='user'){
  if(action==='withdrawAuth'){if(!eligibleAccounts().length||(!state.guest&&state.security!=='none'))return;state.request=null;return nav('wd/DW2',false)}
  if(action==='guide')return nav('link/GUIDE',false);
  if(action==='firstReward')return nav('cp/CP1');
  if(action==='selectRewardAccount'){state.rewardSelected=value;state.previewCase='selected';return render()}
  if(action==='selectLeagueAccount'){state.leagueSelected=value;return render()}
  if(action==='leagueOverview'||action==='leagueConfirm'){state.previewCase='normal';state.leagueSelected='';return render()}
  if(action==='support')return showInfo('고객센터: support@tethermax.io');
  if(action==='scopeInfo')return;
  if(action==='asterHelp')return;
  if(action==='shareCopy'){if(navigator.clipboard?.writeText)navigator.clipboard.writeText(location.href).then(()=>showInfo('링크를 복사했어요.')).catch(()=>{});return}
  if(action==='shareDownload')return;
 }
 return designBaseAction(action,value);
};
document.addEventListener('click',e=>{if(e.target.matches('[data-member-backdrop]'))v21Action('memberModalClose');});
document.addEventListener('keydown',e=>{
 const dialog=document.querySelector('.v21-member-dialog');if(!dialog)return;
 if(e.key==='Escape'){e.preventDefault();v21Action('memberModalClose');return;}
 if(e.key==='Tab'){const items=Array.from(dialog.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]'));const first=items[0],last=items.at(-1);if(!first)return;if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}}
});
// UI routes are screen previews, not an authentication or transaction simulator.
const designBaseForm=handleForm;
handleForm=function(name,data,decision){
 if(MODE==='user'&&name==='reward'){const a=state.accounts.find(a=>a.id===data.receiveAccount);if(a&&a.status==='Active'&&(!['uid','challenge'].includes(data.kind)||pBy(a.partner).type==='CEX')){state.previewCase='used';state.error='';return render()}}
 if(MODE==='user'&&name==='invite'){const a=state.accounts.find(a=>a.id===data.receiveAccount);if(!a)return;state.request={id:'WD-20261023-002',guest:false,status:'pending',createdAt:FIXED_NOW,items:[{accountId:a.id,partner:a.partner,identifier:a.identifier,amount:50,status:'pending'}]};return nav('wd/DW2',false)}
 return designBaseForm(name,data,decision);
};
// Keep the top V2 navigation and state tabs; review commentary belongs in Markdown.
S.notes=false;
const designToolbar=pbar;
pbar=function(){designToolbar();const bar=$('pbar');bar.querySelectorAll('#jump,[data-action=v21reset]').forEach(el=>el.remove())};
sidePanel=function(){const panel=$('np');panel.innerHTML='';panel.style.display='none'};
intro=function(){$('intro').innerHTML='<h2>DEX 화면 설계 · V2.2</h2>'};
Object.assign(window.V21_READY,{renderPage,nav,act:v21Action,handleForm,shareView,requestView,selectPreview,previewRequest});
// Re-resolve the hash after removing reference/auth states; numeric tab indices have changed.
{const [group,id]=location.hash.slice(1).split('/'),pi=P.findIndex(p=>p.id===group),si=pi<0?-1:P[pi].states.findIndex(s=>s.id===id);if(pi>=0&&si>=0){S.pi=pi;S.si=si}else{S.pi=0;S.si=0}}
