# PANDUAN DEPLOYMENT - STEP BY STEP

Panduan lengkap untuk deploy Smart Bird Repeller Dashboard ke GitHub Pages.

## 📋 Checklist Sebelum Mulai

- [ ] Token Blynk sudah diupdate di `js/config.js`
- [ ] Sudah punya akun GitHub
- [ ] Git sudah terinstall di komputer
- [ ] Arduino sudah upload dengan kode Virtual Pins

## 🚀 STEP BY STEP DEPLOYMENT

### STEP 1: Test Website Secara Lokal (Penting!)

```bash
# Buka folder project
cd c:\laragon\www\Smart_Bird_Repeller

# Jalankan local server
python -m http.server 8000
# atau jika punya Node.js:
npx http-server
```

Buka browser: `http://localhost:8000`

**Cek:**
- ✅ Dashboard terbuka dengan baik
- ✅ Header dan cards terlihat
- ✅ Tidak ada error di console (F12)
- ✅ Data bisa load dari Blynk (jika koneksi ada)

### STEP 2: Inisialisasi Git Repository

```bash
# Masuk folder project
cd c:\laragon\www\Smart_Bird_Repeller

# Inisialisasi git
git init

# Lihat file yang akan di-commit
git status
```

Output yang diharapkan:
```
Untracked files:
  (use "git add <file>..." to include in what will be committed)
        .gitignore
        README.md
        index.html
        js/
        ...
```

### STEP 3: Add & Commit Files

```bash
# Add semua file
git add .

# Commit pertama kali
git commit -m "Initial commit: Smart Bird Repeller Dashboard"

# Lihat commit
git log --oneline
```

### STEP 4: Buat Repository di GitHub

1. Buka https://github.com/new
2. Isi form:
   - **Repository name**: `Smart_Bird_Repeller`
   - **Description**: Smart Bird Repeller Monitoring Dashboard
   - **Public**: ✓ (harus public untuk GitHub Pages)
3. Klik "Create repository"

**Jangan** pilih "Initialize this repository with:" - karena kita sudah punya file.

### STEP 5: Connect Repository Lokal ke GitHub

Setelah membuat repository, GitHub akan menunjukkan instruksi. Jalankan:

```bash
# Tambahkan remote
git remote add origin https://github.com/USERNAME/Smart_Bird_Repeller.git

# Rename branch ke main (jika diperlukan)
git branch -M main

# Push ke GitHub
git push -u origin main
```

**Ganti `USERNAME` dengan username GitHub Anda!**

Contoh:
```bash
git remote add origin https://github.com/john_doe/Smart_Bird_Repeller.git
git branch -M main
git push -u origin main
```

Tunggu proses push selesai. Output yang diharapkan:
```
Enumerating objects: X, done.
Counting objects: 100% (X/X), done.
Writing objects: 100% (X/X), done.
...
To https://github.com/USERNAME/Smart_Bird_Repeller.git
 * [new branch]      main -> main
Branch 'main' set up to track remote branch 'main' from 'origin'.
```

### STEP 6: Aktifkan GitHub Pages

1. Buka repository di GitHub: `https://github.com/USERNAME/Smart_Bird_Repeller`
2. Klik tab **Settings** (di bagian atas)
3. Dari sidebar kiri, klik **Pages**
4. Di bagian "Build and deployment":
   - **Source**: Deploy from a branch
   - **Branch**: main
   - **Folder**: / (root)
5. Klik **Save**

Tunggu beberapa saat (biasanya 1-2 menit).

### STEP 7: Verifikasi Website Live

1. Tunggu status berubah hijau ✓
2. GitHub Pages akan menampilkan URL: `https://USERNAME.github.io/Smart_Bird_Repeller/`
3. Buka URL tersebut di browser
4. Dashboard harus muncul dengan baik

## ✅ Verifikasi Deployment

Buka `https://USERNAME.github.io/Smart_Bird_Repeller/` dan cek:

- [ ] Header "Smart Bird Repeller" terlihat
- [ ] Semua cards muncul dengan baik
- [ ] Console (F12) tidak ada error merah
- [ ] Styling (warna hijau, layout) sesuai

Jika ada error "404 Not Found", berarti:
- Repository masih private (harus public)
- GitHub Pages belum diaktifkan dengan benar
- Tunggu lebih lama (kadang butuh 5-10 menit)

## 🔄 Update Website

Untuk update/edit website setelah di-deploy:

```bash
# Edit file yang diperlukan
# Contoh: edit js/app.js atau tambah file baru

# Check status
git status

# Add changes
git add .

# Commit dengan pesan yang jelas
git commit -m "Update: [deskripsi perubahan]"

# Push ke GitHub
git push origin main
```

Website akan otomatis update dalam 1-2 menit.

## 🆘 Troubleshooting

### Masalah: CORS Error di Browser

Error: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solusi:**
- Token sudah benar di `config.js`?
- Cek Blynk Cloud API settings
- Atau gunakan backend proxy untuk production

### Masalah: Website menunjukkan 404

**Solusi:**
- Pastikan repository **PUBLIC** (bukan private)
- GitHub Pages sudah diaktifkan?
- Tunggu 5-10 menit, bisa jadi masih processing

### Masalah: Data tidak update dari Blynk

**Solusi:**
- Token benar di `config.js`?
- ESP32 masih online di Blynk App?
- Cek internet connection
- Buka console browser untuk melihat error

### Masalah: Git command tidak dikenali

**Solusi:**
- Pastikan Git sudah terinstall: `git --version`
- Jika tidak ada, download dari https://git-scm.com/download/win

## 📚 Link Penting

- GitHub Pages Docs: https://pages.github.com/
- Blynk API Docs: https://docs.blynk.io/
- Git Documentation: https://git-scm.com/doc

## 💡 Tips

1. **Test locally dulu** sebelum push ke GitHub
2. **Commit messages yang jelas** memudahkan tracking
3. **Jangan commit token** ke repository
4. **Update README** jika ada fitur baru
5. **Backup** token di tempat aman

---

Selamat! Website Anda sudah live di GitHub Pages! 🎉
