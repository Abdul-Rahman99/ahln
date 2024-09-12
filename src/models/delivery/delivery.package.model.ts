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
      throw new Error((error as Error).message);
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
        'title',
        'delivery_pin',
        'description',
        'other_shipping_company',
        'otp',
      ];
      const sqlParams = [
        customId,
        createdAt,
        updatedAt,
        userId,
        deliveryPackage.vendor_id || null,
        deliveryPackage.delivery_id || null,
        deliveryPackage.tracking_number?.toLowerCase() || null,
        address_id,
        deliveryPackage.shipping_company_id || null,
        deliveryPackage.box_id || null,
        deliveryPackage.box_locker_id || null,
        deliveryPackage.shipment_status || 'pending',
        deliveryPackage.is_delivered || false,
        deliveryPackage.box_locker_string || null,
        deliveryPackage.title || null,
        deliveryPackage.delivery_pin || null,
        deliveryPackage.description || null,
        deliveryPackage.other_shipping_company || null,
        deliveryPackage.otp || null,
      ];

      const sql = `INSERT INTO Delivery_Package (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING id, tracking_number, box_id, box_locker_id, shipping_company_id, shipment_status, title AS name, delivery_pin, description, other_shipping_company, otp,
                createdAt, updatedAt, customer_id, vendor_id, delivery_id, is_delivered, box_locker_string, address_id`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all delivery packages
  async getMany(): Promise<DeliveryPackage[]> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT Delivery_Package.* , Shipping_Company.title AS shipping_company_name FROM Delivery_Package LEFT JOIN Shipping_Company ON shipping_company_id = Shipping_Company.id ORDER BY Delivery_Package.updatedAt DESC';
      const result = await connection.query(sql);

      return result.rows as DeliveryPackage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific delivery package by ID
  async getOne(id: string): Promise<DeliveryPackage> {
    const connection = await db.connect();

    try {
      const sql =
        'SELECT Delivery_Package.* , Shipping_Company.title AS shipping_company_name FROM Delivery_Package LEFT JOIN Shipping_Company ON Delivery_Package.shipping_company_id = Shipping_Company.id WHERE Delivery_Package.id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  async checkTrackingNumber(tracking_number: string): Promise<any> {
    const connection = await db.connect();

    try {
      if (!tracking_number) {
        throw new Error('Please provide a tracking number');
      }

      const deliveryPackageResult = await connection.query(
        'SELECT tracking_number FROM Delivery_Package WHERE tracking_number = $1',
        [tracking_number],
      );

      if (deliveryPackageResult.rows.length > 0) {
        throw new Error(
          'Delivery package Dublicated for the given tracking number',
        );
      }
    } catch (error: any) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update delivery package
  async updateOne(
    deliveryPackage: Partial<DeliveryPackage>,
    id: string,
    user: string,
  ): Promise<DeliveryPackage> {
    const connection = await db.connect();

    try {
      const checkSql =
        'SELECT * FROM Delivery_Package WHERE id=$1 AND customer_id=$2';
      const checkResult = await connection.query(checkSql, [id, user]);

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

      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete delivery package
  async deleteOne(id: string, user: string): Promise<DeliveryPackage> {
    const connection = await db.connect();
    try {
      if (!id) {
        throw new Error(
          'ID cannot be null. Please provide a valid Delivery Package ID.',
        );
      }

      const checkSql =
        'SELECT * FROM Delivery_Package WHERE id=$1 AND customer_id=$2';
      const checkResult = await connection.query(checkSql, [id, user]);

      if (checkResult.rows.length === 0) {
        throw new Error(`Delivery package with ID ${id} does not exist`);
      }

      const otp = `SELECT * FROM OTP WHERE delivery_package_id=$1`;
      const otpResult = await connection.query(otp, [id]);

      if (otpResult) {
        await connection.query(`DELETE FROM OTP WHERE delivery_package_id=$1`, [
          id,
        ]);
      }

      // delete from fav list first
      const fav_list_exist = `SELECT * FROM DP_Fav_List WHERE delivery_package_id=$1`;
      const fav_list_exist_result = await connection.query(fav_list_exist, [
        id,
      ]);
      if (fav_list_exist_result.rows.length > 0) {
        const fav_list = `DELETE FROM DP_Fav_List WHERE delivery_package_id=$1 RETURNING *`;
        await connection.query(fav_list, [id]);
      }
      const sql = `DELETE FROM Delivery_Package WHERE id=$1 RETURNING *`;
      const result = await connection.query(sql, [id]);

      return result.rows[0] as DeliveryPackage;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all delivery packages for a specific user
  async getPackagesByUser(
    userId: string,
    boxId: string,
    status: any,
  ): Promise<DeliveryPackage[]> {
    const connection = await db.connect();
    try {
      const sql = `SELECT Delivery_Package.other_shipping_company, Box.box_label ,Box_Locker.locker_label , Delivery_Package.is_fav,
        Delivery_Package.id, Shipping_Company.title AS shipping_company_name , Delivery_Package.tracking_number, Delivery_Package.box_id, 
        Delivery_Package.box_locker_id, 
        Delivery_Package.shipping_company_id, Delivery_Package.shipment_status, Delivery_Package.title AS name, Delivery_Package.delivery_pin,
        Delivery_Package.description, Delivery_Package.createdAt , Delivery_Package.updatedAt 
        FROM Delivery_Package LEFT JOIN Shipping_Company ON shipping_company_id = Shipping_Company.id 
        INNER JOIN Box_Locker ON Delivery_Package.box_locker_id = Box_Locker.id 
        INNER JOIN Box ON Delivery_Package.box_id = Box.id 
        WHERE Delivery_Package.customer_id = $1 AND Delivery_Package.box_id = $2 AND Delivery_Package.shipment_status = $3 ORDER BY Delivery_Package.updatedAt DESC`;
      const params: any[] = [userId, boxId, status];

      const result = await connection.query(sql, params);

      return result.rows as DeliveryPackage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific user by delivery package ID
  async getUserByDeliveryPackageId(id: string): Promise<string> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT user_id FROM Delivery_Package WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as string;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Transfer delivery packages from box to another box
  async transferDeliveryPackages(
    fromBoxId: string,
    toBoxId: string,
    userId: string,
  ): Promise<DeliveryPackage[]> {
    const connection = await db.connect();
    try {
      if (!fromBoxId || !toBoxId) {
        throw new Error(
          'Box ID cannot be null. Please provide a valid Box ID.',
        );
      }

      if (fromBoxId === toBoxId) {
        throw new Error(
          'Box ID cannot be the same. Please provide a valid Box ID.',
        );
      }

      const result = [];
      const sql = `SELECT * FROM Delivery_Package WHERE box_id = $1 AND customer_id = $2`;
      const params = [fromBoxId, userId];
      const deliveryPackages = (await connection.query(sql, params)).rows;
      for (const deliveryPackage of deliveryPackages) {
        const updateSql = `UPDATE Delivery_Package SET box_id = $1 WHERE id = $2 RETURNING *`;
        const updateParams = [toBoxId, deliveryPackage.id];
        const updateResult = (await connection.query(updateSql, updateParams))
          .rows[0];
        result.push(updateResult);
      }
      return result as DeliveryPackage[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default DeliveryPackageModel;
