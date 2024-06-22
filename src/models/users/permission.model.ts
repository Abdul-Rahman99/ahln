// src/models/permission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class PermissionModel {
  async create(title: string, description: string): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO permission (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [title, description]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to create permission: ${(error as Error).message}`,
      );
    }
  }

  async getAll(): Promise<Permission[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM permission';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get permissions: ${(error as Error).message}`);
    }
  }

  async getById(id: number): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM permission WHERE id=$1';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to get permission: ${(error as Error).message}`);
    }
  }

  async update(
    id: number,
    title: string,
    description: string,
  ): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE permission SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
      const result = await connection.query(sql, [title, description, id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to update permission: ${(error as Error).message}`,
      );
    }
  }

  async delete(id: number): Promise<Permission> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM permission WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Unable to delete permission: ${(error as Error).message}`,
      );
    }
  }
}

export default PermissionModel;
