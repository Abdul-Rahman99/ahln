"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingCompanyIdValidation = exports.updateShippingCompanyValidation = exports.getShippingCompanyIdValidation = exports.createShippingCompanyValidation = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createShippingCompanyValidation = [
    (0, express_validator_1.check)('title')
        .notEmpty()
        .withMessage('Title is required')
        .isString()
        .withMessage('Title must be a string'),
    (0, express_validator_1.check)('logo')
        .notEmpty()
        .withMessage('Logo is required')
        .isString()
        .withMessage('Logo must be a string'),
    validatorMiddleware_1.default,
];
exports.getShippingCompanyIdValidation = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('ID is required')
        .isInt()
        .withMessage('ID must be an integer'),
    validatorMiddleware_1.default,
];
exports.updateShippingCompanyValidation = [
    (0, express_validator_1.check)('trackingSystem')
        .optional()
        .isString()
        .withMessage('Tracking system must be a string'),
    (0, express_validator_1.check)('title').optional().isString().withMessage('Title must be a string'),
    (0, express_validator_1.check)('logo').optional().isString().withMessage('Logo must be a string'),
    validatorMiddleware_1.default,
];
exports.deleteShippingCompanyIdValidation = [
    (0, express_validator_1.check)('id')
        .notEmpty()
        .withMessage('ID is required')
        .isInt()
        .withMessage('ID must be an integer'),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=shipping.company.validation.js.map