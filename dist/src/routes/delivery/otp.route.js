"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_controller_1 = require("../../controllers/delivery/otp.controller");
const router = (0, express_1.Router)();
router.post('/new', otp_controller_1.createOTP);
router.get('/get-all', otp_controller_1.getAllOTPs);
router.get('/get-one/:id', otp_controller_1.getOTPById);
router.put('/update/:id', otp_controller_1.updateOTP);
router.delete('/delete/:id', otp_controller_1.deleteOTP);
router.get('/user-otp/:userId', otp_controller_1.getOTPsByUser);
router.post('/check-otp', otp_controller_1.checkOTP);
exports.default = router;
//# sourceMappingURL=otp.route.js.map