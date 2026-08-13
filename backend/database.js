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
    skills_list TEXT,
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

// Add columns if missing
const courseCols = db.prepare("PRAGMA table_info(courses)").all();
const courseColNames = courseCols.map(c => c.name);
const newCols = ['who_should_choose', 'what_you_learn', 'skills_covered', 'benefits', 'skills_list'];
for (const col of newCols) {
  if (!courseColNames.includes(col)) {
    try { db.exec(`ALTER TABLE courses ADD COLUMN ${col} TEXT`); } catch(e) {}
  }
}

const payCols = db.prepare("PRAGMA table_info(payments)").all();
if (!payCols.some(c => c.name === 'transaction_id')) {
  db.exec('ALTER TABLE payments ADD COLUMN transaction_id TEXT');
}

// Seed users
const existingAdmin = db.prepare('SELECT id FROM users WHERE username = ?').get('kajal');
if (!existingAdmin) {
  db.prepare('INSERT INTO users (name, username, password, role) VALUES (?,?,?,?)').run(
    'Kajal', 'kajal', bcrypt.hashSync('kajalsinghrajput5590', 10), 'admin'
  );
}
const staffExists = db.prepare('SELECT id FROM users WHERE username = ?').get('staff');
if (!staffExists) {
  db.prepare('INSERT INTO users (name, username, password, role) VALUES (?,?,?,?)').run(
    'Staff Member', 'staff', bcrypt.hashSync('staff123', 10), 'staff'
  );
}

// Seed courses from brochure data
const existingCourses = db.prepare('SELECT COUNT(*) as count FROM courses').get();
if (existingCourses.count === 0) {
  const insert = db.prepare(`INSERT INTO courses (title, slug, category, short_description, description, duration, eligibility, who_should_choose, what_you_learn, skills_covered, benefits, skills_list, featured, active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,1)`);

  const courseData = [
    ['DCA', 'dca', 'Diploma', 'Diploma in Computer Applications',
     'The Diploma in Computer Applications (DCA) is a foundational course designed for students and beginners. Learn essential computer skills including computer fundamentals, MS Office applications, internet operations, and basic computer operations. Perfect for students, job seekers, and anyone wanting to build a strong foundation in computers.',
     '6 Months', '10th Pass or Equivalent',
     'Students who have completed 10th or 12th and want to build computer skills. Beginners with little or no computer knowledge. Job seekers who need basic computer proficiency for office work.',
     'Computer fundamentals including file management, desktop operations, and system settings. MS Word for document creation and formatting. MS Excel for spreadsheets, tables, and basic calculations. MS PowerPoint for presentations. Internet browsing, email, and online communication.',
     'Computer Fundamentals, MS Word, MS Excel, MS PowerPoint, Internet & Email, Paint, Notepad, WordPad, Typing Skills',
     'Build a strong foundation in computers. Learn essential office applications used in every workplace. Practical hands-on training. Certificate upon completion. Job placement support.',
     'Computer Fundamentals|MS Word|MS Excel|MS PowerPoint|Internet & Email|Paint|Notepad|WordPad|Typing Master|Basic Computer Operations', 1],

    ['ADCA', 'adca', 'Diploma', 'Advanced Diploma in Computer Applications',
     'The Advanced Diploma in Computer Applications (ADCA) is a comprehensive program covering everything from DCA to advanced topics including Tally Prime & GST, Graphic Design, and Database Management. Ideal for students who want complete computer proficiency for better job opportunities.',
     '1 Year', '10+2 or Equivalent',
     'Students who have completed 12th and want comprehensive computer education. Those looking for office jobs requiring advanced computer skills. Anyone who wants to master computers including accounting and design.',
     'All DCA topics plus: Tally Prime & GST (company creation, purchase/sales orders, inventory, GST filing). Graphic Design with Photoshop, Corel Draw, and Page Maker. Database management. Advanced Excel functions and formulas. Internet and web fundamentals.',
     'All DCA skills plus: Tally Prime & GST, Graphic Design (Photoshop, Corel Draw, Page Maker), Database Management, Advanced Excel, Internet & Web',
     'Complete computer education in one course. Learn accounting with Tally Prime & GST. Gain graphic design skills. Higher job prospects in offices and businesses. Industry-recognized diploma. Job placement assistance.',
     'All DCA Skills|Tally Prime & GST|Graphic Design (Photoshop, Corel Draw, Page Maker)|Database Management|Advanced Excel|Internet & Web|Personality Development', 1],

    ['ADCT', 'adct', 'Diploma', 'Advanced Diploma in Computer Technology',
     'The Advanced Diploma in Computer Technology (ADCT) is a specialized program for those who want in-depth knowledge of computer technology. Covers everything in ADCA plus hardware, networking, troubleshooting, and advanced computer technology concepts.',
     '1 Year', '10+2 or Equivalent',
     'Students who want to become computer professionals. Those interested in computer hardware and networking. Aspiring computer trainers and technicians.',
     'All ADCA topics plus: Computer hardware identification and assembly. Operating system installation and configuration. BIOS/CMOS settings. Networking fundamentals. Troubleshooting PC hardware and software. Antivirus installation and system maintenance.',
     'All ADCA skills plus: Hardware Identification & Assembly, OS Installation, BIOS/CMOS Settings, Networking Basics, PC Troubleshooting, System Maintenance, Antivirus & Security',
     'Become a complete computer professional. Learn both software and hardware. Higher earning potential. Qualification to work as computer technician or trainer. Practical hands-on training. Job placement support.',
     'All ADCA Skills|Hardware Identification & Assembly|OS Installation & Configuration|BIOS & CMOS Settings|Networking Fundamentals|PC Troubleshooting|System Maintenance|Antivirus & Security|Disc Management|Booting Process', 1],

    ['PGDCA', 'pgdca', 'Diploma', 'Post Graduate Diploma in Computer Applications',
     'The Post Graduate Diploma in Computer Applications (PGDCA) is our most advanced program for graduates. Covers everything in ADCT plus advanced modules including Textile Designing, Embroidery Designing, Programming, and specialized vocational skills for a complete professional skillset.',
     '2 Years', 'Graduation in any discipline',
     'Graduates who want to build a complete IT career. Professionals seeking advanced computer skills. Those who want to master multiple domains including design, programming, and vocational skills.',
     'All ADCT topics plus: Textile Designing & Digital Print. Multi Embroidery Designing. Programming fundamentals. Advanced Graphic Design. Mobile Repairing basics. Photo & Video Mixing/Editing. Personality Development and communication skills.',
     'All ADCT skills plus: Textile Designing & Digital Print, Multi Embroidery Designing, Programming Basics, Advanced Graphic Design, Mobile Repairing, Photo & Video Editing, Personality Development, Communication Skills',
     'Most comprehensive computer diploma. Master multiple professional domains. Highest job placement potential. Complete career readiness. Advanced certificate qualification. Premium job placement support.',
     'All ADCT Skills|Textile Designing & Digital Print|Multi Embroidery Designing|Programming Fundamentals|Advanced Graphic Design|Mobile Repairing|Photo & Video Mixing/Editing|Personality Development|Communication Skills|Mehandi Course', 1],

    ['Computer Fundamentals', 'computer-fundamentals', 'Skill', 'Basic Computer Operations & Skills',
     'Learn the basics of computers including file management, desktop operations, MS-Paint, Notepad, WordPad, typing, and essential computer operations. Perfect for absolute beginners.',
     '2 Months', 'No prerequisites',
     'Absolute beginners. Housewives and senior citizens. Anyone who has never used a computer before.',
     'Computer basics, file and folder management, time and display settings, taskbar operations, MS-Paint, Notepad, WordPad, Control Panel, Typing Master, calculator, screensaver settings.',
     'File & Folder Management, MS-Paint, Notepad, WordPad, Control Panel, Typing Master, Desktop Operations',
     'Start from zero. Build confidence with computers. Learn at your own pace. Practical hands-on training.',
     'File & Folder Management|Time & Display Settings|Taskbar Operations|MS-Paint|Notepad|WordPad|Control Panel|Typing Master|My Computer|Calculator|Screensaver', 0],

    ['Microsoft Office', 'microsoft-office', 'Skill', 'MS Word, Excel & PowerPoint Training',
     'Master Microsoft Office applications including MS Word, MS Excel, and MS PowerPoint. Each application is taught separately with practical exercises and real-world projects.',
     '2 Months per application', 'Basic computer knowledge',
     'Students, office workers, job seekers. Anyone who needs to use MS Office for work or study.',
     'MS Word: document creation, formatting, tables, mail merge. MS Excel: spreadsheets, formulas, charts, data management. MS PowerPoint: presentations, slide design, animations, audio slides.',
     'MS Word, MS Excel, MS PowerPoint',
     'Industry-standard office skills. Improve efficiency. Certificate for each application. Practical project-based learning.',
     'MS Word (Paragraph Typing, Letter Formatting, Format Painter, Print Setup, Bookmark, Hyperlink, Header & Footer, Watermark, Picture Insert)|MS Excel (Workbooks, Table Format, Conditional Formatting, Charts, Salary Slips, Functions & Formulas, Marksheets)|MS PowerPoint (Presentations, Slide Formatting, Backgrounds, Slide Design & Layout, Effects, Audio Slides)', 0],

    ['CCC', 'ccc', 'Skill', 'Course on Computer Concepts',
     'Government-recognized course covering Windows, MS Office, Internet, email, troubleshooting, and installation. Includes MS Outlook and MS Indic for Hindi typing.',
     '2 Months', 'Basic computer knowledge',
     'Students preparing for government jobs. Anyone wanting a recognized computer certificate. Beginners wanting structured computer education.',
     'Windows XP/10, MS Word step by step, MS Outlook, MS Indic (Hindi typing), Internet fundamentals, troubleshooting, installation best practices.',
     'Windows OS, MS Word, MS Outlook, MS Indic, Internet, Troubleshooting, Installation',
     'Government-recognized certification. Covers all basic computer concepts. Hindi typing included. Job-ready skills.',
     'Windows OS|MS Word (Step by Step)|MS Outlook|MS Indic (Hindi Typing)|Internet|Troubleshooting|Installation & Best Practices', 0],

    ['Tally Prime & GST', 'tally-prime', 'Skill', 'Complete Accounting & GST Software',
     'Learn Tally Prime with complete GST training. Covers company creation, purchase/sales orders, inventory management, GST filing (SGST, CGST, IGST), stock transfer, and interest calculation.',
     '2 Months', 'Basic computer knowledge',
     'Students wanting accounting careers. Small business owners. Job seekers targeting accounts and finance roles.',
     'Tally introduction, company creation (single & multiple), interest calculation, purchase and sales orders, inventory introduction, stock transfer, GST filing (SGST, CGST, IGST).',
     'Tally Prime, GST Filing (SGST/CGST/IGST), Company Creation, Purchase/Sales Orders, Inventory Management, Stock Transfer',
     'Industry-demanded accounting skill. Complete GST filing experience. Immediate job opportunities. Practical hands-on training.',
     'Introduction to Tally|Company Creation (Single & Multiple)|Interest Calculation|Purchase Orders|Sales Orders|Inventory Introduction|Stock Transfer|GST (SGST, CGST, IGST)', 0],

    ['Graphic Design & DTP', 'graphic-design', 'Skill', 'Professional Graphic Design & Desktop Publishing',
     'Learn professional graphic design with Photoshop, Corel Draw, Illustrator, and Page Maker. Create logos, banners, brochures, and print-ready designs.',
     '3 Months', 'Basic computer knowledge',
     'Creative individuals. Aspiring graphic designers. Anyone wanting to learn design software for career or business.',
     'Adobe Photoshop for photo editing and manipulation. Corel Draw for vector graphics and logos. Page Maker for desktop publishing. Illustrator for illustrations.',
     'Adobe Photoshop, Corel Draw, Page Maker, Illustrator, Logo Design, Banner Design, Print Design',
     'Creative career opportunities. Freelance income potential. Build a design portfolio. Practical project-based learning.',
     'Adobe Photoshop|Corel Draw|Page Maker|Illustrator|Logo Design|Banner & Brochure Design|Print-Ready Design', 0],

    ['Mobile Repairing', 'mobile-repairing', 'Skill', 'Mobile Phone Repair & Service Training',
     'Learn complete mobile phone repairing including digital PCB knowledge, flashing, online repair techniques, and hardware troubleshooting.',
     '2 Months', 'Basic electronics knowledge',
     'Those wanting a career in mobile repair. Entrepreneurs wanting to start a repair shop. Technicians wanting to upgrade skills.',
     'Digital PCB knowledge, BB5 flashing software, advance online repair knowledge, all IIC indication, re-bold practice, flash file download knowledge, jumper knowledge.',
     'Digital PCB, Mobile Flashing, Online Repair, Hardware Troubleshooting, Jumper Work',
     'High-demand vocational skill. Start your own business. Practical hands-on training. Lifetime support.',
     'Digital PCB Knowledge|BB5 Flashing Software|Advance Online Repair|All IIC Indication|Re-bold Practice|Flash File Download|Jumper Knowledge|Hardware Troubleshooting', 0],

    ['Hardware & Networking', 'hardware-networking', 'Skill', 'Computer Hardware & Network Administration',
     'Comprehensive training in computer hardware assembly, troubleshooting, networking, and system administration.',
     '3 Months', 'Basic computer knowledge',
     'Aspiring computer technicians. IT support professionals. Anyone wanting to understand computer hardware.',
     'Identification of all computer parts, PC troubleshooting, OS installation, BIOS/CMOS settings, driver installation, assembling & disassembling, disc management, booting process, antivirus installation.',
     'Hardware Identification, PC Assembly, OS Installation, BIOS/CMOS Settings, Networking, Troubleshooting',
     'Essential IT skills. High demand in support roles. Practical lab training. Certification upon completion.',
     'Identification of All Parts|PC Troubleshooting|OS Installation|BIOS & CMOS Settings|Driver Installation|Assembling & Disassembling|Disc Management|Booting Process|Antivirus Installation & Updates', 0],

    ['Photo & Video Editing', 'photo-video-editing', 'Skill', 'Photo & Video Mixing and Editing',
     'Learn professional photo editing and video mixing with Adobe Premiere and After Effects. Create stunning videos, effects, and visual content.',
     '3 Months', 'Basic computer knowledge',
     'Creative individuals. Aspiring video editors. Social media content creators. Photography enthusiasts.',
     'Adobe Premiere for video editing and mixing. Adobe After Effects for visual effects and motion graphics. Photo editing techniques.',
     'Adobe Premiere, Adobe After Effects, Video Mixing, Visual Effects, Photo Editing',
     'Creative career in media. Freelance opportunities. Content creation skills. Practical project work.',
     'Adobe Premiere Pro (Advance Study)|Adobe After Effects (Interface & Effects)|Video Mixing & Editing|Visual Effects|Photo Editing & Retouching', 0],

    ['Textile Designing', 'textile-designing', 'Skill', 'Textile Designing & Digital Print',
     'Learn textile design principles and digital print techniques. Create patterns, fabric designs, and digital print-ready artwork.',
     '3 Months', 'Basic computer knowledge',
     'Those interested in textile and fashion design. Entrepreneurs in textile business. Creative individuals.',
     'Textile design fundamentals, pattern creation, digital print techniques, color theory for textiles, design software for fabric printing.',
     'Textile Design, Pattern Creation, Digital Print, Color Theory, Fabric Design Software',
     'Specialized skill for textile industry. Career in fashion and textile. Business opportunity. Creative outlet.',
     'Textile Design Fundamentals|Pattern Creation|Digital Print Techniques|Color Theory for Textiles|Fabric Design Software|Print-Ready Artwork', 0],

    ['Embroidery Designing', 'embroidery-designing', 'Skill', 'Multi Embroidery Designing',
     'Learn computerized embroidery design creation. Master multi-head embroidery machines and design software for embroidery.',
     '3 Months', 'Basic computer knowledge',
     'Those interested in embroidery business. Fashion designers. Entrepreneurs in garment industry.',
     'Embroidery design software, digitizing techniques, multi-head machine operation, pattern creation, thread color management.',
     'Embroidery Design, Digitizing, Machine Operation, Pattern Creation, Thread Management',
     'Specialized vocational skill. Business opportunity in garment industry. High-demand skill. Practical training.',
     'Embroidery Design Software|Digitizing Techniques|Multi-Head Machine Operation|Pattern Creation|Thread Color Management|Design Editing', 0],

    ['Personality Development', 'personality-development', 'Skill', 'Personality Development & Communication',
     'Build confidence, improve communication skills, and develop a professional personality. Includes spoken English, interview skills, and workplace etiquette.',
     '2 Months', 'No prerequisites',
     'Students preparing for interviews. Professionals wanting career growth. Anyone wanting to build confidence.',
     'Communication skills, spoken English, interview preparation, presentation skills, workplace etiquette, confidence building.',
     'Communication, Spoken English, Interview Skills, Presentation, Etiquette, Confidence',
     'Boost your confidence. Improve job prospects. Better communication. Professional growth.',
     'Communication Skills|Spoken English|Interview Preparation|Presentation Skills|Workplace Etiquette|Confidence Building|Public Speaking', 0],

    ['Mehandi Course', 'mehandi-course', 'Skill', 'Professional Mehandi (Henna) Design Course',
     'Learn professional Mehandi design from basics to advanced patterns. Includes bridal Mehandi, Arabic designs, Indo-Arabic fusion, and modern trends.',
     '2 Months', 'No prerequisites',
     'Those wanting to learn Mehandi professionally. Aspiring Mehandi artists. Entrepreneurs wanting to start a Mehandi business.',
     'Basic to advanced Mehandi patterns, bridal designs, Arabic Mehandi, Indo-Arabic fusion, cone making, color mixing, speed practice.',
     'Basic Patterns, Bridal Mehandi, Arabic Designs, Indo-Arabic Fusion, Cone Making',
     'Start your own Mehandi business. Flexible working hours. High demand during wedding season. Creative skill.',
     'Basic Patterns & Practice|Bridal Mehandi Designs|Arabic Mehandi|Indo-Arabic Fusion|Cone Making & Handling|Color Mixing|Speed Practice|Modern Trends', 0]
  ];

  for (const c of courseData) {
    insert.run(...c);
  }
  console.log(`Seeded ${courseData.length} courses`);
}

module.exports = db;
