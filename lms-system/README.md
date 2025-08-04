# EduTech SITARO - Learning Management System

Sistem Learning Management System (LMS) lengkap untuk meningkatkan literasi digital masyarakat daerah Kabupaten Sitaro. Sistem ini dirancang ringan, mobile-friendly, dan mudah digunakan.

## 🚀 Fitur Utama

### 👨‍🎓 Student (Siswa)
- ✅ Register dan login
- ✅ Dashboard dengan statistik pembelajaran
- ✅ Akses materi pembelajaran (PDF, DOC, PPT, Video)
- ✅ Menonton video dari YouTube atau upload langsung
- ✅ Upload tugas (PDF, DOC, PPT)
- ✅ Melihat nilai dan komentar dari guru
- ✅ Kirim kritik dan saran ke admin
- ✅ Pengaturan profil dan upload foto

### 👩‍🏫 Teacher (Guru)
- ✅ Login dengan akun yang sudah dibuat admin
- ✅ Dashboard untuk mengelola pembelajaran
- ✅ Upload materi pembelajaran (PDF, PPT, DOC)
- ✅ Upload video pembelajaran atau link YouTube
- ✅ Melihat dan menilai tugas siswa
- ✅ Memberikan komentar pada tugas
- ✅ Pengaturan profil (termasuk gambar default ksb.jpg)

### 🧑‍💼 Admin
- ✅ Dashboard dengan statistik lengkap
- ✅ CRUD (Create, Read, Update, Delete) pengguna
- ✅ Melihat semua materi dan tugas
- ✅ Mengelola kritik dan saran siswa
- ✅ Statistik sistem (jumlah user, materi, tugas, dll)
- ✅ Pengaturan sistem

## 🛠️ Teknologi yang Digunakan

### Backend
- **Node.js** - Runtime JavaScript
- **Express.js** - Web framework
- **SQLite** - Database ringan
- **JWT** - Autentikasi
- **Multer** - Upload file
- **bcryptjs** - Enkripsi password

### Frontend
- **React.js** - UI Library
- **Tailwind CSS** - Styling framework
- **Lucide React** - Icon library
- **Axios** - HTTP client
- **React Router** - Routing

## 📋 Prasyarat

Pastikan Anda sudah menginstall:
- **Node.js** (versi 16 atau lebih baru)
- **npm** atau **yarn**

## 🚀 Cara Menjalankan

### 1. Install Dependencies
```bash
cd lms-system
npm install
```

### 2. Jalankan Sistem
```bash
npm start
```

Perintah ini akan menjalankan:
- **Backend server** di `http://localhost:5000`
- **Frontend React** di `http://localhost:3000`

### 3. Akses Sistem
Buka browser dan kunjungi: `http://localhost:3000`

## 👤 Akun Default

Sistem sudah dilengkapi dengan akun default untuk testing:

### Admin
- **Username:** `admin`
- **Password:** `admin123`

### Teacher (Guru)
- **Username:** `teacher1`
- **Password:** `teacher123`

### Student (Siswa)
- Buat akun baru melalui halaman register

## 📁 Struktur Folder

```
lms-system/
├── public/                 # File statis
│   ├── uploads/           # File upload
│   │   ├── materi/       # Upload materi
│   │   ├── tugas/        # Upload tugas
│   │   └── profiles/     # Foto profil
│   └── ksb.jpg           # Gambar default guru
├── server/                # Backend
│   ├── controllers/      # Logic controller
│   ├── middleware/       # Middleware auth
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utilities
│   └── index.js          # Server utama
├── src/                   # Frontend React
│   ├── components/       # Komponen reusable
│   ├── contexts/         # React contexts
│   ├── pages/            # Halaman aplikasi
│   │   ├── student/      # Halaman siswa
│   │   ├── teacher/      # Halaman guru
│   │   └── admin/        # Halaman admin
│   └── utils/            # Utilities frontend
└── database.sqlite       # Database SQLite
```

## 📱 Mobile-Friendly

Sistem ini dioptimalkan untuk perangkat mobile:
- ✅ Responsive design
- ✅ Touch-friendly interface
- ✅ Optimasi untuk koneksi lambat
- ✅ File size yang ringan

## 🔧 Konfigurasi

### Environment Variables
Buat file `.env` di root folder untuk konfigurasi:

```env
PORT=5000
JWT_SECRET=edutech_sitaro_secret_key_2024
REACT_APP_API_URL=http://localhost:5000/api
```

### Upload Limits
- **Materi:** Maksimal 50MB
- **Tugas:** Maksimal 20MB
- **Video:** Maksimal 200MB
- **Foto Profil:** Maksimal 5MB

## 📝 File yang Didukung

### Materi & Tugas
- PDF (`.pdf`)
- Microsoft Word (`.doc`, `.docx`)
- PowerPoint (`.ppt`, `.pptx`)

### Video
- MP4 (`.mp4`)
- AVI (`.avi`)
- MOV (`.mov`)
- WMV (`.wmv`)
- YouTube Links

### Foto Profil
- JPEG (`.jpg`, `.jpeg`)
- PNG (`.png`)
- GIF (`.gif`)

## 🚀 Deployment

### Untuk Production
```bash
# Build frontend
npm run build

# Jalankan server production
NODE_ENV=production npm run server
```

### Hosting Requirements
- **Node.js** hosting support
- **File upload** capability
- **SQLite** database support

## 🆘 Troubleshooting

### Port sudah digunakan
```bash
# Matikan proses di port 3000/5000
lsof -ti:3000 | xargs kill -9
lsof -ti:5000 | xargs kill -9
```

### Database error
Database SQLite akan dibuat otomatis saat pertama kali menjalankan server.

### File upload error
Pastikan folder `public/uploads/` memiliki permission write.

## 🤝 Kontribusi

Sistem ini dikembangkan untuk meningkatkan literasi digital masyarakat Sitaro. Kontribusi dan saran perbaikan sangat diterima.

## 📞 Support

Jika mengalami kendala, silakan:
1. Periksa console browser untuk error
2. Periksa terminal server untuk log error
3. Pastikan semua dependencies terinstall dengan benar

## 📄 Lisensi

Dikembangkan untuk kepentingan edukasi dan peningkatan literasi digital masyarakat Kabupaten Sitaro.

---

**© 2024 EduTech SITARO** - Sistem Pembelajaran Digital untuk Kabupaten Sitaro
