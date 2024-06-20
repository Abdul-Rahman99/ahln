// import { Request, Response } from 'express';
// import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
// import UserModel from '../models/users/user.model';
// import asyncHandler from '../middlewares/asyncHandler';
// import { config } from '../../config';
// import { User } from '../types/users/user.type';
// import i18n from '../config/i18n';
// import nodemailer from 'nodemailer';

// const userModel = new UserModel();

// const generateToken = (user: User) => {
//   return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET_KEY!, {
//     expiresIn: '1h',
//   });
// };

// const generateOtp = () => {
//   return Math.floor(100000 + Math.random() * 900000).toString();
// };

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: config.EMAIL_USER,
//     pass: config.EMAIL_PASS,
//   },
// });

// export const register = asyncHandler(async (req: Request, res: Response) => {
//   const { email, username, password, phone, role }: User = req.body;
//   const user = await userModel.create({
//     email,
//     username,
//     password,
//     phone,
//     role,
//   } as User);

//   const token = generateToken(user);

//   res.status(201).json({ message: i18n.__('REGISTER_SUCCESS'), user, token });
// });

// export const login = asyncHandler(async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   const user = await userModel.findByEmail(email);
//   if (
//     !user ||
//     !bcrypt.compareSync(password + config.JWT_SECRET_KEY, user.password)
//   ) {
//     res.status(401);
//     throw new Error(i18n.__('INVALID_CREDENTIALS'));
//   }

//   const token = generateToken(user);

//   res.json({ message: i18n.__('LOGIN_SUCCESS'), token });
// });

// export const currentUser = asyncHandler(async (req: Request, res: Response) => {
//   const user = req.currentUser;
//   res.json(user);
// });

// export const logout = asyncHandler(async (req: Request, res: Response) => {
//   res.status(200).json({ message: i18n.__('LOGOUT_SUCCESS') });
// });

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

// export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
//   const { email, otp } = req.body;

//   const user = await userModel.findByEmail(email);
//   if (!user) {
//     res.status(404);
//     throw new Error(i18n.__('USER_NOT_FOUND'));
//   }

//   if (
//     !user.otp_hash ||
//     !user.otp_expiration ||
//     new Date() > new Date(user.otp_expiration)
//   ) {
//     res.status(400);
//     throw new Error(i18n.__('OTP_EXPIRED'));
//   }

//   const isOtpValid = bcrypt.compareSync(otp, user.otp_hash);
//   if (!isOtpValid) {
//     res.status(400);
//     throw new Error(i18n.__('INVALID_OTP'));
//   }

//   const resetToken = jwt.sign({ id: user.id }, config.JWT_SECRET_KEY!, {
//     expiresIn: '15m',
//   });

//   res.json({ message: i18n.__('OTP_VERIFIED'), resetToken });
// });

// export const resetPasswordWithToken = asyncHandler(
//   async (req: Request, res: Response) => {
//     const { resetToken, newPassword } = req.body;

//     let decoded;
//     try {
//       decoded = jwt.verify(resetToken, config.JWT_SECRET_KEY!);
//     } catch (error) {
//       res.status(401);
//       throw new Error(i18n.__('INVALID_OR_EXPIRED_TOKEN'));
//     }

//     const user = await userModel.getOne(decoded.id);
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
