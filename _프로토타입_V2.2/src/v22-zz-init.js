// ===== V2.2 · 시작 경로 재적용 — 모듈이 화면 순서를 바꾼 뒤 주소(#그룹/화면)를 다시 연다 =====
(function(){const r=location.hash.slice(1);if(r&&r.split('/').length===2&&P.some(p=>p.id===r.split('/')[0]&&p.states.some(s=>s.id===r.split('/')[1])))nav(r)})();
