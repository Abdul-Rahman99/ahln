"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class BoxImageModel {
    async createBoxImage(boxImage) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'box_id',
                'image',
                'delivery_package_id',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                boxImage.box_id,
                boxImage.image,
                boxImage.delivery_package_id,
            ];
            const sql = `INSERT INTO Box_IMAGE (${sqlFields.join(', ')}) 
                   VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create box image: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Box_IMAGE';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving box images: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Box_IMAGE WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find box image with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find box image ${id}: ${error.message}`);
        }
    }
    async updateOne(boxImage, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Box_IMAGE WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Box image with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(boxImage)
                .map((key) => {
                if (boxImage[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(boxImage[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Box_IMAGE SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update box image ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM Box_IMAGE WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find box image with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete box image ${id}: ${error.message}`);
        }
    }
}
exports.default = BoxImageModel;
//# sourceMappingURL=box.image.model.js.map