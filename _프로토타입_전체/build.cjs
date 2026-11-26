// 빌드: src/*.css · src/*.js(이름순) · assets/* → 단일 HTML (TetherMax_전체프로토타입_YYYYMMDD_HHMM.html)
const fs=require('fs'),path=require('path');
const dir=__dirname,src=path.join(dir,'src'),assets=path.join(dir,'assets');
const read=f=>fs.readFileSync(f,'utf8');
const css=fs.readdirSync(src).filter(f=>f.endsWith('.css')).sort().map(f=>read(path.join(src,f))).join('\n');
const jsFiles=fs.readdirSync(src).filter(f=>f.endsWith('.js')).sort();
const js=jsFiles.map(f=>`\n// ===== ${f} =====\n;(()=>{\n${read(path.join(src,f))}\n})();`).join('\n')
 .replace(/<\/script/gi,'<\\/script');
// 코어 전역을 모듈 사이에 공유하기 위해 01-core.js는 IIFE로 감싸지 않는다
const core=read(path.join(src,'01-core.js'));
// 모듈마다 별도 <script> — 한 모듈의 문법 오류가 다른 모듈을 막지 않게 한다
const modules=jsFiles.filter(f=>f!=='01-core.js').map(f=>`</script>\n<script>// ===== ${f} =====\ntry{(()=>{\n${read(path.join(src,f)).replace(/<\/script/gi,'<\\/script')}\n})()}catch(e){console.error('${f}',e);(window.PT_ERR=window.PT_ERR||[]).push('${f}: '+e.message)}`).join('\n')+'\n</script>\n<script>';
const mime={'.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg','.jpeg':'image/jpeg','.webp':'image/webp','.gif':'image/gif'};
const A={};for(const f of fs.readdirSync(assets)){const ext=path.extname(f).toLowerCase();if(!mime[ext])continue;
 let type=mime[ext];const buf=fs.readFileSync(path.join(assets,f));if(ext==='.png'&&buf[0]===0xFF&&buf[1]===0xD8)type='image/jpeg';
 A[f]=`data:${type};base64,${buf.toString('base64')}`}
let html=read(path.join(src,'template.html'))
 .replace('/*__CSS__*/',()=>css)
 .replace('/*__ASSETS__*/',()=>'window.ASSETS='+JSON.stringify(A)+';')
 .replace('/*__JS__*/',()=>core.replace(/<\/script/gi,'<\\/script')+'\n'+modules);
const pad=n=>String(n).padStart(2,'0'),d=new Date(),STAMP=`${d.getFullYear()}${pad(d.getMonth()+1)}${pad(d.getDate())}_${pad(d.getHours())}${pad(d.getMinutes())}`;
const out=`TetherMax_전체프로토타입_${STAMP}.html`;
fs.writeFileSync(path.join(dir,out),html);
fs.writeFileSync(path.join(dir,'_latest.html'),html);
console.log(out,(Buffer.byteLength(html)/1024).toFixed(0)+'KB',jsFiles.length+' js');
