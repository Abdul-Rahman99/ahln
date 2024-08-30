/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import AboutUsModel from '../../models/adminstration/about.us.model';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const aboutUsModel = new AboutUsModel();

export const createAboutUs = asyncHandler(
  async (req: Request, res: Response) => {
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const aboutUs = await aboutUsModel.createAboutUs(pageData);

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_CREATED_SUCCESSFULLY'),
        aboutUs,
      );
      const action = 'createAboutUs';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'createAboutUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllAboutUs = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const aboutUs = await aboutUsModel.getAllAboutUs();

      return ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_FETCHED_SUCCESSFULLY'),
        aboutUs,
      );
    } catch (error: any) {
      const source = 'getAllAboutUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAboutUsById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const aboutUs = await aboutUsModel.getAboutUsById(parseInt(id, 10));

      if (!aboutUs) {
        const user = await authHandler(req, res);
        const source = 'getAboutUsById';
        systemLog.createSystemLog(user, 'About Us Not Found', source);
        return ResponseHandler.badRequest(res, i18n.__('ABOUT_US_NOT_FOUND'));
      }

      return ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_FETCHED_SUCCESSFULLY'),
        aboutUs,
      );
    } catch (error: any) {
      const source = 'getAboutUsById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateAboutUs = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const updatedAboutU = await aboutUsModel.updateAboutUs(
        parseInt(id, 10),
        pageData,
      );

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_UPDATED_SUCCESSFULLY'),
        updatedAboutU,
      );
      const action = 'updateAboutUs';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateAboutUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteAboutUs = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const deletedAboutUs = await aboutUsModel.deleteAboutUs(parseInt(id, 10));

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_DELETED_SUCCESSFULLY'),
        deletedAboutUs,
      );
      const action = 'deleteAboutUs';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteAboutUs';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
