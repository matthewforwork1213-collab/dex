# 상태 → Figma 근거 대응 — 5. 거래 계정 연동 (link)

근거는 로컬 메타데이터(`ref/figma_pages/*.xml` · `ref/figma_index.tsv` · `tools/figfind.py`)로만 찾았다. 「후보」는 Figma 연결 후 스크린샷으로 확인할 목록이다.

## 기본 페이지 프레임

| 화면 | PC | mWeb / mAPP |
|---|---|---|
| link.select | DEX S3-2 `28960:127765`(홈 배경 + Link Account 모달) · 선택기 열림 `29020:204686`(S3-3 `29020:204682` 안) | DEX `29049:101433` 모바일 원본 + 시트 `29049:101731` · 기존 [MAX-30] 시트 `9105:193204` |
| link.uid | [MAX-30] `9105:196091` | DEX `29051:100488` · [MAX-30] mWeb `9105:188079` · mAPP `9287:185360` |
| link.addr · captcha | DEX L2 `28960:127275`(모달 `28960:127278`) | DEX `28969:126986` |
| link.signup | DEX `28960:127418` | — |
| link.proc · result · done | DEX L6~L15 · 기존 [MAX-30] MAXOP-751 Desktop 스플래시 `25963:710232`(Success)·`710273`(Error)·`710314`(Warning)·`710355`(Info) | DEX `28969:127073`~`127153` · MAXOP-751 mWeb `25959:16130`·`25960:1342411`·`1342450`·`1342489` |
| link.lguide | DEX D2 `28960:127444`(가이드 영역 `28960:127585`) | DEX D2 모바일 `28960:130999` |

## 상태별 대응

| 화면id:상태 | 상태 설명 | 기본 페이지 프레임(PC/mWeb) | 근거 후보 노드(DEX(revision)/기존 페이지) | 근거 종류(DEX/기존/재사용 컴포넌트/없음) | 확신(확실=이름·라벨 일치 / 후보=추정) | 찾은 키워드 |
|---|---|---|---|---|---|---|
| link.select:normal | 홈 체크리스트 진입 — 선택 없음 | `28960:127765` / `29049:101433` | PC S3-2 `28960:127765` · mo 시트 All `28969:126953` | DEX | 확실 | S3-2 choose a partner |
| link.select:dexlist | 푸터 진입 — 공통 거래소 선택기 All | `28960:127381` / `28969:126953` | PC UID 폼 `28960:127381` · 지갑 폼 `28960:127271` · 모바일 기존 선택 패널 | 공통 | 확실 | Search for an exchange · Search exchanges |
| link.select:all | All — 기존 연동 폼에서 처음 여는 상태 | `28960:127381` / `28969:126953` | PC [MAX-30] 웹 드롭다운 `11100:114574` 재사용 · 홈 체크리스트 열림 `29020:204682` · 모바일 기존 선택 패널 | 공통 | 확실 | Exchange selector (open) · All |
| link.select:cex | 칩 CEX | `29192:119719` / `28986:126528` | 같은 선택기 안에서 CEX 결과만 표시 | 공통 | 확실 | Filter CEX |
| link.select:dex | 칩 DEX | `29192:119723` / `28986:126557` | 같은 선택기 안에서 DEX 결과만 표시 | 공통 | 확실 | Filter DEX |
| link.select:one | 검색 1건 | 〃 | mo DEX `29051:104416`~`104418` · 기존 [MAX-30] `1 result found` `9105:194735` · PC `29020:204686` | DEX(mo) / 재사용 컴포넌트(PC) | mo 확실 · PC 후보 | 1 result found · DEX search one result |
| link.select:many | 검색 여러 건 | 〃 | mo DEX `29051:104230`~`104232` · 기존 [MAX-30] `Multiple results found` `9105:194538` · PC `29020:204686` | DEX(mo) / 재사용 컴포넌트(PC) | mo 확실 · PC 후보 | Multiple results found |
| link.select:none | 검색 0건(All 칩) | 〃 | mo 기존 [MAX-30] `No results found` `9105:194510`(원래 All 시트) · DEX DEX칩 0건 `29051:104598`~`104600` · PC `29020:204686` | 기존(mo) / 재사용 컴포넌트(PC) | mo 확실 · PC 후보 | No results found |
| link.select:dexbit | DEX 칩 «bit» 0건 | 〃 | mo DEX `29051:104597`(`29051:104598`~`104600`) · PC `29020:204686` | DEX(mo) / 재사용 컴포넌트(PC) | mo 확실 · PC 후보 | DEX search no results |
| link.select:region | 지역 제한 DEX 목록 제외 | 〃 | 목록에서 빠질 뿐 화면은 `all`·`dex`와 같음 — mo `28969:126953` · PC `29020:204686` | 재사용 컴포넌트 | 후보 | region(0건) |
| link.select:fail | 파트너 목록 로드 실패 | 〃 | 문구만: DEX API 상태 보드 S5_05 `Partners couldn’t load` `29002:128426` · 레이아웃 없음 | 없음(문구만 DEX 보드) | 확실(문구) | couldn · Partners couldn’t load · retry(0건) |
| link.select:intro | STG 웹 진입 질문(`/uidlinking`) | `9105:196091` / — | 없음(`Have you registered…`·`Yes, I have one` 문구 노드 0건) | 없음 | — | registered · Yes, I have one · uidlinking |
| link.uid:empty | CEX UID 빈 값 | `9105:196091` / `29051:100488` | PC 기존 [MAX-30] `9105:196091` · mo DEX `29051:100488` · [MAX-30] mWeb `9105:188079` | 기존(PC) / DEX(mo) | 확실 | Link UID · Bitget UID |
| link.uid:filled | UID 입력 완료 — Next 활성 | `9105:196091` / `29051:100488` | [MAX-30] 웹 `9287:185462`(값 1234567 · 포커스 · Next 활성) · mWeb `9105:188659` | 기존 | 확실(스크린샷 확인) | Link Exchange Flow |
| link.addr:empty | 빈 값(L2) | `28960:127275` / `28969:126986` | L2 `28960:127275` · mo `28969:126986` | DEX | 확실 | L2 Paste address, empty |
| link.addr:valid | 유효 주소(L3) | 〃 | L3 `28960:127279` · mo `28969:126996` · S3-4 `29020:100272` | DEX | 확실 | L3 Valid address |
| link.addr:paste | Paste 권한 거부 | 〃 | 없음. 가장 가까운 재사용 = [MAX-30] mWeb 토스트 `9733:179205`·`9733:176856` | 없음 | — | paste · clipboard(0건) |
| link.addr:e2 | 빈 값 제출 | 〃 | PC Address validation / Empty `28980:132144` · mo = Invalid address `28969:127006` 오류 필드 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Address validation |
| link.addr:ws | 주소 안 공백(L4) | 〃 | PC `28980:132242` · L4 `28960:127283` · mo `28969:127006` | DEX | 확실 | Internal whitespace · Invalid address |
| link.addr:case | 다른 형식 · 대소문자 유지 | 〃 | PC `28980:132193` · mo = Valid address `28969:126996` 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Preserve original case |
| link.addr:rejected | 거래소가 주소 거절 | 〃 | PC `28980:132291` · mo `28969:127006` 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Partner rejected address |
| link.addr:e6 | ENS·이름 입력 | 〃 | PC `28980:132340` · mo `28969:127006` 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Name instead of address |
| link.addr:e7 | 제로 주소 | 〃 | PC `28980:132389` · mo `28969:127006` 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Zero address |
| link.addr:kept | 실패 후 주소 유지 | 〃 | 화면은 값이 든 L3와 같음 — L3 `28960:127279` · S3-4 `29020:100272` · mo `28969:126996` | 재사용 컴포넌트 | 확실 | address pasted · Valid address |
| link.addr:hub | 허브 진입 — ApeX 미리 선택 | hub.main / `28969:126986` | L2 `28960:127275` + 다른 DEX 값 예 S4-3 Aster `29020:205838` | 재사용 컴포넌트 | 후보 | address pasted(Aster) |
| link.signup:prompt | 가입 먼저? 모달 | `28960:127418` / — | PC `28960:127418` · mo 없음(sign up mWeb 검색 결과에 연동용 없음) | DEX(PC) / 없음(mo) | 확실 | Signup + Link Wallet |
| link.signup:return | 복귀 후 미리 선택된 연동 모달 | `28960:127422` / `28969:126986` | PC 3 Return `28960:127422` · mo = L2 모바일 `28969:126986` 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | 확실 | 3 Return |
| link.captcha:normal | GEETEST 퍼즐(L5) | `28960:127287` / `28969:127016` | L5 `28960:127287` · mo `28969:127016` · 퍼즐 이미지 [MAX-792] Captcha 1 `13992:429798`(에셋 `link-captcha-1.png`) | DEX (+ 기존 에셋) | 확실 | Captcha |
| link.captcha:success | Verification Success | `28966:124154` / `28969:127073` | PC `28966:124154` · mo `28969:127073` · 보드 S1_17 `29002:126323` | DEX | 확실 | Verification success |
| link.captcha:retry | 퍼즐 실패·만료 재시도 | `28960:127287` / `28969:127016` | 문구만 보드 S1_14 `29002:126248`. [MAX-792] 스크린샷 4장은 GEETEST 이미지 참고 캡처(실패 화면 아님 — 확인함) | 없음(문구만 DEX 보드) | 확실(없음) | retry · Verification expired |
| link.captcha:scriptFail | 캡차 스크립트 로드 실패 | 〃 | 문구만 보드 S1_13 `29002:126223` | 없음(문구만 DEX 보드) | 확실(없음) | Verification could not load |
| link.proc:normal | 귀속 조회 중(L6) | `28960:127293` / `25963:14034` | PC L6 `28960:127293` · mo 기존 MAXOP-751 `INTEGRATION_PROCESSING` `25963:14034`(같은 스플래시, 문구는 L6) | DEX(PC) / 기존(mo) | 확실(스크린샷 확인) | Processing your wallet · INTEGRATION_PROCESSING |
| link.proc:prelink | 연동 전 잔액 출금 대기 | `28966:124158` / `28969:127087` | PC `28966:124158` · mo `28969:127087` | DEX | 확실 | Pre-link payout pending |
| link.result:normal | 레퍼럴 아님(L8) | `28960:127301` / `28969:127125` | L8 `28960:127301` · S3-F3 `28960:127816` · S4-F6 `28960:127906` · mo `28969:127125` · 기존 `FAILED_NOT_FOUND_UID` 25963:711332 / 13769 | DEX | 확실 | L8 · Referral not eligible |
| link.result:inuse | 타인 사용 중(L9) | `28960:127305` / `28969:127109` | L9 `28960:127305` · S3-F4 `28960:127822` · S4-F3 `28960:127888` · mo `28969:127109` · 기존 `FAILED_ALREADY_INTEGRATION` `25963:711373`/`13832` | DEX | 확실 | Account already in use |
| link.result:cooldown | 최근 소유권 인증(L12) | `28960:127322` / `28969:127132` | S3-F1 `28960:127804` · S4-F4 `28960:127894` · 모바일 다크 `28969:127339` · MAXOP-751 `25963:711185` / `25963:13554` | DEX | 확실 | FAILED_RECENT_POSSESSION · Verification Limit Reached |
| link.result:mine | 본인 이미 추가(L14) | `28960:127340` / `28969:127139` | L14 `28960:127340` · S4-F1 `28960:127876` · mo `28969:127139` · 기존 `FAILED_MY_INTEGRATION` | DEX | 확실 | Account already added |
| link.result:other | 기타 실패(L13) | `28960:127331` / — | PC L13 `28960:127331` · S3-F2 `28960:127810` · S4-F5 `28960:127900` · mo = Linking unavailable `28969:127153`(같은 문구) 재사용 · 기존 mWeb `FAILED_ISSUE_UID` `25963:13630` | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 후보 | Unable to link wallet · FAILED_ISSUE_UID |
| link.result:unavailable | 선택 뒤 연동 불가 | — / `28969:127153` | mo `28969:127153` · PC = L13 `28960:127331` 재사용 · 보드 S1_11 `29002:126173` · S5_04 `29002:128401` | DEX(mo) / 재사용 컴포넌트(PC) | mo 확실 · PC 후보 | Linking unavailable |
| link.result:limit | 한도 초과(L15) | `28960:127349` / `28969:127118` | L15 `28960:127349` · S4-F2 `28960:127882` · mo `28969:127118` · 기존 `INTEGRATION_MAX_COUNT_OVER` `25963:711467`/`13971` | DEX | 확실 | Wallet limit reached · Trading account limit |
| link.result:pending | 확인 중(L11) | `28960:127313` / `28969:127080` | L11 `28960:127313` · S4-F7 `28960:127912` · mo `28969:127080` · 보드 S2_04 `29002:126537` | DEX | 확실 | Checking your referral |
| link.result:prelinkFail | 연동 전 잔액 출금 실패 | `28966:124162` / `28969:127094` | PC `28966:124162` · mo `28969:127094` | DEX | 확실 | Pre-link payout failed |
| link.done:weekly | Lighter Weekly(L7) | `28960:127297` / `28969:127101` | L7 `28960:127297` · S3-6 `28960:127789` · mo `28969:127101` · 기존 `UID Link Completed` `25963:711132`/`25963:13469` | DEX | 확실 | L7 Account linked |
| link.done:normal | EdgeX Daily | `28960:127861` / `28969:127101` | PC S4-5 Account linked(Aster · `Daily · Next update`) `28960:127861` — 값만 EdgeX · mo는 L7 모바일 구조 재사용 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 재사용 | S4-5 Account linked |
| link.done:apex | ApeX Daily | 〃 | S4-5 `28960:127861`에 ApeX 값 | DEX(PC) / 재사용 컴포넌트(mo) | PC 확실 · mo 재사용 | Wallet linked |
| link.done:truncated | 180일 넘는 기록 | 〃 | 화면 = L7 스플래시 + 한 줄 · 문구 근거 보드 S2_13 `Cashback history` `29002:126835` | 재사용 컴포넌트(문구 DEX 보드) | 확실(디자인은 없음) | Cashback history |
| link.done:apexIdPending | ApeX AccountID 미반환 | 〃 | 회원 화면은 일반 성공과 같음(G-177) — S4-5 `28960:127861` | DEX(PC) / 재사용 컴포넌트(mo) | 확실 | — |
| link.lguide:normal | Lighter 가이드 Step 3 | `28960:127444` / `28960:130999` | DEX D2 Step guide step 3 › guide 섹션 `I28960:127444;354:49328`(완료 체크 1·2 · 활성 3 · `Step 3 of 5` · Plus/Premium 안내 Alert) · 모바일 D2 미대조 | DEX | PC 확실 · mo 후보 | Step guide |

## Figma에만 있고 상태로 만들지 않은 프레임

| 프레임 | 처리 |
|---|---|
| L10 Lighter Standard `28960:127309` · mo `28969:127146` | REQ-116으로 만들지 않음(질문_link) |
| L12 · S3-F1 · S4-F4 Verification limit reached `28960:127322`·`127804`·`127894` · mo `28969:127132` | G-063으로 만들지 않음 |
| L16 `28960:127367` | S3-2와 겹침(질문_link) |
| L0 Lighter page, before linking `28960:127412`·`127414` | DEX 상세 담당 |
| S3-1·S3-7·S4-1·S4-6 홈 | 홈 담당 |
| 보드 S1_16 `Log in to continue` · S2_05 `Wallet linking in progress` · S2_06 `Wallet linking unsuccessful` · S2_14 `Details have changed` · S2_15 `Checking your request` (`29002:126298`·`126562`·`126601`·`126855`·`126880`) | 연결 후 내용 확인 필요 — 홈 행·재진입 상태일 수 있음 |
