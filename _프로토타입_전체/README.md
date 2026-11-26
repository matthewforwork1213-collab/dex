# TetherMax 전체 프로토타입

| 항목 | 내용 |
|---|---|
| 목적 | DEX 기능만 따로 보면 맥락이 안 잡혀서, 테더맥스 사용자 화면 전체를 하나의 프로토타입으로 만든다 |
| 디자인 원본 | Figma `UI-UX Design` › 페이지 `DEX(revision)` (fileKey `hsa3bSV9QmFTe2jsf6tzTm`, node `28960:125519`). 기존 테더맥스 화면은 같은 파일의 `[MAX-…]` 페이지 |
| 내용 원본 | `00_DEX_최종정책.md` > 요구사항정의서 > 기능명세서(FU) · 2026-11-25 확정 결정 `ref/decisions_1125.json` · 이전 프로토타입 `_프로토타입_V2.2/` |
| 빌드 | `node build.cjs` → `TetherMax_전체프로토타입_YYYYMMDD_HHMM.html` + `_latest.html`(점검·스크린샷용) |
| 점검 | `node tools/check.cjs [화면id 접두사]` — 모든 화면×상태×PC/모바일×EN/KO 렌더 오류·금지어 |
| 스크린샷 | `python -I tools/shot.py <화면id:상태> <pc|mo> <out.png> [en|ko] [design]` |

## 반영 원칙 (사용자 결정 2026-11-25)

| 경우 | 처리 |
|---|---|
| 프로토타입 상태에 맞는 Figma 프레임이 있음 | **Figma대로** 만든다(레이아웃·문구·에셋). 상태의 `figma`에 노드 id를 적는다 |
| 맞는 Figma 프레임이 없음 | **기존 프로토타입(V2.2) 내용 그대로** 새 디자인 시스템으로 옮긴다. `figma:null` → 도구에 「디자인 없음」으로 표시되고, 이것이 디자인 누락 목록이 된다 |
| Figma에만 있고 프로토타입에 없음 | 정책상 넣는 게 자명하면 넣는다. 애매하면 넣지 말고 `ref/질문목록.md`에 적는다(사용자에게 묻는다) |
| Figma가 정책과 다름 | 정책이 맞다. 예: `L12 Verification limit reached`는 G-063(시도 한도 미도입)으로 만들지 않는다. 숨김(hidden) 프레임은 쓰지 않는다 |

## 파일 구조

| 파일 | 내용 |
|---|---|
| `src/00-core.css` | 디자인 토큰(MUI · Wanted Sans)과 공통 클래스 |
| `src/01-core.js` | 레지스트리 `R` · 상태 `S` · 컴포넌트 `C` · 셸(GNB·푸터·모바일 상단/하단) · 도구 UI |
| `src/02-groups.js` | 사이드바 그룹 |
| `src/NN-<그룹>.js` | 화면 모듈. 그룹별 한 파일(담당자 한 명) |
| `assets/` | Figma에서 내려받은 에셋. **파일명은 그룹 접두사**(`link-…`, `hub-…`)로 충돌을 막는다. 빌드 때 data URI로 들어간다 |
| `ref/` | `figma_frames.txt`(프레임 목록) · `v22_states.txt`(V2.2 기능별 상태) · `decisions_1125.json`(확정 결정) · `질문목록.md` |

## 화면 모듈 작성법

```js
R.screen({
  id:'link.addr',            // '<그룹>.<화면>' — 영문 소문자
  group:'link',              // 02-groups.js의 id
  title:'지갑 주소 입력',     // 사이드바 표시(한국어)
  route:'/link (모달)',       // 실제 경로(알면)
  fu:['FU-015'],             // 기능 ID
  shell:false,               // 모달 화면은 false(배경을 C.overlay로 그림). 페이지는 {nav:'cashback', accent:true, back:'home.main', moTitle:['Title','제목'], moNav:'home'}
  states:[
    {id:'empty', label:'빈 값 (L2)', figma:{pc:'28960:127275', mo:'28969:126986'}},  // 디자인 있음
    {id:'paste', label:'Paste 권한 거부', figma:null},                                // 디자인 없음
  ],
  render(st, ctx){ return `...` }   // st = 상태 id. S.vp('pc'|'mo') · S.lang · S.auth('guest'|'s3'|'s4')로 분기
});
```

| 규칙 | 내용 |
|---|---|
| 문구 | 사용자에게 보이는 문구는 `T(en, ko)`. Figma 문구가 있으면 그대로. 없으면 V2.2 문구(`_프로토타입_V2.2/_화면텍스트_V2.2.txt`)를 그대로. **지어내지 않는다** |
| 미정 값 | `C.tbd('내용','G-nnn')`. 단 `ref/decisions_1125.json`에 확정값이 있으면 확정값을 쓴다 |
| 설명 주석 | 개발자용 설명은 `C.note(html)`에만. 「디자인 보기」에서 숨는다. 화면 문구와 섞지 않는다 |
| 이동 | 클릭 이동은 `data-go="화면id:상태"`. 없는 화면은 점검에서 목록으로 나온다 |
| 컴포넌트 | `C.btn · C.field · C.modal · C.dialog · C.overlay · C.alert · C.chip · C.badge · C.dex · C.addr · C.usdt · C.kv · C.skel · C.toast` · 아이콘 `ic('close')` = `assets/ic-close.svg` |
| 레이아웃 | 절대 위치 대신 flex/grid. 웹 1440 · 모바일 375. 모바일 프레임이 있으면 모바일도 Figma대로 |
| 용어 | 캐시백(cashback) · 게스트(guest) · 연동/연동 해제(Link/Unlink). `페이백`·`payback`(경로 `/payback` 제외)·`rebate`·`non-member`·`disconnect` 금지 |
| 금액·시각 | USDT 소수 둘째 자리 절삭(`C.usdt`). 사용자 화면 시각은 로컬, 타임존 라벨 없음 |
