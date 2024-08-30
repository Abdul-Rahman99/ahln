/* eslint-disable @typescript-eslint/no-explicit-any */
import { Permission } from '../../types/permission.type';
import db from '../../config/database';
import { RolePermission } from '../../types/role.permission.type';

class RolePermissionModel {
  // Assign permission to role
  async assignPermission(
    roleId: number,
    permissionId: number,
  ): Promise<RolePermission> {
    const connection = await db.connect();

    try {
      const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2) RETURNING *`;
      await connection.query(sql, [roleId, permissionId]);

      const sql2 = `SELECT role_permission.*, Role.title AS role_title, permission.title AS permission_title FROM role_permission INNER JOIN Role ON role_permission.role_id = Role.id INNER JOIN permission ON role_permission.permission_id = permission.id`;

      const result2 = await connection.query(sql2);

      return result2.rows[0] as RolePermission;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Remove permission from role
  async revokePermission(
    roleId: number,
    permissionId: number,
  ): Promise<RolePermission> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2 RETURNING *`;
      const result = await connection.query(sql, [roleId, permissionId]);
      return result.rows[0] as RolePermission;
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

  async getAllRolePermissions(): Promise<Permission[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT role_permission.*, Role.title AS role_title, permission.title AS permission_title FROM role_permission INNER JOIN Role ON role_permission.role_id = Role.id INNER JOIN permission ON role_permission.permission_id = permission.id`;
      const result = await connection.query(sql);
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
