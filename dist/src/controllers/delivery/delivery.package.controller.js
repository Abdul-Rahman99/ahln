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
const shipping_company_model_1 = __importDefault(require("../../models/delivery/shipping.company.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const userDevicesModel = new user_devices_model_1.default();
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const shippingCompanyModel = new shipping_company_model_1.default();
const deliveryPackageModel = new delivery_package_model_1.default();
exports.createDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        if (req.body.tracking_number) {
            await deliveryPackageModel.checkTrackingNumber(req.body.tracking_number.toLowerCase());
        }
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
        notificationModel.createNotification('createDeliveryPackage', i18n_1.default.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'), null, user);
        const action = 'createDeliveryPackage';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'));
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('CREATE_DELIVERY_PACKAGE'), i18n_1.default.__('DELIVERY_PACKAGE_CREATED_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'createDeliveryPackage';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
    catch (error) {
        const source = 'createDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllDeliveryPackages = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackages = await deliveryPackageModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGES_RETRIEVED_SUCCESSFULLY'), deliveryPackages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getAllDeliveryPackages';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getDeliveryPackageById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const deliveryPackage = await deliveryPackageModel.getOne(deliveryPackageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_RETRIEVED_SUCCESSFULLY'), deliveryPackage);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getDeliveryPackageById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.updateDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const deliveryPackageData = req.body;
        const user = await (0, authHandler_1.default)(req, res);
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
        const updatedDeliveryPackage = await deliveryPackageModel.updateOne(deliveryPackageData, deliveryPackageId, user);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'), updatedDeliveryPackage);
        notificationModel.createNotification('updateDeliveryPackage', i18n_1.default.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'), null, user);
        const auditUser = await (0, authHandler_1.default)(req, res);
        const action = 'updateDeliveryPackage';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('DELIVERY_PACKAGE_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'updateDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deleteDeliveryPackage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const deliveryPackageId = req.params.id;
        const user = await (0, authHandler_1.default)(req, res);
        const deletedDeliveryPackage = await deliveryPackageModel.deleteOne(deliveryPackageId, user);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'), deletedDeliveryPackage);
        notificationModel.createNotification('deleteDeliveryPackage', i18n_1.default.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'), null, user);
        const action = 'deleteDeliveryPackage';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'));
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('DELETE_DELIVERY_PACKAGE'), i18n_1.default.__('DELIVERY_PACKAGE_DELETED_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'deleteDeliveryPackage';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'deleteDeliveryPackage';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getUserDeliveryPackages = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { status } = req.query;
        const user = await (0, authHandler_1.default)(req, res);
        const deliveryPackages = await deliveryPackageModel.getPackagesByUser(user, status);
        responsesHandler_1.default.success(res, i18n_1.default.__('DELIVERY_PACKAGES_FETCHED_SUCCESSFULLY'), deliveryPackages);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getUserDeliveryPackages';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=delivery.package.controller.js.map