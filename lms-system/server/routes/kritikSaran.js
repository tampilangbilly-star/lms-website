const express = require('express');
const { db } = require('../models/database');
const { authenticateToken, adminOnly, studentOnly } = require('../middleware/auth');

const router = express.Router();

// Get all kritik saran (Admin can see all, Student can see their own)
router.get('/', authenticateToken, (req, res) => {
  let query, params;

  if (req.user.role === 'admin') {
    // Admin can see all kritik saran
    query = `
      SELECT k.*, u.full_name as student_name 
      FROM kritik_saran k 
      JOIN users u ON k.student_id = u.id 
      ORDER BY k.created_at DESC
    `;
    params = [];
  } else if (req.user.role === 'student') {
    // Students can only see their own kritik saran
    query = `
      SELECT k.*, u.full_name as student_name 
      FROM kritik_saran k 
      JOIN users u ON k.student_id = u.id 
      WHERE k.student_id = ?
      ORDER BY k.created_at DESC
    `;
    params = [req.user.id];
  } else {
    // Teachers cannot access kritik saran
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  db.all(query, params, (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(kritikSaran);
  });
});

// Get single kritik saran
router.get('/:id', authenticateToken, (req, res) => {
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT k.*, u.full_name as student_name 
      FROM kritik_saran k 
      JOIN users u ON k.student_id = u.id 
      WHERE k.id = ?
    `;
    params = [req.params.id];
  } else if (req.user.role === 'student') {
    query = `
      SELECT k.*, u.full_name as student_name 
      FROM kritik_saran k 
      JOIN users u ON k.student_id = u.id 
      WHERE k.id = ? AND k.student_id = ?
    `;
    params = [req.params.id, req.user.id];
  } else {
    return res.status(403).json({ error: 'Akses ditolak' });
  }

  db.get(query, params, (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!kritikSaran) {
      return res.status(404).json({ error: 'Kritik saran tidak ditemukan' });
    }
    res.json(kritikSaran);
  });
});

// Submit kritik saran (Student only)
router.post('/', authenticateToken, studentOnly, (req, res) => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subjek dan pesan harus diisi' });
  }

  if (subject.length > 200) {
    return res.status(400).json({ error: 'Subjek maksimal 200 karakter' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Pesan maksimal 1000 karakter' });
  }

  db.run(
    'INSERT INTO kritik_saran (student_id, subject, message) VALUES (?, ?, ?)',
    [req.user.id, subject, message],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal mengirim kritik saran' });
      }

      res.status(201).json({
        message: 'Kritik dan saran berhasil dikirim',
        kritikSaran: {
          id: this.lastID,
          student_id: req.user.id,
          subject,
          message,
          status: 'open'
        }
      });
    }
  );
});

// Respond to kritik saran (Admin only)
router.put('/:id/respond', authenticateToken, adminOnly, (req, res) => {
  const { id } = req.params;
  const { admin_response } = req.body;

  if (!admin_response) {
    return res.status(400).json({ error: 'Respon admin harus diisi' });
  }

  if (admin_response.length > 1000) {
    return res.status(400).json({ error: 'Respon maksimal 1000 karakter' });
  }

  // Check if kritik saran exists
  db.get('SELECT * FROM kritik_saran WHERE id = ?', [id], (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!kritikSaran) {
      return res.status(404).json({ error: 'Kritik saran tidak ditemukan' });
    }

    db.run(
      'UPDATE kritik_saran SET admin_response = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [admin_response, 'closed', id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Gagal memberikan respon' });
        }

        res.json({
          message: 'Respon berhasil dikirim',
          admin_response,
          status: 'closed'
        });
      }
    );
  });
});

// Update kritik saran (Student only - before admin responds)
router.put('/:id', authenticateToken, studentOnly, (req, res) => {
  const { id } = req.params;
  const { subject, message } = req.body;

  if (!subject || !message) {
    return res.status(400).json({ error: 'Subjek dan pesan harus diisi' });
  }

  if (subject.length > 200) {
    return res.status(400).json({ error: 'Subjek maksimal 200 karakter' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Pesan maksimal 1000 karakter' });
  }

  // Check if kritik saran exists, belongs to student, and is still open
  db.get(
    'SELECT * FROM kritik_saran WHERE id = ? AND student_id = ? AND status = ?',
    [id, req.user.id, 'open'],
    (err, kritikSaran) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!kritikSaran) {
        return res.status(404).json({ error: 'Kritik saran tidak ditemukan atau sudah ditutup' });
      }

      db.run(
        'UPDATE kritik_saran SET subject = ?, message = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [subject, message, id],
        function(err) {
          if (err) {
            return res.status(500).json({ error: 'Gagal mengupdate kritik saran' });
          }

          res.json({ message: 'Kritik saran berhasil diupdate' });
        }
      );
    }
  );
});

// Delete kritik saran (Student only - before admin responds, or Admin)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  let checkQuery, checkParams;

  if (req.user.role === 'admin') {
    // Admin can delete any kritik saran
    checkQuery = 'SELECT * FROM kritik_saran WHERE id = ?';
    checkParams = [id];
  } else if (req.user.role === 'student') {
    // Students can only delete their own open kritik saran
    checkQuery = 'SELECT * FROM kritik_saran WHERE id = ? AND student_id = ? AND status = ?';
    checkParams = [id, req.user.id, 'open'];
  } else {
    return res.status(403).json({ error: 'Tidak memiliki izin untuk menghapus kritik saran' });
  }

  db.get(checkQuery, checkParams, (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!kritikSaran) {
      return res.status(404).json({ error: 'Kritik saran tidak ditemukan atau tidak dapat dihapus' });
    }

    db.run('DELETE FROM kritik_saran WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal menghapus kritik saran' });
      }

      res.json({ message: 'Kritik saran berhasil dihapus' });
    });
  });
});

// Get open kritik saran (Admin only)
router.get('/status/open', authenticateToken, adminOnly, (req, res) => {
  const query = `
    SELECT k.*, u.full_name as student_name 
    FROM kritik_saran k 
    JOIN users u ON k.student_id = u.id 
    WHERE k.status = 'open'
    ORDER BY k.created_at ASC
  `;

  db.all(query, (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(kritikSaran);
  });
});

// Get closed kritik saran (Admin only)
router.get('/status/closed', authenticateToken, adminOnly, (req, res) => {
  const query = `
    SELECT k.*, u.full_name as student_name 
    FROM kritik_saran k 
    JOIN users u ON k.student_id = u.id 
    WHERE k.status = 'closed'
    ORDER BY k.updated_at DESC
  `;

  db.all(query, (err, kritikSaran) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(kritikSaran);
  });
});

module.exports = router;