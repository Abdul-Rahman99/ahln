/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response, NextFunction } from 'express';
import asyncHandler from '../../middlewares/asyncHandler';
import ResponseHandler from '../../utils/responsesHandler';
import i18n from '../../config/i18n';
import BoxImageModel from '../../models/box/box.image.model';
import { uploadSingleImage } from '../../middlewares/uploadSingleImage';
// import UserModel from '../../models/users/user.model';

const boxImageModel = new BoxImageModel();
// const userModel = new UserModel();

export const uploadBoxImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    uploadSingleImage('image')(req, res, async (err: any) => {
      if (err) {
        return ResponseHandler.badRequest(res, err.message);
      }
      if (!req.file) {
        return ResponseHandler.badRequest(res, i18n.__('NO_FILE_PROVIDED'));
      }

      const { boxId, deliveryPackageId } = req.body;
      const imageName = req.file.filename;

      try {
        const createdBoxImage = await boxImageModel.createBoxImage(
          boxId,
          deliveryPackageId,
          imageName,
        );
        ResponseHandler.success(
          res,
          i18n.__('IMAGE_UPLOADED_SUCCESSFULLY'),
          createdBoxImage,
        );
      } catch (error: any) {
        next(error);
        ResponseHandler.badRequest(res, error.message);
      }
    });
  },
);

export const getAllBoxImages = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxImages = await boxImageModel.getAllBoxImages();
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getBoxImageById = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxImageId = parseInt(req.params.id, 10);
      const boxImage = await boxImageModel.getBoxImageById(boxImageId);
      if (!boxImage) {
        return ResponseHandler.badRequest(res, i18n.__('BOX_IMAGE_NOT_FOUND'));
      }
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_RETRIEVED_SUCCESSFULLY'),
        boxImage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const updateBoxImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxImageId = parseInt(req.params.id, 10);
      const { boxId, deliveryPackageId } = req.body;
      const imageName = req.file ? req.file.filename : req.body.image;

      const updatedBoxImage = await boxImageModel.updateBoxImage(
        boxImageId,
        boxId,
        deliveryPackageId,
        imageName,
      );
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGE_UPDATED_SUCCESSFULLY'),
        updatedBoxImage,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const deleteBoxImage = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxImageId = parseInt(req.params.id, 10);
      await boxImageModel.deleteBoxImage(boxImageId);
      ResponseHandler.success(res, i18n.__('BOX_IMAGE_DELETED_SUCCESSFULLY'));
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

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
//        next(error);
//       ResponseHandler.badRequest(
//         res,
//         error.message,
//       );
//
//     }
//   },
// );

export const getBoxImagesByBoxId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const boxId = req.params.boxId;
      const boxImages = await boxImageModel.getBoxImagesByBoxId(boxId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);

export const getBoxImagesByPackageId = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const packageId = req.params.packageId;
      const boxImages = await boxImageModel.getBoxImagesByPackageId(packageId);
      ResponseHandler.success(
        res,
        i18n.__('BOX_IMAGES_RETRIEVED_SUCCESSFULLY'),
        boxImages,
      );
    } catch (error: any) {
      next(error);
      ResponseHandler.badRequest(res, error.message);
    }
  },
);
