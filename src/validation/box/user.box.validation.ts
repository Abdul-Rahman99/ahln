// userBoxValidation.ts

import { body, param, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createUserBoxValidation = [
  body('userId').isString().notEmpty().withMessage(i18n.__('USER_ID_REQUIRED')),
  body('boxId').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  validatorMiddleware,
];

export const getUserBoxByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_USER_BOX_ID')),
  validatorMiddleware,
];

export const updateUserBoxValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_USER_BOX_ID')),
  body('userId').optional().notEmpty().withMessage(i18n.__('USER_ID_REQUIRED')),
  body('boxId').optional().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  validatorMiddleware,
];

export const deleteUserBoxValidation = [
  param('id').isMongoId().withMessage(i18n.__('INVALID_USER_BOX_ID')),
];

export const getUserBoxesByUserIdValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      req.token = value.split(' ')[1];
      return true;
    }),
];

export const getUserBoxesByBoxIdValidation = [
  param('boxId').isString().withMessage(i18n.__('INVALID_BOX_ID')),
];

export const assignBoxToUserValidation = [
  body('userId').notEmpty().withMessage(i18n.__('USER_ID_REQUIRED')),
  body('boxId').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
];
