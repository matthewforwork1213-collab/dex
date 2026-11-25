const { chromium } = require("playwright-core");
const fs = require("fs");
const NL = String.fromCharCode(10);
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const out = [];
  // 사용자 — 정적 드롭다운 범위 선택 · 제목
  let p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await p.goto("file:///C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/사용자화면_DEX영향도.html");
  await p.waitForTimeout(700);
  out.push(await p.evaluate(() => {
    const o = [];
    const pi = P.findIndex(x => x.id === "etc");
    P[pi].states.forEach((st, si) => { S.pi = pi; S.si = si; S.act = null; S.sub = null; g1(); g2(); stage(); });
    ["EVT", "BST", "TP"].forEach(id => {
      const si = P[pi].states.findIndex(x => x.id === id);
      S.pi = pi; S.si = si; S.act = null; S.sub = null; g1(); g2(); stage();
      const sc = [...document.querySelectorAll("#appin .ddsc .ddsb")].map(e => e.textContent.trim());
      o.push(id + "  제목='" + P[pi].states[si].ko + "'  정적범위=" + (sc.length ? sc.join("/") : "없음"));
    });
    // R1 · CS3 도
    ["rule/R1", "hist/CS3"].forEach(k => {
      const [g, i2] = k.split("/");
      const a = P.findIndex(x => x.id === g), c = P[a].states.findIndex(x => x.id === i2);
      S.pi = a; S.si = c; S.act = null; S.sub = null; g1(); g2(); stage();
      const sc = [...document.querySelectorAll("#appin .ddsc .ddsb")].map(e => e.textContent.trim());
      o.push(k + "  정적범위=" + (sc.length ? sc.join("/") : "없음"));
    });
    return o.join(String.fromCharCode(10));
  }));
  await p.close();
  // 백오피스 — lnb · 그룹 · NEW
  p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
  await p.goto("file:///C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/백오피스_DEX영향도.html");
  await p.waitForTimeout(700);
  out.push(await p.evaluate(() => {
    const o = [];
    o.push("그룹: " + P.map(x => x.ko).join(" | "));
    let und = 0, newbad = 0;
    for (let a = 0; a < P.length; a++) for (let c = 0; c < P[a].states.length; c++) {
      S.pi = a; S.si = c; S.act = null; S.sub = null; try { g1(); g2(); stage(); } catch (e) { continue; }
      const t = document.getElementById("ad").textContent || "";
      if (t.indexOf("undefined") >= 0) { und++; o.push("  🔴 undefined: " + P[a].id + "/" + P[a].states[c].id); }
      if (t.indexOf("UID Ownership Verification") >= 0) {
        const el = [...document.querySelectorAll("#ad *")].find(e => (e.textContent || "").trim().startsWith("UID Ownership Verification"));
        const hasNew = el && el.querySelector(".tg.nw");
        o.push("  UID Ownership Verification  NEW배지=" + (hasNew ? "🔴 있음" : "없음"));
      }
      ["PB-1", "SD-2", "PT-1"].forEach(id => {
        if (P[a].states[c].id === id) {
          const sc = [...document.querySelectorAll("#ad .ddsc .ddsb")].map(e => e.textContent.trim());
          o.push("  " + id + " 정적범위=" + (sc.length ? sc.join("/") : "없음"));
        }
      });
    }
    o.push("undefined 총 " + und + "건");
    return o.join(String.fromCharCode(10));
  }));
  await p.close();
  await b.close();
  fs.writeFileSync("vfy.txt", out.join(NL), "utf8");
})();
