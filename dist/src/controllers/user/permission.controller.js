"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const permission_model_1 = __importDefault(require("../../models/users/permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const systemLog = new system_log_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const permissionModel = new permission_model_1.default();
const createPermission = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { title, description } = req.body;
        const permission = await permissionModel.create(title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_CREATED_SUCCESSFULLY'), permission);
        const action = 'createPermission';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PERMISSION_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createPermission';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.createPermission = createPermission;
const getAllPermissions = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const permissions = await permissionModel.getAll();
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        const source = 'getAllPermissions';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getAllPermissions = getAllPermissions;
const getPermissionById = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const permission = await permissionModel.getById(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permission);
    }
    catch (error) {
        const source = 'getPermissionById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getPermissionById = getPermissionById;
const updatePermission = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const permission = await permissionModel.update(Number(id), title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_UPDATED_SUCCESSFULLY'), permission);
        const action = 'updatePermission';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PERMISSION_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updatePermission';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.updatePermission = updatePermission;
const deletePermission = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const permission = await permissionModel.delete(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_DELETED_SUCCESSFULLY'), permission);
        const action = 'deletePermission';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PERMISSION_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deletePermission';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.deletePermission = deletePermission;
//# sourceMappingURL=permission.controller.js.map