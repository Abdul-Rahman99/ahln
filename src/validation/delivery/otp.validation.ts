import { body, param, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createOTPValidation = [
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
  body('box_id').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('box_locker_id')
    .notEmpty()
    .withMessage(i18n.__('BOX_LOCKER_ID_REQUIRED')),
  body('delivery_package_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DELIVERY_PACKAGE_ID_REQUIRED')),
  validatorMiddleware,
];

export const checkOTPValidation = [
  body('otp').notEmpty().withMessage(i18n.__('OTP_REQUIRED')),
  body('delivery_package_id')
    .optional()
    .isEmpty()
    .withMessage(i18n.__('DELIVERY_PACKAGE_ID_REQUIRED')),
  validatorMiddleware,
];

export const getOTPByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_OTP_ID')),
  validatorMiddleware,
];

export const deleteOTPValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_OTP_ID')),
  validatorMiddleware,
];

export const getOTPsByUserValidation = [
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
  validatorMiddleware,
];

export const checkTrackingNumberValidation = [
  body('trackingNumber')
    .notEmpty()
    .withMessage(i18n.__('TRACKING_NUMBER_REQUIRED')),
  validatorMiddleware,
];

export const updateOTPValidation = [
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
  param('id').isInt().withMessage(i18n.__('INVALID_OTP_ID')),
  body('box_id').optional().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('box_locker_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BOX_LOCKER_ID_REQUIRED')),
  body('box_locker_string')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BOX_LOCKER_STRING_REQUIRED')),
  body('delivery_package_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DELIVERY_PACKAGE_ID_REQUIRED')),
  body('is_used')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('INVALID_IS_USED')),
  validatorMiddleware,
];
