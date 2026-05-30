# ARDUINO VIRTUAL PINS REFERENCE

Panduan Virtual Pins yang harus dikonfigurasi di Arduino untuk bekerja dengan website dashboard.

## 📌 Virtual Pins Configuration

Website monitoring menggunakan Virtual Pins berikut untuk sync data dengan Blynk:

| Virtual Pin | Nama | Tipe Data | Range | Deskripsi | Digunakan Di Website |
|-------------|------|-----------|-------|-----------|-------------------|
| V0 | PIR Status | Integer | 0 atau 1 | Status sensor PIR (gerakan) | Sensor PIR Card |
| V1 | Distance | Integer | 0 - 1000 | Jarak ultrasonik dalam cm | Sensor Ultrasonik Card |
| V2 | Buzzer Status | Integer | 0 atau 1 | Status buzzer (aktif/tidak) | Output Devices Card |
| V3 | LED Status | Integer | 0 atau 1 | Status LED (on/off) | Output Devices Card |

## 🔧 Contoh Arduino Code Setup

```cpp
#include <BlynkSimpleEsp32.h>

// Virtual Pin V0 - PIR Status
BLYNK_READ(V0) {
    int pirValue = digitalRead(pinPIR);  // Baca status PIR
    Blynk.virtualWrite(V0, pirValue);     // Kirim ke Blynk
}

// Virtual Pin V1 - Distance
BLYNK_READ(V1) {
    float jarak = bacaJarak();            // Baca jarak ultrasonik
    Blynk.virtualWrite(V1, (int)jarak);   // Kirim ke Blynk (integer)
}

// Virtual Pin V2 - Buzzer Status
BLYNK_READ(V2) {
    int buzzerValue = digitalRead(pinBuzzer);
    Blynk.virtualWrite(V2, buzzerValue);
}

// Virtual Pin V3 - LED Status
BLYNK_READ(V3) {
    int ledValue = digitalRead(pinLED);
    Blynk.virtualWrite(V3, ledValue);
}

// Dalam loop(), update virtual pins secara berkala
void loop() {
    Blynk.run();
    
    // Update setiap 5 detik
    static unsigned long lastUpdate = 0;
    if (millis() - lastUpdate > 5000) {
        lastUpdate = millis();
        
        Blynk.virtualWrite(V0, digitalRead(pinPIR));
        Blynk.virtualWrite(V1, (int)bacaJarak());
        Blynk.virtualWrite(V2, digitalRead(pinBuzzer));
        Blynk.virtualWrite(V3, digitalRead(pinLED));
    }
    
    delay(100);
}
```

## 📡 Data Flow

```
ESP32 (Arduino)
    ↓
Blynk Cloud Server
    ↓
Website (HTTP GET Request)
    ↓
Browser Dashboard
    ↓
Update UI Real-Time
```

## 🔑 Konfigurasi di JavaScript

File `js/config.js` sudah dikonfigurasi sesuai Virtual Pins di atas:

```javascript
const BLYNK_CONFIG = {
    pins: {
        pir: 'V0',        // PIR Status
        distance: 'V1',   // Distance
        buzzer: 'V2',     // Buzzer Status
        led: 'V3',        // LED Status
    },
};
```

**Jika Anda menggunakan Virtual Pins yang berbeda**, update array ini sesuai dengan Arduino code Anda.

## 🎯 Update Frequency

Website melakukan GET request ke Blynk setiap **5 detik** (dapat diubah di `js/config.js`):

```javascript
const BLYNK_CONFIG = {
    refreshInterval: 5000,  // 5000 ms = 5 detik
};
```

Pastikan Arduino juga update Virtual Pins minimal setiap 5 detik agar data selalu fresh.

## 📊 Sensor Data Interpretation

### PIR Sensor (V0)
- **0** = Tidak ada gerakan
- **1** = Gerakan terdeteksi

Di website akan tampil:
- 0 → "Tidak Ada Gerakan ✓" (warna hijau)
- 1 → "Gerakan Terdeteksi ⚠️" (warna merah)

### Distance Sensor (V1)
- Nilai dalam **cm**
- Threshold: **500 cm** (dapat diubah di `LOCAL_CONFIG`)

Di website akan tampil:
- < 500 cm → "⚠️ Dalam Jangkauan" (merah)
- ≥ 500 cm → "✓ Aman" (hijau)

### Buzzer Status (V2)
- **0** = Buzzer mati
- **1** = Buzzer aktif

### LED Status (V3)
- **0** = LED mati
- **1** = LED menyala

## 🚨 Event Logging

Ketika deteksi hama terjadi, website akan:

1. Detect perubahan status di V0 dan V1
2. Log event dengan timestamp ke localStorage
3. Tampilkan di Activity Log
4. Update statistik deteksi

Contoh log yang tersimpan:
```json
{
    "timestamp": "2024-05-30T10:30:45.123Z",
    "event": "hama_terdeteksi",
    "description": "Peringatan: Hama Burung Terdeteksi!",
    "distance": "450",
    "severity": "high"
}
```

## ⚙️ Testing Virtual Pins

Untuk test apakah Virtual Pins sudah bekerja:

### Dari Blynk App:
1. Buka app Blynk
2. Pilih device "Smart Bird Repeller"
3. Lihat value di setiap Virtual Pin
4. Pastikan value update real-time sesuai sensor

### Dari Website:
1. Buka dashboard di browser
2. Buka Developer Console (F12)
3. Lihat console.log untuk API requests
4. Cek apakah data terima dengan benar

Contoh console output yang seharusnya muncul:
```
🔗 API Request: /get
✅ API Response: [0]
```

## 🔗 Blynk API Endpoints

Website menggunakan endpoint:
```
https://blynk.cloud/external/api/get?token=YOUR_TOKEN&pin=V0
```

Response format:
```json
[0]  // Untuk V0 (PIR status)
```

atau bisa langsung:
```json
"450"  // Untuk V1 (distance)
```

## 📝 Checklist

Sebelum deploy, pastikan:

- [ ] Arduino code sudah upload dengan Virtual Pins V0-V3
- [ ] Token sudah benar di `js/config.js`
- [ ] Website bisa akses Blynk API (test di browser)
- [ ] Virtual Pins show value di Blynk App
- [ ] Website test locally menampilkan data
- [ ] Activity log berfungsi saat deteksi terjadi

## 🆘 Debugging

Jika data tidak muncul di website:

### 1. Cek Blynk App
```
Project > Device > Lihat nilai di Virtual Pins
```
Jika tidak ada data, masalah di Arduino.

### 2. Cek API Request
```
Browser Console (F12) > lihat error messages
```

### 3. Test API Langsung
Buka di browser:
```
https://blynk.cloud/external/api/get?token=YOUR_TOKEN&pin=V0
```
Jika response `[value]`, API working.

### 4. Cek Token
```javascript
// Di console browser
fetch('https://blynk.cloud/external/api/get?token=RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs&pin=V0')
    .then(r => r.json())
    .then(data => console.log(data))
    .catch(e => console.error(e))
```

---

Referensi lengkap Virtual Pins Blynk:
https://docs.blynk.io/en/hardware-guides/generic-esp32
