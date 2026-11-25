const { chromium } = require("playwright-core");
const fs = require("fs");
const NL = String.fromCharCode(10);
const FILES = [
  ["사용자", "C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/사용자화면_DEX영향도.html", "#app", ".stagewrap"],
  ["백오피스", "C:/Users/oem/Desktop/tethermax_project/DEX/_프로토타입/백오피스_DEX영향도.html", "#ad", ".adwrap"],
];
(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const out = [];
  for (const [nm, f, devSel, wrapSel] of FILES) {
    for (const w of [1920, 1440, 1280, 1024, 820]) {
      const page = await browser.newPage({ viewport: { width: w, height: 1000 } });
      await page.goto("file:///" + f);
      await page.waitForTimeout(500);
      const r = await page.evaluate(([d, wr]) => {
        const wrap = document.querySelector(wr), dev = document.querySelector(d);
        const wb = wrap.getBoundingClientRect(), db = dev.getBoundingClientRect();
        return {
          docOver: document.documentElement.scrollWidth - window.innerWidth,
          wrapScroll: wrap.scrollWidth - wrap.clientWidth,
          devLeftInWrap: Math.round(db.left - wb.left + wrap.scrollLeft),
          wrapW: Math.round(wrap.clientWidth), devW: Math.round(db.width),
        };
      }, [devSel, wrapSel]);
      const clipped = r.docOver > 1 || r.devLeftInWrap < -1;
      out.push((clipped ? "!! 잘림  " : "OK      ") + nm + " " + w + "px"
        + "  문서넘침=" + r.docOver
        + "  내부가로스크롤=" + r.wrapScroll + "px"
        + "  기기 " + r.devW + " / 영역 " + r.wrapW
        + "  기기왼쪽offset=" + r.devLeftInWrap);
      await page.close();
    }
  }
  await browser.close();
  fs.writeFileSync("clip2.txt", out.join(NL), "utf8");
})();
