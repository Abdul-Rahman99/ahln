"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrackingNumberAndUpdateStatus = exports.checkOTP = exports.getOTPsByUser = exports.deleteOTP = exports.getOTPById = exports.getAllOTPs = exports.createOTP = void 0;
const otp_model_1 = __importDefault(require("../../models/delivery/otp.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const user_model_1 = __importDefault(require("../../models/users/user.model"));
const userModel = new user_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
const systemLog = new system_log_model_1.default();
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const otpModel = new otp_model_1.default();
exports.createOTP = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const newOTP = req.body;
        const delivery_package_id = req.body.delivery_package_id;
        const createdOTP = await otpModel.createOTP(newOTP, delivery_package_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), createdOTP);
        notificationModel.createNotification('createOTP', i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), null, user);
        const action = 'createOTP';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createOTP';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllOTPs = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const otps = await otpModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        const source = 'getAllOPTs';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.getOTPById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const otpId = req.params.id;
        const otp = await otpModel.getOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
    }
    catch (error) {
        const source = 'getOTPById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteOTP = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const otpId = req.params.id;
        const deletedOTP = await otpModel.deleteOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'), deletedOTP);
        notificationModel.createNotification('deleteOTP', i18n_1.default.__('OTP_DELTED_SUCCESSFULLY'), null, user);
        const action = 'deleteOTP';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'));
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('DELETE_OTP'), i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'deleteOTP';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
    catch (error) {
        const source = 'deleteOTP';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getOTPsByUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const otps = await otpModel.getOTPsByUser(user);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        const source = 'getOPTsByUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.checkOTP = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const { otp, delivery_package_id, boxId } = req.body;
        const verifiedOTP = await otpModel.checkOTP(otp, delivery_package_id, boxId);
        const user = await userModel.findUserByBoxId(req.body.boxId);
        if (verifiedOTP) {
            responsesHandler_1.default.success(res, i18n_1.default.__('OTP_VERIFIED_SUCCESSFULLY'), {
                box_locker_string: verifiedOTP[0],
                otp: verifiedOTP[1],
            });
            notificationModel.createNotification('checkOTP', i18n_1.default.__('OTP_VERIFIED_SUCCESSFULLY'), null, user);
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_OTP'), i18n_1.default.__('OTP_VERIFIED_SUCCESSFULLY'));
            }
            catch (error) {
                const source = 'checkOTP';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
        }
        else {
            const source = 'checkOTP';
            systemLog.createSystemLog(user, 'Invalid Otp', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'), null);
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_OTP'), i18n_1.default.__('INVALID_OTP'));
            }
            catch (error) {
                const source = 'checkOTP';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
        }
    }
    catch (error) {
        const user = await userModel.findUserByBoxId(req.body.boxId);
        const source = 'checkOTP';
        systemLog.createSystemLog(user, error.message, source);
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_OTP'), i18n_1.default.__('INVALID_OTP'));
        }
        catch (error) {
            const source = 'checkOTP';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.checkTrackingNumberAndUpdateStatus = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const trackingNumber = req.body.trackingNumber.toLowerCase();
        const boxId = req.body.boxId;
        const user = await userModel.findUserByBoxId(req.body.boxId);
        if (!trackingNumber) {
            const source = 'checkTrackingNumberAndUpdateStatus';
            systemLog.createSystemLog(user, 'Tracking number Required', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('TRACKING_NUMBER_REQUIRED'));
            return;
        }
        const result = await otpModel.checkTrackingNumberAndUpdateStatus(trackingNumber, boxId);
        if (result) {
            responsesHandler_1.default.success(res, i18n_1.default.__('PACKAGE_UPDATED_SUCCESSFULLY'), {
                box_locker_string: result[0],
                pin: result[1],
                otp: result[2],
            });
            notificationModel.createNotification('checkTrackingNumberAndUpdateStatus', i18n_1.default.__('PACKAGE_UPDATED_SUCCESSFULLY'), null, user);
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_TRACKING_NUMBER'), i18n_1.default.__('TRACKING_NUMBER_VERIFIED_SUCCESSFULLY'));
            }
            catch (error) {
                const source = 'checkTrackingNumberAndUpdateStatus';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
        }
        else {
            const source = 'checkTrackingNumberAndUpdateStatus';
            systemLog.createSystemLog(user, 'Invalid Otp', source);
            const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
            try {
                notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_TRACKING_NUMBER'), i18n_1.default.__('PACKAGE_ALREADY_DELIVERED'));
            }
            catch (error) {
                const source = 'checkTrackingNumberAndUpdateStatus';
                systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
            }
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'), null);
        }
    }
    catch (error) {
        const user = await userModel.findUserByBoxId(req.body.boxId);
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(user, error.message, source);
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(user);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('CHECK_TRACKING_NUMBER'), i18n_1.default.__('PACKAGE_ID_INVALID'));
        }
        catch (error) {
            const source = 'checkTrackingNumberAndUpdateStatus';
            systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=otp.controller.js.map