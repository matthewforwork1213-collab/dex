// ===== V2.2 · 백오피스 공통 셸 + 배치 A1 (FA-001 ~ 004 · 025 ~ 033) =====
const AD_TBD=(t,g)=>`<span class="v22-tbd">[${t} — 미정 ${g}]</span>`;
// REQ-478 최상위 순서 · REQ-479 Account 하위
// [키, 영문, 국문, 하위] — 기존 메뉴(LLM_wiki 2026-07-23 71메뉴) + REQ-478 · 479 · 567 · 573 · 603. 명세에 위치가 없는 신규 화면은 메뉴에 넣지 않습니다.
const AD_MENU=[
 ['Prelogin Landing Page','Prelogin Landing Page','프리로그인 랜딩 페이지',[]],
 ['Member Management','Member Management','회원관리',[['Member list','회원 리스트','회원 리스트'],['Restrictions','제한내역','제한내역'],['Partners','제휴사','제휴사'],['Withdrawn members','탈퇴회원 리스트','탈퇴회원 리스트'],['OTP history','구글 OTP 히스토리','구글 OTP 히스토리'],['KOL','제휴사 광고','제휴사 광고'],['Country code','사용자 접속 국가 코드 정보','사용자 접속 국가 코드 정보']]],
 ['Account','Account','Account',[['Account List','Account List','계정 리스트'],['Linking Management','Linking Management','연동 관리'],['Manual Linking Application','Manual Linking Application','연동 신청 수동관리'],['Ownership Verification','Ownership Verification','소유 확인'],['Ownership Verification Restrictions','Ownership Verification Restrictions','소유 확인 제한 내역'],['Boost','Boost','부스트'],['Bitget Boost','Bitget Boost','비트겟 부스트'],['UID Exception','UID Exception','UID 예외 처리']]],
 ['Cashback','Cashback','캐시백',[['History Status','Cashback History Status','내역 현황'],['Challenge Status','Challenge Status','챌린지 현황'],['Guest Manual Cashback','Guest Manual Cashback','비회원 수동 캐시백'],['Member Manual Cashback','Member Manual Cashback','회원 수동 캐시백'],['Total History','Total History','전체 내역'],['Invitation reward payout','초대 리워드 출금','초대 리워드 출금'],['New member challenge','신규 회원 캐시백 챌린지','신규 회원 캐시백 챌린지'],['Existing member challenge','기존 회원 캐시백 챌린지','기존 회원 캐시백 챌린지'],['Cashback Pre-Settlement','Cashback Pre-Settlement','캐시백 미리 정산'],['STG','STG 캐시백','STG 캐시백'],['DEX Cashback Records','DEX Cashback Records','DEX Cashback Records']]],
 ['Cashback Products','Cashback Products','Cashback Products',[['Spending Estimate','Spending Estimate','Spending Estimate'],['DEX Landing Page','DEX Landing Page','DEX Landing Page']]],
 ['Exchange','Exchange','거래소',[['Exchange list','Exchange List','거래소 리스트'],['Referral','Exchange Referral Management','거래소 래퍼럴 관리'],['Exchange events','Exchange Event Management','거래소 이벤트 관리'],['TetherMax events','TetherMax Event Management','테더맥스 이벤트 관리'],['Exchange guide','Exchange Guide','거래소 가이드'],['Join restriction','Exchange Join Restriction Management','거래소 가입 제한 관리'],['Campaign personnel','Exchange Campaign Personnel','거래소 캠페인 인원'],['Promotion Visibility','Promotion Visibility','Promotion Visibility']]],
 ['Event','Event','이벤트',[['Event Reward Payment','Event Reward Payment','이벤트 리워드 지급'],['My Cashback Ranking','My Cashback Ranking','나의 캐시백 랭킹'],['Event reward reclaim','이벤트 리워드 회수','이벤트 리워드 회수'],['BTC price','비트코인 가격 맞추기','비트코인 가격 맞추기'],['Home benefit banner','홈 혜택 배너 관리','홈 혜택 배너 관리'],['Coin draw','코인 뽑기','코인 뽑기'],['Quiz event','퀴즈 이벤트','퀴즈 이벤트'],['Bitget dashboard','비트겟 캠페인 - 대시보드','비트겟 캠페인 - 대시보드'],['Bitget new','비트겟 캠페인 - 신규','비트겟 캠페인 - 신규'],['Bitget volume','비트겟 캠페인 - 거래량','비트겟 캠페인 - 거래량']]],
 ['Content','Content','콘텐츠',[]],
 ['Notice','Notice','공지',[['Urgent','긴급 공지','긴급 공지'],['General','일반 공지','일반 공지']]],
 ['SEO','SEO','SEO',[['SEO management','SEO 관리','SEO 관리']]],
 ['Push','Push','푸시',[['Manual push','수동 푸시','수동 푸시'],['Push history','수동 푸시 히스토리','수동 푸시 히스토리']]],
 ['Excel','Excel','엑셀',[['Upload','Upload','업로드'],['History','History','히스토리']]],
 ['Coupon','Coupon','쿠폰',[['Manual coupon send','Manual Coupon Send','수동 쿠폰 발송'],['Send history','수동 쿠폰 발송 히스토리','수동 쿠폰 발송 히스토리']]],
 ['App','App','앱',[['Voice','의견 남기기','의견 남기기']]],
 ['Email','Email','이메일',[['Campaign','이메일 캠페인','이메일 캠페인'],['Event notice email','이벤트 안내 이메일 전송','이벤트 안내 이메일 전송'],['Event notice history','이벤트 안내 이메일 전송 히스토리','이벤트 안내 이메일 전송 히스토리']]],
 ['Friend Invite','Friend Invite','친구 초대',[['Invite reward history','초대 리워드 내역','초대 리워드 내역'],['Partner performance','Affiliate Performance Management','제휴사 성과 관리'],['Withdrawal tree','출금 트리 - 초대 보상','출금 트리 - 초대 보상']]],
 ['VIP','VIP','VIP',[['VIP approve','VIP 승인/수동 지정','VIP 승인/수동 지정'],['VIP history','VIP 히스토리','VIP 히스토리']]],
 ['Design','Design','디자인',[['Home exchanges','홈 표시 거래소','홈 표시 거래소'],['Home ad banner','홈 광고 배너','홈 광고 배너'],['FAQ','FAQ','FAQ'],['App splash','앱 스플래시','앱 스플래시']]],
 ['Customized Service','Customized Service','맞춤형 서비스',[['Announce unlinked','회원 홈 어나운스 (연동 미완료)','회원 홈 어나운스 (연동 미완료)'],['Announce linked','회원 홈 어나운스 (연동 완료)','회원 홈 어나운스 (연동 완료)'],['Guest hero','비회원 홈 히어로 캠페인','비회원 홈 히어로 캠페인']]],
 ['Point','Point','포인트',[['Point management','포인트 관리','포인트 관리'],['Point lookup','포인트 조회','포인트 조회']]],
 ['League','League','리그/보드',[['Global League','글로벌 리그 목록','글로벌 리그 목록'],['League teams','글로벌 리그 팀 목록','글로벌 리그 팀 목록'],['MaxBoard','맥스보드 목록','맥스보드 목록']]],
 ['Admin','Admin','관리자',[['Accounts','계정 관리','계정 관리']]]];
function v22AdmShell(active,sub,title,actions,body){
 if(MODE!=='admin')return '';
 const lnb=`<div class="lnb"><div class="lg">∞ TetherMax <span class="sm" style="color:var(--lnbm)">Admin</span></div>${AD_MENU.map(([key,en,ko,subs])=>{const on=key===active;return `<div class="mi ${on?'on':''}">${T(en,ko)}${subs.length?`<span style="float:right;opacity:.4">${on?'⌄':'›'}</span>`:''}${key==='Cashback Products'?' <span class="bdg gy">NEW</span>':''}</div>${on?subs.map(([sk,se,sko])=>`<div class="sub ${sk===sub?'on':''}">${T(se,sko)}${['DEX Cashback Records','MaxBoard'].includes(sk)?' <span class="bdg gy">NEW</span>':''}</div>`).join(''):''}`}).join('')}<div class="dv"></div></div>`;
 return `${lnb}<div class="ct"><div class="ct-h"><h2>${title}</h2><div class="ac">${actions||''}</div></div>${body}</div>`;
}
const adBtn=(t,cls='o',attrs='')=>`<span class="btn ${cls}" role="button" tabindex="0" ${attrs}>${t}</span>`;
const adBx=(title,body)=>`<div class="bx">${title?`<h3>${title}</h3>`:''}${body}</div>`;
const adTbl=(h,rows)=>`<div class="v21-table"><table class="t"><thead><tr>${h.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="${r._cls||''}">${r.map(c=>`<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
const adFilter=items=>`<div class="bx g"><div class="fr"><span class="fl">${T('Filter','필터')}</span>${items.map(x=>`<span class="sel">${x} ▾</span>`).join('')}</div></div>`;
const adWallet=(w,full=true)=>`<span class="mono">${esc(full?w:v22Short(w))}</span> <span class="v22-copy">⧉</span>`;
if(MODE==='admin'){
// ---------- 메뉴 구조 FA-025
function adMenu(c){
 return v22AdmShell('Account','Account List',T('Menu structure','메뉴 구조'),'',adBx(T('Top-level order (REQ-478)','최상위 순서 (REQ-478)'),`<ol class="sb">${AD_MENU.map(([key,en,ko])=>`<li>${en}${en==='Cashback Products'?' — '+T('new: Spending Estimate → DEX Landing Page','신규: Spending Estimate → DEX Landing Page'):''}</li>`).join('')}</ol>`)+adBx('UID → Account',`<p>${T('Top-level UID → Account, “UID List” → Account List / 계정 리스트. Permissions unchanged. Old URLs (e.g. /en/UID/info) stay valid.','최상위 UID → Account, UID 리스트 → Account List / 계정 리스트. 권한 불변. 기존 주소(/en/UID/info) 유지')}</p><p class="sb">${AD_TBD('최상위 국문 라벨','G-235')} · ${AD_TBD('주소 유지','G-236')}</p>`)+adBx(T('Branching rule','분기 원칙'),`<p class="sb">${T('No DEX-only copy modules — branch on the Exchange Type field (CEX/DEX). Brokers have no admin menu: Broker removed from Exchange Type options and filters.','DEX 전용 사본 모듈 없음 — Exchange Type(CEX/DEX)으로 분기. 브로커는 어드민 메뉴 없음 — Exchange Type 선택지·필터에서 Broker 제거')} ${AD_TBD('기존 브로커 2건·test 행 백필 값','G-246')}</p>`));
}
// ---------- 권한 FA-026
function adPerm(c){
 const body={normal:adBx(T('Roles','역할'),`${adTbl([T('Capability','기능'),'Master','Operator','PM','CS'],[[T('Approve manual link','수동 연동 승인'),'✓','✓',AD_TBD('','G-224'),'—'],[T('Ownership review','소유권 심사'),'✓','✓','—','—'],[T('Export with identifiers','식별자 포함 내보내기'),'✓','✓',AD_TBD('','G-223'),'—'],[T('Event reward payment (money out)','이벤트 리워드 지급(돈이 나감)'),'✓','✓','—','—']])}<p class="sb">${T('No new role — capabilities added to the 4 roles. Admin creation form shows only CS · PM · Operator.','새 역할 없이 capability 추가. 관리자 생성 폼은 CS·PM·Operator만')} ${AD_TBD('신규 기능 × 역할 매핑','G-223')}</p>`),
  denied:adBx(T('No permission','권한 없음'),`<p class="sb">${T('Entry allowed; the button is disabled; clicking shows an alert. No /unauthorized redirect after the menu is shown.','진입 허용 + 버튼 비활성 + 클릭 시 알럿. 메뉴 노출 후 /unauthorized 리다이렉트 금지')}</p><span class="btn" aria-disabled="true" style="opacity:.45">${T('Approve','승인')}</span><div class="dlg"><p>${AD_TBD('권한 없음 알럿 문구','G-226')}</p>${v22Btn('OK')}</div>`),
  api403:adBx('API',`<pre class="sb">403 FORBIDDEN { "details": { "capability": "manual_link.approve" } }</pre><p class="sb">${T('Actions blocked in the UI cannot be bypassed via the API.','UI에서 막힌 행위는 API로도 우회 불가')}</p>`),
  session:adBx(T('Session expired mid-edit','편집 중 세션 만료'),`<p class="sb">${T('Form state is kept; re-authenticate and return to the same form.','폼 상태 유지 → 재인증 후 같은 폼')}</p><input class="v22-input" value="${T('(unsaved input kept)','(미저장 입력 유지)')}">`)}[c];
 return v22AdmShell('Admin','',T('Permissions','권한'),'',body);
}
// ---------- 편집 공통 FA-027
function adEdit(c){
 const form=`<label class="v22-lbl">${T('Title (EN)','제목 (EN)')} <span class="sb">${c==='counter'?'12 / 60':''}</span><input class="v22-input" value="Trade onchain, keep your cashback"></label><label class="v22-lbl">${T('Title (KO)','제목 (KO)')}<input class="v22-input" value="온체인에서 거래하고 캐시백은 그대로"></label>`;
 const extra={normal:'',saveFail:v22Note(T('Save failed — all inputs kept. Reason: ','저장 실패 — 입력값 전부 유지. 사유: ')+'VALIDATION_ERROR (title.en > 60)','error'),leave:`<div class="dlg"><h3>${T('Leave without saving?','저장하지 않고 나갈까요?')}</h3><p class="sb">${T('Shown before page leave, tab close/switch, language row switch, opening another exchange. Cancel also asks to confirm.','페이지 이탈·탭 닫기·탭 전환·언어 행 전환·다른 거래소 열기 전에 경고. Cancel도 확인')}</p><div class="row2">${v22Btn(T('Stay','머무르기'),'sec')}${v22Btn(T('Leave','나가기'))}</div></div>`,
  conflict:v22Note('This content was changed by admin_lee at 2026-11-25 09:12 UTC. Reload to see their changes; your edits are kept in this form.','warn')+`<p class="sb">${AD_TBD('두 운영자 동시 처리 Already actioned 등','G-228 · G-229')}</p>`,
  counter:`<p class="sb">${T('Counts user-perceived characters (Hangul syllable · emoji = 1); input stops at the limit; whitespace-only = empty; emoji blocked in CTA titles/tags/labels; RTL auto-direction (URL fields LTR).','사용자가 보는 글자 단위(한글 음절·이모지 = 1), 한도에서 추가 입력 거부, 공백만 = 빈 값, CTA 제목·태그·라벨 이모지 차단, RTL 자동(URL은 LTR)')} ${AD_TBD('권고값','G-230')}</p>`,
  drag:`<p class="sb">${T('Every drag-and-drop list has a keyboard alternative (↑/↓) with the same result; assistive tech reads the row position (e.g. “3 of 12”).','모든 드래그 정렬에 같은 결과의 키보드 대안(↑/↓), 보조기술에 현재 위치(예 「12개 중 3번」)')}</p><div class="li">⠿ 1 Bitget ${v22Btn('↑','sec sm')}${v22Btn('↓','sec sm')}</div>`}[c];
 return v22AdmShell('Cashback Products','DEX Landing Page',T('Edit (common rules)','편집 공통'),adBtn(T('Save','저장'),''),adBx('',extra+form+`<p class="sb">${T('Every editable item has a version number; stale drag order saves are rejected and the list reloads.','편집 대상마다 버전 번호. 오래된 드래그 순서 저장 거부 후 목록 재로딩')}</p>`));
}
// ---------- 목록 공통 FA-028
function adList(c){
 const rows=c==='noResults'?[]:[[ 'EdgeX','DEX','2026-11-23','12.40 USDT','USDC','12.40',`<span class="mono">2384011</span>`],['Aster','DEX','2026-11-23','0.96 USDT','USDT','0.96',''],['Bitget','CEX','2026-11-23','5.00 USDT','—','—',''],Object.assign(['Lighter <span class="bdg gy">Inactive</span>','DEX','2026-11-20','—','USDC','—',''],{_cls:'v22-off'})];
 const body=c==='noResults'?`<div class="v22-empty">No results match your filters ${adBtn('Clear filters')}</div><p class="sb">${T('Totals hidden (not 0).','합계는 0이 아니라 숨김')}</p>`:adTbl(['Exchange','Exchange Type',T('Date (UTC)','일자 (UTC)'),T('Amount (USDT)','금액 (USDT)'),'Payout currency','Original amount','DEX Account ID'],rows)+`<p class="sb">${T('Total (filtered rows): 18.36 USDT · filters/sort kept across pages · DEX Account ID blank when missing (not 0) · CEX rows blank.','합계(필터된 전 행): 18.36 USDT · 필터·정렬은 페이지 이동 후 유지 · DEX Account ID 없으면 빈칸(0 아님) · CEX 행 빈칸')} ${AD_TBD('페이지당 20행','G-231')}</p>`;
 return v22AdmShell('Cashback','Total History',T('List (common rules)','목록 공통'),'',adFilter(['Exchange Type: '+(c==='noResults'?'DEX':'전체'),T('Exchange','거래소')+': '+T('All','전체')])+adBx('',body+`<p class="sb">${T('Wallet addresses shown in full; narrow cells 0x + 6 … last 4, click for full, copy icon copies full. Lists with ~85,000 rows filter in under 2 s.','지갑 주소 전체 표시, 좁은 칸은 0x 앞 6자 … 뒤 4자 → 누르면 전체·복사 아이콘은 전체. 약 85,000행 목록도 2초 이내')} · ${T('Admin times','어드민 시각')} ${AD_TBD('UTC 저장·표시 권고','G-227')}</p>`));
}
// ---------- 내보내기 FA-029
function adExport(c){
 const allowed=c!=='denied';
 return v22AdmShell('Cashback','DEX Cashback Records',T('Export','내보내기'),allowed?adBtn(T('Export CSV','CSV 내보내기'),''):`<span class="btn" aria-disabled="true" style="opacity:.45">${T('Export CSV','CSV 내보내기')}</span>`,adBx('',`<p class="sb">${T('Targets: DEX Cashback Records · Link audit log · Account List Excel · Friend invite member view & monthly report · 3 DEX reports. Exports exactly the current filter (same columns & rows). Amounts in USDT; partner-ledger rows also carry settlement currency + original amount.','대상: DEX 캐시백 레코드 · 연동 감사 로그 · Account List 엑셀 · 친구 초대 회원별 뷰·월간 리포트 · 리포팅 3종. 현재 필터 그대로. 금액 USDT, 파트너 원장 행은 정산 통화·원금액 병기')}</p>${allowed?`<p class="sb">${T('The export itself is written to the audit log with its filter.','내보낸 행위를 필터 조건과 함께 감사 로그에 기록')}</p>`:`<div class="dlg"><p>${T('Exports with wallet addresses or member IDs need the Exports permission.','지갑 주소·회원 식별자가 들어간 내보내기는 Exports 권한 필요')}</p>${v22Btn('OK')}</div>`}<p class="sb">${AD_TBD('대량 백그라운드 · 7일 링크 · 수식 이스케이프','G-232')}</p>`));
}
// ---------- 거래소 목록 · 전역 순위 FA-033
function adRank(c){
 const order=['WOO X Pro','Bitget','Lighter','Binance','Bybit','Aster','OKX','MEXC','ApeX','Flipster','Gate','EdgeX'];
 const dex=['Lighter','Aster','ApeX','EdgeX'];
 const editing=['edit','keyboard'].includes(c);
 const rows=order.map((n,i)=>`<div class="li ${n==='Lighter'&&c==='inactive'?'v22-off':''}">${editing?'⠿ ':''}<span class="ava">${i+1}</span><span class="nm">${n}${dex.includes(n)?' <span class="bdg gy">DEX</span>':''}${n==='Lighter'&&c==='inactive'?' <span class="bdg gy">Inactive</span>':''}</span>${c==='keyboard'&&i===2?`<span class="am">${v22Btn('↑','sec sm')}${v22Btn('↓','sec sm')}<small>3 / 12</small></span>`:''}</div>`).join('');
 const foot={readonly:adBtn('Edit',''),edit:`${adBtn('Cancel')}${adBtn('Save','')}`,keyboard:`${adBtn('Cancel')}${adBtn('Save','')}`,saved:v22Note(T('Saved — renumbered 1..N with no gaps or duplicates.','저장 — 1..N 빈칸·중복 없이 재부여')),stale:v22Note(T('Rejected: the order changed since you opened it. The list was reloaded.','거부: 연 뒤 순서가 바뀜 — 목록 재로딩'),'warn'),inactive:'',leave:`<div class="dlg"><p>${T('Unsaved order — leave?','저장하지 않은 순서 — 나갈까요?')}</p><div class="row2">${v22Btn('Stay','sec')}${v22Btn('Leave')}</div></div>`}[c]||'';
 return v22AdmShell('Exchange','Exchange list',T('Exchange order','거래소 순위 수정'),'',adBx('',`<p class="sb">${T('One global 1..N order (test excluded). Read by: exchange list · service intro carousel · member link flow list · DEX Landing Page list · venue cards · /payback grid.','전역 1..N 하나(test 제외). 읽는 곳: 거래소 목록 · 서비스 소개 캐러셀 · 회원 연동 플로우 목록 · DEX Landing Page 리스트 · Venue 카드 · /payback 그리드')} ${AD_TBD('그룹 화면에서 그룹 안 상대 순서로 읽을지','G-254')}</p>${rows}${foot}`));
}
function adFeatured(c){
 return v22AdmShell('Exchange','Exchange list',T('Featured Exchange','주목할 거래소'),'',adBx('Exchange Selection',`${['Bitget','EdgeX','OKX'].map(n=>`<div class="li">⠿ <span class="nm">${n}${['EdgeX'].includes(n)?' <span class="bdg gy">DEX</span>':''}<span class="sb">${T('Title/Content KO·EN required','한/영 제목·내용 필수')}</span></span></div>`).join('')}<p class="sb">${T('“Exchange list top banner” modal: unchanged (regression test) — the top banner of the CEX exchange list page only. The DEX overview promo banner has its own admin (Cashback Products › DEX Landing Page › DEX Overview Banner, REQ-735). “Popular events” modal: unchanged (regression test), DEX included (G-255).','「거래소 목록 상단 배너」 모달: 변경 없음(회귀 테스트) — CEX 거래소 목록 페이지 상단 배너 전용. DEX 개요 프로모션 배너는 전용 어드민(Cashback Products › DEX Landing Page › DEX 개요 배너, REQ-735). 「인기 이벤트」 모달: 변경 없음(회귀 테스트), DEX 포함(G-255)')}</p>`));
}
v22Group2('adm','백오피스 공통 규칙');
v22Register('adm/MENU',{label:'메뉴 구조 · Account 개명',states:[['normal','최상위 순서 · Account 하위','REQ-476~479']],render:adMenu,fu:['FA-025']});
v22Register('adm/PERM',{label:'권한',states:[['normal','역할 × 기능','REQ-481 · G-223'],['denied','권한 없음 — 버튼 비활성 + 알럿','REQ-482'],['api403','API 직접 호출 403','REQ-482 · 483'],['session','편집 중 세션 만료','REQ-482']],render:adPerm,fu:['FA-026']});
v22Register('adm/EDIT',{label:'편집 공통',states:[['normal','폼','REQ-484'],['saveFail','저장 실패 — 입력 유지','REQ-484'],['leave','미저장 이탈 경고','REQ-484'],['conflict','동시 편집 충돌','REQ-485'],['counter','글자 수 규칙','REQ-486 · G-230'],['drag','드래그 키보드 대안','REQ-489']],render:adEdit,fu:['FA-027']});
v22Register('adm/LIST',{label:'목록 공통',states:[['normal','Exchange Type 필터 · 보조 컬럼 · Inactive','REQ-480 · 490'],['noResults','결과 없음 — Clear filters, 합계 숨김','REQ-490']],render:adList,fu:['FA-028']});
v22Register('adm/EXPORT',{label:'내보내기',states:[['normal','권한 있음','REQ-491 · 492'],['denied','Exports 권한 없음','REQ-492']],render:adExport,fu:['FA-029']});
v22Register('ex/RANK',{group:'거래소',label:'거래소 순위 (전역 1..N)',states:[['readonly','열람 — 읽기 전용','REQ-527'],['edit','편집','REQ-526 · 527'],['keyboard','키보드 대체','REQ-527 · 489'],['saved','저장','REQ-527'],['stale','오래된 순서 저장 거부','REQ-485 · 527'],['inactive','비활성 파트너 회색','REQ-527'],['leave','미저장 이탈 경고','REQ-527']],render:adRank,fu:['FA-033']});
v22Register('ex/FEAT',{label:'주목할 거래소 모달',states:[['normal','Exchange Selection에 DEX','REQ-502 · G-255']],render:adFeatured,fu:['FA-033']});
v22Retire('ex/EX-7','ex/RANK');
}
