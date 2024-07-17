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
      const createdPin = await pinModel.createPIN(newPin, user);
      ResponseHandler.success(
        res,
        i18n.__('PIN_CREATED_SUCCESSFULLY'),
        createdPin,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createPin';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('PIN_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'createPin';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
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
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
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
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
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
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteOnePinByUser';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('PIN_DELETED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
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
      const auditUser = await authHandler(req, res, next);
      const action = 'updateOnePinByUser';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('PIN_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateOnePinByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
export const checkPIN = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await authHandler(req, res, next);
      const { passcode, box_id } = req.body;

      const checkPinResult = await pinModel.checkPIN(passcode, box_id);

      if (checkPinResult) {
        ResponseHandler.success(
          res,
          i18n.__('PIN_CHECKED_SUCCESSFULLY'),
          checkPinResult,
        );
      } else {
        const user = await authHandler(req, res, next);
        const source = 'checkPIN';
        systemLog.createSystemLog(
          user,
          'Pin Invalid Or Out Of Time Range',
          source,
        );
        ResponseHandler.badRequest(
          res,
          i18n.__('PIN_INVALID_OR_OUT_OF_TIME_RANGE'),
        );
      }
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'checkPIN';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      next(error);
    }
  },
);
