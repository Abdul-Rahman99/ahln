
import db from '../../config/database';
import { OTP } from '../../types/otp.type';

class OTPModel {
  // Create OTP
  async createOTP(otp: Partial<OTP>): Promise<OTP> {
    try {
      const connection = await db.connect();
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'box_id',
        'box_locker_id',
        'is_used',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        otp.box_id,
        otp.box_locker_id,
        otp.is_used,
      ];

      const sql = `INSERT INTO OTP (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create OTP: ${(error as Error).message}`);
    }
  }

  // Get all OTPs
  async getMany(): Promise<OTP[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM OTP';
      const result = await connection.query(sql);
      connection.release();

      return result.rows as OTP[];
    } catch (error) {
      throw new Error(`Error retrieving OTPs: ${(error as Error).message}`);
    }
  }

  // Get specific OTP by ID
  async getOne(id: number): Promise<OTP> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM OTP WHERE id=$1';
      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find OTP with ID ${id}`);
      }

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error(`Could not find OTP ${id}: ${(error as Error).message}`);
    }
  }

  // Update OTP
  async updateOne(otp: Partial<OTP>, id: number): Promise<OTP> {
    try {
      const connection = await db.connect();

      // Check if the OTP exists
      const checkSql = 'SELECT * FROM OTP WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`OTP with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(otp)
        .map((key) => {
          if (
            otp[key as keyof OTP] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(otp[key as keyof OTP]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the OTP ID to the query parameters

      const sql = `UPDATE OTP SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error(
        `Could not update OTP ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete OTP
  async deleteOne(id: number): Promise<OTP> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM OTP WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find OTP with ID ${id}`);
      }

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error(
        `Could not delete OTP ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default OTPModel;
