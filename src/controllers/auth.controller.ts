import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import UserModel from '../models/user.model';
import asyncHandler from '../lib/middlewares/asyncHandler';
import { config } from '../../config';
import User from '../types/user.type';

const userModel = new UserModel();

const generateToken = (user: User) => {
  return jwt.sign({ id: user.id, role: user.role }, config.JWT_SECRET_KEY!, {
    expiresIn: '1h',
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

  res.status(201).json({ user, token });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await userModel.findByEmail(email);
  if (
    !user ||
    !bcrypt.compareSync(password + config.JWT_SECRET_KEY, user.password)
  ) {
    res.status(401);
    throw new Error('Invalid credentials');
  }
  // no expiration for sign in -<< until the user logout >>-
  const token = jwt.sign(
    { id: user.id, role: user.role },
    config.JWT_SECRET_KEY!,
  );

  res.json({ user, token });
});

export const currentUser = asyncHandler(async (req: Request, res: Response) => {
  const user = req.currentUser;
  res.json(user);
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  // invalidate token (handled on the client side)
  res.status(200).json({ message: 'Logged out successfully' });
});
