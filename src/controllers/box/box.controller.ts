import { Request, Response } from 'express';
import BoxModel from '../../models/box/box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Box } from '../../types/box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const boxModel = new BoxModel();

export const createBox = asyncHandler(async (req: Request, res: Response) => {
  try {
    const newBox: Box = req.body;
    const createdBox = await boxModel.createBox(newBox);
    ResponseHandler.success(
      res,
      i18n.__('BOX_CREATED_SUCCESSFULLY'),
      createdBox,
    );
  } catch (error) {
    ResponseHandler.internalError(
      res,
      i18n.__('BOX_CREATION_FAILED'),
      (error as Error).message,
    );
  }
});

export const getAllBoxes = asyncHandler(async (req: Request, res: Response) => {
  try {
    const boxes = await boxModel.getMany();
    ResponseHandler.success(
      res,
      i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
      boxes,
    );
  } catch (error) {
    ResponseHandler.internalError(
      res,
      i18n.__('BOXES_RETRIEVAL_FAILED'),
      (error as Error).message,
    );
  }
});

export const getBoxById = asyncHandler(async (req: Request, res: Response) => {
  try {
    const boxId = req.params.id;
    const box = await boxModel.getOne(boxId);
    ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
  } catch (error) {
    ResponseHandler.internalError(
      res,
      i18n.__('BOX_RETRIEVAL_FAILED'),
      (error as Error).message,
    );
  }
});

export const updateBox = asyncHandler(async (req: Request, res: Response) => {
  try {
    const boxId = req.params.id;
    const boxData: Partial<Box> = req.body;
    const updatedBox = await boxModel.updateOne(boxData, boxId);
    ResponseHandler.success(
      res,
      i18n.__('BOX_UPDATED_SUCCESSFULLY'),
      updatedBox,
    );
  } catch (error) {
    ResponseHandler.internalError(
      res,
      i18n.__('BOX_UPDATE_FAILED'),
      (error as Error).message,
    );
  }
});

export const deleteBox = asyncHandler(async (req: Request, res: Response) => {
  try {
    const boxId = req.params.id;
    const deletedBox = await boxModel.deleteOne(boxId);
    ResponseHandler.success(
      res,
      i18n.__('BOX_DELETED_SUCCESSFULLY'),
      deletedBox,
    );
  } catch (error) {
    ResponseHandler.internalError(
      res,
      i18n.__('BOX_DELETION_FAILED'),
      (error as Error).message,
    );
  }
});

export const getBoxesByGenerationId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxGenerationId = req.params.generationId;
      const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);

      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOXES_GENERATION_FETCH_FAILED'),
        (error as Error).message,
      );
    }
  },
);
