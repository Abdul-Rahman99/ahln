"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllLockersById = exports.deleteBoxLocker = exports.updateBoxLocker = exports.getBoxLockerById = exports.getAllBoxLockers = exports.createBoxLocker = void 0;
const box_locker_model_1 = __importDefault(require("../../models/box/box.locker.model"));
const asyncHandler_1 = __importDefault(require("../../middlewares/asyncHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const boxLockerModel = new box_locker_model_1.default();
exports.createBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const newBoxLocker = req.body;
        const createdBoxLocker = await boxLockerModel.createBoxLocker(newBoxLocker);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_CREATED_SUCCESSFULLY'), createdBoxLocker);
        const action = 'createBoxLocker';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_LOCKER_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createBoxLocker';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllBoxLockers = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxLockers = await boxLockerModel.getMany();
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'), boxLockers);
    }
    catch (error) {
        const source = 'getAllBoxLocker';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getBoxLockerById = (0, asyncHandler_1.default)(async (req, res) => {
    try {
        const boxLockerId = req.params.id;
        const boxLocker = await boxLockerModel.getOne(String(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_RETRIEVED_SUCCESSFULLY'), boxLocker);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'getBoxLockerById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.updateBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxLockerId = req.params.id;
        const boxLockerData = req.body;
        const updatedBoxLocker = await boxLockerModel.updateOne(boxLockerData, String(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_UPDATED_SUCCESSFULLY'), updatedBoxLocker);
        const action = 'updateBoxLocker';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_LOCKER_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateBoxLocker';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.deleteBoxLocker = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxLockerId = req.params.id;
        const deletedBoxLocker = await boxLockerModel.deleteOne(String(boxLockerId));
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKER_DELETED_SUCCESSFULLY'), deletedBoxLocker);
        const action = 'deleteBoxLocker';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('BOX_LOCKER_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deleteBoxLocker';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
exports.getAllLockersById = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const boxId = req.body.boxId;
        const boxLockers = await boxLockerModel.getAllLockersById(boxId);
        responsesHandler_1.default.success(res, i18n_1.default.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'), boxLockers);
    }
    catch (error) {
        const source = 'getAllBoxLockersById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
});
//# sourceMappingURL=box.locker.controller.js.map