/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '../../types/box.type';
import db from '../../config/database';
import { UserBox } from '../../types/user.box.type';
import { Address } from '../../types/address.type';
import UserModel from '../users/user.model';
const user = new UserModel();

class UserBoxModel {
  // Create new UserBox
  async createUserBox(userBox: Partial<UserBox>): Promise<UserBox> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const userBoxId = `${userBox.user_id}_${userBox.box_id}`; // Custom user_box id

      if (await this.checkUserBoxExists(userBoxId)) {
        throw new Error('User Box Already Assigned');
      }
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

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all user boxes with box details
  async getAllUserBoxes(): Promise<(UserBox & Box)[]> {
    const connection = await db.connect();

    try {
      const sql = `
        SELECT User_Box.id AS user_box_id, User_Box.*, Box.id AS box_id,Box.*, 
        tablet.serial_number 
        FROM User_Box LEFT JOIN Box ON User_Box.box_id = Box.id
        LEFT JOIN tablet ON Box.current_tablet_id = tablet.id;
      `;
      const result = await connection.query(sql);

      return result.rows as (UserBox & Box)[];
    } catch (error) {
      throw new Error(
        `Error retrieving user boxes with box details: ${(error as Error).message}`,
      );
    } finally {
      connection.release();
    }
  }

  // check user box id exists
  async checkUserBoxExists(userBoxId: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT id FROM User_Box WHERE id=$1';
      const result = await connection.query(sql, [userBoxId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async getUserBoxesByUserId(
    userId: string,
  ): Promise<(UserBox & Box & Address)[]> {
    const connection = await db.connect();

    try {
      const sql = `
      SELECT
        ub.id AS user_box_id,
        b.id AS id,
        b.serial_number,
        b.box_label AS name,
        b.box_model_id,
        a.district,
        a.city,
        a.building_number,
        b.current_tablet_id
      FROM
        User_Box ub
        INNER JOIN Box b ON ub.box_id = b.id
        LEFT JOIN Address a ON b.address_id = a.id
      WHERE
        ub.user_id = $1
    `;
      const result = await connection.query(sql, [userId]);

      return result.rows as (UserBox & Box & Address)[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Assign a box to a user
  async assignBoxToUser(userId: string, boxId: string): Promise<UserBox> {
    const connection = await db.connect();
    try {
      if (!userId || !boxId) {
        throw new Error('Please provide a userId or boxId');
      }

      // Check if the user exists
      const userCheckSql = 'SELECT id FROM users WHERE id=$1';
      const userCheckResult = await connection.query(userCheckSql, [userId]);
      if (userCheckResult.rows.length === 0) {
        throw new Error(`User with ID ${userId} does not exist`);
      }

      // Check if the box exists
      const boxCheckSql = 'SELECT id FROM box WHERE id=$1';
      const boxCheckResult = await connection.query(boxCheckSql, [boxId]);
      if (boxCheckResult.rows.length === 0) {
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
      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific UserBox
  async getOne(id: string): Promise<UserBox> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM User_Box WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update UserBox
  async updateOne(userBox: Partial<UserBox>, id: string): Promise<UserBox> {
    const connection = await db.connect();

    try {
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

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete UserBox
  async deleteOne(id: string): Promise<UserBox> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM User_Box WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find UserBox with ID ${id}`);
      }

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get UserBoxes by Box ID
  async getUserBoxesByBoxId(boxId: string): Promise<UserBox[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM User_Box WHERE box_id=$1`;
      const result = await connection.query(sql, [boxId]);

      return result.rows as UserBox[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // User Assign Box to himself by box serial number after purchase
  async userAssignBoxToHimslef(
    userId: string,
    serialNumber: string,
    addressId: number,
  ): Promise<UserBox> {
    const connection = await db.connect();
    try {
      if (!userId || !serialNumber) {
        throw new Error('Please provide a userId or serialNumber');
      }
      // Check if the user exists
      const userCheckSql = 'SELECT id FROM users WHERE id=$1';
      const userCheckResult = await connection.query(userCheckSql, [userId]);
      if (userCheckResult.rows.length === 0) {
        throw new Error(`User with ID ${userId} does not exist`);
      }

      // Check if the box exists
      const boxCheckSql = 'SELECT id FROM box WHERE serial_number=$1';
      const boxCheckResult = await connection.query(boxCheckSql, [
        serialNumber,
      ]);
      if (boxCheckResult.rows.length === 0) {
        throw new Error(
          `Box with Serial Number ${serialNumber} does not exist`,
        );
      }

      // check if the user already assigned to the box
      const userBoxCheckSql = 'SELECT box_id FROM User_Box WHERE box_id=$1';
      const userBoxCheckResult = await connection.query(userBoxCheckSql, [
        boxCheckResult.rows[0].id,
      ]);

      if (userBoxCheckResult.rows.length > 0) {
        throw new Error(`Box ${serialNumber} Already assigned to a user`);
      }

      const createdAt = new Date();
      const updatedAt = new Date();
      const userBoxId = `${userId}_${boxCheckResult.rows[0].id}`; // Custom user_box id

      const sqlFields = ['id', 'user_id', 'box_id', 'createdAt', 'updatedAt'];
      const sqlParams = [
        userBoxId,
        userId,
        boxCheckResult.rows[0].id,
        createdAt,
        updatedAt,
      ];

      const sql = `INSERT INTO User_Box (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      // Add address to the box
      const addressSql = `UPDATE Box SET address_id=$1 WHERE id=$2`;
      await connection.query(addressSql, [
        addressId,
        boxCheckResult.rows[0].id,
      ]);

      return result.rows[0] as UserBox;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async checkUserBox(user: string, boxId: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      if (!user) {
        throw new Error('Please provide a userId');
      }
      const sql = 'SELECT id FROM User_Box WHERE user_id=$1 AND box_id=$2';
      const result = await connection.query(sql, [user, boxId]);

      if (result.rows.length > 0) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // assign relative user by main user
  async assignRelativeUser(
    userId: string,
    boxId: string,
    email: string,
  ): Promise<UserBox> {
    const connection = await db.connect();
    try {
      if (await this.checkUserBox(userId, boxId)) {
        if (await user.emailExists(email)) {
          const userData = await user.findByEmail(email);

          const userRelative = userData != null ? userData.id : undefined;
          const userBoxData = { user_id: userRelative, box_id: boxId };
          const result = await this.createUserBox(userBoxData);

          return result;
        } else {
          throw new Error(`User with this email ${email} dosne't exist`);
        }
      } else {
        throw new Error(`You don't have enough permissions to do that`);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateUserBoxStatus(is_active: boolean, id: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = `UPDATE User_Box SET is_active = $1 WHERE id = $2`;
      const result = await connection.query(sql, [is_active, id]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default UserBoxModel;
