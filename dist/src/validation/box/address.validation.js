"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddressValidation = exports.updateAddressValidation = exports.getAddressByIdValidation = exports.getAllAddressesValidation = exports.createAddressValidation = void 0;
const express_validator_1 = require("express-validator");
const i18n_1 = __importDefault(require("../../config/i18n"));
exports.createAddressValidation = [
    (0, express_validator_1.body)('email')
        .notEmpty()
        .withMessage(i18n_1.default.__('EMAIL_REQUIRED'))
        .isEmail()
        .withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('district').notEmpty().withMessage(i18n_1.default.__('DISTRICT_REQUIRED')),
    (0, express_validator_1.body)('city').notEmpty().withMessage(i18n_1.default.__('CITY_REQUIRED')),
    (0, express_validator_1.body)('building_number')
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_NUMBER_REQUIRED')),
];
exports.getAllAddressesValidation = [];
exports.getAddressByIdValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
];
exports.updateAddressValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
    (0, express_validator_1.body)('email').optional().isEmail().withMessage(i18n_1.default.__('EMAIL_INVALID')),
    (0, express_validator_1.body)('district')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('DISTRICT_REQUIRED')),
    (0, express_validator_1.body)('city').optional().notEmpty().withMessage(i18n_1.default.__('CITY_REQUIRED')),
    (0, express_validator_1.body)('building_number')
        .optional()
        .notEmpty()
        .withMessage(i18n_1.default.__('BUILDING_NUMBER_REQUIRED')),
];
exports.deleteAddressValidation = [
    (0, express_validator_1.param)('id').isInt().withMessage(i18n_1.default.__('INVALID_ADDRESS_ID')),
];
//# sourceMappingURL=address.validation.js.map