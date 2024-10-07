import db from '../../config/database';
import { Versions } from '../../types/versions.type';

class VersionsModel {
  // create verions
  async createVersions(verions: Partial<Versions>): Promise<Versions> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'IOS', 'Android'];
      const sqlParams = [createdAt, updatedAt, verions.IOS, verions.Android];
      const sql = `INSERT INTO Versions (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
      const result = await connection.query(sql, sqlParams);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllVersions(): Promise<Versions[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Versions ORDER BY createdat DESC';
      const result = await connection.query(sql);

      return result.rows as Versions[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // get all cities by country id
  async getCitiesByCountryId(id: number): Promise<Versions[]> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM Versions WHERE id = $1';
      const result = await connection.query(sql, [id]);
      return result.rows as Versions[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Versions
  async updateVersions(
    id: number,
    verions: Partial<Versions>,
  ): Promise<Versions> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(verions)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE Versions SET ${updateFields}, updatedAt=$${Object.keys(verions).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(verions), updatedAt];
      const result = await connection.query(sql, params);

      if (result.rows.length === 0) {
        throw new Error(`Could not find Versions with ID ${id}`);
      }

      return result.rows[0] as Versions;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Versions
  async deleteVersions(id: number): Promise<Versions> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Mobile Page ID.',
        );
      }
      const sql = `DELETE FROM Versions WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find Versions with ID ${id}`);
      }

      return result.rows[0] as Versions;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default VersionsModel;
