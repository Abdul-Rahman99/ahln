/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/role.controller.ts
import { Request, Response } from 'express';
import RoleModel from '../../models/users/role.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const roleModel = new RoleModel();

export const createRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { title, description } = req.body;
    const role = await roleModel.create(title, description);
    const action = 'createRole';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('ROLE_CREATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(res, i18n.__('ROLE_CREATED_SUCCESSFULLY'), role);
  } catch (error: any) {
    const source = 'createRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getAllRoles = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const roles = await roleModel.getAll();
    ResponseHandler.success(
      res,
      i18n.__('ROLES_RETRIEVED_SUCCESSFULLY'),
      roles,
    );
  } catch (error: any) {
    const source = 'getAllRoles';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const getRoleById = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { id } = req.params;
    const role = await roleModel.getById(Number(id));
    ResponseHandler.success(res, i18n.__('ROLE_RETRIEVED_SUCCESSFULLY'), role);
  } catch (error: any) {
    const source = 'getRoleById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const updateRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const role = await roleModel.update(Number(id), title, description);
    const action = 'updateRole';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('ROLE_UPDATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(res, i18n.__('ROLE_UPDATED_SUCCESSFULLY'), role);
  } catch (error: any) {
    const source = 'updateRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};

export const deleteRole = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const { id } = req.params;
    const role = await roleModel.delete(Number(id));
    const action = 'deleteRole';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('ROLE_DELETED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(res, i18n.__('ROLE_DELETED_SUCCESSFULLY'), role);
  } catch (error: any) {
    const source = 'deleteRole';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
};
