"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePermission = exports.updatePermission = exports.getPermissionById = exports.getAllPermissions = exports.createPermission = void 0;
const permission_model_1 = __importDefault(require("../../models/users/permission.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const permissionModel = new permission_model_1.default();
const createPermission = async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const permission = await permissionModel.create(title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_CREATED_SUCCESSFULLY'), permission);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.createPermission = createPermission;
const getAllPermissions = async (req, res, next) => {
    try {
        const permissions = await permissionModel.getAll();
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permissions);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getAllPermissions = getAllPermissions;
const getPermissionById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permission = await permissionModel.getById(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_RETRIEVED_SUCCESSFULLY'), permission);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.getPermissionById = getPermissionById;
const updatePermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const permission = await permissionModel.update(Number(id), title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_UPDATED_SUCCESSFULLY'), permission);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.updatePermission = updatePermission;
const deletePermission = async (req, res, next) => {
    try {
        const { id } = req.params;
        const permission = await permissionModel.delete(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('PERMISSION_DELETED_SUCCESSFULLY'), permission);
    }
    catch (error) {
        responsesHandler_1.default.badRequest(res, error.message);
        next(error);
    }
};
exports.deletePermission = deletePermission;
//# sourceMappingURL=permission.controller.js.map