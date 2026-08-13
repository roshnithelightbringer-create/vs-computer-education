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
    transaction_id TEXT,
    payment_date TEXT DEFAULT (date('now')),
    status TEXT CHECK(status IN ('pending','confirmed')) DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migrate existing DB: add transaction_id column if missing
const cols = db.prepare("PRAGMA table_info(payments)").all();
if (!cols.some(c => c.name === 'transaction_id')) {
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

module.exports = db;
