const express = require('express');
const { db } = require('../models/database');
const { authenticateToken, teacherOrAdmin, studentOnly } = require('../middleware/auth');
const { uploadTugas } = require('../utils/upload');

const router = express.Router();

// Get all tugas (different views for different roles)
router.get('/', authenticateToken, (req, res) => {
  let query, params;

  if (req.user.role === 'student') {
    // Students only see their own tugas
    query = `
      SELECT t.*, u.full_name as teacher_name 
      FROM tugas t 
      LEFT JOIN users u ON t.teacher_id = u.id 
      WHERE t.student_id = ?
      ORDER BY t.created_at DESC
    `;
    params = [req.user.id];
  } else if (req.user.role === 'teacher') {
    // Teachers see all tugas submitted to them (or unassigned)
    query = `
      SELECT t.*, s.full_name as student_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      WHERE t.teacher_id IS NULL OR t.teacher_id = ?
      ORDER BY t.created_at DESC
    `;
    params = [req.user.id];
  } else {
    // Admin sees all tugas
    query = `
      SELECT t.*, s.full_name as student_name, u.full_name as teacher_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      LEFT JOIN users u ON t.teacher_id = u.id 
      ORDER BY t.created_at DESC
    `;
    params = [];
  }

  db.all(query, params, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tugas);
  });
});

// Get single tugas
router.get('/:id', authenticateToken, (req, res) => {
  let query, params;

  if (req.user.role === 'student') {
    // Students can only see their own tugas
    query = `
      SELECT t.*, u.full_name as teacher_name 
      FROM tugas t 
      LEFT JOIN users u ON t.teacher_id = u.id 
      WHERE t.id = ? AND t.student_id = ?
    `;
    params = [req.params.id, req.user.id];
  } else if (req.user.role === 'teacher') {
    // Teachers can see tugas assigned to them or unassigned
    query = `
      SELECT t.*, s.full_name as student_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      WHERE t.id = ? AND (t.teacher_id IS NULL OR t.teacher_id = ?)
    `;
    params = [req.params.id, req.user.id];
  } else {
    // Admin can see any tugas
    query = `
      SELECT t.*, s.full_name as student_name, u.full_name as teacher_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      LEFT JOIN users u ON t.teacher_id = u.id 
      WHERE t.id = ?
    `;
    params = [req.params.id];
  }

  db.get(query, params, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!tugas) {
      return res.status(404).json({ error: 'Tugas tidak ditemukan' });
    }
    res.json(tugas);
  });
});

// Submit tugas (Student only)
router.post('/', authenticateToken, studentOnly, uploadTugas.single('file'), (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Judul tugas harus diisi' });
  }

  if (!req.file) {
    return res.status(400).json({ error: 'File tugas harus diupload' });
  }

  const filePath = `/uploads/tugas/${req.file.filename}`;
  const fileType = req.file.mimetype;

  db.run(
    'INSERT INTO tugas (title, description, file_path, file_type, student_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, filePath, fileType, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal mengupload tugas' });
      }

      res.status(201).json({
        message: 'Tugas berhasil dikumpulkan',
        tugas: {
          id: this.lastID,
          title,
          description,
          file_path: filePath,
          file_type: fileType,
          student_id: req.user.id,
          status: 'pending'
        }
      });
    }
  );
});

// Assign teacher to tugas and grade it (Teacher only)
router.put('/:id/grade', authenticateToken, teacherOrAdmin, (req, res) => {
  const { id } = req.params;
  const { nilai, komentar } = req.body;

  if (nilai === undefined || nilai === null) {
    return res.status(400).json({ error: 'Nilai harus diisi' });
  }

  if (nilai < 0 || nilai > 100) {
    return res.status(400).json({ error: 'Nilai harus antara 0-100' });
  }

  // Check if tugas exists and is not already graded by another teacher
  let checkQuery, checkParams;
  if (req.user.role === 'admin') {
    checkQuery = 'SELECT * FROM tugas WHERE id = ?';
    checkParams = [id];
  } else {
    checkQuery = 'SELECT * FROM tugas WHERE id = ? AND (teacher_id IS NULL OR teacher_id = ?)';
    checkParams = [id, req.user.id];
  }

  db.get(checkQuery, checkParams, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!tugas) {
      return res.status(404).json({ error: 'Tugas tidak ditemukan atau sudah dinilai oleh guru lain' });
    }

    db.run(
      'UPDATE tugas SET nilai = ?, komentar = ?, teacher_id = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [nilai, komentar, req.user.id, 'graded', id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Gagal memberikan nilai' });
        }

        res.json({
          message: 'Tugas berhasil dinilai',
          nilai,
          komentar,
          status: 'graded'
        });
      }
    );
  });
});

// Update tugas submission (Student only - before grading)
router.put('/:id', authenticateToken, studentOnly, uploadTugas.single('file'), (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Judul tugas harus diisi' });
  }

  // Check if tugas exists, belongs to student, and hasn't been graded
  db.get(
    'SELECT * FROM tugas WHERE id = ? AND student_id = ? AND status = ?',
    [id, req.user.id, 'pending'],
    (err, tugas) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!tugas) {
        return res.status(404).json({ error: 'Tugas tidak ditemukan atau sudah dinilai' });
      }

      let updateQuery = 'UPDATE tugas SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
      let updateParams = [title, description, id];

      // If new file is uploaded, update file path too
      if (req.file) {
        const filePath = `/uploads/tugas/${req.file.filename}`;
        const fileType = req.file.mimetype;
        updateQuery = 'UPDATE tugas SET title = ?, description = ?, file_path = ?, file_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?';
        updateParams = [title, description, filePath, fileType, id];
      }

      db.run(updateQuery, updateParams, function(err) {
        if (err) {
          return res.status(500).json({ error: 'Gagal mengupdate tugas' });
        }

        res.json({ message: 'Tugas berhasil diupdate' });
      });
    }
  );
});

// Delete tugas (Student only - before grading, or Admin)
router.delete('/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  let checkQuery, checkParams;

  if (req.user.role === 'admin') {
    // Admin can delete any tugas
    checkQuery = 'SELECT * FROM tugas WHERE id = ?';
    checkParams = [id];
  } else if (req.user.role === 'student') {
    // Students can only delete their own ungraded tugas
    checkQuery = 'SELECT * FROM tugas WHERE id = ? AND student_id = ? AND status = ?';
    checkParams = [id, req.user.id, 'pending'];
  } else {
    return res.status(403).json({ error: 'Tidak memiliki izin untuk menghapus tugas' });
  }

  db.get(checkQuery, checkParams, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!tugas) {
      return res.status(404).json({ error: 'Tugas tidak ditemukan atau tidak dapat dihapus' });
    }

    db.run('DELETE FROM tugas WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal menghapus tugas' });
      }

      res.json({ message: 'Tugas berhasil dihapus' });
    });
  });
});

// Get pending tugas for teacher
router.get('/pending/list', authenticateToken, teacherOrAdmin, (req, res) => {
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT t.*, s.full_name as student_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      WHERE t.status = 'pending'
      ORDER BY t.created_at ASC
    `;
    params = [];
  } else {
    query = `
      SELECT t.*, s.full_name as student_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      WHERE t.status = 'pending' AND (t.teacher_id IS NULL OR t.teacher_id = ?)
      ORDER BY t.created_at ASC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tugas);
  });
});

// Get graded tugas for teacher
router.get('/graded/list', authenticateToken, teacherOrAdmin, (req, res) => {
  let query, params;

  if (req.user.role === 'admin') {
    query = `
      SELECT t.*, s.full_name as student_name, u.full_name as teacher_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      LEFT JOIN users u ON t.teacher_id = u.id 
      WHERE t.status = 'graded'
      ORDER BY t.updated_at DESC
    `;
    params = [];
  } else {
    query = `
      SELECT t.*, s.full_name as student_name 
      FROM tugas t 
      JOIN users s ON t.student_id = s.id 
      WHERE t.status = 'graded' AND t.teacher_id = ?
      ORDER BY t.updated_at DESC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, tugas) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(tugas);
  });
});

module.exports = router;