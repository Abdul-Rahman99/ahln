"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permission_controller_1 = require("../../controllers/user/permission.controller");
const permission_validation_1 = require("../../validation/user/permission.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_permission']), permission_validation_1.createPermissionValidator, permission_controller_1.createPermission);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_permission']), permission_controller_1.getAllPermissions);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_permission']), permission_validation_1.getPermissionValidator, permission_controller_1.getPermissionById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_permission']), permission_validation_1.updatePermissionValidator, permission_controller_1.updatePermission);
router.delete('/permission/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_permission']), permission_validation_1.deletePermissionValidator, permission_controller_1.deletePermission);
exports.default = router;
//# sourceMappingURL=permission.route.js.map