"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRole = exports.removePermissionFromRole = exports.assignPermissionToRole = void 0;
const role_permission_model_1 = __importDefault(require("../../models/users/role.permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const systemLog = new system_log_model_1.default();
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const rolePermissionModel = new role_permission_model_1.default();
const assignPermissionToRole = async (req, res, next) => {
    try {
        const { role_id, permission_id } = req.body;
        const isAssigned = await rolePermissionModel.checkPermissionAssignment(role_id, permission_id);
        if (isAssigned) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'assignPermissionToRole';
            systemLog.createSystemLog(user, 'Role Already Assigned To User', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('ROLE_ALREADY_ASSIGNED_TO_USER'));
        }
        await rolePermissionModel.assignPermission(role_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLE_ASSIGNED_SUCCESSFULLY'), role_id);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'assignPermissionToRole';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('ROLE_ASSIGNED_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'assignPermissionToRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.assignPermissionToRole = assignPermissionToRole;
const removePermissionFromRole = async (req, res, next) => {
    try {
        const { role_id, permission_id } = req.body;
        const isAssigned = await rolePermissionModel.checkPermissionAssignment(role_id, permission_id);
        if (!isAssigned) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'removePermissionFromRole';
            systemLog.createSystemLog(user, 'Permission Not Assigned To User', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_NOT_ASSIGNED_TO_USER'));
        }
        await rolePermissionModel.revokePermission(role_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'), role_id);
        const auditUser = await (0, authHandler_1.default)(req, res, next);
        const action = 'removePermissionFromRole';
        auditTrail.createAuditTrail(auditUser, action, i18n_1.default.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'));
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'removePermissionFromRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
const getPermissionsByRole = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        if (!roleId) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('ROLE_ID_REQUIRED'));
        }
        const roleIdNumber = Number(roleId);
        if (isNaN(roleIdNumber)) {
            const user = await (0, authHandler_1.default)(req, res, next);
            const source = 'getPermissionsByRole';
            systemLog.createSystemLog(user, 'Role Id Must Be Valid Number', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('ROLE_ID_MUST_BE_VALID_NUMBER'));
        }
        const permissions = await rolePermissionModel.getPermissionsByRole(roleIdNumber);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        const user = await (0, authHandler_1.default)(req, res, next);
        const source = 'getPermissionsByRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_ROLE_RETRIVED_FAILED'));
        next(error);
    }
};
exports.getPermissionsByRole = getPermissionsByRole;
//# sourceMappingURL=role.permission.controller.js.map