/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import BoxGenerationModel from '../../models/box/box.generation.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { BoxGeneration } from '../../types/box.generation.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
const auditTrail = new AuditTrailModel();

import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
const systemLog = new SystemLogModel();

const boxGenerationModel = new BoxGenerationModel();

export const createBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newBoxGeneration: BoxGeneration = req.body;
      const createdBoxGeneration =
        await boxGenerationModel.createBoxGeneration(newBoxGeneration);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
        createdBoxGeneration,
      );
      const auditUser = await authHandler(req, res);
      const action = 'createBoxGeneration';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'createBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllBoxGenerations = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxGenerations = await boxGenerationModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATIONS_RETRIEVED_SUCCESSFULLY'),
        boxGenerations,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getAllBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getBoxGenerationById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxGenerationId = req.params.id;
      const boxGeneration = await boxGenerationModel.getOne(boxGenerationId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_RETRIEVED_SUCCESSFULLY'),
        boxGeneration,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getBoxGenerationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxGenerationId = req.params.id;
      const boxGenerationData: Partial<BoxGeneration> = req.body;
      const updatedBoxGeneration = await boxGenerationModel.updateOne(
        boxGenerationData,
        boxGenerationId,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        updatedBoxGeneration,
      );
      const auditUser = await authHandler(req, res);
      const action = 'updateBoxGeneration';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'updateBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxGenerationId = req.params.id;
      const deletedBoxGeneration =
        await boxGenerationModel.deleteOne(boxGenerationId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
        deletedBoxGeneration,
      );
      const auditUser = await authHandler(req, res);
      const action = 'deleteBoxGeneration';
      auditTrail.createAuditTrail(
        auditUser,
        action,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'deleteBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
