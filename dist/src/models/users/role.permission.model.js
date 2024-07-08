"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class RolePermissionModel {
    async assignPermission(roleId, permissionId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2)`;
            await connection.query(sql, [roleId, permissionId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async revokePermission(roleId, permissionId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2`;
            await connection.query(sql, [roleId, permissionId]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getPermissionsByRole(roleId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT p.* FROM permission p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = $1`;
            const result = await connection.query(sql, [roleId]);
            return result.rows;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async checkPermissionAssignment(role_id, permission_id) {
        const connection = await database_1.default.connect();
        try {
            const sql = `
        SELECT 1 
        FROM role_permission 
        WHERE role_id = $1 AND permission_id = $2
      `;
            const result = await connection.query(sql, [role_id, permission_id]);
            return result.rows.length > 0;
        }
        catch (error) {
            console.error(`Error checking permission assignment: ${error.message}`);
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = RolePermissionModel;
//# sourceMappingURL=role.permission.model.js.map