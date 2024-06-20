import { RolePermission } from '../../types/role.permission.type';
import db from '../../config/database';

class RolePermissionModel {
  // create new role_permission
  async create(rp: RolePermission): Promise<RolePermission> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [
        rp.role_id,
        rp.permission_id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create role_permission: ${(error as Error).message}`,
      );
    }
  }

  // get all role_permissions
  async getMany(): Promise<RolePermission[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM role_permission`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error retrieving role_permissions: ${(error as Error).message}`,
      );
    }
  }

  // get specific role_permission
  async getOne(
    role_id: number,
    permission_id: number,
  ): Promise<RolePermission> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM role_permission WHERE role_id=$1 AND permission_id=$2`;
      const result = await connection.query(sql, [role_id, permission_id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(
          `Could not find role_permission with role ID ${role_id} and permission ID ${permission_id}`,
        );
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not find role_permission: ${(error as Error).message}`,
      );
    }
  }

  // delete role_permission
  async deleteOne(
    role_id: number,
    permission_id: number,
  ): Promise<RolePermission> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2 RETURNING *`;
      const result = await connection.query(sql, [role_id, permission_id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(
          `Could not find role_permission with role ID ${role_id} and permission ID ${permission_id}`,
        );
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete role_permission: ${(error as Error).message}`,
      );
    }
  }
}

export default RolePermissionModel;
