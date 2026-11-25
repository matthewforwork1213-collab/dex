// Offline DOM interaction checks for review annotations. No browser or external resources.
const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM,VirtualConsole}=require('./_점검도구/node_modules/jsdom');
const results=[],coverage=[],errors=[];
function check(name,fn){try{fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}}
function open(mode){const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!e.message.includes('Could not parse CSS'))errors.push(mode+': '+e.message)});const dom=new JSDOM(fs.readFileSync(path.join(__dirname,mode==='user'?'사용자화면_DEX_V2.1.html':'백오피스_DEX_V2.1.html'),'utf8'),{url:'https://offline.invalid',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.setTimeout=()=>0;w.setInterval=()=>0;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=function(){}}});return {dom,w:dom.window,doc:dom.window.document,api:dom.window.V21_READY,mode}}
function toggle(x,value){const ck=x.doc.getElementById('ck');assert(ck);ck.checked=value;ck.dispatchEvent(new x.w.Event('change',{bubbles:true}));}
function cleanHTML(root){const copy=root.cloneNode(true);copy.querySelectorAll('[class]').forEach(el=>{const cls=el.className.trim().split(/\s+/).filter(Boolean).sort().join(' ');if(cls)el.setAttribute('class',cls);else el.removeAttribute('class')});return copy.innerHTML}
function state(x,value){const el=x.doc.querySelector('#design-state');assert(el);el.value=value;el.dispatchEvent(new x.w.Event('change',{bubbles:true}));}
function audit(x,key,label){
 toggle(x,false);
 const root=x.doc.getElementById(x.mode==='user'?'appin':'ad'),before=cleanHTML(root),snapshot=JSON.stringify(x.api.state);
 toggle(x,true);
 const notes=x.api.getReviewNotes(),pins=root.querySelectorAll('[data-review-pin]');
 assert(notes.length>0,'No mapped change regions');assert.equal(pins.length,notes.length);assert.equal(x.doc.querySelectorAll('[data-review-note]').length,notes.length);assert(x.doc.querySelector('.cols.review-notes-open'));assert(!root.querySelector('#ck'));assert(!root.querySelector('#fb,.fb-s,.demo-tag'));assert(!x.doc.querySelector('#np').textContent.includes('0.05'));
 assert.equal(x.doc.querySelectorAll('[data-review-pin] [data-review-pin]').length,0,'nested annotations');
 assert(!root.querySelector('button button'),'nested buttons');
 coverage.push({mode:x.mode,key,state:label,notes});
 for(const pin of Array.from(pins)){
  const i=Number(pin.dataset.reviewPin);
  const hash=x.w.location.hash,request=JSON.stringify(x.api.state.request);pin.click();pin.dispatchEvent(new x.w.KeyboardEvent('keydown',{key:'Enter',bubbles:true,cancelable:true}));assert.equal(x.w.location.hash,hash,'pin triggered route');assert.equal(JSON.stringify(x.api.state.request),request,'pin triggered transaction');assert(root.querySelector('[data-review-number="'+(i+1)+'"]').classList.contains('review-active'));
 }
 if(pins.length)x.doc.querySelector('[data-review-note="0"]').click();
 toggle(x,false);const after=cleanHTML(root);if(after!==before){let i=0;while(i<before.length&&before[i]===after[i])i++;throw Error('product markup changed after on/off: '+JSON.stringify({before:before.slice(i-60,i+160),after:after.slice(i-60,i+160)}))}assert.equal(JSON.stringify(x.api.state),snapshot,'business state changed');assert(!root.querySelector('[data-review-pin],.review-change,.review-active'));assert.equal(x.doc.getElementById('np').textContent,'');assert.equal(x.doc.getElementById('np').style.display,'none');
}
for(const mode of ['user','admin']){
 const x=open(mode),keys=x.w.eval('P.flatMap(p=>p.states.map(s=>p.id+"/"+s.id))');
 check(mode+' toolbar starts unchecked',()=>{assert(!x.doc.getElementById('ck').checked);assert(x.doc.getElementById('ck').closest('label').textContent.includes('변경점 표시'))});
 for(const key of keys)for(const lang of ['ko','en']){
  x.w.eval('S.lang='+JSON.stringify(lang));x.api.nav(key);
  check(mode+' '+key+' '+lang+' toggles and connects annotations',()=>audit(x,key,'normal/'+lang));
  const options=Array.from(x.doc.querySelectorAll('#design-state option'),el=>el.value);for(const value of options){state(x,value);check(mode+' '+key+' '+lang+' '+value+' annotates current state',()=>audit(x,key,value+'/'+lang));}
 }
 check(mode+' checked setting persists across navigation and language/view changes',()=>{x.api.nav(mode==='user'?'home/S4':'pt/PT-1');toggle(x,true);x.api.nav(mode==='user'?'home/LKD':'mb/MB-4');assert(x.doc.getElementById('ck').checked);assert(x.api.getReviewNotes().length);x.w.eval('S.lang="ko";all()');assert(x.doc.getElementById('ck').checked);if(mode==='user'){x.w.eval('S.view="mo";stage()');assert(x.doc.getElementById('ck').checked);assert(x.doc.querySelector('.review-pin'));}toggle(x,false)});
 if(mode==='user'){
  check('editing wallet input survives toggling annotations',()=>{x.api.nav('link/L3');const wallet=x.doc.getElementById('walletAddress');wallet.value='0xde709f2102306220921060314715629080e2fb77';const select=x.doc.getElementById('linkPartner');toggle(x,true);assert.strictEqual(x.doc.getElementById('walletAddress'),wallet);assert.strictEqual(x.doc.getElementById('linkPartner'),select);toggle(x,false);assert.equal(wallet.value,'0xde709f2102306220921060314715629080e2fb77')});
  check('annotation on a withdrawal action does not request withdrawal',()=>{x.api.nav('wd/DW1');toggle(x,true);const before=x.w.location.hash;const pin=x.doc.querySelector('[data-review-pin]');pin.click();assert.equal(x.w.location.hash,before);toggle(x,false);x.doc.querySelector('[data-action=withdrawAuth]').click();assert(x.doc.querySelector('#appin').textContent.includes('페이백 출금 신청이 완료되었어요'))});
 }else check('point form inputs and save work with change display enabled',()=>{x.api.nav('pt/PT-1');state(x,'manage');const input=x.doc.querySelector('[name=event]');input.value='7';toggle(x,true);assert.strictEqual(x.doc.querySelector('[name=event]'),input);const form=x.doc.querySelector('form[data-form=points]');form.dispatchEvent(new x.w.SubmitEvent('submit',{bubbles:true,cancelable:true,submitter:form.querySelector('button[type=submit]')}));assert.equal(x.api.state.points.lighter.event,7);assert(x.doc.getElementById('ck').checked);toggle(x,false)});
 x.dom.window.close();
}
check('no runtime exceptions',()=>assert.deepEqual(errors,[]));
const failed=results.filter(x=>!x.pass);fs.writeFileSync(path.join(__dirname,'변경점표시_검증결과.json'),JSON.stringify({method:'Offline JSDOM toggles, state and interaction verification; no browser visual verification',total:results.length,passed:results.length-failed.length,failed,errors,coverage,results},null,2));console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,failed},null,2));if(failed.length)process.exitCode=1;
