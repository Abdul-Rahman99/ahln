/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
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

const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();

const sendVerificationEmail = (email: string, otp: string) => {
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
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, user_name, phone_number, password }: User = req.body;

  // Check if email or phone already exists
  const emailExists = await userModel.emailExists(email);
  if (emailExists) {
    return ResponseHandler.badRequest(res, i18n.__('EMAIL_ALREADY_REGISTERED'));
  }

  const phoneExists = await userModel.phoneExists(phone_number);
  if (phoneExists) {
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
  } as User);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await userModel.saveOtp(email, otp);

  // Send verification email
  sendVerificationEmail(email, otp);

  // Generate JWT token
  const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);

  // Update user token in the database
  await userModel.updateUserToken(user.id, token);

  return ResponseHandler.logInSuccess(
    res,
    i18n.__('REGISTER_SUCCESS'),
    null,
    token,
  );
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, fcmToken } = req.body;
  const emailLower = email.toLowerCase();
  const currentUser = await userModel.findByEmail(emailLower);

  if (!currentUser) {
    return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
  }

  // Verify the token from the request matches the one in the database
  if (currentUser.token !== currentUser.token) {
    return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
  }

  // Check if the provided email matches the current user's email
  if (currentUser.email.toLowerCase() !== emailLower) {
    return ResponseHandler.badRequest(
      res,
      i18n.__('UNAUTHORIZED_EMAIL_VERIFICATION'),
    );
  }

  // Check if the provided OTP matches the user's OTP
  const isOtpValid = await userModel.verifyOtp(emailLower, otp);
  if (!isOtpValid) {
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

  return ResponseHandler.logInSuccess(
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
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }

  const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);
  await userModel.updateUserToken(user.id, token);

  if (!user.is_active || !user.email_verified) {
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
    await userDevicesModel.saveUserDevice(user.id, fcmToken);
  }

  return ResponseHandler.logInSuccess(
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
    },
    token,
  );
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  return ResponseHandler.success(res, user);
});

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = await authHandler(req, res, next);

    await userModel.updateUserToken(user, null);
    return ResponseHandler.success(res, i18n.__('LOGOUT_SUCCESS'));
  },
);

export const resendOtpAndUpdateDB = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    await userModel.updateResetPasswordOTP(email, otp);

    sendVerificationEmail(email, otp);

    return ResponseHandler.success(res, i18n.__('OTP_SENT_SUCCESSFULLY'));
  },
);

export const updatePasswordWithOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    const isValidOTP = await userModel.checkResetPasswordOTP(email, otp);
    if (!isValidOTP) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.updateUserPassword(email, hashedPassword);
    await userModel.updateResetPasswordOTP(email, null);

    return ResponseHandler.success(
      res,
      i18n.__('PASSWORD_RESET_SUCCESS'),
      null,
    );
  },
);

export const updatePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { password, newPassword } = req.body;
    const user = await authHandler(req, res, next);

    const result = await userModel.getOne(user);

    if (!result || !result.password) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }

    const isPasswordValid = bcrypt.compareSync(password, result.password);
    if (!isPasswordValid) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);
    await userModel.updateUserPassword(result.email, hashedPassword);

    return ResponseHandler.success(
      res,
      i18n.__('PASSWORD_RESET_SUCCESS'),
      null,
    );
  },
);
