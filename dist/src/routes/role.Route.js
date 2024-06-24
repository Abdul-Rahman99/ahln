"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const role_controller_1 = require("../controllers/role.controller");
const role_validation_1 = require("../validation/role.validation");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const authorize_1 = require("../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_role']), role_validation_1.createRoleValidator, role_controller_1.createRole);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_role']), role_controller_1.getAllRoles);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_role']), role_validation_1.getRoleValidator, role_controller_1.getRoleById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_role']), role_validation_1.updateRoleValidator, role_controller_1.updateRole);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_role']), role_validation_1.deleteRoleValidator, role_controller_1.deleteRole);
exports.default = router;
//# sourceMappingURL=role.Route.js.map