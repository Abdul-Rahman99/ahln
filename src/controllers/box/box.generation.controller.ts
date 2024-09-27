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
import BoxModel from '../../models/box/box.model';

const boxModel = new BoxModel();
const systemLog = new SystemLogModel();
const boxGenerationModel = new BoxGenerationModel();
const auditTrail = new AuditTrailModel();

export const createBoxGeneration = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }
    try {
      const newBoxGeneration: BoxGeneration = req.body;

      const boxGenerationExists = await boxGenerationModel.modelNameExists(
        newBoxGeneration.model_name,
      );
      if (boxGenerationExists) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('MODEL_NAME_ALREADY_EXISTS'),
        );
      }

      const createdBoxGeneration =
        await boxGenerationModel.createBoxGeneration(newBoxGeneration);

      const action = 'createBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_CREATED_SUCCESSFULLY'),
        createdBoxGeneration,
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
    if (user === '0') {
      return user;
    }

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
    if (user === '0') {
      return user;
    }
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
    if (user === '0') {
      return user;
    }

    try {
      const boxGenerationId = req.params.id;
      const boxGenerationData: BoxGeneration = req.body;

      const modelNameExists = await boxGenerationModel.findModelNameById(
        boxGenerationData.id,
      );

      if (modelNameExists !== boxGenerationData.model_name) {
        const boxGenerationExists = await boxGenerationModel.modelNameExists(
          boxGenerationData.model_name,
        );
        if (boxGenerationExists) {
          return ResponseHandler.badRequest(
            res,
            i18n.__('MODEL_NAME_ALREADY_EXISTS'),
          );
        }
      }

      const updatedBoxGeneration = await boxGenerationModel.updateOne(
        boxGenerationData,
        boxGenerationId,
      );

      const action = 'updateBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_UPDATED_SUCCESSFULLY'),
        updatedBoxGeneration,
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
    if (user === '0') {
      return user;
    }

    try {
      const boxGenerationId = req.params.id;

      // check if the boxGenration associated with any box
      const boxExists = await boxModel.findBoxByBoxGeneration(boxGenerationId);
      if (boxExists) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('BOX_GENERATION_CANNOT_BE_DELETED'),
        );
      }

      const deletedBoxGeneration =
        await boxGenerationModel.deleteOne(boxGenerationId);

      const action = 'deleteBoxGeneration';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_GENERATION_DELETED_SUCCESSFULLY'),
        deletedBoxGeneration,
      );
    } catch (error: any) {
      const source = 'deleteBoxGeneration';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
