"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxLockerValidation = exports.getBoxLockerByIdValidation = exports.updateBoxLockerValidation = exports.createBoxLockerValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createBoxLockerValidation = [
    (0, express_validator_1.body)('locker_label').notEmpty().withMessage(i18n_1.default.__('LOCKER_LABEL_REQUIRED')),
    (0, express_validator_1.body)('serial_port').isString().withMessage(i18n_1.default.__('SERIAL_PORT_INVALID')),
    (0, express_validator_1.body)('is_empty').isBoolean().withMessage(i18n_1.default.__('IS_EMPTY_BOOLEAN')),
    (0, express_validator_1.body)('box_id').isString().withMessage(i18n_1.default.__('BOX_ID_INVALID')),
    validatorMiddleware_1.default,
];
exports.updateBoxLockerValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_LOCKER_ID')),
    (0, express_validator_1.body)('locker_label')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('LOCKER_LABEL_REQUIRED')),
    (0, express_validator_1.body)('serial_port')
        .optional()
        .isString()
        .withMessage(i18n_1.default.__('SERIAL_PORT_INVALID')),
    (0, express_validator_1.body)('is_empty')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('IS_EMPTY_BOOLEAN')),
    (0, express_validator_1.body)('box_id').optional().isString().withMessage(i18n_1.default.__('BOX_ID_INVALID')),
    validatorMiddleware_1.default,
];
exports.getBoxLockerByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_LOCKER_ID')),
    validatorMiddleware_1.default,
];
exports.deleteBoxLockerValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_LOCKER_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=box.locker.validation.js.map