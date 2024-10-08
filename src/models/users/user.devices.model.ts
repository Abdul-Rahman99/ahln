/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { UserDevice } from '../../types/user.devices';

class UserDevicesModel {
  // Add new user device
  async saveUserDevice(userId: string, fcmToken: string): Promise<void> {
    const connection = await db.connect();

    try {
      // check if user device already exists
      const userDevice = await this.fcmTokenExists(fcmToken);
      if (userDevice) {
        return;
      }

      const sql = `INSERT INTO user_devices (user_id, fcm_token) VALUES ($1, $2)`;
      await connection.query(sql, [userId, fcmToken]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getUserDeviceById(deviceId: number): Promise<UserDevice | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM user_devices WHERE id = $1`;
      const result = await connection.query(sql, [deviceId]);
      return result.rows.length ? (result.rows[0] as UserDevice) : null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getFcmTokenDevicesByUser(user: string): Promise<any | []> {
    const connection = await db.connect();

    try {
      const sql = `SELECT fcm_token FROM user_devices WHERE user_id = $1`;
      const result = await connection.query(sql, [user]);
      // console.log('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa ', result.rows);
      const array: Array<any> = [];

      result.rows.forEach((element) => {
        array.push(element.fcm_token);
      });
      // console.log(array);
      return result.rows.length ? array : [];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // check if fcm token already exists
  async fcmTokenExists(fcmToken: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM user_devices WHERE fcm_token = $1`;
      const result = await connection.query(sql, [fcmToken]);

      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async getAllUserDevices(userId: string): Promise<UserDevice[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM user_devices WHERE user_id = $1`;
      const result = await connection.query(sql, [userId]);
      return result.rows as UserDevice[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateUserDevice(
    deviceId: number,
    fcmToken: string,
  ): Promise<UserDevice> {
    const connection = await db.connect();

    try {
      const updatedAt = new Date();
      const sql = `UPDATE user_devices SET fcm_token = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;
      const result = await connection.query(sql, [
        fcmToken,
        updatedAt,
        deviceId,
      ]);
      return result.rows[0] as UserDevice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteUserDevice(deviceId: number): Promise<UserDevice> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM user_devices WHERE id = $1 RETURNING *`;
      const result = await connection.query(sql, [deviceId]);
      if (result.rows.length === 0) {
        throw new Error(`User device with ID ${deviceId} not found.`);
      }
      return result.rows[0] as UserDevice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default UserDevicesModel;
