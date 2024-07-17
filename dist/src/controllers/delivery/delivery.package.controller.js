"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserDeliveryPackages = exports.deleteDeliveryPackage = exports.updateDeliveryPackage = exports.getDeliveryPackageById = exports.getAllDeliveryPackages = exports.createDeliveryPackage = void 0;
const delivery_package_model_1 = __importDefault(require("../../models/delivery/delivery.package.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const shipping_company_model_1 = __importDefault(require("../../models/delivery/shipping.company.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const systemLog = new system_log_model_1.default();
const userModel = new user_model_1.default();
const shippingCompanyModel = new shipping_company_model_1.default();
const deliveryPackageModel = new delivery_package_model_1.default();
exports.createDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        if (req.body.tracking_number) {
            await deliveryPackageModel.checkTrackingNumber(req.body.tracking_number.toLowerCase());
        }
        const user = await (0, authHandler_1.default)(req, res, next);
        let shipping_company_id;
        try {
            shipping_company_id = await shippingCompanyModel.getShippingCompanyById(req.body.shipping_company_id);
            if (!shipping_company_id) {
                req.body.other_shipping_company = req.body.shipping_company_id;
                req.body.shipping_company_id = null;
            }
        }
        catch (error) {
            req.body.other_shipping_company = req.body.shipping_company_id;
            req.body.shipping_company_id = null;
        }
        const newDeliveryPackage = req.body;
        const createdDeliveryPackage = await deliveryPackageModel.createDeliveryPackage(user, newDeliveryPackage);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'), createdDeliveryPackage);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllDeliveryPackages = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackages = await deliveryPackageModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGES_RETRIEVED_SUCCESSFULLY'), deliveryPackages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllDeliveryPackages';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getDeliveryPackageById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const deliveryPackage = await deliveryPackageModel.getOne(deliveryPackageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_RETRIEVED_SUCCESSFULLY'), deliveryPackage);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getDeliveryPackageById';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const deliveryPackageData = req.body;
        try {
            if (req.body.shipping_company_id) {
                const shipping_company_id = await shippingCompanyModel.getShippingCompanyById(req.body.shipping_company_id);
                if (!shipping_company_id) {
                    req.body.other_shipping_company = req.body.shipping_company_id;
                    req.body.shipping_company_id = null;
                }
                else {
                    req.body.other_shipping_company = null;
                }
            }
        }
        catch (error) {
            req.body.other_shipping_company = req.body.shipping_company_id;
            req.body.shipping_company_id = null;
        }
        const updatedDeliveryPackage = await deliveryPackageModel.updateOne(deliveryPackageData, deliveryPackageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'), updatedDeliveryPackage);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const deletedDeliveryPackage = await deliveryPackageModel.deleteOne(deliveryPackageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'), deletedDeliveryPackage);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getUserDeliveryPackages = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { status } = req.query;
        const token = req.headers.authorization?.replace('Bearer ', '');
        if (!token) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'getUserDeliveryPackages';
            systemLog.createSystemLog(user, 'Token Not Provided', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
        }
        const user = await userModel.findByToken(token);
        if (!user) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'getUserDeliveryPackages';
            systemLog.createSystemLog(user, 'Token Invalid', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        const deliveryPackages = await deliveryPackageModel.getPackagesByUser(user, status);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGES_FETCHED_SUCCESSFULLY'), deliveryPackages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getUserDeliveryPackages';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=delivery.package.controller.js.map