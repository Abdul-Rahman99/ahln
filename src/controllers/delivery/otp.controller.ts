/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import OTPModel from '../../models/delivery/otp.model';
import asyncHandler from '../../middlewares/asyncHandler';
import db from '../../config/database';

import { OTP } from '../../types/otp.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();
const systemLog = new SystemLogModel();
const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const otpModel = new OTPModel();

export const createOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newOTP: OTP = req.body;
    const delivery_package_id = req.body.delivery_package_id;
    const createdOTP = await otpModel.createOTP(newOTP, delivery_package_id);
    ResponseHandler.success(
      res,
      i18n.__('OTP_CREATED_SUCCESSFULLY'),
      createdOTP,
    );
    const user = await authHandler(req, res);

    notificationModel.createNotification(
      'createOTP',
      i18n.__('OTP_CREATED_SUCCESSFULLY'),
      null,
      user,
    );
    const auditUser = await authHandler(req, res);
    const action = 'createOTP';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('OTP_CREATED_SUCCESSFULLY'),
    );
    // next();
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'createOTP';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getAllOTPs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otps = await otpModel.getMany();
    ResponseHandler.success(res, i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'getAllOPTs';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.internalError(res, error.message);
    // next(error);
  }
});

export const getOTPById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const otp = await otpModel.getOne(Number(otpId));
    ResponseHandler.success(res, i18n.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'getOTPById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

// export const updateOTP = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const otpId = req.params.id;
//       const otpData: Partial<OTP> = req.body;
//       const updatedOTP = await otpModel.updateOne(otpData, Number(otpId));
//       ResponseHandler.success(
//         res,
//         i18n.__('OTP_UPDATED_SUCCESSFULLY'),
//         updatedOTP,
//       );
//       const auditUser = await authHandler(req, res, next);
//       notificationModel.createNotification(
//         'updateOTP',
//         i18n.__('OTP_UPDATED_SUCCESSFULLY'),
//         null,
//         auditUser,
//       );
//       const action = 'updateOTP';
//       auditTrail.createAuditTrail(
//         auditUser,
//         action,
//         i18n.__('OTP_UPDATED_SUCCESSFULLY'),
//       );
//       const fcmToken =
//         await userDevicesModel.getFcmTokenDevicesByUser(auditUser);
//       try {
//         notificationModel.pushNotification(
//           fcmToken,
//           i18n.__('UPDATE_OTP'),
//           i18n.__('OTP_UPDATED_SUCCESSFULLY'),
//         );
//         // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       } catch (error: any) {
//         const source = 'checkPIN';
//         systemLog.createSystemLog(
//           auditUser,
//           i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
//           source,
//         );
//       }
//     } catch (error: any) {
//       const user = await authHandler(req, res);
//       const source = 'updateOPT';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       ResponseHandler.badRequest(res, error.message);
//        next(error);
//     }
//   },
// );

export const deleteOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const deletedOTP = await otpModel.deleteOne(Number(otpId));
    ResponseHandler.success(
      res,
      i18n.__('OTP_DELETED_SUCCESSFULLY'),
      deletedOTP,
    );
    const auditUser = await authHandler(req, res);
    notificationModel.createNotification(
      'deleteOTP',
      i18n.__('OTP_DELTED_SUCCESSFULLY'),
      null,
      auditUser,
    );
    const action = 'deleteOTP';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('OTP_DELETED_SUCCESSFULLY'),
    );
    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(auditUser);
    try {
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('DELETE_OTP'),
        i18n.__('OTP_DELETED_SUCCESSFULLY'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const source = 'deleteOTP';
      systemLog.createSystemLog(
        auditUser,
        i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
        source,
      );
    }
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'deleteOTP';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getOTPsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = await authHandler(req, res);
      const otps = await otpModel.getOTPsByUser(userId);
      ResponseHandler.success(
        res,
        i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'),
        otps,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getOPTsByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

//function to check OTP
export const checkOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { otp, delivery_package_id, boxId } = req.body;
    const verifiedOTP = await otpModel.checkOTP(
      otp,
      delivery_package_id,

      boxId,
    );
    const connection = await db.connect();

    const userResult = await connection.query(
      'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
      [boxId],
    );
    connection.release();
    const user = userResult.rows[0].user_id;
    if (verifiedOTP) {
      ResponseHandler.success(res, i18n.__('OTP_VERIFIED_SUCCESSFULLY'), {
        box_locker_string: verifiedOTP[0],
        otp: verifiedOTP[1],
      });
      notificationModel.createNotification(
        'checkOTP',
        i18n.__('OTP_VERIFIED_SUCCESSFULLY'),
        null,
        user,
      );
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('CHECK_OTP'),
          i18n.__('OTP_VERIFIED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'checkOTP';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    } else {
      const source = 'checkOTP';
      systemLog.createSystemLog(user, 'Invalid Otp', source);
      ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'), null);
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('CHECK_OTP'),
          i18n.__('INVALID_OTP'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'checkOTP';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    }
  } catch (error: any) {
    const connection = await db.connect();

    const userResult = await connection.query(
      'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
      [req.body.boxId],
    );
    connection.release();
    const user = userResult.rows[0].user_id;
    const source = 'checkOTP';
    systemLog.createSystemLog(user, (error as Error).message, source);
    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);

    try {
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('CHECK_OTP'),
        i18n.__('INVALID_OTP'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const source = 'checkOTP';
      systemLog.createSystemLog(
        user,
        i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
        source,
      );
    }
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

// function to check by tracking number
export const checkTrackingNumberAndUpdateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const trackingNumber = req.body.trackingNumber.toLowerCase();
      const boxId = req.body.boxId;
      const connection = await db.connect();

      const userResult = await connection.query(
        'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
        [boxId],
      );
      connection.release();
      const user = userResult.rows[0].user_id;
      if (!trackingNumber) {
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(user, 'Tracking number Required', source);
        ResponseHandler.badRequest(res, i18n.__('TRACKING_NUMBER_REQUIRED'));
        return;
      }
      const result = await otpModel.checkTrackingNumberAndUpdateStatus(
        trackingNumber,
        boxId,
      );
      if (result) {
        ResponseHandler.success(res, i18n.__('PACKAGE_UPDATED_SUCCESSFULLY'), {
          box_locker_string: result[0],
          pin: result[1],
          otp: result[2],
        });
        notificationModel.createNotification(
          'checkTrackingNumberAndUpdateStatus',
          i18n.__('PACKAGE_UPDATED_SUCCESSFULLY'),
          null,
          user,
        );
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);

        try {
          notificationModel.pushNotification(
            fcmToken,
            i18n.__('CHECK_TRACKING_NUMBER'),
            i18n.__('TRACKING_NUMBER_VERIFIED_SUCCESSFULLY'),
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'checkTrackingNumberAndUpdateStatus';
          systemLog.createSystemLog(
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
      } else {
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(user, 'Invalid Otp', source);
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
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
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
        ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'), null);
      }
    } catch (error: any) {
      const connection = await db.connect();

      const userResult = await connection.query(
        'SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1',
        [req.body.boxId],
      );
      connection.release();
      const user = userResult.rows[0].user_id;
      const source = 'checkTrackingNumberAndUpdateStatus';
      systemLog.createSystemLog(user, (error as Error).message, source);
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);

      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('CHECK_TRACKING_NUMBER'),
          i18n.__('PACKAGE_ID_INVALID'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
