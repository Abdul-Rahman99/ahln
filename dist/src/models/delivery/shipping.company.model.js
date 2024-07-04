"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class ShippingCompanyModel {
    async createShippingCompany(trackingSystem, title, logo) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'tracking_system',
                'createdAt',
                'updatedAt',
                'title',
                'logo',
            ];
            const sqlParams = [trackingSystem, createdAt, updatedAt, title, logo];
            const sql = `INSERT INTO Shipping_Company (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create shipping company: ${error.message}`);
        }
    }
    async getAllShippingCompanies() {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company`;
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Unable to fetch shipping companies: ${error.message}`);
        }
    }
    async getShippingCompanyById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT id, createdAt, updatedAt, tracking_system, title, logo FROM Shipping_Company WHERE id = $1`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0] || null;
        }
        catch (error) {
            throw new Error(`Unable to fetch shipping company with ID ${id}: ${error.message}`);
        }
    }
    async updateShippingCompany(id, updateFields) {
        try {
            const connection = await database_1.default.connect();
            const updatedAt = new Date();
            const sqlFields = [];
            const sqlParams = [updatedAt];
            let paramIndex = 2;
            if (updateFields.tracking_system) {
                sqlFields.push(`tracking_system = $${paramIndex++}`);
                sqlParams.push(updateFields.tracking_system);
            }
            if (updateFields.title) {
                sqlFields.push(`title = $${paramIndex++}`);
                sqlParams.push(updateFields.title);
            }
            if (updateFields.logo) {
                sqlFields.push(`logo = $${paramIndex++}`);
                sqlParams.push(updateFields.logo);
            }
            if (sqlFields.length === 0) {
                throw new Error('No fields to update');
            }
            sqlFields.push(`updatedAt = $1`);
            const sql = `
      UPDATE Shipping_Company 
      SET ${sqlFields.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING id, createdAt, updatedAt, tracking_system, title, logo
    `;
            sqlParams.push(id);
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to update shipping company with ID ${id}: ${error.message}`);
        }
    }
    async deleteShippingCompany(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM Shipping_Company WHERE id = $1`;
            await connection.query(sql, [id]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Unable to delete shipping company with ID ${id}: ${error.message}`);
        }
    }
}
exports.default = ShippingCompanyModel;
//# sourceMappingURL=shipping.company.model.js.map