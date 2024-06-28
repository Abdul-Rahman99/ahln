/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import BoxImageModel from '../../models/box/box.image.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { BoxImage } from '../../types/box.image.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const boxImageModel = new BoxImageModel();
export const createBoxImage = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newBoxImage: BoxImage = req.body;
      const createdBoxImage = await boxImageModel.createBoxImage(newBoxImage);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_CREATED_SUCCESSFULLY'),
        createdBoxImage,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_IMAGE_CREATION_FAILED'),
        error.message,
      );
    }
  },
);

export const getAllBoxImages = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { date, deliveryPackageId, boxId } = req.query;
      const boxImages = await boxImageModel.getMany({
        date: date as string,
        deliveryPackageId: deliveryPackageId
          ? Number(deliveryPackageId)
          : undefined,
        boxId: boxId as string,
      });
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_IMAGES_RETRIEVAL_FAILED'),
        error.message,
      );
    }
  },
);

export const getBoxImageById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { date, deliveryPackageId, boxId } = req.query;
      const boxImage = await boxImageModel.getOne({
        id: Number(id),
        date: date as string,
        deliveryPackageId: deliveryPackageId
          ? Number(deliveryPackageId)
          : undefined,
        boxId: boxId as string,
      });
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'),
        boxImage,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_IMAGE_RETRIEVAL_FAILED'),
        error.message,
      );
    }
  },
);

export const updateBoxImage = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const boxImageData: Partial<BoxImage> = req.body;
      const updatedBoxImage = await boxImageModel.updateOne(
        boxImageData,
        Number(id),
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'),
        updatedBoxImage,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_IMAGE_UPDATE_FAILED'),
        error.message,
      );
    }
  },
);

export const deleteBoxImage = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxImageId = req.params.id;
      const deletedBoxImage = await boxImageModel.deleteOne(Number(boxImageId));
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_DELETED_SUCCESSFULLY'),
        deletedBoxImage,
      );
    } catch (error: any) {
      ResponseHandler.internalError(
        res,
        i18n.__('BOX_IMAGE_DELETION_FAILED'),
        error.message,
      );
    }
  },
);
