require('./_gen-rules.cjs');
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const dir=__dirname,base=path.resolve(dir,'../_프로토타입'),v3=path.resolve(dir,'../_프로토타입_V3');
const read=f=>fs.readFileSync(f,'utf8');
const inherited=path.join(dir,'src/inherited');fs.mkdirSync(inherited,{recursive:true});
for(const f of ['model.js','user.js','admin.js','content.js','app.js']){const dest=path.join(inherited,f);if(!fs.existsSync(dest))fs.copyFileSync(path.join(v3,'src',f),dest)}
const js=read(path.join(inherited,'app.js'));
const helpers=js.slice(0,js.indexOf('const EXTRA='))
 .replace('class="${cls}" data-action','class="btn ${MODE===\'user\'?(cls===\'primary\'?\'\':\'sec\'):(cls===\'primary\'?\'\':\'o\')} ${cls===\'small\'?\'sm\':\'\'}" data-action')
 .replace('class="card"','class="${MODE===\'user\'?\'c\':\'bx\'}"')
 .replace('class="notice ${type}"','class="note ${type===\'error\'?\'rd\':type===\'warn\'?\'wn\':\'\'}"')
 .replace('class="tablewrap"','class="v21-table"').replace('<table>','<table class="t">')
 .replace('<span>${key}</span><strong>${value}</strong>','<span class="k">${key}</span><strong class="v">${value}</strong>');
const pending=js.slice(js.indexOf('const pendingRows='),js.indexOf('function routeInfo()'));
const actions=js.slice(js.indexOf('function act('),js.indexOf('async function startup()'));
const pad=n=>String(n).padStart(2,'0'),now=new Date(),STAMP=`${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
const manifest=[];
for(const [mode,input,output] of [['user','사용자화면_DEX영향도.html',`사용자화면_DEX_V2.2_${STAMP}.html`],['admin','백오피스_DEX영향도.html',`백오피스_DEX_V2.2_${STAMP}.html`]]){
 let html=read(path.join(base,input));const sourceHash=crypto.createHash('sha256').update(html).digest('hex');
 const core=[read(path.join(inherited,'model.js')).replaceAll('tm-dex-v3-demo','tm-dex-v22-demo'),helpers,...['user.js','admin.js','content.js'].map(f=>read(path.join(inherited,f))),pending,actions].join('\n');
 const code=`\n;(()=>{\nconst MODE=${JSON.stringify(mode)};\n${core}\n${read(path.join(dir,'src/history.js'))}\n${read(path.join(dir,'src/legacy-controls.js'))}\n${read(path.join(dir,'src/bridge.js'))}\n${read(path.join(dir,'src/design-screens.js'))}\n${read(path.join(dir,'src/modals.js'))}\n${read(path.join(dir,'src/change-notes.js'))}\n${read(path.join(dir,'src/v22.js'))}\n${fs.readdirSync(path.join(dir,'src')).filter(f=>/^v22-.*\.js$/.test(f)).sort().map(f=>read(path.join(dir,'src',f))).join('\n')}\n})();\n`;
 // Keep all original styles, embedded images/font and source layouts. New rules only refine them.
 html=html.replace(/<title>[^<]*<\/title>/,'<title>TetherMax DEX V2.2 · '+(mode==='user'?'사용자 화면':'백오피스')+'</title>');
 html=html.replaceAll('if(!o)return;','if(!o||o.classList.contains("no"))return;');
 html=html.replace(/<div class="fbw" id="fb"><\/div>/g,'');
 html=html.replace(/<script>/, '<style>'+read(path.join(dir,'src/refine.css'))+'</style>\n<script>');
 html=html.replace(/\ball\(\);\s*<\/script>/,()=>code.replace(/<\/script/gi,'<\\/script')+'\nall();\n</script>');
 if(!html.includes('V21_READY'))throw Error('Bridge not inserted');
 fs.writeFileSync(path.join(dir,output),html);
 // 배포(Vercel)용 고정 영문 경로: 저장소 루트 prototype/user.html · admin.html = 항상 최신 빌드
 const pub=path.join(dir,'..','prototype');fs.mkdirSync(pub,{recursive:true});fs.writeFileSync(path.join(pub,mode+'.html'),html);
 const embedded=Array.from(html.matchAll(/data:[^;"']+;base64,([A-Za-z0-9+/=]+)/g),m=>crypto.createHash('sha256').update(m[1]).digest('hex'));
 manifest.push({mode,input,output,sourceHash,outputHash:crypto.createHash('sha256').update(html).digest('hex'),bytes:Buffer.byteLength(html),embeddedAssets:embedded});
}
fs.writeFileSync(path.join(dir,'빌드기록.json'),JSON.stringify(manifest,null,2));
console.log(manifest.map(x=>({file:x.output,bytes:x.bytes,embeddedAssets:x.embeddedAssets.length})));
