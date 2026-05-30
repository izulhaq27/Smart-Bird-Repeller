// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi API
    const blynkApi = new BlynkAPI(BLYNK_CONFIG);
    
    // UI Elements
    const elements = {
        statusDot: document.getElementById('status-dot'),
        statusPing: document.getElementById('status-ping'),
        deviceStatus: document.getElementById('device-status'),
        
        pirValue: document.getElementById('pir-value'),
        pirDesc: document.getElementById('pir-desc'),
        
        distanceValue: document.getElementById('distance-value'),
        
        buzzerValue: document.getElementById('buzzer-value'),
        buzzerDesc: document.getElementById('buzzer-desc'),
        
        ledValue: document.getElementById('led-value'),
        ledDesc: document.getElementById('led-desc'),
        
        activityList: document.getElementById('activity-list'),
        emptyLogMsg: document.getElementById('empty-log-msg'),
        clearLogBtn: document.getElementById('clear-log')
    };

    // Activity Log State
    let activityLogs = JSON.parse(localStorage.getItem('birdRepellerLogs')) || [];
    let lastDetectionTime = 0;

    // Initialize Logs UI
    renderLogs();

    /**
     * Update status device (Online/Offline)
     */
    async function updateDeviceStatus() {
        const isOnline = await blynkApi.isDeviceOnline();
        
        if (isOnline) {
            elements.deviceStatus.textContent = 'Device Online';
            elements.deviceStatus.className = 'font-medium text-green-400';
            elements.statusDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-green-500';
            elements.statusPing.classList.remove('hidden');
        } else {
            elements.deviceStatus.textContent = 'Device Offline';
            elements.deviceStatus.className = 'font-medium text-red-400';
            elements.statusDot.className = 'relative inline-flex rounded-full h-3 w-3 bg-red-500';
            elements.statusPing.classList.add('hidden');
        }
    }

    /**
     * Fetch all sensor data
     */
    async function fetchSensorData() {
        try {
            // Fetch all pins concurrently
            const [pir, distance, buzzer, led] = await Promise.all([
                blynkApi.getPinValue(BLYNK_CONFIG.pins.pir),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.distance),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.buzzer),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.led)
            ]);

            updateUI(pir, distance, buzzer, led);
            checkAndLogActivity(pir, distance);
            
        } catch (error) {
            console.error('Error fetching sensor data:', error);
        }
    }

    /**
     * Update Dashboard UI
     */
    function updateUI(pir, distance, buzzer, led) {
        // PIR Status
        if (pir == '1') {
            elements.pirValue.textContent = 'TERDETEKSI';
            elements.pirValue.className = 'text-3xl font-bold mb-1 text-red-400';
            elements.pirDesc.textContent = 'Ada pergerakan!';
            elements.pirDesc.className = 'text-sm text-red-400';
        } else {
            elements.pirValue.textContent = 'Aman';
            elements.pirValue.className = 'text-3xl font-bold mb-1 text-green-400';
            elements.pirDesc.textContent = 'Tidak ada pergerakan';
            elements.pirDesc.className = 'text-sm text-green-400';
        }

        // Distance
        const distValue = parseFloat(distance);
        if (!isNaN(distValue)) {
            elements.distanceValue.textContent = distValue.toFixed(1);
            if (distValue < 500 && pir == '1') {
                elements.distanceValue.classList.add('text-red-400');
            } else {
                elements.distanceValue.classList.remove('text-red-400');
            }
        } else {
            elements.distanceValue.textContent = '--';
        }

        // Buzzer Status
        if (buzzer == '1') {
            elements.buzzerValue.textContent = 'ON';
            elements.buzzerValue.className = 'text-3xl font-bold mb-1 text-red-400 animate-pulse';
            elements.buzzerDesc.textContent = 'Alarm berbunyi';
        } else {
            elements.buzzerValue.textContent = 'OFF';
            elements.buzzerValue.className = 'text-3xl font-bold mb-1';
            elements.buzzerDesc.textContent = 'Alarm diam';
        }

        // LED Status
        if (led == '1') {
            elements.ledValue.textContent = 'ON';
            elements.ledValue.className = 'text-3xl font-bold mb-1 text-yellow-400 animate-pulse';
            elements.ledDesc.textContent = 'Lampu menyala';
        } else {
            elements.ledValue.textContent = 'OFF';
            elements.ledValue.className = 'text-3xl font-bold mb-1';
            elements.ledDesc.textContent = 'Lampu mati';
        }
    }

    /**
     * Logic to detect and log activity locally
     */
    function checkAndLogActivity(pir, distance) {
        // Jika PIR mendeteksi (1) dan jarak masuk akal (< 500cm)
        if (pir == '1' && distance && parseFloat(distance) < 500) {
            const now = Date.now();
            // Prevent spam log (hanya log tiap 10 detik minimal)
            if (now - lastDetectionTime > 10000) {
                addLogEntry(distance);
                lastDetectionTime = now;
            }
        }
    }

    /**
     * Add log to array and LocalStorage
     */
    function addLogEntry(distance) {
        const date = new Date();
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
        
        const log = {
            id: Date.now(),
            time: `${dateStr} ${timeStr}`,
            distance: parseFloat(distance).toFixed(1)
        };

        activityLogs.unshift(log); // Add to beginning
        
        // Keep only last 50 logs
        if (activityLogs.length > 50) {
            activityLogs.pop();
        }

        localStorage.setItem('birdRepellerLogs', JSON.stringify(activityLogs));
        renderLogs();
    }

    /**
     * Render logs to UI
     */
    function renderLogs() {
        elements.activityList.innerHTML = '';
        
        if (activityLogs.length === 0) {
            if(elements.emptyLogMsg) elements.activityList.appendChild(elements.emptyLogMsg);
            return;
        }

        activityLogs.forEach(log => {
            const li = document.createElement('li');
            li.className = 'bg-gray-800/50 p-4 rounded-xl border border-gray-700/50 flex justify-between items-center log-item-enter';
            
            li.innerHTML = `
                <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-red-400/10 text-red-400 flex items-center justify-center">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <p class="font-medium text-red-400">Hama Terdeteksi</p>
                        <p class="text-xs text-gray-400"><i class="fa-regular fa-clock mr-1"></i> ${log.time}</p>
                    </div>
                </div>
                <div class="text-right">
                    <p class="font-bold">${log.distance} cm</p>
                </div>
            `;
            elements.activityList.appendChild(li);
        });
    }

    // Clear Logs Event
    elements.clearLogBtn.addEventListener('click', () => {
        if (confirm('Apakah Anda yakin ingin menghapus semua log aktivitas?')) {
            activityLogs = [];
            localStorage.removeItem('birdRepellerLogs');
            renderLogs();
            
            // Re-add empty message
            elements.activityList.innerHTML = '<li class="text-center text-gray-500 italic py-4" id="empty-log-msg">Belum ada aktivitas tercatat</li>';
            elements.emptyLogMsg = document.getElementById('empty-log-msg');
        }
    });

    // Start fetching cycle
    async function startApp() {
        // Initial fetch
        await updateDeviceStatus();
        await fetchSensorData();

        // Setup intervals
        setInterval(updateDeviceStatus, 10000); // Check online status every 10s
        setInterval(fetchSensorData, BLYNK_CONFIG.refreshInterval); // Fetch data every X ms
    }

    startApp();
});
