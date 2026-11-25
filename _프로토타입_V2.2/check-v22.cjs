// V2.2 점검: 모든 화면 × 상태를 오프라인(JSDOM)으로 열어 2026-11-24 확정 문서 기준 항목을 확인합니다.
const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM,VirtualConsole}=require('./_점검도구/node_modules/jsdom');
const latest=prefix=>fs.readdirSync(__dirname).filter(f=>f.startsWith(prefix)&&f.endsWith('.html')).sort().at(-1);
const FILES={user:latest('사용자화면_DEX_V2.2_'),admin:latest('백오피스_DEX_V2.2_')};
const results=[],errors=[],dump=[];
const check=(name,fn)=>{try{fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}};
function open(mode){const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Could not parse CSS/.test(e.message))errors.push(mode+': '+e.message)});const dom=new JSDOM(fs.readFileSync(path.join(__dirname,FILES[mode]),'utf8'),{url:'https://offline.invalid/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.setInterval=()=>0;w.setTimeout=()=>0;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{}}});return {w:dom.window,doc:dom.window.document,api:dom.window.V21_READY,mode}}
const root=x=>x.doc.getElementById(x.mode==='user'?'appin':'ad');
const txt=x=>root(x).textContent.replace(/\s+/g,' ');
function visit(x,k,fn){x.api.nav(k);fn(k,'normal');const sel=x.doc.querySelector('#design-state');if(!sel)return;for(const v of Array.from(sel.options,o=>o.value)){if(v==='normal')continue;const s=x.doc.querySelector('#design-state');if(!s)break;s.value=v;s.dispatchEvent(new x.w.Event('change',{bubbles:true}));fn(k,v)}}

const u=open('user'),a=open('admin');
const ukeys=u.w.eval('P.flatMap(p=>p.states.map(s=>p.id+"/"+s.id))'),akeys=a.w.eval('P.flatMap(p=>p.states.map(s=>p.id+"/"+s.id))');
check('사용자: 지운 화면이 목록에 없음',()=>{for(const k of ['home/EXP','link/E4','wd/DW2','wd/DW3','wd/NM','link/L0','link/L3','link/L7','link/L8','link/PENDING','wd/DW1','wd/DW0'])assert(!ukeys.includes(k),k)});
check('사용자: 새 화면이 목록에 있음',()=>{for(const k of ['own/O2','own/O3','own/O10','own/O11','own/O14','link/SEL','link/SHEET','link/GRID','link/ADDR','link/CAPTCHA','link/PROC','link/RESULT','link/DONE','link/HOME','pbk/P1','pbk/P5'])assert(ukeys.includes(k),k)});
check('백오피스: 새 화면이 목록에 있음',()=>{for(const k of ['dx/REC','ac/AUDIT','dx/RPT','ac/BOOST','dx/CHS','dx/QZ'])assert(akeys.includes(k),k)});

const banUser=[/페이백/,/\*\*\*\*(9EE7|fb77|51E9)/i,/회원가입 없이/,/CEX 전용 챌린지/,/귀속 기간/,/귀속 만료/,/참여 거래소/,/준비되지 않았습니다/,/신청이 완료되었어요/,/공유하기/,/전체 주소 보기/,/다른 회원에게 연동된 지갑입니다/];
for(const k of ukeys)visit(u,k,(k,s)=>{
 const t=txt(u);dump.push(`## user ${k} [${s}]\n${t}\n`);
 check(`user ${k} [${s}] 렌더`,()=>assert(t.trim().length>20));
 check(`user ${k} [${s}] 금지 문구 없음`,()=>{for(const re of banUser)assert(!re.test(t),re+' :: '+(t.match(re)||[''])[0])});
 check(`user ${k} [${s}] 출금 버튼은 비활성 Auto Claim`,()=>{for(const b of root(u).querySelectorAll('button,.btn,[data-go],[data-action]')){const bt=b.textContent.trim();assert(!['출금하기','Withdraw','리워드 출금'].includes(bt),k+' '+bt);if(bt==='Auto Claim')assert(b.disabled,'Auto Claim enabled')}});
});
const banAdmin=[/DEX에는 소유권 심사 대상이 없습니다/,/페이백율/,/페이백 챌린지 · CEX 전용/,/\*\*\*\*51E9/];
for(const k of akeys)visit(a,k,(k,s)=>{
 const t=txt(a);dump.push(`## admin ${k} [${s}]\n${t}\n`);
 check(`admin ${k} [${s}] 렌더`,()=>assert(t.trim().length>20));
 check(`admin ${k} [${s}] 금지 문구 없음`,()=>{for(const re of banAdmin)assert(!re.test(t),re+'')});
});
// 화면별 확인
const at=(x,k,s='normal')=>{x.api.nav(k);if(s!=='normal'){const e=x.doc.querySelector('#design-state');e.value=s;e.dispatchEvent(new x.w.Event('change',{bubbles:true}))}return txt(x)};
check('O1 = Wallet Already in Use + Verify Ownership',()=>{const t=at(u,'own/O1');assert(/Wallet Already in Use/.test(t)&&/Verify Ownership/.test(t)&&/Try a different wallet/.test(t))});
check('연동 결과 「타인 사용 중」 = 소유권 진입',()=>assert(/Verify Ownership/.test(at(u,'link/RESULT','inuse'))));
check('주소 검증 ⑤ 체크섬 문구',()=>assert(/invalid checksum. Copy it again directly from EdgeX/.test(at(u,'link/ADDR','e5'))));
check('옛 연동 키는 새 화면으로 이동',()=>{u.api.nav('link/L3');assert.equal(u.w.eval('key()'),'link/ADDR')});
check('결과 다이얼로그 Need help 링크',()=>{for(const s of ['normal','mine','other','pending'])assert(/Need help\? Contact Support/.test(at(u,'link/RESULT',s)),s)});
check('O2 쿨다운 원문',()=>assert(/available after 30 days/.test(at(u,'own/O2'))));
check('O3 업로드 완료 전 Submit Claim 비활성',()=>{at(u,'own/O3');const b=Array.from(root(u).querySelectorAll('button')).find(x=>x.textContent.trim()==='Submit Claim');assert(b&&b.disabled)});
check('챌린지 수령 계정에 DEX',()=>assert(/DEX/.test(at(u,'ch/CH2'))&&/EdgeX/.test(txt(u))));
check('쿠폰 계정 선택 제목',()=>assert(/Select an account to apply this coupon|이 쿠폰을 적용할 계정을 선택하세요/.test(at(u,'cp/COUPON','picker'))));
check('퍼널 Bybit Summary 각주',()=>assert(/Calculated based on paid trading fees/.test(at(u,'pbk/P5','cex'))));
check('챌린지 CEX 전용 문구 없음',()=>assert(!/CEX 전용/.test(at(u,'ch/CH1'))));
check('부스트에 DEX 행',()=>assert(/EdgeX/.test(at(u,'etc/BST'))));
check('맥스보드 DEX 보드',()=>assert(/EdgeX (맥스보드|MaxBoard)/.test(at(u,'mb/BOARD'))));
check('출금 화면: Network fee · Auto Claim · 결과 표시 없음',()=>{const t=at(u,'wd/CLAIM');assert(/Network fee/.test(t)&&/Auto Claim/.test(t)&&!/처리 중|Sent|실패/.test(t))});
check('출금 카드 DEX 배지 없음',()=>{at(u,'wd/CLAIM');for(const card of u.doc.querySelectorAll('.v22-wcard'))assert(!/DEX/.test(card.querySelector('.ch').textContent))});
check('부족분 계산 A=3,B=0 → 7.00',()=>assert(/7\.00 USDT 더 받으면/.test(at(u,'wd/CLAIM'))));
check('로딩 상태엔 금액 없음',()=>{at(u,'wd/CLAIM','loading');assert(!/USDT/.test(root(u).querySelector('.v22-wd').textContent))});
check('초대 리워드: 계정 선택 없음',()=>{const t=at(u,'inv/IF8','rewards');assert(/관리자가 지정한|admin designated/.test(t)&&!root(u).querySelector('[data-action=selectRewardAccount]'))});
check('지갑 상세 · 홈 지갑 표기는 0x 형식',()=>assert(/0x5290…9EE7/.test(at(u,'home/S4'))));
check('출금 피드는 지갑 전체 주소',()=>assert(/0x52908400098527886E0F7030069857D2E4169EE7/.test(at(u,'etc/FEED'))));
check('백오피스 메뉴 Account',()=>{at(a,'ac/AC-1');assert(/Account/.test(txt(a))&&/계정 리스트/.test(txt(a)))});
check('소유 확인 심사에 DEX 행',()=>assert(/EdgeX/.test(at(a,'ac/AC-2'))&&/10 ?(분|minutes)/.test(at(a,'ac/AC-2'))));
check('수동 연동: 송금 대기 상태',()=>assert(/판정 대상이 아닙니다/.test(at(a,'ac/AC-3','prelink'))));
check('전체 내역: 지급 구분',()=>assert(/연동 전 출금/.test(at(a,'pb/PB-1'))));
// 변경점 표시
const staleNote=/뒤 4자리|CEX 전용 챌린지|진행률에 포함하지 않으며|부스트는 CEX 전용|소유권 확인 심사는 CEX 전용|소유권 확인 가이드는 CEX 전용|고객센터로 안내합니다|공통 출금 버튼|신청 성공 상태|페이백|DEX 계정도 선택할 수 있습니다/;
for(const [x,keys] of [[u,ukeys],[a,akeys]]){x.w.eval('S.notes=true');for(const k of keys){x.api.nav(k);const notes=x.api.getReviewNotes();check(`${x.mode} ${k} 변경점 표시`,()=>{for(const n of notes)assert(!staleNote.test(n.title+' '+n.body),n.body)});}x.w.eval('S.notes=false')}
u.w.eval('S.notes=true');for(const k of ['own/O1','own/O3','link/PROC','link/ADDR','wd/CLAIM','mb/BOARD','etc/BST']){u.api.nav(k);check(`user ${k} V2.2 변경점 있음`,()=>assert(u.api.getReviewNotes().length>0))}u.w.eval('S.notes=false');
a.w.eval('S.notes=true');for(const k of ['ac/AC-2','ac/AC-3','pb/PB-1','dx/REC']){a.api.nav(k);check(`admin ${k} V2.2 변경점 있음`,()=>assert(a.api.getReviewNotes().length>0))}a.w.eval('S.notes=false');
check('스크립트 오류 없음',()=>assert.equal(errors.length,0,errors.slice(0,5).join(' | ')));
const fail=results.filter(r=>!r.pass);
fs.writeFileSync(path.join(__dirname,'점검결과_V2.2.json'),JSON.stringify({files:FILES,total:results.length,pass:results.length-fail.length,fail},null,1));
fs.writeFileSync(path.join(__dirname,'_화면텍스트_V2.2.txt'),dump.join('\n'));
console.log(`${results.length-fail.length}/${results.length} 통과`);for(const f of fail.slice(0,40))console.log('FAIL',f.name,'::',f.error);
