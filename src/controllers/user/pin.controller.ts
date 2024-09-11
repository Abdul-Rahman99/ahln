import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { PIN } from '../../types/pin.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import PINModel from '../../models/users/pin.model';
import authHandler from '../../utils/authHandler';
import BoxModel from '../../models/box/box.model';
import SystemLogModel from '../../models/logs/system.log.model';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import UserDevicesModel from '../../models/users/user.devices.model';
import UserModel from '../../models/users/user.model';

const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const boxModel = new BoxModel();
const pinModel = new PINModel();
const systemLog = new SystemLogModel();

export const createPin = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  try {
    const newPin: PIN = req.body;
    const boxExist = await boxModel.getOne(newPin.box_id);
    if (!boxExist) {
      const source = 'createPin';
      systemLog.createSystemLog(user, 'Box Id Invalid', source);
      return ResponseHandler.badRequest(res, i18n.__('BOX_ID_INVALID'));
    }

    const passcodeExist = await pinModel.getOnePinByPasscode(
      newPin.passcode,
      user,
    );
    if (passcodeExist) {
      const source = 'createPin';
      systemLog.createSystemLog(user, 'Passcode Dublicated', source);
      return ResponseHandler.badRequest(res, i18n.__('DUBLICATED_PASSCODE'));
    }

    const createdPin = await pinModel.createPIN(newPin, user);
    ResponseHandler.success(
      res,
      i18n.__('PIN_CREATED_SUCCESSFULLY'),
      createdPin,
    );
    notificationModel.createNotification(
      'createPin',
      i18n.__('PIN_CREATED_SUCCESSFULLY'),
      null,
      user,
      newPin.box_id,
    );
    const action = 'createPin';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('PIN_CREATED_SUCCESSFULLY'),
      newPin.box_id,
    );
    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
    try {
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('PIN_CREATION'),
        i18n.__('PIN_CREATED_SUCCESSFULLY'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const source = 'createPin';
      systemLog.createSystemLog(
        user,
        i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
        source,
      );
    }
  } catch (error) {
    const source = 'createPin';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, (error as Error).message);
    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
    try {
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('PIN_CREATION'),
        i18n.__('PIN_CREATED_FAILED'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const source = 'createPin';
      systemLog.createSystemLog(
        user,
        i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
        source,
      );
    }
    // next(error);
  }
});

export const getAllPinByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const pins = await pinModel.getAllPinByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('PINS_RETRIEVED_SUCCESSFULLY'),
        pins,
      );
    } catch (error) {
      const source = 'getAllPinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getOnePinByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const pinId = parseInt(req.params.id, 10);
      const pin = await pinModel.getOnePinByUser(pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_RETRIEVED_SUCCESSFULLY'), pin);
    } catch (error) {
      const source = 'getOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteOnePinByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const pinId = parseInt(req.params.id, 10);
      const pin = await pinModel.deleteOnePinByUser(pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_DELETED_SUCCESSFULLY'), pin);
      notificationModel.createNotification(
        'deleteOnePinByUser',
        i18n.__('PIN_DELETED_SUCCESSFULLY'),
        null,
        user,
        pin.box_id,
      );
      const action = 'deleteOnePinByUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PIN_DELETED_SUCCESSFULLY'),
        pin.box_id,
      );
    } catch (error) {
      const source = 'deleteOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateOnePinByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const pinId = parseInt(req.params.id, 10);
      const pinData: Partial<PIN> = req.body;
      const pin = await pinModel.updatePinByUser(pinData, pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_UPDATED_SUCCESSFULLY'), pin);
      notificationModel.createNotification(
        'updateOnePinByUser',
        i18n.__('PIN_UPDATED_SUCCESSFULLY'),
        null,
        user,
        pin.box_id,
      );
      const action = 'updateOnePinByUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PIN_UPDATED_SUCCESSFULLY'),
        pin.box_id,
      );
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('PIN_UPDATE'),
          i18n.__('PIN_UPDATED_SUCCESSFULLY'),
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'createPin';
        systemLog.createSystemLog(
          user,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    } catch (error) {
      const source = 'updateOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
export const checkPIN = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { passcode, box_id } = req.body;

    const userId = await pinModel.getUserByPasscode(passcode);
    const checkPinResult = await pinModel.checkPIN(passcode, box_id);

    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(userId);

    if (checkPinResult) {
      ResponseHandler.success(
        res,
        i18n.__('PIN_CHECKED_SUCCESSFULLY'),
        checkPinResult,
      );
      notificationModel.createNotification(
        'checkPIN',
        i18n.__('PIN_CHECKED_SUCCESSFULLY'),
        null,
        userId,
        box_id,
      );

      try {
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('DELIVERY_CHECK_PIN'),
          i18n.__('PIN_CHECKED_SUCCESSFULLY'),
        );

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        const source = 'checkPIN';
        systemLog.createSystemLog(
          userId,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
      const action = 'checkPIN';
      auditTrail.createAuditTrail(
        userId,
        action,
        i18n.__('PIN_CHECKED_SUCCESSFULLY'),
        box_id,
      );
    } else {
      notificationModel.createNotification(
        'checkPIN',
        i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
        null,
        userId,
        box_id,
      );
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('DELIVERY_CHECK_PIN'),
        i18n.__('PIN_CHECKED_FAILED'),
      );
      const action = 'checkPIN';
      auditTrail.createAuditTrail(
        userId,
        action,
        i18n.__('PIN_CHECKED_FAILED'),
        box_id,
      );
      ResponseHandler.badRequest(
        res,
        i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
      );
    }
  } catch (error) {
    const user = await userModel.findUserByBoxId(req.body.box_id);

    const source = 'checkPIN';
    systemLog.createSystemLog(user, (error as Error).message, source);
    const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);

    try {
      notificationModel.pushNotification(
        fcmToken,
        i18n.__('DELIVERY_CHECK_PIN'),
        i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      const source = 'checkPIN';
      systemLog.createSystemLog(
        user,
        i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
        source,
      );
    }

    ResponseHandler.badRequest(res, (error as Error).message);
    // next(error);
  }
});
