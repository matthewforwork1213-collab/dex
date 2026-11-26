// ===== V2.2 · 배치 1 — 지갑 연동 (FU-013 ~ FU-028) =====
// 문구는 기능명세서 REQ 원문. 정해지지 않은 문구는 [… — 미정 G-nnn]으로 표시하고 지어내지 않는다.
if(MODE==='user'){
const LK_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
const LK_SIGNUP=()=>`<p class="v22-signup">${T("Don't have an account yet? Sign up here","아직 계정이 없으신가요? 여기서 가입하세요")} ↗</p>`;
const LK_HELP='<p class="sb v22-help" data-action="support">Need help? Contact Support</p>';
const lkDex=()=>pBy(state.lkPartner||'edgex');
const lkLinkable=()=>partnerList('ALL').filter(p=>p.id!=='lighter'); // Lighter는 온보딩 보류 — 거래소 레코드 연동가능=N
const lkMark=p=>`<span class="ava">${esc(p.name.slice(0,1))}</span>`;
const lkWallet=(addr,full=true)=>`<span class="mono">${esc(full?addr:v22Short(addr))}</span>`;
const lkChips=on=>`<div class="tabs v22-chips2">${[['all',T('All','전체')],['cex',T('Centralised Exchanges','중앙화 거래소')],['dex',T('Decentralised Exchanges','탈중앙화 거래소')]].map(([v,l])=>`<span class="${on===v?'on':''}">${l}</span>`).join('')}</div>`;
const lkRow=(p,badge,selected,extra='')=>`<div class="li ${selected?'selected':''}">${lkMark(p)}<span class="nm">${esc(p.name)}${badge&&p.type==='DEX'?' <span class="bdg gy">DEX</span>':''}${extra}</span><span class="am">→</span></div>`;

// ---------- 거래소 선택 (웹 꽉 찬 모달) FU-013
function lkSelector(c){
 const presel={detail:'edgex',hub:'apex'}[c]||'';
 const chip=c==='cex'?'cex':['dex','dexbit','homeFooter'].includes(c)?'dex':'all';
 const q={one:'edge',many:'a',none:'zzz',dexbit:'bit'}[c]||'';
 const ph=c==='homeFooter'?'Search for a DEX':T('Search partners','거래소 검색');
 if(c==='intro')return v22Dlg(`<h3>Have you registered a trading account with the TetherMax referral code?</h3><p>You must link your UID to claim USDT from TetherMax.</p><p class="sb">${LK_TBD('UID → 거래 계정 · 지갑 문구 교체','REQ-712')}</p><div class="row2">${v22Btn('Yes, I have one!','','data-go="link/ADDR"')}${v22Btn('No, not yet!','sec')}</div>${LK_SIGNUP()}`,'v22-full');
 let list=lkLinkable().filter(p=>chip==='all'||p.type===chip.toUpperCase()).filter(p=>!q||p.name.toLowerCase().includes(q));
 const body=c==='fail'?`<div class="v22-empty">${LK_TBD('파트너 목록 로드 실패 처리 (오류 + Retry / 기존 CEX 캐시 우선)','G-097')}</div>`
  :list.length?list.map(p=>lkRow(p,chip==='all',p.id===presel,c==='region'&&p.id==='aster'?`<span class="sb">${LK_TBD('지역 제한 사유','G-161')}</span>`:'')).join('')
  :`<div class="v22-empty">No results found</div>`;
 const popular=q||c==='fail'?'':`<div class="ch"><h3>${T('Popular partners','인기 제휴 거래소')}</h3></div><div class="v22-tiles">${lkLinkable().slice(0,5).map(p=>`<div class="c flat ${p.id===presel?'selected':''}">${lkMark(p)}<b>${esc(p.name)}</b></div>`).join('')}</div>`;
 const none=c==='normal';
 return v22Dlg(`<h3>${T('Link Account',LK_TBD('모달 제목 (UID 없는 중립어)','G-095'))}</h3><p class="sb">No wallet connection or signature required.</p><input class="v22-input" placeholder="${ph}" value="${esc(q)}">${popular}${lkChips(chip)}<div class="c flat">${body}</div>${none?`<div class="v22-sel"><b>Select a partner</b><span class="sb">Select the partner you trade on to see how to link your account.</span></div><button type="button" class="btn" disabled>Link Account</button>`:presel?`<div class="v22-sel"><b>${esc(pBy(presel).name)}</b> ${T('selected','선택됨')}</div>${v22Btn(T('Next','다음'),'','data-go="link/ADDR"')}`:''}${LK_SIGNUP()}`,'v22-full');
}
// ---------- 앱·모바일웹 바텀시트 → 전체 화면
function lkSheet(c){
 if(c==='screen')return `${gnbPC()}<div class="pg v22-mobile"><div class="v22-head"><span>←</span><h2>Link Account</h2></div><section class="c"><div class="li">${lkMark(lkDex())}<span class="nm">${esc(lkDex().name)}</span></div><input class="v22-input" placeholder="Paste your wallet address"><p class="sb">Starts with 0x followed by 40 characters.</p></section><section class="c"><h3>How to find your wallet address</h3>${[1,2,3].map(i=>`<div class="ph v22-shot">${esc(lkDex().name)} · ${i}</div>`).join('')}<div class="v22-dots"><i class="on"></i><i></i><i></i></div></section><div class="v22-sticky"><button type="button" class="btn" disabled>Next</button><p class="sb">Paste a valid wallet address to continue.</p></div>${LK_SIGNUP()}</div>`;
 const chip=c==='cex'?'CEX':['dex','footer'].includes(c)?'DEX':'ALL';
 const origin=c==='footer'?`<div class="v22-origin">Trading on multiple exchanges? Link more</div>`:'';
 const list=lkLinkable().filter(p=>chip==='ALL'||p.type===chip);
 return `${origin?`${gnbPC()}<div class="pg">${origin}</div>`:''}<div class="pg"><div class="dlg v22-sheet"><h3>Select an exchange</h3><input class="v22-input" placeholder="Search exchanges"><div class="tabs">${['All','CEX','DEX'].map(x=>`<span class="${x.toUpperCase()===chip?'on':''}">${x}</span>`).join('')}</div><div class="c flat">${list.map(p=>lkRow(p,chip==='ALL',false)).join('')}</div></div></div>`;
}
// ---------- 기존 CEX 선택 모달 그리드 (REQ-124)
function lkGrid(c){
 const q=c==='search'?'ap':'';
 const list=lkLinkable().filter(p=>!q||p.name.toLowerCase().includes(q));
 const tile=p=>`<div class="v22-gtile" style="background:${p.type==='DEX'?'#eef0f6':'#f3f6ff'}">${lkMark(p)}<b>${esc(p.name)}</b><span class="sb">${p.type==='DEX'?LK_TBD('XX% Total Savings 값','G-096'):p.rate+'% Total Savings'}</span></div>`;
 return v22Dlg(`<h3>Select an exchange</h3><input class="v22-input" placeholder="Search for an exchange" value="${q}">${lkChips('all')}${q?'':`<div class="ch"><h3>Top Partner Exchanges</h3></div><div class="v22-round">${lkLinkable().slice(0,5).map(p=>`<span>${lkMark(p)}<small>${esc(p.name)}</small></span>`).join('')}</div>`}<div class="ch"><h3>${q?'Search Results':'All Exchanges'} (${list.length})</h3></div><div class="v22-grid3">${list.map(tile).join('')}</div>`,'v22-full');
}
// ---------- 지갑 주소 입력 FU-015 · 16
const LK_INPUT={
 normal:['', ''],valid:[SAMPLE_WALLET,''],paste:['','paste'],kept:[SAMPLE_WALLET,''],
 e2:['','Enter your wallet address.'],
 e3:['7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU',"This doesn't look like a {DEX} wallet address."],
 e4:['0X52908400098527886E0F7030069857D2E4169EE7','Enter a valid wallet address starting with 0x followed by 40 characters.'],
 e5:['0x52908400098527886e0F7030069857D2E4169EE7','This address has an invalid checksum. Copy it again directly from {DEX}.'],
 e6:['edgexuser.eth','Paste the 0x wallet address, not a name or other format.'],
 e7:['0x0000000000000000000000000000000000000000',"This address can't be linked."]
};
function lkAddress(c){
 const p=lkDex(),[val,err]=LK_INPUT[c]||LK_INPUT.normal,valid=c==='valid'||c==='kept';
 const msg=err==='paste'?`<p class="sb v22-hint">${LK_TBD('클립보드 권한 거부 시 직접 붙여넣기 힌트','REQ-061 권고')}</p>`:err?`<p class="v22-err" role="alert">${esc(err.replace('{DEX}',p.name))}</p>`:'';
 const guide=valid?'':`<section class="c flat v22-guide2"><h3>How to find your wallet address</h3><p class="sb">${LK_TBD(p.name+' 단계 제목·설명 (어드민 거래소 가이드 작성)','REQ-533 · G-443')}</p><div class="v22-car"><span>‹</span><div class="ph v22-shot">${esc(p.name)} screenshot 1 / 3</div><span>›</span></div><div class="v22-dots"><i class="on"></i><i></i><i></i></div><p class="sb">${T('TetherMax never asks for your private key, seed phrase (secret recovery phrase) or a wallet signature.','테더맥스는 개인키·시드 문구(비밀 복구 문구)·지갑 서명을 요구하지 않습니다.')} ${LK_TBD('보안 문구 원문·위치','G-392')}</p></section>`;
 return v22Dlg(`<h3>Link Account</h3><p class="sb">No wallet connection or signature required.</p><div class="li">${lkMark(p)}<span class="nm">${esc(p.name)} <span class="bdg gy">DEX</span></span><span class="am" data-go="link/SEL">${T('Change','변경')}</span></div>
  <label class="v22-lbl">${val?'Wallet address':''}<span class="v22-field ${err&&err!=='paste'?'bad':''}"><input class="v22-input mono" name="wallet_address" placeholder="Paste your wallet address" value="${esc(val)}"><button type="button" class="btn sec sm">Paste</button></span></label>
  <p class="sb">Starts with 0x followed by 40 characters.</p>${msg}
  ${c==='kept'?v22Note('실패 다이얼로그를 닫아도 선택 거래소·입력 주소 유지 '+LK_TBD('제출 실패·새로고침 시 비울지','G-380')):''}
  <button type="button" class="btn" ${valid?'data-go="link/CAPTCHA"':'disabled'}>Next</button>${valid?'':'<p class="sb">Paste a valid wallet address to continue.</p>'}
  ${guide}${LK_SIGNUP()}`,'v22-full');
}
// ---------- 캡차 · 시도 제한 FU-017
function lkCaptcha(c){
 if(c==='limit')return v22Dlg(`<h3>Verification Limit Reached</h3><p>Too many attempts. Please wait a few minutes and try again.</p>${v22Btn('Close','','data-go="link/ADDR"')}${LK_HELP}<p class="sb">${LK_TBD('시도 한도 도입 여부·횟수·대기 시간','G-063')}</p>`);
 const puzzle=`<div class="v22-captcha"><div class="ph v22-shot">puzzle</div><div class="v22-slider"><i></i>${c==='success'?'':'Slide to complete the puzzle'}</div><small>Powered by GEETEST</small></div>`;
 if(c==='success')return v22Dlg(`${puzzle}<p class="v22-ok">✓ Verification Success</p>`);
 if(c==='scriptFail')return v22Dlg(`<h3>Link Account</h3><p class="v22-err" role="alert">${LK_TBD('캡차 로드 실패 인라인 오류','REQ-072')}</p>${v22Btn('Retry','sec')}<button type="button" class="btn" disabled>Next</button><p class="sb">캡차 없이 제출하지 않음</p>`);
 if(c==='retry')return v22Dlg(`${puzzle}<p class="sb">캡차 실패 — 연동을 시도하지 않고 주소를 유지한 채 다시 풀기</p>`);
 return v22Dlg(puzzle);
}
// ---------- 처리 중 FU-023 · 14
function lkProcessing(c){
 return v22Dlg(`<div class="ico">⏳</div><h3>Processing Your Wallet</h3><p>Your wallet address is being processed. You'll be notified once linking is complete.</p>${c==='prelink'?`<div class="c flat"><div class="kv"><span class="k">${LK_TBD('연동 전 잔액 출금 안내·금액 표시','G-426')}</span></div></div>`:''}${v22Btn('Back to Home','','data-go="link/HOME"')}`);
}
// ---------- 결과 다이얼로그 FU-023 · 24
function lkResult(c){
 const p=lkDex(),a=v22Dex(),head=`<div class="li">${lkMark(p)}<span class="nm">${esc(p.name)}<span class="sb mono">${esc(v22Short(a.identifier))}</span></span></div>`;
 if(c==='inuse')return v22OwnInUse();
 if(c==='cooldown')return v22OwnCooldown();
 const map={
  normal:[`Unable to Link Wallet ${LK_TBD('제목 분리 Not a TetherMax Referral · Join 버튼','G-092')}`,`<p>Only wallets that joined ${esc(p.name)} through TetherMax's referral link can be linked.</p>`,v22Btn('Close','','data-go="link/ADDR"')],
  mine:["You've Already Added This Wallet",'<p>This wallet address is already linked to your account. No further action is needed.</p>',v22Btn('Close','','data-go="link/ADDR"')],
  other:['Unable to Link Wallet','<p>We were unable to link this wallet address. Please contact our support team for assistance.</p>',v22Btn('Contact Support','','data-action="support"')],
  limit:[LK_TBD('연동 한도 초과 제목','G-091'),`<p>${LK_TBD('한도 문구 (거래 계정 기준, 결과 숫자만)','G-091')}</p><div class="kv"><span class="k">${T('Linked accounts','연동한 거래 계정')}</span><span class="v">21 / 21</span></div>`,v22Btn('Close','','data-go="home/S4"')],
  pending:['지갑 연동을 확인하고 있어요','<p>거래소의 귀속 내역 확인 후 연동 결과를 알려드릴게요.</p><p class="sb">'+LK_TBD('영문 문구','G-094')+'</p>',v22Btn('Back to Home','','data-go="link/HOME"')],
  prelinkFail:[LK_TBD('연동 전 잔액 출금 실패 제목','G-426'),`<p>${LK_TBD('실패 안내 — 금액은 연동 전 잔액으로 복원, 다시 신청 가능','G-426')}</p>`,v22Btn('Close','','data-go="link/ADDR"')]
 }[c]||[];
 return v22Dlg(`<h3>${map[0]}</h3>${head}${map[1]}${map[2]}${LK_HELP}`);
}
// ---------- 연동 성공 FU-023 · 25
function lkDone(c){
 const p=c==='apex'?pBy('apex'):lkDex(),a=v22Dex();
 const badge=c==='apex'?LK_TBD('ApeX 정산 배지 형식','G-099 · G-025'):c==='weekly'?'<span class="bdg ok">Weekly</span>':'<span class="bdg ok">Daily</span>';
 const next=c==='weekly'?`${T('Every Monday','매주 월요일')}`:`${T('Daily','매일')} ${v22Clock('00:00')}`;
 const pre=c==='app'?`<p class="v22-ok">✓ Verification Success</p>`:'';
 return `${pre?`<div class="pg"><div class="dlg">${pre}</div></div>`:''}${v22Dlg(`<div class="ico">🛡️</div><h3>Wallet Linked</h3><p>Your ${esc(c==='weekly'?'Lighter':p.name)} wallet address has been linked.</p><div class="c flat"><div class="li">${lkMark(p)}<span class="nm">${esc(c==='weekly'?'Lighter':p.name)}<span class="sb mono">${esc(a.identifier)}</span></span></div><div class="kv"><span class="k">${T('Settlement','정산 주기')}</span><span class="v">${badge}</span></div><div class="kv"><span class="k">${T('Next update','다음 업데이트')}</span><span class="v">${next}</span></div>${c==='truncated'?`<p class="sb">Cashback shown from 2026.05.28</p>`:''}${c==='apexIdPending'?`<p class="sb">Account ID pending ${LK_TBD('지갑 기준 연동 성립 + Account ID pending 표시 / 확인 중 — 택일','G-023 · G-177')}</p>`:''}</div>${v22Btn('Back to Home','','data-go="link/HOME"')}`)}<div class="v22-toast">Wallet linked successfully</div>`;
}
// ---------- 홈 반영 FU-023 · 24 · 25
function lkHome(c){
 const base=state.accounts.filter(a=>pBy(a.partner).type==='CEX');const p=lkDex();
 const row=(name,addr,status,amt,extra='')=>`<div class="li"><span class="ava">${esc(name.slice(0,1))}</span><span class="nm">${esc(name)} <span class="bdg gy">${status}</span><span class="sb">Wallet <span class="mono">${esc(v22Short(addr))}</span></span>${extra}</span><span class="am">${amt}</span></div>`;
 let rows='';
 if(c==='normal')rows=row(p.name,SAMPLE_WALLET,'연동 완료','0.00<small>USDT</small>');
 if(c==='transferred')rows=row(p.name,SAMPLE_WALLET,'연동 완료','4.00<small>USDT</small>');
 if(c==='pending')rows=row(p.name,SAMPLE_WALLET,'연동 시도중이에요','-');
 if(c==='inactive')rows=row('ApeX',SAMPLE_WALLET2,'Inactive','12.40<small>USDT</small>',`<span class="sb">${T('Offboarded — cashback is still paid automatically','오프보딩 — 적립 캐시백은 자동 지급 유지')} ${LK_TBD('Inactive 행 안내 문구','REQ-121')}</span>`);
 if(c==='multi')rows=[SAMPLE_WALLET,SAMPLE_WALLET2,V22_WALLET_UNKNOWN].map((w,i)=>row(p.name,w,'연동 완료',['3.20','0.00','11.05'][i]+'<small>USDT</small>')).join('')+[SAMPLE_WALLET,SAMPLE_WALLET2].map(w=>row('Aster',w,'연동 완료','0.00<small>USDT</small>',`<span class="sb">${LK_TBD('Aster 하위 계정 안내','G-087')}</span>`)).join('');
 if(c==='rejected')rows=row(p.name,SAMPLE_WALLET,'연동 실패','-',`<span class="sb">${LK_TBD('확인 중 거절 후 행 처리(제거 / 연동 실패 유지) · 사유 표시','G-069 · G-074')}</span>`);
 const first=c==='first';
 return `${gnbPC()}<div class="pg"><div class="c"><div class="kv big"><span class="k">Total Cashback Balance</span><span class="v">${money(first?0:base.reduce((s,a)=>s+a.cash,0))} USDT</span></div>${v22Auto()}</div><div class="c"><div class="ch"><h3>Linked Accounts</h3></div>${first?'':base.map(a=>v22Wrow(a,false)).join('')}${first?row(p.name,SAMPLE_WALLET,'연동 완료','0.00<small>USDT</small>'):rows}<div class="sb" style="margin-top:11px;color:var(--primary)" data-go="link/SEL">+ Link Account</div></div>${first?'':''}</div>${first?'<div class="v22-toast">Wallet linked successfully</div>':''}`;
}

// ---------- 등록
const SEL_STATES=[['normal','진입: 체크리스트 — 선택 없음','REQ-051'],['homeFooter','진입: Linked Accounts 푸터 → DEX 목록','REQ-051'],['detail','진입: DEX 상세 → 그 DEX 선택','REQ-051'],['hub','진입: 허브 → 그 거래소 선택','REQ-051'],['cex','칩 Centralised Exchanges','REQ-055'],['dex','칩 Decentralised Exchanges (배지 없음)','REQ-055'],['one','검색 결과 1건','REQ-056'],['many','검색 결과 여러 건','REQ-056'],['none','검색 결과 없음 (No results found)','REQ-056'],['dexbit','DEX 칩에서 «bit» → 0건','REQ-056'],['region','지역 제한 DEX','REQ-120 · G-161'],['fail','파트너 목록 로드 실패','REQ-059 · G-097'],['intro','STG 웹 진입 질문','REQ-712']];
v22Group2('link','지갑 연동');
for(const k of ['L0','L1'])v22Retire('link/'+k,'link/SEL');
for(const k of ['L3','L10','ERROR','GUIDE','E4'])v22Retire('link/'+k,'link/ADDR');
v22Retire('link/L7','link/DONE');v22Retire('link/L8','link/RESULT');v22Retire('link/PENDING','link/RESULT');v22Retire('link/PRELINK','link/PROC');v22Retire('link/PRELINKFAIL','link/RESULT');
v22Register('link/SEL',{label:'거래소 선택 (웹 꽉 찬 모달)',states:SEL_STATES,render:lkSelector,modal:{background:'home/S4'},fu:['FU-013','FU-025'],note:['.dlg','거래소 선택','CEX·DEX 한 선택기. 유형을 바꾸면 입력값을 지움(REQ-057). Lighter는 온보딩 보류라 목록에 없음(레코드 연동가능=N). 모든 상태에 가입 링크(REQ-053).']});
v22Register('link/SHEET',{label:'거래소 선택 (앱·모바일웹)',states:[['normal','바텀시트 · All','REQ-055'],['footer','진입: 앱 홈 푸터 Trading on multiple exchanges? Link more → DEX 목록','REQ-051'],['cex','바텀시트 · CEX','REQ-055'],['dex','바텀시트 · DEX','REQ-055'],['screen','전체 화면 Link Account — Next 항상 닿음','REQ-052']],render:lkSheet,modal:{background:'home/S4'},fu:['FU-013']});
v22Register('link/GRID',{label:'기존 선택 모달 그리드',states:[['normal','Top Partner · All Exchanges (N)','REQ-124'],['search','검색 — Top 숨김, Search Results (N)','REQ-124']],render:lkGrid,modal:{background:'home/S4'},fu:['FU-013'],note:['.dlg','기존 그리드에 DEX','DEX 레코드의 is_featured · brand_color_hex · total_savings_rate 값 미정(G-096).']});
v22Register('link/ADDR',{label:'지갑 주소 입력',states:[['normal','빈 값 — 안내 보임, Next 비활성','REQ-061 · 062 · 069'],['valid','유효 주소 — 안내 숨김, Next 활성','REQ-062 · 069'],['paste','Paste 권한 거부','REQ-061'],['e2','② 빈 값 제출','REQ-065'],['e3','③ 다른 형식 (base58)','REQ-065 · 067'],['e4','④ 0X·길이·문자 오류','REQ-065'],['e5','⑤ 체크섬 불일치','REQ-065'],['e6','⑥ ENS·ICAP','REQ-065'],['e7','⑦ 제로 주소','REQ-065'],['kept','실패 후 주소 유지','REQ-064 · G-380']],render:lkAddress,modal:{background:'home/S4'},fu:['FU-015','FU-016'],note:['.dlg','주소 입력·검증','클라이언트·서버 같은 규칙(REQ-066). 거부되면 캡차·귀속 조회를 호출하지 않음(REQ-067). 대소문자 보존(REQ-063).']});
v22Register('link/CAPTCHA',{label:'캡차 · 시도 제한',states:[['normal','GEETEST 퍼즐','REQ-072'],['success','Verification Success','REQ-072'],['retry','퍼즐 실패 — 주소 유지 재시도','REQ-072'],['scriptFail','캡차 스크립트 로드 실패','REQ-072'],['limit','Verification Limit Reached','REQ-073 · G-063']],render:lkCaptcha,modal:{background:'home/S4'},fu:['FU-017'],note:['.dlg','캡차','플로우에 1회, CEX와 같은 위치(REQ-050). 토큰 1회용·주소 바인딩 G-098.']});
v22Register('link/PROC',{label:'처리 중 (Processing Your Wallet)',states:[['normal','귀속 조회 중 — 최소 1초','REQ-091'],['prelink','연동 전 잔액 출금 대기','REQ-107 · 108 · G-426']],render:lkProcessing,modal:{background:'home/S4'},fu:['FU-023','FU-014']});
v22Register('link/RESULT',{label:'연동 결과 다이얼로그',states:[['normal','레퍼럴 아님 (FAILED_NOT_FOUND_UID)','REQ-088 · 122'],['inuse','타인 사용 중 (FAILED_ALREADY_INTEGRATION)','REQ-089 · 723'],['cooldown','30일 쿨다운 (FAILED_RECENT_POSSESSION)','REQ-724'],['mine','본인 이미 추가 (FAILED_MY_INTEGRATION)','REQ-090'],['other','기타 실패','REQ-092'],['limit','한도 초과 (INTEGRATION_MAX_COUNT_OVER)','REQ-112 · G-091'],['pending','확인 중 (manual_link_pending)','REQ-075 · 098~100'],['prelinkFail','연동 전 잔액 출금 실패 = 연동 실패','REQ-107 · G-426']],render:lkResult,modal:{background:'home/S4'},fu:['FU-023','FU-024','FU-014'],note:['.dlg','결과 다이얼로그','모든 결과에 Need help? Contact Support. Close·Cancel은 거래소·주소 유지, Try a different wallet은 주소 비움(REQ-093).']});
v22Register('link/DONE',{label:'연동 성공',states:[['normal','EdgeX · Daily','REQ-094 · 095'],['apex','ApeX — 배지 형식 미정','REQ-095 · G-099'],['weekly','Lighter — Weekly (온보딩 후)','REQ-095'],['truncated','180일 넘는 기록 — Cashback shown from','REQ-119'],['apexIdPending','ApeX AccountID 미반환 (택일안)','REQ-082 · G-023'],['app','앱·모바일웹 — Verification Success 다음','REQ-094']],render:lkDone,modal:{background:'home/S4'},fu:['FU-023','FU-025'],note:['.dlg','연동 성공','토스트 Wallet linked successfully. DEX 첫 연동은 3 USDT 쿠폰 안내 없음(REQ-097).']});
v22Register('link/HOME',{label:'홈 반영',states:[['normal','새 행 맨 아래 · 연동 완료 0.00','REQ-094'],['transferred','10 USDT 미만 이관 4.00','REQ-107'],['pending','확인 중 — 연동 시도중이에요 · -','REQ-098'],['first','첫 연동 — 체크리스트 없는 S4','REQ-096 · G-070'],['inactive','DEX 오프보딩 — Inactive','REQ-121'],['multi','같은 DEX 지갑 3개 · Aster 하위 계정','REQ-118 · 084'],['rejected','확인 중 거절','REQ-102 · G-069']],render:lkHome,fu:['FU-023','FU-024','FU-025','FU-022'],note:['.c','홈 반영','새로고침 없이 새 행 추가. 금액 = 연동 시 이관된 금액(REQ-094). 사용자 셀프 해제 버튼 없음(REQ-113).']});
v22Order('link',['SEL','SHEET','GRID','ADDR','CAPTCHA','PROC','RESULT','DONE','HOME']);

// 소유권 화면도 레지스트리로 (FU-027 · 28)
v22Register('own/O1',{group:'소유권 인증',label:'O1 Wallet Already in Use',states:[['normal','타인 사용 중','REQ-089 · 723']],render:()=>v22OwnInUse(),modal:{background:'home/S4'},fu:['FU-027']});
v22Register('own/O2',{label:'O2 신청 불가 (30일)',states:[['normal','마지막 승인 후 30일 이내','REQ-724']],render:()=>v22OwnCooldown(),modal:{background:'home/S4'},fu:['FU-027']});
v22Register('own/O3',{label:'O3~O9 인증 화면 · 업로드',states:[['normal','Step 1 · 파일 없음','REQ-725 · 726'],['s2','Step 2','REQ-725'],['s3','Step 3','REQ-725'],['uploading','업로드 중','REQ-726'],['uploaded','업로드 완료','REQ-726'],['failed','Upload Failed','REQ-726'],['error','Something Went Wrong','REQ-726']],render:()=>v22OwnPage(),fu:['FU-027']});
v22Register('own/O10',{label:'O10 제출 확인',states:[['normal','Submit this claim?','REQ-727']],render:()=>v22OwnConfirm(),modal:{background:'own/O3'},fu:['FU-027']});
v22Register('own/O11',{label:'O11~O13 홈 · 심사 상태',states:[['normal','심사 중','REQ-728'],['approved','승인','REQ-728 · 729'],['rejected','거절','REQ-728']],render:()=>v22OwnHome(),fu:['FU-027','FU-028']});
v22Register('own/O14',{label:'O14~O16 이전 보유자 · 재청구',states:[['normal','해제 행','REQ-729'],['reclaim','재청구 다이얼로그','REQ-729'],['rejected','재청구 거절 · 사유','REQ-729']],render:()=>v22OwnDisplaced(),fu:['FU-028']});
}
