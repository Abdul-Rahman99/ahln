/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserDevicesModel from '../../models/users/user.devices.model';

const userDevicesModel = new UserDevicesModel();

export const registerDevice = async (req: Request, res: Response) => {
  const { fcm_token }: { fcm_token: string } = req.body;
  const { id: user_id } = req.currentUser as { id: string }; // Assuming user_id is retrieved from authenticated user

  try {
    await userDevicesModel.saveUserDevice(user_id, fcm_token);

    res.status(201).json({ message: 'Device registered successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;

  try {
    const deletedDevice = await userDevicesModel.deleteUserDevice(
      parseInt(deviceId, 10),
    );

    res
      .status(200)
      .json({ message: 'Device deleted successfully', device: deletedDevice });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateDevice = async (req: Request, res: Response) => {
  const { deviceId } = req.params;
  const { fcm_token }: { fcm_token: string } = req.body;

  try {
    const updatedDevice = await userDevicesModel.updateUserDevice(
      parseInt(deviceId, 10),
      fcm_token,
    );

    res
      .status(200)
      .json({ message: 'Device updated successfully', device: updatedDevice });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getDevicesByUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const devices = await userDevicesModel.getAllUserDevices(userId);

    res.status(200).json(devices);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
