import db from '../../config/database';
import { Country } from '../../types/country.type';

class CountryModel {
  // create country
  async createCountry(country: Partial<Country>): Promise<Country> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'code', 'name'];
      const sqlParams = [createdAt, updatedAt, country.code, country.name];
      const sql = `INSERT INTO Country (${sqlFields.join(', ')}) 
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

  async getAllCountry(): Promise<Country[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM Country';
      const result = await connection.query(sql);

      return result.rows as Country[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get country by id
  async getCountryById(id: number): Promise<Country> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql = 'SELECT * FROM Country WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as Country;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update Contact Us
  async updateCountry(id: number, country: Partial<Country>): Promise<Country> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(country)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE Country SET ${updateFields}, updatedAt=$${Object.keys(country).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(country), updatedAt];
      const result = await connection.query(sql, params);

      return result.rows[0] as Country;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Mobile Page
  async deleteCountry(id: number): Promise<Country> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Mobile Page ID.',
        );
      }
      const sql = `DELETE FROM Country WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find Mobile Page with ID ${id}`);
      }

      return result.rows[0] as Country;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default CountryModel;
