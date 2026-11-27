// 빌드: src/*.css · src/*.js(이름순) · assets/* → 단일 HTML (TetherMax_전체프로토타입_YYYYMMDD_HHMM.html)
const fs=require('fs'),path=require('path');
const dir=__dirname,src=path.join(dir,'src'),assets=path.join(dir,'assets');
const read=f=>fs.readFileSync(f,'utf8');
// 실제 동작판과 같은 코드(결정 12차): 화면 모듈 패치·내보내기 · 사이트 런타임(site-ui · site · site2) · site.css를 목록판에도 싣는다
const SITE_DIR=path.join(dir,'..','_프로토타입_실사이트','dex');
const {PATCH,EXPORT}=require(path.join(SITE_DIR,'patches.cjs'));
const css=fs.readdirSync(src).filter(f=>f.endsWith('.css')).sort().map(f=>read(path.join(src,f))).join('\n')+'\n'+read(path.join(SITE_DIR,'src','site.css'))+'\n'+read(path.join(dir,'embed','embed.css'));
const jsFiles=fs.readdirSync(src).filter(f=>f.endsWith('.js')).sort();
const body={};for(const f of jsFiles)body[f]=read(path.join(src,f));
for(const [f,a,b,cnt=1] of PATCH){const n=body[f].split(a).length-1;if(n!==cnt){console.error(`패치 실패 (${n}건): ${f}\n  ${a.slice(0,120)}`);process.exit(1)}body[f]=body[f].split(a).join(b)}
for(const [f,x] of Object.entries(EXPORT))body[f]+='\n'+x;
const js=jsFiles.map(f=>`\n// ===== ${f} =====\n;(()=>{\n${read(path.join(src,f))}\n})();`).join('\n')
 .replace(/<\/script/gi,'<\\/script');
// 코어 전역을 모듈 사이에 공유하기 위해 01-core.js는 IIFE로 감싸지 않는다
const core=read(path.join(src,'01-core.js'));
// 모듈마다 별도 <script> — 한 모듈의 문법 오류가 다른 모듈을 막지 않게 한다
const esc=t=>t.replace(/<\/script/gi,'<\\/script');
const siteRt=['site-ui.js','site.js','site2.js'].map(f=>read(path.join(SITE_DIR,'src',f))).join('\n');
const modules=jsFiles.filter(f=>f!=='01-core.js').map(f=>`</script>\n<script>// ===== ${f} =====\ntry{(()=>{\n${esc(body[f])}\n})()}catch(e){console.error('${f}',e);(window.PT_ERR=window.PT_ERR||[]).push('${f}: '+e.message)}`).join('\n')
 +`\n</script>\n<script>// ===== dex-state.js =====\n${esc(read(path.join(SITE_DIR,'dex-state.js')))}\n</script>\n<script>// ===== embed-boot.js =====\n${esc(read(path.join(dir,'embed','embed-boot.js')))}\n</script>\n<script>// ===== site-ui.js · site.js · site2.js (실제 동작판 런타임) =====\ntry{PT_EMBED.wrapListeners(()=>{const S=PT_EMBED.S;\n${esc(siteRt)}\n})}catch(e){console.error('site runtime',e);(window.PT_ERR=window.PT_ERR||[]).push('site: '+e.message)}`+'\n</script>\n<script>';
const mime={'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'};
const A={};for(const f of fs.readdirSync(assets)){const ext=path.extname(f).toLowerCase();if(!mime[ext])continue;
 let type=mime[ext];const buf=fs.readFileSync(path.join(assets,f));if(ext==='.png'&&buf[0]===0xFF&&buf[1]===0xD8)type='image/jpeg';
 // 파일명 조각(#) — 동작판과 같은 선택자(img[src*=이름])가 목록판에서도 통하게
 A[f]=`data:${type};base64,${buf.toString('base64')}#${f}`}
let html=read(path.join(src,'template.html'))
 .replace('/*__CSS__*/',()=>css)
 .replace('/*__ASSETS__*/',()=>'window.ASSETS='+JSON.stringify(A)+';')
 .replace('/*__JS__*/',()=>esc(body['01-core.js'])+'\n'+modules);
const pad=n=>String(n).padStart(2,'0'),d=new Date(),STAMP=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
const out=`TetherMax_전체프로토타입_${STAMP}.html`;
fs.writeFileSync(path.join(dir,out),html);
fs.writeFileSync(path.join(dir,'_latest.html'),html);
console.log(out,(Buffer.byteLength(html)/1024).toFixed(0)+'KB',jsFiles.length+' js');
