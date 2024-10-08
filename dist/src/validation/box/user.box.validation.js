"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserBoxStatusValidation = exports.userAssignBoxToRelativeUserValidation = exports.userAssignBoxToHimselfValidation = exports.assignBoxToUserValidation = exports.getUserBoxesByBoxIdValidation = exports.getUserBoxesByUserIdValidation = exports.deleteUserBoxValidation = exports.updateUserBoxValidation = exports.getUserBoxByIdValidation = exports.createUserBoxValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createUserBoxValidation = [
    (0, express_validator_1.body)('userId').isString().notEmpty().withMessage(i18n_1.default.__('USER_ID_REQUIRED')),
    (0, express_validator_1.body)('boxId').notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getUserBoxByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_USER_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.updateUserBoxValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_USER_BOX_ID')),
    (0, express_validator_1.body)('userId').optional().notEmpty().withMessage(i18n_1.default.__('USER_ID_REQUIRED')),
    (0, express_validator_1.body)('boxId').optional().notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.deleteUserBoxValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_USER_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.getUserBoxesByUserIdValidation = [
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
exports.getUserBoxesByBoxIdValidation = [
    (0, express_validator_1.param)('boxId').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.assignBoxToUserValidation = [
    (0, express_validator_1.body)('userId').notEmpty().withMessage(i18n_1.default.__('USER_ID_REQUIRED')),
    (0, express_validator_1.body)('boxId').notEmpty().withMessage(i18n_1.default.__('BOX_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.userAssignBoxToHimselfValidation = [
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
    (0, express_validator_1.body)('serialNumber')
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_SERIAL_NUMBER_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.userAssignBoxToRelativeUserValidation = [
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
    (0, express_validator_1.body)('boxId').notEmpty().withMessage(i18n_1.default.__('BOX_SERIAL_NUMBER_REQUIRED')),
    (0, express_validator_1.body)('email').notEmpty().withMessage(i18n_1.default.__('EMAIL_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.updateUserBoxStatusValidation = [
    (0, express_validator_1.body)('is_active').notEmpty().withMessage(i18n_1.default.__('IS_ACTIVE_REQUIRED')),
    (0, express_validator_1.body)('id').notEmpty().withMessage(i18n_1.default.__('USER_BOX_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=user.box.validation.js.map