import { Request, Response } from 'express';
import UserModel from '../models/user.model';
import asyncHandler from '../lib/middlewares/asyncHandler';
import User from '../types/user.type';

const userModel = new UserModel();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const newUser: User = req.body;
  const createdUser = await userModel.create(newUser);
  res.status(201).json({
    message: 'User Created Successfully',
    data: createdUser,
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userModel.getMany();
  res.json(users);
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await userModel.getOne(userId);
  res.json(user);
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData: Partial<User> = req.body;
  const updatedUser = await userModel.updateOne(userData, userId);
  res.json({ message: 'User Deleted Successfully!', updatedUser });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const deletedUser = await userModel.deleteOne(userId);
  res.json({ message: 'User Deleted Successfully!', deletedUser });
});
