import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/users/user.model';
import asyncHandler from '../middlewares/asyncHandler';
import config from '../../config';
import { User } from '../types/user.type';
import i18n from '../config/i18n';

const userModel = new UserModel();

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id }, config.JWT_SECRET_KEY!);
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

  // Generate JWT token
  const token = generateToken(user);

  res.status(201).json({ message: i18n.__('REGISTER_SUCCESS'), user, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (
    !user ||
    !bcrypt.compareSync(password + config.JWT_SECRET_KEY, user.password)
  ) {
    res.status(401);
    throw new Error(i18n.__('INVALID_CREDENTIALS'));
  }

  const token = generateToken(user);
  res.json({ message: i18n.__('LOGIN_SUCCESS'), data: { email }, token });
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  res.json(user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Invalidate token (handled on the client side)
  res.status(200).json({ message: i18n.__('LOGOUT_SUCCESS') });
});

// export const resetPassword = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email, newPassword } = req.body;

//     const user = await userModel.findByEmail(email);
//     if (!user) {
//       res.status(404);
//       throw new Error(i18n.__('USER_NOT_FOUND'));
//     }

//     const hashedPassword = bcrypt.hashSync(
//       newPassword + config.JWT_SECRET_KEY,
//       parseInt(config.SALT_ROUNDS, 10),
//     );
//     await userModel.updateOne({ password: hashedPassword }, user.id);

//     res.json({ message: i18n.__('PASSWORD_RESET_SUCCESS') });
//   },
// );

// export const requestPasswordReset = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { email } = req.body;

//     const user = await userModel.findByEmail(email);
//     if (!user) {
//       res.status(404);
//       throw new Error(i18n.__('USER_NOT_FOUND'));
//     }

//     const otp = generateOtp();
//     const otpHash = bcrypt.hashSync(otp, parseInt(config.SALT_ROUNDS, 10));

//     // Store OTP hash in user record (you need to add otp_hash and otp_expiration columns in your user table)
//     const otpExpiration = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now
//     await userModel.updateOne(
//       { otp_hash: otpHash, otp_expiration: otpExpiration },
//       user.id,
//     );

//     const mailOptions = {
//       from: config.EMAIL_USER,
//       to: email,
//       subject: i18n.__('PASSWORD_RESET_REQUEST'),
//       text: i18n.__('YOUR_OTP_IS', { otp }),
//     };

//     await transporter.sendMail(mailOptions);

//     res.json({ message: i18n.__('OTP_SENT') });
//   },
// );
