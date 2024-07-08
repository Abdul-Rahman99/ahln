/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import PermissionModel from '../../models/users/permission.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';

const permissionModel = new PermissionModel();

export const createPermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description } = req.body;
    const permission = await permissionModel.create(title, description);
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_CREATED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const getAllPermissions = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const permissions = await permissionModel.getAll();
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permissions,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const getPermissionById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const permission = await permissionModel.getById(Number(id));
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_RETRIEVED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const updatePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const permission = await permissionModel.update(
      Number(id),
      title,
      description,
    );
    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_UPDATED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

export const deletePermission = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const permission = await permissionModel.delete(Number(id));

    ResponseHandler.success(
      res,
      i18n.__('PERMISSION_DELETED_SUCCESSFULLY'),
      permission,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};
