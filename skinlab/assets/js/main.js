/* Skin LAB — minimal interactions */
(function () {
  var doc = document.documentElement;
  doc.classList.add('js');
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var arrow = '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.3" aria-hidden="true"><path d="M2 8h12M9.5 3.5 14 8l-4.5 4.5"/></svg>';

  /* Mobile nav */
  var burger = $('.burger');
  if (burger) {
    burger.addEventListener('click', function () {
      var open = doc.classList.toggle('nav-open');
      burger.setAttribute('aria-expanded', open);
    });
    $$('.nav a').forEach(function (a) {
      a.addEventListener('click', function () { doc.classList.remove('nav-open'); burger.setAttribute('aria-expanded', false); });
    });
  }

  /* Reveal on scroll */
  var rv = $$('.rv');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    rv.forEach(function (el) { io.observe(el); });
  } else { rv.forEach(function (el) { el.classList.add('is-in'); }); }

  /* Treatment map */
  var AREAS = {
    forehead: { n: '01', name: 'Forehead', rx: [['Botox® Cosmetic', 'Softens forehead and frown lines', '10–20 units · from $140'], ['Microneedling + PRP', 'Fine lines and texture', '$450']] },
    eyes: { n: '02', name: 'Eyes', rx: [['Botox® Cosmetic', 'Crow’s feet and a subtle brow lift', '8–24 units · from $112'], ['Under-eye filler', 'Hollows and shadowing', 'from $750']] },
    cheeks: { n: '03', name: 'Cheeks', rx: [['Cheek filler', 'Restores lift and contour', 'from $795 / syringe'], ['Skin boosters', 'Hydration from within', 'from $550']] },
    lips: { n: '04', name: 'Lips', rx: [['Lip filler', 'Shape, balance and soft volume', 'from $695 / syringe'], ['Lip flip', 'A subtle roll of the upper lip', 'from $90']] },
    jawline: { n: '05', name: 'Jawline', rx: [['Jawline filler', 'Definition along the jaw and chin', 'from $795 / syringe'], ['Masseter Botox®', 'Slims and eases clenching', 'from $420']] },
    skin: { n: '06', name: 'Skin', rx: [['Chemical peel', 'Tone, sun damage and glow', 'from $175'], ['Microneedling + PRP', 'Texture, pores and scarring', '$450']] }
  };
  var panel = $('#area-panel');
  function setArea(key) {
    var a = AREAS[key]; if (!a || !panel) return;
    $$('[data-area]').forEach(function (el) {
      var on = el.getAttribute('data-area') === key;
      el.classList.toggle('is-on', on);
      if (el.classList.contains('area')) el.setAttribute('aria-selected', on);
    });
    panel.innerHTML = '<div class="panel__head"><span class="panel__n">' + a.n + ' / 06</span><h3 class="h3">' + a.name + '</h3></div><ul class="rx">' +
      a.rx.map(function (r) { return '<li><b>' + r[0] + '</b><span>' + r[1] + '</span><i>' + r[2] + '</i></li>'; }).join('') + '</ul>';
  }
  $$('[data-area]').forEach(function (el) { el.addEventListener('click', function () { setArea(el.getAttribute('data-area')); }); });

  /* Signature treatments image swap */
  var rows = $$('.sig__row');
  function setSig(i) {
    rows.forEach(function (r, j) { r.classList.toggle('is-on', i === j); });
    $$('.sig__media img').forEach(function (im, j) { im.classList.toggle('is-on', i === j); });
  }
  rows.forEach(function (r, i) {
    r.addEventListener('mouseenter', function () { setSig(i); });
    r.addEventListener('focus', function () { setSig(i); });
    r.addEventListener('click', function () { setSig(i); });
  });

  /* Treatment finder */
  var QUIZ = [
    { q: 'What would you most like to change?', o: [['Lines and wrinkles', 'lines'], ['Lips, cheeks or jawline', 'volume'], ['Texture or scarring', 'texture'], ['Sun spots or redness', 'tone'], ['Dull, tired skin', 'glow']] },
    { q: 'How soon would you like to see it?', o: [['Within two weeks', 'fast'], ['Over a month or two', 'steady'], ['No rush', 'slow']] },
    { q: 'How much downtime works for you?', o: [['None', 'none'], ['A day or two', 'some'], ['Up to a week', 'week']] }
  ];
  var PLAN = {
    lines: ['Botox® Cosmetic', 'A 15-minute visit. Results settle in over two weeks and last three to four months.', 'From $14 / unit'],
    volume: ['Dermal filler', 'Placed conservatively and reviewed at two weeks. Results are immediate.', 'From $695 / syringe'],
    texture: ['Microneedling + PRP', 'Three sessions, a month apart, to rebuild texture with your own growth factors.', '$450 / session'],
    textureNone: ['Skin boosters', 'Micro-injections of hyaluronic acid that smooth and hydrate with no real downtime.', 'From $550'],
    tone: ['Chemical peel', 'A physician-selected peel to even tone and lift sun damage.', 'From $175'],
    glow: ['Skin boosters', 'Micro-injections of hyaluronic acid for hydration and light, with no real downtime.', 'From $550']
  };
  var quiz = $('#quiz'), step = 0, ans = [];
  function renderQuiz() {
    if (!quiz) return;
    if (step < QUIZ.length) {
      var s = QUIZ[step];
      quiz.innerHTML = '<div class="quiz__top"><span>Question 0' + (step + 1) + ' of 03</span><span class="quiz__bar"><i style="width:' + ((step + 1) / 3 * 100) + '%"></i></span></div>' +
        '<h3 class="h3 quiz__q">' + s.q + '</h3><div class="quiz__opts">' +
        s.o.map(function (o) { return '<button type="button" class="opt" data-v="' + o[1] + '"><span>' + o[0] + '</span>' + arrow + '</button>'; }).join('') + '</div>';
      $$('.opt', quiz).forEach(function (b) { b.addEventListener('click', function () { ans[step] = b.getAttribute('data-v'); step++; renderQuiz(); }); });
    } else {
      var key = ans[0];
      if (key === 'texture' && ans[2] === 'none') key = 'textureNone';
      var p = PLAN[key];
      quiz.innerHTML = '<div class="quiz__top"><span>Your starting point</span><span class="quiz__bar"><i style="width:100%"></i></span></div>' +
        '<div class="result"><span class="mono" style="color:var(--sand)">' + p[2] + '</span><h3 class="h2">' + p[0] + '</h3><p>' + p[1] + '</p>' +
        '<div class="result__row"><a class="btn btn--light" href="#book">Book a consultation ' + arrow + '</a><button type="button" class="result__again">Start over</button></div></div>';
      $('.result__again', quiz).addEventListener('click', function () { step = 0; ans = []; renderQuiz(); });
    }
  }
  renderQuiz();
  $$('[data-concern]').forEach(function (c) {
    c.addEventListener('click', function () { ans = [c.getAttribute('data-concern')]; step = 1; renderQuiz(); });
  });

  /* Before / after slider */
  var BA = {
    botox: [['Area', 'Crow’s feet &amp; brow'], ['Amount', '24 units'], ['Photographed', '2 weeks after']],
    boosters: [['Area', 'Lower face'], ['Amount', '2 sessions'], ['Photographed', '6 weeks after']]
  };
  var ba = $('#ba');
  if (ba) {
    var baIn = $('input', ba);
    baIn.addEventListener('input', function () { ba.style.setProperty('--pos', baIn.value + '%'); });
    $$('[data-ba]').forEach(function (t) {
      t.addEventListener('click', function () {
        var k = t.getAttribute('data-ba');
        $$('[data-ba]').forEach(function (o) { o.classList.toggle('is-on', o === t); o.setAttribute('aria-selected', o === t); });
        $('#ba-before').src = 'assets/img/ba-' + k + '-before.jpg';
        $('#ba-after').src = 'assets/img/ba-' + k + '-after.jpg';
        $('#ba-specs').innerHTML = BA[k].map(function (r) { return '<div><dt>' + r[0] + '</dt><dd>' + r[1] + '</dd></div>'; }).join('');
        baIn.value = 50; ba.style.setProperty('--pos', '50%');
      });
    });
  }

  /* Membership calculator */
  var range = $('#spend'), out = $('#spend-out');
  var fmt = function (n) { return '$' + Math.round(n).toLocaleString('en-US'); };
  function calc() {
    if (!range) return;
    var v = +range.value, best = null, bestV = -1;
    out.textContent = fmt(v);
    $$('.tier').forEach(function (t) {
      var save = v * (+t.getAttribute('data-pct'));
      var net = save; /* monthly fee converts to treatment credit */
      $('.tier__save b', t).textContent = fmt(save);
      var fits = v >= (+t.getAttribute('data-fee')) * 12;
      if (fits && net > bestV) { bestV = net; best = t; }
    });
    $$('.tier').forEach(function (t, i) { t.classList.toggle('is-best', best ? t === best : i === 0); });
  }
  if (range) { range.addEventListener('input', calc); calc(); }

  /* Booking form (no backend) */
  var form = $('#book-form');
  if (form) form.addEventListener('submit', function (e) { e.preventDefault(); form.classList.add('is-sent'); });
})();
