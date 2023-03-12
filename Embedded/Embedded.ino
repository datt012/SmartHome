#include "DHT.h"
#include <WiFi.h>
extern "C" {
  #include "freertos/FreeRTOS.h"
  #include "freertos/timers.h"
}
#include <AsyncMqttClient.h>
#include <ArduinoJson.h>

#define WIFI_SSID "Thu Trang"
#define WIFI_PASSWORD "thutrang1998"

// Raspberry Pi Mosquitto MQTT Broker
// #define MQTT_HOST "cougar.rmq.cloudamqp.com"
// armadillo.rmq.cloudamqp.com
#define MQTT_HOST "armadillo.rmq.cloudamqp.com"

// For a cloud MQTT broker, type the domain name
//#define MQTT_HOST "example.com"
#define MQTT_PORT 1883

// Temperature MQTT Topics
// #define MQTT_PUB_TEMP "6215de342aa1ab04d8b8e37d/sensors/6215de482aa1ab04d8b8e380"
#define MQTT_PUB_TEMP "640d4c75a2b2ba23e07ecb4e/sensors/640dbdd7a9e8e10e90f5e1e3"


// Digital pin connected to the DHT sensor
#define DHTPIN 25
#ifndef LED_1
#define LED_1 13
#endif
#ifndef LED_2
#define LED_2 12
#endif
// Uncomment whatever DHT sensor type you're using
#define DHTTYPE DHT11   // DHT 11
//#define DHTTYPE DHT22   // DHT 22  (AM2302), AM2321
//#define DHTTYPE DHT21   // DHT 21 (AM2301)

// Initialize DHT sensor
DHT dht(DHTPIN, DHTTYPE);

// Variables to hold sensor readings
float temp;
float hum;

AsyncMqttClient mqttClient;
TimerHandle_t mqttReconnectTimer;
TimerHandle_t wifiReconnectTimer;

unsigned long previousMillis = 0;   // Stores last time temperature was published
const long interval = 10000;        // Interval at which to publish sensor readings

void connectToWifi() {
    Serial.println("Connecting to Wi-Fi...");
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
}

void connectToMqtt() {
    Serial.println("Connecting to MQTT...");
    mqttClient.connect();
}

void WiFiEvent(WiFiEvent_t event) {
    Serial.printf("[WiFi-event] event: %d\n", event);
    switch (event) {
        case SYSTEM_EVENT_STA_GOT_IP:
            Serial.println("WiFi connected");
            Serial.println("IP address: ");
            Serial.println(WiFi.localIP());
            connectToMqtt();
            break;
        case SYSTEM_EVENT_STA_DISCONNECTED:
            Serial.println("WiFi lost connection");
            xTimerStop(mqttReconnectTimer, 0); // ensure we don't reconnect to MQTT while reconnecting to Wi-Fi
            xTimerStart(wifiReconnectTimer, 0);
            break;
    }
}

void onMqttConnect(bool sessionPresent) {
    Serial.println("Connected to MQTT.");
    Serial.print("Session present: ");
    Serial.println(sessionPresent);
    // pin 13
    // uint16_t packetIdSub = mqttClient.subscribe("6215de342aa1ab04d8b8e37d/devices/6215de3b2aa1ab04d8b8e37e", 0);
    uint16_t packetIdSub = mqttClient.subscribe("640d4c75a2b2ba23e07ecb4e/devices/640dbdb6a9e8e10e90f5e1e1", 0);

    // pin 12
    // uint16_t packetIdSub1 = mqttClient.subscribe("6215de342aa1ab04d8b8e37d/devices/6215de412aa1ab04d8b8e37f", 0);
    uint16_t packetIdSub1 = mqttClient.subscribe("640d4c75a2b2ba23e07ecb4e/devices/640dbdcba9e8e10e90f5e1e2", 0);

}

void onMqttDisconnect(AsyncMqttClientDisconnectReason reason) {
    Serial.println("Disconnected from MQTT.");
    if (WiFi.isConnected()) {
        xTimerStart(mqttReconnectTimer, 0);
    }
}

void onMqttMessage(char *topic, char *payload, AsyncMqttClientMessageProperties properties, size_t len, size_t index,
                   size_t total) {
      Serial.println("tesst topic+payload:....\n");
      Serial.println(payload);
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    const char *pin = doc["pin"];
    Serial.println(pin);
    const char *status = doc["data"]["status"];
    Serial.println(status);
    if(strcmp(pin,"13") == 0){
        if (strcmp(status, "ON") == 0) {
            Serial.println("test 13");
            digitalWrite(LED_1, HIGH);
        } else {
            digitalWrite(LED_1, LOW);
        }
    }
    if(strcmp(pin,"12") == 0){
        if (strcmp(status, "ON") == 0) {
            Serial.println("test 12");
            digitalWrite(LED_2, HIGH);
        } else {
            digitalWrite(LED_2, LOW);
        }
    }

    
    
}

void onMqttSubscribe(uint16_t packetId, uint8_t qos) {
    Serial.println("Subscribe acknowledged.");
    Serial.print("  packetId: ");
    Serial.println(packetId);
    Serial.print("  qos: ");
    Serial.println(qos);
}

void onMqttUnsubscribe(uint16_t packetId) {
    Serial.println("Unsubscribe acknowledged.");
    Serial.print("  packetId: ");
    Serial.println(packetId);
}

void onMqttPublish(uint16_t packetId) {
    Serial.print("Publish acknowledged.");
    Serial.print("  packetId: ");
    Serial.println(packetId);
}

void setup() {
    Serial.begin(115200);
    Serial.println();
    pinMode(LED_1, OUTPUT);
    pinMode(LED_2, OUTPUT);
    dht.begin();

    mqttReconnectTimer = xTimerCreate(
            "mqttTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *) 0,
            reinterpret_cast<TimerCallbackFunction_t>(connectToMqtt));
    wifiReconnectTimer = xTimerCreate(
            "wifiTimer", pdMS_TO_TICKS(2000), pdFALSE, (void *) 0,
            reinterpret_cast<TimerCallbackFunction_t>(connectToWifi));

    WiFi.onEvent(WiFiEvent);

    mqttClient.onConnect(onMqttConnect);
    mqttClient.onDisconnect(onMqttDisconnect);
    // mqttClient.onSubscribe(onMqttSubscribe);
    // mqttClient.onUnsubscribe(onMqttUnsubscribe);
    mqttClient.onMessage(onMqttMessage);
    mqttClient.onPublish(onMqttPublish);
    mqttClient.setServer(MQTT_HOST, MQTT_PORT);
    mqttClient.setCredentials("eywyjtgi:eywyjtgi", "VwGWrBH1ufex5N5J_gzc5m8jIEvva2bH");

    // If your broker requires authentication (username and password), set them below
    //mqttClient.setCredentials("REPlACE_WITH_YOUR_USER", "REPLACE_WITH_YOUR_PASSWORD");
    connectToWifi();
}

void loop() {
    unsigned long currentMillis = millis();
    // Every X number of seconds (interval = 10 seconds)
    // turn the LED on (HIGH is the voltage level)
//    digitalWrite(LED_1, HIGH);
    // it publishes a new MQTT message
    if (currentMillis - previousMillis >= interval) {
        // Save the last time a new reading was published
        previousMillis = currentMillis;
        // New DHT sensor readings
        hum = dht.readHumidity();
        // Read temperature as Celsius (the default)
        temp = dht.readTemperature();
        // Read temperature as Fahrenheit (isFahrenheit = true)
        //temp = dht.readTemperature(true);

        // Check if any reads failed and exit early (to try again).
        if (isnan(temp) || isnan(hum)) {
            Serial.println(F("Failed to read from DHT sensor!"));
            return;
        }

        DynamicJsonDocument doc(256);
        doc["sensor"] = "dht11";
        doc["pin"] = DHTPIN;
        doc["time"] = time(nullptr);
        doc["data"]["temperature"] = temp;
        doc["data"]["humidity"] = hum;
        char payload[256];
        serializeJson(doc, payload);
        Serial.println(time(nullptr));

        uint16_t packetIdPub1 = mqttClient.publish(MQTT_PUB_TEMP, 1, true, payload);

        Serial.printf("Publishing on topic %s at QoS 1, packetId: %i ", MQTT_PUB_TEMP, packetIdPub1);
        Serial.printf("Message: %s \n", payload);

        
    }
}