"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTablet = exports.updateTablet = exports.getTabletById = exports.getAllTablets = exports.createTablet = void 0;
const tablet_model_1 = __importDefault(require("../../models/box/tablet.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const tabletModel = new tablet_model_1.default();
exports.createTablet = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const newTablet = req.body;
        const createdTablet = await tabletModel.createTablet(newTablet);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_CREATED_SUCCESSFULLY'), createdTablet);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_CREATION_FAILED'), error.message);
    }
});
exports.getAllTablets = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const tablets = await tabletModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLETS_RETRIEVED_SUCCESSFULLY'), tablets);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLETS_RETRIEVAL_FAILED'), error.message);
    }
});
exports.getTabletById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const tabletId = req.params.id;
        const tablet = await tabletModel.getOne(tabletId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_RETRIEVED_SUCCESSFULLY'), tablet);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_RETRIEVAL_FAILED'), error.message);
    }
});
exports.updateTablet = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const tabletId = req.params.id;
        const tabletData = req.body;
        const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_UPDATED_SUCCESSFULLY'), updatedTablet);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_UPDATE_FAILED'), error.message);
    }
});
exports.deleteTablet = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const tabletId = req.params.id;
        const deletedTablet = await tabletModel.deleteOne(tabletId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_DELETED_SUCCESSFULLY'), deletedTablet);
    }
    catch (error) {
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_DELETION_FAILED'), error.message);
    }
});
//# sourceMappingURL=tablet.controller.js.map