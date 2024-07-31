"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.updatePasswordWithOTP = exports.resendOtpAndUpdateDB = exports.logout = exports.currentUser = exports.login = exports.verifyEmail = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_model_1 = __importDefault(require("../models/users/user.model"));
const asyncHandler_1 = __importDefault(require("../middlewares/asyncHandler"));
const config_1 = __importDefault(require("../../config"));
const i18n_1 = __importDefault(require("../config/i18n"));
const user_devices_model_1 = __importDefault(require("../models/users/user.devices.model"));
const responsesHandler_1 = __importDefault(require("../utils/responsesHandler"));
const authHandler_1 = __importDefault(require("../utils/authHandler"));
const system_log_model_1 = __importDefault(require("../models/logs/system.log.model"));
const audit_trail_model_1 = __importDefault(require("../models/logs/audit.trail.model"));
const notification_model_1 = __importDefault(require("../models/logs/notification.model"));
const notificationModel = new notification_model_1.default();
const auditTrail = new audit_trail_model_1.default();
const systemLog = new system_log_model_1.default();
const userModel = new user_model_1.default();
const userDevicesModel = new user_devices_model_1.default();
const sendVerificationEmail = async (email, otp, req, res) => {
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
    const user = await (0, authHandler_1.default)(req, res);
    notificationModel.createNotification('updateOnePinByUser', i18n_1.default.__('PIN_UPDATED_SUCCESSFULLY'), null, user);
};
exports.register = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, user_name, phone_number, password } = req.body;
    const { fcmToken } = req.body;
    const emailExists = await userModel.emailExists(email);
    if (emailExists) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'register';
        systemLog.createSystemLog(user, 'Email already Registerd', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('EMAIL_ALREADY_REGISTERED'));
    }
    const phoneExists = await userModel.phoneExists(phone_number);
    if (phoneExists) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'phoneExists';
        systemLog.createSystemLog(user, 'Phone Already Exists', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('PHONE_ALREADY_REGISTERED'));
    }
    const hashedPassword = bcrypt_1.default.hashSync(password, 10);
    const user = await userModel.createUser({
        email,
        user_name,
        phone_number,
        password: hashedPassword,
        email_verified: false,
        avatar: req.file?.filename,
    });
    if (fcmToken) {
        await userDevicesModel.saveUserDevice(user.id, fcmToken);
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.saveOtp(email, otp);
    sendVerificationEmail(email, otp, req, res);
    const token = jsonwebtoken_1.default.sign({ email, password }, config_1.default.JWT_SECRET_KEY);
    await userModel.updateUserToken(user.id, token);
    responsesHandler_1.default.logInSuccess(res, i18n_1.default.__('REGISTER_SUCCESS'), null, token);
    const action = 'register';
    auditTrail.createAuditTrail(user.id, action, i18n_1.default.__('REGISTER_SUCCESS'));
});
exports.verifyEmail = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, fcmToken } = req.body;
    const emailLower = email.toLowerCase();
    const currentUser = await userModel.findByEmail(emailLower);
    if (!currentUser) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'verifyEmail';
        systemLog.createSystemLog(user, 'User Not Found', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_NOT_FOUND'));
    }
    if (currentUser.token !== currentUser.token) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'verifyEmail';
        systemLog.createSystemLog(user, 'Invalid Token', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_TOKEN'));
    }
    if (currentUser.email.toLowerCase() !== emailLower) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'verifyEmail';
        systemLog.createSystemLog(user, 'Unauthorized email verification', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('UNAUTHORIZED_EMAIL_VERIFICATION'));
    }
    const user = await (0, authHandler_1.default)(req, res);
    const isOtpValid = await userModel.verifyOtp(emailLower, otp);
    if (!isOtpValid) {
        const source = 'verifyEmail';
        systemLog.createSystemLog(user, 'Invalid Otp', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'));
    }
    await userModel.updateUser(emailLower, {
        email_verified: true,
        register_otp: null,
    });
    const token = currentUser.token;
    if (fcmToken) {
        await userDevicesModel.saveUserDevice(currentUser.id, fcmToken);
    }
    responsesHandler_1.default.logInSuccess(res, i18n_1.default.__('EMAIL_VERIFIED_SUCCESS'), {
        id: currentUser.id,
        user_name: currentUser.user_name,
        role_id: currentUser.role_id,
        is_active: currentUser.is_active,
        phone_number: currentUser.phone_number,
        email: currentUser.email,
        preferred_language: currentUser.preferred_language,
    }, token);
    notificationModel.createNotification('verifyEmail', i18n_1.default.__('EMAIL_VERIFIED_SUCCESS'), null, user);
    await userDevicesModel.getFcmTokenDevicesByUser(user);
    try {
        notificationModel.pushNotification(fcmToken, i18n_1.default.__('UPDATE_RELATIVE_CUSTOMER'), i18n_1.default.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'));
    }
    catch (error) {
        const source = 'updateRelativeCustomer';
        systemLog.createSystemLog(user, i18n_1.default.__('ERROR_CREATING_NOTIFICATION', ' ', error.message), source);
    }
});
exports.login = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password, fcmToken } = req.body;
    const user = await userModel.findByEmail(email);
    if (!user) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'login';
        systemLog.createSystemLog(user, 'Invalid credentials', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const isPasswordValid = bcrypt_1.default.compareSync(password, user.password);
    if (!isPasswordValid) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'login';
        systemLog.createSystemLog(user, 'Invalid credentials', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const token = jsonwebtoken_1.default.sign({ email, password }, config_1.default.JWT_SECRET_KEY);
    await userModel.updateUserToken(user.id, token);
    if (!user.is_active || !user.email_verified) {
        const userAuth = await (0, authHandler_1.default)(req, res);
        const source = 'login';
        systemLog.createSystemLog(userAuth, 'User Inactive or Unverified', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('USER_INACTIVE_OR_UNVERIFIED'), {
            is_active: user.is_active,
            email_verified: user.email_verified,
        }, token);
    }
    if (fcmToken) {
        await userDevicesModel.saveUserDevice(user.id, fcmToken);
    }
    const userAvatar = `${process.env.BASE_URL}/uploads/${user.avatar}`;
    responsesHandler_1.default.logInSuccess(res, i18n_1.default.__('LOGIN_SUCCESS'), {
        id: user.id,
        user_name: user.user_name,
        role_id: user.role_id,
        is_active: user.is_active,
        phone_number: user.phone_number,
        email: user.email,
        preferred_language: user.preferred_language,
        avatar: userAvatar,
        country: user.country,
        city: user.city,
        role: user.title
    }, token);
    const action = 'login';
    auditTrail.createAuditTrail(user.id, action, i18n_1.default.__('LOGIN_SUCCESS'));
});
exports.currentUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = req.currentUser;
    return responsesHandler_1.default.success(res, user);
});
exports.logout = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await (0, authHandler_1.default)(req, res);
    await userModel.updateUserToken(user, null);
    return responsesHandler_1.default.success(res, i18n_1.default.__('LOGOUT_SUCCESS'));
});
exports.resendOtpAndUpdateDB = (0, asyncHandler_1.default)(async (req, res) => {
    const { email } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await userModel.updateResetPasswordOTP(email, otp);
    sendVerificationEmail(email, otp, req, res);
    responsesHandler_1.default.success(res, i18n_1.default.__('OTP_SENT_SUCCESSFULLY'));
    const user = await (0, authHandler_1.default)(req, res);
    notificationModel.createNotification('resendOtpAndUpdateDB', i18n_1.default.__('OTP_SENT_SUCCESSFULLY'), null, user);
});
exports.updatePasswordWithOTP = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const isValidOTP = await userModel.checkResetPasswordOTP(email, otp);
    if (!isValidOTP) {
        const user = await (0, authHandler_1.default)(req, res);
        const source = 'updatePasswordWithOTP';
        systemLog.createSystemLog(user, 'Invalid Otp', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_OTP'));
    }
    const hashedPassword = bcrypt_1.default.hashSync(newPassword, 10);
    await userModel.updateUserPassword(email, hashedPassword);
    await userModel.updateResetPasswordOTP(email, null);
    responsesHandler_1.default.success(res, i18n_1.default.__('PASSWORD_RESET_SUCCESS'), null);
    const user = await (0, authHandler_1.default)(req, res);
    notificationModel.createNotification('updatePasswordWithOTP', i18n_1.default.__('PASSWORD_RESET_SUCCESS'), null, user);
});
exports.updatePassword = (0, asyncHandler_1.default)(async (req, res) => {
    const { password, newPassword } = req.body;
    const user = await (0, authHandler_1.default)(req, res);
    const result = await userModel.getOne(user);
    if (!password || !result.password) {
        const source = 'updatePassword';
        systemLog.createSystemLog(user, 'Invalid credentials', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const isPasswordValid = bcrypt_1.default.compareSync(password, result.password);
    if (!isPasswordValid) {
        const source = 'updatePassword';
        systemLog.createSystemLog(user, 'Invalid credentials', source);
        return responsesHandler_1.default.badRequest(res, i18n_1.default.__('INVALID_CREDENTIALS'));
    }
    const hashedPassword = bcrypt_1.default.hashSync(newPassword, 10);
    await userModel.updateUserPassword(result.email, hashedPassword);
    responsesHandler_1.default.success(res, i18n_1.default.__('PASSWORD_RESET_SUCCESS'), null);
    notificationModel.createNotification('updatePassword', i18n_1.default.__('PASSWORD_RESET_SUCCESS'), null, user);
});
//# sourceMappingURL=auth.controller.js.map