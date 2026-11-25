# 디자인 점검 — UIUX-Design-2.0 「Web」 DEX 섹션

작성일: 2026-11-16
대상: Figma `UIUX-Design-2.0` 노드 `818:342682` (Web) — DEX 섹션 27개(라이트 15 · 다크 11 · 라이트+다크 1)
기준: `00_DEX_최종정책.md` · 요구사항정의서 · 기능명세서 · 자동 지급 결정(2026-11-16) · STG 현재 화면
방법: 각 섹션의 텍스트 레이어와 디자이너 화면 라벨(SCREEN-LABEL · GROUP-LABEL)을 정책과 대조. 다크 섹션은 라이트와 같은 구성으로 보고 라이트 기준으로 점검

> 한계: 컴포넌트 인스턴스 안의 문구는 메타데이터에 나오지 않아 일부 버튼·칩 문구는 화면 라벨 설명으로 판정했습니다. 최종 반영 전에 해당 프레임을 화면으로 한 번 더 확인합니다.

## 1. 요약

| 등급 | 건수 | 내용 |
|---|---|---|
| 🔴 정책 충돌 | 7 | 자동 지급 미반영, DEX 범위(GRVT/ApeX), 셀프 해제, 연동 한도 분리, `Manage Wallets`, 지갑 주소 마스킹, 금지 문구 |
| ✏️ 수정 필요 | 7 | 소유권 흐름 세부(심사 시간 · 가이드), 미정 항목을 확정처럼 표시, 날짜 형식 혼재, 첫 연동 쿠폰 표시, 지난 메모, 캡차 중국어, 버튼 문구 |
| ✅ 정책과 일치 | 다수 | 3장 참고 |

## 2. 발견 사항

### 2.1 🔴 정책 충돌

| # | 섹션 · 화면 | 디자인 | 정책 · 결정 | 조치 |
|---|---|---|---|---|
| F-01 | **Withdraw on TetherMax** 전체 (DW0~6 · PW1~8 · HW1~3 · BW1~8 · SW0~5 · PE1~6) · Cashback Hub H3·H5·H8 · DEX detail D11 · DEX 카드 | 회원이 `Claim`을 눌러 팝업 → 확인 → 슬라이드 퍼즐 → 이메일 코드/Google OTP → `Your claim request was sent`로 **직접 신청**하는 흐름 | **10분 주기 자동 지급(2026-11-16 결정).** 10 USDT 이상이면 시스템이 출금 신청 API를 자동 호출, 회원 신청 없음. STG는 `Auto Claim` 버튼을 비활성으로 남김 **결정(2026-11-16): 출금 버튼은 전부 `Auto Claim`, 비활성(클릭 불가).** ① DW0 허브 · PW1 My Cashback · HW1 홈 · D11 상세 · DEX 카드의 `Claim` → 비활성 `Auto Claim` ② 버튼에서 열리던 팝업·확인·퍼즐·이메일/OTP·신청 완료(DW1~6, PW2~8, HW2~3, BW1~5, SW0~3, PE1~4) 제거 ③ 남길 것: 잔액·계정 상태 표시, 처리 중·완료·지연·실패(BW6~8, SW4~5, PE5~6)를 어디에 보여 줄지는 D-05 결정 후 |
| F-02 | **DEX detail** D6 · DEX detail (EDGEX, ASTER, **GRVT**) · How this works D8 | 상세 페이지 4종 = Lighter · EdgeX · Aster · **GRVT**. ApeX 상세 없음 | 대상 DEX = **Lighter · ApeX · EdgeX · Aster**. 정책에 GRVT 없음 | GRVT 상세(D6·D8) 제거 또는 ApeX로 교체. ApeX 상세 화면 추가 |
| F-04 | Ownership verification **R · REMOVE A WALLET** · WV3 「remove the wallet」 | 연동 계정 화면에서 회원이 지갑을 직접 삭제 | **사용자 셀프 해제 불가 — 고객센터 경로만**(정책 5-8). 단, 소유권 이전으로 해제된 행의 재청구 다이얼로그 `Remove Wallet`은 유지(정책 5-10) | R 그룹의 셀프 삭제 제거, WV3 버튼을 `Contact Support`로. 재청구 다이얼로그는 유지 |
| F-05 | Link wallet **L15** · L15b | 「DEX 지갑 한도 = 활성 DEX × 3 (현재 12). CEX UID 한도와 **별도**」 | **CEX·DEX 합친 거래 계정 총 개수로 한도 하나**(결정 B-3-1). DEX 별도 산식 폐기. 확인 중 계정도 점유 | 한도 문구·숫자를 통합 한도로. 「별도」 설명 삭제 — **디자인 재검토 때 반드시 확인할 항목** |
| F-06 | Link stories **S4-F2** | 한도 초과 → `Manage Wallets` 또는 `Cancel` | 셀프 해제가 없으므로 **삭제 안내·`Manage` CTA 쓰지 않음**(정책 `INTEGRATION_MAX_COUNT_OVER`) | `Manage Wallets` 제거, `Close`(또는 `Contact Support`) |
| F-07 | Invite Friends **IF8~IF10** | 초대 리워드 출금 계정 선택에서 「DEX wallet shown masked, like the claim popup」 | **사용자 화면 전체에서 DEX 지갑 주소는 마스킹하지 않음 — 전체 노출**(`#37`). 좁은 자리만 `0x7a3F…51E9` 형식 축약 허용. CEX UID만 기존 마스킹 | 지갑 주소 전체 노출(필요 시 축약 형식). 「claim popup도 마스킹」이라는 전제도 정책과 다름 |
| F-08 | Withdraw **PS3 Received, share** | 공유 카드 `You received 23.12 USDT` | `You received [total] USDT` **금지**(판정 H-23). 자동 지급이라 신청 완료 화면·공유 카드가 없음(정책 6-2, G-105) | 공유 카드(PS3) 제거 |

### 2.2 ✏️ 수정 필요

| # | 섹션 · 화면 | 디자인 | 기준 | 조치 |
|---|---|---|---|---|
| F-03 | **Ownership verification** O0 · O1 · O2 · O3~O16 · Link stories S3-F4 · S4-F3 | `Wallet already in use` → `Verify Ownership` → 녹화 업로드·심사·재청구 전체 흐름 | **DEX 소유권 인증·이전 지원**(정책 5-10) — 기존 CEX 흐름을 지갑에. 녹화 가이드 3단계(연결 해제 → 같은 지갑 재연결 → 전체 주소 표시), 30일 쿨다운은 O2, 관리자 응답 10분 없으면 자동 실패(기존 CEX) | 흐름 유지. ① 심사 안내의 「5분 안에 검토 · 24시간 지연 안내」를 기존 CEX 10분 자동 실패 기준으로 ② DEX별 가이드 형식은 G-432 결정 후 ③ O1 버튼 `Try a different wallet` · `Verify Ownership` + `Need help? Contact Support` |
| F-09 | Cashback Hub H3 · H5 · H8 | 잔액 줄에 `claimed`(누적 출금액) 표시 | `Total Claimed` 유지·제거 미정(❓ G-053, 판정 H-3). 결정 전에는 표시하지 않음 | 결정 전까지 빼거나 「미정」 표시 |
| F-10 | Link stories **S3-1** | 홈 체크리스트에서 3 USDT 쿠폰 배지를 아예 뺌 | 쿠폰은 **CEX 첫 연동에는 그대로 발급.** DEX 첫 연동 **경로에서만** 획득 안내 제거 | 체크리스트 기본 상태는 배지 유지, DEX를 고른 경로에서만 숨김 |
| F-11 | Withdraw DW6 · BW4 등 `Application Time 26/07/2024 18:09:33` · PS3 `24.09.12 10:00` | 날짜 형식 두 가지(dd/mm/yyyy · yy.mm.dd) | 사용자 화면 시각 = 로컬 변환, 라벨 없음. STG 현행 표기는 `26.08.26 17:02:35`(yy.mm.dd) | 한 형식으로 통일(STG 현행 기준 권장) |
| F-12 | Withdraw **FIRST PASS NOTES** | 「user picks an EVM network (BNB Smart Chain, Arbitrum One, …)」 | 네트워크는 **고정**, 화면 예시값 `BNB Smart Chain (BEP20)`(체인 확정 ⏳ D-2). 같은 섹션 본문 화면은 이미 고정 | 메모 갱신(지난 내용이 남아 있어 개발자가 오해할 수 있음) |
| F-13 | Withdraw DW3 · PW5 슬라이드 퍼즐 | 퍼즐 안내가 중국어 `请拖动滑块完成上方拼图` | 화면 언어와 맞아야 함. 정책 문구 `Slide to complete the puzzle` | 위젯 언어 설정 확인(디자인 캡처가 중국어로 찍힘) |
| F-14 | Link wallet **L9** | `Try Another Address` | 정책 `Try a different wallet` · `Verify Ownership`(정책 5-2 · 5-10) | 버튼 문구 맞춤 |

### 2.3 용어 확인 — `Claim` vs `Withdraw`

디자인과 STG는 `Claim`(`Your claim request was sent`, `Claim popup`)을 쓰고, 정책·산출물은 `Withdraw`(`Your withdrawal request was sent`, `Confirm Withdrawal?`)를 씁니다. STG 출금 화면이 `Claim`으로 바뀐 것과 같은 흐름이므로 **정책·산출물 쪽을 `Claim` 기준으로 맞출지** 결정이 필요합니다(STG_대조_점검 S-01).

## 3. 정책과 일치하는 것

| 섹션 | 일치 항목 |
|---|---|
| Withdraw | 네트워크 고정·예시값 `BNB Smart Chain (BEP20)` · 지갑 표 3행 초과 시 `Show all`, 펼치면 스크롤 약 4.5행 · 10 USDT 미만 지갑 `Unavailable`로 제외 · 매칭 후 0이면 `Confirm` 비활성(SW0) · 일부 실패 시 지급된 건 유지(BW6) · 처리 중 시간 약속 없음(BW7) · 지갑 변경은 고객센터 |
| Link wallet | 붙여넣기만(지갑 연결·서명 없음) · 캡차 후 레퍼럴 확인 · 레퍼럴 아님 / 타인 사용 중 / 이미 추가 / 시도 한도 / 기타 실패 다이얼로그 · 확인 중 = `manual_link_pending` 재사용, 경과 시간 미표시 · 미수령 10 USDT 이상 연동 차단 |
| Link stories | 진입 시 미선택(`Select a partner`) · All / CEX / DEX 칩 · 성공 토스트 · 새 행 `0.00 USDT` |
| Cashback Hub | 10 USDT 미만이면 버튼 비활성 + 남은 금액 안내 · 데이터 지연 시 마지막 값 + 갱신 시각 · 로드 실패 시 0 대신 `Try again` · 같은 DEX 지갑 여러 개 `+N` |
| Cashback Summary | 그룹 필터(All / All CEX / All DEX) · USDC 1:1 USDT 표시 · DEX 데이터 지연 표시 · 이벤트 리워드 행에 CEX UID 마스킹 / DEX 지갑 전체 |
| Ranking · Partner Hub · Invite | UID·지갑 함께 집계 · 연동 없는 회원만 `Account Link Required` · 초대 리워드에 DEX 포함 |
| DEX detail | 사용자 상태별 버튼(게스트 `Sign Up` / 미연동 `Link Wallet` / 연동 완료) · 이벤트 필터 All / CEX / DEX |

## 4. 다음 단계

1. 🔴 F-01~F-08을 디자이너에게 전달. 그중 F-01·F-08은 자동출금_영향검토의 결정(D-02 안내 문구 · D-03 보안 제한 · D-05 완료 화면·공유 카드)이 나와야 확정됩니다.
2. `Claim`/`Withdraw` 용어 결정(2.3) 후 정책·요구사항·기능명세 문구를 일괄 정리합니다.
3. 반영 전 해당 프레임을 화면으로 다시 확인합니다(인스턴스 안 문구).
