// 디자인 누락 목록 추출: _latest.html의 레지스트리에서 figma 없는 상태를 뽑아 ref/gaps.json으로 쓴다.
// 문서 화면(doc:true)은 제외. 한쪽 뷰포트만 있는 상태는 viewport_missing으로 표시.
const fs=require('fs'),path=require('path');
const {JSDOM,VirtualConsole}=require('../../_프로토타입_V2.2/_점검도구/node_modules/jsdom');
const dom=new JSDOM(fs.readFileSync(path.join(__dirname,'..','_latest.html'),'utf8'),{url:'https://offline.invalid/',runScripts:'dangerously',virtualConsole:new VirtualConsole(),beforeParse(w){w.alert=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};try{Object.defineProperty(w,'localStorage',{value:{getItem:()=>null,setItem:()=>{}}})}catch(e){}}});
const R=dom.window.R;const groups=Object.fromEntries(R.groups.map(g=>[g.id,g]));
const out=[],one=[],per={};let total=0,full=0,partial=0;
for(const sc of R.screens){if(sc.doc)continue;
 for(const st of sc.states){total++;const f=st.figma;
  const pc=f&&(typeof f==='string'?f:f.pc),mo=f&&typeof f==='object'?f.mo:null;
  const p=per[sc.group]||(per[sc.group]={group:sc.group,label:groups[sc.group]?.label||sc.group,order:groups[sc.group]?.order??999,screens:new Set(),total:0,both:0,one:0,none:0});
  p.screens.add(sc.id);p.total++;
  if(pc||mo){full++;if(!(pc&&mo)){partial++;p.one++;one.push({screen:sc.id,state:st.id,label:st.label,has:pc?'pc':'mo',node:pc||mo})}else p.both++;continue}
  p.none++;
  out.push({group:sc.group,groupLabel:groups[sc.group]?.label||sc.group,order:groups[sc.group]?.order??999,screen:sc.id,title:sc.title,route:sc.route||'',fu:sc.fu,state:st.id,label:st.label,note:st.note||''})}}
out.sort((a,b)=>a.order-b.order);
const groupsOut=Object.values(per).sort((a,b)=>a.order-b.order).map(p=>({...p,screens:p.screens.size}));
// 이전 실행에서 붙인 near/what/vp 보존
let prev={};try{for(const it of JSON.parse(fs.readFileSync(path.join(__dirname,'..','ref','gaps.json'),'utf8')).items)prev[it.screen+':'+it.state]=it}catch(e){}
for(const it of out){const p=prev[it.screen+':'+it.state];if(p)for(const k of ['near','what','vp'])if(p[k]!=null)it[k]=p[k]}
fs.writeFileSync(path.join(__dirname,'..','ref','gaps.json'),JSON.stringify({total,designed:full,partial,missing:out.length,groups:groupsOut,oneViewport:one,items:out},null,1));
console.log({total,designed:full,onlyOneViewport:partial,missing:out.length});
