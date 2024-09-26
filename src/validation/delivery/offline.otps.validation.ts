import { body, param } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createOfflineOTPsValidation = [
  body('box_id')
    .notEmpty()
    .withMessage('Box ID is required')
    .isString()
    .withMessage('Box ID must be a string'),
  validatorMiddleware,
];

export const getOfflineOTPsByIdValidation = [
  param('box_id')
    .notEmpty()
    .withMessage('Box ID is required')
    .isString()
    .withMessage('Box ID must be a string'),
  validatorMiddleware,
];
