// Unit tests with in-memory doubles. No browser, network or native UI.
const fs=require('fs'),vm=require('vm'),path=require('path');
function element(text=''){
  const classes=new Set();
  return {textContent:text,dataset:{},children:[],handlers:{},
    classList:{add(...xs){xs.forEach(x=>classes.add(x))},remove(...xs){xs.forEach(x=>classes.delete(x))},contains(x){return classes.has(x)}},
    querySelector(){return null},appendChild(child){this.children.push(child);child.parentNode=this},removeChild(child){this.children=this.children.filter(x=>x!==child);child.parentNode=null},
    addEventListener(type,handler){this.handlers[type]=handler}};
}
const results=[];
for(const [name,file] of [['user','사용자화면_DEX영향도.html'],['admin','백오피스_DEX영향도.html']]){
  const nodes={};const document={getElementById:id=>nodes[id]||(nodes[id]=element()),querySelectorAll:()=>[],addEventListener(){},createElement:()=>element()};
  const context=vm.createContext({document});
  const html=fs.readFileSync(path.join(__dirname,'..','_프로토타입',file),'utf8');
  const code=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).join('\n').replace(/\ball\(\);\s*$/,'');
  vm.runInContext(code,context,{timeout:10000});
  context.trigger=element('Lighter ▾');
  const before=vm.runInContext('JSON.stringify(S)',context);
  vm.runInContext('ddOpen(trigger,"EXDEX")',context);
  const popup=context.trigger.children[0];
  popup.handlers.click({stopPropagation(){},target:{closest:selector=>selector==='.ddo'?{dataset:{v:'ApeX'}}:null}});
  const after=vm.runInContext('JSON.stringify(S)',context);
  results.push({name,test:'파트너 변경',label:context.trigger.textContent,stateChanged:before!==after,meaning:'선택 표시만 바뀌고 화면 상태 S는 유지됨. 요율·목록·결과 동기화 없음.'});
  if(name==='admin'){
    context.trigger=element('CEX ▾');
    vm.runInContext('ddOpen(trigger,"EXTYPE_CEX")',context);
    const popup2=context.trigger.children[0];
    popup2.handlers.click({stopPropagation(){},target:{closest:selector=>selector==='.ddo'?{dataset:{v:'DEX'},className:'ddo no'}:null}});
    results.push({name,test:'CEX 전용에서 제외된 DEX 선택',label:context.trigger.textContent,accepted:context.trigger.textContent.startsWith('DEX'),meaning:'제외 스타일만 있고 이벤트 핸들러에 선택 차단 조건 없음.'});
  }
}
fs.writeFileSync(path.join(__dirname,'dropdown_checks.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
