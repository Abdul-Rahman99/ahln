"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_route_1 = __importDefault(require("./user/users.route"));
const auth_route_1 = __importDefault(require("./auth.route"));
const role_Route_1 = __importDefault(require("./user/role.Route"));
const permission_route_1 = __importDefault(require("./user/permission.route"));
const role_permission_route_1 = __importDefault(require("./user/role.permission.route"));
const user_permission_route_1 = __importDefault(require("./user/user.permission.route"));
const tablet_route_1 = __importDefault(require("./box/tablet.route"));
const user_device_route_1 = __importDefault(require("./user/user.device.route"));
const box_generation_route_1 = __importDefault(require("./box/box.generation.route"));
const address_route_1 = __importDefault(require("./box/address.route"));
const mountRoutes = (app) => {
    app.use('/api/users', users_route_1.default);
    app.use('/api/auth', auth_route_1.default);
    app.use('/api/role', role_Route_1.default);
    app.use('/api/permission', permission_route_1.default);
    app.use('/api/role-permissions', role_permission_route_1.default);
    app.use('/api/user-permissions', user_permission_route_1.default);
    app.use('/api/user-devices', user_device_route_1.default);
    app.use('/api/tablet', tablet_route_1.default);
    app.use('/api/box-generation', box_generation_route_1.default);
    app.use('/api/address', address_route_1.default);
};
exports.default = mountRoutes;
//# sourceMappingURL=index.js.map