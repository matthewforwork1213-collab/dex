# 디자인 누락 목록 — 6. 소유권 인증 (own) (2026-11-26)

디자인 없는 상태: **0건.** 모든 상태가 DEX(revision) 또는 기존 [MAX-561] 프레임을 근거로 한다(`ref/대응_own.md`).

| 이전 누락 | 지금 근거 |
|---|---|
| own.inuse:normal (O1, PC·모바일) | DEX O1 결과 스플래시 28960:127644 · 모바일 28969:127109 |
| own.inuse:cooldown (O2, PC) | DEX O2 결과 스플래시 28960:127650 |
| own.verify:error (O9, 모바일) | DEX `Ownership / Unexpected error` 29102:132023 |
| own.home:unlinked (O14, 모바일) | [기존 MAX-561] mWeb Unlinked and UID claim by others 12783:404139 |

참고: 웹 O3~O10은 기존 [MAX-561] 원본 `Web` 컴포넌트로 다시 그려진 프레임 기준으로 맞췄다. 정책과 다른 Figma 값(파일 한도 `max. 1GB` → REQ-726 `100MB`, 쿠폰 경고 문구)은 정책을 따르고 note에 적었다.
