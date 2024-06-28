/* eslint-disable @typescript-eslint/no-explicit-any */
import { Box } from '../../types/box.type';
import db from '../../config/database';
import pool from '../../config/database';
import BoxLockerModel from '../../models/box/box.locker.model';

class BoxModel {
  private boxLockerModel = new BoxLockerModel();
  // Create new box
  // Create new box
  async createBox(box: Partial<Box>): Promise<Box> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      // Function to generate box id
      async function generateBoxId() {
        try {
          const currentYear = new Date().getFullYear().toString().slice(-2); // Get the current year in two-digit format
          let nextId = 1;

          // Fetch the next sequence value (box number)
          const result = await pool.query(
            'SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Box',
          );
          if (result.rows.length > 0) {
            nextId = (result.rows[0].max_id || 0) + 1;
          }

          // Format the next id as U1000002, U1000003, etc.
          const nextIdFormatted = nextId.toString().padStart(7, '0');

          // Construct the box_id
          const id = `Ahln_${currentYear}_B${nextIdFormatted}`;
          return id;
        } catch (error: any) {
          console.error('Error generating box_id:', error.message);
          throw error;
        }
      }

      // Generate box id
      const id = await generateBoxId();

      // Fetch the box generation to get the number of doors
      const generationResult = await connection.query(
        'SELECT * FROM Box_Generation WHERE id=$1',
        [box.box_model_id],
      );

      if (generationResult.rows.length === 0) {
        throw new Error(
          `Box generation with ID ${box.box_model_id} does not exist`,
        );
      }

      const boxGeneration = generationResult.rows[0];
      const numberOfDoors = boxGeneration.number_of_doors;

      const sqlFields = [
        'id',
        'serial_number',
        'box_label',
        'createdAt',
        'updatedAt',
        'has_empty_lockers',
        'current_tablet_id',
        'previous_tablet_id',
        'box_model_id',
        'address_id',
      ];
      const sqlParams = [
        id,
        box.serial_number,
        box.box_label,
        createdAt,
        updatedAt,
        box.has_empty_lockers,
        box.current_tablet_id,
        box.previous_tablet_id,
        box.box_model_id,
        box.address_id,
      ];

      const sql = `INSERT INTO Box (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      // Create box lockers according to the number of doors
      for (let i = 1; i <= numberOfDoors; i++) {
        const lockerId = `${id}_${i}`;
        const lockerLabel = `Locker ${i}`;
        await this.boxLockerModel.createBoxLocker({
          id: lockerId,
          locker_label: lockerLabel,
          serial_port: `SerialPort${i}`,
          createdAt,
          updatedAt,
          is_empty: true,
          box_id: id,
        });
      }

      connection.release();
      return result.rows[0];
    } catch (error) {
      connection.release();
      throw new Error(`Unable to create box: ${(error as Error).message}`);
    }
  }

  // Get all boxes
  async getMany(): Promise<Box[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM Box';
      const result = await connection.query(sql);

      if (result.rows.length === 0) {
        throw new Error('No boxes in the database');
      }
      connection.release();
      return result.rows as Box[];
    } catch (error) {
      throw new Error(`Error retrieving boxes: ${(error as Error).message}`);
    }
  }

  // Get specific box
  async getOne(id: string): Promise<Box> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = 'SELECT * FROM Box WHERE id=$1';
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

  // Update box
  async updateOne(box: Partial<Box>, id: string): Promise<Box> {
    try {
      const connection = await db.connect();

      // Check if the box exists
      const checkSql = 'SELECT * FROM Box WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(box)
        .map((key) => {
          if (
            box[key as keyof Box] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(box[key as keyof Box]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the box ID to the query parameters

      const sql = `UPDATE Box SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as Box;
    } catch (error) {
      throw new Error(
        `Could not update box ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete box
  async deleteOne(id: string): Promise<Box> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid box ID.');
      }
      const sql = `DELETE FROM Box WHERE id=$1 RETURNING *`;

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

  // Fetch all the boxes with it't generation
  async getBoxesByGenerationId(boxGenerationId: string): Promise<Box[]> {
    try {
      const connection = await db.connect();
      // Check if the box generation id exists
      const checkSql = 'SELECT * FROM Box_Generation WHERE id=$1';
      const checkResult = await connection.query(checkSql, [boxGenerationId]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box with ID ${boxGenerationId} does not exist`);
      }
      const sql = `
        SELECT * FROM Box
        WHERE box_model_id = $1
      `;
      const result = await connection.query(sql, [boxGenerationId]);
      connection.release();

      return result.rows as Box[];
    } catch (error) {
      throw new Error(
        `Error fetching boxes by box generation ID: ${(error as Error).message}`,
      );
    }
  }
}

export default BoxModel;
