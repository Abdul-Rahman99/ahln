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
            if (result.rows.length === 0) {
                throw new Error('No Shipping Companies found in the database');
            }
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
            if (result.rows.length === 0) {
                throw new Error('No Shipping Companies found in the database');
            }
            return result.rows[0] || null;
        }
        catch (error) {
            throw new Error(`Unable to fetch shipping company with ID ${id}: ${error.message}`);
        }
    }
    async updateShippingCompany(id, trackingSystem, title, logo) {
        try {
            const connection = await database_1.default.connect();
            const updatedAt = new Date();
            const sql = `
        UPDATE Shipping_Company 
        SET tracking_system = $1, title = $2, logo = $3, updatedAt = $4
        WHERE id = $5
        RETURNING id, createdAt, updatedAt, tracking_system, title, logo
      `;
            const result = await connection.query(sql, [
                trackingSystem,
                title,
                logo,
                updatedAt,
                id,
            ]);
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