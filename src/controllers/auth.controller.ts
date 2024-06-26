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
import { authMiddleware } from '../middlewares/auth.middleware';
import UserDevicesModel from '../models/users/user.devices.model';
import ResponseHandler from '../utils/responsesHandler';
const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();

const generateToken = (user: User) => {
  return jwt.sign(
    { id: user.id, email_verified: user.email_verified },
    config.JWT_SECRET_KEY!,
  );
};
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
    email_verified: false, // Assuming email is not verified initially
  } as User);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await userModel.saveOtp(email, otp);

  // Send verification email
  sendVerificationEmail(email, otp);

  // Generate JWT token
  const token = generateToken(user);

  ResponseHandler.success(res, i18n.__('REGISTER_SUCCESS'), null, token);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, fcmToken } = req.body;

  // Verify token using authMiddleware
  authMiddleware(req, res, async () => {
    const currentUser = req.currentUser as User;
    const emailLower = email.toLowerCase();
    try {
      // Check if the provided email matches the token's email
      if (currentUser.email !== emailLower) {
        ResponseHandler.badRequest(
          res,
          i18n.__('UNAUTHORIZED_EMAIL_VERIFICATION'),
        );
      }

      // Check if the provided OTP matches the user's OTP
      const isOtpValid = await userModel.verifyOtp(emailLower, otp);
      if (!isOtpValid) {
        ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'));
        return; // Return to exit the function
      }

      // Update the user's email_verified status
      await userModel.updateUser(emailLower, {
        email_verified: true,
        register_otp: null,
      });

      // Save the FCM token and user ID to the user_devices table
      if (fcmToken) {
        await userDevicesModel.saveUserDevice(currentUser.id, fcmToken);
      }
      ResponseHandler.success(
        res,
        i18n.__('EMAIL_VERIFIED_SUCCESS'),
        currentUser,
      );
    } catch (error: any) {
      // Handle any errors that occur during verification
      ResponseHandler.internalError(res, error.message);
    }
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fcmToken } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    return ResponseHandler.badRequest(res, i18n.__('MISSING_CREDENTIALS'));
  }

  // Find the user by email
  const user = await userModel.findByEmail(email);
  if (user === null) {
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }

  const isPasswordValid = bcrypt.compareSync(password, user.password);
  // console.log(isPasswordValid);

  if (!isPasswordValid) {
    return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
  }
  // Generate token
  const token = generateToken(user);
  // Check if the user is active and email is verified
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

  // Save the FCM token and user ID to the user_devices table
  if (fcmToken) {
    await userDevicesModel.saveUserDevice(user.id, fcmToken);
  }

  // Send response
  ResponseHandler.success(
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
  res.json({ success: true, data: user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Invalidate token (handled on the client side)
  ResponseHandler.success(res, i18n.__('LOGOUT_SUCCESS'));
});

export const resendOtp = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  // Find the user by email
  const user = await userModel.findByEmail(email);
  if (!user) {
    ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
  }

  // Generate new OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Update OTP in the database
  await userModel.saveOtp(email, otp);

  // Resend verification email with new OTP
  await sendVerificationEmail(email, otp);

  ResponseHandler.success(res, i18n.__('OTP_RESENT_SUCCESS'));
});
