import db from '../../config/database';
import { UserGuide } from '../../types/user.guide.type';

class UserGuideModel {
  // Create About Us
  async createUserGuide(pageData: Partial<UserGuide>): Promise<UserGuide> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'pdf_link', 'video_link'];
      const sqlParams = [
        createdAt,
        updatedAt,
        pageData.pdf_link,
        pageData.video_link,
      ];

      const sql = `INSERT INTO User_Guide (${sqlFields.join(', ')}) 
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
  async getAllUserGuide(): Promise<UserGuide[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM User_Guide';
      const result = await connection.query(sql);

      return result.rows as UserGuide[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific About Us by ID
  async getUserGuideById(id: number): Promise<UserGuide> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM User_Guide WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as UserGuide;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update About Us
  async updateUserGuide(
    id: number,
    pageData: Partial<UserGuide>,
  ): Promise<UserGuide> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(pageData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE User_Guide SET ${updateFields}, updatedAt=$${Object.keys(pageData).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(pageData), updatedAt];
      const result = await connection.query(sql, params);

      return result.rows[0] as UserGuide;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete About Us
  async deleteUserGuide(id: number): Promise<UserGuide> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid About Us ID.',
        );
      }
      const sql = `DELETE FROM User_Guide WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find About Us with ID ${id}`);
      }

      return result.rows[0] as UserGuide;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default UserGuideModel;
