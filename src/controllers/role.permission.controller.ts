import { Request, Response } from 'express';
import RolePermissionModel from '../models/users/role.permission.model';
import asyncHandler from '../middlewares/asyncHandler';
import { RolePermission } from '../types/role.permission.type';
import i18n from '../config/i18n';

const rolePermissionModel = new RolePermissionModel();

export const createRolePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const newRolePermission: RolePermission = req.body;
    const createdRolePermission =
      await rolePermissionModel.create(newRolePermission);
    res.status(201).json({
      message: i18n.__('ROLE_PERMISSION_CREATED_SUCCESSFULLY'),
      data: createdRolePermission,
    });
  },
);

export const getAllRolePermissions = asyncHandler(
  async (req: Request, res: Response) => {
    const rolePermissions = await rolePermissionModel.getMany();
    res.json(rolePermissions);
  },
);

export const getRolePermissionById = asyncHandler(
  async (req: Request, res: Response) => {
    const { role_id, permission_id } = req.params;
    const rolePermission = await rolePermissionModel.getOne(
      Number(role_id),
      Number(permission_id),
    );
    res.json(rolePermission);
  },
);

export const deleteRolePermission = asyncHandler(
  async (req: Request, res: Response) => {
    const { role_id, permission_id } = req.params;
    const deletedRolePermission = await rolePermissionModel.deleteOne(
      Number(role_id),
      Number(permission_id),
    );
    res.json({
      message: i18n.__('ROLE_PERMISSION_DELETED_SUCCESSFULLY'),
      deletedRolePermission,
    });
  },
);
