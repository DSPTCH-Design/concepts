(function(){
  // Footer wordmark: scale the real font to fill the footer width exactly
  const wm=document.querySelector('.wordmark'), ws=wm&&wm.querySelector('span');
  function fit(){if(!wm)return;wm.style.fontSize='100px';const r=ws.getBoundingClientRect().width;if(r)wm.style.fontSize=(100*wm.clientWidth/r)+'px';}
  if(wm){fit();(document.fonts&&document.fonts.ready||Promise.resolve()).then(fit);
    if(window.ResizeObserver)new ResizeObserver(fit).observe(wm);else addEventListener('resize',fit);}

  // Mobile menu
  const open=document.getElementById('menu-open'), close=document.getElementById('menu-close'), m=document.getElementById('mnav');
  function setMenu(on){m.hidden=!on;open.setAttribute('aria-expanded',on);document.body.style.overflow=on?'hidden':'';(on?close:open).focus();}
  if(open&&m){
    open.addEventListener('click',()=>setMenu(true));
    close.addEventListener('click',()=>setMenu(false));
    m.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false)});
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!m.hidden)setMenu(false)});
  }

  // Homepage quick quote: storage swaps destination for pallet count, then continues to the quote page
  const qq=document.getElementById('qq');
  if(qq){
    const fromL=document.getElementById('qq-from-label'), toL=document.getElementById('qq-to-label'),
          to=document.getElementById('qq-to'), toIcon=document.getElementById('qq-to-icon'),
          note=document.getElementById('qq-note'), from=document.getElementById('qq-from');
    qq.addEventListener('change',e=>{
      if(e.target.name!=='need')return;
      const storage=e.target.value==='storage';
      fromL.textContent=storage?'Storage location':'Pickup';
      toL.textContent=storage?'Estimated pallet count':'Destination';
      to.name=storage?'pallets':'to';
      to.placeholder=storage?'e.g. 24':'City, State';
      to.inputMode=storage?'numeric':'text';
      toIcon.innerHTML=storage?'<use href="#box"/>':'<use href="#flag"/>';
      to.value='';
    });
    qq.addEventListener('submit',e=>{
      e.preventDefault();
      if(!from.value.trim()){note.textContent='Add a '+fromL.textContent.toLowerCase()+' to continue.';from.focus();return;}
      const q=new URLSearchParams();
      for(const [k,v] of new FormData(qq)){if(String(v).trim())q.set(k,v);}
      location.href='quote.html?'+q.toString();
    });
  }

  // Request a Quote form
  const form=document.getElementById('quote-form');
  if(!form)return;
  const $=id=>document.getElementById(id);
  const storageBlock=$('storage-fields'), routeBlock=$('route-fields'), detailBlock=$('shipment-fields');
  const steps=[...form.querySelectorAll('.qstep')];

  function need(){const c=form.querySelector('input[name="need"]:checked');return c?c.value:'';}
  function setNeed(){
    const n=need(), storage=n==='storage';
    storageBlock.hidden=!storage; routeBlock.hidden=storage;
    steps.slice(1).forEach(s=>s.classList.toggle('is-locked',!n));
    $('shipment-title').textContent=storage?'Storage details':'Shipment details';
  }
  form.addEventListener('change',e=>{if(e.target.name==='need'){setNeed();clearErr(e.target);}});

  // Prefill from the homepage quick quote
  const p=new URLSearchParams(location.search);
  const map={freight:'freight',storage:'storage',unsure:'unsure',temperature:'temperature'};
  if(map[p.get('need')]){const r=form.querySelector('input[name="need"][value="'+map[p.get('need')]+'"]');if(r)r.checked=true;}
  if(p.get('need')==='storage'){if(p.get('from'))$('f-storage').value=p.get('from');if(p.get('pallets'))$('f-spallets').value=p.get('pallets');}
  else{if(p.get('from'))$('f-pickup').value=p.get('from');if(p.get('to'))$('f-dest').value=p.get('to');}
  setNeed();

  function visible(el){return !el.closest('[hidden]');}
  function errFor(el){return document.getElementById(el.id+'-err');}
  function setErr(el,msg){
    const box=el.type==='radio'?$('need-err'):errFor(el);
    if(box)box.textContent=msg;
    if(el.type!=='radio'){el.setAttribute('aria-invalid','true');}
  }
  function clearErr(el){
    const box=el.type==='radio'?$('need-err'):errFor(el);
    if(box)box.textContent='';
    if(el.type!=='radio')el.removeAttribute('aria-invalid');
  }
  function check(el){
    if(!visible(el)){clearErr(el);return true;}
    const v=el.value.trim(), label=el.dataset.label||'This field';
    if(el.required&&!v){setErr(el,label+' is required.');return false;}
    if(el.type==='email'&&v&&!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)){setErr(el,'Enter an email like name@company.com.');return false;}
    if(el.inputMode==='numeric'&&v&&!/^\d[\d,]*$/.test(v)){setErr(el,'Use numbers only, like 12 or 4,500.');return false;}
    clearErr(el);return true;
  }
  form.querySelectorAll('input:not([type=radio]),textarea').forEach(el=>{
    el.addEventListener('blur',()=>{if(el.value.trim()||el.getAttribute('aria-invalid'))check(el);});
    el.addEventListener('input',()=>{if(el.getAttribute('aria-invalid'))check(el);});
  });

  form.addEventListener('submit',e=>{
    e.preventDefault();
    let first=null;
    if(!need()){setErr(form.querySelector('input[name="need"]'),'Choose what we can help with.');first=form.querySelector('input[name="need"]');}
    form.querySelectorAll('input:not([type=radio]),textarea').forEach(el=>{if(!check(el)&&!first)first=el;});
    if(first){first.focus();return;}
    const btn=$('submit-btn');btn.classList.add('is-loading');btn.disabled=true;btn.querySelector('.lbl').textContent='Sending…';
    setTimeout(()=>{
      form.hidden=true;$('quote-aside').hidden=true;
      const ok=$('quote-success');ok.hidden=false;ok.querySelector('h2').focus();
      window.scrollTo({top:ok.getBoundingClientRect().top+scrollY-24,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
    },900);
  });
})();
