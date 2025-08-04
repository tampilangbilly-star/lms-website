const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, '../database.sqlite');
const db = new sqlite3.Database(dbPath);

const initDatabase = () => {
  console.log('🗄️ Initializing database...');
  
  // Enable foreign keys
  db.run('PRAGMA foreign_keys = ON');
  
  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      full_name TEXT NOT NULL,
      role TEXT CHECK(role IN ('student', 'teacher', 'admin')) NOT NULL,
      profile_image TEXT DEFAULT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Materi table
  db.run(`
    CREATE TABLE IF NOT EXISTS materi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT,
      file_type TEXT,
      video_url TEXT,
      video_type TEXT CHECK(video_type IN ('upload', 'youtube')),
      teacher_id INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Tugas table
  db.run(`
    CREATE TABLE IF NOT EXISTS tugas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      file_path TEXT NOT NULL,
      file_type TEXT NOT NULL,
      student_id INTEGER NOT NULL,
      teacher_id INTEGER,
      nilai INTEGER CHECK(nilai >= 0 AND nilai <= 100),
      komentar TEXT,
      status TEXT DEFAULT 'pending' CHECK(status IN ('pending', 'graded')),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (teacher_id) REFERENCES users(id) ON DELETE SET NULL
    )
  `);

  // Kritik Saran table
  db.run(`
    CREATE TABLE IF NOT EXISTS kritik_saran (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      status TEXT DEFAULT 'open' CHECK(status IN ('open', 'closed')),
      admin_response TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Create default admin user
  const adminPassword = bcrypt.hashSync('admin123', 10);
  const teacherPassword = bcrypt.hashSync('teacher123', 10);
  
  db.run(`
    INSERT OR IGNORE INTO users (username, email, password, full_name, role)
    VALUES 
      ('admin', 'admin@sitaro.edu', ?, 'Administrator', 'admin'),
      ('teacher1', 'teacher@sitaro.edu', ?, 'Guru Pertama', 'teacher')
  `, [adminPassword, teacherPassword], function(err) {
    if (err) {
      console.error('Error creating default users:', err);
    } else {
      console.log('✅ Default users created (admin: admin123, teacher1: teacher123)');
    }
  });

  console.log('✅ Database initialized successfully');
};

module.exports = initDatabase;
module.exports.db = db;