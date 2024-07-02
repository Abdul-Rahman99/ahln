"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const role_permission_model_1 = __importDefault(require("../models/users/role.permission.model"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const user_permission_model_1 = __importDefault(require("../models/users/user.permission.model"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const i18n_1 = __importDefault(require("../config/i18n"));
const userModel = new user_model_1.default();
const rolePermissionModel = new role_permission_model_1.default();
const userPermissionModel = new user_permission_model_1.default();
const authorize = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const token = req.headers.authorization?.replace('Bearer ', '');
            if (!token) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
            }
            const user = await userModel.findByToken(token);
            if (!user) {
                return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
            }
            const userRoleId = await userModel.findRoleIdByUserId(user);
            const rolePermissions = await rolePermissionModel.getPermissionsByRole(userRoleId);
            const rolePermissionTitles = rolePermissions.map((permission) => permission.title);
            const userPermissions = await userPermissionModel.getPermissionsByUserId(user);
            const userPermissionTitles = userPermissions.map((permission) => permission.title);
            const allPermissions = new Set([
                ...rolePermissionTitles,
                ...userPermissionTitles,
            ]);
            const hasPermissions = requiredPermissions.every((permission) => allPermissions.has(permission));
            if (!hasPermissions) {
                return res.status(403).json({ message: 'Forbidden' });
            }
            next();
        }
        catch (error) {
            res.status(500).json({ message: error.message });
        }
    };
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map