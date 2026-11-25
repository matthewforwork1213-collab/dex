const { JSDOM } = require("jsdom");
const fs = require("fs");
const NL = String.fromCharCode(10);
const FILES = [
  ["사용자 화면", "C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/사용자화면_DEX영향도.html", "appin", true],
  ["백오피스",   "C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/백오피스_DEX영향도.html",   "ad",   false],
];

function probe(root, hasView) {
  return `(function(){
  const V=[],E=[];
  const add=(k,id,d)=>V.push([k,id,d||""]);
  for(let pi=0;pi<P.length;pi++)for(let si=0;si<P[pi].states.length;si++){
    const id=P[pi].id+"/"+P[pi].states[si].id;
    S.pi=pi;S.si=si;S.act=null;S.lang="ko";${hasView ? 'S.view="pc";' : ''}
    try{g1();g2();stage();}catch(e){E.push("PC "+id+": "+e.message);continue;}

    // 1) 기기 안 설명 잔존
    const left=document.querySelectorAll("#${root} .note[data-kind],#${root} .hint[data-kind],#${root} .note.icm,#${root} .hint.icm,#${root} .c.icm").length;
    if(left)add("기기 안 설명 잔존",id,left+"개");

    // 2) 핀 ↔ 설명 패널 개수 일치
    const pins=document.querySelectorAll(".pin:not(.st)").length;
    const items=document.querySelectorAll(".np-i").length;
    if(S.notes&&pins!==items)add("핀≠패널",id,pins+" vs "+items);

    // 3) 설명 패널 빈 항목
    document.querySelectorAll(".np-i .tx").forEach(e=>{
      const t=(e.textContent||"").replace(/\\s+/g," ").trim();
      if(t.length<20)add("설명 너무 짧음",id,t.slice(0,40));
    });

    // 4) data-go 타깃 실존
    document.querySelectorAll("[data-go]").forEach(e=>{
      const t=e.getAttribute("data-go"),p=t.split("/")[0],q=t.split("/")[1];
      const pg=P.find(x=>x.id===p);
      if(!pg||!pg.states.find(x=>x.id===q))add("data-go 깨짐",id,t);
    });

    // 5) 이동 경로
    if(!document.querySelectorAll("[data-go]").length&&!document.querySelectorAll("#fb .fb").length)
      add("이동 경로 없음",id);

    // 6) 빈 카드 / 빈 버튼
    document.querySelectorAll("#${root} .btn").forEach(e=>{
      if(!(e.textContent||"").trim())add("빈 버튼",id);
    });

    ${hasView ? `
    // 7) 모바일 렌더
    S.view="mo";
    try{stage();}catch(e){E.push("MO "+id+": "+e.message);}
    S.view="pc";` : ''}

    // 8) 영문 전환
    S.lang="en";
    try{g1();g2();stage();}catch(e){E.push("EN "+id+": "+e.message);S.lang="ko";continue;}
    [...document.querySelectorAll("#${root} *")].filter(e=>!e.children.length).forEach(e=>{
      const t=(e.textContent||"").replace(/\\s+/g," ").trim();
      if(t.length>1&&/[가-힣]/.test(t))add("영문 모드에 한글",id,t.slice(0,46));
    });
    // GNB 도 전환되는가
    [...document.querySelectorAll("#g1 button,#g2 button")].forEach(b=>{
      const t=(b.textContent||"").replace(/\\s+/g," ").trim();
      if(/[가-힣]/.test(t))add("영문 모드 GNB 한글",id,t.slice(0,30));
    });
    S.lang="ko";
  }
  return JSON.stringify({V:V,E:E,n:P.reduce((a,p)=>a+p.states.length,0)});
})()`;
}

(async () => {
  let total = 0, bad = 0;
  for (const [name, f, root, hv] of FILES) {
    const dom = new JSDOM(fs.readFileSync(f, "utf8"), { runScripts: "dangerously", pretendToBeVisual: true });
    await new Promise(r => setTimeout(r, 450));
    let R;
    try { R = JSON.parse(dom.window.eval(probe(root, hv))); }
    catch (e) { console.log("### " + name + " PROBE 실패: " + e.message); dom.window.close(); continue; }
    total += R.n;
    console.log(NL + "######## " + name + " — 상태 " + R.n);
    console.log("렌더 오류 : " + (R.E.length ? NL + "  " + R.E.slice(0, 6).join(NL + "  ") : "없음"));
    const by = {};
    R.V.forEach(v => { (by[v[0]] = by[v[0]] || []).push(v); });
    const ks = Object.keys(by);
    if (!ks.length) console.log("위반      : 없음");
    ks.forEach(k => {
      bad += by[k].length;
      console.log("위반 [" + k + "] " + by[k].length + "건");
      by[k].slice(0, 10).forEach(v => console.log("   " + v[1] + "  " + v[2]));
      if (by[k].length > 10) console.log("   … 외 " + (by[k].length - 10));
    });
    dom.window.close();
  }
  console.log(NL + "총 " + total + " 상태 · 위반 " + bad + "건");
})();
