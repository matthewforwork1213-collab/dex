// ===== V2.2 · 배치 2 — 출금 (FU-030 ~ FU-036) =====
// 회원 출금 화면은 삭제(G-448). 모든 출금 버튼은 비활성 Auto Claim. 처리 중·완료·실패를 보여 주는 회원 화면은 없음(REQ-163).
if(MODE==='user'){
const WD_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
const wdNeed=a=>{const n=a.cash===0?(a.reward>=5?5:10):Math.max(0,10-(a.cash+Math.min(a.reward,a.cash)));return floor2(n)};
const wdAvail=a=>floor2(a.cash+Math.min(a.reward,a.cash));
// 표본 계정: CEX 2 · DEX 3 (같은 주소 EdgeX·Aster 카드 따로, ApeX 미달)
const WD_ACC=()=>[
 {partner:'bitget',identifier:'123456789',cash:5,reward:232},
 {partner:'okx',identifier:'987654321',cash:31.68,reward:0},
 {partner:'edgex',identifier:SAMPLE_WALLET,cash:100,reward:20},
 {partner:'aster',identifier:SAMPLE_WALLET,cash:12,reward:0},
 {partner:'apex',identifier:SAMPLE_WALLET2,cash:3,reward:0}];
function wdUpdates(p){
 if(p.id==='edgex')return `Daily, ${v22Clock('00:00')}`;
 return WD_TBD(p.name+' 주기·공개 시각',p.id==='aster'?'G-036':'G-025 · G-099');
}
function wdCard(a,c,opt={}){
 const p=pBy(a.partner),dex=p.type==='DEX',amt=opt.deducted&&wdAvail(a)>=10?0:wdAvail(a),ok=amt>=10;
 const zero=dex&&a.cash===0;
 const err=c==='partner'&&a.partner==='aster';
 return `<div class="c v22-wcard ${ok?'':'dim'}"><div class="ch"><span class="nm">${v22Mk(p)} ${esc(p.name)}</span><span><span class="bdg ${ok?'ok':'gy'}">${ok?'Available':'Unavailable'}</span>${ok?'':' <span class="bdg gy">Inactive</span>'}</span></div>
  <div class="sb mono">${dex?'Wallet '+esc(a.identifier):'UID '+esc(mask(a.identifier))}</div>
  ${c==='delayed'&&a.partner==='edgex'?`<div class="sb">Last updated ${shortTime('2026-10-22T00:00:00Z')}</div>`:''}
  ${err?v22Note(`We can't load your latest ${esc(p.name)} cashback right now.`,'warn')+v22Btn('Try again','sec sm'):''}
  <div class="kv"><span class="k">${T('Available Cashback','출금 가능 캐시백')}</span><span class="v">${money(amt)} USDT</span></div>
  <div class="kv"><span class="k">${T('Exchange Cashback','거래소 캐시백')}</span><span class="v">${money(opt.deducted&&wdAvail(a)>=10?0:a.cash)} USDT</span></div>
  ${a.reward>0?`<div class="kv"><span class="k">${T('Event Reward','이벤트 리워드')}</span><span class="v">${money(opt.deducted&&wdAvail(a)>=10?Math.max(0,a.reward-Math.min(a.reward,a.cash)):a.reward)} USDT</span></div>`:''}
  ${dex?`<div class="kv"><span class="k">Cashback updates ⓘ</span><span class="v">${wdUpdates(p)}</span></div>`:''}
  ${c==='preAccrual'&&a.partner==='apex'?`<div class="kv v22-pre"><span class="k">Pending ${WD_TBD('ApeX 대기 배치 줄','G-127')}</span><span class="v">2.10 USDT</span></div>`:''}
  ${c==='noNetwork'&&dex?v22Note(WD_TBD('지급 네트워크 미설정 — 지갑 목적지 비활성 표시','REQ-142'),'warn'):''}
  ${!ok&&!err?`<div class="sb v22-short">${T(`You can claim cashback if you receive an additional ${money(wdNeed(a))} USDT in exchange Cashback.`,`거래소 캐시백을 ${money(wdNeed(a))} USDT 더 받으면 출금할 수 있어요.`)}</div>`:''}
  ${zero?v22Note('No exchange cashback yet. Cashback appears here the day after you trade on your linked DEX. '+WD_TBD('DEX별 배너 (Lighter는 주간)','G-110')):''}
 </div>`;
}
function wdScreen(c){
 let acc=WD_ACC();
 if(c==='allBlocked')acc=acc.map(a=>({...a,cash:Math.min(a.cash,3),reward:Math.min(a.reward,2)}));
 if(c==='zero')acc=acc.map(a=>pBy(a.partner).type==='DEX'?{...a,cash:0,reward:0}:a);
 if(c==='lighter')acc=[...acc,{partner:'lighter',identifier:V22_WALLET_UNKNOWN,cash:14,reward:0},{partner:'lighter',identifier:SAMPLE_WALLET2,cash:2,reward:0}];
 if(c==='many')acc=[...acc,...Array.from({length:7},(_,i)=>({partner:['bybit','okx','bitget','apex','aster','edgex','bybit'][i],identifier:i>2?SAMPLE_WALLET2:String(555000000+i),cash:12+i,reward:0}))];
 const deducted=c==='deducted';
 acc.sort((x,y)=>Number(wdAvail(y)>=10)-Number(wdAvail(x)>=10));
 const avail=acc.filter(a=>wdAvail(a)>=10);
 const total=deducted?0:avail.reduce((s,a)=>s+wdAvail(a),0);
 const blocked=!avail.length;
 const left=`<div class="c flat v22-left"><b>${T('Linked accounts','연동된 계정')}</b>${['Bitget','OKX'].map(n=>`<div class="sb">${n} 1 UID</div>`).join('')}${c==='lighter'?'<div class="sb">Lighter (2 wallets)</div>':''}<div class="sb">EdgeX (1 wallet)</div><div class="sb">Aster (1 wallet)</div><div class="sb">ApeX (1 wallet)</div></div>`;
 const top=c==='balanceError'?`<div class="c flat">${v22Note("We can't load your balance right now.",'warn')}${v22Btn('Try again','sec sm')}</div>`
  :c==='loading'?`<div class="c v22-skel"></div>`
  :`<div class="c flat"><div class="kv big"><span class="k">${T('Total Claimable Cashback','출금 가능 캐시백')}</span><span class="v">${money(total)} USDT</span></div>${blocked?'<span class="bdg gy">Not eligible to withdraw</span>':''}${deducted?`<p class="sb">출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다 ${WD_TBD('영문','G-112')}</p>`:''}${blocked?`<p class="sb">출금 가능한 계정이 없어요. 캐시백 ${money(Math.min(...acc.map(wdNeed)))} USDT가 더 쌓이면 출금할 수 있어요.</p><p class="sb">이벤트 리워드는 같은 계정의 캐시백과 1:1로 매칭됩니다. 최소 출금액은 계정별 10 USDT입니다.</p><p class="sb">${WD_TBD('영문 「전부 불가」 문구 (후보 Minimum withdrawal is 10 USDT. Keep trading to reach it.)','G-108')}</p>`:''}</div>`;
 const shown=c==='many'?acc.slice(0,10):acc;
 const cards=c==='loading'?`<div class="c v22-skel"></div><div class="c v22-skel"></div>`:shown.map(a=>wdCard(a,c,{deducted})).join('')+(c==='many'?`<div class="sb v22-more">${T('See more','더보기')} (${acc.length-10}) ${WD_TBD('긴 목록 화면 내 스크롤 병행','G-114')}</div>`:'');
 const foot=c==='loading'?'':`<div class="c flat"><div class="kv"><span class="k">Network</span><span class="v">${c==='noNetwork'?'—':'BNB Smart Chain (BEP20)'}</span></div><p class="sb">Deposits are made to the above wallet address on BNB Smart Chain (BEP20).</p><div class="kv"><span class="k">Network fee</span><span class="v">테더맥스가 전액 부담 ${WD_TBD('영문','G-111')}</span></div><p class="sb">Each wallet needs at least 10 USDT. Wallets under 10 USDT are not included this time. ${WD_TBD('매칭 기준 문구로 다듬기','G-109')}</p></div>`;
 return `<div class="pg"><div class="dlg v22-wd v22-full"><h3>Claim</h3><div class="row2 v22-wdgrid">${left}<div>${top}${cards}${foot}${c==='loading'?'':v22Auto()}</div></div>${c==='pending'?v22Note('확인 중(연동 시도중이에요) 계정은 이 목록에 없습니다 — 자동 지급 대상 아님'):''}</div></div>`;
}
function wdSecond(c){
 const acc=WD_ACC().map(a=>({...a,cash:Math.min(a.cash,4),reward:0}));
 return `${gnbPC()}<div class="pg"><section class="c"><h2>Trading just a bit more and you can claim.</h2><p>Cashback can be claimed for UIDs with 10 USDT or more in cashback.</p><p class="sb">${WD_TBD('UID → 거래 계정 · 「10 USDT 이상」 → 매칭 기준(A + MIN(B, A) ≥ 10) 문장 재작성','G-419')}</p>${acc.map(a=>{const p=pBy(a.partner);return `<div class="li">${v22Mk(p)}<span class="nm">${esc(p.name)}<span class="sb mono">${p.type==='DEX'?esc(a.identifier):'UID '+esc(mask(a.identifier))}</span></span><span class="am">${money(wdAvail(a))}<small>USDT</small><span class="sb">Trading just a bit more</span></span></div>`}).join('')}<div class="kv big"><span class="k">Cashback to be Claimed</span><span class="v">${money(acc.reduce((s,a)=>s+wdAvail(a),0))} USDT</span></div>${v22Btn('Go back','sec','data-go="home/S4"')}</section></div>`;
}
function wdReflect(c){
 const home=c==='deducted'?'16.68':'136.68';
 const rows={normal:'',deducted:`<div class="li"><span class="nm">${T('Claim Amount','출금 금액')} · EdgeX<span class="sb mono">${SAMPLE_WALLET}</span></span><span class="am">-120.00</span></div>`,restored:`<div class="li"><span class="nm">${T('Claim Amount','출금 금액')} · EdgeX<span class="sb mono">${SAMPLE_WALLET}</span></span><span class="am">-120.00</span></div><div class="li"><span class="nm">Withdrawal returned ${WD_TBD('요약 복원 행','G-113')}<span class="sb mono">${SAMPLE_WALLET}</span></span><span class="am">+120.00</span></div>`}[c];
 return `${gnbPC()}<div class="pg"><section class="c"><h3>${T('Home','홈')}</h3><div class="kv big"><span class="k">Total Cashback Balance</span><span class="v">${c==='restored'?'136.68':home} USDT</span></div>${c==='deducted'?'<p class="sb">출금 신청한 금액은 결과가 나올 때까지 잔액에서 제외됩니다</p>':''}${v22Auto()}</section><section class="c"><h3>${T('Cashback Summary','캐시백 요약')}</h3>${rows||'<p class="sb">—</p>'}</section><section class="c"><h3>${T('Live withdrawals','실시간 출금')}</h3>${c==='restored'?'<p class="sb">실패해 복원된 건은 피드에 Sent 항목이 생기지 않음</p>':c==='deducted'?'<p class="sb">처리 중 — 피드에 아직 없음 (자동 지급 완료 = 출금일 때만 표시)</p>':`<div class="li"><span class="nm">EdgeX<span class="sb mono">${SAMPLE_WALLET}</span></span><span class="am">120.00 USDT</span></div>`}</section></div>`;
}
v22Retire('wd/DW1','home/S4');v22Retire('wd/DW0','home/S4');
if(0)/* G-448 회원 출금 화면 삭제 */v22Register('wd/CLAIM',{group:'출금 (자동 지급)',label:'출금 화면 /withdrawal-apply',states:[
 ['normal','정상 — 가능 위 · 불가 아래, 같은 주소 DEX별 카드','REQ-134~137'],['allBlocked','전부 불가 — Not eligible to withdraw','REQ-136 · 139 · G-108'],['zero','DEX 캐시백 0 — 배너','REQ-146 · G-110'],
 ['loading','로딩 — 스켈레톤, 금액·버튼 없음','REQ-145'],['delayed','데이터 지연 — Last updated','REQ-147 · G-348'],['partner','파트너 오류 — 그 카드만','REQ-148'],['balanceError','잔액 오류','REQ-149'],
 ['deducted','선차감 반영','REQ-158 · G-112'],['preAccrual','적립 전 줄 (합계 미포함)','REQ-138 · G-127'],['many','계정 11개 이상 — 10개 + 더보기','REQ-134 · G-114'],['noNetwork','지급 네트워크 미설정','REQ-142'],['lighter','Lighter 카드 — Lighter (2 wallets)','REQ-137 · 150'],['pending','확인 중 계정은 목록에 없음','REQ-134']],
 render:wdScreen,modal:{background:'home/S4'},fu:['FU-030','FU-031','FU-032','FU-033','FU-034'],note:['.dlg','출금 화면 (표시 전용)','카드 = 로고·이름 · 식별자(DEX 지갑 전체) · Available Cashback · Exchange Cashback · Event Reward(있을 때만) · 칩. DEX 배지 없음(REQ-135). 금액·주소·네트워크 입력 없음(REQ-140 · 141). Auto Claim 옆 안내 문구 없음(REQ-144).']});
if(0)/* G-448 회원 출금 화면 삭제 */v22Register('wd/SECOND',{label:'두 번째 출금 화면 /withdrawal',states:[['normal','출금 가능 계정 없음 — STG 문구 + DEX 행','REQ-710 · G-419']],render:wdSecond,fu:['FU-036']});
v22Register('wd/REFLECT',{label:'선차감 · 복원 반영 위치',states:[['normal','지급 전','REQ-158'],['deducted','신청 생성 — 선차감 (같은 새로고침에 반영)','REQ-158'],['restored','최종 실패 — 복원','REQ-164 · G-113']],render:wdReflect,fu:['FU-034','FU-035'],note:['.pg','반영 위치','출금 화면 · 홈 · 캐시백 요약 · 실시간 출금 피드가 같은 레코드에서 같은 새로고침에 반영. 결과를 보여 주는 회원 화면은 없음(REQ-163).']});
v22Order('wd',['CLAIM','SECOND','REFLECT']);
}
