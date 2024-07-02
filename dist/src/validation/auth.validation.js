"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordWithOTPValidator = exports.resendOtpAndUpdateDBValidator = exports.verifyEmailValidator = exports.logoutValidator = exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/users/user.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const i18n_1 = __importDefault(require("../config/i18n"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const validatorMiddleware_1 = __importDefault(require("../middlewares/validatorMiddleware"));
const userModel = new user_model_1.default();
exports.registerValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('user_name').notEmpty().withMessage(i18n_1.default.__('NAME_REQUIRED')),
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage(i18n_1.default.__('PASSWORD_REQUIRED'))
        .isLength({ min: 6 })
        .withMessage(i18n_1.default.__('PASSWORD_MIN_LENGTH')),
    (0, express_validator_1.body)('phone_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('PHONE_REQUIRED'))
        .isMobilePhone(['ar-AE', 'ar-SA'])
        .withMessage(i18n_1.default.__('INVALID_PHONE_FORMAT')),
    validatorMiddleware_1.default,
];
const validateLoginCredentials = async (email, password) => {
    const user = await userModel.findByEmail(email);
    if (!user || !bcrypt_1.default.compareSync(password, user.password)) {
        throw new Error(i18n_1.default.__('INVALID_CREDENTIALS'));
    }
};
exports.loginValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('password').notEmpty().withMessage(i18n_1.default.__('PASSWORD_REQUIRED')),
    async (req, res, next) => {
        const { email, password } = req.body;
        try {
            await validateLoginCredentials(email, password);
            next();
        }
        catch (error) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'), null);
        }
    },
    validatorMiddleware_1.default,
];
exports.logoutValidator = [
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
exports.verifyEmailValidator = [
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
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('otp')
        .notEmpty()
        .withMessage(i18n_1.default.__('OTP_REQUIRED'))
        .isLength({ min: 6, max: 6 })
        .withMessage(i18n_1.default.__('OTP_INVALID')),
    async (req, res, next) => {
        const { email } = req.body;
        try {
            const user = await userModel.findByEmail(email);
            if (!user) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'), null);
            }
            next();
        }
        catch (error) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('VALIDATION_ERROR'), error.array());
        }
    },
    validatorMiddleware_1.default,
];
exports.resendOtpAndUpdateDBValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    validatorMiddleware_1.default,
];
exports.updatePasswordWithOTPValidator = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('otp')
        .notEmpty()
        .withMessage(i18n_1.default.__('OTP_REQUIRED'))
        .isLength({ min: 6, max: 6 })
        .withMessage(i18n_1.default.__('OTP_INVALID')),
    (0, express_validator_1.body)('newPassword').notEmpty().withMessage(i18n_1.default.__('PASSWORD_REQUIRED')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=auth.validation.js.map