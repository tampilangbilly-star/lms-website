const jwt = require('jsonwebtoken');
const { db } = require('../models/database');

const JWT_SECRET = process.env.JWT_SECRET || 'edutech_sitaro_secret_key_2024';

// Middleware untuk verifikasi token JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token akses diperlukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }
    req.user = user;
    next();
  });
};

// Middleware untuk otorisasi berdasarkan role
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Pengguna tidak terautentikasi' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Akses ditolak. Role tidak sesuai' });
    }

    next();
  };
};

// Middleware khusus untuk admin
const adminOnly = authorizeRoles('admin');

// Middleware khusus untuk teacher
const teacherOnly = authorizeRoles('teacher');

// Middleware khusus untuk student
const studentOnly = authorizeRoles('student');

// Middleware untuk teacher dan admin
const teacherOrAdmin = authorizeRoles('teacher', 'admin');

// Middleware untuk semua role yang sudah login
const authenticatedUser = authenticateToken;

module.exports = {
  authenticateToken,
  authorizeRoles,
  adminOnly,
  teacherOnly,
  studentOnly,
  teacherOrAdmin,
  authenticatedUser,
  JWT_SECRET
};