import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import i18n from '../config/i18n'; 

export const createBoxValidator = [
  body('compartments_number')
    .isInt({ min: 1 })
    .withMessage(i18n.__('COMPARTMENTS_NUMBER_REQUIRED')),
  body('compartments_status')
    .isObject()
    .withMessage(i18n.__('COMPARTMENTS_STATUS_REQUIRED')),
  body('video_id').isInt({ min: 1 }).withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateBoxValidator = [
  param('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  body('compartments_number')
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18n.__('COMPARTMENTS_NUMBER_REQUIRED')),
  body('compartments_status')
    .optional()
    .isObject()
    .withMessage(i18n.__('COMPARTMENTS_STATUS_REQUIRED')),
  body('video_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];
