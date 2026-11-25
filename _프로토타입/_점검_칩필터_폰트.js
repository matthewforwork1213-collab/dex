const { JSDOM } = require("jsdom");
const fs = require("fs");
const NL = String.fromCharCode(10);
(async () => {
  const out = [];
  for (const lang of ["ko", "en"]) {
    const dom = new JSDOM(
      fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/사용자화면_DEX영향도.html", "utf8"),
      { runScripts: "dangerously", pretendToBeVisual: true });
    await new Promise(r => setTimeout(r, 420));
    out.push(dom.window.eval(`(function(){
  const o=[];
  const pi=P.findIndex(p=>p.id==="link"), si=P[pi].states.findIndex(s=>s.id==="L0");
  for(const v of [null,"all","cex","dex"]){
    S.pi=pi;S.si=si;S.act=null;S.lang="${lang}";S.sub=v;g1();g2();stage();
    const grp=[...document.querySelectorAll("#appin .dd-g")].map(e=>e.textContent.trim().split(" ")[0]);
    const rows=[...document.querySelectorAll("#appin .li .nm")].map(e=>e.childNodes[0].textContent.trim());
    const on=[...document.querySelectorAll("#appin .chip.on")].map(e=>e.textContent.trim());
    o.push("${lang}/"+(v||"기본")+"  칩="+document.querySelectorAll("#appin .chip[data-sub]").length
      +"  선택='"+on.join(",")+"'  그룹="+(grp.join("/")||"(없음)")+"  행="+rows.join(","));
  }
  // 최소 폰트
  let min=99;
  S.sub=null;
  for(let a=0;a<P.length;a++)for(let b=0;b<P[a].states.length;b++){
    S.pi=a;S.si=b;S.act=null;try{g1();g2();stage()}catch(e){continue}
    [...document.querySelectorAll("#sbody *")].forEach(e=>{
      const st=(e.getAttribute&&e.getAttribute("style"))||"";
      const m=st.match(/font-size:([0-9.]+)px/);
      if(m)min=Math.min(min,parseFloat(m[1]));
    });
  }
  o.push("인라인 최소 폰트 = "+min+"px");
  return o.join(String.fromCharCode(10));
})()`));
    dom.window.close();
  }
  fs.writeFileSync("chipchk.txt", out.join(NL), "utf8");
})();
