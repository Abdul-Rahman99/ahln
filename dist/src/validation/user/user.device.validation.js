"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOneUserDeviceValidator = exports.getDevicesByUserValidator = exports.updateDeviceValidator = exports.deleteDeviceValidator = exports.registerDeviceValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const i18n_1 = __importDefault(require("../../config/i18n"));
exports.registerDeviceValidator = [
    (0, express_validator_1.body)('userId')
        .notEmpty()
        .withMessage(i18n_1.default.__('USER_ID_REQUIRED'))
        .isString()
        .withMessage(i18n_1.default.__('INVALID_USER_ID')),
    (0, express_validator_1.body)('fcmToken')
        .notEmpty()
        .withMessage(i18n_1.default.__('FCM_TOKEN_REQUIRED'))
        .isString()
        .withMessage(i18n_1.default.__('INVALID_FCM_TOKEN')),
    validatorMiddleware_1.default,
];
exports.deleteDeviceValidator = [
    (0, express_validator_1.check)('deviceId')
        .notEmpty()
        .withMessage(i18n_1.default.__('DEVICE_ID_REQUIRED'))
        .isInt()
        .withMessage(i18n_1.default.__('INVALID_DEVICE_ID')),
    validatorMiddleware_1.default,
];
exports.updateDeviceValidator = [
    (0, express_validator_1.check)('deviceId')
        .notEmpty()
        .withMessage(i18n_1.default.__('DEVICE_ID_REQUIRED'))
        .isInt()
        .withMessage(i18n_1.default.__('INVALID_DEVICE_ID')),
    (0, express_validator_1.body)('fcmToken')
        .notEmpty()
        .withMessage(i18n_1.default.__('FCM_TOKEN_REQUIRED'))
        .isString()
        .withMessage(i18n_1.default.__('INVALID_FCM_TOKEN')),
    validatorMiddleware_1.default,
];
exports.getDevicesByUserValidator = [
    (0, express_validator_1.check)('userId')
        .notEmpty()
        .withMessage(i18n_1.default.__('USER_ID_REQUIRED'))
        .isString()
        .withMessage(i18n_1.default.__('INVALID_USER_ID')),
    validatorMiddleware_1.default,
];
exports.getOneUserDeviceValidator = [
    (0, express_validator_1.check)('deviceId')
        .notEmpty()
        .withMessage(i18n_1.default.__('DEVICE_ID_REQUIRED'))
        .isString()
        .withMessage(i18n_1.default.__('INVALID_DEVICE_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=user.device.validation.js.map