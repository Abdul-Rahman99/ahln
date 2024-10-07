/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import VersionsModel from '../../models/adminstration/versions.model';
import { Versions } from '../../types/versions.type';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';
const systemLog = new SystemLogModel();
const versionsModel = new VersionsModel();
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

export const createVersions = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const newVersions: Versions = req.body;

      const createdVersions = await versionsModel.createVersions(newVersions);

      const auditUser = await authHandler(req, res);
      const action = 'createVersions';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('VERIONS_CREATED'),
        null,
      );
      ResponseHandler.success(res, i18n.__('VERIONS_CREATED'), createdVersions);
    } catch (error: any) {
      const source = 'createVersions';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllVersions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const versions = await versionsModel.getAllVersions();
      return ResponseHandler.success(
        res,
        i18n.__('VERIONS_RETRIEVED_SUCCESSFULLY'),
        versions,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      if (user === '0') {
        return user;
      }
      const source = 'getAllVersions';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getOneVersions = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const versionsId = parseInt(req.params.id, 10);
      const versions = await versionsModel.getCitiesByCountryId(
        Number(versionsId),
      );
      return ResponseHandler.success(
        res,
        i18n.__('VERIONS_RETRIEVED_SUCCESSFULLY'),
        versions,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      if (user === '0') {
        return user;
      }
      const source = 'getOneVersions';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateVersions = asyncHandler(
  async (req: Request, res: Response) => {
    const auditUser = await authHandler(req, res);
    try {
      const versionsId = parseInt(req.params.id, 10);
      const versionsData: Partial<Versions> = req.body;
      const updatedVersions = await versionsModel.updateVersions(
        versionsId,
        versionsData,
      );

      const action = 'updateVersions';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('VERIONS_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('VERIONS_UPDATED_SUCCESSFULLY'),
        updatedVersions,
      );
    } catch (error) {
      const user = await authHandler(req, res);
      if (user === '0') {
        return user;
      }
      const source = 'updateVersions';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);

export const deleteVersions = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const versionsId = parseInt(req.params.id, 10);
      const deletedVersions = await versionsModel.deleteVersions(versionsId);

      const action = 'deleteVersions';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('VERIONS_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('VERIONS_DELETED_SUCCESSFULLY'),
        deletedVersions,
      );
    } catch (error) {
      const source = 'deleteVersions';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, (error as Error).message);
      // next(error);
    }
  },
);
