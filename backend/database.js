// VS Computer Education - Database Initialization

const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const bcrypt = require('bcryptjs');
const fs = require('fs');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = new DatabaseSync(path.join(dataDir, 'vsce.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('admin', 'staff')) NOT NULL DEFAULT 'staff',
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    category TEXT,
    short_description TEXT,
    description TEXT,
    syllabus TEXT,
    certificate_info TEXT,
    placement_info TEXT,
    duration TEXT,
    eligibility TEXT,
    who_should_choose TEXT,
    what_you_learn TEXT,
    skills_covered TEXT,
    benefits TEXT,
    image TEXT,
    icon TEXT,
    featured INTEGER DEFAULT 0,
    active INTEGER DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT,
    message TEXT,
    enquiry_type TEXT DEFAULT 'general',
    status TEXT CHECK(status IN ('new','contacted','follow-up','joined','closed')) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS demo_bookings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT,
    preferred_date TEXT,
    preferred_time TEXT,
    message TEXT,
    status TEXT CHECK(status IN ('new','contacted','completed','cancelled')) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT,
    status TEXT CHECK(status IN ('new','contacted','joined','inactive')) DEFAULT 'new',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
  CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id INTEGER,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    course TEXT,
    amount TEXT NOT NULL,
    transaction_id TEXT,
    payment_date TEXT DEFAULT (date('now')),
    status TEXT CHECK(status IN ('pending','confirmed')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrate existing DB: add columns if missing
const courseCols = db.prepare("PRAGMA table_info(courses)").all();
const courseColNames = courseCols.map(c => c.name);
const newCols = ['who_should_choose', 'what_you_learn', 'skills_covered', 'benefits'];
for (const col of newCols) {
  if (!courseColNames.includes(col)) {
    try {
      db.exec(`ALTER TABLE courses ADD COLUMN ${col} TEXT`);
    } catch(e) { /* column may already exist */ }
  }
}

const payCols = db.prepare("PRAGMA table_info(payments)").all();
if (!payCols.some(c => c.name === 'transaction_id')) {
  db.exec('ALTER TABLE payments ADD COLUMN transaction_id TEXT');
}

// Admin user: kajal
const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('kajal');
if (!existingAdmin) {
  db.prepare('INSERT INTO users (name, username, password, role) VALUES (?,?,?,?)').run(
    'Kajal', 'kajal', bcrypt.hashSync('kajalsinghrajput5590', 10), 'admin'
  );
}

// Staff user
const staffExists = db.prepare('SELECT id FROM users WHERE username = ?').get('staff');
if (!staffExists) {
  db.prepare('INSERT INTO users (name, username, password, role) VALUES (?,?,?,?)').run(
    'Staff Member', 'staff', bcrypt.hashSync('staff123', 10), 'staff'
  );
}

// Seed courses
const existingCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get();
if (existingCourses.count === 0) {
  const insert = db.prepare(`INSERT INTO courses (title, slug, category, short_description, description, duration, eligibility, who_should_choose, what_you_learn, skills_covered, benefits, featured, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,1)`);
  
  const courseData = [
    ['DCA', 'dca', 'Diploma', 'Diploma in Computer Applications', 'The Diploma in Computer Applications (DCA) is a foundational program designed for students and professionals who want to build a strong base in computer applications. This course covers essential computer skills, office automation, programming fundamentals, and practical applications. Perfect for beginners looking to start their IT career or enhance their employability with computer proficiency.', '6 Months', '10th Pass or Equivalent', 'Students who have completed 10th or 12th and want to build a career in computers. Working professionals looking to add computer skills to their resume. Anyone starting from scratch with computers.', 'Computer fundamentals, operating systems, MS Office suite (Word, Excel, PowerPoint), internet and email, basic programming concepts, and practical computer applications used in offices and businesses.', 'MS Word, MS Excel, MS PowerPoint, Internet & Email, Basic Programming, File Management, Typing Skills, Computer Hardware Basics', 'Government-recognized diploma, strong foundation for higher computer courses, improved job prospects, practical hands-on training, certificate upon completion, job placement support.', 1],
    ['ADCA', 'adca', 'Diploma', 'Advanced Diploma in Computer Applications', 'The Advanced Diploma in Computer Applications (ADCA) is a comprehensive program that builds upon basic computer knowledge and dives deeper into advanced applications, programming, and IT concepts. This course is ideal for those who want to gain an edge in the competitive job market with advanced computer skills.', '1 Year', '10+2 or Equivalent', 'Students who have completed 12th and want a comprehensive computer education. Those looking for better job opportunities in the IT sector. Anyone who wants to master computer applications beyond the basics.', 'Advanced MS Office, database management, accounting with Tally Prime, web design fundamentals, programming concepts, financial accounting, and practical IT skills used in modern workplaces.', 'Advanced Excel, Tally Prime, Database Management, Web Design, Programming Basics, Financial Accounting, Digital Marketing Fundamentals, Communication Skills', 'Advanced diploma qualification, higher earning potential, eligibility for specialized IT roles, practical industry-oriented training, comprehensive skill development, job placement assistance.', 1],
    ['ADCT', 'adct', 'Diploma', 'Advanced Diploma in Computer Training', 'The Advanced Diploma in Computer Training (ADCT) is a specialized program designed for those who want to become computer trainers or instructors. This course combines advanced computer knowledge with teaching methodologies, preparing you to train others effectively.', '1 Year', '10+2 or Equivalent', 'Those who want to become computer teachers or trainers. Graduates looking for a career in computer education. Professionals who want to train others in their organization.', 'Advanced computer applications, teaching methodologies, curriculum design, student assessment techniques, presentation skills, and practical training delivery methods.', 'Advanced MS Office Suite, Teaching Methods, Curriculum Planning, Presentation Skills, Communication, Classroom Management, Assessment Techniques, Computer Hardware', 'Qualification to teach computer courses, practical teaching experience, curriculum development skills, recognized diploma, career in education sector, job placement in training institutes.', 1],
    ['PGDCA', 'pgdca', 'Diploma', 'Post Graduate Diploma in Computer Applications', 'The Post Graduate Diploma in Computer Applications (PGDCA) is an advanced program for graduates who want to specialize in computer applications. This course covers advanced programming, database management, software development, and IT project management, preparing you for leadership roles in the IT industry.', '1 Year', 'Graduation in any discipline', 'Graduates who want to enter the IT industry. Working professionals seeking career advancement. Those who want to pursue MCA or higher studies in computers.', 'Advanced programming, database design and management, software development lifecycle, web technologies, networking concepts, IT project management, and emerging technologies.', 'Programming Languages, Database Management, Web Development, Networking, Software Engineering, Project Management, System Analysis, Cloud Computing Basics', 'Post graduate diploma qualification, eligibility for IT management roles, pathway to MCA, higher salary potential, industry-relevant skills, comprehensive job placement support.', 1],
    ['Tally Prime', 'tally-prime', 'Accounting', 'Complete Accounting & GST Software Course', 'Master Tally Prime, India\'s most popular accounting and GST software. This practical course covers everything from basic accounting entries to advanced GST filing, payroll management, and inventory control.', '3 Months', 'Basic computer knowledge', 'Students and professionals who want to learn accounting software. Small business owners who want to manage their own accounts. Job seekers targeting accounts and finance roles.', 'Accounting fundamentals, Tally Prime operations, GST return filing, payroll processing, inventory management, banking transactions, and financial report generation.', 'Tally Prime, GST Filing, Payroll Management, Inventory Control, Banking, Financial Reports, Voucher Entry, Taxation Basics', 'Industry-demanded skill, immediate job opportunities in accounting, practical GST filing experience, hands-on training with live projects, certificate of completion.', 0],
    ['Photoshop', 'photoshop', 'Design', 'Professional Graphic Design with Photoshop', 'Learn Adobe Photoshop from basics to advanced techniques. This course covers photo editing, digital painting, graphic design, typography, and visual effects used in professional design work.', '3 Months', 'Basic computer knowledge', 'Creative individuals who want to learn graphic design. Photography enthusiasts who want to edit photos professionally. Aspiring designers and social media content creators.', 'Photoshop tools and panels, photo retouching and manipulation, layer management, masking and blending, typography design, color theory, and creating graphics for print and web.', 'Photo Editing, Layer Management, Masking, Typography, Color Theory, Digital Painting, Image Manipulation, Print & Web Graphics', 'Creative career opportunities, freelance income potential, in-demand digital skill, portfolio development, practical project-based learning.', 0],
    ['Web Development', 'web-development', 'Programming', 'Build Websites from Scratch - HTML, CSS, JS', 'Learn to build modern, responsive websites from scratch. This course covers HTML, CSS, JavaScript, and basic backend concepts. You\'ll create real websites as part of your learning.', '4 Months', 'Basic computer knowledge', 'Anyone who wants to build websites. Students considering a career in web development. Small business owners who want to manage their own website.', 'HTML5 structure and semantics, CSS3 styling and animations, responsive design, JavaScript fundamentals, DOM manipulation, basic backend concepts, and deploying websites live.', 'HTML5, CSS3, JavaScript, Responsive Design, Bootstrap, Basic Backend, Git, Website Deployment', 'High-demand skill, freelance and job opportunities, ability to build your own websites, practical project portfolio, foundation for advanced development.', 0],
    ['Digital Marketing', 'digital-marketing', 'Marketing', 'Master Online Marketing & Social Media', 'Learn to promote businesses online with digital marketing strategies. This course covers SEO, social media marketing, Google Ads, email marketing, content marketing, and analytics.', '3 Months', 'Basic internet knowledge', 'Business owners who want to market online. Students looking for a career in digital marketing. Professionals who want to add digital marketing to their skillset.', 'Search engine optimization (SEO), social media marketing on Facebook, Instagram, LinkedIn, Google Ads and PPC campaigns, email marketing, content strategy, and performance analytics.', 'SEO, Social Media Marketing, Google Ads, Email Marketing, Content Marketing, Analytics, Facebook/Instagram Ads, Canva', 'Fast-growing career field, work-from-home opportunities, practical campaign experience, certification, skills applicable to any business.', 0],
    ['Artificial Intelligence', 'ai', 'Programming', 'Learn AI Tools & Prompt Engineering', 'Get started with Artificial Intelligence in a practical, beginner-friendly way. Learn to use AI tools like ChatGPT, create effective prompts, understand machine learning basics, and apply AI to real-world tasks.', '2 Months', 'Basic computer knowledge', 'Anyone curious about AI and its applications. Professionals who want to use AI to improve their work. Students who want to stay ahead with future-ready skills.', 'AI fundamentals, using ChatGPT and AI tools effectively, prompt engineering techniques, AI for content creation, data analysis with AI, understanding machine learning concepts, and ethical AI usage.', 'ChatGPT, Prompt Engineering, AI Tools, Content Generation, Data Analysis with AI, Machine Learning Basics, AI Ethics', 'Future-proof your career, increase productivity with AI tools, understand the technology shaping tomorrow, practical hands-on experience with real AI tools.', 0],
    ['English Speaking', 'english-speaking', 'Soft Skills', 'Improve Your Spoken English & Communication', 'Build confidence in spoken English through practical conversation practice. This course covers grammar basics, vocabulary building, pronunciation, public speaking, and professional communication.', '3 Months', 'Basic understanding of English', 'Anyone who wants to improve their spoken English. Job seekers preparing for interviews. Professionals who need better English for work. Students who want to communicate confidently.', 'English grammar essentials, vocabulary building techniques, pronunciation and accent improvement, conversation practice, interview preparation, presentation skills, and professional writing.', 'Grammar, Vocabulary, Pronunciation, Conversation, Interview Skills, Presentation Skills, Professional Writing, Public Speaking', 'Better job opportunities, confidence in communication, improved interview performance, career advancement, personal growth, practical speaking practice.', 0]
  ];
  
  for (const c of courseData) {
    insert.run(...c);
  }
  
  console.log(`Seeded ${courseData.length} courses`);
}

module.exports = db;
