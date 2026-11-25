// Offline source/render-function checks only. Does not launch or control a browser.
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const results = [];
for (const [name, file] of [['user', '사용자화면_DEX영향도.html'], ['admin', '백오피스_DEX영향도.html']]) {
  const source = fs.readFileSync(path.join(root, '_프로토타입', file), 'utf8');
  const scripts = [...source.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  const context = vm.createContext({document: {getElementById: () => ({}), addEventListener: () => {}}});
  const code = scripts.join('\n').replace(/\ball\(\);\s*$/, '');
  vm.runInContext(code, context, {timeout: 10000});
  const inventory = vm.runInContext(`P.map((p, pi) => ({id:p.id, title:p.ko, pi, states:p.states.map((s,si)=>({id:s.id,title:s.ko,si}))}))`, context);
  const records = [];
  for (const p of inventory) for (const s of p.states) for (const lang of ['ko', 'en']) {
    for (const sub of [null, 'cex', 'dex', 'all']) {
      const rec = {key:p.id+'/'+s.id, page:p.title, title:s.title, lang, sub};
      try {
        const output = vm.runInContext(`S.pi=${p.pi};S.si=${s.si};S.lang=${JSON.stringify(lang)};S.sub=${JSON.stringify(sub)};({html:P[S.pi].states[S.si].r(), description:P[S.pi].states[S.si][S.lang==='ko'?'dko':'den']||'', go:GO[key()]||[], next:NEXT[key()]||null, dropdowns:DDS[key()]||[]})`, context, {timeout:5000});
        Object.assign(rec, output);
      } catch(e) {rec.error=e.message;}
      records.push(rec);
    }
  }
  const keys = new Set(records.map(r=>r.key));
  const config = vm.runInContext('({flows:FLOWS,next:NEXT,go:GO,options:OPT,dropdowns:DDS})', context);
  const broken = [];
  for (const [key, value] of Object.entries(config.next)) if (!keys.has(key)||!keys.has(value)) broken.push({key,value});
  const summary = {name,file,sha256:crypto.createHash('sha256').update(source).digest('hex'),pages:inventory.length,states:keys.size,cases:records.length,renderErrors:records.filter(r=>r.error).map(r=>({key:r.key,lang:r.lang,sub:r.sub,error:r.error})),brokenNext:broken};
  results.push(summary);
  fs.writeFileSync(path.join(__dirname,name+'.json'),JSON.stringify({summary,inventory,config,records},null,2));
  fs.writeFileSync(path.join(__dirname,name+'.source.txt'), source.split(/\r?\n/).map((l,i)=>(i+1)+': '+l.replace(/data:[^;"']+;base64,[A-Za-z0-9+/=]+/g,'[embedded asset]')).join('\n'));
}
fs.writeFileSync(path.join(__dirname,'checks.json'),JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
