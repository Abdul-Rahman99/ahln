import Vendor from '../types/vendor.type';
import db from '../config/database';

class VendorModel {
  async create(vendor: Vendor): Promise<Vendor> {
    try {
      const connection = await db.connect();
      const sql = `INSERT INTO vendor (username, address, url, api_ref, phone) 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING vendor_id, username, address, url, api_ref, phone, createdat, updatedat`;

      const result = await connection.query(sql, [
        vendor.username,
        vendor.address,
        vendor.url,
        vendor.api_ref,
        vendor.phone,
      ]);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create vendor: ${(error as Error).message}`);
    }
  }

  async getMany(): Promise<Vendor[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM vendor';
      const result = await connection.query(sql);
      connection.release();

      return result.rows;
    } catch (error) {
      throw new Error(`Error retrieving vendors: ${(error as Error).message}`);
    }
  }

  async getOne(id: string): Promise<Vendor> {
    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid vendor ID.');
      }
      const sql = `SELECT * FROM vendor WHERE id=$1`;
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find vendor with ID ${id}`);
      }

      return result.rows[0] as Vendor;
    } catch (error) {
      throw new Error(
        `Could not find vendor ${id}: ${(error as Error).message}`,
      );
    }
  }

  async updateOne(vendorData: Partial<Vendor>, id: number): Promise<Vendor> {
    try {
      const connection = await db.connect();
      const queryParams: any[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(vendorData)
        .map((key) => {
          if (vendorData[key as keyof Vendor] !== undefined && key !== 'id') {
            queryParams.push(vendorData[key as keyof Vendor]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id);

      const sql = `UPDATE vendor SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, username, address, url, api_ref, phone, createdat, updatedat`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Could not update vendor: ${(error as Error).message}`);
    }
  }

  async deleteOne(id: number): Promise<Vendor> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM vendor WHERE vendor_id=$1 RETURNING vendor_id, username, address, url, api_ref, phone, createdat, updatedat`;

      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find vendor with ID ${id}`);
      }

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `Could not delete vendor ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default VendorModel;
