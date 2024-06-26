"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resendOtp = exports.logout = exports.currentUser = exports.login = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const config_1 = __importDefault(require("../../config"));
const i18n_1 = __importDefault(require("../config/i18n"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const user_devices_model_1 = __importDefault(require("../models/users/user.devices.model"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const userModel = new user_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
const generateToken = (user) => {
    return jsonwebtoken_1.default.sign({ id: user.id, email_verified: user.email_verified }, config_1.default.JWT_SECRET_KEY);
};
const sendVerificationEmail = (email, otp) => {
    const transporter = nodemailer_1.default.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'developer@dccme.ai',
            pass: 'yfen ping pjfh emkp',
        },
    });
    const mailOptions = {
        from: 'AHLN App',
        to: email,
        subject: 'Verify your email',
        html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
    };
    transporter.sendMail(mailOptions);
};
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, user_name, phone_number, password } = req.body;
    const emailExists = await userModel.emailExists(email);
    if (emailExists) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('EMAIL_ALREADY_REGISTERED'));
    }
    const phoneExists = await userModel.phoneExists(phone_number);
    if (phoneExists) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PHONE_ALREADY_REGISTERED'));
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const user = await userModel.createUser({
        email,
        user_name,
        phone_number,
        password: hashedPassword,
        email_verified: false,
    });
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.saveOtp(email, otp);
    sendVerificationEmail(email, otp);
    const token = generateToken(user);
    responsesHandler_1.default.success(res, i18n_1.default.__('REGISTER_SUCCESS'), user, token);
});
exports.verifyEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, fcmToken } = req.body;
    (0, auth_middleware_1.authMiddleware)(req, res, async () => {
        const currentUser = req.currentUser;
        const emailLower = email.toLowerCase();
        try {
            if (currentUser.email !== emailLower) {
                responsesHandler_1.default.badRequest(res, i18n_1.default.__('UNAUTHORIZED_EMAIL_VERIFICATION'));
            }
            const isOtpValid = await userModel.verifyOtp(emailLower, otp);
            if (!isOtpValid) {
                responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'));
                return;
            }
            await userModel.updateUser(emailLower, {
                email_verified: true,
                register_otp: null,
            });
            if (fcmToken) {
                await userDevicesModel.saveUserDevice(currentUser.id, fcmToken);
            }
            responsesHandler_1.default.success(res, i18n_1.default.__('EMAIL_VERIFIED_SUCCESS'));
        }
        catch (error) {
            responsesHandler_1.default.internalError(res, error.message);
        }
    });
});
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    if (!email || !password) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('MISSING_CREDENTIALS'));
    }
    const user = await userModel.findByEmail(email);
    if (user === null) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
    console.log(isPasswordValid);
    if (!isPasswordValid) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const token = generateToken(user);
    if (!user.is_active || !user.email_verified) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_INACTIVE_OR_UNVERIFIED'), {
            is_active: user.is_active,
            email_verified: user.email_verified,
            token,
        });
    }
    if (fcmToken) {
        await userDevicesModel.saveUserDevice(user.id, fcmToken);
    }
    responsesHandler_1.default.success(res, i18n_1.default.__('LOGIN_SUCCESS'), user, token);
});
exports.currentUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = req.currentUser;
    res.json({ success: true, data: user });
});
exports.logout = (0, asyncHandler_1.default)(async (req, res) => {
    responsesHandler_1.default.success(res, i18n_1.default.__('LOGOUT_SUCCESS'));
});
exports.resendOtp = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
        responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.saveOtp(email, otp);
    await sendVerificationEmail(email, otp);
    responsesHandler_1.default.success(res, i18n_1.default.__('OTP_RESENT_SUCCESS'));
});
//# sourceMappingURL=auth.controller.js.map