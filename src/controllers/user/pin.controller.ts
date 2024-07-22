import { Request, Response, NextFunction } from 'express';
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

const userDevicesModel = new UserDevicesModel();
const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const boxModel = new BoxModel();
const pinModel = new PINModel();
const systemLog = new SystemLogModel();

export const createPin = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newPin: PIN = req.body;
      const user = await authHandler(req, res, next);
      const boxExist = await boxModel.getOne(newPin.box_id);
      if (!boxExist) {
        const user = await authHandler(req, res, next);
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
      );
      const action = 'createPin';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PIN_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'createPin';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllPinByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);
      const pins = await pinModel.getAllPinByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('PINS_RETRIEVED_SUCCESSFULLY'),
        pins,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllPinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getOnePinByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pinId = parseInt(req.params.id, 10);
      const user = await authHandler(req, res, next);
      const pin = await pinModel.getOnePinByUser(pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_RETRIEVED_SUCCESSFULLY'), pin);
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteOnePinByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pinId = parseInt(req.params.id, 10);
      const user = await authHandler(req, res, next);
      const pin = await pinModel.deleteOnePinByUser(pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_DELETED_SUCCESSFULLY'), pin);
      notificationModel.createNotification(
        'deleteOnePinByUser',
        i18n.__('PIN_DELETED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'deleteOnePinByUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PIN_DELETED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateOnePinByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pinId = parseInt(req.params.id, 10);
      const user = await authHandler(req, res, next);
      const pinData: Partial<PIN> = req.body;
      const pin = await pinModel.updatePinByUser(pinData, pinId, user);
      ResponseHandler.success(res, i18n.__('PIN_UPDATED_SUCCESSFULLY'), pin);
      notificationModel.createNotification(
        'updateOnePinByUser',
        i18n.__('PIN_UPDATED_SUCCESSFULLY'),
        null,
        user,
      );
      const action = 'updateOnePinByUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('PIN_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
export const checkPIN = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { passcode, box_id } = req.body;

      const checkPinResult = await pinModel.checkPIN(passcode, box_id);
      const userId = await pinModel.getUserByPasscode(passcode);

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
      } else {
        ResponseHandler.badRequest(
          res,
          i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
        );
        notificationModel.createNotification(
          'checkPIN',
          i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
          null,
          userId,
        );
        notificationModel.pushNotification(
          fcmToken,
          i18n.__('DELIVERY_CHECK_PIN'),
          i18n.__('PIN_CHECKED_FAILED'),
        );
      }
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'checkPIN';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
