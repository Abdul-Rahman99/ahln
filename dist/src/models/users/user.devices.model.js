"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class UserDevicesModel {
    async saveUserDevice(userId, fcmToken) {
        const connection = await database_1.default.connect();
        try {
            const sql = `INSERT INTO user_devices (user_id, fcm_token) VALUES ($1, $2)`;
            await connection.query(sql, [userId, fcmToken]);
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getUserDeviceById(deviceId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM user_devices WHERE id = $1`;
            const result = await connection.query(sql, [deviceId]);
            return result.rows.length ? result.rows[0] : null;
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getFcmTokenDevicesByUser(user) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT fcm_token FROM user_devices WHERE user_id = $1`;
            const result = await connection.query(sql, [user]);
            return result.rows.length ? result.rows : [];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async getAllUserDevices(userId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `SELECT * FROM user_devices WHERE user_id = $1`;
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
    async updateUserDevice(deviceId, fcmToken) {
        const connection = await database_1.default.connect();
        try {
            const updatedAt = new Date();
            const sql = `UPDATE user_devices SET fcm_token = $1, updatedAt = $2 WHERE id = $3 RETURNING *`;
            const result = await connection.query(sql, [
                fcmToken,
                updatedAt,
                deviceId,
            ]);
            return result.rows[0];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
    async deleteUserDevice(deviceId) {
        const connection = await database_1.default.connect();
        try {
            const sql = `DELETE FROM user_devices WHERE id = $1 RETURNING *`;
            const result = await connection.query(sql, [deviceId]);
            if (result.rows.length === 0) {
                throw new Error(`User device with ID ${deviceId} not found.`);
            }
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
exports.default = UserDevicesModel;
//# sourceMappingURL=user.devices.model.js.map