import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createAddressValidation = [
  body('country').notEmpty().withMessage(i18n.__('COUNTRY_REQUIRED')),
  body('city').notEmpty().withMessage(i18n.__('CITY_REQUIRED')),
  body('district').notEmpty().withMessage(i18n.__('DISTRICT_REQUIRED')),
  body('street').notEmpty().withMessage(i18n.__('STREET_REQUIRED')),
  body('building_type')
    .notEmpty()
    .withMessage(i18n.__('BUILDING_TYPE_REQUIRED')),
  body('building_number')
    .notEmpty()
    .withMessage(i18n.__('BUILDING_NUMBER_REQUIRED')),
  validatorMiddleware,
];

export const getAddressByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
  validatorMiddleware,
];

export const updateAddressValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
  body('country')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('COUNTRY_REQUIRED')),
  body('city').optional().notEmpty().withMessage(i18n.__('CITY_REQUIRED')),
  body('district')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DISTRICT_REQUIRED')),
  body('street').optional().notEmpty().withMessage(i18n.__('STREET_REQUIRED')),
  body('building_type')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BUILDING_TYPE_REQUIRED')),
  body('building_number')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('BUILDING_NUMBER_REQUIRED')),
  validatorMiddleware,
];

export const deleteAddressValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ADDRESS_ID')),
  validatorMiddleware,
];
