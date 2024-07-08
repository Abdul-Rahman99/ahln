import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createMobilePageValidation = [
  body('title').notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('content_ar').notEmpty().withMessage(i18n.__('CONTENT_AR_REQUIRED')),
  body('content_en').notEmpty().withMessage(i18n.__('CONTENT_EN_REQUIRED')),
  validatorMiddleware,
];

export const getMobilePageByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAGE_ID')),
  validatorMiddleware,
];

export const updateMobilePageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAGE_ID')),
  body('title').optional().notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('content_ar')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('CONTENT_AR_REQUIRED')),
  body('content_en')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('CONTENT_EN_REQUIRED')),
  validatorMiddleware,
];

export const deleteMobilePageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAGE_ID')),
  validatorMiddleware,
];
