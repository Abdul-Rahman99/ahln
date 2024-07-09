import db from '../../config/database';
import { Audit_Trail } from '../../types/audit.trail.type';

export default class AuditTrailModel {
  async createAudit_Trail(
    user_id: string,
    action: string,
  ): Promise<Audit_Trail> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'user_id',
        'action',
      ];
      const sqlParams = [createdAt, updatedAt, user_id, action];
      const sql = `INSERT INTO Audit_Trail (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as Audit_Trail;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllAudit_Trails(): Promise<Audit_Trail[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, user_id,action FROM Audit_Trail`;
      const result = await connection.query(sql);

      return result.rows as Audit_Trail[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAudit_TrailById(id: number): Promise<Audit_Trail | null> {
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


  async deleteAudit_Trail(id: number): Promise<void> {
    const connection = await db.connect();
    try {
      const sql = `DELETE FROM Audit_Trail WHERE id = $1`;
      await connection.query(sql, [id]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
