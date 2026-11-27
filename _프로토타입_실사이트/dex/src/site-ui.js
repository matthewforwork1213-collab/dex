// ===== site-ui.js — 공통 인터랙션 컴포넌트 =====
// 동작·전환 값은 05.리포트/실사이트_인터랙션_기준.md(라이브 tethermax.io 측정)에서 가져온다. 모양은 각 화면의 Figma 마크업 그대로.
// 같은 종류의 요소는 모두 여기 함수 하나로 움직인다: 드롭다운(UI.dropdown) · 슬라이더(UI.slider) · 펼침(UI.collapse) · 물결(버튼) · 토글 전환(UI.toggleFx)
(function () {
'use strict';
const T = {
  ddOpen: 200, ddClose: 190,     // GNB 드롭다운: 높이+불투명도, ease-out
  slide: 150,                    // MUI Slider 클릭 점프
  collapse: 300,                 // FAQ 펼침·접힘
  modal: 220,                    // 팝업: 불투명도 + 30px 이동
  drawer: 280,                   // 모바일 드로어: 오른쪽에서 밀려 들어옴
  ripple: 550                    // MUI TouchRipple
};
const E = { out: 'cubic-bezier(0,0,.58,1)', io: 'cubic-bezier(.42,0,.58,1)', mui: 'cubic-bezier(.4,0,.2,1)' };
// 모션 토큰은 CSS 변수(00-core.css :root)가 원본 — 여기 값은 그 변수를 읽어 덮어쓴다(명세 05.리포트/모션명세_DEX.md와 1:1)
(function readTokens() {
  const cs = getComputedStyle(document.documentElement), ms = v => { v = (v || '').trim(); return v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : NaN };
  const m = k => ms(cs.getPropertyValue(k));
  const set = (k, v) => { if (!isNaN(v)) T[k] = v };
  set('ddOpen', m('--m-base')); set('slide', m('--m-fast')); set('collapse', m('--m-std')); set('modal', m('--m-modal')); set('drawer', m('--m-drawer')); set('ripple', m('--m-ripple'));
  T.fast = m('--m-fast') || 150; T.base = m('--m-base') || 200; T.std = m('--m-std') || 300; T.slow = m('--m-slow') || 400;
  T.shift = parseFloat(cs.getPropertyValue('--m-shift')) || 8;
  ['std', 'io', 'out'].forEach(k => { const v = cs.getPropertyValue('--e-' + k).trim(); if (v) E[k === 'std' ? 'mui' : k] = v });
})();
const UI = window.UI = { T, E };
// 움직임 줄이기 설정이면 모든 전환 생략
const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
UI.reduced = () => !!(RM && RM.matches);
// 내용 교체 전환(같은 자리의 내용이 바뀔 때): 불투명도 0→1 + 아래 8px → 제자리, 300ms ease-in-out(토큰 --m-std · --e-io · --m-shift)
UI.swapFx = function (els, o = {}) {
  if (UI.reduced()) return;
  (Array.isArray(els) ? els : [els]).filter(Boolean).forEach((el, i) => {
    try { el.animate([{ opacity: 0, transform: `translateY(${o.shift != null ? o.shift : T.shift}px)` }, { opacity: 1, transform: 'none' }], { duration: o.dur || T.std, easing: E.io, delay: (o.stagger || 0) * i, fill: 'backwards' }) } catch (e) { }
  });
};
// 교차 페이드: 이전 모습(유령)을 위에 겹쳐 사라지게 하고 새 요소는 나타나게(400ms — 라이브 온보딩 이미지 opacity .4s)
UI.crossFx = function (oldEl, newEl, o = {}) {
  if (UI.reduced() || !oldEl || !newEl) return;
  const d = o.dur || T.slow;
  try {
    oldEl.style.pointerEvents = 'none';
    oldEl.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: `scale(${o.outScale || 1.02})` }], { duration: d, easing: E.io, fill: 'forwards' }).onfinish = () => oldEl.remove();
    newEl.animate([{ opacity: 0, transform: `translateY(${o.shift != null ? o.shift : 12}px) scale(${o.inScale || .97})` }, { opacity: 1, transform: 'none' }], { duration: d, easing: E.io, fill: 'backwards' });
  } catch (e) { oldEl.remove() }
};
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

// ---------------------------------------------------------------- 드롭다운
// anchor 아래에 패널을 붙인다(실사이트 선택 패널: top = 100% + 4px, 폭 = 입력칸). 열림 200ms · 닫힘 190ms(GNB 실측).
// 닫힘: 항목 선택 · 바깥 누름 · Esc(트리거로 포커스 복귀) · Tab · 트리거 다시 누름. 키보드: ↑↓ Home End 로 이동, Enter/Space 선택.
let OPEN = null;
UI.dropdown = function (anchor, o = {}) {
  if (OPEN && OPEN.anchor === anchor) { UI.closeDropdown(); return null }
  UI.closeDropdown(true);
  closeGnb();
  const host = o.host || anchor.parentElement;
  if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
  const panel = document.createElement('div');
  panel.className = 'ui-dd' + (o.cls ? ' ' + o.cls : '');
  panel.setAttribute('role', o.role || 'listbox');
  panel.innerHTML = o.html || '';
  host.appendChild(panel);
  place(anchor, host, panel, o);
  anchor.setAttribute('aria-expanded', 'true'); anchor.classList.add('ui-dd-open');
  OPEN = { anchor, panel, o, hl: -1 };
  const opts = () => $$('[data-ui-opt]', panel).filter(x => x.offsetParent !== null && !x.hasAttribute('data-ui-head'));
  OPEN.opts = opts;
  const cur = opts().findIndex(x => x.classList.contains('on') || x.getAttribute('aria-selected') === 'true');
  if (cur >= 0) { OPEN.hl = cur; mark() }
  panel.addEventListener('click', e => {
    const it = e.target.closest('[data-ui-opt]'); if (!it || !panel.contains(it) || it.hasAttribute('data-ui-head')) return;
    e.stopPropagation();
    pick(it);
  });
  panel.addEventListener('mousemove', e => { const it = e.target.closest('[data-ui-opt]'); if (it) { const i = opts().indexOf(it); if (i >= 0 && i !== OPEN.hl) { OPEN.hl = i; mark(true) } } });
  anim(panel, true);
  if (o.onOpen) o.onOpen(panel);
  return panel;
};
function place(anchor, host, panel, o) {
  const ar = anchor.getBoundingClientRect(), hr = host.getBoundingClientRect();
  panel.style.top = (ar.bottom - hr.top + host.scrollTop + 4) + 'px';
  panel.style.left = (ar.left - hr.left) + 'px';
  panel.style.minWidth = o.width === 'auto' ? '' : ar.width + 'px';
  if (o.width === 'anchor') panel.style.width = ar.width + 'px';
}
function anim(panel, open) {
  const k = [{ opacity: 0, clipPath: 'inset(0 0 100% 0)' }, { opacity: 1, clipPath: 'inset(0 0 0 0)' }];
  if (panel._a) { try { panel._a.cancel() } catch (e) { } }
  if (UI.reduced()) return null;
  try { return (panel._a = panel.animate(open ? k : k.reverse(), { duration: open ? T.ddOpen : T.ddClose, easing: E.out })) } catch (e) { return null }
}
function mark(fromMouse) {
  if (!OPEN) return;
  const list = OPEN.opts();
  list.forEach((x, i) => x.classList.toggle('hl', i === OPEN.hl));
  const el = list[OPEN.hl];
  if (el && !fromMouse) el.scrollIntoView({ block: 'nearest' });
}
function pick(it) {
  const o = OPEN.o, v = it.dataset.uiOpt;
  if (o.keepOpen) { if (o.onPick) o.onPick(v, it); return }
  const a = OPEN.anchor;
  UI.closeDropdown();
  if (o.onPick) o.onPick(v, it);
  if (a.isConnected && o.focusBack !== false) try { a.focus({ preventScroll: true }) } catch (e) { }
}
UI.closeDropdown = function (now) {
  if (!OPEN) return;
  const { anchor, panel, o } = OPEN; OPEN = null;
  anchor.setAttribute('aria-expanded', 'false'); anchor.classList.remove('ui-dd-open');
  if (o.onClose) o.onClose();
  if (now || !panel.isConnected) return panel.remove();
  panel.style.pointerEvents = 'none';
  const a = anim(panel, false);
  if (a) a.onfinish = () => panel.remove(); else panel.remove();
};
UI.isOpen = a => !!(OPEN && (!a || OPEN.anchor === a));
UI.refreshDropdown = function (html) { if (!OPEN) return; const st = OPEN.panel.scrollTop; OPEN.panel.innerHTML = html; OPEN.panel.scrollTop = st; mark(true) };
// 바깥을 누르면 닫는다(누른 대상의 원래 동작은 그대로)
document.addEventListener('pointerdown', e => {
  if (!OPEN) return;
  if (OPEN.panel.contains(e.target) || OPEN.anchor.contains(e.target)) return;
  UI.closeDropdown();
}, true);
document.addEventListener('keydown', e => {
  if (!OPEN) {
    // 닫힌 트리거에서 ↓ · Enter · Space → 열기
    const t = e.target.closest && e.target.closest('[data-ui-trigger]');
    if (t && ['ArrowDown', 'Enter', ' '].includes(e.key)) { e.preventDefault(); t.click() }
    return;
  }
  const list = OPEN.opts(), n = list.length;
  if (e.key === 'Escape') { e.preventDefault(); e.stopImmediatePropagation(); const a = OPEN.anchor; UI.closeDropdown(); try { a.focus({ preventScroll: true }) } catch (x) { } return }
  if (e.key === 'Tab') { UI.closeDropdown(); return }
  if (e.target.matches && e.target.matches('input') && !['ArrowDown', 'ArrowUp', 'Enter'].includes(e.key)) return;
  if (!n) return;
  if (e.key === 'ArrowDown') { e.preventDefault(); OPEN.hl = (OPEN.hl + 1) % n; mark() }
  else if (e.key === 'ArrowUp') { e.preventDefault(); OPEN.hl = (OPEN.hl - 1 + n) % n; mark() }
  else if (e.key === 'Home') { e.preventDefault(); OPEN.hl = 0; mark() }
  else if (e.key === 'End') { e.preventDefault(); OPEN.hl = n - 1; mark() }
  else if (e.key === 'Enter' || (e.key === ' ' && !(e.target.matches && e.target.matches('input')))) { if (OPEN.hl >= 0) { e.preventDefault(); pick(list[OPEN.hl]) } }
}, true);
// 화면이 다시 그려져 트리거가 사라지면 패널도 정리
new MutationObserver(() => { if (OPEN && !OPEN.anchor.isConnected) UI.closeDropdown(true) }).observe(document.documentElement, { childList: true, subtree: true });
window.addEventListener('resize', () => UI.closeDropdown(true));

// 연동 모달 거래소 선택(<details data-link-picker>) — 열림 전환을 드롭다운과 같게, 다른 드롭다운은 닫는다
UI.animPanel = anim;
// 닫힘도 드롭다운과 같이 190ms — 요약줄 클릭 · 바깥 클릭 · Esc 모두 이 함수로 닫는다(50-link.js가 있으면 호출)
UI.closeDetails = function (d) {
  if (!d || !d.open || d._closing) return;
  const panel = d.querySelector(':scope > div'); const a = panel && anim(panel, false);
  if (!a) { d.open = false; return }
  d._closing = true; a.onfinish = () => { d._closing = false; d.open = false };
};
document.addEventListener('click', e => {
  const sm = e.target.closest && e.target.closest('details[data-link-picker][open] > summary');
  if (sm) { e.preventDefault(); UI.closeDetails(sm.parentElement) }
}, true);
document.addEventListener('toggle', e => {
  const d = e.target; if (!d.matches || !d.matches('details[data-link-picker]') || !d.open) return;
  UI.closeDropdown(true);
  const panel = d.querySelector(':scope > div'); if (panel) anim(panel, true);
}, true);

// GNB 드롭다운(열고 닫는 규칙은 site.js 「GNB 드롭다운」 블록) — 여기서는 전환만: 열림 200ms · 닫힘 190ms
function closeGnb() { $$('.gnb .nav .ni.open').forEach(n => n.classList.remove('open')) }
UI.closeGnb = closeGnb;
const gnbSeen = new WeakMap();
new MutationObserver(ms => ms.forEach(m => {
  const ni = m.target; if (!ni.classList || !ni.matches('.gnb .nav .ni')) return;
  const open = ni.classList.contains('open'), was = gnbSeen.get(ni) || false; if (open === was) return; gnbSeen.set(ni, open);
  const dd = ni.querySelector('.gnb-dd'); if (!dd) return;
  if (open) { UI.closeDropdown(); ni.classList.remove('closing'); anim(dd, true) }
  else { ni.classList.add('closing'); const a = anim(dd, false); const done = () => { ni.classList.remove('closing'); try { a && a.cancel() } catch (e) { } }; if (a) a.onfinish = done; else done() }
})).observe(document.documentElement, { attributes: true, attributeFilter: ['class'], subtree: true });

// ---------------------------------------------------------------- 슬라이더
// MUI Slider 기준: 레일 어디를 눌러도 그 값으로 150ms 이동 후 그대로 끌기, 끄는 동안 전환 없음, 손잡이 둘레 링 hover·포커스 8px / 누름 14px,
// ←→↑↓ 한 단계 · PageUp/PageDown 10단계 · Home/End. 손잡이 중심은 트랙 중심과 같은 높이(마크업 기준 정렬).
// o: { value, min, max, step, toPct(v)->0..1, fromPct(p)->v, inset(px: 손잡이 반폭만큼 트랙 안쪽에서 시작), thumbLeft(p)->css, fillWidth(p)->css,
//      halo:{x,y,size}(손잡이 상자 안 원 중심), label, onInput(v), onChange(v) }
UI.slider = function (root, o) {
  if (root._ui) root._ui.destroy();
  const thumb = root.querySelector('[data-sl-thumb]'), fill = root.querySelector('[data-sl-fill]');
  const st = { v: o.value };
  const clamp = v => Math.max(o.min, Math.min(o.max, v));
  const snap = v => clamp(Math.round(v / o.step) * o.step);
  const halo = document.createElement('span'); halo.className = 'ui-sl-halo'; halo.setAttribute('aria-hidden', 'true');
  const hs = (o.halo && o.halo.size) || 20;
  halo.style.width = halo.style.height = hs + 'px';
  root.appendChild(halo);
  root.classList.add('ui-sl');
  root.tabIndex = 0; root.setAttribute('role', 'slider');
  if (o.label) root.setAttribute('aria-label', o.label);
  root.setAttribute('aria-valuemin', o.min); root.setAttribute('aria-valuemax', o.max);
  function paint() {
    const p = Math.max(0, Math.min(1, o.toPct(st.v)));
    thumb.style.left = o.thumbLeft(p);
    if (fill) fill.style.width = o.fillWidth(p);
    // 링은 손잡이 안 원의 중심에 맞춘다
    const hx = (o.halo && o.halo.x != null ? o.halo.x : thumb.offsetWidth / 2) - hs / 2;
    const hy = thumb.offsetTop + (o.halo && o.halo.y != null ? o.halo.y : thumb.offsetHeight / 2) - hs / 2;
    halo.style.left = `calc(${o.thumbLeft(p)} + ${hx}px)`; halo.style.top = hy + 'px';
    root.setAttribute('aria-valuenow', st.v);
    if (o.valueText) root.setAttribute('aria-valuetext', o.valueText(st.v));
  }
  function setV(v, src) {
    v = snap(v); if (v === st.v) return paint();
    st.v = v; paint(); if (o.onInput) o.onInput(v, src);
  }
  function pctAt(x) {
    const r = root.getBoundingClientRect(), i = o.inset || 0;
    return Math.max(0, Math.min(1, (x - r.left - i) / (r.width - 2 * i)));
  }
  let drag = null;
  const down = e => {
    if (e.button != null && e.button !== 0) return;
    e.preventDefault();
    try { root.focus({ preventScroll: true }) } catch (x) { }
    root.setPointerCapture && root.setPointerCapture(e.pointerId);
    const onThumb = thumb.contains(e.target) || halo.contains(e.target);
    root.classList.add('active');
    if (!onThumb) { root.classList.add('jump'); setV(o.fromPct(pctAt(e.clientX)), 'jump') }
    drag = { id: e.pointerId, moved: false };
    root.classList.remove('kbd');
  };
  const move = e => {
    if (!drag) return;
    if (!drag.moved) { drag.moved = true; root.classList.remove('jump'); root.classList.add('drag') }
    setV(o.fromPct(pctAt(e.clientX)), 'drag');
  };
  const up = () => {
    if (!drag) return; drag = null;
    root.classList.remove('active', 'drag');
    setTimeout(() => root.classList.remove('jump'), T.slide);
    if (o.onChange) o.onChange(st.v);
  };
  const key = e => {
    const big = o.step * 10;
    const d = { ArrowRight: o.step, ArrowUp: o.step, ArrowLeft: -o.step, ArrowDown: -o.step, PageUp: big, PageDown: -big }[e.key];
    if (d == null && e.key !== 'Home' && e.key !== 'End') return;
    e.preventDefault(); root.classList.add('kbd');
    const v = e.key === 'Home' ? o.min : e.key === 'End' ? o.max : st.v + d;
    setV(v, 'key'); if (o.onChange) o.onChange(st.v);
  };
  const blur = () => root.classList.remove('kbd');
  root.addEventListener('pointerdown', down);
  root.addEventListener('pointermove', move);
  root.addEventListener('pointerup', up); root.addEventListener('pointercancel', up); root.addEventListener('lostpointercapture', up);
  root.addEventListener('keydown', key); root.addEventListener('blur', blur);
  paint();
  root._ui = {
    get value() { return st.v },
    set(v) { st.v = clamp(v); paint() },
    destroy() { root.removeEventListener('pointerdown', down); root.removeEventListener('pointermove', move); root.removeEventListener('pointerup', up); root.removeEventListener('pointercancel', up); root.removeEventListener('lostpointercapture', up); root.removeEventListener('keydown', key); root.removeEventListener('blur', blur); halo.remove(); root._ui = null }
  };
  return root._ui;
};

// ---------------------------------------------------------------- 펼침(아코디언 · 행 추가/삭제)
// 높이 전환 300ms ease-in-out(실사이트 FAQ). open=true면 display를 살리고 0→높이, false면 높이→0 후 숨김.
UI.collapse = function (el, open, o = {}) {
  if (el._ca) { el._ca.cancel(); el._ca = null }
  const cs = el.style;
  if (open) { cs.display = o.display || ''; }
  if (UI.reduced()) { cs.display = open ? (o.display || '') : 'none'; return }
  const h = el.scrollHeight;
  const from = open ? 0 : h, to = open ? h : 0;
  cs.overflow = 'hidden';
  let a;
  try { a = el.animate([{ height: from + 'px', opacity: open ? 0 : 1 }, { height: to + 'px', opacity: open ? 1 : 0 }], { duration: T.collapse, easing: E.io }) } catch (e) { a = null }
  const end = () => { cs.overflow = ''; el._ca = null; if (!open) cs.display = 'none' };
  if (!a) return end();
  el._ca = a; a.onfinish = end;
};
// 블록 높이가 바뀌는 다시 그리기(예: 단계 표 2행↔3행)를 300ms로 잇는다. render()가 끝난 뒤의 새 요소를 넘겨준다.
UI.heightFx = function (getEl, render) {
  const old = getEl(); const h0 = old ? old.getBoundingClientRect().height : null;
  render();
  const el = getEl(); if (!el || h0 == null || UI.reduced()) return;
  const h1 = el.getBoundingClientRect().height; if (Math.abs(h1 - h0) < 1) return;
  el.style.overflow = 'hidden';
  try { const a = el.animate([{ height: h0 + 'px' }, { height: h1 + 'px' }], { duration: T.collapse, easing: E.io }); a.onfinish = () => { el.style.overflow = '' } } catch (e) { el.style.overflow = '' }
};

// ---------------------------------------------------------------- 세그먼트 토글 전환(Taker/Maker 등)
// 다시 그린 뒤 이전 선택 칸의 인라인 스타일에서 새 스타일로 .2s 전환(실사이트 ToggleBtn `all .2s`)
UI.toggleFx = function (items, prevIndex) {
  if (prevIndex == null || prevIndex < 0 || UI.reduced()) return;
  const now = items.map(x => x.getAttribute('style') || '');
  const cur = items.findIndex((x, i) => i !== prevIndex && /background:#fff/.test(now[i]));
  if (cur < 0 || !items[prevIndex]) return;
  const a = now[prevIndex], b = now[cur];
  items[prevIndex].setAttribute('style', b); items[cur].setAttribute('style', a);
  items.forEach(x => { x.style.transition = 'none' });
  void items[0].offsetWidth;
  items[prevIndex].setAttribute('style', a + ';transition:background var(--m-base),color var(--m-base),box-shadow var(--m-base)');
  items[cur].setAttribute('style', b + ';transition:background var(--m-base),color var(--m-base),box-shadow var(--m-base)');
};

// 툴팁 · 버튼 물결은 공통 모듈 _프로토타입_전체/src/03-motion.js(화면 목록판과 같은 코드)
})();
