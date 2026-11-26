// 페이지 안 런타임: 실제 로직 없이 클릭을 프로토타입 동작으로 바꾼다
// 이동·상태·오버레이는 수집한 결과(PT.acts)대로, 그 밖의 버튼은 「정상 처리」로 간주한다
(function () {
  var PT = window.PT || {}, ORIGIN = 'https://tethermax.io';
  var post = function (m) { m.pt = 1; parent.postMessage(m, '*'); };
  var PAGE = '/' + (PT.key || '').replace(/__/g, '/');

  function toast(t) {
    var el = document.createElement('div');
    el.textContent = t;
    el.style.cssText = 'position:fixed;left:50%;bottom:28px;transform:translateX(-50%);z-index:2147483647;background:rgba(17,19,24,.92);color:#fff;font:13px/1.4 system-ui,sans-serif;padding:10px 16px;border-radius:8px;max-width:86vw;box-shadow:0 4px 16px rgba(0,0,0,.25);pointer-events:none';
    document.body.appendChild(el);
    setTimeout(function () { el.remove() }, 2200);
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
    if (l === 'Cashback' && PT.auth === 'member') return nav(ORIGIN + '/en/affiliated');   // DEX 연결: 캐시백 허브
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
    closeLayers();
    var p = frags[id];
    var st = document.createElement('style'); st.setAttribute('data-pt-layer', id); st.textContent = p.css; document.head.appendChild(st);
    var box = document.createElement('div'); box.className = 'pt-layer'; box.setAttribute('data-pt-layer', id); box.innerHTML = p.html;
    document.body.appendChild(box);
    post({ layer: id });
  }
  function closeLayers() { document.querySelectorAll('[data-pt-layer]').forEach(function (e) { e.remove() }); post({ layer: '' }) }
  function onLayerClick(e, layer) {
    var t = e.target;
    var a = t.closest('a[href]');
    var b = t.closest('button,[role=button],[role=menuitem],[role=option],li[tabindex]');
    e.preventDefault(); e.stopPropagation();
    if (a) { closeLayers(); return nav(a.getAttribute('data-orig-href') || a.href) }
    if (b) {
      var l = label(b);
      closeLayers();
      if (!l || /close|cancel|dismiss|^x$|×|back/i.test(l) || /close/i.test(b.getAttribute('aria-label') || '')) return;
      return generic(b);
    }
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

  document.addEventListener('click', function (e) {
    var t = e.target;
    var dis = disabledAt(e.clientX, e.clientY);
    if (dis) { e.preventDefault(); e.stopPropagation(); return generic(dis) }
    var layer = t.closest && t.closest('.pt-layer');
    if (layer) return onLayerClick(e, layer);
    if (t.closest('[class*="__LinkedFooter"]')) { e.preventDefault(); e.stopPropagation(); return dexLink() }   // DEX 연결
    if (t.closest('[class*="__SideButton"]')) { e.preventDefault(); e.stopPropagation(); return post({ dexLink: { mode: 'drawer' } }) }   // DEX 연결: 모바일 드로어(결정 D4 구성)
    if (t.closest('[data-dex-own]')) return;
    var lrow = PT.key === 'en' && PT.auth === 'member' && t.closest('[class*="__LinkedUidRow"]');
    if (lrow) { e.preventDefault(); e.stopPropagation(); return dexRowOpen(lrow) }
    var b = t.closest('[data-pt-sig]');
    var a = t.closest('a[href]');
    if (b && !(a && b.contains(a))) {
      e.preventDefault(); e.stopPropagation();
      var sig = b.getAttribute('data-pt-sig'), x = (PT.acts || {})[sig];
      if (PT.stateSig && PT.stateSig === sig) return post({ state: '' });       // 같은 버튼 다시 → 닫힘
      if (!x) return generic(b);
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
    if (btn) { e.preventDefault(); e.stopPropagation(); return generic(btn) }
    for (var el = t, i = 0; el && el !== document.body && i < 5; el = el.parentElement, i++) {
      if ((PT.acts || {})['label:' + label(el)]) { e.preventDefault(); e.stopPropagation(); return generic(el) }
    }
  }, true);
  document.addEventListener('submit', function (e) { e.preventDefault(); generic(e.target.querySelector('[type=submit],button') || e.target) }, true);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeLayers() });
  // 입력하면 같은 폼의 비활성 버튼을 살린다(실제 검증 로직이 없으므로)
  document.addEventListener('input', function (e) {
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
  show = function (id) { _show(id); var l = document.querySelector('.pt-layer'); if (l) settleOpen(l) };
  document.addEventListener('DOMContentLoaded', function () {
    if (PT.stateSig) settleOpen(document);
    post({ loaded: PT.snap, title: document.title });
    dexInject({}); dexMenu();
  });

  // ================= DEX 연결 (README 「DEX 연결」) =================
  // ① 연동 버튼·「Link more」 → 셸이 DEX 앱 연동 모달을 연다(어디서 열어도 같은 모달)
  var CEXN = { binance: 'Binance', bingx: 'BingX', bitget: 'Bitget', bitunix: 'Bitunix', blofin: 'BloFin', bybit: 'Bybit', deepcoin: 'DeepCoin', flipster: 'Flipster', gate: 'Gate', htx: 'HTX', lbank: 'LBank', mexc: 'MEXC', okx: 'OKX', toobit: 'Toobit', 'woo-x-pro': 'WOO X Pro', zoomex: 'Zoomex' };
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
      [].forEach.call(a.parentNode.querySelectorAll('a[data-orig-href="' + ORIGIN + '/en/brokers"]'), function (b) { b.remove() });
    });
  }
  // 홈 행 → 지갑/UID 상세. 거래소 묶음 행(여러 UID)은 연동 계정 목록 모달
  function dexRowOpen(r) {
    var Sx = window.DEXSTATE; if (!Sx) return;
    var st = Sx.load(), id = r.getAttribute('data-dex-row');
    if (id) { var a = st.accounts.filter(function (x) { return x.id === id })[0]; if (!a) return; st.view = { ex: a.ex, type: a.type, id: a.id, a: a.a || 0, b: a.b || null, st: a.st }; st.viewLogo = null }
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
  // 소유권 심사 결과 전환(테스트용 도움말) — 승인: 연동 완료 · 거절: Ownership verification failed
  function ownHelp(x) {
    var h = document.createElement('div'); h.setAttribute('data-dex-own', '');
    h.style.cssText = 'position:fixed;left:12px;bottom:12px;z-index:2147483646;background:#fff;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.25);padding:10px;font:12px/1.45 system-ui,"Malgun Gothic",sans-serif;color:#1f2430;max-width:260px';
    h.innerHTML = '<b>테스트 · 소유권 심사 결과</b><div style="margin:4px 0 8px;color:#6b7280">' + x.ex + ' ' + (x.type === 'DEX' ? x.id.slice(0, 6) + '…' + x.id.slice(-4) : 'UID ' + x.id) + '</div><button data-r="approved" style="margin-right:6px">승인</button><button data-r="rejected">거절</button>';
    h.addEventListener('click', function (e) {
      var b = e.target.closest('[data-r]'); if (!b) return; e.preventDefault(); e.stopPropagation();
      var Sx = window.DEXSTATE, st = Sx.load(), a = st.accounts.filter(function (y) { return y.id === x.id && y.ex === x.ex })[0]; if (!a) return;
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
    var CHIP = { pend: 'Trying to link', zero: 'No cashback yet', own: 'Verifying ownership', ownfail: 'Ownership verification failed' }, sum = 0, mark = null;
    var oldHelp = document.querySelector('[data-dex-own]'); if (oldHelp) oldHelp.remove();
    st.accounts.forEach(function (x) {
      var amt = Sx.amt(x); if (amt != null) sum += amt;
      var r = tpl.cloneNode(true); r.setAttribute('data-dex-row', x.id);
      var img = q('img', r); img.removeAttribute('srcset'); img.src = '../dex/assets/' + (Sx.LOGO[x.ex] || 'dex-lighter.png'); img.style.borderRadius = '50%';
      q('[class*="__LinkedUidName"]', r).textContent = x.ex;
      q('[class*="__LinkedUidAmount"]', r).textContent = amt == null ? '-' : n2(amt) + ' USDT';
      q('[class*="__LinkedUidNumber"]', r).textContent = x.type === 'DEX' ? 'Wallet ' + x.id.slice(0, 6) + '…' + x.id.slice(-4) : 'UID ' + x.id;
      var dot = q('[class*="__LinkedUidDot"]', r); if (dot && x.st === 'pend' && errCls) dot.classList.add(errCls);
      if (CHIP[x.st]) { var c = document.createElement('span'); c.textContent = CHIP[x.st]; c.style.cssText = 'margin-left:8px;display:inline-flex;align-items:center;border:1px solid #0031c6;color:#0031c6;border-radius:100px;font-size:12px;line-height:16px;padding:2px 8px;white-space:nowrap'; q('[class*="__LinkedUidBadgeRow"]', r).appendChild(c) }
      var before = rows.filter(function (e) { return amtOf(e) < (amt || 0) })[0];
      if (before) top.insertBefore(r, before); else top.appendChild(r);
      if (x.id === st.justLinked) mark = r;
      if (x.st === 'own') ownHelp(x);
    });
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
})();
