import { check } from 'express-validator';
import validatorMiddleware from '../../middlewares/validatorMiddleware';

export const createShippingCompanyValidation = [
  check('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),
  check('logo')
    .notEmpty()
    .withMessage('Logo is required')
    .isString()
    .withMessage('Logo must be a string'),
  validatorMiddleware,
];

export const getShippingCompanyIdValidation = [
  check('id')
    .notEmpty()
    .withMessage('ID is required')
    .isInt()
    .withMessage('ID must be an integer'),
  validatorMiddleware,
];

export const updateShippingCompanyValidation = [
  check('trackingSystem')
    .optional()
    .isString()
    .withMessage('Tracking system must be a string'),
  check('title').optional().isString().withMessage('Title must be a string'),
  check('logo').optional().isString().withMessage('Logo must be a string'),
  validatorMiddleware,
];

export const deleteShippingCompanyIdValidation = [
  check('id')
    .notEmpty()
    .withMessage('ID is required')
    .isInt()
    .withMessage('ID must be an integer'),
  validatorMiddleware,
];
