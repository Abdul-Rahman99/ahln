/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { UserDevice } from '../../types/user.devices';

class UserDevicesModel {
  async saveUserDevice(userId: string, fcmToken: string): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO user_devices (user_id, fcm_token) VALUES ($1, $2)`;
      await connection.query(sql, [userId, fcmToken]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Could not save user device for user ${userId}: ${(error as Error).message}`,
      );
    }
  }

  async getUserDeviceById(deviceId: number): Promise<UserDevice | null> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM user_devices WHERE id = $1`;
      const result = await connection.query(sql, [deviceId]);
      connection.release();
      return result.rows.length ? (result.rows[0] as UserDevice) : null;
    } catch (error) {
      throw new Error(
        `Could not retrieve user device ${deviceId}: ${(error as Error).message}`,
      );
    }
  }

  async getAllUserDevices(userId: string): Promise<UserDevice[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM user_devices WHERE user_id = $1`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows as UserDevice[];
    } catch (error) {
      throw new Error(
        `Could not retrieve user devices for user ${userId}: ${(error as Error).message}`,
      );
    }
  }

  async updateUserDevice(
    deviceId: number,
    fcmToken: string,
  ): Promise<UserDevice> {
    try {
      const connection = await db.connect();
      const updatedAt = new Date();
      const sql = `UPDATE user_devices SET fcm_token = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;
      const result = await connection.query(sql, [
        fcmToken,
        updatedAt,
        deviceId,
      ]);
      connection.release();
      return result.rows[0] as UserDevice;
    } catch (error) {
      throw new Error(
        `Could not update user device ${deviceId}: ${(error as Error).message}`,
      );
    }
  }

  async deleteUserDevice(deviceId: number): Promise<UserDevice> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM user_devices WHERE id = $1 RETURNING *`;
      const result = await connection.query(sql, [deviceId]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(`User device with ID ${deviceId} not found.`);
      }
      return result.rows[0] as UserDevice;
    } catch (error) {
      throw new Error(
        `Could not delete user device ${deviceId}: ${(error as Error).message}`,
      );
    }
  }
}

export default UserDevicesModel;
