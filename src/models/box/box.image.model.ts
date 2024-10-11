import db from '../../config/database';
import { BoxImage } from '../../types/box.image.type';
import moment from 'moment-timezone';

export default class BoxImageModel {
  async createBoxImage(
    boxId: string,
    deliveryPackageId: string,
    imageName: string,
  ): Promise<BoxImage> {
    const connection = await db.connect();

    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

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

      const createdImage = result.rows[0] as BoxImage;
      createdImage.image = `${process.env.BASE_URL}/uploads/${createdImage.image}`;

      return createdImage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllBoxImages(boxId: string): Promise<BoxImage[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE WHERE box_id=$1`;
      const result = await connection.query(sql, [boxId]);

      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAll(): Promise<BoxImage[]> {
    const connection = await db.connect();
    try {
      const sql = `SELECT * FROM Box_IMAGE`;
      const result = await connection.query(sql);
      result.rows.forEach((row) => {
        row.image = `${process.env.BASE_URL}/uploads/${row.image}`;
      });
      return result.rows as BoxImage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // async getBoxImageById(id: number): Promise<BoxImage | null> {
  //   const connection = await db.connect();

  //   try {
  //     const sql = `SELECT id, createdAt, updatedAt, box_id, image, delivery_package_id FROM Box_IMAGE WHERE id = $1`;
  //     const result = await connection.query(sql, [id]);

  //     return result.rows[0] || null;
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   } finally {
  //     connection.release();
  //   }
  // }

  // async updateBoxImage(
  //   id: number,
  //   boxId: string,
  //   deliveryPackageId: string,
  //   imageName: string,
  // ): Promise<BoxImage> {
  //   const connection = await db.connect();

  //   try {
  //     const updatedAt = new Date();

  //     const sql = `
  //       UPDATE Box_IMAGE
  //       SET box_id = $1, delivery_package_id = $2, image = $3, updatedAt = $4
  //       WHERE id = $5
  //       RETURNING id, createdAt, updatedAt, box_id, image, delivery_package_id
  //     `;

  //     const result = await connection.query(sql, [
  //       boxId,
  //       deliveryPackageId,
  //       imageName,
  //       updatedAt,
  //       id,
  //     ]);

  //     return result.rows[0] as BoxImage;
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   } finally {
  //     connection.release();
  //   }
  // }

  // async deleteBoxImage(id: number): Promise<void> {
  //   const connection = await db.connect();

  //   try {
  //     const sql = `DELETE FROM Box_IMAGE WHERE id = $1`;
  //     await connection.query(sql, [id]);
  //   } catch (error) {
  //     throw new Error((error as Error).message);
  //   } finally {
  //     connection.release();
  //   }
  // }

  // async getBoxImagesByUser(userId: string): Promise<BoxImage[]> {
  //   const connection = await db.connect();

  //   try {
  //     const sql = `
  //       SELECT bi.*
  //       FROM Box_IMAGE bi
  //       INNER JOIN Delivery_Package dp ON bi.delivery_package_id = dp.id
  //       WHERE dp.customer_id = $1
  //     `;
  //     const result = await connection.query(sql, [userId]);

  //     const boxImages = result.rows as BoxImage[];
  //     return boxImages.map((image) => ({
  //       ...image,
  //       image: `${process.env.BASE_URL}/uploads/${image.image}`,
  //     }));
  //   } catch (error) {
  //     throw new Error(
  //       (error as Error).message,
  //     );
  //   } finally {
  //     connection.release();
  //   }
  // }

  async getBoxImagesByBoxId(boxId: string): Promise<BoxImage[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM Box_IMAGE WHERE box_id = $1`;
      const result = await connection.query(sql, [boxId]);

      const boxImages = result.rows as BoxImage[];
      return boxImages.map((image) => ({
        ...image,
        image: `${process.env.BASE_URL}/uploads/${image.image}`,
      }));
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getBoxImagesByPackageId(packageId: string): Promise<BoxImage[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT * FROM Box_IMAGE WHERE delivery_package_id = $1`;
      const result = await connection.query(sql, [packageId]);

      const boxImages = result.rows as BoxImage[];
      return boxImages.map((image) => ({
        ...image,
        image: `${process.env.BASE_URL}/uploads/${image.image}`,
      }));
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
