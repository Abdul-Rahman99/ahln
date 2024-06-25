import { body, check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import i18n from '../../config/i18n';

export const registerDeviceValidator = [
  body('userId')
    .notEmpty()
    .withMessage(i18n.__('USER_ID_REQUIRED'))
    .isString()
    .withMessage(i18n.__('INVALID_USER_ID')),
  body('fcmToken')
    .notEmpty()
    .withMessage(i18n.__('FCM_TOKEN_REQUIRED'))
    .isString()
    .withMessage(i18n.__('INVALID_FCM_TOKEN')),
  validatorMiddleware,
];

export const deleteDeviceValidator = [
  check('deviceId')
    .notEmpty()
    .withMessage(i18n.__('DEVICE_ID_REQUIRED'))
    .isInt()
    .withMessage(i18n.__('INVALID_DEVICE_ID')),
  validatorMiddleware,
];

export const updateDeviceValidator = [
  check('deviceId')
    .notEmpty()
    .withMessage(i18n.__('DEVICE_ID_REQUIRED'))
    .isInt()
    .withMessage(i18n.__('INVALID_DEVICE_ID')),
  body('fcmToken')
    .notEmpty()
    .withMessage(i18n.__('FCM_TOKEN_REQUIRED'))
    .isString()
    .withMessage(i18n.__('INVALID_FCM_TOKEN')),
  validatorMiddleware,
];

export const getDevicesByUserValidator = [
  check('userId')
    .notEmpty()
    .withMessage(i18n.__('USER_ID_REQUIRED'))
    .isString()
    .withMessage(i18n.__('INVALID_USER_ID')),
  validatorMiddleware,
];

export const getOneUserDeviceValidator = [
  check('deviceId')
    .notEmpty()
    .withMessage(i18n.__('DEVICE_ID_REQUIRED'))
    .isString()
    .withMessage(i18n.__('INVALID_DEVICE_ID')),
  validatorMiddleware,
];
