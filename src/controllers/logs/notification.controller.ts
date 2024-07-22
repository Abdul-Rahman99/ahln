import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import NotificationModel from '../../models/logs/notification.model';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const notificationModel = new NotificationModel();

export const createNotification = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { title, message, image, user } = req.body;
      const createdNotification = await notificationModel.createNotification(
        title,
        message,
        image,
        user,
      );
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATION_CREATED_SUCCESSFULLY'),
        createdNotification,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'createNotification';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllNotifications = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const notifications = await notificationModel.getAllNotifications();
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATIONS_RETRIEVED_SUCCESSFULLY'),
        notifications,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getAllNotifications';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllNotificationsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const user = await authHandler(req, res);

      const notifications =
        await notificationModel.getAllNotificationsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATIONS_RETRIEVED_SUCCESSFULLY'),
        notifications,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getAllNotificationsByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getNotificationById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id, 10);
      const notification =
        await notificationModel.getNotificationById(notificationId);
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATION_RETRIEVED_SUCCESSFULLY'),
        notification,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getNotificationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteNotificationById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const notificationId = parseInt(req.params.id, 10);
      const notification =
        await notificationModel.deleteNotification(notificationId);
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATION_DELETED_SUCCESSFULLY'),
        notification,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'deleteNotificationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

// export const pushNotification = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const user = req.body;
//       const { title, body } = req.body;
//       const fcmTokens = await userDevicesModel.getFcmTokenDevicesByUser(user);
//       if (!fcmTokens) {
//         const source = 'pushNotification';
//         systemLog.createSystemLog(
//           user,
//           i18n.__('NO_USER_DEVICES_FOUND'),
//           source,
//         );
//         ResponseHandler.badRequest(res, i18n.__('NO_USER_DEVICES_FOUND'));
//       }

//       await notificationModel.pushNotification(fcmTokens, title, body);
//     } catch (error) {
//       const user = await authHandler(req, res);
//       const source = 'pushNotification';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       ResponseHandler.badRequest(res, (error as Error).message);
//       // next(error);
//     }
//   },
// );
