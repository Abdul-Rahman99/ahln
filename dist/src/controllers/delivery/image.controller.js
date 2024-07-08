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
exports.uploadImage = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, (err) => {
            if (err) {
                return responsesHandler_1.default.badRequest(res, err.message);
            }
            if (!req.file) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_FILE_PROVIDED'));
            }
            responsesHandler_1.default.success(res, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), {
                file: req.file,
            });
        });
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=image.controller.js.map