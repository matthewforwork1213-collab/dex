// 135-notify.js — 알림 목록 (GNB 벨 → Notifications 패널 · 모바일 웹 /{lang}/alarm 페이지)
// 정의: 05.리포트/알림목록_정의.md — dev 실서비스 실측(2026-11-27, www-dev.tethermax.io) + 정책 10장 · 부록 D-5 · REQ-464 · REQ-471 · REQ-660
// 공용 파일: 화면 목록판(build.cjs) · 실제 동작판(dex/app.html, build-site.cjs가 src를 그대로 묶음) · 실사이트 스냅숏(pt-runtime.js가 이 파일을 그대로 불러 씀).
//   그래서 R · C · S · T 없이도 돈다(있으면 쓴다). 화면 목록판 화면 등록(cmn.notify)은 R이 있을 때만.
// 실측 동작(dev): 벨 → 패널(480×640, 벨 아래 16px) · 열면 목록 조회 후 안 읽은 알림을 모두 읽음 처리 → 빨간 점 사라짐 · 항목 클릭 = 이동 없음(moveType 미사용)
//   · X · 바깥 클릭 · Esc로 닫힘 · 빈 목록/조회 실패 = `No Notifications` 빈 상태 · 시각 = UTC → 로컬 `MM.DD HH:mm`(타임존 라벨 없음)
//   · 모바일 웹은 패널이 아니라 /alarm 페이지(← + `Notifications`)로 이동.
(function () {
if (window.NOTIFY) return;
const lang = () => (typeof S !== 'undefined' && S.lang) || 'en';
const tx = (en, ko) => lang() === 'ko' && ko != null ? ko : en;
const p2 = n => String(n).padStart(2, '0');
const when = iso => { const d = new Date(iso); return `${p2(d.getMonth() + 1)}.${p2(d.getDate())} ${p2(d.getHours())}:${p2(d.getMinutes())}` };   // dev: dayjs.utc(createDt).local().format('MM.DD HH:mm')
const short = w => w.slice(0, 6) + '…' + w.slice(-4);    // 푸시 마스킹 앞 6 + 뒤 4 (G-279)
const usd = n => (Math.floor(n * 100 + 1e-6) / 100).toFixed(2);
const h = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

// ---- 알림 종류 — 문구는 원문 그대로(정의 문서 3장 표). ko 없음 = 국문 언어팩 확인(영문 표시)
// go: 항목 클릭 목적지. 기존 CEX = 없음(dev 실측) · DEX = REQ-660 지갑 상세 딥링크를 웹 패널에도 적용(정의 문서 「결정 필요 N-1」)
const TPL = {
 INTEGRATION_FAIL: { fcm: 23, en: ['💡 UID linking failed', '{ex} {uid} linking failed. Please try again.'] },                 // dev 실측
 NEW_EVENT_REGIST: { fcm: 27, en: ['🎉 New Event Registered!', 'New {ex} event you might like has just been added.'] },       // dev 실측
 DEX_LINK_DONE: { fcm: 100, en: ['💡 Wallet Binding Completed', '{ex} wallet {w} binding completed.'], ko: ['💡 지갑 연동완료 알림', '{ex} {w} 연동이 완료되었어요'], go: 'wallet' },
 DEX_LINK_FAIL: { fcm: 101, en: ['💡 Wallet Binding Failed', '{ex} wallet {w} binding failed. Please check the reason.'], ko: ['💡 지갑 연동실패 알림', '{ex} {w} 연동에 실패했어요. 사유를 확인해 주세요'], go: 'home' },
 DEX_CASHBACK: { fcm: 103, en: ['💡 Cashback Added', '{amt} USDT {ex} cashback has been added. Check your withdrawable balance.'], ko: ['💡 캐시백 적립 알림', '{ex} 캐시백 {amt} USDT가 적립됐어요. 출금 가능 금액을 확인해 보세요'], go: 'wallet' },
 DEX_WD_DONE: { fcm: 104, en: ['💡 Withdrawal Success', '[{ex} {w}] {amt} USDT withdrawal completed.'], ko: ['💡 출금 완료 알림', '{ex} {w}로 {amt} USDT가 출금되었습니다.'], go: 'wallet' },
};
const fill = (s, v) => s.replace(/\{(\w+)\}/g, (m, k) => v[k] != null ? (k === 'w' ? short(v[k]) : v[k]) : m);

// ---- 목록 = 기존 CEX 표본(dev 실측 3건, 읽음) + DEX 연동 계정에서 만든 DEX 알림(안 읽음)
const CEX = [
 { id: 'c-23-1', code: 'INTEGRATION_FAIL', v: { ex: 'HTX', uid: '312312****' }, t: '2026-11-27T03:17:00Z', read: 1 },
 { id: 'c-27-1', code: 'NEW_EVENT_REGIST', v: { ex: 'tetherMax' }, t: '2026-11-17T07:10:53Z', read: 1 },
 { id: 'c-27-2', code: 'NEW_EVENT_REGIST', v: { ex: 'WOO X Pro' }, t: '2026-11-12T08:43:59Z', read: 1 },
];
// 연동 계정 표본(dex/dex-state.js seed와 같음) — DEXSTATE가 있으면 그 값을 쓴다
const SEED = [{ ex: 'Lighter', type: 'DEX', id: '0x7a3F9c2B8e41D05a6F3b7C91e2D4a8B0c6E551e9', a: 100, b: 20, st: 'ok' }, { ex: 'ApeX', type: 'DEX', id: '0x91c4E2a7B5d03F6c8A1e9D2b7C4f6A3e8B05a07b', a: 14, b: 0, st: 'ok' }];
let accSrc = () => (window.DEXSTATE && DEXSTATE.load().accounts) || SEED;
function dexItems() {
 const out = [], base = Date.parse('2026-11-27T05:40:00Z');
 accSrc().filter(x => x.type === 'DEX').forEach((x, i) => {
  const at = k => new Date(x.ts || (base - (i * 3 + k) * 3600e3)).toISOString(), acc = { ex: x.ex, id: x.id };
  if (x.st === 'fail') out.push({ id: `d-101-${x.ex}-${x.id}`, code: 'DEX_LINK_FAIL', v: { ex: x.ex, w: x.id }, t: at(0), acc });
  if (x.st === 'ok' || x.st === 'zero') {
   if (x.st === 'ok' && x.a > 0) out.push({ id: `d-103-${x.ex}-${x.id}`, code: 'DEX_CASHBACK', v: { ex: x.ex, amt: usd(x.a) }, t: at(0), acc });
   if (i === 0 && x.st === 'ok') out.push({ id: `d-104-${x.ex}-${x.id}`, code: 'DEX_WD_DONE', v: { ex: x.ex, w: x.id, amt: '10.00' }, t: at(1), acc });
   out.push({ id: `d-100-${x.ex}-${x.id}`, code: 'DEX_LINK_DONE', v: { ex: x.ex, w: x.id }, t: at(2), acc });
  }
 });
 return out;
}

// ---- 상태: mode(normal · empty · fail) + 읽은 id. 세션 동안 유지(실사이트 스냅숏은 페이지마다 새로 열리므로)
const KEY = 'tm-notify-v1';
let st = { mode: 'normal', read: {} };
try { Object.assign(st, JSON.parse(sessionStorage.getItem(KEY) || '{}')) } catch (e) { }
const save = () => { try { sessionStorage.setItem(KEY, JSON.stringify(st)) } catch (e) { } };
function list() {
 if (st.mode !== 'normal') return [];
 return [...dexItems(), ...CEX].map(x => ({ ...x, read: x.read || !!st.read[x.id] })).sort((a, b) => Date.parse(b.t) - Date.parse(a.t));
}
const unread = () => st.mode === 'normal' && list().some(x => !x.read);   // 조회 실패면 점 숨김(REQ-471)
function markAll() { list().forEach(x => { st.read[x.id] = 1 }); save(); refresh() }   // dev: 목록을 받으면 readYn=N 항목마다 update-push-readyn → 안 읽음 0

// ---- 스타일 — dev 실측(AlarmCenterPopup · NotificationItem · EmptyList · AlarmHeader · AlertPoint) · 전환 = MUI Grow 실측값
const CSS = `
.nt-scrim{position:fixed;inset:0;z-index:1300;background:transparent}
.nt-pop{position:fixed;z-index:1301;width:480px;height:640px;max-width:calc(100% - 32px);max-height:calc(100% - 32px);box-sizing:border-box;background:#fff;border-radius:4px;display:flex;flex-direction:column;overflow:hidden;text-align:left;
 box-shadow:0 8px 24px rgba(0,0,0,.12),0 2px 8px rgba(0,0,0,.08),0 4px 4px rgba(0,0,0,.25);transform-origin:right top;font-family:inherit;color:rgba(0,0,0,.87)}
.nt-pop.nt-inline{position:absolute;z-index:30;max-height:none}
.nt-head{flex:none;display:flex;align-items:center;justify-content:space-between;padding:4px 8px 4px 16px}
.nt-title{margin:0;font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.15px;color:#1a1b1c}
.nt-x,.nt-back{display:inline-flex;align-items:center;justify-content:center;padding:8px;border:0;border-radius:50%;background:transparent;cursor:pointer;color:rgba(0,0,0,.56)}
.nt-x:hover,.nt-back:hover{background:rgba(0,0,0,.04)}
.nt-x svg,.nt-back svg{width:24px;height:24px;fill:currentColor;display:block}
.nt-body{flex:1;min-height:0;display:flex;flex-direction:column;overflow-y:auto;background:#fff}
.nt-body::-webkit-scrollbar{width:4px}.nt-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.12);border-radius:4px}
.nt-item{display:flex;justify-content:space-between;gap:16px;width:100%;min-height:75px;padding:16px 24px;box-sizing:border-box;transition:background-color .3s}
.nt-item[data-nt-go]{cursor:pointer}
.nt-h{display:flex;flex-direction:column;gap:4px;min-width:0}
.nt-t{margin:0;font-size:14px;font-weight:500;line-height:1.43;letter-spacing:.17px;color:rgba(0,0,0,.87)}
.nt-d{font-size:14px;font-weight:400;line-height:1.43;letter-spacing:.17px;color:rgba(0,0,0,.6);word-break:break-word}
.nt-date{flex:none;align-self:flex-start;white-space:nowrap;font-size:12px;line-height:1.66;letter-spacing:.4px;color:rgba(0,0,0,.6)}
.nt-empty{flex:auto;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;width:100%;max-width:325px;min-height:220px;margin:auto;text-align:center}
.nt-empty b{font-size:16px;font-weight:600;line-height:1.5;letter-spacing:.15px;color:rgba(0,0,0,.87)}
.nt-empty span{font-size:16px;line-height:1.5;letter-spacing:.15px;color:rgba(0,0,0,.6)}
.nt-page{position:fixed;z-index:1301;display:flex;flex-direction:column;background:#fff;font-family:inherit;color:rgba(0,0,0,.87);text-align:left}
.nt-page.nt-inline{position:relative;min-height:756px}
.nt-mhead{flex:none;display:flex;align-items:center;gap:8px;height:64px;padding-left:8px;background:#f8fafc}
.nt-mtitle{font-size:20px;font-weight:500;line-height:1.6;letter-spacing:.15px;color:rgba(0,0,0,.87)}
.nt-on{background:rgba(0,0,0,.12)!important}
.nt-bell,.gnb button[title="Notifications"],[data-notify-bell]{position:relative}
.nt-dot{position:absolute;width:8px;height:8px;border-radius:100px;background:#d32f2f;pointer-events:none}
.nt-dot.pc{right:9px;top:8px}.nt-dot.mo{right:2px;top:2px}.nt-dot.live-pc{right:6px;top:6px;background:#d74c45}.nt-dot.live-mo{right:2px;top:2px}
`;
function injectCss() { if (document.getElementById('nt-css')) return; const s = document.createElement('style'); s.id = 'nt-css'; s.textContent = CSS; (document.head || document.documentElement).appendChild(s) }
injectCss();

const IC_X = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.3 5.71a.996.996 0 0 0-1.41 0L12 10.59 7.11 5.7a.996.996 0 0 0-1.41 0c-.39.39-.39 1.02 0 1.41L10.59 12 5.7 16.89c-.39.39-.39 1.02 0 1.41s1.02.39 1.41 0L12 13.41l4.89 4.89c.39.39 1.02.39 1.41 0s.39-1.02 0-1.41L13.41 12l4.89-4.89c.38-.38.38-1.02 0-1.4"/></svg>';
const IC_BACK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 11H7.83l4.88-4.88c.39-.39.39-1.03 0-1.42a.996.996 0 0 0-1.41 0l-6.59 6.59a.996.996 0 0 0 0 1.41l6.59 6.59a.996.996 0 1 0 1.41-1.41L7.83 13H19c.55 0 1-.45 1-1s-.45-1-1-1"/></svg>';

// ---- 마크업
function itemHTML(x) {
 const T0 = TPL[x.code], ko = lang() === 'ko' && T0.ko, src = ko ? T0.ko : T0.en, go = T0.go ? ` data-nt-go="${T0.go}"` : '';
 return `<div class="nt-item" data-nt-id="${h(x.id)}"${go}><div class="nt-h"><h4 class="nt-t">${h(fill(src[0], x.v))}</h4><span class="nt-d">${h(fill(src[1], x.v))}</span></div><span class="nt-date">${when(x.t)}</span></div>`;
}
// 빈 상태 — 언어팩 `no Notifications` · `no Notifications desc`(원문 그대로: 영문 원문에 아포스트로피가 빠져 있음 — 정의 문서 결정 필요 N-4)
const emptyHTML = () => `<div class="nt-empty"><b>${tx('No Notifications', '알림 없음')}</b><span>${tx('Youre all caught up. Well notify you when there`s an update.', '모든 소식을 확인하셨습니다. 업데이트가 있으면 알려드릴게요.')}</span></div>`;
const bodyHTML = () => { const L = list(); return `<div class="nt-body">${L.length ? L.map(itemHTML).join('') : emptyHTML()}</div>` };
const title = () => tx('Notifications', '알림');   // 언어팩 `alarm title`
function popHTML(cls = '') { return `<div class="nt-pop ${cls}" role="dialog" aria-label="${title()}"><div class="nt-head"><p class="nt-title">${title()}</p><button class="nt-x" aria-label="close">${IC_X}</button></div>${bodyHTML()}</div>` }
function pageHTML(cls = '') { return `<div class="nt-page ${cls}" role="dialog" aria-label="${title()}"><div class="nt-mhead"><button class="nt-back" aria-label="back">${IC_BACK}</button><span class="nt-mtitle">${title()}</span></div>${bodyHTML()}</div>` }

// ---- 빨간 점
const BELL = '.gnb button[title="Notifications"],[data-notify-bell],[class*="__AlarmButton"],[class*="__NotiBell"]';
const dotKind = b => b.matches('[class*="__AlarmButton"]') ? 'live-pc' : b.matches('[class*="__NotiBell"]') ? 'live-mo' : b.matches('[data-notify-bell]') ? 'mo' : 'pc';
const specScreen = () => typeof S !== 'undefined' && S.screen === 'cmn.header';   // 헤더 명세 화면은 자기 상태(unread · bellFail)대로 그린다
function dot(kind = 'pc') { return unread() && !specScreen() ? `<i class="nt-dot ${kind}" data-nt-dot></i>` : '' }
function refresh() {
 const bells = [...document.querySelectorAll(BELL)];
 bells.forEach(b => b.classList.add('nt-bell'));   // 속성 변경만 — 아래 관찰자는 자식 변경만 본다
 const want = unread() && !specScreen();
 // 바뀔 것이 있을 때만 DOM을 건드린다(다른 관찰자와 서로 깨우지 않게)
 document.querySelectorAll('[data-nt-dot]').forEach(e => { const b = e.parentElement; if (!want || !b || !b.matches(BELL) || b.closest('[data-nt-static]') || b.querySelectorAll(':scope > [data-nt-dot]')[0] !== e) e.remove() });
 if (!want) return;
 bells.forEach(b => { if (!b.closest('[data-nt-static]') && !b.querySelector(':scope > [data-nt-dot]')) b.insertAdjacentHTML('beforeend', `<i class="nt-dot ${dotKind(b)}" data-nt-dot></i>`) });
}

// ---- 열기 · 닫기
const RM = window.matchMedia ? matchMedia('(prefers-reduced-motion: reduce)') : null;
const reduced = () => !!(RM && RM.matches);
const E_STD = 'cubic-bezier(.4,0,.2,1)';   // --e-std (MUI Grow 실측: 불투명도 384ms · 크기 256ms)
let cur = null;   // {el, scrim, bell, kind}
function close(now) {
 if (!cur) return; const c = cur; cur = null;
 if (c.bell) c.bell.classList.remove('nt-on');
 document.documentElement.style.overflow = c.ov || '';
 document.removeEventListener('keydown', onKey, true);
 if (c.scrim) c.scrim.remove();
 if (now || reduced() || c.kind === 'page' || !c.el.animate) return c.el.remove();
 try {
  c.el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 384, easing: E_STD, fill: 'forwards' });
  const a = c.el.animate([{ transform: 'none' }, { transform: 'scale(.75,.5625)' }], { duration: 256, delay: 128, easing: E_STD, fill: 'forwards' });
  a.onfinish = () => c.el.remove();
 } catch (e) { c.el.remove() }
}
const onKey = e => { if (e.key === 'Escape' && cur && cur.kind === 'pop') { e.preventDefault(); close() } };
function frameBox() {
 const fr = document.querySelector('.pt-frame'); const bar = document.getElementById('pt-bar');
 if (!fr) return { left: 0, right: innerWidth, top: 0, width: innerWidth };
 const r = fr.getBoundingClientRect(); return { left: r.left, right: r.right, top: Math.max(r.top, bar ? bar.offsetHeight : 0), width: r.width };
}
function open(bell, kind) {
 close(true); injectCss();
 const box = frameBox();
 if (kind === 'page') {   // 모바일 웹: 실사이트는 /alarm 페이지로 이동(즉시 — 페이지 이동은 전환 없음)
  const w = document.createElement('div'); w.innerHTML = pageHTML(); const el = w.firstElementChild;
  Object.assign(el.style, { left: box.left + 'px', width: box.width + 'px', top: box.top + 'px', bottom: '0' });
  document.body.appendChild(el);
  cur = { el, kind: 'page', ov: document.documentElement.style.overflow }; document.documentElement.style.overflow = 'hidden';
 } else {
  const r = bell.getBoundingClientRect();
  const scrim = document.createElement('div'); scrim.className = 'nt-scrim';
  const w = document.createElement('div'); w.innerHTML = popHTML(); const el = w.firstElementChild;
  const right = Math.min(r.right + 150, box.right - 16);   // dev: 벨 오른쪽 끝 + 150px(MUI margin-left 150)에서 끝남, 화면 가장자리 16px 안
  Object.assign(el.style, { top: (r.bottom + 16) + 'px', left: Math.max(box.left + 16, right - 480) + 'px' });
  document.body.appendChild(scrim); document.body.appendChild(el);
  bell.classList.add('nt-on');
  cur = { el, scrim, bell, kind: 'pop', ov: document.documentElement.style.overflow }; document.documentElement.style.overflow = 'hidden';
  document.addEventListener('keydown', onKey, true);
  if (!reduced() && el.animate) try {
   el.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 384, easing: E_STD });
   el.animate([{ transform: 'scale(.75,.5625)' }, { transform: 'none' }], { duration: 256, easing: E_STD });
  } catch (e) { }
 }
 markAll();
}
// 패널 안 클릭 — 레이어와 목록판 정적 패널이 같이 쓴다
function inside(el, e) {
 const inline = el.classList.contains('nt-inline');
 if (e.target.closest('.nt-x,.nt-back')) { e.preventDefault(); e.stopPropagation(); return inline ? NT.onInlineClose() : close() }
 const it = e.target.closest('.nt-item'); if (!it) return;
 e.preventDefault(); e.stopPropagation();
 it.classList.add('read');   // dev: 클릭하면 그 항목에 read 표시만(이동 없음)
 const g = it.getAttribute('data-nt-go'); if (!g) return;
 const x = list().find(y => y.id === it.getAttribute('data-nt-id'));
 if (!inline) close(true);
 NT.onGo(g, x);
}
// 클릭은 모두 window 캡처 단계에서 받는다 — 화면 이동(data-go)·스냅숏 런타임(document 캡처)보다 먼저
window.addEventListener('click', e => {
 const t = e.target; if (!t || !t.closest) return;
 // ① 열린 레이어: 패널 안(X · 항목) · 바깥(투명 막) 클릭
 if (cur) {
  if (cur.el.contains(t)) { e.stopImmediatePropagation(); return inside(cur.el, e) }
  if (cur.scrim && cur.scrim === t) { e.preventDefault(); e.stopImmediatePropagation(); return close() }
 }
 // ② 목록판 정적 패널(열림 상태 화면): 바깥 클릭 · 벨 다시 클릭 = 닫힘(→ 읽음 상태)
 const st0 = t.closest('[data-nt-static]'), pop = st0 && st0.querySelector('.nt-pop.nt-inline,.nt-page.nt-inline');
 if (pop) { e.stopImmediatePropagation(); if (pop.contains(t)) return inside(pop, e); e.preventDefault(); return NT.onInlineClose() }
 // ③ 벨 — 어느 판에서든 같은 처리
 const b = t.closest(BELL); if (!b || NT.guest()) return;
 e.preventDefault(); e.stopImmediatePropagation();
 if (cur && cur.bell === b) return close();
 open(b, b.matches('[data-notify-bell],[class*="__NotiBell"]') ? 'page' : 'pop');
}, true);

const NT = window.NOTIFY = {
 TPL, list, unread, dot, refresh, open, close, popHTML, pageHTML,
 guest: () => !!(typeof S !== 'undefined' && S.auth === 'guest' && !window.PT_SITE_NOTIFY),
 set(mode, readAll) { st.mode = mode; st.read = {}; if (readAll) list().forEach(x => { st.read[x.id] = 1 }); save() },
 // 목적지 — 화면 목록판: 지갑 상세(home.wallet) · 홈(home.main)
 onGo(g, x) { if (window.go) go(g === 'wallet' ? 'home.wallet' : 'home.main') },
 onInlineClose() { if (window.go) go('cmn.notify:read') },
 // 실사이트 스냅숏(pt-runtime.js) 연결: 계정 원천 · 목적지 · 점 그리기
 site(o) { window.PT_SITE_NOTIFY = 1; if (o.accounts) accSrc = o.accounts; if (o.go) NT.onGo = o.go; refresh() },
};
// 화면이 다시 그려지면(목록판 상태 전환 · 동작판 이동) 점을 다시 붙이고, 벨이 사라진 열린 패널은 닫는다
if (window.MutationObserver) new MutationObserver(() => { if (cur && cur.bell && !document.contains(cur.bell)) close(true); if (document.querySelector(BELL + ':not(.nt-bell)')) refresh() }).observe(document.documentElement, { childList: true, subtree: true });

// ---- 화면 목록판 화면 — 공통 그룹
if (!window.R) return;
const member = f => { const o = S.auth; if (o === 'guest') S.auth = 's4'; try { return f() } finally { S.auth = o } };
const NOTE = {
 unread: '안 읽은 알림이 있으면 벨에 빨간 점(REQ-464). 벨을 누르면 패널이 열리고, 목록을 받는 즉시 안 읽은 알림을 모두 읽음 처리해 점이 사라진다(dev 실측 — 항목을 눌러야 읽는 것이 아님). 표본: 기존 CEX 3건(dev 실측, 읽음) + DEX 연동 계정에서 나온 DEX 알림(안 읽음).',
 open: 'dev 실측 AlarmCenterPopup: 480×640 · 벨 아래 16px · 제목 `Notifications`(언어팩 `alarm title`) + 닫기 X · 항목 = 제목(이모지 포함 원문) · 본문 · 오른쪽 시각 `MM.DD HH:mm`(UTC → 로컬, 타임존 라벨 없음) · 넘치면 패널 안 스크롤(4px 스크롤바). X · 바깥 클릭 · Esc = 닫힘. 열림·닫힘 = MUI Grow(불투명도 384ms · 크기 .75→1 256ms, --e-std). 기존 CEX 항목은 눌러도 이동 없음(dev: moveType 미사용) · DEX 항목은 REQ-660 지갑 상세로 이동(❓ 정의 문서 N-1).',
 read: '패널을 연 뒤 — 모두 읽음, 벨 점 없음. 목록은 그대로 남는다(삭제·「모두 읽음」 버튼 없음 — dev 실측).',
 empty: '알림 0건 — 언어팩 `no Notifications` / `no Notifications desc` 원문(EN 원문 아포스트로피 누락 ❓ N-4). 빈 상태 아이콘 없음(dev EmptyList 제목·설명만).',
 fail: '목록 조회 실패 — dev 코드는 빈 목록으로 처리해 빈 상태를 보이고, 벨 점은 숨긴다(REQ-471). 재시도 버튼·오류 문구 없음.',
};
R.screen({ id: 'cmn.notify', group: 'common', title: '알림 목록 (벨 → Notifications)', route: 'GNB 벨 (PC 패널) · /{lang}/alarm (모바일 웹)', fu: ['FU-083'], shell: false,
 states: [
  { id: 'unread', label: '벨 빨간 점 — 안 읽음 있음', figma: { pc: '8643:121393' }, note: '[기존 MAX-7] Web 헤더 벨 + &lt;Badge&gt; 8643:122742 — 패널 프레임은 Figma에서 찾지 못함(dev 실측으로 구성)' },
  { id: 'open', label: '패널 열림 — 목록 (PC) · /alarm 페이지 (모바일)' },
  { id: 'read', label: '연 뒤 — 모두 읽음 · 점 없음' },
  { id: 'empty', label: '빈 상태 — No Notifications' },
  { id: 'fail', label: '목록 로드 실패 — 점 숨김 · 빈 상태' },
 ],
 render(s) {
  NT.set(s === 'empty' ? 'empty' : s === 'fail' ? 'fail' : 'normal', s === 'read' || s === 'open');
  const panel = s === 'open' || s === 'empty' || s === 'fail', note = window.C ? C.note(NOTE[s]) : '';
  if (S.vp === 'mo') {
   if (panel) return `<div data-nt-static>${pageHTML('nt-inline')}</div>${note}`;
   return `${member(() => moTop())}<div class="page accent" style="min-height:700px"></div>${note}`;
  }
  let g = member(() => gnb());
  if (panel) g = g.replace('title="Notifications"', 'title="Notifications" style="background:rgba(0,0,0,.12)"');   // dev: 열린 동안 벨 배경 action-focus
  return `<div style="position:relative" ${panel ? 'data-nt-static' : ''}>${g}${panel ? `<div class="nt-scrim-inline" style="position:absolute;inset:0;height:840px;z-index:29"></div>${popHTML('nt-inline').replace('class="nt-pop nt-inline"', 'class="nt-pop nt-inline" style="top:64px;right:49px"')}` : ''}</div><div class="page accent" style="min-height:776px"></div>${note}`;
 } });
})();
