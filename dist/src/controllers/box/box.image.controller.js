"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxImage = exports.updateBoxImage = exports.getBoxImageById = exports.getAllBoxImages = exports.createBoxImage = void 0;
const box_image_model_1 = __importDefault(require("../../models/box/box.image.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const boxImageModel = new box_image_model_1.default();
exports.createBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newBoxImage = req.body;
        const createdBoxImage = await boxImageModel.createBoxImage(newBoxImage);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_CREATED_SUCCESSFULLY'), createdBoxImage);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_IMAGE_CREATION_FAILED'), error.message);
    }
});
exports.getAllBoxImages = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const { date, deliveryPackageId, boxId } = req.query;
        const boxImages = await boxImageModel.getMany({
            date: date,
            deliveryPackageId: deliveryPackageId
                ? Number(deliveryPackageId)
                : undefined,
            boxId: boxId,
        });
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_IMAGES_RETRIEVAL_FAILED'), error.message);
    }
});
exports.getBoxImageById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const { id } = req.params;
        const { date, deliveryPackageId, boxId } = req.query;
        const boxImage = await boxImageModel.getOne({
            id: Number(id),
            date: date,
            deliveryPackageId: deliveryPackageId
                ? Number(deliveryPackageId)
                : undefined,
            boxId: boxId,
        });
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'), boxImage);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_IMAGE_RETRIEVAL_FAILED'), error.message);
    }
});
exports.updateBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const { id } = req.params;
        const boxImageData = req.body;
        const updatedBoxImage = await boxImageModel.updateOne(boxImageData, Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'), updatedBoxImage);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_IMAGE_UPDATE_FAILED'), error.message);
    }
});
exports.deleteBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxImageId = req.params.id;
        const deletedBoxImage = await boxImageModel.deleteOne(Number(boxImageId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_DELETED_SUCCESSFULLY'), deletedBoxImage);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_IMAGE_DELETION_FAILED'), error.message);
    }
});
//# sourceMappingURL=box.image.controller.js.map