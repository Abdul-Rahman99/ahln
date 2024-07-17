"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const uploadSingleImage_1 = require("../../middlewares/uploadSingleImage");
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
exports.uploadImage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, async (err) => {
            if (err) {
                const user = await (0, authHandler_1.default)(req, res, next);
                const source = 'uploadImage';
                systemLog.createSystemLog(user, err.message, source);
                return responsesHandler_1.default.badRequest(res, err.message);
            }
            if (!req.file) {
                const user = await (0, authHandler_1.default)(req, res, next);
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
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'uploadImage';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=image.controller.js.map