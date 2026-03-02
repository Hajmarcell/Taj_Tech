// VITRINE TAJ — Shared Scripts

document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR ──────────────────────────────────────────────
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx=0,my=0,rx=0,ry=0;

  if (cur && curR) {
    document.addEventListener('mousemove', e => {
      mx=e.clientX; my=e.clientY;
      cur.style.left=mx+'px'; cur.style.top=my+'px';
    });
    (function animR(){
      rx+=(mx-rx)*.1; ry+=(my-ry)*.1;
      curR.style.left=rx+'px'; curR.style.top=ry+'px';
      requestAnimationFrame(animR);
    })();

    document.querySelectorAll('a,button,.display-card,.serve-item,.hoverable').forEach(el=>{
      el.addEventListener('mouseenter',()=>{
        cur.style.transform='translate(-50%,-50%) scale(2.2)';
        cur.style.background='var(--orange)';
        curR.style.transform='translate(-50%,-50%) scale(1.4)';
        curR.style.borderColor='rgba(196,81,42,0.5)';
      });
      el.addEventListener('mouseleave',()=>{
        cur.style.transform='translate(-50%,-50%) scale(1)';
        cur.style.background='var(--blue)';
        curR.style.transform='translate(-50%,-50%) scale(1)';
        curR.style.borderColor='rgba(126,184,201,0.4)';
      });
    });
  }

  // ── NAV SCROLL STATE ────────────────────────────────────
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, {passive:true});
  }

  // ── MOBILE HAMBURGER ────────────────────────────────────
  const hamburger = document.querySelector('.nav-hamburger');
  const drawer    = document.querySelector('.nav-drawer');
  if (hamburger && drawer) {
    hamburger.addEventListener('click', () => {
      const open = drawer.classList.toggle('open');
      document.body.style.overflow = open ? 'hidden' : '';
    });
    drawer.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        drawer.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ── ACTIVE NAV LINK ─────────────────────────────────────
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-drawer a').forEach(a => {
    if (a.getAttribute('href') === page) a.classList.add('active');
  });

  // ── SCROLL REVEAL ───────────────────────────────────────
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        obs.unobserve(e.target);
      }
    });
  }, {threshold: 0.1});
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

});
