import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import UserModel from '../models/user.model';
import i18n from '../config/i18n';

const userModel = new UserModel();

export const getUserValidator = [
  check('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];

export const createUserValidator = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID'))
    .custom(async (email) => {
      const emailExists = await userModel.emailExists(email);
      if (emailExists) {
        throw new Error(i18n.__('EMAIL_IN_USE'));
      }
    }),
  body('username').notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  body('password')
    .notEmpty()
    .withMessage(i18n.__('PASSWORD_REQUIRED'))
    .isLength({ min: 6 })
    .withMessage(i18n.__('PASSWORD_MIN_LENGTH')),
  body('phone')
    .notEmpty()
    .withMessage(i18n.__('PHONE_REQUIRED'))
    .isMobilePhone(['ar-AE', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_FORMAT')),
  body('role')
    .optional()
    .isIn(['admin', 'customer', 'super admin', 'delivery', 'operations'])
    .withMessage(i18n.__('INVALID_ROLE')),
  validatorMiddleware,
];

export const updateUserValidator = [
  check('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  body('email').optional().isEmail().withMessage(i18n.__('EMAIL_REQUIRED')),
  body('username').optional().notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage(i18n.__('PASSWORD_MIN_LENGTH')),
  body('phone')
    .optional()
    .isMobilePhone(['ar-AE', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_FORMAT')),
  body('role')
    .optional()
    .isIn(['admin', 'customer', 'super admin', 'delivery'])
    .withMessage('Invalid role'),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check('id').isUUID().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
