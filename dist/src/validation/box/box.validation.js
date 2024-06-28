"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxValidator = exports.updateBoxValidator = exports.getBoxValidator = exports.createBoxValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createBoxValidator = [
    (0, express_validator_1.check)('id').notEmpty().withMessage('ID is required'),
    (0, express_validator_1.check)('serial_number').notEmpty().withMessage('Serial number is required'),
    (0, express_validator_1.check)('box_label').notEmpty().withMessage('Box label is required'),
    (0, express_validator_1.check)('has_empty_lockers')
        .isBoolean()
        .withMessage('Has empty lockers must be a boolean'),
    (0, express_validator_1.check)('current_tablet_id')
        .optional()
        .isInt()
        .withMessage('Current tablet ID must be an integer'),
    (0, express_validator_1.check)('previous_tablet_id')
        .optional()
        .isInt()
        .withMessage('Previous tablet ID must be an integer'),
    (0, express_validator_1.check)('box_model_id')
        .optional()
        .notEmpty()
        .withMessage('Box model ID cannot be empty'),
    (0, express_validator_1.check)('address_id')
        .optional()
        .isInt()
        .withMessage('Address ID must be an integer'),
];
exports.getBoxValidator = [
    (0, express_validator_1.check)('id').notEmpty().withMessage('Box ID is required'),
];
exports.updateBoxValidator = [
    (0, express_validator_1.check)('id').optional().notEmpty().withMessage('ID cannot be empty'),
    (0, express_validator_1.check)('serial_number')
        .optional()
        .notEmpty()
        .withMessage('Serial number cannot be empty'),
    (0, express_validator_1.check)('box_label')
        .optional()
        .notEmpty()
        .withMessage('Box label cannot be empty'),
    (0, express_validator_1.check)('has_empty_lockers')
        .optional()
        .isBoolean()
        .withMessage('Has empty lockers must be a boolean'),
    (0, express_validator_1.check)('current_tablet_id')
        .optional()
        .isInt()
        .withMessage('Current tablet ID must be an integer'),
    (0, express_validator_1.check)('previous_tablet_id')
        .optional()
        .isInt()
        .withMessage('Previous tablet ID must be an integer'),
    (0, express_validator_1.check)('box_model_id')
        .optional()
        .notEmpty()
        .withMessage('Box model ID cannot be empty'),
    (0, express_validator_1.check)('address_id')
        .optional()
        .isInt()
        .withMessage('Address ID must be an integer'),
];
exports.deleteBoxValidator = [
    (0, express_validator_1.check)('id').notEmpty().withMessage('Box ID is required'),
];
//# sourceMappingURL=box.validation.js.map