// src/models/userPermission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class UserPermissionModel {

  //Assign permission to user
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

  // Delete permission from user
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

  // Get all usdr permissions by his id
  async getPermissionsByUserId(userId: string): Promise<Permission[]> {
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

  // check if user has a specific permission
  async checkPermissionAssignment(
    user_id: string,
    permission_id: number,
  ): Promise<boolean> {
    try {
      const connection = await db.connect();

      const sql = `
        SELECT 1 
        FROM user_permission 
        WHERE user_id = $1 AND permission_id = $2
      `;

      const result = await connection.query(sql, [user_id, permission_id]);
      connection.release();

      return result.rows.length > 0; // Returns true if permission is assigned, false otherwise
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(`Error checking permission assignment: ${error.message}`);
      throw new Error(
        `Could not check permission assignment: ${error.message}`,
      );
    }
  }
}

export default UserPermissionModel;
