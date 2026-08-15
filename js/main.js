// VS Computer Education - Enhanced Animations
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// Nav toggle
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}

// Navbar shrink + scrolled state
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
    navbar.classList.toggle('shrink', window.scrollY > 120);
  });
}

// Splash screen - quick 0.4s fade, no fake progress bar
window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash-screen');
    if (splash) splash.classList.add('hidden');
    observeStats();
    setTimeout(typeWord, 600);
  }, 400);
});

// Rotating hero words
const rotatingWords = ['Computer Skills', 'Tally Prime', 'Graphic Design', 'Hardware & Networking'];
let wordIndex = 0;
let charIndex = 0;
let deleting = false;
const rotatingEl = document.getElementById('rotating-word');

function typeWord() {
  if (!rotatingEl) return;
  const current = rotatingWords[wordIndex];
  if (deleting) {
    charIndex--;
    rotatingEl.textContent = current.substring(0, charIndex);
  } else {
    charIndex++;
    rotatingEl.textContent = current.substring(0, charIndex);
  }
  let speed = deleting ? 40 : 80;
  if (!deleting && charIndex === current.length) {
    speed = 1800;
    deleting = true;
  } else if (deleting && charIndex === 0) {
    deleting = false;
    wordIndex = (wordIndex + 1) % rotatingWords.length;
    speed = 300;
  }
  setTimeout(typeWord, speed);
}

// Stat counters (count up from 0 when hero scrolls into view)
function observeStats() {
  const nums = document.querySelectorAll('.stat-number');
  if (!nums.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const num = e.target;
        if (!num.dataset.counted) {
          num.dataset.counted = 'true';
          animateCounter(num);
        }
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.5 });
  nums.forEach(n => obs.observe(n));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target || '0', 10);
  const duration = 1200;
  const start = performance.now();
  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(update);
  }
  requestAnimationFrame(update);
}

// Testimonial carousel - auto-advances every 5s
function initTestimonials() {
  const track = document.getElementById('testimonialTrack');
  const dots = document.querySelectorAll('#testimonialDots .dot');
  if (!track || !dots.length) return;
  let current = 0;
  const total = track.children.length;
  function goTo(i) {
    current = (i + total) % total;
    track.style.transform = `translateX(-${current * 100}%)`;
    dots.forEach((d, di) => d.classList.toggle('active', di === current));
  }
  dots.forEach((d, di) => d.addEventListener('click', () => {
    goTo(di);
    clearInterval(interval);
    interval = setInterval(() => goTo(current + 1), 5000);
  }));
  let interval = setInterval(() => goTo(current + 1), 5000);
}

initTestimonials();

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
