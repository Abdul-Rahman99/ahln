"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class UserDevicesModel {
    async saveUserDevice(userId, fcmToken) {
        try {
            const connection = await database_1.default.connect();
            const sql = `INSERT INTO user_devices (user_id, fcm_token) VALUES ($1, $2)`;
            await connection.query(sql, [userId, fcmToken]);
            connection.release();
        }
        catch (error) {
            throw new Error(`Could not save user device for user ${userId}: ${error.message}`);
        }
    }
    async getUserDeviceById(deviceId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM user_devices WHERE id = $1`;
            const result = await connection.query(sql, [deviceId]);
            connection.release();
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            throw new Error(`Could not retrieve user device ${deviceId}: ${error.message}`);
        }
    }
    async getAllUserDevices(userId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `SELECT * FROM user_devices WHERE user_id = $1`;
            const result = await connection.query(sql, [userId]);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Could not retrieve user devices for user ${userId}: ${error.message}`);
        }
    }
    async updateUserDevice(deviceId, fcmToken) {
        try {
            const connection = await database_1.default.connect();
            const updatedAt = new Date();
            const sql = `UPDATE user_devices SET fcm_token = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;
            const result = await connection.query(sql, [
                fcmToken,
                updatedAt,
                deviceId,
            ]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update user device ${deviceId}: ${error.message}`);
        }
    }
    async deleteUserDevice(deviceId) {
        try {
            const connection = await database_1.default.connect();
            const sql = `DELETE FROM user_devices WHERE id = $1 RETURNING *`;
            const result = await connection.query(sql, [deviceId]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`User device with ID ${deviceId} not found.`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete user device ${deviceId}: ${error.message}`);
        }
    }
}
exports.default = UserDevicesModel;
//# sourceMappingURL=user.devices.model.js.map