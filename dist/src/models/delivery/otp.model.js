"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class OTPModel {
    async createOTP(otpData, delivery_package_id) {
        const connection = await database_1.default.connect();
        try {
            const createdAt = new Date();
            const updatedAt = new Date();
            if (delivery_package_id) {
                const checkDeliveryPackageResult = await connection.query('SELECT * FROM delivery_package WHERE id = $1', [delivery_package_id]);
                if (checkDeliveryPackageResult.rows.length === 0) {
                    throw new Error('Delivery Package ID not found');
                }
            }
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'box_id',
                'box_locker_id',
                'is_used',
                'otp',
                'delivery_package_id',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                otpData.box_id,
                otpData.box_locker_id,
                false,
                otp,
                otpData.delivery_package_id,
            ];
            const sql = `INSERT INTO OTP (${sqlFields.join(', ')}) 
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
    async checkOTP(otp, delivery_package_id, boxId) {
        const connection = await database_1.default.connect();
        try {
            if (!otp) {
                throw new Error('Please provide an OTP');
            }
            const otpResult = await connection.query('SELECT box_locker_id FROM OTP WHERE otp = $1 AND is_used = FALSE AND box_id = $2', [otp, boxId]);
            if (otpResult.rows.length === 0) {
                throw new Error('OTP not found or already used');
            }
            const box_locker_id = otpResult.rows[0].box_locker_id;
            const boxLockerResult = await connection.query('SELECT serial_port FROM Box_Locker WHERE id = $1', [box_locker_id]);
            if (boxLockerResult.rows.length == 0) {
                throw new Error(`Box locker not found for the given box id: ${box_locker_id}`);
            }
            const serialPort = boxLockerResult.rows[0].serial_port;
            const parsedSerialPort = JSON.parse(serialPort);
            await connection.query('DELETE FROM OTP WHERE otp = $1', [otp]);
            return parsedSerialPort;
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
            const sql = 'SELECT * FROM OTP';
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
                throw new Error('Please provide in id');
            }
            const sql = 'SELECT * FROM OTP WHERE id=$1';
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
    async updateOne(otp, id) {
        const connection = await database_1.default.connect();
        try {
            const checkSql = 'SELECT * FROM OTP WHERE id=$1';
            const checkResult = await connection.query(checkSql, [id]);
            if (checkResult.rows.length === 0) {
                throw new Error(`OTP with ID ${id} does not exist`);
            }
            const queryParams = [];
            let paramIndex = 1;
            const updatedAt = new Date();
            const updateFields = Object.keys(otp)
                .map((key) => {
                if (otp[key] !== undefined &&
                    key !== 'id' &&
                    key !== 'createdAt') {
                    queryParams.push(otp[key]);
                    return `${key}=$${paramIndex++}`;
                }
                return null;
            })
                .filter((field) => field !== null);
            queryParams.push(updatedAt);
            updateFields.push(`updatedAt=$${paramIndex++}`);
            queryParams.push(id);
            const sql = `UPDATE OTP SET ${updateFields.join(', ')} WHERE id=$${paramIndex} RETURNING *`;
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
                throw new Error('ID cannot be null. Please provide a valid OTP ID.');
            }
            const sql = `DELETE FROM OTP WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            if (result.rows.length === 0) {
                throw new Error(`Could not find OTP with ID ${id}`);
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
    async getOTPsByUser(userId) {
        const connection = await database_1.default.connect();
        try {
            if (!userId) {
                throw new Error('ID cannot be null. Please provide a valid User ID.');
            }
            const checkSql = 'SELECT * FROM users WHERE id=$1';
            const checkResult = await connection.query(checkSql, [userId]);
            if (checkResult.rows.length === 0) {
                throw new Error(`OTP with ID ${userId} does not exist`);
            }
            const sql = `SELECT OTP.* FROM OTP
                   INNER JOIN Box ON OTP.box_id = Box.id
                   INNER JOIN Delivery_Package ON Box.id = Delivery_Package.box_id
                   WHERE Delivery_Package.customer_id = $1 OR Delivery_Package.vendor_id = $1 OR Delivery_Package.delivery_id = $1`;
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
    async checkTrackingNumberAndUpdateStatus(trackingNumber, boxId) {
        const connection = await database_1.default.connect();
        try {
            if (!trackingNumber) {
                throw new Error('Please provide a tracking number');
            }
            const deliveryPackageResult = await connection.query('SELECT * FROM Delivery_Package WHERE tracking_number = $1 AND box_id = $2', [trackingNumber, boxId]);
            if (deliveryPackageResult.rows.length === 0) {
                throw new Error('Delivery package not found for the given tracking number');
            }
            const deliveryPackage = deliveryPackageResult.rows[0];
            if (deliveryPackage.box_id !== boxId) {
                throw new Error('The provided box ID does not match the delivery package');
            }
            if (deliveryPackage.shipment_status === 'delivered' &&
                deliveryPackage.is_delivered === true) {
                throw new Error('The package has already been delivered');
            }
            const pin_result = deliveryPackage.delivery_pin;
            const boxLockerResult = await connection.query('SELECT serial_port FROM box_locker WHERE id = $1', [deliveryPackage.box_locker_id]);
            if (boxLockerResult.rows.length === 0) {
                throw new Error(`Box locker not found for the given box id: ${deliveryPackage.box_locker_id}`);
            }
            const serialPort = boxLockerResult.rows[0].serial_port;
            const parsedSerialPort = JSON.parse(serialPort);
            const updatedAt = new Date();
            await connection.query('UPDATE Delivery_Package SET shipment_status = $1, is_delivered = $2, updatedAt = $3 WHERE tracking_number = $4', ['delivered', true, updatedAt, trackingNumber]);
            return [parsedSerialPort, pin_result];
        }
        catch (error) {
            throw new Error(error.message);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = OTPModel;
//# sourceMappingURL=otp.model.js.map