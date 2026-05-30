#define BLYNK_TEMPLATE_ID "TMPL6DXnPF5AU"
#define BLYNK_TEMPLATE_NAME "Smart Bird Repeller"
#define BLYNK_AUTH_TOKEN "RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "TIDAK ADA KONEKSI";
char pass[] = "11223344";

const int pinPIR = 14;      
const int pinTrig = 12;     
const int pinEcho = 13;     
const int pinBuzzer = 27;   
const int pinLED = 26;      

// Konfigurasi Zona (dalam cm)
const int zonaHamaMin = 5;
const int zonaHamaMax = 60; // Disesuaikan agar orang lewat tidak terdeteksi

bool isAlarmActive = false;
unsigned long alarmStartTime = 0;

void setup() {
  Serial.begin(115200);
  pinMode(pinPIR, INPUT);
  pinMode(pinTrig, OUTPUT);
  pinMode(pinEcho, INPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinLED, OUTPUT);
  
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
}

float getDistance() {
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);
  
  // Timeout 60000us untuk jangkauan hingga ~1000cm
  long durasi = pulseIn(pinEcho, HIGH, 60000); 
  float jarak = durasi * 0.034 / 2;
  
  // LOGIKA BARU: Jika hasil 0 atau lebih dari 1000cm (sesuai Datastream V1), anggap tidak ada objek (kembalikan 0)
  if (jarak == 0 || jarak > 1000) { 
    return 0; 
  }
  
  return jarak;
}

void loop() {
  Blynk.run();

  // DEBUG: Cek status PIR setiap saat
  int statusPIR = digitalRead(pinPIR);
  Blynk.virtualWrite(V0, statusPIR); // Send PIR status to Blynk

  Serial.print("Status PIR: ");
  Serial.println(statusPIR); // Akan muncul 0 atau 1 terus menerus

  if (statusPIR == HIGH) {
    float jarak = getDistance();
    Blynk.virtualWrite(V1, jarak); // Send Distance to Blynk
    
    // DEBUG: Tampilkan jarak ke serial monitor
    Serial.print("Gerakan terdeteksi! Jarak objek: ");
    Serial.println(jarak); 

    if (jarak >= zonaHamaMin && jarak <= zonaHamaMax && !isAlarmActive) {
      Serial.println("!!! HAMA TERDETEKSI !!!");
      Blynk.logEvent("hama_terdeteksi", "Hama terdeteksi di " + String(jarak) + "cm!");
      
      digitalWrite(pinBuzzer, HIGH);
      digitalWrite(pinLED, HIGH);
      Blynk.virtualWrite(V2, 1);
      Blynk.virtualWrite(V3, 1); // Send LED status to Blynk
      
      isAlarmActive = true;
      alarmStartTime = millis();
    }
  } else {
    // Optional: Reset distance on UI if no movement detected
    Blynk.virtualWrite(V1, 0); 
  }

  // Timer Non-Blocking untuk mematikan alarm
  if (isAlarmActive && (millis() - alarmStartTime >= 3000)) {
    digitalWrite(pinBuzzer, LOW);
    digitalWrite(pinLED, LOW);
    Blynk.virtualWrite(V2, 0);
    Blynk.virtualWrite(V3, 0); // Reset LED status on Blynk
    isAlarmActive = false;
  }
  
  delay(500); // Tambahkan delay kecil agar Serial Monitor tidak nge-lag
}