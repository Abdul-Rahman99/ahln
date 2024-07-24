"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPaymentsByUser = exports.deletePayment = exports.updatePayment = exports.getPaymentById = exports.getAllPayments = exports.createPayment = void 0;
const payment_model_1 = __importDefault(require("../../models/payment/payment.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const card_model_1 = __importDefault(require("../../models/payment/card.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const userDevicesModel = new user_devices_model_1.default();
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const cardModel = new card_model_1.default();
const paymentModel = new payment_model_1.default();
const parseBillingDate = (dateString) => {
    const [month, day, year] = dateString.split('-');
    const date = new Date(`${year}-${month}-${day}`);
    return isNaN(date.getTime()) ? null : date;
};
exports.createPayment = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const newPayment = req.body;
        const billingDate = parseBillingDate(newPayment.billing_date);
        if (!billingDate) {
            const source = 'createPayment';
            systemLog.createSystemLog(user, 'Invalid Billing Date Format', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_BILLING_DATE_FORMAT'));
        }
        newPayment.billing_date = billingDate;
        const card = await cardModel.getCardById(newPayment.card_id);
        if (!card) {
            throw new Error(`No Card Found, please add a card`);
        }
        const createdPayment = await paymentModel.createPayment(newPayment, user);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_CREATED_SUCCESSFULLY'), createdPayment);
        notificationModel.createNotification('checkOTP', i18n_1.default.__('OTP_VERIFIED_SUCCESSFULLY'), null, user);
        const action = 'createPayment';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PAYMENT_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createPayment';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllPayments = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const payments = await paymentModel.getAllPayments();
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'), payments);
    }
    catch (error) {
        const source = 'getAllPayments';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getPaymentById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const paymentId = parseInt(req.params.id, 10);
        if (isNaN(paymentId)) {
            const source = 'getPaymentById';
            systemLog.createSystemLog(user, 'Invalid Payment Id', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const payment = await paymentModel.getPaymentById(paymentId);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_RETRIEVED_SUCCESSFULLY'), payment);
    }
    catch (error) {
        const source = 'getPaymentById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updatePayment = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const paymentId = parseInt(req.params.id, 10);
        const user = await paymentModel.getUserByPayment(paymentId);
        if (isNaN(paymentId)) {
            const source = 'updatePayment';
            systemLog.createSystemLog(user, 'Invalid Payment Id', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const paymentData = req.body;
        if (paymentData.billing_date) {
            const billingDate = parseBillingDate(paymentData.billing_date);
            if (!billingDate) {
                const source = 'updatePayment';
                systemLog.createSystemLog(user, 'Invalid Billing Date Format', source);
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_BILLING_DATE_FORMAT'));
            }
            paymentData.billing_date = billingDate;
        }
        const updatedPayment = await paymentModel.updatePayment(paymentId, paymentData);
        if (updatedPayment) {
            responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_UPDATED_SUCCESSFULLY'), updatedPayment);
            notificationModel.createNotification('updatePayment', i18n_1.default.__('PAYMENT_UPDATED_SUCCESSFULLY'), null, user);
            const action = 'updatePayment';
            auditTrail.createAuditTrail(user, action, i18n_1.default.__('PAYMENT_UPDATED_SUCCESSFULLY'));
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('UPDATE_PAYMENT'), i18n_1.default.__('PAYMENT_SUCCESSFULLY_DONE'));
            }
            catch (error) {
                const source = 'updatePayment';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
        }
    }
    catch (error) {
        const source = 'updatePayment';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('UPDATE_PAYMENT'), i18n_1.default.__('PAYMENT_UNSUCCESSFULL'));
        }
        catch (error) {
            const source = 'updatePayment';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
});
exports.deletePayment = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const paymentId = parseInt(req.params.id, 10);
        if (isNaN(paymentId)) {
            const source = 'deletePayment';
            systemLog.createSystemLog(user, 'Invalid Payment Id', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_PAYMENT_ID'));
        }
        const deletedPayment = await paymentModel.deletePayment(paymentId);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENT_DELETED_SUCCESSFULLY'), deletedPayment);
        const action = 'deletePayment';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PAYMENT_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deletePayment';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getPaymentsByUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const payments = await paymentModel.getPaymentsByUser(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('PAYMENTS_RETRIEVED_SUCCESSFULLY'), payments);
    }
    catch (error) {
        const source = 'getPaymentsByUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=payment.controller.js.map