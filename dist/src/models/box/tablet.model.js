"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class TabletModel {
    async createTablet(t) {
        const connection = await database_1.default.connect();
        try {
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getMany() {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT Box.id as box_id, Box.box_label, Box.previous_tablet_id, tablet.* FROM tablet LEFT JOIN Box ON Box.current_tablet_id=tablet.id';
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
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid tablet ID.');
            }
            const sql = `SELECT id, serial_number, android_id, createdAt, updatedAt FROM tablet 
                    WHERE id=$1`;
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
    async updateOne(t, id) {
        const connection = await database_1.default.connect();
        try {
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
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid tablet ID.');
            }
            const sql = `DELETE FROM tablet WHERE id=$1 RETURNING id, serial_number, android_id, createdAt, updatedAt`;
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
    async serialNumberExists(serial_number) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT COUNT(*) FROM tablet WHERE serial_number=$1';
            const result = await connection.query(sql, [serial_number]);
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async androidIdExists(android_id) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT COUNT(*) FROM tablet WHERE android_id=$1';
            const result = await connection.query(sql, [android_id]);
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = TabletModel;
//# sourceMappingURL=tablet.model.js.map