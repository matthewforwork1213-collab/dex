// Review annotations are separate from product markup and use only current policy.
// They are applied after the V2.1 product cleanup; checking the toolbar never submits a form.
let reviewNotes=[],activeReviewNote=null;
function currentChangeNotes(root){
 root=root.querySelector('.v21-modal-overlay,.v21-member-overlay')||root;
 const result=[],used=new Set(),route=key();
 const add=(el,title,body,kind='chg')=>{
  if(!el||used.has(el))return;
  if(/^(INPUT|SELECT|TEXTAREA|IMG|HR|BUTTON|A|SUMMARY)$/.test(el.tagName))el=el.closest('.fld')||el.parentElement;
  if(!el||el===root||!root.contains(el))return;
  used.add(el);result.push({el,title,body,kind});
 };
 const one=(selector,title,body,kind)=>add(root.querySelector(selector),title,body,kind);
 const matching=(selector,needle,title,body,kind)=>add(Array.from(root.querySelectorAll(selector)).find(el=>needle.split('|').some(word=>el.textContent.toLowerCase().includes(word.toLowerCase()))),title,body,kind);
 const fields=(needle,title,body,kind)=>matching('.fld',needle,title,body,kind);
 const dexRows=(title,body)=>{const rows=Array.from(root.querySelectorAll('tbody tr,table tr,.li')).filter(el=>/Lighter|ApeX|EdgeX|Aster/.test(el.textContent));rows.forEach(el=>add(el,title,body));};
 const accountText='CEX는 UID, DEX는 지갑 주소를 표시합니다. 사용자 화면에서는 뒤 4자리만 남겨 마스킹하며, 본인 지갑은 전체 주소를 펼쳐 확인할 수 있습니다.';
 const totalsText='동일한 정의의 CEX·DEX 잔액을 합산합니다. 계정별 최소 출금액과 리워드 매칭을 통과한 금액만 출금 가능액에 포함합니다.';
 const quotaText='회원의 CEX·DEX 거래 계정을 합쳐 총 개수로 제한합니다. 연동 확인 중도 한도를 점유합니다. 한도 숫자는 기존 공통 설정값을 사용합니다.';
 const publicText='CEX·DEX의 지급 완료 건을 같은 피드에서 표시합니다. 식별자는 뒤 4자리만 공개하고, 시각은 사용자 현지 시간으로 표시합니다.';
 if(MODE==='user'){
  switch(route){
   case 'home/S4':
    if(state.previewCase==='guest')one('.pg>.c','비회원 출금 피드',publicText);
    else{
     one('.pg>.c','총 페이백 잔액',totalsText);
     matching('.ch h3','연동된 계정|Linked Accounts','연동 계정 목록','CEX UID와 DEX 지갑을 한 목록에서 관리합니다. 미연동은 모든 거래소에 연동된 계정이 없는 상태입니다.','lang');
     dexRows('DEX 연동 계정',accountText);
     if(state.previewCase==='unlinked')one('.v21-empty','미연동 상태','CEX·DEX를 포함한 전체 거래소에 연동 계정이 없을 때 표시합니다.');
    }break;
   case 'home/LKD':
    one('.account-heading','계정 식별자',accountText);
    one('.account-totals','페이백 잔액',totalsText);
    one('.account-breakdown','이벤트 리워드 매칭','DEX도 이벤트 리워드를 지원합니다. 같은 계정의 페이백 A와 리워드 B에 대해 A + min(B,A)를 신청 가능액으로 계산합니다.');
    one('.account-timeline','페이백 타임라인','거래 시작·마감·업데이트 시각은 거래소 설정을 기준으로 현지 시간으로 표시합니다. 실제 정산 주기·요일 등 거래소 조건은 협의 후 반영합니다.','pol');
    one('.account-weekly','주간 페이백 내역','DEX 적립 내역도 포함합니다. 일별 원장 제공 여부와 실제 정산 주기는 파트너 협의 사항입니다.','pol');break;
   case 'home/EXP':
    one('.pg>.c','Aster 귀속 만료','거래소가 제공한 실제 귀속 만료일로 표시합니다. 기존 확정 잔액은 유지합니다. 만료 후 적립·갱신·소급은 협의 중이며 연동일에 365일을 더해 임의 확정하지 않습니다.','ask');break;
   case 'home/PUBLIC':case 'etc/FEED':
    one('.pg>.c','실시간 출금 피드',publicText);break;
   case 'etc/ABOUT':
    one('.partner-track','공식 파트너 거래소','서비스 소개의 자동 캐러셀입니다. CEX·DEX 통합 거래소 API의 노출·순서·로고 등 표시 데이터를 사용합니다.');
    matching('.pg>.c','최근 출금','서비스 소개의 출금 피드',publicText);break;
   case 'hub/H1-CEX':case 'hub/H1-DEX':
    one('.segs','계산기 거래소 유형','계산기에서 CEX·DEX를 선택할 수 있습니다. 거래소 유형을 나누되 요율은 동일 거래소 레코드를 참조합니다.');
    one('.rcpt','DEX 페이백 계산','선택한 거래소의 수수료·페이백률과 월간 거래량으로 계산합니다. DEX도 테더맥스 잔액에 적립됩니다. 표시된 요율은 실제 계약값 확정이 아닙니다.');
    one('.v21-table','거래소 비교 목록','선택한 유형의 거래소를 비교합니다. DEX도 검색·요율·월 페이백·리뷰 표시 기준에 포함됩니다.');break;
   case 'hub/H5':
    one('.grid','CEX·DEX 잔액',totalsText);dexRows('DEX 계정',accountText);break;
   case 'hub/H6':
    one('.note','데이터 지연 안내','신규 적립 반영 지연이 기존 확정 잔액이나 출금을 막지 않습니다.');one('.grid','확정 잔액 유지',totalsText);break;
   case 'lnd/LND1':case 'lnd/LND2':
    one('.gr2','DEX 소개 목록','소개 목록은 DEX 전용입니다. 거래소·표시 순서·페이백률은 거래소 데이터를 사용합니다.','new');
    if(!result.length)one('.pg>.c','DEX 소개','DEX 목록과 혜택 안내를 제공합니다. 지갑 연결·서명 대신 주소를 입력하며, 일반 이벤트·초대 리워드를 지원합니다.','new');
    break;
   case 'link/L0':case 'link/L1':
    one('.chips','거래소 선택','한 목록에서 CEX·DEX를 구분해 선택합니다. 거래소의 노출·연동 가능 설정을 반영합니다.');
    dexRows('DEX 거래 계정 연동','DEX는 UID 대신 지갑 주소를 입력합니다. Lighter Standard도 연동할 수 있으며 페이백은 Premium·Plus 조건을 따릅니다.');break;
   case 'link/L3':case 'link/L10':case 'link/E4':case 'link/ERROR':
    one('form','지갑 주소 입력','DEX는 지갑 주소만 입력합니다. UID·KYC·지갑 서명·소유권 인증을 추가로 요구하지 않습니다. 주소 형식과 레퍼럴 귀속을 확인합니다.');
    one('[role=alert],.v21-feedback','조회·연동 예외','조회 지연·오류·중복·한도 등 실제 사용자 상태를 표시합니다. '+quotaText,'pol');break;
   case 'link/L7':
    one('.pg>.narrow .c,.pg>.c,.narrow>.c','연동 완료','CEX·DEX에서 같은 의미의 연동 완료를 사용합니다. DEX에 별도 소유권 인증 단계를 추가하지 않습니다.');break;
   case 'link/L8':
    one('.pg>.c,.v21-modal-content','레퍼럴 귀속 불일치','테더맥스 추천 코드로 귀속되지 않은 지갑은 연동하지 않습니다. 가입 경로 확인과 고객센터 안내를 제공합니다.');break;
   case 'link/PENDING':
    one('.pg>.c,.v21-modal-content','연동 확인 중','조회 API 미지원·지연 시 확인 중으로 처리합니다. 귀속 원장 확인 후 승인하며, 회원의 확인 중 계정도 통합 한도를 점유합니다.');break;
   case 'link/GUIDE':
    one('.pg>.c,.v21-modal-content','지갑 주소 찾기','DEX는 UID 찾기 대신 거래소의 지갑 주소를 찾는 안내를 제공합니다. 거래소별 최종 가이드·미디어 원본은 기존 보류 항목입니다.','new');break;
   case 'own/O1':
    one('.pg>.c,.v21-modal-content','이미 연동된 지갑','다른 회원에 연동된 지갑은 고객센터로 안내합니다. 정정·해제는 CS로 접수된 건만 백엔드에서 처리하며 사용자 소유권 이전 기능을 추가하지 않습니다.');break;
   case 'wd/DW1':case 'wd/DW0':case 'wd/NM':
    one('.dlg>.c.flat','출금 가능 합계','계정별로 페이백 + min(이벤트 리워드, 페이백)을 계산하고 소수 둘째 자리까지 절사합니다. 10 USDT 이상인 계정의 전액만 합산합니다.');
    dexRows('DEX 출금 계정',accountText+' CEX와 같은 목록에 표시하며, 연동 확인 중 계정은 출금할 수 없습니다.');
    one('.dlg>.btn','공통 출금','테더맥스의 공통 출금 버튼을 사용합니다. 비밀번호 변경 72시간·이메일 인증 실패 24시간 제한은 로그인 회원의 DEX에도 적용합니다. 비회원에게 회원 기반 제한을 적용하지 않습니다.');break;
   case 'wd/DW2':
    one('.dlg>.c','신청 완료 요약','신청 성공 상태입니다. 대표 거래소·식별자는 신청 목록 우선순위를 따릅니다. 회원은 접수 이메일 1회 후 계정별 최종 성공·실패 이메일을 받고 비회원은 이메일을 받지 않습니다.');
    one('[data-value="wd/DW3"]','공유 시점','지급 완료가 아니라 출금 신청 성공 후 공유할 수 있습니다.');break;
   case 'wd/DW3':
    one('.dlg','출금 신청 공유 카드','신청 성공 후 표시합니다. 대표 계정은 신청 목록 순서를 따르고 식별자는 뒤 4자리만 공개합니다. 지급받았다는 표현을 사용하지 않습니다.');break;
   case 'hist/CS3':
    one('.chips','내역 필터','CEX·DEX 적립·출금 내역을 함께 조회하고 유형·거래소로 필터링합니다.');
    one('.cal','페이백 캘린더','DEX 내역도 포함합니다. 원장 정밀도는 보존하고 0.01 USDT 미만은 표시만 0.00으로 처리합니다.');dexRows('DEX 거래 내역',accountText);break;
   case 'bnf/LIST':
    matching('.li','UID','CEX 전용 UID 보상','UID 연동 3 USDT는 CEX 전용입니다. DEX 지갑 연동으로는 이 보상을 받을 수 없습니다.');
    matching('.li','첫 페이백|First cashback','첫 출금 인정','기존 첫 출금 혜택 판정에 DEX 출금도 포함합니다. 별도 보상 금액이나 지급 횟수를 신설하지 않습니다.');
    matching('.li','친구|Invite','초대 리워드','일반 이벤트·초대 리워드는 DEX도 지원합니다. 공통 정책 설명을 혜택 목록 본문에 덧붙이지 않습니다.');break;
   case 'bnf/UIDM':
    one('.fieldhelp','DEX 제외 안내','CEX UID 연동 보상 상세에 DEX 제외 문구를 고정 안내합니다. 일반 이벤트 리워드까지 DEX에서 제외하는 의미가 아닙니다.');break;
   case 'exd/D1':
    one('.pg>.c','DEX 거래소 상세','선택한 DEX의 설명·요율·거래 조건을 표시합니다. Lighter Standard도 연동되며 페이백은 Premium·Plus에 적용합니다.');break;
   case 'exd/D2':
    one('.v21-empty','리뷰 없음','리뷰 없는 거래소의 표시 기준은 기존 CEX와 동일합니다.');
    if(!result.length)one('.pg','리뷰·Verified 배지','해당 거래소의 계정이 연동 완료인 리뷰 작성자에게 Verified를 표시합니다. CEX·DEX 동일하며 별도 소유권 인증·페이백 이력을 추가 조건으로 요구하지 않습니다.');break;
   case 'rk/RK2':
    dexRows('DEX 페이백 랭킹','DEX 커미션 페이백도 순위에 포함합니다. 이벤트·초대 리워드는 제외하며 0.01 USDT 미만도 순위에서 제외합니다.');break;
   case 'ch/CH1':
    one('.note','챌린지 CEX 전용 안내','DEX 페이백은 챌린지 진행률에 포함하지 않으며 DEX 계정은 보상을 받을 수 없습니다. 미완료 상태에 임의 수령 버튼을 추가하지 않습니다.','pol');break;
   case 'ch/CH2':
    one('.dlg>.c','수령 계정 제한','챌린지 수령 목록에는 CEX 계정만 표시합니다. DEX 그룹·지갑 행을 추가하지 않습니다.','pol');break;
   case 'lg/LG1':
    matching('.c','팀 리더보드|Team Leaderboard','리그 점수','DEX 커미션 페이백도 리그 점수에 포함합니다. 1 USDT = 1점이며 이벤트·초대 리워드는 제외합니다.');
    one('.dlg','리그 참가 계정','리그 참가 계정 선택에 DEX를 포함하고 UID 대신 지갑 주소를 표시합니다. 보상 수령 계정과는 다른 기능입니다.');break;
   case 'mb/MB1':
    one('#boardPartner','맥스보드 대상 거래소','DEX도 지원 조건에 따라 참여합니다. Lighter는 일별 원장이 확보되지 않으면 맥스보드를 운영하지 않습니다.','pol');
    one('.bingo,.note','일별 원장 조건','일별 페이백 원장 기준을 충족해야 합니다. 금액 칸만 운영하는 대안을 임의 적용하지 않습니다. 업데이트는 매일 12:30 UTC를 현지 시각으로 표시합니다.','pol');break;
   case 'ph/PH1':
    one('.metric','초대 리워드 잔액','DEX 하위 계정의 출금도 초대 리워드 실적에 포함합니다. 실제 요율·마진·재원은 사업 설정을 따르며 미설정은 0입니다.');break;
   case 'ph/PH2':
    one('.v21-table','초대한 회원의 계정','회원 번호와 CEX UID·DEX 지갑을 구분하며 하위 회원의 DEX 계정 수도 조회합니다.');break;
   case 'ph/PH3':
    dexRows('하위 회원의 DEX 계정','하위 회원의 계정 목록에 DEX 거래소와 지갑 식별자를 추가합니다. 사용자 계정 관리 버튼을 이 모달에 추가하지 않습니다.');break;
   case 'inv/IF8':
    one('.dlg','초대 리워드 수령 계정','일반 회원 초대 리워드 출금에 DEX 계정도 선택할 수 있습니다. 최소 50 USDT이며 페이백 1:1 매칭과 별개입니다. 관리자 Affiliate 고정 지급 계정은 CEX 전용입니다.');break;
   case 'cp/CP1':
    one('.dlg,.pg>.c','일반 쿠폰 사용','일반 이벤트 쿠폰의 수령 계정에 DEX를 포함합니다. UID 연동 3 USDT·챌린지의 CEX 전용 제한은 유지합니다.');break;
   case 'etc/BST':
    one('.pg>.c','부스트 적용 범위','부스트는 CEX 전용으로 유지합니다. DEX를 부스트 거래소 목록에 추가하지 않습니다.','pol');break;
   case 'etc/EVT':
    one('.dd,.chips,.ddtrig','이벤트 거래소 필터','일반 거래소 이벤트에 DEX를 포함합니다. CEX 전용 보상의 참여·수령 제한은 해당 보상 화면에서 적용합니다.');break;
   case 'etc/TP':
    one('.metric','테더맥스 포인트','회원 번호를 기준으로 CEX·DEX 실적의 포인트를 표시합니다. 거래소별 적립률은 포인트 관리 설정을 사용합니다.');break;
  }
 }else{
  switch(route){
   case 'ex/EX-1':
    dexRows('DEX 거래소 목록','관리 거래소 목록에 DEX 유형·노출·연동 가능 여부를 포함합니다. 거래소 레코드는 계산기·선택 목록·캐러셀의 공통 원본입니다.');break;
   case 'ex/EX-2':
    fields('거래소명|Exchange name','거래소 기본 정보','CEX·DEX 거래소 정보를 같은 관리 체계에서 저장합니다.');
    fields('페이백율|Cashback rate','공통 요율 원본','수수료·페이백률은 거래소 레코드를 원본으로 사용합니다. 계산기용 별도 요율을 중복 저장하지 않습니다.');
    fields('가입 가능|Sign-up available|Linking available','연동 가능 설정','연동 가능 여부는 신규 계정 연동을 허용하는 설정입니다. 기존 연동 상태와 구분합니다.');
    fields('정산 통화|Settlement currency','DEX 정산 정보','DEX 정산 통화·주소 형식·지역·API 설정을 관리합니다. 실제 파트너 요율·네트워크 조건은 협의 후 반영합니다.','new');break;
   case 'ex/EX-3':
    one('.ct>.bx,.ct>.c','CEX 소유권 확인 가이드','소유권 확인 가이드는 CEX 전용입니다. DEX에는 이 절차를 만들지 않으며 지갑 주소 찾기 안내로 별도 관리합니다.','pol');break;
   case 'ex/EX-4':
    dexRows('DEX 레퍼럴·마진','DEX 설정을 관리 목록에 포함합니다. 미설정 마진율은 0이며 실제 계약 마진율은 협의 후 반영합니다.');
    one('.v21-modal-content','레퍼럴 계정 마진 수정','계정별 기존 수정 모달을 유지합니다. 미설정 마진율은 0으로 처리하고 실제 계약값은 협의 후 반영합니다.','pol');break;
   case 'ex/EX-5':
    dexRows('DEX 거래소 이벤트','일반 거래소 이벤트 관리에 DEX도 포함합니다. UID 연동 3 USDT·챌린지와 같은 CEX 전용 보상은 별도 대상 제한을 유지합니다.');break;
   case 'ex/EX-6':
    matching('.bx','지갑 주소 찾기|How to find your wallet address','DEX 지갑 주소 가이드','UID 찾기 대신 지갑 주소 찾기 콘텐츠를 관리합니다. DEX에 KYC·소유권 확인 가이드를 만들지 않습니다.','new');break;
   case 'ex/EX-7':
    one('[data-dnd]','CEX·DEX 표시 순서','CEX·DEX를 같은 목록에서 정렬합니다. 공통 거래소 데이터의 표시 순서를 목록과 서비스 소개 캐러셀에 반영합니다.');break;
   case 'ac/AC-1':case 'pa/MB-5':
    one('#scope','통합 거래소 필터','전체·CEX·DEX로 거래 계정을 조회합니다.');dexRows('DEX 계정 실적','UID 대신 전체 지갑 주소를 표시하고 페이백·이벤트 리워드·누적 출금에 DEX를 포함합니다.');break;
   case 'ac/AC-2':
    one('.ct>.bx','소유권 심사 범위','소유권 확인 심사는 CEX 전용입니다. DEX 수동 연동 확인과 혼합하지 않습니다.','pol');break;
   case 'ac/AC-3':
    one('.ct>.bx','DEX 수동 연동 확인','조회 API가 없거나 지연된 신청은 귀속 원장을 확인해 승인·거절합니다. 귀속 원장 없이 승인하지 않으며 소유권 인증으로 대체하지 않습니다.','new');break;
   case 'mb/MB-1':
    one('.v21-table','회원 합계','회원의 남은 페이백·이벤트 리워드 등 동일 정의 금액을 CEX·DEX 합산합니다. DEX만 쓰는 회원도 조회합니다.');break;
   case 'mb/MB-4':
    dexRows('회원의 DEX 거래 계정','회원 상세에 DEX 지갑·잔액·출금 가능액을 포함합니다.');
    break;
   case 'pa/MB-2':
    one('form','제휴사 고정 지급 계정','관리자의 Affiliate 고정 지급 계정은 CEX 전용입니다. 일반 회원의 DEX 초대 리워드 출금 지원과 구분합니다.','pol');break;
   case 'pa/MB-3':
    one('.v21-table','제휴사 지급 계정','관리자 고정 지급 계정은 CEX UID만 유지합니다. DEX 실적은 하부 거래 계정에서 확인합니다.','pol');break;
   case 'pb/PB-1':
    one('.v21-table','계정별 출금 결과','CEX·DEX를 같은 신청 내역에서 추적합니다. 성공한 건은 유지하고 실패한 계정만 실패 처리합니다. 회원 이메일은 접수 1회 후 계정별 최종 결과를 발송합니다.');break;
   case 'sd/SD-1':case 'sd/SD-2':case 'sd/SD-3':case 'cp/CP-1':
    one('#campaignScope','발송 대상 유형','전체·CEX 전체·DEX 전체·개별 거래소 조건을 제공합니다. 미연동은 모든 거래소에 연동 계정이 없는 회원입니다.');
    one('#couponKind','쿠폰 지원 범위','일반 이벤트 리워드는 CEX·DEX 지원, UID 연동 3 USDT·챌린지는 CEX 전용입니다. 대상 선택과 서버 검증을 일치시킵니다.','pol');break;
   case 'iv/IV-1':
    dexRows('DEX 초대 실적','하위 계정의 DEX 출금도 초대 보상 실적에 포함합니다. 마진·요율 미설정은 0이며 실제 계약값은 별도 협의 사항입니다.');break;
   case 'pt/PT-1':
    one('table','포인트 관리 거래소','목록·관리 모달·강조할 거래소에 CEX·DEX를 모두 포함합니다. 강조 거래소는 한 곳을 선택합니다.');
    one('form[data-form=points]','4개 적립률','페이백 커미션·이벤트 리워드·상위 일반 계정 TP·상위 파트너 TP를 설정합니다. 기존 CEX 입력 정책을 그대로 적용하며 미설정은 0입니다.');
    one('form[data-form=featured]','강조할 거래소','CEX·DEX 중 한 곳을 선택합니다.');break;
   case 'lg/LG-1':
    one('form','글로벌 리그 대상','DEX를 리그 대상 거래소·참가 계정에 포함합니다. 점수는 커미션 페이백으로 계산하고 이벤트·초대 리워드는 제외합니다.');break;
   case 'bd/LG-2':
    one('form','맥스보드 운영 조건','Lighter는 일별 원장이 확보되지 않으면 운영하지 않습니다. 업데이트는 매일 12:30 UTC 기준이며 사용자에게 현지 시각으로 표시합니다.','pol');break;
   case 'nw/NW-1':
    one('form','계산기 전 영역을 관리합니다','기존에는 월 거래량 최소·최대 두 칸뿐이었습니다. 디자인의 계산기는 <b>머리말 · 결과 3칸 라벨 · 슬라이더 눈금 · 흐름도 라벨 · 설명 카드 · 각주</b>로 이루어집니다. 전부 하드코딩이라 운영에서 바꿀 수 없었습니다.','new');
    matching('.full','설명 문구|블록 머리말','문구에 요율이 박혀 있습니다','디자인 설명문이 <code>up to 80%</code> 로 숫자를 직접 적습니다. 확정 <code>CH-16</code> 은 요율 하드코딩을 금지합니다. <code>{요율}</code> 치환으로 바꿔야 합니다.','pol');
    matching('.full','거래량 슬라이더','눈금도 함께 설정해야 합니다','눈금 <code>250K~10M</code> 이 하드코딩이라 최소·최대만 바꾸면 눈금과 어긋납니다. 눈금 값과 기본 선택 거래량을 같이 저장하고 범위를 벗어나면 저장을 막습니다.','chg');break;
   case 'nw/NW-2':
    one('form','랜딩 페이지 9개 영역','기존에는 <b>파트너 카드 1장</b>의 필드만 있었습니다. 디자인의 DEX 개요 페이지는 히어로 · 신뢰 지표 · 섹션 버튼 · 파트너 카드 · CEX/DEX 비교 행 · 3단계 경로 · 벤토 타일 · Learn &amp; Earn · 마지막 CTA 띠로 이루어집니다. 나머지 8개 영역은 편집할 데가 없었습니다.','new');
    matching('.full','3단계 경로','Web3 지갑 안내가 여기입니다','<code>Create a Web 3 Wallet</code> 은 상세 콘텐츠가 아니라 이 랜딩의 STEP 1 입니다. 거래소별이 아니라 DEX 전체에 하나이고 소요 시간·3D 렌더가 함께 들어갑니다.','chg');
    matching('.full','비교 행','CEX·DEX 두 쪽을 같이 적습니다','행마다 항목 이름과 CEX·DEX 설명 세 칸입니다. 디자인은 6행이며 개수도 가변입니다.','new');break;
   case 'nw/NW-3':
    one('form','한국어·영문을 함께 저장합니다','모든 콘텐츠 필드가 한국어·영문 쌍이고 <b>이미지도 언어별로 따로 올립니다</b> — 화면 캡처 안의 글자가 다르기 때문입니다. 관리자 화면 상단의 KO/EN 전환과는 다른 개념입니다. 요율은 거래소 레코드를 참조하며 중복 저장하지 않습니다.','new');
    matching('.full','Web3 지갑 생성 안내','이 화면에서 빼야 합니다','디자인의 <code>Create a Web 3 Wallet</code> 은 거래소 상세가 아니라 <b>DEX 개요 페이지의 <code>A simple 3 step path</code> STEP 1</b> 입니다. 거래소별이 아니라 DEX 전체에 하나이고 구성도 다릅니다(칩·제목·설명·소요 시간·3D 렌더). 개요 페이지 콘텐츠 편집에 자리가 필요합니다.','ask');
    matching('.full','자주 묻는 질문','질문 개수를 고정하지 않습니다','질문은 1개부터 20개까지 추가·삭제하고 순서도 바꿀 수 있습니다. 기존 고정 7개에서 바뀐 부분입니다. 상한 20은 시연값이며 확정 대상입니다.','new');
    matching('.full','주요 특징','개수를 고정하지 않습니다','특징은 2개부터 6개까지 추가·삭제할 수 있습니다. 디자인은 2×2 로 4개가 박혀 있고 개수를 정한 결정 기록은 없습니다. 거래소마다 내세울 특징 수가 다르므로 가변이어야 합니다. <b>홀수 개일 때 2열 격자의 마지막 칸 처리는 디자인 확인이 필요합니다.</b> 항목마다 아이콘 이미지 1장이 함께 저장됩니다.','new');
    matching('.full','단계별 가이드','단계 하나에 입력이 다섯 개입니다','디자인의 단계 패널은 <b>왼쪽 목록 제목 · 오른쪽 패널 제목 · 본문 · ⓘ 보조 안내 · 이미지</b>로 이루어집니다. 기존 편집 화면은 설명 한 칸뿐이라 패널 제목과 보조 안내를 넣을 데가 없었습니다. <code>Step n of N</code> 배지는 개수에서 자동 계산합니다. 개수도 5단계 기본에 2~8개 가변으로 바꿨습니다.','new');break;
   case 'nw/NW-4':
    one('.ct>.bx','통합 연동 한도',quotaText+' 별도 DEX 고정 한도는 만들지 않습니다.','pol');break;
  }
 }
 return result.sort((a,b)=>(a.el.compareDocumentPosition(b.el)&2)?1:-1);
}

function clearReviewAnnotations(){
 const root=$(legacyHost);
 root.querySelectorAll('[data-review-pin]').forEach(el=>el.remove());
 root.querySelectorAll('.review-change,.review-anchor').forEach(el=>{el.classList.remove('review-change','review-anchor','review-active');el.removeAttribute('data-review-number');el.removeAttribute('data-review-kind')});
 const panel=$('np');panel.innerHTML='';panel.style.display='none';
 document.querySelector('.cols')?.classList.remove('review-notes-open');
}
function renderReviewPanel(){
 const panel=$('np');panel.style.display='';
 const labels={chg:'변경',new:'추가',lang:'표기',pol:'정책',ask:'협의 중'};
 panel.innerHTML=`<div class="np-h"><b>이 화면의 변경점</b><span>${reviewNotes.length}개</span></div><div class="review-legend">${Object.entries(labels).map(([k,t])=>`<span><i data-review-kind="${k}"></i>${t}</span>`).join('')}</div>${reviewNotes.length?reviewNotes.map((note,i)=>`<button type="button" class="review-note ${activeReviewNote===i?'review-selected':''}" data-review-note="${i}"><span class="review-note-number" data-review-kind="${note.kind}">${i+1}</span><span><strong>${esc(note.title)}</strong><span>${esc(note.body)}</span></span></button>`).join(''):'<p class="review-none">현재 표시 상태에서 추가로 강조할 변경 영역이 없습니다.</p>'}`;
 panel.querySelectorAll('[data-review-note]').forEach(button=>button.onclick=()=>focusReviewNote(Number(button.dataset.reviewNote),true));
}
function focusReviewNote(index,scrollToTarget=false){
 const note=reviewNotes[index];if(!note)return;
 activeReviewNote=index;
 reviewNotes.forEach((n,i)=>n.el.classList.toggle('review-active',i===index));renderReviewPanel();
 const destination=scrollToTarget?note.el:$('np').querySelector('[data-review-note="'+index+'"]');
 destination?.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function applyReviewAnnotations(){
 clearReviewAnnotations();reviewNotes=[];
 const check=$('ck');if(check)check.checked=S.notes;
 if(!S.notes)return;
 reviewNotes=currentChangeNotes($(legacyHost));
 if(activeReviewNote>=reviewNotes.length)activeReviewNote=null;
 reviewNotes.forEach((note,i)=>{
  const el=note.el;el.classList.add('review-change');el.dataset.reviewNumber=i+1;el.dataset.reviewKind=note.kind;
  let host=el;
  if(el.tagName==='TR')host=el.querySelector('td,th');
  else if(el.tagName==='TABLE')host=el.parentElement;
  if(!host)return;host.classList.add('review-anchor');
  const pin=document.createElement('button');pin.type='button';pin.className='review-pin';pin.dataset.reviewPin=i;pin.dataset.reviewKind=note.kind;pin.textContent=i+1;pin.setAttribute('aria-label','변경점 '+(i+1)+': '+note.title);host.appendChild(pin);
 });
 document.querySelector('.cols')?.classList.add('review-notes-open');renderReviewPanel();
}
// A pin inside a product button/card must never trigger its ancestor's navigation or submit.
window.addEventListener('click',e=>{const pin=e.target.closest?.('[data-review-pin]');if(!pin)return;e.preventDefault();e.stopImmediatePropagation();focusReviewNote(Number(pin.dataset.reviewPin));},true);
window.addEventListener('keydown',e=>{const pin=e.target.closest?.('[data-review-pin]');if(!pin)return;e.stopImmediatePropagation();if(e.key==='Enter'||e.key===' '){e.preventDefault();focusReviewNote(Number(pin.dataset.reviewPin));}},true);
const changeNotesBind=bind;
bind=function(){changeNotesBind();const check=$('ck');if(check)check.onchange=e=>{S.notes=e.target.checked;activeReviewNote=null;applyReviewAnnotations();measureBars()}};
const changeNotesStage=stage;
stage=function(){changeNotesStage();applyReviewAnnotations()};
Object.assign(window.V21_READY,{applyReviewAnnotations,currentChangeNotes,getReviewNotes:()=>reviewNotes.map(({title,body,kind},i)=>({number:i+1,title,body,kind}))});
