"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteShippingCompany = exports.updateShippingCompany = exports.getShippingCompanyById = exports.getAllShippingCompanies = exports.createShippingCompany = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const shipping_company_model_1 = __importDefault(require("../../models/delivery/shipping.company.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const systemLog = new system_log_model_1.default();
const shippingCompanyModel = new shipping_company_model_1.default();
const auditTrail = new audit_trail_model_1.default();
exports.createShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { tracking_system, title, logo } = req.body;
    try {
        const shippingCompany = await shippingCompanyModel.createShippingCompany(tracking_system, title, logo);
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'), shippingCompany);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'createShippingCompany';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createShippingCompany';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllShippingCompanies = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const shippingCompanies = await shippingCompanyModel.getAllShippingCompanies();
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'), shippingCompanies);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllShippingCompanies';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getShippingCompanyById = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const shippingCompany = await shippingCompanyModel.getShippingCompanyById(parseInt(id, 10));
        if (!shippingCompany) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'uploadImage';
            systemLog.createSystemLog(user, 'Shipping Company Not Found', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('SHIPPING_COMPANY_NOT_FOUND'));
        }
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_FETCHED_SUCCESSFULLY'), shippingCompany);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getShippingCompanyById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.updateShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { tracking_system } = req.body;
    try {
        const updatedShippingCompany = await shippingCompanyModel.updateShippingCompany(parseInt(id, 10), tracking_system);
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'), updatedShippingCompany);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'updateShippingCompany';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateShippingCompany';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deleteShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'));
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'deleteShippingCompany';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteShippingCompany';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=shipping.company.controller.js.map