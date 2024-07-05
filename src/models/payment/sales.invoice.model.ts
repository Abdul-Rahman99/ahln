/* eslint-disable @typescript-eslint/no-explicit-any */
import { SalesInvoice } from '../../types/sales.invoice.type';
import db from '../../config/database';

class SalesInvoiceModel {
  // Generate a unique sales invoice ID
  async generateSalesInvoiceId(): Promise<string> {
    try {
      const currentYear = new Date().getFullYear().toString().slice(-2); // Get the current year in two-digit format
      let nextId = 1;

      // Fetch the next sequence value (box generation number)
      const result = await db.query(
        'SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM sales_invoice',
      );
      if (result.rows.length > 0) {
        nextId = (result.rows[0].max_id || 0) + 1;
      }

      // Format the next id as BG1000002, BG1000003, etc.
      const nextIdFormatted = nextId.toString().padStart(7, '0');

      // Construct the box_generation_id
      const id = `AHLN_${currentYear}_SI${nextIdFormatted}`;
      return id;
    } catch (error: any) {
      console.error('Error generating sales invoice id:', error.message);
      throw error;
    }
  }

  // Create new SalesInvoice
  async createSalesInvoice(
    newSalesInvoice: Partial<SalesInvoice>,
  ): Promise<SalesInvoice> {
    try {
      const connection = await db.connect();

      // Generate box generation ID
      const id = await this.generateSalesInvoiceId(); // Await here to get the actual ID string

      const createdAt = new Date();
      const updatedAt = new Date();

      const sqlFields = [
        'id',
        'customer_id',
        'box_id',
        'purchase_date',
        'createdAt',
        'updatedAt',
        'sales_id',
      ];
      const sqlParams = [
        id,
        newSalesInvoice.customer_id,
        newSalesInvoice.box_id,
        newSalesInvoice.purchase_date,
        createdAt,
        updatedAt,
        newSalesInvoice.sales_id,
      ];

      const sql = `INSERT INTO sales_invoice (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);
      connection.release();

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error(
        `Unable to create sales invoice: ${(error as Error).message}`,
      );
    }
  }

  // Get all SalesInvoices
  async getAllSalesInvoices(): Promise<SalesInvoice[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM sales_invoice';
      const result = await connection.query(sql);
      console.log(result.rows);

      connection.release();
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error(
        `Error retrieving sales invoices: ${(error as Error).message}`,
      );
    }
  }

  // Get specific SalesInvoice by ID
  async getOne(id: string): Promise<SalesInvoice> {
    try {
      const sql = 'SELECT * FROM sales_invoice WHERE id=$1';
      const connection = await db.connect();
      const result = await connection.query(sql, [id]);
      connection.release();
      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error(
        `Could not find SalesInvoice ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Update SalesInvoice
  async updateOne(
    salesInvoice: Partial<SalesInvoice>,
    id: string,
  ): Promise<SalesInvoice> {
    try {
      const connection = await db.connect();

      // Check if the SalesInvoice exists
      const checkSql = 'SELECT * FROM sales_invoice WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`SalesInvoice with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updateFields = Object.keys(salesInvoice)
        .map((key) => {
          if (
            salesInvoice[key as keyof SalesInvoice] !== undefined &&
            key !== 'id'
          ) {
            queryParams.push(salesInvoice[key as keyof SalesInvoice]);
            return `${key}=$${paramIndex++}`;
          }
          return null;
        })
        .filter((field) => field !== null);

      queryParams.push(id); // Add the SalesInvoice ID to the query parameters

      const sql = `UPDATE sales_invoice SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;

      const result = await connection.query(sql, queryParams);
      connection.release();

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error(
        `Could not update SalesInvoice ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Delete SalesInvoice
  async deleteOne(id: string): Promise<SalesInvoice> {
    try {
      const connection = await db.connect();
      const sql = `DELETE FROM sales_invoice WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);
      if (result.rows.length === 0) {
        throw new Error(`Could not find SalesInvoice with ID ${id}`);
      }
      connection.release();

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error(
        `Could not delete SalesInvoice ${id}: ${(error as Error).message}`,
      );
    }
  }

  // Fetch sales invoices by user ID
  async getSalesInvoicesByUserId(user: string): Promise<SalesInvoice[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM sales_invoice WHERE customer_id=$1';
      const result = await connection.query(sql, [user]);
      connection.release();
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error(
        `Error retrieving sales invoices by user ID: ${(error as Error).message}`,
      );
    }
  }
  // Fetch sales invoices by user ID
  async getSalesInvoicesBySalesId(user: string): Promise<SalesInvoice[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM sales_invoice WHERE sales_id=$1';
      const result = await connection.query(sql, [user]);
      connection.release();
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error(
        `Error retrieving sales invoices by user ID: ${(error as Error).message}`,
      );
    }
  }

  // Fetch sales invoices by box ID
  async getSalesInvoicesByBoxId(boxId: string): Promise<SalesInvoice[]> {
    try {
      const connection = await db.connect();
      const sql = 'SELECT * FROM sales_invoice WHERE box_id=$1';
      const result = await connection.query(sql, [boxId]);
      connection.release();
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error(
        `Error retrieving sales invoices by box ID: ${(error as Error).message}`,
      );
    }
  }
}

export default SalesInvoiceModel;
