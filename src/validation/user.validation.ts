import { body, check } from 'express-validator';
import validatorMiddleware from '../middlewares/validatorMiddleware';
import UserModel from '../models/user.model';

const userModel = new UserModel();

export const getUserValidator = [
  check('id').isUUID().withMessage('Invalid User id format'),
  validatorMiddleware,
];

export const createUserValidator = [
  body('email')
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Invalid email format')
    .custom(async (email) => {
      const emailExists = await userModel.emailExists(email);
      if (emailExists) {
        throw new Error('Email already in use');
      }
    }),
  body('username').notEmpty().withMessage('Username is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .notEmpty()
    .withMessage('Phone number is required')
    .isMobilePhone(['ar-AE', 'ar-SA'])
    .withMessage('Invalid phone number format'),
  body('role')
    .optional()
    .isIn(['admin', 'customer', 'super admin', 'delivery'])
    .withMessage('Invalid role'),
  validatorMiddleware,
];

export const updateUserValidator = [
  check('id').isUUID().withMessage('Invalid User id format'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('username')
    .optional()
    .notEmpty()
    .withMessage('Username cannot be empty'),
  body('password')
    .optional()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phone')
    .optional()
    .isMobilePhone('any')
    .withMessage('Invalid phone number format'),
  body('role')
    .optional()
    .isIn(['admin', 'customer', 'super admin', 'delivery'])
    .withMessage('Invalid role'),
  validatorMiddleware,
];

export const deleteUserValidator = [
  check('id').isUUID().withMessage('Invalid User id format'),
  validatorMiddleware,
];
