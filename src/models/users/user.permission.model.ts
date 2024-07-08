// src/models/userPermission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class UserPermissionModel {
  //Assign permission to user
  async assignPermission(userId: string, permissionId: number): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `INSERT INTO user_permission (user_id, permission_id) VALUES ($1, $2)`;
      await connection.query(sql, [userId, permissionId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete permission from user
  async revokePermission(userId: string, permissionId: number): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM user_permission WHERE user_id=$1 AND permission_id=$2`;
      await connection.query(sql, [userId, permissionId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all usdr permissions by his id
  async getPermissionsByUserId(userId: string): Promise<Permission[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT p.* FROM permission p JOIN user_permission up ON p.id = up.permission_id WHERE up.user_id = $1`;
      const result = await connection.query(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // check if user has a specific permission
  async checkPermissionAssignment(
    user_id: string,
    permission_id: number,
  ): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = `
        SELECT 1 
        FROM user_permission 
        WHERE user_id = $1 AND permission_id = $2
      `;

      const result = await connection.query(sql, [user_id, permission_id]);

      return result.rows.length > 0; // Returns true if permission is assigned, false otherwise
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default UserPermissionModel;
