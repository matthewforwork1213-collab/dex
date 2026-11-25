const { JSDOM } = require("jsdom");
const fs = require("fs");
(async () => {
  const dom = new JSDOM(
    fs.readFileSync("C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/사용자화면_DEX영향도.html", "utf8"),
    { runScripts: "dangerously", pretendToBeVisual: true });
  await new Promise(r => setTimeout(r, 450));
  const out = dom.window.eval(`(function(){
 const o=[];
 const pi=P.findIndex(p=>p.id==="etc"), si=P[pi].states.findIndex(s=>s.id==="EML");
 for(const lang of ["ko","en"])for(const sub of ["cex","dex"]){
  S.pi=pi;S.si=si;S.act=null;S.lang=lang;S.sub=sub;g1();g2();stage();
  const t=(document.getElementById("appin").textContent||"").replace(/\\s+/g," ");
  o.push(lang+"/"+sub
   +"  제목="+(t.indexOf("UID Binding Success")>=0?"UID":(t.indexOf("Wallet Binding Success")>=0?"Wallet":"?"))
   +"  H2="+(t.indexOf("UID linkage completed")>=0?"UID":(t.indexOf("Wallet linkage completed")>=0?"Wallet":"?"))
   +"  값="+(t.indexOf("0x7a3F9c2B41")>=0?"42자주소":(t.indexOf("1234567")>=0?"UID 1234567":"?"))
   +"  Network행="+(t.indexOf("Network")>=0?"Y":"N")
   +"  토글="+document.querySelectorAll("#appin [data-sub]").length);
 }
 const sb=P[pi].states.findIndex(s=>s.id==="BST");
 S.si=sb;S.lang="ko";S.sub=null;stage();
 const nt=[...document.querySelectorAll(".np-i .tx")].map(e=>(e.textContent||"").trim());
 o.push("BST 주석 "+nt.length+"개 / 길이 "+nt.map(x=>x.length).join(","));
 return o.join(String.fromCharCode(10));
})()`);
  fs.writeFileSync("emlchk.txt", out, "utf8");
  dom.window.close();
})();
