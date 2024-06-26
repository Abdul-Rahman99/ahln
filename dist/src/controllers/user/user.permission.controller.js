"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByUser = exports.removePermissionFromUser = exports.assignPermissionToUser = void 0;
const user_permission_model_1 = __importDefault(require("../../models/users/user.permission.model"));
const userPermissionModel = new user_permission_model_1.default();
const assignPermissionToUser = async (req, res) => {
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (isAssigned) {
            return res.status(400).json({
                success: false,
                message: 'Permission is already assigned to the user ' + user_id,
            });
        }
        await userPermissionModel.assignPermission(user_id, permission_id);
        res.status(201).json({
            success: true,
            message: 'Permission assigned to user ' + user_id,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message, success: false });
    }
};
exports.assignPermissionToUser = assignPermissionToUser;
const removePermissionFromUser = async (req, res) => {
    try {
        const { user_id, permission_id } = req.body;
        const isAssigned = await userPermissionModel.checkPermissionAssignment(user_id, permission_id);
        if (!isAssigned) {
            return res.status(400).json({
                success: false,
                message: 'Permission is not assigned to the user.',
            });
        }
        await userPermissionModel.revokePermission(user_id, permission_id);
        res.status(200).json({
            success: true,
            message: 'Permission removed from user ' + user_id,
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.removePermissionFromUser = removePermissionFromUser;
const getPermissionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const permissions = await userPermissionModel.getPermissionsByUser(userId);
        if (permissions.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No permissions found for user ' + userId,
            });
        }
        res.status(200).json({ success: true, data: permissions });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getPermissionsByUser = getPermissionsByUser;
//# sourceMappingURL=user.permission.controller.js.map