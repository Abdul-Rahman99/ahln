// src/models/role.model.ts
import { Role } from 'src/types/role.type';
import db from '../../config/database';

class RoleModel {
  async create(title: string, description: string): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO role (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [title, description]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create role: ${(error as Error).message}`);
    }
  }

  async getAll(): Promise<Role[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM role';
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Unable to get roles: ${(error as Error).message}`);
    }
  }

  async getById(id: number): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM role WHERE id=$1';
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to get role: ${(error as Error).message}`);
    }
  }

  async update(id: number, title: string, description: string): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `UPDATE role SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
      const result = await connection.query(sql, [title, description, id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to update role: ${(error as Error).message}`);
    }
  }

  async delete(id: number): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM role WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to delete role: ${(error as Error).message}`);
    }
  }
}

export default RoleModel;
