# 🔴 DEBUG CHECKLIST - Masalah Offline di GitHub Pages

Website Anda menampilkan **Offline** karena **Arduino tidak mengirim data ke Virtual Pins**.

## ✅ STEP 1: Verifikasi Arduino Upload

**Di Arduino IDE, buka Serial Monitor (Tools → Serial Monitor)**

Seharusnya muncul output seperti ini:

```
════════════════════════════════════════
   SMART BIRD REPELLER - ESP32
   Initializing...
════════════════════════════════════════
✓ Pins configured
✓ System initialized
════════════════════════════════════════
   SYSTEM INFORMATION
════════════════════════════════════════
IP Address: 192.168.x.x
WiFi Signal: -xx dBm
════════════════════════════════════════
VIRTUAL PINS CONFIGURATION:
V0 = PIR Status (0/1)
V1 = Distance (cm)
V2 = Buzzer Status (0/1)
V3 = LED Status (0/1)
════════════════════════════════════════
Distance Threshold: 500 cm
Status: ✓ Ready
════════════════════════════════════════
```

### Jika TIDAK muncul:
- [ ] Pastikan sudah upload ke ESP32 (lihat "Done uploading")
- [ ] Pilih board yang benar: **ESP32 Dev Module**
- [ ] Pilih port COM yang benar
- [ ] Baud rate: **115200**

### Jika muncul tapi tidak update Virtual Pin data:
Lanjut ke Step 2.

---

## ✅ STEP 2: Verifikasi Virtual Pins di Blynk App

**Buka Blynk App → Pilih Project → Device Info**

Seharusnya Virtual Pins menampilkan nilai yang UPDATE REAL-TIME:

```
V0 (PIR Status):     [0 atau 1]  ← harus berubah saat gerakan
V1 (Distance):       [123-500]   ← harus berubah
V2 (Buzzer Status):  [0 atau 1]
V3 (LED Status):     [0 atau 1]
```

### Jika Virtual Pins kosong atau "-":
- [ ] Arduino belum upload dengan benar
- [ ] Kembali ke STEP 1 dan verifikasi upload

### Jika Virtual Pins ada nilai dan update:
Lanjut ke Step 3.

---

## ✅ STEP 3: Clear Cache Browser

Masalah Offline di GitHub Pages mungkin karena cache lama.

**Buka GitHub Pages Anda:**
```
https://USERNAME.github.io/Smart_Bird_Repeller/
```

**Clear cache hard refresh:**
- **Windows/Linux:** `Ctrl+Shift+Delete`
- **Mac:** `Cmd+Option+E` atau Preferences → Privacy → Manage Website Data
- Atau cukup: `Ctrl+F5` atau `Cmd+Shift+R`

### Jika masih Offline setelah hard refresh:
Lanjut ke Step 4.

---

## ✅ STEP 4: Test API Token di Browser

**Buka GitHub Pages website → Buka Developer Tools (F12) → Console Tab**

Copy-paste code ini di console dan jalankan:

```javascript
const token = 'RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs';
const pin = 'V0';

fetch(`https://blynk.cloud/external/api/get?token=${token}&pin=${pin}`)
    .then(r => r.json())
    .then(data => {
        console.log('✓ API Response:', data);
        console.log('Nilai V0:', data[0] || 'Kosong');
    })
    .catch(e => console.error('✗ Error:', e.message));
```

### Hasil yang diharapkan:
```
✓ API Response: [1]
Nilai V0: 1
```

### Jika muncul error atau nilai kosong:
- Arduino belum upload dengan benar (kembali ke STEP 1)
- Token salah (cek token di Blynk App vs config.js)

---

## ✅ STEP 5: Verifikasi Files di GitHub

**GitHub Repo → Check apakah file sudah ter-update:**

1. Buka repository di GitHub
2. Klik **js** folder
3. Klik **config.js**
4. Pastikan token yang tampil sama dengan di local

Jika berbeda, artinya belum di-push. Jalankan:

```bash
git add .
git commit -m "Fix: Update config"
git push origin main
```

---

## 🎯 RINGKASAN - Apa yang harus dilakukan?

| Step | Action | Status |
|------|--------|--------|
| 1 | Cek Serial Monitor Arduino | ⚠️ **Lakukan ini dulu** |
| 2 | Verifikasi Virtual Pins di Blynk App | Tunggu result Step 1 |
| 3 | Clear cache browser + hard refresh | Lakukan setelah Step 2 |
| 4 | Test API token di console | Jika masih Offline |
| 5 | Push ulang ke GitHub | Jika files belum update |

---

## ⚠️ Kemungkinan Penyebab Utama

**99% Masalah:** Arduino **belum ter-upload dengan kode ARDUINO_CODE_FIXED.cpp**

Solusi:
1. Buka Arduino IDE
2. **Copy-Paste seluruh kode** dari **ARDUINO_CODE_FIXED.cpp** file
3. Pastikan:
   - Board: ESP32 Dev Module
   - Port: COM yang benar
   - Baud rate: 115200
4. Klik **Upload** (Ctrl+U)
5. Tunggu "Done uploading"
6. Buka Serial Monitor, lihat log

---

## 📞 Bantuan Cepat

**Tidak tahu apakah Arduino sudah upload?**
- Buka Serial Monitor
- Lihat apakah ada output
- Jika kosong = belum upload

**Tidak tahu token mana yang benar?**
- Buka Blynk App
- Settings → Device info → Copy "Auth token"
- Paste ke `js/config.js`

**Masih Offline meski sudah ikuti semua?**
- Tunggu 5-10 menit (GitHub Pages cache)
- Coba dengan browser incognito
- Check apakah Virtual Pins di Blynk App sudah ada nilai

---

**Mulai dari STEP 1 sekarang! 👇**
