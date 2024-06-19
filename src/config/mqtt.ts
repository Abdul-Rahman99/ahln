/* eslint-disable @typescript-eslint/no-explicit-any */
import mqtt, { MqttClient } from 'mqtt';
import config from '../../config';

const options = {
  host: config.MQTT_HOST,
  port: config.MQTT_PORT,
  protocol: config.MQTT_PROTOCOL,
  username: config.MQTT_USERNAME,
  password: config.MQTT_PASSWORD,
};

export const client: MqttClient = mqtt.connect(options as any);

client.on('connect', () => {
  console.log('MQTT Connected');

  // subscribe to all topics under 'data/' --<adjust as needed>--
  const wildcardTopic = 'data/#';
  client.subscribe(wildcardTopic, { qos: 1 }, (err, granted) => {
    if (err) {
      console.error('Subscription error:', err);
    } else {
      console.log('Subscribed to wildcard topic:', granted);
    }
  });
});

client.on('message', (topic, message) => {
  console.log(`Received message on topic ${topic}: ${message.toString()}`);
  try {
    const parsedMessage = JSON.parse(message.toString());
    console.log('Parsed message:', parsedMessage);
  } catch (err) {
    console.log('Received non-JSON message:', message.toString());
  }

  // if (shouldSubscribeToTopic(topic)) {
  //   const specificTopic = topic;
  //   client.subscribe(specificTopic, { qos: 1 }, (err, granted) => {
  //     if (err) {
  //       console.error(`Subscription error for topic ${specificTopic}:`, err);
  //     } else {
  //       console.log(`Subscribed to new topic: ${specificTopic}`, granted);
  //     }
  //   });
  // }
});

client.on('error', function (error) {
  console.log('MQTT connection error:', error);
  process.exit(1);
});

client.on('reconnect', () => {
  console.log('Reconnecting to MQTT broker');
});

client.on('end', () => {
  console.log('Connection to MQTT broker ended');
});

// const shouldSubscribeToTopic = (
//   : string): boolean => {
//   //add logic to determine if a specific topic should be subscribed to
//   // for example subscribe to certain patterns or newly discovered topics
//   return true; // for demonstration  subscribe to all
// };
