const { JSDOM } = require("jsdom");
const fs = require("fs");
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
    const t=((document.getElementById("ad").textContent||"")+" "+
      (document.getElementById("icmt").textContent||"")).replace(/\\s+/g," ");
    out.push(lang+"/"+(sub||"기본")
      +"  on="+[...document.querySelectorAll("#ad .cp.on")].map(e=>e.textContent.trim()).join("|")
      +"  칩="+document.querySelectorAll("#ad .cp").length
      +"  정산통화="+(/Settlement currency|정산 통화/.test(t)?"Y":"N")
      +"  파트너API="+(/Partner API settings|파트너 API 설정/.test(t)?"Y":"N")
      +"  주1회경고="+(/Weekly settlement cannot|주 1회 정산을 여기서/.test(t)?"Y":"N")
      +"  소유확인유튜브="+(/UID ownership YouTube|UID 소유 확인 유튜브/.test(t)?"Y":"N")
      +"  브로커="+(/Brokers|브로커/.test(t)?"있음":"없음"));
  }
  // 순위 모달 — test 없음 · 이하생략 없음 · 드래그 가능
  S.sub=null;S.lang="ko";S.si=P[pi].states.findIndex(s=>s.id==="EX-7");stage();
  const t2=(document.getElementById("ad").textContent||"");
  out.push("EX-7  행="+document.querySelectorAll("#ad [data-dnd] .li").length
    +"  draggable="+document.querySelectorAll("#ad [data-dnd] [draggable='true']").length
    +"  test="+(/\\btest\\b/.test(t2)?"있음":"없음")
    +"  이하생략="+(/이하 생략|and the rest/.test(t2)?"있음":"없음")
    +"  번호="+[...document.querySelectorAll("#ad .ord")].map(e=>e.textContent).join(","));
  // 출금 트리 — 주소 클릭 전개
  const pj=P.findIndex(p=>p.id==="iv");
  S.pi=pj;S.si=0;stage();
  const el=document.querySelector("#ad [data-full]");
  const before=el?el.textContent.trim():"";
  if(el)el.dispatchEvent(new Event("click",{bubbles:true}));
  const after=el?el.textContent.trim():"";
  out.push("IV-1  축약="+before+"  →  클릭후="+after+"  ("+(after.length>before.length?"OK":"실패")+")");
  // 들어오는 경로 제거 확인
  let arrives=0;
  for(let a=0;a<P.length;a++)for(let b=0;b<P[a].states.length;b++){
    S.pi=a;S.si=b;S.act=null;S.sub=null;try{g1();g2();stage()}catch(e){continue}
    if(/들어오는 경로|Arrives from/.test(document.getElementById("fb").textContent||""))arrives++;
  }
  out.push("들어오는 경로 잔존 = "+arrives+"개");
  return out.join(String.fromCharCode(10));
})()`);
  fs.writeFileSync("subchk3.txt", out, "utf8");
  dom.window.close();
})();
