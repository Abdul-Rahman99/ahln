/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import BoxGenerationModel from '../../models/box/box.generation.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { BoxGeneration } from '../../types/box.generation.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

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
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_GENERATION_CREATION_FAILED'),
        error.message,
      );
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
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_GENERATIONS_RETRIEVAL_FAILED'),
        error.message,
      );
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
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_GENERATION_RETRIEVAL_FAILED'),
        error.message,
      );
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
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_GENERATION_UPDATE_FAILED'),
        error.message,
      );
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
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_GENERATION_DELETION_FAILED'),
        error.message,
      );
    }
  },
);
