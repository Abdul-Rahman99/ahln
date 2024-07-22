import { Request, Response } from 'express';
import TabletModel from '../../models/box/tablet.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Tablet } from '../../types/tablet.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const tabletModel = new TabletModel();

export const createTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newTablet: Tablet = req.body;
      const createdTablet = await tabletModel.createTablet(newTablet);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
        createdTablet,
      );
      const auditUser = await authHandler(req, res);
      const action = 'createTablet';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'createTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getAllTablets = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tablets = await tabletModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('TABLETS_RETRIEVED_SUCCESSFULLY'),
        tablets,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getAllTablets';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const getTabletById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const tablet = await tabletModel.getOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RETRIEVED_SUCCESSFULLY'),
        tablet,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'getTabletById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const updateTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const tabletData: Partial<Tablet> = req.body;
      const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        updatedTablet,
      );
      const auditUser = await authHandler(req, res);
      const action = 'updateTablet';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'updateTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const deletedTablet = await tabletModel.deleteOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
        deletedTablet,
      );
      const auditUser = await authHandler(req, res);
      const action = 'deleteTablet';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
      );
    } catch (error) {
      const user = await authHandler(req, res);
      const source = 'deleteTablet';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
