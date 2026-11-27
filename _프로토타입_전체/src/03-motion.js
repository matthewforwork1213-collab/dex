// 03-motion.js — 공통 모션(화면 목록판 full.html · 실제 동작판 dex/app.html 공용)
// 값은 CSS 토큰(00-core.css :root --m-* · --e-*), 명세 05.리포트/모션명세_DEX.md. 실사이트 측정값을 쓴다.
// 화면이 다시 그려질 때마다(목록판 상태 전환 · 동작판 페이지 이동) 새 요소에 자동으로 붙는다(MutationObserver).
(function () {
if (window.MOTION) return;
const css = () => getComputedStyle(document.documentElement);
const ms = k => { const v = css().getPropertyValue(k).trim(); return v.endsWith('ms') ? parseFloat(v) : v.endsWith('s') ? parseFloat(v) * 1000 : 0 };
const tok = k => css().getPropertyValue(k).trim();
const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const reduced = () => !!(RM && RM.matches);
const M = window.MOTION = { reduced, ms, tok };

// ---- 1) 버튼 누름 물결 — MUI TouchRipple(실사이트 측정 550ms · cubic-bezier(.4,0,.2,1)), 크기 변화 없음
document.addEventListener('pointerdown', e => {
  const b = e.target.closest && e.target.closest('.btn,.icon-btn,[data-ripple]');
  if (!b || b.disabled || b.classList.contains('disabled') || e.button > 0 || reduced()) return;
  if (getComputedStyle(b).position === 'static') b.style.position = 'relative';
  let wrap = b.querySelector(':scope > .ui-ripples');
  if (!wrap) { wrap = document.createElement('span'); wrap.className = 'ui-ripples'; b.appendChild(wrap) }
  const r = b.getBoundingClientRect(), center = b.classList.contains('icon-btn');
  const x = center ? r.width / 2 : e.clientX - r.left, y = center ? r.height / 2 : e.clientY - r.top;
  const d = 2 * Math.max(Math.hypot(x, y), Math.hypot(r.width - x, y), Math.hypot(x, r.height - y), Math.hypot(r.width - x, r.height - y));
  const s = document.createElement('span'); s.className = 'ui-ripple';
  s.style.cssText = `width:${d}px;height:${d}px;left:${x - d / 2}px;top:${y - d / 2}px`;
  wrap.appendChild(s);
  const dur = ms('--m-ripple') || 550, ease = tok('--e-std') || 'ease';
  try { s.animate([{ transform: 'scale(0)', opacity: .1 }, { transform: 'scale(1)', opacity: .3 }], { duration: dur, easing: ease, fill: 'forwards' }) } catch (x) { }
  const out = () => { document.removeEventListener('pointerup', out, true); document.removeEventListener('pointercancel', out, true); try { const a = s.animate([{ opacity: .3 }, { opacity: 0 }], { duration: dur, easing: ease, fill: 'forwards' }); a.onfinish = () => s.remove() } catch (x) { s.remove() } };
  document.addEventListener('pointerup', out, true); document.addEventListener('pointercancel', out, true);
}, true);

// ---- 2) 툴팁([data-tip]) — MUI Tooltip(실사이트: 불투명도 .2s · 크기 .133s, 회색 rgba(97,97,97,.92) · 11px · 최대 300px)
let tipEl = null, tipFor = null, tipT = 0;
function tipHide() { clearTimeout(tipT); tipFor = null; if (!tipEl) return; const el = tipEl; tipEl = null; el.style.opacity = 0; el.style.transform = 'scale(.75)'; setTimeout(() => el.remove(), 200) }
function tipShow(t) {
  if (tipFor === t) return; tipHide(); tipFor = t;
  tipT = setTimeout(() => {
    if (tipFor !== t || !t.isConnected) return;
    const el = document.createElement('div'); el.className = 'ui-tip'; el.setAttribute('role', 'tooltip'); el.textContent = t.dataset.tip;
    document.body.appendChild(el);
    const r = t.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight;
    let left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left + r.width / 2 - w / 2));
    let top = r.bottom + 14; if (top + h > window.innerHeight - 8) top = r.top - h - 14;
    el.style.left = left + 'px'; el.style.top = top + 'px';
    el.style.transformOrigin = `${r.left + r.width / 2 - left}px ${top > r.top ? 'top' : 'bottom'}`;
    void el.offsetWidth; el.style.opacity = 1; el.style.transform = 'none';
    tipEl = el;
  }, 100);
}
document.addEventListener('mouseover', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) tipShow(t); else if (tipFor) tipHide() });
document.addEventListener('focusin', e => { const t = e.target.closest && e.target.closest('[data-tip]'); if (t) tipShow(t) });
document.addEventListener('focusout', e => { if (tipFor && e.target === tipFor) tipHide() });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && tipFor) tipHide() });
window.addEventListener('scroll', () => { if (tipFor) tipHide() }, { passive: true });

// ---- 3) 스크롤 진입 페이드업([data-m-reveal]) — 실사이트 거래소 상세 섹션: 불투명도 0→1 + 아래 48px → 제자리, 약 0.5s ease-out
//      처음 화면에 이미 보이는 섹션은 그대로 둔다(실사이트와 같음)
const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { io.unobserve(x.target); x.target.classList.add('m-in') } }), { threshold: .12 }) : null;
function reveal(root) {
  root.querySelectorAll('[data-m-reveal]:not([data-m-done])').forEach(el => {
    el.setAttribute('data-m-done', '');
    if (reduced() || !io) return;
    const r = el.getBoundingClientRect(); if (r.top < window.innerHeight) return;
    el.classList.add('m-rv'); io.observe(el);
  });
}

// ---- 4) 숫자 굴림(큰 % 숫자) — 실사이트 홈 RollingNumber: 자리마다 0~9 띠가 transform 1.1s cubic-bezier(.22,1,.36,1)로 굴러 멈춤, 자리 간 80ms 지연
//      대상: 글자 크기 28px 이상인 「숫자%」 단독 요소(허브 `UP TO n%` · DEX 개요 요율 · DEX 상세 `Trading fees cashback up to n%`)
const rio = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { rio.unobserve(x.target); roll(x.target) } }), { threshold: .4 }) : null;
function rollPrep(root) {
  if (reduced() || !rio) return;
  root.querySelectorAll('span,div,b,strong').forEach(el => {
    if (el.children.length || el.hasAttribute('data-m-roll')) return;
    const t = el.textContent.trim(); if (!/^\d{1,3}%$/.test(t)) return;
    if (parseFloat(getComputedStyle(el).fontSize) < 28) return;
    el.setAttribute('data-m-roll', t); rio.observe(el);
  });
}
function roll(el) {
  const t = el.getAttribute('data-m-roll'), fs = getComputedStyle(el).fontSize, lh = getComputedStyle(el).lineHeight;
  const H = lh === 'normal' ? parseFloat(fs) * 1.2 : parseFloat(lh);
  const dur = ms('--m-roll') || 1100, ease = tok('--e-roll') || 'ease-out', step = ms('--m-roll-stagger') || 80;
  el.textContent = ''; el.classList.add('m-roll'); el.style.height = H + 'px';
  [...t].forEach((ch, i) => {
    if (!/\d/.test(ch)) { const s = document.createElement('span'); s.textContent = ch; el.appendChild(s); return }
    const col = document.createElement('span'); col.className = 'm-roll-col';
    const track = document.createElement('span'); track.className = 'm-roll-track';
    track.innerHTML = Array.from({ length: 20 }, (_, k) => `<span style="height:${H}px;line-height:${H}px">${k % 10}</span>`).join('');
    col.appendChild(track); el.appendChild(col);
    const target = 10 + +ch;   // 한 바퀴 넘겨 멈춤
    track.style.transform = 'translateY(0)';
    requestAnimationFrame(() => requestAnimationFrame(() => { track.style.transition = `transform ${dur}ms ${ease} ${i * step}ms`; track.style.transform = `translateY(${-target * H}px)` }));
  });
  el.setAttribute('aria-label', t);
  setTimeout(() => { el.textContent = t; el.classList.remove('m-roll'); el.style.height = '' }, dur + t.length * step + 50);
}

// ---- 5) 같은 화면 안 섹션 이동([data-scroll-to="id"]) — 정책 B-6: 부드러운 스크롤 + 고정 헤더 높이 보정 + 섹션 제목으로 포커스
function scroller(el) { for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) { const o = getComputedStyle(p).overflowY; if (/(auto|scroll)/.test(o) && p.scrollHeight > p.clientHeight) return p } return null }
function headH(el) { let h = 0; document.querySelectorAll('.gnb, header, [data-mo-top], .mo-top').forEach(x => { const c = getComputedStyle(x); if (/(sticky|fixed)/.test(c.position) && x.getBoundingClientRect().height < 200) h = Math.max(h, x.getBoundingClientRect().height) }); return h }
window.addEventListener('click', e => {
  const b = e.target.closest && e.target.closest('[data-scroll-to]'); if (!b) return;
  const t = document.getElementById(b.getAttribute('data-scroll-to')); if (!t) return;
  e.preventDefault(); e.stopImmediatePropagation();
  const sc = scroller(t), off = headH(t) + 16, beh = reduced() ? 'auto' : 'smooth';
  if (sc) sc.scrollTo({ top: t.getBoundingClientRect().top - sc.getBoundingClientRect().top + sc.scrollTop - off, behavior: beh });
  else window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - off, behavior: beh });
  try { t.focus({ preventScroll: true }) } catch (x) { }
}, true);

// ---- 붙이기: 처음 + 화면이 바뀔 때마다
function scan(root) { reveal(root); rollPrep(root) }
let pend = false;
const run = () => { pend = false; scan(document) };
// 화면 밖 렌더 점검(JSDOM — IntersectionObserver · requestAnimationFrame 없음)에서는 붙일 것이 없으니 감시도 하지 않는다
if ('IntersectionObserver' in window && window.requestAnimationFrame) {
  new MutationObserver(() => { if (!pend) { pend = true; requestAnimationFrame(run) } }).observe(document.documentElement, { childList: true, subtree: true });
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', run); else requestAnimationFrame(run);
}
M.scan = scan;
})();

// TP 소개 고정 CTA `Check My TP` — 맨 위에서는 없고 스크롤하면 나타남(dev 측정)
if (typeof window !== 'undefined' && window.addEventListener) window.addEventListener('scroll', () => { const c = document.querySelector('[data-tp-cta]'); if (c) c.classList.toggle('on', window.scrollY > 120) }, { passive: true });
