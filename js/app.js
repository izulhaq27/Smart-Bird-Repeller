// ============================================
// SMART BIRD REPELLER DASHBOARD
// ============================================

// State aplikasi
const appState = {
    isOnline: false,
    lastUpdate: null,
    detectionCount: {
        today: 0,
        total: 0,
    },
    activityLog: [],
    autoRefreshInterval: null,
};

// ============================================
// INISIALISASI
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Smart Bird Repeller Dashboard Loading...');
    
    // Load data dari localStorage
    loadFromLocalStorage();
    
    // Refresh data pertama kali
    refreshData();
    
    // Auto-refresh setiap 5 detik
    startAutoRefresh();
    
    console.log('✅ Dashboard initialized');
});

// ============================================
// REFRESH DATA UTAMA
// ============================================

async function refreshData() {
    try {
        // Disable refresh button
        const refreshBtn = document.querySelector('#refreshIcon');
        refreshBtn?.classList.add('animate-spin');
        
        // Fetch data dari Blynk
        const onlineStatus = await blynkAPI.checkOnlineStatus();
        const pinData = await blynkAPI.getAllPins();
        
        // Update state
        appState.isOnline = onlineStatus;
        appState.lastUpdate = new Date();
        
        // Update UI
        updateDeviceStatus(onlineStatus);
        updateSensorData(pinData);
        updateActivityDisplay();
        updateLastUpdateTime();
        
        console.log('📊 Data synced:', { onlineStatus, pinData });
        
    } catch (error) {
        console.error('❌ Error refreshing data:', error);
    } finally {
        const refreshBtn = document.querySelector('#refreshIcon');
        refreshBtn?.classList.remove('animate-spin');
    }
}

// ============================================
// UPDATE DEVICE STATUS
// ============================================

function updateDeviceStatus(isOnline) {
    const statusBadge = document.getElementById('deviceStatus');
    const statusPulse = document.getElementById('statusPulse');
    const blynkStatus = document.getElementById('blynkStatus');
    
    if (isOnline) {
        statusBadge.className = 'status-badge status-online';
        statusBadge.innerHTML = '<i class="fas fa-check-circle"></i> Online';
        statusPulse.className = 'pulse-dot online';
        blynkStatus.textContent = '✓ Terhubung';
        blynkStatus.style.color = '#10b981';
    } else {
        statusBadge.className = 'status-badge status-offline';
        statusBadge.innerHTML = '<i class="fas fa-times-circle"></i> Offline';
        statusPulse.className = 'pulse-dot offline';
        blynkStatus.textContent = '✗ Terputus';
        blynkStatus.style.color = '#dc2626';
    }
}

// ============================================
// UPDATE SENSOR DATA
// ============================================

function updateSensorData(pinData) {
    // PIR Status
    if (pinData.pir !== null) {
        const pirValue = parseInt(pinData.pir) || 0;
        const pirStatus = pirValue === 1 ? 'Gerakan Terdeteksi ⚠️' : 'Tidak Ada Gerakan ✓';
        const pirColor = pirValue === 1 ? '#dc2626' : '#10b981';
        
        const pirEl = document.getElementById('pirStatus');
        pirEl.textContent = pirStatus;
        pirEl.style.color = pirColor;
        
        // Log deteksi jika ada gerakan baru
        if (pirValue === 1) {
            logDetectionEvent(pinData.distance);
        }
    }
    
    // Distance Sensor
    if (pinData.distance !== null) {
        const distance = parseFloat(pinData.distance) || 0;
        const distanceEl = document.getElementById('distanceValue');
        
        distanceEl.textContent = distance.toFixed(1);
        
        // Status jarak
        const threshold = LOCAL_CONFIG.distanceThreshold;
        const statusEl = document.getElementById('distanceStatus');
        let status = '';
        let color = '#10b981';
        
        if (distance > 0) {
            if (distance < threshold) {
                status = `⚠️ Dalam Jangkauan (< ${threshold} cm)`;
                color = '#dc2626';
            } else {
                status = `✓ Aman (> ${threshold} cm)`;
                color = '#10b981';
            }
        }
        
        statusEl.textContent = status;
        statusEl.style.color = color;
    }
}

// ============================================
// ACTIVITY LOG MANAGEMENT
// ============================================

function logDetectionEvent(distance) {
    // Cegah duplikat dalam 5 detik
    const lastEvent = appState.activityLog[0];
    const now = new Date();
    
    if (lastEvent) {
        const timeDiff = now - new Date(lastEvent.timestamp);
        if (timeDiff < 5000) return;
    }
    
    const event = {
        timestamp: now.toISOString(),
        event: 'hama_terdeteksi',
        description: 'Peringatan: Hama Burung Terdeteksi!',
        distance: distance ? parseFloat(distance).toFixed(0) : '-',
        severity: 'high',
        icon: '⚠️'
    };
    
    // Tambah ke log
    appState.activityLog.unshift(event);
    if (appState.activityLog.length > 50) {
        appState.activityLog.pop();
    }
    
    // Update statistik
    appState.detectionCount.today++;
    appState.detectionCount.total++;
    
    // Simpan ke localStorage
    saveToLocalStorage();
}

function updateActivityDisplay() {
    const logContainer = document.getElementById('activityLog');
    
    if (!appState.activityLog || appState.activityLog.length === 0) {
        logContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <i class="fas fa-inbox text-4xl mb-3 opacity-30"></i>
                <p>Tidak ada aktivitas terdeteksi</p>
                <p class="text-sm mt-1">Log aktivitas akan muncul saat hama terdeteksi</p>
            </div>
        `;
        return;
    }
    
    logContainer.innerHTML = '';
    
    // Tampilkan 10 event terbaru
    appState.activityLog.slice(0, 10).forEach(event => {
        const activityEl = createActivityElement(event);
        logContainer.appendChild(activityEl);
    });
    
    // Update statistik
    updateStatistics();
}

function createActivityElement(event) {
    const div = document.createElement('div');
    div.className = 'activity-item bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition';
    
    const timestamp = new Date(event.timestamp);
    const timeText = getTimeAgo(event.timestamp);
    const fullTime = formatTime(timestamp);
    
    const distanceText = event.distance && event.distance !== '-' ? ` (Jarak: ${event.distance} cm)` : '';
    
    div.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex gap-3 flex-1">
                <div class="text-2xl mt-1">${event.icon}</div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-800">${event.description}${distanceText}</p>
                    <p class="text-xs text-gray-500 mt-1">
                        <span class="font-mono">${fullTime}</span>
                        <span class="text-gray-400 ml-2">${timeText}</span>
                    </p>
                </div>
            </div>
        </div>
    `;
    
    return div;
}

// ============================================
// UPDATE STATISTIK
// ============================================

function updateStatistics() {
    document.getElementById('detectionToday').textContent = appState.detectionCount.today;
    document.getElementById('detectionTotal').textContent = appState.detectionCount.total;
}

// ============================================
// UPDATE WAKTU
// ============================================

function updateLastUpdateTime() {
    if (appState.lastUpdate) {
        const time = appState.lastUpdate.toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        document.getElementById('lastUpdate').textContent = `Terakhir diperbarui: ${time}`;
    }
}

// ============================================
// AUTO REFRESH
// ============================================

function startAutoRefresh() {
    // Clear existing interval jika ada
    if (appState.autoRefreshInterval) {
        clearInterval(appState.autoRefreshInterval);
    }
    
    // Set interval baru
    appState.autoRefreshInterval = setInterval(() => {
        refreshData();
    }, BLYNK_CONFIG.refreshInterval);
    
    console.log(`✓ Auto-refresh started (interval: ${BLYNK_CONFIG.refreshInterval}ms)`);
}

// ============================================
// LOCAL STORAGE
// ============================================

function saveToLocalStorage() {
    try {
        const data = {
            log: appState.activityLog,
            counts: appState.detectionCount,
            lastSaved: new Date().toISOString()
        };
        localStorage.setItem('smartBirdRepeller', JSON.stringify(data));
    } catch (error) {
        console.warn('⚠️ Error saving to localStorage:', error);
    }
}

function loadFromLocalStorage() {
    try {
        const stored = localStorage.getItem('smartBirdRepeller');
        if (stored) {
            const data = JSON.parse(stored);
            appState.activityLog = data.log || [];
            appState.detectionCount = data.counts || { today: 0, total: 0 };
            console.log('✓ Data loaded from localStorage');
        }
    } catch (error) {
        console.warn('⚠️ Error loading from localStorage:', error);
    }
}

// ============================================
// CLEANUP
// ============================================

window.addEventListener('beforeunload', () => {
    if (appState.autoRefreshInterval) {
        clearInterval(appState.autoRefreshInterval);
    }
    saveToLocalStorage();
});
