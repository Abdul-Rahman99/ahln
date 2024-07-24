"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByUser = exports.removePermissionFromUser = exports.assignPermissionToUser = void 0;
const user_permission_model_1 = __importDefault(require("../../models/users/user.permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const systemLog = new system_log_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const userPermissionModel = new user_permission_model_1.default();
const assignPermissionToUser = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (isAssigned) {
            const source = 'assignPermissionToUser';
            systemLog.createSystemLog(user, 'Permission Already Assigned', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_ALREADY_ASSIGNED_TO_USER'));
        }
        await userPermissionModel.assignPermission(user_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_ASSIGNED_TO_USER_SUCCESSFULLY'), user_id);
        const action = 'assignPermissionToUser';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PERMISSION_ASSIGNED_TO_USER_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'assignPermissionToUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.assignPermissionToUser = assignPermissionToUser;
const removePermissionFromUser = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (!isAssigned) {
            const source = 'removePermissionFromUser';
            systemLog.createSystemLog(user, 'Permission Not Assigned to user', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_IS_NOT_ASSIGNED_TO_USER'));
        }
        await userPermissionModel.revokePermission(user_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'), user_id);
        const action = 'removePermissionFromUser';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'removePermissionFromUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.removePermissionFromUser = removePermissionFromUser;
const getPermissionsByUser = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { userId } = req.params;
        const permissions = await userPermissionModel.getPermissionsByUserId(userId);
        if (permissions.length === 0) {
            const source = 'getPermissionsByUser';
            systemLog.createSystemLog(user, 'No Permissions Founf For User', source);
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_PERMISSION_FOUND_FOR_USER'), userId);
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_BY_USER_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        const source = 'getPermissionsByUser';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getPermissionsByUser = getPermissionsByUser;
//# sourceMappingURL=user.permission.controller.js.map