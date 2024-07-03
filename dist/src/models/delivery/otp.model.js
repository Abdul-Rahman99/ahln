"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../config/database"));
class OTPModel {
    async createOTP(otpData) {
        try {
            const connection = await database_1.default.connect();
            const createdAt = new Date();
            const updatedAt = new Date();
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const sqlFields = [
                'createdAt',
                'updatedAt',
                'box_id',
                'box_locker_id',
                'is_used',
                'otp',
                'box_locker_string',
                'delivery_package_id',
            ];
            const sqlParams = [
                createdAt,
                updatedAt,
                otpData.box_id,
                otpData.box_locker_id,
                false,
                otp,
                otpData.box_locker_string,
                otpData.delivery_package_id,
            ];
            const sql = `INSERT INTO OTP (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;
            const result = await connection.query(sql, sqlParams);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Unable to create OTP: ${error.message}`);
        }
    }
    async checkOTP(otp, deliveryPackageId) {
        const connection = await database_1.default.connect();
        try {
            if (!otp) {
                throw new Error('Please provide an otp');
            }
            const otpResult = await connection.query('SELECT id, box_locker_string FROM OTP WHERE otp = $1 AND is_used = FALSE', [otp]);
            if (otpResult.rows.length === 0) {
                throw new Error('OTP not found or already used');
            }
            const otpRecord = otpResult.rows[0];
            const boxLockerString = JSON.parse(otpRecord.box_locker_string);
            const boxId = boxLockerString.box_id;
            const boxLockerResult = await connection.query('SELECT serial_port FROM Box_Locker WHERE id = $1', [boxId]);
            if (boxLockerResult.rows.length == 0) {
                throw new Error(`Box locker not found for the given box id: ${boxId}`);
            }
            const serialPort = boxLockerResult.rows[0].serial_port;
            const deliveryPackageResult = await connection.query('SELECT delivery_package_id FROM OTP WHERE OTP = $1', [otp]);
            if (deliveryPackageResult.rows.length > 0) {
                const updatedAt = new Date();
                await connection.query('UPDATE Delivery_Package SET shipment_status = $1, is_delivered = $2, updatedAt = $3 WHERE id = $4', ['delivered', true, updatedAt, deliveryPackageId]);
            }
            await connection.query('DELETE FROM OTP WHERE id = $1', [otpRecord.id]);
            return serialPort;
        }
        catch (error) {
            throw new Error(`Unable to check OTP: ${error.message}`);
        }
        finally {
            connection.release();
        }
    }
    async getMany() {
        try {
            const connection = await database_1.default.connect();
            const sql = 'SELECT * FROM OTP';
            const result = await connection.query(sql);
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving OTPs: ${error.message}`);
        }
    }
    async getOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('Please provide in id');
            }
            const sql = 'SELECT * FROM OTP WHERE id=$1';
            const result = await connection.query(sql, [id]);
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not find OTP ${id}: ${error.message}`);
        }
    }
    async updateOne(otp, id) {
        try {
            const connection = await database_1.default.connect();
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
            connection.release();
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not update OTP ${id}: ${error.message}`);
        }
    }
    async deleteOne(id) {
        try {
            const connection = await database_1.default.connect();
            if (!id) {
                throw new Error('ID cannot be null. Please provide a valid OTP ID.');
            }
            const sql = `DELETE FROM OTP WHERE id=$1 RETURNING *`;
            const result = await connection.query(sql, [id]);
            connection.release();
            if (result.rows.length === 0) {
                throw new Error(`Could not find OTP with ID ${id}`);
            }
            return result.rows[0];
        }
        catch (error) {
            throw new Error(`Could not delete OTP ${id}: ${error.message}`);
        }
    }
    async getOTPsByUser(userId) {
        try {
            const connection = await database_1.default.connect();
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
            connection.release();
            return result.rows;
        }
        catch (error) {
            throw new Error(`Error retrieving OTPs for user ${userId}: ${error.message}`);
        }
    }
    async checkTrackingNumberAndUpdateStatus(trackingNumber) {
        const connection = await database_1.default.connect();
        try {
            if (!trackingNumber) {
                throw new Error('Please provide a tracking number');
            }
            const deliveryPackageResult = await connection.query('SELECT * FROM Delivery_Package WHERE tracking_number = $1', [trackingNumber]);
            if (deliveryPackageResult.rows.length == 0) {
                throw new Error('Delivery package not found for the given tracking number');
            }
            const deliveryPackage = deliveryPackageResult.rows[0];
            if (deliveryPackage.shipment_status === 'delivered' &&
                deliveryPackage.is_delivered === true) {
                throw new Error('The package has already been delivered');
            }
            const boxLockerResult = await connection.query('SELECT serial_port FROM box_locker WHERE id = $1', [deliveryPackage.box_locker_id]);
            if (boxLockerResult.rows.length == 0) {
                throw new Error(`Box locker not found for the given box id: ${deliveryPackage.box_locker_id}`);
            }
            const serialPort = boxLockerResult.rows[0].serial_port;
            const parsedSerialPort = JSON.parse(serialPort);
            const updatedAt = new Date();
            await connection.query('UPDATE Delivery_Package SET shipment_status = $1, is_delivered = $2, updatedAt = $3 WHERE tracking_number = $4', ['delivered', true, updatedAt, trackingNumber]);
            return parsedSerialPort;
        }
        catch (error) {
            throw new Error(`${error.message}`);
        }
        finally {
            connection.release();
        }
    }
}
exports.default = OTPModel;
//# sourceMappingURL=otp.model.js.map