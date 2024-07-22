/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import { uploadSingleImage } from '../../middlewares/uploadSingleImage';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  try {
    uploadSingleImage('image')(req, res, async (err: any) => {
      if (err) {
        const user = await authHandler(req, res);
        const source = 'uploadImage';
        systemLog.createSystemLog(user, (err as Error).message, source);
        return ResponseHandler.badRequest(res, err.message);
      }
      if (!req.file) {
        const user = await authHandler(req, res);
        const source = 'uploadImage';
        systemLog.createSystemLog(user, (err as Error).message, source);
        return ResponseHandler.badRequest(res, i18n.__('NO_FILE_PROVIDED'));
      }

      ResponseHandler.success(res, i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'), {
        file: req.file,
      });
    });
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'uploadImage';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});
