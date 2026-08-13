// VS Computer Education - Student Gate
// Students must enter name + phone before browsing

(function() {
  const API_BASE = '/api';
  const GATE_KEY = 'vsce_student';

  // Check if already registered
  function getStudent() {
    const d = localStorage.getItem(GATE_KEY);
    return d ? JSON.parse(d) : null;
  }

  function setStudent(s) {
    localStorage.setItem(GATE_KEY, JSON.stringify(s));
  }

  // Build the gate modal
  function showGate() {
    const overlay = document.createElement('div');
    overlay.id = 'studentGate';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.7);z-index:9999;display:flex;align-items:center;justify-content:center;padding:20px;';
    
    overlay.innerHTML = `
      <div style="background:white;border-radius:16px;padding:40px;max-width:420px;width:100%;box-shadow:0 20px 60px rgba(0,0,0,0.3);">
        <div style="text-align:center;margin-bottom:24px;">
          <div style="width:64px;height:64px;background:#dbeafe;border-radius:50%;display:flex;align-items:center;justify-content:center;margin:0 auto 16px;">
            <svg viewBox="0 0 24 24" fill="none" stroke="#2563eb" stroke-width="2" width="32" height="32">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h2 style="font-size:22px;color:#1e293b;margin-bottom:8px;">Welcome to VS Computer Education</h2>
          <p style="color:#64748b;font-size:14px;line-height:1.5;">Please enter your details to continue. We'll save your info so we can follow up with you.</p>
        </div>
        <div id="gateError" style="background:#fee2e2;color:#dc2626;padding:10px 14px;border-radius:8px;font-size:13px;margin-bottom:16px;display:none;"></div>
        <form id="gateForm" style="display:flex;flex-direction:column;gap:16px;">
          <div>
            <label style="display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#1e293b;">Your Name *</label>
            <input type="text" id="gateName" placeholder="Enter your full name" required style="width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;transition:all 0.2s;" onfocus="this.style.borderColor='#2563eb'">
          </div>
          <div>
            <label style="display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#1e293b;">Phone Number *</label>
            <input type="tel" id="gatePhone" placeholder="10-digit mobile number" required style="width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;transition:all 0.2s;" onfocus="this.style.borderColor='#2563eb'">
          </div>
          <div>
            <label style="display:block;font-size:14px;font-weight:500;margin-bottom:6px;color:#1e293b;">Interested Course</label>
            <select id="gateCourse" style="width:100%;padding:12px 16px;border:2px solid #e2e8f0;border-radius:8px;font-size:14px;background:white;">
              <option value="">Select a course (optional)</option>
            </select>
          </div>
          <button type="submit" style="width:100%;padding:14px;background:#2563eb;color:white;border:none;border-radius:8px;font-size:15px;font-weight:600;cursor:pointer;transition:all 0.2s;margin-top:4px;" onmouseover="this.style.background='#1d4ed8'" onmouseout="this.style.background='#2563eb'">
            Continue to Website
          </button>
          <p style="text-align:center;font-size:12px;color:#94a3b8;">Your info stays private. We'll reach out to help you find the right course.</p>
        </form>
      </div>
    `;

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    // Load courses into dropdown
    fetch(API_BASE + '/courses').then(r => r.json()).then(d => {
      const sel = document.getElementById('gateCourse');
      if (d.courses) d.courses.forEach(c => {
        const opt = document.createElement('option');
        opt.value = c.title;
        opt.textContent = c.title;
        sel.appendChild(opt);
      });
    }).catch(() => {});

    // Handle form submit
    document.getElementById('gateForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('gateName').value.trim();
      const phone = document.getElementById('gatePhone').value.trim();
      const course = document.getElementById('gateCourse').value;
      const err = document.getElementById('gateError');

      err.style.display = 'none';

      if (!name || name.length < 2) {
        err.textContent = 'Please enter your full name';
        err.style.display = 'block';
        return;
      }

      const cleanPhone = phone.replace(/\s+/g, '');
      if (!/^[6-9]\d{9}$/.test(cleanPhone)) {
        err.textContent = 'Please enter a valid 10-digit Indian mobile number';
        err.style.display = 'block';
        return;
      }

      const btn = this.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Please wait...';

      try {
        const r = await fetch(API_BASE + '/students/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone: cleanPhone, course: course || null })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Something went wrong');

        setStudent(data.student);
        overlay.remove();
        document.body.style.overflow = '';
      } catch(e) {
        err.textContent = e.message;
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Continue to Website';
      }
    });
  }

  // On page load: show gate if not registered
  document.addEventListener('DOMContentLoaded', function() {
    const student = getStudent();
    if (!student) {
      showGate();
    }
  });
})();
