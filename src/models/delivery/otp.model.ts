import db from '../../config/database';
import { OTP } from '../../types/otp.type';

class OTPModel {
  // Create OTP
  async createOTP(otpData: Partial<OTP>): Promise<OTP> {
    try {
      const connection = await db.connect();
      const createdAt = new Date();
      const updatedAt = new Date();

      // Generate the OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'box_id',
        'box_locker_id',
        'is_used',
        'otp',
        'box_locker_string',
        'delivery_package_id',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        otpData.box_id,
        otpData.box_locker_id,
        false, // is_used is set to false by default
        otp,
        otpData.box_locker_string,
        otpData.delivery_package_id,
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

  async checkOTP(otp: string): Promise<OTP | null> {
    const connection = await db.connect();
    try {
      if (!otp) {
        throw new Error('Please provide an otp');
      }
      const result = await connection.query(
        'SELECT * FROM OTP WHERE otp = $1 AND is_used = FALSE',
        [otp],
      );

      if (result.rows.length === 0) {
        return null;
      }

      const otpRecord = result.rows[0];

      // Mark the OTP as used and delete the record
      await connection.query('DELETE FROM OTP WHERE id = $1', [otpRecord.id]);

      return otpRecord;
    } catch (error) {
      throw new Error(`Unable to check OTP: ${(error as Error).message}`);
    } finally {
      connection.release();
    }
  }

  // Get all OTPs
  async getMany(): Promise<OTP[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM OTP';
      const result = await connection.query(sql);

      if (result.rows.length === 0) {
        throw new Error('No otpes in the database');
      }
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
      if (!id) {
        throw new Error('Please provide in id');
      }
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

      queryParams.push(updatedAt);
      updateFields.push(`updatedAt=$${paramIndex++}`);

      queryParams.push(id);

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
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid OTP ID.');
      }
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

  // Get OTPs by User
  async getOTPsByUser(userId: string): Promise<OTP[]> {
    try {
      const connection = await db.connect();
      if (!userId) {
        throw new Error('ID cannot be null. Please provide a valid User ID.');
      }

      // Check if the OTP exists
      const checkSql = 'SELECT * FROM users WHERE id=$1';
      const checkResult = await connection.query(checkSql, [userId]);

      if (checkResult.rows.length === 0) {
        throw new Error(`OTP with ID ${userId} does not exist`);
      }

      const sql = `SELECT OTP.* FROM OTP
                   INNER JOIN Box ON OTP.box_id = Box.id
                   INNER JOIN Delivery_Package ON Box.id = Delivery_Package.box_id
                   WHERE Delivery_Package.customer_id = $1 OR Delivery_Package.vendor_id = $1 OR Delivery_Package.delivery_id = $1`;
      const result = await connection.query(sql, [userId]);
      if (result.rows.length === 0) {
        throw new Error('No otp in the database');
      }
      connection.release();

      return result.rows as OTP[];
    } catch (error) {
      throw new Error(
        `Error retrieving OTPs for user ${userId}: ${(error as Error).message}`,
      );
    }
  }
}

export default OTPModel;
