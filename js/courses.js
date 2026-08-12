const COURSE_ICONS = { 'Basic Computer':'computer', 'Computer Application':'file-text', 'Certification':'award', 'Accounting':'dollar-sign', 'Design':'palette', 'Hardware':'tool', 'Soft Skills':'user', 'Vocational':'heart', 'Diploma':'graduation-cap' };
const ICONS = {
  'computer':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'file-text':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'award':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  'dollar-sign':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  'palette':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/></svg>',
  'tool':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>',
  'user':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  'heart':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  'graduation-cap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>'
};
const DFLT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';
function getIcon(cat) { const k = COURSE_ICONS[cat] || 'computer'; return ICONS[k] || DFLT_ICON; }
function cardHTML(c) {
  return '<div class="course-card fade-in"><div class="course-card-header"><div class="course-card-icon">' + getIcon(c.category) + '</div><div class="course-card-info"><span class="course-card-category">' + (c.category||'General') + '</span><h3>' + c.title + '</h3></div></div><div class="course-card-body"><p>' + (c.short_description||'Comprehensive training program.') + '</p></div><div class="course-card-footer"><a href="course.html?slug=' + c.slug + '" class="btn btn-sm btn-primary">View Details</a><a href="https://wa.me/917041976140?text=Hello%20VS%20Computer%20Education%2C%20I%20would%20like%20to%20enquire%20about%20' + encodeURIComponent(c.title) + '" target="_blank" rel="noopener" class="btn btn-sm btn-whatsapp">Contact for Fees</a></div></div>';
}
async function loadCourses(gridId, limit) {
  const grid = document.getElementById(gridId||'coursesGrid');
  if (!grid) return;
  try {
    const d = await apiFetch('/courses');
    const cs = d.courses||[];
    if (!cs.length) { grid.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><p>Courses loading soon.</p></div>'; return; }
    grid.innerHTML = (limit ? cs.slice(0, limit) : cs).map(cardHTML).join('');
    requestAnimationFrame(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        const o = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); } }); }, { rootMargin:'0px 0px -50px 0px', threshold:0.1 });
        o.observe(el);
      });
    });
  } catch(e) { console.error(e); grid.innerHTML = '<div class="error-state"><p>Unable to load courses.</p></div>'; }
}
async function loadAllCourses(cid, cat, q) {
  const c = document.getElementById(cid||'allCoursesGrid');
  if (!c) return;
  try {
    let d = (await apiFetch('/courses')).courses||[];
    if (cat && cat !== 'all') d = d.filter(x => x.category === cat);
    if (q) { const lq = q.toLowerCase(); d = d.filter(x => x.title.toLowerCase().includes(lq) || (x.short_description||'').toLowerCase().includes(lq)); }
    if (!d.length) { c.innerHTML = '<div class="empty-state"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg><h3>No courses found</h3><p>Try a different search.</p></div>'; return; }
    c.innerHTML = d.map(cardHTML).join('');
    requestAnimationFrame(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        const o = new IntersectionObserver(entries => { entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); o.unobserve(e.target); } }); }, { rootMargin:'0px 0px -50px 0px', threshold:0.1 });
        o.observe(el);
      });
    });
  } catch(e) { console.error(e); c.innerHTML = '<div class="error-state"><p>Unable to load courses.</p></div>'; }
}
async function loadCourseDetail(cid, slug) {
  const c = document.getElementById(cid||'courseDetail');
  if (!c) return;
  try {
    const d = (await apiFetch('/courses/' + slug)).course;
    if (!d) { c.innerHTML = '<div class="error-state"><h3>Course not found</h3></div>'; return; }
    document.title = d.title + ' — VS Computer Education';
    const items = d.syllabus ? d.syllabus.split('\n').filter(l => l.trim()) : [];
    c.innerHTML = '<div style="display:flex;align-items:center;gap:var(--space-xl);margin-bottom:var(--space-2xl);flex-wrap:wrap;"><div style="width:64px;height:64px;background:var(--color-primary-light);border-radius:var(--radius-lg);display:flex;align-items:center;justify-content:center;color:var(--color-primary);flex-shrink:0;">' + getIcon(d.category) + '</div><div><span class="course-card-category" style="margin-bottom:var(--space-xs);">' + (d.category||'General') + '</span><h1 style="margin-bottom:var(--space-xs);">' + d.title + '</h1>' + (d.duration ? '<p style="color:var(--color-text-secondary);"><strong>Duration:</strong> ' + d.duration + '</p>' : '') + (d.eligibility ? '<p style="color:var(--color-text-secondary);"><strong>Eligibility:</strong> ' + d.eligibility + '</p>' : '') + '</div></div><div class="grid grid-2" style="gap:var(--space-2xl);"><div><section style="margin-bottom:var(--space-2xl);"><h2 style="font-size:1.3rem;margin-bottom:var(--space-md);">Overview</h2><p style="color:var(--color-text-secondary);line-height:1.7;">' + (d.description||'Comprehensive training program.') + '</p></section>' + (items.length ? '<section><h2 style="font-size:1.3rem;margin-bottom:var(--space-md);">Syllabus</h2><div style="display:grid;grid-template-columns:1fr 1fr;gap:var(--space-sm);">' + items.map(i => '<div style="display:flex;align-items:center;gap:var(--space-sm);padding:var(--space-sm) 0;border-bottom:1px solid var(--color-border-light);"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" width="16" height="16" style="flex-shrink:0;"><polyline points="20 6 9 17 4 12"/></svg><span style="font-size:0.9rem;">' + i + '</span></div>').join('') + '</div></section>' : '') + '</div><div><div class="card card-shadow" style="position:sticky;top:calc(var(--navbar-height) + var(--space-xl));"><h3 style="margin-bottom:var(--space-lg);">Ready to Join?</h3><div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md);padding:var(--space-sm) 0;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" width="20" height="20"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span style="font-size:0.9rem;">Certificate after completion</span></div><div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-md);padding:var(--space-sm) 0;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2" width="20" height="20"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><span style="font-size:0.9rem;">Personal attention &amp; practical training</span></div><div style="display:flex;align-items:center;gap:var(--space-sm);margin-bottom:var(--space-lg);padding:var(--space-sm) 0;"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2" width="20" height="20"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span style="font-size:0.9rem;">Unlimited free practice hours</span></div><div style="display:flex;flex-direction:column;gap:var(--space-md);"><a href="demo.html?course=' + encodeURIComponent(d.title) + '" class="btn btn-primary btn-block">Book Free Demo</a><a href="https://wa.me/917041976140?text=Hello%20VS%20Computer%20Education%2C%20I%20would%20like%20to%20enquire%20about%20' + encodeURIComponent(d.title) + '" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">Contact for Fees</a><a href="tel:+917041976140" class="btn btn-outline btn-block">Call Now</a></div></div></div></div>';
  } catch(e) { console.error(e); c.innerHTML = '<div class="error-state"><h3>Unable to load course</h3><p><a href="courses.html">Browse all courses</a></p></div>'; }
}
async function loadCategories(sid) {
  const s = document.getElementById(sid||'categoryFilter');
  if (!s) return;
  try {
    const d = (await apiFetch('/courses/meta/categories')).categories||[];
    d.forEach(cat => { const o = document.createElement('option'); o.value = cat; o.textContent = cat; s.appendChild(o); });
  } catch(e) { console.error(e); }
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('coursesGrid')) loadCourses('coursesGrid', 6);
  if (document.getElementById('allCoursesGrid')) {
    loadAllCourses('allCoursesGrid');
    const cf = document.getElementById('categoryFilter');
    const si = document.getElementById('courseSearch');
    if (cf) { loadCategories('categoryFilter'); cf.addEventListener('change', () => loadAllCourses('allCoursesGrid', cf.value, si?.value||'')); }
    if (si) { let t; si.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => loadAllCourses('allCoursesGrid', cf?.value||'all', si.value), 300); }); }
    const p = new URLSearchParams(window.location.search).get('category');
    if (p && cf) setTimeout(() => { cf.value = p; loadAllCourses('allCoursesGrid', p); }, 500);
  }
  if (document.getElementById('courseDetail')) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (slug) loadCourseDetail('courseDetail', slug);
    else document.getElementById('courseDetail').innerHTML = '<div class="error-state"><h3>No course selected</h3><p><a href="courses.html">Browse all courses</a></p></div>';
  }
});