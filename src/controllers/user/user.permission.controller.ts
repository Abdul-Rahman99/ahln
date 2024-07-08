/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import UserPermissionModel from '../../models/users/user.permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';

const userPermissionModel = new UserPermissionModel();

export const assignPermissionToUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, permission_id } = req.body;

    // Check if permission is already assigned to the user
    const isAssigned = await userPermissionModel.checkPermissionAssignment(
      user_id,
      permission_id,
    );
    if (isAssigned) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('PERMISSION_ALREADY_ASSIGNED_TO_USER'),
      );
    }

    await userPermissionModel.assignPermission(user_id, permission_id);
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_ASSIGNED_TO_USER_SUCCESSFULLY'),
      user_id,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const removePermissionFromUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { user_id, permission_id } = req.body;

    // Check if permission is assigned to the user
    const isAssigned = await userPermissionModel.checkPermissionAssignment(
      user_id,
      permission_id,
    );
    if (!isAssigned) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('PERMISSION_IS_NOT_ASSIGNED_TO_USER'),
      );
    }

    await userPermissionModel.revokePermission(user_id, permission_id);
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'),
      user_id,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const getPermissionsByUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { userId } = req.params;
    const permissions =
      await userPermissionModel.getPermissionsByUserId(userId);

    // Check if permissions array is empty
    if (permissions.length === 0) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('NO_PERMISSION_FOUND_FOR_USER'),
        userId,
      );
    }

    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_BY_USER_SUCCESSFULLY'),
      userId,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};
