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
exports.createShippingCompany = (0, asyncHandler_1.default)(async (req, res) => {
    const { tracking_system, title, logo } = req.body;
    try {
        const shippingCompany = await shippingCompanyModel.createShippingCompany(tracking_system, title, logo);
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_CREATED_SUCCESSFULLY'), shippingCompany);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('SHIPPING_COMPANY_CREATION_FAILED'), error.message);
    }
});
exports.getAllShippingCompanies = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const shippingCompanies = await shippingCompanyModel.getAllShippingCompanies();
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANIES_FETCHED_SUCCESSFULLY'), shippingCompanies);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('SHIPPING_COMPANIES_FETCH_FAILED'), error.message);
    }
});
exports.getShippingCompanyById = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    try {
        const shippingCompany = await shippingCompanyModel.getShippingCompanyById(parseInt(id, 10));
        if (!shippingCompany) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('SHIPPING_COMPANY_NOT_FOUND'));
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_FETCHED_SUCCESSFULLY'), shippingCompany);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('SHIPPING_COMPANY_FETCH_FAILED'), error.message);
    }
});
exports.updateShippingCompany = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    const { tracking_system } = req.body;
    try {
        const updatedShippingCompany = await shippingCompanyModel.updateShippingCompany(parseInt(id, 10), tracking_system);
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_UPDATED_SUCCESSFULLY'), updatedShippingCompany);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('SHIPPING_COMPANY_UPDATE_FAILED'), error.message);
    }
});
exports.deleteShippingCompany = (0, asyncHandler_1.default)(async (req, res) => {
    const { id } = req.params;
    try {
        await shippingCompanyModel.deleteShippingCompany(parseInt(id, 10));
        responsesHandler_1.default.success(res, i18n_1.default.__('SHIPPING_COMPANY_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('SHIPPING_COMPANY_DELETE_FAILED'), error.message);
    }
});
//# sourceMappingURL=shipping.company.controller.js.map