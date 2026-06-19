/* ============================================================
   PORTFOLIO — main.js
   ============================================================ */

/* ---- Typed.js effect ---- */
const TYPED_STRINGS = [
  'Full-Stack Developer',
  'UI/UX Enthusiast',
  'Open-Source Contributor',
  'Problem Solver',
];

function initTyped() {
  const el = document.getElementById('typed-text');
  if (!el) return;
  let si = 0, ci = 0, deleting = false;
  const tick = () => {
    const str = TYPED_STRINGS[si];
    if (!deleting) {
      el.textContent = str.slice(0, ++ci);
      if (ci === str.length) { deleting = true; setTimeout(tick, 1800); return; }
    } else {
      el.textContent = str.slice(0, --ci);
      if (ci === 0) { deleting = false; si = (si + 1) % TYPED_STRINGS.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  };
  tick();
}

/* ---- Navbar scroll behavior ---- */
function initNavbar() {
  const nav = document.getElementById('navbar');
  const links = nav.querySelectorAll('.nav-links a, .mobile-nav a[data-section]');
  const sections = document.querySelectorAll('section[id]');

  const update = () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
    const y = window.scrollY + 120;
    let active = '';
    sections.forEach(s => { if (s.offsetTop <= y) active = s.id; });
    links.forEach(a => {
      const href = (a.getAttribute('href') || '').replace('#', '');
      a.classList.toggle('active', href === active);
    });
  };

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---- Mobile nav ---- */
function initMobileNav() {
  const burger = document.getElementById('hamburger');
  const drawer = document.getElementById('mobile-nav');
  const overlay = document.getElementById('nav-overlay');
  const closeBtn = document.getElementById('mobile-nav-close');
  const links = drawer.querySelectorAll('a');

  const open = () => { drawer.classList.add('open'); overlay.classList.add('show'); document.body.style.overflow = 'hidden'; };
  const close = () => { drawer.classList.remove('open'); overlay.classList.remove('show'); document.body.style.overflow = ''; };

  burger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', close);
  links.forEach(a => a.addEventListener('click', close));
}

/* ---- Back to top ---- */
function initBackTop() {
  const btn = document.getElementById('back-top');
  window.addEventListener('scroll', () => btn.classList.toggle('show', window.scrollY > 400), { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ---- Theme switch ---- */
function initTheme() {
  const btn = document.getElementById('theme-btn');
  const icon = btn.querySelector('i');
  const stored = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
  icon.className = stored === 'dark' ? 'bi bi-sun' : 'bi bi-moon';

  btn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    icon.className = next === 'dark' ? 'bi bi-sun' : 'bi bi-moon';
  });
}

/* ---- Scroll animations (AOS-lite) ---- */
function initAOS() {
  const items = document.querySelectorAll('[data-aos]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const delay = e.target.dataset.aosDelay || 0;
        setTimeout(() => e.target.classList.add('aos-animate'), +delay);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(el => io.observe(el));
}

/* ---- Animated counters ---- */
function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      const suffix = el.dataset.suffix || '';
      let start = 0;
      const dur = 1600;
      const step = 16;
      const inc = target / (dur / step);
      const run = () => {
        start = Math.min(start + inc, target);
        el.textContent = Math.floor(start) + suffix;
        if (start < target) requestAnimationFrame(run);
      };
      run();
      io.unobserve(el);
    });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

/* ---- Skill bars ---- */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-fill[data-pct]');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.style.width = e.target.dataset.pct + '%';
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(el => io.observe(el));
}

/* ---- Circular skills ---- */
function initCircular() {
  const arcs = document.querySelectorAll('.circular-arc[data-pct]');
  const circumference = 219.9;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const pct = +e.target.dataset.pct;
        e.target.style.strokeDashoffset = circumference * (1 - pct / 100);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  arcs.forEach(el => io.observe(el));
}

/* ---- Portfolio filter ---- */
function initPortfolioFilter() {
  const btns = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.portfolio-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const show = filter === 'all' || card.dataset.cat === filter;
        card.style.transition = 'opacity 0.3s, transform 0.3s';
        card.style.opacity = show ? '1' : '0';
        card.style.transform = show ? '' : 'scale(0.95)';
        card.style.pointerEvents = show ? '' : 'none';
      });
    });
  });
}

/* ---- Testimonial slider ---- */
function initSlider() {
  const track = document.querySelector('.testimonials-track');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!track || !slides.length) return;
  let current = 0;

  const go = (idx) => {
    current = (idx + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  };

  document.getElementById('slider-prev')?.addEventListener('click', () => go(current - 1));
  document.getElementById('slider-next')?.addEventListener('click', () => go(current + 1));
  dots.forEach((d, i) => d.addEventListener('click', () => go(i)));

  // Auto-advance
  setInterval(() => go(current + 1), 5000);
  go(0);
}

/* ---- Contact form ---- */
function initForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const msg = document.getElementById('form-msg');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('.btn-primary');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    // Replace with your Formspree endpoint:
    // const res = await fetch('https://formspree.io/f/YOUR_ID', { method:'POST', body: new FormData(form), headers:{ 'Accept':'application/json' }});
    // Simulate for demo:
    await new Promise(r => setTimeout(r, 1200));

    msg.textContent = 'Message sent! I\'ll get back to you soon.';
    msg.style.color = '#22c55e';
    form.reset();
    btn.disabled = false;
    btn.textContent = 'Send Message';
    setTimeout(() => msg.textContent = '', 5000);
  });
}

/* ---- Init ---- */
document.addEventListener('DOMContentLoaded', () => {
  initTyped();
  initNavbar();
  initMobileNav();
  initBackTop();
  initTheme();
  initAOS();
  initCounters();
  initSkillBars();
  initCircular();
  initPortfolioFilter();
  initSlider();
  initForm();
});