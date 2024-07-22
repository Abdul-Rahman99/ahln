import { SystemLog } from '../../types/system.log.type';
import db from '../../config/database';

class SystemLogModel {
  // create new System Log
  async createSystemLog(
    user: string,
    error: string,
    source: string,
  ): Promise<SystemLog | null> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'user_id',
        'error',
        'source',
      ];
      const sqlParams = [createdAt, updatedAt, user, error, source];
      const sql = `INSERT INTO System_Log (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                     RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as SystemLog;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all system logs
  async getAllSystemLogs(): Promise<SystemLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM System_Log';
      const result = await connection.query(sql);

      return result.rows as SystemLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all system logs by id
  async getSystemLogById(id: number): Promise<SystemLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM System_Log WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows as SystemLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update system log
  async updateSystemLog(t: Partial<SystemLog>, id: string): Promise<SystemLog> {
    const connection = await db.connect();

    try {
      // Check if the tablet exists
      const checkSql = 'SELECT * FROM System_Log WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`System Log with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(t)
        .map((key) => {
          if (
            t[key as keyof SystemLog] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(t[key as keyof SystemLog]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the system log ID to the query parameters

      const sql = `UPDATE System_Log SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as SystemLog;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // delete system logs by id
  async deleteSystemLogById(id: number): Promise<SystemLog[]> {
    const connection = await db.connect();

    try {
      const sql = 'DELETE FROM System_Log WHERE id=$1 RETURNING *';
      const result = await connection.query(sql, [id]);

      return result.rows as SystemLog[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default SystemLogModel;
