/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserModel from '../../models/users/user.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { User } from '../../types/user.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const userModel = new UserModel();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const newUser: User = req.body;
  try {
    const createdUser = await userModel.createUser(newUser);
    ResponseHandler.success(
      res,
      i18n.__('USER_CREATED_SUCCESSFULLY'),
      createdUser,
    );
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  try {
    const users = await userModel.getMany();
    ResponseHandler.success(
      res,
      i18n.__('USERS_RETRIEVED_SUCCESSFULLY'),
      users,
    );
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const user = await userModel.getOne(userId);
    if (!user) {
      ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
    } else {
      ResponseHandler.success(
        res,
        i18n.__('USER_RETRIEVED_SUCCESSFULLY'),
        user,
      );
    }
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  const userData: Partial<User> = req.body;
  try {
    const updatedUser = await userModel.updateOne(userData, userId);
    ResponseHandler.success(
      res,
      i18n.__('USER_UPDATED_SUCCESSFULLY'),
      updatedUser,
    );
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const deletedUser = await userModel.deleteOne(userId);
    ResponseHandler.success(
      res,
      i18n.__('USER_DELETED_SUCCESSFULLY'),
      deletedUser,
    );
  } catch (error: any) {
    ResponseHandler.internalError(res, error.message);
  }
});
