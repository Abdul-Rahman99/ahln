/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from '../../types/address.type';
import db from '../../config/database';

class AddressModel {
  // Create new address
  async createAddress(address: Partial<Address>): Promise<Address> {
    try {
      const connection = await db.connect();
      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'createdAt',
        'updatedAt',
        'country',
        'city',
        'district',
        'street',
        'building_type',
        'building_number',
        'floor',
        'apartment_number',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        address.country,
        address.city,
        address.district,
        address.street,
        address.building_type,
        address.building_number,
        address.floor,
        address.apartment_number,
      ];

      const sql = `INSERT INTO Address (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                  RETURNING id, createdAt, updatedAt, country, city, district, street, building_type, building_number, floor, apartment_number`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`Unable to create address: ${(error as Error).message}`);
    }
  }

  // Get all addresses
  async getMany(): Promise<Address[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM Address';
      const result = await connection.query(sql);

      // if (result.rows.length === 0) {
      //   throw new Error('No addresses in the database');
      // }
      connection.release();
      return result.rows as Address[];
    } catch (error) {
      throw new Error(
        `Error retrieving addresses: ${(error as Error).message}`,
      );
    }
  }

  // Get specific address
  async getOne(id: number): Promise<Address> {
    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid address ID.',
        );
      }
      const sql = 'SELECT * FROM Address WHERE id=$1';
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find address with ID ${id}`);
      // }
      connection.release();
      return result.rows[0] as Address;
    } catch (error) {
      throw new Error(
        `Could not find address ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update address
  async updateOne(address: Partial<Address>, id: number): Promise<Address> {
    try {
      const connection = await db.connect();

      // Check if the address exists
      const checkSql = 'SELECT * FROM address WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Address with ID ${id} does not exist`);
      }
      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(address)
        .map((key) => {
          if (
            address[key as keyof Address] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(address[key as keyof Address]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the address ID to the query parameters

      const sql = `UPDATE Address SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as Address;
    } catch (error) {
      throw new Error(
        `Could not update address ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete address
  async deleteOne(id: number): Promise<Address> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid address ID.',
        );
      }
      const sql = `DELETE FROM Address WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find address with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as Address;
    } catch (error) {
      throw new Error(
        `Could not delete address ${id}: ${(error as Error).message}`,
      );
    }
  }
}

export default AddressModel;
