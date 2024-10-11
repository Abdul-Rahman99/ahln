import moment from 'moment-timezone';
import db from '../../config/database';
import { AboutUs } from '../../types/about.us.type';

class AboutUsModel {
  // Create About Us
  async createAboutUs(pageData: Partial<AboutUs>): Promise<AboutUs> {
    const connection = await db.connect();

    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'title',
        'description',
        'email',
        'phone',
        'address',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        pageData.title,
        pageData.description,
        pageData.email,
        pageData.phone,
        pageData.address,
      ];

      const sql = `INSERT INTO About_Us (${sqlFields.join(', ')}) 
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

  // Get all About Us
  async getAllAboutUs(): Promise<AboutUs[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM About_Us';
      const result = await connection.query(sql);

      return result.rows as AboutUs[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific About Us by ID
  async getAboutUsById(id: number): Promise<AboutUs> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM About_Us WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as AboutUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update About Us
  async updateAboutUs(
    id: number,
    pageData: Partial<AboutUs>,
  ): Promise<AboutUs> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(pageData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE About_Us SET ${updateFields}, updatedAt=$${Object.keys(pageData).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(pageData), updatedAt];
      const result = await connection.query(sql, params);

      return result.rows[0] as AboutUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete About Us
  async deleteAboutUs(id: number): Promise<AboutUs> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid About Us ID.',
        );
      }
      const sql = `DELETE FROM About_Us WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find About Us with ID ${id}`);
      }

      return result.rows[0] as AboutUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default AboutUsModel;
