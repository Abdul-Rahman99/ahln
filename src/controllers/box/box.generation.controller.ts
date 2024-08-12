/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import BoxGenerationModel from '../../models/box/box.generation.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { BoxGeneration } from '../../types/box.generation.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import authHandler from '../../utils/authHandler';
import SystemLogModel from '../../models/logs/system.log.model';

const systemLog = new SystemLogModel();
const boxGenerationModel = new BoxGenerationModel();
const auditTrail = new AuditTrailModel();

export const createBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const newBoxGeneration: BoxGeneration = req.body;
      const createdBoxGeneration =
        await boxGenerationModel.createBoxGeneration(newBoxGeneration);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
        createdBoxGeneration,
      );
      const action = 'createBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'createBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getAllBoxGenerations = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxGenerations = await boxGenerationModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATIONS_RETRIEVED_SUCCESSFULLY'),
        boxGenerations,
      );
    } catch (error: any) {
      const source = 'getAllBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getBoxGenerationById = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const boxGenerationId = req.params.id;
      const boxGeneration = await boxGenerationModel.getOne(boxGenerationId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_RETRIEVED_SUCCESSFULLY'),
        boxGeneration,
      );
    } catch (error: any) {
      const source = 'getBoxGenerationById';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const updateBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

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
      const action = 'updateBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const deleteBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxGenerationId = req.params.id;
      const deletedBoxGeneration =
        await boxGenerationModel.deleteOne(boxGenerationId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
        deletedBoxGeneration,
      );
      const action = 'deleteBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'deleteBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// update has outside camera
export const updateHasOutsideCameraStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxGenerationId = req.params.id;
      const hasOutsideCamera = req.body.has_outside_camera;
      const updatedBoxGeneration =
        await boxGenerationModel.updateHasOutsideCameraStatus(
          hasOutsideCamera,
          boxGenerationId,
        );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        updatedBoxGeneration,
      );
      const action = 'updateHasOutsideCamera';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateHasOutsideCamera';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// update has inside camera
export const updateHasInsideCameraStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    try {
      const boxGenerationId = req.params.id;
      const hasInsideCamera = req.body.has_inside_camera;
      const updatedBoxGeneration =
        await boxGenerationModel.updateHasInsideCameraStatus(
          hasInsideCamera,
          boxGenerationId,
        );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        updatedBoxGeneration,
      );
      const action = 'updateHasInsideCamera';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateHasInsideCamera';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

// update tablet status
export const updateHasTabletStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);

    try {
      const boxGenerationId = req.params.id;
      const tabletStatus = req.body.has_tablet;
      const updatedBoxGeneration =
        await boxGenerationModel.updateHasTabletStatus(
          tabletStatus,
          boxGenerationId,
        );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        updatedBoxGeneration,
      );
      const action = 'updateTabletStatus';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
      );
    } catch (error: any) {
      const source = 'updateTabletStatus';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
