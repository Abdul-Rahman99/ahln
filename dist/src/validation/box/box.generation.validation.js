"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxGenerationValidation = exports.getBoxGenerationByIdValidation = exports.updateBoxGenerationValidation = exports.createBoxGenerationValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createBoxGenerationValidation = [
    (0, express_validator_1.body)('model_name').notEmpty().withMessage(i18n_1.default.__('MODEL_NAME_REQUIRED')),
    (0, express_validator_1.body)('number_of_doors')
        .isInt({ min: 1 })
        .withMessage(i18n_1.default.__('NUMBER_OF_DOORS_INVALID')),
    (0, express_validator_1.body)('width').optional().isNumeric().withMessage(i18n_1.default.__('WIDTH_INVALID')),
    (0, express_validator_1.body)('height').optional().isNumeric().withMessage(i18n_1.default.__('HEIGHT_INVALID')),
    (0, express_validator_1.body)('color').optional().isString().withMessage(i18n_1.default.__('COLOR_INVALID')),
    (0, express_validator_1.body)('model_image')
        .optional()
        .isString()
        .withMessage(i18n_1.default.__('MODEL_IMAGE_INVALID')),
    (0, express_validator_1.body)('has_outside_camera')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_OUTSIDE_CAMERA_BOOLEAN')),
    (0, express_validator_1.body)('has_inside_camera')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_INSIDE_CAMERA_BOOLEAN')),
    (0, express_validator_1.body)('has_tablet')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_TABLET_BOOLEAN')),
    validatorMiddleware_1.default,
];
exports.updateBoxGenerationValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    (0, express_validator_1.body)('model_name')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('MODEL_NAME_REQUIRED')),
    (0, express_validator_1.body)('number_of_doors')
        .optional()
        .isInt({ min: 1 })
        .withMessage(i18n_1.default.__('NUMBER_OF_DOORS_INVALID')),
    (0, express_validator_1.body)('width').optional().isNumeric().withMessage(i18n_1.default.__('WIDTH_INVALID')),
    (0, express_validator_1.body)('height').optional().isNumeric().withMessage(i18n_1.default.__('HEIGHT_INVALID')),
    (0, express_validator_1.body)('color').optional().isString().withMessage(i18n_1.default.__('COLOR_INVALID')),
    (0, express_validator_1.body)('model_image')
        .optional()
        .isString()
        .withMessage(i18n_1.default.__('MODEL_IMAGE_INVALID')),
    (0, express_validator_1.body)('has_outside_camera')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_OUTSIDE_CAMERA_BOOLEAN')),
    (0, express_validator_1.body)('has_inside_camera')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_INSIDE_CAMERA_BOOLEAN')),
    (0, express_validator_1.body)('has_tablet')
        .optional()
        .isBoolean()
        .withMessage(i18n_1.default.__('HAS_TABLET_BOOLEAN')),
    validatorMiddleware_1.default,
];
exports.getBoxGenerationByIdValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
exports.deleteBoxGenerationValidation = [
    (0, express_validator_1.param)('id').isString().withMessage(i18n_1.default.__('INVALID_BOX_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=box.generation.validation.js.map