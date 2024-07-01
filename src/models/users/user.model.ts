/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../types/user.type';
import db from '../../config/database';
import bcrypt from 'bcrypt';
import pool from '../../config/database';

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

          // Format the next id as U1000002, U1000003, etc.
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

      // Prepare SQL query based on provided fields
      const sqlFields: string[] = [
        'id',
        'user_name',
        'createdAt',
        'updatedAt',
        'is_active',
        'phone_number',
        'email',
        'password',
        'preferred_language',
        'role_id',
      ];
      const sqlParams: unknown[] = [
        id,
        u.user_name?.toLowerCase(),
        createdAt,
        updatedAt,
        u.is_active !== undefined ? u.is_active : true,
        u.phone_number,
        u.email?.toLowerCase(),
        u.password,
        u.preferred_language || null,
        2,
      ];

      const sql = `INSERT INTO users (${sqlFields.join(', ')}) 
              VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
              RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;

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
        'SELECT id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users';
      const result = await connection.query(sql);

      // if (result.rows.length === 0) {
      //   throw new Error(`No users in the database`);
      // }
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
      const sql = `SELECT id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language FROM users 
                    WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find user with ID ${id}`);
      // }
      connection.release();
      return result.rows[0] as User;
    } catch (error) {
      throw new Error(`Could not find user ${id}: ${(error as Error).message}`);
    }
  }

  async updateUser(email: string, updateFields: Partial<User>): Promise<User> {
    try {
      const user = await this.findByEmail(email);
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }
      return await this.updateOne(updateFields, user.id);
    } catch (error) {
      throw new Error(
        `Could not update user with email ${email}: ${(error as Error).message}`,
      );
    }
  }

  // update user

  async updateOne(u: Partial<User>, id: string): Promise<User> {
    try {
      const connection = await db.connect();

      // Check if the user exists
      const checkSql = 'SELECT * FROM users WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`User with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;
      const updatedAt = new Date();

      const updateFields = Object.keys(u)
        .map((key) => {
          if (
            u[key as keyof User] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            if (key === 'password' && u.password) {
              queryParams.push(bcrypt.hashSync(u.password, 10)); // Hash the password if provided
            } else if (key === 'email' && u.email) {
              queryParams.push(u.email.toLowerCase()); // Convert email to lowercase
            } else {
              queryParams.push(u[key as keyof User]);
            }
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the user ID to the query parameters

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, email_verified`;

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
      const sql = `DELETE FROM users WHERE id=$1 RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language`;

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
      const sql = 'SELECT email FROM users WHERE email=$1';
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

  async saveOtp(email: string, otp: string) {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET register_otp=$1 WHERE email=$2`;
      await connection.query(sql, [otp, email]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Could not save OTP for ${email}: ${(error as Error).message}`,
      );
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    try {
      const connection = await db.connect();
      const sql = `SELECT register_otp FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      connection.release();
      if (result.rows.length && result.rows[0].register_otp === otp) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error(
        `Could not verify OTP for ${email}: ${(error as Error).message}`,
      );
    }
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET password = $1 WHERE email = $2`;
      await connection.query(sql, [newPassword, email]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Could not update password for user ${email}: ${(error as Error).message}`,
      );
    }
  }

  async checkResetPasswordOTP(email: string, otp: string): Promise<boolean> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM users WHERE email = $1 AND register_otp = $2`;
      const result = await connection.query(sql, [email, otp]);
      connection.release();
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(
        `Could not verify OTP for user ${email}: ${(error as Error).message}`,
      );
    }
  }

  async updateResetPasswordOTP(
    email: string,
    otp: string | null,
  ): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET register_otp = $1 WHERE email = $2`;
      await connection.query(sql, [otp, email]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Could not update OTP for user ${email}: ${(error as Error).message}`,
      );
    }
  }

  // Function to update the user token filed while login
  async updateUserToken(userId: string, token: string | null): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET token = $1 WHERE id = $2`;
      await connection.query(sql, [token, userId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Failed to update user token: ${(error as Error).message}`,
      );
    }
  }

  async deleteUserToken(userId: string, token: string): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE users SET token = null WHERE id = $2`;
      await connection.query(sql, [token, userId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Failed to delete user token: ${(error as Error).message}`,
      );
    }
  }

  async findByToken(token: string): Promise<string | null> {
    const sql = 'SELECT id FROM users WHERE token=$1';
    const result = await db.query(sql, [token]);
    if (result.rows.length) {
      return result.rows[0].id as string;
    }
    return null;
  }

  async findRoleById(id: string): Promise<number> {
    const sql = 'SELECT role_id FROM users WHERE id=$1';
    const result = await db.query(sql, [id]);
    if (result.rows.length) {
      return result.rows[0].role_id as number;
    }
    return 0;
  }
}

export default UserModel;
