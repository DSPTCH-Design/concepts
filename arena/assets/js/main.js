(function(){
  var doc=document.documentElement;
  doc.classList.add('js');
  var reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  var io='IntersectionObserver' in window ? new IntersectionObserver(function(es){
    es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  },{rootMargin:'0px 0px -8% 0px'}) : null;
  document.querySelectorAll('.rv').forEach(function(el){
    var r=el.getBoundingClientRect();
    if(!io || reduce || r.top < window.innerHeight) el.classList.add('in'); else io.observe(el);
  });

  // Program index jump links
  document.addEventListener('click',function(e){
    var p=e.target.closest('#pindex button');
    if(p){ var t=document.getElementById(p.dataset.to); if(t) t.scrollIntoView({behavior: reduce?'auto':'smooth'}); }
  });

  // Header state, parallax, program index highlight
  var hdr=document.getElementById('hdr'), ticking=false;
  var par=[].slice.call(document.querySelectorAll('[data-parallax]'));
  var idx=[].slice.call(document.querySelectorAll('#pindex button'));
  function onScroll(){
    hdr.classList.toggle('solid', window.scrollY>40);
    if(!reduce){
      par.forEach(function(img){
        var r=img.parentElement.getBoundingClientRect();
        var p=(r.top+r.height/2-window.innerHeight/2)/window.innerHeight;
        p=Math.max(-1,Math.min(1,p));
        img.style.transform='translateY('+(-7.5-p*7.5)+'%)';
      });
    }
    if(idx.length){
      var cur=null;
      idx.forEach(function(btn){ var s=document.getElementById(btn.dataset.to); if(s && s.getBoundingClientRect().top<220) cur=btn; });
      idx.forEach(function(btn){ btn.classList.toggle('on', btn===cur); });
    }
    ticking=false;
  }
  window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(onScroll);} },{passive:true});
  onScroll();

  // Mobile menu
  var mnav=document.getElementById('mnav'), mbtn=document.getElementById('menuBtn');
  function closeMenu(){ mnav.hidden=true; mbtn.setAttribute('aria-expanded','false'); document.body.style.overflow=''; }
  mbtn.addEventListener('click',function(){ mnav.hidden=false; mbtn.setAttribute('aria-expanded','true'); document.body.style.overflow='hidden'; });
  document.getElementById('menuClose').addEventListener('click',closeMenu);
  document.addEventListener('keydown',function(e){ if(e.key==='Escape' && !mnav.hidden) closeMenu(); });

  // Hero wordmark: fit exactly to its row
  var wm=document.querySelector('.wordmark');
  function fitWord(){
    if(!wm) return;
    var box=wm.parentElement, cs=getComputedStyle(box);
    var avail=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
    var probe=document.createElement('span');
    probe.textContent=wm.textContent; probe.style.cssText='position:absolute;visibility:hidden;white-space:nowrap;font:inherit;letter-spacing:inherit';
    wm.appendChild(probe);
    var base=parseFloat(getComputedStyle(wm).fontSize), w=probe.getBoundingClientRect().width;
    wm.removeChild(probe);
    if(w>0) wm.style.fontSize=Math.floor(base*avail/w*0.99)+'px';
  }
  if(wm){ fitWord(); window.addEventListener('resize',fitWord); if(document.fonts&&document.fonts.ready) document.fonts.ready.then(fitWord); }

  // Intro-call form (runs in the browser only; nothing is sent or stored)
  var sel=document.getElementById('state');
  if(sel){
    ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','District of Columbia','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'].forEach(function(s){ var o=document.createElement('option'); o.textContent=s; o.value=s; sel.appendChild(o); });
    var form=document.getElementById('inq'), err=document.getElementById('formErr');
    form.addEventListener('submit',function(e){
      e.preventDefault();
      var missing=[];
      ['fname','lname','email','phone','state'].forEach(function(id){ var el=document.getElementById(id); if(!el.value.trim()) missing.push(el.labels[0].textContent.toLowerCase()); });
      var em=document.getElementById('email').value.trim();
      if(em && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)){ err.textContent='That email address doesn\'t look complete. Check it and try again.'; err.hidden=false; return; }
      if(missing.length){ err.textContent='Please add your '+missing.join(', ')+'.'; err.hidden=false; return; }
      err.hidden=true; form.hidden=true; document.getElementById('done').hidden=false;
      document.getElementById('formcard').scrollIntoView({behavior: reduce?'auto':'smooth', block:'start'});
    });
  }

  requestAnimationFrame(function(){ doc.classList.add('loaded'); });
})();
