/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import PermissionModel from '../../models/users/permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const systemLog = new SystemLogModel();
const auditTrail = new AuditTrailModel();
const permissionModel = new PermissionModel();

export const createPermission = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { title, description } = req.body;
    const permission = await permissionModel.create(title, description);

    const action = 'createPermission';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('PERMISSION_CREATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_CREATED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    const source = 'createPermission';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getAllPermissions = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const permissions = await permissionModel.getAll();
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permissions,
    );
  } catch (error: any) {
    const source = 'getAllPermissions';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getPermissionById = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { id } = req.params;
    const permission = await permissionModel.getById(Number(id));
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    const source = 'getPermissionById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const updatePermission = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const permission = await permissionModel.update(
      Number(id),
      title,
      description,
    );

    const action = 'updatePermission';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('PERMISSION_UPDATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_UPDATED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    const source = 'updatePermission';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const deletePermission = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { id } = req.params;
    const permission = await permissionModel.delete(Number(id));

    const action = 'deletePermission';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('PERMISSION_DELETED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_DELETED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    const source = 'deletePermission';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};
