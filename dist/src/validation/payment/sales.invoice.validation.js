"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSalesInvoicesByBoxIdValidation = exports.getSalesInvoicesBySalesIdValidation = exports.getSalesInvoicesByUserIdValidation = exports.deleteSalesInvoiceValidation = exports.updateSalesInvoiceValidation = exports.getSalesInvoiceByIdValidation = exports.createSalesInvoiceValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const isValidDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return !isNaN(date.getTime());
};
exports.createSalesInvoiceValidation = [
    (0, express_validator_1.body)('customer_id')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('CUSTOMER_ID_REQUIRED')),
    (0, express_validator_1.body)('box_id').isString().notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    (0, express_validator_1.body)('purchase_date')
        .custom((value) => {
        if (!isValidDate(value)) {
            throw new Error(i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        return true;
    })
        .withMessage(i18n_1.default.__('PURCHASE_DATE_REQUIRED')),
    (0, express_validator_1.body)('sales_id')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('SALES_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getSalesInvoiceByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_SALES_INVOICE_ID')),
    validatorMiddleware_1.default,
];
exports.updateSalesInvoiceValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_SALES_INVOICE_ID')),
    (0, express_validator_1.body)('customer_id')
        .optional()
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('CUSTOMER_ID_REQUIRED')),
    (0, express_validator_1.body)('box_id')
        .optional()
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    (0, express_validator_1.body)('purchase_date')
        .optional()
        .custom((value) => {
        if (!isValidDate(value)) {
            throw new Error(i18n_1.default.__('INVALID_DATE_FORMAT'));
        }
        return true;
    })
        .withMessage(i18n_1.default.__('PURCHASE_DATE_REQUIRED')),
    (0, express_validator_1.body)('sales_id')
        .optional()
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('SALES_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.deleteSalesInvoiceValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_SALES_INVOICE_ID')),
    validatorMiddleware_1.default,
];
exports.getSalesInvoicesByUserIdValidation = [
    (0, express_validator_1.body)('user_id')
        .isString()
        .withMessage(i18n_1.default.__('INVALID_USER_SALES_INVOICE_ID')),
    validatorMiddleware_1.default,
];
exports.getSalesInvoicesBySalesIdValidation = [
    (0, express_validator_1.body)('sales_id')
        .isString()
        .withMessage(i18n_1.default.__('INVALID_USER_SALES_INVOICE_ID')),
    validatorMiddleware_1.default,
];
exports.getSalesInvoicesByBoxIdValidation = [
    (0, express_validator_1.param)('box_id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=sales.invoice.validation.js.map