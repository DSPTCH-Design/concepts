// Home page slideshow
(function () {
  var slider = document.getElementById('slider');
  if (!slider) return;
  var slides = slider.querySelectorAll('.slide');
  var dots = slider.querySelectorAll('.dots span');
  var current = 0;
  var timer;

  function show(n) {
    current = (n + slides.length) % slides.length;
    for (var i = 0; i < slides.length; i++) {
      slides[i].className = 'slide' + (i === current ? ' on' : '');
      dots[i].className = i === current ? 'on' : '';
    }
  }
  function start() {
    clearInterval(timer);
    timer = setInterval(function () { show(current + 1); }, 5000);
  }

  slider.querySelector('.prev').onclick = function () { show(current - 1); start(); };
  slider.querySelector('.next').onclick = function () { show(current + 1); start(); };
  for (var i = 0; i < dots.length; i++) {
    (function (n) {
      dots[n].onclick = function () { show(n); start(); };
    })(i);
  }
  start();
})();

// Contact form. Demo only: nothing is sent, logged or stored.
(function () {
  var form = document.getElementById('contactform');
  if (!form) return;
  form.onsubmit = function (e) {
    e.preventDefault();
    form.reset();
    document.getElementById('formnote').style.display = 'block';
  };
})();
