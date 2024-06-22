// src/models/userPermission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class UserPermissionModel {
  async assignPermission(userId: string, permissionId: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO user_permission (user_id, permission_id) VALUES ($1, $2)`;
      await connection.query(sql, [userId, permissionId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to assign permission: ${(error as Error).message}`,
      );
    }
  }

  async revokePermission(userId: string, permissionId: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM user_permission WHERE user_id=$1 AND permission_id=$2`;
      await connection.query(sql, [userId, permissionId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to revoke permission: ${(error as Error).message}`,
      );
    }
  }

  async getPermissionsByUser(userId: string): Promise<Permission[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT p.* FROM permission p JOIN user_permission up ON p.id = up.permission_id WHERE up.user_id = $1`;
      const result = await connection.query(sql, [userId]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to get permissions by user: ${(error as Error).message}`,
      );
    }
  }
}

export default UserPermissionModel;
