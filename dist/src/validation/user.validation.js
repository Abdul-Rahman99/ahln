"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserValidator = exports.updateUserValidator = exports.createUserValidator = exports.getUserValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../middlewares/validatorMiddleware"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const i18n_1 = __importDefault(require("../config/i18n"));
const userModel = new user_model_1.default();
exports.getUserValidator = [
    (0, express_validator_1.check)('id').isString().withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
exports.createUserValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID'))
        .custom(async (email) => {
        const emailExists = await userModel.emailExists(email);
        if (emailExists) {
            throw new Error(i18n_1.default.__('EMAIL_IN_USE'));
        }
    }),
    (0, express_validator_1.body)('user_name').notEmpty().withMessage(i18n_1.default.__('NAME_REQUIRED')),
    (0, express_validator_1.body)('phone_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('PHONE_REQUIRED'))
        .isMobilePhone(['ar-AE', 'ar-SA'])
        .withMessage(i18n_1.default.__('INVALID_PHONE_FORMAT'))
        .custom(async (phone) => {
        const phoneExists = await userModel.phoneExists(phone);
        if (phoneExists) {
            throw new Error(i18n_1.default.__('PHONE_ALREADY_REGISTERED'));
        }
    }),
    validatorMiddleware_1.default,
];
exports.updateUserValidator = [
    (0, express_validator_1.check)('id').isString().withMessage(i18n_1.default.__('INVALID_ID')),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage(i18n_1.default.__('EMAIL_REQUIRED')),
    (0, express_validator_1.body)('user_name').optional().notEmpty().withMessage(i18n_1.default.__('NAME_REQUIRED')),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6 })
        .withMessage(i18n_1.default.__('PASSWORD_MIN_LENGTH')),
    (0, express_validator_1.body)('phone_number')
        .optional()
        .isMobilePhone(['ar-AE', 'ar-SA'])
        .withMessage(i18n_1.default.__('INVALID_PHONE_FORMAT')),
    validatorMiddleware_1.default,
];
exports.deleteUserValidator = [
    (0, express_validator_1.check)('id').isString().withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=user.validation.js.map