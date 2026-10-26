(function(){
  var hdr=document.getElementById('hdr'),mb=document.querySelector('.menu'),mn=document.getElementById('mnav');
  function onScroll(){hdr.classList.toggle('scrolled',window.scrollY>24)}
  window.addEventListener('scroll',onScroll,{passive:true});onScroll();

  function setMenu(open){
    mn.hidden=!open;mb.setAttribute('aria-expanded',String(open));
    mb.querySelector('.ml').textContent=open?'Close':'Menu';
    document.body.style.overflow=open?'hidden':'';
    if(open){var f=mn.querySelector('a');if(f)f.focus()}
  }
  if(mb){
    mb.addEventListener('click',function(){setMenu(mn.hidden)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mn.hidden){setMenu(false);mb.focus()}});
    mn.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){setMenu(false)})});
    window.addEventListener('resize',function(){if(window.innerWidth>1080&&!mn.hidden)setMenu(false)});
  }

  var els=document.querySelectorAll('.rv,.frame');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -8% 0px'});
    els.forEach(function(el){io.observe(el)});
  }else{els.forEach(function(el){el.classList.add('in')})}

  /* treatments anchor highlight */
  var links=document.querySelectorAll('.anchors a');
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){links.forEach(function(a){a.classList.remove('on')});var a=map[en.target.id];if(a)a.classList.add('on')}})},{rootMargin:'-45% 0px -50% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s)});
  }

  /* consultation form: runs only in the browser, nothing is sent or stored */
  var form=document.getElementById('cform');if(!form)return;
  var conf=document.getElementById('confirm'),pf=document.getElementById('phone-field');
  var want=new URLSearchParams(location.search).get('interest');
  if(want){var el=document.getElementById('i-'+want);if(el)el.checked=true}
  form.querySelectorAll('input[name=contact]').forEach(function(r){r.addEventListener('change',function(){pf.hidden=!document.getElementById('c-phone').checked})});
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var ok=true,first=null;
    form.querySelectorAll('[aria-invalid]').forEach(function(x){x.removeAttribute('aria-invalid')});
    ['name','email','interest','contact','phone'].forEach(function(k){document.getElementById('e-'+k).textContent=''});
    function fail(k,el,msg,mark){document.getElementById('e-'+k).textContent=msg;if(mark)el.setAttribute('aria-invalid','true');ok=false;if(!first)first=el}
    var n=document.getElementById('f-name'),m=document.getElementById('f-email'),ph=document.getElementById('f-phone');
    if(!n.value.trim())fail('name',n,'Please add your name.',true);
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()))fail('email',m,'Please enter an email like name@example.com.',true);
    if(!form.querySelector('input[name=interest]:checked'))fail('interest',document.getElementById('i-cosmetic'),'Choose one, or select "Not sure yet".');
    if(!form.querySelector('input[name=contact]:checked'))fail('contact',document.getElementById('c-email'),'Choose how you would like us to reach you.');
    if(document.getElementById('c-phone').checked&&ph.value.replace(/\D/g,'').length<7)fail('phone',ph,'Please add a phone number, or choose email.',true);
    if(!ok){first.focus();return}
    document.getElementById('confirm-name').textContent=n.value.trim().split(/\s+/)[0];
    form.reset();pf.hidden=true;form.hidden=true;document.getElementById('notice').hidden=true;conf.hidden=false;conf.focus();
  });
  document.getElementById('reset-form').addEventListener('click',function(){conf.hidden=true;form.hidden=false;document.getElementById('notice').hidden=false;document.getElementById('f-name').focus()});
})();
