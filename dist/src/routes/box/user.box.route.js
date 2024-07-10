"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_box_controller_1 = require("../../controllers/box/user.box.controller");
const user_box_validation_1 = require("../../validation/box/user.box.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, user_box_validation_1.createUserBoxValidation, user_box_controller_1.createUserBox);
router.get('/get-all', verifyToken_1.default, user_box_controller_1.getAllUserBoxes);
router.get('/get-one/:id', verifyToken_1.default, user_box_validation_1.getUserBoxByIdValidation, user_box_controller_1.getUserBoxById);
router.put('/update/:id', verifyToken_1.default, user_box_validation_1.updateUserBoxValidation, user_box_controller_1.updateUserBox);
router.delete('/delete/:id', verifyToken_1.default, user_box_validation_1.deleteUserBoxValidation, user_box_controller_1.deleteUserBox);
router.get('/get-user-boxes', verifyToken_1.default, user_box_validation_1.getUserBoxesByUserIdValidation, user_box_controller_1.getUserBoxesByUserId);
router.get('/get-boxes-user', verifyToken_1.default, user_box_validation_1.getUserBoxesByBoxIdValidation, user_box_controller_1.getUserBoxesByBoxId);
router.post('/assign-box-to-user', verifyToken_1.default, user_box_validation_1.assignBoxToUserValidation, user_box_controller_1.assignBoxToUser);
router.post('/user-assign-box-to-himself', verifyToken_1.default, user_box_validation_1.userAssignBoxToHimselfValidation, user_box_controller_1.userAssignBoxToHimself);
router.post('/user-assign-box-to-relative-user', verifyToken_1.default, user_box_validation_1.userAssignBoxToRelativeUserValidation, user_box_controller_1.userAssignBoxToRelativeUser);
exports.default = router;
//# sourceMappingURL=user.box.route.js.map