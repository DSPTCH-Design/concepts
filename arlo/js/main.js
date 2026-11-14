/* ARLO Plumbing — interactions */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* nav: pill on scroll + mobile menu */
  var nav = $('#nav'), burger = $('#burger');
  function onScroll() { nav.classList.toggle('is-stuck', window.scrollY > 40); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#mobileMenu a').forEach(function (a) {
    a.addEventListener('click', function () { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', false); });
  });

  /* hero headline: word-by-word rise */
  $$('[data-split]').forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w, i) {
      return '<span class="w" aria-hidden="true"><span style="--i:' + i + '">' + w + '</span></span>';
    }).join(' ');
  });

  /* count-up */
  function countUp(el) {
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '';
    if (reduce) { el.textContent = end.toFixed(dec) + suf; return; }
    var t0 = null, dur = 1600;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = (end * e).toFixed(dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* scroll reveal */
  var targets = $$('[data-reveal], #steps');
  function show(el) {
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
    if (el.hasAttribute('data-reveal')) {
      var d = parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0;
      setTimeout(function () { el.removeAttribute('data-reveal'); }, 1100 + d * 1000);
    }
    if (el.id === 'map') setTimeout(function () { el.classList.add('is-ready'); }, 1700);
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else { targets.forEach(show); }

  /* marquee: duplicate track for seamless loop */
  var track = $('.marquee__track');
  if (track && !reduce) {
    $$('.proj', track).forEach(function (p) {
      var c = p.cloneNode(true); c.setAttribute('aria-hidden', 'true'); track.appendChild(c);
    });
  }

  /* parallax band */
  var band = $('[data-parallax]'), bandImg = band && $('img', band);
  if (band && !reduce) {
    var ticking = false;
    var par = function () {
      var r = band.getBoundingClientRect(), vh = window.innerHeight;
      if (r.bottom > 0 && r.top < vh) {
        var p = (r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2);
        bandImg.style.transform = 'translate3d(0,' + (p * -8).toFixed(2) + '%,0)';
      }
      ticking = false;
    };
    window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(par); } }, { passive: true });
    par();
  }

  /* services: list drives the image stage */
  var srows = $$('#svx .srow'), simgs = $$('#svx .svx__stage img'), sN = $('#svxN'), sT = $('#svxT');
  function pick(i) {
    srows.forEach(function (r, n) { r.classList.toggle('is-active', n === i); $('button', r).setAttribute('aria-expanded', n === i); });
    simgs.forEach(function (im, n) { im.classList.toggle('is-active', n === i); });
    if (sN) sN.textContent = '0' + (i + 1);
    if (sT) sT.textContent = $('.srow__title', srows[i]).textContent;
  }
  srows.forEach(function (r, i) {
    var b = $('button', r);
    b.addEventListener('mouseenter', function () { pick(i); });
    b.addEventListener('focus', function () { pick(i); });
    b.addEventListener('click', function () { pick(i); });
  });

  /* testimonials */
  var quotes = $$('#quotes blockquote'), tabs = $$('#tabs button'), cur = 0, timer;
  function go(i) {
    cur = (i + quotes.length) % quotes.length;
    quotes.forEach(function (q, n) { q.classList.toggle('is-active', n === cur); });
    tabs.forEach(function (t, n) { t.classList.toggle('is-active', n === cur); });
  }
  function auto() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(cur + 1); }, 6500); }
  tabs.forEach(function (t, n) { t.addEventListener('click', function () { go(n); auto(); }); });
  $('#tprev').addEventListener('click', function () { go(cur - 1); auto(); });
  $('#tnext').addEventListener('click', function () { go(cur + 1); auto(); });
  auto();

  /* service areas: list <-> map pins */
  var pins = {};
  $$('#map .pin').forEach(function (p) { pins[p.dataset.id] = p; });
  $$('#arealist li').forEach(function (li) {
    var pin = pins[li.dataset.pin];
    if (!pin) return;
    li.addEventListener('mouseenter', function () { pin.classList.add('is-hot'); });
    li.addEventListener('mouseleave', function () { pin.classList.remove('is-hot'); });
    pin.addEventListener('mouseenter', function () { li.classList.add('is-hot'); });
    pin.addEventListener('mouseleave', function () { li.classList.remove('is-hot'); });
  });

  /* FAQ accordion */
  var items = $$('#acc .acc__item');
  items.forEach(function (item) {
    $('button', item).addEventListener('click', function () {
      var open = !item.classList.contains('is-open');
      items.forEach(function (o) { o.classList.remove('is-open'); $('button', o).setAttribute('aria-expanded', false); });
      if (open) { item.classList.add('is-open'); this.setAttribute('aria-expanded', true); }
    });
  });
  if (items[0]) { items[0].classList.add('is-open'); $('button', items[0]).setAttribute('aria-expanded', true); }

  /* form: front-end only */
  var form = $('#form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); });
})();
