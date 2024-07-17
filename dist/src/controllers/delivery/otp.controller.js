"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTrackingNumberAndUpdateStatus = exports.checkOTP = exports.getOTPsByUser = exports.deleteOTP = exports.updateOTP = exports.getOTPById = exports.getAllOTPs = exports.createOTP = void 0;
const otp_model_1 = __importDefault(require("../../models/delivery/otp.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
const otpModel = new otp_model_1.default();
exports.createOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newOTP = req.body;
        const delivery_package_id = req.body.delivery_package_id;
        const createdOTP = await otpModel.createOTP(newOTP, delivery_package_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), createdOTP);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createOTP';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
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
        next(error);
        responsesHandler_1.default.internalError(res, error.message);
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
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const otpId = req.params.id;
        const otpData = req.body;
        const updatedOTP = await otpModel.updateOne(otpData, Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_UPDATED_SUCCESSFULLY'), updatedOTP);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateOPT';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const otpId = req.params.id;
        const deletedOTP = await otpModel.deleteOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'), deletedOTP);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteOTP';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getOTPsByUser = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const otps = await otpModel.getOTPsByUser(userId);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getOPTsByUser';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.checkOTP = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { otp, delivery_package_id, boxId } = req.body;
        const verifiedOTP = await otpModel.checkOTP(otp, delivery_package_id, boxId);
        if (verifiedOTP) {
            responsesHandler_1.default.success(res, i18n_1.default.__('OTP_VERIFIED_SUCCESSFULLY'), {
                box_locker_string: verifiedOTP,
            });
        }
        else {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'checkOTP';
            systemLog.createSystemLog(user, 'Invalid Otp', source);
            responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'), null);
        }
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'checkOTP';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
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
        });
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'checkTrackingNumberAndUpdateStatus';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=otp.controller.js.map