import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import NotificationModel from '../../models/logs/notification.model';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const notificationModel = new NotificationModel();

export const createNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      const user = await authHandler(req, res, next);
      const source = 'createNotification';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllNotifications = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const notifications = await notificationModel.getAllNotifications();
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATIONS_RETRIEVED_SUCCESSFULLY'),
        notifications,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllNotifications';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllNotificationsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await authHandler(req, res, next);

      const notifications =
        await notificationModel.getAllNotificationsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATIONS_RETRIEVED_SUCCESSFULLY'),
        notifications,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllNotificationsByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getNotificationById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      const user = await authHandler(req, res, next);
      const source = 'getNotificationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteNotificationById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      const user = await authHandler(req, res, next);
      const source = 'deleteNotificationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
