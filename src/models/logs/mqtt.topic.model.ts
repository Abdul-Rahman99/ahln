import { MqttTopic } from '../../types/mqtt.topic.type';
import db from '../../config/database';

class MqttTopicModel {
  // create a mqtt topic
  async createMqttTopic(mqttTopicData: Partial<MqttTopic>): Promise<MqttTopic> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'topic_string'];

      const sqlParams = [createdAt, updatedAt, mqttTopicData.topic_string];

      const sql = `INSERT INTO Mqtt_Topic (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0] as MqttTopic;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all mqtt topics
  async getAllMqttTopics(): Promise<MqttTopic[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Mqtt_Topic';
      const result = await connection.query(sql);

      return result.rows as MqttTopic[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get one mqtt topic by id
  async getMqttTopic(id: number): Promise<MqttTopic[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Mqtt_Topic WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows as MqttTopic[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete mqtt topic by id
  async deleteMqttTopic(id: number): Promise<MqttTopic[]> {
    const connection = await db.connect();

    try {
      const sql = 'DELETE FROM Mqtt_Topic WHERE id=$1 RETURNING *';
      const result = await connection.query(sql, [id]);

      return result.rows as MqttTopic[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default MqttTopicModel;
