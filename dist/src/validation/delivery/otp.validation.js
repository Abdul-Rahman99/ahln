"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateOTPValidation = exports.checkTrackingNumberValidation = exports.getOTPsByUserValidation = exports.deleteOTPValidation = exports.getOTPByIdValidation = exports.checkOTPValidation = exports.createOTPValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createOTPValidation = [
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
    (0, express_validator_1.body)('box_locker_id')
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_LOCKER_ID_REQUIRED')),
    (0, express_validator_1.body)('delivery_package_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('DELIVERY_PACKAGE_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.checkOTPValidation = [
    (0, express_validator_1.body)('otp').notEmpty().withMessage(i18n_1.default.__('OTP_REQUIRED')),
    (0, express_validator_1.body)('delivery_package_id')
        .optional()
        .isEmpty()
        .withMessage(i18n_1.default.__('DELIVERY_PACKAGE_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getOTPByIdValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_OTP_ID')),
    validatorMiddleware_1.default,
];
exports.deleteOTPValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_OTP_ID')),
    validatorMiddleware_1.default,
];
exports.getOTPsByUserValidation = [
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
exports.checkTrackingNumberValidation = [
    (0, express_validator_1.body)('trackingNumber')
        .notEmpty()
        .withMessage(i18n_1.default.__('TRACKING_NUMBER_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.updateOTPValidation = [
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
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_OTP_ID')),
    (0, express_validator_1.body)('box_id').optional().notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    (0, express_validator_1.body)('box_locker_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_LOCKER_ID_REQUIRED')),
    (0, express_validator_1.body)('box_locker_string')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_LOCKER_STRING_REQUIRED')),
    (0, express_validator_1.body)('delivery_package_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('DELIVERY_PACKAGE_ID_REQUIRED')),
    (0, express_validator_1.body)('is_used')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('INVALID_IS_USED')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=otp.validation.js.map