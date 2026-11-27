// 사이트 모드 DEX 앱 빌드: node dex/build-site.cjs
// 전체 프로토타입(../../_프로토타입_전체/src)의 코어·화면 모듈을 그대로 묶고, 사이트 동작에 필요한 최소 패치(아래 PATCH)를 적용한 뒤
// dex/src/site.css · site.js를 붙여 dex/app.html을 만든다. 에셋은 dex/assets/로 복사한다(단일 파일에 넣지 않음 — 모달 iframe이 같은 에셋을 다시 받지 않게).
const fs = require('fs'), path = require('path');
const dir = __dirname, full = path.join(dir, '..', '..', '_프로토타입_전체'), src = path.join(full, 'src');
const read = f => fs.readFileSync(f, 'utf8');

const { PATCH, EXPORT } = require('./patches.cjs');

const files = fs.readdirSync(src).filter(f => f.endsWith('.js')).sort();
const body = {};
for (const f of files) body[f] = read(path.join(src, f));
for (const [f, a, b, cnt = 1] of PATCH) {
  const n = body[f].split(a).length - 1;
  if (n !== cnt) { console.error(`패치 실패 (${n}건): ${f}\n  ${a.slice(0, 120)}`); process.exit(1) }
  body[f] = body[f].split(a).join(b);
}
for (const [f, x] of Object.entries(EXPORT)) body[f] += '\n' + x;

const esc = s => s.replace(/<\/script/gi, '<\\/script');
const core = body['01-core.js'];
const modules = files.filter(f => f !== '01-core.js').map(f => `</script>\n<script>// ===== ${f} =====\ntry{(()=>{\n${esc(body[f])}\n})()}catch(e){console.error('${f}',e);(window.PT_ERR=window.PT_ERR||[]).push('${f}: '+e.message)}`).join('\n');
const css = fs.readdirSync(src).filter(f => f.endsWith('.css')).sort().map(f => read(path.join(src, f))).join('\n') + '\n' + read(path.join(dir, 'src', 'site.css'));
const site = read(path.join(dir, 'src', 'site-ui.js')) + '\n' + read(path.join(dir, 'src', 'site.js')) + '\n' + read(path.join(dir, 'src', 'site2.js'));
const html = read(path.join(dir, 'src', 'template.html'))
  .replace('/*__CSS__*/', () => css)
  .replace('/*__JS__*/', () => esc(core) + '\n' + modules + `\n</script>\n<script>// ===== site.js =====\n${esc(site)}`);
fs.writeFileSync(path.join(dir, 'app.html'), html);

// 에셋 복사(바뀐 것만)
const adir = path.join(dir, 'assets'); fs.mkdirSync(adir, { recursive: true });
let copied = 0;
for (const f of fs.readdirSync(path.join(full, 'assets'))) {
  const s = path.join(full, 'assets', f), d = path.join(adir, f);
  const ss = fs.statSync(s); if (!ss.isFile()) continue;
  if (fs.existsSync(d) && fs.statSync(d).size === ss.size) continue;
  fs.copyFileSync(s, d); copied++;
}
console.log('dex/app.html', (Buffer.byteLength(html) / 1024).toFixed(0) + 'KB', files.length + ' modules', PATCH.length + ' patches', 'assets +' + copied);
