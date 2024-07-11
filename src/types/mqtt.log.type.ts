// MqttLog.ts
export interface MqttLog {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  message: string;
  mqtt_topic_id: number;

}
