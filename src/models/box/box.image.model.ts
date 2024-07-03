import db from '../../config/database';
import { BoxImage } from '../../types/box.image.type';

export default class BoxImageModel {
  async createBoxImage(
    boxId: string,
    deliveryPackageId: string,
    imageName: string,
  ): Promise<BoxImage> {
    try {
      const connection = await db.connect();

      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'box_id',
        'createdAt',
        'updatedAt',
        'image',
        'delivery_package_id',
      ];
      const sqlParams = [
        boxId,
        createdAt,
        updatedAt,
        imageName,
        deliveryPackageId,
      ];

      const sql = `INSERT INTO Box_IMAGE (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();
      return result.rows[0] as BoxImage;
    } catch (error) {
      throw new Error(
        `Unable to create box image: ${(error as Error).message}`,
      );
    }
  }

  async getAllBoxImages(): Promise<BoxImage[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE`;
      const result = await connection.query(sql);
      connection.release();

      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error(
        `Unable to fetch box images: ${(error as Error).message}`,
      );
    }
  }

  async getBoxImageById(id: number): Promise<BoxImage | null> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      connection.release();

      return result.rows[0] || null;
    } catch (error) {
      throw new Error(
        `Unable to fetch box image with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  async updateBoxImage(
    id: number,
    boxId: string,
    deliveryPackageId: string,
    imageName: string,
  ): Promise<BoxImage> {
    try {
      const connection = await db.connect();
      const updatedAt = new Date();

      const sql = `
        UPDATE Box_IMAGE 
        SET box_id = $1, delivery_package_id = $2, image = $3, updatedAt = $4
        WHERE id = $5
        RETURNING id, createdAt, updatedAt, box_id, image, delivery_package_id
      `;

      const result = await connection.query(sql, [
        boxId,
        deliveryPackageId,
        imageName,
        updatedAt,
        id,
      ]);
      connection.release();

      return result.rows[0] as BoxImage;
    } catch (error) {
      throw new Error(
        `Unable to update box image with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  async deleteBoxImage(id: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM Box_IMAGE WHERE id = $1`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to delete box image with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  async getBoxImagesByUser(userId: string): Promise<BoxImage[]> {
    try {
      const connection = await db.connect();
      const sql = `
        SELECT bi.*
        FROM Box_IMAGE bi
        INNER JOIN Delivery_Package dp ON bi.delivery_package_id = dp.id
        WHERE dp.user_id = $1
      `;
      const result = await connection.query(sql, [userId]);
      connection.release();

      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error(
        `Unable to fetch box images for user ID ${userId}: ${(error as Error).message}`,
      );
    }
  }

  async getBoxImagesByBoxId(boxId: string): Promise<BoxImage[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM Box_IMAGE WHERE box_id = $1`;
      const result = await connection.query(sql, [boxId]);
      connection.release();

      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error(
        `Unable to fetch box images for box ID ${boxId}: ${(error as Error).message}`,
      );
    }
  }

  async getBoxImagesByPackageId(packageId: string): Promise<BoxImage[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT * FROM Box_IMAGE WHERE delivery_package_id = $1`;
      const result = await connection.query(sql, [packageId]);
      connection.release();

      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error(
        `Unable to fetch box images for package ID ${packageId}: ${(error as Error).message}`,
      );
    }
  }
}
