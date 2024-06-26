"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTablet = exports.updateTablet = exports.getTabletById = exports.getAllTablets = exports.createTablet = void 0;
const tablet_model_1 = __importDefault(require("../../models/box/tablet.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const tabletModel = new tablet_model_1.default();
exports.createTablet = (0, asyncHandler_1.default)(async (req, res) => {
    const newTablet = req.body;
    const createdTablet = await tabletModel.createTablet(newTablet);
    res.status(201).json({
        success: true,
        message: i18n_1.default.__('TABLET_CREATED_SUCCESSFULLY'),
        data: createdTablet,
    });
});
exports.getAllTablets = (0, asyncHandler_1.default)(async (req, res) => {
    const tablets = await tabletModel.getMany();
    res.json({ success: true, data: tablets });
});
exports.getTabletById = (0, asyncHandler_1.default)(async (req, res) => {
    const tabletId = req.params.id;
    const tablet = await tabletModel.getOne(tabletId);
    res.json({ success: true, tablet });
});
exports.updateTablet = (0, asyncHandler_1.default)(async (req, res) => {
    const tabletId = req.params.id;
    const tabletData = req.body;
    const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
    res.json({
        message: i18n_1.default.__('TABLET_UPDATED_SUCCESSFULLY'),
        data: updatedTablet,
        success: true,
    });
});
exports.deleteTablet = (0, asyncHandler_1.default)(async (req, res) => {
    const tabletId = req.params.id;
    const deletedTablet = await tabletModel.deleteOne(tabletId);
    res.json({
        message: i18n_1.default.__('TABLET_DELETED_SUCCESSFULLY'),
        data: deletedTablet,
        success: true,
    });
});
//# sourceMappingURL=tablet.controller.js.map