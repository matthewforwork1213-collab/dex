/* 드롭다운처럼 생겼는데 눌러도 안 열리는 것을 찾는다.
   ▾ 가 붙어 있고 data-ddset 이 없으면 미배선이다. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const NL = String.fromCharCode(10);
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const out = [];
  for (const [nm, f, root] of [["사용자", "사용자화면_DEX영향도.html", "appin"],
                               ["백오피스", "백오피스_DEX영향도.html", "ad"]]) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
    await p.goto("file:///C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/" + f);
    await p.waitForTimeout(700);
    const hits = await p.evaluate((r) => {
      const o = [];
      for (let a = 0; a < P.length; a++) for (let c = 0; c < P[a].states.length; c++) {
        const id = P[a].id + "/" + P[a].states[c].id;
        for (const sub of [null, "cex", "dex"]) {
          S.pi = a; S.si = c; S.act = null; S.sub = sub; S.lang = "ko";
          try { g1(); g2(); stage(); } catch (e) { continue; }
          document.querySelectorAll("#" + r + " .sel,#" + r + " .rsel,#" + r + " .dd-b").forEach(e => {
            const cl = e.cloneNode(true);
            cl.querySelectorAll(".pin").forEach(x => x.remove());
            const t = (cl.textContent || "").replace(/\s+/g, " ").trim();
            if (t.indexOf("\u25be") < 0) return;          // ▾ 없으면 드롭다운 아님
            if (e.dataset.ddset) return;                  // 배선됨
            o.push(id + " :: " + t.slice(0, 40));
          });
        }
      }
      return [...new Set(o)];
    }, root);
    out.push("#### " + nm + " — 미배선 " + hits.length + "건");
    hits.forEach(h => out.push("   🔴 " + h));
    await p.close();
  }
  await b.close();
  fs.writeFileSync("_점검_미배선드롭다운.txt", out.join(NL), "utf8");
  console.log(out.join(NL));
})();
