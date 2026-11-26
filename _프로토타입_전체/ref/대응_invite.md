# 상태별 근거 대응 — 11. 친구 초대 · 파트너 허브 (src/110-invite.js)

2026-11-26 Figma 스크린샷 대조 후 확정. 「재사용」은 기존 다른 프레임·컴포넌트를 그대로 쓴 것(출처 노드 기재). 코드의 각 상태 note 맨 앞 `[기존 MAX-nnn]`이 기존 페이지 근거.

| 화면id:상태 | 상태 설명 | PC 근거 | PC 종류 | 모바일 근거 | 모바일 종류 | 비고(note 요약) |
|---|---|---|---|---|---|---|
| `invite.main:normal` | 초대 랜딩 (IF1) | 28960:126816 | DEX | 12474:203982 | 기존 | 모바일은 [기존 MAX-587] Invite Friends mWeb 1행(같은 문구·약관 아코디언 접힘) · V2.2 inv/IF8#normal · 3단계 끝 문구는 G-198 확정값으로 교체(Figma는 「whenever they trade」) |
| `invite.main:code` | Invite 탭 — 코드·링크 (IF3) | 28960:126828 | DEX | 12503:260211 | 기존 | 모바일 [기존 MAX-587] mWeb 2행 · Figma에만 있는 상태 — 초대 코드 받기 후 화면(정책 B-8-15 초대 탭) |
| `invite.main:codeCopied` | 코드 복사 토스트 (IF4) | 28960:126834 | DEX | 기존 mWeb 2행 12503:260211 + [MAX-468] 토스트 12340:51396 | 재사용 | IF4 Code copied — 토스트 상태 · 모바일은 재사용: 기존 mWeb 2행(12503:260211) + [기존 MAX-468] 「Toast when issuing invitation code」(12340:51396) 토스트 |
| `invite.main:linkCopied` | 링크 복사 토스트 (IF5) | 28960:126840 | DEX | 기존 mWeb 2행 12503:260211 + [MAX-468] 토스트 12340:51396 | 재사용 | IF5 Link copied — 토스트 상태 · 모바일은 재사용: 기존 mWeb 2행 + [기존 MAX-468] 토스트(12340:51396) |
| `invite.main:empty` | Invitation Reward 탭 — 0명 빈 상태 (IF6) | 28960:126846 | DEX | 29065:5700 | DEX | V2.2 inv/IF8#empty · REQ-419 — 약관은 계속 표시 |
| `invite.main:terms` | 약관 bullet 펼침 | [MAX-425] Terms&NotesExpanded 4923:56476 | 재사용 | [MAX-425] Terms&NotesExpanded 4923:56476 | 재사용 | V2.2 inv/IF8#terms · PC는 약관이 항상 펼쳐짐(IF1과 같음). 모바일 펼친 상태는 재사용 — [기존 MAX-425] 「Terms&NotesExpanded」(4923:56476) 틀 |
| `invite.main:rewards` | Invitation Reward 탭 — 자동 지급 (IF7) | 28967:127210 | DEX | 29065:6175 | DEX | V2.2 inv/IF8#rewards · REQ-413·414 — `Auto Claim` 비활성, 계정 선택 없음(관리자 지정 계정으로 50 USDT부터 자동 지급). 모바일 Figma `Withdraw`·`Linked Trading Accounts  |
| `invite.main:below50` | 50 USDT 미만 | — | 없음 | — | 없음 | V2.2 inv/IF8#below50 · REQ-414 — 안내 문구는 Claim 용어로 재작성 대상(G-419 「문구표에서 확정」, 확정 문구 없음) |
| `invite.landing:normal` | 피초대자 가입 랜딩 (IF2) | 28960:126822 | DEX | 12565:243367 | 기존 | 모바일 [기존 MAX-587] mWeb 5행 · Figma에만 있는 화면 — 약관 4곳 중 하나(REQ-421 「피초대자 가입 랜딩」). 게스트 GNB로 보면 실제와 같다 |
| `partner.hub:normal` | 대시보드 — Linked Accounts · 퍼널 (PH1) | 28960:127182 | DEX | 29065:3660 | DEX | V2.2 ph/PHUB#normal · REQ-426·428·430·434 — `Auto Claim` 비활성(모바일 Figma `Withdraw`는 쓰지 않음). 약관 최소액 50→10 USDT(G-203) |
| `partner.hub:total` | Total → 거래소별 집계 모달 (PH2) | 29042:100846 | DEX | 6266:13382 | 기존 | 모바일 [기존 MAX-425] 「When there are more than 5 exchanges (open full modal)」 — 같은 목록 모달(343폭, 스크롤) · Figma에만 있는 상태 — REQ-426 「Total을 누르면 거래소별 연 |
| `partner.hub:modal` | 하위 회원별 연동 계정 모달 | 28960:127188 | DEX | PC DEX 28960:127188 모달을 모바일 폭으로(기존 4936:65393 모달 내용은 프레임에 안 보임) | 재사용 | V2.2 ph/PHUB#modal · REQ-427 — Sub-Account의 Member ID에서 연다. CEX 마스킹, DEX 전체 주소, `{n} Accounts`(G-394) |

## 집계 (상태 12개 × PC·모바일 = 24)

| 근거 종류 | 수 |
|---|---|
| DEX | 13 |
| 기존 | 4 |
| 재사용 | 5 |
| 없음 | 2 |

어디에도 없음: `invite.main:below50 (PC)`, `invite.main:below50 (MO)`

## Figma에만 있는 상태 (지금 프로토타입에 없음 — 참고)

| 노드 | 내용 |
|---|---|
| 기존 MAX-587 「Referral Friends」 Web `15170:208042`(결과 있음) · `15170:209058`(Empty State) · `15170:209281`(검색 결과 없음) · `15170:209478`(10명 초과) / mobile `15213:254044` · `15245:304419` | IF7의 `Referral Details` 버튼이 여는 피초대자 목록 |
| 기존 MAX-587 MAXOP-236 「리워드 조회」 Web `15798:99716` · Empty `15798:100642` / mWeb `15798:101258` | `Reward History` 목록으로 추정(라벨 없음) |
| 기존 MAX-587 4행 오른쪽 Web 900 프레임 `12565:239008` · `12565:240627` · `13051:55080` · `12565:241395` / mWeb 「When there more than 3 UIDs」 `13051:54465` · 「When user has not link UID」 `12565:231178` | 기존 출금 계정 선택(정책상 폐기 — IF8~IF11 숨김과 같은 흐름) |
| 기존 MAX-425 「No members (Day 0)」 mWeb `5568:26624` · 「Invite Reward History」 Web `5837:117520` / mWeb `5837:114278` · 「Sub-Account」 mWeb `5702:17964` · 「Members」 Web `5702:13546` · 「Show toast when link copied」 mAPP `6128:58550` | 파트너 허브 Day 0 · 리워드 이력 · Sub-Account 탭 · 복사 토스트 |
| 기존 MAX-425 「Withdrawal flow」 mWeb `5654:106902` | 정책상 쓰지 않음(자동 지급) |

## 메모

- 기존 MAX-587 mWeb 1·2·5행(`12474:203982` · `12503:260211` · `12565:243367`)을 스크린샷으로 확인 — 각각 초대 랜딩·Invite 탭(코드·링크)·피초대자 가입 랜딩. 3·4행은 DEX 모바일 프레임(`29065:5700` · `29065:6175`)과 같음.
- 파트너 허브 모바일 Total 모달은 기존 「more than 5 exchanges」(`6266:13382`)와 같은 목록 모달. 하위 회원 연동 계정 모달의 모바일 프레임(`4936:65393`)은 배경만 보이고 모달 내용이 렌더되지 않아 PC DEX 모달을 재사용.
- 기존 mAPP 프레임은 앱 전용 상태가 없어 쓰지 않았다.
