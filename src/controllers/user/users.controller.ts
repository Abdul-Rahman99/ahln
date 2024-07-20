/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import UserModel from '../../models/users/user.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { User } from '../../types/user.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import authHandler from '../../utils/authHandler';
import { uploadSingleImage } from '../../middlewares/uploadSingleImage';
import SystemLogModel from '../../models/logs/system.log.model';
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const systemLog = new SystemLogModel();

const userModel = new UserModel();

export const createUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser: User = req.body;
    try {
      const createdUser = await userModel.createUser(newUser);
      ResponseHandler.success(
        res,
        i18n.__('USER_CREATED_SUCCESSFULLY'),
        createdUser,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'createUser';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('USER_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getAllUsers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('USERS_RETRIEVED_SUCCESSFULLY'),
        users,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllUsers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const getUserById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
      const user = await userModel.getOne(userId);
      if (!user) {
        const user = await authHandler(req, res, next);
        const source = 'getUserById';
        systemLog.createSystemLog(user, 'User Not Found', source);
        ResponseHandler.badRequest(res, i18n.__('USER_NOT_FOUND'));
      } else {
        ResponseHandler.success(
          res,
          i18n.__('USER_RETRIEVED_SUCCESSFULLY'),
          user,
        );
      }
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getUserById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);

export const updateUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    uploadSingleImage('image')(req, res, async (err: any) => {
      if (err) {
        const user = await authHandler(req, res, next);
        const source = 'updateUser';
        systemLog.createSystemLog(user, 'Image Not Uploaded to user', source);
        return ResponseHandler.badRequest(res, err.message);
      }
      const userData: Partial<User> = req.body;

      if (req.file) {
        userData.avatar = req.file.filename;
      }

      try {
        const user = await authHandler(req, res, next);
        const updatedUser = await userModel.updateOne(userData, user);

        ResponseHandler.success(
          res,
          i18n.__('USER_UPDATED_SUCCESSFULLY'),
          updatedUser,
        );
        const auditUser = await authHandler(req, res, next);
        const action = 'updateUser';
        auditTrail.createAuditTrail(
          auditUser,
          action,
          i18n.__('USER_UPDATED_SUCCESSFULLY'),
        );
      } catch (error: any) {
        const user = await authHandler(req, res, next);
        const source = 'updateUser';
        systemLog.createSystemLog(user, (error as Error).message, source);
        ResponseHandler.badRequest(res, error.message);
        next(error);
      }
    });
  },
);

export const deleteUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    try {
      const deletedUser = await userModel.deleteOne(userId);
      ResponseHandler.success(
        res,
        i18n.__('USER_DELETED_SUCCESSFULLY'),
        deletedUser,
      );
      const auditUser = await authHandler(req, res, next);
      const action = 'deleteUser';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('USER_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      next(error);
    }
  },
);
