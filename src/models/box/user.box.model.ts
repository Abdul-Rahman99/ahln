import { Box } from '../../types/box.type';
import db from '../../config/database';
import { UserBox } from '../../types/user.box.type';

class UserBoxModel {
  // Create new UserBox
  async createUserBox(userBox: Partial<UserBox>): Promise<UserBox> {
    try {
      const connection = await db.connect();
      const createdAt = new Date();
      const updatedAt = new Date();

      const userBoxId = `Ahln_${userBox.user_id}_${userBox.box_id}`; // Custom user_box id

      const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
      const sqlParams = [
        userBoxId,
        userBox.user_id,
        userBox.box_id,
        createdAt,
        updatedAt,
      ];

      const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error(
        `Unable to create user box association: ${(error as Error).message}`,
      );
    }
  }

  // Get all user boxes with box details
  async getAllUserBoxes(): Promise<(UserBox & Box)[]> {
    try {
      const connection = await db.connect();
      const sql = `
        SELECT ub.*, b.*
        FROM User_Box ub
        INNER JOIN Box b ON ub.box_id = b.id
      `;
      const result = await connection.query(sql);
      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find boxess`);
      // }
      connection.release();
      return result.rows as (UserBox & Box)[];
    } catch (error) {
      throw new Error(
        `Error retrieving user boxes with box details: ${(error as Error).message}`,
      );
    }
  }

  async getUserBoxesByUserId(userId: string): Promise<(UserBox & Box)[]> {
    try {
      const connection = await db.connect();
      const sql = `
      SELECT ub.id as user_box_id,
      b.id as box_id,
      b.serial_number,
      b.box_label,
      b.box_model_id,
      b.address_id,
      b.current_tablet_id
      FROM User_Box ub
      INNER JOIN Box b ON ub.box_id = b.id
      WHERE ub.user_id = $1
    `;
      const result = await connection.query(sql, [userId]);
      connection.release();

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find box for user with ID ${userId}`);
      // }

      return result.rows as (UserBox & Box)[];
    } catch (error) {
      throw new Error(
        `Error retrieving user boxes by user ID: ${(error as Error).message}`,
      );
    }
  }

  // Assign a box to a user
  async assignBoxToUser(userId: string, boxId: string): Promise<UserBox> {
    try {
      if (!userId || !boxId) {
        throw new Error('Please provide a userId or boxId');
      }
      const connection = await db.connect();

      // Check if the user exists
      const userCheckSql = 'SELECT id FROM users WHERE id=$1';
      const userCheckResult = await connection.query(userCheckSql, [userId]);
      if (userCheckResult.rows.length === 0) {
        connection.release();
        throw new Error(`User with ID ${userId} does not exist`);
      }

      // Check if the box exists
      const boxCheckSql = 'SELECT id FROM box WHERE id=$1';
      const boxCheckResult = await connection.query(boxCheckSql, [boxId]);
      if (boxCheckResult.rows.length === 0) {
        connection.release();
        throw new Error(`Box with ID ${boxId} does not exist`);
      }

      const createdAt = new Date();
      const updatedAt = new Date();
      const userBoxId = `${userId}_${boxId}`; // Custom user_box id

      const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
      const sqlParams = [userBoxId, userId, boxId, createdAt, updatedAt];

      const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                 VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error(
        `Unable to assign box to user: ${(error as Error).message}`,
      );
    }
  }

  // Get specific UserBox
  async getOne(id: string): Promise<UserBox> {
    try {
      const sql = 'SELECT * FROM User_Box WHERE id=$1';
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find UserBox with ID ${id}`);
      // }
      connection.release();
      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error(
        `Could not find UserBox ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update UserBox
  async updateOne(userBox: Partial<UserBox>, id: string): Promise<UserBox> {
    try {
      const connection = await db.connect();

      // Check if the UserBox exists
      const checkSql = 'SELECT * FROM User_Box WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`UserBox with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(userBox)
        .map((key) => {
          if (userBox[key as keyof UserBox] !== undefined && key !== 'id') {
            queryParams.push(userBox[key as keyof UserBox]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id); // Add the UserBox ID to the query parameters

      const sql = `UPDATE User_Box SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error(
        `Could not update UserBox ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete UserBox
  async deleteOne(id: string): Promise<UserBox> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM User_Box WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find UserBox with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error(
        `Could not delete UserBox ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Get UserBoxes by Box ID
  async getUserBoxesByBoxId(boxId: string): Promise<UserBox[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM User_Box WHERE box_id=$1`;
      const result = await connection.query(sql, [boxId]);
      connection.release();

      return result.rows as UserBox[];
    } catch (error) {
      throw new Error(
        `Error fetching UserBoxes by box ID: ${(error as Error).message}`,
      );
    }
  }
}

export default UserBoxModel;
