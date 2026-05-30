// API Wrapper untuk Blynk Cloud
class BlynkAPI {
    constructor(config) {
        this.token = config.authToken;
        this.baseUrl = config.serverUrl;
    }

    /**
     * Membaca status/nilai dari Virtual Pin
     * @param {string} pin - Virtual pin (misal: 'V0')
     * @returns {Promise<string|null>} - Nilai dari pin
     */
    async getPinValue(pin) {
        try {
            const url = `${this.baseUrl}/get?token=${this.token}&${pin}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            // Blynk API return format bisa array seperti ["1"]
            const data = await response.json();
            
            if (Array.isArray(data) && data.length > 0) {
                return data[0];
            }
            return data;
            
        } catch (error) {
            console.error(`Gagal membaca pin ${pin}:`, error);
            return null;
        }
    }

    /**
     * Mengecek apakah device sedang online
     * @returns {Promise<boolean>} - Status online device
     */
    async isDeviceOnline() {
        try {
            const url = `${this.baseUrl}/isHardwareConnected?token=${this.token}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                return false;
            }
            
            const data = await response.json();
            return data === true;
        } catch (error) {
            console.error('Gagal mengecek status device:', error);
            return false;
        }
    }
}
