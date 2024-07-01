/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tablet } from '../../types/tablet.type';
import db from '../../config/database';

class TabletModel {
  // Create new tablet
  async createTablet(t: Partial<Tablet>): Promise<Tablet> {
    try {
      const connection = await db.connect();

      // Required fields
      const requiredFields: string[] = ['serial_number', 'android_id'];
      const providedFields: string[] = Object.keys(t).filter(
        (key) => t[key as keyof Tablet] !== undefined,
      );

      if (!requiredFields.every((field) => providedFields.includes(field))) {
        throw new Error('Serial number and Android ID are required fields.');
      }

      const createdAt = new Date();
      const updatedAt = new Date();

      // Prepare SQL query based on provided fields
      const sqlFields: string[] = [
        'serial_number',
        'android_id',
        'createdAt',
        'updatedAt',
      ];
      const sqlParams: unknown[] = [
        t.serial_number,
        t.android_id,
        createdAt,
        updatedAt,
      ];

      const sql = `INSERT INTO tablet (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING id, serial_number, android_id, createdAt, updatedAt`;

      const result = await connection.query(sql, sqlParams);

      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create tablet: ${(error as Error).message}`);
    }
  }

  // Get all tablets
  async getMany(): Promise<Tablet[]> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet';
      const result = await connection.query(sql);

      // if (result.rows.length === 0) {
      //   throw new Error('No tablets in the database');
      // }
      connection.release();
      return result.rows as Tablet[];
    } catch (error) {
      throw new Error(`Error retrieving tablets: ${(error as Error).message}`);
    }
  }

  // Get specific tablet
  async getOne(id: string): Promise<Tablet> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid tablet ID.');
      }
      const sql = `SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet 
                    WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find tablet with ID ${id}`);
      // }
      connection.release();
      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error(
        `Could not find tablet ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update tablet
  async updateOne(t: Partial<Tablet>, id: string): Promise<Tablet> {
    try {
      const connection = await db.connect();

      // Check if the tablet exists
      const checkSql = 'SELECT * FROM tablet WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Tablet with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(t)
        .map((key) => {
          if (
            t[key as keyof Tablet] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(t[key as keyof Tablet]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the tablet ID to the query parameters

      const sql = `UPDATE tablet SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, serial_number, android_id, createdAt, updatedAt`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error(
        `Could not update tablet ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete tablet
  async deleteOne(id: string): Promise<Tablet> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid tablet ID.');
      }
      const sql = `DELETE FROM tablet WHERE id=$1 RETURNING id, serial_number, android_id, createdAt, updatedAt`;

      const result = await connection.query(sql, [id]);
      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find tablet with ID ${id}`);
      // }
      connection.release();

      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error(
        `Could not delete tablet ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Check if a serial number already exists in the database
  async serialNumberExists(serial_number: string): Promise<boolean> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT COUNT(*) FROM tablet WHERE serial_number=$1';
      const result = await connection.query(sql, [serial_number]);
      connection.release();

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking serial number existence:', error);
      throw new Error('Failed to check serial number existence');
    }
  }

  // Check if an Android ID already exists in the database
  async androidIdExists(android_id: string): Promise<boolean> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT COUNT(*) FROM tablet WHERE android_id=$1';
      const result = await connection.query(sql, [android_id]);
      connection.release();

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking Android ID existence:', error);
      throw new Error('Failed to check Android ID existence');
    }
  }
}

export default TabletModel;
