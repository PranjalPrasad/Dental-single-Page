/* ============================================================
   DENOVA Elite Dental Studio — script2.js
   ============================================================ */

'use strict';

// ===== STAR CANVAS =====
(function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, stars = [];

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.2,
        a: Math.random(),
        speed: Math.random() * 0.003 + 0.001,
        phase: Math.random() * Math.PI * 2
      });
    }
  }

  function draw(t) {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.a = 0.3 + 0.4 * Math.sin(t * s.speed + s.phase);
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180, 200, 255, ${s.a})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  resize();
  createStars(200);
  window.addEventListener('resize', () => { resize(); createStars(200); });
  requestAnimationFrame(draw);
})();


// ===== NAVBAR =====
const nav = document.getElementById('nav');
const navProgress = document.getElementById('navProgress');
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  nav.classList.toggle('scrolled', scrollY > 60);

  // Progress bar
  const total = document.documentElement.scrollHeight - window.innerHeight;
  navProgress.style.width = ((scrollY / total) * 100) + '%';
}, { passive: true });

burger.addEventListener('click', () => {
  burger.classList.toggle('open');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    burger.classList.remove('open');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});


// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});


// ===== SCROLL REVEAL =====
const revealEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
revealEls.forEach(el => revObs.observe(el));


// ===== COUNTER ANIMATION =====
function animCounter(el, target) {
  const dur = 2000;
  const start = performance.now();
  const isLarge = target >= 1000;

  requestAnimationFrame(function tick(ts) {
    const p = Math.min((ts - start) / dur, 1);
    const ease = 1 - Math.pow(1 - p, 4);
    const val = Math.round(target * ease);
    el.textContent = isLarge ? (val >= 1000 ? Math.floor(val / 1000) + 'K+' : val) : val + (target >= 10 ? '+' : '');
    if (p < 1) requestAnimationFrame(tick);
  });
}

const counterEls = document.querySelectorAll('.counter');
let countersStarted = false;
const counterObs = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting && !countersStarted) {
    countersStarted = true;
    counterEls.forEach(el => {
      const target = parseInt(el.dataset.target, 10);
      animCounter(el, target);
    });
  }
}, { threshold: 0.5 });
if (counterEls.length) counterObs.observe(counterEls[0].closest('.hero-kpi') || document.body);


// ===== HERO CARD 3D TILT =====
const heroCard = document.getElementById('heroCard');
if (heroCard) {
  document.addEventListener('mousemove', e => {
    const rect = heroCard.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width;
    const dy = (e.clientY - cy) / rect.height;
    heroCard.style.transform = `perspective(1000px) rotateY(${dx * 10}deg) rotateX(${-dy * 10}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    heroCard.style.transform = '';
  });
}


// ===== GLOW BUTTON MAGNETIC EFFECT =====
const glowBtn = document.getElementById('glowBtn');
if (glowBtn) {
  glowBtn.addEventListener('mousemove', e => {
    const rect = glowBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    glowBtn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
  });
  glowBtn.addEventListener('mouseleave', () => {
    glowBtn.style.transform = '';
  });
}


// ===== SCROLL CUE HIDE =====
const scrollCue = document.getElementById('scrollCue');
if (scrollCue) {
  window.addEventListener('scroll', () => {
    scrollCue.style.opacity = window.scrollY > 100 ? '0' : '1';
  }, { passive: true });
}


// ===== BEFORE / AFTER SLIDERS =====
document.querySelectorAll('.ba-card').forEach(card => {
  const inner = card.querySelector('.ba-inner');
  const after = card.querySelector('.ba-after');
  const divider = card.querySelector('.ba-divider');
  if (!inner || !after || !divider) return;

  let dragging = false;

  function setPos(clientX) {
    const rect = inner.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(3, Math.min(97, pct));
    divider.style.left = pct + '%';
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
  }

  inner.addEventListener('mousedown', e => { dragging = true; setPos(e.clientX); e.preventDefault(); });
  window.addEventListener('mousemove', e => { if (dragging) setPos(e.clientX); });
  window.addEventListener('mouseup', () => { dragging = false; });
  inner.addEventListener('touchstart', e => { dragging = true; setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchmove', e => { if (dragging) setPos(e.touches[0].clientX); }, { passive: true });
  window.addEventListener('touchend', () => { dragging = false; });

  // Auto-demo on entry
  let demoRan = false;
  const demoObs = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !demoRan) {
      demoRan = true;
      setTimeout(runDemo, 600);
    }
  }, { threshold: 0.6 });
  demoObs.observe(card);

  function runDemo() {
    let pos = 50, direction = -1, bounces = 0;
    const iv = setInterval(() => {
      pos += direction * 0.9;
      if (pos <= 20) direction = 1;
      if (pos >= 50 && direction === 1) { bounces++; if (bounces >= 1) { clearInterval(iv); return; } direction = -1; }
      divider.style.left = pos + '%';
      after.style.clipPath = `inset(0 ${100 - pos}% 0 0)`;
    }, 16);
  }
});


// ===== TESTIMONIAL CAROUSEL =====
const track = document.getElementById('testiTrack');
const dots = document.querySelectorAll('.tdot');
let current = 0;
let autoT;
const cards = document.querySelectorAll('.testi-card');
const cardW = cards.length ? cards[0].offsetWidth + 20 : 360;

function goTo(i) {
  current = Math.max(0, Math.min(i, cards.length - 1));
  track.style.transform = `translateX(-${current * (cardW)}px)`;
  dots.forEach((d, idx) => d.classList.toggle('active', idx === current));
}

dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); resetAuto(); }));

function resetAuto() {
  clearInterval(autoT);
  autoT = setInterval(() => { goTo((current + 1) % cards.length); }, 4000);
}
resetAuto();

// Touch swipe on testimonials
let tsX = 0;
const testiScroll = document.getElementById('testiScroll');
if (testiScroll) {
  testiScroll.addEventListener('touchstart', e => { tsX = e.touches[0].clientX; }, { passive: true });
  testiScroll.addEventListener('touchend', e => {
    const diff = tsX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  }, { passive: true });
}


// ===== FORM VALIDATION =====
const form = document.getElementById('bookForm');
const formOk = document.getElementById('formOk');

const dateInput = document.getElementById('fd');
if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];

function validate(id, test, msg) {
  const el = document.getElementById(id);
  const err = document.getElementById(id + '-e');
  const ok = test(el ? el.value.trim() : '');
  if (el) el.classList.toggle('err', !ok);
  if (err) err.textContent = ok ? '' : msg;
  return ok;
}

function runAll() {
  const a = validate('fn', v => v.length >= 2, 'Please enter your name.');
  const b = validate('fp', v => /^[\+\d\s\-]{7,}$/.test(v), 'Enter a valid phone number.');
  const c = validate('fe', v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Enter a valid email.');
  const d = validate('fd', v => v && new Date(v) >= new Date(new Date().toDateString()), 'Select a future date.');
  return a && b && c && d;
}

['fn', 'fp', 'fe', 'fd'].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('blur', () => runAll());
});

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!runAll()) {
      form.style.animation = 'none';
      requestAnimationFrame(() => {
        form.style.animation = 'shake 0.4s ease';
      });
      return;
    }
    const btn = document.getElementById('submitBtn');
    const txt = document.getElementById('btnText');
    if (btn) btn.disabled = true;
    if (txt) txt.textContent = 'Sending...';
    setTimeout(() => {
      form.style.display = 'none';
      formOk.classList.add('show');
    }, 1200);
  });
}

// Inject shake keyframe
const styleEl = document.createElement('style');
styleEl.textContent = `
@keyframes shake { 0%,100%{transform:translateX(0)} 20%,60%{transform:translateX(-8px)} 40%,80%{transform:translateX(8px)} }
`;
document.head.appendChild(styleEl);


// ===== STICKY PILL =====
const stickyPill = document.getElementById('stickyPill');
window.addEventListener('scroll', () => {
  if (stickyPill) stickyPill.classList.toggle('show', window.scrollY > 500);
}, { passive: true });


// ===== SERVICE CARD CURSOR GLOW =====
document.querySelectorAll('.svc-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mx', x + 'px');
    card.style.setProperty('--my', y + 'px');
  });
});


// ===== BRANCH ROW HOVER SOUND (visual pulse) =====
document.querySelectorAll('.branch-row').forEach(row => {
  row.addEventListener('mouseenter', () => {
    row.style.background = 'rgba(0,229,255,0.02)';
  });
  row.addEventListener('mouseleave', () => {
    row.style.background = '';
  });
});


// ===== MARQUEE PAUSE ON HOVER =====
const marquee = document.getElementById('marquee');
if (marquee) {
  marquee.addEventListener('mouseenter', () => { marquee.style.animationPlayState = 'paused'; });
  marquee.addEventListener('mouseleave', () => { marquee.style.animationPlayState = 'running'; });
}


// ===== PHOTO WALL LIGHTBOX =====
(function() {
  const lb = document.createElement('div');
  lb.style.cssText = 'display:none;position:fixed;inset:0;z-index:9999;background:rgba(5,8,16,0.96);display:flex;align-items:center;justify-content:center;cursor:zoom-out;';
  lb.innerHTML = `<img style="max-width:90vw;max-height:90vh;border-radius:12px;" /><button style="position:absolute;top:24px;right:28px;background:none;border:none;color:rgba(240,242,248,0.7);font-size:1.8rem;cursor:pointer;font-family:sans-serif;">✕</button>`;
  lb.style.display = 'none';
  document.body.appendChild(lb);

  lb.addEventListener('click', () => { lb.style.display = 'none'; document.body.style.overflow = ''; });

  document.querySelectorAll('.pw-item img').forEach(img => {
    img.style.cursor = 'zoom-in';
    img.addEventListener('click', () => {
      lb.querySelector('img').src = img.src;
      lb.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    });
  });
})();


// ===== CURSOR GLOW (desktop only) =====
if (window.matchMedia('(pointer: fine)').matches) {
  const cursor = document.createElement('div');
  cursor.style.cssText = `
    position: fixed; pointer-events: none; z-index: 9998;
    width: 300px; height: 300px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(0,229,255,0.04) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.1s ease, top 0.1s ease;
  `;
  document.body.appendChild(cursor);

  document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
  });
}


// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  const mid = window.scrollY + window.innerHeight / 2;
  sections.forEach(sec => {
    const link = document.querySelector(`.nl[href="#${sec.id}"]`);
    if (!link) return;
    const inView = mid >= sec.offsetTop && mid < sec.offsetTop + sec.offsetHeight;
    link.style.color = inView ? 'var(--cyan)' : '';
  });
}, { passive: true });


console.log('%cDENOVA Elite Dental Studio', 'color:#00E5FF;font-size:18px;font-weight:900;font-family:Syne,sans-serif;');
console.log('%cCrafting extraordinary smiles.', 'color:#7B2FFF;font-size:12px;');