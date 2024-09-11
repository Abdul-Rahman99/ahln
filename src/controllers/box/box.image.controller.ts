/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import BoxImageModel from '../../models/box/box.image.model';
import { uploadSingleImage } from '../../middlewares/uploadSingleImage';
import AuditTrailModel from '../../models/logs/audit.trail.model';
import NotificationModel from '../../models/logs/notification.model';
import SystemLogModel from '../../models/logs/system.log.model';
import authHandler from '../../utils/authHandler';
import UserDevicesModel from '../../models/users/user.devices.model';
import UserModel from '../../models/users/user.model';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

const userModel = new UserModel();
const userDevicesModel = new UserDevicesModel();
const auditTrail = new AuditTrailModel();
const notificationModel = new NotificationModel();
const systemLog = new SystemLogModel();
const boxImageModel = new BoxImageModel();

export const uploadBoxImage = asyncHandler(
  async (req: Request, res: Response) => {
    uploadSingleImage('image')(req, res, async (err: any) => {
      const user = await authHandler(req, res);

      if (err) {
        const source = 'uploadBoxImage';
        systemLog.createSystemLog(user, (err as Error).message, source);
        return ResponseHandler.badRequest(res, err.message);
      }
      // if (!req.file) {
      //   const source = 'uploadBoxImage';
      //   systemLog.createSystemLog(user, 'No File Provided', source);
      //   return ResponseHandler.badRequest(res, i18n.__('NO_FILE_PROVIDED'));
      // }

      const { boxId, deliveryPackageId } = req.body;
      const base64Image = req.body.image;

      try {
        const buffer = Buffer.from(
          base64Image.replace(/^data:image\/\w+;base64,/, ''),
          'base64',
        );
        const imageName = `image-${moment().format('YYYYMMDD_HHmmss')}${path.extname(base64Image)}.png`;
        fs.promises.writeFile(`uploads/${imageName}`, buffer);

        const createdBoxImage = await boxImageModel.createBoxImage(
          boxId,
          deliveryPackageId,
          imageName,
        );

        notificationModel.createNotification(
          'uploadBoxImage',
          i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'),
          imageName,
          user,
          boxId,
        );

        const action = 'uploadSingleImage';
        auditTrail.createAuditTrail(
          user,
          action,
          i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'),
          boxId,
        );

        if (!boxId) {
          return ResponseHandler.badRequest(res, i18n.__('NO_BOX_ID_PROVIDED'));
        }
        const userFcm = await userModel.findUserByBoxId(boxId);

        const fcmToken =
          await userDevicesModel.getFcmTokenDevicesByUser(userFcm);
        console.log('BBB');

        try {
          notificationModel.pushNotification(
            fcmToken,
            i18n.__('DELIVERY_MAN_ARRIEVED'),
            i18n.__('DELIVERY_MAN_TRIES_TO_OPEN_BOX'),
          );
          console.log('CCC');

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } catch (error: any) {
          const source = 'updateRelativeCustomer';
          systemLog.createSystemLog(
            user,
            i18n.__('ERROR_CREATING_NOTIFICATION', ' ', error.message),
            source,
          );
        }
        ResponseHandler.success(
          res,
          i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'),
          createdBoxImage,
        );
      } catch (error: any) {
        const source = 'uploadBoxImage';
        systemLog.createSystemLog(user, (error as Error).message, source);
        ResponseHandler.badRequest(res, error.message);
        // next(error);
      }
    });
  },
);

export const getAllBoxImages = asyncHandler(
  async (req: Request, res: Response) => {
    const user = await authHandler(req, res);
    const boxId = req.body.box_id;
    try {
      const boxImages = await boxImageModel.getAllBoxImages(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      const source = 'getAllBoxImages';
      systemLog.createSystemLog(user, (error as Error).message, source);
      // next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const user = await authHandler(req, res);

  try {
    const boxImages = await boxImageModel.getAll();
    ResponseHandler.success(
      res,
      i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
      boxImages,
    );
  } catch (error: any) {
    const source = 'getAll';
    systemLog.createSystemLog(user, (error as Error).message, source);
    // next(error);
    ResponseHandler.badRequest(res, error.message);
  }
});

// export const getBoxImageById = asyncHandler(
//   async (req: Request, res: Response) => {
//     const user = await authHandler(req, res);

//     try {
//       const boxImageId = parseInt(req.params.id, 10);
//       const boxImage = await boxImageModel.getBoxImageById(boxImageId);
//       if (!boxImage) {
//         const source = 'getBoxImageById';
//         systemLog.createSystemLog(user, 'Box Image Not Found', source);
//         return ResponseHandler.badRequest(res, i18n.__('BOX_IMAGE_NOT_FOUND'));
//       }
//       ResponseHandler.success(
//         res,
//         i18n.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'),
//         boxImage,
//       );
//     } catch (error: any) {
//       const source = 'getBoxImageById';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       // next(error);
//       ResponseHandler.badRequest(res, error.message);
//     }
//   },
// );

// export const updateBoxImage = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const boxImageId = parseInt(req.params.id, 10);
//       const { boxId, deliveryPackageId } = req.body;
//       const imageName = req.file ? req.file.filename : req.body.image;

//       const updatedBoxImage = await boxImageModel.updateBoxImage(
//         boxImageId,
//         boxId,
//         deliveryPackageId,
//         imageName,
//       );
//       ResponseHandler.success(
//         res,
//         i18n.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'),
//         updatedBoxImage,
//       );
//       const auditUser = await authHandler(req, res);
//       const action = 'updateBoxImage';
//       auditTrail.createAuditTrail(
//         auditUser,
//         action,
//         i18n.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'),
//       );
//     } catch (error: any) {
//       const user = await authHandler(req, res);
//       const source = 'updateBoxImage';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       // next(error);
//       ResponseHandler.badRequest(res, error.message);
//     }
//   },
// );

// export const deleteBoxImage = asyncHandler(
//   async (req: Request, res: Response) => {
//     try {
//       const boxImageId = parseInt(req.params.id, 10);
//       await boxImageModel.deleteBoxImage(boxImageId);
//       ResponseHandler.success(res, i18n.__('BOX_IMAGE_DELETED_SUCCESSFULLY'));
//       const auditUser = await authHandler(req, res);
//       const action = 'deleteBoxImage';
//       auditTrail.createAuditTrail(
//         auditUser,
//         action,
//         i18n.__('BOX_IMAGE_DELETED_SUCCESSFULLY'),
//       );
//     } catch (error: any) {
//       const user = await authHandler(req, res);
//       const source = 'deleteBoxImage';
//       systemLog.createSystemLog(user, (error as Error).message, source);
//       // next(error);
//       ResponseHandler.badRequest(res, error.message);
//     }
//   },
// );

// export const getBoxImagesByUser = asyncHandler(
//   async (req: Request, res: Response, next:NextFunction) => {
//     try {
//       const token = req.headers.authorization?.replace('Bearer ', '');
//       if (!token) {
//         return ResponseHandler.badRequest(res, i18n.__('TOKEN_NOT_PROVIDED'));
//       }

//       const user = await userModel.findByToken(token);
//       if (!user) {
//         return ResponseHandler.badRequest(res, i18n.__('INVALID_TOKEN'));
//       }

//       const boxImages = await boxImageModel.getBoxImagesByUser(user);
//       ResponseHandler.success(
//         res,
//         i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
//         boxImages,
//       );
//     } catch (error: any) {
//  const user = await authHandler(req, res);
//  const source = 'getBoxImagesByUser';
//  systemLog.createSystemLog(user, (error as Error).message, source);
//       ResponseHandler.badRequest(
//        // next(error);
//         res,
//         error.message,
//       );
//
//     }
//   },
// );

export const getBoxImagesByBoxId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const boxId = req.params.boxId;
      const boxImages = await boxImageModel.getBoxImagesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getBoxImagesByBoxId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      // next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getBoxImagesByPackageId = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const packageId = req.params.packageId;
      const boxImages = await boxImageModel.getBoxImagesByPackageId(packageId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      const user = await authHandler(req, res);
      const source = 'getBoxImagesByPackageId';
      systemLog.createSystemLog(user, (error as Error).message, source);
      // next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
