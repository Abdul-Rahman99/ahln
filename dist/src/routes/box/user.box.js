"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_box_controller_1 = require("../../controllers/box/user.box.controller");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/', verifyToken_1.default, user_box_controller_1.createUserBox);
router.get('/', verifyToken_1.default, user_box_controller_1.getAllUserBoxes);
router.get('/:id', verifyToken_1.default, user_box_controller_1.getUserBoxById);
router.put('/:id', verifyToken_1.default, user_box_controller_1.updateUserBox);
router.delete('/:id', verifyToken_1.default, user_box_controller_1.deleteUserBox);
router.get('/user/:userId', verifyToken_1.default, user_box_controller_1.getUserBoxesByUserId);
router.get('/box/:boxId', verifyToken_1.default, user_box_controller_1.getUserBoxesByBoxId);
exports.default = router;
//# sourceMappingURL=user.box.js.map