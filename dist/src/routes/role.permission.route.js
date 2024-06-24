"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_permission_controller_1 = require("../controllers/role.permission.controller");
const authorize_1 = require("../middlewares/authorize");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/assign', verifyToken_1.default, (0, authorize_1.authorize)(['create_role_permission']), role_permission_controller_1.assignPermissionToRole);
router.post('/revoke', verifyToken_1.default, (0, authorize_1.authorize)(['delete_role_permission']), role_permission_controller_1.removePermissionFromRole);
router.get('/:roleId', verifyToken_1.default, (0, authorize_1.authorize)(['read_role_permission']), role_permission_controller_1.getPermissionsByRole);
exports.default = router;
//# sourceMappingURL=role.permission.route.js.map