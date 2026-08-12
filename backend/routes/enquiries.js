const db = require('../database');
const router = require('express').Router();

router.get('/', (req, res) => {
  const { status, search } = req.query;
  let query = 'SELECT * FROM enquiries';
  const params = []; const conditions = [];
  if (status) { conditions.push('status = ?'); params.push(status); }
  if (search) { conditions.push('(name LIKE ? OR phone LIKE ? OR course LIKE ?)'); params.push(`%${search}%`, `%${search}%`, `%${search}%`); }
  if (conditions.length) query += ' WHERE ' + conditions.join(' AND ');
  query += ' ORDER BY created_at DESC';
  res.json({ enquiries: db.prepare(query).all(...params) });
});

router.post('/', (req, res) => {
  const { name, phone, course, message, enquiry_type } = req.body;
  if (!name || !phone) return res.status(400).json({ error: 'Name and phone required' });
  const result = db.prepare('INSERT INTO enquiries (name, phone, course, message, enquiry_type) VALUES (?,?,?,?,?)').run(name, phone, course || null, message || null, enquiry_type || 'general');
  res.json({ id: result.lastInsertRowid, success: true });
});

router.put('/:id/status', (req, res) => {
  const { status } = req.body;
  if (!['new','contacted','follow-up','joined','closed'].includes(status)) return res.status(400).json({ error: 'Invalid status' });
  db.prepare('UPDATE enquiries SET status = ? WHERE id = ?').run(status, req.params.id);
  res.json({ success: true });
});

module.exports = router;
