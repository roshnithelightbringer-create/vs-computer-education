// VS Computer Education - Courses JS
// Diploma courses are shown as featured, rest as skill courses

const FEATURED_SLUGS = ['dca', 'adca', 'adct', 'pgdca'];

const ICONS = {
  'graduation-cap':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>',
  'computer':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'file-text':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'award':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>',
  'dollar-sign':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  'palette':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/></svg>',
  'code':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  'trending':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>',
  'message-circle':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>',
  'cpu':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/><line x1="9" y1="20" x2="9" y2="23"/><line x1="15" y1="20" x2="15" y2="23"/><line x1="20" y1="9" x2="23" y2="9"/><line x1="20" y1="14" x2="23" y2="14"/><line x1="1" y1="9" x2="4" y2="9"/><line x1="1" y1="14" x2="4" y2="14"/></svg>',
  'globe':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>'
};

const DFLT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

function getIcon(name) {
  return ICONS[name] || DFLT_ICON;
}

function featuredCardHTML(c) {
  const slug = c.slug || '';
  const iconMap = {'dca':'graduation-cap','adca':'award','adct':'file-text','pgdca':'graduation-cap'};
  const icon = iconMap[slug] || 'graduation-cap';
  return '<div class="featured-card fade-in"><div class="featured-card-icon">' + getIcon(icon) + '</div><div class="diploma-tag">DIPLOMA</div><h3>' + c.title + '</h3><div class="full-name">' + (c.short_description || '') + '</div>' + (c.duration ? '<div class="course-duration"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>' + c.duration + '</div>' : '') + '<p>' + (c.description ? c.description.substring(0, 120) + '...' : 'Comprehensive diploma program with practical training.') + '</p><a href="course.html?slug=' + slug + '" class="btn btn-light">View Course Details</a></div>';
}

function skillCardHTML(c) {
  const slug = c.slug || '';
  const iconMap = {'tally-prime':'dollar-sign','photoshop':'palette','web-development':'code','digital-marketing':'trending','ai':'cpu','english-speaking':'message-circle'};
  const icon = iconMap[slug] || 'computer';
  return '<div class="skill-card fade-in"><div class="skill-card-icon">' + getIcon(icon) + '</div><div class="skill-tag">SKILL COURSE</div><h3>' + c.title + '</h3><div class="skill-desc">' + (c.short_description || '') + '</div><a href="course.html?slug=' + slug + '" class="btn btn-sm btn-primary">View Details</a></div>';
}

async function loadCourses() {
  const featuredGrid = document.getElementById('featuredCoursesGrid');
  const skillGrid = document.getElementById('skillCoursesGrid');
  if (!featuredGrid && !skillGrid) return;
  
  try {
    const resp = await apiFetch('/courses');
    const all = resp.courses || [];
    
    const featured = all.filter(c => FEATURED_SLUGS.includes(c.slug));
    const skills = all.filter(c => !FEATURED_SLUGS.includes(c.slug));
    
    if (featuredGrid) {
      if (featured.length) {
        featuredGrid.innerHTML = featured.map(featuredCardHTML).join('');
      } else {
        featuredGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:rgba(255,255,255,0.7)"><p>Diploma courses loading...</p></div>';
      }
    }
    
    if (skillGrid) {
      if (skills.length) {
        skillGrid.innerHTML = skills.map(skillCardHTML).join('');
      } else {
        skillGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-secondary)"><p>Skill courses loading...</p></div>';
      }
    }
    
    requestAnimationFrame(() => {
      document.querySelectorAll('.fade-in').forEach(el => {
        const o = new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (e.isIntersecting) {
              e.target.classList.add('visible');
              o.unobserve(e.target);
            }
          });
        }, { rootMargin: '0px 0px -50px 0px', threshold: 0.1 });
        o.observe(el);
      });
    });
  } catch(e) {
    console.error(e);
    if (featuredGrid) featuredGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:rgba(255,255,255,0.7)"><p>Unable to load courses. Please try again.</p></div>';
    if (skillGrid) skillGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-secondary)"><p>Unable to load courses. Please try again.</p></div>';
  }
}

async function loadCourseDetail(cid, slug) {
  const c = document.getElementById(cid || 'courseDetail');
  if (!c) return;
  try {
    const resp = await apiFetch('/courses/' + slug);
    const d = resp.course;
    if (!d) {
      c.innerHTML = '<div class="error-state"><h3>Course not found</h3><p><a href="courses.html">Browse all courses</a></p></div>';
      return;
    }
    document.title = d.title + ' — VS Computer Education';
    
    const isFeatured = FEATURED_SLUGS.includes(slug);
    const iconMap = {'dca':'graduation-cap','adca':'award','adct':'file-text','pgdca':'graduation-cap','tally-prime':'dollar-sign','photoshop':'palette','web-development':'code','digital-marketing':'trending','ai':'cpu','english-speaking':'message-circle'};
    const icon = iconMap[slug] || 'computer';
    
    c.innerHTML = '<div class="course-detail-header"><div class="course-detail-icon">' + getIcon(icon) + '</div><div><span class="course-detail-badge">' + (isFeatured ? 'DIPLOMA PROGRAM' : 'SKILL COURSE') + '</span><h1>' + d.title + '</h1>' + (d.short_description ? '<p class="course-detail-subtitle">' + d.short_description + '</p>' : '') + (d.duration ? '<p class="course-detail-meta"><strong>Duration:</strong> ' + d.duration + '</p>' : '') + (d.eligibility ? '<p class="course-detail-meta"><strong>Eligibility:</strong> ' + d.eligibility + '</p>' : '') + '</div></div><div class="course-detail-body"><div class="course-detail-main"><section class="detail-section"><h2>About This Course</h2><p>' + (d.description || 'Comprehensive training program.') + '</p></section>' + (d.who_should_choose ? '<section class="detail-section"><h2>Who Should Choose This Course</h2><p>' + d.who_should_choose + '</p></section>' : '') + (d.what_you_learn ? '<section class="detail-section"><h2>What You Will Learn</h2><p>' + d.what_you_learn + '</p></section>' : '') + (d.skills_covered ? '<section class="detail-section"><h2>Skills / Topics Covered</h2><p>' + d.skills_covered + '</p></section>' : '') + (d.benefits ? '<section class="detail-section"><h2>Course Benefits</h2><p>' + d.benefits + '</p></section>' : '') + '</div><div class="course-detail-sidebar"><div class="card card-shadow"><h3>Ready to Get Started?</h3><div class="detail-benefits"><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Certificate after completion</span></div><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><span>Personal attention &amp; practical training</span></div><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Unlimited free practice hours</span></div></div><div class="detail-ctas"><a href="demo.html?course=' + encodeURIComponent(d.title) + '" class="btn btn-primary btn-block">Book a Free Demo Class</a><a href="https://wa.me/917041976140?text=Hello%20VS%20Computer%20Education%2C%20I%20would%20like%20to%20enquire%20about%20' + encodeURIComponent(d.title) + '" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">Contact for Fees</a><a href="tel:+917041976140" class="btn btn-outline btn-block">Call Now</a></div></div></div></div>';
  } catch(e) {
    console.error(e);
    c.innerHTML = '<div class="error-state"><h3>Unable to load course</h3><p><a href="courses.html">Browse all courses</a></p></div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('featuredCoursesGrid') || document.getElementById('skillCoursesGrid')) {
    loadCourses();
  }
  if (document.getElementById('courseDetail')) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (slug) loadCourseDetail('courseDetail', slug);
    else document.getElementById('courseDetail').innerHTML = '<div class="error-state"><h3>No course selected</h3><p><a href="courses.html">Browse all courses</a></p></div>';
  }
});
