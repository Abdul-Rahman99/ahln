import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import asyncHandler from '../middlewares/asyncHandler';
import { config } from '../../config';
import User from '../types/user.type';
import i18n from '../config/i18n';

const userModel = new UserModel();

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET_KEY!, {
    expiresIn: '1m',
  });
};

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { email, username, password, phone, role }: User = req.body;
  const user = await userModel.create({
    email,
    username,
    password,
    phone,
    role,
  } as User);

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

  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET_KEY!,
    // { expiresIn: '30s' }, // token expiration time set to 30 seconds for testing <change it if needed>
  );

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
