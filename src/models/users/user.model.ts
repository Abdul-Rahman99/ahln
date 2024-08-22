/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '../../types/user.type';
import db from '../../config/database';
import pool from '../../config/database';

class UserModel {
  // create new user
  async createUser(u: Partial<User>): Promise<User> {
    const connection = await db.connect();

    try {
      // Required fields
      const requiredFields: string[] = ['email', 'phone_number', 'user_name'];
      const providedFields: string[] = Object.keys(u).filter(
        (key) => u[key as keyof User] !== undefined,
      );

      // Through error on missing required fields
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
        } catch (error) {
          throw new Error((error as Error).message);
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
        'country',
        'city',
        'avatar',
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
        u.role_id || 2,
        u.country || null,
        u.city || null,
        u.avatar || null,
      ];

      // Create Insert Query in users table
      const sql = `INSERT INTO users (${sqlFields.join(', ')}) 
              VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
              RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, country, city, avatar`;
      const result = await connection.query(sql, sqlParams);

      const roleSql = `SELECT role.title FROM users INNER JOIN role ON users.role_id = role.id WHERE users.id = $1`;

      const roleResult = await connection.query(roleSql, [id]);
      result.rows[0].title = roleResult.rows[0].title;

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all users
  async getMany(): Promise<User[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT role.title, users.id, user_name, role_id, is_active, phone_number, email, preferred_language, createdat, updatedat FROM users INNER JOIN role ON users.role_id = role.id WHERE role_id != 2 AND role_id != 3';
      const result = await connection.query(sql);
      return result.rows as User[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all customers
  async getCustomers(): Promise<User[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT role.title, users.id, user_name, role_id, is_active, phone_number, email, preferred_language, createdat, updatedat FROM users INNER JOIN role ON users.role_id = role.id WHERE role_id = 2';
      const result = await connection.query(sql);

      return result.rows as User[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async getRelativeCustomers(): Promise<User[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT relative_customer.*, box.box_label, users.id, users.user_name, users.role_id, users.is_active, users.phone_number, users.email, users.preferred_language, users.createdat, users.updatedat FROM relative_customer INNER JOIN users ON relative_customer.customer_id = users.id INNER JOIN box ON box.id = relative_customer.box_id';
      const result = await connection.query(sql);

      return result.rows as User[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get specific user
  async getOne(id: string): Promise<User> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid user ID.');
      }

      //fetch user from db
      const sql = `SELECT id, user_name, role_id, is_active, phone_number, email, preferred_language, country, city, avatar, password FROM users 
                    WHERE id=$1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as User;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // update user in db
  async updateOne(u: Partial<User>, id: string): Promise<User> {
    const connection = await db.connect();

    try {
      // Check if the user exists
      const checkSql = 'SELECT id FROM users WHERE id=$1';
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
            if (key === 'email' && u.email) {
              queryParams.push(u.email.toLowerCase()); // Convert email to lowercase
            } else {
              queryParams.push(u[key as keyof User]);
              return `${key}=$${paramIndex++}`;
            }
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the user ID to the query parameters

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, email_verified, country, city, avatar`;

      const result = await connection.query(sql, queryParams);
      result.rows[0].avatar = `${process.env.BASE_URL}/uploads/${result.rows[0].avatar}`;

      const userRoleSql =
        'SELECT role.title FROM users INNER JOIN role ON users.role_id = role.id WHERE users.id = $1';
      const userRoleResult = await connection.query(userRoleSql, [
        result.rows[0].id,
      ]);

      result.rows[0].title = userRoleResult.rows[0].title;

      return result.rows[0] as User;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete user
  async deleteOne(id: string): Promise<User> {
    const connection = await db.connect();

    try {
      //check required id
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid user ID.');
      }
      if (id === 'Ahln_24_U0000001') {
        throw new Error("You Can't Delete The Admin User.");
      }
      const sql = `DELETE FROM users WHERE id=$1 RETURNING id, user_name, role_id, createdAt, updatedAt, is_active, phone_number, email, preferred_language, country, city, avatar`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as User;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // find user by email to support the login functionality
  async findByEmail(email: string): Promise<User | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT Role.title, users.* FROM users INNER JOIN Role ON users.role_id=Role.id WHERE users.email=$1`;
      const result = await connection.query(sql, [email]);
      if (result.rows.length) {
        return result.rows[0] as User;
      }

      return null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  //update user by his id (handler)
  async updateUser(email: string, updateFields: Partial<User>): Promise<User> {
    try {
      const user = await this.findByEmail(email); // check if user already exist
      if (!user) {
        throw new Error(`User with email ${email} not found`);
      }

      return await this.updateOne(updateFields, user.id);
    } catch (error) {
      throw new Error((error as Error).message);
    }
  }

  // helper func to determine if the email exists when creation
  async emailExists(email: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT email FROM users WHERE email=$1';
      const result = await connection.query(sql, [email]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check if a phone number already exists in the database
  async phoneExists(phone: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT COUNT(*) FROM users WHERE phone_number = $1';
      const result = await connection.query(sql, [phone]);

      return parseInt(result.rows[0].count) > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateOtpHash(
    userId: string,
    otpHash: string,
    otpExpiration: Date,
  ): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE users SET otp_hash=$1, otp_expiration=$2 WHERE id=$3`;
      await connection.query(sql, [otpHash, otpExpiration, userId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async saveOtp(email: string, otp: string) {
    const connection = await db.connect();

    try {
      const sql = `UPDATE users SET register_otp=$1 WHERE email=$2`;
      await connection.query(sql, [otp, email]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = `SELECT register_otp FROM users WHERE email=$1`;
      const result = await connection.query(sql, [email]);
      if (result.rows.length && result.rows[0].register_otp === otp) {
        return true;
      }
      return false;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateUserPassword(email: string, newPassword: string): Promise<void> {
    const connection = await db.connect();
    try {
      const sql = `UPDATE users SET password = $1 WHERE email = $2`;
      await connection.query(sql, [newPassword, email]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async checkResetPasswordOTP(email: string, otp: string): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM users WHERE email = $1 AND register_otp = $2`;
      const result = await connection.query(sql, [email, otp]);

      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateResetPasswordOTP(
    email: string,
    otp: string | null,
  ): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE users SET register_otp = $1 WHERE email = $2`;
      await connection.query(sql, [otp, email]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Function to update the user token filed while login
  async updateUserToken(userId: string, token: string | null): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE users SET token = $1 WHERE id = $2`;
      await connection.query(sql, [token, userId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteUserToken(userId: string, token: string): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE users SET token = null WHERE id = $2`;
      await connection.query(sql, [token, userId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async findByToken(token: string): Promise<string | null> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT id FROM users WHERE token=$1';
      const result = await connection.query(sql, [token]);
      if (result.rows.length) {
        return result.rows[0].id as string;
      }
      return null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Find User By Box Id
  async findUserByBoxId(boxId: string): Promise<string> {
    const connection = await db.connect();
    try {
      const userResult = await connection.query(
        'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
        [boxId],
      );
      return userResult.rows[0].user_id;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async findRoleIdByUserId(id: string): Promise<number> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT role_id FROM users WHERE id=$1';
      const result = await connection.query(sql, [id]);
      if (result.rows.length) {
        return result.rows[0].role_id as number;
      }
      return 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateUserStatus(userId: string, status: boolean): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = `UPDATE users SET is_active = $1 WHERE id = $2`;
      const result = await connection.query(sql, [status, userId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default UserModel;
