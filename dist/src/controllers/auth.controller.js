"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePasswordWithOTP = exports.resendOtpAndUpdateDB = exports.logout = exports.currentUser = exports.login = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const config_1 = __importDefault(require("../../config"));
const i18n_1 = __importDefault(require("../config/i18n"));
const user_devices_model_1 = __importDefault(require("../models/users/user.devices.model"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const userModel = new user_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
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
    const token = jsonwebtoken_1.default.sign({ email, password }, config_1.default.JWT_SECRET_KEY);
    await userModel.updateUserToken(user.id, token);
    responsesHandler_1.default.success(res, i18n_1.default.__('REGISTER_SUCCESS'), null, token);
});
exports.verifyEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, fcmToken } = req.body;
    try {
        const emailLower = email.toLowerCase();
        const currentUser = await userModel.findByEmail(emailLower);
        const userFromDb = await userModel.findByEmail(emailLower);
        if (!userFromDb) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
        }
        console.log(currentUser);
        if (!currentUser || currentUser.token !== userFromDb.token) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        if (currentUser.email.toLowerCase() !== emailLower) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('UNAUTHORIZED_EMAIL_VERIFICATION'));
        }
        const isOtpValid = await userModel.verifyOtp(emailLower, otp);
        if (!isOtpValid) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'));
        }
        await userModel.updateUser(emailLower, {
            email_verified: true,
            register_otp: null,
        });
        const token = userFromDb.token;
        if (fcmToken) {
            await userDevicesModel.saveUserDevice(userFromDb.id, fcmToken);
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('EMAIL_VERIFIED_SUCCESS'), {
            id: currentUser.id,
            user_name: currentUser.user_name,
            role_id: currentUser.role_id,
            is_active: currentUser.is_active,
            phone_number: currentUser.phone_number,
            email: currentUser.email,
            preferred_language: currentUser.preferred_language,
        }, token);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    try {
        const user = await userModel.findByEmail(email);
        if (!user) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
        }
        const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
        if (!isPasswordValid) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
        }
        const token = jsonwebtoken_1.default.sign({ email, password }, config_1.default.JWT_SECRET_KEY);
        await userModel.updateUserToken(user.id, token);
        if (!user.is_active || !user.email_verified) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_INACTIVE_OR_UNVERIFED'), {
                is_active: user.is_active,
                email_verified: user.email_verified,
            }, token);
        }
        if (fcmToken) {
            await userDevicesModel.saveUserDevice(user.id, fcmToken);
        }
        responsesHandler_1.default.success(res, i18n_1.default.__('LOGIN_SUCCESS'), {
            id: user.id,
            user_name: user.user_name,
            role_id: user.role_id,
            is_active: user.is_active,
            phone_number: user.phone_number,
            email: user.email,
            preferred_language: user.preferred_language,
        }, token);
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.currentUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = req.currentUser;
    res.json({ success: true, data: user });
});
exports.logout = (0, asyncHandler_1.default)(async (req, res) => {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('TOKEN_NOT_PROVIDED'));
    }
    try {
        const user = await userModel.findByToken(token);
        if (!user) {
            return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
        }
        console.log(user);
        await userModel.updateUserToken(user, null);
        responsesHandler_1.default.success(res, i18n_1.default.__('LOGOUT_SUCCESS'));
    }
    catch (error) {
        responsesHandler_1.default.internalError(res, error.message);
    }
});
exports.resendOtpAndUpdateDB = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.updateResetPasswordOTP(email, otp);
    await sendVerificationEmail(email, otp);
    responsesHandler_1.default.success(res, i18n_1.default.__('OTP_SENT_SUCCESSFULLY'));
});
exports.updatePasswordWithOTP = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const isValidOTP = await userModel.checkResetPasswordOTP(email, otp);
    if (!isValidOTP) {
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'));
    }
    const hashedPassword = bcrypt_1.default.hashSync(newPassword, 10);
    await userModel.updateUserPassword(email, hashedPassword);
    await userModel.updateResetPasswordOTP(email, null);
    return responsesHandler_1.default.success(res, i18n_1.default.__('PASSWORD_RESET_SUCCESS'), null);
});
//# sourceMappingURL=auth.controller.js.map