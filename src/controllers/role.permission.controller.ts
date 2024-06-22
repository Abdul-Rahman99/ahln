/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/rolePermission.controller.ts
import { Request, Response } from 'express';
import RolePermissionModel from '../models/users/role.permission.model';

const rolePermissionModel = new RolePermissionModel();

export const assignPermissionToRole = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;
    const rolePermission = await rolePermissionModel.assignPermission(
      roleId,
      permissionId,
    );
    res.status(201).json(rolePermission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removePermissionFromRole = async (req: Request, res: Response) => {
  try {
    const { roleId, permissionId } = req.body;
    await rolePermissionModel.revokePermission(roleId, permissionId);
    res.status(200).json({ message: 'Permission removed from role' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermissionsByRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;
    const permissions = await rolePermissionModel.getPermissionsByRole(
      Number(roleId),
    );
    res.status(200).json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
