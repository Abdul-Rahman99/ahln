"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPermissionsByRole = exports.removePermissionFromRole = exports.assignPermissionToRole = void 0;
const role_permission_model_1 = __importDefault(require("../models/users/role.permission.model"));
const rolePermissionModel = new role_permission_model_1.default();
const assignPermissionToRole = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        const isAssigned = await rolePermissionModel.checkPermissionAssignment(role_id, permission_id);
        if (isAssigned) {
            return res
                .status(400)
                .json({ message: 'Permission is already assigned to the role.' });
        }
        await rolePermissionModel.assignPermission(role_id, permission_id);
        res.status(201).json({ message: 'Permission assigned to role' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.assignPermissionToRole = assignPermissionToRole;
const removePermissionFromRole = async (req, res) => {
    try {
        const { role_id, permission_id } = req.body;
        const isAssigned = await rolePermissionModel.checkPermissionAssignment(role_id, permission_id);
        if (!isAssigned) {
            return res
                .status(400)
                .json({ message: 'Permission is not assigned to the role.' });
        }
        await rolePermissionModel.revokePermission(role_id, permission_id);
        res.status(200).json({ message: 'Permission removed from role' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.removePermissionFromRole = removePermissionFromRole;
const getPermissionsByRole = async (req, res) => {
    try {
        const { roleId } = req.params;
        if (!roleId) {
            return res
                .status(400)
                .json({ message: 'Role ID parameter is required.' });
        }
        const roleIdNumber = Number(roleId);
        if (isNaN(roleIdNumber)) {
            return res
                .status(400)
                .json({ message: 'Role ID must be a valid number.' });
        }
        const permissions = await rolePermissionModel.getPermissionsByRole(roleIdNumber);
        res.status(200).json(permissions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPermissionsByRole = getPermissionsByRole;
//# sourceMappingURL=role.permission.controller.js.map