/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import BoxLockerModel from '../../models/box/box.locker.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { BoxLocker } from '../../types/box.locker.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();

const boxLockerModel = new BoxLockerModel();

export const createBoxLocker = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBoxLocker: BoxLocker = req.body;
      const createdBoxLocker =
        await boxLockerModel.createBoxLocker(newBoxLocker);
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKER_CREATED_SUCCESSFULLY'),
        createdBoxLocker,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'createBoxLocker';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllBoxLockers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxLockers = await boxLockerModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'),
        boxLockers,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllBoxLocker';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getBoxLockerById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxLockerId = req.params.id;
      const boxLocker = await boxLockerModel.getOne(String(boxLockerId));
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKER_RETRIEVED_SUCCESSFULLY'),
        boxLocker,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getBoxLockerById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateBoxLocker = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxLockerId = req.params.id;
      const boxLockerData: Partial<BoxLocker> = req.body;
      const updatedBoxLocker = await boxLockerModel.updateOne(
        boxLockerData,
        String(boxLockerId),
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKER_UPDATED_SUCCESSFULLY'),
        updatedBoxLocker,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'updateBoxLocker';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteBoxLocker = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxLockerId = req.params.id;
      const deletedBoxLocker = await boxLockerModel.deleteOne(
        String(boxLockerId),
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKER_DELETED_SUCCESSFULLY'),
        deletedBoxLocker,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'deleteBoxLocker';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllLockersById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.body.boxId;

      const boxLockers = await boxLockerModel.getAllLockersById(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_LOCKERS_RETRIEVED_SUCCESSFULLY'),
        boxLockers,
      );
    } catch (error: any) {
      const user = await authHandler(req, res, next);
      const source = 'getAllBoxLockersById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
