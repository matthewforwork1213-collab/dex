// 15. 기존 테더맥스 (CEX·계정) — 로그인 · 회원가입 · 거래소 목록
// Figma: [MAX-508] log-in, sign-up(7960:60465) › 로그인 PC 10548:210709 · 모바일 10548:207012 / 회원가입 PC 10548:103656 · 모바일 10542:101933
//        오류 PC 11049:154170 · 모바일 10548:215467 / 비밀번호 재설정 완료 토스트 11073:165120 / 문구 개정 MAXOP-696 23327:1124738
//        DEX(revision) 게스트 복귀 로그인 29037:110849 · 29037:110880 / 가입 29037:110754 · 29037:110789 (기존 화면과 같은 배치)
//        거래소 목록 = 10-common.js listing() ([MAXOP-692] 22598:410917 · [MAX-22] 5145:52544 · 검색 결과 5145:51653)
const mo=()=>S.vp==='mo';
const guestHead=()=>{const o=S.auth;S.auth='guest';try{return mo()?moTop():gnb()}finally{S.auth=o}};
// 본문 — Content 400폭 · p24 · gap24 · 위 40 (PC) / 모바일 좌우 16
const wrap=inner=>`<div style="background:var(--bg-accent);min-height:${mo()?756:836}px;padding:${mo()?'24px 16px 40px':'40px 96px'}"><div class="col" style="gap:24px;width:${mo()?'100%':'400px'};margin:0 auto;padding:${mo()?0:24}px">${inner}</div></div>`;
const title=(t,sub)=>`<div class="col" style="gap:8px;text-align:${mo()?'left':'center'}"><span style="font-size:24px;line-height:1.334;font-weight:700">${t}</span>${sub?`<span style="font-size:14px;line-height:1.43;letter-spacing:.17px;font-weight:500;color:var(--text-secondary)">${sub}</span>`:''}</div>`;
const promo=(top,bot,img,o={})=>`<div style="position:relative;height:56px;border-radius:8px;background:rgba(207,216,220,.2)"><div class="col" style="position:absolute;left:16px;top:${o.top||8}px;gap:0">${top}${bot}</div><img src="${A(img)}" alt="" style="position:absolute;${o.img}"></div>`;
const cap=t=>`<span style="font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">${t}</span>`;
const blue=t=>`<span style="font-size:16px;line-height:1.5;letter-spacing:.15px;font-weight:600;color:var(--blue)">${t}</span>`;
const tf=(v,o={})=>{const pw=/^Password/.test(v), pre=v==='TM8K2Q'||o.val!=null;if(o.val!=null)v=o.val;return `<div class="col" style="gap:3px">${o.lab?`<span style="position:absolute;left:8px;top:-9px;padding:0 4px;background:#fff;font-size:12px;line-height:1;color:var(--text-secondary)">${o.lab}</span>`:''}<label class="row tf-box" style="position:relative;gap:8px;border:${o.err?'1px solid #d32f2f':'1px solid var(--input-border)'};border-radius:4px;padding:16px 12px;cursor:text;transition:border-color .2s"><input class="tf-in" ${pw?'type="password"':'type="text"'} ${pre?`value="${v}"`:`placeholder="${v}"`} style="flex:1;min-width:0;border:0;outline:0;background:transparent;padding:0;font:inherit;font-size:16px;line-height:24px;letter-spacing:.15px;color:var(--text-primary)">${o.eye?`<img class="tf-eye" src="${A('cex-ic-visoff.svg')}" style="width:16px;height:16px;cursor:pointer" alt="">`:''}</label>${o.err?`<span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:#d32f2f;padding-left:0">${o.err}</span>`:''}</div>`};
// 입력 동작(실제 입력·포커스 테두리·눈 아이콘·필수값 채우면 Continue 활성) — 실사이트 로그인·가입과 같은 규칙
if(!window.__tfBound){window.__tfBound=1;
 const form=el=>el.closest('[data-tf-form]');
 const sync=fm=>{if(!fm)return;const ins=[...fm.querySelectorAll('.tf-in')];const req=ins.filter(i=>!/optional/i.test(i.placeholder||''));const ok=req.every(i=>i.value.trim());const b=fm.querySelector('.tf-cont');if(b)b.disabled=!ok};
 document.addEventListener('input',e=>{if(e.target.classList&&e.target.classList.contains('tf-in'))sync(form(e.target))});
 document.addEventListener('focusin',e=>{if(e.target.classList&&e.target.classList.contains('tf-in'))e.target.closest('.tf-box').style.borderColor='var(--blue)'});
 document.addEventListener('focusout',e=>{if(e.target.classList&&e.target.classList.contains('tf-in'))e.target.closest('.tf-box').style.borderColor=''});
 document.addEventListener('click',e=>{const eye=e.target.closest&&e.target.closest('.tf-eye');if(!eye)return;e.preventDefault();const i=eye.parentNode.querySelector('.tf-in');i.type=i.type==='password'?'text':'password';eye.style.opacity=i.type==='text'?'.6':'1'});
}
const contFor=(id,st)=>`<button class="btn contained lg full tf-cont" disabled data-go="${id}:otp${st==='guest'?'Guest':''}" style="height:42px">Continue</button>`;
// 이메일 인증 모달 — 실사이트판 pt-runtime otpOpen과 같은 문구(결정 11차). 6칸 아무 숫자 → Verify
const otpModal=()=>{const m=mo();return `<div role="dialog" aria-modal="true" data-otp-box style="position:relative;box-sizing:border-box;width:${m?'calc(100% - 32px)':'504px'};background:#fff;border-radius:8px;padding:${m?'24px 16px':'32px'};box-shadow:var(--elev24)"><button class="icon-btn" aria-label="close" data-go="${S.screen}:normal" style="position:absolute;right:${m?12:20}px;top:${m?12:20}px">${ic('close')}</button><h2 style="margin:0 48px 8px 0;font-size:${m?20:24}px;line-height:1.33;font-weight:700">Email Verification</h2><p style="margin:0 0 24px;font-size:14px;line-height:1.43;color:rgba(0,0,0,.6)">We've sent a code to name@example.com</p><div style="display:flex;gap:8px;justify-content:space-between">${[0,1,2,3,4,5].map(i=>`<input data-otp-i="${i}" inputmode="numeric" maxlength="1" aria-label="Digit ${i+1}" style="box-sizing:border-box;width:${m?'calc((100% - 40px) / 6)':'64px'};aspect-ratio:1;border:1px solid rgba(0,0,0,.23);border-radius:4px;text-align:center;font-size:24px">`).join('')}</div><div style="display:flex;justify-content:flex-end;margin-top:12px"><button type="button" data-otp-paste style="border:0;background:transparent;padding:4px 0;color:#0031c6;font:inherit;font-size:14px;font-weight:600;cursor:pointer">Paste</button></div><button class="btn contained primary lg full" data-otp-verify data-go="@authdone" disabled style="margin-top:16px">Verify</button><p style="margin:16px 0 0;text-align:center;font-size:14px;line-height:1.43;color:rgba(0,0,0,.6)">Resend code in 01:00</p></div>`};
const withOtp=(page)=>`<div style="position:relative">${page}<div class="scrim pt-fixed center" style="align-items:center;justify-content:center">${otpModal()}</div></div>`;
const alt=(q,l,go)=>`<button class="btn text black lg full" data-go="${go}" style="height:42px">${q} <u style="margin-left:4px">${l}</u></button>`;
const toast=t=>`<div style="position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background:#1c1c1e;color:#fff;border-radius:8px;padding:14px 16px;box-shadow:var(--elev8);font-size:14px;white-space:nowrap"><span style="width:20px;height:20px;border-radius:50%;background:#2e7d32;display:inline-flex;align-items:center;justify-content:center;font-size:12px">✓</span>${t}</div>`;

function login(st){
 const pwErr=st==='error'?'This field is required':null;
 const body=`${title('Hi, welcome back!')}
  ${promo(cap('Log in now to complete missions'),blue('to earn more USDT'),'cex-promo-login.png',{img:'left:243px;top:-21px;width:100px;height:96px;object-fit:cover',top:6})}
  <div class="col" style="gap:16px"><div class="col" style="gap:16px">${tf('Email')}${tf('Password',{eye:1,err:pwErr})}</div><a style="font-size:14px;line-height:1.43;letter-spacing:.17px;text-decoration:underline;cursor:pointer">${st==='reset'?'Forgot password?':'Forgot Password?'}</a></div>
  <div class="col" style="gap:8px">${contFor('auth.login',st)}${alt('Don’t have an account?','Sign Up Now','auth.signup')}</div>`;
 return `<div style="position:relative" data-tf-form>${guestHead()}${wrap(body)}${st==='reset'?toast('Password reset successfully.'):''}</div>`}
R.screen({id:'auth.login',group:'cex',title:'로그인 (기존)',route:'/login',fu:[],shell:false,
 states:[
  {id:'normal',label:'기본 — 빈 입력',figma:{pc:'10548:210709',mo:'10548:207012'},note:'[기존 MAX-508] Login (V2.2 상태 없음)'},
  {id:'guest',label:'게스트 조회 결과에서 로그인',figma:{pc:'29037:110849',mo:'29037:110880'},note:'DEX(revision) Web / Guest auth / login — 기존 로그인과 같은 화면. 성공 → guest.result:handoff, 취소 → 직전 조회 결과'},
  {id:'error',label:'입력 오류 — This field is required',figma:{pc:'11049:154170',mo:'10548:215467'},note:'[기존 MAX-508] Error states'},
  {id:'otp',label:'Continue → 이메일 인증 모달',note:'결정 11차 — 6칸 코드 · Paste · Verify · Resend code in 01:00. Verify = 로그인 완료 → 돌아갈 화면(없으면 홈)'},
  {id:'otpGuest',label:'게스트 조회에서 로그인 → 이메일 인증',note:'인증 후 조회한 계정을 이어받아 연동 단계(FU-012)'},
  {id:'reset',label:'비밀번호 재설정 완료 토스트',figma:{pc:'11073:165120'},note:'[기존 MAX-508] Forget Password (Reset Password) 마지막 — 모바일 재설정 흐름 11073:163739 · 11049:97669~97673(재설정 단계 화면은 마이·비밀번호 담당 범위)'},
 ],
 render(st){if(st==='otp'||st==='otpGuest')return withOtp(login(st==='otpGuest'?'guest':'normal'));return login(st)+C.note(st==='guest'?'게스트 복귀: 조회한 거래 계정을 이어받음. 로그인만으로 연동·지급하지 않음(REQ-178). 성공 → <a data-go="guest.result:handoff">guest.result:handoff</a>.':'Figma 원문 그대로. 프로모 일러스트 = Figma 에셋.')}});

// 초대 코드로 가입한 뒤 안내 모달 — [MAX-508] 「If there is Invitation Reward」 PC 10548:199108 · 모바일 10548:191334(문구가 PC·모바일 다름 — Figma 그대로)
const inviteModal=()=>{const m=mo();return `<div style="position:relative;box-sizing:border-box;width:${m?'calc(100% - 32px)':'400px'};background:#fff;border-radius:8px;padding:24px;box-shadow:var(--elev24);text-align:center" class="col g16"><img src="${A('rw-gift.png')}" alt="" style="width:88px;height:96px;object-fit:contain;margin:0 auto"><div style="font-size:20px;line-height:1.6;font-weight:600">Invitation Reward Received</div><div class="b2 c2">${m?'Thank you for signing up through invitation. Your USDT reward is now available.':'Thank you for signing up through a referral link. Your USDT coupon is now available.'}</div><div class="row g8"><button class="btn lg full" data-go="home.main:s3" style="background:#f2f2f5;color:rgba(0,0,0,.87)">Close</button><button class="btn contained primary lg full" data-go="${m?'summary.main':'coupon.box'}">${m?'View Reward':'View Coupon'}</button></div></div>`};
function signup(st){
 const banner=promo(blue('Up to 100 USDT'),cap('Sign up and trade to earn rewards'),'cex-promo-signup.png',{img:'left:268px;top:-15px;width:84px;height:84px;object-fit:cover'});
 const body=`${title('Create Account','We’ll send you a code to verify this email')}${banner}
  <div class="col" style="gap:16px">${st==='error'&&mo()?`<div style="position:relative">${tf('Email',{val:'abc@gmail.com',lab:'Email'})}</div><div style="position:relative">${tf('Password',{val:'*********',lab:'Password',eye:1})}</div><div style="position:relative">${tf('Referral Code (optional)',{val:'1234ABC',lab:'Referral Code (optional)'})}</div>`:`${tf('Email',{ph:1,err:st==='error'?'Enter a valid email address':null})}${tf('Password',{eye:1})}${tf(st==='invite'?'TM8K2Q':'Referral Code (optional)')}`}</div>
  <label class="row" style="gap:0;align-items:flex-start;cursor:pointer"><span style="padding:0 9px 9px 0"><span class="chk on"><i></i></span></span><span style="padding-top:2px;font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">I have read and agree to the <u data-go="terms.use" style="color:var(--text-primary);font-weight:500">Terms of Use</u> and <u data-go="terms.privacy" style="color:var(--text-primary);font-weight:500">Privacy Policy</u></span></label>
  <div class="col" style="gap:8px">${contFor('auth.signup',st)}${alt('Already have an account?',mo()?'Log In':'Log in','auth.login')}</div>`;
 return `<div data-tf-form>${guestHead()}${wrap(body)}</div>`}
R.screen({id:'auth.signup',group:'cex',title:'회원가입 (기존 · 첫 단계)',route:'/signup',fu:[],shell:false,
 states:[
  {id:'normal',label:'기본 — 첫 단계',figma:{pc:'10548:103656',mo:'10542:101933'},note:'[기존 MAX-508] Sign up (V2.2 상태 없음) · 문구 개정 MAXOP-696 23327:1124738 / 23327:1124323 미반영'},
  {id:'guest',label:'게스트 조회 결과에서 가입',figma:{pc:'29037:110754',mo:'29037:110789'},note:'DEX(revision) Web / Guest auth / signup — 기존 가입과 같은 화면. 성공 → 조회한 거래 계정으로 복귀'},
  {id:'otp',label:'Continue → Email Verification 모달',note:'결정 11차 — 인증 → 가입 완료 → 회원 홈(연동 0)'},
  {id:'otpGuest',label:'게스트 조회에서 가입 → 이메일 인증',note:'인증 후 같은 계정 연동 단계(FU-012)'},
  {id:'invite',label:'초대 코드로 가입',figma:{pc:'10548:199108',mo:'10548:191334'},note:'[기존 MAX-508] If there is Invitation Reward · Signing up with Invition Code — 추천 코드 미리 채움(세부 대조 필요)'},
  {id:'error',label:'입력 오류',figma:{pc:'11049:147536',mo:'10548:205271'},note:'[기존 MAX-508] Error states'},
 ],
 render(st){if(st==='otp'||st==='otpGuest')return withOtp(signup(st==='otpGuest'?'guest':'normal'));if(st==='invite')return `<div style="position:relative">${signup('invite')}<div class="scrim pt-fixed center" style="align-items:center;justify-content:center">${inviteModal()}</div></div>`+C.note('초대 코드 미리 채운 가입 → 가입 완료 뒤 초대 보상 안내 모달(Figma 프레임 = 모달)');return signup(st)+C.note(st==='guest'?'게스트 복귀 가입: 가입 성공 → 조회한 거래소·계정으로 돌아가 연동(REQ-178).':'Figma 원문 그대로(PC <code>Log in</code> · 모바일 <code>Log In</code>).')}});

// 기존 CEX 거래소 목록(/{lang}/affiliated — 결정 2026-11-27 목록 페이지 유지) · CEX 거래소 상세 — 실서비스 수집본(_프로토타입_실사이트/pages)을 목록판 안에서 그대로 띄운다.
// 수집본 안의 클릭은 수집본 런타임(pt-runtime.js)이 부모(목록판)로 보내고, 목록판이 해당 화면으로 이동한다(01-core 메시지 처리). 행 전체 클릭 = 거래소 상세
const SNAP_EX=['binance','bingx','bitget','bitunix','blofin','bybit','deepcoin','flipster','gate','htx','lbank','mexc','okx','toobit','woo-x-pro','zoomex'];
window.snapFrame=(key,state)=>`<iframe class="pt-snap" data-snap="${key}" title="실서비스 수집본" src="../_프로토타입_실사이트/pages/${S.auth==='guest'?'guest':'member'}__${key}.${S.vp}${state?'.'+state:''}.html" style="display:block;width:100%;height:calc(100vh - var(--pt-bar-h,48px));border:0;background:#fff"></iframe>`;
R.screen({id:'cex.list',group:'cex',title:'CEX 거래소 목록 (기존)',route:'/affiliated',fu:[],shell:false,
 states:[{id:'normal',label:'기본 — 실서비스 수집본(행 클릭 = 거래소 상세)'}],
 render(){return snapFrame('en__affiliated')}});
R.screen({id:'cex.detail',group:'cex',title:'CEX 거래소 상세 (기존)',route:'/exchangeDetail/{slug}-referral',fu:[],shell:false,
 states:SNAP_EX.map(x=>({id:x,label:x+' — 실서비스 수집본'})),
 render(st){return snapFrame('en__exchangeDetail__'+(SNAP_EX.includes(st)?st:'bybit')+'-referral')}});

