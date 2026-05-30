// ============================================
// SMART BIRD REPELLER - ESP32 CODE
// FIXED VERSION dengan Virtual Pins untuk Website
// ============================================

#define BLYNK_TEMPLATE_ID "TMPL6DXnPF5AU"
#define BLYNK_TEMPLATE_NAME "Smart Bird Repeller"
#define BLYNK_AUTH_TOKEN "RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs"

#define BLYNK_PRINT Serial  // Debug prints

#include <WiFi.h>
#include <WiFiClient.h>
#include <BlynkSimpleEsp32.h>

// ============================================
// KONFIGURASI WIFI
// ============================================
char ssid[] = "KERIS indihome";
char pass[] = "angetsari";

// ============================================
// PIN HARDWARE
// ============================================
const int pinPIR = 14;      
const int pinTrig = 12;     
const int pinEcho = 13;     
const int pinBuzzer = 27;   
const int pinLED = 26;      

const int batasJarak = 500; 

// ============================================
// VARIABEL STATE
// ============================================
unsigned long lastDetectionTime = 0;
int currentPIRState = LOW;
int currentDistance = 0;
int buzzerActive = 0;
int ledActive = 0;

// ============================================
// SETUP
// ============================================
void setup() {
  Serial.begin(115200);
  delay(100);
  
  Serial.println("\n\n");
  Serial.println("════════════════════════════════════════");
  Serial.println("   SMART BIRD REPELLER - ESP32");
  Serial.println("   Initializing...");
  Serial.println("════════════════════════════════════════");
  
  // Setup pins
  pinMode(pinPIR, INPUT);
  pinMode(pinTrig, OUTPUT);
  pinMode(pinEcho, INPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinLED, OUTPUT);
  
  // Initial state
  digitalWrite(pinTrig, LOW);
  digitalWrite(pinBuzzer, LOW);
  digitalWrite(pinLED, LOW);
  
  Serial.println("✓ Pins configured");
  
  // Connect Blynk
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
  
  Serial.println("✓ System initialized");
  printSystemInfo();
}

// ============================================
// MAIN LOOP
// ============================================
void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    Blynk.run();
  }
  
  // Read sensors
  currentPIRState = digitalRead(pinPIR);
  currentDistance = (int)bacaJarak();
  
  // Check detection
  checkDetection();
  
  delay(100);
}

// ============================================
// BLYNK CONNECTION HANDLER
// ============================================

BLYNK_CONNECTED() {
  Serial.println("\n✓ Blynk connected!");
}

// ============================================
// VIRTUAL PINS - PENTING UNTUK WEBSITE!
// ============================================

/**
 * V0 - PIR Status (0 = no motion, 1 = motion detected)
 * Website membaca ini untuk status gerakan
 */
BLYNK_READ(V0) {
  int pirValue = digitalRead(pinPIR);
  Blynk.virtualWrite(V0, pirValue);
  Serial.print("📡 V0 (PIR): ");
  Serial.println(pirValue);
}

/**
 * V1 - Distance (dalam cm)
 * Website membaca ini untuk jarak ultrasonik
 */
BLYNK_READ(V1) {
  int distance = (int)bacaJarak();
  Blynk.virtualWrite(V1, distance);
  Serial.print("📡 V1 (Distance): ");
  Serial.print(distance);
  Serial.println(" cm");
}

/**
 * V2 - Buzzer Status (0 = off, 1 = on)
 * Website membaca ini untuk status buzzer
 */
BLYNK_READ(V2) {
  int buzzer = digitalRead(pinBuzzer);
  Blynk.virtualWrite(V2, buzzer);
  Serial.print("📡 V2 (Buzzer): ");
  Serial.println(buzzer);
}

/**
 * V3 - LED Status (0 = off, 1 = on)
 * Website membaca ini untuk status LED
 */
BLYNK_READ(V3) {
  int led = digitalRead(pinLED);
  Blynk.virtualWrite(V3, led);
  Serial.print("📡 V3 (LED): ");
  Serial.println(led);
}

// ============================================
// SENSOR FUNCTIONS
// ============================================

/**
 * Baca jarak ultrasonik (cm)
 */
float bacaJarak() {
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);
  
  long durasi = pulseIn(pinEcho, HIGH, 30000);
  float jarak = durasi * 0.034 / 2;
  
  return jarak;
}

/**
 * Check deteksi hama
 */
void checkDetection() {
  if (digitalRead(pinPIR) == HIGH) {
    float jarak = bacaJarak();
    
    if (jarak > 0 && jarak < batasJarak) {
      // Cegah event spam
      unsigned long currentTime = millis();
      if (currentTime - lastDetectionTime > 10000) {  // Minimum 10 detik
        triggerDetection(jarak);
        lastDetectionTime = currentTime;
      }
    }
  }
}

/**
 * Trigger deteksi hama
 */
void triggerDetection(float distance) {
  Serial.println("\n🚨 HAMA TERDETEKSI!");
  Serial.print("   Jarak: ");
  Serial.print(distance);
  Serial.println(" cm");
  
  // Notifikasi ke Blynk App
  Blynk.logEvent("hama_terdeteksi", "Peringatan: Hama Burung Terdeteksi!");
  
  // Aktifkan buzzer & LED
  digitalWrite(pinBuzzer, HIGH);
  digitalWrite(pinLED, HIGH);
  buzzerActive = 1;
  ledActive = 1;
  
  delay(3000);
  
  // Matikan
  digitalWrite(pinBuzzer, LOW);
  digitalWrite(pinLED, LOW);
  buzzerActive = 0;
  ledActive = 0;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Print system info
 */
void printSystemInfo() {
  Serial.println("\n════════════════════════════════════════");
  Serial.println("   SYSTEM INFORMATION");
  Serial.println("════════════════════════════════════════");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
  Serial.print("WiFi Signal: ");
  Serial.print(WiFi.RSSI());
  Serial.println(" dBm");
  Serial.println("════════════════════════════════════════");
  Serial.println("VIRTUAL PINS CONFIGURATION:");
  Serial.println("V0 = PIR Status (0/1)");
  Serial.println("V1 = Distance (cm)");
  Serial.println("V2 = Buzzer Status (0/1)");
  Serial.println("V3 = LED Status (0/1)");
  Serial.println("════════════════════════════════════════");
  Serial.println("HARDWARE PINS:");
  Serial.println("PIR: GPIO14 | Trigger: GPIO12");
  Serial.println("Echo: GPIO13 | Buzzer: GPIO27");
  Serial.println("LED: GPIO26");
  Serial.println("════════════════════════════════════════");
  Serial.println("Distance Threshold: 500 cm");
  Serial.println("Status: ✓ Ready");
  Serial.println("════════════════════════════════════════\n");
}
