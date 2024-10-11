/* eslint-disable @typescript-eslint/no-explicit-any */
import { BoxGeneration } from '../../types/box.generation.type';
import moment from 'moment-timezone';
import db from '../../config/database';

class BoxGenerationModel {
  // Generate a unique box generation ID
  async generateBoxGenerationId(): Promise<string> {
    try {
      const currentYear = new Date().getFullYear().toString().slice(-2); // Get the current year in two-digit format
      let nextId = 1;

      // Fetch the next sequence value (box generation number)
      const result = await db.query(
        'SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Box_Generation',
      );
      if (result.rows.length > 0) {
        nextId = (result.rows[0].max_id || 0) + 1;
      }

      // Format the next id as BG1000002, BG1000003, etc.
      const nextIdFormatted = nextId.toString().padStart(7, '0');

      // Construct the box_generation_id
      const id = `AHLN_${currentYear}_BG${nextIdFormatted}`;
      return id;
    } catch (error: any) {
      throw new Error((error as Error).message);
    }
  }

  // Create new box generation
  async createBoxGeneration(b: Partial<BoxGeneration>): Promise<BoxGeneration> {
    const connection = await db.connect();

    try {
      // Required fields
      const requiredFields: string[] = ['model_name', 'number_of_doors'];
      const providedFields: string[] = Object.keys(b).filter(
        (key) => b[key as keyof BoxGeneration] !== undefined,
      );

      if (!requiredFields.every((field) => providedFields.includes(field))) {
        throw new Error('Model name and number of doors are required fields.');
      }

      // Generate box generation ID
      const id = await this.generateBoxGenerationId(); // Await here to get the new ID string

      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      // Prepare SQL query based on provided fields
      const sqlFields: string[] = [
        'id',
        'model_name',
        'createdAt',
        'updatedAt',
        'number_of_doors',
        'width',
        'height',
        'color',
        'model_image',
        'has_outside_camera',
        'has_inside_camera',
        'has_tablet',
      ];
      const sqlParams: unknown[] = [
        id,
        b.model_name,
        createdAt,
        updatedAt,
        b.number_of_doors,
        b.width,
        b.height,
        b.color,
        b.model_image,
        b.has_outside_camera,
        b.has_inside_camera,
        b.has_tablet,
      ];

      const sql = `INSERT INTO Box_Generation (${sqlFields.join(', ')}) 
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

  // Get all box generations
  async getMany(): Promise<BoxGeneration[]> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM Box_Generation';
      const result = await connection.query(sql);

      // if (result.rows.length === 0) {
      //   throw new Error('No box generations in the database');
      // }
      return result.rows as BoxGeneration[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific box generation
  async getOne(id: string): Promise<BoxGeneration> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box generation ID.',
        );
      }
      const sql = `SELECT * FROM Box_Generation WHERE id=$1`;

      const result = await connection.query(sql, [id]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find box generation with ID ${id}`);
      // }
      return result.rows[0] as BoxGeneration;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update box generation
  async updateOne(
    b: Partial<BoxGeneration>,
    id: string,
  ): Promise<BoxGeneration> {
    const connection = await db.connect();
    try {
      // Check if the box generation exists
      const checkSql = 'SELECT * FROM Box_Generation WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box Generation with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(b)
        .map((key) => {
          if (
            b[key as keyof BoxGeneration] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(b[key as keyof BoxGeneration]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the box generation ID to the query parameters

      const sql = `UPDATE Box_Generation SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      return result.rows[0] as BoxGeneration;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete box generation
  async deleteOne(id: string): Promise<BoxGeneration> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid box generation ID.',
        );
      }
      const sql = `DELETE FROM Box_Generation WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      return result.rows[0] as BoxGeneration;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check if a model name already exists in the database
  async modelNameExists(model_name: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT * FROM Box_Generation WHERE model_name=$1';
      const result = await connection.query(sql, [model_name]);

      return result.rows.length > 0;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async findModelNameById(id: string): Promise<string> {
    const connection = await db.connect();
    try {
      const sql = 'SELECT model_name FROM Box_Generation WHERE id=$1';
      const result = await connection.query(sql, [id]);
      console.log(result.rows[0].model_name);

      return result.rows[0].model_name;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default BoxGenerationModel;
