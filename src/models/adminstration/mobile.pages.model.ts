import db from '../../config/database';
import { MobilePage } from '../../types/mobile.pages.type';

class MobilePagesModel {
  // Create Mobile Page
  async createMobilePage(pageData: Partial<MobilePage>): Promise<MobilePage> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'title',
        'content_ar',
        'content_en',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        pageData.title,
        pageData.content_ar,
        pageData.content_en,
      ];

      const sql = `INSERT INTO Mobile_Pages (${sqlFields.join(', ')}) 
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

  // Get all Mobile Pages
  async getAllMobilePages(): Promise<MobilePage[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Mobile_Pages';
      const result = await connection.query(sql);

      return result.rows as MobilePage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific Mobile Page by ID
  async getMobilePageByTitle(title: string): Promise<MobilePage> {
    const connection = await db.connect();

    try {
      if (!title) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM Mobile_Pages WHERE title=$1';
      const result = await connection.query(sql, [title]);

      return result.rows[0] as MobilePage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Mobile Page
  async updateMobilePage(
    id: number,
    pageData: Partial<MobilePage>,
  ): Promise<MobilePage> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(pageData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE Mobile_Pages SET ${updateFields}, updatedAt=$${Object.keys(pageData).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(pageData), updatedAt];
      const result = await connection.query(sql, params);

      return result.rows[0] as MobilePage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Mobile Page
  async deleteMobilePage(id: number): Promise<MobilePage> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Mobile Page ID.',
        );
      }
      const sql = `DELETE FROM Mobile_Pages WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find Mobile Page with ID ${id}`);
      }

      return result.rows[0] as MobilePage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default MobilePagesModel;
