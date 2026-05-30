// ============================================
// BLYNK API WRAPPER
// ============================================

class BlynkAPI {
    constructor(config) {
        this.config = config;
        this.lastError = null;
        this.isOnline = false;
    }

    /**
     * Buat GET request ke Blynk API
     */
    async request(endpoint, params = {}) {
        try {
            // Build URL dengan token dan params
            let url = `${this.config.apiUrl}${endpoint}?token=${this.config.authToken}`;
            
            // Tambahkan parameter lainnya
            Object.keys(params).forEach(key => {
                url += `&${key}=${encodeURIComponent(params[key])}`;
            });

            console.log('🔗 API Request:', url.substring(0, 50) + '...');

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Response:', data);
            this.lastError = null;
            return data;

        } catch (error) {
            console.error('❌ API Error:', error);
            this.lastError = error.message;
            return null;
        }
    }

    /**
     * Dapatkan nilai dari Virtual Pin
     */
    async getPin(pinName) {
        try {
            const data = await this.request(`/get`, {
                pin: pinName
            });
            
            if (data && Array.isArray(data)) {
                return data.length > 0 ? data[0] : null;
            }
            return data;
            
        } catch (error) {
            console.error(`Error getting pin ${pinName}:`, error);
            return null;
        }
    }

    /**
     * Dapatkan semua Virtual Pins
     */
    async getAllPins() {
        const pins = this.config.pins;
        const results = {};

        for (const [key, pin] of Object.entries(pins)) {
            const value = await this.getPin(pin);
            results[key] = value;
        }

        return results;
    }

    /**
     * Cek apakah perangkat online dengan mencoba akses API
     */
    async checkOnlineStatus() {
        try {
            const response = await fetch(
                `${this.config.apiUrl}/get?token=${this.config.authToken}&pin=${this.config.pins.pir}`,
                { method: 'GET' }
            );
            
            this.isOnline = response.ok;
            return this.isOnline;
            
        } catch (error) {
            this.isOnline = false;
            return false;
        }
    }
}

// ============================================
// INSTANCE API
// ============================================

const blynkAPI = new BlynkAPI(BLYNK_CONFIG);

// ============================================
// DATA SIMULASI (untuk development/testing)
// ============================================

function generateMockEvents() {
    const now = new Date();
    return [
        {
            timestamp: new Date(now - 5 * 60000).toISOString(),
            event: 'hama_terdeteksi',
            description: 'Peringatan: Hama Burung Terdeteksi!',
            distance: 450,
            severity: 'high',
            icon: '⚠️'
        },
        {
            timestamp: new Date(now - 30 * 60000).toISOString(),
            event: 'hama_terdeteksi',
            description: 'Peringatan: Hama Burung Terdeteksi!',
            distance: 380,
            severity: 'high',
            icon: '⚠️'
        },
        {
            timestamp: new Date(now - 2 * 3600000).toISOString(),
            event: 'device_online',
            description: 'Perangkat ESP32 Terhubung ke Blynk',
            severity: 'info',
            icon: '✓'
        }
    ];
}
