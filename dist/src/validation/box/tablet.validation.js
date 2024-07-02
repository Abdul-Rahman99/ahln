"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTabletValidation = exports.getTabletByIdValidation = exports.updateTabletValidation = exports.createTabletValidation = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
const tablet_model_1 = __importDefault(require("../../models/box/tablet.model"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const tabletModel = new tablet_model_1.default();
exports.createTabletValidation = [
    (0, express_validator_1.body)('serial_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('SERIAL_NUMBER_REQUIRED'))
        .custom(async (serialNumber) => {
        const serialNumberExists = await tabletModel.serialNumberExists(serialNumber);
        if (serialNumberExists) {
            throw new Error(i18n_1.default.__('SERIAL_NUMBER_IN_USE'));
        }
    }),
    (0, express_validator_1.body)('android_id')
        .notEmpty()
        .withMessage(i18n_1.default.__('ANDROID_ID_REQUIRED'))
        .custom(async (androidId) => {
        if (androidId) {
            const androidIdExists = await tabletModel.androidIdExists(androidId);
            if (androidIdExists) {
                throw new Error(i18n_1.default.__('ANDROID_ID_IN_USE'));
            }
        }
    }),
    validatorMiddleware_1.default,
];
exports.updateTabletValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_TABLET_ID')),
    (0, express_validator_1.body)('serial_number')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('SERIAL_NUMBER_REQUIRED'))
        .custom(async (serialNumber) => {
        const serialNumberExists = await tabletModel.serialNumberExists(serialNumber);
        if (serialNumberExists) {
            throw new Error(i18n_1.default.__('SERIAL_NUMBER_IN_USE'));
        }
    }),
    (0, express_validator_1.body)('android_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('ANDROID_ID_REQUIRED'))
        .custom(async (androidId) => {
        if (androidId) {
            const androidIdExists = await tabletModel.androidIdExists(androidId);
            if (androidIdExists) {
                throw new Error(i18n_1.default.__('ANDROID_ID_IN_USE'));
            }
        }
    }),
    validatorMiddleware_1.default,
];
exports.getTabletByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_TABLET_ID')),
    validatorMiddleware_1.default,
];
exports.deleteTabletValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_TABLET_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=tablet.validation.js.map