import { Request, Response, NextFunction } from 'express';
import SystemLogModel from '../../models/logs/system.log.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { SystemLog } from '../../types/system.log.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import authHandler from '../../utils/authHandler';
const systemLogModel = new SystemLogModel();

export const createSystemLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { error, source } = req.body;
      const user = await authHandler(req, res, next);
      const createdSystemLog = await systemLogModel.createSystemLog(
        user,
        error,
        source,
      );
      ResponseHandler.success(
        res,
        i18n.__('SYSTEM_LOG_CREATED_SUCCESSFULLY'),
        createdSystemLog,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllSystemLogs = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemLogs = await systemLogModel.getAllSystemLogs();
      ResponseHandler.success(
        res,
        i18n.__('SYSTEM_LOGS_RETRIEVED_SUCCESSFULLY'),
        systemLogs,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllSystemLog';
      systemLogModel.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getSystemLogById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemLogId = req.params.id;
      const systemLog = await systemLogModel.getSystemLogById(
        parseInt(systemLogId),
      );
      ResponseHandler.success(
        res,
        i18n.__('SYSTEM_LOG_RETRIEVED_SUCCESSFULLY'),
        systemLog,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getSystemLogById';
      systemLogModel.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const updateSystemLog = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemLogId = req.params.id;
      const systemLogData: Partial<SystemLog> = req.body;
      const updatedTablet = await systemLogModel.updateSystemLog(
        systemLogData,
        systemLogId,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        updatedTablet,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateSystemLog';
      systemLogModel.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteSystemLogById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const systemLogId = req.params.id;
      const systemLog = await systemLogModel.deleteSystemLogById(
        parseInt(systemLogId),
      );
      ResponseHandler.success(
        res,
        i18n.__('SYSTEM_LOG_DELETED_SUCCESSFULLY'),
        systemLog,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteSystemLogById';
      systemLogModel.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
