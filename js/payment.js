// VS Computer Education - Student Payment Page

(function() {
  const API_BASE = '/api';
  const GATE_KEY = 'vsce_student';

  function getStudent() {
    const d = localStorage.getItem(GATE_KEY);
    return d ? JSON.parse(d) : null;
  }

  document.addEventListener('DOMContentLoaded', function() {
    const student = getStudent();
    if (!student) {
      document.getElementById('paymentForm').innerHTML = '<p style="text-align:center;padding:40px;color:#64748b;">Please visit the website first to register before submitting a payment.</p>';
      return;
    }

    // Pre-fill name and phone
    document.getElementById('payName').value = student.name;
    document.getElementById('payPhone').value = student.phone;

    // Load courses
    fetch(API_BASE + '/courses').then(r => r.json()).then(d => {
      const sel = document.getElementById('payCourse');
      if (d.courses) {
        d.courses.forEach(c => {
          const opt = document.createElement('option');
          opt.value = c.title;
          opt.textContent = c.title;
          sel.appendChild(opt);
        });
        if (student.course) sel.value = student.course;
      }
    }).catch(() => {});

    // Handle form
    document.getElementById('paymentForm').addEventListener('submit', async function(e) {
      e.preventDefault();
      const name = document.getElementById('payName').value.trim();
      const phone = document.getElementById('payPhone').value.trim();
      const course = document.getElementById('payCourse').value;
      const amount = document.getElementById('payAmount').value.trim();
      const txn = document.getElementById('payTxn').value.trim();
      const err = document.getElementById('payError');
      const msg = document.getElementById('paySuccess');

      err.style.display = 'none';
      msg.style.display = 'none';

      if (!name || !phone || !amount || !txn) {
        err.textContent = 'Please fill all required fields';
        err.style.display = 'block';
        return;
      }

      const btn = this.querySelector('button[type="submit"]');
      btn.disabled = true;
      btn.textContent = 'Submitting...';

      try {
        const r = await fetch(API_BASE + '/students/payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, phone, course: course || null, amount, transaction_id: txn })
        });
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Failed');

        msg.textContent = 'Payment details submitted! The institute will verify your payment and confirm it.';
        msg.style.display = 'block';
        document.getElementById('payAmount').value = '';
        document.getElementById('payTxn').value = '';
        btn.textContent = 'Submit Another Payment';
        btn.disabled = false;
      } catch(e) {
        err.textContent = e.message;
        err.style.display = 'block';
        btn.disabled = false;
        btn.textContent = 'Submit Payment';
      }
    });
  });
})();