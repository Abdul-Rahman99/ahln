/* eslint-disable @typescript-eslint/no-explicit-any */
// src/middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import RolePermissionModel from '../models/users/role.permission.model';
import UserModel from '../models/users/user.model';
import UserPermissionModel from '../models/users/user.permission.model';
import ResponseHandler from '../utils/responsesHandler';
import i18n from '../config/i18n';

const userModel = new UserModel();
const rolePermissionModel = new RolePermissionModel();
const userPermissionModel = new UserPermissionModel();

export const authorize = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
      }

      // Find the user by the token
      const user = await userModel.findByToken(token);

      if (!user) {
        return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
      }

      const userRoleId = await userModel.findRoleIdByUserId(user);

      // Get permissions from the user's role
      const rolePermissions =
        await rolePermissionModel.getPermissionsByRole(userRoleId);
      const rolePermissionTitles = rolePermissions.map(
        (permission) => permission.title,
      );

      // Get user-specific permissions
      const userPermissions =
        await userPermissionModel.getPermissionsByUserId(user);
      const userPermissionTitles = userPermissions.map(
        (permission) => permission.title,
      );

      // Combine role and user-specific permissions
      const allPermissions = new Set([
        ...rolePermissionTitles,
        ...userPermissionTitles,
      ]);

      // Check if user has all required permissions
      const hasPermissions = requiredPermissions.every((permission) =>
        allPermissions.has(permission),
      );

      if (!hasPermissions) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      next();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };
};
