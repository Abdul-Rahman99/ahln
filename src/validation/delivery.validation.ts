import { RequestHandler } from 'express';
import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import i18n from '../config/i18n';

// Validator for creating a delivery
export const createDeliveryValidator: RequestHandler[] = [
  body('bar_code')
    .optional()
    .isString()
    .withMessage(i18n.__('BAR_CODE_REQUIRED')),
  body('qr_code').optional().isString().withMessage(i18n.__('QR_CODE_REQUIRED')),
  body('tracking_number')
    .isString()
    .notEmpty()
    .withMessage(i18n.__('TRACKING_NUMBER_REQUIRED')),
  body('from_id').isInt().optional().withMessage(i18n.__('FROM_ID_REQUIRED')),
  body('to_customer_id')
    .isInt()
    .optional()
    .withMessage(i18n.__('TO_CUSTOMER_ID_REQUIRED')),
  body('transporter')
    .isIn(['amazon', 'fedex', 'talabat', 'dhl', 'alibaba', 'other'])
    .notEmpty()
    .withMessage(i18n.__('TRANSPORTER_REQUIRED')),
  body('transporter_name')
    .if(body('transporter').equals('other'))
    .isString()
    .notEmpty()
    .withMessage(i18n.__('TRANSPORTER_NAME_REQUIRED')),
  body('nickname')
    .optional()
    .isString()
    .withMessage(i18n.__('NICKNAME_REQUIRED')),
  body('description')
    .optional()
    .isString()
    .withMessage(i18n.__('DESCRIPTION_REQUIRED')),
  validatorMiddleware,
];

// Validator for getting one delivery
export const getOneDeliveryValidator: RequestHandler[] = [
  param('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
export const updateDeliveryValidator = [
  param('id').isInt().withMessage(i18n.__('INVALID_ID')),
  body('date_time')
    .optional()
    .isISO8601()
    .withMessage(i18n.__('DATE_TIME_REQUIRED')),
  body('bar_code')
    .optional()
    .isString()
    .withMessage(i18n.__('BAR_CODE_REQUIRED')),
  body('qr_code')
    .optional()
    .isString()
    .withMessage(i18n.__('QR_CODE_REQUIRED')),
  body('tracking_number')
    .optional()
    .isString()
    .withMessage(i18n.__('TRACKING_NUMBER_REQUIRED')),
  body('from_id').optional().isInt().withMessage(i18n.__('FROM_ID_REQUIRED')),
  body('to_customer_id')
    .optional()
    .isInt()
    .withMessage(i18n.__('TO_CUSTOMER_ID_REQUIRED')),
  body('delivered_date')
    .optional()
    .isISO8601()
    .withMessage(i18n.__('DELIVERED_DATE_REQUIRED')),
  body('delivered_status')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('DELIVERED_STATUS_REQUIRED')),
  body('transporter')
    .optional()
    .isIn(['amazon', 'fedex', 'talabat', 'dhl', 'alibaba', 'other'])
    .withMessage(i18n.__('TRANSPORTER_REQUIRED')),
  body('transporter_name')
    .optional()
    .if(body('transporter').equals('other'))
    .isString()
    .withMessage(i18n.__('TRANSPORTER_NAME_REQUIRED')),
  body('nickname')
    .optional()
    .isString()
    .withMessage(i18n.__('NICKNAME_REQUIRED')),
  body('description')
    .optional()
    .isString()
    .withMessage(i18n.__('DESCRIPTION_REQUIRED')),
  validatorMiddleware,
];

export const deleteDeliveryValidator = [
  param('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const getDeliveryValidator = [
  param('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
