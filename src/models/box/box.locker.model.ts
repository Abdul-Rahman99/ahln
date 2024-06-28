/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoxLocker } from '../../types/box.locker.type';
import db from '../../config/database';

class BoxLockerModel {
  // Create new box locker
  async createBoxLocker(boxLocker: Partial<BoxLocker>): Promise<BoxLocker> {
    try {
      const connection = await db.connect();
      const createdAt = new Date();
      const updatedAt = new Date();

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
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create box locker: ${(error as Error).message}`,
      );
    }
  }

  // Get all box lockers
  async getMany(): Promise<BoxLocker[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM Box_Locker';
      const result = await connection.query(sql);

      if (result.rows.length === 0) {
        throw new Error('No box lockers in the database');
      }
      connection.release();
      return result.rows as BoxLocker[];
    } catch (error) {
      throw new Error(
        `Error retrieving box lockers: ${(error as Error).message}`,
      );
    }
  }

  // Get specific box locker
  async getOne(id: number): Promise<BoxLocker> {
    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box locker ID.',
        );
      }
      const sql = 'SELECT * FROM Box_Locker WHERE id=$1';
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find box locker with ID ${id}`);
      }
      connection.release();
      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error(
        `Could not find box locker ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update box locker
  async updateOne(
    boxLocker: Partial<BoxLocker>,
    id: number,
  ): Promise<BoxLocker> {
    try {
      const connection = await db.connect();

      // Check if the box locker exists
      const checkSql = 'SELECT * FROM Box_Locker WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box locker with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

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
      connection.release();

      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error(
        `Could not update box locker ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete box locker
  async deleteOne(id: number): Promise<BoxLocker> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box locker ID.',
        );
      }
      const sql = `DELETE FROM Box_Locker WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find box locker with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as BoxLocker;
    } catch (error) {
      throw new Error(
        `Could not delete box locker ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default BoxLockerModel;
