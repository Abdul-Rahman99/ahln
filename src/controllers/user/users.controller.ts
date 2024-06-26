import { Request, Response } from 'express';
import UserModel from '../../models/users/user.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { User } from '../../types/user.type';
import i18n from '../../config/i18n';

const userModel = new UserModel();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const newUser: User = req.body;
  const createdUser = await userModel.createUser(newUser);
  res.status(201).json({
    success: true,
    message: i18n.__('USER_CREATED_SUCCESSFULLY'),
    data: createdUser,
  });
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await userModel.getMany();
  res.json({ success: true, data: users });
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const user = await userModel.getOne(userId);
  res.json({ success: true, message: user });
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData: Partial<User> = req.body;
  const updatedUser = await userModel.updateOne(userData, userId);
  res.json({
    success: true,
    message: i18n.__('USER_UPDATED_SUCCESSFULLY'),
    data: updatedUser,
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const deletedUser = await userModel.deleteOne(userId);
  res.json({
    success: true,
    message: i18n.__('USER_DELETED_SUCCESSFULLY'),
    data: deletedUser,
  });
});
