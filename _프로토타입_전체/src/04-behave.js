// ===== 04-behave.js — 화면요소 공통 동작(결정 12차 5항 · 05.리포트/화면요소_정의_전수점검.md) =====
// 목록판(full.html)과 동작판(dex/app.html) 모두에 들어간다. 한 요소의 목적지는 한 곳에서만 정한다.
//  · 고객지원(Live Chat · Contact Support · Chat with support · Speak to us · Report it · 헤드셋) = Zendesk 상담 위젯 자리
//  · 제휴 문의(Affiliate Partner Inquiry · Contact for Partnership) = Tally 폼 새 탭
//  · Notices = Zendesk Help Center 공지 새 탭(🔴 #2 · #3 권장 (a))
//  · 푸터 소셜 = 기존 실사이트 링크 새 탭 · 지원 메일 = 복사
//  · 목록판 전용: 복사 아이콘 · 칩 묶음 단일 선택 · ＋/− 접기 · 라디오 · 체크박스 · 점(캐러셀) · 정렬 머리
(function () {
'use strict';
if (typeof document === 'undefined' || !document.addEventListener) return;
const SITE = () => document.body && document.body.classList.contains('site');
const URLS = {
  tally: 'https://tally.so/r/obEp4N',
  notices: 'https://tethermaxhelp.zendesk.com/hc/en-us/categories/11531697864335-Announcements',
  // 푸터 소셜 — 기존 실사이트 푸터 링크(스냅숏). 1번(Instagram 모양)은 기존 푸터에 없는 아이콘이라 링크 없음
  sns: { 2: 'https://tethermax.tistory.com/', 3: 'https://www.youtube.com/@tethermax', 4: 'https://twitter.com/tethermax', 5: 'https://t.me/tethermax_official' }
};
const txt = el => ((el && (el.innerText || el.textContent)) || '').replace(/\s+/g, ' ').trim();
const SUPPORT_RE = /^(Live Chat|Contact Support|Need help\? Contact Support|Chat with support|Speak to us ?→?|Report it|고객센터 문의)$/i;
const TALLY_RE = /^(Affiliate Partner Inquiry|Contact for Partnership ?→?)$/i;
const open = u => { try { window.open(u, '_blank', 'noopener') } catch (e) { } window.PT_LAST_OPEN = u };

function toast(msg) {
  if (window.siteToast) return window.siteToast(msg);
  const t = document.createElement('div'); t.className = 'bh-toast'; t.setAttribute('role', 'status'); t.textContent = msg;
  document.body.appendChild(t); requestAnimationFrame(() => t.classList.add('in'));
  setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 320) }, 2000);
}
function copy(v) {
  const done = () => toast('Copied.');
  try { navigator.clipboard.writeText(v).then(done, fb) } catch (e) { fb() }
  function fb() { const ta = document.createElement('textarea'); ta.value = v; ta.style.cssText = 'position:fixed;opacity:0'; document.body.appendChild(ta); ta.select(); try { document.execCommand('copy') } catch (e) { } ta.remove(); done() }
}
window.ptCopy = copy;

// ---- Zendesk 상담 위젯 자리(실서비스 = Zendesk Web Widget). 오른쪽 아래에 뜨고 × · Esc로 닫힘 ----
function support() {
  let w = document.getElementById('bh-chat');
  if (w) { w.querySelector('button').focus(); return }
  w = document.createElement('div'); w.id = 'bh-chat'; w.setAttribute('role', 'dialog'); w.setAttribute('aria-label', 'Live Chat');
  w.innerHTML = '<div class="bh-ch"><b>Live Chat</b><button type="button" aria-label="Close">×</button></div><div class="bh-cb"><p>Zendesk 상담 위젯이 열리는 자리입니다(프로토타입).</p><p class="bh-cs">실서비스는 기존 Zendesk 웹 위젯 — 24/7 고객지원.</p></div>';
  document.body.appendChild(w);
  requestAnimationFrame(() => w.classList.add('in'));
  const b = w.querySelector('button'); b.onclick = closeSupport; b.focus();
}
function closeSupport() { const w = document.getElementById('bh-chat'); if (!w) return; w.classList.remove('in'); setTimeout(() => w.remove(), 240) }
window.ptSupport = support;

// ---- 축약 지갑 주소(0x1234…abcd) → 전체 주소 툴팁 — 기존 어두운 툴팁(.ui-tip, 거래소 상세 ⓘ 툴팁과 같은 컴포넌트) 재사용
// 모바일 = 탭(바깥 탭으로 닫힘) · PC = 호버(마우스 이탈로 닫힘). 축약 주소가 나오는 모든 화면(결정 2026-11-27). 행 클릭(상세 이동)과 분리
const SHORT_RE = /^0x[0-9a-fA-F]{4}…[0-9a-fA-F]{4}$/;
function fullOf(el) {
  if (el.dataset && el.dataset.addr) return el.dataset.addr;
  const t = txt(el).replace(/^(Wallet|지갑)\s+/, ''); if (!SHORT_RE.test(t)) return null;
  const [a, b] = t.toLowerCase().split('…'); return (window.PT_ADDRS || []).find(x => x.toLowerCase().startsWith(a) && x.toLowerCase().endsWith(b)) || null;
}
function addrEl(t) { if (!t.closest || t.closest('[data-go],[data-see-all],[data-no-addr-tip],[data-dex-row],.site-hoverrow,[class*="__LinkedUidRow"]')) return null;   // 행 클릭 = 상세(툴팁 없음)
  let e = t.closest('[data-addr]'); if (e) return e; e = t; for (let k = 0; e && k < 2; k++, e = e.parentElement) { if (e.children.length <= 1 && fullOf(e)) return e } return null }
const isMo = () => document.body.classList.contains('pt-mo') || document.body.classList.contains('vp-mo') || window.innerWidth <= 1024;
function addrTip(el, toggle) {
  const old = document.querySelector('.ui-tip[data-addr-tip]'); if (old) { const same = old._for === el; old.remove(); if (same && toggle) return }
  const full = fullOf(el); if (!full) return;
  const t = document.createElement('div'); t.className = 'ui-tip'; t.setAttribute('data-addr-tip', ''); t.setAttribute('role', 'tooltip'); t._for = el;
  t.style.cssText = 'position:fixed;z-index:3002';
  t.textContent = full; document.body.appendChild(t);
  const r = el.getBoundingClientRect(); t.style.left = Math.max(8, Math.min(r.left, innerWidth - t.offsetWidth - 8)) + 'px'; t.style.top = (r.bottom + 4) + 'px';   // 축약 주소 바로 아래, 주소 시작 위치(Figma 29484:181385 등)
  t.style.transformOrigin = 'left top'; void t.offsetWidth; t.style.opacity = 1; t.style.transform = 'none';   // 기존 툴팁 등장(03-motion .ui-tip): 75% → 100% · 페이드
}
const tipOff = () => { const tip = document.querySelector('.ui-tip[data-addr-tip]'); if (tip) tip.remove() };
document.addEventListener('mouseover', e => { if (isMo()) return; const el = e.target && e.target.closest ? addrEl(e.target) : null; if (el) addrTip(el, false); else if (document.querySelector('.ui-tip[data-addr-tip]') && !(e.target.closest && e.target.closest('[data-addr-tip]'))) tipOff() });
window.addEventListener('scroll', tipOff, { passive: true });
window.ptAddrTip = addrTip;

// ---- 가입 링크 `Register here` = 선택 거래소의 테더맥스 레퍼럴 가입 새 탭(REQ-053 · 결정 2026-11-27) ----
// 레퍼럴 주소는 어드민 거래소 데이터 값. 프로토타입 소스에 있는 값만 쓰고, 없는 거래소는 주소를 지어내지 않는다
const REF = { Lighter: 'https://app.lighter.xyz/?referral=TETHERMAX' };
function refSignup(ex) {
  if (REF[ex]) return open(REF[ex]);
  window.PT_LAST_OPEN = 'referral:' + (ex || '');
  toast((ex ? ex + ' ' : '') + '레퍼럴 가입 페이지가 새 탭으로 열려요 — 주소는 어드민 거래소 값 (프로토타입)');
}
window.ptRefSignup = refSignup;

// ---- 공통 목적지: 캡처 단계에서 먼저 처리(두 판의 다른 클릭 처리보다 앞) ----
window.addEventListener('click', e => {
  const t = e.target; if (!t || !t.closest) return;
  if (t.closest('#pt-bar,#pt-side')) return;
  const stop = () => { e.preventDefault(); e.stopImmediatePropagation() };
  const sns = t.closest('.fsns img,.fsns span');
  if (sns) {
    const img = sns.tagName === 'IMG' ? sns : sns.querySelector('img');
    const m = img && /cmn-fa-sns-(\d)/.exec(img.getAttribute('src') || ''); const n = m && +m[1];
    stop(); if (n && URLS.sns[n]) open(URLS.sns[n]); else toast('기존 푸터에 없는 소셜 — 링크 없음 (프로토타입)'); return;
  }
  if (t.closest('.fmail')) { stop(); return copy('support@tethermax.io') }
  const ad = addrEl(t);
  if (ad) { stop(); return isMo() ? addrTip(ad, true) : null }   // 모바일 = 탭 · PC = 호버(누르면 이동하지 않음)
  if (!t.closest('[data-addr-tip]')) tipOff();
  if (t.closest('[data-full-flow]')) {
    stop(); const toFlow = () => { const f = document.getElementById('dex-flow'); if (!f) return; const off = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pt-bar-h')) || 0) + 80; const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: f.getBoundingClientRect().top + window.scrollY - off, behavior: rm ? 'auto' : 'smooth' }) };
    if (SITE() && window.SITE_API) { SITE_API.closeLayer(); setTimeout(toFlow, 320) } else if (!SITE() && window.go && S.screen === 'dex.detail') { go('dex.detail:' + (S.auth === 'guest' ? 'normal' : S.auth === 's3' ? 'unlinked' : 'linked'), { noPush: true }); setTimeout(toFlow, 50) }
    return;
  }
  const rs = t.closest('[data-ref-signup]');
  if (rs) { stop(); return refSignup(rs.dataset.refSignup || (window.LINKX && LINKX.sel && LINKX.sel()) || '') }
  const el = t.closest('[data-go],button,a,[role="button"],span,div');
  if (!el) return;
  const go = el.closest('[data-go]') && el.closest('[data-go]').dataset.go;
  const lab = txt(t.closest('button,a,[data-go]') || el).slice(0, 60);
  if (go === 'support.main' || t.closest('.fchat') || (t.closest('button,a,[data-go]') && SUPPORT_RE.test(lab))) { stop(); return support() }
  if (go === 'partner.apply' || (t.closest('button,a,[data-go]') && TALLY_RE.test(lab))) { stop(); return open(URLS.tally) }
  if (go === 'notice.list' && /^Notices$/.test(lab)) { stop(); return open(URLS.notices) }
}, true);
document.addEventListener('keydown', e => { if (e.key === 'Escape' && document.getElementById('bh-chat')) { e.stopImmediatePropagation(); closeSupport() } }, true);

// ---- 목록판 전용 화면 안 동작(동작판은 site.js · site2.js가 같은 동작을 가진다) ----
document.addEventListener('click', e => {
  if (SITE()) return;
  const fr = document.getElementById('pt-frame'); const t = e.target;
  if (!fr || !t || !t.closest || !fr.contains(t)) return;
  if (t.closest('[data-go]')) return;
  // 맥스보드 섹션 이동 탭(위 고정) · 전체 일정 펼침(MB-REQ-126 · 123)
  const mt = t.closest('[data-mb-tab]');
  if (mt) {
    const k = mt.dataset.mbTab, sec = fr.querySelector('[data-mb-sec="' + k + '"]'), bar = fr.querySelector('[data-mb-tabs]');
    fr.querySelectorAll('[data-mb-tab]').forEach(x => x.classList.toggle('on', x === mt));
    if (sec) { const off = (parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--pt-bar-h')) || 0) + (bar ? bar.offsetHeight : 0); const y = sec.getBoundingClientRect().top + window.scrollY - off; const rm = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches; window.scrollTo({ top: y, behavior: rm ? 'auto' : 'smooth' }) }
    return;
  }
  const ms = t.closest('[data-mb-sched]');
  if (ms) { const body = ms.closest('section') && ms.closest('section').querySelector('[data-mb-sched-body]'); if (body) { body.hidden = !body.hidden; ms.setAttribute('aria-expanded', String(!body.hidden)); const ic = ms.querySelector('img,svg'); if (ic) ic.style.transform = body.hidden ? '' : 'rotate(180deg)' } return }
  // 복사 아이콘
  const ci = t.closest('img[src*="copy"],button,span');
  const cimg = ci && (ci.tagName === 'IMG' ? ci : ci.querySelector && ci.querySelector(':scope > img[src*="copy"]'));
  if (cimg && /copy/.test(cimg.getAttribute('src') || '')) {
    const host = cimg.closest('[data-copy]') || cimg.parentElement;
    const v = (host.dataset && host.dataset.copy) || txt(host) || txt(host.parentElement);
    e.preventDefault(); return copy(v);
  }
  // 주소 Paste(목록판) — 클립보드 주소로 바로 채움 → 형식 통과 상태
  if (t.closest('[data-paste]')) { e.preventDefault(); return go('link.addr:valid') }
  // 이메일 인증 Paste(목록판) — 6칸을 채우고 Verify 활성
  if (t.closest('[data-otp-paste]')) { e.preventDefault(); fr.querySelectorAll('[data-otp-i]').forEach((x, i) => x.value = '123456'[i]); const v = fr.querySelector('[data-otp-verify]'); if (v) v.disabled = false; return }
  // 라디오(퀴즈 보기 등): 같은 묶음 안 단일 선택
  const rd = t.closest('label.radio');
  if (rd) { const g = rd.parentElement; g.querySelectorAll(':scope > label.radio').forEach(x => x.classList.toggle('on', x === rd)); return }
  // 칩 묶음: 이동이 없는 칩은 같은 줄 안에서 하나만 선택
  const ch = t.closest('.chip');
  if (ch && ch.parentElement) {
    const sib = [...ch.parentElement.children].filter(x => x.classList.contains('chip'));
    if (sib.length > 1) { sib.forEach(x => x.classList.toggle('on', x === ch)); return }
  }
  // ＋/− 접기(FAQ · Terms & Conditions): 머리 줄 끝의 ＋/−를 바꾸고, 바로 뒤 답변이 있으면 펼침/접힘. FAQ 묶음은 하나만 펼침
  const isSign = el => el && /^[+−]$/.test(txt(el));
  const head = t.closest('.row');
  if (head && isSign(head.lastElementChild)) {
    const p = head.parentElement;
    const item = p && p.firstElementChild === head && !p.classList.contains('col') ? p : head;   // 머리 + 답변 묶음이면 그 묶음
    const headOf = it => it.classList.contains('row') ? it : it.querySelector(':scope > .row');
    const opening = txt(head.lastElementChild) === '+';
    if (opening && item.parentElement) [...item.parentElement.children].forEach(it => {
      if (it === item) return; const h = headOf(it); if (!h || !isSign(h.lastElementChild) || txt(h.lastElementChild) !== '−') return;
      h.lastElementChild.textContent = '+'; if (it !== h && h.nextElementSibling) h.nextElementSibling.hidden = true;
    });
    head.lastElementChild.textContent = opening ? '−' : '+';
    if (item !== head && head.nextElementSibling) head.nextElementSibling.hidden = !opening;
    return;
  }
}, false);

// ---- 이벤트 목록(두 판 공통 — 목록판 events.list · 동작판 #/events): 탭 전환 · 거래소 필터(칩·체크·셀렉트·모바일 시트) · 카드 거르기 · Join Now ----
// 탭 = 밑줄 이동 + 목록 교체(REQ-437 · 결정 D3 3탭) · 칩(Figma A1 29069:6595 · 29190:123385~123515) = 그룹 거르기 + 첫 행 `All {CEX|DEX} exchanges`
// 셀렉트 = PC 드롭다운(클릭 펼침·유지, 바깥·Esc 닫힘) / 모바일 바텀시트(Close · Apply (n)) · 선택 = 셀렉트 `{첫 거래소}+{n}`, 카드는 선택한 거래소만(없으면 전체)
(function () {
  const EV_ALL = { All: 'All Exchanges', CEX: 'All CEX exchanges', DEX: 'All DEX exchanges' };
  const reduced = () => (window.UI && UI.reduced && UI.reduced()) || (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches);
  const fade = el => { if (el && el.animate && !reduced()) el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 300, easing: 'ease-out' }) };
  const on = r => r.querySelector('.chk').classList.contains('on');
  const set = (r, v) => { r.querySelector('.chk').classList.toggle('on', v); r.setAttribute('aria-checked', v) };
  const items = box => [...box.querySelectorAll('[data-ev-grp] [data-ev-check]')];
  const scope = box => items(box).filter(r => !r.closest('[data-ev-grp]').hidden);
  const selOf = box => items(box).filter(on).map(r => r.dataset.evCheck);
  const syncAll = box => { const a = box.querySelector('[data-ev-check="All Exchanges"]'), sc = scope(box); if (a) set(a, sc.length > 0 && sc.every(on)) };
  const label = sel => sel.length ? sel[0] + (sel.length > 1 ? '+' + (sel.length - 1) : '') : 'All Exchanges';
  const toast = msg => { if (window.siteToast) return window.siteToast(msg); const d = document.createElement('div'); d.className = 'bh-toast'; d.setAttribute('role', 'status'); d.textContent = msg; document.body.appendChild(d); requestAnimationFrame(() => d.classList.add('in')); setTimeout(() => { d.classList.remove('in'); setTimeout(() => d.remove(), 320) }, 2200) };
  function filterCards(root, sel) { root.querySelectorAll('[data-ev-list] [data-ev-ex]').forEach(c => { c.hidden = sel.length > 0 && !sel.includes(c.dataset.evEx) }) }
  function apply(root, sel) { root.dataset.evSel = sel.join(','); const lab = root.querySelector('[data-ev-label]'); if (lab) lab.textContent = label(sel); filterCards(root, sel) }
  function ddOpen(root, open) {
    const dd = root.querySelector('[data-ev-dd]'), tr = root.querySelector('[data-ev-open]'); if (!dd) return;
    if (open === dd.hidden) { dd.hidden = !open; if (open) fade(dd) }
    if (tr) tr.setAttribute('aria-expanded', String(!dd.hidden));
  }
  function sheetOpen(root, open) {
    const sh = root.querySelector('[data-ev-sheet]'); if (!sh) return;
    if (open) {   // 열 때 지금 적용된 선택을 시트에 복사
      const cur = (root.dataset.evSel || '').split(',').filter(Boolean), box = sh.querySelector('[data-ev-filter]');
      items(box).forEach(r => set(r, cur.includes(r.dataset.evCheck))); syncAll(box);
      const ap = sh.querySelector('[data-ev-apply]'); if (ap) ap.textContent = 'Apply (' + cur.length + ')';
      sh.hidden = false; const panel = sh.firstElementChild;
      if (panel && panel.animate && !reduced()) panel.animate([{ transform: 'translateY(100%)' }, { transform: 'none' }], { duration: 280, easing: 'cubic-bezier(.2,0,0,1)' });
      document.body.style.overflow = 'hidden';
    } else { sh.hidden = true; document.body.style.overflow = '' }
  }
  document.addEventListener('click', e => {
    const t = e.target; if (!t || !t.closest) return;
    const root = t.closest('[data-ev-root]');
    if (!root || !t.closest('[data-ev-dd],[data-ev-open]')) document.querySelectorAll('[data-ev-root]').forEach(r => { if (r !== root || !t.closest('[data-ev-dd]')) ddOpen(r, false) });
    if (!root || t.closest('[data-go]')) return;
    const stop = () => { e.preventDefault(); e.stopPropagation() };
    const tab = t.closest('[data-ev-tab]');
    if (tab) {
      stop(); const k = tab.dataset.evTab;
      root.querySelectorAll('[data-ev-tab]').forEach(x => { x.classList.toggle('on', x === tab); x.setAttribute('aria-selected', String(x === tab)) });
      const lists = [...root.querySelectorAll('[data-ev-list]')], to = lists.find(l => l.dataset.evList === k); if (!to || !to.hidden) return;
      lists.forEach(l => { l.hidden = l !== to }); fade(to); return;
    }
    const join = t.closest('[data-ev-join]');
    if (join) { stop(); const ex = join.dataset.evJoin; window.PT_LAST_OPEN = 'event:' + ex; return toast(ex + ' 이벤트 페이지가 새 탭으로 열려요 — 링크는 어드민 이벤트 값 (프로토타입)') }
    if (t.closest('[data-ev-open]')) { stop(); if (root.querySelector('[data-ev-sheet]')) return sheetOpen(root, true); const dd = root.querySelector('[data-ev-dd]'); return ddOpen(root, !!(dd && dd.hidden)) }
    const sh = root.querySelector('[data-ev-sheet]');
    if (sh && !sh.hidden) {
      if (t.closest('[data-ev-close]') || t === sh) { stop(); return sheetOpen(root, false) }
      if (t.closest('[data-ev-apply-go]')) { stop(); apply(root, selOf(sh.querySelector('[data-ev-filter]'))); return sheetOpen(root, false) }
    }
    const chip = t.closest('[data-ev-chip]');
    if (chip) {
      stop(); const box = chip.closest('[data-ev-filter]'), k = chip.dataset.evChip;
      box.querySelectorAll('[data-ev-chip]').forEach(x => x.classList.toggle('on', x === chip));
      const run = () => { box.querySelectorAll('[data-ev-grp]').forEach(g => { g.hidden = k !== 'All' && g.dataset.evGrp !== k }); const al = box.querySelector('[data-ev-alllab]'); if (al) al.textContent = EV_ALL[k]; syncAll(box) };
      if (window.UI && UI.heightFx) UI.heightFx(() => box, run); else run(); return;
    }
    const ck = t.closest('[data-ev-check]');
    if (ck) {
      stop(); const box = ck.closest('[data-ev-filter]');
      if (ck.dataset.evCheck === 'All Exchanges') { const v = !on(ck); scope(box).forEach(r => set(r, v)); set(ck, v) } else { set(ck, !on(ck)); syncAll(box) }
      const inSheet = ck.closest('[data-ev-sheet]'), sel = selOf(box);
      const ap = (inSheet || root).querySelector('[data-ev-apply]'); if (ap) ap.textContent = 'Apply (' + sel.length + ')';
      if (!inSheet) apply(root, sel);
      return;
    }
  }, false);
  // 인라인 display(grid·flex)가 hidden 속성을 덮지 않게 · Figma A1 유형 칩(선택 = 파랑 채움 · 나머지 = 회색 채움)
  try { const st = document.createElement('style'); st.textContent = '[data-ev-root] [hidden]{display:none!important}[data-ev-chips] .chip{border:0;background:#eef0f3;color:rgba(0,0,0,.87);height:32px;padding:0 16px;border-radius:100px;font-size:14px;font-weight:600;cursor:pointer;transition:background-color .3s,color .3s}[data-ev-chips] .chip.on{background:var(--blue,#0031c6);color:#fff}'; (document.head || document.documentElement).appendChild(st) } catch (x) { }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') document.querySelectorAll('[data-ev-root]').forEach(r => { ddOpen(r, false); const sh = r.querySelector('[data-ev-sheet]'); if (sh && !sh.hidden) sheetOpen(r, false) });
    if ((e.key === 'Enter' || e.key === ' ') && e.target && e.target.matches && e.target.matches('[data-ev-root] [data-ev-tab],[data-ev-root] [data-ev-chip],[data-ev-root] [data-ev-check],[data-ev-root] [data-ev-open]')) { e.preventDefault(); e.target.click() }
  });
})();

// 목록판 오른쪽 아래 위젯·토스트 모양
const css = document.createElement('style');
css.textContent = `#bh-chat{position:fixed;right:24px;bottom:24px;width:340px;max-width:calc(100vw - 32px);background:#fff;border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.22);z-index:3000;overflow:hidden;font:14px/1.5 Inter,system-ui,sans-serif;opacity:0;transform:translateY(16px);transition:opacity var(--m-modal,.22s) var(--e-std,ease),transform var(--m-modal,.22s) var(--e-std,ease)}
#bh-chat.in{opacity:1;transform:none}
#bh-chat .bh-ch{display:flex;justify-content:space-between;align-items:center;background:#0031c6;color:#fff;padding:12px 16px}#bh-chat .bh-ch button{background:none;border:0;color:#fff;font-size:22px;line-height:1;cursor:pointer}
#bh-chat .bh-cb{padding:16px;color:#212121;min-height:120px}#bh-chat .bh-cs{color:#6b7385;font-size:12px}
.bh-toast{position:fixed;left:50%;bottom:32px;transform:translate(-50%,12px);background:#323232;color:#fff;border-radius:4px;padding:10px 16px;font:14px Inter,system-ui,sans-serif;z-index:3001;opacity:0;transition:opacity .3s,transform .3s}
.bh-toast.in{opacity:1;transform:translate(-50%,0)}
@media (prefers-reduced-motion:reduce){#bh-chat,.bh-toast{transition:none}}`;
(document.head || document.documentElement).appendChild(css);
})();

