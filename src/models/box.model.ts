import Box from '../types/box.type';
import db from '../config/database';

class BoxModel {
  // Create box
  async create(b: Box): Promise<Box> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO box (compartments_number, compartment1, compartment2, compartment3, video_id) 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt`;

      const result = await connection.query(sql, [
        b.compartments_number,
        b.compartment1,
        b.compartment2,
        b.compartment3,
        b.video_id,
      ]);
      connection.release();

      const box = result.rows[0];
      return box;
    } catch (error) {
      throw new Error(`Unable to create box: ${(error as Error).message}`);
    }
  }

  // Get all boxes
  async getMany(): Promise<Box[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM box';
      const result = await connection.query(sql);
      connection.release();

      return result.rows as Box[];
    } catch (error) {
      throw new Error(`Error retrieving boxes: ${(error as Error).message}`);
    }
  }

  // Get box by id
  async getOne(id: string): Promise<Box> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = `SELECT * FROM box WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find box with ID ${id}`);
      }

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(`Could not find box ${id}: ${(error as Error).message}`);
    }
  }

  // Update box
  async updateOne(b: Partial<Box>, id: string): Promise<Box> {
    try {
      const connection = await db.connect();
      const queryParams: any[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(b)
        .map((key) => {
          if (b[key as keyof Box] !== undefined && key !== 'id') {
            if (
              key === 'compartment1' ||
              key === 'compartment2' ||
              key === 'compartment3'
            ) {
              if (typeof b[key as keyof Box] !== 'boolean') {
                throw new Error(`Field ${key} must be a boolean`);
              }
            }
            queryParams.push(b[key as keyof Box]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id);

      const sql = `UPDATE box SET ${updateFields.join(
        ', ',
      )} WHERE id=$${paramIndex} RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(`Could not update box: ${(error as Error).message}`);
    }
  }

  // Delete box
  async deleteOne(id: string): Promise<Box> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = `DELETE FROM box
                    WHERE id=$1
                    RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt`;

      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find box with ID ${id}`);
      }

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(
        `Could not delete box ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default BoxModel;
