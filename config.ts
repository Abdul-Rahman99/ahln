import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: process.env.DB_PORT,
  DB_URI: process.env.DB_URI,

  PORT: process.env.PORT,
  BASE_URL: process.env.BASE_URL,
  UPLOADS: process.env.UPLOADS as string,
  NODE_ENV: process.env.NODE_ENV,

  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,

  SALT_ROUNDS: process.env.SALT_ROUNDS,

  MQTT_HOST: process.env.MQTT_HOST,
  MQTT_PORT: process.env.MQTT_PORT,
  MQTT_PROTOCOL: process.env.MQTT_PROTOCOL,
  MQTT_USERNAME: process.env.MQTT_USERNAME,
  MQTT_PASSWORD: process.env.MQTT_PASSWORD,
};

export default config;
