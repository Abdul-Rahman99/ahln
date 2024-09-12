import db from '../../config/database';
import { City } from '../../types/city.type';

class CityModel {
  // create city
  async createCity(city: Partial<City>): Promise<City> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = ['createdAt', 'updatedAt', 'name', 'country'];
      const sqlParams = [createdAt, updatedAt, city.name, city.country];
      const sql = `INSERT INTO City (${sqlFields.join(', ')}) 
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

  async getAllCity(): Promise<City[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT city.id, Country.name as country_name, city.name, city.createdat , city.updatedat  FROM City LEFT JOIN Country ON City.country = Country.id';
      const result = await connection.query(sql);

      return result.rows as City[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get city by id
  async getCityById(id: number): Promise<City> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error('Please provide an ID');
      }
      const sql =
        'SELECT city.id, Country.name as country_name, city.name, city.createdat , city.updatedat FROM City LEFT JOIN Country ON City.country = Country.id WHERE City.id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as City;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update City
  async updateCity(id: number, city: Partial<City>): Promise<City> {
    const connection = await db.connect();
    try {
      const updatedAt = new Date();

      const updateFields = Object.keys(city)
        .map((key, index) => `${key}=$${index + 2}`)
        .join(', ');

      const sql = `UPDATE City SET ${updateFields}, updatedAt=$${Object.keys(city).length + 2} WHERE id=$1 RETURNING *`;

      const params = [id, ...Object.values(city), updatedAt];
      const result = await connection.query(sql, params);

      if (result.rows.length === 0) {
        throw new Error(`Could not find City with ID ${id}`);
      }

      return result.rows[0] as City;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete Mobile Page
  async deleteCity(id: number): Promise<City> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Mobile Page ID.',
        );
      }
      const sql = `DELETE FROM City WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find City with ID ${id}`);
      }

      return result.rows[0] as City;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // check if city exists
  async checkIfCityExists(name: string): Promise<boolean> {
    const connection = await db.connect();
    try {
      if (!name) {
        throw new Error('Please provide a valid City Name');
      }
      const sql = 'SELECT * FROM City WHERE name=$1';
      const result = await connection.query(sql, [name]);
      if (result.rows.length === 0) {
        return false;
      }
      return true;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  
}

export default CityModel;
