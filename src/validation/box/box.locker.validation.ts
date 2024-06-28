import { body, param } from 'express-validator';

export const createBoxLockerValidator = [
  body('locker_label').isString().withMessage('Locker label is required'),
  body('serial_port').isString().withMessage('Serial port is required'),
  body('is_empty').isBoolean().withMessage('is_empty must be a boolean'),
  body('box_id').isString().withMessage('Box ID is required'),
];

export const getBoxLockerValidator = [
  param('id').isInt().withMessage('ID must be an integer'),
];

export const updateBoxLockerValidator = [
  param('id').isInt().withMessage('ID must be an integer'),
  body('locker_label')
    .optional()
    .isString()
    .withMessage('Locker label must be a string'),
  body('serial_port')
    .optional()
    .isString()
    .withMessage('Serial port must be a string'),
  body('is_empty')
    .optional()
    .isBoolean()
    .withMessage('is_empty must be a boolean'),
  body('box_id').optional().isString().withMessage('Box ID must be a string'),
];

export const deleteBoxLockerValidator = [
  param('id').isInt().withMessage('ID must be an integer'),
];
