"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class SalesInvoiceModel {
    async generateSalesInvoiceId() {
        try {
            const currentYear = new Date().getFullYear().toString().slice(-2);
            let nextId = 1;
            const result = await database_1.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM sales_invoice');
            if (result.rows.length > 0) {
                nextId = (result.rows[0].max_id || 0) + 1;
            }
            const nextIdFormatted = nextId.toString().padStart(7, '0');
            const id = `AHLN_${currentYear}_SI${nextIdFormatted}`;
            return id;
        }
        catch (error) {
            console.error('Error generating sales invoice id:', error.message);
            throw error;
        }
    }
    async createSalesInvoice(newSalesInvoice) {
        try {
            const connection = await database_1.default.connect();
            const id = await this.generateSalesInvoiceId();
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create sales invoice: ${error.message}`);
        }
    }
    async getAllSalesInvoices() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM sales_invoice';
            const result = await connection.query(sql);
            console.log(result.rows);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving sales invoices: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const sql = 'SELECT * FROM sales_invoice WHERE id=$1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find SalesInvoice ${id}: ${error.message}`);
        }
    }
    async updateOne(salesInvoice, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM sales_invoice WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`SalesInvoice with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updateFields = Object.keys(salesInvoice)
                .map((key) => {
                if (salesInvoice[key] !== undefined &&
                    key !== 'id') {
                    queryParams.push(salesInvoice[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(id);
            const sql = `UPDATE sales_invoice SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update SalesInvoice ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM sales_invoice WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find SalesInvoice with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete SalesInvoice ${id}: ${error.message}`);
        }
    }
    async getSalesInvoicesByUserId(user) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM sales_invoice WHERE customer_id=$1';
            const result = await connection.query(sql, [user]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving sales invoices by user ID: ${error.message}`);
        }
    }
    async getSalesInvoicesBySalesId(user) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM sales_invoice WHERE sales_id=$1';
            const result = await connection.query(sql, [user]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving sales invoices by user ID: ${error.message}`);
        }
    }
    async getSalesInvoicesByBoxId(boxId) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM sales_invoice WHERE box_id=$1';
            const result = await connection.query(sql, [boxId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving sales invoices by box ID: ${error.message}`);
        }
    }
}
exports.default = SalesInvoiceModel;
//# sourceMappingURL=sales.invoice.model.js.map