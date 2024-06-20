import { Request, Response } from 'express';
import UserPermissionModel from '../models/users/user.permission.model';
import asyncHandler from '../middlewares/asyncHandler';
import { UserPermission } from '../types/user.permission.type';
import i18n from '../config/i18n';

const userPermissionModel = new UserPermissionModel();

export const createUserPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const newUserPermission: UserPermission = req.body;
    const createdUserPermission =
      await userPermissionModel.create(newUserPermission);
    res.status(201).json({
      message: i18n.__('USER_PERMISSION_CREATED_SUCCESSFULLY'),
      data: createdUserPermission,
    });
  },
);

export const getAllUserPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const userPermissions = await userPermissionModel.getMany();
    res.json(userPermissions);
  },
);

export const getUserPermissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { user_id, permission_id } = req.params;
    const userPermission = await userPermissionModel.getOne(
      user_id,
      Number(permission_id),
    );
    res.json(userPermission);
  },
);

export const deleteUserPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { user_id, permission_id } = req.params;
    const deletedUserPermission = await userPermissionModel.deleteOne(
      user_id,
      Number(permission_id),
    );
    res.json({
      message: i18n.__('USER_PERMISSION_DELETED_SUCCESSFULLY'),
      deletedUserPermission,
    });
  },
);
