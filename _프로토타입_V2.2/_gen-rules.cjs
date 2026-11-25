// 화면이 아니라 규칙만 있는 기능(공통 표기·금액·시각·귀속 확인·감사·백필·회귀 등)을
// 기능명세서 원문 표 그대로 src/v22-zrules.js로 만듭니다. build.cjs가 먼저 실행합니다.
const fs=require('fs'),path=require('path');
const SPEC=path.join(__dirname,'..','02.기획문서');
const PICK={
 user:{file:'프론트_기능명세서_사용자.md',prefix:'FU',ids:['001','002','003','004','005','006','007','008','009','010','012','018','019','020','021','026','029','072','074','087','089']},
 admin:{file:'프론트_기능명세서_백오피스.md',prefix:'FA',ids:['030','031','032']}};
function parse(file,prefix){
 const lines=fs.readFileSync(path.join(SPEC,file),'utf8').split(/\r?\n/);const out={};let cur=null;
 for(const l of lines){
  const h=l.match(new RegExp('^#### ('+prefix+'-\\d{3})\\. (.+)$'));
  if(h){cur={id:h[1],title:h[2].trim(),desc:'',rows:[]};out[h[1]]=cur;continue}
  if(/^#{1,4} /.test(l)){cur=null;continue}
  if(!cur)continue;
  const d=l.match(/^\| 설명 \| (.+) \|$/);if(d){cur.desc=d[1];continue}
  if(/^\| REQ-\d+ \|/.test(l)){const c=l.split(/(?<!\\)\|/).slice(1,-1).map(x=>x.trim());cur.rows.push(c.slice(0,6))}
 }
 return out;
}
const data={};
for(const [mode,o] of Object.entries(PICK)){const all=parse(o.file,o.prefix);data[mode]=o.ids.map(n=>all[o.prefix+'-'+n]).filter(Boolean)}
const js=`// 자동 생성 — _gen-rules.cjs (기능명세서 원문). 직접 고치지 않습니다.
const V22_RULES=${JSON.stringify(data)};
{
const rmd=s=>esc(s).replace(/\`([^\`]+)\`/g,'<code>$1</code>');
const list=V22_RULES[MODE]||[];
function v22RuleView(f){
 const tbl=\`<div class="v21-table"><table class="t"><thead><tr><th>REQ</th><th>\${T('Item','구분')}</th><th>\${T('Content','내용')}</th><th>\${T('Acceptance','인수 기준')}</th><th>\${T('Priority','우선순위')}</th><th>\${T('Status','상태')}</th></tr></thead><tbody>\${f.rows.map(r=>\`<tr>\${r.map(c=>\`<td>\${rmd(c)}</td>\`).join('')}</tr>\`).join('')}</tbody></table></div>\`;
 const head=\`<p class="sb">\${rmd(f.desc)}</p><p class="sb">\${T('Rule-only feature — text below is the functional spec verbatim. Screens that apply these rules show them in place.','화면이 아니라 규칙인 기능 — 아래는 기능명세서 원문 그대로입니다. 규칙이 적용되는 화면에서 실제 모습을 확인합니다.')}</p>\`;
 return MODE==='admin'?v22AdmShell('Admin','',\`\${f.id}. \${esc(f.title)}\`,'<span></span>',\`<div class="bx">\${head}\${tbl}</div>\`):\`\${gnbPC()}<div class="pg"><section class="c"><h2>\${f.id}. \${esc(f.title)}</h2>\${head}\${tbl}</section></div>\`;
}
for(const f of list)v22Register('rule/'+f.id,{group:MODE==='admin'?'공통 규칙 (명세 원문)':'공통 규칙 (명세 원문)',label:f.id+' '+f.title,states:[['normal',T('Rules (verbatim)','규칙 원문'),f.rows.map(r=>r[0]).join(' · ')]],render:()=>v22RuleView(f),fu:[f.id]});
}
`;
fs.writeFileSync(path.join(__dirname,'src','v22-zrules.js'),js);
console.log('rules:',Object.entries(data).map(([m,a])=>m+' '+a.length+' 기능 · '+a.reduce((s,f)=>s+f.rows.length,0)+' REQ').join(' / '));
