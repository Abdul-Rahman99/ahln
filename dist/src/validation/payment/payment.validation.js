"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePaymentValidation = exports.updatePaymentValidation = exports.getPaymentByIdValidation = exports.createPaymentValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const isValidDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime());
};
exports.createPaymentValidation = [
    (0, express_validator_1.body)('amount').isInt().notEmpty().withMessage(i18n_1.default.__('AMOUNT_REQUIRED')),
    (0, express_validator_1.body)('card_id').isInt().notEmpty().withMessage(i18n_1.default.__('CARD_ID_REQUIRED')),
    (0, express_validator_1.body)('billing_date')
        .custom((value) => {
        if (!isValidDate(value)) {
            throw new Error(i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        return true;
    })
        .withMessage(i18n_1.default.__('PURCHASE_DATE_REQUIRED')),
    (0, express_validator_1.body)('is_paid')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('IS_PAID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getPaymentByIdValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_PAYMENT_ID')),
    validatorMiddleware_1.default,
];
exports.updatePaymentValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_PAYMENT_ID')),
    (0, express_validator_1.body)('amount')
        .optional()
        .isInt()
        .notEmpty()
        .withMessage(i18n_1.default.__('AMOUNT_REQUIRED')),
    (0, express_validator_1.body)('card_id')
        .optional()
        .isInt()
        .notEmpty()
        .withMessage(i18n_1.default.__('CARD_ID_REQUIRED')),
    (0, express_validator_1.body)('billing_date')
        .optional()
        .custom((value) => {
        if (!isValidDate(value)) {
            throw new Error(i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        return true;
    })
        .withMessage(i18n_1.default.__('PURCHASE_DATE_REQUIRED')),
    (0, express_validator_1.body)('is_paid')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('IS_PAID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.deletePaymentValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_PAYMENT_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=payment.validation.js.map