"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../config/database"));
class BoxModel {
    async create(b) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO box (compartments_number, compartment1, compartment2, compartment3, video_id) 
                   VALUES ($1, $2, $3, $4, $5) 
                   RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt, box_id`;
            const result = await connection.query(sql, [
                b.compartments_number,
                b.compartment1,
                b.compartment2,
                b.compartment3,
                b.video_id,
            ]);
            connection.release();
            const box = result.rows[0];
            return box;
        }
        catch (error) {
            throw new Error(`Unable to create box: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM box';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving boxes: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box ID.');
            }
            const sql = `SELECT * FROM box WHERE id=$1`;
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find box with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find box ${id}: ${error.message}`);
        }
    }
    async updateOne(b, id) {
        try {
            const connection = await database_1.default.connect();
            const checkExistenceQuery = 'SELECT * FROM box WHERE id = $1';
            const existenceResult = await connection.query(checkExistenceQuery, [id]);
            if (existenceResult.rows.length === 0) {
                throw new Error(`Box with id ${id} does not exist.`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updateFields = Object.keys(b)
                .map((key) => {
                if (b[key] !== undefined && key !== 'id') {
                    if (key === 'compartment1' ||
                        key === 'compartment2' ||
                        key === 'compartment3') {
                        if (typeof b[key] !== 'boolean') {
                            throw new Error(`Field ${key} must be a boolean`);
                        }
                    }
                    queryParams.push(b[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(id);
            const sql = `UPDATE box SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt, box_id`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Box with id ${id} was not updated.`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update box: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box ID.');
            }
            const sql = `DELETE FROM box
                    WHERE id=$1
                    RETURNING id, compartments_number, compartment1, compartment2, compartment3, video_id, createdAt, updatedAt, box_id`;
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find box with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete box ${id}: ${error.message}`);
        }
    }
}
exports.default = BoxModel;
//# sourceMappingURL=box.model.js.map