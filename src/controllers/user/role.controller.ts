/* eslint-disable @typescript-eslint/no-explicit-any */
// src/controllers/role.controller.ts
import { Request, Response, NextFunction } from 'express';
import RoleModel from '../../models/users/role.model';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';

const roleModel = new RoleModel();

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, description } = req.body;
    const role = await roleModel.create(title, description);
    ResponseHandler.success(res, i18n.__('ROLE_CREATED_SUCCESSFULLY'), role);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const getAllRoles = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const roles = await roleModel.getAll();
    ResponseHandler.success(
      res,
      i18n.__('ROLES_RETRIEVED_SUCCESSFULLY'),
      roles,
    );
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const getRoleById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const role = await roleModel.getById(Number(id));
    ResponseHandler.success(res, i18n.__('ROLE_RETRIEVED_SUCCESSFULLY'), role);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const updateRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const role = await roleModel.update(Number(id), title, description);
    ResponseHandler.success(res, i18n.__('ROLE_UPDATED_SUCCESSFULLY'), role);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};

export const deleteRole = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const role = await roleModel.delete(Number(id));
    ResponseHandler.success(res, i18n.__('ROLE_DELETED_SUCCESSFULLY'), role);
  } catch (error: any) {
    ResponseHandler.badRequest(res, error.message);
    next(error);
  }
};
