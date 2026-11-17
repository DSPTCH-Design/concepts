// Home page banner rotation
(function () {
  var img = document.getElementById('bannerimg');
  if (!img) return;
  var pics = ['images/banner1.jpg', 'images/banner2.jpg', 'images/banner3.jpg'];
  var n = 0;
  for (var i = 1; i < pics.length; i++) { new Image().src = pics[i]; }
  setInterval(function () {
    n = (n + 1) % pics.length;
    img.src = pics[n];
  }, 6000);
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
