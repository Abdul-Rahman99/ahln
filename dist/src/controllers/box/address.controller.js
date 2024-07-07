"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.getAddressById = exports.getAllAddresses = exports.createAddress = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const address_model_1 = __importDefault(require("../../models/box/address.model"));
const addressModel = new address_model_1.default();
exports.createAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newAddress = req.body;
        const createdAddress = await addressModel.createAddress(newAddress);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_CREATED_SUCCESSFULLY'), createdAddress);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllAddresses = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addresses = await addressModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESSES_RETRIEVED_SUCCESSFULLY'), addresses);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAddressById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const address = await addressModel.getOne(addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_RETRIEVED_SUCCESSFULLY'), address);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.updateAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const addressData = req.body;
        const updatedAddress = await addressModel.updateOne(addressData, addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_UPDATED_SUCCESSFULLY'), updatedAddress);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deleteAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const deletedAddress = await addressModel.deleteOne(addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_DELETED_SUCCESSFULLY'), deletedAddress);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=address.controller.js.map