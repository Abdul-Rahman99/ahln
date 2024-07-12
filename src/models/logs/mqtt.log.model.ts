import { MqttLog } from '../../types/mqtt.log.type';
import db from '../../config/database';

class MqttLogModel {
  // create a mqtt log
  async createMqttLog(mqttLogData: Partial<MqttLog>): Promise<MqttLog> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'mqtt_topic_id', 'message'];

      const sqlParams = [
        createdAt,
        updatedAt,
        mqttLogData.mqtt_topic_id,
        mqttLogData.message,
      ];

      const sql = `INSERT INTO Mqtt_Log (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0] as MqttLog;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all mqtt logs
  async getAllMqttLogs(): Promise<MqttLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Mqtt_Log';
      const result = await connection.query(sql);

      return result.rows as MqttLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get one mqtt log by id
  async getMqttLog(id: number): Promise<MqttLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Mqtt_Log WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows as MqttLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete mqtt log by id
  async deleteMqttLog(id: number): Promise<MqttLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'DELETE FROM Mqtt_Log WHERE id=$1 RETURNING *';
      const result = await connection.query(sql, [id]);

      return result.rows as MqttLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default MqttLogModel;
