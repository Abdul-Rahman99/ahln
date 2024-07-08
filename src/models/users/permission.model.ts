// src/models/permission.model.ts
import { Permission } from '../../types/permission.type';
import db from '../../config/database';

class PermissionModel {
  async create(title: string, description: string): Promise<Permission> {
    const connection = await db.connect();

    try {
      const sql = `INSERT INTO permission (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [title, description]);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAll(): Promise<Permission[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM permission';
      const result = await connection.query(sql);
      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getById(id: number): Promise<Permission> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM permission WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async update(
    id: number,
    title: string,
    description: string,
  ): Promise<Permission> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE permission SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
      const result = await connection.query(sql, [title, description, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<Permission> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM permission WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default PermissionModel;
