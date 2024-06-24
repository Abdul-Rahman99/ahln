"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorize = void 0;
const role_permission_model_1 = __importDefault(require("../models/users/role.permission.model"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const user_permission_model_1 = __importDefault(require("../models/users/user.permission.model"));
const userModel = new user_model_1.default();
const rolePermissionModel = new role_permission_model_1.default();
const userPermissionModel = new user_permission_model_1.default();
const authorize = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.user.id;
            const user = await userModel.getOne(userId);
            const rolePermissions = await rolePermissionModel.getPermissionsByRole(user.role_id);
            const rolePermissionTitles = rolePermissions.map((permission) => permission.title);
            const userPermissions = await userPermissionModel.getPermissionsByUser(userId);
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