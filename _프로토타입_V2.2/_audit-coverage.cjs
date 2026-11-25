// 기능명세서(프론트) 화면 문구 커버리지
//  - 「있어야 할 문구」: REQ 행의 `…` 토큰 중 화면 문구로 볼 수 있는 것 → 프로토타입 어느 화면·상태·언어에라도 나와야 함
//  - 「없어야 할 문구」: 같은 문장에 「쓰지 않/금지/두지 않/0건/폐기/삭제/빼고/제거/없음/하지 않」이 붙은 토큰 → 어디에도 나오면 안 됨
//  - 제외: 수식·필드명·경로·코드·Figma 프레임 ID 등 화면 문구가 아닌 것
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('./_점검도구/node_modules/jsdom');
const latest=p=>fs.readdirSync(__dirname).filter(f=>f.startsWith(p)&&f.endsWith('.html')).sort().at(-1);
function allText(file,mode){
 const vc=new VirtualConsole();const dom=new JSDOM(fs.readFileSync(path.join(__dirname,file),'utf8'),{url:'https://offline.invalid/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.setInterval=()=>0;w.setTimeout=()=>0;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{}}});
 const w=dom.window,doc=w.document,api=w.V21_READY,keys=w.eval('P.flatMap(p=>p.states.map(s=>p.id+"/"+s.id))');let out='';
 for(const lang of ['ko','en']){w.eval('S.lang='+JSON.stringify(lang));for(const k of keys){api.nav(k);const grab=()=>{const r=doc.getElementById(mode==='user'?'appin':'ad');out+='\n'+r.textContent+' '+Array.from(r.querySelectorAll('input,textarea,option'),e=>(e.value||'')+' '+(e.placeholder||'')+' '+(e.textContent||'')).join(' ')};grab();const sel=doc.querySelector('#design-state');if(sel)for(const v of Array.from(sel.options,o=>o.value)){const s=doc.querySelector('#design-state');if(!s)break;s.value=v;s.dispatchEvent(new w.Event('change',{bubbles:true}));grab()}}}
 return out.replace(/\s+/g,' ');
}
const TECH=/^[\/#?]|^[A-Z0-9_.\-]+$|^[a-z0-9_.\-]+$|^[a-z]+[A-Z]\w*$|G-\d|REQ-|API-|JOB-|FCM|EMAIL|MB-|^https?:|\.(json|csv|webp|md|xlsx)$|[=×&]|\+ ?MIN|^\^|^[A-Z]{2,5}-\d|^(S\d|O\d|L\d|PE\d|DW\d|PW\d|IF\d)\b|\bx\d|^\d/;
const NEG=/(쓰지 않|금지|두지 않|0건|0개|폐기|삭제|빼고|제거|하지 않|넣지 않|않는다|대신)/;
function tokens(md){
 const pos=new Map(),neg=new Map();
 for(const r of md.split('\n').filter(l=>/^\| REQ-\d{3} \|/.test(l))){
  const id=r.slice(2,9),cells=r.split(' | ').slice(2,3); // 요구사항 칸만
  for(const cell of cells){
   if((cell.match(/`/g)||[]).length%2)continue;
   const re=/`([^`]{2,140})`/g;let m;
   while(m=re.exec(cell)){const t=m[1].trim();
    if(TECH.test(t)||!/[A-Za-z가-힣]/.test(t)||/[|]/.test(t)||t.length<3)continue;
    const after=cell.slice(m.index+m[0].length,m.index+m[0].length+40),before=cell.slice(Math.max(0,m.index-12),m.index);
    const isNeg=NEG.test(after.split(/[.·,]/)[0])||/쓰지 않는 것|쓰지 않음|금지/.test(before);
    const map=isNeg?neg:pos;if(!map.has(t))map.set(t,new Set());map.get(t).add(id)}}}
 for(const t of neg.keys())pos.delete(t);
 return {pos,neg};
}
const norm=s=>s.replace(/\s+/g,' ').replace(/[’']/g,"'").toLowerCase();
const has=(text,t)=>t.split(/\{[^}]*\}/).map(x=>norm(x).trim()).filter(x=>x.length>=2).every(p=>text.includes(p));
const res={};
for(const [mode,file,spec] of [['user',latest('사용자화면_DEX_V2.2_'),'../02.기획문서/프론트_기능명세서_사용자.md'],['admin',latest('백오피스_DEX_V2.2_'),'../02.기획문서/프론트_기능명세서_백오피스.md']]){
 const text=norm(allText(file,mode)),{pos,neg}=tokens(fs.readFileSync(path.join(__dirname,spec),'utf8'));
 const missing=[],found=[],violations=[];
 for(const [t,ids] of pos)(has(text,t)?found:missing).push([t,[...ids].join(',')]);
 for(const [t,ids] of neg)if(has(text,t)&&t.length>=4)violations.push([t,[...ids].join(',')]);
 res[mode]={total:pos.size,found:found.length,missing,violations};
 console.log(`${mode}: 있어야 할 문구 ${pos.size} · 있음 ${found.length} (${Math.round(found.length/pos.size*100)}%) · 없음 ${missing.length} | 없어야 할 문구 ${neg.size} · 위반 ${violations.length}`);
}
fs.writeFileSync(path.join(__dirname,'_audit-coverage.json'),JSON.stringify(res,null,1));
