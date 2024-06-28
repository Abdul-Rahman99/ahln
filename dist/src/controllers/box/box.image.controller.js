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
    const newBoxImage = req.body;
    const createdBoxImage = await boxImageModel.createBoxImage(newBoxImage);
    responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_CREATED_SUCCESSFULLY'), createdBoxImage);
});
exports.getAllBoxImages = (0, asyncHandler_1.default)(async (req, res) => {
    const boxImages = await boxImageModel.getMany();
    responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'), boxImages);
});
exports.getBoxImageById = (0, asyncHandler_1.default)(async (req, res) => {
    const boxImageId = req.params.id;
    const boxImage = await boxImageModel.getOne(parseInt(boxImageId, 10));
    responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'), boxImage);
});
exports.updateBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    const boxImageId = req.params.id;
    const boxImageData = req.body;
    const updatedBoxImage = await boxImageModel.updateOne(boxImageData, parseInt(boxImageId, 10));
    responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'), updatedBoxImage);
});
exports.deleteBoxImage = (0, asyncHandler_1.default)(async (req, res) => {
    const boxImageId = req.params.id;
    const deletedBoxImage = await boxImageModel.deleteOne(parseInt(boxImageId, 10));
    responsesHandler_1.default.success(res, i18n_1.default.__('BOX_IMAGE_DELETED_SUCCESSFULLY'), deletedBoxImage);
});
//# sourceMappingURL=box.image.controller.js.map