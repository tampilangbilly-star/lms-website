const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../models/database');
const { authenticateToken, adminOnly, authenticatedUser } = require('../middleware/auth');
const { uploadProfile } = require('../utils/upload');

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, adminOnly, (req, res) => {
  db.all(
    'SELECT id, username, email, full_name, role, profile_image, created_at FROM users ORDER BY created_at DESC',
    (err, users) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      res.json(users);
    }
  );
});

// Get user profile
router.get('/profile', authenticateToken, (req, res) => {
  db.get(
    'SELECT id, username, email, full_name, role, profile_image, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!user) {
        return res.status(404).json({ error: 'User tidak ditemukan' });
      }
      res.json(user);
    }
  );
});

// Update user profile
router.put('/profile', authenticateToken, (req, res) => {
  const { full_name, email } = req.body;
  
  if (!full_name || !email) {
    return res.status(400).json({ error: 'Nama lengkap dan email harus diisi' });
  }

  // Check if email is already used by another user
  db.get(
    'SELECT id FROM users WHERE email = ? AND id != ?',
    [email, req.user.id],
    (err, existingUser) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      if (existingUser) {
        return res.status(400).json({ error: 'Email sudah digunakan oleh user lain' });
      }

      db.run(
        'UPDATE users SET full_name = ?, email = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [full_name, email, req.user.id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Gagal mengupdate profil' });
          }

          res.json({ message: 'Profil berhasil diupdate' });
        }
      );
    }
  );
});

// Upload profile image
router.post('/profile/image', authenticateToken, uploadProfile.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'File gambar diperlukan' });
  }

  const imagePath = `/uploads/profiles/${req.file.filename}`;

  db.run(
    'UPDATE users SET profile_image = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [imagePath, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal mengupdate gambar profil' });
      }

      res.json({
        message: 'Gambar profil berhasil diupdate',
        profile_image: imagePath
      });
    }
  );
});

// Create new user (Admin only)
router.post('/', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { username, email, password, full_name, role } = req.body;

    if (!username || !email || !password || !full_name || !role) {
      return res.status(400).json({ error: 'Semua field harus diisi' });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    // Check if username or email already exists
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

        const hashedPassword = await bcrypt.hash(password, 10);

        db.run(
          'INSERT INTO users (username, email, password, full_name, role) VALUES (?, ?, ?, ?, ?)',
          [username, email, hashedPassword, full_name, role],
          function(err) {
            if (err) {
              return res.status(500).json({ error: 'Gagal membuat user' });
            }

            res.status(201).json({
              message: 'User berhasil dibuat',
              user: {
                id: this.lastID,
                username,
                email,
                full_name,
                role
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

// Update user (Admin only)
router.put('/:id', authenticateToken, adminOnly, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, full_name, role, password } = req.body;

    if (!username || !email || !full_name || !role) {
      return res.status(400).json({ error: 'Username, email, nama lengkap, dan role harus diisi' });
    }

    if (!['student', 'teacher', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Role tidak valid' });
    }

    // Check if username or email already exists for other users
    db.get(
      'SELECT * FROM users WHERE (username = ? OR email = ?) AND id != ?',
      [username, email, id],
      async (err, existingUser) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        if (existingUser) {
          return res.status(400).json({ error: 'Username atau email sudah digunakan' });
        }

        let updateQuery = 'UPDATE users SET username = ?, email = ?, full_name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        let updateParams = [username, email, full_name, role, id];

        // If password is provided, hash it and include in update
        if (password && password.trim() !== '') {
          const hashedPassword = await bcrypt.hash(password, 10);
          updateQuery = 'UPDATE users SET username = ?, email = ?, password = ?, full_name = ?, role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
          updateParams = [username, email, hashedPassword, full_name, role, id];
        }

        db.run(updateQuery, updateParams, function(err) {
          if (err) {
            return res.status(500).json({ error: 'Gagal mengupdate user' });
          }

          if (this.changes === 0) {
            return res.status(404).json({ error: 'User tidak ditemukan' });
          }

          res.json({ message: 'User berhasil diupdate' });
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (Admin only)
router.delete('/:id', authenticateToken, adminOnly, (req, res) => {
  const { id } = req.params;

  // Prevent admin from deleting themselves
  if (parseInt(id) === req.user.id) {
    return res.status(400).json({ error: 'Tidak dapat menghapus akun sendiri' });
  }

  db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Gagal menghapus user' });
    }

    if (this.changes === 0) {
      return res.status(404).json({ error: 'User tidak ditemukan' });
    }

    res.json({ message: 'User berhasil dihapus' });
  });
});

// Get statistics (Admin only)
router.get('/stats', authenticateToken, adminOnly, (req, res) => {
  const stats = {};

  // Count users by role
  db.all(
    'SELECT role, COUNT(*) as count FROM users GROUP BY role',
    (err, userStats) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      stats.users = userStats.reduce((acc, stat) => {
        acc[stat.role] = stat.count;
        return acc;
      }, {});

      // Count total materi
      db.get('SELECT COUNT(*) as count FROM materi', (err, materiCount) => {
        if (err) {
          return res.status(500).json({ error: 'Database error' });
        }

        stats.materi = materiCount.count;

        // Count total tugas
        db.get('SELECT COUNT(*) as count FROM tugas', (err, tugasCount) => {
          if (err) {
            return res.status(500).json({ error: 'Database error' });
          }

          stats.tugas = tugasCount.count;

          // Count kritik saran
          db.get('SELECT COUNT(*) as count FROM kritik_saran', (err, kritikCount) => {
            if (err) {
              return res.status(500).json({ error: 'Database error' });
            }

            stats.kritik_saran = kritikCount.count;
            res.json(stats);
          });
        });
      });
    }
  );
});

module.exports = router;