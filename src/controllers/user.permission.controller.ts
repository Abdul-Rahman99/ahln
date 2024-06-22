/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/userPermission.controller.ts
import { Request, Response } from 'express';
import UserPermissionModel from '../models/users/user.permission.model';

const userPermissionModel = new UserPermissionModel();

export const assignPermissionToUser = async (req: Request, res: Response) => {
  try {
    const { userId, permissionId } = req.body;
    const userPermission = await userPermissionModel.assignPermission(
      userId,
      permissionId,
    );
    res.status(201).json(userPermission);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const removePermissionFromUser = async (req: Request, res: Response) => {
  try {
    const { userId, permissionId } = req.body;
    await userPermissionModel.revokePermission(userId, permissionId);
    res.status(200).json({ message: 'Permission removed from user' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermissionsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const permissions = await userPermissionModel.getPermissionsByUser(userId);
    res.status(200).json(permissions);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
