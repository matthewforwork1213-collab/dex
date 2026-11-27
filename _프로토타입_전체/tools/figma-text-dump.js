// Figma MCP `use_figma`로 실행하는 플러그인 코드 — 노드별 「보이는 실제 문구」(인스턴스 내부 포함)를 JSON으로 돌려준다.
// 1) python -I tools/figma-fetch.py --ids  → tools/out/figma-ids.json
// 2) 아래 IDS에 그 목록(100개 안팎씩)을 넣어 use_figma(fileKey hsa3bSV9QmFTe2jsf6tzTm)로 실행
// 3) 반환 문자열을 파일로 저장 → python -I tools/figma-fetch.py --merge <파일>  → ref/figma_text.json
// 4) python -I tools/figma-diff.py
const IDS = [/* "28960:126884", ... */];
const KIND = [['button', /button|variant=|^cta/i], ['chip', /chip/i], ['tab', /\btabs?\b|<tab/i], ['input', /textfield|input|select|toggle|autocomplete|search/i]];
const BD = /^(backdrop|scrim|dim|overlay)\b|\/ scrim$|\bbackdrop$/i;
const kindOf = names => { for (const nm of names) for (const [k, rx] of KIND) if (rx.test(nm)) return k; return 'text'; };
const nodes = {};
for (const id of IDS) {
  const node = await figma.getNodeByIdAsync(id);
  if (!node) { nodes[id] = { missing: true }; continue; }
  let hidden = false;
  for (let p = node; p && p.type !== 'PAGE' && p.type !== 'DOCUMENT'; p = p.parent) if (p.visible === false) hidden = true;
  const texts = [];
  const walk = (n, names) => {
    if (n.visible === false || (names.length && BD.test(n.name))) return;   // 모달 뒤 배경은 빼고
    if (n.type === 'TEXT') { texts.push({ t: n.characters, kind: kindOf(names) }); return; }
    if ('children' in n) for (const c of n.children) walk(c, [n.name, ...names].slice(0, 4));
  };
  walk(node, []);
  const kids = 'children' in node ? node.children : [];
  const overlay = kids.some(c => BD.test(c.name) || ('children' in c && c.children.some(g => BD.test(g.name))));
  nodes[id] = { name: node.name, w: node.width, h: node.height, hidden, overlay, texts };
}
return JSON.stringify({ source: 'use_figma', fetched: new Date().toISOString(), nodes });
