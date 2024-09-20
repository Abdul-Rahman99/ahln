/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import UserModel from '../models/users/user.model';
import asyncHandler from '../middlewares/asyncHandler';
import config from '../../config';
import { User } from '../types/user.type';
import i18n from '../config/i18n';
import UserDevicesModel from '../models/users/user.devices.model';
import ResponseHandler from '../utils/responsesHandler';
import authHandler from '../utils/authHandler';
import SystemLogModel from '../models/logs/system.log.model';
import AuditTrailModel from '../models/logs/audit.trail.model';
import NotificationModel from '../models/logs/notification.model';

const notificationModel = new NotificationModel();
const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();

const sendVerificationEmail = async (
  email: string,
  otp: string,
  req: Request,
  res: Response,
) => {
  const transporter = nodemailer.createTransport({
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
  const user = await authHandler(req, res);
  notificationModel.createNotification(
    'sendVerificationEmail',
    i18n.__('VERFICATION_SENT_SUCCESSFULLY'),
    null,
    user,
    null,
  );
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, user_name, phone_number, password }: User = req.body;
  const { fcmToken } = req.body;
  // Check if email or phone already exists
  const emailExists = await userModel.emailExists(email);
  if (emailExists) {
    const user = await authHandler(req, res);
    const source = 'register';
    systemLog.createSystemLog(user, 'Email already Registerd', source);
    return ResponseHandler.badRequest(res, i18n.__('EMAIL_ALREADY_REGISTERED'));
  }

  const phoneExists = await userModel.phoneExists(phone_number);
  if (phoneExists) {
    const user = await authHandler(req, res);
    const source = 'phoneExists';
    systemLog.createSystemLog(user, 'Phone Already Exists', source);
    return ResponseHandler.badRequest(res, i18n.__('PHONE_ALREADY_REGISTERED'));
  }
  // Hash the password
  const hashedPassword = bcrypt.hashSync(password, 10);

  // Create the user
  const user = await userModel.createUser({
    email,
    user_name,
    phone_number,
    password: hashedPassword,
    email_verified: false,
    avatar: req.file?.filename,
  } as User);

  // Save the FCM token and user ID to the user_devices table
  if (fcmToken) {
    await userDevicesModel.saveUserDevice(user.id, fcmToken);
  }

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await userModel.saveOtp(email, otp);

  // Send verification email
  sendVerificationEmail(email, otp, req, res);

  // Generate JWT token
  const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);

  // Update user token in the database
  await userModel.updateUserToken(user.id, token);

  const action = 'register';
  auditTrail.createAuditTrail(
    user.id,
    action,
    i18n.__('REGISTER_SUCCESS'),
    null,
  );
  ResponseHandler.logInSuccess(res, i18n.__('REGISTER_SUCCESS'), null, token);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, fcmToken } = req.body;
  const emailLower = email.toLowerCase();
  const currentUser = await userModel.findByEmail(emailLower);

  if (!currentUser) {
    const user = await authHandler(req, res);
    const source = 'verifyEmail';
    systemLog.createSystemLog(user, 'User Not Found', source);
    return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
  }

  // Verify the token from the request matches the one in the database
  if (currentUser.token !== currentUser.token) {
    const user = await authHandler(req, res);
    const source = 'verifyEmail';
    systemLog.createSystemLog(user, 'Invalid Token', source);
    return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
  }

  // Check if the provided email matches the current user's email
  if (currentUser.email.toLowerCase() !== emailLower) {
    const user = await authHandler(req, res);
    const source = 'verifyEmail';
    systemLog.createSystemLog(user, 'Unauthorized email verification', source);
    return ResponseHandler.badRequest(
      res,
      i18n.__('UNAUTHORIZED_EMAIL_VERIFICATION'),
    );
  }
  const user = await authHandler(req, res);

  // Check if the provided OTP matches the user's OTP
  const isOtpValid = await userModel.verifyOtp(emailLower, otp);
  if (!isOtpValid) {
    const source = 'verifyEmail';
    systemLog.createSystemLog(user, 'Invalid Otp', source);
    return ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'));
  }

  // Update the user's email_verified status
  await userModel.updateUser(emailLower, {
    email_verified: true,
    register_otp: null,
  });

  // Retrieve the token from the database user
  const token = currentUser.token;

  // Save the FCM token and user ID to the user_devices table
  if (fcmToken) {
    await userDevicesModel.saveUserDevice(currentUser.id, fcmToken);
  }

  notificationModel.createNotification(
    'verifyEmail',
    i18n.__('EMAIL_VERIFIED_SUCCESS'),
    null,
    user,
    null,
  );
  await userDevicesModel.getFcmTokenDevicesByUser(user);
  try {
    notificationModel.pushNotification(
      fcmToken,
      i18n.__('UPDATE_RELATIVE_CUSTOMER'),
      i18n.__('RELATIVE_CUSTOMER_UPDATED_SUCCESSFULLY'),
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const source = 'updateRelativeCustomer';
    systemLog.createSystemLog(
      user,
      i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
      source,
    );
  }
  ResponseHandler.logInSuccess(
    res,
    i18n.__('EMAIL_VERIFIED_SUCCESS'),
    {
      id: currentUser.id,
      user_name: currentUser.user_name,
      role_id: currentUser.role_id,
      is_active: currentUser.is_active,
      phone_number: currentUser.phone_number,
      email: currentUser.email,
      preferred_language: currentUser.preferred_language,
    },
    token,
  );
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fcmToken } = req.body;

  const user = await userModel.findByEmail(email);

  if (!user) {
    const user = await authHandler(req, res);
    const source = 'login';
    systemLog.createSystemLog(user, 'Invalid credentials', source);
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    const user = await authHandler(req, res);
    const source = 'login';
    systemLog.createSystemLog(user, 'Invalid credentials', source);
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }

  const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);
  await userModel.updateUserToken(user.id, token);

  if (!user.is_active || !user.email_verified) {
    const userAuth = await authHandler(req, res);
    const source = 'login';
    systemLog.createSystemLog(userAuth, 'User Inactive or Unverified', source);
    return ResponseHandler.badRequest(
      res,
      i18n.__('USER_INACTIVE_OR_UNVERIFIED'),
      {
        is_active: user.is_active,
        email_verified: user.email_verified,
      },
      token,
    );
  }

  if (fcmToken) {
    if (await userDevicesModel.fcmTokenExists(fcmToken)) {
      //console.log('User already has a FCM token');
    } else {
      await userDevicesModel.saveUserDevice(user.id, fcmToken);
    }
  }
  let userAvatar: string | null = null;
  if (user.avatar) {
    userAvatar = `${process.env.BASE_URL}/uploads/${user.avatar}`;
  } else {
    userAvatar = null;
  }

  const action = 'login';
  auditTrail.createAuditTrail(user.id, action, i18n.__('LOGIN_SUCCESS'), null);
  ResponseHandler.logInSuccess(
    res,
    i18n.__('LOGIN_SUCCESS'),
    {
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
      role: user.title,
    },
    token,
  );
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  return ResponseHandler.success(res, user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  await userModel.updateUserToken(user, null);
  return ResponseHandler.success(res, i18n.__('LOGOUT_SUCCESS'));
});

export const resendOtpAndUpdateDB = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const emailExists = await userModel.emailExists(email);
    if (!emailExists) {
      const user = await authHandler(req, res);
      const source = 'resendOtpAndUpdateDB';
      systemLog.createSystemLog(user, 'Invalid Email', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_EMAIL'));
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await userModel.updateResetPasswordOTP(email, otp);

    sendVerificationEmail(email, otp, req, res);

    const user = await authHandler(req, res);

    notificationModel.createNotification(
      'resendOtpAndUpdateDB',
      i18n.__('OTP_SENT_SUCCESSFULLY'),
      null,
      user,
      null,
    );
    ResponseHandler.success(res, i18n.__('OTP_SENT_SUCCESSFULLY'));
  },
);

export const updatePasswordWithOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    const isValidOTP = await userModel.checkResetPasswordOTP(email, otp);

    if (!isValidOTP) {
      const user = await authHandler(req, res);
      const source = 'updatePasswordWithOTP';
      systemLog.createSystemLog(user, 'Invalid Otp', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.updateUserPassword(email, hashedPassword);
    await userModel.updateResetPasswordOTP(email, null);

    const user = await authHandler(req, res);

    notificationModel.createNotification(
      'updatePasswordWithOTP',
      i18n.__('PASSWORD_RESET_SUCCESS'),
      null,
      user,
      null,
    );
    ResponseHandler.success(res, i18n.__('PASSWORD_RESET_SUCCESS'), null);
  },
);

export const updatePassword = asyncHandler(
  async (req: Request, res: Response) => {
    const { password, newPassword } = req.body;
    const user = await authHandler(req, res);

    const result = await userModel.getOne(user);

    if (!password || !result.password) {
      const source = 'updatePassword';
      systemLog.createSystemLog(user, 'Invalid credentials', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }

    const isPasswordValid = bcrypt.compareSync(password, result.password);
    if (!isPasswordValid) {
      const source = 'updatePassword';
      systemLog.createSystemLog(user, 'Invalid credentials', source);
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.updateUserPassword(result.email, hashedPassword);

    notificationModel.createNotification(
      'updatePassword',
      i18n.__('PASSWORD_RESET_SUCCESS'),
      null,
      user,
      null,
    );
    ResponseHandler.success(res, i18n.__('PASSWORD_RESET_SUCCESS'), null);
  },
);
