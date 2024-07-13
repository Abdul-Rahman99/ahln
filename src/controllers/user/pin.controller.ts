// import { Request, Response, NextFunction } from 'express';
// import asyncHandler from '../../middlewares/asyncHandler';
// import { PIN } from '../../types/pin.type';
// import i18n from '../../config/i18n';
// import ResponseHandler from '../../utils/responsesHandler';
// import PINModel from '../../models/users/pin.model';
// import authHandler from '../../utils/authHandler';
// import BoxModel from '../../models/box/box.model';

// const boxModel = new BoxModel();
// const pinModel = new PINModel();

// export const createPin = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const newPin: PIN = req.body;
//       const user = await authHandler(req, res, next);
//       const boxExist = await boxModel.getOne(newPin.box_id);
//       if (!boxExist) {
//         return ResponseHandler.badRequest(res, i18n.__('BOX_ID_INVALID'));
//       }
//       const createdPin = await pinModel.createPIN(newPin, user);
//       ResponseHandler.success(
//         res,
//         i18n.__('PIN_CREATED_SUCCESSFULLY'),
//         createdPin,
//       );
//     } catch (error) {
//       next(error);
//       ResponseHandler.badRequest(res, (error as Error).message);
//     }
//   },
// );

// export const getAllPinByUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const user = await authHandler(req, res, next);
//       const pins = await pinModel.getAllPinByUser(user);
//       ResponseHandler.success(
//         res,
//         i18n.__('PINS_RETRIEVED_SUCCESSFULLY'),
//         pins,
//       );
//     } catch (error) {
//       next(error);
//       ResponseHandler.badRequest(res, (error as Error).message);
//     }
//   },
// );

// export const getOnePinByUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const pinId = parseInt(req.params.id, 10);
//       const user = await authHandler(req, res, next);
//       const pin = await pinModel.getOnePinByUser(pinId, user);
//       ResponseHandler.success(res, i18n.__('PIN_RETRIEVED_SUCCESSFULLY'), pin);
//     } catch (error) {
//       next(error);
//       ResponseHandler.badRequest(res, (error as Error).message);
//     }
//   },
// );

// export const deleteOnePinByUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const pinId = parseInt(req.params.id, 10);
//       const user = await authHandler(req, res, next);
//       const pin = await pinModel.deleteOnePinByUser(pinId, user);
//       ResponseHandler.success(res, i18n.__('PIN_DELETED_SUCCESSFULLY'), pin);
//     } catch (error) {
//       next(error);
//       ResponseHandler.badRequest(res, (error as Error).message);
//     }
//   },
// );

// export const updateOnePinByUser = asyncHandler(
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const pinId = parseInt(req.params.id, 10);
//       const user = await authHandler(req, res, next);
//       const pinData: Partial<PIN> = req.body;
//       const pin = await pinModel.updatePinByUser(pinData, pinId, user);
//       ResponseHandler.success(res, i18n.__('PIN_UPDATED_SUCCESSFULLY'), pin);
//     } catch (error) {
//       next(error);
//       ResponseHandler.badRequest(res, (error as Error).message);
//     }
//   },
// );
