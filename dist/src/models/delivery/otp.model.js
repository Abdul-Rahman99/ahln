"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class OTPModel {
    async createOTP(otp) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'box_id',
                'box_locker_id',
                'is_used',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                otp.box_id,
                otp.box_locker_id,
                otp.is_used,
            ];
            const sql = `INSERT INTO OTP (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create OTP: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM OTP';
            const result = await connection.query(sql);
            if (result.rows.length === 0) {
                throw new Error('No boxes in the database');
            }
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving OTPs: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM OTP WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find OTP with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find OTP ${id}: ${error.message}`);
        }
    }
    async updateOne(otp, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM OTP WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`OTP with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(otp)
                .map((key) => {
                if (otp[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(otp[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE OTP SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update OTP ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid OTP ID.');
            }
            const sql = `DELETE FROM OTP WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find OTP with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete OTP ${id}: ${error.message}`);
        }
    }
}
exports.default = OTPModel;
//# sourceMappingURL=otp.model.js.map