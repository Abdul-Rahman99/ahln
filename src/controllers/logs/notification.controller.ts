import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import { Notification } from '../../types/notification.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import NotificationModel from '../../models/logs/notification.model';

const notificationModel = new NotificationModel();

export const createNotification = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newNotiication: Notification = req.body;
      const createdNotification =
        await notificationModel.createNotification(newNotiication);
      ResponseHandler.success(
        res,
        i18n.__('NOTIFICATION_CREATED_SUCCESSFULLY'),
        createdNotification,
      );
    } catch (error) {
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
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
