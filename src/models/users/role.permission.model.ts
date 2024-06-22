// src/models/rolePermission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class RolePermissionModel {
  async assignPermission(roleId: number, permissionId: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2)`;
      await connection.query(sql, [roleId, permissionId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to assign permission: ${(error as Error).message}`,
      );
    }
  }

  async revokePermission(roleId: number, permissionId: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2`;
      await connection.query(sql, [roleId, permissionId]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to revoke permission: ${(error as Error).message}`,
      );
    }
  }

  async getPermissionsByRole(roleId: number): Promise<Permission[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT p.* FROM permission p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = $1`;
      const result = await connection.query(sql, [roleId]);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Unable to get permissions by role: ${(error as Error).message}`,
      );
    }
  }
}

export default RolePermissionModel;
