"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const box_locker_controller_1 = require("../../controllers/box/box.locker.controller");
const box_locker_validation_1 = require("../../validation/box/box.locker.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.post('/new', verifyToken_1.default, (0, authorize_1.authorize)(['create_box_locker']), box_locker_validation_1.createBoxLockerValidation, box_locker_controller_1.createBoxLocker);
router.get('/get-all', verifyToken_1.default, (0, authorize_1.authorize)(['read_box_locker']), box_locker_controller_1.getAllBoxLockers);
router.get('/get-one/:id', verifyToken_1.default, (0, authorize_1.authorize)(['read_box_locker']), box_locker_validation_1.getBoxLockerByIdValidation, box_locker_controller_1.getBoxLockerById);
router.put('/update/:id', verifyToken_1.default, (0, authorize_1.authorize)(['update_box_locker']), box_locker_validation_1.updateBoxLockerValidation, box_locker_controller_1.updateBoxLocker);
router.delete('/delete/:id', verifyToken_1.default, (0, authorize_1.authorize)(['delete_box_locker']), box_locker_validation_1.deleteBoxLockerValidation, box_locker_controller_1.deleteBoxLocker);
router.post('/get-lockers-by-box', box_locker_controller_1.getAllLockersById);
exports.default = router;
//# sourceMappingURL=box.locker.route.js.map