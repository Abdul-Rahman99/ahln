import { param, body, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createSystemLogByIdValidation = [
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('error').notEmpty().withMessage(i18n.__('ERROR_REQUIRED')),
  validatorMiddleware,
];

export const getSystemLogByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_SYSTEM_LOG_ID')),
  validatorMiddleware,
];

export const deleteSystemLogByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_SYSTEM_LOG_ID')),
  validatorMiddleware,
];

export const updateSystemLogByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_SYSTEM_LOG_ID')),
  header('authorization')
    .notEmpty()
    .withMessage(i18n.__('AUTH_HEADER_REQUIRED'))
    .custom((value, { req }) => {
      if (!value.startsWith('Bearer ')) {
        throw new Error(i18n.__('AUTH_HEADER_INVALID'));
      }
      const token = value.split(' ')[1];
      // Perform further validation on the token if necessary
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (req as any).token = token;
      return true;
    }),
  body('error').optional().notEmpty().withMessage(i18n.__('ERROR_REQUIRED')),
  validatorMiddleware,
];
