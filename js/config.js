// Konfigurasi Blynk API
const BLYNK_CONFIG = {
    // Gunakan token dari Arduino Code
    authToken: 'RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs',
    
    // Gunakan URL API Server Blynk (Bisa diganti jika menggunakan server lokal atau region khusus)
    // Server default biasanya 'blynk.cloud' atau 'sgp1.blynk.cloud'
    serverUrl: 'https://blynk.cloud/external/api',
    
    // Interval refresh data dalam milidetik (misal: 2000 = 2 detik)
    refreshInterval: 2000,
    
    // Mapping Virtual Pins (sesuai README)
    pins: {
        pir: 'V0',
        distance: 'V1',
        buzzer: 'V2',
        led: 'V3'
    }
};
