import db from '../../config/database';
import { ShippingCompany } from '../../types/shipping.company.type';

export default class ShippingCompanyModel {
  async createShippingCompany(
    trackingSystem: string,
    title: string,
    logo: string,
  ): Promise<ShippingCompany> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'tracking_system',
        'createdAt',
        'updatedAt',
        'title',
        'logo',
      ];
      const sqlParams = [trackingSystem, createdAt, updatedAt, title, logo];

      const sql = `INSERT INTO Shipping_Company (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      return result.rows[0] as ShippingCompany;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getAllShippingCompanies(): Promise<ShippingCompany[]> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company`;
      const result = await connection.query(sql);

      return result.rows as ShippingCompany[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async getShippingCompanyById(id: number): Promise<ShippingCompany | null> {
    const connection = await db.connect();

    try {
      const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company WHERE id = $1`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] || null;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async updateShippingCompany(
    shipping_company: Partial<ShippingCompany>,
    id: number,
  ): Promise<ShippingCompany> {
    const connection = await db.connect();
    try {
      // Check if the shipping_company exists
      const checkSql = 'SELECT * FROM Shipping_Company WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Shipping Company with ID ${id} does not exist`);
      }
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(shipping_company)
        .map((key) => {
          if (
            shipping_company[key as keyof ShippingCompany] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(shipping_company[key as keyof ShippingCompany]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the shipping_company ID to the query parameters

      const sql = `UPDATE Shipping_Company SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as ShippingCompany;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async deleteShippingCompany(id: number): Promise<void> {
    const connection = await db.connect();
    try {
      const sql = `DELETE FROM Shipping_Company WHERE id = $1`;
      await connection.query(sql, [id]);
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}
