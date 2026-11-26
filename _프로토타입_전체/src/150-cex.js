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
const tf=(v,o={})=>`<div class="col" style="gap:3px"><div class="row" style="gap:8px;border:${o.err?'1px solid #d32f2f':'1px solid var(--input-border)'};border-radius:4px;padding:16px 12px"><span style="flex:1;font-size:16px;line-height:24px;letter-spacing:.15px;color:${o.err?'#d32f2f':o.ph?'var(--text-secondary)':'var(--text-primary)'}">${v}</span>${o.eye?`<img src="${A('cex-ic-visoff.svg')}" style="width:16px;height:16px" alt="">`:''}</div>${o.err?`<span style="font-size:12px;line-height:1.66;letter-spacing:.4px;color:#d32f2f;padding-left:0">${o.err}</span>`:''}</div>`;
const cont=`<button class="btn contained lg full" disabled style="height:42px">Continue</button>`;
const alt=(q,l,go)=>`<button class="btn text black lg full" data-go="${go}" style="height:42px">${q} <u style="margin-left:4px">${l}</u></button>`;
const toast=t=>`<div style="position:absolute;left:50%;bottom:24px;transform:translateX(-50%);display:flex;align-items:center;gap:12px;background:#1c1c1e;color:#fff;border-radius:8px;padding:14px 16px;box-shadow:var(--elev8);font-size:14px;white-space:nowrap"><span style="width:20px;height:20px;border-radius:50%;background:#2e7d32;display:inline-flex;align-items:center;justify-content:center;font-size:12px">✓</span>${t}</div>`;

function login(st){
 const pwErr=st==='error'?'This field is required':null;
 const body=`${title('Hi, welcome back!')}
  ${promo(cap('Log in now to complete missions'),blue('to earn more USDT'),'cex-promo-login.png',{img:'left:243px;top:-21px;width:100px;height:96px;object-fit:cover',top:6})}
  <div class="col" style="gap:16px"><div class="col" style="gap:16px">${tf('Email')}${tf('Password',{eye:1,err:pwErr})}</div><a style="font-size:14px;line-height:1.43;letter-spacing:.17px;text-decoration:underline;cursor:pointer">${st==='reset'?'Forgot password?':'Forgot Password?'}</a></div>
  <div class="col" style="gap:8px">${cont}${alt('Don’t have an account?','Sign Up Now','auth.signup')}</div>`;
 return `<div style="position:relative">${guestHead()}${wrap(body)}${st==='reset'?toast('Password reset successfully.'):''}</div>`}
R.screen({id:'auth.login',group:'cex',title:'로그인 (기존)',route:'/login',fu:[],shell:false,
 states:[
  {id:'normal',label:'기본 — 빈 입력',figma:{pc:'10548:210709',mo:'10548:207012'},note:'[기존 MAX-508] Login (V2.2 상태 없음)'},
  {id:'guest',label:'게스트 조회 결과에서 로그인',figma:{pc:'29037:110849',mo:'29037:110880'},note:'DEX(revision) Web / Guest auth / login — 기존 로그인과 같은 화면. 성공 → guest.result:handoff, 취소 → 직전 조회 결과'},
  {id:'error',label:'입력 오류 — This field is required',figma:{pc:'11049:154170',mo:'10548:215467'},note:'[기존 MAX-508] Error states'},
  {id:'reset',label:'비밀번호 재설정 완료 토스트',figma:{pc:'11073:165120'},note:'[기존 MAX-508] Forget Password (Reset Password) 마지막 — 모바일 재설정 흐름 11073:163739 · 11049:97669~97673(재설정 단계 화면은 마이·비밀번호 담당 범위)'},
 ],
 render(st){return login(st)+C.note(st==='guest'?'게스트 복귀: 조회한 거래 계정을 이어받음. 로그인만으로 연동·지급하지 않음(REQ-178). 성공 → <a data-go="guest.result:handoff">guest.result:handoff</a>.':'Figma 원문 그대로. 프로모 일러스트 = Figma 에셋.')}});

function signup(st){
 const banner=promo(blue('Up to 100 USDT'),cap('Sign up and trade to earn rewards'),'cex-promo-signup.png',{img:'left:268px;top:-15px;width:84px;height:84px;object-fit:cover'});
 const body=`${title('Create Account','We’ll send you a code to verify this email')}${banner}
  <div class="col" style="gap:16px">${tf('Email',{ph:1,err:st==='error'?'This field is required':null})}${tf('Password',{eye:1})}${tf(st==='invite'?'TM8K2Q':'Referral Code (optional)')}</div>
  <label class="row" style="gap:0;align-items:flex-start;cursor:pointer"><span style="padding:0 9px 9px 0"><span class="chk on"><i></i></span></span><span style="padding-top:2px;font-size:12px;line-height:1.33;letter-spacing:.2px;color:var(--text-secondary)">I have read and agree to the <u data-go="terms.use" style="color:var(--text-primary);font-weight:500">Terms of Use</u> and <u data-go="terms.privacy" style="color:var(--text-primary);font-weight:500">Privacy Policy</u></span></label>
  <div class="col" style="gap:8px">${cont}${alt('Already have an account?',mo()?'Log In':'Log in','auth.login')}</div>`;
 return guestHead()+wrap(body)}
R.screen({id:'auth.signup',group:'cex',title:'회원가입 (기존 · 첫 단계)',route:'/signup',fu:[],shell:false,
 states:[
  {id:'normal',label:'기본 — 첫 단계',figma:{pc:'10548:103656',mo:'10542:101933'},note:'[기존 MAX-508] Sign up (V2.2 상태 없음) · 문구 개정 MAXOP-696 23327:1124738 / 23327:1124323 미반영'},
  {id:'guest',label:'게스트 조회 결과에서 가입',figma:{pc:'29037:110754',mo:'29037:110789'},note:'DEX(revision) Web / Guest auth / signup — 기존 가입과 같은 화면. 성공 → 조회한 거래 계정으로 복귀'},
  {id:'invite',label:'초대 코드로 가입',figma:{pc:'10548:199108',mo:'10548:191334'},note:'[기존 MAX-508] If there is Invitation Reward · Signing up with Invition Code — 추천 코드 미리 채움(세부 대조 필요)'},
  {id:'error',label:'입력 오류',figma:{pc:'11049:147536',mo:'10548:205271'},note:'[기존 MAX-508] Error states'},
 ],
 render(st){return signup(st)+C.note(st==='guest'?'게스트 복귀 가입: 가입 성공 → 조회한 거래소·계정으로 돌아가 연동(REQ-178).':'Figma 원문 그대로(PC <code>Log in</code> · 모바일 <code>Log In</code>).')}});

R.screen({id:'cex.list',group:'cex',title:'거래소 목록 (CEX · 기존)',route:'/exchange',fu:['FU-084'],shell:{nav:'cashback',accent:true,moTitle:['All Partner Exchanges','전체 파트너 거래소'],back:'hub.main'},
 states:[
  {id:'normal',label:'기본 — 표 (Recommended)',figma:{pc:'22598:410917',mo:'5145:52544'},note:'[기존 MAXOP-692] Figma (Updated) · 모바일 [기존 MAX-22] list view'},
  {id:'search',label:'검색 결과',figma:{mo:'5145:51653'},note:'[기존 MAX-22] Search Results — PC 검색 결과 프레임 없음(같은 표에 필터)'},
  {id:'empty',label:'검색 결과 없음',figma:null,note:'디자인 없음 — 표 안 빈 상태 원문 없음'},
 ],
 render(st){
  const L=window.CMN_LISTING;if(!L)return '';
  if(st==='search')return L('table',{q:'bit',chip:'all'})+C.note('검색어 입력 시 표가 즉시 필터(기존 화면).');
  if(st==='empty')return L('table',{q:'abcd',chip:'all',empty:`<div class="empty">${C.tbd('검색 결과 없음 문구','원문 없음')}</div>`});
  return L('table')+C.note('CEX만 — DEX를 넣지 않는다(REQ-466 · FU-089). 카드 뷰는 <a data-go="cmn.listing:cards">cmn.listing</a>.');
 }});
