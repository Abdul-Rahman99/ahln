import db from '../../config/database';
import { ShippingCompany } from '../../types/shipping.company.type';

export default class ShippingCompanyModel {
  async createShippingCompany(
    trackingSystem: string,
    title: string,
    logo: string,
  ): Promise<ShippingCompany> {
    try {
      const connection = await db.connect();

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
      connection.release();
      return result.rows[0] as ShippingCompany;
    } catch (error) {
      throw new Error(
        `Unable to create shipping company: ${(error as Error).message}`,
      );
    }
  }

  async getAllShippingCompanies(): Promise<ShippingCompany[]> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company`;
      const result = await connection.query(sql);
      connection.release();

      return result.rows as ShippingCompany[];
    } catch (error) {
      throw new Error(
        `Unable to fetch shipping companies: ${(error as Error).message}`,
      );
    }
  }

  async getShippingCompanyById(id: number): Promise<ShippingCompany | null> {
    try {
      const connection = await db.connect();
      const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company WHERE id = $1`;
      const result = await connection.query(sql, [id]);
      connection.release();

      return result.rows[0] || null;
    } catch (error) {
      throw new Error(
        `Unable to fetch shipping company with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  async updateShippingCompany(
    id: number,
    updateFields: Partial<ShippingCompany>,
  ): Promise<ShippingCompany> {
    try {
      const connection = await db.connect();
      const updatedAt = new Date();

      // Prepare the dynamic SQL query
      const sqlFields: string[] = [];
      const sqlParams: unknown[] = [updatedAt];

      let paramIndex = 2; // Start from 2 because updatedAt is the first parameter

      if (updateFields.tracking_system) {
        sqlFields.push(`tracking_system = $${paramIndex++}`);
        sqlParams.push(updateFields.tracking_system);
      }
      if (updateFields.title) {
        sqlFields.push(`title = $${paramIndex++}`);
        sqlParams.push(updateFields.title);
      }
      if (updateFields.logo) {
        sqlFields.push(`logo = $${paramIndex++}`);
        sqlParams.push(updateFields.logo);
      }

      if (sqlFields.length === 0) {
        throw new Error('No fields to update');
      }

      sqlFields.push(`updatedAt = $1`); // Ensure updatedAt is always set

      const sql = `
      UPDATE Shipping_Company 
      SET ${sqlFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, createdAt, updatedAt, tracking_system, title, logo
    `;

      sqlParams.push(id); // Add the ID as the last parameter

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0] as ShippingCompany;
    } catch (error) {
      throw new Error(
        `Unable to update shipping company with ID ${id}: ${(error as Error).message}`,
      );
    }
  }

  async deleteShippingCompany(id: number): Promise<void> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM Shipping_Company WHERE id = $1`;
      await connection.query(sql, [id]);
      connection.release();
    } catch (error) {
      throw new Error(
        `Unable to delete shipping company with ID ${id}: ${(error as Error).message}`,
      );
    }
  }
}
