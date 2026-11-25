# Mixpanel Events — User Screen

> English translation of `믹스패널이벤트_ko.md`. If the two differ, the Korean original prevails.

| Item | Details |
|------|---------|
| Project | TetherMax New Member Bingo Event (service name: 맥스보드 / MAX BOARD) |
| Created | 2026-10-07 |
| Version | v1.1 (2026-10-12 consistency review applied (confirmed 2026-10-12): `link_uid` target now includes users who lost their participating UID and have no UID to select; the target of "Select New UID" in `join` stated as users who lost their participating UID (ownership transfer, issue UID); source documents notation) / v1.0 (2026-10-07 split out of section 7 of the user front-end functional specification) |
| Audience | User screen front-end developers |
| Source documents | PRD.md v1.0 (overview; detailed history in Git v0.11), 분할문서/사용자/기능명세_프론트_en.md, 분할문서/사용자/API스펙_en.md, src/mockup/index.html (default screen V2) |

> Mixpanel events sent from the user screen (benefit detail). The back-office screens send no events.

---

## 1. Event List

Only the actions that are really needed on screen are tracked. Use a single event name `max_board` and, as with existing events, put the value in the `page_view` / `btn_name` / `result` parameter. The cell check (`result`) is sent by the front end after receiving the API response.

| Event Description | Event Name | Parameter | Value | Event Description(ko) | Event Description(en) |
|-------------------|------------|-----------|-------|-----------------------|-----------------------|
| Benefit Detail | max_board | page_view | detail | 혜택 상세(맥스보드) 페이지 진입 | Enter the benefit detail (MAX BOARD) page |
| Participation | max_board | btn_name | link_uid | 참여 기간에 자격 UID 없는 사용자(참여 UID를 잃고 고를 UID가 없는 사용자 포함)가 "UID 연동하기" 클릭 | During the participation period, a user without an eligible UID (including a user who lost their participating UID and has no UID to select) clicks "Link UID" |
| Participation | max_board | btn_name | join | "참여하기" 또는 "새 UID 선택하기"(참여 UID를 잃은 사용자) 클릭(UID 선택 레이어 열림) | Click "Join Now" or "Select New UID" (user who lost their participating UID) (UID selection layer opens) |
| Cell Check | max_board | result | check_cell | 칸 체크 성공(API-006 성공) | Cell checked (API-006 success) |

- **Common properties**: send `exchange` (the board's exchange, lowercase, e.g., `bitget`) and `benefit_no` (benefit number) with every event.
- Entry from app push and email (inflow tracking) is defined separately (tracking items in the copy sheet, to be added later).
