const db = require('../database');
const router = require('express').Router();
const { sendWhatsApp, studentMsg, paymentMsg } = require('../whatsapp');

function notifySoon(msg) {
  // Fire-and-forget: don't block the response
  setImmediate(() => sendWhatsApp(msg).catch(e => console.error('[whatsapp]', e.message)));
}

// Register/Login a student
router.post('/login', (req, res) => {
  const { name, phone, course } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });

  const existing = db.prepare('SELECT * FROM students WHERE phone = ?').get(phone);
  let student;
  let isNew = false;
  if (existing) {
    db.prepare('UPDATE students SET name = ?, course = COALESCE(?, course) WHERE id = ?').run(name, course || null, existing.id);
    student = db.prepare('SELECT * FROM students WHERE id = ?').get(existing.id);
  } else {
    const result = db.prepare('INSERT INTO students (name, phone, course) VALUES (?,?,?)').run(name, phone, course || null);
    student = db.prepare('SELECT * FROM students WHERE id = ?').get(result.lastInsertRowid);
    isNew = true;
  }

  if (isNew) notifySoon(studentMsg(student));

  res.json({ success: true, student: { id: student.id, name: student.name, phone: student.phone, course: student.course, status: student.status } });
});

// Get all students (admin)
router.get('/', (req, res) => {
  const students = db.prepare('SELECT * FROM students ORDER BY created_at DESC').all();
  res.json({ students });
});

// Update student status (admin)
router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['new','contacted','joined','inactive'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE students SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

// Record a fee payment (student)
router.post('/payment', (req, res) => {
  const { name, phone, course, amount, transaction_id } = req.body;
  if (!name || !phone || !amount) return res.status(400).json({ error: 'Name, phone and amount required' });
  const result = db.prepare('INSERT INTO payments (name, phone, course, amount, transaction_id, status) VALUES (?,?,?,?,?,?)').run(name, phone, course || null, amount, transaction_id || null, 'pending');
  const payment = { id: result.lastInsertRowid, name, phone, course, amount, transaction_id };
  notifySoon(paymentMsg(payment));
  res.json({ id: result.lastInsertRowid, success: true, status: 'pending' });
});

// Get all payments (admin)
router.get('/payments', (req, res) => {
  const payments = db.prepare('SELECT * FROM payments ORDER BY created_at DESC').all();
  res.json({ payments });
});

// Update payment status (admin)
router.put('/payments/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['pending','confirmed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE payments SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

module.exports = router;
