/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '../../types/box.type';
import db from '../../config/database';
import { UserBox } from '../../types/user.box.type';
import { Address } from '../../types/address.type';
import UserModel from '../users/user.model';
import AddressModel from './address.model';
import moment from 'moment-timezone';

const user = new UserModel();

class UserBoxModel {
  // Create new UserBox
  async createUserBox(userBox: Partial<UserBox>): Promise<UserBox> {
    const connection = await db.connect();
    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

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
        a.city_id,
        a.country_id,
        a.street,
        a.building_number,
        a.building_type,
        a.floor,
        a.lat,
        a.lang,
        a.address,
        b.current_tablet_id,
        c.name AS country_name,
        ci.name AS city_name,
        COALESCE(json_agg(box_locker.*), '[]'::json) AS lockers,
        COALESCE(json_agg(offline_otps.*), '[]'::json) AS offline_otps 
      FROM
        User_Box ub
        INNER JOIN box_locker ON ub.box_id = box_locker.box_id
        LEFT JOIN offline_otps ON ub.box_id = offline_otps.box_id
        INNER JOIN Box b ON ub.box_id = b.id
        LEFT JOIN Address a ON b.address_id = a.id
        LEFT JOIN Country c ON a.country_id = c.id
        LEFT JOIN City ci ON a.city_id = ci.id
      WHERE
        ub.user_id = $1
      GROUP BY
        ub.id,
        b.id,
        a.district,
        a.city_id,
        a.country_id,
        a.street,
        a.building_number,
        a.building_type,
        a.floor,
        a.lat,
        a.lang,
        a.address,
        b.current_tablet_id,
        c.name,
        ci.name
    `;
      const result = await connection.query(sql, [userId]);

      // check if the user is the owner of the box from relative customer table
      // let is_owner: boolean;
      for (const row of result.rows) {
        const sql2 = `SELECT relative_customer.box_id, relative_customer_access.id ,relative_customer_access.updatedAt , relative_customer_access.createdat ,
        relative_customer_access.add_shipment, relative_customer_access.read_owner_shipment, relative_customer_access.read_own_shipment,
        relative_customer_access.create_pin, relative_customer_access.create_offline_otps, relative_customer_access.create_otp,
        relative_customer_access.open_door1, relative_customer_access.open_door2, relative_customer_access.open_door3,
        relative_customer_access.read_playback, relative_customer_access.read_notification, relative_customer_access.craete_realative_customer,
        relative_customer_access.transfer_box_ownership, relative_customer_access.read_history, relative_customer_access.update_box_screen_message,
        relative_customer_access.read_live_stream, relative_customer_access.update_box_data

        FROM relative_customer 
        
        INNER JOIN relative_customer_access 
        ON relative_customer.relative_customer_id = relative_customer_access.relative_customer_id AND relative_customer.box_id = relative_customer_access.box_id
        WHERE relative_customer.relative_customer_id=$1 AND relative_customer.box_id=$2 `;
        const result2 = await connection.query(sql2, [userId, row.id]);

        if (result2.rows.length > 0) {
          row.is_owner = false;
          row.relative_customer_access = result2.rows[0];
        } else {
          row.is_owner = true;
          row.relative_customer_access = {
            id: null,
            createdAt: null,
            updatedAt: null,
            relative_customer_id: row.relative_customer_id,
            box_id: row.box_id,
            add_shipment: true,
            read_owner_shipment: true,
            read_own_shipment: true,
            create_pin: true,
            create_offline_otps: true,
            create_otp: true,
            open_door1: true,
            open_door2: true,
            open_door3: true,
            read_playback: true,
            read_notification: true,
            craete_realative_customer: true,
            transfer_box_ownership: true,
            read_history: true,
            update_box_screen_message: true,
            read_live_stream: true,
            update_box_data: true,
          };
        }
      }

      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Assign a box to a user
  async assignBoxToUser(
    userId: string,
    boxId: string,
    addressId: number,
  ): Promise<UserBox> {
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

      //update the address id in the box
      const updateBoxSql =
        'UPDATE box SET address_id = $1 WHERE id = $2 RETURNING *';
      const updateBoxResult = await connection.query(updateBoxSql, [
        addressId,
        boxId,
      ]);

      if (updateBoxResult.rows.length === 0) {
        throw new Error(`Box with ID ${boxId} does not exist`);
      }

      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();
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
    country_id: number,
    city_id: number,
    street: string,
    district: string,
    boxLabel: string,
    lat: number,
    lang: number,
    address: string,
  ): Promise<UserBox> {
    const connection = await db.connect();
    await connection.query('BEGIN');

    try {
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
      } catch (error) {
        throw new Error((error as Error).message);
      }

      try {
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
        const updatedAt = moment().tz('Asia/Dubai').format();
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

        // check if the box has address or not
        const boxHasAddressSql = 'SELECT address_id FROM Box WHERE id=$1';
        const boxHasAddressResult = await connection.query(boxHasAddressSql, [
          boxCheckResult.rows[0].id,
        ]);

        // If the box has no address, Create new address for the user
        const addressData = {
          district,
          street,
          country_id,
          city_id,
          lat,
          lang,
          address,
        };

        if (boxHasAddressResult.rows[0].address_id === null) {
          const createdAddress = await new AddressModel().createAddress(
            addressData,
            userId,
          );

          //update the box record with the new address id
          const updatedBoxAddressId = await connection.query(
            'UPDATE Box SET address_id=$1 WHERE id=$2',
            [createdAddress.id, boxCheckResult.rows[0].id],
          );

          if (updatedBoxAddressId.rowCount === 0) {
            throw new Error('Failed to update box address');
          }
          // If there is a boxLabel, update it
          if (boxLabel) {
            await connection.query('UPDATE Box SET box_label=$1 WHERE id=$2', [
              boxLabel,
              boxCheckResult.rows[0].id,
            ]);
          }
        } else {
          await new AddressModel().updateOne(
            addressData,
            boxHasAddressResult.rows[0].address_id,
            userId,
          );

          // If there is a boxLabel, update it
          if (boxLabel) {
            await connection.query('UPDATE Box SET box_label=$1 WHERE id=$2', [
              boxLabel,
              boxCheckResult.rows[0].id,
            ]);
          }
        }

        await connection.query('COMMIT');

        return result.rows[0] as UserBox;
      } catch (error) {
        await connection.query('ROLLBACK');
        throw new Error((error as Error).message);
      }
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async checkUserBox(user: string, boxId: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      if (!user && !boxId) {
        throw new Error('Please provide a userId and boxId');
      }
      const sql = 'SELECT * FROM User_Box WHERE user_id=$1 AND box_id=$2';
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
  ): Promise<any> {
    const connection = await db.connect();
    try {
      try {
        if (await this.checkUserBox(userId, boxId)) {
          if (await user.emailExists(email)) {
            const userData = await user.findByEmail(email);

            const userRelative = userData != null ? userData.id : undefined;
            const userBoxData = { user_id: userRelative, box_id: boxId };
            await this.createUserBox(userBoxData);

            const fullObject = `SELECT Box.box_label, users.user_name, users.email ,users.phone_number, Relative_Customer.* 
            FROM Relative_Customer INNER JOIN users ON users.id=Relative_Customer.relative_customer_id INNER JOIN Box ON Box.id=Relative_Customer.box_id 
            WHERE Relative_Customer.relative_customer_id=$1 AND Relative_Customer.box_id=$2`;
            const result2 = await connection.query(fullObject, [
              userRelative,
              boxId,
            ]);

            return result2.rows[0];
          } else {
            throw new Error(`User with this email ${email} dosne't exist`);
          }
        }
      } catch (error) {
        throw new Error((error as Error).message);
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

  // Transfer Box Ownership from one user to another
  async transferBoxOwnership(
    boxId: string,
    newUserId: string,
  ): Promise<UserBox> {
    const connection = await db.connect();
    await connection.query('BEGIN');
    try {
      try {
        const selectId = `SELECT * FROM User_Box WHERE box_id=$1`;
        const result = await connection.query(selectId, [boxId]);
        const deletedId = await this.deleteOne(result.rows[0]?.id);

        if (!deletedId) {
          throw new Error('Failed to delete user box');
        }
      } catch (error) {
        throw new Error((error as Error).message + ', You are not the owner!');
      }

      // delete relative customers from old user
      try {
        const selectId = `SELECT * FROM Relative_Customer WHERE box_id=$1`;
        const result = await connection.query(selectId, [boxId]);
        const deletedId = await this.deleteOne(result.rows[0]?.id);

        if (!deletedId) {
          throw new Error('Failed to delete user box');
        }
      } catch (error) {
        throw new Error((error as Error).message);
      }

      let result2;
      try {
        const newUserBoxData = { user_id: newUserId, box_id: boxId };
        result2 = await this.createUserBox(newUserBoxData);
        if (!result2) {
          throw new Error('Failed to create user box');
        }
      } catch (error) {
        throw new Error((error as Error).message);
      }
      await connection.query('COMMIT');
      return result2;
    } catch (error) {
      await connection.query('ROLLBACK');
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getUserIdByBoxId(boxId: string): Promise<string> {
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
}

export default UserBoxModel;
