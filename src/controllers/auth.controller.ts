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
  const user = await userModel.create({
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

  res.json({ message: i18n.__('LOGIN_SUCCESS'), token });
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  res.json(user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // Invalidate token (handled on the client side)
  res.status(200).json({ message: i18n.__('LOGOUT_SUCCESS') });
});
