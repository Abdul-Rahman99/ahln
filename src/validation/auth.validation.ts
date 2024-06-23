/* eslint-disable @typescript-eslint/no-explicit-any */
import { body } from 'express-validator';
import UserModel from '../models/users/user.model';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import config from '../../config';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import i18n from '../config/i18n'; // Import i18n for localization

const userModel = new UserModel();

export const registerValidator = [
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
  body('password')
    .notEmpty()
    .withMessage(i18n.__('PASSWORD_REQUIRED'))
    .isLength({ min: 6 })
    .withMessage(i18n.__('PASSWORD_MIN_LENGTH')),
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

const validateLoginCredentials = async (email: string, password: string) => {
  const user = await userModel.findByEmail(email);
  if (
    !user ||
    !bcrypt.hashSync(password + config.JWT_SECRET_KEY, user.password)
  ) {
    throw new Error(i18n.__('INVALID_CREDENTIALS'));
  }
};

export const loginValidator = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  body('password').notEmpty().withMessage(i18n.__('PASSWORD_REQUIRED')),

  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      await validateLoginCredentials(email, password);
      next();
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  },
  validatorMiddleware,
];
