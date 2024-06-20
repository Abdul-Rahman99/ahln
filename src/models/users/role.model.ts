import { Role } from '../../types/users/role.type';
import db from '../../config/database';

class RoleModel {
  // create new role
  async create(r: Role): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO role (title, description) VALUES ($1, $2) RETURNING *`;
      const result = await connection.query(sql, [r.title, r.description]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create role: ${(error as Error).message}`);
    }
  }

  // get all roles
  async getMany(): Promise<Role[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM role`;
      const result = await connection.query(sql);
      connection.release();
      return result.rows;
    } catch (error) {
      throw new Error(`Error retrieving roles: ${(error as Error).message}`);
    }
  }

  // get specific role
  async getOne(id: number): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM role WHERE id=$1`;
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find role with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not find role ${id}: ${(error as Error).message}`);
    }
  }

  // update role
  async updateOne(r: Partial<Role>, id: number): Promise<Role> {
    try {
      const connection = await db.connect();
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(r)
        .map((key) => {
          queryParams.push(r[key as keyof Role]);
          return `${key}=$${paramIndex++}`;
        })
        .join(', ');

      queryParams.push(id);

      const sql = `UPDATE role SET ${updateFields} WHERE id=$${paramIndex} RETURNING *`;
      const result = await connection.query(sql, queryParams);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not update role ${id}: ${(error as Error).message}`,
      );
    }
  }

  // delete role
  async deleteOne(id: number): Promise<Role> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM role WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();
      if (result.rows.length === 0) {
        throw new Error(`Could not find role with ID ${id}`);
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete role ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default RoleModel;
