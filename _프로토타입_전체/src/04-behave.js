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
