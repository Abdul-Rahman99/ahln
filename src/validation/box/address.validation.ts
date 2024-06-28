import { check } from 'express-validator';

export const createAddressValidator = [
  check('country').notEmpty().withMessage('Country is required'),
  check('city').notEmpty().withMessage('City is required'),
  check('district').notEmpty().withMessage('District is required'),
  check('street').notEmpty().withMessage('Street is required'),
  check('building_type').notEmpty().withMessage('Building type is required'),
  check('building_number').isInt({ gt: 0 }).withMessage('Building number must be a positive integer'),
  // Optional fields
  check('floor').optional().isInt().withMessage('Floor must be an integer'),
  check('apartment_number').optional().isInt().withMessage('Apartment number must be an integer'),
];

export const getAddressValidator = [
  check('id').isInt({ gt: 0 }).withMessage('Address ID must be a positive integer'),
];

export const updateAddressValidator = [
  check('country').optional().notEmpty().withMessage('Country cannot be empty'),
  check('city').optional().notEmpty().withMessage('City cannot be empty'),
  check('district').optional().notEmpty().withMessage('District cannot be empty'),
  check('street').optional().notEmpty().withMessage('Street cannot be empty'),
  check('building_type').optional().notEmpty().withMessage('Building type cannot be empty'),
  check('building_number').optional().isInt({ gt: 0 }).withMessage('Building number must be a positive integer'),
  // Optional fields
  check('floor').optional().isInt().withMessage('Floor must be an integer'),
  check('apartment_number').optional().isInt().withMessage('Apartment number must be an integer'),
];

export const deleteAddressValidator = [
  check('id').isInt({ gt: 0 }).withMessage('Address ID must be a positive integer'),
];
