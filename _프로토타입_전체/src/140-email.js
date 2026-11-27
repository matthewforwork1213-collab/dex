// 14. 사용자 이메일 — Figma 섹션 "사용자 이메일 · 지갑 연동, 자동 지급 및 서비스 안내"
// 이메일 본문만(shell:false) 630폭 카드(모바일 375). EN/KO 프레임이 따로 있으면 T(en,ko)로 한 상태에 합친다.
// 상태 figma = {pc: EN 630 프레임, mo: EN 모바일 375 프레임}. KO 프레임 노드는 note에 적는다. 「발송 조건」 프레임 내용은 C.note로 붙인다.
const ADDR='0x884BdE72f2E9919E4Cbeef6a83E6Ca9Ea55f1a69';
const NET='BNB Smart Chain (BEP20)';
const lnk=t=>`<span style="color:#0031c6;text-decoration:underline">${t}</span>`;
const SUP=()=>T(`If you require additional assistance, please ${lnk('contact our customer support')}`,`추가 지원이 필요한 경우 테더맥스 ${lnk('고객센터')}를 통해 문의하시기 바랍니다.`);
const L={ex:['Exchange','거래소'],addr:['Wallet address','지갑 주소'],net:['Network','네트워크'],reason:['Reason','사유'],acct:['Account','거래 계정'],amt:['Amount','금액'],hash:['Transaction hash','거래 해시']};
const kvRow=(k,v,o={})=>({kv:[k,v,o]});
const base=(ex)=>[kvRow(L.ex,ex),kvRow(L.addr,ADDR),kvRow(L.net,NET,{koReg:true})];
const SAFE_EN=['1. TetherMax does not contact you via phone, SMS, etc., and will not ask for authentication codes, screen sharing, or cryptocurrency transfers/withdrawals to secure accounts or secure platforms.','2. If you receive such requests, they are likely to be fraudulent. Be cautious of suspicious links sent through phishing sites, phone calls, SMS, or emails to avoid falling victim to scams.'];
const fail31=(en,ko,koP)=>[{h:['Wallet linkage failed','지갑 연동에 실패했어요']},{p:['We couldn’t link this wallet to TetherMax. Here are the details.',koP||'지갑을 연동할 수 없었습니다. 아래에서 사유를 확인하세요.']},
 ...base('EdgeX'),kvRow(L.reason,[en,ko],{reg:true}),{p:['For assistance with this wallet, contact TetherMax customer support.','지갑 연동에 대한 도움이 필요하면 테더맥스 고객센터에 문의하세요.']}];
const VIEW_WALLET={link:['View linked wallet','연동 지갑 상세 보기']};

// id · 라벨 · EN 노드 · EN 모바일 · KO 노드 · KO 모바일 · 발송 조건(Figma 「발송 조건」 프레임 그대로) · 본문 블록
const EMAILS={
 'email.link':{title:'지갑 연동 결과 메일 (30·31·32)',states:[
  {id:'e30',label:'30 · 지갑 연동 완료',pc:'29061:835',mo:'29064:2151',ko:'29062:118329',koMo:'29064:5380',
   cond:'<b>29061:899 · 30 · 지갑 연동 완료</b><br>EN [TetherMax] Wallet Binding Success / KO [TetherMax] 지갑 연동이 완료됐어요<br>즉시 완료·운영자 승인 → FCM 100 + EMAIL 30. 지갑 상세 또는 홈 연동 계정 카드.',
   body:[{h:['Wallet linkage completed','지갑 연동이 완료됐어요']},{p:['The wallet has been linked to TetherMax. Here are the details.','지갑이 테더맥스에 연동되었습니다. 아래에서 연동 정보를 확인하세요.']},...base('EdgeX'),{p:'SUP'},VIEW_WALLET]},
  {id:'e31ref',label:'31 · 레퍼럴 귀속 불일치',pc:'29061:902',mo:'29064:2214',ko:'29062:118396',koMo:'29064:5443',
   cond:'<b>29061:967 · 31 · 레퍼럴 귀속 불일치</b><br>EN [TetherMax] Wallet Binding Failed / KO [TetherMax] 지갑 연동에 실패했어요<br>레퍼럴 불일치 확정. 재시도 권유 없음. FCM 101 + EMAIL 31. 본문 문안 검토 G-296.',
   body:fail31('This wallet was not registered through TetherMax’s referral link. Check how you signed up or contact support.','테더맥스 레퍼럴을 통한 가입이 확인되지 않았습니다. 가입 경로를 확인하거나 고객센터에 문의하세요.')},
  {id:'e31dup',label:'31 · 기존 연동',pc:'29061:970',mo:'29064:2277',ko:'29062:118464',koMo:'29064:5506',
   cond:'<b>29061:1035 · 31 · 기존 연동</b><br>EN [TetherMax] Wallet Binding Failed / KO [TetherMax] 지갑 연동에 실패했어요<br>기존 연동 지갑은 고객센터로 안내. FCM 101 + EMAIL 31. 본문 문안 검토 G-296.',
   body:fail31('This wallet is already linked to another account. Contact support for help with this wallet, or use a different wallet.','다른 계정에 연동된 지갑입니다. 이 지갑에 대한 도움은 고객센터에 문의하세요. 다른 지갑도 사용할 수 있습니다.')},
  {id:'e31auto',label:'31 · 중복 자동 거절',pc:'29061:1038',mo:'29064:2340',ko:'29062:118532',koMo:'29064:5569',
   cond:'<b>29061:1103 · 31 · 중복 자동 거절</b><br>EN [TetherMax] Wallet Binding Failed / KO [TetherMax] 지갑 연동에 실패했어요<br>중복 신청 자동 거절 → 고객센터. FCM 101 + EMAIL 31. 본문 문안 검토 G-296.',
   body:fail31('Another linking request was approved. Your request was closed. Contact support if you need help.','다른 연동 요청이 먼저 승인되어 이번 요청이 종료되었습니다.','지갑 연동 요청이 자동으로 종료되었습니다.')},
  {id:'e31op',label:'31 · 운영자 거절',pc:'29061:1106',mo:'29064:2403',ko:'29062:118600',koMo:'29064:5632',
   cond:'<b>29061:1171 · 31 · 운영자 거절</b><br>EN [TetherMax] Wallet Binding Failed / KO [TetherMax] 지갑 연동에 실패했어요<br>확인 중 → 운영자 거절. FCM 101 + EMAIL 31. 선택한 사유 1개만 본문에 표시(G-074). 예시는 레퍼럴 불일치. 시작일 이전 귀속 사유는 Lighter 전용. 번역 검토 G-296.',
   body:fail31('Not a TetherMax referral','테더맥스 레퍼럴로 가입한 지갑이 아닙니다.','지갑 연동 요청이 승인되지 않았습니다. 아래에서 사유를 확인하세요.')}
 ]},
 'email.dex':{title:'DEX 안내 메일 (28·29)',states:[
  {id:'e28',label:'28 · ApeX 연동 이전 미수령',pc:'29061:1241',mo:'29064:2529',ko:'29062:118735',koMo:'29064:5758',
   cond:'<b>29061:1305 · 28 · ApeX 연동 이전 미수령</b><br>EN [TetherMax] You have unclaimed cashback on ApeX / KO [TetherMax] ApeX에 받아가지 않은 캐시백이 있어요<br>연동 전 미수령 잔액이 남은 회원만 월요일 08:00. 처리·외부 이동 결정 전 보류 G-029·292.',
   body:[{h:['You have unclaimed cashback on ApeX','ApeX에 받아가지 않은 캐시백이 있어요']},{p:['Cashback earned before linking your wallet is still in your ApeX Rewards Center. Cashback earned after linking appears in your TetherMax balance.','테더맥스에 지갑을 연동하기 전 ApeX에 쌓인 미수령 캐시백이 남아 있습니다. 연동 후 적립한 캐시백은 테더맥스 잔액에서 확인하세요.']},...base('ApeX'),{p:'SUP'}]},
  {id:'e29',label:'29 · 거래소 지원 종료',pc:'29061:1308',mo:'29064:2592',ko:'29062:118802',koMo:'29064:5821',
   cond:'<b>29061:1370 · 29 · 거래소 지원 종료</b><br>EN [TetherMax] {exchange} service termination notice / KO [TetherMax] {거래소} 서비스 종료 안내<br>해당 DEX 연동 회원에게 거래소별 1회 08:00. 지갑 상세로 이동. 기한·발송 언어 미정 G-129·293.<br>※ Figma EN과 KO 구성이 다르다(EN = 아이콘 없는 오류색 박스 + 캐시백 안내 박스, 소셜 아이콘 회색, 주소 블록 없음 / KO = 주소 블록). 언어별로 그대로 그림. EN 소셜 아이콘 4개(첫 아이콘 없음)도 Figma 그대로',
   body:{en:[{h:'Notice of service termination for {exchange}'},{p:'TetherMax support for {exchange} will end on {date}. New wallets can no longer be linked once support ends.'},
     {alert:'Notice: From the service termination date, new wallet linking and cashback accumulation will be completely halted. Please ensure to withdraw any cashback accrued before the termination date.'},
     {sub:'What happens to your cashback'},{bullet:'Cashback already credited to your TetherMax balance remains available for payout. Open your linked wallet details to review your balance.'},
     {p:'For questions about your linked wallet or remaining cashback, contact TetherMax customer support.',med:true},{hr:true},{link:'View linked wallet'}],
    ko:[{h:'EdgeX 서비스 종료 안내'},{p:'{종료일}부터 EdgeX 신규 지갑 연동이 종료됩니다. 이미 테더맥스 잔액에 적립된 캐시백은 종료 후에도 지급 대상입니다. 지갑 상세에서 잔액을 확인하세요.'},...base('EdgeX'),{p:'SUP'},VIEW_WALLET]},
   sns4en:true},
 ]},
 'email.pay':{title:'자동 지급 메일 (접수·완료·실패)',states:[
  {id:'received',label:'지급 · 자동 지급 접수',pc:'29061:1381',mo:'29064:2655',ko:'29065:7848',koMo:'29065:7989',
   cond:'<b>29061:1448 · 지급 · 자동 지급 접수</b><br>제목 예시 Cashback payout received<br>현행 접수 발송 시에만 사용. 계정별 결과 안내. 게스트·중간 메일·인증·취소 메일 없음.',
   body:[{h:['Cashback payout received','캐시백 자동 지급이 접수되었습니다.']},{p:['Your automatic cashback payout is being processed. We’ll email you the result for each account.','계정별 지급 결과를 이메일로 안내드려요.']},
    kvRow(L.ex,['Lighter (and others)','EdgeX (및 그 외 거래소)']),kvRow(L.acct,[`Wallet ${ADDR} (and others)`,`지갑 ${ADDR} (및 그 외 계정)`]),kvRow(L.net,NET),kvRow(L.amt,'127.01 USDT'),
    {box:[['Important Notes','주의 사항'],[SAFE_EN,['1. TetherMax는 전화, SMS 등을 통해 연락하지 않으며, 계정을 보호하거나 안전한 플랫폼으로의 암호화폐 전송/출금을 위해 인증 코드, 화면 공유 등을 요청하지 않습니다.','2. 이러한 요청을 받으면 사기일 가능성이 높습니다. 피싱 사이트, 전화, SMS 또는 이메일을 통해 전송된 의심스러운 링크에 주의하여 사기의 피해자가 되지 않도록 하십시오.']]]}]},
  {id:'done',label:'지급 · 자동 지급 완료',pc:'29061:1451',mo:'29064:2718',ko:'29061:1522',koMo:'29064:2781',
   cond:'<b>29061:1519 · 지급 · 자동 지급 완료 · EN</b><br>제목 예시 Auto-Cashback Withdrawal Completed<br>현행 자동 지급 완료 메일. 거래소 캐시백과 매칭된 이벤트 리워드 구분. (KO 발송 조건 프레임 29061:1590)',
   body:[{h:['Auto-Cashback Withdrawal Completed','캐시백 자동 출금 완료']},{p:['Your Auto Cashback withdrawal has been successfully processed.<br>Please find the details of your withdrawal below.','캐시백 자동 출금이 완료되었어요. 아래에서 지급 내역을 확인해 주세요.']},
    kvRow(L.ex,'EdgeX'),kvRow(L.acct,[`Wallet ${ADDR}`,`지갑 ${ADDR}`]),kvRow(L.net,NET),kvRow(L.hash,'0x8f2c41d9a6e3b5c07d1f92e4a8b6c3d5e7f9012a4b6c8d0e2f4a6b8c0b07ea91',{reg:true}),
    kvRow(['Total Claimed Amount','총 출금 금액'],['100.00 USDT<div class="b2" style="font-weight:400;margin-top:4px"> ※ Cashback: <b>80.00 USDT</b><br> ※ Event Reward : <b>20.00 USDT</b></div>','100.00 USDT<div style="margin-top:4px"> ※ 거래소 캐시백: 80.00 USDT<br> ※ 이벤트 리워드: 20.00 USDT</div>']),
    {p:['Each eligible account is paid automatically once its claimable cashback reaches 10 USDT. Event rewards are matched up to 1:1 with eligible exchange cashback.','계정별 지급 가능액이 10 USDT 이상이면 자동 지급돼요. 이벤트 리워드는 해당 계정의 거래소 캐시백과 최대 1:1로 매칭돼요.']},
    {box:[['Important Notice','중요 공지'],[['1. TetherMax will never contact you via phone, SMS, etc., and will never ask for authentication codes, screen sharing, or cryptocurrency transfers/withdrawals to so-called secure accounts or secure platforms.',SAFE_EN[1]],['1. TetherMax는 전화, 문자 등으로 먼저 연락하지 않으며, 인증번호, 화면 공유, 또는 이른바 "안전 계좌"나 "안전 플랫폼"으로의 가상자산 이체/출금을 절대 요구하지 않아요.','2. 이러한 요청을 받으셨다면 사기일 가능성이 높아요. 피싱 사이트, 전화, 문자, 이메일로 전달된 의심스러운 링크에 각별히 주의해 피해를 예방하세요.']]]}]},
  {id:'failed',label:'지급 · 자동 지급 실패',pc:'29061:1593',mo:'29064:2844',ko:'29065:7918',koMo:'29065:8052',
   cond:'<b>29061:1662 · 지급 · 자동 지급 실패</b> — Figma 발송 조건 프레임 내용 미확인(추출 목록 밖). 정책: 계정별 지급 실패 결과 · 현행 운영 발송 방식(G-405) · 금액은 잔액 복원',
   body:{en:[{h:'Cashback withdrawal failed'},{p:'Your cashback could not be sent to your linked wallet. The amount has been returned to your TetherMax balance. Contact support if you need help.'},
     kvRow(L.ex,'Lighter'),kvRow(L.acct,`Wallet ${ADDR}`),kvRow(L.amt,'127.01 USDT'),kvRow(L.net,NET),{box:[['Important Notes'],[SAFE_EN]]}],
    ko:[{h:'캐시백 자동 지급 실패'},{p:'연동한 지갑으로 캐시백을 보낼 수 없어 해당 계정의 잔액에 금액을 복원했어요. 도움이 필요하면 고객센터에 문의해 주세요.'},
     kvRow(L.ex,'EdgeX',{reg:true}),kvRow(L.acct,`지갑 ${ADDR}`),kvRow(L.net,NET),kvRow(L.amt,'127.01 USDT'),
     {box:[['주의 사항'],[['1. TetherMax는 전화, SMS 등을 통해 연락하지 않으며, 계정을 보호하기 위해 인증 코드, 화면 공유 또는 암호화폐 이체/출금을 요청하지 않습니다.','2. 이러한 요청을 받으면 사기일 가능성이 높습니다. 피싱 사이트, 전화 통화, SMS 또는 이메일을 통해 전송된 의심스러운 링크에 주의하여 사기의 피해자가 되지 않도록 하십시오.']]]}]}},
 ]},
 'email.own':{title:'소유권 · 이전 소유자 연동 해제',states:[
  {id:'unlink',label:'소유권 · 이전 소유자 연동 해제',pc:'29061:1665',mo:'29064:2907',ko:'29085:835',koMo:'29085:901',
   cond:'<b>29061:1729 · 소유권 · 이전 소유자 연동 해제</b><br>제목 예시 Wallet unlinked<br>소유권 이전 완료 시 이전 소유자에게. REQ-733. (KO 발송 조건 프레임 29085:967)<br>※ KO 원문 「지갑가」는 Figma 오탈자 그대로 옮김(「지갑이」로 고칠지 디자인 확인)',
   body:{en:[{h:'Wallet unlinked'},{p:`Ownership of the wallet has been verified from another TetherMax account.<br>Therefore, we inform you that your account has been unlinked.<br><br>If you believe this is an error, please reclaim ownership through ${lnk('account ownership verification.')}`},...base('Lighter'),{p:'SUP'}],
    ko:[{h:'지갑 연동 해제'},{p:'지갑 소유권이 다른 TetherMax 계정으로 이전된 사실이 확인되었습니다.<br>그에 따라 귀하의 계정에 연결되었던 지갑가 연동 해제되었음을 안내드립니다.<br><br>이전 결과가 잘못되었다고 생각하시면, 지갑 소유권 확인을 통해 소유권을 되찾아 주시기 바랍니다.'},...base('Lighter'),{p:'추가 지원이 필요하실 경우, 고객센터에 문의해 주세요.'}]}},
 ]},
 'email.league':{title:'글로벌 리그 결과 메일 (16~20)',states:[
  {id:'e16',label:'16 · 팀 리그 수상',pc:'29062:8577',mo:'29064:4561',cond:'<b>29062:8672 · 16 · 팀 리그 수상</b><br>제목 예시 Congratulations on winning the Global Team League!<br>DEX 팀 리그 수상자 · 07:33 · 웹 이메일 마케팅 동의.',
   body:[{h:'Congratulations on winning the Global Team League!'},{p:'Greetings from TetherMax.<br>Your team achieved {ranking} in the global team league with {exchange}, and you are set to receive {total reward} USDT!'},
    {table:[['Category','Ratio','Prize Money'],['Leader Bonus','10%','{Leader Bonus Prize Money} USDT'],['Personal Contribution','36.10%','{Personal Contribution Prize Money} USDT'],['Final Total','-','{(Leader Bonus Prize Money)+(Personal Contribution Prize Money)} USDT']]},
    {cap:'Event rewards are distributed to the participating account during the reward period.'},{btn:'View Competition Results'}]},
  {id:'e17',label:'17 · 팀 리그 참여 감사',pc:'29062:8675',mo:'29064:4624',cond:'<b>29062:8738 · 17 · 팀 리그 참여 감사</b><br>제목 예시 Thank you for participating in the Global Team League!<br>팀 리그 비수상 참여자 · 07:33 · 웹 이메일 마케팅 동의. 제목은 원본 H2 예시.',
   body:[{h:'Thank you for participating in the Global Team League!'},{p:'Greetings from TetherMax.<br>We sincerely thank you for your incredible support for the Global Team League with {exchange}! We deeply appreciate your passion as a trader for completing the league with us until the end.<br>TetherMax will root for you so that you can achieve even better results in the next league!'},{btn:'View Competition Results'}]},
  {id:'e18',label:'18 · 개인 리그 수상',pc:'29062:8741',mo:'29064:4687',cond:'<b>29062:8805 · 18 · 개인 리그 수상</b><br>제목 예시 Congratulations on winning the Global Individual League!<br>개인 리그 수상자 · 07:35 · 웹 이메일 마케팅 동의.',
   body:[{h:'Congratulations on winning the Global Individual League!'},{p:'Greetings from TetherMax.<br>You are set to receive {total reward} USDT after achieving {ranking} in the global individual league with {exchange} exchange!'},{cap:'Event rewards are distributed to the participating account during the reward period.',c:'#8b94a9'},{btn:'View Competition Results'}]},
  {id:'e19',label:'19 · 개인 리그 참여 감사',pc:'29062:8808',mo:'29064:4750',cond:'<b>29062:8871 · 19 · 개인 리그 참여 감사</b><br>제목 예시 Thank you for participating in the Global Personal League!<br>개인 리그 비수상 참여자 · 07:35 · 웹 이메일 마케팅 동의. 제목은 원본 H2 예시.',
   body:[{h:'Thank you for participating in the Global Personal League!'},{p:'Greetings from TetherMax.<br>We sincerely thank you for your incredible support for the Global Personal League with {exchange}! We deeply appreciate your passion as a trader for completing the league with us until the end.<br>TetherMax will root for you so that you can achieve even better results in the next league!'},{btn:'View Competition Results'}]},
  {id:'e20',label:'20 · 리그 수상 제외',pc:'29062:8874',mo:'29064:4813',cond:'<b>29062:8938 · 20 · 리그 수상 제외</b><br>제목 예시 Final Results of the Global League<br>이상 거래 판정으로 제외된 참여자 · 07:25 · 웹 이메일 마케팅 동의. 제목은 원본 H2 예시.',
   body:[{h:'Final Results of the Global League'},{p:'Greetings from TetherMax.<br>Thank you for participating in the Global League with {exchange}.<br>To provide a fair and safe environment for all participants, TetherMax conducted a comprehensive investigation using a monitoring system after the tournament ended.<br>As a result of the investigation, unfortunately, trading circumstances that do not meet the standards of the tournament operation policy were identified in your account. Accordingly, we inform you that you have been excluded from the final reward distribution in accordance with the tournament regulations.'},
    {cap:'*This action was applied according to the abnormal trading detection systems of TetherMax and the exchange, and the tournament operation regulations.',c:'#8b94a9'},{btn:'View Competition Results'}]},
 ]},
 'email.maxboard':{title:'맥스보드 결과 메일 (24·25)',states:[
  {id:'e24',label:'24 · 맥스보드 리워드 확정',pc:'29062:8941',mo:'29064:4876',cond:'<b>29062:9005 · 24 · 맥스보드 리워드 확정</b><br>제목 예시 Your {exchange} MAX BOARD rewards are confirmed<br>마케팅 동의 · 06:00 · 보드별. 랭킹 ON은 결과 발표 시작일, OFF는 지급 기간 시작일. 탈퇴·어뷰징·소멸 제외. 강제 종료 시 취소. 날짜 표기 G-328.',
   body:[{h:'Your EdgeX MAX BOARD rewards are confirmed'},{p:'You earned the following rewards on the EdgeX MAX BOARD. Open the board to review your results.'},kvRow(['Rewards earned'],'{completed lines and full-board reward, as applicable}'),kvRow(['Payout date'],'{payout date}'),{p:'SUP'},{link:'View MAX BOARD'}]},
  {id:'e25',label:'25 · 맥스보드 랭킹 수상',pc:'29062:9008',mo:'29064:4939',cond:'<b>29062:9072 · 25 · 맥스보드 랭킹 수상</b><br>제목 예시 Congratulations on ranking #{rank} on {exchange} MAX BOARD!<br>마케팅 동의 · 랭킹 ON · 수상자만 결과 발표 시작일 06:10. 24와 별도 지급 안내. 강제 종료 시 취소.',
   body:[{h:'Congratulations on ranking #{rank} on EdgeX MAX BOARD!'},{p:'Your ranking reward for the EdgeX MAX BOARD is confirmed. Open the board to see the final leaderboard.'},kvRow(['Ranking reward'],'{amount} USDT'),kvRow(['Payout date'],'{payout date}'),{p:'SUP'},{link:'View MAX BOARD'}]},
 ]},
 'email.account':{title:'계정 메일 (T6·T7·T34)',states:[
  {id:'t6',label:'T6 · 비밀번호 재설정 코드',pc:'29062:9095',mo:'29064:5002',ko:'29062:9164',koMo:'29064:5065',cond:'<b>29062:9161 / 29062:9230 · T6 · 재설정 코드</b><br>제목 예시 Password reset verification code / 비밀번호 재설정 인증 코드<br>비밀번호 재설정 메일. 자동 지급 72시간 제한·해제 예정일 삭제.',
   body:[{h:['Password reset verification code','비밀번호 재설정 인증 코드']},{code:'123456'},{p:['This verification code is valid for 10 minutes. Please do not share it with anyone.','이 인증 코드는 10분 동안 유효합니다. 본인 외의 타인에게 공유하지 마세요.']},{p:['SUP',`추가 지원이 필요하실 경우, ${lnk('고객센터')}에 문의해 주세요.`]}]},
  {id:'t7',label:'T7 · 비밀번호 재설정 완료',pc:'29062:9233',mo:'29064:5128',ko:'29062:9300',koMo:'29064:5191',cond:'<b>29062:9297 / 29062:9364 · T7 · 재설정 완료</b><br>제목 예시 Password reset completed / 비밀번호 재설정 완료<br>비밀번호 재설정 메일. 자동 지급 72시간 제한·해제 예정일 삭제.',
   body:[{h:['Password reset completed','비밀번호 재설정이 완료되었습니다.']},{p:['Your password has been reset.','비밀번호가 재설정되었습니다.']},kvRow(['Email Address','이메일 주소'],'tethermax@gmail.com'),{p:['SUP',`추가 지원이 필요하실 경우, ${lnk('고객센터')}에 문의해 주세요.`]}]},
  {id:'t34',label:'T34 · 가입 환영',pc:'29062:9367',mo:'29064:5254',ko:'29062:9435',koMo:'29064:5317',cond:'<b>29062:9432 / 29062:9500 · T34 · 가입 환영</b><br>제목 예시 Welcome to TetherMax / TetherMax에 오신 것을 환영합니다<br>환영 메일 · DEX 지갑 연동·계정별 자동 지급 안내.',
   body:[{h:['Welcome to <span style="color:#0031c6">TetherMax</span>,<br>the most trusted Cashback platform.','<span style="color:#0031c6">TetherMax에 오신 것을 환영합니다.</span>']},
    {p:['All investment responsibilities lie with the investor.<br>However, the responsibility for commission refunds lies with TetherMax.','모든 투자 책임은 투자자에게 있습니다.<br>그러나 수수료 환급에 대한 책임은 TetherMax에 있습니다.']},
    {p:[`You have registered as a member after agreeing to the terms of use and privacy policy.<br>Your information will be securely stored according to our privacy policy,<br>and if you wish to modify your information, you can do so on the TetherMax site > ${lnk('[My Page]')}`,'이용 약관 및 개인정보 보호정책에 동의하여 회원가입이 완료되었습니다.<br>입력하신 정보는 개인정보 보호정책에 따라 안전하게 보관됩니다.<br>회원 정보를 수정하려면, TetherMax 사이트 > [마이 페이지]에서 변경할 수 있습니다.']},
    {box:[['How to Get Started','시작 방법'],[['1. Sign up using the link on your exchange’s detail page.','2. Link your exchange UID or DEX wallet to TetherMax.','3. When an account’s claimable cashback reaches 10 USDT, it is paid automatically to that account.','4. Open the TetherMax app to check your cashback.'],['1. 거래소 상세 페이지의 링크를 통해 가입하세요.','2. 거래소 UID 또는 DEX 지갑을 테더맥스에 연동하세요.','3. 계정별 지급 가능액이 10 USDT 이상이면 해당 계정으로 자동 지급돼요.','4. 테더맥스 앱에서 캐시백 내역을 확인하세요.']]],c:'#222'}]},
 ]},
};

// ---------- 렌더 ----------
const tx=v=>Array.isArray(v)?(v.length>1?T(v[0]==='SUP'?SUP():v[0],v[1]):v[0]):v==='SUP'?SUP():v;
function block(b,ko){
 const F='font-family:Inter,var(--font);';
 if(b.h)return `<p style="${F}margin:0;font-size:20px;line-height:1.6;letter-spacing:.15px;font-weight:600;color:#222">${tx(b.h)}</p>`;
 if(b.p)return `<p style="${F}margin:0;font-size:14px;line-height:1.43;letter-spacing:.17px;color:rgba(0,0,0,.87);${b.med?'font-weight:500;':''}">${tx(b.p)}</p>`;
 if(b.kv){const [k,v,o]=b.kv;const reg=o.reg||(o.koReg&&ko);
  return `<div style="${F}color:rgba(0,0,0,.87);letter-spacing:.17px"><div style="font-size:14px;line-height:1.43">${tx(k)}</div><div style="${reg?'font-size:14px;line-height:1.43;font-weight:400':'font-size:16px;line-height:1.5;font-weight:600;letter-spacing:.15px'};word-break:break-all">${tx(v)}</div></div>`}
 if(b.box){const [t,items]=b.box;const list=Array.isArray(items[0])?tx(items):items[0];
  return `<div style="${F}background:rgba(207,216,220,.2);padding:16px;display:flex;flex-direction:column;gap:8px;font-size:14px;line-height:1.43;color:${b.c||'rgba(0,0,0,.87)'}"><b style="font-weight:600">${tx(t)}</b>${(Array.isArray(list)?list:[list]).map(x=>`<span>${x}</span>`).join('')}</div>`}
 if(b.alert)return `<div style="${F}background:#fdeded;color:#5f2120;border-radius:4px;padding:6px 16px;display:flex"><p style="margin:0;padding:8px 0;font-size:14px;line-height:1.43">${b.alert}</p></div>`;
 if(b.sub)return `<p style="${F}margin:0;font-size:14px;font-weight:600;color:#303541">${b.sub}</p>`;
 if(b.bullet)return `<div style="${F}background:rgba(207,216,220,.2);border:1px solid rgba(0,0,0,.12);border-radius:12px;padding:12px;font-size:13px;font-weight:500;color:#000;line-height:1.5">• ${b.bullet}</div>`;
 if(b.hr)return `<div style="height:1px;background:rgba(0,0,0,.12)"></div>`;
 if(b.link)return `<a style="${F}font-size:14px;font-weight:500;color:#1743c6;cursor:pointer">${tx(b.link)}</a>`;
 if(b.btn)return `<button style="${F}width:100%;background:#0031c6;color:#fff;border:0;border-radius:4px;padding:8px 22px;font-size:15px;font-weight:500;line-height:26px;cursor:pointer">${b.btn}</button>`;
 if(b.cap)return `<p style="${F}margin:0;font-size:12px;font-weight:500;line-height:1.66;color:${b.c||'rgba(0,0,0,.6)'}">${b.cap}</p>`;
 if(b.code)return `<div style="${F}align-self:flex-start;border:1px solid #0031c6;border-radius:4px;padding:16px;font-size:34px;font-weight:700;color:#0031c6;line-height:1.2">${b.code}</div>`;
 if(b.table)return `<table style="${F}width:100%;border-collapse:collapse;font-size:14px;font-weight:500">${b.table.map((r,i)=>`<tr>${r.map(c=>i?`<td style="padding:8px">${c}</td>`:`<th style="background:#5d6067;color:#fff;text-align:left;padding:4px 8px;font-weight:500">${c}</th>`).join('')}</tr>`).join('')}</table>`;
 return '';
}
function banner(mo){
 const W=mo?327:582,k=mo?.77:1;
 return `<div style="position:relative;width:${W}px;max-width:100%;height:120px;border-radius:4px;overflow:hidden;flex:none">
  <img src="${A('email-banner-bg.jpg')}" style="position:absolute;left:0;top:-195px;width:582px;height:327px;max-width:none;object-fit:cover" alt="">
  <div style="position:absolute;inset:0;background:rgba(0,49,198,.25)"></div>
  <img src="${A('email-banner-coin.png')}" style="position:absolute;left:${Math.round(349*k)}px;top:${Math.round(98*k)}px;width:${Math.round(252*k)}px;height:${Math.round(151*k)}px;max-width:none;object-fit:cover;transform:scaleY(-1);filter:blur(5px)" alt="">
  <img src="${A('email-banner-coin.png')}" style="position:absolute;left:${mo?147:299}px;top:${mo?6:-24}px;width:${mo?219:283}px;height:${mo?134:173}px;max-width:none;object-fit:cover" alt="">
  <img src="${A('email-logo.svg')}" style="position:absolute;left:24px;top:${mo?53:50}px;width:${mo?128:177}px;height:${mo?14.5:20}px" alt="TetherMax"></div>`}
function footer(ko,sns4){
 const icons=[1,2,3,4,5].filter(n=>!(sns4&&n===1)).map(n=>`<img src="${A('email-sns-'+n+'.svg')}" style="width:${n===4?23:32}px;height:${n===4?24:n===5?28:32}px${sns4?';opacity:.45':''}" alt="">`).join('');
 const F='font-family:Inter,var(--font);font-size:12px;line-height:1.33;letter-spacing:.2px;color:rgba(0,0,0,.6)';
 return `<div style="padding:24px;display:flex;flex-direction:column;gap:24px"><div class="row" style="gap:16px">${icons}</div>
  <div style="${F}">${ko?`이 이메일은 발신 전용입니다.<br><br>TetherMax 계정 관련하여 궁금한 점이 있으시면 ${lnk('고객센터')}<span style="color:rgba(0,0,0,.87)">에 문의해 주세요.</span>`:`Please note that this email is for outgoing communication only.<br><br>If you have any questions regarding your TetherMax account, ${lnk('contact our customer support')}`}</div>
  <div style="${F};line-height:12px">© 2026 TetherMax. All rights reserved.</div></div>`}
function emailCard(s){
 const mo=S.vp==='mo',ko=S.lang==='ko'&&(s.ko||(s.body&&s.body.ko));
 const blocks=Array.isArray(s.body)?s.body:(ko?s.body.ko:s.body.en);
 const W=mo?375:630,inner=mo?327:582;
 return `<div style="background:#e9ecef;padding:${mo?0:'40px 16px'}">
  <div style="width:${W}px;max-width:100%;margin:0 auto;background:#fff;padding-top:24px;display:flex;flex-direction:column;align-items:center;gap:24px;text-align:left">
   ${banner(mo)}
   <div style="width:${inner}px;max-width:calc(100% - 48px);display:flex;flex-direction:column;gap:24px">${blocks.map(b=>block(b,ko)).join('')}</div>
   <div style="width:${inner}px;max-width:calc(100% - 48px);height:1px;background:rgba(0,0,0,.12)"></div>
   <div style="width:${mo?375:630}px;max-width:100%">${footer(ko,s.sns4en&&!ko)}</div>
  </div></div>`}
for(const [id,def] of Object.entries(EMAILS)){
 R.screen({id,group:'email',title:def.title,route:'(이메일)',fu:[],shell:false,
  states:def.states.map(s=>({id:s.id,label:s.label,figma:{pc:s.pc,mo:s.mo},note:s.ko?`KO 프레임 ${s.ko} · KO 모바일 ${s.koMo}`:'EN 프레임만 있음(KO는 영문 그대로 표시)'})),
  render(st){const s=def.states.find(x=>x.id===st)||def.states[0];
   return emailCard(s)+`<div style="width:${S.vp==='mo'?375:630}px;max-width:100%;margin:8px auto 24px">${C.note(`<b>발송 조건</b> ${s.cond}`)}${C.note(`네트워크 값(${NET})은 시안 예시 — 실제는 백오피스 지급 네트워크 설정값(정책 D-6-4·G-044). 지갑 주소는 전체 표시·줄바꿈 허용`)}</div>`}});
}
