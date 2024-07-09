import express from 'express';
import verifyToken from '../../middlewares/verifyToken';
import {
  deleteNotificationById,
  getAllNotifications,
  getNotificationById,
} from '../../controllers/logs/notification.controller';
import {
  getNotificationByIdValidation,
  deleteNotificationByIdValidation,
} from '../../validation/logs/notification.validation';
const router = express.Router();

router.get('/get-all', verifyToken, getAllNotifications);
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

export default router;
