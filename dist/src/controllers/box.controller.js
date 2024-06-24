"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBox = exports.updateBox = exports.getBoxById = exports.getAllBoxes = exports.createBox = void 0;
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const box_model_1 = __importDefault(require("../models/box.model"));
const i18n_1 = __importDefault(require("../config/i18n"));
const boxModel = new box_model_1.default();
exports.createBox = (0, asyncHandler_1.default)(async (req, res) => {
    const box = req.body;
    const newBox = await boxModel.create(box);
    res.status(201).json({
        message: i18n_1.default.__('BOX_CREATED_SUCCESS'),
        data: newBox,
    });
});
exports.getAllBoxes = (0, asyncHandler_1.default)(async (req, res) => {
    const boxes = await boxModel.getMany();
    res.json(boxes);
});
exports.getBoxById = (0, asyncHandler_1.default)(async (req, res) => {
    const boxId = req.params.id;
    const box = await boxModel.getOne(boxId);
    res.json(box);
});
exports.updateBox = (0, asyncHandler_1.default)(async (req, res) => {
    const boxId = req.params.id;
    const boxData = req.body;
    const updatedBox = await boxModel.updateOne(boxData, boxId);
    res.json({
        message: i18n_1.default.__('BOX_UPDATED_SUCCESS'),
        data: updatedBox,
    });
});
exports.deleteBox = (0, asyncHandler_1.default)(async (req, res) => {
    const boxId = req.params.id;
    const deletedBox = await boxModel.deleteOne(boxId);
    res.json({
        message: i18n_1.default.__('BOX_DELETED_SUCCESS'),
        data: deletedBox,
    });
});
//# sourceMappingURL=box.controller.js.map