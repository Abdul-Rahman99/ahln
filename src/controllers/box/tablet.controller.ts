import { Request, Response } from 'express';
import TabletModel from '../../models/box/tablet.model';
import asyncHandler from '../../middlewares/asyncHandler';
import { Tablet } from '../../types/tablet.type';
import i18n from '../../config/i18n';

const tabletModel = new TabletModel();

export const createTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const newTablet: Tablet = req.body;
    const createdTablet = await tabletModel.createTablet(newTablet);
    res.status(201).json({
      success: true,
      message: i18n.__('TABLET_CREATED_SUCCESSFULLY'),
      data: createdTablet,
    });
  },
);

export const getAllTablets = asyncHandler(
  async (req: Request, res: Response) => {
    const tablets = await tabletModel.getMany();
    res.json({ success: true, data: tablets });
  },
);

export const getTabletById = asyncHandler(
  async (req: Request, res: Response) => {
    const tabletId = req.params.id;
    const tablet = await tabletModel.getOne(tabletId);
    res.json({ success: true, tablet });
  },
);

export const updateTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const tabletId = req.params.id;
    const tabletData: Partial<Tablet> = req.body;
    const updatedTablet = await tabletModel.updateOne(tabletData, tabletId);
    res.json({
      message: i18n.__('TABLET_UPDATED_SUCCESSFULLY'),
      data: updatedTablet,
      success: true,
    });
  },
);

export const deleteTablet = asyncHandler(
  async (req: Request, res: Response) => {
    const tabletId = req.params.id;
    const deletedTablet = await tabletModel.deleteOne(tabletId);
    res.json({
      message: i18n.__('TABLET_DELETED_SUCCESSFULLY'),
      data: deletedTablet,
      success: true,
    });
  },
);
