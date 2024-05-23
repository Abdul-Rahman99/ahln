import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import VendorModel from '../models/vendor.model';
import i18n from '../config/i18n';

const vendorModel = new VendorModel();

export const getUserValidator = [
  check('id').isInt({ min: 1 }).withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const createVendorValidator = [
  body('username').notEmpty().withMessage(i18n.__('USERNAME_REQUIRED')),
  body('address').notEmpty().withMessage(i18n.__('ADDRESS_REQUIRED')),
  body('url').isURL().withMessage(i18n.__('INVALID_URL')),
  body('api_ref').isURL().withMessage(i18n.__('INVALID_URL')),
  body('phone')
    .isMobilePhone(['en-US', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_NUMBER')),
  validatorMiddleware,
];

export const updateVendorValidator = [
  check('id').isInt({ min: 1 }).withMessage(i18n.__('INVALID_ID')),
  body('username')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('USERNAME_REQUIRED')),
  body('address')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('ADDRESS_REQUIRED')),
  body('url').optional().isURL().withMessage(i18n.__('INVALID_URL')),
  body('api_ref')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('API_REF_REQUIRED')),
  body('phone')
    .optional()
    .isMobilePhone(['en-US', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_NUMBER')),
  validatorMiddleware,
];

export const deleteVendorValidator = [
  check('id').isInt({ min: 1 }).withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
