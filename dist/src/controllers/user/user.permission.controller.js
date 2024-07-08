"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByUser = exports.removePermissionFromUser = exports.assignPermissionToUser = void 0;
const user_permission_model_1 = __importDefault(require("../../models/users/user.permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const userPermissionModel = new user_permission_model_1.default();
const assignPermissionToUser = async (req, res, next) => {
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (isAssigned) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_ALREADY_ASSIGNED_TO_USER'));
        }
        await userPermissionModel.assignPermission(user_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_ASSIGNED_TO_USER_SUCCESSFULLY'), user_id);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.assignPermissionToUser = assignPermissionToUser;
const removePermissionFromUser = async (req, res, next) => {
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (!isAssigned) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PERMISSION_IS_NOT_ASSIGNED_TO_USER'));
        }
        await userPermissionModel.revokePermission(user_id, permission_id);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'), user_id);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.removePermissionFromUser = removePermissionFromUser;
const getPermissionsByUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const permissions = await userPermissionModel.getPermissionsByUserId(userId);
        if (permissions.length === 0) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('NO_PERMISSION_FOUND_FOR_USER'), userId);
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_BY_USER_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        next(error);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getPermissionsByUser = getPermissionsByUser;
//# sourceMappingURL=user.permission.controller.js.map