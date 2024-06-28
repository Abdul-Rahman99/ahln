"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxLockerValidator = exports.updateBoxLockerValidator = exports.getBoxLockerValidator = exports.createBoxLockerValidator = void 0;
const express_validator_1 = require("express-validator");
exports.createBoxLockerValidator = [
    (0, express_validator_1.body)('locker_label').isString().withMessage('Locker label is required'),
    (0, express_validator_1.body)('serial_port').isString().withMessage('Serial port is required'),
    (0, express_validator_1.body)('is_empty').isBoolean().withMessage('is_empty must be a boolean'),
    (0, express_validator_1.body)('box_id').isString().withMessage('Box ID is required'),
];
exports.getBoxLockerValidator = [
    (0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer'),
];
exports.updateBoxLockerValidator = [
    (0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer'),
    (0, express_validator_1.body)('locker_label')
        .optional()
        .isString()
        .withMessage('Locker label must be a string'),
    (0, express_validator_1.body)('serial_port')
        .optional()
        .isString()
        .withMessage('Serial port must be a string'),
    (0, express_validator_1.body)('is_empty')
        .optional()
        .isBoolean()
        .withMessage('is_empty must be a boolean'),
    (0, express_validator_1.body)('box_id').optional().isString().withMessage('Box ID must be a string'),
];
exports.deleteBoxLockerValidator = [
    (0, express_validator_1.param)('id').isInt().withMessage('ID must be an integer'),
];
//# sourceMappingURL=box.locker.validation.js.map