"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOTP = exports.updateOTP = exports.getOTPById = exports.getAllOTPs = exports.createOTP = void 0;
const otp_model_1 = __importDefault(require("../../models/delivery/otp.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const otpModel = new otp_model_1.default();
exports.createOTP = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newOTP = req.body;
        const createdOTP = await otpModel.createOTP(newOTP);
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_CREATED_SUCCESSFULLY'), createdOTP);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('OTP_CREATION_FAILED'), error.message);
    }
});
exports.getAllOTPs = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const otps = await otpModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('OTPS_RETRIEVED_SUCCESSFULLY'), otps);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('OTPS_RETRIEVAL_FAILED'), error.message);
    }
});
exports.getOTPById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const otpId = req.params.id;
        const otp = await otpModel.getOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_RETRIEVED_SUCCESSFULLY'), otp);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('OTP_RETRIEVAL_FAILED'), error.message);
    }
});
exports.updateOTP = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const otpId = req.params.id;
        const otpData = req.body;
        const updatedOTP = await otpModel.updateOne(otpData, Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_UPDATED_SUCCESSFULLY'), updatedOTP);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('OTP_UPDATE_FAILED'), error.message);
    }
});
exports.deleteOTP = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const otpId = req.params.id;
        const deletedOTP = await otpModel.deleteOne(Number(otpId));
        responsesHandler_1.default.success(res, i18n_1.default.__('OTP_DELETED_SUCCESSFULLY'), deletedOTP);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('OTP_DELETION_FAILED'), error.message);
    }
});
//# sourceMappingURL=otp.controller.js.map