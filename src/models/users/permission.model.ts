import { Permission } from '../../types/users/permission.type';
import db from '../../config/database';

class PermissionModel {
  // create new permission
  async create(p: Permission): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO permission (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [p.title, p.description]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create permission: ${(error as Error).message}`,
      );
    }
  }

  // get all permissions
  async getMany(): Promise<Permission[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM permission`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `Error retrieving permissions: ${(error as Error).message}`,
      );
    }
  }

  // get specific permission
  async getOne(id: number): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM permission WHERE id=$1`;
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find permission with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not find permission ${id}: ${(error as Error).message}`,
      );
    }
  }

  // update permission
  async updateOne(p: Partial<Permission>, id: number): Promise<Permission> {
    try {
      const connection = await db.connect();
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(p)
        .map((key) => {
          queryParams.push(p[key as keyof Permission]);
          return `${key}=$${paramIndex++}`;
        })
        .join(', ');

      queryParams.push(id);

      const sql = `UPDATE permission SET ${updateFields} WHERE id=$${paramIndex} RETURNING *`;
      const result = await connection.query(sql, queryParams);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update permission ${id}: ${(error as Error).message}`,
      );
    }
  }

  // delete permission
  async deleteOne(id: number): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM permission WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find permission with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete permission ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default PermissionModel;
