/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import mqtt, { MqttClient, IClientOptions } from 'mqtt';
import config from '../../config';

const options: IClientOptions = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT as any,
  protocol: config.MQTT_PROTOCOL as any,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

export let client: MqttClient;

function connect() {
  client = mqtt.connect(options);

  client.on('connect', () => {
    console.log('MQTT Connected');

    const wildcardTopic = '#';
    client.subscribe(wildcardTopic, { qos: 1 }, (err, granted) => {
      if (err) {
        console.error('Subscription error:', err);
      } else {
        // console.log('Subscribed to wildcard topic:', granted);
      }
    });
  });

  client.on('message', (topic, message) => {
    // console.log(`Received message on topic ${topic}: ${message.toString()}`);
    try {
      const parsedMessage = JSON.parse(message.toString());
      // console.log('Parsed message:', parsedMessage);
    } catch (err) {
      // console.log('Received non-JSON message:', message.toString());
    }

    if (shouldSubscribeToTopic(topic)) {
      client.subscribe(topic, { qos: 1 }, (err, granted) => {
        if (err) {
          console.error(`Subscription error for topic ${topic}:`, err);
        } else {
          // console.log(`Subscribed to new topic: ${topic}`, granted);
        }
      });
    }
  });

  client.on('error', (error) => {
    console.error('MQTT connection error:', error);
    client.end();
    setTimeout(connect, 10000); // try to reconnect after 10 seconds
  });

  client.on('reconnect', () => {
    console.log('Reconnecting to MQTT broker');
  });

  client.on('end', () => {
    console.log('Connection to MQTT broker ended');
    setTimeout(connect, 10000); // try to reconnect after 10 seconds
  });
}

connect();

const shouldSubscribeToTopic = (topic: string): boolean => {
  // add logic to determine if a specific topic should be subscribed to
  // for example, subscribe to certain patterns or newly discovered topics
  return true; // for demonstration, subscribe to all
};
