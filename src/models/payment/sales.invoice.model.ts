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
      throw new Error((error as Error).message);
    }
  }

  // Create new SalesInvoice
  async createSalesInvoice(
    newSalesInvoice: Partial<SalesInvoice>,
  ): Promise<SalesInvoice> {
    const connection = await db.connect();

    try {
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

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all SalesInvoices
  async getAllSalesInvoices(): Promise<SalesInvoice[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM sales_invoice';
      const result = await connection.query(sql);

      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific SalesInvoice by ID
  async getOne(id: string): Promise<SalesInvoice> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM sales_invoice WHERE id=$1';
      const result = await connection.query(sql, [id]);
      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update SalesInvoice
  async updateOne(
    salesInvoice: Partial<SalesInvoice>,
    id: string,
  ): Promise<SalesInvoice> {
    const connection = await db.connect();

    try {
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

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Delete SalesInvoice
  async deleteOne(id: string): Promise<SalesInvoice> {
    const connection = await db.connect();

    try {
      const sql = `DELETE FROM sales_invoice WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      return result.rows[0] as SalesInvoice;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Fetch sales invoices by user ID
  async getSalesInvoicesByUserId(user: string): Promise<SalesInvoice[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM sales_invoice WHERE customer_id=$1';
      const result = await connection.query(sql, [user]);
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  // Fetch sales invoices by user ID
  async getSalesInvoicesBySalesId(user: string): Promise<SalesInvoice[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM sales_invoice WHERE sales_id=$1';
      const result = await connection.query(sql, [user]);
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Fetch sales invoices by box ID
  async getSalesInvoicesByBoxId(boxId: string): Promise<SalesInvoice[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM sales_invoice WHERE box_id=$1';
      const result = await connection.query(sql, [boxId]);
      return result.rows as SalesInvoice[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default SalesInvoiceModel;
