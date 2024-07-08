"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class UserPermissionModel {
    async assignPermission(userId, permissionId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO user_permission (user_id, permission_id) VALUES ($1, $2)`;
            await connection.query(sql, [userId, permissionId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async revokePermission(userId, permissionId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM user_permission WHERE user_id=$1 AND permission_id=$2`;
            await connection.query(sql, [userId, permissionId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getPermissionsByUserId(userId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT p.* FROM permission p JOIN user_permission up ON p.id = up.permission_id WHERE up.user_id = $1`;
            const result = await connection.query(sql, [userId]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async checkPermissionAssignment(user_id, permission_id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `
        SELECT 1 
        FROM user_permission 
        WHERE user_id = $1 AND permission_id = $2
      `;
            const result = await connection.query(sql, [user_id, permission_id]);
            return result.rows.length > 0;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = UserPermissionModel;
//# sourceMappingURL=user.permission.model.js.map