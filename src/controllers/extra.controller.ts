/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import UserModel from '../models/users/user.model';
import UserDevicesModel from '../models/users/user.devices.model';
import NotificationModel from '../models/logs/notification.model';
import SystemLogModel from '../models/logs/system.log.model';
import i18n from '../config/i18n';
import DeliveryPackageModel from '../models/delivery/delivery.package.model';

const deliveryPackageModel = new DeliveryPackageModel();
const systemLog = new SystemLogModel();
const notificationModel = new NotificationModel();
const userDevicesModel = new UserDevicesModel();
const userModel = new UserModel();

export const getToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const checkToken = await userModel.findByToken(token);
  if (!checkToken) {
    return res
      .status(403)
      .send({ success: false, message: 'Token Invalid.', data: {} });
  }
  return res
    .status(200)
    .send({ success: true, message: 'Token Valid.', data: {} });
});

export const noToken = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ success: true, message: 'Server Is Alive.', data: {} });
});

// Calculate distance between two points in km
const getDistanceFromLatLonInKm = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// Convert degrees to radians
function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}

export const sendNotificationIfNearby = async (
  sentLat: number,
  sentLon: number,
  storedLat: number,
  storedLon: number,
  userId: string,
) => {
  const meteres = 10;
  const distance = getDistanceFromLatLonInKm(
    sentLat,
    sentLon,
    storedLat,
    storedLon,
  );
  if (Math.abs(distance - meteres) < 10) {
    console.log('Nearby');

    const deliveryPackageExists =
      await deliveryPackageModel.getTodayDeliveryPackages(userId);
    if (deliveryPackageExists.length > 0) {
      const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(userId);
      try {
        notificationModel.pushNotification(
          fcmToken,
          'Ahln',
          i18n.__('PICK_UP_THE_DELIVERY_PACKAGE'),
        );
      } catch (error: any) {
        const source = 'sendNotificationIfNearby';
        systemLog.createSystemLog(
          userId,
          i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
          source,
        );
      }
    }
  } else {
    console.log('Not Nearby');
    return;
  }
};
