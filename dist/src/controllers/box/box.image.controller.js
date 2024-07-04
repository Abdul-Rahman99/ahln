"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoxImagesByPackageId = exports.getBoxImagesByBoxId = exports.deleteBoxImage = exports.updateBoxImage = exports.getBoxImageById = exports.getAllBoxImages = exports.uploadBoxImage = void 0;
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const box_image_model_1 = __importDefault(require("../../models/box/box.image.model"));
const uploadSingleImage_1 = require("../../middlewares/uploadSingleImage");
const boxImageModel = new box_image_model_1.default();
exports.uploadBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    (0, uploadSingleImage_1.uploadSingleImage)('image')(req, res, async (err) => {
        if (err) {
            return responsesHandler_1.default.badRequest(res, err.message);
        }
        if (!req.file) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_FILE_PROVIDED'));
        }
        const { boxId, deliveryPackageId } = req.body;
        const imageName = req.file.filename;
        try {
            const createdBoxImage = await boxImageModel.createBoxImage(boxId, deliveryPackageId, imageName);
            responsesHandler_1.default.success(res, i18n_1.default.__('IMAGE_UPLOADED_SUCCESSFULLY'), createdBoxImage);
        }
        catch (error) {
            responsesHandler_1.default.badRequest(res, error.message);
        }
    });
});
exports.getAllBoxImages = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxImages = await boxImageModel.getAllBoxImages();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxImageById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxImageId = parseInt(req.params.id, 10);
        const boxImage = await boxImageModel.getBoxImageById(boxImageId);
        if (!boxImage) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('BOX_IMAGE_NOT_FOUND'));
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'), boxImage);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxImageId = parseInt(req.params.id, 10);
        const { boxId, deliveryPackageId } = req.body;
        const imageName = req.file ? req.file.filename : req.body.image;
        const updatedBoxImage = await boxImageModel.updateBoxImage(boxImageId, boxId, deliveryPackageId, imageName);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'), updatedBoxImage);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxImageId = parseInt(req.params.id, 10);
        await boxImageModel.deleteBoxImage(boxImageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxImagesByBoxId = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.params.boxId;
        const boxImages = await boxImageModel.getBoxImagesByBoxId(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxImagesByPackageId = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const packageId = req.params.packageId;
        const boxImages = await boxImageModel.getBoxImagesByPackageId(packageId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=box.image.controller.js.map