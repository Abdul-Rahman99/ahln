// addressValidation.ts

import { body, param } from 'express-validator';
import i18n from '../../config/i18n';

export const createAddressValidation = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  body('district').notEmpty().withMessage(i18n.__('DISTRICT_REQUIRED')),
  body('city').notEmpty().withMessage(i18n.__('CITY_REQUIRED')),
  body('building_number')
    .notEmpty()
    .withMessage(i18n.__('BUILDING_NUMBER_REQUIRED')),
];

export const getAllAddressesValidation = [];

export const getAddressByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
];

export const updateAddressValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
  body('email').optional().isEmail().withMessage(i18n.__('EMAIL_INVALID')),
  body('district')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DISTRICT_REQUIRED')),
  body('city').optional().notEmpty().withMessage(i18n.__('CITY_REQUIRED')),
  body('building_number')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BUILDING_NUMBER_REQUIRED')),
];

export const deleteAddressValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
];
