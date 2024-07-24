/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserDevicesModel from '../../models/users/user.devices.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const userDevicesModel = new UserDevicesModel();

// export const registerDevice = async (req: Request, res: Response) => {
//   const { fcm_token }: { fcm_token: string } = req.body;
//   const { id: user_id } = req.currentUser as { id: string }; // Assuming user_id is retrieved from authenticated user
//   const auditUser = await authHandler(req, res);

//   try {
//     const savedDevice = await userDevicesModel.saveUserDevice(
//       user_id,
//       fcm_token,
//     );
//     ResponseHandler.success(
//       res,
//       i18n.__('DEVICE_REGISTERED_SUCCESSFULLY'),
//       savedDevice,
//     );
//     const action = 'registerDevice';
//     auditTrail.createAuditTrail(
//       auditUser,
//       action,
//       i18n.__('DEVICE_REGISTERED_SUCCESSFULLY'),
//     );
//   } catch (error: any) {
//     const user = await authHandler(req, res);
//     const source = 'registerDevice';
//     systemLog.createSystemLog(user, (error as Error).message, source);
//     ResponseHandler.badRequest(res, error.message);
//     // next(error);
//   }
// };

export const deleteDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const user = await authHandler(req, res);

  try {
    const deletedDevice = await userDevicesModel.deleteUserDevice(
      parseInt(deviceId, 10),
    );

    ResponseHandler.success(
      res,
      i18n.__('DEVICE_DELETED_SUCCESSFULLY'),
      deletedDevice,
    );
    const action = 'deletedDevice';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('DEVICE_DELETED_SUCCESSFULLY'),
    );
  } catch (error: any) {
    const source = 'deleteDevice';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const { fcm_token }: { fcm_token: string } = req.body;
  const user = await authHandler(req, res);

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
    const action = 'updateDevice';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('DEVICE_UPDATED_SUCCESSFULLY'),
    );
  } catch (error: any) {
    const source = 'updateDevice';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getDevicesByUser = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const devices = await userDevicesModel.getAllUserDevices(user);

    ResponseHandler.success(
      res,
      i18n.__('DEVICE_RETRIVED_BY_USER_SUCCESSFULLY'),
      devices,
    );
  } catch (error: any) {
    const source = 'getDevicesByUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getUserDeviceById = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const { deviceId } = req.params;
    const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));

    if (!device) {
      const source = 'getUserDeviceById';
      systemLog.createSystemLog(user, 'User Device Not Found', source);
      return ResponseHandler.badRequest(res, i18n.__('USER_DEVICE_NOT_FOUND'));
    }

    ResponseHandler.success(
      res,
      i18n.__('SALES_INVOICES_BY_BOX_ID_RETRIEVED_SUCCESSFULLY'),
      device,
    );
  } catch (error: any) {
    const source = 'getUserDeviceById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};
