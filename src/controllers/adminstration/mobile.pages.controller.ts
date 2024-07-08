/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';

import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import MobilePagesModel from '../../models/adminstration/mobile.pages.model';

const mobilePagesModel = new MobilePagesModel();

export const createMobilePage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const pageData = req.body;

    try {
      const mobilePage = await mobilePagesModel.createMobilePage(pageData);

      ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_CREATED_SUCCESSFULLY'),
        mobilePage,
      );
    } catch (error: any) {
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAllMobilePages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mobilePages = await mobilePagesModel.getAllMobilePages();

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGES_FETCHED_SUCCESSFULLY'),
        mobilePages,
      );
    } catch (error: any) {
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getMobilePageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const mobilePage = await mobilePagesModel.getMobilePageById(
        parseInt(id, 10),
      );

      if (!mobilePage) {
        return ResponseHandler.badRequest(
          res,
          i18n.__('MOBILE_PAGE_NOT_FOUND'),
        );
      }

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_FETCHED_SUCCESSFULLY'),
        mobilePage,
      );
    } catch (error: any) {
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateMobilePage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const pageData = req.body;

    try {
      const updatedMobilePage = await mobilePagesModel.updateMobilePage(
        parseInt(id, 10),
        pageData,
      );

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_UPDATED_SUCCESSFULLY'),
        updatedMobilePage,
      );
    } catch (error: any) {
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteMobilePage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    try {
      const deletedMobilePage = await mobilePagesModel.deleteMobilePage(
        parseInt(id, 10),
      );

      return ResponseHandler.success(
        res,
        i18n.__('MOBILE_PAGE_DELETED_SUCCESSFULLY'),
        deletedMobilePage,
      );
    } catch (error: any) {
      next(error);
      return ResponseHandler.badRequest(res, error.message);
    }
  },
);
