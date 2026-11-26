# 질문 — 3. 비회원 캐시백 조회

| Figma 프레임(노드) | 내용 | 왜 애매한지 | 제안 |
|---|---|---|---|
| Web / Guest / handoffcex 29037:102463 | `Link account` → 같은 UID 연동 화면 | 연동 담당 모듈에 CEX UID 입력 화면 id가 아직 없음(`link.select`·`link.addr`만 있음) | 임시로 `link.uid`로 연결. 연동 담당이 CEX UID 입력 화면 id를 정하면 바꿈 |
| Web / Guest / limit 29035:99200 | 「Please wait before searching again.」만 있고 대기 시간 표기 없음 | 개발 메모는 429 → Retry-After 이후 재조회 | 남은 시간을 보여 줄지 확인 |
| 전 프레임 | 한국어 원문 없음 | Figma 문구가 영문만 | 국문 문구표 수신 후 반영 |
| Web / Guest / handoff 29035:97915 | 로그인 후인데 프레임의 헤더가 비로그인(Login · Sign Up) | 인증 후 복귀 상태라 회원 헤더가 맞아 보임 | 프로토타입은 도구 상단 인증 토글로 확인. 디자인 확인 요청 |
