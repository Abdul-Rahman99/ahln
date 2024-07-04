"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const otp_controller_1 = require("../../controllers/delivery/otp.controller");
const otp_validation_1 = require("../../validation/delivery/otp.validation");
const router = (0, express_1.Router)();
router.post('/new', otp_validation_1.createOTPValidation, otp_controller_1.createOTP);
router.get('/get-all', otp_controller_1.getAllOTPs);
router.get('/get-one/:id', otp_validation_1.getOTPByIdValidation, otp_controller_1.getOTPById);
router.put('/update/:id', otp_validation_1.updateOTPValidation, otp_controller_1.updateOTP);
router.delete('/delete/:id', otp_validation_1.deleteOTPValidation, otp_controller_1.deleteOTP);
router.post('/check-otp', otp_validation_1.checkOTPValidation, otp_controller_1.checkOTP);
router.post('/check-tracking-number', otp_validation_1.checkTrackingNumberValidation, otp_controller_1.checkTrackingNumberAndUpdateStatus);
exports.default = router;
//# sourceMappingURL=otp.route.js.map