"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTabletId = exports.assignTabletToBox = exports.getBoxByTabletInfo = exports.getBoxesByGenerationId = exports.deleteBox = exports.updateBox = exports.getBoxById = exports.getAllBoxes = exports.createBox = void 0;
const box_model_1 = __importDefault(require("../../models/box/box.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const boxModel = new box_model_1.default();
exports.createBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const newBox = req.body;
        const boxExist = await boxModel.boxExistsSerialNumber(newBox.serial_number);
        if (boxExist) {
            const source = 'createBox';
            systemLog.createSystemLog(user, i18n_1.default.__('BOX_ALREADY_EXISTS'), source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('BOX_ALREADY_EXISTS'));
        }
        const createdBox = await boxModel.createBox(newBox);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_CREATED_SUCCESSFULLY'), createdBox);
        const action = 'createBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllBoxes = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxes = await boxModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getAllBoxes';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxId = req.params.id;
        const box = await boxModel.getOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        const source = 'getBoxById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxId = req.params.id;
        const boxData = req.body;
        const updatedBox = await boxModel.updateOne(boxData, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_UPDATED_SUCCESSFULLY'), updatedBox);
        const action = 'updateBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxId = req.params.id;
        const deletedBox = await boxModel.deleteOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_DELETED_SUCCESSFULLY'), deletedBox);
        const action = 'deleteBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deleteBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxesByGenerationId = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxGenerationId = req.params.generationId;
        const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        const source = 'getBoxesByGenerationId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxByTabletInfo = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { androidTabletId, tabletSerialNumber } = req.body;
        const box = await boxModel.getBoxByTabletInfo(androidTabletId, tabletSerialNumber);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        const source = 'getBoxByTabletInfo';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.assignTabletToBox = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { tabletId, boxId } = req.body;
        const assignTabletToBox = await boxModel.assignTabletToBox(tabletId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'), assignTabletToBox);
        const action = 'assignTabletToBox';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'assignTabletToBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.resetTabletId = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { tabletId, boxId } = req.body;
        const resetedTablte = await boxModel.resetTabletId(tabletId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'), resetedTablte);
        const action = 'resetTabletId';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'resetTabletId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=box.controller.js.map