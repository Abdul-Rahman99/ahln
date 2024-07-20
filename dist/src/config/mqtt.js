"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = void 0;
const mqtt_1 = __importDefault(require("mqtt"));
const config_1 = __importDefault(require("../../config"));
const options = {
    host: config_1.default.MQTT_HOST,
    port: config_1.default.MQTT_PORT,
    protocol: config_1.default.MQTT_PROTOCOL,
    username: config_1.default.MQTT_USERNAME,
    password: config_1.default.MQTT_PASSWORD,
};
function connect() {
    exports.client = mqtt_1.default.connect(options);
    exports.client.on('connect', () => {
        console.log('MQTT Connected');
        const wildcardTopic = '#';
        exports.client.subscribe(wildcardTopic, { qos: 1 }, (err, granted) => {
            if (err) {
                console.error('Subscription error:', err);
            }
            else {
                console.log('Subscribed to wildcard topic:', granted);
            }
        });
    });
    exports.client.on('message', (topic, message) => {
        console.log(`Received message on topic ${topic}: ${message.toString()}`);
        try {
            const parsedMessage = JSON.parse(message.toString());
            console.log('Parsed message:', parsedMessage);
        }
        catch (err) {
            console.log('Received non-JSON message:', message.toString());
        }
        if (shouldSubscribeToTopic(topic)) {
            exports.client.subscribe(topic, { qos: 1 }, (err, granted) => {
                if (err) {
                    console.error(`Subscription error for topic ${topic}:`, err);
                }
                else {
                    console.log(`Subscribed to new topic: ${topic}`, granted);
                }
            });
        }
    });
    exports.client.on('error', (error) => {
        console.error('MQTT connection error:', error);
        exports.client.end();
        setTimeout(connect, 10000);
    });
    exports.client.on('reconnect', () => {
        console.log('Reconnecting to MQTT broker');
    });
    exports.client.on('end', () => {
        console.log('Connection to MQTT broker ended');
        setTimeout(connect, 10000);
    });
}
connect();
const shouldSubscribeToTopic = (topic) => {
    return true;
};
//# sourceMappingURL=mqtt.js.map