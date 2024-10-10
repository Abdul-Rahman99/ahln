/* eslint-disable @typescript-eslint/no-explicit-any */
import db from '../../config/database';
import { OTP } from '../../types/otp.type';
import UserDevicesModel from '../users/user.devices.model';
import NotificationModel from '../logs/notification.model';
import SystemLogModel from '../logs/system.log.model';
import i18n from '../../config/i18n';
import AuditTrailModel from '../logs/audit.trail.model';
import moment from 'moment-timezone';

const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();

class OTPModel {
  // Create OTP
  async createOTP(
    otpData: Partial<OTP>,
    delivery_package_id: string,
  ): Promise<OTP> {
    const connection = await db.connect();

    try {
      const createdAt = moment().tz('Asia/Dubai').format();
      const updatedAt = moment().tz('Asia/Dubai').format();

      if (delivery_package_id) {
        const checkDeliveryPackageResult = await connection.query(
          'SELECT * FROM delivery_package WHERE id = $1',
          [delivery_package_id],
        );

        if (checkDeliveryPackageResult.rows.length === 0) {
          throw new Error('Delivery Package ID not found');
        }
      }

      // Generate the OTP
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
        false, // is_used is set to false by default
        otp,
        otpData.delivery_package_id,
      ];

      const sql = `INSERT INTO OTP (${sqlFields.join(', ')}) 
                VALUES (${sqlParams.map((_, index) => `$${index + 1}`).join(', ')}) 
                   RETURNING *`;

      const result = await connection.query(sql, sqlParams);

      return result.rows[0];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  async checkOTP(
    otp: string,
    delivery_package_id: string,
    boxId: string,
  ): Promise<any> {
    const connection = await db.connect();
    await connection.query('BEGIN');
    try {
      if (!otp) {
        throw new Error('Please provide an OTP');
      }

      // Check if OTP exists and is not used
      const otpResult = await connection.query(
        'SELECT Delivery_Package.otp AS delivery_package_otp, OTP.box_locker_id, OTP.delivery_package_id FROM OTP LEFT JOIN Delivery_Package ON OTP.delivery_package_id = Delivery_Package.id WHERE OTP.otp = $1 AND OTP.is_used = FALSE AND OTP.box_id = $2',
        [otp, boxId],
      );

      if (otpResult.rows.length === 0) {
        const userResult = await connection.query(
          'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
          [boxId],
        );

        const user_id = userResult.rows[0].user_id;

        const action = 'checkOTP';
        auditTrail.createAuditTrail(
          user_id,
          action,
          i18n.__('OTP_NOT_FOUND_OR_ALREADY_USED'),
          boxId,
        );
        throw new Error('OTP not found or already used');
      }

      const box_locker_id = otpResult.rows[0].box_locker_id;

      // Get the serial port from the Box_Locker table
      const boxLockerResult = await connection.query(
        'SELECT serial_port FROM Box_Locker WHERE id = $1',
        [box_locker_id],
      );

      if (boxLockerResult.rows.length === 0) {
        throw new Error(
          `Box locker not found for the given box id: ${box_locker_id}`,
        );
      }

      const serialPort = boxLockerResult.rows[0].serial_port;
      const parsedSerialPort = JSON.parse(serialPort);
      // Mark the OTP as used and delete the record
      await connection.query('DELETE FROM OTP WHERE otp = $1', [otp]);

      let otpResultDP;
      let otpResultt;

      if (otpResult.rows[0].delivery_package_id) {
        otpResultDP = await connection.query(
          'SELECT otp FROM Delivery_Package WHERE id = $1',
          [otpResult.rows[0].delivery_package_id],
        );
        otpResultt = otpResultDP.rows[0].otp;
      }

      await connection.query('COMMIT');
      return [parsedSerialPort, otpResultt];
    } catch (error) {
      await connection.query('ROLLBACK');
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get all OTPs
  async getMany(): Promise<OTP[]> {
    const connection = await db.connect();

    try {
      const sql = 'SELECT * FROM OTP';
      const result = await connection.query(sql);

      return result.rows as OTP[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get specific OTP by ID
  async getOne(id: number): Promise<OTP> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('Please provide in id');
      }
      const sql = 'SELECT * FROM OTP WHERE id=$1';
      const result = await connection.query(sql, [id]);

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Update OTP
  async updateOne(otp: Partial<OTP>, id: number): Promise<OTP> {
    const connection = await db.connect();
    try {
      // Check if the OTP exists
      const checkSql = 'SELECT * FROM OTP WHERE id=$1';
      const checkResult = await connection.query(checkSql, [id]);

      if (checkResult.rows.length === 0) {
        throw new Error(`OTP with ID ${id} does not exist`);
      }

      const queryParams: unknown[] = [];
      let paramIndex = 1;

      const updatedAt = new Date();

      const updateFields = Object.keys(otp)
        .map((key) => {
          if (
            otp[key as keyof OTP] !== undefined &&
            key !== 'id' &&
            key !== 'createdAt'
          ) {
            queryParams.push(otp[key as keyof OTP]);
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

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
  // Delete OTP
  async deleteOne(id: number): Promise<OTP> {
    const connection = await db.connect();

    try {
      if (!id) {
        throw new Error('ID cannot be null. Please provide a valid OTP ID.');
      }
      const sql = `DELETE FROM OTP WHERE id=$1 RETURNING *`;

      const result = await connection.query(sql, [id]);

      if (result.rows.length === 0) {
        throw new Error(`Could not find OTP with ID ${id}`);
      }

      return result.rows[0] as OTP;
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Get OTPs by User
  async getOTPsByUser(userId: string): Promise<OTP[]> {
    const connection = await db.connect();

    try {
      if (!userId) {
        throw new Error('ID cannot be null. Please provide a valid User ID.');
      }

      // Check if the OTP exists
      const checkSql = 'SELECT * FROM users WHERE id=$1';
      const checkResult = await connection.query(checkSql, [userId]);

      if (checkResult.rows.length === 0) {
        throw new Error(`OTP with ID ${userId} does not exist`);
      }

      const sql = `SELECT OTP.* FROM OTP
                   INNER JOIN Box ON OTP.box_id = Box.id
                   INNER JOIN Delivery_Package ON Box.id = Delivery_Package.box_id
                   WHERE Delivery_Package.customer_id = $1 OR Delivery_Package.vendor_id = $1 OR Delivery_Package.delivery_id = $1`; // add another inner join for address table
      const result = await connection.query(sql, [userId]);

      return result.rows as OTP[];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }

  // Check tracking number and update delivery status
  async checkTrackingNumberAndUpdateStatus(
    trackingNumber: string,
    boxId: string,
  ): Promise<any> {
    const connection = await db.connect();
    try {
      if (!trackingNumber) {
        throw new Error('Please provide a tracking number');
      }

      const deliveryPackageResult = await connection.query(
        'SELECT * FROM Delivery_Package WHERE tracking_number = $1 AND box_id = $2',
        [trackingNumber, boxId],
      );

      if (deliveryPackageResult.rows.length === 0) {
        throw new Error(
          'Delivery package not found for the given tracking number',
        );
      }

      const deliveryPackage = deliveryPackageResult.rows[0];

      // Validate the boxId
      if (deliveryPackage.box_id !== boxId) {
        throw new Error(
          'The provided box ID does not match the delivery package',
        );
      }

      if (
        deliveryPackage.shipment_status === 'delivered' &&
        deliveryPackage.is_delivered === true
      ) {
        const userResult = await connection.query(
          'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
          [boxId],
        );

        const user_id = userResult.rows[0].user_id;

        const fcmToken =
          await userDevicesModel.getFcmTokenDevicesByUser(user_id);
        try {
          notificationModel.pushNotification(
            fcmToken,
            i18n.__('CHECK_TRACKING_NUMBER'),
            i18n.__('PACKAGE_ALREADY_DELIVERED'),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'checkTrackingNumberAndUpdateStatus';
          systemLog.createSystemLog(
            user_id,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }

        throw new Error('The package has already been delivered');
      }
      const pin_result = deliveryPackage.delivery_pin;
      const boxLockerResult = await connection.query(
        'SELECT serial_port FROM box_locker WHERE id = $1',
        [deliveryPackage.box_locker_id],
      );

      if (boxLockerResult.rows.length === 0) {
        throw new Error(
          `Box locker not found for the given box id: ${deliveryPackage.box_locker_id}`,
        );
      }

      const serialPort = boxLockerResult.rows[0].serial_port;
      const parsedSerialPort = JSON.parse(serialPort);

      const updatedAt = new Date();
      await connection.query(
        'UPDATE Delivery_Package SET shipment_status = $1, is_delivered = $2, updatedAt = $3 WHERE tracking_number = $4',
        ['delivered', true, updatedAt, trackingNumber],
      );
      // console.log(deliveryPackage, 'deliveryPackage');

      return [parsedSerialPort, pin_result, deliveryPackage.title];
    } catch (error) {
      throw new Error((error as Error).message);
    } finally {
      connection.release();
    }
  }
}

export default OTPModel;
