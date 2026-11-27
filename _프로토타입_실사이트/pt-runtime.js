// 페이지 안 런타임: 실제 로직 없이 클릭을 프로토타입 동작으로 바꾼다
// 이동·상태·오버레이는 수집한 결과(PT.acts)대로, 그 밖의 버튼은 「정상 처리」로 간주한다
(function () {
  var PT = window.PT || {}, ORIGIN = 'https://tethermax.io';
  var post = function (m) { m.pt = 1; parent.postMessage(m, '*'); };
  var PAGE = '/' + (PT.key || '').replace(/__/g, '/');

  // 모션 토큰 — 05.리포트/모션명세_DEX.md(라이브 측정): 팝업 220ms · 드로어 280ms · 내용 교체 300ms, 움직임 줄이기면 생략
  var MT = { modal: 220, drawer: 280, std: 300, io: 'cubic-bezier(.42,0,.58,1)' };
  var RMQ = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)');
  function reduced() { return !!(RMQ && RMQ.matches) }
  function anim(el, kf, d) { if (!el || reduced() || !el.animate) return null; try { return el.animate(kf, { duration: d, easing: MT.io, fill: 'both' }) } catch (x) { return null } }
  function toast(t) {
    var el = document.createElement('div');
    el.textContent = t;
    el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:2147483647;background:rgba(17,19,24,.92);color:#fff;font:13px/1.4 system-ui,sans-serif;padding:10px 16px;border-radius:8px;max-width:86vw;box-shadow:0 4px 16px rgba(0,0,0,.25);pointer-events:none';
    document.body.appendChild(el);
    anim(el, [{ opacity: 0, transform: 'translate(-50%,30px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], MT.modal);
    setTimeout(function () { var a = anim(el, [{ opacity: 1 }, { opacity: 0 }], MT.modal); if (a) a.onfinish = function () { el.remove() }; else el.remove() }, 2200);
  }
  function label(el) { return ((el && (el.innerText || el.getAttribute('aria-label') || el.value)) || '').trim().replace(/\s+/g, ' ').slice(0, 40) }

  // ---- 「정상 처리」 규칙
  function generic(btn) {
    var l = label(btn);
    var byLabel = (PT.acts || {})['label:' + l];                 // 메뉴 항목 등 표식 없는 요소는 라벨로 찾는다
    if (byLabel) {
      if (byLabel.type === 'state') return byLabel.key && byLabel.key !== PT.key ? post({ go: byLabel.key, state: byLabel.snap.split('.').pop() }) : post({ state: byLabel.snap.split('.').pop() });
      if (byLabel.type === 'nav') return nav(byLabel.url);
      if (byLabel.type === 'overlay') return openFrag(PT.auth + '__' + byLabel.frag);
    }
    if (/\/login$/.test(PAGE) && /log ?in|sign ?in|continue|next|^ok$/i.test(l)) { post({ auth: 'member', nav: ORIGIN + '/en', toast: '로그인 완료 (프로토타입)' }); return }
    if (/\/signup$/.test(PAGE) && /sign ?up|join|next|continue|verify|send|confirm|submit|create/i.test(l)) { post({ auth: 'member', nav: ORIGIN + '/en', toast: '가입 완료 (프로토타입)' }); return }
    if (l === 'Link UID') return dexLink();   // DEX 연결: 같은 연동 모달
    if (/log ?out|sign ?out/i.test(l)) { post({ auth: 'guest', nav: ORIGIN + '/en', toast: '로그아웃 (프로토타입)' }); return }
    toast(l ? '「' + l + '」 처리됨 (프로토타입)' : '처리됨 (프로토타입)');
  }

  // ---- 오버레이(모달·메뉴) 조각
  var frags = {};
  window.PT_FRAG = function (id, p) { frags[id] = p; show(id) };
  function openFrag(id) {
    if (frags[id]) return show(id);
    var s = document.createElement('script'); s.src = '../frags/' + id + '.js';
    s.onerror = function () { toast('오버레이 파일 없음: ' + id) };
    document.head.appendChild(s);
  }
  function show(id) {
    closeLayers(true);
    var p = frags[id];
    var st = document.createElement('style'); st.setAttribute('data-pt-layer', id); st.textContent = p.css; document.head.appendChild(st);
    var box = document.createElement('div'); box.className = 'pt-layer'; box.setAttribute('data-pt-layer', id); box.innerHTML = p.html;
    document.body.appendChild(box);
    layerIn(box);
    scrollLock(true);
    post({ layer: id });
  }
  function layerIn(box) {
    var side = box.querySelector('[class*="SideMenu"]');
    if (side) return anim(side, [{ transform: 'translateX(100%)' }, { transform: 'none' }], MT.drawer);
    anim(box, [{ opacity: 0 }, { opacity: 1 }], MT.modal);
    var pop = box.querySelector('[class*="CenterPopup"],[class*="Popup"]:not([class*="PopupManager"]),[role=dialog],[class*="Modal"]');
    if (pop) anim(pop, [{ transform: 'translateY(30px)' }, { transform: 'none' }], MT.modal);
  }
  // 닫기: 열 때의 반대(팝업 위로 30px + 페이드 · 드로어 오른쪽으로). now = 다른 레이어로 바로 바꿀 때
  function closeLayers(now) {
    document.querySelectorAll('[data-pt-layer]').forEach(function (e) {
      if (now || e.tagName === 'STYLE' || reduced()) return e.remove();
      if (e._closing) return; e._closing = 1; e.style.pointerEvents = 'none';
      var side = e.querySelector('[class*="SideMenu"]');
      var a = side ? anim(side, [{ transform: 'none' }, { transform: 'translateX(100%)' }], MT.drawer) : anim(e, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-30px)' }], MT.modal);
      var st = document.querySelector('style[data-pt-layer="' + e.getAttribute('data-pt-layer') + '"]');
      var done = function () { e.remove(); if (st) st.remove() };
      if (a) a.onfinish = done; else done();
    });
    scrollLock(false); post({ layer: '' });
  }
  // 스크롤 잠금: 모달·메뉴·드로어 조각이 열렸을 때만(실사이트 MUI Modal = body overflow hidden)
  function scrollLock(on) { document.documentElement.style.overflow = on ? 'hidden' : '' }
  function onLayerClick(e, layer) {
    var t = e.target;
    var a = t.closest('a[href]');
    var b = t.closest('button,[role=button],[role=menuitem],[role=option],li[tabindex]');
    e.preventDefault(); e.stopPropagation();
    if (a) { closeLayers(); return nav(a.getAttribute('data-orig-href') || a.href) }
    if (b) {
      var l = label(b);
      if (b.hasAttribute('data-pt-act')) { closeLayers(); return rowAct(b.getAttribute('data-pt-act')) }
      if (enh(t, b, true)) return;
      closeLayers();
      if (!l || /close|cancel|dismiss|^x$|×|back/i.test(l) || /close/i.test(b.getAttribute('aria-label') || '')) return;
      if (l === 'English') return;                       // 언어 메뉴: 지금 언어 — 닫기만
      if (LANG[l]) {                                     // 다른 언어 → 실사이트는 /{코드}/같은 경로(라이브 측정). 영문만 수집 → 셸이 「수집되지 않은 페이지」 안내
        var alt = document.querySelector('link[rel=alternate][hreflang="' + LANG[l] + '"]');
        return post({ nav: alt ? alt.href : ORIGIN + '/' + LANG[l] + PAGE.replace(/^\/en/, ''), lang: 1 });
      }
      return generic(b);
    }
    if (enh(t, null, true)) return;
    // 바깥(배경) 클릭 → 닫기
    var cls = typeof t.className === 'string' ? t.className : '';
    if (/backdrop|overlay|dimm?/i.test(cls) || t === layer || t.parentElement === layer) closeLayers();
  }

  function nav(h) {
    if (!h || h.charAt(0) === '#') return;
    if (/^(mailto|tel|javascript):/i.test(h)) return toast(h.replace(/^\w+:/, ''));
    post({ nav: h });
  }

  // 비활성 버튼: 모양은 그대로 두고 클릭은 통과시킨다(브라우저는 disabled 버튼에 클릭을 보내지 않음)
  var st = document.createElement('style');
  st.textContent = 'button[disabled],button.Mui-disabled,[aria-disabled=true]{pointer-events:none!important}';
  document.head.appendChild(st);
  function disabledAt(x, y) {
    var list = document.querySelectorAll('button[disabled],button.Mui-disabled,[aria-disabled=true]');
    for (var i = list.length - 1; i >= 0; i--) {
      var r = list[i].getBoundingClientRect();
      if (r.width && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return list[i];
    }
    return null;
  }

  function navDrop(btn) { var d = btn.nextElementSibling; return d && /__Dropdown/.test(d.className) ? d : null }
  function navSet(btn, open) {
    var d = navDrop(btn); if (!d) return;
    var oc = btn.className.match(/(\S+__)NavMenu/), cls = oc ? oc[1] + 'open' : null;
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (cls) { btn.classList.toggle(cls, open); var ar = btn.querySelector('[class*="__NavArrow"]'); if (ar) ar.classList.toggle(cls, open) }
    d.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (open) d.removeAttribute('inert'); else d.setAttribute('inert', '');
    // 실사이트(라이브 측정): 높이·투명도 약 .2s 애니메이션 후 height:auto, 닫힘은 반대로 — 같은 값으로 맞춘다
    clearTimeout(d._ptT); d.style.transition = 'height .2s cubic-bezier(.65,0,.35,1), opacity .2s cubic-bezier(.65,0,.35,1)'; d.style.overflow = 'hidden';
    if (open) { d.style.visibility = 'visible'; var h = d.scrollHeight; d.style.height = d.getBoundingClientRect().height + 'px'; void d.offsetHeight; d.style.height = h + 'px'; d.style.opacity = '1'; d._ptT = setTimeout(function () { d.style.height = 'auto' }, 210) }
    else { d.style.height = d.getBoundingClientRect().height + 'px'; void d.offsetHeight; d.style.height = '0px'; d.style.opacity = '0'; d._ptT = setTimeout(function () { d.style.visibility = 'hidden' }, 210) }
  }
  // 실사이트: 마우스를 올리면 펼침 · 벗어나면 접힘. 프로토타입: 클릭하면 펼친 채 유지(다시 클릭 · 바깥 클릭 · Esc로 닫힘)
  var navPin = null, navHover = null, navOutT = null;
  function navClose(except) { if (navPin && navPin !== except) navPin = null; document.querySelectorAll('[class*="__NavMenu"][aria-expanded="true"]').forEach(function (x) { if (x !== except) navSet(x, false) }) }
  function navToggle(btn) {
    if (!navDrop(btn)) return false;
    if (navPin === btn) { navPin = null; navSet(btn, false); return true }
    navClose(btn); navSet(btn, true); navPin = btn; return true;
  }
  document.addEventListener('mouseover', function (e) {
    var g = e.target.closest && e.target.closest('[class*="__NavMenu"]');
    if (!g || !navDrop(g) || navPin === g) return;
    if (g.getAttribute('aria-expanded') === 'true') { if (!navPin) { navHover = g; clearTimeout(navOutT) } return }
    if (navPin) return;                                  // 다른 메뉴가 클릭으로 고정돼 있으면 hover로 바꾸지 않는다
    clearTimeout(navOutT); navClose(g); navSet(g, true); navHover = g;
  });
  document.addEventListener('mouseout', function (e) {
    if (!navHover || navPin === navHover) return;
    var to = e.relatedTarget; if (to && navHover.parentElement.contains(to)) return;
    var g = navHover; navHover = null; clearTimeout(navOutT);
    navOutT = setTimeout(function () { if (navPin !== g && navHover !== g) navSet(g, false) }, 200);   // 실사이트: 벗어난 뒤 약 .2s 뒤 접힘
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') navClose() });

  document.addEventListener('click', function (e) {
    var t = e.target;
    var dis = disabledAt(e.clientX, e.clientY);
    if (dis && dis.closest('[data-pt-form]')) { e.preventDefault(); e.stopPropagation(); return }   // 입력 폼: 실사이트처럼 조건을 채우기 전에는 눌리지 않음
    if (dis) { e.preventDefault(); e.stopPropagation(); return generic(dis) }
    var layer = t.closest && t.closest('.pt-layer');
    if (layer) return onLayerClick(e, layer);
    var se = t.closest && t.closest('button[type=submit]');
    if (se && se.form && se.form.querySelector('input[name="signup-email-input"]')) { e.preventDefault(); e.stopPropagation(); return emailGo(se.form) }
    if (t.closest('[class*="__LinkedFooter"]')) { e.preventDefault(); e.stopPropagation(); return dexLink() }   // DEX 연결
    if (t.closest('[class*="__SideButton"]')) { e.preventDefault(); e.stopPropagation(); return post({ dexLink: { mode: 'drawer' } }) }   // DEX 연결: 모바일 드로어(결정 D4 구성)
    if (t.closest('[data-dex-own]')) return;
    var lrow = PT.key === 'en' && PT.auth === 'member' && t.closest('[class*="__LinkedUidRow"]');
    var ban = PT.key === 'en' && PT.auth === 'member' && t.closest('[data-dex-ban]');
    if (ban) { e.preventDefault(); e.stopPropagation(); return rowBannerClick(ban.getAttribute('data-dex-ban')) }
    if (lrow) { e.preventDefault(); e.stopPropagation(); return dexRowOpen(lrow) }
    var nm = t.closest('[class*="__NavMenu"]');   // GNB 드롭다운(Cashback · Rewards Hub · Discover) — 모든 페이지·회원/게스트에서 펼침/접힘
    if (nm && navToggle(nm)) { e.preventDefault(); e.stopPropagation(); return }
    if (!t.closest('[class*="__Dropdown"]')) navClose();
    var b = t.closest('[data-pt-sig]');
    var a = t.closest('a[href]');
    if (b && !(a && b.contains(a))) {
      e.preventDefault(); e.stopPropagation();
      var sig = b.getAttribute('data-pt-sig'), x = (PT.acts || {})[sig];
      if (PT.stateSig && PT.stateSig === sig) return post({ state: '' });       // 같은 버튼 다시 → 닫힘
      if (!x || !/^(nav|state|overlay|ext)$/.test(x.type)) {                   // 수집 결과 없음 → 보완표(다른 뷰포트·같은 라벨) → 화면 동작 → 정상 처리
        var fb = fbAct(sig, label(b), b);
        if (fb && fb.type === 'state' && fb.key && fb.key !== PT.key) return post({ go: fb.key, state: fb.snap.split('.').pop() });
        if (fb) x = fb; else if (enh(t, b)) return; else return generic(b);
      }
      if (x.type === 'nav') return nav(x.url);
      if (x.type === 'state') return post({ state: x.snap.split('.').pop() });
      if (x.type === 'overlay' && /^Link your exchange UID/.test(x.text || '')) return dexLink();   // DEX 연결: 같은 연동 모달
      if (x.type === 'overlay' && /^Linked UIDs/.test(x.text || '')) return post({ dexLink: { mode: 'seeAll' } });   // DEX 연결: 결정 Q3 연동 계정 목록 모달
      if (x.type === 'overlay') return openFrag(PT.auth + '__' + x.frag);
      if (x.type === 'ext') return window.open(x.url, '_blank');
      return generic(b);
    }
    if (a) { e.preventDefault(); e.stopPropagation(); return nav(a.getAttribute('data-orig-href') || a.href) }
    var btn = t.closest('button,[role=button],input[type=submit]');
    if (btn && /^(checkbox|radio|range)$/.test((t.getAttribute && t.getAttribute('type')) || '')) btn = null;
    if (btn) { e.preventDefault(); e.stopPropagation(); if (enh(t, btn)) return; var fb2 = fbAct('', label(btn), btn); if (fb2) return runAct(fb2); return generic(btn) }
    for (var el = t, i = 0; el && el !== document.body && i < 5; el = el.parentElement, i++) {
      if ((PT.acts || {})['label:' + label(el)]) { e.preventDefault(); e.stopPropagation(); return generic(el) }
    }
    if (enh(t, null)) { e.preventDefault(); e.stopPropagation() }
  }, true);
  document.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = e.target; if (f.querySelector('input[name="signup-email-input"]')) return emailGo(f);
    if (f.hasAttribute('data-pt-form') && !formCheck(f, true)) return;   // 입력 폼: 조건 미충족이면 오류만 표시
    generic(f.querySelector('[type=submit],button') || f);
  }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLayers() });
  // 입력하면 같은 폼의 비활성 버튼을 살린다(실제 검증 로직이 없으므로)
  document.addEventListener('input', function (e) {
    if (e.target.closest && e.target.closest('[data-pt-form]')) return;
    var scope = e.target.closest('form') || e.target.closest('[role=dialog]') || document;
    scope.querySelectorAll('button[disabled],button.Mui-disabled').forEach(function (b) { b.removeAttribute('disabled'); b.removeAttribute('aria-disabled'); b.classList.remove('Mui-disabled') });
  }, true);
  window.addEventListener('message', function (e) {
    var m = e.data || {};
    if (m.dexRefresh) dexInject({ quiet: m.quiet });
    if (m.openFrag) openFrag(m.openFrag);
    if (m.closeLayers) closeLayers();
  });
  // 열림 애니메이션 시작 프레임이 떠진 경우(translateX(100%)·opacity 0) 끝 상태로 맞춘다 — 상태 스냅숏·오버레이에만
  function settleOpen(root) {
    root.querySelectorAll('[class*=Drawer],[class*=drawer],[class*=Backdrop],[class*=Modal],[class*=Dialog],[class*=Popover],[class*=Sheet],[class*=Popup]').forEach(function (el) {
      var s = el.getAttribute('style') || '';
      if (/transform:\s*translate[XY]?\(\s*-?100%/.test(s)) el.style.transform = 'none';
      if (/opacity:\s*0(\.0+)?\s*(;|$)/.test(s)) el.style.opacity = '1';
    });
  }
  var _show = show;
  show = function (id) { _show(id); var l = document.querySelector('.pt-layer'); if (l) { settleOpen(l); dexCopy(l); layerExName(l) } };
  document.addEventListener('DOMContentLoaded', function () {
    if (PT.stateSig) settleOpen(document);
    post({ loaded: PT.snap, title: document.title });
    scrollFree();
    dexInject({}); dexMenu(); dexCopy(); dexPartners(); notifyInit();
    exCalcInit(); stepsInit();
  });
  // 알림 목록(회원 헤더 벨 · 모바일 NotiBell) — 화면 목록판과 같은 모듈(_프로토타입_전체/src/135-notify.js)을 그대로 불러 쓴다(05.리포트/알림목록_정의.md)
  // 수집본의 벨은 수집 때 연 패널(실서비스 마케팅 푸시 목록)을 띄웠다 → 정의한 패널로 바꾼다. DEX 알림은 연동 계정(dex-state.js)에서 만든다
  function notifyInit() {
    if (PT.auth !== 'member' || !document.querySelector('[class*="__AlarmButton"],[class*="__NotiBell"]')) return;
    var load = function (src, f) { var s = document.createElement('script'); s.src = src; s.onload = f; document.head.appendChild(s) };
    var go = function (g, x) {
      var Sx = window.DEXSTATE, st = Sx && Sx.load(), a = st && x && x.acc && st.accounts.filter(function (y) { return y.id === x.acc.id && y.ex === x.acc.ex })[0];
      if (g === 'wallet' && a && (a.st === 'ok' || a.st === 'zero')) { st.view = { ex: a.ex, type: a.type, id: a.id, a: a.a || 0, b: a.b || null, st: a.st }; st.viewLogo = null; Sx.save(st); return post({ nav: ORIGIN + '/en/account' }) }   // 지갑 상세(홈 행과 같은 경로)
      post({ nav: ORIGIN + '/en' });
    };
    var start = function () { window.NOTIFY && NOTIFY.site({ accounts: function () { return window.DEXSTATE ? DEXSTATE.load().accounts : [] }, go: go }) };
    load('../../_프로토타입_전체/src/135-notify.js', function () { if (window.DEXSTATE) start(); else load('../dex/dex-state.js', start) });
  }
  // 보완표(pt-acts.js): 같은 요소의 다른 뷰포트 수집 결과 · 전 페이지에서 같은 라벨의 이동 대상
  (function () { var s = document.createElement('script'); s.src = '../pt-acts.js'; document.head.appendChild(s) })();

  // ================= 입력 폼 (실사이트 OutlinedFloatingInput — 라이브 측정 2026-11-27) =================
  // 포커스: Field + focused · floated / 벗어남: 값 있으면 floated, 검증 실패면 error + HelperText / 라벨 이동 .15s(수집 CSS)
  // 문구·조건은 라이브에서 틀린 값을 넣어 채집한 그대로. 제출 버튼은 조건을 채워야 활성(가입은 라이브에 Cloudflare 확인이 더 있음 — 프로토타입은 생략)
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var HELP_CLS = 'HelperText-module-scss-module__wLrqwq__HelperText HelperText-module-scss-module__wLrqwq__error';
  var EYE_OFF = '<svg viewBox="0 0 24 24" width="16" height="16" color="var(--action-disabled, rgba(0, 0, 0, 0.38))"><path d="m11.845 9.368 2.882 2.828v-.143a2.66 2.66 0 0 0-.799-1.898A2.75 2.75 0 0 0 12 9.368h-.155Zm-3.909.716 1.41 1.387a2.427 2.427 0 0 0-.073.582c0 .711.287 1.394.799 1.898a2.75 2.75 0 0 0 1.928.786c.2 0 .4-.027.59-.072L14 16.052a4.564 4.564 0 0 1-2 .474 4.583 4.583 0 0 1-3.214-1.31 4.438 4.438 0 0 1-1.331-3.163c0-.707.181-1.37.481-1.969ZM2.91 5.136 5.391 7.58C3.89 8.742 2.709 10.263 2 12.053c1.573 3.927 5.455 6.71 10 6.71 1.41 0 2.755-.268 3.982-.751l.39.375L19.028 21l1.155-1.136L4.064 4M12 7.579a4.58 4.58 0 0 1 3.214 1.31 4.438 4.438 0 0 1 1.332 3.164 4.24 4.24 0 0 1-.328 1.628l2.664 2.622A10.604 10.604 0 0 0 22 12.053c-1.573-3.928-5.454-6.71-10-6.71-1.273 0-2.49.223-3.636.625l1.972 1.924A4.654 4.654 0 0 1 12 7.58Z" fill="var(--action-disabled, rgba(0, 0, 0, 0.38))"></path></svg>';
  var EYE_ON = '<svg viewBox="0 0 24 24" width="16" height="16" color="var(--action-disabled, rgba(0, 0, 0, 0.38))"><path d="M12 5C7.455 5 3.573 7.903 2 12c1.573 4.097 5.455 7 10 7 4.546 0 8.427-2.903 10-7-1.573-4.097-5.454-7-10-7Zm0 11.667c-2.51 0-4.545-2.091-4.545-4.667 0-2.576 2.036-4.667 4.545-4.667 2.51 0 4.546 2.091 4.546 4.667 0 2.576-2.037 4.667-4.546 4.667ZM12 9.2c-1.51 0-2.727 1.25-2.727 2.8 0 1.55 1.218 2.8 2.727 2.8 1.51 0 2.727-1.25 2.727-2.8 0-1.55-1.218-2.8-2.727-2.8Z" fill="var(--action-disabled, rgba(0, 0, 0, 0.38))"></path></svg>';
  var CHK_ON = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="none" width="19" height="19"><path d="M15.8333 2.5H4.16667C3.24167 2.5 2.5 3.25 2.5 4.16667V15.8333C2.5 16.75 3.24167 17.5 4.16667 17.5H15.8333C16.7583 17.5 17.5 16.75 17.5 15.8333V4.16667C17.5 3.25 16.7583 2.5 15.8333 2.5Z" fill="var(--primary-blue-main, #2453F0)"></path><path d="M8.33333 14.1667L4.16667 10L5.34167 8.825L8.33333 11.8083L14.6583 5.48333L15.8333 6.66667L8.33333 14.1667Z" fill="#fff"></path></svg>';
  var CHK_OFF = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" width="15" height="15"><path d="M13.3333 1.66667V13.3333H1.66667V1.66667H13.3333ZM13.3333 0H1.66667C0.75 0 0 0.75 0 1.66667V13.3333C0 14.25 0.75 15 1.66667 15H13.3333C14.25 15 15 14.25 15 13.3333V1.66667C15 0.75 14.25 0 13.3333 0Z" fill="var(--checkbox-outline-color, rgba(255, 255, 255, 0.7))"></path></svg>';
  var DOT = '<svg fill="none" viewBox="0 0 16 16" width="16" height="16" color="var(--action-disabled, rgba(0, 0, 0, 0.38))" style="min-width: 16px; min-height: 16px; margin-top: 2px;"><circle cx="8" cy="8" r="3" fill="var(--action-disabled, rgba(0, 0, 0, 0.38))"></circle></svg>';
  var TICK = '<svg fill="none" viewBox="0 0 16 16" width="16" height="16" color="var(--success-main, #2e7d32)" style="min-width: 16px; min-height: 16px; margin-top: 2px;"><path d="M5.99911 10.7799L3.68578 8.46655C3.42578 8.20655 3.00578 8.20655 2.74578 8.46655C2.48578 8.72655 2.48578 9.14655 2.74578 9.40655L5.53245 12.1932C5.79245 12.4532 6.21245 12.4532 6.47245 12.1932L13.5258 5.13988C13.7858 4.87988 13.7858 4.45988 13.5258 4.19988C13.2658 3.93988 12.8458 3.93988 12.5858 4.19988L5.99911 10.7799Z" fill="var(--success-main, #2e7d32)"></path></svg>';
  var FORM = /\/(signup|login|resetpassword)$/.test(PAGE) ? PAGE.split('/').pop() : null;
  var PW_RULES = ['8-16 characters.', 'At least one number and special character (*!@#).'];
  var pwOk = function (v) { return [v.length >= 8 && v.length <= 16, /[0-9]/.test(v) && /[^A-Za-z0-9\s]/.test(v)] };
  function fieldOf(i) { return i.closest('[class*="__Field"]') }
  function fcls(fd, k) { var t = [].filter.call(fd.classList, function (c) { return /__Field$/.test(c) })[0]; return t ? t.replace(/Field$/, k) : k }
  // 이 필드의 오류 문구(통과면 null, 문구 없는 오류면 '') — 라이브 채집 문구
  function fieldErr(i) {
    var v = i.value, n = i.name;
    if (n === 'email') { if (FORM === 'resetpassword') return !v ? 'No email has been entered.' : EMAIL_RE.test(v) ? null : 'Enter a valid email address.'; return EMAIL_RE.test(v) ? null : 'Enter a valid email address' }
    if (n === 'password') { if (FORM === 'signup') return pwOk(v).every(Boolean) ? null : ''; return v.length >= 8 && v.length <= 16 ? null : '8-16 characters.' }
    if (n === 'invitecode') return !v || v.length >= 4 ? null : 'Enter at least 4 characters';
    return null;
  }
  function setErr(i, msg) {
    var fd = fieldOf(i), w = fd.parentElement, h = w.querySelector('[data-name="HelperText"]');
    fd.classList.toggle(fcls(fd, 'error'), msg != null);
    if (msg) { if (!h) { h = document.createElement('p'); h.className = HELP_CLS; h.setAttribute('data-name', 'HelperText'); w.appendChild(h) } h.textContent = msg }
    else if (h) h.remove();
  }
  function pwRules(i) {
    var g = i.closest('[class*="__PasswordGroup"]'); if (!g) return;
    var pre = [].filter.call(g.classList, function (c) { return /__PasswordGroup$/.test(c) })[0].replace(/PasswordGroup$/, ''), box = g.querySelector('[class*="__PasswordValidationResult"]');
    if (!box) { box = document.createElement('div'); box.className = pre + 'PasswordValidationResult'; box.innerHTML = PW_RULES.map(function (r) { return '<div class="' + pre + 'ValidationItem">' + DOT + '<p class="">' + r + '</p></div>' }).join(''); g.appendChild(box) }
    var ok = pwOk(i.value);
    [].forEach.call(box.children, function (it, j) { it.querySelector('svg').outerHTML = ok[j] ? TICK : DOT; it.querySelector('p').className = ok[j] ? pre + 'correspond' : '' });
  }
  function formCheck(f, show) {
    var ins = [].slice.call(f.querySelectorAll('input[name]:not([type=hidden])')), ok = ins.every(function (i) { return fieldErr(i) == null });
    var pol = f.querySelector('[class*="__PolicyButtonItem"]'); if (pol && pol.getAttribute('aria-pressed') !== 'true') ok = false;
    if (show) ins.forEach(function (i) { var m = fieldErr(i); if (m != null) setErr(i, m) });
    var sb = f.querySelector('button[type=submit]');
    if (sb) { sb.disabled = !ok; sb.classList.toggle('Mui-disabled', !ok); sb.setAttribute('tabindex', ok ? '0' : '-1') }
    return ok;
  }
  function formInit() {
    if (!FORM) return;
    document.querySelectorAll('form').forEach(function (f) { if (f.querySelector('[class*="OutlinedFloatingInput"]')) { f.setAttribute('data-pt-form', FORM); formCheck(f, false) } });
    // 랜딩·검색의 `Sign Up Now` 이메일 → 가입 화면 이메일 칸(실사이트 /en/signup?email=… — 채워진 값을 바로 검증)
    var pre = null; try { pre = sessionStorage.getItem('pt-signup-email'); sessionStorage.removeItem('pt-signup-email') } catch (x) { }
    var em = FORM === 'signup' && pre != null && document.querySelector('[data-pt-form] input[name=email]');
    if (em) { em.value = pre; em.setAttribute('value', pre); var fd = fieldOf(em); fd.classList.toggle(fcls(fd, 'floated'), !!pre); setErr(em, fieldErr(em)); formCheck(em.closest('form'), false) }
  }
  function emailGo(f) {
    var i = f.querySelector('input[name="signup-email-input"]');
    try { sessionStorage.setItem('pt-signup-email', i.value) } catch (x) { }
    nav(ORIGIN + '/en/signup?email=' + encodeURIComponent(i.value));
  }
  document.addEventListener('focusin', function (e) {
    var i = e.target; if (!i.matches || !i.matches('[data-pt-form] input')) return; var fd = fieldOf(i); if (!fd) return;
    fd.classList.add(fcls(fd, 'focused'), fcls(fd, 'floated'));
  });
  document.addEventListener('focusout', function (e) {
    var i = e.target; if (!i.matches || !i.matches('[data-pt-form] input')) return; var fd = fieldOf(i); if (!fd) return;
    fd.classList.remove(fcls(fd, 'focused')); fd.classList.toggle(fcls(fd, 'floated'), !!i.value);
    setErr(i, fieldErr(i));
    formCheck(i.closest('form'), false);
  });
  document.addEventListener('input', function (e) {
    var i = e.target; if (!i.matches || !i.matches('[data-pt-form] input')) return;
    i.setAttribute('value', i.value);
    if (i.name === 'password' && FORM === 'signup') pwRules(i);
    if (fieldOf(i) && fieldErr(i) == null) setErr(i, null);    // 라이브: 고쳐서 맞으면 바로 오류가 사라짐
    formCheck(i.closest('form'), false);
  }, true);
  document.addEventListener('click', function (e) {
    var f = e.target.closest && e.target.closest('[data-pt-form]'); if (!f) return;
    var tr = e.target.closest('[class*="__Trailing"]');
    if (tr) { e.preventDefault(); e.stopPropagation(); var i = tr.parentElement.querySelector('input'); var show = i.type === 'password'; i.type = show ? 'text' : 'password'; tr.innerHTML = show ? EYE_ON : EYE_OFF; i.focus(); return }
    var pol = e.target.closest('[class*="__PolicyButtonItem"]');
    if (pol) { e.preventDefault(); e.stopPropagation(); var on = pol.getAttribute('aria-pressed') !== 'true'; pol.setAttribute('aria-pressed', on ? 'true' : 'false'); pol.innerHTML = on ? CHK_ON : CHK_OFF; formCheck(f, false); return }
  }, true);
  document.addEventListener('DOMContentLoaded', formInit);

  // ---- 이메일 인증 모달(가입 `Continue` · 로그인 `Log in` 제출 뒤) — 라이브 화면 구성·문구 그대로
  // 제목 `Email Verification` · `We've sent a code to {입력한 이메일}` · X · 6칸 코드(자동 이동 · 백스페이스 이전 칸) · `Paste` · `Verify`(6자리 전 비활성) · `Resend code in 01:00`(0이 되면 `Resend code`)
  // 배경막·컨테이너는 수집본 PopupManager 클래스 재사용. 오류 원문을 몰라 어떤 6자리든 통과
  function otpOpen(email, done) {
    var old = document.getElementById('pt-otp'); if (old) old.remove();
    var mo = window.innerWidth <= 1024;
    var box = mo ? 'calc((100% - 40px) / 6)' : '64px';
    var w = document.createElement('div'); w.id = 'pt-otp';
    w.className = 'PopupManager-module-scss-module__xOdNVW__PopupContainer';
    w.style.cssText = 'position:fixed;inset:0;z-index:2147483600;display:flex;align-items:center;justify-content:center;opacity:0;transform:translateY(30px);transition:opacity .22s cubic-bezier(.42,0,.58,1),transform .22s cubic-bezier(.42,0,.58,1)';
    var esc = function (t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) };
    w.innerHTML = '<div class="PopupManager-module-scss-module__xOdNVW__Dimmed PopupManager-module-scss-module__xOdNVW__open" style="position:absolute;inset:0;background:rgba(0,0,0,.7)"></div>'
      + '<div role="dialog" aria-modal="true" aria-labelledby="pt-otp-t" class="MuiPaper-root MuiDialog-paper" style="position:relative;box-sizing:border-box;width:' + (mo ? 'calc(100% - 32px)' : '504px') + ';background:#fff;border-radius:8px;padding:' + (mo ? '24px 16px' : '32px') + ';box-shadow:0 11px 15px -7px rgba(0,0,0,.2),0 24px 38px 3px rgba(0,0,0,.14),0 9px 46px 8px rgba(0,0,0,.12);font-family:inherit;color:rgba(0,0,0,.87)">'
      + '<button type="button" data-otp="close" aria-label="close" style="position:absolute;right:' + (mo ? 12 : 20) + 'px;top:' + (mo ? 12 : 20) + 'px;width:40px;height:40px;border:0;background:transparent;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 24 24" width="24" height="24"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7A.996.996 0 1 0 5.7 7.11L10.59 12 5.7 16.89a.996.996 0 1 0 1.41 1.41L12 13.41l4.89 4.89a.996.996 0 1 0 1.41-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4" fill="rgba(0,0,0,.56)"/></svg></button>'
      + '<h2 id="pt-otp-t" style="margin:0 48px 8px 0;font-size:' + (mo ? 20 : 24) + 'px;line-height:1.33;font-weight:700">Email Verification</h2>'
      + '<p style="margin:0 0 24px;font-size:14px;line-height:1.43;color:rgba(0,0,0,.6);word-break:break-all">We\'ve sent a code to ' + esc(email) + '</p>'
      + '<div data-otp="cells" style="display:flex;gap:8px;justify-content:space-between">' + [0, 1, 2, 3, 4, 5].map(function (i) { return '<input data-otp-i="' + i + '" inputmode="numeric" autocomplete="one-time-code" maxlength="1" aria-label="Digit ' + (i + 1) + '" style="box-sizing:border-box;width:' + box + ';height:' + (mo ? 'auto' : '64px') + ';aspect-ratio:1;border:1px solid rgba(0,0,0,.23);border-radius:8px;text-align:center;font:inherit;font-size:24px;font-weight:600;outline:0;padding:0;transition:border-color .2s,box-shadow .2s">' }).join('') + '</div>'
      + '<div style="display:flex;justify-content:flex-end;margin-top:12px"><button type="button" data-otp="paste" style="border:0;background:transparent;padding:4px 0;color:#0031c6;font:inherit;font-size:14px;font-weight:600;cursor:pointer">Paste</button></div>'
      + '<button type="button" data-otp="verify" disabled style="margin-top:16px;width:100%;height:48px;border:0;border-radius:4px;font:inherit;font-size:15px;font-weight:600;cursor:pointer;transition:background-color .3s,color .3s">Verify</button>'
      + '<p data-otp="resend" style="margin:16px 0 0;text-align:center;font-size:14px;line-height:1.43;color:rgba(0,0,0,.6)"></p></div>';
    document.body.appendChild(w);
    requestAnimationFrame(function () { w.style.opacity = '1'; w.style.transform = 'none' });
    var cells = [].slice.call(w.querySelectorAll('[data-otp-i]')), vb = w.querySelector('[data-otp="verify"]'), rs = w.querySelector('[data-otp="resend"]');
    var paint = function () {
      var full = cells.every(function (c) { return /^\d$/.test(c.value) });
      vb.disabled = !full; vb.style.background = full ? '#0031c6' : 'rgba(0,0,0,.12)'; vb.style.color = full ? '#fff' : 'rgba(0,0,0,.38)'; vb.style.cursor = full ? 'pointer' : 'default';
      cells.forEach(function (c) { var f = document.activeElement === c; c.style.borderColor = f ? '#0031c6' : 'rgba(0,0,0,.23)'; c.style.boxShadow = f ? 'inset 0 0 0 1px #0031c6' : 'none' });
    };
    var fill = function (digits, from) { digits.split('').forEach(function (d, k) { if (cells[from + k]) cells[from + k].value = d }); var nx = cells[Math.min(5, from + digits.length)]; nx.focus(); paint() };
    cells.forEach(function (c, i) {
      c.addEventListener('input', function () {
        var d = c.value.replace(/\D/g, '');
        if (d.length > 1) return fill(d.slice(0, 6 - i), i);
        c.value = d; if (d && i < 5) cells[i + 1].focus(); paint();
      });
      c.addEventListener('keydown', function (e) {
        if (e.key === 'Backspace' && !c.value && i > 0) { e.preventDefault(); cells[i - 1].value = ''; cells[i - 1].focus(); paint() }
        if (e.key === 'ArrowLeft' && i > 0) cells[i - 1].focus();
        if (e.key === 'ArrowRight' && i < 5) cells[i + 1].focus();
        if (e.key === 'Enter' && !vb.disabled) vb.click();
      });
      c.addEventListener('paste', function (e) { var t = ((e.clipboardData || window.clipboardData).getData('text') || '').replace(/\D/g, ''); if (t) { e.preventDefault(); fill(t.slice(0, 6), 0) } });
      c.addEventListener('focus', paint); c.addEventListener('blur', function () { setTimeout(paint, 0) });
    });
    var left = 60, timer = null;
    var tick = function () {
      if (left > 0) { rs.innerHTML = 'Resend code in ' + '0' + Math.floor(left / 60) + ':' + ('0' + left % 60).slice(-2); left--; }
      else { clearInterval(timer); rs.innerHTML = '<button type="button" data-otp="again" style="border:0;background:transparent;padding:0;color:#0031c6;font:inherit;font-weight:600;cursor:pointer">Resend code</button>' }
    };
    var start = function () { left = 60; clearInterval(timer); tick(); timer = setInterval(tick, 1000) };
    start();
    var close = function () { clearInterval(timer); w.style.opacity = '0'; w.style.transform = 'translateY(-30px)'; setTimeout(function () { w.remove() }, 220) };
    // 모달 안 클릭은 수집본 런타임의 문서 클릭 처리(「처리됨」 토스트 등)보다 먼저 받는다
    var onClick = function (e) {
      if (!w.isConnected) return window.removeEventListener('click', onClick, true);
      if (!w.contains(e.target)) return;
      e.stopImmediatePropagation();
      var b = e.target.closest('[data-otp]'); if (!b) return;
      e.preventDefault();
      var k = b.getAttribute('data-otp');
      if (k === 'close') return close();
      if (k === 'again') return start();
      if (k === 'paste') {
        var put = function (t) { t = (t || '').replace(/\D/g, '').slice(0, 6); if (t) fill(t, 0); else cells[0].focus() };
        try { navigator.clipboard.readText().then(put, function () { cells[0].focus() }) } catch (x) { cells[0].focus() }
        return;
      }
      if (k === 'verify' && !b.disabled) { clearInterval(timer); w.remove(); window.removeEventListener('click', onClick, true); done() }
    };
    window.addEventListener('click', onClick, true);
    w.addEventListener('keydown', function (e) { if (e.key === 'Escape') close() });
    setTimeout(function () { cells[0].focus(); paint() }, 30);
  }
  window.PT_OTP = otpOpen;   // 자동 점검용
  // 가입 `Continue` · 로그인 `Log in` — 입력이 맞으면 이메일 인증 모달, `Verify` 뒤에 원래 처리(회원 전환 → 홈)
  function otpSubmit(e) {
    if (FORM !== 'signup' && FORM !== 'login') return;
    var f = e.target.closest && e.target.closest('[data-pt-form]'); if (!f) return;
    if (e.type === 'click' && !e.target.closest('button[type=submit]')) return;
    var sb = f.querySelector('button[type=submit]'); if (!sb || sb.disabled) return;
    if (!formCheck(f, true)) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var em = f.querySelector('input[name=email]');
    otpOpen(em ? em.value : '', function () {
      if (FORM === 'login') post({ auth: 'member', nav: ORIGIN + '/en', toast: '로그인 완료 (프로토타입)' });
      else post({ auth: 'member', nav: ORIGIN + '/en', toast: '가입 완료 (프로토타입)' });
    });
  }
  window.addEventListener('click', otpSubmit, true);
  window.addEventListener('submit', otpSubmit, true);

  // ================= 클릭 전수 점검 보완 (README 「클릭 전수 점검」) =================
  // 수집 HTML에 이미 들어 있는 마크업(접힌 답변·탭 대상 구역·숨은 단계 이미지)을 DOM으로 펼치고 옮긴다. 근거 없는 결과는 만들지 않는다
  var GOOD = /^(nav|state|overlay|ext)$/;
  var LANG = { '繁體中文': 'zh-Hant', 'Português': 'pt', '简体中文': 'zh-Hans', 'Español': 'es', '日本語': 'ja', 'Français': 'fr', 'Монгол': 'mn', 'Русский': 'ru', 'Oʻzbek': 'uz', 'العربية': 'ar', 'Bahasa Indonesia': 'id', 'Türkçe': 'tr', 'Tiếng Việt': 'vi' };
  var NOFB = /^(See All|Back|Terms & Conditions)$/;           // 페이지마다 대상이 다른 라벨은 라벨 보완표에서 뺀다
  function fbAct(sig, l, el) {
    var A = window.PT_ACTS; if (!A) return null;
    var s = sig && (A.sig[PT.auth + '|' + PT.key + '|' + PT.vp] || {})[sig];
    if (s) return s;
    if (el && el.closest('.pt-layer')) return null;
    if (l === 'Sign Up' && el && /__SignUpButton/.test(el.className)) l = 'Sign up';   // 모바일 헤더 = PC 헤더 `Sign up`
    if (!l || NOFB.test(l)) return null;
    return (A.label[PT.auth] || {})[l] || null;
  }
  function runAct(x) {
    if (x.type === 'nav') return nav(x.url);
    if (x.type === 'ext') return window.open(x.url, '_blank');
    if (x.type === 'state') return x.key && x.key !== PT.key ? post({ go: x.key, state: x.snap.split('.').pop() }) : post({ state: x.snap.split('.').pop() });
    if (x.type === 'overlay' && /^Linked UIDs/.test(x.text || '')) return post({ dexLink: { mode: 'seeAll' } });
    if (x.type === 'overlay' && /^Link your exchange UID/.test(x.text || '')) return dexLink();
    if (x.type === 'overlay') return openFrag(PT.auth + '__' + x.frag);
  }
  var clsOf = function (el, re) { return el ? [].filter.call(el.classList, function (c) { return re.test(c) })[0] : null };
  var sib = function (el, re) { var c = clsOf(el, re); return c ? [].slice.call(document.getElementsByClassName(c)) : [el] };
  // 같은 무리에서 `__active` 표식을 옮긴다(실사이트 클래스 그대로)
  function moveActive(list, i, holder) {
    var act = null; list.forEach(function (x) { var h = holder ? holder(x) : x; act = act || clsOf(h, /__active$|^active$/) });
    if (!act) { var m = clsOf(list[0], /__/); act = m ? m.replace(/__\w+$/, '__active') : 'active' }
    list.forEach(function (x, j) { var h = holder ? holder(x) : x; h.classList.toggle(act, j === i); if (h.hasAttribute('aria-current')) h.setAttribute('aria-current', j === i ? 'true' : 'false') });
  }
  function headerH() { var h = document.querySelector('header'); var r = h && h.getBoundingClientRect(); return r && r.bottom > 0 && r.top <= 0 ? r.height : 72 }
  function scrollToEl(el) { var y = el.getBoundingClientRect().top + window.scrollY - headerH() - 16; window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' }) }
  // 목차·앵커 탭·사이드바 → 같은 제목의 구역으로(실사이트 = 부드러운 스크롤 + 표식 이동)
  function findSection(l, btn, idx, n) {
    var hs = [].filter.call(document.querySelectorAll('h1,h2,h3,h4,[class*="Title"],[class*="Label"]'), function (h) { return !h.contains(btn) && !btn.contains(h) && !h.closest('header,nav,[class*="__Toc"],[class*="Sidebar"],[class*="AnchorTab"]') && (h.innerText || '').trim().replace(/\s+/g, ' ') === l });
    if (hs.length) return hs[0].closest('section') || hs[0];
    var secs = [].filter.call(document.querySelectorAll('main section[id], section[id], div[id^="section"]'), function (s) { return !s.contains(btn) && !/hero/i.test(s.id) });
    if (secs.length === n) return secs[idx];
    if (l === 'Key Takeaways') return document.getElementById('key-takeaways');
    var after = [].filter.call(document.querySelectorAll('section'), function (s) { return (btn.compareDocumentPosition(s) & 4) && clsOf(s, /__Section$/) });   // 탭 바 아래 구역(순서대로)
    return after.length >= n ? after[idx] : null;
  }
  function anchorNav(btn) {
    var list = sib(btn, /__(TocLabel|AnchorTab|SidebarItem)$/), i = list.indexOf(btn);
    var sec = findSection(label(btn), btn, i, list.length); if (!sec) return false;
    moveActive(list, i, /TocLabel/.test(btn.className) ? function (x) { return x.parentElement } : null);
    scrollToEl(sec); return true;
  }
  // 아코디언 — 접힌 패널(style height:0 · FooterCollapsed)이 수집 HTML 안에 있다. 실사이트 FAQ는 하나만 펼침(나머지 접힘), .3s
  function accPanel(item) {
    return item.querySelector(':scope > [style*="height: 0px"], :scope > [class*="__Answer"], :scope > [class*="Collapsed"], :scope > [class*="__FAQItemAnswer"], :scope > [class*="__AnswerWrap"]');
  }
  function accSet(panel, open) {
    if (/Collapsed/.test(panel.className) && !/height/.test(panel.getAttribute('style') || '')) { var c = clsOf(panel, /Collapsed$/) || panel.getAttribute('data-pt-col'); if (c) { panel.setAttribute('data-pt-col', c); panel.classList.toggle(c, !open) } panel.setAttribute('data-pt-open', open ? '1' : ''); return }
    var h0 = panel.scrollHeight;
    panel.style.transition = 'height .3s cubic-bezier(.65,0,.35,1), opacity .3s cubic-bezier(.65,0,.35,1)'; panel.style.overflow = 'hidden';
    if (open) { panel.style.height = '0px'; panel.style.opacity = '0'; void panel.offsetHeight; panel.style.height = h0 + 'px'; panel.style.opacity = '1'; setTimeout(function () { if (panel.style.opacity === '1') panel.style.height = 'auto' }, 320) }
    else { panel.style.height = panel.getBoundingClientRect().height + 'px'; void panel.offsetHeight; panel.style.height = '0px'; panel.style.opacity = '0' }
    panel.setAttribute('data-pt-open', open ? '1' : '');
  }
  function accordion(t) {
    for (var el = t, i = 0; el && el !== document.body && i < 6; el = el.parentElement, i++) {
      var item = el.parentElement; if (!item) break;
      var p = accPanel(item);
      if (p && p !== el && !p.contains(t)) {
        var was = p.getAttribute('data-pt-open'), isOpen = was === '1' || (was == null && !/height: 0px/.test(p.getAttribute('style') || '') && !/Collapsed/.test(p.className)), open = !isOpen;
        if (/HomeFAQSection|FAQ/i.test(item.className) && open) [].forEach.call(item.parentElement.children, function (o) { var q = o !== item && accPanel(o); if (q && q.getAttribute('data-pt-open') === '1') accSet(q, false) });
        accSet(p, open);
        var ic = item.querySelector('button svg, [class*="Arrow"] svg, [class*="Icon"] svg'); if (ic) { ic.style.transition = 'transform .3s'; ic.style.transform = open ? 'rotate(180deg)' : '' }
        return true;
      }
    }
    return false;
  }
  // 랜딩 3단계(HomeOnboarding): 단계 클릭 → 그 단계 이미지. 실사이트처럼 3초마다 다음 단계
  var stepsT = null;
  function stepsGo(i) {
    var items = sib(document.querySelector('[class*="__StepItem"]'), /__StepItem$/), imgs = sib(document.querySelector('[class*="__StepImage"]'), /__StepImage$/);
    if (!items.length) return; i = (i + items.length) % items.length;
    moveActive(items, i); moveActive(imgs, i); imgs.forEach(function (m, j) { m.setAttribute('aria-hidden', j === i ? 'false' : 'true') });
  }
  function stepsCur() { var items = sib(document.querySelector('[class*="__StepItem"]'), /__StepItem$/); for (var i = 0; i < items.length; i++) if (items[i].getAttribute('aria-current') === 'true' || /__active/.test(items[i].className)) return i; return 0 }
  function stepsInit() {
    if (!document.querySelector('[class*="HomeOnboarding"][class*="__StepItem"]') || window.PT_NOAUTO) return;
    clearInterval(stepsT); stepsT = setInterval(function () { stepsGo(stepsCur() + 1) }, 3000);
  }
  // 거래소 카드·행 → 그 거래소 상세(실사이트 랜딩 `Top Exchanges` 행 클릭 = /en/exchangeDetail/{slug}-referral)
  var EXCARD = '[class*="__ExchangeItem"][class*="__Clickable"], [class*="TopPopularExchanges"][class*="__Card"], [class*="__CashbackBoostItem"], [class*="__AllCard"]';
  function exSlug(card) {
    var n = card.querySelector('[class*="Name"]'), img = card.querySelector('img[alt]');
    var name = ((n && n.textContent) || (img && img.getAttribute('alt')) || '').trim();
    return name ? name.toLowerCase() : null;            // 실사이트 주소 그대로(`woo x pro-referral`)
  }
  // 거래소 상세 계산 — Taker/Maker · 거래량 슬라이더(실사이트 식: 거래량 = 100K × 100^(값/1000), 수수료 = 거래량 × 표의 요율)
  var EX = null;
  function pct(s) { return parseFloat(String(s).replace(/[^\d.]/g, '')) / 100 }
  function money(n) { return n >= 1e6 ? '$' + (n / 1e6).toFixed(1) + 'M' : n >= 1e3 ? '$' + Math.round(n / 1e3) + 'K' : '$' + Math.round(n) }
  function exCalcInit() {
    if (!/^en__exchangeDetail__/.test(PT.key)) return;
    var rows = document.querySelectorAll('[class*="__CommTableRow"]'); if (!rows.length) return;
    var R = {}; [].forEach.call(rows, function (r) { var c = r.querySelectorAll('[class*="__CommTableCell"]'); var k = /Without/.test(c[0].textContent) ? 'w' : /discount/i.test(c[0].textContent) ? 'd' : 'c'; R[k] = [pct(c[1].textContent), pct(c[2].textContent)] });
    if (!R.w || !R.c) return;
    var sub = document.querySelector('[class*="__ExchangeInfoSection"] [class*="__CommSubtitle"]');
    var cb = sub && (sub.textContent.match(/Cashback\s+(\d+)%/) || [])[1];
    var range = document.querySelector('input[type=range][class*="__VolumeSlider"]');
    EX = { R: R, cb: cb, maker: true, range: range };
    if (range) range.addEventListener('input', exRender);
  }
  function exRender() {
    if (!EX) return; var k = EX.maker ? 0 : 1, w = EX.R.w[k], c = EX.R.c[k], d = EX.R.d ? EX.R.d[k] : w;
    document.querySelectorAll('[class*="__ToggleBtn"]').forEach(function (b) { var on = (b.textContent.trim() === 'Maker') === EX.maker; var ac = clsOf(b, /__active$|^active$/) || EX.act; if (ac) EX.act = ac; if (EX.act) b.classList.toggle(EX.act, on) });
    var save = Math.ceil((w - c) / w * 100 - 1e-9), pay = Math.round(c / w * 100), disc = Math.round((w - d) / w * 100);
    var info = document.querySelector('[class*="__ExchangeInfoSection"]');
    var rn = info && info.querySelector('[class*="__RateNumber"]'); if (rn && /%/.test(rn.textContent)) rn.textContent = save + '%';
    var sub = info && info.querySelector('[class*="__CommSubtitle"]'); if (sub && EX.cb) sub.textContent = 'Exchange discount ' + disc + '% + TetherMax Cashback ' + EX.cb + '%';
    document.querySelectorAll('[class*="__CommInfo"]').forEach(function (p) { [].forEach.call(p.childNodes, function (n) { if (n.nodeType === 3 && /Pay only/.test(n.nodeValue)) n.nodeValue = 'Pay only $' + pay + ' instead of $100 in fees and save ' + save + '%' }) });
    var r = EX.range; if (!r) return;
    var v = +r.value, vol = 1e5 * Math.pow(100, v / 1000), p = v / 10;
    r.style.background = 'linear-gradient(to right, rgb(36, 83, 240) 0%, rgb(36, 83, 240) ' + p + '%, rgba(36, 83, 240, 0.15) ' + p + '%, rgba(36, 83, 240, 0.15) 100%)';
    var box = r.closest('[class*="__VolumeSliderWrapper"]'), sec = box && box.parentElement;
    var vv = box.querySelector('[class*="__VolumeValue"]'); if (vv) vv.textContent = money(vol);
    var fw = vol * w, fc = Math.round(vol * c), fv = box.querySelectorAll('[class*="__FeeCompareValue"]');
    if (fv[0]) fv[0].textContent = '$' + Math.round(fw); if (fv[1]) fv[1].textContent = '$' + fc;
    var big = sec && sec.querySelector('[class*="__RateNumber"]'); if (big) big.textContent = '$' + (Math.round(fw) - fc);
  }
  // MUI 슬라이더(서비스 소개 레버리지 등): 끌기 · 클릭 → 손잡이 · 트랙 · 값 표시
  document.addEventListener('pointerdown', function (e) {
    var root = e.target.closest && e.target.closest('.MuiSlider-root'); if (!root) return;
    var inp = root.querySelector('input[type=range]'); if (!inp) return;
    e.preventDefault();
    var min = +inp.min || 0, max = +inp.max || 100, step = +inp.step || 1;
    var move = function (ev) {
      var r = root.getBoundingClientRect(), f = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width));
      var v = Math.round((min + f * (max - min)) / step) * step, p = (v - min) / (max - min) * 100;
      var th = root.querySelector('.MuiSlider-thumb'), tr = root.querySelector('.MuiSlider-track');
      if (th) th.style.left = p + '%'; if (tr) tr.style.width = p + '%';
      inp.value = v; inp.setAttribute('aria-valuenow', v);
      var f2 = root.parentElement && root.parentElement.querySelector('[class*="__SliderFieldValue"]'); if (f2) f2.textContent = f2.textContent.replace(/[\d.,]+/, v);
      inp.dispatchEvent(new Event('input', { bubbles: true }));
    };
    move(e);
    var up = function () { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up) };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  }, true);
  function copyToast(text) {
    try { navigator.clipboard.writeText(text).catch(function () { }) } catch (x) { }
    toast('Copied.');
  }
  // 화면 동작 묶음 — 처리하면 true
  function enh(t, el, inLayer) {
    var l = label(el || t);
    var tg = t.closest('[class*="__TocLabel"],[class*="__AnchorTab"],[class*="__SidebarItem"]');
    if (tg && !inLayer && anchorNav(tg)) return true;
    var st = t.closest('[class*="HomeOnboarding"][class*="__StepItem"]');
    if (st) { var items = sib(st, /__StepItem$/); stepsGo(items.indexOf(st)); stepsInit(); return true }
    var card = t.closest(EXCARD);
    if (card && !t.closest('button:not([class*="__AllCard"])')) { var sl = exSlug(card); if (sl) { if (inLayer) closeLayers(); nav(ORIGIN + '/en/exchangeDetail/' + sl + '-referral'); return true } }
    if (EX && el && /__ToggleBtn/.test(el.className) && /^(Taker|Maker)$/.test(l)) { EX.maker = l === 'Maker'; exRender(); return true }
    var gs = t.closest('[class*="__GettingStartedCard"]');
    if (gs) { nav(ORIGIN + '/en/kycCertification/detail?keyword=' + PT.key.split('__').pop() + '&page=1'); return true }   // 실사이트 이동 대상(수집 안 됨)
    if (t.closest('[class*="__BasicsCard"]')) { nav(ORIGIN + '/en/brokers/learn'); return true }
    if (l === 'Select Account' && document.getElementById('account-type')) { scrollToEl(document.getElementById('account-type')); return true }
    if (inLayer && /^Sign up with .+ sign-up link/i.test(l)) {   // 가입 안내 팝업 → 그 거래소 가입 링크(실사이트에서 측정)
      var su = SIGNUP[(PT.key.match(/exchangeDetail__(.+)-referral$/) || [])[1]];
      if (su) { closeLayers(); window.open(su, '_blank'); return true }
    }
    if (l === 'support@tethermax.io') { if (inLayer) closeLayers(); copyToast('support@tethermax.io'); return true }
    if (t.closest('[class*="AppBanner"][class*="__GetAppButton"]')) { window.open('https://play.google.com/store/apps/details?id=com.swing2app.v3.d55519973c9ef468b892634c0dcc49db4', '_blank'); return true }   // 실사이트(Android) 이동 대상
    var ab = t.closest('[class*="AppBanner"][class*="__CloseButton"]');
    if (ab) { var bn = ab.closest('[class$="__AppBanner"],[class*="__AppBanner "]') || ab.parentElement; bn.style.display = 'none'; return true }
    // 단계 탭의 첫 단계(수집 기본 화면) — 다른 단계는 상태 스냅숏이 있다
    if (el && el.hasAttribute('data-pt-sig') && PT.stateSig) {
      var grp = [].filter.call(el.parentElement.children, function (x) { var y = (PT.acts || {})[x.getAttribute('data-pt-sig')]; return y && y.type === 'state' });
      if (grp.length && grp.indexOf(el) < 0) { post({ state: '' }); return true }
    }
    if (el && el.hasAttribute('data-pt-sig') && !PT.stateSig && clsOf(el, /__(active|now|selected)$|^active$|Active$/)) {   // 이미 선택된 탭·메뉴(수집 기본 화면) — 실사이트도 그대로
      var grp2 = [].filter.call(el.parentElement.children, function (x) { var y = (PT.acts || {})[x.getAttribute('data-pt-sig')]; return x !== el && y && GOOD.test(y.type) });
      if (grp2.length) return true;
    }
    if (!inLayer && accordion(t)) return true;
    var bnr = !inLayer && t.closest('.swiper-slide[style*="pointer"]');   // 이벤트 배너 → 같은 거래소 첫 이벤트 카드의 `Join Now` 수집 결과(라이브 측정: 같은 URL 새 탭)
    if (bnr) {
      var exn = Object.keys(CEXN).map(function (k) { return CEXN[k] }).filter(function (x) { return bnr.textContent.indexOf(x) >= 0 })[0];
      var jn = exn && [].filter.call(document.querySelectorAll('[data-pt-sig^="Join Now"]'), function (j) { var y = (PT.acts || {})[j.getAttribute('data-pt-sig')]; if (!y || y.type !== 'ext') return false; for (var c = j.parentElement, k = 0; c && k < 6; c = c.parentElement, k++) if (c.textContent.indexOf(exn) >= 0 && !c.contains(bnr)) return true; return false })[0];
      if (jn) { window.open(PT.acts[jn.getAttribute('data-pt-sig')].url, '_blank'); return true }
    }
    if (mobileSteps(t)) return true;
    if (swiper(t)) return true;
    if (!el && !inLayer) {                              // 카드 전체 클릭 = 카드 안 단 하나의 버튼과 같은 동작(그 버튼의 수집 결과)
      for (var c = t, k = 0; c && c !== document.body && k < 5; c = c.parentElement, k++) {
        if (getComputedStyle(c).cursor !== 'pointer' || (c.parentElement && getComputedStyle(c.parentElement).cursor === 'pointer')) continue;
        var bs = c.querySelectorAll('[data-pt-sig]'); if (bs.length !== 1) break;
        var y = (PT.acts || {})[bs[0].getAttribute('data-pt-sig')]; if (y && GOOD.test(y.type)) { runAct(y); return true }
        break;
      }
    }
    return false;
  }
  // 모바일 랜딩 3단계 슬라이더: ‹ · 점 · › → 슬라이드 + 아래 문구(같은 페이지의 PC 단계 목록 문구)
  function mobileSteps(t) {
    var c = t.closest('[class*="__MobileNavButton"],[class*="__MobileDot"]'); if (!c) return false;
    var box = c.closest('[class*="__MobileSlider"]'); if (!box) return false;
    var dots = [].slice.call(box.querySelectorAll('[class*="__MobileDot"]:not([class*="__MobileDots"])')), n = dots.length; if (!n) return false;
    var dotOn = clsOf(dots.filter(function (d) { return /__MobileDotActive/.test(d.className) })[0], /__MobileDotActive$/) || EX_MDOT;
    EX_MDOT = dotOn; var cur = Math.max(0, dots.findIndex(function (d) { return d.classList.contains(dotOn) })), i;
    if (/__MobileDot/.test(c.className)) i = dots.indexOf(c); else i = (cur + (/__MobileNavPrev/.test(c.className) ? -1 : 1) + n) % n;
    dots.forEach(function (d, j) { d.classList.toggle(dotOn, j === i) });
    var wr = box.querySelector('.swiper-wrapper'), sl = wr && wr.children[i];
    if (sl) { [].forEach.call(wr.children, function (x, j) { x.classList.toggle('swiper-slide-active', j === i) }); wr.style.transitionDuration = '300ms'; wr.style.transform = 'translate3d(' + (-(sl.offsetLeft - wr.children[0].offsetLeft)) + 'px, 0px, 0px)' }
    var items = document.querySelectorAll('[class*="HomeOnboarding"][class*="__StepItem"]'), it = items[i];
    if (it) { var tt = box.querySelector('[class*="__MobileStepTitle"]'), td = box.querySelector('[class*="__MobileStepDescription"]'); if (tt) tt.textContent = it.querySelector('[class*="__StepTitle"]').textContent; if (td) td.textContent = it.querySelector('[class*="__StepDescription"]').textContent }
    return true;
  }
  var EX_MDOT = null;
  // 거래소 상세 `Sign Up` 팝업의 가입 링크 — 라이브 tethermax.io에서 눌러 측정(2026-11-27). 어드민 입력값이라 바뀔 수 있다
  var SIGNUP = {"binance": "https://accounts.binance.com/register?ref=TETHERMX", "bingx": "https://bingx.com/invite/SNIEBQKH", "bitget": "https://www.bitget.com/asia/expressly?channelCode=zx6x&languageType=3&vipCode=wh4h", "bitunix": "https://www.bitunix.com/register?vipCode=4p3e", "blofin": "https://www.blofin.cloud/invite/NDlncr?redirect=", "bybit": "https://partner.bybit.com/b/tetherpage", "deepcoin": "https://www.deepcoin.com/en/register?status=reg&inviteCode=9243801", "flipster": "https://flipster.io/signin?referral_code=TETHERMAX", "gate": "https://www.gate.com/signup?ref_type=103&ref=VFIRBF4KAG", "htx": "https://www.htx.com.pk/invite-register?inviter_id=11343840&invite_code=psgt7223&id=10072", "lbank": "https://www.lbank.com/signup?icode=5XAXG", "mexc": "https://www.mexc.com/register?inviteCode=mexc-1PsaL", "okx": "https://www.okx.com/join/cashbacks", "toobit": "https://www.toobit.com/t/cvrpBT", "woo x pro": "https://www.wooxpro.com/invite/TETHERMAXCODE", "woo-x-pro": "https://www.wooxpro.com/invite/TETHERMAXCODE", "zoomex": "https://www.zoomex.com/en-US/register?affiliate_id=901355&group_id=59861&group_type=1"};
  // 수집기가 같은 팝업을 한 번만 저장해 다른 거래소 상세에서도 첫 수집 거래소 이름이 보인다 → 지금 거래소 이름으로
  function layerExName(root) {
    var m = (PT.key.match(/exchangeDetail__(.+)-referral$/) || [])[1]; if (!m) return;
    var me = document.querySelector('[class*="__ExchangeName"]'); me = me && me.textContent.trim(); if (!me) return;
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n, names = Object.keys(CEXN).map(function (k) { return CEXN[k] }).filter(function (x) { return x !== me });
    while ((n = w.nextNode())) names.forEach(function (x) { if (n.nodeValue.indexOf(x) >= 0) n.nodeValue = n.nodeValue.split(x).join(me) });
  }
  // 캐러셀(Swiper) — 점 · 화살표 → 슬라이드 이동(수집 HTML에 모든 슬라이드가 있다), .3s
  function swiper(t) {
    var bullet = t.closest('.swiper-pagination-bullet'), arrow = !bullet && t.closest('.swiper-button-next,.swiper-button-prev,[class*="__NavButton"],[class*="__Arrow"],[class*="__Prev"],[class*="__Next"]');
    if (!bullet && !arrow) return false;
    var scope = (bullet || arrow).closest('.swiper') || null;
    for (var p = (bullet || arrow).parentElement; !scope && p && p !== document.body; p = p.parentElement) if (p.querySelector('.swiper-wrapper')) scope = p;
    if (!scope) return false;
    var sw = scope.matches('.swiper') ? scope : scope.querySelector('.swiper'); var wr = (sw || scope).querySelector('.swiper-wrapper'); if (!wr) return false;
    var slides = [].filter.call(wr.children, function (x) { return x.classList.contains('swiper-slide') && !x.classList.contains('swiper-slide-duplicate') }); if (slides.length < 2) return false;
    var cur = Math.max(0, slides.findIndex(function (x) { return x.classList.contains('swiper-slide-active') })), bl = [].slice.call(scope.querySelectorAll('.swiper-pagination-bullet'));
    var per = Math.max(1, Math.round((sw || scope).getBoundingClientRect().width / (slides[0].getBoundingClientRect().width || 1)));
    var last = Math.max(0, slides.length - per), i;
    if (bullet) i = bl.indexOf(bullet);
    else { var next = /next/i.test(arrow.className) || (!/prev/i.test(arrow.className) && arrow.parentElement && [].indexOf.call(arrow.parentElement.querySelectorAll('[class*="__NavButton"],[class*="__Arrow"]'), arrow) > 0); i = cur + (next ? 1 : -1); if (i > last) i = 0; if (i < 0) i = last }
    i = Math.max(0, Math.min(slides.length - 1, i));
    slides.forEach(function (x, j) { x.classList.toggle('swiper-slide-active', j === i) });
    bl.forEach(function (x, j) { x.classList.toggle('swiper-pagination-bullet-active', j === i) });
    wr.style.transitionDuration = '300ms'; wr.style.transform = 'translate3d(' + (-(slides[i].offsetLeft - slides[0].offsetLeft)) + 'px, 0px, 0px)';
    return true;
  }
  // 모바일 수집본은 body `position:fixed`로 저장됐다(수집 때 열린 메뉴의 스크롤 잠금) — 열린 메뉴·모달이 없으면 푼다
  function scrollFree() {
    var b = document.body;
    if (b.style.position !== 'fixed') return;
    if (document.querySelector('.MuiModal-root:not(.MuiModal-hidden), .MuiBackdrop-root, [role=dialog]')) return;
    b.style.position = ''; b.style.inset = ''; b.style.top = ''; b.style.width = '';
  }

  // ④ 문구 — Figma DEX(revision) 2·3차 수정 결과 · 문구표_DEX · 9차 결정과 같게(랜딩 `/en` · 서비스 소개만)
  var COPY = {
    en: {
      'Get paid daily in USDT': 'Get cashback in USDT automatically',                                   // 문구표 #44
      'Trade, and cashback accrues automatically': 'Each linked account is paid automatically once its claimable balance reaches 10 USDT.',
      'Link your exchange UID': 'Link your exchange account',                                           // Figma 랜딩 28960:128375
      'Link your exchange UID to TetherMax': 'Link your exchange UID or wallet address to TetherMax',
      'Top Exchanges': 'Our Partners'                                                                   // Figma 랜딩 모바일 29386:140183
    },
    'en__service-intro-new': {
      'Someone just got paid.': 'Someone is cashing out right now',                                     // 문구표 #41
      'Watch it happen.': '',
      'With 24/7 real-time cashback, every cent you earn is paid out, instantly.': "Claim every cent you've earned",
      'Join an exchange with your TetherMax code and just enter your UID. Done, under 3 minutes!': 'Join an exchange with your TetherMax code and just link your account. Done, under 3 minutes!',   // 문구표 #75
      'Every time a trader you invite links a UID and trades, you earn rewards.': 'Every time a trader you invite links an account and trades, you earn rewards.',                            // 문구표 #76
      'UID linked': 'Account linked',
      'Traders you invite join an exchange with the TetherMax code and link their UID.': 'Traders you invite join an exchange with the TetherMax code and link their account.'
    }
  };
  function dexCopy(root) {
    var map = COPY[PT.key]; if (!map) return;
    var w = document.createTreeWalker(root || document.body, NodeFilter.SHOW_TEXT), n, hit = [];
    while ((n = w.nextNode())) { var k = n.nodeValue.trim(); if (k && Object.prototype.hasOwnProperty.call(map, k)) hit.push(n) }
    hit.forEach(function (x) { var v = map[x.nodeValue.trim()]; if (v === '') { var p = x.parentNode; x.remove(); if (p && !p.textContent.trim() && p.children.length === 0) p.style.display = 'none' } else x.nodeValue = v });
  }
  // ⑤ 랜딩 모바일 `Our Partners` 카드 — 칩 All · Exchanges · DEXs + 목록 끝 두 행 ApeX 30% · Lighter 20%(Figma 29386:140183 · PC 28960:128424)
  function dexPartnerSet(k) {
    document.querySelectorAll('[data-dex-chips]').forEach(function (chips) {
      [].forEach.call(chips.children, function (c) { var on = c.getAttribute('data-k') === k; c.style.background = on ? '#2453f0' : 'rgba(0,0,0,.08)'; c.style.color = on ? '#fff' : 'inherit' });
    });
    document.querySelectorAll('[data-dex-p] > li').forEach(function (li) { li.style.display = k === 'all' || li.getAttribute('data-kind') === k ? '' : 'none' });
  }
  window.addEventListener('click', function (e) {   // 위임(window 캡처 — 런타임 문서 캡처 처리보다 먼저)
    var c = e.target.closest && e.target.closest('[data-dex-chips] [data-k]');
    if (c) { e.preventDefault(); e.stopPropagation(); return dexPartnerSet(c.getAttribute('data-k')) }
    var r = e.target.closest && e.target.closest('[data-dex-slug]');
    if (r) { e.preventDefault(); e.stopPropagation(); return post({ nav: ORIGIN + '/en/dex/' + r.getAttribute('data-dex-slug') }) }
  }, true);
  function dexPartners() {
    if (PT.key !== 'en') return;
    document.querySelectorAll('[class*="__MobileCard"] [class*="__MobileExchangeList"]').forEach(function (ul) {
      if (ul.hasAttribute('data-dex-p')) return; ul.setAttribute('data-dex-p', '');
      var items = [].slice.call(ul.children); if (items.length < 3) return;
      items.forEach(function (li) { li.setAttribute('data-kind', 'cex') });
      [['ApeX', 'apex', '30%'], ['Lighter', 'lighter', '20%']].forEach(function (d, i) {
        var src = items[items.length - 2 + i], li = src.cloneNode(true);
        li.className = li.className.replace(/\S*__MobilePopularItem/g, '');
        var img = li.querySelector('img'); if (img) { img.removeAttribute('srcset'); img.src = '../dex/assets/dex-' + d[1] + '.png' }
        var nm = li.querySelector('[class*="__MobileExchangeNameText"]'); if (nm) nm.textContent = d[0];
        var badge = li.querySelector('[class*="__MobilePopularBadge"]'); if (badge) badge.remove();
        var rt = li.querySelector('[class*="__MobileSavingsRate"]'); if (rt) rt.textContent = d[2];
        li.setAttribute('data-kind', 'dex');
        li.setAttribute('data-dex-slug', d[1]);
        src.replaceWith(li);
      });
      var head = ul.parentNode.querySelector('[class*="__MobileCardHeader"]');
      var chips = document.createElement('div'); chips.setAttribute('data-dex-chips', '');
      chips.style.cssText = 'display:flex;gap:8px;margin:12px 0 4px';
      ['All', 'Exchanges', 'DEXs'].forEach(function (l, i) {
        var c = document.createElement('button'); c.type = 'button'; c.textContent = l; c.setAttribute('data-k', ['all', 'cex', 'dex'][i]);
        c.style.cssText = 'border:0;cursor:pointer;padding:7px 10px;border-radius:100px;font:inherit;font-size:13px;line-height:18px;letter-spacing:.16px;transition:background .2s,color .2s';
        chips.appendChild(c);
      });
      if (head) head.after(chips); else ul.before(chips);
      dexPartnerSet('all');
    });
  }

  // ================= DEX 연결 (README 「DEX 연결」) =================
  // ① 연동 버튼·「Link more」 → 셸이 DEX 앱 연동 모달을 연다(어디서 열어도 같은 모달)
  var CEXN = { binance: 'Binance', bingx: 'BingX', bitget: 'Bitget', bitunix: 'Bitunix', blofin: 'BloFin', bybit: 'Bybit', deepcoin: 'DeepCoin', flipster: 'Flipster', gate: 'Gate', htx: 'HTX', lbank: 'LBank', mexc: 'MEXC', okx: 'OKX', toobit: 'Toobit', 'woo-x-pro': 'WOO X Pro', 'woo x pro': 'WOO X Pro', zoomex: 'Zoomex' };
  function dexLink() {
    var m = (PT.key || '').match(/exchangeDetail__(.+)-referral$/);
    post({ dexLink: m && CEXN[m[1]] ? { ex: CEXN[m[1]], type: 'CEX' } : {} });
  }
  // ② GNB `Cashback ▾` = Cashback Hub · Cashback Calculator(결정 D4 — 허브가 CEX·DEX·Brokers를 모두 포함, 단독 Calculator 메뉴 없음)
  function dexMenu() {
    document.querySelectorAll('a[data-orig-href="' + ORIGIN + '/en/affiliated"]').forEach(function (a) {
      if ((a.textContent || '').trim() !== 'Exchanges' || !/Dropdown/.test(a.className)) return;
      var leaf = a; while (leaf.children.length === 1) leaf = leaf.children[0];
      leaf.textContent = 'Cashback Hub';
      a.setAttribute('href', '/en/cashback'); a.setAttribute('data-orig-href', ORIGIN + '/en/cashback');   // 허브(URL 미정 IA-Q5 — 프로토타입 경로). /en/affiliated는 기존 CEX 거래소 목록(결정 2026-11-27)
      [].forEach.call(a.parentNode.querySelectorAll('a[data-orig-href="' + ORIGIN + '/en/brokers"]'), function (b) { b.remove() });
    });
    // GNB `Rewards Hub ▾` = Exchange Events · Benefits · Points(결정 기록 「GNB Rewards Hub ▾ 항목」 — Figma 기준 3개)
    document.querySelectorAll('a[data-orig-href="' + ORIGIN + '/en/events"]').forEach(function (a) {
      if (!/Dropdown/.test(a.className) || a.parentNode.querySelector('[data-dex-benefits]')) return;
      var b = a.cloneNode(true); b.setAttribute('data-dex-benefits', '');
      b.className = [].filter.call(a.classList, function (c) { return !/__selected$/.test(c) }).join(' ');
      b.setAttribute('href', '/en/benefits'); b.setAttribute('data-orig-href', ORIGIN + '/en/benefits');
      var leaf = b; while (leaf.children.length === 1) leaf = leaf.children[0]; leaf.textContent = 'Benefits';
      a.after(b);
    });
  }
  // 홈 행 → 지갑/UID 상세. 거래소 묶음 행(여러 UID)은 연동 계정 목록 모달
  function dexRowOpen(r) {
    var Sx = window.DEXSTATE; if (!Sx) return;
    var st = Sx.load(), id = r.getAttribute('data-dex-row');
    if (id) { var a = st.accounts.filter(function (x) { return x.id === id })[0]; if (!a) return; if (a.st === 'issue') return rowIssue(a); if (a.st === 'unlinked') return rowBannerClick(a.id); if (a.st !== 'ok' && a.st !== 'zero') return; st.view = { ex: a.ex, type: a.type, id: a.id, a: a.a || 0, b: a.b || null, st: a.st }; st.viewLogo = null }
    else {
      var num = r.querySelector('[class*="__LinkedUidNumber"]');
      if (!num) return post({ dexLink: { mode: 'seeAll' } });
      var am = r.querySelector('[class*="__LinkedUidAmount"]'), nm = r.querySelector('[class*="__LinkedUidName"]'), img = r.querySelector('img');
      st.view = { ex: nm.textContent.trim(), type: 'CEX', id: num.textContent.replace(/^UID\s*/, '').trim(), a: am ? parseFloat(am.textContent) || 0 : 0, b: null, st: 'ok' };
      st.viewLogo = img ? img.getAttribute('src') : null;
    }
    Sx.save(st); post({ nav: ORIGIN + '/en/account' });
  }
  // ③ 회원 홈 Linked Accounts: DEX 앱에서 연동한 계정 행 · 총액 · 라벨(Figma HW1) — dex/dex-state.js 공유 저장소
  // 행 상태 — 결정 기록 10차: 칩 없이 기존 실사이트 디자인(행 점 + 행 아래 StatusAlert 배너 · 모달). DEX 행은 `UID` 자리를 `Wallet`/`wallet`로
  // 배너·점 클래스 = 실사이트 수집본(연동 계정 목록 팝업 SelectMyExchangePopup · 홈 LinkedUidDot*) 그대로
  var ROWST = {
    ok: {}, zero: {},
    pend: { dot: 'proc', clock: 1 },                 // 확인 중 = 분홍 점 + 시계(Figma 29447:141189 · 기존 9401:87675)
    own: { dot: 'own', clock: 1, line: 1 },          // 소유 확인 중 = 파란 점 + 시계 + 「Ownership verification in progress · 경과 시간」(MAX-561 12792:231646)
    fail: { dot: 'err', ban: 'Error', text: { CEX: 'UID Linking was unsuccessful. View reason.', DEX: 'Wallet linking was unsuccessful. View reason.' } },
    ownfail: { dot: 'err', ban: 'Error', text: 'Ownership verification was unsuccessful. Please try again.' },
    reclaimfail: { dot: 'err', ban: 'Error', text: 'Ownership verification was unsuccessful. View reason.' },
    unlinked: { dot: 'warn', ban: 'Warning', text: { CEX: 'This UID has been unlinked. Tap to verify ownership and reclaim it.', DEX: 'This wallet has been unlinked. Tap to verify ownership and reclaim it.' } },
    issue: { dot: 'err' }
  };
  var ROWST_KO = { ok: '정상', zero: '캐시백 0', pend: '확인 중', own: '소유권 심사 중', fail: '연동 실패', ownfail: '소유권 인증 실패(신청자)', reclaimfail: '재청구 거절', unlinked: '연동 해제(되찾기)', issue: '이슈(오프보딩)' };
  var ALERT = 'SelectMyExchangePopup-module-scss-module__IotxDq__';
  var ICO_ALERT = '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-r6rqcb" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 11c-.55 0-1-.45-1-1V8c0-.55.45-1 1-1s1 .45 1 1v4c0 .55-.45 1-1 1m1 4h-2v-2h2z"></path></svg>';
  var ICO_NEXT = '<svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-1q2r1cx" focusable="false" aria-hidden="true" viewBox="0 0 24 24"><path d="M9.29 6.71c-.39.39-.39 1.02 0 1.41L13.17 12l-3.88 3.88c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0l4.59-4.59c.39-.39.39-1.02 0-1.41L10.7 6.7c-.38-.38-1.02-.38-1.41.01"></path></svg>';
  var ICO_CLOCK = '<svg viewBox="0 0 24 24" width="20" height="20" aria-label="In progress" style="display:block;fill:rgba(0,0,0,.56)"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2M12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8m-.22-13h-.06c-.4 0-.72.32-.72.72v4.72c0 .35.18.68.49.86l4.15 2.49c.34.2.78.1.98-.24.21-.34.1-.79-.25-.99l-3.87-2.3V7.72c0-.4-.32-.72-.72-.72"/></svg>';
  function elapsed(ts) { if (!ts) return '06:46'; var x = Math.max(0, Math.floor((Date.now() - ts) / 1000)), h = Math.floor(x / 3600), m = Math.floor(x % 3600 / 60), sc = x % 60, p = function (n) { return (n < 10 ? '0' : '') + n }; return h ? h + ':' + p(m) + ':' + p(sc) : p(m) + ':' + p(sc) }
  setInterval(function () { [].forEach.call(document.querySelectorAll('[data-own-elapsed]'), function (el) { var ts = +el.getAttribute('data-own-elapsed'), t = el.querySelector('.tnum'); if (ts && t) t.textContent = elapsed(ts) }) }, 1000);
  function rowBanner(x, RS) {
    var d = document.createElement('div'), txt = typeof RS.text === 'string' ? RS.text : RS.text[x.type === 'DEX' ? 'DEX' : 'CEX'];
    d.className = ALERT + 'StatusAlert ' + ALERT + 'StatusAlert' + RS.ban; d.setAttribute('data-dex-ban', x.id);
    d.style.margin = '0 0 8px';
    d.innerHTML = '<div class="' + ALERT + 'StatusAlertIcon">' + ICO_ALERT + '</div><p class="' + ALERT + 'StatusAlertText">' + txt + '</p>' + (RS.ban === 'Info' ? '' : '<div class="' + ALERT + 'StatusAlertRight">' + ICO_NEXT + '</div>');
    return d;
  }
  // 모달 — 실사이트 CenterPopup(수집본 `Contact Customer Support` 팝업 마크업·클래스)
  var POPCSS = false;
  function centerPopup(title, body, btns) {
    if (!POPCSS) { var l = document.createElement('link'); l.rel = 'stylesheet'; l.href = '../css/33g7t62i3425t.css'; document.head.appendChild(l); POPCSS = true }
    var V = 'ExchangeDetail-view-module-scss-module__vhpGua__';
    var html = '<div class="PopupManager-module-scss-module__xOdNVW__PopupContainer" style="z-index: 5; opacity: 1; transform: none;"><div class="PopupManager-module-scss-module__xOdNVW__Dimmed PopupManager-module-scss-module__xOdNVW__open" id="dimmed" style="z-index: 5; transform: none;"></div><div class="CenterPopup-module-scss-module__-JaXgW__CenterPopup" style="z-index: 5;"><div class="CenterPopup-module-scss-module__-JaXgW__PopupContent"><div class="CenterPopup-module-scss-module__-JaXgW__Description">'
      + '<p class="' + V + 'AlreadyTitle">' + title + '</p>' + (body ? '<p class="' + V + 'AlreadyBody">' + body + '</p>' : '')
      + btns.map(function (b, i) { return '<button class="' + V + (i === 0 ? 'AlreadySupportBtn' : 'AlreadyCloseBtn') + '" data-pt-act="' + b[1] + '">' + b[0] + '</button>' }).join('')
      + '</div><button class="CenterPopup-module-scss-module__-JaXgW__CloseButton" aria-label="close"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M20.094 5.72a1.282 1.282 0 1 0-1.813-1.814L12 10.187l-6.28-6.28a1.282 1.282 0 1 0-1.814 1.812L10.187 12l-6.28 6.28a1.282 1.282 0 0 0 1.812 1.814L12 13.813l6.28 6.28a1.282 1.282 0 0 0 1.814-1.812L13.813 12l6.28-6.28Z" fill="var(--action-active, rgba(0, 0, 0, 0.56))"></path></svg></button></div></div></div>';
    frags['pt-row-popup'] = { html: html, css: '' }; show('pt-row-popup');
  }
  var popAcc = null;
  function rowAct(act) {
    var Sx = window.DEXSTATE, st = Sx.load(), a = popAcc && st.accounts.filter(function (y) { return y.id === popAcc.id && y.ex === popAcc.ex })[0];
    if (act === 'remove' && a) { st.accounts = st.accounts.filter(function (y) { return y !== a }); Sx.save(st); dexInject({ quiet: 1 }); post({ dexChanged: 1 }); return }
    if (act === 'relink' && a) return post({ dexLink: { ex: a.ex, type: a.type } });
    if (act === 'support') return window.ptSupport ? ptSupport() : generic({ innerText: 'Contact Support' });
    if (act === 'reclaim' && a) { st.own = { ex: a.ex, type: a.type, id: a.id }; Sx.save(st); return nav(ORIGIN + '/en/ownership-verification') }
    if (act === 'close') return;
  }
  function rowBannerClick(id) {
    var Sx = window.DEXSTATE, st = Sx.load(), a = st.accounts.filter(function (y) { return y.id === id })[0]; if (!a) return;
    popAcc = a; var dex = a.type === 'DEX';
    if (a.st === 'fail') return centerPopup(dex ? 'Wallet Linking Unsuccessful' : 'UID Linking Unsuccessful', a.reason || (dex ? '{Reason provided by backend}' : 'UID is not found in the tetherMax database. Please contact customer service for assistance.'), [[dex ? 'Remove Wallet' : 'Remove UID', 'remove'], [dex ? 'Link Wallet' : 'UID Link', 'relink']]);
    if (a.st === 'ownfail') return centerPopup('Ownership Verification Unsuccessful', 'We were unable to verify your wallet ownership. Please review your submission and try again.', [['OK', 'close']]);
    if (a.st === 'reclaimfail') { st.own = { ex: a.ex, type: a.type, id: a.id }; Sx.save(st); return post({ dexLink: { mode: 'own', r: 'reclaimRejected' } }) }   // O16 — 심사 사유 · Remove Wallet · Apply for Ownership
    if (a.st === 'unlinked') return dex ? centerPopup('Verify Ownership to Reclaim This Wallet', 'This wallet address was unlinked after another user verified ownership. If it belongs to you, submit a new claim.', [['Submit Wallet Ownership', 'reclaim'], ['Remove Wallet', 'remove']])
      : centerPopup('Verify Ownership to Reclaim This UID', 'This UID was unlinked after another user verified ownership. If it belongs to you, submit a new claim.', [['Submit UID Ownership', 'reclaim'], ['Remove UID', 'remove']]);   // O15(REQ-729)
  }
  // 축약 지갑 주소 → 전체 주소 툴팁(어두운 MUI Tooltip 모양 — 화면 목록판 .ui-tip과 같은 값). 모바일 탭 · PC 호버, 바깥 탭·마우스 이탈로 닫힘(결정 2026-11-27)
  function addrPop(el, id, toggle) {
    var old = document.getElementById('pt-addr'); if (old) { old.remove(); if (toggle && old.getAttribute('data-id') === id) return }
    var p = document.createElement('div'); p.id = 'pt-addr'; p.setAttribute('data-id', id); p.setAttribute('role', 'tooltip'); var r = el.getBoundingClientRect();
    p.style.cssText = 'position:fixed;z-index:2147483000;width:200px;box-sizing:border-box;background:rgba(97,97,97,.9);color:#fff;font:500 12px/1.4 inherit;text-align:center;padding:4px 8px;border-radius:4px;word-break:break-all;pointer-events:none';
    p.textContent = id; document.body.appendChild(p);
    p.style.left = Math.max(8, Math.min(r.left, innerWidth - p.offsetWidth - 8)) + 'px'; p.style.top = (r.bottom + 4) + 'px';
    if (toggle) setTimeout(function () { document.addEventListener('click', function h() { p.remove(); document.removeEventListener('click', h, true) }, true) }, 0);
  }

  function rowIssue(a) { popAcc = a; centerPopup(a.type === 'DEX' ? 'There is a problem with this wallet.' : 'There is a problem with this UID.', 'Please contact our support team for assistance.', [['Contact Support', 'support']]) }   // Figma 29447:144506 · 144810 — 파란 버튼 1개 + 닫기 X
  // 테스트용 도움말(왼쪽 아래): 연동 계정 행 상태 바꿔 보기 · 소유권 심사 결과(승인/거절)
  function rowHelp(accs) {
    if (!accs.length) return;
    var h = document.createElement('div'); h.setAttribute('data-dex-own', '');
    h.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483646;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.25);padding:10px;font:12px/1.45 system-ui,"Malgun Gothic",sans-serif;color:#1f2430;max-width:280px';
    var opts = Object.keys(ROWST_KO).map(function (k) { return '<option value="' + k + '">' + ROWST_KO[k] + '</option>' }).join('');
    h.innerHTML = '<b>테스트 · 연동 계정 행 상태</b>' + accs.map(function (x, i) {
      var nm = x.ex + ' ' + (x.type === 'DEX' ? x.id.slice(0, 6) + '…' + x.id.slice(-4) : 'UID ' + x.id);
      return '<div style="margin-top:6px;display:flex;gap:6px;align-items:center;flex-wrap:wrap"><span style="color:#6b7280">' + nm + '</span><select data-i="' + i + '">' + opts + '</select>'
        + (x.st === 'own' ? '<button data-r="approved" data-i="' + i + '">승인</button><button data-r="rejected" data-i="' + i + '">거절</button>' : '') + '</div>';
    }).join('');
    [].forEach.call(h.querySelectorAll('select'), function (sl) { sl.value = accs[+sl.getAttribute('data-i')].st in ROWST_KO ? accs[+sl.getAttribute('data-i')].st : 'ok' });
    h.addEventListener('change', function (e) {
      var sl = e.target.closest('select'); if (!sl) return;
      var Sx = window.DEXSTATE, st = Sx.load(), x = accs[+sl.getAttribute('data-i')], a = st.accounts.filter(function (y) { return y.id === x.id && y.ex === x.ex })[0]; if (!a) return;
      a.st = sl.value; Sx.save(st); dexInject({ quiet: 1 }); post({ dexChanged: 1 });
    });
    h.addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return; e.preventDefault(); e.stopPropagation();
      var Sx = window.DEXSTATE, st = Sx.load(), x = accs[+b.getAttribute('data-i')], a = st.accounts.filter(function (y) { return y.id === x.id && y.ex === x.ex })[0]; if (!a) return;
      a.st = b.getAttribute('data-r') === 'approved' ? 'ok' : 'ownfail'; st.own = { ex: a.ex, type: a.type, id: a.id }; Sx.save(st);
      dexInject({ quiet: 1 }); post({ dexLink: { mode: 'own', r: b.getAttribute('data-r') } });
    }, true);
    document.body.appendChild(h);
  }
  function dexInject(o) {
    if (PT.auth !== 'member' || PT.key !== 'en') return;
    if (!window.DEXSTATE) { var sc = document.createElement('script'); sc.src = '../dex/dex-state.js'; sc.onload = function () { dexInject(o) }; document.head.appendChild(sc); return }
    var Sx = window.DEXSTATE, st = Sx.load(), q = function (s, r) { return (r || document).querySelector(s) };
    var top = q('[class*="__LinkedUidTopSection"]'); if (!top) return;
    top.querySelectorAll('[data-dex-row]').forEach(function (e) { e.remove() });
    var rows = [].slice.call(top.querySelectorAll('[class*="__LinkedUidRow"]'));
    var tpl = rows.filter(function (r) { return q('[class*="__LinkedUidBadgeRow"]', r) })[0]; if (!tpl) return;
    var t = q('[class*="__LinkedTitle"]'); if (t) t.textContent = 'Linked Accounts';
    var ft = q('[class*="__LinkedFooterText"]'); if (ft) ft.textContent = PT.vp === 'mo' ? 'Trading on multiple exchanges? Link more' : 'Using multiple platforms? Link more accounts';
    var errDot = q('[class*="__LinkedUidDotError"]'), errCls = errDot ? [].filter.call(errDot.classList, function (c) { return /DotError/.test(c) })[0] : '';
    var n2 = function (n) { return (Math.floor(n * 100 + 1e-6) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) };
    var amtOf = function (r) { var a = q('[class*="__LinkedUidAmount"]', r); return a ? parseFloat(a.textContent.replace(/[^\d.]/g, '')) || 0 : 0 };
    var sum = 0, mark = null;
    var oldHelp = document.querySelector('[data-dex-own]'); if (oldHelp) oldHelp.remove();
    top.querySelectorAll('[data-dex-ban]').forEach(function (e) { e.remove() });
    var procCls = errCls ? errCls.replace(/DotError$/, 'DotProcessing') : '';
    st.accounts.forEach(function (x) {
      var amt = x.st === 'zero' ? 0 : Sx.amt(x); if (amt != null) sum += amt;
      var r = tpl.cloneNode(true); r.setAttribute('data-dex-row', x.id);
      var img = q('img', r); img.removeAttribute('srcset'); img.src = '../dex/assets/' + (Sx.LOGO[x.ex] || 'dex-lighter.png'); img.style.borderRadius = '50%';
      q('[class*="__LinkedUidName"]', r).textContent = x.ex;
      q('[class*="__LinkedUidAmount"]', r).textContent = amt == null ? '-' : n2(amt) + ' USDT';
      q('[class*="__LinkedUidNumber"]', r).textContent = x.type === 'DEX' ? 'Wallet ' + x.id.slice(0, 6) + '…' + x.id.slice(-4) : 'UID ' + x.id;
      var dot = q('[class*="__LinkedUidDot"]', r), RS = ROWST[x.st] || {};
      if (dot && RS.dot === 'err' && errCls) dot.classList.add(errCls);
      if (dot && RS.dot === 'proc' && procCls) dot.classList.add(procCls);
      if (dot && RS.dot === 'own') dot.style.background = '#0031c6';
      if (dot && RS.dot === 'warn') dot.style.background = '#ef6c00';
      if (RS.clock) { var am = q('[class*="__LinkedUidAmount"]', r), ck = document.createElement('span'); ck.setAttribute('data-dex-clock', ''); ck.style.cssText = 'display:inline-flex;margin-left:8px;vertical-align:middle;flex:none'; ck.innerHTML = ICO_CLOCK; am.after(ck) }
      var before = rows.filter(function (e) { return amtOf(e) < (amt || 0) })[0];
      if (before) top.insertBefore(r, before); else top.appendChild(r);
      if (RS.ban) { var bn = rowBanner(x, RS); r.after(bn) }
      if (RS.line) { var ln = document.createElement('p'); ln.setAttribute('data-dex-ban', x.id); ln.setAttribute('data-own-elapsed', x.ts || ''); ln.style.cssText = 'margin:-4px 0 8px 44px;font-size:12px;line-height:1.66;letter-spacing:.4px;color:rgba(0,0,0,.6)'; ln.innerHTML = 'Ownership verification in progress · <span class="tnum">' + elapsed(x.ts) + '</span>'; r.after(ln) }
      if (x.id === st.justLinked) mark = r;
    });
    if (o && o.quiet) [].forEach.call(top.querySelectorAll('[data-dex-row],[data-dex-ban]'), function (e) { anim(e, [{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], MT.std) });
    rowHelp(st.accounts);
    var bal = [].filter.call(document.querySelectorAll('p'), function (p) { return p.textContent.trim() === 'Total Cashback Balance' })[0];
    var bv = bal && bal.previousElementSibling;
    if (bv) { if (!bv.hasAttribute('data-dex-orig')) bv.setAttribute('data-dex-orig', bv.textContent); bv.textContent = n2(parseFloat(bv.getAttribute('data-dex-orig').replace(/[^\d.]/g, '')) + sum) + ' USDT' }
    if (mark && !o.quiet) {
      var kind = st.justKind; st.justLinked = null; st.justKind = null; Sx.save(st);
      setTimeout(function () {
        mark.scrollIntoView({ block: 'center', behavior: 'smooth' });
        mark.style.transition = 'background-color 1.2s'; mark.style.backgroundColor = '#e8efff'; mark.style.borderRadius = '12px';
        setTimeout(function () { mark.style.backgroundColor = '' }, 1400);
        if (kind === 'own') return;   // 소유권 신청은 연동 완료 토스트 없음(행 「Verifying ownership」만)
        var el = document.createElement('div'); el.textContent = 'Account linked successfully';
        el.style.cssText = 'position:fixed;left:50%;top:88px;transform:translate(-50%,-12px);opacity:0;z-index:2147483647;background:#0031c6;color:#fff;font:500 14px/1.43 system-ui,sans-serif;padding:14px 20px;border-radius:8px;box-shadow:0 3px 5px -1px rgba(0,0,0,.2),0 6px 10px rgba(0,0,0,.14);transition:opacity .3s cubic-bezier(.65,0,.35,1),transform .3s cubic-bezier(.65,0,.35,1);pointer-events:none';
        document.body.appendChild(el); requestAnimationFrame(function () { el.style.opacity = '1'; el.style.transform = 'translate(-50%,0)' });
        setTimeout(function () { el.style.opacity = '0'; setTimeout(function () { el.remove() }, 320) }, 2600);
      }, 250);
    }
  }
  // ---- Brokers 상세(결정 12차 「Brokers 페이지」 유지) — 라이브 tethermax.io 측정(2026-11-27) ----
  // `Sign Up` · `Sign Up for STP/ECN Account` · 계정 카드 `Get Started` = 브로커 가입 사이트 새 탭(카드 순서 = 계정 유형),
  // 1단계 `referral link` · 아래 띠 `Get Started` = Account Type 구역으로 스크롤. 수집 보완표는 RS 상세에 INFINOX 링크를 잘못 담고 있어 여기서 먼저 처리
  var BRK_RS = 'https://crm.rs-fin.com/account/register/?shareUserSetId=a6d2c90a05b54a948', BRK_STP = 'https://myaccount.infinox.com/register/?lid=9931382&pid=100215934', BRK_ECN = 'https://myaccount.infinox.com/register/?lid=9931383&pid=100215934';
  var BRK = { 'rs-finance': { 'Sign Up': BRK_RS, card: [BRK_RS] }, infinox: { 'Sign Up for STP Account': BRK_STP, 'Sign Up for ECN Account': BRK_ECN, card: [BRK_STP, BRK_ECN] } };
  window.addEventListener('click', function (e) {
    var m = /brokers__(rs-finance|infinox)$/.exec(PT.key || '') || /brokers__(rs-finance|infinox)\./.exec(location.pathname); if (!m) return;
    var t = e.target, b = t && t.closest && t.closest('button'); if (!b || b.closest('header,footer')) return;
    var lab = (b.innerText || '').replace(/\s+/g, ' ').trim(), C = BRK[m[1]], url = C[lab];
    var vis = function (x) { return x.offsetParent !== null };
    var band = function (x) { var s = x.closest('section,div'); for (var k = 0; s && k < 6; k++, s = s.parentElement) if (/Start Earning\s+Rebates/.test(s.innerText || '') && !/Account Type/.test(s.innerText || '')) return true; return false };
    if (!url && lab === 'Get Started' && !band(b)) { var cards = [].filter.call(document.querySelectorAll('button'), function (x) { return vis(x) && (x.innerText || '').trim() === 'Get Started' && !band(x) }); url = C.card[Math.max(0, cards.indexOf(b))] || C.card[0] }
    if (url) { e.preventDefault(); e.stopImmediatePropagation(); try { window.open(url, '_blank', 'noopener') } catch (x) { } return }
    if (lab === 'referral link' || lab === 'Get Started') {
      var h = [].filter.call(document.querySelectorAll('h2'), function (x) { return vis(x) && /^Account Type/.test((x.innerText || '').trim()) })[0]; if (!h) return;
      e.preventDefault(); e.stopImmediatePropagation(); window.scrollTo({ top: h.getBoundingClientRect().top + window.scrollY - 96, behavior: 'smooth' });
    }
  }, true);
})();
