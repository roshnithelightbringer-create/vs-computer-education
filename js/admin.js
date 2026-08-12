const API_BASE = '/api';
const TOKEN_KEY = 'vsce_admin_token';
const USER_KEY = 'vsce_admin_user';
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function getUser() { const d = localStorage.getItem(USER_KEY); return d ? JSON.parse(d) : null; }
function setAuth(t, u) { localStorage.setItem(TOKEN_KEY, t); localStorage.setItem(USER_KEY, JSON.stringify(u)); }
function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
function isAuthenticated() { return !!getToken(); }
async function adminFetch(endpoint, opts = {}) {
  const token = getToken();
  if (!token) { window.location.href = 'login.html'; return; }
  const config = { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token, ...opts.headers }, ...opts };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const r = await fetch(API_BASE + endpoint, config);
  if (r.status === 401) { clearAuth(); window.location.href = 'login.html'; return; }
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}
const loginForm = document.getElementById('loginForm');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value.trim();
    const p = document.getElementById('password').value;
    const err = document.getElementById('loginError');
    const btn = loginForm.querySelector('button[type="submit"]');
    err.classList.remove('show'); err.textContent = '';
    if (!u || !p) { err.textContent = 'Enter username and password'; err.classList.add('show'); return; }
    btn.disabled = true; btn.textContent = 'Signing in...';
    try {
      const r = await fetch(API_BASE + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || 'Invalid credentials');
      setAuth(d.token, d.user); window.location.href = 'dashboard.html';
    } catch(e) { err.textContent = e.message; err.classList.add('show'); btn.disabled = false; btn.textContent = 'Sign In'; }
  });
}
function checkAuth() { if (!isAuthenticated()) { window.location.href = 'login.html'; return false; } return true; }
function logout() { clearAuth(); window.location.href = 'login.html'; }
function loadSidebar() {
  const u = getUser();
  if (!u) return;
  const a = document.getElementById('adminAvatar'), n = document.getElementById('adminName'), r = document.getElementById('adminRole');
  if (a) a.textContent = u.name.charAt(0).toUpperCase();
  if (n) n.textContent = u.name;
  if (r) r.textContent = u.role === 'admin' ? 'Administrator' : 'Staff';
}
async function loadDashboard() {
  if (!checkAuth()) return;
  loadSidebar();
  try {
    const d = await adminFetch('/dashboard/overview');
    document.getElementById('statEnquiries').textContent = d.enquiries || 0;
    document.getElementById('statNewEnquiries').textContent = d.new_enquiries || 0;
    document.getElementById('statDemos').textContent = d.demos || 0;
    document.getElementById('statNewDemos').textContent = d.new_demos || 0;
    document.getElementById('statCourses').textContent = d.courses || 0;
    document.getElementById('statJoined').textContent = d.joined || 0;
    const et = document.getElementById('recentEnquiries');
    if (et && d.recentEnquiries) et.innerHTML = d.recentEnquiries.map(e => '<tr><td>' + e.name + '</td><td>' + e.phone + '</td><td>' + (e.course||'-') + '</td><td><span class=\"status-badge ' + e.status + '\">' + e.status + '</span></td><td>' + new Date(e.created_at).toLocaleDateString('en-IN') + '</td></tr>').join('') || '<tr><td colspan=\"5\" style=\"text-align:center;color:var(--color-text-muted);\">No enquiries yet</td></tr>';
    const dt = document.getElementById('recentDemos');
    if (dt && d.recentDemos) dt.innerHTML = d.recentDemos.map(dd => '<tr><td>' + dd.name + '</td><td>' + dd.phone + '</td><td>' + (dd.course||'-') + '</td><td>' + (dd.preferred_date||'-') + '</td><td><span class=\"status-badge ' + dd.status + '\">' + dd.status + '</span></td></tr>').join('') || '<tr><td colspan=\"5\" style=\"text-align:center;color:var(--color-text-muted);\">No demos yet</td></tr>';
  } catch(e) { console.error(e); }
}
async function loadEnquiries() {
  if (!checkAuth()) return;
  loadSidebar();
  const sf = document.getElementById('enqStatusFilter')?.value || '';
  const sq = document.getElementById('enqSearch')?.value || '';
  try {
    let url = '/enquiries'; const p = [];
    if (sf) p.push('status=' + sf);
    if (sq) p.push('search=' + encodeURIComponent(sq));
    if (p.length) url += '?' + p.join('&');
    const d = await adminFetch(url);
    const t = document.getElementById('enquiriesTable');
    if (!t) return;
    if (!d.enquiries || !d.enquiries.length) { t.innerHTML = '<tr><td colspan=\"7\" style=\"text-align:center;padding:var(--space-2xl);color:var(--color-text-muted);\">No enquiries found</td></tr>'; return; }
    t.innerHTML = d.enquiries.map(e => '<tr><td>' + e.name + '</td><td>' + e.phone + '</td><td>' + (e.course||'-') + '</td><td>' + (e.enquiry_type||'general') + '</td><td><select class=\"status-select\" onchange=\"updateEnquiryStatus(' + e.id + ', this.value)\"><option value=\"new\"' + (e.status==='new'?' selected':'') + '>New</option><option value=\"contacted\"' + (e.status==='contacted'?' selected':'') + '>Contacted</option><option value=\"follow-up\"' + (e.status==='follow-up'?' selected':'') + '>Follow-up</option><option value=\"joined\"' + (e.status==='joined'?' selected':'') + '>Joined</option><option value=\"closed\"' + (e.status==='closed'?' selected':'') + '>Closed</option></select></td><td>' + new Date(e.created_at).toLocaleDateString('en-IN', {day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) + '</td><td><div class=\"admin-actions\"><button class=\"action-btn\" onclick=\"window.open('https://wa.me/' + e.phone.replace(/[^0-9]/g,'') + '?text=' + encodeURIComponent('Hello ' + e.name + ', this is VS Computer Education.') + '','_blank')\" title=\"WhatsApp\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\"/></svg></button><a href=\"tel:' + e.phone + '\" class=\"action-btn\" title=\"Call\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/></svg></a></div></td></tr>').join('');
  } catch(e) { console.error(e); }
}
async function updateEnquiryStatus(id, status) {
  try { await adminFetch('/enquiries/' + id + '/status', { method: 'PUT', body: { status } }); } catch(e) { console.error(e); }
}
async function loadDemos() {
  if (!checkAuth()) return;
  loadSidebar();
  try {
    const d = await adminFetch('/demo');
    const t = document.getElementById('demosTable');
    if (!t) return;
    if (!d.bookings || !d.bookings.length) { t.innerHTML = '<tr><td colspan=\"7\" style=\"text-align:center;padding:var(--space-2xl);color:var(--color-text-muted);\">No demo bookings yet</td></tr>'; return; }
    t.innerHTML = d.bookings.map(dd => '<tr><td>' + dd.name + '</td><td>' + dd.phone + '</td><td>' + (dd.course||'-') + '</td><td>' + (dd.preferred_date||'-') + '</td><td>' + (dd.preferred_time||'-') + '</td><td><select class=\"status-select\" onchange=\"updateDemoStatus(' + dd.id + ', this.value)\"><option value=\"new\"' + (dd.status==='new'?' selected':'') + '>New</option><option value=\"contacted\"' + (dd.status==='contacted'?' selected':'') + '>Contacted</option><option value=\"completed\"' + (dd.status==='completed'?' selected':'') + '>Completed</option><option value=\"cancelled\"' + (dd.status==='cancelled'?' selected':'') + '>Cancelled</option></select></td><td><div class=\"admin-actions\"><button class=\"action-btn\" onclick=\"window.open('https://wa.me/' + dd.phone.replace(/[^0-9]/g,'') + '?text=Hello%20' + encodeURIComponent(dd.name) + '%2C%20this%20is%20VS%20Computer%20Education.','_blank')\" title=\"WhatsApp\"><svg viewBox=\"0 0 24 24\" fill=\"currentColor\" width=\"16\" height=\"16\"><path d=\"M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z\"/></svg></button><a href=\"tel:' + dd.phone + '\" class=\"action-btn\" title=\"Call\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z\"/></svg></a></div></td></tr>').join('');
  } catch(e) { console.error(e); }
}
async function updateDemoStatus(id, status) {
  try { await adminFetch('/demo/' + id + '/status', { method: 'PUT', body: { status } }); } catch(e) { console.error(e); }
}
async function loadAdminCourses() {
  if (!checkAuth()) return;
  loadSidebar();
  try {
    const d = await adminFetch('/courses/admin/all');
    const t = document.getElementById('adminCoursesTable');
    if (!t) return;
    if (!d.courses || !d.courses.length) { t.innerHTML = '<tr><td colspan=\"6\" style=\"text-align:center;padding:var(--space-2xl);color:var(--color-text-muted);\">No courses</td></tr>'; return; }
    t.innerHTML = d.courses.map(c => '<tr><td>' + c.title + '</td><td>' + (c.category||'-') + '</td><td>' + (c.duration||'-') + '</td><td>' + (c.eligibility||'-') + '</td><td><span class=\"status-badge ' + (c.active?'joined':'cancelled') + '\">' + (c.active?'Active':'Inactive') + '</span></td><td><div class=\"admin-actions\"><button class=\"action-btn\" onclick=\"editCourse(' + c.id + ')\" title=\"Edit\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><path d=\"M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"/><path d=\"M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z\"/></svg></button><button class=\"action-btn danger\" onclick=\"deleteCourse(' + c.id + ')\" title=\"Delete\"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" width=\"16\" height=\"16\"><polyline points=\"3 6 5 6 21 6\"/><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"/></svg></button></div></td></tr>').join('');
  } catch(e) { console.error(e); }
}
let editingCourseId = null;
function showAddCourseForm() { editingCourseId = null; document.getElementById('courseFormTitle').textContent = 'Add New Course'; document.getElementById('courseForm').reset(); document.getElementById('courseModal').style.display = 'flex'; }
function closeCourseModal() { document.getElementById('courseModal').style.display = 'none'; }
async function editCourse(id) {
  editingCourseId = id;
  document.getElementById('courseFormTitle').textContent = 'Edit Course';
  try {
    const d = (await adminFetch('/courses/admin/all')).courses.find(c => c.id === id);
    if (!d) return;
    document.getElementById('cfTitle').value = d.title||'';
    document.getElementById('cfCategory').value = d.category||'';
    document.getElementById('cfShortDesc').value = d.short_description||'';
    document.getElementById('cfDescription').value = d.description||'';
    document.getElementById('cfSyllabus').value = d.syllabus||'';
    document.getElementById('cfDuration').value = d.duration||'';
    document.getElementById('cfEligibility').value = d.eligibility||'';
    document.getElementById('cfActive').checked = d.active === 1;
    document.getElementById('courseModal').style.display = 'flex';
  } catch(e) { console.error(e); }
}
const courseForm = document.getElementById('courseForm');
if (courseForm) {
  courseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = { title: document.getElementById('cfTitle').value.trim(), category: document.getElementById('cfCategory').value.trim(), short_description: document.getElementById('cfShortDesc').value.trim(), description: document.getElementById('cfDescription').value.trim(), syllabus: document.getElementById('cfSyllabus').value.trim(), duration: document.getElementById('cfDuration').value.trim(), eligibility: document.getElementById('cfEligibility').value.trim(), active: document.getElementById('cfActive').checked ? 1 : 0 };
    const btn = courseForm.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = 'Saving...';
    try {
      if (editingCourseId) { await adminFetch('/courses/' + editingCourseId, { method: 'PUT', body: data }); }
      else { await adminFetch('/courses', { method: 'POST', body: data }); }
      closeCourseModal(); loadAdminCourses();
    } catch(e) { alert('Failed: ' + e.message); }
    finally { btn.disabled = false; btn.textContent = editingCourseId ? 'Update Course' : 'Add Course'; }
  });
}
async function deleteCourse(id) {
  if (!confirm('Delete this course? This cannot be undone.')) return;
  try { await adminFetch('/courses/' + id, { method: 'DELETE' }); loadAdminCourses(); }
  catch(e) { alert('Failed: ' + e.message); }
}
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('statEnquiries')) loadDashboard();
  if (document.getElementById('enquiriesTable')) { loadEnquiries(); const sf = document.getElementById('enqStatusFilter'); const si = document.getElementById('enqSearch'); if (sf) sf.addEventListener('change', loadEnquiries); if (si) { let t; si.addEventListener('input', () => { clearTimeout(t); t = setTimeout(loadEnquiries, 300); }); } }
  if (document.getElementById('demosTable')) loadDemos();
  if (document.getElementById('adminCoursesTable')) loadAdminCourses();
});