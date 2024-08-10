"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLiveStreamImage = exports.uploadImage = exports.liveStream = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const uploadSingleImage_1 = require("../../middlewares/uploadSingleImage");
const handleLiveStreamImage_1 = require("../../middlewares/handleLiveStreamImage");
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
exports.liveStream = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        (0, handleLiveStreamImage_1.handleLiveStream)('image')(req, res, async (err) => {
            if (err) {
                const source = 'liveStream';
                systemLog.createSystemLog(user, err.message, source);
                return responsesHandler_1.default.badRequest(res, err.message);
            }
            if (!req.file) {
                const source = 'liveStream';
                systemLog.createSystemLog(user, err.message, source);
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_FILE_PROVIDED'));
            }
            responsesHandler_1.default.success(res, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), {
                file: req.file,
            });
        });
    }
    catch (error) {
        const source = 'liveStream';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.uploadImage = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, async (err) => {
            if (err) {
                const source = 'uploadImage';
                systemLog.createSystemLog(user, err.message, source);
                return responsesHandler_1.default.badRequest(res, err.message);
            }
            if (!req.file) {
                const source = 'uploadImage';
                systemLog.createSystemLog(user, err.message, source);
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_FILE_PROVIDED'));
            }
            responsesHandler_1.default.success(res, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), {
                file: req.file,
            });
        });
    }
    catch (error) {
        const source = 'uploadImage';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getLiveStreamImage = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const image = process.env.BASE_URL + '/uploads/liveImage-' + req.params.id + '.png';
        responsesHandler_1.default.success(res, i18n_1.default.__('LIVE_IMAGE_RETRIVED_SUCCESSFULLY'), image);
    }
    catch (error) {
        const source = 'getLiveStreamImage';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=image.controller.js.map