import { body, check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';
import UserModel from '../../models/users/user.model';
import i18n from '../../config/i18n';

const userModel = new UserModel();

export const getUserValidator = [
  check('id').isString().withMessage(i18n.__('INVALID_ID')),
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
  body('user_name').notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  // body('password')
  //   .notEmpty()
  //   .withMessage(i18n.__('PASSWORD_REQUIRED'))
  //   .isLength({ min: 6 })
  //   .withMessage(i18n.__('PASSWORD_MIN_LENGTH')),
  body('phone_number')
    .notEmpty()
    .withMessage(i18n.__('PHONE_REQUIRED'))
    .isMobilePhone(['ar-AE', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_FORMAT'))
    .custom(async (phone) => {
      const phoneExists = await userModel.phoneExists(phone);
      if (phoneExists) {
        throw new Error(i18n.__('PHONE_ALREADY_REGISTERED'));
      }
    }),
  validatorMiddleware,
];

export const updateUserValidator = [
  body('email').optional().isEmail().withMessage(i18n.__('EMAIL_REQUIRED')),
  body('user_name').optional().notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage(i18n.__('PASSWORD_MIN_LENGTH')),
  body('phone_number')
    .optional()
    .isMobilePhone(['ar-AE', 'ar-SA'])
    .withMessage(i18n.__('INVALID_PHONE_FORMAT')),
  validatorMiddleware,
];

export const deleteUserValidator = [
  body('userId').isString().withMessage(i18n.__('INVALID_ID')),
  validatorMiddleware,
];
