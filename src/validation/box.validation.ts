import { body, param } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import i18n from '../config/i18n'; // Import i18n for localization

const validateCompartmentsStatus = (value: any) => {
  const keys = Object.keys(value);
  const validKeys = ['1', '2', '3'];
  return keys.every(
    (key) => validKeys.includes(key) && typeof value[key] === 'boolean',
  );
};

export const createBoxValidator = [
  body('compartments_status')
    .custom(validateCompartmentsStatus)
    .withMessage(i18n.__('COMPARTMENTS_STATUS_INVALID')),
  body('video_id').isInt({ min: 1 }).withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];

export const updateBoxValidator = [
  param('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  body('compartments_status')
    .optional()
    .custom(validateCompartmentsStatus)
    .withMessage(i18n.__('COMPARTMENTS_STATUS_INVALID')),
  body('video_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage(i18n.__('VIDEO_ID_REQUIRED')),
  validatorMiddleware,
];

export const getBoxValidator = [
  param('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const deleteBoxValidator = [
  param('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
