// DEX 사이트 모드 — 사용자 데이터(연동 계정) 공유 저장소
// DEX 앱(dex/app.html)과 실사이트 스냅숏 런타임(pt-runtime.js)이 같이 읽는다. 같은 출처의 localStorage 한 키.
// 표본 계정은 전체 프로토타입 홈 기본 상태(R_LIGHTER · R_APEX, Figma HW1/S4-1 표본)와 같다.
(function () {
  var KEY = 'tm-dex-site-v1';
  var WAL = {
    lighter: '0x7a3F9c2B8e41D05a6F3b7C91e2D4a8B0c6E551e9',
    apex: '0x91c4E2a7B5d03F6c8A1e9D2b7C4f6A3e8B05a07b'
  };
  // a = 거래소 캐시백(확정), b = 이벤트 리워드. 홈 행 금액 = a + b(매칭 전 합계, REQ-268), 허브 패널 = a + MIN(b, a)
  function seed() {
    return {
      v: 1,
      accounts: [
        { ex: 'Lighter', type: 'DEX', id: WAL.lighter, a: 100, b: 20, st: 'ok', seed: true },
        { ex: 'ApeX', type: 'DEX', id: WAL.apex, a: 14, b: 0, st: 'ok', seed: true }
      ],
      justLinked: null,
      draft: {}
    };
  }
  function load() {
    var s = null;
    try { s = JSON.parse(localStorage.getItem(KEY) || 'null') } catch (e) { }
    if (!s || s.v !== 1) s = seed();
    return s;
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)) } catch (e) { } }
  function reset() { try { localStorage.removeItem(KEY) } catch (e) { } return load() }
  var floor2 = function (n) { return Math.floor((n + 1e-9) * 100) / 100 };
  var amt = function (x) { return x.st === 'pend' || x.st === 'own' || x.st === 'ownfail' ? null : floor2((x.a || 0) + (x.b || 0)) };
  // 로고(dex/ 기준 상대 경로). CEX는 연동 모달 에셋, DEX는 공용 DEX 마크
  var LOGO = {
    Lighter: 'dex-lighter.png', ApeX: 'dex-apex.png', EdgeX: 'dex-edgex.png', Aster: 'dex-aster.png',
    Bitget: 'link-cex-bitget.png', Bybit: 'link-cex-bybit.png', Binance: 'link-cex-binance.png', OKX: 'link-cex-okx.png', MEXC: 'link-cex-mexc.png',
    Gate: 'link-cex-gate.png', DeepCoin: 'link-cex-deepcoin.png', BingX: 'link-cex-bingx.png', BitMEX: 'link-cex-bitmex.png', LBank: 'link-cex-lbank.svg',
    BlockFin: 'link-cex-blockfin.svg', KuCoin: 'link-cex-kucoin.png', Zoomex: 'link-cex-zoomex.png', Bitunix: 'link-cex-bitunix.svg', BitMart: 'link-cex-bitmart.png',
    WOOX: 'link-cex-woox.png', 'WOO X Pro': 'calc-wooxpro.png', Flipster: 'calc-flipster.png', Toobit: 'calc-toobit.svg', BloFin: 'link-cex-blofin.png',
    BioFin: 'link-cex-blofin.png', HTX: 'link-cex-htx.svg', BVOX: 'link-cex-bvox.png'
  };
  window.DEXSTATE = { KEY: KEY, WAL: WAL, load: load, save: save, reset: reset, seed: seed, amt: amt, floor2: floor2, LOGO: LOGO };
})();
