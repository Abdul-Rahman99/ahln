/* eslint-disable @typescript-eslint/no-explicit-any */
import { Tablet } from '../../types/tablet.type';
import db from '../../config/database';
import moment from 'moment-timezone';

class TabletModel {
  // Create new tablet
  async createTablet(t: Partial<Tablet>): Promise<Tablet> {
    const connection = await db.connect();

    try {
      // Required fields
      const requiredFields: string[] = ['serial_number', 'android_id'];
      const providedFields: string[] = Object.keys(t).filter(
        (key) => t[key as keyof Tablet] !== undefined,
      );

      if (!requiredFields.every((field) => providedFields.includes(field))) {
        throw new Error('Serial number and Android ID are required fields.');
      }

      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

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

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all tablets
  async getMany(): Promise<Tablet[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT Box.id as box_id, Box.box_label, Box.previous_tablet_id, tablet.* FROM tablet LEFT JOIN Box ON Box.current_tablet_id=tablet.id';
      const result = await connection.query(sql);

      return result.rows as Tablet[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific tablet
  async getOne(id: string): Promise<Tablet> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid tablet ID.');
      }
      const sql = `SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet 
                    WHERE id=$1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update tablet
  async updateOne(t: Partial<Tablet>, id: string): Promise<Tablet> {
    const connection = await db.connect();

    try {
      // Check if the tablet exists
      const checkSql = 'SELECT * FROM tablet WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Tablet with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = moment().tz('Asia/Dubai').format();
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

      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete tablet
  async deleteOne(id: string): Promise<Tablet> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid tablet ID.');
      }
      const sql = `DELETE FROM tablet WHERE id=$1 RETURNING id, serial_number, android_id, createdAt, updatedAt`;

      const result = await connection.query(sql, [id]);

      return result.rows[0] as Tablet;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check if a serial number already exists in the database
  async serialNumberExists(serial_number: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT serial_number FROM tablet WHERE serial_number=$1';
      const result = await connection.query(sql, [serial_number]);

      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check if an Android ID already exists in the database
  async androidIdExists(android_id: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT COUNT(*) FROM tablet WHERE android_id=$1';
      const result = await connection.query(sql, [android_id]);

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check if a tablet is assigned to a box
  async tabletIsAssignedToBox(tabletId: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT id FROM box WHERE current_tablet_id = $1';
      const result = await connection.query(sql, [tabletId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default TabletModel;
