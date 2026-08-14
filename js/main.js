// VS Computer Education - Enhanced Animations
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}
if (navbar) {
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 20); });
}

// Splash screen
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hidden');
    // Start typing effect after splash
    startTyping();
    // Start stat counters
    observeStats();
  }, 1500);
});

// Typing effect
function startTyping() {
  const h1 = document.querySelector('.hero h1');
  if (!h1) return;
  const text = h1.textContent.trim();
  h1.textContent = '';
  h1.innerHTML = '<span class="typing-text"></span><span class="typing-cursor">|</span>';
  const span = h1.querySelector('.typing-text');
  let i = 0;
  function type() {
    if (i < text.length) {
      span.textContent += text[i];
      i++;
      setTimeout(type, 30 + Math.random() * 20);
    } else {
      const cursor = h1.querySelector('.typing-cursor');
      setTimeout(() => { if (cursor) cursor.style.display = 'none'; }, 1500);
    }
  }
  setTimeout(type, 300);
}

// Stat counters
function observeStats() {
  const stats = document.querySelectorAll('.hero-stat');
  if (!stats.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const num = e.target.querySelector('.stat-number');
        if (num && !num.dataset.counted) {
          num.dataset.counted = 'true';
          animateCounter(num);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  stats.forEach(s => obs.observe(s));
}

function animateCounter(el) {
  const text = el.textContent;
  const match = text.match(/(\\d+)\\s*(\\+)?/);
  if (!match) return;
  const target = parseInt(match[1]);
  const suffix = match[2] || '';
  const duration = 1200;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Scroll fade animations
const fadeEls = document.querySelectorAll('.fade-in, .scroll-fade, .feature-card, .contact-card, .course-card');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  });
}, { rootMargin: '0px 0px -60px 0px', threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));

// API helper
async function apiFetch(endpoint, opts = {}) {
  const config = { headers: { 'Content-Type': 'application/json', ...opts.headers }, ...opts };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const res = await fetch(API_BASE + endpoint, config);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
