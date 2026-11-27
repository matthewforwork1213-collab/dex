// ===== embed-boot.js — 화면 목록판에 실제 동작판 런타임(site-ui · site · site2)을 그대로 싣는다 =====
// 결정 12차(사용자 2026-11-27): 목록판의 허브 · DEX 랜딩 · DEX 상세 · 계산기 · 요약 · 소유권 화면은
// 실제 동작판과 같은 코드로 그리고 동작해야 한다(「실제 동작」 토글 방식 불가).
// 이 파일은 목록판 빌드(build.cjs)에만 들어간다. 동작판(dex/app.html)에는 없다.
(function () {
  'use strict';
  let on = false, saved = {}, vp = 'pc', cur = null;
  const appEl = document.createElement('div'); appEl.id = 'app';
  const hold = document.createElement('div'); hold.hidden = true; hold.appendChild(appEl);
  const layerEl = document.createElement('div'); layerEl.id = 'layer'; layerEl.className = 'site-layer';
  document.body.appendChild(hold); document.body.appendChild(layerEl);
  // 사이트 런타임이 바꾸는 전역(SITEH · SITEL …)은 목록판 정적 화면을 그릴 때 잠시 치운다
  const KEYS = ['SITEH', 'SITEL', 'SITED', 'SITES', 'SITEW', 'SITEA', 'SITEAF', 'SITELOGO', 'SITEO_DLG', 'DEXVOL'];
  // 목록판 화면 → 동작판 경로. 이 상태들만 동작판 코드로 그린다(나머지 상태 = Figma 상태 그림)
  const SLUG = ['edgex', 'aster', 'apex', 'lighter'];
  function target(id, st) {
    if (window.PT_NO_MOUNT) return null;   // tools/check.cjs(JSDOM 정적 렌더 점검)
    if (id === 'hub.main' && ['normal', 'member', 'dexPanel', 'cex', 'brokers', 'cards'].includes(st))
      return { path: '/hub', q: st === 'cex' ? { tab: 'CEX' } : st === 'brokers' ? { tab: 'Brokers' } : st === 'cards' ? { view: 'cards' } : {} };
    if (id === 'dex.overview' && ['normal', 'member'].includes(st)) return { path: '/dex', q: {} };
    if (id === 'dex.detail' && ['normal', 'edgex', 'unlinked', 'linked', 'aster', 'apex', 'lighter'].includes(st)) return { path: '/dex/' + (SLUG.includes(st) ? st : 'edgex'), q: {} };
    if (id === 'calc.p1' && st === 'normal') return { path: '/payback', q: {} };
    if (id === 'summary.main' && st === 'normal') return { path: '/summary', q: {} };
    if (id === 'own.verify' && st === 'normal') return { path: '/ownership', q: {} };
    return null;
  }
  // 동작판 경로 → 목록판 화면(다른 화면이면 목록판이 이동)
  function keyOf(path, q) {
    q = q || {};
    if (path === '/hub') return 'hub.main:' + (q.tab === 'CEX' ? 'cex' : q.tab === 'Brokers' ? 'brokers' : q.view === 'cards' ? 'cards' : S.auth === 'guest' ? 'normal' : S.auth === 's3' ? 'member' : 'dexPanel');
    if (path === '/dex') return 'dex.overview:' + (S.auth === 'guest' ? 'normal' : 'member');
    const m = /^\/dex\/(edgex|aster|apex|lighter)$/.exec(path); if (m) return 'dex.detail:' + m[1];
    if (path === '/payback') return 'calc.p1:normal';
    if (path === '/summary') return 'summary.main:normal';
    if (path === '/ownership') return 'own.verify:normal';
    if (path === '/account') return 'home.wallet:normal';
    if (path === '/benefits') return 'benefits.list';
    const bd = /^\/benefits\/([a-z]+)$/.exec(path); if (bd) return 'benefits.detail:' + (window.BD_STATE ? BD_STATE(bd[1], q.st, S.auth !== 'guest') : 'uid-before');   // 혜택 상세(125-benefits.js)
    if (path === '/tp-intro') return 'tp.intro:normal';
    return null;
  }
  const API = () => window.SITE_API;
  window.PT_EMBED = {
    on: () => on,
    vp: () => vp,
    target,
    owns: el => !!(el && (appEl.contains(el) || layerEl.contains(el))),
    stash() { const k = {}; KEYS.forEach(n => { if (n in window) { k[n] = window[n]; try { delete window[n] } catch (e) { window[n] = undefined } } }); return k },
    unstash(k) { Object.keys(k).forEach(n => { window[n] = k[n] }) },
    // 목록판 공유 상태(로그인 · 뷰포트)를 사이트 런타임이 바꿔도 목록판 값으로 되돌린다
    // 사이트 런타임은 이 S(프록시)를 쓴다: 로그인·뷰포트·언어·디자인을 바꾸면 바꾸기 전 목록판 값을 기억했다가 restore()에서 되돌린다
    S: new Proxy(S, { set(t, k, v) { if (['auth', 'vp', 'lang', 'design'].includes(k) && !(k in saved)) saved[k] = t[k]; t[k] = v; return true } }),
    restore() { Object.keys(saved).forEach(k => { S[k] = saved[k] }); saved = {} },
    mount(frame, t) {
      this.restore(); vp = S.vp; cur = t;
      frame.innerHTML = ''; frame.appendChild(appEl);
      on = true; document.body.classList.add('site', 'pt-embed');
      try { API().mount(t.path, t.q, S.auth) } finally { this.restore() }
    },
    unmount() {
      if (!on) return; on = false; cur = null;
      try { API().closeNow() } catch (e) { }
      document.body.classList.remove('site', 'pt-embed', 'vp-mo', 'vp-pc'); document.documentElement.classList.remove('site-lock');
      if (appEl.parentNode !== hold) hold.appendChild(appEl);
      appEl.innerHTML = '';
    },
    go(key) { try { API().go(key) } finally { this.restore() } },
    route(path, q) {
      const k = keyOf(path, q); if (!k) return false;
      const id = k.split(':')[0];
      if (id === S.screen) { const st = k.split(':')[1]; if (st && st !== S.state && !/^(calc|own|summary)/.test(id)) { S.state = st; try { history.replaceState(null, '', '#' + S.screen + '/' + S.state) } catch (e) { } } return false }
      this.restore(); setTimeout(() => window.go(k), 0); return true;
    },
    nav(url) { this.restore(); setTimeout(() => window.PT_REAL_NAV ? PT_REAL_NAV(url) : window.open(url, '_blank', 'noopener'), 0) },
    // 사이트 런타임이 실을 때 다는 문서·창 이벤트는 이 화면이 열려 있고 그 안에서 일어난 것만 받는다
    wrapListeners(fn) {
      if (window.PT_NO_MOUNT) return;   // tools/check.cjs(JSDOM 정적 렌더 점검)에서는 런타임을 싣지 않는다 — JSDOM 메모리
      const orig = EventTarget.prototype.addEventListener;
      const scope = e => {
        if (!on) return false;
        if (/^(message|popstate|storage|hashchange)$/.test(e.type)) return false;
        const t = e.target; if (!t || !t.closest || t === document || t === window) return true;
        if (t.closest('#pt-bar,#pt-side')) return false;   // 도구줄·화면 목록은 목록판 것
        if (!/click|pointer|mouse|touch/.test(e.type)) return true;   // 키보드(Esc 등)·스크롤 = 화면이 열려 있으면 받음
        if (t.closest('#app,#layer,.ui-dd,.site-toast,.site-pop,.site-help,[data-ui-host]')) return true;
        return /^(click|pointerdown|mousedown|touchstart)$/.test(e.type) && !t.closest('button,a,[role=button]');   // 화면 바깥(회색 여백) 클릭 = 열린 드롭다운 닫기 등
      };
      EventTarget.prototype.addEventListener = function (type, h, o) {
        if ((this === document || this === window) && typeof h === 'function') { const g = function (e) { if (scope(e)) return h.call(this, e) }; return orig.call(this, type, g, o) }
        return orig.call(this, type, h, o);
      };
      try { fn() } finally { EventTarget.prototype.addEventListener = orig }
    }
  };
})();
