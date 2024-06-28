/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { DeliveryPackage } from '../../types/delivery.package.type';

class DeliveryPackageModel {
  // Function to generate custom ID
  async generateCustomId(userId: string): Promise<string> {
    try {
      const result = await db.query(
        'SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Delivery_Package WHERE id LIKE $1',
        [`${userId}%`],
      );
      let nextId = 1;
      if (result.rows.length > 0 && result.rows[0].max_id) {
        nextId = result.rows[0].max_id + 1;
      }
      const nextIdFormatted = nextId.toString().padStart(7, '0');
      return `${userId}_${nextIdFormatted}`;
    } catch (error: any) {
      console.error('Error generating custom ID:', error.message);
      throw error;
    }
  }

  // Create new delivery package
  async createDeliveryPackage(
    deliveryPackage: Partial<DeliveryPackage>,
  ): Promise<DeliveryPackage> {
    const connection = await db.connect();
    try {
      const createdAt = new Date();
      const updatedAt = new Date();

      // Generate custom ID
      const customId = await this.generateCustomId(
        deliveryPackage.customer_id as string,
      );

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
      ];
      const sqlParams = [
        customId,
        createdAt,
        updatedAt,
        deliveryPackage.customer_id,
        deliveryPackage.vendor_id,
        deliveryPackage.delivery_id,
        deliveryPackage.tracking_number,
        deliveryPackage.address_id,
        deliveryPackage.shipping_company_id,
        deliveryPackage.box_id,
        deliveryPackage.box_locker_id,
        deliveryPackage.shipment_status,
        deliveryPackage.is_delivered,
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
      if (result.rows.length === 0) {
        throw new Error(`Could not find delivery package with ID ${id}`);
      }
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
}

export default DeliveryPackageModel;
