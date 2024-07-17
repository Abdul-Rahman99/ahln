"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBoxGeneration = exports.updateBoxGeneration = exports.getBoxGenerationById = exports.getAllBoxGenerations = exports.createBoxGeneration = void 0;
const box_generation_model_1 = __importDefault(require("../../models/box/box.generation.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
const boxGenerationModel = new box_generation_model_1.default();
exports.createBoxGeneration = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const newBoxGeneration = req.body;
        const createdBoxGeneration = await boxGenerationModel.createBoxGeneration(newBoxGeneration);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_GENERATION_CREATED_SUCCESSFULLY'), createdBoxGeneration);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'createBoxGeneration';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_GENERATION_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'createBoxGeneration';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllBoxGenerations = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxGenerations = await boxGenerationModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_GENERATIONS_RETRIEVED_SUCCESSFULLY'), boxGenerations);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getAllBoxGeneration';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxGenerationById = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxGenerationId = req.params.id;
        const boxGeneration = await boxGenerationModel.getOne(boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_GENERATION_RETRIEVED_SUCCESSFULLY'), boxGeneration);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getBoxGenerationById';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateBoxGeneration = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxGenerationId = req.params.id;
        const boxGenerationData = req.body;
        const updatedBoxGeneration = await boxGenerationModel.updateOne(boxGenerationData, boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'), updatedBoxGeneration);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'updateBoxGeneration';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'updateBoxGeneration';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteBoxGeneration = (0, asyncHandler_1.default)(async (req, res, next) => {
    try {
        const boxGenerationId = req.params.id;
        const deletedBoxGeneration = await boxGenerationModel.deleteOne(boxGenerationId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_GENERATION_DELETED_SUCCESSFULLY'), deletedBoxGeneration);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'deleteBoxGeneration';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('BOX_GENERATION_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'deleteBoxGeneration';
        systemLog.createSystemLog(user, error.message, source);
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=box.generation.controller.js.map