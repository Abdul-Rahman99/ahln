"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const role_model_1 = __importDefault(require("../../models/users/role.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const roleModel = new role_model_1.default();
const createRole = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const role = await roleModel.create(title, description);
        responsesHandler_1.default.success(res, i18n.__('ROLE_CREATED_SUCCESSFULLY'), role);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.createRole = createRole;
const getAllRoles = async (req, res, next) => {
    try {
        const roles = await roleModel.getAll();
        responsesHandler_1.default.success(res, i18n.__('ROLES_RETRIEVED_SUCCESSFULLY'), roles);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = await roleModel.getById(Number(id));
        responsesHandler_1.default.success(res, i18n.__('ROLE_RETRIEVED_SUCCESSFULLY'), role);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getRoleById = getRoleById;
const updateRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const role = await roleModel.update(Number(id), title, description);
        responsesHandler_1.default.success(res, i18n.__('ROLE_UPDATED_SUCCESSFULLY'), role);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res, next) => {
    try {
        const { id } = req.params;
        const role = await roleModel.delete(Number(id));
        responsesHandler_1.default.success(res, i18n.__('ROLE_DELETED_SUCCESSFULLY'), role);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.deleteRole = deleteRole;
//# sourceMappingURL=role.controller.js.map