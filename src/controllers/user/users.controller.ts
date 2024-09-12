/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import UserModel from '../../models/users/user.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { User } from '../../types/user.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import { uploadFormData } from '../../middlewares/uploadImageFormData';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const userModel = new UserModel();

export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const newUser: User = req.body;
  const user = await authHandler(req, res);

  try {
    const createdUser = await userModel.createUser(newUser);
    ResponseHandler.success(
      res,
      i18n.__('USER_CREATED_SUCCESSFULLY'),
      createdUser,
    );
    const action = 'createUser';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('USER_CREATED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const source = 'createUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const users = await userModel.getMany();
    ResponseHandler.success(
      res,
      i18n.__('USERS_RETRIEVED_SUCCESSFULLY'),
      users,
    );
  } catch (error: any) {
    const source = 'getAllUsers';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const getAllCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const users = await userModel.getCustomers();
      ResponseHandler.success(
        res,
        i18n.__('CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        users,
      );
    } catch (error: any) {
      const source = 'getAllCustomers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
export const getAllRelativeCustomers = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const users = await userModel.getRelativeCustomers();
      ResponseHandler.success(
        res,
        i18n.__('RELATIVE_CUSTOMERS_RETRIEVED_SUCCESSFULLY'),
        users,
      );
    } catch (error: any) {
      const source = 'getAllRelativeCustomers';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.body.id;
  try {
    const user = await userModel.getOne(userId);
    if (!user) {
      const user = await authHandler(req, res);
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
    const user = await authHandler(req, res);
    const source = 'getUserById';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  const userId = req.params.userId;
  uploadFormData('image')(req, res, async (err: any) => {
    if (err) {
      const source = 'updateUser';
      systemLog.createSystemLog(user, 'Image Not Uploaded to user', source);
      return ResponseHandler.badRequest(res, err.message);
    }
    const userData: Partial<User> = req.body;

    if (req.file) {
      userData.avatar = req.file.filename;
    }

    try {
      let updatedUser;
      if (userId) {
        updatedUser = await userModel.updateOne(userData, userId);
      } else {
        updatedUser = await userModel.updateOne(userData, user);
      }

      ResponseHandler.success(
        res,
        i18n.__('USER_UPDATED_SUCCESSFULLY'),
        updatedUser,
      );
      const action = 'updateUser';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_UPDATED_SUCCESSFULLY'),
        null,
      );
    } catch (error: any) {
      const source = 'updateUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  });
});

export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.params.userId;
  try {
    const deletedUser = await userModel.deleteOne(userId);
    ResponseHandler.success(
      res,
      i18n.__('USER_DELETED_SUCCESSFULLY'),
      deletedUser,
    );
    const auditUser = await authHandler(req, res);
    const action = 'deleteUser';
    auditTrail.createAuditTrail(
      auditUser,
      action,
      i18n.__('USER_DELETED_SUCCESSFULLY'),
      null,
    );
  } catch (error: any) {
    const user = await authHandler(req, res);
    const source = 'deleteUser';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
  }
});

export const updateUserStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    const { userId, status } = req.body;

    try {
      const updatedUser = await userModel.updateUserStatus(userId, status);
      ResponseHandler.success(
        res,
        i18n.__('USER_STATUS_UPDATED_SUCCESSFULLY'),
        updatedUser,
      );
      const action = 'updateUserStatus';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('USER_STATUS_UPDATED_SUCCESSFULLY'),
        null,
      );
    } catch (error: any) {
      const source = 'updateUserStatus';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
