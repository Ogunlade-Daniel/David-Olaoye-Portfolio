/* =========================================================
   OLAOYE TEMIDARA DAVID · PORTFOLIO · SHARED BEHAVIOR
   ========================================================= */

/* ---------- THEME ---------- */
(function(){
  const root=document.documentElement;
  const stored=localStorage.getItem('theme')||'system';
  const mq=window.matchMedia('(prefers-color-scheme: dark)');
  function apply(theme){
    let eff=theme;
    if(theme==='system') eff=mq.matches?'dark':'light';
    root.setAttribute('data-theme',eff);
    document.querySelectorAll('[data-theme-set]').forEach(b=>{
      const active=b.dataset.themeSet===theme;
      b.classList.toggle('active',active);
      b.setAttribute('aria-pressed',active);
    });
    document.querySelectorAll('.theme-dropdown-toggle').forEach(toggle=>{
      toggle.dataset.currentTheme=theme;
      const icon=toggle.querySelector('.theme-current-icon');
      if(icon) icon.dataset.themeIcon=theme;
    });
  }
  apply(stored);
  mq.addEventListener('change',()=>{if(localStorage.getItem('theme')==='system') apply('system')});
  document.querySelectorAll('[data-theme-set]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const t=btn.dataset.themeSet;
      localStorage.setItem('theme',t);
      apply(t);
    });
  });
})();

/* ---------- THEME DROPDOWN ---------- */
(function(){
  let toggle=document.getElementById('themeDropdownToggle');
  let menu=document.getElementById('themeDropdownMenu');

  if(!toggle || !menu){
    const legacyMenu=document.querySelector('.theme-switch');
    if(!legacyMenu) return;
    const dropdown=document.createElement('div');
    dropdown.className='theme-dropdown';
    dropdown.id='themeDropdown';
    toggle=document.createElement('button');
    toggle.className='theme-dropdown-toggle';
    toggle.id='themeDropdownToggle';
    toggle.type='button';
    toggle.setAttribute('aria-label','Choose color theme');
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls','themeDropdownMenu');
    toggle.innerHTML='<span class="theme-option-icon" aria-hidden="true">T</span><span>Theme</span><svg class="theme-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>';
    menu=legacyMenu;
    menu.id='themeDropdownMenu';
    menu.classList.add('theme-dropdown-menu');
    menu.hidden=true;
    const parent=menu.parentElement;
    parent.insertBefore(dropdown,menu);
    dropdown.append(toggle,menu);
  }

  if(!toggle||!menu) return;

  const setOpen=(open)=>{
    toggle.setAttribute('aria-expanded',String(open));
    menu.hidden=!open;
  };

  toggle.addEventListener('click',()=>{
    setOpen(toggle.getAttribute('aria-expanded')!=='true');
  });
  menu.querySelectorAll('[data-theme-set]').forEach(option=>{
    option.addEventListener('click',()=>setOpen(false));
  });
  document.addEventListener('click',event=>{
    if(!event.target.closest('#themeDropdown')) setOpen(false);
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape' && toggle.getAttribute('aria-expanded')==='true'){
      setOpen(false);
      toggle.focus();
    }
  });
})();

/* ---------- HEADER SCROLL ---------- */
(function(){
  const header=document.getElementById('siteHeader');
  if(!header) return;
  const onScroll=()=>header.classList.toggle('scrolled',window.scrollY>12);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
})();

/* ---------- MOBILE MENU ---------- */
(function(){
  const toggle=document.getElementById('navToggle');
  const menu=document.getElementById('mobileMenu');
  const close=document.getElementById('menuClose');
  if(!toggle||!menu||!close) return;
  const open=()=>{menu.classList.add('open');toggle.setAttribute('aria-expanded','true');document.body.style.overflow='hidden'};
  const shut=()=>{menu.classList.remove('open');toggle.setAttribute('aria-expanded','false');document.body.style.overflow=''};
  toggle.addEventListener('click',open);
  close.addEventListener('click',shut);
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',shut));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') shut()});
})();

/* ---------- SCROLL REVEAL ---------- */
(function(){
  const items=document.querySelectorAll('.reveal');
  if(!items.length) return;
  if(!('IntersectionObserver' in window)){
    items.forEach(el=>el.classList.add('in'));
    return;
  }
  const obs=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('in');obs.unobserve(e.target);}
    });
  },{threshold:.12,rootMargin:'0px 0px -60px 0px'});
  items.forEach(el=>obs.observe(el));
})();

/* ---------- ACTIVE NAV STATE ---------- */
(function(){
  const navLinks=document.querySelectorAll('.nav-links a[href^="#"], .mobile-menu a[href^="#"]');
  const sections=document.querySelectorAll('section[id]');
  if(!navLinks.length || !sections.length) return;

  const setActive=(id)=>{
    navLinks.forEach(link=>{
      const match=link.getAttribute('href')===`#${id}`;
      link.classList.toggle('active',match);
      if(match){
        link.setAttribute('aria-current','page');
      } else {
        link.removeAttribute('aria-current');
      }
    });
  };

  navLinks.forEach(link=>{
    link.addEventListener('click',()=>{
      const id=link.getAttribute('href')?.replace('#','');
      if(id) setActive(id);
    });
  });

  const observer=new IntersectionObserver((entries)=>{
    const visible=entries
      .filter(entry=>entry.isIntersecting)
      .sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
    if(visible && visible.target.id) setActive(visible.target.id);
  },{
    threshold:[0.2,0.45,0.7],
    rootMargin:'-15% 0px -45% 0px'
  });

  sections.forEach(section=>observer.observe(section));
})();

/* ---------- BACK TO TOP ---------- */
(function(){
  const btn=document.getElementById('backToTop');
  if(!btn) return;
  const onScroll=()=>btn.classList.toggle('show',window.scrollY>500);
  onScroll();
  window.addEventListener('scroll',onScroll,{passive:true});
  btn.addEventListener('click',()=>{
    const start=window.scrollY;
    const duration=window.matchMedia('(prefers-reduced-motion: reduce)').matches?1:Math.min(1800,Math.max(900,start*0.55));
    let startedAt;
    const animate=(time)=>{
      if(startedAt===undefined) startedAt=time;
      const progress=Math.min((time-startedAt)/duration,1);
      const eased=progress<.5?4*progress*progress*progress:1-Math.pow(-2*progress+2,3)/2;
      window.scrollTo({top:start*(1-eased),behavior:'instant'});
      if(progress<1) window.requestAnimationFrame(animate);
    };
    window.requestAnimationFrame(animate);
  });
})();

/* ---------- CONTACT FORM ---------- */
(function(){
  const form=document.getElementById('contactForm');
  if(!form) return;
  const success=document.getElementById('formSuccess');
  const validators={
    'cf-name': v=>v.trim().length>=2||'Please enter your full name.',
    'cf-email': v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())||'Please enter a valid email address.',
    'cf-subject': v=>v.trim().length>=3||'Please add a subject.',
    'cf-message': v=>v.trim().length>=10||'Please write a short message (10+ characters).'
  };
  function setError(id,msg){
    const field=document.getElementById(id).closest('.field');
    const msgEl=field.querySelector('.msg');
    if(msg){
      field.classList.add('error');field.classList.remove('success');
      msgEl.textContent=msg;
      document.getElementById(id).setAttribute('aria-invalid','true');
    } else {
      field.classList.remove('error');field.classList.add('success');
      msgEl.textContent='';
      document.getElementById(id).removeAttribute('aria-invalid');
    }
  }
  Object.keys(validators).forEach(id=>{
    const el=document.getElementById(id);
    el.addEventListener('blur',()=>{
      const res=validators[id](el.value);
      setError(id,res===true?'':res);
    });
    el.addEventListener('input',()=>{
      const field=el.closest('.field');
      if(field.classList.contains('error')){
        const res=validators[id](el.value);
        setError(id,res===true?'':res);
      }
    });
  });
  form.addEventListener('submit',e=>{
    e.preventDefault();
    let ok=true;
    Object.keys(validators).forEach(id=>{
      const el=document.getElementById(id);
      const res=validators[id](el.value);
      if(res!==true){ok=false;setError(id,res)} else setError(id,'');
    });
    if(!ok){
      const firstErr=form.querySelector('.field.error input, .field.error textarea');
      if(firstErr) firstErr.focus();
      return;
    }
    success.classList.add('show');
    form.reset();
    form.querySelectorAll('.field').forEach(f=>f.classList.remove('success'));
    setTimeout(()=>success.classList.remove('show'),6000);
  });
})();