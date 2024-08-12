"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class AddressModel {
    async createAddress(address, user) {
        const connection = await database_1.default.connect();
        try {
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
                'user_id',
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
                user,
            ];
            const sql = `INSERT INTO Address (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                  RETURNING id, createdAt, updatedAt, country, city, district, street, building_type, building_number, floor, apartment_number, user_id`;
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
            const sql = 'SELECT Box.id as box_id, Address.* FROM Address LEFT JOIN Box ON Box.address_id=Address.id';
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
    async getOne(id, user) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid address ID.');
            }
            const sql = 'SELECT * FROM Address WHERE id=$1 AND user_id=$2';
            const result = await connection.query(sql, [id, user]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async updateOne(address, id, user) {
        const connection = await database_1.default.connect();
        try {
            const checkSql = 'SELECT * FROM address WHERE id=$1 AND user_id=$2';
            const checkResult = await connection.query(checkSql, [id, user]);
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
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteOne(id, user) {
        const connection = await database_1.default.connect();
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid address ID.');
            }
            const sql = `DELETE FROM Address WHERE id=$1 AND user_id=$2 RETURNING *`;
            const result = await connection.query(sql, [id, user]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = AddressModel;
//# sourceMappingURL=address.model.js.map