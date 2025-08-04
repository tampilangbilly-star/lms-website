const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../models/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Register untuk student
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, full_name } = req.body;

    // Validasi input
    if (!username || !email || !password || !full_name) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password minimal 6 karakter' });
    }

    // Cek apakah username atau email sudah ada
    db.get(
      'SELECT * FROM users WHERE username = ? OR email = ?',
      [username, email],
      async (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
          return res.status(400).json({ error: 'Username atau email sudah digunakan' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert user baru (default role: student)
        db.run(
          'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
          [username, email, hashedPassword, full_name, 'student'],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Gagal membuat akun' });
            }

            res.status(201).json({
              message: 'Akun berhasil dibuat',
              user: {
                id: this.lastID,
                username,
                email,
                full_name,
                role: 'student'
              }
            });
          }
        );
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login untuk semua role
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username dan password harus diisi' });
    }

    // Cari user berdasarkan username
    db.get(
      'SELECT * FROM users WHERE username = ?',
      [username],
      async (err, user) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
          return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Verifikasi password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return res.status(401).json({ error: 'Username atau password salah' });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            id: user.id,
            username: user.username,
            role: user.role,
            full_name: user.full_name
          },
          JWT_SECRET,
          { expiresIn: '24h' }
        );

        res.json({
          message: 'Login berhasil',
          token,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            profile_image: user.profile_image
          }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Logout (client-side akan menghapus token)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout berhasil' });
});

// Verify token
router.get('/verify', (req, res) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token tidak valid' });
    }

    // Get fresh user data from database
    db.get(
      'SELECT id, username, email, full_name, role, profile_image FROM users WHERE id = ?',
      [user.id],
      (err, userData) => {
        if (err || !userData) {
          return res.status(404).json({ error: 'User tidak ditemukan' });
        }

        res.json({
          valid: true,
          user: userData
        });
      }
    );
  });
});

module.exports = router;