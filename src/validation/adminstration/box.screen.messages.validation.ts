import { body, param, header } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createBoxScreenMessageValidation = [
  body('box_id').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
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
  body('title').notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('message').notEmpty().withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const getAllBoxScreenMessagesValidation = [
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
  validatorMiddleware,
];
export const getBoxScreenMessageByIdValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
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
  validatorMiddleware,
];

export const updateBoxScreenMessageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
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
  body('box_id').notEmpty().withMessage(i18n.__('BOX_ID_REQUIRED')),
  body('title').optional().notEmpty().withMessage(i18n.__('TITLE_REQUIRED')),
  body('message')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('MESSAGE_REQUIRED')),
  validatorMiddleware,
];

export const deleteBoxScreenMessageValidation = [
  param('id').isInt().withMessage(i18n.__('INVALID_BOX_SCREEN_MESSAGE_ID')),
  validatorMiddleware,
];
