import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createUserGuideValidation = [
  body('pdf_link').notEmpty().withMessage(i18n.__('PDF_LINK_REQUIRED')),
  body('video_link').notEmpty().withMessage(i18n.__('VIDEO_LINK_REQUIRED')),
  validatorMiddleware,
];

export const getUserGuideByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_USER_GUIDE_ID')),
  validatorMiddleware,
];

export const updateUserGuideValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_USER_GUIDE_ID')),
  body('pdf_link')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('PDF_LINK_REQUIRED')),
  body('video_link')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('VIDEO_LINK_REQUIRED')),

  validatorMiddleware,
];

export const deleteUserGuideValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_USER_GUIDE_ID')),
  validatorMiddleware,
];
