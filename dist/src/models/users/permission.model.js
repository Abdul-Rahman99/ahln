"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class PermissionModel {
    async create(title, description) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO permission (title, description) VALUES ($1, $2) RETURNING *`;
            const result = await connection.query(sql, [title, description]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create permission: ${error.message}`);
        }
    }
    async getAll() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM permission';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Unable to get permissions: ${error.message}`);
        }
    }
    async getById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM permission WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to get permission: ${error.message}`);
        }
    }
    async update(id, title, description) {
        try {
            const connection = await database_1.default.connect();
            const sql = `UPDATE permission SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
            const result = await connection.query(sql, [title, description, id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to update permission: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM permission WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to delete permission: ${error.message}`);
        }
    }
}
exports.default = PermissionModel;
//# sourceMappingURL=permission.model.js.map