/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { BoxScreenMessage } from '../../types/box.screen.messages.type';

class BoxScreenMessagesModel {
  // Create a new BoxScreenMessage
  async createBoxScreenMessage(
    box_id: string,
    user_id: string,
    tablet_id: number,
    title: string,
    message: string,
  ): Promise<BoxScreenMessage> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'box_id',
        'user_id',
        'tablet_id',
        'title',
        'message',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        box_id,
        user_id,
        tablet_id,
        title,
        message,
      ];

      const sql = `INSERT INTO Box_Screen_Messages (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all BoxScreenMessages
  async getAllBoxScreenMessages(): Promise<BoxScreenMessage[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Box_Screen_Messages';
      const result = await connection.query(sql);

      return result.rows as BoxScreenMessage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific BoxScreenMessage by ID
  async getBoxScreenMessageById(id: number): Promise<BoxScreenMessage> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Box_Screen_Messages WHERE id=$1';
      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`BoxScreenMessage with ID ${id} not found`);
      }

      return result.rows[0] as BoxScreenMessage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update BoxScreenMessage
  async updateBoxScreenMessage(
    id: number,
    boxScreenMessage: Partial<BoxScreenMessage>,
  ): Promise<BoxScreenMessage> {
    const connection = await db.connect();
    try {
      // Check if the BoxScreenMessage exists
      const checkSql = 'SELECT * FROM Box_Screen_Messages WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`BoxScreenMessage with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(boxScreenMessage)
        .map((key) => {
          if (
            boxScreenMessage[key as keyof BoxScreenMessage] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(boxScreenMessage[key as keyof BoxScreenMessage]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt);
      updateFields.push(`updatedAt=$${paramIndex++}`);

      queryParams.push(id);

      const sql = `UPDATE Box_Screen_Messages SET ${updateFields.join(
        ', ',
      )} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as BoxScreenMessage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete BoxScreenMessage
  async deleteBoxScreenMessage(id: number): Promise<BoxScreenMessage> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM Box_Screen_Messages WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find BoxScreenMessage with ID ${id}`);
      }

      return result.rows[0] as BoxScreenMessage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default BoxScreenMessagesModel;
