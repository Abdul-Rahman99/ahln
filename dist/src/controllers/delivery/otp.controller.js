"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrackingNumberAndUpdateStatus = exports.checkOTP = exports.getOTPsByUser = exports.deleteOTP = exports.getOTPById = exports.getAllOTPs = exports.createOTP = void 0;
const otp_model_1 = __importDefault(require("../../models/delivery/otp.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const database_1 = __importDefault(require("../../config/database"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../../models/logs/notification.model"));
const user_devices_model_1 = __importDefault(require("../../models/users/user.devices.model"));
const userDevicesModel = new user_devices_model_1.default();
const systemLog = new system_log_model_1.default();
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const otpModel = new otp_model_1.default();
exports.createOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newOTP = req.body;
        const delivery_package_id = req.body.delivery_package_id;
        const createdOTP = await otpModel.createOTP(newOTP, delivery_package_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), createdOTP);
        const user = await (0, authHandler_1.default)(req, res, next);
        notificationModel.createNotification('createOTP', i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), null, user);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'createOTP';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createOTP';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllOTPs = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const otps = await otpModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllOPTs';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.internalError(res, error.message);
        next(error);
    }
});
exports.getOTPById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const otpId = req.params.id;
        const otp = await otpModel.getOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getOTPById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deleteOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const otpId = req.params.id;
        const deletedOTP = await otpModel.deleteOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'), deletedOTP);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        notificationModel.createNotification('deleteOTP', i18n_1.default.__('OTP_DELTED_SUCCESSFULLY'), null, auditUser);
        const action = 'deleteOTP';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'));
        const fcmToken = await userDevicesModel.getFcmTokenDevicesByUser(auditUser);
        try {
            notificationModel.pushNotification(fcmToken, i18n_1.default.__('DELETE_OTP'), i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'));
        }
        catch (error) {
            const source = 'deleteOTP';
            systemLog.createSystemLog(auditUser, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
        }
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteOTP';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getOTPsByUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userId = await (0, authHandler_1.default)(req, res, next);
        const otps = await otpModel.getOTPsByUser(userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getOPTsByUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.checkOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { otp, delivery_package_id, boxId } = req.body;
        const verifiedOTP = await otpModel.checkOTP(otp, delivery_package_id, boxId);
        const connection = await database_1.default.connect();
        const userResult = await connection.query('SELECT User_Box.user_id FROM Box INNER JOIN User_Box ON Box.id = User_Box.box_id WHERE Box.id = $1', [boxId]);
        connection.release();
        const user = userResult.rows[0].user_id;
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
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'checkOTP';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.checkTrackingNumberAndUpdateStatus = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const trackingNumber = req.body.trackingNumber.toLowerCase();
        const boxId = req.body.boxId;
        if (!trackingNumber) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'checkTrackingNumberAndUpdateStatus';
            systemLog.createSystemLog(user, 'Tracking number Required', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('TRACKING_NUMBER_REQUIRED'));
            return;
        }
        const result = await otpModel.checkTrackingNumberAndUpdateStatus(trackingNumber, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('PACKAGE_UPDATED_SUCCESSFULLY'), {
            box_locker_string: result[0],
            pin: result[1],
            otp: result[2],
        });
        const user = await (0, authHandler_1.default)(req, res, next);
        notificationModel.createNotification('checkTrackingNumberAndUpdateStatus', i18n_1.default.__('PACKAGE_UPDATED_SUCCESSFULLY'), null, user);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=otp.controller.js.map