"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class BoxGenerationModel {
    async generateBoxGenerationId() {
        try {
            const currentYear = new Date().getFullYear().toString().slice(-2);
            let nextId = 1;
            const result = await database_1.default.query('SELECT MAX(CAST(SUBSTRING(id FROM 11 FOR 7) AS INTEGER)) AS max_id FROM Box_Generation');
            if (result.rows.length > 0) {
                nextId = (result.rows[0].max_id || 0) + 1;
            }
            const nextIdFormatted = nextId.toString().padStart(7, '0');
            const id = `AHLN_${currentYear}_BG${nextIdFormatted}`;
            return id;
        }
        catch (error) {
            console.error('Error generating box_generation_id:', error.message);
            throw error;
        }
    }
    async createBoxGeneration(b) {
        try {
            const connection = await database_1.default.connect();
            const requiredFields = ['model_name', 'number_of_doors'];
            const providedFields = Object.keys(b).filter((key) => b[key] !== undefined);
            if (!requiredFields.every((field) => providedFields.includes(field))) {
                throw new Error('Model name and number of doors are required fields.');
            }
            const id = await this.generateBoxGenerationId();
            const createdAt = new Date();
            const updatedAt = new Date();
            const sqlFields = [
                'id',
                'model_name',
                'createdAt',
                'updatedAt',
                'number_of_doors',
                'width',
                'height',
                'color',
                'model_image',
                'has_outside_camera',
                'has_inside_camera',
                'has_tablet',
            ];
            const sqlParams = [
                id,
                b.model_name,
                createdAt,
                updatedAt,
                b.number_of_doors,
                b.width,
                b.height,
                b.color,
                b.model_image,
                b.has_outside_camera,
                b.has_inside_camera,
                b.has_tablet,
            ];
            const sql = `INSERT INTO Box_Generation (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create box generation: ${error.message}`);
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM Box_Generation';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving box generations: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box generation ID.');
            }
            const sql = `SELECT * FROM Box_Generation WHERE id=$1`;
            const connection = await database_1.default.connect();
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find box generation ${id}: ${error.message}`);
        }
    }
    async updateOne(b, id) {
        try {
            const connection = await database_1.default.connect();
            const checkSql = 'SELECT * FROM Box_Generation WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`Box Generation with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(b)
                .map((key) => {
                if (b[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(b[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE Box_Generation SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
            const result = await connection.query(sql, queryParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update box generation ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid box generation ID.');
            }
            const sql = `DELETE FROM Box_Generation WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find box generation with ID ${id}`);
            }
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete box generation ${id}: ${error.message}`);
        }
    }
    async modelNameExists(model_name) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT COUNT(*) FROM Box_Generation WHERE model_name=$1';
            const result = await connection.query(sql, [model_name]);
            connection.release();
            return parseInt(result.rows[0].count) > 0;
        }
        catch (error) {
            console.error('Error checking model name existence:', error);
            throw new Error('Failed to check model name existence');
        }
    }
}
exports.default = BoxGenerationModel;
//# sourceMappingURL=box.generation.model.js.map