/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import authHandler from '../../utils/authHandler';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import OfflineOtps from '../../models/delivery/offline.otps.model';
import SystemLogModel from '../../models/logs/system.log.model';
import i18n from '../../config/i18n';

const offlineOTPsModel = new OfflineOtps();
const systemLog = new SystemLogModel();

export const createOfflineOTPs = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const boxId = req.body.box_id;
      const otp = await offlineOTPsModel.createOfflineOtps(boxId);
      ResponseHandler.success(res, i18n.__('OTP_CRAETED_SUCCESSFULLY'), otp);
    } catch (error: any) {
      const source = 'createOfflineOTPs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllOfflineOTPs = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const boxId = req.params.box_id;
      const otps = await offlineOTPsModel.getAllOfflineOtps(boxId);
      ResponseHandler.success(
        res,
        i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'),
        otps,
      );
    } catch (error: any) {
      const source = 'getAllOfflineOTPs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.internalError(res, error.message);
      // next(error);
    }
  },
);