const db = require('../database');
const router = require('express').Router();

router.get('/', (req, res) => {
  const courses = db.prepare('SELECT * FROM courses WHERE active = 1 ORDER BY category, title').all();
  res.json({ courses });
});

router.get('/:slug', (req, res) => {
  const course = db.prepare('SELECT * FROM courses WHERE slug = ? AND active = 1').get(req.params.slug);
  if (!course) return res.status(404).json({ error: 'Course not found' });
  res.json({ course });
});

router.get('/admin/all', (req, res) => {
  const courses = db.prepare('SELECT * FROM courses ORDER BY category, title').all();
  res.json({ courses });
});

router.post('/', (req, res) => {
  const { title, category, short_description, description, syllabus, duration, eligibility, featured } = req.body;
  if (!title) return res.status(400).json({ error: 'Title required' });
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const result = db.prepare('INSERT INTO courses (title,slug,category,short_description,description,syllabus,duration,eligibility,featured) VALUES (?,?,?,?,?,?,?,?,?)').run(title, slug, category, short_description, description, syllabus, duration, eligibility, featured || 0);
  res.json({ id: result.lastInsertRowid, slug });
});

router.put('/:id', (req, res) => {
  const { title, category, short_description, description, syllabus, duration, eligibility, featured, active } = req.body;
  const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') : undefined;
  db.prepare('UPDATE courses SET title=COALESCE(?,title), slug=COALESCE(?,slug), category=COALESCE(?,category), short_description=COALESCE(?,short_description), description=COALESCE(?,description), syllabus=COALESCE(?,syllabus), duration=COALESCE(?,duration), eligibility=COALESCE(?,eligibility), featured=COALESCE(?,featured), active=COALESCE(?,active), updated_at=CURRENT_TIMESTAMP WHERE id=?').run(title, slug, category, short_description, description, syllabus, duration, eligibility, featured, active, req.params.id);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM courses WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

router.get('/meta/categories', (req, res) => {
  const categories = db.prepare('SELECT DISTINCT category FROM courses WHERE active = 1 ORDER BY category').all();
  res.json({ categories: categories.map(c => c.category) });
});

module.exports = router;
