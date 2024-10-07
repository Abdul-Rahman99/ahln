import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import {
  deleteNotificationById,
  getAllNotifications,
  getAllNotificationsByUser,
  getNotificationById,
  getUnreadNotifications,
  updateNotification,
  markAllUserNotificationsAsRead,
} from '../../controllers/logs/notification.controller';
import {
  getNotificationByIdValidation,
  deleteNotificationByIdValidation,
  updateNotificationStatusByIdValidation,
  getUnreadNotificationsValidation,
  markUnreadNotificationsValidation,
} from '../../validation/logs/notification.validation';
const router = express.Router();

router.get('/get-all', verifyToken, getAllNotifications);
router.get('/get-all-by-user', verifyToken, getAllNotificationsByUser);
router.get(
  '/get-one/:id',
  verifyToken,
  getNotificationByIdValidation,
  getNotificationById,
);
router.delete(
  '/delete/:id',
  verifyToken,
  deleteNotificationByIdValidation,
  deleteNotificationById,
);

router.put(
  '/update-notification-status/:id',
  verifyToken,
  updateNotificationStatusByIdValidation,
  updateNotification,
);

router.get(
  '/get-unread-notifications',
  verifyToken,
  getUnreadNotificationsValidation,
  getUnreadNotifications,
);

router.put(
  '/mark-unread-notifications',
  verifyToken,
  markUnreadNotificationsValidation,
  markAllUserNotificationsAsRead,
);

export default router;
