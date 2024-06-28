"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddressValidator = exports.updateAddressValidator = exports.getAddressValidator = exports.createAddressValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createAddressValidator = [
    (0, express_validator_1.check)('country').notEmpty().withMessage('Country is required'),
    (0, express_validator_1.check)('city').notEmpty().withMessage('City is required'),
    (0, express_validator_1.check)('district').notEmpty().withMessage('District is required'),
    (0, express_validator_1.check)('street').notEmpty().withMessage('Street is required'),
    (0, express_validator_1.check)('building_type').notEmpty().withMessage('Building type is required'),
    (0, express_validator_1.check)('building_number').isInt({ gt: 0 }).withMessage('Building number must be a positive integer'),
    (0, express_validator_1.check)('floor').optional().isInt().withMessage('Floor must be an integer'),
    (0, express_validator_1.check)('apartment_number').optional().isInt().withMessage('Apartment number must be an integer'),
];
exports.getAddressValidator = [
    (0, express_validator_1.check)('id').isInt({ gt: 0 }).withMessage('Address ID must be a positive integer'),
];
exports.updateAddressValidator = [
    (0, express_validator_1.check)('country').optional().notEmpty().withMessage('Country cannot be empty'),
    (0, express_validator_1.check)('city').optional().notEmpty().withMessage('City cannot be empty'),
    (0, express_validator_1.check)('district').optional().notEmpty().withMessage('District cannot be empty'),
    (0, express_validator_1.check)('street').optional().notEmpty().withMessage('Street cannot be empty'),
    (0, express_validator_1.check)('building_type').optional().notEmpty().withMessage('Building type cannot be empty'),
    (0, express_validator_1.check)('building_number').optional().isInt({ gt: 0 }).withMessage('Building number must be a positive integer'),
    (0, express_validator_1.check)('floor').optional().isInt().withMessage('Floor must be an integer'),
    (0, express_validator_1.check)('apartment_number').optional().isInt().withMessage('Apartment number must be an integer'),
];
exports.deleteAddressValidator = [
    (0, express_validator_1.check)('id').isInt({ gt: 0 }).withMessage('Address ID must be a positive integer'),
];
//# sourceMappingURL=address.validation.js.map