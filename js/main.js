const API_BASE = '/api';
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));
}
if (navbar) {
  window.addEventListener('scroll', () => { navbar.classList.toggle('scrolled', window.scrollY > 20); });
}
const fadeEls = document.querySelectorAll('.fade-in');
const obs = new IntersectionObserver((entries) => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
}, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
fadeEls.forEach(el => obs.observe(el));
async function apiFetch(endpoint, opts = {}) {
  const config = { headers: { 'Content-Type': 'application/json', ...opts.headers }, ...opts };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const r = await fetch(API_BASE + endpoint, config);
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}
function validatePhone(p) { return /^[6-9]\d{9}$/.test(p.replace(/\s+/g, '')); }
function openWhatsApp(num, msg) { window.open('https://wa.me/' + num + '?text=' + encodeURIComponent(msg), '_blank'); }
document.addEventListener('DOMContentLoaded', () => {
  const yearEls = document.querySelectorAll('.footer-bottom');
  yearEls.forEach(el => { el.innerHTML = el.innerHTML.replace('2026', new Date().getFullYear()); });
  console.log('VS Computer Education initialized');
});