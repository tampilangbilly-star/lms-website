# 📋 Panduan Instalasi EduTech SITARO

Panduan lengkap untuk menginstall dan menjalankan sistem Learning Management System EduTech SITARO.

## 🔧 Persyaratan Sistem

### Minimum Requirements
- **OS**: Windows 10, macOS 10.15, atau Linux Ubuntu 18.04+
- **RAM**: 4GB (8GB direkomendasikan)
- **Storage**: 2GB ruang kosong
- **Internet**: Untuk download dependencies

### Software Requirements
- **Node.js**: Versi 16.0 atau lebih baru
- **npm**: Versi 8.0 atau lebih baru (biasanya terinstall dengan Node.js)
- **Git**: Untuk version control (opsional)

## 📥 Download dan Instalasi Node.js

### Windows
1. Kunjungi [nodejs.org](https://nodejs.org)
2. Download versi LTS terbaru
3. Jalankan installer dan ikuti petunjuk
4. Buka Command Prompt dan verifikasi:
   ```cmd
   node --version
   npm --version
   ```

### macOS
```bash
# Menggunakan Homebrew (direkomendasikan)
brew install node

# Atau download dari nodejs.org
```

### Linux (Ubuntu/Debian)
```bash
# Update package index
sudo apt update

# Install Node.js
sudo apt install nodejs npm

# Verifikasi instalasi
node --version
npm --version
```

## 🚀 Instalasi EduTech SITARO

### Metode 1: Menggunakan Script Otomatis (Direkomendasikan)

1. **Extract file sistem**
   ```bash
   # Jika menggunakan ZIP
   unzip edutech-sitaro.zip
   cd lms-system
   
   # Atau jika menggunakan Git
   git clone <repository-url>
   cd lms-system
   ```

2. **Jalankan script instalasi**
   ```bash
   # Linux/macOS
   ./start.sh
   
   # Windows (Command Prompt)
   start.bat
   
   # Windows (PowerShell)
   .\start.ps1
   ```

### Metode 2: Instalasi Manual

1. **Masuk ke direktori proyek**
   ```bash
   cd lms-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Buat direktori upload**
   ```bash
   mkdir -p public/uploads/materi
   mkdir -p public/uploads/tugas  
   mkdir -p public/uploads/profiles
   ```

4. **Jalankan sistem**
   ```bash
   npm start
   ```

## 🔧 Konfigurasi

### Environment Variables (Opsional)
Buat file `.env` di root folder untuk kustomisasi:

```env
# Port server (default: 5000)
PORT=5000

# JWT Secret untuk keamanan
JWT_SECRET=your_secret_key_here

# URL API untuk frontend
REACT_APP_API_URL=http://localhost:5000/api
```

### Upload Limits
Ukuran maksimal file dapat dikonfigurasi di `server/utils/upload.js`:
- Materi: 50MB
- Tugas: 20MB  
- Video: 200MB
- Foto Profil: 5MB

## 🌐 Akses Sistem

Setelah instalasi berhasil:

1. **Frontend (React)**: http://localhost:3000
2. **Backend API**: http://localhost:5000

### Akun Default
- **Admin**: username `admin`, password `admin123`
- **Teacher**: username `teacher1`, password `teacher123`
- **Student**: Daftar baru di halaman register

## 🔍 Troubleshooting

### Port Sudah Digunakan
```bash
# Cek proses yang menggunakan port
lsof -i :3000
lsof -i :5000

# Matikan proses
kill -9 <PID>
```

### Error saat npm install
```bash
# Clear cache npm
npm cache clean --force

# Hapus node_modules dan install ulang
rm -rf node_modules
npm install
```

### Permission Error (Linux/macOS)
```bash
# Berikan permission pada script
chmod +x start.sh

# Atau jalankan dengan sudo jika diperlukan
sudo npm install
```

### Database Error
Database SQLite akan dibuat otomatis. Jika ada error:
```bash
# Hapus database dan restart
rm database.sqlite
npm start
```

### Upload Error
```bash
# Pastikan folder upload ada dan memiliki permission
mkdir -p public/uploads/{materi,tugas,profiles}
chmod 755 public/uploads
chmod 755 public/uploads/*
```

## 📱 Testing di Mobile

Untuk test di perangkat mobile dalam jaringan lokal:

1. **Cari IP address komputer**
   ```bash
   # Linux/macOS
   ifconfig | grep inet
   
   # Windows
   ipconfig
   ```

2. **Akses dari mobile**
   - Buka browser di HP
   - Kunjungi: `http://[IP_ADDRESS]:3000`
   - Contoh: `http://192.168.1.100:3000`

## 🔄 Update Sistem

```bash
# Pull update terbaru (jika menggunakan Git)
git pull origin main

# Install dependencies baru
npm install

# Restart sistem
npm start
```

## 🛡️ Keamanan

### Untuk Production
1. **Ganti JWT Secret**
   ```env
   JWT_SECRET=your_very_secure_secret_key
   ```

2. **Set NODE_ENV**
   ```env
   NODE_ENV=production
   ```

3. **Gunakan HTTPS**
4. **Setup Firewall**
5. **Regular Backup Database**

## 📞 Bantuan

Jika mengalami kesulitan:

1. **Periksa Console Error**
   - Buka Developer Tools (F12)
   - Lihat tab Console dan Network

2. **Periksa Server Logs**
   - Lihat output terminal server
   - Cari error messages

3. **Restart System**
   ```bash
   # Hentikan dengan Ctrl+C
   # Jalankan ulang
   npm start
   ```

4. **Reset Complete**
   ```bash
   # Hapus semua dan install ulang
   rm -rf node_modules database.sqlite
   npm install
   npm start
   ```

## ✅ Verifikasi Instalasi

Sistem berhasil terinstall jika:
- ✅ Frontend dapat diakses di http://localhost:3000
- ✅ Backend API merespons di http://localhost:5000/api/health
- ✅ Dapat login dengan akun admin/teacher default
- ✅ Dapat mendaftar akun student baru
- ✅ Database SQLite terbuat otomatis

---

**© 2024 EduTech SITARO** - Sistem Pembelajaran Digital untuk Kabupaten Sitaro