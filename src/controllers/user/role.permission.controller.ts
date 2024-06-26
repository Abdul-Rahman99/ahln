/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import RolePermissionModel from '../../models/users/role.permission.model';

const rolePermissionModel = new RolePermissionModel();

export const assignPermissionToRole = async (req: Request, res: Response) => {
  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is already assigned to the role
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );
    if (isAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Permission is already assigned to the role.',
      });
    }

    // Proceed to assign permission if not already assigned
    await rolePermissionModel.assignPermission(role_id, permission_id);
    res
      .status(201)
      .json({ success: true, message: 'Permission assigned to role' });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removePermissionFromRole = async (req: Request, res: Response) => {
  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is assigned to the role before attempting to remove
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );
    if (!isAssigned) {
      return res.status(400).json({
        success: false,
        message: 'Permission is not assigned to the role.',
      });
    }

    await rolePermissionModel.revokePermission(role_id, permission_id);
    res
      .status(200)
      .json({ success: true, message: 'Permission removed from role' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getPermissionsByRole = async (req: Request, res: Response) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return res
        .status(400)
        .json({ success: false, message: 'Role ID parameter is required.' });
    }

    const roleIdNumber = Number(roleId);
    if (isNaN(roleIdNumber)) {
      return res
        .status(400)
        .json({ success: false, message: 'Role ID must be a valid number.' });
    }

    const permissions =
      await rolePermissionModel.getPermissionsByRole(roleIdNumber);
    res.status(200).json({ success: true, data: permissions });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
