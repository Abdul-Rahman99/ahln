/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import { uploadSingleImage } from '../../middlewares/uploadSingleImage';

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
  try {
    uploadSingleImage('image')(req, res, (err: any) => {
      if (err) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('IMAGE_UPLOAD_FAILED'),
          err.message,
        );
      }
      if (!req.file) {
        return ResponseHandler.badRequest(res, i18n.__('NO_FILE_PROVIDED'));
      }

      ResponseHandler.success(res, i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'), {
        file: req.file,
      });
    });
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('IMAGE_UPLOAD_FAILED'),
      error.message,
    );
  }
});
