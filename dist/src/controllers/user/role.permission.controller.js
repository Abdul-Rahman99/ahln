"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRole = exports.removePermissionFromRole = exports.assignPermissionToRole = void 0;
const role_permission_model_1 = __importDefault(require("../../models/users/role.permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const rolePermissionModel = new role_permission_model_1.default();
const assignPermissionToRole = async (req, res, next) => {
    try {
        const { role_id, permission_id } = req.body;
        const isAssigned = await rolePermissionModel.checkPermissionAssignment(role_id, permission_id);
        if (isAssigned) {
            return responsesHandler_1.default.badRequest(res, i18n.__('ROLE_ALREADY_ASSIGNED_TO_USER'));
        }
        await rolePermissionModel.assignPermission(role_id, permission_id);
        responsesHandler_1.default.success(res, i18n.__('ROLE_ASSIGNED_SUCCESSFULLY'));
    }
    catch (error) {
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
            return responsesHandler_1.default.badRequest(res, i18n.__('PERMISSION_NOT_ASSIGNED_TO_USER'));
        }
        await rolePermissionModel.revokePermission(role_id, permission_id);
        responsesHandler_1.default.success(res, i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'));
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
const getPermissionsByRole = async (req, res, next) => {
    try {
        const { roleId } = req.params;
        if (!roleId) {
            return responsesHandler_1.default.badRequest(res, i18n.__('ROLE_ID_REQUIRED'));
        }
        const roleIdNumber = Number(roleId);
        if (isNaN(roleIdNumber)) {
            return responsesHandler_1.default.badRequest(res, i18n.__('ROLE_ID_MUST_BE_VALID_NUMBER'));
        }
        const permissions = await rolePermissionModel.getPermissionsByRole(roleIdNumber);
        responsesHandler_1.default.success(res, i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, i18n.__('PERMISSION_ROLE_RETRIVED_FAILED'));
        next(error);
    }
};
exports.getPermissionsByRole = getPermissionsByRole;
//# sourceMappingURL=role.permission.controller.js.map