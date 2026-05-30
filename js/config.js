// ============================================
// KONFIGURASI BLYNK API
// ============================================

const BLYNK_CONFIG = {
    // GANTI DENGAN TOKEN ANDA!
    authToken: 'RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs',
    
    // Server Blynk Cloud
    server: 'https://blynk.cloud',
    
    // API endpoint untuk data
    apiUrl: 'https://blynk.cloud/external/api',
    
    // Virtual Pins sesuai Arduino code
    pins: {
        pir: 'V0',           // Status PIR (0 atau 1)
        distance: 'V1',      // Jarak ultrasonik (cm)
        buzzer: 'V2',        // Status buzzer
        led: 'V3',           // Status LED
    },
    
    // Interval refresh (milliseconds)
    refreshInterval: 5000,  // 5 detik
};

// ============================================
// KONFIGURASI LOKAL
// ============================================

const LOCAL_CONFIG = {
    deviceName: 'Smart Bird Repeller',
    description: 'Sistem Pengusir Burung Berbasis IoT ESP32',
    location: 'Lahan Pertanian',
    distanceThreshold: 500,  // cm
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format waktu ke format lokal Indonesia
 */
function formatTime(date) {
    if (!date) date = new Date();
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
}

/**
 * Hitung berapa lama waktu lalu
 */
function getTimeAgo(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diff = Math.floor((now - then) / 1000);
    
    if (diff < 60) return `${diff} detik lalu`;
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    return `${Math.floor(diff / 86400)} hari lalu`;
}
