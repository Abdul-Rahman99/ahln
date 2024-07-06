"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeliveryPackagesValidation = exports.deleteDeliveryPackageValidation = exports.getDeliveryPackageByIdValidation = exports.updateDeliveryPackageValidation = exports.createDeliveryPackageValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createDeliveryPackageValidation = [
    (0, express_validator_1.header)('authorization')
        .notEmpty()
        .withMessage(i18n_1.default.__('AUTH_HEADER_REQUIRED'))
        .custom((value, { req }) => {
        if (!value.startsWith('Bearer ')) {
            throw new Error(i18n_1.default.__('AUTH_HEADER_INVALID'));
        }
        const token = value.split(' ')[1];
        req.token = token;
        return true;
    }),
    (0, express_validator_1.body)('box_id').notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.updateDeliveryPackageValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_DELIVERY_PACKAGE_ID')),
    (0, express_validator_1.body)('vendor_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('VENDOR_ID_REQUIRED')),
    (0, express_validator_1.body)('delivery_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('DELIVERY_ID_REQUIRED')),
    (0, express_validator_1.body)('tracking_number')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('TRACKING_NUMBER_REQUIRED')),
    (0, express_validator_1.body)('box_id').optional().notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    (0, express_validator_1.body)('shipping_company_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('SHIPPING_COMPANY_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getDeliveryPackageByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_DELIVERY_PACKAGE_ID')),
    validatorMiddleware_1.default,
];
exports.deleteDeliveryPackageValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_DELIVERY_PACKAGE_ID')),
    validatorMiddleware_1.default,
];
exports.getUserDeliveryPackagesValidation = [
    (0, express_validator_1.header)('authorization')
        .notEmpty()
        .withMessage(i18n_1.default.__('AUTH_HEADER_REQUIRED'))
        .custom((value, { req }) => {
        if (!value.startsWith('Bearer ')) {
            throw new Error(i18n_1.default.__('AUTH_HEADER_INVALID'));
        }
        const token = value.split(' ')[1];
        req.token = token;
        return true;
    }),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=delivery.package.validation.js.map