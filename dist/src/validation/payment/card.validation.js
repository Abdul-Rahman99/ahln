"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCardValidation = exports.updateCardValidation = exports.getCardByIdValidation = exports.createCardValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createCardValidation = [
    (0, express_validator_1.body)('card_number')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('CARD_NUMBER_REQUIRED'))
        .isLength({ min: 16, max: 16 })
        .withMessage(i18n_1.default.__('CARD_NUMBER_MUST_BE_16_CHARCHTER'))
        .isLength({ min: 16, max: 16 })
        .withMessage(i18n_1.default.__('CARD_NUMBER_MUST_BE_16_CHARCHTER')),
    (0, express_validator_1.body)('expire_date')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('EXPIRE_DATE_REQUIRED')),
    (0, express_validator_1.body)('cvv')
        .isString()
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .withMessage(i18n_1.default.__('CVV_REQUIRED')),
    (0, express_validator_1.body)('name_on_card')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('NAME_ON_CARD_REQUIRED')),
    (0, express_validator_1.body)('billing_address').isInt().optional(),
    (0, express_validator_1.body)('user_id')
        .isString()
        .notEmpty()
        .withMessage(i18n_1.default.__('USER_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getCardByIdValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_CARD_ID')),
    validatorMiddleware_1.default,
];
exports.updateCardValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_CARD_ID')),
    (0, express_validator_1.body)('card_number')
        .isString()
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('CARD_NUMBER_REQUIRED')),
    (0, express_validator_1.body)('expire_date')
        .isString()
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('EXPIRE_DATE_REQUIRED')),
    (0, express_validator_1.body)('cvv')
        .isString()
        .optional()
        .notEmpty()
        .isLength({ min: 3, max: 3 })
        .withMessage(i18n_1.default.__('CVV_REQUIRED')),
    (0, express_validator_1.body)('name_on_card')
        .isString()
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('NAME_ON_CARD_REQUIRED')),
    (0, express_validator_1.body)('billing_address').isInt().optional(),
    (0, express_validator_1.body)('user_id')
        .isString()
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('USER_ID_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.deleteCardValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_CARD_ID')),
    validatorMiddleware_1.default,
];
//# sourceMappingURL=card.validation.js.map