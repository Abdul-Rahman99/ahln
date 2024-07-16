import { body, param, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createPinValidation = [
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
  body('title').notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('time_range').notEmpty().withMessage(i18n.__('TIME_RANGE_REQUIRED')),
  body('day_range').notEmpty().withMessage(i18n.__('DAY_RANGE_REQUIRED')),
  body('box_id').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('type').notEmpty().withMessage(i18n.__('TYPE_REQUIRED')),
  body('passcode').notEmpty().withMessage(i18n.__('PASSCODE_REQUIRED')),
  validatorMiddleware,
];

export const getUserPinsByUserIdValidation = [
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

export const getUserPinByUserIdValidation = [
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
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];

export const updatePinByValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_ID')),
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
  body('reciepent_email')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('RECIEPENT_EMAIL_REQUIRED')),
  body('title').optional().notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('time_range')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('TIME_RANGE_REQUIRED')),
  body('day_range')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('DAY_RANGE_REQUIRED')),
  body('box_id').optional().notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('type').optional().notEmpty().withMessage(i18n.__('TYPE_REQUIRED')),
  body('passcode')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('PASSCODE_REQUIRED')),
  validatorMiddleware,
];

export const deleteUserPinByUserIdValidation = [
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
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_ID')),
  validatorMiddleware,
];
