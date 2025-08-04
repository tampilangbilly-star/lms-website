const express = require('express');
const { db } = require('../models/database');
const { authenticateToken, teacherOrAdmin, studentOnly } = require('../middleware/auth');
const { uploadMateri, uploadVideo } = require('../utils/upload');

const router = express.Router();

// Get all materi (accessible by all authenticated users)
router.get('/', authenticateToken, (req, res) => {
  const query = `
    SELECT m.*, u.full_name as teacher_name 
    FROM materi m 
    JOIN users u ON m.teacher_id = u.id 
    ORDER BY m.created_at DESC
  `;

  db.all(query, (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(materi);
  });
});

// Get materi by teacher (Teacher only - their own materi)
router.get('/my-materi', authenticateToken, teacherOrAdmin, (req, res) => {
  let query, params;

  if (req.user.role === 'admin') {
    // Admin can see all materi
    query = `
      SELECT m.*, u.full_name as teacher_name 
      FROM materi m 
      JOIN users u ON m.teacher_id = u.id 
      ORDER BY m.created_at DESC
    `;
    params = [];
  } else {
    // Teacher can only see their own materi
    query = `
      SELECT m.*, u.full_name as teacher_name 
      FROM materi m 
      JOIN users u ON m.teacher_id = u.id 
      WHERE m.teacher_id = ?
      ORDER BY m.created_at DESC
    `;
    params = [req.user.id];
  }

  db.all(query, params, (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    res.json(materi);
  });
});

// Get single materi
router.get('/:id', authenticateToken, (req, res) => {
  const query = `
    SELECT m.*, u.full_name as teacher_name 
    FROM materi m 
    JOIN users u ON m.teacher_id = u.id 
    WHERE m.id = ?
  `;

  db.get(query, [req.params.id], (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!materi) {
      return res.status(404).json({ error: 'Materi tidak ditemukan' });
    }
    res.json(materi);
  });
});

// Create new materi with file upload (Teacher only)
router.post('/', authenticateToken, teacherOrAdmin, uploadMateri.single('file'), (req, res) => {
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Judul materi harus diisi' });
  }

  let filePath = null;
  let fileType = null;

  if (req.file) {
    filePath = `/uploads/materi/${req.file.filename}`;
    fileType = req.file.mimetype;
  }

  db.run(
    'INSERT INTO materi (title, description, file_path, file_type, teacher_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, filePath, fileType, req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal membuat materi' });
      }

      res.status(201).json({
        message: 'Materi berhasil dibuat',
        materi: {
          id: this.lastID,
          title,
          description,
          file_path: filePath,
          file_type: fileType,
          teacher_id: req.user.id
        }
      });
    }
  );
});

// Upload video for materi (Teacher only)
router.post('/:id/video', authenticateToken, teacherOrAdmin, uploadVideo.single('video'), (req, res) => {
  const { id } = req.params;
  const { youtube_url } = req.body;

  // Check if materi exists and belongs to teacher (unless admin)
  let checkQuery, checkParams;
  if (req.user.role === 'admin') {
    checkQuery = 'SELECT * FROM materi WHERE id = ?';
    checkParams = [id];
  } else {
    checkQuery = 'SELECT * FROM materi WHERE id = ? AND teacher_id = ?';
    checkParams = [id, req.user.id];
  }

  db.get(checkQuery, checkParams, (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!materi) {
      return res.status(404).json({ error: 'Materi tidak ditemukan atau bukan milik Anda' });
    }

    let videoUrl = null;
    let videoType = null;

    if (req.file) {
      // Uploaded video file
      videoUrl = `/uploads/materi/${req.file.filename}`;
      videoType = 'upload';
    } else if (youtube_url) {
      // YouTube URL
      videoUrl = youtube_url;
      videoType = 'youtube';
    } else {
      return res.status(400).json({ error: 'File video atau URL YouTube diperlukan' });
    }

    db.run(
      'UPDATE materi SET video_url = ?, video_type = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [videoUrl, videoType, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Gagal mengupdate video materi' });
        }

        res.json({
          message: 'Video materi berhasil diupdate',
          video_url: videoUrl,
          video_type: videoType
        });
      }
    );
  });
});

// Add video via YouTube URL (Teacher only)
router.post('/video/youtube', authenticateToken, teacherOrAdmin, (req, res) => {
  const { title, description, youtube_url } = req.body;

  if (!title || !youtube_url) {
    return res.status(400).json({ error: 'Judul dan URL YouTube harus diisi' });
  }

  // Validate YouTube URL format
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  if (!youtubeRegex.test(youtube_url)) {
    return res.status(400).json({ error: 'Format URL YouTube tidak valid' });
  }

  db.run(
    'INSERT INTO materi (title, description, video_url, video_type, teacher_id) VALUES (?, ?, ?, ?, ?)',
    [title, description, youtube_url, 'youtube', req.user.id],
    function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal membuat materi video' });
      }

      res.status(201).json({
        message: 'Materi video YouTube berhasil dibuat',
        materi: {
          id: this.lastID,
          title,
          description,
          video_url: youtube_url,
          video_type: 'youtube',
          teacher_id: req.user.id
        }
      });
    }
  );
});

// Update materi (Teacher only - their own materi)
router.put('/:id', authenticateToken, teacherOrAdmin, (req, res) => {
  const { id } = req.params;
  const { title, description } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Judul materi harus diisi' });
  }

  // Check if materi exists and belongs to teacher (unless admin)
  let checkQuery, checkParams;
  if (req.user.role === 'admin') {
    checkQuery = 'SELECT * FROM materi WHERE id = ?';
    checkParams = [id];
  } else {
    checkQuery = 'SELECT * FROM materi WHERE id = ? AND teacher_id = ?';
    checkParams = [id, req.user.id];
  }

  db.get(checkQuery, checkParams, (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!materi) {
      return res.status(404).json({ error: 'Materi tidak ditemukan atau bukan milik Anda' });
    }

    db.run(
      'UPDATE materi SET title = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, description, id],
      function(err) {
        if (err) {
          return res.status(500).json({ error: 'Gagal mengupdate materi' });
        }

        res.json({ message: 'Materi berhasil diupdate' });
      }
    );
  });
});

// Delete materi (Teacher only - their own materi)
router.delete('/:id', authenticateToken, teacherOrAdmin, (req, res) => {
  const { id } = req.params;

  // Check if materi exists and belongs to teacher (unless admin)
  let checkQuery, checkParams;
  if (req.user.role === 'admin') {
    checkQuery = 'SELECT * FROM materi WHERE id = ?';
    checkParams = [id];
  } else {
    checkQuery = 'SELECT * FROM materi WHERE id = ? AND teacher_id = ?';
    checkParams = [id, req.user.id];
  }

  db.get(checkQuery, checkParams, (err, materi) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    if (!materi) {
      return res.status(404).json({ error: 'Materi tidak ditemukan atau bukan milik Anda' });
    }

    db.run('DELETE FROM materi WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).json({ error: 'Gagal menghapus materi' });
      }

      res.json({ message: 'Materi berhasil dihapus' });
    });
  });
});

module.exports = router;