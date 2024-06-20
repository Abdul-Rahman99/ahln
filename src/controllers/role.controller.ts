import { Request, Response } from 'express';
import RoleModel from '../models/users/role.model';
import asyncHandler from '../middlewares/asyncHandler';
import { Role } from '../types/role.type';
import i18n from '../config/i18n';

const roleModel = new RoleModel();

export const createRole = asyncHandler(async (req: Request, res: Response) => {
  const newRole: Role = req.body;
  const createdRole = await roleModel.create(newRole);
  res.status(201).json({
    message: i18n.__('ROLE_CREATED_SUCCESSFULLY'),
    data: createdRole,
  });
});

export const getAllRoles = asyncHandler(async (req: Request, res: Response) => {
  const roles = await roleModel.getMany();
  res.json(roles);
});

export const getRoleById = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const role = await roleModel.getOne(Number(roleId));
  res.json(role);
});

export const updateRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const roleData: Partial<Role> = req.body;
  const updatedRole = await roleModel.updateOne(roleData, Number(roleId));
  res.json({ message: i18n.__('ROLE_UPDATED_SUCCESSFULLY'), updatedRole });
});

export const deleteRole = asyncHandler(async (req: Request, res: Response) => {
  const roleId = req.params.id;
  const deletedRole = await roleModel.deleteOne(Number(roleId));
  res.json({ message: i18n.__('ROLE_DELETED_SUCCESSFULLY'), deletedRole });
});
