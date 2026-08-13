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
    payment_date TEXT DEFAULT (date('now')),
    status TEXT CHECK(status IN ('pending','confirmed')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

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

const courses = [
  {title:'Computer Fundamental',slug:'computer-fundamental',category:'Basic Computer',short_description:'Learn the basics of computers, from hardware to software fundamentals.',description:'A comprehensive introduction to computers covering hardware components, software types, operating systems, file management, and basic computer operations.',syllabus:'Introduction to Computer\nTypes of Computer\nComponents of Computer (Hardware)\nCPU, Memory, Storage Devices\nInput & Output Devices\nSoftware Concepts\nOperating System Basics\nWindows/Linux Basics\nFile Management\nBasic Troubleshooting',duration:'2 Months',eligibility:'Anyone'},
  {title:'Microsoft Office',slug:'microsoft-office',category:'Computer Application',short_description:'Master MS Office suite including Word, Excel, PowerPoint, and Access.',description:'Complete training on Microsoft Office applications.',syllabus:'MS Word: Document Creation, Formatting, Tables, Mail Merge\nMS Excel: Worksheets, Formulas, Functions, Charts, Data Analysis\nMS PowerPoint: Presentations, Animations, Slide Masters\nMS Access: Database Basics, Tables, Queries, Forms\nMS Outlook: Email Management, Calendar, Tasks',duration:'3 Months',eligibility:'Anyone'},
  {title:'Internet',slug:'internet',category:'Basic Computer',short_description:'Learn internet basics, email, browsing, and online safety.',description:'Understand how to use the internet effectively and safely.',syllabus:'Internet Basics\nWeb Browsers & Navigation\nSearch Engines & Techniques\nEmail: Creation, Sending, Receiving, Attachments\nOnline Forms & Applications\nInternet Safety & Security\nSocial Media Basics\nCloud Storage Basics\nOnline Payments Basics',duration:'1 Month',eligibility:'Anyone'},
  {title:'CCC',slug:'ccc',category:'Certification',short_description:'Course on Computer Concepts (CCC) as per NIELIT syllabus.',description:'Government-recognized CCC course as prescribed by NIELIT.',syllabus:'Computer Basics\nOperating System\nWord Processing\nSpreadsheet\nPresentation\nInternet & Web\nEmail, Social Media & e-Governance\nDigital Financial Tools\nFuture Skills',duration:'3 Months',eligibility:'Anyone'},
  {title:'Tally ERP 9 & GST',slug:'tally-erp9-gst',category:'Accounting',short_description:'Complete accounting & GST training with Tally ERP 9.',description:'Professional accounting training using Tally ERP 9.',syllabus:'Accounting Fundamentals\nLedger Creation & Management\nVoucher Entry & Types\nInventory Management\nInvoice Creation\nGST Concepts & Registration\nGST Return Filing\nTDS Basics\nPayroll Management\nFinancial Reports\nBalance Sheet & P&L\nBank Reconciliation',duration:'4 Months',eligibility:'Anyone'},
  {title:'Tally Prime',slug:'tally-prime',category:'Accounting',short_description:'Latest Tally Prime with advanced GST and business accounting.',description:'Training on the latest Tally Prime software.',syllabus:'Tally Prime Interface & Basics\nAccounting Masters & Configuration\nVoucher Entry & Accounting\nInventory & Stock Management\nGST Returns & Compliance\nE-way Bill & E-invoicing\nPayroll & Taxation\nMIS Reports\nData Security & Backup\nMulti-Company Management',duration:'4 Months',eligibility:'Anyone'},
  {title:'Graphic Design / DTP / Desktop Publicity',slug:'graphic-design-dtp',category:'Design',short_description:'Professional graphic design, DTP, and desktop publicity training.',description:'Comprehensive graphic design training covering print media and digital design.',syllabus:'Design Principles & Color Theory\nCorelDRAW: Vector Graphics, Logo Design, Layouts\nPhotoshop: Image Editing, Manipulation, Retouching\nPageMaker/InDesign: Publication Design\nTypography & Font Management\nBrochure, Flyer, Business Card Design\nBanner & Hoarding Design\nPrint Production Basics\nPortfolio Development',duration:'6 Months',eligibility:'Anyone'},
  {title:'Mobile Repairing',slug:'mobile-repairing',category:'Hardware',short_description:'Learn mobile phone hardware and software repairing skills.',description:'Hands-on training in mobile phone repair.',syllabus:'Mobile Phone Basics & Technology\nDisassembly & Reassembly\nComponents: LCD, Touch, Battery, Charging\nSMD Components & Soldering\nHardware Troubleshooting\nSoftware Issues & Flashing\nNetwork & Signal Problems\nWater Damage Repair\nAdvanced Smartphone Repair',duration:'6 Months',eligibility:'Anyone'},
  {title:'Hardware & Networking',slug:'hardware-networking',category:'Hardware',short_description:'Computer hardware, networking, and system administration.',description:'Professional training in computer hardware and network administration.',syllabus:'Computer Hardware Components\nPC Assembly & Disassembly\nBIOS/UEFI Configuration\nOperating System Installation\nDriver Installation & Troubleshooting\nNetworking Fundamentals\nCabling & Crimping\nLAN & WAN Configuration\nIP Addressing & Subnetting\nRouter & Switch Configuration\nNetwork Security Basics\nServer Basics',duration:'6 Months',eligibility:'Anyone'},
  {title:'Photo & Video Mixing / Editing',slug:'photo-video-editing',category:'Design',short_description:'Professional photo editing and video mixing skills.',description:'Learn professional photo editing and video post-production.',syllabus:'Photo Editing Fundamentals\nAdobe Photoshop: Layers, Masks, Filters, Retouching\nLightroom: Color Correction, Batch Processing\nVideo Editing Basics\nAdobe Premiere Pro: Timeline, Cuts, Transitions\nAfter Effects: Motion Graphics, Effects\nColor Grading\nAudio Mixing & Synchronization\nExport & Compression\nProject Portfolio',duration:'6 Months',eligibility:'Anyone'},
  {title:'Textile Designing & Digital Print',slug:'textile-designing-digital-print',category:'Design',short_description:'Specialized textile design training for Surat textile industry.',description:'Industry-focused textile design training.',syllabus:'Textile Design Fundamentals\nPattern & Repeat Creation\nColor Separation for Textile\nDigital Print Technology\nAdobe Photoshop for Textile\nCorelDRAW for Textile\nFabric Types & Printing Methods\nMarket Trends & Demands\nPortfolio Creation',duration:'6 Months',eligibility:'Anyone'},
  {title:'Multi Embroidery Designing',slug:'multi-embroidery-designing',category:'Design',short_description:'Learn computerized embroidery design and digitizing.',description:'Specialized training in computerized embroidery design.',syllabus:'Embroidery Design Basics\nDigitizing Fundamentals\nPunching & Editing\nLettering & Monograms\nApplique & 3D Embroidery\nThread & Fabric Selection\nMachine Operation Basics\nDesign Placement & Scaling\nPortfolio Development',duration:'6 Months',eligibility:'Anyone'},
  {title:'Personality Development',slug:'personality-development',category:'Soft Skills',short_description:'Build confidence, communication skills, and professional presence.',description:'Program to develop confidence, communication, and professional etiquette.',syllabus:'Self-Confidence Building\nCommunication Skills\nBody Language & Gestures\nInterview Skills\nGroup Discussion Techniques\nPublic Speaking\nProfessional Etiquette\nTime Management\nGoal Setting\nResume Writing\nPersonality Grooming',duration:'2 Months',eligibility:'Anyone'},
  {title:'Mehandi Course',slug:'mehandi-course',category:'Vocational',short_description:'Learn professional Mehandi/henna art from basics to advanced.',description:'Complete training in Mehandi (henna) art.',syllabus:'Mehandi Basics & History\nCone Handling & Techniques\nBasic Patterns & Shapes\nFloral & Paisley Designs\nArabic Mehandi\nIndian Traditional Mehandi\nBridal Mehandi\nFoot & Hand Patterns\nModern & Fusion Designs\nSpeed & Precision Practice',duration:'3 Months',eligibility:'Anyone'},
  {title:'DCA (Diploma in Computer Application)',slug:'dca',category:'Diploma',short_description:'One-year diploma covering all essential computer applications.',description:'A comprehensive diploma program.',syllabus:'Computer Fundamentals\nOperating System\nMS Office Suite\nInternet & Web Technologies\nTally Accounting Basics\nProgramming Concepts\nFinancial Accounting\nProject Work',duration:'1 Year',eligibility:'Anyone'},
  {title:'ADCA (Advanced Diploma in Computer Application)',slug:'adca',category:'Diploma',short_description:'Advanced diploma with programming, design, and accounting.',description:'An advanced diploma program.',syllabus:'All DCA Topics\nAdvanced Excel\nGraphic Design\nTally ERP 9 / Prime\nProgramming Basics\nDatabase Management\nWeb Design Basics\nAdvanced Accounting\nPersonality Development',duration:'1.5 Years',eligibility:'Anyone'},
  {title:'ADCT (Advanced Diploma in Computer Technology)',slug:'adct',category:'Diploma',short_description:'Advanced technology diploma with hardware, networking, and programming.',description:'An advanced technology-focused diploma.',syllabus:'All ADCA Topics\nHardware & Networking\nAdvanced Programming\nSystem Administration\nWeb Development\nDatabase Management\nNetwork Security\nProject Management\nPractical Lab Work',duration:'2 Years',eligibility:'Anyone'},
  {title:'PGDCA (Post Graduate Diploma in Computer Application)',slug:'pgdca',category:'Diploma',short_description:'Post-graduate diploma for advanced computer proficiency.',description:'A post-graduate level diploma program for graduates.',syllabus:'Advanced Computer Concepts\nProgramming Languages\nDatabase Management Systems\nWeb Technologies\nSoftware Engineering\nNetworking & Security\nE-Commerce\nProject Development\nResearch Methodology',duration:'1 Year',eligibility:'Graduates'}
];

const insertCourse = db.prepare('INSERT OR IGNORE INTO courses (title, slug, category, short_description, description, syllabus, duration, eligibility) VALUES (?,?,?,?,?,?,?,?)');
for (const c of courses) {
  insertCourse.run(c.title, c.slug, c.category, c.short_description, c.description, c.syllabus, c.duration, c.eligibility);
}

module.exports = db;
