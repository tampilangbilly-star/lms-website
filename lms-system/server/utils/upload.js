const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Konfigurasi storage untuk berbagai jenis file
const createStorage = (uploadPath) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const fullPath = path.join(__dirname, '../../public/uploads', uploadPath);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      cb(null, fullPath);
    },
    filename: (req, file, cb) => {
      // Generate unique filename dengan timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const ext = path.extname(file.originalname);
      const name = file.originalname.replace(ext, '').replace(/[^a-zA-Z0-9]/g, '_');
      cb(null, name + '_' + uniqueSuffix + ext);
    }
  });
};

// File filter untuk materi (PDF, DOC, PPT)
const materiFileFilter = (req, file, cb) => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF, DOC, DOCX, PPT, dan PPTX yang diizinkan untuk materi'), false);
  }
};

// File filter untuk video
const videoFileFilter = (req, file, cb) => {
  const allowedTypes = ['video/mp4', 'video/avi', 'video/mov', 'video/wmv'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file video MP4, AVI, MOV, dan WMV yang diizinkan'), false);
  }
};

// File filter untuk gambar profil
const imageFileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar JPEG, JPG, PNG, dan GIF yang diizinkan'), false);
  }
};

// Konfigurasi upload untuk materi
const uploadMateri = multer({
  storage: createStorage('materi'),
  fileFilter: materiFileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit
  }
});

// Konfigurasi upload untuk tugas
const uploadTugas = multer({
  storage: createStorage('tugas'),
  fileFilter: materiFileFilter, // Same as materi
  limits: {
    fileSize: 20 * 1024 * 1024 // 20MB limit
  }
});

// Konfigurasi upload untuk video
const uploadVideo = multer({
  storage: createStorage('materi'),
  fileFilter: videoFileFilter,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB limit
  }
});

// Konfigurasi upload untuk profile image
const uploadProfile = multer({
  storage: createStorage('profiles'),
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

module.exports = {
  uploadMateri,
  uploadTugas,
  uploadVideo,
  uploadProfile
};