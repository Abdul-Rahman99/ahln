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
            throw new Error(error.message);
        }
    }
    async createSalesInvoice(newSalesInvoice, user) {
        const connection = await database_1.default.connect();
        try {
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
                user,
            ];
            const sql = `INSERT INTO sales_invoice (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getAllSalesInvoices() {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM sales_invoice';
            const result = await connection.query(sql);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getOne(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM sales_invoice WHERE id=$1';
            const result = await connection.query(sql, [id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateOne(salesInvoice, id) {
        const connection = await database_1.default.connect();
        try {
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteOne(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM sales_invoice WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getSalesInvoicesByUserId(user) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM sales_invoice WHERE customer_id=$1';
            const result = await connection.query(sql, [user]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getSalesInvoicesBySalesId(user) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM sales_invoice WHERE sales_id=$1';
            const result = await connection.query(sql, [user]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getSalesInvoicesByBoxId(boxId) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM sales_invoice WHERE box_id=$1';
            const result = await connection.query(sql, [boxId]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = SalesInvoiceModel;
//# sourceMappingURL=sales.invoice.model.js.map