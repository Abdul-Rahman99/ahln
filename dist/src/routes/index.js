"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_route_1 = __importDefault(require("./users.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const role_Route_1 = __importDefault(require("./role.Route"));
const permission_route_1 = __importDefault(require("./permission.route"));
const role_permission_route_1 = __importDefault(require("./role.permission.route"));
const user_permission_route_1 = __importDefault(require("./user.permission.route"));
const mountRoutes = (app) => {
    app.use('/api/users', users_route_1.default);
    app.use('/api/auth', auth_route_1.default);
    app.use('/api/role', role_Route_1.default);
    app.use('/api/permission', permission_route_1.default);
    app.use('/api/role-permissions', role_permission_route_1.default);
    app.use('/api/user-permissions', user_permission_route_1.default);
};
exports.default = mountRoutes;
//# sourceMappingURL=index.js.map