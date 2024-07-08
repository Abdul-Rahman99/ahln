import { Request, Response, NextFunction } from 'express';
import BoxModel from '../../models/box/box.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Box } from '../../types/box.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const boxModel = new BoxModel();

export const createBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newBox: Box = req.body;
      const createdBox = await boxModel.createBox(newBox);
      ResponseHandler.success(
        res,
        i18n.__('BOX_CREATED_SUCCESSFULLY'),
        createdBox,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getAllBoxes = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxes = await boxModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getBoxById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.id;
      const box = await boxModel.getOne(boxId);
      ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const updateBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
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
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const deleteBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.id;
      const deletedBox = await boxModel.deleteOne(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_DELETED_SUCCESSFULLY'),
        deletedBox,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getBoxesByGenerationId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxGenerationId = req.params.generationId;
      const boxes = await boxModel.getBoxesByGenerationId(boxGenerationId);

      ResponseHandler.success(
        res,
        i18n.__('BOXES_RETRIEVED_SUCCESSFULLY'),
        boxes,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const getBoxByTabletInfo = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { androidTabletId, tabletSerialNumber } = req.body;
      const box = await boxModel.getBoxByTabletInfo(
        androidTabletId,
        tabletSerialNumber,
      );
      ResponseHandler.success(res, i18n.__('BOX_RETRIEVED_SUCCESSFULLY'), box);
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const assignTabletToBox = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tabletId, boxId } = req.body;
      const assignTabletToBox = await boxModel.assignTabletToBox(
        tabletId,
        boxId,
      );
      ResponseHandler.success(
        res,
        i18n.__('TABLET_ASSIGNED_TO_BOX_SUCCESSFULLY'),
        assignTabletToBox,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);

export const resetTabletId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { tabletId, boxId } = req.body;
      const assignTabletToBox = await boxModel.resetTabletId(tabletId, boxId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RESET_TO_BOX_SUCCESSFULLY'),
        assignTabletToBox,
      );
    } catch (error) {
      next(error);
      ResponseHandler.badRequest(res, (error as Error).message);
    }
  },
);
