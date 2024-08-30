import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createAboutUsValidation = [
  body('title').notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('description').notEmpty().withMessage(i18n.__('DESCRIPTION_REQUIRED')),
  body('email').notEmpty().withMessage(i18n.__('EMAIL_REQUIRED')),
  body('phone')
    .notEmpty()
    .withMessage(i18n.__('PHONE_REQUIRED'))
    .isMobilePhone(['ar-AE'])
    .withMessage(i18n.__('INVALID_PHONE_FORMAT')),
  validatorMiddleware,
];

export const getAboutUsByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAGE_ID')),
  validatorMiddleware,
];

export const updateAboutUsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_ABOUT_US_ID')),
  body('title').optional().notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('description')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DESCRIPTION_REQUIRED')),
  body('email').optional().notEmpty().withMessage(i18n.__('EMAIL_REQUIRED')),
  body('phone').optional().notEmpty().withMessage(i18n.__('PHONE_REQUIRED')),
  validatorMiddleware,
];

export const deleteAboutUsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_PAGE_ID')),
  validatorMiddleware,
];
