// 프로토타입 레지스트리(V22_REG)에서 기능 → 화면 → 상태 → 요구사항 대응표(MD)를 만듭니다.
const fs=require('fs'),path=require('path'),{JSDOM,VirtualConsole}=require('./_점검도구/node_modules/jsdom');
const latest=p=>fs.readdirSync(__dirname).filter(f=>f.startsWith(p)&&f.endsWith('.html')).sort().at(-1);
const FILES={user:latest('사용자화면_DEX_V2.2_'),admin:latest('백오피스_DEX_V2.2_')};
function open(mode){const dom=new JSDOM(fs.readFileSync(path.join(__dirname,FILES[mode]),'utf8'),{url:'https://offline.invalid/',runScripts:'dangerously',virtualConsole:new VirtualConsole(),beforeParse(w){w.setInterval=()=>0;w.setTimeout=()=>0;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{}}});return dom.window}
const SPEC=path.join(__dirname,'..','02.기획문서');
function specIds(file,prefix){const s=fs.readFileSync(path.join(SPEC,file),'utf8');const out=[];const re=new RegExp('^#### ('+prefix+'-\\d{3})\\. (.+)$','gm');let m;while((m=re.exec(s)))out.push([m[1],m[2].trim()]);return out}
const FEAT={user:specIds('프론트_기능명세서_사용자.md','FU'),admin:specIds('프론트_기능명세서_백오피스.md','FA')};
const esc=s=>String(s).replace(/\|/g,'\\|');
let md=`# 프로토타입 V2.2 기능별 화면·상태 대응표

| 항목 | 내용 |
|---|---|
| 대상 | 프론트·백엔드 개발자, QA |
| 원본 | \`_프로토타입_V2.2/${FILES.user}\` · \`${FILES.admin}\` |
| 기준 문서 | 프론트 기능명세서(사용자 FU · 백오피스 FA) |
| 읽는 법 | 기능 ID마다 프로토타입 화면 키와 상태값을 적었습니다. 프로토타입 상단 화면 선택에서 화면 키를 고르고, 상태 선택에서 상태값을 고르면 그 경우의 화면이 나옵니다. 「근거」 칸은 요구사항·미정 항목 ID입니다 |
| 미정 표기 | 화면 안 \`[내용 — 미정 G-nnn]\`은 정책 부록 G에서 아직 정하지 않은 값입니다. 확정 전까지 개발 대상이 아닙니다 |
| 문구 구분 | 명세에 원문이 있는 문구는 원문 그대로입니다. 원문이 없는 오류·확인 문구는 동작을 설명하는 자리 표시이며 확정 문구가 아닙니다 |

`;
const summary=[];
for(const mode of ['user','admin']){
 const w=open(mode);const reg=w.V21_READY.V22_REG;
 const byF={};let screens=0,states=0;
 for(const [k,o] of Object.entries(reg)){screens++;states+=o.states.length;for(const f of (o.fu&&o.fu.length?o.fu:['(공통)']))(byF[f]=byF[f]||[]).push([k,o])}
 const feats=FEAT[mode];const covered=feats.filter(([id])=>byF[id]).length;
 summary.push([mode==='user'?'사용자 화면':'백오피스',feats.length,covered,screens,states]);
 md+=`## ${mode==='user'?'1. 사용자 화면 (FU)':'2. 백오피스 (FA)'}\n\n`;
 for(const [id,title] of feats){
  md+=`### ${id}. ${title}\n\n`;
  const list=byF[id];
  if(!list){md+=`프로토타입 화면 없음 — 서버 처리·문서 규칙만 있는 기능입니다(백엔드 기능명세서 참조).\n\n`;continue}
  md+=`| 화면 키 | 화면 | 상태값 | 상태 | 근거 |\n|---|---|---|---|---|\n`;
  for(const [k,o] of list)for(const [v,l,r] of o.states)md+=`| \`${k}\` | ${esc(o.label)} | \`${v}\` | ${esc(l)} | ${esc(r||'')} |\n`;
  md+='\n';
 }
 const extra=Object.keys(byF).filter(f=>!feats.some(([id])=>id===f));
 if(extra.length){md+=`### 기능 ID 밖 화면\n\n| 화면 키 | 화면 | 상태값 | 상태 | 근거 |\n|---|---|---|---|---|\n`;for(const f of extra)for(const [k,o] of byF[f])for(const [v,l,r] of o.states)md+=`| \`${k}\` | ${esc(o.label)} | \`${v}\` | ${esc(l)} | ${esc(r||'')} |\n`;md+='\n'}
 w.close();
}
md=md.replace('\n## 1. 사용자 화면',`\n## 요약\n\n| 구분 | 기능 수 | 화면이 있는 기능 | 화면 | 상태 |\n|---|---|---|---|---|\n${summary.map(r=>`| ${r.join(' | ')} |`).join('\n')}\n\n## 1. 사용자 화면`);
const out=path.join(__dirname,'..','05.리포트','프로토타입_V2.2_기능별_화면상태표.md');
fs.writeFileSync(out,md);
console.log(summary.map(r=>r.join(' / ')).join('\n'));console.log('→',out);
