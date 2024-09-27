/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import DPFavListModel from '../../models/delivery/dp.favlist.model';
import i18n from '../../config/i18n';
import DeliveryPackageModel from '../../models/delivery/delivery.package.model';
import authHandler from '../../utils/authHandler';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import SystemLogModel from '../../models/logs/system.log.model';

const auditTrail = new AuditTrailModel();
const systemLog = new SystemLogModel();
const dpFavListModel = new DPFavListModel();
const deliveryPackageModel = new DeliveryPackageModel();

export const createDPFavList = async (req: Request, res: Response) => {
  const user = await authHandler(req, res);
  if (user === '0') {
    return user;
  }

  try {
    const dpFavListData = req.body;
    const del = await deliveryPackageModel.getOne(req.body.delivery_package_id);
    if (!del) {
      const source = 'createDPFavList';
      systemLog.createSystemLog(
        user,
        'Delivery Package Does Not Exist',
        source,
      );
      return ResponseHandler.badRequest(
        res,
        i18n.__('DELIVERY_PACKAGE_DOES_NOT_EXIST'),
      );
    }

    const fav = await dpFavListModel.getDPFavListById(
      dpFavListData.delivery_package_id,
    );
    if (fav) {
      const source = 'createDPFavList';
      systemLog.createSystemLog(user, 'Delivery Package Already Exist', source);
      return ResponseHandler.badRequest(
        res,
        i18n.__('DELIVERY_PACKAGE_ALREADY_EXISTS'),
      );
    }

    const newDPFavList = await dpFavListModel.createDPFavList(
      dpFavListData,
      user,
    );

    const action = 'createDPFavList';
    auditTrail.createAuditTrail(
      user,
      action,
      i18n.__('FAV_LIST_CREATED_SUCCESSFULLY'),
      null,
    );
    ResponseHandler.success(
      res,
      i18n.__('FAV_LIST_CREATED_SUCCESSFULLY'),
      newDPFavList,
    );
  } catch (error: any) {
    const source = 'createDPFavList';
    systemLog.createSystemLog(user, (error as Error).message, source);
    ResponseHandler.badRequest(res, error.message);
    // next(error);
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
//     } catch (error: any) {  // next(error);
// const user = await authHandler(req, res);
// if (user === '0') {
//   return user;
// }
// const source = 'getAllDPFavLists';
// systemLog.createSystemLog(user, (error as Error).message, source);
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
//     } catch (error: any) {// next(error);
// const user = await authHandler(req, res);
// if (user === '0') {
//   return user;
// }
// const source = 'updateDPFavList';
// systemLog.createSystemLog(user, (error as Error).message, source);
//       ResponseHandler.badRequest(res, error.message);
//
//     }
//   },
// );

export const deleteDPFavList = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const { id } = req.params;
      const deletedDPFavList = await dpFavListModel.deleteDPFavList(id);

      const action = 'deleteDPFavList';
      auditTrail.createAuditTrail(
        user,
        action,
        i18n.__('FAV_LIST_DELETED_SUCCESSFULLY'),
        null,
      );
      ResponseHandler.success(
        res,
        i18n.__('FAV_LIST_DELETED_SUCCESSFULLY'),
        deletedDPFavList,
      );
    } catch (error: any) {
      const source = 'deleteDPFavList';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);

export const getDPFavListsByUser = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    if (user === '0') {
      return user;
    }

    try {
      const dpFavLists = await dpFavListModel.getDPFavListsByUser(user);
      ResponseHandler.success(
        res,
        i18n.__('DP_FAV_LIST_RETRIEVED_SUCCESS'),
        dpFavLists,
      );
    } catch (error: any) {
      const source = 'getDPFavListByUser';
      systemLog.createSystemLog(user, (error as Error).message, source);
      ResponseHandler.badRequest(res, error.message);
      // next(error);
    }
  },
);
