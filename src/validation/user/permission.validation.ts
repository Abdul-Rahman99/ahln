import { body, check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import i18n from '../../config/i18n';

export const getPermissionValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const createPermissionValidator = [
  body('title')
    .notEmpty()
    .withMessage(i18n.__('PERMISSION_TITLE_REQUIRED'))
    .isLength({ max: 50 })
    .withMessage(i18n.__('PERMISSION_TITLE_TOO_LONG')),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage(i18n.__('PERMISSION_DESCRIPTION_TOO_LONG')),
  validatorMiddleware,
];

export const updatePermissionValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  body('title')
    .optional()
    .isLength({ max: 50 })
    .withMessage(i18n.__('PERMISSION_TITLE_TOO_LONG')),
  body('description')
    .optional()
    .isLength({ max: 255 })
    .withMessage(i18n.__('PERMISSION_DESCRIPTION_TOO_LONG')),
  validatorMiddleware,
];

export const deletePermissionValidator = [
  check('id').isInt().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
