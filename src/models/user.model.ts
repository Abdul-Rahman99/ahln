import User from '../types/user.type';
import db from '../config/database';
import bcrypt from 'bcrypt';
import config from '../../config';

const hashPassword = (password: string) => {
  const salt = parseInt(config.SALT_ROUNDS as string, 10);
  return bcrypt.hashSync(`${password}${config.JWT_SECRET_KEY}`, salt);
};

class UserModel {
  // create new user
  async create(u: User): Promise<User> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO users (email, username, password, phone, alt_phone, payment_method, box_info, createdAt, updatedAt, gr) 
                    values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
                    RETURNING id, email, username, password, phone, alt_phone, payment_method, box_info, createdAt, updatedAt, gr`;

      const createdAt = new Date();
      const updatedAt = new Date();
      const result = await connection.query(sql, [
        u.email,
        u.username,
        hashPassword(u.password),
        u.phone,
        u.alt_phone,
        u.payment_method,
        u.box_info,
        createdAt,
        updatedAt,
        u.gr,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create (${u.username}): ${(error as Error).message}`,
      );
    }
  }

  // get all users
  async getMany(): Promise<User[]> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT id, email, username, password, phone, alt_phone, payment_method, box_info, role, createdAt, updatedAt, gr FROM users';
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
      const sql = `SELECT id, email, username, phone, alt_phone, payment_method, box_info, role, createdAt, updatedAt, gr FROM users 
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
      const queryParams: any[] = [];
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

      const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, email, username, phone, alt_phone, payment_method, box_info, role, createdAt, updatedAt, password, gr`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as User;
    } catch (error) {
      throw new Error(
        `Could not update user: ${u.username}, ${(error as Error).message}`,
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
      const sql = `DELETE FROM users
                    WHERE id=$1
                    RETURNING id, email, username, phone, alt_phone, payment_method, box_info, role, createdAt, updatedAt, gr`;

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
}

export default UserModel;
