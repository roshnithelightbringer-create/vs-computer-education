const db = require('../database');
const router = require('express').Router();
const { sendWhatsApp, demoMsg } = require('../whatsapp');

function notifySoon(msg) {
  setImmediate(() => sendWhatsApp(msg).catch(e => console.error('[whatsapp]', e.message)));
}

router.get('/', (req, res) => {
  const { status } = req.query;
  let query = 'SELECT * FROM demo_bookings';
  const params = [];
  if (status) { query += ' WHERE status = ?'; params.push(status); }
  query += ' ORDER BY created_at DESC';
  res.json({ bookings: db.prepare(query).all(...params) });
});

router.post('/', (req, res) => {
  const { name, phone, course, preferred_date, preferred_time, message } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const result = db.prepare('INSERT INTO demo_bookings (name, phone, course, preferred_date, preferred_time, message) VALUES (?,?,?,?,?,?)').run(name, phone, course || null, preferred_date || null, preferred_time || null, message || null);
  const booking = { id: result.lastInsertRowid, name, phone, course, preferred_date, preferred_time, message };
  notifySoon(demoMsg(booking));
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['new','contacted','completed','cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE demo_bookings SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

module.exports = router;
