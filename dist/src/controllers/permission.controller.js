"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const permission_model_1 = __importDefault(require("../models/users/permission.model"));
const permissionModel = new permission_model_1.default();
const createPermission = async (req, res) => {
    try {
        const { title, description } = req.body;
        const permission = await permissionModel.create(title, description);
        res.status(201).json(permission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createPermission = createPermission;
const getAllPermissions = async (req, res) => {
    try {
        const permissions = await permissionModel.getAll();
        res.status(200).json(permissions);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllPermissions = getAllPermissions;
const getPermissionById = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await permissionModel.getById(Number(id));
        res.status(200).json(permission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getPermissionById = getPermissionById;
const updatePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const permission = await permissionModel.update(Number(id), title, description);
        res.status(200).json(permission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updatePermission = updatePermission;
const deletePermission = async (req, res) => {
    try {
        const { id } = req.params;
        const permission = await permissionModel.delete(Number(id));
        res.status(200).json(permission);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deletePermission = deletePermission;
//# sourceMappingURL=permission.controller.js.map