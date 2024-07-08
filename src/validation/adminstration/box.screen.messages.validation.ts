import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createBoxScreenMessageValidation = [
  body('box_id').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('user_id').notEmpty().withMessage(i18n.__('USER_ID_REQUIRED')),
  body('tablet_id').isInt().withMessage(i18n.__('TABLET_ID_REQUIRED')),
  body('title').notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('message').notEmpty().withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const getBoxScreenMessageByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
  validatorMiddleware,
];

export const updateBoxScreenMessageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
  body('box_id').optional().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('user_id')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('USER_ID_REQUIRED')),
  body('tablet_id')
    .optional()
    .isInt()
    .withMessage(i18n.__('TABLET_ID_REQUIRED')),
  body('title').optional().notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('message')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const deleteBoxScreenMessageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
  validatorMiddleware,
];
