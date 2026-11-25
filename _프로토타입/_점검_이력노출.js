/* 기기 안에 작업 이력이 남아 있는지 — "제거했다 / 폐기 / 정정" 같은 말은 설명 패널 몫이다.
   핀 버튼이 붙으면 자식이 생기므로, 핀을 떼고 자기 텍스트만 본다. */
const { chromium } = require("playwright-core");
const fs = require("fs");
const NL = String.fromCharCode(10);
const PAT = ["— 제거", "- 제거", "제거했", "폐기", "정정했", "— removed", "deprecated",
  "빼기로", "없앴", "이었습니다", "였습니다", "V1 문구", "V1 copy", "TBD", "미정)"];
(async () => {
  const b = await chromium.launch({ channel: "msedge" });
  const out = [];
  for (const [nm, f, root] of [["사용자", "사용자화면_DEX영향도.html", "appin"],
                               ["백오피스", "백오피스_DEX영향도.html", "ad"]]) {
    const p = await b.newPage({ viewport: { width: 1920, height: 1000 } });
    await p.goto("file:///C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/" + f);
    await p.waitForTimeout(700);
    const hits = await p.evaluate(([r, pat]) => {
      const o = [];
      for (let a = 0; a < P.length; a++) for (let c = 0; c < P[a].states.length; c++) {
        const id = P[a].id + "/" + P[a].states[c].id;
        for (const sub of [null, "cex", "dex", "all"]) {
          S.pi = a; S.si = c; S.act = null; S.sub = sub; S.lang = "ko";
          try { g1(); g2(); stage(); } catch (e) { continue; }
          document.querySelectorAll("#" + r + " *").forEach(e => {
            const cl = e.cloneNode(true);
            cl.querySelectorAll(".pin").forEach(x => x.remove());
            if (cl.children.length) return;
            const t = (cl.textContent || "").replace(/\s+/g, " ").trim();
            pat.forEach(w => { if (t.indexOf(w) >= 0) o.push(id + " :: " + t.slice(0, 64)); });
          });
        }
      }
      return [...new Set(o)];
    }, [root, PAT]);
    out.push("#### " + nm + " — " + hits.length + "건");
    hits.forEach(h => out.push("   🔴 " + h));
    await p.close();
  }
  await b.close();
  fs.writeFileSync("_점검_이력노출.txt", out.join(NL), "utf8");
  console.log(out.join(NL));
})();
