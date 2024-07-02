"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBoxByTabletInfo = exports.getBoxesByGenerationId = exports.deleteBox = exports.updateBox = exports.getBoxById = exports.getAllBoxes = exports.createBox = void 0;
const box_model_1 = __importDefault(require("../../models/box/box.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const boxModel = new box_model_1.default();
exports.createBox = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newBox = req.body;
        const createdBox = await boxModel.createBox(newBox);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_CREATED_SUCCESSFULLY'), createdBox);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_CREATION_FAILED'), error.message);
    }
});
exports.getAllBoxes = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxes = await boxModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOXES_RETRIEVAL_FAILED'), error.message);
    }
});
exports.getBoxById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.params.id;
        const box = await boxModel.getOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_RETRIEVAL_FAILED'), error.message);
    }
});
exports.updateBox = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.params.id;
        const boxData = req.body;
        const updatedBox = await boxModel.updateOne(boxData, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_UPDATED_SUCCESSFULLY'), updatedBox);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_UPDATE_FAILED'), error.message);
    }
});
exports.deleteBox = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxId = req.params.id;
        const deletedBox = await boxModel.deleteOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_DELETED_SUCCESSFULLY'), deletedBox);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOX_DELETION_FAILED'), error.message);
    }
});
exports.getBoxesByGenerationId = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxGenerationId = req.params.generationId;
        const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, i18n_1.default.__('BOXES_GENERATION_FETCH_FAILED'), error.message);
    }
});
exports.getBoxByTabletInfo = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const { androidTabletId, tabletSerialNumber } = req.body;
        const box = await boxModel.getBoxByTabletInfo(androidTabletId, tabletSerialNumber);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('ADDRESS_RETRIEVAL_FAILED'), error.message);
    }
});
//# sourceMappingURL=box.controller.js.map