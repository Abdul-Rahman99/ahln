/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import RolePermissionModel from '../../models/users/role.permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';

const rolePermissionModel = new RolePermissionModel();

export const assignPermissionToRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is already assigned to the role
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );
    if (isAssigned) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('ROLE_ALREADY_ASSIGNED_TO_USER'),
      );
    }

    // Proceed to assign permission if not already assigned
    await rolePermissionModel.assignPermission(role_id, permission_id);
    ResponseHandler.success(
      res,
      i18n.__('ROLE_ASSIGNED_SUCCESSFULLY'),
      role_id,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const removePermissionFromRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is assigned to the role before attempting to remove
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );
    if (!isAssigned) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('PERMISSION_NOT_ASSIGNED_TO_USER'),
      );
    }

    await rolePermissionModel.revokePermission(role_id, permission_id);
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'),
      role_id,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const getPermissionsByRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { roleId } = req.params;

    if (!roleId) {
      return ResponseHandler.badRequest(res, i18n.__('ROLE_ID_REQUIRED'));
    }

    const roleIdNumber = Number(roleId);
    if (isNaN(roleIdNumber)) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('ROLE_ID_MUST_BE_VALID_NUMBER'),
      );
    }

    const permissions =
      await rolePermissionModel.getPermissionsByRole(roleIdNumber);
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permissions,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, i18n.__('PERMISSION_ROLE_RETRIVED_FAILED'));
    next(error);
  }
};
