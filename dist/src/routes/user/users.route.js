"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_controller_1 = require("../../controllers/user/users.controller");
const user_validation_1 = require("../../validation/user/user.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_user']), user_validation_1.createUserValidator, users_controller_1.createUser);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_user']), users_controller_1.getAllUsers);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_user']), user_validation_1.getUserValidator, users_controller_1.getUserById);
router.put('/update', verifyToken_1.default, user_validation_1.updateUserValidator, users_controller_1.updateUser);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_user']), user_validation_1.deleteUserValidator, users_controller_1.deleteUser);
exports.default = router;
//# sourceMappingURL=users.route.js.map