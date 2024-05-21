import Box from '../types/box.type';
import db from '../config/database';

class BoxModel {
 // create box
  async create(b: Box): Promise<Box> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO boxes (compartments_number, compartments_status, video_id) 
                    VALUES ($1, $2, $3) 
                    RETURNING id, compartments_number, compartments_status, video_id`;

      const result = await connection.query(sql, [
        b.compartments_number,
        b.compartments_status,
        b.video_id,
      ]);
      connection.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create box: ${(error as Error).message}`);
    }
  }

  // get all
  async getMany(): Promise<Box[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM boxes';
      const result = await connection.query(sql);

      if (result.rows.length === 0) {
        throw new Error(`No boxes in the database`);
      }
      connection.release();
      return result.rows as Box[];
    } catch (error) {
      throw new Error(`Error retrieving boxes: ${(error as Error).message}`);
    }
  }

  // get box by id
  async getOne(id: string): Promise<Box> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = `SELECT * FROM boxes WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find box with ID ${id}`);
      }
      connection.release();
      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(`Could not find box ${id}: ${(error as Error).message}`);
    }
  }

  // update box
  async updateOne(b: Partial<Box>, id: string): Promise<Box> {
    try {
      const connection = await db.connect();
      const queryParams: any[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(b)
        .map((key) => {
          if (b[key as keyof Box] !== undefined && key !== 'id') {
            queryParams.push(b[key as keyof Box]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id);

      const sql = `UPDATE boxes SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, compartments_number, compartments_status, video_id`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(`Could not update box: ${(error as Error).message}`);
    }
  }
  // delete box
  async deleteOne(id: string): Promise<Box> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = `DELETE FROM boxes
                    WHERE id=$1
                    RETURNING id, compartments_number, compartments_status, video_id`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find box with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(
        `Could not delete box ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default BoxModel;
