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
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const addressModel = new address_model_1.default();
exports.createAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newAddress = req.body;
        const createdAddress = await addressModel.createAddress(newAddress);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_CREATED_SUCCESSFULLY'), createdAddress);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'createAddress';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('ADDRESS_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createAddress';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllAddresses = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addresses = await addressModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESSES_RETRIEVED_SUCCESSFULLY'), addresses);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllAddresses';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAddressById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const address = await addressModel.getOne(addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_RETRIEVED_SUCCESSFULLY'), address);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAddressById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const addressData = req.body;
        const updatedAddress = await addressModel.updateOne(addressData, addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_UPDATED_SUCCESSFULLY'), updatedAddress);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'updateAddress';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('ADDRESS_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateAddress';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteAddress = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const addressId = parseInt(req.params.id, 10);
        const deletedAddress = await addressModel.deleteOne(addressId);
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_DELETED_SUCCESSFULLY'), deletedAddress);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'deleteAddress';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('ADDRESS_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteAddress';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=address.controller.js.map