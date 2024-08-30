import db from '../../config/database';
import { AuditTrail } from '../../types/audit.trail.type';

export default class AuditTrailModel {
  async createAuditTrail(
    user_id: string,
    action: string,
    message: string,
  ): Promise<AuditTrail> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'user_id',
        'action',
        'message',
      ];
      const sqlParams = [createdAt, updatedAt, user_id, action, message];
      const sql = `INSERT INTO Audit_Trail (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as AuditTrail;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllAuditTrail(): Promise<AuditTrail[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM Audit_Trail`;
      const result = await connection.query(sql);

      return result.rows as AuditTrail[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAuditTrailById(id: number): Promise<AuditTrail | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM Audit_Trail WHERE id = $1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update audit trail
  async updateOne(
    auditTrailData: Partial<AuditTrail>,
    id: number,
  ): Promise<AuditTrail> {
    const connection = await db.connect();
    try {
      // Check if the auditTrail exists
      const checkSql = 'SELECT * FROM Audit_Trail WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Audit Trail with ID ${id} does not exist`);
      }
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(auditTrailData)
        .map((key) => {
          if (
            auditTrailData[key as keyof AuditTrail] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(auditTrailData[key as keyof AuditTrail]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the Audit Trail ID to the query parameters

      const sql = `UPDATE Audit_Trail SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as AuditTrail;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteAuditTrail(id: number): Promise<AuditTrail> {
    const connection = await db.connect();
    try {
      const sql = `DELETE FROM Audit_Trail WHERE id = $1 RETURNING *`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as AuditTrail;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
