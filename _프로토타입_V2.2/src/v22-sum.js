// ===== V2.2 · 배치 5a — 캐시백 요약 · 랭킹 (FU-060 ~ FU-063) =====
if(MODE==='user'){
const SM_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
function smFilters(c){
 const ex=c==='dexRange'?'DEX 전체':T('All Exchanges','모든 거래소');
 return `<div class="v22-filter"><label>${T('Exchange','거래소')} <select><option>${T('All Exchanges','모든 거래소')}</option><optgroup label="${T('Range','범위')}"><option>${T('All','전체')}</option><option>CEX 전체</option><option ${c==='dexRange'?'selected':''}>DEX 전체</option></optgroup><optgroup label="CEX"><option>Bitget (2 UIDs)</option><option>OKX (1 UID)</option></optgroup><optgroup label="DEX"><option>EdgeX (1 wallet)</option><option>Aster (2 지갑)</option></optgroup></select></label>
 <label>${T('Account','계정')} <select><option>${T('All Accounts','모든 거래 계정')}</option>${c==='account'?`<option selected>${SAMPLE_WALLET}</option><option>${SAMPLE_WALLET2}</option>`:''}</select></label>
 <span class="v22-checks">${T('All Types','모든 캐시백 유형')}: <label><input type="checkbox" checked> Trading Cashback / ${T('','캐시백')}</label><label><input type="checkbox" checked> Event Reward / 이벤트 리워드</label><label><input type="checkbox" ${c==='types'?'':'checked'}> Claim Amount / 출금 금액</label></span>
 ${v22Btn(T('Reset','재설정'),'sec sm')}${v22Btn(T('Search','검색'),'sm')}</div><p class="sb">${SM_TBD('Trading Cashback → Exchange Cashback 개명','G-365')}${c==='oneEmpty'?' · '+SM_TBD('1개 선택 빈 상태 문구','G-180'):''}</p>`;
}
function smSummary(c){
 const none=c==='noMonth';
 const rows={
  normal:[['B','Exchange Cashback',`Bitget UID ****6789`,'+25.00'],['E','BTC Prediction Reward',`EdgeX <span class="mono">${SAMPLE_WALLET}</span>`,'+2.00'],['E','Exchange Cashback',`EdgeX <span class="mono">${SAMPLE_WALLET}</span>`,'+12.40'],['O','Claim Amount',`OKX UID ****4321`,'−20.00'],['A','Coupon',`Aster <span class="mono">${SAMPLE_WALLET2}</span>`,'+10.00'],['E','Cashback Challenge Reward',`EdgeX <span class="mono">${SAMPLE_WALLET}</span>`,'+5.00']],
 }.normal;
 let list=rows.map(([m,t,w,a])=>`<div class="li"><span class="ava">${m}</span><span class="nm">${t}<span class="sb">${w}</span></span><span class="am">${a}<small>USDT</small></span></div>`).join('');
 if(c==='returned')list+=`<div class="li"><span class="ava">E</span><span class="nm">Withdrawal returned ${SM_TBD('복원 행','G-113')}<span class="sb">EdgeX <span class="mono">${SAMPLE_WALLET}</span></span></span><span class="am">+120.00<small>USDT</small></span></div>`;
 if(c==='pending')list=`<div class="li"><span class="ava">B</span><span class="nm">Exchange Cashback<span class="sb">Bitget UID ****6789</span></span><span class="am">+25.00<small>USDT</small></span></div><div class="li"><span class="ava">E</span><span class="nm">DEX data pending<span class="sb">EdgeX — ${T('not 0 — data not received yet','0원 아님 — 아직 집계 전')} ${SM_TBD('DEX 적립 건 상태 enum','G-059')}</span></span><span class="am">—</span></div>`;
 if(['noMonth','noDay','oneEmpty'].includes(c))list=`<div class="v22-empty">No cashback activity yet.</div>`;
 const delayed=c==='delayed'?v22Note('신규 적립 내역 반영이 지연되고 있습니다. 기존 확정 잔액은 그대로이며 출금할 수 있어요.','warn'):'';
 const cal=Array.from({length:31},(_,i)=>{const d=i+1,v={23:'+120.03',26:'+17.40'}[d]||'';return `<span class="${d===26?'on':''}"><small>${d}</small>${c==='pending'&&d===26?'<em>DEX data pending</em>':v&&!none?`<b>${v}</b>`:''}</span>`}).join('');
 return `${gnbPC()}<div class="pg">${delayed}<section class="c"><h2>Cashback Summary</h2>${smFilters(c)}</section>
 <section class="c"><div class="ch"><h3>2026.05</h3><span>‹ ›</span></div>${none?`<div class="v22-empty">There is no cashback history for this month.</div>`:`<div class="c flat"><b>Monthly total cashback</b><div class="kv"><span class="k">Received</span><span class="v">+37.40 USDT</span></div><div class="kv"><span class="k">Withdrawn</span><span class="v">−20.00 USDT</span></div><div class="kv"><span class="k">Net</span><span class="v">+17.40 USDT</span></div><p class="sb">All amounts are shown in USDT. Cashback a DEX pays in USDC is shown 1:1 in USDT. Each calendar day shows the net amount. ${SM_TBD('캡션 USDC 언급','G-055')}</p></div>`}
 <div class="v22-cal">${cal}</div>${c==='old'?`<p class="sb">${T('DEX data covers the last 180 days and is not backfilled.','DEX 데이터 조회 범위는 최근 180일 — 백필 안 함')}</p>`:''}</section>
 <section class="c"><div class="ch"><h3>Date</h3><span>2026/05/26 (Today)</span></div>${list}</section></div>`;
}
function smRank(c){
 const all=[['Bitget','UID ****5687','1st'],['EdgeX',`<span class="mono">${v22Short(SAMPLE_WALLET)}</span>`,'2nd'],['Bybit','UID ****9171','3rd'],['Aster',`<span class="mono">${v22Short(SAMPLE_WALLET2)}</span>`,'–']];
 const rows=c==='dex'?all.filter(r=>/EdgeX|Aster/.test(r[0])):all;
 const panel=c==='empty'?`<div class="v22-empty">There are currently no eligible accounts for ranking.</div>`:rows.map(([e,i,r])=>`<div class="li"><span class="nm">${e}<span class="sb">${i}</span></span><span class="am">${r}</span></div>`).join('');
 return `${gnbPC()}<div class="pg"><section class="c"><h2>${T('Monthly cashback ranking','월간 캐시백 랭킹')}</h2><p class="sb">${T('Ranked by commission cashback earned (not trading volume). Event and invite rewards are excluded.','순위 기준 = 그달 커미션 캐시백 적립액(거래량 아님). 이벤트·초대 리워드 제외')}</p><div class="tabs"><span class="${c==='dex'?'':'on'}">전체</span><span>CEX</span><span class="${c==='dex'?'on':''}">DEX</span></div>
 <div class="v21-table"><table class="t"><thead><tr><th>#</th><th>${T('Account','거래 계정')}</th><th>${T('Exchange','거래소')}</th><th>${T('Cashback earned','적립 캐시백')}</th></tr></thead><tbody>${(c==='dex'?[[1,SAMPLE_WALLET,'EdgeX','30.00'],[2,SAMPLE_WALLET2,'Aster','12.10']]:[[1,'****1234','Bitget','52.40'],[2,SAMPLE_WALLET,'EdgeX','30.00'],[3,'****9171','Bybit','25.00']]).map(([n,a,e,v])=>`<tr><td>${n}</td><td class="mono">${a}</td><td>${e}</td><td>${v} USDT</td></tr>`).join('')}</tbody></table></div>
 <p class="sb">캐시백 0.01 USDT 미만은 순위에 포함되지 않습니다.</p>
 <div class="c flat"><b>Monthly Top ${SM_TBD('Top Trader 제목 재검토','REQ-384')} Rewards</b><p class="sb">based on cashback earned · 1st 100 · 2nd 50 · 3rd 20 · top 10% 10 USDT — ${T('paid as event rewards (matching applies); ranking rewards alone cannot be withdrawn','이벤트 리워드로 지급 · 매칭 적용 — 랭킹 리워드만으로는 출금할 수 없어요')}</p></div></section>
 <section class="c"><h3>My Cashback Ranking</h3><div class="tabs"><span class="on">2026.05</span><span>2026.04</span></div><p class="sb">Rankings are updated daily at ${v22Clock('00:01')} ${SM_TBD('00:01 기준 시간대','G-186')}</p>${panel}</section></div>`;
}
v22Retire('hist/CS3','hist/SUM');v22Retire('rk/RK2','rk/RANK');
v22Register('hist/SUM',{group:'캐시백 요약',label:'캐시백 요약',states:[['normal','필터 · 월간 카드 · 캘린더 · 일별 목록','REQ-365~371 · 378'],['dexRange','거래소 범위 DEX 전체','REQ-365'],['account','계정 필터 — 지갑 전체 주소','REQ-366'],['types','유형 체크박스','REQ-367'],['pending','DEX data pending — 0 아님','REQ-373 · 377'],['returned','Withdrawal returned 행','REQ-372 · G-113'],['noMonth','활동 없는 달','REQ-375'],['noDay','활동 없는 날 · 필터 결과 없음','REQ-375'],['oneEmpty','1개 선택 빈 상태','REQ-366 · G-180'],['delayed','데이터 지연 (허브 H6과 같음)','REQ-376 · G-348'],['old','180일 넘은 달','REQ-374']],render:smSummary,fu:['FU-060','FU-061','FU-062'],note:['.c','캐시백 요약','Search를 눌러야 적용, Reset = 전 필터 All(REQ-368). Net = Received − Withdrawn. EdgeX는 지갑당 일 1행(REQ-371).']});
v22Register('rk/RANK',{group:'캐시백 랭킹',label:'캐시백 랭킹',states:[['normal','한 순위표 CEX+DEX','REQ-379~384'],['dex','DEX 칩','REQ-379'],['empty','자격 계정 없음','REQ-383']],render:smRank,fu:['FU-063'],note:['.c','랭킹','정렬값 = 표시 USDT(USDC 1:1). Accruing·Pending·Withheld·보류 · 게스트·이슈·미연동·탈퇴 제외(REQ-380). 사이드 패널 행에 금액 없음(REQ-383).']});
}
