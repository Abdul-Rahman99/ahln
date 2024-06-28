import { check } from 'express-validator';

export const createBoxValidator = [
  check('id').notEmpty().withMessage('ID is required'),
  check('serial_number').notEmpty().withMessage('Serial number is required'),
  check('box_label').notEmpty().withMessage('Box label is required'),
  check('has_empty_lockers')
    .isBoolean()
    .withMessage('Has empty lockers must be a boolean'),
  check('current_tablet_id')
    .optional()
    .isInt()
    .withMessage('Current tablet ID must be an integer'),
  check('previous_tablet_id')
    .optional()
    .isInt()
    .withMessage('Previous tablet ID must be an integer'),
  check('box_model_id')
    .optional()
    .notEmpty()
    .withMessage('Box model ID cannot be empty'),
  check('address_id')
    .optional()
    .isInt()
    .withMessage('Address ID must be an integer'),
];

export const getBoxValidator = [
  check('id').notEmpty().withMessage('Box ID is required'),
];

export const updateBoxValidator = [
  check('id').optional().notEmpty().withMessage('ID cannot be empty'),
  check('serial_number')
    .optional()
    .notEmpty()
    .withMessage('Serial number cannot be empty'),
  check('box_label')
    .optional()
    .notEmpty()
    .withMessage('Box label cannot be empty'),
  check('has_empty_lockers')
    .optional()
    .isBoolean()
    .withMessage('Has empty lockers must be a boolean'),
  check('current_tablet_id')
    .optional()
    .isInt()
    .withMessage('Current tablet ID must be an integer'),
  check('previous_tablet_id')
    .optional()
    .isInt()
    .withMessage('Previous tablet ID must be an integer'),
  check('box_model_id')
    .optional()
    .notEmpty()
    .withMessage('Box model ID cannot be empty'),
  check('address_id')
    .optional()
    .isInt()
    .withMessage('Address ID must be an integer'),
];

export const deleteBoxValidator = [
  check('id').notEmpty().withMessage('Box ID is required'),
];
