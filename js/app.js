// Main Application Logic
document.addEventListener('DOMContentLoaded', () => {
    const blynkApi = new BlynkAPI(BLYNK_CONFIG);

    // UI Elements
    const el = {
        statusBadge:    document.getElementById('status-badge'),
        deviceStatus:   document.getElementById('device-status'),
        lastUpdateTime: document.getElementById('last-update-time'),
        refreshIcon:    document.getElementById('refresh-icon'),

        pirValue:  document.getElementById('pir-value'),
        pirDesc:   document.getElementById('pir-desc'),
        pirBadge:  document.getElementById('pir-badge'),
        cardPir:   document.getElementById('card-pir'),

        distanceValue: document.getElementById('distance-value'),
        cardDistance:  document.getElementById('card-distance'),

        buzzerValue: document.getElementById('buzzer-value'),
        buzzerDesc:  document.getElementById('buzzer-desc'),
        cardBuzzer:  document.getElementById('card-buzzer'),

        ledValue:  document.getElementById('led-value'),
        ledDesc:   document.getElementById('led-desc'),
        cardLed:   document.getElementById('card-led'),

        activityList: document.getElementById('activity-list'),
        logCount:     document.getElementById('log-count'),
        clearLogBtn:  document.getElementById('clear-log'),
    };

    // State
    let activityLogs = JSON.parse(localStorage.getItem('birdRepellerLogs')) || [];
    let lastDetectionTime = 0;

    renderLogs();

    // ===== DEVICE STATUS =====
    async function updateDeviceStatus() {
        const isOnline = await blynkApi.isDeviceOnline();

        el.statusBadge.className = 'status-badge ' + (isOnline ? 'online' : 'offline');
        el.deviceStatus.textContent = isOnline ? 'Device Online' : 'Device Offline';
    }

    // ===== FETCH SENSOR DATA =====
    async function fetchSensorData() {
        // Spin icon saat loading
        el.refreshIcon.style.animationDuration = '0.6s';

        try {
            const [pir, distance, buzzer, led] = await Promise.all([
                blynkApi.getPinValue(BLYNK_CONFIG.pins.pir),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.distance),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.buzzer),
                blynkApi.getPinValue(BLYNK_CONFIG.pins.led),
            ]);

            updateUI(pir, distance, buzzer, led);
            checkAndLogActivity(pir, distance, buzzer);

        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            el.refreshIcon.style.animationDuration = '2s';
            const now = new Date();
            el.lastUpdateTime.textContent = now.toLocaleTimeString('id-ID', {
                hour: '2-digit', minute: '2-digit', second: '2-digit'
            });
        }
    }

    // ===== UPDATE UI =====
    function updateUI(pir, distance, buzzer, led) {
        // --- PIR ---
        if (pir == '1') {
            el.pirValue.textContent = 'GERAK!';
            el.pirValue.style.color = 'var(--pink)';
            el.pirDesc.textContent  = 'Pergerakan terdeteksi!';
            el.pirBadge.textContent = 'ALERT';
            el.pirBadge.className   = 'card-badge card-badge--alert';
            el.cardPir.classList.add('alert');
        } else {
            el.pirValue.textContent = 'AMAN';
            el.pirValue.style.color = 'var(--green)';
            el.pirDesc.textContent  = 'Tidak ada pergerakan';
            el.pirBadge.textContent = 'PIR';
            el.pirBadge.className   = 'card-badge card-badge--ok';
            el.cardPir.classList.remove('alert');
        }

        // --- Distance ---
        const d = parseFloat(distance);
        if (!isNaN(d) && d > 0) {
            el.distanceValue.textContent = d.toFixed(1);
            // Dynamic check: depend on Buzzer state from Arduino instead of hardcoded limits
            if (buzzer == '1') {
                el.distanceValue.style.color = 'var(--pink)';
                el.cardDistance.classList.add('alert');
            } else {
                el.distanceValue.style.color = 'var(--purple)';
                el.cardDistance.classList.remove('alert');
            }
        } else {
            el.distanceValue.textContent = '--';
            el.distanceValue.style.color = 'var(--text-muted)';
        }

        // --- Buzzer ---
        if (buzzer == '1') {
            el.buzzerValue.textContent = 'ON';
            el.buzzerValue.style.color = 'var(--pink)';
            el.buzzerDesc.textContent  = 'Alarm sedang berbunyi!';
            el.cardBuzzer.classList.add('active');
            el.cardBuzzer.classList.remove('active-glow');
        } else {
            el.buzzerValue.textContent = 'OFF';
            el.buzzerValue.style.color = 'var(--text-secondary)';
            el.buzzerDesc.textContent  = 'Alarm tidak aktif';
            el.cardBuzzer.classList.remove('active');
        }

        // --- LED ---
        if (led == '1') {
            el.ledValue.textContent = 'ON';
            el.ledValue.style.color = 'var(--yellow)';
            el.ledDesc.textContent  = 'Lampu indikator menyala!';
            el.cardLed.classList.add('active');
        } else {
            el.ledValue.textContent = 'OFF';
            el.ledValue.style.color = 'var(--text-secondary)';
            el.ledDesc.textContent  = 'Lampu indikator mati';
            el.cardLed.classList.remove('active');
        }
    }

    // ===== CHECK & LOG ACTIVITY =====
    function checkAndLogActivity(pir, distance, buzzer) {
        if (buzzer == '1' && distance && parseFloat(distance) > 0) {
            const now = Date.now();
            // Ubah cooldown dari 10 detik (10000) menjadi 3 detik (3000) agar log lebih cepat muncul
            if (now - lastDetectionTime > 3000) {
                addLogEntry(distance);
                lastDetectionTime = now;
            }
        }
    }

    // ===== ADD LOG =====
    function addLogEntry(distance) {
        const date    = new Date();
        const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const dateStr = date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

        activityLogs.unshift({
            id: Date.now(),
            time: `${dateStr}, ${timeStr}`,
            distance: parseFloat(distance).toFixed(1),
        });

        if (activityLogs.length > 50) activityLogs.pop();
        localStorage.setItem('birdRepellerLogs', JSON.stringify(activityLogs));
        renderLogs();
    }

    // ===== RENDER LOGS =====
    function renderLogs() {
        el.activityList.innerHTML = '';
        el.logCount.textContent = activityLogs.length;

        if (activityLogs.length === 0) {
            el.activityList.innerHTML = `
                <li class="log-empty" id="empty-log-msg">
                    <i class="fa-regular fa-clock fa-2x"></i>
                    <p>Belum ada aktivitas tercatat</p>
                </li>`;
            return;
        }

        activityLogs.forEach(log => {
            const li = document.createElement('li');
            li.className = 'log-item';
            li.innerHTML = `
                <div class="log-item-left">
                    <div class="log-item-icon">
                        <i class="fa-solid fa-triangle-exclamation"></i>
                    </div>
                    <div>
                        <p class="log-item-label">Hama Terdeteksi</p>
                        <p class="log-item-time"><i class="fa-regular fa-clock" style="margin-right:4px"></i>${log.time}</p>
                    </div>
                </div>
                <div class="log-item-dist">
                    <span class="val">${log.distance}</span>
                    <span class="unit"> cm</span>
                </div>`;
            el.activityList.appendChild(li);
        });
    }

    // ===== CLEAR LOG =====
    el.clearLogBtn.addEventListener('click', () => {
        if (confirm('Hapus semua log aktivitas?')) {
            activityLogs = [];
            localStorage.removeItem('birdRepellerLogs');
            renderLogs();
        }
    });

    // ===== START =====
    async function startApp() {
        await updateDeviceStatus();
        await fetchSensorData();

        setInterval(updateDeviceStatus, 10000);
        setInterval(fetchSensorData, BLYNK_CONFIG.refreshInterval);
    }

    startApp();
});
