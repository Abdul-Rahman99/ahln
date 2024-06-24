"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginValidator = exports.registerValidator = void 0;
const express_validator_1 = require("express-validator");
const user_model_1 = __importDefault(require("../models/users/user.model"));
const validatorMiddleware_1 = __importDefault(require("../middlewares/validatorMiddleware"));
const config_1 = __importDefault(require("../../config"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const i18n_1 = __importDefault(require("../config/i18n"));
const userModel = new user_model_1.default();
exports.registerValidator = [
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
    (0, express_validator_1.body)('password')
        .notEmpty()
        .withMessage(i18n_1.default.__('PASSWORD_REQUIRED'))
        .isLength({ min: 6 })
        .withMessage(i18n_1.default.__('PASSWORD_MIN_LENGTH')),
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
const validateLoginCredentials = async (email, password) => {
    const user = await userModel.findByEmail(email);
    if (!user ||
        !bcrypt_1.default.hashSync(password + config_1.default.JWT_SECRET_KEY, user.password)) {
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
            res.status(401).json({ message: error.message });
        }
    },
    validatorMiddleware_1.default,
];
//# sourceMappingURL=auth.validation.js.map