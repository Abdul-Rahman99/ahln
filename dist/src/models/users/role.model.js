"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class RoleModel {
    async create(title, description) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO role (title, description) VALUES ($1, $2) RETURNING *`;
            const result = await connection.query(sql, [title, description]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getAll() {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM role';
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
    async getById(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = 'SELECT * FROM role WHERE id=$1';
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
    async update(id, title, description) {
        const connection = await database_1.default.connect();
        try {
            const sql = `UPDATE role SET title=$1, description=$2 WHERE id=$3 RETURNING *`;
            const result = await connection.query(sql, [title, description, id]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async delete(id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM role WHERE id=$1 RETURNING *`;
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
}
exports.default = RoleModel;
//# sourceMappingURL=role.model.js.map