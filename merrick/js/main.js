/* Merrick Roofing — interactions */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* nav: solid on scroll + mobile menu */
  var nav = $('#nav'), burger = $('#burger');
  function closeMenu() { nav.classList.remove('is-open'); burger.setAttribute('aria-expanded', 'false'); }
  burger.addEventListener('click', function () {
    var open = nav.classList.toggle('is-open');
    burger.setAttribute('aria-expanded', String(open));
  });
  $$('#mobileMenu a').forEach(function (a) { a.addEventListener('click', closeMenu); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeMenu(); });

  /* hero headline: word-by-word rise, keeping the <em> accent */
  $$('[data-split]').forEach(function (el) {
    var label = el.textContent.trim(), i = 0;
    function wrap(node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (n) {
        if (n.nodeType === 3) {
          var frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(function (part) {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            var o = document.createElement('span'); o.className = 'w';
            var s = document.createElement('span'); s.style.setProperty('--i', i++); s.textContent = part;
            o.appendChild(s); frag.appendChild(o);
          });
          node.replaceChild(frag, n);
        } else if (n.nodeType === 1) { wrap(n); }
      });
    }
    wrap(el);
    el.setAttribute('aria-label', label);
  });

  /* count-up */
  function fmt(v, dec, sep) {
    var s = v.toFixed(dec);
    return sep ? s.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : s;
  }
  function countUp(el) {
    var end = parseFloat(el.dataset.count), dec = +(el.dataset.dec || 0), suf = el.dataset.suffix || '', sep = !!el.dataset.sep;
    if (reduce) { el.textContent = fmt(end, dec, sep) + suf; return; }
    var t0 = null, dur = 1800;
    function tick(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(end * e, dec, sep) + suf;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  /* scroll reveal */
  function show(el) {
    el.classList.add('in');
    $$('[data-count]', el).forEach(countUp);
  }
  var targets = $$('[data-reveal]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { show(en.target); io.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    targets.forEach(function (el) { io.observe(el); });
  } else { targets.forEach(show); }

  /* marquee: duplicate the track for a seamless loop */
  $$('.marquee__track').forEach(function (t) {
    var clones = Array.prototype.slice.call(t.children).map(function (c) {
      var k = c.cloneNode(true); k.setAttribute('aria-hidden', 'true'); return k;
    });
    clones.forEach(function (k) { t.appendChild(k); });
  });

  /* scroll-lit statement */
  var lit = $$('[data-lit]').map(function (el) {
    var words = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.innerHTML = words.map(function (w) { return '<span class="lw" aria-hidden="true">' + w + '</span>'; }).join(' ');
    return { el: el, words: $$('.lw', el) };
  });

  /* parallax */
  var par = $$('[data-parallax]').map(function (el) { return { el: el, k: parseFloat(el.dataset.parallax) || 0.08 }; });

  /* active nav link */
  var links = $$('.nav__links a');
  var secs = $$('main section[id]');

  var ticking = false;
  function frame() {
    ticking = false;
    var y = window.scrollY, vh = window.innerHeight;
    nav.classList.toggle('is-stuck', y > 40);

    lit.forEach(function (o) {
      var r = o.el.getBoundingClientRect();
      var p = (vh * 0.86 - r.top) / (vh * 0.5 + r.height);
      p = Math.max(0, Math.min(1, p));
      var n = reduce ? o.words.length : Math.round(p * o.words.length);
      o.words.forEach(function (w, i) { w.classList.toggle('on', i < n); });
    });

    if (!reduce && window.innerWidth > 720) {
      par.forEach(function (o) {
        var r = o.el.parentNode.getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) return;
        var c = r.top + r.height / 2 - vh / 2;
        o.el.style.transform = 'translate3d(0,' + (-c * o.k).toFixed(1) + 'px,0)';
      });
    }

    var cur = '';
    secs.forEach(function (s) { if (s.getBoundingClientRect().top < vh * 0.4) cur = '#' + s.id; });
    links.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('href') === cur); });
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  frame();

  /* accordions: one open at a time */
  $$('[data-acc]').forEach(function (acc) {
    var items = $$('.acc__item', acc);
    items.forEach(function (item) {
      $('.acc__q', item).addEventListener('click', function () {
        var open = item.classList.contains('is-open');
        items.forEach(function (o) { o.classList.remove('is-open'); $('.acc__q', o).setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('is-open'); $('.acc__q', item).setAttribute('aria-expanded', 'true'); }
      });
    });
  });

  /* estimate form: runs only in the browser, nothing is sent or stored */
  var form = $('#estimate'), note = $('#formNote');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      $$('[required]', form).forEach(function (f) {
        var miss = !f.value.trim();
        f.classList.toggle('is-bad', miss);
        if (miss && !bad) bad = f;
      });
      if (bad) { note.textContent = 'Please add your name and a phone number so we can reach you.'; bad.focus(); return; }
      var first = form.elements.name.value.trim().split(/\s+/)[0];
      note.textContent = 'Thanks, ' + first + '. Online requests aren’t switched on yet, so please call (847) 555-0148 and we’ll get your estimate booked.';
    });
  }
})();
