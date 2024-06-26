import { Request, Response } from 'express';
import TabletModel from '../../models/box/tablet.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Tablet } from '../../types/tablet.type';
import i18n from '../../config/i18n';
import ResponseHandler from '../../utils/responsesHandler';

const tabletModel = new TabletModel();

export const createTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const newTablet: Tablet = req.body;
      const createdTablet = await tabletModel.createTablet(newTablet);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_CREATED_SUCCESSFULLY'),
        createdTablet,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('TABLET_CREATION_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const getAllTablets = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tablets = await tabletModel.getMany();
      ResponseHandler.success(
        res,
        i18n.__('TABLETS_RETRIEVED_SUCCESSFULLY'),
        tablets,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('TABLETS_RETRIEVAL_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const getTabletById = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const tablet = await tabletModel.getOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RETRIEVED_SUCCESSFULLY'),
        tablet,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('TABLET_RETRIEVAL_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const updateTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const tabletData: Partial<Tablet> = req.body;
      const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
        updatedTablet,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('TABLET_UPDATE_FAILED'),
        (error as Error).message,
      );
    }
  },
);

export const deleteTablet = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const tabletId = req.params.id;
      const deletedTablet = await tabletModel.deleteOne(tabletId);
      ResponseHandler.success(
        res,
        i18n.__('TABLET_DELETED_SUCCESSFULLY'),
        deletedTablet,
      );
    } catch (error) {
      ResponseHandler.success(
        res,
        i18n.__('TABLET_DELETION_FAILED'),
        (error as Error).message,
      );
    }
  },
);
