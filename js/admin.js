// VS Computer Education - Admin JS
const API_BASE = '/api';
const TOKEN_KEY = 'vsce_admin_token';
const USER_KEY = 'vsce_admin_user';
function getToken() { return localStorage.getItem(TOKEN_KEY); }
function getUser() { const d = localStorage.getItem(USER_KEY); return d ? JSON.parse(d) : null; }
function setAuth(t, u) { localStorage.setItem(TOKEN_KEY, t); localStorage.setItem(USER_KEY, JSON.stringify(u)); }
function clearAuth() { localStorage.removeItem(TOKEN_KEY); localStorage.removeItem(USER_KEY); }
function isAuthenticated() { return !!getToken(); }

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      var u = document.getElementById('username').value.trim();
      var p = document.getElementById('password').value;
      var err = document.getElementById('loginError');
      var btn = loginForm.querySelector('button[type="submit"]');
      err.classList.remove('show');
      err.textContent = '';
      if (!u || !p) { err.textContent = 'Enter username and password'; err.classList.add('show'); return; }
      btn.disabled = true;
      btn.textContent = 'Signing in...';
      try {
        var response = await fetch(API_BASE + '/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p }) });
        var data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Invalid credentials');
        localStorage.setItem(TOKEN_KEY, data.token);
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
        window.location.href = 'dashboard.html';
      } catch(e) {
        err.textContent = e.message || 'Invalid credentials';
        err.classList.add('show');
        btn.disabled = false;
        btn.textContent = 'Login';
      }
    });
  }
  if (document.getElementById('statEnquiries')) loadDashboard();
  if (document.getElementById('enquiriesTable')) {
    loadEnquiries();
    var sf = document.getElementById('enqStatusFilter');
    var si = document.getElementById('enqSearch');
    if (sf) sf.addEventListener('change', loadEnquiries);
    if (si) { var t; si.addEventListener('input', function() { clearTimeout(t); t = setTimeout(loadEnquiries, 300); }); }
  }
  if (document.getElementById('demosTable')) loadDemos();
  if (document.getElementById('adminCoursesTable')) loadAdminCourses();
  if (document.getElementById('studentsTable')) loadStudents();
  if (document.getElementById('paymentsTable')) loadPayments();
});

async function adminFetch(endpoint, opts) {
  opts = opts || {};
  const token = getToken();
  if (!token) { window.location.href = 'login.html'; return null; }
  const config = { headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token }, ...opts };
  if (config.body && typeof config.body === 'object') config.body = JSON.stringify(config.body);
  const r = await fetch(API_BASE + endpoint, config);
  if (r.status === 401) { clearAuth(); window.location.href = 'login.html'; return null; }
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || 'Request failed');
  return d;
}

function checkAuth() { if (!isAuthenticated()) { window.location.href = 'login.html'; return false; } return true; }
function logout() { clearAuth(); window.location.href = 'login.html'; }

async function loadDashboard() {
  if (!checkAuth()) return;
  try {
    var d = await adminFetch('/dashboard/overview');
    if (document.getElementById('statEnquiries')) document.getElementById('statEnquiries').textContent = d.enquiries || 0;
    if (document.getElementById('statNewEnquiries')) document.getElementById('statNewEnquiries').textContent = d.new_enquiries || 0;
    if (document.getElementById('statDemos')) document.getElementById('statDemos').textContent = d.demos || 0;
    if (document.getElementById('statNewDemos')) document.getElementById('statNewDemos').textContent = d.new_demos || 0;
    if (document.getElementById('statCourses')) document.getElementById('statCourses').textContent = d.courses || 0;
    if (document.getElementById('statJoined')) document.getElementById('statJoined').textContent = d.joined || 0;
    // Also load students and payments count
    var students = await adminFetch('/students');
    if (document.getElementById('statStudents')) document.getElementById('statStudents').textContent = students.students ? students.students.length : 0;
    var payments = await adminFetch('/students/payments');
    if (document.getElementById('statPayments')) document.getElementById('statPayments').textContent = payments.payments ? payments.payments.length : 0;
  } catch(e) { console.error(e); }
}

async function loadEnquiries() {
  if (!checkAuth()) return;
  var sf = document.getElementById('enqStatusFilter')?.value || '';
  var sq = document.getElementById('enqSearch')?.value || '';
  try {
    var url = '/enquiries'; var p = [];
    if (sf) p.push('status=' + sf);
    if (sq) p.push('search=' + encodeURIComponent(sq));
    if (p.length) url += '?' + p.join('&');
    var d = await adminFetch(url);
    var t = document.getElementById('enquiriesTable');
    if (!t) return;
    if (!d.enquiries || !d.enquiries.length) { t.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#999">No enquiries found</td></tr>'; return; }
    t.innerHTML = d.enquiries.map(function(e) { return '<tr><td>' + e.name + '</td><td>' + e.phone + '</td><td>' + (e.course||'-') + '</td><td>' + (e.enquiry_type||'general') + '</td><td><select onchange="updateEnquiryStatus(' + e.id + ',this.value)"><option value="new"' + (e.status==='new'?' selected':'') + '>New</option><option value="contacted"' + (e.status==='contacted'?' selected':'') + '>Contacted</option><option value="follow-up"' + (e.status==='follow-up'?' selected':'') + '>Follow-up</option><option value="joined"' + (e.status==='joined'?' selected':'') + '>Joined</option><option value="closed"' + (e.status==='closed'?' selected':'') + '>Closed</option></select></td><td>' + new Date(e.created_at).toLocaleDateString('en-IN') + '</td><td><a href="tel:' + e.phone + '">Call</a> <a href="https://wa.me/' + e.phone.replace(/[^0-9]/g,'') + '?text=Hello%20' + encodeURIComponent(e.name) + '%2C%20this%20is%20VS%20Computer%20Education." target="_blank">WhatsApp</a></td></tr>'; }).join('');
  } catch(e) { console.error(e); }
}

async function updateEnquiryStatus(id, status) { try { await adminFetch('/enquiries/' + id + '/status', { method: 'PUT', body: { status: status } }); } catch(e) { console.error(e); } }

async function loadDemos() {
  if (!checkAuth()) return;
  try {
    var d = await adminFetch('/demo');
    var t = document.getElementById('demosTable');
    if (!t) return;
    if (!d.bookings || !d.bookings.length) { t.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#999">No demo bookings yet</td></tr>'; return; }
    t.innerHTML = d.bookings.map(function(dd) { return '<tr><td>' + dd.name + '</td><td>' + dd.phone + '</td><td>' + (dd.course||'-') + '</td><td>' + (dd.preferred_date||'-') + '</td><td>' + (dd.preferred_time||'-') + '</td><td><select onchange="updateDemoStatus(' + dd.id + ',this.value)"><option value="new"' + (dd.status==='new'?' selected':'') + '>New</option><option value="contacted"' + (dd.status==='contacted'?' selected':'') + '>Contacted</option><option value="completed"' + (dd.status==='completed'?' selected':'') + '>Completed</option><option value="cancelled"' + (dd.status==='cancelled'?' selected':'') + '>Cancelled</option></select></td><td><a href="tel:' + dd.phone + '">Call</a></td></tr>'; }).join('');
  } catch(e) { console.error(e); }
}

async function updateDemoStatus(id, status) { try { await adminFetch('/demo/' + id + '/status', { method: 'PUT', body: { status: status } }); } catch(e) { console.error(e); } }

async function loadAdminCourses() {
  if (!checkAuth()) return;
  try {
    var d = await adminFetch('/courses/admin/all');
    var t = document.getElementById('adminCoursesTable');
    if (!t) return;
    if (!d.courses || !d.courses.length) { t.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#999">No courses</td></tr>'; return; }
    t.innerHTML = d.courses.map(function(c) { return '<tr><td>' + c.title + '</td><td>' + (c.category||'-') + '</td><td>' + (c.duration||'-') + '</td><td>' + (c.eligibility||'-') + '</td><td>' + (c.active?'Active':'Inactive') + '</td><td><button onclick="editCourse(' + c.id + ')">Edit</button> <button onclick="deleteCourse(' + c.id + ')">Delete</button></td></tr>'; }).join('');
  } catch(e) { console.error(e); }
}

// Load students
async function loadStudents() {
  if (!checkAuth()) return;
  try {
    var d = await adminFetch('/students');
    var t = document.getElementById('studentsTable');
    if (!t) return;
    if (!d.students || !d.students.length) { t.innerHTML = '<tr><td colspan="6" style="text-align:center;padding:40px;color:#999">No students registered yet</td></tr>'; return; }
    t.innerHTML = d.students.map(function(s) {
      var phone = s.phone.replace(/[^0-9]/g,'');
      return '<tr><td>' + s.name + '</td><td>' + s.phone + '</td><td>' + (s.course||'-') + '</td><td><select onchange="updateStudentStatus(' + s.id + ',this.value)"><option value="new"' + (s.status==='new'?' selected':'') + '>New</option><option value="contacted"' + (s.status==='contacted'?' selected':'') + '>Contacted</option><option value="joined"' + (s.status==='joined'?' selected':'') + '>Joined</option><option value="inactive"' + (s.status==='inactive'?' selected':'') + '>Inactive</option></select></td><td>' + new Date(s.created_at).toLocaleDateString('en-IN') + '</td><td><a href="tel:' + s.phone + '">Call</a> <a href="https://wa.me/' + phone + '?text=Hello%20' + encodeURIComponent(s.name) + '%2C%20this%20is%20VS%20Computer%20Education." target="_blank">WhatsApp</a></td></tr>';
    }).join('');
  } catch(e) { console.error(e); }
}

async function updateStudentStatus(id, status) { try { await adminFetch('/students/' + id + '/status', { method: 'PUT', body: { status: status } }); } catch(e) { console.error(e); } }

// Load payments
async function loadPayments() {
  if (!checkAuth()) return;
  try {
    var d = await adminFetch('/students/payments');
    var t = document.getElementById('paymentsTable');
    if (!t) return;
    if (!d.payments || !d.payments.length) { t.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:40px;color:#999">No payments submitted yet</td></tr>'; return; }
    t.innerHTML = d.payments.map(function(p) {
      var phone = p.phone.replace(/[^0-9]/g,'');
      return '<tr><td>' + p.name + '</td><td>' + p.phone + '</td><td>' + (p.course||'-') + '</td><td>' + p.amount + '</td><td>' + (p.payment_date||'-') + '</td><td><select onchange="updatePaymentStatus(' + p.id + ',this.value)"><option value="pending"' + (p.status==='pending'?' selected':'') + '>Pending</option><option value="confirmed"' + (p.status==='confirmed'?' selected':'') + '>Confirmed</option></select></td><td><a href="tel:' + p.phone + '">Call</a> <a href="https://wa.me/' + phone + '?text=Hello%20' + encodeURIComponent(p.name) + '%2C%20your%20payment%20of%20' + encodeURIComponent(p.amount) + '%20has%20been%20received.%20Thank%20you!" target="_blank">WhatsApp</a></td></tr>';
    }).join('');
  } catch(e) { console.error(e); }
}

async function updatePaymentStatus(id, status) { try { await adminFetch('/students/payments/' + id + '/status', { method: 'PUT', body: { status: status } }); } catch(e) { console.error(e); } }

var editingCourseId = null;
function showAddCourseForm() { editingCourseId = null; document.getElementById('courseFormTitle').textContent = 'Add New Course'; document.getElementById('courseForm').reset(); document.getElementById('courseModal').style.display = 'flex'; }
function closeCourseModal() { document.getElementById('courseModal').style.display = 'none'; }

async function editCourse(id) {
  editingCourseId = id;
  document.getElementById('courseFormTitle').textContent = 'Edit Course';
  try {
    var d = (await adminFetch('/courses/admin/all')).courses.find(function(c) { return c.id === id; });
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

var courseForm = document.getElementById('courseForm');
if (courseForm) {
  courseForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var data = { title: document.getElementById('cfTitle').value.trim(), category: document.getElementById('cfCategory').value.trim(), short_description: document.getElementById('cfShortDesc').value.trim(), description: document.getElementById('cfDescription').value.trim(), syllabus: document.getElementById('cfSyllabus').value.trim(), duration: document.getElementById('cfDuration').value.trim(), eligibility: document.getElementById('cfEligibility').value.trim(), active: document.getElementById('cfActive').checked ? 1 : 0 };
    var btn = courseForm.querySelector('button[type="submit"]');
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
