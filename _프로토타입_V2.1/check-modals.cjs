// Verify the actual DOM and interactions for every modal, including direct preview states.
const fs=require('fs'),path=require('path'),assert=require('assert'),{JSDOM,VirtualConsole}=require('./_점검도구/node_modules/jsdom');
const results=[],inventory=[],errors=[];
function check(name,fn){try{fn();results.push({name,pass:true})}catch(e){results.push({name,pass:false,error:e.message})}}
function open(mode,url='https://offline.invalid/',forbidHistory=false){const vc=new VirtualConsole();vc.on('jsdomError',e=>{if(!/Could not parse CSS/.test(e.message))errors.push(e.message)});const dom=new JSDOM(fs.readFileSync(path.join(__dirname,mode==='user'?'사용자화면_DEX_V2.1.html':'백오피스_DEX_V2.1.html'),'utf8'),{url,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.setInterval=()=>0;w.setTimeout=()=>0;w.matchMedia=()=>({matches:false});w.HTMLElement.prototype.scrollIntoView=()=>{};if(forbidHistory)w.history.replaceState=()=>{throw new w.DOMException('Preview URL cannot be changed','SecurityError')}}});return {dom,w:dom.window,doc:dom.window.document,api:dom.window.V21_READY,mode}}
function audit(x,route,state='normal'){
 const root=x.doc.getElementById(x.mode==='user'?'appin':'ad'),dialog=root.querySelector('[role=dialog]');
 for(const el of root.querySelectorAll('.dlg'))assert(el.closest('[role=dialog]'),'inline .dlg remains');
 const mandatory=x.api.modalScreens[route]&&!['lg/LG1','pt/PT-1'].includes(route)&&!(route==='cp/CP1'&&state==='used')&&!(route==='ex/EX-4'&&state==='closed');
 if(mandatory)assert(dialog,'required modal missing');
 if(!dialog)return;
 assert.equal(root.querySelectorAll('[role=dialog]').length,1);assert.equal(dialog.getAttribute('aria-modal'),'true');assert(dialog.getAttribute('aria-labelledby')||dialog.getAttribute('aria-label'));
 const overlay=dialog.parentElement;assert(overlay.matches('.v21-modal-overlay,.v21-member-overlay'));assert.equal(x.w.getComputedStyle(overlay).position,'absolute');assert.notEqual(x.w.getComputedStyle(overlay).backgroundColor,'rgba(0, 0, 0, 0)');assert.equal(x.w.getComputedStyle(overlay).display,'flex');
 const siblings=Array.from(root.children).filter(el=>el!==overlay);assert(siblings.length,'background page absent');for(const el of siblings){assert(el.inert);assert.equal(el.getAttribute('aria-hidden'),'true');assert(!el.querySelector('[data-preview-state]'));}
 assert(dialog.contains(x.doc.activeElement),'focus escaped modal');const close=dialog.querySelector('button[aria-label="닫기"]');assert(close,'close button missing');
 const scroller=dialog.querySelector('.v21-modal-content,.v21-member-dialog-body');assert(scroller);assert.equal(x.w.getComputedStyle(scroller).overflow||x.w.getComputedStyle(scroller).overflowY,'auto');
 inventory.push({mode:x.mode,route,state,title:dialog.querySelector('h2,h3')?.textContent});
}
for(const mode of ['user','admin']){
 const x=open(mode),routes=x.w.eval('P.flatMap(p=>p.states.map(s=>p.id+"/"+s.id))');
 for(const route of routes){x.api.nav(route);check(mode+' '+route+' normal overlays all dialogs',()=>audit(x,route));const states=Array.from(x.doc.querySelectorAll('#design-state option'),el=>el.value);for(const state of states){x.api.selectPreview(state);check(mode+' '+route+' '+state+' overlays all dialogs',()=>audit(x,route,state));}}
 if(mode==='admin'){
  check('affiliate modal is on partner list and closes by Escape',()=>{x.api.nav('pa/MB-2');const form=x.doc.querySelector('[role=dialog] form[data-form=affiliate]');assert(form);assert(!form.querySelector('option[value=lighter]'));assert(x.doc.querySelector('#ad>.lnb').inert);assert(x.doc.querySelector('#ad>.ct').textContent.includes('제휴사 목록'));x.doc.dispatchEvent(new x.w.KeyboardEvent('keydown',{key:'Escape',bubbles:true,cancelable:true}));assert.equal(x.w.location.hash,'#pa/MB-3');assert(!x.doc.querySelector('[role=dialog]'));});
  check('point modal closes without losing saved rates and can be reopened',()=>{x.api.nav('pt/PT-1');x.api.selectPreview('manage');const before=x.api.state.points.lighter?.event??0;x.doc.querySelector('[data-action=productModalClose]').click();assert(!x.doc.querySelector('[role=dialog]'));assert.equal(x.api.state.points.lighter?.event??0,before);x.api.selectPreview('featured');assert(x.doc.querySelector('[role=dialog] form[data-form=featured]'));x.doc.querySelector('[data-modal-backdrop]').click();assert(!x.doc.querySelector('[role=dialog]'));});
  check('margin close preserves its list and state control reopens dialog',()=>{x.api.nav('ex/EX-4');x.doc.querySelector('[data-action=productModalClose]').click();assert(!x.doc.querySelector('[role=dialog]'));assert.equal(x.w.location.hash,'#ex/EX-4');x.api.selectPreview('normal');assert(x.doc.querySelector('[role=dialog]'));});
 }else{
  check('link form input persists through change annotations inside modal',()=>{x.api.nav('link/L3');const input=x.doc.getElementById('walletAddress');input.value='0xde709f2102306220921060314715629080e2fb77';const ck=x.doc.getElementById('ck');ck.checked=true;ck.dispatchEvent(new x.w.Event('change',{bubbles:true}));assert.strictEqual(x.doc.getElementById('walletAddress'),input);assert(input.closest('[role=dialog]'));ck.checked=false;ck.dispatchEvent(new x.w.Event('change',{bubbles:true}));assert.equal(input.value,'0xde709f2102306220921060314715629080e2fb77');});
  check('coupon account choice remains live inside the modal',()=>{x.api.nav('cp/CP1');x.doc.querySelector('[role=dialog] [data-action=selectRewardAccount][data-value=a3]').click();assert.equal(x.api.state.rewardSelected,'a3');assert(!x.doc.querySelector('[role=dialog] button[type=submit]').disabled);});
 }
 check(mode+' Tab and Shift+Tab stay inside active modal',()=>{x.api.nav(mode==='admin'?'pa/MB-2':'wd/DW1');const dialog=x.doc.querySelector('[role=dialog]'),items=Array.from(dialog.querySelectorAll('button:not(:disabled),input:not([type=hidden]),select,textarea,summary,[tabindex="0"]')),first=items[0],last=items.at(-1);last.focus();last.dispatchEvent(new x.w.KeyboardEvent('keydown',{key:'Tab',bubbles:true,cancelable:true}));assert.equal(x.doc.activeElement,first);first.dispatchEvent(new x.w.KeyboardEvent('keydown',{key:'Tab',shiftKey:true,bubbles:true,cancelable:true}));assert.equal(x.doc.activeElement,last);});
 x.dom.window.close();
}
for(const mode of ['user','admin'])for(const [url,forbid] of [['file:///C:/prototype.html',false],['https://preview.invalid/',true]]){
 const x=open(mode,url,forbid),route=mode==='admin'?'pa/MB-2':'wd/DW1',[group,id]=route.split('/');
 check(mode+' actual GNB clicks open modal when URL changes are restricted: '+url,()=>{
  const pi=x.w.eval('P.findIndex(p=>p.id==='+JSON.stringify(group)+')');x.doc.querySelector('#g1 button[data-i="'+pi+'"]').click();
  const tab=Array.from(x.doc.querySelectorAll('#g2 button')).find(el=>el.querySelector('code')?.textContent===id);assert(tab);tab.click();assert.equal(x.api.state.route,route);audit(x,route);
  const ck=x.doc.getElementById('ck');ck.checked=true;ck.dispatchEvent(new x.w.Event('change',{bubbles:true}));assert(x.doc.querySelector('[role=dialog]'));assert(x.doc.querySelector('.review-pin'));ck.checked=false;ck.dispatchEvent(new x.w.Event('change',{bubbles:true}));assert(x.doc.querySelector('[role=dialog]'));
 });
 check(mode+' direct screen renderer returns the modal rather than an inline card: '+url,()=>{const html=x.api.renderPage(route,x.api.ORIGINALS.get(route)),host=x.doc.createElement('div');host.innerHTML=html;assert(host.querySelector('.v21-modal-overlay [role=dialog]'));assert(host.querySelector('[inert][aria-hidden=true]'));});
 check(mode+' modal closes through actual button with restricted history: '+url,()=>{x.doc.querySelector('[data-action=productModalClose]').click();assert(!x.doc.querySelector('[role=dialog]'));assert.equal(x.api.state.route,mode==='admin'?'pa/MB-3':'home/S4')});
 x.dom.window.close();
}
check('no modal runtime exceptions',()=>assert.deepEqual(errors,[]));
const failed=results.filter(r=>!r.pass);fs.writeFileSync(path.join(__dirname,'모달_검증결과.json'),JSON.stringify({method:'Offline JSDOM structure, computed CSS and interaction verification. Not a browser screenshot/layout verification.',total:results.length,passed:results.length-failed.length,failed,inventory,results},null,2));console.log(JSON.stringify({total:results.length,passed:results.length-failed.length,modalStates:inventory.length,failed},null,2));if(failed.length)process.exitCode=1;
