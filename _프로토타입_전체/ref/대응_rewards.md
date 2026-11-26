# 상태별 근거 대응 — 12. 리워드 (src/120-rewards.js)

2026-11-26 Figma 스크린샷 대조 후 확정. 「재사용」은 기존 다른 프레임·컴포넌트를 그대로 쓴 것(출처 노드 기재). 코드의 각 상태 note 맨 앞 `[기존 MAX-nnn]`이 기존 페이지 근거.

| 화면id:상태 | 상태 설명 | PC 근거 | PC 종류 | 모바일 근거 | 모바일 종류 | 비고(note 요약) |
|---|---|---|---|---|---|---|
| `maxboard.main:join` | 참여 가능 · 자격 있음 | 29062:111024 | DEX | 29062:111380 | DEX | Figma에만 있는 상태 — 원본 EligibilityState NOT_REGISTERED(정책 D-1-5)라 넣음 |
| `maxboard.main:normal` | 참여 중 — 하루 한 번 업데이트돼요 | 28537:449610 | 기존 | 28537:458145 | 기존 | [기존 MAX-] Bingo 「참여 기간 · 참여 중」 · V2.2 mb/BOARD#normal. 기존 쪽 UID 표현은 지갑으로(REQ-655) |
| `maxboard.main:today` | 참여 중 · 오늘 마감 | [MAX-] Bingo 「참여 중」 28537:449610 / 458145 | 재사용 | [MAX-] Bingo 「참여 중」 28537:449610 / 458145 | 재사용 | 재사용 — [기존 MAX-] Bingo 「참여 기간 · 참여 중」(28537:449610 · 458145) + 일정 줄. Ends Today/오늘 마감(REQ-639)은 Figma에 없는 문구 · V2.2 mb/BOARD#today |
| `maxboard.main:delayed` | 정산 지연 (캐시백 반영 지연) | 29062:111741 | DEX | 29062:112159 | DEX | V2.2 mb/BOARD#delayed |
| `maxboard.main:complete` | 보드 완성 (랭킹 ON) | 29064:10322 | DEX | 29064:10687 | DEX | V2.2 mb/BOARD#complete · Figma 프레임은 상단 히어로 없이 시작 — 히어로는 참여 중 모양을 씀 |
| `maxboard.main:final` | 마지막 날 Batch 후 완성 | DEX 보드 완성 29064:10322 / 10687 | 재사용 | DEX 보드 완성 29064:10322 / 10687 | 재사용 | 재사용 — DEX 보드 완성(29064:10322 · 10687 = 기존 「참여 중 (빙고판 완성)」 28537:450028)에 최종 순위 안내 한 줄(원문 없음) · V2.2 mb/BOARD#final |
| `maxboard.main:tally` | 집계 · 참여자 | 29064:12448 | DEX | 29064:12826 | DEX | Figma에만 있는 상태 — 원본 PRD 단계 「집계」(정책 D-1-4·REQ-110) |
| `maxboard.main:result` | 결과 발표 · 참여자 (지급일 안내) | 29064:13201 | DEX | 29064:13579 | DEX | V2.2 mb/BOARD#payDate(지급일 안내 문구) · 결과 발표 단계는 버튼 없이 지급일 안내(D-1-8) |
| `maxboard.main:excluded` | 결과 발표 · 제외 | 29064:14754 | DEX | 29064:15127 | DEX | Figma에만 있는 상태 — 원본 PRD 「어뷰징 제외: 사용자에게 알리지 않음」(ParticipantStatus EXCLUDED) |
| `maxboard.main:payout` | 지급 기간 — 이벤트 리워드 확인하기 | 29064:13958 | DEX | 29064:14356 | DEX | V2.2 mb/BOARD#payout · 버튼은 캐시백 요약으로 이동, 지갑 주소 대신 benefitNo(G-386 확정) |
| `maxboard.main:reselect` | 참여 지갑 해제 · 재선택 가능 | 29064:8888 | DEX | 29064:9244 | DEX | V2.2 mb/BOARD#reselect · Figma 버튼 Select a New UID → 정책 Select New Wallet(REQ-655) |
| `maxboard.main:confirm` | 새 지갑 재선택 확인 팝업 | 28537:462948 | 기존 | 28537:462988 | 기존 | [기존 MAX-] Bingo 「시안 B__modal3」 — 제목·선택 계정 박스·안내·Cancel/Confirm. 원문 UID를 지갑으로(REQ-655, 안내 문장은 V2.2 확정 문구) · 모바일은 바텀시트 · V2.2 mb/BOARD#confirm |
| `maxboard.main:reselNone` | 참여 지갑 해제 · 선택지 없음 | 29064:9601 | DEX | 29064:9961 | DEX | V2.2 mb/BOARD#noEligible(끊김 후 자격 없음) · Figma 버튼 Link UID → Link Wallet(G-322) |
| `maxboard.main:noEligible` | 참여 전 · 자격 지갑 없음 | 29064:8176 | DEX | 29064:8531 | DEX | V2.2 mb/BOARD#noEligible(둘째 문장) · 버튼은 이 DEX가 미리 선택된 지갑 입력으로(REQ-647) |
| `maxboard.main:failToast` | 등록 실패 토스트 | PC — Bingo toast 섹션 28537:451987(Toast warning) | 재사용 | 28537:459718 | 기존 | [기존 MAX-] Bingo 「toast」 — 실패 안내는 mui Toast warning(PC 섹션 28537:451987 안내). PC 프레임 없음 · V2.2 mb/BOARD#failToast |
| `maxboard.main:preopen` | 사전공개 · 자격 있음 | 29064:7182 | DEX | 29064:7428 | DEX | V2.2 mb/BOARD#preopen · 사전공개에는 연동 버튼 없음 |
| `maxboard.main:preopenNo` | 사전공개 · 자격 없음 | 29064:7679 | DEX | 29064:7925 | DEX | V2.2 mb/BOARD#preopenNo |
| `maxboard.main:ended404` | 종료 · 404 | 29064:15501 | DEX | 29064:15511 | DEX | Figma에만 있는 상태 — 원본 PRD 「종료·강제 종료 → 404」 |
| `coupon.box:normal` | Coupons 탭 | 11982:372438 | 기존 | 11922:364127 | 기존 | [기존 MAX-499] 「Coupons available」 · V2.2 cp/COUPON#normal. 만료 쿠폰은 이 탭이 아니라 Completed 탭(MAXOP-796) · 같은 목록이 DEX 29062:117713/117894의 배경 |
| `coupon.box:empty` | 쿠폰 없음 | 11982:388195 | 기존 | 11982:387214 | 기존 | [기존 MAX-499] 「No coupons」 — No coupons available + View Benefits · V2.2 cp/COUPON#empty. 기존 Web 프레임은 탭 배지가 7로 남아 있어 0으로 표시 |
| `coupon.box:history` | Completed 탭 · 사용/만료 이력 | 26648:710899 | 기존 | 25847:1339662 | 기존 | [기존 MAX-499] MAXOP-796(2026-09-29) 「Completed tab with Used and Expired」 — 행 오른쪽 Used/Expired 칩. 만료 쿠폰(V2.2 Expired {date}, REQ-402)도 여기. DE |
| `coupon.box:emptyDone` | Completed 비어 있음 | 11982:389627 | 기존 | 11982:388898 | 기존 | [기존 MAX-499] 「No completed coupons」 — You haven't use any coupons yet.(원문 그대로) + View Coupons · V2.2 cp/COUPON#emptyDone |
| `coupon.box:picker` | 계정 선택 — CEX/DEX 그룹 | 29062:117713 | DEX | 29062:117894 | DEX | V2.2 cp/COUPON#picker · 모바일도 가운데 다이얼로그(DEX 모바일 프레임). 확인 중 지갑·이슈 계정은 목록에서 제외(REQ-403) |
| `coupon.box:picker1` | 계정 1개 | DEX 계정 선택 29062:117713 / 117894 | 재사용 | DEX 계정 선택 29062:117713 / 117894 | 재사용 | 재사용 — DEX 계정 선택 다이얼로그(29062:117713 · 117894)에 행 1개. 기존 MAX-499 흐름에도 1개 분기 프레임 없음 · V2.2 cp/COUPON#picker1 |
| `coupon.box:picker6` | 계정 5개 초과 · Deactivated | PC — DEX 계정 선택 29062:117713 + Deactivated 행 | 재사용 | 12474:164724 | 기존 | [기존 MAX-499] 「Deactivated UIDs」 — 비활성 계정은 흐리게(배지 없음)·선택 불가(REQ-403). 5개 초과 목록은 다이얼로그 안 스크롤(디자인 없음) · V2.2 cp/COUPON#picker6 |
| `coupon.box:done` | 적용 완료 | 29065:7079 | DEX | 25994:12167 | 기존 | V2.2 cp/COUPON#done · 모바일은 [기존 MAX-499] MAXOP-782 「mWeb / Coupon claimed / with close」 전체 화면 · 라벨은 DEX면 Wallet(REQ-405) |
| `coupon.box:unable` | 사용 불가 | PC — 기존 Error state 12474:164021 다이얼로그 | 재사용 | 12474:164021 | 기존 | [기존 MAX-499] 「Error state」 — Unable to Use Coupon · PC는 같은 다이얼로그를 PC 폭으로(PC 프레임 없음) · V2.2 cp/COUPON#unable |
| `coupon.box:noAccount` | 연동 계정 없음 | 기존 Error state 12474:164021 틀 | 재사용 | 기존 Error state 12474:164021 틀 | 재사용 | 재사용 — 같은 「Error state」 다이얼로그 틀(12474:164021)에 G-196 연동 안내 + Link Account. 안내 문구 원문 없음 · V2.2 cp/COUPON#noAccount |
| `league.main:normal` | 팀 리더보드 | 1095:64518 | 기존 | 1017:17857 | 기존 | [기존 MAX-117] Global League 「Registered users (Team League)」 — 상금 풀 · All Teams · Event Rules · V2.2 lg/LEAGUE#normal. 점수 = 커미션 캐시백 1 USDT당 1 |
| `league.main:create` | 팀 생성 (자격 있음 → Create Team) | 2913:24305 | 기존 | 2913:24073 | 기존 | [기존 MAX-117] 「createTeam handling」 · 「When user is eligible to create team」 — 자격(연동 거래 계정 CEX + DEX 누적 캐시백 500 USDT 또는 최근 30일 100 USDT, REQ- |
| `league.main:createPick` | 팀 생성 계정 선택 | 29062:110959 | DEX | 29062:110984 | DEX | Figma에만 있는 상태 — 팀 생성 시 그 DEX 지갑 선택(REQ-390 참가 계정에 DEX 지갑) |
| `league.main:picker` | 참가 계정 선택 — DEX 지갑 포함 | PC — DEX 29062:110959 계정 선택 | 재사용 | 2913:21161 | 기존 | [기존 MAX-117] 「>1 UID handling」 Max 5 UID + DEX 계정 선택 행(CEX/DEX 그룹, REQ-390) · PC는 DEX 계정 선택 다이얼로그 재사용 · V2.2 lg/LEAGUE#picker 문구(국문만) |
| `league.main:reward` | 상금 수령 계정 | DEX 29062:110959 / >1 UID handling 2913:19878 | 재사용 | DEX 29062:110959 / >1 UID handling 2913:19878 | 재사용 | 재사용 — DEX 계정 선택 다이얼로그(29062:110959)에 참가 지갑 한 줄(G-187: 수령 계정 = 참가 계정) · V2.2 lg/LEAGUE#reward |
| `league.main:dexOnly` | DEX 지갑만 연동한 회원 | DEX 29062:110959 / >1 UID handling 2913:21161 | 재사용 | DEX 29062:110959 / >1 UID handling 2913:21161 | 재사용 | 재사용 — 「>1 UID handling」(2913:21161) 틀에 DEX 그룹만 · 「연동 계정 없음」으로 떨어지지 않음(REQ-389) · V2.2 lg/LEAGUE#dexOnly |
| `league.main:notLinked` | DEX 리그 미연동 안내 | 기존 Error state 12474:164021 틀 | 재사용 | 기존 Error state 12474:164021 틀 | 재사용 | 재사용 — 기존 [MAX-499] 「Error state」 다이얼로그 틀(12474:164021) + G-188 확정 문구 · V2.2 lg/LEAGUE#notLinked |
| `league.main:lighter` | Lighter 리그 (보류) | 1095:64518 | 기존 | 1017:17857 | 기존 | [기존 MAX-117] 리더보드와 같음 — Lighter 보류(G-189 · G-428), 화면 변화 없음 · V2.2 lg/LEAGUE#lighter |
| `league.main:card` | DEX 리그 혜택 카드 · URL | [MAX-468] Special Benefits 카드 10954:228708 | 재사용 | [MAX-468] Special Benefits 카드 10954:228708 | 재사용 | 재사용 — 혜택 Special Benefits 카드 틀([MAX-468] 10954:228708) · 기존 MAX-117 「Benefit list」(1017:8236) · V2.2 lg/LEAGUE#card · G-398: {exchangename}  |
| `benefits.list:normal` | 회원 · 진행 중 | 10954:228708 | 기존 | 17170:172813 | 기존 | [기존 MAX-468] S3/S4 Ongoing tab — 티켓형 목록 10행 + View Coupons · V2.2 bnf/LIST#normal. 예상 캐시백 계산하기: DEX를 골라 계산해도 완료(G-194). LINK UID 행은 CEX 첫 연동 |
| `benefits.list:guest` | 게스트 · 완료 탭 | 29062:113000 | DEX | 9365:199934 | 기존 | V2.2 bnf/LIST#guest · DEX 29062:113000(= 기존 S1/S2 Completed 9961:168204) · 모바일은 [기존 MAX-468] S1/S2 「Completed tab」 · 0.00 USDT + View Histor |
| `benefits.list:guestOn` | 게스트 · 진행 중 탭 | 9961:168203 | 기존 | 29062:113469 | DEX | [기존 MAX-468] S1/S2 Ongoing tab(PC) · DEX 29062:113469(= 기존 S1/S2 Ongoing 9365:198005, 모바일) · V2.2 bnf/LIST#guest의 진행 중 목록. 게스트 버튼은 가입으로 |
| `benefits.list:doneEmpty` | 회원 · 완료 0건 | 10954:230325 | 기존 | 11100:221304 | 기존 | [기존 MAX-468] S3/S4 Completed tab — You haven't completed any benefits yet. + View Benefits · V2.2 bnf/LIST#doneEmpty |
| `benefits.list:uidm` | UID 연동 3 USDT 상세 (CEX 전용) | 10976:53104 | 기존 | 11731:356403 | 기존 | [기존 MAX-468] 「Bind your UID Get 3 USDT」 · V2.2 bnf/LIST#uidm · CEX UID 첫 연동만(REQ-396) — 기존 문구가 UID 기준이라 그대로 맞음. 「DEX 지갑 연동은 대상 아님」 안내는 기존 화면 |
| `benefits.list:first` | 첫 캐시백 10 USDT 상세 (CEX · DEX) | 10978:69402 | 기존 | 9622:112561 | 기존 | [기존 MAX-468] 「Claim your first cashback Get 10 USDT」 · V2.2 bnf/LIST#first · 자동 지급(출금 버튼 없음) 정책으로 기존 CTA Withdraw Cashback and Get 10 USDT(모 |
| `challenge.detail:normal` | 레벨 1 (0%) | 10981:85015 | 기존 | MO — 35% 프레임 10739:232621을 0%로 | 재사용 | [기존 MAX-468] MAX-503 「When user has linked UID」 · V2.2 ch/CH1#normal. 모바일 0% 프레임은 없어 35% 프레임(10739:232621)을 0으로 표시 |
| `challenge.detail:progress` | 게이지 진행 (35%) | 10981:85020 | 기존 | 10739:232621 | 기존 | [기존 MAX-468] MAX-503 진행 35% · V2.2 ch/CH1#progress. 부제 13:00 = UTC 기준 로컬 변환, 타임존 표기 없음(REQ-410). CEX·DEX 커미션 캐시백 모두 산입(REQ-399) — 기존 화면에 설명  |
| `challenge.detail:pick` | 보상 받을 계정 선택 | 10981:85017 | 기존 | MO — DEX 쿠폰 계정 선택 29062:117894 | 재사용 | [기존 MAX-468] MAX-503 「Select a UID to receive the reward」 + DEX 계정 선택 행(CEX/DEX 그룹·지갑 전체 주소, REQ-438) · 제목은 DEX 쿠폰 계정 선택(29062:117713) 문구 ·  |
| `events.list:exchange` | 거래소 이벤트 탭 | 29062:112586 | DEX | 29062:112729 | DEX | V2.2에 별도 화면 없음(FU-072) — Figma대로. 거래소 이벤트 탭에 DEX 이벤트 노출(REQ-437) |
| `events.list:filterPc` | 거래소 필터 (PC 셀렉트·목록) | 29069:6595 | DEX | — | 해당없음 | 그룹 드롭다운 + 범위 선택, 배지 없음, 이벤트가 등록된 거래소만(REQ-437). 셀렉트 29069:6626 |
| `events.list:filterMo` | 거래소 필터 (모바일 시트) | — | 해당없음 | 29069:6544 | DEX | 모바일 바텀시트 Select Exchanges · Apply (n) |
| `tp.main:tp` | TP 탭 | 29062:114041 | DEX | 29062:114572 | DEX | V2.2에 별도 화면 없음 — DEX 출금도 TP 적립 트리거(REQ-451), 화면 변경 없음 |

## 집계 (상태 50개 × PC·모바일 = 100)

| 근거 종류 | 수 |
|---|---|
| DEX | 39 |
| 기존 | 37 |
| 재사용 | 22 |
| 해당없음 | 2 |

어디에도 없음: 없음

## Figma에만 있는 상태 (지금 프로토타입에 없음 — 참고)

| 노드 | 내용 |
|---|---|
| Bingo 「PC/MO · 사전공개 · 비회원」 `28537:444420`/`28537:452315` · 「참여 기간 · 비회원」 `28537:446882`/`28537:453097` · 「집계 · 비회원/미참여」 `28537:445158`/`28537:454887` · 「결과 발표 · 미참여」 `28537:445847`/`28537:455579` · 「지급 기간 · 미참여」 `28537:446191`/`28537:455925` | 게스트·미참여 단계 화면 |
| Bingo 「집계 · 참여 UID 잃음 (리워드 없음)」 `28537:445502`/`28537:455233` · 「지급 기간 · 참여 UID 잃음 (지급 후)」 `28537:446536`/`28537:456272` | 참여 지갑을 잃은 뒤 집계·지급 |
| Bingo 「랭킹 OFF 빙고판 · 참여 중」 `28537:447265`/`28537:458566` · 「리더보드 · 완성자 0명」 `28537:447237`/`28537:453068` · 빙고판 구성 금액 칸만/연속 칸만 `28537:451992`·`28537:452145`/`28537:459766`·`28537:459921` | 랭킹 OFF·리더보드 빈 상태·보드 구성 변형 |
| Bingo 참여 등록 모달 — 시안 A·B modal1(랭킹 보상표) `28537:462695`·`28537:463082` · modal2(「Only eligible Bitget UIDs are shown.」 계정 선택) `28537:462852`·`28537:463009` · modal3(「You can't change it after registration.」 등록 확인) `28537:462923` · modal4(빙고 완성) `28537:463218` · popover(칸 설명) `28537:459678`·`28537:459695` | `Join NOW` 이후 등록 흐름 — 지금 상태 목록에 없음 |
| MAX-117 Summary 탭(`1017:18063` 등) · Individual League(mWeb `1058:55649`, Web `1095:68889`) · TeamDetails(`1017:18498`) · Event Rules expanded(`1058:53217`) · mAPP(`1095:82310` 외) | 리그 요약·개인 리그·팀 상세 |
| MAX-503 「When user has not linked any UID」 Web `10981:85014` / mWeb `21772:102786` · 「Completed and claimed」 mWeb `10981:80498` | 챌린지 미연동·수령 완료 |
| MAX-492 「No Events」 mWeb `9733:148686` · 「Empty state - no banner」 Web `11366:318672` · Special Events `11184:163371` · Exclusive `11184:163863` | 이벤트 빈 상태·다른 탭 |
| Boost Improvement `[PC] main` `25683:830` · `[MO] main` `25683:1047` · `[PC] modal` `25683:1583` · `[MO] modal` `25683:1670` | 이벤트 배너 「Cashback Boost」의 상세 — 프로토타입 상태와 직접 대응 없음 |

## 메모

- 쿠폰 만료 쿠폰은 기존 MAXOP-796대로 Completed 탭의 `Expired` 칩(사용한 쿠폰은 `Used`). Coupons 탭에는 만료 행을 두지 않는다.
- 혜택 게스트: PC 완료 탭 = DEX `29062:113000`(= 기존 S1/S2 `9961:168204`), 모바일 완료 탭 = 기존 `9365:199934`, 모바일 진행 중 = DEX `29062:113469`(= 기존 `9365:198005`).
- 쿠폰·챌린지·리그 계정 선택은 모바일도 가운데 다이얼로그(DEX `29062:117894` · 기존 `11982:373721`). 비활성 계정은 흐리게만(배지 없음, 기존 `12474:164724`).
- 혜택 Ongoing 목록·쿠폰 목록은 기존 티켓형 행(위아래 반원 홈 + 점선 구분, `10954:228240`)을 공통 함수 `ticket()`으로 그린다.
- 맥스보드는 DEX 프레임이 기존 Bingo 프레임 복사본이라 둘 다 같은 근거. 기존 문구의 UID는 지갑으로(REQ-655).
- 리그 Create Team 모달의 카메라 아이콘은 에셋을 받지 않아 문자 아이콘으로 대신했다(레이아웃·문구는 `2913:24305` · `2913:24073`).
- 혜택 모바일 상단 선물 상자 이미지는 별도 에셋이 응답에 없어 PC 배너 이미지를 잘라 썼다.
