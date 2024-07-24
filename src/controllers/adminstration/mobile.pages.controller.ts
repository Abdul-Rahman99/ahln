/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import MobilePagesModel from '../../models/adminstration/mobile.pages.model';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const mobilePagesModel = new MobilePagesModel();

export const createMobilePage = asyncHandler(
  async (req: Request, res: Response) => {
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const mobilePage = await mobilePagesModel.createMobilePage(pageData);

      ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_CREATED_SUCCESSFULLY'),
        mobilePage,
      );
      const action = 'createMobilePage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('MOBILE_PAGE_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'createMobilePage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllMobilePages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const mobilePages = await mobilePagesModel.getAllMobilePages();

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGES_FETCHED_SUCCESSFULLY'),
        mobilePages,
      );
    } catch (error: any) {
      const source = 'getAllMobilePages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getMobilePageByTitle = asyncHandler(
  async (req: Request, res: Response) => {
    const { title } = req.body;
    const user = await authHandler(req, res);

    try {
      const mobilePage = await mobilePagesModel.getMobilePageByTitle(title);

      if (!mobilePage) {
        const user = await authHandler(req, res);
        const source = 'getMobilePageByTitle';
        systemLog.createSystemLog(user, 'Mobile Page Not Found', source);
        return ResponseHandler.badRequest(
          res,
          i18n.__('MOBILE_PAGE_NOT_FOUND'),
        );
      }

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_FETCHED_SUCCESSFULLY'),
        mobilePage,
      );
    } catch (error: any) {
      const source = 'getMobilePageByTitle';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateMobilePage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const updatedMobilePage = await mobilePagesModel.updateMobilePage(
        parseInt(id, 10),
        pageData,
      );

      ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_UPDATED_SUCCESSFULLY'),
        updatedMobilePage,
      );
      const action = 'updateMobilePage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('MOBILE_PAGE_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateMobilePage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteMobilePage = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const deletedMobilePage = await mobilePagesModel.deleteMobilePage(
        parseInt(id, 10),
      );

      ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_DELETED_SUCCESSFULLY'),
        deletedMobilePage,
      );
      const action = 'deleteMobilePage';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('MOBILE_PAGE_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteMobilePage';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
