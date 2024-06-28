import db from '../../config/database';
import { BoxImage } from '../../types/box.image.type';

class BoxImageModel {
  // Create new box image
  async createBoxImage(boxImage: Partial<BoxImage>): Promise<BoxImage> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      // Check if the box_id exists
      const checkBoxIdSql = 'SELECT id FROM Box WHERE id=$1';
      const checkBoxIdResult = await connection.query(checkBoxIdSql, [
        boxImage.box_id,
      ]);

      if (checkBoxIdResult.rows.length === 0) {
        throw new Error(`Box with ID ${boxImage.box_id} does not exist`);
      }

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'box_id',
        'image',
        'delivery_package_id',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        boxImage.box_id,
        boxImage.image,
        boxImage.delivery_package_id,
      ];

      const sql = `INSERT INTO Box_IMAGE (${sqlFields.join(', ')}) 
                 VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      connection.release();
      throw new Error(
        `Unable to create box image: ${(error as Error).message}`,
      );
    }
  }

  // Get all box images (filtered by date, delivery package ID, or box ID)
  async getMany({
    date,
    deliveryPackageId,
    boxId,
  }: {
    date?: string;
    deliveryPackageId?: number;
    boxId?: string;
  }): Promise<BoxImage[]> {
    try {
      const connection = await db.connect();

      let sql = 'SELECT * FROM Box_IMAGE WHERE 1=1';

      const results = await connection.query(sql);

      if (results.rows.length === 0) {
        throw new Error('No addresses in the database');
      }
      const queryParams: (string | number)[] = [];

      if (date) {
        sql += ' AND DATE(createdAt) = $1';
        queryParams.push(date);
      }

      if (deliveryPackageId) {
        sql += ' AND delivery_package_id = $2';
        queryParams.push(deliveryPackageId);
      }

      if (boxId) {
        sql += ' AND box_id = $3';
        queryParams.push(boxId);
      }

      const result = await connection.query(sql, queryParams);
      connection.release();
      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error(
        `Error retrieving box images: ${(error as Error).message}`,
      );
    }
  }

  // Get specific box image (filtered by date, delivery package ID, or box ID)
  async getOne({
    id,
    date,
    deliveryPackageId,
    boxId,
  }: {
    id: number;
    date?: string;
    deliveryPackageId?: number;
    boxId?: string;
  }): Promise<BoxImage> {
    try {
      const connection = await db.connect();

      let sql = 'SELECT * FROM Box_IMAGE WHERE id=$1';
      const queryParams: (string | number)[] = [id];

      if (date) {
        sql += ' AND DATE(createdAt) = $2';
        queryParams.push(date);
      }

      if (deliveryPackageId) {
        sql += ' AND delivery_package_id = $3';
        queryParams.push(deliveryPackageId);
      }

      if (boxId) {
        sql += ' AND box_id = $4';
        queryParams.push(boxId);
      }

      const result = await connection.query(sql, queryParams);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find box image with ID ${id}`);
      }

      return result.rows[0] as BoxImage;
    } catch (error) {
      throw new Error(
        `Could not find box image ${id}: ${(error as Error).message}`,
      );
    }
  }
  // Update box image
  async updateOne(boxImage: Partial<BoxImage>, id: number): Promise<BoxImage> {
    try {
      const connection = await db.connect();

      // Check if the box image exists
      const checkSql = 'SELECT * FROM Box_IMAGE WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Box image with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(boxImage)
        .map((key) => {
          if (
            boxImage[key as keyof BoxImage] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(boxImage[key as keyof BoxImage]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the box image ID to the query parameters

      const sql = `UPDATE Box_IMAGE SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as BoxImage;
    } catch (error) {
      throw new Error(
        `Could not update box image ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete box image
  async deleteOne(id: number): Promise<BoxImage> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM Box_IMAGE WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find box image with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as BoxImage;
    } catch (error) {
      throw new Error(
        `Could not delete box image ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default BoxImageModel;
