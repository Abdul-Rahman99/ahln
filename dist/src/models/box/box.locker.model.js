"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class BoxLockerModel {
    async createBoxLocker(boxLocker) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'id',
                'locker_label',
                'serial_port',
                'createdAt',
                'updatedAt',
                'is_empty',
                'box_id',
            ];
            const sqlParams = [
                boxLocker.id,
                boxLocker.locker_label,
                boxLocker.serial_port,
                createdAt,
                updatedAt,
                boxLocker.is_empty,
                boxLocker.box_id,
            ];
            const sql = `INSERT INTO Box_Locker (${sqlFields.join(', ')}) 
                  VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create box locker: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Box_Locker';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving box lockers: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box locker ID.');
            }
            const sql = 'SELECT * FROM Box_Locker WHERE id=$1';
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find box locker ${id}: ${error.message}`);
        }
    }
    async updateOne(boxLocker, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Box_Locker WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Box locker with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(boxLocker)
                .map((key) => {
                if (boxLocker[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(boxLocker[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Box_Locker SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update box locker ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box locker ID.');
            }
            const sql = `DELETE FROM Box_Locker WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find box locker with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete box locker ${id}: ${error.message}`);
        }
    }
    async getAllLockersById(boxId) {
        try {
            const connection = await database_1.default.connect();
            if (!boxId) {
                throw new Error(`Box id cannot be null ${boxId}`);
            }
            const sql = `SELECT 
        id,
        locker_label as name,
        serial_port as box_locker_string
        FROM Box_Locker WHERE box_id=$1`;
            const result = await connection.query(sql, [boxId]);
            connection.release();
            const lockersWithParsedString = result.rows.map((row) => {
                try {
                    return {
                        ...row,
                        box_locker_string: JSON.parse(row.box_locker_string),
                    };
                }
                catch (error) {
                    console.error(`Error parsing JSON for locker ${row.id}: ${error.message}`);
                    return {
                        ...row,
                        box_locker_string: {},
                    };
                }
            });
            return lockersWithParsedString;
        }
        catch (error) {
            throw new Error(`Could not find box locker ${boxId}: ${error.message}`);
        }
    }
}
exports.default = BoxLockerModel;
//# sourceMappingURL=box.locker.model.js.map