import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import i18n from '../config/i18n';

export const getRoleValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const createRoleValidator = [
  body('title')
    .notEmpty()
    .withMessage(i18n.__('ROLE_TITLE_REQUIRED'))
    .isLength({ max: 50 })
    .withMessage(i18n.__('ROLE_TITLE_TOO_LONG')),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage(i18n.__('ROLE_DESCRIPTION_TOO_LONG')),
  validatorMiddleware,
];

export const updateRoleValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  body('title')
    .optional()
    .isLength({ max: 50 })
    .withMessage(i18n.__('ROLE_TITLE_TOO_LONG')),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage(i18n.__('ROLE_DESCRIPTION_TOO_LONG')),
  validatorMiddleware,
];

export const deleteRoleValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
