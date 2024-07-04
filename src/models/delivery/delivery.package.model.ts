/* eslint-disable @typescript-eslint/no-explicit-any */
import pool from '../../config/database';
import db from '../../config/database';
import { DeliveryPackage } from '../../types/delivery.package.type';

class DeliveryPackageModel {
  // Function to generate custom ID
  async generateCustomId(userId: string): Promise<string> {
    try {
      // Extract the numeric part from userId, assuming it follows the pattern Ahln_{userId}_U0000002
      const regexMatch = userId.match(/Ahln_(\d+)_U(\d+)/);
      if (!regexMatch || regexMatch.length < 3) {
        throw new Error('Invalid userId format');
      }
      const numericPart = regexMatch[2]; // Extract the numeric part after 'U'

      // Query to get the maximum numeric part of the ID for the given user
      const result = await pool.query(
        'SELECT MAX(CAST(SUBSTRING(id FROM 17) AS INTEGER)) AS max_id FROM Delivery_Package WHERE id LIKE $1',
        [`Ahln_${numericPart}_U%`],
      );

      let nextId = 1;
      // Calculate the next numeric part
      if (result.rows.length > 0 && result.rows[0].max_id !== null) {
        nextId = result.rows[0].max_id + 1;
      }

      // Format the next numeric part with zero-padding
      const nextIdFormatted = nextId.toString().padStart(7, '0'); // Adjust padding as needed

      // Construct and return the custom ID
      return `Ahln_${numericPart}_U${nextIdFormatted}`;
    } catch (error: any) {
      console.error('Error generating custom ID:', error.message);
      throw error;
    }
  }

  async createDeliveryPackage(
    userId: string,
    deliveryPackage: Partial<DeliveryPackage>,
  ): Promise<DeliveryPackage> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      // Generate custom ID
      const customId = await this.generateCustomId(userId);

      const sqlBox = `SELECT address_id FROM Box WHERE id=$1`;
      const address_id = (
        await connection.query(sqlBox, [deliveryPackage.box_id])
      ).rows[0].address_id;

      const sqlFields = [
        'id',
        'createdAt',
        'updatedAt',
        'customer_id',
        'vendor_id',
        'delivery_id',
        'tracking_number',
        'address_id',
        'shipping_company_id',
        'box_id',
        'box_locker_id',
        'shipment_status',
        'is_delivered',
        'box_locker_string',
      ];
      const sqlParams = [
        customId,
        createdAt,
        updatedAt,
        userId,
        deliveryPackage.vendor_id || null,
        deliveryPackage.delivery_id || null,
        deliveryPackage.tracking_number || null,
        address_id,
        deliveryPackage.shipping_company_id || null,
        deliveryPackage.box_id || null,
        deliveryPackage.box_locker_id || null,
        deliveryPackage.shipment_status || 'pending',
        deliveryPackage.is_delivered || false,
        deliveryPackage.box_locker_string || null,
      ];

      const sql = `INSERT INTO Delivery_Package (${sqlFields.join(', ')}) 
                 VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                 RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0];
    } catch (error) {
      connection.release();
      throw new Error(
        `Unable to create delivery package: ${(error as Error).message}`,
      );
    }
  }

  // Get all delivery packages
  async getMany(): Promise<DeliveryPackage[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM Delivery_Package';
      const result = await connection.query(sql);
      // if (result.rows.length === 0) {
      //   throw new Error('No Delivery Packages in the database');
      // }
      connection.release();
      return result.rows as DeliveryPackage[];
    } catch (error) {
      throw new Error(
        `Error retrieving delivery packages: ${(error as Error).message}`,
      );
    }
  }

  // Get specific delivery package by ID
  async getOne(id: string): Promise<DeliveryPackage> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM Delivery_Package WHERE id=$1';
      const result = await connection.query(sql, [id]);
      connection.release();
      // if (result.rows.length === 0) {
      //   throw new Error(`Could not find delivery package with ID ${id}`);
      // }
      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error(
        `Could not find delivery package ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update delivery package
  async updateOne(
    deliveryPackage: Partial<DeliveryPackage>,
    id: string,
  ): Promise<DeliveryPackage> {
    try {
      const connection = await db.connect();

      const checkSql = 'SELECT * FROM Delivery_Package WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Delivery package with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(deliveryPackage)
        .map((key) => {
          if (
            deliveryPackage[key as keyof DeliveryPackage] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(deliveryPackage[key as keyof DeliveryPackage]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(updatedAt); // Add the updatedAt timestamp
      updateFields.push(`updatedAt=$${paramIndex++}`); // Include updatedAt field in the update query

      queryParams.push(id); // Add the delivery package ID to the query parameters

      const sql = `UPDATE Delivery_Package SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error(
        `Could not update delivery package ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete delivery package
  async deleteOne(id: string): Promise<DeliveryPackage> {
    try {
      const connection = await db.connect();
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Delivery Package ID.',
        );
      }
      const sql = `DELETE FROM Delivery_Package WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);
      connection.release();

      if (result.rows.length === 0) {
        throw new Error(`Could not find delivery package with ID ${id}`);
      }

      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error(
        `Could not delete delivery package ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Get all delivery packages for a specific user
  async getPackagesByUser(
    userId: string,
    status: any,
  ): Promise<DeliveryPackage[]> {
    try {
      const connection = await db.connect();
      const sql =
        'SELECT * FROM Delivery_Package WHERE customer_id = $1  AND shipment_status = $2';
      const params: any[] = [userId , status];

      const result = await connection.query(sql, params);
      connection.release();

      return result.rows as DeliveryPackage[];
    } catch (error) {
      throw new Error(
        `Error retrieving delivery packages for user ${userId}: ${(error as Error).message}`,
      );
    }
  }
}

export default DeliveryPackageModel;
