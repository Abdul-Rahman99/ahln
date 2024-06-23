/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../types/user.type';
import db from '../../config/database';
import bcrypt from 'bcrypt';
import config from '../../../config';
import pool from '../../config/database';

const hashPassword = (password: string) => {
  const salt = parseInt(config.SALT_ROUNDS as string, 10);
  return bcrypt.hashSync(`${password}${config.JWT_SECRET_KEY}`, salt);
};

class UserModel {
  // create new user
  async createUser(u: Partial<User>): Promise<User> {
    try {
      const connection = await db.connect();

      // Required fields
      const requiredFields: string[] = ['email', 'phone_number', 'user_name'];
      const providedFields: string[] = Object.keys(u).filter(
        (key) => u[key as keyof User] !== undefined,
      );

      if (!requiredFields.every((field) => providedFields.includes(field))) {
        throw new Error(
          'Email, phone_number, and user_name are required fields.',
        );
      }

      // Function to generate user id
      async function generateUserId() {
        try {
          const currentYear = new Date().getFullYear().toString().slice(-2); // Get the current year in two-digit format
          let nextId = 1;

          // Fetch the next sequence value (user number)
          const result = await pool.query(
            'SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM users',
          );
          if (result.rows.length > 0) {
            nextId = (result.rows[0].max_id || 0) + 1;
          }

          // Format the next id as D1000002, D1000003, etc.
          const nextIdFormatted = nextId.toString().padStart(7, '0');

          // Construct the user_id
          const id = `Ahln_${currentYear}_U${nextIdFormatted}`;
          return id;
        } catch (error: any) {
          console.error('Error generating user_id:', error.message);
          throw error;
        }
      }

      // Generate user id
      const id = await generateUserId(); // Await here to get the actual ID string

      const createdAt = new Date();
      const updatedAt = new Date();

      // Hash the password
      const hashedPassword = u.password ? await hashPassword(u.password) : null;

      // Prepare SQL query based on provided fields
      const sqlFields: string[] = [
        'id',
        'user_name',
        'fcm_token',
        'createdAt',
        'updatedAt',
        'is_active',
        'phone_number',
        'email',
        'password',
        'preferred_language',
      ];
      const sqlParams: unknown[] = [
        id,
        u.user_name,
        u.fcm_token || null,
        createdAt,
        updatedAt,
        u.is_active !== undefined ? u.is_active : true,
        u.phone_number,
        u.email,
        hashedPassword,
        u.preferred_language || null,
      ];

      const sql = `INSERT INTO users (${sqlFields.join(', ')}) 
                 VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;

      const result = await connection.query(sql, sqlParams);

      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create user: ${(error as Error).message}`);
    }
  }

  // get all users
  async getMany(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users';
      const result = await connection.query(sql);

      if (result.rows.length === 0) {
        throw new Error(`No users in the database`);
      }
      connection.release();
      return result.rows as User[];
    } catch (error) {
      throw new Error(`Error retrieving users: ${(error as Error).message}`);
    }
  }

  // get specific user
  async getOne(id: string): Promise<User> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid user ID.');
      }
      const sql = `SELECT id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users 
                    WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find user with ID ${id}`);
      }
      connection.release();
      return result.rows[0] as User;
    } catch (error) {
      throw new Error(`Could not find user ${id}: ${(error as Error).message}`);
    }
  }

  // update user
  async updateOne(u: Partial<User>, id: string): Promise<User> {
    try {
      const connection = await db.connect();
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      u.updatedAt = new Date();

      const updateFields = Object.keys(u)
        .map((key) => {
          if (
            u[key as keyof User] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            if (key === 'password') {
              queryParams.push(hashPassword(u.password as string)); // Hash the password if provided
            } else {
              queryParams.push(u[key as keyof User]);
            }
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id);

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as User;
    } catch (error) {
      throw new Error(
        `Could not update user ${id}: ${(error as Error).message}`,
      );
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid user ID.');
      }
      const sql = `DELETE FROM users WHERE id=$1 RETURNING id, user_name, role_id, fcm_token, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find user with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as User;
    } catch (error) {
      throw new Error(
        `Could not delete user ${id}: ${(error as Error).message}`,
      );
    }
  }

  // find user by email to support the login functionality
  async findByEmail(email: string): Promise<User | null> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      connection.release();
      if (result.rows.length) {
        return result.rows[0] as User;
      }
      return null;
    } catch (error) {
      throw new Error(
        `Could not find user with email ${email}: ${(error as Error).message}`,
      );
    }
  }

  // helper func to determine if the email exists when creation
  async emailExists(email: string): Promise<boolean> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT email FROM users  WHERE email=$1';
      const result = await connection.query(sql, [email]);
      connection.release();
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(
        `Unable to check email existence: ${(error as Error).message}`,
      );
    }
  }

  // Check if a phone number already exists in the database
  async phoneExists(phone: string): Promise<boolean> {
    try {
      const sql = 'SELECT COUNT(*) FROM users WHERE phone_number = $1';
      const connection = await db.connect();
      const result = await connection.query(sql, [phone]);
      connection.release();

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      console.error('Error checking phone existence:', error);
      throw new Error('Failed to check phone existence');
    }
  }

  async updateOtpHash(
    userId: string,
    otpHash: string,
    otpExpiration: Date,
  ): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET otp_hash=$1, otp_expiration=$2 WHERE id=$3`;
      await connection.query(sql, [otpHash, otpExpiration, userId]);
      connection.release();
    } catch (error) {
      throw new Error(`Could not update OTP hash: ${(error as Error).message}`);
    }
  }
}

export default UserModel;
