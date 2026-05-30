# 🚀 QUICK START GUIDE

Panduan cepat untuk memulai Smart Bird Repeller Dashboard.

## ⚡ 3 Langkah Cepat Mulai

### 1️⃣ Update Token Blynk

Edit file: `js/config.js`

```javascript
// Cari baris ini:
const BLYNK_CONFIG = {
    authToken: 'RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs',  // ← GANTI INI
```

Ganti dengan token Anda dari Blynk App:
- Buka Blynk App → Project → Settings → Device info → Copy Auth token

### 2️⃣ Test Lokal (Pilih Satu)

**Opsi A: Python**
```bash
cd Smart_Bird_Repeller
python -m http.server 8000
# Buka: http://localhost:8000
```

**Opsi B: Node.js**
```bash
npx http-server
```

**Opsi C: Live Server (VS Code)**
- Klik kanan `index.html` → "Open with Live Server"

### 3️⃣ Deploy ke GitHub Pages

```bash
cd Smart_Bird_Repeller
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/USERNAME/Smart_Bird_Repeller.git
git branch -M main
git push -u origin main
```

Kemudian:
1. GitHub → Settings → Pages
2. Branch: main, Folder: /
3. Save
4. Tunggu 2 menit
5. Akses: `https://USERNAME.github.io/Smart_Bird_Repeller/`

## 📁 Struktur Project

```
Smart_Bird_Repeller/
├── index.html                 # Dashboard utama
├── js/
│   ├── config.js             # Konfigurasi token
│   ├── api.js                # API wrapper
│   └── app.js                # Logika app
├── README.md                  # Dokumentasi lengkap
├── DEPLOYMENT_GUIDE.md        # Panduan deploy detail
├── VIRTUAL_PINS_GUIDE.md      # Referensi Virtual Pins
└── .gitignore
```

## 🔧 Konfigurasi Arduino

Pastikan Arduino code punya BLYNK_READ untuk Virtual Pins:

```cpp
#define BLYNK_TEMPLATE_ID "TMPL6DXnPF5AU"
#define BLYNK_TEMPLATE_NAME "Smart Bird Repeller"
#define BLYNK_AUTH_TOKEN "RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs"

#include <BlynkSimpleEsp32.h>

// Virtual Pin V0 - PIR Status
BLYNK_READ(V0) {
    Blynk.virtualWrite(V0, digitalRead(pinPIR));
}

// Virtual Pin V1 - Distance
BLYNK_READ(V1) {
    Blynk.virtualWrite(V1, (int)bacaJarak());
}

// Virtual Pin V2 - Buzzer
BLYNK_READ(V2) {
    Blynk.virtualWrite(V2, digitalRead(pinBuzzer));
}

// Virtual Pin V3 - LED
BLYNK_READ(V3) {
    Blynk.virtualWrite(V3, digitalRead(pinLED));
}
```

## 📊 Dashboard Features

| Feature | Lokasi | Status |
|---------|--------|--------|
| Device Status | Top Cards | ✅ Online/Offline |
| Detection Count | Top Cards | ✅ Today/Total |
| Activity Log | Middle | ✅ Recent events |
| PIR Sensor | Bottom Left | ✅ Motion detection |
| Ultrasonic | Bottom Middle | ✅ Distance reading |
| Output Devices | Bottom Right | ✅ Buzzer/LED status |

## 🔄 Auto Refresh

Website update data setiap **5 detik** dari Blynk.

Untuk ubah interval, edit `js/config.js`:
```javascript
refreshInterval: 5000  // milliseconds
```

## 💾 Data Penyimpanan

Activity log disimpan di **LocalStorage** browser:
- Data bertahan meski browser ditutup
- Max 50 events disimpan
- Manual refresh: Klik tombol "Refresh"

## 🌐 Browser Compatibility

✅ Chrome/Chromium  
✅ Firefox  
✅ Safari  
✅ Edge  
✅ Mobile browsers

## 🐛 Jika Ada Error

### Error: "Cannot connect to Blynk"
- Cek token di `config.js`
- Pastikan token copy dengan benar (no spaces)
- ESP32 masih online?

### Error: "CORS policy blocked"
- Normal untuk development tanpa backend
- Untuk production, implementasikan backend proxy
- Lihat `DEPLOYMENT_GUIDE.md` untuk solusi

### Data tidak update
- Refresh browser (Ctrl+F5)
- Buka DevTools (F12) cek console
- Pastikan Virtual Pins di Arduino ada

## 📚 Dokumentasi Lengkap

1. **README.md** - Dokumentasi project
2. **DEPLOYMENT_GUIDE.md** - Panduan GitHub Pages step-by-step
3. **VIRTUAL_PINS_GUIDE.md** - Referensi Virtual Pins & Arduino
4. **QUICK_START.md** - Ini (panduan cepat)

## 🎯 Next Steps

- [ ] Update token Blynk di `config.js`
- [ ] Test lokal dengan Python/Node.js
- [ ] Verifikasi data muncul dari Blynk
- [ ] Deploy ke GitHub Pages
- [ ] Update Arduino jika Virtual Pins belum ada

## 🆘 Need Help?

**Error di console browser?**
- F12 → Console tab → lihat error message
- Copy paste error ke Google

**Blynk API tidak connect?**
- Verify token correct di config.js
- Check ESP32 online di Blynk App
- Try refresh page

**GitHub Pages tidak muncul?**
- Wait 2-5 minutes setelah push
- Check repository is PUBLIC
- Check GitHub Pages enabled di Settings

## 💡 Tips & Tricks

1. **Simpan token di tempat aman** (bukan di code)
2. **Test lokal dulu** sebelum deploy
3. **Backup activity log** jika penting
4. **Update Arduino** jika ganti Virtual Pins
5. **Monitor di console** untuk debugging

## 📞 Contact & Support

- Blynk Docs: https://docs.blynk.io/
- GitHub Pages: https://pages.github.com/
- Arduino: https://www.arduino.cc/

---

**Selamat! Anda siap menggunakan Smart Bird Repeller Dashboard! 🎉**

Pertanyaan? Baca dokumentasi lengkap di file lain.
