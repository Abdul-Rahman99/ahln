import { Request, Response } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import UserModel from '../models/users/user.model';

const userModel = new UserModel();

export const getToken = asyncHandler(async (req: Request, res: Response) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(403).send({ message: 'No token provided.' });
  }

  const checkToken = await userModel.findByToken(token);
  if (!checkToken) {
    return res
      .status(403)
      .send({ success: false, message: 'Token Invalid.', data: {} });
  }
  return res
    .status(200)
    .send({ success: true, message: 'Token Valid.', data: {} });
});

export const noToken = asyncHandler(async (req: Request, res: Response) => {
  return res
    .status(200)
    .send({ success: true, message: 'Server Is Alive.', data: {} });
});
