// TAJ TECH — Shared Scripts

document.addEventListener('DOMContentLoaded', () => {

  // ── CURSOR (dot + ring) ─────────────────────────────────
  const cur  = document.getElementById('cur');
  const curR = document.getElementById('curR');
  let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;

  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

  if (cur && curR) {
    document.addEventListener('mousemove', () => { cur.style.left = mx + 'px'; cur.style.top = my + 'px'; });
    (function animR(){
      rx += (mx - rx) * .1; ry += (my - ry) * .1;
      curR.style.left = rx + 'px'; curR.style.top = ry + 'px';
      requestAnimationFrame(animR);
    })();

    document.querySelectorAll('a,button,.display-card,.serve-item,.hoverable').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(2)';
        cur.style.background = 'var(--pink)';
        curR.style.transform = 'translate(-50%,-50%) scale(1.5)';
        curR.style.borderColor = 'rgba(47,91,234,.5)';
      });
      el.addEventListener('mouseleave', () => {
        cur.style.transform = 'translate(-50%,-50%) scale(1)';
        cur.style.background = 'var(--blue)';
        curR.style.transform = 'translate(-50%,-50%) scale(1)';
        curR.style.borderColor = 'rgba(255,90,60,.45)';
      });
    });
  }

  // ── CURSOR PICKER: dot / mouse / goose / normal ─────────
  if (!matchMedia('(hover:none)').matches) {
    const MODES = [
      { id: 'dot',    icon: '✨', label: 'Sparkle cursor' },
      { id: 'mouse',  icon: '🐁', label: 'Running mouse' },
      { id: 'goose',  icon: '🪿', label: 'Running goose' },
      { id: 'normal', icon: '🖱️', label: 'Normal cursor' }
    ];
    const PET_FACES_LEFT = true; // set to false if your pet runs backwards
    const root = document.documentElement;

    const pet = document.createElement('div');
    pet.className = 'pet';
    pet.innerHTML = '<span class="pet-i"></span>';
    pet.style.display = 'none';
    document.body.appendChild(pet);
    const petI = pet.firstChild;

    let px = mx, py = my, mode = 'dot';

    function setMode(id) {
      mode = id;
      try { localStorage.setItem('tajCursor', id); } catch (e) {}
      const m = MODES.find(x => x.id === id);
      root.classList.toggle('native-cursor', id === 'normal');
      root.classList.toggle('pet-mode', id === 'mouse' || id === 'goose');
      document.body.classList.toggle('native-cursor', id === 'normal');
      document.body.classList.toggle('pet-mode', id === 'mouse' || id === 'goose');
      const isPet = id === 'mouse' || id === 'goose';
      pet.style.display = isPet ? 'block' : 'none';
      if (isPet) petI.textContent = m.icon;
      picker.querySelectorAll('button').forEach(b => b.classList.toggle('on', b.dataset.id === id));
    }

    const picker = document.createElement('div');
    picker.className = 'cur-picker';
    MODES.forEach(m => {
      const b = document.createElement('button');
      b.dataset.id = m.id; b.textContent = m.icon; b.title = m.label; b.setAttribute('aria-label', m.label);
      b.addEventListener('click', () => setMode(m.id));
      picker.appendChild(b);
    });
    document.body.appendChild(picker);

    (function chase() {
      if (mode === 'mouse' || mode === 'goose') {
        const dx = mx - px, dy = my - py, dist = Math.hypot(dx, dy);
        const speed = mode === 'mouse' ? .12 : .07; // mouse is quicker, goose waddles
        if (dist > 28) {
          px += dx * speed; py += dy * speed;
          pet.classList.add('run');
          const goingRight = dx > 0;
          pet.style.setProperty('--f', (goingRight === PET_FACES_LEFT) ? -1 : 1);
        } else {
          pet.classList.remove('run');
        }
        pet.style.transform = `translate(${px - 22}px,${py - 30}px)`;
      }
      requestAnimationFrame(chase);
    })();

    let saved = 'dot';
    try { saved = localStorage.getItem('tajCursor') || 'dot'; } catch (e) {}
    setMode(saved);
  }

  // ── CONFETTI ON CLICK ───────────────────────────────────
  const COLORS = ['#ff5a3c', '#ee2347', '#ff4f9a', '#2f5bea', '#9bdcff', '#ffb23d'];
  document.addEventListener('click', e => {
    if (e.target.closest('.cur-picker') || matchMedia('(prefers-reduced-motion:reduce)').matches) return;
    for (let i = 0; i < 12; i++) {
      const c = document.createElement('span');
      c.className = 'confetti';
      c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px';
      c.style.background = COLORS[i % COLORS.length];
      c.style.setProperty('--x', (Math.random() * 160 - 80) + 'px');
      c.style.setProperty('--y', (Math.random() * 160 - 80) + 'px');
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 900);
    }
  });

  // ── NAV SCROLL STATE ────────────────────────────────────
  const nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
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
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));

});
