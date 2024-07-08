// src/models/role.model.ts
import { Role } from 'src/types/role.type';
import db from '../../config/database';

class RoleModel {
  async create(title: string, description: string): Promise<Role> {
    const connection = await db.connect();

    try {
      const sql = `INSERT INTO role (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [title, description]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAll(): Promise<Role[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM role';
      const result = await connection.query(sql);

      return result.rows;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getById(id: number): Promise<Role> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM role WHERE id=$1';
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async update(id: number, title: string, description: string): Promise<Role> {
    const connection = await db.connect();

    try {
      const sql = `UPDATE role SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
      const result = await connection.query(sql, [title, description, id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async delete(id: number): Promise<Role> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM role WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default RoleModel;
