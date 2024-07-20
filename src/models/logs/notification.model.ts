/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { Notification } from '../../types/notification.type';
import { getMessaging } from 'firebase-admin/messaging';
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { config } from '../../../config';

config.FCM_TOKEN;

initializeApp({
  credential: applicationDefault(),
  projectId: 'ahlnowner-eaf04',
});

export default class NotificationModel {
  async createNotification(
    title: string,
    message: string,
    image: string | null,
    user: string,
  ): Promise<Notification> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'title',
        'createdAt',
        'updatedAt',
        'message',
        'image',
        'user_id',
      ];
      const sqlParams = [title, createdAt, updatedAt, message, image, user];
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
      const sql = `SELECT id, createdAt, updatedAt, message, title, image, user_id FROM Notification`;
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
      const sql = `SELECT id, createdAt, updatedAt, message, title, image, user_id FROM Notification WHERE user_id=$1`;
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
      const sql = `SELECT id, createdAt, updatedAt, message, title, image, user_id FROM Notification WHERE id = $1`;
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

  async pushNotification(
    fcmToken: any,
    title: string,
    body: string,
  ): Promise<any> {
    try {
      const registrationTokens = fcmToken;
      const message = {
        tokens: fcmToken,
        data: {},
        android: {},
        messageId: '103564652569',
        notification: {
          title: title,
          body: body,
        },
      };
      // console.log(message);

      if (fcmToken.length > 0) {
        getMessaging()
          .sendEachForMulticast(message)
          .then((response) => {
            if (response.failureCount > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const failedTokens: string | any[] = [];
              response.responses.forEach((resp, idx) => {
                if (!resp.success) {
                  failedTokens.push(registrationTokens[idx]);
                }
              });
              console.log('List of tokens that caused failures: ' + response);
            } else {
              console.log('Success Send Notification');
            }
          });
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }
}
