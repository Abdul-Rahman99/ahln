/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import UserDevicesModel from '../../models/users/user.devices.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';

const userDevicesModel = new UserDevicesModel();

export const registerDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { fcm_token }: { fcm_token: string } = req.body;
  const { id: user_id } = req.currentUser as { id: string }; // Assuming user_id is retrieved from authenticated user

  try {
    const savedDevice = await userDevicesModel.saveUserDevice(
      user_id,
      fcm_token,
    );
    ResponseHandler.success(
      res,
      i18n.__('DEVICE_REGISTERED_SUCCESSFULLY'),
      savedDevice,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const deleteDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { deviceId } = req.params;

  try {
    const deletedDevice = await userDevicesModel.deleteUserDevice(
      parseInt(deviceId, 10),
    );

    ResponseHandler.success(
      res,
      i18n.__('DEVICE_DELETED_SUCCESSFULLY'),
      deletedDevice,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const updateDevice = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { deviceId } = req.params;
  const { fcm_token }: { fcm_token: string } = req.body;

  try {
    const updatedDevice = await userDevicesModel.updateUserDevice(
      parseInt(deviceId, 10),
      fcm_token,
    );

    ResponseHandler.success(
      res,
      i18n.__('DEVICE_UPDATED_SUCCESSFULLY'),
      updatedDevice,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const getDevicesByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;

  try {
    const devices = await userDevicesModel.getAllUserDevices(userId);

    ResponseHandler.success(
      res,
      i18n.__('DEVICE_RETRIVED_BY_USER_SUCCESSFULLY'),
      devices,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const getUserDeviceById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { deviceId } = req.params;
    const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));

    if (!device) {
      return ResponseHandler.badRequest(res, i18n.__('USER_DEVICE_NOT_FOUND'));
    }

    ResponseHandler.success(
      res,
      i18n.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
      device,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};
