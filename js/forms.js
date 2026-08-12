async function handleDemoForm(fid) {
  const f = document.getElementById(fid);
  if (!f) return;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = f.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    const name = f.querySelector('#demoName')?.value.trim();
    const phone = f.querySelector('#demoPhone')?.value.trim();
    const course = f.querySelector('#demoCourse')?.value;
    const date = f.querySelector('#demoDate')?.value;
    const time = f.querySelector('#demoTime')?.value;
    const msg = f.querySelector('#demoMessage')?.value.trim();
    let valid = true;
    const errs = {};
    if (!name || name.length < 2) { errs.name = 'Enter your name'; valid = false; }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''))) { errs.phone = 'Valid 10-digit phone required'; valid = false; }
    if (!course) { errs.course = 'Select a course'; valid = false; }
    if (!date) { errs.date = 'Select a date'; valid = false; }
    if (!time) { errs.time = 'Select a time'; valid = false; }
    Object.keys(errs).forEach(k => {
      const inp = f.querySelector('#demo' + k.charAt(0).toUpperCase() + k.slice(1));
      const err = f.querySelector('#demo' + k.charAt(0).toUpperCase() + k.slice(1) + 'Error');
      if (inp) inp.classList.toggle('error', !!errs[k]);
      if (err) err.textContent = errs[k] || '';
    });
    if (!valid) return;
    btn.disabled = true; btn.innerHTML = '<span class=\"loading-spinner\" style=\"width:18px;height:18px;border-width:2px;margin:0;\"></span> Submitting...';
    try {
      await apiFetch('/demo', { method: 'POST', body: { name, phone, course, preferred_date: date, preferred_time: time, message: msg } });
      openWhatsApp('917041976140', 'Hello VS Computer Education, I would like to book a free demo for ' + course + '. My name is ' + name + ' and my phone number is ' + phone + '. Preferred date: ' + date + ', Time: ' + time + (msg ? '. Message: ' + msg : ''));
      f.innerHTML = '<div class=\"form-success\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg><h3>Demo Request Submitted!</h3><p>Thank you, ' + name + '! WhatsApp has been opened with your details.</p><a href=\"index.html\" class=\"btn btn-primary\" style=\"margin-top:var(--space-lg);\">Back to Home</a></div>';
    } catch(e) { console.error(e); btn.disabled = false; btn.innerHTML = orig; alert('Something went wrong. Please try again.'); }
  });
}
async function handleEnquiryForm(fid) {
  const f = document.getElementById(fid);
  if (!f) return;
  f.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = f.querySelector('button[type="submit"]');
    const orig = btn.innerHTML;
    const name = f.querySelector('#enqName')?.value.trim();
    const phone = f.querySelector('#enqPhone')?.value.trim();
    const course = f.querySelector('#enqCourse')?.value;
    const msg = f.querySelector('#enqMessage')?.value.trim();
    let valid = true;
    const errs = {};
    if (!name || name.length < 2) { errs.name = 'Enter your name'; valid = false; }
    if (!phone || !/^[6-9]\d{9}$/.test(phone.replace(/\s+/g, ''))) { errs.phone = 'Valid phone required'; valid = false; }
    Object.keys(errs).forEach(k => {
      const inp = f.querySelector('#enq' + k.charAt(0).toUpperCase() + k.slice(1));
      const err = f.querySelector('#enq' + k.charAt(0).toUpperCase() + k.slice(1) + 'Error');
      if (inp) inp.classList.toggle('error', !!errs[k]);
      if (err) err.textContent = errs[k] || '';
    });
    if (!valid) return;
    btn.disabled = true; btn.innerHTML = '<span class=\"loading-spinner\" style=\"width:18px;height:18px;border-width:2px;margin:0;\"></span> Sending...';
    try {
      await apiFetch('/enquiries', { method: 'POST', body: { name, phone, course, message: msg, enquiry_type: 'general' } });
      openWhatsApp('917041976140', 'Hello VS Computer Education, I would like to enquire about ' + (course||'your courses') + '. My name is ' + name + ' and my phone number is ' + phone + (msg ? '. Message: ' + msg : ''));
      f.innerHTML = '<div class=\"form-success\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\"><path d=\"M22 11.08V12a10 10 0 1 1-5.93-9.14\"/><polyline points=\"22 4 12 14.01 9 11.01\"/></svg><h3>Enquiry Sent!</h3><p>Thank you, ' + name + '! WhatsApp has been opened with your details.</p><a href=\"index.html\" class=\"btn btn-primary\" style=\"margin-top:var(--space-lg);\">Back to Home</a></div>';
    } catch(e) { console.error(e); btn.disabled = false; btn.innerHTML = orig; alert('Something went wrong.'); }
  });
}
async function loadCourseOptions(sid) {
  const s = document.getElementById(sid);
  if (!s) return;
  try {
    const d = (await apiFetch('/courses')).courses||[];
    s.innerHTML = '<option value="">Select a course</option>';
    d.forEach(c => { const o = document.createElement('option'); o.value = c.title; o.textContent = c.title; s.appendChild(o); });
  } catch(e) { console.error(e); s.innerHTML = '<option value="">Unable to load courses</option>'; }
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('demoCourse')) loadCourseOptions('demoCourse');
  if (document.getElementById('enqCourse')) loadCourseOptions('enqCourse');
  if (document.getElementById('demoForm')) handleDemoForm('demoForm');
  if (document.getElementById('enquiryForm')) handleEnquiryForm('enquiryForm');
  const cp = new URLSearchParams(window.location.search).get('course');
  if (cp) {
    const sel = document.getElementById('demoCourse') || document.getElementById('enqCourse');
    if (sel) {
      const iv = setInterval(() => { for (let i = 0; i < sel.options.length; i++) { if (sel.options[i].value === cp) { sel.value = cp; clearInterval(iv); break; } } }, 100);
      setTimeout(() => clearInterval(iv), 10000);
    }
  }
});