# 믹스패널 이벤트 — 사용자 화면

| 항목 | 내용 |
|------|------|
| 프로젝트명 | TetherMax 신규 회원 빙고 이벤트 (서비스명: 맥스보드 / MAX BOARD) |
| 작성일 | 2026-10-07 |
| 버전 | v1.1 (2026-10-12 정합성 점검 반영(확정 2026-10-12): `link_uid` 대상에 참여 UID를 잃고 고를 UID가 없는 사용자 추가, `join`의 "새 UID 선택하기" 대상을 참여 UID를 잃은 사용자(소유권 이전·이슈 UID)로 명시, 근거 문서 표기) / v1.0 (2026-10-07 사용자 기능명세_프론트 7장에서 분리) |
| 대상 독자 | 사용자 화면 프론트엔드 개발자 |
| 근거 문서 | PRD.md v1.0(개요, 상세 이력은 Git v0.11), 분할문서/사용자/기능명세_프론트_ko.md, 분할문서/사용자/API스펙_ko.md, src/mockup/index.html(기본 화면 V2) |

> 사용자 화면(혜택 상세)에서 보내는 믹스패널 이벤트를 정리한다. 백오피스 화면은 이벤트를 보내지 않는다.

---

## 1. 이벤트 목록

화면에서 꼭 필요한 행동만 기록한다. 이벤트 이름은 `max_board` 하나로 하고, 기존 이벤트와 같은 방식으로 `page_view` / `btn_name` / `result` 파라미터에 값을 넣는다. 칸 체크(`result`)는 API 응답을 받은 뒤 프론트가 보낸다.

| Event Description | Event Name | Parameter | Value | Event Description(ko) | Event Description(en) |
|-------------------|------------|-----------|-------|-----------------------|-----------------------|
| Benefit Detail | max_board | page_view | detail | 혜택 상세(맥스보드) 페이지 진입 | Enter the benefit detail (MAX BOARD) page |
| Participation | max_board | btn_name | link_uid | 참여 기간에 자격 UID 없는 사용자(참여 UID를 잃고 고를 UID가 없는 사용자 포함)가 "UID 연동하기" 클릭 | During the participation period, a user without an eligible UID (including a user who lost their participating UID and has no UID to select) clicks "Link UID" |
| Participation | max_board | btn_name | join | "참여하기" 또는 "새 UID 선택하기"(참여 UID를 잃은 사용자) 클릭(UID 선택 레이어 열림) | Click "Join Now" or "Select New UID" (user who lost their participating UID) (UID selection layer opens) |
| Cell Check | max_board | result | check_cell | 칸 체크 성공(API-006 성공) | Cell checked (API-006 success) |

- **공통 속성**: 모든 이벤트에 `exchange`(빙고판 거래소, 소문자, 예: `bitget`)와 `benefit_no`(혜택 번호)를 함께 보낸다.
- 앱 푸시·이메일로 들어온 경로(유입 트래킹)는 별도로 정한다(문구 시트 트래킹 항목, 추후 추가).
