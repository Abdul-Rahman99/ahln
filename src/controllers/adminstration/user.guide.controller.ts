/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import UserGuide from '../../models/adminstration/user.guide.model';

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

const userGuideModel = new UserGuide();

export const createUserGuide = asyncHandler(
  async (req: Request, res: Response) => {
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const userGuide = await userGuideModel.createUserGuide(pageData);

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_CREATED_SUCCESSFULLY'),
        userGuide,
      );
      const action = 'createUserGuide';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'createUserGuide';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllUserGuide = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const userGuide = await userGuideModel.getAllUserGuide();

      return ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_FETCHED_SUCCESSFULLY'),
        userGuide,
      );
    } catch (error: any) {
      const source = 'getAllUserGuide';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getUserGuideById = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const userGuide = await userGuideModel.getUserGuideById(parseInt(id, 10));

      if (!userGuide) {
        const user = await authHandler(req, res);
        const source = 'getUserGuideById';
        systemLog.createSystemLog(user, 'About Us Not Found', source);
        return ResponseHandler.badRequest(res, i18n.__('ABOUT_US_NOT_FOUND'));
      }

      return ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_FETCHED_SUCCESSFULLY'),
        userGuide,
      );
    } catch (error: any) {
      const source = 'getUserGuideById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateUserGuide = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const pageData = req.body;
    const user = await authHandler(req, res);

    try {
      const updatedAboutU = await userGuideModel.updateUserGuide(
        parseInt(id, 10),
        pageData,
      );

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_UPDATED_SUCCESSFULLY'),
        updatedAboutU,
      );
      const action = 'updateUserGuide';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateUserGuide';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteUserGuide = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const user = await authHandler(req, res);

    try {
      const deletedUserGuide = await userGuideModel.deleteUserGuide(
        parseInt(id, 10),
      );

      ResponseHandler.success(
        res,
        i18n.__('ABOUT_US_DELETED_SUCCESSFULLY'),
        deletedUserGuide,
      );
      const action = 'deleteUserGuide';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('ABOUT_US_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteUserGuide';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
