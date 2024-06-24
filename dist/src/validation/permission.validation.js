"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermissionValidator = exports.updatePermissionValidator = exports.createPermissionValidator = exports.getPermissionValidator = void 0;
const express_validator_1 = require("express-validator");
const validatorMiddleware_1 = __importDefault(require("../middlewares/validatorMiddleware"));
const i18n_1 = __importDefault(require("../config/i18n"));
exports.getPermissionValidator = [
    (0, express_validator_1.check)('id').isInt().withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
exports.createPermissionValidator = [
    (0, express_validator_1.body)('title')
        .notEmpty()
        .withMessage(i18n_1.default.__('PERMISSION_TITLE_REQUIRED'))
        .isLength({ max: 50 })
        .withMessage(i18n_1.default.__('PERMISSION_TITLE_TOO_LONG')),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage(i18n_1.default.__('PERMISSION_DESCRIPTION_TOO_LONG')),
    validatorMiddleware_1.default,
];
exports.updatePermissionValidator = [
    (0, express_validator_1.check)('id').isInt().withMessage(i18n_1.default.__('INVALID_ID')),
    (0, express_validator_1.body)('title')
        .optional()
        .isLength({ max: 50 })
        .withMessage(i18n_1.default.__('PERMISSION_TITLE_TOO_LONG')),
    (0, express_validator_1.body)('description')
        .optional()
        .isLength({ max: 255 })
        .withMessage(i18n_1.default.__('PERMISSION_DESCRIPTION_TOO_LONG')),
    validatorMiddleware_1.default,
];
exports.deletePermissionValidator = [
    (0, express_validator_1.check)('id').isInt().withMessage(i18n_1.default.__('INVALID_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=permission.validation.js.map