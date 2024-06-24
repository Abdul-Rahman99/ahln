"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class RolePermissionModel {
    async assignPermission(roleId, permissionId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO role_permission (role_id, permission_id) VALUES ($1, $2)`;
            await connection.query(sql, [roleId, permissionId]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Unable to assign permission: ${error.message}`);
        }
    }
    async revokePermission(roleId, permissionId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM role_permission WHERE role_id=$1 AND permission_id=$2`;
            await connection.query(sql, [roleId, permissionId]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Unable to revoke permission: ${error.message}`);
        }
    }
    async getPermissionsByRole(roleId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT p.* FROM permission p JOIN role_permission rp ON p.id = rp.permission_id WHERE rp.role_id = $1`;
            const result = await connection.query(sql, [roleId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Unable to get permissions by role: ${error.message}`);
        }
    }
    async checkPermissionAssignment(role_id, permission_id) {
        try {
            const connection = await database_1.default.connect();
            const sql = `
        SELECT 1 
        FROM role_permission 
        WHERE role_id = $1 AND permission_id = $2
      `;
            const result = await connection.query(sql, [role_id, permission_id]);
            connection.release();
            return result.rows.length > 0;
        }
        catch (error) {
            console.error(`Error checking permission assignment: ${error.message}`);
            throw new Error(`Could not check permission assignment: ${error.message}`);
        }
    }
}
exports.default = RolePermissionModel;
//# sourceMappingURL=role.permission.model.js.map