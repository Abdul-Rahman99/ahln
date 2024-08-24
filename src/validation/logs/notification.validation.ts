import { param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const getNotificationByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_NOTIFICATION_ID')),
  validatorMiddleware,
];
export const deleteNotificationByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_NOTIFICATION_ID')),
  validatorMiddleware,
];

export const updateNotificationStatusByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_NOTIFICATION_ID')),
  validatorMiddleware,
];
