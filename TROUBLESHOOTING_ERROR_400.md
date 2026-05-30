# ⚠️ TROUBLESHOOTING - Website Error HTTP 400

Jika website menampilkan status **Offline** dan error **HTTP 400** di console, ini berarti **Arduino code Anda tidak mengirim data ke Virtual Pins**.

## 🔍 Masalah Yang Terjadi

Kode Arduino Anda original hanya:
```cpp
void loop() {
  Blynk.run();
  
  if (digitalRead(pinPIR) == HIGH) {
    float jarak = bacaJarak();
    if (jarak > 0 && jarak < batasJarak) {
      Blynk.logEvent("hama_terdeteksi", "...");
      // ... output
    }
  }
}
```

**Masalahnya:** Tidak ada `BLYNK_READ()` untuk mengirim data Virtual Pins! 

Website mencoba membaca:
- V0 = Status PIR
- V1 = Jarak Ultrasonik  
- V2 = Status Buzzer
- V3 = Status LED

Tetapi Arduino tidak pernah mengirim data ke pin-pin tersebut.

## ✅ Solusi

### Step 1: Update Arduino Code

Copy kode dari **ARDUINO_CODE_FIXED.cpp** ke Arduino IDE Anda.

Kode ini sudah include:
```cpp
BLYNK_READ(V0) {
    Blynk.virtualWrite(V0, digitalRead(pinPIR));
}

BLYNK_READ(V1) {
    Blynk.virtualWrite(V1, (int)bacaJarak());
}

BLYNK_READ(V2) {
    Blynk.virtualWrite(V2, digitalRead(pinBuzzer));
}

BLYNK_READ(V3) {
    Blynk.virtualWrite(V3, digitalRead(pinLED));
}
```

### Step 2: Upload ke ESP32

1. Buka Arduino IDE
2. Paste kode dari ARDUINO_CODE_FIXED.cpp
3. Pilih Board: **ESP32 Dev Module**
4. Pilih Port: **COM** (tergantung komputer Anda)
5. Klik **Upload**
6. Tunggu sampai selesai (status "Done uploading")

### Step 3: Verify di Blynk App

1. Buka Blynk App
2. Pilih project "Smart Bird Repeller"
3. Lihat device info
4. Seharusnya ada nilai di Virtual Pin V0, V1, V2, V3 yang update real-time

### Step 4: Test di Website

1. Refresh website: `http://localhost:8000`
2. Seharusnya sekarang status berubah menjadi **Online**
3. Sensor data mulai muncul

## 🧪 Cara Debug

Jika masih error, gunakan **API Tester**:

1. Buka: `http://localhost:8000/api-tester.html`
2. Paste token Blynk Anda
3. Klik "Test All Pins"
4. Lihat response untuk setiap Virtual Pin

### Kemungkinan Response:

**✓ Berhasil:**
```
V0: [1]      (ada nilai integer)
V1: [450]    (jarak dalam cm)
V2: [0]      (status buzzer)
V3: [0]      (status LED)
```

**✗ Error 400 (Virtual Pin tidak ada):**
```
Status: 400
```
Berarti Arduino belum upload kode dengan BLYNK_READ().

**✗ Error 401 (Token salah):**
```
Status: 401
```
Berarti token di config.js tidak sesuai dengan token di Arduino.

## 📝 Checklist

- [ ] Download ARDUINO_CODE_FIXED.cpp
- [ ] Copy-paste ke Arduino IDE
- [ ] Pilih board ESP32 Dev Module
- [ ] Upload ke ESP32
- [ ] Lihat di Serial Monitor (harus muncul "✓ System initialized")
- [ ] Buka Blynk App, verifikasi Virtual Pin ada nilai
- [ ] Refresh website
- [ ] Status harus berubah jadi "Online"

## 🆘 Masih Error?

### 1. Serial Monitor Blynk App tidak terbuka?
- Pastikan cable USB sudah connect dengan baik
- Coba cabut dan pasang ulang USB
- Restart Arduino IDE

### 2. Upload error?
- Pilih COM port yang benar (lihat di Device Manager)
- Pastikan driver CH340 sudah terinstall
- Coba update Arduino IDE ke versi terbaru

### 3. Virtual Pin masih tidak ada value?
- Buka Serial Monitor Arduino IDE
- Seharusnya muncul info seperti:
  ```
  ════════════════════════════════════════
     SMART BIRD REPELLER - ESP32
  ════════════════════════════════════════
  ✓ Pins configured
  ✓ Blynk connected!
  ```
- Jika tidak muncul, kode tidak ter-upload dengan benar

### 4. Token salah?
- Buka Blynk App
- Settings → Device info → Copy exact token (jangan ada space)
- Paste ke `js/config.js`

## 💡 Tips

1. **Jangan copy token dari Blynk App langsung ke config.js** - pastikan tidak ada extra space
2. **Test di API Tester dulu** sebelum terpaksa debug panjang
3. **Buka Serial Monitor Arduino** untuk lihat debug messages
4. **Baca console website (F12)** untuk error messages

---

**Masalah Anda kemungkinan besar adalah #1 - Arduino belum upload kode dengan BLYNK_READ().**

Follow langkah di atas seharusnya bisa solved!
