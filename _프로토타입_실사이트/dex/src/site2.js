// ===== site2.js — 2회차: DEX 랜딩·상세 동작 · 홈 See All · 지갑/UID 상세 · 캐시백 요약 · 소유권 인증 =====
// 화면·문구는 _프로토타입_전체 렌더 함수 그대로. 여기서는 상태를 넘기고 클릭·입력에 동작을 붙인다.
(function () {
'use strict';
const API = window.SITE_API;
const { post, toast, navReal, goRoute, renderPage, isMember, openCustom, closeLayer, countUp, leafNums, numParts, fadeIn, rnd, copyText, $, $$ } = API;
const L = API.L;
const DEXES = ['Lighter', 'ApeX', 'EdgeX', 'Aster'];
const isDex = n => DEXES.includes(n);
const short = a => a.slice(0, 6) + '…' + a.slice(-4);
const app = document.getElementById('app');
// Get Started · Join Now: 레퍼럴 링크는 어드민 입력값(미보유) — 프로토타입은 각 DEX 공식 사이트를 새 탭으로 연다
const OFFICIAL = { lighter: 'https://lighter.xyz', apex: 'https://omni.apex.exchange', edgex: 'https://www.edgex.exchange', aster: 'https://www.asterdex.com' };
const REAL_ROUTE = { '/hub': '/en/affiliated', '/dex': '/en/dex', '/summary': '/en/rewardHistory', '/account': '/en/account', '/ownership': '/en/ownership-verification' };
// 모달 모드(셸 레이어 iframe)에서 페이지 이동은 셸에 맡긴다
function go2(path, q) {
  if (API.MODAL) { closeLayer(true); const real = REAL_ROUTE[path] || (path.startsWith('/dex/') ? '/en' + path : '/en'); return post({ nav: API.ORIGIN + real + (q && q.tab ? '?tab=' + q.tab : '') }) }
  closeLayer(true); goRoute(path, q || {});
}

// ---------------- DEX 랜딩 · 상세 상태 ----------------
const SD = { list: null, maker: false, vol: 400000, step: 0, faq: new Set([0]), sort: 0, slug: null };
function memberOf(slug) {
  if (!isMember()) return 'guest';
  const mine = API.ST.accounts.filter(a => a.type === 'DEX' && a.ex.toLowerCase() === slug);
  if (mine.some(a => ['ok', 'zero'].includes(a.st))) return 'linked';
  if (mine.some(a => a.st === 'pend')) return 'pending';     // 결정 Q6 B — 비활성 `Trying to link`
  return 'unlinked';
}
function withSD(o, f) { window.SITED = o; try { return f() } finally { window.SITED = null } }
const site2 = {
  title(p) { return { '/summary': 'Cashback Summary | TetherMax', '/account': 'Account | TetherMax', '/ownership': 'Ownership Verification | TetherMax' }[p] },
  dexLanding() { S.auth = isMember() ? 's3' : 'guest'; return withSD({ guest: !isMember(), list: SD.list }, () => renderInner('dex.overview:' + (isMember() ? 'member' : 'normal'))) },
  dexDetail(slug) {
    if (SD.slug !== slug) Object.assign(SD, { slug, maker: false, vol: 400000, step: 0, faq: new Set([0]), sort: 0 });
    const member = memberOf(slug);
    S.auth = member === 'guest' ? 'guest' : 's4';
    return withSD({ id: slug, member, maker: SD.maker, vol: SD.vol, step: SD.step }, () => renderInner('dex.detail:' + slug));
  },
  render(p) {
    if (p === '/summary') { if (!isMember()) { navReal('/en/login'); return '' } S.auth = 's4'; return withSum(() => renderInner('summary.main:normal')) }
    if (p === '/account') { if (!isMember()) { navReal('/en/login'); return '' } return accountHTML() }
    if (p === '/ownership') { if (!isMember()) { navReal('/en/login'); return '' } return ownHTML() }
    return null;
  },
  enhance(p, q, o) {
    if (p === '/dex') landingEnhance();
    if (/^\/dex\/\w+$/.test(p)) detailEnhance(o);
    if (p === '/summary') sumEnhance();
    if (p === '/ownership') ownEnhance();
  },
  go(id, st, el, inLayer) {
    if (API.MODAL && ['hub.main', 'cex.list', 'dex.overview', 'summary.main'].includes(id)) {
      const tab = id === 'cex.list' || st === 'cex' ? 'CEX' : st === 'brokers' ? 'Brokers' : null;
      go2(id === 'dex.overview' ? '/dex' : id === 'summary.main' ? '/summary' : '/hub', tab ? { tab } : null); return true;
    }
    if (API.MODAL && id === 'dex.detail' && ['lighter', 'apex', 'edgex', 'aster'].includes(st)) { go2('/dex/' + st); return true }
    if (id === 'dex.detail' && st === 'drawer') { openHow(); return true }
    if (id === 'dex.detail' && st === 'close') { closeLayer(); return true }
    if (id === 'summary.main') { go2('/summary'); return true }
    if (id === 'home.main' && L.open && L.step === 'custom' && L.kind !== 'full') { closeLayer(); return true }
    if (id === 'own.verify') return ownGo(st, inLayer);
    if (id === 'own.home') return ownHomeGo(st);
    return false;
  },
  modal(mode, q) {
    if (mode === 'drawer') { Object.assign(L, { open: true, step: 'drawer' }); API.renderLayer({ enter: true }); return }
    if (mode === 'seeAll') return openSeeAll();
    if (mode === 'own') return ownResult(q.r);
  }
};
window.SITE2 = site2;

// ---------------- 랜딩 ----------------
function landingEnhance() {
  // glance · 카드 요율 카운트업(화면에 들어올 때)
  const nums = leafNums(app).filter(e => /^\d+%$/.test(e.textContent.trim()));
  const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { io.unobserve(x.target); countUp(x.target, 0, 700) } }), { threshold: .4 });
  nums.forEach(n => io.observe(n));
  carousel();
}
// 프로모 배너 캐러셀 — 슬라이드: Figma DEX 배너(Aster) + 실사이트 거래소 목록 상단 배너(Bitget, 같은 어드민 배너 — 결정 D7 · Q7)
let carTimer = null;
function carousel() {
  clearInterval(carTimer);
  const title = $$('span', app).find(s => s.textContent.trim() === 'Trade with Aster and get Cashback!'); if (!title) return;
  let box = title; while (box && !/#151515/.test(box.getAttribute('style') || '')) box = box.parentElement; if (!box) return;
  const dots = box.parentElement.querySelector('img[src*="dex-ov-dots"]');
  const s2 = box.cloneNode(true);
  const bitgetImg = 'https://tethermax-prod.s3.ap-northeast-1.amazonaws.com/exchange/list/top/banner/pc/406cf39c-15c8-4d74-ba32-b469a36c5912.webp';
  if (S.vp === 'mo') { const top = s2.firstElementChild; top.style.background = `url(${bitgetImg}) center/cover` }
  else s2.style.background = `#151515 url(${bitgetImg}) right center/auto 100% no-repeat`;
  const mk = s2.querySelector('.dexmark'); if (mk) { const im = document.createElement('img'); im.src = A('hub-logo-bitget.png'); im.style.cssText = 'width:40px;height:40px;border-radius:50%'; mk.replaceWith(im) }
  $$('span', s2).forEach(sp => { const t = sp.textContent.trim(); if (t === 'Aster') sp.textContent = 'Bitget'; if (t === 'Trade with Aster and get Cashback!') sp.textContent = 'Bitget Trading Competition'; if (t === 'Win up to 2,000,000 USDT') sp.textContent = 'Total 150,000 USDT Przie Pool' });
  s2.dataset.slide = 'bitget'; box.dataset.slide = 'aster';
  const vp = document.createElement('div'); vp.className = 'site-car';
  const track = document.createElement('div'); track.className = 'site-car-track';
  box.replaceWith(vp); vp.appendChild(track); track.appendChild(box); track.appendChild(s2);
  [box, s2].forEach(x => { x.style.flex = '0 0 100%' });
  const arrow = (side, icn) => { const b = document.createElement('button'); b.className = 'site-car-arrow ' + side; b.type = 'button'; b.innerHTML = ic(icn, 'ic20'); vp.appendChild(b); return b };
  const prev = arrow('l', 'chevron-left'), next = arrow('r', 'chevron-right');
  const dw = document.createElement('div'); dw.className = 'site-car-dots'; dw.innerHTML = '<i></i><i></i>';
  if (dots) dots.replaceWith(dw); else vp.after(dw);
  let i = 0; const n = 2;
  const show = k => { i = (k + n) % n; track.style.transform = `translateX(${-i * 100}%)`; $$('i', dw).forEach((d, j) => d.classList.toggle('on', j === i)) };
  prev.onclick = e => { e.stopPropagation(); show(i - 1); restart() }; next.onclick = e => { e.stopPropagation(); show(i + 1); restart() };
  $$('i', dw).forEach((d, j) => d.onclick = () => { show(j); restart() });
  const restart = () => { clearInterval(carTimer); carTimer = setInterval(() => { if (!document.body.contains(vp)) return clearInterval(carTimer); if (!vp.matches(':hover')) show(i + 1) }, 5000) };
  show(0); restart();
}

// ---------------- 상세 ----------------
let spy = null;
function detailEnhance(o) {
  const tabs = $('[data-dt-tabs]', app); if (!tabs) return;
  const row = tabs.firstElementChild; row.style.position = 'relative';
  $$('[data-dt-tab]', row).forEach(t => { t.style.borderBottom = '2px solid transparent' });
  const bar = document.createElement('span'); bar.className = 'site-tabbar'; row.appendChild(bar);
  const setActive = (i, inst) => {
    $$('[data-dt-tab]', row).forEach((t, j) => { t.style.color = j === i ? 'var(--blue)' : 'var(--text-secondary)' });
    const t = $(`[data-dt-tab="${i}"]`, row); if (!t) return;
    if (inst) bar.style.transition = 'none'; bar.style.left = t.offsetLeft + 'px'; bar.style.width = t.offsetWidth + 'px';
    if (inst) { void bar.offsetWidth; bar.style.transition = '' }
    if (S.vp === 'mo') row.parentElement.scrollTo({ left: t.offsetLeft - 16, behavior: 'smooth' });
    tabs.dataset.on = i;
  };
  setActive(0, true);
  window.removeEventListener('scroll', spy);
  spy = () => {
    const h = tabs.getBoundingClientRect().height + 8; let cur = 0;
    $$('[data-dt-sec]', app).forEach(sec => { if (sec.getBoundingClientRect().top <= h + 40) cur = +sec.dataset.dtSec });
    if (+tabs.dataset.on !== cur) setActive(cur);
  };
  window.addEventListener('scroll', spy, { passive: true }); spy();
  // FAQ — 첫 구역만 펼침(REQ-350), 여러 구역 동시 열림
  $$('[data-faq]', app).forEach(f => faqSet(f, SD.faq.has(+f.dataset.faq)));
  const terms = $('[data-faq-terms]', app); if (terms) faqSet(terms.parentElement.querySelector('[data-faq-terms]').parentElement === terms.parentElement ? terms : terms, SD.faq.has('t'), true);
  reviewsSort(SD.sort, true);
}
function faqBodyOf(f, terms) {
  const head = terms ? f : f.querySelector('[data-faq-head]');
  let body = terms ? f.nextElementSibling && f.nextElementSibling.hasAttribute('data-faq-body') ? f.nextElementSibling : null : head.nextElementSibling;
  if (!body) {
    body = document.createElement('div'); body.className = 'col'; body.style.cssText = 'gap:8px;padding:16px';
    body.innerHTML = terms ? C.tbd('거래소별 약관 — 어드민 입력값', 'G-369') : C.tbd('이 구역 질문·답변 — 어드민 입력값', 'G-419');
    head.after(body);
  }
  body.setAttribute('data-faq-body', '');
  return { head, body };
}
function faqSet(f, open, terms) {
  const { head, body } = faqBodyOf(f, terms);
  body.style.display = open ? '' : 'none';
  const icn = head.lastElementChild; if (icn) icn.textContent = open ? '−' : '+';
}
function reviewsSort(k, init) {
  SD.sort = k;
  $$('[data-rv-sort]', app).forEach(s => { const on = +s.dataset.rvSort === k; s.style.color = on ? 'var(--blue)' : 'var(--text-secondary)'; s.style.borderBottom = on ? '2px solid var(--blue)' : '2px solid transparent' });
  const items = $$('[data-rv]', app); if (!items.length) return;
  const par = items[0].parentElement;
  if (!par._orig) par._orig = items.slice();
  const by = [(a, b) => b.dataset.date.localeCompare(a.dataset.date), (a, b) => a.dataset.date.localeCompare(b.dataset.date), (a, b) => b.dataset.v - a.dataset.v, (a, b) => a.dataset.v - b.dataset.v, null][k];
  const list = by ? items.slice().sort(by) : par._orig.slice();
  list.forEach(x => par.appendChild(x));
  if (!init) fadeIn(par);
}
// 상세 계산기 슬라이더 — 눈금(Min 100K … 10M) 사이를 고르게 나눈 위치 ↔ 거래량
function volFromPct(p) {
  const VT = DEXVOL.VT, seg = 100 / (VT.length - 1); const i = Math.min(VT.length - 2, Math.floor(p / seg)); const f = (p - i * seg) / seg;
  const v = VT[i] + (VT[i + 1] - VT[i]) * f; const st = v >= 1e6 ? 100000 : 10000; return Math.round(v / st) * st;
}
function rerenderSec(n, f) {
  const sec = $(`[data-dt-sec="${n}"]`, app); if (!sec) return;
  const d = DEXX.DX[SD.slug];
  sec.innerHTML = withSD({ id: SD.slug, member: memberOf(SD.slug), maker: SD.maker, vol: SD.vol, step: SD.step }, () => f(d));
  return sec;
}
function openHow() {
  const d = DEXX.DX[SD.slug || 'edgex'];
  openCustom(() => withSD({ id: SD.slug, vol: SD.vol, maker: SD.maker }, () => DEXX.dtDrawer(d, SD.maker)), 'center');
}
document.addEventListener('pointerdown', e => {
  const sl = e.target.closest && e.target.closest('[data-dt-slider]'); if (!sl) return;
  e.preventDefault();
  const set = x => { const s = $('[data-dt-slider]', app); const r = s.getBoundingClientRect(); SD.vol = volFromPct(Math.max(0, Math.min(100, (x - r.left) / r.width * 100))); rerenderSec(1, d => DEXX.dtStructure(d, SD.maker)); const n = $('[data-dt-slider]', app); if (n) n.classList.add('drag') };
  set(e.clientX);
  const mv = ev => set(ev.clientX), up = () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerup', up); const n = $('[data-dt-slider]', app); if (n) n.classList.remove('drag') };
  window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up);
}, true);

// ---------------- 클릭 위임(2회차 화면) ----------------
document.addEventListener('click', e => {
  const t = e.target; if (!t.closest) return;
  const stop = () => { e.preventDefault(); e.stopPropagation() };
  const p = API.route.path;
  // Get Started · Join Now → 새 탭
  const b = t.closest('button');
  const label = b ? (b.innerText || '').trim() : '';
  if (b && /^(Get Started|Join Now)$/.test(label) && (p.startsWith('/dex'))) {
    stop();
    const card = b.closest('[data-dex-card]'), slide = b.closest('[data-slide]');
    const slug = card ? card.dataset.dexCard : slide ? slide.dataset.slide : SD.slug;
    if (slug === 'bitget') return toast('「Join Now」 처리됨 (프로토타입)');
    window.open(OFFICIAL[slug] || OFFICIAL.edgex, '_blank', 'noopener');
    return toast('새 탭으로 열었어요 — 레퍼럴 링크는 어드민 입력값이라 프로토타입은 공식 사이트로 열어요');
  }
  if (b && /^Write a (R|r)eview/.test(label)) { stop(); return toast('리뷰 작성 화면 — 다음 회차') }
  const cp = t.closest('[data-copy]'); if (cp) { stop(); return copyText(cp.dataset.copy) }
  const v = t.closest('[data-dex-view]');
  if (v) { stop(); SD.list = v.dataset.dexView === 'list'; return renderPage({ keepScroll: true }) }
  const card = t.closest('[data-dex-card]');
  if (card && !b && p === '/dex') { stop(); return goRoute('/dex/' + card.dataset.dexCard) }
  const tg = t.closest('[data-tog]');
  if (tg && /^\/dex\//.test(p)) {
    stop(); const k = tg.dataset.tog;
    if (k !== 'Taker' && k !== 'Maker') return;      // Lighter Premium/Plus — Plus 요율 미수신(표시 그대로)
    if ((k === 'Maker') === SD.maker) return;
    const olds = leafNums(app).map(x => numParts(x.textContent.trim()).n);
    SD.maker = k === 'Maker'; renderPage({ keepScroll: true });
    const now = leafNums(app); if (now.length === olds.length) now.forEach((x, i) => { if (olds[i] !== numParts(x.textContent.trim()).n) countUp(x, olds[i], 380) });
    return;
  }
  const tab = t.closest('[data-dt-tab]');
  if (tab) {
    stop(); const sec = $(`[data-dt-sec="${tab.dataset.dtTab}"]`, app); const tabs = $('[data-dt-tabs]', app);
    if (sec) window.scrollTo({ top: sec.getBoundingClientRect().top + window.scrollY - tabs.getBoundingClientRect().height + 1, behavior: 'smooth' });
    return;
  }
  const step = t.closest('[data-dt-step]');
  if (step) { stop(); SD.step = +step.dataset.dtStep; const sec = rerenderSec(2, d => DEXX.dtGuide(d, 'site')); const pn = sec && $('[data-dt-panel]', sec); if (pn) fadeIn(pn); return }
  const fh = t.closest('[data-faq-head]');
  if (fh) {
    stop(); const terms = fh.hasAttribute('data-faq-terms'); const f = terms ? fh : fh.closest('[data-faq]'); const key = terms ? 't' : +f.dataset.faq;
    const open = !SD.faq.has(key); open ? SD.faq.add(key) : SD.faq.delete(key); faqSet(f, open, terms);
    const body = faqBodyOf(f, terms).body; if (open) fadeIn(body);
    return;
  }
  const rs = t.closest('[data-rv-sort]'); if (rs) { stop(); return reviewsSort(+rs.dataset.rvSort) }
  const rm = t.closest('[data-rv-more]'); if (rm) { stop(); rm.closest('[data-rv]').classList.add('rv-open'); rm.style.display = 'none'; return }
}, true);

// =====================================================================
// 홈 See All — 연동 계정 목록 모달(결정 Q3: 기존 9401:160223 구성 · Accounts 표기 · All/CEX/DEX 칩)
// =====================================================================
const SEE = { rows: null, chip: 'All', logos: {} };
function cexSnapshot(cb) {
  // 실사이트 회원 홈 See All 수집본(frags/member__en.pc.55bc12d8.js)에서 CEX 계정을 읽는다
  if (SEE.rows) return cb();
  window.PT_FRAG = (id, p) => {
    const box = document.createElement('div'); box.innerHTML = p.html; const rows = []; let cur = null, curAmt = null, curMulti = false;
    $$('[class*="__ExchangeRow"], [class*="__UidRow"]', box).forEach(el => {
      if (/__ExchangeRow/.test(el.className)) {
        cur = (($('[class*="__ExchangeName"]', el) || {}).textContent || '').trim();
        const ea = $('[class*="__ExchangeAmount"]', el); curAmt = ea ? parseFloat(ea.textContent) : null; curMulti = !!$('[class*="__ExchangeSubtext"]', el);
        const img = $('img', el); if (img) SEE.logos[cur] = img.getAttribute('src');
        return;
      }
      if (!cur) return;
      const num = ($('[class*="__UidNumber"]', el) || {}).textContent || '';
      const amtEl = $('[class*="__UidAmount"]', el);
      const single = !amtEl && !curMulti && curAmt != null;
      const nx = el.nextElementSibling, alertT = nx && /StatusAlert/.test(nx.className) ? nx.textContent : '';
      const st = /Ownership verification was unsuccessful/.test(alertT) ? 'ownfail' : /Linking was unsuccessful/.test(alertT) ? 'fail' : amtEl || single ? 'ok' : 'unlinked';
      rows.push({ ex: cur, id: num.replace(/^UID\s*/, '').trim(), amt: amtEl ? parseFloat(amtEl.textContent) || 0 : single ? curAmt : null, st, type: 'CEX' });
    });
    SEE.rows = rows; cb();
  };
  const sc = document.createElement('script'); sc.src = '../frags/member__en.pc.55bc12d8.js';
  sc.onerror = () => { SEE.rows = []; cb() }; document.head.appendChild(sc);
}
function seeAllRows() {
  const dex = API.ST.accounts.map(a => ({ ex: a.ex, id: a.id, type: a.type, amt: DEXSTATE.amt(a), st: a.st === 'zero' ? 'ok' : a.st }));
  const all = SEE.rows.concat(dex);
  return SEE.chip === 'All' ? all : all.filter(r => (isDex(r.ex) ? 'DEX' : 'CEX') === SEE.chip);
}
function openSeeAll() {
  cexSnapshot(() => {
    window.SITELOGO = Object.assign({}, SEE.logos);
    openCustom(() => { window.SITEA = seeAllRows(); window.SITEAF = SEE.chip; try { return HOMEX.seeAllModal() } finally { window.SITEA = null } }, 'center', {
      bind(box) {
        $$('.chip', box).forEach(c => { const k = c.textContent.trim(); if (!['All', 'CEX', 'DEX'].includes(k)) return; c.dataset.site = 'chip'; c.onclick = e => { e.stopPropagation(); SEE.chip = k; const y = ($('[style*="overflow-y:auto"]', box) || {}).scrollTop; API.renderLayer(); } });
        // 계정 행 → 지갑/UID 상세
        $$('.row.between', box).forEach(r => {
          const t = (r.firstElementChild || r).textContent; const m = t.match(/(UID (\S+)|Wallet (0x\w{4})…(\w{4}))/); if (!m) return;
          r.style.cursor = 'pointer'; r.classList.add('site-hoverrow');
          r.onclick = e => {
            e.stopPropagation();
            const rows = seeAllRows(); const hit = rows.find(x => m[2] ? x.id === m[2] : x.id.startsWith(m[3]) && x.id.endsWith(m[4]));
            if (hit) openAccount(hit);
          };
        });
      }
    });
  });
}
function openAccount(x) {
  const acc = API.ST.accounts.find(a => a.ex === x.ex && a.id === x.id);
  API.ST.view = acc ? { ex: acc.ex, type: acc.type, id: acc.id, a: acc.a || 0, b: acc.b || null, st: acc.st } : { ex: x.ex, type: 'CEX', id: x.id, a: x.amt || 0, b: null, st: x.st };
  API.ST.viewLogo = SEE.logos[x.ex] || null; API.persist();
  go2('/account');
}

// =====================================================================
// 지갑 · UID 상세 (기존 디자인 9193:119755 계열 · Earning Timeline 3단계 — 결정 N16·N17·N19 · A6)
// =====================================================================
function accountHTML() {
  const v = API.ST.view; if (!v) { setTimeout(() => navReal('/en'), 0); return '' }
  window.SITELOGO = Object.assign({}, window.SITELOGO || {}, v.type === 'CEX' && API.ST.viewLogo ? { [v.ex]: API.ST.viewLogo } : {});
  window.SITEW = v; S.auth = 's4';
  const sc = R.byId['home.wallet']; sc.shell = Object.assign({}, sc.shell, { moTitle: [v.ex, v.ex] });
  try { return renderInner('home.wallet:normal') } finally { window.SITEW = null }
}

// =====================================================================
// 캐시백 요약 (/en/rewardHistory) — 월 이동 · 날짜 선택 · 거래소/계정/유형 필터
// 표본 원장 = 전체 프로토타입 요약 상태값(CS1~CS4 · old). DEX 행은 회원의 연동 지갑에 붙인다. 기준일 = 표본의 오늘(2026-05-26)
// =====================================================================
const TODAY = { y: 2026, m: 4, d: 26 };
const SM = { y: 2026, m: 4, sel: 26, F: { ex: 'all', acc: null, ty: null }, D: null, open: null };
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const BASE = [
  ['2026-05-05', 'Bitget', 'claim', -15], ['2026-05-12', 'Bitget', 'claim', -11.8], ['2026-05-25', 'Bitget', 'ex', 25], ['2026-05-25', 'EdgeX', 'pending'],
  ['2026-05-26', 'Bitget', 'ex', 25], ['2026-05-26', 'Lighter', 'ex', 12.4], ['2026-05-26', 'Bitget', 'claim', -20],
  ['2026-04-20', 'Bitget', 'ev', 50, 'BTC Prediction Reward'], ['2026-04-20', 'Bitget', 'ev', 50, 'Cashback Challenge Reward'], ['2026-04-20', 'EdgeX', 'ev', 50, 'Cashback Challenge Reward'],
  ['2025-10-14', 'Bitget', 'ex', 8.2], ['2025-10-21', 'Bitget', 'ex', 3.1]];
function sumAccounts() {
  const acc = [{ key: 'Bitget|******7462', ex: 'Bitget', type: 'CEX', id: '******7462' }];
  API.ST.accounts.filter(a => a.st !== 'pend' && a.st !== 'own').forEach(a => acc.push({ key: a.ex + '|' + a.id, ex: a.ex, type: a.type, id: a.id }));
  return acc;
}
function ledger() {
  const acc = sumAccounts();
  return BASE.map(([d, ex, k, v, name]) => { const a = acc.find(x => x.ex === ex); if (!a) return null; return { d, a, k, v, name } }).filter(Boolean);
}
const sgn = v => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(2);
const tyKey = r => r.k === 'ev' ? 'ev' : r.k === 'claim' ? 'claim' : 'ex';
function applied(r, F) {
  if (F.ex === 'cex' && r.a.type !== 'CEX') return false;
  if (F.ex === 'dex' && r.a.type !== 'DEX') return false;
  if (!['all', 'cex', 'dex'].includes(F.ex) && r.a.ex !== F.ex) return false;
  if (F.acc && !F.acc.has(r.a.key)) return false;
  if (F.ty && r.k !== 'pending' && !F.ty.has(tyKey(r))) return false;
  return true;
}
function sumData() {
  const F = SM.F, pre = `${SM.y}-${String(SM.m + 1).padStart(2, '0')}-`;
  const rows = ledger().filter(r => r.d.startsWith(pre) && applied(r, F));
  const days = {}; let rec = 0, wd = 0;
  rows.forEach(r => { const n = +r.d.slice(8); if (r.k === 'pending') { (days[n] = days[n] || { v: 0, p: 0, any: 0 }).p = 1; return } const o = days[n] = days[n] || { v: 0, p: 0, any: 0 }; o.v += r.v; o.any = 1; if (r.v > 0) rec += r.v; else wd += r.v });
  const dm = {}; Object.entries(days).forEach(([n, o]) => { dm[n] = []; if (o.any) dm[n].push(sgn(Math.round(o.v * 100) / 100)); if (o.p) dm[n].push('P') });
  const isCur = SM.y === TODAY.y && SM.m === TODAY.m;
  const TY = SUMX.TY;
  const dayRows = rows.filter(r => +r.d.slice(8) === SM.sel).map(r => ({ p: r.a.ex, w: r.a.type === 'DEX' ? r.a.id : null, id: r.a.type === 'CEX' ? 'UID ' + r.a.id : null, t: r.k === 'pending' ? 'DEX data pending' : r.k === 'ex' ? TY.ex() : r.k === 'claim' ? TY.claim() : r.name, v: r.k === 'pending' ? '—' : sgn(r.v), pending: r.k === 'pending' }));
  const any = rows.some(r => r.k !== 'pending');
  const acct = F.acc && F.acc.size === 1 && !ledger().some(r => F.acc.has(r.a.key));
  return { month: `${MON[SM.m]} ${SM.y}`, y: SM.y, m: SM.m, isCur, today: TODAY.d, sel: SM.sel, days: dm, card: any ? [sgn(rec), sgn(wd).replace('+', wd === 0 ? '' : '+'), sgn(rec + wd)] : null, rows: dayRows, acct };
}
function withSum(f) { window.SITES = { data: sumData, filters: sumFilters }; try { return f() } finally { window.SITES = null } }
function exOpts() {
  const acc = sumAccounts(), by = {}; acc.forEach(a => { (by[a.ex] = by[a.ex] || { n: 0, type: a.type }).n++ });
  const o = [['h', T('Range', '범위')], ['all', T('All', '전체')], ['cex', 'CEX 전체'], ['dex', 'DEX 전체'], ['h', 'CEX']];
  Object.entries(by).filter(([, v]) => v.type === 'CEX').forEach(([k, v]) => o.push([k, `${k} (${v.n} ${v.n === 1 ? 'UID' : 'UIDs'})`]));
  o.push(['h', 'DEX']);
  Object.entries(by).filter(([, v]) => v.type === 'DEX').forEach(([k, v]) => o.push([k, T(`${k} (${v.n} ${v.n === 1 ? 'wallet' : 'wallets'})`, `${k} (${v.n} 지갑)`)]));
  return o;
}
const accLabel = a => a.type === 'CEX' ? `${a.ex} UID ${a.id}` : `${a.ex} Wallet ${short(a.id)}`;
const TYS = [['ex', () => T('Exchange Cashback', '캐시백')], ['ev', () => T('Event Reward', '이벤트 리워드')], ['claim', () => T('Claim Amount', '출금 금액')]];
function sumFilters() {
  const D = SM.D || (SM.D = { ex: SM.F.ex, acc: SM.F.acc ? new Set(SM.F.acc) : null, ty: SM.F.ty ? new Set(SM.F.ty) : null });
  const { sel, menu, mItem, logo } = SUMX;
  const exL = (exOpts().find(o => o[0] === D.ex) || [0, T('All Exchanges', '모든 거래소')])[1];
  const accs = sumAccounts();
  const acL = !D.acc ? T('All Accounts', '모든 거래 계정') : D.acc.size === 1 ? accLabel(accs.find(a => D.acc.has(a.key)) || accs[0]) : `${D.acc.size} accounts`;
  const tyL = !D.ty ? T('All Types', '모든 캐시백 유형') : TYS.filter(([k]) => D.ty.has(k)).map(([, f]) => f()).join(', ');
  const wrap = (k, inner) => `<div data-sm-sel="${k}" style="position:relative">${inner}</div>`;
  let ex = sel(D.ex === 'all' ? T('All Exchanges', '모든 거래소') : exL, { focus: SM.open === 'ex' }), ac = sel(acL, { focus: SM.open === 'acc' }), ty = sel(tyL, { focus: SM.open === 'ty' });
  if (SM.open === 'ex') ex += menu(exOpts().map(([k, l]) => k === 'h' ? mItem(l, false, { h: 1 }) : `<div data-sm-ex="${esc(k)}" style="cursor:pointer">${mItem(l, false, { sel: D.ex === k })}</div>`).join(''));
  if (SM.open === 'acc') ac += menu([`<div data-sm-acc="*" style="cursor:pointer">${mItem(T('All Accounts', '모든 거래 계정'), !D.acc, { box: 1 })}</div>`].concat(accs.map(a => `<div data-sm-acc="${esc(a.key)}" style="cursor:pointer">${mItem(accLabel(a), !!(D.acc && D.acc.has(a.key)), { box: 1, logo: logo(a.ex, 20) })}</div>`)).join(''));
  if (SM.open === 'ty') ty += menu([`<div data-sm-ty="*" style="cursor:pointer">${mItem(T('All Types', '모든 캐시백 유형'), !D.ty, { box: 1 })}</div>`].concat(TYS.map(([k, f]) => `<div data-sm-ty="${k}" style="cursor:pointer">${mItem(f(), !!(D.ty && D.ty.has(k)), { box: 1 })}</div>`)).join(''));
  const dirty = D.ex !== 'all' || D.acc || D.ty || SM.F.ex !== 'all' || SM.F.acc || SM.F.ty;
  const btns = `<div class="row" style="gap:8px"><button class="btn contained black md" data-sm-reset ${dirty ? '' : 'disabled'} style="width:87px;height:42px">${T('Reset', '재설정')}</button><button class="btn contained primary md grow" data-sm-search style="height:42px">${T('Search', '검색')}</button></div>`;
  return `<div class="col" style="gap:16px">${wrap('ex', ex)}${wrap('acc', ac)}${wrap('ty', ty)}${btns}</div>`;
}
function sumEnhance() {
  $$('[data-sm-sel] .menu, [data-sm-sel] > div + div', app).forEach(m => { m.style.position = 'absolute'; m.style.left = 0; m.style.right = 0; m.style.zIndex = 30; m.classList.add('site-fade') });
}
function sumRerender() { renderPage({ keepScroll: true }) }
document.addEventListener('click', e => {
  if (API.route.path !== '/summary') return;
  const t = e.target; if (!t.closest) return;
  const hit = s => t.closest(s);
  const stop = () => { e.preventDefault(); e.stopPropagation() };
  const D = SM.D || {};
  let x;
  if ((x = hit('[data-sm-ex]'))) { stop(); D.ex = x.dataset.smEx; SM.open = null; return sumRerender() }
  if ((x = hit('[data-sm-acc]'))) { stop(); const k = x.dataset.smAcc; if (k === '*') D.acc = null; else { D.acc = D.acc || new Set(); D.acc.has(k) ? D.acc.delete(k) : D.acc.add(k); if (!D.acc.size) D.acc = null } return sumRerender() }
  if ((x = hit('[data-sm-ty]'))) { stop(); const k = x.dataset.smTy; if (k === '*') D.ty = null; else { D.ty = D.ty || new Set(); D.ty.has(k) ? D.ty.delete(k) : D.ty.add(k); if (!D.ty.size || D.ty.size === TYS.length) D.ty = null } return sumRerender() }
  if ((x = hit('[data-sm-sel]'))) { stop(); SM.open = SM.open === x.dataset.smSel ? null : x.dataset.smSel; return sumRerender() }
  if (hit('[data-sm-search]')) { stop(); SM.F = { ex: D.ex, acc: D.acc ? new Set(D.acc) : null, ty: D.ty ? new Set(D.ty) : null }; SM.open = null; return sumRerender() }
  if (hit('[data-sm-reset]')) { stop(); SM.F = { ex: 'all', acc: null, ty: null }; SM.D = null; SM.open = null; return sumRerender() }
  if (hit('[data-sm-prev]') || hit('[data-sm-next]')) {
    stop(); const k = hit('[data-sm-prev]') ? -1 : 1; let y = SM.y, m = SM.m + k; if (m < 0) { m = 11; y-- } if (m > 11) { m = 0; y++ }
    if (y * 12 + m > TODAY.y * 12 + TODAY.m) return; SM.y = y; SM.m = m; SM.sel = y === TODAY.y && m === TODAY.m ? TODAY.d : 1; SM.open = null; return sumRerender();
  }
  if ((x = hit('[data-sm-month]'))) {
    stop(); const old = $('.site-monthpop'); if (old) return old.remove();
    const pop = document.createElement('div'); pop.className = 'site-pop site-monthpop';
    const opts = []; for (let i = 0; i < 8; i++) { let y = TODAY.y, m = TODAY.m - i; while (m < 0) { m += 12; y-- } opts.push([y, m]) }
    pop.innerHTML = opts.map(([y, m]) => `<button type="button" data-ym="${y}-${m}" class="${y === SM.y && m === SM.m ? 'on' : ''}">${MON[m]} ${y}</button>`).join('');
    x.appendChild(pop); requestAnimationFrame(() => pop.classList.add('in'));
    pop.onclick = ev => { const bt = ev.target.closest('[data-ym]'); if (!bt) return; ev.stopPropagation(); const [y, m] = bt.dataset.ym.split('-').map(Number); SM.y = y; SM.m = m; SM.sel = y === TODAY.y && m === TODAY.m ? TODAY.d : 1; sumRerender() };
    return;
  }
  if ((x = hit('[data-day]'))) { const n = +x.dataset.day; if (SM.y === TODAY.y && SM.m === TODAY.m && n > TODAY.d) return; stop(); SM.sel = n; return sumRerender() }
  if (SM.open && !hit('[data-sm-sel]')) { SM.open = null; sumRerender() }
}, true);

// =====================================================================
// 소유권 인증 — 결과 `Verify Ownership` → 가이드 3단계 → 업로드(1GB 한도 · 진행률) → 제출 확인 → 홈 「Verifying ownership」
// =====================================================================
const SO = { step: 0, file: null };
const MAX = 1024 * 1024 * 1024;   // 1GB(결정: 현행)
const mb = n => n >= 1024 * 1024 * 1024 ? (n / 1073741824).toFixed(1) + ' GB' : (n / 1048576).toFixed(1) + ' MB';
function ownCtx() { const o = API.ST.own || { ex: 'Lighter', type: 'DEX', id: '0x7a3f9C2B41dE8806f5a1b3C9E4d2f07a6b8C51e9' }; OWNX.setOwn(o.ex, o.type === 'CEX' ? 'UID ' + o.id : short(o.id)); return o }
function ownHTML() {
  ownCtx(); S.auth = 's4';
  const st = SO.file ? 'uploaded' : ['normal', 's2', 's3'][SO.step];
  return renderInner('own.verify:' + st);
}
function ownEnhance() {
  if (SO.file) $$('span', app).forEach(sp => { if (sp.textContent.trim() === 'lighter-ownership.mp4') sp.textContent = SO.file.name; if (/^3\.2 MB/.test(sp.textContent.trim()) && sp.children.length) sp.firstChild.textContent = mb(SO.file.size) });
  if (!SO.file) { const dots = $('img[src*="own-mo-step"]', app); }
}
function ownDialog(st) {
  window.SITEO_DLG = 1;
  try { return R.byId['own.verify'].render(st, { asBg: false, state: {} }) } finally { window.SITEO_DLG = 0 }
}
function pickFile() {
  const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'video/mp4,video/quicktime,.mp4,.mov'; inp.style.display = 'none';
  document.body.appendChild(inp);
  inp.onchange = () => { const f = inp.files[0]; inp.remove(); if (f) upload(f) };
  inp.click();
}
window.SITE_UPLOAD = f => upload(f);    // 자동 검증용
function upload(f) {
  const okType = /\.(mp4|mov)$/i.test(f.name) || /^video\/(mp4|quicktime)$/.test(f.type);
  if (!okType || f.size > MAX) return openCustom(() => ownDialog('failed'), 'center');
  const dur = Math.min(3000, 900 + f.size / 1048576 * 8);
  openCustom(() => ownDialog('uploading'), 'center', {
    bind(box) {
      const sub = $$('div', box).find(d => d.textContent.trim() === T('Do not close this window.')); if (sub) sub.removeAttribute('data-go');
      const bar = document.createElement('div'); bar.className = 'site-prog'; bar.innerHTML = '<i></i><span>0%</span>';
      (sub || box.firstElementChild).after(bar);
      const t0 = performance.now(); L.busy = true;
      const tick = () => {
        const k = Math.min(1, (performance.now() - t0) / dur); $('i', bar).style.width = (k * 100) + '%'; $('span', bar).textContent = Math.floor(k * 100) + '%';
        if (k < 1) return requestAnimationFrame(tick);
        L.busy = false; SO.file = { name: f.name, size: f.size }; closeLayer(); setTimeout(() => renderPage({ keepScroll: true }), 210);
      };
      requestAnimationFrame(tick);
    }
  });
}
function ownGo(st, inLayer) {
  // 연동 결과(타인 사용 중) → 인증 화면. 신청 대상 = 방금 시도한 거래소·주소
  if (inLayer && L.step === 'result') {
    API.ST.own = { ex: L.ex, type: L.type, id: (L.val || '').trim() }; API.persist();
    SO.step = 0; SO.file = null;
    API.L.busy = false; go2('/ownership'); return true;
  }
  if (API.route.path !== '/ownership') { SO.step = 0; SO.file = null; go2('/ownership'); return true }
  if (st === 'uploading') { if (L.open) closeLayer(); pickFile(); return true }
  if (st === 'confirm') { openCustom(() => ownDialog('confirm'), 'center'); return true }
  if (st === 'uploaded') { closeLayer(); return true }
  if (st === 's3' && SO.file) { SO.file = null; renderPage({ keepScroll: true }); return true }   // 파일 제거(×) · 업로드 실패 OK
  if (['normal', 's2', 's3'].includes(st)) { if (L.open) closeLayer(); SO.step = { normal: 0, s2: 1, s3: 2 }[st]; renderPage({ keepScroll: true }); const g = $$('img', app).find(i => /own-guide/.test(i.src)); if (g) fadeIn(g.parentElement.parentElement); return true }
  return true;
}
let submitting = false;
function ownHomeGo(st) {
  if (st === 'review') {
    if (submitting) return true; submitting = true;           // 연타해도 1건(REQ-727)
    const o = API.ST.own; const accs = API.ST.accounts;
    const ex = accs.find(a => a.ex === o.ex && a.id.toLowerCase() === o.id.toLowerCase());
    if (ex) ex.st = 'own'; else accs.push({ ex: o.ex, type: o.type, id: o.id, a: 0, b: 0, st: 'own', ts: Date.now() });
    API.ST.justLinked = o.id; API.ST.justKind = 'own'; API.persist(); post({ dexChanged: 1 });
    SO.file = null; SO.step = 0;
    setTimeout(() => { submitting = false }, 1500);
    closeLayer(true);
    if (API.EMB) post({ dexHome: 1 }); else navReal('/en');
    return true;
  }
  return true;
}
// 테스트용 심사 결과(홈 도움말에서) — 승인: 연동 완료(금액 표시) · 거절: Ownership verification failed
function ownResult(r) {
  const o = API.ST.own || {}; OWNX.setOwn(o.ex || 'Lighter', o.type === 'CEX' ? 'UID ' + o.id : short(o.id || '0x0000000000'));
  window.SITEO_DLG = 1; let h;
  try { h = R.byId['own.home'].render(r === 'approved' ? 'approved' : 'rejected', { asBg: false, state: {} }) } finally { window.SITEO_DLG = 0 }
  openCustom(() => h, 'center');
}
})();
