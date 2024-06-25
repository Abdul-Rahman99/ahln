"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_permission_controller_1 = require("../../controllers/user/user.permission.controller");
const authorize_1 = require("../../middlewares/authorize");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/assign', verifyToken_1.default, (0, authorize_1.authorize)(['create_user_permission']), user_permission_controller_1.assignPermissionToUser);
router.post('/revoke', verifyToken_1.default, (0, authorize_1.authorize)(['delete_user_permission']), user_permission_controller_1.removePermissionFromUser);
router.get('/:userId', verifyToken_1.default, (0, authorize_1.authorize)(['read_user_permission']), user_permission_controller_1.getPermissionsByUser);
exports.default = router;
//# sourceMappingURL=user.permission.route.js.map