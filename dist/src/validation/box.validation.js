"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxValidator = exports.getBoxValidator = exports.updateBoxValidator = exports.createBoxValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../middlewares/validatorMiddleware"));
const i18n_1 = __importDefault(require("../config/i18n"));
exports.createBoxValidator = [
    (0, express_validator_1.body)('compartments_number')
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage(i18n_1.default.__('COMPARTMENTS_NUMBER_INVALID')),
    (0, express_validator_1.body)('compartment1')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT1_STATUS_INVALID')),
    (0, express_validator_1.body)('compartment2')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT2_STATUS_INVALID')),
    (0, express_validator_1.body)('compartment3')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT3_STATUS_INVALID')),
    (0, express_validator_1.body)('video_id').isInt({ min: 1 }).withMessage(i18n_1.default.__('VIDEO_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.updateBoxValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1000000, max: 9999999 })
        .withMessage(i18n_1.default.__('INVALID_ID')),
    (0, express_validator_1.body)('compartments_number')
        .optional()
        .isInt({ min: 1, max: 3 })
        .withMessage(i18n_1.default.__('COMPARTMENTS_NUMBER_INVALID')),
    (0, express_validator_1.body)('compartment1')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT1_STATUS_INVALID')),
    (0, express_validator_1.body)('compartment2')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT2_STATUS_INVALID')),
    (0, express_validator_1.body)('compartment3')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('COMPARTMENT3_STATUS_INVALID')),
    (0, express_validator_1.body)('video_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage(i18n_1.default.__('VIDEO_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getBoxValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1000000, max: 9999999 })
        .withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
exports.deleteBoxValidator = [
    (0, express_validator_1.param)('id')
        .isInt({ min: 1000000, max: 9999999 })
        .withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=box.validation.js.map