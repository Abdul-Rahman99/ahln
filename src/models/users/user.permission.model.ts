import { UserPermission } from '../../types/user.permission.type';
import db from '../../config/database';

class UserPermissionModel {
  // create new user_permission
  async create(up: UserPermission): Promise<UserPermission> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO user_permission (user_id, permission_id) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [
        up.user_id,
        up.permission_id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create user_permission: ${(error as Error).message}`,
      );
    }
  }

  // get all user_permissions
  async getMany(): Promise<UserPermission[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM user_permission`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error retrieving user_permissions: ${(error as Error).message}`,
      );
    }
  }

  // get specific user_permission
  async getOne(
    user_id: string,
    permission_id: number,
  ): Promise<UserPermission> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM user_permission WHERE user_id=$1 AND permission_id=$2`;
      const result = await connection.query(sql, [user_id, permission_id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(
          `Could not find user_permission with user ID ${user_id} and permission ID ${permission_id}`,
        );
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not find user_permission: ${(error as Error).message}`,
      );
    }
  }

  // delete user_permission
  async deleteOne(
    user_id: string,
    permission_id: number,
  ): Promise<UserPermission> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM user_permission WHERE user_id=$1 AND permission_id=$2 RETURNING *`;
      const result = await connection.query(sql, [user_id, permission_id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(
          `Could not find user_permission with user ID ${user_id} and permission ID ${permission_id}`,
        );
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete user_permission: ${(error as Error).message}`,
      );
    }
  }
}

export default UserPermissionModel;
