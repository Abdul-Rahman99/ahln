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
exports.createBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newBox = req.body;
        const boxExist = await boxModel.boxExists(newBox.serial_number);
        if (boxExist) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'createBox';
            systemLog.createSystemLog(user, i18n_1.default.__('BOX_ALREADY_EXISTS'), source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('BOX_ALREADY_EXISTS'));
        }
        const createdBox = await boxModel.createBox(newBox);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_CREATED_SUCCESSFULLY'), createdBox);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'createBox';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getAllBoxes = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxes = await boxModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllBoxes';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getBoxById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxId = req.params.id;
        const box = await boxModel.getOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getBoxById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.updateBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxId = req.params.id;
        const boxData = req.body;
        const updatedBox = await boxModel.updateOne(boxData, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_UPDATED_SUCCESSFULLY'), updatedBox);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'updateBox';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.deleteBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxId = req.params.id;
        const deletedBox = await boxModel.deleteOne(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_DELETED_SUCCESSFULLY'), deletedBox);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'deleteBox';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getBoxesByGenerationId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxGenerationId = req.params.generationId;
        const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOXES_RETRIEVED_SUCCESSFULLY'), boxes);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getBoxesByGenerationId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.getBoxByTabletInfo = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { androidTabletId, tabletSerialNumber } = req.body;
        const box = await boxModel.getBoxByTabletInfo(androidTabletId, tabletSerialNumber);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getBoxByTabletInfo';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.assignTabletToBox = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { tabletId, boxId } = req.body;
        const assignTabletToBox = await boxModel.assignTabletToBox(tabletId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'), assignTabletToBox);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'assignTabletToBox';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'assignTabletToBox';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
exports.resetTabletId = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const { tabletId, boxId } = req.body;
        const assignTabletToBox = await boxModel.resetTabletId(tabletId, boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'), assignTabletToBox);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'resetTabletId';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'resetTabletId';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
});
//# sourceMappingURL=box.controller.js.map