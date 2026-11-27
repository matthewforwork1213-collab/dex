// 점검: 최신 빌드(_latest.html)를 JSDOM으로 열어 모든 화면 × 상태 × (PC·모바일) × (EN·KO)를 렌더하고 오류를 모은다.
// 사용: node tools/check.cjs [화면id 접두사]
const fs=require('fs'),path=require('path');
const {JSDOM,VirtualConsole}=require('../../_프로토타입_V2.2/_점검도구/node_modules/jsdom');
const file=path.join(__dirname,'..','_latest.html');
const prefix=process.argv[2]||'';
const errs=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Could not parse CSS/.test(e.message))errs.push('jsdom: '+e.message)});
const dom=new JSDOM(fs.readFileSync(file,'utf8'),{url:'https://offline.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,beforeParse(w){w.PT_NO_MOUNT=true;w.alert=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};try{Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}})}catch(e){}}});
const w=dom.window,R=w.R;let n=0;const ban=[/페이백/,/payback(?!\))/i,/rebate/i,/non-member/i,/disconnect/i];
const missing=new Set();
for(const sc of R.screens){if(!sc.id.startsWith(prefix))continue;
 for(const st of sc.states)for(const vp of ['pc','mo'])for(const lang of ['en','ko']){
  w.eval(`S.vp=${JSON.stringify(vp)};S.lang=${JSON.stringify(lang)};S.screen=${JSON.stringify(sc.id)};S.state=${JSON.stringify(st.id)};`);
  try{w.eval('render()')}catch(e){errs.push(`${sc.id}:${st.id} ${vp}/${lang} 예외 ${e.message}`);continue}
  const fr=w.document.getElementById('pt-frame');const t=fr.textContent;n++;
  if(/없는 화면:|at Object\.render|Error:/.test(t))errs.push(`${sc.id}:${st.id} ${vp}/${lang} 렌더 오류: ${t.slice(0,160)}`);
  for(const el of fr.querySelectorAll('[data-go]')){const g=el.getAttribute('data-go');if(g&&!/^(cexd|brkd|back|@)/.test(g)&&!R.byId[g.split(':')[0]])missing.add(g.split(':')[0])}
  const vis=Array.from(fr.querySelectorAll('*')).filter(e=>!e.closest('.note')&&e.children.length===0).map(e=>e.textContent).join(' ');
  // 예외: 소유권 Step 1 확정 문구(REQ-725) — DEX 사이트의 지갑 연결 끊기를 뜻하며 테더맥스 연동 해제와 다름
  for(const re of ban)if(re.test(vis.replace(/\/payback/g,'').replace(/disconnect your wallet/gi,'')))errs.push(`${sc.id}:${st.id} ${vp}/${lang} 금지어 ${re}`);
 }}
console.log(`렌더 ${n}건 · 화면 ${R.screens.length} · 오류 ${errs.length}`);
errs.slice(0,80).forEach(e=>console.log(' -',e));
if(missing.size)console.log('아직 없는 이동 대상(다른 담당이 만들 수 있음):',[...missing].sort().join(', '));
process.exitCode=errs.length?1:0;
