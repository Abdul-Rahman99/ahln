/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserPermissionModel from '../../models/users/user.permission.model';

const userPermissionModel = new UserPermissionModel();

export const assignPermissionToUser = async (req: Request, res: Response) => {
  try {
    const { user_id, permission_id } = req.body;

    // Check if permission is already assigned to the user
    const isAssigned = await userPermissionModel.checkPermissionAssignment(
      user_id,
      permission_id,
    );
    if (isAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Permission is already assigned to the user ' + user_id,
      });
    }

    await userPermissionModel.assignPermission(user_id, permission_id);
    res.status(201).json({
      success: true,
      message: 'Permission assigned to user ' + user_id,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message, success: false });
  }
};

export const removePermissionFromUser = async (req: Request, res: Response) => {
  try {
    const { user_id, permission_id } = req.body;

    // Check if permission is assigned to the user
    const isAssigned = await userPermissionModel.checkPermissionAssignment(
      user_id,
      permission_id,
    );
    if (!isAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Permission is not assigned to the user.',
      });
    }

    await userPermissionModel.revokePermission(user_id, permission_id);
    res.status(200).json({
      success: true,
      message: 'Permission removed from user ' + user_id,
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPermissionsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const permissions = await userPermissionModel.getPermissionsByUser(userId);

    // Check if permissions array is empty
    if (permissions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No permissions found for user ' + userId,
      });
    }

    res.status(200).json({ success: true, message: permissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
