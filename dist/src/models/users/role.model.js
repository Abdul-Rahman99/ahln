"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class RoleModel {
    async create(title, description) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO role (title, description) VALUES ($1, $2) RETURNING *`;
            const result = await connection.query(sql, [title, description]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create role: ${error.message}`);
        }
    }
    async getAll() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM role';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Unable to get roles: ${error.message}`);
        }
    }
    async getById(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM role WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to get role: ${error.message}`);
        }
    }
    async update(id, title, description) {
        try {
            const connection = await database_1.default.connect();
            const sql = `UPDATE role SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
            const result = await connection.query(sql, [title, description, id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to update role: ${error.message}`);
        }
    }
    async delete(id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM role WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to delete role: ${error.message}`);
        }
    }
}
exports.default = RoleModel;
//# sourceMappingURL=role.model.js.map