"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const verifyToken_1 = __importDefault(require("../middlewares/verifyToken"));
const router = express_1.default.Router();
router.post('/register', auth_controller_1.register);
router.post('/login', auth_controller_1.login);
router.get('/current', verifyToken_1.default, auth_controller_1.currentUser);
router.post('/logout', verifyToken_1.default, auth_controller_1.logout);
router.post('/verify-email', auth_controller_1.verifyEmail);
router.post('/resend-otp', auth_controller_1.resendOtpAndUpdateDB);
router.post('/update-password', auth_controller_1.updatePasswordWithOTP);
exports.default = router;
//# sourceMappingURL=auth.route.js.map