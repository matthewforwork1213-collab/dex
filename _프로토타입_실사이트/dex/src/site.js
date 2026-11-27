// ===== site.js — 사이트 모드 런타임 =====
// 전체 프로토타입(_프로토타입_전체/src)의 화면 렌더 함수를 그대로 쓰고, 도구 UI(사이드바·상태 선택) 대신
// 실제 사이트처럼 경로(#/hub · #/dex · #/dex/{slug})로 열고 입력·연동 흐름에 실제 동작을 붙인다.
(function () {
'use strict';
const Q = new URLSearchParams(location.search);
const EMB = window.parent !== window;          // 실사이트 셸(iframe) 안에서 열렸나
const MODAL = Q.get('modal') === '1';           // 셸이 연 연동 모달 전용 모드(배경 투명)
const SITE = { auth: Q.get('auth') === 'member' ? 'member' : 'guest' };
const ORIGIN = 'https://tethermax.io';
const BP = 1024;                                 // 실사이트 분기점
let ST = DEXSTATE.load();
const persist = () => DEXSTATE.save(ST);
window.SITEL = { cex: false };

S.lang = 'en'; S.design = true;
document.body.classList.add('design', 'site');
if (MODAL) { document.body.classList.add('site-modal'); document.documentElement.classList.add('site-modal') }
const vpNow = () => (window.innerWidth <= BP ? 'mo' : 'pc');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const post = m => { m.pt = 1; if (EMB) parent.postMessage(m, '*'); };
const rnd = (a, b) => a + Math.random() * (b - a);
const fl2 = n => Math.floor((n + 1e-9) * 100) / 100;
const isMember = () => SITE.auth === 'member';
const app = $('#app'), layer = $('#layer');

// 셸 화면(C.overlay)은 사이트 모드에서 배경 화면을 그리지 않는다 — 레이어가 실제 현재 화면 위에 뜬다
C.overlay = (bg, inner) => inner;

// ---------------- 토스트 (MUI Snackbar 모양 · 실사이트 전환 .3s) ----------------
function toast(msg, o = {}) {
  const el = document.createElement('div');
  el.className = 'site-toast' + (o.blue ? ' blue' : '') + (o.err ? ' err' : '');
  el.setAttribute('role', o.err ? 'alert' : 'status');
  el.innerHTML = (o.blue ? `<img src="${A('home-ic-toast-check.svg')}" alt="">` : o.err ? '<span class="site-toast-x"><i>×</i></span>' : '') + `<span>${msg}</span>`;
  document.body.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  setTimeout(() => { el.classList.remove('in'); setTimeout(() => el.remove(), 320) }, o.ms || 2400);
}
window.siteToast = toast;
// 공통 오류 토스트(Figma 29449:145568) — 429 · 중복 요청 · 잘못된 값
const errToast = () => toast('Something went wrong. Please try again.', { err: 1 });
window.siteErr = errToast;

// ---------------- 실사이트 페이지로 이동 ----------------
function navReal(path) {
  if (EMB) return post({ nav: ORIGIN + path });
  const key = path.replace(/^\//, '').replace(/\//g, '__') || 'en';
  location.href = '../index.html#key=' + encodeURIComponent(key) + '&auth=' + SITE.auth;
}
const REAL = {
  'home.main': '/en', 'landing.main': '/en', 'auth.login': '/en/login', 'auth.signup': '/en/signup',
  'events.list': '/en/events', 'benefits.list': '/en/benefits', 'quiz.list': '/en/beginner-guide', 'quiz.basics': '/en/beginner-guide/cashback-basics',
  'about.intro': '/en/service-intro-new', 'calc.p1': '/en/payback', 'notice.list': '/en/notice', 'terms.use': '/en/terms/use', 'terms.privacy': '/en/terms/privacy',
  'summary.main': '/en/rewardHistory', 'guest.search': '/en/search', 'coupon.box': '/en/coupon',
  'brokers.list': '/en/brokers'   // 허브 라우트 Brokers 행 → Brokers 페이지(정책 B-5 RT-2)
};
const CEX_SLUG = { bitget: 'bitget', okx: 'okx', bybit: 'bybit', binance: 'binance', mexc: 'mexc', gate: 'gate', deepcoin: 'deepcoin', bingx: 'bingx', lbank: 'lbank', zoomex: 'zoomex', bitunix: 'bitunix', blockfin: 'blofin', biofin: 'blofin', kucoin: 'kucoin', bitmex: 'bitmex', bvox: 'bvox' };
const NEXT = { 'own.verify': '소유권 인증', 'home.wallet': '지갑 상세', 'home.timeline': '캐시백 타임라인', 'ranking.main': '캐시백 랭킹', 'partner.hub': '파트너 허브', 'maxboard.main': '맥스보드' };

// ---------------- 경로 ----------------
const SLUGS = ['lighter', 'apex', 'edgex', 'aster'];
function parseHash() {
  const h = location.hash.replace(/^#/, '') || '/hub';
  const [p, qs] = h.split('?');
  return { path: p || '/hub', q: Object.fromEntries(new URLSearchParams(qs || '')) };
}
const hashOf = r => { const qs = new URLSearchParams(r.q).toString(); return r.path + (qs ? '?' + qs : '') };
let route = parseHash();
function goRoute(path, q = {}, o = {}) {
  route = { path, q };
  const h = '#' + hashOf(route);
  if (location.hash !== h) history[o.replace ? 'replaceState' : 'pushState'](null, '', h);
  renderPage({ keepScroll: o.keepScroll });
  if (!o.keepScroll) window.scrollTo(0, 0);
  post({ dexRoute: hashOf(route) });
}
window.addEventListener('popstate', () => { route = parseHash(); renderPage(); post({ dexRoute: hashOf(route) }) });

// ---------------- GNB 드롭다운: 클릭으로 펼침·유지, 다시 클릭·바깥 클릭·Esc로 닫힘(실사이트 PCHeader와 같은 동작) ----------------
function gnbClose(except) { document.querySelectorAll('.gnb .nav .ni.open').forEach(n => { if (n !== except) n.classList.remove('open') }) }
window.addEventListener('click', e => {
  const top = e.target.closest && e.target.closest('.gnb .nav .ni > a');
  if (top) { e.preventDefault(); e.stopImmediatePropagation(); const ni = top.parentNode; gnbClose(ni); ni.classList.toggle('open'); return }
  if (e.target.closest && e.target.closest('.gnb-dd a')) { gnbClose(); return }
  if (!(e.target.closest && e.target.closest('.gnb-dd'))) gnbClose();
}, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape') gnbClose() });

// ---------------- data-go → 사이트 동작 ----------------
let goEl = null, pendingVenue = null;
document.addEventListener('click', e => {
  goEl = e.target.closest && e.target.closest('[data-go]');
  const v = e.target.closest && e.target.closest('[data-link-venue]');
  pendingVenue = v ? { n: v.dataset.linkVenue, t: v.dataset.linkType } : null;
}, true);
function siteGo(key) {
  if (!key) return;
  const el = goEl; goEl = null;
  const [id, st] = String(key).split(':');
  const inLayer = el && layer.contains(el);
  const isIcon = el && el.classList.contains('icon-btn');
  if (window.SITE2 && SITE2.go(id, st, el, inLayer)) return;
  if (id.startsWith('link.')) return linkGo(id, st, el);
  if (inLayer && L.open) {
    // 레이어 안: 아이콘 버튼(닫기·뒤로)은 레이어만 닫는다. 그 밖의 버튼은 닫고 이동
    if (isIcon && !/^support|^own/.test(id)) return closeLayer();
    if (id === 'home.main') return backHome();
  }
  if (id === 'hub.main') {
    const tab = st === 'cex' ? 'CEX' : st === 'brokers' ? 'Brokers' : 'DEX';
    closeLayer(true);
    return goRoute('/hub', tab === 'DEX' ? {} : { tab });
  }
  if (id === 'cex.list') { closeLayer(true); return goRoute('/hub', { tab: 'CEX' }) }
  if (id === 'dex.overview') { closeLayer(true); return goRoute('/dex') }
  if (id === 'dex.detail') {
    if (SLUGS.includes(st)) { closeLayer(true); return goRoute('/dex/' + st) }
    if (st === 'drawer') return toast('How this works — 다음 회차(DEX 상세 동작)');
    return goRoute('/dex/edgex');
  }
  if (id.startsWith('cexd')) { const s = CEX_SLUG[st] || st; return navReal('/en/exchangeDetail/' + s + '-referral') }
  if (id === 'tp.main') return navReal(isMember() ? '/en/tethermax-point' : '/en/tethermax-point-introduction');
  if (id === 'invite.main') return navReal(isMember() ? '/en/mypage/invitefriend/invitefriend' : '/en/login');
  if (id === 'support.main') return toast('Live Chat (프로토타입)');
  if (id === 'my.main') return toast('마이 페이지는 실사이트 상단 프로필 메뉴 (프로토타입)');
  if (id === 'cmn.header') return toast('알림 (프로토타입)');
  if (id === 'partner.apply') return toast('「Affiliate Partner Inquiry」 처리됨 (프로토타입)');
  if (id === 'cmn.drawer') return openDrawer();
  if (REAL[id]) { closeLayer(true); return navReal(REAL[id]) }
  if (NEXT[id]) return toast(NEXT[id] + ' — 다음 회차에 연결');
  toast('준비 중인 화면: ' + id);
}
window.go = siteGo;
window.render = () => { renderPage({ keepScroll: true }); if (L.open) renderLayer() };

// ---------------- 페이지 렌더 ----------------
let lastVp = vpNow();
function renderPage(o = {}) {
  if (MODAL) return;
  S.vp = vpNow(); lastVp = S.vp;
  document.body.classList.toggle('vp-mo', S.vp === 'mo');
  document.body.classList.toggle('vp-pc', S.vp === 'pc');
  const y = window.scrollY;
  const p = route.path;
  let html;
  if (p === '/hub') html = hubHTML();
  else if (p === '/dex') { S.auth = isMember() ? 's3' : 'guest'; html = window.SITE2 && SITE2.dexLanding ? SITE2.dexLanding() : renderInner('dex.overview:' + (isMember() ? 'member' : 'normal')) }
  else if (/^\/dex\/(lighter|apex|edgex|aster)$/.test(p)) html = dexDetailHTML(p.split('/')[2]);
  else if (window.SITE2 && (html = SITE2.render(p, route.q)) != null) { }
  else { route = { path: '/hub', q: {} }; history.replaceState(null, '', '#/hub'); html = hubHTML() }
  app.innerHTML = html;
  app.classList.remove('enter'); void app.offsetWidth; if (!o.keepScroll) app.classList.add('enter');
  if (p === '/hub') hubEnhance();
  pageEnhance();
  if (window.SITE2) SITE2.enhance(p, route.q, o);
  if (o.keepScroll) window.scrollTo(0, y);
  if (window.SITE2 && SITE2.title(p)) document.title = SITE2.title(p); else document.title = p === '/hub' ? 'Cashback Hub | TetherMax' : p === '/dex' ? 'DEX | TetherMax' : (p.split('/')[2] || '') + ' | TetherMax';
}
function dexDetailHTML(slug) {
  if (window.SITE2 && SITE2.dexDetail) return SITE2.dexDetail(slug);
  const mine = ST.accounts.filter(a => a.type === 'DEX' && a.ex.toLowerCase() === slug);
  S.auth = !isMember() ? 'guest' : mine.some(a => a.st !== 'pend') ? 's4' : 's3';
  return renderInner('dex.detail:' + slug);
}
// 페이지 공통: 처리 안 된 버튼은 실사이트 런타임과 같은 「정상 처리」 토스트
function pageEnhance() {
  $$('input[readonly]', app).forEach(i => i.tabIndex = -1);
}
document.addEventListener('click', e => {
  const t = e.target;
  if (t.closest('[data-go],[data-hub-tab],[data-hub-view],[data-hub-partner],[data-hub-sort],[data-hub-clear],[data-link-venue],[data-link-filter],summary,.site-pop,input,[data-lang],[data-site]')) return;
  const copy = t.closest('button,span,a');
  if (copy && copy.querySelector && copy.querySelector('img[src*="copy"]')) { e.preventDefault(); return copyText(copy.textContent.trim().toLowerCase()) }
  const b = t.closest('button,a');
  if (!b || b.disabled) return;
  if (layer.contains(b)) return;
  const l = (b.innerText || '').trim().replace(/\s+/g, ' ').slice(0, 40);
  if (l) { e.preventDefault(); toast('「' + l + '」 처리됨 (프로토타입)') }
});
function copyText(t) {
  const done = () => toast('Copied.');
  try { navigator.clipboard.writeText(t).then(done, fallback) } catch (e) { fallback() }
  function fallback() { const ta = document.createElement('textarea'); ta.value = t; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy') } catch (e) { } ta.remove(); done() }
}
window.siteCopy = copyText;

// =====================================================================
// 캐시백 허브 — 계산기 · 라우트 · 비교표 · 잔액 패널 (FU-045 ~ FU-048)
// =====================================================================
const H = { route: 'DEX', pid: { DEX: 'lighter', CEX: 'bybit', Brokers: 'rs' }, vol: { DEX: 100000, CEX: 100000, Brokers: 100000 }, view: 'table', q: '', sort: null, loading: false };
const RANGE = { DEX: [1000, 250000], CEX: [10000, 500000], Brokers: [10000, 20000000] };
const STEP = { DEX: 1000, CEX: 5000, Brokers: 10000 };
window.SITEH = {
  partner(r, list) { return list.find(p => p.id === H.pid[r]) || list[0] },
  sliderPct(r) { const [a, b] = RANGE[r]; return Math.max(0, Math.min(1, (H.vol[r] - a) / (b - a))) },
  panel: null
};
function ledgerAccounts() {
  if (!isMember() || H.route !== 'DEX') return [];
  return ST.accounts.filter(a => a.type === 'DEX' && a.ex.toLowerCase() === H.pid.DEX && a.st === 'ok' && (a.a || a.b));
}
function rightCard(o = {}) {
  const r = H.route; SITEH.panel = null;
  const list = ledgerAccounts();
  if (list.length) {
    const a = list[0], extra = list.length > 1 ? '+' + (list.length - 1) : '';
    SITEH.panel = { pid: H.pid.DEX, v: [a.a || 0, a.b || 0], extra };
    if (o.loading) return HUBX.panelCard('dexLoading');
    const w = fl2(a.a + Math.min(a.a, a.b));
    return HUBX.panelCard(w < 10 ? 'dexBelowMin' : 'site');
  }
  return HUBX.calcCard(r, { member: isMember() });
}
function hubHTML() {
  H.route = ['CEX', 'DEX', 'Brokers'].includes(route.q.tab) ? route.q.tab : 'DEX';
  H.view = route.q.view === 'cards' ? 'card' : 'table';
  HUBX.setVol(H.vol[H.route]);
  const guest = !isMember();
  const panelWait = ledgerAccounts().length > 0;
  const right = rightCard({ loading: panelWait });
  const pad = S.vp === 'mo' ? '40px 16px 64px' : '96px 120px 120px';
  const body = `${HUBX.hero(`<div data-hub-right>${right}</div>`, H.route)}<section data-hub-routes style="padding:${pad}">${HUBX.routes()}${HUBX.compare(H.route, H.view === 'card' ? 'cards' : 'normal')}</section>${guest ? HUBX.why() : ''}`;
  if (panelWait) setTimeout(() => { const box = $('[data-hub-right]'); if (box) { box.innerHTML = rightCard(); bindRight(); fadeIn(box) } }, rnd(300, 800));
  return HUBX.shell(guest, body);
}
function fadeIn(el) { el.classList.remove('site-fade'); void el.offsetWidth; el.classList.add('site-fade') }
function hubEnhance() {
  if (route.path !== '/hub') return;
  bindRight();
  const s = $('[data-hub-search]');
  if (s) { s.value = H.q; s.addEventListener('input', () => { H.q = s.value; applyFilter() }); s.addEventListener('focus', () => s.closest('[data-hub-sbox]').classList.add('on')); s.addEventListener('blur', () => s.closest('[data-hub-sbox]').classList.remove('on')) }
  applyFilter(); applySort();
  // 「UP TO n%」 큰 숫자는 공통 모듈(03-motion.js) 숫자 굴림 — 실사이트 RollingNumber
}
function bindRight() {
  const box = $('[data-hub-right]'); if (!box) return;
  const vol = $('[data-hub-vol]', box);
  if (vol && !vol.readOnly) {
    vol.addEventListener('focus', () => setTimeout(() => vol.select(), 0));
    vol.addEventListener('input', () => {
      const n = parseInt(vol.value.replace(/[^\d]/g, ''), 10) || 0;
      const pos = vol.selectionStart, before = vol.value.length;
      vol.value = '$' + n.toLocaleString('en-US');
      const d = vol.value.length - before; try { vol.setSelectionRange(pos + d, pos + d) } catch (e) { }
      H.vol[H.route] = n; updateCalc({ fromInput: true });
    });
    vol.addEventListener('blur', () => { const [a, b] = RANGE[H.route]; const n = Math.max(a, Math.min(b, H.vol[H.route])); if (n !== H.vol[H.route]) { H.vol[H.route] = n; updateCalc() } vol.value = '$' + n.toLocaleString('en-US') });
    vol.addEventListener('keydown', e => { if (e.key === 'Enter') vol.blur() });
  }
  // 거래량 슬라이더 — 공통 UI.slider(손잡이 SVG 30px 안의 원 중심 = (15,14))
  const sl = $('[data-hub-slider]', box);
  if (sl && sl.dataset.hubSlider !== 'Brokers') {
    const r = H.route, [a, b] = RANGE[r];
    UI.slider(sl, {
      value: H.vol[r], min: a, max: b, step: STEP[r], label: 'Monthly trading volume', inset: 15, halo: { x: 15, y: 14, size: 20 },
      toPct: v => (v - a) / (b - a), fromPct: p => a + (b - a) * p,
      thumbLeft: p => `calc((100% - 30px) * ${p})`, fillWidth: p => `calc((100% - 30px) * ${p} + 15px)`,
      valueText: v => '$' + v.toLocaleString('en-US'),
      onInput: (v, src) => { H.vol[r] = v; updateCalc({ count: src === 'drag' ? 0 : UI.T.fast }) }
    });
  }
  // 파트너 셀렉트 트리거 — 키보드로도 연다
  const ps = $('[data-hub-partner]', box);
  if (ps) { ps.tabIndex = 0; ps.setAttribute('role', 'button'); ps.setAttribute('aria-haspopup', 'listbox'); ps.setAttribute('aria-expanded', 'false'); ps.setAttribute('data-ui-trigger', '') }
  // 첫 표시 카운트업(계산 결과)
  const body = $('[data-calc-body]', box);
  if (body && !box.dataset.counted) { box.dataset.counted = 1; leafNums(body).forEach(el => countUp(el, 0, 700)) }
}
// 거래량이 바뀌면 영수증 본문·슬라이더·비교표 금액만 바꾼다(입력 포커스 유지). 실사이트 계산기처럼 금액은 즉시 바뀐다(카운트업 없음)
function updateCalc(o = {}) {
  const r = H.route; HUBX.setVol(H.vol[r]);
  const box = $('[data-hub-right]'); if (!box) return;
  const tmp = document.createElement('div'); tmp.innerHTML = rightCard();
  const nb = $('[data-calc-body]', tmp), ob = $('[data-calc-body]', box);
  if (nb && ob) {
    const olds = o.count ? leafNums(ob).map(e => numParts(e.textContent.trim()).n) : null;
    ob.innerHTML = nb.innerHTML;
    if (olds && !UI.reduced()) leafNums(ob).forEach((e, i) => { if (olds[i] != null) countUp(e, olds[i], o.count) });
  }
  const sl = $('[data-hub-slider]', box);
  if (sl && sl._ui && sl._ui.value !== H.vol[r]) sl._ui.set(H.vol[r]);
  const vol = $('[data-hub-vol]', box);
  if (vol && document.activeElement !== vol) vol.value = '$' + H.vol[r].toLocaleString('en-US');
  // 비교표 Est. monthly cashback · 부제
  const ct = document.createElement('div'); ct.innerHTML = HUBX.compare(r, H.view === 'card' ? 'cards' : 'normal');
  const sub = $('[data-compare-sub]'), nsub = $('[data-compare-sub]', ct); if (sub && nsub) sub.innerHTML = nsub.innerHTML;
  const cb = $('[data-compare-body]'), ncb = $('[data-compare-body]', ct);
  if (cb && ncb) { cb.innerHTML = ncb.innerHTML; applyFilter(); applySort() }
}
// 비교표 검색(선택된 탭 안에서만) · 0건 문구
function applyFilter() {
  const q = H.q.trim().toLowerCase(); let n = 0;
  $$('[data-hub-row]').forEach(r => { const ok = !q || r.dataset.hubRow.toLowerCase().includes(q); r.style.display = ok ? '' : 'none'; if (ok) n++ });
  const em = $('[data-hub-empty]'); if (em) em.style.display = n ? 'none' : 'block';
  const tb = $('[data-compare-body] table'); if (tb) tb.closest('[data-compare-body]>div').style.display = n ? '' : 'none';
  const cards = $('[data-compare-body]>.col'); if (cards) cards.style.display = n ? '' : 'none';
  const clr = $('[data-hub-clear]'); if (clr) clr.style.display = q ? 'inline-flex' : 'none';
}
function cellVal(td) { const t = td.textContent.trim(); if (t === '-' || !t) return -Infinity; const m = t.replace(/,/g, '').match(/-?\d+(\.\d+)?/); return m ? parseFloat(m[0]) : t.toLowerCase() }
function applySort() {
  const tb = $('[data-compare-body] tbody'); if (!tb || !H.sort) return;
  const rows = $$('tr', tb), i = H.sort.col, dir = H.sort.dir;
  rows.sort((a, b) => { const x = cellVal(a.children[i]), y = cellVal(b.children[i]); return (x > y ? 1 : x < y ? -1 : 0) * dir }).forEach(r => tb.appendChild(r));
  $$('[data-hub-sort]').forEach(th => th.classList.toggle('sorted', th.cellIndex === i));
}
document.addEventListener('click', e => {
  if (route.path !== '/hub' || MODAL) return;
  const t = e.target;
  const tab = t.closest('[data-hub-tab]');
  if (tab) { e.preventDefault(); return switchTab(tab.dataset.hubTab, tab) }
  const vw = t.closest('[data-hub-view]');
  if (vw) { e.preventDefault(); const q = Object.assign({}, route.q); if (vw.dataset.hubView === 'card') q.view = 'cards'; else delete q.view; route.q = q; history.replaceState(null, '', '#' + hashOf(route)); post({ dexRoute: hashOf(route) }); renderPage({ keepScroll: true }); return UI.swapFx($('[data-compare-body]')) }
  const th = t.closest('[data-hub-sort]');
  if (th) { const i = th.cellIndex; H.sort = H.sort && H.sort.col === i ? { col: i, dir: -H.sort.dir } : { col: i, dir: i === 1 ? 1 : -1 }; applySort(); return UI.swapFx($$('[data-compare-body] tbody tr').filter(r => r.style.display !== 'none'), { dur: UI.T.base, shift: 4, stagger: 20 }) }   // 정렬: 행이 짧게 떠오름(실사이트에 정렬 없음 → 토큰)
  const clr = t.closest('[data-hub-clear]');
  if (clr) { H.q = ''; const s = $('[data-hub-search]'); s.value = ''; s.focus(); return applyFilter() }
  const ps = t.closest('[data-hub-partner]');
  if (ps) { e.preventDefault(); return partnerMenu(ps) }
});
// 실사이트에 없는 새 탭이라 기준 = 자연스러운 전환(모션 명세 「허브 계산기 탭」). 값은 모두 실사이트 측정 토큰
// 히어로 배지 릴(REQ-291: 탭 선택 시 슬라이드, 움직임 줄이기면 슬라이드 없이 교체) — 배지마다 이전 자리 → 새 자리로 이동(FLIP), 한 칸 넘게 건너뛰는 배지는 페이드
function badgeRects() { return $$('#app img[src*="hub-badge-cex"], #app img[src*="hub-badge-dex"], #app img[src*="hub-badge-fx"]').map(im => { const r = im.getBoundingClientRect(); return { src: im.getAttribute('src'), x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, o: +getComputedStyle(im).opacity, im } }) }
function badgeSlide(before, dir) {
  if (UI.reduced()) return;
  const after = badgeRects(); const slot = after.length > 1 ? Math.abs(after[1].x - after[0].x) : 0;
  after.forEach(a => {
    const b = before.find(x => x.src === a.src);
    if (!b) { UI.swapFx(a.im, { dur: UI.T.slow, shift: 0 }); return }
    const dx = b.x - a.x, dy = b.y - a.y, k = b.w / a.w;
    if (S.vp === 'mo' || !slot || Math.abs(dx) > slot * 1.5) {   // 모바일(배지 1개) · 반대편으로 넘어가는 배지: 진행 방향에서 밀려 들어옴
      try { a.im.animate([{ opacity: 0, transform: 'translateX(' + (dir * 40) + 'px) scale(.9)' }, { opacity: a.o, transform: 'none' }], { duration: UI.T.slow, easing: UI.E.io }) } catch (e) { } return;
    }
    try { a.im.animate([{ transform: 'translate(' + dx + 'px,' + dy + 'px) scale(' + k + ')', opacity: b.o }, { transform: 'none', opacity: a.o }], { duration: UI.T.slow, easing: UI.E.io }) } catch (e) { }
  });
}
function switchTab(k, el) {
  if (k === H.route) return;
  const segEl = selectedSeg(), oldRect = segEl && segEl.getBoundingClientRect();
  const box0 = $('[data-hub-right]'), inner0 = segEl && segEl.parentElement.parentElement;
  const h0 = inner0 ? inner0.getBoundingClientRect().height : null;
  const olds = box0 ? leafNums(box0).map(e => ({ t: e.textContent.trim(), n: numParts(e.textContent.trim()).n })) : [];
  const badges0 = badgeRects(), ORD = ['CEX', 'DEX', 'Brokers'], dir = ORD.indexOf(k) > ORD.indexOf(H.route) ? 1 : -1;
  const q = Object.assign({}, route.q); if (k === 'DEX') delete q.tab; else q.tab = k;
  route.q = q; history.replaceState(null, '', '#' + hashOf(route)); post({ dexRoute: hashOf(route) });
  H.sort = null;
  renderPage({ keepScroll: true });
  if (oldRect) pillFlip(oldRect);
  if (UI.reduced()) return;
  badgeSlide(badges0, dir);
  // 카드: 탭 줄을 뺀 내용(파트너 · 거래량 · 범위 · 요금 줄)은 짧게 페이드/슬라이드(200ms, 30ms 간격)
  const seg1 = selectedSeg(), inner1 = seg1 && seg1.parentElement.parentElement;
  if (inner1) {
    const parts = Array.from(inner1.children).filter(c => !c.contains(seg1));
    UI.swapFx(parts, { dur: UI.T.base, shift: 6, stagger: 30 });
    // 카드 높이: 이전 높이 → 새 높이(300ms)
    const h1 = inner1.getBoundingClientRect().height;
    if (h0 != null && Math.abs(h1 - h0) > 1) { try { inner1.animate([{ height: h0 + 'px', overflow: 'hidden' }, { height: h1 + 'px', overflow: 'hidden' }], { duration: UI.T.std, easing: UI.E.io }) } catch (e) { } }
  }
  // 금액: 같은 자리(같은 이름의 줄)의 이전 값 → 새 값으로 숫자 보간(300ms)
  const box1 = $('[data-hub-right]');
  if (box1) leafNums(box1).forEach((e, i) => { const o = olds[i]; if (/^\$[\d.]+[KM]$/.test(e.textContent.trim())) return;   /* 슬라이더 범위 라벨($1K·$250K 등)은 숫자 보간 없이 교체 */ if (o && o.n != null) countUp(e, o.n, UI.T.std) });
  // 비교표: 새 목록이 아래 8px에서 떠오름(300ms)
  UI.swapFx([$('[data-compare-sub]'), $('[data-compare-body]')]);
}
function selectedSeg() { return $$('[data-hub-right] [data-hub-tab]').find(s => /box-shadow/.test(s.getAttribute('style') || '')) }
// 탭 선택 표시(흰 알약)가 이전 위치에서 새 위치로 미끄러진다
function pillFlip(oldRect) {
  const now = selectedSeg(); if (!now) return;
  const par = now.parentElement, pr = par.getBoundingClientRect(), nr = now.getBoundingClientRect();
  par.style.position = 'relative';
  const pill = document.createElement('span'); pill.className = 'site-pill';
  pill.style.cssText = `left:${oldRect.left - pr.left}px;top:${oldRect.top - pr.top}px;width:${oldRect.width}px;height:${oldRect.height}px`;
  par.insertBefore(pill, par.firstChild);
  const bg = now.style.background, sh = now.style.boxShadow; now.style.background = 'transparent'; now.style.boxShadow = 'none';
  $$('[data-hub-tab]', par).forEach(s => { s.style.position = 'relative'; s.style.zIndex = 1 });
  requestAnimationFrame(() => { pill.style.left = (nr.left - pr.left) + 'px'; pill.style.width = nr.width + 'px'; pill.style.top = (nr.top - pr.top) + 'px' });
  setTimeout(() => { now.style.background = bg; now.style.boxShadow = sh; pill.remove() }, 220);
}
// 파트너 셀렉트 — 공통 UI.dropdown
function partnerMenu(anchor) {
  const r = H.route, list = HUBX.routeList(r);
  const lg = p => HUBX.HB_DEX.includes(p) ? C.dex(p.name, 24) : `<img src="${A('hub-logo-' + p.lg + '.png')}" alt="" style="width:24px;height:24px;border-radius:50%;object-fit:cover">`;
  const html = list.map(p => { const on = p.id === H.pid[r]; return `<button type="button" role="option" aria-selected="${on}" data-ui-opt="${p.id}" class="${on ? 'on' : ''}">${lg(p)}<span class="grow">${esc(p.name)}</span>${on ? `<img src="${A('link-ic-check.svg')}" alt="" style="width:18px;height:18px;filter:brightness(0) saturate(100%) invert(12%) sepia(88%) saturate(4000%) hue-rotate(226deg)">` : ''}</button>` }).join('');
  UI.dropdown(anchor, {
    html, cls: 'pick', width: 'anchor',
    onPick(pid) {
      if (pid === H.pid[r]) return;
      H.pid[r] = pid;
      const box = $('[data-hub-right]');
      const wait = ledgerAccounts().length > 0;
      const olds = leafNums(box).map(e => numParts(e.textContent.trim()).n);
      box.innerHTML = rightCard({ loading: wait }); box.dataset.counted = '1'; bindRight(); fadeIn(box);
      if (!wait && !UI.reduced()) leafNums(box).forEach((e, i) => { if (olds[i] != null) countUp(e, olds[i], UI.T.std) });   // 파트너 변경: 금액 보간 300ms
      if (wait) setTimeout(() => { box.innerHTML = rightCard(); bindRight(); fadeIn(box) }, rnd(300, 800));
      const t = $('[data-hub-partner]', box); if (t) try { t.focus({ preventScroll: true }) } catch (e) { }
    }
  });
}

// ---------------- 숫자 카운트업 ----------------
function numParts(t) { const m = String(t).match(/^(.*?)(\d[\d,]*(?:\.\d+)?)(\D*)$/); if (!m) return null; return { pre: m[1], n: parseFloat(m[2].replace(/,/g, '')), dec: (m[2].split('.')[1] || '').length, post: m[3] } }
function leafNums(root) { if (!root) return []; return $$('*', root).filter(e => !e.children.length && e.tagName !== 'INPUT' && numParts(e.textContent.trim())) }
function countUp(el, from, dur = 450) {
  const fin = el.textContent, p = numParts(fin.trim()); if (!p || from === p.n) return;
  const t0 = performance.now(), f = n => p.pre + n.toLocaleString('en-US', { minimumFractionDigits: p.dec, maximumFractionDigits: p.dec }) + p.post;
  const step = t => { const k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3); if (k >= 1) { el.textContent = fin; return } el.textContent = f(Math.floor((from + (p.n - from) * e) * 10 ** p.dec) / 10 ** p.dec); requestAnimationFrame(step) };
  requestAnimationFrame(step);
}

// =====================================================================
// 거래 계정 연동 흐름 (CEX · DEX 공통) — FU-013 ~ FU-025
// =====================================================================
const L = { open: false, step: null, ex: null, type: null, val: '', err: null, touched: false, busy: false, prev: null, result: null };
const DEXES = ['Lighter', 'ApeX', 'EdgeX', 'Aster'];
const ERR_KO = (window.LINKX && LINKX.ADDR_KO) || {};
// 테스트 주소 규칙: 주소(또는 UID)의 끝자리로 결과를 고른다 — 화면 구석 「테스트 주소」 도움말에 안내
const RULE_DEX = { '0001': 'normal', '0002': 'inuse', '0003': 'limit', '0004': 'pending', '0005': 'cooldown', '0006': 'rejected', '0007': 'other', '0008': 'mine', '0009': 'unsupported' };
const RULE_CEX = { '1': 'normal', '2': 'inuse', '3': 'limit', '4': 'pending', '5': 'cooldown', '7': 'other', '8': 'mine' };
const LABEL = { normal: '레퍼럴 아님 (L8)', inuse: '타인 사용 중 (L9)', limit: '한도 초과 (L15)', pending: '확인 중 (L11)', cooldown: '최근 소유권 인증 (L12)', rejected: '거래소가 주소 거절 (입력 유지)', other: '기타 실패 (L13)', mine: '본인 이미 추가 (L14)', unsupported: '지원하지 않는 형식 (입력 유지)', ok: '연동 성공' };
const BASE_ADDR = '0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9';

function openLink(o = {}) {
  if (!isMember()) { toast('로그인이 필요해요 — 로그인 화면으로 이동'); return setTimeout(() => { closeLayer(true); navReal('/en/login') }, 600) }
  Object.assign(L, { open: true, err: null, touched: false, busy: false, prev: null, result: null, onClose: null });
  if (o.ex) setExchange(o.ex, o.type); else { L.step = 'select'; L.ex = null }
  renderLayer({ enter: true });
}
window.openLink = openLink;
function setExchange(name, type) {
  const t = type || (DEXES.includes(name) ? 'DEX' : 'CEX');
  if (L.ex !== name) { L.val = (ST.draft && ST.draft[name]) || ''; L.err = null; L.touched = false }
  L.ex = name; L.type = t; L.step = t === 'DEX' ? 'addr' : 'uid';
}
function linkGo(id, st, el) {
  if (!L.open) {
    if (id === 'link.addr' && st && DEXES.some(d => d.toLowerCase() === st)) return openLink({ ex: DEXES.find(d => d.toLowerCase() === st), type: 'DEX' });
    if (id === 'link.signup') { openLink(); L.step = 'signup'; return renderLayer() }
    return openLink();
  }
  const v = pendingVenue; pendingVenue = null;
  if (id === 'link.select') { L.prev = L.step; L.step = 'select'; return renderLayer({ sheet: true }) }
  if ((id === 'link.addr' || id === 'link.uid') && v) {
    if (L.ex !== v.n) { L.val = ''; L.err = null; L.touched = false }  // 거래소를 바꾸면 입력값을 지운다(REQ-057)
    setExchange(v.n, v.t); return renderLayer();
  }
  if (id === 'link.signup' && st === 'return') { setExchange('Lighter', 'DEX'); toast('Lighter 가입 페이지는 새 탭으로 열려요 (프로토타입)'); return renderLayer() }
  if (id === 'link.addr' || id === 'link.uid') {
    // 시트 닫기(X) · 결과 화면 Close/X → 이전 단계 · 입력 유지(REQ-064 · REQ-093)
    if (L.step === 'select' && L.prev && L.prev !== 'select') { L.step = L.prev; return renderLayer() }
    if (L.step === 'select' && !L.prev) return closeLayer();
    if (L.ex) { L.step = L.type === 'DEX' ? 'addr' : 'uid'; return renderLayer() }
    return closeLayer();
  }
  if (id === 'link.captcha') return openCaptcha();
  if (id === 'link.result' && st === 'pending') { L.step = 'result'; L.result = 'pending'; return renderLayer() }
  toast('준비 중인 화면: ' + id);
}

// ---------- 레이어 렌더 ----------
function stepHTML() {
  S.vp = vpNow(); S.auth = 's4';
  const ex = L.ex;
  if (L.step === 'select') return R.byId['link.select'].render('normal');
  if (L.step === 'signup') return R.byId['link.signup'].render('prompt');
  if (L.step === 'addr') return R.byId['link.addr'].render(ex.toLowerCase());
  if (L.step === 'uid') { LINKX.setSel(ex); return LINKX.uidLinkForm('empty') }
  if (L.step === 'proc') return R.byId['link.proc'].render('normal');
  if (L.step === 'result') return R.byId['link.result'].render(L.result);
  if (L.step === 'done') {
    LINKX.setAddr(L.done.id); SITEL.cex = L.done.type === 'CEX';
    return R.byId['link.done'].render(L.done.ex === 'Lighter' ? 'weekly' : L.done.ex === 'ApeX' ? 'apex' : 'normal');
  }
  if (L.step === 'drawer') return R.byId['cmn.drawer'].render(isMember() ? 'member' : 'normal');
  if (L.step === 'custom') return L.html();
  return '';
}
function kind() {
  if (['proc', 'result', 'done'].includes(L.step)) return 'splash';
  if (L.step === 'drawer') return 'full';
  if (L.step === 'custom') return L.kind;
  if (S.vp === 'mo') return L.step === 'select' ? 'sheet' : L.step === 'signup' ? 'center' : 'full';
  return L.step === 'uid' || L.step === 'signup' ? 'center' : 'modal';
}
function renderLayer(o = {}) {
  const html = stepHTML(), k = kind();
  const wasOpen = layer.classList.contains('open');
  // 모바일 시트는 아래 단계(입력 화면) 위에 겹친다
  let under = '';
  if (k === 'sheet' && L.prev && L.prev !== 'select') { const s = L.step; L.step = L.prev; under = `<div class="site-under">${stepHTML()}</div>`; L.step = s }
  layer.className = 'site-layer open k-' + k + (S.vp === 'mo' ? ' vp-mo' : ' vp-pc') + (L.step === 'drawer' ? ' drawer' : '');
  layer.innerHTML = `${under}<div class="site-scrim" data-site="scrim"></div><div class="site-box" data-site="box">${html}</div>${testHelp()}`;
  if (!wasOpen || o.enter) { layer.classList.add('enter'); requestAnimationFrame(() => requestAnimationFrame(() => layer.classList.remove('enter'))) }
  else if (o.swap) UI.swapFx($(o.swap, layer), { dur: UI.T.base, shift: 6 });
  else if (k !== 'sheet') { const b = $('.site-box', layer); b.classList.add('swap'); requestAnimationFrame(() => requestAnimationFrame(() => b.classList.remove('swap'))) }
  document.documentElement.classList.add('site-lock');
  enhanceStep();
}
function closeLayer(silent) {
  if (!L.open && !layer.classList.contains('open')) { if (MODAL && !silent) post({ dexModal: 'close' }); return }
  if (L.busy) return;
  L.open = false;
  UI.closeDropdown(true);
  layer.classList.add('leave');
  const dur = layer.classList.contains('drawer') ? UI.T.drawer : UI.T.modal;
  setTimeout(() => { layer.className = 'site-layer'; layer.innerHTML = ''; document.documentElement.classList.remove('site-lock'); if (MODAL && !silent) post({ dexModal: 'close' }); if (L.onClose) { const f = L.onClose; L.onClose = null; f() } }, dur);
}
function backHome() {
  L.busy = false; closeLayer(true);
  if (EMB) return post({ dexHome: 1 });
  navReal('/en');
}
layer.addEventListener('click', e => {
  if ((e.target.dataset.site === 'scrim' || e.target.dataset.site === 'box') && kind() !== 'splash') return onBackdrop();
  const nx = e.target.closest('[data-site="next"]');
  if (nx) return onNext(nx);
  const b = e.target.closest('button');
  if (b && !b.dataset.go && !b.closest('[data-link-picker]') && !b.closest('.site-help') && !b.closest('.site-cap') && !b.disabled && !b.dataset.site) {
    const l = b.textContent.trim();
    if (l === 'Paste') return doPaste();
    if (l === 'Next') return onNext(b);
    if (/^Retry/.test(l)) return;
    if (l === 'Link Account') return;
    if (b.classList.contains('icon-btn') && !b.querySelector('img[src*="chevron"]')) return closeLayer();
    if (l) toast('「' + l.slice(0, 30) + '」 처리됨 (프로토타입)');
  }
});
function onBackdrop() { if (L.step === 'select' && L.prev && L.prev !== 'select') { L.step = L.prev; return renderLayer() } closeLayer() }
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !L.open) return;
  if ($('.site-cap')) return closeCaptcha();
  if (e.target.closest && e.target.closest('details[data-link-picker]')) return;   // 패널 안 포커스: 50-link.js가 패널만 닫음
  const dp = document.querySelector('.site-layer details[data-link-picker][open]');
  if (dp) { UI.closeDetails(dp); const sm = dp.querySelector('summary'); if (sm) try { sm.focus({ preventScroll: true }) } catch (x) { } return }   // 드롭다운 먼저 닫기(공통 규칙)
  onBackdrop();
});

// ---------- 단계별 동작 ----------
function enhanceStep() {
  const box = $('.site-box', layer);
  if (L.step === 'addr' || L.step === 'uid') bindField(box);
  if (L.step === 'proc') { const plate = $$('div', box).find(d => /border-radius:48px/.test(d.getAttribute('style') || '')); if (plate) plate.classList.add('site-spin') }
  if (L.step === 'done') { const t = $('.toast', box); if (t) { t.classList.add('site-in') } }
  if (L.step === 'custom' && L.bind) L.bind(box);
}
function validate(v) {
  const t = v.trim();
  if (!t) return L.touched ? 'Enter your wallet address.' : '';
  if (/\s/.test(t)) return 'Remove spaces within the wallet address.';
  if (/^0x0{40}$/i.test(t)) return 'This address can’t be linked.';
  if (/^@|\.(eth|sol|bnb|arb|base|lens|bit|crypto)$/i.test(t)) return 'Paste the wallet address, not an account name.';
  return '';
}
function bindField(box) {
  const inp = $('.tf:not(.sm) input', box); if (!inp) return;
  const tf = inp.closest('.tf');
  const next = $$('button', box).find(b => b.textContent.trim() === 'Next');
  const paste = $$('button', box).find(b => b.textContent.trim() === 'Paste');
  const hint = $$('p', box).find(p => /^Paste a valid wallet address to continue\.$/.test(p.textContent.trim()));
  const dex = L.type === 'DEX';
  inp.value = L.val; inp.autocomplete = 'off'; inp.spellcheck = false; inp.setAttribute('autocapitalize', 'off');
  if (!dex) inp.setAttribute('inputmode', 'numeric');
  if (next) { next.removeAttribute('data-go'); next.dataset.site = 'next' }
  const upd = () => {
    const v = inp.value, t = v.trim();
    const err = L.err || (dex ? validate(v) : (/\s/.test(t) ? '' : ''));
    const ok = !!t && !err && (dex || /^\S+$/.test(t));
    tf.classList.toggle('err', !!err);
    let lb = $('.lbl', tf);
    if (v && !lb) { lb = document.createElement('span'); lb.className = 'lbl'; lb.textContent = dex ? 'Wallet address' : 'UID'; tf.insertBefore(lb, tf.firstChild) }
    if (!v && lb) lb.remove();
    let help = $('.help', tf);
    const helpTxt = err ? (S.lang === 'ko' && ERR_KO[err] ? ERR_KO[err] : err) : dex ? T('Paste the wallet address you use on this exchange.', '이 거래소에서 쓰는 지갑 주소를 붙여넣으세요.') : '';
    if (helpTxt) { if (!help) { help = document.createElement('div'); help.className = 'help'; tf.appendChild(help) } help.textContent = helpTxt } else if (help) help.remove();
    if (next) next.disabled = !ok;
    if (paste) paste.style.display = v ? 'none' : '';
    if (hint) hint.style.display = ok ? 'none' : '';
  };
  inp.addEventListener('input', () => {
    L.val = inp.value; L.err = null;
    ST.draft = ST.draft || {}; ST.draft[L.ex] = L.val; persist();
    upd();
  });
  inp.addEventListener('blur', () => { if (!inp.value.trim() && L.val !== undefined && inp.dataset.typed) { L.touched = true; upd() } });
  inp.addEventListener('keydown', e => { inp.dataset.typed = 1; if (e.key === 'Enter' && next && !next.disabled) onNext(next) });
  inp.addEventListener('paste', () => { inp.dataset.typed = 1 });
  upd();
  if (vpNow() === 'pc' && !L.val) setTimeout(() => inp.focus({ preventScroll: true }), 60);
}
function doPaste() {
  const inp = $('.site-box .tf:not(.sm) input', layer);
  const put = t => { inp.value = t; inp.dispatchEvent(new Event('input')); inp.focus() };
  try { navigator.clipboard.readText().then(t => t ? put(t) : inp.focus(), () => { inp.focus(); toast('붙여넣기 권한이 없어요. 직접 붙여넣어 주세요 (프로토타입)') }) } catch (e) { inp.focus() }
}
function onNext(b) {
  if (L.busy) return errToast();   // 처리 중 다시 누름 = 중복 요청
  if (b.disabled) return;
  L.val = L.val.trim();
  b.disabled = true;                // 중복 클릭 방지
  openCaptcha();
}

// ---------- 캡차 (GEETEST 슬라이드 퍼즐 모양 — 실제로 끌어 맞추면 통과) ----------
let CAP = null;
function openCaptcha() {
  closeCaptcha(true);
  const W = 258, PW = 40, tx = Math.round(rnd(110, 205));
  const img = A('link-captcha-1.png');
  const el = document.createElement('div'); el.className = 'site-cap';
  el.innerHTML = `<div class="site-cap-scrim" data-cap="scrim"></div><div class="site-cap-box" data-target="${tx}">
    <div class="cap-img" style="background-image:url(${img})"><span class="cap-gap" style="left:${tx}px"></span><span class="cap-piece" style="left:6px;background-image:url(${img});background-position:-${tx}px -56px"></span><span class="cap-msg"></span></div>
    <div class="cap-track"><span class="cap-fill"></span><span class="cap-knob" data-cap="knob">${ic('arrow-forward', 'ic20')}</span><span class="cap c2 cap-txt">${T('Slide to complete the puzzle')}</span></div>
    <div style="height:1px;background:var(--divider)"></div><div class="row between"><span class="row" style="gap:10px"><button type="button" class="cap-ic" data-cap="close" title="Close">${ic('close', 'ic20')}</button><button type="button" class="cap-ic" data-cap="refresh" title="Refresh">↻</button></span><span class="cap c3">${T('Powered by GEETEST')}</span></div></div>`;
  layer.appendChild(el);
  requestAnimationFrame(() => el.classList.add('in'));
  CAP = { el, tx, x: 0, fails: 0, W, PW };
  const knob = $('[data-cap="knob"]', el), piece = $('.cap-piece', el), fill = $('.cap-fill', el), track = $('.cap-track', el);
  const max = W - PW;
  const setX = x => { CAP.x = Math.max(0, Math.min(max, x)); knob.style.transform = `translateX(${CAP.x}px)`; piece.style.transform = `translateX(${CAP.x}px)`; fill.style.width = (CAP.x + PW / 2) + 'px' };
  knob.addEventListener('pointerdown', e => {
    if (CAP.done) return;
    e.preventDefault(); knob.setPointerCapture(e.pointerId);
    const x0 = e.clientX - CAP.x; el.classList.add('drag'); el.classList.remove('fail');
    const mv = ev => setX(ev.clientX - x0);
    const up = () => {
      knob.removeEventListener('pointermove', mv); knob.removeEventListener('pointerup', up); knob.removeEventListener('pointercancel', up);
      el.classList.remove('drag');
      const off = Math.abs(6 + CAP.x - CAP.tx);
      if (off <= 5) return capPass(el);
      CAP.fails++; el.classList.add('fail');
      setTimeout(() => { setX(0); el.classList.remove('fail'); if (CAP.fails >= 3) { CAP.fails = 0; refreshCap() } }, 650);
    };
    knob.addEventListener('pointermove', mv); knob.addEventListener('pointerup', up); knob.addEventListener('pointercancel', up);
  });
  el.addEventListener('click', e => {
    const c = e.target.closest('[data-cap]'); if (!c) return;
    if (c.dataset.cap === 'scrim' || c.dataset.cap === 'close') closeCaptcha();
    if (c.dataset.cap === 'refresh') refreshCap();
  });
  function refreshCap() { const t = Math.round(rnd(110, 205)); CAP.tx = t; $('.site-cap-box', el).dataset.target = t; $('.cap-gap', el).style.left = t + 'px'; piece.style.backgroundPosition = `-${t}px -56px`; setX(0) }
}
function closeCaptcha(now) {
  const el = $('.site-cap', layer); if (!el) return;
  if (now) return el.remove();
  el.classList.remove('in'); setTimeout(() => el.remove(), 200);
  const next = $('[data-site="next"]', layer); if (next) next.disabled = false;
}
function capPass(el) {
  CAP.done = true; el.classList.add('ok'); $('.cap-msg', el).textContent = T('Verification Success');
  setTimeout(() => { closeCaptcha(true); runLink() }, 520);
}

// ---------- 처리 중 → 결과 ----------
function outcome() {
  const id = L.val.trim();
  if (ST.accounts.some(a => a.ex === L.ex && a.id.toLowerCase() === id.toLowerCase() && a.st !== 'pend')) return 'mine';
  if (L.type === 'DEX') return RULE_DEX[id.slice(-4)] || 'ok';
  return RULE_CEX[id.slice(-1)] || 'ok';
}
async function runLink() {
  L.busy = true; L.step = 'proc'; renderLayer();
  const t0 = performance.now(), res = outcome();
  await new Promise(r => setTimeout(r, Math.max(0, 1000 + rnd(0, 600) - (performance.now() - t0))));  // 최소 1초
  L.busy = false;
  if (!L.open) return;
  const id = L.val.trim();
  if (res === 'rejected' || res === 'unsupported') {
    L.err = res === 'rejected' ? 'We couldn’t verify this wallet address. Copy it again from the exchange.' : 'This address is not supported for the selected exchange.';
    L.step = 'addr'; return renderLayer();
  }
  if (res === 'ok' || res === 'pending') {
    ST.accounts.push({ ex: L.ex, type: L.type, id, a: 0, b: 0, st: res === 'pending' ? 'pend' : L.type === 'DEX' ? 'zero' : 'ok', ts: Date.now() });
    ST.justLinked = id; if (ST.draft) delete ST.draft[L.ex]; persist();
    post({ dexChanged: 1 });
    L.val = '';
  }
  if (res === 'ok') { L.done = { ex: L.ex, type: L.type, id }; L.step = 'done' }
  else { L.step = 'result'; L.result = res }
  renderLayer();
}

// ---------- 테스트 주소 도움말 (화면 구석) ----------
function testHelp() {
  if (!['addr', 'uid', 'select'].includes(L.step)) return '';
  const dex = L.type !== 'CEX';
  const rows = dex
    ? [['ok', BASE_ADDR]].concat(Object.entries(RULE_DEX).map(([k, v]) => [v, BASE_ADDR.slice(0, -4) + k]))
    : [['ok', '685432170']].concat(Object.entries(RULE_CEX).map(([k, v]) => [v, '68543217' + k]));
  return `<details class="site-help" data-site="help"><summary data-site="help">테스트 주소</summary><div class="site-help-in">
   <p>${dex ? '지갑 주소 <b>끝 4자리</b>' : 'UID <b>끝자리</b>'}로 결과가 정해져요. 이미 연동한 주소를 다시 넣으면 「본인 이미 추가」.</p>
   ${rows.map(([r, v]) => `<button type="button" data-site="fill" data-v="${v}"><span>${LABEL[r]}</span><code>${dex ? v.slice(0, 6) + '…' + v.slice(-6) : v}</code></button>`).join('')}
   <p class="mut">입력 오류(즉시): 빈 값 · 주소 안 공백 · 0x000…0(제로 주소) · <code>name.eth</code>(이름)</p>
   <button type="button" data-site="reset" class="mut">연동 데이터 초기화</button></div></details>`;
}
layer.addEventListener('click', e => {
  const f = e.target.closest('[data-site="fill"]');
  if (f) { e.preventDefault(); const inp = $('.site-box .tf:not(.sm) input', layer); if (inp) { inp.value = f.dataset.v; inp.dataset.typed = 1; inp.dispatchEvent(new Event('input')); inp.focus() } else toast('먼저 거래소를 선택하세요'); return }
  const r = e.target.closest('[data-site="reset"]');
  if (r) { ST = DEXSTATE.reset(); post({ dexChanged: 1 }); toast('연동 데이터를 처음 상태로 되돌렸어요') }
});

// ---------- 모바일 드로어 ----------
function openDrawer() { Object.assign(L, { open: true, step: 'drawer' }); renderLayer({ enter: true }) }

// ---------------- 2회차 모듈(site2.js)에 내보내는 내부 API ----------------
function openCustom(html, kind, o = {}) { Object.assign(L, { open: true, step: 'custom', html, kind, bind: o.bind || null, onClose: o.onClose || null, busy: false }); renderLayer({ enter: true }) }
window.SITE_API = {
  get ST() { return ST }, set ST(v) { ST = v }, persist, post, toast, navReal, goRoute, renderPage, isMember, openLink, closeLayer, backHome, openCustom, renderLayer,
  countUp, leafNums, numParts, fadeIn, rnd, fl2, copyText, get route() { return route }, L, EMB, MODAL, ORIGIN, SITE, $, $$, vpNow
};
// ---------------- 셸 메시지 ----------------
window.addEventListener('message', e => {
  const m = e.data || {};
  if (m.dexGo) { const [p, qs] = m.dexGo.split('?'); closeLayer(true); goRoute(p, Object.fromEntries(new URLSearchParams(qs || '')), { replace: true }) }
  if (m.dexLink) openLink(m.dexLink);
});
window.addEventListener('storage', e => { if (e.key === DEXSTATE.KEY) { ST = DEXSTATE.load(); if (!L.open) renderPage({ keepScroll: true }) } });
window.addEventListener('resize', () => { const v = vpNow(); if (v !== lastVp) { lastVp = v; renderPage({ keepScroll: true }); if (L.open) renderLayer() } });

// ---------------- 시작 ----------------
S.vp = vpNow();
queueMicrotask(() => {   // site2.js(같은 스크립트 뒤쪽)가 등록된 뒤 시작
if (MODAL) {
  document.body.classList.toggle('vp-mo', S.vp === 'mo');
  if (Q.get('mode') && window.SITE2) SITE2.modal(Q.get('mode'), Object.fromEntries(Q));
  else openLink({ ex: Q.get('ex') || null, type: Q.get('type') || null });
} else renderPage();
post({ dexReady: hashOf(route) });
});
})();
