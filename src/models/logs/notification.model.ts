import db from '../../config/database';
import { Notification } from '../../types/notification.type';

export default class NotificationModel {
  async createNotification(
    notificationData: Partial<Notification>,
  ): Promise<Notification> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['title', 'createdAt', 'updatedAt', 'message', 'image'];
      const sqlParams = [
        notificationData.title,
        createdAt,
        updatedAt,
        notificationData.message,
        notificationData.image,
      ];
      const sql = `INSERT INTO Notification (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as Notification;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllNotifications(): Promise<Notification[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, message, title, image FROM Notification`;
      const result = await connection.query(sql);

      return result.rows as Notification[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  
  async getAllNotificationsByUser(user: string): Promise<Notification[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, message, title, image FROM Notification WHERE user_id=$1`;
      const result = await connection.query(sql, [user]);

      return result.rows as Notification[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, message, title, image FROM Notification WHERE id = $1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteNotification(id: number): Promise<void> {
    const connection = await db.connect();
    try {
      const sql = `DELETE FROM Notification WHERE id = $1`;
      await connection.query(sql, [id]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
