const db = require('../database');
const router = require('express').Router();

router.get('/overview', (req, res) => {
  const enquiries = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = \'new\' THEN 1 ELSE 0 END) as new_enquiries FROM enquiries').get();
  const demos = db.prepare('SELECT COUNT(*) as total, SUM(CASE WHEN status = \'new\' THEN 1 ELSE 0 END) as new_demos FROM demo_bookings').get();
  const courses = db.prepare('SELECT COUNT(*) as total FROM courses WHERE active = 1').get();
  const joined = db.prepare("SELECT COUNT(*) as total FROM enquiries WHERE status = 'joined'").get();
  const recentEnquiries = db.prepare('SELECT * FROM enquiries ORDER BY created_at DESC LIMIT 5').all();
  const recentDemos = db.prepare('SELECT * FROM demo_bookings ORDER BY created_at DESC LIMIT 5').all();
  res.json({ enquiries: enquiries.total, new_enquiries: enquiries.new_enquiries, demos: demos.total, new_demos: demos.new_demos, courses: courses.total, joined: joined.total, recentEnquiries, recentDemos });
});

module.exports = router;
