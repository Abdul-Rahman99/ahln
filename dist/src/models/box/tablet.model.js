"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class TabletModel {
    async createTablet(t) {
        try {
            const connection = await database_1.default.connect();
            const requiredFields = ['serial_number', 'android_id'];
            const providedFields = Object.keys(t).filter((key) => t[key] !== undefined);
            if (!requiredFields.every((field) => providedFields.includes(field))) {
                throw new Error('Serial number and Android ID are required fields.');
            }
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'serial_number',
                'android_id',
                'createdAt',
                'updatedAt',
            ];
            const sqlParams = [
                t.serial_number,
                t.android_id,
                createdAt,
                updatedAt,
            ];
            const sql = `INSERT INTO tablet (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING id, serial_number, android_id, createdAt, updatedAt`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create tablet: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet';
            const result = await connection.query(sql);
            if (result.rows.length === 0) {
                throw new Error('No tablets in the database');
            }
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving tablets: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid tablet ID.');
            }
            const sql = `SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet 
                    WHERE id=$1`;
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find tablet with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find tablet ${id}: ${error.message}`);
        }
    }
    async updateOne(t, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM tablet WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Tablet with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(t)
                .map((key) => {
                if (t[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(t[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE tablet SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, serial_number, android_id, createdAt, updatedAt`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update tablet ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid tablet ID.');
            }
            const sql = `DELETE FROM tablet WHERE id=$1 RETURNING id, serial_number, android_id, createdAt, updatedAt`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find tablet with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete tablet ${id}: ${error.message}`);
        }
    }
    async serialNumberExists(serial_number) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT COUNT(*) FROM tablet WHERE serial_number=$1';
            const result = await connection.query(sql, [serial_number]);
            connection.release();
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            console.error('Error checking serial number existence:', error);
            throw new Error('Failed to check serial number existence');
        }
    }
    async androidIdExists(android_id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT COUNT(*) FROM tablet WHERE android_id=$1';
            const result = await connection.query(sql, [android_id]);
            connection.release();
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            console.error('Error checking Android ID existence:', error);
            throw new Error('Failed to check Android ID existence');
        }
    }
}
exports.default = TabletModel;
//# sourceMappingURL=tablet.model.js.map