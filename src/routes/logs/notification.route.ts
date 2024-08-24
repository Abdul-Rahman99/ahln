import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import {
  deleteNotificationById,
  getAllNotifications,
  getAllNotificationsByUser,
  getNotificationById,
  updateNotification,
} from '../../controllers/logs/notification.controller';
import {
  getNotificationByIdValidation,
  deleteNotificationByIdValidation,
  updateNotificationStatusByIdValidation,
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

export default router;
