/* 인터랙션 점검 — 드롭다운 35개 · 클릭 목적지 68상태 · 한/영 양쪽
   실행: node _점검_인터랙션.js   (jsdom 필요)
   드롭다운: 트리거를 찾고, 열고, 옵션을 고르고, 값이 반영되는지까지 확인
   목적지:   GO 맵에 정의한 라벨이 실제 요소에 배선됐는지 확인 */
const {JSDOM}=require("jsdom"); const fs=require("fs");
const NL=String.fromCharCode(10);
(async()=>{
for(const [nm,f,root] of [["사용자","사용자화면_DEX영향도.html","appin"],["백오피스","백오피스_DEX영향도.html","ad"]]){
 for(const lang of ["ko","en"]){
 const dom=new JSDOM(fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/"+f,"utf8"),{runScripts:"dangerously",pretendToBeVisual:true});
 await new Promise(r=>setTimeout(r,420));
 const r=dom.window.eval(`(function(){
   const miss=[],ok=[],bad=[];
   for(let pi=0;pi<P.length;pi++)for(let si=0;si<P[pi].states.length;si++){
     const id=P[pi].id+"/"+P[pi].states[si].id;
     S.pi=pi;S.si=si;S.act=null;S.lang="${lang}";
     try{g1();g2();stage()}catch(e){continue}
     const defs=(typeof DDS!=="undefined"&&DDS[id])||[];
     defs.forEach(d=>{
       const els=[...document.querySelectorAll("#${root} [data-ddset='"+d[2]+"']")];
       if(!els.length){miss.push(id+" : "+T(d[0],d[1])+" ("+d[2]+")");return}
       if(!OPT[d[2]]){bad.push(id+" : 미정의 묶음 "+d[2]);return}
       // 열어본다
       const el=els[0]; ddOpen(el,d[2]);
       const n=document.querySelectorAll(".ddp .ddo").length;
       if(!n)bad.push(id+" : "+d[2]+" 옵션 0개");
       else{
         // 첫 옵션 선택
         const o=document.querySelector(".ddp .ddo");
         const v=o.dataset.v; ddVal(el,v); ddClose();
         if((el.textContent||"").indexOf(v)<0)bad.push(id+" : "+d[2]+" 값 반영 실패");
         else ok.push(id+"/"+d[2]+"("+n+")");
       }
     });
   }
   return JSON.stringify({miss:miss,bad:bad,ok:ok.length});
 })()`);
 const o=JSON.parse(r);
 console.log("#### "+nm+" ["+lang+"] 작동 "+o.ok+" | 트리거 못찾음 "+o.miss.length+" | 오류 "+o.bad.length);
 if(o.miss.length)console.log("   ✗ "+o.miss.join(NL+"   ✗ "));
 if(o.bad.length)console.log("   ! "+o.bad.join(NL+"   ! "));
 dom.window.close();
 }
}})();


(async()=>{
for(const [nm,f,root] of [["사용자","사용자화면_DEX영향도.html","appin"],["백오피스","백오피스_DEX영향도.html","ad"]]){
 for(const lang of ["ko","en"]){
 const dom=new JSDOM(fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/"+f,"utf8"),{runScripts:"dangerously",pretendToBeVisual:true});
 await new Promise(r=>setTimeout(r,420));
 const r=dom.window.eval(`(function(){
   const out=[],none=[],unmatched=[];
   for(let pi=0;pi<P.length;pi++)for(let si=0;si<P[pi].states.length;si++){
     const id=P[pi].id+"/"+P[pi].states[si].id;
     S.pi=pi;S.si=si;S.act=null;S.lang="${lang}";
     try{g1();g2();stage();}catch(e){continue}
     const rows=[...document.querySelectorAll("#gol .gorow")].length;
     const nn=document.querySelectorAll("#gol .gonone").length;
     if(nn)none.push(id);
     // GO 에 정의했는데 실제 요소에 배선 안 된 것
     const defs=(typeof GO!=="undefined"&&GO[id])||[];
     defs.forEach(d=>{ if(d[2].charAt(0)==="@")return;
       const lab=T(d[0],d[1]);
       const hit=[...document.querySelectorAll("#${root} [data-go]")].some(e=>goLabel(e)===lab);
       if(!hit)unmatched.push(id+" : "+lab+" -> "+d[2]);
     });
     out.push(id+"("+rows+")");
   }
   return JSON.stringify({none:none,unmatched:unmatched,n:out.length});
 })()`);
 const o=JSON.parse(r);
 console.log("#### "+nm+" ["+lang+"] 상태 "+o.n+" | 이동없음 "+o.none.length+" | 배선실패 "+o.unmatched.length);
 if(o.unmatched.length)console.log("   ✗ "+o.unmatched.join(NL+"   ✗ "));
 dom.window.close();
 }
}})();

(async () => {
  const dom = new JSDOM(
    fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/백오피스_DEX영향도.html", "utf8"),
    { runScripts: "dangerously", pretendToBeVisual: true });
  await new Promise(r => setTimeout(r, 450));
  const out = dom.window.eval(`(function(){
  const out=[];
  const pi=P.findIndex(p=>p.id==="ex"), si=P[pi].states.findIndex(s=>s.id==="EX-2");
  for(const lang of ["ko","en"])for(const sub of [null,"cex","dex"]){
    S.pi=pi;S.si=si;S.act=null;S.lang=lang;S.sub=sub;
    g1();g2();stage();
    const t=(document.getElementById("ad").textContent||"").replace(/\\s+/g," ");
    const hasDex=/DEX fields|DEX 전용 필드/.test(t);
    const hasCex=/CEX fields|기존 CEX 필드/.test(t);
    out.push(lang+"/"+(sub||"기본")
      +"  on="+[...document.querySelectorAll("#ad .cp.on")].map(e=>e.textContent.trim()).join("|")
      +"  토글="+document.querySelectorAll("#ad [data-sub]").length
      +"  브로커="+(/Brokers|브로커/.test(t)?"언급만":"없음")
      +"  DEX필드="+(hasDex?"Y":"N")
      +"  CEX필드="+(hasCex?"Y":"N"));
  }
  S.sub=null;S.lang="ko";S.si=P[pi].states.findIndex(s=>s.id==="EX-1");stage();
  ddOpen(document.querySelector("#ad [data-ddset='EXTYPE']"),"EXTYPE");
  out.push("EXTYPE 선택지 = "+[...document.querySelectorAll(".ddp .ddo")].map(e=>e.dataset.v).join(" / "));
  ddClose();
  return out.join(String.fromCharCode(10));
})()`);
  fs.writeFileSync("subchk3.txt", out, "utf8");
  dom.window.close();
})();
