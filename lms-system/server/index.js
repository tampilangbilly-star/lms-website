const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const materiRoutes = require('./routes/materi');
const tugasRoutes = require('./routes/tugas');
const kritikSaranRoutes = require('./routes/kritikSaran');

// Import database initialization
const initDatabase = require('./models/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));
app.use(express.static(path.join(__dirname, '../public')));

// Ensure upload directories exist
const uploadDirs = [
  path.join(__dirname, '../public/uploads/materi'),
  path.join(__dirname, '../public/uploads/tugas'),
  path.join(__dirname, '../public/uploads/profiles')
];

uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Initialize database
initDatabase();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/materi', materiRoutes);
app.use('/api/tugas', tugasRoutes);
app.use('/api/kritik-saran', kritikSaranRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'EduTech SITARO API is running!' });
});

// Serve React app for any non-API routes
app.get('*', (req, res) => {
  if (!req.path.startsWith('/api')) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  }
});

app.listen(PORT, () => {
  console.log(`🚀 EduTech SITARO Server running on port ${PORT}`);
  console.log(`📚 API available at http://localhost:${PORT}/api`);
});