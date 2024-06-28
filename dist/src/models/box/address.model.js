"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class AddressModel {
    async createAddress(address) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'country',
                'city',
                'district',
                'street',
                'building_type',
                'building_number',
                'floor',
                'apartment_number',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                address.country,
                address.city,
                address.district,
                address.street,
                address.building_type,
                address.building_number,
                address.floor,
                address.apartment_number,
            ];
            const sql = `INSERT INTO Address (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING id, createdAt, updatedAt, country, city, district, street, building_type, building_number, floor, apartment_number`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create address: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Address';
            const result = await connection.query(sql);
            if (result.rows.length === 0) {
                throw new Error('No addresses in the database');
            }
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving addresses: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid address ID.');
            }
            const sql = 'SELECT * FROM Address WHERE id=$1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find address with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find address ${id}: ${error.message}`);
        }
    }
    async updateOne(address, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM address WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Address with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(address)
                .map((key) => {
                if (address[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(address[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Address SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update address ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid address ID.');
            }
            const sql = `DELETE FROM Address WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find address with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete address ${id}: ${error.message}`);
        }
    }
}
exports.default = AddressModel;
//# sourceMappingURL=address.model.js.map