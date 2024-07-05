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
    const delivery_package_id = req.body.delivery_package_id;
    const createdOTP = await otpModel.createOTP(newOTP, delivery_package_id);
    ResponseHandler.success(
      res,
      i18n.__('OTP_CREATED_SUCCESSFULLY'),
      createdOTP,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

export const getAllOTPs = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otps = await otpModel.getMany();
    ResponseHandler.success(res, i18n.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const getOTPById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const otpId = req.params.id;
    const otp = await otpModel.getOne(Number(otpId));
    ResponseHandler.success(res, i18n.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
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
    ResponseHandler.badRequest(res, error.message);
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
    ResponseHandler.badRequest(res, error.message);
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
      ResponseHandler.badRequest(res, error.message);
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
    if (verifiedOTP) {
      ResponseHandler.success(res, i18n.__('OTP_VERIFIED_SUCCESSFULLY'), {
        box_locker_string: verifiedOTP,
      });
    } else {
      ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'), null);
    }
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
  }
});

// function to check by tracking number
export const checkTrackingNumberAndUpdateStatus = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const trackingNumber = req.body.trackingNumber.toLowerCase();
      const boxId = req.body.boxId;
      if (!trackingNumber) {
        ResponseHandler.badRequest(res, i18n.__('TRACKING_NUMBER_REQUIRED'));
        return;
      }
      const result = await otpModel.checkTrackingNumberAndUpdateStatus(
        trackingNumber,
        boxId,
      );
      ResponseHandler.success(res, i18n.__('PACKAGE_UPDATED_SUCCESSFULLY'), {
        box_locker_string: result[0],
        pin: result[1],
      });
    } catch (error: any) {
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
