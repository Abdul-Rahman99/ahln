import { body, param, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createDeliveryPackageValidation = [
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
  body('shipping_company_id')
    .notEmpty()
    .withMessage(i18n.__('SHIPPING_COMPANY_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateDeliveryPackageValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_DELIVERY_PACKAGE_ID')),
  body('vendor_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('VENDOR_ID_REQUIRED')),
  body('delivery_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DELIVERY_ID_REQUIRED')),
  body('tracking_number')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('TRACKING_NUMBER_REQUIRED')),
  body('box_id').optional().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('shipping_company_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('SHIPPING_COMPANY_ID_REQUIRED')),
  validatorMiddleware,
];

export const getDeliveryPackageByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_DELIVERY_PACKAGE_ID')),
  validatorMiddleware,
];

export const deleteDeliveryPackageValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_DELIVERY_PACKAGE_ID')),
  validatorMiddleware,
];

export const getUserDeliveryPackagesValidation = [
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
