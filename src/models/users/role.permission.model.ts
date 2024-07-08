/* eslint-disable @typescript-eslint/no-explicit-any */
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class RolePermissionModel {
  // Assign permission to role
  async assignPermission(roleId: number, permissionId: number): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2)`;
      await connection.query(sql, [roleId, permissionId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Remove permission from role
  async revokePermission(roleId: number, permissionId: number): Promise<void> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2`;
      await connection.query(sql, [roleId, permissionId]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getPermissionsByRole(roleId: number): Promise<Permission[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT p.* FROM permission p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = $1`;
      const result = await connection.query(sql, [roleId]);
      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // check if role has a specific permission id
  async checkPermissionAssignment(
    role_id: number,
    permission_id: number,
  ): Promise<boolean> {
    const connection = await db.connect();

    try {
      const sql = `
        SELECT 1 
        FROM role_permission 
        WHERE role_id = $1 AND permission_id = $2
      `;

      const result = await connection.query(sql, [role_id, permission_id]);

      return result.rows.length > 0; // Returns true if permission is assigned, false otherwise
    } catch (error: any) {
      console.error(`Error checking permission assignment: ${error.message}`);
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default RolePermissionModel;
