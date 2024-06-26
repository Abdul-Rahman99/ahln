/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import OTPModel from '../../models/delivery/otp.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { OTP } from '../../types/otp.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const otpModel = new OTPModel();

export const createOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newOTP: OTP = req.body;
    const createdOTP = await otpModel.createOTP(newOTP);
    ResponseHandler.success(
      res,
      i18n.__('OTP_CREATED_SUCCESSFULLY'),
      createdOTP,
    );
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTP_CREATION_FAILED'),
      error.message,
    );
  }
});

export const getAllOTPs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otps = await otpModel.getMany();
    ResponseHandler.success(res, i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTPS_RETRIEVAL_FAILED'),
      error.message,
    );
  }
});

export const getOTPById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const otp = await otpModel.getOne(Number(otpId));
    ResponseHandler.success(res, i18n.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTP_RETRIEVAL_FAILED'),
      error.message,
    );
  }
});

export const updateOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const otpData: Partial<OTP> = req.body;
    const updatedOTP = await otpModel.updateOne(otpData, Number(otpId));
    ResponseHandler.success(
      res,
      i18n.__('OTP_UPDATED_SUCCESSFULLY'),
      updatedOTP,
    );
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTP_UPDATE_FAILED'),
      error.message,
    );
  }
});

export const deleteOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const deletedOTP = await otpModel.deleteOne(Number(otpId));
    ResponseHandler.success(
      res,
      i18n.__('OTP_DELETED_SUCCESSFULLY'),
      deletedOTP,
    );
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTP_DELETION_FAILED'),
      error.message,
    );
  }
});

export const getOTPsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const userId = req.params.userId;
      const otps = await otpModel.getOTPsByUser(userId);
      ResponseHandler.success(
        res,
        i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'),
        otps,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('OTPS_RETRIEVAL_FAILED'),
        error.message,
      );
    }
  },
);

//function to check OTP
export const checkOTP = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { otp, deliveryPackageId } = req.body;
    const verifiedOTP = await otpModel.checkOTP(otp, deliveryPackageId);
    if (verifiedOTP) {
      ResponseHandler.success(res, i18n.__('OTP_VERIFIED_SUCCESSFULLY'), {
        box_locker_string: verifiedOTP,
      });
    } else {
      ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'), null);
    }
  } catch (error: any) {
    ResponseHandler.internalError(
      res,
      i18n.__('OTP_VERIFICATION_FAILED'),
      error.message,
    );
  }
});

export const checkTrackingNumberAndUpdateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { trackingNumber } = req.body;
      if (!trackingNumber) {
        ResponseHandler.badRequest(res, i18n.__('TRACKING_NUMBER_REQUIRED'));
        return;
      }
      const result =
        await otpModel.checkTrackingNumberAndUpdateStatus(trackingNumber);
      ResponseHandler.success(res, i18n.__('PACKAGE_UPDATED_SUCCESSFULLY'), {
        box_locker_string: result,
      });
    } catch (error) {
      ResponseHandler.internalError(res, i18n.__('TRACKING_NUMBER_REQUIRED'));
    }
  },
);
