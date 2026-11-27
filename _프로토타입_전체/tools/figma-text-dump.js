// Figma MCP `use_figma`로 실행 — 노드별 「보이는 실제 문구」(인스턴스 내부 포함 · 불투명도 0 · 채움 없음 · 잘림 · 위 레이어에 가려짐 · 설계 메모 레이어 제외)와, GEO = true면 문구·버튼·카드의 좌표(프레임 원점 기준)를 돌려준다.
// use_figma 반환은 48KB 한도 → 결과를 LZ 압축해 {"s","n","next","total","z"}로 돌려준다. n < total - s 이면 START = next로 다시 실행.
// 1) python -I tools/figma-fetch.py --ids  → tools/out/figma-ids.json
// 2) 아래 IDS·GEO·START를 채워 use_figma(fileKey hsa3bSV9QmFTe2jsf6tzTm)로 실행(한도 오류 시 60초 대기 후 재시도)
// 3) 반환 문자열을 한 줄씩 파일에 모아 → python -I tools/figma-fetch.py --merge <파일>  → ref/figma_text.json · ref/figma_geom.json
// 4) python -I tools/figma-diff.py
const IDS = [/* "28960:126884", ... */]; const GEO = false; const START = 0;
const LZ=(u)=>{const K="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";const bits=6;let i,v,dict={},create={},wc,w="",enl=2,dsz=3,nb=2,data=[],dv=0,dp=0;const out=(b)=>{dv=(dv<<1)|b;if(dp==bits-1){dp=0;data.push(K.charAt(dv));dv=0}else dp++};const outv=(val,n)=>{for(let j=0;j<n;j++){out(val&1);val>>=1}};for(let ii=0;ii<u.length;ii++){const c=u.charAt(ii);if(!Object.prototype.hasOwnProperty.call(dict,c)){dict[c]=dsz++;create[c]=true}wc=w+c;if(Object.prototype.hasOwnProperty.call(dict,wc))w=wc;else{if(Object.prototype.hasOwnProperty.call(create,w)){const cc=w.charCodeAt(0);if(cc<256){outv(0,nb);outv(cc,8)}else{outv(1,nb);outv(cc,16)}enl--;if(enl==0){enl=Math.pow(2,nb);nb++}delete create[w]}else outv(dict[w],nb);enl--;if(enl==0){enl=Math.pow(2,nb);nb++}dict[wc]=dsz++;w=String(c)}}if(w!==""){if(Object.prototype.hasOwnProperty.call(create,w)){const cc=w.charCodeAt(0);if(cc<256){outv(0,nb);outv(cc,8)}else{outv(1,nb);outv(cc,16)}enl--;if(enl==0){enl=Math.pow(2,nb);nb++}delete create[w]}else outv(dict[w],nb);enl--;if(enl==0){enl=Math.pow(2,nb);nb++}}outv(2,nb);while(true){dv=(dv<<1);if(dp==bits-1){data.push(K.charAt(dv));break}else dp++}return data.join('')};
const KIND = [['b', /button|variant=|^cta/i], ['c', /chip/i], ['t', /\btabs?\b|<tab/i], ['i', /textfield|input|select|toggle|autocomplete|search/i]];
const BD = /^(backdrop|scrim|dim|overlay)\b|\/ scrim$|\bbackdrop$|· 배경$/i;
// 설계 메모 레이어(화면 문구 아님): 프레임 이름 또는 글자 레이어 이름으로 판정 — 비교 대상에서 뺀다
const MEMO = /SCREEN-LABEL|^API[- ]?\d|· 입력$|^(상태|판정) · |^(진입|금액 기준|행 기준|수정 내용·근거)$|개발 메모|정책 변경 메모|설계 메모|인계 메모/i;
const SHELL = /webprelogin|gnb|navigation|footer|^header$|^top ?nav|bottom ?nav|tab ?bar|^frame 8100$|bottomnavigation/i;
// 위에 겹친 불투명 레이어(나중에 그려지는 형제 · 단색 채움)에 완전히 가려진 글자는 보이지 않는 것으로 본다
const inside = (a, c) => a.x >= c.x - 1 && a.y >= c.y - 1 && a.x + a.width <= c.x + c.width + 1 && a.y + a.height <= c.y + c.height + 1;
const opaque = n => n.visible !== false && n.type !== 'TEXT' && !!n.absoluteBoundingBox && !('opacity' in n && n.opacity < 0.99) && !(n.blendMode && !['NORMAL', 'PASS_THROUGH'].includes(n.blendMode)) && Array.isArray(n.fills) && n.fills.some(f => f.visible !== false && (f.opacity === undefined || f.opacity >= 0.99) && f.type === 'SOLID');
// 고정 높이 글상자(textAutoResize NONE · TRUNCATE): 글상자 대신 실제 글줄 범위(줄 수 × 줄 높이, 세로 정렬 반영)로 잰다
const contentBox = (n, b, rb) => {
  if (!rb || !['NONE', 'TRUNCATE'].includes(n.textAutoResize)) return [b.y, b.height];
  const fs = typeof n.fontSize === 'number' ? n.fontSize : 14, lh = n.lineHeight && n.lineHeight.unit === 'PIXELS' ? n.lineHeight.value : n.lineHeight && n.lineHeight.unit === 'PERCENT' ? fs * n.lineHeight.value / 100 : fs * 1.2;
  const h = Math.min(b.height, Math.max(1, Math.ceil((rb.height - fs * 0.2) / lh)) * lh);
  const y = n.textAlignVertical === 'CENTER' ? b.y + (b.height - h) / 2 : n.textAlignVertical === 'BOTTOM' ? b.y + b.height - h : b.y;
  return [y, h];
};
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
  // 화면에 실제로 보이는 글자만: 누적 불투명도 0 · 보이는 채움 없음 · 렌더 범위 없음 · 잘림(clipsContent) 밖 · 설계 메모 레이어는 뺀다
  const isect = (a, c) => !c || (a.x < c.x + c.width && a.x + a.width > c.x && a.y < c.y + c.height && a.y + a.height > c.y);
  const walk = (n, names, d, op = 1, clip = null, covers = [], shell = false) => {
    shell = shell || (d > 0 && SHELL.test(n.name));   // GNB · 푸터 · 하단 탭 하위 = 종류 's'(figma-diff.py가 공통 셸 화면 cmn.*에서만 대조)
    if (n.visible === false || (names.length && BD.test(n.name))) return;
    if (d > 0 && MEMO.test(n.name)) return;
    op *= ('opacity' in n ? n.opacity : 1); if (op <= 0.01) return;
    const b = GEO ? n.absoluteBoundingBox : null;
    if (n.type === 'TEXT') {
      if (d === 1 && /^state$/i.test(n.name)) return;   // 프레임 위 상태 제목 라벨(설계 메모 — 예: 주소 검증 프레임 `State`)
      const fillOk = !Array.isArray(n.fills) || n.fills.some(f => f.visible !== false && (f.opacity === undefined || f.opacity > 0.01));
      const rb = n.absoluteRenderBounds;
      const ab = n.absoluteBoundingBox, inRoot = ab && isect(ab, node.absoluteBoundingBox);   // 프레임 아래로 접힌(잘린) 내용은 그대로 둔다
      if (!fillOk || (!rb && inRoot) || (rb && !isect(rb, clip)) || ((rb || ab) && covers.some(c => inside(rb || ab, c)))) return;
      const k = shell ? 's' : kindOf(names);
      if (!b) { X.push(k ? [n.characters, k] : [n.characters]); return; }
      const [cy, ch] = contentBox(n, b, rb);
      X.push([n.characters, k, R(b.x - ox), R(cy - oy), R(b.width), R(ch)]); return;
    }
    if (d > 0 && n.clipsContent && n.absoluteBoundingBox) { const a = n.absoluteBoundingBox; clip = clip ? (() => { const x = Math.max(a.x, clip.x), y = Math.max(a.y, clip.y); return { x, y, width: Math.max(0, Math.min(a.x + a.width, clip.x + clip.width) - x), height: Math.max(0, Math.min(a.y + a.height, clip.y + clip.height) - y) }; })() : a; }
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
    // 배경(Backdrop) 위 모달 프레임: 배경보다 먼저 그려진 형제(흐려진 뒤 화면)는 대조하지 않는다 — figma-diff.py 색인 규칙과 같음
    if ('children' in n) { const ks = n.children; let bi = -1; ks.forEach((c, j) => { if (c.visible !== false && BD.test(c.name)) bi = j }); for (let k = bi + 1; k < ks.length; k++) { const later = []; for (let j = k + 1; j < ks.length; j++) if (opaque(ks[j])) later.push(ks[j].absoluteBoundingBox); walk(ks[k], [n.name, ...names].slice(0, 4), d + 1, op, clip, later.length ? covers.concat(later) : covers, shell); } }
  };
  walk(node, [], 0);
  const kids = 'children' in node ? node.children : [];
  const overlay = kids.some(c => BD.test(c.name) || ('children' in c && c.children.some(g => BD.test(g.name))));
  parts.push(JSON.stringify([id, 1, node.name, R(node.width), R(node.height), hidden ? 1 : 0, overlay ? 1 : 0, X, GEO ? E : 0]));
}
let n = parts.length, z = '';
while (n > 0) { z = LZ('[' + parts.slice(0, n).join(',') + ']'); if (z.length <= 46500) break; n = Math.max(1, Math.min(n - 1, Math.floor(n * 46500 / z.length * 0.92))); if (n === 1) { z = LZ('[' + parts[0] + ']'); if (z.length > 46500) z = LZ('[' + JSON.stringify([IDS[START], 2]) + ']'); break; } }
return { s: START, n, next: START + n, total: IDS.length, z };
