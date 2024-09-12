import { body, header, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createCountryValidation = [
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
  body('name').notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  body('code').notEmpty().withMessage(i18n.__('CODE_REQUIRED')),
  validatorMiddleware,
];

export const getCountryByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_COUNTRY_ID')),
  validatorMiddleware,
];

export const updateCountryValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_COUNTRY_ID')),
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
  body('name').optional().notEmpty().withMessage(i18n.__('NAME_REQUIRED')),
  body('code').optional().notEmpty().withMessage(i18n.__('CODE_REQUIRED')),
  validatorMiddleware,
];

export const deleteCountryValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_COUNTRY_ID')),
  validatorMiddleware,
];
