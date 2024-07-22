/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import UserPermissionModel from '../../models/users/user.permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();

import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

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
      const user = await authHandler(req, res, next);
      const source = 'assignPermissionToUser';
      systemLog.createSystemLog(user, 'Permission Already Assigned', source);
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
    const auditUser = await authHandler(req, res, next);
    const action = 'assignPermissionToUser';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('PERMISSION_ASSIGNED_TO_USER_SUCCESSFULLY'),
    );
  } catch (error: any) {
    const user = await authHandler(req, res, next);
    const source = 'assignPermissionToUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
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
      const user = await authHandler(req, res, next);
      const source = 'removePermissionFromUser';
      systemLog.createSystemLog(
        user,
        'Permission Not Assigned to user',
        source,
      );
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
    const auditUser = await authHandler(req, res, next);
    const action = 'removePermissionFromUser';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'),
    );
  } catch (error: any) {
    const user = await authHandler(req, res, next);
    const source = 'removePermissionFromUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
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
      const user = await authHandler(req, res, next);
      const source = 'getPermissionsByUser';
      systemLog.createSystemLog(user, 'No Permissions Founf For User', source);
      return ResponseHandler.badRequest(
        res,
        i18n.__('NO_PERMISSION_FOUND_FOR_USER'),
        userId,
      );
    }

    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_BY_USER_SUCCESSFULLY'),
      permissions,
    );
  } catch (error: any) {
    const user = await authHandler(req, res, next);
    const source = 'getPermissionsByUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};
