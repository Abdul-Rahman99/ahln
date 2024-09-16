/* eslint-disable @typescript-eslint/no-explicit-any */
import { Address } from '../../types/address.type';
import db from '../../config/database';

class AddressModel {
  // Create new address
  async createAddress(
    address: Partial<Address>,
    user: string,
  ): Promise<Address> {
    const connection = await db.connect();

    try {
      const createdAt = new Date();
      const updatedAt = new Date();
      const sqlFields = [
        'createdAt',
        'updatedAt',
        'district',
        'street',
        'building_type',
        'building_number',
        'floor',
        'apartment_number',
        'user_id',
        'lat',
        'lang',
        'country_id',
        'city_id',
      ];
      const sqlParams = [
        createdAt,
        updatedAt,
        address.district,
        address.street,
        address.building_type,
        address.building_number,
        address.floor,
        address.apartment_number,
        user,
        address.lat,
        address.lang,
        address.country_id,
        address.city_id,
      ];

      const sql = `INSERT INTO Address (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                  RETURNING id, createdAt, updatedAt, district, street, building_type, building_number, floor, apartment_number, user_id, lat, lang, country_id, city_id`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all addresses
  async getMany(): Promise<Address[]> {
    const connection = await db.connect();
    try {
      const sql =
        'SELECT Box.id as box_id, Address.* FROM Address LEFT JOIN Box ON Box.address_id=Address.id';
      const result = await connection.query(sql);

      return result.rows as Address[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific address
  async getOne(id: number, user: string): Promise<Address> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid address ID.',
        );
      }
      const sql = 'SELECT * FROM Address WHERE id=$1 AND user_id=$2';
      const result = await connection.query(sql, [id, user]);

      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find address with ID ${id}`);
      // }
      return result.rows[0] as Address;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update address
  async updateOne(
    address: Partial<Address>,
    id: number,
    user: string,
  ): Promise<Address> {
    const connection = await db.connect();
    try {
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
      queryParams.push(user);
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query
      updateFields.push(`user_id=$${paramIndex++}`);

      queryParams.push(id); // Add the address ID to the query parameters

      const sql = `UPDATE Address SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);

      return result.rows[0] as Address;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete address
  async deleteOne(id: number, user: string): Promise<Address> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid address ID.',
        );
      }
      const sql = `DELETE FROM Address WHERE id=$1 AND user_id=$2 RETURNING *`;

      const result = await connection.query(sql, [id, user]);

      return result.rows[0] as Address;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default AddressModel;
