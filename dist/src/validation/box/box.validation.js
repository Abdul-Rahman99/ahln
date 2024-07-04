"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoxGenerationByIdValidation = exports.deleteBoxValidation = exports.getBoxByIdValidation = exports.updateBoxValidation = exports.createBoxValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createBoxValidation = [
    (0, express_validator_1.body)('serial_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('SERIAL_NUMBER_REQUIRED')),
    (0, express_validator_1.body)('box_label').notEmpty().withMessage(i18n_1.default.__('BOX_LABEL_REQUIRED')),
    (0, express_validator_1.body)('has_empty_lockers')
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_EMPTY_LOCKERS_BOOLEAN')),
    (0, express_validator_1.body)('current_tablet_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('CURRENT_TABLET_ID_REQUIRED')),
    (0, express_validator_1.body)('previous_tablet_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('PREVIOUS_TABLET_ID_REQUIRED')),
    (0, express_validator_1.body)('box_model_id').isString().withMessage(i18n_1.default.__('BOX_MODEL_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.updateBoxValidation = [
    (0, express_validator_1.body)('serial_number')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('SERIAL_NUMBER_REQUIRED')),
    (0, express_validator_1.body)('box_label')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BOX_LABEL_REQUIRED')),
    (0, express_validator_1.body)('has_empty_lockers')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_EMPTY_LOCKERS_BOOLEAN')),
    (0, express_validator_1.body)('current_tablet_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('CURRENT_TABLET_ID_REQUIRED')),
    (0, express_validator_1.body)('previous_tablet_id')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('PREVIOUS_TABLET_ID_REQUIRED')),
    (0, express_validator_1.body)('box_model_id')
        .optional()
        .isString()
        .withMessage(i18n_1.default.__('BOX_MODEL_ID_REQUIRED')),
    (0, express_validator_1.body)('address_id')
        .optional()
        .isString()
        .withMessage(i18n_1.default.__('ADDRESS_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getBoxByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.deleteBoxValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.getBoxGenerationByIdValidation = [
    (0, express_validator_1.param)('generationId')
        .isString()
        .withMessage(i18n_1.default.__('INVALID_BOX_GENERATION_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=box.validation.js.map