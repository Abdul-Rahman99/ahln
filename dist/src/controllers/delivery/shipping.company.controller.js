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
const shippingCompanyModel = new shipping_company_model_1.default();
exports.createShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { tracking_system, title, logo } = req.body;
    try {
        const shippingCompany = await shippingCompanyModel.createShippingCompany(tracking_system, title, logo);
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'), shippingCompany);
    }
    catch (error) {
        next(error);
        return responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllShippingCompanies = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const shippingCompanies = await shippingCompanyModel.getAllShippingCompanies();
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'), shippingCompanies);
    }
    catch (error) {
        next(error);
        return responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getShippingCompanyById = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        const shippingCompany = await shippingCompanyModel.getShippingCompanyById(parseInt(id, 10));
        if (!shippingCompany) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('SHIPPING_COMPANY_NOT_FOUND'));
        }
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_FETCHED_SUCCESSFULLY'), shippingCompany);
    }
    catch (error) {
        next(error);
        return responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const { tracking_system } = req.body;
    try {
        const updatedShippingCompany = await shippingCompanyModel.updateShippingCompany(parseInt(id, 10), tracking_system);
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'), updatedShippingCompany);
    }
    catch (error) {
        next(error);
        return responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteShippingCompany = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    try {
        await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));
        return responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        next(error);
        return responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=shipping.company.controller.js.map