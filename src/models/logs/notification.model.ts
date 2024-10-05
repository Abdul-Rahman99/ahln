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
    box_id: string | null,
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
        'box_id',
      ];
      const sqlParams = [
        title,
        createdAt,
        updatedAt,
        message,
        image,
        user,
        box_id,
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
      const sql = `SELECT * FROM Notification`;
      const result = await connection.query(sql);

      return result.rows as Notification[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllNotificationsByUser(
    user: string,
    limit: number,
    page: number,
  ): Promise<Notification[]> {
    const connection = await db.connect();

    try {
      // pagination logic
      const offset = limit * (page - 1);

      const sql = `SELECT * FROM Notification WHERE user_id=$1 ORDER BY createdat DESC OFFSET $2 LIMIT $3`;
      const result = await connection.query(sql, [user, offset, limit]);

      const resultRows = result.rows.map((row) => {
        return {
          ...row,
          image: row.image
            ? `${process.env.BASE_URL}/uploads/${row.image}`
            : null,
        };
      });

      return resultRows as Notification[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getNotificationById(id: number): Promise<Notification | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM Notification WHERE id = $1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteNotification(id: number): Promise<Notification> {
    const connection = await db.connect();
    try {
      // Check if the box exists
      const checkSql = 'SELECT * FROM Notification WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Notification with ID ${id} does not exist`);
      }

      const sql = `DELETE FROM Notification WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      return result.rows[0] as Notification;
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
      try {
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
      } catch (error: any) {
        console.error(error.message);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  async updateNotification(id: number): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = `UPDATE Notification SET is_read = $1 WHERE id = $2 RETURNING *`;
      const result = await connection.query(sql, [true, id]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete all user notifications
  async deleteAllUserNotifications(user: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = `DELETE FROM Notification WHERE user_id = $1`;
      const result = await connection.query(sql, [user]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all user unread notifications
  async getUnreadNotifications(user: string): Promise<number> {
    const connection = await db.connect();
    try {
      const sql = `SELECT COUNT(*) FROM Notification WHERE user_id = $1 AND is_read = false`;
      const result = await connection.query(sql, [user]);
      console.log(result.rows[0]);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // mark all user notifications as read
  async markAllUserNotificationsAsRead(user: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = `UPDATE Notification SET is_read = true WHERE user_id = $1`;
      const result = await connection.query(sql, [user]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
