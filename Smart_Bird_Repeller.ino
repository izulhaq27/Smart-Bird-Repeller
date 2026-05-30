#define BLYNK_TEMPLATE_ID "TMPL6DXnPF5AU"
#define BLYNK_TEMPLATE_NAME "Smart Bird Repeller"
#define BLYNK_AUTH_TOKEN "RLSj9w8sJJsbpWAa6v_ds5ndJSs1cPKs"

#include <WiFi.h>
#include <BlynkSimpleEsp32.h>

char ssid[] = "KERIS indihome";
char pass[] = "angetsari";

const int pinPIR = 14;      
const int pinTrig = 12;     
const int pinEcho = 13;     
const int pinBuzzer = 27;   
const int pinLED = 26;      

// Logika Filter: Objek harus di antara 5cm sampai 150cm (burung/hama)
const int batasMin = 5;
const int batasMax = 150; 

BlynkTimer timer;

void setup() {
  Serial.begin(115200);
  pinMode(pinPIR, INPUT);
  pinMode(pinTrig, OUTPUT);
  pinMode(pinEcho, INPUT);
  pinMode(pinBuzzer, OUTPUT);
  pinMode(pinLED, OUTPUT);
  
  Blynk.begin(BLYNK_AUTH_TOKEN, ssid, pass);
}

float bacaJarak() {
  digitalWrite(pinTrig, LOW);
  delayMicroseconds(2);
  digitalWrite(pinTrig, HIGH);
  delayMicroseconds(10);
  digitalWrite(pinTrig, LOW);
  long durasi = pulseIn(pinEcho, HIGH, 20000); // Timeout 20ms
  float jarak = durasi * 0.034 / 2;
  return (jarak == 0) ? 999 : jarak; // Jika gagal baca, kembalikan nilai jauh
}

void loop() {
  Blynk.run();
  
  // Logika Deteksi
  if (digitalRead(pinPIR) == HIGH) {
    float jarak = bacaJarak();
    
    // Logika Filter: Hanya bereaksi jika objek di jangkauan dekat
    if (jarak >= batasMin && jarak <= batasMax) {
      Serial.print("Hama terdeteksi! Jarak: ");
      Serial.print(jarak);
      Serial.println(" cm");

      // Notifikasi Blynk
      Blynk.logEvent("hama_terdeteksi", "Ada burung di jarak " + String(jarak) + "cm!");
      
      // Aktuasi
      digitalWrite(pinBuzzer, HIGH);
      digitalWrite(pinLED, HIGH);
      Blynk.virtualWrite(V2, 1);
      
      delay(3000); // Alarm menyala 3 detik
      
      digitalWrite(pinBuzzer, LOW);
      digitalWrite(pinLED, LOW);
      Blynk.virtualWrite(V2, 0);
    }
  }
}