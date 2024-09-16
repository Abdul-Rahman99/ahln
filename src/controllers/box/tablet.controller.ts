import { Request, Response } from 'express';
import TabletModel from '../../models/box/tablet.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Tablet } from '../../types/tablet.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const tabletModel = new TabletModel();

export const createTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const newTablet: Tablet = req.body;
      const createdTablet = await tabletModel.createTablet(newTablet);

      const action = 'createTablet';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
        createdTablet,
      );
    } catch (error) {
      const source = 'createTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllTablets = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const tablets = await tabletModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('TABLETS_RETRIEVED_SUCCESSFULLY'),
        tablets,
      );
    } catch (error) {
      const source = 'getAllTablets';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getTabletById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const tabletId = req.params.id;
      const tablet = await tabletModel.getOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RETRIEVED_SUCCESSFULLY'),
        tablet,
      );
    } catch (error) {
      const source = 'getTabletById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const tabletId = req.params.id;
      const tabletData: Partial<Tablet> = req.body;
      const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);

      const action = 'updateTablet';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        updatedTablet,
      );
    } catch (error) {
      const source = 'updateTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const tabletId = req.params.id;
      const deletedTablet = await tabletModel.deleteOne(tabletId);

      const action = 'deleteTablet';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
        deletedTablet,
      );
    } catch (error) {
      const source = 'deleteTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
