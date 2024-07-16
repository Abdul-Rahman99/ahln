import { Request, Response, NextFunction } from 'express';
import TabletModel from '../../models/box/tablet.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Tablet } from '../../types/tablet.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();

const tabletModel = new TabletModel();

export const createTablet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newTablet: Tablet = req.body;
      const createdTablet = await tabletModel.createTablet(newTablet);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
        createdTablet,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'createTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllTablets = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tablets = await tabletModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('TABLETS_RETRIEVED_SUCCESSFULLY'),
        tablets,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getAllTablets';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getTabletById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tabletId = req.params.id;
      const tablet = await tabletModel.getOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RETRIEVED_SUCCESSFULLY'),
        tablet,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'getTabletById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const updateTablet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tabletId = req.params.id;
      const tabletData: Partial<Tablet> = req.body;
      const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        updatedTablet,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'updateTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteTablet = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const tabletId = req.params.id;
      const deletedTablet = await tabletModel.deleteOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
        deletedTablet,
      );
    } catch (error) {
      const user = await authHandler(req, res, next);
      const source = 'deleteTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
