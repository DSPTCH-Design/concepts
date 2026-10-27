(function () {
  document.documentElement.classList.add('js');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header turns solid once the hero has scrolled away */
  var hdr = document.querySelector('.hdr');
  var hero = document.querySelector('.hero');
  function onScroll() {
    if (!hdr) return;
    var limit = hero ? hero.offsetHeight - 80 : 0;
    hdr.classList.toggle('is-solid', window.scrollY > limit);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* full-screen menu */
  var burger = document.querySelector('.burger');
  if (burger) {
    var close = function () { document.body.classList.remove('menu-open'); burger.setAttribute('aria-expanded', 'false'); };
    burger.addEventListener('click', function () {
      var open = document.body.classList.toggle('menu-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.querySelectorAll('.menu a').forEach(function (a) { a.addEventListener('click', close); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') close(); });
  }

  /* giant wordmark: scale the word so word, rule and parenthetical share one row */
  var wms = document.querySelectorAll('.wm');
  function fitWm() {
    wms.forEach(function (row) {
      var word = row.querySelector('.wm__word'), paren = row.querySelector('.wm__paren');
      word.style.fontSize = '';
      var gap = parseFloat(getComputedStyle(row).columnGap) || 0;
      var room = window.innerWidth <= 900 ? row.clientWidth - 2 : row.clientWidth - paren.getBoundingClientRect().width - gap * 2 - row.clientWidth * 0.08;
      var w = word.scrollWidth;
      if (w > room) word.style.fontSize = (parseFloat(getComputedStyle(word).fontSize) * room / w).toFixed(1) + 'px';
    });
  }
  if (wms.length) {
    fitWm();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWm);
    var rt; window.addEventListener('resize', function () { clearTimeout(rt); rt = setTimeout(fitWm, 120); });
  }

  /* live Chicago clock */
  var clocks = document.querySelectorAll('[data-clock]');
  if (clocks.length) {
    var fmt;
    try { fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/Chicago', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); } catch (e) { fmt = null; }
    var tick = function () {
      var t = fmt ? fmt.format(new Date()) : new Date().toTimeString().slice(0, 8);
      clocks.forEach(function (c) { c.textContent = t; });
    };
    tick(); setInterval(tick, 1000);
  }

  /* reveal: only content below the first screen waits for the scroll */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.remove('is-pending'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    var fold = window.innerHeight * 0.92;
    document.querySelectorAll('.rv').forEach(function (el) {
      if (el.getBoundingClientRect().top > fold) { el.classList.add('is-pending'); io.observe(el); }
    });
  }

  /* disciplines: the last column you touched stays open */
  var xcols = document.querySelectorAll('.xcol');
  xcols.forEach(function (c) {
    var on = function () { xcols.forEach(function (x) { x.classList.toggle('is-on', x === c); }); };
    c.addEventListener('mouseenter', on);
    c.addEventListener('focus', on);
  });

  /* work rail arrows */
  var rail = document.querySelector('.rail');
  document.querySelectorAll('[data-rail]').forEach(function (b) {
    b.addEventListener('click', function () {
      if (!rail) return;
      var slide = rail.querySelector('.slide');
      var step = slide ? slide.getBoundingClientRect().width + parseFloat(getComputedStyle(rail).columnGap || 0) : rail.clientWidth;
      rail.scrollBy({ left: step * +b.getAttribute('data-rail'), behavior: reduce ? 'auto' : 'smooth' });
    });
  });

  /* project index filter */
  var filters = document.querySelectorAll('.filter');
  if (filters.length) {
    var trs = document.querySelectorAll('.ptable tbody tr');
    filters.forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.getAttribute('data-filter');
        filters.forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
        trs.forEach(function (tr) { tr.hidden = !(k === 'all' || tr.getAttribute('data-sector') === k); });
      });
    });
  }

  /* contact form: confirm in place */
  var form = document.querySelector('.cform');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var done = form.querySelector('.done');
      var name = (form.querySelector('#f-name') || {}).value || '';
      done.textContent = 'Thanks' + (name ? ', ' + name.trim().split(' ')[0] : '') + '. Your project details are in. An engineer will call you within one business day.';
      done.hidden = false;
      form.querySelector('.send').hidden = true;
    });
  }

  /* isometric block-to-building drawings */
  var isos = document.querySelectorAll('[data-iso]');
  if (isos.length) {
    var C = Math.cos(Math.PI / 6), S = Math.sin(Math.PI / 6), U = 34;
    var P = function (x, y, z) { return [(x - y) * C * U + 150, (x + y) * S * U - z * U + 152]; };
    var L = function (a, b, cls) { var p = P.apply(null, a), q = P.apply(null, b); return '<line class="' + cls + '" x1="' + p[0].toFixed(1) + '" y1="' + p[1].toFixed(1) + '" x2="' + q[0].toFixed(1) + '" y2="' + q[1].toFixed(1) + '"/>'; };
    var F = function (pts, cls) { return '<polygon class="' + cls + '" points="' + pts.map(function (v) { return P.apply(null, v).map(function (n) { return n.toFixed(1); }).join(','); }).join(' ') + '"/>'; };
    var W = 3, D = 3, H = 4, out = [];
    var box = function (cls) {
      return F([[0, D, 0], [W, D, 0], [W, D, H], [0, D, H]], cls + ' f-l') +
        F([[W, 0, 0], [W, D, 0], [W, D, H], [W, 0, H]], cls + ' f-r') +
        F([[0, 0, H], [W, 0, H], [W, D, H], [0, D, H]], cls + ' f-t');
    };
    var edges = function (cls) {
      var e = [[[0,D,0],[W,D,0]],[[W,D,0],[W,0,0]],[[0,D,0],[0,D,H]],[[W,D,0],[W,D,H]],[[W,0,0],[W,0,H]],[[0,0,H],[W,0,H]],[[W,0,H],[W,D,H]],[[W,D,H],[0,D,H]],[[0,D,H],[0,0,H]]];
      return e.map(function (p) { return L(p[0], p[1], cls); }).join('');
    };
    var hidden = function () { return L([0,0,0],[W,0,0],'h') + L([0,0,0],[0,D,0],'h') + L([0,0,0],[0,0,H],'h'); };
    var frame = function (cls) {
      var s = '';
      for (var i = 0; i <= W; i++) for (var j = 0; j <= D; j++) s += L([i, j, 0], [i, j, H], cls);
      for (var z = 1; z <= H; z++) {
        for (var a = 0; a <= W; a++) s += L([a, 0, z], [a, D, z], cls);
        for (var b = 0; b <= D; b++) s += L([0, b, z], [W, b, z], cls);
      }
      return s;
    };
    var grid = function () {
      var s = '';
      for (var x = 0.5; x < W; x += 0.5) s += L([x, D, 0], [x, D, H], 'g');
      for (var y = 0.5; y < D; y += 0.5) s += L([W, y, 0], [W, y, H], 'g');
      for (var z = 1; z < H; z++) { s += L([0, D, z], [W, D, z], 'g2'); s += L([W, 0, z], [W, D, z], 'g2'); }
      return s;
    };
    out[1] = box('m') + hidden() + edges('e');
    out[2] = F([[0,0,0],[W,0,0],[W,D,0],[0,D,0]], 'slab') + frame('fr') + edges('e');
    out[3] = frame('fr2') + edges('e') +
      L([0.5, 0.5, 0.5], [0.5, 0.5, H - 0.2], 'sys') + L([0.5, 0.5, H - 0.2], [W - 0.5, 0.5, H - 0.2], 'sys') +
      L([0.5, 1.5, 0.5], [0.5, 1.5, H - 0.5], 'sys') + L([0.5, 1.5, 2.5], [W - 0.4, 1.5, 2.5], 'sys') + L([0.5, 1.5, 1.5], [W - 0.4, 1.5, 1.5], 'sys') +
      L([W - 0.5, 0.5, H - 0.2], [W - 0.5, D - 0.4, H - 0.2], 'sys');
    out[4] = box('b') + grid() +
      F([[0, D, 2], [W, D, 2], [W, D, 2.28], [0, D, 2.28]], 'band') +
      F([[W, 0, 2], [W, D, 2], [W, D, 2.28], [W, 0, 2.28]], 'band band-r') + edges('e');
    isos.forEach(function (el) {
      el.innerHTML = '<svg viewBox="0 0 300 300" role="img" aria-label="' + el.getAttribute('aria-label') + '"><g>' + out[+el.getAttribute('data-iso')] + '</g></svg>';
    });
  }
})();
