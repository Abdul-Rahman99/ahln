"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddressValidation = exports.updateAddressValidation = exports.getAddressByIdValidation = exports.createAddressValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
const validatorMiddleware_1 = __importDefault(require("../../middlewares/validatorMiddleware"));
exports.createAddressValidation = [
    (0, express_validator_1.body)('country').notEmpty().withMessage(i18n_1.default.__('COUNTRY_REQUIRED')),
    (0, express_validator_1.body)('city').notEmpty().withMessage(i18n_1.default.__('CITY_REQUIRED')),
    (0, express_validator_1.body)('district').notEmpty().withMessage(i18n_1.default.__('DISTRICT_REQUIRED')),
    (0, express_validator_1.body)('street').notEmpty().withMessage(i18n_1.default.__('STREET_REQUIRED')),
    (0, express_validator_1.body)('building_type')
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_TYPE_REQUIRED')),
    (0, express_validator_1.body)('building_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_NUMBER_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.getAddressByIdValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
    validatorMiddleware_1.default,
];
exports.updateAddressValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
    (0, express_validator_1.body)('country')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('COUNTRY_REQUIRED')),
    (0, express_validator_1.body)('city').optional().notEmpty().withMessage(i18n_1.default.__('CITY_REQUIRED')),

    (0, express_validator_1.body)('district')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('DISTRICT_REQUIRED')),

    (0, express_validator_1.body)('street').optional().notEmpty().withMessage(i18n_1.default.__('STREET_REQUIRED')),
    (0, express_validator_1.body)('building_type')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_TYPE_REQUIRED')),

    (0, express_validator_1.body)('building_number')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_NUMBER_REQUIRED')),
    validatorMiddleware_1.default,
];
exports.deleteAddressValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
    validatorMiddleware_1.default,

];
//# sourceMappingURL=address.validation.js.map