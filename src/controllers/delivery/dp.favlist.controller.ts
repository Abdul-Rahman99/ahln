/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import DPFavListModel from '../../models/delivery/dp.favlist.model';
import i18n from '../../config/i18n';
import DeliveryPackageModel from '../../models/delivery/delivery.package.model';
import authHandler from '../../utils/authHandler';

const dpFavListModel = new DPFavListModel();
const deliveryPackageModel = new DeliveryPackageModel();

export const createDPFavList = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const dpFavListData = req.body;
    const del = await deliveryPackageModel.getOne(req.body.delivery_package_id);
    if (!del) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('DELIVERY_PACKAGE_DOES_NOT_EXIST'),
      );
    }

    const fav = await dpFavListModel.getDPFavListById(
      dpFavListData.delivery_package_id,
    );
    if (fav) {
      return ResponseHandler.badRequest(
        res,
        i18n.__('DELIVERY_PACKAGE_ALREADY_EXISTS'),
      );
    }

    const user = await authHandler(req, res, next);

    const newDPFavList = await dpFavListModel.createDPFavList(
      dpFavListData,
      user,
    );
    ResponseHandler.success(
      res,
      i18n.__('FAV_LIST_CREATED_SUCCESSFULLY'),
      newDPFavList,
    );
  } catch (error: any) {
    next(error);
    ResponseHandler.badRequest(res, error.message);
  }
};

// export const getAllDPFavLists = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const dpFavLists = await dpFavListModel.getAllDPFavLists();
//       return ResponseHandler.success(
//         res,
//         i18n.__('FAV_LIST_RETRIEVED_SUCCESSFULLY'),
//         dpFavLists,
//       );
//     } catch (error: any) {  next(error);
//       ResponseHandler.badRequest(res, error.message);
//
//     }
//   },
// );

// export const updateDPFavList = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const { id } = req.params;
//       const dpFavListData = req.body;
//       const updatedDPFavList = await dpFavListModel.updateDPFavList(
//         Number(id),
//         dpFavListData,
//       );
//       return ResponseHandler.success(
//         res,
//         i18n.__('FAV_LIST_UPDATED_SUCCESSFULLY'),
//         updatedDPFavList,
//       );
//     } catch (error: any) {next(error);
//       ResponseHandler.badRequest(res, error.message);
//
//     }
//   },
// );

export const deleteDPFavList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const deletedDPFavList = await dpFavListModel.deleteDPFavList(id);
      return ResponseHandler.success(
        res,
        i18n.__('FAV_LIST_DELETED_SUCCESSFULLY'),
        deletedDPFavList,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getDPFavListsByUser = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Extract token from the request headers
      const user = await authHandler(req, res, next);

      const dpFavLists = await dpFavListModel.getDPFavListsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('DP_FAV_LIST_RETRIEVED_SUCCESS'),
        dpFavLists,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
