/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoxLocker } from '../../types/box.locker.type';
import moment from 'moment-timezone';
import db from '../../config/database';

class BoxLockerModel {
  // Create new box locker
  async createBoxLocker(boxLocker: Partial<BoxLocker>): Promise<BoxLocker> {
    const connection = await db.connect();

    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      const sqlFields = [
        'id',
        'locker_label',
        'serial_port',
        'createdAt',
        'updatedAt',
        'is_empty',
        'box_id',
      ];
      const sqlParams = [
        boxLocker.id,
        boxLocker.locker_label,
        boxLocker.serial_port,
        createdAt,
        updatedAt,
        boxLocker.is_empty,
        boxLocker.box_id,
      ];

      const sql = `INSERT INTO Box_Locker (${sqlFields.join(', ')}) 
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

  // Get all box lockers
  async getMany(): Promise<BoxLocker[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Box_Locker';
      const result = await connection.query(sql);
      return result.rows as BoxLocker[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific box locker
  async getOne(id: string): Promise<BoxLocker> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box locker ID.',
        );
      }
      const sql = 'SELECT * FROM Box_Locker WHERE id=$1';
      const result = await connection.query(sql, [id]);
      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update box locker
  async updateOne(
    boxLocker: Partial<BoxLocker>,
    id: string,
  ): Promise<BoxLocker> {
    const connection = await db.connect();

    try {
      // Check if the box locker exists
      const checkSql = 'SELECT * FROM Box_Locker WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box locker with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = moment().tz('Asia/Dubai').format();
      const updateFields = Object.keys(boxLocker)
        .map((key) => {
          if (
            boxLocker[key as keyof BoxLocker] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(boxLocker[key as keyof BoxLocker]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the box locker ID to the query parameters

      const sql = `UPDATE Box_Locker SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete box locker
  async deleteOne(id: string): Promise<BoxLocker> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box locker ID.',
        );
      }
      const sql = `DELETE FROM Box_Locker WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get All Lockers related to a Box
  async getAllLockersById(boxId: string): Promise<BoxLocker[]> {
    const connection = await db.connect();

    try {
      if (!boxId) {
        throw new Error(`Box id cannot be null ${boxId}`);
      }

      const sql = `SELECT 
        id,
        locker_label as name,
        serial_port as box_locker_string
        FROM Box_Locker WHERE box_id=$1`;

      const result = await connection.query(sql, [boxId]);

      // Parse box_locker_string to JSON object
      const lockersWithParsedString = result.rows.map((row: any) => {
        try {
          return {
            ...row,
            box_locker_string: JSON.parse(row.box_locker_string),
          } as BoxLocker;
        } catch (error) {
          throw new Error((error as Error).message);
          return {
            ...row,
            box_locker_string: {}, // Provide a default value or handle the error accordingly
          } as BoxLocker;
        }
      });

      return lockersWithParsedString;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default BoxLockerModel;
