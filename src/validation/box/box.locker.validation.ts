import { body, param } from 'express-validator';
import i18n from '../../config/i18n';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createBoxLockerValidation = [
  body('locker_label').notEmpty().withMessage(i18n.__('LOCKER_LABEL_REQUIRED')),
  body('serial_port').isString().withMessage(i18n.__('SERIAL_PORT_INVALID')),
  body('is_empty').isBoolean().withMessage(i18n.__('IS_EMPTY_BOOLEAN')),
  body('box_id').isString().withMessage(i18n.__('BOX_ID_INVALID')),
  validatorMiddleware,
];

export const updateBoxLockerValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_LOCKER_ID')),
  body('locker_label')
    .optional()
    .notEmpty()
    .withMessage(i18n.__('LOCKER_LABEL_REQUIRED')),
  body('serial_port')
    .optional()
    .isString()
    .withMessage(i18n.__('SERIAL_PORT_INVALID')),
  body('is_empty')
    .optional()
    .isBoolean()
    .withMessage(i18n.__('IS_EMPTY_BOOLEAN')),
  body('box_id').optional().isString().withMessage(i18n.__('BOX_ID_INVALID')),
  validatorMiddleware,
];

export const getBoxLockerByIdValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_LOCKER_ID')),
  validatorMiddleware,
];

export const deleteBoxLockerValidation = [
  param('id').isString().withMessage(i18n.__('INVALID_LOCKER_ID')),
  validatorMiddleware,
];
