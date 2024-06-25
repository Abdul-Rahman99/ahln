"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_device_controller_1 = require("../../controllers/user/user.device.controller");
const user_device_validation_1 = require("../../validation/user/user.device.validation");
const verifyToken_1 = __importDefault(require("../../middlewares/verifyToken"));
const authorize_1 = require("../../middlewares/authorize");
const router = express_1.default.Router();
router.delete('/delete/:deviceId', verifyToken_1.default, (0, authorize_1.authorize)(['delete_user']), user_device_validation_1.deleteDeviceValidator, user_device_controller_1.deleteDevice);
router.put('/update/:deviceId', verifyToken_1.default, (0, authorize_1.authorize)(['update_user']), user_device_validation_1.updateDeviceValidator, user_device_controller_1.updateDevice);
router.get('/get-all/:userId', verifyToken_1.default, (0, authorize_1.authorize)(['read_user']), user_device_validation_1.getDevicesByUserValidator, user_device_controller_1.getDevicesByUser);
exports.default = router;
//# sourceMappingURL=user.device.route.js.map