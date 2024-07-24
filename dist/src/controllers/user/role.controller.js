"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteRole = exports.updateRole = exports.getRoleById = exports.getAllRoles = exports.createRole = void 0;
const role_model_1 = __importDefault(require("../../models/users/role.model"));
const responsesHandler_1 = __importDefault(require("../../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../../config/i18n"));
const system_log_model_1 = __importDefault(require("../../models/logs/system.log.model"));
const authHandler_1 = __importDefault(require("../../utils/authHandler"));
const audit_trail_model_1 = __importDefault(require("../../models/logs/audit.trail.model"));
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const roleModel = new role_model_1.default();
const createRole = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { title, description } = req.body;
        const role = await roleModel.create(title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLE_CREATED_SUCCESSFULLY'), role);
        const action = 'createRole';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('ROLE_CREATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'createRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.createRole = createRole;
const getAllRoles = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const roles = await roleModel.getAll();
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLES_RETRIEVED_SUCCESSFULLY'), roles);
    }
    catch (error) {
        const source = 'getAllRoles';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getAllRoles = getAllRoles;
const getRoleById = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const role = await roleModel.getById(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLE_RETRIEVED_SUCCESSFULLY'), role);
    }
    catch (error) {
        const source = 'getRoleById';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.getRoleById = getRoleById;
const updateRole = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const role = await roleModel.update(Number(id), title, description);
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLE_UPDATED_SUCCESSFULLY'), role);
        const action = 'updateRole';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('ROLE_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.updateRole = updateRole;
const deleteRole = async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    try {
        const { id } = req.params;
        const role = await roleModel.delete(Number(id));
        responsesHandler_1.default.success(res, i18n_1.default.__('ROLE_DELETED_SUCCESSFULLY'), role);
        const action = 'deleteRole';
        auditTrail.createAuditTrail(user, action, i18n_1.default.__('ROLE_DELETED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'deleteRole';
        systemLog.createSystemLog(user, error.message, source);
        responsesHandler_1.default.badRequest(res, error.message);
    }
};
exports.deleteRole = deleteRole;
//# sourceMappingURL=role.controller.js.map