// Figma MCP `use_figma`로 실행 — 노드별 「보이는 실제 문구」(인스턴스 내부 포함)와, GEO = true면 문구·버튼·카드의 좌표(프레임 원점 기준)를 돌려준다.
// use_figma 반환은 48KB 한도 → 결과를 LZ 압축해 {"s","n","next","total","z"}로 돌려준다. n < total - s 이면 START = next로 다시 실행.
// 1) python -I tools/figma-fetch.py --ids  → tools/out/figma-ids.json
// 2) 아래 IDS·GEO·START를 채워 use_figma(fileKey hsa3bSV9QmFTe2jsf6tzTm)로 실행(한도 오류 시 60초 대기 후 재시도)
// 3) 반환 문자열을 한 줄씩 파일에 모아 → python -I tools/figma-fetch.py --merge <파일>  → ref/figma_text.json · ref/figma_geom.json
// 4) python -I tools/figma-diff.py
const IDS = [/* "28960:126884", ... */]; const GEO = false; const START = 0;
const LZ=(u)=>{const K="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";const bits=6;let i,v,dict={},create={},wc,w="",enl=2,dsz=3,nb=2,data=[],dv=0,dp=0;const out=(b)=>{dv=(dv<<1)|b;if(dp==bits-1){dp=0;data.push(K.charAt(dv));dv=0}else dp++};const outv=(val,n)=>{for(let j=0;j<n;j++){out(val&1);val>>=1}};for(let ii=0;ii<u.length;ii++){const c=u.charAt(ii);if(!Object.prototype.hasOwnProperty.call(dict,c)){dict[c]=dsz++;create[c]=true}wc=w+c;if(Object.prototype.hasOwnProperty.call(dict,wc))w=wc;else{if(Object.prototype.hasOwnProperty.call(create,w)){const cc=w.charCodeAt(0);if(cc<256){outv(0,nb);outv(cc,8)}else{outv(1,nb);outv(cc,16)}enl--;if(enl==0){enl=Math.pow(2,nb);nb++}delete create[w]}else outv(dict[w],nb);enl--;if(enl==0){enl=Math.pow(2,nb);nb++}dict[wc]=dsz++;w=String(c)}}if(w!==""){if(Object.prototype.hasOwnProperty.call(create,w)){const cc=w.charCodeAt(0);if(cc<256){outv(0,nb);outv(cc,8)}else{outv(1,nb);outv(cc,16)}enl--;if(enl==0){enl=Math.pow(2,nb);nb++}delete create[w]}else outv(dict[w],nb);enl--;if(enl==0){enl=Math.pow(2,nb);nb++}}outv(2,nb);while(true){dv=(dv<<1);if(dp==bits-1){data.push(K.charAt(dv));break}else dp++}return data.join('')};
const KIND = [['b', /button|variant=|^cta/i], ['c', /chip/i], ['t', /\btabs?\b|<tab/i], ['i', /textfield|input|select|toggle|autocomplete|search/i]];
const BD = /^(backdrop|scrim|dim|overlay)\b|\/ scrim$|\bbackdrop$/i;
const kindOf = names => { for (const nm of names) for (const [k, rx] of KIND) if (rx.test(nm)) return k; return ''; };
const own = nm => { for (const [k, rx] of KIND) if (rx.test(nm)) return k; return ''; };
const R = v => Math.round(v);
const parts = []; const t0 = Date.now(); let i = START;
for (; i < IDS.length; i++) {
  if (Date.now() - t0 > 40000) break;
  const id = IDS[i];
  const node = await figma.getNodeByIdAsync(id);
  if (!node) { parts.push(JSON.stringify([id, 0])); continue; }
  let hidden = false;
  for (let p = node; p && p.type !== 'PAGE' && p.type !== 'DOCUMENT'; p = p.parent) if (p.visible === false) hidden = true;
  const bb = node.absoluteBoundingBox || { x: 0, y: 0 };
  const ox = bb.x, oy = bb.y;
  const X = [], E = [];
  const firstText = n => { if (n.type === 'TEXT') return n.characters; if ('children' in n) for (const c of n.children) { if (c.visible === false) continue; const r = firstText(c); if (r) return r; } return ''; };
  const walk = (n, names, d) => {
    if (n.visible === false || (names.length && BD.test(n.name))) return;
    const b = GEO ? n.absoluteBoundingBox : null;
    if (n.type === 'TEXT') { const k = kindOf(names); X.push(b ? [n.characters, k, R(b.x - ox), R(b.y - oy), R(b.width), R(b.height)] : (k ? [n.characters, k] : [n.characters])); return; }
    if (GEO && b && d > 0 && E.length < 400) {
      const k = (n.type === 'INSTANCE' || n.type === 'FRAME') ? own(n.name) : '';
      let kind = k;
      if (!kind && Array.isArray(n.fills) && n.fills.some(f => f.type === 'IMAGE' && f.visible !== false)) kind = 'img';
      if (!kind && (n.type === 'FRAME' || n.type === 'INSTANCE' || n.type === 'COMPONENT') && b.width >= 120 && b.height >= 40 && !(Math.abs(b.width - node.width) < 2 && Math.abs(b.height - node.height) < 2)) {
        const cr = typeof n.cornerRadius === 'number' ? n.cornerRadius : 4;
        const fill = Array.isArray(n.fills) && n.fills.some(f => f.visible !== false && f.type === 'SOLID' && (f.opacity === undefined || f.opacity > 0.05));
        const stroke = Array.isArray(n.strokes) && n.strokes.some(f => f.visible !== false);
        if (cr >= 4 && (fill || stroke)) kind = 'card';
      }
      if (kind) E.push([kind, (kind === 'card' || kind === 'img') ? n.name.slice(0, 30) : firstText(n).slice(0, 40), R(b.x - ox), R(b.y - oy), R(b.width), R(b.height)]);
    }
    if ('children' in n) for (const c of n.children) walk(c, [n.name, ...names].slice(0, 4), d + 1);
  };
  walk(node, [], 0);
  const kids = 'children' in node ? node.children : [];
  const overlay = kids.some(c => BD.test(c.name) || ('children' in c && c.children.some(g => BD.test(g.name))));
  parts.push(JSON.stringify([id, 1, node.name, R(node.width), R(node.height), hidden ? 1 : 0, overlay ? 1 : 0, X, GEO ? E : 0]));
}
let n = parts.length, z = '';
while (n > 0) { z = LZ('[' + parts.slice(0, n).join(',') + ']'); if (z.length <= 46500) break; n = Math.max(1, Math.min(n - 1, Math.floor(n * 46500 / z.length * 0.92))); if (n === 1) { z = LZ('[' + parts[0] + ']'); if (z.length > 46500) z = LZ('[' + JSON.stringify([IDS[START], 2]) + ']'); break; } }
return { s: START, n, next: START + n, total: IDS.length, z };
