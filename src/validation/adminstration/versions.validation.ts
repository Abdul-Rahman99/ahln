import { body, header, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createVersionsValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('IOS').notEmpty().withMessage(i18n.__('IOS_VERSION_REQUIRED')),
  body('Android').notEmpty().withMessage(i18n.__('ANDROID_VERSION_REQUIRED')),
  validatorMiddleware,
];

export const getVersionsByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_VERSION_ID')),
  validatorMiddleware,
];

export const updateVersionsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_VIRSION_ID')),
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('IOS')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('IOS_VERSION_REQUIRED')),
  body('Android')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('ANDROID_VERSION_REQUIRED')),
  validatorMiddleware,
];

export const deleteVersionsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_VERSION_ID')),
  validatorMiddleware,
];
