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
  param('id').isString().withMessage(i18n.__('INVALID_USER_BOX_ID')),
  validatorMiddleware,
];

export const getUserBoxesByUserIdValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  validatorMiddleware,
];

export const getUserBoxesByBoxIdValidation = [
  param('boxId').isString().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const assignBoxToUserValidation = [
  body('userId').notEmpty().withMessage(i18n.__('USER_ID_REQUIRED')),
  body('boxId').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('addressId').notEmpty().withMessage(i18n.__('ADDRESS_ID_REQUIRED')),
  validatorMiddleware,
];

export const userAssignBoxToHimselfValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('serialNumber')
    .notEmpty()
    .withMessage(i18n.__('BOX_SERIAL_NUMBER_REQUIRED')),
  validatorMiddleware,
];
export const userAssignBoxToRelativeUserValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('boxId').notEmpty().withMessage(i18n.__('BOX_SERIAL_NUMBER_REQUIRED')),
  body('email').notEmpty().withMessage(i18n.__('EMAIL_REQUIRED')),
  validatorMiddleware,
];

export const updateUserBoxStatusValidation = [
  body('is_active').notEmpty().withMessage(i18n.__('IS_ACTIVE_REQUIRED')),
  body('id').notEmpty().withMessage(i18n.__('USER_BOX_ID_REQUIRED')),
  validatorMiddleware,
];

export const transferBoxOwnershipValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('boxId').notEmpty().withMessage(i18n.__('USER_BOX_ID_REQUIRED')),
  body('email').notEmpty().withMessage(i18n.__('EMAIL_REQUIRED')),
  validatorMiddleware,
];
