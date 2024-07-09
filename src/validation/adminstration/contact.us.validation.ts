import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createContactUsValidation = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  body('message').notEmpty().withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const getContactUsByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CONTACT_US_ID')),
  validatorMiddleware,
];

export const updateContactUsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CONTACT_US_ID')),
  body('email').optional().notEmpty().withMessage(i18n.__('EMAIL_REQUIRED')),
  body('message')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const deleteContactUsValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_CONTACT_US_ID')),
  validatorMiddleware,
];
