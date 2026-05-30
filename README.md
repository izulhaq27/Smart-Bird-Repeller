# Smart Bird Repeller - Website Monitoring Dashboard

Website monitoring real-time untuk sistem IoT Smart Bird Repeller berbasis ESP32 dan Blynk Cloud.

## 📋 Fitur Utama

✅ **Monitor Status Real-Time**
- Tampilkan status online/offline perangkat ESP32
- Koneksi dengan Blynk IoT Cloud

✅ **Sensor Dashboard**
- Status Sensor PIR (gerakan)
- Pembacaan jarak ultrasonik real-time
- Status output devices (buzzer & LED)

✅ **Activity Log**
- Catat setiap deteksi hama
- Simpan timestamp dan jarak deteksi
- Persistent storage menggunakan localStorage

✅ **Desain Modern**
- Responsive di semua ukuran layar
- Tema warna hijau (pertanian/alam)
- Interface intuitif dengan Tailwind CSS

✅ **Real-Time Updates**
- Auto-refresh setiap 5 detik
- Fetch data dari Blynk API
- Update tanpa refresh halaman

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **CSS Framework**: Tailwind CSS
- **Icons**: Font Awesome 6
- **API**: Blynk Cloud REST API
- **Storage**: Browser LocalStorage

## 📁 Struktur File

```
Smart_Bird_Repeller/
├── index.html              # Halaman utama dashboard
├── js/
│   ├── config.js          # Konfigurasi Blynk API
│   ├── api.js             # Blynk API wrapper
│   └── app.js             # Logika aplikasi utama
├── README.md              # Dokumentasi ini
└── .gitignore             # Git ignore rules
```

## ⚙️ Konfigurasi

### 1. Update Token Blynk

Edit file `js/config.js` dan ganti token:

```javascript
const BLYNK_CONFIG = {
    authToken: 'GANTI_DENGAN_TOKEN_ANDA',  // ← Ganti di sini
    // ...
};
```

**Cara mendapatkan token dari Blynk App:**
1. Buka Blynk App
2. Pilih project "Smart Bird Repeller"
3. Klik ⚙️ (Settings)
4. Klik "Device info"
5. Copy "Auth token"

### 2. Arduino Code Setup

Pastikan Arduino code Anda sudah dikirim dengan Virtual Pins yang sesuai:

```cpp
// Virtual Pins yang digunakan:
// V0 - Status PIR (0 atau 1)
// V1 - Jarak Ultrasonik (cm)
// V2 - Status Buzzer
// V3 - Status LED
```

## 🚀 Menjalankan Secara Lokal

### Opsi 1: Live Server (VS Code)

1. Install extension "Live Server"
2. Klik kanan pada `index.html`
3. Pilih "Open with Live Server"

### Opsi 2: Python

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

Buka: `http://localhost:8000`

### Opsi 3: Node.js

```bash
npm install -g http-server
http-server
```

## 🌐 Deploy ke GitHub Pages

### Step 1: Persiapan Repository

```bash
# Masuk ke folder project
cd Smart_Bird_Repeller

# Inisialisasi git
git init

# Tambahkan semua file
git add .

# Commit pertama
git commit -m "Initial commit: Smart Bird Repeller Dashboard"
```

### Step 2: Buat Repository di GitHub

1. Buka https://github.com/new
2. Nama repository: `Smart_Bird_Repeller`
3. Pilih "Public"
4. Jangan initialize dengan README (sudah ada)
5. Klik "Create repository"

### Step 3: Push ke GitHub

Ikuti instruksi di GitHub, contohnya:

```bash
git remote add origin https://github.com/USERNAME/Smart_Bird_Repeller.git
git branch -M main
git push -u origin main
```

Ganti `USERNAME` dengan username GitHub Anda.

### Step 4: Aktifkan GitHub Pages

1. Buka repository di GitHub
2. Klik **Settings** (tab di atas)
3. Pilih **Pages** dari sidebar kiri
4. Di bagian "Source":
   - Branch: `main`
   - Folder: `/ (root)`
5. Klik **Save**
6. Tunggu 1-2 menit
7. Website akan tersedia di: `https://USERNAME.github.io/Smart_Bird_Repeller/`

### Step 5: Verifikasi

Buka link di atas di browser dan cek apakah dashboard muncul dengan baik.

## 📱 Responsive Design

Website responsif untuk:
- 📱 Mobile (320px - 767px)
- 📱 Tablet (768px - 1023px)  
- 💻 Desktop (1024px+)

## 🔄 Real-Time Sync

Data akan otomatis diperbarui setiap **5 detik**.

Untuk mengubah interval, edit `js/config.js`:

```javascript
const BLYNK_CONFIG = {
    refreshInterval: 5000,  // 5000 ms = 5 detik
};
```

## ⚠️ Penting: CORS Issue

Jika mendapat error CORS saat memanggil Blynk API, ada beberapa solusi:

### Solusi 1: Gunakan CORS Proxy (Development)

Edit `js/api.js`, ganti:
```javascript
const apiUrl = 'https://cors-anywhere.herokuapp.com/https://blynk.cloud/external/api';
```

### Solusi 2: Backend Proxy (Production)

Buat server Node.js/PHP yang menerima request dari website dan forward ke Blynk API. Ini lebih aman karena token tidak terekspos di client.

### Solusi 3: Blynk Server Settings

Jika pakai Blynk Local Server, atur CORS di settings server.

## 🔐 Keamanan

⚠️ **JANGAN commit token ke repository!**

Untuk production:
1. Implementasikan backend proxy
2. Gunakan environment variables
3. Jangan expose token di client code

## 🛠️ Troubleshooting

### Problem: Data tidak update

**Solusi:**
- Cek token di `config.js` sudah benar
- Pastikan ESP32 masih online di Blynk App
- Buka console browser (F12) cek error
- Pastikan internet connection stabil

### Problem: CORS Error

**Solusi:**
- Gunakan CORS proxy untuk testing
- Implementasikan backend proxy untuk production
- Cek Blynk Server CORS settings

### Problem: Activity log kosong

**Solusi:**
- Trigger deteksi hama (gerakkan tangan di depan sensor)
- Cek apakah Virtual Pin sudah dikonfigurasi di Arduino
- Lihat console untuk error API

## 📚 Referensi

- [Blynk Documentation](https://docs.blynk.io/)
- [Blynk API REST](https://docs.blynk.io/en/hardware-guides/generic-esp32)
- [GitHub Pages Docs](https://docs.github.com/en/pages)
- [Tailwind CSS](https://tailwindcss.com/)

## 📝 Update & Maintenance

Untuk update website:

```bash
# Edit file yang diperlukan
# Contoh: edit js/app.js

# Commit dan push
git add .
git commit -m "Update: [deskripsi perubahan]"
git push origin main
```

Website akan otomatis update dalam 1-2 menit.

## 📄 Lisensi

Bebas digunakan untuk keperluan pribadi dan pendidikan.

---

**Smart Bird Repeller Dashboard v1.0**  
Dibuat dengan ❤️ untuk pertanian berkelanjutan
