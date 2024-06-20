import { Request, Response } from 'express';
import PermissionModel from '../models/users/permission.model';
import asyncHandler from '../middlewares/asyncHandler';
import { Permission } from '../types/permission.type';
import i18n from '../config/i18n';

const permissionModel = new PermissionModel();

export const createPermission = asyncHandler(
  async (req: Request, res: Response) => {
    const newPermission: Permission = req.body;
    const createdPermission = await permissionModel.create(newPermission);
    res.status(201).json({
      message: i18n.__('PERMISSION_CREATED_SUCCESSFULLY'),
      data: createdPermission,
    });
  },
);

export const getAllPermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const permissions = await permissionModel.getMany();
    res.json(permissions);
  },
);

export const getPermissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionId = req.params.id;
    const permission = await permissionModel.getOne(Number(permissionId));
    res.json(permission);
  },
);

export const updatePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionId = req.params.id;
    const permissionData: Partial<Permission> = req.body;
    const updatedPermission = await permissionModel.updateOne(
      permissionData,
      Number(permissionId),
    );
    res.json({
      message: i18n.__('PERMISSION_UPDATED_SUCCESSFULLY'),
      updatedPermission,
    });
  },
);

export const deletePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const permissionId = req.params.id;
    const deletedPermission = await permissionModel.deleteOne(
      Number(permissionId),
    );
    res.json({
      message: i18n.__('PERMISSION_DELETED_SUCCESSFULLY'),
      deletedPermission,
    });
  },
);
