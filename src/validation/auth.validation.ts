/* eslint-disable @typescript-eslint/no-explicit-any */
import { body, header } from 'express-validator';
import UserModel from '../models/users/user.model';
import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import i18n from '../config/i18n';
import ResponseHandler from '../utils/responsesHandler';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import multer from 'multer';

const storage = multer.memoryStorage(); // Using memory storage for form data
const upload = multer({ storage });

const userModel = new UserModel();

export const registerValidator = [
  upload.none(),
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
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
    .withMessage(i18n.__('INVALID_PHONE_FORMAT')),
  validatorMiddleware,
];

const validateLoginCredentials = async (email: string, password: string) => {
  const user = await userModel.findByEmail(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
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
      return ResponseHandler.badRequest(
        res,
        i18n.__('INVALID_CREDENTIALS'),
        null,
      );
    }
  },
  validatorMiddleware,
];

export const logoutValidator = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      (req as any).token = token;
      return true;
    }),
  validatorMiddleware,
];

export const verifyEmailValidator = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      (req as any).token = token;
      return true;
    }),
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  body('otp')
    .notEmpty()
    .withMessage(i18n.__('OTP_REQUIRED'))
    .isLength({ min: 6, max: 6 })
    .withMessage(i18n.__('OTP_INVALID')),
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
      const user = await userModel.findByEmail(email);
      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'), null);
      }
      next();
    } catch (error: any) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('VALIDATION_ERROR'),
        error.array(),
      );
    }
  },
  validatorMiddleware,
];

export const resendOtpAndUpdateDBValidator = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  validatorMiddleware,
];

export const updatePasswordWithOTPValidator = [
  body('email')
    .notEmpty()
    .withMessage(i18n.__('EMAIL_REQUIRED'))
    .isEmail()
    .withMessage(i18n.__('EMAIL_INVALID')),
  body('otp')
    .notEmpty()
    .withMessage(i18n.__('OTP_REQUIRED'))
    .isLength({ min: 6, max: 6 })
    .withMessage(i18n.__('OTP_INVALID')),
  body('newPassword').notEmpty().withMessage(i18n.__('PASSWORD_REQUIRED')),
  validatorMiddleware,
];

export const updatePasswordValidation = [
  body('password').isString().withMessage(i18n.__('CURRENT_PASSWORD_REQUIRED')),
  body('newPassword')
    .isString()
    .isLength({ min: 6 })
    .withMessage(i18n.__('NEW_PASSWORD_REQUIRED')),
  validatorMiddleware,
];
