import { body, param } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import i18n from '../../config/i18n'; // Import i18n for localization

export const createBoxValidator = [
  body('compartments_number')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage(i18n.__('COMPARTMENTS_NUMBER_INVALID')),
  body('compartment1')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT1_STATUS_INVALID')),
  body('compartment2')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT2_STATUS_INVALID')),
  body('compartment3')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT3_STATUS_INVALID')),
  body('video_id').isInt({ min: 1 }).withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateBoxValidator = [
  param('id')
    .isInt({ min: 1000000, max: 9999999 })
    .withMessage(i18n.__('INVALID_ID')),
  body('compartments_number')
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage(i18n.__('COMPARTMENTS_NUMBER_INVALID')),
  body('compartment1')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT1_STATUS_INVALID')),
  body('compartment2')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT2_STATUS_INVALID')),
  body('compartment3')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('COMPARTMENT3_STATUS_INVALID')),
  body('video_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];

export const getBoxValidator = [
  param('id')
    .isInt({ min: 1000000, max: 9999999 })
    .withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const deleteBoxValidator = [
  param('id')
    .isInt({ min: 1000000, max: 9999999 })
    .withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
