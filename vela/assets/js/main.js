(function(){
  var hdr=document.getElementById('hdr'),hero=document.getElementById('hero');
  var mb=document.querySelector('.menu'),mn=document.getElementById('mnav');
  function headerState(){if(!hero)return;hdr.classList.toggle('over',mn.hidden&&window.scrollY<hero.offsetHeight-90)}
  function closeMenu(){mn.hidden=true;mb.setAttribute('aria-expanded','false');mb.setAttribute('aria-label','Open menu');document.body.style.overflow='';headerState()}
  mb.addEventListener('click',function(){var o=mn.hidden;mn.hidden=!o;mb.setAttribute('aria-expanded',String(o));mb.setAttribute('aria-label',o?'Close menu':'Open menu');document.body.style.overflow=o?'hidden':'';headerState()});
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!mn.hidden){closeMenu();mb.focus()}});
  window.addEventListener('scroll',headerState,{passive:true});headerState();
  var io='IntersectionObserver' in window?new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}})},{rootMargin:'0px 0px -10% 0px'}):null;
  document.querySelectorAll('.frame.zoom').forEach(function(f){io?io.observe(f):f.classList.add('in')});
  var peek=document.getElementById('peek');
  if(peek&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){var pi=peek.querySelectorAll('img');document.querySelectorAll('#index .row').forEach(function(r){
    r.addEventListener('mouseenter',function(){pi.forEach(function(im,i){im.classList.toggle('on',String(i)===r.dataset.img)});peek.classList.add('show')});
    r.addEventListener('mouseleave',function(){peek.classList.remove('show')});
    r.addEventListener('mousemove',function(e){peek.style.left=e.clientX+'px';peek.style.top=e.clientY+'px'})})}
  document.querySelectorAll('.rb[aria-controls]').forEach(function(b){b.addEventListener('click',function(){var p=document.getElementById(b.getAttribute('aria-controls')),o=p.hidden;p.hidden=!o;b.setAttribute('aria-expanded',String(o));b.textContent=o?'Close preview':'Read preview'})});
  var form=document.getElementById('cform');if(!form)return;
  var conf=document.getElementById('confirm'),pf=document.getElementById('phone-field');
  var want=new URLSearchParams(location.search).get('interest');
  if(want){var map={'Injectables':'i-inj','Skin Treatments':'i-skin','Laser and Renewal':'i-ren'};var el=document.getElementById(map[want]);if(el)el.checked=true}
  form.querySelectorAll('input[name=contact]').forEach(function(r){r.addEventListener('change',function(){pf.hidden=!document.getElementById('c-phone').checked})});
  form.addEventListener('submit',function(e){
    e.preventDefault();var ok=true,first=null;
    ['name','email','interest','phone','consent'].forEach(function(k){document.getElementById('e-'+k).textContent=''});
    function fail(k,el,m){document.getElementById('e-'+k).textContent=m;ok=false;if(!first)first=el}
    var n=document.getElementById('f-name'),m=document.getElementById('f-email'),c=document.getElementById('f-consent'),ph=document.getElementById('f-phone');
    if(!n.value.trim())fail('name',n,'Please add your name.');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.value.trim()))fail('email',m,'Please enter an email like name@example.com.');
    if(!form.querySelector('input[name=interest]:checked'))fail('interest',document.getElementById('i-inj'),'Choose one, or select "Not sure yet".');
    if(document.getElementById('c-phone').checked&&ph.value.replace(/\D/g,'').length<7)fail('phone',ph,'Please add a phone number, or choose email.');
    if(!c.checked)fail('consent',c,'Please confirm before previewing your request.');
    if(!ok){first.focus();return}
    document.getElementById('confirm-name').textContent=n.value.trim().split(/\s+/)[0];
    form.reset();pf.hidden=true;form.hidden=true;conf.hidden=false;conf.focus();
  });
  document.getElementById('reset-form').addEventListener('click',function(){conf.hidden=true;form.hidden=false;document.getElementById('f-name').focus()});
})();
