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
            throw new Error(error.message);
        }
    }
    async createBoxGeneration(b) {
        const connection = await database_1.default.connect();
        try {
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
            const sql = 'SELECT * FROM Box_Generation';
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
                throw new Error('ID cannot be null. Please provide a valid box generation ID.');
            }
            const sql = `SELECT * FROM Box_Generation WHERE id=$1`;
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
    async updateOne(b, id) {
        const connection = await database_1.default.connect();
        try {
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
                throw new Error('ID cannot be null. Please provide a valid box generation ID.');
            }
            const sql = `DELETE FROM Box_Generation WHERE id=$1 RETURNING *`;
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
    async modelNameExists(model_name) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT COUNT(*) FROM Box_Generation WHERE model_name=$1';
            const result = await connection.query(sql, [model_name]);
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
exports.default = BoxGenerationModel;
//# sourceMappingURL=box.generation.model.js.map