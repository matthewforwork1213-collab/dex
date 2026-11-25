const { JSDOM } = require("jsdom");
const fs = require("fs");
const NL = String.fromCharCode(10);
(async () => {
  const out = [];
  for (const [nm, f, root] of [["사용자", "사용자화면_DEX영향도.html", "appin"],
                               ["백오피스", "백오피스_DEX영향도.html", "ad"]]) {
    for (const lang of ["ko", "en"]) {
      const dom = new JSDOM(
        fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/" + f, "utf8"),
        { runScripts: "dangerously", pretendToBeVisual: true });
      await new Promise(r => setTimeout(r, 420));
      out.push(dom.window.eval(`(function(){
  const res=[];
  for(let pi=0;pi<P.length;pi++)for(let si=0;si<P[pi].states.length;si++){
    const id=P[pi].id+"/"+P[pi].states[si].id;
    S.pi=pi;S.si=si;S.act=null;S.sub=null;S.lang="${lang}";
    try{g1();g2();stage()}catch(e){continue}
    const defs=(typeof DDS!=="undefined"&&DDS[id])||[];
    defs.forEach(d=>{
      const el=document.querySelector("#${root} [data-ddset='"+d[2]+"']");
      if(!el)return;
      ddOpen(el,d[2]);
      const sc=[...document.querySelectorAll(".ddp .ddsb")].map(e=>e.dataset.v);
      const grp=[...document.querySelectorAll(".ddp .ddh")].map(e=>e.textContent);
      if(sc.length){
        // DEX 범위를 눌러본다
        const dex=[...document.querySelectorAll(".ddp .ddsb")].pop();
        dex.dispatchEvent(new Event("click",{bubbles:true}));
        const after=(el.textContent||"").replace(/\\s+/g," ").trim();
        res.push("${lang} "+id+" ["+d[2]+"]  범위="+sc.join("/")+"  그룹="+grp.join("/")+"  DEX선택후='"+after+"'");
      }else{
        res.push("${lang} "+id+" ["+d[2]+"]  범위=없음  그룹="+(grp.join("/")||"(없음)"));
      }
      ddClose();
    });
  }
  return res.join(String.fromCharCode(10));
})()`));
      dom.window.close();
    }
  }
  fs.writeFileSync("scchk.txt", out.join(NL), "utf8");
})();
