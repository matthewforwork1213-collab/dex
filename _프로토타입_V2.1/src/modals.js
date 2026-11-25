// Product dialogs share an overlay; preview navigation and state controls stay outside it.
const MODAL_SCREENS={
 user:{
  'link/L0':{background:'home/S4'},'link/L1':{background:'home/S4'},
  'link/L3':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/L10':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/L7':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/L8':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/PENDING':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/ERROR':{background:'home/S4',selector:'.pg>.narrow,.pg>.c'},
  'link/GUIDE':{background:'home/S4',selector:'.pg>.c',close:'link/L3'},
  'own/O1':{background:'home/S4',selector:'.pg>.c'},
  'wd/DW1':{background:'home/S4'},'wd/DW0':{background:'home/S4'},
  'wd/DW2':{background:'home/S4'},'wd/DW3':{background:'home/S4'},
  'wd/NM':{background:'link/E4'},'ph/PH3':{background:'ph/PH2'},
  'ch/CH2':{background:'ch/CH1'},
  'cp/CP1':{close:'bnf/LIST',existingBackground:true},
  'inv/IF8':{close:'ph/PH1',existingBackground:true},
  'lg/LG1':{existingBackground:true,local:'league'}
 },
 admin:{
  'pa/MB-2':{background:'pa/MB-3',selector:'.ct>.bx',width:'640px'},
  'ex/EX-4':{existingBackground:true,local:'margin'},
  'ex/EX-7':{background:'ex/EX-1',width:'720px'},
  'pt/PT-1':{existingBackground:true,local:'points'}
 }
};
let currentProductModal=null,lastModalRoute='';
const modalTemplateRender=renderPage;
function modalBackground(route){
 const saved={route:state.route,previewCase:state.previewCase};
 const box=document.createElement('div');
 try{state.previewCase='normal';box.innerHTML=modalTemplateRender(route,ORIGINALS.get(route));refineRendered(box);}
 finally{state.route=saved.route;state.previewCase=saved.previewCase;}
 return box;
}
function modalFocusable(dialog){return Array.from(dialog.querySelectorAll('button:not(:disabled),a[href],input:not([type=hidden]):not(:disabled),select:not(:disabled),textarea:not(:disabled),summary,[tabindex="0"]')).filter(el=>!el.closest('[hidden],[inert]'))}
function mountProductModals(root,focusBefore,route=key(),markupOnly=false){
 const config=MODAL_SCREENS[MODE][route]||{};
 if(lastModalRoute!==route){state.marginModalClosed=false;lastModalRoute=route;}
 // The member modal already has its background and dedicated interactions.
 if(root.querySelector('.v21-member-dialog')){root.classList.remove('v21-has-modal');if(!markupOnly)currentProductModal=null;return;}
 if(MODE==='admin'&&route==='ex/EX-4'&&state.marginModalClosed){root.querySelectorAll('.dlg').forEach(el=>el.remove());root.classList.remove('v21-has-modal');if(!markupOnly)currentProductModal=null;return;}
 const prepared=root.querySelector('.v21-modal-frame');
 if(prepared){
  root.classList.add('v21-has-modal');
  for(const child of root.children)if(!child.matches('.v21-modal-overlay')){child.inert=true;child.setAttribute('inert','');child.setAttribute('aria-hidden','true');}
  if(!markupOnly){
   currentProductModal={route,config,frame:prepared};
   let focus=focusBefore?.route===route&&focusBefore.id?Array.from(prepared.querySelectorAll('[id]')).find(el=>el.id===focusBefore.id):null;
   if(!focus&&focusBefore?.route===route&&focusBefore.name)focus=Array.from(prepared.querySelectorAll('[name]')).find(el=>el.name===focusBefore.name);
   (focus||prepared.querySelector('.v21-modal-close'))?.focus({preventScroll:true});
  }
  return;
 }
 let dialogs=Array.from(root.querySelectorAll('.dlg')).filter(el=>!el.parentElement.closest('.dlg'));
 if(!dialogs.length&&config.selector){const el=root.querySelector(config.selector);if(el)dialogs=[el];}
 if(!dialogs.length){if(!markupOnly)currentProductModal=null;root.classList.remove('v21-has-modal');return;}
 // Preserve original element identities, event bindings, forms and entered values.
 const dialog=dialogs.at(-1);for(const other of dialogs.slice(0,-1))other.remove();
 for(const feedback of root.querySelectorAll('.v21-feedback'))if(!dialog.contains(feedback))dialog.prepend(feedback);
 const width=config.width||dialog.style.maxWidth||(MODE==='admin'?'600px':'440px');
 dialog.remove();
 if(config.background){const background=modalBackground(config.background);root.replaceChildren(...background.childNodes);}
 const overlay=document.createElement('div');overlay.className='v21-modal-overlay';overlay.dataset.modalBackdrop='';
 const frame=document.createElement('section');frame.className='v21-modal-frame';frame.setAttribute('role','dialog');frame.setAttribute('aria-modal','true');frame.tabIndex=-1;frame.style.setProperty('--modal-width',width);
 dialog.classList.add('v21-modal-content');
 const title=dialog.querySelector('h2,h3');
 if(title){title.id='product-modal-title';frame.setAttribute('aria-labelledby',title.id)}else frame.setAttribute('aria-label',P[S.pi]?.states[S.si]?.ko||'안내');
 const close=document.createElement('button');close.type='button';close.className='v21-modal-close';close.dataset.action='productModalClose';close.setAttribute('aria-label','닫기');close.textContent='×';
 frame.append(close,dialog);overlay.append(frame);
 for(const child of root.children){child.inert=true;child.setAttribute('inert','');child.setAttribute('aria-hidden','true');}
 root.append(overlay);root.classList.add('v21-has-modal');
 if(!markupOnly)currentProductModal={route,config,frame};
 // Legacy Close labels are product actions too, including non-button V2 markup.
 dialog.querySelectorAll('button,.btn').forEach(el=>{if(/^(닫기|Close|취소|Cancel|×|✕)$/i.test(el.textContent.trim())&&!el.dataset.action&&!el.dataset.go){el.dataset.action='productModalClose';el.setAttribute('role','button');el.tabIndex=0;}});
 if(markupOnly)return;
 let focus=focusBefore?.route===route&&focusBefore.id?Array.from(dialog.querySelectorAll('[id]')).find(el=>el.id===focusBefore.id):null;
 if(!focus&&focusBefore?.route===route&&focusBefore.name)focus=Array.from(dialog.querySelectorAll('[name]')).find(el=>el.name===focusBefore.name);
 (focus||close).focus({preventScroll:true});
}
// A modal screen returns complete overlay markup even when rendered directly by an IDE preview.
renderPage=function(route,original){
 const html=modalTemplateRender(route,original);
 const host=document.createElement('div');host.innerHTML=html;
 mountProductModals(host,null,route,true);
 return host.innerHTML;
};
function closeProductModal(){
 if(!currentProductModal)return;
 const {config,route}=currentProductModal;currentProductModal=null;
 if(config.local==='points'){state.pointPartner=null;state.saved.featuredOpen=false;state.previewCase='normal';render();$(legacyHost).querySelector('[data-action=pointEdit],[data-action=featuredOpen]')?.focus({preventScroll:true});return;}
 if(config.local==='league'){state.previewCase='normal';state.leagueSelected='';render();return;}
 if(config.local==='margin'){state.marginModalClosed=true;state.previewCase='closed';render();return;}
 let destination=config.close||config.background||(MODE==='admin'?'ex/EX-1':'home/S4');
 if(MODE==='user'&&route.startsWith('wd/')&&state.guest)destination='link/E4';
 nav(destination,false);
}
const modalStage=stage;
stage=function(){
 const active=document.activeElement,focusBefore={route:state.route,id:active?.id,name:active?.name};
 modalStage();mountProductModals($(legacyHost),focusBefore);
};
const modalAction=v21Action;
v21Action=function(action,value){
 if(action==='productModalClose'){closeProductModal();return;}
 if(MODE==='admin'&&key()==='ex/EX-4'&&action==='saveMargin'){modalAction(action,value);if(!state.error)closeProductModal();return;}
 if(MODE==='admin'&&key()==='pt/PT-1'&&['pointEdit','featuredOpen'].includes(action)){const result=modalAction(action,value);state.previewCase=state.pointPartner?'manage':state.saved.featuredOpen?'featured':'normal';externalControls();return result;}
 return modalAction(action,value);
};
document.addEventListener('click',e=>{if(e.target.matches('[data-modal-backdrop]'))closeProductModal();});
document.addEventListener('keydown',e=>{
 const dialog=currentProductModal?.frame;if(!dialog)return;
 if(e.key==='Escape'){e.preventDefault();closeProductModal();return;}
 if(e.key==='Tab'){const items=modalFocusable(dialog),first=items[0],last=items.at(-1);if(!first){e.preventDefault();dialog.focus();return;}
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
const modalExternalControls=externalControls;
externalControls=function(){
 modalExternalControls();
 if(MODE==='admin'&&key()==='ex/EX-4'){
  const box=document.createElement('div');box.id='design-states';box.className='design-states';box.innerHTML=`<label for="design-state">화면 상태</label><select id="design-state" data-preview-state>${options([['normal','마진 수정'],['closed','목록']],state.marginModalClosed?'closed':'normal')}</select>`;document.getElementById('design-states')?.remove();$('intro').after(box);
 }
};
const modalSelectPreview=selectPreview;
selectPreview=function(value){if(MODE==='admin'&&key()==='ex/EX-4')state.marginModalClosed=value==='closed';return modalSelectPreview(value);};
Object.assign(window.V21_READY,{act:v21Action,selectPreview,renderPage,modalScreens:MODAL_SCREENS[MODE]});
