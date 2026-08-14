// VS Computer Education - Courses JS

const DIPLOMA_SLUGS = ['dca', 'adca', 'adct', 'pgdca'];

const ICONS = {
  'dca':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M6 6h2l2 3-2 3H6l-2-3z"/></svg>',
  'adca':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>',
  'adct':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/><path d="M8 3a4 4 0 0 0-4 4"/><path d="M16 3a4 4 0 0 1 4 4"/></svg>',
  'pgdca':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/><circle cx="12" cy="8" r="2"/></svg>',
  'computer-fundamentals':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  'microsoft-office':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
  'ccc':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  'tally-prime':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>',
  'graphic-design':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="13.5" cy="6.5" r="0.5" fill="currentColor"/><circle cx="17.5" cy="10.5" r="0.5" fill="currentColor"/><circle cx="8.5" cy="7.5" r="0.5" fill="currentColor"/><circle cx="6.5" cy="12.5" r="0.5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.93 0 1.5-.67 1.5-1.5 0-.39-.15-.74-.39-1.01-.23-.26-.38-.61-.38-1 0-.83.67-1.5 1.5-1.5H16c3.31 0 6-2.69 6-6 0-5.5-4.5-10-10-10z"/></svg>',
  'mobile-repairing':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>',
  'hardware-networking':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><line x1="9" y1="1" x2="9" y2="4"/><line x1="15" y1="1" x2="15" y2="4"/></svg>',
  'photo-video-editing':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
  'textile-designing':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 20h16"/><path d="M6 16l2-8 2 4 2-6 2 8 2-4 2 6"/></svg>',
  'embroidery-designing':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 4 5 4 9c0 4 8 13 8 13s8-9 8-13c0-4-4-7-8-7z"/><circle cx="12" cy="9" r="2"/></svg>',
  'personality-development':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  'mehandi-course':'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2C8 2 4 5 4 9c0 4 8 13 8 13s8-9 8-13c0-4-4-7-8-7z"/></svg>'
};

const DFLT_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>';

function getIcon(slug) {
  return ICONS[slug] || DFLT_ICON;
}

function diplomaCardHTML(c) {
  const slug = c.slug || '';
  const skills = c.skills_list ? c.skills_list.split('|') : [];
  const maxSkills = 8;
  const displaySkills = skills.slice(0, maxSkills);
  const hasMore = skills.length > maxSkills;
  
  let skillsHTML = displaySkills.map(s => '<li>' + s.trim() + '</li>').join('');
  if (hasMore) {
    skillsHTML += '<li style="color:var(--color-primary);font-weight:600;">+' + (skills.length - maxSkills) + ' more topics...</li>';
  }
  
  return '<div class="diploma-card fade-in"><div class="diploma-card-header"><div class="diploma-icon">' + getIcon(slug) + '</div><div class="diploma-title-group"><h3>' + (c.title || '') + '</h3><div class="full-name">' + (c.short_description || '') + '</div><span class="duration-badge">' + (c.duration || '') + '</span></div></div><div class="skills-heading">Applications & Skills You\'ll Learn</div><ul class="skills-list">' + skillsHTML + '</ul><div class="diploma-card-actions"><a href="course.html?slug=' + slug + '" class="btn btn-primary">View Full Details</a><a href="demo.html?course=' + encodeURIComponent(c.title || '') + '" class="btn btn-outline">Book Demo</a></div></div>';
}

function skillCardHTML(c) {
  const slug = c.slug || '';
  return '<a href="course.html?slug=' + slug + '" class="skill-item fade-in"><div class="skill-item-icon">' + getIcon(slug) + '</div><h4>' + (c.title || '') + '</h4>' + (c.duration ? '<div class="skill-dur">' + c.duration + '</div>' : '') + '</a>';
}

async function loadCourses() {
  const diplomaGrid = document.getElementById('diplomaGrid');
  const skillGrid = document.getElementById('skillGrid');
  if (!diplomaGrid && !skillGrid) return;
  
  // If content already exists (static HTML), don't overwrite
  if (diplomaGrid && diplomaGrid.children.length > 1) {
    console.log('Courses already loaded, skipping API fetch');
    return;
  }
  if (skillGrid && skillGrid.children.length > 1) {
    console.log('Skill courses already loaded, skipping API fetch');
    return;
  }
  
  try {
    const resp = await apiFetch('/courses');
    const all = resp.courses || [];
    
    const diplomas = all.filter(c => DIPLOMA_SLUGS.includes(c.slug));
    const skills = all.filter(c => !DIPLOMA_SLUGS.includes(c.slug));
    
    if (diplomaGrid) {
      if (diplomas.length) {
        diplomaGrid.innerHTML = diplomas.map(diplomaCardHTML).join('');
      } else {
        diplomaGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-secondary)"><p>Diploma courses loading...</p></div>';
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
    if (diplomaGrid) diplomaGrid.innerHTML = '<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--color-text-secondary)"><p>Unable to load courses. Please try again.</p></div>';
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
    
    const isDiploma = DIPLOMA_SLUGS.includes(slug);
    const skills = d.skills_list ? d.skills_list.split('|') : [];
    
    let skillsHTML = skills.map(s => '<li>' + s.trim() + '</li>').join('');
    
    c.innerHTML = '<div class="course-detail-header"><div class="course-detail-icon">' + getIcon(slug) + '</div><div><span class="course-detail-badge">' + (isDiploma ? 'DIPLOMA PROGRAM' : 'SKILL COURSE') + '</span><h1>' + d.title + '</h1>' + (d.short_description ? '<p class="course-detail-subtitle">' + d.short_description + '</p>' : '') + (d.duration ? '<p class="course-detail-meta"><strong>Duration:</strong> ' + d.duration + '</p>' : '') + (d.eligibility ? '<p class="course-detail-meta"><strong>Eligibility:</strong> ' + d.eligibility + '</p>' : '') + '</div></div><div class="course-detail-body"><div class="course-detail-main"><section class="detail-section"><h2>About This Course</h2><p>' + (d.description || 'Comprehensive training program.') + '</p></section>' + (d.who_should_choose ? '<section class="detail-section"><h2>Who Should Choose This Course</h2><p>' + d.who_should_choose + '</p></section>' : '') + (skills.length ? '<section class="detail-section"><h2>Applications & Skills You\'ll Learn</h2><ul class="detail-skills-list">' + skillsHTML + '</ul></section>' : '') + (d.what_you_learn ? '<section class="detail-section"><h2>What You Will Learn</h2><p>' + d.what_you_learn + '</p></section>' : '') + (d.benefits ? '<section class="detail-section"><h2>Course Benefits</h2><p>' + d.benefits + '</p></section>' : '') + '</div><div class="course-detail-sidebar"><div class="card card-shadow"><h3>Ready to Get Started?</h3><div class="detail-benefits"><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg><span>Certificate after completion</span></div><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg><span>Personal attention &amp; practical training</span></div><div class="detail-benefit"><svg viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><span>Unlimited free practice hours</span></div></div><div class="detail-ctas"><a href="demo.html?course=' + encodeURIComponent(d.title) + '" class="btn btn-primary btn-block">Book a Free Demo Class</a><a href="https://wa.me/917041976140?text=Hello%20VS%20Computer%20Education%2C%20I%20would%20like%20to%20enquire%20about%20' + encodeURIComponent(d.title) + '" target="_blank" rel="noopener" class="btn btn-whatsapp btn-block">Contact for Fees</a><a href="tel:+917041976140" class="btn btn-outline btn-block">Call Now</a></div></div></div></div>';
  } catch(e) {
    console.error(e);
    c.innerHTML = '<div class="error-state"><h3>Unable to load course</h3><p><a href="courses.html">Browse all courses</a></p></div>';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('diplomaGrid') || document.getElementById('skillGrid')) {
    loadCourses();
  }
  if (document.getElementById('courseDetail')) {
    const slug = new URLSearchParams(window.location.search).get('slug');
    if (slug) loadCourseDetail('courseDetail', slug);
    else document.getElementById('courseDetail').innerHTML = '<div class="error-state"><h3>No course selected</h3><p><a href="courses.html">Browse all courses</a></p></div>';
  }
});
