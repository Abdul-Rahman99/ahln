/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();

export const registerDevice = async (req: Request, res: Response) => {
  const { fcm_token }: { fcm_token: string } = req.body;
  const { id: user_id } = req.currentUser as { id: string }; // Assuming user_id is retrieved from authenticated user

  try {
    await userDevicesModel.saveUserDevice(user_id, fcm_token);

    res
      .status(201)
      .json({ success: true, message: 'Device registered successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;

  try {
    await userDevicesModel.deleteUserDevice(parseInt(deviceId, 10));

    res.status(200).json({
      success: true,
      message: 'Device deleted successfully',
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const { fcm_token }: { fcm_token: string } = req.body;

  try {
    await userDevicesModel.updateUserDevice(parseInt(deviceId, 10), fcm_token);

    res
      .status(200)
      .json({ success: true, message: 'Device updated successfully' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getDevicesByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const devices = await userDevicesModel.getAllUserDevices(userId);

    res.status(200).json({ success: true, data: devices });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getUserDeviceById = async (req: Request, res: Response) => {
  try {
    const { deviceId } = req.params;
    const device = await userDevicesModel.getUserDeviceById(parseInt(deviceId));

    if (!device) {
      return res.status(404).json({
        message: i18n.__('USER_DEVICE_NOT_FOUND', { deviceId }),
      });
    }

    res.status(200).json({ success: true, data: device });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
