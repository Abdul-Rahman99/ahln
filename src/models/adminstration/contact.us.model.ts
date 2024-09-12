import db from '../../config/database';
import { ContactUs } from '../../types/contact.us.type';

class ContactUsModel {
  // create contact us
  async createContactUs(
    contactUsData: Partial<ContactUs>,
    user: string | null,
  ): Promise<ContactUs> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'email',
        'mobile_number',
        'message',
        'created_by',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        contactUsData.email,
        contactUsData.mobile_number,
        contactUsData.message,
        user,
      ];
      const sql = `INSERT INTO Contact_Us (${sqlFields.join(', ')}) 
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

  async getAllContactUs(): Promise<ContactUs[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Contact_Us';
      const result = await connection.query(sql);

      return result.rows as ContactUs[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get contact us by id
  async getContactUsById(id: number): Promise<ContactUs> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM Contact_Us WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as ContactUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Contact Us
  async updateContactUs(
    id: number,
    contactUsData: Partial<ContactUs>,
  ): Promise<ContactUs> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(contactUsData)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE Contact_Us SET ${updateFields}, updatedAt=$${Object.keys(contactUsData).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(contactUsData), updatedAt];
      const result = await connection.query(sql, params);

      return result.rows[0] as ContactUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Mobile Page
  async deleteContactUs(id: number): Promise<ContactUs> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Mobile Page ID.',
        );
      }
      const sql = `DELETE FROM Contact_Us WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find Country with ID ${id}`);
      }

      return result.rows[0] as ContactUs;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default ContactUsModel;
