/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import RolePermissionModel from '../../models/users/role.permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const rolePermissionModel = new RolePermissionModel();

export const assignPermissionToRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is already assigned to the role
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );
    if (isAssigned) {
      const source = 'assignPermissionToRole';
      systemLog.createSystemLog(user, 'Role Already Assigned To User', source);
      return ResponseHandler.badRequest(
        res,
        i18n.__('ROLE_ALREADY_ASSIGNED_TO_USER'),
      );
    }

    // Proceed to assign permission if not already assigned
    const result = await rolePermissionModel.assignPermission(
      role_id,
      permission_id,
    );
    ResponseHandler.success(res, i18n.__('ROLE_ASSIGNED_SUCCESSFULLY'), result);
    const action = 'assignPermissionToRole';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('ROLE_ASSIGNED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'assignPermissionToRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const removePermissionFromRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const { role_id, permission_id } = req.body;

    // Check if permission is assigned to the role before attempting to remove
    const isAssigned = await rolePermissionModel.checkPermissionAssignment(
      role_id,
      permission_id,
    );

    if (!isAssigned) {
      const source = 'removePermissionFromRole';
      systemLog.createSystemLog(
        user,
        'Permission Not Assigned To User',
        source,
      );
      return ResponseHandler.badRequest(
        res,
        i18n.__('PERMISSION_NOT_ASSIGNED_TO_USER'),
      );
    }

    const result = await rolePermissionModel.revokePermission(
      role_id,
      permission_id,
    );
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'),
      result,
    );
    const action = 'removePermissionFromRole';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('PERMISSION_REMOVED_FROM_USER_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'removePermissionFromRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getPermissionsByRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const { roleId } = req.params;

    if (!roleId) {
      return ResponseHandler.badRequest(res, i18n.__('ROLE_ID_REQUIRED'));
    }

    const roleIdNumber = Number(roleId);
    if (isNaN(roleIdNumber)) {
      const source = 'getPermissionsByRole';
      systemLog.createSystemLog(user, 'Role Id Must Be Valid Number', source);
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
    const source = 'getPermissionsByRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, i18n.__('PERMISSION_ROLE_RETRIVED_FAILED'));
    // next(error);
  }
};

export const getAllRolePermissions = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  try {
    const permissions = await rolePermissionModel.getAllRolePermissions();
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permissions,
    );
  } catch (error: any) {
    const source = 'getAllRolePermissions';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};
