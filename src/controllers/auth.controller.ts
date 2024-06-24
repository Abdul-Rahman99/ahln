import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';
import UserModel from '../models/users/user.model';
import asyncHandler from '../middlewares/asyncHandler';
import config from '../../config';
import { User } from '../types/user.type';
import i18n from '../config/i18n';

const userModel = new UserModel();

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id }, config.JWT_SECRET_KEY!);
};

const sendVerificationEmail = async (email: string, otp: string) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: 'developer@dccme.ai', // replace this with developer@dccme.ai
      pass: 'yfen ping pjfh emkp', // replace this with google app password
    },
  });

  const mailOptions = {
    from: 'AHLN App',
    to: email,
    subject: 'Verify your email',
    html: `<p>Your OTP for email verification is: <b>${otp}</b></p>`,
  };

  await transporter.sendMail(mailOptions);
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, user_name, phone_number, password }: User = req.body;

  // Check if email or phone already exists
  const emailExists = await userModel.emailExists(email);
  if (emailExists) {
    res.status(400);
    throw new Error(i18n.__('EMAIL_ALREADY_REGISTERED'));
  }

  const phoneExists = await userModel.phoneExists(phone_number);
  if (phoneExists) {
    res.status(400);
    throw new Error(i18n.__('PHONE_ALREADY_REGISTERED'));
  }

  // Hash the password
  const hashedPassword = bcrypt.hashSync(password + config.JWT_SECRET_KEY, 10);

  // Create the user
  const user = await userModel.createUser({
    email,
    user_name,
    phone_number,
    password: hashedPassword,
  } as User);

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await userModel.saveOtp(email, otp);

  // Send verification email
  await sendVerificationEmail(email, otp);

  // Generate JWT token
  const token = generateToken(user);

  res.status(201).json({ message: i18n.__('REGISTER_SUCCESS'), user, token });
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  // Find the user by email
  const user = await userModel.findByEmail(email);
  if (!user) {
    res.status(404);
    throw new Error(i18n.__('USER_NOT_FOUND'));
  }

  // Check if the provided OTP matches the user's OTP
  const isOtpValid = await userModel.verifyOtp(email, otp);
  if (!isOtpValid) {
    res.status(400);
    throw new Error(i18n.__('INVALID_OTP'));
  }

  // Update the user's email_verified status
  await userModel.updateUser(email, {
    email_verified: true,
    register_otp: null,
  });

  res.status(200).json({ message: i18n.__('EMAIL_VERIFIED_SUCCESS') });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Check if both email and password are provided
  if (!email || !password) {
    res.status(400);
    throw new Error(i18n.__('MISSING_CREDENTIALS'));
  }

  // Find the user by email
  const user = await userModel.findByEmail(email);

  // Check if the user exists and if the password is correct
  if (
    !user ||
    !bcrypt.compareSync(password + config.JWT_SECRET_KEY, user.password)
  ) {
    res.status(401);
    throw new Error(i18n.__('INVALID_CREDENTIALS'));
  }

  // Generate token
  const token = generateToken(user);

  // Send response
  res.json({
    message: i18n.__('LOGIN_SUCCESS'),
    data: { email: user.email },
    token,
  });
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  res.json(user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Invalidate token (handled on the client side)
  res.status(200).json({ message: i18n.__('LOGOUT_SUCCESS') });
});
