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
const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();

// const generateToken = (token: string) => {
//   return jwt.sign({ token }, config.JWT_SECRET_KEY!);
// };

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
  const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);

  // Update user token in the database
  await userModel.updateUserToken(user.id, token);

  ResponseHandler.success(res, i18n.__('REGISTER_SUCCESS'), null, token);
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp, fcmToken } = req.body;

  try {
    const emailLower = email.toLowerCase();
    const currentUser = await userModel.findByEmail(emailLower);
    // Fetch the user from the database
    const userFromDb = await userModel.findByEmail(emailLower);
    if (!userFromDb) {
      return ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
    }
    console.log(currentUser);

    // Verify the token from the request matches the one in the database
    if (!currentUser || currentUser.token !== userFromDb.token) {
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
    const token = userFromDb.token;

    // Save the FCM token and user ID to the user_devices table
    if (fcmToken) {
      await userDevicesModel.saveUserDevice(userFromDb.id, fcmToken);
    }

    // Send success response
    ResponseHandler.success(
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
  } catch (error: any) {
    // Handle any errors that occur during verification
    ResponseHandler.internalError(res, error.message);
  }
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await userModel.findByEmail(email);
    if (!user) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }
    // Verify password
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_CREDENTIALS'));
    }

    // Generate JWT token
    const token = jwt.sign({ email, password }, config.JWT_SECRET_KEY!);

    // Update user token in the database
    await userModel.updateUserToken(user.id, token);

    // Send success response with token
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
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  res.json({ success: true, data: user });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Extract token from the request headers
  const token = req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
  }

  try {
    // Find the user by the token
    const user = await userModel.findByToken(token);
    if (!user) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
    }
    console.log(user);
    
    await userModel.updateUserToken(user, null);
    // Send a success response
    ResponseHandler.success(res, i18n.__('LOGOUT_SUCCESS'));
  } catch (error: any) {
    // Handle any errors that occur during logout
    ResponseHandler.internalError(res, error.message);
  }
});

// Function to resend OTP and update database
export const resendOtpAndUpdateDB = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = req.body;

    // Generate new OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Update OTP in the database
    await userModel.updateResetPasswordOTP(email, otp);

    // Resend verification email with new OTP
    await sendVerificationEmail(email, otp); // Implement this function to send OTP via email

    ResponseHandler.success(res, i18n.__('OTP_SENT_SUCCESSFULLY'));
  },
);

// Function to update user password based on OTP
export const updatePasswordWithOTP = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, otp, newPassword } = req.body;

    // Step 1: Validate OTP
    const isValidOTP = await userModel.checkResetPasswordOTP(email, otp);

    if (!isValidOTP) {
      return ResponseHandler.badRequest(res, i18n.__('INVALID_OTP'));
    } // Hash the password
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // Step 2: Update password
    await userModel.updateUserPassword(email, hashedPassword);

    // Step 3: Remove/reset OTP (optional, depending on your workflow)
    await userModel.updateResetPasswordOTP(email, null);

    // Respond with success message
    return ResponseHandler.success(
      res,
      i18n.__('PASSWORD_RESET_SUCCESS'),
      null,
    );
  },
);
