"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const role_model_1 = __importDefault(require("../../models/users/role.model"));
const roleModel = new role_model_1.default();
const createRole = async (req, res) => {
    try {
        const { title, description } = req.body;
        const role = await roleModel.create(title, description);
        res.status(201).json(role);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createRole = createRole;
const getAllRoles = async (req, res) => {
    try {
        const roles = await roleModel.getAll();
        res.status(200).json(roles);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await roleModel.getById(Number(id));
        res.status(200).json(role);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getRoleById = getRoleById;
const updateRole = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const role = await roleModel.update(Number(id), title, description);
        res.status(200).json(role);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await roleModel.delete(Number(id));
        res.status(200).json(role);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteRole = deleteRole;
//# sourceMappingURL=role.controller.js.map